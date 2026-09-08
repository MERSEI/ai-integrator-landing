import { NextRequest, NextResponse } from "next/server";
import { checkDailyLimit, checkToolLimit, clientIp } from "@/lib/rate-limit";
import { apiMessage } from "@/lib/apiMessages";
import { burstLimited, requestLocale } from "@/lib/engine/request";
import { generateText, outputLanguage } from "@/lib/ai/gateway";
import { aiErrorResponse } from "@/lib/ai/route";
import { getContent } from "@/lib/content";


/** Роль задаёт только тон и рамку; сам ответ пишет модель. */
const MAX_MESSAGES = 12;
const MAX_CHARS = 600;

type WireMsg = { role: "user" | "model"; content: string };

/**
 * Мини-плейграунд агента с лендинга: обычный текстовый ответ, без structured
 * output — посетитель должен увидеть живую реплику, а не JSON.
 *
 * Системный промпт берётся из словаря контента по ключу роли, а не из тела
 * запроса: иначе любой желающий мог бы использовать наш ключ модели как
 * бесплатный прокси к произвольному промпту.
 */
export async function POST(req: NextRequest) {
  const rawBody: unknown = await req.json().catch(() => null);
  const locale = requestLocale(rawBody);
  const ip = clientIp(req.headers);

  if (burstLimited("agentdemo", ip)) {
    return NextResponse.json(
      { error: apiMessage(locale, "tooManyRequests") },
      { status: 429 },
    );
  }
  const daily = await checkDailyLimit(ip);
  if (!daily.ok) {
    return NextResponse.json({ error: apiMessage(locale, "dailyLimit") }, { status: 429 });
  }
  const toolLimit = await checkToolLimit(ip, "agentdemo");
  if (!toolLimit.ok) {
    return NextResponse.json({ error: apiMessage(locale, "toolLimit") }, { status: 429 });
  }

  if (rawBody === null) {
    return NextResponse.json({ error: apiMessage(locale, "badRequest") }, { status: 400 });
  }
  const body = rawBody as { role?: string; messages?: WireMsg[] };

  const roles = getContent(locale).liveDemo.roles;
  const role = roles.find((r) => r.key === body.role) ?? roles[0];

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser || firstUser.content.trim().length < 2) {
    return NextResponse.json({ error: apiMessage(locale, "badRequest") }, { status: 400 });
  }
  if (messages.length > MAX_MESSAGES) {
    return NextResponse.json({ error: apiMessage(locale, "chatTooLong") }, { status: 400 });
  }

  const history = messages.map((m) => ({
    role: (m.role === "model" ? "assistant" : "user") as "assistant" | "user",
    content: String(m.content ?? "").slice(0, MAX_CHARS),
  }));

  const result = await generateText({
    system: role.prompt + outputLanguage(locale),
    messages: history,
    temperature: 0.7,
    maxTokens: 400,
  });
  if (!result.ok) return aiErrorResponse(locale, result.reason);

  return NextResponse.json({ reply: result.value, remaining: toolLimit.remaining });
}
