import type { Metadata } from "next";
import AppHeader from "@/components/AppHeader";
import ProBlock from "@/components/ProBlock";
import ColdMessageTool from "@/components/coldmessage/ColdMessageTool";

export const metadata: Metadata = {
  title: "ColdMessage Pro — персонализация холодных писем | AI Integrator",
  description:
    "Вставьте текст профиля — AI извлечёт контакты, события и интересы и перепишет ваше шаблонное предложение в тёплое персонализированное сообщение.",
};

export default function ColdMessagePage() {
  return (
    <>
      <AppHeader badge="ColdMessage Pro" />
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
              ColdMessage Pro —{" "}
              <span className="text-gradient">персонализация из шаблона</span>
            </h1>
            <p className="mt-4 text-lg text-slate-400">
              Вставьте текст профиля и своё шаблонное предложение. AI извлечёт
              контакты, события и интересы человека и перепишет ваше сообщение
              под него — с правильной зацепкой и подходом.
            </p>
          </div>

          <div className="mt-12">
            <ColdMessageTool />
          </div>

          <ProBlock
            title="ColdMessage PRO — на автопилоте"
            intro="В PRO-версии рутина исчезает: профили собираются и анализируются сами, а лиды подогреваются автоматически:"
            features={[
              "Автосбор данных профилей по ссылке — без ручной вставки",
              "Глубокий анализ активности: посты, комментарии, интересы",
              "Автоматический подогрев: цепочка касаний до готовности к продаже",
              "Массовая персонализация: сотни писем из одной базы контактов",
            ]}
          />

          <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-slate-600">
            Данные профиля обрабатываются только для генерации сообщения и не
            сохраняются. Проверяйте факты перед отправкой.
          </p>
        </div>
      </main>
    </>
  );
}
