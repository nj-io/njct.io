// The café's late sun (round 1): golden-hour light through the window in the street front, falling across
// the record wall, its shelves and sleeves. A lazy chunk: main.js loads it once the sleeves have landed.
//
// The light is worked out per pixel where it lands, over v1's unchanged studio light (wall.js's bake):
// - the window: an exact shape (frame, glazing bars, transom, sunburst fanlight) met along the sun; its
//   shadows soften with distance from the window, as the sun's 0.53 degree disc makes them;
// - the leaves: tropical foliage beyond the window (shredded banana, holed monstera, frangipani, a pair of
//   cables), drawn from the sun into a mask and blurred with a disc the size of the sun's image at three
//   distances, so every gap between leaves throws a small image of the sun;
// - the sleeves and shelves: each sleeve's face as a quad met along the sun, each shelf's underside as a
//   rectangle; sharp where they meet the wall, softer further off.
// The patch reads by hue: a warm near-white core and an amber edge, compressed so nothing clips.
// With the sun off nothing here runs: every material keeps v1's own program.
import * as THREE from 'three';
import { CAFE, SHELF, SLEEVE } from './config.js';
import { SHELF_VERT, SHELF_FRAG } from './shelves.js';

const DEG = Math.PI / 180;
const LEAF_R = [7, 12, 18];          // blur radius of each leaf mask level, in wall units
const MASK_RES = 512;
const COVER_GAIN = 1.35;              // the sun on a cover, against its fitted light (about 1.0)
const SHELF_GAIN = 1.1;

