import { getContent } from "@/lib/content";
import type { AppPageId } from "@/lib/content/types";
import { localePath, type Locale } from "@/lib/i18n";
import TelegramButton from "./TelegramButton";
import { FiCheck, TbBolt } from "./icons";

/**
 * Блок «что в PRO-версии» для страниц приложений. У кого есть PRO-апселл,
 * раньше не было прямого пути в Telegram — только форма после клика на
 * «Подключить PRO». Кнопка рядом даёт короткий путь тем, кто хочет спросить,
 * а не сразу оставлять заявку.
 */
export default function ProBlock({
  locale,
  id,
  title,
  intro,
  features,
}: {
  locale: Locale;
  id: AppPageId;
  title: string;
  intro: string;
  features: string[];
}) {
  const t = getContent(locale).pro;
  const telegramCta = getContent(locale).demoConvert.telegramCta;

  return (
    <div className="mx-auto mt-12 max-w-3xl rounded-lg bg-gradient-to-b from-primary/15 to-transparent p-px shadow-glow-sm">
      <div className="rounded-[15px] bg-surface-2 p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <TbBolt size={20} className="text-primary-light" aria-hidden="true" />
          <h3 className="font-heading text-lg font-bold text-white">{title}</h3>
        </div>
        <p className="mt-3 text-slate-400">{intro}</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
              <FiCheck className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
          <a href={`${localePath(locale, "/")}#final-cta`} className="btn-primary">
            {t.cta}
          </a>
          <TelegramButton label={telegramCta} source={`pro-${id}`} />
        </div>
      </div>
    </div>
  );
}
