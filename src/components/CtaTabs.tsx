"use client";

import { useState } from "react";
import { FiCalendar, FiMail } from "./icons";
import BookingForm from "./BookingForm";
import EmailForm from "./EmailForm";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

type Tab = "email" | "call";

/**
 * Два входа в одну воронку: быстрый (оставить email) и точный (выбрать время
 * созвона). Email-форма остаётся вкладкой по умолчанию — на ней собран весь
 * текущий поток лидов, и календарь не должен становиться лишним барьером для
 * тех, кто готов просто оставить адрес.
 */
export default function CtaTabs({
  locale,
  source,
  cta,
  /** Узкий контейнер (карточка калькулятора): формы идут одной колонкой и без своей рамки. */
  compact = false,
  note,
}: {
  locale: Locale;
  source: string;
  cta: string;
  compact?: boolean;
  /** Контекст заявки (посчитанный ROI, тариф, ниша) — уходит с любой из вкладок. */
  note?: string;
}) {
  const content = getContent(locale);
  const t = content.booking;
  const [tab, setTab] = useState<Tab>("email");

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "email", label: t.tabEmail, icon: <FiMail aria-hidden="true" /> },
    { key: "call", label: t.tabCall, icon: <FiCalendar aria-hidden="true" /> },
  ];

  return (
    <div className="w-full">
      <div
        role="tablist"
        aria-label={t.title}
        className={`flex w-fit gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] p-1 ${
          compact ? "" : "mx-auto"
        }`}
      >
        {tabs.map(({ key, label, icon }) => (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={tab === key}
            aria-controls={`cta-panel-${key}-${source}`}
            onClick={() => setTab(key)}
            className={`flex min-h-9 items-center gap-2 rounded-full px-4 text-sm transition-colors duration-200 ease-premium ${
              tab === key
                ? "bg-accent font-medium text-white"
                : "text-primary-light hover:text-primary"
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {tab === "email" ? (
        <div
          id={`cta-panel-email-${source}`}
          role="tabpanel"
          className={`mt-5 flex w-full ${compact ? "" : "justify-center"}`}
        >
          <EmailForm
            locale={locale}
            cta={cta}
            source={source}
            stacked={compact}
            note={note}
          />
        </div>
      ) : (
        <div id={`cta-panel-call-${source}`} role="tabpanel" className="mt-5">
          {!compact && (
            <p className="mx-auto max-w-xl text-center text-sm text-slate-400">
              {t.subtitle}
            </p>
          )}
          <div className={compact ? "" : "mt-5"}>
            <BookingForm
              locale={locale}
              source={`${source}-call`}
              compact={compact}
              contextNote={note}
            />
          </div>
        </div>
      )}
    </div>
  );
}
