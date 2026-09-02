import type { ContactChannel } from "../contactChannel";
import type { RoiPresetKey } from "../roiPresets";

/**
 * Типы словаря контента. Оба языка обязаны реализовать `Content` целиком —
 * забытый перевод падает на этапе сборки, а не находится глазами на проде.
 *
 * Статусы приложений:
 * - live: реальный AI-инструмент (работает на данных пользователя)
 * - demo: интерактивное демо на AI-примерах (реальные данные — в PRO)
 * - soon: Coming Soon
 */
export type AppStatus = "live" | "demo" | "soon";

/** Ключ категории стабилен между языками, подпись — переводится. */
export type CategoryKey = "all" | "attract" | "sales" | "content" | "analytics";

export type App = {
  id: string;
  name: string;
  tagline: string;
  category: Exclude<CategoryKey, "all">;
  image: string;
  /** Нет у приложений без своей страницы (status: "soon"). */
  href?: string;
  status: AppStatus;
  description: string;
  result: string;
};

export type SoonApp = { id: string; name: string; tagline: string };

export type Step = {
  number: string;
  time: string;
  title: string;
  image: string;
  imageAlt: string;
  points: string[];
};

export type Testimonial = {
  name: string;
  company: string;
  image: string;
  task: string;
  solution: string;
  result: string;
  quote: string;
};

export type PricingTier = {
  name: string;
  setup: number;
  price: number;
  popular: boolean;
  audience: string;
  features: string[];
  cta: string;
  /** Одной строкой: кому и зачем этот тариф — идёт под названием. */
  tagline: string;
  /** Бейдж поверх карточки. У популярного тарифа берётся popularBadge. */
  badge?: string;
};

export type FaqItem = { question: string; answer: string };

/**
 * Граф сценария автоматизации — узлы идут строго по цепочке слева направо
 * (на мобильном — сверху вниз), поэтому связи выводятся из порядка массива,
 * а не хранятся отдельно.
 */
export type ScenarioNodeKind = "trigger" | "agent" | "action";

export type ScenarioNode = {
  kind: ScenarioNodeKind;
  /** Что происходит: «Новый лид в CRM». */
  label: string;
  /** Чем именно: «Webhook», «Gemini», «Telegram». */
  meta: string;
};

export type Scenario = {
  id: string;
  /** Подпись вкладки переключателя. */
  label: string;
  nodes: ScenarioNode[];
};

/** id страниц приложений — у каждого своя страница с демо-инструментом. */
export type AppPageId =
  | "poaching"
  | "bizdoctor"
  | "coldmessage"
  | "objectionkiller"
  | "personachannel"
  | "followupbot"
  | "inboxzero"
  | "leadradar"
  | "commenthunter"
  | "trendsniper";

export type AppPageCopy = {
  metaTitle: string;
  metaDescription: string;
  badge: string;
  /** Заголовок собирается как `{titleLead}{titleAccent}`, акцент — с градиентом. */
  titleLead: string;
  titleAccent: string;
  subtitle: string;
  pro?: { title: string; intro: string; features: string[] };
  disclaimer?: string;
};

