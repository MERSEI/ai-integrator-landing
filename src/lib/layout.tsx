import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import GoogleAdsTag from "@/components/GoogleAdsTag";
import { getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";

const UMAMI_URL = "https://umami-production-398c.up.railway.app";
const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

/**
 * Общая часть корневых layout'ов обоих языков. Русская и английская версии —
 * два независимых root layout (см. src/app/(ru) и src/app/(en)), потому что
 * только корневой layout рендерит <html>, а атрибут lang должен отличаться.
 */

export const SITE_URL = "https://ai-integrator-landing.vercel.app";

/**
 * Одна гарнитура на весь сайт: заголовки отличаются трекингом и весом, а не
 * второй гарнитурой. Заодно минус один шрифтовой запрос.
 */
export const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export function buildMetadata(locale: Locale): Metadata {
  const t = getContent(locale).meta;
  const path = localePath(locale, "/");

  return {
    metadataBase: new URL(SITE_URL),
    title: t.title,
    description: t.description,
    alternates: {
      canonical: path,
      languages: {
        ru: "/",
        en: "/en",
        "x-default": "/",
      },
    },
    keywords:
      locale === "ru"
        ? [
            "AI автоматизация",
            "AI для продаж",
            "лидогенерация",
            "автоматизация бизнеса",
            "AI инструменты",
          ]
        : [
            "AI automation",
            "AI for sales",
            "lead generation",
            "business automation",
            "AI tools",
          ],
    openGraph: {
      title: t.ogAlt,
      description: t.description,
      type: "website",
      locale: locale === "ru" ? "ru_RU" : "en_US",
      url: path,
      images: ["/images/hero.png"],
    },
  };
}

function jsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AI Integrator",
    applicationCategory: "BusinessApplication",
    inLanguage: getContent(locale).htmlLang,
    description: getContent(locale).meta.description,
    offers: {
      "@type": "Offer",
      price: "490",
      priceCurrency: "USD",
    },
    // aggregateRating убран намеренно: в разметке стояли 4.8 и 50 отзывов,
    // которых нет — на сайте пять именных отзывов. Выдуманный рейтинг в
    // машиночитаемых данных это подлог, а не оптимизация.
  };
}

export function LocaleRoot({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <html lang={getContent(locale).htmlLang} className={inter.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(locale)) }}
        />
        {children}
        <Analytics />
        <GoogleAdsTag />
        {UMAMI_WEBSITE_ID && (
          <Script
            src={`${UMAMI_URL}/script.js`}
            data-website-id={UMAMI_WEBSITE_ID}
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  );
}
