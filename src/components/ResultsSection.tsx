import Image from "next/image";
import { FiStar } from "react-icons/fi";
import Reveal from "./Reveal";
import StatCounter from "./StatCounter";
import { TESTIMONIALS, STATS } from "@/lib/content";

export default function ResultsSection() {
  return (
    <section id="results" className="relative overflow-hidden bg-surface py-20 sm:py-28">
      <div
        className="pointer-events-none absolute bottom-[-25%] left-[-8%] h-[420px] w-[420px] rounded-full bg-primary/10 blur-[140px]"
        aria-hidden="true"
      />
      <div className="container-section relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">Реальные результаты наших клиентов</h2>
          <p className="mt-4 flex items-center justify-center gap-2 text-lg text-slate-400">
            <span className="flex gap-0.5 text-warning" aria-label="Оценка 4.8 из 5">
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar key={i} size={18} fill="currentColor" aria-hidden="true" />
              ))}
            </span>
            4.8/5 средняя оценка
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <figure className="flex h-full flex-col card-glass p-6 transition-all duration-300 ease-premium hover:-translate-y-1 hover:border-primary-light/30">
                <blockquote className="flex-1 leading-relaxed text-slate-300">
                  «{t.quote}»
                </blockquote>
                <div className="chip-result mt-6 w-full justify-center py-2">
                  {t.result}
                </div>
                <figcaption className="mt-5 flex items-center gap-3">
                  <Image
                    src={t.image}
                    alt={`Портрет: ${t.name}`}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full border border-white/10 object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-semibold text-white">{t.name}</p>
                    <p className="text-sm text-slate-500">{t.company}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8 card-glass p-8 text-center md:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <p className="font-heading text-4xl font-extrabold tracking-tight text-gradient">
                <StatCounter value={stat.value} />
              </p>
              <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
