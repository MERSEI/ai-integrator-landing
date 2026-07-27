/**
 * Запись лидов в Google Sheets через Apps Script Web App.
 *
 * Почему так, а не через Service Account: Apps Script-скрипт живёт внутри самой
 * таблицы и уже имеет к ней доступ — не нужен проект в Google Cloud, включение
 * Sheets API, сервис-аккаунт и расшаривание. На стороне сайта нужна ровно одна
 * переменная окружения с URL веб-приложения.
 *
 * Настройка (см. docs/google-sheets-setup.md):
 * 1. В таблице: Расширения → Apps Script, вставить код из инструкции.
 * 2. Deploy → New deployment → Web app, доступ "Anyone".
 * 3. Скопировать URL деплоя в GOOGLE_SHEETS_WEBHOOK_URL (Vercel env).
 */

import type { Lead } from "./leads";

/** Best-effort: ошибки только логируются, форму не роняют. */
export async function appendLeadRow(lead: Lead): Promise<void> {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;

  if (!url) {
    console.warn(
      "[sheets] GOOGLE_SHEETS_WEBHOOK_URL не задан — лид не записан в таблицу:",
      lead.email
    );
    return;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, secret }),
      // Apps Script отвечает 302 на итоговый script.googleusercontent.com —
      // fetch по умолчанию следует за редиректом, это ожидаемо.
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.error(
        "[sheets] запись не удалась:",
        res.status,
        await res.text().catch(() => "")
      );
      return;
    }

    const text = await res.text().catch(() => "");
    if (text && !text.includes("ok")) {
      console.error("[sheets] неожиданный ответ Apps Script:", text.slice(0, 200));
    }
  } catch (e) {
    console.error("[sheets] запрос к Apps Script упал:", e);
  }
}
