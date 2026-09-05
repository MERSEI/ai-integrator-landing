"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { getContent } from "@/lib/content";
import { emailProblem, suggestEmail } from "@/lib/emailCheck";
import { trackEvent, trackLeadConversion } from "@/lib/gtag";
import { localePath, type Locale } from "@/lib/i18n";
import {
  CONTACT_CHANNELS,
  DEFAULT_CONTACT_CHANNEL,
  isValidContact,
  needsContactValue,
  type ContactChannel,
} from "@/lib/contactChannel";
import { FiMail, FiPhone, TbBrandTelegram, TbBrandWhatsapp , type IconComponent } from "./icons";

type FormValues = {
  email: string;
  interest: string;
  channel: ContactChannel;
  contact: string;
  website: string; // honeypot
};

/**
 * Схема живёт внутри компонента, потому что тексты ошибок переводятся, а
 * обязательность контакта зависит от выбранного канала: для email второго
 * поля нет вовсе, для остальных оно обязательно и проверяется по формату.
 */
function buildSchema(t: ReturnType<typeof getContent>["form"]) {
  return z
    .object({
      email: z
        .string()
        .min(1, t.required)
        // Проверка та же, что на сервере: структура адреса, кириллица, TLD.
        // Правила из register() при подключённом resolver не выполняются,
        // поэтому валидация живёт только здесь.
        .refine((value) => emailProblem(value) === null, t.invalid),
      interest: z.string().optional().default(""),
      channel: z.enum(CONTACT_CHANNELS).default(DEFAULT_CONTACT_CHANNEL),
      contact: z.string().optional().default(""),
      website: z.string().optional().default(""),
    })
    .superRefine((values, ctx) => {
      if (!needsContactValue(values.channel)) return;
      const contact = values.contact?.trim() ?? "";
      if (!contact) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["contact"], message: t.contactRequired });
      } else if (!isValidContact(values.channel, contact)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["contact"], message: t.contactInvalid });
      }
    });
}

const CHANNEL_ICONS: Record<ContactChannel, IconComponent> = {
  email: FiMail,
  telegram: TbBrandTelegram,
  whatsapp: TbBrandWhatsapp,
  phone: FiPhone,
};

