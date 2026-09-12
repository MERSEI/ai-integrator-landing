import Image from "next/image";
import Reveal from "./Reveal";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { FiSlash, FiX } from "./icons";

export default function ProblemsSection({ locale }: { locale: Locale }) {
  const t = getContent(locale).problems;

  return (
    <section
      id="problems"
      className="relative overflow-hidden bg-surface py-20 [content-visibility:auto] [contain-intrinsic-size:auto_900px] sm:py-28"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />
      <div className="container-section relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">
            {t.titleLead}
            <span className="text-gradient">{t.titleAccent}</span>
          </h2>
        </Reveal>

        {/* Слева — вся мысль текстом: что болит и почему обходные пути не
            спасают. Справа — она же картинкой. Иллюстрация вынесена в свою
            колонку и центрируется: если поставить её над блоком, левая колонка
            заканчивается на середине и внизу остаётся дыра. */}
        <div className="mt-12 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-12">
          <Reveal className="space-y-6">
            <ul className="space-y-3">
              {t.items.map((problem) => (
                <li
                  key={problem}
                  className="flex items-start gap-3 card-glass p-4"
                >
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-secondary ring-1 ring-inset ring-white/10"
                    aria-hidden="true"
                  >
                    <FiX size={13} />
                  </span>
                  <span className="text-primary-light">{problem}</span>
                </li>
              ))}
            </ul>

            <div className="card-glass p-6">
              <p className="font-heading font-semibold tracking-tight text-primary">
                {t.boxTitle}
              </p>
              <ul className="mt-5 space-y-4">
                {t.boxItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-warning/10 text-warning ring-1 ring-inset ring-warning/20"
                      aria-hidden="true"
                    >
                      <FiSlash size={12} />
                    </span>
                    <span className="text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Стеклянная воронка теряет часть потока — то же, что и текстом
              слева, но кинематографичным кадром в премиальном 3D-стиле
              (Higgsfield), в общей визуальной подаче с первым экраном. */}
          <Reveal delay={0.12}>
            <div className="relative mx-auto aspect-[16/10] w-full max-w-md overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_70px_-18px_rgba(79,70,229,0.4)]">
              <Image
                src="/images/loss-funnel.webp"
                alt=""
                fill
                sizes="(min-width: 1024px) 28rem, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
