import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;

/**
 * Returns the global Lenis instance (if initialized).
 * Useful for programmatic scrolling from other components.
 */
export const getLenis = () => lenisInstance;

/**
 * Initializes Lenis as the sole smooth-scroll driver and synchronizes
 * it with GSAP's ticker and ScrollTrigger. Honors prefers-reduced-motion.
 */
const useLenis = () => {
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mq = window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;

    let tickerFn = null;
    let currentLenis = null;

    const teardown = () => {
      if (tickerFn) {
        gsap.ticker.remove(tickerFn);
        tickerFn = null;
      }
      if (currentLenis) {
        currentLenis.off("scroll", ScrollTrigger.update);
        currentLenis.destroy();
        currentLenis = null;
      }
      lenisInstance = null;
    };

    const setup = () => {
      teardown();
      if (mq?.matches) {
        // Under reduced motion, keep native instant browser scrolling
        ScrollTrigger.refresh();
        return;
      }

      const lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
        infinite: false,
      });

      currentLenis = lenis;
      lenisInstance = lenis;

      lenis.on("scroll", ScrollTrigger.update);

      tickerFn = (time) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();
    };

    setup();

    const handleChange = () => setup();
    mq?.addEventListener("change", handleChange);

    return () => {
      mq?.removeEventListener("change", handleChange);
      teardown();
    };
  }, []);
};

export default useLenis;
