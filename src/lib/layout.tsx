import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import GoogleAdsTag from "@/components/GoogleAdsTag";
import { CONTACTS, getContent } from "@/lib/content";
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
      siteName: "AI Integrator",
      // og:image не задаём: его отдаёт opengraph-image.tsx рядом с маршрутом,
      // и картинка собирается из того же словаря, что и страница.
    },
    twitter: {
      card: "summary_large_image",
      title: t.ogAlt,
      description: t.description,
    },
    robots: { index: true, follow: true },
  };
}

/**
 * Машиночитаемая разметка: сам сервис, каталог тарифов и FAQ.
 *
 * Всё собирается из словаря контента, а не пишется руками, — цены и вопросы в
 * разметке не могут разъехаться со страницей. Ничего, чего нет на сайте, сюда
 * не добавляется: aggregateRating убран намеренно (в разметке стояли 4.8 и 50
 * отзывов, которых нет — на сайте пять именных). Выдуманный рейтинг в
 * машиночитаемых данных это подлог, а не оптимизация.
 */
function jsonLd(locale: Locale) {
  const content = getContent(locale);
  const url = `${SITE_URL}${localePath(locale, "/")}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${url}#organization`,
        name: "AI Integrator",
        url,
        description: content.meta.description,
        areaServed: "Worldwide",
        serviceType: locale === "ru" ? "Внедрение AI-агентов" : "AI agent deployment",
        email: CONTACTS.email,
        telephone: CONTACTS.phone,
        address: { "@type": "PostalAddress", addressLocality: CONTACTS.address },
        sameAs: [`https://t.me/${CONTACTS.telegram.replace("@", "")}`],
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: content.meta.title,
        provider: { "@id": `${url}#organization` },
        inLanguage: content.htmlLang,
        description: content.meta.description,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: content.pricing.title,
          itemListElement: content.pricing.tiers.map((tier) => ({
            "@type": "Offer",
            name: tier.name,
            description: tier.tagline,
            price: String(tier.setup),
            priceCurrency: "USD",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: String(tier.price),
              priceCurrency: "USD",
              unitCode: "MON",
            },
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: content.faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
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