export default function EmailForm({
  locale,
  cta,
  source,
  stacked = false,
  note,
}: {
  locale: Locale;
  cta?: string;
  source: string;
  /** Колонкой на всех размерах — для узких контейнеров (напр. карточка калькулятора),
   * где `sm:flex-row` сжимает email-поле до нечитаемой ширины независимо от вьюпорта. */
  stacked?: boolean;
  /** Контекст заявки — например, посчитанный ROI. Уходит в лид и в таблицу. */
  note?: string;
}) {
  const content = getContent(locale);
  const t = content.form;
  const interestOptions = content.categories.filter((cat) => cat.key !== "all");
  const router = useRouter();
  const schema = useMemo(() => buildSchema(t), [t]);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { channel: DEFAULT_CONTACT_CHANNEL },
    resolver: zodResolver(schema),
  });

  // Email уже введён выше, поэтому для канала "email" второе поле не нужно —
  // лишний обязательный инпут на этом шаге стоит конверсии.
  const channel = watch("channel") ?? DEFAULT_CONTACT_CHANNEL;
  const showContactField = needsContactValue(channel);

  // Опечатка в домене — не ошибка формы, а вопрос: показываем исправленный
  // вариант рядом с полем и даём подставить его одной кнопкой.
  const typo = suggestEmail(watch("email") ?? "");

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source, locale, note }),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error ?? t.genericError);
        return;
      }
      // Конверсия засчитывается здесь, а не на /thank-you: на страницу
      // благодарности можно вернуться кнопкой «назад» и накрутить дубли.
      trackLeadConversion(source);
      trackEvent("lead_channel", { source, channel: data.channel });
      router.push(localePath(locale, "/thank-you"));
    } catch {
      setServerError(t.networkError);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex w-full flex-col gap-4 ${stacked ? "" : "max-w-3xl"}`}
      noValidate
    >
      <div className={`flex flex-col gap-3 ${stacked ? "" : "sm:flex-row"}`}>
        <div className="min-w-0 flex-1">
          <label htmlFor={`email-${source}`} className="sr-only">
            {t.emailLabel}
          </label>
          <input
            id={`email-${source}`}
            type="email"
            placeholder={t.placeholder}
            autoComplete="email"
            className="min-h-11 w-full rounded-md border border-white/10 bg-white/[0.03] px-4 py-2.5 text-primary placeholder-secondary/70 transition-colors duration-200 ease-premium hover:border-white/20 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/35"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {(errors.email || serverError) && (
            <p role="alert" className="mt-2 text-sm text-rose-400">
              {errors.email?.message ?? serverError}
            </p>
          )}
          {typo && !errors.email && (
            <p className="mt-2 text-sm text-warning">
              {t.typoQuestion}{" "}
              <button
                type="button"
                onClick={() =>
                  setValue("email", typo, { shouldValidate: true, shouldDirty: true })
                }
                className="font-medium underline underline-offset-2 hover:text-primary"
              >
                {typo}
              </button>
              ? <span className="sr-only">{t.typoApply}</span>
            </p>
          )}
        </div>
        <div className={stacked ? "shrink-0" : "shrink-0 sm:w-52"}>
          <label htmlFor={`interest-${source}`} className="sr-only">
            {t.interestLabel}
          </label>
          <select
            id={`interest-${source}`}
            defaultValue=""
            className="min-h-11 w-full cursor-pointer rounded-md border border-white/10 bg-white/[0.03] px-4 py-2.5 text-primary transition-colors duration-200 ease-premium hover:border-white/20 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/35"
            {...register("interest")}
          >
            <option value="" className="bg-dark text-slate-400">
              {t.interestPlaceholder}
            </option>
            {interestOptions.map((cat) => (
              <option key={cat.key} value={cat.key} className="bg-dark text-white">
                {cat.label}
              </option>
            ))}
            <option value="other" className="bg-dark text-white">
              {t.interestOther}
            </option>
          </select>
        </div>
        {/* Honeypot — скрыто от людей, видимо ботам */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          {...register("website")}
        />
        <button type="submit" className="btn-primary shrink-0" disabled={isSubmitting}>
          {isSubmitting ? t.submitting : cta}
        </button>
      </div>

      {/* Выбор канала связи: лид сам говорит, где ему удобнее продолжить —
          в Telegram, WhatsApp, по телефону или почтой. */}
      <fieldset
        className={`flex flex-col gap-2.5 ${stacked ? "items-start" : "items-center"}`}
      >
        <legend className="sr-only">{t.channelLabel}</legend>
        <p
          className={`text-sm text-secondary ${stacked ? "text-left" : "text-center"}`}
          aria-hidden="true"
        >
          {t.channelLabel}
        </p>

        <div
          className={`flex flex-wrap gap-2 ${stacked ? "justify-start" : "justify-center"}`}
        >
          {CONTACT_CHANNELS.map((key) => {
            const Icon = CHANNEL_ICONS[key];
            return (
              <label
                key={key}
                className="cursor-pointer"
                title={t.channelOptions[key]}
              >
                <input
                  type="radio"
                  value={key}
                  className="peer sr-only"
                  {...register("channel")}
                />
                <span className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-sm font-medium text-secondary transition-colors duration-200 ease-premium hover:border-white/20 hover:text-primary peer-checked:border-accent/60 peer-checked:bg-accent/15 peer-checked:text-primary peer-focus-visible:ring-2 peer-focus-visible:ring-accent/50">
                  <Icon size={15} aria-hidden="true" />
                  {t.channelOptions[key]}
                </span>
              </label>
            );
          })}
        </div>

        {showContactField ? (
          <div className={`w-full ${stacked ? "" : "sm:max-w-sm"}`}>
            <label htmlFor={`contact-${source}`} className="sr-only">
              {t.contactLabels[channel]}
            </label>
            <input
              id={`contact-${source}`}
              type={channel === "telegram" ? "text" : "tel"}
              inputMode={channel === "telegram" ? "text" : "tel"}
              placeholder={t.contactPlaceholders[channel]}
              autoComplete={channel === "telegram" ? "off" : "tel"}
              className="min-h-11 w-full rounded-md border border-white/10 bg-white/[0.03] px-4 py-2.5 text-primary placeholder-secondary/70 transition-colors duration-200 ease-premium hover:border-white/20 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/35"
              aria-invalid={!!errors.contact}
              {...register("contact")}
            />
            {errors.contact && (
              <p role="alert" className="mt-2 text-sm text-rose-400">
                {errors.contact.message}
              </p>
            )}
          </div>
        ) : null}

        <p className={`text-xs text-secondary ${stacked ? "text-left" : "text-center"}`}>
          {t.channelHint}
        </p>
      </fieldset>
    </form>
  );
}
