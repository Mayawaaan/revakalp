import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildGLSLMaterials } from "./glslMaterials";

const smoothstep = (edge0, edge1, x) => {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

/**
 * Builds an indexed BufferGeometry over a parametric (u, v) in [0, 1]^2 domain
 * and averages normals cleanly along closed cylindrical seams.
 */
function buildParametricGrid(uSegs, vSegs, evalFn, closeU = false) {
  const cols = uSegs + 1;
  const rows = vSegs + 1;
  const vertCount = cols * rows;
  const positions = new Float32Array(vertCount * 3);
  const uvs = new Float32Array(vertCount * 2);
  const p = new THREE.Vector3();

  for (let j = 0; j <= vSegs; j++) {
    const v = j / vSegs;
    for (let i = 0; i <= uSegs; i++) {
      const u = i / uSegs;
      const uSample = closeU && i === uSegs ? 0 : u;
      evalFn(uSample, v, p);

      const idx = j * cols + i;
      positions[idx * 3] = p.x;
      positions[idx * 3 + 1] = p.y;
      positions[idx * 3 + 2] = p.z;

      uvs[idx * 2] = u;
      uvs[idx * 2 + 1] = v;
    }
  }

  const indices = [];
  for (let j = 0; j < vSegs; j++) {
    for (let i = 0; i < uSegs; i++) {
      const a = j * cols + i;
      const b = a + 1;
      const c = a + cols;
      const d = c + 1;
      indices.push(a, b, d, a, d, c);
    }
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geom.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  geom.computeVertexNormals();

  if (closeU) {
    const normAttr = geom.getAttribute("normal");
    const n0 = new THREE.Vector3();
    const n1 = new THREE.Vector3();
    for (let j = 0; j <= vSegs; j++) {
      const i0 = j * cols;
      const i1 = j * cols + uSegs;
      n0.fromBufferAttribute(normAttr, i0);
      n1.fromBufferAttribute(normAttr, i1);
      n0.add(n1);
      if (n0.lengthSq() > 1e-8) n0.normalize();
      normAttr.setXYZ(i0, n0.x, n0.y, n0.z);
      normAttr.setXYZ(i1, n0.x, n0.y, n0.z);
    }
    normAttr.needsUpdate = true;
  }

  return geom;
}

/**
 * Evaluates a point along a closed/tapered anatomical limb tube with outward normals.
 */
function buildTaperedLimbGeometry(curvePoints, radiusFn, tubularSegs = 28, radialSegs = 16) {
  const curve = new THREE.CatmullRomCurve3(curvePoints);
  const frames = curve.computeFrenetFrames(tubularSegs, false);
  const pt = new THREE.Vector3();
  const n = new THREE.Vector3();
  const b = new THREE.Vector3();

  return buildParametricGrid(
    radialSegs,
    tubularSegs,
    (u, v, target) => {
      curve.getPointAt(v, pt);
      const idx = Math.min(tubularSegs, Math.round(v * tubularSegs));
      n.copy(frames.normals[idx]);
      b.copy(frames.binormals[idx]);
      const angle = u * Math.PI * 2;
      const r = Math.max(0.002, radiusFn(v));
      const ca = Math.cos(angle) * r;
      const sa = Math.sin(angle) * r;
      target.copy(pt).addScaledVector(n, ca).addScaledVector(b, sa);
    },
    true
  );
}

/** Evaluates sculpted anatomical torso coordinates (+Z front, -Z back) with optional radial scale. */
function evalTorsoPoint(thetaFrac, y, target, radialOffset = 0, capScale = 1.0) {
  const theta = thetaFrac * Math.PI * 2;
  const sinT = Math.sin(theta);
  const cosT = Math.cos(theta);

  const hipToWaist = smoothstep(0.24, 0.42, y);
  const waistToBust = smoothstep(0.42, 0.78, y);
  const bustToShoulder = smoothstep(0.78, 1.02, y);
  const shoulderToNeck = smoothstep(1.0, 1.15, y);

  let rx = 0.235 - 0.032 * hipToWaist;
  rx += 0.055 * waistToBust;
  rx += 0.065 * bustToShoulder;
  rx = THREE.MathUtils.lerp(rx, 0.088, shoulderToNeck);

  let rz = 0.165 - 0.022 * hipToWaist;
  rz += 0.034 * waistToBust;
  rz = THREE.MathUtils.lerp(rz, 0.145, bustToShoulder);
  rz = THREE.MathUtils.lerp(rz, 0.086, shoulderToNeck);

  const bustBand = smoothstep(0.56, 0.76, y) * (1 - smoothstep(0.78, 0.96, y));
  const leftCup = Math.exp(-Math.pow(theta - (Math.PI / 2 - 0.36), 2) / 0.11);
  const rightCup = Math.exp(-Math.pow(theta - (Math.PI / 2 + 0.36), 2) / 0.11);
  const backArch = sinT < 0 ? Math.abs(sinT) * 0.015 * smoothstep(0.35, 0.65, y) * (1 - bustToShoulder) : 0;

  const frontProjection = bustBand * 0.044 * (leftCup + rightCup) * capScale;
  const finalRx = Math.max(0.002, (rx + radialOffset) * capScale);
  const finalRz = Math.max(0.002, (rz + radialOffset) * capScale);

  target.set(
    finalRx * cosT,
    y,
    finalRz * sinT + frontProjection - backArch * capScale
  );
}

/** Evaluates exterior 24-kali skirt shell for normalized drop s in [0, 1] (+Y waist to -Y floor). */
function evalSkirtWallPoint(u, s, target, radialOffset = 0) {
  const theta = u * Math.PI * 2;
  const bellRadius =
    0.225 + 0.62 * Math.pow(s, 1.28) + 0.08 * smoothstep(0.68, 1.0, s);
  const kaliPleats =
    Math.sin(theta * 24) * 0.036 * smoothstep(0.05, 0.85, s) +
    Math.cos(theta * 48) * 0.01 * s;
  const organicDrape = Math.sin(theta * 6 + 0.4) * 0.02 * s;
  const r = bellRadius + kaliPleats + organicDrape + radialOffset;

  const rxScale = 1.0 + 0.14 * (1 - smoothstep(0.0, 0.25, s));
  const rzScale = 0.84 + 0.16 * smoothstep(0.0, 0.3, s);

  target.set(
    r * rxScale * Math.cos(theta),
    0.38 - s * 1.72,
    r * rzScale * Math.sin(theta)
  );
}

/**
 * Closed-volume Kalidar skirt:
 * - v in [0.00, 0.04]: closed waist top cap inward to center axis
 * - v in [0.04, 0.90]: sculpted exterior 24-kali pleated wall
 * - v in [0.90, 0.94]: rolled couture hem bullnose curling under
 * - v in [0.94, 1.00]: solid underside base disk sealing around brass stand
 */
function evalClosedSkirtPoint(u, v, target) {
  const theta = u * Math.PI * 2;
  if (v < 0.04) {
    const t = v / 0.04;
    evalSkirtWallPoint(u, 0, target, 0);
    const scale = 0.12 + 0.88 * t;
    target.x *= scale;
    target.z *= scale;
    target.y = THREE.MathUtils.lerp(0.365, 0.38, t);
    return;
  }

  if (v <= 0.90) {
    const s = (v - 0.04) / 0.86;
    evalSkirtWallPoint(u, s, target, 0);
    return;
  }

  // Evaluate outer floor rim at s = 1.0
  evalSkirtWallPoint(u, 1.0, target, 0);
  const hemX = target.x;
  const hemZ = target.z;
  const baseScale = Math.hypot(hemX, hemZ);
  const ux = Math.cos(theta);
  const uz = Math.sin(theta);

  if (v <= 0.94) {
    // Rolled bullnose hem edge curling downward then inward
    const t = (v - 0.90) / 0.04;
    const rollAngle = t * Math.PI;
    const tuckIn = (1 - Math.cos(rollAngle)) * 0.022;
    const r = Math.max(0.04, baseScale - tuckIn);
    target.set(
      (hemX / (baseScale || 1)) * r || ux * r,
      -1.34 - Math.sin(rollAngle) * 0.016,
      (hemZ / (baseScale || 1)) * r || uz * r
    );
    return;
  }

  // Sealed underside disk closing inward to brass stand column (r = 0.038)
  const t = (v - 0.94) / 0.06;
  const startR = Math.max(0.04, baseScale - 0.044);
  const r = THREE.MathUtils.lerp(startR, 0.038, t);
  const ratio = r / (baseScale || 1);
  target.set(
    hemX * ratio,
    THREE.MathUtils.lerp(-1.34, -1.29, t),
    hemZ * ratio
  );
}

/** Evaluates cropped Choli top & bottom neckline/hem contour by theta. */
function choliBounds(theta) {
  const sinT = Math.sin(theta);
  const frontDip = Math.max(0, sinT) > 0.25 ? 0.14 * Math.pow(Math.max(0, sinT), 2.2) : 0;
  const backCutout = sinT < 0 ? 0.27 * Math.pow(Math.abs(sinT), 1.6) : 0;
  const yTop = 1.045 - frontDip - backCutout;
  const yBot = 0.545 - 0.025 * Math.max(0, sinT);
  return { yTop, yBot };
}

export default function ProceduralEthnicWear({
  paletteKey = "burgundy",
  breezeBoost = false,
  active = true,
  position = [0, 1.22, 0],
  scale = 1.56,
}) {
  const rootRef = useRef(null);
  const latkanRef = useRef(null);
  const lastPointer = useRef(new THREE.Vector2());
  const interactionSpeed = useRef(0);

  const materialBundle = useMemo(() => buildGLSLMaterials(), []);
  const { materials, named, updateTime, setPalette } = materialBundle;

  useEffect(() => {
    setPalette(paletteKey);
  }, [paletteKey, setPalette]);

  useEffect(() => {
    return () => {
      materials.forEach((m) => m.dispose());
    };
  }, [materials]);

  // Procedural closed-volume solid geometries
  const geometries = useMemo(() => {
    // 1. Closed solid Mannequin Torso (bottom-to-top with inverted theta so normals point outward)
    const torso = buildParametricGrid(
      72,
      58,
      (u, v, t) => {
        if (v < 0.04) {
          const cap = Math.max(0.01, smoothstep(0.0, 0.04, v));
          const y = THREE.MathUtils.lerp(0.22, 0.24, v / 0.04);
          evalTorsoPoint(1 - u, y, t, 0, cap);
          return;
        }
        const y = THREE.MathUtils.lerp(0.24, 1.30, (v - 0.04) / 0.96);
        evalTorsoPoint(1 - u, y, t, 0, 1.0);
      },
      true
    );

    // 2. Antique-Gold Atelier Neck Finial & Central Pedestal Stand Column anchoring into Pod
    const finialProfile = [
      new THREE.Vector2(0.0, 1.29),
      new THREE.Vector2(0.09, 1.295),
      new THREE.Vector2(0.096, 1.32),
      new THREE.Vector2(0.056, 1.35),
      new THREE.Vector2(0.074, 1.385),
      new THREE.Vector2(0.032, 1.415),
      new THREE.Vector2(0.0, 1.435),
    ];
    const finial = new THREE.LatheGeometry(finialProfile, 32);

    const standProfile = [
      new THREE.Vector2(0.0, -1.50),
      new THREE.Vector2(0.145, -1.50),
      new THREE.Vector2(0.138, -1.45),
      new THREE.Vector2(0.075, -1.42),
      new THREE.Vector2(0.042, -1.36),
      new THREE.Vector2(0.038, 0.16),
      new THREE.Vector2(0.068, 0.21),
      new THREE.Vector2(0.038, 0.25),
      new THREE.Vector2(0.0, 0.26),
    ];
    const standColumn = new THREE.LatheGeometry(standProfile, 32);

    // 3. Solid Closed Posed Arms (buried inside shoulder torso -> tapered fingertip) + Rolled Sleeves
    const leftArmPts = [
      new THREE.Vector3(-0.21, 0.95, 0.0),
      new THREE.Vector3(-0.39, 0.72, 0.04),
      new THREE.Vector3(-0.36, 0.50, 0.14),
      new THREE.Vector3(-0.29, 0.41, 0.19),
    ];
    const rightArmPts = [
      new THREE.Vector3(0.21, 0.95, 0.0),
      new THREE.Vector3(0.41, 0.73, 0.06),
      new THREE.Vector3(0.49, 0.56, 0.20),
      new THREE.Vector3(0.44, 0.50, 0.28),
    ];
    const armBaseR = (v) =>
      0.065 - 0.02 * smoothstep(0.0, 0.85, v) - 0.012 * smoothstep(0.85, 0.95, v);
    const armRadius = (v) => {
      const cap = v > 0.93 ? Math.max(0.04, 1 - smoothstep(0.93, 1.0, v)) : 1.0;
      const startCap = v < 0.04 ? Math.max(0.1, smoothstep(0.0, 0.04, v)) : 1.0;
      return armBaseR(v) * cap * startCap;
    };
    const sleeveRadius = (v) => {
      const s = 0.09 + v * 0.39;
      const flushEdge = smoothstep(0.0, 0.09, v) * smoothstep(1.0, 0.91, v);
      return armBaseR(s) + 0.011 * flushEdge;
    };
    const cuffRadius = (v) => {
      const s = 0.43 + v * 0.07;
      const flushEdge = smoothstep(0.0, 0.15, v) * smoothstep(1.0, 0.85, v);
      return armBaseR(s) + 0.014 * flushEdge;
    };

    const leftCurve = new THREE.CatmullRomCurve3(leftArmPts);
    const rightCurve = new THREE.CatmullRomCurve3(rightArmPts);
    const leftArm = buildTaperedLimbGeometry(leftArmPts, armRadius);
    const rightArm = buildTaperedLimbGeometry(rightArmPts, armRadius);

    const leftSleevePts = [0.09, 0.22, 0.35, 0.48].map((t) => leftCurve.getPointAt(t));
    const rightSleevePts = [0.09, 0.22, 0.35, 0.48].map((t) => rightCurve.getPointAt(t));
    const leftSleeve = buildTaperedLimbGeometry(leftSleevePts, sleeveRadius, 18, 22);
    const rightSleeve = buildTaperedLimbGeometry(rightSleevePts, sleeveRadius, 18, 22);

    const leftCuffPts = [0.43, 0.465, 0.50].map((t) => leftCurve.getPointAt(t));
    const rightCuffPts = [0.43, 0.465, 0.50].map((t) => rightCurve.getPointAt(t));
    const leftCuff = buildTaperedLimbGeometry(leftCuffPts, cuffRadius, 10, 22);
    const rightCuff = buildTaperedLimbGeometry(rightCuffPts, cuffRadius, 10, 22);

    // 4. Solid Rolled-Edge Zari Brocade Choli + Raised Trim Bands
    const choli = buildParametricGrid(
      96,
      36,
      (u, v, t) => {
        const thetaFrac = 1 - u;
        const theta = thetaFrac * Math.PI * 2;
        const { yTop, yBot } = choliBounds(theta);
        const flushEdge = smoothstep(0.0, 0.08, v) * smoothstep(1.0, 0.92, v);
        evalTorsoPoint(thetaFrac, THREE.MathUtils.lerp(yBot, yTop, v), t, 0.011 * flushEdge);
      },
      true
    );

    const choliHemTrim = buildParametricGrid(
      96,
      8,
      (u, v, t) => {
        const thetaFrac = 1 - u;
        const theta = thetaFrac * Math.PI * 2;
        const { yBot } = choliBounds(theta);
        const bevel = smoothstep(0.0, 0.22, v) * smoothstep(1.0, 0.78, v);
        evalTorsoPoint(thetaFrac, yBot + v * 0.025, t, 0.005 + 0.01 * bevel);
      },
      true
    );

    const choliNeckTrim = buildParametricGrid(
      96,
      8,
      (u, v, t) => {
        const thetaFrac = 1 - u;
        const theta = thetaFrac * Math.PI * 2;
        const { yTop } = choliBounds(theta);
        const bevel = smoothstep(0.0, 0.22, v) * smoothstep(1.0, 0.78, v);
        evalTorsoPoint(thetaFrac, yTop - 0.022 + v * 0.025, t, 0.005 + 0.01 * bevel);
      },
      true
    );

    // 5. Solid Closed-Volume 24-Kali Lehenga Skirt + Flush Relief Bands
    const skirtSilk = buildParametricGrid(160, 64, evalClosedSkirtPoint, true);

    const skirtWaistband = buildParametricGrid(
      128,
      10,
      (u, v, t) => {
        const bevel = smoothstep(0.0, 0.16, v) * smoothstep(1.0, 0.84, v);
        evalSkirtWallPoint(u, v * 0.048, t, 0.011 * bevel);
      },
      true
    );

    const skirtBrocadePanel = buildParametricGrid(
      160,
      20,
      (u, v, t) => {
        const bevel = smoothstep(0.0, 0.08, v) * smoothstep(1.0, 0.92, v);
        evalSkirtWallPoint(u, 0.72 + v * 0.205, t, 0.008 * bevel);
      },
      true
    );

    const skirtZariBorder = buildParametricGrid(
      160,
      14,
      (u, v, t) => {
        const bevel = smoothstep(0.0, 0.14, v) * smoothstep(1.0, 0.86, v);
        evalSkirtWallPoint(u, 0.915 + v * 0.085, t, 0.012 * bevel);
      },
      true
    );

    // 6. Solid Closed-Volume 3D Dupatta / Pallu Slab (stadium cross-section loop, full thickness)
    const dupattaSpine = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.24, 0.42, -0.19),
      new THREE.Vector3(-0.23, 0.85, -0.20),
      new THREE.Vector3(-0.20, 1.07, 0.02),
      new THREE.Vector3(-0.03, 0.80, 0.265),
      new THREE.Vector3(0.26, 0.46, 0.245),
      new THREE.Vector3(0.48, 0.56, 0.20),
      new THREE.Vector3(0.64, 0.15, 0.16),
      new THREE.Vector3(0.80, -0.45, 0.08),
      new THREE.Vector3(0.96, -1.02, -0.05),
    ]);
    const spineSegs = 96;
    const loopSegs = 36;
    const dFrames = dupattaSpine.computeFrenetFrames(spineSegs, false);
    const centerPt = new THREE.Vector3();
    const acrossDir = new THREE.Vector3();
    const normOut = new THREE.Vector3();

    const dupatta = buildParametricGrid(
      loopSegs,
      spineSegs,
      (u, v, t) => {
        dupattaSpine.getPointAt(v, centerPt);
        const fIdx = Math.min(spineSegs, Math.round(v * spineSegs));
        const tangent = dFrames.tangents[fIdx];

        acrossDir.crossVectors(tangent, centerPt);
        if (acrossDir.lengthSq() < 1e-6) acrossDir.set(1, 0, 0);
        else acrossDir.normalize();

        acrossDir.lerp(dFrames.binormals[fIdx], 0.35).normalize();
        normOut.crossVectors(tangent, acrossDir).normalize();

        const shoulderPinch = 1.0 - 0.48 * Math.exp(-Math.pow((v - 0.32) / 0.11, 2));
        const palluFlare = smoothstep(0.55, 1.0, v) * 0.24;
        const ribbonHalfWidth = (0.095 + palluFlare) * shoulderPinch;
        const endCapTaper = Math.max(0.05, smoothstep(0.0, 0.025, v) * smoothstep(1.0, 0.975, v));

        // Closed rounded cross-section loop: u in [0..1] -> phi in [0..2PI] with outward normals
        const phi = u * Math.PI * 2;
        const lat = Math.cos(phi); // +1 .. -1
        const sinPhi = Math.sin(phi);
        const thickProfile = Math.sign(sinPhi) * Math.pow(Math.abs(sinPhi), 0.32);

        const wOffset = lat * ribbonHalfWidth * endCapTaper;
        const tOffset = thickProfile * 0.0075 * endCapTaper;
        const pleatRipple = Math.sin(lat * Math.PI * 2.5) * 0.011 * (0.4 + smoothstep(0.5, 1.0, v));

        t.copy(centerPt)
          .addScaledVector(acrossDir, wOffset)
          .addScaledVector(normOut, pleatRipple + tOffset);
      },
      true
    );

    // Override UVs on closed dupatta slab so both wide top/bottom faces map [0..1] for edge kinari
    const dUvAttr = dupatta.getAttribute("uv");
    for (let j = 0; j <= spineSegs; j++) {
      const vCoord = j / spineSegs;
      for (let i = 0; i <= loopSegs; i++) {
        const phi = (i / loopSegs) * Math.PI * 2;
        const texU = 0.5 + 0.5 * Math.cos(phi);
        dUvAttr.setXY(j * (loopSegs + 1) + i, texU, vCoord);
      }
    }
    dUvAttr.needsUpdate = true;

    // 7. Ornaments
    const kamarbandh = new THREE.TorusGeometry(0.228, 0.013, 16, 72);
    const choker = new THREE.TorusGeometry(0.106, 0.009, 14, 56);
    const bangle = new THREE.TorusGeometry(0.041, 0.0048, 10, 32);
    const bead = new THREE.SphereGeometry(0.011, 14, 14);
    const medallion = new THREE.CylinderGeometry(0.022, 0.016, 0.008, 16);
    const bellCone = new THREE.ConeGeometry(0.016, 0.028, 16, 1, false);
    const tasselCord = new THREE.CylinderGeometry(0.0024, 0.0024, 0.14, 8);

    return {
      torso,
      finial,
      standColumn,
      leftArm,
      rightArm,
      leftSleeve,
      rightSleeve,
      leftCuff,
      rightCuff,
      choli,
      choliHemTrim,
      choliNeckTrim,
      skirtSilk,
      skirtWaistband,
      skirtBrocadePanel,
      skirtZariBorder,
      dupatta,
      kamarbandh,
      choker,
      bangle,
      bead,
      medallion,
      bellCone,
      tasselCord,
    };
  }, []);

  useEffect(() => {
    return () => {
      Object.values(geometries).forEach((g) => g.dispose());
    };
  }, [geometries]);

  const goldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#D4AF63",
        metalness: 0.88,
        roughness: 0.2,
      }),
    []
  );

  const pearlMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#F7F1E5",
        metalness: 0.05,
        roughness: 0.14,
        clearcoat: 0.9,
        clearcoatRoughness: 0.1,
      }),
    []
  );

  useEffect(() => {
    return () => {
      goldMaterial.dispose();
      pearlMaterial.dispose();
    };
  }, [goldMaterial, pearlMaterial]);

  const chokerPearls = useMemo(() => {
    const pts = [];
    for (let i = -5; i <= 5; i++) {
      const a = Math.PI / 2 + i * 0.24;
      pts.push([
        Math.cos(a) * 0.11,
        1.146 - Math.cos((a - Math.PI / 2) * 1.4) * 0.016,
        Math.sin(a) * 0.106,
      ]);
    }
    return pts;
  }, []);

  useFrame((state) => {
    if (!active) return;
    const t = state.clock.elapsedTime;

    if (rootRef.current) {
      rootRef.current.rotation.y = Math.sin(t * 0.32) * (Math.PI / 4.2);
    }

    if (latkanRef.current) {
      const boost = breezeBoost ? 2.2 : 1.0;
      latkanRef.current.rotation.z = Math.sin(t * 2.1) * 0.08 * boost;
      latkanRef.current.rotation.x = Math.cos(t * 1.6) * 0.05 * boost;
    }

    const dx = state.pointer.x - lastPointer.current.x;
    const dy = state.pointer.y - lastPointer.current.y;
    const speedRaw = Math.sqrt(dx * dx + dy * dy);
    lastPointer.current.copy(state.pointer);

    const targetBoost = breezeBoost ? 1.35 : 0;
    if (speedRaw > 0.001) {
      interactionSpeed.current = THREE.MathUtils.lerp(
        interactionSpeed.current,
        Math.max(targetBoost, speedRaw * 50.0),
        0.12
      );
    } else {
      interactionSpeed.current = THREE.MathUtils.lerp(
        interactionSpeed.current,
        targetBoost,
        0.04
      );
    }

    updateTime(t, Math.min(interactionSpeed.current, 2.2));
  });

  return (
    <group ref={rootRef} position={position} scale={scale}>
      {/* Couture Solid Mannequin, Brass Pedestal Column & Crown Finial */}
      <mesh geometry={geometries.torso} material={named.skinMat} castShadow receiveShadow />
      <mesh geometry={geometries.standColumn} material={goldMaterial} castShadow receiveShadow />
      <mesh geometry={geometries.finial} material={goldMaterial} castShadow />
      <mesh geometry={geometries.leftArm} material={named.skinMat} castShadow />
      <mesh geometry={geometries.rightArm} material={named.skinMat} castShadow />

      {/* Solid Rolled-Edge Velvet Brocade Choli & Sleeves */}
      <mesh geometry={geometries.choli} material={named.brocadeMat} castShadow receiveShadow />
      <mesh geometry={geometries.choliHemTrim} material={named.borderMat} />
      <mesh geometry={geometries.choliNeckTrim} material={named.borderMat} />
      <mesh geometry={geometries.leftSleeve} material={named.brocadeMat} castShadow />
      <mesh geometry={geometries.rightSleeve} material={named.brocadeMat} castShadow />
      <mesh geometry={geometries.leftCuff} material={named.borderMat} />
      <mesh geometry={geometries.rightCuff} material={named.borderMat} />

      {/* Solid Closed-Volume 24-Kali Silk Lehenga Skirt & Raised Gold Zari Borders */}
      <mesh geometry={geometries.skirtSilk} material={named.silkMat} castShadow receiveShadow />
      <mesh geometry={geometries.skirtWaistband} material={named.borderMat} />
      <mesh geometry={geometries.skirtBrocadePanel} material={named.brocadeMat} castShadow />
      <mesh geometry={geometries.skirtZariBorder} material={named.borderMat} castShadow />

      {/* Solid Volumetric Silk-Zari Dupatta Slab */}
      <mesh geometry={geometries.dupatta} material={named.dupattaMat} castShadow receiveShadow />

      {/* Gold Choker Haar & Pearl Accents */}
      <mesh
        geometry={geometries.choker}
        material={goldMaterial}
        position={[0, 1.152, 0.002]}
        rotation={[Math.PI / 2 + 0.14, 0, 0]}
      />
      {chokerPearls.map((pos, idx) => (
        <mesh
          key={idx}
          geometry={geometries.bead}
          material={pearlMaterial}
          position={pos}
          scale={idx === 5 ? 1.3 : 0.72}
        />
      ))}
      <mesh
        geometry={geometries.medallion}
        material={goldMaterial}
        position={[0, 1.112, 0.118]}
        rotation={[Math.PI / 2 - 0.18, 0, 0]}
      />

      {/* Gold Bangles on Wrists */}
      {[0, 0.014, 0.028].map((off, idx) => (
        <mesh
          key={`lb-${idx}`}
          geometry={geometries.bangle}
          material={goldMaterial}
          position={[-0.31, 0.44 + off, 0.175 - off * 0.4]}
          rotation={[1.1, 0.35, 0.3]}
        />
      ))}
      {[0, 0.014, 0.028].map((off, idx) => (
        <mesh
          key={`rb-${idx}`}
          geometry={geometries.bangle}
          material={goldMaterial}
          position={[0.46, 0.53 + off, 0.24 - off * 0.4]}
          rotation={[1.1, -0.35, -0.3]}
        />
      ))}

      {/* Elliptical Gold Kamarbandh Belt + Swaying Hip Latkan Tassel */}
      <mesh
        geometry={geometries.kamarbandh}
        material={goldMaterial}
        position={[0, 0.382, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[1.18, 0.87, 1]}
        castShadow
      />

      <group ref={latkanRef} position={[0.255, 0.37, 0.105]}>
        <mesh geometry={geometries.tasselCord} material={goldMaterial} position={[0, -0.07, 0]} />
        <mesh geometry={geometries.bellCone} material={goldMaterial} position={[0, -0.14, 0]} />
        <mesh geometry={geometries.bead} material={pearlMaterial} position={[0, -0.165, 0]} scale={1.1} />

        <mesh
          geometry={geometries.tasselCord}
          material={goldMaterial}
          position={[-0.026, -0.055, 0.015]}
          rotation={[0, 0, 0.14]}
          scale={[1, 0.78, 1]}
        />
        <mesh
          geometry={geometries.bellCone}
          material={goldMaterial}
          position={[-0.036, -0.11, 0.015]}
          scale={0.8}
        />
        <mesh
          geometry={geometries.bead}
          material={pearlMaterial}
          position={[-0.036, -0.132, 0.015]}
          scale={0.9}
        />

        <mesh
          geometry={geometries.tasselCord}
          material={goldMaterial}
          position={[0.026, -0.055, 0.015]}
          rotation={[0, 0, -0.14]}
          scale={[1, 0.78, 1]}
        />
        <mesh
          geometry={geometries.bellCone}
          material={goldMaterial}
          position={[0.036, -0.11, 0.015]}
          scale={0.8}
        />
        <mesh
          geometry={geometries.bead}
          material={pearlMaterial}
          position={[0.036, -0.132, 0.015]}
          scale={0.9}
        />
      </group>
    </group>
  );
}
