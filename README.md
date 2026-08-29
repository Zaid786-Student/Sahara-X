# Sahara X — React + Node

A migration of the original single-file `sahara-x.html` app into a
React + Vite (frontend) / Express + Prisma + PostgreSQL (backend) stack.
Behavior, copy, icons, data, and design tokens are ported 1:1 — see
"Assumptions & behavior notes" below for the handful of places that
necessarily changed shape (server-side API key, real DB instead of
`window.storage`, etc.).

```
/frontend   Vite + React + Tailwind SPA
/backend    Express + Prisma API (PostgreSQL)
```

## 1. Local setup

### Backend

```bash
cd backend
cp .env.example .env       # fill in GEMINI_API_KEY and DATABASE_URL
npm install
npx prisma migrate dev --name init   # creates schemes + sessions tables
npx prisma db seed                   # seeds the 10 curated government schemes
npm run dev                          # http://localhost:8787
```

You need a local PostgreSQL instance (or any hosted Postgres) for
`DATABASE_URL`. A quick way to get one locally:

```bash
docker run --name sahara-x-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=sahara_x -p 5432:5432 -d postgres:16
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sahara_x?schema=public
```

### Frontend

```bash
cd frontend
cp .env.example .env       # VITE_API_BASE_URL=http://localhost:8787
npm install
npm run dev                # http://localhost:5173
```

Open `http://localhost:5173`. A session id is generated in `localStorage`
on first load (no auth, per spec) and used for all `/api/session/:id`
calls.

## 2. Deploying

### Backend → Render

`backend/render.yaml` defines a web service plus a managed Postgres
database. From the Render dashboard, "New → Blueprint", point it at this
repo/subfolder, and set the `GEMINI_API_KEY` and `CORS_ORIGIN` (your
Vercel frontend URL) secrets when prompted — everything else (build
command, `DATABASE_URL`, migrations, seeding) is wired in the blueprint.
`buildCommand` runs `prisma migrate deploy`; run `npx prisma db seed`
once manually (Render shell) after the first deploy to populate schemes.

### Frontend → Vercel

`frontend/vercel.json` sets the Vite build/output config. Import the repo
in Vercel, set the root directory to `frontend`, and add an environment
variable `VITE_API_BASE_URL` pointing at your Render backend URL
(e.g. `https://sahara-x-backend.onrender.com`).

## 3. API surface

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/claude` | `{system, user}` → calls Gemini server-side (free tier), returns the parsed JSON object (fence-stripped) |
| `GET` | `/api/schemes` | Curated government scheme list (seeded, never AI-generated) |
| `GET` | `/api/session/:id` | Returns `{profile, savedIdeas, recommendations, report, theme}` for a session, auto-creating one with defaults if it doesn't exist yet |
| `POST` | `/api/session/:id` | Upserts any subset of `{profile, savedIdeas, recommendations, report, theme}` |

## 4. File structure

```
frontend/src/
  main.jsx, App.jsx          top-level router (view: landing/onboarding/loading/dashboard)
  globals.css                 :root / [data-theme="dark"] tokens + all component CSS, ported verbatim
  store/useStore.js           Zustand store — same fields as the original global `state`, plus
                               the onAction()-equivalent methods (nav, toggleSave, runDiscovery, ...)
  lib/
    icons.js                  the `I` SVG map, extracted verbatim
    data.js                   SECTORS / SKILLS / SECTOR_ICON / NAV_MAIN / NAV_ACCOUNT
    fallbackIdeas.js           FALLBACK_IDEAS, verbatim (client copy — see notes below)
    prompts.js                 RECO_SYSTEM / REPORT_SYSTEM, verbatim
    format.js                  fmtRupee / riskColor / dayPart / matchSchemes
    api.js                     fetch wrappers for the Express API
  components/                  Icon, ThemeToggle, Journey, OpportunityCard, SchemeCard, EmptyDiscoverPrompt
  views/                       Landing, Onboarding, Loading, DashboardShell, Overview, Discover,
                               MyOpportunities, OpportunityDetail, Compare, Insights, Schemes,
                               Roadmap, Report, Voice, Saved, Profile, Settings

