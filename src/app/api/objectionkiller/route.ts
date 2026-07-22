import { NextRequest, NextResponse } from "next/server";

const GEMINI_MODEL = "gemini-3.6-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// in-memory rate limit: 20 запросов/мин на IP (диалог = несколько шагов)
const hits = new Map<string, { count: number; ts: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.ts > 60_000) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  entry.count += 1;
  return entry.count > 20;
}

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
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Слишком много запросов. Попробуйте через минуту." },
      { status: 429 }
    );
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Сервис временно недоступен: не настроен ключ модели." },
      { status: 500 }
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
  if (!firstUser || firstUser.content.trim().length < 5) {
    return NextResponse.json(
      { error: "Опишите ситуацию и возражение клиента." },
      { status: 400 }
    );
  }
  // защита от переполнения контекста
  if (messages.length > 24) {
    return NextResponse.json(
      { error: "Диалог слишком длинный. Начните новую ситуацию." },
      { status: 400 }
    );
  }

  const contents = messages.map((m) => ({
    role: m.role === "model" ? "model" : "user",
    parts: [{ text: String(m.content ?? "") }],
  }));

  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "x-goog-api-key": key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
          temperature: 0.7,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("Gemini error:", res.status, errText.slice(0, 500));
      return NextResponse.json(
        { error: "Модель не ответила. Попробуйте ещё раз." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const text: string | undefined =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      const reason = data?.candidates?.[0]?.finishReason ?? "unknown";
      console.error("Gemini empty response, finishReason:", reason);
      return NextResponse.json(
        { error: "Модель вернула пустой ответ. Уточните описание." },
        { status: 502 }
      );
    }

    const result = JSON.parse(text);
    // нормализация на случай пропущенных полей
    result.status = result.status === "ready" ? "ready" : "clarifying";
    result.questions = Array.isArray(result.questions) ? result.questions : [];
    result.tactics = Array.isArray(result.tactics) ? result.tactics : [];
    return NextResponse.json(result);
  } catch (e) {
    console.error("objectionkiller generation failed:", e);
    return NextResponse.json(
      { error: "Ошибка генерации. Попробуйте ещё раз." },
      { status: 500 }
    );
  }
}
