import type { LeadTier } from "@/lib/leadradar";
import type { Bank } from "../types";

/**
 * Тексты LeadRadar. Логика в tools/leadradar.ts, здесь только строки —
 * их можно править, не читая код.
 *
 * Слоты: {keyword} — запрос пользователя, {pain} и {outcome} — из словаря
 * ниши, {actor} — как в нише зовут исполнителя, {n} — случайное число.
 * Слот {keyword} обязан быть в каждом шаблоне поста: человек должен видеть
 * в выдаче ровно то, что он ввёл.
 *
 * ПРАВИЛО ПАДЕЖА — соблюдать при любой правке.
 * Подставляется чужой текст, склонять который движок не умеет: {keyword} —
 * это ровно то, что набрал пользователь, {pain} и {outcome} — готовые
 * предложения из словаря ниши. Поэтому слот ставится ТОЛЬКО туда, где
 * годится именительный падеж:
 *   • после двоеточия или тире  — «Проблема: {pain}», «Цель такая: {outcome}»;
 *   • в подлежащем или прямом дополнении — «Ищу {keyword}», «{keyword} — тема
 *     хорошая».
 * Нельзя после предлогов и глаголов, требующих косвенного падежа:
 * «начинать с {keyword}», «присматриваюсь к {keyword}», «вышли на {outcome}»
 * дадут «с маникюр на дому» и «на заполненная запись».
 * В английском та же логика с другой причиной: {pain} и {outcome} — это
 * законченные фразы, поэтому «We've got {pain}» ломается, а
 * «Here's the situation: {pain}» — нет.
 */

export type LeadBank = {
  post: Record<LeadTier, string[]>;
  reason: Record<LeadTier, string[]>;
  reply: string[];
};

