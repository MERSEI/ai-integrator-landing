import { NextRequest, NextResponse } from "next/server";
import { checkDailyLimit, checkToolLimit, clientIp } from "@/lib/rate-limit";
import { apiMessage } from "@/lib/apiMessages";
import { burstLimited, requestLocale } from "@/lib/engine/request";
import { generateJson, outputLanguage } from "@/lib/ai/gateway";
import { aiErrorResponse } from "@/lib/ai/route";



const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    status: { type: "string" },
    message: { type: "string" },
    questions: { type: "array", items: { type: "string" } },
    hidden_reason: { type: "string" },
    tactics: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          script: { type: "string" },
          why: { type: "string" },
        },
        required: ["name", "script", "why"],
      },
    },
    recommendation: { type: "string" },
  },
  required: [
    "status",
    "message",
    "questions",
    "hidden_reason",
    "tactics",
    "recommendation",
  ],
};

const SYSTEM_PROMPT = `Ты — опытный эксперт по продажам и работе с возражениями. Продавец описывает ситуацию с клиентом и возражение, которое услышал.

Работаешь в два этапа:

1. УТОЧНЕНИЕ (status: "clarifying"). Если контекста не хватает для сильного, точного ответа — задай 1–3 коротких уточняющих вопроса. Что важно понять: что именно продаётся и по какой цене, кто клиент и его ситуация, на каком этапе сделка, что клиент уже говорил, с чем сравнивает. В поле message — короткая живая реакция (1 предложение), в questions — сами вопросы. Не задавай больше 2 раундов уточнений суммарно.

2. ОТВЕТ (status: "ready"). Когда контекста достаточно (или после 2 раундов уточнений) — выдай:
- hidden_reason: что на самом деле стоит за возражением (истинная причина, не поверхностная формулировка).
- tactics: 3–4 разные тактики ответа. Для каждой: name (короткое название тактики), script (готовая фраза на русском, которую продавец может сказать клиенту дословно), why (1 предложение — почему это работает).
- recommendation: какую тактику выбрать именно в этой ситуации и почему.
- message: 1 короткое предложение-подводка.

Правила: пиши по-русски, живо и по делу, без канцелярита и воды. script должен звучать как живая речь, а не как фраза из методички. Всегда заполняй ВСЕ поля JSON: неприменимые — пустой строкой "" или пустым массивом [].`;

type WireMsg = { role: "user" | "model"; content: string };

export async function POST(req: NextRequest) {
  // Тело читаем сразу: локаль нужна уже для сообщений о лимитах.
  const rawBody: unknown = await req.json().catch(() => null);
  const locale = requestLocale(rawBody);
  const ip = clientIp(req.headers);
  if (burstLimited("objectionkiller", ip, 20)) {
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

  const toolLimit = await checkToolLimit(ip, "objectionkiller");
  if (!toolLimit.ok) {
    return NextResponse.json(
      { error: apiMessage(locale, "toolLimit") },
      { status: 429 }
    );
  }

  if (rawBody === null) {
    return NextResponse.json({ error: apiMessage(locale, "badRequest") }, { status: 400 });
  }
  const body = rawBody as { messages?: WireMsg[] };

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser || firstUser.content.trim().length < 5) {
    return NextResponse.json(
      { error: apiMessage(locale, "needObjection") },
      { status: 400 }
    );
  }
  // защита от переполнения контекста
  if (messages.length > 24) {
    return NextResponse.json(
      { error: apiMessage(locale, "chatTooLongSituation") },
      { status: 400 }
    );
  }

  const history = messages.map((m) => ({
    role: (m.role === "model" ? "assistant" : "user") as "assistant" | "user",
    content: String(m.content ?? ""),
  }));

  const result = await generateJson<Record<string, unknown>>({
    system: SYSTEM_PROMPT + outputLanguage(locale),
    messages: history,
    schema: RESPONSE_SCHEMA,
    schemaName: "objectionkiller",
    temperature: 0.7,
  });
  if (!result.ok) return aiErrorResponse(locale, result.reason, "modelEmptyDescription");

  // нормализация на случай пропущенных полей
  const r = result.value;
  r.status = r.status === "ready" ? "ready" : "clarifying";
  r.questions = Array.isArray(r.questions) ? r.questions : [];
  r.tactics = Array.isArray(r.tactics) ? r.tactics : [];
  return NextResponse.json(r);
}
