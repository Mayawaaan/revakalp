import { useEffect, useRef } from "react";
import Lenis from "lenis";

let lenisInstance = null;

/**
 * Returns the global Lenis instance (if initialized).
 * Useful for programmatic scrolling from other components.
 */
export const getLenis = () => lenisInstance;

/**
 * Initializes Lenis smooth scroll and keeps it running via rAF.
 * Call this once at the App root level.
 */
const useLenis = () => {
  const rafRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisInstance = lenis;

    const raf = (time) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
};

export default useLenis;
