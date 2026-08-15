# AI Integrator

> Bilingual marketing site for an AI automation platform, with ten working
> tool demos running against Gemini — not mockups.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

**[🔗 Live demo](https://ai-integrator-landing.vercel.app)**

---

## What it is

A demand-validation site for a platform that packages AI tools for sales,
marketing and operations teams.

The point of difference: visitors don't read about the tools, they run them.
Ten of the advertised tools are live behind the landing page, each backed by a
real Gemini call, each free to try twice a day without signing up.

| Tool | What it does |
| --- | --- |
| `coldmessage` | Drafts a cold outreach message from a prospect description |
| `commenthunter` | Finds comment threads worth replying to |
| `leadradar` | Surfaces buying signals from raw text |
| `objectionkiller` | Generates responses to sales objections |
| `poaching` | Identifies hiring signals in company data |
| `trendsniper` | Extracts emerging topics |
| `bizdoctor` | Diagnoses weak points in a business description |
| `followupbot` | Writes follow-up sequences |
| `inboxzero` | Triages and drafts inbox replies |
| `personachannel` | Builds an audience persona from inputs |

Plus `subscribe` for email capture and `leads` for the internal lead list.

## Stack

**Next.js 15** (App Router) · **TypeScript 5.7** · **Tailwind 3** ·
**Framer Motion** · **React Hook Form** · **Google Gemini** ·
**Upstash Redis** · **Google Sheets API** · deployed on **Vercel**

## Architecture decisions

| Decision | Reasoning | Alternative considered |
| --- | --- | --- |
| Route groups `(en)` / `(ru)` instead of an i18n library | Two locales, fully static copy. Route groups give real URLs and zero client-side bundle cost. | `next-intl` — more machinery than two languages justify |
| Honeypot field instead of CAPTCHA | Stops naive bots at zero cost to the user. A conversion-focused landing page can't afford a CAPTCHA in the funnel. | reCAPTCHA — better coverage, worse conversion |
| Upstash Redis over REST | Serverless functions have no persistent memory, so a counter in a `Map` resets on every cold start. REST works without connection pooling. | Vercel KV — same thing, more lock-in |
| Rate limiter degrades to in-memory | If Redis is unreachable, the API keeps serving instead of returning 500s. Imperfect limiting beats an outage. | Fail closed — safer against abuse, worse for users |
| Two-tier limits: 30/day global, 2/day per tool | The global budget stops scraping; the per-tool budget keeps the demo free but finite. | A single global limit — either too tight or too loose |
| Leads persisted before Mailchimp is called | Mailchimp is optional and can be down. A lead that reaches the server is never lost to a third-party failure. | Mailchimp as the only store — simpler, loses data |

## Running locally

```bash
git clone https://github.com/MERSEI/ai-integrator-landing.git
cd ai-integrator-landing
npm install
cp .env.example .env.local   # fill in what you need
npm run dev
```

Opens on <http://localhost:3000>.

Every integration is optional. Without `GEMINI_API_KEY` the tool demos are
unavailable; without Upstash the rate limiter falls back to memory; without
Mailchimp leads are still stored. Nothing crashes on a missing key — see
`.env.example`.

## Tests

```bash
npm test          # single run
npm run test:watch
```

Vitest covers the rate-limiting layer: proxy-chain IP extraction, credential
resolution across both the native Upstash and Vercel KV variable names, and
the in-memory fallback path.

## Project layout

```
src/
├── app/
│   ├── (en)/ (ru)/   locale route groups
│   └── api/          12 route handlers — 10 tool demos, subscribe, leads
├── components/       landing sections
└── lib/
    ├── gemini.ts     model calls and locale detection
    ├── rate-limit.ts two-tier limiter with in-memory fallback
    ├── leads.ts      lead persistence
    └── i18n.ts       locale resolution
```

## What I'd do differently

- **The limiter and the storage layer are entangled.** `rate-limit.ts` knows
  about Upstash directly. A storage interface with Redis and memory
  implementations behind it would make both testable without env juggling.
- **Test coverage stops at the lib layer.** The route handlers have the most
  branching — honeypot, validation, limits, Mailchimp failure — and none of it
  is covered yet. That's the next thing I'd write.
- **The daily key is UTC-based.** `new Date().toISOString().slice(0, 10)` means
  a user's quota resets at midnight UTC, not local midnight. Fine for a demo,
  wrong for a paid product.
- **`src/lib` has grown into a junk drawer.** Ten tool modules, i18n, storage
  and a stray `layout.tsx` in one flat folder. It wants splitting by domain.

## License

MIT — see [LICENSE](LICENSE).
