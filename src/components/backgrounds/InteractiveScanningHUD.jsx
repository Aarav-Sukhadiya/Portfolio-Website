import { useEffect, useRef } from 'react';
import { m, useMotionValue } from 'framer-motion';
import { useStageEnter } from '../stage/ScrollStage';
import CursorProbe from './CursorProbe';
import { blueprintGrid } from './blueprintGrid';
import { MAP_W, MAP_H, createLocator, formatLonLat } from './worldMapLocator';

// Projects background: faint world map and grid, with a radar probe that names the country or
// ocean under the cursor. Takes the stage `panel` because it drives its own entrance.
export default function InteractiveScanningHUD({ panel }) {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const placeName = useMotionValue('ACQUIRING…');
  const coordinates = useMotionValue('~0°N 0°E');
  const mapRef = useRef(null);

  useEffect(() => {
    let locate = null;
    let frame = 0;
    let cancelled = false;
    createLocator().then((fn) => { if (!cancelled) locate = fn; });

    // Map the cursor onto the object-cover world map image, then resolve the place under it
    const updateLocation = () => {
      frame = 0;
      const img = mapRef.current;
      if (!img || !locate) return;
      const rect = img.getBoundingClientRect();
      if (!rect.width) return;
      const scale = Math.max(rect.width / MAP_W, rect.height / MAP_H);
      const x = (mouseX.get() - rect.left - (rect.width - MAP_W * scale) / 2) / scale;
      const y = (mouseY.get() - rect.top - (rect.height - MAP_H * scale) / 2) / scale;
      const { name, lon, lat } = locate(x, y);
      placeName.set(name);
      coordinates.set(formatLonLat(lon, lat));
    };

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!frame) frame = requestAnimationFrame(updateLocation);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY, placeName, coordinates]);

  // The map arrives early and smoothly; the grid trails and snaps into place
  const mapStyle = useStageEnter(panel, 0.2, 50);
  const gridStyle = useStageEnter(panel, 0.8, 60);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <m.div style={mapStyle} className="absolute inset-0 z-0 opacity-[0.05] mix-blend-screen">
        <img ref={mapRef} src="/world-map.svg" className="absolute inset-0 w-full h-full object-cover object-center filter invert opacity-50" alt="" />
      </m.div>

      {/* Oversized so the grid already covers the screen while it slides in */}
      <m.div style={gridStyle} className="absolute inset-0 opacity-[0.04] z-10">
        <div className="w-[200vw] h-[200vh] -ml-[50vw] -mt-[50vh]" style={blueprintGrid(100)} />
      </m.div>

      <CursorProbe x={mouseX} y={mouseY} title="GEO_LOCK // RADAR" lines={[placeName, coordinates]} lineClassName="bg-white/30" />
    </div>
  );
}
