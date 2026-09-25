import { useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import usePositionAwareTransform from '../../hooks/usePositionAwareTransform';

export default function InteractiveScanningHUD({ scrollY, scrubDistance }) {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Parallax entrance curves for the background elements!
  // Map comes in early and smooth
  const mapX = usePositionAwareTransform(scrollY, scrubDistance, 0.2, 50);
  // Grid comes in delayed and snaps into place
  const gridX = usePositionAwareTransform(scrollY, scrubDistance, 0.8, 60);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      
      {/* Faint World Map */}
      <motion.div 
        style={{ x: mapX }}
        className="absolute inset-0 z-0 opacity-[0.05] mix-blend-screen"
      >
         <img src="/world-map.svg" className="absolute inset-0 w-full h-full object-cover object-center filter invert opacity-50" alt="World Map Radar" />
      </motion.div>
      
      {/* Blueprint Grid */}
      <motion.div 
        style={{ x: gridX }}
        className="absolute inset-0 opacity-[0.04] z-10" 
      >
        <div 
          className="w-[200vw] h-[200vh] -ml-[50vw] -mt-[50vh]"
          style={{ 
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)', 
            backgroundSize: '100px 100px' 
          }} 
        />
      </motion.div>
      
      {/* Crosshairs */}
      <div className="mix-blend-difference absolute inset-0 z-20">
        <motion.div className="absolute top-0 left-0 w-full h-[1px] bg-white/30" style={{ y: mouseY }} />
        <motion.div className="absolute top-0 left-0 w-[1px] h-full bg-white/30" style={{ x: mouseX }} />
      </div>
    </div>
  );
}
