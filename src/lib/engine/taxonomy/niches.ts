import type { Bank, EngineLocale } from "../types";

/**
 * Классификатор ниши по тексту запроса и словарь под неё.
 *
 * Четыре инструмента с выдуманными демо-данными (LeadRadar, Poaching,
 * CommentHunter, TrendSniper) строят посты из шаблонов, а конкретику берут
 * отсюда: чем в этой нише мучаются, что считают результатом, как называют
 * исполнителя. Без словаря все ниши звучали бы одинаково.
 *
 * `generic` — не заглушка, а полноценная ветка: она подставляет само
 * ключевое слово пользователя. Читаемость generic важнее, чем добавление
 * одиннадцатой ниши, потому что именно в неё попадают неожиданные запросы.
 */

export type NicheId =
  | "beauty"
  | "fitness"
  | "marketing"
  | "it"
  | "education"
  | "ecom"
  | "food"
  | "realestate"
  | "finance"
  | "generic";

export type NicheVocab = {
  /** Обобщение ключевого слова: «бьюти-услуги», «онлайн-курсы». */
  label: string;
  /** Боли клиента — из них строятся горячие лиды. */
  pain: string[];
  /** Что в этой нише считают результатом. */
  outcome: string[];
  /** Как называют исполнителя: мастер, подрядчик, студия. */
  actor: string[];
  /** Корни для @ников конкурентов, латиницей. */
  competitorRoots: string[];
  /** Смежные запросы для TrendSniper. */
  relatedTerms: string[];
};

export type Niche = {
  id: NicheId;
  /** Маркеры ru и en в одном выражении: русский пользователь пишет и латиницей. */
  match: RegExp;
  vocab: Bank<NicheVocab>;
};

