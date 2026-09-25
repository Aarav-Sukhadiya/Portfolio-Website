import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import usePositionAwareTransform from '../../hooks/usePositionAwareTransform';

export default function ProjectCard({ project, idx, bentoClasses, scrollY, scrubDistance }) {
  const getNormalizedX = (index) => {
    // Defines base horizontal position (0 = Far Left, 1 = Far Right)
    const centers = [0.1, 0.9, 0.3, 0.7, 0.2, 0.8];
    return centers[index % centers.length];
  };
  
  const basePos = getNormalizedX(idx);
  const x = usePositionAwareTransform(scrollY, scrubDistance, basePos, idx);
  
  const gridClass = bentoClasses[idx % bentoClasses.length];
  
  return (
    <motion.div 
      style={{ x }} 
      className={`group perspective-[1000px] w-full h-full ${gridClass}`}
    >
      <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-xl hover:shadow-2xl">
        {/* Front of Card */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] p-5 md:p-6 border border-border bg-background flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start mb-2 flex-shrink-0">
            <span className="font-mono text-accent text-lg font-bold">{(idx + 1).toString().padStart(2, '0')}</span>
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xl md:text-2xl font-bold mb-2 line-clamp-1">{project.name}</h4>
            <p className="text-secondary text-sm md:text-base line-clamp-2">
              {project.description}
            </p>
          </div>
        </div>

        {/* Back of Card */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] p-5 md:p-6 border border-border bg-surface flex flex-col pointer-events-auto overflow-hidden">
          <div className="flex justify-between items-start mb-3 flex-shrink-0">
            <h4 className="text-base md:text-lg font-bold line-clamp-1 flex-grow pr-2">{project.name}</h4>
            <div className="flex gap-3 z-50 flex-shrink-0">
              <a href={project.github || '#'} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent transition-colors" aria-label="GitHub">
                <FaGithub className="w-5 h-5" />
              </a>
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent transition-colors" aria-label="Live Demo">
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
          <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-border flex-shrink-0 overflow-hidden h-[42px] max-h-[42px]">
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
