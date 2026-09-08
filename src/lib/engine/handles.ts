import type { Rng } from "./random";

/**
 * Генератор правдоподобных вымышленных юзернеймов для демо-данных.
 *
 * Хэндлы латиницей в обеих локалях — так их и пишут в Threads/Telegram,
 * русский ник транслитом выглядел бы фальшивее английского.
 */

const FIRST = [
  "anton", "marina", "denis", "olga", "sergey", "kate", "pavel", "irina",
  "max", "lena", "artem", "julia", "vlad", "nastya", "roman", "dasha",
  "igor", "sveta", "nikita", "alina", "misha", "vera", "kirill", "polina",
  "alex", "sonya", "gleb", "masha", "timur", "zhenya",
];

const SUFFIX = [
  "dev", "biz", "pro", "hq", "works", "studio", "team", "agency",
  "digital", "online", "official", "here", "spb", "msk", "co", "lab",
];

const LAST_INITIAL = "abcdefghijklmnopqrstuvwxyz".split("");

/**
 * Один хэндл вида @anton_dev / @marina.hq / @denis91.
 * `used` не даёт повториться внутри одного ответа.
 */
export function handle(r: Rng, used: Set<string> = new Set()): string {
  for (let attempt = 0; attempt < 40; attempt++) {
    const first = r.pick(FIRST);
    let name: string;
    switch (r.int(0, 3)) {
      case 0:
        name = `${first}_${r.pick(SUFFIX)}`;
        break;
      case 1:
        name = `${first}${r.pick(LAST_INITIAL)}`;
        break;
      case 2:
        name = `${first}${r.int(78, 99)}`;
        break;
      default:
        name = `${first}.${r.pick(SUFFIX)}`;
    }
    if (!used.has(name)) {
      used.add(name);
      return `@${name}`;
    }
  }
  // Пул исчерпан — добавляем счётчик, лишь бы не отдать дубль.
  const fallback = `${r.pick(FIRST)}${used.size}`;
  used.add(fallback);
  return `@${fallback}`;
}

/**
 * Хэндл «бренда»: аккаунт конкурента или автора популярного поста.
 * Строится из ниши пользователя, поэтому выглядит связанным с запросом.
 */
export function brandHandle(r: Rng, niche: string, used: Set<string> = new Set()): string {
  const root = slug(niche) || r.pick(FIRST);
  const shapes = [
    `${root}_${r.pick(["pro", "hq", "lab", "school", "club", "space"])}`,
    `${r.pick(["the", "get", "go", "my"])}${root}`,
    `${root}${r.pick(["ru", "io", "app", "team"])}`,
  ];
  for (const shape of shapes) {
    if (!used.has(shape)) {
      used.add(shape);
      return `@${shape}`;
    }
  }
  return handle(r, used);
}

/** Первое слово ниши латиницей, пригодное для юзернейма. */
export function slug(input: string): string {
  const word = input.trim().toLowerCase().split(/\s+/)[0] ?? "";
  const translit: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
    и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
    с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
    ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };
  return [...word]
    .map((ch) => translit[ch] ?? (/[a-z0-9]/.test(ch) ? ch : ""))
    .join("")
    .slice(0, 12);
}
