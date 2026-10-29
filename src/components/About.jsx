import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { createBezierEasing } from '../hooks/usePositionAwareTransform';
import TopographicBlueprintBg from './ui/about-backgrounds/TopographicBlueprintBg';

export default function About({ data }) {
  const targetRef = useRef(null);
  
  // Track scroll from when About enters viewport until it reaches top of viewport
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "start start"]
  });

  // Distinct, non-linear cubic-bezier speed curves (mirroring Home -> Projects organic choreography)
  // 1. Heading drops in with high initial acceleration and soft landing
  const easeHeading = createBezierEasing(0.05, 0.95, 0.1, 1.0);

  // 2. Main Intro Profile Card (Left Top) - energetic surge, early arrival
  const easeIntro = createBezierEasing(0.1, 0.9, 0.15, 1.0);

  // 3. Focus Card (Right Top) - S-curve with delayed burst
  const easeFocus = createBezierEasing(0.4, 0.05, 0.2, 1.0);

  // 4. Location & Status Card (Right Middle) - snappy mid-flight velocity
  const easeLocation = createBezierEasing(0.25, 0.85, 0.15, 1.0);

  // 5. Interests Card (Right Bottom) - delayed whip
  const easeInterests = createBezierEasing(0.65, 0.08, 0.25, 1.0);

  // 6. Quote 1 (Left Bottom) - steady momentum
  const easeQuote1 = createBezierEasing(0.18, 0.82, 0.22, 1.0);

  // 7. Quote 2 (Right Bottom) - dramatic late snap (straggler)
  const easeQuote2 = createBezierEasing(0.85, 0.0, 0.1, 1.0);

  // Section Heading and label drop down vertically into place
  const headingY = useTransform(scrollYProgress, [0, 1], ["-70px", "0px"], { ease: easeHeading });
  const headingOpacity = useTransform(scrollYProgress, [0, 0.5], [0.35, 1], { ease: easeHeading });

  // Bento cards cascade up vertically with distinct non-linear speed curves and varied travel distances
  const yIntro = useTransform(scrollYProgress, [0, 1], ["65vh", "0vh"], { ease: easeIntro });
  const opacityIntro = useTransform(scrollYProgress, [0.05, 0.65], [0.3, 1], { ease: easeIntro });

  const yFocus = useTransform(scrollYProgress, [0, 1], ["85vh", "0vh"], { ease: easeFocus });
  const opacityFocus = useTransform(scrollYProgress, [0.1, 0.75], [0.25, 1], { ease: easeFocus });

  const yLocation = useTransform(scrollYProgress, [0, 1], ["75vh", "0vh"], { ease: easeLocation });
  const opacityLocation = useTransform(scrollYProgress, [0.12, 0.8], [0.25, 1], { ease: easeLocation });

  const yInterests = useTransform(scrollYProgress, [0, 1], ["95vh", "0vh"], { ease: easeInterests });
  const opacityInterests = useTransform(scrollYProgress, [0.15, 0.85], [0.2, 1], { ease: easeInterests });

  const yQuote1 = useTransform(scrollYProgress, [0, 1], ["80vh", "0vh"], { ease: easeQuote1 });
  const opacityQuote1 = useTransform(scrollYProgress, [0.15, 0.85], [0.2, 1], { ease: easeQuote1 });

  const yQuote2 = useTransform(scrollYProgress, [0, 1], ["110vh", "0vh"], { ease: easeQuote2 });
  const opacityQuote2 = useTransform(scrollYProgress, [0.2, 0.95], [0.15, 1], { ease: easeQuote2 });

  return (
    <section 
      ref={targetRef} 
      id="about" 
      className="relative min-h-screen w-full bg-background overflow-hidden flex flex-col justify-center scroll-mt-0"
    >
      {/* 1. Blueprint Topographic Elevation Background with seamless transition from Projects World Map */}
      <TopographicBlueprintBg scrollYProgress={scrollYProgress} />

      {/* 2. Main About Content Container with clean padding and no edge clipping */}
      <div className="container mx-auto px-6 max-w-6xl w-full relative z-10 py-16 md:py-24 my-auto">
        {/* Heading with blueprint classification header */}
        <motion.div 
          style={{ y: headingY, opacity: headingOpacity }}
          className="mb-8 md:mb-12 flex flex-col items-start"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-accent inline-block" />
            <span className="text-xs font-mono text-accent uppercase tracking-widest">
              02 // DOSSIER & ARCHITECTURAL PROFILE
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-space font-bold tracking-tight text-white">
            About Me
          </h2>
        </motion.div>
        
        <div className="grid md:grid-cols-12 gap-6 md:gap-8">
          
          {/* Main Intro Card */}
          <motion.div 
            style={{ y: yIntro, opacity: opacityIntro }} 
            className="md:col-span-8 bg-surface/60 backdrop-blur-md border border-border p-8 md:p-10 relative group overflow-hidden"
          >
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
                   {data.intro}
                 </p>
               </div>
             </div>
          </motion.div>
          
          {/* Metadata Bento Grid */}
          <div className="md:col-span-4 grid grid-cols-1 gap-4 md:gap-6">
             <motion.div 
               style={{ y: yFocus, opacity: opacityFocus }} 
               className="bg-surface/60 backdrop-blur-md border border-border p-6 flex flex-col justify-center group hover:border-accent/50 transition-colors"
             >
               <span className="block text-xs font-mono text-accent mb-2 uppercase tracking-widest">Focus</span>
               <span className="font-medium text-lg leading-snug">{data.focus}</span>
             </motion.div>
             
             <motion.div 
               style={{ y: yLocation, opacity: opacityLocation }} 
               className="grid grid-cols-2 gap-4 md:gap-6"
             >
               <div className="bg-surface/60 backdrop-blur-md border border-border p-5 flex flex-col justify-center group hover:border-accent/50 transition-colors">
                 <span className="block text-xs font-mono text-accent mb-2 uppercase tracking-widest">Location</span>
                 <span className="font-medium text-sm">{data.location}</span>
               </div>
               <div className="bg-surface/60 backdrop-blur-md border border-border p-5 flex flex-col justify-center group hover:border-accent/50 transition-colors">
                 <span className="block text-xs font-mono text-accent mb-2 uppercase tracking-widest">Status</span>
                 <span className="font-medium text-sm">{data.experience}</span>
               </div>
             </motion.div>
             
             <motion.div 
               style={{ y: yInterests, opacity: opacityInterests }} 
               className="bg-surface/60 backdrop-blur-md border border-border p-6 flex flex-col justify-center group hover:border-accent/50 transition-colors"
             >
               <span className="block text-xs font-mono text-accent mb-2 uppercase tracking-widest">Interests</span>
               <span className="font-medium text-sm leading-snug">{data.interests}</span>
             </motion.div>
          </div>
          
          {/* Quotes Row */}
          <motion.div 
            style={{ y: yQuote1, opacity: opacityQuote1 }} 
            className="md:col-span-5 bg-surface/60 backdrop-blur-md border border-border p-8 relative group overflow-hidden flex flex-col justify-center hover:border-accent/50 transition-colors"
          >
            <span className="text-6xl text-accent/10 absolute top-2 left-4 font-serif">"</span>
            <p className="text-lg md:text-xl font-space italic text-primary/90 z-10 relative mt-2 text-balance">
              Compression is Intelligence
            </p>
            <span className="block mt-4 text-xs font-mono text-secondary uppercase tracking-widest">Marcus Hutter</span>
          </motion.div>

          <motion.div 
            style={{ y: yQuote2, opacity: opacityQuote2 }} 
            className="md:col-span-7 bg-surface/60 backdrop-blur-md border border-border p-8 relative group overflow-hidden flex flex-col justify-center hover:border-accent/50 transition-colors"
          >
            <span className="text-6xl text-accent/10 absolute top-2 left-4 font-serif">"</span>
            <p className="text-lg md:text-xl font-space italic text-primary/90 z-10 relative mt-2 text-balance">
              The best time to plant a tree was 20 years ago, but the second best time is now.
            </p>
            <span className="block mt-4 text-xs font-mono text-secondary uppercase tracking-widest">Chinese Proverb</span>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
