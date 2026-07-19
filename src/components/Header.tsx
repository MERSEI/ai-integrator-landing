"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiMenu, HiX } from "react-icons/hi";
import { FiChevronDown, FiArrowRight } from "react-icons/fi";
import { TbBrandTelegram } from "react-icons/tb";
import Logo from "./Logo";
import { FEATURED_APPS, CONTACTS } from "@/lib/content";

const NAV_LINKS = [
  { href: "#how-it-works", label: "Как это работает" },
  { href: "#pricing", label: "Цены" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const appsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!appsOpen) return;
    const onClick = (e: MouseEvent) => {
      if (appsRef.current && !appsRef.current.contains(e.target as Node)) {
        setAppsOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAppsOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [appsOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[72px] border-b border-white/10 bg-dark/95 backdrop-blur-lg">
      <div
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-light/50 to-transparent"
        aria-hidden="true"
      />
      <div className="container-section flex h-full items-center justify-between">
        <Link href="/" className="flex cursor-pointer items-center">
          <Logo className="h-8 w-auto sm:h-9" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Основная навигация">
          <div ref={appsRef} className="relative">
            <button
              type="button"
              onClick={() => setAppsOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={appsOpen}
              className="flex cursor-pointer items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-white/5 hover:text-white"
            >
              Приложения
              <FiChevronDown
                size={15}
                className={`transition-transform duration-300 ease-premium ${appsOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            {appsOpen && (
              <div className="absolute left-1/2 top-full mt-3 w-[560px] -translate-x-1/2 card-glass !bg-surface-2/95 p-4 shadow-card">
                <div className="grid grid-cols-2 gap-1">
                  {FEATURED_APPS.map((app) => {
                    return (
                      <a
                        key={app.id}
                        href="#features"
                        onClick={() => setAppsOpen(false)}
                        className="flex items-start gap-3 rounded-md p-3 transition-colors duration-200 hover:bg-white/5"
                      >
                        <span className="h-9 w-9 shrink-0 overflow-hidden rounded-md ring-1 ring-inset ring-white/10">
                          <Image
                            src={app.image}
                            alt=""
                            width={36}
                            height={36}
                            className="h-full w-full object-cover"
                          />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-white">
                            {app.name}
                          </span>
                          <span className="block text-xs text-slate-400">
                            {app.tagline}
                          </span>
                        </span>
                      </a>
                    );
                  })}
                </div>
                <a
                  href="#features"
                  onClick={() => setAppsOpen(false)}
                  className="mt-2 flex items-center justify-center gap-1.5 rounded-md py-2.5 text-sm font-semibold text-primary-light transition-colors duration-200 hover:bg-white/5"
                >
                  Смотреть все 15 приложений
                  <FiArrowRight size={15} aria-hidden="true" />
                </a>
              </div>
            )}
          </div>

          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-4 py-2 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={`https://t.me/${CONTACTS.telegram.replace("@", "")}`}
            aria-label="Написать в Telegram"
            title="Написать в Telegram"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-300 transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:border-primary-light/40 hover:text-white"
          >
            <TbBrandTelegram size={19} />
          </a>
          <a href="#final-cta" className="btn-primary !min-h-10 !px-5 !py-2 text-sm">
            Free Trial
          </a>
        </div>

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
          <a
            href="#features"
            onClick={() => setOpen(false)}
            className="block rounded-md px-2 py-3 text-base font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            Приложения
          </a>
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
            href={`https://t.me/${CONTACTS.telegram.replace("@", "")}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-md px-2 py-3 text-base font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <TbBrandTelegram size={20} aria-hidden="true" />
            Написать в Telegram
          </a>
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
