import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function NeuralBlueprintBg() {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Blueprint Grid with Crosshair Ticks */}
      <div 
        className="absolute inset-0 opacity-[0.035]" 
        style={{ 
          backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 1px, transparent 1px), linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)', 
          backgroundSize: '100px 100px, 100px 100px, 100px 100px' 
        }} 
      />

      {/* 2. Deep Transformer Architecture Schematic Vector */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-[0.09]" 
        viewBox="0 0 1440 900" 
        preserveAspectRatio="xMidYMid slice"
        fill="none" 
        stroke="currentColor"
      >
        <g className="text-white" strokeWidth="1">
          {/* Transformer Block Blueprint on Left/Center */}
          <rect x="80" y="160" width="280" height="580" strokeDasharray="4 4" strokeWidth="1.5" />
          <text x="95" y="190" className="font-mono text-[11px] fill-white font-bold" stroke="none">TRANSFORMER_BLOCK_04</text>
          
          {/* Embedding & Input */}
          <rect x="120" y="660" width="200" height="40" />
          <text x="145" y="685" className="font-mono text-[9px] fill-white" stroke="none">INPUT_EMBEDDINGS [d=768]</text>
          <line x1="220" y1="660" x2="220" y2="620" markerEnd="url(#arrow)" />

          {/* Multi-Head Attention Unit */}
          <rect x="120" y="520" width="200" height="80" strokeWidth="1.5" />
          <text x="135" y="550" className="font-mono text-[10px] fill-white font-bold" stroke="none">MULTI-HEAD ATTENTION</text>
          <text x="135" y="570" className="font-mono text-[8px] fill-white/80" stroke="none">h=12 | d_k=64 | d_v=64</text>
          <text x="135" y="585" className="font-mono text-[8px] fill-white/60" stroke="none">Softmax(QK^T / √d_k) V</text>

          {/* Residual Skip Connection 1 */}
          <path d="M100,640 L80,640 L80,480 L120,480" strokeDasharray="3 3" />
          
          {/* Add & Norm 1 */}
          <rect x="120" y="460" width="200" height="35" />
          <text x="160" y="482" className="font-mono text-[9px] fill-white" stroke="none">ADD & LAYER_NORM</text>
          <line x1="220" y1="460" x2="220" y2="420" />

          {/* Feed Forward Network */}
          <rect x="120" y="320" width="200" height="80" strokeWidth="1.5" />
          <text x="140" y="350" className="font-mono text-[10px] fill-white font-bold" stroke="none">FEED_FORWARD_NETWORK</text>
          <text x="140" y="370" className="font-mono text-[8px] fill-white/80" stroke="none">Linear(768, 3072) -&gt; GELU</text>
          <text x="140" y="385" className="font-mono text-[8px] fill-white/60" stroke="none">Linear(3072, 768)</text>

          {/* Residual Skip Connection 2 */}
          <path d="M100,440 L80,440 L80,280 L120,280" strokeDasharray="3 3" />

          {/* Add & Norm 2 */}
          <rect x="120" y="260" width="200" height="35" />
          <text x="160" y="282" className="font-mono text-[9px] fill-white" stroke="none">ADD & LAYER_NORM</text>
          <line x1="220" y1="260" x2="220" y2="210" />

          {/* Linear Output / Head */}
          <rect x="120" y="170" width="200" height="35" />
          <text x="145" y="192" className="font-mono text-[9px] fill-white" stroke="none">LINEAR PROJ [VOCAB=50257]</text>

          {/* Right Side: Information Theory & Compression Blueprint Watermark */}
          <g transform="translate(1000, 180)">
            <rect x="0" y="0" width="360" height="260" strokeDasharray="4 4" />
            <text x="20" y="30" className="font-mono text-[10px] fill-white font-bold" stroke="none">ALGORITHMIC_INFORMATION_THEORY</text>
            <text x="20" y="60" className="font-mono text-[13px] fill-white/90" stroke="none">K(x) = min_p &#123; |p| : U(p) = x &#125;</text>
            <text x="20" y="90" className="font-mono text-[9px] fill-white/70" stroke="none">// Kolmogorov Complexity &amp; Solomonoff Induction</text>
            <text x="20" y="110" className="font-mono text-[9px] fill-white/70" stroke="none">// "Compression is Intelligence" — Marcus Hutter</text>
            
            {/* Model Loss Curves Graph */}
            <line x1="20" y1="220" x2="330" y2="220" />
            <line x1="20" y1="220" x2="20" y2="130" />
            <path d="M20,140 Q100,210 320,215" strokeWidth="1.5" />
            <text x="260" y="210" className="font-mono text-[8px] fill-white/60" stroke="none">VAL_LOSS: 0.182</text>
          </g>

          {/* Right Bottom: Architecture Dimensions Spec Table */}
          <g transform="translate(1000, 480)" className="font-mono text-[9px] fill-white/60" stroke="none">
            <text x="0" y="0" className="font-bold fill-white">ARCHITECTURE_SPECIFICATIONS:</text>
            <text x="0" y="25">PARAMETERS: 124,439,808 [GPT-2 SMALL]</text>
            <text x="0" y="45">LAYERS: 12 | HEADS: 12 | DIM: 768</text>
            <text x="0" y="65">TOKENIZER: BYTE-PAIR ENCODING [BPE]</text>
            <text x="0" y="85">HARDWARE_TARGET: CUDA_12.4 // SM_89</text>
            <text x="0" y="105">PRECISION: BF16_MIXED_AUTOCAST</text>
          </g>
        </g>
      </svg>

      {/* 3. Corner Telemetry Data */}
      <div className="absolute inset-6 md:inset-10 flex flex-col justify-between opacity-30 font-mono text-[10px] text-white tracking-widest uppercase">
        <div className="flex justify-between">
          <span className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-accent rounded-none animate-pulse" />
            MODEL_SCHEMATIC // SYS_ARCH_V4
          </span>
          <span>AUTOREGRESSIVE_CAUSAL_LM</span>
        </div>
        <div className="flex justify-between">
          <span>PARADIGM: TRANSFORMER_DECODER</span>
          <span>LOSS_FUNCTION: CROSS_ENTROPY</span>
        </div>
      </div>

      {/* 4. Mouse Interactive Gradient & Crosshair Probe */}
      <div className="mix-blend-difference absolute inset-0 z-20">
        <motion.div className="absolute top-0 left-0 w-full h-[1px] bg-white/20" style={{ y: smoothY }} />
        <motion.div className="absolute top-0 left-0 w-[1px] h-full bg-white/20" style={{ x: smoothX }} />
        
        <motion.div 
          className="absolute font-mono text-[9px] text-white/50 tracking-wider pl-3 pt-3"
          style={{ x: smoothX, y: smoothY }}
        >
          <span>PROBE // ATTN_WEIGHT: 0.941</span>
        </motion.div>
      </div>
    </div>
  );
}