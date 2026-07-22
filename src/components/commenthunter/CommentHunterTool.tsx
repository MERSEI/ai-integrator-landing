"use client";

import { useState } from "react";
import {
  FiSearch,
  FiCopy,
  FiCheck,
  FiAlertCircle,
  FiHeart,
  FiMessageCircle,
} from "react-icons/fi";
import { TbBrandTelegram, TbBolt } from "react-icons/tb";
import {
  TIER_META,
  type CommentHunterResult,
  type HuntedPost,
} from "@/lib/commenthunter";

export default function CommentHunterTool() {
  const [keyword, setKeyword] = useState("");
  const [product, setProduct] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CommentHunterResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const hunt = async () => {
    if (keyword.trim().length < 2 || loading) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/commenthunter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, product }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Что-то пошло не так. Попробуйте ещё раз.");
        return;
      }
      setResult(json as CommentHunterResult);
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  const copyReply = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard недоступен */
    }
  };

  const hotCount =
    result?.posts.reduce(
      (n, p) => n + p.comments.filter((c) => c.tier === "hot").length,
      0
    ) ?? 0;

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
              onKeyDown={(e) => e.key === "Enter" && hunt()}
              placeholder="например: похудение, запуск бизнеса, изучение английского…"
              className="min-h-12 w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition-colors focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            type="button"
            onClick={hunt}
            disabled={keyword.trim().length < 2 || loading}
            className="btn-primary !min-h-12 sm:w-auto"
          >
            {loading ? (
              "Ищем…"
            ) : (
              <>
                <FiSearch size={18} aria-hidden="true" />
                Найти в комментах
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
            placeholder="например: онлайн-курс по английскому для взрослых"
            className="min-h-11 w-full rounded-md border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-slate-500 transition-colors focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-lg border border-white/15 bg-white/5 p-4 text-sm text-slate-300">
        <FiAlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
        <p>
          <span className="font-semibold">Демо-режим.</span> Посты и комментарии
          ниже сгенерированы AI как реалистичные примеры — это не реальные люди.
          Демо показывает, как движок находит лидов в комментариях. Реальный
          мониторинг — в PRO.
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
            <p className="text-slate-400">Читаем комментарии под постами…</p>
          </div>
        )}

        {!loading && !error && !result && (
          <div className="card-glass flex flex-col items-center justify-center gap-3 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-secondary/25 text-primary-light ring-1 ring-inset ring-white/10">
              <FiMessageCircle size={26} aria-hidden="true" />
            </div>
            <p className="max-w-xs text-slate-400">
              Введите тему — движок найдёт популярные посты и вытащит горячих
              лидов из комментариев под ними
            </p>
          </div>
        )}

        {!loading && result && (
          <div className="space-y-6">
            <p className="text-sm text-slate-400">
              По теме «<span className="text-slate-200">{result.keyword}</span>»
              просканировано {result.posts.length} постов, найдено{" "}
              <span className="font-semibold text-white">{hotCount}</span>{" "}
              горячих лидов в комментариях:
            </p>
            {result.posts.map((post, pi) => (
              <PostThread
                key={pi}
                post={post}
                postIndex={pi}
                copied={copied}
                onCopy={copyReply}
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
              Comment Hunter PRO — реальный мониторинг
            </h3>
          </div>
          <p className="mt-3 text-slate-400">
            В боевой версии Comment Hunter отслеживает комментарии под постами по
            вашим темам и приносит лидов сам:
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "Мониторинг комментариев под трендовыми постами по вашим темам",
              "AI-скоринг каждого комментария: горячий / тёплый / не лид",
              "Уведомления о горячих комментаторах в Telegram",
              "Готовые черновики ответов для быстрого захода",
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

function PostThread({
  post,
  postIndex,
  copied,
  onCopy,
}: {
  post: HuntedPost;
  postIndex: number;
  copied: string | null;
  onCopy: (id: string, text: string) => void;
}) {
  return (
    <div className="card-glass overflow-hidden">
      {/* Пост */}
      <div className="border-b border-white/10 p-5">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-white">{post.author}</p>
          <p className="text-xs text-slate-500">{post.posted}</p>
        </div>
        <p className="mt-2 leading-relaxed text-slate-200">{post.text}</p>
        <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <FiHeart size={14} aria-hidden="true" />
            {post.likes.toLocaleString("ru-RU")}
          </span>
          <span className="flex items-center gap-1.5">
            <FiMessageCircle size={14} aria-hidden="true" />
            {post.comments.length}
          </span>
        </div>
      </div>

      {/* Комментарии */}
      <ul className="divide-y divide-white/5">
        {post.comments.map((c, ci) => {
          const tier = TIER_META[c.tier] ?? TIER_META.cold;
          const id = `${postIndex}-${ci}`;
          const score = Math.max(0, Math.min(100, Math.round(c.score)));
          return (
            <li key={ci} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-slate-200">{c.handle}</p>
                <span
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tier.className}`}
                >
                  {tier.label} · {score}
                </span>
              </div>
              <p className="mt-1.5 leading-relaxed text-slate-300">{c.text}</p>
              <p className="mt-2 text-sm text-slate-500">{c.reason}</p>
              {c.reply && (
                <div className="mt-3 rounded-md border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Ответ на коммент
                    </span>
                    <button
                      type="button"
                      onClick={() => onCopy(id, c.reply)}
                      className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-slate-300 transition-colors hover:text-white"
                    >
                      {copied === id ? (
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
                    «{c.reply}»
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
