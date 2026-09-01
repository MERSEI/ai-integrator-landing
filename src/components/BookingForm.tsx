"use client";

import { useEffect, useMemo, useState } from "react";
import { FiCheck, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  availableSlots,
  BOOKING_DURATION_MIN,
  CONTACT_CHANNELS,
  dayKey,
  isBookableDay,
  monthGrid,
  slotToDate,
  type ContactChannel,
} from "@/lib/booking";
import { getContent } from "@/lib/content";
import { trackLeadConversion } from "@/lib/gtag";
import type { Locale } from "@/lib/i18n";

/** Канал по умолчанию — Telegram: быстрее почты и это наш основной канал связи. */
const DEFAULT_CHANNEL: ContactChannel = "telegram";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function intlLocale(locale: Locale): string {
  return locale === "en" ? "en-GB" : "ru-RU";
}

const inputClass =
  "min-h-11 w-full rounded-md border border-white/10 bg-white/[0.03] px-4 py-2.5 text-primary placeholder-secondary/70 transition-colors duration-200 ease-premium hover:border-white/20 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/35";

/** Общий вид «чипа»-переключателя: дни, слоты и каналы связи выглядят одинаково. */
function chipClass(selected: boolean): string {
  return selected
    ? "bg-accent font-medium text-white"
    : "border border-white/10 text-primary hover:border-accent/60 hover:bg-accent/10";
}

