import Image from "next/image";
import Reveal from "./Reveal";
import { PROBLEMS } from "@/lib/content";

export default function ProblemsSection() {
  return (
    <section id="problems" className="bg-[#131a33] py-20 sm:py-28">
      <div className="container-section grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <h2 className="section-title">
            Вы теряете клиентов{" "}
            <span className="text-red-400">без автоматизации</span>
          </h2>
          <ul className="mt-8 space-y-4">
            {PROBLEMS.map((problem) => (
              <li key={problem} className="flex items-start gap-3 text-lg">
                <span className="mt-1 text-red-400" aria-hidden="true">
                  ✗
                </span>
                <span className="text-slate-300">{problem}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-lg border border-white/10 bg-dark/60 p-6 text-slate-400">
            <p className="font-semibold text-white">
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
          <Image
            src="/images/problems.png"
            alt="Предприниматель, перегруженный хаосом ручных процессов"
            width={640}
            height={360}
            className="rounded-lg"
            loading="lazy"
          />
        </Reveal>
      </div>
    </section>
  );
}
