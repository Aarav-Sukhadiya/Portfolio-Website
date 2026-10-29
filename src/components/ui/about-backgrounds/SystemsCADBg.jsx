import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function SystemsCADBg() {
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
      {/* 1. PCB Grid with 40px Drafting Pitch */}
      <div 
        className="absolute inset-0 opacity-[0.035]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)', 
          backgroundSize: '60px 60px' 
        }} 
      />

      {/* 2. Systems Architecture & Circuit Trace Vector Schematic */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-[0.09]" 
        viewBox="0 0 1440 900" 
        preserveAspectRatio="xMidYMid slice"
        fill="none" 
        stroke="currentColor"
      >
        <g className="text-white" strokeWidth="1">
          {/* Main SOC / CPU Package Blueprint */}
          <rect x="100" y="200" width="240" height="240" strokeWidth="1.5" />
          <rect x="120" y="220" width="200" height="200" strokeDasharray="4 4" />
          <text x="135" y="290" className="font-mono text-[12px] fill-white font-bold" stroke="none">SYSTEMS_CORE // 01</text>
          <text x="135" y="315" className="font-mono text-[9px] fill-white/80" stroke="none">OS: ARCH_LINUX_X86_64</text>
          <text x="135" y="335" className="font-mono text-[9px] fill-white/80" stroke="none">RUNTIME: PYTORCH + CUDA</text>
          <text x="135" y="355" className="font-mono text-[9px] fill-white/60" stroke="none">PIPELINE: DFdetect // VISION</text>
          <text x="135" y="375" className="font-mono text-[9px] fill-accent" stroke="none">STATUS: COMPILED_NATIVE</text>

          {/* Pin rows around CPU */}
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={i}>
              <line x1={80} y1={230 + i * 25} x2={100} y2={230 + i * 25} />
              <circle cx={75} cy={230 + i * 25} r={2} fill="white" />
              
              <line x1={340} y1={230 + i * 25} x2={360} y2={230 + i * 25} />
              <circle cx={365} cy={230 + i * 25} r={2} fill="white" />
            </g>
          ))}

          {/* 45-degree Circuit Bus Routing */}
          <path d="M365,255 L500,255 L560,315 L700,315" strokeWidth="1.5" />
          <path d="M365,280 L490,280 L550,340 L700,340" />
          <path d="M365,305 L480,305 L540,365 L700,365" />
          <path d="M365,330 L470,330 L530,390 L700,390" />
          
          {/* Memory / Cache Array on Right */}
          <g transform="translate(1080, 180)">
            <rect x="0" y="0" width="260" height="140" strokeWidth="1.5" />
            <text x="20" y="30" className="font-mono text-[11px] fill-white font-bold" stroke="none">UNIFIED_SYSTEM_MEMORY</text>
            <text x="20" y="55" className="font-mono text-[9px] fill-white/80" stroke="none">BANDWIDTH: 1024 GB/s</text>
            <text x="20" y="75" className="font-mono text-[9px] fill-white/80" stroke="none">TENSOR_CACHE: L1/L2 ZERO-COPY</text>
            <text x="20" y="95" className="font-mono text-[9px] fill-white/60" stroke="none">QUANT: 4-BIT AWQ // INT8</text>
            
            {/* Memory Banks */}
            <rect x="20" y="110" width="45" height="15" strokeDasharray="2 2" />
            <rect x="75" y="110" width="45" height="15" strokeDasharray="2 2" />
            <rect x="130" y="110" width="45" height="15" strokeDasharray="2 2" />
            <rect x="185" y="110" width="45" height="15" strokeDasharray="2 2" />
          </g>

          {/* Lower Bus & Telemetry Traces */}
          <path d="M75,380 L50,380 L30,400 L30,680 L200,680" strokeDasharray="3 3" />
          <text x="40" y="710" className="font-mono text-[9px] fill-white/70" stroke="none">PCIE_GEN5_X16 // DIRECT_STORAGE_LINK</text>

          {/* Technical Dimension Callouts */}
          <line x1="100" y1="460" x2="340" y2="460" />
          <line x1="100" y1="455" x2="100" y2="465" />
          <line x1="340" y1="455" x2="340" y2="465" />
          <text x="185" y="475" className="font-mono text-[8px] fill-white/60" stroke="none">DIM: 35.00mm</text>
        </g>
      </svg>

      {/* 3. Corner Telemetry Data */}
      <div className="absolute inset-6 md:inset-10 flex flex-col justify-between opacity-30 font-mono text-[10px] text-white tracking-widest uppercase">
        <div className="flex justify-between">
          <span className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-none animate-pulse" />
            SYSTEMS_CAD_TRACE // PCB_REV_B
          </span>
          <span>IMPEDANCE: 50_OHM_CONTROLLED</span>
        </div>
        <div className="flex justify-between">
          <span>LAYER: TOP_COPPER // SIGNAL_BUS</span>
          <span>FAB_SPEC: IPC-6012 CLASS 3</span>
        </div>
      </div>

      {/* 4. Mouse Interactive Crosshairs */}
      <div className="mix-blend-difference absolute inset-0 z-20">
        <motion.div className="absolute top-0 left-0 w-full h-[1px] bg-white/20" style={{ y: smoothY }} />
        <motion.div className="absolute top-0 left-0 w-[1px] h-full bg-white/20" style={{ x: smoothX }} />
        
        <motion.div 
          className="absolute font-mono text-[9px] text-white/50 tracking-wider pl-3 pt-3"
          style={{ x: smoothX, y: smoothY }}
        >
          <span>LOGIC_PROBE // SIGNAL: HIGH (3.3V)</span>
        </motion.div>
      </div>
    </div>
  );
}