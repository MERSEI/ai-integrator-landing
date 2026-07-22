import { FiCheck } from "react-icons/fi";
import Reveal from "./Reveal";
import { STEPS } from "@/lib/content";

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-dark py-20 sm:py-28">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-white/[0.04] blur-[140px]"
        aria-hidden="true"
      />
      <div className="container-section relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">Как это работает</h2>
          <p className="mt-4 text-lg text-slate-400">
            Три шага от хаоса к работающей системе
          </p>
        </Reveal>

        <div className="relative mt-14 grid gap-8 md:grid-cols-3">
          <div
            className="absolute left-[16%] right-[16%] top-14 hidden h-px bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 md:block"
            aria-hidden="true"
          />
          {STEPS.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.12}>
              <div className="relative h-full card-glass p-8 transition-all duration-300 ease-premium hover:border-primary-light/30">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-5xl font-extrabold text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.4)]">
                    {step.number}
                  </span>
                  <span className="rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-sm font-semibold text-primary-light">
                    {step.time}
                  </span>
                </div>
                <h3 className="mt-4 font-heading text-2xl font-bold tracking-tight text-white">
                  {step.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {step.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-slate-400">
                      <span
                        className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success"
                        aria-hidden="true"
                      >
                        <FiCheck size={12} />
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
          <p className="mx-auto max-w-xl font-heading text-xl font-bold tracking-tight text-white">
            Через 48 часов у вас работающий инструмент —{" "}
            <span className="text-gradient">без разработчиков, без хаоса.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
