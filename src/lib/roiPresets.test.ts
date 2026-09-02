import { describe, expect, it } from "vitest";
import {
  computeRoi,
  matchesPreset,
  ROI_DEFAULTS,
  ROI_PRESETS,
  ROI_PRESET_KEYS,
} from "./roiPresets";

const growth = { setup: 1200, price: 250 };

describe("computeRoi", () => {
  it("считает экономию времени и доп. выручку по заявленным допущениям", () => {
    const r = computeRoi({ deals: 20, dealValue: 500, hours: 10, hourlyRate: 25 }, growth);
    expect(Math.round(r.timeSavedValue)).toBe(541); // 10ч × 4.33 × 50% × $25
    expect(r.extraRevenue).toBe(2000); // 20 × 20% × $500
    expect(Math.round(r.total)).toBe(2541);
  });

  it("вычитает абонплату и считает окупаемость сборки", () => {
    const r = computeRoi(ROI_DEFAULTS, growth);
    expect(Math.round(r.netMonthly)).toBe(2291);
    expect(r.paybackMonths).toBe(1);
  });

  it("не обещает окупаемость, когда выгода меньше абонплаты", () => {
    const r = computeRoi({ deals: 1, dealValue: 50, hours: 1, hourlyRate: 5 }, growth);
    expect(r.paybackMonths).toBeNull();
  });
});

describe("пресеты отраслей", () => {
  it("покрывают все ключи и дают положительный ROI на Growth", () => {
    for (const key of ROI_PRESET_KEYS) {
      const r = computeRoi(ROI_PRESETS[key], growth);
      expect(r.total).toBeGreaterThan(growth.price);
      expect(r.paybackMonths).not.toBeNull();
    }
  });

  it("matchesPreset узнаёт свой пресет и отличает чужой", () => {
    expect(matchesPreset(ROI_PRESETS.saas, "saas")).toBe(true);
    expect(matchesPreset(ROI_PRESETS.saas, "legal")).toBe(false);
    expect(matchesPreset(ROI_DEFAULTS, "ecommerce")).toBe(false);
  });
});
