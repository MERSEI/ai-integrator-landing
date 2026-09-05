"use client";

import { useMemo, useState } from "react";
import Reveal from "./Reveal";
import BookingModal from "./BookingModal";
import RoiCharts from "./RoiCharts";
import { getContent } from "@/lib/content";
import {
  computeRoi,
  matchesPreset,
  ROI_DEFAULTS,
  ROI_PRESETS,
  ROI_PRESET_KEYS,
  type RoiPresetKey,
} from "@/lib/roiPresets";
import { trackEvent } from "@/lib/gtag";
import type { Locale } from "@/lib/i18n";
import { FiArrowRight, FiCheckCircle, FiClock, FiTrendingUp, TbCalculator } from "./icons";

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
        <label className="text-sm text-secondary">{label}</label>
        <span className="shrink-0 font-heading text-lg font-bold text-primary">
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
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

  const [inputs, setInputs] = useState(ROI_DEFAULTS);
  const [tierIndex, setTierIndex] = useState(
    Math.max(0, tiers.findIndex((tier) => tier.popular)),
  );
  const [modalOpen, setModalOpen] = useState(false);

  const tier = tiers[tierIndex];
  const setInput = (key: keyof typeof inputs) => (value: number) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const activePreset = ROI_PRESET_KEYS.find((key) => matchesPreset(inputs, key)) ?? null;

  const { timeSavedValue, extraRevenue, total, paybackMonths } = useMemo(
    () => computeRoi(inputs, tier),
    [inputs, tier],
  );

  const totalLabel = `$${formatMoney(total, locale)}${t.perMonthSuffix}`;

  const applyPreset = (key: RoiPresetKey) => {
    setInputs(ROI_PRESETS[key]);
    trackEvent("roi_preset", { preset: key });
  };

  const openModal = () => {
    setModalOpen(true);
    trackEvent("roi_lock_cta", {
      total: Math.round(total),
      tier: tier.name,
      preset: activePreset ?? "custom",
    });
  };

  /**
   * Сводка расчёта уходит вместе с заявкой: строка попадает в лид, в Upstash и
   * в Google-таблицу, чтобы на созвон приходить с уже посчитанными цифрами.
   */
  const note = [
    `ROI ${totalLabel}`,
    `${t.planCostLabel}: ${tier.name} $${tier.setup} + $${tier.price}${t.perMonthSuffix}`,
    activePreset ? `${t.industryLabel}: ${t.presets[activePreset]}` : null,
    `${t.dealsLabel}: ${inputs.deals}`,
    `${t.dealValueLabel}: ${inputs.dealValue}`,
    `${t.hoursLabel}: ${inputs.hours}`,
    `${t.hourlyRateLabel}: ${inputs.hourlyRate}`,
    paybackMonths !== null ? t.paybackLabel(paybackMonths) : t.paybackNever,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section
      id="calculator"
      className="relative overflow-hidden bg-dark py-20 [content-visibility:auto] [contain-intrinsic-size:auto_900px] sm:py-28"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />
      {/* Ambient glow: тёплая точка внимания на самой конверсионной секции. */}
      <div
        className="pointer-events-none absolute -right-32 top-24 h-72 w-72 rounded-full bg-accent/20 blur-[120px]"
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
            {/* Пресеты: один клик вместо четырёх ползунков — снимает главный
                барьер «не знаю, что тут ставить». */}
            <div>
              <p className="text-sm text-secondary">{t.presetsLabel}</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {ROI_PRESET_KEYS.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => applyPreset(key)}
                    aria-pressed={activePreset === key}
                    className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      activePreset === key
                        ? "border-accent bg-accent/15 text-primary"
                        : "border-white/10 bg-white/[0.03] text-secondary hover:border-white/20 hover:text-primary"
                    }`}
                  >
                    {t.presets[key]}
                  </button>
                ))}
              </div>
            </div>

            <Slider
              label={t.dealsLabel}
              value={inputs.deals}
              min={1}
              max={200}
              step={1}
              onChange={setInput("deals")}
              displayValue={inputs.deals.toString()}
            />
            <Slider
              label={t.dealValueLabel}
              value={inputs.dealValue}
              min={50}
              max={10000}
              step={50}
              onChange={setInput("dealValue")}
              displayValue={`$${formatMoney(inputs.dealValue, locale)}`}
            />
            <Slider
              label={t.hoursLabel}
              value={inputs.hours}
              min={1}
              max={60}
              step={1}
              onChange={setInput("hours")}
              displayValue={`${inputs.hours} ${t.hoursUnit}`}
            />
            <Slider
              label={t.hourlyRateLabel}
              value={inputs.hourlyRate}
              min={5}
              max={200}
              step={5}
              onChange={setInput("hourlyRate")}
              displayValue={`$${inputs.hourlyRate}`}
            />

            <div>
              <p className="text-sm text-secondary">{t.tierLabel}</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {tiers.map((tr, i) => (
                  <button
                    key={tr.name}
                    type="button"
                    onClick={() => setTierIndex(i)}
                    aria-pressed={i === tierIndex}
                    className={`cursor-pointer rounded-md border px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      i === tierIndex
                        ? "border-accent bg-accent/15 text-primary"
                        : "border-white/10 bg-white/[0.03] text-secondary hover:border-white/20 hover:text-primary"
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
                <h3 className="font-heading text-lg font-bold text-primary">
                  {t.resultTitle}
                </h3>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between gap-3 rounded-md border border-white/[0.06] bg-white/[0.03] px-4 py-3">
                  <span className="flex items-center gap-2 text-sm text-primary-light">
                    <FiClock className="shrink-0 text-accent-blue" aria-hidden="true" />
                    {t.timeSavedLabel}
                  </span>
                  <span className="font-heading font-bold text-primary">
                    ${formatMoney(timeSavedValue, locale)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-md border border-white/[0.06] bg-white/[0.03] px-4 py-3">
                  <span className="flex items-center gap-2 text-sm text-primary-light">
                    <FiTrendingUp className="shrink-0 text-accent-blue" aria-hidden="true" />
                    {t.extraRevenueLabel}
                  </span>
                  <span className="font-heading font-bold text-primary">
                    ${formatMoney(extraRevenue, locale)}
                  </span>
                </div>
              </div>

              {/* Итог — деньги, поэтому зелёный, а не индиго интерфейса. */}
              <div className="mt-5 rounded-md bg-accent-violet/10 px-4 py-4 ring-1 ring-inset ring-accent-violet/30">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium text-primary-light">
                    {t.totalLabel}
                  </span>
                  <span className="font-heading text-3xl font-extrabold tracking-tight text-accent-violet">
                    ${formatMoney(total, locale)}
                    <span className="text-base font-medium text-primary-light">
                      {t.perMonthSuffix}
                    </span>
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between gap-3 text-sm text-secondary">
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
                <p className="font-heading text-sm font-bold text-primary">{t.ctaTitle}</p>
                <p className="mt-1 text-sm text-secondary">{t.ctaSubtitle}</p>
                {/* Кнопка вместо формы: посчитанная сумма — это и есть оффер,
                    поэтому она стоит в подписи и уходит в заявку. */}
                <button
                  type="button"
                  onClick={openModal}
                  className="btn-primary mt-4 w-full"
                >
                  {t.lockCta(totalLabel)}
                  <FiArrowRight aria-hidden="true" />
                </button>
                <p className="mt-2.5 text-xs text-secondary">{t.lockCtaHint}</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-6">
          <RoiCharts
            locale={locale}
            t={t}
            inputs={inputs}
            monthlyBenefit={total}
            tier={tier}
            paybackMonths={paybackMonths}
          />
          <p className="mt-3 text-center text-xs text-secondary">{t.charts.estimateNote}</p>
        </Reveal>

        <Reveal delay={0.2} className="mx-auto mt-6 max-w-2xl text-center">
          <p className="text-xs text-secondary">{t.assumptions}</p>
          <p className="mt-1 text-xs text-secondary">{t.disclaimer}</p>
        </Reveal>
      </div>

      <BookingModal
        locale={locale}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t.modalTitle}
        subtitle={t.modalSubtitle(totalLabel)}
        summaryTitle={t.modalSummaryTitle}
        summary={[
          { label: t.totalLabel, value: totalLabel },
          { label: t.planCostLabel, value: `${tier.name} · $${formatMoney(tier.price, locale)}${t.perMonthSuffix}` },
          ...(activePreset ? [{ label: t.industryLabel, value: t.presets[activePreset] }] : []),
          {
            label: t.timeSavedLabel,
            value: `$${formatMoney(timeSavedValue, locale)}${t.perMonthSuffix}`,
          },
        ]}
        cta={t.submitCta}
        source="calculator-modal"
        note={note}
        closeLabel={t.modalClose}
      />
    </section>
  );
}
