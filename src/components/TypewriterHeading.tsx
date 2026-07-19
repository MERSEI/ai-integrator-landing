"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

type Segment = { text: string; className?: string };

/**
 * Печатает сегменты текста посимвольно с мигающим курсором.
 * Полный текст всегда в разметке (sr-only + невидимый для размеров) —
 * SEO и скринридеры видят заголовок сразу, CLS отсутствует.
 */
export default function TypewriterHeading({
  segments,
  speed = 38,
  startDelay = 350,
  className,
}: {
  segments: Segment[];
  speed?: number;
  startDelay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const fullText = segments.map((s) => s.text).join("");
  const [count, setCount] = useState(0);
  const done = count >= fullText.length;

  useEffect(() => {
    if (reduced) {
      setCount(fullText.length);
      return;
    }
    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= fullText.length) clearInterval(interval);
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [fullText.length, speed, startDelay, reduced]);

  // Раскладываем счётчик напечатанных символов по сегментам.
  let remaining = count;
  const typed = segments.map((s) => {
    const take = Math.max(0, Math.min(s.text.length, remaining));
    remaining -= take;
    return { ...s, visible: s.text.slice(0, take) };
  });

  return (
    <h1 className={`relative ${className ?? ""}`}>
      <span className="sr-only">{fullText}</span>
      <span className="invisible" aria-hidden="true">
        {segments.map((s, i) => (
          <span key={i} className={s.className}>
            {s.text}
          </span>
        ))}
      </span>
      <span className="absolute inset-0" aria-hidden="true">
        {typed.map((s, i) => (
          <span key={i} className={s.className}>
            {s.visible}
          </span>
        ))}
        <span
          className={`ml-1 inline-block h-[0.9em] w-[3px] translate-y-[0.12em] rounded-full bg-primary-light align-baseline ${
            done ? "animate-blink-fade" : "animate-blink"
          }`}
        />
      </span>
    </h1>
  );
}
