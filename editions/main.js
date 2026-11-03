// njct.io Editions: the shelf wall. Shelves, studio light and soft shadows; the intro drop; hover, with
// the record peeking out of the sleeve; Details (the sleeve flies forward over the blurred shelf, Space
// flips it to its back cover, Escape puts it back); keyboard; sound. Renders only while something moves.
import * as THREE from 'three';
import { RoomEnvironment } from '/vendor/three-0.181.0/addons/environments/RoomEnvironment.js';
import { CAMERA_Z, REF_H, SHELF, SLEEVE, INTRO, DETAILS, OPEN, viewScale } from './scene/config.js';
import { createLightUniforms, applyLights } from './scene/lighting.js';
import { createWall } from './scene/wall.js';
import { createShelves } from './scene/shelves.js';
import { createSleeves, applyPose, writeOccluders, setCover, restPose, hoverPose, COVER_BIAS } from './scene/sleeves.js';
import { introPose, stepHover, fallPose, HOVER_DELAY, bezier, lerpPose, clamp01, dur, delay, setReducedMotion } from './scene/motion.js';
import { createPost } from './scene/post.js';
import { createSticker } from './scene/sticker.js';
import { createCover } from './covers/covers.js';

const entries = await fetch(new URL('./data/projects.json', import.meta.url)).then(r => r.json());

// ---- renderer, light, scene ---------------------------------------------------------------------
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.outputColorSpace = THREE.SRGBColorSpace;
// The sleeve shaders apply Khronos PBR Neutral themselves (scene/tonemap.js), so the shelf looks the same
// drawn to the screen or into the Details background target; wall and shelves are lit in display terms.
renderer.toneMapping = THREE.NoToneMapping;

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
COVER_BIAS.value = window.__editionsTest?.coverBias ?? -0.5;   // a test can set the cover mip bias before load
// Placeholder maps, so the covers arriving later swap a texture instead of compiling a new program.
const blank = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
blank.colorSpace = THREE.SRGBColorSpace;
blank.needsUpdate = true;
for (const s of sleeves) {
  s.front.map = blank; s.back.map = blank;
  scene.add(s.mesh, s.record.mesh);
}
// Details: the sleeve in focus draws on its own layer, over the blurred shelf.
const FOCUS = 1;
const sticker = createSticker('Now playing');
sticker.mesh.layers.set(FOCUS);
scene.add(sticker.mesh);
const post = createPost(renderer);

const camera = new THREE.PerspectiveCamera(20, 1, 100, CAMERA_Z * 2);
camera.position.set(0, 0, CAMERA_Z);

// ---- covers -------------------------------------------------------------------------------------
// Covers come only through createCover (editions/covers/): a 1024 front (Details shows it at about 830
// device px) and no shelf back (backs face the wall); the back renders at 1024 when its sleeve enters
// Details. A cover that fails to build leaves its sleeve plain, in the entry's accent colour or neutral
// grey. The sleeves wait for the covers, at most 3 s.
const covers = sleeves.map(() => null);
const build = (s, i, opts) => Promise.resolve().then(() => createCover(renderer, s.entry, i, opts));
const coversReady = Promise.all(sleeves.map((s, i) => build(s, i, { size: 1024, backSize: 0 })
  .then(c => { covers[i] = c; setCover(s, c.front, null); wake(); })
  .catch(e => console.warn(`cover ${s.entry.name}: plain sleeve (${e?.message || e})`))));
