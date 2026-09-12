"use client";

import { useEffect, useRef } from "react";

/**
 * Кинематографичная 3D-сцена первого экрана: несколько узлов на разной
 * «глубине» соединены тонкими лучами (абстрактная нейросеть) и слегка
 * отъезжают/поворачиваются при скролле — эффект движения камеры мимо
 * объекта, а не просто fade.
 *
 * Трансформы каждого кадра пишутся напрямую в DOM-стиль через rAF, а не
 * через React state — скролл не запускает реконсиляцию и не размножает
 * ре-рендеры родителя (см. комментарий в Reveal.tsx про отказ от
 * framer-motion ради веса бандла).
 */
export default function HeroScene3D() {
  const rootRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const layers = root.querySelectorAll<HTMLElement>("[data-depth]");
    const section = root.closest("section");
    if (!layers.length || !section) return;

    const tick = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height || 1;
      // 0 у верхней границы экрана, 1 — когда секция целиком проскроллена.
      const progress = Math.min(1, Math.max(0, -rect.top / total));

      layers.forEach((el) => {
        const depth = Number(el.dataset.depth ?? 0);
        const y = progress * depth * -90;
        const rotate = progress * depth * 8;
        const scale = 1 + progress * depth * 0.08;
        el.style.transform = `translate3d(0, ${y}px, 0) rotateX(${rotate}deg) scale(${scale})`;
      });

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-x-0 top-0 h-[720px] overflow-hidden [perspective:1400px]"
      aria-hidden="true"
    >
      {/* Дальний слой: разреженные узлы, почти неподвижны. */}
      <div
        data-depth="0.4"
        className="absolute inset-0 will-change-transform"
      >
        <span className="absolute left-[8%] top-[18%] h-1.5 w-1.5 rounded-full bg-accent-blue/70 shadow-[0_0_14px_3px_rgba(129,140,248,0.45)]" />
        <span className="absolute right-[12%] top-[30%] h-1 w-1 rounded-full bg-success/70 shadow-[0_0_12px_3px_rgba(16,185,129,0.45)]" />
        <span className="absolute left-[22%] top-[46%] h-1 w-1 rounded-full bg-white/50 shadow-[0_0_10px_2px_rgba(255,255,255,0.3)]" />
      </div>

      {/* Средний слой: узлы связаны лучами — читается как граф/нейросеть. */}
      <svg
        data-depth="0.85"
        className="absolute inset-0 h-full w-full will-change-transform"
        viewBox="0 0 1200 720"
        preserveAspectRatio="xMidYMin slice"
        fill="none"
      >
        <defs>
          <linearGradient id="scene-link" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0" />
            <stop offset="50%" stopColor="#818CF8" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="scene-node" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C7D2FE" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g stroke="url(#scene-link)" strokeWidth="1">
          <path d="M140 120 L360 210 L600 95" />
          <path d="M600 95 L860 190 L1080 110" />
          <path d="M360 210 L520 340" />
          <path d="M860 190 L760 350" />
          <path d="M520 340 L760 350" />
        </g>

        {[
          [140, 120],
          [360, 210],
          [600, 95],
          [860, 190],
          [1080, 110],
          [520, 340],
          [760, 350],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={i % 3 === 0 ? 5 : 3.5}
            fill="url(#scene-node)"
            opacity={0.85}
          />
        ))}
      </svg>

      {/* Ближний слой: мягкие объёмные засветы — дают сцене толщину и
          премиальный «стеклянный» блик, движутся заметнее остальных. */}
      <div
        data-depth="1.4"
        className="absolute inset-0 will-change-transform"
      >
        <div className="absolute left-[58%] top-[8%] h-40 w-40 rounded-full bg-accent/25 blur-[70px]" />
        <div className="absolute left-[6%] top-[36%] h-32 w-32 rounded-full bg-success/20 blur-[60px]" />
      </div>
    </div>
  );
}
