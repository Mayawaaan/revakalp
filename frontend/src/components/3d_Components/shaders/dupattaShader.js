// ─── Solid Couture Silk-Zari Dupatta GLSL Shader ────────────────────────────
// 100% opaque silk drape with bold woven gold kinari edge borders, pallu bands,
// and solid floral butti motifs (zero transparent holes or screen-door seams).

export const dupattaVertexShader = /* glsl */`
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec2 vUv;
  varying vec3 vViewDir;

  uniform float uTime;
  uniform float uInteraction;

  void main() {
    float waveMask = smoothstep(0.85, -1.4, position.y);
    float interactionScale = 1.0 + uInteraction;
    float wave1 = sin(position.x * 4.5 + position.y * 2.8 + uTime * 2.3) * 0.075 * interactionScale;
    float wave2 = cos(position.z * 5.0 - position.y * 2.0 + uTime * 2.8) * 0.045 * interactionScale;

    vec3 pos = position;
    pos.x += wave1 * waveMask;
    pos.y += wave2 * waveMask * 0.25;
    pos.z += (wave1 + wave2) * 0.65 * waveMask;

    vec3 newNormal = normalize(normal + vec3(wave1, wave2 * 0.25, wave1 + wave2) * waveMask * 1.6);

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

  vec2 rot2(vec2 p, float a) {
    float s = sin(a), c = cos(a);
    return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
  }

  float butti(vec2 p, float r) {
    float d = 1e5;
    for (int i = 0; i < 6; i++) {
      float angle = float(i) * 1.0471975;
      vec2 petalCenter = vec2(cos(angle), sin(angle)) * r * 0.5;
      vec2 pRot = rot2(p - petalCenter, -angle);
      float ellipse = length(vec2(pRot.x / (r * 0.36), pRot.y / (r * 0.18))) - 1.0;
      d = min(d, ellipse);
    }
    d = min(d, length(p) - r * 0.22);
    return smoothstep(0.03, -0.03, d);
  }

  float fresnel(vec3 N, vec3 V, float f0) {
    return f0 + (1.0 - f0) * pow(1.0 - max(dot(N, V), 0.0), 3.2);
  }

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(vViewDir);

    // Bold solid gold kinari border along both longitudinal edges (vUv.x near 0 or 1)
    float edgeDist       = min(vUv.x, 1.0 - vUv.x);
    float outerKinari    = 1.0 - smoothstep(0.095, 0.115, edgeDist);
    float innerPinStripe = (1.0 - smoothstep(0.008, 0.015, abs(edgeDist - 0.14))) * 0.92;

    // Solid woven gold pallu stripes near ends (vUv.y > 0.82 or < 0.06)
    float endZone        = max(smoothstep(0.80, 0.82, vUv.y), 1.0 - smoothstep(0.04, 0.06, vUv.y));
    float palluStripe    = step(0.55, fract(vUv.y * 44.0)) * endZone * 0.95;

    // Solid gold butti motifs across the silk body
    vec2 tileUV = vec2(vUv.x * 4.0, vUv.y * 16.0);
    if (mod(floor(tileUV.y), 2.0) == 1.0) tileUV.x += 0.5;
    vec2 tileP  = fract(tileUV) - 0.5;
    float inBody = smoothstep(0.14, 0.18, edgeDist);
    float motifs = butti(tileP, 0.24) * inBody;

    float zariWork = clamp(max(outerKinari, max(innerPinStripe, max(palluStripe, motifs))), 0.0, 1.0);

    // Rich satin weave tone (no holes or screen-door artifacts)
    float grain   = 0.97 + 0.03 * sin(vUv.x * 120.0 + vUv.y * 180.0);
    vec3 silkBody = uBaseColor * grain;
    vec3 baseCol  = mix(silkBody, uEdgeColor, zariWork);

    vec3 diffuse  = vec3(0.0);
    vec3 specular = vec3(0.0);
    for (int i = 0; i < 4; i++) {
      vec3  L    = normalize(uLightPos[i] - vWorldPos);
      float diff = max(dot(N, L) * 0.8 + 0.2, 0.0);
      diffuse   += uLightColor[i] * diff * uLightIntensity[i];

      vec3  H    = normalize(L + V);
      float spec = pow(max(dot(N, H), 0.0), mix(36.0, 110.0, zariWork));
      specular  += uLightColor[i] * spec * uLightIntensity[i] * mix(0.28, 1.5, zariWork);
    }

    float F     = fresnel(N, V, 0.04);
    vec3 sheen  = mix(uBaseColor * 1.45, uEdgeColor, max(0.35, zariWork)) * F * 0.48;

    vec3 color  = baseCol * (vec3(0.25) + diffuse * 0.75) + specular + sheen;
    color = pow(max(color, vec3(0.0)), vec3(1.0 / 2.2));

    gl_FragColor = vec4(color, 1.0);
  }
`
