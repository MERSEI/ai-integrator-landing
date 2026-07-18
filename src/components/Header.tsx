"use client";

import { useState } from "react";
import Link from "next/link";
import { HiMenu, HiX } from "react-icons/hi";

const NAV_LINKS = [
  { href: "#features", label: "Приложения" },
  { href: "#how-it-works", label: "Как это работает" },
  { href: "#pricing", label: "Цены" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-dark/80 backdrop-blur-md">
      <div className="container-section flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-secondary text-sm">
            AI
          </span>
          AI Integrator
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Основная навигация">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a href="#final-cta" className="btn-primary !min-h-10 !px-5 !py-2 text-sm">
            Free Trial
          </a>
        </nav>

        <button
          type="button"
          className="flex h-12 w-12 items-center justify-center text-slate-200 md:hidden"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <HiX size={26} /> : <HiMenu size={26} />}
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-white/5 bg-dark px-4 pb-6 pt-2 md:hidden"
          aria-label="Мобильная навигация"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-base font-medium text-slate-300 hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#final-cta"
            onClick={() => setOpen(false)}
            className="btn-primary mt-3 w-full"
          >
            Free Trial
          </a>
        </nav>
      )}
    </header>
  );
}