const NICHES: Niche[] = [
  {
    id: "beauty",
    match: /маникюр|педикюр|бров|ресниц|космет|салон красот|парикмах|стрижк|барбер|шугар|эпиляц|nail|brow|lash|beauty salon|barber|hairdress|cosmet/i,
    vocab: {
      ru: {
        label: "бьюти-услуги",
        pain: [
          "запись висит пустой в будни",
          "клиенты пропадают после первого визита",
          "мастера уходят и уводят клиентов",
          "переписка в директе съедает весь вечер",
          "конкуренты рядом демпингуют",
          "нет отзывов, а без них не приходят",
        ],
        outcome: [
          "заполненная запись на две недели вперёд",
          "клиенты возвращаются каждый месяц",
          "запись без единого сообщения вручную",
          "средний чек выше на треть",
          "очередь из своих, а не с агрегаторов",
        ],
        actor: ["мастера", "студию", "салон"],
        competitorRoots: ["nail", "brow", "beauty", "studio", "lash"],
        relatedTerms: ["обучение", "цена", "рядом со мной", "отзывы", "материалы"],
      },
      en: {
        label: "beauty services",
        pain: [
          "the calendar sits empty on weekdays",
          "clients never come back after the first visit",
          "stylists leave and take clients with them",
          "DMs eat the entire evening",
          "the salon next door keeps undercutting us",
          "no reviews, and without them nobody books",
        ],
        outcome: [
          "a calendar booked two weeks out",
          "clients coming back every month",
          "bookings without a single manual message",
          "an average ticket a third higher",
          "a waitlist of my own clients, not marketplace traffic",
        ],
        actor: ["a stylist", "a studio", "a salon"],
        competitorRoots: ["nail", "brow", "beauty", "studio", "lash"],
        relatedTerms: ["training", "prices", "near me", "reviews", "supplies"],
      },
    },
  },
  {
    id: "fitness",
    match: /фитнес|трениров|тренер|зал|йог|пилат|похуд|нутрициол|кроссфит|бассейн|fitness|gym|trainer|yoga|pilates|workout|nutrition/i,
    vocab: {
      ru: {
        label: "фитнес и тренировки",
        pain: [
          "клиенты бросают после второго месяца",
          "абонементы продаются, а ходят единицы",
          "январский наплыв заканчивается в марте",
          "тренеры уводят клиентов на частные",
          "не получается продать продление",
          "новички стесняются и не доходят",
        ],
        outcome: [
          "клиенты продлевают без напоминаний",
          "заполненные групповые в непиковые часы",
          "стабильный поток новичков круглый год",
          "продления на автомате",
          "личные тренировки расписаны на месяц",
        ],
        actor: ["тренера", "клуб", "студию"],
        competitorRoots: ["fit", "gym", "power", "body", "coach"],
        relatedTerms: ["программа", "абонемент", "для начинающих", "дома", "питание"],
      },
      en: {
        label: "fitness and training",
        pain: [
          "clients quit after the second month",
          "memberships sell but nobody shows up",
          "the January rush dies by March",
          "trainers move clients to private sessions",
          "renewals just don't close",
          "beginners feel awkward and never come in",
        ],
        outcome: [
          "clients renewing without a reminder",
          "full group classes in off-peak hours",
          "a steady stream of beginners year-round",
          "renewals running on autopilot",
          "personal training booked a month out",
        ],
        actor: ["a trainer", "a club", "a studio"],
        competitorRoots: ["fit", "gym", "power", "body", "coach"],
        relatedTerms: ["program", "membership", "for beginners", "at home", "nutrition"],
      },
    },
  },
  {
    id: "marketing",
    match: /маркет|реклам|таргет|smm|seo|трафик|лидоген|контекст|директ|бренд|pr\b|market|advertis|traffic|lead gen|agency|brand/i,
    vocab: {
      ru: {
        label: "маркетинг и реклама",
        pain: [
          "лиды дорожают каждый месяц",
          "заявки есть, а продаж нет",
          "клиент требует отчёт, а цифры не сходятся",
          "открутили бюджет и не поняли, что сработало",
          "подрядчик пропал на середине проекта",
          "гипотезы тестируются по две недели каждая",
        ],
        outcome: [
          "стоимость лида ниже вдвое",
          "понятная воронка от клика до денег",
          "отчёт собирается сам",
          "гипотезы проверяются за день",
          "заявки квалифицируются до звонка",
        ],
        actor: ["подрядчика", "агентство", "специалиста"],
        competitorRoots: ["media", "digital", "growth", "ads", "lab"],
        relatedTerms: ["кейсы", "цена", "аудит", "стратегия", "инструменты"],
      },
      en: {
        label: "marketing and advertising",
        pain: [
          "leads get more expensive every month",
          "we get enquiries but no sales",
          "the client wants a report and the numbers don't add up",
          "we burned the budget and still don't know what worked",
          "the contractor vanished halfway through",
          "every hypothesis takes two weeks to test",
        ],
        outcome: [
          "cost per lead cut in half",
          "a clear funnel from click to revenue",
          "reports that build themselves",
          "hypotheses tested in a day",
          "leads qualified before the call",
        ],
        actor: ["a contractor", "an agency", "a specialist"],
        competitorRoots: ["media", "digital", "growth", "ads", "lab"],
        relatedTerms: ["case studies", "pricing", "audit", "strategy", "tools"],
      },
    },
  },
  {
    id: "it",
    match: /разработ|программ|сайт|приложен|crm|интеграц|автоматизац|ai|нейросет|бот|devops|облак|develop|software|website|app\b|integration|automation|saas|api\b/i,
    vocab: {
      ru: {
        label: "разработка и автоматизация",
        pain: [
          "интеграции ломаются после каждого релиза",
          "данные лежат в трёх системах и не сходятся",
          "команда занята поддержкой вместо продукта",
          "подрядчик сдал проект и пропал",
          "половина процессов живёт в экселе",
          "сроки едут на каждом спринте",
        ],
        outcome: [
          "процессы работают без ручных правок",
          "данные в одном месте и сходятся",
          "релиз без страха что-то уронить",
          "внедрение за неделю, а не за квартал",
          "поддержка перестала съедать команду",
        ],
        actor: ["подрядчика", "команду", "интегратора"],
        competitorRoots: ["dev", "code", "tech", "soft", "lab"],
        relatedTerms: ["интеграция", "цена", "документация", "аналоги", "внедрение"],
      },
      en: {
        label: "software and automation",
        pain: [
          "integrations break after every release",
          "data lives in three systems and never matches",
          "the team maintains instead of building",
          "the contractor shipped and disappeared",
          "half the process still runs in spreadsheets",
          "deadlines slip every single sprint",
        ],
        outcome: [
          "processes running without manual fixes",
          "one source of truth for the data",
          "releases that don't feel risky",
          "a rollout in a week, not a quarter",
          "support no longer eating the team",
        ],
        actor: ["a contractor", "a team", "an integrator"],
        competitorRoots: ["dev", "code", "tech", "soft", "lab"],
        relatedTerms: ["integration", "pricing", "docs", "alternatives", "onboarding"],
      },
    },
  },
  {
    id: "education",
    match: /курс|обучен|школ|репетит|вебинар|тренинг|наставни|образован|course|school|tutor|training|webinar|educat|bootcamp/i,
    vocab: {
      ru: {
        label: "обучение и курсы",
        pain: [
          "до конца курса доходит четверть потока",
          "вебинары смотрят, а не покупают",
          "возвраты съедают маржу",
          "поток набирается, а следующий уже нет",
          "проверка домашних отнимает всё время",
          "ученики пропадают на третьей неделе",
        ],
        outcome: [
          "доходимость выше в два раза",
          "поток набирается без прогрева вручную",
          "домашние проверяются наполовину быстрее",
          "ученики доходят до результата и приводят своих",
          "продажи следующего потока с текущего",
        ],
        actor: ["школу", "автора", "методиста"],
        competitorRoots: ["school", "academy", "learn", "course", "skill"],
        relatedTerms: ["отзывы", "стоимость", "с нуля", "бесплатно", "программа"],
      },
      en: {
        label: "courses and education",
        pain: [
          "only a quarter of the cohort finishes",
          "people watch the webinar and don't buy",
          "refunds eat the margin",
          "one cohort fills and the next one doesn't",
          "grading homework takes the whole week",
          "students drop off in week three",
        ],
        outcome: [
          "completion rate doubled",
          "cohorts filling without manual nurturing",
          "homework graded twice as fast",
          "students reaching results and referring others",
          "the next cohort sold from the current one",
        ],
        actor: ["a school", "an instructor", "a course team"],
        competitorRoots: ["school", "academy", "learn", "course", "skill"],
        relatedTerms: ["reviews", "cost", "from scratch", "free", "curriculum"],
      },
    },
  },
  {
    id: "ecom",
    match: /магазин|товар|маркетплейс|wildberries|ozon|доставк|склад|логист|дропшип|shop|store|ecommerce|marketplace|amazon|shopify|retail/i,
    vocab: {
      ru: {
        label: "интернет-торговля",
        pain: [
          "корзину бросают на последнем шаге",
          "возвраты съедают всю маржу",
          "остатки не сходятся с реальностью",
          "карточки не выходят в топ",
          "отзывы приходится выпрашивать",
          "поддержка отвечает по три часа",
        ],
        outcome: [
          "брошенные корзины возвращаются сами",
          "остатки сходятся без ручной сверки",
          "поддержка отвечает за минуту",
          "повторные покупки выросли вдвое",
          "карточки собирают отзывы на автомате",
        ],
        actor: ["магазин", "продавца", "бренд"],
        competitorRoots: ["shop", "store", "market", "goods", "trade"],
        relatedTerms: ["отзывы", "цена", "доставка", "аналоги", "промокод"],
      },
      en: {
        label: "e-commerce",
        pain: [
          "carts get abandoned at the last step",
          "returns eat the entire margin",
          "stock levels never match reality",
          "listings don't rank",
          "reviews have to be begged for",
          "support replies in three hours",
        ],
        outcome: [
          "abandoned carts recovering themselves",
          "stock reconciled without manual work",
          "support replying in under a minute",
          "repeat purchases doubled",
          "listings collecting reviews automatically",
        ],
        actor: ["a store", "a seller", "a brand"],
        competitorRoots: ["shop", "store", "market", "goods", "trade"],
        relatedTerms: ["reviews", "price", "shipping", "alternatives", "promo code"],
      },
    },
  },
  {
    id: "food",
    match: /ресторан|кафе|кофейн|достав(ка|ку) еды|кухн|бар\b|пекарн|кейтеринг|restaurant|cafe|coffee|bakery|catering|food delivery|kitchen/i,
    vocab: {
      ru: {
        label: "общепит",
        pain: [
          "будни пустые, выходные не вытягивают",
          "агрегаторы забирают треть чека",
          "гости приходят один раз",
          "персонал текучий, качество скачет",
          "бронь теряется в переписке",
          "списания по кухне не контролируются",
        ],
        outcome: [
          "заполненные будние вечера",
          "заказы напрямую, без комиссии агрегатора",
          "гости возвращаются каждую неделю",
          "бронь не теряется вообще",
          "списания под контролем",
        ],
        actor: ["заведение", "кофейню", "ресторан"],
        competitorRoots: ["cafe", "coffee", "kitchen", "food", "bar"],
        relatedTerms: ["меню", "рядом", "доставка", "отзывы", "бронь"],
      },
      en: {
        label: "food service",
        pain: [
          "weekdays are empty and weekends don't cover it",
          "delivery apps take a third of the ticket",
          "guests come once and never return",
          "staff turnover keeps quality swinging",
          "reservations get lost in the DMs",
          "kitchen waste is completely untracked",
        ],
        outcome: [
          "weekday evenings actually full",
          "direct orders without the app's cut",
          "guests coming back every week",
          "not a single lost reservation",
          "waste under control",
        ],
        actor: ["a venue", "a coffee shop", "a restaurant"],
        competitorRoots: ["cafe", "coffee", "kitchen", "food", "bar"],
        relatedTerms: ["menu", "near me", "delivery", "reviews", "reservation"],
      },
    },
  },
  {
    id: "realestate",
    match: /недвижим|квартир|риелт|аренд|новостро|ипотек|коммерческ.{0,3} помещ|real estate|realtor|apartment|rental|mortgage|property/i,
    vocab: {
      ru: {
        label: "недвижимость",
        pain: [
          "лиды с площадок холодные и дорогие",
          "показы срываются в последний момент",
          "клиент уходит к другому агенту",
          "объекты висят месяцами",
          "звонки приходят вне рабочего времени",
          "документы собираются неделю",
        ],
        outcome: [
          "лиды квалифицируются до показа",
          "показы не срываются",
          "объект уходит за две недели",
          "звонки обрабатываются круглосуточно",
          "документы собираются за день",
        ],
        actor: ["агента", "агентство", "застройщика"],
        competitorRoots: ["estate", "home", "realty", "dom", "keys"],
        relatedTerms: ["цена", "ипотека", "рядом", "новостройка", "документы"],
      },
      en: {
        label: "real estate",
        pain: [
          "portal leads are cold and expensive",
          "showings fall through at the last minute",
          "the client walks to another agent",
          "listings sit for months",
          "calls come in after hours",
          "paperwork takes a week to assemble",
        ],
        outcome: [
          "leads qualified before the showing",
          "showings that don't fall through",
          "listings moving in two weeks",
          "calls handled around the clock",
          "paperwork assembled in a day",
        ],
        actor: ["an agent", "an agency", "a developer"],
        competitorRoots: ["estate", "home", "realty", "keys", "living"],
        relatedTerms: ["price", "mortgage", "near me", "new build", "paperwork"],
      },
    },
  },
  {
    id: "finance",
    match: /бухгалт|финанс|налог|юрист|аудит|инвест|страхов|кредит|account|financ|tax|legal|lawyer|audit|insurance|invest/i,
    vocab: {
      ru: {
        label: "финансы и право",
        pain: [
          "клиенты приносят документы в последний день",
          "сезон закрытия убивает всю команду",
          "консультации не конвертируются в договор",
          "рутина съедает время на сложных клиентах",
          "клиент не понимает, за что платит",
          "напоминания об оплате приходится слать руками",
        ],
        outcome: [
          "документы собираются заранее и сами",
          "сезон проходит без переработок",
          "консультация превращается в договор",
          "рутина закрыта, время на сложное",
          "оплаты приходят без напоминаний",
        ],
        actor: ["бухгалтера", "консультанта", "фирму"],
        competitorRoots: ["fin", "account", "legal", "audit", "capital"],
        relatedTerms: ["стоимость", "онлайн", "для ип", "отзывы", "консультация"],
      },
      en: {
        label: "finance and legal",
        pain: [
          "clients send documents on the last day",
          "closing season wrecks the whole team",
          "consultations don't convert to retainers",
          "admin work eats the time for complex clients",
          "the client doesn't understand what they're paying for",
          "payment reminders go out by hand",
        ],
        outcome: [
          "documents collected early and automatically",
          "a season without overtime",
          "consultations turning into retainers",
          "admin cleared, time freed for real work",
          "payments arriving without reminders",
        ],
        actor: ["an accountant", "a consultant", "a firm"],
        competitorRoots: ["fin", "account", "legal", "audit", "capital"],
        relatedTerms: ["cost", "online", "for small business", "reviews", "consultation"],
      },
    },
  },
];

