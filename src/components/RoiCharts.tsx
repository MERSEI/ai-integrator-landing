"use client";

import { useId, useMemo, useState } from "react";
import type { Content } from "@/lib/content";
import { TIME_SAVED_RATIO, WEEKS_PER_MONTH, type RoiInputs } from "@/lib/roiPresets";
import type { Locale } from "@/lib/i18n";

/**
 * Два графика под калькулятором. Оба строятся из ползунков пользователя, а не
 * из вшитых цифр: показывать чужой «рост выручки» под видом своего было бы
 * враньём, а собственный расчёт клиента — честная иллюстрация модели.
 *
 * Цвета серий вынесены в токены chart-1/chart-2 и проверены валидатором
 * палитры на тёмной поверхности (см. комментарий в tailwind.config.ts).
 */

const SERIES_BENEFIT = "#6366F1";
const SERIES_COST = "#0EA37A";
const MONTHS = 12;

function formatMoney(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

type Point = { month: number; benefit: number; cost: number };

function buildSeries(monthlyBenefit: number, setup: number, monthly: number): Point[] {
  return Array.from({ length: MONTHS }, (_, i) => {
    const month = i + 1;
    return {
      month,
      benefit: monthlyBenefit * month,
      cost: setup + monthly * month,
    };
  });
}

export default function RoiCharts({
  locale,
  t,
  inputs,
  monthlyBenefit,
  tier,
  paybackMonths,
}: {
  locale: Locale;
  t: Content["roiCalculator"];
  inputs: RoiInputs;
  /** Суммарная выгода в месяц: экономия времени + доп. выручка. */
  monthlyBenefit: number;
  tier: { name: string; setup: number; price: number };
  paybackMonths: number | null;
}) {
  const c = t.charts;
  const gradientId = useId();
  const [hover, setHover] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);

  const points = useMemo(
    () => buildSeries(monthlyBenefit, tier.setup, tier.price),
    [monthlyBenefit, tier.setup, tier.price],
  );

  // Геометрия в единицах viewBox: рисуем в 640×240 и растягиваем по ширине.
  const W = 640;
  const H = 240;
  const PAD = { top: 16, right: 16, bottom: 28, left: 52 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const maxY = Math.max(...points.map((p) => Math.max(p.benefit, p.cost)), 1);

  const x = (month: number) => PAD.left + ((month - 1) / (MONTHS - 1)) * plotW;
  const y = (value: number) => PAD.top + plotH - (value / maxY) * plotH;

  const line = (key: "benefit" | "cost") =>
    points.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.month)},${y(p[key])}`).join(" ");
  const area = `${line("benefit")} L${x(MONTHS)},${PAD.top + plotH} L${x(1)},${PAD.top + plotH} Z`;

  const hoverPoint = hover !== null ? points[hover] : null;

  // Столбики «часы на рутину»: одна метрика, две категории — легенда не нужна,
  // подписи стоят прямо под столбиками.
  const hoursBefore = Math.round(inputs.hours * WEEKS_PER_MONTH);
  const hoursAfter = Math.round(inputs.hours * WEEKS_PER_MONTH * (1 - TIME_SAVED_RATIO));

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      {/* ─── Путь окупаемости ─────────────────────────────────────────────── */}
      <figure className="card-glass p-5 sm:p-6">
        <figcaption>
          <h4 className="font-heading text-base font-bold text-primary">
            {c.paybackTitle}
          </h4>
          <p className="mt-1 text-sm text-secondary">{c.paybackSubtitle}</p>
        </figcaption>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          {[
            { label: c.benefitSeries, color: SERIES_BENEFIT },
            { label: c.costSeries, color: SERIES_COST },
          ].map((s) => (
            <span key={s.label} className="flex items-center gap-2 text-xs text-secondary">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: s.color }}
                aria-hidden="true"
              />
              {s.label}
            </span>
          ))}
        </div>

        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="mt-3 w-full"
          role="img"
          aria-label={`${c.paybackTitle}. ${c.paybackSubtitle}`}
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SERIES_BENEFIT} stopOpacity="0.28" />
              <stop offset="100%" stopColor={SERIES_BENEFIT} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Сетка и ось — рецессивные: данные должны быть темнее всего вокруг */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
            const gy = PAD.top + plotH * frac;
            return (
              <g key={frac}>
                <line
                  x1={PAD.left}
                  x2={W - PAD.right}
                  y1={gy}
                  y2={gy}
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth={1}
                />
                <text
                  x={PAD.left - 8}
                  y={gy + 4}
                  textAnchor="end"
                  className="fill-slate-500"
                  style={{ fontSize: 11 }}
                >
                  ${formatMoney(maxY * (1 - frac), locale)}
                </text>
              </g>
            );
          })}

          {[1, 4, 7, 10, 12].map((m) => (
            <text
              key={m}
              x={x(m)}
              y={H - 8}
              textAnchor="middle"
              className="fill-slate-500"
              style={{ fontSize: 11 }}
            >
              {c.monthShort(m)}
            </text>
          ))}

          <path d={area} fill={`url(#${gradientId})`} />
          <path d={line("cost")} fill="none" stroke={SERIES_COST} strokeWidth={2} />
          <path d={line("benefit")} fill="none" stroke={SERIES_BENEFIT} strokeWidth={2} />

          {/* Точка окупаемости — единственная подписанная точка на графике */}
          {paybackMonths !== null && paybackMonths <= MONTHS && (
            <g>
              <line
                x1={x(paybackMonths)}
                x2={x(paybackMonths)}
                y1={PAD.top}
                y2={PAD.top + plotH}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <circle
                cx={x(paybackMonths)}
                cy={y(points[paybackMonths - 1].benefit)}
                r={5}
                fill={SERIES_BENEFIT}
                stroke="#0F172A"
                strokeWidth={2}
              />
            </g>
          )}

          {/* Прозрачные зоны наведения шире самих точек — попасть легко */}
          {points.map((p, i) => (
            <rect
              key={p.month}
              x={x(p.month) - plotW / (MONTHS - 1) / 2}
              y={PAD.top}
              width={plotW / (MONTHS - 1)}
              height={plotH}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
          ))}

          {hoverPoint && (
            <g pointerEvents="none">
              <line
                x1={x(hoverPoint.month)}
                x2={x(hoverPoint.month)}
                y1={PAD.top}
                y2={PAD.top + plotH}
                stroke="rgba(255,255,255,0.35)"
                strokeWidth={1}
              />
              <circle
                cx={x(hoverPoint.month)}
                cy={y(hoverPoint.benefit)}
                r={4}
                fill={SERIES_BENEFIT}
                stroke="#0F172A"
                strokeWidth={2}
              />
              <circle
                cx={x(hoverPoint.month)}
                cy={y(hoverPoint.cost)}
                r={4}
                fill={SERIES_COST}
                stroke="#0F172A"
                strokeWidth={2}
              />
            </g>
          )}
        </svg>

        {/* Значения под графиком, а не в плавающем тултипе: на тач-экранах
            всплывашка недоступна, а строка читается всегда. */}
        <p className="mt-1 min-h-5 text-sm text-primary-light" aria-live="polite">
          {hoverPoint ? (
            <>
              <span className="text-secondary">{c.monthShort(hoverPoint.month)}: </span>
              <span className="font-medium">
                {c.benefitSeries} ${formatMoney(hoverPoint.benefit, locale)}
              </span>
              <span className="text-secondary"> · </span>
              <span className="font-medium">
                {c.costSeries} ${formatMoney(hoverPoint.cost, locale)}
              </span>
            </>
          ) : paybackMonths !== null && paybackMonths <= MONTHS ? (
            <span className="font-medium text-accent-violet">{c.breakEven(paybackMonths)}</span>
          ) : (
            <span className="text-secondary">{t.paybackNever}</span>
          )}
        </p>

        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          aria-expanded={showTable}
          className="mt-2 cursor-pointer text-xs font-medium text-accent-blue underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {c.tableToggle}
        </button>
        {showTable && (
          <div className="mt-3 max-h-56 overflow-y-auto rounded-md border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-surface-2 text-secondary">
                <tr>
                  <th scope="col" className="px-3 py-2 font-medium">{c.tableMonth}</th>
                  <th scope="col" className="px-3 py-2 font-medium">{c.benefitSeries}</th>
                  <th scope="col" className="px-3 py-2 font-medium">{c.costSeries}</th>
                </tr>
              </thead>
              <tbody className="text-primary-light">
                {points.map((p) => (
                  <tr key={p.month} className="border-t border-white/[0.06]">
                    <td className="px-3 py-1.5">{p.month}</td>
                    <td className="px-3 py-1.5">${formatMoney(p.benefit, locale)}</td>
                    <td className="px-3 py-1.5">${formatMoney(p.cost, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </figure>

      {/* ─── Часы на рутину: до и после ───────────────────────────────────── */}
      <figure className="card-glass flex flex-col p-5 sm:p-6">
        <figcaption>
          <h4 className="font-heading text-base font-bold text-primary">{c.hoursTitle}</h4>
          <p className="mt-1 text-sm text-secondary">{c.hoursSubtitle}</p>
        </figcaption>

        <div className="mt-6 flex flex-1 items-end gap-6">
          {[
            { label: c.hoursBefore, value: hoursBefore, color: SERIES_BENEFIT },
            { label: c.hoursAfter, value: hoursAfter, color: SERIES_COST },
          ].map((bar) => (
            <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
              <span className="font-heading text-lg font-bold text-primary">
                {c.hoursPerMonth(bar.value)}
              </span>
              <div className="flex h-32 w-full items-end">
                <div
                  className="w-full rounded-t-[4px] transition-[height] duration-500 ease-premium"
                  style={{
                    height: `${Math.max(4, (bar.value / Math.max(hoursBefore, 1)) * 100)}%`,
                    backgroundColor: bar.color,
                  }}
                  aria-hidden="true"
                />
              </div>
              <span className="text-center text-xs text-secondary">{bar.label}</span>
            </div>
          ))}
        </div>
        <p className="sr-only">
          {c.hoursBefore}: {c.hoursPerMonth(hoursBefore)}. {c.hoursAfter}:{" "}
          {c.hoursPerMonth(hoursAfter)}.
        </p>
      </figure>
    </div>
  );
}
