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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-dark/70 backdrop-blur-xl">
      <div className="container-section flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-2.5 font-heading text-lg font-extrabold tracking-tight text-white"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-secondary text-sm shadow-glow-sm">
            AI
          </span>
          AI Integrator
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Основная навигация">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative text-sm font-medium text-slate-300 transition-colors duration-200 hover:text-white"
            >
              {link.label}
              <span
                className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-primary-light to-secondary transition-all duration-300 ease-premium group-hover:w-full"
                aria-hidden="true"
              />
            </a>
          ))}
          <a href="#final-cta" className="btn-primary !min-h-10 !px-5 !py-2 text-sm">
            Free Trial
          </a>
        </nav>

        <button
          type="button"
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-md text-slate-200 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light md:hidden"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <HiX size={26} /> : <HiMenu size={26} />}
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-white/5 bg-dark/95 px-4 pb-6 pt-2 backdrop-blur-xl md:hidden"
          aria-label="Мобильная навигация"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-md px-2 py-3 text-base font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
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
