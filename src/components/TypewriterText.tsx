"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Печатает текст посимвольно, когда попадает в зону видимости.
 * Полный текст всегда в разметке (sr-only + invisible-распорка), поэтому
 * скринридеры и поисковики видят его сразу, а высота блока не скачет.
 */
export default function TypewriterText({
  text,
  className,
  speed = 45,
  delay = 0,
  cursor = true,
}: {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const done = count >= text.length;

  useEffect(() => {
    if (reduced) {
      setCount(text.length);
      return;
    }
    if (!inView) return;

    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [inView, text.length, speed, delay, reduced]);

  return (
    <span ref={ref} className={`relative inline-block ${className ?? ""}`}>
      <span className="sr-only">{text}</span>
      <span className="invisible" aria-hidden="true">
        {text}
      </span>
      <span className="absolute inset-0" aria-hidden="true">
        {text.slice(0, count)}
        {cursor && !reduced && (
          <span
            className={`ml-0.5 inline-block h-[0.85em] w-[2px] translate-y-[0.1em] rounded-full bg-accent-blue align-baseline ${
              done ? "animate-blink-fade" : "animate-blink"
            }`}
          />
        )}
      </span>
    </span>
  );
}
