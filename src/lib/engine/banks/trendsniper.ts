import type { TrendDirection } from "@/lib/trendsniper";
import type { Bank } from "../types";

/**
 * Тексты Trend Sniper. Правило падежа — как в banks/leadradar.ts.
 *
 * Слоты: {keyword} — тема пользователя, {level} — оценка интереса,
 * {topRegion} — регион-лидер, {n} — число для формулировок роста.
 */

export type TrendSniperBank = {
  regions: string[];
  /** Модификаторы устойчивых запросов: «{keyword} цена». */
  topModifiers: string[];
  /** Модификаторы растущих запросов. */
  risingModifiers: string[];
  summary: Record<TrendDirection, string[]>;
  seasonality: string[];
  insight: Record<TrendDirection, string[]>;
};

export const TRENDSNIPER: Bank<TrendSniperBank> = {
  ru: {
    regions: [
      "Москва",
      "Санкт-Петербург",
      "Краснодарский край",
      "Свердловская область",
      "Татарстан",
      "Новосибирская область",
      "Ростовская область",
      "Башкортостан",
      "Самарская область",
      "Приморский край",
    ],
    topModifiers: ["цена", "отзывы", "что это", "своими руками", "рядом", "заказать"],
    risingModifiers: [
      "2026",
      "нейросеть",
      "бесплатно",
      "с нуля",
      "для бизнеса",
      "автоматизация",
    ],
    summary: {
      rising: [
        "Интерес к теме растёт: {level} из 100 против заметно меньших значений полгода назад. Лидирует {topRegion}.",
        "Тема набирает: сейчас {level} из 100, и кривая идёт вверх третий месяц подряд. Больше всего ищут в регионе {topRegion}.",
        "Спрос активно растёт, оценка {level} из 100. Первый по интересу регион — {topRegion}.",
      ],
      falling: [
        "Интерес снижается: {level} из 100, пик пройден. Дольше всех держится {topRegion}.",
        "Тема остывает — сейчас {level} из 100 против более высоких значений в прошлом сезоне. Лидер по остаткам спроса: {topRegion}.",
        "Спрос сокращается, оценка {level} из 100. Самый устойчивый регион — {topRegion}.",
      ],
      stable: [
        "Интерес ровный: {level} из 100 без заметных скачков. Основной спрос — {topRegion}.",
        "Тема держится на одном уровне, {level} из 100. Лидирует {topRegion}.",
        "Стабильный спрос, оценка {level} из 100. Первый регион — {topRegion}.",
      ],
    },
    seasonality: [
      "Заметный подъём в начале года и провал в июле-августе.",
      "Пики приходятся на сентябрь и январь — классический эффект «нового старта».",
      "Спрос ровный весь год, сезонность почти не выражена.",
      "Всплеск в ноябре-декабре, дальше спад до конца февраля.",
      "Два подъёма: весной и в конце лета, между ними затишье.",
      "Выраженный летний сезон, зимой интерес падает примерно вдвое.",
    ],
    insight: {
      rising: [
        "Момент удачный: спрос растёт, а конкуренция в выдаче ещё не догнала.",
        "Растущие запросы дешевле в рекламе, чем устоявшиеся. Заходить стоит сейчас.",
        "Пока тема на подъёме, контент по ней собирает трафик дольше обычного.",
      ],
      falling: [
        "Спрос падает — ставку лучше делать на смежные растущие запросы, а не на этот.",
        "Тема на спаде: удерживать позиции дешевле, чем заходить с нуля.",
        "Снижение не всегда плохо: уходят случайные, остаются те, кто действительно покупает.",
      ],
      stable: [
        "Ровный спрос — предсказуемый канал: можно планировать бюджет на квартал вперёд.",
        "Стабильная тема: выигрывает не тот, кто быстрее, а тот, кто последовательнее.",
        "Скачков нет, поэтому решает качество предложения, а не удачный момент.",
      ],
    },
  },
  en: {
    regions: [
      "United States",
      "United Kingdom",
      "Canada",
      "Australia",
      "Germany",
      "India",
      "Netherlands",
      "Ireland",
      "Singapore",
      "Sweden",
    ],
    topModifiers: ["price", "reviews", "what is it", "diy", "near me", "buy"],
    risingModifiers: ["2026", "ai", "free", "for beginners", "for business", "automation"],
    summary: {
      rising: [
        "Interest is climbing: {level} out of 100, well above where it sat six months ago. {topRegion} leads.",
        "The topic is picking up — {level} out of 100, and the curve has been rising for three months. Searched most in {topRegion}.",
        "Demand is growing quickly, scored at {level} out of 100. The top region is {topRegion}.",
      ],
      falling: [
        "Interest is declining: {level} out of 100, the peak is behind us. {topRegion} is holding on longest.",
        "The topic is cooling — {level} out of 100 against higher numbers last season. Strongest remaining demand: {topRegion}.",
        "Demand is shrinking, scored at {level} out of 100. The most resilient region is {topRegion}.",
      ],
      stable: [
        "Interest is flat: {level} out of 100 with no real swings. Demand centres on {topRegion}.",
        "The topic is holding steady at {level} out of 100. {topRegion} leads.",
        "Steady demand, scored at {level} out of 100. The top region is {topRegion}.",
      ],
    },
    seasonality: [
      "A clear lift at the start of the year and a dip through July and August.",
      "Peaks land in September and January — the classic fresh-start effect.",
      "Demand is even year-round, seasonality is barely visible.",
      "A spike in November and December, then a slide until late February.",
      "Two lifts: spring and late summer, with a quiet stretch between.",
      "A pronounced summer season; winter interest drops by roughly half.",
    ],
    insight: {
      rising: [
        "Good timing: demand is growing and the search results haven't caught up yet.",
        "Rising queries cost less in ads than established ones. Now is the moment to enter.",
        "While the topic is climbing, content on it keeps pulling traffic longer than usual.",
      ],
      falling: [
        "Demand is falling — better to bet on adjacent rising queries than on this one.",
        "The topic is past its peak: holding position costs less than entering from scratch.",
        "A decline isn't always bad: the casual traffic leaves and the buyers stay.",
      ],
      stable: [
        "Flat demand means a predictable channel: you can plan a quarter of budget against it.",
        "A steady topic: consistency wins here, not speed.",
        "No swings, so the offer decides the outcome rather than good timing.",
      ],
    },
  },
};
