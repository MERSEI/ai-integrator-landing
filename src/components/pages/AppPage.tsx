import type { Metadata } from "next";
import type { ReactNode } from "react";
import AppHeader from "@/components/AppHeader";
import ProBlock from "@/components/ProBlock";
import { getContent } from "@/lib/content";
import type { AppPageId } from "@/lib/content/types";
import { localePath, type Locale } from "@/lib/i18n";

/** Метаданные страницы приложения — обёртка, чтобы не дублировать в 20 маршрутах. */
export function appMetadata(locale: Locale, id: AppPageId): Metadata {
  const t = getContent(locale).appPages[id];
  const path = `/apps/${id}`;

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: {
      canonical: localePath(locale, path),
      languages: {
        ru: path,
        en: `/en${path}`,
        "x-default": path,
      },
    },
  };
}

/**
 * Общий каркас страницы приложения: шапка, заголовок, демо-инструмент,
 * PRO-блок и дисклеймер. Сам инструмент приходит через children, потому что
 * у каждого приложения он свой.
 */
export default function AppPage({
  locale,
  id,
  children,
}: {
  locale: Locale;
  id: AppPageId;
  children: ReactNode;
}) {
  const t = getContent(locale).appPages[id];

  return (
    <>
      <AppHeader locale={locale} badge={t.badge} />
      <main className="relative min-h-screen overflow-hidden bg-dark">
        <div
          className="pointer-events-none absolute -top-32 right-[-10%] h-[460px] w-[460px] animate-drift rounded-full bg-white/[0.06] blur-[140px] will-change-transform"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-[-8%] h-[380px] w-[380px] animate-drift-alt rounded-full bg-white/[0.04] blur-[140px] will-change-transform"
          aria-hidden="true"
        />
        <div className="container-section relative py-12 sm:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {t.titleLead}
              <span className="text-gradient">{t.titleAccent}</span>
            </h1>
            <p className="mt-4 text-lg text-slate-400">{t.subtitle}</p>
          </div>

          <div className="mt-12">{children}</div>

          {t.pro && (
            <ProBlock
              locale={locale}
              title={t.pro.title}
              intro={t.pro.intro}
              features={t.pro.features}
            />
          )}

          {t.disclaimer && (
            <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-slate-600">
              {t.disclaimer}
            </p>
          )}
        </div>
      </main>
    </>
  );
}
