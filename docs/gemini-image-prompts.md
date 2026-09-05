# Промпты для генерации графики (Gemini)

Этот файл — про **растровую** графику, которую нужно генерировать моделью.
Всё, что можно нарисовать вектором, вектором и нарисовано: иконки интерфейса
(`src/components/icons.tsx`), иконки приложений (`src/components/AppGlyphs.tsx`),
аватары-инициалы (`public/images/testimonials/*.svg`) и превью для соцсетей
(`src/lib/ogImage.tsx` — собирается из словаря контента при сборке).

Генерация нужна там, где нужна **сцена или фактура**, а не знак. Таких мест на
сайте немного, и все они ниже.

> Заменил старый `app-icon-prompts.md`: он описывал 2.5D-иллюстрации для карточек
> каталога под DALL·E, а сами картинки (`public/images/apps/*.jpg`) в вёрстке не
> использовались — их отрисовку взяли на себя SVG-иконки. Промпты той серии
> сохранены ниже, в разделе «Если захочется вернуть иллюстрированные карточки».

---

## Общие правила

**Палитра — та же, что в `tailwind.config.ts`.** Модель не знает ваш бренд,
поэтому hex-коды нужно называть прямо в каждом промпте:

| Роль | Hex |
|---|---|
| Холст | `#020617` (почти чёрный сине-стальной) |
| Поверхность | `#0F172A` |
| Основной акцент | `#4F46E5` (indigo) |
| Светлый акцент | `#818CF8` |
| Деньги, успех | `#10B981` (emerald) |
| Текст | `#F7F8F8` / `#C9CDD3` |

**Что писать в каждом промпте:**

- `no text, no letters, no numbers, no logos, no watermark` — модели вставляют
  подписи почти всегда, а кириллицу рисуют нечитаемо;
- `dark background #020617`, иначе картинка не ляжет на страницу;
- запрашивайте композицию с запасом по краям: на сайте графика обрезается под
  разные брейкпоинты;
- один сюжет в кадре — мелкие детали на 400 px превращаются в шум.

**Что делать с результатом:**

1. Сгенерировать в квадрате или 16:9, максимальным размером.
2. Ужать: ширина не больше двойной от места на странице (баннер 1200 px →
   исходник 2400 px не нужен, хватит 1600).
3. Сохранить в `.webp` качеством 78–82 — на тёмных градиентах разницы с
   исходником не видно, а вес падает втрое против JPEG.
4. Положить в `public/images/`, подключить через `next/image` с явными
   `width`/`height` — иначе поедет CLS.
5. Проверить вес: страница целиком сейчас укладывается в ~310 КБ. Любая
   картинка тяжелее 80 КБ должна отбивать свой вес пользой.

---

## 1. Фактура фона для hero (опционально)

Сейчас фон героя — CSS-градиент, он ничего не весит. Растровая фактура добавит
глубины, но это единственное место, где я бы сначала померил Lighthouse: LCP на
главной и так упирается в вес страницы.

```
Abstract dark technology background, extremely subtle, near-black deep navy
(#020617) filling most of the frame, a soft indigo (#4F46E5) volumetric glow
rising from the upper-left and a faint emerald (#10B981) haze in the lower-right
corner, fine film grain, gentle horizontal light streaks, no visible objects,
no horizon line, no text, no letters, no logos, no watermark. Cinematic,
minimal, lots of empty dark space in the centre for headline text. 16:9.
```

Дальше: обрезать до 1600×900, `.webp` q80, целевой вес ≤ 60 КБ.

---

## 2. Иллюстрация к секции «Проблемы»

Секция сейчас текстовая: список болей слева, блок «что не работает» справа.
Иллюстрация уместна как тихий фон справа, а не как главный герой.

