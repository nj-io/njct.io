// njct.io Editions: the shelf wall. Shelves, studio light and soft shadows; the intro drop; hover;
// Details (the sleeve flies forward over the blurred shelf, turning to its back cover on the way; Space
// turns it front and back; Escape puts it back); keyboard; sound. Renders only while something moves.
import * as THREE from 'three';
import { RoomEnvironment } from '/vendor/three-0.181.0/addons/environments/RoomEnvironment.js';
import { CAMERA_Z, REF_H, SHELF, SLEEVE, INTRO, DETAILS, LINEUP, CAFE, viewScale, slugOf } from './scene/config.js';
import { createLightUniforms, applyLights } from './scene/lighting.js';
import { createWall } from './scene/wall.js';
import { createShelves } from './scene/shelves.js';
import { createSleeves, applyPose, writeOccluders, setCover, setThumb, restPose, hoverPose, COVER_BIAS } from './scene/sleeves.js';
import { introPose, appearTime, stepHover, fallPose, HOVER_DELAY, bezier, lerpPose, clamp01, dur, delay, setReducedMotion, reduced } from './scene/motion.js';
import { createPost } from './scene/post.js';
import { createSticker } from './scene/sticker.js';
import { createCrate, createCrateShadow, CRATE } from './scene/crate.js';
import { createFilm } from './scene/film.js';

const entries = LINEUP;

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
const shelfMeshes = createShelves(uniforms);
for (const m of shelfMeshes) scene.add(m);
const sleeves = createSleeves(entries);
COVER_BIAS.value = window.__editionsTest?.coverBias ?? -0.5;   // a test can set the cover mip bias before load
// Placeholder maps, so the covers arriving later swap a texture instead of compiling a new program.
const blank = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
blank.colorSpace = THREE.SRGBColorSpace;
blank.needsUpdate = true;
for (const s of sleeves) {
  s.front.map = blank; s.back.map = blank;
  scene.add(s.mesh);
}
// Details: the sleeve in focus draws on its own layer, over the blurred shelf.
const FOCUS = 1;
// The newest sleeve wears the Now playing sticker, on the shelf, in the crate and in Details, as the
// reference's newest edition does (its sticker is part of the cover): it leans, lifts and flips with it.
const NOW = sleeves.find(s => s.entry.newest) || null;
let stickerOff = false;
const sticker = createSticker('Now playing');
scene.add(sticker.mesh);
const post = createPost(renderer);

// The camera stands CAMERA_Z from the wall over the shelves; for the phone crate it stands four times as
// far (the crate's depth then reads almost flat, as on the reference).
let CAMZ = CAMERA_Z;
const camera = new THREE.PerspectiveCamera(20, 1, 100, CAMZ * 2);
const film = createFilm({ camera, layer: FOCUS, wake: () => wake(), dur, els: {
  frame: document.getElementById('film-frame'), video: document.querySelector('#film-frame video'),
  play: document.getElementById('d-play'), close: document.getElementById('d-close'), shade: document.getElementById('film-shade') } });
camera.position.set(0, 0, CAMZ);
const crate = createCrate(sleeves.length);
const crateShadow = createCrateShadow();
scene.add(crateShadow.mesh);

// ---- covers -------------------------------------------------------------------------------------
// Covers come only through createCover (editions/covers/): a 1024 front (Details shows it at about 830
// device px) and no shelf back (backs face the wall); the back renders at 1024 when its sleeve enters
// Details. A cover that fails to build leaves its sleeve its thumb, or a flat fill (introShift below).
// The cover module loads after the first frame, so its bytes and its work stay off the first frame's
// path on a slow phone (the shelf's first frame needs only the scene). Covers are then created (and
// their programs compiled) in shelf order, COVER_LANES at a time, so sleeve i's cover is in by its
// appearance in the intro (INTRO.appear.at + stagger * i). Until then a sleeve shows its cover's thumb
// (covers/thumbs/, 128 px, drawn from the same cover by build/covers/thumbs.mjs), which loads with the
// first view; the full cover fades in over it as it lands (COVER_FADE). A sleeve never shows bare: the
// intro holds a sleeve with neither thumb nor cover in (introShift below) and never waits on the others.
const covers = sleeves.map(() => null);
const coverReadyAt = sleeves.map(() => null);   // ms after the first frame (test hook)
const coverIn = sleeves.map(() => null);        // intro ms when the cover landed (or failed)
const thumbIn = sleeves.map(() => null);        // intro ms when the thumb landed
const COVER_FADE = 320;
const fades = [];                                // { s, at }: covers fading in over their thumbs
const COVER_LANES = 1;
let coversM = null;
const coversMod = new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))).then(() => import('./covers/covers.js'))
  .then(m => (coversM = m));
