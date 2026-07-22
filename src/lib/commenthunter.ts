import type { LeadTier } from "@/lib/leadradar";

export type HuntedComment = {
  handle: string;
  text: string;
  tier: LeadTier;
  score: number; // 0–100
  reason: string;
  reply: string;
};

export type HuntedPost = {
  author: string;
  text: string;
  posted: string;
  likes: number;
  comments: HuntedComment[];
};

export type CommentHunterResult = {
  keyword: string;
  posts: HuntedPost[];
};

export type { LeadTier };
export { TIER_META } from "@/lib/leadradar";
