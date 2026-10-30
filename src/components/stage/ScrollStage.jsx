import { createContext, useContext, useMemo } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import usePositionAwareTransform from '../../hooks/usePositionAwareTransform';
import useViewportHeight from '../../hooks/useViewportHeight';

// Edge each panel enters through, indexed by transition (panel k enters via TRANSITIONS[k - 1]).
// Reading the page: → (Home→Projects), ↓ (Projects→About), ← (About→Skills), ↓ (Skills→Experience).
const TRANSITIONS = ['right', 'bottom', 'left', 'bottom'];

const OFFSCREEN = {
  right: { axis: 'x', from: '100vw', to: '0vw', exit: '-100vw' },
  left: { axis: 'x', from: '-100vw', to: '0vw', exit: '100vw' },
  bottom: { axis: 'y', from: '100vh', to: '0vh', exit: '-100vh' },
};

// Fraction of a transition over which backgrounds and incoming content fade
const FADE = 0.7;

const StageContext = createContext(null);

// A pinned stage: the section is `panelIds.length` screens tall and its sticky viewport scrubs
// through one transition per screen of scroll. Panel k is fully in place at scrollY = k * vh.
// The stage must start at the top of the page because it reads page-level scrollY.
export default function ScrollStage({ panelIds, children }) {
  const vh = useViewportHeight();
  const { scrollY } = useScroll();
  const stage = useMemo(() => ({ scrollY, vh, count: panelIds.length }), [scrollY, vh, panelIds.length]);

  return (
    <section id={panelIds[0]} className="relative bg-background" style={{ height: `${panelIds.length * 100}vh` }}>
      {/* Anchors at each panel's settled scroll position, for nav links and keyboard stops */}
      {panelIds.slice(1).map((id, i) => (
        <div key={id} id={id} className="absolute w-full" style={{ top: `${(i + 1) * 100}vh` }} />
      ))}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <StageContext.Provider value={stage}>{children}</StageContext.Provider>
      </div>
    </section>
  );
}

// Scroll geometry for panel `index`; pass the result to StagePanel and useStageEnter.
export function useStagePanel(index) {
  const { scrollY, vh, count } = useContext(StageContext);
  return useMemo(() => ({
    scrollY,
    vh,
    index,
    isFirst: index === 0,
    isLast: index === count - 1,
    // Scroll range over which this panel enters; it is fully in place at the end
    inputRange: [(index - 1) * vh, index * vh],
    enterFrom: index > 0 ? TRANSITIONS[index - 1] : null,
    exitTo: index < count - 1 ? OFFSCREEN[TRANSITIONS[index]] : null,
  }), [scrollY, vh, count, index]);
}

// One screen of the stage: a background layer that crossfades, and a content layer that fades in,
// then slides out as a block toward the next panel's opposite edge.
export function StagePanel({ panel, background, children, className = '' }) {
  const { scrollY, vh, index, isFirst, isLast, inputRange: [start, end], exitTo } = panel;

  const display = useTransform(scrollY, (v) =>
    (isFirst || v > start) && (isLast || v < end + vh) ? 'block' : 'none'
  );

  const backgroundOpacity = useTransform(
    scrollY,
    [start, start + FADE * vh, end, end + FADE * vh],
    [isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0]
  );
  const contentOpacity = useTransform(scrollY, [start, start + FADE * vh], [isFirst ? 1 : 0, 1]);

  // Outgoing content leaves linearly as one block
  const exitOffset = useTransform(scrollY, [end, end + vh], exitTo ? [exitTo.to, exitTo.exit] : ['0vw', '0vw']);
  const exitStyle = exitTo ? { [exitTo.axis]: exitOffset } : {};

  return (
    <>
      <m.div style={{ display, opacity: backgroundOpacity, zIndex: index * 2 }} className="absolute inset-0">
        {background}
      </m.div>
      <m.div
        style={{ display, opacity: contentOpacity, zIndex: index * 2 + 1, ...exitStyle }}
        className="absolute inset-0"
      >
        <div className={`w-full h-full ${className}`}>{children}</div>
      </m.div>
    </>
  );
}

// Style for one element entering with `panel`'s transition. `lead` places the element relative to
// the edge it enters through: 0 = farthest from it (arrives first), 1 = nearest (arrives last).
// Entering from the right that is the element's x position; from the bottom its y; from the left 1 - x.
export function useStageEnter(panel, lead, index) {
  const { scrollY, inputRange, enterFrom } = panel;
  const edge = OFFSCREEN[enterFrom ?? 'right'];
  const offset = usePositionAwareTransform(scrollY, inputRange, lead, index, [edge.from, edge.to]);
  return useMemo(() => (enterFrom ? { [edge.axis]: offset } : {}), [enterFrom, edge.axis, offset]);
}

// A div that enters with `panel`'s transition; for elements rendered in lists
export function StageEnter({ panel, lead, index, className, children }) {
  const style = useStageEnter(panel, lead, index);
  return <m.div style={style} className={className}>{children}</m.div>;
}
