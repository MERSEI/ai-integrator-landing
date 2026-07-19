import Image from "next/image";
import EmailForm from "./EmailForm";
import Reveal from "./Reveal";
import { FiCheck } from "react-icons/fi";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-dark pt-16">
      {/* Ambient light blobs */}
      <div
        className="pointer-events-none absolute -top-32 right-[-10%] h-[560px] w-[560px] animate-drift rounded-full bg-primary/25 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[-15%] left-[-8%] h-[460px] w-[460px] animate-drift-alt rounded-full bg-secondary/20 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[320px] w-[320px] animate-drift rounded-full bg-accent/10 blur-[120px]"
        aria-hidden="true"
      />
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]"
        aria-hidden="true"
      />

      <div className="container-section relative grid items-center gap-12 py-16 lg:grid-cols-2">
        <Reveal>
          <p className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-primary-light/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-light backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-success" />
            </span>
            Запуск за 48 часов, без разработчиков
          </p>
          <h1 className="font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[56px]">
            Ваш AI-помощник для{" "}
            <span className="text-gradient">продаж и привлечения клиентов</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-400">
            15 готовых приложений для автоматизации продаж, маркетинга и
            операционки. Работают за 48 часов без разработчиков.
          </p>
          <div className="mt-8">
            <EmailForm cta="Получить доступ (бесплатно)" source="hero" />
          </div>
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
            <li className="flex items-center gap-1.5">
              <FiCheck className="text-success" aria-hidden="true" />
              Не нужна кредитная карта
            </li>
            <li className="flex items-center gap-1.5">
              <FiCheck className="text-success" aria-hidden="true" />
              Первый месяц бесплатно
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.15} className="relative hidden lg:block">
          <div
            className="absolute -inset-6 rounded-xl bg-gradient-to-r from-primary/30 via-secondary/20 to-accent/20 blur-2xl"
            aria-hidden="true"
          />
          <Image
            src="/images/hero.png"
            alt="Предприниматель работает вместе с AI-ассистентом"
            width={720}
            height={405}
            priority
            className="relative rounded-xl border border-white/10 shadow-card"
          />
        </Reveal>
      </div>
    </section>
  );
}