const build = (s, i, opts) => coversMod.then(m => m.createCover(renderer, s.entry, i, opts));
const introMs = () => (introStart === null ? 0 : performance.now() - introStart);
// A test can make cover i land no sooner than coverLate[i] ms after its sleeve's scheduled appearance;
// the covers after it keep building.
const coverLate = window.__editionsTest?.coverLate || {};
let nextCover = 0;
function buildNext() {
  const i = nextCover++;
  if (i >= sleeves.length) return Promise.resolve();
  const s = sleeves[i];
  const landed = () => {
    coverIn[i] = introMs();
    coverReadyAt[i] = introStart === null ? null : Math.round(coverIn[i]);
    wake();
  };
  return build(s, i, { size: 1024, backSize: 0 })
    .then(c => {
      const land = () => {
        covers[i] = c;
        if (setCover(s, c.front, null)) fades.push({ s, at: performance.now() });
        landed();
      };
      if (coverLate[i] == null) land();
      else setTimeout(land, Math.max(0, schedAppear(i) + coverLate[i] - introMs()));
    }, e => { console.warn(`cover ${s.entry.name}: flat sleeve (${e?.message || e})`); landed(); })
    .then(buildNext);
}
const coversReady = coversMod.then(() => Promise.all(Array.from({ length: COVER_LANES }, buildNext)));
// The thumbs: requested at once, a few KB each. A missing one leaves its sleeve to the cover alone.
const thumbLoader = new THREE.TextureLoader();
for (const s of sleeves) {
  thumbLoader.load(new URL(`./covers/thumbs/${slugOf(s.entry)}.webp`, import.meta.url).href, tex => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    setThumb(s, tex);
    thumbIn[s.i] = introMs();
    wake();
  }, undefined, () => {});
}
// The cover module keeps the last two Details backs and renders an evicted one again on request, so the
// sleeve asks on every entry, and gives its back up (to the placeholder) when it leaves Details.
function backFor(i) {
  const s = sleeves[i];
  const p = covers[i]?.detailBack(1024).then(tex => {
    if (det && det.i === i) { s.back.map = tex || blank; s.back.color.set(tex ? 0xffffff : BACK_PLAIN); s.back.needsUpdate = true; wake(); }
  }).catch(e => console.warn(`cover ${s.entry.name}: no Details back (${e?.message || e})`));
  // The flight waits on this (stepDetails); a sleeve without a cover has no back to wait for.
  Promise.resolve(p).then(() => { if (det && det.i === i && det.backIn === null) det.backIn = performance.now(); });
}
// The back's faces load (and its first back renders) at idle once the intro is over, so a Details back
// is a single render job when Details opens and never lands in a flip. The covers module loads the back
// faces only on a back request, so this asks for the first sleeve's back once.
// The page module and its stylesheet load at idle after that, so Open's cut fetches nothing.
let backsWarm = false;
function warmBacks() {
  if (backsWarm || !covers[0] || settled.some(v => !v)) return;
  backsWarm = true;
  const idle = window.requestIdleCallback || (f => setTimeout(f, 200));
  idle(() => {
    if (!det) covers[0].detailBack(1024).catch(() => {});
    idle(() => loadView().then(v => v.warm())
      .catch(e => console.warn(`page warm-up: ${e?.message || e}`)), { timeout: 3000 });
  }, { timeout: 2000 });
}
const BACK_PLAIN = 0xe9e6e0;   // the back's card colour in sleeves.js

// ---- the café's sun (scene/sun.js) ------------------------------------------------------------------
// Late sun through the café's window, on the record wall, its shelves and sleeves: a lazy chunk, loaded
// once every sleeve has landed. Its programs compile out of sight, then it fades in. The leaves move on
// an ambient clock of their own (CAFE.sun.ambientHz), which holds still in Details, on a project page, in
// a hidden tab and under reduced motion. Until it is on, and on the phone crate, every material runs v1's
// own program. A test can keep it off (__editionsTest.noSun) or set its angles, clock and fade
// (__editionsTest.sun = { az, el, t, fade }).
const SUN_TEST = window.__editionsTest?.sun || null;
let sunM = null, sunP = null, sunOn = false, sunFadeAt = 0, sunSleeves = true, sunTickDue = true, ambientTimer = 0;
const AMBIENT_STILL = 7.5;   // the clock's frame under reduced motion
const ambientT = () => (SUN_TEST?.t ?? (reduced() ? AMBIENT_STILL : performance.now() / 1000));
function startSun() {
  if (sunP || window.__editionsTest?.noSun) return;
  sunP = import('./scene/sun.js').then(async m => {
    const sun = m.createSun({ renderer, scene, wallMesh: wall.mesh, shelfMeshes, sleeves });
    if (SUN_TEST) sun.setParams(SUN_TEST);
    sun.sleevesMoved();
    sun.tick(ambientT());
    await sun.compile(camera);
    sunM = sun;
    sunOn = true;
    sunFadeAt = performance.now();
    sun.setFade(SUN_TEST?.fade ?? 0);
    sun.setEnabled(!crateMode);
    wake();
    return sun;
  }).catch(e => { console.warn(`sun: ${e?.message || e}`); });
  return sunP;
}
// Before a frame draws: the sleeves' faces, the fade, the leaves. Returns whether the sun still fades in.
function stepSun(now) {
  if (!sunOn || crateMode) return false;
  if (sunSleeves) { sunM.sleevesMoved(); sunSleeves = false; }
  const f = SUN_TEST?.fade ?? clamp01((now - sunFadeAt) / dur(CAFE.sun.fadeIn));
  sunM.setFade(f);
  if (sunTickDue) { sunTickDue = false; if (sunM.tick(ambientT()) && det) bgDirty = true; }
  return f < 1;
}
// The ambient clock asks for the next frame of leaves.
function ambient() {
  if (ambientTimer || !sunOn || crateMode || det || inProject >= 0 || document.hidden || reduced() || SUN_TEST?.t != null) return;
  ambientTimer = setTimeout(() => { ambientTimer = 0; sunTickDue = true; wake(); }, 1000 / CAFE.sun.ambientHz);
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) { sunTickDue = true; wake(); } });

