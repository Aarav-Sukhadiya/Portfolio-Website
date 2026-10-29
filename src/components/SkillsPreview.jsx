import { useState } from 'react';
import { portfolio } from '../data/portfolio';
import DnaBlueprintBg from './ui/skills-backgrounds/DnaBlueprintBg';
import OrbitalTrajectoryBg from './ui/skills-backgrounds/OrbitalTrajectoryBg';
import SpectralWaveformBg from './ui/skills-backgrounds/SpectralWaveformBg';
import GeodesicWireframeBg from './ui/skills-backgrounds/GeodesicWireframeBg';
import { 
  FaCode, FaServer, FaTools, FaLayerGroup,
  FaPython, FaReact, FaDocker, FaLinux, FaGitAlt, FaDatabase
} from 'react-icons/fa';
import { 
  SiCplusplus, SiNvidia, SiFastapi, SiPytorch, SiSqlite, 
  SiTailwindcss, SiHtml5, SiGradio 
} from 'react-icons/si';

// Icon mapping matching main Skills section
const skillIcons = {
  'Python': <FaPython className="w-5 h-5 text-[#3776AB]" />,
  'C++': <SiCplusplus className="w-5 h-5 text-[#00599C]" />,
  'CUDA': <SiNvidia className="w-5 h-5 text-[#76B900]" />,
  'SQL': <FaDatabase className="w-5 h-5 text-[#003B57]" />,
  'HTML': <SiHtml5 className="w-5 h-5 text-[#E34F26]" />,
  'Tailwind CSS': <SiTailwindcss className="w-5 h-5 text-[#06B6D4]" />,
  'React': <FaReact className="w-5 h-5 text-[#61DAFB]" />,
  'Gradio': <SiGradio className="w-5 h-5 text-[#FF7C00]" />,
  'PyTorch': <SiPytorch className="w-5 h-5 text-[#EE4C2C]" />,
  'FastAPI': <SiFastapi className="w-5 h-5 text-[#009688]" />,
  'SQLite': <SiSqlite className="w-5 h-5 text-[#003B57]" />,
  'Git': <FaGitAlt className="w-5 h-5 text-[#F05032]" />,
  'Docker': <FaDocker className="w-5 h-5 text-[#2496ED]" />,
  'Linux': <FaLinux className="w-5 h-5 text-[#FCC624]" />,
  'MCP': <FaTools className="w-5 h-5 text-accent" />
};

const SKILLS_MODES = [
  {
    id: 'spectral',
    name: '1. Spectral Waveform (Sine Slider)',
    badge: 'Harmonic DSP',
    component: SpectralWaveformBg,
    description: 'Fourier waveform blueprint with interactive horizontal-scrubbed sine slider bead riding the composite wave, harmonic decomposition (f₀, 2f₀, 3f₀), and FFT magnitude waterfall.'
  },
  {
    id: 'dna',
    name: '2. DNA Double Helix',
    badge: 'Biomolecular',
    component: DnaBlueprintBg,
    description: '3D DNA double helix blueprint with hydrogen-bonded base pairs (A-T, G-C), 3.4 nm helical pitch, 2.0 nm diameter dimension callouts, and nucleotide scanning probe.'
  },
  {
    id: 'orbital',
    name: '3. Orbital Trajectory',
    badge: 'Astrodynamics',
    component: OrbitalTrajectoryBg,
    description: 'Keplerian orbital mechanics drafting schematic with elliptical transfer orbit, vis-viva equations, velocity vector tangents, periapsis/apoapsis markers, and trajectory state probe.'
  },
  {
    id: 'geodesic',
    name: '4. Geodesic Polyhedron',
    badge: 'Topology / 3D',
    component: GeodesicWireframeBg,
    description: 'Isometric 3D wireframe icosahedron, golden ratio (φ) construction rectangles, Euler characteristic (V - E + F = 2), circumradius formulas, and topology probe.'
  }
];

export default function SkillsPreview({ initialMode = 'spectral', onSelectMode }) {
  const resolveMode = (m) => {
    if (m === '1' || m === 'spectral') return 'spectral';
    if (m === '2' || m === 'dna') return 'dna';
    if (m === '3' || m === 'orbital') return 'orbital';
    if (m === '4' || m === 'geodesic') return 'geodesic';
    return 'spectral';
  };

  const [activeMode, setActiveMode] = useState(resolveMode(initialMode));

  const currentConfig = SKILLS_MODES.find((m) => m.id === activeMode) || SKILLS_MODES[0];
  const BackgroundComponent = currentConfig.component;

  const handleSelect = (id) => {
    setActiveMode(id);
    if (onSelectMode) onSelectMode(id);
    const newUrl = `${window.location.pathname}?skills-preview=${id}`;
    window.history.pushState(null, '', newUrl);
  };

  const categories = [
    { 
      key: 'languages', 
      label: 'Languages',
      icon: <FaCode className="w-6 h-6" />
    },
    { 
      key: 'frontend', 
      label: 'Frontend',
      icon: <FaLayerGroup className="w-6 h-6" />
    },
    { 
      key: 'backend', 
      label: 'Backend & ML',
      icon: <FaServer className="w-6 h-6" />
    },
    { 
      key: 'tools', 
      label: 'Tools & DevOps',
      icon: <FaTools className="w-6 h-6" />
    }
  ];

  return (
    <div className="relative min-h-screen bg-background text-primary selection:bg-accent selection:text-white flex flex-col overflow-x-hidden">
      {/* 1. Active Blueprint Background Component */}
      <BackgroundComponent />

      {/* 2. Top Preview Switcher Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">Skills Blueprint Preview:</span>
          <span className="text-xs font-mono text-secondary hidden sm:inline">Choose background schematic:</span>
        </div>

        <nav aria-label="Skills background options" className="flex flex-wrap items-center gap-2">
          {SKILLS_MODES.map((m) => {
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

      {/* 4. Full Skills Content */}
      <section className="relative z-10 w-full min-h-screen flex flex-col justify-center py-24 px-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 bg-accent inline-block" />
          <span className="text-xs font-mono text-accent uppercase tracking-widest">
            03 // TECHNICAL STACK & ARCHITECTURE
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-space font-bold mb-12 tracking-tight text-center md:text-left">
          Skills
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const items = portfolio.skills[cat.key] || [];
            return (
              <div 
                key={cat.key} 
                className="bg-surface/50 backdrop-blur-sm border border-border p-6 flex flex-col hover:border-accent/40 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border/60">
                  <div className="text-accent">
                    {cat.icon}
                  </div>
                  <h3 className="font-space font-bold text-lg">{cat.label}</h3>
                </div>

                <div className="flex flex-col gap-3">
                  {items.map((skill) => (
                    <div 
                      key={skill}
                      className="flex items-center gap-3 p-2 bg-background/50 border border-border/40 hover:border-accent/50 hover:bg-surface transition-all"
                    >
                      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                        {skillIcons[skill] || <FaTools className="w-4 h-4 text-secondary" />}
                      </div>
                      <span className="text-sm font-medium">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
