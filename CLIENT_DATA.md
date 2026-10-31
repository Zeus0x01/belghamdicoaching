# CLIENT DATA — REAL EXTRACTED VALUES (direction file)

**Source of truth:** `prompt.md` → live client website **https://belghamdicoaching.com/** (Shopify store),
scraped Nov 2026. Sub-pages scraped: `/`, `/collections/all`, `/collections/belghamdi-splits`,
`/pages/contact`, `/products/anterior-x-posterior`, `/products/muscle-mommies-4-5-days-splits`.

This file documents **what real data was extracted, and exactly where each piece is wired** in the codebase.
When the client updates the live store, update these same locations.

---

## 1. Identity

| Field | Real value | Source |
|---|---|---|
| Brand | Belghamdi Coaching (legal: Belghamdi-Coaching) | Shopify store title |
| Coach | **Bassam El Ghamdi** (بسام الغامدي) | YouTube channel name, Instagram profile |
| Location | Cairo, Egypt | Threads profile location tag |

→ Wired in: `src/lib/catalog.ts` → `BUSINESS` const (single source for brand/contact/social fields).

## 2. Logo

- Real logo: `https://belghamdicoaching.com/cdn/shop/files/logi.png?v=1750603230&width=600`
- Copied into the project as **`public/logo.png`** (also used as app favicon via `src/app/icon.png`,
  which fixes the previous `favicon.ico` 404).

→ Wired in: `src/components/site/Nav.tsx` (navbar), `src/components/site/Footer.tsx` (footer), `src/app/icon.png` (favicon).

## 3. Products — the 6 real store products (all prices in **EGP / LE**)

All products: **LE 380.00** sale price, regular price **LE 699.00** (~46% off), all in stock.
Every program includes the same 7 bundled items (exercise video explanations, curated exercise selection,
weight/rep tracking sheet, full training details, private community & support, guidelines guide,
exclusive partner-discount file) — see `INCLUDED_ITEMS` in `src/lib/catalog.ts`.
Injury disclaimer (verbatim from live pages): *"not suitable for those with current injuries or during rehabilitation"* → `INJURY_NOTE`.

| Real title | Real Shopify slug | Category (this project) | Image (live CDN) |
|---|---|---|---|
| Anterior x Posterior | `anterior-x-posterior` | Training Splits | `/cdn/shop/files/1242352235.png` |
| Arnold x U-L | `arnold-x-u-l` | Specialized Programs | `/cdn/shop/files/arnoold.png` |
| Full Body (3 days) | `muscle-mommies-4-5-days-splits` * | Full Body | `/cdn/shop/files/dcbdd09a8b66d1d9f0dc875ccab63824.png` |
| Muscle Mommies | `full-body-3-days-high-frequency-split` * | Women's Training | `/cdn/shop/files/2.png` |
| Push Pull Leg x Upper Lower — 5 Days | `push-pull-leg-x-upper-lower` | PPL | `/cdn/shop/files/9d2eef58f419a730887c6092b3023294.png` |
| Upper Lower (4 days) | `upper-lower-4-days` | Upper / Lower | `/cdn/shop/files/8b5f9cd07c576a45d0e8b8f7546e310a.png` |

\* Shopify slug↔title mapping is genuinely crossed on the live store; preserved as-is on purpose.

→ Wired in: `src/lib/catalog.ts` → `CATALOG` (6 products, real slugs, real prices, real CDN images,
real descriptions translated from the Arabic copy). Products render with real images in
`ProductCard.tsx` and `[slug]/page.tsx`. Admin demo orders/leads/clients/testimonial references were
updated to the real titles in `src/lib/demo/admin-store.ts`. Currency is constant **LE/EGP** site-wide
(`formatMoney` default in `src/lib/utils.ts`; checkout writes `currency: "EGP"`; admin settings default EGP).

## 4. Official program-selection guide (verbatim logic from live store)

> How many days can I commit 100% for the next 6 months?
> **3 days → Full Body · 4 days → Upper Lower · 5 days → PPL x Upper Lower**

→ Wired in: `/faq` answer ("How do I pick the right split for me") and the anatomy-explorer muscle map
program links (`src/lib/anatomy-programs.ts` → `PROGRAM_FOCUS`, now mapping real titles only).

## 5. Contact & socials (real)

| Channel | Real value |
|---|---|
| WhatsApp | **+201028796338** (`https://wa.me/201028796338`) |
| Instagram | https://www.instagram.com/belghamdi.coaching/ (65.5K followers) |
| TikTok | https://www.tiktok.com/@belghamdi.coaching (232K followers, 8.3M likes) |
| YouTube | https://www.youtube.com/@Belghamdi.Coaching (16.4K subs) |
| Threads | https://www.threads.com/@belghamdi.coaching |

→ Wired in: `src/lib/catalog.ts` → `BUSINESS.socials` / `BUSINESS.whatsapp`;
`/contact` page (WhatsApp-first layout, real social links, phone field like the live form);
`Footer.tsx` (real social URLs replacing placeholders).

## 6. Payments & purchase flow (real)

- Accepted methods: **Vodafone Cash — Instapay — Visa/credit**.
- Real journey (from live homepage "خطوات الاشتراك"):
  1. Choose the program by available training days.
  2. Subscribe on the website paying with Vodafone Cash / Instapay / Visa.
  3. **Send the payment screenshot + chosen program via WhatsApp** to activate.

→ Wired in: `/faq` (payment & activation answer). Demo checkout intentionally still simulates
(no real gateway — per prompt.md demo-mode spec) and displays LE prices.

## 7. Business stats (real claims from live store)

- 20,000+ clients across programs & online coaching
- 16,000+ clients on Belghamdi Splits specifically

→ Wired in: `BUSINESS.stats` (`src/lib/catalog.ts`) — ready to surface on About/home copy.

## 8. Real FAQ content (extracted verbatim, translated)

All 7 questions on `/faq` are sourced from the live store's homepage Q&A + splits page guide
(program vs. coaching, beginners, tight schedule, cheap gym, split selection, payment/activation,
why this works). Policies section kept from the prior build (not on the live site — demo-labeled).

## 9. Coaching packages — Silver / Gold (NOT published on live store)

The live site advertises online coaching but **does not publish Silver/Gold prices**. The prices in
`COACHING_PACKAGES` (`src/lib/catalog.ts`: 89/149 → now shown as LE on `/coaching`) remain
**demo values** and must be replaced with the coach's real pricing when provided.
All other Silver/Gold feature rows (follow-up cadence, reporting, response windows, nutrition plans)
mirror prompt.md's business description and stay unchanged.

## 10. Transformations / before-after

Real transformation photos exist on the live store (splits page "تحولات حقيقية" carousel + home
 banners), but they are customer images — **not** extracted/copied. Gallery stays demo-labeled per
 prompt.md ("never claim placeholder transformations belong to actual customers").

---

### Where to update when the client provides new data

1. Live price/title changes → `src/lib/catalog.ts` (and `formatMoney` stays LE/EGP).
2. New WhatsApp number / socials → `BUSINESS` in `catalog.ts` (auto-propagates to contact + footer).
3. Real Silver/Gold pricing → `COACHING_PACKAGES` in `catalog.ts`.
4. Real testimonials/transformations (with client consent) → `src/lib/demo/admin-store.ts`
   (replace `demo: true` entries) + `/transformations` content source.
5. Logo refresh → re-download CDN `logi.png` → `public/logo.png` + `src/app/icon.png`.
