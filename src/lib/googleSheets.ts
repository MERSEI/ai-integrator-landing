/**
 * Запись лидов в Google Sheets через Service Account (JWT, RS256), без googleapis —
 * два fetch-запроса: обмен подписанного JWT на access_token, потом values.append.
 *
 * Настройка (см. .env.example):
 * 1. Создать Service Account в Google Cloud, включить Google Sheets API,
 *    сгенерировать JSON-ключ.
 * 2. Расшарить таблицу на email сервис-аккаунта (роль Editor).
 * 3. GOOGLE_SHEETS_ID — id из URL таблицы.
 *    GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY — из JSON-ключа.
 */

import { createSign } from "crypto";
import type { Lead } from "./leads";

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function getAccessToken(): Promise<string | null> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!email || !rawKey) return null;

  const privateKey = rawKey.includes("\\n") ? rawKey.replace(/\\n/g, "\n") : rawKey;
  const now = Math.floor(Date.now() / 1000);

  const header = { alg: "RS256", typ: "JWT" };
  const claims = {
    iss: email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claims))}`;

  let signature: string;
  try {
    const signer = createSign("RSA-SHA256");
    signer.update(unsigned);
    signer.end();
    signature = base64url(signer.sign(privateKey));
  } catch (e) {
    console.error("[sheets] JWT signing failed (проверьте GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY):", e);
    return null;
  }

  const jwt = `${unsigned}.${signature}`;

  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error("[sheets] token exchange failed:", await res.text().catch(() => ""));
      return null;
    }
    const json = (await res.json()) as { access_token?: string };
    return json.access_token ?? null;
  } catch (e) {
    console.error("[sheets] token exchange request failed:", e);
    return null;
  }
}

/** Best-effort: ошибки только логируются, форму не роняют. */
export async function appendLeadRow(lead: Lead): Promise<void> {
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  if (!sheetId) return;

  const token = await getAccessToken();
  if (!token) return;

  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: [[lead.ts, lead.email, lead.name ?? "", lead.company ?? "", lead.source ?? ""]],
        }),
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!res.ok) {
      console.error("[sheets] append failed:", await res.text().catch(() => ""));
    }
  } catch (e) {
    console.error("[sheets] append request failed:", e);
  }
}
