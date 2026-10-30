import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import { createBezierEasing } from '../../hooks/usePositionAwareTransform';
import TopographicBlueprintBg from '../backgrounds/TopographicBlueprintBg';
import { StagePanel, useStagePanel, useStageEnter } from '../stage/ScrollStage';

// Flow (small-screen) choreography: distinct, non-linear cubic-bezier speed curves
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

// Background entrance: rises from below and fades in as About scrolls into place
const easeBgMaster = createBezierEasing(0.12, 0.88, 0.2, 1.0);
const easeBgMap = createBezierEasing(0.08, 0.92, 0.18, 1.0);
const easeBgGrid = createBezierEasing(0.2, 0.8, 0.25, 1.0);
const easeBgTelemetry = createBezierEasing(0.15, 0.85, 0.2, 1.0);

// Small screens: a normal section whose elements rise in as it scrolls into view
export default function About({ data }) {
  const targetRef = useRef(null);

  // Track scroll from when About enters viewport until it reaches top of viewport
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "start start"]
  });

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

  const bgOpacity = useTransform(scrollYProgress, [0, 0.95], [0, 1], { ease: easeBgMaster });
  const bgY = useTransform(scrollYProgress, [0, 1], ["40vh", "0vh"], { ease: easeBgMaster });
  const bgMapY = useTransform(scrollYProgress, [0, 1], ["20vh", "0vh"], { ease: easeBgMap });
  const bgGridY = useTransform(scrollYProgress, [0, 1], ["10vh", "0vh"], { ease: easeBgGrid });
  const bgTelemetryY = useTransform(scrollYProgress, [0, 1], ["15vh", "0vh"], { ease: easeBgTelemetry });

  const styles = {
    heading: { y: headingY, opacity: headingOpacity },
    intro: { y: yIntro, opacity: opacityIntro },
    focus: { y: yFocus, opacity: opacityFocus },
    location: { y: yLocation, opacity: opacityLocation },
    interests: { y: yInterests, opacity: opacityInterests },
    quote1: { y: yQuote1, opacity: opacityQuote1 },
    quote2: { y: yQuote2, opacity: opacityQuote2 },
  };

  return (
    <section
      ref={targetRef}
      id="about"
      className="relative min-h-screen w-full bg-background overflow-hidden flex flex-col justify-center"
    >
      <TopographicBlueprintBg
        layerStyles={{
          root: { opacity: bgOpacity, y: bgY },
          grid: { y: bgGridY },
          map: { y: bgMapY },
          telemetry: { y: bgTelemetryY },
        }}
      />
      <AboutContent data={data} styles={styles} className="py-16 md:py-24 my-auto" />
    </section>
  );
}

// Desktop: a stage panel entering from below. Elements nearer the top lead.
export function AboutPanel({ index, data }) {
  const panel = useStagePanel(index);
  const styles = {
    heading: useStageEnter(panel, 0.0, 20),
    intro: useStageEnter(panel, 0.3, 21),
    focus: useStageEnter(panel, 0.2, 22),
    location: useStageEnter(panel, 0.45, 23),
    interests: useStageEnter(panel, 0.6, 24),
    quote1: useStageEnter(panel, 0.85, 25),
    quote2: useStageEnter(panel, 0.95, 26),
  };
  const layerStyles = {
    grid: useStageEnter(panel, 0.8, 30),
    map: useStageEnter(panel, 0.2, 31),
    telemetry: useStageEnter(panel, 0.5, 32),
  };

  return (
    <StagePanel
      panel={panel}
      className="flex flex-col justify-center"
      background={
        <div className="absolute inset-0 bg-background">
          <TopographicBlueprintBg layerStyles={layerStyles} />
        </div>
      }
    >
      <AboutContent data={data} styles={styles} className="py-8" />
    </StagePanel>
  );
}

function AboutContent({ data, styles, className }) {
  return (
    <div className={`container mx-auto px-6 max-w-6xl w-full relative z-10 ${className}`}>
      {/* Heading with blueprint classification header */}
      <m.div
        style={styles.heading}
        className="mb-8 md:mb-12 short:md:mb-6 flex flex-col items-start"
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
      </m.div>

      <div className="grid md:grid-cols-12 gap-6 md:gap-8 short:md:gap-4">

        {/* Main Intro Card */}
        <m.div
          style={styles.intro}
          className="md:col-span-8 bg-surface/60 backdrop-blur-md border border-border p-8 md:p-10 short:md:p-6 relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-32 h-32 md:w-48 md:h-48 short:md:w-36 short:md:h-36 flex-shrink-0 border border-border p-1 bg-surface/50">
              <img
                src="/profile.jpg"
                alt="Portrait of Aarav Sukhadiya"
                loading="lazy"
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
        </m.div>

        {/* Metadata Bento Grid */}
        <div className="md:col-span-4 grid grid-cols-1 gap-4 md:gap-6 short:md:gap-4">
          <m.div
            style={styles.focus}
            className="bg-surface/60 backdrop-blur-md border border-border p-6 flex flex-col justify-center group hover:border-accent/50 transition-colors"
          >
            <span className="block text-xs font-mono text-accent mb-2 uppercase tracking-widest">Focus</span>
            <span className="font-medium text-lg leading-snug">{data.focus}</span>
          </m.div>

          <m.div
            style={styles.location}
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
          </m.div>

          <m.div
            style={styles.interests}
            className="bg-surface/60 backdrop-blur-md border border-border p-6 flex flex-col justify-center group hover:border-accent/50 transition-colors"
          >
            <span className="block text-xs font-mono text-accent mb-2 uppercase tracking-widest">Interests</span>
            <span className="font-medium text-sm leading-snug">{data.interests}</span>
          </m.div>
        </div>

        {/* Quotes Row */}
        <m.div
          style={styles.quote1}
          className="md:col-span-5 bg-surface/60 backdrop-blur-md border border-border p-8 short:md:p-5 relative group overflow-hidden flex flex-col justify-center hover:border-accent/50 transition-colors"
        >
          <span className="text-6xl text-accent/10 absolute top-2 left-4 font-serif">"</span>
          <p className="text-lg md:text-xl font-space italic text-primary/90 z-10 relative mt-2 text-balance">
            Compression is Intelligence
          </p>
          <span className="block mt-4 text-xs font-mono text-secondary uppercase tracking-widest">Marcus Hutter</span>
        </m.div>

        <m.div
          style={styles.quote2}
          className="md:col-span-7 bg-surface/60 backdrop-blur-md border border-border p-8 short:md:p-5 relative group overflow-hidden flex flex-col justify-center hover:border-accent/50 transition-colors"
        >
          <span className="text-6xl text-accent/10 absolute top-2 left-4 font-serif">"</span>
          <p className="text-lg md:text-xl font-space italic text-primary/90 z-10 relative mt-2 text-balance">
            The best time to plant a tree was 20 years ago, but the second best time is now.
          </p>
          <span className="block mt-4 text-xs font-mono text-secondary uppercase tracking-widest">Chinese Proverb</span>
        </m.div>

      </div>
    </div>
  );
}
