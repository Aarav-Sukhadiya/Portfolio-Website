import { useTransform } from 'framer-motion';

// A lightweight cubic bezier solver for scroll-linked animations
export function createBezierEasing(x1, y1, x2, y2) {
  return function(t) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    let T = t;
    for (let i = 0; i < 5; i++) {
      let currentX = 3*Math.pow(1-T,2)*T*x1 + 3*(1-T)*Math.pow(T,2)*x2 + Math.pow(T,3);
      let derivativeX = 3*Math.pow(1-T,2)*x1 - 6*T*(1-T)*x1 + 6*T*(1-T)*x2 - 3*Math.pow(T,2)*x2 + 3*Math.pow(T,2);
      let diff = currentX - t;
      if (Math.abs(diff) < 0.001) break;
      T = T - diff / (derivativeX || 1);
      T = Math.max(0, Math.min(1, T));
    }
    return 3*Math.pow(1-T,2)*T*y1 + 3*(1-T)*Math.pow(T,2)*y2 + Math.pow(T,3);
  };
}

// A custom hook for position-aware transforms with deterministic organic variation
export default function usePositionAwareTransform(scrollY, scrubDistance, basePosition, index = 0, outputRange = ["100vw", "0vw"]) {
  // Deterministic noise between -0.15 and +0.15 based on index to add organic variety.
  // This ensures that items on similar Y or X levels don't feel identically timed.
  const noise = ((index * 29) % 30) / 100 - 0.15;
  const effectivePos = Math.max(0, Math.min(1, basePosition + noise));
  
  const l = (start, end) => start + (end - start) * effectivePos;
  
  // Interpolate bezier control points based on horizontal position
  // Far Left (xPos=0): [0.05, 0.9, 0.1, 1.0] -> fast initial, slow finish
  // Far Right (xPos=1): [0.8, 0.0, 0.2, 1.0] -> slow initial, fast middle, controlled finish
  const x1 = l(0.05, 0.8);
  const y1 = l(0.9, 0.0);
  const x2 = l(0.1, 0.2);
  const y2 = 1.0;
  
  const customEase = createBezierEasing(x1, y1, x2, y2);
  return useTransform(scrollY, [0, scrubDistance], outputRange, { ease: customEase });
}
