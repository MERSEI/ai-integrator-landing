import type { Metadata } from "next";
import type { ReactNode } from "react";
import AppHeader from "@/components/AppHeader";
import ProBlock from "@/components/ProBlock";
import TelegramButton from "@/components/TelegramButton";
import { getContent } from "@/lib/content";
import type { AppPageId } from "@/lib/content/types";
import { localePath, type Locale } from "@/lib/i18n";
import { FiArrowRight } from "@/components/icons";

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
  const content = getContent(locale);
  const t = content.appPages[id];
  const convert = content.demoConvert;

  return (
    <>
      <AppHeader locale={locale} badge={t.badge} />
      <main className="relative min-h-screen overflow-hidden bg-dark">
        <div className="container-section relative py-12 sm:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-heading text-3xl font-semibold tracking-tighter text-primary sm:text-4xl">
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

          {/* Приложения без PRO-апселла всё равно должны вести дальше, а не
              обрывать путь после демо — иначе часть из 10 живых инструментов
              вообще не ведёт к конверсии. */}
          {!t.pro && (
            <div className="mx-auto mt-12 max-w-3xl rounded-lg border border-white/10 bg-white/[0.03] p-6 text-center sm:p-8">
              <p className="font-heading text-lg font-bold text-white">
                {convert.titleTemplate(t.badge)}
              </p>
              <p className="mt-1.5 text-sm text-slate-400">{convert.subtitle}</p>
              <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={`${localePath(locale, "/")}#final-cta`}
                  className="btn-primary inline-flex"
                >
                  {convert.ctaLabel}
                  <FiArrowRight aria-hidden="true" />
                </a>
                <TelegramButton label={convert.telegramCta} source={`demo-${id}`} />
              </div>
            </div>
          )}

          {t.disclaimer && (
            <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-secondary">
              {t.disclaimer}
            </p>
          )}
        </div>
      </main>
    </>
  );
}
