"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { getContent } from "@/lib/content";
import { trackLeadConversion } from "@/lib/gtag";
import { localePath, type Locale } from "@/lib/i18n";

type FormValues = {
  email: string;
  interest: string;
  website: string; // honeypot
};

export default function EmailForm({
  locale,
  cta,
  source,
  stacked = false,
}: {
  locale: Locale;
  cta?: string;
  source: string;
  /** Колонкой на всех размерах — для узких контейнеров (напр. карточка калькулятора),
   * где `sm:flex-row` сжимает email-поле до нечитаемой ширины независимо от вьюпорта. */
  stacked?: boolean;
}) {
  const content = getContent(locale);
  const t = content.form;
  const interestOptions = content.categories.filter((cat) => cat.key !== "all");
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source, locale }),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error ?? t.genericError);
        return;
      }
      // Конверсия засчитывается здесь, а не на /thank-you: на страницу
      // благодарности можно вернуться кнопкой «назад» и накрутить дубли.
      trackLeadConversion(source);
      router.push(localePath(locale, "/thank-you"));
    } catch {
      setServerError(t.networkError);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex w-full flex-col gap-3 ${stacked ? "" : "max-w-3xl sm:flex-row"}`}
      noValidate
    >
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
          {...register("email", {
            required: t.required,
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
              message: t.invalid,
            },
          })}
        />
        {(errors.email || serverError) && (
          <p role="alert" className="mt-2 text-sm text-rose-400">
            {errors.email?.message ?? serverError}
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
    </form>
  );
}
