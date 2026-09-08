import type { EngineLocale } from "../types";

/** Только для тестов движка; в бандл приложения не попадает. */

export const LOCALES: EngineLocale[] = ["ru", "en"];
export const CYRILLIC = /[А-Яа-яЁё]/;

/** Все строковые листья результата — для проверок языка и пустых слотов. */
export function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object") {
    Object.values(value).forEach((v) => strings(v, out));
  }
  return out;
}

/** Ввод, на котором генераторы чаще всего ломаются. */
export const NASTY_INPUTS = [
  "",
  "  ",
  "@",
  "!!!",
  "🙂🙂🙂",
  "a".repeat(5000),
  "<script>alert(1)</script>",
  "1",
];
