# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Node `^20.19.0 || >=22.12.0` (required by Vite 8).

```bash
npm ci            # install from lockfile
npm run dev       # Vite dev server
npm run build     # production build to dist/ — the only automated check
npm run preview   # serve dist/ locally
```

There is no lint, typecheck, or test tooling. Verify changes with `npm run build` and by checking the page in a browser at desktop (~1440×900) and mobile (~390×844) widths. Don't claim other checks passed.

## Architecture

A single-page, client-only React 19 portfolio (Vite, Tailwind CSS 4, Framer Motion, react-icons). It has no router, backend, or env config.

- **Layout:** `src/components/` has `layout/` (Navbar, Footer), `stage/` (ScrollStage), `sections/` (one file per page section, plus `ProjectCard`) and `backgrounds/` (decorative section backgrounds and their shared helpers). `docs/CODEBASE.md` is the human-facing map of the codebase; keep it in sync when you move, add, or remove files.
- **Content** lives in `src/data/portfolio.js`. Section components receive slices of it as props from `src/App.jsx`. Some copy is hard-coded in components: nav labels, section headings and labels, About quotes, Contact text, and footer.
- **Page order:** a pinned `ScrollStage` (Hero → Projects → About → Skills → Experience & Education), then a normal `Contact` section, plus a fixed `Navbar` and `Footer`. On viewports below `FULL_STAGE_QUERY` in `App.jsx` (`min-width: 1024px` and `min-height: 700px`), the stage holds only Hero → Projects, and About, Skills and Experience & Education render as normal sections.
- **Skills** are looked up by exact skill string in `SKILL_INFO` in `src/components/sections/Skills.jsx`, which gives the icon, its brand color and the short role shown after the dotted leader. A skill with no entry gets a generic icon and `—`. Add an entry when you add a skill.
- **Framer Motion:** use `m.*`, never `motion.*`. `src/main.jsx` wraps the app in `<LazyMotion features={domAnimation} strict>`, which keeps the bundle small; `strict` makes a `motion.*` component throw in development. `m` components only follow MotionValue updates inside that `LazyMotion`.

### Scroll choreography (the non-obvious part)

`src/components/stage/ScrollStage.jsx` drives the desktop experience:

- `ScrollStage` is a section `panelIds.length × 100vh` tall with a sticky `h-screen` viewport. Panel k is fully in place at page `scrollY = k × innerHeight`, and each screen of scroll between panels is one transition. It reads page-level `scrollY`, so it must stay at the top of the page. It renders an empty anchor div for each panel id at `top: k × 100vh`, which is what `#projects`, `#about` and the other nav links target.
- `TRANSITIONS` lists the edge each panel enters through: right, bottom, left, bottom (the page reads → ↓ ← ↓). Every transition uses the same choreography. The outgoing panel's content slides out as one block (linear), backgrounds crossfade over the first 70%, and each incoming element flies in on its own easing curve.
- A panel component calls `useStagePanel(index)`, renders `<StagePanel panel background>`, and gives each moving element `style={useStageEnter(panel, lead, i)}`. `lead` runs 0 → 1, where 0 means the element is farthest from the entry edge and arrives first: its x when entering from the right, its y from the bottom, `1 - x` from the left. `i` is a unique, stable index that adds deterministic timing noise. Hooks must be called in the panel component itself, not inside `StagePanel`'s children, so pass `panel` down as a prop (see `ProjectCard` and `InteractiveScanningHUD`).
- The easing comes from `usePositionAwareTransform` (`src/hooks/usePositionAwareTransform.js`), a cubic Bézier interpolated by `lead`. Reuse it, or its exported `createBezierEasing`, rather than writing new easing code.
- `About`, `Skills` and `ExperienceEducation` each export a default flow section (small screens) and a `*Panel` (stage), both rendering a shared `*Content` component. That component takes per-element styles, or, for `ExperienceEducation`, the `panel` itself, so list items can use `<StageEnter panel lead index>`. The flow `About` keeps its own section-relative `useScroll` choreography. Flow `Skills`, `ExperienceEducation` and `Contact` use `useScrollReveal()` plus the `.animate-on-scroll` class (styles and reduced-motion override in `src/index.css`). Don't add Tailwind `opacity-*`/`translate-*` or `transition-all` to elements whose transform Framer Motion drives: a CSS transition would lag the scroll scrub.
- Panels must fit on one screen at 1024×700. The `short:` custom variant (`max-height: 820px`, defined in `index.css`) tightens About's spacing. Re-measure if you add content to a panel.
- `Navbar` hides over the first 0.5 × innerHeight of scroll (half the Hero → Projects transition). Revisit that if the stage geometry changes.
- `src/hooks/useSectionKeyboardNav.js` makes PageUp, PageDown and Space jump between the section-id stops. Keep its `SECTION_IDS` list in sync when you add, remove, or rename section or panel ids.

