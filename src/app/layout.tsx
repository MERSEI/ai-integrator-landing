import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-integrator-landing.vercel.app"),
  title: "AI Integrator — Ваш AI-помощник для продаж и привлечения клиентов",
  description:
    "15 готовых AI-приложений для автоматизации продаж, маркетинга и операционки. Работают за 48 часов без разработчиков.",
  keywords: [
    "AI автоматизация",
    "AI для продаж",
    "лидогенерация",
    "автоматизация бизнеса",
    "AI инструменты",
  ],
  openGraph: {
    title: "AI Integrator — AI-помощник для продаж",
    description:
      "15 готовых AI-приложений для автоматизации продаж, маркетинга и операционки. Запуск за 48 часов.",
    type: "website",
    locale: "ru_RU",
    images: ["/images/hero.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AI Integrator",
  applicationCategory: "BusinessApplication",
  description:
    "15 готовых AI-приложений для автоматизации продаж, маркетинга и операционки.",
  offers: {
    "@type": "Offer",
    price: "149",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "50",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