// Shared by every sun program. uSlv: per sleeve, its face's corner (w: how strongly it shades) and two edges.
const sunGlsl = n => /* glsl */`
uniform vec3 uSunD, uSunU, uSunV;     // toward the sun; across and up in the sun's view
uniform float uSunPower, uSunFade;
uniform vec4 uWin;                    // the opening: z0, y0, z1, y1 on the street front
uniform float uWinX;                  // the street front's x
uniform vec4 uWinBars;                // frame, glazing bar, transom height, transom bar
uniform vec2 uWinFan;                 // the fanlight's rays, its arc as a share of the fanlight's height
uniform vec4 uMask;                   // the leaf mask's centre (u, v), half size, the leaves' depth along the sun
uniform sampler2D uLeaf0, uLeaf1, uLeaf2;
uniform vec3 uLeafR;
uniform vec4 uSlv[${n * 3}];
uniform vec4 uShelfB[2];              // x0, x1, the underside's height, depth
const float NJ_SUN_DISC = 0.00925;    // the sun's diameter in radians

float njBox(vec2 p, vec2 b) { vec2 d = abs(p) - b; return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0); }

// Signed distance on the street front (z, y) to the glass the sun passes: negative in the light.
float njWindowSd(vec2 w) {
  vec2 c = 0.5 * (uWin.xy + uWin.zw), hb = 0.5 * (uWin.zw - uWin.xy) - uWinBars.x;
  float open = njBox(w - c, hb);
  float ty = uWinBars.z;
  float bars = abs(w.y - ty) - 0.5 * uWinBars.w;
  if (w.y < ty) {
    float z1 = c.x - hb.x + 2.0 * hb.x / 3.0, z2 = c.x - hb.x + 4.0 * hb.x / 3.0;
    bars = min(bars, min(abs(w.x - z1), abs(w.x - z2)) - 0.5 * uWinBars.y);
  } else {
    vec2 q = w - vec2(c.x, ty);
    float fan = c.y + hb.y - ty;
    float sectors = uWinFan.x + 1.0;
    float k = floor(atan(q.y, q.x) / 3.14159265 * sectors + 0.5);
    float ak = k / sectors * 3.14159265;
    if (k > 0.5 && k < sectors - 0.5) bars = min(bars, abs(dot(q, vec2(-sin(ak), cos(ak)))) - 0.5 * uWinBars.y);
    bars = min(bars, abs(length(q) - uWinFan.y * fan) - 0.5 * uWinBars.y);
  }
  return max(open, -bars);
}
float njWindow(vec3 p) {
  float t = (uWinX - p.x) / uSunD.x;
  if (t <= 0.0) return 1.0;
  vec3 q = p + uSunD * t;
  float pen = max(t * NJ_SUN_DISC, 0.8);
  return smoothstep(0.0, 1.0, clamp(0.5 - njWindowSd(q.zy) * sqrt(uSunD.x) / pen, 0.0, 1.0));
}
// The leaves: the mask level whose blur matches the sun's image at this distance from them.
float njLeaves(vec3 p) {
  vec2 uv = (vec2(dot(p, uSunU), dot(p, uSunV)) - uMask.xy) / (2.0 * uMask.z) + 0.5;
  float r = max(uMask.w - dot(p, uSunD), 0.0) * NJ_SUN_DISC * 0.5;
  float a = texture2D(uLeaf0, uv).r, b = texture2D(uLeaf1, uv).r, c = texture2D(uLeaf2, uv).r;
  return r < uLeafR.y ? mix(a, b, clamp((r - uLeafR.x) / (uLeafR.y - uLeafR.x), 0.0, 1.0))
                      : mix(b, c, clamp((r - uLeafR.y) / (uLeafR.z - uLeafR.y), 0.0, 1.0));
}
float njSleeves(vec3 p, int self) {
  float vis = 1.0;
  for (int i = 0; i < ${n}; i++) {
    if (i == self) continue;
    vec4 o = uSlv[i * 3];
    if (o.w <= 0.001) continue;
    vec3 eu = uSlv[i * 3 + 1].xyz, ev = uSlv[i * 3 + 2].xyz;
    vec3 nrm = cross(eu, ev);
    float dn = dot(uSunD, nrm);
    if (abs(dn) < 1e-6) continue;
    float t = dot(o.xyz - p, nrm) / dn;
    if (t <= 0.25) continue;
    vec3 h = p + uSunD * t - o.xyz;
    vec2 len = vec2(length(eu), length(ev));
    vec2 ab = vec2(dot(h, eu) / len.x, dot(h, ev) / len.y);
    float sd = njBox(ab - 0.5 * len, 0.5 * len);
    vis *= 1.0 - o.w * clamp(0.5 - sd / max(t * NJ_SUN_DISC, 0.6), 0.0, 1.0);
  }
  return vis;
}
float njShelves(vec3 p) {
  float vis = 1.0;
  for (int s = 0; s < 2; s++) {
    vec4 b = uShelfB[s];
    if (b.y <= b.x || p.y >= b.z - 0.01) continue;
    float t = (b.z - p.y) / uSunD.y;
    vec3 h = p + uSunD * t;
    // The shelf runs back into the wall, so no light slips between them.
    float sd = njBox(vec2(h.x - 0.5 * (b.x + b.y), h.z), vec2(0.5 * (b.y - b.x), b.w));
    vis *= clamp(0.5 + sd / max(t * NJ_SUN_DISC, 0.6), 0.0, 1.0);
  }
  return vis;
}
float njSunVis(vec3 p, int self) {
  float v = njWindow(p);
  if (v <= 0.0) return 0.0;
  return v * njLeaves(p) * njSleeves(p, self) * njShelves(p);
}
// Amber at the patch's edges, a warm white in its full light.
vec3 njSunColour(float v) { return mix(vec3(1.0, 0.45, 0.13), vec3(1.0, 0.62, 0.27), smoothstep(0.12, 0.85, v)); }
// Light added to a linear colour, rolled off toward white without clipping or losing its hue; nothing
// changes where nothing is added.
vec3 njSunAdd(vec3 c, vec3 add) {
  vec3 o = c + add;
  float pk = max(o.r, max(o.g, o.b));
  if (pk <= 0.82) return o;
  float np = 0.82 + 0.18 * (1.0 - exp(-(pk - 0.82) / 0.18));
  return mix(o, o * (np / pk), 1.0 - exp(-40.0 * max(add.r, max(add.g, add.b))));
}
`;

