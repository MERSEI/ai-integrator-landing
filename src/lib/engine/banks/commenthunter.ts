import type { LeadTier } from "@/lib/leadradar";
import type { Bank } from "../types";

/**
 * Тексты Comment Hunter. Правило падежа — как в banks/leadradar.ts.
 *
 * Здесь два разных голоса, и их важно не смешивать: `post` — это голос
 * автора популярного поста (утверждение, мнение, разбор), `comment` — голос
 * читателя под ним (вопрос, жалоба, реплика). Если писать их одним банком,
 * лента выглядит как монолог одного человека.
 */

export type CommentHunterBank = {
  post: string[];
  comment: Record<LeadTier, string[]>;
  reason: Record<LeadTier, string[]>;
  reply: string[];
};

export const COMMENTHUNTER: Bank<CommentHunterBank> = {
  ru: {
    post: [
      "Разобрал, почему {keyword} у большинства не взлетает. Три причины, и ни одна не про бюджет.",
      "Пять лет в теме. Вот что я понял про {keyword} — и это не то, что пишут в статьях.",
      "Непопулярное мнение: {keyword} без выстроенного процесса внутри только ускоряет хаос.",
      "Клиент пришёл с запросом на {keyword}. Проблема оказалась совсем в другом месте. Рассказываю.",
      "Собрал разбор: как выглядит {keyword} у тех, у кого получилось. Спойлер — скучно и системно.",
      "Часто спрашивают про {keyword}. Отвечаю развёрнуто, чтобы больше не повторяться.",
      "Главная ошибка в {keyword} — начинать с инструментов, а не с задачи. Объясняю на цифрах.",
      "Сравнил подходы к {keyword} на трёх проектах. Результаты неожиданные.",
    ],
    comment: {
      hot: [
        "А можете взять нас? У нас как раз {pain}, руки не доходят.",
        "Как с вами связаться? Нужно вчера, готовы обсуждать бюджет.",
        "Вот прямо про нас написано. Что делать первым, если начинать с нуля?",
        "Сколько стоит такой разбор? Хочу такой же для своего случая.",
        "У нас та же ситуация, только хуже. Возьмётесь посмотреть?",
        "Записывайте меня. Куда писать?",
      ],
      warm: [
        "Полезно, спасибо. А есть что-то для тех, кто только начинает?",
        "Сохранил. Тема — {keyword}, как раз думаю в эту сторону.",
        "Интересно. А сколько времени обычно занимает такое внедрение?",
        "Хороший разбор. Пока не готовы, но вернёмся к этому осенью.",
        "А для маленькой команды это вообще применимо?",
        "Спасибо, многое прояснилось. Буду думать.",
      ],
      cold: [
        "Согласен на все сто. Сам об этом писал год назад.",
        "Хороший текст. Работаю в смежной теме, приятно читать своих.",
        "Спорно. У меня опыт показывает обратное.",
        "Отличная подача! Подписался.",
        "А можно взаимный пиар? У меня похожая аудитория.",
      ],
    },
    reason: {
      hot: [
        "Прямо просит контакт и называет свою ситуацию.",
        "Готовность обсуждать бюджет в первом же комментарии.",
        "Узнал себя в посте и спрашивает, с чего начать.",
        "Спрашивает цену — самый короткий путь к сделке.",
      ],
      warm: [
        "Интерес есть, срока нет — стоит остаться в поле зрения.",
        "Уточняет применимость: сомнение конкретное, его можно снять.",
        "Отложил решение на конкретный срок — есть куда вернуться.",
        "Сохранил себе: тема попала, но повода действовать пока нет.",
      ],
      cold: [
        "Коллега по теме, обменивается опытом.",
        "Вежливая реакция без запроса.",
        "Спор по существу, а не интерес к услуге.",
        "Предлагает обмен аудиторией.",
      ],
    },
    reply: [
      "Спасибо! Если коротко по вашей ситуации: результат обычно такой — {outcome}. Написать подробнее в личку?",
      "Ситуация понятная, встречается часто. Могу за два вопроса сказать, ваш это случай или нет.",
      "Да, возьмёмся. Опишите в личке, что уже пробовали, — так будет быстрее.",
      "Для начала хватит одного шага, большой проект не нужен. Рассказать какого?",
      "Начинать стоит не с инструмента. Скину короткий порядок действий, если интересно.",
      "Спасибо, что написали. Отвечу без презентации: вот что обычно получается — {outcome}.",
    ],
  },
  en: {
    post: [
      "Broke down why {keyword} doesn't work for most people. Three reasons, and none of them is budget.",
      "Five years in this field. Here's what I've learned about {keyword} — and it's not what the articles say.",
      "Unpopular opinion: {keyword} without a real process behind it just speeds up the chaos.",
      "A client came in asking for {keyword}. The problem turned out to be somewhere else entirely. Here's the story.",
      "Put together a breakdown of what {keyword} looks like for the people who got it right. Spoiler: boring and systematic.",
      "I get asked about {keyword} a lot. Answering properly so I don't have to repeat myself.",
      "The biggest mistake in {keyword} is starting from tools instead of the problem. Here's the math.",
      "Compared three approaches to {keyword} across three projects. The results surprised me.",
    ],
    comment: {
      hot: [
        "Could you take us on? We've got exactly this: {pain}, and no time to deal with it.",
        "How do I reach you? Needed yesterday, happy to talk budget.",
        "This is literally about us. What's the first thing to do if starting from zero?",
        "What does a breakdown like this cost? I want one for our case.",
        "Same situation here, only worse. Would you take a look?",
        "Sign me up. Where do I write?",
      ],
      warm: [
        "Useful, thanks. Is there something for people just starting out?",
        "Saved this. The topic is {keyword}, which is exactly where my head is.",
        "Interesting. How long does a rollout like that usually take?",
        "Good breakdown. Not ready yet, but we'll come back to this in the autumn.",
        "Does any of this apply to a small team?",
        "Thanks, that cleared a lot up. I'll think it over.",
      ],
      cold: [
        "Agree completely. Wrote about this myself a year ago.",
        "Good piece. I work in an adjacent field, nice to read one of us.",
        "Debatable. My experience says the opposite.",
        "Great delivery! Subscribed.",
        "Any interest in a cross-promo? Similar audience here.",
      ],
    },
    reason: {
      hot: [
        "Asking for contact details and describing their own situation.",
        "Willing to discuss budget in the very first comment.",
        "Recognised themselves in the post and asked where to start.",
        "Asking about price — the shortest path to a deal.",
      ],
      warm: [
        "Interested but with no deadline — worth staying visible.",
        "Checking applicability: a specific doubt, and one you can remove.",
        "Deferred to a specific date — something to come back to.",
        "Saved it: the topic landed, but there's no trigger to act yet.",
      ],
      cold: [
        "A peer swapping notes.",
        "A polite reaction with no request behind it.",
        "Arguing on the merits, not interested in the service.",
        "Pitching an audience swap.",
      ],
    },
    reply: [
      "Thanks! Short answer for your situation — the result usually looks like this: {outcome}. Want the details in DMs?",
      "That situation is common enough. Two questions and I can tell you whether it's your case.",
      "Yes, happy to take it on. Send over what you've already tried and we'll move faster.",
      "One step is enough to start, you don't need a big project. Want to know which one?",
      "The place to start isn't the tool. I'll send a short order of operations if that's useful.",
      "Thanks for writing. No deck, just the answer: here's what usually comes out — {outcome}.",
    ],
  },
};
