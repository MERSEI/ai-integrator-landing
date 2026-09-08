import type { PoachingResult, Prospect } from "@/lib/poaching";
import type { LeadTier } from "@/lib/leadradar";
import { POACHING } from "../banks/poaching";
import { brandHandle, handle } from "../handles";
import type { Rng } from "../random";
import { classifyNiche, nicheVocab } from "../taxonomy/niches";
import { fill } from "../text";
import type { EngineLocale } from "../types";
import { scoreFor, tierSplit } from "./tiers";

export type PoachingInput = { niche: string; competitors?: string };

/**
 * Демо-выдача Poaching: семь вымышленных людей, которые комментировали
 * конкурентов и в этот момент выбирают исполнителя.
 *
 * Если пользователь перечислил конкурентов, берём их аккаунты как есть —
 * увидеть в выдаче собственный список важнее, чем красивый вымышленный ник.
 */
export function generatePoaching(
  input: PoachingInput,
  locale: EngineLocale,
  r: Rng
): PoachingResult {
  const niche = input.niche.trim();
  const bank = POACHING[locale];
  const vocab = nicheVocab(classifyNiche(niche), locale);
  const competitors = competitorHandles(input.competitors, niche, r);

  const tiers = tierSplit(r);
  const usedScores = new Set<number>();
  const usedHandles = new Set<string>();
  const questionPool: Record<LeadTier, string[]> = {
    hot: r.shuffle(bank.question.hot),
    warm: r.shuffle(bank.question.warm),
    cold: r.shuffle(bank.question.cold),
  };
  const reasonPool: Record<LeadTier, string[]> = {
    hot: r.shuffle(bank.reason.hot),
    warm: r.shuffle(bank.reason.warm),
    cold: r.shuffle(bank.reason.cold),
  };
  const dmPool = r.shuffle(bank.dm);
  const taken: Record<LeadTier, number> = { hot: 0, warm: 0, cold: 0 };

  const prospects: Prospect[] = tiers.map((tier, index) => {
    const competitor = competitors[index % competitors.length];
    const slots = {
      niche,
      competitor,
      pain: r.pick(vocab.pain),
      outcome: r.pick(vocab.outcome),
      actor: r.pick(vocab.actor),
    };
    const question = questionPool[tier][taken[tier] % questionPool[tier].length];
    const reason = reasonPool[tier][taken[tier] % reasonPool[tier].length];
    taken[tier] += 1;

    return {
      handle: handle(r, usedHandles),
      competitor,
      question: fill(question, slots),
      score: scoreFor(r, tier, usedScores),
      tier,
      reason: fill(reason, slots),
      // Холодным не пишем: это коллеги и читатели, а не клиенты конкурента.
      dm: tier === "cold" ? "" : fill(dmPool[taken[tier] % dmPool.length], slots),
    };
  });

  prospects.sort((a, b) => b.score - a.score);
  return { niche, prospects };
}

/**
 * Аккаунты конкурентов: сначала то, что перечислил пользователь, и только
 * если он не перечислил ничего — вымышленные из корней ниши.
 */
function competitorHandles(raw: string | undefined, niche: string, r: Rng): string[] {
  const listed = (raw ?? "")
    .split(/[,;\n]+/)
    .map((s) => s.trim().replace(/^@?/, "@"))
    .filter((s) => s.length > 1);
  if (listed.length > 0) return listed;

  const used = new Set<string>();
  return Array.from({ length: 3 }, () => brandHandle(r, niche, used));
}
