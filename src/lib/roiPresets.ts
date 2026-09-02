/**
 * Пресеты калькулятора: типовые вводные по отраслям.
 *
 * Числа живут отдельно от словарей контента, потому что они одинаковы для
 * обоих языков — переводится только подпись кнопки. Значения консервативные:
 * средний бизнес в нише, а не лучший клиент, иначе калькулятор превращается
 * в обещание, которое внедрение не выполнит.
 */

export const ROI_PRESET_KEYS = ["ecommerce", "saas", "realestate", "legal"] as const;

export type RoiPresetKey = (typeof ROI_PRESET_KEYS)[number];

export type RoiInputs = {
  /** Сделок в месяц. */
  deals: number;
  /** Средний чек сделки, $. */
  dealValue: number;
  /** Часов в неделю на рутину. */
  hours: number;
  /** Стоимость часа работы, $. */
  hourlyRate: number;
};

export const ROI_PRESETS: Record<RoiPresetKey, RoiInputs> = {
  // Много мелких заказов, рутина — переписка и статусы заказов.
  ecommerce: { deals: 120, dealValue: 80, hours: 18, hourlyRate: 20 },
  // Мало сделок, но дорогих; время уходит на квалификацию и дожим.
  saas: { deals: 15, dealValue: 2400, hours: 14, hourlyRate: 45 },
  // Длинный цикл, высокий чек, много первичных обращений.
  realestate: { deals: 6, dealValue: 4500, hours: 20, hourlyRate: 35 },
  // Дорогой час специалиста, рутина — первичные консультации и документы.
  legal: { deals: 10, dealValue: 1800, hours: 12, hourlyRate: 90 },
};

/** Значения по умолчанию — когда пресет не выбран. */
export const ROI_DEFAULTS: RoiInputs = {
  deals: 20,
  dealValue: 500,
  hours: 10,
  hourlyRate: 25,
};

/** Совпадают ли текущие ползунки с пресетом (для подсветки активной кнопки). */
export function matchesPreset(inputs: RoiInputs, key: RoiPresetKey): boolean {
  const p = ROI_PRESETS[key];
  return (
    inputs.deals === p.deals &&
    inputs.dealValue === p.dealValue &&
    inputs.hours === p.hours &&
    inputs.hourlyRate === p.hourlyRate
  );
}

/**
 * Допущения расчёта. Вынесены сюда, чтобы цифры в калькуляторе, в подписи
 * «как считаем» и в тестах не разъезжались.
 */
export const TIME_SAVED_RATIO = 0.5;
export const DEAL_UPLIFT_RATIO = 0.2;
export const WEEKS_PER_MONTH = 4.33;

export type RoiResult = {
  timeSavedValue: number;
  extraRevenue: number;
  total: number;
  netMonthly: number;
  /** null — если экономия не покрывает абонплату, окупаемости нет. */
  paybackMonths: number | null;
};

export function computeRoi(
  inputs: RoiInputs,
  tier: { setup: number; price: number },
): RoiResult {
  const timeSavedValue = inputs.hours * WEEKS_PER_MONTH * TIME_SAVED_RATIO * inputs.hourlyRate;
  const extraRevenue = inputs.deals * DEAL_UPLIFT_RATIO * inputs.dealValue;
  const total = timeSavedValue + extraRevenue;
  const netMonthly = total - tier.price;
  const paybackMonths =
    netMonthly > 0 ? Math.max(1, Math.ceil(tier.setup / netMonthly)) : null;
  return { timeSavedValue, extraRevenue, total, netMonthly, paybackMonths };
}
