/** Локаль генерации. В отличие от requestLocale() здесь уже сузили до союза. */
export type EngineLocale = "ru" | "en";

/**
 * Банк фраз одного инструмента: по объекту на локаль, форма общая.
 * Дженерик держит ru и en одного типа — забыть перевод не получится,
 * это ловится на typecheck, а не глазами.
 */
export type Bank<T> = Record<EngineLocale, T>;

/** Сообщение диалога, как его присылает клиент. */
export type WireMsg = { role: "user" | "model"; content: string };
