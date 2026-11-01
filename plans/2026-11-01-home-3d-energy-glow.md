# Home-Only 3D + Hard Muscle Glow + Energetic Palette — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The 3D figure renders on the home page only (hero + muscle explorer, never over static content); muscle glow becomes intense and cleanly bounded; the site palette shifts from flat graphite-copper to a warm dark base with energetic ember/amber accents.

**Architecture:** Move the persistent-canvas mount from the shared `(site)/layout.tsx` into the home page component. Tune `driveMuscleGlow` intensity targets and `BODY_BANDS` inequalities in `MusclesFigure.tsx`. Re-skin via Tailwind semantic tokens (`copper` value → ember `#E8793F`, plus amber token and warm surface tints) so ~100 existing `copper` usages re-skins atomically, then update the handful of hardcoded brand hexes.

**Tech Stack:** Next.js 14 App Router, React Three Fiber 8, three 0.169, Tailwind CSS, TypeScript strict.

**Spec:** `docs/superpowers/specs/2026-11-01-home-3d-energy-glow-design.md` (approved in-conversation: option 1 "3D fixed on hero and exploring section only"; glow zones accurate + hard; dark + energetic accents).

## Global Constraints

- No new npm dependencies.
- Language-neutral changes only: do not touch `src/lib/i18n.tsx` keys or localize anything new (all palette/rig edits are visual).
- Verify with `npx tsc --noEmit` + `npm run build` (32/32 routes) — there are no tests.
- Do not edit `models-src/` or regenerate the GLB; all tag/band edits are runtime code in `src/components/three/MusclesFigure.tsx`.
- Keep the `glowFade` singleton contract (`Rig` writes, `driveMuscleGlow` reads) — fading orchestration stays in `SiteScrollCanvas.tsx`.

## Review Focus

1. **Non-home routes:** `/programs`, `/coaching`, `/admin` must render with zero muscular figure and zero leftover fixed canvas — verify via screenshot after Task 1 (and again at end).
2. **Home hero mouse parallax:** figure must still drift with the mouse and turn per selected group — screenshot home hero + explorer after Task 2.
3. **Glow hardness:** with a group selected, other groups go fully dark (target 0, not 0.02); active glow visibly saturated, not pastel — screenshot after Task 2.
4. **Accent contrast:** `text-copper`/`bg-copper` (now `#E8793F`) must stay readable on `graphite`/`obsidian` — screenshot light-on-dark text spots and a `.btn-primary` CTA after Task 3.
5. **Demo data integrity:** admin pages keep demo styling coherence — screenshot `/admin` after Task 3.

**Verification harness (Windows, no test suite):** puppeteer scripts live in `C:\Users\user\AppData\Local\Temp\opencode\bcpuppet\` (shot7.js clicks each group + screenshots). Edge binary: `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`, args `--use-angle=swiftshader`. Start the prod server with `npx next start -p 3109` from the project root in the SAME bash call as the screenshot script; kill stale `node` processes first (`Get-Process node | Stop-Process -Force`). `npm run lint` prompts interactively — never use it.

---

### Task 1: Scope the 3D canvas to the home page

**Files:**
- Modify: `src/app/(site)/layout.tsx` (remove import + `<ScrollCanvasMount />`)
- Modify: `src/app/(site)/page.tsx` (add import + `<ScrollCanvasMount />`)

**Interfaces:**
- Consumes: `ScrollCanvasMount` from `src/components/three/ScrollCanvasMount.tsx` (existing client component; unchanged).
- Produces: the mount lives inside `HomePage` only; `#muscle-explorer` (rendered by `AnatomyExplorer` in the same file) remains the rig's dock target.

