import Reveal from "./Reveal";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import OverloadScene from "./art/OverloadScene";
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

          {/* Все каналы сходятся на одном человеке, часть висит неразобранной,
              один лид уходит вниз мимо. */}
          <Reveal delay={0.12}>
            <OverloadScene className="mx-auto block w-full max-w-[20rem] sm:max-w-md" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