### Project cards

`src/components/sections/ProjectCard.jsx` owns the bento layout (`BENTO_CLASSES`) and per-slot `lead` values (`SLOT_CENTERS`). Both are designed for exactly six projects on a 4×3 desktop grid; a seventh project needs a grid redesign. Mobile uses a 2-column grid with fixed `h-36` cards, because both card faces are absolutely positioned. The card flips on hover (Tailwind v4 `hover:` applies only on hover-capable devices), on keyboard focus within the card, and on tap when `(hover: none)` matches.

Projects need `id`, `name`, `description`, `challenge`, `outcome`, `github`, and `technologies[]`. `demo` is optional; its link renders only when set. `category` is optional too: a short label shown on the card front at desktop widths.

## Styling

- Design tokens (colors, including the warm `warm-bg`/`warm-surface` pair that Contact and Footer use with Tailwind `amber`/`stone`, and the `sans`/`mono`/`serif`/`space` font families) live in the `@theme` block of `src/index.css`. There is no `tailwind.config.js`; Tailwind v4 is wired through `@tailwindcss/postcss` in `postcss.config.js`.
- Fonts are loaded from Google Fonts by `<link>` tags in `index.html`.
- Typography roles and visual rules (sharp corners, dark surfaces, blue accent) are documented in `docs/DESIGN.md`. Playfair Display is used only for the hero name, Space Grotesk for section headings, and JetBrains Mono for technical labels.
- The background components in `src/components/backgrounds/` (`InteractiveScanningHUD`, `TopographicBlueprintBg`, `SpectralWaveformBg`, `StarChartBg`) are decorative and `aria-hidden`. The parent drives their layer motion through a `layerStyles` prop (or a `panel` prop for the HUD). They share `blueprintGrid(size)` for the drafting grid.
- Every background listens to `mousemove` on `window` and stays mounted while its panel is hidden, so cursor-driven values must be MotionValues, not React state. `StarChartBg` is the one exception (its nearest-star set is state), so its static artwork lives in the memoized `ChartArt`.

### Cursor readouts

Each pinned background has a crosshair that follows the cursor, with a readout box at the intersection. Both come from `CursorProbe` (`src/components/backgrounds/CursorProbe.jsx`):
- **Projects (`InteractiveScanningHUD`):** the country or ocean under the cursor plus approximate lat/lon. `worldMapLocator.js` fetches `/world-map.svg`, hit-tests its country `<path id>`s with `Path2D`, and inverts a fitted Miller projection. `ALIASES` maps island/region ids to country names.
- **About (`TopographicBlueprintBg`):** elevation from a Gaussian terrain model (`HILLS`) that matches the drawn contours.
- **Experience & Education (`StarChartBg`):** the nearest named waypoint and RA/Dec. This one passes `tone="accent"` (cyan); the others use the default gray `neutral` tone. The HUD also passes a brighter `lineClassName`.

Cursor positions are converted into each artwork's own coordinates with `getScreenCTM()` (SVG) or object-cover math (the map `<img>`), so they stay correct under cover scaling and entrance transforms. The box is rendered inside its background layer, so page content draws over it and it crossfades with the panel. `SpectralWaveformBg` (Skills) has its own telemetry badge instead.

## Assets

Static files in `public/` are referenced with root-absolute paths (`/hero-bg.avif`, `/profile.jpg`, `/world-map.svg`), which assumes deployment at the domain root. All images are Display P3; if you re-encode them, preserve the ICC profile, and ask before any lossy re-encoding.
- **Hero:** `hero-bg.avif` (3264×1484, AVIF quality 60) is served through a `<picture>` in `Hero.jsx`, with `hero-bg.jpg` (quality 90) as the fallback. `index.html` preloads only the AVIF (`type="image/avif"`), so browsers without AVIF skip the preload. If you replace the hero image, regenerate both files.
- **Profile:** `profile.jpg` is a 512×512 center crop (quality 85, progressive), enough for its 192px display size at 2× density.

## Deployment

The site deploys to Vercel with the settings in `vercel.json` (`npm ci`, `npm run build`, output `dist`). It is a single page with no client-side routes, so it needs no SPA rewrites; add one only if you add a router. The one-year `immutable` cache applies only to `/assets/`, whose file names Vite content-hashes. Don't extend it to `public/` files: their names don't change when their content does.

## Repo rules

- Never commit or push without the user's explicit permission for that action.
- Don't edit `dist/` (generated, gitignored).
- Keep `package.json` and `package-lock.json` in sync when changing dependencies.