// The intro holds each sleeve until its thumb or its cover is in. Sleeve i appears at its scheduled time,
// or when the first of them lands if that is later, and never sooner after the sleeve before it than the
// schedule spaces them (76 ms), so the stagger stays even behind a held sleeve; its whole intro runs that
// much later. With neither in COVER_WAIT ms after the scheduled time (or a failed cover and no thumb),
// its sleeve appears with the cover's ground colour as a flat fill, until one lands.
const COVER_WAIT = 600;
const appearAt = sleeves.map(() => null), shiftOf = sleeves.map(() => 0);   // intro ms; decided once
const schedAppear = i => (crateMode ? delay(INTRO.appear.at + INTRO.appear.stagger * i) : appearTime(i));
function introShift(i, ti) {
  if (appearAt[i] === null) {
    if (i > 0 && appearAt[i - 1] === null) return null;
    const sched = schedAppear(i);
    const earliest = i > 0 ? Math.max(sched, appearAt[i - 1] + sched - schedAppear(i - 1)) : sched;
    const inAt = coverIn[i] ?? thumbIn[i];
    const ready = inAt ?? (ti >= sched + COVER_WAIT ? sched + COVER_WAIT : null);
    if (ready === null || ti < Math.max(earliest, ready)) return null;
    appearAt[i] = Math.max(earliest, ready);
    shiftOf[i] = appearAt[i] - sched;
    if (!covers[i] && thumbIn[i] === null) flatFill(sleeves[i]);
  }
  return shiftOf[i];
}
// The flat fill: the cover's resting ground colour from the cover module, else the entry's accent.
function flatFill(s) {
  const ground = coversM?.coverGround?.(s.entry, s.i) || s.entry.accent?.light;
  if (ground) s.front.color.set(ground);
}
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
// Ambient cover motion (prototype, covers.js coverMotion): at rest the covers move slowly, each drawn a few times a second
// and staggered; the frame loop asks it before every draw, and it wakes the loop when a cover is next due (at most 30 times a
// second: a clock of its own, to share with the sun's ambient clock at merge). It waits for the intro, holds the shelf in
// Details, and stops on a page, in a hidden tab and under reduced motion. Off unless __editionsTest.coverMotion asks for it.
coversMod.then(m => {
  m.coverMotion.attach({ wake, reduced, test: window.__editionsTest?.coverMotion });
  if (window.__editions) window.__editions.coverMotion = m.coverMotion;
});
const stepCovers = now => !window.__editionsTest?.stillCovers && coversM?.coverMotion.step(now,
  { ready: settled.every(Boolean), details: !!det, crate: crateMode ? crate.current : -1 });

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
// The shelf as a list for screen readers and the keyboard: one item per sleeve, in shelf order, with its
// name, tag and the Open and Details pills (shown on the sleeve when it is hovered or focused).
const slotsEl = document.getElementById('slots');
const slots = sleeves.map(s => {
  const e = entries[s.i];
  const el = document.createElement('li');
  el.className = 'slot';
  const art = document.createElement('article');
  art.setAttribute('aria-labelledby', `sl-${s.i}`);
  const h = document.createElement('h2'); h.className = 'sr'; h.id = `sl-${s.i}`; h.textContent = e.name;
  art.appendChild(h);
  if (e.tag) { const t = document.createElement('p'); t.className = 'sr'; t.textContent = e.year ? `${e.tag}, ${e.year}` : e.tag; art.appendChild(t); }
  const open = document.createElement('a');
  open.dataset.action = 'open';
  open.textContent = 'Open';
  setOpen(open, s.i);
  const b = document.createElement('button');
  b.type = 'button';
  b.dataset.action = 'details';
  b.dataset.index = String(s.i);
  b.textContent = 'Details';
  b.setAttribute('aria-label', `Details: ${e.name}`);
  art.append(open, b);
  el.appendChild(art);
  slotsEl.appendChild(el);
  return el;
});
// Open is a link: to the product's live site in a new tab, or, for an entry without one (and About
// Neil), to its page here by its hash route (a plain click runs Open's cut; see the click handler).
function setMore(a, i) {
  const e = entries[i];
  a.dataset.index = String(i);
  a.href = `#${slugOf(e)}`;
  a.hidden = !e.url;
  a.setAttribute('aria-label', `More detail: ${e.name}`);
}
function setOpen(a, i) {
  const e = entries[i];
  a.dataset.index = String(i);
  a.href = e.url || `#${slugOf(e)}`;
  if (e.url) { a.target = '_blank'; a.rel = 'noopener'; } else { a.removeAttribute('target'); a.removeAttribute('rel'); }
  a.setAttribute('aria-label', e.url ? `Open: ${e.name} site, new tab` : `Open: ${e.name}`);
}
// The crate's bottom bar (the front sleeve's year and name, Details and Open; Back in Details) and rail.
const cbBar = document.getElementById('crate-bar');
const cbYear = cbBar.querySelector('.cb-year'), cbName = cbBar.querySelector('.cb-name');
const cbDetails = cbBar.querySelector('.cb-details'), cbOpen = cbBar.querySelector('.cb-open'), cbMore = cbBar.querySelector('.cb-more');
const railThumb = document.querySelector('.crate-rail span');
const announcer = document.getElementById('announce');
function announce(text) { announcer.textContent = ''; requestAnimationFrame(() => { announcer.textContent = text; }); }
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
// More detail, beside Open in Details: the project's page here. Shown only where Open goes to a live site
// (a project without one opens its page from Open already).
const dMore = document.getElementById('d-more');

// Opacity fades that start from wherever the element is now.
function fade(el, to, at, ms) {
  const from = +getComputedStyle(el).opacity;
  for (const a of el.getAnimations()) a.cancel();
  el.animate([{ opacity: from }, { opacity: to }], { duration: dur(ms), delay: delay(at), easing: 'ease', fill: 'both' });
}

