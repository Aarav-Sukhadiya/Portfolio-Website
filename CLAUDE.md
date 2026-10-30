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

- **Content** lives in `src/data/portfolio.js`. Section components receive slices of it as props from `src/App.jsx`. Some copy is hard-coded in components: nav labels, section headings and labels, About quotes, Contact text, and footer.
- **Section order** (`App.jsx`): `HeroAndProjects` → `About` → `Skills` → `Experience` → `Education` → `Contact`, plus a fixed `Navbar` and `Footer`.
- **Skills icons** are looked up by exact skill string in `iconMap` in `src/components/Skills.jsx`. Unknown strings fall back to a generic icon.

### Scroll choreography (the non-obvious part)

Several files share timing constants derived from `window.innerHeight` (via `src/hooks/useViewportHeight.js`):

- `HeroAndProjects` is a `h-[200vh]` section with a sticky `h-screen` stage. Page `scrollY` from 0 → 1vh (`scrubDistance`) slides the hero text out and fades the projects panel in. `#projects` is an absolutely positioned marker at `top-[100vh]`, the end of that scrub. It is not the top of a visible section.
- `Navbar` hides over the first 0.5vh of that same scrub. If the hero section height or scrub distance changes, update the navbar together with it.
- Project cards, the Projects title and button, and the HUD layers each slide in using `usePositionAwareTransform(scrollY, scrubDistance, basePosition, index)`. It interpolates a cubic-Bézier easing from the element's horizontal position (0 = left, 1 = right) plus deterministic per-index noise. Reuse it, or its exported `createBezierEasing`, rather than writing new easing code.
- `About` and `TopographicBlueprintBg` use section-relative `useScroll({ target, offset: ["start end", "start start"] })` progress. Prefer this for new scroll scenes. Only `HeroAndProjects` and `Navbar` may assume page-level `scrollY`, because they sit at the top of the page.
- `Skills`, `Experience`, `Education`, and `Contact` use the CSS scroll-reveal instead. An element with the `.animate-on-scroll` class gets `.is-visible` from the IntersectionObserver in `App.jsx`, and the styles live in `src/index.css` (including the reduced-motion override). Don't add Tailwind `opacity-0`/`translate-*` utilities to those elements: unlayered CSS owns them.
- `src/hooks/useSectionKeyboardNav.js` makes PageUp, PageDown and Space jump between the section-id stops. Keep its `SECTION_IDS` list in sync when you add, remove, or rename section ids.

### Project cards

`src/components/ui/ProjectCard.jsx` owns the bento layout (`BENTO_CLASSES`) and per-slot easing positions (`SLOT_CENTERS`). Both are designed for exactly six projects on a 4×3 desktop grid; a seventh project needs a grid redesign. Mobile uses a 2-column grid with fixed `h-36` cards, because both card faces are absolutely positioned. The card flips on hover (Tailwind v4 `hover:` applies only on hover-capable devices), on keyboard focus within the card, and on tap when `(hover: none)` matches.

Projects need `id`, `name`, `description`, `challenge`, `outcome`, `github`, and `technologies[]`. `demo` is optional; its link renders only when set.

## Styling

- Design tokens (colors and the `sans`/`mono`/`serif`/`space` font families) live in the `@theme` block of `src/index.css`. There is no `tailwind.config.js`; Tailwind v4 is wired through `@tailwindcss/postcss` in `postcss.config.js`.
- Fonts are loaded from Google Fonts by `<link>` tags in `index.html`.
- Typography roles and visual rules (sharp corners, dark surfaces, blue accent) are documented in `docs/DESIGN.md`. Playfair Display is used only for the hero name, Space Grotesk for section headings, and JetBrains Mono for technical labels.
- The background components (`InteractiveScanningHUD`, `TopographicBlueprintBg`, `SpectralWaveformBg`) are decorative and `aria-hidden`. `SpectralWaveformBg` re-renders on every mousemove for its telemetry readout, so keep static SVG content inside the memoized `SpectralBlueprint`.

## Assets

Static files in `public/` are referenced with root-absolute paths (`/hero-bg.jpg`, `/profile.jpg`, `/world-map.svg`), which assumes deployment at the domain root. The JPEGs are 3264×1484 Display P3 images, much larger than their display size. If you re-encode them, preserve the ICC profile.

## Repo rules

- Never commit or push without the user's explicit permission for that action.
- Don't edit `dist/` (generated, gitignored).
- Keep `package.json` and `package-lock.json` in sync when changing dependencies.
