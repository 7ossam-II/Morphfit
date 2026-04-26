# Phase 1: Cleaning — Audit Report

**Date:** 2026-04-26
**Repo:** `7ossam-II/Morphfit` (default branch: `master`)
**Auditor:** Manus Pro Max (orchestrator)

---

## 1. Stack Reality Check vs. Manifesto

The manifesto assumed a `Next.js + tRPC + Drizzle ORM + MySQL/TiDB` stack. The actual repository uses a different but functionally equivalent modern stack:

| Layer | Manifesto (assumed) | Actual repo | Decision |
|---|---|---|---|
| Storefront | Next.js 15 + tRPC | Next.js 15 (App Router) + Medusa SDK (REST) | Adapt — keep existing |
| API Layer | tRPC | Medusa Custom API Routes (`backend/src/api/store/...`) | Use Medusa custom routes for `campaign.*` |
| Commerce engine | Medusa.js | Medusa v2 (`backend/`) | Match |
| Database | MySQL (TiDB) + Drizzle | PostgreSQL 16 (Docker) + Medusa data-model (MikroORM) | Match Medusa convention |
| Styling | Tailwind 4 + Framer Motion | Tailwind + `@medusajs/ui-preset` (no Framer Motion yet) | Add CSS-only animations to avoid new heavy deps |
| Hosting | Manus | Local Docker (Postgres + Redis) | Out of scope |

**Conclusion:** The manifesto's intent (type-safe API, real-time analytics, mobile-first UX, Medusa commerce) is preserved, but implementations are mapped to the existing Medusa v2 patterns rather than introducing tRPC/Drizzle which would conflict with the working scaffold.

## 2. Code Audit

- `storefront/` is the official `medusa-next` starter (Next.js 15 + React 19 App Router) with a `[countryCode]` segment that requires a valid Medusa region. The middleware rewrites all unmatched requests through that segment.
- `backend/` is the Medusa v2 starter with empty `modules/`, `subscribers/`, and only one example custom route under `api/store/custom`.
- A bespoke design system already exists at `design-system/morphfit/MASTER.md`, defining the brand colors `#F97316 / #FB923C / #22C55E / #1F2937 / #F8FAFC` and the Barlow / Barlow Condensed type pair. Tailwind is already wired to expose these as `primary`, `secondary`, `cta`, `background`, `surface`, `foreground`.
- The home page (`storefront/src/app/[countryCode]/(main)/page.tsx`) is implemented with Hero / CategoryShowcase / FeaturedProducts components.

## 3. Design Audit

The brand palette in the design system uses Energy Orange (`#F97316`) as primary with green accent (`#22C55E`). The manifesto also references "Forest Green #1B4D3E" — this is **not** present in the design system. Decision: stay faithful to the design-system MASTER (it is the documented single source of truth) and use `#F97316` (primary) and `#22C55E` (cta) for the campaign pages, with dark `#111827` surface background, while keeping the Bangladesh-flag *spirit* via accent green/orange contrasts. Typography (Barlow Condensed for headings, Barlow for body) is already imported globally.

## 4. Infrastructure Audit

- Postgres is exposed on host port `5433` via `docker-compose.yml` (mapped to container `5432`); Redis on `6379`.
- Backend env template requires `DATABASE_URL`, CORS values, JWT/COOKIE secrets.
- Storefront env template requires `MEDUSA_BACKEND_URL`, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`, `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_DEFAULT_REGION` (default `us`).
- No live `.env` files are committed (correctly excluded by `.gitignore`).

## 5. Risks Identified

1. **Routing collision:** the manifesto wants `/` as the Coming Soon page and `/scan/:id` as the tracking page, but the storefront middleware redirects every non-asset path to `/<countryCode>/...`. Mitigation: register `scan` and `coming-soon` (and a small set of campaign assets) in the middleware matcher exclusion list so these run as plain top-level routes outside the country segment.
2. **No Drizzle / no MySQL:** rather than introduce a parallel ORM, persist QR scans and email signups via a Medusa **custom data module**. This keeps a single database and is consistent with Medusa best practices.
3. **Build verification requires `MEDUSA_BACKEND_URL` to be reachable** — full `next build` cannot complete in this sandbox without a live Medusa server. We verify storefront types via `tsc --noEmit` and lint instead.

## 6. Phase 1 Deliverable

Codebase has been audited end-to-end. The build plan for Phase 2 is mapped to the existing Medusa-native conventions:

- **Backend:** new `campaign` module with `gym_location`, `qr_scan`, `email_signup` models + workflow + custom store API routes (`/store/campaign/*`) replacing the manifest's `tRPC procedures`.
- **Storefront:** add top-level `/scan/[id]` and `/coming-soon` routes outside the `[countryCode]` segment, register them in `middleware.ts`, and build the components per the design system.
- **Branch strategy:** per `CLAUDE.md`, never push to `master`. Work on `feature/morphfit-launch-sprint` and open a PR.
