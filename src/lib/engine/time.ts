import type { EngineLocale } from "./types";
import type { Rng } from "./random";

/**
 * Относительное время для демо-постов: «2 часа назад» / «2 hours ago».
 *
 * Свежесть коррелирует с качеством лида — горячие посты должны выглядеть
 * только что написанными, холодные могут быть недельной давности. Поэтому
 * функция принимает не абсолютную дату, а «насколько свежим» должен выглядеть
 * элемент.
 */
export type Freshness = "fresh" | "recent" | "old";

const RU = {
  minutes: (n: number) => `${n} ${plural(n, "минуту", "минуты", "минут")} назад`,
  hours: (n: number) => `${n} ${plural(n, "час", "часа", "часов")} назад`,
  yesterday: () => "вчера",
  days: (n: number) => `${n} ${plural(n, "день", "дня", "дней")} назад`,
};

const EN = {
  minutes: (n: number) => `${n} ${n === 1 ? "minute" : "minutes"} ago`,
  hours: (n: number) => `${n} ${n === 1 ? "hour" : "hours"} ago`,
  yesterday: () => "yesterday",
  days: (n: number) => `${n} ${n === 1 ? "day" : "days"} ago`,
};

/** Русские числительные: 1 минуту, 2 минуты, 5 минут. */
function plural(n: number, one: string, few: string, many: string): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return many;
  const mod10 = n % 10;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

export function relativeTime(
  r: Rng,
  locale: EngineLocale,
  freshness: Freshness = "recent"
): string {
  const t = locale === "en" ? EN : RU;

  if (freshness === "fresh") {
    return r.bool(0.6) ? t.minutes(r.int(3, 55)) : t.hours(r.int(1, 4));
  }
  if (freshness === "recent") {
    const roll = r.next();
    if (roll < 0.45) return t.hours(r.int(2, 20));
    if (roll < 0.7) return t.yesterday();
    return t.days(r.int(2, 4));
  }
  return r.bool(0.4) ? t.days(r.int(3, 6)) : t.days(r.int(7, 21));
}