let coversAt = null;
Promise.race([coversReady, new Promise(r => setTimeout(r, 3000))]).then(() => {
  coversAt = performance.now();
  if (introStart !== null) sleevesStart = Math.max(introStart, coversAt - INTRO.appear.at);
  wake();
});
// The cover module keeps the last two Details backs and renders an evicted one again on request, so the
// sleeve asks on every entry, and gives its back up (to the placeholder) when it leaves Details.
function backFor(i) {
  const s = sleeves[i];
  covers[i]?.detailBack(1024).then(tex => {
    if (det && det.i === i) { s.back.map = tex || blank; s.back.color.set(tex ? 0xffffff : BACK_PLAIN); s.back.needsUpdate = true; wake(); }
  }).catch(e => console.warn(`cover ${s.entry.name}: no Details back (${e?.message || e})`));
}
const BACK_PLAIN = 0xe9e6e0;   // the back's card colour in sleeves.js
function releaseBack(s) { if (s.back.map !== blank) { s.back.map = blank; s.back.color.set(BACK_PLAIN); s.back.needsUpdate = true; } }

// The cover under the pointer (or in Details) animates; at most one at a time. A released cover keeps
// easing to a stop for about 1.6 s.
let aliveIdx = -1, aliveUntil = 0;
function setAlive(i) {
  if (i === aliveIdx) return;
  if (aliveIdx >= 0) { covers[aliveIdx]?.setAlive(false); aliveUntil = performance.now() + 1700; }
  aliveIdx = i;
  if (i >= 0) covers[i]?.setAlive(true);
}

// ---- sound --------------------------------------------------------------------------------------
// The sound engine loads with the visitor's first pointer move or key, which keeps it out of the first
// view; it is muted until the toggle is pressed.
let audio = null, audioP = null;
const soundBtn = document.querySelector('.sound');
function syncSound() {
  const on = !!audio?.enabled;
  soundBtn.setAttribute('aria-pressed', String(on));
  soundBtn.setAttribute('aria-label', on ? 'Sound on' : 'Sound off');
}
function loadAudio() {
  if (!audioP) audioP = import('./audio/audio.js').then(m => {
    audio = m.createAudio();
    audio.setRoomTone(true);
    syncSound();
    return audio;
  });
  return audioP;
}
const play = (name, opts) => {
  window.__editions?.soundLog?.push([name, Math.round(performance.now())]);   // set by tests
  audio?.play(name, opts);
};
const panOf = i => Math.max(-1, Math.min(1, sleeves[i].x / 600));
for (const ev of ['pointermove', 'pointerdown', 'keydown', 'touchstart']) {
  window.addEventListener(ev, loadAudio, { once: true, capture: true, passive: true });
}
const unlock = () => { if (audio) audio.unlock(); else loadAudio().then(a => a.unlock()); };
window.addEventListener('pointerdown', unlock, { once: true, capture: true });
window.addEventListener('keydown', unlock, { once: true, capture: true });
soundBtn.addEventListener('click', async () => {
  const a = audio || await loadAudio();
  a.setEnabled(!a.enabled);
  syncSound();
});
syncSound();

// ---- DOM: pills, index, header, Details -----------------------------------------------------------
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
const tagline = document.querySelector('.tagline');
const detailsEl = document.getElementById('details');
const dTitle = detailsEl.querySelector('.d-title');
const dTag = detailsEl.querySelector('.d-tag');
const dOpen = document.getElementById('d-open');

// Opacity fades that start from wherever the element is now.
function fade(el, to, at, ms) {
  const from = +getComputedStyle(el).opacity;
  for (const a of el.getAnimations()) a.cancel();
  el.animate([{ opacity: from }, { opacity: to }], { duration: dur(ms), delay: delay(at), easing: 'ease', fill: 'both' });
}

// ---- layout ---------------------------------------------------------------------------------------
let W = 0, H = 0, S = 1;
const dbSize = new THREE.Vector2();
function layout() {
  W = window.innerWidth; H = window.innerHeight; S = viewScale(W, H);
  const hw = W / 2 / S, hh = H / 2 / S;
  camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(hh / CAMERA_Z));
  camera.aspect = W / H;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W, H, false);
  renderer.getDrawingBufferSize(dbSize);
  post.resize(dbSize.x, dbSize.y);
  wall.resize(-hw * 1.02, -hh * 1.02, hw * 1.02, hh * 1.02, Math.ceil(W / 2), Math.ceil(H / 2));
  bakeDirty = bgDirty = true;
  hitRects = sleeves.map(s => restRect(s));
  sleeves.forEach(placeSlot);
  placeDetails();
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
function hitAt(x, y) {
  let hit = -1;
  hitRects.forEach((r, i) => { if (settled[i] && x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1) hit = i; });
  return hit;
}

