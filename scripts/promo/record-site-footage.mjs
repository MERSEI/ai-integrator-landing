import { chromium } from 'playwright';
const OUT = `${process.env.PROMO_DIR || 'promo-build'}/footage`;
const BASE = 'http://localhost:3000';
const VP = { width: 540, height: 960 };
const REC = { width: 1080, height: 1920 };

const MOCK = {
  niche: 'доставка здоровой еды',
  prospects: [
    { handle: '@kate_runs_msk', competitor: '@fitfood_delivery', question: 'А у вас есть безглютеновое меню? У текущей доставки третью неделю одно и то же, уже не могу.', score: 92, tier: 'hot', reason: 'Прямо ищет альтернативу и называет боль — готов слушать предложение сегодня.', dm: 'Катя, привет! Увидел ваш вопрос про безглютеновое меню — у нас оно отдельной линейкой, меню меняется каждую неделю. Скинуть на посмотреть?' },
    { handle: '@dmitry.pro', competitor: '@fitfood_delivery', question: 'Сколько стоит недельный рацион на 1800 ккал? В личку не отвечают уже два дня.', score: 88, tier: 'hot', reason: 'Спрашивал цену и не получил ответа — перехват на низком трении.', dm: 'Дмитрий, добрый день! Рацион на 1800 ккал — 6 900 ₽ в неделю, доставка включена. Могу прислать раскладку по дням.' },
    { handle: '@olga_wellness', competitor: '@healthy_box', question: 'Доставляете в Химки? И можно ли пропускать дни, если уезжаю?', score: 81, tier: 'hot', reason: 'Уточняет логистику — это последняя миля перед покупкой.', dm: 'Ольга, здравствуйте! В Химки возим ежедневно, дни можно ставить на паузу в приложении без потери оплаченных. Показать тарифы?' },
    { handle: '@sergey_lifts', competitor: '@healthy_box', question: 'А белка сколько в порции? Хочу под набор массы, но чтобы готовить не самому.', score: 67, tier: 'warm', reason: 'Интерес есть, но критерий выбора ещё формируется.', dm: 'Сергей, привет! У нас есть линейка «Масса» — 45–50 г белка на приём. Скину пример дня, посмотрите цифры?' },
    { handle: '@marina.k', competitor: '@fitfood_delivery', question: 'Красиво выглядит, но дороговато для меня. Есть что-то попроще?', score: 58, tier: 'warm', reason: 'Возражение по цене — заходить через лёгкий тариф, а не скидку.', dm: 'Марина, добрый день! Есть формат на 5 дней без выходных — выходит заметно дешевле полного. Прислать состав?' },
    { handle: '@lena_food_blog', competitor: '@fitfood_delivery', question: 'Ребята, вы лучшие! Заказываю уже год ❤️', score: 14, tier: 'cold', reason: 'Лояльный клиент конкурента — переманивать невыгодно.', dm: '' },
  ],
};

const prep = (page) => page.addStyleTag({ content: 'html{scroll-behavior:auto !important}*{cursor:none !important}' });
const scrollBy = (page, dy, ms = 2000) => page.evaluate(([dy, ms]) => new Promise((res) => {
  const from = window.scrollY, t0 = performance.now();
  const ease = (t) => t < .5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2;
  const step = (n) => { const p = Math.min(1, (n-t0)/ms); window.scrollTo(0, from + dy*ease(p)); p<1?requestAnimationFrame(step):res(); };
  requestAnimationFrame(step);
}), [dy, ms]);
const scrollToSel = (page, sel, ms = 2000, off = 0) => page.evaluate(([sel, ms, off]) => new Promise((res) => {
  const el = document.querySelector(sel);
  const to = el ? window.scrollY + el.getBoundingClientRect().top + off : 0;
  const from = window.scrollY, t0 = performance.now();
  const ease = (t) => t < .5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2;
  const step = (n) => { const p = Math.min(1, (n-t0)/ms); window.scrollTo(0, from + (to-from)*ease(p)); p<1?requestAnimationFrame(step):res(); };
  requestAnimationFrame(step);
}), [sel, ms, off]);

const browser = await chromium.launch({ ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}), args: ['--hide-scrollbars', '--autoplay-policy=no-user-gesture-required', '--force-device-scale-factor=2'] });
const mk = (dir) => browser.newContext({ viewport: VP, recordVideo: { dir: `${OUT}/${dir}`, size: REC }, locale: 'ru-RU', isMobile: false });

// A — landing hero (real site background video) + apps grid with the Poaching card
{
  const ctx = await mk('a'); const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' }); await prep(page);
  await page.waitForTimeout(4200);
  await scrollToSel(page, '#features', 2600, -50);
  await page.waitForTimeout(1400);
  await scrollBy(page, 420, 2000);
  await page.waitForTimeout(2500);
  await ctx.close();
}
// B — the Poaching tool: typing, scanning, scored prospects, DM drafts
{
  const ctx = await mk('b'); const page = await ctx.newPage();
  await page.route('**/api/poaching', async (route) => {
    await new Promise((r) => setTimeout(r, 2200));
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK) });
  });
  await page.goto(`${BASE}/apps/poaching`, { waitUntil: 'networkidle' }); await prep(page);
  await page.waitForTimeout(1800);
  await page.locator('#niche').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.locator('#niche').click();
  await page.locator('#niche').pressSequentially(MOCK.niche, { delay: 70 });
  await page.waitForTimeout(400);
  await page.locator('#comp').click();
  await page.locator('#comp').pressSequentially('@fitfood_delivery, @healthy_box', { delay: 55 });
  await page.waitForTimeout(600);
  await page.getByRole('button', { name: /Найти лидов/i }).click();
  await page.waitForTimeout(2500);
  await page.waitForSelector('article', { timeout: 15000 });
  await page.waitForTimeout(1200);
  await scrollToSel(page, 'article', 1800, -110);
  await page.waitForTimeout(2600);
  await scrollBy(page, 430, 2000);
  await page.waitForTimeout(2600);
  await scrollBy(page, 520, 2200);
  await page.waitForTimeout(2400);
  await scrollBy(page, 700, 2400);
  await page.waitForTimeout(2200);
  await ctx.close();
}
// C — PRO block on the tool page
{
  const ctx = await mk('c'); const page = await ctx.newPage();
  await page.goto(`${BASE}/apps/poaching`, { waitUntil: 'networkidle' }); await prep(page);
  await page.waitForTimeout(1200);
  const pro = page.getByText(/Poaching PRO/).first();
  await pro.scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
  await scrollBy(page, -60, 800);
  await page.waitForTimeout(3000);
  await scrollBy(page, 380, 2000);
  await page.waitForTimeout(2200);
  await ctx.close();
}
// D — real testimonial on the site: Ivan / Poaching / +45 leads
{
  const ctx = await mk('d'); const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' }); await prep(page);
  await page.waitForTimeout(900);
  await scrollToSel(page, '#results', 300, -40);
  await page.waitForTimeout(1500);
  await scrollBy(page, 560, 2200);
  await page.waitForTimeout(4000);
  await scrollBy(page, 480, 2200);
  await page.waitForTimeout(2500);
  await ctx.close();
}
await browser.close();
console.log('ok');
