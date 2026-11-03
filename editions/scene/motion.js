// Sleeve motion, all measured on the reference: the intro drop (a timeline, ms after the first frame),
// the hover lift (each pose value approaches its target exponentially), the fall back when the pointer
// leaves, and eased tweens for Details and the flip.
import { INTRO, SLEEVE, UNHOVER } from './config.js';
import { REST_Z, restPose, hoverPose, POSE_KEYS } from './sleeves.js';

export const HOVER_DELAY = 35;   // the reference responds about two frames after the pointer arrives

const easeIn = u => u * u;
export const clamp01 = u => Math.min(1, Math.max(0, u));

// Reduced motion: long tweens are cut to a short cross-step, state changes stay visible.
let reduce = false;
export const setReducedMotion = on => { reduce = !!on; };
export const reduced = () => reduce;
export const dur = ms => (reduce ? Math.min(ms, 120) : ms);
export const delay = ms => (reduce ? 0 : ms);

// CSS-style cubic-bezier(x1, y1, x2, y2) evaluated at u.
export function bezier([x1, y1, x2, y2], u) {
  if (u <= 0) return 0;
  if (u >= 1) return 1;
  let lo = 0, hi = 1, t = u;
  for (let i = 0; i < 24; i++) {
    t = (lo + hi) / 2;
    const x = 3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t;
    if (x < u) lo = t; else hi = t;
  }
  return 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t;
}
export const lerpPose = (a, b, e) => {
  const p = { ...b };
  for (const k of POSE_KEYS) p[k] = a[k] + (b[k] - a[k]) * e;
  p.opacity = a.opacity + (b.opacity - a.opacity) * e;
  return p;
};

// Times for sleeve i: appears, starts falling, lands, starts leaning, rests.
export function introTimes(i) {
  const appear = INTRO.appear.at + INTRO.appear.stagger * i;
  const drop = INTRO.drop.at + INTRO.drop.stagger * i;
  const land = drop + INTRO.drop.dur;
  const lean = land + INTRO.lean.delay;
  return { appear, drop, land, lean, rest: lean + INTRO.lean.dur };
}

// Pose of sleeve i at intro time t (ms). Returns null once it rests.
export function introPose(i, t) {
  if (reduce) {   // sleeves fade in where they rest, in shelf order
    const a = 200 + 40 * i;
    if (t >= a + 160) return null;
    return { ...restPose(), opacity: clamp01((t - a) / 160) };
  }
  const T = introTimes(i);
  if (t >= T.rest) return null;
  if (t < T.appear) return { ...restPose(), opacity: 0 };
  const A = INTRO.appearPose;
  // Fades in quickly to about two thirds, then clears over ~150 ms (as measured on the reference).
  const opacity = 1 - 0.345 * Math.exp(-(t - T.appear) / 150);
  const p = { ...restPose(), lift: A.lift, z: A.z, lean: 0, opacity };
  if (t < T.drop) return p;
  if (t < T.land) {
    const e = easeIn(clamp01((t - T.drop) / INTRO.drop.dur));
    return { ...p, lift: A.lift * (1 - e), z: A.z + (REST_Z - A.z) * e };
  }
  const e = easeIn(clamp01((t - T.lean) / INTRO.lean.dur));
  return { ...p, lift: 0, z: REST_Z, lean: SLEEVE.lean * e };
}

// Hover: a first-order approach to the hover pose. Returns true while still moving.
export function stepHover(s, dt) {
  const target = hoverPose();
  const k = 1 - Math.exp(-dt / (reduce ? 0.04 : SLEEVE.hoverTau));
  let moving = false;
  for (const key of POSE_KEYS) {
    const d = target[key] - s.pose[key];
    if (Math.abs(d) > 1e-3) { s.pose[key] += d * k; moving = true; } else s.pose[key] = target[key];
  }
  s.pose.opacity = 1;
  return moving;
}

// Off the sleeve: from pose `from`, t ms after the pointer left. Returns null once at rest.
export function fallPose(from, t) {
  const U = reduce ? { delay: 0, drop: 90, pause: 0, lean: 60 } : UNHOVER;
  const R = restPose();
  if (t < U.delay) return { ...from };
  const td = t - U.delay;
  const upright = { ...R, lean: Math.min(from.lean, R.lean) };
  if (td < U.drop) return lerpPose(from, upright, easeIn(td / U.drop));
  const tl = td - U.drop - U.pause;
  if (tl < 0) return upright;
  if (tl < U.lean) return lerpPose(upright, R, easeIn(tl / U.lean));
  return null;
}
