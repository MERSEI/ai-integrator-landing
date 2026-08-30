import { NextRequest, NextResponse } from "next/server";
import { checkDailyLimit, clientIp } from "@/lib/rate-limit";
import { saveLead } from "@/lib/leads";
import { sendAuditRequestEmail } from "@/lib/email";
import { apiMessage } from "@/lib/apiMessages";
import { requestLocale } from "@/lib/gemini";
import {
  needsContactValue,
  normalizeChannel,
  normalizeContact,
} from "@/lib/contactChannel";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Простой in-memory rate limit: 5 запросов в минуту с одного IP.
const hits = new Map<string, { count: number; ts: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.ts > 60_000) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  entry.count += 1;
  return entry.count > 5;
}

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

  if (rawBody === null) {
    return NextResponse.json({ error: apiMessage(locale, "badRequest") }, { status: 400 });
  }
  const body = rawBody as {
    email?: string;
    name?: string;
    company?: string;
    website?: string;
    source?: string;
    channel?: string;
    contact?: string;
    interest?: string;
  };

  // Honeypot: боты заполняют скрытое поле "website".
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: apiMessage(locale, "invalidEmail") },
      { status: 400 }
    );
  }

  // Канал связи приходит с клиента, поэтому нормализуем: неизвестное значение
  // становится "email", контакт приводится к канону (@ник, +номер).
  const channel = normalizeChannel(body.channel);
  const contact = needsContactValue(channel)
    ? normalizeContact(channel, body.contact)
    : "";

  // Всегда сохраняем лид в постоянное хранилище (Upstash), чтобы он не терялся,
  // даже если Mailchimp не настроен или временно недоступен.
  await saveLead({
    email,
    name: body.name,
    company: body.company,
    source: body.source,
    channel,
    contact,
    interest: typeof body.interest === "string" ? body.interest.slice(0, 40) : "",
  });

  // Пустой контакт при неemail-канале форму не роняет: лид ценнее валидации,
  // email для ответа у нас всё равно есть.
  await sendAuditRequestEmail(email, { channel, contact });

  const { MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID, MAILCHIMP_SERVER_PREFIX } =
    process.env;

  if (MAILCHIMP_API_KEY && MAILCHIMP_LIST_ID) {
    try {
      const res = await fetch(
        `https://${MAILCHIMP_SERVER_PREFIX ?? "us1"}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${MAILCHIMP_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email_address: email,
            status: "pending",
            merge_fields: {
              FNAME: body.name ?? "",
              COMPANY: body.company ?? "",
            },
          }),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        // "Member Exists" — не ошибка для пользователя.
        if (err?.title !== "Member Exists") {
          console.error("Mailchimp error:", err);
        }
      }
    } catch (e) {
      console.error("Mailchimp request failed:", e);
    }
  }

  return NextResponse.json({ ok: true });
}
