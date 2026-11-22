import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ribbonVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float wave1 = sin(pos.x * 1.4 + uTime * 0.9 + uProgress * 3.14159) * 0.24;
    float wave2 = cos(pos.y * 2.2 - uTime * 0.7) * 0.12;
    pos.z += wave1 + wave2;
    vElevation = wave1 + wave2;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const ribbonFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uBurgundy;
  uniform vec3 uDeep;
  uniform vec3 uGold;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    float stripe = smoothstep(0.46, 0.5, abs(fract(vUv.y * 12.0 + vUv.x * 0.35) - 0.5));
    float sheen = smoothstep(-0.15, 0.32, vElevation);
    vec3 base = mix(uDeep, uBurgundy, sheen);
    float goldThread = smoothstep(0.75, 0.98, sin(vUv.x * 42.0 + vUv.y * 18.0 - uTime * 0.8) * 0.5 + 0.5) * 0.35;
    vec3 col = mix(base, uGold, clamp(stripe * 0.55 + goldThread, 0.0, 0.85));
    gl_FragColor = vec4(col, 0.96);
  }
`;

function SilkRibbon({ progress = 0, progressRef = null, active = true }) {
  const matRef = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: progressRef ? progressRef.current : progress },
      uBurgundy: { value: new THREE.Color("#38131E") },
      uDeep: { value: new THREE.Color("#2B0E17") },
      uGold: { value: new THREE.Color("#D4AF63") },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (matRef.current && !progressRef) {
      matRef.current.uniforms.uProgress.value = progress;
    }
  }, [progress, progressRef]);

  useFrame((state) => {
    if (!matRef.current) return;
    if (progressRef) {
      matRef.current.uniforms.uProgress.value = progressRef.current;
    }
    if (!active) return;
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh rotation={[-0.22, 0.12, -0.08]}>
      <planeGeometry args={[6.4, 2.8, 48, 24]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={ribbonVertexShader}
        fragmentShader={ribbonFragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        transparent
      />
    </mesh>
  );
}

export default function FabricStudy({ progress = 0, progressRef = null, paused = false }) {
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(
    typeof document !== "undefined" ? !document.hidden : true
  );
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const active = inView && tabVisible && !paused;

  return (
    <div ref={containerRef} className="w-full h-full">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={active ? "always" : "demand"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 4.2], fov: 42 }}
      >
        <SilkRibbon progress={progress} progressRef={progressRef} active={active} />
      </Canvas>
    </div>
  );
}
