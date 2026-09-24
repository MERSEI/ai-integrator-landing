import { describe, it, expect } from "vitest";
import { pollScan, safeThreadsUrl, startScan, taskzConfig, toView, SCAN_ID_RE, type UpstreamScan } from "./taskz";

const stats = { keywordsPlanned: 8, keywordsSearched: 8, keywordsFailed: 0, postsFetched: 42, passedStage1: 10, classified: 10 };
const cfg = { url: "https://taskz.example", token: "secret" };
const json = (status: number, body: unknown) => Promise.resolve(new Response(JSON.stringify(body), { status }));

describe("toView — honesty of the outcome", () => {
  it("shows a lead only with a real Threads link", () => {
    const up: UpstreamScan = {
      state: "done",
      result: { status: "lead_found", stats, lead: { permalink: "https://www.threads.com/@a/post/1", username: "a", text: "нужен стоматолог", score: 91.4, reason: "просит совет", keyword: "k" } },
    };
    expect(toView(up)).toMatchObject({ state: "done", outcome: "lead_found", lead: { url: "https://www.threads.com/@a/post/1", score: 91 }, stats: { keywordsSearched: 8, postsFetched: 42 } });
  });

  it("never turns a lead with a foreign link into an empty result", () => {
    const up: UpstreamScan = { state: "done", result: { status: "lead_found", stats, lead: { permalink: "https://evil.example/x", username: "a", text: "t", score: 90, reason: "r", keyword: "k" } } };
    expect(toView(up)).toEqual({ state: "done", outcome: "unavailable" });
  });

  it("no_leads only when the search really ran", () => {
    expect(toView({ state: "done", result: { status: "no_leads", stats } })).toEqual({ state: "done", outcome: "no_leads", stats: { keywordsSearched: 8, postsFetched: 42 } });
  });

  it("maps every failure to unavailable, never to no_leads", () => {
    expect(toView({ state: "failed", error: "timeout" })).toEqual({ state: "done", outcome: "unavailable" });
    expect(toView({ state: "done" })).toEqual({ state: "done", outcome: "unavailable" });
    expect(toView({ state: "done", result: { status: "unavailable", stats } })).toEqual({ state: "done", outcome: "unavailable" });
  });

  it("passes queue/running states through", () => {
    expect(toView({ state: "queued", queuePosition: 0 })).toEqual({ state: "queued", queuePosition: 1 });
    expect(toView({ state: "running" })).toEqual({ state: "running" });
  });

  it("trims long text and strips control characters", () => {
    const up: UpstreamScan = { state: "done", result: { status: "lead_found", stats, lead: { permalink: "https://threads.com/p", username: "a", text: `a\u0000${"б".repeat(600)}`, score: 80, reason: "r", keyword: "k" } } };
    const v = toView(up);
    expect(v.state === "done" && v.outcome === "lead_found" && v.lead.text.length).toBe(400);
    expect(JSON.stringify(v)).not.toContain("\\u0000");
  });
});

describe("safeThreadsUrl", () => {
  it("accepts https Threads hosts only", () => {
    expect(safeThreadsUrl("https://threads.net/@a/post/1")).not.toBeNull();
    expect(safeThreadsUrl("http://threads.com/x")).toBeNull();
    expect(safeThreadsUrl("https://threads.com.evil.io/x")).toBeNull();
    expect(safeThreadsUrl("javascript:alert(1)")).toBeNull();
  });
});

describe("taskzConfig", () => {
  it("requires both url and token and trims trailing slashes", () => {
    expect(taskzConfig({})).toBeNull();
    expect(taskzConfig({ TASKZ_SCAN_URL: "https://x.io" })).toBeNull();
    expect(taskzConfig({ TASKZ_SCAN_URL: "https://x.io//", TASKZ_SCAN_TOKEN: " t " })).toEqual({ url: "https://x.io", token: "t" });
  });
});

describe("startScan / pollScan", () => {
  it("starts a scan with the bearer token", async () => {
    let seen: { url: string; auth: string | null; body: string } | undefined;
    const f = ((url: string, init: RequestInit) => {
      seen = { url, auth: new Headers(init.headers).get("authorization"), body: String(init.body) };
      return json(202, { id: "abc" });
    }) as unknown as typeof fetch;
    expect(await startScan(cfg, { niche: "кофейня", geo: "Львов" }, f)).toEqual({ ok: true, id: "abc" });
    expect(seen).toEqual({ url: "https://taskz.example/scan", auth: "Bearer secret", body: JSON.stringify({ niche: "кофейня", geo: "Львов" }) });
  });

  it("maps 429 to busy and anything else, including network errors, to unavailable", async () => {
    expect(await startScan(cfg, { niche: "n" }, (() => json(429, { error: "daily_limit" })) as unknown as typeof fetch)).toEqual({ ok: false, reason: "busy" });
    expect(await startScan(cfg, { niche: "n" }, (() => json(500, {})) as unknown as typeof fetch)).toEqual({ ok: false, reason: "unavailable" });
    expect(await startScan(cfg, { niche: "n" }, (() => Promise.reject(new Error("down"))) as unknown as typeof fetch)).toEqual({ ok: false, reason: "unavailable" });
  });

  it("polls and distinguishes an expired job from an outage", async () => {
    const running = await pollScan(cfg, "id", (() => json(200, { state: "running" })) as unknown as typeof fetch);
    expect(running).toEqual({ ok: true, view: { state: "running" } });
    expect(await pollScan(cfg, "id", (() => json(404, {})) as unknown as typeof fetch)).toEqual({ ok: false, reason: "not_found" });
    expect(await pollScan(cfg, "id", (() => Promise.reject(new Error("x"))) as unknown as typeof fetch)).toEqual({ ok: false, reason: "unavailable" });
  });
});

describe("SCAN_ID_RE", () => {
  it("only lets UUIDs through to the upstream URL", () => {
    expect(SCAN_ID_RE.test("123e4567-e89b-12d3-a456-426614174000")).toBe(true);
    expect(SCAN_ID_RE.test("../admin")).toBe(false);
    expect(SCAN_ID_RE.test("123e4567-e89b-12d3-a456-426614174000/../x")).toBe(false);
  });
});
