import Reveal from "./Reveal";
import { STEPS } from "@/lib/content";

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-[#131a33] py-20 sm:py-28">
      <div className="container-section">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">Как это работает</h2>
          <p className="mt-4 text-lg text-slate-400">
            Три шага от хаоса к работающей системе
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.12}>
              <div className="relative h-full rounded-lg border border-white/10 bg-dark/60 p-8">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-5xl font-bold text-primary/30">
                    {step.number}
                  </span>
                  <span className="rounded-full bg-secondary/10 px-3 py-1 text-sm font-semibold text-secondary">
                    {step.time}
                  </span>
                </div>
                <h3 className="mt-4 font-heading text-2xl font-bold text-white">
                  {step.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {step.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-slate-400">
                      <span className="mt-0.5 text-success" aria-hidden="true">
                        ✓
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <p className="mx-auto max-w-xl text-xl font-medium text-white">
            Через 48 часов у вас работающий инструмент —{" "}
            <span className="text-primary">без разработчиков, без хаоса.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
