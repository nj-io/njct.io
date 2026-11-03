// Ten sleeves: thin card boxes standing on the shelves, each holding a record. A sleeve's pose is its
// bottom edge's height above its shelf (lift), that edge's distance from the wall (z), its lean back
// toward the wall (pivoting on that edge), a sideways offset (dx), a turn about its own vertical axis
// (yaw, for the flip) and how far its record is drawn out (rec, along recDir). Poses also drive the
// occluders the wall and shelf shaders use.
import * as THREE from 'three';
import { SHELF, SLEEVE } from './config.js';
import { createRecord, RECORD_R } from './record.js';
import { NEUTRAL_GLSL } from './tonemap.js';

const L = SLEEVE.size;
export const REST_Z = L * Math.sin(SLEEVE.lean);      // the top edge then touches the wall
const base = { dx: 0, yaw: 0, rec: 0, recX: 0, recY: 0, opacity: 1 };
export const restPose = () => ({ ...base, lift: 0, z: REST_Z, lean: SLEEVE.lean });
export const hoverPose = () => ({ ...base, lift: SLEEVE.hoverLift, z: SLEEVE.hoverZ, lean: 0, rec: SLEEVE.hoverRecord, recY: 1 });
export const POSE_KEYS = ['lift', 'z', 'lean', 'dx', 'yaw', 'rec', 'recX', 'recY'];

const NEUTRAL = '#d9d6d0'; // flat front for entries without an accent

// Sleeve materials tone-map in their own shader (see tonemap.js).
export function neutral(mat) {
  mat.onBeforeCompile = sh => {
    sh.fragmentShader = sh.fragmentShader
      .replace('void main() {', `${NEUTRAL_GLSL}\nvoid main() {`)
      .replace('#include <tonemapping_fragment>', 'gl_FragColor.rgb = njNeutral(gl_FragColor.rgb);');
  };
  mat.customProgramCacheKey = () => 'nj-neutral';
  return mat;
}

export function createSleeves(entries) {
  const geo = new THREE.BoxGeometry(L, L, SLEEVE.thick);
  geo.translate(0, L / 2, SLEEVE.thick / 2);            // origin on the bottom back edge
  return entries.map((entry, i) => {
    const edge = neutral(new THREE.MeshStandardMaterial({ color: 0xf1efea, roughness: 0.8 }));
    const col = i % SLEEVE.cols, row = Math.floor(i / SLEEVE.cols);
    const front = neutral(new THREE.MeshStandardMaterial({ color: new THREE.Color(entry.accent?.light || NEUTRAL), roughness: 0.8 }));
    const back = neutral(new THREE.MeshStandardMaterial({ color: 0xe9e6e0, roughness: 0.7 }));
    const mats = [edge, edge, edge, edge, front, back];   // +x -x +y -y +z(front) -z(back)
    const mesh = new THREE.Mesh(geo, mats);
    mesh.matrixAutoUpdate = false;
    const record = createRecord(entry);
    const s = {
      i, row, col, mesh, front, back, mats, record, entry,
      x: (col - (SLEEVE.cols - 1) / 2) * SLEEVE.pitch,
      shelfY: SHELF.tops[row],
      pose: { ...restPose(), opacity: 0 },
    };
    applyPose(s);
    return s;
  });
}

const tmpQ = new THREE.Quaternion(), axisX = new THREE.Vector3(1, 0, 0), tmpV = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1);
const centre = new THREE.Vector3(), spin = new THREE.Matrix4(), toC = new THREE.Matrix4(), fromC = new THREE.Matrix4();
export function applyPose(s) {
  const p = s.pose;
  tmpV.set(s.x + p.dx, s.shelfY + p.lift, p.z);
  tmpQ.setFromAxisAngle(axisX, -p.lean);
  s.mesh.matrix.compose(tmpV, tmpQ, one);
  if (p.yaw) {
    // Turn about the sleeve's own centre.
    centre.set(0, L / 2, SLEEVE.thick / 2).applyMatrix4(s.mesh.matrix);
    toC.makeTranslation(centre.x, centre.y, centre.z);
    fromC.makeTranslation(-centre.x, -centre.y, -centre.z);
    spin.makeRotationY(p.yaw);
    s.mesh.matrix.premultiply(fromC).premultiply(spin).premultiply(toC);
  }
  s.mesh.matrixWorld.copy(s.mesh.matrix);
  s.mesh.visible = p.opacity > 0.001;
  const transparent = p.opacity < 0.999;
  for (const m of [s.front, s.back, s.mats[0]]) {   // mats[0] is this sleeve's edge material
    if (m.transparent !== transparent) { m.transparent = transparent; m.needsUpdate = true; }
    m.opacity = p.opacity;
  }
  // The record sits inside the sleeve, between its faces; rec draws it out along (recX, recY).
  const r = s.record.mesh;
  r.visible = s.mesh.visible && p.rec > 0.002;
  if (r.visible) {
    const out = p.rec * 2 * RECORD_R;
    r.matrix.makeTranslation(p.recX * out, L / 2 + p.recY * out, SLEEVE.thick / 2).premultiply(s.mesh.matrix);
    r.matrixWorld.copy(r.matrix);
  }
}

// Occluders for the light shaders: each sleeve as two slabs parallel to the wall (its lower and upper
// halves at their mean depth) and its foot for the shelf's contact shadow. A sleeve flying toward the
// camera (Details) stops shading the wall.
export function writeOccluders(sleeves, u) {
  for (const s of sleeves) {
    const p = s.pose, c = Math.cos(p.lean), sn = Math.sin(p.lean);
    const y0 = s.shelfY + p.lift, t = SLEEVE.thick / 2, x = s.x + p.dx;
    const away = THREE.MathUtils.smoothstep(p.z, 110, 260);
    const a = s.mesh.visible ? p.opacity * (1 - away) : 0;
    const k = (s.row * 5 + s.col) * 2;
    for (let h = 0; h < 2; h++) {
      const f0 = h / 2, f1 = (h + 1) / 2;
      u.uSlab.value[k + h].set(x - L / 2, y0 + L * f0 * c, x + L / 2, y0 + L * f1 * c);
      u.uSlabZ.value[k + h] = Math.max(1.5, p.z - L * (f0 + f1) / 2 * sn + t);
      u.uSlabA.value[k + h] = a;
    }
    u.uFoot.value[s.i].set(x - L / 2, x + L / 2, p.z + SLEEVE.thick, a > 0 ? p.lift : 1e3);
  }
}

export function setCover(s, frontTex, backTex) {
  if (frontTex) { s.front.map = frontTex; s.front.color.set(0xffffff); s.front.needsUpdate = true; }
  if (backTex) { s.back.map = backTex; s.back.color.set(0xffffff); s.back.needsUpdate = true; }
}
