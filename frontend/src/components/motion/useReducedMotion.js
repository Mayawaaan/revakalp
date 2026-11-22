import { useEffect, useState } from "react";

export function checkReducedMotion() {
  if (typeof window === "undefined") return false;
  try {
    if (document.documentElement?.dataset?.reducedMotion === "true") return true;
    if (window.localStorage?.getItem("rk_reduced_motion") === "true") return true;
  } catch {
    // ignore storage access issues
  }
  return false;
}

export function checkWebGLSupport() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export default function useReducedMotion() {
  const [reduced, setReduced] = useState(checkReducedMotion);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const onChange = () => setReduced(checkReducedMotion());
    window.addEventListener("rk-reduced-motion-change", onChange);
    return () => window.removeEventListener("rk-reduced-motion-change", onChange);
  }, []);

  return reduced;
}
