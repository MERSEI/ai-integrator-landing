/**
 * Строки интерфейса демо-инструментов. Вынесены отдельно от основного словаря:
 * это ~150 строк на язык, и в content/ru.ts они бы утопили маркетинговый текст.
 *
 * Метки статусов (горячий/тёплый, срочно/не срочно и т.д.) тоже здесь, а не в
 * src/lib/<tool>.ts, потому что они переводятся; в тех файлах остались только
 * типы и CSS-классы.
 */
import type { Locale } from "../i18n";

export type ToolsContent = {
  common: {
    genericError: string;
    genericErrorRetry: string;
    networkError: string;
    copy: string;
    copied: string;
    optional: string;
    send: string;
    demoLabel: string;
    proCta: string;
    subject: string;
  };

  /** Тон общения — общий список для ColdMessage и FollowUpBot. */
  tones: string[];

  tiers: { hot: string; warm: string; cold: string };
  urgency: { high: string; medium: string; low: string };
  severity: { high: string; medium: string; low: string };
  direction: { rising: string; falling: string; stable: string };

  personachannel: {
    channelLabel: string;
    channelPlaceholder: string;
    personaLabel: string;
    personaHint: string;
    personaPlaceholder: string;
    submit: string;
    submitting: string;
    loading: string;
    empty: string;
    personaTitle: string;
    toneLabel: string;
    tipsTitle: string;
  };

  followupbot: {
    contextLabel: string;
    contextPlaceholder: string;
    channelLabel: string;
    toneLabel: string;
    submit: string;
    submitting: string;
    loading: string;
    empty: string;
    situationTitle: string;
  };

  inboxzero: {
    formTitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    intentLabel: string;
    intentHint: string;
    intentPlaceholder: string;
    submit: string;
    submitting: string;
    loading: string;
    empty: string;
    noReplyNeeded: string;
    tasksTitle: string;
    replyTitle: string;
  };

  bizdoctor: {
    intro: string;
    fillExample: string;
    example: string;
    thinking: string;
    inputPlaceholderEmpty: string;
    inputPlaceholderReply: string;
    restart: string;
    diagnosisTitle: string;
    leaksTitle: string;
    recommendationsTitle: string;
    quickWinTitle: string;
  };

  coldmessage: {
    formTitle: string;
    fillExample: string;
    exampleProfile: string;
    exampleOffer: string;
    profileLabel: string;
    profilePlaceholder: string;
    linkLabel: string;
    linkHint: string;
    offerLabel: string;
    offerPlaceholder: string;
    channelLabel: string;
    toneLabel: string;
    submit: string;
    submitting: string;
    hint: string;
    loading: string;
    empty: string;
    contactsTitle: string;
    signalsTitle: string;
    approachTitle: string;
    messageTitle: string;
  };

  objectionkiller: {
    intro: string;
    placeholder: string;
    example: string;
    fillExample: string;
    thinking: string;
    inputPlaceholderReply: string;
    restart: string;
    hiddenReasonTitle: string;
    whyItWorks: string;
    recommendationTitle: string;
  };

  poaching: {
    nicheLabel: string;
    nichePlaceholder: string;
    competitorsLabel: string;
    competitorsHint: string;
    competitorsPlaceholder: string;
    submit: string;
    submitting: string;
    demoNote: string;
    loading: string;
    empty: string;
    summary: (niche: string, count: number) => string;
    commentedUnder: string;
    scoreLabel: string;
    dmTitle: string;
    proTitle: string;
    proIntro: string;
    proFeatures: string[];
  };

  leadradar: {
    keywordLabel: string;
    keywordPlaceholder: string;
    offerLabel: string;
    offerHint: string;
    offerPlaceholder: string;
    submit: string;
    submitting: string;
    demoNote: string;
    loading: string;
    empty: string;
    summary: (keyword: string, count: number) => string;
    scoreLabel: string;
    draftTitle: string;
    proTitle: string;
    proIntro: string;
    proFeatures: string[];
  };

  commenthunter: {
    keywordLabel: string;
    keywordPlaceholder: string;
    offerLabel: string;
    offerHint: string;
    offerPlaceholder: string;
    submit: string;
    submitting: string;
    demoNote: string;
    loading: string;
    empty: string;
    summary: (keyword: string, posts: number, hot: number) => string;
    replyTitle: string;
    proTitle: string;
    proIntro: string;
    proFeatures: string[];
  };

  trendsniper: {
    keywordLabel: string;
    keywordPlaceholder: string;
    regionLabel: string;
    regionHint: string;
    regionPlaceholder: string;
    submit: string;
    submitting: string;
    demoNote: string;
    loading: string;
    empty: string;
    interestLevel: string;
    regionsTitle: string;
    relatedTitle: string;
    topQueries: string;
    risingQueries: string;
    seasonalityTitle: string;
    insightTitle: string;
    proTitle: string;
    proIntro: string;
    proFeatures: string[];
  };
};

