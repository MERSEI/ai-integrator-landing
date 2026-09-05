import Reveal from "./Reveal";
import TelegramButton from "./TelegramButton";
import CardSpotlight from "./CardSpotlight";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { FiCheck, FiInfo, FiShield } from "./icons";

/**
 * Подсказка «из чего складывается цена» — на CSS, без клиентского JS: секция
 * остаётся серверной, а раскрытие работает и по наведению, и с клавиатуры
 * (focus-within на обёртке).
 */
function PriceHint({ label, text }: { label: string; text: string }) {
  return (
    <span className="group relative inline-flex align-middle">
      <button
        type="button"
        aria-label={label}
        className="ml-1.5 cursor-help rounded-full p-0.5 text-secondary transition-colors hover:text-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <FiInfo size={14} aria-hidden="true" />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 rounded-lg border border-white/10 bg-surface-2 p-3 text-left text-xs font-normal leading-relaxed text-primary-light opacity-0 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.8)] transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}

export default function PricingSection({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const t = content.pricing;

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-dark py-20 [content-visibility:auto] [contain-intrinsic-size:auto_900px] sm:py-28"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-40 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-accent/12 blur-[120px]"
        aria-hidden="true"
      />
      <div className="container-section relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">{t.title}</h2>
          <p className="mt-4 text-lg text-secondary">{t.subtitle}</p>
        </Reveal>

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
          {t.tiers.map((tier, i) => {
            // Enterprise ведёт в личку, а не в общую форму: индивидуальный
            // проект начинается с разговора, а не с email-подписки.
            const isEnterprise = Boolean(tier.badge) && !tier.popular;
            return (
              <Reveal key={tier.name} delay={i * 0.1} className="h-full">
                <CardSpotlight className="h-full rounded-lg">
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
                        : "card-glass hover:border-accent/40"
                    }`}
                  >
                    {tier.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                        {t.popularBadge}
                      </span>
                    )}
                    {tier.badge && !tier.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-accent-blue/40 bg-surface-2 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-blue">
                        {tier.badge}
                      </span>
                    )}

                    <h3 className="font-heading text-xl font-bold tracking-tight text-primary">
                      {tier.name}
                    </h3>
                    <p className="mt-1 text-sm text-secondary">{tier.audience}</p>
                    <p className="mt-2 text-sm leading-relaxed text-primary-light">
                      {tier.tagline}
                    </p>

                    <p className="mt-6">
                      <span className="font-heading text-5xl font-extrabold tracking-tight text-primary">
                        ${tier.setup}
                      </span>
                      <span className="text-secondary">{t.setupSuffix}</span>
                      <PriceHint label={t.breakdownLabel} text={t.setupTooltip} />
                    </p>
                    <p className="mt-1.5 text-sm text-secondary">
                      {t.thenPrefix}{" "}
                      <span className="font-semibold text-primary-light">
                        ${tier.price}
                        {t.perMonth}
                      </span>{" "}
                      {t.supportSuffix}
                      <PriceHint label={t.breakdownLabel} text={t.monthlyTooltip} />
                    </p>

                    <ul className="mt-6 flex-1 space-y-3">
                      {tier.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2.5 text-primary-light"
                        >
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
                    {isEnterprise ? (
                      <TelegramButton
                        label={tier.cta}
                        source={`pricing-${tier.name.toLowerCase()}`}
                        className="mt-8 w-full"
                      />
                    ) : (
                      <a
                        href="#final-cta"
                        className={`mt-8 w-full ${tier.popular ? "btn-primary" : "btn-secondary"}`}
                      >
                        {tier.cta}
                      </a>
                    )}
                  </div>
                </div>
                </CardSpotlight>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mx-auto mt-10 flex max-w-xl items-center justify-center gap-2.5 rounded-lg border border-success/20 bg-success/10 px-5 py-3.5 text-center text-sm font-medium text-success">
          <FiShield size={18} className="shrink-0" aria-hidden="true" />
          {t.guarantee}
        </Reveal>

        <Reveal className="mt-6 text-center text-secondary">
          <p>{t.footnote}</p>
        </Reveal>
      </div>
    </section>
  );
}
