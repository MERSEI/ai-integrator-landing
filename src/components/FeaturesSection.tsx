"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { FEATURED_APPS, APP_CATEGORIES } from "@/lib/content";

export default function FeaturesSection() {
  const [category, setCategory] = useState<string>("Все");

  const apps =
    category === "Все"
      ? FEATURED_APPS
      : FEATURED_APPS.filter((app) => app.category === category);

  return (
    <section id="features" className="bg-dark py-20 sm:py-28">
      <div className="container-section">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">
            15 готовых AI-инструментов для вашего бизнеса
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Выберите нужные приложения и начните работать через 48 часов
          </p>
        </Reveal>

        <div
          className="mt-10 flex flex-wrap justify-center gap-3"
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
              className={`min-h-12 rounded-full px-5 py-2 text-sm font-medium transition ${
                category === cat
                  ? "bg-primary text-white"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app, i) => (
            <Reveal key={app.id} delay={i * 0.06}>
              <article className="group flex h-full flex-col rounded-lg border border-white/10 bg-[#151d38] p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
                <div className="text-4xl" aria-hidden="true">
                  {app.icon}
                </div>
                <h3 className="mt-4 font-heading text-xl font-bold text-white">
                  {app.name} — {app.tagline}
                </h3>
                <p className="mt-2 flex-1 text-slate-400">{app.description}</p>
                <p className="mt-4 inline-flex w-fit rounded-full bg-success/10 px-3 py-1 text-sm font-semibold text-success">
                  {app.result}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