// Pills sit on the sleeve's lower left, inset in proportion to its size on screen.
const corner = new THREE.Vector3();
const snap = n => { const d = renderer.getPixelRatio(); return Math.round(n * d) / d; };   // crisp text while moving
function placeSlot(s) {
  corner.set(-SLEEVE.size / 2, 0, SLEEVE.thick).applyMatrix4(s.mesh.matrixWorld);
  const bl = project(corner.x, corner.y, corner.z);
  corner.set(SLEEVE.size / 2, 0, SLEEVE.thick).applyMatrix4(s.mesh.matrixWorld);
  const br = project(corner.x, corner.y, corner.z);
  const w = br.x - bl.x;
  slots[s.i].style.transform = `translate3d(${snap(bl.x + w * 0.1175)}px, ${snap(bl.y - w * 0.025 - 32)}px, 0)`;
}

// Details: where the sleeve flies (its centre DETAILS.size px wide, 14.5 px above the view centre at
// 1440x900, both scaled with the view), and the text beside it.
const DZ = CAMERA_Z * (1 - SLEEVE.size / DETAILS.size);            // depth of the sleeve's centre
const DY = (REF_H / 2 - DETAILS.centreY) * (CAMERA_Z - DZ) / CAMERA_Z;
function detailsPose(s) {
  return { ...restPose(), lean: 0, dx: -s.x, lift: DY - SLEEVE.size / 2 - s.shelfY, z: DZ - SLEEVE.thick / 2 };
}
function placeDetails() {
  const cy = H / 2 - (REF_H / 2 - DETAILS.centreY) * S;
  // Title cap top 386.5 and baseline 404, tagline first baseline 436, at 1440x900 (Inter's line boxes).
  dTitle.style.top = `${snap(cy - 54.2)}px`;
  dTag.style.top = `${snap(cy - 13.6)}px`;
  dOpen.style.top = `${snap(cy + DETAILS.size / 2 * S + 16)}px`;
}

// ---- state ----------------------------------------------------------------------------------------
let raf = 0, last = 0, bakeDirty = true, bgDirty = true, introStart = null, sleevesStart = null;
let hovered = -1, lifted = -1, hoverAt = 0, det = null, lastSigma = -1;
const settled = sleeves.map(() => false);  // intro finished for this sleeve
const pointer = { x: -1, y: -1 };
const firstFrame = {};
firstFrame.ready = new Promise(r => { firstFrame.resolve = r; });

function wake() { if (!raf) raf = requestAnimationFrame(frame); }

// The flight eases on screen, as measured: the sleeve's size and position on screen follow the curve
// (moving its depth linearly would make it grow late and shrink early, by perspective).
function centreOf(s, p) {
  const L = SLEEVE.size, T = SLEEVE.thick;
  return { x: s.x + p.dx, y: s.shelfY + p.lift + L / 2 * Math.cos(p.lean), z: p.z - L / 2 * Math.sin(p.lean) + T / 2 };
}
function flight(s, a, b, e) {
  const p = lerpPose(a, b, e), L = SLEEVE.size;
  const ca = centreOf(s, a), cb = centreOf(s, b);
  const ka = CAMERA_Z / (CAMERA_Z - ca.z), kb = CAMERA_Z / (CAMERA_Z - cb.z), k = ka + (kb - ka) * e;
  const x = (ca.x * ka + (cb.x * kb - ca.x * ka) * e) / k, y = (ca.y * ka + (cb.y * kb - ca.y * ka) * e) / k;
  p.dx = x - s.x;
  p.lift = y - s.shelfY - L / 2 * Math.cos(p.lean);
  p.z = CAMERA_Z * (1 - 1 / k) + L / 2 * Math.sin(p.lean) - SLEEVE.thick / 2;
  return p;
}
const easeOut = u => 1 - (1 - u) ** 3;
const smooth = u => u * u * (3 - 2 * u);
const TURN = Math.PI * 2;

