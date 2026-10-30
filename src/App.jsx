import { useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroAndProjects from './components/HeroAndProjects';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import useSectionKeyboardNav from './hooks/useSectionKeyboardNav';
import { portfolio } from './data/portfolio';

function App() {
  useEffect(() => {
    document.title = `${portfolio.name} — ${portfolio.role}`;
  }, []);

  // Reveal .animate-on-scroll elements once they enter the viewport (styles in index.css)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useSectionKeyboardNav();

  return (
    <div className="min-h-screen bg-background text-primary selection:bg-accent selection:text-white flex flex-col">
      <Navbar />

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
  );
}

export default App;
