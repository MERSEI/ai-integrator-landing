import { FiCheck } from "react-icons/fi";
import Reveal from "./Reveal";
import EmailForm from "./EmailForm";
import { CONTACTS } from "@/lib/content";

const TRUST_SIGNALS = [
  "Не нужна кредитная карта",
  "Результаты за 48 часов гарантированы",
  "Первый месяц бесплатно",
];

export default function FinalCTASection() {
  return (
    <section
      id="final-cta"
      className="relative overflow-hidden bg-dark py-20 sm:py-28"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-[-30%] h-[420px] w-[720px] -translate-x-1/2 animate-drift rounded-full bg-white/[0.07] blur-[150px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[-40%] right-[10%] h-[320px] w-[320px] animate-drift-alt rounded-full bg-white/[0.04] blur-[130px]"
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
            {TRUST_SIGNALS.map((signal) => (
              <li key={signal} className="flex items-center gap-1.5">
                <FiCheck className="text-success" aria-hidden="true" />
                {signal}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-slate-500">
            Или напишите нам: Telegram{" "}
            <a
              href={`https://t.me/${CONTACTS.telegram.replace("@", "")}`}
              className="text-primary-light transition-colors hover:text-white"
            >
              {CONTACTS.telegram}
            </a>{" "}
            · Email{" "}
            <a
              href={`mailto:${CONTACTS.email}`}
              className="text-primary-light transition-colors hover:text-white"
            >
              {CONTACTS.email}
            </a>{" "}
            · Телефон{" "}
            <a
              href={`tel:${CONTACTS.phone.replace(/\s/g, "")}`}
              className="text-primary-light transition-colors hover:text-white"
            >
              {CONTACTS.phone}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