const ruTools: ToolsContent = {
  common: {
    genericError: "Что-то пошло не так.",
    genericErrorRetry: "Что-то пошло не так. Попробуйте ещё раз.",
    networkError: "Ошибка сети. Попробуйте ещё раз.",
    copy: "Копировать",
    copied: "Скопировано",
    optional: "(необязательно)",
    send: "Отправить",
    demoLabel: "Демо-режим.",
    proCta: "Подключить PRO",
    subject: "Тема:",
  },

  tones: [
    "Дружелюбный (на ты)",
    "Деловой (на вы)",
    "Нейтральный",
    "Экспертный",
  ],

  tiers: { hot: "Горячий", warm: "Тёплый", cold: "Холодный" },
  urgency: { high: "Срочно", medium: "В течение дня", low: "Не срочно" },
  severity: { high: "критично", medium: "заметно", low: "умеренно" },
  direction: { rising: "Растёт", falling: "Падает", stable: "Стабильно" },

  personachannel: {
    channelLabel: "О чём ваш канал",
    channelPlaceholder:
      "например: Telegram-канал про личные финансы и инвестиции для начинающих",
    personaLabel: "Ваша персона",
    personaHint: "(необязательно — выведем сами)",
    personaPlaceholder:
      "например: 25–35 лет, наёмные специалисты, хотят пассивный доход, боятся потерять деньги",
    submit: "Создать контент под персону",
    submitting: "Создаём контент…",
    loading: "Изучаем персону и пишем посты…",
    empty:
      "Здесь появятся портрет персоны и 5 готовых постов, написанных специально под неё",
    personaTitle: "Портрет персоны",
    toneLabel: "Тон:",
    tipsTitle: "Как вести канал для этой персоны",
  },

  followupbot: {
    contextLabel: "Контекст сделки",
    contextPlaceholder:
      "Что предлагали, как отреагировал клиент, на чём разговор завис, сколько времени прошло…",
    channelLabel: "Канал",
    toneLabel: "Тон",
    submit: "Создать цепочку дожима",
    submitting: "Готовим цепочку…",
    loading: "Анализируем ситуацию и пишем цепочку…",
    empty:
      "Здесь появится цепочка из 3 follow-up сообщений с разными углами захода",
    situationTitle: "Чтение ситуации",
  },

  inboxzero: {
    formTitle: "Входящее письмо",
    emailLabel: "Текст письма",
    emailPlaceholder: "Вставьте письмо целиком (можно с темой и подписью)…",
    intentLabel: "Как ответить",
    intentHint: "(необязательно)",
    intentPlaceholder:
      "например: вежливо отказаться / согласиться и предложить звонок в четверг",
    submit: "Разобрать письмо",
    submitting: "Разбираем…",
    loading: "Классифицируем и пишем ответ…",
    empty:
      "Здесь появятся классификация, суть письма, задачи из него и готовый ответ",
    noReplyNeeded: "Можно не отвечать",
    tasksTitle: "Задачи из письма",
    replyTitle: "Готовый ответ",
  },

  bizdoctor: {
    intro:
      "Расскажите о бизнесе: ниша, выручка, откуда клиенты, что с конверсией. Доктор уточнит метрики и покажет, где вы теряете деньги.",
    fillExample: "Подставить пример",
    example:
      "Интернет-магазин косметики, выручка ~800 тыс грн/мес, маржа 35%. Трафик из Instagram-рекламы, тратим 120 тыс/мес. Конверсия сайта 1.2%, средний чек 950 грн, повторных покупок мало.",
    thinking: "Доктор анализирует…",
    inputPlaceholderEmpty: "Опишите ваш бизнес и цифры…",
    inputPlaceholderReply: "Ваш ответ…",
    restart: "Новая диагностика",
    diagnosisTitle: "Диагноз",
    leaksTitle: "Где теряются деньги",
    recommendationsTitle: "Рекомендации",
    quickWinTitle: "Quick win на эту неделю",
  },

  coldmessage: {
    formTitle: "Входные данные",
    fillExample: "Заполнить примером",
    exampleProfile:
      "Антон Кравец — Head of Growth в SaaS для логистики (TrackFlow). Пишу про B2B-маркетинг и когортный анализ. На прошлой неделе выступал на конференции SaaS Nova про удержание. Люблю бег и спешелти-кофе. Ищем сильного перформанс-маркетолога. Telegram: @anton_growth, почта anton@trackflow.io",
    exampleOffer:
      "Здравствуйте! Мы делаем сервис для автоматизации холодных рассылок с AI-персонализацией. Хотим предложить пилот. Удобно созвониться?",
    profileLabel: "Текст профиля",
    profilePlaceholder:
      "Вставьте About / Bio, пару постов или комментариев человека…",
    linkLabel: "Ссылка на профиль",
    linkHint: "(необязательно)",
    offerLabel: "Ваше шаблонное предложение",
    offerPlaceholder: "Что вы предлагаете — как написали бы всем одинаково…",
    channelLabel: "Канал",
    toneLabel: "Тон",
    submit: "Сгенерировать письмо",
    submitting: "Генерируем…",
    hint: "Заполните текст профиля и шаблон предложения",
    loading: "Анализируем профиль и пишем сообщение…",
    empty:
      "Здесь появятся извлечённые данные и готовое персонализированное сообщение",
    contactsTitle: "Контакты",
    signalsTitle: "Сигналы для зацепки",
    approachTitle: "Подход",
    messageTitle: "Персонализированное сообщение",
  },

  objectionkiller: {
    intro:
      "Опишите ситуацию с клиентом и возражение. Ассистент уточнит детали, а затем разберёт скрытую причину и даст готовые ответы.",
    placeholder:
      "Опишите ситуацию: что за клиент, что продаёте и какое возражение услышали…",
    example: "Клиент говорит «дорого» и уходит подумать.",
    fillExample: "Подставить пример",
    thinking: "Ассистент думает…",
    inputPlaceholderReply: "Ваш ответ ассистенту…",
    restart: "Новая ситуация",
    hiddenReasonTitle: "Что стоит за возражением",
    whyItWorks: "Почему работает:",
    recommendationTitle: "Рекомендация",
  },

  poaching: {
    nicheLabel: "Ваша ниша",
    nichePlaceholder:
      "например: доставка здоровой еды, фитнес-студия, SMM-агентство…",
    competitorsLabel: "Конкуренты",
    competitorsHint: "(необязательно, через запятую)",
    competitorsPlaceholder: "например: @competitor_food, @healthy_delivery",
    submit: "Найти лидов",
    submitting: "Ищем…",
    demoNote:
      "Люди и комментарии ниже сгенерированы AI как реалистичные примеры — это не реальные пользователи. Демо показывает, как движок находит клиентов у конкурентов. Реальный мониторинг — в PRO.",
    loading: "Сканируем комментарии у конкурентов…",
    empty:
      "Укажите нишу — движок найдёт людей, которые интересовались у конкурентов, и подскажет, как их переманить",
    summary: (niche, count) =>
      `найдено ${count} человек с интересом у конкурентов, отсортировано по перспективности:`,
    commentedUnder: "комментировал у",
    scoreLabel: "Оценка:",
    dmTitle: "Заход в ЛС",
    proTitle: "Poaching PRO — реальное переманивание",
    proIntro:
      "В боевой версии Poaching мониторит комментарии у ваших конкурентов и приводит их клиентов к вам:",
    proFeatures: [
      "Мониторинг комментариев под постами конкурентов в реальном времени",
      "Сбор людей с подтверждённым интересом — кто уже задавал вопросы",
      "Готовые тактичные заходы в ЛС и работа с возражениями",
      "Перевод заинтересованных в ваш Telegram-канал автоматически",
    ],
  },

  leadradar: {
    keywordLabel: "Ключевое слово или ниша",
    keywordPlaceholder:
      "например: ищу таргетолога, нужен сайт, автоматизация продаж…",
    offerLabel: "Что вы продаёте",
    offerHint: "(необязательно, точнее скоринг)",
    offerPlaceholder:
      "например: услуги по настройке таргета в Meta для малого бизнеса",
    submit: "Найти лидов",
    submitting: "Сканируем…",
    demoNote:
      "Посты ниже сгенерированы AI как реалистичные примеры — это не реальные люди из Threads. Демо показывает, как движок квалифицирует лидов. Реальный мониторинг — в PRO (см. ниже).",
    loading: "Сканируем Threads по запросу…",
    empty:
      "Введите ключевое слово — движок найдёт и оценит потенциальных клиентов, которые пишут об этом в Threads",
    summary: (keyword, count) =>
      `Найдено ${count} упоминаний по запросу «${keyword}», отсортировано по «теплоте»:`,
    scoreLabel: "Оценка:",
    draftTitle: "Черновик захода",
    proTitle: "LeadRadar PRO — реальный мониторинг",
    proIntro:
      "В боевой версии LeadRadar работает на реальных данных Threads и приносит горячих лидов сам:",
    proFeatures: [
      "Круглосуточный мониторинг Threads по вашим ключевым словам",
      "AI-классификация каждого поста: горячий / тёплый / не лид",
      "Мгновенные уведомления о горячих лидах в Telegram",
      "Дедупликация и фильтр по свежести — только новые упоминания",
    ],
  },

  commenthunter: {
    keywordLabel: "Ключевое слово или тема",
    keywordPlaceholder:
      "например: похудение, запуск бизнеса, изучение английского…",
    offerLabel: "Что вы продаёте",
    offerHint: "(необязательно, точнее скоринг)",
    offerPlaceholder: "например: онлайн-курс по английскому для взрослых",
    submit: "Найти в комментах",
    submitting: "Ищем…",
    demoNote:
      "Посты и комментарии ниже сгенерированы AI как реалистичные примеры — это не реальные люди. Демо показывает, как движок находит лидов в комментариях. Реальный мониторинг — в PRO.",
    loading: "Читаем комментарии под постами…",
    empty:
      "Введите тему — движок найдёт популярные посты и вытащит горячих лидов из комментариев под ними",
    summary: (keyword, posts, hot) =>
      `По теме «${keyword}» просканировано ${posts} постов, найдено ${hot} горячих лидов в комментариях:`,
    replyTitle: "Ответ на коммент",
    proTitle: "Comment Hunter PRO — реальный мониторинг",
    proIntro:
      "В боевой версии Comment Hunter отслеживает комментарии под постами по вашим темам и приносит лидов сам:",
    proFeatures: [
      "Мониторинг комментариев под трендовыми постами по вашим темам",
      "AI-скоринг каждого комментария: горячий / тёплый / не лид",
      "Уведомления о горячих комментаторах в Telegram",
      "Готовые черновики ответов для быстрого захода",
    ],
  },

  trendsniper: {
    keywordLabel: "Ключевое слово или тема",
    keywordPlaceholder:
      "например: нейросети для бизнеса, доставка суши, курсы Python…",
    regionLabel: "Регион фокуса",
    regionHint: "(необязательно)",
    regionPlaceholder: "например: Украина, Казахстан, СНГ",
    submit: "Анализ тренда",
    submitting: "Анализируем…",
    demoNote:
      "Оценки ниже — правдоподобная AI-аналитика на основе знаний модели, а не метрики Google Trends в реальном времени. Реальные данные — в PRO.",
    loading: "Считаем интерес по регионам…",
    empty:
      "Введите тему — движок оценит интерес, направление тренда, топ-регионы и связанные запросы",
    interestLevel: "Уровень интереса",
    regionsTitle: "Топ регионов по интересу",
    relatedTitle: "Связанные запросы",
    topQueries: "ПОПУЛЯРНЫЕ",
    risingQueries: "РАСТУЩИЕ",
    seasonalityTitle: "Сезонность",
    insightTitle: "Как использовать",
    proTitle: "Trend Sniper PRO — реальные данные Google Trends",
    proIntro:
      "В боевой версии Trend Sniper работает на реальных данных Google Trends:",
    proFeatures: [
      "Реальная динамика интереса из Google Trends за выбранный период",
      "Точная разбивка по странам, регионам и городам",
      "Растущие запросы (breakout) с процентом роста в реальном времени",
      "Отслеживание тем и авто-алерты о всплесках спроса в Telegram",
    ],
  },
};

