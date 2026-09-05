import Link from "next/link";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import { getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { FiArrowLeft } from "./icons";

export default function AppHeader({
  locale,
  badge,
}: {
  locale: Locale;
  badge?: string;
}) {
  const t = getContent(locale).nav;

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-white/10 bg-black/60 backdrop-blur-[20px]">
      <div
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-light/50 to-transparent"
        aria-hidden="true"
      />
      <div className="container-section flex h-full items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={localePath(locale, "/")} className="flex cursor-pointer items-center">
            <Logo className="h-8 w-auto" />
          </Link>
          {badge && (
            <span className="hidden rounded-full border border-primary-light/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-light sm:inline">
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} />
          <Link
            href={`${localePath(locale, "/")}#features`}
            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-white/5 hover:text-white"
          >
            <FiArrowLeft size={16} aria-hidden="true" />
            <span className="hidden sm:inline">{t.allApps}</span>
            <span className="sm:hidden">{t.back}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
