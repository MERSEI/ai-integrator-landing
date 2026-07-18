export const FEATURED_APPS = [
  {
    id: "poaching",
    name: "Poaching",
    tagline: "Охота на лидов",
    category: "Привлечение",
    icon: "🎯",
    description:
      "Мониторит конкурентов и находит людей, которые уже ищут твой продукт",
    result: "+30 лидов за неделю",
  },
  {
    id: "salesagent",
    name: "SalesAgent",
    tagline: "AI продажник",
    category: "Продажи",
    icon: "🤖",
    description:
      "Квалифицирует лидов, работает с возражениями, назначает встречи 24/7",
    result: "Конверсия +25%",
  },
  {
    id: "bizdoctor",
    name: "BizDoctor",
    tagline: "Аналитика",
    category: "Аналитика",
    icon: "📊",
    description:
      "Показывает, где вы теряете деньги и что делать, чтобы вырасти",
    result: "Прибыль +40%",
  },
  {
    id: "coldmessage",
    name: "ColdMessage Pro",
    tagline: "Письма",
    category: "Продажи",
    icon: "📧",
    description:
      "Персонализирует каждое письмо через AI — в 3–5 раз выше open rate",
    result: "Open rate +300%",
  },
  {
    id: "contentloop",
    name: "ContentLoop",
    tagline: "Контент",
    category: "Контент",
    icon: "📱",
    description:
      "Автоматически создаёт и публикует контент в соцсети",
    result: "Экономия 20+ часов/месяц",
  },
  {
    id: "objectionkiller",
    name: "ObjectionKiller",
    tagline: "Возражения",
    category: "Продажи",
    icon: "🛡️",
    description:
      "Подсказывает, как ответить на возражение клиента в реальном времени",
    result: "Сделки +20%",
  },
] as const;

export const APP_CATEGORIES = [
  "Все",
  "Привлечение",
  "Продажи",
  "Контент",
  "Аналитика",
] as const;

export const PROBLEMS = [
  "Нет входящих лидов — клиенты уходят к конкурентам",
  "Продажи зависят только от тебя — нельзя масштабировать",
  "Контент требует монтажёра и SMM-щика",
  "Не знаешь, где теряются деньги в бизнесе",
  "Холодные рассылки не работают",
] as const;

export const STEPS = [
  {
    number: "01",
    time: "1 час",
    title: "Диагностика",
    points: [
      "Вы отвечаете на вопросы о бизнесе",
      "Наш AI анализирует, где вы теряете клиентов",
      "Получаете детальный отчёт",
    ],
  },
  {
    number: "02",
    time: "2–3 часа",
    title: "Подбор",
    points: [
      "Выбираем нужные приложения из каталога",
      "Подключаем к вашим системам (CRM, Email и др.)",
      "Настраиваем под вашу нишу",
    ],
  },
  {
    number: "03",
    time: "24–48 часов",
    title: "Запуск",
    points: [
      "Даём training на 30 минут",
      "Запускаем приложения в production",
      "24/7 support в первую неделю",
    ],
  },
] as const;

export const TESTIMONIALS = [
  {
    name: "Иван П.",
    company: "E-commerce магазин",
    image: "/images/testimonials/ivan.png",
    task: "Нет входящих лидов",
    solution: "Poaching",
    result: "+45 лидов за месяц, конверсия +30%",
    quote:
      "Poaching изменил наш бизнес. Раньше лиды приходили только с рекламы, теперь система сама находит горячих клиентов.",
  },
  {
    name: "Анна К.",
    company: "SaaS стартап",
    image: "/images/testimonials/anna.svg",
    task: "Продажи падают",
    solution: "SalesAgent + ColdMessage Pro",
    result: "MRR +200%, сделки автоматизированы",
    quote:
      "AI-продажник закрывает встречи, пока команда спит. Мы удвоили MRR за квартал без найма сейлзов.",
  },
  {
    name: "Олег С.",
    company: "Консультант",
    image: "/images/testimonials/oleg.svg",
    task: "Нет времени на маркетинг",
    solution: "ContentLoop + LeadRadar",
    result: "−20 часов/месяц, лиды идут стабильно",
    quote:
      "Контент публикуется сам, лиды капают стабильно. Я наконец занимаюсь клиентами, а не соцсетями.",
  },
] as const;

export const STATS = [
  { value: "50+", label: "клиентов используют платформу" },
  { value: "+500", label: "лидов в месяц (всего)" },
  { value: "85%", label: "retention rate" },
  { value: "+40%", label: "среднее увеличение доходов" },
] as const;

export const PRICING_TIERS = [
  {
    name: "Starter",
    price: 149,
    popular: false,
    audience: "Фрилансеры, малые магазины",
    features: [
      "$0 на внедрение",
      "1–2 приложения",
      "Диагностика + Setup",
      "7 дней support",
    ],
    cta: "Начать",
  },
  {
    name: "Growth",
    price: 349,
    popular: true,
    audience: "E-commerce, маленькие агентства",
    features: [
      "$0 на внедрение",
      "4–5 приложений",
      "Диагностика + Setup + Optimization",
      "30 дней support",
    ],
    cta: "Самый популярный",
  },
  {
    name: "Enterprise",
    price: 699,
    popular: false,
    audience: "Крупные бизнесы, команды",
    features: [
      "$0 на внедрение",
      "Все 15 приложений",
      "Custom app под ваши задачи",
      "Dedicated manager",
    ],
    cta: "Обсудить",
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Нужен ли мне разработчик для внедрения?",
    answer: "Нет. Всё no-code. Мы всё настроим за вас за 48 часов.",
  },
  {
    question: "Сколько времени это займёт?",
    answer:
      "От 1 часа на диагностику до 48 часов на запуск. Потом инструмент работает сам — вы только смотрите результаты.",
  },
  {
    question: "Работает ли с моей CRM?",
    answer:
      "Да. Мы интегрируемся с HubSpot, Salesforce, Pipedrive и любой другой через Zapier/webhooks.",
  },
  {
    question: "Что если приложение не будет работать?",
    answer:
      "Гарантия: если через неделю нет результатов — деньги вернём. Без вопросов.",
  },
  {
    question: "Есть ли бесплатный trial?",
    answer: "Да, первый месяц бесплатно (нужно показать результаты).",
  },
  {
    question: "Где хранятся данные?",
    answer: "AWS encrypted, GDPR compliant, данные только твои.",
  },
] as const;

export const CONTACTS = {
  email: "hello@aiintegrator.pp.ua",
  telegram: "@v_market16",
  phone: "+38 063 472 71 47",
  address: "Kyiv, Ukraine",
} as const;
