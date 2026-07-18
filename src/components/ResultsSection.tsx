import Image from "next/image";
import Reveal from "./Reveal";
import { TESTIMONIALS, STATS } from "@/lib/content";

export default function ResultsSection() {
  return (
    <section id="results" className="bg-dark py-20 sm:py-28">
      <div className="container-section">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">Реальные результаты наших клиентов</h2>
          <p className="mt-4 flex items-center justify-center gap-2 text-lg text-slate-400">
            <span className="text-warning" aria-hidden="true">
              ★★★★★
            </span>
            4.8/5 средняя оценка
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <figure className="flex h-full flex-col rounded-lg border border-white/10 bg-[#151d38] p-6">
                <blockquote className="flex-1 text-slate-300">
                  «{t.quote}»
                </blockquote>
                <div className="mt-6 rounded-md bg-success/10 px-4 py-2 text-sm font-semibold text-success">
                  {t.result}
                </div>
                <figcaption className="mt-5 flex items-center gap-3">
                  <Image
                    src={t.image}
                    alt={`Портрет: ${t.name}`}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
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

        <div className="mt-16 grid grid-cols-2 gap-8 rounded-lg border border-white/10 bg-[#151d38] p-8 text-center md:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <p className="font-heading text-4xl font-bold text-primary">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