// Details pose of the sleeve in focus at time now (the flight in or out, the flip, the record).
function stepDetails(s, now) {
  const F = DETAILS.fly, R = DETAILS.record, X = DETAILS.exit, P = DETAILS.flip;
  const yawAt = () => det.flip.from + (det.flip.to - det.flip.from) * bezier(P.ease, clamp01((now - det.flip.t0 - delay(P.at)) / dur(P.dur)));
  let p, moving;
  if (!det.exit) {
    const t = now - det.t0;
    const e = bezier(F.ease, clamp01((t - delay(F.at)) / dur(F.dur)));
    p = flight(s, det.from, detailsPose(s), e);
    p.yaw = yawAt();
    // The hover peek goes back in during the flight; then the record slides out to the right, and
    // slips back in while the sleeve shows its back.
    const slide = easeOut(clamp01((t - delay(R.at)) / dur(R.dur)));
    if (slide > 0) {
      if (!det.slid) { det.slid = true; play('slide', { pan: 0.3, intensity: 0.7 }); }
      p.recX = 1; p.recY = 0; p.rec = R.out * slide * (1 + Math.cos(p.yaw)) / 2;
    } else {
      p.recX = det.from.recX; p.recY = det.from.recY; p.rec = det.from.rec * (1 - e);
    }
    det.blur = smooth(clamp01((t - delay(DETAILS.blur.at)) / dur(DETAILS.blur.dur)));
    det.sticker = clamp01((t - delay(DETAILS.title.at)) / dur(DETAILS.title.dur));
    const end = Math.max(...[F, R, DETAILS.blur, DETAILS.title].map(k => delay(k.at) + dur(k.dur)));
    moving = t < end || now - det.flip.t0 < delay(P.at) + dur(P.dur);
  } else {
    // Back to the hover pose on the shelf, turning the rest of the way round if it was flipped.
    const x = det.exit, t = now - x.t0;
    const e = bezier(X.ease, clamp01((t - delay(X.at)) / dur(X.dur)));
    p = flight(s, x.from, { ...hoverPose(), yaw: x.yawTo }, e);
    p.yaw = x.from.yaw + (x.yawTo - x.from.yaw) * bezier(X.turn.ease, clamp01((t - delay(X.turn.at)) / dur(X.turn.dur)));
    if (e < 0.5) { p.recX = x.from.recX; p.recY = x.from.recY; p.rec = x.from.rec * (1 - e * 2); }
    else { p.recX = 0; p.recY = 1; p.rec = SLEEVE.hoverRecord * (e - 0.5) * 2; }
    det.blur = x.blur * (1 - smooth(clamp01((t - delay(X.blurOut.at)) / dur(X.blurOut.dur))));
    det.sticker = x.sticker * (1 - clamp01((t - delay(X.at)) / dur(X.textOut)));
    moving = t < delay(X.at) + dur(X.dur) || det.blur > 0;
    if (!moving) { endDetails(s, now); return true; }
  }
  s.pose = p;
  return moving;
}

