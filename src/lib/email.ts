/**
 * Автоответ лиду сразу после отправки формы — приглашение на бесплатный
 * аудит. Отправка через Gmail SMTP (nodemailer + App Password с
 * aleksfialko15@gmail.com) — без своего домена Resend/SES не дают слать
 * реальным получателям (только на почту владельца аккаунта), а Gmail
 * работает сразу, с любого адреса.
 *
 * Best-effort: без GMAIL_ADDRESS/GMAIL_APP_PASSWORD просто не отправляет и
 * логирует предупреждение — лид всё равно сохранён (Upstash/Sheets) и
 * передан в Mailchimp, форма не должна падать из-за почты.
 */

import nodemailer, { type Transporter } from "nodemailer";
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

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  const user = process.env.GMAIL_ADDRESS;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }
  return transporter;
}

export async function sendAuditRequestEmail(to: string): Promise<void> {
  const tx = getTransporter();
  if (!tx) {
    console.warn(
      "[email] GMAIL_ADDRESS/GMAIL_APP_PASSWORD не настроены — автоответ лиду не отправлен. См. docs/gmail-smtp-setup.md."
    );
    return;
  }

  try {
    await tx.sendMail({
      from: `"AI Integrator" <${process.env.GMAIL_ADDRESS}>`,
      to,
      replyTo: CONTACTS.email,
      subject: AUDIT_EMAIL_SUBJECT,
      text: AUDIT_EMAIL_TEXT,
    });
  } catch (e) {
    console.error("[email] Gmail SMTP отправка не удалась:", e);
  }
}
