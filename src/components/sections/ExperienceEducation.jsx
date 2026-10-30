import { StagePanel, StageEnter, useStagePanel, useStageEnter } from '../stage/ScrollStage';
import StarChartBg from '../backgrounds/StarChartBg';
import useScrollReveal from '../../hooks/useScrollReveal';

// Small screens: a normal section (columns stack below md) that fades up once it scrolls into view
export default function ExperienceEducation({ experience, education }) {
  const revealRef = useScrollReveal();

  return (
    <section id="experience" className="relative min-h-screen flex flex-col justify-center py-20 bg-background overflow-hidden">
      <StarChartBg />
      <div ref={revealRef} className="container mx-auto px-6 max-w-6xl relative z-10 animate-on-scroll">
        <ExperienceEducationContent experience={experience} education={education} />
      </div>
    </section>
  );
}

// Desktop: a stage panel entering from below. Headings lead, then entries top to bottom.
export function ExperienceEducationPanel({ index, experience, education }) {
  const panel = useStagePanel(index);
  const grid = useStageEnter(panel, 0.8, 80);
  const art = useStageEnter(panel, 0.2, 81);
  const telemetry = useStageEnter(panel, 0.5, 82);
  const layerStyles = { grid, art, telemetry };

  return (
    <StagePanel
      panel={panel}
      className="flex flex-col justify-center"
      background={
        <div className="absolute inset-0 bg-background">
          <StarChartBg layerStyles={layerStyles} />
        </div>
      }
    >
      <div className="container mx-auto px-6 max-w-6xl py-8">
        <ExperienceEducationContent experience={experience} education={education} panel={panel} />
      </div>
    </StagePanel>
  );
}

function Plain({ className, children }) {
  return <div className={className}>{children}</div>;
}

function SectionHeading({ label, title }) {
  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 bg-accent inline-block" />
        <span className="text-xs font-mono text-accent uppercase tracking-widest">{label}</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-space font-bold mb-8 md:mb-10 tracking-tight text-white">{title}</h2>
    </>
  );
}

// With a panel, every block enters with the stage transition; without one, blocks are static
function ExperienceEducationContent({ experience, education, panel }) {
  const Block = panel ? StageEnter : Plain;
  const enter = (lead, index) => (panel ? { panel, lead, index } : {});

  return (
    <div className="grid md:grid-cols-2 gap-12 md:gap-16">
      <div>
        <Block {...enter(0.0, 70)}>
          <SectionHeading label="04 // OPERATIONAL LOG" title="Experience" />
        </Block>

        <div className="relative pl-10 space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-border">
          {experience.map((item, i) => (
            <Block key={item.id} {...enter(0.35 + i * 0.2, 72 + i)} className="relative group">
              {/* Timeline dot */}
              <div className="absolute -left-10 top-7 w-4 h-4 bg-accent border-4 border-background group-hover:scale-125 transition-transform duration-300" />
              <div className="p-6 bg-surface/60 backdrop-blur-md border border-border group-hover:border-accent/50 transition-colors">
                <span className="block font-mono text-sm text-accent mb-2">{item.year}</span>
                <h3 className="text-xl font-bold mb-1">{item.role}</h3>
                <h4 className="text-primary/70 font-medium mb-4">{item.company}</h4>
                <p className="text-secondary leading-relaxed text-sm">{item.description}</p>
              </div>
            </Block>
          ))}
        </div>
      </div>

      <div id={panel ? undefined : 'education'}>
        <Block {...enter(0.05, 71)}>
          <SectionHeading label="05 // ACADEMIC RECORD" title="Education" />
        </Block>

        <div className="space-y-4 md:space-y-6">
          {education.map((edu, i) => (
            <Block
              key={edu.id}
              {...enter(0.4 + i * 0.25, 76 + i)}
              className="p-6 bg-surface/60 backdrop-blur-md border border-border hover:border-accent/50 transition-colors"
            >
              <span className="block font-mono text-sm text-accent mb-2">{edu.year}</span>
              <h3 className="text-xl font-bold leading-snug mb-1">{edu.degree}</h3>
              <h4 className="text-primary/70 font-medium">{edu.institution}</h4>
              <div className="mt-4 pt-4 border-t border-border/50">
                <span className="block text-xs font-mono text-primary/60 mb-1 uppercase tracking-widest">Focus Areas</span>
                <p className="text-secondary text-sm leading-relaxed">{edu.coursework}</p>
              </div>
            </Block>
          ))}
        </div>
      </div>
    </div>
  );
}
