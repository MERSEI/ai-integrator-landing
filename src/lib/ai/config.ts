/**
 * Настройки провайдера модели.
 *
 * Контракт — OpenAI-совместимый /chat/completions. Под него подходит и свой
 * хостинг (vLLM, Ollama, LM Studio), и любой совместимый сервис, поэтому смена
 * провайдера это правка переменных окружения, а не кода.
 *
 * AI_BASE_URL   — база API без хвостового слэша, например https://api.example.com/v1
 * AI_MODEL      — идентификатор модели у этого провайдера
 * AI_API_KEY    — Bearer-токен; часть self-hosted эндпоинтов работает без него
 * AI_TIMEOUT_MS — потолок ожидания ответа, по умолчанию 25 секунд
 */

export type AiConfig = {
  baseUrl: string;
  model: string;
  apiKey: string;
  timeoutMs: number;
};

const DEFAULT_TIMEOUT_MS = 25_000;

/**
 * Конфиг провайдера или null, если он не настроен.
 *
 * Ключ намеренно не обязателен: локальный vLLM или Ollama его не спрашивают,
 * а требовать пустую строку в env — лишний повод для ошибки при деплое.
 */
export function aiConfig(): AiConfig | null {
  const baseUrl = (process.env.AI_BASE_URL ?? "").trim().replace(/\/+$/, "");
  const model = (process.env.AI_MODEL ?? "").trim();
  if (!baseUrl || !model) return null;

  const rawTimeout = Number(process.env.AI_TIMEOUT_MS);
  return {
    baseUrl,
    model,
    apiKey: (process.env.AI_API_KEY ?? "").trim(),
    timeoutMs:
      Number.isFinite(rawTimeout) && rawTimeout > 0 ? rawTimeout : DEFAULT_TIMEOUT_MS,
  };
}

export function aiConfigured(): boolean {
  return aiConfig() !== null;
}
