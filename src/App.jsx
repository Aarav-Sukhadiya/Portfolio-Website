import { useEffect, useState } from 'react';
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

function App() {
  const [previewMode, setPreviewMode] = useState(null);

  useEffect(() => {
    document.title = `${portfolio.name} — ${portfolio.role}`;
    const params = new URLSearchParams(window.location.search);
    if (params.has('preview')) {
      setPreviewMode(params.get('preview'));
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

  if (previewMode) {
    return <Preview mode={previewMode} />;
  }

  return (
    <div className="min-h-screen bg-background text-primary selection:bg-accent selection:text-white flex flex-col">
      <Navbar name={portfolio.name} />
      
      <main className="flex-grow">
        <HeroAndProjects data={portfolio} />
        
        <About data={portfolio.about} />
        
        <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out">
          <Skills skills={portfolio.skills} />
        </div>
        
        <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out">
          <Experience experience={portfolio.experience} />
        </div>
        
        <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out">
          <Education education={portfolio.education} />
        </div>
        
        <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out">
          <Contact social={portfolio.social} />
        </div>
      </main>

      <Footer name={portfolio.name} />
    </div>
  )
}

export default App;
