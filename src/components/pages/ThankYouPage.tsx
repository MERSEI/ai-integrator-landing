import Link from "next/link";
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
      <Link href={localePath(locale, "/")} className="btn-primary mt-8">
        {t.cta}
      </Link>
    </main>
  );
}
