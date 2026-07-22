"use client";

import { useEffect, useRef, useState } from "react";
import {
  FiSend,
  FiAlertCircle,
  FiHelpCircle,
  FiRefreshCw,
  FiZap,
  FiTrendingDown,
} from "react-icons/fi";
import { TbStethoscope } from "react-icons/tb";

type Leak = { area: string; problem: string; impact: string; severity: string };
type Rec = { action: string; effect: string; effort: string };
type BizResponse = {
  status: "clarifying" | "ready";
  message: string;
  questions: string[];
  diagnosis: string;
  leaks: Leak[];
  recommendations: Rec[];
  quick_win: string;
};
type ChatMsg =
  | { role: "user"; text: string }
  | { role: "assistant"; data: BizResponse };

const EXAMPLE =
  "Интернет-магазин косметики, выручка ~800 тыс грн/мес, маржа 35%. Трафик из Instagram-рекламы, тратим 120 тыс/мес. Конверсия сайта 1.2%, средний чек 950 грн, повторных покупок мало.";

const SEVERITY_CLASS: Record<string, string> = {
  high: "text-black ring-white/60 bg-white",
  medium: "text-white ring-white/30 bg-white/15",
  low: "text-slate-300 ring-white/15 bg-white/5",
};

export default function BizDoctorTool() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (text.length < 3 || loading) return;
    const next: ChatMsg[] = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);
    try {
      const wire = next.map((m) =>
        m.role === "user"
          ? { role: "user", content: m.text }
          : { role: "model", content: JSON.stringify(m.data) }
      );
      const res = await fetch("/api/bizdoctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: wire }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Что-то пошло не так.");
        return;
      }
      setMessages((prev) => [...prev, { role: "assistant", data: json }]);
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  const empty = messages.length === 0;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="min-h-[280px] space-y-5">
        {empty && !loading && (
          <div className="card-glass flex flex-col items-center justify-center gap-3 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-secondary/25 text-primary-light ring-1 ring-inset ring-white/10">
              <TbStethoscope size={28} aria-hidden="true" />
            </div>
            <p className="max-w-md text-slate-400">
              Расскажите о бизнесе: ниша, выручка, откуда клиенты, что с
              конверсией. Доктор уточнит метрики и покажет, где вы теряете деньги.
            </p>
            <button
              type="button"
              onClick={() => setInput(EXAMPLE)}
              className="cursor-pointer text-sm font-medium text-primary-light transition-colors hover:text-white"
            >
              Подставить пример
            </button>
          </div>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-white px-4 py-3 text-black shadow-glow-sm">
                {m.text}
              </div>
            </div>
          ) : (
            <Assistant key={i} data={m.data} />
          )
        )}

        {loading && (
          <div className="flex items-center gap-3 text-slate-400">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/15 border-t-primary-light" aria-hidden="true" />
            Доктор анализирует…
          </div>
        )}
        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-rose-300">
            <FiAlertCircle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
            <p>{error}</p>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-4 mt-6">
        <div className="card-glass !bg-surface-2/95 p-3">
          <div className="flex items-end gap-2">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={empty ? "Опишите ваш бизнес и цифры…" : "Ваш ответ…"}
              className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2.5 text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={send}
              disabled={input.trim().length < 3 || loading}
              className="btn-primary !min-h-11 !px-4"
              aria-label="Отправить"
            >
              <FiSend size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
        {!empty && (
          <button
            type="button"
            onClick={() => {
              setMessages([]);
              setInput("");
              setError(null);
            }}
            className="mx-auto mt-3 flex cursor-pointer items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-300"
          >
            <FiRefreshCw size={14} aria-hidden="true" />
            Новая диагностика
          </button>
        )}
      </div>
    </div>
  );
}

function Assistant({ data }: { data: BizResponse }) {
  if (data.status === "clarifying") {
    return (
      <div className="flex justify-start">
        <div className="max-w-[90%] rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.04] p-4">
          <p className="text-slate-200">{data.message}</p>
          {data.questions.length > 0 && (
            <ul className="mt-3 space-y-2">
              {data.questions.map((q, i) => (
                <li key={i} className="flex items-start gap-2.5 text-slate-300">
                  <FiHelpCircle size={16} className="mt-1 shrink-0 text-primary-light" aria-hidden="true" />
                  {q}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.message && <p className="text-slate-400">{data.message}</p>}

      {data.diagnosis && (
        <div className="card-glass p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Диагноз
          </h3>
          <p className="mt-2 leading-relaxed text-slate-200">{data.diagnosis}</p>
        </div>
      )}

      {data.leaks.length > 0 && (
        <div className="card-glass p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
            <FiTrendingDown size={15} aria-hidden="true" />
            Где теряются деньги
          </h3>
          <ul className="mt-3 space-y-4">
            {data.leaks.map((l, i) => (
              <li key={i} className="border-l-2 border-white/30 pl-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-white">{l.area}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${SEVERITY_CLASS[l.severity] ?? SEVERITY_CLASS.low}`}
                  >
                    {l.severity === "high" ? "критично" : l.severity === "medium" ? "заметно" : "умеренно"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-300">{l.problem}</p>
                <p className="mt-1 text-sm font-medium text-white">{l.impact}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.recommendations.length > 0 && (
        <div className="card-glass p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Рекомендации
          </h3>
          <ul className="mt-3 space-y-3">
            {data.recommendations.map((r, i) => (
              <li key={i} className="rounded-md bg-white/[0.03] p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-slate-100">{r.action}</p>
                  <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-400">
                    {r.effort}
                  </span>
                </div>
                <p className="mt-1 text-sm text-success">{r.effect}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.quick_win && (
        <div className="rounded-lg bg-gradient-to-b from-primary/15 to-transparent p-px shadow-glow-sm">
          <div className="flex items-start gap-3 rounded-[15px] bg-surface-2 p-5">
            <FiZap size={20} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" />
            <div>
              <h3 className="font-heading font-bold text-white">Quick win на эту неделю</h3>
              <p className="mt-1.5 leading-relaxed text-slate-200">{data.quick_win}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
