/**
 * Клиент к TaskZ (реальный Poaching): разовый поиск лидов по нише в Threads.
 *
 * Только серверный код — токен и адрес не должны попадать в браузер. Браузер ходит
 * в /api/poaching, а тот — сюда.
 *
 * Главное правило: «мы искали и ничего нет» (no_leads) и «искать не смогли»
 * (unavailable) — разные исходы. Любой сбой (таймаут, 5xx, упавшая сессия Threads,
 * недоступный сервер) превращается в unavailable, а не в «лидов нет».
 */

export type ScanStats = {
  keywordsPlanned: number;
  keywordsSearched: number;
  keywordsFailed: number;
  postsFetched: number;
  passedStage1: number;
  classified: number;
};

export type PublicStats = Pick<ScanStats, "keywordsSearched" | "postsFetched">;

export type ScanBrief = { niche: string; geo?: string };

/** Что отдаёт TaskZ (см. src/services/scan-jobs.service.ts в репозитории TaskZ). */
export type UpstreamScan = {
  state: "queued" | "running" | "done" | "failed";
  queuePosition?: number;
  error?: "timeout" | "internal";
  result?: {
    status: "lead_found" | "no_leads" | "unavailable";
    stats: ScanStats;
    lead?: { permalink: string; username: string; text: string; score: number; reason: string; keyword: string };
  };
};

/** Что видит браузер. Лид — только публичный пост: текст, ссылка, оценка. */
export type ScanView =
  | { state: "queued"; queuePosition: number }
  | { state: "running" }
  | { state: "done"; outcome: "lead_found"; lead: { url: string; text: string; score: number; reason: string }; stats: PublicStats }
  | { state: "done"; outcome: "no_leads"; stats: PublicStats }
  | { state: "done"; outcome: "unavailable" };

export type TaskzConfig = { url: string; token: string };

export function taskzConfig(env: Record<string, string | undefined> = process.env): TaskzConfig | null {
  const url = env.TASKZ_SCAN_URL?.trim().replace(/\/+$/, "");
  const token = env.TASKZ_SCAN_TOKEN?.trim();
  return url && token ? { url, token } : null;
}

const THREADS_HOSTS = new Set(["threads.com", "www.threads.com", "threads.net", "www.threads.net"]);

/** Ссылку на пост показываем только если она реально ведёт в Threads. */
export function safeThreadsUrl(raw: string): string | null {
  try {
    const u = new URL(raw);
    return u.protocol === "https:" && THREADS_HOSTS.has(u.hostname) ? u.toString() : null;
  } catch {
    return null;
  }
}

function clip(text: string, max: number): string {
  // eslint-disable-next-line no-control-regex
  const clean = text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

/** Приводит ответ TaskZ к тому, что можно показать пользователю. */
export function toView(up: UpstreamScan): ScanView {
  if (up.state === "queued") return { state: "queued", queuePosition: Math.max(1, up.queuePosition ?? 1) };
  if (up.state === "running") return { state: "running" };
  // failed или done без результата: поиск не выполнен — это не «лидов нет».
  if (up.state === "failed" || !up.result) return { state: "done", outcome: "unavailable" };

  const { status, stats, lead } = up.result;
  const publicStats: PublicStats = { keywordsSearched: stats.keywordsSearched, postsFetched: stats.postsFetched };

  if (status === "lead_found" && lead) {
    const url = safeThreadsUrl(lead.permalink);
    if (url) {
      return {
        state: "done",
        outcome: "lead_found",
        lead: { url, text: clip(lead.text, 400), score: Math.round(lead.score), reason: clip(lead.reason, 240) },
        stats: publicStats,
      };
    }
    // Лид без проверяемой ссылки показать нельзя — и выдавать за «пусто» тоже нельзя.
    return { state: "done", outcome: "unavailable" };
  }
  if (status === "no_leads") return { state: "done", outcome: "no_leads", stats: publicStats };
  return { state: "done", outcome: "unavailable" };
}

type FetchLike = typeof fetch;
const TIMEOUT_MS = 8_000;

export type StartResult = { ok: true; id: string } | { ok: false; reason: "busy" | "unavailable" };

export async function startScan(cfg: TaskzConfig, brief: ScanBrief, fetchImpl: FetchLike = fetch): Promise<StartResult> {
  try {
    const res = await fetchImpl(`${cfg.url}/scan`, {
      method: "POST",
      headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(brief),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (res.status === 429) return { ok: false, reason: "busy" };
    if (res.status !== 202) return { ok: false, reason: "unavailable" };
    const json = (await res.json()) as { id?: unknown };
    return typeof json.id === "string" ? { ok: true, id: json.id } : { ok: false, reason: "unavailable" };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}

export type PollResult = { ok: true; view: ScanView } | { ok: false; reason: "not_found" | "unavailable" };

export async function pollScan(cfg: TaskzConfig, id: string, fetchImpl: FetchLike = fetch): Promise<PollResult> {
  try {
    const res = await fetchImpl(`${cfg.url}/scan/${id}`, {
      headers: { Authorization: `Bearer ${cfg.token}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (res.status === 404) return { ok: false, reason: "not_found" };
    if (!res.ok) return { ok: false, reason: "unavailable" };
    return { ok: true, view: toView((await res.json()) as UpstreamScan) };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}

export const SCAN_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