function frame(now) {
  raf = 0;
  if (inProject >= 0) { last = 0; return; }   // a page is open: the shelf holds still and draws nothing
  const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
  last = now;
  let active = false;
  const ti = sleevesStart === null ? -1 : now - sleevesStart;
  const want = det ? -1 : hovered;
  if (lifted !== want && (det || now - hoverAt >= delay(HOVER_DELAY))) {
    if (lifted >= 0 && !(det && det.i === lifted)) sleeves[lifted].fall = { from: { ...sleeves[lifted].pose }, t0: hoverAt };
    lifted = want;
    if (lifted >= 0) { sleeves[lifted].fall = null; sleeves[lifted].record.loadLabel().then(wake); }
  }
  setAlive(det ? det.i : lifted);
  const waiting = lifted !== want;
  for (const s of sleeves) {
    let moved = false;
    if (det && s.i === det.i) {
      moved = stepDetails(s, now);
    } else if (!settled[s.i]) {
      if (ti >= 0) {   // hidden until the covers are in
        const p = introPose(s.i, ti);
        if (p) s.pose = p; else { s.pose = restPose(); settled[s.i] = true; }
        moved = true;
      }
    } else if (lifted === s.i) {
      moved = stepHover(s, dt);
    } else if (s.fall) {
      const p = fallPose(s.fall.from, now - s.fall.t0);
      if (p) s.pose = p; else { s.pose = restPose(); s.fall = null; }
      moved = true;
    }
    if (moved) {
      applyPose(s); placeSlot(s);
      // A sleeve shades the wall until it is well clear of it (Details flies it out of range).
      const shades = s.pose.z < 270;
      if (shades || s.shaded) bakeDirty = true;
      s.shaded = shades;
      if (!det || s.i !== det.i) bgDirty = true;
      active = true;
    }
  }
  if (bakeDirty) { writeOccluders(sleeves, uniforms); wall.bake(); bakeDirty = false; bgDirty = true; }
  const alive = aliveIdx >= 0 || now < aliveUntil;
  if (alive) for (const c of covers) c?.update(dt);

  if (det) {
    const s = sleeves[det.i];
    sticker.place(s, det.sticker);
    const sigma = DETAILS.blur.sigma * det.blur;
    if (bgDirty || sigma !== lastSigma) {
      camera.layers.set(0);
      post.background(scene, camera, sigma);
      bgDirty = false; lastSigma = sigma;
    }
    post.composite(Math.min(1, det.blur * 4));
    camera.layers.set(FOCUS);
    renderer.autoClear = false;
    renderer.clearDepth();
    renderer.render(scene, camera);
    renderer.autoClear = true;
    camera.layers.set(0);
  } else {
    renderer.render(scene, camera);
  }

  if (hooks.firstFrameAt === null) {
    // The intro clock starts when the first frame is done, not at this frame's (earlier) rAF time.
    hooks.firstFrameAt = performance.now();
    startIntro(hooks.firstFrameAt);
    firstFrame.resolve();
    active = true;
  }
  if (active || waiting || alive) wake(); else last = 0;
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
  if (coversAt !== null) sleevesStart = now;
  canvas.animate([{ opacity: 0 }, { opacity: 1 }], { duration: dur(INTRO.canvasFade.dur), easing: INTRO.canvasFade.ease, fill: 'forwards' });
  const H = INTRO.header, d = dur(H.tau * 5);
  document.querySelectorAll('.rise').forEach((el, k) => el.animate(
    [{ opacity: 0, transform: `translateY(${-H.rise}px)` }, { opacity: 1, transform: 'none' }],
    { duration: d, delay: delay(H.at + H.stagger * k), easing: expEasing(0.2), fill: 'forwards' }));
  const late = INTRO.late;
  document.querySelectorAll('.late').forEach(el => el.animate(
    [{ opacity: 0 }, { opacity: 1 }], { duration: dur(late.tau * 5), delay: delay(late.at), easing: expEasing(0.2), fill: 'forwards' }));
}

