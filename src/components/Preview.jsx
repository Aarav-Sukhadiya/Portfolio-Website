import React, { useEffect, useRef } from 'react';
import { portfolio } from '../data/portfolio';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { motion, useMotionValue } from 'framer-motion';

function StaticProjectCard({ project, idx, bentoClasses }) {
  const gridClass = bentoClasses[idx % bentoClasses.length];
  return (
    <div className={`group perspective-[1000px] w-full h-full ${gridClass}`}>
      <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-xl hover:shadow-2xl">
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] p-5 md:p-6 border border-border bg-background flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start mb-2 flex-shrink-0">
            <span className="font-mono text-accent text-lg font-bold">{(idx + 1).toString().padStart(2, '0')}</span>
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xl md:text-2xl font-bold mb-2 line-clamp-1">{project.name}</h4>
            <p className="text-secondary text-sm md:text-base line-clamp-2">{project.description}</p>
          </div>
        </div>
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] p-5 md:p-6 border border-border bg-surface flex flex-col pointer-events-auto overflow-hidden">
          <div className="flex justify-between items-start mb-3 flex-shrink-0">
            <h4 className="text-base md:text-lg font-bold line-clamp-1 flex-grow pr-2">{project.name}</h4>
            <div className="flex gap-3 z-50 flex-shrink-0">
              <a href={project.github || '#'} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent transition-colors"><FaGithub className="w-5 h-5" /></a>
            </div>
          </div>
          <div className="mb-2 flex-shrink-0 hidden md:block overflow-hidden">
            <span className="block text-xs font-mono text-primary/60 mb-0.5">Challenge</span>
            <p className="text-secondary text-xs line-clamp-2">{project.challenge}</p>
          </div>
          <div className="mb-3 flex-grow overflow-hidden">
            <span className="block text-xs font-mono text-primary/60 mb-0.5">Outcome</span>
            <p className="text-secondary text-xs line-clamp-2">{project.outcome}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------
// 1. Scanner Glow + Crosshairs
// ---------------------------------------------
export function GlowCrosshairsBg() {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  useEffect(() => {
    const handleMouseMove = (e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div 
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[100px] mix-blend-screen"
        style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
      />
      <div className="mix-blend-difference absolute inset-0">
        <motion.div className="absolute top-0 left-0 w-full h-[1px] bg-white/20" style={{ y: mouseY }} />
        <motion.div className="absolute top-0 left-0 w-[1px] h-full bg-white/20" style={{ x: mouseX }} />
      </div>
    </div>
  );
}

// ---------------------------------------------
// 2. Blueprint Grid + Crosshairs
// ---------------------------------------------
export function GridCrosshairsBg() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  useEffect(() => {
    const handleMouseMove = (e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Faint World Map */}
      <div className="absolute inset-0 z-0 opacity-[0.05] mix-blend-screen">
         <img src="/world-map.svg" className="absolute inset-0 w-full h-full object-cover object-center filter invert opacity-50" alt="World Map Radar" />
      </div>
      
      {/* Static Blueprint Grid */}
      <div 
        className="absolute inset-0 opacity-[0.04] z-10" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)', 
          backgroundSize: '100px 100px' 
        }} 
      />
      
      <div className="mix-blend-difference absolute inset-0 z-20">
        <motion.div className="absolute top-0 left-0 w-full h-[1px] bg-white/30" style={{ y: mouseY }} />
        <motion.div className="absolute top-0 left-0 w-[1px] h-full bg-white/30" style={{ x: mouseX }} />
      </div>
    </div>
  );
}

