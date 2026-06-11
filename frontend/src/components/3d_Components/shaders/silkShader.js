// ─── Silk Fabric GLSL Shader ─────────────────────────────────────────────────
// Procedural woven fabric with anisotropic-like sheen and animated shimmer.

export const silkVertexShader = /* glsl */`
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec2 vUv;
  varying vec3 vViewDir;

  uniform float uTime;
  uniform float uInteraction;

  void main() {
    // The skirt waves mainly at the bottom hem (y < 0) and is anchored at the waist (y > 0.5)
    float waveMask = smoothstep(0.5, -1.0, position.y);
    
    // Convert to polar coordinates to create circular/radial waves!
    float angle = atan(position.z, position.x);
    
    // Wavy circular flaring (moves around the skirt)
    float flare = sin(angle * 5.0 - uTime * 3.0) * 0.06;
    // Overall expansion and contraction (breathing effect)
    float pulse = sin(uTime * 2.0) * 0.08; // Matched to brocade balance
    
    // Scale physics intensity by mouse interaction speed
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

    vec4 worldPos    = modelMatrix * vec4(pos, 1.0);
    vWorldPos        = worldPos.xyz;
    vWorldNormal     = normalize(mat3(modelMatrix) * newNormal);
    vUv              = uv;
    vViewDir         = normalize(cameraPosition - worldPos.xyz);
    gl_Position      = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

export const silkFragmentShader = /* glsl */`
  uniform float  uTime;
  uniform vec3   uLightPos[4];
  uniform vec3   uLightColor[4];
  uniform vec3   uBaseColor;
  uniform vec3   uSheenColor;

  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec2 vUv;
  varying vec3 vViewDir;

  // ── Hash / noise ─────────────────────────────────────────────────────────
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),           hash(i + vec2(1,0)), f.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
      f.y
    );
  }

  // ── Silk weave pattern ───────────────────────────────────────────────────
  float weave(vec2 uv, float scale) {
    vec2 g = fract(uv * scale);          // grid cell
    vec2 id = floor(uv * scale);
    float toggle = mod(id.x + id.y, 2.0); // checker weave

    // Thread ridge: bright near 0.5, dark at edges of each cell
    float warpRidge  = smoothstep(0.35, 0.5, g.x) - smoothstep(0.5, 0.65, g.x);
    float weftRidge  = smoothstep(0.35, 0.5, g.y) - smoothstep(0.5, 0.65, g.y);

    return mix(warpRidge, weftRidge, toggle);
  }

  // ── Schlick Fresnel ──────────────────────────────────────────────────────
  float fresnel(vec3 N, vec3 V, float f0) {
    float cosTheta = max(dot(N, V), 0.0);
    return f0 + (1.0 - f0) * pow(1.0 - cosTheta, 5.0);
  }

  // ── Rotate 2D ─────────────────────────────────────────────────────────────
  vec2 rot2(vec2 p, float a) {
    float s = sin(a), c = cos(a);
    return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
  }

  // ── Lotus petal motif (8 petals via SDF ellipses) ─────────────────────────
  float lotus(vec2 p, float r) {
    float d = 1e5;
    for (int i = 0; i < 8; i++) {
      float angle = float(i) * 3.14159265 * 0.25;
      vec2 petalCenter = vec2(cos(angle), sin(angle)) * r * 0.55;
      vec2 pRot = rot2(p - petalCenter, -angle);
      float ellipse = length(vec2(pRot.x / (r * 0.38), pRot.y / (r * 0.18))) - 1.0;
      d = min(d, ellipse);
    }
    d = min(d, length(p) - r * 0.18);
    return d;
  }


  // ── Taj Mahal Jali (8-Point Star Lattice) ───────────────────────────────
  float jaliLattice(vec2 uv, float thickness) {
    vec2 p = fract(uv) - 0.5; // Tile space [-0.5, 0.5]
    
    // 8-point star composed of a square and a 45-degree rotated square
    vec2 pRot = rot2(p, 0.785398);
    
    // Outlines
    float s1 = abs(max(abs(p.x), abs(p.y)) - 0.30);
    float s2 = abs(max(abs(pRot.x), abs(pRot.y)) - 0.30);
    float starLines = min(s1, s2);
    
    // Horizontal and vertical connecting lines between the stars
    float connect1 = (abs(p.x) > 0.30) ? abs(p.y) : 1e5;
    float connect2 = (abs(p.y) > 0.30) ? abs(p.x) : 1e5;
    float connect = min(connect1, connect2);
    
    // Combine all lines
    float allLines = min(starLines, connect);
    float latticeMask = smoothstep(thickness + 0.01, thickness - 0.01, allLines);
    
    // Tiny solid 8-point star in the absolute center
    float centerDist = max(abs(p.x) + abs(p.y), max(abs(p.x), abs(p.y)) * 1.414);
    float centerDot = smoothstep(0.08, 0.06, centerDist);
    
    return clamp(latticeMask + centerDot, 0.0, 1.0);
  }

  void main() {
    vec3  N = normalize(vWorldNormal);
    vec3  V = normalize(vViewDir);

    // ── Cylindrical Projection ──────────────────────────────────────────────
    float angle = atan(vWorldPos.z, vWorldPos.x);
    float u = angle / (2.0 * 3.14159) + 0.5;
    float v = vWorldPos.y;
    vec2 projUV = vec2(u * 6.0, v * 2.0);

    // ── Taj Mahal Mughal Jali ──────────────────────────────────────────────
    // Scale the tiles
    float tileScale = 18.0; 
    vec2 tileUV = projUV * tileScale;
    
    // Offset every other row so the stars interlock perfectly like tiles
    if (mod(floor(tileUV.y), 2.0) == 1.0) {
      tileUV.x += 0.5;
    }
    
    // Generate the geometric lattice
    float zariMask = jaliLattice(tileUV, 0.02);
    
    // Double lines! We can extract a thinner, brighter core for the silver threads
    float zariCore = jaliLattice(tileUV, 0.005);

    // ── Silk base (dark royal blue/burgundy) ──────────────────────────────
    float microWeave = mod(floor(projUV.x * 200.0) + floor(projUV.y * 200.0), 2.0) * 0.03;
    vec3 baseColor = uBaseColor + microWeave;

    // The zari/embroidery has the sheen color. Make the core even brighter.
    vec3 floralColor = mix(baseColor, uSheenColor * 1.5, 0.8);
    floralColor = mix(floralColor, vec3(1.0), zariCore); // blinding silver core
    baseColor = mix(baseColor, floralColor, zariMask);

    // ── Multi-light Phong shading ─────────────────────────────────────────
    vec3 diffuse  = vec3(0.0);
    vec3 specular = vec3(0.0);

    for (int i = 0; i < 4; i++) {
      vec3 L = normalize(uLightPos[i] - vWorldPos);
      float diff = max(dot(N, L), 0.0);
      diffuse += uLightColor[i] * diff * uLightIntensity[i];

      // Anisotropic-like: specular along horizontal thread direction
      vec3 threadDir = normalize(vec3(1.0, 0.0, 0.1));  // warp direction
      vec3 H = normalize(L + V);
      float anisoSpec = pow(max(dot(H, threadDir), 0.0), 120.0);
      
      // Give the floral patterns a slightly sharper specular reflection
      float floralSpec = pow(max(dot(H, N), 0.0), 60.0) * zariMask;
      
      specular += uLightColor[i] * (anisoSpec * 0.6 + floralSpec * 1.5) * uLightIntensity[i];
    }

    // ── Sheen (silk micro-fiber scattering) ──────────────────────────────
    float sheenFactor = fresnel(N, V, 0.04) * 1.8;
    vec3 sheen = uSheenColor * sheenFactor;

    // ── Ambient ──────────────────────────────────────────────────────────
    vec3 ambient = uBaseColor * 0.18;

    vec3 color = ambient + baseColor * (diffuse * 0.85) + specular + sheen;
    color = pow(color, vec3(1.0 / 2.2));   // gamma correct

    gl_FragColor = vec4(color, 1.0);
  }
`
