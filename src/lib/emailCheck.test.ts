import { describe, expect, it } from "vitest";
import { emailProblem, isSendableEmail, suggestEmail } from "./emailCheck";

describe("emailProblem", () => {
  it("пропускает нормальные адреса", () => {
    for (const email of [
      "lead@gmail.com",
      "first.last+tag@company.co.uk",
      "sergey.voytko@smarton.by",
      "a@b.io",
    ]) {
      expect(emailProblem(email), email).toBeNull();
    }
  });

  it("ловит структурный мусор, который копился в таблице лидов", () => {
    expect(emailProblem("рр@рртрр.оо")).toBe("cyrillic");
    expect(emailProblem("гmail.com@mail.ru")).toBe("cyrillic");
    expect(emailProblem("без-собаки.com")).toBe("cyrillic");
    expect(emailProblem("no-at-sign.com")).toBe("shape");
    expect(emailProblem("two@@at.com")).toBe("shape");
    expect(emailProblem("dot@@end.")).toBe("shape");
    expect(emailProblem("double@dot..com")).toBe("domain");
    expect(emailProblem("digits@mail.c0m")).toBe("domain");
  });
});

describe("suggestEmail", () => {
  it("исправляет опечатки в популярных доменах", () => {
    expect(suggestEmail("ruskosak2008@gmail.con")).toBe("ruskosak2008@gmail.com");
    expect(suggestEmail("nasibafajzulla@gmail.comjj")).toBe(
      "nasibafajzulla@gmail.com"
    );
    expect(suggestEmail("user@gmial.com")).toBe("user@gmail.com");
    expect(suggestEmail("user@yandex.ry")).toBe("user@yandex.ru");
    expect(suggestEmail("user@ukr.ne")).toBe("user@ukr.net");
  });

  it("молчит на известных и на чужих доменах", () => {
    expect(suggestEmail("user@gmail.com")).toBeNull();
    expect(suggestEmail("user@mail.ru")).toBeNull();
    expect(suggestEmail("sergey.voytko@smarton.by")).toBeNull();
    expect(suggestEmail("ceo@influence.crm")).toBeNull();
    expect(suggestEmail("marrigogatadze@top.ge")).toBeNull();
  });

  it("не правит короткие домены по двум ошибкам сразу", () => {
    // ya.ru ← xa.ru — одна правка, чинить можно.
    expect(suggestEmail("user@xa.ru")).toBe("user@ya.ru");
    // i.ua от многих двухбуквенных доменов в двух правках — не трогаем.
    expect(suggestEmail("user@t.co")).toBeNull();
  });

  it("не выдаёт подсказку для структурно битого адреса", () => {
    expect(suggestEmail("рр@рртрр.оо")).toBeNull();
    expect(suggestEmail("broken@")).toBeNull();
  });
});

describe("isSendableEmail", () => {
  it("отсекает и битые, и опечатки", () => {
    expect(isSendableEmail("lead@gmail.com")).toBe(true);
    expect(isSendableEmail("lead@smarton.by")).toBe(true);
    expect(isSendableEmail("lead@gmail.con")).toBe(false);
    expect(isSendableEmail("рр@рртрр.оо")).toBe(false);
  });
});
