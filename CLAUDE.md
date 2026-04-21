# MorphFit - Claude Code Ground Instructions

Welcome to the MorphFit project! This is a modern e-commerce platform designed as a clone of Bodybuilding.com's shop, built with a headless architecture using Medusa.js (backend) and Next.js (storefront).

## Project Goal
Build a high-converting, professional e-commerce store for supplements, vitamins, and workout accessories, mirroring the structure and features of Bodybuilding.com, but with a clean, modern UI/UX powered by the `ui-ux-pro-max-skill`.

## Architecture
This is a monorepo containing two main parts:
1.  **`backend/`**: Medusa.js v2 application (Core API & Admin Dashboard).
2.  **`storefront/`**: Next.js 15 App Router storefront (using the `medusajs/nextjs-starter-medusa` template).

## UI/UX Guidelines (ui-ux-pro-max-skill)
We are using the `ui-ux-pro-max-skill` to ensure a professional design.
1.  **Skill Activation**: The skill is installed in this repository. When working on UI/UX tasks, the skill will automatically provide design intelligence.
2.  **Design System**: A design system tailored for a fitness/supplement e-commerce store should be generated and persisted in the `design-system/` directory.
3.  **Stack**: We are using `html-tailwind` (Next.js + Tailwind CSS). Ensure all styling adheres to the generated design system and Tailwind best practices.

## Workflow Steps for Claude Code

Please follow these steps sequentially to build the project:

### Step 1: Project Initialization
1.  Initialize the Medusa backend in the `backend/` directory using `npx create-medusa-app@latest --with-nextjs-starter`. (Note: You may need to move the generated storefront to the `storefront/` directory if it creates it alongside). Alternatively, install them separately as per Medusa docs.
2.  Set up the necessary environment variables (`.env`) for both the backend (PostgreSQL) and storefront (Medusa API URL, Stripe keys).
3.  Ensure both the backend (`localhost:9000`) and storefront (`localhost:8000`) can run successfully.

### Step 2: UI/UX Setup
1.  If not already done, install the `uipro-cli` globally: `npm install -g uipro-cli`.
2.  Initialize the skill for Claude Code in the project root: `uipro init --ai claude`.
3.  Generate the design system: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "fitness supplements ecommerce" --design-system --persist -p "MorphFit"`.
4.  Review the generated `design-system/MASTER.md` and apply the color palette, typography, and styling rules to the `storefront/tailwind.config.js` and global CSS.

### Step 3: Frontend Development (Bodybuilding.com Clone)
Focus on the `storefront/` directory.
1.  **Global Layout**: Implement the header (mega-menu, search, cart, account) and footer, matching the structure of Bodybuilding.com.
2.  **Homepage**: Build the hero section, promotional banners, "Shop by Category", and "Best Sellers" sections.
3.  **Product Listing Page (PLP)**: Implement the category pages with filtering (by goal, category, brand) and sorting options.
4.  **Product Detail Page (PDP)**: Enhance the default PDP to include detailed product descriptions, reviews, and variations (flavor, size).
5.  **Cart & Checkout**: Ensure the cart and checkout flows are styled according to the design system and function correctly with the Medusa backend.

### Step 4: Backend Customization (If needed)
Focus on the `backend/` directory.
1.  Add any custom data models or API routes required for specific features (e.g., custom product attributes).
2.  Create a seed script to populate the database with sample supplement products, categories, and brands to facilitate frontend development.

## General Rules
*   **Always check the design system** (`design-system/MASTER.md` and `design-system/pages/*.md`) before writing UI code.
*   **Use Tailwind CSS** for all styling. Avoid custom CSS unless absolutely necessary.
*   **Commit frequently** with descriptive messages.
*   If you encounter issues with Medusa or Next.js, consult their respective official documentation.
