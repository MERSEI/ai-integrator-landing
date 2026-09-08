/**
 * Проверка ответа модели по той же JSON-схеме, что уходит в запросе.
 *
 * Полноценный валидатор здесь не нужен: схемы инструментов используют узкое
 * подмножество JSON Schema — object с properties и required, array с items и
 * скаляры. Зато нужна гарантия, что до компонента не доедет ответ без
 * обязательного поля: раньше эту роль играл responseSchema Gemini, а
 * OpenAI-совместимые эндпоинты соблюдают схему не все и не всегда.
 */

export type JsonSchema = {
  type?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  enum?: unknown[];
};

/** true, если значение соответствует схеме. Лишние поля допускаются. */
export function matchesSchema(value: unknown, schema: JsonSchema): boolean {
  switch (schema.type) {
    case "object": {
      if (value === null || typeof value !== "object" || Array.isArray(value)) {
        return false;
      }
      const obj = value as Record<string, unknown>;
      for (const key of schema.required ?? []) {
        if (!(key in obj)) return false;
      }
      for (const [key, sub] of Object.entries(schema.properties ?? {})) {
        if (key in obj && obj[key] !== null && !matchesSchema(obj[key], sub)) {
          return false;
        }
      }
      return true;
    }
    case "array":
      if (!Array.isArray(value)) return false;
      return schema.items ? value.every((v) => matchesSchema(v, schema.items!)) : true;
    case "string":
      return typeof value === "string";
    case "number":
    case "integer":
      return typeof value === "number" && Number.isFinite(value);
    case "boolean":
      return typeof value === "boolean";
    default:
      // Схема без type ничего не утверждает — считаем совпадением.
      return true;
  }
}

/**
 * Достаёт JSON из ответа модели.
 *
 * Модели за OpenAI-совместимыми эндпоинтами любят обернуть JSON в ```json```
 * или добавить фразу до него, даже когда просили строгий формат. Разбираем
 * это здесь, а не в каждом инструменте.
 */
export function parseJsonLoose(text: string): unknown {
  const trimmed = text.trim();

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidates = [fenced?.[1], trimmed].filter(Boolean) as string[];

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch {
      // пробуем следующий вариант
    }
    // Последняя попытка: вырезать от первой скобки до парной последней.
    const start = candidate.search(/[[{]/);
    const end = Math.max(candidate.lastIndexOf("}"), candidate.lastIndexOf("]"));
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(candidate.slice(start, end + 1));
      } catch {
        // не вышло — идём дальше
      }
    }
  }
  return undefined;
}
