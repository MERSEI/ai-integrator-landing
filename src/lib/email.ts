/**
 * Автоответ лиду сразу после отправки формы — приглашение на бесплатный
 * аудит. Отправка через Resend REST API (fetch, без SDK — тот же подход,
 * что и у Mailchimp/Gemini в этом проекте).
 *
 * Best-effort: без RESEND_API_KEY просто не отправляет и логирует
 * предупреждение — лид всё равно сохранён (Upstash/Sheets) и передан в
 * Mailchimp, форма не должна падать из-за почты.
 */

import { CONTACTS } from "./content";

const AUDIT_EMAIL_SUBJECT = "AI Integrator Free Audit";

const AUDIT_EMAIL_TEXT = `Thanks for requesting a free audit on AI Integrator. I'm Oleksandr —
I'll help you find where AI fits into your sales and marketing, and
what it's actually worth in revenue.

To make this specific to your business instead of generic advice,
could you answer three quick questions? A single line each is plenty:

1. What does your business do, and who are your customers?
2. What's the biggest pain right now — not enough inbound leads,
   sales depending entirely on you, content, something else?
3. How do leads reach you and get handled today? Ads, cold email,
   referrals? Do they live in a CRM or a spreadsheet?

Then, whichever suits you better:

— Reply here and I'll send the written audit within 24 hours, or
— We hop on a 15-minute call and go through it live — faster, and
  you can ask questions as we go.

If a call works: does Thursday after 3pm or Friday morning suit you
better (CET)? If neither, send a time that does and I'll work
around it.

Best,
Oleksandr
AI Integrator`;

export async function sendAuditRequestEmail(to: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[email] RESEND_API_KEY не настроен — автоответ лиду не отправлен. См. docs/resend-setup.md."
    );
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "AI Integrator <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: CONTACTS.email,
        subject: AUDIT_EMAIL_SUBJECT,
        text: AUDIT_EMAIL_TEXT,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      console.error("[email] Resend error:", err);
    }
  } catch (e) {
    console.error("[email] Resend request failed:", e);
  }
}
