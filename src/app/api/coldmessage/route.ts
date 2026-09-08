import { NextRequest, NextResponse } from "next/server";
import { checkDailyLimit, checkToolLimit, clientIp } from "@/lib/rate-limit";
import { apiMessage } from "@/lib/apiMessages";
import { burstLimited, requestLocale } from "@/lib/engine/request";
import { generateJson, outputLanguage } from "@/lib/ai/gateway";
import { aiErrorResponse } from "@/lib/ai/route";

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    contacts: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string" },
          value: { type: "string" },
        },
        required: ["type", "value"],
      },
    },
    signals: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: { type: "string" },
          detail: { type: "string" },
        },
        required: ["category", "detail"],
      },
    },
    approach: { type: "string" },
    subject: { type: "string" },
    message: { type: "string" },
  },
  required: ["contacts", "signals", "approach", "message"],
};

const SYSTEM_PROMPT = `Ты — эксперт по холодному аутричу и персонализации продаж.
Из текста профиля извлекаешь:
1. contacts — контактные данные (email, телефон, telegram, сайт, LinkedIn и т.п.). type — вид контакта строчными буквами, value — само значение. Если контактов нет — пустой массив.
2. signals — сигналы для зацепки: события, достижения, предпочтения, интересы, боли, найм, новости. category — короткая категория на русском, detail — конкретика из профиля. Бери только то, что реально есть в тексте, ничего не выдумывай.
3. approach — 1–2 предложения: на какой сигнал опереться и почему такой подход сработает.
4. subject — тема письма. Заполняй ТОЛЬКО если канал Email, иначе пустая строка.
5. message — переписанное шаблонное предложение в тёплое персонализированное сообщение под указанный канал и тон.

Правила для message:
- Пиши на русском, живо и по-человечески, без канцелярита.
- Запрещены клише: «Надеюсь, у вас всё хорошо», «Меня зовут… и я представляю компанию…», «Не хочу отнимать много времени».
- Начни с конкретной зацепки из signals, а не с себя.
- Соблюдай тон и обращение (на ты / на вы) и уместную длину под канал (для Telegram/WhatsApp короче, для Email можно чуть длиннее).
- Сохрани суть исходного предложения, но подай персонально.
Верни строго JSON по схеме.`;

export async function POST(req: NextRequest) {
  // Тело читаем сразу: локаль нужна уже для сообщений о лимитах.
  const rawBody: unknown = await req.json().catch(() => null);
  const locale = requestLocale(rawBody);
  const ip = clientIp(req.headers);
  if (burstLimited("coldmessage", ip)) {
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

  const toolLimit = await checkToolLimit(ip, "coldmessage");
  if (!toolLimit.ok) {
    return NextResponse.json(
      { error: apiMessage(locale, "toolLimit") },
      { status: 429 }
    );
  }

  if (rawBody === null) {
    return NextResponse.json({ error: apiMessage(locale, "badRequest") }, { status: 400 });
  }
  const body = rawBody as {
    profileText?: string;
    offerTemplate?: string;
    channel?: string;
    tone?: string;
    sourceLink?: string;
  };

  const profileText = body.profileText?.trim() ?? "";
  const offerTemplate = body.offerTemplate?.trim() ?? "";
  const channel = body.channel?.trim() || "Email";
  const tone = body.tone?.trim() || "Деловой (на вы)";
  const sourceLink = body.sourceLink?.trim();

  if (profileText.length < 20) {
    return NextResponse.json(
      { error: apiMessage(locale, "needProfile") },
      { status: 400 }
    );
  }
  if (offerTemplate.length < 10) {
    return NextResponse.json(
      { error: apiMessage(locale, "needOffer") },
      { status: 400 }
    );
  }

  const userText = [
    `ПРОФИЛЬ:\n${profileText}`,
    sourceLink ? `ССЫЛКА-ИСТОЧНИК: ${sourceLink}` : null,
    `ШАБЛОН ПРЕДЛОЖЕНИЯ:\n${offerTemplate}`,
    `КАНАЛ: ${channel}`,
    `ТОН: ${tone}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const result = await generateJson({
    system: SYSTEM_PROMPT + outputLanguage(locale),
    messages: [{ role: "user", content: userText }],
    schema: RESPONSE_SCHEMA,
    schemaName: "coldmessage",
    temperature: 0.9,
  });
  if (!result.ok) return aiErrorResponse(locale, result.reason, "modelEmptyProfile");
  return NextResponse.json(result.value);
}