// ---- hover ----------------------------------------------------------------------------------------
function syncHot() {
  const want = det ? -1 : hovered;
  slots.forEach((el, i) => el.classList.toggle('hot', i === want));
  canvas.style.cursor = det ? (overFocus() ? 'pointer' : '') : (hovered >= 0 ? 'pointer' : '');
}
function setHovered(i, byKey = false) {
  if (i === hovered) return;
  hovered = i;
  hoverAt = performance.now();
  syncHot();
  if (i >= 0 && !det) {
    if (!byKey) play('hover', { pan: panOf(i) });   // the keyboard's own sound is the tick
    play('lift', { pan: panOf(i), intensity: 0.8 });
  }
  wake();
}
function overFocus() {
  if (!det) return false;
  const r = sleeveRect(det.i);
  return pointer.x >= r.x && pointer.x <= r.x + r.width && pointer.y >= r.y && pointer.y <= r.y + r.height;
}
let pointerHit = -1;   // keyboard focus moves the hover too; the pointer takes it back when it moves to another sleeve
window.addEventListener('pointermove', e => {
  if (e.pointerType === 'touch') return;
  pointer.x = e.clientX; pointer.y = e.clientY;
  if (det) { syncHot(); return; }
  const hit = hitAt(e.clientX, e.clientY);
  if (hit !== pointerHit) { pointerHit = hit; setHovered(hit); }
});
document.documentElement.addEventListener('pointerleave', () => { pointerHit = -1; setHovered(-1); });
window.addEventListener('blur', () => { pointerHit = -1; setHovered(-1); });
window.addEventListener('resize', layout);

// A click on a sleeve opens its Details; in Details, a click on the sleeve flips it and a click on the
// ground puts it back.
canvas.addEventListener('click', e => {
  pointer.x = e.clientX; pointer.y = e.clientY;
  if (det) { if (det.exit) return; if (overFocus()) flip(); else closeDetails(); return; }
  const hit = hitAt(e.clientX, e.clientY);
  if (hit >= 0) openDetails(hit);
});

// ---- Details --------------------------------------------------------------------------------------
function openDetails(i) {
  if (det || !settled[i]) return;
  const s = sleeves[i], now = performance.now();
  s.fall = null;
  const ret = slotOf(document.activeElement) === i ? document.activeElement : null;   // focus comes back here
  det = { i, t0: now, from: { ...s.pose }, flip: { from: 0, to: 0, t0: -1e9 }, exit: null, blur: 0, sticker: 0, slid: false, ret };
  for (const o of [s.mesh, s.record.mesh]) o.layers.set(FOCUS);
  bgDirty = true;
  s.record.loadLabel().then(wake);
  backFor(i);
  dTitle.textContent = s.entry.name;
  dTag.textContent = s.entry.tag;
  dOpen.dataset.index = String(i);
  dOpen.setAttribute('aria-label', `Open: ${s.entry.name}`);
  detailsEl.inert = false; dOpen.inert = false; slotsEl.inert = true;
  document.body.classList.add('in-details');
  const D = DETAILS;
  fade(tagline, 0, D.headerOut.at, D.headerOut.dur);
  for (const el of [dTitle, dTag]) fade(el, 1, D.title.at, D.title.dur);
  fade(dOpen, 1, D.open.at, D.open.dur);
  detailsEl.focus({ preventScroll: true });   // Tab reaches Open; Space stays the flip
  play('details', { pan: panOf(i) });
  syncHot();
  wake();
}

function flip() {
  if (!det || det.exit) return;
  const now = performance.now(), P = DETAILS.flip, f = det.flip;
  const yaw = f.from + (f.to - f.from) * bezier(P.ease, clamp01((now - f.t0 - delay(P.at)) / dur(P.dur)));
  det.flip = { from: yaw, to: f.to + Math.PI, t0: now };
  play('flip');
  wake();
}

function closeDetails() {
  if (!det || det.exit) return;
  const s = sleeves[det.i], now = performance.now(), X = DETAILS.exit;
  det.exit = { t0: now, from: { ...s.pose }, yawTo: Math.ceil(s.pose.yaw / TURN - 1e-6) * TURN, blur: det.blur, sticker: det.sticker };
  for (const el of [dTitle, dTag, dOpen]) fade(el, 0, X.at, X.textOut);
  fade(tagline, 1, X.headerIn.at, X.headerIn.dur);
  detailsEl.inert = true; dOpen.inert = true;
  play('close', { pan: panOf(det.i) });
  wake();
}

