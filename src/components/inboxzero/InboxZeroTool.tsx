"use client";

import { useState } from "react";
import { FiCopy, FiCheck, FiAlertCircle, FiZap, FiInbox } from "react-icons/fi";
import { getTools } from "@/lib/content/tools";
import type { Locale } from "@/lib/i18n";

type Result = {
  category: string;
  urgency: string;
  needs_reply: boolean;
  summary: string;
  action_items: string[];
  reply: string;
};

/** Только оформление — подписи переводятся, см. getTools(locale).urgency. */
const URGENCY_CLASSES: Record<string, string> = {
  high: "text-black ring-white/60 bg-white",
  medium: "text-white ring-white/30 bg-white/15",
  low: "text-slate-300 ring-white/15 bg-white/5",
};

export default function InboxZeroTool({ locale }: { locale: Locale }) {
  const t = getTools(locale).inboxzero;
  const c = getTools(locale).common;
  const urgencyLabels = getTools(locale).urgency;
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
        body: JSON.stringify({ email, instruction, locale }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? c.genericError);
        return;
      }
      setResult(json as Result);
    } catch {
      setError(c.networkError);
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

  const urgencyKey = result
    ? ((result.urgency in URGENCY_CLASSES ? result.urgency : "low") as keyof typeof urgencyLabels)
    : null;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card-glass p-6 sm:p-8">
        <h2 className="font-heading text-lg font-bold text-white">{t.formTitle}</h2>
        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="em" className="mb-1.5 block text-sm font-medium text-slate-300">
              {t.emailLabel} <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="em"
              rows={9}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              className="w-full resize-y rounded-md border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition-colors focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label htmlFor="ins" className="mb-1.5 block text-sm font-medium text-slate-300">
              {t.intentLabel} <span className="text-slate-500">{t.intentHint}</span>
            </label>
            <input
              id="ins"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder={t.intentPlaceholder}
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
              t.submitting
            ) : (
              <>
                <FiZap size={18} aria-hidden="true" />
                {t.submit}
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
            <p className="text-slate-400">{t.loading}</p>
          </div>
        )}
        {!loading && !error && !result && (
          <div className="card-glass flex flex-col items-center justify-center gap-3 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-secondary/25 text-primary-light ring-1 ring-inset ring-white/10">
              <FiInbox size={26} aria-hidden="true" />
            </div>
            <p className="max-w-xs text-slate-400">
              {t.empty}
            </p>
          </div>
        )}
        {!loading && result && urgencyKey && (
          <div className="space-y-5">
            <div className="card-glass p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-primary-light/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-light">
                  {result.category}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${URGENCY_CLASSES[urgencyKey]}`}>
                  {urgencyLabels[urgencyKey]}
                </span>
                {!result.needs_reply && (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-400">
                    {t.noReplyNeeded}
                  </span>
                )}
              </div>
              <p className="mt-3 leading-relaxed text-slate-200">{result.summary}</p>
            </div>

            {result.action_items.length > 0 && (
              <div className="card-glass p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  {t.tasksTitle}
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
                    <h3 className="font-heading font-bold text-white">{t.replyTitle}</h3>
                    <button
                      type="button"
                      onClick={copyReply}
                      className="flex cursor-pointer items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-200 transition-colors hover:border-primary-light/40 hover:text-white"
                    >
                      {copied ? (
                        <>
                          <FiCheck size={15} className="text-success" aria-hidden="true" />
                          {c.copied}
                        </>
                      ) : (
                        <>
                          <FiCopy size={15} aria-hidden="true" />
                          {c.copy}
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
