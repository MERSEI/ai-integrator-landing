"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { FiChevronDown } from "./icons";

export default function FAQSection({ locale }: { locale: Locale }) {
  const t = getContent(locale).faq;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-surface py-20 [content-visibility:auto] [contain-intrinsic-size:auto_900px] sm:py-28"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />

      <div className="container-section relative max-w-3xl">
        <Reveal className="text-center">
          <h2 className="section-title">{t.title}</h2>
        </Reveal>

        <div className="mt-12 space-y-4">
          {t.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal key={item.question} delay={i * 0.05}>
                <div
                  className={`overflow-hidden card-glass transition-colors duration-300 ${
                    isOpen ? "border-primary-light/30" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="flex min-h-12 w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left font-heading font-bold text-white transition-colors duration-200 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-light"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                  >
                    {item.question}
                    <span
                      className={`shrink-0 text-primary-light transition-transform duration-300 ease-premium ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    >
                      <FiChevronDown size={20} />
                    </span>
                  </button>
                  {/* Панель остаётся в DOM: так работает aria-controls и
                      поиск по странице находит закрытые ответы. */}
                  <div
                    id={`faq-panel-${i}`}
                    className={`collapse ${isOpen ? "collapse-open" : ""}`}
                    aria-hidden={!isOpen}
                  >
                    <div>
                      <p className="px-6 pb-5 leading-relaxed text-secondary">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
