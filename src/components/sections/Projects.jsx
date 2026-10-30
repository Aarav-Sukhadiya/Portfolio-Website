import { m } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import InteractiveScanningHUD from '../backgrounds/InteractiveScanningHUD';
import ProjectCard from './ProjectCard';
import { StagePanel, useStagePanel, useStageEnter } from '../stage/ScrollStage';

export default function Projects({ index, projects, github }) {
  const panel = useStagePanel(index);

  // Enters from the right: the title (far left) leads, the GitHub button (far right) trails
  const titleStyle = useStageEnter(panel, 0.0, 10);
  const buttonStyle = useStageEnter(panel, 1.0, 11);

  return (
    <StagePanel
      panel={panel}
      className="flex flex-col justify-center px-4 md:px-0 py-12 md:py-0"
      background={
        <div className="absolute inset-0 bg-surface/95 backdrop-blur-md">
          <InteractiveScanningHUD panel={panel} />
        </div>
      }
    >
      <div className="container mx-auto px-2 md:px-6 max-w-6xl w-full flex flex-col h-full justify-center relative">
        <div className="flex justify-between items-center mb-8">
          <m.h2 style={titleStyle} className="text-4xl md:text-5xl font-space font-bold tracking-tight">Projects</m.h2>
          <m.a
            style={buttonStyle}
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm md:text-base font-mono border border-white/20 hover:border-white/40 bg-background px-3 md:px-5 py-2 hover:bg-surface transition-colors text-primary"
          >
            <FaGithub className="w-4 h-4" />
            <span className="hidden md:inline">Show More Projects on Github</span>
            <span className="inline md:hidden">More on Github</span>
          </m.a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-none md:grid-rows-[repeat(3,minmax(0,1fr))] gap-4 w-full h-auto md:h-[70vh]">
          {projects.map((project, idx) => (
            <ProjectCard key={project.id} panel={panel} project={project} idx={idx} />
          ))}
        </div>
      </div>
    </StagePanel>
  );
}
