# Design System & Decisions

This document tracks all design-related decisions for the portfolio.

## Typography (Font Super-Families)
- **Primary Display / Serif:** `Playfair Display`
  - *Usage:* Only used for massive impact headings like the hero section's name (`h1`). Provides an editorial, premium, sharp look.
- **Primary Sans-Serif:** `Montserrat`
  - *Usage:* Used for body text, regular headings, buttons, and navigation. A rhythmic, geometric, humanist sans (closest free alternative to Massilia).
- **Monospace Accent:** `JetBrains Mono`
  - *Usage:* Used for small labels, code, decorative metadata, project numbers, and subtitles. Adds a crisp technical engineer aesthetic.
- **Section Headings:** `Space Grotesk`
  - *Usage:* Section titles (`Projects`, `About Me`, `Skills`), skill category labels, and the About quotes. Tech and geometric.

## Shape & Geometry
- **Zero Rounded Corners:** All elements (cards, buttons, images) must use sharp corners (`rounded-none`). This reinforces a rigid, technical, and precise aesthetic.

## Colors
- **Background:** `#0a0a0a` (Deep dark)
- **Surface:** `#171717` (Elevated dark)
- **Border:** `#262626` (Subtle separator)
- **Primary Text:** `#ffffff` (White for high contrast)
- **Secondary Text:** `#a3a3a3` (Muted gray)
- **Accent:** `#3b82f6` (Subtle blue)
- **Contact & Footer (warm terminal theme):** `warm-bg` `#0c0906` and `warm-surface` `#140e09` with Tailwind `amber-*` accents and `stone-*` text. The page's closing section deliberately switches from cool gray/blue to warm amber, while keeping the mono labels and sharp corners.

## Layout & Components
- **Hero:** Full-screen banner with a top-down dark gradient overlay to ensure the headline is readable regardless of the background image.
- **Projects:** Interactive 3D flip cards (without explicit instructions, to surprise users). The front is a spec sheet: number and category on a rule, name and summary, and a tech-stack footer. Displayed in an asymmetric six-slot bento grid on desktop and a two-column grid on mobile, over a world-map, blueprint-grid, and mouse-crosshair HUD.
- **About:** Bento cards that rise in on scroll over a topographic contour blueprint background.
- **Skills:** Each category is a terminal-style readout (`// languages.cfg` header, `SKILL ........ role` rows with muted icons that take their brand color on hover), over a Fourier waveform blueprint background with a mouse-driven probe.
- **Experience & Education:** Two columns (experience as a timeline with square accent dots, education as cards with a "Focus Areas" footer) over a star chart, where the study path is drawn as a constellation route and a cyan cursor probe links itself to the nearest stars.
- **Contact:** The closing section switches to the warm terminal theme: a pitch with amber call-to-action buttons beside a `channels.sh` terminal that lists contact links and an ASCII tea cup with drifting steam.
