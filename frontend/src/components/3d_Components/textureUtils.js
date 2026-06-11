import * as THREE from 'three'

/* ─────────────────────────────────────────────
   HELPER: create a CanvasTexture from a draw fn
   size: power-of-2 (256, 512, 1024)
───────────────────────────────────────────── */
function makeTexture(size, drawFn, wrapS = THREE.RepeatWrapping, wrapT = THREE.RepeatWrapping, repeat = [4, 4]) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  drawFn(ctx, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = wrapS
  tex.wrapT = wrapT
  tex.repeat.set(...repeat)
  tex.needsUpdate = true
  return tex
}

/* ─────────────────────────────────────────────
   1. SILK FABRIC WEAVE  (lehenga skirt / choli)
   Royal Blue raw silk with fine warp/weft weave
───────────────────────────────────────────── */
export function makeSilkTexture() {
  return makeTexture(512, (ctx, S) => {
    // Base: deep royal blue
    ctx.fillStyle = '#1a237e'
    ctx.fillRect(0, 0, S, S)

    // Silk sheen gradient overlay
    const grad = ctx.createLinearGradient(0, 0, S, S)
    grad.addColorStop(0,   'rgba(100,130,255,0.18)')
    grad.addColorStop(0.4, 'rgba(255,255,255,0.04)')
    grad.addColorStop(0.7, 'rgba(60,90,200,0.12)')
    grad.addColorStop(1,   'rgba(100,130,255,0.20)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, S, S)

    // Warp threads (vertical) – lighter blue
    ctx.strokeStyle = 'rgba(140,160,255,0.28)'
    ctx.lineWidth = 1.2
    for (let x = 0; x < S; x += 4) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, S)
      ctx.stroke()
    }

    // Weft threads (horizontal) – darker blue
    ctx.strokeStyle = 'rgba(20,40,130,0.30)'
    ctx.lineWidth = 1.0
    for (let y = 0; y < S; y += 4) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(S, y)
      ctx.stroke()
    }

    // Diagonal iridescent silk shimmer
    ctx.strokeStyle = 'rgba(200,210,255,0.06)'
    ctx.lineWidth = 8
    for (let d = -S; d < S * 2; d += 40) {
      ctx.beginPath()
      ctx.moveTo(d, 0)
      ctx.lineTo(d + S, S)
      ctx.stroke()
    }
  }, THREE.RepeatWrapping, THREE.RepeatWrapping, [8, 8])
}

