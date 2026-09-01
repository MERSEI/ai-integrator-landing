import { describe, expect, it } from "vitest";
import {
  availableSlots,
  BOOKING_HORIZON_DAYS,
  BOOKING_SLOTS,
  dayKey,
  isBookableDay,
  isBookableSlotIso,
  monthGrid,
  normalizeContact,
  slotToDate,
} from "./booking";

// Пятница, 4 сентября 2026, 12:30 по локальному времени тестового окружения.
const NOW = new Date(2026, 8, 4, 12, 30);

describe("monthGrid", () => {
  it("возвращает 6 недель, начиная с понедельника", () => {
    const grid = monthGrid(2026, 8);
    expect(grid).toHaveLength(42);
    expect(grid[0].getDay()).toBe(1);
    expect(dayKey(grid[0])).toBe("2026-08-31");
  });
});

describe("isBookableDay", () => {
  it("отсекает выходные, прошлое и всё за горизонтом", () => {
    expect(isBookableDay(new Date(2026, 8, 4), NOW)).toBe(true); // сегодня, будни
    expect(isBookableDay(new Date(2026, 8, 7), NOW)).toBe(true); // понедельник
    expect(isBookableDay(new Date(2026, 8, 5), NOW)).toBe(false); // суббота
    expect(isBookableDay(new Date(2026, 8, 6), NOW)).toBe(false); // воскресенье
    expect(isBookableDay(new Date(2026, 8, 3), NOW)).toBe(false); // вчера
    expect(
      isBookableDay(new Date(2026, 8, 4 + BOOKING_HORIZON_DAYS + 1), NOW)
    ).toBe(false);
  });
});

describe("availableSlots", () => {
  it("на сегодня оставляет только слоты с запасом в два часа", () => {
    expect(availableSlots("2026-09-04", NOW)).toEqual([
      "15:00",
      "16:00",
      "17:00",
      "18:00",
    ]);
  });

  it("на будущий день оставляет все слоты", () => {
    expect(availableSlots("2026-09-07", NOW)).toEqual([...BOOKING_SLOTS]);
  });
});

describe("isBookableSlotIso", () => {
  it("принимает будущий слот и отвергает мусор, прошлое и заглядывание за горизонт", () => {
    expect(isBookableSlotIso(slotToDate("2026-09-07", "10:00").toISOString(), NOW)).toBe(
      true
    );
    expect(isBookableSlotIso("завтра днём", NOW)).toBe(false);
    expect(isBookableSlotIso(undefined, NOW)).toBe(false);
    expect(isBookableSlotIso(new Date(2026, 8, 1).toISOString(), NOW)).toBe(false);
    expect(
      isBookableSlotIso(
        new Date(2026, 8, 4 + BOOKING_HORIZON_DAYS + 5).toISOString(),
        NOW
      )
    ).toBe(false);
  });
});

describe("normalizeContact", () => {
  const email = "lead@example.com";

  it("нормализует телеграм-ник и отвергает непохожее", () => {
    expect(normalizeContact("telegram", "f1_owe", email)).toBe("@f1_owe");
    expect(normalizeContact("telegram", "@f1_owe", email)).toBe("@f1_owe");
    expect(normalizeContact("telegram", "ab", email)).toBeNull();
    expect(normalizeContact("telegram", "+420773693263", email)).toBeNull();
  });

  it("чистит телефон от разделителей", () => {
    expect(normalizeContact("phone", "+420 773 693-263", email)).toBe("+420773693263");
    expect(normalizeContact("whatsapp", "(067) 123 45 67", email)).toBe("0671234567");
    expect(normalizeContact("phone", "не скажу", email)).toBeNull();
  });

  it("для канала email подставляет email заявки, когда поле пустое", () => {
    expect(normalizeContact("email", "", email)).toBe(email);
    expect(normalizeContact("email", "other@example.com", email)).toBe(
      "other@example.com"
    );
    expect(normalizeContact("email", "not-an-email", email)).toBeNull();
  });
});