// ---- layout ---------------------------------------------------------------------------------------
// Below 600 px wide (a phone held upright) the sleeves stand in a crate instead of on the shelves, as on
// the reference; landscape phones and tablets keep the shelves.
let W = 0, H = 0, S = 1, crateMode = false, detSize = 0, detCY = 0, DZ = 0, DY = 0, shiftY = 0;
// A short screen (a phone on its side) would bring the top shelf's sleeves up against the tagline; the
// scene then moves down on screen (the camera's view offset) to keep the reference's gap: sleeve tops
// 14 px below the tagline's line box (15.5 px below its ink, at 844x390).
const TAG_GAP = 14;
const dbSize = new THREE.Vector2();
function layout() {
  W = window.innerWidth; H = window.innerHeight;
  const wasCrate = crateMode;
  crateMode = W < 600;
  CAMZ = crateMode ? CAMERA_Z * CRATE.camera : CAMERA_Z;
  S = crateMode ? crate.layout(W, H, CAMZ) : viewScale(W, H);
  camera.position.z = CAMZ; camera.far = CAMZ * 2;
  const hw = W / 2 / S, hh = H / 2 / S;
  camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(hh / CAMZ));
  camera.aspect = W / H;
  camera.clearViewOffset();   // updates the projection
  camera.updateMatrixWorld();
  shiftY = 0;
  if (!crateMode) {
    const rp = restPose(), L = SLEEVE.size;
    const top = project(0, SHELF.tops[0] + L * Math.cos(rp.lean), rp.z - L * Math.sin(rp.lean) + SLEEVE.thick).y;
    shiftY = Math.max(0, Math.round(tagline.getBoundingClientRect().bottom + TAG_GAP - top));
    if (shiftY) camera.setViewOffset(W, H, 0, -shiftY, W, H);
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W, H, false);
  renderer.getDrawingBufferSize(dbSize);
  post.resize(dbSize.x, dbSize.y);
  const sw = crateMode ? viewScale(W, H) : S, rw = W / 2 / sw * 1.02, rh = H / 2 / sw * 1.02, sy = shiftY / S;
  wall.resize(-hw * 1.02, -hh * 1.02 + sy, hw * 1.02, hh * 1.02 + sy, Math.ceil(W / 2), Math.ceil(H / 2), crateMode ? [-rw, -rh, rw, rh] : null);
  bakeDirty = bgDirty = true;
  // Details: the sleeve's size and centre on screen, then the depth and height that give them.
  detSize = crateMode ? CRATE.details.size * W : DETAILS.size * S;
  detCY = crateMode ? CRATE.details.centreY * H : H / 2 - (REF_H / 2 - DETAILS.centreY) * S;
  DZ = CAMZ * (1 - SLEEVE.size * S / detSize);
  DY = (H / 2 + shiftY - detCY) / S * (CAMZ - DZ) / CAMZ;
  // The crate has no shelves (and a test can ask for the bare wall).
  const bare = crateMode || !!window.__editionsTest?.noShelves;
  for (const m of shelfMeshes) m.visible = !bare;
  // The crate's ground: darker, with its shadow, and the sleeves' edges dark as on the reference's crate.
  wall.setGain(crateMode ? CRATE.groundGain : 1);
  crateShadow.mesh.visible = crateMode;
  if (crateMode) crateShadow.layout(W, H, S);
  for (const s of sleeves) s.mats[0].color.set(crateMode ? CRATE.edgeColour : 0xf1efea);
  if (sunM) { sunM.setEnabled(sunOn && !crateMode); sunSleeves = sunTickDue = true; }   // the crate has no sun
  // Without shelves the wall loses their shadows too.
  SHELF.tops.forEach((top, r) => (bare ? uniforms.uShelf.value[r].set(0, 0, -1e5, -1e5)
    : uniforms.uShelf.value[r].set(-SHELF.width / 2, SHELF.width / 2, top - SHELF.thick, top)));
  document.body.classList.toggle('crate', crateMode);
  if (crateMode !== wasCrate) {
    if (det) dropDetails();
    setHovered(-1);
    for (const s of sleeves) if (settled[s.i]) { s.fall = null; s.pose = homePose(s); applyPose(s); }
    syncCrate(true);
  } else if (crateMode) for (const s of sleeves) if (settled[s.i] && !(det && det.i === s.i)) { s.pose = homePose(s); applyPose(s); }
  hitRects = sleeves.map(s => restRect(s));
  if (!crateMode) sleeves.forEach(placeSlot);
  placeDetails();
  wake();
}
// Where a sleeve rests: leaning on its shelf, or its place in the crate.
const homePose = s => (crateMode ? crate.pose(s) : restPose());

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
  slots[s.i].style.transform = `translate3d(${snap(bl.x + w * 0.1175)}px, ${snap(bl.y - w * 0.025 - 35)}px, 0)`;
}

// Details: where the sleeve flies (on the shelves its centre DETAILS.size px wide, 14.5 px above the view
// centre at 1440x900, both scaled with the view; in the crate CRATE.details), and the text beside it.
function detailsPose(s) {
  return { ...restPose(), lean: 0, dx: -s.x, lift: DY - SLEEVE.size / 2 - s.shelfY, z: DZ - SLEEVE.thick / 2 };
}
function placeDetails() {
  const cy = detCY;
  // The title (30 px) sits 64 px above the sleeve's centre and the side line (21 px) starts 18 px above it.
  dTitle.style.top = `${snap(cy - 64)}px`;
  dTag.style.top = `${snap(cy - 18)}px`;
  dOpen.style.top = dMore.style.top = `${snap(cy + detSize / 2 + 16)}px`;
}

// ---- state ----------------------------------------------------------------------------------------
let raf = 0, last = 0, bakeDirty = true, bgDirty = true, introStart = null, sleevesStart = null;
let hovered = -1, lifted = -1, hoverAt = 0, det = null, lastSigma = -1, crateBusy = false;
const settled = sleeves.map(() => false);  // intro finished for this sleeve
const pointer = { x: -1, y: -1 };
const firstFrame = {};
firstFrame.ready = new Promise(r => { firstFrame.resolve = r; });
export const drawn = firstFrame.ready;   // the page loads the menu's marks after it (index.html)

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
  const ka = CAMZ / (CAMZ - ca.z), kb = CAMZ / (CAMZ - cb.z), k = ka + (kb - ka) * e;
  const x = (ca.x * ka + (cb.x * kb - ca.x * ka) * e) / k, y = (ca.y * ka + (cb.y * kb - ca.y * ka) * e) / k;
  p.dx = x - s.x;
  p.lift = y - s.shelfY - L / 2 * Math.cos(p.lean);
  p.z = CAMZ * (1 - 1 / k) + L / 2 * Math.sin(p.lean) - SLEEVE.thick / 2;
  return p;
}
const easeOut = u => 1 - (1 - u) ** 3;
const smooth = u => u * u * (3 - 2 * u);
const TURN = Math.PI * 2;
// The turn into and out of Details runs after the travel, in two moves: the sleeve flies to the centre
// showing its front, then turns. Its own clock u (ms since the turn began) runs on the flip's duration and
// easing, overlapping the end of the travel by TURN_OVERLAP. Reduced motion: no turn; the sleeve changes
// sides when the turn would start.
const TURN_OVERLAP = 0.1;
const FILM_FADE = 450;
const turnOf = u => (reduced() ? (u >= 0 ? 1 : 0) : bezier(DETAILS.flip.ease, clamp01(u / dur(DETAILS.flip.dur))));
const turnLead = () => delay(DETAILS.fly.at) + dur(DETAILS.fly.dur) * (1 - TURN_OVERLAP);
const showsBack = yaw => Math.abs(Math.round(yaw / Math.PI)) % 2 === 1;

