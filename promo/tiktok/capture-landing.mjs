/**
 * Съёмка вставок с лендинга для тикток-ролика.
 *
 * Кадры снимаются мобильным вьюпортом 360x640 при deviceScaleFactor 3 — это
 * ровно 1080x1920 на выходе, то есть тикток-формат без апскейла. Каждая
 * вставка снимается «с запасом» по высоте: assemble.mjs потом протягивает по
 * ней кроп 1080x1920 сверху вниз, и получается живой скролл вместо статики.
 *
 *   node promo/tiktok/capture-landing.mjs [--base http://localhost:3000]
 */
import { chromium } from "playwright";
import { mkdirSync, existsSync } from "node:fs";
import path from "node:path";

const BASE = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://localhost:3000";
const OUT = path.resolve("promo/tiktok/build/landing");
const CSS_W = 360;
const CSS_H = 640;
const DSF = 3;

mkdirSync(OUT, { recursive: true });

/** Прокрутка всей страницы: Reveal-блоки стоят на whileInView + once, поэтому
 *  без прохода сверху вниз половина секций осталась бы с opacity 0. */
async function primeReveals(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });
}

/** Снимок полосы страницы высотой heightCss, начиная с точки anchor.
 *
 *  Полоса снимается не через fullPage+clip, а расширением самого вьюпорта до
 *  нужной высоты: при fullPage Chromium перерисовывает страницу в один
 *  гигантский вьюпорт, и Reveal-блоки (framer-motion, whileInView) в нижней
 *  части лендинга остаются с opacity 0 — секция уезжает в кадр пустой. */
async function strip(page, { name, anchor, offset = 0, heightCss = 1000, hideHeader = true }) {
  if (hideHeader) {
    // Липкая шапка в высокой полосе висит поверх контента; в hero она нужна.
    await page.addStyleTag({ content: "header{display:none!important}" });
  }

  await page.setViewportSize({ width: CSS_W, height: heightCss });

  // Прокрутка с перепроверкой: картинки и фоновое видео догружаются уже после
  // первого scrollTo и сдвигают вёрстку — один заход промахивается мимо
  // секции на пол-экрана. Повторяем, пока позиция не перестанет меняться.
  for (let i = 0; i < 8; i += 1) {
    const drift = await page.evaluate(
      ([sel, off]) => {
        if (sel === "top") {
          window.scrollTo(0, 0);
          return 0;
        }
        const el = document.querySelector(sel);
        if (!el) throw new Error(`не найден селектор ${sel}`);
        const target = el.getBoundingClientRect().top + window.scrollY + off;
        const delta = Math.abs(target - window.scrollY);
        window.scrollTo(0, target);
        return delta;
      },
      [anchor, offset],
    );
    await page.waitForTimeout(400);
    if (drift < 2) break;
  }
  // Пауза на догрузку фонового видео/картинок и на отработку Reveal.
  await page.waitForTimeout(1200);

  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file });
  await page.setViewportSize({ width: CSS_W, height: CSS_H });
  console.log(`  ✓ ${name}.png  → ${CSS_W * DSF}x${heightCss * DSF}px`);
}

const MOCK_COLDMESSAGE = {
  contacts: [
    { type: "Telegram", value: "@anton_kravets" },
    { type: "LinkedIn", value: "linkedin.com/in/anton-kravets" },
  ],
  signals: [
    { category: "Боль", detail: "Пишет про когортный анализ — значит, считает удержание и упирается в него" },
    { category: "Событие", detail: "Выступал на SaaS Nova с докладом про удержание" },
    { category: "Роль", detail: "Head of Growth: решение по пилоту может принять сам" },
  ],
  approach:
    "Зайти через его же тему — удержание в SaaS для логистики — и предложить не «сервис рассылок», а один измеримый пилот на его данных.",
  subject: "После SaaS Nova — про удержание",
  message:
    "Антон, послушал ваш доклад с SaaS Nova про удержание — забрал мысль про когорты по первому месяцу.\n\nВы там говорили, что рост упирается не в трафик, а в то, доходит ли клиент до ценности. У нас ровно про это: AI разбирает профиль клиента и пишет первое касание под него, а не по шаблону — на логистическом SaaS это давало кратный рост ответов.\n\nПокажу на ваших данных за 15 минут, без презентаций. Скинуть пример письма под вашу базу?",
};

const clips = {
  /** Первый экран: заголовок, CTA, фоновое видео. */
  async hero(page) {
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    await strip(page, { name: "hero", anchor: "top", heightCss: 980, hideHeader: false });
  },

  /** Сетка приложений — доказательство «15 инструментов, 10 живые». */
  async apps(page) {
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await primeReveals(page);
    await strip(page, { name: "apps", anchor: "#features h2", offset: -80, heightCss: 1000 });
  },

  /** Живой инструмент: заполняем пример и показываем готовое письмо.
   *  Без GEMINI_API_KEY ответ подменяется моком — визуал тот же, что у
   *  настоящего прогона; с ключом в окружении запрос уходит на сервер. */
  async tool(page) {
    const live = Boolean(process.env.GEMINI_API_KEY);
    if (!live) {
      await page.route("**/api/coldmessage", async (route) => {
        await new Promise((r) => setTimeout(r, 600));
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(MOCK_COLDMESSAGE),
        });
      });
    }
    await page.goto(`${BASE}/apps/coldmessage`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await page.getByRole("button", { name: "Заполнить примером" }).click();
    await page.waitForTimeout(400);
    await page.getByRole("button", { name: /Сгенерировать письмо/ }).click();
    await page.waitForSelector("text=Марина", { timeout: 30_000 }).catch(() => {});
    await page.waitForTimeout(1500);
    await primeReveals(page);
    await strip(page, { name: "tool", anchor: "textarea#profile", offset: 480, heightCss: 1100 });
  },

  /** Финальный экран с призывом. */
  async cta(page) {
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await primeReveals(page);
    await strip(page, { name: "cta", anchor: "#final-cta", offset: -30, heightCss: 940 });
  },
};

// В окружении может стоять предустановленный Chromium другой сборки, чем ждёт
// пакет playwright, — берём его явно (PW_CHROMIUM_PATH или /opt/pw-browsers).
const CHROMIUM_PATH = process.env.PW_CHROMIUM_PATH ?? "/opt/pw-browsers/chromium";
const browser = await chromium.launch(
  existsSync(CHROMIUM_PATH) ? { executablePath: CHROMIUM_PATH } : {},
);
const context = await browser.newContext({
  viewport: { width: CSS_W, height: CSS_H },
  deviceScaleFactor: DSF,
  isMobile: true,
  hasTouch: true,
  locale: "ru-RU",
  colorScheme: "dark",
  reducedMotion: "no-preference",
});
const page = await context.newPage();

for (const [name, run] of Object.entries(clips)) {
  console.log(`▶ ${name}`);
  await run(page);
}

await browser.close();
console.log(`\nГотово: ${OUT}`);
