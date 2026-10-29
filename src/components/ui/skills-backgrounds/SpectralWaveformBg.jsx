import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function SpectralWaveformBg({ style }) {
  // Normalized horizontal mouse coordinate (0 = far left, 1 = far right)
  const mouseNormX = useMotionValue(0.5);
  const smoothNormX = useSpring(mouseNormX, { damping: 25, stiffness: 220 });

  // Dynamic telemetry readout values that update in real time as the mouse moves
  const [telemetry, setTelemetry] = useState({
    freq: '1,420',
    volt: '+1.42',
    phase: '180.0',
    time: '2.50',
    db: '-12.4',
    slope: '-0.65'
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const w = window.innerWidth || 1440;
      // Only capture horizontal position, clamp within visible canvas
      const norm = Math.max(0.04, Math.min(0.96, e.clientX / w));
      mouseNormX.set(norm);

      // Meaningful real-time mathematical calculations for the slider box
      const t = norm * 4 * Math.PI; // 2 complete wave cycles
      const v = 1.1 * Math.sin(t) + 0.45 * Math.sin(2 * t + 0.5) + 0.25 * Math.sin(3 * t + 1.2);
      const dv = 1.1 * Math.cos(t) + 0.9 * Math.cos(2 * t + 0.5) + 0.75 * Math.cos(3 * t + 1.2);
      const deg = (norm * 720).toFixed(1);
      // Frequency from 40 Hz to 18,400 Hz across canvas
      const f = Math.round(40 * Math.pow(460, norm));
      const ms = (norm * 5.0).toFixed(2);
      const dbVal = (-24.0 + (v + 1.8) * 6.5).toFixed(1);

      setTelemetry({
        freq: f.toLocaleString(),
        volt: (v >= 0 ? '+' : '') + v.toFixed(2),
        phase: deg,
        time: ms,
        db: dbVal,
        slope: (dv >= 0 ? '+' : '') + dv.toFixed(2)
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseNormX]);

  // Coordinate mapping for SVG (1440x900)
  const width = 1440;
  const centerY = 450;

  // The ball's horizontal X position on the SVG canvas
  const ballX = useTransform(smoothNormX, n => n * width);

  // The ball's vertical Y position locked directly to the composite sine function S(t)
  // Only horizontal mouse movement drives this calculation
  const ballY = useTransform(ballX, x => {
    const t = (x / width) * 4 * Math.PI; // 2 complete wave cycles
    const y1 = 110 * Math.sin(t);
    const y2 = 45 * Math.sin(2 * t + 0.5);
    const y3 = 25 * Math.sin(3 * t + 1.2);
    return centerY + y1 + y2 + y3;
  });

  // Pure fundamental sine point at the same horizontal X position
  const sineY = useTransform(ballX, x => {
    const t = (x / width) * 4 * Math.PI;
    return centerY + 110 * Math.sin(t);
  });

  // Calculate waveform curve points for rendering
  const fundamentalPts = [];
  const harmonic2Pts = [];
  const harmonic3Pts = [];
  const compositePts = [];

  for (let x = 0; x <= width; x += 10) {
    const t = (x / width) * 4 * Math.PI;
    const y1 = 110 * Math.sin(t);
    const y2 = 45 * Math.sin(2 * t + 0.5);
    const y3 = 25 * Math.sin(3 * t + 1.2);
    const yComp = y1 + y2 + y3;

    fundamentalPts.push(`${x},${centerY + y1}`);
    harmonic2Pts.push(`${x},${centerY + y2}`);
    harmonic3Pts.push(`${x},${centerY + y3}`);
    compositePts.push(`${x},${centerY + yComp}`);
  }

  const pathFundamental = `M ${fundamentalPts.join(' L ')}`;
  const pathHarmonic2 = `M ${harmonic2Pts.join(' L ')}`;
  const pathHarmonic3 = `M ${harmonic3Pts.join(' L ')}`;
  const pathComposite = `M ${compositePts.join(' L ')}`;

  return (
    <motion.div style={style} className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Oscilloscope / Technical Drafting Grid */}
      <div 
        className="absolute inset-0 opacity-[0.035]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)', 
          backgroundSize: '80px 80px' 
        }} 
      />

      {/* 2. Passive Blueprint Waveforms & Mathematical Annotations */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-[0.14]" 
        viewBox="0 0 1440 900" 
        preserveAspectRatio="xMidYMid slice"
        fill="none" 
        stroke="currentColor"
      >
        <g className="text-white">
          {/* Central Ground Reticle (Zero Volts / Neutral Phase) */}
          <line x1="0" y1={centerY} x2="1440" y2={centerY} strokeWidth="1" strokeDasharray="12 6" className="text-white/40" />
          
          {/* Amplitude Decibel Levels */}
          {[-150, -75, 75, 150].map((offset, idx) => {
            const dbLabels = ['+12 dB', '+6 dB', '-6 dB', '-12 dB'];
            return (
              <g key={offset} opacity="0.25">
                <line x1="60" y1={centerY + offset} x2="1380" y2={centerY + offset} strokeWidth="0.6" strokeDasharray="4 8" />
                <text x="70" y={centerY + offset - 4} fontSize="7.5" fontFamily="monospace" fill="currentColor">
                  {dbLabels[idx]}
                </text>
              </g>
            );
          })}

          {/* Time Domain Sub-divisions (Vertical Division Ticks every 120px) */}
          {[120, 240, 360, 480, 600, 720, 840, 960, 1080, 1200, 1320].map((x) => (
            <line key={x} x1={x} y1="200" x2={x} y2="700" strokeWidth="0.5" strokeDasharray="2 10" className="text-white/20" />
          ))}

          {/* Waveforms */}
          {/* Fundamental Sine Component f₀ */}
          <path d={pathFundamental} strokeWidth="1.2" strokeDasharray="6 4" className="text-white/40" />
          {/* 2nd Harmonic Component 2f₀ */}
          <path d={pathHarmonic2} strokeWidth="1" strokeDasharray="3 3" className="text-blue-400/50" />
          {/* 3rd Harmonic Component 3f₀ */}
          <path d={pathHarmonic3} strokeWidth="0.8" strokeDasharray="1 3" className="text-purple-400/50" />

          {/* Composite Fourier Superposition Waveform S(t) */}
          <path d={pathComposite} strokeWidth="2.2" className="text-cyan-400" />

          {/* Waveform Labels in situ */}
          <text x="140" y={centerY - 120} fontSize="8.5" fontFamily="monospace" fill="currentColor" className="text-cyan-400">
            COMPOSITE SIGNAL: S(t) = ∑ A_n · sin(n·ω₀t + φ_n)
          </text>
          <text x="140" y={centerY - 95} fontSize="7.5" fontFamily="monospace" fill="currentColor" className="text-white/40">
            f₀ = 440.0 Hz [FUNDAMENTAL] // 2f₀ = 880 Hz // 3f₀ = 1320 Hz
          </text>

          {/* Frequency Domain Spectral Peaks (FFT Bar Spectrum at Bottom Right) */}
          <g transform="translate(860, 580)" className="text-white">
            <line x1="0" y1="180" x2="480" y2="180" strokeWidth="1" />
            <line x1="0" y1="0" x2="0" y2="180" strokeWidth="1" />
            <text x="240" y="200" fontSize="8" fontFamily="monospace" fill="currentColor" textAnchor="middle">
              FREQUENCY (Hz) ──► LOG SCALE [20 Hz - 20 kHz]
            </text>
            <text x="-10" y="90" fontSize="8" fontFamily="monospace" fill="currentColor" transform="rotate(-90, -10, 90)" textAnchor="middle">
              MAGNITUDE (dB)
            </text>

            {/* FFT Discrete Peak Bins */}
            {[
              { x: 60, h: 140, f: '440 Hz', p: '0 dB' },
              { x: 120, h: 90, f: '880 Hz', p: '-6 dB' },
              { x: 180, h: 55, f: '1.3 kHz', p: '-14 dB' },
              { x: 240, h: 35, f: '1.7 kHz', p: '-22 dB' },
              { x: 300, h: 20, f: '2.2 kHz', p: '-28 dB' },
              { x: 360, h: 12, f: '3.5 kHz', p: '-36 dB' },
            ].map((peak) => (
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

          {/* Mathematical Signal Processing Formulas */}
          <g className="text-white/40 font-mono text-[9px] tracking-wider" fill="currentColor">
            <text x="80" y="210">CONTINUOUS FOURIER TRANSFORM: F(ξ) = ∫ f(t)·e^(-2πiξt) dt [-∞ to +∞]</text>
            <text x="80" y="228">INVERSE SYNTHESIS: f(t) = ∫ F(ξ)·e^(2πiξt) dξ [-∞ to +∞]</text>
            <text x="80" y="246">PARSEVAL ENERGY CONSERVATION: ∫ |f(t)|² dt = ∫ |F(ξ)|² dξ</text>
            <text x="80" y="264">SHANNON-NYQUIST THEOREM: f_sample ≥ 2·B_max (fs = 96 kHz)</text>
            <text x="80" y="282">WINDOWING: BLACKMAN-HARRIS 4-TERM // ENBW: 2.00 BINS</text>
          </g>
        </g>
      </svg>

      {/* 3. Interactive Slider Ball & Hitbox */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-20" 
        viewBox="0 0 1440 900" 
        preserveAspectRatio="xMidYMid slice"
        fill="none" 
      >
        {/* Subtle schematic graphics at uniform blueprint opacity */}
        <g className="opacity-[0.16]">
          {/* Full-height Vertical Cursor Reticle Line */}
          <motion.line 
            x1={ballX} 
            y1="60" 
            x2={ballX} 
            y2="840" 
            stroke="currentColor" 
            strokeWidth="1" 
            strokeDasharray="4 4" 
            className="text-cyan-400"
          />

          {/* Amplitude Drop-Line between Ball and Neutral Center Axis (y = 450) */}
          <motion.line 
            x1={ballX} 
            y1={centerY} 
            x2={ballX} 
            y2={ballY} 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeDasharray="3 3"
            className="text-cyan-400"
          />

          {/* Fundamental Sine Reference Bead on pure wave */}
          <motion.circle 
            cx={ballX} 
            cy={sineY} 
            r="4.5" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.4" 
            strokeDasharray="2 2" 
            className="text-white"
          />

          {/* Interactive Primary Slider Ball on the Composite Sine Wave */}
          {/* Outer Halo Ring */}
          <motion.circle 
            cx={ballX} 
            cy={ballY} 
            r="18" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.2" 
            strokeDasharray="4 3" 
            className="text-cyan-400"
          />
          {/* Mid Ring */}
          <motion.circle 
            cx={ballX} 
            cy={ballY} 
            r="9" 
            fill="currentColor" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="text-cyan-400/40"
          />
          {/* Center Node */}
          <motion.circle 
            cx={ballX} 
            cy={ballY} 
            r="4" 
            fill="currentColor" 
            className="text-white"
          />

          {/* Ground Axis Anchor Marker */}
          <motion.circle 
            cx={ballX} 
            cy={centerY} 
            r="3.5" 
            fill="currentColor" 
            className="text-cyan-400"
          />
        </g>

        {/* Real-time Oscilloscope Telemetry Badge Attached to the Slider Node */}
        <motion.g 
          style={{ x: ballX, y: ballY }}
          transform="translate(22, -32)"
        >
          {/* Badge Background Box (Matches subtle blueprint background tone) */}
          <rect 
            x="0" 
            y="-18" 
            width="224" 
            height="48" 
            fill="rgba(10, 15, 26, 0.7)" 
            stroke="#38bdf8" 
            strokeOpacity="0.25"
            strokeWidth="1" 
            rx="0"
          />
          {/* Top Line: Frequency & Instantaneous Voltage - Clear & slightly brighter */}
          <text 
            x="10" 
            y="-3" 
            fontSize="9" 
            fontFamily="monospace" 
            fill="#38bdf8" 
            opacity="0.65" 
            fontWeight="bold"
          >
            OSC_PROBE // f: {telemetry.freq} Hz | V: {telemetry.volt}V
          </text>
          {/* Bottom Line: Phase Angle, Time Delay & Power - Legible neutral readout */}
          <text 
            x="10" 
            y="12" 
            fontSize="7.5" 
            fontFamily="monospace" 
            fill="#ffffff" 
            opacity="0.55"
          >
            θ: {telemetry.phase}° | t: {telemetry.time}ms | {telemetry.db}dBm
          </text>
          {/* Derivative / Slope - Technical cyan metadata */}
          <text 
            x="10" 
            y="23" 
            fontSize="7" 
            fontFamily="monospace" 
            fill="#38bdf8" 
            opacity="0.5"
          >
            dV/dt: {telemetry.slope} V/ms [SLIDER: HORIZONTAL]
          </text>
        </motion.g>
      </svg>

      {/* 4. Perimeter Technical Telemetry Banner */}
      <div className="absolute inset-6 md:inset-10 flex flex-col justify-between opacity-40 font-mono text-[10px] text-white tracking-widest uppercase pointer-events-none">
        <div className="flex justify-between">
          <span className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-cyan-400 rounded-none animate-pulse" />
            FOURIER_ANALYSIS_SCHEMATIC // WAVEFORM_SLIDER_ACTIVE
          </span>
          <span>MODE: HORIZONTAL_AXIS_TRACK</span>
        </div>
        <div className="flex justify-between">
          <span>SAMPLING: 96.0 kS/s 24-BIT FLOAT</span>
          <span>CONTROL: X-AXIS SCRUBBED SINE CURVE</span>
        </div>
      </div>
    </motion.div>
  );
}
