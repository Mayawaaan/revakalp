import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SHADER_PRESETS = {
  maheshwari: {
    patternType: 0,
    primary: "#38131E",
    secondary: "#2B0E17",
    zari: "#D4AF63",
    accent: "#F1D889",
  },
  "kosa-silk": {
    patternType: 1,
    primary: "#7E5629",
    secondary: "#472916",
    zari: "#E2BA64",
    accent: "#F7F1E5",
  },
  "bandhani-leheriya": {
    patternType: 2,
    primary: "#5B1429",
    secondary: "#260811",
    zari: "#D4AF63",
    accent: "#F7E7C4",
  },
  kanjivaram: {
    patternType: 3,
    primary: "#3F0D1D",
    secondary: "#1E060E",
    zari: "#E4BC62",
    accent: "#F5DDA0",
  },
  paithani: {
    patternType: 4,
    primary: "#4C142F",
    secondary: "#230816",
    zari: "#D8B35E",
    accent: "#F1D889",
  },
  pashmina: {
    patternType: 5,
    primary: "#C9B79C",
    secondary: "#755942",
    zari: "#38131E",
    accent: "#F7F1E5",
  },
};

const silkDraperyVertex = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uBreeze;
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormalApprox;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float phase = uTime * 0.72 * uBreeze + uProgress * 4.2;
    float wave1 = sin(pos.x * 1.25 + phase) * (0.24 + 0.08 * uBreeze);
    float wave2 = cos(pos.y * 1.9 - uTime * 0.55 * uBreeze) * 0.13;
    float fold = sin((pos.x * 0.75 + pos.y * 1.1) * 2.4 + phase * 0.6) * 0.09;

    float disp = wave1 + wave2 + fold;
    pos.z += disp;
    vElevation = disp;

    float dx = cos(pos.x * 1.25 + phase) * 0.30 + cos((pos.x * 0.75 + pos.y * 1.1) * 2.4 + phase * 0.6) * 0.16;
    float dy = -sin(pos.y * 1.9 - uTime * 0.55 * uBreeze) * 0.24 + cos((pos.x * 0.75 + pos.y * 1.1) * 2.4 + phase * 0.6) * 0.22;
    vNormalApprox = normalize(vec3(-dx, -dy, 1.0));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const silkDraperyFragment = /* glsl */ `
  uniform float uTime;
  uniform float uPatternType;
  uniform float uZoom;
  uniform float uLightAngle;
  uniform vec3 uPrimary;
  uniform vec3 uSecondary;
  uniform vec3 uZari;
  uniform vec3 uAccent;
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormalApprox;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main() {
    vec2 uv = (vUv - 0.5) * (1.0 / max(uZoom, 0.5)) + 0.5;
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 lightDir = normalize(vec3(cos(uLightAngle * 3.14159), sin(uLightAngle * 3.14159) * 0.5 + 0.35, 0.72));
    vec3 halfVec = normalize(lightDir + viewDir);

    float diff = clamp(dot(vNormalApprox, lightDir), 0.15, 1.0);
    float spec = pow(max(dot(vNormalApprox, halfVec), 0.0), 22.0);
    float fresnel = pow(1.0 - max(dot(vNormalApprox, viewDir), 0.0), 2.5);

    // Base micro yarn cross-weave
    float warp = sin(uv.x * 260.0) * 0.5 + 0.5;
    float weft = sin(uv.y * 260.0) * 0.5 + 0.5;
    float microWeave = mix(warp, weft, 0.5) * 0.08;

    float patZari = 0.0;
    float patAccent = 0.0;

    if (uPatternType < 0.5) {
      // 0: Maheshwari — Narmada wave border & reversible chatai grid
      float borderBand = smoothstep(0.14, 0.16, abs(uv.y - 0.5)) * (1.0 - smoothstep(0.32, 0.34, abs(uv.y - 0.5)));
      float wave = abs(fract(uv.x * 16.0 + abs(fract(uv.y * 24.0) - 0.5)) - 0.5);
      float chatai = smoothstep(0.38, 0.48, abs(fract(uv.x * 36.0) - 0.5)) * smoothstep(0.38, 0.48, abs(fract(uv.y * 36.0) - 0.5));
      patZari = clamp((1.0 - borderBand) * 0.65 * (1.0 - smoothstep(0.18, 0.28, wave)) + chatai * 0.22, 0.0, 0.85);
      patAccent = smoothstep(0.82, 0.98, sin(uv.y * 52.0)) * 0.16;
    } else if (uPatternType < 1.5) {
      // 1: Kosa Silk — Organic wild tussar slubbing + minimal horizontal horizon stripe
      float slub = hash21(vec2(floor(uv.y * 140.0), floor(uv.x * 14.0)));
      float slubStreak = smoothstep(0.76, 0.98, slub) * 0.28;
      float band = smoothstep(0.88, 0.96, abs(fract(uv.x * 5.0 + 0.15) - 0.5) * 2.0);
      patZari = clamp(slubStreak + band * 0.52, 0.0, 0.8);
      patAccent = spec * 0.35;
    } else if (uPatternType < 2.5) {
      // 2: Bandhani & Leheriya — Knot-resist Ekdali dots + diagonal monsoon wave ribbons
      vec2 grid = fract(uv * vec2(26.0, 18.0)) - 0.5;
      float dotMask = 1.0 - smoothstep(0.14, 0.24, length(grid));
      float waveStripe = smoothstep(0.82, 0.96, sin((uv.x * 24.0 + uv.y * 18.0) + sin(uv.x * 6.0) * 1.4) * 0.5 + 0.5);
      patAccent = clamp(dotMask * 0.58 + waveStripe * 0.22, 0.0, 0.82);
      patZari = smoothstep(0.45, 0.5, abs(fract(uv.y * 8.0) - 0.5)) * 0.22;
    } else if (uPatternType < 3.5) {
      // 3: Kanjivaram — Gopuram temple spires along upper/lower borders + rich silk kattam checks
      float edgeDist = min(uv.y, 1.0 - uv.y);
      float spire = abs(fract(uv.x * 22.0) - 0.5) * 0.11;
      float gopuramMask = 1.0 - smoothstep(0.14 + spire, 0.155 + spire, edgeDist);
      float kattam = max(smoothstep(0.92, 0.98, abs(sin(uv.x * 48.0))), smoothstep(0.92, 0.98, abs(sin(uv.y * 48.0)))) * 0.2;
      patZari = clamp(gopuramMask * 0.72 + kattam, 0.0, 0.9);
      patAccent = gopuramMask * 0.2;
    } else if (uPatternType < 4.5) {
      // 4: Paithani — Oblique geometric lattice + medallion shimmer along pallu end
      vec2 rotUv = mat2(0.707, -0.707, 0.707, 0.707) * (uv * 22.0);
      float diamond = smoothstep(0.75, 0.92, abs(sin(rotUv.x) * sin(rotUv.y)));
      float pallu = smoothstep(0.68, 0.85, uv.x);
      patZari = clamp(diamond * (0.28 + pallu * 0.55), 0.0, 0.88);
      patAccent = spec * 0.42;
    } else {
      // 5: Pashmina — Featherlight 2/2 diagonal twill grain + delicate perimeter frame
      float twill = smoothstep(0.42, 0.85, sin((uv.x * 180.0 + uv.y * 180.0)) * 0.5 + 0.5) * 0.22;
      float frame = step(0.92, abs(uv.y - 0.5) * 2.0);
      patZari = clamp(frame * 0.65, 0.0, 0.75);
      patAccent = twill + fresnel * 0.22;
    }

    vec3 baseCol = mix(uSecondary, uPrimary, clamp(diff * 0.85 + microWeave + vElevation * 0.6, 0.0, 1.0));
    vec3 col = mix(baseCol, uZari, patZari);
    col = mix(col, uAccent, clamp(patAccent + spec * 0.42 + fresnel * 0.25, 0.0, 0.88));

    gl_FragColor = vec4(col, 0.97);
  }
`;

