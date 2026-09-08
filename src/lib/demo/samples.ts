import type { EngineLocale } from "@/lib/engine/types";

/**
 * Примеры ввода для демо-инструментов.
 *
 * До этого каждый инструмент открывался пустой формой и пустым результатом:
 * чтобы понять, работает ли он вообще, посетителю нужно было сначала
 * придумать и напечатать вводные. Теперь поля заполнены осмысленным
 * примером, и от посадки до результата — одно нажатие.
 *
 * Примеры намеренно из разных ниш: страница инструмента часто первая, куда
 * человек попадает из рекламы, и она должна показать широту, а не один сценарий.
 */

export type ToolSample = Record<string, string>;

type SampleMap = Record<string, Record<EngineLocale, ToolSample>>;

export const TOOL_SAMPLES: SampleMap = {
  leadradar: {
    ru: { keyword: "ремонт квартир под ключ", product: "бригада с фиксированной сметой" },
    en: { keyword: "kitchen renovation", product: "fixed-price crew, no change orders" },
  },
  poaching: {
    ru: { niche: "барбершоп в центре", competitors: "@topbarber, @sharp_studio" },
    en: { niche: "barbershop downtown", competitors: "@topbarber, @sharp_studio" },
  },
  commenthunter: {
    ru: { keyword: "продвижение в телеграм", product: "настройка воронки за 2 недели" },
    en: { keyword: "telegram marketing", product: "a funnel set up in two weeks" },
  },
  trendsniper: {
    ru: { keyword: "нейросети для бизнеса", region: "Москва" },
    en: { keyword: "ai agents for business", region: "United States" },
  },
  coldmessage: {
    ru: {
      profileText:
        "Анна Ковалёва, основатель студии керамики «Глина» в Санкт-Петербурге. Второй год ведём мастер-классы, недавно открыли вторую точку на Петроградской. Сейчас ищем администратора — запись ведём вручную в блокноте, половина заявок из директа теряется. anna@glina-studio.ru, @glina_spb",
      offerTemplate:
        "Мы настраиваем автоматическую запись и ответы на заявки в директе, чтобы ничего не терялось.",
      channel: "Email",
      tone: "Деловой (на вы)",
      sourceLink: "",
    },
    en: {
      profileText:
        "Anna Kovaleva, founder of the Glina ceramics studio in Brooklyn. Two years of running workshops, just opened a second location. Currently hiring a front-desk manager — bookings are tracked in a paper notebook and half the DM enquiries get lost. anna@glina-studio.com, @glina_bk",
      offerTemplate:
        "We set up automatic booking and DM replies so nothing gets lost.",
      channel: "Email",
      tone: "Business formal",
      sourceLink: "",
    },
  },
  followupbot: {
    ru: {
      context:
        "Отправили КП директору небольшой сети кофеен две недели назад: автоматизация заказов и учёт списаний, 180 тысяч за внедрение. Он ответил «интересно, вернусь после отпуска» и с тех пор молчит. До этого созванивались дважды, всё нравилось.",
      channel: "Email",
      tone: "Деловой (на вы)",
    },
    en: {
      context:
        "Sent a proposal to the director of a small coffee-shop chain two weeks ago: order automation and waste tracking, $2,400 to implement. He replied 'interesting, I'll come back after my holiday' and has been silent since. We'd had two good calls before that.",
      channel: "Email",
      tone: "Business formal",
    },
  },
  inboxzero: {
    ru: {
      email:
        "Тема: Счёт №1841 и сроки по этапу 2\n\nДобрый день!\n\nВысылаю счёт №1841 на 96 000 ₽ за первый этап — оплатить нужно до 25 числа, иначе сдвинется вся смета.\n\nИ отдельный вопрос: сможете подтвердить, что второй этап стартует 3 числа? Нам нужно заранее забронировать подрядчика.\n\nС уважением,\nМихаил Орлов",
      instruction: "",
    },
    en: {
      email:
        "Subject: Invoice #1841 and phase 2 timing\n\nHi,\n\nAttaching invoice #1841 for $1,150 covering phase one — it needs to be paid by the 25th or the whole estimate shifts.\n\nSeparately: can you confirm phase two starts on the 3rd? We need to book the contractor in advance.\n\nBest,\nMichael Orlov",
      instruction: "",
    },
  },
  personachannel: {
    ru: {
      channel:
        "Канал для владельцев небольших кофеен: как считать себестоимость, работать с поставщиками и не прогореть на аренде.",
      persona:
        "Владелец одной-двух точек, 30–40 лет, вырос из бариста. Считает всё в голове и таблицах, боится нанимать управляющего.",
    },
    en: {
      channel:
        "A channel for small coffee-shop owners: costing drinks, dealing with suppliers, and not going under on rent.",
      persona:
        "Owner of one or two locations, 30-40, came up from behind the bar. Runs the numbers in their head and a spreadsheet, afraid to hire a manager.",
    },
  },
  objectionkiller: {
    ru: {
      input:
        "Продаю внедрение CRM для стоматологии, 250 тысяч за проект. Главврач говорит: «Дорого, у нас и в экселе всё работает». До этого два раза переносил встречу.",
    },
    en: {
      input:
        "I sell CRM rollouts to dental clinics, $3,000 per project. The head dentist says: 'Too expensive, our spreadsheet works fine.' He'd already rescheduled the meeting twice.",
    },
  },
  bizdoctor: {
    ru: {
      input:
        "Студия детского английского, 4 группы по 8 человек. Выручка 640 тысяч в месяц, абонемент 8 000. Клиенты приходят в основном из инстаграма, на рекламу тратим 90 тысяч. До второго месяца доходит примерно половина. Аренда 120 тысяч, три преподавателя.",
    },
    en: {
      input:
        "A kids' English studio, 4 groups of 8. Revenue is $8,000 a month, a membership is $100. Clients come mostly from Instagram, we spend $1,100 on ads. About half make it to month two. Rent is $1,500, three teachers.",
    },
  },
};

/** Пример ввода для инструмента или пустой объект, если его нет. */
export function toolSample(tool: string, locale: EngineLocale): ToolSample {
  return TOOL_SAMPLES[tool]?.[locale] ?? {};
}
