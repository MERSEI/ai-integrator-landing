"use client";

import { useState } from "react";
import Image from "next/image";
import { TbTrendingUp, TbRobot } from "react-icons/tb";
import Reveal from "./Reveal";
import { FEATURED_APPS, APP_CATEGORIES } from "@/lib/content";
import { APP_ICONS } from "@/lib/app-icons";

export default function FeaturesSection() {
  const [category, setCategory] = useState<string>("Все");

  const apps =
    category === "Все"
      ? FEATURED_APPS
      : FEATURED_APPS.filter((app) => app.category === category);

  return (
    <section id="features" className="relative overflow-hidden bg-dark py-20 sm:py-28">
      <div
        className="pointer-events-none absolute left-[-10%] top-1/4 h-[400px] w-[400px] rounded-full bg-secondary/10 blur-[130px]"
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
              className={`min-h-11 cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light ${
                category === cat
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-glow-sm"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:border-primary-light/40 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app, i) => {
            const Icon = APP_ICONS[app.icon] ?? TbRobot;
            return (
              <Reveal key={app.id} delay={i * 0.07}>
                <article className="group flex h-full flex-col card-glass p-6 transition-all duration-300 ease-premium hover:-translate-y-1.5 hover:border-primary-light/40 hover:shadow-glow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br from-primary/25 to-secondary/25 text-primary-light ring-1 ring-inset ring-white/10 transition-transform duration-300 ease-premium group-hover:scale-110">
                    <Icon size={26} aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 font-heading text-xl font-bold tracking-tight text-white">
                    {app.name}{" "}
                    <span className="text-slate-400">— {app.tagline}</span>
                  </h3>
                  <p className="mt-2 flex-1 leading-relaxed text-slate-400">
                    {app.description}
                  </p>
                  <p className="chip-result mt-5">
                    <TbTrendingUp size={16} aria-hidden="true" />
                    {app.result}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
