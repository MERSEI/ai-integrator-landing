"use client";

import { getTools } from "@/lib/content/tools";
import type { Locale } from "@/lib/i18n";
import { FiRefreshCw, TbBolt } from "@/components/icons";

/**
 * Плашка над готовым результатом, который показан до первого запуска.
 *
 * Нужна, чтобы пример нельзя было принять за собственный результат: человек
 * должен сразу видеть, что инструмент работает, и одним нажатием перейти к
 * своим данным.
 */
export default function SampleBanner({
  locale,
  onReset,
}: {
  locale: Locale;
  onReset: () => void;
}) {
  const c = getTools(locale).common;

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3">
      <p className="flex items-center gap-2 text-sm font-medium text-primary-light">
        <TbBolt size={18} aria-hidden="true" />
        {c.sampleBadge}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
      >
        <FiRefreshCw size={15} aria-hidden="true" />
        {c.sampleCta}
      </button>
    </div>
  );
}
