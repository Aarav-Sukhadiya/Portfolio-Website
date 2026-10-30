import { m } from 'framer-motion';

const TONES = {
  neutral: { box: 'border-white/10 bg-background/70', title: 'text-white/40', line: 'text-white/60' },
  accent: { box: 'border-cyan-400/30 bg-[#0a0f1a]/80', title: 'text-cyan-400/80', line: 'text-white/70' },
};

// Full-screen crosshair that follows the cursor, with a small readout box just below-right of the
// intersection. It is part of the background it is rendered in, so page content draws over it and
// it crossfades with it. `x`/`y` are viewport-pixel MotionValues; `lines` may contain strings or
// MotionValues (rendered live without React re-renders).
export default function CursorProbe({ x, y, title, lines, tone = 'neutral', lineClassName = 'bg-white/20' }) {
  const colors = TONES[tone];
  return (
    <>
      <div className="mix-blend-difference absolute inset-0 z-20">
        <m.div className={`absolute top-0 left-0 w-full h-px ${lineClassName}`} style={{ y }} />
        <m.div className={`absolute top-0 left-0 w-px h-full ${lineClassName}`} style={{ x }} />
      </div>

      <m.div className="absolute top-0 left-0 z-30 pointer-events-none" style={{ x, y }}>
        <div className={`ml-3 mt-3 px-2.5 py-1.5 border ${colors.box} backdrop-blur-sm font-mono text-[9px] leading-relaxed tracking-wider whitespace-nowrap`}>
          <div className={`${colors.title} font-bold`}>{title}</div>
          {lines.map((line, i) => (
            <m.div key={i} className={colors.line}>{line}</m.div>
          ))}
        </div>
      </m.div>
    </>
  );
}
