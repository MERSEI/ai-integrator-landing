"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import Reveal from "./Reveal";
import TypewriterText from "./TypewriterText";
import { STEPS } from "@/lib/content";

const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;

export default function HowItWorksSection() {
  const reduced = useReducedMotion();

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-dark py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue/40 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-white/[0.04] blur-[140px]"
        aria-hidden="true"
      />
      <div className="container-section relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">
            <TypewriterText text="Как это работает" />
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            <TypewriterText
              text="Три шага от хаоса к работающей системе"
              speed={28}
              delay={700}
              cursor={false}
            />
          </p>
        </Reveal>

        <motion.div
          className="relative mt-14 grid gap-8 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.18, delayChildren: 0.2 } },
          }}
        >
          <motion.div
            className="absolute left-[16%] right-[16%] top-14 hidden h-px origin-left bg-gradient-to-r from-primary/0 via-accent-blue/50 to-primary/0 md:block"
            aria-hidden="true"
            variants={{
              hidden: { scaleX: 0, opacity: 0 },
              visible: {
                scaleX: 1,
                opacity: 1,
                transition: { duration: 1.1, ease: EASE_PREMIUM },
              },
            }}
          />
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              variants={{
                hidden: reduced ? { opacity: 0 } : { opacity: 0, x: -56 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.7, ease: EASE_PREMIUM },
                },
              }}
            >
              <div className="relative h-full card-glass p-8 transition-all duration-300 ease-premium hover:-translate-y-1 hover:border-accent-blue/50 hover:shadow-glow-accent-sm">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-5xl font-extrabold text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.4)]">
                    {step.number}
                  </span>
                  <span className="rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-sm font-semibold text-primary-light">
                    {step.time}
                  </span>
                </div>
                <h3 className="mt-4 font-heading text-2xl font-bold tracking-tight text-white">
                  <TypewriterText
                    text={step.title}
                    speed={55}
                    delay={500 + i * 320}
                    cursor={false}
                  />
                </h3>

                {/* Иллюстрации светлые — маска растворяет края в тёмной карточке. */}
                <Image
                  src={step.image}
                  alt={step.imageAlt}
                  width={960}
                  height={536}
                  className="mt-5 w-full rounded-lg [mask-image:radial-gradient(ellipse_at_center,black_58%,transparent_94%)]"
                  loading="lazy"
                />
                <ul className="mt-4 space-y-3">
                  {step.points.map((point, j) => (
                    <motion.li
                      key={point}
                      className="flex items-start gap-2.5 text-slate-400"
                      initial={reduced ? { opacity: 0 } : { opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{
                        duration: 0.5,
                        delay: 0.6 + i * 0.18 + j * 0.1,
                        ease: EASE_PREMIUM,
                      }}
                    >
                      <span
                        className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success"
                        aria-hidden="true"
                      >
                        <FiCheck size={12} />
                      </span>
                      {point}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <Reveal className="mt-12 text-center">
          <p className="mx-auto max-w-xl font-heading text-xl font-bold tracking-tight text-white">
            Через 72 часа у вас работающий инструмент —{" "}
            <span className="text-gradient">без разработчиков, без хаоса.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
