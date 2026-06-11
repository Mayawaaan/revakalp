// ─── Skin GLSL Shader ────────────────────────────────────────────────────────
// Subsurface-like soft skin with micro-pore noise and warm diffuse wrap

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
  uniform float uTime;
  uniform vec3  uLightPos[4];
  uniform vec3  uLightColor[4];
  uniform float uLightIntensity[4];
  uniform vec3  uSkinLight;
  uniform vec3  uSkinDark;

  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec2 vUv;
  varying vec3 vViewDir;

  // ── Value noise ───────────────────────────────────────────────────────────
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),             hash(i + vec2(1,0)), f.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y
    );
  }
  float fbm(vec2 p) {
    float val = 0.0, amp = 0.5;
    for (int i = 0; i < 4; i++) {
      val += noise(p) * amp;
      p *= 2.1;
      amp *= 0.5;
    }
    return val;
  }

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(vViewDir);

    // ── Skin tone via fbm noise ────────────────────────────────────────────
    float tone = fbm(vUv * 6.0);
    vec3 skinCol = mix(uSkinDark, uSkinLight, tone * 0.6 + 0.4);

    // ── Micro pore texture ─────────────────────────────────────────────────
    float pore = noise(vUv * 180.0) * 0.07;
    skinCol -= pore;

    // ── Subsurface-like scatter (wrap lighting) ────────────────────────────
    vec3 diffuse = vec3(0.0);
    vec3 specular = vec3(0.0);
    for (int i = 0; i < 4; i++) {
      vec3  L    = normalize(uLightPos[i] - vWorldPos);
      // Wrap: use dot(N,L)*0.5+0.5 for soft forward scatter
      float wrap = dot(N, L) * 0.5 + 0.5;
      diffuse   += uLightColor[i] * wrap * uLightIntensity[i];

      vec3  H    = normalize(L + V);
      float spec = pow(max(dot(N, H), 0.0), 18.0);  // low exponent = broad skin highlight
      specular  += uLightColor[i] * spec * uLightIntensity[i] * 0.15;
    }

    // ── Subsurface rim: translucent red/amber on back-lit edges ──────────
    float sss = pow(1.0 - max(dot(N, V), 0.0), 4.0);
    vec3 sssCol = vec3(0.9, 0.5, 0.3) * sss * 0.25;

    vec3 color = skinCol * (diffuse * 0.85 + 0.15) + specular + sssCol;
    color = pow(color, vec3(1.0 / 2.2));

    gl_FragColor = vec4(color, 1.0);
  }
`

// ─── Silver Zari Border GLSL Shader ─────────────────────────────────────────
// Metallic silver border with chevron pattern, high specular, and clearcoat

export const borderVertexShader = /* glsl */`
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

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // ── Chevron zigzag pattern ────────────────────────────────────────────────
  float chevron(vec2 uv, float scale, float width) {
    float x = fract(uv.x * scale);
    float y = uv.y;
    // Zigzag: triangle wave on x gives V shape
    float zigzag = abs(fract(x * 2.0) - 0.5) * 2.0;  // 0..1 triangle
    float stripe = abs(y - zigzag * 0.5 - 0.25);
    return 1.0 - smoothstep(width - 0.01, width + 0.01, stripe);
  }

  // ── Diamond grid ─────────────────────────────────────────────────────────
  float diamonds(vec2 uv, float scale) {
    vec2 g = fract(uv * scale) - 0.5;
    g = abs(g);
    float d = g.x + g.y;  // L1 distance = diamond
    return 1.0 - smoothstep(0.42, 0.48, d);
  }

  // ── Fresnel ───────────────────────────────────────────────────────────────
  float fresnel(vec3 N, vec3 V, float f0) {
    return f0 + (1.0 - f0) * pow(1.0 - max(dot(N, V), 0.0), 5.0);
  }

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(vViewDir);

    // ── Pattern: chevron + diamond overlay ───────────────────────────────
    float chev = chevron(vUv, 12.0, 0.04);
    float diam = diamonds(vUv, 10.0);
    float pattern = clamp(chev * 0.7 + diam * 0.5, 0.0, 1.0);

    // ── Color: blend dark base with silver on pattern ─────────────────────
    vec3 color = mix(uBaseColor, uSilverColor, pattern);

    // ── Metallic lighting (high-gloss silver) ────────────────────────────
    vec3 specular = vec3(0.0);
    vec3 diffuse  = vec3(0.0);
    for (int i = 0; i < 4; i++) {
      vec3  L    = normalize(uLightPos[i] - vWorldPos);
      float diff = max(dot(N, L), 0.0);
      diffuse   += uLightColor[i] * diff * uLightIntensity[i];

      vec3  H    = normalize(L + V);
      float spec = pow(max(dot(N, H), 0.0), 256.0); // very sharp specular
      specular  += uLightColor[i] * spec * uLightIntensity[i] * 3.0;
    }

    // ── Clearcoat: second specular layer (softer) ────────────────────────
    vec3 clearcoatSpec = vec3(0.0);
    for (int i = 0; i < 4; i++) {
      vec3 L = normalize(uLightPos[i] - vWorldPos);
      vec3 H = normalize(L + V);
      float cc = pow(max(dot(N, H), 0.0), 48.0) * 0.3;
      clearcoatSpec += vec3(1.0) * cc * uLightIntensity[i];
    }

    // ── Fresnel edge glow ────────────────────────────────────────────────
    float F    = fresnel(N, V, 0.12);
    vec3 fresnelCol = uSilverColor * F * 0.8;

    // ── Animated shimmer along border ────────────────────────────────────
    float shimmer = 0.5 + 0.5 * sin(vUv.x * 40.0 - uTime * 2.0);
    shimmer = pow(shimmer, 8.0) * pattern * 0.5;

    color = color * (vec3(0.08) + diffuse * 0.92) + specular + clearcoatSpec + fresnelCol + shimmer;
    color = pow(color, vec3(1.0 / 2.2));

    gl_FragColor = vec4(color, 1.0);
  }
`
