import type { CommentHunterResult } from "@/lib/commenthunter";
import type { LeadRadarResult } from "@/lib/leadradar";
import type { PoachingResult } from "@/lib/poaching";
import type { TrendSniperResult } from "@/lib/trendsniper";
import { sampleSeed } from "@/lib/engine/seed";
import { generateCommentHunter } from "@/lib/engine/tools/commenthunter";
import { generateLeadRadar } from "@/lib/engine/tools/leadradar";
import { generatePoaching } from "@/lib/engine/tools/poaching";
import { generateTrendSniper } from "@/lib/engine/tools/trendsniper";
import type { EngineLocale } from "@/lib/engine/types";
import { toolSample } from "./samples";

/**
 * Готовые результаты, которые страница показывает ещё до первого нажатия.
 *
 * Считаются на сервере при рендере страницы: движок локальный, так что это
 * стоит доли миллисекунды, не ходит в сеть и не тратит демо-лимит
 * пользователя. Сид фиксирован — пример обязан выглядеть одинаково при
 * каждом заходе, иначе разъедется гидрация.
 */

export type SampleOf<T> = { input: Record<string, string>; result: T };

export function leadRadarSample(locale: EngineLocale): SampleOf<LeadRadarResult> {
  const input = toolSample("leadradar", locale);
  return {
    input,
    result: generateLeadRadar(
      { keyword: input.keyword, product: input.product },
      locale,
      sampleSeed("leadradar", locale)
    ),
  };
}

export function poachingSample(locale: EngineLocale): SampleOf<PoachingResult> {
  const input = toolSample("poaching", locale);
  return {
    input,
    result: generatePoaching(
      { niche: input.niche, competitors: input.competitors },
      locale,
      sampleSeed("poaching", locale)
    ),
  };
}

export function commentHunterSample(
  locale: EngineLocale
): SampleOf<CommentHunterResult> {
  const input = toolSample("commenthunter", locale);
  return {
    input,
    result: generateCommentHunter(
      { keyword: input.keyword, product: input.product },
      locale,
      sampleSeed("commenthunter", locale)
    ),
  };
}

export function trendSniperSample(locale: EngineLocale): SampleOf<TrendSniperResult> {
  const input = toolSample("trendsniper", locale);
  return {
    input,
    result: generateTrendSniper(
      { keyword: input.keyword, region: input.region },
      locale,
      sampleSeed("trendsniper", locale)
    ),
  };
}
