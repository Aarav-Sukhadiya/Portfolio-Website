# AGENTS.md

## Scope

These instructions apply to the entire repository.

## Project Overview

This is a client-side personal portfolio built with React 19, Vite 8, Tailwind CSS 4, Framer Motion, React Icons, and Lucide React. It has no backend, database, router, server-side rendering, or environment configuration.

The application is a single scrolling page with a separate query-parameter preview mode. Portfolio content is stored in JavaScript rather than fetched from an API.

## Architecture

- `index.html` provides the Vite HTML shell and loads `src/main.jsx`.
- `src/main.jsx` mounts `App` in `React.StrictMode` and imports global styles.
- `src/App.jsx` controls page composition, the document title, preview mode, and global scroll-reveal behavior.
- `src/components/` contains page sections such as the navbar, hero/projects, about, skills, experience, education, contact, and footer.
- `src/components/ui/` contains reusable complex UI such as project cards and the scanning HUD.
- `src/hooks/` contains custom animation hooks.
- `src/data/portfolio.js` is the primary source of truth for personal content.
- `public/` contains static assets served from the site root.
- `docs/DESIGN.md` records the intended visual language.

The normal component hierarchy is:

```text
App
├── Navbar
├── main
│   ├── HeroAndProjects
│   │   ├── InteractiveScanningHUD
│   │   └── ProjectCard
│   ├── About
│   ├── Skills
│   ├── Experience
│   ├── Education
│   └── Contact
└── Footer
```

## Toolchain and Commands

Use Node.js `^20.19.0` or `>=22.12.0`, which is required by the installed Vite version.

```bash
npm ci             # Install the locked dependency tree
npm run dev        # Start the Vite development server
npm run build      # Generate the production bundle in dist/
npm run preview    # Serve the production bundle locally
```

There are currently no lint, format, typecheck, unit-test, end-to-end-test, coverage, or CI scripts. `npm test` is a placeholder that always exits with an error; do not use it as a successful verification step.

## Development Guidelines

### General conventions

- Follow the style and structure of nearby files. There is no enforced formatter, and the repository contains mixed quote and semicolon styles.
- Keep changes focused. Avoid repository-wide formatting, quote conversion, or component rewrites unrelated to the task.
- Use ES modules, function components, React hooks, prop-driven sections, and stable `id` values for list keys.
- Name React components and component files in PascalCase. Name custom hooks in camelCase with a `use` prefix.
- Preserve cleanup returned by every effect that registers window listeners, observers, or Framer Motion subscriptions.
- Prefer section-relative `useScroll` targets for new scroll scenes. Do not introduce page-level `scrollY` assumptions unless the section is guaranteed to begin at the top of the page.

### Content and data

- Make ordinary personal-content changes in `src/data/portfolio.js`.
- Preserve the fields consumed by existing components. Projects require `id`, `name`, `description`, `challenge`, `outcome`, `github`, and a `technologies` array. `demo` is optional.
- Skills are matched by exact string against the icon map in `src/components/Skills.jsx`; unknown skills fall back to a generic icon.
- Navigation labels, section order, some headings, quotes, contact copy, and footer text are intentionally defined in components rather than `portfolio.js`.
- If metadata should be personalized or search/social previews are added, update `index.html` as well as the JavaScript document title.

### Project cards and preview mode

- The live and preview project cards are separate implementations. When changing card content, links, layout, or interaction, inspect both `src/components/ui/ProjectCard.jsx` and `StaticProjectCard` in `src/components/Preview.jsx`.
- The desktop bento grid has six layout entries. Adding a seventh project repeats the first span and requires a deliberate grid redesign and preview update.
- Mobile project rows need explicit height or a non-absolute layout because the current card faces are absolutely positioned.
- Preview mode is selected by `?preview=<mode>`. Supported modes are `glow-crosshairs`, `grid-crosshairs`, and `vignette-crosshairs`.
- Validate preview values against an explicit allowlist if preview behavior is changed. Unknown non-empty values currently enter the preview shell without a background.

