import { FiCheck, FiShield } from "react-icons/fi";
import Reveal from "./Reveal";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

export default function PricingSection({ locale }: { locale: Locale }) {
  const t = getContent(locale).pricing;

  return (
    <section
      id="pricing"
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

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
          {t.tiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.1} className="h-full">
              <div
                className={`relative h-full rounded-lg transition-all duration-300 ease-premium hover:-translate-y-1 ${
                  tier.popular
                    ? "bg-gradient-to-b from-accent via-accent/40 to-transparent p-px"
                    : ""
                }`}
              >
                <div
                  className={`relative flex h-full flex-col rounded-[15px] p-8 ${
                    tier.popular
                      ? "bg-gradient-to-b from-surface-2 to-dark"
                      : "card-glass hover:border-primary-light/30"
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                      {t.popularBadge}
                    </span>
                  )}
                  <h3 className="font-heading text-xl font-bold tracking-tight text-white">
                    {tier.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{tier.audience}</p>
                  <p className="mt-6">
                    <span className="font-heading text-5xl font-extrabold tracking-tight text-white">
                      ${tier.setup}
                    </span>
                    <span className="text-slate-400">{t.setupSuffix}</span>
                  </p>
                  <p className="mt-1.5 text-sm text-slate-400">
                    {t.thenPrefix}{" "}
                    <span className="font-semibold text-primary-light">
                      ${tier.price}
                      {t.perMonth}
                    </span>{" "}
                    {t.supportSuffix}
                  </p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-slate-300">
                        <span
                          className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success"
                          aria-hidden="true"
                        >
                          <FiCheck size={12} />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {/* Акцентная кнопка только у популярного тарифа — иначе три
                      одинаковых CTA не ведут глаз. */}
                  <a
                    href="#final-cta"
                    className={`mt-8 w-full ${tier.popular ? "btn-primary" : "btn-secondary"}`}
                  >
                    {tier.cta}
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-10 flex max-w-xl items-center justify-center gap-2.5 rounded-lg border border-success/20 bg-success/10 px-5 py-3.5 text-center text-sm font-medium text-success">
          <FiShield size={18} className="shrink-0" aria-hidden="true" />
          {t.guarantee}
        </Reveal>

        <Reveal className="mt-6 text-center text-slate-500">
          <p>{t.footnote}</p>
        </Reveal>
      </div>
    </section>
  );
}
