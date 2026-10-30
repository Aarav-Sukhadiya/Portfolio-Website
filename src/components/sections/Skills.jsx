import { m } from 'framer-motion';
import { FaPython, FaDatabase, FaHtml5, FaReact, FaGit, FaDocker, FaLinux, FaTools, FaCode } from 'react-icons/fa';
import { SiCplusplus, SiNvidia, SiPytorch, SiFastapi, SiSqlite, SiGradio, SiTailwindcss } from 'react-icons/si';
import SpectralWaveformBg from '../backgrounds/SpectralWaveformBg';
import { StagePanel, useStagePanel, useStageEnter } from '../stage/ScrollStage';
import useScrollReveal from '../../hooks/useScrollReveal';

// Keyed by the exact skill string in portfolio.js: the icon, its brand color (shown on hover),
// and what the tool is used for (shown after the dotted leader). Add an entry when you add a skill.
const SKILL_INFO = {
  'Python': { Icon: FaPython, color: '#3776AB', role: 'ml · scripting' },
  'C++': { Icon: SiCplusplus, color: '#00599C', role: 'systems' },
  'CUDA': { Icon: SiNvidia, color: '#76B900', role: 'gpu kernels' },
  'SQL': { Icon: FaDatabase, color: '#003B57', role: 'queries' },
  'HTML': { Icon: FaHtml5, color: '#E34F26', role: 'markup' },
  'Tailwind CSS': { Icon: SiTailwindcss, color: '#06B6D4', role: 'styling' },
  'React': { Icon: FaReact, color: '#61DAFB', role: 'ui' },
  'Gradio': { Icon: SiGradio, color: '#FF7C00', role: 'ml demos' },
  'PyTorch': { Icon: SiPytorch, color: '#EE4C2C', role: 'deep learning' },
  'FastAPI': { Icon: SiFastapi, color: '#009688', role: 'apis' },
  'SQLite': { Icon: SiSqlite, color: '#003B57', role: 'embedded db' },
  'Git': { Icon: FaGit, color: '#F05032', role: 'versioning' },
  'Docker': { Icon: FaDocker, color: '#2496ED', role: 'containers' },
  'Linux': { Icon: FaLinux, color: '#FCC624', role: 'arch btw' },
  'MCP': { Icon: FaTools, color: 'var(--color-accent)', role: 'agent tools' },
};

// Used for a skill with no SKILL_INFO entry
const UNKNOWN_SKILL = { Icon: FaCode, color: 'var(--color-secondary)', role: '—' };

const categories = [
  { key: 'languages', label: 'Languages', file: 'languages.cfg' },
  { key: 'frontend', label: 'Frontend', file: 'frontend.cfg' },
  { key: 'backend', label: 'Backend & ML', file: 'backend_ml.cfg' },
  { key: 'tools', label: 'Tools & DevOps', file: 'tools.cfg' },
];

// Small screens: a normal section that fades up once it scrolls into view
export default function Skills({ skills }) {
  const revealRef = useScrollReveal();

  return (
    <section id="skills" className="relative min-h-screen flex flex-col justify-center py-24 bg-background overflow-hidden">
      <SpectralWaveformBg />
      <div ref={revealRef} className="container mx-auto px-6 max-w-6xl relative z-10 animate-on-scroll">
        <SkillsContent skills={skills} />
      </div>
    </section>
  );
}

// Desktop: a stage panel entering from the left. Elements farther right lead.
export function SkillsPanel({ index, skills }) {
  const panel = useStagePanel(index);
  const headingStyle = useStageEnter(panel, 0.9, 40);
  const cardStyles = [
    useStageEnter(panel, 0.88, 41),
    useStageEnter(panel, 0.63, 42),
    useStageEnter(panel, 0.37, 43),
    useStageEnter(panel, 0.12, 44),
  ];
  const grid = useStageEnter(panel, 0.8, 50);
  const waveform = useStageEnter(panel, 0.2, 51);
  const probe = useStageEnter(panel, 0.5, 52);
  const banner = useStageEnter(panel, 0.5, 53);
  const layerStyles = { grid, waveform, probe, banner };

  return (
    <StagePanel
      panel={panel}
      className="flex flex-col justify-center"
      background={
        <div className="absolute inset-0 bg-background">
          <SpectralWaveformBg layerStyles={layerStyles} />
        </div>
      }
    >
      <div className="container mx-auto px-6 max-w-6xl relative">
        <SkillsContent skills={skills} headingStyle={headingStyle} cardStyles={cardStyles} />
      </div>
    </StagePanel>
  );
}

function SkillsContent({ skills, headingStyle, cardStyles = [] }) {
  return (
    <>
      <m.div style={headingStyle}>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 bg-accent inline-block" />
          <span className="text-xs font-mono text-accent uppercase tracking-widest">
            03 // TECHNICAL STACK & ARCHITECTURE
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-space font-bold mb-12 tracking-tight text-white">
          Skills
        </h2>
      </m.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
        {categories.map((cat, idx) => {
          const entries = skills[cat.key] ?? [];
          return (
            <m.div
              key={cat.key}
              style={cardStyles[idx]}
              className="bg-background/70 backdrop-blur-md border border-border hover:border-accent/50 transition-colors duration-300 font-mono"
            >
              {/* Readout header: config file name and entry count */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border text-[11px] tracking-wider">
                <span className="text-accent">// {cat.file}</span>
                <span className="text-secondary/60">[{entries.length}]</span>
              </div>
              <div className="px-4 pt-4 pb-3">
                <h3 className="font-space font-bold text-lg text-primary mb-3">{cat.label}</h3>
                <ul>
                  {entries.map((skill) => {
                    const { Icon, color, role } = SKILL_INFO[skill] ?? UNKNOWN_SKILL;
                    return (
                      <li key={skill} className="group flex items-center gap-1.5 py-1.5 text-xs">
                        <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition">
                          <Icon className="w-4 h-4" style={{ color }} />
                        </span>
                        <span className="uppercase tracking-wide text-primary/90 whitespace-nowrap">{skill}</span>
                        <span className="flex-1 min-w-3 self-end mb-1 border-b border-dotted border-white/20" aria-hidden="true" />
                        <span className="text-[11px] text-secondary group-hover:text-accent transition-colors whitespace-nowrap">{role}</span>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-3 pt-2 border-t border-dashed border-border text-[10px] tracking-[0.3em] text-secondary/40">-- EOF --</p>
              </div>
            </m.div>
          );
        })}
      </div>
    </>
  );
}
