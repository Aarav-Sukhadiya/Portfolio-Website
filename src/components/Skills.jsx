import { 
  FaPython, FaJava, FaDatabase, FaHtml5, FaCss3Alt, FaReact, 
  FaNodeJs, FaGit, FaGithub, FaDocker, FaUnity, FaLinux,
  FaTools, FaCode, FaServer, FaMobileAlt, FaFire
} from 'react-icons/fa';
import { 
  SiJavascript, SiMysql, SiTailwindcss, SiVite, SiFastapi 
} from 'react-icons/si';

const iconMap = {
  'Python': <FaPython className="w-5 h-5" />,
  'JavaScript': <SiJavascript className="w-5 h-5" />,
  'Java': <FaJava className="w-5 h-5" />,
  'SQL': <FaDatabase className="w-5 h-5" />,
  'HTML': <FaHtml5 className="w-5 h-5" />,
  'CSS': <FaCss3Alt className="w-5 h-5" />,
  'React': <FaReact className="w-5 h-5" />,
  'React Native': <FaMobileAlt className="w-5 h-5" />,
  'Tailwind CSS': <SiTailwindcss className="w-5 h-5" />,
  'Vite': <SiVite className="w-5 h-5" />,
  'MySQL': <SiMysql className="w-5 h-5" />,
  'Firebase (Firestore, Auth)': <FaFire className="w-5 h-5" />,
  'Node.js (basic)': <FaNodeJs className="w-5 h-5" />,
  'FastAPI': <SiFastapi className="w-5 h-5" />,
  'Git': <FaGit className="w-5 h-5" />,
  'GitHub': <FaGithub className="w-5 h-5" />,
  'Docker': <FaDocker className="w-5 h-5" />,
  'Unity': <FaUnity className="w-5 h-5" />,
  'Linux': <FaLinux className="w-5 h-5" />,
};

export default function Skills({ skills }) {
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
      label: 'Backend & Infrastructure',
      icon: <FaServer className="w-6 h-6" />
    },
    { 
      key: 'tools', 
      label: 'Tools & Platforms',
      icon: <FaTools className="w-6 h-6" />
    }
  ];

  return (
    <section id="skills" className="py-24 bg-surface/30">
      <div className="container mx-auto px-6 max-w-5xl">
        <h2 className="text-3xl font-bold mb-12 tracking-tight">Technical Skills</h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <div key={cat.key} className="p-6 bg-surface border border-border hover:border-accent/50 transition-colors">
              <div className="flex items-center gap-3 mb-6 text-accent">
                {cat.icon}
                <h3 className="font-mono text-sm uppercase tracking-wider">{cat.label}</h3>
              </div>
              <ul className="space-y-4">
                {skills[cat.key]?.map((skill) => (
                  <li key={skill} className="flex items-center gap-3 text-secondary font-medium group">
                    <span className="text-primary/40 group-hover:text-accent transition-colors">
                      {iconMap[skill] || <FaCode className="w-5 h-5" />}
                    </span>
                    <span className="group-hover:text-primary transition-colors">{skill}</span>
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
