// The café's three views, in a line: Counter <- Editions -> Table (rounds 2 and 3). Editions is v1's
// shelf, on its long lens; the two room views are angled, the camera level, framed by shifting the lens.
// Leaving Editions the camera walks in as its lens widens, holding the record wall at its size, so the
// café opens around it; partway in it turns to the view and settles. Coming back takes the same path in
// reverse and ends on layout()'s own camera, so Editions is v1's frame exactly.
//
// The edge buttons and the left and right arrow keys move along the line (the arrows only while focus is
// off the sleeve list and the Projects menu); the outer button hides at each end. #counter and #table
// open facing that view. Each view's text is HTML (index.html .view-html; Editions' is the sleeve list),
// and only the facing view's is live. Desktop only: a fine pointer that hovers, a window of at least
// 1024 x 640, wider than 1.2 to 1. A move waits for Details and project pages, and cuts under reduced
// motion. The room's shapes (room/shell.js) load at idle, after the sun, and draw only off Editions.
import * as THREE from 'three';
import { CAFE } from '../scene/config.js';
import { clamp01, reduced } from '../scene/ease.js';

const ORDER = ['counter', 'editions', 'table'];
export const VIEW_NAMES = { counter: 'Counter', editions: 'Editions', table: 'Table' };
export const viewOfHash = h => (h === 'counter' || h === 'table' ? h : null);
const smooth = u => u * u * (3 - 2 * u);
const DEG = Math.PI / 180;

