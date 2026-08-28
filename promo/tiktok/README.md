# Промо-ролик для TikTok

Сборка вертикального ролика 1080×1920 из трёх источников: генеративные кадры,
вставки с самого лендинга и озвучка. Сценарий и раскадровка — в
[`script.md`](script.md), вся фактура кадров — в [`shots.json`](shots.json)
(один файл правды: тексты озвучки, титры, промпты, длительности).

Результат: [`out/ai-integrator-tiktok-ru.mp4`](out/ai-integrator-tiktok-ru.mp4).

## Что нужно один раз

```bash
npm ci
npm run build                      # из сборки берётся Inter с кириллицей
npm i --no-save playwright ffmpeg-static ffprobe-static
npx playwright install chromium    # если Chromium ещё не стоит в системе
```

## Сборка

```bash
npm run start &                                  # лендинг на :3000
node promo/tiktok/capture-landing.mjs            # вставки с лендинга  → build/landing
node promo/tiktok/render-generative.mjs          # генеративные кадры  → build/genfx
node promo/tiktok/render-overlays.mjs            # титры и финальная плашка → build/overlay
node promo/tiktok/assemble.mjs                   # монтаж → out/
```

`build/` в гите не хранится — это промежуточные кадры, они пересобираются
из скриптов за пару минут.

## Откуда что берётся

| Слой | Источник | Куда кладётся |
| --- | --- | --- |
| Генеративные кадры | Comfy Cloud, `kling/kling-3.0-turbo-t2v` | `build/gen/<id>.mp4` |
| Они же, запасной вариант | локальный canvas-рендер (`scenes.js`) | `build/genfx/<id>.mp4` |
| Вставки с лендинга | Playwright по локальному `npm run start` | `build/landing/<clip>.png` |
| Озвучка | ElevenLabs, `api_elevenlabs_text_to_speech` | `build/vo/<id>.mp3` |
| Музыка | ElevenLabs, `elevenlabs/sound-generation` | `build/music.mp3` |

`assemble.mjs` собирает ролик из того, что есть: кадр Comfy имеет приоритет
над локальной сценой, а без `vo/` и `music.mp3` ролик просто собирается немым
с длительностями из `fallbackDuration`. Ничего переклеивать не нужно — файлы
кладутся в папки, монтаж перезапускается.

## Когда появятся кредиты Comfy Cloud

Текущий ролик собран без Comfy: воркспейс вернул `insufficient_credits`, так
что четыре кадра — локальные генеративные сцены, а озвучки и музыки нет
вовсе. Чтобы получить полную версию, нужно пополнить воркспейс
(cloud.comfy.org → settings → workspace) и сгенерировать:

1. **Четыре видеокадра** — `kling/kling-3.0-turbo-t2v`, `aspect_ratio: "9:16"`,
   `resolution: "1080p"`, промпты и длительности из `shots.json`. Скачать в
   `build/gen/s1_hook.mp4`, `s2_ai.mp4`, `s3_pain.mp4`, `s7_speed.mp4`.
2. **Восемь реплик** — шаблон `api_elevenlabs_text_to_speech`,
   `input_overrides`: `208.text` — реплика кадра, `208.model:
   eleven_multilingual_v2`, `208.language_code: ru`, `208.stability: 0.4`,
   `208["model.style"]: 0.35`, `211.voice` — голос из `meta.voice`. Скачать в
   `build/vo/<id>.mp3`.
3. **Музыку** — `elevenlabs/sound-generation`, промпт и длительность из
   `meta.music`. Скачать в `build/music.mp3`.

Затем `node promo/tiktok/assemble.mjs` — монтаж сам подхватит новые файлы,
пересчитает длительности кадров под реплики и подмешает музыку.

## Демо инструмента в кадре 6

Кадр `s6_tool` снимает страницу `/apps/coldmessage`: скрипт жмёт «Заполнить
примером» и «Сгенерировать письмо». Без `GEMINI_API_KEY` ответ API
подменяется заготовкой из `capture-landing.mjs` (тот же пример профиля, что
подставляет сама страница) — вёрстка и содержание совпадают с настоящим
прогоном. С `GEMINI_API_KEY` в окружении подмена отключается и в кадр
попадает живой ответ модели.