function SilkDrapeStage({
  progress = 0,
  progressRef = null,
  active = true,
  preset = "maheshwari",
  zoom = 1.0,
  lightAngle = 0.45,
  breeze = 1.0,
  interactive = false,
}) {
  const matRef = useRef();
  const groupRef = useRef();
  const pointerTarget = useRef({ x: 0, y: 0 });
  const targetColors = useRef({
    primary: new THREE.Color(SHADER_PRESETS.maheshwari.primary),
    secondary: new THREE.Color(SHADER_PRESETS.maheshwari.secondary),
    zari: new THREE.Color(SHADER_PRESETS.maheshwari.zari),
    accent: new THREE.Color(SHADER_PRESETS.maheshwari.accent),
    patternType: 0,
  });

  const uniforms = useMemo(() => {
    const initial = SHADER_PRESETS[preset] || SHADER_PRESETS.maheshwari;
    return {
      uTime: { value: 0 },
      uProgress: { value: progressRef ? progressRef.current : progress },
      uBreeze: { value: breeze },
      uPatternType: { value: initial.patternType },
      uZoom: { value: zoom },
      uLightAngle: { value: lightAngle },
      uPrimary: { value: new THREE.Color(initial.primary) },
      uSecondary: { value: new THREE.Color(initial.secondary) },
      uZari: { value: new THREE.Color(initial.zari) },
      uAccent: { value: new THREE.Color(initial.accent) },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const cfg = SHADER_PRESETS[preset] || SHADER_PRESETS.maheshwari;
    targetColors.current = {
      primary: new THREE.Color(cfg.primary),
      secondary: new THREE.Color(cfg.secondary),
      zari: new THREE.Color(cfg.zari),
      accent: new THREE.Color(cfg.accent),
      patternType: cfg.patternType,
    };
    if (matRef.current) {
      matRef.current.uniforms.uPatternType.value = cfg.patternType;
    }
  }, [preset]);

  useEffect(() => {
    if (matRef.current) {
      matRef.current.uniforms.uZoom.value = zoom;
      matRef.current.uniforms.uLightAngle.value = lightAngle;
      matRef.current.uniforms.uBreeze.value = breeze;
      if (!progressRef) {
        matRef.current.uniforms.uProgress.value = progress;
      }
    }
  }, [zoom, lightAngle, breeze, progress, progressRef]);

  useFrame((state) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    u.uPrimary.value.lerp(targetColors.current.primary, 0.08);
    u.uSecondary.value.lerp(targetColors.current.secondary, 0.08);
    u.uZari.value.lerp(targetColors.current.zari, 0.08);
    u.uAccent.value.lerp(targetColors.current.accent, 0.08);

    if (progressRef) {
      u.uProgress.value = progressRef.current;
    }

    if (groupRef.current) {
      if (interactive) {
        pointerTarget.current.x = state.pointer.x * 0.14;
        pointerTarget.current.y = state.pointer.y * 0.09;
      } else {
        pointerTarget.current.x = 0;
        pointerTarget.current.y = 0;
      }
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        0.1 + pointerTarget.current.x,
        0.06
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -0.2 - pointerTarget.current.y,
        0.06
      );
    }

    if (!active) return;
    u.uTime.value = state.clock.elapsedTime;
  });

  return (
    <group ref={groupRef} rotation={[-0.2, 0.1, -0.07]}>
      {/* Primary Silk Drape */}
      <mesh>
        <planeGeometry args={[7.2, 3.3, 64, 32]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={silkDraperyVertex}
          fragmentShader={silkDraperyFragment}
          uniforms={uniforms}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
    </group>
  );
}

export default function FabricStudy({
  progress = 0,
  progressRef = null,
  paused = false,
  preset = "maheshwari",
  zoom = 1.0,
  lightAngle = 0.45,
  breeze = 1.0,
  interactive = false,
}) {
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
        camera={{ position: [0, 0, 4.15], fov: 42 }}
      >
        <SilkDrapeStage
          progress={progress}
          progressRef={progressRef}
          active={active}
          preset={preset}
          zoom={zoom}
          lightAngle={lightAngle}
          breeze={breeze}
          interactive={interactive}
        />
      </Canvas>
    </div>
  );
}
