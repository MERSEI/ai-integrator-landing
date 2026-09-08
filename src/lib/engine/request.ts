/**
 * Общее для всех API-роутов: локаль запроса и защита от всплесков.
 *
 * Раньше жило в lib/gemini.ts вместе с клиентом модели. Модели больше нет,
 * а эти две функции нужны и роутам без генерации (subscribe, book-call).
 */

/** Локаль из тела запроса; всё, кроме "en", считаем русским. */
export function requestLocale(body: unknown): string {
  const raw = (body as { locale?: unknown } | null)?.locale;
  return raw === "en" ? "en" : "ru";
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
