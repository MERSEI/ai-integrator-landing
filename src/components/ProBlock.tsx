import { getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { FiCheck, TbBolt } from "./icons";

/** Блок «что в PRO-версии» для страниц приложений. */
export default function ProBlock({
  locale,
  title,
  intro,
  features,
}: {
  locale: Locale;
  title: string;
  intro: string;
  features: string[];
}) {
  const t = getContent(locale).pro;

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
        <a href={`${localePath(locale, "/")}#final-cta`} className="btn-primary mt-6">
          {t.cta}
        </a>
      </div>
    </div>
  );
}
