import type { Metadata } from "next";
import AppHeader from "@/components/AppHeader";
import CommentHunterTool from "@/components/commenthunter/CommentHunterTool";

export const metadata: Metadata = {
  title: "Comment Hunter — лиды в комментариях под постами | AI Integrator",
  description:
    "Введите тему — Comment Hunter находит популярные посты и вытаскивает горячих лидов из комментариев под ними, с оценкой и готовым ответом.",
};

export default function CommentHunterPage() {
  return (
    <>
      <AppHeader badge="Comment Hunter" />
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
              Comment Hunter —{" "}
              <span className="text-gradient">лиды из комментариев</span>
            </h1>
            <p className="mt-4 text-lg text-slate-400">
              Горячие клиенты часто прячутся не в постах, а в комментариях под
              ними. Введите тему — движок просканирует комментарии и вытащит
              лидов, готовых к контакту.
            </p>
          </div>

          <div className="mt-12">
            <CommentHunterTool />
          </div>
        </div>
      </main>
    </>
  );
}
