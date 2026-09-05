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
import { BOOKING_DURATION_MIN } from "./booking";
import type { ContactChannel } from "./contactChannel";

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

const CHANNEL_NAMES: Record<Exclude<ContactChannel, "email">, string> = {
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  phone: "phone",
};

/**
 * Подтверждаем выбранный канал прямо в письме: лид видит, что его выбор
 * услышан, и знает, где ждать ответа. Для канала "email" ничего не добавляем —
 * письмо и так пришло туда.
 */
function channelNote(channel: ContactChannel, contact: string): string {
  if (channel === "email" || !contact) return "";
  return `\n\nYou asked to be contacted via ${CHANNEL_NAMES[channel]} (${contact}) — I'll reach out there as well.`;
}

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

export type LeadDetails = {
  email: string;
  /** Форма, с которой пришёл лид: hero, calculator, final-cta. */
  source?: string;
  /** Что человек выбрал в селекте «что автоматизировать». */
  interest?: string;
  /** Куда лид просил ответить. По умолчанию — на тот же email. */
  channel?: ContactChannel;
  contact?: string;
  /** Контекст заявки: расчёт калькулятора, тариф, ниша. */
  note?: string;
};

function ownerLeadText(lead: LeadDetails): string {
  return `Новый лид с формы.

Email:      ${lead.email}
Форма:      ${lead.source || "—"}
Интерес:    ${lead.interest || "—"}
Канал:      ${lead.channel && lead.contact ? `${lead.channel} — ${lead.contact}` : "email"}
Контекст:   ${lead.note || "—"}

Автоответ с приглашением на аудит уже ушёл на этот адрес.`;
}

/**
 * Два письма на заявку: приглашение лиду и уведомление владельцу. Без второго
 * о лиде можно узнать только заглянув в таблицу — а туда никто не смотрит
 * ежедневно, и заявка остывает.
 */
export async function sendAuditRequestEmail(lead: LeadDetails): Promise<void> {
  const tx = getTransporter();
  if (!tx) {
    console.warn(
      "[email] GMAIL_ADDRESS/GMAIL_APP_PASSWORD не настроены — автоответ лиду не отправлен. См. docs/gmail-smtp-setup.md."
    );
    return;
  }

  const from = `"AI Integrator" <${process.env.GMAIL_ADDRESS}>`;

  const results = await Promise.allSettled([
    tx.sendMail({
      from,
      to: lead.email,
      replyTo: CONTACTS.email,
      subject: AUDIT_EMAIL_SUBJECT,
      text: AUDIT_EMAIL_TEXT + channelNote(lead.channel ?? "email", lead.contact ?? ""),
    }),
    tx.sendMail({
      from,
      to: CONTACTS.email,
      // Ответ уходит прямо лиду: письмо себе работает как начало переписки.
      replyTo: lead.email,
      subject: `Лид: ${lead.email}${lead.source ? ` — ${lead.source}` : ""}`,
      text: ownerLeadText(lead),
    }),
  ]);

  for (const r of results) {
    if (r.status === "rejected") {
      console.error("[email] письмо о лиде не ушло:", r.reason);
    }
  }
}

// ── Заявка на созвон ────────────────────────────────────────────────

export type BookingDetails = {
  email: string;
  /** Момент созвона в UTC (ISO). */
  slot: string;
  /** IANA-пояс лида — в нём он выбирал время, в нём же должен видеть его в письме. */
  timezone: string;
  channel: ContactChannel;
  contact: string;
  note?: string;
  interest?: string;
  locale: string;
};

/** Наш пояс: письмо себе всегда в пражском времени, чтобы не пересчитывать в уме. */
const OWNER_TIMEZONE = "Europe/Prague";

function formatIn(slot: string, timezone: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "ru-RU", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: timezone,
    }).format(new Date(slot));
  } catch {
    // Невалидный IANA-пояс из браузера лида не должен ронять письмо.
    return new Date(slot).toISOString();
  }
}

function leadBookingText(b: BookingDetails): { subject: string; text: string } {
  const when = formatIn(b.slot, b.timezone, b.locale);

  if (b.locale === "en") {
    return {
      subject: `Call booked — ${when}`,
      text: `Thanks for booking a call.

When: ${when} (${b.timezone}), ${BOOKING_DURATION_MIN} minutes.
How we connect: ${b.channel} — ${b.contact}

I'm Oleksandr. Before we talk, two lines from you would make the call
much more useful: what your business does, and what hurts most right
now — not enough inbound leads, sales depending entirely on you,
content, something else.

Just reply to this email. If plans change, reply here or ping me on
Telegram (${CONTACTS.telegram}) and we'll move it.

Best,
Oleksandr
AI Integrator`,
    };
  }

  return {
    subject: `Созвон забронирован — ${when}`,
    text: `Спасибо за заявку на созвон.

Когда: ${when} (${b.timezone}), ${BOOKING_DURATION_MIN} минут.
Как свяжемся: ${b.channel} — ${b.contact}

Меня зовут Александр. Чтобы созвон был по делу, ответьте парой строк
прямо на это письмо: чем занимается бизнес и что болит сильнее всего —
мало входящих заявок, продажи держатся только на вас, контент или
что-то другое.

Если планы поменяются — ответьте на это письмо или напишите в Telegram
(${CONTACTS.telegram}), перенесём.

Хорошего дня,
Александр
AI Integrator`,
  };
}

function ownerBookingText(b: BookingDetails): string {
  return `Новая заявка на созвон.

Когда (его время):  ${formatIn(b.slot, b.timezone, "ru")} — ${b.timezone}
Когда (Прага):      ${formatIn(b.slot, OWNER_TIMEZONE, "ru")}
Email:              ${b.email}
Способ связи:       ${b.channel} — ${b.contact}
Интерес:            ${b.interest || "—"}
Комментарий:        ${b.note || "—"}`;
}

/**
 * Два письма на одну бронь: подтверждение лиду и уведомление себе. Оба
 * best-effort — заявка уже сохранена в Upstash/Sheets, падать из-за SMTP
 * форма не должна.
 */
export async function sendBookingEmails(b: BookingDetails): Promise<void> {
  const tx = getTransporter();
  if (!tx) {
    console.warn(
      "[email] GMAIL_ADDRESS/GMAIL_APP_PASSWORD не настроены — подтверждение созвона не отправлено:",
      b.email,
      b.slot
    );
    return;
  }

  const lead = leadBookingText(b);
  const from = `"AI Integrator" <${process.env.GMAIL_ADDRESS}>`;

  const results = await Promise.allSettled([
    tx.sendMail({
      from,
      to: b.email,
      replyTo: CONTACTS.email,
      subject: lead.subject,
      text: lead.text,
    }),
    tx.sendMail({
      from,
      to: CONTACTS.email,
      replyTo: b.email,
      subject: `Созвон: ${formatIn(b.slot, OWNER_TIMEZONE, "ru")} — ${b.email}`,
      text: ownerBookingText(b),
    }),
  ]);

  for (const r of results) {
    if (r.status === "rejected") {
      console.error("[email] письмо о созвоне не ушло:", r.reason);
    }
  }
}
