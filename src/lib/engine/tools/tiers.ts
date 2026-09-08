import type { LeadTier } from "@/lib/leadradar";
import type { Rng } from "../random";

/**
 * Раскладка по тирам и баллы — общие для LeadRadar, Poaching и CommentHunter.
 *
 * Границы взяты из промптов, которые эти инструменты слали модели: у горячих
 * 78–96, у тёплых 45–72, у холодных 8–35. Модель их соблюдала «как получится»,
 * здесь они соблюдаются точно.
 */

export const SCORE_BANDS: Record<LeadTier, readonly [number, number]> = {
  hot: [78, 96],
  warm: [45, 72],
  cold: [8, 35],
};

/**
 * Раскладка семи элементов по тирам.
 *
 * Перечисляем валидные варианты вместо арифметики: спецификация требует
 * 2–3 горячих, 2–3 тёплых и 1–2 холодных, и перечисление — единственный
 * способ соблюсти все три условия разом, ничего не округляя.
 */
const SPLITS_7: readonly (readonly [number, number, number])[] = [
  [3, 3, 1],
  [3, 2, 2],
  [2, 3, 2],
];

/** Массив тиров длиной 7 в перемешанном порядке. */
export function tierSplit(r: Rng): LeadTier[] {
  const [hot, warm, cold] = r.pick(SPLITS_7);
  const tiers: LeadTier[] = [
    ...Array<LeadTier>(hot).fill("hot"),
    ...Array<LeadTier>(warm).fill("warm"),
    ...Array<LeadTier>(cold).fill("cold"),
  ];
  return r.shuffle(tiers);
}

/**
 * Раскладка комментариев под одним постом: 4–5 штук, минимум один горячий и
 * минимум один холодный — иначе подборка выглядит однородной и ненастоящей.
 */
export function commentTierSplit(r: Rng): LeadTier[] {
  const total = r.int(4, 5);
  const rest = Array.from({ length: total - 2 }, () =>
    r.bool(0.6) ? ("warm" as const) : r.pick(["hot", "warm", "cold"] as const)
  );
  return r.shuffle(["hot", "cold", ...rest]);
}

/**
 * Балл внутри полосы тира, не повторяющийся в пределах одного ответа:
 * одинаковые баллы в отсортированном списке выглядят как ошибка.
 */
export function scoreFor(r: Rng, tier: LeadTier, used: Set<number>): number {
  const [min, max] = SCORE_BANDS[tier];
  for (let attempt = 0; attempt < 30; attempt++) {
    const score = r.int(min, max);
    if (!used.has(score)) {
      used.add(score);
      return score;
    }
  }
  // Полоса плотно занята — берём ближайший свободный балл внутри неё.
  for (let score = min; score <= max; score++) {
    if (!used.has(score)) {
      used.add(score);
      return score;
    }
  }
  return min;
}