function endDetails(s, now) {
  const { i, ret } = det;
  det = null;
  releaseBack(s);
  s.pose = hoverPose();
  applyPose(s);
  for (const o of [s.mesh, s.record.mesh]) o.layers.set(0);
  sticker.mesh.visible = false;
  bgDirty = bakeDirty = true;
  slotsEl.inert = false;
  document.body.classList.remove('in-details');
  // The sleeve lands lifted; it stays up if the pointer (or the keyboard focus, returned to the pill
  // that opened Details) is on it.
  pointerHit = hitAt(pointer.x, pointer.y);
  hovered = pointerHit;
  hoverAt = now;
  if (ret && ret.isConnected) ret.focus({ preventScroll: true });   // focusin lifts sleeve i
  lifted = hovered === i ? i : -1;
  if (lifted !== i) s.fall = { from: hoverPose(), t0: now };
  placeSlot(s);
  syncHot();
}

// ---- Open: a project's page, by hash route (#mirra, #social-hook, #about) -------------------------
// Open sets the hash; the route opens the page, so deep links and the browser's Back work the same way.
// The page module loads on demand; the shelf stops drawing while a page is open and the page's world
// draws on the same canvas.
const slugOf = e => (e.kind === 'about' ? 'about' : e.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
let view = null, viewP = null, inProject = -1, openedFromShelf = false, cutAfter = 0;
const loadView = () => viewP || (viewP = import('./project/project.js').then(m => (view = m.createProjectView({
  renderer, entries, slugOf, onBack: backToShelf,
}))));

function openProject(i) {
  play('open', { pan: det ? 0 : panOf(i) });
  loadView();   // start loading now; the route waits for it
  if (entries[i].kind !== 'about') import('./project/project.js').then(m => m.loadDossier(slugOf(entries[i])));
  openedFromShelf = true;
  cutAfter = OPEN.cut;
  location.hash = slugOf(entries[i]);
}

async function route() {
  const slug = decodeURIComponent(location.hash.slice(1));
  const i = entries.findIndex(e => slugOf(e) === slug);
  if (i >= 0) {
    if (i === inProject) return;
    const v = await loadView();
    if (det) dropDetails();
    setHovered(-1);
    inProject = i;
    for (const a of canvas.getAnimations()) a.finish();   // a deep link skips the canvas fade
    audio?.setRoomTone(false);
    if (!cutAfter) play('open');   // a link or the browser's Forward (Open has played it already)
    await v.open(i, { cutAfter });
    cutAfter = 0;
  } else if (inProject >= 0) {
    const i0 = inProject;
    inProject = -1;
    view?.close();
    audio?.setRoomTone(true);
    play('close', { pan: panOf(i0) });
    // Back on the shelf with the same sleeve focused (and lifted, as focus does).
    layout();
    bakeDirty = bgDirty = true;
    slots[i0].querySelector('[data-action="open"]').focus({ preventScroll: true });
    wake();
  }
}
// Back, Escape and the wordmark: the browser's Back when the page was opened from the shelf, else the
// shelf's own address (a deep link has no shelf behind it).
function backToShelf() {
  if (openedFromShelf) { openedFromShelf = false; history.back(); }
  else { history.pushState(null, '', location.pathname + location.search); route(); }
}
window.addEventListener('hashchange', () => { if (!location.hash) openedFromShelf = false; route(); });

// Details ends at once when a page opens from it.
function dropDetails() {
  const s = sleeves[det.i];
  for (const el of [dTitle, dTag, dOpen, tagline]) for (const a of el.getAnimations()) a.cancel();
  detailsEl.inert = true; dOpen.inert = true;
  endDetails(s, performance.now());
  s.fall = null;
  lifted = -1;
}

document.addEventListener('click', e => {
  const b = e.target.closest('button[data-action]');
  if (!b) return;
  const i = +b.dataset.index;
  if (b.dataset.action === 'details') openDetails(i);
  else openProject(i);
});

// ---- keyboard -------------------------------------------------------------------------------------
// Arrows move between sleeves (left/right along a shelf and on to the next, up/down between shelves),
// Enter opens Details, Space flips, Escape puts the sleeve back. Keyboard focus lifts its sleeve, as the
// pointer does.
const slotOf = el => (el && el.closest && el.closest('.slot') ? slots.indexOf(el.closest('.slot')) : -1);
slotsEl.addEventListener('focusin', e => {
  const i = slotOf(e.target);
  if (i < 0) return;
  setHovered(i, true);
});
slotsEl.addEventListener('focusout', e => {
  if (slotOf(e.relatedTarget) >= 0) return;
  if (!det) setHovered(pointerHit);
});
window.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey || inProject >= 0) return;
  if (det) {
    if (e.key === 'Escape') { e.preventDefault(); closeDetails(); }
    else if (e.key === ' ' || e.code === 'Space') { e.preventDefault(); if (!e.repeat) flip(); }
    return;
  }
  const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -SLEEVE.cols, ArrowDown: SLEEVE.cols }[e.key];
  if (step === undefined) return;
  e.preventDefault();
  const from = slotOf(document.activeElement);
  const to = from < 0 ? 0 : Math.max(0, Math.min(sleeves.length - 1, from + step));
  if (to === from) return;
  const action = document.activeElement?.dataset?.action === 'open' ? 'open' : 'details';
  slots[to].querySelector(`[data-action="${action}"]`).focus({ preventScroll: true });
  play('tick', { pan: panOf(to) });
});

