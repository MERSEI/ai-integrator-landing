import Image from "next/image";
import EmailForm from "./EmailForm";
import Reveal from "./Reveal";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-gradient-to-br from-dark via-[#151b3d] to-[#2a1b52] pt-16">
      <div
        className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-secondary/20 blur-[120px]"
        aria-hidden="true"
      />

      <div className="container-section grid items-center gap-12 py-16 lg:grid-cols-2">
        <Reveal>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
            🚀 Запуск за 48 часов, без разработчиков
          </p>
          <h1 className="font-heading text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-[52px]">
            Ваш AI-помощник для{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              продаж и привлечения клиентов
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-slate-400">
            15 готовых приложений для автоматизации продаж, маркетинга и
            операционки. Работают за 48 часов без разработчиков.
          </p>
          <div className="mt-8">
            <EmailForm cta="Получить доступ (бесплатно)" source="hero" />
          </div>
          <p className="mt-4 text-sm text-slate-500">
            ✓ Не нужна кредитная карта&nbsp;&nbsp;✓ Первый месяц бесплатно
          </p>
        </Reveal>

        <Reveal delay={0.15} className="relative hidden lg:block">
          <Image
            src="/images/hero.png"
            alt="Предприниматель работает вместе с AI-ассистентом"
            width={720}
            height={405}
            priority
            className="rounded-lg shadow-2xl shadow-primary/20"
          />
        </Reveal>
      </div>
    </section>
  );
}
