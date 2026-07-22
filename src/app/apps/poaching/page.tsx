import type { Metadata } from "next";
import AppHeader from "@/components/AppHeader";
import PoachingTool from "@/components/poaching/PoachingTool";

export const metadata: Metadata = {
  title: "Poaching — переманивание клиентов у конкурентов | AI Integrator",
  description:
    "Укажите нишу — Poaching находит людей, которые интересовались у ваших конкурентов, оценивает их и подсказывает тактичный заход в личку.",
};

export default function PoachingPage() {
  return (
    <>
      <AppHeader badge="Poaching" />
      <main className="relative min-h-screen overflow-hidden bg-dark">
        <div
          className="pointer-events-none absolute -top-32 right-[-10%] h-[460px] w-[460px] animate-drift rounded-full bg-primary/15 blur-[140px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-[-8%] h-[380px] w-[380px] animate-drift-alt rounded-full bg-secondary/15 blur-[140px]"
          aria-hidden="true"
        />
        <div className="container-section relative py-12 sm:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Poaching —{" "}
              <span className="text-gradient">охота на клиентов конкурентов</span>
            </h1>
            <p className="mt-4 text-lg text-slate-400">
              Люди, которые задают вопросы под постами конкурентов, — уже тёплые
              лиды. Укажите нишу — движок найдёт их и подскажет, как тактично
              переманить.
            </p>
          </div>

          <div className="mt-12">
            <PoachingTool />
          </div>
        </div>
      </main>
    </>
  );
}