// Details pose of the sleeve in focus at time now (the flight in or out, the flip).
function stepDetails(s, now) {
  const F = DETAILS.fly, X = DETAILS.exit, P = DETAILS.flip;
  const yawAt = () => det.flip.from + (det.flip.to - det.flip.from) * bezier(P.ease, clamp01((now - det.flip.t0 - delay(P.at)) / dur(P.dur)));
  let p, moving;
  if (!det.exit) {
    // Until the sleeve's back is drawn (at most DETAILS.backWait), the clock holds at the flight's start.
    if (det.backIn === null && now - det.asked < DETAILS.backWait && now - det.t0 > delay(F.at)) det.t0 = now - delay(F.at);
    const t = now - det.t0;
    const e = bezier(F.ease, clamp01((t - delay(F.at)) / dur(F.dur)));
    p = flight(s, det.from, detailsPose(s), e);
    p.yaw = det.turn * turnOf(t - turnLead()) + yawAt();
    det.blur = crateMode ? 0 : smooth(clamp01((t - delay(DETAILS.blur.at)) / dur(DETAILS.blur.dur)));   // the crate stays sharp, as on the reference
    // A film fades in over the back's art band only once the turn is done (FILM_FADE ms).
    const turned = turnLead() + dur(P.dur), filmIn = sleeves[det.i].entry.video ? dur(FILM_FADE) : 0;
    const end = Math.max(turned + filmIn, ...[F, DETAILS.blur, DETAILS.title].map(k => delay(k.at) + dur(k.dur)));
    moving = t < end || now - det.flip.t0 < delay(P.at) + dur(P.dur);
    det.film = [filmIn ? smooth(clamp01((t - turned) / filmIn)) : 0, !moving && showsBack(p.yaw)];
  } else {
    // Turn back to the front in place first, then fly back to the hover pose on the shelf (or its place in
    // the crate). x.lag is the turn's length less the overlap; 0 when the sleeve already shows its front.
    const x = det.exit, t = now - x.t0, tf = t - x.lag;
    const e = bezier(X.ease, clamp01((tf - delay(X.at)) / dur(X.dur)));
    p = flight(s, x.from, { ...(crateMode ? crate.pose(s) : hoverPose()), yaw: x.yawTo }, e);
    p.yaw = x.from.yaw + (x.yawTo - x.from.yaw) * (x.lag ? turnOf(t) : 1);
    det.blur = x.blur * (1 - smooth(clamp01((tf - delay(X.blurOut.at)) / dur(X.blurOut.dur))));
    moving = tf < delay(X.at) + dur(X.dur) || det.blur > 0;
    det.film = [x.lag ? 1 - turnOf(t) : 0, false];
    if (!moving) { film.detach(); endDetails(s, now); return true; }
  }
  s.pose = p;
  return moving;
}

// A lost WebGL context ends the scene: the shelf and pages carry on as the static fallback.
let glLost = false;
canvas.addEventListener('webglcontextlost', e => {
  e.preventDefault();
  if (glLost) return;
  glLost = true;
  if (raf) cancelAnimationFrame(raf);
  if (det) dropDetails();
  view?.close();
  import('./fallback.js').then(m => m.start(entries));
});

function frame(now) {
  raf = 0;
  if (glLost) return;
  if (inProject >= 0) { last = 0; return; }   // a page is open: the shelf holds still and draws nothing
  const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
  last = now;
  let active = false;
  const ti = sleevesStart === null ? -1 : now - sleevesStart;
  const crateWas = crateBusy;
  const crateMoving = crateMode && crate.step(dt);
  crateBusy = crateMoving;
  if (crateMoving) syncCrate();
  else if (crateWas && crateMode) { syncCrate(); crateRest(); }
  const want = det || crateMode ? -1 : hovered;
  if (lifted !== want && (det || now - hoverAt >= delay(HOVER_DELAY))) {
    if (lifted >= 0 && !(det && det.i === lifted)) sleeves[lifted].fall = { from: { ...sleeves[lifted].pose }, t0: hoverAt };
    lifted = want;
    if (lifted >= 0) sleeves[lifted].fall = null;
  }
  setAlive(det ? (Math.cos(sleeves[det.i].pose.yaw) > 0 ? det.i : -1) : lifted);   // in Details, while its front faces
  stepCovers(now);
  const waiting = lifted !== want;
  for (const s of sleeves) {
    let moved = false;
    if (det && s.i === det.i) {
      moved = stepDetails(s, now);
    } else if (!settled[s.i]) {
      if (ti >= 0) {
        const shift = introShift(s.i, ti);   // null: still held, hidden
        if (shift !== null) {
          const p = crateMode ? crateIntro(s, ti - shift) : introPose(s.i, ti - shift);
          if (p) s.pose = p; else { s.pose = homePose(s); settled[s.i] = true; }
        }
        moved = true;
      }
    } else if (crateMode) {
      if (crateMoving) { s.pose = crate.pose(s); moved = true; }
    } else if (lifted === s.i) {
      moved = stepHover(s, dt);
    } else if (s.fall) {
      const p = fallPose(s.fall.from, now - s.fall.t0);
      if (p) s.pose = p; else { s.pose = restPose(); s.fall = null; }
      moved = true;
    }
    if (moved) {
      applyPose(s);
      sunSleeves = true;
      if (!crateMode) placeSlot(s);
      // A sleeve shades the wall until it is well clear of it (Details flies it out of range). The crate
      // stands clear of the wall and shades none of it.
      const shades = !crateMode && s.pose.z < 270;
      if (shades || s.shaded) bakeDirty = true;
      s.shaded = shades;
      if (!det || s.i !== det.i) bgDirty = true;
      active = true;
    }
  }
  if (bakeDirty) { writeOccluders(sleeves, uniforms, crateMode); wall.bake(); bakeDirty = false; bgDirty = true; }
  // The crate's shadow comes in with its sleeves.
  if (crateMode) crateShadow.setOpacity(ti < 0 || appearAt[0] === null ? 0 : clamp01((ti - appearAt[0]) / dur(600)));
  // The sticker follows the newest sleeve, on the focus layer while that sleeve is in Details.
  if (NOW) {
    sticker.mesh.layers.set(det && det.i === NOW.i ? FOCUS : 0);
    sticker.place(NOW, stickerOff ? 0 : NOW.pose.opacity);
  }
  const alive = aliveIdx >= 0 || now < aliveUntil;
  if (alive && !window.__editionsTest?.stillCovers) for (const c of covers) c?.update(dt);   // a test can hold the covers still
  // Covers fading in over their thumbs (smoothstep); the Details background redraws under them.
  for (let k = fades.length - 1; k >= 0; k--) {
    const f = fades[k], u = clamp01((performance.now() - f.at) / dur(COVER_FADE));
    f.s.fade.uFade.value = u * u * (3 - 2 * u);
    if (!det || det.i !== f.s.i) bgDirty = true;
    if (u >= 1) fades.splice(k, 1);
  }
  if (stepSun(now)) { active = true; bgDirty = true; }

  if (det) {
    const s = sleeves[det.i];
    const sigma = DETAILS.blur.sigma * det.blur;
    if (bgDirty || sigma !== lastSigma) {
      camera.layers.set(0);
      post.background(scene, camera, sigma);
      bgDirty = false; lastSigma = sigma;
    }
    if (det.film) film.update(...det.film);
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
  if (!backsWarm && !active) warmBacks();
  if (!sunP && !crateMode && settled.every(Boolean)) startSun();
  if (active || waiting || alive || crateMoving || fades.length) wake(); else last = 0;
  ambient();
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
  sleevesStart = window.__editionsTest?.noSleeves ? null : now;   // a test can hold the shelf empty
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
  if (e.pointerType === 'touch' || crateMode) return;
  pointer.x = e.clientX; pointer.y = e.clientY;
  if (det) { syncHot(); return; }
  const hit = e.target.closest?.('.pm') ? -1 : hitAt(e.clientX, e.clientY);   // the open Projects menu covers the sleeves under it
  if (hit !== pointerHit) { pointerHit = hit; setHovered(hit); }
});
document.documentElement.addEventListener('pointerleave', () => { pointerHit = -1; setHovered(-1); });
window.addEventListener('blur', () => { pointerHit = -1; setHovered(-1); });
window.addEventListener('resize', layout);

