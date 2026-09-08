import { NextRequest, NextResponse } from "next/server";
import { checkDailyLimit, checkToolLimit, clientIp } from "@/lib/rate-limit";
import { apiMessage } from "@/lib/apiMessages";
import { burstLimited, requestLocale } from "@/lib/engine/request";
import { generatePoaching } from "@/lib/engine/tools/poaching";
import { seedFrom } from "@/lib/engine/seed";

/**
 * Poaching: демо-подборка клиентов конкурентов, которые сейчас выбирают.
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

  if (burstLimited("poaching", ip)) {
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
  const toolLimit = await checkToolLimit(ip, "poaching");
  if (!toolLimit.ok) {
    return NextResponse.json(
      { error: apiMessage(locale, "toolLimit") },
      { status: 429 }
    );
  }

  if (rawBody === null) {
    return NextResponse.json({ error: apiMessage(locale, "badRequest") }, { status: 400 });
  }
  const body = rawBody as { niche?: string; competitors?: string };

  const niche = body.niche?.trim() ?? "";
  const competitors = body.competitors?.trim() ?? "";
  if (niche.length < 2) {
    return NextResponse.json(
      { error: apiMessage(locale, "needNiche") },
      { status: 400 }
    );
  }

  try {
    const r = seedFrom([niche, competitors, locale]);
    return NextResponse.json(generatePoaching({ niche, competitors }, locale, r));
  } catch (e) {
    console.error("poaching generation failed:", e);
    return NextResponse.json(
      { error: apiMessage(locale, "generationFailed") },
      { status: 500 }
    );
  }
}
