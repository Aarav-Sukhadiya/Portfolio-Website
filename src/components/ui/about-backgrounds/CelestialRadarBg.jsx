import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CelestialRadarBg() {
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

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Subtle Radial / Drafting Grid */}
      <div 
        className="absolute inset-0 opacity-[0.035]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)', 
          backgroundSize: '120px 120px' 
        }} 
      />

      {/* 2. Large Navigational Blueprint Radar / Compass */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-[0.09]" 
        viewBox="0 0 1440 900" 
        preserveAspectRatio="xMidYMid slice"
        fill="none" 
        stroke="currentColor"
      >
        {/* Main Central Compass Array */}
        <g transform="translate(720, 450)" className="text-white" strokeWidth="1">
          {/* Range Rings */}
          <circle r="120" strokeDasharray="3 3" />
          <circle r="220" />
          <circle r="320" strokeDasharray="6 6" />
          <circle r="420" strokeWidth="1.5" />
          <circle r="435" strokeDasharray="2 4" />
          
          {/* Cardinal & Intercardinal Axis Lines */}
          <line x1="-480" y1="0" x2="480" y2="0" strokeDasharray="4 4" />
          <line x1="0" y1="-480" x2="0" y2="480" strokeDasharray="4 4" />
          <line x1="-340" y1="-340" x2="340" y2="340" opacity="0.4" />
          <line x1="-340" y1="340" x2="340" y2="-340" opacity="0.4" />

          {/* Degree Ticks around the 420px ring */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = Math.cos(rad) * 410;
            const y1 = Math.sin(rad) * 410;
            const x2 = Math.cos(rad) * 430;
            const y2 = Math.sin(rad) * 430;
            return (
              <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="2" />
            );
          })}

          {/* Degree Labels */}
          <g className="font-mono text-[9px] fill-white text-center" stroke="none">
            <text x="0" y="-445" textAnchor="middle" className="font-bold fill-accent">000° [N]</text>
            <text x="450" y="5" textAnchor="start">090° [E]</text>
            <text x="0" y="460" textAnchor="middle">180° [S]</text>
            <text x="-450" y="5" textAnchor="end">270° [W]</text>
          </g>

          {/* Navigational Coordinate Waypoints */}
          <g className="font-mono text-[8px] fill-white/70" stroke="none">
            <text x="-200" y="-140">WP_01: BENGALURU [12°58'N 77°35'E]</text>
            <text x="-200" y="-125">ALT: 920m ASL // SCALER_CAMPUS</text>
            
            <text x="80" y="160">WP_02: IIT_MADRAS [12°59'N 80°14'E]</text>
            <text x="80" y="175">BS_DATA_SCIENCE // CONCURRENT</text>
          </g>
        </g>
      </svg>

      {/* 3. Perimeter Technical Telemetry */}
      <div className="absolute inset-6 md:inset-10 flex flex-col justify-between opacity-30 font-mono text-[10px] text-white tracking-widest uppercase">
        <div className="flex justify-between">
          <span className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-accent rounded-none animate-pulse" />
            RADAR_NAV_DISPLAY // AZIMUTH_SYS
          </span>
          <span>RANGE_RING: 100NM_SCALE</span>
        </div>
        <div className="flex justify-between">
          <span>LAT/LON: 12.9716° N, 77.5946° E</span>
          <span>HEADING: 358°_TRUE</span>
        </div>
      </div>

      {/* 4. Mouse Interactive Targeting Crosshairs */}
      <div className="mix-blend-difference absolute inset-0 z-20">
        <motion.div className="absolute top-0 left-0 w-full h-[1px] bg-white/20" style={{ y: smoothY }} />
        <motion.div className="absolute top-0 left-0 w-[1px] h-full bg-white/20" style={{ x: smoothX }} />
        
        <motion.div 
          className="absolute font-mono text-[9px] text-white/50 tracking-wider pl-3 pt-3"
          style={{ x: smoothX, y: smoothY }}
        >
          <span>BEARING_LOCK // TARGET_TRACK</span>
        </motion.div>
      </div>
    </div>
  );
}