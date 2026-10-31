# Belghamdi Coaching — Premium 3D Fitness Commerce & Coaching Platform

A premium digital platform for **Belghamdi Coaching** built around the
**"Anatomy of Performance"** design concept: warm graphite surfaces, bone-white
editorial typography, muted copper accents, and a procedural 3D anatomical
figure as the core visual identity.

Two interconnected applications in one Next.js codebase:

1. **Public website** — cinematic, 3D-first fitness commerce experience.
2. **Admin dashboard** (`/admin`) — functional CRM: leads, clients, orders,
   subscriptions, progress tracking, content, settings.

## Tech Stack

- **Next.js 14 (App Router) + TypeScript + Tailwind CSS**
- **Three.js / React Three Fiber / Drei** — 3D anatomical hero + interactive muscle explorer, with graceful WebGL/reduced-motion fallbacks
- **Zustand** — cart + demo CRM state (persisted)
- **Framer Motion / GSAP** — motion design
- **Supabase** — database schema, auth, storage, RLS (migrations in `supabase/migrations`)
- **Shopify** — commerce source of truth (products, orders, checkout)
- **n8n-ready** — integration event architecture prepared, no automation deployed yet

## Quick Start

```bash
npm install
npm run dev
```

Visit **http://localhost:3000**.

### Admin Access

- URL: `/admin` (redirects to `/admin/login` when unauthenticated)
- Default demo password: `belghamdi-demo` (override with `ADMIN_PASSWORD` in `.env`)

## Demo Mode vs Live Mode

Demo mode is active automatically when Supabase/Shopify environment variables
are empty. Demo data is labeled and separated; dashboard values show real
numbers from the demo dataset, never fabricated live statistics.

Copy `.env.example` to `.env`, fill credentials, restart, and the platform
switches to live-integration behavior (Shopify products/checkout, Supabase
auth + persistence).

```
NEXT_PUBLIC_SUPABASE_URL= ...
NEXT_PUBLIC_SUPABASE_ANON_KEY= ...
SUPABASE_SERVICE_ROLE_KEY= ...
SHOPIFY_STORE_DOMAIN= ...
SHOPIFY_STOREFRONT_ACCESS_TOKEN= ...
SHOPIFY_ADMIN_ACCESS_TOKEN= ...
SHOPIFY_WEBHOOK_SECRET= ...
```

## Project Structure

```
src/
  app/
    (site)/            # Public website: home, programs, coaching, selector,
                       # transformations, contact, login, cart, checkout, about, faq
    admin/             # Dashboard: overview, leads, clients, products, orders,
                       # subscriptions, progress, content, settings
    api/admin/auth/    # Admin session login/logout (httpOnly cookie)
  components/
    site/              # Nav, Footer, Hero, product cards, sections
    three/             # AnatomyFigure (procedural 3D anatomy), Hero3D, Scene, AnatomyExplorer
    admin/             # Charts (custom SVG), Drawer, badges, dialogs
  lib/
    catalog.ts         # Products + Silver/Gold coaching packages
    selector-rules.ts  # Configurable program recommendation rules
    cart.ts            # Zustand cart store
    demo/admin-store.ts# Demo CRM dataset (leads/clients/orders/subs/progress)
    integrations/      # Event dispatcher, events, webhooks, shopify, email
    i18n.tsx           # EN/AR language context
  middleware.ts        # Protects /admin routes
supabase/migrations/   # PostgreSQL schema, RLS, triggers
```

## 3D Experience Notes

No third-party GLB was bundled. The anatomical figure is built procedurally
(capsule/box/sphere muscle groups over a clay body structure) so it runs
instantly with zero asset dependencies. The hero rotates with the mouse and
supports hover-highlighted muscle-group exploration with program mapping.
Devices without WebGL, or users who prefer reduced motion, get a static SVG
fallback composition.

## Security

- Admin routes protected by middleware with an httpOnly, SHA-256-derived token
  cookie
- Server-side credential check at `/api/admin/auth`
- SQL schema ships with Row Level Security for every table
- Secrets stay server-side; demo/demo checkout never touches real payments
- Sensitive client progress data is never exposed publicly

## What Is Intentionally Out of Scope (But Prepared)

- **n8n automation** — webhook/event architecture and `integration_events`
  logging are in place; no workflows fire externally yet
- **Recurring billing** — subscription statuses and revoked/overdue logic
  exist; provider hooks (`external_billing_ref`) ready
- **Real payments** — delegated to Shopify checkout when configured
