import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * 15 physically parameterized handloom & regional textile shader presets.
 * weaveType: 0 = Plain/Chatai, 1 = 2/2 Twill, 2 = 5-Harness Satin/Katan, 3 = Ribbed Backstrap
 */
const SHADER_PRESETS = {
  maheshwari: {
    patternType: 0,
    weaveType: 0,
    density: 145,
    sheen: 0.72,
    metalness: 0.85,
    slub: 0.08,
    primary: "#38131E",
    secondary: "#240B13",
    zari: "#D4AF63",
    accent: "#F1D889",
    warpTint: "#4E1B2B",
    weftTint: "#2C0E17",
  },
  "kosa-silk": {
    patternType: 1,
    weaveType: 0,
    density: 118,
    sheen: 0.65,
    metalness: 0.55,
    slub: 0.62,
    primary: "#946A34",
    secondary: "#523218",
    zari: "#E2BA64",
    accent: "#F7EBCD",
    warpTint: "#A87B3E",
    weftTint: "#704922",
  },
  "bandhani-leheriya": {
    patternType: 2,
    weaveType: 0,
    density: 162,
    sheen: 0.58,
    metalness: 0.45,
    slub: 0.06,
    primary: "#63132B",
    secondary: "#2B0812",
    zari: "#D4AF63",
    accent: "#F8EAD0",
    warpTint: "#791936",
    weftTint: "#440B1C",
  },
  kanjivaram: {
    patternType: 3,
    weaveType: 2,
    density: 152,
    sheen: 0.94,
    metalness: 0.96,
    slub: 0.05,
    primary: "#430E1F",
    secondary: "#1F050D",
    zari: "#E7C065",
    accent: "#F8E2A6",
    warpTint: "#681834",
    weftTint: "#2D0814",
  },
  paithani: {
    patternType: 4,
    weaveType: 2,
    density: 158,
    sheen: 0.96,
    metalness: 0.94,
    slub: 0.04,
    primary: "#541536",
    secondary: "#220716",
    zari: "#DCB65E",
    accent: "#F5DC93",
    warpTint: "#73204C",
    weftTint: "#1C4F4A", // classic dhoop-chhaon peacock teal undertone
  },
  pashmina: {
    patternType: 5,
    weaveType: 1,
    density: 126,
    sheen: 0.34,
    metalness: 0.25,
    slub: 0.24,
    primary: "#C9B79C",
    secondary: "#795F47",
    zari: "#4E1B28",
    accent: "#F7F1E5",
    warpTint: "#D3C2A8",
    weftTint: "#9E8468",
  },
  banarasi: {
    patternType: 6,
    weaveType: 2,
    density: 164,
    sheen: 0.95,
    metalness: 0.98,
    slub: 0.04,
    primary: "#5B0F24",
    secondary: "#26050F",
    zari: "#E5BF64",
    accent: "#F8E5AC",
    warpTint: "#751731",
    weftTint: "#3E0817",
  },
  patola: {
    patternType: 7,
    weaveType: 0,
    density: 138,
    sheen: 0.78,
    metalness: 0.65,
    slub: 0.07,
    primary: "#6E1325",
    secondary: "#23493E",
    zari: "#D4AF63",
    accent: "#F7EAD0",
    warpTint: "#831B2F",
    weftTint: "#1F5043",
  },
  ikat: {
    patternType: 8,
    weaveType: 0,
    density: 134,
    sheen: 0.68,
    metalness: 0.58,
    slub: 0.14,
    primary: "#5A131E",
    secondary: "#1B3F39",
    zari: "#D9B25F",
    accent: "#F4E8D4",
    warpTint: "#701C28",
    weftTint: "#204A43",
  },
  kasavu: {
    patternType: 9,
    weaveType: 0,
    density: 150,
    sheen: 0.42,
    metalness: 0.92,
    slub: 0.12,
    primary: "#EDE3CF",
    secondary: "#CBBAA0",
    zari: "#D8AE52",
    accent: "#FAF5EA",
    warpTint: "#F5EEE0",
    weftTint: "#DFD3BC",
  },
  jamdani: {
    patternType: 10,
    weaveType: 0,
    density: 170,
    sheen: 0.55,
    metalness: 0.72,
    slub: 0.09,
    primary: "#741A24",
    secondary: "#3A0D13",
    zari: "#E2BA64",
    accent: "#FAF4E8",
    warpTint: "#8D2531",
    weftTint: "#521118",
  },
  muga: {
    patternType: 11,
    weaveType: 0,
    density: 136,
    sheen: 0.88,
    metalness: 0.76,
    slub: 0.42,
    primary: "#B58634",
    secondary: "#6E4815",
    zari: "#F0CD73",
    accent: "#FAF0D6",
    warpTint: "#C99840",
    weftTint: "#8E6322",
  },
  "mysore-silk": {
    patternType: 12,
    weaveType: 2,
    density: 174,
    sheen: 0.98,
    metalness: 0.9,
    slub: 0.02,
    primary: "#4B0F22",
    secondary: "#21050E",
    zari: "#E4BC62",
    accent: "#F6DF9F",
    warpTint: "#6A1833",
    weftTint: "#360918",
  },
  "tribal-loom": {
    patternType: 13,
    weaveType: 3,
    density: 112,
    sheen: 0.36,
    metalness: 0.4,
    slub: 0.28,
    primary: "#4C1720",
    secondary: "#1B1718",
    zari: "#D4AF63",
    accent: "#F3EADB",
    warpTint: "#66202B",
    weftTint: "#2A2324",
  },
  phulkari: {
    patternType: 14,
    weaveType: 1,
    density: 142,
    sheen: 0.84,
    metalness: 0.68,
    slub: 0.1,
    primary: "#631424",
    secondary: "#2D0811",
    zari: "#DFAC4B",
    accent: "#F8E5BE",
    warpTint: "#7D1A2E",
    weftTint: "#9E2E2B",
  },
};

