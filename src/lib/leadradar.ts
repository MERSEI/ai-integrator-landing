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

export const TIER_META: Record<
  LeadTier,
  { label: string; className: string }
> = {
  hot: {
    label: "Горячий",
    className: "text-rose-300 ring-rose-400/30 bg-rose-400/10",
  },
  warm: {
    label: "Тёплый",
    className: "text-amber-300 ring-amber-400/30 bg-amber-400/10",
  },
  cold: {
    label: "Холодный",
    className: "text-slate-400 ring-white/15 bg-white/5",
  },
};
