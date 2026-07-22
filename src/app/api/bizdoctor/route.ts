import { NextRequest, NextResponse } from "next/server";
import { checkDailyLimit, clientIp } from "@/lib/rate-limit";
import { callGemini, burstLimited } from "@/lib/gemini";

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    status: { type: "string" },
    message: { type: "string" },
    questions: { type: "array", items: { type: "string" } },
    diagnosis: { type: "string" },
    leaks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          area: { type: "string" },
          problem: { type: "string" },
          impact: { type: "string" },
          severity: { type: "string" },
        },
        required: ["area", "problem", "impact", "severity"],
      },
    },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          action: { type: "string" },
          effect: { type: "string" },
          effort: { type: "string" },
        },
        required: ["action", "effect", "effort"],
      },
    },
    quick_win: { type: "string" },
  },
  required: ["status", "message", "questions", "diagnosis", "leaks", "recommendations", "quick_win"],
};

const SYSTEM_PROMPT = `Ты — BizDoctor, опытный бизнес-аналитик. Владелец бизнеса рассказывает о своём деле, ты диагностируешь, где теряются деньги, и даёшь рекомендации.

Работаешь в два этапа:

1. СБОР ДАННЫХ (status: "clarifying"). Если данных мало для диагностики — задай 2–4 конкретных вопроса о ключевых метриках. Что важно понять: ниша и модель, месячная выручка и маржа, источники клиентов и их стоимость (CAC), конверсия воронки по этапам, средний чек, повторные покупки/отток, штат и главные затраты. Спрашивай ТОЛЬКО то, чего не хватает, приоритизируй важное. message — короткая живая реакция, questions — вопросы. Не более 2 раундов уточнений суммарно.

2. ДИАГНОЗ (status: "ready"). Когда данных достаточно (или после 2 раундов):
- diagnosis: 2–3 предложения — общая картина здоровья бизнеса, главный вывод.
- leaks: 2–4 места, где теряются деньги. area — зона (воронка/маркетинг/цены/операционка/удержание), problem — что не так, impact — оценка потерь (в деньгах или %, из данных клиента), severity — "high" | "medium" | "low".
- recommendations: 3–4 действия. action — что сделать конкретно, effect — ожидаемый эффект в цифрах, effort — "лёгкое" | "среднее" | "сложное".
- quick_win: 1 действие, которое можно сделать за неделю с заметным эффектом.
- message: короткая подводка.

Правила: считай на основе данных клиента, показывай расчёты в impact/effect. Не выдумывай данные, которых нет — вместо этого делай консервативные оценки с пометкой. Пиши по-русски, конкретно, без канцелярита. Заполняй все поля (неприменимые — "" или []).`;

type WireMsg = { role: "user" | "model"; content: string };

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  if (burstLimited("bizdoctor", ip, 15)) {
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

  let body: { messages?: WireMsg[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser || firstUser.content.trim().length < 10) {
    return NextResponse.json(
      { error: "Расскажите о вашем бизнесе." },
      { status: 400 }
    );
  }
  if (messages.length > 24) {
    return NextResponse.json(
      { error: "Диалог слишком длинный. Начните заново." },
      { status: 400 }
    );
  }

  const contents = messages.map((m) => ({
    role: m.role === "model" ? "model" : "user",
    parts: [{ text: String(m.content ?? "") }],
  }));

  const result = await callGemini({
    system: SYSTEM_PROMPT,
    contents,
    schema: RESPONSE_SCHEMA,
    temperature: 0.6,
  });
  if (result instanceof NextResponse) return result;

  const r = result as Record<string, unknown>;
  r.status = r.status === "ready" ? "ready" : "clarifying";
  r.questions = Array.isArray(r.questions) ? r.questions : [];
  r.leaks = Array.isArray(r.leaks) ? r.leaks : [];
  r.recommendations = Array.isArray(r.recommendations) ? r.recommendations : [];
  return NextResponse.json(r);
}
