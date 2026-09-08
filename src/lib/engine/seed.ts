import { hashSeed, rng, timeBucket, type Rng } from "./random";
import type { EngineLocale } from "./types";

/**
 * Rng для роута: сид из пользовательского ввода плюс минутная корзина.
 *
 * Ввод в сиде — чтобы разные запросы давали разные данные. Корзина времени —
 * чтобы повторное нажатие кнопки не вернуло то же самое: демо, которое на
 * второй клик показывает ровно тот же список, выглядит записанным заранее.
 * Минута, а не секунда, чтобы двойной клик не считался вторым запуском.
 *
 * В тестах сид задаётся напрямую через rng(), время сюда не попадает.
 */
export function seedFrom(parts: (string | number | undefined)[]): Rng {
  const input = parts.filter((p) => p !== undefined && p !== "").join("|");
  return rng(hashSeed(`${input}#${timeBucket()}`));
}

/**
 * Rng для встроенного примера: сид фиксирован, времени в нём нет.
 * Пример на странице должен выглядеть одинаково при каждом заходе и на
 * сервере, и на клиенте — иначе гидрация разъедется.
 */
export function sampleSeed(tool: string, locale: EngineLocale): Rng {
  return rng(hashSeed(`sample:${tool}:${locale}`));
}
