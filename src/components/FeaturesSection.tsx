"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TbTrendingUp } from "react-icons/tb";
import {
  FiArrowRight,
  FiEdit3,
  FiSend,
  FiInbox,
  FiWifi,
  FiMessageSquare,
  FiTrendingUp,
} from "react-icons/fi";
import Reveal from "./Reveal";
import {
  FEATURED_APPS,
  STANDALONE_APPS,
  SOON_APPS,
  APP_CATEGORIES,
  APP_STATUS_META,
} from "@/lib/content";

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean | "true" | "false" }>> = {
  persona: FiEdit3,
  followup: FiSend,
  inbox: FiInbox,
  radar: FiWifi,
  comment: FiMessageSquare,
  trend: FiTrendingUp,
};

const ALL_APPS = [...FEATURED_APPS, ...STANDALONE_APPS];

export default function FeaturesSection() {
  const [category, setCategory] = useState<string>("Все");

  const apps =
    category === "Все"
      ? ALL_APPS
      : ALL_APPS.filter((app) => app.category === category);

  return (
    <section id="features" className="relative overflow-hidden bg-dark py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue/40 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-[-10%] top-1/4 h-[400px] w-[400px] rounded-full bg-white/[0.04] blur-[130px]"
        aria-hidden="true"
      />
      <div className="container-section relative">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="section-title">
              15 готовых AI-инструментов для вашего бизнеса
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              Выберите нужные приложения и начните работать через 48 часов —
              каждый бот берёт на себя свою часть рутины: лидов, аналитику,
              переписку и контент.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-xl bg-primary/10 blur-2xl"
                aria-hidden="true"
              />
              <Image
                src="/images/features.jpg"
                alt="Команда AI-ботов помогает в работе с лидами, аналитикой, письмами и контентом"
                width={1280}
                height={714}
                className="relative rounded-xl border border-white/10 shadow-card"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>

        <div
          className="mt-14 flex flex-wrap justify-center gap-3"
          role="tablist"
          aria-label="Категории приложений"
        >
          {APP_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={category === cat}
              onClick={() => setCategory(cat)}
              className={`min-h-11 cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                category === cat
                  ? "bg-white text-black shadow-glow-sm"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:border-white/40 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app, i) => {
            const href = "href" in app ? app.href : undefined;
            const status = APP_STATUS_META[app.status];
            const Icon = "icon" in app ? ICONS[app.icon] : null;
            return (
              <Reveal key={app.id} delay={i * 0.07}>
                <article className="group flex h-full flex-col card-glass p-6 transition-all duration-300 ease-premium hover:-translate-y-1 hover:border-accent-blue hover:shadow-glow-accent">
                  <div className="flex items-start justify-between">
                    <div className="h-32 w-32 overflow-hidden rounded-xl ring-1 ring-inset ring-white/10 transition-transform duration-300 ease-premium group-hover:scale-110">
                      {"image" in app ? (
                        <Image
                          src={app.image}
                          alt=""
                          width={128}
                          height={128}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-blue/20 to-accent-violet/20 text-accent-blue">
                          {Icon && <Icon size={56} aria-hidden="true" />}
                        </div>
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                    >
                      {app.status === "live" && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-success" />
                        </span>
                      )}
                      {status.label}
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
                    {href && (
                      <Link
                        href={href}
                        className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary-light transition-colors hover:text-white"
                      >
                        Открыть
                        <FiArrowRight size={15} aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {category === "Все" && (
          <Reveal delay={0.1} className="mt-8">
            <div className="card-glass flex flex-wrap items-center justify-center gap-3 p-5 text-center sm:justify-between sm:text-left">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Скоро в каталоге
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {SOON_APPS.map((app) => (
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
