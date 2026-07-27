/**
 * Персистентное хранилище лидов с форм лендинга. Два места записи:
 * 1. Upstash Redis (список "leads:landing", LPUSH) — надёжный бэкап и источник
 *    для GET /api/leads.
 * 2. Google Sheets (см. googleSheets.ts) — таблица для ручного просмотра.
 * Оба best-effort и не блокируют друг друга: если один недоступен, лид всё
 * равно попадёт во второй (или хотя бы в лог), форма не падает.
 */

import { upstash, upstashCreds } from "./rate-limit";
import { appendLeadRow } from "./googleSheets";

export const LEADS_KEY = "leads:landing";

export type Lead = {
  email: string;
  name?: string;
  company?: string;
  source?: string;
  ts: string;
};

export async function saveLead(lead: Omit<Lead, "ts">): Promise<void> {
  const record: Lead = { ...lead, ts: new Date().toISOString() };

  const creds = upstashCreds();
  if (creds) {
    try {
      await upstash(creds, ["LPUSH", LEADS_KEY, JSON.stringify(record)]);
    } catch (e) {
      console.error("[leads] не удалось сохранить лид в Upstash:", e, record);
    }
  } else {
    console.log("[leads] Upstash не настроен, лид не сохранён в Redis:", record);
  }

  await appendLeadRow(record);
}
