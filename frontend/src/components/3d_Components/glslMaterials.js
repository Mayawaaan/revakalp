import * as THREE from 'three'
import { silkVertexShader, silkFragmentShader } from './shaders/silkShader'
import { brocadeVertexShader, brocadeFragmentShader } from './shaders/brocadeShader'
import { dupattaVertexShader, dupattaFragmentShader } from './shaders/dupattaShader'
import {
  skinVertexShader, skinFragmentShader,
  borderVertexShader, borderFragmentShader
} from './shaders/skinBorderShader'

/* ─────────────────────────────────────────────────────────────────────────────
   SCENE LIGHTS (synchronized with New3D.jsx Scene — warm ivory & gold studio)
──────────────────────────────────────────────────────────────────────────── */
const LIGHT_POSITIONS = [
  new THREE.Vector3(4, 8, 4),      // key light
  new THREE.Vector3(0, 2, 8),      // front fill
  new THREE.Vector3(-5, 4, -2),    // gold rim
  new THREE.Vector3(-3, 1, 3),     // burgundy bounce
]
const LIGHT_COLORS = [
  new THREE.Color('#FFF7EA'),
  new THREE.Color('#F7F1E5'),
  new THREE.Color('#F1D889'),
  new THREE.Color('#8A3248'),
]
const LIGHT_INTENSITIES = [2.2, 1.7, 1.4, 0.9]

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

export const WEAVE_PALETTES = {
  burgundy: {
    label: 'Royal Burgundy',
    base: '#38131E',
    skirtBase: '#38131E',
    choliBase: '#2B0E17',
    dupattaBase: '#6E2236',
    deep: '#2B0E17',
    zari: '#D4AF63',
    sheen: '#F1D889',
  },
  zardosi: {
    label: 'Ivory & Burgundy',
    base: '#F7F1E5',
    skirtBase: '#EFE3CE',
    choliBase: '#38131E',
    dupattaBase: '#38131E',
    deep: '#2B0E17',
    zari: '#D4AF63',
    sheen: '#D4AF63',
  },
  crimson: {
    label: 'Velvet Zardosi',
    base: '#2B0E17',
    skirtBase: '#2B0E17',
    choliBase: '#4D1929',
    dupattaBase: '#D4AF63',
    deep: '#1D0910',
    zari: '#F1D889',
    sheen: '#FFE5A3',
  },
}

/* ─────────────────────────────────────────────────────────────────────────────
   MATERIAL FACTORY
   Uses official Revakalp burgundy (#38131E), gold (#D4AF63 / #F1D889), ivory (#F7F1E5).
──────────────────────────────────────────────────────────────────────────── */
export function buildGLSLMaterials() {
  const initial = WEAVE_PALETTES.burgundy

  // 0 ── SKIN (MATTE-SATIN MANNEQUIN)
  const skinMat = new THREE.ShaderMaterial({
    vertexShader: skinVertexShader,
    fragmentShader: skinFragmentShader,
    uniforms: makeUniforms({
      uSkinLight: { value: new THREE.Color('#f0c9a0') },
      uSkinDark: { value: new THREE.Color('#b8743f') },
    }),
    side: THREE.FrontSide,
  })

  // 1 ── SILK PANEL (SOLID OPAQUE KALIDAR SKIRT)
  const silkMat = new THREE.ShaderMaterial({
    vertexShader: silkVertexShader,
    fragmentShader: silkFragmentShader,
    uniforms: makeUniforms({
      uBaseColor: { value: new THREE.Color(initial.skirtBase) },
      uSheenColor: { value: new THREE.Color(initial.sheen) },
    }),
    side: THREE.DoubleSide,
  })

  // 2 ── DUPATTA (SOLID OPAQUE SILK-ZARI DRAPE WITH FULL DEPTH WRITE)
  const dupattaMat = new THREE.ShaderMaterial({
    vertexShader: dupattaVertexShader,
    fragmentShader: dupattaFragmentShader,
    uniforms: makeUniforms({
      uBaseColor: { value: new THREE.Color(initial.dupattaBase) },
      uEdgeColor: { value: new THREE.Color(initial.sheen) },
    }),
    transparent: false,
    depthWrite: true,
    side: THREE.DoubleSide,
  })

  // 3 ── BROCADE (SOLID VELVET CHOLI / DAMAN)
  const brocadeMat = new THREE.ShaderMaterial({
    vertexShader: brocadeVertexShader,
    fragmentShader: brocadeFragmentShader,
    uniforms: makeUniforms({
      uBaseColor: { value: new THREE.Color(initial.choliBase) },
      uZariColor: { value: new THREE.Color(initial.zari) },
    }),
    side: THREE.DoubleSide,
  })

  // 4 ── ZARI BORDER / TRIM
  const borderMat = new THREE.ShaderMaterial({
    vertexShader: borderVertexShader,
    fragmentShader: borderFragmentShader,
    uniforms: makeUniforms({
      uBaseColor: { value: new THREE.Color(initial.deep) },
      uSilverColor: { value: new THREE.Color(initial.sheen) },
    }),
    side: THREE.DoubleSide,
  })

  const all = [brocadeMat, silkMat, dupattaMat, skinMat, borderMat]
  const named = { brocadeMat, silkMat, dupattaMat, skinMat, borderMat }

  function updateTime(t, interaction = 0) {
    for (let i = 0; i < all.length; i++) {
      const mat = all[i]
      mat.uniforms.uTime.value = t
      if (mat.uniforms.uInteraction) {
        mat.uniforms.uInteraction.value = interaction
      }
    }
  }

  function setPalette(key) {
    const p = WEAVE_PALETTES[key] || WEAVE_PALETTES.burgundy
    silkMat.uniforms.uBaseColor.value.set(p.skirtBase)
    silkMat.uniforms.uSheenColor.value.set(p.sheen)
    brocadeMat.uniforms.uBaseColor.value.set(p.choliBase)
    brocadeMat.uniforms.uZariColor.value.set(p.zari)
    dupattaMat.uniforms.uBaseColor.value.set(p.dupattaBase)
    dupattaMat.uniforms.uEdgeColor.value.set(p.sheen)
    borderMat.uniforms.uBaseColor.value.set(p.deep)
    borderMat.uniforms.uSilverColor.value.set(p.sheen)
  }

  return { materials: all, named, updateTime, setPalette }
}
