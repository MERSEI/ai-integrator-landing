import { aiConfig, type AiConfig } from "./config";
import { matchesSchema, parseJsonLoose, type JsonSchema } from "./schema";
import type { AiMessage, AiResult } from "./types";

/**
 * Единственная точка, через которую проект обращается к модели.
 *
 * Контракт OpenAI-совместимый, поэтому провайдер меняется переменными
 * окружения. Раньше на его месте был прямой fetch к Gemini, продублированный
 * в семи роутах, без таймаута и без проверки ответа.
 */

type BaseOptions = {
  system: string;
  messages: AiMessage[];
  temperature?: number;
  maxTokens?: number;
};

/** Ответ строго по схеме. Схемы берутся те же, что были у роутов. */
export async function generateJson<T>(
  options: BaseOptions & { schema: JsonSchema; schemaName?: string }
): Promise<AiResult<T>> {
  const cfg = aiConfig();
  if (!cfg) return { ok: false, reason: "not_configured" };

  // Часть эндпоинтов понимает json_schema, часть — только json_object, часть
  // не умеет ни того ни другого. Идём от строгого к мягкому, а результат в
  // любом случае проверяем сами.
  const modes = ["json_schema", "json_object", "none"] as const;

  for (const mode of modes) {
    const res = await call(cfg, {
      ...options,
      responseFormat:
        mode === "json_schema"
          ? {
              type: "json_schema",
              json_schema: {
                name: options.schemaName ?? "result",
                schema: options.schema,
                strict: false,
              },
            }
          : mode === "json_object"
            ? { type: "json_object" }
            : undefined,
    });

    if (!res.ok) {
      // Формат не поддержан — пробуем следующий; всё остальное уже безнадёжно.
      if (res.reason === "unsupported_format") continue;
      return { ok: false, reason: res.reason };
    }

    const parsed = parseJsonLoose(res.text);
    if (parsed !== undefined && matchesSchema(parsed, options.schema)) {
      return { ok: true, value: parsed as T };
    }
    console.error(
      "[ai] ответ не сошёлся со схемой, режим:",
      mode,
      "начало ответа:",
      res.text.slice(0, 200)
    );
    if (mode === "none") return { ok: false, reason: "invalid" };
  }

  return { ok: false, reason: "invalid" };
}

/** Свободный текст без схемы — для чата живого демо-агента. */
export async function generateText(options: BaseOptions): Promise<AiResult<string>> {
  const cfg = aiConfig();
  if (!cfg) return { ok: false, reason: "not_configured" };

  const res = await call(cfg, options);
  if (!res.ok) {
    return { ok: false, reason: res.reason === "unsupported_format" ? "invalid" : res.reason };
  }
  const text = res.text.trim();
  return text ? { ok: true, value: text } : { ok: false, reason: "empty" };
}

// ── транспорт ────────────────────────────────────────────────────────

type CallFailure = "unavailable" | "empty" | "unsupported_format";
type CallResult = { ok: true; text: string } | { ok: false; reason: CallFailure };

async function call(
  cfg: AiConfig,
  options: BaseOptions & { responseFormat?: unknown }
): Promise<CallResult> {
  const body = JSON.stringify({
    model: cfg.model,
    messages: [
      { role: "system", content: options.system },
      ...options.messages,
    ],
    temperature: options.temperature ?? 0.8,
    ...(options.maxTokens ? { max_tokens: options.maxTokens } : {}),
    ...(options.responseFormat ? { response_format: options.responseFormat } : {}),
  });

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (cfg.apiKey) headers.Authorization = `Bearer ${cfg.apiKey}`;

  // Одна повторная попытка: сетевые сбои и 5xx у провайдеров обычны, а
  // пользователь видит одну кнопку и не должен нажимать её дважды.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
        method: "POST",
        headers,
        body,
        signal: AbortSignal.timeout(cfg.timeoutMs),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        // 400 на response_format — сигнал, что эндпоинт этот режим не умеет.
        if (res.status === 400 && options.responseFormat && /response_format|json_schema/i.test(errText)) {
          return { ok: false, reason: "unsupported_format" };
        }
        console.error("[ai] провайдер ответил", res.status, errText.slice(0, 300));
        if (res.status >= 500 && attempt === 0) continue;
        return { ok: false, reason: "unavailable" };
      }

      const data = await res.json();
      const text: unknown = data?.choices?.[0]?.message?.content;
      if (typeof text !== "string" || !text.trim()) {
        const finish = data?.choices?.[0]?.finish_reason ?? "unknown";
        console.error("[ai] пустой ответ, finish_reason:", finish);
        return { ok: false, reason: "empty" };
      }
      return { ok: true, text };
    } catch (e) {
      console.error("[ai] запрос к провайдеру упал:", e);
      if (attempt === 0) continue;
      return { ok: false, reason: "unavailable" };
    }
  }

  return { ok: false, reason: "unavailable" };
}

/**
 * Директива языка ответа, дописывается к системному промпту.
 *
 * Сами промпты остались на русском намеренно: они описывают задачу и структуру
 * JSON, и их перевод — это десять шансов случайно сломать схему. Модели
 * надёжно следуют явному указанию языка вывода, поэтому меняем только его.
 */
export function outputLanguage(locale: string): string {
  if (locale === "en") {
    return (
      "\n\nCRITICAL — OUTPUT LANGUAGE: The user is English-speaking. " +
      "Write EVERY string value in the JSON response in natural, idiomatic English. " +
      "Never answer in Russian. Keep JSON keys exactly as specified."
    );
  }
  return "\n\nЯЗЫК ОТВЕТА: все строковые значения в JSON пиши по-русски.";
}