// o: camera, canTurn(), view() -> { W, H, hh, camZ, shift } (Editions as layout() set it), relayout(),
// onAway(away), load() -> Promise<shell>, wake(), announce(text), play(name).
export function createRoom(o) {
  const { camera } = o;
  let at = 'editions', move = null, shell = null, shellP = null, queued = 0;
  const nav = document.querySelector('.room-nav');
  const prev = nav.querySelector('.rn-prev'), next = nav.querySelector('.rn-next');
  const mirrors = { editions: document.getElementById('slots'), counter: document.querySelector('.view-html[data-view="counter"]'), table: document.querySelector('.view-html[data-view="table"]') };
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const allowed = () => fine.matches && innerWidth >= 1024 && innerHeight >= 640 && innerWidth / innerHeight >= 1.2;

  // ---- poses ------------------------------------------------------------------------------------------
  const ID = new THREE.Quaternion(), tmpQ = new THREE.Quaternion(), tmpE = new THREE.Euler(0, 0, 0, 'YXZ');
  function roomPose(name) {
    const v = CAFE.views[name], { H } = o.view();
    const pos = new THREE.Vector3(...v.pos), d = new THREE.Vector3(...v.look).sub(pos);
    const quat = new THREE.Quaternion().setFromEuler(tmpE.set(0, Math.atan2(-d.x, -d.z), 0));
    // The look point sits at `frame` of the height from the top: the lens shifts, the camera stays level.
    const f = (H / 2) / Math.tan(v.fov * DEG / 2), elev = d.y / Math.hypot(d.x, d.z);
    return { pos, quat, fov: v.fov, shift: H / 2 - f * elev - v.frame * H };
  }
  // u: 0 at Editions, 1 at the room view; the walk-in leads, the turn follows.
  function poseAt(name, u) {
    const w = CAFE.views.walk, V = roomPose(name), { hh, camZ, shift } = o.view();
    const a = smooth(clamp01(u / w.walkTo)), b = smooth(clamp01((u - w.turnAt) / (1 - w.turnAt)));
    const zA = hh * w.reveal / Math.tan(w.fov * DEG / 2), z = camZ + (zA - camZ) * a;
    const pos = new THREE.Vector3(0, 0, z).addScaledVector(V.pos.clone().sub(new THREE.Vector3(0, 0, zA)), b);
    const fov = 2 * Math.atan(hh * (1 + (w.reveal - 1) * a) / z) / DEG;
    return { pos, quat: tmpQ.slerpQuaternions(ID, V.quat, b).clone(), fov: fov + (V.fov - fov) * b, shift: shift + (V.shift - shift) * b, grade: b };
  }
  let grade = 0;   // the finishing pass's strength: 0 on Editions, 1 in a room view, along the turn between
  function apply(p) {
    grade = p.grade ?? 1;
    const { W, H } = o.view();
    camera.position.copy(p.pos);
    camera.quaternion.copy(p.quat);
    camera.fov = p.fov;
    if (Math.abs(p.shift) > 1e-3) camera.setViewOffset(W, H, 0, p.shift, W, H); else camera.clearViewOffset();
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  }

  // ---- state ------------------------------------------------------------------------------------------
  const away = () => at !== 'editions' || !!move;
  function sync() {
    const i = ORDER.indexOf(at), ok = allowed();
    nav.hidden = !ok;
    const l = ORDER[i - 1], r = ORDER[i + 1];
    prev.hidden = !l || !!move; next.hidden = !r || !!move;
    if (l) { prev.querySelector('.rn-name').textContent = VIEW_NAMES[l]; prev.setAttribute('aria-label', `Turn to ${VIEW_NAMES[l]}`); }
    if (r) { next.querySelector('.rn-name').textContent = VIEW_NAMES[r]; next.setAttribute('aria-label', `Turn to ${VIEW_NAMES[r]}`); }
    for (const [k, m] of Object.entries(mirrors)) if (m) { const off = k !== at || !!move; m.inert = off; m.toggleAttribute('aria-hidden', off && k !== 'editions'); }
    document.body.classList.toggle('room-away', away());
    o.onAway(away());
    shell?.setVisible(away());
  }
  function address() {
    const want = at === 'editions' ? '' : `#${at}`;
    if (location.hash !== want) history.replaceState(history.state, '', want || location.pathname + location.search);
  }
  const loadShell = () => shellP || (shellP = o.load().then(s => { shell = s; sync(); return s; }));

  // Go to view `to`, moving through the line one step at a time (Counter and Table are one step from
  // Editions). instant: a cut (a deep link, reduced motion).
  async function go(to, { instant = false } = {}) {
    if (!ORDER.includes(to) || !allowed()) return;
    if (move) { queued = ORDER.indexOf(to) - ORDER.indexOf(move.to); return; }   // relative to where the move ends
    if (to === at) return;
    if (!o.canTurn()) return;
    if (to !== 'editions' && at !== 'editions') { await go('editions', { instant }); if (at !== 'editions') return; }
    await loadShell();
    if (!o.canTurn()) return;
    const room = to === 'editions' ? at : to, from = to === 'editions' ? 1 : 0;
    o.play('tick');
    o.announce(VIEW_NAMES[to]);
    if (instant || reduced()) { at = to; finish(room); return; }
    move = { room, to, from, t0: performance.now(), ms: CAFE.views.walk.ms };
    sync();
    o.wake();
  }
  function finish(room) {
    move = null;
    if (at === 'editions') o.relayout(); else apply(poseAt(room, 1));
    sync();
    address();
    o.wake();
    if (queued) { const q = queued; queued = 0; step(q); }
  }
  function step(dir) {
    if (move) { queued = Math.sign(dir); return; }
    const to = ORDER[ORDER.indexOf(at) + Math.sign(dir)];
    if (to) go(to);
  }

  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  for (const q of [fine]) q.addEventListener?.('change', () => { if (!allowed() && at !== 'editions') { at = 'editions'; move = null; o.relayout(); } sync(); });
  sync();

  return {
    get at() { return at; },
    get away() { return away(); },
    get allowed() { return allowed(); },
    get moving() { return !!move; },
    go, step,
    load: loadShell,
    // The frame loop: the camera along the move; returns whether it still moves.
    stepFrame(now) {
      if (!move) return false;
      const k = clamp01((now - move.t0) / move.ms), u = move.from === 0 ? k : 1 - k;
      if (k >= 1) { at = move.to; finish(move.room); return false; }
      apply(poseAt(move.room, u));
      return true;
    },
    // After layout() has set Editions' camera: put a room view's camera back (the window changed size).
    relayout() {
      if (!allowed() && at !== 'editions') { at = 'editions'; move = null; sync(); o.relayout(); return; }
      if (at !== 'editions' && !move) apply(poseAt(at, 1));
      sync();
    },
    get shell() { return shell; },
    get grade() { return at === 'editions' && !move ? 0 : grade; },
    // A test's view of a pose along the move (0 Editions, 1 the view), held still.
    hold(name, u) { move = null; if (u <= 0) { at = 'editions'; o.relayout(); sync(); o.wake(); return; } at = name; apply(poseAt(name, u)); sync(); o.wake(); },
  };
}
