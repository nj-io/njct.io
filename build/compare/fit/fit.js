// Fits the soft boxes (editions/scene/lighting.js LIGHTS) to a reference rest frame. Renders our wall
// and shelves at 1440x900 with the sleeves at rest and minimises a cost with Nelder-Mead. Run through
// build/compare/fit/fit.mjs.
// The reference holds five sleeves a shelf and ours the lineup's count, so the two frames line up only
// away from the sleeves. The cost therefore has three parts:
//   targets  regions measured against the reference, each in coordinates that follow its own layout
//            (rows above the top-shelf sleeves, the top shelf's under-shadow, the upper wall, the column
//            beside the shelf's left end);
//   limits   hard penalties: no wall pixel above 243 in the band above the sleeves and beside their upper
//            corners, no shelf-face row above 240 (the reference peaks there at 240 and 239);
//   anchor   every other wall and shelf pixel holds its value in the render of the shipped LIGHTS.
import * as THREE from 'three';
import { CAMERA_Z, SHELF, SLEEVE, LINEUP } from '/editions/scene/config.js';
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
const entries = LINEUP.map(() => ({ accent: { light: '#808080' } }));
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
const refGrey = (x, y) => { const i = (y * W + x) * 4; return (refPx[i] + refPx[i + 1] + refPx[i + 2]) / 3; };
const refMean = pts => { let t = 0; for (let j = 0; j < pts.length; j += 2) t += refGrey(pts[j], pts[j + 1]); return t / (pts.length / 2); };

// Sleeve outlines on screen at rest (world y up, screen y down; the camera looks at the wall's centre).
// The reference: five 194 px sleeves a shelf at a 221.3 px pitch on a 1120 px shelf; ours: config.js.
function layout(per, size, pitch, width) {
  const zb = size * Math.sin(SLEEVE.lean), sb = CAMERA_Z / (CAMERA_Z - zb);
  const sleeves = [];
  per.forEach((n, r) => {
    for (let k = 0; k < n; k++) {
      const cx = W / 2 + (k - (n - 1) / 2) * pitch;
      sleeves.push({ row: r, cx, x0: cx - size / 2 * sb, x1: cx + size / 2 * sb, tx0: cx - size / 2, tx1: cx + size / 2,
        top: H / 2 - (SHELF.tops[r] + size * Math.cos(SLEEVE.lean)), bot: H / 2 - SHELF.tops[r] * sb });
    }
  });
  const sf = CAMERA_Z / (CAMERA_Z - SHELF.depth);
  return { sleeves, shelfX0: W / 2 - width / 2 * sf, shelfX1: W / 2 + width / 2 * sf,
    faces: SHELF.tops.map(t => [H / 2 - t * sf, H / 2 - (t - SHELF.thick) * sf]) };
}
const REF = layout([5, 5], 194, 221.3, 1120);
const OURS = layout([SLEEVE.cols, entries.length - SLEEVE.cols], SLEEVE.size, SLEEVE.pitch, SHELF.width);
const topRow = l => l.sleeves.filter(s => s.row === 0);
const isWall = (x, y) => cls[y * W + x] === 0 && !near(x, y, 4, 2) && !near(x, y, 2, 1);
const onWall = (x, y) => cls[y * W + x] === 0 && !near(x, y, 1, 2);   // targets reach up to the shelf's edge
const box = (x0, x1, y0, y1, step = 1, keep = isWall) => {
  const pts = [];
  for (let y = Math.ceil(y0); y <= Math.floor(y1); y += step) for (let x = Math.ceil(x0); x <= Math.floor(x1); x += step) if (keep(x, y)) pts.push(x, y);
  return pts;
};