export const LEADRADAR: Bank<LeadBank> = {
  ru: {
    post: {
      hot: [
        "Ищу {keyword}. Кто-нибудь может посоветовать нормального {actor}? Нужно было ещё вчера.",
        "Всё, сдаюсь. Проблема: {pain}. Готов платить, лишь бы закрыть вопрос. Тема — {keyword}.",
        "Посоветуйте {keyword} — обзвонил четверых, никто не берётся. Бюджет есть.",
        "Кто делает {keyword} и не пропадает через неделю? Уже второй раз обжигаюсь.",
        "Нужен {keyword} на этой неделе. Не горит, а пылает. Куда писать?",
        "Ребята, срочно. Ситуация: {pain}. Что в таком случае делают? Ищу {keyword}.",
        "Готов обсудить {keyword} прямо сейчас. Скиньте контакты, кто занимается.",
        "Уже {n} месяца ищу {keyword}. Может, здесь повезёт?",
        "Задача такая: {outcome}. {keyword} — правильное направление или есть путь короче?",
        "Кто внедрял {keyword}? Сколько стоило и через сколько окупилось?",
        "Всё сломалось: {pain}. Ищу {keyword}, желательно с примерами работ.",
        "Нужен {actor}. Задача — {keyword}. Оплата сразу, закрыть до конца месяца.",
      ],
      warm: [
        "Присматриваюсь, тема — {keyword}. Пока читаю, но кажется, нам это нужно.",
        "А {keyword} реально помогает или это очередной хайп? Интересно послушать опыт.",
        "Думаю про {keyword} на следующий квартал. Кто уже пробовал, как оно?",
        "Интересно, сколько сейчас стоит {keyword}. Порядок цифр хотя бы.",
        "У нас вот что: {pain}. Разбираюсь, поможет ли тут {keyword} или мимо.",
        "Собираю информацию про {keyword}. Что почитать по теме?",
        "Коллеги внедрили {keyword}, хвалят. Присматриваюсь, но пока не готов.",
        "Хочу вот такой результат: {outcome}. Не уверен только, что {keyword} — правильный инструмент.",
        "{keyword} — тема хорошая, но у нас сначала другие приоритеты. Возможно, весной.",
        "Кто-нибудь сравнивал варианты? Интересует {keyword}, на что смотреть при выборе?",
        "Слышал про {keyword} на конференции. Пока просто складываю в закладки.",
        "Интересная тема — {keyword}. Записал, вернусь к этому позже.",
      ],
      cold: [
        "Пишу диплом про {keyword}, ищу материалы для теоретической части.",
        "Мы сами делаем {keyword} уже {n} лет. Спрашивайте, отвечу.",
        "{keyword} — это не панацея. Видел десяток провалов, пишу об этом статью.",
        "Кому нужен {keyword}, обращайтесь в личку — работаю по этой теме.",
        "Оффтоп, но раз уж зашла речь про {keyword}: у меня другой вопрос.",
        "Обучаю с нуля, направление — {keyword}. Набираю группу, пишите.",
        "Не понимаю ажиотажа. {keyword} — по-моему, переоценённая штука.",
        "Просто мнение: {keyword} без нормального процесса внутри не работает.",
        "Ищу работу, направление — {keyword}. Резюме в профиле.",
        "Раньше делал {keyword}, сейчас ушёл в другое. Ностальгирую.",
      ],
    },
    reason: {
      hot: [
        "Прямо просит совета и называет срок — это запрос, а не размышление.",
        "Проговаривает боль и готовность платить в одном сообщении.",
        "Уже искал сам и не нашёл — заход будет кстати.",
        "Есть бюджет и дедлайн, решение принимается сейчас.",
        "Второй заход после неудачного опыта — ищет надёжного исполнителя.",
      ],
      warm: [
        "Тема интересна, но решение отложено — стоит подогреть.",
        "Собирает информацию: полезный ответ сейчас запомнится к моменту выбора.",
        "Боль названа, но связь с решением ещё не очевидна автору.",
        "Ждёт следующего квартала — есть время выстроить доверие.",
        "Сравнивает варианты: тот, кто поможет с критериями, окажется первым в списке.",
      ],
      cold: [
        "Автор сам работает в этой теме — это коллега, а не покупатель.",
        "Академический интерес, покупки за ним не будет.",
        "Продаёт сам, а не покупает.",
        "Оффтоп: тема упомянута вскользь.",
        "Общее мнение без запроса и без задачи.",
      ],
    },
    reply: [
      "Тоже проходили через это. Если коротко, результат такой: {outcome}. Обычно это пара недель — расскажу, что нужно.",
      "У нас была ровно такая история. Скинуть, как разложили по шагам?",
      "Судя по описанию, узкое место чуть раньше, чем кажется. Могу показать, где именно.",
      "Есть похожий кейс: было то же самое, а стало вот что — {outcome}. Скинуть цифры?",
      "Если нужно быстро, можно начать с малого. Результат тот же: {outcome}. Рассказать?",
      "Занимаемся ровно этим. Не буду грузить презентацией — задам два вопроса и скажу, ваш это случай или нет.",
      "Тут важно не ошибиться на старте. Могу коротко расписать, на что смотреть при выборе.",
    ],
  },
  en: {
    post: {
      hot: [
        "Looking for {keyword}. Can anyone recommend a decent {actor}? Needed it yesterday.",
        "I give up. Here's the problem: {pain}. Happy to pay just to get {keyword} sorted.",
        "Need a {keyword} recommendation — called four people, nobody will take it. Budget is there.",
        "Who does {keyword} and doesn't disappear after a week? Been burned twice now.",
        "Need {keyword} this week. Not urgent, critical. Where do I write?",
        "Folks, urgent. The situation: {pain}. What do people normally do here? Looking for {keyword}.",
        "Ready to talk {keyword} right now. Drop contacts if this is your thing.",
        "Been looking for the right {keyword} for {n} months. Maybe I'll get lucky here.",
        "The goal is this: {outcome}. Is {keyword} the place to start, or is there a shorter path?",
        "Anyone rolled out {keyword}? What did it cost and how fast did it pay back?",
        "Everything's broken: {pain}. Looking for {keyword}, ideally with a portfolio.",
        "Need {actor} for {keyword}. Paying upfront, want this closed this month.",
      ],
      warm: [
        "Been eyeing {keyword}. Still reading, but it feels like we need it.",
        "Does {keyword} actually help or is it another round of hype? Curious about real experience.",
        "Thinking about {keyword} for next quarter. Anyone tried it, how did it go?",
        "Wondering what {keyword} costs these days. Even a ballpark would help.",
        "Our situation: {pain}. Trying to work out whether {keyword} is the answer or not.",
        "Gathering information on {keyword}. Any good reading on the topic?",
        "Colleagues rolled out {keyword} and rave about it. Interested, but not ready yet.",
        "What I actually want: {outcome}. Just not convinced {keyword} is the right tool.",
        "{keyword} looks good, but we've got other priorities first. Maybe in the spring.",
        "Has anyone compared the different {keyword} options? What should I be looking at?",
        "Heard about {keyword} at a conference. Just bookmarking for now.",
        "Interesting topic, {keyword}. Noted, I'll come back to it later.",
      ],
      cold: [
        "Writing a thesis on {keyword}, looking for sources for the theory section.",
        "We've been doing {keyword} for {n} years. Ask away, happy to answer.",
        "{keyword} is not a silver bullet. I've seen a dozen failures, writing a piece about it.",
        "If you need {keyword}, DM me — this is what I do.",
        "Off topic, but since {keyword} came up: I've got a different question.",
        "I teach {keyword} from scratch. Taking a new group, message me.",
        "I don't get the hype around {keyword}. Feels overrated to me.",
        "Just an opinion: {keyword} doesn't work without a decent process behind it.",
        "Looking for work in {keyword}. CV is in my profile.",
        "Used to work in {keyword}, moved on since. Feeling nostalgic.",
      ],
    },
    reason: {
      hot: [
        "Asking for a recommendation and naming a deadline — that's a request, not a musing.",
        "States the pain and the willingness to pay in one message.",
        "Already searched and came up empty — an approach will land well.",
        "Budget and deadline are both there, the decision is happening now.",
        "Second attempt after a bad experience — actively looking for someone reliable.",
      ],
      warm: [
        "Interested, but the decision is deferred — worth warming up.",
        "Gathering information: a useful answer now will be remembered at decision time.",
        "The pain is named, but the link to a solution isn't obvious to them yet.",
        "Waiting on next quarter — there's time to build trust.",
        "Comparing options: whoever helps with the criteria ends up first on the list.",
      ],
      cold: [
        "The author works in this field — a peer, not a buyer.",
        "Academic interest, no purchase behind it.",
        "Selling, not buying.",
        "Off topic: the subject only came up in passing.",
        "A general opinion with no request and no problem to solve.",
      ],
    },
    reply: [
      "We've been through this. Short version — the result looks like this: {outcome}. Usually a couple of weeks; happy to walk you through it.",
      "We had exactly this. Want me to send over how we broke it down?",
      "From your description the bottleneck is one step earlier than it looks. I can show you where.",
      "Got a similar case: same situation, and here's where it ended up — {outcome}. Want the numbers?",
      "If you need it fast, you can start small. Same result: {outcome}. Want the outline?",
      "This is exactly what we do. I won't send a deck — two questions and I'll tell you whether it's your case or not.",
      "Getting the start right matters here. I can quickly lay out what to look for when choosing.",
    ],
  },
};
