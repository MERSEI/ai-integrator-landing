export type LeadTier = "hot" | "warm" | "cold";

export type Lead = {
  handle: string;
  text: string;
  posted: string;
  score: number; // 0–100
  tier: LeadTier;
  reason: string;
  reply: string;
};

export type LeadRadarResult = {
  keyword: string;
  leads: Lead[];
};

/** Только оформление — подписи переводятся, см. getTools(locale).tiers. */
export const TIER_CLASSES: Record<LeadTier, string> = {
  hot: "text-black ring-white/60 bg-white",
  warm: "text-white ring-white/30 bg-white/15",
  cold: "text-slate-500 ring-white/10 bg-white/5",
};