// Targets: [our pixels, the reference's mean over its matching pixels, weight, label].
const targets = [];
// R1-02: the 12 rows above each top-shelf sleeve, over its top edge; the reference's band is interpolated
// at our sleeve's centre.
const refBand = topRow(REF).map(s => { const t = Math.floor(s.top); return [s.cx, refMean(box(s.tx0, s.tx1, t - 12, t - 1, 1, () => true))]; });
const lerpBand = x => {
  if (x <= refBand[0][0]) return refBand[0][1];
  for (let i = 1; i < refBand.length; i++) if (x <= refBand[i][0]) {
    const [xa, va] = refBand[i - 1], [xb, vb] = refBand[i];
    return va + (vb - va) * (x - xa) / (xb - xa);
  }
  return refBand[refBand.length - 1][1];
};
topRow(OURS).forEach((s, k) => { const t = Math.floor(s.top); targets.push([box(s.tx0, s.tx1, t - 12, t - 1, 1, onWall), lerpBand(s.cx), 1, `band${k}`]); });
// R1-02: the wall between neighbouring top-shelf sleeves, 2-42 px below their top edges in 10 px bands,
// against the mean of the reference's gaps.
const gaps = l => topRow(l).slice(1).map((s, k) => [topRow(l)[k], s]);
for (let b = 2; b < 42; b += 10) {
  const refPts = gaps(REF).flatMap(([a, c]) => box(a.tx1 + 3, c.tx0 - 3, Math.floor(a.top) + b, Math.floor(a.top) + b + 9, 1, () => true));
  targets.push([gaps(OURS).flatMap(([a, c]) => box(a.tx1 + 3, c.tx0 - 3, Math.floor(a.top) + b, Math.floor(a.top) + b + 9, 1, onWall)), refMean(refPts), 1, `gap${b}`]);
}
// R1-07: the top shelf's under-shadow, x 200-1240, rows 408-456 every 4 (same rows in both: the shelves
// stand at the same heights).
for (let y = 408; y <= 456; y += 4) targets.push([box(200, 1240, y, y, 1, onWall), refMean(box(200, 1240, y, y, 1, () => true)), 1, `under${y}`]);
// R1-08: the upper wall, clear of the sleeves in both layouts (y 108-195), in 60 px bins.
for (let y = 110; y <= 190; y += 20) for (let x = 0; x < W; x += 60) {
  const pts = box(x, x + 59, y - 2, y + 2, 2, onWall);
  if (pts.length) targets.push([pts, refMean(box(x, x + 59, y - 2, y + 2, 2, () => true)), 1, `upper${y}x${x}`]);
}
// R1-12: the column 18 px inside the shelf's left end (front corner), rows 300-396 every 8.
const endX = l => Math.round(l.shelfX0 + 18);
for (let y = 300; y <= 396; y += 8) targets.push([box(endX(OURS) - 1, endX(OURS) + 1, y - 1, y + 1, 1, onWall), refMean(box(endX(REF) - 1, endX(REF) + 1, y - 1, y + 1, 1, () => true)), 1, `end${y}`]);

// Each finding weighs the same whatever its number of terms.
const groupOf = label => label.replace(/\d.*$/, '');
const groupN = {};
targets.forEach(t => { groupN[groupOf(t[3])] = (groupN[groupOf(t[3])] || 0) + 1; });
// The query's 'skip' (comma-separated group names) drops those targets from the cost; they are still reported.
const SKIP = (q.get('skip') || '').split(',').filter(Boolean);
targets.forEach(t => { t[2] = SKIP.includes(groupOf(t[3])) ? 0 : 1 / groupN[groupOf(t[3])]; });

// Limits: wall pixels in the band above the sleeves and beside their upper corners (to 15 px below a
// sleeve's top edge; further down the reference's gaps pass 240), and the shelf-face rows at x 700-740.
const clipPts = [];
for (const s of OURS.sleeves) clipPts.push(...box(s.x0 - 60, s.x1 + 60, s.top - 40, s.top + 15));
const faceRows = OURS.faces.flatMap(([y0, y1]) => {
  const rows = [];
  for (let y = Math.floor(y0); y <= Math.ceil(y1); y++) {
    const pts = box(700, 740, y, y, 1, (x, yy) => cls[yy * W + x] === 1);
    if (pts.length > 30) rows.push(pts);
  }
  return rows;
});

// Anchor: every other wall and shelf pixel, outside the regions above.
const changing = (x, y) => {
  const t0 = Math.min(...topRow(OURS).map(s => s.top));
  if (y < 196) return true;                                                        // the upper wall (R1-08)
  if (y <= t0 + 40 && x >= OURS.sleeves[0].x0 - 30 && x <= topRow(OURS).at(-1).x1 + 30) return true;  // above and between the top sleeves (R1-02)
  const t1 = Math.min(...OURS.sleeves.filter(s => s.row === 1).map(s => s.top));
  if (y >= OURS.faces[0][1] - 2 && y <= t1 + 40 && x >= OURS.shelfX0 && x <= OURS.shelfX1) return true;  // R1-07, down past the lower sleeves' top edges
  if (y >= t0 + 40 && y <= OURS.faces[0][0] && x >= OURS.shelfX0 - 30 && x <= OURS.sleeves[0].x0 + 2) return true; // R1-12
  return OURS.faces.some(([y0]) => Math.abs(y - y0) <= 1.5);                    // the shelves' top front edge (R1-13)
};
const anchorPts = [];
for (let y = 108; y < 805; y += 2) for (let x = 2; x < W - 2; x += 2) {
  const k = cls[y * W + x];
  if (changing(x, y)) continue;
  if ((k === 0 && isWall(x, y)) || (k === 1 && !near(x, y, 1, 0) && !near(x, y, 3, 2))) anchorPts.push(x, y);
}