export default function BookingForm({
  locale,
  source,
}: {
  locale: Locale;
  source: string;
}) {
  const content = getContent(locale);
  const t = content.booking;
  const f = content.form;
  const interestOptions = content.categories.filter((cat) => cat.key !== "all");

  /**
   * Календарь считается от текущего момента, а он на сервере и в браузере
   * разный — сетку рендерим только после монтирования, иначе гидрация ругается
   * на несовпадение разметки.
   */
  const [now, setNow] = useState<Date | null>(null);
  const [month, setMonth] = useState<{ year: number; month: number } | null>(null);
  useEffect(() => {
    const today = new Date();
    setNow(today);
    setMonth({ year: today.getFullYear(), month: today.getMonth() });
  }, []);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [channel, setChannel] = useState<ContactChannel>(DEFAULT_CHANNEL);
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [interest, setInterest] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState<string | null>(null);

  const days = useMemo(
    () => (month ? monthGrid(month.year, month.month) : []),
    [month]
  );
  const slots = useMemo(
    () => (selectedDay && now ? availableSlots(selectedDay, now) : []),
    [selectedDay, now]
  );

  const timezone =
    typeof Intl !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : "UTC";

  const formatMoment = (date: Date) =>
    new Intl.DateTimeFormat(intlLocale(locale), {
      dateStyle: "long",
      timeStyle: "short",
    }).format(date);

  // Русский Intl отдаёт «сентябрь 2026 г.» — CSS-capitalize поднял бы и «Г.»,
  // поэтому поднимаем только первую букву.
  const monthLabel = month
    ? (() => {
        const raw = new Intl.DateTimeFormat(intlLocale(locale), {
          month: "long",
          year: "numeric",
        }).format(new Date(month.year, month.month, 1));
        return raw.charAt(0).toUpperCase() + raw.slice(1);
      })()
    : null;

  // Назад дальше текущего месяца листать незачем: там нечего бронировать.
  const canGoBack =
    !!month &&
    !!now &&
    (month.year > now.getFullYear() ||
      (month.year === now.getFullYear() && month.month > now.getMonth()));

  const shiftMonth = (delta: number) =>
    setMonth((prev) => {
      if (!prev) return prev;
      const next = new Date(prev.year, prev.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedDay || !selectedSlot) {
      setError(t.slotRequired);
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError(f.invalid);
      return;
    }
    if (channel !== "email" && contact.trim() === "") {
      setError(t.contactRequired);
      return;
    }

    const moment = slotToDate(selectedDay, selectedSlot);
    setSubmitting(true);
    try {
      const res = await fetch("/api/book-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          slot: moment.toISOString(),
          timezone,
          channel,
          contact: contact.trim(),
          interest,
          note: note.trim(),
          source,
          locale,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? f.genericError);
        return;
      }
      trackLeadConversion(source);
      setBooked(formatMoment(moment));
    } catch {
      setError(f.networkError);
    } finally {
      setSubmitting(false);
    }
  };

  if (booked) {
    return (
      <div className="card-glass mx-auto w-full max-w-3xl p-6 text-left sm:p-8">
        <p className="flex items-center gap-2 font-heading text-lg font-semibold text-primary">
          <FiCheck className="shrink-0 text-success" aria-hidden="true" />
          {t.successTitle.replace("{datetime}", booked)}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">{t.successText}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="card-glass mx-auto w-full max-w-3xl p-5 text-left sm:p-6"
      noValidate
    >
      <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_160px]">
        {/* Календарь */}
        <div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-secondary">
              {t.stepDate}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label={t.prevMonth}
                disabled={!canGoBack}
                onClick={() => shiftMonth(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-primary transition-colors duration-200 ease-premium hover:border-white/25 disabled:opacity-30 disabled:hover:border-white/10"
              >
                <FiChevronLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={t.nextMonth}
                onClick={() => shiftMonth(1)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-primary transition-colors duration-200 ease-premium hover:border-white/25"
              >
                <FiChevronRight aria-hidden="true" />
              </button>
            </div>
          </div>

          <p className="mt-3 font-heading text-sm font-medium text-primary">
            {monthLabel ?? " "}
          </p>

          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] text-secondary">
            {t.weekdays.map((day) => (
              <span key={day} className="py-1">
                {day}
              </span>
            ))}
          </div>

          {/* Заглушка высоты до монтирования: без неё карточка прыгает на первом рендере. */}
          {days.length === 0 ? (
            <div className="mt-1 h-[232px]" aria-hidden="true" />
          ) : (
            <div className="mt-1 grid grid-cols-7 gap-1">
              {days.map((day) => {
                const key = dayKey(day);
                const inMonth = month !== null && day.getMonth() === month.month;
                const bookable =
                  !!now &&
                  inMonth &&
                  isBookableDay(day, now) &&
                  availableSlots(key, now).length > 0;
                const selected = key === selectedDay;
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={!bookable}
                    aria-pressed={selected}
                    onClick={() => {
                      setSelectedDay(key);
                      setSelectedSlot(null);
                      setError(null);
                    }}
                    className={`flex h-9 items-center justify-center rounded-md text-sm transition-colors duration-200 ease-premium ${
                      bookable || selected ? chipClass(selected) : "text-secondary/35"
                    }`}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Слоты выбранного дня */}
        <div className="sm:border-l sm:border-white/[0.08] sm:pl-5">
          <p className="text-xs font-medium uppercase tracking-wider text-secondary">
            {t.stepTime}
          </p>
          <p className="mt-3 text-[11px] leading-snug text-secondary">
            {t.timezoneNote}
            <br />
            {timezone}
          </p>

          {!selectedDay && <p className="mt-3 text-sm text-slate-500">{t.pickDateFirst}</p>}
          {selectedDay && slots.length === 0 && (
            <p className="mt-3 text-sm text-slate-500">{t.noSlots}</p>
          )}

          {slots.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  aria-pressed={slot === selectedSlot}
                  onClick={() => {
                    setSelectedSlot(slot);
                    setError(null);
                  }}
                  className={`min-h-9 rounded-md px-2 text-sm transition-colors duration-200 ease-premium ${chipClass(
                    slot === selectedSlot
                  )}`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Контакты и способ связи */}
      <div className="mt-6 border-t border-white/[0.08] pt-5">
        <p className="text-xs font-medium uppercase tracking-wider text-secondary">
          {t.stepContact}
        </p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="booking-email" className="sr-only">
              {f.emailLabel}
            </label>
            <input
              id="booking-email"
              type="email"
              autoComplete="email"
              placeholder={f.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="booking-interest" className="sr-only">
              {f.interestLabel}
            </label>
            <select
              id="booking-interest"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="" className="bg-dark text-slate-400">
                {f.interestPlaceholder}
              </option>
              {interestOptions.map((cat) => (
                <option key={cat.key} value={cat.key} className="bg-dark text-white">
                  {cat.label}
                </option>
              ))}
              <option value="other" className="bg-dark text-white">
                {f.interestOther}
              </option>
            </select>
          </div>
        </div>

        <p className="mt-5 text-sm text-slate-400">{t.channelLabel}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {CONTACT_CHANNELS.map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={key === channel}
              onClick={() => {
                setChannel(key);
                setContact("");
                setError(null);
              }}
              className={`min-h-9 rounded-full px-4 text-sm transition-colors duration-200 ease-premium ${chipClass(
                key === channel
              )}`}
            >
              {t.channels[key]}
            </button>
          ))}
        </div>

        <div className="mt-3">
          <label htmlFor="booking-contact" className="sr-only">
            {t.contactLabels[channel]}
          </label>
          <input
            id="booking-contact"
            type={channel === "email" ? "email" : channel === "telegram" ? "text" : "tel"}
            inputMode={channel === "telegram" || channel === "email" ? "text" : "tel"}
            placeholder={t.contactPlaceholders[channel]}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className={inputClass}
          />
          {channel === "email" && (
            <p className="mt-1.5 text-xs text-slate-500">{t.contactHintEmail}</p>
          )}
        </div>

        <div className="mt-3">
          <label htmlFor="booking-note" className="sr-only">
            {t.noteLabel}
          </label>
          <textarea
            id="booking-note"
            rows={2}
            placeholder={t.notePlaceholder}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={`${inputClass} min-h-0 resize-none`}
          />
        </div>

        {error && (
          <p role="alert" className="mt-3 text-sm text-rose-400">
            {error}
          </p>
        )}

        <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            {t.duration.replace("15", String(BOOKING_DURATION_MIN))}
          </p>
          <button
            type="submit"
            className="btn-primary w-full sm:w-auto"
            disabled={submitting}
          >
            {submitting ? t.submitting : t.submit}
          </button>
        </div>
      </div>
    </form>
  );
}
