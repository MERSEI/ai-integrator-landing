import Image from "next/image";
import { FiX } from "react-icons/fi";
import Reveal from "./Reveal";
import { PROBLEMS } from "@/lib/content";

export default function ProblemsSection() {
  return (
    <section id="problems" className="relative overflow-hidden bg-surface py-20 sm:py-28">
      <div
        className="pointer-events-none absolute right-[-10%] top-[-20%] h-[400px] w-[400px] rounded-full bg-accent/10 blur-[130px]"
        aria-hidden="true"
      />
      <div className="container-section relative grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <h2 className="section-title">
            Вы теряете клиентов{" "}
            <span className="bg-gradient-to-r from-rose-400 to-accent bg-clip-text text-transparent">
              без автоматизации
            </span>
          </h2>
          <ul className="mt-8 space-y-4">
            {PROBLEMS.map((problem) => (
              <li key={problem} className="flex items-start gap-3 text-lg">
                <span
                  className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-400 ring-1 ring-inset ring-rose-500/25"
                  aria-hidden="true"
                >
                  <FiX size={14} />
                </span>
                <span className="text-slate-300">{problem}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 card-glass p-6 text-slate-400">
            <p className="font-heading font-bold text-white">
              Большинству нужны инструменты, но:
            </p>
            <ul className="mt-3 space-y-2 text-base">
              <li>— Zapier/Make слишком сложные (нужен разработчик)</li>
              <li>— HubSpot дорогой (от $45/месяц за место)</li>
              <li>— Кустарные решения не масштабируются</li>
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="relative">
            <div
              className="absolute -inset-4 rounded-xl bg-rose-500/10 blur-2xl"
              aria-hidden="true"
            />
            <Image
              src="/images/problems.png"
              alt="Предприниматель, перегруженный хаосом ручных процессов"
              width={640}
              height={360}
              className="relative rounded-xl border border-white/10 shadow-card"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
