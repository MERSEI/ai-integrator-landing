import type { Metadata } from "next";
import AppHeader from "@/components/AppHeader";
import TrendSniperTool from "@/components/trendsniper/TrendSniperTool";

export const metadata: Metadata = {
  title: "Trend Sniper — аналитика трендов по регионам | AI Integrator",
  description:
    "Введите тему — Trend Sniper оценивает уровень интереса, направление тренда, топ-регионы и связанные запросы, в стиле Google Trends.",
};

export default function TrendSniperPage() {
  return (
    <>
      <AppHeader badge="Trend Sniper" />
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
              Trend Sniper —{" "}
              <span className="text-gradient">аналитика спроса по регионам</span>
            </h1>
            <p className="mt-4 text-lg text-slate-400">
              Введите тему — движок покажет уровень интереса, куда движется тренд,
              в каких регионах он сильнее и какие запросы растут вокруг него.
            </p>
          </div>

          <div className="mt-12">
            <TrendSniperTool />
          </div>
        </div>
      </main>
    </>
  );
}
