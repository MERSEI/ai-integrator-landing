import { NextRequest, NextResponse } from "next/server";
import { checkDailyLimit, clientIp } from "@/lib/rate-limit";
import { callGemini, burstLimited } from "@/lib/gemini";

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    category: { type: "string" },
    urgency: { type: "string" },
    needs_reply: { type: "boolean" },
    summary: { type: "string" },
    action_items: { type: "array", items: { type: "string" } },
    reply: { type: "string" },
  },
  required: ["category", "urgency", "needs_reply", "summary", "action_items", "reply"],
};

const SYSTEM_PROMPT = `Ты — InboxZero, ассистент по разбору почты. Пользователь вставляет входящее письмо — ты классифицируешь его и готовишь ответ.

Верни:
- category: одна из категорий: "Клиент" | "Продажа/лид" | "Партнёрство" | "Счета/финансы" | "Спам/рассылка" | "Внутреннее" | "Другое".
- urgency: "high" | "medium" | "low" — насколько срочно нужно реагировать.
- needs_reply: true/false — требует ли письмо ответа вообще.
- summary: 1–2 предложения — суть письма без воды.
- action_items: 0–3 конкретных действия, которые следуют из письма (пустой массив, если нет).
- reply: готовый ответ на письмо тем же языком и уместным тоном (если needs_reply false — вежливый короткий вариант «на всякий случай» или пустая строка для явного спама).

Если пользователь добавил указание, каким должен быть ответ (согласие/отказ/перенос и т.п.) — строго следуй ему. Пиши живо, по делу, без канцелярита.`;

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  if (burstLimited("inboxzero", ip)) {
    return NextResponse.json(
      { error: "Слишком много запросов. Попробуйте через минуту." },
      { status: 429 }
    );
  }
  const daily = await checkDailyLimit(ip);
  if (!daily.ok) {
    return NextResponse.json(
      { error: "Дневной лимит 30 запросов исчерпан. Попробуйте завтра." },
      { status: 429 }
    );
  }

  let body: { email?: string; instruction?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";
  const instruction = body.instruction?.trim() ?? "";
  if (email.length < 20) {
    return NextResponse.json(
      { error: "Вставьте текст письма." },
      { status: 400 }
    );
  }

  const result = await callGemini({
    system: SYSTEM_PROMPT,
    contents: [
      {
        parts: [
          {
            text: [
              `ПИСЬМО:\n${email}`,
              instruction ? `УКАЗАНИЕ ДЛЯ ОТВЕТА: ${instruction}` : null,
            ]
              .filter(Boolean)
              .join("\n\n"),
          },
        ],
      },
    ],
    schema: RESPONSE_SCHEMA,
    temperature: 0.6,
  });
  if (result instanceof NextResponse) return result;
  return NextResponse.json(result);
}
