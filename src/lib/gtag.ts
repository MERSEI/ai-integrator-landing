/**
 * Google Ads (gtag.js) — тег отслеживания конверсий.
 *
 * Скрипт подключается в LocaleRoot (src/lib/layout.tsx), а этот модуль даёт
 * типизированную обёртку над глобальным gtag, чтобы компоненты не лезли в
 * window напрямую.
 *
 * Две переменные окружения:
 *   NEXT_PUBLIC_GOOGLE_ADS_ID        — идентификатор аккаунта, AW-XXXXXXXXXX
 *   NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL — метка конверсионного действия «лид»
 *
 * Без ID тег не подключается вообще, без метки события конверсии не
 * отправляются (сам тег при этом работает и собирает ремаркетинг-аудиторию).
 * Как получить и то и другое — docs/google-ads-setup.md.
 */

export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "";

export const GOOGLE_ADS_LEAD_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL ?? "";

type GtagArgs =
  | ["js", Date]
  | ["config", string, Record<string, unknown>?]
  | ["event", string, Record<string, unknown>?]
  | ["set", Record<string, unknown>];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: GtagArgs) => void;
  }
}

/**
 * Собирает значение send_to: "AW-18392989021/AbC-D_efGhIjKlM". Именно эта пара
 * «аккаунт/метка» говорит Google Ads, какое конверсионное действие засчитать.
 * Возвращает null, если что-то из двух не настроено.
 */
export function conversionTarget(label: string): string | null {
  if (!GOOGLE_ADS_ID || !label) return null;
  return `${GOOGLE_ADS_ID}/${label}`;
}

/** Отправляет произвольное событие в gtag. No-op, если тег не загружен. */
export function trackEvent(
  name: string,
  params: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

/**
 * Отправляет конверсию в Google Ads.
 *
 * @param label метка конверсионного действия из интерфейса Google Ads
 * @param params value / currency / transaction_id — всё опционально
 * @returns true, если событие ушло
 *
 * transaction_id стоит передавать, когда одна и та же конверсия может
 * отправиться дважды (ретрай формы, возврат на страницу): Google
 * дедуплицирует конверсии по нему.
 */
export function trackConversion(
  label: string,
  params: {
    value?: number;
    currency?: string;
    transaction_id?: string;
  } = {},
): boolean {
  const sendTo = conversionTarget(label);
  if (!sendTo) return false;
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return false;
  }
  window.gtag("event", "conversion", { send_to: sendTo, ...params });
  return true;
}

/** Конверсия «получен лид с формы подписки». */
export function trackLeadConversion(source: string): boolean {
  return trackConversion(GOOGLE_ADS_LEAD_LABEL, {
    transaction_id: `${source}-${Date.now()}`,
  });
}
