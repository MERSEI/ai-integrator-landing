/**
 * Логика записи на созвон: сетка календаря, доступные слоты и валидация
 * контактов. Вынесено из компонента, потому что этими же правилами проверяет
 * запрос сервер (/api/book-call) — иначе бронь мимо интерфейса прошла бы
 * любую дату, включая прошлое.
 *
 * Часовой пояс: слоты считаются в поясе посетителя, а не в нашем. Так человек
 * видит время, в которое реально свободен, и не ошибается на два часа; IANA-имя
 * пояса уходит вместе с заявкой, поэтому в письме видно и наше время тоже.
 */

import { emailProblem } from "./emailCheck";

/** Рабочие часы по часовому поясу лида. Часовой шаг: полчасовой даёт 20 чипов — стена кнопок. */
export const BOOKING_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
] as const;

/** Дальше этого горизонта записываться бессмысленно — планы меняются. */
export const BOOKING_HORIZON_DAYS = 45;

/** Минимальный запас до созвона: на «через 10 минут» никто не успевает. */
export const BOOKING_LEAD_MINUTES = 120;

/** Длительность созвона в минутах — используется в письмах и подписи формы. */
export const BOOKING_DURATION_MIN = 15;

export const CONTACT_CHANNELS = ["telegram", "email", "phone", "whatsapp"] as const;
export type ContactChannel = (typeof CONTACT_CHANNELS)[number];

export function isContactChannel(value: unknown): value is ContactChannel {
  return (CONTACT_CHANNELS as readonly unknown[]).includes(value);
}

/** Ключ дня в локальном времени: toISOString() здесь нельзя — он сдвигает дату в UTC. */
export function dayKey(date: Date): string {
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/**
 * Шесть недель по семь дней, начиная с понедельника — фиксированная высота
 * сетки, чтобы разметка не прыгала при переключении месяцев.
 */
export function monthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  // getDay(): 0 — воскресенье. Сдвигаем к понедельнику как первому дню недели.
  const offset = (first.getDay() + 6) % 7;
  const start = addDays(first, -offset);
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

/** Созвоны только по будням: выходные обещать не готовы, а «перезвоню в субботу» — худший лид. */
export function isBookableDay(day: Date, now: Date): boolean {
  const weekday = day.getDay();
  if (weekday === 0 || weekday === 6) return false;
  const start = startOfDay(day).getTime();
  if (start < startOfDay(now).getTime()) return false;
  return start <= startOfDay(addDays(now, BOOKING_HORIZON_DAYS)).getTime();
}

/** Дата+слот в локальном времени. `"2026-09-04"` + `"15:00"` → Date. */
export function slotToDate(key: string, slot: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  const [h, min] = slot.split(":").map(Number);
  return new Date(y, m - 1, d, h, min, 0, 0);
}

/** Слоты дня минус те, до которых уже не успеть (сегодняшнее «через час»). */
export function availableSlots(key: string, now: Date): string[] {
  const earliest = now.getTime() + BOOKING_LEAD_MINUTES * 60_000;
  return BOOKING_SLOTS.filter((slot) => slotToDate(key, slot).getTime() >= earliest);
}

/**
 * Серверная проверка присланного момента: валидный ISO, не прошлое и внутри
 * горизонта. Рабочие часы здесь не проверяем — они привязаны к поясу лида,
 * а сервер о нём знает только со слов клиента.
 */
export function isBookableSlotIso(iso: unknown, now: Date): boolean {
  if (typeof iso !== "string" || iso.length < 10) return false;
  const ts = Date.parse(iso);
  if (Number.isNaN(ts)) return false;
  // Небольшой допуск назад: между выбором слота и отправкой формы проходит время.
  if (ts < now.getTime() - 60 * 60_000) return false;
  return ts <= now.getTime() + (BOOKING_HORIZON_DAYS + 1) * 24 * 60 * 60_000;
}

const TELEGRAM_RE = /^@?[a-zA-Z][a-zA-Z0-9_]{3,31}$/;
const PHONE_RE = /^\+?[0-9]{7,15}$/;

/**
 * Приводит контакт к каноничному виду или возвращает null, если формат не
 * похож на выбранный канал. Для канала email контакт необязателен — берём
 * основной email заявки.
 */
export function normalizeContact(
  channel: ContactChannel,
  value: string | undefined,
  email: string
): string | null {
  const raw = (value ?? "").trim();

  // Запасной адрес проверяем той же структурной проверкой, что и основной.
  if (channel === "email") {
    return raw === "" ? email : emailProblem(raw) ? null : raw;
  }
  if (channel === "telegram") {
    return TELEGRAM_RE.test(raw) ? `@${raw.replace(/^@/, "")}` : null;
  }
  const digits = raw.replace(/[\s()-]/g, "");
  return PHONE_RE.test(digits) ? digits : null;
}
