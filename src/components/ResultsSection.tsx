import Image from "next/image";
import { FiStar, FiZap, FiTarget } from "react-icons/fi";
import Reveal from "./Reveal";
import StatCounter from "./StatCounter";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

const ADVANTAGE_ICONS = [FiZap, FiTarget];

export default function ResultsSection({ locale }: { locale: Locale }) {
  const t = getContent(locale).results;

  return (
    <section
      id="results"
      className="relative overflow-hidden bg-surface py-20 [content-visibility:auto] [contain-intrinsic-size:auto_900px] sm:py-28"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue/40 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[-25%] left-[-8%] h-[420px] w-[420px] rounded-full bg-white/[0.05] blur-[140px]"
        aria-hidden="true"
      />
      <div className="container-section relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">{t.title}</h2>
          <p className="mt-4 flex items-center justify-center gap-2 text-lg text-slate-400">
            <span className="flex gap-0.5 text-warning" aria-label={t.ratingAria}>
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar key={i} size={18} fill="currentColor" aria-hidden="true" />
              ))}
            </span>
            {t.rating}
          </p>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
          {t.advantages.map((adv, i) => {
            const Icon = ADVANTAGE_ICONS[i] ?? FiZap;
            return (
              <Reveal key={adv.title} delay={i * 0.1}>
                <div className="flex h-full items-start gap-3.5 card-glass p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent-blue/25 to-accent-violet/25 text-accent-blue ring-1 ring-inset ring-white/10">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-heading font-bold text-white">{adv.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">
                      {adv.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {t.testimonials.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.1}>
              <figure className="flex h-full flex-col card-glass p-6 transition-all duration-300 ease-premium hover:-translate-y-1 hover:border-primary-light/30">
                <blockquote className="flex-1 leading-relaxed text-slate-300">
                  «{item.quote}»
                </blockquote>
                <div className="chip-result mt-6 w-full justify-center py-2">
                  {item.result}
                </div>
                <figcaption className="mt-5 flex items-center gap-3">
                  <Image
                    src={item.image}
                    alt={t.portraitAlt(item.name)}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full border border-white/10 object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-sm text-slate-500">{item.company}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8 card-glass p-8 text-center md:grid-cols-4">
          {t.stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <p className="font-heading text-4xl font-extrabold tracking-tight text-gradient">
                <StatCounter value={stat.value} />
              </p>
              <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