### Scroll and animation coupling

- The hero/projects section uses a `250vh` flow section and a `1.35 * innerHeight` scrub distance.
- The navbar hides over `0.6 * innerHeight`. If the hero scrub distance or section height changes, review and update the navbar timing together.
- The `#projects` anchor is an intentionally positioned transition target, not the top of the final project panel.
- The About section uses section-relative progress. Some existing comments describe its old height incorrectly; trust the implementation over stale comments.
- Reuse `src/hooks/usePositionAwareTransform.js` for position-dependent scroll easing rather than duplicating its Bézier and timing logic.
- Keep `.animate-on-scroll` markup, the observer query in `src/App.jsx`, and reduced-motion behavior synchronized.

### Styling and design

- Styling is primarily inline Tailwind utility classes. Preserve the existing responsive prefixes, spacing, borders, dark surfaces, and sharp-cornered visual language.
- The active Tailwind CSS 4 design tokens are defined in the `@theme` block in `src/index.css`.
- `tailwind.config.js` contains older duplicate token definitions and is not loaded through `@config`. Do not assume edits there affect the build; clarify or remove the duplication before relying on it.
- Follow the typography roles documented in `docs/DESIGN.md`:
  - Playfair Display for the large editorial hero heading.
  - Montserrat for body text and general UI.
  - JetBrains Mono for technical labels and metadata.
  - Space Grotesk for section headings.
- Fonts are loaded from Google Fonts at runtime and require network access.

### Accessibility and interaction

- Do not make hover behavior the only way to reveal interactive content. Project cards currently need improved touch and keyboard support.
- Preserve visible focus behavior, meaningful link destinations, image alt text, and mobile-menu state semantics.
- For animation changes, verify reduced-motion behavior, keyboard navigation, touch input, and narrow screens.
- External links using `target="_blank"` should retain `rel="noopener noreferrer"`.
- Prefer rendering optional links only when a real URL exists rather than opening placeholder `#` links in new tabs.

### Assets and deployment

- Local assets live in `public/` and are referenced with root-absolute paths such as `/profile.jpg`.
- Keep asset filenames and all references synchronized, including preview references.
- Root-absolute asset URLs assume deployment at the domain root. If deploying under a subpath, update Vite base configuration and asset references together.
- Do not edit `dist/`; it is generated output.
- The two JPEG assets are large for their displayed roles. Optimize them and provide dimensions when changing image-loading behavior.

## Verification

For every change:

1. Run `npm run build`.
2. Manually inspect desktop and mobile layouts when filesystem or browser access is available.
3. Scroll through the full page and verify sticky hero/projects behavior, About transitions, navbar hiding, and section anchors.
4. Check project-card sizing, flipping, links, and technology tags.
5. Check the mobile menu, keyboard navigation, touch interaction, and reduced-motion behavior for relevant changes.
6. Test all three preview query modes when changing preview or shared project-card behavior.
7. Check the browser console and network failures, particularly the remote Google Fonts request.
8. Do not claim lint, typecheck, or tests passed unless corresponding tooling has been added and actually run successfully.

## Known Limitations

- There is no automated quality gate beyond the Vite production build.
- The project grid is fixed to six desktop entries and may collapse on mobile without explicit sizing.
- Project-card interaction is hover-oriented and is not fully accessible to touch or keyboard users.
- Reduced-motion CSS does not disable Framer Motion scroll transforms, card flips, or other motion.
- The mobile menu lacks full focus management and Escape-key handling.
- Unknown preview values are not rejected.
- `lucide-react`, some component state, props, and imports are currently unused.
- Image files are oversized, and the SVG contains substantial editor metadata.
- HTML metadata remains generic and has no favicon, canonical URL, or social preview metadata.

## Git Safety

- Never edit or stage generated `dist/` output or ignored local files.
- Keep `package.json` and `package-lock.json` synchronized when intentionally changing dependencies.
- Never commit or push without the user's explicit permission for that specific action.
- Before any authorized commit, inspect repository status, the complete relevant diff, and recent history.
