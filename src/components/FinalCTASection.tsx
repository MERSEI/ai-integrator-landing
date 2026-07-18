import Reveal from "./Reveal";
import EmailForm from "./EmailForm";
import { CONTACTS } from "@/lib/content";

export default function FinalCTASection() {
  return (
    <section
      id="final-cta"
      className="relative overflow-hidden bg-gradient-to-br from-[#1b1f4b] via-[#241a52] to-dark py-20 sm:py-28"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"
        aria-hidden="true"
      />
      <div className="container-section relative flex flex-col items-center text-center">
        <Reveal>
          <h2 className="section-title">Начни автоматизировать прямо сейчас</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
            Присоединись к 50+ компаниям, которые уже используют AI Integrator
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-8 flex w-full justify-center">
          <EmailForm cta="Получить бесплатный audit →" source="final-cta" />
        </Reveal>

        <Reveal delay={0.2}>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-slate-400">
            <li>✓ Не нужна кредитная карта</li>
            <li>✓ Результаты за 48 часов гарантированы</li>
            <li>✓ Первый месяц бесплатно</li>
          </ul>
          <p className="mt-6 text-sm text-slate-500">
            Или напишите нам: Telegram{" "}
            <a
              href={`https://t.me/${CONTACTS.telegram.replace("@", "")}`}
              className="text-primary hover:underline"
            >
              {CONTACTS.telegram}
            </a>{" "}
            · Email{" "}
            <a href={`mailto:${CONTACTS.email}`} className="text-primary hover:underline">
              {CONTACTS.email}
            </a>{" "}
            · Телефон{" "}
            <a
              href={`tel:${CONTACTS.phone.replace(/\s/g, "")}`}
              className="text-primary hover:underline"
            >
              {CONTACTS.phone}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
