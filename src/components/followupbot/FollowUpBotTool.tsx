"use client";

import { useState } from "react";
import { FiCopy, FiCheck, FiAlertCircle, FiZap, FiClock } from "react-icons/fi";
import { CHANNELS, TONES } from "@/lib/coldmessage";

type FollowUp = { day: string; angle: string; subject: string; message: string };
type Result = { situation_read: string; followups: FollowUp[]; stop_signal: string };

export default function FollowUpBotTool() {
  const [context, setContext] = useState("");
  const [channel, setChannel] = useState<string>("Email");
  const [tone, setTone] = useState<string>(TONES[1]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = async () => {
    if (context.trim().length < 20 || loading) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/followupbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, channel, tone }),
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

  const copy = async (i: number, f: FollowUp) => {
    try {
      await navigator.clipboard.writeText(
        f.subject ? `Тема: ${f.subject}\n\n${f.message}` : f.message
      );
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
            <label htmlFor="ctx" className="mb-1.5 block text-sm font-medium text-slate-300">
              Контекст сделки <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="ctx"
              rows={4}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Что предлагали, как отреагировал клиент, на чём разговор завис, сколько времени прошло…"
              className="w-full resize-y rounded-md border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition-colors focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="fch" className="mb-1.5 block text-sm font-medium text-slate-300">
                Канал
              </label>
              <select
                id="fch"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="min-h-11 w-full cursor-pointer rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-white transition-colors focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {CHANNELS.map((c) => (
                  <option key={c} value={c} className="bg-surface-2 text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="fto" className="mb-1.5 block text-sm font-medium text-slate-300">
                Тон
              </label>
              <select
                id="fto"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="min-h-11 w-full cursor-pointer rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-white transition-colors focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {TONES.map((t) => (
                  <option key={t} value={t} className="bg-surface-2 text-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={generate}
            disabled={context.trim().length < 20 || loading}
            className="btn-primary w-full"
          >
            {loading ? (
              "Готовим цепочку…"
            ) : (
              <>
                <FiZap size={18} aria-hidden="true" />
                Создать цепочку дожима
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
            <p className="text-slate-400">Анализируем ситуацию и пишем цепочку…</p>
          </div>
        )}
        {!loading && !error && !result && (
          <div className="card-glass flex flex-col items-center justify-center gap-3 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-secondary/25 text-primary-light ring-1 ring-inset ring-white/10">
              <FiClock size={26} aria-hidden="true" />
            </div>
            <p className="max-w-xs text-slate-400">
              Здесь появится цепочка из 3 follow-up сообщений с разными углами
              захода
            </p>
          </div>
        )}
        {!loading && result && (
          <div className="space-y-5">
            <div className="card-glass p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Чтение ситуации
              </h3>
              <p className="mt-2 leading-relaxed text-slate-200">{result.situation_read}</p>
            </div>

            {result.followups.map((f, i) => (
              <article key={i} className="card-glass p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-black">
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold text-primary-light">{f.day}</span>
                    <span className="text-xs text-slate-500">· {f.angle}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copy(i, f)}
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
                {f.subject && (
                  <p className="mt-3 text-sm text-slate-400">
                    <span className="text-slate-500">Тема:</span> {f.subject}
                  </p>
                )}
                <p className="mt-2 whitespace-pre-wrap leading-relaxed text-slate-200">
                  {f.message}
                </p>
              </article>
            ))}

            {result.stop_signal && (
              <p className="text-center text-sm text-slate-500">
                🛑 {result.stop_signal}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
