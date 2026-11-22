// ─── Solid Matte-Satin Mannequin & Zari Border GLSL Shaders ──────────────────
// Clean, opaque couture mannequin finish (zero noisy speckles) and synchronized
// solid metallic gold temple-chevron Zari hem/trim shader.

export const skinVertexShader = /* glsl */`
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec2 vUv;
  varying vec3 vViewDir;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos     = worldPos.xyz;
    vWorldNormal  = normalize(mat3(modelMatrix) * normal);
    vUv           = uv;
    vViewDir      = normalize(cameraPosition - worldPos.xyz);
    gl_Position   = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const skinFragmentShader = /* glsl */`
  uniform vec3  uLightPos[4];
  uniform vec3  uLightColor[4];
  uniform float uLightIntensity[4];
  uniform vec3  uSkinLight;
  uniform vec3  uSkinDark;

  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec2 vUv;
  varying vec3 vViewDir;

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(vViewDir);

    // Smooth, blemish-free matte-satin couture mannequin blend
    vec3 skinCol = mix(uSkinDark, uSkinLight, 0.65);

    vec3 diffuse  = vec3(0.0);
    vec3 specular = vec3(0.0);
    for (int i = 0; i < 4; i++) {
      vec3  L    = normalize(uLightPos[i] - vWorldPos);
      float wrap = max(dot(N, L) * 0.5 + 0.5, 0.0);
      diffuse   += uLightColor[i] * wrap * uLightIntensity[i];

      vec3  H    = normalize(L + V);
      float spec = pow(max(dot(N, H), 0.0), 24.0);
      specular  += uLightColor[i] * spec * uLightIntensity[i] * 0.14;
    }

    float rim = pow(1.0 - max(dot(N, V), 0.0), 3.5);
    vec3 rimCol = uSkinLight * rim * 0.18;

    vec3 color = skinCol * (vec3(0.22) + diffuse * 0.72) + specular + rimCol;
    color = pow(max(color, vec3(0.0)), vec3(1.0 / 2.2));

    gl_FragColor = vec4(color, 1.0);
  }
`

// ─── Solid Zari Border GLSL Shader ───────────────────────────────────────────
export const borderVertexShader = /* glsl */`
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec2 vUv;
  varying vec3 vViewDir;

  uniform float uTime;
  uniform float uInteraction;

  void main() {
    float waveMask = smoothstep(0.35, -1.35, position.y);
    float lenXZ = length(position.xz);
    vec2 dir = lenXZ > 0.001 ? position.xz / lenXZ : vec2(0.0);

    float angle = atan(position.z, position.x);
    float flare = sin(angle * 5.0 - uTime * 3.0) * 0.06;
    float pulse = sin(uTime * 2.0) * 0.06;
    float totalWave = (flare + pulse) * (1.0 + uInteraction);

    vec3 pos = position;
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

export const borderFragmentShader = /* glsl */`
  uniform float uTime;
  uniform vec3  uLightPos[4];
  uniform vec3  uLightColor[4];
  uniform float uLightIntensity[4];
  uniform vec3  uSilverColor;
  uniform vec3  uBaseColor;

  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec2 vUv;
  varying vec3 vViewDir;

  float chevronBand(vec2 uv, float scale, float width) {
    float x = fract(uv.x * scale);
    float zigzag = abs(fract(x * 2.0) - 0.5) * 2.0;
    float stripe = abs(uv.y - (0.25 + zigzag * 0.5));
    return 1.0 - smoothstep(width - 0.015, width + 0.015, stripe);
  }

  float solidDiamonds(vec2 uv, float scale) {
    vec2 g = abs(fract(uv * scale) - 0.5);
    float d = g.x + g.y;
    return 1.0 - smoothstep(0.32, 0.38, d);
  }

  float fresnel(vec3 N, vec3 V, float f0) {
    return f0 + (1.0 - f0) * pow(1.0 - max(dot(N, V), 0.0), 4.0);
  }

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(vViewDir);

    // Solid metallic gold frame edges + crisp temple chevron + diamond centerpiece
    float topEdge = 1.0 - smoothstep(0.08, 0.12, vUv.y);
    float botEdge = smoothstep(0.88, 0.92, vUv.y);
    float chev    = chevronBand(vUv, 14.0, 0.055);
    float diam    = solidDiamonds(vec2(vUv.x * 2.0, vUv.y), 6.0);
    float pattern = clamp(max(max(topEdge, botEdge), max(chev * 0.85, diam * 0.75)), 0.0, 1.0);

    vec3 color = mix(uBaseColor, uSilverColor, pattern);

    vec3 specular = vec3(0.0);
    vec3 diffuse  = vec3(0.0);
    for (int i = 0; i < 4; i++) {
      vec3  L    = normalize(uLightPos[i] - vWorldPos);
      float diff = max(dot(N, L), 0.0);
      diffuse   += uLightColor[i] * diff * uLightIntensity[i];

      vec3  H    = normalize(L + V);
      float spec = pow(max(dot(N, H), 0.0), 96.0);
      specular  += uLightColor[i] * spec * uLightIntensity[i] * mix(0.35, 1.85, pattern);
    }

    float F       = fresnel(N, V, 0.12);
    vec3 fresnelCol = uSilverColor * F * 0.55;

    // Gentle continuous metallic sheen wave along gold border
    float sheenWave = pow(0.5 + 0.5 * sin(vUv.x * 18.0 - uTime * 1.4), 6.0) * pattern * 0.22;

    color = color * (vec3(0.18) + diffuse * 0.82) + specular + fresnelCol + uSilverColor * sheenWave;
    color = pow(max(color, vec3(0.0)), vec3(1.0 / 2.2));

    gl_FragColor = vec4(color, 1.0);
  }
`
