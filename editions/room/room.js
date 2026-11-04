// The room: the record wall (wall 1, the v1 scene, unchanged) and three more walls around the camera.
// Left and right turn the camera 90 degrees about its own position, only when the visitor asks: the
// buttons at the screen's edges (each named for the wall it turns to), the arrow keys, a swipe, or a wall
// on the room map. A turn is a camera move with the map's cone turning as it goes (the orientation cue);
// under reduced motion it is an instant cut. Turning waits while Details or a project page is open.
//
// Walls 2-4 are built by walls.js, a lazy chunk, only when they become the facing wall or its neighbour,
// and dropped when they stop being one; the intro never waits on them. Each wall's text is HTML (the
// .wall-html sections in index.html; wall 1's is the shelf list): only the facing wall's is live, so
// focus and the screen reader follow the wall in front. #wall-2 ... #wall-4 open facing that wall.
//
// Wall k (0-based) faces the camera from yaw -k * 90 degrees: wall 2 to the right of the record wall,
// wall 3 behind it, wall 4 to the left (proposals.md leaves the sides open).
import { bezier, clamp01, reduced } from '../scene/ease.js';

export const WALLS = [
  { name: 'Record wall', slug: '' },
  { name: 'Wall 2', slug: 'wall-2' },
  { name: 'Wall 3', slug: 'wall-3' },
  { name: 'Wall 4', slug: 'wall-4' },
];
const Q = Math.PI / 2;
const TURN = { dur: 760, ease: [0.45, 0, 0.25, 1] };   // ms for 90 degrees; a half turn takes 1.4x
const mod4 = k => ((k % 4) + 4) % 4;
export const wallOfSlug = slug => WALLS.findIndex((w, k) => k > 0 && w.slug === slug);

// opts: renderer, scene, camera, uniforms (the record wall's light), canTurn(), onAway(away), wake(),
// announce(text), play(name).
export function createRoom(opts) {
  const { camera } = opts;
  let facing = 0, yaw = 0, turn = null, queued = 0, lay = null;
  let walls = null, wallsP = null;   // the walls.js instance, once loaded
  const nav = document.querySelector('.room-nav');
  const prevBtn = nav.querySelector('.rn-prev'), nextBtn = nav.querySelector('.rn-next');
  const cone = nav.querySelector('.rm-cone');
  const mapBtns = [...nav.querySelectorAll('.rm-wall')];
  const mirrors = [document.getElementById('slots'), ...[1, 2, 3].map(k => document.querySelector(`.wall-html[data-wall="${k + 1}"]`))];

  const load = () => wallsP || (wallsP = import('./walls.js').then(m => {
    walls = m.createWalls(opts.renderer, opts.scene, opts.uniforms, WALLS);
    if (lay) walls.layout(lay);
    return walls;
  }));
  // Build the walls a view of wall k needs (k and its neighbours; a half turn also the one passed on the
  // way), drop the rest.
  async function need(ks) {
    const w = await load();
    await w.keep(ks.filter(k => k > 0));
    opts.wake();
  }
  const around = k => [k, mod4(k - 1), mod4(k + 1)];

  function syncNav() {
    const l = mod4(facing - 1), r = mod4(facing + 1);
    prevBtn.querySelector('.rn-name').textContent = WALLS[l].name;
    nextBtn.querySelector('.rn-name').textContent = WALLS[r].name;
    prevBtn.setAttribute('aria-label', `Turn left to ${WALLS[l].name}`);
    nextBtn.setAttribute('aria-label', `Turn right to ${WALLS[r].name}`);
    mapBtns.forEach((b, k) => {
      b.setAttribute('aria-current', k === facing ? 'true' : 'false');
      b.setAttribute('aria-label', k === facing ? `${WALLS[k].name}, facing` : `Turn to ${WALLS[k].name}`);
    });
    mirrors.forEach((m, k) => { if (m) { m.inert = k !== facing; m.toggleAttribute('aria-hidden', k !== facing); } });
  }
  function syncCone() { cone.style.transform = `rotate(${(-yaw * 180 / Math.PI).toFixed(2)}deg)`; }

  function setAway() {
    const away = facing !== 0 || !!turn;
    document.body.classList.toggle('room-away', away);
    walls?.setSurround(away);
    opts.onAway(away);
  }
  function setYaw(y) {
    yaw = y;
    camera.rotation.set(0, y, 0);
    camera.updateMatrixWorld();
    syncCone();
  }
  function address() {
    const slug = WALLS[facing].slug;
    const want = slug ? `#${slug}` : '';
    if (location.hash !== want) history.replaceState(history.state, '', want || location.pathname + location.search);
  }

  // Turn by steps (-1 left, +1 right, 2 a half turn); a press during a turn waits for it to end.
  async function turnBy(steps, { instant = false } = {}) {
    if (!steps || !opts.canTurn()) return;
    if (turn) { queued = Math.sign(steps); return; }
    const to = mod4(facing + steps);
    const pass = Math.abs(steps) === 2 ? [mod4(facing + Math.sign(steps))] : [];
    turn = { pending: true };   // held while the walls on the way are built
    setAway();
    await need([facing, to, ...pass, ...around(to)]);
    if (!opts.canTurn()) { turn = null; setAway(); return; }
    const from = yaw, target = from - steps * Q;
    facing = to;
    syncNav();
    opts.play('tick');
    opts.announce(`Facing ${WALLS[to].name}`);
    if (instant || reduced()) { turn = null; setYaw(target); settle(); return; }
    turn = { from, target, t0: performance.now(), ms: TURN.dur * (Math.abs(steps) === 2 ? 1.4 : 1) };
    opts.wake();
  }
  function settle() {
    // Keep the yaw in one turn's range, exactly on the wall (wall 1's camera then matches v1 exactly).
    setYaw(-facing * Q === 0 ? 0 : -facing * Q);
    setAway();
    address();
    need(around(facing));
    opts.wake();
    if (queued) { const q = queued; queued = 0; turnBy(q); }
  }

  function face(k, { instant = true } = {}) {
    k = mod4(k);
    if (k === facing && !turn) return;
    const d = mod4(k - facing);
    turnBy(d === 3 ? -1 : d, { instant });
  }

  prevBtn.addEventListener('click', () => turnBy(-1));
  nextBtn.addEventListener('click', () => turnBy(1));
  mapBtns.forEach((b, k) => b.addEventListener('click', () => face(k, { instant: false })));
  syncNav();
  syncCone();

  return {
    WALLS,
    get facing() { return facing; },
    get turning() { return !!turn; },
    get away() { return facing !== 0 || !!turn; },
    turn: steps => turnBy(steps),
    face,
    // After the intro, at idle: the record wall's neighbours.
    warm() { need(around(facing)); },
    load,
    // The frame loop: the camera's yaw while a turn runs; returns whether it still moves.
    step(now) {
      if (!turn || turn.pending) return false;
      const u = clamp01((now - turn.t0) / turn.ms);
      setYaw(turn.from + (turn.target - turn.from) * bezier(TURN.ease, u));
      if (u < 1) return true;
      turn = null;
      settle();
      return false;
    },
    // The view (main.js layout): camera distance, scale, the visible rectangle and the light mapping.
    layout(l) {
      lay = l;
      walls?.layout(l);
    },
    get state() { return { facing, yaw, turning: !!turn, built: walls ? walls.built() : [] }; },
  };
}