```
Flat 2.5D vector illustration on a near-black deep navy background (#020617):
a single business owner at a desk buried under a tangle of disconnected paper
threads, sticky notes and chat bubbles flowing in from all sides, overwhelmed
but not comic. Muted indigo (#4F46E5) as the dominant colour with cool
lavender (#818CF8) accents and one warm emerald (#10B981) highlight. Clean
medium-weight outlines, soft cel shading, generous negative space around the
subject, no text, no letters, no logos, no watermark. Square 1:1.
```

---

## 3. Обложки для кейсов и блога

Понадобятся, когда появятся страницы кейсов. Один шаблон на все — меняется
только строка `SUBJECT`.

```
Editorial hero image for a B2B automation case study, flat 2.5D vector style,
near-black deep navy background (#020617) with a soft indigo (#4F46E5) radial
glow behind the subject. SUBJECT: <что произошло у клиента: «заявки из
комментариев попадают в CRM сами», «письма пишутся под каждого клиента»>.
Single centred scene, generous negative space, muted indigo palette with
emerald (#10B981) accents on the result, clean outlines, soft shading,
no text, no letters, no numbers, no logos, no watermark. 16:9.
```

---

## 4. Если захочется вернуть иллюстрированные карточки каталога

Иконки в карточках сейчас векторные — они чёткие в любом размере, красятся
темой и весят десятки байт. Иллюстрации имеют смысл только если карточки
станут крупными (условно 320 px и больше), где вектор смотрится пусто.

Общий стилевой блок — он должен входить в каждый промпт целиком, иначе
двенадцать картинок не соберутся в один набор:

```
Flat 2.5D vector app icon illustration, square 1:1 composition, centered
single-subject scene with generous negative space, on a near-black deep navy
background (#020617) with a soft dual-tone radial glow behind the subject
blending indigo (#4F46E5) and emerald (#10B981) light. Clean medium-weight
outlined line art, soft cel-shading, muted indigo as the dominant colour with
lavender (#818CF8) and mint accents. A few small sparkle particles near the
subject. No text, no letters, no logos, no watermark, no background scenery —
just the subject and the light glow on the solid dark background. Modern
SaaS/AI product icon set, professional, semi-3D isometric-flat hybrid.
```

Сюжеты по приложениям (добавляются к блоку выше строкой `SUBJECT:`):

| Приложение | SUBJECT |
|---|---|
| Poaching | a crosshair reticle locking onto one glowing person among a crowd of chat bubbles |
| LeadRadar | a radar dish catching a single bright signal out of a night sky of faint dots |
| CommentHunter | a magnifying glass pulling one glowing comment out of a stack of speech bubbles |
| ColdMessage Pro | an envelope being assembled from flowing ribbons of light, each ribbon a different colour |
| ObjectionKiller | a shield deflecting incoming arrows, each arrow dissolving into light on impact |
| FollowUpBot | a friendly robot hand gently returning a paper plane that was drifting away |
| SalesAgent | a headset-wearing robot assistant at a desk with three chat windows floating around |
| InboxZero | an inbox tray with a neat stack of letters sorting themselves into labelled slots |
| PersonaChannel | a fountain pen writing a glowing line that turns into a social post card |
| ContentLoop | a closed loop of content cards circulating like a conveyor around a central spark |
| TrendSniper | a rising graph line with a scope reticle locked on the point where it turns upward |
| BizDoctor | a stethoscope listening to a glowing business dashboard with a heartbeat line |

---

## Что не генерировать

- **Фотографии «клиентов» под именами из отзывов.** На сайте пять именных
  отзывов; сгенерированное лицо рядом с именем — это выдуманное доказательство,
  а не оформление. Для этого стоят аватары-инициалы, они честные.
- **Скриншоты интерфейсов и «дашбордов с метриками».** Нарисованные цифры
  выглядят как реальные показатели продукта. Если нужен скрин — снимайте живой
  инструмент со страниц `/apps/*`.
- **Логотипы компаний-клиентов и «нас упоминали в…».** Даже стилизованные.
- **Лица конкретных людей вообще**, если это не согласованное фото реального
  сотрудника.
