// The garden outside the window (café round 5; the operator's decision, 4 November 2026): a frangipani whose
// crown hangs over the window with a gap where the sun comes through, a monstera on a pole and a banana by
// the glass, climbers on the neighbour's yard wall. The same shapes do two things. Seen through the window
// from the café, lit by the sun and shaded by themselves; and drawn from the sun into the leaf mask the
// record wall's light reads (scene/sun.js), so every dapple on the wall and the covers is a gap in leaves
// you can see, moving with them in one wind on the ambient clock. A lazy chunk, loaded with the sun.
import * as THREE from 'three';
import { CAFE } from './config.js';
import { drawLeaves, atlasUV, ATLAS } from './leaves.js';

const R = CAFE.room, W = CAFE.window;
const XF = R.front + R.wall;             // the street side of the front wall
const GROUND = R.floor - 70;             // the yard outside, a step down from the café's floor
const UP = new THREE.Vector3(0, 1, 0);
const V = (x, y, z) => new THREE.Vector3(x, y, z);
function mulberry32(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// The wind, shared by every pass: trunks and limbs lean slowly with it, leaves flutter only in gusts, the
// gusts arriving from the street. aWind: a phase, and how free the point is (0 rooted, up to 1 at a tip).
const WIND_GLSL = /* glsl */`
uniform float uT;
attribute vec2 aWind;
float njGust(float t) { return smoothstep(0.35, 0.9, 0.5 + 0.5 * sin(t * 0.23) * sin(t * 0.113 + 1.3)); }
vec3 njWind(vec2 w) {
  float g = njGust(uT), f = w.y * w.y;
  float sway = 0.6 * sin(uT * 0.55 + w.x) + 0.4 * sin(uT * 0.37 + w.x * 1.7);
  float flutter = sin(uT * 5.6 + w.x * 9.0) * (0.25 + g);       // leaves never quite still; more in a gust
  vec3 dir = normalize(vec3(-0.3, 0.0, 1.0));
  return dir * (w.y * (22.0 * sway + 30.0 * g * (0.6 + 0.4 * sin(uT * 2.1 + w.x))) + f * 10.0 * flutter) + vec3(0.0, f * 12.0 * flutter, 0.0);
}`;

const VIEW_VERT = /* glsl */`
attribute vec3 aCol;
varying vec3 vP;
varying vec3 vN;
varying vec3 vCol;
varying vec2 vUv;
${WIND_GLSL}
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  w.xyz += njWind(aWind);
  vP = w.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  vCol = aCol;
  vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

// Seen from the café: lit by the sun where nothing nearer the sun covers it (the garden's own sun view),
// through the leaf where the sun is behind it, and by the hazy sky.
const VIEW_FRAG = /* glsl */`
uniform sampler2D uAtlas, uShade;
uniform vec3 uSunD, uSunU, uSunV, uSunCol, uSkyCol;
uniform vec4 uShadeAt;      // the garden's sun view: centre (u, v), half size, texel
uniform float uSolid;
varying vec3 vP;
varying vec3 vN;
varying vec3 vCol;
varying vec2 vUv;
// The sun's own softness: a shadow's edge widens with the distance from what casts it to where it falls,
// by the sun's angular radius (0.27 degrees). Find how far the casters stand (the mean of those nearer
// the sun around this point), then look across that width, each look filtered between texels.
const vec2 NJ_PD[12] = vec2[12](vec2(-0.326, -0.406), vec2(-0.84, -0.074), vec2(-0.696, 0.457), vec2(-0.203, 0.621), vec2(0.962, -0.195), vec2(0.473, -0.48),
                                 vec2(0.519, 0.767), vec2(0.185, -0.893), vec2(0.507, 0.064), vec2(0.896, 0.412), vec2(-0.322, -0.933), vec2(-0.792, -0.598));
float njShadeTap(vec2 uv, float d) {
  float n = 1.0 / uShadeAt.w;
  vec2 st = uv * n - 0.5, f = fract(st), t = (floor(st) + 0.5) / n, o = vec2(uShadeAt.w, 0.0);
  float a = step(texture2D(uShade, t).r, d), b = step(texture2D(uShade, t + o).r, d);
  float c = step(texture2D(uShade, t + o.yx).r, d), e = step(texture2D(uShade, t + o.xx).r, d);
  return mix(mix(a, b, f.x), mix(c, e, f.x), f.y);
}
float njLit(vec3 p) {
  vec2 uv = (vec2(dot(p, uSunU), dot(p, uSunV)) - uShadeAt.xy) / (2.0 * uShadeAt.z) + 0.5;
  float d = dot(p, uSunD) + 10.0, sum = 0.0, k = 0.0;
  for (int i = 0; i < 12; i++) { float z = texture2D(uShade, uv + NJ_PD[i] * uShadeAt.w * 9.0).r; if (z > d) { sum += z; k += 1.0; } }
  if (k < 0.5) return 1.0;
  float units = 2.0 * uShadeAt.z * uShadeAt.w;                         // world units per texel
  float rad = clamp((sum / k - d) * 0.0047 / units, 1.2, 10.0) * uShadeAt.w;
  float lit = 0.0;
  for (int i = 0; i < 12; i++) lit += njShadeTap(uv + NJ_PD[i] * rad, d);
  return lit / 12.0;
}
void main() {
  vec4 t = uSolid > 0.5 ? vec4(1.0) : texture2D(uAtlas, vUv);
  if (t.a < 0.2) discard;
  float cover = uSolid > 0.5 ? 1.0 : clamp((t.a - 0.5) / max(fwidth(t.a), 1e-3) + 0.5, 0.0, 1.0);
  vec3 n = normalize(vN) * (gl_FrontFacing ? 1.0 : -1.0);
  float nd = dot(n, uSunD), lit = njLit(vP);
  vec3 c = vCol * t.rgb;
  vec3 light = uSkyCol * (0.32 + 0.18 * max(n.y, 0.0)) + uSunCol * lit * max(nd, 0.0);
  if (uSolid < 0.5) light += uSunCol * lit * 0.6 * max(-nd, 0.0) * vec3(0.8, 1.0, 0.35);   // through the leaf
  gl_FragColor = vec4(c * light, cover);
  #include <colorspace_fragment>
}`;

// From the sun: R is 0 where the garden stops the sun (the record wall's mask reads it), G how far toward
// the sun the nearest stopper stands (the garden's own shadows).
const MASK_VERT = /* glsl */`
uniform vec3 uSunD;
varying vec2 vUv;
varying float vDepth;
${WIND_GLSL}
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  w.xyz += njWind(aWind);
  vUv = uv;
  vDepth = dot(w.xyz, uSunD);
  gl_Position = projectionMatrix * viewMatrix * w;
}`;
const MASK_FRAG = /* glsl */`
uniform sampler2D uAtlas;
uniform float uSolid, uDepthOut;
varying vec2 vUv;
varying float vDepth;
void main() {
  if (uSolid < 0.5 && texture2D(uAtlas, vUv).a < 0.5) discard;
  gl_FragColor = uDepthOut > 0.5 ? vec4(vDepth, 0.0, 0.0, 1.0) : vec4(0.0, 0.0, 0.0, 1.0);
}`;

// Geometry gathered into two meshes, leaves and wood, with each vertex's colour and wind.
function gatherer() {
  const P = [], N = [], T = [], C = [], WD = [], IX = [];
  let nv = 0;
  return {
    add(g, F, col, phase, flex) {
      if (F) g.applyMatrix4(F);
      const p = g.attributes.position, n = g.attributes.normal, uv = g.attributes.uv;
      for (let i = 0; i < p.count; i++) {
        P.push(p.getX(i), p.getY(i), p.getZ(i)); N.push(n.getX(i), n.getY(i), n.getZ(i));
        T.push(uv ? uv.getX(i) : 0, uv ? uv.getY(i) : 0); C.push(col[0], col[1], col[2]); WD.push(phase, flex(i));
      }
      for (const k of g.index.array) IX.push(k + nv);
      nv += p.count;
      g.dispose();
    },
    build() {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(T, 2));
      g.setAttribute('aCol', new THREE.Float32BufferAttribute(C, 3));
      g.setAttribute('aWind', new THREE.Float32BufferAttribute(WD, 2));
      g.setIndex(nv > 65535 ? new THREE.Uint32BufferAttribute(IX, 1) : new THREE.Uint16BufferAttribute(IX, 1));
      g.computeBoundingBox(); g.computeBoundingSphere();
      return g;
    },
  };
}

export function createGarden({ renderer }) {
  const leaves = gatherer(), wood = gatherer();
  const sunD = new THREE.Vector3(), sunU = new THREE.Vector3(), sunV = new THREE.Vector3();
  const s = CAFE.sun, A = s.az * Math.PI / 180, E = s.el * Math.PI / 180;
  sunD.set(Math.cos(E) * Math.cos(A), Math.sin(E), Math.cos(E) * Math.sin(A));
  // The beam's axis: through the window's middle toward the sun. The canopy keeps clear of it, so the
  // patch keeps its bright core.
  const beamO = V(R.front, (W.y0 + W.y1) / 2 + 40, (W.z0 + W.z1) / 2);
  const inBeamCore = (p, r) => { const q = p.clone().sub(beamO), t = q.dot(sunD); return t > 0 && q.addScaledVector(sunD, -t).length() < r; };

  // A leaf card from the atlas: its stem end at `base`, along `dir`, w wide and h long; bend droops the tip.
  function leaf(cell, col, base, dir, w, h, bend, roll, phase, flex0) {
    const y = dir.clone().normalize(), x = new THREE.Vector3().crossVectors(y, UP);
    if (x.lengthSq() < 1e-6) x.set(1, 0, 0);
    x.normalize();
    if (roll) x.applyAxisAngle(y, roll);
    const z = new THREE.Vector3().crossVectors(x, y).normalize();
    const g = new THREE.PlaneGeometry(1, 1, 2, 4), p = g.attributes.position, uv = g.attributes.uv, vs = [];
    for (let i = 0; i < p.count; i++) {
      const u = uv.getX(i), v = uv.getY(i), a = (u - 0.5) * 2;
      p.setXYZ(i, (u - 0.5) * w, v * h, (-bend * v * v + 0.05 * a * a) * h);
      const [U2, V2] = atlasUV(cell, u, v);
      uv.setXY(i, U2, V2);
      vs.push(v);
    }
    g.computeVertexNormals();
    leaves.add(g, new THREE.Matrix4().makeBasis(x, y, z).setPosition(base), col, phase, i => Math.min(1, flex0 + 0.3 * vs[i]));
  }
  // A limb from a to b, tapering r0 to r1, its freedom fA at a and fB at b.
  function limb(col, a, b, r0, r1, phase, fA, fB, seg = 7) {
    const d = b.clone().sub(a), len = d.length();
    const g = new THREE.CylinderGeometry(r1, r0, len, seg, 3), p = g.attributes.position, ys = [];
    for (let i = 0; i < p.count; i++) ys.push(p.getY(i) / len + 0.5);
    const F = new THREE.Matrix4().compose(a.clone().add(b).multiplyScalar(0.5), new THREE.Quaternion().setFromUnitVectors(UP, d.normalize()), V(1, 1, 1));
    wood.add(g, F, col, phase, i => fA + (fB - fA) * ys[i]);
  }
  const jit = (c, r, k = 0.3) => { const m = 1 - k / 2 + k * r(); return c.map(v => v * m); };

  // Shapes that stand in the sun's way, seen from the record wall: a point p lands at x - 1.28 z, y - 0.375 z
  // on the wall. Trunks stand outside the beam; crowns reach into it, except along its axis.
  //
  // The tamarind: a broad crown over the yard, low enough to fill the beam's upper half beyond the window
  // (its fronds of small leaflets make the small round suns of komorebi) and reaching across to where the
  // window looks out. Clumps of fronds on limbs from one trunk, which stands outside the beam.
  {
    const r = mulberry32(29), bark = [0.26, 0.22, 0.18], leafC = [0.2, 0.4, 0.1];
    const root = V(2700, GROUND, 980), crotch = V(2600, 620, 1000);
    limb(bark, root, crotch, 66, 50, 0.2, 0, 0.04, 10);
    // the crown: an ellipsoid shell, its clumps spread through it (none on the beam's axis)
    const C0 = V(1940, 900, 1000), RX = 720, RY = 400, RZ = 950;
    const clumps = [];
    for (let tries = 0; clumps.length < 36 && tries < 4000; tries++) {
      const a = r() * Math.PI * 2, b = Math.acos(1 - 2 * r()), k = 0.65 + 0.35 * Math.cbrt(r());
      const q = V(C0.x + RX * k * Math.sin(b) * Math.cos(a), C0.y + RY * k * Math.cos(b) * 0.85, C0.z + RZ * k * Math.sin(b) * Math.sin(a));
      if (q.x < XF + 120 || q.y < 600 || inBeamCore(q, 150)) continue;
      if (clumps.some(c => c.distanceTo(q) < 150)) continue;
      clumps.push(q);
    }
    for (const q of clumps) {
      const phase = r() * 6;
      // a limb to the clump, bowed: out from the crotch, then over
      const mid = crotch.clone().lerp(q, 0.55).add(V(0, 120 + 80 * r(), 0));
      limb(bark, crotch, mid, 15, 10, phase, 0.04, 0.3, 6);
      limb(bark, mid, q, 10, 5, phase, 0.3, 0.55, 5);
      const n = 5 + Math.floor(r() * 4);
      for (let m = 0; m < n; m++) {
        const a = r() * Math.PI * 2, el = -0.4 + r() * 0.9, out = V(Math.cos(a) * Math.cos(el), Math.sin(el), Math.sin(a) * Math.cos(el));
        const at = q.clone().addScaledVector(out, 30 + 90 * r());
        if (inBeamCore(at, 95)) continue;
        leaf(6, jit(leafC, r), at, out.clone().add(V(0, -0.45, 0)).normalize(), 130 + 50 * r(), 230 + 100 * r(), 0.14, r() * 3, phase + r() * 0.5, 0.6 + 0.3 * r());
      }
    }
  }
  // The frangipani: left of the window, near enough to see from inside; long leaves in rosettes at its
  // candelabra tips, and clusters of white flowers.
  {
    const r = mulberry32(31), bark = [0.36, 0.31, 0.26], leafC = [0.2, 0.42, 0.11], flower = [1.0, 0.96, 0.86];
    const root = V(1760, GROUND, 120), fork = V(1740, 120, 140);
    limb(bark, root, fork, 34, 27, 0.3, 0, 0.05, 9);
    const tips = [];
    const grow = (p, dir, len, rad, depth, phase, flex) => {
      const e = p.clone().addScaledVector(dir, len);
      if (e.x < XF + 90) e.x = XF + 90 + r() * 40;     // never into the building
      if (e.z < 40) e.z = 40 + r() * 30;                // nor through the neighbour's wall
      limb(bark, p, e, rad, rad * 0.76, phase, flex, flex + 0.18, 7);
      if (depth === 0) { tips.push({ p: e, dir, phase, flex: flex + 0.18 }); return; }
      const n = 2 + (r() < 0.5 ? 1 : 0);
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2 + r() * 1.2, spread = 0.35 + r() * 0.3, side = V(Math.cos(a), 0, Math.sin(a));
        const nd = dir.clone().multiplyScalar(Math.cos(spread)).addScaledVector(side, Math.sin(spread)).add(V(0, 0.25, 0)).normalize();
        grow(e, nd, len * (0.72 + r() * 0.15), rad * 0.72, depth - 1, phase + r() * 0.9, flex + 0.18);
      }
    };
    for (const [dx, dy, dz, len] of [[-0.45, 0.75, 0.3, 300], [-0.2, 0.85, 0.55, 300], [-0.42, 0.42, 0.8, 420]]) grow(fork, V(dx, dy, dz).normalize(), len, 22, 2, r() * 6, 0.05);
    for (const t of tips) {
      const n = 10 + Math.floor(r() * 5);
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2 + r() * 0.4, out = V(Math.cos(a), 0.3 + r() * 0.5, Math.sin(a)).normalize();
        leaf(3, jit(leafC, r), t.p.clone().addScaledVector(out, 8), out, 52 + 16 * r(), 180 + 60 * r(), 0.22, (r() - 0.5) * 0.8, t.phase + r(), Math.min(0.85, t.flex));
      }
      if (r() < 0.6) for (let k = 0; k < 5; k++) {
        const a = k * 1.25 + r(), out = V(Math.cos(a) * 0.6, 1, Math.sin(a) * 0.6).normalize();
        leaf(7, flower, t.p.clone().addScaledVector(out, 30 + 10 * r()), out, 46, 46, 0, r() * 3, t.phase, Math.min(0.9, t.flex + 0.1));
      }
    }
  }
  // The banana by the left of the window: a pseudostem and its great torn leaves arching out.
  {
    const r = mulberry32(47), stem = [0.36, 0.42, 0.18], leafC = [0.26, 0.5, 0.14];
    const base = V(1480, GROUND, 300), top = V(1470, -40, 310);
    limb(stem, base, top, 32, 24, 1.1, 0, 0.1, 10);
    for (let k = 0; k < 8; k++) {
      const a = k * 2.39996 + r() * 0.4, out = V(Math.cos(a), 0.9 - k * 0.06, Math.sin(a)).normalize();
      out.x = Math.max(out.x, -0.15); out.normalize();     // never back into the glass
      leaf(3, jit(leafC, r), top.clone().add(V(0, k * 18, 0)), out, 170 + 40 * r(), 560 + 160 * r(), 0.32, (r() - 0.5) * 0.5, 1.1 + r(), 0.3);
    }
  }
  // The monstera in a planter by the right of the window, its leaves held up on long stems low in the sun's
  // path, so they shade the patch's lower edge.
  {
    const r = mulberry32(53), stemC = [0.24, 0.34, 0.12], leafC = [0.13, 0.33, 0.1];
    const base = V(1430, GROUND + 160, 1010);
    for (let k = 0; k < 11; k++) {
      const a = k * 2.39996 + r() * 0.6, lift = 0.75 + r() * 0.2;
      const out = V(Math.cos(a) * (1 - lift), lift, Math.sin(a) * (1 - lift)).normalize();
      if (out.x < -0.12) { out.x = -0.12; out.normalize(); }
      const tip = base.clone().addScaledVector(out, 420 + 320 * r());
      limb(stemC, base, tip, 7, 5, 2.0 + r(), 0.05, 0.4, 5);
      leaf(0, jit(leafC, r), tip, V(Math.cos(a), 0.25 - r() * 0.5, Math.sin(a)), 170 + 80 * r(), 180 + 80 * r(), 0.16, (r() - 0.5) * 0.6, 2.0 + r(), 0.45);
    }
  }
  // The neighbour's yard wall, past the record wall's line, and the climber over it.
  {
    const r = mulberry32(61), leafC = [0.16, 0.36, 0.1];
    const wallG = new THREE.BoxGeometry(1500, 1500, 40).translate(XF + 750, GROUND + 750, -40);
    wood.add(wallG, null, [0.78, 0.7, 0.6], 0, () => 0);
    for (let k = 0; k < 260; k++) {
      const x = XF + 40 + Math.pow(r(), 0.8) * 1400, y = GROUND + 300 + r() * 1180;
      if (r() > 0.35 + 0.5 * Math.sin((x - XF) / 300 + y / 260) ** 2) continue;   // in patches
      const dir = V((r() - 0.5) * 0.6, -0.4 - r() * 0.6, 0.35).normalize();
      leaf(1, jit(leafC, r), V(x, y, -16 + r() * 8), dir, 48 + 20 * r(), 54 + 22 * r(), 0.08, (r() - 0.5), 3.0 + r() * 2, 0.15 + 0.2 * r());
    }
  }

  // ---- materials, the meshes, and the sun's two views of them -------------------------------------------
  const atlas = (() => { const c = document.createElement('canvas'); c.width = ATLAS.w; c.height = ATLAS.h; drawLeaves(c.getContext('2d'), c.width, c.height); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.NoColorSpace; t.anisotropy = 4; return t; })();
  const SHADE_RES = 2048;
  const shadeRT = new THREE.WebGLRenderTarget(SHADE_RES, SHADE_RES, { type: THREE.HalfFloatType, format: THREE.RedFormat, depthBuffer: true, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, generateMipmaps: false });
  const shadeAt = new THREE.Vector4();
  const common = {
    uT: { value: 0 }, uAtlas: { value: atlas }, uShade: { value: shadeRT.texture }, uShadeAt: { value: shadeAt },
    uSunD: { value: sunD }, uSunU: { value: sunU }, uSunV: { value: sunV },
    uSunCol: { value: new THREE.Vector3(2.3, 1.75, 1.05) }, uSkyCol: { value: new THREE.Vector3(0.62, 0.68, 0.8) },
  };
  const viewMat = solid => new THREE.ShaderMaterial({ uniforms: { ...common, uSolid: { value: solid } }, vertexShader: VIEW_VERT, fragmentShader: VIEW_FRAG, side: THREE.DoubleSide, alphaToCoverage: !solid, toneMapped: false });
  const depthOut = { value: 0 };
  const maskMat = solid => new THREE.ShaderMaterial({ uniforms: { ...common, uSolid: { value: solid }, uDepthOut: depthOut }, vertexShader: MASK_VERT, fragmentShader: MASK_FRAG, side: THREE.DoubleSide, toneMapped: false });
  const mats = { leafV: viewMat(0), woodV: viewMat(1), leafM: maskMat(0), woodM: maskMat(1) };
  const leafGeo = leaves.build(), woodGeo = wood.build();
  const group = new THREE.Group();
  group.visible = false;
  group.add(new THREE.Mesh(leafGeo, mats.leafV), new THREE.Mesh(woodGeo, mats.woodV));
  for (const m of group.children) m.frustumCulled = false;     // the wind moves them past their bounds
  const maskScene = new THREE.Scene();
  maskScene.add(new THREE.Mesh(leafGeo, mats.leafM), new THREE.Mesh(woodGeo, mats.woodM));
  for (const m of maskScene.children) m.frustumCulled = false;

  // A camera at the sun: x along U and y along V of the sun's view (its projection mirrored so a texel's u
  // grows with U, as the wall reads it), looking back along the sun's ray.
  function sunCamera(u, v, h) {
    const cam = new THREE.OrthographicCamera(h, -h, h, -h, 1, 30000);
    const m = new THREE.Matrix4().makeBasis(sunU.clone().negate(), sunV, sunD);
    m.setPosition(sunU.clone().multiplyScalar(u).addScaledVector(sunV, v).addScaledVector(sunD, 12000));
    cam.matrixAutoUpdate = false;
    cam.matrix.copy(m); cam.matrixWorld.copy(m); cam.matrixWorldInverse.copy(m).invert();
    cam.updateProjectionMatrix();
    return cam;
  }
  let maskCam = null, shadeCam = null;
  const white = new THREE.Color(1, 1, 1), far = new THREE.Color(-60000, 0, 0), was = new THREE.Color();

  return {
    group,
    textures: [atlas],
    // The sun's frame (sun.js's setParams): U, V of its view, and the record wall's mask (centre, half size).
    layout({ D, U: u, V: v, uc, vc, h }) {
      sunD.copy(D); sunU.copy(u); sunV.copy(v);
      maskCam = sunCamera(uc, vc, h);
      // the garden's own sun view covers all of it
      const bb = woodGeo.boundingBox.clone().union(leafGeo.boundingBox).expandByScalar(60);
      let u0 = Infinity, u1 = -Infinity, v0 = Infinity, v1 = -Infinity;
      for (const x of [bb.min.x, bb.max.x]) for (const y of [bb.min.y, bb.max.y]) for (const z of [bb.min.z, bb.max.z]) {
        const p = V(x, y, z), pu = p.dot(sunU), pv = p.dot(sunV);
        u0 = Math.min(u0, pu); u1 = Math.max(u1, pu); v0 = Math.min(v0, pv); v1 = Math.max(v1, pv);
      }
      const gh = Math.max(u1 - u0, v1 - v0) / 2;
      shadeAt.set((u0 + u1) / 2, (v0 + v1) / 2, gh, 1 / SHADE_RES);
      shadeCam = sunCamera(shadeAt.x, shadeAt.y, gh);
    },
    // The ambient clock: the wind moves on; draw the garden's sun view, then the record wall's mask into
    // `target` (white where the sun gets through).
    renderMask(target, t) {
      common.uT.value = t;
      if (!maskCam) return;
      const prev = renderer.getRenderTarget(), alpha = renderer.getClearAlpha();
      renderer.getClearColor(was);
      depthOut.value = 1; renderer.setClearColor(far, 1);
      renderer.setRenderTarget(shadeRT); renderer.clear(); renderer.render(maskScene, shadeCam);
      depthOut.value = 0; renderer.setClearColor(white, 1);
      renderer.setRenderTarget(target); renderer.clear(); renderer.render(maskScene, maskCam);
      renderer.setRenderTarget(prev);
      renderer.setClearColor(was, alpha);
    },
    dispose() { leafGeo.dispose(); woodGeo.dispose(); atlas.dispose(); shadeRT.dispose(); for (const m of Object.values(mats)) m.dispose(); },
  };
}
