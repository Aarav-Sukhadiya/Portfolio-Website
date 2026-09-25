# Design System & Decisions

This document tracks all design-related decisions for the portfolio.

## Typography (Font Super-Families)
- **Primary Display / Serif:** `Playfair Display`
  - *Usage:* Only used for massive impact headings like the hero section's name (`h1`). Provides an editorial, premium, sharp look.
- **Primary Sans-Serif:** `Montserrat`
  - *Usage:* Used for body text, regular headings, buttons, and navigation. A rhythmic, geometric, humanist sans (closest free alternative to Massilia).
- **Monospace Accent:** `JetBrains Mono`
  - *Usage:* Used for small labels, code, decorative metadata, project numbers, and subtitles. Adds a crisp technical engineer aesthetic.

## Shape & Geometry
- **Zero Rounded Corners:** All elements (cards, buttons, images) must use sharp corners (`rounded-none`). This reinforces a rigid, technical, and precise aesthetic.

## Colors
- **Background:** `#0a0a0a` (Deep dark)
- **Surface:** `#171717` (Elevated dark)
- **Border:** `#262626` (Subtle separator)
- **Primary Text:** `#ffffff` (White for high contrast)
- **Secondary Text:** `#a3a3a3` (Muted gray)
- **Accent:** `#3b82f6` (Subtle blue)

## Layout & Components
- **Hero:** Full-screen banner with a top-down dark gradient overlay to ensure the headline is readable regardless of the background image.
- **Projects:** Interactive 3D flip cards (without explicit instructions, to surprise users). Displayed in an asymmetric, Pinterest-style masonry grid.
- **Skills:** Clean, boxed layout with descriptive SVG icons for each category.
