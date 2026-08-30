import { chromium } from 'playwright';
const OUT = `${process.env.PROMO_DIR || 'promo-build'}/footage`;
const b = await chromium.launch({ ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}), args:['--hide-scrollbars','--autoplay-policy=no-user-gesture-required','--force-device-scale-factor=2'] });
const ctx = await b.newContext({ viewport:{width:540,height:960}, recordVideo:{ dir:`${OUT}/d3`, size:{width:1080,height:1920} }, locale:'ru-RU' });
const p = await ctx.newPage();
await p.goto('http://localhost:3000', { waitUntil:'networkidle' });
await p.addStyleTag({ content:'html{scroll-behavior:auto !important}*{cursor:none !important}' });
const quote = await p.getByText(/Poaching изменил наш бизнес/).first().elementHandle();
await quote.scrollIntoViewIfNeeded();
await p.waitForTimeout(1500);
// keep the testimonial anchored while drifting slowly upward — immune to reveal-animation reflow
await p.evaluate(([el, ms, from, to]) => new Promise((res) => {
  const t0 = performance.now();
  const step = (n) => {
    const k = Math.min(1, (n - t0) / ms);
    const target = from + (to - from) * (k < .5 ? 2*k*k : 1 - Math.pow(-2*k+2,2)/2);
    window.scrollTo(0, window.scrollY + (el.getBoundingClientRect().top - target));
    k < 1 ? requestAnimationFrame(step) : res();
  };
  requestAnimationFrame(step);
}), [quote, 11000, 620, 140]);
await p.waitForTimeout(1500);
await ctx.close(); await b.close();
console.log('d3 ok');