// ---------------------------------------------
// 3. Cinematic Vignette + Crosshairs
// ---------------------------------------------
export function VignetteCrosshairsBg() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  useEffect(() => {
    const handleMouseMove = (e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.85)_100%)] z-10" />
      <div className="absolute inset-6 md:inset-10 z-20 opacity-40 flex flex-col justify-between">
         <div className="flex justify-between font-mono text-[10px] md:text-xs text-white uppercase tracking-widest">
           <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> REC</span>
           <span>SYS_ONLINE // V1.0</span>
         </div>
         <div className="flex justify-between font-mono text-[10px] md:text-xs text-white uppercase tracking-widest">
           <span>LAT: 45.901</span>
           <span>LOCKED</span>
         </div>
      </div>
      <div className="mix-blend-difference absolute inset-0 z-20">
        <motion.div className="absolute top-0 left-0 w-full h-[1px] bg-white/30" style={{ y: mouseY }} />
        <motion.div className="absolute top-0 left-0 w-[1px] h-full bg-white/30" style={{ x: mouseX }} />
      </div>
    </div>
  );
}


/* =========================================
   PREVIEW WRAPPER
   ========================================= */
export default function Preview({ mode }) {
  const bentoClasses = [
    "md:col-span-2 md:row-span-2",
    "md:col-span-2 md:row-span-1",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-1",
    "md:col-span-2 md:row-span-1",
    "md:col-span-2 md:row-span-1",
  ];

  let BackgroundComponent = null;
  if (mode === 'glow-crosshairs') BackgroundComponent = GlowCrosshairsBg;
  if (mode === 'grid-crosshairs') BackgroundComponent = GridCrosshairsBg;
  if (mode === 'vignette-crosshairs') BackgroundComponent = VignetteCrosshairsBg;

  return (
    <div className="w-full h-screen bg-background relative overflow-hidden flex flex-col justify-center font-sans">
       <div className="absolute inset-0 z-0">
         <img src="/hero-bg.jpg" className="w-full h-full object-cover" />
       </div>
       
       <div className="absolute inset-0 w-full h-full flex flex-col justify-center bg-surface/95 backdrop-blur-md z-20 px-4 md:px-0 py-12 md:py-0">
          
          {BackgroundComponent && <BackgroundComponent />}

          <div className="container mx-auto px-2 md:px-6 max-w-6xl w-full flex flex-col h-full justify-center relative z-10 pointer-events-none">
            <div className="flex justify-between items-center mb-8 pointer-events-auto">
              <h2 className="text-4xl md:text-5xl font-space font-bold tracking-tight">Projects</h2>
              <a href="#" className="flex items-center gap-2 text-sm md:text-base font-mono border border-border px-3 md:px-5 py-2 hover:bg-surface transition-colors text-primary">
                <FaGithub className="w-4 h-4" />
                <span className="hidden md:inline">Show More Projects on Github</span>
                <span className="inline md:hidden">More on Github</span>
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-none md:grid-rows-[repeat(3,minmax(0,1fr))] gap-4 w-full h-auto md:h-[70vh] pointer-events-auto">
              {portfolio.projects.map((project, idx) => (
                <StaticProjectCard key={project.id} project={project} idx={idx} bentoClasses={bentoClasses} />
              ))}
            </div>
          </div>
       </div>
       
       {/* Navigation UI to switch between previews */}
       <div className="absolute top-4 left-4 z-50 flex flex-wrap gap-4 bg-black/90 p-4 border border-border rounded shadow-2xl pointer-events-auto items-center max-w-2xl">
          <span className="text-white/50 text-xs font-mono uppercase tracking-widest mr-2">Crosshair Pairs:</span>
          <a href="/?preview=glow-crosshairs" className={`text-sm font-mono hover:text-white transition-colors ${mode === 'glow-crosshairs' ? 'text-accent underline' : 'text-secondary'}`}>1. Glow</a>
          <a href="/?preview=grid-crosshairs" className={`text-sm font-mono hover:text-white transition-colors ${mode === 'grid-crosshairs' ? 'text-accent underline' : 'text-secondary'}`}>2. Blueprint Grid</a>
          <a href="/?preview=vignette-crosshairs" className={`text-sm font-mono hover:text-white transition-colors ${mode === 'vignette-crosshairs' ? 'text-accent underline' : 'text-secondary'}`}>3. Cinematic Vignette</a>
          <div className="w-px h-4 bg-border mx-2"></div>
          <a href="/" className="text-sm font-mono text-red-400 hover:text-red-300">Exit Preview</a>
       </div>
    </div>
  )
}
