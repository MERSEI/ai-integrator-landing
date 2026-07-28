import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";
import { SITE_URL } from "@/lib/layout";
import { localePath, LOCALES } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Список страниц одинаков для обоих языков — берём пути из русского словаря.
  const appPaths = [...getContent("ru").featuredApps, ...getContent("ru").standaloneApps]
    .map((app) => app.href)
    .filter((href): href is string => Boolean(href));

  return LOCALES.flatMap((locale) => [
    {
      url: `${SITE_URL}${localePath(locale, "/")}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...appPaths.map((path) => ({
      url: `${SITE_URL}${localePath(locale, path)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]);
}
