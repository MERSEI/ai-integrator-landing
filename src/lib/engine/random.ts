/**
 * Детерминированный генератор псевдослучайности.
 *
 * Весь движок обязан быть воспроизводимым: одинаковый seed — одинаковый ответ.
 * Тесты этим пользуются напрямую, а роуты выводят seed из входных данных
 * пользователя плюс грубой минутной корзины времени — так повторное нажатие
 * кнопки даёт другой текст, но в пределах одной минуты ответ стабилен.
 */

/** FNV-1a: короткий хэш строки в 32-битное беззнаковое число. */
export function hashSeed(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 — 32-битный PRNG на одну переменную состояния. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Rng = {
  /** Следующее число в [0, 1). */
  next(): number;
  /** Целое в [min, max] включительно. */
  int(min: number, max: number): number;
  /** Один элемент списка. */
  pick<T>(xs: readonly T[]): T;
  /**
   * n различных элементов. Если n больше длины списка — вернётся весь список
   * в перемешанном порядке, но без повторов: дубли внутри одного ответа
   * заметны сильнее, чем нехватка вариантов.
   */
  pickN<T>(xs: readonly T[], n: number): T[];
  shuffle<T>(xs: readonly T[]): T[];
  /** true с вероятностью p (по умолчанию 0.5). */
  bool(p?: number): boolean;
};

export function rng(seed: number | string): Rng {
  const next = mulberry32(typeof seed === "string" ? hashSeed(seed) : seed);

  const shuffle = <T,>(xs: readonly T[]): T[] => {
    const out = [...xs];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };

  return {
    next,
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    pick: (xs) => xs[Math.floor(next() * xs.length)],
    pickN: (xs, n) => shuffle(xs).slice(0, Math.min(n, xs.length)),
    shuffle,
    bool: (p = 0.5) => next() < p,
  };
}

/**
 * Корзина времени для seed: меняется раз в минуту. Достаточно, чтобы повторный
 * запуск с тем же вводом дал другой результат, и достаточно медленно, чтобы
 * случайный двойной клик не выглядел сломанным.
 */
export function timeBucket(now = Date.now()): number {
  return Math.floor(now / 60_000);
}
