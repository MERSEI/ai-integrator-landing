import { NextResponse } from "next/server";
import { apiMessage, type ApiMessageKey } from "@/lib/apiMessages";
import type { AiFailure } from "./types";

/**
 * Перевод причины отказа в HTTP-ответ.
 *
 * Раньше каждый роут раскладывал ошибки модели сам, и семь копий этой лестницы
 * успели разойтись формулировками. Теперь маппинг один.
 *
 * @param emptyKey чем заменить общий текст «модель вернула пустой ответ» —
 *   у части инструментов он подсказывает, что именно дописать во входные поля.
 */
export function aiErrorResponse(
  locale: string,
  reason: AiFailure,
  emptyKey: ApiMessageKey = "modelEmpty"
): NextResponse {
  switch (reason) {
    case "not_configured":
      return NextResponse.json(
        { error: apiMessage(locale, "serviceUnavailable") },
        { status: 503 }
      );
    case "empty":
      return NextResponse.json({ error: apiMessage(locale, emptyKey) }, { status: 502 });
    case "invalid":
      return NextResponse.json(
        { error: apiMessage(locale, "generationFailed") },
        { status: 502 }
      );
    case "unavailable":
    default:
      return NextResponse.json(
        { error: apiMessage(locale, "modelSilent") },
        { status: 502 }
      );
  }
}
