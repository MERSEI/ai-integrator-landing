# AI Integrator — Landing Page

Информационный лендинг для валидации спроса на платформу AI Integrator: 15 готовых AI-приложений для автоматизации продаж, маркетинга и операционки.

## Стек

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS 3**
- **Framer Motion** — scroll-анимации
- **React Hook Form** — формы с валидацией
- Деплой: **Vercel**

## Запуск

```bash
npm install
npm run dev
```

Откроется на http://localhost:3000.

## Email-форма

`POST /api/subscribe` — валидация email, honeypot-поле против спама, rate limit (5 req/min на IP).

Интеграция с Mailchimp опциональна — задайте переменные из `.env.example`. Без ключей лиды пишутся в лог функции (видно в Vercel Logs).

## Структура

- `src/app` — страницы (лендинг, thank-you, api/subscribe)
- `src/components` — секции лендинга (Hero, Problems, Features, HowItWorks, Results, Pricing, FAQ, FinalCTA, Footer)
- `src/lib/content.ts` — весь контент (приложения, тарифы, FAQ, отзывы)
- `public/images` — сгенерированные иллюстрации (DALL-E)
