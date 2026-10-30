import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { createBezierEasing } from '../../hooks/usePositionAwareTransform';

// Master entrance: rises from below (40vh -> 0vh) and fades in as About scrolls into place
const easeMaster = createBezierEasing(0.12, 0.88, 0.2, 1.0);

// Distinct non-linear parallax layers for contour map, grid, and telemetry
const easeMap = createBezierEasing(0.08, 0.92, 0.18, 1.0);
const easeGrid = createBezierEasing(0.2, 0.8, 0.25, 1.0);
const easeTelemetry = createBezierEasing(0.15, 0.85, 0.2, 1.0);

export default function TopographicBlueprintBg({ scrollYProgress }) {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const bgMasterOpacity = useTransform(scrollYProgress, [0, 0.95], [0, 1], { ease: easeMaster });
  const bgMasterY = useTransform(scrollYProgress, [0, 1], ["40vh", "0vh"], { ease: easeMaster });
  const mapY = useTransform(scrollYProgress, [0, 1], ["20vh", "0vh"], { ease: easeMap });
  const gridY = useTransform(scrollYProgress, [0, 1], ["10vh", "0vh"], { ease: easeGrid });
  const telemetryY = useTransform(scrollYProgress, [0, 1], ["15vh", "0vh"], { ease: easeTelemetry });

  return (
    <motion.div 
      style={{ opacity: bgMasterOpacity, y: bgMasterY }} 
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Technical Drafting Blueprint Grid with vertical parallax */}
      <motion.div 
        style={{ y: gridY }}
        className="absolute inset-0 opacity-[0.06]" 
      >
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)', 
            backgroundSize: '80px 80px' 
          }} 
        />
      </motion.div>

      {/* 2. Topographic Elevation Contour Vector Map (slides up from below with parallax) */}
      <motion.div 
        style={{ y: mapY }}
        className="absolute inset-0 w-full h-full opacity-[0.22]"
      >
        <svg 
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
            
            {/* Central Ridge 1 */}
            <path d="M150,550 C250,380 450,320 650,420 C850,520 1050,420 1150,580 C1250,720 950,850 700,800 C450,750 100,700 150,550 Z" strokeWidth="1.5" className="text-cyan-400" />
            <path d="M220,560 C300,420 470,380 640,460 C810,540 980,460 1060,590 C1140,700 900,790 690,750 C480,710 180,680 220,560 Z" />
            <path d="M290,570 C350,460 490,430 630,490 C770,550 910,490 980,600 C1040,680 850,740 680,710 C510,680 250,650 290,570 Z" strokeDasharray="4 4" />
            <path d="M360,580 C400,500 510,470 620,520 C730,560 840,520 890,600 C940,660 800,700 670,680 C540,650 330,630 360,580 Z" />
            <path d="M430,590 C460,540 530,510 610,540 C690,570 760,540 800,600 C830,640 740,670 660,650 C570,630 410,620 430,590 Z" strokeWidth="1.5" className="text-cyan-400" />

            {/* Secondary Hill Top Right */}
            <path d="M950,150 C1050,80 1200,90 1300,160 C1400,230 1380,350 1280,380 C1180,410 1040,360 980,280 C930,220 880,190 950,150 Z" strokeWidth="1.5" />
            <path d="M1020,170 C1090,120 1200,130 1260,180 C1320,230 1300,310 1230,330 C1160,350 1070,320 1030,260 C1000,220 970,200 1020,170 Z" />
            <path d="M1080,190 C1120,160 1190,170 1220,200 C1250,230 1240,280 1190,290 C1140,300 1090,280 1070,250 C1050,220 1050,210 1080,190 Z" />
          </g>

          {/* Technical Topographic Text Markings */}
          <g className="text-white/60 font-mono text-[9px] tracking-wider" fill="currentColor">
            <text x="650" y="410">+920m [RIDGE]</text>
            <text x="610" y="530">+1040m [PEAK_01]</text>
            <text x="1220" y="195">+640m</text>
            <text x="150" y="720">CONTOUR INTERVAL: 20m</text>
            <text x="150" y="735">DATUM: WGS-84 / ELEV_SRTM</text>
            <text x="1100" y="820">SECTOR: 12°58'23"N 77°35'45"E</text>
          </g>
        </svg>
      </motion.div>

      {/* 3. Perimeter Technical Telemetry Banner */}
      <motion.div 
        style={{ y: telemetryY }}
        className="absolute inset-6 md:inset-10 flex flex-col justify-between font-mono text-[10px] text-white/50 tracking-widest uppercase pointer-events-none"
      >
        <div className="flex justify-between">
          <span className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-cyan-400 rounded-none animate-pulse" />
            TOPOGRAPHIC_SCHEMATIC // V2.1
          </span>
          <span>ELEV_SCALE: 1:25000</span>
        </div>
        <div className="flex justify-between">
          <span>SURFACE: TERRAIN_CONTOURS</span>
          <span>GRID: 80x80_DRAFT</span>
        </div>
      </motion.div>

      {/* 4. Interactive Crosshairs + Elevation Probe */}
      <div className="mix-blend-difference absolute inset-0 z-20">
        <motion.div className="absolute top-0 left-0 w-full h-[1px] bg-white/20" style={{ y: smoothY }} />
        <motion.div className="absolute top-0 left-0 w-[1px] h-full bg-white/20" style={{ x: smoothX }} />
        
        {/* Dynamic coordinate readout tracking cursor */}
        <motion.div 
          className="absolute font-mono text-[9px] text-white/60 tracking-wider pl-3 pt-3"
          style={{ x: smoothX, y: smoothY }}
        >
          <span>SURVEY_PT // ELEV: +860m</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
