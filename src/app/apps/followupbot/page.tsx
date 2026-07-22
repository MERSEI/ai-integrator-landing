import type { Metadata } from "next";
import AppHeader from "@/components/AppHeader";
import FollowUpBotTool from "@/components/followupbot/FollowUpBotTool";

export const metadata: Metadata = {
  title: "FollowUpBot — цепочки дожима лидов | AI Integrator",
  description:
    "Опишите, на чём завис разговор с клиентом — FollowUpBot составит цепочку из 3 follow-up сообщений с разными углами захода.",
};

export default function FollowUpBotPage() {
  return (
    <>
      <AppHeader badge="FollowUpBot" />
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
              FollowUpBot — <span className="text-gradient">дожим без давления</span>
            </h1>
            <p className="mt-4 text-lg text-slate-400">
              Половина сделок умирает от того, что продавец не напомнил о себе.
              Опишите ситуацию — получите цепочку из 3 сообщений с разными
              углами.
            </p>
          </div>
          <div className="mt-12">
            <FollowUpBotTool />
          </div>
        </div>
      </main>
    </>
  );
}
