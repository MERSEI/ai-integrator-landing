export type TrendDirection = "rising" | "falling" | "stable";

export type RegionInterest = { region: string; score: number };
export type RelatedQuery = { query: string; kind: "top" | "rising" };

export type TrendSniperResult = {
  keyword: string;
  interest_level: number; // 0–100
  direction: TrendDirection;
  summary: string;
  top_regions: RegionInterest[];
  related_queries: RelatedQuery[];
  seasonality: string;
  insight: string;
};

/** Только оформление — подписи переводятся, см. getTools(locale).direction. */
export const DIRECTION_META: Record<
  TrendDirection,
  { className: string; arrow: string }
> = {
  rising: { className: "text-black ring-white/60 bg-white", arrow: "↑" },
  falling: { className: "text-neutral-400 ring-white/15 bg-white/5", arrow: "↓" },
  stable: { className: "text-slate-300 ring-white/15 bg-white/5", arrow: "→" },
};
