import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import usePositionAwareTransform from '../hooks/usePositionAwareTransform';

export default function About({ data }) {
  const targetRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    // Track the scroll position relative to the entire 200vh section
    offset: ["start end", "end end"]
  });

  // Smoothly transition the background color from Projects to About
  const sectionBgColor = useTransform(scrollYProgress, [0, 0.5], ["#0a0a0a", "rgba(23, 23, 23, 0.3)"]);

  // Elements slide up from 100vh (bottom of screen) to 0vh
  // We use 0.9 (90% of the scroll progress) so there is a 10% dead scrolling pause at the end
  const yIntro = usePositionAwareTransform(scrollYProgress, 0.9, 0.1, 0, ["100vh", "0vh"]);
  const yFocus = usePositionAwareTransform(scrollYProgress, 0.9, 0.3, 1, ["100vh", "0vh"]);
  const yLocation = usePositionAwareTransform(scrollYProgress, 0.9, 0.5, 2, ["100vh", "0vh"]);
  const yInterests = usePositionAwareTransform(scrollYProgress, 0.9, 0.7, 3, ["100vh", "0vh"]);
  const yQuote1 = usePositionAwareTransform(scrollYProgress, 0.9, 0.9, 4, ["100vh", "0vh"]);
  const yQuote2 = usePositionAwareTransform(scrollYProgress, 0.9, 1.0, 5, ["100vh", "0vh"]);

  return (
    <motion.section ref={targetRef} id="about" className="relative h-[150vh]" style={{ backgroundColor: sectionBgColor }}>
      
      {/* We use a soft gradient at the top edge of the section to eliminate the straight line */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none" />

      <div className="sticky top-0 h-screen w-full flex flex-col justify-start pt-24 md:justify-center md:pt-0 z-10">

        <div className="container mx-auto px-6 max-w-6xl w-full z-10">
          <h2 className="text-4xl md:text-5xl font-space font-bold mb-8 md:mb-16 tracking-tight text-center md:text-left">
            About Me
          </h2>
        
        <div className="grid md:grid-cols-12 gap-6 md:gap-8">
          
          {/* Main Intro Card */}
          <motion.div style={{ y: yIntro }} className="md:col-span-8 bg-surface/50 backdrop-blur-sm border border-border p-8 md:p-10 relative group overflow-hidden">
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
             <motion.div style={{ y: yFocus }} className="bg-surface/50 backdrop-blur-sm border border-border p-6 flex flex-col justify-center group hover:border-accent/50 transition-colors">
               <span className="block text-xs font-mono text-accent mb-2 uppercase tracking-widest">Focus</span>
               <span className="font-medium text-lg leading-snug">{data.focus}</span>
             </motion.div>
             
             <motion.div style={{ y: yLocation }} className="grid grid-cols-2 gap-4 md:gap-6">
               <div className="bg-surface/50 backdrop-blur-sm border border-border p-5 flex flex-col justify-center group hover:border-accent/50 transition-colors">
                 <span className="block text-xs font-mono text-accent mb-2 uppercase tracking-widest">Location</span>
                 <span className="font-medium text-sm">{data.location}</span>
               </div>
               <div className="bg-surface/50 backdrop-blur-sm border border-border p-5 flex flex-col justify-center group hover:border-accent/50 transition-colors">
                 <span className="block text-xs font-mono text-accent mb-2 uppercase tracking-widest">Status</span>
                 <span className="font-medium text-sm">{data.experience}</span>
               </div>
             </motion.div>
             
             <motion.div style={{ y: yInterests }} className="bg-surface/50 backdrop-blur-sm border border-border p-6 flex flex-col justify-center group hover:border-accent/50 transition-colors">
               <span className="block text-xs font-mono text-accent mb-2 uppercase tracking-widest">Interests</span>
               <span className="font-medium text-sm leading-snug">{data.interests}</span>
             </motion.div>
          </div>
          
          {/* Quotes Row */}
          <motion.div style={{ y: yQuote1 }} className="md:col-span-5 bg-surface/50 backdrop-blur-sm border border-border p-8 relative group overflow-hidden flex flex-col justify-center hover:border-accent/50 transition-colors">
            <span className="text-6xl text-accent/10 absolute top-2 left-4 font-serif">"</span>
            <p className="text-lg md:text-xl font-space italic text-primary/90 z-10 relative mt-2 text-balance">
              Compression is Intelligence
            </p>
            <span className="block mt-4 text-xs font-mono text-secondary uppercase tracking-widest">Marcus Hutter</span>
          </motion.div>

          <motion.div style={{ y: yQuote2 }} className="md:col-span-7 bg-surface/50 backdrop-blur-sm border border-border p-8 relative group overflow-hidden flex flex-col justify-center hover:border-accent/50 transition-colors">
            <span className="text-6xl text-accent/10 absolute top-2 left-4 font-serif">"</span>
            <p className="text-lg md:text-xl font-space italic text-primary/90 z-10 relative mt-2 text-balance">
              The best time to plant a tree was 20 years ago, but the second best time is now.
            </p>
            <span className="block mt-4 text-xs font-mono text-secondary uppercase tracking-widest">Chinese Proverb</span>
          </motion.div>
          
        </div>
      </div>
      </div>
    </motion.section>
  );
}
