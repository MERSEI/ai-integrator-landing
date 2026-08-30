# Промо-ролик Poaching (9:16)

Готовый мастер: [`public/videos/poaching-promo-9x16.mp4`](../public/videos/poaching-promo-9x16.mp4)
— 1080×1920, 33.5 с, H.264 + AAC, ~12 МБ. Постер (последний кадр):
`public/images/poaching-promo-poster.jpg`.

Ролик собран из трёх слоёв: **реальные кадры сайта** (не мокапы — записан
локальный `npm run dev`), **генеративная графика** Seedance 2.0 через Comfy
Cloud и **звук ElevenLabs**.

## Раскадровка

| Время | Кадр | Плашка |
| --- | --- | --- |
| 0:00–0:04 | генератив: облака комментариев, тил-скан, три зажигаются бронзой | «Ваши клиенты уже задают вопросы» |
| 0:04–0:07 | сайт: герой лендинга с фоновым видео → сетка приложений с карточкой Poaching | — |
| 0:07–0:11 | генератив: радар по сетке узлов | «Находит их за минуты» |
| 0:11–0:17 | инструмент: ввод ниши и конкурентов, скан комментариев | — |
| 0:17–0:24 | инструмент: карточки лидов со скорингом и черновиками захода в ЛС | «Скоринг 0–100 и готовый заход в ЛС» |
| 0:24–0:28 | сайт: блок отзывов, кейс Ивана | «Лиды идут без рекламы» · +45 · +30% |
| 0:28–0:33 | генератив: аутро, финальная карточка с CTA | Poaching · Попробовать бесплатно |

## Чего в ролике пока нет

**Дикторской озвучки.** Из десяти генераций в Comfy Cloud пять упали с
`Payment Required: Please add credits to your workspace` — закончились
кредиты. Успели пройти три видеоклипа, эмбиент и одна строка озвучки;
она лежит как образец голоса: `assets/poaching-promo-vo-sample.mp3`
(ElevenLabs, `eleven_multilingual_v2`, голос `Brian`, `language_code: ru`).

Сценарий озвучки (5 реплик, ~35 с) — чтобы допрогнать после пополнения:

1. «Ваши будущие клиенты уже задают вопросы. Просто не вам — а под постами конкурентов.»
2. «Poaching сканирует комментарии у ваших конкурентов и собирает людей с подтверждённым интересом.»
3. «Каждого оценивает по перспективности — от горячих до холодных — и пишет тактичный заход в личные сообщения.»
4. «Иван, интернет-магазин: сорок пять лидов за месяц и конверсия плюс тридцать процентов.» ← готова
5. «Poaching. Охота на клиентов конкурентов. Попробуйте бесплатно — прямо на сайте.»

Реплики режутся по битам раскадровки один к одному: 1 → b1, 2 → b4, 3 → b6,
4 → b7, 5 → b8. После генерации их нужно подмешать в `assemble.sh` пятым
входом (`amix` поверх эмбиента, эмбиент приглушить до ~0.35).

## Как пересобрать

Нужны `ffmpeg`, `node`, `playwright` и запущенный локально сайт.

```bash
npm run dev                                   # сайт на localhost:3000
export PROMO_DIR=promo-build                  # рабочая папка (в .gitignore)

node scripts/promo/record-site-footage.mjs    # дубли a (лендинг), b (инструмент), c (PRO), d
node scripts/promo/record-testimonial.mjs     # дубль d3 — блок отзывов, кейс Ивана
node scripts/promo/render-overlays.mjs        # t1..t5.png — текстовые плашки на прозрачном фоне

# клипы и звук из Comfy Cloud положить в $PROMO_DIR/comfy/ как
# gen1-hook.mp4, gen2-scan.mp4, gen3-outro.mp4, ambient.flac

bash scripts/promo/build-segments.sh          # восемь бит в едином формате
bash scripts/promo/assemble.sh                # мастер + постер
```

Две ловушки, на которые уже наступили:

- **Playwright пишет видео в CSS-пикселях и игнорирует `deviceScaleFactor`** —
  с `deviceScaleFactor: 2` кадр 1080×1920 получается серым с рендером
  540×960 в углу. Масштаб задаётся аргументом браузера
  `--force-device-scale-factor=2` при `viewport: 540×960`.
- **Абсолютный `window.scrollTo` по лендингу уезжает**: секции появляются
  через `Reveal`, высота страницы меняется на лету. В
  `record-testimonial.mjs` прокрутка каждый кадр переанкеривается на
  элемент отзыва, а не на координату.

Скрипт записи подменяет ответ `/api/poaching` (`page.route`) готовым
набором лидов: без `GEMINI_API_KEY` демо вернуло бы ошибку, а данные там
в любом случае сгенерированы AI — об этом прямо написано в самом
инструменте (`demoNote`).

## Промпты генеративных вставок

Все три — Seedance 2.0, 1080p, 9:16, 5 с, через `partner_generate`
(`byteplus/seedance-2.0-t2v`). Палитра совпадает с токенами сайта: почти
чёрный фон, петроль `#0F7C77` и бронза `#B08D57`. В промптах явный запрет
на текст — модели рисуют буквы с ошибками, вся типографика вжигается
через ffmpeg.

1. **Хук.** `Abstract dark motion graphics, absolutely no text and no letters, vertical composition: a deep near-black void filled with dozens of faint translucent speech-bubble shapes drifting slowly like plankton; a thin teal scanning light sweeps across the frame and three bubbles ignite with a warm bronze glow while fine teal data-lines connect them; shallow depth of field, slow cinematic dolly-in, premium fintech SaaS aesthetic, minimal, elegant, subtle film grain`
2. **Скан.** `…a vast grid of small glowing nodes on a near-black plane; a teal radar sweep rotates across it and, as it passes, several nodes flare warm bronze and lift slightly above the plane, thin luminous lines linking them; fine particles drift through the air; slow parallax camera push, premium minimal UI-inspired visual, cinematic lighting, subtle film grain`
3. **Аутро.** `…streaks of teal and warm bronze light converge from the edges of a near-black frame into a single calm glowing core at the centre, then softly bloom outward into slow drifting particles; confident, elegant, cinematic minimal tech brand ident, subtle film grain`

Эмбиент (ElevenLabs `sound-generation`, 22 с, `loop: true`):
`Dark cinematic ambient technology bed: deep sub-bass drone, soft pulsing
synth heartbeat, faint digital ticks and airy shimmer, calm and confident,
no melody, seamless loop`.
