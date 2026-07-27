"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], .cursor-pointer, input, select, textarea, summary';

/** Кастомный курсор: точка следует за мышью 1:1, кольцо-глоу — с лёгкой инерцией. */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    setEnabled(true);
    document.body.classList.add("cc-active");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const show = () => {
      dotRef.current?.style.setProperty("opacity", "1");
      ringRef.current?.style.setProperty("opacity", "1");
    };
    const hide = () => {
      dotRef.current?.style.setProperty("opacity", "0");
      ringRef.current?.style.setProperty("opacity", "0");
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dotRef.current?.style.setProperty(
        "transform",
        `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`
      );
    };

    const onOver = (e: MouseEvent) => {
      const isInteractive = !!(e.target as HTMLElement).closest(INTERACTIVE_SELECTOR);
      ringRef.current?.classList.toggle("cc-ring-hover", isInteractive);
      dotRef.current?.classList.toggle("cc-dot-hover", isInteractive);
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;
      ringRef.current?.style.setProperty(
        "transform",
        `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`
      );
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseenter", show);
      document.body.classList.remove("cc-active");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="cc-ring" aria-hidden="true" />
      <div ref={dotRef} className="cc-dot" aria-hidden="true" />
    </>
  );
}
