/**
 * Канал связи, который лид выбирает в форме: куда с ним удобнее общаться.
 *
 * Модуль общий для клиента и сервера, потому что нормализация нужна в обоих
 * местах: форма показывает подсказку и валидирует ввод, а API всё равно
 * перепроверяет и приводит значение к канону — на бэкенд может прилететь
 * что угодно, и в таблицу должен попасть предсказуемый формат.
 */

export const CONTACT_CHANNELS = ["email", "telegram", "whatsapp", "phone"] as const;

export type ContactChannel = (typeof CONTACT_CHANNELS)[number];

/** Email уже введён в форме, поэтому дефолт не требует второго поля. */
export const DEFAULT_CONTACT_CHANNEL: ContactChannel = "email";

/** Для email контакт не спрашиваем — он и есть значение поля email. */
export function needsContactValue(channel: ContactChannel): boolean {
  return channel !== "email";
}

export function isContactChannel(value: unknown): value is ContactChannel {
  return (
    typeof value === "string" &&
    (CONTACT_CHANNELS as readonly string[]).includes(value)
  );
}

export function normalizeChannel(value: unknown): ContactChannel {
  return isContactChannel(value) ? value : DEFAULT_CONTACT_CHANNEL;
}

/** Верхняя граница длины — защита от мусора в ячейке таблицы. */
const MAX_CONTACT_LENGTH = 120;

const TELEGRAM_URL_RE = /^(?:https?:\/\/)?(?:t\.me|telegram\.me)\/(?:@)?([A-Za-z0-9_]+)\/?$/;
const TELEGRAM_USERNAME_RE = /^@?([A-Za-z0-9_]{4,32})$/;

/**
 * Приводит контакт к виду, пригодному для «написать в один клик»:
 * telegram → `@username`, телефон и WhatsApp → только цифры и `+`.
 * Всё, что не распозналось, возвращается как есть — лучше сохранить сырую
 * строку, чем потерять контакт лида.
 */
export function normalizeContact(channel: ContactChannel, raw: unknown): string {
  if (typeof raw !== "string") return "";
  const value = raw.trim().slice(0, MAX_CONTACT_LENGTH);
  if (!value) return "";

  switch (channel) {
    case "email":
      return value.toLowerCase();
    case "telegram": {
      const fromUrl = value.match(TELEGRAM_URL_RE);
      if (fromUrl) return `@${fromUrl[1]}`;
      const username = value.match(TELEGRAM_USERNAME_RE);
      if (username) return `@${username[1]}`;
      return value;
    }
    case "whatsapp":
    case "phone": {
      const digits = value.replace(/[^\d+]/g, "");
      // Плюс имеет смысл только первым символом номера.
      const normalized = digits.startsWith("+")
        ? `+${digits.slice(1).replace(/\+/g, "")}`
        : digits.replace(/\+/g, "");
      return normalized || value;
    }
  }
}

/** Похоже ли значение на рабочий контакт для выбранного канала. */
export function isValidContact(channel: ContactChannel, raw: string): boolean {
  const value = normalizeContact(channel, raw);
  if (!value) return false;

  switch (channel) {
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    case "telegram":
      return TELEGRAM_USERNAME_RE.test(value);
    case "whatsapp":
    case "phone":
      return /^\+?\d{8,15}$/.test(value);
  }
}

/**
 * Ссылка, по которой с лидом можно связаться в один клик. Используется и в
 * интерфейсе, и в Google-таблице (колонка «Написать»).
 */
export function contactLink(channel: ContactChannel, contact: string): string | null {
  const value = normalizeContact(channel, contact);
  if (!isValidContact(channel, value)) return null;

  switch (channel) {
    case "email":
      return `mailto:${value}`;
    case "telegram":
      return `https://t.me/${value.replace("@", "")}`;
    case "whatsapp":
      return `https://wa.me/${value.replace(/\D/g, "")}`;
    case "phone":
      return `tel:${value.startsWith("+") ? value : `+${value}`}`;
  }
}
