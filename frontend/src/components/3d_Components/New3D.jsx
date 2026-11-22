import React, { useRef, Suspense, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  Environment,
  ContactShadows,
  PresentationControls,
  Sparkles,
} from "@react-three/drei";
import { Wind } from "lucide-react";
import Pod from "./Pod";
import ProceduralEthnicWear from "./ProceduralEthnicWear";
import { WEAVE_PALETTES } from "./glslMaterials";

/** Architectural gold zari filigree halo framing the couture centerpiece */
const ArchitecturalArchHalo = ({ active = true }) => {
  const ringRef = useRef();
  const innerRef = useRef();

  useFrame((state) => {
    if (!active) return;
    const t = state.clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.rotation.z = Math.sin(t * 0.25) * 0.08;
    }
    if (innerRef.current) {
      innerRef.current.rotation.z = -Math.cos(t * 0.2) * 0.1;
    }
  });

  return (
    <group position={[0, 0.2, -1.65]}>
      <mesh ref={ringRef}>
        <torusGeometry args={[2.55, 0.012, 12, 96]} />
        <meshStandardMaterial
          color="#D4AF63"
          metalness={0.85}
          roughness={0.28}
          transparent
          opacity={0.52}
        />
      </mesh>
      <mesh ref={innerRef}>
        <torusGeometry args={[2.28, 0.006, 10, 96]} />
        <meshStandardMaterial
          color="#F1D889"
          metalness={0.75}
          roughness={0.35}
          transparent
          opacity={0.32}
        />
      </mesh>
    </group>
  );
};

/** Instanced gold/ivory motes — 1 draw call */
const WindDust = ({ count = 56, active = true }) => {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const motes = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: (Math.random() - 0.5) * 10,
        y: Math.random() * 5.5 - 1.5,
        z: (Math.random() - 0.5) * 6,
        speed: 0.002 + Math.random() * 0.006,
        driftX: (Math.random() - 0.5) * 0.004,
        driftZ: (Math.random() - 0.5) * 0.006,
        scale: 0.5 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
      })),
    [count]
  );

  useFrame((state) => {
    if (!active || !meshRef.current) return;
    const time = state.clock.elapsedTime;
    for (let i = 0; i < motes.length; i++) {
      const p = motes[i];
      p.y += p.speed;
      if (p.y > 4.2) {
        p.y = -1.6;
        p.x = (Math.random() - 0.5) * 10;
        p.z = (Math.random() - 0.5) * 6;
      }
      p.x += p.driftX + Math.sin(time * 1.4 + p.phase) * -0.006;
      p.z += p.driftZ + Math.cos(time * 1.1 + p.phase) * 0.005;

      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.022, 6, 6]} />
      <meshBasicMaterial
        color="#F1D889"
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </instancedMesh>
  );
};

const CameraRig = ({ offsetRight = false }) => {
  const { camera, size } = useThree();
  useEffect(() => {
    if (!offsetRight) {
      camera.clearViewOffset();
      camera.updateProjectionMatrix();
      return undefined;
    }
    camera.setViewOffset(
      size.width,
      size.height,
      -size.width * 0.25,
      0,
      size.width,
      size.height
    );
    camera.updateProjectionMatrix();
    return () => camera.clearViewOffset();
  }, [camera, size, offsetRight]);
  return null;
};

const ParallaxWrapper = ({ children, hovered, active }) => {
  const groupRef = useRef();
  useFrame((state) => {
    if (!active || !groupRef.current) return;
    const parallaxRotY = hovered ? state.pointer.x * 0.45 : 0;
    const parallaxRotX = hovered ? -(state.pointer.y * 0.18) : 0;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      parallaxRotY,
      0.08
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      parallaxRotX,
      0.08
    );
  });
  return <group ref={groupRef}>{children}</group>;
};

