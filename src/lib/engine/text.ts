/** Мелкие текстовые утилиты движка. */

/**
 * Подстановка слотов вида {name}.
 *
 * Незаполненный слот схлопывается в пустую строку, а не остаётся `{pain}` на
 * виду у пользователя; двойные пробелы после этого убираются. Тест проверяет,
 * что в готовом ответе не осталось ни одной фигурной скобки.
 */
export function fill(template: string, slots: Record<string, string | number>): string {
  const filled = template
    .replace(/\{(\w+)\}/g, (_, key: string) => String(slots[key] ?? ""))
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .trim();
  return capitalizeSentences(filled);
}

/**
 * Заглавная буква в начале предложения.
 *
 * Нужна из-за подстановки: шаблон «Задача такая: {outcome}. {keyword} — верное
 * направление?» ставит чужой текст сразу после точки, и без этого получается
 * «. маникюр на дому — верное направление?».
 *
 * Трогаем только слова целиком в нижнем регистре: iPhone, iOS и прочие бренды
 * пользователь пишет сам, и превращать их в IPhone — хуже, чем не тронуть.
 * После двоеточия и тире не трогаем ничего: в русском там строчная.
 */
export function capitalizeSentences(text: string): string {
  return text.replace(
    /(^|[.!?…]\s+)([a-zа-яё][a-zа-яё0-9]*)/g,
    (_, prefix: string, word: string) => prefix + word[0].toUpperCase() + word.slice(1)
  );
}

/** Обрезка по границе слова с многоточием. */
export function truncate(text: string, max: number): string {
  const clean = text.trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,.;:—-]$/, "") + "…";
}

/** Разбиение на предложения — для инструментов, которые цитируют ввод. */
export function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?…])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** Первое слово запроса с заглавной — для заголовков и подписей. */
export function capitalize(text: string): string {
  const t = text.trim();
  return t ? t[0].toUpperCase() + t.slice(1) : t;
}
