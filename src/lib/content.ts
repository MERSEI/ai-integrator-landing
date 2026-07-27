/**
 * Статусы приложений:
 * - live: реальный AI-инструмент (работает на данных пользователя)
 * - demo: интерактивное демо на AI-примерах (реальные данные — в PRO)
 * - soon: Coming Soon
 */
export type AppStatus = "live" | "demo" | "soon";

export const APP_STATUS_META: Record<
  AppStatus,
  { label: string; className: string }
> = {
  live: { label: "Live", className: "bg-success/15 text-success" },
  demo: { label: "Демо", className: "bg-warning/15 text-warning" },
  soon: { label: "Скоро", className: "bg-white/10 text-slate-400" },
};

export const FEATURED_APPS = [
  {
    id: "poaching",
    name: "Poaching",
    tagline: "Охота на лидов",
    category: "Привлечение",
    image: "/images/apps/poaching.jpg",
    href: "/apps/poaching",
    status: "demo" as AppStatus,
    description:
      "Мониторит конкурентов и находит людей, которые уже ищут твой продукт",
    result: "+30 лидов за неделю",
  },
  {
    id: "salesagent",
    name: "SalesAgent",
    tagline: "AI продажник",
    category: "Продажи",
    image: "/images/apps/salesagent.jpg",
    status: "soon" as AppStatus,
    description:
      "Квалифицирует лидов, работает с возражениями, назначает встречи 24/7",
    result: "Конверсия +25%",
  },
  {
    id: "bizdoctor",
    name: "BizDoctor",
    tagline: "Аналитика",
    category: "Аналитика",
    image: "/images/apps/bizdoctor.jpg",
    href: "/apps/bizdoctor",
    status: "live" as AppStatus,
    description:
      "Показывает, где вы теряете деньги и что делать, чтобы вырасти",
    result: "Прибыль +40%",
  },
  {
    id: "coldmessage",
    name: "ColdMessage Pro",
    tagline: "Письма",
    category: "Продажи",
    image: "/images/apps/coldmessage.jpg",
    href: "/apps/coldmessage",
    status: "live" as AppStatus,
    description:
      "Персонализирует каждое письмо через AI — в 3–5 раз выше open rate",
    result: "Open rate +300%",
  },
  {
    id: "contentloop",
    name: "ContentLoop",
    tagline: "Контент",
    category: "Контент",
    image: "/images/apps/contentloop.jpg",
    status: "soon" as AppStatus,
    description:
      "Автоматически создаёт и публикует контент в соцсети",
    result: "Экономия 20+ часов/месяц",
  },
  {
    id: "objectionkiller",
    name: "ObjectionKiller",
    tagline: "Возражения",
    category: "Продажи",
    image: "/images/apps/objectionkiller.jpg",
    href: "/apps/objectionkiller",
    status: "live" as AppStatus,
    description:
      "Подсказывает, как ответить на возражение клиента в реальном времени",
    result: "Сделки +20%",
  },
] as const;

/**
 * Отдельные приложения (не входят в featured-6, но имеют рабочую страницу).
 * icon — ключ для маппинга на react-icon в FeaturesSection (у этих приложений нет фото).
 */
export const STANDALONE_APPS = [
  {
    id: "personachannel",
    name: "PersonaChannel",
    tagline: "Контент под персону",
    category: "Контент",
    icon: "persona",
    href: "/apps/personachannel",
    status: "live" as AppStatus,
    description:
      "Пишет контент в вашем уникальном тоне и стиле — под конкретную персону и аудиторию",
    result: "Контент за 5 минут",
  },
  {
    id: "followupbot",
    name: "FollowUpBot",
    tagline: "Дожим лидов",
    category: "Продажи",
    icon: "followup",
    href: "/apps/followupbot",
    status: "live" as AppStatus,
    description:
      "Составляет цепочки follow-up сообщений, чтобы дожимать зависшие сделки без давления",
    result: "+35% ответов на дожим",
  },
  {
    id: "inboxzero",
    name: "InboxZero",
    tagline: "Разбор почты",
    category: "Продажи",
    icon: "inbox",
    href: "/apps/inboxzero",
    status: "live" as AppStatus,
    description:
      "Разбирает входящие письма, выделяет задачи и готовит ответ в нужном тоне",
    result: "−80% времени на почту",
  },
  {
    id: "leadradar",
    name: "LeadRadar",
    tagline: "Радар горячих запросов",
    category: "Привлечение",
    icon: "radar",
    href: "/apps/leadradar",
    status: "demo" as AppStatus,
    description:
      "Находит горячие запросы в реальном времени и подсказывает, кому писать первым",
    result: "Лиды в реальном времени",
  },
  {
    id: "commenthunter",
    name: "Comment Hunter",
    tagline: "Лиды в комментариях",
    category: "Привлечение",
    icon: "comment",
    href: "/apps/commenthunter",
    status: "demo" as AppStatus,
    description:
      "Вычисляет потенциальных клиентов среди комментариев в постах конкурентов",
    result: "Лиды из комментариев",
  },
  {
    id: "trendsniper",
    name: "Trend Sniper",
    tagline: "Аналитика трендов",
    category: "Аналитика",
    icon: "trend",
    href: "/apps/trendsniper",
    status: "demo" as AppStatus,
    description:
      "Показывает, какие темы набирают обороты, пока конкуренты ещё не заметили",
    result: "Тренды на 2 шага вперёд",
  },
] as const;

