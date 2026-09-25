import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Navbar({ name }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [vh, setVh] = useState(800);

  useEffect(() => {
    setVh(window.innerHeight);
    const handleResize = () => setVh(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollY } = useScroll();
  
  // The Projects section slides in from scroll 0 to 0.4 of a 150vh scroll distance (which is 0 to 0.6vh)
  // We want the navbar to hide exactly along this same distance
  const hideDistance = vh * 0.6;
  const scrubbedY = useTransform(scrollY, [0, hideDistance], ["0%", "-100%"]);
  
  // For the background color, we still want it to blur when slightly scrolled, unless it's fully hidden.
  // Wait, if it's scrubbing away, the background can stay transparent or blur.
  // Let's just track if we are past 50px to add the blur class if it's forced open.
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    return scrollY.onChange(latest => setIsScrolled(latest > 50));
  }, [scrollY]);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Projects', href: '#projects' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  const forceShow = isHovered || mobileMenuOpen;

  return (
    <div 
      className="fixed top-0 left-0 w-full z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Invisible hit area at the very top edge of the screen */}
      <div className="absolute top-0 left-0 w-full h-8 bg-transparent z-50" />

      <motion.header 
        style={{ 
          "--scroll-y": scrubbedY,
          transform: forceShow ? "translateY(0%)" : "translateY(var(--scroll-y))",
          transition: forceShow ? "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)" : "none"
        }}
        className="relative w-full z-40 bg-transparent py-6"
      >
        <div className="container mx-auto px-6 max-w-5xl flex items-center justify-end md:justify-center">

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-sm font-medium text-secondary hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Mobile Nav Toggle */}
          <button 
            className="md:hidden z-50 text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
              )}
            </svg>
          </button>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 bg-background/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8 md:hidden fade-in">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-2xl font-semibold hover:text-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </motion.header>
    </div>
  );
}
