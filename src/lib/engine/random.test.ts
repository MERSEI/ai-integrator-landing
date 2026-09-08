import { describe, expect, it } from "vitest";
import { hashSeed, mulberry32, rng, timeBucket } from "./random";

describe("hashSeed", () => {
  it("стабилен между вызовами", () => {
    expect(hashSeed("маникюр")).toBe(hashSeed("маникюр"));
  });

  it("различает похожие строки", () => {
    expect(hashSeed("маникюр")).not.toBe(hashSeed("маникюрр"));
  });

  it("всегда беззнаковое 32-битное", () => {
    for (const s of ["", "a", "очень длинная строка ".repeat(50), "🙂"]) {
      const h = hashSeed(s);
      expect(Number.isInteger(h)).toBe(true);
      expect(h).toBeGreaterThanOrEqual(0);
      expect(h).toBeLessThan(2 ** 32);
    }
  });
});

describe("mulberry32", () => {
  it("один seed — одна последовательность", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    for (let i = 0; i < 20; i++) expect(a()).toBe(b());
  });

  it("разные seed расходятся", () => {
    const a = mulberry32(42);
    const b = mulberry32(43);
    const same = Array.from({ length: 20 }, () => a() === b()).filter(Boolean);
    expect(same.length).toBe(0);
  });

  it("держится в [0, 1)", () => {
    const next = mulberry32(7);
    for (let i = 0; i < 5000; i++) {
      const v = next();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("rng", () => {
  it("int не выходит за границы включительно", () => {
    const r = rng(1);
    for (let i = 0; i < 2000; i++) {
      const v = r.int(3, 7);
      expect(v).toBeGreaterThanOrEqual(3);
      expect(v).toBeLessThanOrEqual(7);
    }
  });

  it("int(n, n) всегда даёт n", () => {
    const r = rng(2);
    expect(r.int(5, 5)).toBe(5);
  });

  it("pickN возвращает n различных элементов", () => {
    const r = rng(3);
    const xs = [1, 2, 3, 4, 5, 6, 7, 8];
    const got = r.pickN(xs, 4);
    expect(got).toHaveLength(4);
    expect(new Set(got).size).toBe(4);
    got.forEach((v) => expect(xs).toContain(v));
  });

  it("pickN не выдумывает элементы, когда просят больше, чем есть", () => {
    const r = rng(4);
    const got = r.pickN([1, 2], 5);
    expect(got).toHaveLength(2);
    expect(new Set(got).size).toBe(2);
  });

  it("shuffle сохраняет состав", () => {
    const r = rng(5);
    const xs = [1, 2, 3, 4, 5];
    expect([...r.shuffle(xs)].sort()).toEqual(xs);
  });

  it("shuffle не мутирует исходный массив", () => {
    const r = rng(6);
    const xs = [1, 2, 3, 4, 5];
    r.shuffle(xs);
    expect(xs).toEqual([1, 2, 3, 4, 5]);
  });

  it("один seed — одинаковый результат", () => {
    const draw = (seed: number) => {
      const r = rng(seed);
      return [r.int(0, 100), r.pick(["a", "b", "c"]), r.pickN([1, 2, 3, 4], 2)];
    };
    expect(draw(11)).toEqual(draw(11));
    expect(draw(11)).not.toEqual(draw(12));
  });

  it("принимает строковый seed", () => {
    expect(rng("ключ").int(0, 1000)).toBe(rng("ключ").int(0, 1000));
  });

  it("bool(1) всегда true, bool(0) всегда false", () => {
    const r = rng(8);
    for (let i = 0; i < 50; i++) {
      expect(r.bool(1)).toBe(true);
      expect(r.bool(0)).toBe(false);
    }
  });
});

describe("timeBucket", () => {
  it("одинаков внутри минуты и меняется на следующей", () => {
    // Выравниваем по границе минуты: иначе +59 с может перескочить её сам.
    const start = Math.floor(1_700_000_000_000 / 60_000) * 60_000;
    expect(timeBucket(start)).toBe(timeBucket(start + 59_999));
    expect(timeBucket(start + 60_000)).toBe(timeBucket(start) + 1);
  });
});
