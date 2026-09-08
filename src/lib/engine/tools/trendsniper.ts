import type {
  RegionInterest,
  RelatedQuery,
  TrendDirection,
  TrendSniperResult,
} from "@/lib/trendsniper";
import { TRENDSNIPER } from "../banks/trendsniper";
import { hashSeed, type Rng } from "../random";
import { classifyNiche, nicheVocab } from "../taxonomy/niches";
import { fill } from "../text";
import type { EngineLocale } from "../types";

export type TrendSniperInput = { keyword: string; region?: string };

/** Слова, по которым тема считается растущей независимо от хэша. */
const RISING = /\bai\b|нейросет|автоматизац|agent|автомат|gpt|automation|no-?code/i;
/** ...и затухающей. */
const FALLING = /факс|dvd|icq|flash|\bcd\b|телефонн.{0,3} справочник|blackberry/i;

const MIN_REGIONS = 5;
const MAX_REGIONS = 7;

/**
 * Демо-аналитика Trend Sniper по теме.
 *
 * Уровень интереса и направление считаются от хэша самой темы, а не от
 * случайности: если «маникюр» покажет то рост, то падение при повторном
 * запуске, демо потеряет доверие целиком. Всё остальное — формулировки,
 * порядок регионов, набор запросов — можно и нужно менять между запусками.
 */
export function generateTrendSniper(
  input: TrendSniperInput,
  locale: EngineLocale,
  r: Rng
): TrendSniperResult {
  const keyword = input.keyword.trim();
  const region = input.region?.trim() ?? "";
  const bank = TRENDSNIPER[locale];
  const vocab = nicheVocab(classifyNiche(keyword), locale);

  const h = hashSeed(keyword.toLowerCase());
  const interest_level = 38 + (h % 57); // 38..94
  const direction = directionFor(keyword, h);

  const top_regions = buildRegions(bank.regions, region, r);
  const related_queries = buildQueries(keyword, bank, vocab.relatedTerms, r);

  const slots = {
    keyword,
    level: interest_level,
    topRegion: top_regions[0].region,
    n: r.int(2, 4),
  };

  return {
    keyword,
    interest_level,
    direction,
    summary: fill(r.pick(bank.summary[direction]), slots),
    top_regions,
    related_queries,
    seasonality: fill(r.pick(bank.seasonality), slots),
    insight: fill(r.pick(bank.insight[direction]), slots),
  };
}

/** Направление устойчиво для темы: сначала явные маркеры, потом хэш. */
function directionFor(keyword: string, h: number): TrendDirection {
  if (RISING.test(keyword)) return "rising";
  if (FALLING.test(keyword)) return "falling";
  const bucket = h % 10;
  if (bucket < 5) return "rising";
  if (bucket < 8) return "stable";
  return "falling";
}

/**
 * Регионы по убыванию интереса. Регион, который назвал пользователь, всегда
 * первый со 100 — увидеть свой ввод на первом месте важнее правдоподобия
 * вымышленной сотни.
 */
function buildRegions(pool: string[], userRegion: string, r: Rng): RegionInterest[] {
  const count = r.int(MIN_REGIONS, MAX_REGIONS);
  const picked = r.pickN(
    pool.filter((x) => x.toLowerCase() !== userRegion.toLowerCase()),
    userRegion ? count - 1 : count
  );
  const names = userRegion ? [userRegion, ...picked] : picked;

  let score = 100;
  return names.map((name, i) => {
    if (i > 0) score = Math.max(20, score - r.int(6, 18));
    return { region: name, score };
  });
}

/**
 * Связанные запросы: минимум по два устойчивых и растущих.
 *
 * Пулы пересекаются — «цена» и «отзывы» есть и в общих модификаторах, и в
 * словаре ниши, — поэтому дедуплицируем до выбора. Иначе один и тот же запрос
 * появляется в списке дважды, к тому же с разными пометками.
 */
function buildQueries(
  keyword: string,
  bank: { topModifiers: string[]; risingModifiers: string[] },
  nicheTerms: string[],
  r: Rng
): RelatedQuery[] {
  const risingPool = [...new Set(bank.risingModifiers)];
  const topPool = [...new Set([...bank.topModifiers, ...nicheTerms])].filter(
    (m) => !risingPool.includes(m)
  );

  const top = r.pickN(topPool, r.int(3, 4));
  const rising = r.pickN(risingPool, r.int(3, 4));

  return r.shuffle([
    ...top.map((m) => ({ query: `${keyword} ${m}`, kind: "top" as const })),
    ...rising.map((m) => ({ query: `${keyword} ${m}`, kind: "rising" as const })),
  ]);
}
