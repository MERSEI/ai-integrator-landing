import type { LeadTier } from "@/lib/leadradar";
import type { Bank } from "../types";

/**
 * Тексты Poaching. Правило падежа — то же, что в banks/leadradar.ts:
 * слот ставится только туда, где годится именительный падеж.
 *
 * Слоты: {niche} — ниша пользователя, {competitor} — @аккаунт конкурента,
 * {pain}, {outcome}, {actor} — из словаря ниши.
 */

export type PoachingBank = {
  /** Что человек писал под постом конкурента. */
  question: Record<LeadTier, string[]>;
  reason: Record<LeadTier, string[]>;
  /** Черновик захода в личку. */
  dm: string[];
};

export const POACHING: Bank<PoachingBank> = {
  ru: {
    question: {
      hot: [
        "А сроки какие? Мне нужно на этой неделе, у вас реально успеете?",
        "Сколько это стоит? В описании цены нет, а решать надо сейчас.",
        "Уже второй раз пишу в личку, ответа нет. Так и работаете?",
        "Записался месяц назад, до сих пор тишина. Есть кто живой?",
        "У вас есть свободные места? Везде занято, ищу хоть кого-то.",
        "Оплатил, но так и не связались. Куда писать, чтобы решить вопрос?",
        "Скажите честно: {pain} — вы с этим работаете или нет?",
        "Можно пример работ? Хочу понять, потяните ли мою задачу.",
      ],
      warm: [
        "Интересно, а для новичков подойдёт? Или это уже для опытных?",
        "Давно слежу, всё никак не решусь. Что посоветуете начать первым?",
        "А удалённо это возможно или только очно?",
        "Подписался, буду наблюдать. Тема — {niche}, как раз про меня.",
        "Выглядит хорошо. Подумаю после отпуска, сейчас не до этого.",
        "А есть что-то попроще для начала? С этого страшновато стартовать.",
        "Читаю вас давно, полезно. Пока просто присматриваюсь.",
        "Сравниваю несколько вариантов. На что вообще смотреть при выборе?",
      ],
      cold: [
        "Отличный пост, спасибо! Тоже этим занимаюсь, полностью согласен.",
        "Коллеги, а давайте обменяемся опытом — работаю в той же теме.",
        "Не соглашусь. По-моему, тут всё сложнее, чем описано.",
        "Классный контент, подписался ради интереса.",
        "А можно сотрудничество? Мы делаем смежное направление.",
        "Просто мимо проходил, но пост хороший.",
      ],
    },
    reason: {
      hot: [
        "Открытая жалоба под постом конкурента — человек уже готов уйти.",
        "Спрашивает цену и сроки: выбор происходит прямо сейчас.",
        "Не получил ответа от конкурента — окно открыто.",
        "Заплатил и не дождался. Самый простой перехват.",
        "Ищет свободное место, конкурент не может дать.",
      ],
      warm: [
        "Интерес есть, готовности пока нет — стоит остаться на виду.",
        "Сравнивает варианты: помочь с критериями выгоднее, чем продавать.",
        "Следит за темой давно, решение отложено.",
        "Нужен более простой вход, чем предлагает конкурент.",
        "Аудитория конкурента, но лояльность ещё не сложилась.",
      ],
      cold: [
        "Это коллега по цеху, а не клиент.",
        "Предлагает сотрудничество, покупать не планирует.",
        "Просто вовлечённый читатель без задачи.",
        "Спор по существу поста, к покупке отношения не имеет.",
      ],
    },
    dm: [
      "Увидел ваш вопрос под постом {competitor}. Не буду перетягивать — просто скажу, как это обычно решается, а дальше сами.",
      "Заметил, что вам так и не ответили у {competitor}. Если вопрос ещё открыт, могу подсказать по существу.",
      "Вы спрашивали про сроки. У нас в такой задаче обычно выходит вот что: {outcome}. Рассказать, как?",
      "Заметил ваш комментарий. Судя по описанию, дело не в исполнителе, а в постановке задачи. Показать, где именно?",
      "Не реклама: у вас в вопросе классическая ситуация. Могу за пару сообщений объяснить, на что смотреть.",
      "Видел ваш вопрос. Если коротко, результат обычно такой: {outcome}. Готов ответить без презентаций.",
    ],
  },
  en: {
    question: {
      hot: [
        "What's the turnaround? I need it this week — can you actually make that?",
        "How much does this cost? There's no pricing anywhere and I need to decide now.",
        "Second time I'm messaging you, still no reply. Is this how it works?",
        "Booked a month ago and still nothing. Anyone alive over there?",
        "Do you have any slots left? Everywhere is full, I'll take anyone.",
        "Paid and never heard back. Where do I write to get this sorted?",
        "Straight question: {pain} — is that something you handle or not?",
        "Can I see some past work? I want to know if you can handle my case.",
      ],
      warm: [
        "Would this work for a beginner, or is it for people who already know their stuff?",
        "Been following for a while, still can't commit. What would you start with?",
        "Is this possible remotely or in person only?",
        "Subscribed, will keep watching. The topic is {niche}, which is exactly me.",
        "Looks good. I'll think about it after the holidays, too much on right now.",
        "Is there something simpler to start with? This feels like a big first step.",
        "Been reading you for ages, always useful. Just window shopping for now.",
        "Comparing a few options. What should I actually be looking at?",
      ],
      cold: [
        "Great post, thanks! I do this too, completely agree.",
        "Fellow practitioners, let's swap notes — I work in the same space.",
        "I'd disagree. I think it's more complicated than described.",
        "Good content, subscribed out of interest.",
        "Any interest in partnering? We do an adjacent thing.",
        "Just passing through, but nice post.",
      ],
    },
    reason: {
      hot: [
        "An open complaint under a competitor's post — they're already halfway out.",
        "Asking price and timing: the decision is happening right now.",
        "Got no reply from the competitor — the window is open.",
        "Paid and got nothing back. The easiest switch there is.",
        "Looking for availability the competitor can't offer.",
      ],
      warm: [
        "Interested but not ready — worth staying visible.",
        "Comparing options: helping with the criteria beats pitching.",
        "Been following the topic a while, decision is deferred.",
        "Needs an easier entry point than the competitor offers.",
        "The competitor's audience, but loyalty hasn't set in yet.",
      ],
      cold: [
        "A peer in the field, not a customer.",
        "Pitching a partnership, not planning to buy.",
        "An engaged reader with no problem to solve.",
        "Arguing with the post itself — nothing to do with buying.",
      ],
    },
    dm: [
      "Saw your question under {competitor}'s post. Not here to poach — just telling you how this usually gets solved, take it from there.",
      "Noticed {competitor} never got back to you. If it's still open, I can give you a straight answer.",
      "You asked about timing. On a job like that we usually end up here: {outcome}. Want to know how?",
      "Saw your comment. From the description this isn't about the provider, it's about how the task is framed. Want me to show you where?",
      "Not a pitch: your question describes a classic situation. I can explain what to look at in two messages.",
      "Saw your question. Short version, the result usually looks like this: {outcome}. Happy to answer without a deck.",
    ],
  },
};
