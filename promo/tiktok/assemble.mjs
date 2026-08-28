/**
 * Монтаж тикток-ролика: кадры → титры → звук → один mp4 1080x1920.
 *
 * Источники кадров (в порядке приоритета):
 *   build/gen/<id>.mp4    — клип из Comfy Cloud (Kling), если он сгенерирован;
 *   build/genfx/<id>.mp4  — локальная генеративная сцена (render-generative.mjs);
 *   build/landing/<clip>.png — длинный скрин лендинга, по нему едет кроп.
 *
 * Звук: build/vo/<id>.mp3 (ElevenLabs, по сегменту на кадр) и build/music.mp3.
 * Чего нет — то просто не участвует: без озвучки кадры берут длительность из
 * fallbackDuration, и ролик собирается немым, но целым.
 *
 *   node promo/tiktok/assemble.mjs
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";
import ffprobeStatic from "ffprobe-static";

const B = path.resolve("promo/tiktok/build");
const OUT_DIR = path.resolve("promo/tiktok/out");
const OUT = path.join(OUT_DIR, "ai-integrator-tiktok-ru.mp4");
const W = 1080;
const H = 1920;
const FPS = 30;
const HEAD = 0.30; // пауза перед репликой внутри кадра
const TAIL = 0.55; // пауза после реплики

const { shots } = JSON.parse(readFileSync("promo/tiktok/shots.json", "utf8"));

const ff = (args) =>
  execFileSync(ffmpegPath, ["-hide_banner", "-loglevel", "error", "-y", ...args]);

function probeDuration(file) {
  const out = execFileSync(ffprobeStatic.path, [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    file,
  ]);
  return Number.parseFloat(String(out).trim());
}

mkdirSync(OUT_DIR, { recursive: true });
const CLIPS = path.join(B, "clips");
rmSync(CLIPS, { recursive: true, force: true });
mkdirSync(CLIPS, { recursive: true });

const r2 = (n) => Math.round(n * 100) / 100;

/** Что и сколько занимает каждый кадр — считаем до рендера, чтобы напечатать монтажный лист. */
const plan = shots.map((shot) => {
  const vo = path.join(B, "vo", `${shot.id}.mp3`);
  const hasVo = existsSync(vo);
  const duration = hasVo
    ? r2(Math.max(2, probeDuration(vo) + HEAD + TAIL))
    : shot.fallbackDuration;

  const comfy = path.join(B, "gen", `${shot.id}.mp4`);
  const local = path.join(B, "genfx", `${shot.id}.mp4`);
  const still = path.join(B, "landing", `${shot.source.clip ?? ""}.png`);

  let video;
  if (shot.source.type === "gen") {
    video = existsSync(comfy)
      ? { kind: "video", file: comfy, origin: "comfy/kling" }
      : { kind: "video", file: local, origin: "локальная сцена" };
  } else {
    video = { kind: "still", file: still, origin: "лендинг" };
  }
  if (!existsSync(video.file)) {
    throw new Error(`нет исходника для ${shot.id}: ${video.file}`);
  }
  return { shot, duration, video, vo: hasVo ? vo : null };
});

const total = r2(plan.reduce((a, p) => a + p.duration, 0));

console.log("Монтажный лист:");
for (const p of plan) {
  console.log(
    `  ${p.shot.id.padEnd(10)} ${String(p.duration).padStart(5)}s  ` +
      `${p.video.origin.padEnd(16)} ${p.vo ? "VO" : "без VO"}`,
  );
}
console.log(`  ${"итого".padEnd(10)} ${String(total).padStart(5)}s\n`);

