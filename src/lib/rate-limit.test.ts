import { describe, it, expect, beforeEach } from "vitest";
import { clientIp, upstashCreds, checkDailyLimit } from "./rate-limit";

function clearUpstashEnv() {
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  delete process.env.KV_REST_API_URL;
  delete process.env.KV_REST_API_TOKEN;
}

// Unique per call so the module-level in-memory map never leaks between tests.
let seq = 0;
const freshIp = () => `test-ip-${Date.now()}-${seq++}`;

describe("clientIp", () => {
  it("takes the first address from a proxy chain", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.7, 70.41.3.18, 150.172.238.178",
    });
    expect(clientIp(headers)).toBe("203.0.113.7");
  });

  it("trims surrounding whitespace", () => {
    const headers = new Headers({ "x-forwarded-for": "  203.0.113.9  " });
    expect(clientIp(headers)).toBe("203.0.113.9");
  });

  it("falls back to 'unknown' when the header is absent", () => {
    expect(clientIp(new Headers())).toBe("unknown");
  });
});

describe("upstashCreds", () => {
  beforeEach(clearUpstashEnv);

  it("returns null when nothing is configured", () => {
    expect(upstashCreds()).toBeNull();
  });

  it("reads the native Upstash variables", () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://redis.example.com";
    process.env.UPSTASH_REDIS_REST_TOKEN = "native-token";
    expect(upstashCreds()).toEqual({
      url: "https://redis.example.com",
      token: "native-token",
    });
  });

  it("falls back to the Vercel KV aliases", () => {
    process.env.KV_REST_API_URL = "https://kv.example.com";
    process.env.KV_REST_API_TOKEN = "kv-token";
    expect(upstashCreds()).toEqual({
      url: "https://kv.example.com",
      token: "kv-token",
    });
  });

  it("requires both url and token", () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://redis.example.com";
    expect(upstashCreds()).toBeNull();
  });
});

describe("checkDailyLimit — in-memory fallback", () => {
  beforeEach(clearUpstashEnv);

  it("reports the remaining budget on a first hit", async () => {
    const result = await checkDailyLimit(freshIp());
    expect(result.ok).toBe(true);
    expect(result.limit).toBe(30);
    expect(result.remaining).toBe(29);
  });

  it("allows 30 requests and blocks the 31st", async () => {
    const ip = freshIp();
    let last = await checkDailyLimit(ip);
    for (let i = 1; i < 30; i++) {
      last = await checkDailyLimit(ip);
    }
    expect(last.ok).toBe(true);
    expect(last.remaining).toBe(0);

    const overLimit = await checkDailyLimit(ip);
    expect(overLimit.ok).toBe(false);
    expect(overLimit.remaining).toBe(0);
  });

  it("counts each IP independently", async () => {
    const first = await checkDailyLimit(freshIp());
    const second = await checkDailyLimit(freshIp());
    expect(first.remaining).toBe(29);
    expect(second.remaining).toBe(29);
  });
});
