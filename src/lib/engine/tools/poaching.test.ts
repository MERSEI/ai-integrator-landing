import { describe, expect, it } from "vitest";
import { rng } from "../random";
import { generatePoaching } from "./poaching";
import { SCORE_BANDS } from "./tiers";
import { CYRILLIC, LOCALES, NASTY_INPUTS, strings } from "./__testUtils";
import type { EngineLocale } from "../types";

const run = (niche: string, locale: EngineLocale, seed: number, competitors?: string) =>
  generatePoaching({ niche, competitors }, locale, rng(seed));

describe("generatePoaching", () => {
  it("возвращает ровно семь кандидатов", () => {
    for (let seed = 0; seed < 40; seed++) {
      expect(run("барбершоп", "ru", seed).prospects).toHaveLength(7);
    }
  });

  it("держит раскладку по тирам и границы баллов", () => {
    for (let seed = 0; seed < 50; seed++) {
      const { prospects } = run("студия йоги", "ru", seed);
      const count = (t: string) => prospects.filter((p) => p.tier === t).length;
      expect(count("hot")).toBeGreaterThanOrEqual(2);
      expect(count("hot")).toBeLessThanOrEqual(3);
      expect(count("cold")).toBeGreaterThanOrEqual(1);
      expect(count("cold")).toBeLessThanOrEqual(2);
      for (const p of prospects) {
        const [min, max] = SCORE_BANDS[p.tier];
        expect(p.score).toBeGreaterThanOrEqual(min);
        expect(p.score).toBeLessThanOrEqual(max);
      }
    }
  });

  it("сортирует по убыванию и не повторяет баллы и хэндлы", () => {
    for (let seed = 0; seed < 30; seed++) {
      const { prospects } = run("доставка пиццы", "ru", seed);
      const scores = prospects.map((p) => p.score);
      expect([...scores].sort((a, b) => b - a)).toEqual(scores);
      expect(new Set(scores).size).toBe(7);
      expect(new Set(prospects.map((p) => p.handle)).size).toBe(7);
    }
  });

  it("берёт аккаунты конкурентов из ввода пользователя, когда они заданы", () => {
    const { prospects } = run("маникюр", "ru", 4, "@nailsmoscow, beautyhub\n@lashroom");
    const used = new Set(prospects.map((p) => p.competitor));
    expect(used).toEqual(new Set(["@nailsmoscow", "@beautyhub", "@lashroom"]));
  });

  it("выдумывает конкурентов, только если пользователь их не назвал", () => {
    const { prospects } = run("маникюр", "ru", 4);
    for (const p of prospects) expect(p.competitor).toMatch(/^@[a-z0-9_.]+$/);
    expect(new Set(prospects.map((p) => p.competitor)).size).toBeGreaterThanOrEqual(2);
  });

  it("не пишет в личку холодным и всегда пишет остальным", () => {
    for (let seed = 0; seed < 25; seed++) {
      for (const p of run("автосервис", "ru", seed).prospects) {
        if (p.tier === "cold") expect(p.dm).toBe("");
        else expect(p.dm.length).toBeGreaterThan(15);
      }
    }
  });

  it("возвращает нишу пользователя без изменений", () => {
    expect(run("  ремонт ноутбуков  ", "ru", 1).niche).toBe("ремонт ноутбуков");
  });

  it("не оставляет незаполненных слотов", () => {
    for (const locale of LOCALES) {
      for (let seed = 0; seed < 25; seed++) {
        for (const s of strings(run("маркетинг", locale, seed))) {
          expect(s).not.toMatch(/\{\w+\}/);
        }
      }
    }
  });

  it("не пишет кириллицей в английской локали", () => {
    for (const p of run("coffee shop", "en", 6).prospects) {
      for (const s of [p.question, p.reason, p.dm]) expect(CYRILLIC.test(s)).toBe(false);
    }
  });

  it("детерминирован и разнообразен", () => {
    expect(run("сммщик", "ru", 12)).toEqual(run("сммщик", "ru", 12));
    const seen = new Set(
      Array.from({ length: 20 }, (_, i) => JSON.stringify(run("сммщик", "ru", i)))
    );
    expect(seen.size).toBeGreaterThanOrEqual(18);
  });

  it("не падает на недружелюбном вводе", () => {
    for (const niche of NASTY_INPUTS) {
      for (const locale of LOCALES) {
        const res = run(niche, locale, 3);
        expect(res.prospects).toHaveLength(7);
        strings(res).forEach((s) => expect(s).not.toMatch(/\{\w+\}/));
      }
    }
  });
});
