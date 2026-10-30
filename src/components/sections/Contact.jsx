import { useState } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowRight, FaRegCopy, FaCheck } from 'react-icons/fa';
import useScrollReveal from '../../hooks/useScrollReveal';

// Steam lines drift independently above the cup (see .steam-line in index.css)
const STEAM = [
  '       (  )   (   )  )',
  '        ) (   )  (  (',
  '        ( )  (    ) )',
];
const CUP = `        _____________
       <_____________> ___
       |             |/ _ \\
       |               | | |
       |               |_| |
    ___|             |\\___/
   /    \\___________/    \\
   \\_____________________/`;

const stripProtocol = (url) => url.replace(/^https?:\/\/(www\.)?/, '');

export default function Contact({ social }) {
  const introRef = useScrollReveal();
  const terminalRef = useScrollReveal();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(social.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${social.email}`;
    }
  };

  const channels = [
    social.email && { label: 'EMAIL', value: social.email, href: `mailto:${social.email}`, Icon: FaEnvelope },
    social.github && { label: 'GITHUB', value: stripProtocol(social.github), href: social.github, Icon: FaGithub, external: true },
    social.linkedin && { label: 'LINKEDIN', value: stripProtocol(social.linkedin), href: social.linkedin, Icon: FaLinkedin, external: true },
  ].filter(Boolean);

  return (
    <section
      id="contact"
      className="relative min-h-screen flex items-center py-24 bg-warm-bg text-stone-100 overflow-hidden selection:bg-amber-400 selection:text-stone-950"
    >
      {/* Warm glow, amber dot grid and faint CRT scanlines */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_25%,rgba(245,158,11,0.14),transparent_55%),radial-gradient(ellipse_at_90%_90%,rgba(234,88,12,0.10),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-60"
          style={{ backgroundImage: 'radial-gradient(rgba(251,191,36,0.10) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 3px)' }}
        />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
      </div>

      <div className="relative container mx-auto px-6 max-w-6xl grid lg:grid-cols-[1.1fr_1fr] gap-14 lg:gap-16 items-center">
        {/* Pitch */}
        <div ref={introRef} className="animate-on-scroll">
          <p className="flex items-center gap-3 font-mono text-xs text-amber-400 tracking-[0.3em] uppercase mb-6">
            <span className="inline-block w-2 h-2 bg-amber-400" />
            06 // Open Channel
          </p>
          <h2 className="font-space text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.02] mb-8">
            Have an interesting project? <span className="text-amber-400">Let's talk.</span>
          </h2>
          <p className="text-lg text-stone-400 max-w-xl mb-10 text-balance">
            I'm currently open to new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>

          <div className="inline-flex items-center gap-3 border border-amber-400/25 bg-amber-400/5 px-4 py-2 mb-10 font-mono text-[11px] tracking-[0.2em] uppercase text-amber-200/80">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 bg-amber-400 animate-ping motion-reduce:animate-none opacity-60" />
              <span className="relative w-2 h-2 bg-amber-400" />
            </span>
            Status: open to opportunities
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={`mailto:${social.email}`}
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-amber-400 text-stone-950 font-semibold text-lg hover:bg-amber-300 transition-colors"
            >
              Say Hello
              <FaArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex items-center justify-center gap-3 px-6 py-4 border border-stone-700 hover:border-amber-400/60 text-stone-300 hover:text-amber-200 font-mono text-sm tracking-widest uppercase transition-colors"
            >
              {copied ? <FaCheck className="w-4 h-4 text-amber-400" /> : <FaRegCopy className="w-4 h-4" />}
              <span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span>
            </button>
          </div>
        </div>

        {/* Terminal */}
        <div
          ref={terminalRef}
          className="animate-on-scroll [transition-delay:150ms] border border-amber-400/20 bg-warm-surface/90 shadow-[0_0_80px_-20px_rgba(245,158,11,0.3)] min-w-0"
        >
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-amber-400/15 font-mono text-[11px] text-stone-500">
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="w-2.5 h-2.5 bg-stone-700" />
              <span className="w-2.5 h-2.5 bg-stone-700" />
              <span className="w-2.5 h-2.5 bg-amber-500/70" />
            </div>
            <span>~/contact — channels.sh</span>
            <span>TTY1</span>
          </div>

          <div className="p-5 md:p-6 font-mono text-sm">
            <p className="text-stone-400 mb-3"><span className="text-amber-400">$</span> ls ./channels</p>
            <ul className="mb-6">
              {channels.map(({ label, value, href, Icon, external }, i) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                    className="group grid grid-cols-[auto_auto_1fr_auto] items-center gap-3 px-3 py-3 border-l-2 border-transparent hover:border-amber-400 hover:bg-amber-400/5 transition-colors"
                  >
                    <span className="text-amber-400/50 text-xs">[{String(i + 1).padStart(2, '0')}]</span>
                    <Icon className="w-4 h-4 text-stone-400 group-hover:text-amber-400 transition-colors" />
                    <span className="min-w-0">
                      <span className="block text-xs tracking-[0.2em] text-stone-200">{label}</span>
                      <span className="block text-xs text-stone-500 truncate">{value}</span>
                    </span>
                    <FaArrowRight className="w-3 h-3 text-stone-600 group-hover:text-amber-400 -rotate-45 transition-colors" />
                  </a>
                </li>
              ))}
            </ul>

            <div className="border-t border-dashed border-amber-400/15 pt-5">
              <p className="text-stone-400 mb-3"><span className="text-amber-400">$</span> ./brew --tea</p>
              <pre className="text-amber-400/80 text-[10px] sm:text-[11px] leading-tight font-bold select-none overflow-x-auto" aria-hidden="true">
                {STEAM.map((line, i) => (
                  <span key={i} className="steam-line text-amber-200/60" style={{ animationDelay: `${i * 0.6}s` }}>{line}</span>
                ))}
                {CUP}
              </pre>
              <p className="mt-4 text-xs tracking-[0.2em] uppercase text-stone-400">
                Care for a cup of tea with me?<span className="caret inline-block w-2 h-3.5 ml-1.5 align-middle bg-amber-400" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
