"use client";

import { getContent } from "@/lib/content";
import type { AppPageId } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n";
import { trackEvent } from "@/lib/gtag";
import { FiCheck, TbBrandGithub } from "./icons";

/**
 * Тело страницы для реальных продуктов без демо в браузере (десктоп,
 * self-hosted сервис): список возможностей и ссылка на рабочий код вместо
 * формы — здесь нечего "попробовать", кроме самого репозитория.
 */
export default function ExternalAppShowcase({
  locale,
  id,
}: {
  locale: Locale;
  id: AppPageId;
}) {
  const t = getContent(locale).appPages[id].external;
  if (!t) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="card-glass p-6 sm:p-8">
        <ul className="space-y-3">
          {t.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-300">
              <FiCheck className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>
        <a
          href={t.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("github_click", { source: id })}
          className="btn-primary mt-6 w-full sm:w-auto"
        >
          <TbBrandGithub size={18} aria-hidden="true" />
          {t.cta}
        </a>
      </div>
    </div>
  );
}
