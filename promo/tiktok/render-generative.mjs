/**
 * Генеративные кадры ролика, отрисованные локально в canvas и собранные в mp4.
 *
 * Это запасной путь: основной — четыре клипа Kling из Comfy Cloud (см. README).
 * Пока их нет, сцены рисуются здесь: тот же тайминг, та же палитра, поэтому
 * монтаж не переклеивается — assemble.mjs просто берёт клипы Comfy, как только
 * они появляются в build/gen.
 *
 *   node promo/tiktok/render-generative.mjs [--only s2_ai]
 */
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";

const W = 1080;
const H = 1920;
const FPS = 30;
const OUT = path.resolve("promo/tiktok/build/genfx");
const TMP = path.resolve("promo/tiktok/build/genfx/frames");

const { shots } = JSON.parse(readFileSync("promo/tiktok/shots.json", "utf8"));
const only = process.argv.includes("--only")
  ? process.argv[process.argv.indexOf("--only") + 1]
  : null;

/** Сцена на кадр: id шота → имя сцены в scenes.js. */
const SCENE = {
  s1_hook: "signal",
  s2_ai: "constellation",
  s3_pain: "dissolve",
  s7_speed: "rise",
};

const scenesSource = readFileSync("promo/tiktok/scenes.js", "utf8");

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch(
  existsSync("/opt/pw-browsers/chromium")
    ? { executablePath: "/opt/pw-browsers/chromium" }
    : {},
);
const context = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 1,
});
const page = await context.newPage();

for (const shot of shots) {
  const scene = SCENE[shot.id];
  if (!scene) continue;
  if (only && only !== shot.id) continue;

  // Длительность берём с запасом: озвучка может оказаться длиннее плана, и
  // тогда монтажу будет что подрезать, а не чем растягивать.
  const seconds = (shot.source.duration ?? 5) + 1;
  const frames = Math.round(seconds * FPS);

  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });

  await page.setContent(
    `<style>html,body{margin:0;background:#08090A;overflow:hidden}
     canvas{display:block;width:${W}px;height:${H}px}</style>
     <canvas id="c" width="${W}" height="${H}"></canvas>
     <script>${scenesSource}</script>`,
    { waitUntil: "load" },
  );
  await page.evaluate(
    ([name, total]) => window.__scene(name, total),
    [scene, frames],
  );

  process.stdout.write(`▶ ${shot.id} (${scene}, ${seconds}s) `);
  for (let i = 0; i < frames; i += 1) {
    await page.evaluate(() => window.__step());
    await page.screenshot({
      path: path.join(TMP, `f${String(i).padStart(4, "0")}.jpg`),
      type: "jpeg",
      quality: 95,
    });
    if (i % 30 === 0) process.stdout.write(".");
  }

  const out = path.join(OUT, `${shot.id}.mp4`);
  execFileSync(ffmpegPath, [
    "-hide_banner", "-loglevel", "error", "-y",
    "-framerate", String(FPS),
    "-i", path.join(TMP, "f%04d.jpg"),
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "17",
    "-preset", "medium",
    out,
  ]);
  rmSync(TMP, { recursive: true, force: true });
  console.log(` → ${path.relative(process.cwd(), out)}`);
}

await browser.close();
