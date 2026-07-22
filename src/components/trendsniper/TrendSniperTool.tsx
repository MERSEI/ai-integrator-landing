"use client";

import { useState } from "react";
import {
  FiSearch,
  FiAlertCircle,
  FiTrendingUp,
  FiMapPin,
  FiZap,
  FiCalendar,
} from "react-icons/fi";
import { TbBolt } from "react-icons/tb";
import {
  DIRECTION_META,
  type TrendSniperResult,
} from "@/lib/trendsniper";

export default function TrendSniperTool() {
  const [keyword, setKeyword] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrendSniperResult | null>(null);

  const run = async () => {
    if (keyword.trim().length < 2 || loading) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/trendsniper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, region }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Что-то пошло не так. Попробуйте ещё раз.");
        return;
      }
      setResult(json as TrendSniperResult);
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  const dir = result ? DIRECTION_META[result.direction] : null;
  const maxRegion = result?.top_regions?.[0]?.score || 100;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="card-glass p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label htmlFor="kw" className="mb-1.5 block text-sm font-medium text-slate-300">
              Ключевое слово или тема <span className="text-rose-400">*</span>
            </label>
            <input
              id="kw"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run()}
              placeholder="например: нейросети для бизнеса, доставка суши, курсы Python…"
              className="min-h-12 w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition-colors focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            type="button"
            onClick={run}
            disabled={keyword.trim().length < 2 || loading}
            className="btn-primary !min-h-12 sm:w-auto"
          >
            {loading ? (
              "Анализируем…"
            ) : (
              <>
                <FiSearch size={18} aria-hidden="true" />
                Анализ тренда
              </>
            )}
          </button>
        </div>
        <div className="mt-4">
          <label htmlFor="reg" className="mb-1.5 block text-sm font-medium text-slate-300">
            Регион фокуса <span className="text-slate-500">(необязательно)</span>
          </label>
          <input
            id="reg"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="например: Украина, Казахстан, СНГ"
            className="min-h-11 w-full rounded-md border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-slate-500 transition-colors focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-200/90">
        <FiAlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
        <p>
          <span className="font-semibold">Демо-режим.</span> Оценки ниже —
          правдоподобная AI-аналитика на основе знаний модели, а не метрики
          Google Trends в реальном времени. Реальные данные — в PRO.
        </p>
      </div>

      <div className="mt-6">
        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-rose-300">
            <FiAlertCircle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="card-glass flex flex-col items-center justify-center gap-4 p-12 text-center">
            <div
              className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-primary-light"
              aria-hidden="true"
            />
            <p className="text-slate-400">Считаем интерес по регионам…</p>
          </div>
        )}

        {!loading && !error && !result && (
          <div className="card-glass flex flex-col items-center justify-center gap-3 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-secondary/25 text-primary-light ring-1 ring-inset ring-white/10">
              <FiTrendingUp size={26} aria-hidden="true" />
            </div>
            <p className="max-w-xs text-slate-400">
              Введите тему — движок оценит интерес, направление тренда, топ-регионы
              и связанные запросы
            </p>
          </div>
        )}

        {!loading && result && dir && (
          <div className="space-y-5">
            {/* Сводка */}
            <div className="card-glass p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">Уровень интереса</p>
                  <p className="font-heading text-5xl font-extrabold text-gradient">
                    {Math.round(result.interest_level)}
                    <span className="text-2xl text-slate-500">/100</span>
                  </p>
                </div>
                <span
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-inset ${dir.className}`}
                >
                  <span aria-hidden="true">{dir.arrow}</span>
                  {dir.label}
                </span>
              </div>
              <p className="mt-4 leading-relaxed text-slate-300">{result.summary}</p>
            </div>

            {/* Регионы */}
            {result.top_regions.length > 0 && (
              <div className="card-glass p-6">
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
                  <FiMapPin size={15} aria-hidden="true" />
                  Топ регионов по интересу
                </h3>
                <ul className="mt-4 space-y-3">
                  {result.top_regions.map((r, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-32 shrink-0 truncate text-sm text-slate-300">
                        {r.region}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                          style={{ width: `${Math.round((r.score / maxRegion) * 100)}%` }}
                        />
                      </div>
                      <span className="w-8 shrink-0 text-right text-sm font-semibold text-primary-light">
                        {Math.round(r.score)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Связанные запросы */}
            {result.related_queries.length > 0 && (
              <div className="card-glass p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Связанные запросы
                </h3>
                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-semibold text-slate-500">ПОПУЛЯРНЫЕ</p>
                    <div className="flex flex-wrap gap-2">
                      {result.related_queries
                        .filter((q) => q.kind !== "rising")
                        .map((q, i) => (
                          <span
                            key={i}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200"
                          >
                            {q.query}
                          </span>
                        ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-success">
                      РАСТУЩИЕ <span aria-hidden="true">↑</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.related_queries
                        .filter((q) => q.kind === "rising")
                        .map((q, i) => (
                          <span
                            key={i}
                            className="rounded-full border border-success/25 bg-success/10 px-3 py-1 text-sm text-success"
                          >
                            {q.query}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Сезонность + инсайт */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card-glass p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                  <FiCalendar size={15} className="text-primary-light" aria-hidden="true" />
                  Сезонность
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {result.seasonality}
                </p>
              </div>
              <div className="rounded-lg bg-gradient-to-b from-primary/15 to-transparent p-px">
                <div className="h-full rounded-[11px] bg-surface-2 p-5">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                    <FiZap size={15} className="text-warning" aria-hidden="true" />
                    Как использовать
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {result.insight}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 rounded-lg bg-gradient-to-b from-primary/15 to-transparent p-px shadow-glow-sm">
        <div className="rounded-[15px] bg-surface-2 p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <TbBolt size={20} className="text-primary-light" aria-hidden="true" />
            <h3 className="font-heading text-lg font-bold text-white">
              Trend Sniper PRO — реальные данные Google Trends
            </h3>
          </div>
          <p className="mt-3 text-slate-400">
            В боевой версии Trend Sniper работает на реальных данных Google Trends:
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "Реальная динамика интереса из Google Trends за выбранный период",
              "Точная разбивка по странам, регионам и городам",
              "Растущие запросы (breakout) с процентом роста в реальном времени",
              "Отслеживание тем и авто-алерты о всплесках спроса в Telegram",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                <FiTrendingUp className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
          <a href="/#final-cta" className="btn-primary mt-6">
            Подключить PRO
          </a>
        </div>
      </div>
    </div>
  );
}