for (const { shot, duration, video, vo } of plan) {
  const overlay = path.join(B, "overlay", `${shot.id}.png`);
  const out = path.join(CLIPS, `${shot.id}.mp4`);
  const args = [];
  const filters = [];

  if (video.kind === "still") {
    args.push("-loop", "1", "-framerate", String(FPS), "-t", String(duration), "-i", video.file);
    // Кроп 1080x1920 едет по длинному скрину сверху вниз — это и есть «скролл».
    filters.push(
      `[0:v]crop=${W}:${H}:0:'min(ih-${H}\\,(ih-${H})*(t/${duration}))',` +
        `fps=${FPS},format=yuv420p[bg]`,
    );
  } else {
    const src = probeDuration(video.file);
    args.push("-i", video.file);
    const pad =
      src < duration
        ? `tpad=stop_mode=clone:stop_duration=${r2(duration - src + 0.2)},`
        : "";
    filters.push(
      `[0:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},` +
        `fps=${FPS},${pad}trim=0:${duration},setpts=PTS-STARTPTS,format=yuv420p[bg]`,
    );
  }

  // Титры заходят вторым входом именно как зациклённая картинка: одиночный
  // кадр PNG получил бы альфа-фейд на своём единственном pts=0 и дальше висел
  // бы полностью прозрачным.
  args.push("-loop", "1", "-framerate", String(FPS), "-t", String(duration), "-i", overlay);
  const fadeOut = r2(Math.max(0.2, duration - 0.4));
  filters.push(
    `[1:v]format=rgba,fade=t=in:st=0:d=0.28:alpha=1,` +
      `fade=t=out:st=${fadeOut}:d=0.35:alpha=1[ov]`,
  );

  let last = "[bg][ov]overlay=0:0:format=auto";
  if (shot.endcard) {
    // Финальная плашка наезжает поверх последнего кадра.
    args.push(
      "-loop", "1", "-framerate", String(FPS), "-t", String(duration),
      "-i", path.join(B, "overlay", "endcard.png"),
    );
    filters.push(
      `[2:v]format=rgba,fade=t=in:st=0.5:d=0.5:alpha=1[end]`,
    );
    filters.push(`${last}[withcap]`);
    last = "[withcap][end]overlay=0:0:format=auto";
  }
  filters.push(`${last}[v]`);

  // Дорожка кадра: реплика с отступом HEAD либо тишина ровно на длину кадра.
  const audioIdx = args.filter((a) => a === "-i").length;
  if (vo) {
    args.push("-i", vo);
    filters.push(
      `[${audioIdx}:a]adelay=${Math.round(HEAD * 1000)}|${Math.round(HEAD * 1000)},` +
        `aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,` +
        `apad,atrim=0:${duration},asetpts=N/SR/TB[a]`,
    );
  } else {
    args.push("-f", "lavfi", "-t", String(duration), "-i", "anullsrc=r=48000:cl=stereo");
    filters.push(`[${audioIdx}:a]atrim=0:${duration},asetpts=N/SR/TB[a]`);
  }

  ff([
    ...args,
    "-filter_complex", filters.join(";"),
    "-map", "[v]", "-map", "[a]",
    "-t", String(duration),
    "-r", String(FPS),
    "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
    "-video_track_timescale", "30000",
    out,
  ]);
  console.log(`  ✓ ${shot.id}`);
}

// Склейка встык: резкие монтажные стыки держат темп лучше, чем перекрёстные
// затухания на такой длине.
const list = plan
  .map(({ shot }) => `file '${path.join(CLIPS, `${shot.id}.mp4`)}'`)
  .join("\n");
const listFile = path.join(CLIPS, "concat.txt");
writeFileSync(listFile, `${list}\n`);

const joined = path.join(CLIPS, "joined.mp4");
ff(["-f", "concat", "-safe", "0", "-i", listFile, "-c", "copy", joined]);

// Музыкальная подложка и финальное затухание.
const music = path.join(B, "music.mp3");
const outArgs = ["-i", joined];
if (existsSync(music)) {
  outArgs.push("-stream_loop", "-1", "-i", music);
  outArgs.push(
    "-filter_complex",
    `[1:a]volume=0.16,atrim=0:${total},afade=t=in:st=0:d=0.8,` +
      `afade=t=out:st=${r2(total - 1.4)}:d=1.4[m];` +
      `[0:a][m]amix=inputs=2:duration=first:dropout_transition=0,` +
      `alimiter=limit=0.95[a];` +
      `[0:v]fade=t=out:st=${r2(total - 0.5)}:d=0.5[v]`,
    "-map", "[v]", "-map", "[a]",
  );
} else {
  outArgs.push(
    "-filter_complex", `[0:v]fade=t=out:st=${r2(total - 0.5)}:d=0.5[v]`,
    "-map", "[v]", "-map", "0:a",
  );
}
ff([
  ...outArgs,
  "-r", String(FPS),
  "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p",
  "-profile:v", "high", "-level", "4.0",
  "-movflags", "+faststart",
  "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
  OUT,
]);

console.log(`\nГотово: ${path.relative(process.cwd(), OUT)}  (${total}s, ${W}x${H}, ${FPS}fps)`);