// A click on a sleeve opens its Details; in Details, a click on the sleeve flips it and a click on the
// ground puts it back.
canvas.addEventListener('click', e => {
  if (crateMode) return;   // the crate's own pointer handling below takes taps
  pointer.x = e.clientX; pointer.y = e.clientY;
  if (det) { if (det.exit) return; if (overFocus()) flip(); else closeDetails(); return; }
  const hit = hitAt(e.clientX, e.clientY);
  if (hit >= 0) openDetails(hit);
});

// ---- the crate ------------------------------------------------------------------------------------
// The intro in the crate: front to back, each sleeve fades in as it settles into its place.
function crateIntro(s, ti) {
  const u = clamp01((ti - delay(INTRO.appear.at + INTRO.appear.stagger * s.i)) / dur(360));
  if (u >= 1) return null;
  const p = crate.pose(s);
  p.opacity = u;
  if (!reduced()) p.lift += (1 - easeOut(u)) * 40 / S;   // reduced motion: a fade in place
  return p;
}
// The bar and rail follow the front sleeve; the screen reader hears it once the crate comes to rest.
let crateShown = -1, crateSaid = 0;
function syncCrate(force = false) {
  if (!crateMode) return;
  const n = sleeves.length, c = crate.current, e = entries[c];
  const track = railThumb.parentElement.clientHeight - railThumb.offsetHeight;
  railThumb.style.transform = `translateY(${((1 - clamp01(crate.p / Math.max(1, n - 1))) * track).toFixed(1)}px)`;
  if (c === crateShown && !force) return;
  crateShown = c;
  cbYear.textContent = e.year || '';
  cbName.textContent = e.name;
  cbDetails.dataset.index = String(c);
  cbDetails.setAttribute('aria-label', `Details: ${e.name}`);
  setOpen(cbOpen, c);
  setMore(cbMore, c);
}
function crateRest() {
  const c = crate.current;
  if (c !== crateSaid) { crateSaid = c; announce(`${entries[c].name}, ${c + 1} of ${sleeves.length}`); }
}
// Which sleeve is at screen point (x, y): the passed ones lie in front, then the front sleeve, then the
// strips behind it, front to back.
function crateHit(x, y) {
  const c = Math.round(crate.p), order = [];
  for (let i = 0; i < c; i++) order.push(i);
  for (let i = c; i < sleeves.length; i++) order.push(i);
  for (const i of order) {
    if (!settled[i]) continue;
    const r = sleeveRect(i);
    if (x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height) return i;
  }
  return -1;
}
// A finger (or mouse) drags the crate; a tap (under 8 px of travel) on the front sleeve opens its
// Details, on another sleeve brings it to the front; in Details a tap on the sleeve flips it and a tap
// beside it puts it back.
let press = null;
canvas.addEventListener('pointerdown', e => {
  if (!crateMode || inProject >= 0 || !e.isPrimary) return;
  press = { x: e.clientX, y: e.clientY, id: e.pointerId };
  canvas.setPointerCapture(e.pointerId);
  if (!det) { crate.begin(e.clientY, e.timeStamp); wake(); }
});
canvas.addEventListener('pointermove', e => {
  if (!press || e.pointerId !== press.id || det) return;
  crate.move(e.clientY, e.timeStamp);
  syncCrate();
  wake();
});
const endPress = cancel => e => {
  if (!press || e.pointerId !== press.id) return;
  const { x, y } = press;
  press = null;
  const travel = Math.hypot(e.clientX - x, e.clientY - y);
  if (cancel) { crate.cancel(); wake(); return; }
  if (!det) crate.end(e.timeStamp);
  wake();
  if (travel >= 8) return;
  pointer.x = e.clientX; pointer.y = e.clientY;
  if (det) { if (det.exit) return; if (overFocus()) flip(); else closeDetails(); return; }
  const hit = crateHit(e.clientX, e.clientY);
  if (hit < 0) return;
  if (hit === crate.current && Math.abs(crate.p - hit) < 0.05) openDetails(hit);
  else { crate.go(hit); play('tick'); }
};
canvas.addEventListener('pointerup', endPress(false));
canvas.addEventListener('pointercancel', endPress(true));
canvas.addEventListener('lostpointercapture', endPress(true));   // a pointerup that never came (a system gesture, a tab switch)
let wheelAt = 0;
window.addEventListener('wheel', e => {
  if (!crateMode || det || inProject >= 0) return;
  e.preventDefault();
  if (e.timeStamp - wheelAt > 200) crate.wheel(0);
  wheelAt = e.timeStamp;
  crate.wheel(e.deltaY);
  wake();
}, { passive: false });
cbBar.querySelector('.cb-back').addEventListener('click', () => closeDetails());

