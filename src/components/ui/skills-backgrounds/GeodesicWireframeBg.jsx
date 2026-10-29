import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function GeodesicWireframeBg({ style }) {
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

  // Center of 3D Icosahedron Projection
  const cx = 720;
  const cy = 460;
  const scale = 170;
  const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio 1.6180339887

  // Normalized 12 vertices of icosahedron
  const rawVertices = [
    [-1,  phi, 0], [ 1,  phi, 0], [-1, -phi, 0], [ 1, -phi, 0],
    [ 0, -1,  phi], [ 0,  1,  phi], [ 0, -1, -phi], [ 0,  1, -phi],
    [ phi, 0, -1], [ phi, 0,  1], [-phi, 0, -1], [-phi, 0,  1],
  ];

  // Rotate vertices slightly in 3D (Isometric tilt: yaw=25 deg, pitch=35 deg)
  const yaw = (25 * Math.PI) / 180;
  const pitch = (35 * Math.PI) / 180;

  const projVertices = rawVertices.map(([x, y, z]) => {
    // Rotate Y (yaw)
    const x1 = x * Math.cos(yaw) + z * Math.sin(yaw);
    const z1 = -x * Math.sin(yaw) + z * Math.cos(yaw);
    // Rotate X (pitch)
    const y2 = y * Math.cos(pitch) - z1 * Math.sin(pitch);
    const z2 = y * Math.sin(pitch) + z1 * Math.cos(pitch);

    return {
      px: cx + x1 * scale,
      py: cy - y2 * scale,
      pz: z2,
      raw: [x.toFixed(2), y.toFixed(2), z.toFixed(2)]
    };
  });

  // Standard 30 edges of an icosahedron connecting vertex pairs with distance ~ 2.0
  const edges = [
    [0, 1], [0, 5], [0, 7], [0, 10], [0, 11],
    [1, 5], [1, 7], [1, 8], [1, 9],
    [2, 3], [2, 4], [2, 6], [2, 10], [2, 11],
    [3, 4], [3, 6], [3, 8], [3, 9],
    [4, 5], [4, 9], [4, 11],
    [5, 9], [5, 11],
    [6, 7], [6, 8], [6, 10],
    [7, 8], [7, 10],
    [8, 9],
    [10, 11]
  ];

  return (
    <motion.div style={style} className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Isometric Technical Drafting Grid */}
      <div 
        className="absolute inset-0 opacity-[0.035]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)', 
          backgroundSize: '80px 80px' 
        }} 
      />

      {/* 2. Geodesic Polyhedron & Topological Geometry Blueprint */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-[0.14]" 
        viewBox="0 0 1440 900" 
        preserveAspectRatio="xMidYMid slice"
        fill="none" 
        stroke="currentColor"
      >
        <g className="text-white">
          {/* Circumscribed Sphere Guide Rings */}
          <circle cx={cx} cy={cy} r={scale * 1.9} strokeWidth="0.8" strokeDasharray="6 6" className="text-white/20" />
          <ellipse cx={cx} cy={cy} rx={scale * 1.9} ry={scale * 0.75} strokeWidth="0.8" strokeDasharray="4 6" className="text-white/20" />
          <ellipse cx={cx} cy={cy} rx={scale * 0.75} ry={scale * 1.9} strokeWidth="0.8" strokeDasharray="4 6" className="text-white/20" />

          {/* Golden Ratio Reference Construction Axes */}
          <line x1={cx - 360} y1={cy} x2={cx + 360} y2={cy} strokeWidth="0.6" strokeDasharray="10 5" className="text-white/30" />
          <line x1={cx} y1={cy - 360} x2={cx} y2={cy + 360} strokeWidth="0.6" strokeDasharray="10 5" className="text-white/30" />

          {/* Polyhedron Wireframe Edges */}
          {edges.map(([i1, i2], idx) => {
            const v1 = projVertices[i1];
            const v2 = projVertices[i2];
            const avgZ = (v1.pz + v2.pz) / 2;
            const isFore = avgZ > 0;

            return (
              <line 
                key={idx}
                x1={v1.px} 
                y1={v1.py} 
                x2={v2.px} 
                y2={v2.py} 
                strokeWidth={isFore ? 1.6 : 0.9}
                strokeDasharray={isFore ? "none" : "4 4"}
                className={isFore ? "text-cyan-400" : "text-white/40"}
              />
            );
          })}

          {/* Polyhedron Vertices */}
          {projVertices.map((v, i) => {
            const isFore = v.pz > 0;
            return (
              <g key={i}>
                <circle 
                  cx={v.px} 
                  cy={v.py} 
                  r={isFore ? 3.5 : 2} 
                  fill={isFore ? "#38bdf8" : "currentColor"} 
                  className={isFore ? "" : "opacity-40"}
                />
                {/* Vertex index tags */}
                {isFore && (
                  <text 
                    x={v.px + 7} 
                    y={v.py - 5} 
                    fontSize="7.5" 
                    fontFamily="monospace" 
                    fill="currentColor"
                    className="opacity-75"
                  >
                    V{i} [{v.raw.join(',')}]
                  </text>
                )}
              </g>
            );
          })}

          {/* Golden Ratio Dimensions Callout */}
          <g className="text-white/70">
            <text x={cx + 280} y={cy - 200} fontSize="8.5" fontFamily="monospace" fill="currentColor">
              GOLDEN_RATIO: φ = (1 + √5) / 2 = 1.6180339887
            </text>
            <text x={cx + 280} y={cy - 180} fontSize="8" fontFamily="monospace" fill="currentColor" className="opacity-60">
              CIRCUMRADIUS: R = a/4 √(10 + 2√5) ≈ 0.951 a
            </text>
            <text x={cx + 280} y={cy - 160} fontSize="8" fontFamily="monospace" fill="currentColor" className="opacity-60">
              DIHEDRAL ANGLE: θ = arccos(-√5/3) = 138°11'23"
            </text>
          </g>

          {/* Topological Invariants & Theorems */}
          <g className="text-white/40 font-mono text-[9px] tracking-wider" fill="currentColor">
            <text x="80" y="210">TOPOLOGICAL DRAFTING // REGULAR ICOSAHEDRON (20-HEDRON)</text>
            <text x="80" y="230">EULER CHARACTERISTIC: V - E + F = 12 - 30 + 20 = 2</text>
            <text x="80" y="250">GAUSS-BONNET INTEGRAL: ∬_M K dA = 2π·χ(M) = 4π</text>
            <text x="80" y="270">POINT GROUP SYMMETRY: I_h (FULL ICOSAHEDRAL GROUP, ORDER 120)</text>
            <text x="80" y="290">GEODESIC TESSELLATION: FREQUENCY ν = 2 DUAL SUBDIVISION</text>

            <text x="1060" y="680">TOPOLOGICAL MANIFOLD MATRIX</text>
            <text x="1060" y="700">VERTICES (V): 12 [DEGREE-5 REGULAR]</text>
            <text x="1060" y="720">EDGES (E): 30 [ISOTROPIC CHORD EQUAL]</text>
            <text x="1060" y="740">FACES (F): 20 EQUILATERAL TRIANGLES</text>
            <text x="1060" y="760">VOLUME: V = 5/12 (3 + √5) a³ ≈ 2.1817 a³</text>
            <text x="1060" y="780">DEHN INVARIANT: D(P) = 0 [DISSECTION DUAL]</text>
          </g>
        </g>
      </svg>

      {/* 3. Perimeter Technical Telemetry */}
      <div className="absolute inset-6 md:inset-10 flex flex-col justify-between opacity-30 font-mono text-[10px] text-white tracking-widest uppercase">
        <div className="flex justify-between">
          <span className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-none animate-pulse" />
            TOPOLOGY_SCHEMATIC // GEODESIC_POLYHEDRON_V3.8
          </span>
          <span>GEOMETRY: ICOSAHEDRAL DUAL</span>
        </div>
        <div className="flex justify-between">
          <span>PROJECTION: ISOMETRIC 3D WIREFRAME</span>
          <span>COORDINATES: GOLDEN RECTANGLE DODECAHEDRAL</span>
        </div>
      </div>

      {/* 4. Interactive Crosshairs + Topology Node Probe */}
      <div className="mix-blend-difference absolute inset-0 z-20">
        <motion.div className="absolute top-0 left-0 w-full h-[1px] bg-white/20" style={{ y: smoothY }} />
        <motion.div className="absolute top-0 left-0 w-[1px] h-full bg-white/20" style={{ x: smoothX }} />
        
        {/* Dynamic probe readout tracking cursor */}
        <motion.div 
          className="absolute font-mono text-[9px] text-white/50 tracking-wider pl-3 pt-3"
          style={{ x: smoothX, y: smoothY }}
        >
          <span>TOPOLOGY_PROBE // VERTEX: #11 // NORMAL: [+0.5257, +0.8506, +0.0000] // VALENCY: 5</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
