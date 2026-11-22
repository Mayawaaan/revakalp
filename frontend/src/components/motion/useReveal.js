import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Registers scoped GSAP ScrollTrigger reveals, text masks, image parallax,
 * and hairlines inside containerRef. Fully bypasses animation under reducedMotion
 * and cleans up cleanly on unmount.
 */
export default function useReveal(containerRef, reducedMotion = false) {
  useEffect(() => {
    const root = containerRef?.current;
    if (!root || reducedMotion || typeof window === "undefined") return undefined;

    const ctx = gsap.context(() => {
      // Hairline accent draws
      gsap.utils.toArray("[data-line-draw]").forEach((line) => {
        gsap.from(line, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.7,
          ease: "power2.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: line,
            start: "top 92%",
            once: true,
          },
        });
      });

      // Masked heading & editorial text reveals
      gsap.utils.toArray('[data-reveal="heading"]').forEach((el) => {
        gsap.from(el, {
          yPercent: 32,
          opacity: 0,
          duration: 0.75,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            once: true,
          },
        });
      });

      // Staggered editorial / category card reveals
      const cards = gsap.utils.toArray('[data-reveal="card"]');
      if (cards.length) {
        ScrollTrigger.batch(cards, {
          start: "top 92%",
          once: true,
          onEnter: (batch) => {
            gsap.from(batch, {
              y: 22,
              opacity: 0,
              duration: 0.65,
              stagger: 0.06,
              ease: "power2.out",
              clearProps: "transform,opacity",
            });
          },
        });
      }

      // Subtle desktop-only parallax + reveal for editorial feature frames
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.utils.toArray('[data-reveal="image"]').forEach((frame) => {
          const img = frame.querySelector("img");
          gsap.from(frame, {
            opacity: 0.85,
            y: 24,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: frame,
              start: "top 90%",
              once: true,
            },
          });

          if (img) {
            gsap.fromTo(
              img,
              { scale: 1.06, yPercent: -2 },
              {
                scale: 1.0,
                yPercent: 2,
                ease: "none",
                scrollTrigger: {
                  trigger: frame,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              }
            );
          }
        });
      });
    }, root);

    return () => ctx.revert();
  }, [containerRef, reducedMotion]);
}
