/** Почему генерация не удалась. Роут переводит это в свой HTTP-статус и текст. */
export type AiFailure =
  /** Провайдер не настроен: нет AI_BASE_URL или AI_MODEL. */
  | "not_configured"
  /** Сеть, таймаут или не-2xx от провайдера. */
  | "unavailable"
  /** Ответ пришёл, но пустой. */
  | "empty"
  /** Ответ пришёл, но это не JSON или он не сходится со схемой. */
  | "invalid";

export type AiResult<T> = { ok: true; value: T } | { ok: false; reason: AiFailure };

export type AiMessage = { role: "user" | "assistant"; content: string };
