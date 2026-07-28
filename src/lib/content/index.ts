import type { Locale } from "../i18n";
import type { Content } from "./types";
import { ru } from "./ru";
import { en } from "./en";

export type {
  App,
  AppStatus,
  CategoryKey,
  Content,
  FaqItem,
  PricingTier,
  SoonApp,
  Stat,
  Step,
  Testimonial,
} from "./types";

const DICTIONARIES: Record<Locale, Content> = { ru, en };

export function getContent(locale: Locale): Content {
  return DICTIONARIES[locale];
}

/** Классы бейджа статуса — оформление, а не текст, поэтому вне словарей. */
export const APP_STATUS_CLASSES: Record<string, string> = {
  live: "bg-success/15 text-success",
  demo: "bg-warning/15 text-warning",
  soon: "bg-white/10 text-slate-400",
};

/** Контакты одинаковы для всех языков. */
export const CONTACTS = {
  email: "aiintegrator.hello@gmail.com",
  telegram: "@f1_owe",
  phone: "+420 773 693 263",
  address: "Kyiv, Ukraine",
} as const;
