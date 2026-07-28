/**
 * Локализация сайта.
 *
 * Русская версия живёт в корне (`/`, `/apps/poaching`), английская — под
 * префиксом `/en`. Отдельные URL, а не переключение на месте: так у английской
 * версии есть собственные страницы для индексации и на неё можно дать прямую
 * ссылку.
 */

export const LOCALES = ["ru", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/** Русский — язык по умолчанию, поэтому он без префикса в URL. */
export const DEFAULT_LOCALE: Locale = "ru";

/** Строит путь с учётом локали: ("en", "/apps/poaching") → "/en/apps/poaching". */
export function localePath(locale: Locale, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === "/" ? "/en" : `/en${clean}`;
}

/** Локаль из сегмента маршрута; всё, кроме "en", считаем дефолтной. */
export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