backend/
  server.js                   Express app (CORS, JSON body parsing, route mounting)
  src/routes/                 claude.js, schemes.js, session.js
  src/lib/gemini.js            server-side callAI() — Gemini free-tier client
  src/data/                   schemes.js, fallbackIdeas.js — source of truth for the seed script
  prisma/schema.prisma         Scheme + Session models
  prisma/seed.js               seeds the schemes table
```

## 5. Assumptions & behavior notes

A few places couldn't be a byte-for-byte port because the client/server
split and framework change require it. Everything else — copy, colors,
icons, layout, business logic, prompts, fallback data — is unchanged.

- **`FALLBACK_IDEAS` duplication.** The spec's two data tables are
  `schemes` and `sessions`; there's no `fallback_ideas` table. Since the
  original `RECO_SYSTEM` prompt embeds `FALLBACK_IDEAS` as grounding text
  and the client also needs it to build an offline fallback
  recommendation set when `POST /api/claude` fails, the array is kept as
  a plain module in **both** `frontend/src/lib/fallbackIdeas.js` (used to
  build the prompt/fallback client-side, same as the original) and
  `backend/src/data/fallbackIdeas.js` (kept for completeness /
  server-side reference, per "move into a seed script"). Both copies are
  verbatim and kept in sync manually — there was no single natural owner
  given the spec's table list.
- **`callClaude()` split, backend swapped to Gemini.** The original built
  the full system/user prompt client-side and called an LLM API directly.
  The frontend still builds `RECO_SYSTEM`/`REPORT_SYSTEM` and the user
  message (identical strings) and `POST`s them to `/api/claude` (route
  name kept for zero frontend changes), which now calls the Google
  Gemini API server-side (`gemini-2.5-flash`, free tier — no credit card
  required) using `GEMINI_API_KEY`, instead of Anthropic. The response
  contract (parsed JSON, fences stripped) is unchanged, so swapping back
  to another provider later only touches `src/lib/gemini.js`.
- **Storage → API.** `window.storage.get/set('profile'|'savedIdeas'|
  'recommendations'|'report'|'theme')` is replaced by `GET`/`POST
  /api/session/:id`, backed by a `sessions` row per browser (id
  generated into `localStorage`, no auth, matching the spec). `persist()`
  became a store method that POSTs the changed field(s).
- **No `esc()` helper.** The original's `esc(s)` guarded against breaking
  `innerHTML` when interpolating user text. React escapes all text
  content by default, so this was dropped rather than ported — behavior
  (safe rendering of profile name, etc.) is unchanged.
- **No client-side routing library.** The original app never used the
  URL bar — it drove everything off `state.view`/`state.route`. The React
  port keeps that exact model (no React Router) so behavior on
  refresh/back-button matches the original precisely: a refresh always
  returns to the dashboard/landing based on session state, not a
  bookmarked sub-page.
- **Settings toggles.** "Notifications" and "Voice by default" were
  purely cosmetic switches in the original (`el.classList.toggle('on')`,
  never read or persisted anywhere). They're reproduced with local
  component state in `Settings.jsx` rather than store state, since
  that's what the original actually did.
- **Budget slider "live update" hack.** The original updated the number
  display directly via DOM query on `input` and only did a full
  `render()` on `change`, to avoid re-rendering the whole app per pixel
  of drag. React's diffing makes that unnecessary — the port just binds
  the slider directly to the store on every `input` event with no visible
  behavior difference.
- **Everything else** — every screen's copy, layout, class names, icon
  paths, government scheme data, fallback business ideas, Claude system
  prompts, feasibility math in Compare, roadmap steps, risk colors, etc.
  — is carried over verbatim.
