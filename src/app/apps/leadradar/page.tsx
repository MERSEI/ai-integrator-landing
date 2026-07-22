import type { Metadata } from "next";
import AppHeader from "@/components/AppHeader";
import LeadRadarTool from "@/components/leadradar/LeadRadarTool";

export const metadata: Metadata = {
  title: "LeadRadar — поиск лидов в Threads по ключевому слову | AI Integrator",
  description:
    "Введите ключевое слово — LeadRadar находит и квалифицирует потенциальных клиентов из Threads: горячий / тёплый / не лид, с оценкой и черновиком захода.",
};

export default function LeadRadarPage() {
  return (
    <>
      <AppHeader badge="LeadRadar" />
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
              LeadRadar — <span className="text-gradient">охота на лидов в Threads</span>
            </h1>
            <p className="mt-4 text-lg text-slate-400">
              Введите ключевое слово или нишу — движок находит людей, которые
              пишут об этом в Threads, и оценивает каждого как лида: горячий,
              тёплый или мимо.
            </p>
          </div>

          <div className="mt-12">
            <LeadRadarTool />
          </div>
        </div>
      </main>
    </>
  );
}
