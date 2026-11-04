// The phone crate: the sleeves stand in a crate front to back in lineup order, leaning back, and the
// visitor flips through them with a finger. Measured on the reference at 390x844, DPR 2
// (build/compare/devices.mjs): the front sleeve is 68.2% of the screen wide and shows 56% of its height
// (a lean of 56 degrees), its bottom edge at 79.7% of the screen height; each sleeve behind it shows a strip
// 12.4% of the sleeve's width; the sleeves already passed lie flatter in front of it and below, about 7%
// each. A drag of 150 px moves one sleeve, and the crate follows the finger; on release it carries on
// with the finger's speed for 60 ms worth (a flick of 250 px in 120 ms moves two) and settles on the
// nearest sleeve in about 600 ms. A trackpad or wheel moves one sleeve per notch, the arrow keys too.
import * as THREE from 'three';
import { SLEEVE } from './config.js';
import { restPose } from './sleeves.js';

export const CRATE = {
  width: 0.682, bottom: 0.797,
  // The camera stands at 0.4 of the shelf's distance, close enough that the crate reads in perspective (the
  // sleeves narrow toward the back), and the sleeves stand at 24 degrees from upright (operator, 4 Nov 2026;
  // the reference's 56 degrees, seen from four times the shelf's distance, read flat and squashed).
  camera: 0.4,
  lean: 24 * Math.PI / 180, strip: 0.124, top: 132,      // px: the back strips stay below the header
  flatLean: 78 * Math.PI / 180, flatStrip: 0.07, flatMax: 4,
  drag: 150, carry: 0.06, omega: 8.5,
  details: { size: 0.815, centreY: 0.404 },              // the sleeve in Details: share of the width, centre height
  wheelNotch: 60,
  // The crate casts a soft shadow to its left: from the screen's left edge to its centre, 40.3% to 79.4% of
  // the screen height, 5.4% darker in display terms, with 20 px soft edges.
  // The ground at the shelf's own brightness, and the covers' light 2.5 times the shelf's: leaning toward the
  // visitor, each front faces a little down, away from the room's light, and without this read darker
  // than the same cover on the shelf (Topshine's front measured within 2 levels of the shelf's at 2.5).
  groundGain: 1, coverLight: 2.5, edgeColour: 0x1c1c1c,
  shadow: { y0: 0.403, y1: 0.794, alpha: 0.054, feather: 20 },
};

