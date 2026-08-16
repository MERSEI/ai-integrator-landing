import Script from "next/script";
import { GOOGLE_ADS_ID } from "@/lib/gtag";

/**
 * Google tag (gtag.js) для Google Ads. Рендерится в обоих корневых layout'ах,
 * так что тег стоит на всех страницах — это требование Google Ads: без тега на
 * посадочной странице конверсию не с чем связать.
 *
 * strategy="afterInteractive" — стандарт для аналитики: скрипт грузится после
 * гидрации, не блокируя первый рендер, но раньше lazyOnload, чтобы клик по
 * форме через секунду после загрузки уже попал в отслеживание.
 */
export default function GoogleAdsTag() {
  if (!GOOGLE_ADS_ID) return null;

  return (
    <>
      <Script
        id="google-ads-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');`}
      </Script>
    </>
  );
}