// Parameter vector <-> LIGHTS.
// The shelves keep the soft boxes' powers; the wall uses their visible fractions and its own base.
const KEYS = [
  ['key', 'rect', 0], ['key', 'rect', 1], ['key', 'rect', 2], ['key', 'rect', 3], ['key', 'z'], ['key', 'power'],
  ['fill', 'rect', 2], ['fill', 'rect', 1], ['fill', 'rect', 3], ['fill', 'z'], ['fill', 'power'],
  ['shelfAmbient'], ['shelfAlbedo'], ['contact', 'strength'], ['contact', 'reach'],
  ['halo', 'right'], ['halo', 'left'], ['halo', 'top'], ['halo', 'rise'], ['halo', 'fall'], ['halo', 'row2'], ['halo', 'vfall'], ['halo', 'drop'], ['halo', 'dropReach'], ['glow', 'strength'], ['glow', 'fall'], ['glow', 'side'], ['glow', 'fade'], ['glow', 'width'], ['edgeShade', 'strength'], ['edgeShade', 'reach'],
  ['keyMix'], ['base', 'centre'], ['base', 'edge'], ['base', 'cy'], ['base', 'rx'], ['base', 'ry'], ['base', 'pow'],
];
// The query's 'free' (comma-separated paths such as halo.drop, or group names such as halo) limits the fit to those.
const FREE = (q.get('free') || '').split(',').filter(Boolean);
const isFree = k => !FREE.length || FREE.some(f => k.join('.').startsWith(f));
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
// Starting steps, scaled by the query's 'step' (the anchor wants small first moves).
const STEP_SCALE = +(q.get('step') || 1);
const STEP = [300, 300, 300, 300, 300, 0.5, 1500, 1500, 1500, 400, 0.2, 0.05, 0.05, 0.1, 3, 0.1, 0.05, 0.03, 2, 20, 0.2, 5, 0.2, 8, 0.05, 30, 30, 10, 200, 0.1, 2, 0.1, 0.05, 0.05, 100, 200, 200, 0.3];

