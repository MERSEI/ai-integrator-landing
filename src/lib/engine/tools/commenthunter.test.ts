import { describe, expect, it } from "vitest";
import { rng } from "../random";
import { generateCommentHunter } from "./commenthunter";
import { SCORE_BANDS } from "./tiers";
import { CYRILLIC, LOCALES, NASTY_INPUTS, strings } from "./__testUtils";
import type { EngineLocale } from "../types";

const run = (keyword: string, locale: EngineLocale, seed: number, product?: string) =>
  generateCommentHunter({ keyword, product }, locale, rng(seed));

const allComments = (keyword: string, locale: EngineLocale, seed: number) =>
  run(keyword, locale, seed).posts.flatMap((p) => p.comments);

describe("generateCommentHunter", () => {
  it("возвращает три поста, под каждым 4–5 комментариев", () => {
    for (let seed = 0; seed < 40; seed++) {
      const { posts } = run("продвижение в телеграм", "ru", seed);
      expect(posts).toHaveLength(3);
      for (const post of posts) {
        expect(post.comments.length).toBeGreaterThanOrEqual(4);
        expect(post.comments.length).toBeLessThanOrEqual(5);
      }
    }
  });

  it("под каждым постом есть и горячий, и холодный — подборка не должна быть однородной", () => {
    for (let seed = 0; seed < 40; seed++) {
      for (const post of run("seo аудит", "ru", seed).posts) {
        const tiers = post.comments.map((c) => c.tier);
        expect(tiers).toContain("hot");
        expect(tiers).toContain("cold");
      }
    }
  });

  it("держит баллы в границах тира и сортирует комментарии по убыванию", () => {
    for (let seed = 0; seed < 30; seed++) {
      for (const post of run("копирайтинг", "ru", seed).posts) {
        const scores = post.comments.map((c) => c.score);
        expect([...scores].sort((a, b) => b - a)).toEqual(scores);
        for (const c of post.comments) {
          const [min, max] = SCORE_BANDS[c.tier];
          expect(c.score).toBeGreaterThanOrEqual(min);
          expect(c.score).toBeLessThanOrEqual(max);
        }
      }
    }
  });

  it("не повторяет баллы и хэндлы во всей выдаче, а не только внутри поста", () => {
    for (let seed = 0; seed < 25; seed++) {
      const comments = allComments("таргетированная реклама", "ru", seed);
      expect(new Set(comments.map((c) => c.score)).size).toBe(comments.length);
      expect(new Set(comments.map((c) => c.handle)).size).toBe(comments.length);
    }
  });

  it("не повторяет тексты постов внутри одной выдачи", () => {
    for (let seed = 0; seed < 30; seed++) {
      const texts = run("email-маркетинг", "ru", seed).posts.map((p) => p.text);
      expect(new Set(texts).size).toBe(3);
    }
  });

  it("подставляет ключевое слово в текст каждого поста", () => {
    const keyword = "воронка продаж";
    for (const post of run(keyword, "ru", 8).posts) {
      expect(post.text.toLowerCase()).toContain(keyword);
    }
  });

  it("держит лайки в правдоподобном диапазоне", () => {
    for (let seed = 0; seed < 40; seed++) {
      for (const post of run("нейросети", "ru", seed).posts) {
        expect(post.likes).toBeGreaterThanOrEqual(20);
        expect(post.likes).toBeLessThanOrEqual(5000);
        expect(Number.isInteger(post.likes)).toBe(true);
      }
    }
  });

  it("не отвечает холодным и отвечает всем остальным", () => {
    for (let seed = 0; seed < 25; seed++) {
      for (const c of allComments("контент-план", "ru", seed)) {
        if (c.tier === "cold") expect(c.reply).toBe("");
        else expect(c.reply.length).toBeGreaterThan(15);
      }
    }
  });

  it("не оставляет незаполненных слотов", () => {
    for (const locale of LOCALES) {
      for (let seed = 0; seed < 25; seed++) {
        for (const s of strings(run("автоворонка", locale, seed))) {
          expect(s).not.toMatch(/\{\w+\}/);
        }
      }
    }
  });

  it("не пишет кириллицей в английской локали", () => {
    const res = run("lead generation", "en", 5);
    for (const post of res.posts) {
      expect(CYRILLIC.test(post.text)).toBe(false);
      for (const c of post.comments) {
        for (const s of [c.text, c.reason, c.reply]) expect(CYRILLIC.test(s)).toBe(false);
      }
    }
  });

  it("детерминирован и разнообразен", () => {
    expect(run("вебинары", "ru", 21)).toEqual(run("вебинары", "ru", 21));
    const seen = new Set(
      Array.from({ length: 20 }, (_, i) => JSON.stringify(run("вебинары", "ru", i)))
    );
    expect(seen.size).toBeGreaterThanOrEqual(18);
  });

  it("не падает на недружелюбном вводе", () => {
    for (const keyword of NASTY_INPUTS) {
      for (const locale of LOCALES) {
        const res = run(keyword, locale, 2);
        expect(res.posts).toHaveLength(3);
        strings(res).forEach((s) => expect(s).not.toMatch(/\{\w+\}/));
      }
    }
  });
});
