"use client";

import { useEffect, useRef, useState } from "react";
import { FiSend, FiRotateCcw, FiAlertCircle, FiArrowRight } from "react-icons/fi";
import { TbSparkles } from "react-icons/tb";
import Reveal from "./Reveal";
import { getContent } from "@/lib/content";
import { trackEvent } from "@/lib/gtag";
import type { Locale } from "@/lib/i18n";

type Msg = { role: "user" | "model"; content: string };

const EXAMPLES: Record<string, string[]> = {
  ru: [
    "Сколько стоит внедрение и как быстро окупится?",
    "У нас интернет-магазин, 200 заявок в месяц. Что вы предложите?",
    "Чем ваш агент лучше обычного чат-бота?",
  ],
  en: [
    "How much is a deployment and how fast does it pay off?",
    "We run an online store with 200 leads a month. What would you suggest?",
    "How is your agent better than a regular chatbot?",
  ],
};

/**
 * Мини-плейграунд агента на лендинге. Показать работу движка убедительнее,
 * чем описать её: посетитель задаёт свой вопрос и видит реальный ответ той же
 * модели, что стоит на внедрении, — без регистрации и без перехода на
 * отдельную страницу инструмента.
 */
export default function LiveAgentDemo({ locale }: { locale: Locale }) {
  const t = getContent(locale).liveDemo;
  const [roleKey, setRoleKey] = useState(t.roles[0].key);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Прокручиваем только сам тред, не страницу — иначе секция «прыгает»
    // под пользователем на каждом ответе.
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || loading) return;

    const next: Msg[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);
    trackEvent("live_demo_message", { role: roleKey, turn: next.length });

    try {
      const res = await fetch("/api/agentdemo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: roleKey, messages: next, locale }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "");
        return;
      }
      setMessages([...next, { role: "model", content: json.reply }]);
    } catch {
      setError("");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMessages([]);
    setError(null);
    setInput("");
  };

  return (
    <section
      id="live-demo"
      className="relative overflow-hidden bg-surface py-20 [content-visibility:auto] [contain-intrinsic-size:auto_800px] sm:py-28"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-24 top-32 h-72 w-72 rounded-full bg-accent/15 blur-[120px]"
        aria-hidden="true"
      />
      <div className="container-section relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent-blue">
            <TbSparkles size={14} aria-hidden="true" />
            {t.badge}
          </p>
          <h2 className="section-title mt-4">{t.title}</h2>
          <p className="mt-4 text-lg text-secondary">{t.subtitle}</p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-10 max-w-3xl">
          <div className="card-glass p-5 sm:p-6">
            {/* Роль агента: один и тот же движок в разных сценариях */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-sm text-secondary">{t.roleLabel}</span>
              {t.roles.map((role) => (
                <button
                  key={role.key}
                  type="button"
                  onClick={() => {
                    setRoleKey(role.key);
                    reset();
                  }}
                  aria-pressed={roleKey === role.key}
                  className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    roleKey === role.key
                      ? "border-accent bg-accent/15 text-primary"
                      : "border-white/10 bg-white/[0.03] text-secondary hover:border-white/20 hover:text-primary"
                  }`}
                >
                  {role.label}
                </button>
              ))}
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  className="ml-auto flex cursor-pointer items-center gap-1.5 text-xs font-medium text-secondary transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <FiRotateCcw size={13} aria-hidden="true" />
                  {t.reset}
                </button>
              )}
            </div>

            <div
              ref={threadRef}
              className="mt-4 max-h-80 min-h-[11rem] overflow-y-auto rounded-lg border border-white/[0.06] bg-dark/60 p-4"
              aria-live="polite"
              aria-atomic="false"
            >
              {messages.length === 0 && !loading && (
                <p className="py-8 text-center text-sm text-secondary">{t.emptyState}</p>
              )}
              <div className="space-y-3">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <p
                      className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-accent/20 text-primary ring-1 ring-inset ring-accent/30"
                          : "bg-white/[0.05] text-primary-light ring-1 ring-inset ring-white/10"
                      }`}
                    >
                      {m.content}
                    </p>
                  </div>
                ))}
                {loading && (
                  <p className="flex items-center gap-2 text-sm text-secondary">
                    <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent-blue" />
                    {t.thinking}
                  </p>
                )}
              </div>
            </div>

            {error !== null && (
              <p
                role="alert"
                className="mt-3 flex items-start gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300"
              >
                <FiAlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                {error || t.disclaimer}
              </p>
            )}

            <form
              className="mt-4 flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <label htmlFor="live-demo-input" className="sr-only">
                {t.placeholder}
              </label>
              <input
                id="live-demo-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder}
                maxLength={600}
                className="min-h-11 w-full flex-1 rounded-md border border-white/10 bg-white/[0.03] px-4 py-2.5 text-primary placeholder-secondary/70 transition-colors duration-200 ease-premium hover:border-white/20 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/35"
              />
              <button
                type="submit"
                disabled={loading || input.trim().length === 0}
                className="btn-primary shrink-0"
              >
                <FiSend size={16} aria-hidden="true" />
                {t.send}
              </button>
            </form>

            {messages.length === 0 && (
              <div className="mt-3">
                <p className="text-xs text-secondary">{t.examplesLabel}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(EXAMPLES[locale] ?? EXAMPLES.ru).map((example) => (
                    <button
                      key={example}
                      type="button"
                      onClick={() => send(example)}
                      className="cursor-pointer rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-primary-light transition-colors duration-200 hover:border-accent/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-3 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-secondary">{t.disclaimer}</p>
              <a href="#final-cta" className="btn-secondary shrink-0 text-sm">
                {t.cta}
                <FiArrowRight size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
