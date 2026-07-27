"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import Reveal from "./Reveal";
import Starfield from "./Starfield";
import { FAQ_ITEMS } from "@/lib/content";

const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative overflow-hidden bg-surface py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue/40 to-transparent"
        aria-hidden="true"
      />

      {/* Ночное небо: мерцающие звёзды + дрейфующие туманности в акцентных цветах */}
      <Starfield />
      <div
        className="pointer-events-none absolute -left-[10%] top-[12%] h-[420px] w-[420px] animate-drift rounded-full bg-accent-blue/[0.07] blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-[8%] bottom-[8%] h-[380px] w-[380px] animate-drift-alt rounded-full bg-accent-violet/[0.08] blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 animate-float-slow rounded-full bg-accent-blue/[0.04] blur-[150px]"
        aria-hidden="true"
      />

      <div className="container-section relative max-w-3xl">
        <Reveal className="text-center">
          <h2 className="section-title">Часто задаваемые вопросы</h2>
        </Reveal>

        <div className="mt-12 space-y-4">
          {FAQ_ITEMS.map((item, i) => {
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
                    <motion.span
                      className="shrink-0 text-primary-light"
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: EASE_PREMIUM }}
                      aria-hidden="true"
                    >
                      <FiChevronDown size={20} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE_PREMIUM }}
                      >
                        <p className="px-6 pb-5 leading-relaxed text-slate-400">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
