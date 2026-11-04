// The room's other walls (a lazy chunk, room.js loads it): walls 2-4 as plain lit placeholders in the
// record wall's materials, the same baked light (scene/wall.js, scene/lighting.js) without shelves or
// sleeves, each with its working label; and the record wall's surround, the same light as wall 1 out to
// the room's corners, behind wall 1's own plane, shown only while the camera is turned away from it (so
// wall 1 at rest is drawn exactly as v1).
//
// Every wall stands camZ in front of the camera, square to it, and runs to the corners: the room is a
// square 2 camZ across with the camera at its centre, so each wall at rest fills the view at the record
// wall's scale. Pitch never changes, so a wall's height only has to cover the view's height at the
// corners (sqrt 2 times as far).
import * as THREE from 'three';
import { createWall } from '../scene/wall.js';
import { createLightUniforms, applyLights } from '../scene/lighting.js';
import { SHELF } from '../scene/config.js';

const DOWN = 4;        // texels: the placeholders' light is a smooth gradient, baked at a quarter of the view's resolution
const MAX_TEX = 2048;
const Y = new THREE.Vector3(0, 1, 0);

export function createWalls(renderer, scene, shared, names) {
  // The placeholders' light: wall 1's fitted light with no shelves and no sleeves in it.
  const plain = createLightUniforms();
  applyLights(plain);
  plain.uShelfDepth.value = SHELF.depth;
  plain.uShelf.value.forEach(v => v.set(0, 0, -1e5, -1e5));

  let lay = null, surroundOn = false;
  const built = new Map();   // k -> { group, wall, label }

  // The record wall's surround: lit by wall 1's own uniforms (its shelves' shadows run to its edges).
  const surround = createWall(renderer, shared);
  surround.mesh.renderOrder = -2;
  surround.mesh.visible = false;
  scene.add(surround.mesh);

  // A wall's rectangle in its own frame (the record wall's world frame), out to the corners, and the
  // texture and light region that cover it.
  function rect() {
    const { camZ, S, hh, sy, kx, ky } = lay;
    const R = camZ * 1.01, top = 1.5 * (sy + hh * 1.02), bottom = 1.5 * (sy - hh * 1.02);
    const texW = Math.min(MAX_TEX, Math.ceil(2 * R * S / DOWN)), texH = Math.min(MAX_TEX, Math.ceil((top - bottom) * S / DOWN));
    return { x0: -R, y0: bottom, x1: R, y1: top, texW, texH, region: [-R * kx, bottom * ky, R * kx, top * ky] };
  }
  function fit(w, z) {
    const r = rect();
    w.resize(r.x0, r.y0, r.x1, r.y1, r.texW, r.texH, r.region);
    w.mesh.position.z = z;
    w.mesh.updateMatrixWorld();
    w.setGain(lay.gain);
  }

  // The working label, drawn once in the page's face.
  function label(text) {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 256;
    const g = c.getContext('2d');
    g.font = '500 120px "NJ Text", system-ui, sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = 'rgba(0, 0, 0, 0.6)';
    g.fillText(text, 512, 128);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
    mesh.renderOrder = 1;
    return { mesh, dispose() { tex.dispose(); mat.dispose(); mesh.geometry.dispose(); } };
  }
  function placeLabel(l) {
    const { S, sy } = lay, h = 64 / S;   // 64 px tall on screen: 30 px type
    l.mesh.scale.set(h * 4, h, 1);
    l.mesh.position.set(0, sy, 1);
  }

  // Wall k's frame: turned -k * 90 degrees about the camera's position.
  function place(k, group) {
    const cam = new THREE.Vector3(0, 0, lay.camZ);
    group.rotation.set(0, -k * Math.PI / 2, 0);
    group.position.copy(cam).sub(cam.clone().applyAxisAngle(Y, -k * Math.PI / 2));
    group.updateMatrixWorld(true);
  }

  function build(k) {
    const group = new THREE.Group();
    const wall = createWall(renderer, plain);
    const l = label(names[k].name);
    group.add(wall.mesh, l.mesh);
    const b = { group, wall, label: l };
    if (lay) relayout(k, b);
    scene.add(group);
    built.set(k, b);
  }
  function relayout(k, b) {
    fit(b.wall, 0);
    placeLabel(b.label);
    place(k, b.group);
    b.wall.bake();
  }
  function drop(k) {
    const b = built.get(k);
    scene.remove(b.group);
    b.wall.dispose();
    b.label.dispose();
    built.delete(k);
  }

  return {
    // Build walls ks (of 1..3) and drop the others. The label waits for the page's face.
    async keep(ks) {
      for (const k of [...built.keys()]) if (!ks.includes(k)) drop(k);
      const add = ks.filter(k => !built.has(k));
      if (!add.length) return;
      await document.fonts?.load('500 120px "NJ Text"').catch(() => {});
      for (const k of add) if (!built.has(k)) build(k);
    },
    built: () => [...built.keys()].sort(),
    // Shown while the view is away from wall 1 (or turning), baked as wall 1's light stands then.
    setSurround(on) {
      surroundOn = on;
      surround.mesh.visible = on && !!lay;
      if (surround.mesh.visible) surround.bake();
    },
    layout(l) {
      lay = l;
      fit(surround, -1);
      if (surroundOn) surround.bake();
      for (const [k, b] of built) relayout(k, b);
    },
  };
}
