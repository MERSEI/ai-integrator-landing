"use client";

import { useEffect, useRef, useState } from "react";
import { getTools } from "@/lib/content/tools";
import { localePath, type Locale } from "@/lib/i18n";
import type { ScanView } from "@/lib/taskz";
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheck,
  FiCrosshair,
  FiInfo,
  FiRefreshCw,
  FiSearch,
  TbBolt,
  TbBrandTelegram,
} from "@/components/icons";

const POLL_MS = 4_000;
// TaskZ сам обрывает прогон на 10 минутах; ждём чуть дольше, чтобы получить его ответ.
const GIVE_UP_MS = 12 * 60_000;
// Сколько сбоев опроса подряд считаем «поиск недоступен».
const MAX_POLL_FAILURES = 3;

type Phase =
  | { kind: "idle" }
  | { kind: "starting" }
  | { kind: "progress"; view: ScanView }
  | { kind: "done"; view: Extract<ScanView, { state: "done" }> }
  | { kind: "error"; message: string };

const UNAVAILABLE: Extract<ScanView, { state: "done" }> = { state: "done", outcome: "unavailable" };

export default function PoachingTool({ locale }: { locale: Locale }) {
  const t = getTools(locale).poaching;
  const c = getTools(locale).common;
  const [niche, setNiche] = useState("");
  const [geo, setGeo] = useState("");
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const busy = phase.kind === "starting" || phase.kind === "progress";
  const canSubmit = niche.trim().length >= 3 && !busy;

  const run = async () => {
    if (!canSubmit) return;
    setPhase({ kind: "starting" });
    try {
      const res = await fetch("/api/poaching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, geo, locale }),
      });
      const json = (await res.json().catch(() => ({}))) as { id?: string; error?: string };
      if (res.status === 503) {
        // TaskZ недоступен: говорим «не смогли искать», а не «лидов нет».
        setPhase({ kind: "done", view: UNAVAILABLE });
        return;
      }
      if (!res.ok || !json.id) {
        setPhase({ kind: "error", message: json.error ?? c.genericErrorRetry });
        return;
      }
      await poll(json.id);
    } catch {
      if (alive.current) setPhase({ kind: "error", message: c.networkError });
    }
  };

  const poll = async (id: string) => {
    const startedAt = Date.now();
    let failures = 0;
    setPhase({ kind: "progress", view: { state: "running" } });

    while (alive.current) {
      await new Promise((r) => setTimeout(r, POLL_MS));
      if (!alive.current) return;
      if (Date.now() - startedAt > GIVE_UP_MS) {
        setPhase({ kind: "done", view: UNAVAILABLE });
        return;
      }
      try {
        const res = await fetch(`/api/poaching?id=${encodeURIComponent(id)}&locale=${locale}`, { cache: "no-store" });
        if (res.status === 404) {
          const json = (await res.json().catch(() => ({}))) as { error?: string };
          setPhase({ kind: "error", message: json.error ?? c.genericErrorRetry });
          return;
        }
        if (!res.ok) throw new Error(String(res.status));
        failures = 0;
        const view = (await res.json()) as ScanView;
        if (!alive.current) return;
        if (view.state === "done") {
          setPhase({ kind: "done", view });
          return;
        }
        setPhase({ kind: "progress", view });
      } catch {
        failures += 1;
        if (failures >= MAX_POLL_FAILURES) {
          if (alive.current) setPhase({ kind: "done", view: UNAVAILABLE });
          return;
        }
      }
    }
  };

  const inputClass =
    "w-full rounded-md border border-white/15 bg-white/5 px-4 text-white placeholder-slate-500 transition-colors focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="card-glass p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label htmlFor="niche" className="mb-1.5 block text-sm font-medium text-slate-300">
              {t.nicheLabel} <span className="text-rose-400">*</span>
            </label>
            <input
              id="niche"
              value={niche}
              maxLength={300}
              onChange={(e) => setNiche(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run()}
              placeholder={t.nichePlaceholder}
              disabled={busy}
              className={`${inputClass} min-h-12 py-3`}
            />
          </div>
          <button type="button" onClick={run} disabled={!canSubmit} className="btn-primary !min-h-12 sm:w-auto">
            {busy ? (
              t.submitting
            ) : (
              <>
                <FiSearch size={18} aria-hidden="true" />
                {t.submit}
              </>
            )}
          </button>
        </div>
        <div className="mt-4">
          <label htmlFor="geo" className="mb-1.5 block text-sm font-medium text-slate-300">
            {t.geoLabel} <span className="text-secondary">{t.geoHint}</span>
          </label>
          <input
            id="geo"
            value={geo}
            maxLength={100}
            onChange={(e) => setGeo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder={t.geoPlaceholder}
            disabled={busy}
            className={`${inputClass} min-h-11 py-2.5`}
          />
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-lg border border-white/15 bg-white/5 p-4 text-sm text-slate-300">
        <FiInfo size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
        <p>{t.realNote}</p>
      </div>

      <div className="mt-6" aria-live="polite">
        {phase.kind === "error" && (
          <div className="flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-rose-300">
            <FiAlertCircle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
            <p>{phase.message}</p>
          </div>
        )}

        {(phase.kind === "starting" || phase.kind === "progress") && (
          <div className="card-glass flex flex-col items-center justify-center gap-4 p-12 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-primary-light" aria-hidden="true" />
            <p className="text-slate-300">
              {phase.kind === "progress" && phase.view.state === "queued"
                ? t.queued(phase.view.queuePosition)
                : t.loading}
            </p>
            <p className="text-sm text-slate-500">{t.loadingHint}</p>
          </div>
        )}

        {phase.kind === "idle" && (
          <div className="card-glass flex flex-col items-center justify-center gap-3 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-secondary/25 text-primary-light ring-1 ring-inset ring-white/10">
              <FiCrosshair size={26} aria-hidden="true" />
            </div>
            <p className="max-w-xs text-slate-400">{t.empty}</p>
          </div>
        )}

        {phase.kind === "done" && <Outcome view={phase.view} locale={locale} onRetry={() => setPhase({ kind: "idle" })} />}
      </div>

      <div className="mt-10 rounded-lg bg-gradient-to-b from-primary/15 to-transparent p-px shadow-glow-sm">
        <div className="rounded-[15px] bg-surface-2 p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <TbBolt size={20} className="text-primary-light" aria-hidden="true" />
            <h3 className="font-heading text-lg font-bold text-white">{t.proTitle}</h3>
          </div>
          <p className="mt-3 text-slate-400">{t.proIntro}</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {t.proFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                <FiCheck className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
          <a href={`${localePath(locale, "/")}#final-cta`} className="btn-primary mt-6">
            <TbBrandTelegram size={18} aria-hidden="true" />
            {c.proCta}
          </a>
        </div>
      </div>
    </div>
  );
}

function Outcome({
  view,
  locale,
  onRetry,
}: {
  view: Extract<ScanView, { state: "done" }>;
  locale: Locale;
  onRetry: () => void;
}) {
  const t = getTools(locale).poaching;
  const ctaHref = `${localePath(locale, "/")}#final-cta`;

  if (view.outcome === "lead_found") {
    const score = Math.max(0, Math.min(100, view.lead.score));
    return (
      <article className="card-glass p-5 sm:p-6">
        <div className="flex items-center gap-2 text-success">
          <FiCheck size={20} aria-hidden="true" />
          <h3 className="font-heading text-lg font-bold text-white">{t.leadTitle}</h3>
        </div>

        <blockquote className="mt-4 whitespace-pre-line border-l-2 border-white/15 pl-3 leading-relaxed text-slate-200">
          {view.lead.text}
        </blockquote>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${score}%` }} />
          </div>
          <span className="shrink-0 text-sm font-semibold text-primary-light">
            {t.leadScore} {score}/100
          </span>
        </div>

        <p className="mt-3 text-sm text-slate-400">
          <span className="text-secondary">{t.leadWhy}</span> {view.lead.reason}
        </p>

        <a href={view.lead.url} target="_blank" rel="noopener noreferrer nofollow" className="btn-primary mt-5 inline-flex">
          {t.leadOpen}
          <FiArrowRight size={16} aria-hidden="true" />
        </a>

        <p className="mt-5 text-xs text-slate-500">{t.leadStats(view.stats.keywordsSearched, view.stats.postsFetched)}</p>
        <p className="mt-2 text-sm text-slate-400">{t.leadUpsell}</p>
      </article>
    );
  }

  if (view.outcome === "no_leads") {
    return (
      <article className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-5 sm:p-6">
        <div className="flex items-center gap-2 text-amber-300">
          <FiInfo size={20} aria-hidden="true" />
          <h3 className="font-heading text-lg font-bold text-white">{t.noLeadsTitle}</h3>
        </div>
        <p className="mt-3 leading-relaxed text-slate-200">
          {t.noLeadsBody(view.stats.keywordsSearched, view.stats.postsFetched)}
        </p>
        <a href={ctaHref} className="btn-primary mt-5 inline-flex">
          <TbBrandTelegram size={18} aria-hidden="true" />
          {t.noLeadsCta}
        </a>
      </article>
    );
  }

  return (
    <article className="rounded-lg border border-white/15 bg-white/5 p-5 sm:p-6">
      <div className="flex items-center gap-2 text-slate-300">
        <FiAlertCircle size={20} aria-hidden="true" />
        <h3 className="font-heading text-lg font-bold text-white">{t.unavailableTitle}</h3>
      </div>
      <p className="mt-3 leading-relaxed text-slate-300">{t.unavailableBody}</p>
      <button type="button" onClick={onRetry} className="btn-secondary mt-5 inline-flex cursor-pointer items-center gap-2">
        <FiRefreshCw size={16} aria-hidden="true" />
        {t.retry}
      </button>
    </article>
  );
}
