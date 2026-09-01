"use client";

import { useMemo, useState } from "react";
import { FiClock, FiTrendingUp, FiCheckCircle } from "react-icons/fi";
import { TbCalculator } from "react-icons/tb";
import Reveal from "./Reveal";
import CtaTabs from "./CtaTabs";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

/**
 * Консервативные, явно озвученные допущения (см. roiCalculator.assumptions
 * в контенте) — не выдумываем агрессивный ROI, берём средние по клиентам:
 * рутина сокращается наполовину, доля закрытых сделок растёт на пятую часть.
 */
const TIME_SAVED_RATIO = 0.5;
const DEAL_UPLIFT_RATIO = 0.2;
const WEEKS_PER_MONTH = 4.33;

function formatMoney(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  displayValue: string;
};

function Slider({ label, value, min, max, step, onChange, displayValue }: SliderProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-sm text-slate-400">{label}</label>
        <span className="shrink-0 font-heading text-lg font-bold text-white">
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-accent"
      />
    </div>
  );
}

export default function ROICalculatorSection({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const t = content.roiCalculator;
  const tiers = content.pricing.tiers;

  const [deals, setDeals] = useState(20);
  const [dealValue, setDealValue] = useState(500);
  const [hours, setHours] = useState(10);
  const [hourlyRate, setHourlyRate] = useState(25);
  const [tierIndex, setTierIndex] = useState(
    Math.max(0, tiers.findIndex((tier) => tier.popular)),
  );

  const tier = tiers[tierIndex];

  const { timeSavedValue, extraRevenue, total, netMonthly, paybackMonths } = useMemo(() => {
    const timeSavedHours = hours * WEEKS_PER_MONTH * TIME_SAVED_RATIO;
    const timeSavedValue = timeSavedHours * hourlyRate;
    const extraDeals = deals * DEAL_UPLIFT_RATIO;
    const extraRevenue = extraDeals * dealValue;
    const total = timeSavedValue + extraRevenue;
    const netMonthly = total - tier.price;
    const paybackMonths =
      netMonthly > 0 ? Math.max(1, Math.ceil(tier.setup / netMonthly)) : null;
    return { timeSavedValue, extraRevenue, total, netMonthly, paybackMonths };
  }, [hours, hourlyRate, deals, dealValue, tier]);

  return (
    <section
      id="calculator"
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

        <Reveal delay={0.1} className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Ползунки вводных данных */}
          <div className="card-glass flex flex-col gap-7 p-6 sm:p-8">
            <Slider
              label={t.dealsLabel}
              value={deals}
              min={1}
              max={200}
              step={1}
              onChange={setDeals}
              displayValue={deals.toString()}
            />
            <Slider
              label={t.dealValueLabel}
              value={dealValue}
              min={50}
              max={10000}
              step={50}
              onChange={setDealValue}
              displayValue={`$${formatMoney(dealValue, locale)}`}
            />
            <Slider
              label={t.hoursLabel}
              value={hours}
              min={1}
              max={60}
              step={1}
              onChange={setHours}
              displayValue={`${hours} ${t.hoursUnit}`}
            />
            <Slider
              label={t.hourlyRateLabel}
              value={hourlyRate}
              min={5}
              max={200}
              step={5}
              onChange={setHourlyRate}
              displayValue={`$${hourlyRate}`}
            />

            <div>
              <p className="text-sm text-slate-400">{t.tierLabel}</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {tiers.map((tr, i) => (
                  <button
                    key={tr.name}
                    type="button"
                    onClick={() => setTierIndex(i)}
                    className={`cursor-pointer rounded-md border px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 ease-premium ${
                      i === tierIndex
                        ? "border-accent bg-accent/15 text-white"
                        : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {tr.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Результат расчёта */}
          <div className="relative rounded-lg bg-gradient-to-b from-accent via-accent/40 to-transparent p-px">
            <div className="flex h-full flex-col rounded-[15px] bg-gradient-to-b from-surface-2 to-dark p-6 sm:p-8">
              <div className="flex items-center gap-2">
                <TbCalculator size={20} className="text-primary-light" aria-hidden="true" />
                <h3 className="font-heading text-lg font-bold text-white">
                  {t.resultTitle}
                </h3>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between gap-3 rounded-md border border-white/[0.06] bg-white/[0.03] px-4 py-3">
                  <span className="flex items-center gap-2 text-sm text-slate-300">
                    <FiClock className="shrink-0 text-primary-light" aria-hidden="true" />
                    {t.timeSavedLabel}
                  </span>
                  <span className="font-heading font-bold text-white">
                    ${formatMoney(timeSavedValue, locale)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-md border border-white/[0.06] bg-white/[0.03] px-4 py-3">
                  <span className="flex items-center gap-2 text-sm text-slate-300">
                    <FiTrendingUp className="shrink-0 text-primary-light" aria-hidden="true" />
                    {t.extraRevenueLabel}
                  </span>
                  <span className="font-heading font-bold text-white">
                    ${formatMoney(extraRevenue, locale)}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-md bg-accent/10 px-4 py-4 ring-1 ring-inset ring-accent/25">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium text-primary-light">
                    {t.totalLabel}
                  </span>
                  <span className="font-heading text-3xl font-extrabold tracking-tight text-white">
                    ${formatMoney(total, locale)}
                    <span className="text-base font-medium text-primary-light">
                      {t.perMonthSuffix}
                    </span>
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between gap-3 text-sm text-slate-400">
                  <span>
                    {t.planCostLabel} · {tier.name}
                  </span>
                  <span>
                    ${formatMoney(tier.price, locale)}
                    {t.perMonthSuffix}
                  </span>
                </div>
              </div>

              <p className="mt-3.5 flex items-start gap-2 text-sm font-medium text-success">
                <FiCheckCircle className="mt-0.5 shrink-0" aria-hidden="true" />
                {paybackMonths !== null ? t.paybackLabel(paybackMonths) : t.paybackNever}
              </p>

              <div className="mt-6 border-t border-white/[0.06] pt-6">
                <p className="font-heading text-sm font-bold text-white">{t.ctaTitle}</p>
                <p className="mt-1 text-sm text-slate-400">{t.ctaSubtitle}</p>
                <div className="mt-4">
                  <CtaTabs locale={locale} cta={t.submitCta} source="calculator" compact />
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="mx-auto mt-6 max-w-2xl text-center">
          <p className="text-xs text-slate-500">{t.assumptions}</p>
          <p className="mt-1 text-xs text-slate-600">{t.disclaimer}</p>
        </Reveal>
      </div>
    </section>
  );
}
