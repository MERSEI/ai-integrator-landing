import type { Metadata } from "next";
import AppHeader from "@/components/AppHeader";
import ProBlock from "@/components/ProBlock";
import ObjectionKillerTool from "@/components/objectionkiller/ObjectionKillerTool";

export const metadata: Metadata = {
  title: "ObjectionKiller — работа с возражениями клиентов | AI Integrator",
  description:
    "Опишите ситуацию и возражение клиента. AI уточнит контекст, вскроет истинную причину и даст готовые тактики ответа с формулировками.",
};

export default function ObjectionKillerPage() {
  return (
    <>
      <AppHeader badge="ObjectionKiller" />
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
              ObjectionKiller —{" "}
              <span className="text-gradient">закрытие возражений</span>
            </h1>
            <p className="mt-4 text-lg text-slate-400">
              Опишите ситуацию с клиентом и возражение. Ассистент уточнит детали,
              вскроет истинную причину и подскажет, как ответить — с готовыми
              формулировками.
            </p>
          </div>

          <div className="mt-12">
            <ObjectionKillerTool />
          </div>

          <ProBlock
            title="ObjectionKiller PRO — режим тренировок"
            intro="В PRO-версии ассистент превращается в спарринг-партнёра: он играет вашего клиента, а вы тренируетесь закрывать возражения:"
            features={[
              "Текстовый спарринг: AI-клиент с характером и реальными возражениями вашей ниши",
              "Голосовой режим: отвечаете вслух — как на реальном звонке",
              "Разбор после раунда: что сказали хорошо, где потеряли сделку",
              "Библиотека сценариев под вашу нишу и продукт",
            ]}
          />

          <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-slate-600">
            Ответы — рекомендации, а не гарантия сделки. Адаптируйте формулировки
            под свой стиль и клиента.
          </p>
        </div>
      </main>
    </>
  );
}