// ---- Details --------------------------------------------------------------------------------------
function openDetails(i) {
  if (det || !settled[i]) return;
  const s = sleeves[i], now = performance.now();
  s.fall = null;
  if (crateMode) crate.go(i);
  const ret = slotOf(document.activeElement) === i ? document.activeElement : null;   // focus comes back here
  // The sleeve turns its front toward the way it travels (the crate's sleeves rise straight up).
  const dir = !crateMode && s.x > 0 ? -1 : 1;
  det = { i, t0: now, asked: now, backIn: null, from: { ...s.pose }, dir, turn: dir * Math.PI, flip: { from: 0, to: 0, t0: -1e9 }, exit: null, blur: 0, ret };
  s.mesh.layers.set(FOCUS);
  bgDirty = true;
  backFor(i);
  dTitle.textContent = s.entry.name;
  dTag.textContent = s.entry.tag;
  setOpen(dOpen, i);
  setMore(dMore, i);
  dOpen.classList.toggle('paired', !dMore.hidden);
  detailsEl.inert = false; dOpen.inert = false; dMore.inert = false; slotsEl.inert = true;
  document.body.classList.add('in-details');
  const D = DETAILS;
  fade(tagline, 0, D.headerOut.at, D.headerOut.dur);
  for (const el of [dTitle, dTag]) fade(el, 1, D.title.at, D.title.dur);
  for (const el of [dOpen, dMore]) fade(el, 1, D.open.at, D.open.dur);
  film.attach(s);
  detailsEl.focus({ preventScroll: true });   // Tab reaches Open; Space stays the flip
  play('details', { pan: panOf(i) });
  announce(s.entry.tag ? `Details: ${s.entry.name}. ${s.entry.tag}` : `Details: ${s.entry.name}`);
  syncHot();
  wake();
}

function flip() {
  if (!det || det.exit) return;
  const now = performance.now(), P = DETAILS.flip, f = det.flip;
  const yaw = f.from + (f.to - f.from) * bezier(P.ease, clamp01((now - f.t0 - delay(P.at)) / dur(P.dur)));
  det.flip = { from: yaw, to: f.to + det.dir * Math.PI, t0: now };
  play('flip');
  announce(showsBack(det.turn + det.flip.to) ? 'Back of the sleeve' : 'Front of the sleeve');
  wake();
}

function closeDetails() {
  if (!det || det.exit) return;
  const s = sleeves[det.i], now = performance.now(), X = DETAILS.exit;
  // The front is the nearest whole turn; halfway between two (the back), the one that undoes the last
  // turn, so the sleeve turns back the way it came.
  const k = s.pose.yaw / TURN;
  const yawTo = TURN * (det.dir > 0 ? Math.ceil(k - 0.5 - 1e-6) : Math.floor(k + 0.5 + 1e-6));
  const lag = Math.abs(yawTo - s.pose.yaw) < 1e-3 ? 0 : dur(DETAILS.flip.dur) * (1 - TURN_OVERLAP);
  det.exit = { t0: now, from: { ...s.pose }, yawTo, lag, blur: det.blur };
  for (const el of [dTitle, dTag, dOpen, dMore]) fade(el, 0, X.at, X.textOut);
  film.unzoom(true);
  fade(tagline, 1, X.headerIn.at, X.headerIn.dur);
  detailsEl.inert = true; dOpen.inert = true; dMore.inert = true;
  play('close', { pan: panOf(det.i) });
  announce('Back to the shelf');
  wake();
}

