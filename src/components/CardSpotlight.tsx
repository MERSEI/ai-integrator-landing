"use client";

import { useRef, useState, type ReactNode } from "react";

/**
 * Подсветка карточки за курсором: мягкое пятно света идёт за мышью и гаснет,
 * когда курсор уходит. Приём делает сетку карточек «живой», не добавляя ни
 * одной анимации, которая крутится сама по себе.
 *
 * Позиция пишется в CSS-переменные, а не в state каждого дочернего элемента —
 * перерисовывается только оболочка. На тач-устройствах и при
 * prefers-reduced-motion эффект не мешает: он ничего не двигает, только
 * меняет прозрачность градиента.
 */
export default function CardSpotlight({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  return (
    <div
      ref={ref}
      className={`group/spotlight relative ${className}`}
      onPointerMove={(e) => {
        if (e.pointerType === "touch") return;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
        el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
        if (!visible) setVisible(true);
      }}
      onPointerLeave={() => setVisible(false)}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300"
        style={{
          opacity: visible ? 1 : 0,
          background:
            "radial-gradient(220px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(129,140,248,0.14), transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}
