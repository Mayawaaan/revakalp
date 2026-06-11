import * as THREE from 'three'
import { silkVertexShader, silkFragmentShader } from './shaders/silkShader'
import { brocadeVertexShader, brocadeFragmentShader } from './shaders/brocadeShader'
import { dupattaVertexShader, dupattaFragmentShader } from './shaders/dupattaShader'
import {
  skinVertexShader, skinFragmentShader,
  borderVertexShader, borderFragmentShader
} from './shaders/skinBorderShader'

/* ─────────────────────────────────────────────────────────────────────────────
   SCENE LIGHTS  (must match the lights in New3D.jsx Scene)
   Passed as uniform arrays to every shader.
──────────────────────────────────────────────────────────────────────────── */
const LIGHT_POSITIONS = [
  new THREE.Vector3(4, 8, 4),      // key light
  new THREE.Vector3(0, 2, 8),      // front fill
  new THREE.Vector3(-5, 4, -2),    // silver rim
  new THREE.Vector3(-3, 1, 3),     // blue-violet fill
]
const LIGHT_COLORS = [
  new THREE.Color('#dde8ff'),
  new THREE.Color('#ffffff'),
  new THREE.Color('#c8d8ff'),
  new THREE.Color('#7088cc'),
]
const LIGHT_INTENSITIES = [2.4, 1.8, 1.2, 1.0]

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED UNIFORM BUILDER
   Creates a fresh uniforms block with the scene lights + a time uniform.
   Pass extra uniforms to merge in.
──────────────────────────────────────────────────────────────────────────── */
function makeUniforms(extras = {}) {
  return {
    uTime: { value: 0 },
    uInteraction: { value: 0 },
    uLightPos: { value: LIGHT_POSITIONS },
    uLightColor: { value: LIGHT_COLORS },
    uLightIntensity: { value: LIGHT_INTENSITIES },
    ...extras,
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   MATERIAL FACTORY
   Returns an array of 5 ShaderMaterials, one per lehenga mesh type.
   Call updateTime(t) each frame on all materials.
──────────────────────────────────────────────────────────────────────────── */
export function buildGLSLMaterials() {

  // 0 ── SKIN ────────────────────────────────────────────────────────────────
  const skinMat = new THREE.ShaderMaterial({
    vertexShader: skinVertexShader,
    fragmentShader: skinFragmentShader,
    uniforms: makeUniforms({
      uSkinLight: { value: new THREE.Color('#f0c9a0') },   // realistic light skin
      uSkinDark: { value: new THREE.Color('#b8743f') },   // realistic dark skin tone
    }),
    side: THREE.FrontSide,
  })

  // 1 ── SILK DUPATTA ────────────────────────────────────────────────────────
  const silkMat = new THREE.ShaderMaterial({
    vertexShader: silkVertexShader,
    fragmentShader: silkFragmentShader,
    uniforms: makeUniforms({
      uBaseColor: { value: new THREE.Color('#3d0030') },  // align with lengha (burgundy)
      uSheenColor: { value: new THREE.Color('#fce7f3') },  // silver-pink sheen
      uAccentColor: { value: new THREE.Color('#d4af37') },  // rich metallic gold / champagne accent
    }),
    side: THREE.DoubleSide,
  })

  // 2 ── DUPATTA (CHIFFON) ───────────────────────────────────────────────────
  const dupattaMat = new THREE.ShaderMaterial({
    vertexShader: dupattaVertexShader,
    fragmentShader: dupattaFragmentShader,
    uniforms: makeUniforms({
      uBaseColor: { value: new THREE.Color('#3d0030') },   // dark burgundy net
      uEdgeColor: { value: new THREE.Color('#fce7f3') },   // silver-pink zari work
    }),
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  })

  // 3 ── CHOLI / BLOUSE (BROCADE) ────────────────────────────────────────────
  const brocadeMat = new THREE.ShaderMaterial({
    vertexShader: brocadeVertexShader,
    fragmentShader: brocadeFragmentShader,
    uniforms: makeUniforms({
      uBaseColor: { value: new THREE.Color('#3d0030') },   // Deep dark burgundy/wine (strong contrast)
      uZariColor: { value: new THREE.Color('#fce7f3') },   // Silver-pink zari
    }),
    side: THREE.FrontSide,
  })

  // 4 ── BORDER / TRIM ───────────────────────────────────────────────────────
  const borderMat = new THREE.ShaderMaterial({
    vertexShader: borderVertexShader,
    fragmentShader: borderFragmentShader,
    uniforms: makeUniforms({
      uBaseColor: { value: new THREE.Color('#3d0030') }, // dark pink base
      uSilverColor: { value: new THREE.Color('#ffe4e1') }, // bright silver
    }),
    side: THREE.DoubleSide,
  })

  // Mesh 0 (Choli)   -> Brocade (geometric lotus pattern)
  // Mesh 1 (Skirt)   -> Brocade (stretched lotus pattern that creates vertical stripes)
  // Mesh 2 (Dupatta) -> Net with Zari Work (dupattaMat)
  // Mesh 3 (Body)    -> Skin
  // Mesh 4 (Border)  -> Border
  const all = [brocadeMat, brocadeMat, dupattaMat, skinMat, borderMat]

  /* updateTime – call this from useFrame every tick */
  function updateTime(t, interaction = 0) {
    all.forEach(mat => {
      mat.uniforms.uTime.value = t
      if (mat.uniforms.uInteraction) {
        mat.uniforms.uInteraction.value = interaction
      }
    })
  }

  return { materials: all, updateTime }
}
