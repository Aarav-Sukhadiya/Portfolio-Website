import { useEffect, useState } from 'react';

// window.innerHeight, kept current on resize. Scroll scrub distances are derived from it.
export default function useViewportHeight() {
  const [vh, setVh] = useState(() => window.innerHeight);

  useEffect(() => {
    const handleResize = () => setVh(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return vh;
}
