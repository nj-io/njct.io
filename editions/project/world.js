// A project's world: the Gray-Scott culture from the njct.io home page, grown from the project's name and
// tinted in its accent colour. Three passes on render targets: a slow climate field (feed and kill
// modulation plus a flow), the reaction-diffusion step (ping-pong, several per frame, with seed splats),
// and the view (a domain-warped read of the chemistry with membrane relief, dark theme).
// Ported from ~/dev/njct.io/index.html (derive, FIELD_FRAG, SIM_FRAG, VIEW_FRAG, the frame loop).
import * as THREE from 'three';

const COARSE = matchMedia('(pointer: coarse)').matches;
const SIM = COARSE ? 512 : 1024;
const FS = COARSE ? 128 : 256;
const MAXSEEDS = 12;

// Organism classes, each on an ignition-robust Gray-Scott regime (Du 1, Dv 0.5, dt 1).
const CLASSES = [
  { F: 0.0300, k: 0.0620, adv: 0.70, edgeG: 1.15, bodyG: 0.90, nuc: 1.00, zoomAdd: 0.00, sporeMul: 1.0 },
  { F: 0.0340, k: 0.0560, adv: 1.90, edgeG: 0.70, bodyG: 1.15, nuc: 0.25, zoomAdd: -0.06, sporeMul: 0.8 },
  { F: 0.0780, k: 0.0610, adv: 0.90, edgeG: 1.45, bodyG: 0.35, nuc: 0.00, zoomAdd: 0.14, sporeMul: 0.7 },
  { F: 0.0367, k: 0.0649, adv: 2.30, edgeG: 1.00, bodyG: 0.60, nuc: 0.60, zoomAdd: 0.06, sporeMul: 1.8 },
  { F: 0.0290, k: 0.0570, adv: 0.45, edgeG: 0.55, bodyG: 1.20, nuc: 0.15, zoomAdd: -0.04, sporeMul: 0.6 },
  { F: 0.0545, k: 0.0620, adv: 1.00, edgeG: 0.90, bodyG: 1.00, nuc: 0.35, zoomAdd: 0.02, sporeMul: 1.0 },
];

// The name's genome: its class, jittered feed and kill, zoom, climate offset and seed positions.
export function derive(name) {
  const s = name.toLowerCase().replace(/[^a-z]/g, '');
  let h = 2166136261;
  for (const ch of name) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
  const rnd = k => {
    let x = (h ^ Math.imul(k + 1, 2654435761)) >>> 0;
    x = Math.imul(x ^ (x >>> 15), 2246822519) >>> 0;
    x = Math.imul(x ^ (x >>> 13), 3266489917) >>> 0;
    return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
  };
  const reg = CLASSES[h % CLASSES.length];
  const seeds = [];
  for (let i = 0; i < Math.min(MAXSEEDS, s.length); i++) {
    const v = (s.charCodeAt(i) - 97) / 25;
    seeds.push([0.22 + 0.56 * ((v * 0.73 + rnd(30 + i)) % 1), 0.22 + 0.56 * ((v * 0.37 + rnd(60 + i)) % 1)]);
  }
  return {
    ...reg, F: reg.F + (rnd(6) - 0.5) * 0.0012, k: reg.k + (rnd(7) - 0.5) * 0.0006,
    zoomD: 0.62 + rnd(8) * 0.25 + reg.zoomAdd, climX: rnd(9) * 8, climY: rnd(10) * 8, seeds, hash: h,
  };
}

