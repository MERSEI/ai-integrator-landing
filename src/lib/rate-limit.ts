/**
 * Дневной rate limit (30 запросов/сутки на IP) на все API лендинга.
 *
 * Хранилище: Upstash Redis через REST (работает из serverless). Если env не задан —
 * graceful fallback на in-memory Map (неточно на нескольких инстансах, но не падает).
 */

const DAILY_LIMIT = 30;
const DAY_SECONDS = 86_400;

export function upstashCreds(): { url: string; token: string } | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL ?? "";
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN ?? "";
  if (url && token) return { url, token };
  return null;
}

// ── in-memory fallback ───────────────────────────────────────────────
const mem = new Map<string, { count: number; day: string }>();
function memCheck(
  key: string,
  day: string,
  limit: number
): { ok: boolean; remaining: number } {
  const entry = mem.get(key);
  if (!entry || entry.day !== day) {
    mem.set(key, { count: 1, day });
    return { ok: true, remaining: limit - 1 };
  }
  entry.count += 1;
  return { ok: entry.count <= limit, remaining: Math.max(0, limit - entry.count) };
}

// ── Upstash REST ─────────────────────────────────────────────────────
export async function upstash(
  creds: { url: string; token: string },
  command: (string | number)[]
): Promise<unknown> {
  const res = await fetch(creds.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${creds.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(4000),
  });
  if (!res.ok) throw new Error(`upstash ${res.status}`);
  const json = (await res.json()) as { result?: unknown };
  return json.result;
}

/**
 * Инкрементит суточный счётчик для IP. Общий бюджет на все эндпоинты лендинга.
 * Возвращает ok=false, если лимит на сегодня исчерпан.
 */
export async function checkDailyLimit(
  ip: string
): Promise<{ ok: boolean; remaining: number; limit: number }> {
  const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
  const key = `rl:landing:${ip}:${day}`;

  const creds = upstashCreds();
  if (!creds) {
    return { ...memCheck(key, day, DAILY_LIMIT), limit: DAILY_LIMIT };
  }

  try {
    const count = Number(await upstash(creds, ["INCR", key]));
    if (count === 1) {
      // первый запрос за сутки — ставим TTL, чтобы ключ сам истёк
      await upstash(creds, ["EXPIRE", key, DAY_SECONDS]).catch(() => {});
    }
    return {
      ok: count <= DAILY_LIMIT,
      remaining: Math.max(0, DAILY_LIMIT - count),
      limit: DAILY_LIMIT,
    };
  } catch (e) {
    // Redis недоступен — не блокируем пользователя, падаем в fallback
    console.error("rate-limit upstash error, using memory fallback:", e);
    return { ...memCheck(key, day, DAILY_LIMIT), limit: DAILY_LIMIT };
  }
}

const TOOL_DEMO_LIMIT = 2;

/**
 * Лимит демо-запросов на конкретный инструмент: 2 запроса/сутки на IP,
 * отдельно от общего дневного бюджета по всем эндпоинтам. Демо бесплатное
 * (см. Pricing), но не безлимитное — дальше клиент подключает инструмент.
 */
export async function checkToolLimit(
  ip: string,
  tool: string
): Promise<{ ok: boolean; remaining: number; limit: number }> {
  const day = new Date().toISOString().slice(0, 10);
  const key = `rl:tool:${tool}:${ip}:${day}`;

  const creds = upstashCreds();
  if (!creds) {
    return { ...memCheck(key, day, TOOL_DEMO_LIMIT), limit: TOOL_DEMO_LIMIT };
  }

  try {
    const count = Number(await upstash(creds, ["INCR", key]));
    if (count === 1) {
      await upstash(creds, ["EXPIRE", key, DAY_SECONDS]).catch(() => {});
    }
    const ok = count <= TOOL_DEMO_LIMIT;
    // Единственная точка, через которую проходят все десять демо-роутов, —
    // отсюда же пишем ленту активности. Только имя инструмента и время.
    if (ok) {
      const { recordToolRun } = await import("./activity");
      await recordToolRun(tool).catch(() => {});
    }
    return {
      ok,
      remaining: Math.max(0, TOOL_DEMO_LIMIT - count),
      limit: TOOL_DEMO_LIMIT,
    };
  } catch (e) {
    console.error("tool-limit upstash error, using memory fallback:", e);
    return { ...memCheck(key, day, TOOL_DEMO_LIMIT), limit: TOOL_DEMO_LIMIT };
  }
}

export function clientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
