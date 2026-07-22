export type Contact = { type: string; value: string };
export type Signal = { category: string; detail: string };

export type ColdMessageResult = {
  contacts: Contact[];
  signals: Signal[];
  approach: string;
  subject?: string;
  message: string;
};

export type ColdMessageRequest = {
  profileText: string;
  offerTemplate: string;
  channel: string;
  tone: string;
  sourceLink?: string;
};

export const CHANNELS = [
  "Telegram",
  "Email",
  "LinkedIn",
  "Instagram",
  "WhatsApp",
] as const;

export const TONES = [
  "Дружелюбный (на ты)",
  "Деловой (на вы)",
  "Нейтральный",
  "Экспертный",
] as const;

/** Цвет бейджа под категорию сигнала (мягкое сопоставление по ключевым словам). */
export function signalColor(category: string): string {
  const c = category.toLowerCase();
  if (c.includes("контакт")) return "text-sky-300 ring-sky-400/25 bg-sky-400/10";
  if (c.includes("достиж") || c.includes("успех"))
    return "text-success ring-success/25 bg-success/10";
  if (c.includes("боль") || c.includes("проблем") || c.includes("найм"))
    return "text-rose-300 ring-rose-400/25 bg-rose-400/10";
  if (c.includes("событ") || c.includes("новост"))
    return "text-amber-300 ring-amber-400/25 bg-amber-400/10";
  return "text-primary-light ring-primary-light/25 bg-primary/10";
}
