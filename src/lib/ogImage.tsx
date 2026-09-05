import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

/**
 * Превью для соцсетей и мессенджеров.
 *
 * Раньше в og:image стоял сток-снимок фиолетового дыма: он не показывал ни
 * продукт, ни название, а после смены палитры ещё и спорил с ней цветом.
 * Здесь картинка собирается из того же словаря, что и страница, — заголовок и
 * факты в превью не могут разойтись с сайтом, а перерисовывать PNG при смене
 * копирайта не нужно.
 *
 * Шрифт лежит в репозитории подмножеством на латиницу и кириллицу (50 КБ на
 * начертание вместо 400): сборке нельзя ходить в сеть за файлом, от которого
 * зависит результат. Inter под OFL, текст лицензии — рядом со шрифтами.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const FONT_DIR = join(process.cwd(), "assets", "fonts");

async function fonts() {
  const [regular, semibold] = await Promise.all([
    readFile(join(FONT_DIR, "Inter-Regular-subset.ttf")),
    readFile(join(FONT_DIR, "Inter-SemiBold-subset.ttf")),
  ]);
  return [
    { name: "Inter", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Inter", data: semibold, weight: 600 as const, style: "normal" as const },
  ];
}

export async function ogImage(locale: Locale) {
  const content = getContent(locale);
  // Берём короткие факты: длинный первый пункт в плашку одной строкой не влезает.
  const facts = content.trustBar.items.slice(1, 4);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#020617",
          // Те же свечения, что на лендинге: indigo сверху, emerald снизу.
          backgroundImage:
            "radial-gradient(950px 560px at 8% -12%, rgba(79,70,229,0.55), transparent 62%), radial-gradient(760px 520px at 108% 118%, rgba(16,185,129,0.34), transparent 62%)",
          fontFamily: "Inter",
          color: "#F7F8F8",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg width="46" height="46" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="11" fill="#F7F8F8" />
            <path d="M20 10.5 28.5 27h-4.3L20 18.6 15.8 27h-4.3z" fill="#020617" />
            <circle cx="20" cy="24.5" r="2.6" fill="#4F46E5" />
          </svg>
          <span style={{ marginLeft: 18, fontSize: 30, fontWeight: 600 }}>
            AI Integrator
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 62,
              fontWeight: 600,
              lineHeight: 1.12,
              letterSpacing: -1.6,
              maxWidth: 1000,
            }}
          >
            {content.hero.headingLead}
            {content.hero.headingAccent}
          </span>
          <span
            style={{
              marginTop: 22,
              fontSize: 28,
              lineHeight: 1.4,
              color: "#C9CDD3",
              maxWidth: 900,
            }}
          >
            {content.hero.subtitle}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          {facts.map((fact, i) => (
            <div
              key={fact}
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: 16,
                padding: "11px 20px",
                borderRadius: 999,
                border: "1px solid rgba(129,140,248,0.4)",
                backgroundColor: "rgba(79,70,229,0.16)",
                fontSize: 22,
                color: "#C9CDD3",
                whiteSpace: "nowrap",
              }}
            >
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 999,
                  marginRight: 11,
                  backgroundColor: i === 0 ? "#10B981" : "#818CF8",
                }}
              />
              {fact}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}
