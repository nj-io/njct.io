// njct.io Editions: the shelf wall. Wave 1 scene: shelves, studio light, soft shadows, the intro drop,
// hover lift, header and bottom index. Renders only while something moves.
import * as THREE from 'three';
import { RoomEnvironment } from '/vendor/three-0.181.0/addons/environments/RoomEnvironment.js';
import { CAMERA_Z, SHELF, SLEEVE, INTRO, viewScale } from './scene/config.js';
import { createLightUniforms, applyLights } from './scene/lighting.js';
import { createWall } from './scene/wall.js';
import { createShelves } from './scene/shelves.js';
import { createSleeves, applyPose, writeOccluders, setCover, restPose } from './scene/sleeves.js';
import { introPose, stepHover, HOVER_DELAY } from './scene/motion.js';
import { createAudio } from './audio/audio.js';

const entries = await fetch(new URL('./data/projects.json', import.meta.url)).then(r => r.json());

// ---- renderer, light, scene ---------------------------------------------------------------------
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.outputColorSpace = THREE.SRGBColorSpace;
// Khronos PBR Neutral keeps a dielectric's base colour 1:1 under unit white light (it removes the 4%
// specular floor) and only rolls off highlights, so the flat cover colours stay true.
renderer.toneMapping = THREE.NeutralToneMapping;

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
// RoomEnvironment lights a card facing the camera at about 2.3x unit irradiance; this brings a flat
// cover's base colour back to itself under the Neutral tone mapper.
scene.environmentIntensity = 0.46;
pmrem.dispose();

const uniforms = createLightUniforms();
applyLights(uniforms);
SHELF.tops.forEach((top, r) => uniforms.uShelf.value[r].set(-SHELF.width / 2, SHELF.width / 2, top - SHELF.thick, top));
uniforms.uShelfDepth.value = SHELF.depth;

const wall = createWall(renderer, uniforms);
scene.add(wall.mesh);
for (const m of createShelves(uniforms)) scene.add(m);
const sleeves = createSleeves(entries);
for (const s of sleeves) scene.add(s.mesh);

const camera = new THREE.PerspectiveCamera(20, 1, 100, CAMERA_Z * 2);
camera.position.set(0, 0, CAMERA_Z);

// ---- DOM: pills, index, header --------------------------------------------------------------------
const slotsEl = document.getElementById('slots');
const slots = sleeves.map(s => {
  const el = document.createElement('div');
  el.className = 'slot';
  for (const [action, label] of [['open', 'Open'], ['details', 'Details']]) {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.action = action;
    b.dataset.index = String(s.i);
    b.textContent = label;
    b.setAttribute('aria-label', `${label}: ${entries[s.i].name}`);
    el.appendChild(b);
  }
  slotsEl.appendChild(el);
  return el;
});
document.getElementById('index').append(...entries.map(e => {
  const li = document.createElement('li');
  const y = document.createElement('span'); y.className = 'y'; y.textContent = e.year || '';
  const n = document.createElement('span'); n.className = 'n'; n.textContent = e.name;
  li.append(y, n);
  return li;
}));

// ---- layout ---------------------------------------------------------------------------------------
let W = 0, H = 0, S = 1;
function layout() {
  W = window.innerWidth; H = window.innerHeight; S = viewScale(W, H);
  const hw = W / 2 / S, hh = H / 2 / S;
  camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(hh / CAMERA_Z));
  camera.aspect = W / H;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W, H, false);
  wall.resize(-hw * 1.02, -hh * 1.02, hw * 1.02, hh * 1.02, Math.ceil(W / 2), Math.ceil(H / 2));
  bakeDirty = true;
  hitRects = sleeves.map(s => restRect(s));
  sleeves.forEach(placeSlot);
  wake();
}

const v = new THREE.Vector3(), box = new THREE.Box3();
function project(x, y, z) {
  v.set(x, y, z).project(camera);
  return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H };
}
function sleeveRect(i) {
  const m = sleeves[i].mesh;
  if (!m.geometry.boundingBox) m.geometry.computeBoundingBox();
  box.copy(m.geometry.boundingBox).applyMatrix4(m.matrixWorld);
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) {
    const p = project(x, y, z);
    x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y);
  }
  return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
}
// Hit area: the rest pose plus the space the lifted sleeve occupies, so hovering never flickers.
let hitRects = [];
function restRect(s) {
  const L = SLEEVE.size, sh = s.shelfY;
  const a = project(s.x - L / 2, sh + SLEEVE.hoverLift + L, SLEEVE.hoverZ);
  const b = project(s.x + L / 2, sh, 0);
  return { x0: a.x, y0: a.y, x1: b.x, y1: b.y };
}

// Pills sit on the sleeve's lower left, inset in proportion to its size on screen.
const corner = new THREE.Vector3();
function placeSlot(s) {
  corner.set(-SLEEVE.size / 2, 0, SLEEVE.thick).applyMatrix4(s.mesh.matrixWorld);
  const bl = project(corner.x, corner.y, corner.z);
  corner.set(SLEEVE.size / 2, 0, SLEEVE.thick).applyMatrix4(s.mesh.matrixWorld);
  const br = project(corner.x, corner.y, corner.z);
  const w = br.x - bl.x;
  // Snapped to device pixels so the pill text stays crisp while the sleeve moves.
  const d = renderer.getPixelRatio(), snap = n => Math.round(n * d) / d;
  slots[s.i].style.transform = `translate3d(${snap(bl.x + w * 0.1175)}px, ${snap(bl.y - w * 0.025 - 32)}px, 0)`;
}

