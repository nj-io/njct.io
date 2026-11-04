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
// 1024 x 640, between 1.2 and 2.35 to 1 (wider, the café's edges would enter Editions' frame). A move
// waits for Details and project pages, and cuts under reduced motion. The room's shapes (room/shell.js)
// load at idle, after the sun (or when the window first allows the café), and draw only off Editions.
import * as THREE from 'three';
import { CAFE } from '../scene/config.js';
import { clamp01, reduced } from '../scene/ease.js';

const ORDER = ['counter', 'editions', 'table'];
export const VIEW_NAMES = { counter: 'Counter', editions: 'Editions', table: 'Table' };
export const viewOfHash = h => (h === 'counter' || h === 'table' ? h : null);
const smooth = u => u * u * (3 - 2 * u);
const DEG = Math.PI / 180;

// o: camera, canTurn(), canPreload(), view() -> { W, H, hh, camZ, shift } (Editions as layout() set it),
// relayout() (layout(): Editions' camera, whole), onAway(away), load() -> Promise<shell>, wake(),
// announce(text), play(name).
export function createRoom(o) {
  const { camera } = o;
  // queued: the view a press asked for while a move or the café's load was under way, and how to get there
  // pending: the view a go() is waiting on the café's load to reach
  let at = 'editions', move = null, shell = null, shellP = null, pending = null, queued = null;
  const nav = document.querySelector('.room-nav');
  const prev = nav.querySelector('.rn-prev'), next = nav.querySelector('.rn-next');
  const mirrors = { editions: document.getElementById('slots'), counter: document.querySelector('.view-html[data-view="counter"]'), table: document.querySelector('.view-html[data-view="table"]') };
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const allowed = () => fine.matches && innerWidth >= 1024 && innerHeight >= 640 && innerWidth / innerHeight >= 1.2 && innerWidth / innerHeight <= 2.35;

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
    // During a move the buttons stay as they were, marked busy, so keyboard focus stays on them.
    for (const [b, name] of [[prev, ORDER[i - 1]], [next, ORDER[i + 1]]]) {
      b.hidden = !name;
      b.toggleAttribute('aria-disabled', !!move);
      if (name) { b.querySelector('.rn-name').textContent = VIEW_NAMES[name]; b.setAttribute('aria-label', `Turn to ${VIEW_NAMES[name]}`); }
    }
    for (const [k, m] of Object.entries(mirrors)) if (m) { const off = k !== at || !!move; m.inert = off; m.toggleAttribute('aria-hidden', off && k !== 'editions'); }
    document.body.classList.toggle('room-away', away());
    o.onAway(away());
    shell?.setVisible(away());
  }
  function address() {
    const want = at === 'editions' ? '' : `#${at}`;
    if (location.hash !== want) history.replaceState(history.state, '', want || location.pathname + location.search);
  }
  // A failed load is forgotten, so a later press tries again.
  const loadShell = () => shellP || (shellP = o.load().then(s => { shell = s; sync(); return s; }, e => { shellP = null; throw e; }));
  const idle = f => (window.requestIdleCallback || (g => setTimeout(g, 300)))(f, { timeout: 3000 });
  // The window allows the café only now (it didn't when the sun came in): fetch it at idle.
  function preload() { if (!shellP && allowed() && o.canPreload()) idle(() => { if (allowed()) loadShell().catch(e => console.warn(`room: ${e?.message || e}`)); }); }

  // Go to view `to`, through Editions between Counter and Table. instant: a cut (a deep link, reduced
  // motion). A press during a move or the load waits for it, as the view it asked for.
  async function go(to, { instant = false } = {}) {
    if (!ORDER.includes(to) || !allowed()) return;
    if (move || pending) { queued = { to, instant }; return; }
    if (to === at || !o.canTurn()) return;
    if (!shell) {
      pending = to;
      try { await loadShell(); } catch (e) { console.warn(`room: ${e?.message || e}`); queued = null; return; } finally { pending = null; }
      if (to === at || !allowed() || !o.canTurn()) { drain(); return; }
    }
    if (to !== 'editions' && at !== 'editions') { queued = { to, instant }; to = 'editions'; }
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
    const had = document.activeElement;
    if (at === 'editions') o.relayout(); else apply(poseAt(room, 1));
    sync();
    if ((had === prev || had === next) && had.hidden) (prev.hidden ? next : prev).focus({ preventScroll: true });
    address();
    o.wake();
    drain();
  }
  function drain() { if (queued && !move) { const q = queued; queued = null; go(q.to, { instant: q.instant }); } }
  // One step along the line from where things will stand once what is under way has finished.
  function step(dir) {
    const from = queued ? queued.to : pending || (move ? move.to : at), to = ORDER[ORDER.indexOf(from) + Math.sign(dir)];
    if (to) go(to);
  }
  // Back to Editions at once, wherever things stand: the window no longer allows the café, or a project
  // page opened over a move (keepAddress: the page's own address stays).
  function home({ keepAddress = false } = {}) {
    if (at === 'editions' && !move) return;
    at = 'editions'; move = null; queued = null;
    o.relayout();
    sync();
    if (!keepAddress) address();
    o.wake();
  }

  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  fine.addEventListener?.('change', () => { if (!allowed()) home(); else preload(); sync(); });
  sync();

  return {
    get at() { return at; },
    get away() { return away(); },
    get allowed() { return allowed(); },
    get moving() { return !!move; },
    go, step, home,
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
      if (!allowed() && away()) { home(); return; }
      if (at !== 'editions' && !move) apply(poseAt(at, 1));
      preload();
      sync();
    },
    get shell() { return shell; },
    get grade() { return at === 'editions' && !move ? 0 : grade; },
    // A test's view of a pose along the move (0 Editions, 1 the view), held still.
    hold(name, u) { move = null; if (u <= 0) { at = 'editions'; o.relayout(); sync(); o.wake(); return; } at = name; apply(poseAt(name, u)); sync(); o.wake(); },
  };
}