// opening: a page is opening over the shelf, so focus stays off the shelf and nothing lifts (or sounds).
function endDetails(s, now, opening = false) {
  const { i } = det, ret = opening ? null : det.ret;
  det = null;
  releaseBack(s);
  s.pose = crateMode ? crate.pose(s) : hoverPose();
  applyPose(s);
  s.mesh.layers.set(0);
  bgDirty = bakeDirty = true;
  slotsEl.inert = false;
  document.body.classList.remove('in-details');
  // The sleeve lands lifted; it stays up if the pointer (or the keyboard focus, returned to the pill
  // that opened Details) is on it.
  if (crateMode) {
    if (ret && ret.isConnected) ret.focus({ preventScroll: true });
    syncCrate(true);
    syncHot();
    return;
  }
  pointerHit = opening ? -1 : hitAt(pointer.x, pointer.y);
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
// The page module loads on demand; the page covers the shelf from its first frame, and the shelf stops
// drawing while it is open.
let view = null, viewP = null, inProject = -1, openedFromShelf = false, openPlayed = false;
const loadView = () => viewP || (viewP = import('./project/project.js').then(m => (view = m.createProjectView({
  renderer, entries, slugOf, onBack: backToShelf,
}))));

function openProject(i) {
  play('open', { pan: det ? 0 : panOf(i) });
  loadView();   // start loading now; the route waits for it
  if (entries[i].kind !== 'about') import('./project/project.js').then(m => m.loadDossier(slugOf(entries[i])));
  openedFromShelf = true;
  openPlayed = true;
  announce(`Open: ${entries[i].name}`);
  location.hash = slugOf(entries[i]);
}

async function route() {
  if (glLost) return;   // the fallback routes from here on
  const slug = decodeURIComponent(location.hash.slice(1));
  const i = entries.findIndex(e => slugOf(e) === slug);
  if (i >= 0) {
    if (i === inProject) return;
    const v = await loadView();
    // The address may have moved on while the page module loaded (Back during a cold load).
    if (entries.findIndex(e => slugOf(e) === decodeURIComponent(location.hash.slice(1))) !== i || i === inProject) return;
    if (det) dropDetails(true);
    setHovered(-1);
    inProject = i;
    for (const a of canvas.getAnimations()) a.finish();   // a deep link skips the canvas fade
    audio?.setRoomTone(false);
    if (!openPlayed) play('open');   // a link or the browser's Forward (Open has played it already)
    openPlayed = false;
    await v.open(i);
  } else if (inProject >= 0) {
    const i0 = inProject;
    inProject = -1;
    view?.close();
    audio?.setRoomTone(true);
    play('close', { pan: panOf(i0) });
    // Back on the shelf with the same sleeve focused (and lifted, as focus does).
    layout();
    if (crateMode) { crate.jump(i0); for (const s of sleeves) if (settled[s.i]) { s.pose = crate.pose(s); applyPose(s); } syncCrate(true); }
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

// Details ends at once when a page opens from it (opening), the view changes between shelf and crate, or
// the context is lost. The tagline comes straight back (its intro fade, cancelled by Details, held it).
function dropDetails(opening = false) {
  const s = sleeves[det.i];
  for (const el of [dTitle, dTag, dOpen, dMore]) for (const a of el.getAnimations()) a.cancel();
  film.detach();
  fade(tagline, 1, 0, 1);
  detailsEl.inert = true; dOpen.inert = true; dMore.inert = true;
  endDetails(s, performance.now(), opening);
  s.fall = null;
  lifted = -1;
}

// Open on a live site is left to the browser (a new tab); Open on a page here, and More detail, open the
// project's page, unless the click asks for a new tab or window of the page's address.
document.addEventListener('click', e => {
  const b = e.target.closest('[data-action][data-index]');
  if (!b) return;
  const i = +b.dataset.index;
  if (b.dataset.action === 'details') { openDetails(i); return; }
  if ((b.dataset.action === 'open' && entries[i].url) || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  openProject(i);
});

// ---- keyboard -------------------------------------------------------------------------------------
// Arrows move between sleeves (left/right along a shelf and on to the next, up/down between shelves),
// Enter opens Details, Space flips, Escape puts the sleeve back. Keyboard focus lifts its sleeve, as the
// pointer does.
const slotOf = el => (el && el.closest && el.closest('.slot') ? slots.indexOf(el.closest('.slot')) : -1);
slotsEl.addEventListener('focusin', e => {
  const i = slotOf(e.target);
  if (i < 0) return;
  if (crateMode) { if (!det) { crate.go(i); wake(); } return; }
  setHovered(i, true);
});
slotsEl.addEventListener('focusout', e => {
  if (slotOf(e.relatedTarget) >= 0) return;
  if (!det) setHovered(pointerHit);
});
window.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey || inProject >= 0 || document.querySelector('dialog.ct[open]')) return;
  if (det) {
    if (film.zoomed) { if (e.key === 'Escape') { e.preventDefault(); film.unzoom(); } return; }
    if (e.key === 'Escape') { e.preventDefault(); closeDetails(); }
    else if (e.key === ' ' || e.code === 'Space') { e.preventDefault(); if (!e.repeat) flip(); }
    return;
  }
  if (crateMode) {
    // The crate: arrows step through it; focus, if it is on the list, moves with the front sleeve.
    const step = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }[e.key];
    if (step === undefined) return;
    e.preventDefault();
    const to = Math.max(0, Math.min(sleeves.length - 1, crate.current + step));
    if (to === crate.current) return;
    crate.go(to);
    const f = slotOf(document.activeElement);
    if (f >= 0) slots[to].querySelector(`[data-action="${document.activeElement.dataset.action}"]`).focus({ preventScroll: true });
    play('tick');
    wake();
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
crate.setReduced(rm.matches);
rm.addEventListener?.('change', e => { setReducedMotion(e.matches); crate.setReduced(e.matches); });

// ---- test hooks -----------------------------------------------------------------------------------
const hooks = {
  count: sleeves.length,
  // The café's sun: whether it is on, and (for a test) a promise for it, which loads it if it isn't yet.
  get sun() { return sunM ? { on: sunOn && sunM.on, fade: sunM.fade } : null; },
  sunReady: () => (sunP || startSun() || Promise.resolve(null)),
  setSun(params) { if (!sunM) return; sunM.setParams(params); sunTickDue = sunSleeves = true; wake(); },
  firstFrameAt: null,
  ready: firstFrame.ready,
  covers: coversReady,
  sleeveRect,
  // The front face's corners on screen, [bottom left, bottom right, top right, top left].
  frontCorners(i) {
    const m = sleeves[i].mesh.matrixWorld, L = SLEEVE.size;
    return [[-L / 2, 0], [L / 2, 0], [L / 2, L], [-L / 2, L]].map(([x, y]) => { corner.set(x, y, SLEEVE.thick).applyMatrix4(m); return project(corner.x, corner.y, corner.z); });
  },
  setCover(i, front, back) { setCover(sleeves[i], front, back); wake(); },
  get project() { return inProject >= 0 ? slugOf(entries[inProject]) : null; },
  get sleevesAt() { return sleevesStart; },
  coverReadyAt,
  appearAt,
  get crate() { return crateMode ? { p: crate.p, current: crate.current, dragging: crate.dragging } : null; },
  set stickerOff(on) { stickerOff = !!on; wake(); },   // a test hides the sticker to find it on screen by difference
  get details() {
    // flipped: the sleeve shows (or is turning to) its back; backIn: ms from the click to its back drawn.
    return det ? { index: det.i, flipped: showsBack(det.turn + det.flip.to), closing: !!det.exit, blur: det.blur, yaw: sleeves[det.i].pose.yaw,
      backIn: det.backIn === null ? null : Math.round(det.backIn - det.asked) } : null;
  },
};
window.__editions = hooks;

layout();
// Draw every program once before the first frame (the canvas is still transparent), so nothing compiles
// mid-motion: the sleeves both fading (transparent) and opaque, and the sticker, each drawn to
// the screen and into the Details background target. Drawing, not just compiling: the GPU driver
// finishes a program on its first draw.
for (const s of sleeves) s.mesh.visible = true;
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
