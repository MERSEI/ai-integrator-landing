"use client";

import { useState } from "react";
import {
  FiSearch,
  FiCopy,
  FiCheck,
  FiAlertCircle,
  FiRadio,
} from "react-icons/fi";
import { TbBrandTelegram, TbBolt } from "react-icons/tb";
import { TIER_META, type LeadRadarResult, type Lead } from "@/lib/leadradar";

export default function LeadRadarTool() {
  const [keyword, setKeyword] = useState("");
  const [product, setProduct] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LeadRadarResult | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  const scan = async () => {
    if (keyword.trim().length < 2 || loading) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/leadradar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, product }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Что-то пошло не так. Попробуйте ещё раз.");
        return;
      }
      setResult(json as LeadRadarResult);
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  const copyReply = async (i: number, text: string) => {
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
      {/* Форма поиска */}
      <div className="card-glass p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label htmlFor="kw" className="mb-1.5 block text-sm font-medium text-slate-300">
              Ключевое слово или ниша <span className="text-rose-400">*</span>
            </label>
            <input
              id="kw"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && scan()}
              placeholder="например: ищу таргетолога, нужен сайт, автоматизация продаж…"
              className="min-h-12 w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition-colors focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            type="button"
            onClick={scan}
            disabled={keyword.trim().length < 2 || loading}
            className="btn-primary !min-h-12 sm:w-auto"
          >
            {loading ? (
              "Сканируем…"
            ) : (
              <>
                <FiSearch size={18} aria-hidden="true" />
                Найти лидов
              </>
            )}
          </button>
        </div>
        <div className="mt-4">
          <label htmlFor="prod" className="mb-1.5 block text-sm font-medium text-slate-300">
            Что вы продаёте <span className="text-slate-500">(необязательно, точнее скоринг)</span>
          </label>
          <input
            id="prod"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="например: услуги по настройке таргета в Meta для малого бизнеса"
            className="min-h-11 w-full rounded-md border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-slate-500 transition-colors focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Демо-дисклеймер */}
      <div className="mt-4 flex items-start gap-3 rounded-lg border border-white/15 bg-white/5 p-4 text-sm text-slate-300">
        <FiAlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
        <p>
          <span className="font-semibold">Демо-режим.</span> Посты ниже
          сгенерированы AI как реалистичные примеры — это не реальные люди из
          Threads. Демо показывает, как движок квалифицирует лидов. Реальный
          мониторинг — в PRO (см. ниже).
        </p>
      </div>

      {/* Результаты */}
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
            <p className="text-slate-400">Сканируем Threads по запросу…</p>
          </div>
        )}

        {!loading && !error && !result && (
          <div className="card-glass flex flex-col items-center justify-center gap-3 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-secondary/25 text-primary-light ring-1 ring-inset ring-white/10">
              <FiRadio size={26} aria-hidden="true" />
            </div>
            <p className="max-w-xs text-slate-400">
              Введите ключевое слово — движок найдёт и оценит потенциальных
              клиентов, которые пишут об этом в Threads
            </p>
          </div>
        )}

        {!loading && result && (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              Найдено {result.leads.length} упоминаний по запросу «
              <span className="text-slate-200">{result.keyword}</span>», отсортировано
              по «теплоте»:
            </p>
            {result.leads.map((lead, i) => (
              <LeadCard
                key={i}
                lead={lead}
                copied={copied === i}
                onCopy={() => copyReply(i, lead.reply)}
              />
            ))}
          </div>
        )}
      </div>

      {/* PRO-блок: реальный функционал */}
      <div className="mt-10 rounded-lg bg-gradient-to-b from-primary/15 to-transparent p-px shadow-glow-sm">
        <div className="rounded-[15px] bg-surface-2 p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <TbBolt size={20} className="text-primary-light" aria-hidden="true" />
            <h3 className="font-heading text-lg font-bold text-white">
              LeadRadar PRO — реальный мониторинг
            </h3>
          </div>
          <p className="mt-3 text-slate-400">
            В боевой версии LeadRadar работает на реальных данных Threads и
            приносит горячих лидов сам:
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "Круглосуточный мониторинг Threads по вашим ключевым словам",
              "AI-классификация каждого поста: горячий / тёплый / не лид",
              "Мгновенные уведомления о горячих лидах в Telegram",
              "Дедупликация и фильтр по свежести — только новые упоминания",
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

function LeadCard({
  lead,
  copied,
  onCopy,
}: {
  lead: Lead;
  copied: boolean;
  onCopy: () => void;
}) {
  const tier = TIER_META[lead.tier] ?? TIER_META.cold;
  const score = Math.max(0, Math.min(100, Math.round(lead.score)));
  return (
    <article className="card-glass p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-white">{lead.handle}</p>
          <p className="text-xs text-slate-500">{lead.posted}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tier.className}`}
        >
          {tier.label}
        </span>
      </div>

      <p className="mt-3 leading-relaxed text-slate-200">{lead.text}</p>

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
        <span className="text-slate-500">Оценка:</span> {lead.reason}
      </p>

      {lead.reply && (
        <div className="mt-4 rounded-md border border-white/10 bg-white/[0.03] p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Черновик захода
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
            «{lead.reply}»
          </p>
        </div>
      )}
    </article>
  );
}
