# Промпты для генерации иконок приложений (ChatGPT / DALL·E)

Под стиль уже существующих иконок (`public/images/apps/*.jpg`): плоская 2.5D
векторная иллюстрация на почти-чёрном фоне с мягким двухцветным (тёплый +
холодный) свечением, аккуратная контурная отрисовка, часто робот-маскот,
искры-частицы вокруг сюжета.

Промпты — на английском: для image-gen моделей это даёт более стабильный и
предсказуемый результат, чем русский текст. Каждый блок — самостоятельный,
готовый к копипасте целиком в ChatGPT.

Генерируй в квадрате (1024×1024). После генерации — пришли мне файлы, я сожму
их в JPEG ~256×256 и подключу в `content.ts` (`FEATURED_APPS`/`STANDALONE_APPS`),
как уже сделано с существующими шестью.

---

## Общий стилевой блок (входит в каждый промпт ниже)

```
Flat 2.5D vector app icon illustration, square 1:1 composition, centered
single-subject scene with generous negative space, on a near-black dark navy
background (#0a0a14) with a soft dual-tone radial glow behind the subject
blending warm amber-orange and cool purple-indigo light. Clean medium-weight
outlined line art, soft cel-shading, muted pastel-indigo as the dominant
color with cyan, orange, and mint-green accents. A few small sparkle/star
particles floating near the subject. No text, no logos, no watermark, no
background scenery — just the subject and light glow on solid dark
background. Style consistent with a modern SaaS/AI product icon set, cute
and professional, semi-3D isometric-flat hybrid rendering. Render at
1024x1024, no text overlays.
```

---

## 1. PersonaChannel — контент под персону

```
Flat 2.5D vector app icon illustration, square 1:1 composition, centered
single-subject scene with generous negative space, on a near-black dark navy
background (#0a0a14) with a soft dual-tone radial glow behind the subject
blending warm amber-orange and cool purple-indigo light. Clean medium-weight
outlined line art, soft cel-shading, muted pastel-indigo as the dominant
color with cyan, orange, and mint-green accents. A few small sparkle/star
particles floating near the subject. No text, no logos, no watermark, no
background scenery — just the subject and light glow on solid dark
background. Style consistent with a modern SaaS/AI product icon set, cute
and professional, semi-3D isometric-flat hybrid rendering. Render at
1024x1024, no text overlays.

Subject: a friendly rounded robot mascot sitting at a small desk, holding a
stylus over a tablet, with three floating content-format cards orbiting
around it — a photo card, a short-video card with a play button, and a
text/quote card — each subtly tinted a different accent color, suggesting
one persona's content being adapted across formats.
```

## 2. FollowUpBot — дожим лидов

```
Flat 2.5D vector app icon illustration, square 1:1 composition, centered
single-subject scene with generous negative space, on a near-black dark navy
background (#0a0a14) with a soft dual-tone radial glow behind the subject
blending warm amber-orange and cool purple-indigo light. Clean medium-weight
outlined line art, soft cel-shading, muted pastel-indigo as the dominant
color with cyan, orange, and mint-green accents. A few small sparkle/star
particles floating near the subject. No text, no logos, no watermark, no
background scenery — just the subject and light glow on solid dark
background. Style consistent with a modern SaaS/AI product icon set, cute
and professional, semi-3D isometric-flat hybrid rendering. Render at
1024x1024, no text overlays.

Subject: a cute rounded robot mascot with one arm outstretched, releasing a
paper airplane message, with two more paper airplanes trailing behind it in
a gentle curved sequence to suggest a chain of follow-up messages, and a
small clock icon floating nearby to suggest timed, persistent follow-up.
```

## 3. InboxZero — разбор почты

```
Flat 2.5D vector app icon illustration, square 1:1 composition, centered
single-subject scene with generous negative space, on a near-black dark navy
background (#0a0a14) with a soft dual-tone radial glow behind the subject
blending warm amber-orange and cool purple-indigo light. Clean medium-weight
outlined line art, soft cel-shading, muted pastel-indigo as the dominant
color with cyan, orange, and mint-green accents. A few small sparkle/star
particles floating near the subject. No text, no logos, no watermark, no
background scenery — just the subject and light glow on solid dark
background. Style consistent with a modern SaaS/AI product icon set, cute
and professional, semi-3D isometric-flat hybrid rendering. Render at
1024x1024, no text overlays.

Subject: an open inbox tray with a neat stack of envelopes inside, one
envelope floating just above the tray with a small green checkmark badge
popping out of it, and a cheerful rounded robot mascot peeking from behind
the tray, one hand sorting the letters.
```

## 4. LeadRadar — радар горячих запросов

```
Flat 2.5D vector app icon illustration, square 1:1 composition, centered
single-subject scene with generous negative space, on a near-black dark navy
background (#0a0a14) with a soft dual-tone radial glow behind the subject
blending warm amber-orange and cool purple-indigo light. Clean medium-weight
outlined line art, soft cel-shading, muted pastel-indigo as the dominant
color with cyan, orange, and mint-green accents. A few small sparkle/star
particles floating near the subject. No text, no logos, no watermark, no
background scenery — just the subject and light glow on solid dark
background. Style consistent with a modern SaaS/AI product icon set, cute
and professional, semi-3D isometric-flat hybrid rendering. Render at
1024x1024, no text overlays.

Subject: a circular radar dashboard with concentric sweep rings and a
rotating scan line, one small dot near the edge of the rings glowing warm
orange to represent a freshly detected hot lead, a small rounded robot
mascot standing beside the radar pointing excitedly at the glowing dot.
```

## 5. Comment Hunter — лиды в комментариях

```
Flat 2.5D vector app icon illustration, square 1:1 composition, centered
single-subject scene with generous negative space, on a near-black dark navy
background (#0a0a14) with a soft dual-tone radial glow behind the subject
blending warm amber-orange and cool purple-indigo light. Clean medium-weight
outlined line art, soft cel-shading, muted pastel-indigo as the dominant
color with cyan, orange, and mint-green accents. A few small sparkle/star
particles floating near the subject. No text, no logos, no watermark, no
background scenery — just the subject and light glow on solid dark
background. Style consistent with a modern SaaS/AI product icon set, cute
and professional, semi-3D isometric-flat hybrid rendering. Render at
1024x1024, no text overlays.

Subject: a loose stack of speech-bubble comment cards, one bubble glowing
and slightly enlarged with a magnifying glass hovering over it revealing a
small highlighted person silhouette inside, held by a small rounded robot
mascot peeking in from one side.
```

## 6. Trend Sniper — аналитика трендов

```
Flat 2.5D vector app icon illustration, square 1:1 composition, centered
single-subject scene with generous negative space, on a near-black dark navy
background (#0a0a14) with a soft dual-tone radial glow behind the subject
blending warm amber-orange and cool purple-indigo light. Clean medium-weight
outlined line art, soft cel-shading, muted pastel-indigo as the dominant
color with cyan, orange, and mint-green accents. A few small sparkle/star
particles floating near the subject. No text, no logos, no watermark, no
background scenery — just the subject and light glow on solid dark
background. Style consistent with a modern SaaS/AI product icon set, cute
and professional, semi-3D isometric-flat hybrid rendering. Render at
1024x1024, no text overlays.

Subject: an upward rising bar-and-line trend chart, with a pair of
binoculars floating above it spotting a small glowing peak on the chart
just before it fully rises, a few sparkle bursts around the highlighted
peak suggesting an early discovery, a small rounded robot mascot standing
next to the chart holding the binoculars.
```
