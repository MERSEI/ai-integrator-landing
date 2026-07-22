import type { Metadata } from "next";
import AppHeader from "@/components/AppHeader";
import BizDoctorTool from "@/components/bizdoctor/BizDoctorTool";

export const metadata: Metadata = {
  title: "BizDoctor — диагностика бизнеса | AI Integrator",
  description:
    "Расскажите о бизнесе и метриках — BizDoctor покажет, где теряются деньги, и даст конкретные рекомендации с расчётом эффекта.",
};

export default function BizDoctorPage() {
  return (
    <>
      <AppHeader badge="BizDoctor" />
      <main className="relative min-h-screen overflow-hidden bg-dark">
        <div
          className="pointer-events-none absolute -top-32 right-[-10%] h-[460px] w-[460px] animate-drift rounded-full bg-white/[0.06] blur-[140px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-[-8%] h-[380px] w-[380px] animate-drift-alt rounded-full bg-white/[0.04] blur-[140px]"
          aria-hidden="true"
        />
        <div className="container-section relative py-12 sm:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              BizDoctor — <span className="text-gradient">где вы теряете деньги</span>
            </h1>
            <p className="mt-4 text-lg text-slate-400">
              Расскажите о бизнесе — доктор расспросит про ключевые метрики,
              поставит диагноз и покажет, что чинить в первую очередь.
            </p>
          </div>
          <div className="mt-12">
            <BizDoctorTool />
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-slate-600">
            Диагностика — аналитическая оценка, а не финансовая консультация.
            Данные не сохраняются.
          </p>
        </div>
      </main>
    </>
  );
}
