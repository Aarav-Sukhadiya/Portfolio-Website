import { StagePanel, useStagePanel } from '../stage/ScrollStage';

export default function Hero({ index, data }) {
  const panel = useStagePanel(index);

  return (
    <StagePanel
      panel={panel}
      className="flex flex-col items-center justify-start pt-32 md:pt-48 pb-16"
      background={
        <>
          {/* AVIF where supported (about 40% of the JPEG's size); the JPEG is the fallback */}
          <picture>
            <source srcSet="/hero-bg.avif" type="image/avif" />
            <img
              src="/hero-bg.jpg"
              alt=""
              className="w-full h-full object-cover"
              fetchPriority="high"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-background"></div>
        </>
      }
    >
      <div className="relative container mx-auto px-6 flex flex-col items-center text-center">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold tracking-tight text-white drop-shadow-2xl mb-6">
          {data.name}
        </h1>

        <div>
          <span className="text-xl md:text-2xl text-white/90 font-mono tracking-widest uppercase drop-shadow-md mb-8 block">
            {data.role}
          </span>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto text-balance leading-relaxed drop-shadow-md mb-12">
            {data.bio}
          </p>

          <div className="flex items-center gap-2 text-white/60 font-mono uppercase tracking-widest animate-pulse justify-center">
            <span>Scroll to see projects</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </StagePanel>
  );
}
