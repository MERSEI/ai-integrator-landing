"use client";

import { useEffect, useRef, useState } from "react";
import {
  FiSend,
  FiCopy,
  FiCheck,
  FiAlertCircle,
  FiHelpCircle,
  FiStar,
  FiRefreshCw,
} from "react-icons/fi";
import { TbShieldCheck } from "react-icons/tb";
import type {
  ChatMsg,
  ObjectionResponse,
  WireMsg,
} from "@/lib/objectionkiller";

const PLACEHOLDER =
  "Опишите ситуацию: что за клиент, что продаёте и какое возражение услышали…";
const EXAMPLE = "Клиент говорит «дорого» и уходит подумать.";

function toWire(messages: ChatMsg[]): WireMsg[] {
  return messages.map((m) =>
    m.role === "user"
      ? { role: "user", content: m.text }
      : { role: "model", content: JSON.stringify(m.data) }
  );
}

export default function ObjectionKillerTool() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
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
      const res = await fetch("/api/objectionkiller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: toWire(next) }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Что-то пошло не так. Попробуйте ещё раз.");
        return;
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", data: json as ObjectionResponse },
      ]);
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMessages([]);
    setInput("");
    setError(null);
  };

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard недоступен */
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const empty = messages.length === 0;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Диалог */}
      <div className="min-h-[280px] space-y-5">
        {empty && !loading && (
          <div className="card-glass flex flex-col items-center justify-center gap-3 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-secondary/25 text-primary-light ring-1 ring-inset ring-white/10">
              <TbShieldCheck size={28} aria-hidden="true" />
            </div>
            <p className="max-w-md text-slate-400">
              Опишите ситуацию с клиентом и возражение. Ассистент уточнит детали,
              а затем разберёт скрытую причину и даст готовые ответы.
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
            <AssistantMessage
              key={i}
              data={m.data}
              copied={copied}
              onCopy={copy}
              msgIndex={i}
            />
          )
        )}

        {loading && (
          <div className="flex items-center gap-3 text-slate-400">
            <div
              className="h-5 w-5 animate-spin rounded-full border-2 border-white/15 border-t-primary-light"
              aria-hidden="true"
            />
            Ассистент думает…
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

      {/* Ввод */}
      <div className="sticky bottom-4 mt-6">
        <div className="card-glass !bg-surface-2/95 p-3">
          <div className="flex items-end gap-2">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={empty ? PLACEHOLDER : "Ваш ответ ассистенту…"}
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
            onClick={reset}
            className="mx-auto mt-3 flex cursor-pointer items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-300"
          >
            <FiRefreshCw size={14} aria-hidden="true" />
            Новая ситуация
          </button>
        )}
      </div>
    </div>
  );
}

function AssistantMessage({
  data,
  copied,
  onCopy,
  msgIndex,
}: {
  data: ObjectionResponse;
  copied: string | null;
  onCopy: (id: string, text: string) => void;
  msgIndex: number;
}) {
  if (data.status === "clarifying") {
    return (
      <div className="flex justify-start">
        <div className="max-w-[90%] rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.04] p-4">
          <p className="text-slate-200">{data.message}</p>
          {data.questions.length > 0 && (
            <ul className="mt-3 space-y-2">
              {data.questions.map((q, i) => (
                <li key={i} className="flex items-start gap-2.5 text-slate-300">
                  <FiHelpCircle
                    size={16}
                    className="mt-1 shrink-0 text-primary-light"
                    aria-hidden="true"
                  />
                  {q}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  // status === "ready"
  return (
    <div className="space-y-4">
      {data.message && <p className="text-slate-400">{data.message}</p>}

      {data.hidden_reason && (
        <div className="card-glass p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Что стоит за возражением
          </h3>
          <p className="mt-2 leading-relaxed text-slate-200">
            {data.hidden_reason}
          </p>
        </div>
      )}

      {data.tactics.length > 0 && (
        <div className="space-y-3">
          {data.tactics.map((t, i) => {
            const id = `${msgIndex}-${i}`;
            return (
              <div key={i} className="card-glass p-5">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-heading font-bold text-white">
                    <span className="mr-2 text-primary-light">{i + 1}.</span>
                    {t.name}
                  </h4>
                  <button
                    type="button"
                    onClick={() => onCopy(id, t.script)}
                    className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-primary-light/40 hover:text-white"
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
                <blockquote className="mt-3 border-l-2 border-primary-light/50 bg-white/[0.03] py-2 pl-4 pr-2 italic leading-relaxed text-slate-100">
                  «{t.script}»
                </blockquote>
                {t.why && (
                  <p className="mt-2.5 text-sm text-slate-400">
                    <span className="text-slate-500">Почему работает:</span> {t.why}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {data.recommendation && (
        <div className="rounded-lg bg-gradient-to-b from-primary/15 to-transparent p-px shadow-glow-sm">
          <div className="flex items-start gap-3 rounded-[15px] bg-surface-2 p-5">
            <FiStar
              size={20}
              className="mt-0.5 shrink-0 text-warning"
              aria-hidden="true"
            />
            <div>
              <h3 className="font-heading font-bold text-white">Рекомендация</h3>
              <p className="mt-1.5 leading-relaxed text-slate-200">
                {data.recommendation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