/* ─────────────────────────────────────────────
   2. ZARI BROCADE  (embroidery overlay texture)
   Silver floral + geometric zari on blue base
───────────────────────────────────────────── */
export function makeBrocadeTexture() {
  return makeTexture(512, (ctx, S) => {
    // Transparent base (applied as emissiveMap / alphaMap over silk)
    ctx.clearRect(0, 0, S, S)
    ctx.fillStyle = 'rgba(20, 30, 100, 0.6)'
    ctx.fillRect(0, 0, S, S)

    const TILE = 64 // motif tile size

    for (let tx = 0; tx < S; tx += TILE) {
      for (let ty = 0; ty < S; ty += TILE) {
        const cx = tx + TILE / 2
        const cy = ty + TILE / 2

        // Silver zari border diamond
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(Math.PI / 4)
        ctx.strokeStyle = 'rgba(220,230,255,0.85)'
        ctx.lineWidth = 1.5
        ctx.strokeRect(-14, -14, 28, 28)
        ctx.restore()

        // Central lotus / floral motif
        const petals = 8
        for (let p = 0; p < petals; p++) {
          const angle = (p / petals) * Math.PI * 2
          const px = cx + Math.cos(angle) * 10
          const py = cy + Math.sin(angle) * 10
          ctx.beginPath()
          ctx.ellipse(px, py, 4, 2, angle, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(210,220,255,0.70)'
          ctx.fill()
        }

        // Center dot
        ctx.beginPath()
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(230,240,255,0.95)'
        ctx.fill()

        // Corner silver dots
        const corners = [[-22, -22], [22, -22], [22, 22], [-22, 22]]
        corners.forEach(([ox, oy]) => {
          ctx.beginPath()
          ctx.arc(cx + ox, cy + oy, 1.8, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(200,215,255,0.80)'
          ctx.fill()
        })

        // Connecting vine lines
        ctx.strokeStyle = 'rgba(200,215,255,0.45)'
        ctx.lineWidth = 0.8
        const vineAngles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5]
        vineAngles.forEach(a => {
          ctx.beginPath()
          ctx.moveTo(cx + Math.cos(a) * 12, cy + Math.sin(a) * 12)
          ctx.quadraticCurveTo(
            cx + Math.cos(a + 0.4) * 20, cy + Math.sin(a + 0.4) * 20,
            cx + Math.cos(a) * 30, cy + Math.sin(a) * 30
          )
          ctx.stroke()
        })
      }
    }
  }, THREE.RepeatWrapping, THREE.RepeatWrapping, [4, 4])
}

/* ─────────────────────────────────────────────
   3. DUPATTA GOSSAMER  (sheer silk chiffon)
   Very fine mesh weave, nearly transparent
───────────────────────────────────────────── */
export function makeDupattaTexture() {
  return makeTexture(256, (ctx, S) => {
    ctx.fillStyle = '#3949ab'
    ctx.fillRect(0, 0, S, S)

    // Ultra-fine mesh
    ctx.strokeStyle = 'rgba(180,200,255,0.35)'
    ctx.lineWidth = 0.8
    for (let i = 0; i < S; i += 3) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, S); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(S, i); ctx.stroke()
    }

    // Soft shimmer diagonals
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'
    ctx.lineWidth = 6
    for (let d = -S; d < S * 2; d += 30) {
      ctx.beginPath(); ctx.moveTo(d, 0); ctx.lineTo(d + S, S); ctx.stroke()
    }

    // Scattered silver sparkle dots (zari threads)
    for (let i = 0; i < 80; i++) {
      const sx = Math.random() * S
      const sy = Math.random() * S
      ctx.beginPath()
      ctx.arc(sx, sy, 0.8, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(220,235,255,0.7)'
      ctx.fill()
    }
  }, THREE.RepeatWrapping, THREE.RepeatWrapping, [6, 6])
}

/* ─────────────────────────────────────────────
   4. BORDER / TRIM  (heavy silver zari border)
   Stripe of dense silver embroidery
───────────────────────────────────────────── */
export function makeBorderTexture() {
  return makeTexture(256, (ctx, S) => {
    // Dark blue base
    ctx.fillStyle = '#0d1660'
    ctx.fillRect(0, 0, S, S)

    // Dense silver chain stitch
    const bandH = S * 0.3
    const bandY = (S - bandH) / 2

    // Silver band fill
    const bGrad = ctx.createLinearGradient(0, bandY, 0, bandY + bandH)
    bGrad.addColorStop(0, 'rgba(200,210,240,0.9)')
    bGrad.addColorStop(0.5, 'rgba(255,255,255,0.95)')
    bGrad.addColorStop(1, 'rgba(180,195,230,0.9)')
    ctx.fillStyle = bGrad
    ctx.fillRect(0, bandY, S, bandH)

    // Chevron zigzag inside band
    ctx.strokeStyle = '#1a237e'
    ctx.lineWidth = 2
    const zigStep = 16
    ctx.beginPath()
    for (let x = 0; x < S; x += zigStep) {
      ctx.lineTo(x, bandY + (x % (zigStep * 2) < zigStep ? 4 : bandH - 4))
    }
    ctx.stroke()

    // Edge lines
    ctx.strokeStyle = 'rgba(180,195,240,0.9)'
    ctx.lineWidth = 2
    ctx.strokeRect(0, bandY, S, bandH)
  }, THREE.RepeatWrapping, THREE.RepeatWrapping, [6, 2])
}

