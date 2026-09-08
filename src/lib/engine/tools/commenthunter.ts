import type {
  CommentHunterResult,
  HuntedComment,
  HuntedPost,
} from "@/lib/commenthunter";
import type { LeadTier } from "@/lib/leadradar";
import { COMMENTHUNTER } from "../banks/commenthunter";
import { brandHandle, handle } from "../handles";
import type { Rng } from "../random";
import { classifyNiche, nicheVocab } from "../taxonomy/niches";
import { relativeTime } from "../time";
import { fill } from "../text";
import type { EngineLocale } from "../types";
import { commentTierSplit, scoreFor } from "./tiers";

export type CommentHunterInput = { keyword: string; product?: string };

const POSTS = 3;

/**
 * Демо-выдача Comment Hunter: три популярных поста по теме и лиды в
 * комментариях под ними.
 *
 * Баллы не повторяются в пределах всей выдачи, а не только внутри поста:
 * пользователь сравнивает карточки между постами тоже.
 */
export function generateCommentHunter(
  input: CommentHunterInput,
  locale: EngineLocale,
  r: Rng
): CommentHunterResult {
  const keyword = input.keyword.trim();
  const product = input.product?.trim() ?? "";
  const bank = COMMENTHUNTER[locale];
  const vocab = nicheVocab(classifyNiche(`${keyword} ${product}`), locale);

  const usedScores = new Set<number>();
  const usedHandles = new Set<string>();
  const usedAuthors = new Set<string>();
  const postTexts = r.pickN(bank.post, POSTS);
  const commentPool: Record<LeadTier, string[]> = {
    hot: r.shuffle(bank.comment.hot),
    warm: r.shuffle(bank.comment.warm),
    cold: r.shuffle(bank.comment.cold),
  };
  const reasonPool: Record<LeadTier, string[]> = {
    hot: r.shuffle(bank.reason.hot),
    warm: r.shuffle(bank.reason.warm),
    cold: r.shuffle(bank.reason.cold),
  };
  const replyPool = r.shuffle(bank.reply);
  const taken: Record<LeadTier, number> = { hot: 0, warm: 0, cold: 0 };
  let replyIndex = 0;

  const posts: HuntedPost[] = postTexts.map((template) => {
    const comments: HuntedComment[] = commentTierSplit(r).map((tier) => {
      const slots = {
        keyword,
        pain: r.pick(vocab.pain),
        outcome: product || r.pick(vocab.outcome),
        actor: r.pick(vocab.actor),
      };
      const text = commentPool[tier][taken[tier] % commentPool[tier].length];
      const reason = reasonPool[tier][taken[tier] % reasonPool[tier].length];
      taken[tier] += 1;

      return {
        handle: handle(r, usedHandles),
        text: fill(text, slots),
        tier,
        score: scoreFor(r, tier, usedScores),
        reason: fill(reason, slots),
        reply: tier === "cold" ? "" : fill(replyPool[replyIndex++ % replyPool.length], slots),
      };
    });

    comments.sort((a, b) => b.score - a.score);

    return {
      author: brandHandle(r, keyword, usedAuthors),
      text: fill(template, { keyword }),
      posted: relativeTime(r, locale, "recent"),
      // Логарифмическая шкала: линейный int(120, 3800) даёт неправдоподобно
      // ровное распределение, у настоящих постов лайки так не выглядят.
      likes: Math.round(20 * Math.pow(250, r.next())),
      comments,
    };
  });

  return { keyword, posts };
}