/** Coming Soon — есть в каталоге, приложения ещё нет. */
export const SOON_APPS = [
  { id: "competitorwatch", name: "CompetitorWatch", tagline: "Мониторинг конкурентов" },
  { id: "reelfactory", name: "ReelFactory", tagline: "Автомонтаж Reels" },
  { id: "meetingscribe", name: "MeetingScribe", tagline: "Минуты встреч" },
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
    image: "/images/steps/step-1.jpg",
    imageAlt:
      "Клиент заполняет анкету, AI обрабатывает данные и формирует отчёт по бизнесу",
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
    image: "/images/steps/step-2.jpg",
    imageAlt:
      "Разрозненные сервисы и данные подключаются в единый рабочий процесс",
    points: [
      "Выбираем нужные приложения из каталога",
      "Подключаем к вашим системам (CRM, Email и др.)",
      "Настраиваем под вашу нишу",
    ],
  },
  {
    number: "03",
    time: "48–72 часа",
    title: "Запуск",
    image: "/images/steps/step-3.jpg",
    imageAlt:
      "Приложения запускаются в работу, метрики бизнеса идут вверх",
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
  {
    name: "Марина В.",
    company: "Онлайн-школа",
    image: "/images/testimonials/marina.svg",
    task: "Возражения тормозят продажи",
    solution: "ObjectionKiller",
    result: "Закрытие сделок +35%, готово за 3 дня",
    quote:
      "Боялась, что получим общий шаблон под всех. А бот с первого дня знает возражения именно про наши курсы — настроили под нашу нишу, а не выдали типовую болванку.",
  },
  {
    name: "Дмитрий К.",
    company: "Агентство недвижимости",
    image: "/images/testimonials/dmitry.svg",
    task: "Тонем во входящих письмах",
    solution: "InboxZero",
    result: "Экономия 15 часов/неделю с первого дня",
    quote:
      "Думал, придётся неделями объяснять специфику недвижимости. А инструмент подключили — и он сразу заработал под наши процессы, из коробки, без долгой раскачки.",
  },
] as const;

export const STATS = [
  { value: "50+", label: "клиентов используют платформу" },
  { value: "+500", label: "лидов в месяц (всего)" },
  { value: "85%", label: "retention rate" },
  { value: "+40%", label: "среднее увеличение доходов" },
] as const;

/**
 * Модель: разовая сборка под клиента (setup) + месячная подписка на поддержку.
 * Setup считается по реальным часам кастомной сборки, подписка покрывает
 * API-расходы, инфраструктуру и саппорт.
 */
export const PRICING_TIERS = [
  {
    name: "Starter",
    setup: 155,
    price: 30,
    popular: false,
    audience: "Фрилансеры, малый бизнес",
    features: [
      "1 приложение под вашу нишу",
      "Диагностика + сборка под ваши процессы",
      "Интеграция с вашими системами",
      "Поддержка и обновления",
    ],
    cta: "Начать",
  },
  {
    name: "Growth",
    setup: 370,
    price: 100,
    popular: true,
    audience: "E-commerce, небольшие агентства",
    features: [
      "3 приложения на выбор",
      "Диагностика + сборка под ваши процессы",
      "Интеграция с вашими системами",
      "Приоритетная поддержка",
    ],
    cta: "Самый популярный",
  },
  {
    name: "Enterprise",
    setup: 1175,
    price: 500,
    popular: false,
    audience: "Крупные бизнесы, команды",
    features: [
      "Все приложения платформы",
      "Custom app под ваши задачи",
      "Интеграция с вашими системами",
      "Персональный менеджер",
    ],
    cta: "Обсудить",
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Нужен ли мне разработчик для внедрения?",
    answer: "Нет. Всё no-code. Мы всё настроим за вас за 72 часа.",
  },
  {
    question: "Сколько времени это займёт?",
    answer:
      "От 1 часа на диагностику до 72 часов на запуск. Потом инструмент работает сам — вы только смотрите результаты.",
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
    answer:
      "Бесплатно — демо инструментов и консультация с анализом под ваш бизнес (созвон после обратной связи по почте). Дальше оплачивается сборка под вашу нишу и месячная поддержка.",
  },
  {
    question: "Где хранятся данные?",
    answer: "AWS encrypted, GDPR compliant, данные только твои.",
  },
] as const;

export const CONTACTS = {
  email: "aiintegrator.hello@gmail.com",
  telegram: "@f1_owe",
  phone: "+420 773 693 263",
  address: "Kyiv, Ukraine",
} as const;
