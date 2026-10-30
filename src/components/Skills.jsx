import SpectralWaveformBg from './ui/SpectralWaveformBg';
import { 
  FaPython, FaJava, FaDatabase, FaHtml5, FaCss3Alt, FaReact, 
  FaNodeJs, FaGit, FaGithub, FaDocker, FaUnity, FaLinux,
  FaTools, FaCode, FaServer, FaMobileAlt, FaFire
} from 'react-icons/fa';
import { 
  SiJavascript, SiMysql, SiTailwindcss, SiVite, SiFastapi,
  SiCplusplus, SiNvidia, SiPytorch, SiSqlite, SiGradio
} from 'react-icons/si';

const iconMap = {
  'Python': <FaPython className="w-5 h-5 text-[#3776AB]" />,
  'C++': <SiCplusplus className="w-5 h-5 text-[#00599C]" />,
  'CUDA': <SiNvidia className="w-5 h-5 text-[#76B900]" />,
  'JavaScript': <SiJavascript className="w-5 h-5 text-[#F7DF1E]" />,
  'Java': <FaJava className="w-5 h-5 text-[#ED8B00]" />,
  'SQL': <FaDatabase className="w-5 h-5 text-[#003B57]" />,
  'HTML': <FaHtml5 className="w-5 h-5 text-[#E34F26]" />,
  'CSS': <FaCss3Alt className="w-5 h-5 text-[#1572B6]" />,
  'Tailwind CSS': <SiTailwindcss className="w-5 h-5 text-[#06B6D4]" />,
  'React': <FaReact className="w-5 h-5 text-[#61DAFB]" />,
  'React Native': <FaMobileAlt className="w-5 h-5 text-[#61DAFB]" />,
  'Vite': <SiVite className="w-5 h-5 text-[#646CFF]" />,
  'Gradio': <SiGradio className="w-5 h-5 text-[#FF7C00]" />,
  'PyTorch': <SiPytorch className="w-5 h-5 text-[#EE4C2C]" />,
  'FastAPI': <SiFastapi className="w-5 h-5 text-[#009688]" />,
  'MySQL': <SiMysql className="w-5 h-5 text-[#4479A1]" />,
  'SQLite': <SiSqlite className="w-5 h-5 text-[#003B57]" />,
  'Firebase (Firestore, Auth)': <FaFire className="w-5 h-5 text-[#FFCA28]" />,
  'Node.js (basic)': <FaNodeJs className="w-5 h-5 text-[#339933]" />,
  'Git': <FaGit className="w-5 h-5 text-[#F05032]" />,
  'GitHub': <FaGithub className="w-5 h-5 text-white" />,
  'Docker': <FaDocker className="w-5 h-5 text-[#2496ED]" />,
  'Linux': <FaLinux className="w-5 h-5 text-[#FCC624]" />,
  'Unity': <FaUnity className="w-5 h-5 text-white" />,
  'MCP': <FaTools className="w-5 h-5 text-accent" />
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
    icon: <FaReact className="w-6 h-6" />
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

export default function Skills({ skills }) {
  return (
    <section id="skills" className="relative min-h-screen flex flex-col justify-center py-24 bg-background overflow-hidden scroll-mt-0">
      {/* 1. Integrated Spectral Waveform Blueprint Background with Sine Slider */}
      <SpectralWaveformBg />

      {/* 2. Skills Content Layer */}
      <div className="container mx-auto px-6 max-w-6xl relative z-10 animate-on-scroll">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 bg-accent inline-block" />
          <span className="text-xs font-mono text-accent uppercase tracking-widest">
            03 // TECHNICAL STACK & ARCHITECTURE
          </span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-space font-bold mb-12 tracking-tight text-white">
          Skills
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.key} 
              className="p-6 bg-surface/60 backdrop-blur-md border border-border hover:border-accent/50 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border/60 text-accent">
                {cat.icon}
                <h3 className="font-space font-bold text-lg text-primary">{cat.label}</h3>
              </div>
              <ul className="space-y-3">
                {skills[cat.key]?.map((skill) => (
                  <li 
                    key={skill} 
                    className="flex items-center gap-3 p-2 bg-background/50 border border-border/40 hover:border-accent/50 hover:bg-surface/80 transition-all text-secondary font-medium group"
                  >
                    <span className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                      {iconMap[skill] || <FaCode className="w-4 h-4 text-secondary" />}
                    </span>
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
