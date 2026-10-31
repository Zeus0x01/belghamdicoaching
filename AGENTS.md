# AGENTS.md — Belghamdi Coaching

Premium 3D fitness commerce + coaching platform for a real client (belghamdicoaching.com). Next.js 14 App Router, TypeScript, Tailwind, Zustand, React Three Fiber, Supabase, Shopify.

## Commands

```bash
npm run dev              # http://localhost:3000
npm run build            # full typecheck + build — the real gate
npx tsc --noEmit         # typecheck only (faster, no script for it)
```

- There are **no tests**. Verify changes with `npm run build` (or `npx tsc --noEmit` for type-only checks).
- `npm run lint` prompts interactively to install ESLint (not in devDependencies) — avoid relying on it.
- Path alias: `@/*` → `src/*`.

## Architecture

Two apps in one Next codebase:

- `src/app/(site)/` — public site (programs, selector, cart, checkout, faq, contact…)
- `src/app/admin/` — CRM dashboard (leads, clients, orders, subscriptions, settings)
- `src/middleware.ts` protects `/admin/*` via `bc_admin` httpOnly cookie (SHA-256 of `ADMIN_PASSWORD`, fallback `belghamdi-demo`) — changes to auth must be mirrored in `src/app/api/admin/auth/route.ts`.

**Demo vs live mode** (`src/lib/mode.ts`): `isDemoMode()` is true whenever Supabase/Shopify env vars are empty. Demo CRM data lives in `src/lib/demo/admin-store.ts` and every demo row is flagged `demo: true` — keep that flag so demo data stays distinguishable from real client data.

## Client data — critical

`CLIENT_DATA.md` is the operational guide: all real business/product data extracted from the live Shopify store is centralized in **`src/lib/catalog.ts`**:

- `BUSINESS` (brand, socials, WhatsApp) — updates auto-propagate to Nav/Footer/contact
- `CATALOG` (6 real products, real Shopify slugs, prices in **EGP/LE**)
- `COACHING_PACKAGES` (Silver/Gold prices are **demo placeholders** — never treat as real)
- `INJURY_NOTE`, `INCLUDED_ITEMS`

When touching products, prices, contact info, or copy: edit `catalog.ts` (per `CLIENT_DATA.md`), never hardcode values in components. Currency is fixed EGP via `formatMoney()` default in `src/lib/utils.ts`. Demo checkout intentionally does NOT process real payments.

## 3D models

- README's "procedural figure, no GLB" is **stale** — the anatomy figure now loads a GLB.
- Source model: `models-src/human-muscles-original.glb` → optimized (meshopt) output at `public/models/human-muscles.glb`, loaded via `useOptimizedGLB()` in `src/components/three/MusclesFigure.tsx`. `@gltf-transform/cli` is the optimizer (devDep, no npm script — run via `npx gltf-transform`).
- Keep/regenerate the optimized GLB in `public/models/`; never edit the original in `models-src/`.

## Misc conventions

- EN/AR i18n: all user-facing strings go through the language context in `src/lib/i18n.tsx` — don't hardcode one locale.
- `prompt.md` is the Arabic design brief (source of truth for design direction/client requirements); `CLIENT_DATA.md` is the scraped-data map.
- Not on the live site / intentionally out of scope: n8n automation, recurring billing, real payments — webhook/event hooks exist in `src/lib/integrations/` but delegate to Shopify when live.


