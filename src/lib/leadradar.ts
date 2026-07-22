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
    className: "text-black ring-white/60 bg-white",
  },
  warm: {
    label: "Тёплый",
    className: "text-white ring-white/30 bg-white/15",
  },
  cold: {
    label: "Холодный",
    className: "text-slate-500 ring-white/10 bg-white/5",
  },
};
