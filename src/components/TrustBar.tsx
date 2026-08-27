import { FiZap, FiClock, FiShield, FiLock } from "react-icons/fi";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

const ICONS = [FiZap, FiClock, FiShield, FiLock];

/**
 * Полоса проверяемых фактов сразу под hero. Ничего не выдумываем — все
 * четыре пункта уже подтверждены копирайтом в других секциях (features,
 * how-it-works, pricing.guarantee, faq) — здесь просто выносим их вперёд,
 * до того как посетитель решит, доверять сайту или нет.
 */
export default function TrustBar({ locale }: { locale: Locale }) {
  const t = getContent(locale).trustBar;

  return (
    <div className="relative border-y border-white/[0.06] bg-surface">
      <div className="container-section flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-4 text-sm text-slate-400 sm:justify-between">
        {t.items.map((item, i) => {
          const Icon = ICONS[i] ?? FiZap;
          return (
            <div key={item} className="flex items-center gap-2">
              <Icon className="shrink-0 text-primary-light" size={16} aria-hidden="true" />
              <span>{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
