import EmailForm from "./EmailForm";
import ScenarioFlow from "./ScenarioFlow";
import { FiCheck } from "react-icons/fi";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

export default function HeroSection({ locale }: { locale: Locale }) {
  const t = getContent(locale).hero;

  return (
    <section className="relative overflow-hidden bg-dark pt-[72px]">
      {/* Единственный фоновый приём: мягкое свечение из-под шапки. Заменяет
          видео-фон и дрейфующие блобы — страница легче на 2.8MB. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(ellipse_55%_100%_at_50%_0%,rgba(110,86,207,0.28),transparent_72%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />

      <div className="container-section relative flex flex-col items-center pb-24 pt-14 text-center sm:pb-28 sm:pt-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-primary-light">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-success" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          {t.badge}
        </p>

        {/* Заголовок сплошным цветом: градиент по тексту рвётся на переносах —
            каждая строка показывает свой кусок и последняя уходит в серый. */}
        <h1 className="mt-7 max-w-3xl font-heading text-4xl font-semibold leading-[1.08] tracking-tighter text-primary sm:text-5xl lg:text-[56px]">
          {t.headingLead}
          {t.headingAccent}
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-secondary">
          {t.subtitle}
        </p>

        <div className="mt-9 flex w-full justify-center">
          <EmailForm locale={locale} cta={t.cta} source="hero" />
        </div>

        <a
          href="#results"
          className="mt-4 text-sm font-medium text-primary-light transition-colors hover:text-white"
        >
          {t.secondaryCta}
        </a>

        <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-secondary">
          {t.trust.map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <FiCheck className="text-success" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>

        {/* Центральный визуал первого экрана: цепочка живого сценария. */}
        <div className="mt-16 w-full text-left">
          <ScenarioFlow locale={locale} />
        </div>
      </div>
    </section>
  );
}
