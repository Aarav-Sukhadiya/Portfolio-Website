import { useEffect, useRef } from 'react';
import { m, useMotionValue, useSpring } from 'framer-motion';
import CursorProbe from './CursorProbe';
import { blueprintGrid } from './blueprintGrid';

const GRID_STYLE = blueprintGrid(80);

// Terrain model matching the drawn contours (SVG units): a base plain, the central ridge
// peaking at PEAK_01 (+1040m), and the secondary hill to the top right.
const HILLS = [
  { x: 615, y: 590, height: 640, sx: 300, sy: 200 },
  { x: 1150, y: 235, height: 260, sx: 140, sy: 90 },
];
const BASE_ELEVATION = 400;

function elevationAt(x, y) {
  return HILLS.reduce(
    (elev, h) => elev + h.height * Math.exp(-(((x - h.x) / h.sx) ** 2 + ((y - h.y) / h.sy) ** 2) / 2),
    BASE_ELEVATION
  );
}

// About background: a topographic contour map with a survey probe that reads the elevation under
// the cursor. Layer motion (entrance/parallax) is driven by the parent through
// layerStyles: { root, grid, map, telemetry }.
export default function TopographicBlueprintBg({ layerStyles = {} }) {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 200 });
  const elevation = useMotionValue('ELEV: +400 m');
  const gridLabel = useMotionValue('GRID: 0000 / 0000');
  const mapRef = useRef(null);

  useEffect(() => {
    let frame = 0;

    // Convert the cursor into the contour map's own SVG coordinates (handles cover scaling and parallax)
    const updateElevation = () => {
      frame = 0;
      const ctm = mapRef.current?.getScreenCTM();
      if (!ctm) return;
      const pt = new DOMPoint(mouseX.get(), mouseY.get()).matrixTransform(ctm.inverse());
      elevation.set(`ELEV: +${Math.round(elevationAt(pt.x, pt.y))} m`);
      gridLabel.set(`GRID: ${String(Math.round(pt.x)).padStart(4, '0')} / ${String(Math.round(pt.y)).padStart(4, '0')}`);
    };

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!frame) frame = requestAnimationFrame(updateElevation);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY, elevation, gridLabel]);

  return (
    <m.div
      style={layerStyles.root}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      <m.div style={{ ...GRID_STYLE, ...layerStyles.grid }} className="absolute inset-0 opacity-[0.06]" />

      {/* Contour map */}
      <m.div style={layerStyles.map} className="absolute inset-0 w-full h-full opacity-[0.22]">
        <svg
          ref={mapRef}
          className="w-full h-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          stroke="currentColor"
        >
          <g className="text-white" strokeWidth="1">
            {/* Outer low-elevation contours */}
            <path d="M-100,200 C300,150 500,400 900,300 C1200,220 1400,450 1600,400" />
            <path d="M-100,280 C280,240 480,480 880,380 C1180,300 1380,530 1600,480" strokeDasharray="6 6" />
            <path d="M-100,360 C260,320 460,560 860,460 C1160,380 1360,610 1600,560" />

            {/* Central ridge */}
            <path d="M150,550 C250,380 450,320 650,420 C850,520 1050,420 1150,580 C1250,720 950,850 700,800 C450,750 100,700 150,550 Z" strokeWidth="1.5" className="text-cyan-400" />
            <path d="M220,560 C300,420 470,380 640,460 C810,540 980,460 1060,590 C1140,700 900,790 690,750 C480,710 180,680 220,560 Z" />
            <path d="M290,570 C350,460 490,430 630,490 C770,550 910,490 980,600 C1040,680 850,740 680,710 C510,680 250,650 290,570 Z" strokeDasharray="4 4" />
            <path d="M360,580 C400,500 510,470 620,520 C730,560 840,520 890,600 C940,660 800,700 670,680 C540,650 330,630 360,580 Z" />
            <path d="M430,590 C460,540 530,510 610,540 C690,570 760,540 800,600 C830,640 740,670 660,650 C570,630 410,620 430,590 Z" strokeWidth="1.5" className="text-cyan-400" />

            {/* Secondary hill, top right */}
            <path d="M950,150 C1050,80 1200,90 1300,160 C1400,230 1380,350 1280,380 C1180,410 1040,360 980,280 C930,220 880,190 950,150 Z" strokeWidth="1.5" />
            <path d="M1020,170 C1090,120 1200,130 1260,180 C1320,230 1300,310 1230,330 C1160,350 1070,320 1030,260 C1000,220 970,200 1020,170 Z" />
            <path d="M1080,190 C1120,160 1190,170 1220,200 C1250,230 1240,280 1190,290 C1140,300 1090,280 1070,250 C1050,220 1050,210 1080,190 Z" />
          </g>

          <g className="text-white/60 font-mono text-[9px] tracking-wider" fill="currentColor">
            <text x="650" y="410">+920m [RIDGE]</text>
            <text x="610" y="530">+1040m [PEAK_01]</text>
            <text x="1220" y="195">+640m</text>
            <text x="150" y="720">CONTOUR INTERVAL: 20m</text>
            <text x="150" y="735">DATUM: WGS-84 / ELEV_SRTM</text>
            <text x="1100" y="820">SECTOR: 12°58'23"N 77°35'45"E</text>
          </g>
        </svg>
      </m.div>

      {/* Perimeter telemetry banner */}
      <m.div
        style={layerStyles.telemetry}
        className="absolute inset-6 md:inset-10 flex flex-col justify-between font-mono text-[10px] text-white/50 tracking-widest uppercase pointer-events-none"
      >
        <div className="flex justify-between">
          <span className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-cyan-400 animate-pulse" />
            TOPOGRAPHIC_SCHEMATIC // V2.1
          </span>
          <span>ELEV_SCALE: 1:25000</span>
        </div>
        <div className="flex justify-between">
          <span>SURFACE: TERRAIN_CONTOURS</span>
          <span>GRID: 80x80_DRAFT</span>
        </div>
      </m.div>

      <CursorProbe x={smoothX} y={smoothY} title="SURVEY_PT // TOPO" lines={[elevation, gridLabel]} />
    </m.div>
  );
}
