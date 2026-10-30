import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollStage from './components/stage/ScrollStage';
import Hero from './components/sections/Hero';
import Projects from './components/sections/Projects';
import About, { AboutPanel } from './components/sections/About';
import Skills, { SkillsPanel } from './components/sections/Skills';
import ExperienceEducation, { ExperienceEducationPanel } from './components/sections/ExperienceEducation';
import Contact from './components/sections/Contact';
import useMediaQuery from './hooks/useMediaQuery';
import useSectionKeyboardNav from './hooks/useSectionKeyboardNav';
import { portfolio } from './data/portfolio';

// Viewports large enough to fit About, Skills, and Experience & Education on one pinned screen each.
// Smaller screens pin only Hero → Projects and scroll the rest as normal sections.
const FULL_STAGE_QUERY = '(min-width: 1024px) and (min-height: 700px)';
const FULL_STAGE_IDS = ['home', 'projects', 'about', 'skills', 'experience'];
const SHORT_STAGE_IDS = ['home', 'projects'];

function App() {
  const fullStage = useMediaQuery(FULL_STAGE_QUERY);

  useEffect(() => {
    document.title = `${portfolio.name} — ${portfolio.role}`;
  }, []);

  useSectionKeyboardNav();

  return (
    <div className="min-h-screen bg-background text-primary selection:bg-accent selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <ScrollStage panelIds={fullStage ? FULL_STAGE_IDS : SHORT_STAGE_IDS}>
          <Hero index={0} data={portfolio} />
          <Projects index={1} projects={portfolio.projects} github={portfolio.social.github} />
          {fullStage && (
            <>
              <AboutPanel index={2} data={portfolio.about} />
              <SkillsPanel index={3} skills={portfolio.skills} />
              <ExperienceEducationPanel index={4} experience={portfolio.experience} education={portfolio.education} />
            </>
          )}
        </ScrollStage>

        {!fullStage && (
          <>
            <About data={portfolio.about} />
            <Skills skills={portfolio.skills} />
            <ExperienceEducation experience={portfolio.experience} education={portfolio.education} />
          </>
        )}

        <Contact social={portfolio.social} />
      </main>

      <Footer name={portfolio.name} />
    </div>
  );
}

export default App;
