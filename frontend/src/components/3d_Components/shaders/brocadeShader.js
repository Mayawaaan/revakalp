// ─── Solid Velvet-Zari Brocade GLSL Shader ──────────────────────────────────
// 100% opaque velvet-silk choli & daman panel with bold solid embossed gold
// lotus medallions and warm velvet Fresnel depth (no wireframe grid or strobe).

export const brocadeVertexShader = /* glsl */`
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec2 vUv;
  varying vec3 vViewDir;

  uniform float uTime;
  uniform float uInteraction;

  void main() {
    float waveMask = smoothstep(0.35, -1.35, position.y);
    float angle = atan(position.z, position.x);

    float flare = sin(angle * 5.0 - uTime * 3.0) * 0.06;
    float pulse = sin(uTime * 2.0) * 0.06;
    float totalWave = (flare + pulse) * (1.0 + uInteraction);

    vec3 pos = position;
    float lenXZ = length(position.xz);
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

  float fresnel(vec3 N, vec3 V, float f0) {
    return f0 + (1.0 - f0) * pow(1.0 - max(dot(N, V), 0.0), 2.8);
  }

  vec2 rot2(vec2 p, float a) {
    float s = sin(a), c = cos(a);
    return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
  }

  // Embossed 8-petal solid lotus medallion
  float lotus(vec2 p, float r) {
    float d = 1e5;
    for (int i = 0; i < 8; i++) {
      float angle = float(i) * 0.78539816;
      vec2 petalCenter = vec2(cos(angle), sin(angle)) * r * 0.52;
      vec2 pRot = rot2(p - petalCenter, -angle);
      float ellipse = length(vec2(pRot.x / (r * 0.38), pRot.y / (r * 0.19))) - 1.0;
      d = min(d, ellipse);
    }
    d = min(d, length(p) - r * 0.22);
    return smoothstep(0.025, -0.025, d);
  }

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(vViewDir);

    // Solid lotus medallions staggered on velvet backing
    vec2 tileUV = vec2(vUv.x * 9.0, vUv.y * 4.5);
    if (mod(floor(tileUV.y), 2.0) == 1.0) tileUV.x += 0.5;
    vec2 tileP = fract(tileUV) - 0.5;

    float lotusShape = lotus(tileP, 0.26);
    float centerDot  = smoothstep(0.06, 0.03, length(tileP - vec2(0.45, 0.45)));
    float zariMask   = clamp(lotusShape + centerDot * 0.85, 0.0, 1.0);

    // Solid velvet backing with rich pile depth (subtle micro grain, no wireframe)
    float velvetNap = 0.96 + 0.04 * sin(vUv.x * 160.0 + vUv.y * 90.0);
    vec3 velvetCol  = uBaseColor * velvetNap;

    // Embossed gold zari with view-dependent luster
    float zariGlint = pow(max(dot(N, V), 0.0), 2.0);
    vec3 zariCol    = mix(uZariColor * 0.85, uZariColor * 1.35 + vec3(0.15), zariGlint);

    vec3 fabricCol  = mix(velvetCol, zariCol, zariMask);

    vec3 diffuse  = vec3(0.0);
    vec3 specular = vec3(0.0);
    for (int i = 0; i < 4; i++) {
      vec3  L    = normalize(uLightPos[i] - vWorldPos);
      // Soft wrap diffuse characteristic of velvet fabric
      float diff = max(dot(N, L) * 0.75 + 0.25, 0.0);
      diffuse   += uLightColor[i] * diff * uLightIntensity[i];

      vec3  H    = normalize(L + V);
      float spec = pow(max(dot(N, H), 0.0), mix(18.0, 72.0, zariMask));
      specular  += uLightColor[i] * spec * uLightIntensity[i] * mix(0.18, 1.45, zariMask);
    }

    // Warm velvet rim sheen + zari metallic edge bounce
    float F       = fresnel(N, V, 0.05);
    vec3 rimTint  = mix(velvetCol * 1.9 + vec3(0.08, 0.02, 0.03), uZariColor, zariMask * 0.75);
    vec3 fresnelAdd = rimTint * F * 0.48;

    vec3 color = fabricCol * (vec3(0.24) + diffuse * 0.76) + specular + fresnelAdd;
    color = pow(max(color, vec3(0.0)), vec3(1.0 / 2.2));

    gl_FragColor = vec4(color, 1.0);
  }
`
