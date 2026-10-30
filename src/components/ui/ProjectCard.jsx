import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import usePositionAwareTransform from '../../hooks/usePositionAwareTransform';

// Desktop bento layout (4 columns x 3 rows) designed for exactly six projects
const BENTO_CLASSES = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-2 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-2 md:row-span-1",
  "md:col-span-2 md:row-span-1",
];

// Approximate horizontal position of each bento slot (0 = far left, 1 = far right),
// which shapes that card's scroll-in easing curve
const SLOT_CENTERS = [0.1, 0.9, 0.3, 0.7, 0.2, 0.8];

export default function ProjectCard({ project, idx, scrollY, scrubDistance }) {
  const x = usePositionAwareTransform(scrollY, scrubDistance, SLOT_CENTERS[idx % SLOT_CENTERS.length], idx);
  const gridClass = BENTO_CLASSES[idx % BENTO_CLASSES.length];

  // Touch devices have no hover, so a tap toggles the flip instead
  const [flipped, setFlipped] = useState(false);
  const handleClick = (e) => {
    if (e.target.closest('a') || !window.matchMedia('(hover: none)').matches) return;
    setFlipped((f) => !f);
  };

  return (
    <motion.div
      style={{ x }}
      onClick={handleClick}
      className={`group perspective-[1000px] w-full h-36 md:h-full ${gridClass}`}
    >
      {/* Flips on hover, on tap (touch), and on keyboard focus of the links on the back face */}
      <div className={`relative w-full h-full ${flipped ? '[transform:rotateY(180deg)]' : ''} transition-transform duration-700 motion-reduce:transition-none [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)] shadow-xl hover:shadow-2xl`}>
        {/* Front of Card */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] p-4 md:p-6 border border-border bg-background flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start mb-2 flex-shrink-0">
            <span className="font-mono text-accent text-lg font-bold">{String(idx + 1).padStart(2, '0')}</span>
          </div>
          <div className="overflow-hidden">
            <h4 className="text-lg md:text-2xl font-bold mb-1 md:mb-2 line-clamp-1">{project.name}</h4>
            <p className="text-secondary text-xs md:text-base line-clamp-2">
              {project.description}
            </p>
          </div>
        </div>

        {/* Back of Card */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] p-4 md:p-6 border border-border bg-surface flex flex-col overflow-hidden">
          <div className="flex justify-between items-start mb-3 flex-shrink-0">
            <h4 className="text-base md:text-lg font-bold line-clamp-1 flex-grow pr-2">{project.name}</h4>
            <div className="flex gap-3 flex-shrink-0">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent transition-colors" aria-label={`${project.name} on GitHub`}>
                  <FaGithub className="w-5 h-5" />
                </a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent transition-colors" aria-label={`${project.name} live demo`}>
                  <FaExternalLinkAlt className="w-4 h-4" />
                </a>
              )}
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
          <div className="hidden md:flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-border flex-shrink-0 overflow-hidden h-[42px] max-h-[42px]">
            {project.technologies.slice(0, 4).map(tech => (
              <span key={tech} className="text-xs font-mono text-primary/70">{tech}</span>
            ))}
            {project.technologies.length > 4 && (
              <span className="text-xs font-mono text-primary/70">+{project.technologies.length - 4}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
