import { NextRequest, NextResponse } from "next/server";
import { checkDailyLimit, checkToolLimit, clientIp } from "@/lib/rate-limit";
import { apiMessage } from "@/lib/apiMessages";
import { outputLanguage, requestLocale } from "@/lib/gemini";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

const GEMINI_MODEL = "gemini-3.1-flash-lite";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/** Роль задаёт только тон и рамку; сам ответ пишет модель. */
const MAX_MESSAGES = 12;
const MAX_CHARS = 600;

type WireMsg = { role: "user" | "model"; content: string };

const hits = new Map<string, { count: number; ts: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.ts > 60_000) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  entry.count += 1;
  return entry.count > 10;
}

/**
 * Мини-плейграунд агента с лендинга: обычный текстовый ответ, без structured
 * output — посетитель должен увидеть живую реплику, а не JSON.
 *
 * Системный промпт берётся из словаря контента по ключу роли, а не из тела
 * запроса: иначе любой желающий мог бы использовать наш ключ модели как
 * бесплатный прокси к произвольному промпту.
 */
export async function POST(req: NextRequest) {
  const rawBody: unknown = await req.json().catch(() => null);
  const locale = requestLocale(rawBody);
  const ip = clientIp(req.headers);

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: apiMessage(locale, "tooManyRequests") },
      { status: 429 },
    );
  }
  const daily = await checkDailyLimit(ip);
  if (!daily.ok) {
    return NextResponse.json({ error: apiMessage(locale, "dailyLimit") }, { status: 429 });
  }
  const toolLimit = await checkToolLimit(ip, "agentdemo");
  if (!toolLimit.ok) {
    return NextResponse.json({ error: apiMessage(locale, "toolLimit") }, { status: 429 });
  }

  if (rawBody === null) {
    return NextResponse.json({ error: apiMessage(locale, "badRequest") }, { status: 400 });
  }
  const body = rawBody as { role?: string; messages?: WireMsg[] };

  // requestLocale отдаёт строку, а словарь принимает только "ru" | "en".
  const contentLocale: Locale = locale === "en" ? "en" : "ru";
  const roles = getContent(contentLocale).liveDemo.roles;
  const role = roles.find((r) => r.key === body.role) ?? roles[0];

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser || firstUser.content.trim().length < 2) {
    return NextResponse.json({ error: apiMessage(locale, "badRequest") }, { status: 400 });
  }
  if (messages.length > MAX_MESSAGES) {
    return NextResponse.json({ error: apiMessage(locale, "chatTooLong") }, { status: 400 });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return NextResponse.json({ error: apiMessage(locale, "noModelKey") }, { status: 500 });
  }

  const contents = messages.map((m) => ({
    role: m.role === "model" ? "model" : "user",
    parts: [{ text: String(m.content ?? "").slice(0, MAX_CHARS) }],
  }));

  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: role.prompt + outputLanguage(locale) }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 400 },
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("[agentdemo] Gemini error:", res.status, errText.slice(0, 300));
      return NextResponse.json({ error: apiMessage(locale, "modelSilent") }, { status: 502 });
    }

    const data = await res.json();
    const reply: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply?.trim()) {
      return NextResponse.json({ error: apiMessage(locale, "modelEmpty") }, { status: 502 });
    }

    return NextResponse.json({ reply: reply.trim(), remaining: toolLimit.remaining });
  } catch (e) {
    console.error("[agentdemo] запрос к модели упал:", e);
    return NextResponse.json({ error: apiMessage(locale, "modelSilent") }, { status: 502 });
  }
}
