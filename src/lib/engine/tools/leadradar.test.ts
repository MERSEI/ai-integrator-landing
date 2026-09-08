import { describe, expect, it } from "vitest";
import { rng } from "../random";
import { SCORE_BANDS } from "./tiers";
import { generateLeadRadar } from "./leadradar";
import type { EngineLocale } from "../types";

const LOCALES: EngineLocale[] = ["ru", "en"];
const CYRILLIC = /[А-Яа-яЁё]/;

/** Все строковые листья результата — для проверок языка и незаполненных слотов. */
function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object") {
    Object.values(value).forEach((v) => strings(v, out));
  }
  return out;
}

const run = (keyword: string, locale: EngineLocale, seed: number, product?: string) =>
  generateLeadRadar({ keyword, product }, locale, rng(seed));

describe("generateLeadRadar", () => {
  it("возвращает ровно семь лидов", () => {
    for (let seed = 0; seed < 40; seed++) {
      expect(run("маникюр", "ru", seed).leads).toHaveLength(7);
    }
  });

  it("держит раскладку по тирам из спецификации", () => {
    for (let seed = 0; seed < 60; seed++) {
      const { leads } = run("доставка еды", "ru", seed);
      const count = (t: string) => leads.filter((l) => l.tier === t).length;
      expect(count("hot")).toBeGreaterThanOrEqual(2);
      expect(count("hot")).toBeLessThanOrEqual(3);
      expect(count("warm")).toBeGreaterThanOrEqual(2);
      expect(count("warm")).toBeLessThanOrEqual(3);
      expect(count("cold")).toBeGreaterThanOrEqual(1);
      expect(count("cold")).toBeLessThanOrEqual(2);
    }
  });

  it("держит баллы в границах своего тира", () => {
    for (let seed = 0; seed < 40; seed++) {
      for (const lead of run("crm интеграция", "ru", seed).leads) {
        const [min, max] = SCORE_BANDS[lead.tier];
        expect(lead.score).toBeGreaterThanOrEqual(min);
        expect(lead.score).toBeLessThanOrEqual(max);
      }
    }
  });

  it("не повторяет баллы и хэндлы внутри одного ответа", () => {
    for (let seed = 0; seed < 40; seed++) {
      const { leads } = run("фитнес", "ru", seed);
      expect(new Set(leads.map((l) => l.score)).size).toBe(7);
      expect(new Set(leads.map((l) => l.handle)).size).toBe(7);
    }
  });

  it("сортирует по убыванию балла", () => {
    for (let seed = 0; seed < 20; seed++) {
      const scores = run("сайт под ключ", "ru", seed).leads.map((l) => l.score);
      expect([...scores].sort((a, b) => b - a)).toEqual(scores);
    }
  });

  it("не оставляет ответ холодному лиду и всегда даёт горячему", () => {
    for (let seed = 0; seed < 30; seed++) {
      for (const lead of run("бухгалтерия", "ru", seed).leads) {
        if (lead.tier === "cold") expect(lead.reply).toBe("");
        else expect(lead.reply.length).toBeGreaterThan(10);
      }
    }
  });

  it("заполняет все обязательные поля", () => {
    for (const locale of LOCALES) {
      for (const lead of run("аренда квартир", locale, 3).leads) {
        expect(lead.handle).toMatch(/^@[a-z0-9_.]+$/);
        expect(lead.text.length).toBeGreaterThan(15);
        expect(lead.posted.length).toBeGreaterThan(2);
        expect(lead.reason.length).toBeGreaterThan(10);
      }
    }
  });

  it("подставляет ключевое слово в каждый пост — человек должен увидеть свой ввод", () => {
    for (let seed = 0; seed < 20; seed++) {
      const keyword = "холодные письма";
      for (const lead of run(keyword, "ru", seed).leads) {
        expect(lead.text.toLowerCase()).toContain(keyword);
      }
    }
  });

  it("не оставляет незаполненных слотов", () => {
    for (const locale of LOCALES) {
      for (let seed = 0; seed < 30; seed++) {
        for (const s of strings(run("маркетинг", locale, seed))) {
          expect(s).not.toMatch(/\{\w+\}/);
        }
      }
    }
  });

  it("пишет по-русски для ru и без кириллицы для en", () => {
    const ru = strings(run("обучение python", "ru", 5)).join(" ");
    expect(CYRILLIC.test(ru)).toBe(true);

    // Ключевое слово задаём латиницей: это ввод пользователя, движок его не переводит.
    const en = run("email automation", "en", 5);
    for (const lead of en.leads) {
      for (const s of [lead.text, lead.posted, lead.reason, lead.reply]) {
        expect(CYRILLIC.test(s)).toBe(false);
      }
    }
  });

  it("детерминирован: один seed — один результат", () => {
    expect(run("smm продвижение", "ru", 42)).toEqual(run("smm продвижение", "ru", 42));
  });

  it("разнообразен: разные seed дают разные наборы", () => {
    const seen = new Set(
      Array.from({ length: 20 }, (_, i) => JSON.stringify(run("ремонт квартир", "ru", i)))
    );
    expect(seen.size).toBeGreaterThanOrEqual(18);
  });

  it("даёт много разных текстов постов — иначе банк слишком тощий", () => {
    const texts = new Set<string>();
    for (let seed = 0; seed < 50; seed++) {
      run("копирайтинг", "ru", seed).leads.forEach((l) => texts.add(l.text));
    }
    expect(texts.size).toBeGreaterThanOrEqual(20);
  });

  it("подставляет описание продукта в ответы, когда оно задано", () => {
    const { leads } = run("лидогенерация", "ru", 9, "поток заявок из телеграма");
    const replies = leads.filter((l) => l.reply).map((l) => l.reply).join(" ");
    expect(replies).toContain("поток заявок из телеграма");
  });

  it("не падает на недружелюбном вводе", () => {
    const nasty = ["", "  ", "@", "!!!", "🙂🙂🙂", "a".repeat(5000), "<script>x</script>", "1"];
    for (const keyword of nasty) {
      for (const locale of LOCALES) {
        for (let seed = 0; seed < 5; seed++) {
          const res = run(keyword, locale, seed);
          expect(res.leads).toHaveLength(7);
          strings(res).forEach((s) => expect(s).not.toMatch(/\{\w+\}/));
        }
      }
    }
  });
});
