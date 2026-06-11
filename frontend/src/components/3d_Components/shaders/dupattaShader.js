// ─── Dupatta (Sheer Chiffon) GLSL Shader ─────────────────────────────────────
// Gossamer fine mesh, Fresnel translucency, animated silver sparkle zari threads

export const dupattaVertexShader = /* glsl */`
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec2 vUv;
  varying vec3 vViewDir;

  uniform float uTime;
  uniform float uInteraction;

  void main() {
    // Dupatta (Chiffon) waves more freely, anchored roughly at the shoulder (y > 0.8)
    float waveMask = smoothstep(0.8, -1.5, position.y);
    
    // Fast, fluttery wind for sheer cloth - Balanced scale
    float interactionScale = 1.0 + uInteraction;
    float wave1 = sin(position.x * 5.0 + position.y * 3.0 + uTime * 2.5) * 0.10 * interactionScale;
    float wave2 = cos(position.z * 6.0 - position.y * 2.0 + uTime * 3.0) * 0.06 * interactionScale;
    
    vec3 pos = position;
    pos.x += wave1 * waveMask;
    pos.y += wave2 * waveMask * 0.3; // Slight lift
    pos.z += (wave1 + wave2) * 0.8 * waveMask;
    
    vec3 newNormal = normalize(normal + vec3(wave1, wave2 * 0.3, wave1+wave2) * waveMask * 2.0);

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPos     = worldPos.xyz;
    vWorldNormal  = normalize(mat3(modelMatrix) * newNormal);
    vUv           = uv;
    vViewDir      = normalize(cameraPosition - worldPos.xyz);
    gl_Position   = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

export const dupattaFragmentShader = /* glsl */`
  uniform float uTime;
  uniform vec3  uLightPos[4];
  uniform vec3  uLightColor[4];
  uniform float uLightIntensity[4];
  uniform vec3  uBaseColor;
  uniform vec3  uEdgeColor;

  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec2 vUv;
  varying vec3 vViewDir;

  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float hash12(float p) {
    return fract(sin(p * 127.1) * 43758.5453);
  }

  // ── Gossamer mesh grid ────────────────────────────────────────────────────
  // Returns 1 on thread, 0 in void (the fabric holes)
  float chiffonGrid(vec2 uv, float density) {
    vec2 g = fract(uv * density);
    float threadW = 0.25;                              // net thread width
    float onWarp  = step(g.x, threadW);
    float onWeft  = step(g.y, threadW);
    return clamp(onWarp + onWeft, 0.0, 1.0);
  }

  // ── Rotate 2D ─────────────────────────────────────────────────────────────
  vec2 rot2(vec2 p, float a) {
    float s = sin(a), c = cos(a);
    return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
  }

  // ── Floral Zari Work Motif ────────────────────────────────────────────────
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

  // ── Flowing ripple distortion (dupatta moves in wind) ─────────────────────
  vec2 windDistort(vec2 uv) {
    float wave = sin(uv.y * 8.0 - uTime * 1.4) * 0.006
               + sin(uv.x * 6.0 + uTime * 0.9) * 0.004;
    return vec2(wave, wave * 0.5);
  }

  // ── Scattered zari sparkle threads ────────────────────────────────────────
  float zariBlink(vec2 uv) {
    // Each grid cell either has a sparkle thread or not (random)
    vec2 cell  = floor(uv * 30.0);
    float rand = hash21(cell);
    if (rand < 0.85) return 0.0;            // 15% of cells have a zari thread

    // Within those cells: a thin bright streak
    vec2 p     = fract(uv * 30.0);
    float axis = hash12(rand) > 0.5 ? p.x : p.y;
    float streak = 1.0 - smoothstep(0.0, 0.06, abs(p.x - 0.5)) * smoothstep(0.0, 0.06, abs(p.y - 0.5));

    // Animate blink
    float blink = 0.5 + 0.5 * sin(uTime * 3.0 + rand * 6.28);
    return streak * blink;
  }

  // ── Fresnel ───────────────────────────────────────────────────────────────
  float fresnel(vec3 N, vec3 V, float f0) {
    return f0 + (1.0 - f0) * pow(1.0 - max(dot(N, V), 0.0), 5.0);
  }

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(vViewDir);

    // Apply wind distortion to UV
    vec2 warpedUV = vUv + windDistort(vUv);

    // ── Chiffon / Net mesh ──────────────────────────────────────────────────
    float grid     = chiffonGrid(warpedUV, 100.0);
    float gridFine = chiffonGrid(warpedUV, 200.0) * 0.3;
    float thread   = clamp(grid + gridFine, 0.0, 1.0);

    // ── Zari Floral Work ───────────────────────────────────────────────────
    float tileScale = 12.0; 
    vec2 tileUV = vUv * tileScale;
    if (mod(floor(tileUV.y), 2.0) == 1.0) tileUV.x += 0.5; // staggered
    vec2 tileP = fract(tileUV) - 0.5;
    
    float lotusDist = lotus(tileP, 0.35);
    float zariWork = smoothstep(0.02, -0.02, lotusDist);

    // ── Zari sparkles ─────────────────────────────────────────────────────
    float sparkle  = zariBlink(warpedUV) + (hash21(tileP) > 0.95 ? 1.0 : 0.0) * zariWork * sin(uTime*4.0)*0.5;

    // ── Opacity ───────────────────────────────────────────────────────────
    // Net is highly transparent; Zari work is fully opaque
    float F        = fresnel(N, V, 0.03);
    float opacity  = mix(0.15, 0.75, thread);       // holes are highly transparent
    opacity        = mix(opacity, 1.0, zariWork);   // zari work is fully opaque
    opacity        = clamp(opacity + F * 0.35, 0.0, 1.0);

    // ── Lighting ──────────────────────────────────────────────────────────
    vec3 diffuse  = vec3(0.0);
    vec3 specular = vec3(0.0);
    for (int i = 0; i < 4; i++) {
      vec3  L    = normalize(uLightPos[i] - vWorldPos);
      float diff = max(dot(N, L), 0.0) + 0.15; // wrap lighting for thin cloth
      diffuse   += uLightColor[i] * diff * uLightIntensity[i];

      vec3  H    = normalize(L + V);
      // Net gets soft spec, Zari gets very sharp metallic spec
      float spec = pow(max(dot(N, H), 0.0), mix(28.0, 120.0, zariWork));
      specular  += uLightColor[i] * spec * uLightIntensity[i] * mix(0.3, 2.0, zariWork);
    }

    // ── Edge glow (Fresnel rim on dupatta borders) ────────────────────────
    float rim  = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    vec3 rimCol = uEdgeColor * rim * 0.7;

    // ── Compose ───────────────────────────────────────────────────────────
    vec3 baseCol   = mix(uBaseColor * thread, uEdgeColor, zariWork); // color zari with edge color
    vec3 sparkleCol = vec3(1.0, 0.95, 1.0) * clamp(sparkle, 0.0, 1.0);
    vec3 color     = baseCol * (diffuse * 0.8 + 0.2) + specular + rimCol + sparkleCol;
    color = pow(color, vec3(1.0 / 2.2));

    gl_FragColor = vec4(color, opacity);
  }
`
