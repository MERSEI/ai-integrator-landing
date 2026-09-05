"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import CtaTabs from "./CtaTabs";
import type { Locale } from "@/lib/i18n";
import { FiX } from "./icons";

/**
 * Модалка заявки. Живёт отдельно от формы, потому что одна и та же форма
 * встречается и inline (герой, финальный CTA), и в модалке из калькулятора —
 * различается только обвязка: фокус, Esc, блокировка скролла и сводка расчёта.
 *
 * `note` — человекочитаемый контекст заявки (посчитанный ROI, ниша, тариф).
 * Он уходит в лид и в таблицу, чтобы на созвон приходить с готовыми цифрами,
 * а не переспрашивать их заново.
 *
 * Рисуется порталом в body, и это не вкусовщина: секция калькулятора несёт
 * `content-visibility: auto`, а он включает `contain: paint` — внутри такой
 * секции `position: fixed` считается от неё, а не от окна. Модалка тогда
 * растёт вниз за пределы экрана, и до кнопки отправки не долистать.
 */
export default function BookingModal({
  locale,
  open,
  onClose,
  title,
  subtitle,
  summaryTitle,
  summary,
  cta,
  source,
  note,
  closeLabel,
}: {
  locale: Locale;
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  summaryTitle: string;
  /** Строки сводки: слева подпись, справа значение. */
  summary: { label: string; value: ReactNode }[];
  cta: string;
  source: string;
  note: string;
  closeLabel: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // На сервере document нет, поэтому портал появляется только после монтирования.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // Простая ловушка фокуса: Tab не должен уводить на страницу под модалкой.
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex animate-fade-in items-end justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        className="relative my-auto w-full max-w-lg animate-modal-in rounded-xl border border-white/10 bg-surface p-6 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.9)] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
            <div
              className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-accent/25 blur-[120px]"
              aria-hidden="true"
            />
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="absolute right-4 top-4 cursor-pointer rounded-md p-2 text-secondary transition-colors hover:bg-white/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <FiX size={18} aria-hidden="true" />
            </button>

            <div className="relative">
              <h3
                id="booking-modal-title"
                className="pr-10 font-heading text-xl font-bold tracking-tight text-primary"
              >
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary">{subtitle}</p>

              <div className="mt-5 rounded-lg border border-accent-violet/25 bg-accent-violet/[0.07] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-violet">
                  {summaryTitle}
                </p>
                <dl className="mt-3 space-y-1.5">
                  {summary.map((row) => (
                    <div key={row.label} className="flex items-baseline justify-between gap-4 text-sm">
                      <dt className="text-secondary">{row.label}</dt>
                      <dd className="text-right font-medium text-primary">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-6">
                <CtaTabs
                  locale={locale}
                  cta={cta}
                  source={source}
                  note={note}
                  compact
                />
              </div>
            </div>
      </div>
    </div>,
    document.body,
  );
}
