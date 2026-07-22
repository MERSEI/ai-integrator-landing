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

/** Бейдж категории сигнала: монохромная иерархия — важные ярче. */
export function signalColor(category: string): string {
  const c = category.toLowerCase();
  if (c.includes("боль") || c.includes("проблем") || c.includes("найм"))
    return "text-black ring-white/60 bg-white";
  if (c.includes("достиж") || c.includes("успех") || c.includes("событ") || c.includes("новост"))
    return "text-white ring-white/30 bg-white/15";
  return "text-slate-300 ring-white/15 bg-white/5";
}
