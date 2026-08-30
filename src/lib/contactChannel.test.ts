import { describe, expect, it } from "vitest";
import {
  contactLink,
  isValidContact,
  needsContactValue,
  normalizeChannel,
  normalizeContact,
} from "./contactChannel";

describe("normalizeChannel", () => {
  it("keeps known channels", () => {
    expect(normalizeChannel("telegram")).toBe("telegram");
    expect(normalizeChannel("whatsapp")).toBe("whatsapp");
  });

  it("falls back to email for anything else", () => {
    expect(normalizeChannel("skype")).toBe("email");
    expect(normalizeChannel(undefined)).toBe("email");
    expect(normalizeChannel(42)).toBe("email");
  });
});

describe("normalizeContact", () => {
  it("brings telegram handles to @username", () => {
    expect(normalizeContact("telegram", "durov")).toBe("@durov");
    expect(normalizeContact("telegram", "@durov")).toBe("@durov");
    expect(normalizeContact("telegram", "https://t.me/durov")).toBe("@durov");
    expect(normalizeContact("telegram", " t.me/durov/ ")).toBe("@durov");
  });

  it("strips formatting from phone numbers", () => {
    expect(normalizeContact("phone", "+420 773 693 263")).toBe("+420773693263");
    expect(normalizeContact("whatsapp", "(380) 67-000-00-00")).toBe("380670000000");
  });

  it("keeps unrecognized input instead of dropping the lead", () => {
    expect(normalizeContact("telegram", "ping me in tg")).toBe("ping me in tg");
  });

  it("returns an empty string for missing input", () => {
    expect(normalizeContact("telegram", undefined)).toBe("");
    expect(normalizeContact("phone", "   ")).toBe("");
  });
});

describe("isValidContact", () => {
  it("accepts real handles and numbers", () => {
    expect(isValidContact("telegram", "durov")).toBe(true);
    expect(isValidContact("phone", "+420 773 693 263")).toBe(true);
    expect(isValidContact("email", "lead@example.com")).toBe(true);
  });

  it("rejects junk", () => {
    expect(isValidContact("telegram", "ab")).toBe(false);
    expect(isValidContact("phone", "1234")).toBe(false);
    expect(isValidContact("email", "not-an-email")).toBe(false);
  });
});

describe("contactLink", () => {
  it("builds one-click links per channel", () => {
    expect(contactLink("telegram", "@durov")).toBe("https://t.me/durov");
    expect(contactLink("whatsapp", "+380 67 000 00 00")).toBe("https://wa.me/380670000000");
    expect(contactLink("phone", "420773693263")).toBe("tel:+420773693263");
    expect(contactLink("email", "Lead@Example.com")).toBe("mailto:lead@example.com");
  });

  it("returns null when there is nothing to link to", () => {
    expect(contactLink("telegram", "")).toBeNull();
    expect(contactLink("phone", "нет")).toBeNull();
  });
});

describe("needsContactValue", () => {
  it("asks for a second field only when the channel is not email", () => {
    expect(needsContactValue("email")).toBe(false);
    expect(needsContactValue("telegram")).toBe(true);
  });
});
