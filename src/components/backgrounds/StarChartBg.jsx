import { memo, useEffect, useRef, useState } from 'react';
import { m, useMotionValue, useMotionValueEvent, useSpring } from 'framer-motion';
import CursorProbe from './CursorProbe';
import { blueprintGrid } from './blueprintGrid';

const GRID_STYLE = blueprintGrid(80);

// Star field on a 1440x900 canvas. Named stars mark milestones along the charted route.
const STARS = [
  { x: 150, y: 640, r: 3, name: 'ORIGIN' },
  { x: 290, y: 560, r: 2 },
  { x: 420, y: 610, r: 4, name: 'SST_2024' },
  { x: 560, y: 470, r: 2 },
  { x: 650, y: 520, r: 3 },
  { x: 760, y: 380, r: 4, name: 'IITM_DS' },
  { x: 880, y: 430, r: 2 },
  { x: 960, y: 300, r: 3, name: 'LLM_SCRATCH' },
  { x: 1090, y: 350, r: 2 },
  { x: 1150, y: 230, r: 4, name: 'DFDETECT' },
  { x: 1300, y: 180, r: 3, name: 'HORIZON' },
  { x: 230, y: 300, r: 1.5 },
  { x: 380, y: 210, r: 1.5 },
  { x: 520, y: 290, r: 2 },
  { x: 1240, y: 520, r: 1.5 },
  { x: 1050, y: 620, r: 2 },
  { x: 860, y: 690, r: 1.5 },
  { x: 640, y: 160, r: 1.5 },
  { x: 1340, y: 400, r: 2 },
  { x: 120, y: 420, r: 1.5 },
];
const NAMED = STARS.filter((s) => s.name);

// Charted route through the named milestones, plus faint asterism links
const ROUTE_PATH = `M ${STARS.slice(0, 11).map((s) => `${s.x},${s.y}`).join(' L ')}`;
const LINKS = [[11, 12], [12, 13], [13, 3], [17, 13], [5, 17], [14, 18], [15, 16], [15, 14], [19, 11], [6, 15]];

const NEAREST = 3;
const dist2 = (s, x, y) => (s.x - x) ** 2 + (s.y - y) ** 2;

function nearestStars(x, y) {
  return STARS
    .map((s, i) => [i, dist2(s, x, y)])
    .sort((a, b) => a[1] - b[1])
    .slice(0, NEAREST)
    .map(([i]) => i);
}

// Right ascension / declination for a canvas point, treating the chart as a 24h × 180° field
function raDec(x, y) {
  const ra = Math.max(0, Math.min(1, x / 1440)) * 24;
  const dec = 90 - Math.max(0, Math.min(1, y / 900)) * 180;
  const h = Math.floor(ra);
  const m = Math.floor((ra - h) * 60);
  return `RA ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m | DEC ${dec >= 0 ? '+' : '−'}${Math.abs(Math.round(dec))}°`;
}

// The static chart: graticule, asterism links, the route, and the stars with their labels.
// Memoized so the probe's nearest-star updates don't re-render it.
const ChartArt = memo(function ChartArt() {
  return (
    <>
      <g className="text-white" opacity="0.25" strokeWidth="1">
        {/* Celestial graticule */}
        <ellipse cx="720" cy="900" rx="900" ry="620" strokeDasharray="2 8" />
        <ellipse cx="720" cy="900" rx="700" ry="470" strokeDasharray="2 8" />
        <ellipse cx="720" cy="900" rx="500" ry="320" strokeDasharray="2 8" />
        {[200, 460, 720, 980, 1240].map((x) => (
          <line key={x} x1="720" y1="900" x2={x} y2="0" strokeDasharray="2 10" />
        ))}
        {LINKS.map(([a, b]) => (
          <line key={`${a}-${b}`} x1={STARS[a].x} y1={STARS[a].y} x2={STARS[b].x} y2={STARS[b].y} strokeDasharray="3 5" />
        ))}
      </g>

      <path d={ROUTE_PATH} className="text-cyan-400" opacity="0.52" strokeWidth="1.4" />

      <g className="text-white" fill="currentColor" stroke="none">
        {STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} opacity={s.name ? 0.62 : 0.37} />
        ))}
      </g>
      <g className="text-cyan-400" opacity="0.47">
        {NAMED.map((s) => (
          <circle key={s.name} cx={s.x} cy={s.y} r={s.r + 7} strokeDasharray="2 3" />
        ))}
      </g>
      <g className="text-white/60 font-mono" opacity="0.47" fill="currentColor" stroke="none" fontSize="9" letterSpacing="1.5">
        {NAMED.map((s) => (
          <text key={s.name} x={s.x + 14} y={s.y - 12}>{s.name}</text>
        ))}
        <text x="140" y="120">RIGHT ASCENSION / DECLINATION // GNOMONIC PROJECTION</text>
        <text x="140" y="138">d = arccos(sin δ₁ sin δ₂ + cos δ₁ cos δ₂ cos Δα)</text>
      </g>
    </>
  );
});

