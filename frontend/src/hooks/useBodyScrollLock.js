import { useEffect } from "react";
import { getLenis } from "./useLenis";

let activeLockCount = 0;
let savedStyles = null;

/**
 * Reference-counted scroll lock that freezes both native document scrolling and
 * Lenis smooth scrolling while an overlay modal or drawer is open.
 */
export default function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked || typeof document === "undefined" || typeof window === "undefined") {
      return undefined;
    }

    if (activeLockCount === 0) {
      const docEl = document.documentElement;
      const body = document.body;
      const scrollbarWidth = Math.max(0, window.innerWidth - docEl.clientWidth);

      savedStyles = {
        htmlOverflow: docEl.style.overflow,
        bodyOverflow: body.style.overflow,
        bodyPaddingRight: body.style.paddingRight,
      };

      docEl.style.overflow = "hidden";
      body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        const computedRight = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
        body.style.paddingRight = `${computedRight + scrollbarWidth}px`;
      }

      getLenis()?.stop();
    }

    activeLockCount += 1;

    return () => {
      activeLockCount = Math.max(0, activeLockCount - 1);
      if (activeLockCount === 0 && savedStyles) {
        const docEl = document.documentElement;
        const body = document.body;
        docEl.style.overflow = savedStyles.htmlOverflow;
        body.style.overflow = savedStyles.bodyOverflow;
        body.style.paddingRight = savedStyles.bodyPaddingRight;
        savedStyles = null;
        getLenis()?.start();
      }
    };
  }, [locked]);
}
