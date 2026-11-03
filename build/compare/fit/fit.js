// Fits the soft boxes (editions/scene/lighting.js LIGHTS) to a reference rest frame. Renders our wall
// and shelves at 1440x900 with the sleeves at rest, compares grey levels on wall and shelf pixels with
// the reference, and minimises the squared error with Nelder-Mead. Run through build/compare/fit/fit.mjs.
import * as THREE from 'three';
import { CAMERA_Z, SHELF } from '/editions/scene/config.js';
import { createLightUniforms, applyLights, LIGHTS } from '/editions/scene/lighting.js';
import { createWall } from '/editions/scene/wall.js';
import { createShelves } from '/editions/scene/shelves.js';
import { createSleeves, applyPose, writeOccluders, restPose } from '/editions/scene/sleeves.js';

const q = new URLSearchParams(location.search);
const W = 1440, H = 900;
const iters = +(q.get('iters') || 1200);
const start = q.get('start') ? JSON.parse(q.get('start')) : LIGHTS;

const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NeutralToneMapping;
const gl = renderer.getContext();

const scene = new THREE.Scene();
const u = createLightUniforms();
SHELF.tops.forEach((top, r) => u.uShelf.value[r].set(-SHELF.width / 2, SHELF.width / 2, top - SHELF.thick, top));
u.uShelfDepth.value = SHELF.depth;
const wall = createWall(renderer, u);
scene.add(wall.mesh);
const shelves = createShelves(u);
shelves.forEach(m => scene.add(m));
const entries = Array.from({ length: 10 }, () => ({ accent: { light: '#808080' } }));
const sleeves = createSleeves(entries);
sleeves.forEach(s => { s.pose = restPose(); applyPose(s); scene.add(s.mesh); });
writeOccluders(sleeves, u);

const S = 1, hw = W / 2 / S, hh = H / 2 / S;
const camera = new THREE.PerspectiveCamera(THREE.MathUtils.radToDeg(2 * Math.atan(hh / CAMERA_Z)), W / H, 100, CAMERA_Z * 2);
camera.position.set(0, 0, CAMERA_Z);
camera.updateMatrixWorld();
wall.resize(-hw * 1.02, -hh * 1.02, hw * 1.02, hh * 1.02, W / 2, H / 2);

const buf = new Uint8Array(W * H * 4);
function grab() {
  gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, buf);
  return buf;
}
const at = (x, y) => ((H - 1 - y) * W + x) * 4; // readPixels rows run bottom-up

// Reference grey levels.
const img = new Image();
img.src = q.get('ref');
await img.decode();
const c2 = document.createElement('canvas'); c2.width = W; c2.height = H;
const x2 = c2.getContext('2d', { willReadFrequently: true });
x2.drawImage(img, 0, 0, W, H);
const refPx = x2.getImageData(0, 0, W, H).data;

// Classes from a flat-colour pass: wall (0), shelf (1), sleeve (2).
const flat = c => new THREE.MeshBasicMaterial({ color: c });
const keep = new Map();
scene.traverse(o => { if (o.isMesh) keep.set(o, o.material); });
wall.mesh.material = flat(0x000000);
shelves.forEach(m => { m.material = flat(0xff0000); });
sleeves.forEach(s => { s.mesh.material = flat(0x00ff00); });
renderer.toneMapping = THREE.NoToneMapping;
renderer.render(scene, camera);
const cls = new Uint8Array(W * H);
const m0 = grab();
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = at(x, y);
  cls[y * W + x] = m0[i + 1] > 128 ? 2 : m0[i] > 128 ? 1 : 0;
}
keep.forEach((mat, o) => { o.material = mat; });
renderer.toneMapping = THREE.NeutralToneMapping;
const near = (x, y, r, k) => {
  for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
    const xx = x + dx, yy = y + dy;
    if (xx >= 0 && yy >= 0 && xx < W && yy < H && cls[yy * W + xx] === k) return true;
  }
  return false;
};
const wallPts = [], shelfPts = [];
for (let y = 108; y < 805; y += 3) for (let x = 2; x < W - 2; x += 3) {
  const k = cls[y * W + x];
  if (k === 0 && !near(x, y, 4, 2) && !near(x, y, 2, 1)) wallPts.push(x, y);
}
for (let y = 108; y < 805; y++) for (let x = 2; x < W - 2; x += 2) {   // shelves are thin: sample densely
  if (cls[y * W + x] === 1 && !near(x, y, 1, 0) && !near(x, y, 3, 2)) shelfPts.push(x, y);
}
const refGrey = (x, y) => { const i = (y * W + x) * 4; return (refPx[i] + refPx[i + 1] + refPx[i + 2]) / 3; };

// Parameter vector <-> LIGHTS.
// The shelves keep the soft boxes' powers; the wall uses their visible fractions and its own base.
const KEYS = [
  ['key', 'rect', 0], ['key', 'rect', 1], ['key', 'rect', 2], ['key', 'rect', 3], ['key', 'z'], ['key', 'power'],
  ['fill', 'rect', 2], ['fill', 'rect', 1], ['fill', 'rect', 3], ['fill', 'z'], ['fill', 'power'],
  ['shelfAmbient'], ['shelfAlbedo'], ['contact', 'strength'], ['contact', 'reach'],
  ['halo', 'right'], ['halo', 'left'], ['halo', 'top'], ['halo', 'rise'], ['halo', 'fall'], ['halo', 'row2'], ['halo', 'vfall'], ['edgeShade', 'strength'], ['edgeShade', 'reach'],
  ['keyMix'], ['base', 'centre'], ['base', 'edge'], ['base', 'cy'], ['base', 'rx'], ['base', 'ry'], ['base', 'pow'],
];
const getP = (L, k) => k.reduce((o, kk) => o[kk], L);
const toVec = L => KEYS.map(k => getP(L, k));
function fromVec(v) {
  const L = structuredClone(start);
  KEYS.forEach((k, j) => {
    let o = L;
    for (let n = 0; n < k.length - 1; n++) o = o[k[n]];
    o[k[k.length - 1]] = v[j];
  });
  L.fill.rect[0] = -L.fill.rect[2];   // the fill is centred on the view
  return L;
}
const STEP = [300, 300, 300, 300, 300, 0.5, 1500, 1500, 1500, 400, 0.2, 0.05, 0.05, 0.1, 3, 0.1, 0.05, 0.03, 2, 20, 0.2, 5, 0.1, 2, 0.1, 0.05, 0.05, 100, 200, 200, 0.3];

