import { useMemo } from 'react';
import { useTransform } from 'framer-motion';

// A lightweight cubic bezier solver for scroll-linked animations
export function createBezierEasing(x1, y1, x2, y2) {
  return function(t) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    let T = t;
    for (let i = 0; i < 5; i++) {
      const currentX = 3*Math.pow(1-T,2)*T*x1 + 3*(1-T)*Math.pow(T,2)*x2 + Math.pow(T,3);
      const derivativeX = 3*Math.pow(1-T,2)*x1 - 6*T*(1-T)*x1 + 6*T*(1-T)*x2 - 3*Math.pow(T,2)*x2 + 3*Math.pow(T,2);
      const diff = currentX - t;
      if (Math.abs(diff) < 0.001) break;
      T = T - diff / (derivativeX || 1);
      T = Math.max(0, Math.min(1, T));
    }
    return 3*Math.pow(1-T,2)*T*y1 + 3*(1-T)*Math.pow(T,2)*y2 + Math.pow(T,3);
  };
}

// Position-aware scroll transform with deterministic organic variation. Used by the stage's
// useStageEnter; basePosition is its `lead` (0 = farthest from the entry edge and arrives first,
// 1 = nearest and trails).
export default function usePositionAwareTransform(scrollY, inputRange, basePosition, index = 0, outputRange = ["100vw", "0vw"]) {
  // Deterministic noise between -0.15 and +0.15 based on index to add organic variety.
  // This ensures that items on similar Y or X levels don't feel identically timed.
  const customEase = useMemo(() => {
    const noise = ((index * 29) % 30) / 100 - 0.15;
    const effectivePos = Math.max(0, Math.min(1, basePosition + noise));
    const l = (start, end) => start + (end - start) * effectivePos;

    // Interpolate the bezier control points by lead:
    // lead 0: [0.05, 0.9, 0.1, 1.0] -> fast start, slow finish
    // lead 1: [0.8, 0.0, 0.2, 1.0] -> slow start, fast middle, controlled finish
    return createBezierEasing(l(0.05, 0.8), l(0.9, 0.0), l(0.1, 0.2), 1.0);
  }, [basePosition, index]);

  return useTransform(scrollY, inputRange, outputRange, { ease: customEase });
}
