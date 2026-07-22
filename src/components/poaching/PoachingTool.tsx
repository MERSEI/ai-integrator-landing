"use client";

import { useState } from "react";
import {
  FiSearch,
  FiCopy,
  FiCheck,
  FiAlertCircle,
  FiCrosshair,
  FiCornerUpLeft,
} from "react-icons/fi";
import { TbBrandTelegram, TbBolt } from "react-icons/tb";
import { TIER_META, type PoachingResult, type Prospect } from "@/lib/poaching";

export default function PoachingTool() {
  const [niche, setNiche] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PoachingResult | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  const run = async () => {
    if (niche.trim().length < 2 || loading) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/poaching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, competitors }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Что-то пошло не так. Попробуйте ещё раз.");
        return;
      }
      setResult(json as PoachingResult);
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  const copyDm = async (i: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(i);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard недоступен */
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="card-glass p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label htmlFor="niche" className="mb-1.5 block text-sm font-medium text-slate-300">
              Ваша ниша <span className="text-rose-400">*</span>
            </label>
            <input
              id="niche"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run()}
              placeholder="например: доставка здоровой еды, фитнес-студия, SMM-агентство…"
              className="min-h-12 w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition-colors focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            type="button"
            onClick={run}
            disabled={niche.trim().length < 2 || loading}
            className="btn-primary !min-h-12 sm:w-auto"
          >
            {loading ? (
              "Ищем…"
            ) : (
              <>
                <FiSearch size={18} aria-hidden="true" />
                Найти лидов
              </>
            )}
          </button>
        </div>
        <div className="mt-4">
          <label htmlFor="comp" className="mb-1.5 block text-sm font-medium text-slate-300">
            Конкуренты <span className="text-slate-500">(необязательно, через запятую)</span>
          </label>
          <input
            id="comp"
            value={competitors}
            onChange={(e) => setCompetitors(e.target.value)}
            placeholder="например: @competitor_food, @healthy_delivery"
            className="min-h-11 w-full rounded-md border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-slate-500 transition-colors focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-lg border border-white/15 bg-white/5 p-4 text-sm text-slate-300">
        <FiAlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
        <p>
          <span className="font-semibold">Демо-режим.</span> Люди и комментарии
          ниже сгенерированы AI как реалистичные примеры — это не реальные
          пользователи. Демо показывает, как движок находит клиентов у
          конкурентов. Реальный мониторинг — в PRO.
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
            <p className="text-slate-400">Сканируем комментарии у конкурентов…</p>
          </div>
        )}

        {!loading && !error && !result && (
          <div className="card-glass flex flex-col items-center justify-center gap-3 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-secondary/25 text-primary-light ring-1 ring-inset ring-white/10">
              <FiCrosshair size={26} aria-hidden="true" />
            </div>
            <p className="max-w-xs text-slate-400">
              Укажите нишу — движок найдёт людей, которые интересовались у
              конкурентов, и подскажет, как их переманить
            </p>
          </div>
        )}

        {!loading && result && (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              В нише «<span className="text-slate-200">{result.niche}</span>»
              найдено {result.prospects.length} человек с интересом у конкурентов,
              отсортировано по перспективности:
            </p>
            {result.prospects.map((p, i) => (
              <ProspectCard
                key={i}
                prospect={p}
                copied={copied === i}
                onCopy={() => copyDm(i, p.dm)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 rounded-lg bg-gradient-to-b from-primary/15 to-transparent p-px shadow-glow-sm">
        <div className="rounded-[15px] bg-surface-2 p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <TbBolt size={20} className="text-primary-light" aria-hidden="true" />
            <h3 className="font-heading text-lg font-bold text-white">
              Poaching PRO — реальное переманивание
            </h3>
          </div>
          <p className="mt-3 text-slate-400">
            В боевой версии Poaching мониторит комментарии у ваших конкурентов и
            приводит их клиентов к вам:
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "Мониторинг комментариев под постами конкурентов в реальном времени",
              "Сбор людей с подтверждённым интересом — кто уже задавал вопросы",
              "Готовые тактичные заходы в ЛС и работа с возражениями",
              "Перевод заинтересованных в ваш Telegram-канал автоматически",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                <FiCheck className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
          <a href="/#final-cta" className="btn-primary mt-6">
            <TbBrandTelegram size={18} aria-hidden="true" />
            Подключить PRO
          </a>
        </div>
      </div>
    </div>
  );
}

function ProspectCard({
  prospect,
  copied,
  onCopy,
}: {
  prospect: Prospect;
  copied: boolean;
  onCopy: () => void;
}) {
  const tier = TIER_META[prospect.tier] ?? TIER_META.cold;
  const score = Math.max(0, Math.min(100, Math.round(prospect.score)));
  return (
    <article className="card-glass p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-white">{prospect.handle}</p>
          <p className="text-xs text-slate-500">
            комментировал у{" "}
            <span className="text-slate-400">{prospect.competitor}</span>
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tier.className}`}
        >
          {tier.label}
        </span>
      </div>

      <blockquote className="mt-3 border-l-2 border-white/15 pl-3 leading-relaxed text-slate-200">
        {prospect.question}
      </blockquote>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            style={{ width: `${score}%` }}
          />
        </div>
        <span className="shrink-0 text-sm font-semibold text-primary-light">
          {score}/100
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-400">
        <span className="text-slate-500">Оценка:</span> {prospect.reason}
      </p>

      {prospect.dm && (
        <div className="mt-4 rounded-md border border-white/10 bg-white/[0.03] p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <FiCornerUpLeft size={13} aria-hidden="true" />
              Заход в ЛС
            </span>
            <button
              type="button"
              onClick={onCopy}
              className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-slate-300 transition-colors hover:text-white"
            >
              {copied ? (
                <>
                  <FiCheck size={13} className="text-success" aria-hidden="true" />
                  Скопировано
                </>
              ) : (
                <>
                  <FiCopy size={13} aria-hidden="true" />
                  Копировать
                </>
              )}
            </button>
          </div>
          <p className="mt-2 text-sm italic leading-relaxed text-slate-200">
            «{prospect.dm}»
          </p>
        </div>
      )}
    </article>
  );
}
