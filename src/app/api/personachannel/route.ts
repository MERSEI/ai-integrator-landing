import { NextRequest, NextResponse } from "next/server";
import { checkDailyLimit, clientIp } from "@/lib/rate-limit";
import { callGemini, burstLimited } from "@/lib/gemini";

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    persona_summary: { type: "string" },
    tone: { type: "string" },
    posts: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string" },
          hook: { type: "string" },
          text: { type: "string" },
          cta: { type: "string" },
        },
        required: ["type", "hook", "text", "cta"],
      },
    },
    content_tips: { type: "array", items: { type: "string" } },
  },
  required: ["persona_summary", "tone", "posts", "content_tips"],
};

const SYSTEM_PROMPT = `Ты — PersonaChannel, эксперт по контенту для Telegram-каналов. По описанию канала и целевой персоны создаёшь контент, который удерживает именно эту аудиторию.

Верни:
- persona_summary: 1–2 предложения — портрет персоны: кто это, что болит, зачем читает канал.
- tone: 1 предложение — каким тоном говорить с этой персоной.
- posts: 5 готовых постов для Telegram под эту персону. Для каждого: type — тип поста (польза / история / кейс / провокация / вовлечение — разнообразь!), hook — цепляющая первая строка, text — полный текст поста (100–250 слов, с абзацами, можно эмодзи умеренно), cta — призыв в конце (вопрос/реакция/действие).
- content_tips: 3 совета, как вести канал для этой персоны (частота, форматы, ошибки).

Пиши на русском, живо, без канцелярита, как сильные авторские Telegram-каналы. Посты должны попадать в боли и интересы персоны, а не быть генеричными.`;

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  if (burstLimited("personachannel", ip)) {
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

  let body: { channel?: string; persona?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const channel = body.channel?.trim() ?? "";
  const persona = body.persona?.trim() ?? "";
  if (channel.length < 5) {
    return NextResponse.json(
      { error: "Опишите ваш канал (тема, о чём пишете)." },
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
              `КАНАЛ: ${channel}`,
              persona
                ? `ЦЕЛЕВАЯ ПЕРСОНА: ${persona}`
                : "Персона не описана — выведи её сам из темы канала и опиши.",
            ].join("\n"),
          },
        ],
      },
    ],
    schema: RESPONSE_SCHEMA,
    temperature: 0.95,
  });
  if (result instanceof NextResponse) return result;
  return NextResponse.json(result);
}
