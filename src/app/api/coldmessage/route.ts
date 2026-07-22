import { NextRequest, NextResponse } from "next/server";

const GEMINI_MODEL = "gemini-3.6-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// in-memory rate limit: 10 генераций/мин на IP
const hits = new Map<string, { count: number; ts: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.ts > 60_000) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  entry.count += 1;
  return entry.count > 10;
}

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

  let body: {
    profileText?: string;
    offerTemplate?: string;
    channel?: string;
    tone?: string;
    sourceLink?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const profileText = body.profileText?.trim() ?? "";
  const offerTemplate = body.offerTemplate?.trim() ?? "";
  const channel = body.channel?.trim() || "Email";
  const tone = body.tone?.trim() || "Деловой (на вы)";
  const sourceLink = body.sourceLink?.trim();

  if (profileText.length < 20) {
    return NextResponse.json(
      { error: "Вставьте больше текста профиля (минимум пара предложений)." },
      { status: 400 }
    );
  }
  if (offerTemplate.length < 10) {
    return NextResponse.json(
      { error: "Добавьте шаблон вашего предложения." },
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

  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "x-goog-api-key": key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ parts: [{ text: userText }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
          temperature: 0.9,
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
        { error: "Модель вернула пустой ответ. Уточните текст профиля." },
        { status: 502 }
      );
    }

    const result = JSON.parse(text);
    return NextResponse.json(result);
  } catch (e) {
    console.error("coldmessage generation failed:", e);
    return NextResponse.json(
      { error: "Ошибка генерации. Попробуйте ещё раз." },
      { status: 500 }
    );
  }
}
