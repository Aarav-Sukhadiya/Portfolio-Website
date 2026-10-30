import { useState, useEffect } from 'react';
import { m, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import useViewportHeight from '../../hooks/useViewportHeight';

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'Projects', href: '#projects' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact', href: '#contact' },
];

const SLIDE_TRANSITION = "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)";

export default function Navbar() {
  const [isHovered, setIsHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const vh = useViewportHeight();

  const { scrollY } = useScroll();

  // The navbar hides over the first half of the Hero → Projects transition (one screen of scroll)
  const hideDistance = vh * 0.5;
  const scrubbedY = useTransform(scrollY, [0, hideDistance], ["0%", "-100%"]);

  // Past the hero scrub the navbar is fully hidden, so hover reveals should animate
  const [isPastHero, setIsPastHero] = useState(false);
  useMotionValueEvent(scrollY, 'change', (latest) => setIsPastHero(latest >= hideDistance));

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const forceShow = isHovered || mobileMenuOpen;

  return (
    <div
      className="fixed top-0 left-0 w-full z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Invisible hit area at the very top edge of the screen */}
      <div className="absolute top-0 left-0 w-full h-8 bg-transparent z-50" />

      <m.header
        style={{
          "--scroll-y": scrubbedY,
          transform: forceShow ? "translateY(0%)" : "translateY(var(--scroll-y))",
          transition: isPastHero || forceShow ? SLIDE_TRANSITION : "none",
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
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" aria-hidden="true">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
              )}
            </svg>
          </button>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav id="mobile-menu" className="fixed inset-0 bg-background/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8 md:hidden fade-in">
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
            </nav>
          )}
        </div>
      </m.header>
    </div>
  );
}
