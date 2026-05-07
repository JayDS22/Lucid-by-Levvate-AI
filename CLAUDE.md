# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Next.js dev server at http://localhost:3000
- `npm run build` — production build (Next.js 14 App Router)
- `npm run start` — run the production build
- `npm run lint` — `next lint`

There is no test runner configured. Type checking happens implicitly through `next build` (TypeScript strict mode).

## Required environment variables

Set in `.env.local` for dev, in Vercel project settings for prod:

- `ANTHROPIC_API_KEY` — Claude API key (model is hardcoded to `claude-sonnet-4-5` in `lib/analyzer.ts`)
- `SESSION_PASSWORD` — 32+ char random string for iron-session cookie encryption (a fallback exists in `lib/session.ts` but only for dev)
- `DEMO_PASSWORD` — passcode evaluators type at `/login` (defaults to `lucid2026` if unset)

## Architecture

Single Next.js 14 App Router project, deployed as serverless functions on Vercel. Frontend, API routes, and shared types live in one repo. The whole demo sits behind an iron-session passcode gate.

### Request flow for a clarity analysis

1. `app/page.tsx` (server component) checks the iron-session cookie via `getSession()`. Unauthenticated visitors are redirected to `/login`.
2. The client (`app/components/LucidApp.tsx`) POSTs `{ url, pastedText? }` to `/api/analyze`.
3. `app/api/analyze/route.ts` re-checks auth, then either calls `scrapeUrl()` (Cheerio + native `fetch`, 15s timeout) or builds a synthetic `ScrapedContent` from `pastedText` when scraping is blocked.
4. `lib/analyzer.ts` calls Claude with a 5-dimension rubric system prompt. The model is required to return strict JSON; the response is JSON.parsed, em-dashes are sanitized recursively (`deepClean`), and the `clarity_score` is computed as the rounded average of the five rubric scores (the model is *not* trusted to compute the average itself).
5. The same `AnalysisResult` shape can be POSTed back to `/api/pdf`, which builds a Levvate-branded jsPDF report and embeds `public/diagrams/architecture.png` as the final page.

### Key invariants when editing

- **Auth gate is per-route, not middleware.** Both `/api/analyze` and `/api/pdf` independently call `getSession()` and 401 on missing `session.authenticated`. There is no `middleware.ts`. Any new API route that handles user data must repeat this check.
- **Channel-structured prompt.** `lib/analyzer.ts` deliberately splits the scraped page into `title`, `metaDescription`, `h1/h2/h3`, detected `ctas`, and capped `bodyText` (first 6000 chars). Do not collapse this back into a single blob — score reproducibility depends on the channel structure. Caps in `lib/scraper.ts` (12 H2s, 12 H3s, 10 CTAs, 8000 chars body) exist to keep prompts under latency budget.
- **No em dashes anywhere.** The system prompt forbids them, and `analyzer.ts` runs a deep-walk `sanitize()` over the parsed JSON as a belt-and-suspenders pass. Do not introduce `—` in prompts, copy, or UI strings — there is no test enforcing this, only convention.
- **`clarity_score` is computed in code, not by the model.** If you change the rubric dimensions, also update the average computation in `analyzeContent()` and the `ClarityRubric` interface together.
- **Path alias `@/*`** maps to repo root (`tsconfig.json`). Imports use `@/lib/...` and `@/app/...`.
- **API routes pin `runtime = "nodejs"`** (not edge) because `cheerio` and `jspdf` need Node APIs. `analyze` sets `maxDuration = 60`, `pdf` sets `30` — Vercel limits.

### Brand surface conventions

- All icons in `app/components/icons.tsx` are hand-rolled SVG. The repo intentionally does **not** use `lucide-react` or emoji on brand surfaces (login, app shell, PDF), even though `lucide-react` is in `package.json`. New brand-facing UI should follow the same rule.
- Architecture diagrams in `public/diagrams/` are version-controlled as SVGs; PNGs are regenerated from them (via `cairosvg` per the README, not wired into `npm run build`). The PDF route reads `architecture.png` directly off disk via `fs/promises`, so the PNG must exist at deploy time.

## Repository context

This is a 60-minute technical assessment submission for the Levvate AI Automation Intern role (May 2026), authored by Jay Guwalani. Scope and constraints are documented in `Project-Scope` (gitignored) and `DELIVERY.md`. The README is written in a deliberately polished, defense-of-design voice — preserve that tone if editing it.
