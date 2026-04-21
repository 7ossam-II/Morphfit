# MorphFit - Claude Code Operational Contract

Welcome to the MorphFit project. You are an autonomous AI agent (Claude Code) tasked with building a high-converting e-commerce store for supplements, vitamins, and workout accessories. This project is a clone of Bodybuilding.com's shop, built with a headless architecture.

## 1. Project Architecture
This is a monorepo containing two main parts:
- **`backend/`**: Medusa.js v2 application (Core API & Admin Dashboard). Runs on `localhost:9000`.
- **`storefront/`**: Next.js 15 App Router storefront (using the `medusajs/nextjs-starter-medusa` template). Runs on `localhost:8000`.
- **Database**: PostgreSQL running via Docker Compose (`localhost:5432`).

## 2. Your Superpowers (Plugins)
The user has installed several Superpowers plugins that dictate your workflow. You MUST use them:
- **`writing-plans` & `executing-plans`**: Before writing code, you must write a plan. Execute it step-by-step.
- **`dispatching-parallel-agents` & `subagent-driven-development`**: Use subagents for isolated tasks (e.g., "Subagent A: build the Hero component", "Subagent B: build the Footer").
- **`test-driven-development` & `systematic-debugging`**: Write tests where applicable and debug systematically.
- **`requesting-code-review` & `verification-before-completion`**: Verify your work and request review before marking a task complete.

## 3. Medusa Agent Skills & MCP
The user has installed the official Medusa Claude Code plugins.
- You have access to `medusa-dev` and `ecommerce-storefront` skills. Use them to ensure you follow Medusa best practices.
- You have access to the Medusa MCP server (`https://docs.medusajs.com/mcp`). **Always query the MCP server** if you are unsure about Medusa v2 APIs, Next.js storefront data fetching, or backend module creation.

## 4. UI/UX Intelligence (ui-ux-pro-max-skill)
The `ui-ux-pro-max-skill` is installed in `.claude/skills/ui-ux-pro-max/`.
- **Single Source of Truth**: The design system has already been generated and persisted at `design-system/morphfit/MASTER.md`.
- **Rule**: Before building ANY UI component in the `storefront/`, you MUST read `design-system/morphfit/MASTER.md`.
- **Rule**: If building a specific page (e.g., `checkout`), check if `design-system/morphfit/pages/checkout.md` exists. If it does, its rules override the MASTER file.
- **Stack**: We are using `html-tailwind` (Next.js + Tailwind CSS). Strictly follow the colors, typography, and spacing defined in the design system. Do not invent new colors.

## 5. Execution Workflow

When the user prompts you to begin, follow this exact sequence:

### Phase 1: Environment Verification
1. Verify Docker containers are running (`docker ps`). If not, run `docker compose up -d`.
2. Verify the backend can start: `cd backend && npm run dev`.
3. Verify the storefront can start: `cd storefront && npm run dev`.
4. If any environment variables are missing, check `.env` in backend and `.env.local` in storefront.

### Phase 2: Tailwind & Design System Integration
1. Read `design-system/morphfit/MASTER.md`.
2. Update `storefront/tailwind.config.js` to include the exact color hex codes, fonts, and spacing variables defined in the MASTER file.
3. Update `storefront/src/styles/globals.css` to import the required Google Fonts (Barlow Condensed & Barlow) and set up CSS variables if needed.

### Phase 3: Frontend Development (The Clone)
Use your subagents to build the following, mirroring Bodybuilding.com's structure but using our design system:
1. **Global Layout**: Mega-menu header (Shop by Category, Shop by Goal, Brands), search bar, cart icon, and footer.
2. **Homepage**: Hero banner, promotional sections, and "Best Sellers" product grid.
3. **Product Listing Page (PLP)**: Category pages with filtering (goal, brand, type) and sorting.
4. **Product Detail Page (PDP)**: Enhance the default PDP with detailed descriptions, reviews, and variations (flavor, size).
5. **Cart & Checkout**: Style the existing Next.js starter checkout flow to match the MorphFit brand.

### Phase 4: Backend Customization
1. Create a seed script in `backend/src/scripts/seed.ts` to populate the database with sample supplement products, categories (Protein, Pre-Workout, Vitamins), and brands.
2. Run the seed script so the storefront has data to display.

## 6. Strict Constraints
- **Never push directly to `main` or `master`**. Use `using-git-worktrees` and `finishing-a-development-branch` superpowers.
- **No Emojis in UI**: Use SVG icons (Heroicons/Lucide) as dictated by the design system anti-patterns.
- **Accessibility**: Ensure 4.5:1 text contrast and visible focus states.