export type Content = {
  /** Значение атрибута lang у <html>. */
  htmlLang: string;

  meta: {
    title: string;
    description: string;
    ogAlt: string;
  };

  statusLabels: Record<AppStatus, string>;
  categories: { key: CategoryKey; label: string }[];

  featuredApps: App[];
  standaloneApps: App[];
  soonApps: SoonApp[];

  nav: {
    apps: string;
    howItWorks: string;
    pricing: string;
    faq: string;
    results: string;
    calculator: string;
    moreTools: string;
    seeAllApps: string;
    soonBadge: string;
    telegram: string;
    cta: string;
    mainNavLabel: string;
    mobileNavLabel: string;
    openMenu: string;
    closeMenu: string;
    switchLanguage: string;
    /** Шапка страниц приложений. */
    allApps: string;
    back: string;
  };

  hero: {
    badge: string;
    headingLead: string;
    headingAccent: string;
    subtitle: string;
    cta: string;
    /** Ссылка-приглашение сначала посмотреть живые демо, не оставляя email. */
    secondaryCta: string;
    /** Второй путь для тех, кто не хочет оставлять email, — написать в Telegram. */
    telegramCta: string;
    /** Разделитель между формой и кнопкой Telegram: «или». */
    orLabel: string;
    trust: string[];
  };

  /** Полоса фактов сразу под hero — без выдуманных цифр, только проверяемое. */
  trustBar: {
    items: string[];
  };

  /** Витрина графа сценариев — центральный визуал вместо видео-фона. */
  scenarios: {
    title: string;
    subtitle: string;
    kindLabels: Record<ScenarioNodeKind, string>;
    items: Scenario[];
  };

  problems: {
    titleLead: string;
    titleAccent: string;
    items: string[];
    boxTitle: string;
    boxItems: string[];
    imageAlt: string;
  };

  features: {
    title: string;
    subtitle: string;
    imageAlt: string;
    categoriesLabel: string;
    open: string;
    soonTitle: string;
  };

  howItWorks: {
    title: string;
    subtitle: string;
    steps: Step[];
    outroLead: string;
    outroAccent: string;
  };

  results: {
    title: string;
    subtitle: string;
    advantages: { title: string; description: string }[];
    testimonials: Testimonial[];
    /** Честная замена непроверяемой статистике — CTA на живые демо вместо цифр. */
    demoCta: { title: string; subtitle: string; ctaLabel: string };
    portraitAlt: (name: string) => string;
    /** Разметка мини-кейса: задача → что внедрили → результат. */
    caseLabels: { challenge: string; solution: string; result: string };
  };

  /** Интерактивный расчёт потенциала — стоит между соцдоказательством и ценами. */
  roiCalculator: {
    title: string;
    subtitle: string;
    dealsLabel: string;
    dealValueLabel: string;
    hoursLabel: string;
    hoursUnit: string;
    hourlyRateLabel: string;
    tierLabel: string;
    resultTitle: string;
    timeSavedLabel: string;
    extraRevenueLabel: string;
    totalLabel: string;
    perMonthSuffix: string;
    planCostLabel: string;
    paybackLabel: (months: number) => string;
    paybackNever: string;
    ctaTitle: string;
    ctaSubtitle: string;
    submitCta: string;
    assumptions: string;
    disclaimer: string;
    /** Пресеты отраслей: подставляют типовые вводные в ползунки. */
    presetsLabel: string;
    presets: Record<RoiPresetKey, string>;
    /** Кнопка под расчётом: уносит посчитанные цифры в заявку. */
    lockCta: (amount: string) => string;
    lockCtaHint: string;
    modalTitle: string;
    modalSubtitle: (amount: string) => string;
    modalSummaryTitle: string;
    modalClose: string;
    industryLabel: string;
    charts: {
      paybackTitle: string;
      paybackSubtitle: string;
      benefitSeries: string;
      costSeries: string;
      monthShort: (n: number) => string;
      breakEven: (month: number) => string;
      hoursTitle: string;
      hoursSubtitle: string;
      hoursBefore: string;
      hoursAfter: string;
      hoursPerMonth: (n: number) => string;
      tableToggle: string;
      tableMonth: string;
      estimateNote: string;
    };
  };

  /** Универсальный CTA после демо-инструмента — показывается на всех /apps/*. */
  demoConvert: {
    titleTemplate: (appName: string) => string;
    subtitle: string;
    ctaLabel: string;
    telegramCta: string;
  };

  pricing: {
    title: string;
    subtitle: string;
    imageAlt: string;
    tiers: PricingTier[];
    /** Идёт сразу после суммы: "$155 за сборку". */
    setupSuffix: string;
    thenPrefix: string;
    perMonth: string;
    supportSuffix: string;
    popularBadge: string;
    /** Строка про гарантию возврата — рядом с тарифами, а не только в FAQ. */
    guarantee: string;
    footnote: string;
    /** Из чего складывается цена: разбивка «сборка + абонплата». */
    setupTooltip: string;
    monthlyTooltip: string;
    breakdownLabel: string;
  };

  faq: {
    title: string;
    items: FaqItem[];
  };

  finalCta: {
    title: string;
    subtitle: string;
    cta: string;
    telegramCta: string;
    orLabel: string;
    trust: string[];
    contactLead: string;
    emailLabel: string;
    phoneLabel: string;
  };

  /** Мини-плейграунд агента прямо на лендинге. */
  liveDemo: {
    badge: string;
    title: string;
    subtitle: string;
    roleLabel: string;
    roles: { key: string; label: string; prompt: string }[];
    placeholder: string;
    examplesLabel: string;
    send: string;
    thinking: string;
    reset: string;
    disclaimer: string;
    cta: string;
    emptyState: string;
  };

  /** Лента реальных запусков демо-инструментов. */
  activity: {
    title: string;
    runLabel: (tool: string) => string;
    justNow: string;
    minutesAgo: (n: number) => string;
    hoursAgo: (n: number) => string;
    close: string;
  };

  footer: {
    tagline: string;
    productTitle: string;
    contactsTitle: string;
    links: { href: string; label: string }[];
  };

  form: {
    emailLabel: string;
    placeholder: string;
    required: string;
    invalid: string;
    submitting: string;
    genericError: string;
    networkError: string;
    /** Необязательный select "что автоматизировать" — квалифицирует лид сразу. */
    interestLabel: string;
    interestPlaceholder: string;
    interestOther: string;
    /** Выбор канала связи: где лиду удобнее продолжить разговор. */
    channelLabel: string;
    channelOptions: Record<ContactChannel, string>;
    /** Подпись и плейсхолдер поля контакта — свои у каждого канала. */
    contactLabels: Record<ContactChannel, string>;
    contactPlaceholders: Record<ContactChannel, string>;
    contactRequired: string;
    contactInvalid: string;
    /** Пояснение под выбором канала — почему email всё равно спрашиваем. */
    channelHint: string;
  };

  pro: {
    cta: string;
  };

  appPages: Record<AppPageId, AppPageCopy>;

  thankYou: {
    metaTitle: string;
    title: string;
    subtitle: string;
    cta: string;
    /** Пока лид «горячий» — предлагаем написать сразу, не дожидаясь ответа. */
    telegramLead: string;
    telegramCta: string;
  };
};
