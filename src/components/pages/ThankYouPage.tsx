import Link from "next/link";
import TelegramButton from "@/components/TelegramButton";
import { getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";

export default function ThankYouPage({ locale }: { locale: Locale }) {
  const t = getContent(locale).thankYou;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-dark px-4 text-center">
      <div className="text-6xl">🎉</div>
      <h1 className="mt-6 font-heading text-3xl font-bold text-white sm:text-4xl">
        {t.title}
      </h1>
      <p className="mt-4 max-w-md text-lg text-slate-400">{t.subtitle}</p>

      {/* Лид горячее всего именно сейчас — даём написать, не дожидаясь ответа. */}
      <p className="mt-8 text-sm text-slate-400">{t.telegramLead}</p>
      <TelegramButton
        label={t.telegramCta}
        source="thank-you"
        variant="primary"
        className="mt-3"
      />

      <Link
        href={localePath(locale, "/")}
        className="mt-6 text-sm font-medium text-primary-light transition-colors hover:text-white"
      >
        {t.cta}
      </Link>
    </main>
  );
}
