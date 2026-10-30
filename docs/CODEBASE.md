# Navigating the Codebase

A map of where things live and how they connect. For the visual rules (fonts, colors, shapes) see [`DESIGN.md`](DESIGN.md).

## The 30-second version

- **Content** (names, projects, skills, experience, links) is in [`src/data/portfolio.js`](../src/data/portfolio.js). Most edits start and end there.
- **Page assembly** is in [`src/App.jsx`](../src/App.jsx): it picks a layout for the viewport and hands each section its slice of `portfolio`.
- **On desktop, the page is a pinned slideshow driven by scroll.** [`src/components/stage/ScrollStage.jsx`](../src/components/stage/ScrollStage.jsx) holds the screen still while you scroll, and each screen of scroll swaps one panel for the next. That file is the one non-obvious part of the codebase.
- **Each section** is one file in `src/components/sections/`. Each animated **background** is one file in `src/components/backgrounds/`.

## Directory map

```text
vercel.json                    Vercel deployment: build settings, caching and security headers
index.html                     HTML shell: <title>, meta description, Google Fonts, hero image preload
public/                        Served as-is from the site root
  hero-bg.avif                   Hero background (served to browsers that support AVIF)
  hero-bg.jpg                    Hero background fallback
  profile.jpg                    About portrait (512×512)
  world-map.svg                  Projects background map; also fetched to hit-test countries
src/
  main.jsx                     Entry: mounts <App> inside <LazyMotion> (see "Conventions")
  App.jsx                      Chooses the full or short stage and renders every section in order
  index.css                    Tailwind import, theme tokens (@theme), `short:` variant, global CSS animations
  data/
    portfolio.js               All personal content
  hooks/
    useMediaQuery.js           Live boolean for a CSS media query (picks the layout in App)
    useViewportHeight.js       Live window.innerHeight (stage scroll distances are multiples of it)
    usePositionAwareTransform.js  Scroll → transform with a per-element Bézier easing; exports createBezierEasing
    useScrollReveal.js         Adds .is-visible once an element scrolls into view (non-stage sections)
    useSectionKeyboardNav.js   PageUp / PageDown / Space jump between sections
  components/
    layout/
      Navbar.jsx               Fixed top nav; slides away as you leave the hero, reappears on hover
      Footer.jsx
    stage/
      ScrollStage.jsx          The pinned scroll stage and its hooks (useStagePanel, useStageEnter, StagePanel, StageEnter)
    sections/
      Hero.jsx                 Stage panel 0: name, role, bio over the hero photo
      Projects.jsx             Stage panel 1: heading, GitHub link, grid of ProjectCards
      ProjectCard.jsx          One flip card; owns the six-slot bento layout
      About.jsx                About (flow section) + AboutPanel (stage), sharing AboutContent
      Skills.jsx               Skills (flow) + SkillsPanel (stage), sharing SkillsContent; SKILL_INFO table
      ExperienceEducation.jsx  Flow section + ExperienceEducationPanel (stage), sharing ExperienceEducationContent
      Contact.jsx              Warm "terminal" contact section (always a normal section)
    backgrounds/               Decorative, aria-hidden layers behind the sections
      InteractiveScanningHUD.jsx  Projects: world map, grid, cursor probe naming the country under it
      worldMapLocator.js          Point on world-map.svg → country/ocean name and lat/lon
      TopographicBlueprintBg.jsx  About: contour map, cursor probe reading elevation
      SpectralWaveformBg.jsx      Skills: Fourier waveform, probe that rides the wave
      StarChartBg.jsx             Experience & Education: star chart, probe linking to the nearest stars
      CursorProbe.jsx             Shared crosshair and readout box used by the three probes above
      blueprintGrid.js            Shared drafting-grid background style
docs/
  DESIGN.md                    Design system: typography, color, shape, per-section look
  CODEBASE.md                  This file
```

## How the page is put together

`App.jsx` renders, top to bottom:

1. `Navbar` (fixed, overlays everything)
2. `ScrollStage` with the pinned panels
3. On small screens only: `About`, `Skills` and `ExperienceEducation` as normal sections
4. `Contact`, then `Footer`

Which panels go on the stage depends on `FULL_STAGE_QUERY` (`min-width: 1024px` and `min-height: 700px`):

| Viewport | Stage panels | Normal sections after the stage |
| --- | --- | --- |
| Large (desktop/laptop) | Hero → Projects → About → Skills → Experience & Education | Contact |
| Small (phones, tablets, short windows) | Hero → Projects | About, Skills, Experience & Education, Contact |

