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
import type { ContactChannel } from "./contactChannel";

export const LEADS_KEY = "leads:landing";

export type Lead = {
  email: string;
  name?: string;
  company?: string;
  source?: string;
  /** Поля заявки на созвон (форма BookingForm); у обычной подписки их нет. */
  slot?: string;
  timezone?: string;
  /** Где лиду удобнее общаться — выбор из формы. */
  channel?: ContactChannel;
  /** Контакт в выбранном канале: @ник, номер телефона. Для канала "email" пуст. */
  contact?: string;
  /** Ключ категории из селекта «что автоматизировать». */
  interest?: string;
  /** Контекст заявки: посчитанный ROI, тариф, ниша — если форма его собрала. */
  note?: string;
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
  }

  await appendLeadRow(record);

  // Ни одно хранилище не настроено — лид существует только в этой строке лога
  // и пропадёт вместе с ней. Кричим громко, чтобы это не прошло незамеченным.
  if (!creds && !process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
    console.error(
      "[leads] ЛИД НИГДЕ НЕ СОХРАНЁН: не настроены ни Upstash, ни Google Sheets. " +
        "См. docs/google-sheets-setup.md. Данные:",
      record
    );
  }
}
