# Design: Home-Only 3D Figure, Hard Muscle Glow, Energetic Palette

**Date:** 2026-11-01
**Status:** approved (user: "yea, go")

## Intent

The user's feedback (2026-11-01):

1. The scroll-following muscle figure appears on plain static content pages, which the user finds off-putting — the 3D behavior must belong to the home page only.
2. The muscle selection still reads inaccurate and the glow is "light, not hard".
3. The palette is too dark/flat — they want a dark base that feels motivational, with well-aligned energetic color.

## Decisions

| # | Decision | Choice |
|---|----------|--------|
| 1 | 3D scope | Home page only; figure visible only at the hero and docked inside the muscle explorer; no overlay drift across static sections. (User's option 1; option 2 — making static content interactive — rejected as scope creep.) |
| 2 | Glow | Active group at high emissive (≈1.5), other groups fully dark (0) while a selection exists, idle 0.2; reduce clearcoat/roughness so specular sheen no longer fakes soft glow. |
| 2b | Band accuracy | Back drops rear-arm bleed (`ax<0.19`, y≤1.48); forearms cover elbow→wrist (0.78–1.06, ax 0.22–0.42); calves tightened (0.14–0.40). |
| 3 | Palette | Dark + energetic accents: `copper` token re-valued to ember `#E8793F`, amber `#D8A84E` added as highlight, warm-tinted surfaces (`graphite #131110`, `obsidian #1C1916`, `surface #26211C`), gradient CTAs. ~100 existing `copper` utilities re-skin atomically. |

## Non-goals

- No light mode, no theme toggle.
- No direct clicking-on-the-model picking (possible follow-up).
- No admin-page structural restyle (token shift covers it).
- No GLB regeneration or new dependencies.

## Verification

`npx tsc --noEmit` + `npm run build` per task; puppeteer screenshots (hero, explorer with Back/Forearms/Calves/Quads selected, `/programs`, `/coaching`, `/admin`) with the existing SW-render Edge harness.

Plan: `plans/2026-11-01-home-3d-energy-glow.md`
