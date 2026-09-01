import { NextRequest, NextResponse } from "next/server";
import { checkDailyLimit, clientIp } from "@/lib/rate-limit";
import { saveLead } from "@/lib/leads";
import { sendBookingEmails } from "@/lib/email";
import { apiMessage } from "@/lib/apiMessages";
import { requestLocale } from "@/lib/gemini";
import { isBookableSlotIso, isContactChannel, normalizeContact } from "@/lib/booking";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Столько символов комментария хватает на суть; остальное — место для мусора. */
const NOTE_MAX = 1000;

// Тот же burst-guard, что и в /api/subscribe: 5 попыток в минуту. Ниже опускать
// нельзя — форма отбивает и неверный контакт, и занятый слот, так что пара
// честных ошибок подряд не должна выглядеть как блокировка.
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
    slot?: string;
    timezone?: string;
    channel?: string;
    contact?: string;
    interest?: string;
    note?: string;
    source?: string;
    website?: string;
  };

  // Honeypot, как в /api/subscribe: боту отвечаем «ок» и молча выбрасываем.
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

  // Слот проверяем на сервере отдельно: клиент показывает только валидные
  // кнопки, но запрос может прийти и мимо интерфейса.
  if (!isBookableSlotIso(body.slot, new Date())) {
    return NextResponse.json({ error: apiMessage(locale, "invalidSlot") }, { status: 400 });
  }
  const slot = body.slot as string;

  if (!isContactChannel(body.channel)) {
    return NextResponse.json({ error: apiMessage(locale, "badRequest") }, { status: 400 });
  }
  const contact = normalizeContact(body.channel, body.contact, email);
  if (!contact) {
    return NextResponse.json(
      { error: apiMessage(locale, "invalidContact") },
      { status: 400 }
    );
  }

  // Пояс приходит из браузера (Intl) — доверяем строке, но не пускаем в письмо
  // что-то заведомо чужеродное: форматирование с битым поясом бросает исключение.
  const timezone =
    typeof body.timezone === "string" && /^[A-Za-z0-9+_\-/]{3,64}$/.test(body.timezone)
      ? body.timezone
      : "UTC";

  const note = body.note?.trim().slice(0, NOTE_MAX) || undefined;

  await saveLead({
    email,
    source: body.source ?? "booking",
    slot,
    timezone,
    channel: body.channel,
    contact,
    interest: body.interest || undefined,
    note,
  });

  await sendBookingEmails({
    email,
    slot,
    timezone,
    channel: body.channel,
    contact,
    interest: body.interest || undefined,
    note,
    locale,
  });

  return NextResponse.json({ ok: true, slot });
}
