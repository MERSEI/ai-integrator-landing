"use client";

import { useState } from "react";
import { FiCopy, FiCheck, FiZap, FiAlertCircle } from "react-icons/fi";
import {
  CHANNELS,
  TONES,
  signalColor,
  type ColdMessageResult,
} from "@/lib/coldmessage";

const EXAMPLE_PROFILE = `Антон Кравец — Head of Growth в SaaS для логистики (TrackFlow). Пишу про B2B-маркетинг и когортный анализ. На прошлой неделе выступал на конференции SaaS Nova про удержание. Люблю бег и спешелти-кофе. Ищем сильного перформанс-маркетолога. Telegram: @anton_growth, почта anton@trackflow.io`;

const EXAMPLE_OFFER = `Здравствуйте! Мы делаем сервис для автоматизации холодных рассылок с AI-персонализацией. Хотим предложить пилот. Удобно созвониться?`;

export default function ColdMessageTool() {
  const [profileText, setProfileText] = useState("");
  const [sourceLink, setSourceLink] = useState("");
  const [offerTemplate, setOfferTemplate] = useState("");
  const [channel, setChannel] = useState<string>("Telegram");
  const [tone, setTone] = useState<string>(TONES[0]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ColdMessageResult | null>(null);
  const [copied, setCopied] = useState(false);

  const fillExample = () => {
    setProfileText(EXAMPLE_PROFILE);
    setOfferTemplate(EXAMPLE_OFFER);
    setChannel("Telegram");
    setTone(TONES[0]);
  };

  const generate = async () => {
    setError(null);
    setResult(null);
    setCopied(false);
    setLoading(true);
    try {
      const res = await fetch("/api/coldmessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileText, offerTemplate, channel, tone, sourceLink }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Что-то пошло не так. Попробуйте ещё раз.");
        return;
      }
      setResult(json as ColdMessageResult);
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = async () => {
    if (!result) return;
    const text = result.subject
      ? `Тема: ${result.subject}\n\n${result.message}`
      : result.message;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard недоступен — пропускаем */
    }
  };

  const canSubmit = profileText.trim().length >= 20 && offerTemplate.trim().length >= 10;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ---- Ввод ---- */}
      <div className="card-glass p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-white">Входные данные</h2>
          <button
            type="button"
            onClick={fillExample}
            className="cursor-pointer text-sm font-medium text-primary-light transition-colors hover:text-white"
          >
            Заполнить примером
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label htmlFor="profile" className="mb-1.5 block text-sm font-medium text-slate-300">
              Текст профиля <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="profile"
              rows={6}
              value={profileText}
              onChange={(e) => setProfileText(e.target.value)}
              placeholder="Вставьте About / Bio, пару постов или комментариев человека…"
              className="w-full resize-y rounded-md border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition-colors focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label htmlFor="link" className="mb-1.5 block text-sm font-medium text-slate-300">
              Ссылка на профиль <span className="text-slate-500">(необязательно)</span>
            </label>
            <input
              id="link"
              type="url"
              value={sourceLink}
              onChange={(e) => setSourceLink(e.target.value)}
              placeholder="https://linkedin.com/in/…"
              className="min-h-11 w-full rounded-md border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-slate-500 transition-colors focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label htmlFor="offer" className="mb-1.5 block text-sm font-medium text-slate-300">
              Ваше шаблонное предложение <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="offer"
              rows={3}
              value={offerTemplate}
              onChange={(e) => setOfferTemplate(e.target.value)}
              placeholder="Что вы предлагаете — как написали бы всем одинаково…"
              className="w-full resize-y rounded-md border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition-colors focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="channel" className="mb-1.5 block text-sm font-medium text-slate-300">
                Канал
              </label>
              <select
                id="channel"
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
              <label htmlFor="tone" className="mb-1.5 block text-sm font-medium text-slate-300">
                Тон
              </label>
              <select
                id="tone"
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
            disabled={!canSubmit || loading}
            className="btn-primary w-full"
          >
            {loading ? (
              "Генерируем…"
            ) : (
              <>
                <FiZap size={18} aria-hidden="true" />
                Сгенерировать письмо
              </>
            )}
          </button>
          {!canSubmit && (
            <p className="text-center text-xs text-slate-500">
              Заполните текст профиля и шаблон предложения
            </p>
          )}
        </div>
      </div>

      {/* ---- Результат ---- */}
      <div className="lg:sticky lg:top-24 lg:self-start">
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
            <p className="text-slate-400">Анализируем профиль и пишем сообщение…</p>
          </div>
        )}

        {!loading && !error && !result && (
          <div className="card-glass flex flex-col items-center justify-center gap-3 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-secondary/25 text-primary-light ring-1 ring-inset ring-white/10">
              <FiZap size={26} aria-hidden="true" />
            </div>
            <p className="max-w-xs text-slate-400">
              Здесь появятся извлечённые данные и готовое персонализированное
              сообщение
            </p>
          </div>
        )}

        {!loading && result && (
          <div className="space-y-5">
            {result.contacts.length > 0 && (
              <div className="card-glass p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Контакты
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.contacts.map((c, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200"
                    >
                      <span className="text-xs uppercase text-slate-500">{c.type}</span>
                      {c.value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.signals.length > 0 && (
              <div className="card-glass p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Сигналы для зацепки
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {result.signals.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span
                        className={`mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${signalColor(s.category)}`}
                      >
                        {s.category}
                      </span>
                      <span className="text-sm text-slate-300">{s.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.approach && (
              <div className="card-glass p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Подход
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {result.approach}
                </p>
              </div>
            )}

            <div className="rounded-lg bg-gradient-to-b from-primary/15 to-transparent p-px shadow-glow-sm">
              <div className="rounded-[15px] bg-surface-2 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-white">
                    Персонализированное сообщение
                  </h3>
                  <button
                    type="button"
                    onClick={copyMessage}
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
                {result.subject && (
                  <p className="mt-4 text-sm text-slate-400">
                    <span className="text-slate-500">Тема:</span> {result.subject}
                  </p>
                )}
                <p className="mt-3 whitespace-pre-wrap leading-relaxed text-slate-100">
                  {result.message}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
