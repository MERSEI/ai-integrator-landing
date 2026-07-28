import { NextRequest, NextResponse } from "next/server";
import { checkDailyLimit, checkToolLimit, clientIp } from "@/lib/rate-limit";
import { apiMessage } from "@/lib/apiMessages";
import { outputLanguage, requestLocale } from "@/lib/gemini";

const GEMINI_MODEL = "gemini-3.6-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// burst-защита: 10 запросов/мин на IP
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
    leads: {
      type: "array",
      items: {
        type: "object",
        properties: {
          handle: { type: "string" },
          text: { type: "string" },
          posted: { type: "string" },
          score: { type: "number" },
          tier: { type: "string" },
          reason: { type: "string" },
          reply: { type: "string" },
        },
        required: ["handle", "text", "posted", "score", "tier", "reason", "reply"],
      },
    },
  },
  required: ["leads"],
};

const SYSTEM_PROMPT = `Ты — демо-движок LeadRadar: показываешь, как AI находит и квалифицирует лидов в соцсети Threads по ключевому слову.

По ключевому слову/нише и описанию продукта сгенерируй 7 РЕАЛИСТИЧНЫХ примеров постов Threads — так, как их писали бы живые люди. Это ДЕМО-данные (вымышленные), а не реальные посты.

Разнообразь качество лидов:
- 2–3 ГОРЯЧИХ (tier "hot", score 78–96): человек прямо сейчас ищет решение, жалуется на проблему, спрашивает рекомендацию, готов купить.
- 2–3 ТЁПЛЫХ (tier "warm", score 45–72): обсуждает тему, интересуется, но не готов прямо сейчас.
- 1–2 ХОЛОДНЫХ/не лида (tier "cold", score 8–35): эксперт/конкурент/оффтоп/просто мнение — покупать не будет.

Для каждого поста:
- handle: правдоподобный вымышленный юзернейм в формате @name (латиница/цифры).
- text: живой пост на русском, 1–3 предложения, как реальный человек (без хэштег-спама).
- posted: относительное время ("15 минут назад", "2 часа назад", "вчера").
- score: 0–100, насколько это горячий лид под нишу продавца.
- tier: "hot" | "warm" | "cold".
- reason: 1 предложение — почему это (не) лид.
- reply: короткий персональный заход в личку/комментарий (для hot и warm), для cold — пустая строка "".

Пиши живо, без канцелярита. Заполняй все поля JSON.`;

export async function POST(req: NextRequest) {
  // Тело читаем сразу: локаль нужна уже для сообщений о лимитах.
  const rawBody: unknown = await req.json().catch(() => null);
  const locale = requestLocale(rawBody);
  const ip = clientIp(req.headers);
  if (rateLimited(ip)) {
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

  const toolLimit = await checkToolLimit(ip, "leadradar");
  if (!toolLimit.ok) {
    return NextResponse.json(
      { error: apiMessage(locale, "toolLimit") },
      { status: 429 }
    );
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: apiMessage(locale, "noModelKey") },
      { status: 500 }
    );
  }

  if (rawBody === null) {
    return NextResponse.json({ error: apiMessage(locale, "badRequest") }, { status: 400 });
  }
  const body = rawBody as { keyword?: string; product?: string };

  const keyword = body.keyword?.trim() ?? "";
  const product = body.product?.trim() ?? "";
  if (keyword.length < 2) {
    return NextResponse.json(
      { error: apiMessage(locale, "needKeywordNiche") },
      { status: 400 }
    );
  }

  const userText = [
    `КЛЮЧЕВОЕ СЛОВО / НИША: ${keyword}`,
    product ? `ЧТО ПРОДАЁТ ПОЛЬЗОВАТЕЛЬ: ${product}` : "Продукт не указан — оцени лидов по релевантности теме.",
  ].join("\n");

  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT + outputLanguage(locale) }],
        },
        contents: [{ parts: [{ text: userText }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
          temperature: 1.0,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("Gemini error:", res.status, errText.slice(0, 500));
      return NextResponse.json(
        { error: apiMessage(locale, "modelSilent") },
        { status: 502 }
      );
    }

    const data = await res.json();
    const text: string | undefined =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return NextResponse.json(
        { error: apiMessage(locale, "modelEmpty") },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(text) as { leads?: unknown };
    const leads = Array.isArray(parsed.leads) ? parsed.leads : [];
    // сортировка по score убыв.
    leads.sort(
      (a: { score?: number }, b: { score?: number }) =>
        (b.score ?? 0) - (a.score ?? 0)
    );
    return NextResponse.json({ keyword, leads });
  } catch (e) {
    console.error("leadradar generation failed:", e);
    return NextResponse.json(
      { error: apiMessage(locale, "generationFailed") },
      { status: 500 }
    );
  }
}
