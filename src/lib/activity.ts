/**
 * Лента реальных запусков демо-инструментов.
 *
 * Показываем на лендинге только то, что действительно произошло: имя
 * инструмента и время запуска. Ни IP, ни пользовательский ввод сюда не
 * попадают — по записи нельзя узнать, кто это был и что он спрашивал.
 *
 * Запись идёт из checkToolLimit (единственная точка, через которую проходят
 * все десять демо-роутов), чтение — из GET /api/activity.
 */

import { upstash, upstashCreds } from "./rate-limit";

export const ACTIVITY_KEY = "activity:runs";

/** Сколько последних запусков держим — лента показывает максимум пять. */
const ACTIVITY_KEEP = 20;

export type ToolRun = { tool: string; ts: string };

/** Best-effort: ошибки только логируются, демо-инструмент из-за них не падает. */
export async function recordToolRun(tool: string): Promise<void> {
  const creds = upstashCreds();
  if (!creds) return;

  try {
    const record: ToolRun = { tool, ts: new Date().toISOString() };
    await upstash(creds, ["LPUSH", ACTIVITY_KEY, JSON.stringify(record)]);
    await upstash(creds, ["LTRIM", ACTIVITY_KEY, "0", String(ACTIVITY_KEEP - 1)]);
  } catch (e) {
    console.error("[activity] не удалось записать запуск инструмента:", e);
  }
}

export async function readRecentRuns(limit: number): Promise<ToolRun[]> {
  const creds = upstashCreds();
  if (!creds) return [];

  try {
    const raw = await upstash(creds, ["LRANGE", ACTIVITY_KEY, "0", String(limit - 1)]);
    if (!Array.isArray(raw)) return [];
    return raw.flatMap((item) => {
      try {
        const parsed = JSON.parse(String(item)) as ToolRun;
        return parsed?.tool && parsed?.ts ? [parsed] : [];
      } catch {
        return [];
      }
    });
  } catch (e) {
    console.error("[activity] не удалось прочитать ленту:", e);
    return [];
  }
}
