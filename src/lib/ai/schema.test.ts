import { describe, expect, it } from "vitest";
import { matchesSchema, parseJsonLoose, type JsonSchema } from "./schema";

// Схема ColdMessage — самая вложенная из тех, что реально ходят в роутах.
const COLD: JsonSchema = {
  type: "object",
  properties: {
    contacts: {
      type: "array",
      items: {
        type: "object",
        properties: { type: { type: "string" }, value: { type: "string" } },
        required: ["type", "value"],
      },
    },
    approach: { type: "string" },
    message: { type: "string" },
  },
  required: ["contacts", "approach", "message"],
};

describe("matchesSchema", () => {
  it("принимает корректный ответ", () => {
    expect(
      matchesSchema(
        {
          contacts: [{ type: "email", value: "a@b.ru" }],
          approach: "зацепка",
          message: "текст",
        },
        COLD
      )
    ).toBe(true);
  });

  it("отклоняет ответ без обязательного поля", () => {
    expect(matchesSchema({ contacts: [], approach: "x" }, COLD)).toBe(false);
  });

  it("отклоняет неверный тип вложенного поля", () => {
    expect(
      matchesSchema(
        { contacts: [{ type: "email", value: 42 }], approach: "x", message: "y" },
        COLD
      )
    ).toBe(false);
  });

  it("отклоняет элемент массива без обязательного поля", () => {
    expect(
      matchesSchema(
        { contacts: [{ type: "email" }], approach: "x", message: "y" },
        COLD
      )
    ).toBe(false);
  });

  it("разрешает лишние поля — модель часто добавляет своё", () => {
    expect(
      matchesSchema(
        { contacts: [], approach: "x", message: "y", extra: 1 },
        COLD
      )
    ).toBe(true);
  });

  it("пропускает null в необязательном поле", () => {
    const schema: JsonSchema = {
      type: "object",
      properties: { subject: { type: "string" } },
      required: [],
    };
    expect(matchesSchema({ subject: null }, schema)).toBe(true);
  });

  it("не путает массив с объектом", () => {
    expect(matchesSchema([], { type: "object" })).toBe(false);
    expect(matchesSchema({}, { type: "array" })).toBe(false);
  });

  it("отклоняет NaN как число", () => {
    expect(matchesSchema(NaN, { type: "number" })).toBe(false);
    expect(matchesSchema(42, { type: "number" })).toBe(true);
  });

  it("проверяет boolean", () => {
    expect(matchesSchema(true, { type: "boolean" })).toBe(true);
    expect(matchesSchema("true", { type: "boolean" })).toBe(false);
  });
});

describe("parseJsonLoose", () => {
  it("разбирает чистый JSON", () => {
    expect(parseJsonLoose('{"a":1}')).toEqual({ a: 1 });
  });

  it("разбирает JSON в ```json-заборе```", () => {
    expect(parseJsonLoose('```json\n{"a":1}\n```')).toEqual({ a: 1 });
  });

  it("разбирает JSON в заборе без языка", () => {
    expect(parseJsonLoose('```\n{"a":1}\n```')).toEqual({ a: 1 });
  });

  it("вырезает JSON из болтовни вокруг", () => {
    expect(parseJsonLoose('Конечно! Вот результат: {"a":1} Готово.')).toEqual({ a: 1 });
  });

  it("разбирает массив верхнего уровня", () => {
    expect(parseJsonLoose("[1,2,3]")).toEqual([1, 2, 3]);
  });

  it("возвращает undefined, когда JSON нет", () => {
    expect(parseJsonLoose("извините, не могу")).toBeUndefined();
    expect(parseJsonLoose("")).toBeUndefined();
  });

  it("возвращает undefined на битом JSON", () => {
    expect(parseJsonLoose('{"a": }')).toBeUndefined();
  });
});
