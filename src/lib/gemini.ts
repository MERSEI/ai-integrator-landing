import { NextResponse } from "next/server";

const GEMINI_MODEL = "gemini-3.6-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

type GeminiContent = { role?: string; parts: { text: string }[] };

/**
 * Вызов Gemini со structured output. Возвращает распарсенный JSON
 * или NextResponse с ошибкой (проверяйте через instanceof NextResponse).
 */
export async function callGemini(options: {
  system: string;
  contents: GeminiContent[];
  schema: object;
  temperature?: number;
}): Promise<unknown | NextResponse> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Сервис временно недоступен: не настроен ключ модели." },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: options.system }] },
        contents: options.contents,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: options.schema,
          temperature: options.temperature ?? 0.8,
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
      console.error(
        "Gemini empty response, finishReason:",
        data?.candidates?.[0]?.finishReason ?? "unknown"
      );
      return NextResponse.json(
        { error: "Модель вернула пустой ответ. Попробуйте ещё раз." },
        { status: 502 }
      );
    }
    return JSON.parse(text);
  } catch (e) {
    console.error("Gemini call failed:", e);
    return NextResponse.json(
      { error: "Ошибка генерации. Попробуйте ещё раз." },
      { status: 500 }
    );
  }
}

// per-minute burst guard, общий для роутов
const buckets = new Map<string, Map<string, { count: number; ts: number }>>();
export function burstLimited(scope: string, ip: string, perMinute = 10): boolean {
  let map = buckets.get(scope);
  if (!map) {
    map = new Map();
    buckets.set(scope, map);
  }
  const now = Date.now();
  const entry = map.get(ip);
  if (!entry || now - entry.ts > 60_000) {
    map.set(ip, { count: 1, ts: now });
    return false;
  }
  entry.count += 1;
  return entry.count > perMinute;
}
