// Timing helpers shared by the shelf's motion (motion.js re-exports them) and the project page, apart from
// the sleeve poses so the page and the no-WebGL shelf load them without three.js.
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