// The crate's shadow on the ground: a soft-edged rectangle drawn over the wall in display terms.
export function createCrateShadow() {
  const mat = new THREE.ShaderMaterial({
    uniforms: { uSize: { value: new THREE.Vector2(1, 1) }, uFeather: { value: 1 }, uAlpha: { value: CRATE.shadow.alpha } },
    vertexShader: `varying vec2 vP; uniform vec2 uSize; void main() { vP = uv * uSize; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `varying vec2 vP; uniform vec2 uSize; uniform float uFeather, uAlpha;
      void main() { float d = min(vP.y, uSize.y - vP.y);   // soft top and bottom; it runs off the left edge and under the crate
        gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha * smoothstep(0.0, uFeather, d)); }`,
    transparent: true, depthWrite: false, toneMapped: false,   // depth-tested: the sleeves stand in front of it
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
  mesh.renderOrder = -0.5;   // after the wall, before the sleeves
  mesh.visible = false;
  return {
    mesh,
    // 0..1: the shadow comes in with the sleeves in the intro.
    setOpacity(k) { mat.uniforms.uAlpha.value = CRATE.shadow.alpha * k; },
    // Screen W x H at S px per world unit on the wall plane.
    layout(W, H, S) {
      const x0 = -W / 2 / S - 2, x1 = 0, y0 = (H / 2 - CRATE.shadow.y1 * H) / S, y1 = (H / 2 - CRATE.shadow.y0 * H) / S;
      mesh.scale.set(x1 - x0, y1 - y0, 1);
      mesh.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0.5);
      mesh.updateMatrixWorld();
      mat.uniforms.uSize.value.set(x1 - x0, y1 - y0);
      mat.uniforms.uFeather.value = CRATE.shadow.feather / S;
    },
  };
}

export function createCrate(count) {
  const L = SLEEVE.size;
  let p = 0, v = 0, target = 0, drag = null, wheelAcc = 0, reduce = false;
  let Yb = 0, STEP = 0, ZS = 0, FS = 0, Z0 = 0, S0 = 1;
  const clampI = i => Math.max(0, Math.min(count - 1, i));

  // The crate stands in front of the wall (Z0 out from it, so the backmost sleeve's top clears the wall);
  // Sf, the scale at the front sleeve's depth, sets its width on screen. Returns S, the scale at the wall
  // plane, for a camera camZ from the wall.
  function layout(W, H, camZ) {
    const Sf = CRATE.width * W / L;
    Yb = (H / 2 - CRATE.bottom * H) / Sf;
    const frontTop = CRATE.bottom * H - L * Sf * Math.cos(CRATE.lean);
    STEP = Math.min(CRATE.strip * L, count > 1 ? Math.max(0, frontTop - CRATE.top) / (count - 1) / Sf : 0);
    ZS = STEP * Math.tan(CRATE.lean) + 4;    // each plane sits behind the one in front of it
    FS = CRATE.flatStrip * L;
    Z0 = (count - 1) * ZS + 10;   // the backmost sleeve's foot clears the wall; every sleeve leans toward the camera
    S0 = Sf * (camZ - Z0) / camZ;
    return S0;
  }
  const flatOff = k => FS * CRATE.flatMax * (1 - Math.exp(-k / CRATE.flatMax));

  // Sleeve s's pose at crate position p (d: its place from the front; negative once passed).
  function pose(s) {
    const d = s.i - p, q = restPose();
    q.dx = -s.x;
    // As in a record crate seen from above: the sleeves stand front to back, each leaning toward the
    // visitor (its top nearer than its foot), the ones behind standing higher; a flipped sleeve falls
    // forward toward the visitor, its back up, and drops out below.
    if (d >= 0) {
      q.lean = -CRATE.lean; q.lift = Yb + d * STEP - s.shelfY; q.z = Z0 - d * ZS;
    } else {
      const k = -d, u = Math.min(1, k);
      q.lean = -(CRATE.lean + (CRATE.flatLean - CRATE.lean) * u);
      q.lift = Yb - flatOff(k) - s.shelfY;
      q.z = Z0 + 0.25 * L * u + 5 * Math.max(0, flatOff(k) - flatOff(1));
      // Only the last two flipped show: the one before fades as it drops, so the pile never reaches the bar.
      q.opacity = Math.max(0, Math.min(1, 2.5 - k));
    }
    return q;
  }

  // Critically damped spring to the target; returns whether anything still moves.
  function step(dt) {
    if (drag) return true;
    const w = reduce ? 30 : CRATE.omega;
    const a = w * w * (target - p) - 2 * w * v;
    v += a * dt; p += v * dt;
    if (Math.abs(target - p) < 1e-3 && Math.abs(v) < 1e-2) { p = target; v = 0; return false; }
    return true;
  }

  return {
    layout, pose, step,
    get p() { return p; },
    get current() { return clampI(Math.round(drag ? p : target)); },
    get dragging() { return !!drag; },
    setReduced(on) { reduce = !!on; },
    go(i) { target = clampI(i); },
    jump(i) { target = p = clampI(i); v = 0; },
    // Finger (or mouse) down at screen y, time t (ms).
    begin(y, t) { drag = { y0: y, p0: p, samples: [[t, y]] }; v = 0; },
    move(y, t) {
      if (!drag) return;
      let q = drag.p0 + (y - drag.y0) / CRATE.drag;
      // Past either end the crate gives a little, at a third of the finger's travel.
      if (q < 0) q /= 3; else if (q > count - 1) q = count - 1 + (q - count + 1) / 3;
      p = q;
      drag.samples.push([t, y]);
      while (drag.samples.length > 2 && t - drag.samples[0][0] > 100) drag.samples.shift();
    },
    end(t) {
      if (!drag) return 0;
      const s = drag.samples, a = s[0], b = s[s.length - 1];
      const moved = Math.abs(b[1] - drag.y0);
      const vy = b[0] - a[0] > 8 && t - b[0] < 80 ? (b[1] - a[1]) / (b[0] - a[0]) * 1000 : 0;   // px/s
      drag = null;
      v = Math.max(-12, Math.min(12, vy / CRATE.drag));
      target = clampI(Math.round(p + (reduce ? 0 : v * CRATE.carry)));
      if (reduce) v = 0;
      return moved;
    },
    cancel() { if (drag) { drag = null; target = clampI(Math.round(p)); } },
    wheel(dy) {
      wheelAcc += dy;
      while (Math.abs(wheelAcc) >= CRATE.wheelNotch) { const s = Math.sign(wheelAcc); target = clampI(target + s); wheelAcc -= s * CRATE.wheelNotch; }
    },
  };
}