That is why `About`, `Skills` and `ExperienceEducation` each export two components. The default export is the **flow** version, a normal `<section>` that reveals on scroll. The `*Panel` export is the **stage** version. Both render the same `*Content` component, so the markup lives in one place.

## The scroll stage

`ScrollStage` is `N × 100vh` tall (N = number of panels) and contains one sticky, full-screen viewport. While you scroll through it, the viewport stays put and the panels animate:

```text
scrollY:   0        1·vh       2·vh       3·vh       4·vh
panel:     Hero  →  Projects → About   →  Skills  →  Experience & Education
enters:          from right  from bottom from left  from bottom
```

- Panel *k* is fully in place at `scrollY = k × innerHeight`. The screen of scroll before that is its entrance.
- The outgoing panel slides out as one block, backgrounds crossfade, and every element of the incoming panel flies in on its own easing curve. Elements farther from the entry edge arrive first.
- Nav links (`#projects`, `#about`, …) work because `ScrollStage` puts an empty anchor `div` at each panel's settled scroll position.

A panel component follows this pattern (see `Projects.jsx` for a short example):

```jsx
const panel = useStagePanel(index);                 // scroll geometry for this panel
const titleStyle = useStageEnter(panel, 0.0, 10);   // lead 0 → arrives first; 10 = unique timing-noise index

return (
  <StagePanel panel={panel} background={<SomeBg />}>
    <m.h2 style={titleStyle}>…</m.h2>
  </StagePanel>
);
```

For elements rendered in a list, use `<StageEnter panel lead index>` instead of calling the hook in a loop.

## Where do I change…

| I want to… | Go to |
| --- | --- |
| Edit my bio, projects, skills, jobs, links | `src/data/portfolio.js` |
| Add a skill | Add the string in `portfolio.js` **and** an entry in `SKILL_INFO` in `sections/Skills.jsx` (icon, brand color, short role) |
| Add a project | `portfolio.js`. The bento grid in `ProjectCard.jsx` is designed for exactly six cards; a seventh needs a grid redesign. |
| Change section headings or labels (`02 // DOSSIER…`) | The section's file in `components/sections/` (these are hard-coded) |
| Change About quotes or Contact copy | `sections/About.jsx`, `sections/Contact.jsx` |
| Change colors or fonts | `@theme` in `src/index.css`; font files in the `<link>` in `index.html` |
| Change nav links | `navLinks` in `layout/Navbar.jsx`. If you add/rename a section id, also update `SECTION_IDS` in `hooks/useSectionKeyboardNav.js`. |
| Change panel order or entry directions | `App.jsx` (order and ids) and `TRANSITIONS` in `stage/ScrollStage.jsx` |
| Change a background's artwork | Its file in `components/backgrounds/` |
| Change the page title or meta description | `index.html` (`App.jsx` also sets `document.title` from `portfolio.name`/`role`) |

## Conventions

- **Use `m.*`, never `motion.*`.** Components import `m` from `framer-motion`, and `main.jsx` wraps the app in `<LazyMotion features={domAnimation} strict>`. This leaves Framer Motion's unused features (layout animations, drag) out of the bundle. `strict` makes any `motion.*` throw in development, so you'll notice at once.
- **Don't fight Framer Motion with CSS.** On elements whose transform is scroll-driven, don't add Tailwind `transition-all`, `opacity-*` or `translate-*`; a CSS transition makes the element lag behind the scroll.
- **Call stage hooks in the panel component itself**, not inside `StagePanel`'s children. Pass `panel` down as a prop when a child needs it, as `ProjectCard` and `InteractiveScanningHUD` do.
- **Mouse-driven readouts use MotionValues, not React state.** Every background listens to `mousemove` on `window` (even while its panel is hidden), so state updates there would re-render on every mouse move. `CursorProbe` renders MotionValue text directly.
- **Panels must fit on one 1024×700 screen.** If you add content to a stage panel, check it at that size. The `short:` Tailwind variant (`max-height: 820px`) is there to tighten spacing.
- **Static files** in `public/` are referenced by root-absolute paths (`/profile.jpg`), which assumes the site is deployed at the domain root.

## Checking your changes

There are no tests or linters. `npm run build` is the only automated check. After that, look at the page (`npm run dev`) at about **1440×900** (full stage), **1024×700** (smallest full stage), and **390×844** (phone layout). Scroll through every transition, and move the mouse over each pinned background to see its probe.
