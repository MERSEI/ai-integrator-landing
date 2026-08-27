import Image from "next/image";
import Link from "next/link";
import { FiZap, FiTarget, FiArrowRight } from "react-icons/fi";
import Reveal from "./Reveal";
import { APP_STATUS_CLASSES, getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";

const ADVANTAGE_ICONS = [FiZap, FiTarget];

export default function ResultsSection({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const t = content.results;
  const liveApps = [...content.featuredApps, ...content.standaloneApps].filter(
    (app) => app.status === "live" && app.href
  );

  return (
    <section
      id="results"
      className="relative overflow-hidden bg-surface py-20 [content-visibility:auto] [contain-intrinsic-size:auto_900px] sm:py-28"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />
      <div className="container-section relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">{t.title}</h2>
          <p className="mt-4 text-lg text-slate-400">{t.subtitle}</p>
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

        <Reveal className="mt-16 card-glass p-8">
          <div className="text-center">
            <p className="font-heading text-xl font-bold text-white">
              {t.demoCta.title}
            </p>
            <p className="mt-1.5 text-sm text-slate-400">{t.demoCta.subtitle}</p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {liveApps.map((app) => (
              <Link
                key={app.id}
                href={localePath(locale, app.href!)}
                className="group flex flex-col gap-2 rounded-lg border border-white/10 bg-white/5 p-4 transition-all duration-300 ease-premium hover:-translate-y-0.5 hover:border-primary-light/40"
              >
                <span
                  className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${APP_STATUS_CLASSES[app.status]}`}
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-success" />
                  </span>
                  {content.statusLabels[app.status]}
                </span>
                <span className="text-sm font-semibold text-white">{app.name}</span>
                <span className="text-xs text-slate-500">{app.result}</span>
                <span className="mt-auto flex items-center gap-1 text-xs font-semibold text-primary-light transition-colors group-hover:text-white">
                  {t.demoCta.ctaLabel}
                  <FiArrowRight size={13} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
