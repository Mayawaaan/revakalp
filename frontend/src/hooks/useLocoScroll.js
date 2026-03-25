import { useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";

export default function useLocoScroll(options = {}) {
  const scrollRef = useRef(null);
  const locoRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    locoRef.current = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      lerp: 0.08,
      multiplier: 1,
      smartphone: { smooth: true },
      tablet: { smooth: true },
      ...options,
    });

    return () => {
      locoRef.current?.destroy();
      locoRef.current = null;
    };
  }, []);

  return scrollRef;
}