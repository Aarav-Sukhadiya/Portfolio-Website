import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function OrbitalTrajectoryBg({ style }) {
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

  // Center focus coordinates (Gravitational Primary Body / Earth)
  const focusX = 620;
  const focusY = 460;

  return (
    <motion.div style={style} className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Technical Drafting Blueprint Grid */}
      <div 
        className="absolute inset-0 opacity-[0.035]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)', 
          backgroundSize: '80px 80px' 
        }} 
      />

      {/* 2. Keplerian Astrodynamics & Orbital Trajectory Vector Blueprint */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-[0.14]" 
        viewBox="0 0 1440 900" 
        preserveAspectRatio="xMidYMid slice"
        fill="none" 
        stroke="currentColor"
      >
        <g className="text-white">
          {/* Polar Graticule Circles Centered on Primary Body */}
          <circle cx={focusX} cy={focusY} r="80" strokeWidth="0.8" strokeDasharray="4 4" className="text-white/30" />
          <circle cx={focusX} cy={focusY} r="180" strokeWidth="0.8" strokeDasharray="6 6" className="text-white/25" />
          <circle cx={focusX} cy={focusY} r="320" strokeWidth="0.8" strokeDasharray="8 8" className="text-white/20" />
          <circle cx={focusX} cy={focusY} r="480" strokeWidth="0.8" strokeDasharray="10 10" className="text-white/15" />

          {/* Radial Azimuth Angle Lines (Every 30 degrees) */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x2 = focusX + 520 * Math.cos(rad);
            const y2 = focusY + 520 * Math.sin(rad);
            return (
              <g key={deg} opacity="0.25">
                <line x1={focusX} y1={focusY} x2={x2} y2={y2} strokeWidth="0.6" strokeDasharray="3 9" />
                <text 
                  x={focusX + 535 * Math.cos(rad)} 
                  y={focusY + 535 * Math.sin(rad) + 3} 
                  fontSize="7" 
                  fontFamily="monospace" 
                  fill="currentColor" 
                  textAnchor="middle"
                >
                  {deg}°
                </text>
              </g>
            );
          })}

          {/* Primary Gravitational Attractor (Focus 1) */}
          <circle cx={focusX} cy={focusY} r="36" strokeWidth="1.5" className="text-blue-400" />
          <circle cx={focusX} cy={focusY} r="4" fill="currentColor" />
          <line x1={focusX - 48} y1={focusY} x2={focusX + 48} y2={focusY} strokeWidth="0.8" />
          <line x1={focusX} y1={focusY - 48} x2={focusX} y2={focusY + 48} strokeWidth="0.8" />
          <text x={focusX + 10} y={focusY - 42} fontSize="8" fontFamily="monospace" fill="currentColor">
            PRIMARY_BODY [EARTH μ = 3.986e5 km³/s²]
          </text>

          {/* Kepler's Second Law Shaded Equal-Area Sector (Sweep Δt) */}
          <path 
            d={`M ${focusX} ${focusY} L ${focusX + 220} ${focusY - 140} A 360 210 15 0 0 ${focusX + 310} ${focusY - 40} Z`} 
            fill="rgba(56, 189, 248, 0.08)" 
            stroke="none" 
          />
          <text x={focusX + 220} y={focusY - 80} fontSize="7.5" fontFamily="monospace" fill="currentColor" className="text-cyan-300">
            EQUAL AREA SWEEP: dA/dt = const
          </text>

          {/* Main Elliptical Keplerian Transfer Orbit */}
          {/* Rotated ellipse: center (focusX + 110, focusY), rx=360, ry=210, rotation=15 deg */}
          <ellipse 
            cx={focusX + 110} 
            cy={focusY} 
            rx="360" 
            ry="210" 
            transform={`rotate(15, ${focusX + 110}, ${focusY})`}
            strokeWidth="1.8" 
            className="text-cyan-400" 
          />

          {/* Low Earth Circular Orbit (LEO) Reference */}
          <circle cx={focusX} cy={focusY} r="140" strokeWidth="1" strokeDasharray="4 4" className="text-white/40" />
          <text x={focusX - 135} y={focusY + 120} fontSize="8" fontFamily="monospace" fill="currentColor">
            LEO INJECTION ORBIT (h = 300 km)
          </text>

          {/* Geosynchronous Target Orbit (GEO) Arc */}
          <circle cx={focusX} cy={focusY} r="420" strokeWidth="1.2" strokeDasharray="8 6" className="text-white/40" />
          <text x={focusX + 320} y={focusY - 260} fontSize="8" fontFamily="monospace" fill="currentColor">
            GEO TARGET ORBIT (r = 42,164 km)
          </text>

          {/* Periapsis Point (Closest Approach) */}
          <g className="text-white">
            <circle cx={focusX - 180} cy={focusY - 48} r="5" fill="currentColor" className="text-emerald-400" />
            <line x1={focusX - 180} y1={focusY - 48} x2={focusX - 180} y2={focusY - 100} strokeWidth="1.2" />
            {/* Velocity Vector arrow */}
            <line x1={focusX - 180} y1={focusY - 48} x2={focusX - 150} y2={focusY + 60} strokeWidth="1.8" className="text-emerald-400" />
            <polygon points={`${focusX - 150},${focusY + 60} ${focusX - 158},${focusY + 46} ${focusX - 144},${focusY + 49}`} fill="currentColor" className="text-emerald-400" />
            <text x={focusX - 280} y={focusY - 105} fontSize="8.5" fontFamily="monospace" fill="currentColor">
              PERIAPSIS (r_p = 6,678 km) // v_p = 10.15 km/s
            </text>
          </g>

          {/* Apoapsis Point (Farthest Distance) */}
          <g className="text-white">
            <circle cx={focusX + 450} cy={focusY + 120} r="5" fill="currentColor" className="text-amber-400" />
            <line x1={focusX + 450} y1={focusY + 120} x2={focusX + 450} y2={focusY + 160} strokeWidth="1.2" />
            {/* Velocity Vector arrow */}
            <line x1={focusX + 450} y1={focusY + 120} x2={focusX + 420} y2={focusY + 20} strokeWidth="1.8" className="text-amber-400" />
            <polygon points={`${focusX + 420},${focusY + 20} ${focusX + 434},${focusY + 31} ${focusX + 420},${focusY + 35}`} fill="currentColor" className="text-amber-400" />
            <text x={focusX + 380} y={focusY + 175} fontSize="8.5" fontFamily="monospace" fill="currentColor">
              APOAPSIS (r_a = 42,164 km) // v_a = 1.61 km/s
            </text>
          </g>

          {/* State Vector & True Anomaly Line (Current Satellite Position) */}
          <g className="text-cyan-300">
            <line x1={focusX} y1={focusY} x2={focusX + 280} y2={focusY - 180} strokeWidth="1.2" strokeDasharray="5 3" />
            <circle cx={focusX + 280} cy={focusY - 180} r="6" fill="#38bdf8" />
            <text x={focusX + 295} y={focusY - 185} fontSize="9" fontFamily="monospace" fill="currentColor">
              SATELLITE_SV // TRUE ANOMALY ν = 114.2°
            </text>
          </g>

          {/* Astrodynamics Formula Annotations */}
          <g className="text-white/40 font-mono text-[9px] tracking-wider" fill="currentColor">
            <text x="80" y="210">KEPLERIAN ORBITAL MECHANICS // FORMULATION</text>
            <text x="80" y="230">VIS-VIVA: v² = μ (2/r - 1/a)</text>
            <text x="80" y="250">ORBIT EQUATION: r(θ) = p / (1 + e·cos θ)</text>
            <text x="80" y="270">SPECIFIC ANGULAR MOMENTUM: h = √(μ·p) = 52,140 km²/s</text>
            <text x="80" y="290">PERIOD: T = 2π√(a³/μ) = 10.53 HOURS</text>

            <text x="1060" y="680">ORBITAL ELEMENTS MATRIX [J2000]</text>
            <text x="1060" y="700">SEMI-MAJOR AXIS (a): 24,421.0 km</text>
            <text x="1060" y="720">ECCENTRICITY (e): 0.7268 (ELLIPTICAL)</text>
            <text x="1060" y="740">INCLINATION (i): 28.50°</text>
            <text x="1060" y="760">RAAN (Ω): 45.00° // ARG PERIGEE (ω): 112.4°</text>
            <text x="1060" y="780">DELTA-V BUDGET: Δv_TOTAL = 3.939 km/s</text>
          </g>
        </g>
      </svg>

      {/* 3. Perimeter Technical Telemetry */}
      <div className="absolute inset-6 md:inset-10 flex flex-col justify-between opacity-30 font-mono text-[10px] text-white tracking-widest uppercase">
        <div className="flex justify-between">
          <span className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-none animate-pulse" />
            ASTRODYNAMICS_SCHEMATIC // KEPLER_SPEC_V3
          </span>
          <span>FRAME: INERTIAL_ECI_J2000</span>
        </div>
        <div className="flex justify-between">
          <span>PROPAGATION: 2-BODY_PERTURBED (J2_ZONAL)</span>
          <span>TRAJECTORY: GTO_TRANSFER_ELLIPSE</span>
        </div>
      </div>

      {/* 4. Interactive Crosshairs + Orbital Telemetry Probe */}
      <div className="mix-blend-difference absolute inset-0 z-20">
        <motion.div className="absolute top-0 left-0 w-full h-[1px] bg-white/20" style={{ y: smoothY }} />
        <motion.div className="absolute top-0 left-0 w-[1px] h-full bg-white/20" style={{ x: smoothX }} />
        
        {/* Dynamic probe readout tracking cursor */}
        <motion.div 
          className="absolute font-mono text-[9px] text-white/50 tracking-wider pl-3 pt-3"
          style={{ x: smoothX, y: smoothY }}
        >
          <span>TRAJECTORY_PROBE // RADIUS: 28,410 km // VELOCITY: 4.82 km/s // FLIGHT_PATH_ANGLE: +12.4°</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
