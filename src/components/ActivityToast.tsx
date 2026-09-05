"use client";

import { useEffect, useState } from "react";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { FiActivity, FiX } from "./icons";

type ToolRun = { tool: string; ts: string };

const ROTATE_MS = 7000;

/**
 * Лента реальной активности демо-инструментов.
 *
 * Показывает только то, что действительно произошло: какой инструмент
 * запускали и когда. Никаких выдуманных компаний и подставных таймстампов —
 * если запусков нет или хранилище не настроено, виджет просто не рендерится.
 */
export default function ActivityToast({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const t = content.activity;
  const [runs, setRuns] = useState<ToolRun[]>([]);
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  // Имена инструментов берём из витрины приложений, чтобы в ленте стояло
  // «Poaching», а не служебный ключ роута.
  const appNames = new Map(
    [...content.featuredApps, ...content.standaloneApps].map((app) => [
      app.id,
      app.name.split("—")[0].trim(),
    ]),
  );

  useEffect(() => {
    let alive = true;
    // Запрос откладываем до простоя: лента — фоновая деталь, она не должна
    // забирать главный поток у первой отрисовки.
    const idle =
      typeof requestIdleCallback === "function"
        ? requestIdleCallback
        : (cb: () => void) => setTimeout(cb, 1200);
    idle(() =>
      fetch("/api/activity")
      .then((r) => (r.ok ? r.json() : { runs: [] }))
      .then((data: { runs?: ToolRun[] }) => {
        if (alive && Array.isArray(data.runs)) setRuns(data.runs);
      })
        .catch(() => {}),
    );
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (runs.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % runs.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [runs.length]);

  if (dismissed || runs.length === 0) return null;

  const run = runs[index];
  const minutes = Math.max(0, Math.round((Date.now() - new Date(run.ts).getTime()) / 60000));
  const when =
    minutes < 1 ? t.justNow : minutes < 60 ? t.minutesAgo(minutes) : t.hoursAgo(Math.round(minutes / 60));

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-40 hidden max-w-[19rem] sm:block">
      {/* key меняется вместе с карточкой — React монтирует новый узел, и
          CSS-анимация появления проигрывается сама, без библиотеки. */}
      <div
        key={`${run.tool}-${run.ts}`}
        className="pointer-events-auto flex animate-fade-up items-start gap-3 rounded-lg border border-white/10 bg-surface/95 p-3.5 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.9)] backdrop-blur-md"
      >
          <span
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/15 text-accent-blue ring-1 ring-inset ring-accent/25"
            aria-hidden="true"
          >
            <FiActivity size={15} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
              {t.title}
            </p>
            <p className="mt-0.5 truncate text-sm font-medium text-primary">
              {t.runLabel(appNames.get(run.tool) ?? run.tool)}
            </p>
            <p className="text-xs text-secondary">{when}</p>
          </div>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label={t.close}
            className="cursor-pointer rounded p-1 text-secondary transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <FiX size={14} aria-hidden="true" />
          </button>
      </div>
    </div>
  );
}
