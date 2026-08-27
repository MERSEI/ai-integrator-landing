"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { FiChevronDown, FiArrowRight } from "react-icons/fi";
import { TbBrandTelegram } from "react-icons/tb";
import AppIcon from "./AppIcon";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import { APP_STATUS_CLASSES, CONTACTS, getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";

const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;

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
    <motion.header
      className="fixed inset-x-0 top-0 z-50 h-[72px] border-b border-white/10 bg-black/60 backdrop-blur-[20px]"
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE_PREMIUM }}
    >
      <motion.div
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-transparent via-accent-blue/60 to-transparent"
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, delay: 0.3, ease: EASE_PREMIUM }}
      />
      <div className="container-section flex h-full items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: EASE_PREMIUM }}
        >
          <Link href={home} className="flex cursor-pointer items-center">
            <Logo className="h-8 w-auto sm:h-9 md:h-7" />
          </Link>
        </motion.div>

        <motion.nav
          className="hidden items-center gap-1 md:flex"
          aria-label={t.mainNavLabel}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08, delayChildren: 0.25 },
            },
          }}
        >
          <motion.div
            ref={appsRef}
            className="relative"
            variants={{
              hidden: { opacity: 0, y: -10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.45, ease: EASE_PREMIUM },
              },
            }}
          >
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

            <AnimatePresence>
              {appsOpen && (
                <motion.div
                  className="absolute left-1/2 top-full mt-3 w-[560px] -translate-x-1/2 rounded-lg border border-white/[0.08] bg-surface-2 p-4 shadow-card"
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.25, ease: EASE_PREMIUM }}
                >
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
                    <p className="px-3 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                            <span className="block truncate text-xs text-slate-500">
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
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {navLinks.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="rounded-md px-4 py-2 text-center text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-white/5 hover:text-white md:px-3"
              variants={{
                hidden: { opacity: 0, y: -10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.45, ease: EASE_PREMIUM },
                },
              }}
            >
              {link.label}
            </motion.a>
          ))}
        </motion.nav>

        <motion.div
          className="hidden items-center gap-3 md:flex md:gap-2"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease: EASE_PREMIUM }}
        >
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
        </motion.div>

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

      <AnimatePresence>
        {open && (
          <motion.nav
            className="overflow-hidden border-t border-white/5 bg-dark/95 px-4 pb-6 pt-2 backdrop-blur-xl md:hidden"
            aria-label={t.mobileNavLabel}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE_PREMIUM }}
          >
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
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
