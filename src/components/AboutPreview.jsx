import { useState } from 'react';
import { portfolio } from '../data/portfolio';
import TopographicBlueprintBg from './ui/about-backgrounds/TopographicBlueprintBg';
import NeuralBlueprintBg from './ui/about-backgrounds/NeuralBlueprintBg';
import CelestialRadarBg from './ui/about-backgrounds/CelestialRadarBg';
import SystemsCADBg from './ui/about-backgrounds/SystemsCADBg';

const MODES = [
  {
    id: 'topographic',
    name: '1. Topographic Elevation',
    badge: 'Cartographic',
    component: TopographicBlueprintBg,
    description: 'Concentric elevation contour lines, coordinate elevations (+840m, +1040m peak), and surveying probe. Matches the world map radar aesthetic with localized terrain drafting.'
  },
  {
    id: 'neural',
    name: '2. Neural Architecture',
    badge: 'AI & Systems',
    component: NeuralBlueprintBg,
    description: 'Technical transformer block blueprint with attention equations (Softmax(QK^T/√d_k)V), algorithmic information theory watermark (Marcus Hutter), and tensor dimension annotations.'
  },
  {
    id: 'radar',
    name: '3. Navigational Radar',
    badge: 'Navigation',
    component: CelestialRadarBg,
    description: 'Navigational drafting compass with azimuth degree markings, concentric radar range rings, and Bengaluru (12°58\'N 77°35\'E) / IIT Madras coordinates.'
  },
  {
    id: 'systems',
    name: '4. Systems CAD / Circuit',
    badge: 'Kernel / Arch',
    component: SystemsCADBg,
    description: 'PCB/motherboard logic schematic with 45° bus routes, chip footprint annotations (Arch Linux x86_64, CUDA runtime), and technical dimension callouts.'
  }
];

