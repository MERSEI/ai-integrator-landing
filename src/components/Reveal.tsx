"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Появление блока при попадании в вьюпорт.
 *
 * Раньше здесь стоял framer-motion — ради одного эффекта, который повторяется
 * на странице три десятка раз, в бандл ехала вся библиотека анимации. Тот же
 * результат даёт CSS-переход плюс IntersectionObserver: наблюдатель нужен
 * ровно один на элемент и отключается сразу после первого срабатывания.
 *
 * Классы .reveal / .reveal-in описаны в globals.css, там же уважается
 * prefers-reduced-motion.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;

    // Без IntersectionObserver (очень старые движки) показываем сразу —
    // контент важнее анимации.
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { rootMargin: "-70px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  return (
    <div
      ref={ref}
      className={`reveal${shown ? " reveal-in" : ""}${className ? ` ${className}` : ""}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
