import { NextRequest, NextResponse } from "next/server";
import { checkDailyLimit, checkToolLimit, clientIp } from "@/lib/rate-limit";
import { apiMessage } from "@/lib/apiMessages";
import { callGemini, burstLimited, outputLanguage, requestLocale } from "@/lib/gemini";

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    situation_read: { type: "string" },
    followups: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "string" },
          angle: { type: "string" },
          subject: { type: "string" },
          message: { type: "string" },
        },
        required: ["day", "angle", "subject", "message"],
      },
    },
    stop_signal: { type: "string" },
  },
  required: ["situation_read", "followups", "stop_signal"],
};

const SYSTEM_PROMPT = `Ты — FollowUpBot, эксперт по дожиму сделок. Продавец описывает контекст: с кем общался, что предлагал, на чём разговор завис и сколько времени прошло. Ты создаёшь цепочку follow-up сообщений.

Верни:
- situation_read: 1–2 предложения — как ты читаешь ситуацию: почему клиент замолчал и что им движет.
- followups: цепочка из 3 сообщений с РАЗНЫМИ углами (не «просто напоминаю» три раза!):
  1) day: "Сейчас" — мягкое возвращение в диалог с новой ценностью (инсайт, материал, идея).
  2) day: "Через 3–4 дня" — другой угол: кейс/социальное доказательство/вопрос о приоритетах.
  3) day: "Через 7–10 дней" — финальное: прямой честный вопрос + лёгкий выход (не давить).
  Для каждого: angle — короткое название подхода, subject — тема письма (если канал позволяет, иначе ""), message — готовый текст.
- stop_signal: 1 предложение — когда прекратить дожим и оставить человека в покое.

Правила: без пассивной агрессии («вы так и не ответили»), без вины, без манипуляций. Каждое сообщение — короткое, живое, даёт ценность или упрощает ответ. Учитывай канал и тон. Пиши по-русски.`;

export async function POST(req: NextRequest) {
  // Тело читаем сразу: локаль нужна уже для сообщений о лимитах.
  const rawBody: unknown = await req.json().catch(() => null);
  const locale = requestLocale(rawBody);
  const ip = clientIp(req.headers);
  if (burstLimited("followupbot", ip)) {
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

  const toolLimit = await checkToolLimit(ip, "followupbot");
  if (!toolLimit.ok) {
    return NextResponse.json(
      { error: apiMessage(locale, "toolLimit") },
      { status: 429 }
    );
  }

  if (rawBody === null) {
    return NextResponse.json({ error: apiMessage(locale, "badRequest") }, { status: 400 });
  }
  const body = rawBody as { context?: string; channel?: string; tone?: string };

  const context = body.context?.trim() ?? "";
  const channel = body.channel?.trim() || "Email";
  const tone = body.tone?.trim() || "Деловой (на вы)";
  if (context.length < 20) {
    return NextResponse.json(
      { error: apiMessage(locale, "needFollowupContext") },
      { status: 400 }
    );
  }

  const result = await callGemini({
    system: SYSTEM_PROMPT + outputLanguage(locale),
    contents: [
      {
        parts: [
          {
            text: `КОНТЕКСТ СДЕЛКИ:\n${context}\n\nКАНАЛ: ${channel}\nТОН: ${tone}`,
          },
        ],
      },
    ],
    schema: RESPONSE_SCHEMA,
    temperature: 0.85,
  });
  if (result instanceof NextResponse) return result;
  return NextResponse.json(result);
}