export default function AboutPreview({ initialMode = 'topographic', onSelectMode }) {
  // Normalize initialMode
  const resolveMode = (m) => {
    if (m === '1' || m === 'topographic') return 'topographic';
    if (m === '2' || m === 'neural') return 'neural';
    if (m === '3' || m === 'radar') return 'radar';
    if (m === '4' || m === 'systems') return 'systems';
    return 'topographic';
  };

  const [activeMode, setActiveMode] = useState(resolveMode(initialMode));

  const currentConfig = MODES.find((m) => m.id === activeMode) || MODES[0];
  const BackgroundComponent = currentConfig.component;

  const handleSelect = (id) => {
    setActiveMode(id);
    if (onSelectMode) onSelectMode(id);
    const newUrl = `${window.location.pathname}?about-preview=${id}`;
    window.history.pushState(null, '', newUrl);
  };

  const { about, name } = portfolio;

  return (
    <div className="relative min-h-screen bg-background text-primary selection:bg-accent selection:text-white flex flex-col justify-center overflow-x-hidden">
      {/* 1. Active Interactive Background */}
      <BackgroundComponent />

      {/* 2. Floating Preview Mode Switcher */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl bg-surface/90 backdrop-blur-xl border border-border px-4 py-3 shadow-2xl flex flex-wrap items-center justify-between gap-3 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-primary/70 font-bold">About Background Preview:</span>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          {MODES.map((m) => {
            const isActive = m.id === activeMode;
            return (
              <button
                key={m.id}
                onClick={() => handleSelect(m.id)}
                className={`text-xs px-2.5 py-1 transition-all ${
                  isActive
                    ? 'bg-accent text-white font-bold border border-accent'
                    : 'text-secondary hover:text-white border border-border/60 hover:border-border'
                }`}
              >
                {m.name}
              </button>
            );
          })}
        </nav>

        <a 
          href="/" 
          className="text-xs text-red-400 hover:text-red-300 font-bold border border-red-500/30 px-2 py-1 transition-colors"
        >
          Exit Preview
        </a>
      </header>

      {/* 3. Concept Description Banner */}
      <aside className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl bg-surface/85 backdrop-blur-md border border-border px-4 py-2.5 text-center font-mono text-xs text-secondary shadow-lg">
        <span className="text-accent font-bold uppercase tracking-wider mr-2">[{currentConfig.badge}]</span>
        <span>{currentConfig.description}</span>
      </aside>

      {/* 4. Full About Page Content */}
      <section className="relative z-10 w-full min-h-screen flex flex-col justify-center py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-space font-bold mb-8 md:mb-16 tracking-tight text-center md:text-left">
          About Me
        </h2>
        
        <div className="grid md:grid-cols-12 gap-6 md:gap-8">
          
          {/* Main Intro Card */}
          <div className="md:col-span-8 bg-surface/50 backdrop-blur-sm border border-border p-8 md:p-10 relative group overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
             
             <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
               <div className="w-32 h-32 md:w-48 md:h-48 flex-shrink-0 border border-border p-1 bg-surface/50">
                 <img 
                    src="/profile.jpg" 
                    alt="Profile" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                 />
               </div>
               
               <div>
                 <h3 className="text-xl md:text-2xl font-bold mb-4 font-space text-primary">System, Code, and Learning.</h3>
                 <p className="text-secondary leading-relaxed text-balance text-sm md:text-base">
                   {about.intro}
                 </p>
               </div>
             </div>
          </div>
          
          {/* Metadata Bento Grid */}
          <div className="md:col-span-4 grid grid-cols-1 gap-4 md:gap-6">
             <div className="bg-surface/50 backdrop-blur-sm border border-border p-6 flex flex-col justify-center group hover:border-accent/50 transition-colors">
               <span className="block text-xs font-mono text-accent mb-2 uppercase tracking-widest">Focus</span>
               <span className="font-medium text-lg leading-snug">{about.focus}</span>
             </div>
             
             <div className="grid grid-cols-2 gap-4 md:gap-6">
               <div className="bg-surface/50 backdrop-blur-sm border border-border p-5 flex flex-col justify-center group hover:border-accent/50 transition-colors">
                 <span className="block text-xs font-mono text-accent mb-2 uppercase tracking-widest">Location</span>
                 <span className="font-medium text-sm">{about.location}</span>
               </div>
               <div className="bg-surface/50 backdrop-blur-sm border border-border p-5 flex flex-col justify-center group hover:border-accent/50 transition-colors">
                 <span className="block text-xs font-mono text-accent mb-2 uppercase tracking-widest">Status</span>
                 <span className="font-medium text-sm">{about.experience}</span>
               </div>
             </div>
             
             <div className="bg-surface/50 backdrop-blur-sm border border-border p-6 flex flex-col justify-center group hover:border-accent/50 transition-colors">
               <span className="block text-xs font-mono text-accent mb-2 uppercase tracking-widest">Interests</span>
               <span className="font-medium text-sm leading-snug">{about.interests}</span>
             </div>
          </div>
          
          {/* Quotes Row */}
          <div className="md:col-span-5 bg-surface/50 backdrop-blur-sm border border-border p-8 relative group overflow-hidden flex flex-col justify-center hover:border-accent/50 transition-colors">
            <span className="text-6xl text-accent/10 absolute top-2 left-4 font-serif">"</span>
            <p className="text-lg md:text-xl font-space italic text-primary/90 z-10 relative mt-2 text-balance">
              Compression is Intelligence
            </p>
            <span className="block mt-4 text-xs font-mono text-secondary uppercase tracking-widest">Marcus Hutter</span>
          </div>

          <div className="md:col-span-7 bg-surface/50 backdrop-blur-sm border border-border p-8 relative group overflow-hidden flex flex-col justify-center hover:border-accent/50 transition-colors">
            <span className="text-6xl text-accent/10 absolute top-2 left-4 font-serif">"</span>
            <p className="text-lg md:text-xl font-space italic text-primary/90 z-10 relative mt-2 text-balance">
              The best time to plant a tree was 20 years ago, but the second best time is now.
            </p>
            <span className="block mt-4 text-xs font-mono text-secondary uppercase tracking-widest">Chinese Proverb</span>
          </div>
          
        </div>
      </section>
    </div>
  );
}