/* ─────────────────────────────────────────────
   5. SKIN TEXTURE  (mannequin body / skin tones)
───────────────────────────────────────────── */
export function makeSkinTexture() {
  return makeTexture(256, (ctx, S) => {
    const grad = ctx.createRadialGradient(S * 0.4, S * 0.35, S * 0.05, S * 0.5, S * 0.5, S * 0.7)
    grad.addColorStop(0, '#f0c9a0')
    grad.addColorStop(0.6, '#d4956a')
    grad.addColorStop(1, '#b8743f')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, S, S)

    // Subtle skin pore noise
    for (let i = 0; i < 600; i++) {
      ctx.beginPath()
      ctx.arc(Math.random() * S, Math.random() * S, 0.5, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(140,80,40,0.08)'
      ctx.fill()
    }
  }, THREE.RepeatWrapping, THREE.RepeatWrapping, [2, 2])
}

/* ─────────────────────────────────────────────
   IMAGE TEXTURE LOADER (optional overrides)
   Drop PNGs in /public/textures/ and pass paths:
   {
     silk: '/textures/silk.jpg',
     brocade: '/textures/brocade.jpg',
     dupatta: '/textures/dupatta.jpg',
   }
───────────────────────────────────────────── */
export function loadImageTexture(url, repeat = [4, 4]) {
  const loader = new THREE.TextureLoader()
  const tex = loader.load(url)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(...repeat)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/* ─────────────────────────────────────────────
   MATERIAL FACTORY
   Returns MeshPhysicalMaterial pre-configured
   for each lehenga part. Pass imageUrls to
   override procedural textures with real photos.
───────────────────────────────────────────── */
export function buildLeghaMaterials(imageUrls = {}) {
  const silkMap     = imageUrls.silk    ? loadImageTexture(imageUrls.silk,    [8, 8]) : makeSilkTexture()
  const brocadeMap  = imageUrls.brocade ? loadImageTexture(imageUrls.brocade, [4, 4]) : makeBrocadeTexture()
  const dupattaMap  = imageUrls.dupatta ? loadImageTexture(imageUrls.dupatta, [6, 6]) : makeDupattaTexture()
  const borderMap   = imageUrls.border  ? loadImageTexture(imageUrls.border,  [6, 2]) : makeBorderTexture()
  const skinMap     = imageUrls.skin    ? loadImageTexture(imageUrls.skin,    [2, 2]) : makeSkinTexture()

  // Cycle through materials for each mesh in the GLB
  return [
    // Mesh 0 – Skin / body
    new THREE.MeshPhysicalMaterial({
      map: skinMap,
      roughness: 0.75,
      metalness: 0.0,
      side: THREE.FrontSide,
    }),

    // Mesh 1 – Lehenga skirt (raw silk)
    new THREE.MeshPhysicalMaterial({
      map: silkMap,
      roughness: 0.50,
      metalness: 0.05,
      sheen: 0.8,
      sheenColor: new THREE.Color('#8899ff'),
      sheenRoughness: 0.4,
      side: THREE.DoubleSide,
      envMapIntensity: 1.2,
    }),

    // Mesh 2 – Dupatta (sheer chiffon)
    new THREE.MeshPhysicalMaterial({
      map: dupattaMap,
      roughness: 0.35,
      metalness: 0.05,
      transmission: 0.25,
      transparent: true,
      opacity: 0.88,
      sheen: 0.6,
      sheenColor: new THREE.Color('#aabbff'),
      sheenRoughness: 0.3,
      side: THREE.DoubleSide,
      envMapIntensity: 1.5,
    }),

    // Mesh 3 – Choli / blouse (heavy brocade)
    new THREE.MeshPhysicalMaterial({
      map: brocadeMap,
      roughness: 0.55,
      metalness: 0.20,
      sheen: 0.5,
      sheenColor: new THREE.Color('#c0ccff'),
      side: THREE.FrontSide,
      envMapIntensity: 1.3,
    }),

    // Mesh 4 – Border / trim (heavy silver zari)
    new THREE.MeshPhysicalMaterial({
      map: borderMap,
      roughness: 0.25,
      metalness: 0.70,
      reflectivity: 0.9,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
      side: THREE.DoubleSide,
      envMapIntensity: 2.0,
    }),
  ]
}