// ---- motion and render loop -----------------------------------------------------------------------
let raf = 0, last = 0, bakeDirty = true, introStart = null, hovered = -1, lifted = -1, hoverAt = 0;
const settled = sleeves.map(() => false);  // intro finished for this sleeve
const firstFrame = {};
firstFrame.ready = new Promise(r => { firstFrame.resolve = r; });

function wake() { if (!raf) raf = requestAnimationFrame(frame); }

function frame(now) {
  raf = 0;
  const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
  last = now;
  let active = false;
  const t = introStart === null ? -1 : now - introStart;
  if (lifted !== hovered && now - hoverAt >= HOVER_DELAY) lifted = hovered;
  const waiting = lifted !== hovered;
  for (const s of sleeves) {
    let moved = false;
    if (!settled[s.i]) {
      const p = t < 0 ? { ...restPose(), opacity: 0 } : introPose(s.i, t);
      if (p) s.pose = p; else { s.pose = restPose(); settled[s.i] = true; }
      moved = true;
      active = active || !settled[s.i] || t < 0;
    } else {
      moved = stepHover(s, lifted === s.i, dt);
      active = active || moved;
    }
    if (moved) { applyPose(s); placeSlot(s); bakeDirty = true; }
  }
  if (bakeDirty) { writeOccluders(sleeves, uniforms); wall.bake(); bakeDirty = false; }
  renderer.render(scene, camera);

  if (hooks.firstFrameAt === null) {
    // The intro clock starts when the first frame is done, not at this frame's (earlier) rAF time.
    hooks.firstFrameAt = performance.now();
    startIntro(hooks.firstFrameAt);
    firstFrame.resolve();
    active = true;
  }
  if (active || waiting) wake(); else last = 0;
}

// ---- intro: canvas fade, header rise, late fade ---------------------------------------------------
// The header and late items approach exactly as the reference does (exponential, time constant tau),
// written as a CSS linear() curve where supported.
function expEasing(tauOverDur) {
  if (!CSS.supports('animation-timing-function', 'linear(0, 1)')) return 'cubic-bezier(0.16, 1, 0.3, 1)';
  const n = 24, pts = [];
  const norm = 1 - Math.exp(-1 / tauOverDur);
  for (let k = 0; k <= n; k++) pts.push(((1 - Math.exp(-(k / n) / tauOverDur)) / norm).toFixed(4));
  return `linear(${pts.join(', ')})`;
}
function startIntro(now) {
  introStart = now;
  canvas.animate([{ opacity: 0 }, { opacity: 1 }], { duration: INTRO.canvasFade.dur, easing: INTRO.canvasFade.ease, fill: 'forwards' });
  const H = INTRO.header, dur = H.tau * 5;
  document.querySelectorAll('.rise').forEach((el, k) => el.animate(
    [{ opacity: 0, transform: `translateY(${-H.rise}px)` }, { opacity: 1, transform: 'none' }],
    { duration: dur, delay: H.at + H.stagger * k, easing: expEasing(0.2), fill: 'forwards' }));
  const late = INTRO.late;
  document.querySelectorAll('.late').forEach(el => el.animate(
    [{ opacity: 0 }, { opacity: 1 }], { duration: late.tau * 5, delay: late.at, easing: expEasing(0.2), fill: 'forwards' }));
}

// ---- hover, sound ---------------------------------------------------------------------------------
const audio = createAudio();
const unlock = () => audio.unlock();
window.addEventListener('pointerdown', unlock, { once: true, capture: true });
window.addEventListener('keydown', unlock, { once: true, capture: true });
const soundBtn = document.querySelector('.sound');
const syncSound = () => {
  soundBtn.setAttribute('aria-pressed', String(audio.enabled));
  soundBtn.setAttribute('aria-label', audio.enabled ? 'Sound on' : 'Sound off');
};
soundBtn.addEventListener('click', () => { audio.setEnabled(!audio.enabled); syncSound(); });
syncSound();

function setHovered(i) {
  if (i === hovered) return;
  if (hovered >= 0) slots[hovered].classList.remove('hot');
  hovered = i;
  hoverAt = performance.now();
  canvas.style.cursor = i >= 0 ? 'pointer' : '';
  if (i >= 0) {
    slots[i].classList.add('hot');
    const pan = Math.max(-1, Math.min(1, sleeves[i].x / 600));
    audio.play('hover', { pan });
    audio.play('lift', { pan, intensity: 0.8 });
  }
  wake();
}
window.addEventListener('pointermove', e => {
  if (e.pointerType === 'touch') return;
  let hit = -1;
  hitRects.forEach((r, i) => {
    if (settled[i] && e.clientX >= r.x0 && e.clientX <= r.x1 && e.clientY >= r.y0 && e.clientY <= r.y1) hit = i;
  });
  setHovered(hit);
});
document.documentElement.addEventListener('pointerleave', () => setHovered(-1));
window.addEventListener('blur', () => setHovered(-1));
window.addEventListener('resize', layout);

// ---- test hooks -----------------------------------------------------------------------------------
const hooks = {
  count: sleeves.length,
  firstFrameAt: null,
  ready: firstFrame.ready,
  sleeveRect,
  setCover(i, front, back) { setCover(sleeves[i], front, back); wake(); },
};
window.__editions = hooks;

layout();
// Compile every program before the first frame (the sleeves are hidden until they land), so nothing
// compiles mid-intro.
for (const s of sleeves) s.mesh.visible = true;
renderer.compile(scene, camera);
for (const s of sleeves) applyPose(s);
