/**
 * Сообщения об ошибках API. Уходят прямо в интерфейс, поэтому переводятся:
 * иначе англоязычный пользователь упирается в русский текст при первом же
 * лимите или пустом поле.
 *
 * Локаль берётся из тела запроса (см. requestLocale в lib/gemini.ts).
 */

const ru = {
  tooManyRequests: "Слишком много запросов. Попробуйте через минуту.",
  dailyLimit: "Дневной лимит 30 запросов исчерпан. Попробуйте завтра.",
  toolLimit:
    "Демо-лимит этого инструмента — 2 запроса в день. Оформите доступ, чтобы использовать без ограничений.",
  badRequest: "Некорректный запрос",
  noModelKey: "Сервис временно недоступен: не настроен ключ модели.",
  modelSilent: "Модель не ответила. Попробуйте ещё раз.",
  modelEmpty: "Модель вернула пустой ответ. Попробуйте ещё раз.",
  modelEmptyProfile: "Модель вернула пустой ответ. Уточните текст профиля.",
  modelEmptyDescription: "Модель вернула пустой ответ. Уточните описание.",
  generationFailed: "Ошибка генерации. Попробуйте ещё раз.",
  chatTooLong: "Диалог слишком длинный. Начните заново.",
  chatTooLongSituation: "Диалог слишком длинный. Начните новую ситуацию.",
  needKeywordNiche: "Введите ключевое слово или нишу.",
  needKeywordTopic: "Введите ключевое слово или тему.",
  needProfile: "Вставьте больше текста профиля (минимум пара предложений).",
  needOffer: "Добавьте шаблон вашего предложения.",
  needEmail: "Вставьте текст письма.",
  needBusiness: "Расскажите о вашем бизнесе.",
  needChannel: "Опишите ваш канал (тема, о чём пишете).",
  needObjection: "Опишите ситуацию и возражение клиента.",
  needFollowupContext:
    "Опишите ситуацию подробнее: что предлагали, на чём зависло.",
  needNiche: "Укажите вашу нишу.",
  invalidEmail: "Введите корректный email",
};

const en: typeof ru = {
  tooManyRequests: "Too many requests. Please try again in a minute.",
  dailyLimit: "You've hit the daily limit of 30 requests. Try again tomorrow.",
  toolLimit:
    "This tool's demo limit is 2 requests per day. Get access to use it without limits.",
  badRequest: "Invalid request",
  noModelKey: "Service temporarily unavailable: the model key is not configured.",
  modelSilent: "The model didn't respond. Please try again.",
  modelEmpty: "The model returned an empty response. Please try again.",
  modelEmptyProfile:
    "The model returned an empty response. Try adding more profile text.",
  modelEmptyDescription:
    "The model returned an empty response. Try describing it in more detail.",
  generationFailed: "Generation failed. Please try again.",
  chatTooLong: "This conversation is too long. Please start over.",
  chatTooLongSituation: "This conversation is too long. Start a new situation.",
  needKeywordNiche: "Enter a keyword or a niche.",
  needKeywordTopic: "Enter a keyword or a topic.",
  needProfile: "Paste more profile text (a couple of sentences at minimum).",
  needOffer: "Add your template pitch.",
  needEmail: "Paste the email text.",
  needBusiness: "Tell us about your business.",
  needChannel: "Describe your channel (topic, what you write about).",
  needObjection: "Describe the situation and the customer's objection.",
  needFollowupContext:
    "Describe the situation in more detail: what you pitched and where it stalled.",
  needNiche: "Name your niche.",
  invalidEmail: "Enter a valid email",
};

export type ApiMessageKey = keyof typeof ru;

export function apiMessage(locale: string, key: ApiMessageKey): string {
  return (locale === "en" ? en : ru)[key];
}
