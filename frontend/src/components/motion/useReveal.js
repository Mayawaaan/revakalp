import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Registers scoped GSAP ScrollTrigger reveals, text masks, image parallax,
 * and hairlines inside containerRef across mobile, tablet, and desktop.
 * Observes DOM mutations so asynchronously loaded catalog cards animate too.
 */
export default function useReveal(containerRef, reducedMotion = false) {
  useEffect(() => {
    const root = containerRef?.current;
    if (!root || reducedMotion || typeof window === "undefined") return undefined;

    let rafId = null;

    const ctx = gsap.context(() => {
      const bindReveals = () => {
        // Hairline accent draws
        gsap.utils.toArray("[data-line-draw]", root).forEach((line) => {
          if (line.dataset.rkRevealed === "1") return;
          line.dataset.rkRevealed = "1";
          gsap.from(line, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.7,
            ease: "power2.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: line,
              start: "top 94%",
              once: true,
            },
          });
        });

        // Heading & editorial text reveals
        gsap.utils.toArray('[data-reveal="heading"]', root).forEach((el) => {
          if (el.dataset.rkRevealed === "1") return;
          el.dataset.rkRevealed = "1";
          gsap.from(el, {
            y: 26,
            opacity: 0,
            duration: 0.75,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: el,
              start: "top 94%",
              once: true,
            },
          });
        });

        // Staggered editorial / product / category card reveals
        const unrevealedCards = gsap.utils
          .toArray('[data-reveal="card"]', root)
          .filter((el) => el.dataset.rkRevealed !== "1");

        if (unrevealedCards.length) {
          unrevealedCards.forEach((el) => {
            el.dataset.rkRevealed = "1";
          });
          ScrollTrigger.batch(unrevealedCards, {
            start: "top 94%",
            once: true,
            onEnter: (batch) => {
              gsap.from(batch, {
                y: 26,
                opacity: 0,
                duration: 0.65,
                stagger: 0.07,
                ease: "power2.out",
                clearProps: "transform,opacity",
              });
            },
          });
        }

        // Image frame reveals + subtle parallax on all viewports
        gsap.utils.toArray('[data-reveal="image"]', root).forEach((frame) => {
          if (frame.dataset.rkRevealed === "1") return;
          frame.dataset.rkRevealed = "1";
          const img = frame.querySelector("img");
          gsap.from(frame, {
            opacity: 0,
            y: 28,
            scale: 0.985,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: frame,
              start: "top 92%",
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
      };

      bindReveals();

      const observer = new MutationObserver(() => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          bindReveals();
          ScrollTrigger.refresh();
        });
      });

      observer.observe(root, { childList: true, subtree: true });

      return () => {
        observer.disconnect();
        if (rafId) cancelAnimationFrame(rafId);
      };
    }, root);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ctx.revert();
    };
  }, [containerRef, reducedMotion]);
}
