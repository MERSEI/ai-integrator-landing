import { FiCheck } from "react-icons/fi";
import Reveal from "./Reveal";
import EmailForm from "./EmailForm";
import { CONTACTS, getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

export default function FinalCTASection({ locale }: { locale: Locale }) {
  const t = getContent(locale).finalCta;

  return (
    <section
      id="final-cta"
      className="relative overflow-hidden bg-dark py-20 [content-visibility:auto] [contain-intrinsic-size:auto_700px] sm:py-28"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />
      <div className="container-section relative flex flex-col items-center text-center">
        <Reveal>
          <h2 className="section-title">{t.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
            {t.subtitle}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-8 flex w-full justify-center">
          <EmailForm locale={locale} cta={t.cta} source="final-cta" />
        </Reveal>

        <Reveal delay={0.2}>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-slate-400">
            {t.trust.map((signal) => (
              <li key={signal} className="flex items-center gap-1.5">
                <FiCheck className="text-success" aria-hidden="true" />
                {signal}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-slate-500">
            {t.contactLead}{" "}
            <a
              href={`https://t.me/${CONTACTS.telegram.replace("@", "")}`}
              className="text-primary-light transition-colors hover:text-white"
            >
              {CONTACTS.telegram}
            </a>{" "}
            · {t.emailLabel}{" "}
            <a
              href={`mailto:${CONTACTS.email}`}
              className="text-primary-light transition-colors hover:text-white"
            >
              {CONTACTS.email}
            </a>{" "}
            · {t.phoneLabel}{" "}
            <a
              href={`tel:${CONTACTS.phone.replace(/\s/g, "")}`}
              className="text-primary-light transition-colors hover:text-white"
            >
              {CONTACTS.phone}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
