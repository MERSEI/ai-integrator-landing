import type { Lead, LeadRadarResult, LeadTier } from "@/lib/leadradar";
import { LEADRADAR } from "../banks/leadradar";
import { handle } from "../handles";
import type { Rng } from "../random";
import { classifyNiche, nicheVocab } from "../taxonomy/niches";
import { relativeTime, type Freshness } from "../time";
import { fill } from "../text";
import type { EngineLocale } from "../types";
import { scoreFor, tierSplit } from "./tiers";

export type LeadRadarInput = { keyword: string; product?: string };

/**
 * Демо-выдача LeadRadar: семь вымышленных постов Threads по ключевому слову.
 *
 * Данные здесь и раньше были выдуманными — промпт прямо просил модель
 * сочинить примеры. Разница в том, что теперь распределение по тирам и
 * границы баллов соблюдаются точно, ответ приходит мгновенно и не стоит денег.
 */
export function generateLeadRadar(
  input: LeadRadarInput,
  locale: EngineLocale,
  r: Rng
): LeadRadarResult {
  const keyword = input.keyword.trim();
  const product = input.product?.trim() ?? "";
  const bank = LEADRADAR[locale];
  const vocab = nicheVocab(classifyNiche(`${keyword} ${product}`), locale);

  const tiers = tierSplit(r);
  const usedScores = new Set<number>();
  const usedHandles = new Set<string>();
  // Шаблоны выбираем без повторов на весь ответ: два поста с одним скелетом —
  // первое, что выдаёт шаблонный генератор.
  const postPool: Record<LeadTier, string[]> = {
    hot: r.shuffle(bank.post.hot),
    warm: r.shuffle(bank.post.warm),
    cold: r.shuffle(bank.post.cold),
  };
  const reasonPool: Record<LeadTier, string[]> = {
    hot: r.shuffle(bank.reason.hot),
    warm: r.shuffle(bank.reason.warm),
    cold: r.shuffle(bank.reason.cold),
  };
  const replyPool = r.shuffle(bank.reply);
  const taken: Record<LeadTier, number> = { hot: 0, warm: 0, cold: 0 };

  const leads: Lead[] = tiers.map((tier) => {
    const slots = {
      keyword,
      pain: r.pick(vocab.pain),
      outcome: product || r.pick(vocab.outcome),
      actor: r.pick(vocab.actor),
      n: r.int(2, 6),
    };

    const post = postPool[tier][taken[tier] % postPool[tier].length];
    const reason = reasonPool[tier][taken[tier] % reasonPool[tier].length];
    taken[tier] += 1;

    // Горячий лид, написанный неделю назад, — заметная фальшь.
    const freshness: Freshness =
      tier === "hot" ? "fresh" : tier === "warm" ? "recent" : "old";

    return {
      handle: handle(r, usedHandles),
      text: fill(post, slots),
      posted: relativeTime(r, locale, freshness),
      score: scoreFor(r, tier, usedScores),
      tier,
      reason: fill(reason, slots),
      // У холодных ответа нет намеренно: это не лид, писать ему нечего.
      reply: tier === "cold" ? "" : fill(replyPool[taken[tier] % replyPool.length], slots),
    };
  });

  leads.sort((a, b) => b.score - a.score);
  return { keyword, leads };
}
