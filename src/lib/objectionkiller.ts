export type Tactic = { name: string; script: string; why: string };

export type ObjectionResponse = {
  status: "clarifying" | "ready";
  message: string;
  questions: string[];
  hidden_reason: string;
  tactics: Tactic[];
  recommendation: string;
};

/** Сообщение в диалоге на клиенте. */
export type ChatMsg =
  | { role: "user"; text: string }
  | { role: "assistant"; data: ObjectionResponse };

/** Для отправки на сервер — плоский вид, конвертируется в Gemini contents. */
export type WireMsg = { role: "user" | "model"; content: string };
