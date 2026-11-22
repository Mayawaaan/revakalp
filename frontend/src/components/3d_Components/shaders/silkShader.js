// ─── Solid Royal Satin-Silk GLSL Shader ──────────────────────────────────────
// 100% opaque satin-silk fabric with 24-kali fold shading, anisotropic sheen,
// and understated woven gold zari accents near the lower skirt flare.

export const silkVertexShader = /* glsl */`
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec2 vUv;
  varying vec3 vViewDir;

  uniform float uTime;
  uniform float uInteraction;

  void main() {
    float lenXZ = length(position.xz);
    float waveMask = smoothstep(0.35, -1.35, position.y) * smoothstep(0.08, 0.35, lenXZ);
    float angle = atan(position.z, position.x);

    float flare = sin(angle * 5.0 - uTime * 3.0) * 0.06;
    float pulse = sin(uTime * 2.0) * 0.06;
    float totalWave = (flare + pulse) * (1.0 + uInteraction);

    vec3 pos = position;
    vec2 dir = lenXZ > 0.0001 ? position.xz / lenXZ : vec2(0.0);
    pos.x += dir.x * totalWave * waveMask;
    pos.z += dir.y * totalWave * waveMask;
    pos.y += totalWave * 0.3 * waveMask;

    vec3 newNormal = normalize(normal + vec3(dir.x * totalWave, totalWave * 0.3, dir.y * totalWave) * waveMask * 2.0);

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPos     = worldPos.xyz;
    vWorldNormal  = normalize(mat3(modelMatrix) * newNormal);
    vUv           = uv;
    vViewDir      = normalize(cameraPosition - worldPos.xyz);
    gl_Position   = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

export const silkFragmentShader = /* glsl */`
  uniform float uTime;
  uniform vec3  uLightPos[4];
  uniform vec3  uLightColor[4];
  uniform float uLightIntensity[4];
  uniform vec3  uBaseColor;
  uniform vec3  uSheenColor;

  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec2 vUv;
  varying vec3 vViewDir;

  float fresnel(vec3 N, vec3 V, float f0) {
    return f0 + (1.0 - f0) * pow(1.0 - max(dot(N, V), 0.0), 4.0);
  }

  vec2 rot2(vec2 p, float a) {
    float s = sin(a), c = cos(a);
    return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
  }

  float buttiMotif(vec2 p, float r) {
    float d = 1e5;
    for (int i = 0; i < 6; i++) {
      float angle = float(i) * 1.0471975;
      vec2 petalCenter = vec2(cos(angle), sin(angle)) * r * 0.5;
      vec2 pRot = rot2(p - petalCenter, -angle);
      float ellipse = length(vec2(pRot.x / (r * 0.35), pRot.y / (r * 0.17))) - 1.0;
      d = min(d, ellipse);
    }
    d = min(d, length(p) - r * 0.22);
    return smoothstep(0.03, -0.03, d);
  }

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(vViewDir);

    // Subtle kali pleat ambient occlusion & warm silk fold depth
    float pleatAngle = atan(vWorldPos.z, vWorldPos.x);
    float kaliDepth  = 0.88 + 0.12 * sin(pleatAngle * 24.0);
    // Fine lengthwise silk luster grain (no wireframe grid)
    float satinGrain = 0.97 + 0.03 * sin(vUv.x * 240.0 + vUv.y * 40.0);

    vec3 baseColor = uBaseColor * kaliDepth * satinGrain;

    // Subtle solid gold embroidered butti dots scattered on lower body above daman panel
    vec2 tileUV = vec2(vUv.x * 16.0, vUv.y * 9.0);
    if (mod(floor(tileUV.y), 2.0) == 1.0) tileUV.x += 0.5;
    vec2 tileP = fract(tileUV) - 0.5;
    float buttiZone = smoothstep(0.32, 0.42, vUv.y) * (1.0 - smoothstep(0.70, 0.76, vUv.y));
    float butti = buttiMotif(tileP, 0.16) * buttiZone;

    // Thin solid gold horizontal zari band right where the skirt flares
    float zariLine = (1.0 - smoothstep(0.004, 0.008, abs(vUv.y - 0.67))) * 0.9;
    float zariMask = clamp(butti + zariLine, 0.0, 1.0);

    vec3 fabricCol = mix(baseColor, uSheenColor * 1.05, zariMask * 0.9);

    vec3 diffuse  = vec3(0.0);
    vec3 specular = vec3(0.0);
    vec3 threadDir = normalize(vec3(1.0, 0.15, 0.0));

    for (int i = 0; i < 4; i++) {
      vec3  L    = normalize(uLightPos[i] - vWorldPos);
      float diff = max(dot(N, L), 0.0);
      diffuse   += uLightColor[i] * diff * uLightIntensity[i];

      vec3  H         = normalize(L + V);
      float satinSpec = pow(max(dot(N, H), 0.0), 28.0) * 0.28;
      float anisoSpec = pow(max(dot(H, threadDir), 0.0), 90.0) * 0.25;
      float zariSpec  = pow(max(dot(N, H), 0.0), 96.0) * zariMask * 1.2;
      specular += uLightColor[i] * (satinSpec + anisoSpec + zariSpec) * uLightIntensity[i];
    }

    // Soft silk Fresnel edge sheen
    float F    = fresnel(N, V, 0.03);
    vec3 sheen = mix(uBaseColor * 1.6, uSheenColor, 0.45) * F * 0.55;

    vec3 ambient = fabricCol * 0.26;
    vec3 color   = ambient + fabricCol * (diffuse * 0.78) + specular + sheen;
    color = pow(max(color, vec3(0.0)), vec3(1.0 / 2.2));

    gl_FragColor = vec4(color, 1.0);
  }
`