/**
 * Ветка для всего, что не опознали. Подставляет само ключевое слово —
 * человек должен увидеть в ответе то, что он написал, даже если ниша
 * незнакомая.
 */
const GENERIC: Niche = {
  id: "generic",
  match: /(?!)/,
  vocab: {
    ru: {
      label: "ниша",
      pain: [
        "заявок мало, а те что есть — не целевые",
        "клиенты сравнивают и уходят к дешевле",
        "рутина съедает рабочий день целиком",
        "непонятно, откуда вообще приходят клиенты",
        "разбор входящих отнимает половину времени",
        "повторных обращений почти нет",
      ],
      outcome: [
        "поток заявок стал предсказуемым",
        "рутина закрыта, время освободилось",
        "видно, что реально приносит клиентов",
        "клиенты возвращаются сами",
        "входящие разбираются без ручной работы",
      ],
      actor: ["исполнителя", "подрядчика", "команду"],
      competitorRoots: ["pro", "hub", "team", "group", "lab"],
      relatedTerms: ["цена", "отзывы", "как выбрать", "рядом", "аналоги"],
    },
    en: {
      label: "the niche",
      pain: [
        "few enquiries, and the ones we get aren't a fit",
        "clients compare and leave for someone cheaper",
        "admin work swallows the entire day",
        "no idea where clients actually come from",
        "sorting the inbox takes half the day",
        "almost nobody comes back",
      ],
      outcome: [
        "a predictable flow of enquiries",
        "admin cleared and time freed up",
        "clear visibility into what actually brings clients",
        "clients coming back on their own",
        "the inbox sorted without manual work",
      ],
      actor: ["a provider", "a contractor", "a team"],
      competitorRoots: ["pro", "hub", "team", "group", "lab"],
      relatedTerms: ["price", "reviews", "how to choose", "near me", "alternatives"],
    },
  },
};

/** Ниша по тексту запроса. Ничего не совпало — generic. */
export function classifyNiche(text: string): Niche {
  return NICHES.find((n) => n.match.test(text)) ?? GENERIC;
}

/** Словарь ниши на нужном языке. */
export function nicheVocab(niche: Niche, locale: EngineLocale): NicheVocab {
  return niche.vocab[locale];
}

export const ALL_NICHES: readonly Niche[] = [...NICHES, GENERIC];
