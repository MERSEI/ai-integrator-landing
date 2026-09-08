import { NextRequest, NextResponse } from "next/server";
import { checkDailyLimit, checkToolLimit, clientIp } from "@/lib/rate-limit";
import { apiMessage } from "@/lib/apiMessages";
import { burstLimited, requestLocale } from "@/lib/engine/request";
import { generateTrendSniper } from "@/lib/engine/tools/trendsniper";
import { seedFrom } from "@/lib/engine/seed";

/**
 * Trend Sniper: демо-аналитика поискового интереса к теме.
 *
 * Считается собственным движком, без обращения к модели. Данные здесь и
 * раньше были вымышленными — промпт прямо просил их сочинить, — так что
 * внешний вызов ничего не добавлял, зато стоил денег, секунд ожидания и
 * зависимости от чужого ключа.
 */
export async function POST(req: NextRequest) {
  // Тело читаем сразу: локаль нужна уже для сообщений о лимитах.
  const rawBody: unknown = await req.json().catch(() => null);
  const locale = requestLocale(rawBody);
  const ip = clientIp(req.headers);

  if (burstLimited("trendsniper", ip)) {
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
  const toolLimit = await checkToolLimit(ip, "trendsniper");
  if (!toolLimit.ok) {
    return NextResponse.json(
      { error: apiMessage(locale, "toolLimit") },
      { status: 429 }
    );
  }

  if (rawBody === null) {
    return NextResponse.json({ error: apiMessage(locale, "badRequest") }, { status: 400 });
  }
  const body = rawBody as { keyword?: string; region?: string };

  const keyword = body.keyword?.trim() ?? "";
  const region = body.region?.trim() ?? "";
  if (keyword.length < 2) {
    return NextResponse.json(
      { error: apiMessage(locale, "needKeywordTopic") },
      { status: 400 }
    );
  }

  try {
    const r = seedFrom([keyword, region, locale]);
    return NextResponse.json(generateTrendSniper({ keyword, region }, locale, r));
  } catch (e) {
    console.error("trendsniper generation failed:", e);
    return NextResponse.json(
      { error: apiMessage(locale, "generationFailed") },
      { status: 500 }
    );
  }
}