const Scene = ({ hovered, active, offsetRight, paletteKey, breezeBoost }) => (
  <>
    <CameraRig offsetRight={offsetRight} />
    <ambientLight intensity={0.95} color="#F7F1E5" />
    <directionalLight
      position={[4, 8, 4]}
      intensity={2.2}
      castShadow
      shadow-mapSize={[512, 512]}
      shadow-bias={-0.0005}
      color="#FFF7EA"
    />
    <directionalLight position={[0, 2, 8]} intensity={1.7} color="#F7F1E5" />
    <directionalLight position={[-5, 4, -2]} intensity={1.4} color="#F1D889" />
    <pointLight position={[-3, 1, 3]} intensity={0.9} color="#8A3248" />
    <pointLight position={[0, 6, 0]} intensity={0.7} color="#F1D889" />

    <Environment preset="studio" background={false} />

    <ArchitecturalArchHalo active={active} />

    <group position={[0, 0, 0]}>
      <ContactShadows
        position={[0, -2.5, 0]}
        opacity={0.35}
        scale={10}
        blur={2.8}
        far={4}
        color="#2B0E17"
      />
      <Pod
        position={[0, -1.65, 0]}
        scale={1.25}
        color="#2B0E17"
        accentColor="#F7F1E5"
        glowColor="#D4AF63"
        active={active}
      />
    </group>

    <PresentationControls
      global={false}
      cursor={true}
      snap={true}
      rotation={[0, 0, 0]}
      polar={[-0.22, 0.22]}
      azimuth={[-Math.PI, Math.PI]}
      config={{ mass: 1, tension: 170, friction: 16 }}
    >
      <ParallaxWrapper hovered={hovered} active={active}>
        <ProceduralEthnicWear
          paletteKey={paletteKey}
          breezeBoost={breezeBoost}
          active={active}
          position={[0, 1.22, 0]}
          scale={1.56}
        />
      </ParallaxWrapper>
    </PresentationControls>

    {active && (
      <Sparkles
        count={28}
        scale={[4.5, 5, 4.5]}
        size={1.6}
        speed={0.35}
        opacity={0.45}
        color="#F1D889"
      />
    )}
    <WindDust count={56} active={active} />
  </>
);

const PALETTE_ENTRIES = Object.entries(WEAVE_PALETTES);

const New3D = ({ offsetRight = false, onReady, paused = false }) => {
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(true);
  const [paletteKey, setPaletteKey] = useState("burgundy");
  const [breezeBoost, setBreezeBoost] = useState(false);
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
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const active = inView && tabVisible && !paused;

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <Canvas
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onCreated={() => {
          if (onReady) onReady();
        }}
        shadows
        dpr={[1, 1.5]}
        frameloop={active ? "always" : "demand"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: 42, position: [0, 1.35, 9] }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene
            hovered={hovered}
            active={active}
            offsetRight={offsetRight}
            paletteKey={paletteKey}
            breezeBoost={breezeBoost}
          />
        </Suspense>
      </Canvas>

      {/* Architectural Weave Palette & Breeze Controls */}
      <div
        role="toolbar"
        aria-label="3D Couture Weave and Breeze Controls"
        className="pointer-events-auto absolute bottom-3 inset-x-3 z-10 flex flex-wrap items-center justify-center gap-1.5"
      >
        {PALETTE_ENTRIES.map(([key, palette]) => {
          const selected = paletteKey === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setPaletteKey(key)}
              aria-pressed={selected}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] text-[10px] uppercase tracking-[0.16em] border backdrop-blur-xs transition-colors cursor-pointer ${
                selected
                  ? "bg-[#F7F1E5] text-[#2B0E17] border-[#F1D889] font-semibold"
                  : "bg-[#2B0E17]/82 text-[#F1D889]/90 border-[#D4AF63]/40 hover:bg-[#38131E]"
              }`}
            >
              <span
                aria-hidden="true"
                className="w-2.5 h-2.5 rounded-[1px] border border-[#D4AF63]/60 shrink-0"
                style={{ backgroundColor: palette.base }}
              />
              <span>{palette.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setBreezeBoost((prev) => !prev)}
          aria-pressed={breezeBoost}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] text-[10px] uppercase tracking-[0.16em] border backdrop-blur-xs transition-colors cursor-pointer ${
            breezeBoost
              ? "bg-[#D4AF63] text-[#2B0E17] border-[#F1D889] font-semibold"
              : "bg-[#2B0E17]/82 text-[#F1D889]/90 border-[#D4AF63]/40 hover:bg-[#38131E]"
          }`}
        >
          <Wind className="w-3 h-3" />
          <span>Breeze</span>
        </button>
      </div>
    </div>
  );
};

export default New3D;
