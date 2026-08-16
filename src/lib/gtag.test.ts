import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

/**
 * Модуль читает env на уровне модуля, поэтому каждый кейс импортирует его
 * заново после подмены переменных.
 */
async function loadGtag(env: { id?: string; label?: string }) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_GOOGLE_ADS_ID", env.id ?? "");
  vi.stubEnv("NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL", env.label ?? "");
  return import("./gtag");
}

type GtagCall = [string, string, Record<string, unknown>?];

/** Ставит фейковый window.gtag и возвращает список вызовов. */
function stubWindow(): GtagCall[] {
  const calls: GtagCall[] = [];
  (globalThis as { window?: unknown }).window = {
    gtag: (...args: GtagCall) => calls.push(args),
  };
  return calls;
}

function clearWindow() {
  delete (globalThis as { window?: unknown }).window;
}

afterEach(() => {
  vi.unstubAllEnvs();
  clearWindow();
});

describe("conversionTarget", () => {
  it("склеивает аккаунт и метку в send_to", async () => {
    const { conversionTarget } = await loadGtag({ id: "AW-123" });
    expect(conversionTarget("LABEL")).toBe("AW-123/LABEL");
  });

  it("возвращает null без идентификатора аккаунта", async () => {
    const { conversionTarget } = await loadGtag({});
    expect(conversionTarget("LABEL")).toBeNull();
  });

  it("возвращает null без метки", async () => {
    const { conversionTarget } = await loadGtag({ id: "AW-123" });
    expect(conversionTarget("")).toBeNull();
  });
});

describe("trackConversion", () => {
  beforeEach(clearWindow);

  it("отправляет событие conversion с send_to и параметрами", async () => {
    const { trackConversion } = await loadGtag({ id: "AW-123" });
    const calls = stubWindow();

    expect(trackConversion("LABEL", { value: 30, currency: "USD" })).toBe(true);
    expect(calls).toEqual([
      ["event", "conversion", { send_to: "AW-123/LABEL", value: 30, currency: "USD" }],
    ]);
  });

  it("ничего не делает, когда метка не настроена", async () => {
    const { trackConversion } = await loadGtag({ id: "AW-123" });
    const calls = stubWindow();

    expect(trackConversion("")).toBe(false);
    expect(calls).toEqual([]);
  });

  it("не падает, когда тег ещё не загрузился", async () => {
    const { trackConversion } = await loadGtag({ id: "AW-123" });
    expect(trackConversion("LABEL")).toBe(false);
  });
});

describe("trackLeadConversion", () => {
  beforeEach(clearWindow);

  it("берёт метку лида из окружения и проставляет transaction_id", async () => {
    const { trackLeadConversion } = await loadGtag({
      id: "AW-123",
      label: "LEAD",
    });
    const calls = stubWindow();

    expect(trackLeadConversion("hero")).toBe(true);
    expect(calls).toHaveLength(1);
    const [event, name, params] = calls[0];
    expect(event).toBe("event");
    expect(name).toBe("conversion");
    expect(params?.send_to).toBe("AW-123/LEAD");
    expect(params?.transaction_id).toMatch(/^hero-\d+$/);
  });

  it("молчит, если метка лида не задана", async () => {
    const { trackLeadConversion } = await loadGtag({ id: "AW-123" });
    const calls = stubWindow();

    expect(trackLeadConversion("hero")).toBe(false);
    expect(calls).toEqual([]);
  });
});