const enTools: ToolsContent = {
  common: {
    genericError: "Something went wrong.",
    genericErrorRetry: "Something went wrong. Please try again.",
    networkError: "Network error. Please try again.",
    copy: "Copy",
    copied: "Copied",
    optional: "(optional)",
    send: "Send",
    demoLabel: "Demo mode.",
    proCta: "Get PRO",
    subject: "Subject:",
  },

  tones: ["Friendly", "Business formal", "Neutral", "Expert"],

  tiers: { hot: "Hot", warm: "Warm", cold: "Cold" },
  urgency: { high: "Urgent", medium: "Today", low: "Not urgent" },
  severity: { high: "critical", medium: "significant", low: "moderate" },
  direction: { rising: "Rising", falling: "Falling", stable: "Stable" },

  personachannel: {
    channelLabel: "What is your channel about",
    channelPlaceholder:
      "e.g. a Telegram channel about personal finance and investing for beginners",
    personaLabel: "Your persona",
    personaHint: "(optional — we'll infer it)",
    personaPlaceholder:
      "e.g. 25–35, salaried professionals, want passive income, afraid of losing money",
    submit: "Create content for this persona",
    submitting: "Creating content…",
    loading: "Studying the persona and writing posts…",
    empty:
      "Your persona profile and 5 ready posts written specifically for them will appear here",
    personaTitle: "Persona profile",
    toneLabel: "Tone:",
    tipsTitle: "How to run the channel for this persona",
  },

  followupbot: {
    contextLabel: "Deal context",
    contextPlaceholder:
      "What you pitched, how the customer reacted, where the conversation stalled, how long it's been…",
    channelLabel: "Channel",
    toneLabel: "Tone",
    submit: "Build the follow-up sequence",
    submitting: "Building the sequence…",
    loading: "Reading the situation and writing the sequence…",
    empty:
      "A sequence of 3 follow-up messages, each with a different angle, will appear here",
    situationTitle: "Reading the situation",
  },

  inboxzero: {
    formTitle: "Incoming email",
    emailLabel: "Email text",
    emailPlaceholder: "Paste the whole email (subject and signature are fine)…",
    intentLabel: "How to reply",
    intentHint: "(optional)",
    intentPlaceholder:
      "e.g. decline politely / accept and propose a call on Thursday",
    submit: "Triage this email",
    submitting: "Triaging…",
    loading: "Classifying and drafting a reply…",
    empty:
      "The classification, the gist, the action items, and a ready reply will appear here",
    noReplyNeeded: "No reply needed",
    tasksTitle: "Action items",
    replyTitle: "Ready reply",
  },

  bizdoctor: {
    intro:
      "Tell us about your business: niche, revenue, where customers come from, how conversion looks. The doctor will ask about your metrics and show where you're losing money.",
    fillExample: "Use an example",
    example:
      "Online cosmetics store, revenue ~$20k/month, 35% margin. Traffic from Instagram ads, we spend $3k/month. Site conversion 1.2%, average order $25, few repeat purchases.",
    thinking: "The doctor is analyzing…",
    inputPlaceholderEmpty: "Describe your business and the numbers…",
    inputPlaceholderReply: "Your answer…",
    restart: "New diagnosis",
    diagnosisTitle: "Diagnosis",
    leaksTitle: "Where the money leaks",
    recommendationsTitle: "Recommendations",
    quickWinTitle: "Quick win for this week",
  },

  coldmessage: {
    formTitle: "Input",
    fillExample: "Fill with an example",
    exampleProfile:
      "Anton Kravets — Head of Growth at a logistics SaaS (TrackFlow). I write about B2B marketing and cohort analysis. Last week I spoke at the SaaS Nova conference about retention. Into running and specialty coffee. We're hiring a strong performance marketer. Telegram: @anton_growth, email anton@trackflow.io",
    exampleOffer:
      "Hi! We build a service that automates cold outreach with AI personalization. We'd like to offer you a pilot. Would a call work?",
    profileLabel: "Profile text",
    profilePlaceholder:
      "Paste their About / Bio, a couple of posts, or some comments…",
    linkLabel: "Profile link",
    linkHint: "(optional)",
    offerLabel: "Your template pitch",
    offerPlaceholder: "What you're offering — as you'd write it to everyone…",
    channelLabel: "Channel",
    toneLabel: "Tone",
    submit: "Generate the message",
    submitting: "Generating…",
    hint: "Fill in the profile text and your template pitch",
    loading: "Analyzing the profile and writing the message…",
    empty:
      "The extracted details and your ready personalized message will appear here",
    contactsTitle: "Contacts",
    signalsTitle: "Signals to hook into",
    approachTitle: "Approach",
    messageTitle: "Personalized message",
  },

  objectionkiller: {
    intro:
      "Describe the situation and the objection. The assistant will ask for details, then uncover the hidden reason and give you ready responses.",
    placeholder:
      "Describe the situation: who the customer is, what you sell, and what objection you heard…",
    example: "The customer says it's too expensive and leaves to think about it.",
    fillExample: "Use an example",
    thinking: "The assistant is thinking…",
    inputPlaceholderReply: "Your answer to the assistant…",
    restart: "New situation",
    hiddenReasonTitle: "What's behind the objection",
    whyItWorks: "Why it works:",
    recommendationTitle: "Recommendation",
  },

  poaching: {
    nicheLabel: "Your niche",
    nichePlaceholder:
      "e.g. healthy meal delivery, fitness studio, social media agency…",
    competitorsLabel: "Competitors",
    competitorsHint: "(optional, comma-separated)",
    competitorsPlaceholder: "e.g. @competitor_food, @healthy_delivery",
    submit: "Find leads",
    submitting: "Searching…",
    demoNote:
      "The people and comments below are AI-generated realistic examples — not real users. The demo shows how the engine finds customers at your competitors. Real monitoring is in PRO.",
    loading: "Scanning your competitors' comments…",
    empty:
      "Name your niche — the engine will find people who were interested in your competitors and show you how to win them over",
    summary: (niche, count) =>
      `found ${count} people showing interest in competitors, sorted by how promising they are:`,
    commentedUnder: "commented under",
    scoreLabel: "Assessment:",
    dmTitle: "DM opener",
    proTitle: "Poaching PRO — real customer poaching",
    proIntro:
      "In the full version Poaching monitors your competitors' comments and brings their customers to you:",
    proFeatures: [
      "Real-time monitoring of comments under competitors' posts",
      "Collecting people with confirmed intent — those who already asked questions",
      "Ready tactful DM openers and objection handling",
      "Automatically moving interested people into your Telegram channel",
    ],
  },

  leadradar: {
    keywordLabel: "Keyword or niche",
    keywordPlaceholder:
      "e.g. looking for a media buyer, need a website, sales automation…",
    offerLabel: "What you sell",
    offerHint: "(optional, sharpens the scoring)",
    offerPlaceholder: "e.g. Meta ads setup for small businesses",
    submit: "Find leads",
    submitting: "Scanning…",
    demoNote:
      "The posts below are AI-generated realistic examples — not real people from Threads. The demo shows how the engine qualifies leads. Real monitoring is in PRO (see below).",
    loading: "Scanning Threads for your query…",
    empty:
      "Enter a keyword — the engine will find and score prospects posting about it on Threads",
    summary: (keyword, count) =>
      `Found ${count} mentions for “${keyword}”, sorted by how warm they are:`,
    scoreLabel: "Assessment:",
    draftTitle: "Draft opener",
    proTitle: "LeadRadar PRO — real monitoring",
    proIntro:
      "In the full version LeadRadar runs on real Threads data and brings hot leads to you on its own:",
    proFeatures: [
      "Round-the-clock Threads monitoring for your keywords",
      "AI classification of every post: hot / warm / not a lead",
      "Instant Telegram alerts for hot leads",
      "Deduplication and freshness filtering — new mentions only",
    ],
  },

  commenthunter: {
    keywordLabel: "Keyword or topic",
    keywordPlaceholder:
      "e.g. weight loss, starting a business, learning English…",
    offerLabel: "What you sell",
    offerHint: "(optional, sharpens the scoring)",
    offerPlaceholder: "e.g. an online English course for adults",
    submit: "Search the comments",
    submitting: "Searching…",
    demoNote:
      "The posts and comments below are AI-generated realistic examples — not real people. The demo shows how the engine finds leads in comments. Real monitoring is in PRO.",
    loading: "Reading the comments under the posts…",
    empty:
      "Enter a topic — the engine will find popular posts and pull hot leads out of the comments under them",
    summary: (keyword, posts, hot) =>
      `Scanned ${posts} posts on “${keyword}” and found ${hot} hot leads in the comments:`,
    replyTitle: "Reply to the comment",
    proTitle: "Comment Hunter PRO — real monitoring",
    proIntro:
      "In the full version Comment Hunter tracks comments under posts on your topics and brings you leads automatically:",
    proFeatures: [
      "Monitoring comments under trending posts on your topics",
      "AI scoring of every comment: hot / warm / not a lead",
      "Telegram alerts about hot commenters",
      "Ready reply drafts for a fast approach",
    ],
  },

  trendsniper: {
    keywordLabel: "Keyword or topic",
    keywordPlaceholder:
      "e.g. AI for business, sushi delivery, Python courses…",
    regionLabel: "Focus region",
    regionHint: "(optional)",
    regionPlaceholder: "e.g. United States, Germany, Europe",
    submit: "Analyze the trend",
    submitting: "Analyzing…",
    demoNote:
      "The scores below are plausible AI analysis based on the model's knowledge, not live Google Trends metrics. Real data is in PRO.",
    loading: "Calculating interest by region…",
    empty:
      "Enter a topic — the engine will score interest, the trend direction, the top regions, and related queries",
    interestLevel: "Interest level",
    regionsTitle: "Top regions by interest",
    relatedTitle: "Related queries",
    topQueries: "TOP",
    risingQueries: "RISING",
    seasonalityTitle: "Seasonality",
    insightTitle: "How to use this",
    proTitle: "Trend Sniper PRO — real Google Trends data",
    proIntro:
      "In the full version Trend Sniper runs on real Google Trends data:",
    proFeatures: [
      "Real interest dynamics from Google Trends over the period you choose",
      "Precise breakdown by country, region, and city",
      "Breakout queries with real-time growth percentages",
      "Topic tracking and automatic Telegram alerts when demand spikes",
    ],
  },
};

const TOOL_DICTIONARIES: Record<Locale, ToolsContent> = {
  ru: ruTools,
  en: enTools,
};

export function getTools(locale: Locale): ToolsContent {
  return TOOL_DICTIONARIES[locale];
}
