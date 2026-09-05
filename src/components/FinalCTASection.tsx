import Reveal from "./Reveal";
import CtaTabs from "./CtaTabs";
import TelegramButton from "./TelegramButton";
import { CONTACTS, getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { FiCheck } from "./icons";

export default function FinalCTASection({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const t = content.finalCta;
  const b = content.booking;
  const telegramUrl = `https://t.me/${CONTACTS.telegram.replace("@", "")}`;

  return (
    <section
      id="final-cta"
      className="relative overflow-hidden bg-dark py-20 [content-visibility:auto] [contain-intrinsic-size:auto_900px] sm:py-28"
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
          <CtaTabs locale={locale} cta={t.cta} source="final-cta" />
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
        </Reveal>

        {/* Прямой канал для тех, кому форма — лишний шаг: обещание ответа держим явным.
            Ссылка идёт через TelegramButton — иначе клик не отличить от ухода со страницы. */}
        <Reveal delay={0.25} className="mt-10 w-full">
          <div className="card-glass mx-auto flex w-full max-w-3xl flex-col items-center gap-4 p-5 text-center sm:flex-row sm:justify-between sm:p-6 sm:text-left">
            <div>
              <p className="font-heading text-base font-medium text-primary">
                {b.telegramTitle}
              </p>
              <p className="mt-1 text-sm text-secondary">{b.telegramText}</p>
            </div>
            <TelegramButton
              label={b.telegramCta}
              source="final-cta"
              className="w-full shrink-0 sm:w-auto"
            />
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mt-6 text-sm text-secondary">
            {t.contactLead}{" "}
            <a
              href={telegramUrl}
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
