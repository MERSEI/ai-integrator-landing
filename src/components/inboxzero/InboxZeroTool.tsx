"use client";

import { useState } from "react";
import { FiCopy, FiCheck, FiAlertCircle, FiZap, FiInbox } from "react-icons/fi";

type Result = {
  category: string;
  urgency: string;
  needs_reply: boolean;
  summary: string;
  action_items: string[];
  reply: string;
};

const URGENCY_META: Record<string, { label: string; className: string }> = {
  high: { label: "Срочно", className: "text-black ring-white/60 bg-white" },
  medium: { label: "В течение дня", className: "text-white ring-white/30 bg-white/15" },
  low: { label: "Не срочно", className: "text-slate-300 ring-white/15 bg-white/5" },
};

export default function InboxZeroTool() {
  const [email, setEmail] = useState("");
  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);

  const analyze = async () => {
    if (email.trim().length < 20 || loading) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/inboxzero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, instruction }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Что-то пошло не так.");
        return;
      }
      setResult(json as Result);
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  const copyReply = async () => {
    if (!result?.reply) return;
    try {
      await navigator.clipboard.writeText(result.reply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard недоступен */
    }
  };

  const urgency = result ? (URGENCY_META[result.urgency] ?? URGENCY_META.low) : null;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card-glass p-6 sm:p-8">
        <h2 className="font-heading text-lg font-bold text-white">Входящее письмо</h2>
        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="em" className="mb-1.5 block text-sm font-medium text-slate-300">
              Текст письма <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="em"
              rows={9}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Вставьте письмо целиком (можно с темой и подписью)…"
              className="w-full resize-y rounded-md border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition-colors focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label htmlFor="ins" className="mb-1.5 block text-sm font-medium text-slate-300">
              Как ответить <span className="text-slate-500">(необязательно)</span>
            </label>
            <input
              id="ins"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="например: вежливо отказаться / согласиться и предложить звонок в четверг"
              className="min-h-11 w-full rounded-md border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-slate-500 transition-colors focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            type="button"
            onClick={analyze}
            disabled={email.trim().length < 20 || loading}
            className="btn-primary w-full"
          >
            {loading ? (
              "Разбираем…"
            ) : (
              <>
                <FiZap size={18} aria-hidden="true" />
                Разобрать письмо
              </>
            )}
          </button>
        </div>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-rose-300">
            <FiAlertCircle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
            <p>{error}</p>
          </div>
        )}
        {loading && (
          <div className="card-glass flex flex-col items-center justify-center gap-4 p-12 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-primary-light" aria-hidden="true" />
            <p className="text-slate-400">Классифицируем и пишем ответ…</p>
          </div>
        )}
        {!loading && !error && !result && (
          <div className="card-glass flex flex-col items-center justify-center gap-3 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-secondary/25 text-primary-light ring-1 ring-inset ring-white/10">
              <FiInbox size={26} aria-hidden="true" />
            </div>
            <p className="max-w-xs text-slate-400">
              Здесь появятся классификация, суть письма, задачи из него и готовый
              ответ
            </p>
          </div>
        )}
        {!loading && result && urgency && (
          <div className="space-y-5">
            <div className="card-glass p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-primary-light/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-light">
                  {result.category}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${urgency.className}`}>
                  {urgency.label}
                </span>
                {!result.needs_reply && (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-400">
                    Можно не отвечать
                  </span>
                )}
              </div>
              <p className="mt-3 leading-relaxed text-slate-200">{result.summary}</p>
            </div>

            {result.action_items.length > 0 && (
              <div className="card-glass p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Задачи из письма
                </h3>
                <ul className="mt-3 space-y-2">
                  {result.action_items.map((a, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-slate-300">
                      <FiCheck className="mt-1 shrink-0 text-success" aria-hidden="true" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.reply && (
              <div className="rounded-lg bg-gradient-to-b from-primary/15 to-transparent p-px shadow-glow-sm">
                <div className="rounded-[15px] bg-surface-2 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-white">Готовый ответ</h3>
                    <button
                      type="button"
                      onClick={copyReply}
                      className="flex cursor-pointer items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-200 transition-colors hover:border-primary-light/40 hover:text-white"
                    >
                      {copied ? (
                        <>
                          <FiCheck size={15} className="text-success" aria-hidden="true" />
                          Скопировано
                        </>
                      ) : (
                        <>
                          <FiCopy size={15} aria-hidden="true" />
                          Копировать
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap leading-relaxed text-slate-100">
                    {result.reply}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