const VERT = /* glsl */`void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const NOISE = /* glsl */`
float hashF(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hashF(i), b = hashF(i + vec2(1.0, 0.0)), c = hashF(i + vec2(0.0, 1.0)), d = hashF(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm2(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) { v += a * vnoise(p); p = p * 2.07 + vec2(3.1, 7.7); a *= 0.5; }
  return v;
}`;

// Climate: (feed modulation, kill modulation, flow.xy), drifting in time.
const FIELD_FRAG = /* glsl */`
uniform vec2 uFRes, uClimOff;
uniform float uCT;
${NOISE}
void main() {
  vec2 uv = gl_FragCoord.xy / uFRes;
  vec2 p = uv * 2.6 + uClimOff;
  float cf = fbm2(p + vec2(uCT * 0.7, uCT * 0.4));
  float ck = fbm2(p + vec2(7.3, 2.9) - vec2(uCT * 0.5, uCT * 0.8));
  vec2 q = uv * 3.2 + uClimOff * 1.7 + uCT * 0.9;
  float e = 0.045;
  vec2 vel = vec2(fbm2(q + vec2(0.0, e)) - fbm2(q - vec2(0.0, e)), -(fbm2(q + vec2(e, 0.0)) - fbm2(q - vec2(e, 0.0)))) / (2.0 * e) * 0.22;
  gl_FragColor = vec4(cf, ck, clamp(vel * 0.5 + 0.5, 0.0, 1.0));
}`;

const SIM_FRAG = /* glsl */`
uniform sampler2D uPrev, uField;
uniform vec2 uTexel;
uniform float uMode, uF, uK, uAdv;
uniform vec4 uSplat;
void main() {
  vec2 uv = gl_FragCoord.xy * uTexel;
  if (uMode > 0.5) { gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); return; }
  vec4 fld = texture2D(uField, uv);
  float Fl = uF + (fld.r - 0.5) * 0.032;
  float Kl = uK + (fld.g - 0.5) * 0.011;
  // streaming: back-trace the whole stencil through the flow
  vec2 auv = uv - (fld.ba - 0.5) * 2.0 * uAdv * uTexel;
  vec2 c = texture2D(uPrev, auv).rg;
  vec2 s = vec2(0.0);
  s += texture2D(uPrev, auv + vec2(uTexel.x, 0.0)).rg * 0.2;
  s += texture2D(uPrev, auv - vec2(uTexel.x, 0.0)).rg * 0.2;
  s += texture2D(uPrev, auv + vec2(0.0, uTexel.y)).rg * 0.2;
  s += texture2D(uPrev, auv - vec2(0.0, uTexel.y)).rg * 0.2;
  s += texture2D(uPrev, auv + uTexel).rg * 0.05;
  s += texture2D(uPrev, auv - uTexel).rg * 0.05;
  s += texture2D(uPrev, auv + vec2(uTexel.x, -uTexel.y)).rg * 0.05;
  s += texture2D(uPrev, auv + vec2(-uTexel.x, uTexel.y)).rg * 0.05;
  vec2 L = s - c;
  float u = c.r, v = c.g, uvv = u * v * v;
  u = clamp(u + (1.0 * L.x - uvv + Fl * (1.0 - u)), 0.0, 1.0);
  v = clamp(v + (0.5 * L.y + uvv - (Fl + Kl) * v), 0.0, 1.0);
  if (uSplat.w > 0.0) {
    vec2 d = uv - uSplat.xy;
    d -= floor(d + 0.5);
    v = clamp(v + uSplat.w * exp(-dot(d, d) / (uSplat.z * uSplat.z)), 0.0, 1.0);
  }
  gl_FragColor = vec4(u, v, 0.0, 1.0);
}`;

// The view writes display values directly (as the home page's canvas does), so no colour conversion.
const VIEW_FRAG = /* glsl */`
uniform sampler2D uSim;
uniform vec2 uRes, uTexel, uOff;
uniform float uZoomD, uTime, uEdgeG, uBodyG, uNuc;
uniform vec3 uPalA, uPalB, uPalC, uPalD;
${NOISE}
void main() {
  vec2 frag = gl_FragCoord.xy - uOff;
  vec2 suv0 = (frag - 0.5 * uRes) / min(uRes.x, uRes.y);
  vec2 suv = suv0 * uZoomD + 0.5;
  float w1 = fbm2(suv * 3.1 + vec2(uTime * 0.028, uTime * 0.019));
  float w2 = fbm2(suv * 3.1 + vec2(4.7, 8.1) - uTime * 0.022);
  suv += vec2(w1 - 0.5, w2 - 0.5) * 0.05;
  vec2 c = texture2D(uSim, suv).rg;
  float u = c.r, v = c.g;
  float vx = texture2D(uSim, suv + vec2(uTexel.x, 0.0)).g - texture2D(uSim, suv - vec2(uTexel.x, 0.0)).g;
  float vy = texture2D(uSim, suv + vec2(0.0, uTexel.y)).g - texture2D(uSim, suv - vec2(0.0, uTexel.y)).g;
  float edge = clamp(length(vec2(vx, vy)) * 9.0, 0.0, 1.0) * uEdgeG;
  float body = smoothstep(0.10, 0.34, v) * uBodyG;
  float core = smoothstep(0.42, 0.62, v);
  vec3 col = uPalA + uPalB * cos(6.28318 * (uPalC * (v * 0.7 + u * 0.15 + (w1 - 0.5) * 0.45) + uPalD));
  vec3 n = normalize(vec3(-vx * 7.0, -vy * 7.0, 1.0));
  float dif = clamp(dot(n, normalize(vec3(-0.4, 0.6, 0.7))), 0.0, 1.0);
  vec2 auv = frag / uRes;
  float vig = smoothstep(0.0, 0.09, auv.x) * smoothstep(1.0, 0.91, auv.x) * smoothstep(0.0, 0.10, auv.y) * smoothstep(1.0, 0.90, auv.y);
  vec3 wash = col * (0.04 + 0.10 * w1) * clamp(1.0 - body, 0.0, 1.0);
  vec3 dark = col * (0.05 + body * (0.40 + 0.50 * dif)) + col * edge * 0.85 + wash;
  dark = mix(dark, dark * 0.45 + col * 0.15, core * uNuc);
  dark *= mix(0.65, 1.0, vig);
  dark = dark / (1.0 + 0.32 * dark);
  dark += (hashF(gl_FragCoord.xy + fract(uTime) * vec2(13.7, 91.3)) - 0.5) * 0.03;
  gl_FragColor = vec4(max(dark, 0.0), 1.0);
}`;

// The home page's pigment for a hue in its dark theme: saturation 0.55, lightness 0.62.
const hsl2rgb = (h, s, l) => [0, 8, 4].map(n => { const k = (n + h / 30) % 12; return l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1)); });

// hue: degrees; the culture takes its pigment from it.
export function createWorld(renderer, name, hue, { reduced = false } = {}) {
  const g = derive(name);
  const rtOpts = { type: THREE.HalfFloatType, depthBuffer: false, wrapS: THREE.RepeatWrapping, wrapT: THREE.RepeatWrapping,
    minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, generateMipmaps: false };
  const sim = [new THREE.WebGLRenderTarget(SIM, SIM, rtOpts), new THREE.WebGLRenderTarget(SIM, SIM, rtOpts)];
  const field = new THREE.WebGLRenderTarget(FS, FS, { ...rtOpts, type: THREE.UnsignedByteType });
  const mat = (frag, uniforms) => new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: frag, uniforms, depthTest: false, depthWrite: false, toneMapped: false });
  const fieldM = mat(FIELD_FRAG, { uFRes: { value: new THREE.Vector2(FS, FS) }, uClimOff: { value: new THREE.Vector2(g.climX, g.climY) }, uCT: { value: 0 } });
  const simM = mat(SIM_FRAG, {
    uPrev: { value: null }, uField: { value: field.texture }, uTexel: { value: new THREE.Vector2(1 / SIM, 1 / SIM) },
    uMode: { value: 1 }, uF: { value: g.F }, uK: { value: g.k }, uAdv: { value: 0 }, uSplat: { value: new THREE.Vector4() },
  });
  const base = hsl2rgb(hue, 0.7, 0.6);   // the home page uses 0.55 / 0.62; a little more colour reads as the accent
  const viewM = mat(VIEW_FRAG, {
    uSim: { value: null }, uRes: { value: new THREE.Vector2(1, 1) }, uOff: { value: new THREE.Vector2() },
    uTexel: { value: new THREE.Vector2(1 / SIM, 1 / SIM) }, uZoomD: { value: g.zoomD }, uTime: { value: 0 },
    uEdgeG: { value: g.edgeG }, uBodyG: { value: g.bodyG }, uNuc: { value: g.nuc },
    uPalA: { value: new THREE.Vector3(...base.map(v => 0.16 + v * 0.34)) },
    uPalB: { value: new THREE.Vector3(...base.map(v => 0.18 + v * 0.36)) },
    uPalC: { value: new THREE.Vector3(1, 1, 1) }, uPalD: { value: new THREE.Vector3(0.72, 0.74, 0.70) },   // near-equal phases keep the accent's hue
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simM);
  quad.frustumCulled = false;
  const scene = new THREE.Scene(); scene.add(quad);
  const cam = new THREE.Camera();
  const pass = (m, target) => { quad.material = m; renderer.setRenderTarget(target); renderer.render(scene, cam); };

  // Seeds: one strong founder per letter plus two weaker companions (the home page's first users).
  const rndH = j => (Math.imul(g.hash ^ (j * 2654435761), 2246822519) >>> 0) / 4294967296;
  const splats = [];
  const seed = () => g.seeds.forEach((s, j) => [0.85, 0.45, 0.28].forEach((amt, c) => splats.push({
    x: s[0] + (c ? (rndH(j * 7 + c) - 0.5) * 0.03 : 0), y: s[1] + (c ? (rndH(j * 11 + c) - 0.5) * 0.03 : 0),
    r: Math.max(2.5 / SIM, 0.004 + rndH(j + c) * 0.003), amt,
  })));
  const rand = Math.random;
  let front = 0, age = 0, climT = 0, time = 0, stepAcc = 0, nextAdopt = 0, nextSpore = 4, seeded = false, ready = false;
  // Steps per frame: the home page's 11, doubled while the culture is first growing so the world fills
  // in about as fast as the reference's scene builds; 3 under reduced motion.
  const steps = () => (reduced ? 3 : age < 4 ? 22 : 11);
  const A0 = 1.0, A1 = 4.5;   // s: arrival ends, critical mass ends (the home page: 2.5 and 8)

  function init() {
    simM.uniforms.uMode.value = 1;
    for (const t of sim) pass(simM, t);
    simM.uniforms.uMode.value = 0;
    ready = true;
  }

  return {
    seed() { if (!seeded) { seeded = true; seed(); } },
    // Advance by dt seconds and draw the whole canvas, composed on rect (the world's window: device px,
    // GL origin bottom left); outside it the culture continues under the page's panels.
    frame(dt, rect) {
      const prevTarget = renderer.getRenderTarget(), prevAuto = renderer.autoClear;
      renderer.autoClear = false;
      if (!ready) init();
      age += dt; time += dt;
      climT += dt * 0.007;
      // The lifecycle, as on the home page but compressed so the world builds in about the time the
      // reference's scene does: a short arrival, a surge of newcomers to critical mass, then a slow tide.
      const Fb = age < A0 ? -0.002 : age < A1 ? 0.004 * Math.min(1, (age - A0) / 1.2) : 0.0022 * Math.sin((age - A1) * 0.28);
      // Newcomers settle near the founders, and further out as the surge goes on, so the window fills.
      if (seeded && age > A0 && age < A1 && age > nextAdopt) {
        nextAdopt = age + 0.05 + rand() * 0.08;
        const s = g.seeds[(rand() * g.seeds.length) | 0], spread = 0.13 + 0.45 * (age - A0) / (A1 - A0);
        splats.push({ x: (s[0] + (rand() - 0.5) * spread + 1) % 1, y: (s[1] + (rand() - 0.5) * spread + 1) % 1, r: Math.max(2.5 / SIM, 0.004 + rand() * 0.003), amt: 0.55 });
      }
      if (seeded && !reduced && age > A1 && age > nextSpore) {
        nextSpore = age + (4.2 + rand() * 4.8) / g.sporeMul;
        splats.push({ x: rand(), y: rand(), r: Math.max(2.5 / SIM, 0.004 + rand() * 0.004), amt: 0.5 });
      }
      fieldM.uniforms.uCT.value = climT;
      pass(fieldM, field);
      simM.uniforms.uF.value = g.F + Fb;
      simM.uniforms.uAdv.value = reduced ? 0 : 0.3 * g.adv;
      stepAcc += steps() * Math.min(3, dt * 60);
      const n = Math.min(26, Math.floor(stepAcc));
      stepAcc -= n;
      for (let i = 0; i < n; i++) {
        const sp = splats.shift();
        simM.uniforms.uSplat.value.set(sp ? sp.x : 0, sp ? sp.y : 0, sp ? sp.r : 0.02, sp ? sp.amt : 0);
        simM.uniforms.uPrev.value = sim[front].texture;
        pass(simM, sim[1 - front]);
        front = 1 - front;
      }
      // The view: the sim is a torus, so the view never spans more than one tile of it.
      const [x, y, w, h] = rect;
      const wrapCap = 0.985 / Math.max(w / h, h / w);
      viewM.uniforms.uZoomD.value = Math.min(g.zoomD, wrapCap);
      viewM.uniforms.uSim.value = sim[front].texture;
      viewM.uniforms.uRes.value.set(w, h);
      viewM.uniforms.uOff.value.set(x, y);
      viewM.uniforms.uTime.value = time;
      quad.material = viewM;
      renderer.setRenderTarget(null);
      renderer.render(scene, cam);
      renderer.setRenderTarget(prevTarget);
      renderer.autoClear = prevAuto;
    },
    dispose() {
      for (const t of sim) t.dispose();
      field.dispose();
      fieldM.dispose(); simM.dispose(); viewM.dispose();
      quad.geometry.dispose();
    },
  };
}
