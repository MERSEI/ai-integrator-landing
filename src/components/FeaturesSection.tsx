"use client";

import { useState } from "react";
import Link from "next/link";
import { TbTrendingUp } from "react-icons/tb";
import { FiArrowRight } from "react-icons/fi";
import AppIcon from "./AppIcon";
import Reveal from "./Reveal";
import { APP_STATUS_CLASSES, getContent } from "@/lib/content";
import type { CategoryKey } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";

export default function FeaturesSection({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const t = content.features;
  const [category, setCategory] = useState<CategoryKey>("all");

  const allApps = [...content.featuredApps, ...content.standaloneApps];
  const apps =
    category === "all"
      ? allApps
      : allApps.filter((app) => app.category === category);

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-dark py-20 [content-visibility:auto] [contain-intrinsic-size:auto_900px] sm:py-28"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />
      <div className="container-section relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">{t.title}</h2>
          <p className="mt-4 text-lg text-secondary">{t.subtitle}</p>
        </Reveal>

        <div
          className="mt-10 flex flex-wrap justify-center gap-2"
          role="tablist"
          aria-label={t.categoriesLabel}
        >
          {content.categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              role="tab"
              aria-selected={category === cat.key}
              onClick={() => setCategory(cat.key)}
              className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-200 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                category === cat.key
                  ? "border-accent/60 bg-accent/15 text-primary"
                  : "border-white/10 bg-white/[0.03] text-secondary hover:border-white/20 hover:text-primary-light"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app, i) => (
            <Reveal key={app.id} delay={i * 0.07}>
              <article className="group flex h-full flex-col card-glass p-6 hover:border-white/[0.16]">
                <div className="flex items-start justify-between gap-3">
                  <AppIcon id={app.id} category={app.category} />
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${APP_STATUS_CLASSES[app.status]}`}
                  >
                    {app.status === "live" && (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-success" />
                      </span>
                    )}
                    {content.statusLabels[app.status]}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-xl font-bold tracking-tight text-white">
                  {app.name}{" "}
                  <span className="text-slate-400">— {app.tagline}</span>
                </h3>
                <p className="mt-2 flex-1 leading-relaxed text-slate-400">
                  {app.description}
                </p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="chip-result">
                    <TbTrendingUp size={16} aria-hidden="true" />
                    {app.result}
                  </p>
                  {app.href && (
                    <Link
                      href={localePath(locale, app.href)}
                      className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary-light transition-colors hover:text-white"
                    >
                      {t.open}
                      <FiArrowRight size={15} aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {category === "all" && (
          <Reveal delay={0.1} className="mt-8">
            <div className="card-glass flex flex-wrap items-center justify-center gap-3 p-5 text-center sm:justify-between sm:text-left">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                {t.soonTitle}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {content.soonApps.map((app) => (
                  <span
                    key={app.id}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-slate-300 opacity-70"
                  >
                    <span className="font-semibold text-white">{app.name}</span>
                    <span className="text-slate-500">— {app.tagline}</span>
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
