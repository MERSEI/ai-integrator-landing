import { NextRequest, NextResponse } from "next/server";
import { checkDailyLimit, checkToolLimit, clientIp } from "@/lib/rate-limit";
import { apiMessage } from "@/lib/apiMessages";
import { burstLimited, requestLocale } from "@/lib/gemini";
import { pollScan, SCAN_ID_RE, startScan, taskzConfig } from "@/lib/taskz";

/**
 * Реальный Poaching: разовый поиск лидов по нише в Threads через TaskZ.
 *
 *   POST /api/poaching {niche, geo?, locale}  → {id}       — запуск (считается в демо-лимит)
 *   GET  /api/poaching?id=<uuid>              → ScanView   — опрос, лимит только «в минуту»
 *
 * Прогон идёт минуты, поэтому асинхронно: браузер опрашивает, пока не придёт state=done.
 * Если TaskZ недоступен — честно говорим «поиск недоступен», а не «лидов нет»
 * (см. lib/taskz.ts).
 */

const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(req: NextRequest) {
  const rawBody: unknown = await req.json().catch(() => null);
  const locale = requestLocale(rawBody);
  const ip = clientIp(req.headers);

  if (burstLimited("poaching-start", ip, 5)) {
    return NextResponse.json({ error: apiMessage(locale, "tooManyRequests") }, { status: 429 });
  }

  // Сначала то, что не должно «сжигать» демо-лимит пользователя: конфиг и валидация.
  const cfg = taskzConfig();
  if (!cfg) {
    return NextResponse.json({ error: apiMessage(locale, "scanUnavailable") }, { status: 503, headers: NO_STORE });
  }
  if (rawBody === null || typeof rawBody !== "object") {
    return NextResponse.json({ error: apiMessage(locale, "badRequest") }, { status: 400 });
  }
  const body = rawBody as { niche?: unknown; geo?: unknown };
  const niche = typeof body.niche === "string" ? body.niche.trim() : "";
  const geo = typeof body.geo === "string" ? body.geo.trim() : "";
  if (niche.length < 3) {
    return NextResponse.json({ error: apiMessage(locale, "needNiche") }, { status: 400 });
  }
  if (niche.length > 300 || geo.length > 100) {
    return NextResponse.json({ error: apiMessage(locale, "badRequest") }, { status: 400 });
  }

  const daily = await checkDailyLimit(ip);
  if (!daily.ok) {
    return NextResponse.json({ error: apiMessage(locale, "dailyLimit") }, { status: 429 });
  }
  const toolLimit = await checkToolLimit(ip, "poaching");
  if (!toolLimit.ok) {
    return NextResponse.json({ error: apiMessage(locale, "toolLimit") }, { status: 429 });
  }

  const started = await startScan(cfg, { niche, ...(geo ? { geo } : {}) });
  if (!started.ok) {
    const key = started.reason === "busy" ? "scanBusy" : "scanUnavailable";
    return NextResponse.json(
      { error: apiMessage(locale, key) },
      { status: started.reason === "busy" ? 429 : 503, headers: NO_STORE }
    );
  }
  return NextResponse.json({ id: started.id }, { status: 202, headers: NO_STORE });
}

export async function GET(req: NextRequest) {
  const locale = requestLocale({ locale: req.nextUrl.searchParams.get("locale") });
  const ip = clientIp(req.headers);
  if (burstLimited("poaching-poll", ip, 40)) {
    return NextResponse.json({ error: apiMessage(locale, "tooManyRequests") }, { status: 429 });
  }

  const id = req.nextUrl.searchParams.get("id") ?? "";
  // Только UUID: id подставляется в URL сервера TaskZ.
  if (!SCAN_ID_RE.test(id)) {
    return NextResponse.json({ error: apiMessage(locale, "badRequest") }, { status: 400 });
  }
  const cfg = taskzConfig();
  if (!cfg) {
    return NextResponse.json({ error: apiMessage(locale, "scanUnavailable") }, { status: 503, headers: NO_STORE });
  }

  const polled = await pollScan(cfg, id);
  if (!polled.ok) {
    return polled.reason === "not_found"
      ? NextResponse.json({ error: apiMessage(locale, "scanExpired") }, { status: 404, headers: NO_STORE })
      : NextResponse.json({ error: apiMessage(locale, "scanUnavailable") }, { status: 503, headers: NO_STORE });
  }
  return NextResponse.json(polled.view, { headers: NO_STORE });
}
