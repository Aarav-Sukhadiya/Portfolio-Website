import { motion, useScroll, useTransform } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import InteractiveScanningHUD from './ui/InteractiveScanningHUD';
import ProjectCard from './ui/ProjectCard';
import usePositionAwareTransform from '../hooks/usePositionAwareTransform';
import useViewportHeight from '../hooks/useViewportHeight';

export default function HeroAndProjects({ data }) {
  const vh = useViewportHeight();
  const { scrollY } = useScroll();

  // 100vh of scrolling transitions Hero to Projects cleanly aligned with 1-page steps
  const scrubDistance = vh;

  // Hero text moves out to the left
  const heroX = useTransform(scrollY, [0, scrubDistance], ["0vw", "-100vw"]);

  // Hero background image fades out as we transition into Projects so it never bleeds into Projects or About
  const heroBgOpacity = useTransform(scrollY, [0, scrubDistance * 0.7], [1, 0]);
  const heroBgDisplay = useTransform(scrollY, v => v < scrubDistance ? "block" : "none");

  // Projects background fades in smoothly over the first 70% of the scrub and stays solid
  const projectsOpacity = useTransform(scrollY, [0, scrubDistance * 0.7], [0, 1]);
  
  // Dynamically enable pointer events when the section becomes visible to avoid blocking Hero
  const display = useTransform(scrollY, v => v > 5 ? "flex" : "none");

  // Title and Button have position-aware curves:
  // 0.0 = Far Left (Projects Title)
  // 1.0 = Far Right (GitHub Button)
  const titleX = usePositionAwareTransform(scrollY, scrubDistance, 0.0, 10);
  const buttonX = usePositionAwareTransform(scrollY, scrubDistance, 1.0, 11);


  return (
    <section id="home" className="relative h-[200vh] bg-background">
      <div id="projects" className="absolute top-[100vh] w-full" />
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* FIXED BACKGROUND IMAGE - Fades out as we enter Projects so it never bleeds into Projects or About */}
        <motion.div 
          style={{ opacity: heroBgOpacity, display: heroBgDisplay }} 
          className="absolute inset-0 z-0"
        >
          <img 
            src="/hero-bg.jpg" 
            alt=""
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-background"></div>
        </motion.div>

        {/* HERO TEXT SECTION */}
        <motion.div 
          style={{ x: heroX }} 
          className="absolute inset-0 w-full h-full flex flex-col items-center justify-start pt-32 md:pt-48 pb-16 z-10"
        >
          <div className="relative container mx-auto px-6 flex flex-col items-center text-center">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold tracking-tight text-white drop-shadow-2xl mb-6">
              {data.name}
            </h1>
            
            <div>
              <span className="text-xl md:text-2xl text-white/90 font-mono tracking-widest uppercase drop-shadow-md mb-8 block">
                {data.role}
              </span>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto text-balance leading-relaxed drop-shadow-md mb-12">
                {data.bio}
              </p>
              
              <div className="flex items-center gap-2 text-white/60 font-mono uppercase tracking-widest animate-pulse justify-center">
                <span>Scroll to see projects</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* PROJECTS SECTION */}
        <motion.div 
          style={{ opacity: projectsOpacity, display }}
          className="absolute inset-0 w-full h-full flex flex-col justify-center bg-surface/95 backdrop-blur-md z-20 px-4 md:px-0 py-12 md:py-0"
        >
          <InteractiveScanningHUD scrollY={scrollY} scrubDistance={scrubDistance} />
          <div className="container mx-auto px-2 md:px-6 max-w-6xl w-full flex flex-col h-full justify-center relative z-10">
            
            <div className="flex justify-between items-center mb-8">
              <motion.h2 style={{ x: titleX }} className="text-4xl md:text-5xl font-space font-bold tracking-tight">Projects</motion.h2>
              <motion.a 
                style={{ x: buttonX }}
                href={data.social.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-sm md:text-base font-mono border border-white/20 hover:border-white/40 bg-background px-3 md:px-5 py-2 hover:bg-surface transition-colors text-primary"
              >
                <FaGithub className="w-4 h-4" />
                <span className="hidden md:inline">Show More Projects on Github</span>
                <span className="inline md:hidden">More on Github</span>
              </motion.a>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-none md:grid-rows-[repeat(3,minmax(0,1fr))] gap-4 w-full h-auto md:h-[70vh]">
              {data.projects.map((project, idx) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  idx={idx}
                  scrollY={scrollY} 
                  scrubDistance={scrubDistance} 
                />
              ))}
            </div>
            
          </div>
        </motion.div>
      </div>
    </section>
  );
}
