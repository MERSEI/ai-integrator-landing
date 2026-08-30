import { chromium } from 'playwright';
const OUT = `${process.env.PROMO_DIR || 'promo-build'}/overlays`;
import { mkdirSync } from 'fs';
mkdirSync(OUT, { recursive: true });

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1920px;background:transparent;font-family:Inter,system-ui,sans-serif;color:#F7F8F8;overflow:hidden}
.wrap{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:0 72px 330px}
.wrap.top{justify-content:flex-start;padding:230px 72px 0}
.wrap.mid{justify-content:center;padding:0 72px}
.scrim{position:absolute;left:0;right:0;bottom:0;height:1180px;
  background:linear-gradient(to top,rgba(8,9,10,.985) 0%,rgba(8,9,10,.98) 70%,rgba(8,9,10,.86) 86%,rgba(8,9,10,0) 100%)}
.scrim.top{top:0;bottom:auto;background:linear-gradient(to bottom,rgba(8,9,10,.95) 0%,rgba(8,9,10,.8) 45%,rgba(8,9,10,0) 100%);height:820px}
.kicker{display:inline-flex;align-items:center;gap:14px;align-self:flex-start;
  border:1px solid rgba(46,158,151,.45);background:rgba(15,124,119,.14);color:#7FD3CD;
  border-radius:999px;padding:12px 24px;font-size:30px;font-weight:600;letter-spacing:.01em;margin-bottom:34px}
.dot{width:12px;height:12px;border-radius:50%;background:#2E9E97;box-shadow:0 0 18px 4px rgba(46,158,151,.6)}
h1{font-size:96px;line-height:1.04;font-weight:800;letter-spacing:-.03em}
h1 em{font-style:normal;color:#2E9E97}
h1 b{font-weight:800;color:#B08D57}
p.sub{margin-top:30px;font-size:40px;line-height:1.32;font-weight:400;color:#C9CDD3;max-width:880px}
.rule{width:120px;height:5px;border-radius:3px;background:linear-gradient(90deg,#0F7C77,#B08D57);margin-top:44px}
.stats{display:flex;gap:26px;margin-top:44px}
.stat{flex:1;border:1px solid rgba(255,255,255,.1);background:rgba(22,24,27,.86);border-radius:20px;padding:30px 28px}
.stat .n{font-size:74px;font-weight:800;letter-spacing:-.03em;color:#2E9E97}
.stat .n.bronze{color:#B08D57}
.stat .l{margin-top:10px;font-size:28px;color:#8A8F98;line-height:1.25}
.quote{border-left:4px solid rgba(46,158,151,.7);padding-left:28px;font-size:38px;line-height:1.4;color:#E7E9EB;font-style:italic}
.who{margin-top:26px;font-size:30px;color:#8A8F98}
/* end card */
.end{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
  background:radial-gradient(120% 60% at 50% 42%,rgba(15,124,119,.28) 0%,rgba(8,9,10,.94) 62%,rgba(8,9,10,.99) 100%);gap:0}
.mark{width:150px;height:150px;border-radius:36px;border:1px solid rgba(255,255,255,.12);
  background:linear-gradient(150deg,rgba(15,124,119,.55),rgba(176,141,87,.35));
  display:flex;align-items:center;justify-content:center;box-shadow:0 24px 70px -24px rgba(15,124,119,.85)}
.mark svg{width:78px;height:78px}
.end h2{margin-top:54px;font-size:118px;font-weight:800;letter-spacing:-.035em}
.end .tag{margin-top:20px;font-size:44px;color:#C9CDD3;font-weight:500}
.end .cta{margin-top:64px;border-radius:16px;padding:28px 56px;font-size:38px;font-weight:700;color:#04110F;
  background:linear-gradient(100deg,#0F7C77 0%,#2E9E97 100%);box-shadow:0 20px 60px -20px rgba(46,158,151,.9)}
.end .url{margin-top:34px;font-size:32px;color:#8A8F98;letter-spacing:.01em}
.end .free{margin-top:16px;font-size:28px;color:#B08D57;font-weight:600}
`;

const page$ = async (browser, html, file) => {
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.setContent(`<style>${CSS}</style>${html}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/${file}`, omitBackground: true });
  await ctx.close();
};

const browser = await chromium.launch({ ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });

await page$(browser, `
<div class="scrim"></div>
<div class="wrap">
  <span class="kicker"><span class="dot"></span>Poaching</span>
  <h1>Ваши клиенты<br>уже задают<br>вопросы</h1>
  <p class="sub">Просто не вам — <em style="color:#B08D57">под постами конкурентов</em></p>
  <div class="rule"></div>
</div>`, 't1.png');

await page$(browser, `
<div class="scrim"></div>
<div class="wrap">
  <span class="kicker"><span class="dot"></span>Шаг 1 — сканирование</span>
  <h1>Находит их<br><em>за минуты</em></h1>
  <p class="sub">Движок читает комментарии у конкурентов и собирает людей с подтверждённым интересом</p>
</div>`, 't2.png');

await page$(browser, `
<div class="scrim"></div>
<div class="wrap">
  <span class="kicker"><span class="dot"></span>Шаг 2 — скоринг и заход</span>
  <h1>Скоринг <em>0–100</em><br>и готовый<br>заход в ЛС</h1>
</div>`, 't3.png');

await page$(browser, `
<div class="scrim"></div>
<div class="wrap">
  <span class="kicker"><span class="dot"></span>Кейс клиента · Иван П., интернет-магазин</span>
  <h1>Лиды идут<br><em>без рекламы</em></h1>
  <div class="stats">
    <div class="stat"><div class="n">+45</div><div class="l">лидов за месяц</div></div>
    <div class="stat"><div class="n bronze">+30%</div><div class="l">к конверсии</div></div>
  </div>
</div>`, 't4.png');

await page$(browser, `
<div class="end">
  <div class="mark"><svg viewBox="0 0 24 24" fill="none" stroke="#F7F8F8" stroke-width="1.6" stroke-linecap="round">
    <circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4"/></svg></div>
  <h2>Poaching</h2>
  <div class="tag">Охота на клиентов конкурентов</div>
  <div class="cta">Попробовать бесплатно</div>
  <div class="free">2 запуска в день · без регистрации</div>
  <div class="url">ai-integrator-landing.vercel.app</div>
</div>`, 't5.png');

await browser.close();
console.log('overlays ok');
