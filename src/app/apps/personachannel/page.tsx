import type { Metadata } from "next";
import AppHeader from "@/components/AppHeader";
import PersonaChannelTool from "@/components/personachannel/PersonaChannelTool";

export const metadata: Metadata = {
  title: "PersonaChannel — контент под вашу персону | AI Integrator",
  description:
    "Опишите канал и аудиторию — PersonaChannel составит портрет персоны и напишет 5 готовых постов, которые удерживают именно её.",
};

export default function PersonaChannelPage() {
  return (
    <>
      <AppHeader badge="PersonaChannel" />
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
              PersonaChannel —{" "}
              <span className="text-gradient">контент под вашу персону</span>
            </h1>
            <p className="mt-4 text-lg text-slate-400">
              Канал удерживает, когда каждый пост попадает в боли конкретной
              персоны. Опишите канал — получите портрет аудитории и 5 готовых
              постов под неё.
            </p>
          </div>
          <div className="mt-12">
            <PersonaChannelTool />
          </div>
        </div>
      </main>
    </>
  );
}
