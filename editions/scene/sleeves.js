// Ten sleeves: thin card boxes standing on the shelves. A sleeve's pose is its bottom edge's height
// above its shelf (lift), that edge's distance from the wall (z), and its lean back toward the wall,
// pivoting on that edge. Poses also drive the occluders the wall and shelf shaders use.
import * as THREE from 'three';
import { SHELF, SLEEVE } from './config.js';

const L = SLEEVE.size;
export const REST_Z = L * Math.sin(SLEEVE.lean);      // the top edge then touches the wall
export const restPose = () => ({ lift: 0, z: REST_Z, lean: SLEEVE.lean, opacity: 1 });
export const hoverPose = () => ({ lift: SLEEVE.hoverLift, z: SLEEVE.hoverZ, lean: 0, opacity: 1 });

const NEUTRAL = '#d9d6d0'; // flat front for entries without an accent

export function createSleeves(entries) {
  const geo = new THREE.BoxGeometry(L, L, SLEEVE.thick);
  geo.translate(0, L / 2, SLEEVE.thick / 2);            // origin on the bottom back edge
  return entries.map((entry, i) => {
    const edge = new THREE.MeshStandardMaterial({ color: 0xf1efea, roughness: 0.8 });
    const col = i % SLEEVE.cols, row = Math.floor(i / SLEEVE.cols);
    const front = new THREE.MeshStandardMaterial({ color: new THREE.Color(entry.accent?.light || NEUTRAL), roughness: 0.8 });
    const back = new THREE.MeshStandardMaterial({ color: 0xe9e6e0, roughness: 0.7 });
    const mats = [edge, edge, edge, edge, front, back];   // +x -x +y -y +z(front) -z(back)
    const mesh = new THREE.Mesh(geo, mats);
    mesh.matrixAutoUpdate = false;
    const s = {
      i, row, col, mesh, front, back, mats,
      x: (col - (SLEEVE.cols - 1) / 2) * SLEEVE.pitch,
      shelfY: SHELF.tops[row],
      pose: { ...restPose(), opacity: 0 },
    };
    applyPose(s);
    return s;
  });
}

const tmpQ = new THREE.Quaternion(), axis = new THREE.Vector3(1, 0, 0), tmpV = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1);
export function applyPose(s) {
  const p = s.pose;
  tmpV.set(s.x, s.shelfY + p.lift, p.z);
  tmpQ.setFromAxisAngle(axis, -p.lean);
  s.mesh.matrix.compose(tmpV, tmpQ, one);
  s.mesh.matrixWorld.copy(s.mesh.matrix);
  s.mesh.visible = p.opacity > 0.001;
  const transparent = p.opacity < 0.999;
  for (const m of [s.front, s.back, s.mats[0]]) {   // mats[0] is this sleeve's edge material
    if (m.transparent !== transparent) { m.transparent = transparent; m.needsUpdate = true; }
    m.opacity = p.opacity;
  }
}

// Occluders for the light shaders: each sleeve as two slabs parallel to the wall (its lower and upper
// halves at their mean depth) and its foot for the shelf's contact shadow.
export function writeOccluders(sleeves, u) {
  for (const s of sleeves) {
    const p = s.pose, c = Math.cos(p.lean), sn = Math.sin(p.lean);
    const y0 = s.shelfY + p.lift, t = SLEEVE.thick / 2;
    const k = (s.row * 5 + s.col) * 2;
    for (let h = 0; h < 2; h++) {
      const a = h / 2, b = (h + 1) / 2;
      u.uSlab.value[k + h].set(s.x - L / 2, y0 + L * a * c, s.x + L / 2, y0 + L * b * c);
      u.uSlabZ.value[k + h] = Math.max(1.5, p.z - L * (a + b) / 2 * sn + t);
      u.uSlabA.value[k + h] = s.mesh.visible ? p.opacity : 0;
    }
    u.uFoot.value[s.i].set(s.x - L / 2, s.x + L / 2, p.z + SLEEVE.thick, s.mesh.visible ? p.lift : 1e3);
  }
}

export function setCover(s, frontTex, backTex) {
  if (frontTex) { s.front.map = frontTex; s.front.color.set(0xffffff); s.front.needsUpdate = true; }
  if (backTex) { s.back.map = backTex; s.back.color.set(0xffffff); s.back.needsUpdate = true; }
}
