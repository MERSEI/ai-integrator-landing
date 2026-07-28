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

export type Stat = { value: string; label: string };

export type PricingTier = {
  name: string;
  setup: number;
  price: number;
  popular: boolean;
  audience: string;
  features: string[];
  cta: string;
};

export type FaqItem = { question: string; answer: string };

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
    trust: string[];
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
    rating: string;
    ratingAria: string;
    advantages: { title: string; description: string }[];
    testimonials: Testimonial[];
    stats: Stat[];
    portraitAlt: (name: string) => string;
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
    footnote: string;
  };

  faq: {
    title: string;
    items: FaqItem[];
  };

  finalCta: {
    title: string;
    subtitle: string;
    cta: string;
    trust: string[];
    contactLead: string;
    emailLabel: string;
    phoneLabel: string;
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
  };
};
