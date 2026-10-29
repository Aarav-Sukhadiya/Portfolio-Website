import { useEffect, useState, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroAndProjects from './components/HeroAndProjects';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { portfolio } from './data/portfolio';
import Preview from './components/Preview';
import AboutPreview from './components/AboutPreview';
import SkillsPreview from './components/SkillsPreview';

function App() {
  const [previewMode, setPreviewMode] = useState(null);
  const [aboutPreviewMode, setAboutPreviewMode] = useState(null);
  const [skillsPreviewMode, setSkillsPreviewMode] = useState(null);

  useEffect(() => {
    document.title = `${portfolio.name} — ${portfolio.role}`;
    const params = new URLSearchParams(window.location.search);
    const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');

    if (params.has('preview')) {
      setPreviewMode(params.get('preview'));
    } else if (params.has('about-preview')) {
      setAboutPreviewMode(params.get('about-preview') || 'topographic');
    } else if (params.has('skills-preview')) {
      setSkillsPreviewMode(params.get('skills-preview') || 'spectral');
    } else if (pathname.startsWith('about-preview')) {
      const match = pathname.match(/about-preview[-/]?([a-zA-Z0-9_-]*)/);
      setAboutPreviewMode(match && match[1] ? match[1] : 'topographic');
    } else if (pathname.startsWith('skills-preview')) {
      const match = pathname.match(/skills-preview[-/]?([a-zA-Z0-9_-]*)/);
      setSkillsPreviewMode(match && match[1] ? match[1] : 'spectral');
    }
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('slide-up');
          entry.target.style.opacity = 1;
        }
      });
    }, { threshold: 0.1 });

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Handle Page Down / Page Up keyboard navigation to align cleanly with section stops
  const targetDestinationRef = useRef(null);
  const scrollEndTimeoutRef = useRef(null);

  useEffect(() => {
    if (previewMode) return;

    const handleScroll = () => {
      // Clear destination once arrived within 10px
      if (targetDestinationRef.current !== null) {
        if (Math.abs(window.scrollY - targetDestinationRef.current) < 10) {
          targetDestinationRef.current = null;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleKeyDown = (e) => {
      // Don't intercept when user is interacting with form controls
      if (
        e.target &&
        (e.target.tagName === 'INPUT' ||
          e.target.tagName === 'TEXTAREA' ||
          e.target.isContentEditable)
      ) {
        return;
      }

      const isNext = e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey);
      const isPrev = e.key === 'PageUp' || (e.key === ' ' && e.shiftKey);

      if (!isNext && !isPrev) return;

      e.preventDefault();

      const sectionIds = ['home', 'projects', 'about', 'skills', 'experience', 'education', 'contact'];
      const positions = sectionIds
        .map((id) => {
          if (id === 'home') return 0;
          const el = document.getElementById(id);
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return Math.round(rect.top + window.scrollY);
        })
        .filter((pos) => pos !== null)
        .sort((a, b) => a - b);

      // Deduplicate targets within 20px
      const targets = positions.filter((pos, idx, arr) => {
        return idx === 0 || Math.abs(pos - arr[idx - 1]) > 20;
      });

      // Use the in-flight destination if navigation is already in progress
      const currentReference = targetDestinationRef.current !== null
        ? targetDestinationRef.current
        : window.scrollY;

      const threshold = 25;

      if (isNext) {
        const next = targets.find((pos) => pos > currentReference + threshold);
        if (next !== undefined) {
          targetDestinationRef.current = next;
          window.scrollTo({ top: next, behavior: 'smooth' });
        } else {
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          targetDestinationRef.current = maxScroll;
          window.scrollTo({ top: maxScroll, behavior: 'smooth' });
        }
      } else if (isPrev) {
        const prev = [...targets].reverse().find((pos) => pos < currentReference - threshold);
        if (prev !== undefined) {
          targetDestinationRef.current = prev;
          window.scrollTo({ top: prev, behavior: 'smooth' });
        } else {
          targetDestinationRef.current = 0;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }

      // Safeguard timeout to reset destination reference after smooth scroll completes
      clearTimeout(scrollEndTimeoutRef.current);
      scrollEndTimeoutRef.current = setTimeout(() => {
        targetDestinationRef.current = null;
      }, 750);
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(scrollEndTimeoutRef.current);
    };
  }, [previewMode, aboutPreviewMode, skillsPreviewMode]);

  if (skillsPreviewMode) {
    return <SkillsPreview initialMode={skillsPreviewMode} onSelectMode={setSkillsPreviewMode} />;
  }

  if (aboutPreviewMode) {
    return <AboutPreview initialMode={aboutPreviewMode} onSelectMode={setAboutPreviewMode} />;
  }

  if (previewMode) {
    return <Preview mode={previewMode} />;
  }

  return (
    <div className="min-h-screen bg-background text-primary selection:bg-accent selection:text-white flex flex-col">
      <Navbar name={portfolio.name} />
      
      <main className="flex-grow">
        <HeroAndProjects data={portfolio} />
        
        <About data={portfolio.about} />
        
        <Skills skills={portfolio.skills} />
        
        <Experience experience={portfolio.experience} />
        
        <Education education={portfolio.education} />
        
        <Contact social={portfolio.social} />
      </main>

      <Footer name={portfolio.name} />
    </div>
  )
}

export default App;