function valid(L) {
  const ok = l => l.rect[2] > l.rect[0] + 20 && l.rect[3] > l.rect[1] + 20 && l.z > 300 && l.power > 0;
  return ok(L.key) && ok(L.fill) && L.shelfAmbient >= 0 && L.shelfAlbedo > 0 && L.contact.strength >= 0 && L.contact.strength <= 1 && L.contact.reach > 0.5 && L.halo.right >= 0 && L.halo.left >= 0 && L.halo.top >= 0 && L.halo.rise > 0.3 && L.halo.fall > 2 && L.halo.row2 >= 0 && L.halo.vfall > 1 && L.halo.drop >= 0 && L.halo.drop <= 1 && L.halo.dropReach > 1 && L.glow.strength >= 0 && L.glow.fall > 2 && L.glow.side > 2 && L.glow.fade > 1 && L.glow.width > 100 && L.edgeShade.strength >= 0 && L.edgeShade.strength < 1 && L.edgeShade.reach > 0.5 && L.keyMix >= 0 && L.keyMix <= 1 && L.base.rx > 50 && L.base.ry > 50 && L.base.pow > 0.3 && L.base.pow < 8;
}
function render(L) {
  applyLights(u, L);
  wall.bake();
  renderer.render(scene, camera);
  return grab();
}
const ourMean = (px, pts) => { let t = 0; for (let j = 0; j < pts.length; j += 2) t += px[at(pts[j], pts[j + 1])]; return t / (pts.length / 2); };
let anchorRef = null;   // the shipped render's grey at each anchor point
// Weights (overridable from the query: wAnchor, wClip, wFace).
const W_ANCHOR = +(q.get('wAnchor') || 100), W_CLIP = +(q.get('wClip') || 0.05), W_FACE = +(q.get('wFace') || 20);
// The reference's wall peaks at 240 there; the limit leaves a little room under the proof's 245.
const LIMIT = 240, WALL_LIMIT = +(q.get('wallLimit') || 243);
function parts(px) {
  let ea = 0;
  // Beyond 2 levels (the tolerance) a pixel's change costs ten times as much again.
  let ex = 0;
  for (let j = 0; j < anchorPts.length; j += 2) {
    const d = px[at(anchorPts[j], anchorPts[j + 1])] - anchorRef[j / 2], o = Math.max(Math.abs(d) - 2, 0);
    ea += d * d; ex += o * o;
  }
  ea += 10 * ex;
  let et = 0;
  const res = targets.map(([pts, ref, w, label]) => { const d = ourMean(px, pts) - ref; et += w * d * d; return [label, d]; });
  let ec = 0, nClip = 0;
  for (let j = 0; j < clipPts.length; j += 2) { const d = px[at(clipPts[j], clipPts[j + 1])] - WALL_LIMIT; if (d > 0) { ec += d * d; nClip++; } }
  let ef = 0;
  for (const pts of faceRows) { const d = ourMean(px, pts) - LIMIT; if (d > 0) ef += d * d; }
  return { anchor: ea / (anchorPts.length / 2), targets: et, clip: ec, nClip, face: ef, res };
}
function cost(v) {
  const L = fromVec(v);
  if (!valid(L)) return 1e9;
  const p = parts(render(L));
  return W_ANCHOR * p.anchor + p.targets + W_CLIP * p.clip + W_FACE * p.face;
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
// The anchor holds the shipped lights' render (LIGHTS), whatever the fit starts from.
let startPx;
{
  const px = render(LIGHTS);
  startPx = px.slice();
  anchorRef = new Float32Array(anchorPts.length / 2);
  for (let j = 0; j < anchorPts.length; j += 2) anchorRef[j / 2] = px[at(anchorPts[j], anchorPts[j + 1])];
}
const report = L => {
  const p = parts(render(L)), g = {};
  p.res.forEach(([l, d]) => { const k = groupOf(l); g[k] = (g[k] || 0) + d * d / groupN[k]; });
  for (const k in g) g[k] = +Math.sqrt(g[k]).toFixed(2);
  return { anchor: +Math.sqrt(p.anchor).toFixed(2), rms: g, nClip: p.nClip, face: +p.face.toFixed(1), res: p.res.map(([l, d]) => `${l} ${d.toFixed(1)}`).join(', ') };
};
const before = report(fromVec(x0));
console.log('start', JSON.stringify(before));
const c0 = cost(x0);
let best = { x: x0, f: c0 };
// Restart once from the best point: Nelder-Mead stalls on a collapsed simplex.
for (let r = 0; r < 2 && iters > 0; r++) {
    const free = KEYS.map((k, j) => j).filter(j => isFree(KEYS[j]));
  const expand = z => { const x = best.x.slice(); free.forEach((j, n) => { x[j] = z[n]; }); return x; };
  const res = nelderMead(z => cost(expand(z)), free.map(j => best.x[j]), free.map(j => STEP[j] * STEP_SCALE / (r + 1)), iters);
  if (res.f < best.f) best = { x: expand(res.x), f: res.f };
}
const L = fromVec(best.x);
const round = o => JSON.parse(JSON.stringify(o, (k, v) => (typeof v === 'number' ? +v.toFixed(3) : v)));
const after = report(L);
// Change map: fitted - shipped render, grey, on wall and shelf pixels (mid grey = equal, +-40 full scale).
const px = render(L);
const diff = new ImageData(W, H);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const k = cls[y * W + x], o = (y * W + x) * 4;
  if (k === 2) { diff.data[o] = 0; diff.data[o + 1] = 0; diff.data[o + 2] = 90; diff.data[o + 3] = 255; continue; }
  const d = px[at(x, y)] - startPx[at(x, y)];
  const g = Math.max(0, Math.min(255, 128 + d * 3.2));
  diff.data[o] = g; diff.data[o + 1] = g; diff.data[o + 2] = g; diff.data[o + 3] = 255;
}
const dc = document.createElement('canvas'); dc.width = W; dc.height = H;
dc.getContext('2d').putImageData(diff, 0, 0);
window.fitResult = { start: c0, cost: best.f, before, after, lights: round(L), anchorPts: anchorPts.length / 2, clipPts: clipPts.length / 2, diff: dc.toDataURL('image/png'), ours: canvas.toDataURL('image/png') };
