import Image from "next/image";
import { FiX } from "react-icons/fi";
import Reveal from "./Reveal";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

export default function ProblemsSection({ locale }: { locale: Locale }) {
  const t = getContent(locale).problems;

  return (
    <section id="problems" className="relative overflow-hidden bg-surface py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue/40 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[-10%] top-[-20%] h-[400px] w-[400px] rounded-full bg-white/[0.05] blur-[130px]"
        aria-hidden="true"
      />
      <div className="container-section relative grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <h2 className="section-title">
            {t.titleLead}
            <span className="text-gradient">{t.titleAccent}</span>
          </h2>
          <ul className="mt-8 space-y-4">
            {t.items.map((problem) => (
              <li key={problem} className="flex items-start gap-3 text-lg">
                <span
                  className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-inset ring-white/20"
                  aria-hidden="true"
                >
                  <FiX size={14} />
                </span>
                <span className="text-slate-300">{problem}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 card-glass p-6 text-slate-400">
            <p className="font-heading font-bold text-white">{t.boxTitle}</p>
            <ul className="mt-3 space-y-2 text-base">
              {t.boxItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="relative">
            <div
              className="absolute -inset-4 rounded-xl bg-white/[0.06] blur-2xl"
              aria-hidden="true"
            />
            <Image
              src="/images/problems.jpg"
              alt={t.imageAlt}
              width={1280}
              height={714}
              className="relative rounded-xl border border-white/10 shadow-card"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
