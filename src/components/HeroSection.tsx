import EmailForm from "./EmailForm";
import TypewriterHeading from "./TypewriterHeading";
import { FiCheck } from "react-icons/fi";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-dark pt-[72px]">
      {/* Video background — портретный кадр на мобильных, широкий на десктопе */}
      <video
        className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
        poster="/images/hero.png"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source media="(max-width: 767px)" src="/videos/hero-bg-mobile.mp4" type="video/mp4" />
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>
      {/* Readability overlays */}
      <div
        className="absolute inset-0 bg-dark/60"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/30 to-dark"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-32 right-[-10%] h-[560px] w-[560px] animate-drift rounded-full bg-white/[0.06] blur-[140px]"
        aria-hidden="true"
      />

      <div className="container-section relative flex flex-col items-center py-16 text-center">
        <p className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-primary-light/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary-light backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-success" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          Запуск за 48 часов, без разработчиков
        </p>
        <div className="rounded-3xl border border-white/10 bg-black/30 px-6 py-8 shadow-card backdrop-blur-md sm:px-10 sm:py-10">
          <TypewriterHeading
            className="mx-auto max-w-4xl font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.7)] sm:text-5xl lg:text-[60px]"
            segments={[
              { text: "Ваш AI-маркетплейс для " },
              {
                text: "продаж и привлечения клиентов",
                className: "text-gradient",
              },
            ]}
          />
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-200 [text-shadow:0_1px_12px_rgba(0,0,0,0.8)]">
            15 готовых приложений для автоматизации продаж, маркетинга и
            операционки. Работают за 48 часов без разработчиков.
          </p>
        </div>

        <div className="mt-8 flex w-full justify-center">
          <EmailForm cta="Получить доступ (бесплатно)" source="hero" />
        </div>

        <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
          <li className="flex items-center gap-1.5">
            <FiCheck className="text-success" aria-hidden="true" />
            Не нужна кредитная карта
          </li>
          <li className="flex items-center gap-1.5">
            <FiCheck className="text-success" aria-hidden="true" />
            Первый месяц бесплатно
          </li>
        </ul>
      </div>
    </section>
  );
}
