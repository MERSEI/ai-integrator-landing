import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import ProblemsSection from "@/components/ProblemsSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ResultsSection from "@/components/ResultsSection";
import ROICalculatorSection from "@/components/ROICalculatorSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";
import type { Locale } from "@/lib/i18n";

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
        <ResultsSection locale={locale} />
        <ROICalculatorSection locale={locale} />
        <PricingSection locale={locale} />
        <FAQSection locale={locale} />
        <FinalCTASection locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
