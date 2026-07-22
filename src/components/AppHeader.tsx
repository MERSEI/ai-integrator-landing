import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import Logo from "./Logo";

export default function AppHeader({ badge }: { badge?: string }) {
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-white/10 bg-dark/95 backdrop-blur-lg">
      <div
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-light/50 to-transparent"
        aria-hidden="true"
      />
      <div className="container-section flex h-full items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex cursor-pointer items-center">
            <Logo className="h-8 w-auto" />
          </Link>
          {badge && (
            <span className="hidden rounded-full border border-primary-light/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-light sm:inline">
              {badge}
            </span>
          )}
        </div>
        <Link
          href="/#features"
          className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-white/5 hover:text-white"
        >
          <FiArrowLeft size={16} aria-hidden="true" />
          <span className="hidden sm:inline">Все приложения</span>
          <span className="sm:hidden">Назад</span>
        </Link>
      </div>
    </header>
  );
}
