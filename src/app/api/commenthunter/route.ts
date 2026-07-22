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
    posts: {
      type: "array",
      items: {
        type: "object",
        properties: {
          author: { type: "string" },
          text: { type: "string" },
          posted: { type: "string" },
          likes: { type: "number" },
          comments: {
            type: "array",
            items: {
              type: "object",
              properties: {
                handle: { type: "string" },
                text: { type: "string" },
                tier: { type: "string" },
                score: { type: "number" },
                reason: { type: "string" },
                reply: { type: "string" },
              },
              required: ["handle", "text", "tier", "score", "reason", "reply"],
            },
          },
        },
        required: ["author", "text", "posted", "likes", "comments"],
      },
    },
  },
  required: ["posts"],
};

const SYSTEM_PROMPT = `Ты — демо-движок Comment Hunter: показываешь, как AI находит лидов не в постах, а в КОММЕНТАРИЯХ под популярными постами в соцсети.

По ключевому слову/нише и описанию продукта сгенерируй 3 популярных ДЕМО-поста по теме (вымышленных, реалистичных), и под каждым — 4–5 комментариев от разных людей. Это ДЕМО-данные, а не реальные посты и люди.

Комментарии должны быть разного качества как лиды:
- часть ГОРЯЧИЕ (tier "hot", score 76–95): в комменте человек выражает потребность, спрашивает совет, жалуется на проблему, ищет исполнителя.
- часть ТЁПЛЫЕ (tier "warm", score 42–70): интересуется, обсуждает, сомневается.
- часть ХОЛОДНЫЕ / не лиды (tier "cold", score 6–34): хвалят автора, оффтоп, эксперты, шутки.

Для поста:
- author: вымышленный @username автора.
- text: текст поста (1–2 предложения), как реальный тематический пост.
- posted: относительное время ("3 часа назад", "вчера").
- likes: число лайков (реалистичное, 20–5000).

Для каждого комментария:
- handle: вымышленный @username.
- text: живой комментарий на русском.
- tier: "hot" | "warm" | "cold".
- score: 0–100 — насколько это лид под нишу продавца.
- reason: 1 предложение — почему это (не) лид.
- reply: короткий персональный ответ на комментарий (для hot и warm); для cold — пустая строка "".

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

  let body: { keyword?: string; product?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const keyword = body.keyword?.trim() ?? "";
  const product = body.product?.trim() ?? "";
  if (keyword.length < 2) {
    return NextResponse.json(
      { error: "Введите ключевое слово или тему." },
      { status: 400 }
    );
  }

  const userText = [
    `КЛЮЧЕВОЕ СЛОВО / НИША: ${keyword}`,
    product
      ? `ЧТО ПРОДАЁТ ПОЛЬЗОВАТЕЛЬ: ${product}`
      : "Продукт не указан — оцени лидов по релевантности теме.",
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

    const parsed = JSON.parse(text) as {
      posts?: { comments?: { score?: number }[] }[];
    };
    const posts = Array.isArray(parsed.posts) ? parsed.posts : [];
    // сортируем комментарии внутри каждого поста по score убыв.
    for (const p of posts) {
      if (Array.isArray(p.comments)) {
        p.comments.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
      }
    }
    return NextResponse.json({ keyword, posts });
  } catch (e) {
    console.error("commenthunter generation failed:", e);
    return NextResponse.json(
      { error: "Ошибка генерации. Попробуйте ещё раз." },
      { status: 500 }
    );
  }
}
