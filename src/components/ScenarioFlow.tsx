"use client";

import { useState } from "react";
import { getContent } from "@/lib/content";
import type { ScenarioNodeKind } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n";
import { FiCheckCircle, FiCpu, FiZap , type IconComponent } from "./icons";

/** Цвет кодирует роль узла в цепочке: событие → работа AI → результат. */
const KIND: Record<ScenarioNodeKind, { Icon: IconComponent; chip: string }> = {
  trigger: {
    Icon: FiZap,
    chip: "bg-accent-blue/10 text-accent-blue ring-accent-blue/25",
  },
  agent: {
    Icon: FiCpu,
    chip: "bg-accent-violet/10 text-accent-violet ring-accent-violet/25",
  },
  action: {
    Icon: FiCheckCircle,
    chip: "bg-success/10 text-success ring-success/25",
  },
};

export default function ScenarioFlow({ locale }: { locale: Locale }) {
  const t = getContent(locale).scenarios;
  const [activeId, setActiveId] = useState(t.items[0].id);
  const active = t.items.find((s) => s.id === activeId) ?? t.items[0];

  return (
    <div className="w-full">
      {/* Переключатель сценариев */}
      <div
        className="no-scrollbar mx-auto flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-full border border-white/[0.08] bg-white/[0.03] p-1"
        role="tablist"
        aria-label={t.title}
      >
        {t.items.map((s) => {
          const isActive = s.id === active.id;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(s.id)}
              className={`shrink-0 cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isActive
                  ? "bg-white/[0.09] text-primary"
                  : "text-secondary hover:text-primary-light"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Полотно: точечная сетка как у визуальных редакторов сценариев */}
      <div className="relative mt-6 overflow-hidden rounded-xl border border-white/[0.08] bg-surface/60 p-5 sm:p-7">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] [background-size:16px_16px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,transparent_35%,rgba(2,6,23,0.85)_100%)]"
          aria-hidden="true"
        />

        <ol className="relative flex flex-col items-stretch gap-0 lg:flex-row lg:items-center">
          {active.nodes.map((node, i) => {
            const k = KIND[node.kind];
            const last = i === active.nodes.length - 1;
            return (
              <li
                key={`${active.id}-${i}`}
                className="flex flex-col items-stretch lg:flex-1 lg:flex-row lg:items-center"
              >
                <div
                  className="animate-fade-up flex-1 rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-transparent p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset ${k.chip}`}
                  >
                    <k.Icon size={11} aria-hidden="true" />
                    {t.kindLabels[node.kind]}
                  </span>
                  <p className="mt-2.5 text-sm font-medium leading-snug text-primary">
                    {node.label}
                  </p>
                  <p className="mt-1 text-xs text-secondary">{node.meta}</p>
                </div>

                {!last && (
                  <div
                    className="relative mx-auto h-6 w-px shrink-0 bg-gradient-to-b from-white/20 to-white/20 lg:mx-2 lg:h-px lg:w-8 lg:bg-gradient-to-r"
                    aria-hidden="true"
                  >
                    {/* Импульс, бегущий по связи; замирает при reduced-motion */}
                    <span
                      className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent-violet shadow-[0_0_8px_2px_rgba(16,185,129,0.55)] motion-safe:animate-flow-dot-y lg:left-0 lg:top-1/2 lg:translate-x-0 lg:-translate-y-1/2 lg:motion-safe:animate-flow-dot-x"
                      style={{ animationDelay: `${i * 260}ms` }}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
