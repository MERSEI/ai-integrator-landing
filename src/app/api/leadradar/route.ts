import { NextRequest, NextResponse } from "next/server";
import { checkDailyLimit, checkToolLimit, clientIp } from "@/lib/rate-limit";
import { apiMessage } from "@/lib/apiMessages";
import { burstLimited, requestLocale } from "@/lib/engine/request";
import { generateLeadRadar } from "@/lib/engine/tools/leadradar";
import { seedFrom } from "@/lib/engine/seed";

/**
 * LeadRadar: демо-подборка лидов по ключевому слову.
 *
 * Считается собственным движком, без обращения к модели. Данные здесь и
 * раньше были вымышленными — промпт прямо просил сочинить примеры постов, —
 * так что внешний вызов ничего не добавлял, зато стоил денег, секунд ожидания
 * и зависимости от чужого ключа.
 */
export async function POST(req: NextRequest) {
  // Тело читаем сразу: локаль нужна уже для сообщений о лимитах.
  const rawBody: unknown = await req.json().catch(() => null);
  const locale = requestLocale(rawBody);
  const ip = clientIp(req.headers);

  if (burstLimited("leadradar", ip)) {
    return NextResponse.json(
      { error: apiMessage(locale, "tooManyRequests") },
      { status: 429 }
    );
  }
  const daily = await checkDailyLimit(ip);
  if (!daily.ok) {
    return NextResponse.json(
      { error: apiMessage(locale, "dailyLimit") },
      { status: 429 }
    );
  }
  const toolLimit = await checkToolLimit(ip, "leadradar");
  if (!toolLimit.ok) {
    return NextResponse.json(
      { error: apiMessage(locale, "toolLimit") },
      { status: 429 }
    );
  }

  if (rawBody === null) {
    return NextResponse.json({ error: apiMessage(locale, "badRequest") }, { status: 400 });
  }
  const body = rawBody as { keyword?: string; product?: string };

  const keyword = body.keyword?.trim() ?? "";
  const product = body.product?.trim() ?? "";
  if (keyword.length < 2) {
    return NextResponse.json(
      { error: apiMessage(locale, "needKeywordNiche") },
      { status: 400 }
    );
  }

  try {
    const r = seedFrom([keyword, product, locale]);
    return NextResponse.json(generateLeadRadar({ keyword, product }, locale, r));
  } catch (e) {
    console.error("leadradar generation failed:", e);
    return NextResponse.json(
      { error: apiMessage(locale, "generationFailed") },
      { status: 500 }
    );
  }
}
