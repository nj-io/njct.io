// Sleeve motion: the intro drop (a timeline, ms after the first frame) and the hover lift (each pose
// value approaches its target exponentially, as the reference does).
import { INTRO, SLEEVE } from './config.js';

export const HOVER_DELAY = 35;
import { REST_Z, restPose, hoverPose } from './sleeves.js';

const easeIn = u => u * u;
const clamp01 = u => Math.min(1, Math.max(0, u));

// Times for sleeve i: appears, starts falling, lands, starts leaning, rests.
export function introTimes(i) {
  const appear = INTRO.appear.at + INTRO.appear.stagger * i;
  const drop = INTRO.drop.at + INTRO.drop.stagger * i;
  const land = drop + INTRO.drop.dur;
  const lean = land + INTRO.lean.delay;
  return { appear, drop, land, lean, rest: lean + INTRO.lean.dur };
}
export const INTRO_END = introTimes(9).rest;

// Pose of sleeve i at intro time t (ms). Returns null once it rests.
export function introPose(i, t) {
  const T = introTimes(i);
  if (t >= T.rest) return null;
  if (t < T.appear) return { ...restPose(), opacity: 0 };
  const A = INTRO.appearPose;
  // Fades in quickly to about two thirds, then clears over ~150 ms (as measured on the reference).
  const opacity = 1 - 0.345 * Math.exp(-(t - T.appear) / 150);
  if (t < T.drop) return { lift: A.lift, z: A.z, lean: 0, opacity };
  if (t < T.land) {
    const e = easeIn(clamp01((t - T.drop) / INTRO.drop.dur));
    return { lift: A.lift * (1 - e), z: A.z + (REST_Z - A.z) * e, lean: 0, opacity };
  }
  const e = easeIn(clamp01((t - T.lean) / INTRO.lean.dur));
  return { lift: 0, z: REST_Z, lean: SLEEVE.lean * e, opacity };
}

// Hover: one first-order approach per sleeve, toward the target the pointer set HOVER_DELAY ms ago
// (the reference responds about two frames after the pointer arrives). Returns true while moving.
export function stepHover(s, hovered, dt) {
  const target = hovered ? hoverPose() : restPose();
  const k = 1 - Math.exp(-dt / SLEEVE.hoverTau);
  let moving = false;
  for (const key of ['lift', 'z', 'lean']) {
    const d = target[key] - s.pose[key];
    if (Math.abs(d) > 1e-3) { s.pose[key] += d * k; moving = true; } else s.pose[key] = target[key];
  }
  s.pose.opacity = 1;
  return moving;
}