// Experience & Education background: the study path drawn as a constellation route. The cursor
// is a navigation probe that links itself to the nearest stars and reads out its position.
// Layer motion is driven by the parent through layerStyles: { grid, art, telemetry }.
export default function StarChartBg({ layerStyles = {} }) {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  // Probe position in chart coordinates
  const probeX = useMotionValue(720);
  const probeY = useMotionValue(450);
  const waypoint = useMotionValue('NEAREST: —');
  const position = useMotionValue(raDec(720, 450));
  const [nearest, setNearest] = useState(() => nearestStars(720, 450));
  const svgRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Convert the smoothed cursor into chart coordinates (handles cover scaling and entrance offsets)
  const updateProbe = () => {
    const ctm = svgRef.current?.getScreenCTM();
    if (!ctm) return;
    const { x, y } = new DOMPoint(smoothX.get(), smoothY.get()).matrixTransform(ctm.inverse());
    probeX.set(x);
    probeY.set(y);
    position.set(raDec(x, y));

    const closest = NAMED.reduce((best, s) => (dist2(s, x, y) < dist2(best, x, y) ? s : best));
    waypoint.set(`NEAREST: ${closest.name} · ${Math.round(Math.sqrt(dist2(closest, x, y)))} u`);

    // Only re-render when the set of nearest stars actually changes
    const next = nearestStars(x, y);
    setNearest((prev) => (prev.every((v, i) => v === next[i]) ? prev : next));
  };
  useMotionValueEvent(smoothX, 'change', updateProbe);
  useMotionValueEvent(smoothY, 'change', updateProbe);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      <m.div style={{ ...GRID_STYLE, ...layerStyles.grid }} className="absolute inset-0 opacity-[0.05]" />

      <m.svg
        ref={svgRef}
        style={layerStyles.art}
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke="currentColor"
      >
        <ChartArt />

        {/* Cursor probe triangulating against the nearest stars */}
        <g className="text-cyan-400" opacity="0.47">
          {nearest.map((i) => (
            <m.line key={i} x1={probeX} y1={probeY} x2={STARS[i].x} y2={STARS[i].y} strokeWidth="1" strokeDasharray="4 4" />
          ))}
          <m.circle cx={probeX} cy={probeY} r="14" strokeWidth="1" />
        </g>
      </m.svg>

      <m.div
        style={layerStyles.telemetry}
        className="absolute inset-6 md:inset-10 flex flex-col justify-between font-mono text-[10px] text-white/50 tracking-widest uppercase"
      >
        <div className="flex justify-between">
          <span className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-cyan-400 animate-pulse" />
            ASTROMETRIC_CHART // EPOCH J2024
          </span>
          <span>FIELD: 120° × 75°</span>
        </div>
        <div className="flex justify-between">
          <span>MAG LIMIT: +6.5</span>
          <span>ROUTE: 11 WAYPOINTS</span>
        </div>
      </m.div>

      <CursorProbe x={smoothX} y={smoothY} title="NAV_PROBE // STAR CHART" lines={[waypoint, position]} tone="accent" />
    </div>
  );
}
