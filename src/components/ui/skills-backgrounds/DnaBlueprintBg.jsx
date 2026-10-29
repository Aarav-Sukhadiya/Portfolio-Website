import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function DnaBlueprintBg({ style }) {
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

  // Pre-calculate DNA helical coordinates for 2.5 full helical cycles (0 to 900px)
  // Period = 300px, 10 base-pairs per turn (every 30px)
  const basePairs = [];
  const totalSteps = 32;
  const startY = 30;
  const stepY = 28;
  const amplitude = 130;
  const period = 280;
  const centerX = 720;

  for (let i = 0; i <= totalSteps; i++) {
    const y = startY + i * stepY;
    const angle = (y / period) * 2 * Math.PI;
    const x1 = centerX + amplitude * Math.sin(angle);
    const x2 = centerX - amplitude * Math.sin(angle);
    const z = Math.cos(angle); // z > 0: foreground, z < 0: background
    const bpTypes = ['A-T', 'G-C', 'T-A', 'C-G', 'G-C', 'A-T'];
    const type = bpTypes[i % bpTypes.length];
    const isGC = type === 'G-C' || type === 'C-G';
    basePairs.push({ y, x1, x2, z, type, isGC, index: i + 1 });
  }

  // Generate SVG smooth path for strand 1 and strand 2
  const strand1Points = [];
  const strand2Points = [];
  for (let y = 0; y <= 900; y += 10) {
    const angle = (y / period) * 2 * Math.PI;
    strand1Points.push(`${centerX + amplitude * Math.sin(angle)},${y}`);
    strand2Points.push(`${centerX - amplitude * Math.sin(angle)},${y}`);
  }
  const strand1Path = `M ${strand1Points.join(' L ')}`;
  const strand2Path = `M ${strand2Points.join(' L ')}`;

  return (
    <motion.div style={style} className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Blueprint Technical Drafting Grid */}
      <div 
        className="absolute inset-0 opacity-[0.035]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)', 
          backgroundSize: '80px 80px' 
        }} 
      />

      {/* 2. DNA Double Helix Technical Drafting Blueprint */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-[0.14]" 
        viewBox="0 0 1440 900" 
        preserveAspectRatio="xMidYMid slice"
        fill="none" 
        stroke="currentColor"
      >
        <g className="text-white">
          {/* Central Reference Axis */}
          <line x1={centerX} y1="0" x2={centerX} y2="900" strokeWidth="0.8" strokeDasharray="8 8" className="text-blue-400/40" />

          {/* Major / Minor Groove Boundary Guidelines */}
          <line x1={centerX - amplitude} y1="0" x2={centerX - amplitude} y2="900" strokeWidth="0.5" strokeDasharray="3 6" className="text-white/20" />
          <line x1={centerX + amplitude} y1="0" x2={centerX + amplitude} y2="900" strokeWidth="0.5" strokeDasharray="3 6" className="text-white/20" />

          {/* Base Pair Rungs (Connecting Strands) with Hydrogen Bond Representation */}
          {basePairs.map((bp) => {
            const isFore = bp.z >= 0;
            return (
              <g key={bp.index} opacity={isFore ? 0.9 : 0.35}>
                {/* Rung bar */}
                <line 
                  x1={bp.x1} 
                  y1={bp.y} 
                  x2={bp.x2} 
                  y2={bp.y} 
                  strokeWidth={isFore ? (bp.isGC ? 1.8 : 1.2) : 1}
                  strokeDasharray={bp.isGC ? "6 2 6 2 6" : "8 3 8"}
                />

                {/* Nucleotide Node Spheres */}
                <circle cx={bp.x1} cy={bp.y} r={isFore ? 3.5 : 2} fill="currentColor" />
                <circle cx={bp.x2} cy={bp.y} r={isFore ? 3.5 : 2} fill="currentColor" />

                {/* Technical Base Callouts on prominent rungs */}
                {bp.index % 4 === 1 && (
                  <text 
                    x={bp.x2 + (bp.x1 > bp.x2 ? -14 : 14)} 
                    y={bp.y + 3} 
                    fontSize="8" 
                    fontFamily="monospace" 
                    fill="currentColor" 
                    textAnchor={bp.x1 > bp.x2 ? "end" : "start"}
                    className="opacity-70"
                  >
                    {bp.type} [{bp.isGC ? '3H' : '2H'}]
                  </text>
                )}
              </g>
            );
          })}

          {/* Sugar-Phosphate Helical Backbones */}
          {/* Strand 1 */}
          <path d={strand1Path} strokeWidth="1.8" className="text-cyan-400" />
          {/* Strand 2 */}
          <path d={strand2Path} strokeWidth="1.8" strokeDasharray="6 2" className="text-white" />

          {/* Dimension Callouts: Diameter (2.0 nm / 20 Å) */}
          <g className="text-white/60">
            {/* Top Diameter Dimension Line */}
            <line x1={centerX - amplitude} y1="120" x2={centerX + amplitude} y2="120" strokeWidth="1" />
            <line x1={centerX - amplitude} y1="112" x2={centerX - amplitude} y2="128" strokeWidth="1" />
            <line x1={centerX + amplitude} y1="112" x2={centerX + amplitude} y2="128" strokeWidth="1" />
            <text x={centerX} y="112" fontSize="9" fontFamily="monospace" fill="currentColor" textAnchor="middle">
              HELIX_DIAMETER: 2.0 nm (20.0 Å)
            </text>

            {/* Pitch Dimension Line (3.4 nm per turn) */}
            <line x1={centerX + amplitude + 60} y1="210" x2={centerX + amplitude + 60} y2="490" strokeWidth="1" />
            <line x1={centerX + amplitude + 52} y1="210" x2={centerX + amplitude + 68} y2="210" strokeWidth="1" />
            <line x1={centerX + amplitude + 52} y1="490" x2={centerX + amplitude + 68} y2="490" strokeWidth="1" />
            <text 
              x={centerX + amplitude + 75} 
              y="355" 
              fontSize="9" 
              fontFamily="monospace" 
              fill="currentColor" 
              transform={`rotate(90, ${centerX + amplitude + 75}, 355)`}
              textAnchor="middle"
            >
              HELICAL_PITCH: 3.4 nm [10.4 BP / TURN]
            </text>

            {/* Major & Minor Groove Callouts */}
            <text x={centerX - amplitude - 20} y="340" fontSize="8" fontFamily="monospace" fill="currentColor" textAnchor="end">
              ◄ MAJOR GROOVE: 2.2 nm (22 Å)
            </text>
            <text x={centerX - amplitude - 20} y="470" fontSize="8" fontFamily="monospace" fill="currentColor" textAnchor="end">
              ◄ MINOR GROOVE: 1.2 nm (12 Å)
            </text>

            {/* Backbone Polarity Indicators */}
            <text x={centerX - amplitude - 10} y="40" fontSize="9" fontFamily="monospace" fill="currentColor">
              5' [PHOSPHATE] ──►
            </text>
            <text x={centerX + amplitude + 10} y="40" fontSize="9" fontFamily="monospace" fill="currentColor">
              ◄── 3' [HYDROXYL]
            </text>
          </g>

          {/* Molecular Crystallography Blueprint Annotations */}
          <g className="text-white/40 font-mono text-[9px] tracking-wider" fill="currentColor">
            <text x="80" y="240">CONFORMATION: B-DNA DUPLEX</text>
            <text x="80" y="258">TWIST ANGLE: 34.3° / BASE PAIR</text>
            <text x="80" y="276">AXIAL RISE (h): 0.34 nm (3.4 Å)</text>
            <text x="80" y="294">BASE TILT: -1.2° // PROPELLER TWIST: 16°</text>
            <text x="80" y="312">BASE STACKING FREE ENERGY: ΔG° = -1.4 kcal/mol</text>

            <text x="1080" y="680">X-RAY DIFFRACTION GEOMETRY</text>
            <text x="1080" y="698">FRANKLIN-GOSLING PATTERN REF: #51</text>
            <text x="1080" y="716">CYLINDRICAL BESSEL ORDER: J_n(2π r R)</text>
            <text x="1080" y="734">FIBER SYMMETRY: D₁₀ 10-FOLD HELIX</text>
            <text x="1080" y="752">SOLVATION SHELL: 20 H₂O / BP</text>
          </g>
        </g>
      </svg>

      {/* 3. Perimeter Technical Telemetry */}
      <div className="absolute inset-6 md:inset-10 flex flex-col justify-between opacity-30 font-mono text-[10px] text-white tracking-widest uppercase">
        <div className="flex justify-between">
          <span className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-cyan-400 rounded-none animate-pulse" />
            BIOMOLECULAR_SCHEMATIC // B-DNA_SPEC_V4.2
          </span>
          <span>HELIX_RATIO: 10.4 BP / 360°</span>
        </div>
        <div className="flex justify-between">
          <span>MODEL: RIGHT-HANDED DOUBLE HELIX</span>
          <span>DRAFTING: WATSON-CRICK CANONICAL</span>
        </div>
      </div>

      {/* 4. Interactive Crosshairs + Nucleotide Scanning Probe */}
      <div className="mix-blend-difference absolute inset-0 z-20">
        <motion.div className="absolute top-0 left-0 w-full h-[1px] bg-white/20" style={{ y: smoothY }} />
        <motion.div className="absolute top-0 left-0 w-[1px] h-full bg-white/20" style={{ x: smoothX }} />
        
        {/* Dynamic probe readout tracking cursor */}
        <motion.div 
          className="absolute font-mono text-[9px] text-white/50 tracking-wider pl-3 pt-3"
          style={{ x: smoothX, y: smoothY }}
        >
          <span>NUCLEOTIDE_PROBE // PAIR: [GUANINE-CYTOSINE] // 3x H-BONDS // DIST: 2.84 Å</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
