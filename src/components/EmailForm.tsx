"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

type FormValues = {
  email: string;
  website: string; // honeypot
};

export default function EmailForm({
  cta = "Получить бесплатный audit",
  source,
}: {
  cta?: string;
  source: string;
}) {
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
        body: JSON.stringify({ ...data, source }),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error ?? "Что-то пошло не так. Попробуйте ещё раз.");
        return;
      }
      router.push("/thank-you");
    } catch {
      setServerError("Ошибка сети. Попробуйте ещё раз.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-xl flex-col gap-3 sm:flex-row"
      noValidate
    >
      <div className="flex-1">
        <label htmlFor={`email-${source}`} className="sr-only">
          Email
        </label>
        <input
          id={`email-${source}`}
          type="email"
          placeholder="Ваш email"
          autoComplete="email"
          className="min-h-12 w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-slate-500 backdrop-blur-sm transition-all duration-300 ease-premium hover:border-white/25 focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-invalid={!!errors.email}
          {...register("email", {
            required: "Введите email",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
              message: "Введите корректный email",
            },
          })}
        />
        {(errors.email || serverError) && (
          <p role="alert" className="mt-2 text-sm text-rose-400">
            {errors.email?.message ?? serverError}
          </p>
        )}
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
      <button type="submit" className="btn-primary" disabled={isSubmitting}>
        {isSubmitting ? "Отправляем…" : cta}
      </button>
    </form>
  );
}
