import { NextRequest, NextResponse } from "next/server";
import { checkDailyLimit, clientIp } from "@/lib/rate-limit";

const GEMINI_MODEL = "gemini-3.6-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

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
    interest_level: { type: "number" },
    direction: { type: "string" },
    summary: { type: "string" },
    top_regions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          region: { type: "string" },
          score: { type: "number" },
        },
        required: ["region", "score"],
      },
    },
    related_queries: {
      type: "array",
      items: {
        type: "object",
        properties: {
          query: { type: "string" },
          kind: { type: "string" },
        },
        required: ["query", "kind"],
      },
    },
    seasonality: { type: "string" },
    insight: { type: "string" },
  },
  required: [
    "interest_level",
    "direction",
    "summary",
    "top_regions",
    "related_queries",
    "seasonality",
    "insight",
  ],
};

const SYSTEM_PROMPT = `Ты — демо-движок Trend Sniper: показываешь аналитику поискового интереса к теме по регионам, в стиле Google Trends.

По ключевому слову (и, если указан, региону/стране фокуса) дай правдоподобную ДЕМО-аналитику на основе своих знаний о теме. Это ОЦЕНОЧНЫЕ демо-данные, а не реальные метрики Google Trends в реальном времени.

Верни:
- interest_level: 0–100 — условный текущий уровень интереса к теме.
- direction: "rising" | "falling" | "stable" — куда движется тренд.
- summary: 1–2 предложения — что происходит с интересом к теме и почему.
- top_regions: 5–7 регионов/стран, где тема наиболее популярна, с относительным score 0–100 (первый = 100). Учитывай указанный регион фокуса, если он задан.
- related_queries: 6–8 связанных запросов. kind "top" — стабильно популярные, kind "rising" — набирающие популярность.
- seasonality: 1 предложение о сезонности спроса (когда пики).
- insight: 1–2 предложения — practical маркетинговый вывод: как и когда использовать этот тренд.

Пиши по-русски, конкретно и по делу. Заполняй все поля JSON.`;

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  if (rateLimited(ip)) {
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

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Сервис временно недоступен: не настроен ключ модели." },
      { status: 500 }
    );
  }

  let body: { keyword?: string; region?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const keyword = body.keyword?.trim() ?? "";
  const region = body.region?.trim() ?? "";
  if (keyword.length < 2) {
    return NextResponse.json(
      { error: "Введите ключевое слово или тему." },
      { status: 400 }
    );
  }

  const userText = [
    `КЛЮЧЕВОЕ СЛОВО / ТЕМА: ${keyword}`,
    region ? `РЕГИОН ФОКУСА: ${region}` : "Регион не указан — дай глобальную картину.",
  ].join("\n");

  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ parts: [{ text: userText }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
          temperature: 0.6,
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
      return NextResponse.json(
        { error: "Модель вернула пустой ответ. Попробуйте ещё раз." },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(text);
    parsed.keyword = keyword;
    if (!["rising", "falling", "stable"].includes(parsed.direction)) {
      parsed.direction = "stable";
    }
    if (Array.isArray(parsed.top_regions)) {
      parsed.top_regions.sort(
        (a: { score?: number }, b: { score?: number }) =>
          (b.score ?? 0) - (a.score ?? 0)
      );
    }
    return NextResponse.json(parsed);
  } catch (e) {
    console.error("trendsniper generation failed:", e);
    return NextResponse.json(
      { error: "Ошибка генерации. Попробуйте ещё раз." },
      { status: 500 }
    );
  }
}
