"use client";

import { useState } from "react";
import { FiCalendar, FiMail } from "react-icons/fi";
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
export default function CtaTabs({ locale }: { locale: Locale }) {
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
        className="mx-auto flex w-fit gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] p-1"
      >
        {tabs.map(({ key, label, icon }) => (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={tab === key}
            aria-controls={`cta-panel-${key}`}
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
          id="cta-panel-email"
          role="tabpanel"
          className="mt-6 flex w-full justify-center"
        >
          <EmailForm locale={locale} cta={content.finalCta.cta} source="final-cta" />
        </div>
      ) : (
        <div id="cta-panel-call" role="tabpanel" className="mt-6">
          <p className="mx-auto max-w-xl text-center text-sm text-slate-400">
            {t.subtitle}
          </p>
          <div className="mt-5">
            <BookingForm locale={locale} source="final-cta-call" />
          </div>
        </div>
      )}
    </div>
  );
}
