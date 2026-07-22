import type { Metadata } from "next";
import AppHeader from "@/components/AppHeader";
import InboxZeroTool from "@/components/inboxzero/InboxZeroTool";

export const metadata: Metadata = {
  title: "InboxZero — разбор почты за минуты | AI Integrator",
  description:
    "Вставьте входящее письмо — InboxZero классифицирует его, выделит задачи и подготовит готовый ответ в нужном тоне.",
};

export default function InboxZeroPage() {
  return (
    <>
      <AppHeader badge="InboxZero" />
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
              InboxZero — <span className="text-gradient">почта за 15 минут</span>
            </h1>
            <p className="mt-4 text-lg text-slate-400">
              Вставьте письмо — получите классификацию, суть, задачи из него и
              готовый ответ. 2 часа разбора почты превращаются в 15 минут.
            </p>
          </div>
          <div className="mt-12">
            <InboxZeroTool />
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-slate-600">
            Письма обрабатываются только для генерации ответа и не сохраняются.
          </p>
        </div>
      </main>
    </>
  );
}