// The wall's display pass with the sun: v1's (wall.js WALL_FRAG) plus the sun where it lands.
const WALL_VERT = /* glsl */`
varying vec2 vUv;
varying vec3 vNjWorld;
void main() {
  vUv = uv;
  vNjWorld = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
const wallFrag = glsl => /* glsl */`
uniform sampler2D uBake;
uniform float uGain;
uniform float uSunDebug;   // a test's view: 1 the window alone, 2 the leaves alone
varying vec2 vUv;
varying vec3 vNjWorld;
${glsl}
void main() {
  vec3 c = texture2D(uBake, vUv).rgb * uGain;
  if (uSunD.z > 0.0 && uSunFade > 0.0) {
    float v = uSunDebug > 1.5 ? njLeaves(vNjWorld) : uSunDebug > 0.5 ? njWindow(vNjWorld) : njSunVis(vNjWorld, -1);
    c = njSunAdd(c, njSunColour(v) * (uSunPower * uSunFade * uSunD.z * v));
  }
  gl_FragColor = vec4(c, 1.0);
  #include <colorspace_fragment>
  float n = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  gl_FragColor.rgb += (n - 0.5) / 255.0;
}`;
// The shelves with the sun: shelves.js's shader, its final colour lit by the sun too.
function shelfFrag(glsl) {
  const out = 'gl_FragColor = vec4(vec3(e * uShelfAlbedo), 1.0);';
  if (!SHELF_FRAG.includes(out) || !SHELF_FRAG.includes('void main() {')) throw new Error('sun: shelves.js changed');
  return SHELF_FRAG.replace('void main() {', `${glsl}\nvoid main() {`).replace(out, `vec3 njc = vec3(e * uShelfAlbedo);
  float njnl = dot(nl, uSunD);
  if (njnl > 0.0 && uSunFade > 0.0) {
    float v = njSunVis(vPos, -1);
    njc = njSunAdd(njc, njSunColour(v) * (uSunPower * uSunFade * njnl * v * ${SHELF_GAIN.toFixed(3)}));
  }
  gl_FragColor = vec4(njc, 1.0);`);
}

// The covers (sleeves.js neutral() materials): the sun joins their direct light, before the Neutral curve.
function coverInject(sh, glsl, self) {
  sh.vertexShader = sh.vertexShader
    .replace('void main() {', 'varying vec3 vNjWorld;\nvoid main() {')
    .replace('#include <project_vertex>', '#include <project_vertex>\n  vNjWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;');
  sh.fragmentShader = sh.fragmentShader
    .replace('void main() {', `varying vec3 vNjWorld;\nuniform int uNjSelf;\n${glsl}\nvoid main() {`)
    .replace('#include <aomap_fragment>', `#include <aomap_fragment>
  {
    float njNl = dot(inverseTransformDirection(normal, viewMatrix), uSunD);
    if (njNl > 0.0 && uSunFade > 0.0) {
      float njV = njSunVis(vNjWorld, uNjSelf);
      reflectedLight.directDiffuse += diffuseColor.rgb * njSunColour(njV) * (uSunPower * uSunFade * njNl * njV * ${COVER_GAIN.toFixed(3)});
    }
  }`);
  sh.uniforms.uNjSelf = { value: self };
}

// ---- the leaves: a mask in the sun's view, at three blurs -------------------------------------------
const FS_VERT = /* glsl */`
varying vec2 vUv;
void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

// Foliage beyond the window, in the sun's view: p in wall units from the window's centre, n the same
// across the opening (-1 to 1). Each leaf is drawn in its own frame: x along the midrib from its base, y
// across. 1 where a leaf or cable stops the sun.
const LEAF_FRAG = /* glsl */`
precision highp float;
varying vec2 vUv;
uniform float uT;       // the ambient clock, seconds
uniform vec2 uExt;      // the window's half extents in the sun's view
uniform float uH;       // the mask's half size
float h1(float n) { return fract(sin(n * 127.1 + 0.37) * 43758.5453); }
float h2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 x) {
  vec2 i = floor(x), f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h2(i), h2(i + vec2(1.0, 0.0)), f.x), mix(h2(i + vec2(0.0, 1.0)), h2(i + vec2(1.0, 1.0)), f.x), f.y);
}
// A distant tree's crown: small leaves with small gaps between them, each gap a round image of the sun
// once blurred (komorebi). Thicker toward its centre, thinning to open sky at its edge.
float crown(vec2 p, vec2 c, vec2 r, float t) {
  float edge = length((p - c) / r) - 1.0;
  if (edge > 0.12) return 0.0;
  vec2 w = p + vec2(sin(t * 0.61), cos(t * 0.47)) * 2.5;
  float n = 0.62 * vnoise(w / 7.0) + 0.38 * vnoise(w / 3.2 + 17.0);
  return step(n, mix(0.78, 0.42, smoothstep(-0.55, 0.12, edge)));
}
vec2 rot(vec2 p, float a) { float c = cos(a), s = sin(a); return vec2(c * p.x + s * p.y, -s * p.x + c * p.y); }
float capsule(vec2 p, vec2 a, vec2 b, float r) {
  vec2 pa = p - a, ba = b - a;
  return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0)) - r;
}
// A banana blade: a long blunt oval that droops, its lamina shredded by the wind into strips that slant
// toward the tip and open toward the margin.
float banana(vec2 p, float len, float wid, float seed, float gust) {
  float stalk = step(abs(p.y), 9.0) * step(0.0, p.x) * step(p.x, len * 0.14);
  float u = (p.x - len * 0.12) / (len * 0.88);
  if (u < 0.0 || u > 1.0) return stalk;
  float y = p.y + 0.2 * len * u * u;
  float hw = wid * pow(max(sin(3.14159 * min(u * 0.94 + 0.06, 1.0)), 0.0), 0.45) * (1.0 - 0.2 * u);
  float ay = abs(y);
  if (ay > hw) return 0.0;
  if (ay < 4.5) return 1.0;
  float sl = (p.x + ay * 0.6) / 34.0 + seed * 3.7;
  float k = floor(sl), f = fract(sl + 0.04 * gust * sin(uT * 13.0 + k * 2.3));
  float torn = step(0.4, h1(k + seed * 17.0));
  float open = torn * smoothstep(0.1, 0.9, ay / hw) * (0.1 + 0.26 * h1(k * 1.31 + seed)) * (1.0 + 0.6 * gust);
  return f < open ? 0.0 : 1.0;
}
// A monstera leaf: a broad heart with slits running in from the margin between the veins and a row of
// oval holes near the midrib.
float monstera(vec2 p, float len, float seed) {
  float u = p.x / len;
  if (u < -0.06 || u > 1.0) return 0.0;
  float hw = len * 0.5 * pow(max(sin(3.14159 * clamp(u + 0.06, 0.0, 1.0)), 0.0), 0.6) * (1.12 - 0.3 * u);
  float ay = abs(p.y);
  if (ay > hw) return 0.0;
  if (ay < 4.0 && u > 0.0) return 1.0;
  float side = p.y > 0.0 ? 1.0 : 0.0;
  float ph = (p.x - ay * 0.75) / (len * 0.105) + seed + side * 0.37;
  float k = floor(ph), f = fract(ph) - 0.5;
  float r = ay / hw;
  float slit = step(0.52 + 0.12 * h1(k + side * 9.0 + seed), r) * step(abs(f), 0.05 + 0.04 * r);
  vec2 e = vec2(f / 0.16, (r - 0.3) / 0.1);
  float hole = step(dot(e, e), 1.0) * step(0.35, h1(k * 3.1 + side + seed));
  return 1.0 - max(slit, hole);
}
// A frangipani leaf: obovate, widest two thirds of the way out.
float plumeria(vec2 p, float len, float wid) {
  float u = p.x / len;
  if (u < 0.0 || u > 1.0) return 0.0;
  return step(abs(p.y), wid * 1.9 * pow(u, 0.75) * pow(1.0 - u, 0.4));
}
float rosette(vec2 p, vec2 c, float a0, float len, float wid, float sway) {
  float m = 0.0;
  for (int i = 0; i < 7; i++) {
    float a = a0 + float(i) * 0.82 + 0.18 * sin(float(i) * 2.7) + sway * (0.6 + 0.4 * sin(float(i)));
    m = max(m, plumeria(rot(p - c, a), len * (0.8 + 0.25 * h1(float(i) + a0)), wid));
  }
  return m;
}
float cable(vec2 p, float y0, float slope, float sag, float w) {
  float x = p.x / 600.0;
  float y = y0 + slope * p.x + sag * x * x;
  return step(abs(p.y - y) / sqrt(1.0 + pow(slope + 2.0 * sag * x / 600.0, 2.0)), w);
}
void main() {
  // The sun's view, turned to read as the wall does: +x toward the window's side of the patch.
  vec2 p = (vUv * 2.0 - 1.0) * uH;
  p.x = -p.x;
  float t = uT;
  // The wind: a slow sway, with gusts that come and go; the leaves flutter only in a gust.
  float gust = smoothstep(0.62, 0.95, 0.5 + 0.5 * sin(t * 0.23 + 1.1) * sin(t * 0.071 + 0.4));
  float sway = sin(t * 0.83) * 0.6 + sin(t * 1.37 + 1.2) * 0.4;
  float m = 0.0;
  // The foliage frames the opening: a young banana leaf up from the lower left, the crown of a tree
  // across the street in the upper left, a monstera in the lower right, a frangipani branch across the
  // top right.
  m = max(m, banana(rot(p - vec2(-1.45, -1.35) * uExt, (55.0 + 1.6 * sway + 3.0 * gust) * 0.0174533), 570.0, 124.0, 1.0, gust));
  m = max(m, crown(p, vec2(-1.25, 1.3) * uExt, vec2(1.25, 1.0) * uExt, t));
  m = max(m, monstera(rot(p - vec2(1.45, -1.3) * uExt, (145.0 + 1.0 * sway) * 0.0174533), 330.0, 0.3));
  vec2 b0 = vec2(1.75, 1.6) * uExt;
  vec2 c1 = vec2(1.02, 1.04) * uExt + vec2(3.0, 2.0) * sway, c2 = vec2(0.55, 1.05) * uExt + vec2(4.0, 2.5) * sway;
  m = max(m, step(capsule(p, b0, c1, 10.0), 0.0));
  m = max(m, step(capsule(p, mix(c1, b0, 0.4), c2, 6.5), 0.0));
  m = max(m, rosette(p, c1, 0.4, 135.0, 40.0, 0.05 * sway + 0.08 * gust * sin(t * 6.0)));
  m = max(m, rosette(p, c2, 1.9, 118.0, 36.0, 0.06 * sway + 0.08 * gust * sin(t * 6.4)));
  // Two cables across the soi, sagging through the fanlight.
  m = max(m, cable(p, 0.8 * uExt.y, 0.1, 36.0, 2.4));
  m = max(m, cable(p, 0.9 * uExt.y, -0.06, 28.0, 1.8));
  gl_FragColor = vec4(vec3(1.0 - m), 1.0);
}`;

// A disc blur (golden-angle spiral): the sun's image, so each gap becomes a small sun.
const BLUR_FRAG = /* glsl */`
precision highp float;
varying vec2 vUv;
uniform sampler2D uSrc;
uniform float uR;       // radius, in source texels
uniform vec2 uTexel;
void main() {
  float acc = 0.0;
  for (int i = 0; i < 48; i++) {
    float fi = float(i) + 0.5;
    float r = sqrt(fi / 48.0) * uR, a = fi * 2.39996323;
    acc += texture2D(uSrc, vUv + vec2(cos(a), sin(a)) * r * uTexel).r;
  }
  gl_FragColor = vec4(vec3(acc / 48.0), 1.0);
}`;

function createLeafMask(renderer) {
  const opts = { type: THREE.UnsignedByteType, format: THREE.RGBAFormat, depthBuffer: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, generateMipmaps: false };
  const base = new THREE.WebGLRenderTarget(MASK_RES, MASK_RES, opts);
  const levels = [MASK_RES, MASK_RES / 2, MASK_RES / 4].map(n => new THREE.WebGLRenderTarget(n, n, opts));
  const tri = new THREE.BufferGeometry();
  tri.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  const leafMat = new THREE.ShaderMaterial({ uniforms: { uT: { value: 0 }, uExt: { value: new THREE.Vector2(1, 1) }, uH: { value: 1 } },
    vertexShader: FS_VERT, fragmentShader: LEAF_FRAG, depthTest: false, depthWrite: false });
  const blurMat = new THREE.ShaderMaterial({ uniforms: { uSrc: { value: base.texture }, uR: { value: 1 }, uTexel: { value: new THREE.Vector2(1 / MASK_RES, 1 / MASK_RES) } },
    vertexShader: FS_VERT, fragmentShader: BLUR_FRAG, depthTest: false, depthWrite: false });
  const mesh = new THREE.Mesh(tri, leafMat);
  mesh.frustumCulled = false;
  const sc = new THREE.Scene(), cam = new THREE.Camera();
  sc.add(mesh);
  return {
    textures: levels.map(l => l.texture),
    layout(ext, h) { leafMat.uniforms.uExt.value.copy(ext); leafMat.uniforms.uH.value = h; },
    render(t) {
      const prev = renderer.getRenderTarget();
      leafMat.uniforms.uT.value = t;
      mesh.material = leafMat;
      renderer.setRenderTarget(base);
      renderer.render(sc, cam);
      const unitsPerTexel = 2 * leafMat.uniforms.uH.value / MASK_RES;
      mesh.material = blurMat;
      levels.forEach((l, k) => {
        blurMat.uniforms.uR.value = LEAF_R[k] / unitsPerTexel;
        renderer.setRenderTarget(l);
        renderer.render(sc, cam);
      });
      renderer.setRenderTarget(prev);
    },
    dispose() { base.dispose(); levels.forEach(l => l.dispose()); leafMat.dispose(); blurMat.dispose(); tri.dispose(); },
  };
}

// ---- the sun ------------------------------------------------------------------------------------------
export function createSun({ renderer, scene, wallMesh, shelfMeshes, sleeves }) {
  const n = sleeves.length, L = SLEEVE.size;
  const U = {
    uSunD: { value: new THREE.Vector3() }, uSunU: { value: new THREE.Vector3() }, uSunV: { value: new THREE.Vector3() },
    uSunPower: { value: CAFE.sun.power }, uSunFade: { value: 0 },
    uWin: { value: new THREE.Vector4() }, uWinX: { value: CAFE.room.front },
    uWinBars: { value: new THREE.Vector4() }, uWinFan: { value: new THREE.Vector2() },
    uMask: { value: new THREE.Vector4() },
    uLeaf0: { value: null }, uLeaf1: { value: null }, uLeaf2: { value: null },
    uLeafR: { value: new THREE.Vector3(...LEAF_R) },
    uSlv: { value: Array.from({ length: n * 3 }, () => new THREE.Vector4()) },
    uShelfB: { value: SHELF.tops.map(top => new THREE.Vector4(-SHELF.width / 2, SHELF.width / 2, top - SHELF.thick, SHELF.depth)) },
  };
  const glsl = sunGlsl(n);
  const mask = createLeafMask(renderer);
  [U.uLeaf0.value, U.uLeaf1.value, U.uLeaf2.value] = mask.textures;

  const wallV1 = wallMesh.material;
  const wallSun = new THREE.ShaderMaterial({ uniforms: { uBake: wallV1.uniforms.uBake, uGain: wallV1.uniforms.uGain, uSunDebug: { value: 0 }, ...U },
    vertexShader: WALL_VERT, fragmentShader: wallFrag(glsl), toneMapped: false });
  const shelfV1 = shelfMeshes.map(m => m.material);
  const shelfSun = shelfV1.map(m => new THREE.ShaderMaterial({ uniforms: { ...m.uniforms, ...U },
    vertexShader: SHELF_VERT, fragmentShader: shelfFrag(glsl), toneMapped: false }));
  // The covers keep v1's program (and its cache key) until the sun is on.
  const coverMats = [];
  for (const s of sleeves) for (const m of new Set([s.front, s.back, s.mats[0]])) {
    const prevCompile = m.onBeforeCompile, prevKey = m.customProgramCacheKey;
    m.onBeforeCompile = (sh, r) => {
      prevCompile.call(m, sh, r);
      if (!m.userData.njSun) return;
      Object.assign(sh.uniforms, U);
      coverInject(sh, glsl, s.i);
    };
    m.customProgramCacheKey = () => prevKey.call(m) + (m.userData.njSun ? '-sun' : '');
    coverMats.push(m);
  }

  let on = false, dirty = true, t = 0;
  const D = new THREE.Vector3(), Uu = new THREE.Vector3(), V = new THREE.Vector3(), c = new THREE.Vector3(), ext = new THREE.Vector2();
  function setParams({ az = CAFE.sun.az, el = CAFE.sun.el, power = CAFE.sun.power, debug = 0 } = {}) {
    wallSun.uniforms.uSunDebug.value = debug;
    const A = az * DEG, E = el * DEG, w = CAFE.window, x = CAFE.room.front;
    D.set(Math.cos(E) * Math.cos(A), Math.sin(E), Math.cos(E) * Math.sin(A));
    Uu.set(-D.z, 0, D.x).normalize();
    V.crossVectors(Uu, D);
    U.uSunD.value.copy(D); U.uSunU.value.copy(Uu); U.uSunV.value.copy(V);
    U.uSunPower.value = power;
    U.uWin.value.set(w.z0, w.y0, w.z1, w.y1);
    U.uWinX.value = x;
    U.uWinBars.value.set(w.frame, w.bar, w.y0 + (w.y1 - w.y0) * w.transom, w.transomBar);
    U.uWinFan.value.set(w.rays, w.arc);
    // The mask covers the opening as the sun sees it, with room for the widest blur.
    let u0 = Infinity, u1 = -Infinity, v0 = Infinity, v1 = -Infinity;
    for (const z of [w.z0, w.z1]) for (const y of [w.y0, w.y1]) {
      c.set(x, y, z);
      const u = c.dot(Uu), v = c.dot(V);
      u0 = Math.min(u0, u); u1 = Math.max(u1, u); v0 = Math.min(v0, v); v1 = Math.max(v1, v);
    }
    ext.set((u1 - u0) / 2, (v1 - v0) / 2);
    const h = Math.max(ext.x, ext.y) + LEAF_R[2] * 2 + 24;
    c.set(x, (w.y0 + w.y1) / 2, (w.z0 + w.z1) / 2);
    U.uMask.value.set((u0 + u1) / 2, (v0 + v1) / 2, h, c.dot(D) + CAFE.sun.leaves);
    mask.layout(ext, h);
    dirty = true;
  }
  setParams();

  // Each sleeve's face for the sun's shadows: its corner and two edges, and how strongly it shades (it
  // stops shading once flown well clear of the wall, as in writeOccluders).
  const o = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3();
  function sleevesMoved() {
    for (const s of sleeves) {
      const m = s.mesh.matrixWorld, p = s.pose;
      const away = THREE.MathUtils.smoothstep(p.z, 110, 260);
      const k = s.mesh.visible ? p.opacity * (1 - away) : 0;
      o.set(-L / 2, 0, SLEEVE.thick).applyMatrix4(m);
      a.set(L / 2, 0, SLEEVE.thick).applyMatrix4(m).sub(o);
      b.set(-L / 2, L, SLEEVE.thick).applyMatrix4(m).sub(o);
      U.uSlv.value[s.i * 3].set(o.x, o.y, o.z, k);
      U.uSlv.value[s.i * 3 + 1].set(a.x, a.y, a.z, 0);
      U.uSlv.value[s.i * 3 + 2].set(b.x, b.y, b.z, 0);
    }
  }

  function setEnabled(v) {
    on = !!v;
    wallMesh.material = on ? wallSun : wallV1;
    shelfMeshes.forEach((m, k) => { m.material = on ? shelfSun[k] : shelfV1[k]; });
    for (const m of coverMats) if (!!m.userData.njSun !== on) { m.userData.njSun = on; m.needsUpdate = true; }
  }

  return {
    get on() { return on; },
    get fade() { return U.uSunFade.value; },
    setParams,
    setEnabled,
    setFade(f) { U.uSunFade.value = f; },
    sleevesMoved,
    // The ambient clock: redraws the leaves when it moves on.
    tick(time) {
      if (!dirty && time === t) return false;
      t = time; dirty = false;
      mask.render(t);
      return true;
    },
    // Compile the sun's programs without showing them: enable, compile, restore.
    async compile(camera) {
      const was = on;
      setEnabled(true);
      if (renderer.compileAsync) await renderer.compileAsync(scene, camera);
      else renderer.compile(scene, camera);
      setEnabled(was);
    },
    uniforms: U,
  };
}
