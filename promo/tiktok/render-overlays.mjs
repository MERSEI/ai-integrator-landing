/**
 * Титры и финальная плашка ролика — рендерятся Chromium'ом в прозрачные PNG
 * 1080x1920, которые assemble.mjs накладывает поверх кадров.
 *
 * Inter берётся из сборки лендинга (.next/static/media) и вшивается в страницу
 * data-URI: так титры набраны ровно тем же шрифтом, что и сайт, без похода в
 * сеть. next/font режет гарнитуру на подмножества (латиница отдельно,
 * кириллица отдельно), поэтому подключаются все файлы как отдельные семейства
 * Inter0…InterN — браузер сам берёт первое, где есть нужный глиф.
 *
 *   node promo/tiktok/render-overlays.mjs
 */
import { chromium } from "playwright";
import { mkdirSync, readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";

const OUT = path.resolve("promo/tiktok/build/overlay");
const W = 1080;
const H = 1920;

const { shots } = JSON.parse(readFileSync("promo/tiktok/shots.json", "utf8"));
mkdirSync(OUT, { recursive: true });

const FONT_DIR = ".next/static/media";
if (!existsSync(FONT_DIR)) {
  throw new Error("нет .next/static/media — сначала `npm run build`, шрифт берётся из сборки");
}
const fontFiles = readdirSync(FONT_DIR).filter((f) => f.endsWith(".woff2"));
const fontFaces = fontFiles
  .map(
    (f, i) =>
      `@font-face{font-family:Inter${i};font-weight:100 900;font-display:block;` +
      `src:url(data:font/woff2;base64,${readFileSync(path.join(FONT_DIR, f)).toString("base64")}) format("woff2")}`,
  )
  .join("\n");
const FONT_STACK = fontFiles.map((_, i) => `Inter${i}`).join(",") + ",system-ui,sans-serif";

// Токены из tailwind.config.ts — ролик обязан читаться как продолжение сайта.
const C = {
  ink: "#F7F8F8",
  muted: "#C9CDD3",
  accent: "#0F7C77",
  accentBright: "#2E9E97",
  bronze: "#B08D57",
  dark: "#08090A",
};

const LOGO_MARK = `
  <svg viewBox="0 0 36 36" width="54" height="54" aria-hidden="true">
    <defs><linearGradient id="m" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#BFBFBF"/>
    </linearGradient></defs>
    <rect width="36" height="36" rx="10" fill="url(#m)"/>
    <g stroke="#0A0A0A" stroke-width="1.5" stroke-linecap="round">
      <line x1="11" y1="25" x2="18.5" y2="11.5" opacity="0.9"/>
      <line x1="18.5" y1="11.5" x2="26" y2="23" opacity="0.9"/>
      <line x1="11" y1="25" x2="26" y2="23" opacity="0.55"/>
    </g>
    <g fill="#0A0A0A">
      <circle cx="11" cy="25" r="2.6"/><circle cx="18.5" cy="11.5" r="2.8"/><circle cx="26" cy="23" r="2.4"/>
    </g>
  </svg>`;

const css = `
  ${fontFaces}

  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${W}px;height:${H}px;background:transparent;overflow:hidden}
  body{font-family:${FONT_STACK};-webkit-font-smoothing:antialiased}

  /* Постоянная марка в левом верхнем углу — вне зон, которые перекрывает
     интерфейс TikTok. */
  .brand{position:absolute;top:96px;left:64px;display:flex;align-items:center;gap:18px;
    padding:14px 26px 14px 16px;border-radius:999px;
    background:rgba(8,9,10,.62);border:1px solid rgba(255,255,255,.10);
    backdrop-filter:blur(12px)}
  .brand span{font-size:30px;font-weight:800;letter-spacing:-.02em;color:${C.ink}}

  /* Затемнение снизу: под титрами всегда оказывается интерфейс лендинга,
     и без подложки текст спорит с его собственными кнопками и карточками. */
  .scrim{position:absolute;left:0;right:0;bottom:0;height:1150px;
    background:linear-gradient(to top, rgba(8,9,10,.92) 0%, rgba(8,9,10,.72) 26%, rgba(8,9,10,.34) 55%, rgba(8,9,10,0) 100%)}

  /* Титры держим выше 470px от низа: там у TikTok подпись и кнопки. */
  .caption{position:absolute;left:64px;right:64px;bottom:520px;
    display:flex;flex-direction:column;align-items:flex-start;gap:14px}
  .line{display:inline-block;padding:10px 24px;border-radius:14px;
    background:rgba(8,9,10,.72);border:1px solid rgba(255,255,255,.08);
    font-size:76px;line-height:1.06;font-weight:800;letter-spacing:-.03em;color:${C.ink};
    text-shadow:0 6px 30px rgba(0,0,0,.85)}
  .line.accent{color:${C.dark};background:${C.accent};border-color:transparent;
    box-shadow:0 10px 40px -12px rgba(15,124,119,.9);color:#fff}
  .line.small{font-size:62px}

  /* Финальная плашка: перекрывает кадр целиком. */
  .endcard{position:absolute;inset:0;display:flex;flex-direction:column;
    align-items:center;justify-content:center;gap:34px;padding:0 80px;text-align:center;
    background:radial-gradient(120% 65% at 50% 32%, rgba(15,124,119,.30) 0%, rgba(8,9,10,.94) 58%, ${C.dark} 100%)}
  .endcard .mark{display:flex;align-items:center;gap:22px}
  .endcard .mark span{font-size:52px;font-weight:800;letter-spacing:-.02em;color:${C.ink}}
  .endcard h1{font-size:104px;line-height:1.02;font-weight:800;letter-spacing:-.035em;color:${C.ink}}
  .endcard h1 em{font-style:normal;color:${C.accentBright}}
  .endcard p{font-size:44px;line-height:1.3;font-weight:500;color:${C.muted};max-width:820px}
  .endcard .cta{margin-top:16px;padding:28px 56px;border-radius:999px;background:${C.accent};
    font-size:50px;font-weight:800;letter-spacing:-.02em;color:#fff;
    box-shadow:0 24px 70px -20px rgba(15,124,119,.95)}
  .endcard .free{font-size:34px;font-weight:600;color:${C.bronze};letter-spacing:.01em}
`;

const brand = `<div class="brand">${LOGO_MARK}<span>AI Integrator</span></div>`;

const captionHtml = (lines) =>
  `<div class="caption">${lines
    .map(
      (l) =>
        `<div class="line${l.accent ? " accent" : ""}${
          l.text.length > 20 ? " small" : ""
        }">${l.text}</div>`,
    )
    .join("")}</div>`;

const endcardHtml = `
  <div class="endcard">
    <div class="mark">${LOGO_MARK}<span>AI Integrator</span></div>
    <h1>15 AI-инструментов<br/>для <em>продаж</em></h1>
    <p>10 из них можно запустить прямо на сайте — бесплатно и без регистрации</p>
    <div class="cta">Ссылка в профиле →</div>
    <div class="free">Запуск за 72 часа · без разработчиков</div>
  </div>`;

const browser = await chromium.launch(
  existsSync("/opt/pw-browsers/chromium")
    ? { executablePath: "/opt/pw-browsers/chromium" }
    : {},
);
const context = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 1,
  locale: "ru-RU",
});
const page = await context.newPage();

async function render(name, body) {
  await page.setContent(`<style>${css}</style><body>${body}</body>`, {
    waitUntil: "load",
  });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, omitBackground: true });
  console.log(`  ✓ ${name}.png`);
}

for (const shot of shots) {
  await render(shot.id, `<div class="scrim"></div>${brand}${captionHtml(shot.caption)}`);
}
await render("endcard", endcardHtml);

await browser.close();
console.log(`\nГотово: ${OUT}`);
