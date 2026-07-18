import { NextRequest, NextResponse } from "next/server";

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
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Слишком много запросов. Попробуйте через минуту." },
      { status: 429 }
    );
  }

  let body: { email?: string; name?: string; company?: string; website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  // Honeypot: боты заполняют скрытое поле "website".
  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Введите корректный email" },
      { status: 400 }
    );
  }

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
  } else {
    console.log("[subscribe] new lead:", { email, name: body.name, company: body.company });
  }

  return NextResponse.json({ ok: true });
}
