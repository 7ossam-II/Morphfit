# MORPHFIT.SHOP — Headless E-Commerce Architecture

A modular, headless e-commerce storefront built to handle real-world operational constraints: supplier-led inventory workflows, performance-focused rendering, and fast shopping UX.

## 🏗️ Architecture Overview

MORPHFIT is built on a decoupled architecture, separating the frontend presentation layer from the backend commerce logic.

- **Frontend (Storefront):** Next.js 14, React, Tailwind CSS
- **Backend (Commerce Engine):** Medusa.js (Node.js)
- **Database:** PostgreSQL
- **Infrastructure:** Docker, AWS

## 🎯 Core Capabilities

1. **Modular Storefront:** Fast, SEO-optimized product pages built with Next.js App Router.
2. **Supplier Workflows:** Custom backend logic to handle international supplier vetting, quality control, and inventory management.
3. **Marketing Integration:** Built to support ad spend tracking, conversion optimization, and customer feedback loops.
4. **Operational Control:** A unified admin dashboard for managing 1:1 customer communication and fulfillment problem-solving.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Docker (optional, for containerized deployment)

### Backend Setup (Medusa)
```bash
cd backend
npm install
npm run build
npm run start
```

### Frontend Setup (Next.js)
```bash
cd storefront
npm install
npm run dev
```

## 📂 Repository Structure

- `/backend` - Medusa.js commerce engine and custom plugins
- `/storefront` - Next.js customer-facing application
- `/design-system` - Shared UI components and Tailwind configuration
- `/docs` - Architecture decisions and operational playbooks

## 👨‍💻 Operator Mindset

This project is not just a technical exercise; it is a live business. Every technical decision was made to solve an operational problem: from how visual assets are served to how customer feedback is integrated into product updates.
