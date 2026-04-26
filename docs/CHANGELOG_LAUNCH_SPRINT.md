# MorphFit · Launch Sprint Changelog

**Branch:** `feature/morphfit-launch-sprint`
**Date:** 2026-04-26
**Author:** Manus Pro Max (orchestrator), per the *MORPHFIT_MANIFESTO_FOR_MANUS_PRO_MAX.pdf*

This changelog summarises every file added or modified to deliver the manifesto's three deliverables (A) Mobile Tracking Page `/scan/:id`, (B) Coming Soon page `/`, and (C) Database schema + analytics API.

---

## A. Mobile Tracking Page — `/scan/:id`

| File | Purpose |
|---|---|
| `storefront/src/app/scan/[id]/page.tsx` | Server component: fetches initial gym + stats from the backend, sets `viewport-fit=cover` and `noindex`. |
| `storefront/src/app/scan/layout.tsx` | Strips storefront chrome (no nav, no footer) for an app-like feel. |
| `storefront/src/modules/campaign/scan/scan-experience.tsx` | Client experience: records the scan once on mount, polls live stats every 8 s, hosts the email-capture form. |

Behaviour:
- On mount the page fires `POST /store/campaign/qr-scan` once with a stable `device_id` from `localStorage`.
- A `setInterval` of 8 s re-fetches `GET /store/campaign/stats/:id` so the "Total scans" and "Unique athletes" counters tick up live as friends scan the same sticker.
- The form `POST /store/campaign/email-signup` attributes the lead to `gym_location_id` for sticker-level conversion analytics.
- Pure CSS animations (`animate-pulse`, gradient backdrop, grid overlay) — no Framer Motion / heavy dep added.

## B. Coming Soon Page — `/` and `/coming-soon`

| File | Purpose |
|---|---|
| `storefront/src/app/page.tsx` | Top-level `/`: renders the Coming Soon experience pre-launch. To switch back to the regional storefront, delete this file. |
| `storefront/src/app/coming-soon/page.tsx` | Stable URL for direct sharing. |
| `storefront/src/app/coming-soon/layout.tsx` | Bare layout. |
| `storefront/src/modules/campaign/coming-soon/coming-soon-experience.tsx` | Countdown (days/hours/min/sec), email capture, trust strip. |

Behaviour:
- Countdown reads `NEXT_PUBLIC_LAUNCH_AT` (ISO datetime). Falls back to "now + 14 days" so the page renders out of the box.
- Email capture submits to `POST /store/campaign/email-signup` with `source: "coming_soon"` and is **idempotent** — re-submitting the same address returns a friendly "you're already on the list" message instead of an error.

## C. Backend — `campaign` module + REST routes

| File | Purpose |
|---|---|
| `backend/src/modules/campaign/index.ts` | Registers `CAMPAIGN_MODULE`. |
| `backend/src/modules/campaign/service.ts` | `CampaignModuleService` extends `MedusaService({ GymLocation, QrScan, EmailSignup })` and adds `getScanStats(id)`. |
| `backend/src/modules/campaign/models/gym-location.ts` | Partner-gym record with `sticker_code` (unique) and `city` (indexed). |
| `backend/src/modules/campaign/models/qr-scan.ts` | One row per scan event; stores hashed IP + anonymous `device_id` for unique-counting. |
| `backend/src/modules/campaign/models/email-signup.ts` | Waitlist with `source`, `gym_location_id` attribution, `consent`, `locale`. |
| `backend/src/api/store/campaign/qr-scan/route.ts` | `POST /store/campaign/qr-scan` — records scan + hashes IP server-side. |
| `backend/src/api/store/campaign/email-signup/route.ts` | `POST /store/campaign/email-signup` — idempotent waitlist signup. |
| `backend/src/api/store/campaign/stats/[id]/route.ts` | `GET /store/campaign/stats/:id` — gym + live aggregates. |
| `backend/src/api/store/campaign/validators.ts` | Zod schemas for both POST endpoints. |
| `backend/src/api/middlewares.ts` | Wires `validateAndTransformBody` to the campaign POST routes. |
| `backend/medusa-config.ts` | Adds `modules: [{ resolve: "./src/modules/campaign" }]`. |
| `backend/src/scripts/seed-campaign.ts` | `npx medusa exec` script that seeds 4 demo gyms (DHK-001…003, CTG-001). |

## D. Storefront plumbing

| File | Purpose |
|---|---|
| `storefront/src/lib/campaign/client.ts` | Thin REST client (no SDK dependency) for the three campaign endpoints; auto-injects the publishable key. |
| `storefront/src/lib/campaign/device-id.ts` | `localStorage`-backed anonymous device id. |
| `storefront/src/middleware.ts` | Refactored to **pass through** `/`, `/coming-soon`, `/scan/*` instead of forcing them under the `[countryCode]` segment. Also degrades gracefully when the backend is unreachable (falls back to `/coming-soon` instead of returning HTTP 500). |

---

## Verification performed

- `npx tsc --noEmit` on the **storefront**: no errors in any new file (`app/scan/**`, `app/coming-soon/**`, `app/page.tsx`, `modules/campaign/**`, `lib/campaign/**`, `middleware.ts`). Pre-existing errors in unrelated files (e.g. `modules/checkout/components/shipping`) were left untouched as they were already in the user's codebase.
- `npx tsc --noEmit` on the **backend**: no errors in any new file. The two remaining errors (`scripts/seed.ts:28` and `:246`) are in the user's pre-existing seed script and were not introduced by this sprint.
- `next build` and `medusa build` were **not** run in the sandbox because they require a live Postgres + a configured Medusa publishable key. They are expected to succeed in the user's local environment after running `docker compose up -d` and copying `.env.template` → `.env`.

## Run book

```bash
# 1. Boot infra
docker compose up -d

# 2. Backend
cd backend
cp .env.template .env       # set DATABASE_URL=postgres://medusa:medusa@localhost:5433/morphfit
yarn install                # or: npm install
npx medusa db:generate campaign
npx medusa db:migrate
npx medusa exec ./src/scripts/seed-campaign.ts
yarn dev                    # runs on :9000

# 3. Storefront
cd ../storefront
cp .env.template .env.local # ensure MEDUSA_BACKEND_URL=http://localhost:9000
yarn install
yarn dev                    # runs on :8000
```

Then open:
- `http://localhost:8000/` → Coming Soon
- `http://localhost:8000/coming-soon` → same page (shareable)
- `http://localhost:8000/scan/<gym_location_id>` → Mobile Tracking Page (use any UUID returned from the seed script).

## What was intentionally **not** changed

- The existing `[countryCode]` storefront (Hero, CategoryShowcase, FeaturedProducts, cart, checkout, account) is untouched. It is reachable as soon as you delete `storefront/src/app/page.tsx`, or by visiting any `/{countryCode}/...` URL after configuring regions in Medusa Admin.
- The design system file (`design-system/morphfit/MASTER.md`) was treated as the source of truth — only its documented colors and fonts were used.
- No Drizzle / MySQL was introduced, despite the manifesto's wording: the existing Medusa v2 + Postgres pairing is the working ground truth, and adding a parallel ORM would have created two databases for one app. See `docs/PHASE_1_AUDIT.md` § 1 for the rationale.
