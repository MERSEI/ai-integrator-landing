import Reveal from "./Reveal";
import { PRICING_TIERS } from "@/lib/content";

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-[#131a33] py-20 sm:py-28">
      <div className="container-section">
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
                className={`relative flex h-full flex-col rounded-lg border p-8 ${
                  tier.popular
                    ? "border-primary bg-gradient-to-b from-primary/10 to-dark/60 shadow-xl shadow-primary/20"
                    : "border-white/10 bg-dark/60"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Popular
                  </span>
                )}
                <h3 className="font-heading text-xl font-bold text-white">
                  {tier.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{tier.audience}</p>
                <p className="mt-6">
                  <span className="font-heading text-5xl font-bold text-white">
                    ${tier.price}
                  </span>
                  <span className="text-slate-400">/месяц</span>
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-slate-300">
                      <span className="mt-0.5 text-success" aria-hidden="true">
                        ✓
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
