import { FiCheck } from "react-icons/fi";
import Reveal from "./Reveal";
import { PRICING_TIERS } from "@/lib/content";

export default function PricingSection() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-dark py-20 sm:py-28">
      <div
        className="pointer-events-none absolute left-1/2 top-1/4 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-white/[0.05] blur-[160px]"
        aria-hidden="true"
      />
      <div className="container-section relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">Простые цены без скрытых платежей</h2>
          <p className="mt-4 text-lg text-slate-400">
            Первый месяц для новых клиентов — бесплатно
          </p>
        </Reveal>

        <div className="mt-14 grid items-stretch gap-8 lg:grid-cols-3">
          {PRICING_TIERS.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.1} className="h-full">
              <div
                className={`relative h-full rounded-lg transition-all duration-300 ease-premium hover:-translate-y-1 ${
                  tier.popular
                    ? "bg-gradient-to-b from-primary via-secondary/60 to-transparent p-px shadow-glow"
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
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1 text-xs font-bold uppercase tracking-wide text-black shadow-glow-sm">
                      Popular
                    </span>
                  )}
                  <h3 className="font-heading text-xl font-bold tracking-tight text-white">
                    {tier.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{tier.audience}</p>
                  <p className="mt-6">
                    <span className="font-heading text-5xl font-extrabold tracking-tight text-white">
                      ${tier.price}
                    </span>
                    <span className="text-slate-400">/месяц</span>
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
                  <a
                    href="#final-cta"
                    className={`mt-8 ${tier.popular ? "btn-primary" : "btn-secondary"} w-full`}
                  >
                    {tier.cta}
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center text-slate-500">
          <p>
            Первый месяц бесплатно: если увидишь результаты — продолжаешь,
            если нет — ничего не платишь.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