function valid(L) {
  const ok = l => l.rect[2] > l.rect[0] + 20 && l.rect[3] > l.rect[1] + 20 && l.z > 300 && l.power > 0;
  return ok(L.key) && ok(L.fill) && L.shelfAmbient >= 0 && L.shelfAlbedo > 0 && L.contact.strength >= 0 && L.contact.strength <= 1 && L.contact.reach > 0.5 && L.halo.right >= 0 && L.halo.left >= 0 && L.halo.top >= 0 && L.halo.rise > 0.3 && L.halo.fall > 2 && L.halo.row2 >= 0 && L.halo.vfall > 1 && L.edgeShade.strength >= 0 && L.edgeShade.strength < 1 && L.edgeShade.reach > 0.5 && L.keyMix >= 0 && L.keyMix <= 1 && L.base.rx > 50 && L.base.ry > 50 && L.base.pow > 0.3 && L.base.pow < 8;
}
function render(L) {
  applyLights(u, L);
  wall.bake();
  renderer.render(scene, camera);
  return grab();
}
function cost(v) {
  const L = fromVec(v);
  if (!valid(L)) return 1e9;
  const px = render(L);
  let ew = 0, es = 0;
  for (let j = 0; j < wallPts.length; j += 2) {
    const x = wallPts[j], y = wallPts[j + 1], i = at(x, y);
    const d = px[i] - refGrey(x, y); ew += d * d;
  }
  for (let j = 0; j < shelfPts.length; j += 2) {
    const x = shelfPts[j], y = shelfPts[j + 1], i = at(x, y);
    const d = px[i] - refGrey(x, y); es += d * d;
  }
  return ew / (wallPts.length / 2) + 0.5 * es / (shelfPts.length / 2);
}

function nelderMead(f, x0, steps, maxIt) {
  const n = x0.length;
  let simplex = [x0.slice()];
  for (let i = 0; i < n; i++) { const x = x0.slice(); x[i] += steps[i]; simplex.push(x); }
  let fs = simplex.map(f);
  for (let it = 0; it < maxIt; it++) {
    const idx = fs.map((v, i) => i).sort((a, b) => fs[a] - fs[b]);
    simplex = idx.map(i => simplex[i]); fs = idx.map(i => fs[i]);
    const c = new Array(n).fill(0);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) c[j] += simplex[i][j] / n;
    const lerp = (a, b, t) => a.map((v, j) => v + (b[j] - v) * t);
    const xr = lerp(c, simplex[n], -1), fr = f(xr);
    if (fr < fs[0]) {
      const xe = lerp(c, simplex[n], -2), fe = f(xe);
      if (fe < fr) { simplex[n] = xe; fs[n] = fe; } else { simplex[n] = xr; fs[n] = fr; }
    } else if (fr < fs[n - 1]) { simplex[n] = xr; fs[n] = fr; }
    else {
      const xc = lerp(c, simplex[n], 0.5), fc = f(xc);
      if (fc < fs[n]) { simplex[n] = xc; fs[n] = fc; }
      else for (let i = 1; i <= n; i++) { simplex[i] = lerp(simplex[0], simplex[i], 0.5); fs[i] = f(simplex[i]); }
    }
    if (it % 100 === 0) console.log(`it ${it} cost ${fs[0].toFixed(2)}`);
  }
  const b = fs.indexOf(Math.min(...fs));
  return { x: simplex[b], f: fs[b] };
}

const x0 = toVec(start);
const c0 = cost(x0);
let best = { x: x0, f: c0 };
// Restart once from the best point: Nelder-Mead stalls on a collapsed simplex.
for (let r = 0; r < 2 && iters > 0; r++) {
  const res = nelderMead(cost, best.x, STEP.map(s => s / (r + 1)), iters);
  if (res.f < best.f) best = res;
}
const L = fromVec(best.x);
const round = o => JSON.parse(JSON.stringify(o, (k, v) => (typeof v === 'number' ? +v.toFixed(3) : v)));
render(L);
// Residual map: ours - reference, grey, on wall and shelf pixels (mid grey = equal, +-40 full scale).
const px = grab();
const diff = new ImageData(W, H);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const k = cls[y * W + x], o = (y * W + x) * 4;
  if (k === 2) { diff.data[o] = 0; diff.data[o + 1] = 0; diff.data[o + 2] = 90; diff.data[o + 3] = 255; continue; }
  const d = px[at(x, y)] - refGrey(x, y);
  const g = Math.max(0, Math.min(255, 128 + d * 3.2));
  diff.data[o] = g; diff.data[o + 1] = g; diff.data[o + 2] = g; diff.data[o + 3] = 255;
}
const dc = document.createElement('canvas'); dc.width = W; dc.height = H;
dc.getContext('2d').putImageData(diff, 0, 0);
window.fitResult = { start: c0, cost: best.f, lights: round(L), wallPts: wallPts.length / 2, shelfPts: shelfPts.length / 2, diff: dc.toDataURL('image/png'), ours: canvas.toDataURL('image/png') };