const silkDraperyVertex = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uBreeze;
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormalApprox;
  varying vec3 vTangentApprox;
  varying vec3 vBitangentApprox;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float phase = uTime * 0.68 * uBreeze + uProgress * 4.2;
    float wave1 = sin(pos.x * 1.18 + phase) * (0.21 + 0.06 * uBreeze);
    float wave2 = cos(pos.y * 1.85 - uTime * 0.52 * uBreeze) * 0.11;
    float fold = sin((pos.x * 0.78 + pos.y * 1.12) * 2.3 + phase * 0.55) * 0.085;
    float ripple = sin(pos.x * 3.1 - uTime * 0.9 * uBreeze + pos.y * 0.8) * 0.025 * uBreeze;

    float disp = wave1 + wave2 + fold + ripple;
    pos.z += disp;
    vElevation = disp;

    float dx = cos(pos.x * 1.18 + phase) * (0.25 + 0.07 * uBreeze)
             + cos((pos.x * 0.78 + pos.y * 1.12) * 2.3 + phase * 0.55) * 0.152
             + cos(pos.x * 3.1 - uTime * 0.9 * uBreeze + pos.y * 0.8) * 0.077 * uBreeze;
    float dy = -sin(pos.y * 1.85 - uTime * 0.52 * uBreeze) * 0.203
             + cos((pos.x * 0.78 + pos.y * 1.12) * 2.3 + phase * 0.55) * 0.219
             + cos(pos.x * 3.1 - uTime * 0.9 * uBreeze + pos.y * 0.8) * 0.02 * uBreeze;

    vec3 T = normalize(vec3(1.0, 0.0, dx));
    vec3 B = normalize(vec3(0.0, 1.0, dy));
    vTangentApprox = T;
    vBitangentApprox = B;
    vNormalApprox = normalize(cross(T, B));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const silkDraperyFragment = /* glsl */ `
  uniform float uTime;
  uniform float uPatternType;
  uniform float uWeaveType;
  uniform float uDensity;
  uniform float uSheen;
  uniform float uMetalness;
  uniform float uSlub;
  uniform float uZoom;
  uniform float uLightAngle;
  uniform vec3 uPrimary;
  uniform vec3 uSecondary;
  uniform vec3 uZari;
  uniform vec3 uAccent;
  uniform vec3 uWarpTint;
  uniform vec3 uWeftTint;

  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormalApprox;
  varying vec3 vTangentApprox;
  varying vec3 vBitangentApprox;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float modFloat(float a, float b) {
    return a - b * floor(a / b);
  }

  void main() {
    // Smooth zoom centered onto the ornate border & body transition zone
    vec2 zoomCenter = vec2(0.54, 0.24);
    vec2 uv = (vUv - zoomCenter) / max(uZoom, 0.5) + zoomCenter;

    vec3 viewDir = normalize(vec3(0.0, 0.08, 1.0));
    vec3 lightDir = normalize(vec3(
      cos(uLightAngle * 3.14159) * 0.95,
      sin(uLightAngle * 3.14159) * 0.45 + 0.38,
      0.66
    ));
    vec3 halfVec = normalize(lightDir + viewDir);

    // ── 1. CYLINDRICAL WARP & WEFT MICRO-WEAVE GEOMETRY ──
    float aspect = 2.05;
    vec2 threadGrid = uv * vec2(uDensity * aspect, uDensity);
    float colIdx = floor(threadGrid.x);
    float rowIdx = floor(threadGrid.y);
    vec2 cellUv = fract(threadGrid);

    // Organic wild-silk slubbing along weft & subtle yarn irregularity
    float colRand = hash21(vec2(colIdx, 7.13));
    float rowRand = hash21(vec2(19.4, rowIdx));
    float slubNoise = hash21(vec2(floor(threadGrid.x * 0.14), rowIdx));
    float weftThick = 0.41 + uSlub * 0.09 * (rowRand - 0.35 + slubNoise * 0.5);
    float warpThick = 0.40 + uSlub * 0.04 * (colRand - 0.5);

    float distWarp = abs(cellUv.x - 0.5) / max(warpThick, 0.22);
    float distWeft = abs(cellUv.y - 0.5) / max(weftThick, 0.22);

    // Interlacing weave rule
    float warpOver = 0.0;
    if (uWeaveType < 0.5) {
      // Plain weave (1/1)
      warpOver = step(0.5, modFloat(colIdx + rowIdx, 2.0));
    } else if (uWeaveType < 1.5) {
      // 2/2 Diagonal twill (Pashmina, Phulkari ground)
      warpOver = step(1.5, modFloat(colIdx + rowIdx, 4.0));
    } else if (uWeaveType < 2.5) {
      // 5-Harness silk satin (Kanjivaram, Banarasi, Paithani, Mysore)
      warpOver = step(2.2, modFloat(colIdx * 2.0 + rowIdx, 5.0));
    } else {
      // Ribbed backstrap basket (Tribal Northeast & Himalayan looms)
      warpOver = step(0.5, modFloat(colIdx + floor(rowIdx * 0.5), 2.0));
    }

    // Cylindrical yarn profile & over/under crossing arch
    float warpMask = 1.0 - smoothstep(0.84, 1.06, distWarp);
    float weftMask = 1.0 - smoothstep(0.84, 1.06, distWeft);

    float warpArch = cos((cellUv.y - 0.5) * 3.14159) * 0.25;
    float weftArch = cos((cellUv.x - 0.5) * 3.14159) * 0.25;

    float hWarp = warpMask * (sqrt(max(0.0, 1.0 - min(1.0, distWarp * distWarp))) + warpArch * (warpOver * 2.0 - 1.0));
    float hWeft = weftMask * (sqrt(max(0.0, 1.0 - min(1.0, distWeft * distWeft))) + weftArch * ((1.0 - warpOver) * 2.0 - 1.0));

    float activeIsWarp = step(hWeft, hWarp + (warpOver - 0.5) * 0.45);
    float yarnMask = clamp(max(warpMask, weftMask), 0.0, 1.0);

    // Multi-ply twisted micro-fibrils along thread length
    float fibrilWarp = sin(threadGrid.y * 22.0 + (cellUv.x - 0.5) * 9.0) * 0.14;
    float fibrilWeft = sin(threadGrid.x * 22.0 + (cellUv.y - 0.5) * 9.0) * 0.14;

    float nx = mix(
      sin((cellUv.x - 0.5) * 3.14159) * 0.18 + fibrilWeft * 0.2,
      clamp((cellUv.x - 0.5) / max(warpThick, 0.22), -1.0, 1.0) * 0.78 + fibrilWarp,
      activeIsWarp
    );
    float ny = mix(
      clamp((cellUv.y - 0.5) / max(weftThick, 0.22), -1.0, 1.0) * 0.78 + fibrilWeft,
      sin((cellUv.y - 0.5) * 3.14159) * 0.18 + fibrilWarp * 0.2,
      activeIsWarp
    );

    // Deep inter-thread crevice ambient occlusion
    float crossingDip = smoothstep(0.0, 0.55, abs(cellUv.x - 0.5)) * smoothstep(0.0, 0.55, abs(cellUv.y - 0.5));
    float threadAO = mix(0.38, 1.0, yarnMask) * mix(0.76, 1.04, clamp(hWarp + hWeft, 0.0, 1.0)) * mix(0.84, 1.0, crossingDip);
    // Crisp weave detail strengthens naturally as user zooms closer
    float weaveStrength = mix(0.55, 1.0, clamp((uZoom - 0.8) * 0.55, 0.0, 1.0));
    threadAO = mix(1.0, threadAO, weaveStrength);

    vec3 T = normalize(vTangentApprox);
    vec3 B = normalize(vBitangentApprox);
    vec3 N = normalize(vNormalApprox);
    vec3 microN = normalize(N + (T * nx + B * ny) * (0.48 * weaveStrength));

    // ── 2. LIGHTING & ANISOTROPIC SILK / ZARI RESPONSE ──
    float wrapDiff = clamp((dot(microN, lightDir) + 0.38) / 1.38, 0.14, 1.0);
    float macroDiff = clamp((dot(N, lightDir) + 0.35) / 1.35, 0.16, 1.0);
    float diff = mix(macroDiff, wrapDiff, 0.82);

    // Anisotropic silk highlight perpendicular to the active yarn fiber axis
    vec3 yarnDir = normalize(mix(T, B, activeIsWarp));
    float th = dot(yarnDir, halfVec);
    float aniso = sqrt(max(0.001, 1.0 - th * th));
    float silkSpec = pow(aniso, 16.0) * pow(max(dot(microN, halfVec), 0.0), 6.0) * (0.38 + 0.62 * uSheen);
    float zariSpec = pow(max(dot(microN, halfVec), 0.0), 34.0);
    float fresnel = pow(1.0 - max(dot(microN, viewDir), 0.0), 2.6);

    // ── 3. REGIONAL PATTERNING OVER INTERLACED YARNS ──
    float patZari = 0.0;
    float patAccent = 0.0;

    if (uPatternType < 0.5) {
      // 0: Maheshwari — Narmada waves + reversible bugdi border + chatai checks
      float borderBand = 1.0 - smoothstep(0.16, 0.18, abs(uv.y - 0.18));
      float outerBorder = 1.0 - smoothstep(0.16, 0.18, abs(uv.y - 0.84));
      float wave = abs(fract(uv.x * 16.0 + abs(fract(uv.y * 28.0) - 0.5)) - 0.5);
      float chatai = smoothstep(0.36, 0.48, abs(fract(uv.x * 38.0) - 0.5)) * smoothstep(0.36, 0.48, abs(fract(uv.y * 38.0) - 0.5));
      patZari = clamp((borderBand + outerBorder) * (1.0 - smoothstep(0.15, 0.27, wave)) * 0.78 + chatai * 0.25, 0.0, 0.92);
      patAccent = smoothstep(0.84, 0.98, sin(uv.y * 56.0)) * 0.18;
    } else if (uPatternType < 1.5) {
      // 1: Kosa / Tussar — Organic wild cocoon luster + crisp temple & horizon border
      float edgeDist = min(uv.y, 1.0 - uv.y);
      float temple = 1.0 - smoothstep(0.11 + abs(fract(uv.x * 18.0) - 0.5) * 0.09, 0.125 + abs(fract(uv.x * 18.0) - 0.5) * 0.09, edgeDist);
      float slubStreak = smoothstep(0.68, 0.98, slubNoise) * 0.34;
      float band = smoothstep(0.88, 0.96, abs(fract(uv.x * 5.0 + 0.15) - 0.5) * 2.0);
      patZari = clamp(temple * 0.72 + band * 0.45, 0.0, 0.88);
      patAccent = clamp(slubStreak + silkSpec * 0.3, 0.0, 0.65);
    } else if (uPatternType < 2.5) {
      // 2: Bandhani & Leheriya — Micro tied Ekdali constellations & wave stripes
      vec2 grid = fract(uv * vec2(28.0, 18.0)) - 0.5;
      float dotMask = (1.0 - smoothstep(0.14, 0.25, length(grid))) * (0.65 + 0.35 * step(0.45, colRand));
      float waveStripe = smoothstep(0.8, 0.95, sin((uv.x * 24.0 + uv.y * 18.0) + sin(uv.x * 6.0) * 1.4) * 0.5 + 0.5);
      patAccent = clamp(dotMask * 0.78 + waveStripe * 0.22, 0.0, 0.88);
      patZari = smoothstep(0.45, 0.5, abs(fract(uv.y * 6.0) - 0.5)) * 0.28;
    } else if (uPatternType < 3.5) {
      // 3: Kanjivaram — Sculpted Gopuram temple spires & kattam silk checks
      float edgeDist = min(uv.y, 1.0 - uv.y);
      float spire = abs(fract(uv.x * 22.0) - 0.5) * 0.12;
      float gopuramMask = 1.0 - smoothstep(0.15 + spire, 0.165 + spire, edgeDist);
      float kattam = max(smoothstep(0.92, 0.98, abs(sin(uv.x * 52.0))), smoothstep(0.92, 0.98, abs(sin(uv.y * 52.0)))) * 0.24;
      patZari = clamp(gopuramMask * 0.85 + kattam, 0.0, 0.95);
      patAccent = gopuramMask * 0.24;
    } else if (uPatternType < 4.5) {
      // 4: Paithani — Oblique Narali square grid & luminous golden pallu zone
      vec2 rotUv = mat2(0.707, -0.707, 0.707, 0.707) * (uv * 24.0);
      float diamond = smoothstep(0.76, 0.93, abs(sin(rotUv.x) * sin(rotUv.y)));
      float pallu = smoothstep(0.64, 0.82, uv.x);
      float borderBand = 1.0 - smoothstep(0.14, 0.16, min(uv.y, 1.0 - uv.y));
      patZari = clamp(diamond * (0.25 + pallu * 0.62) + borderBand * 0.68, 0.0, 0.94);
      patAccent = silkSpec * 0.35;
    } else if (uPatternType < 5.5) {
      // 5: Pashmina / Kani Twill — Delicate 2/2 diagonal twill & framed border
      float twill = smoothstep(0.4, 0.85, sin((uv.x * 160.0 + uv.y * 160.0)) * 0.5 + 0.5) * 0.24;
      float borderBand = 1.0 - smoothstep(0.08, 0.1, min(uv.y, 1.0 - uv.y));
      float paisley = smoothstep(0.84, 0.95, sin(uv.x * 36.0) * cos(uv.y * 28.0)) * borderBand;
      patZari = clamp(borderBand * 0.55 + paisley * 0.45, 0.0, 0.82);
      patAccent = twill + fresnel * 0.25;
    } else if (uPatternType < 6.5) {
      // 6: Banarasi Katan Brocade — Intricate Jangla trellis lattice & buta medallions
      vec2 rotUv = mat2(0.707, -0.707, 0.707, 0.707) * (uv * 32.0);
      float trellis = smoothstep(0.8, 0.94, max(abs(sin(rotUv.x)), abs(sin(rotUv.y))));
      float buta = smoothstep(0.72, 0.88, cos(uv.x * 34.0) * cos(uv.y * 24.0));
      float borderBand = 1.0 - smoothstep(0.15, 0.17, min(uv.y, 1.0 - uv.y));
      patZari = clamp(trellis * 0.45 + buta * 0.42 + borderBand * 0.75, 0.0, 0.95);
      patAccent = borderBand * 0.25;
    } else if (uPatternType < 7.5 || uPatternType < 8.5) {
      // 7 & 8: Patola / Ikat — Stepped diamond lattice with soft tie-resist feathering
      vec2 pUv = uv * vec2(16.0, 12.0);
      vec2 cell = abs(fract(pUv) - 0.5);
      float stepDiamond = smoothstep(0.36, 0.42, cell.x + cell.y);
      float feather = smoothstep(0.28, 0.46, cell.x + cell.y) * 0.35;
      float borderTemple = 1.0 - smoothstep(0.14 + abs(fract(uv.x * 20.0) - 0.5) * 0.08, 0.16, min(uv.y, 1.0 - uv.y));
      patZari = clamp(borderTemple * 0.78 + stepDiamond * 0.45, 0.0, 0.9);
      patAccent = clamp((1.0 - feather) * 0.5, 0.0, 0.72);
    } else if (uPatternType < 9.5) {
      // 9: Kerala Kasavu — Serene ivory field with shimmering metallic Kara stripes
      float edgeDist = min(uv.y, 1.0 - uv.y);
      float karaBand = (1.0 - smoothstep(0.16, 0.17, edgeDist)) * step(0.03, edgeDist);
      float fineRule = smoothstep(0.92, 0.98, abs(sin(uv.y * 120.0))) * (1.0 - smoothstep(0.21, 0.22, edgeDist));
      patZari = clamp(karaBand * 0.92 + fineRule * 0.75, 0.0, 0.96);
      patAccent = fresnel * 0.25;
    } else if (uPatternType < 10.5) {
      // 10: Jamdani (Bengal / Uppada / Manipur) — Discontinuous floating panna hajar florals
      vec2 bCell = fract(uv * vec2(20.0, 14.0)) - 0.5;
      float flower = 1.0 - smoothstep(0.12, 0.21, length(bCell));
      float borderBand = 1.0 - smoothstep(0.13 + abs(fract(uv.x * 24.0) - 0.5) * 0.07, 0.15, min(uv.y, 1.0 - uv.y));
      patZari = clamp(flower * 0.65 + borderBand * 0.78, 0.0, 0.9);
      patAccent = clamp(flower * 0.45, 0.0, 0.8);
    } else if (uPatternType < 11.5) {
      // 11: Assam Muga & Meghalaya Eri — Sunlit wild gold silk + Kinkhwab medallions
      vec2 mCell = fract(uv * vec2(14.0, 10.0)) - 0.5;
      float medallion = 1.0 - smoothstep(0.16, 0.24, abs(mCell.x) + abs(mCell.y));
      float borderBar = 1.0 - smoothstep(0.15, 0.17, min(uv.y, 1.0 - uv.y));
      patZari = clamp(medallion * 0.45 + borderBar * 0.72 + slubNoise * 0.22, 0.0, 0.9);
      patAccent = silkSpec * 0.48;
    } else if (uPatternType < 12.5) {
      // 12: Mysore Crepe Silk — Ultra-smooth satin drape with crisp sleek zari lines
      float edgeDist = min(uv.y, 1.0 - uv.y);
      float zariLines = (1.0 - smoothstep(0.11, 0.12, edgeDist)) * (0.65 + 0.35 * step(0.4, abs(sin(uv.y * 140.0))));
      patZari = clamp(zariLines * 0.92, 0.0, 0.95);
      patAccent = silkSpec * 0.45;
    } else if (uPatternType < 13.5) {
      // 13: Northeast / Himalayan Tribal Loom — Bold horizontal bands & stepped diamond inlays
      float edgeDist = min(uv.y, 1.0 - uv.y);
      float band = step(0.84, sin(uv.y * 44.0) * 0.5 + 0.5);
      float zigzag = 1.0 - smoothstep(0.12 + abs(fract(uv.x * 16.0) - 0.5) * 0.11, 0.14 + abs(fract(uv.x * 16.0) - 0.5) * 0.11, edgeDist);
      patZari = clamp(zigzag * 0.78 + band * 0.35, 0.0, 0.9);
      patAccent = clamp(band * 0.45, 0.0, 0.75);
    } else {
      // 14: Phulkari / Bagh — Dense interlocking stitched silk diamonds & border stripes
      vec2 pCell = abs(fract(uv * vec2(18.0, 14.0)) - 0.5);
      float bagh = 1.0 - smoothstep(0.28, 0.36, pCell.x + pCell.y);
      float borderBand = 1.0 - smoothstep(0.14, 0.16, min(uv.y, 1.0 - uv.y));
      patZari = clamp(bagh * 0.62 + borderBand * 0.55, 0.0, 0.9);
      patAccent = clamp(bagh * 0.5 + silkSpec * 0.32, 0.0, 0.85);
    }

    // ── 4. COMPOSITE SHOT-SILK YARNS & METALLIC ZARI ──
    vec3 threadTint = mix(uWeftTint, uWarpTint, activeIsWarp);
    vec3 clothGround = mix(uSecondary, mix(uPrimary, threadTint, 0.45), clamp(diff * 0.92 + vElevation * 0.45, 0.0, 1.0));
    clothGround *= threadAO;

    // Zari threads carry higher cylindrical sheen and golden metallic reflection
    vec3 zariLit = uZari * (0.62 + 0.55 * diff) * mix(0.75, 1.08, threadAO) + uAccent * (zariSpec * (0.65 + 0.55 * uMetalness));
    vec3 col = mix(clothGround, zariLit, patZari);

    // Add silk anisotropic sheen, subtle border accents & Fresnel rim glow
    col += uAccent * (silkSpec * 0.38 * (1.0 - patZari * 0.4));
    col = mix(col, uAccent * (0.78 + 0.25 * diff) * threadAO, clamp(patAccent * 0.58 + fresnel * 0.16, 0.0, 0.82));

    gl_FragColor = vec4(col, 0.98);
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
  const targetPreset = useRef(SHADER_PRESETS.maheshwari);
  const targetColors = useRef({
    primary: new THREE.Color(SHADER_PRESETS.maheshwari.primary),
    secondary: new THREE.Color(SHADER_PRESETS.maheshwari.secondary),
    zari: new THREE.Color(SHADER_PRESETS.maheshwari.zari),
    accent: new THREE.Color(SHADER_PRESETS.maheshwari.accent),
    warpTint: new THREE.Color(SHADER_PRESETS.maheshwari.warpTint),
    weftTint: new THREE.Color(SHADER_PRESETS.maheshwari.weftTint),
  });
  const targetZoom = useRef(zoom);
  const targetLight = useRef(lightAngle);

  const uniforms = useMemo(() => {
    const initial = SHADER_PRESETS[preset] || SHADER_PRESETS.maheshwari;
    return {
      uTime: { value: 0 },
      uProgress: { value: progressRef ? progressRef.current : progress },
      uBreeze: { value: breeze },
      uPatternType: { value: initial.patternType },
      uWeaveType: { value: initial.weaveType },
      uDensity: { value: initial.density },
      uSheen: { value: initial.sheen },
      uMetalness: { value: initial.metalness },
      uSlub: { value: initial.slub },
      uZoom: { value: zoom },
      uLightAngle: { value: lightAngle },
      uPrimary: { value: new THREE.Color(initial.primary) },
      uSecondary: { value: new THREE.Color(initial.secondary) },
      uZari: { value: new THREE.Color(initial.zari) },
      uAccent: { value: new THREE.Color(initial.accent) },
      uWarpTint: { value: new THREE.Color(initial.warpTint) },
      uWeftTint: { value: new THREE.Color(initial.weftTint) },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const cfg = SHADER_PRESETS[preset] || SHADER_PRESETS.maheshwari;
    targetPreset.current = cfg;
    targetColors.current = {
      primary: new THREE.Color(cfg.primary),
      secondary: new THREE.Color(cfg.secondary),
      zari: new THREE.Color(cfg.zari),
      accent: new THREE.Color(cfg.accent),
      warpTint: new THREE.Color(cfg.warpTint),
      weftTint: new THREE.Color(cfg.weftTint),
    };
    if (matRef.current) {
      matRef.current.uniforms.uPatternType.value = cfg.patternType;
      matRef.current.uniforms.uWeaveType.value = cfg.weaveType;
    }
  }, [preset]);

  useEffect(() => {
    targetZoom.current = zoom;
    targetLight.current = lightAngle;
    if (matRef.current) {
      matRef.current.uniforms.uBreeze.value = breeze;
      if (!progressRef) {
        matRef.current.uniforms.uProgress.value = progress;
      }
    }
  }, [zoom, lightAngle, breeze, progress, progressRef]);

  useFrame((state) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    const cfg = targetPreset.current;

    u.uPrimary.value.lerp(targetColors.current.primary, 0.08);
    u.uSecondary.value.lerp(targetColors.current.secondary, 0.08);
    u.uZari.value.lerp(targetColors.current.zari, 0.08);
    u.uAccent.value.lerp(targetColors.current.accent, 0.08);
    u.uWarpTint.value.lerp(targetColors.current.warpTint, 0.08);
    u.uWeftTint.value.lerp(targetColors.current.weftTint, 0.08);

    u.uDensity.value = THREE.MathUtils.lerp(u.uDensity.value, cfg.density, 0.12);
    u.uSheen.value = THREE.MathUtils.lerp(u.uSheen.value, cfg.sheen, 0.12);
    u.uMetalness.value = THREE.MathUtils.lerp(u.uMetalness.value, cfg.metalness, 0.12);
    u.uSlub.value = THREE.MathUtils.lerp(u.uSlub.value, cfg.slub, 0.12);
    u.uZoom.value = THREE.MathUtils.lerp(u.uZoom.value, targetZoom.current, 0.1);
    u.uLightAngle.value = THREE.MathUtils.lerp(u.uLightAngle.value, targetLight.current, 0.1);

    if (progressRef) {
      u.uProgress.value = progressRef.current;
    }

    if (groupRef.current) {
      if (interactive) {
        pointerTarget.current.x = state.pointer.x * 0.16;
        pointerTarget.current.y = state.pointer.y * 0.1;
      } else {
        pointerTarget.current.x = 0;
        pointerTarget.current.y = 0;
      }
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        0.08 + pointerTarget.current.x,
        0.06
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -0.18 - pointerTarget.current.y,
        0.06
      );
    }

    if (!active) return;
    u.uTime.value = state.clock.elapsedTime;
  });

  return (
    <group ref={groupRef} rotation={[-0.18, 0.08, -0.05]}>
      {/* High-Resolution Subdivided Silk Cloth Mesh */}
      <mesh>
        <planeGeometry args={[7.4, 3.6, 128, 64]} />
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
        dpr={[1, 1.75]}
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
