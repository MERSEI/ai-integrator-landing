import Script from "next/script";
import { GA_MEASUREMENT_ID, GOOGLE_ADS_ID } from "@/lib/gtag";

/**
 * Один тег gtag.js на оба счётчика Google: Analytics (G-…) и Ads (AW-…).
 *
 * Загружать библиотеку дважды нельзя — она общая, а идентификаторы
 * подключаются отдельными вызовами config. Раньше здесь был только Ads, а
 * GA4 не подключался вовсе, хотя переменная под него была заведена.
 *
 * strategy="afterInteractive" — стандарт для аналитики: скрипт грузится после
 * гидрации, не блокируя первый рендер, но раньше lazyOnload, чтобы клик по
 * форме через секунду после загрузки уже попал в отслеживание.
 */
export default function GoogleTags() {
  const ids = [GA_MEASUREMENT_ID, GOOGLE_ADS_ID].filter(Boolean);
  if (ids.length === 0) return null;

  return (
    <>
      <Script
        id="google-gtag-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${ids[0]}`}
        strategy="afterInteractive"
      />
      <Script id="google-gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${ids.map((id) => `gtag('config', '${id}');`).join("\n")}`}
      </Script>
    </>
  );
}
