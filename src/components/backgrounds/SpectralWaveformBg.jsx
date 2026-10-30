import { useEffect } from 'react';
import { m, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { blueprintGrid } from './blueprintGrid';

const GRID_STYLE = blueprintGrid(80);

// SVG canvas is 1440x900; the waveform spans two full cycles across its width
const WIDTH = 1440;
const CENTER_Y = 450;

// Amplitudes of the fundamental and 2nd/3rd harmonics at canvas x
function harmonicsAt(x) {
  const t = (x / WIDTH) * 4 * Math.PI;
  return [110 * Math.sin(t), 45 * Math.sin(2 * t + 0.5), 25 * Math.sin(3 * t + 1.2)];
}

function buildPaths() {
  const fundamental = [];
  const harmonic2 = [];
  const harmonic3 = [];
  const composite = [];

  for (let x = 0; x <= WIDTH; x += 10) {
    const [y1, y2, y3] = harmonicsAt(x);
    fundamental.push(`${x},${CENTER_Y + y1}`);
    harmonic2.push(`${x},${CENTER_Y + y2}`);
    harmonic3.push(`${x},${CENTER_Y + y3}`);
    composite.push(`${x},${CENTER_Y + y1 + y2 + y3}`);
  }

  const toPath = (pts) => `M ${pts.join(' L ')}`;
  return {
    pathFundamental: toPath(fundamental),
    pathHarmonic2: toPath(harmonic2),
    pathHarmonic3: toPath(harmonic3),
    pathComposite: toPath(composite),
  };
}

const { pathFundamental, pathHarmonic2, pathHarmonic3, pathComposite } = buildPaths();

const DB_LEVELS = [
  { offset: -150, label: '+12 dB' },
  { offset: -75, label: '+6 dB' },
  { offset: 75, label: '-6 dB' },
  { offset: 150, label: '-12 dB' },
];
const TIME_TICKS = [120, 240, 360, 480, 600, 720, 840, 960, 1080, 1200, 1320];
const FFT_PEAKS = [
  { x: 60, h: 140, f: '440 Hz', p: '0 dB' },
  { x: 120, h: 90, f: '880 Hz', p: '-6 dB' },
  { x: 180, h: 55, f: '1.3 kHz', p: '-14 dB' },
  { x: 240, h: 35, f: '1.7 kHz', p: '-22 dB' },
  { x: 300, h: 20, f: '2.2 kHz', p: '-28 dB' },
  { x: 360, h: 12, f: '3.5 kHz', p: '-36 dB' },
];

// Readout lines for the probe at normalized x (0 = far left, 1 = far right)
function telemetryAt(norm) {
  const t = norm * 4 * Math.PI; // 2 complete wave cycles
  const v = 1.1 * Math.sin(t) + 0.45 * Math.sin(2 * t + 0.5) + 0.25 * Math.sin(3 * t + 1.2);
  const dv = 1.1 * Math.cos(t) + 0.9 * Math.cos(2 * t + 0.5) + 0.75 * Math.cos(3 * t + 1.2);
  const freq = Math.round(40 * Math.pow(460, norm)); // 40 Hz to 18,400 Hz across the canvas
  const signed = (n) => (n >= 0 ? '+' : '') + n.toFixed(2);
  return [
    `OSC_PROBE // f: ${freq.toLocaleString()} Hz | V: ${signed(v)}V`,
    `θ: ${(norm * 720).toFixed(1)}° | t: ${(norm * 5.0).toFixed(2)}ms | ${(-24.0 + (v + 1.8) * 6.5).toFixed(1)}dBm`,
    `dV/dt: ${signed(dv)} V/ms [SLIDER: HORIZONTAL]`,
  ];
}

// Skills background: a Fourier waveform blueprint with a probe that rides the composite wave as
// the cursor moves horizontally. Layer motion (entrance) is driven by the parent through
// layerStyles: { grid, waveform, probe, banner }. The readout updates through MotionValues, so
// mouse movement never re-renders this component.
export default function SpectralWaveformBg({ layerStyles = {} }) {
  const mouseNormX = useMotionValue(0.5);
  const smoothNormX = useSpring(mouseNormX, { damping: 25, stiffness: 220 });

  const freqLine = useMotionValue('OSC_PROBE // f: 1,420 Hz | V: +1.42V');
  const phaseLine = useMotionValue('θ: 180.0° | t: 2.50ms | -12.4dBm');
  const slopeLine = useMotionValue('dV/dt: -0.65 V/ms [SLIDER: HORIZONTAL]');

  useEffect(() => {
    const handleMouseMove = (e) => {
      const w = window.innerWidth || 1440;
      // Only horizontal position matters; clamp within the visible canvas
      const norm = Math.max(0.04, Math.min(0.96, e.clientX / w));
      mouseNormX.set(norm);
      const [freq, phase, slope] = telemetryAt(norm);
      freqLine.set(freq);
      phaseLine.set(phase);
      slopeLine.set(slope);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseNormX, freqLine, phaseLine, slopeLine]);

  // The probe's canvas x, and its y on the composite wave S(t) and on the fundamental
  const ballX = useTransform(smoothNormX, (n) => n * WIDTH);
  const ballY = useTransform(ballX, (x) => {
    const [y1, y2, y3] = harmonicsAt(x);
    return CENTER_Y + y1 + y2 + y3;
  });
  const sineY = useTransform(ballX, (x) => CENTER_Y + harmonicsAt(x)[0]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* Oscilloscope drafting grid */}
      <m.div style={{ ...GRID_STYLE, ...layerStyles.grid }} className="absolute inset-0 opacity-[0.035]" />

      {/* Waveforms, spectrum and annotations */}
      <m.svg
        style={layerStyles.waveform}
        className="absolute inset-0 w-full h-full opacity-[0.14]"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke="currentColor"
      >
        <g className="text-white">
          {/* Zero-volt reference line */}
          <line x1="0" y1={CENTER_Y} x2="1440" y2={CENTER_Y} strokeWidth="1" strokeDasharray="12 6" className="text-white/40" />

          {DB_LEVELS.map(({ offset, label }) => (
            <g key={offset} opacity="0.25">
              <line x1="60" y1={CENTER_Y + offset} x2="1380" y2={CENTER_Y + offset} strokeWidth="0.6" strokeDasharray="4 8" />
              <text x="70" y={CENTER_Y + offset - 4} fontSize="7.5" fontFamily="monospace" fill="currentColor">
                {label}
              </text>
            </g>
          ))}

          {TIME_TICKS.map((x) => (
            <line key={x} x1={x} y1="200" x2={x} y2="700" strokeWidth="0.5" strokeDasharray="2 10" className="text-white/20" />
          ))}

          {/* Fundamental f₀, 2nd and 3rd harmonics, and their composite S(t) */}
          <path d={pathFundamental} strokeWidth="1.2" strokeDasharray="6 4" className="text-white/40" />
          <path d={pathHarmonic2} strokeWidth="1" strokeDasharray="3 3" className="text-blue-400/50" />
          <path d={pathHarmonic3} strokeWidth="0.8" strokeDasharray="1 3" className="text-purple-400/50" />
          <path d={pathComposite} strokeWidth="2.2" className="text-cyan-400" />

          <text x="140" y={CENTER_Y - 120} fontSize="8.5" fontFamily="monospace" fill="currentColor" className="text-cyan-400">
            COMPOSITE SIGNAL: S(t) = ∑ A_n · sin(n·ω₀t + φ_n)
          </text>
          <text x="140" y={CENTER_Y - 95} fontSize="7.5" fontFamily="monospace" fill="currentColor" className="text-white/40">
            f₀ = 440.0 Hz [FUNDAMENTAL] // 2f₀ = 880 Hz // 3f₀ = 1320 Hz
          </text>

          {/* FFT bar spectrum, bottom right */}
          <g transform="translate(860, 580)" className="text-white">
            <line x1="0" y1="180" x2="480" y2="180" strokeWidth="1" />
            <line x1="0" y1="0" x2="0" y2="180" strokeWidth="1" />
            <text x="240" y="200" fontSize="8" fontFamily="monospace" fill="currentColor" textAnchor="middle">
              FREQUENCY (Hz) ──► LOG SCALE [20 Hz - 20 kHz]
            </text>
            <text x="-10" y="90" fontSize="8" fontFamily="monospace" fill="currentColor" transform="rotate(-90, -10, 90)" textAnchor="middle">
              MAGNITUDE (dB)
            </text>

            {FFT_PEAKS.map((peak) => (
              <g key={peak.x}>
                <line x1={peak.x} y1="180" x2={peak.x} y2={180 - peak.h} strokeWidth="2.5" className="text-cyan-400" />
                <circle cx={peak.x} cy={180 - peak.h} r="2.5" fill="#38bdf8" />
                <text x={peak.x} y={172 - peak.h} fontSize="7" fontFamily="monospace" fill="currentColor" textAnchor="middle" className="opacity-60">
                  {peak.p}
                </text>
                <text x={peak.x} y="192" fontSize="6.5" fontFamily="monospace" fill="currentColor" textAnchor="middle" className="opacity-50">
                  {peak.f}
                </text>
              </g>
            ))}
          </g>

          <g className="text-white/40 font-mono text-[9px] tracking-wider" fill="currentColor">
            <text x="80" y="210">CONTINUOUS FOURIER TRANSFORM: F(ξ) = ∫ f(t)·e^(-2πiξt) dt [-∞ to +∞]</text>
            <text x="80" y="228">INVERSE SYNTHESIS: f(t) = ∫ F(ξ)·e^(2πiξt) dξ [-∞ to +∞]</text>
            <text x="80" y="246">PARSEVAL ENERGY CONSERVATION: ∫ |f(t)|² dt = ∫ |F(ξ)|² dξ</text>
            <text x="80" y="264">SHANNON-NYQUIST THEOREM: f_sample ≥ 2·B_max (fs = 96 kHz)</text>
            <text x="80" y="282">WINDOWING: BLACKMAN-HARRIS 4-TERM // ENBW: 2.00 BINS</text>
          </g>
        </g>
      </m.svg>

      {/* Perimeter telemetry banner */}
      <m.div style={layerStyles.banner} className="absolute inset-6 md:inset-10 flex flex-col justify-between opacity-40 font-mono text-[10px] text-white tracking-widest uppercase pointer-events-none">
        <div className="flex justify-between">
          <span className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-cyan-400 animate-pulse" />
            FOURIER_ANALYSIS_SCHEMATIC // WAVEFORM_SLIDER_ACTIVE
          </span>
          <span>MODE: HORIZONTAL_AXIS_TRACK</span>
        </div>
        <div className="flex justify-between">
          <span>SAMPLING: 96.0 kS/s 24-BIT FLOAT</span>
          <span>CONTROL: X-AXIS SCRUBBED SINE CURVE</span>
        </div>
      </m.div>

      {/* Probe riding the composite wave */}
      <m.svg
        style={layerStyles.probe}
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g className="opacity-[0.16]">
          {/* Full-height reticle, and the drop line from the zero axis to the wave */}
          <m.line x1={ballX} y1="60" x2={ballX} y2="840" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-cyan-400" />
          <m.line x1={ballX} y1={CENTER_Y} x2={ballX} y2={ballY} stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" className="text-cyan-400" />

          {/* Reference bead on the fundamental */}
          <m.circle cx={ballX} cy={sineY} r="4.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2 2" className="text-white" />

          {/* Probe on the composite: halo, mid ring, center node */}
          <m.circle cx={ballX} cy={ballY} r="18" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 3" className="text-cyan-400" />
          <m.circle cx={ballX} cy={ballY} r="9" fill="currentColor" stroke="currentColor" strokeWidth="2" className="text-cyan-400/40" />
          <m.circle cx={ballX} cy={ballY} r="4" fill="currentColor" className="text-white" />

          {/* Anchor on the zero axis */}
          <m.circle cx={ballX} cy={CENTER_Y} r="3.5" fill="currentColor" className="text-cyan-400" />
        </g>

        {/* Telemetry badge attached to the probe */}
        <m.g style={{ x: ballX, y: ballY }} transform="translate(22, -32)">
          <rect x="0" y="-18" width="224" height="48" fill="rgba(10, 15, 26, 0.7)" stroke="#38bdf8" strokeOpacity="0.25" strokeWidth="1" />
          <m.text x="10" y="-3" fontSize="9" fontFamily="monospace" fill="#38bdf8" opacity="0.65" fontWeight="bold">
            {freqLine}
          </m.text>
          <m.text x="10" y="12" fontSize="7.5" fontFamily="monospace" fill="#ffffff" opacity="0.55">
            {phaseLine}
          </m.text>
          <m.text x="10" y="23" fontSize="7" fontFamily="monospace" fill="#38bdf8" opacity="0.5">
            {slopeLine}
          </m.text>
        </m.g>
      </m.svg>
    </div>
  );
}
