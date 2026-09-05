import dynamic from "next/dynamic";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import ProblemsSection from "@/components/ProblemsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ResultsSection from "@/components/ResultsSection";

import PricingSection from "@/components/PricingSection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";

import type { Locale } from "@/lib/i18n";

/**
 * Оба блока живут ниже первого экрана и целиком клиентские: живое демо держит
 * состояние чата, лента активности ходит в сеть. Выносим их в отдельные чанки,
 * чтобы они не удлиняли первую отрисовку — до них ещё нужно доскроллить.
 */
const LiveAgentDemo = dynamic(() => import("@/components/LiveAgentDemo"));
const ActivityToast = dynamic(() => import("@/components/ActivityToast"));

/**
 * Интерактивные секции ниже первого экрана. Разметку они по-прежнему
 * отдают с сервера (ssr не отключаем — она нужна поисковикам и для LCP),
 * но их JS уезжает в отдельные чанки и не конкурирует за загрузку с героем.
 */
const FeaturesSection = dynamic(() => import("@/components/FeaturesSection"));
const ROICalculatorSection = dynamic(
  () => import("@/components/ROICalculatorSection"),
);
const FAQSection = dynamic(() => import("@/components/FAQSection"));

/** Тело главной страницы; маршруты `/` и `/en` рендерят его со своей локалью. */
export default function HomePage({ locale }: { locale: Locale }) {
  return (
    <>
      <Header locale={locale} />
      <main>
        <HeroSection locale={locale} />
        <TrustBar locale={locale} />
        <ProblemsSection locale={locale} />
        <FeaturesSection locale={locale} />
        <HowItWorksSection locale={locale} />
        {/* Живое демо стоит сразу после «как это работает»: обещание уже
            прозвучало, и его тут же можно проверить руками. */}
        <LiveAgentDemo locale={locale} />
        <ResultsSection locale={locale} />
        <ROICalculatorSection locale={locale} />
        <PricingSection locale={locale} />
        <FAQSection locale={locale} />
        <FinalCTASection locale={locale} />
      </main>
      <Footer locale={locale} />
      <ActivityToast locale={locale} />
    </>
  );
}
