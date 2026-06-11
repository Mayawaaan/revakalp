// ─── Zari Brocade GLSL Shader ────────────────────────────────────────────────
// Procedural silver zari embroidery: lotus motifs, diamond lattice, metallic sheen

export const brocadeVertexShader = /* glsl */`
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec2 vUv;
  varying vec3 vViewDir;

  uniform float uTime;
  uniform float uInteraction;

  void main() {
    // The skirt waves mainly at the bottom hem (y < 0) and is anchored at the waist (y > 0.4)
    // The mask ensures the choli (blouse, y > 0.5) stays perfectly still!
    float waveMask = smoothstep(0.4, -1.0, position.y);
    
    // Convert to polar coordinates to create circular/radial waves!
    float angle = atan(position.z, position.x);
    
    // Wavy circular flaring (moves around the skirt) - Balanced scale
    float flare = sin(angle * 5.0 - uTime * 3.0) * 0.15;
    // Overall expansion and contraction (breathing effect)
    float pulse = sin(uTime * 2.0) * 0.08;
    
    // Scale physics intensity by mouse interaction speed! (Base 1x, up to 3.5x when dragged fast)
    float interactionScale = 1.0 + uInteraction;
    float totalWave = (flare + pulse) * interactionScale;
    
    vec3 pos = position;
    // Expand outward radially
    vec2 dir = normalize(position.xz);
    pos.x += dir.x * totalWave * waveMask;
    pos.z += dir.y * totalWave * waveMask;
    pos.y += totalWave * 0.3 * waveMask; // lift up slightly when flaring out

    // Recalculate normal approximation for lighting
    vec3 newNormal = normalize(normal + vec3(dir.x * totalWave, totalWave * 0.3, dir.y * totalWave) * waveMask * 2.0);

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPos     = worldPos.xyz;
    vWorldNormal  = normalize(mat3(modelMatrix) * newNormal);
    vUv           = uv;
    vViewDir      = normalize(cameraPosition - worldPos.xyz);
    gl_Position   = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

export const brocadeFragmentShader = /* glsl */`
  uniform float uTime;
  uniform vec3  uLightPos[4];
  uniform vec3  uLightColor[4];
  uniform float uLightIntensity[4];
  uniform vec3  uBaseColor;
  uniform vec3  uZariColor;

  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec2 vUv;
  varying vec3 vViewDir;

  // ── SDF helpers ───────────────────────────────────────────────────────────
  float sdCircle(vec2 p, float r) {
    return length(p) - r;
  }
  float sdBox(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
  }
  float sdLine(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
  }

  // ── Rotate 2D ─────────────────────────────────────────────────────────────
  vec2 rot2(vec2 p, float a) {
    float s = sin(a), c = cos(a);
    return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
  }

  // ── Fresnel ───────────────────────────────────────────────────────────────
  float fresnel(vec3 N, vec3 V, float f0) {
    return f0 + (1.0 - f0) * pow(1.0 - max(dot(N, V), 0.0), 5.0);
  }

  // ── Hash ──────────────────────────────────────────────────────────────────
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // ── Lotus petal motif (8 petals via SDF ellipses) ─────────────────────────
  float lotus(vec2 p, float r) {
    float d = 1e5;
    for (int i = 0; i < 8; i++) {
      float angle = float(i) * 3.14159265 * 0.25;
      vec2 petalCenter = vec2(cos(angle), sin(angle)) * r * 0.55;
      // Elongated ellipse via scaled distance
      vec2 pRot = rot2(p - petalCenter, -angle);
      float ellipse = length(vec2(pRot.x / (r * 0.38), pRot.y / (r * 0.18))) - 1.0;
      d = min(d, ellipse);
    }
    // Center circle
    d = min(d, sdCircle(p, r * 0.18));
    return d;
  }

  // ── Diamond lattice (rotated square grid) ─────────────────────────────────
  float diamondLattice(vec2 uv, float scale, float thickness) {
    vec2 g = fract(rot2(uv * scale, 0.7854)) - 0.5; // 45 deg rotated grid
    vec2 id = floor(rot2(uv * scale, 0.7854));
    float box = sdBox(g, vec2(0.48));
    return smoothstep(thickness + 0.01, thickness - 0.01, abs(box));
  }

  // ── Vine curve between motifs ─────────────────────────────────────────────
  float vine(vec2 p) {
    float d = 1e5;
    // 4 cardinal vines (horizontal + vertical)
    for (int i = 0; i < 4; i++) {
      float angle = float(i) * 1.5707963;
      vec2 dir = vec2(cos(angle), sin(angle));
      vec2 pr = rot2(p, -angle);
      // Bezier-ish arc: sample a curved path
      float t = clamp(pr.x * 1.5, 0.0, 1.0);
      float yArc = sin(t * 3.14159) * 0.08;
      float dLine = abs(pr.y - yArc) - 0.012;
      d = min(d, dLine);
    }
    return d;
  }

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(vViewDir);

    // ── Tile the brocade pattern ───────────────────────────────────────────
    // Each tile = one lotus + surrounding lattice + vines
    float tileScale = 6.0;
    vec2 tileUV  = vUv * tileScale;
    vec2 tileId  = floor(tileUV);
    vec2 tileP   = fract(tileUV) - 0.5;   // [-0.5, 0.5]

    // Lotus flower SDF
    float lotusDist  = lotus(tileP, 0.32);
    float lotusShape = smoothstep(0.015, -0.015, lotusDist);

    // Diamond border lattice around the tile edges
    float lattice    = diamondLattice(vUv, tileScale, 0.02);

    // Corner dots
    float dotDist = 1e5;
    vec2 corners[4];
    corners[0] = vec2(-0.42, -0.42); corners[1] = vec2(0.42, -0.42);
    corners[2] = vec2( 0.42,  0.42); corners[3] = vec2(-0.42, 0.42);
    for (int c = 0; c < 4; c++) {
      dotDist = min(dotDist, sdCircle(tileP - corners[c], 0.04));
    }
    float cornerDots = smoothstep(0.01, -0.01, dotDist);

    // Vine lines between motifs
    float vineShape  = smoothstep(0.005, -0.005, vine(tileP));

    // ── Combine zari mask ─────────────────────────────────────────────────
    float zariMask = clamp(lotusShape + lattice * 0.8 + cornerDots + vineShape * 0.6, 0.0, 1.0);

    // ── Silk base (dark royal blue) ───────────────────────────────────────
    // Fine diagonal weave in the base
    float microWeave = mod(floor(vUv.x * 120.0) + floor(vUv.y * 120.0), 2.0) * 0.04;
    vec3 fabricColor = uBaseColor + microWeave;

    // ── Zari metallic color  ──────────────────────────────────────────────
    // Zari glints based on view angle (metallic luster)
    float zariGlint  = pow(max(dot(N, V), 0.0), 3.0);
    vec3 zariCol     = mix(uZariColor * 0.7, uZariColor * 1.5 + vec3(0.3), zariGlint);

    // ── Lighting ──────────────────────────────────────────────────────────
    vec3 diffuse  = vec3(0.0);
    vec3 specular = vec3(0.0);
    for (int i = 0; i < 4; i++) {
      vec3  L    = normalize(uLightPos[i] - vWorldPos);
      float diff = max(dot(N, L), 0.0);
      diffuse   += uLightColor[i] * diff * uLightIntensity[i];

      vec3  H    = normalize(L + V);
      float spec = pow(max(dot(N, H), 0.0), 64.0);
      specular  += uLightColor[i] * spec * uLightIntensity[i] * zariMask * 2.5;
    }

    // Fresnel on zari
    float F     = fresnel(N, V, 0.1) * zariMask;
    vec3 fresnelAdd = uZariColor * F * 0.6;

    // ── Animated zari sparkle ─────────────────────────────────────────────
    float sparkle = hash(tileId + vec2(floor(uTime * 4.0)));
    sparkle = step(0.92, sparkle) * lotusShape; // rare sparkles on lotus only
    vec3 sparkleCol = vec3(1.0) * sparkle * 0.8;

    // ── Final mix ─────────────────────────────────────────────────────────
    vec3 color = mix(fabricColor, zariCol, zariMask);
    color = color * (vec3(0.15) + diffuse * 0.9) + specular + fresnelAdd + sparkleCol;
    color = pow(color, vec3(1.0 / 2.2));

    gl_FragColor = vec4(color, 1.0);
  }
`
