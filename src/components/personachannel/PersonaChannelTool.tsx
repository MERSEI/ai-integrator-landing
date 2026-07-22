"use client";

import { useState } from "react";
import { FiCopy, FiCheck, FiAlertCircle, FiZap, FiUsers } from "react-icons/fi";

type Post = { type: string; hook: string; text: string; cta: string };
type Result = {
  persona_summary: string;
  tone: string;
  posts: Post[];
  content_tips: string[];
};

export default function PersonaChannelTool() {
  const [channel, setChannel] = useState("");
  const [persona, setPersona] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = async () => {
    if (channel.trim().length < 5 || loading) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/personachannel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, persona }),
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

  const copy = async (i: number, post: Post) => {
    try {
      await navigator.clipboard.writeText(`${post.hook}\n\n${post.text}\n\n${post.cta}`);
      setCopied(i);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard недоступен */
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="card-glass p-6 sm:p-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="ch" className="mb-1.5 block text-sm font-medium text-slate-300">
              О чём ваш канал <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="ch"
              rows={2}
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              placeholder="например: Telegram-канал про личные финансы и инвестиции для начинающих"
              className="w-full resize-y rounded-md border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition-colors focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label htmlFor="pe" className="mb-1.5 block text-sm font-medium text-slate-300">
              Ваша персона <span className="text-slate-500">(необязательно — выведем сами)</span>
            </label>
            <textarea
              id="pe"
              rows={2}
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              placeholder="например: 25–35 лет, наёмные специалисты, хотят пассивный доход, боятся потерять деньги"
              className="w-full resize-y rounded-md border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition-colors focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            type="button"
            onClick={generate}
            disabled={channel.trim().length < 5 || loading}
            className="btn-primary w-full"
          >
            {loading ? (
              "Создаём контент…"
            ) : (
              <>
                <FiZap size={18} aria-hidden="true" />
                Создать контент под персону
              </>
            )}
          </button>
        </div>
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
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-primary-light" aria-hidden="true" />
            <p className="text-slate-400">Изучаем персону и пишем посты…</p>
          </div>
        )}
        {!loading && !error && !result && (
          <div className="card-glass flex flex-col items-center justify-center gap-3 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-secondary/25 text-primary-light ring-1 ring-inset ring-white/10">
              <FiUsers size={26} aria-hidden="true" />
            </div>
            <p className="max-w-xs text-slate-400">
              Здесь появятся портрет персоны и 5 готовых постов, написанных
              специально под неё
            </p>
          </div>
        )}
        {!loading && result && (
          <div className="space-y-5">
            <div className="card-glass p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Портрет персоны
              </h3>
              <p className="mt-2 leading-relaxed text-slate-200">{result.persona_summary}</p>
              <p className="mt-2 text-sm text-slate-400">
                <span className="text-slate-500">Тон:</span> {result.tone}
              </p>
            </div>

            {result.posts.map((post, i) => (
              <article key={i} className="card-glass p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-primary-light/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-light">
                    {post.type}
                  </span>
                  <button
                    type="button"
                    onClick={() => copy(i, post)}
                    className="flex cursor-pointer items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-primary-light/40 hover:text-white"
                  >
                    {copied === i ? (
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
                <p className="mt-3 font-heading font-bold text-white">{post.hook}</p>
                <p className="mt-2 whitespace-pre-wrap leading-relaxed text-slate-300">
                  {post.text}
                </p>
                <p className="mt-3 text-sm font-medium text-primary-light">{post.cta}</p>
              </article>
            ))}

            {result.content_tips.length > 0 && (
              <div className="card-glass p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Как вести канал для этой персоны
                </h3>
                <ul className="mt-3 space-y-2">
                  {result.content_tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <FiCheck className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
