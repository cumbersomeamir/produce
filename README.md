# OddFinds

Production-grade foundation for **OddFinds**, a curated e-commerce platform for quirky products.

## Stack
- Next.js 15.5.9 (App Router, JS)
- Tailwind CSS v4 + CSS variables
- Framer Motion
- MongoDB Atlas (native Mongo driver)
- NextAuth v5 (credentials + Google)
- Razorpay + Stripe
- Nodemailer
- OpenAI integration scaffold
- Redis + Meilisearch + BullMQ ready

## Project Layout
- `frontend/` -> Next.js app, routes, API handlers, UI system
- `backend/` -> Mongo-backed controllers/models/services/jobs

## Quick Start
1. Copy env vars:
   - `cp .env.example .env`
2. Install dependencies:
   - `npm install`
3. Seed sample data:
   - `npm run db:seed`
4. Start app:
   - `npm run dev`

## Seeded Data
- 6 categories
- 24 products
- 100+ reviews
- Discount codes: `ODDWEEK`, `FIRSTBUY`, `FREESHIP`
- Admin user: `admin@oddfinds.com` / `admin123`
- 2 test customers
- Supplier + shipping sample data

## Notes
- AI future agents are scaffolded with TODO-mode endpoints and registry entries.
- Admin and user routes are middleware-protected.
- API handlers include basic in-memory rate limiting.
# produce
