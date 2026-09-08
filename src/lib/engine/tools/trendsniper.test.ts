import { describe, expect, it } from "vitest";
import { rng } from "../random";
import { generateTrendSniper } from "./trendsniper";
import { CYRILLIC, LOCALES, NASTY_INPUTS, strings } from "./__testUtils";
import type { EngineLocale } from "../types";

const run = (keyword: string, locale: EngineLocale, seed: number, region?: string) =>
  generateTrendSniper({ keyword, region }, locale, rng(seed));

describe("generateTrendSniper", () => {
  it("заполняет все поля контракта", () => {
    const res = run("маникюр", "ru", 1);
    expect(res.keyword).toBe("маникюр");
    expect(res.interest_level).toBeGreaterThanOrEqual(0);
    expect(res.interest_level).toBeLessThanOrEqual(100);
    expect(["rising", "falling", "stable"]).toContain(res.direction);
    expect(res.summary.length).toBeGreaterThan(20);
    expect(res.seasonality.length).toBeGreaterThan(20);
    expect(res.insight.length).toBeGreaterThan(20);
  });

  it("держит уровень интереса и направление стабильными для одной темы", () => {
    // Главное свойство инструмента: если тема сегодня «растёт», а через
    // минуту «падает», доверия к демо не остаётся.
    const base = run("маникюр", "ru", 0);
    for (let seed = 1; seed < 30; seed++) {
      const next = run("маникюр", "ru", seed);
      expect(next.interest_level).toBe(base.interest_level);
      expect(next.direction).toBe(base.direction);
    }
  });

  it("даёт разным темам разные оценки", () => {
    const levels = new Set(
      ["маникюр", "ремонт", "курсы python", "доставка еды", "юрист", "фитнес"].map(
        (k) => run(k, "ru", 0).interest_level
      )
    );
    expect(levels.size).toBeGreaterThanOrEqual(4);
  });

  it("считает растущими темы с явными маркерами", () => {
    for (const k of ["ai агенты", "автоматизация продаж", "нейросети для бизнеса"]) {
      expect(run(k, "ru", 0).direction).toBe("rising");
    }
  });

  it("возвращает 5–7 регионов по убыванию, первый — со 100", () => {
    for (let seed = 0; seed < 40; seed++) {
      const { top_regions } = run("детский сад", "ru", seed);
      expect(top_regions.length).toBeGreaterThanOrEqual(5);
      expect(top_regions.length).toBeLessThanOrEqual(7);
      expect(top_regions[0].score).toBe(100);
      const scores = top_regions.map((r) => r.score);
      expect([...scores].sort((a, b) => b - a)).toEqual(scores);
      expect(new Set(top_regions.map((r) => r.region)).size).toBe(top_regions.length);
    }
  });

  it("ставит регион пользователя первым — свой ввод важнее вымышленной сотни", () => {
    for (let seed = 0; seed < 20; seed++) {
      const { top_regions } = run("кофейня", "ru", seed, "Калининград");
      expect(top_regions[0]).toEqual({ region: "Калининград", score: 100 });
      expect(top_regions.filter((r) => r.region === "Калининград")).toHaveLength(1);
    }
  });

  it("не дублирует регион пользователя, если он есть в справочнике", () => {
    const { top_regions } = run("кофейня", "ru", 3, "Москва");
    expect(top_regions.filter((r) => r.region === "Москва")).toHaveLength(1);
  });

  it("возвращает 6–8 связанных запросов, минимум по два каждого вида", () => {
    for (let seed = 0; seed < 40; seed++) {
      const { related_queries } = run("ремонт квартир", "ru", seed);
      expect(related_queries.length).toBeGreaterThanOrEqual(6);
      expect(related_queries.length).toBeLessThanOrEqual(8);
      const top = related_queries.filter((q) => q.kind === "top");
      const rising = related_queries.filter((q) => q.kind === "rising");
      expect(top.length).toBeGreaterThanOrEqual(2);
      expect(rising.length).toBeGreaterThanOrEqual(2);
      for (const q of related_queries) expect(q.query).toContain("ремонт квартир");
      expect(new Set(related_queries.map((q) => q.query)).size).toBe(related_queries.length);
    }
  });

  it("не оставляет незаполненных слотов", () => {
    for (const locale of LOCALES) {
      for (let seed = 0; seed < 25; seed++) {
        for (const s of strings(run("логистика", locale, seed))) {
          expect(s).not.toMatch(/\{\w+\}/);
        }
      }
    }
  });

  it("не пишет кириллицей в английской локали", () => {
    const res = run("coffee subscription", "en", 4);
    for (const s of [res.summary, res.seasonality, res.insight]) {
      expect(CYRILLIC.test(s)).toBe(false);
    }
    for (const r of res.top_regions) expect(CYRILLIC.test(r.region)).toBe(false);
  });

  it("детерминирован, но формулировки меняются между seed", () => {
    expect(run("грузоперевозки", "ru", 15)).toEqual(run("грузоперевозки", "ru", 15));
    const summaries = new Set(
      Array.from({ length: 20 }, (_, i) => run("грузоперевозки", "ru", i).summary)
    );
    expect(summaries.size).toBeGreaterThanOrEqual(2);
  });

  it("не падает на недружелюбном вводе", () => {
    for (const keyword of NASTY_INPUTS) {
      for (const locale of LOCALES) {
        const res = run(keyword, locale, 6);
        expect(res.top_regions.length).toBeGreaterThanOrEqual(5);
        strings(res).forEach((s) => expect(s).not.toMatch(/\{\w+\}/));
      }
    }
  });
});