- [ ] **Step 1: Edit layout** — delete the `ScrollCanvasMount` import (line 4) and the `<ScrollCanvasMount />` element (line 10) from `src/app/(site)/layout.tsx`. No other JSX changes.
- [ ] **Step 2: Edit home page** — in `src/app/(site)/page.tsx`, import `ScrollCanvasMount` from `@/components/three/ScrollCanvasMount` and render `<ScrollCanvasMount />` immediately before `<Hero />` inside the returned fragment (it's a zero-height fixed-position client component; placement is structural only).
- [ ] **Step 3: typecheck + build**

Run: `npx tsc --noEmit` then `npm run build`
Expected: 0 errors; 32/32 routes prerender, home still includes `#muscle-explorer`.

- [ ] **Step 4: Visual verify** — run the production server, screenshot: home top (figure visible beside hero), `/programs` top (NO figure, no fixed overlay), `/coaching` top (NO figure). Save pngs, report results to the planner.
- [ ] **Step 5: Commit** — `git add -A src/app/(site)` and `git commit -m "fix: render 3d muscle figure on home page only"`. Only `src/app/(site)/layout.tsx` and `src/app/(site)/page.tsx` may contain changes.

### Task 2: Hard muscle glow + tighter band boundaries

**Files:**
- Modify: `src/components/three/MusclesFigure.tsx`

**Interfaces:**
- Consumes: `MUSCLE_PALETTE` (unchanged), `useMuscleExplorer` store (unchanged).
- Produces: new glow targets inside `driveMuscleGlow` (active ≈1.5, non-focused 0, idle 0.2); updated `BODY_BANDS`; material tuning in `createMuscleMaterial`. `MusclesFigure`/`prepareMusclesModel`/`driveMuscleGlow` signatures unchanged.

- [ ] **Step 1: Glow targets** — in `driveMuscleGlow` replace the line

```ts
const target = (focus ? (on ? 0.8 : 0.02) : 0.16) * fade;
```

with

```ts
const target = (focus ? (on ? 1.5 : 0) : 0.2) * fade;
```

- [ ] **Step 2: Material harshness** — in `createMuscleMaterial` change `roughness: 0.5` → `roughness: 0.62` and `clearcoat: 0.25` → `clearcoat: 0.08` (kills the specular sheen that read as dim soft glow; keep `clearcoatRoughness: 0.55`, `metalness: 0.03`).
- [ ] **Step 3: Band retunes** — in `BODY_BANDS` replace exactly these three entries (others untouched):

| band | old test | new test |
|------|----------|----------|
| back (id 3) | `(_x, y, z) => z < -0.045 && y >= 1.02 && y <= 1.52` | `(_x, y, z, ax) => z < -0.045 && y >= 1.02 && y <= 1.48 && ax < 0.19` |
| forearms (id 5) | `(x, y, _z, ax) => ax > 0.24 && y >= 0.8 && y < 1.06 && Math.abs(x) < 0.4` | `(x, y, _z, ax) => ax > 0.22 && y >= 0.78 && y < 1.06 && Math.abs(x) < 0.42` |
| calves (id 7) | `(x, y, z, ax) => y >= 0.12 && y < 0.42 && ax < 0.17` | `(x, y, z, ax) => y >= 0.14 && y < 0.4 && ax < 0.17` |

- [ ] **Step 3b:** update the `BODY_BANDS` doc comment above the array (lines 16–19: "shoulder caps y≈1.30–1.50, pecs y≈…" measured values only) so it cites: chest 1.24–1.38, abs 0.98–1.24, back stops 1.48 with `ax<0.19`, forearms 0.78–1.06, quads 0.42–0.90, calves 0.14–0.40.

- [ ] **Step 4: typecheck + build**

Run: `npx tsc --noEmit` then `npm run build`
Expected: 0 errors.

- [ ] **Step 5: Visual verify** — screenshot the explorer with Back, Forearms, Calves, Quads selected; confirm: back glow stops before rear deltoids/arms, forearm glow covers the elbow→wrist strip, calves stop below knee and above ankle, quads unchanged hips→knee, glow reads saturated (not pale). Report findings.
- [ ] **Step 6: Commit** — `git commit -m "feat: hard muscle glow and tighter group boundaries"`; only `src/components/three/MusclesFigure.tsx` changed.

### Task 3: Energetic accent palette

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`
- Modify: `src/components/three/SiteScrollCanvas.tsx:140` (light color only)
- Modify: `src/components/three/AnatomyFigure.tsx:152` (`COPPER` const only)
- Modify: `src/components/admin/Charts.tsx` (4 hardcoded `#B97851`, 1 `#8A5A3D` in the palette array)

**Interfaces:**
- Consumes: existing `copper`/`copper-dim` token names (all ~100 class usages re-skin unchanged).
- Produces: `copper` renders `#E8793F` (ember), `copper-dim` renders `#B45A26`, NEW `amber: "#D8A84E"` token, warm-tinted dark surfaces (graphite `#131110`, obsidian `#1C1916`, surface `#26211C`). **Do not rename tokens; do not touch `src/lib/muscle-palette.ts` or `src/lib/i18n.tsx`.**

- [ ] **Step 1: tokens** — in `tailwind.config.ts`: set `graphite: "#131110"`, `obsidian: "#1C1916"`, `surface: "#26211C"`, `copper: "#E8793F"`, `"copper-dim": "#B45A26"`, add `"amber": "#D8A84E"`.
- [ ] **Step 2: css** — in `globals.css`: scrollbar-track `#10100f` → `#131110`; scrollbar-thumb hover `#b97851` → `#e8793f`; `.btn-primary` gets the gradient `bg-gradient-to-r from-copper to-amber bg-[length:200%_100%]` with `hover:bg-right` added before its existing hover utilities (keeps `text-graphite`).
- [ ] **Step 3: 3D light + admin chart hexes** — `SiteScrollCanvas.tsx:140` light `#B97851` → `#E8793F`; `AnatomyFigure.tsx` `COPPER = "#B97851"` → `"#E8793F"`; in `Charts.tsx` replace the two `<stop ... stopColor="#B97851">` and the `stroke="#B97851"` with `#E8793F`, and in the `colors` array replace `"#B97851"` → `"#E8793F"` and `"#8A5A3D"` → `"#B45A26"`.
- [ ] **Step 4: typecheck + build + screenshots** — `npx tsc --noEmit`, `npm run build` (0 errors), then screenshot: home hero (CTA gradient + ember accents), `/admin` overview, one programs card row. Confirm ember text passes contrast eyeball on dark surfaces. Report.
- [ ] **Step 5: Commit** — `git add tailwind.config.ts src/app/globals.css src/components/three/SiteScrollCanvas.tsx src/components/three/AnatomyFigure.tsx src/components/admin/Charts.tsx` and `git commit -m "feat: energetic ember/amber accent palette on dark base"`.

### Task 4: Whole-branch review + final verification

- [ ] **Step 1:** `git diff 8505a7f..HEAD --stat` — only the files named in Tasks 1–3 present.
- [ ] **Step 2:** fresh reviewer on the whole branch (Review Focus 1–5 above as the checklist).
- [ ] **Step 3:** full `npm run build` + final screenshots (home hero, home explorer, `/programs`, `/coaching`, `/admin`) — all pass, then report to the user with the visual evidence.