window.addEventListener('keyup', e => { if (det && (e.key === ' ' || e.code === 'Space')) e.preventDefault(); });

// ---- reduced motion -------------------------------------------------------------------------------
const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
setReducedMotion(rm.matches);
rm.addEventListener?.('change', e => setReducedMotion(e.matches));

// ---- test hooks -----------------------------------------------------------------------------------
const hooks = {
  count: sleeves.length,
  firstFrameAt: null,
  ready: firstFrame.ready,
  covers: coversReady,
  sleeveRect,
  setCover(i, front, back) { setCover(sleeves[i], front, back); wake(); },
  get project() { return inProject >= 0 ? slugOf(entries[inProject]) : null; },
  get details() {
    return det ? { index: det.i, flipped: Math.round(det.flip.to / Math.PI) % 2 === 1, closing: !!det.exit, blur: det.blur, yaw: sleeves[det.i].pose.yaw } : null;
  },
};
window.__editions = hooks;

layout();
// Draw every program once before the first frame (the canvas is still transparent), so nothing compiles
// mid-motion: the sleeves both fading (transparent) and opaque, the record and the sticker, each drawn to
// the screen and into the Details background target. Drawing, not just compiling: the GPU driver
// finishes a program on its first draw.
for (const s of sleeves) { s.mesh.visible = true; s.record.mesh.visible = true; }
sticker.mesh.visible = true;
for (const transparent of [true, false]) {
  for (const s of sleeves) for (const m of [s.front, s.back, s.mats[0]]) { m.transparent = transparent; m.needsUpdate = true; }
  for (const layer of [0, FOCUS]) { camera.layers.set(layer); renderer.render(scene, camera); }
  camera.layers.enableAll();
  renderer.render(scene, camera);
  camera.layers.set(0);
  post.background(scene, camera, 1);
  post.composite(0.5);
}
for (const s of sleeves) applyPose(s);
sticker.mesh.visible = false;
bgDirty = true;

// A deep link (#mirra) opens straight into its page once the shelf has drawn its first frame.
firstFrame.ready.then(() => { if (location.hash) route(); });
