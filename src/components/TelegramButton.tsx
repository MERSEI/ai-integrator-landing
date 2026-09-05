"use client";

import { CONTACTS } from "@/lib/content";
import { trackEvent } from "@/lib/gtag";
import { TbBrandTelegram } from "./icons";

/** Ссылка на личку: "@f1_owe" → "https://t.me/f1_owe". */
export const TELEGRAM_URL = `https://t.me/${CONTACTS.telegram.replace("@", "")}`;

/**
 * Второй путь конверсии рядом с формой: написать напрямую в Telegram.
 * Часть аудитории не оставляет email в принципе, но охотно пишет в мессенджер —
 * без этой кнопки такой лид просто уходит со страницы.
 *
 * Клиентский компонент только ради аналитики: клик по внешней ссылке иначе
 * никак не отличить от ухода со страницы, и непонятно, какой CTA работает.
 */
export default function TelegramButton({
  label,
  source,
  variant = "secondary",
  className = "",
}: {
  label: string;
  /** Тот же идентификатор блока, что и у формы рядом: hero, final-cta, … */
  source: string;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  return (
    <a
      href={TELEGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("telegram_click", { source })}
      className={`${variant === "primary" ? "btn-primary" : "btn-secondary"} ${className}`}
    >
      <TbBrandTelegram size={18} aria-hidden="true" />
      {label}
    </a>
  );
}
