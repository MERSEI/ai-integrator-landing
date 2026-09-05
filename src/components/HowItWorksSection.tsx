import Reveal from "./Reveal";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { FiCheck } from "./icons";

export default function HowItWorksSection({ locale }: { locale: Locale }) {
  const t = getContent(locale).howItWorks;

  return (
    <section
      id="how-it-works"
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

        {/* Шаги проявляются по очереди: задержку задаёт transitionDelay у
            каждой обёртки, соединительная линия — та же анимация с нулевой
            задержкой. Всё на CSS, как и остальные появления на странице. */}
        <div className="relative mt-14 grid gap-8 md:grid-cols-3">
          <Reveal className="absolute left-[16%] right-[16%] top-14 hidden h-px md:block">
            <span
              className="block h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent"
              aria-hidden="true"
            />
          </Reveal>
          {t.steps.map((step, i) => (
            <Reveal key={step.number} delay={0.2 + i * 0.18}>
              <div className="relative h-full card-glass p-8 hover:border-white/[0.16]">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-4xl font-semibold tabular-nums tracking-tighter text-white/20">
                    {step.number}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-xs font-medium text-secondary">
                    {step.time}
                  </span>
                </div>
                <h3 className="mt-4 font-heading text-2xl font-semibold tracking-tighter text-primary">
                  {step.title}
                </h3>

                <ul className="mt-6 space-y-3">
                  {step.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-secondary"
                    >
                      <span
                        className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success"
                        aria-hidden="true"
                      >
                        <FiCheck size={12} />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <p className="mx-auto max-w-xl font-heading text-xl font-bold tracking-tight text-white">
            {t.outroLead}
            <span className="text-gradient">{t.outroAccent}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
