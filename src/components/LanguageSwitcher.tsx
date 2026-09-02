"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

/**
 * Переключатель RU/EN. Ведёт на ту же страницу в другом языке, а не на главную:
 * со /en/apps/poaching попадаешь на /apps/poaching.
 */
export default function LanguageSwitcher({
  locale,
  className = "",
}: {
  locale: Locale;
  className?: string;
}) {
  const pathname = usePathname() ?? "/";
  const t = getContent(locale).nav;

  // Текущий путь без префикса локали — общая часть для обоих языков.
  const basePath = pathname === "/en" ? "/" : pathname.replace(/^\/en(?=\/)/, "");
  const target = locale === "ru" ? `/en${basePath === "/" ? "" : basePath}` : basePath;

  return (
    <Link
      href={target || "/"}
      hrefLang={locale === "ru" ? "en" : "ru"}
      aria-label={t.switchLanguage}
      title={t.switchLanguage}
      className={`flex h-10 cursor-pointer items-center justify-center gap-1 rounded-md border border-white/10 bg-white/5 px-3 text-sm font-semibold text-slate-300 transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:border-accent-blue/50 hover:text-white hover:shadow-glow-accent-sm ${className}`}
    >
      <span className={locale === "ru" ? "text-white" : ""}>RU</span>
      <span className="text-secondary" aria-hidden="true">
        /
      </span>
      <span className={locale === "en" ? "text-white" : ""}>EN</span>
    </Link>
  );
}
