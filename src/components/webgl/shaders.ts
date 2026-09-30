export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Full-page ambient texture — a flowing "wet paper" wash in the theme's warm
 * pigment tones with a soft liquid bloom that follows the pointer, plus fine
 * film grain. Rendered transparent and composited over the whole site so the
 * page carries the same living, painterly quality as the artwork planes.
 * Kept very low-alpha so text stays perfectly readable.
 */
export const ambientFragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform float uTime;
  uniform vec2  uMouse;   // pointer in uv space (0..1)
  uniform vec2  uRes;     // canvas resolution (for aspect + grain)
  uniform float uActive;  // pointer presence 0..1
  uniform vec3  uWarm;    // terracotta
  uniform vec3  uOchre;   // ochre

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 asp = vec2(uRes.x / max(uRes.y, 1.0), 1.0);
    vec2 uv = vUv;

    // slow flowing pigment (domain-warped fbm)
    vec2 q = uv * asp * 3.0;
    float flow = fbm(q + vec2(uTime * 0.03, uTime * 0.02) + fbm(q));
    float wash = smoothstep(0.35, 0.9, flow);

    // liquid bloom around the pointer
    vec2 p = uv * asp;
    vec2 m = uMouse * asp;
    float d = distance(p, m);
    float ripple = sin(d * 20.0 - uTime * 2.2) * exp(-d * 6.0);
    float bloom = exp(-d * 3.2) * uActive;

    // fine film grain
    float g = (hash(uv * uRes * 0.5 + uTime) - 0.5);

    // warm pigment tone, drifting terracotta -> ochre with the flow
    vec3 col = mix(uWarm, uOchre, flow);

    // low alpha so the page stays readable through the wash
    float alpha =
      wash * 0.05 +
      bloom * 0.10 +
      ripple * 0.02 * uActive +
      g * 0.04;
    alpha = clamp(alpha, 0.0, 0.16);

    gl_FragColor = vec4(col, alpha);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uReveal;   // 0 -> 1 load reveal
  uniform vec2  uMouse;    // pointer in uv space
  uniform float uHover;    // 0 -> 1 hover influence
  uniform float uScroll;   // 0 -> 1 scroll influence
  uniform float uGrain;
  uniform vec3  uBg;

  // hash / value noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  void main() {
    vec2 uv = vUv;

    // pointer ripple — subtle liquid displacement
    float dist = distance(uv, uMouse);
    float ripple = sin(dist * 28.0 - uTime * 3.5);
    float influence = smoothstep(0.4, 0.0, dist) * uHover * 0.010;
    uv += normalize(uv - uMouse + 0.0001) * influence * ripple;

    // gentle scroll drift
    uv.x += sin(uv.y * 7.0 + uTime * 0.35) * uScroll * 0.005;

    vec4 tex = texture2D(uTexture, uv);

    // noise-jittered upward reveal
    float r = uReveal * 1.35;
    float threshold = (1.0 - vUv.y) + (noise(vUv * 4.5) - 0.5) * 0.28;
    float show = smoothstep(threshold - 0.06, threshold + 0.06, r);

    vec3 col = mix(uBg, tex.rgb, show);

    // faint light at the reveal edge
    float edge = 1.0 - smoothstep(0.0, 0.03, abs(r - threshold));
    col += edge * (1.0 - show) * 0.12;

    // fine film grain
    float g = (hash(vUv * 1.5 + uTime * 0.5) - 0.5) * uGrain;
    col += g;

    gl_FragColor = vec4(col, 1.0);
  }
`;
