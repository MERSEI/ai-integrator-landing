/**
 * Проверка адреса на опечатки. Обычная regex-валидация пропускает всё, что
 * похоже на email по форме, — а в таблице лидов лежат `gmail.con`,
 * `gmail.comjj`, `гmail.com` и `рр@рртрр.оо`. Каждый такой лид уходит в
 * никуда: письмо отбивается, человек ждёт ответа, которого не будет.
 *
 * Три уровня, от жёсткого к мягкому:
 * 1. `emailProblem` — структурная ошибка (нет TLD, кириллица, двойная точка):
 *    отправлять по такому адресу бессмысленно, форма не пропускает.
 * 2. `suggestEmail` — домен похож на популярный, но не он: показываем
 *    подсказку «возможно, вы имели в виду …» и предлагаем исправить.
 * 3. Всё остальное принимаем как есть — список доменов не может быть полным.
 */

/** Формат целиком: одна @, непустые части, домен с точкой. */
const SHAPE_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Кириллица в адресе. IDN-домены (.рф, .укр) технически существуют, но в
 * письмах требуют punycode, а Gmail SMTP их отбивает — в наших данных это
 * всегда была опечатка при переключённой раскладке, не настоящий адрес.
 */
const CYRILLIC_RE = /[Ѐ-ӿ]/;

/** Домены, куда реально пишет наша аудитория. Основа для поиска опечаток. */
const KNOWN_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "yahoo.com",
  "icloud.com",
  "me.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "gmx.com",
  "mail.ru",
  "bk.ru",
  "inbox.ru",
  "list.ru",
  "internet.ru",
  "yandex.ru",
  "yandex.com",
  "ya.ru",
  "rambler.ru",
  "ukr.net",
  "i.ua",
  "meta.ua",
  "seznam.cz",
  "email.cz",
  "centrum.cz",
  "volny.cz",
] as const;

export type EmailProblem = "shape" | "cyrillic" | "domain";

/** Структурная проблема адреса или null, если по форме всё в порядке. */
export function emailProblem(email: string): EmailProblem | null {
  const value = email.trim();
  if (CYRILLIC_RE.test(value)) return "cyrillic";
  if (!SHAPE_RE.test(value)) return "shape";

  const domain = value.slice(value.lastIndexOf("@") + 1).toLowerCase();
  // Пустые метки (`a..b`, `.com`, `mail.`) и TLD, который не может быть TLD.
  if (domain.split(".").some((label) => label === "")) return "domain";
  const tld = domain.slice(domain.lastIndexOf(".") + 1);
  if (!/^[a-z]{2,24}$/.test(tld)) return "domain";

  return null;
}

/** Расстояние Левенштейна; считаем только до предела, дальше не интересно. */
function distance(a: string, b: string, limit: number): number {
  if (Math.abs(a.length - b.length) > limit) return limit + 1;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const value = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + cost);
      row.push(value);
      if (value < best) best = value;
    }
    // Вся строка уже дальше предела — итог точно больше него.
    if (best > limit) return limit + 1;
    prev = row;
  }
  return prev[b.length];
}

/**
 * Исправленный адрес, если домен — почти наверняка опечатка популярного.
 * Возвращает null, когда домен известен, далёк от всех известных или слишком
 * короток, чтобы судить по одной правке.
 */
export function suggestEmail(email: string): string | null {
  const value = email.trim();
  if (emailProblem(value)) return null;

  const at = value.lastIndexOf("@");
  const local = value.slice(0, at);
  const domain = value.slice(at + 1).toLowerCase();

  if ((KNOWN_DOMAINS as readonly string[]).includes(domain)) return null;

  for (const known of KNOWN_DOMAINS) {
    // Короткие домены (ya.ru, i.ua) правим только на одну ошибку: с двумя
    // «правками» под них подходит слишком много настоящих чужих доменов.
    const limit = known.length <= 6 ? 1 : 2;
    if (distance(domain, known, limit) <= limit) return `${local}@${known}`;
  }

  return null;
}

/** Годен ли адрес к отправке: и по форме, и без явной опечатки в домене. */
export function isSendableEmail(email: string): boolean {
  return emailProblem(email) === null && suggestEmail(email) === null;
}
