// Sleeve motion, all measured on the reference: the intro drop (a timeline, ms after the first frame),
// the hover lift (each pose value approaches its target exponentially), the fall back when the pointer
// leaves, and eased tweens for Details and the flip.
import { INTRO, SLEEVE, UNHOVER } from './config.js';
import { REST_Z, restPose, hoverPose, POSE_KEYS } from './sleeves.js';
import { clamp01, reduced } from './ease.js';

export { clamp01, setReducedMotion, reduced, dur, delay, bezier } from './ease.js';

export const HOVER_DELAY = 15;   // the reference's sleeve first moves in the third frame after the pointer arrives

const easeIn = u => u * u;
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

// When sleeve i is due to appear on the shelves (intro ms), with or without reduced motion.
export const appearTime = i => (reduced() ? 200 + 40 * i : introTimes(i).appear);

// Pose of sleeve i at intro time t (ms). Returns null once it rests.
export function introPose(i, t) {
  if (reduced()) {   // sleeves fade in where they rest, in shelf order
    const a = appearTime(i);
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
  const k = 1 - Math.exp(-dt / (reduced() ? 0.04 : SLEEVE.hoverTau));
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
  const U = reduced() ? { delay: 0, drop: 90, pause: 0, lean: 60 } : UNHOVER;
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
