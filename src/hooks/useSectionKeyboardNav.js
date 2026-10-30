import { useEffect, useRef } from 'react';

// Scroll stops for PageUp/PageDown/Space. `home` is the page top; `projects` is the
// positioned anchor inside the hero scrub, not the top of a section.
const SECTION_IDS = ['projects', 'about', 'skills', 'experience', 'education', 'contact'];
const DEDUPE_PX = 20;
const THRESHOLD_PX = 25;
const IGNORED_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON']);

function getStops() {
  const positions = [0];
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (el) positions.push(Math.round(el.getBoundingClientRect().top + window.scrollY));
  }
  positions.sort((a, b) => a - b);
  return positions.filter((pos, idx, arr) => idx === 0 || pos - arr[idx - 1] > DEDUPE_PX);
}

// Makes PageUp/PageDown/Space jump between section stops instead of fixed viewport pages
export default function useSectionKeyboardNav() {
  // Destination of an in-flight smooth scroll, so repeated presses keep advancing
  const destinationRef = useRef(null);

  useEffect(() => {
    let resetTimeout;

    const handleScroll = () => {
      if (destinationRef.current !== null && Math.abs(window.scrollY - destinationRef.current) < 10) {
        destinationRef.current = null;
      }
    };

    const handleKeyDown = (e) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const target = e.target;
      if (target && (IGNORED_TAGS.has(target.tagName) || target.isContentEditable)) return;

      const isNext = e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey);
      const isPrev = e.key === 'PageUp' || (e.key === ' ' && e.shiftKey);
      if (!isNext && !isPrev) return;

      e.preventDefault();

      const stops = getStops();
      const reference = destinationRef.current ?? window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      const destination = isNext
        ? stops.find((pos) => pos > reference + THRESHOLD_PX) ?? maxScroll
        : stops.findLast((pos) => pos < reference - THRESHOLD_PX) ?? 0;

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      destinationRef.current = destination;
      window.scrollTo({ top: destination, behavior: reduceMotion ? 'auto' : 'smooth' });

      // Safeguard in case the smooth scroll is interrupted before arriving
      clearTimeout(resetTimeout);
      resetTimeout = setTimeout(() => {
        destinationRef.current = null;
      }, 750);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(resetTimeout);
    };
  }, []);
}
