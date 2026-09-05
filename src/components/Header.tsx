"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import AppIcon from "./AppIcon";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import { APP_STATUS_CLASSES, CONTACTS, getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { FiArrowRight, FiChevronDown, HiMenu, HiX, TbBrandTelegram } from "./icons";

export default function Header({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const t = content.nav;
  const home = localePath(locale, "/");

  const navLinks = [
    { href: "#how-it-works", label: t.howItWorks },
    { href: "#calculator", label: t.calculator },
    { href: "#pricing", label: t.pricing },
    { href: "#faq", label: t.faq },
  ];

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
    <header className="animate-header-in fixed inset-x-0 top-0 z-50 h-[72px] border-b border-white/10 bg-black/60 backdrop-blur-[20px]">
      <div
        className="animate-header-line absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-transparent via-accent-blue/60 to-transparent"
        aria-hidden="true"
      />
      <div className="container-section flex h-full items-center justify-between">
        <div className="animate-fade-up [animation-delay:0.15s]">
          <Link href={home} className="flex cursor-pointer items-center">
            <Logo className="h-8 w-auto sm:h-9 md:h-7" />
          </Link>
        </div>

        {/* Пункты меню проявляются по очереди — задержку задаёт
            animation-delay, поэтому JS-библиотека для этого не нужна. */}
        <nav className="hidden items-center gap-1 md:flex" aria-label={t.mainNavLabel}>
          <div ref={appsRef} className="animate-fade-up relative [animation-delay:0.25s]">
            <button
              type="button"
              onClick={() => setAppsOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={appsOpen}
              className="flex cursor-pointer items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-white/5 hover:text-white md:px-3"
            >
              {t.apps}
              <FiChevronDown
                size={15}
                className={`transition-transform duration-300 ease-premium ${appsOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            {appsOpen && (
              <div className="animate-dropdown-in absolute left-1/2 top-full mt-3 w-[560px] -translate-x-1/2 rounded-lg border border-white/[0.08] bg-surface-2 p-4 shadow-card">
                  <div className="grid grid-cols-2 gap-1">
                    {content.featuredApps.map((app) => (
                      <a
                        key={app.id}
                        href={
                          app.href
                            ? localePath(locale, app.href)
                            : `${home}#features`
                        }
                        onClick={() => setAppsOpen(false)}
                        className="flex items-start gap-3 rounded-md p-3 transition-colors duration-200 hover:bg-white/5"
                      >
                        <AppIcon id={app.id} category={app.category} size={36} />
                        <span>
                          <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                            {app.name}
                            <span
                              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none ${APP_STATUS_CLASSES[app.status]}`}
                            >
                              {content.statusLabels[app.status]}
                            </span>
                          </span>
                          <span className="block text-xs text-slate-400">
                            {app.tagline}
                          </span>
                        </span>
                      </a>
                    ))}
                  </div>
                  <div className="mt-2 border-t border-white/10 pt-2">
                    <p className="px-3 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-secondary">
                      {t.moreTools}
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {content.standaloneApps.map((app) => (
                        <a
                          key={app.id}
                          href={
                            app.href
                              ? localePath(locale, app.href)
                              : `${home}#features`
                          }
                          onClick={() => setAppsOpen(false)}
                          className="flex items-center justify-between gap-2 rounded-md p-2.5 transition-colors duration-200 hover:bg-white/5"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-white">
                              {app.name}
                            </span>
                            <span className="block truncate text-xs text-slate-400">
                              {app.tagline}
                            </span>
                          </span>
                          <span
                            className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none ${APP_STATUS_CLASSES[app.status]}`}
                          >
                            {content.statusLabels[app.status]}
                          </span>
                        </a>
                      ))}
                      {content.soonApps.map((app) => (
                        <span
                          key={app.id}
                          className="flex items-center justify-between gap-2 rounded-md p-2.5 opacity-60"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-slate-300">
                              {app.name}
                            </span>
                            <span className="block truncate text-xs text-secondary">
                              {app.tagline}
                            </span>
                          </span>
                          <span className="shrink-0 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none text-slate-400">
                            {t.soonBadge}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <a
                    href={`${home}#features`}
                    onClick={() => setAppsOpen(false)}
                    className="mt-2 flex items-center justify-center gap-1.5 rounded-md py-2.5 text-sm font-semibold text-primary-light transition-colors duration-200 hover:bg-white/5"
                  >
                    {t.seeAllApps}
                    <FiArrowRight size={15} aria-hidden="true" />
                  </a>
              </div>
            )}
          </div>

          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              style={{ animationDelay: `${0.33 + i * 0.08}s` }}
              className="animate-fade-up rounded-md px-4 py-2 text-center text-sm font-medium text-primary-light transition-colors duration-200 hover:bg-white/5 hover:text-white md:px-3"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="animate-fade-up hidden items-center gap-3 [animation-delay:0.45s] md:flex md:gap-2">
          <LanguageSwitcher locale={locale} className="md:h-8" />
          <a
            href={`https://t.me/${CONTACTS.telegram.replace("@", "")}`}
            aria-label={t.telegram}
            title={t.telegram}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-300 transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:border-accent-blue/50 hover:text-white hover:shadow-glow-accent-sm md:h-8"
          >
            <TbBrandTelegram size={19} />
          </a>
          <a
            href="#final-cta"
            className="btn-primary text-center !min-h-10 !px-5 !py-2 text-sm md:!px-4 md:!py-1 md:!min-h-8"
          >
            {t.cta}
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher locale={locale} />
          <button
            type="button"
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-md text-slate-200 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
            aria-label={open ? t.closeMenu : t.openMenu}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <HiX size={26} /> : <HiMenu size={26} />}
          </button>
        </div>
      </div>

      {/* Меню не размонтируется, а сворачивается: так плавно работает и
          открытие, и закрытие, без библиотеки анимации. */}
      <div className={`collapse border-t border-white/5 bg-dark/95 backdrop-blur-xl md:hidden ${open ? "collapse-open" : "border-t-0"}`}>
        <nav aria-label={t.mobileNavLabel} aria-hidden={!open}>
          <div className="px-4 pb-6 pt-2">
            <a
              href="#features"
              onClick={() => setOpen(false)}
              className="block rounded-md px-2 py-3 text-base font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              {t.apps}
            </a>
            {navLinks.map((link) => (
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
              {t.telegram}
            </a>
            <a
              href="#final-cta"
              onClick={() => setOpen(false)}
              className="btn-primary mt-3 w-full"
            >
              {t.cta}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
