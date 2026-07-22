import type { LeadTier } from "@/lib/leadradar";

export type Prospect = {
  handle: string;
  competitor: string; // @аккаунт конкурента, под чьим постом комментил
  question: string; // что спрашивал / писал (подтверждённый интерес)
  score: number; // 0–100
  tier: LeadTier;
  reason: string;
  dm: string; // черновик захода в личку
};

export type PoachingResult = {
  niche: string;
  prospects: Prospect[];
};

export type { LeadTier };
export { TIER_META } from "@/lib/leadradar";
