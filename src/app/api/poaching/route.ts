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
    prospects: {
      type: "array",
      items: {
        type: "object",
        properties: {
          handle: { type: "string" },
          competitor: { type: "string" },
          question: { type: "string" },
          score: { type: "number" },
          tier: { type: "string" },
          reason: { type: "string" },
          dm: { type: "string" },
        },
        required: ["handle", "competitor", "question", "score", "tier", "reason", "dm"],
      },
    },
  },
  required: ["prospects"],
};

const SYSTEM_PROMPT = `Ты — демо-движок Poaching: показываешь, как AI переманивает клиентов у конкурентов, находя людей, которые оставили комментарии с интересом под постами конкурентов.

По нише пользователя (и, если указано, конкретным конкурентам) сгенерируй 7 РЕАЛИСТИЧНЫХ примеров потенциальных клиентов, которые прокомментировали посты конкурентов, проявив интерес. Это ДЕМО-данные (вымышленные), не реальные люди.

Разнообразь по «теплоте»:
- 2–3 ГОРЯЧИХ (tier "hot", score 78–95): человек прямо спрашивал цену/условия, жаловался на конкурента, искал альтернативу.
- 2–3 ТЁПЛЫХ (tier "warm", score 45–72): интересовался, задавал общие вопросы, сомневался.
- 1–2 ХОЛОДНЫХ (tier "cold", score 8–34): просто хвалил, оффтоп, действующий лояльный клиент конкурента.

Для каждого:
- handle: вымышленный @username.
- competitor: вымышленный правдоподобный @аккаунт конкурента в этой нише, под чьим постом человек комментировал.
- question: что именно человек написал в комментарии (подтверждённый интерес), 1–2 предложения, живая речь.
- score: 0–100 — насколько это перспективный лид для переманивания.
- tier: "hot" | "warm" | "cold".
- reason: 1 предложение — почему это (не) лид.
- dm: короткий тактичный заход в личку (для hot и warm), без агрессивного переманивания; для cold — пустая строка "".

Пиши живо, без канцелярита. Заполняй все поля JSON.`;

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

  let body: { niche?: string; competitors?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const niche = body.niche?.trim() ?? "";
  const competitors = body.competitors?.trim() ?? "";
  if (niche.length < 2) {
    return NextResponse.json(
      { error: "Укажите вашу нишу." },
      { status: 400 }
    );
  }

  const userText = [
    `НИША: ${niche}`,
    competitors
      ? `КОНКУРЕНТЫ: ${competitors}`
      : "Конкуренты не указаны — придумай правдоподобных для этой ниши.",
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
          temperature: 1.0,
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

    const parsed = JSON.parse(text) as { prospects?: { score?: number }[] };
    const prospects = Array.isArray(parsed.prospects) ? parsed.prospects : [];
    prospects.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    return NextResponse.json({ niche, prospects });
  } catch (e) {
    console.error("poaching generation failed:", e);
    return NextResponse.json(
      { error: "Ошибка генерации. Попробуйте ещё раз." },
      { status: 500 }
    );
  }
}
