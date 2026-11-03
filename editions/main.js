// Phase 0 stub: grey placeholder sleeves, test hooks and hover controls. Phase 1 builds the real scene.
import * as THREE from 'three';

const COUNT = 10;
const COLS = 5;
const ROW_Y = [290, 540];       // sleeve centres at 1440x900
const PITCH = 222.5;
const SIZE = 200;

let resolveReady;
const hooks = {
  count: COUNT,
  firstFrameAt: null,
  ready: new Promise(r => { resolveReady = r; }),
  sleeveRect,
};
window.__editions = hooks;

const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
const scene = new THREE.Scene();
scene.background = new THREE.Color().setRGB(205 / 255, 205 / 255, 205 / 255, THREE.SRGBColorSpace);

// One scene unit is one CSS pixel on the z = 0 plane.
const camera = new THREE.PerspectiveCamera(30, 1, 10, 5000);

const sleeves = [];
const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color().setRGB(150 / 255, 150 / 255, 150 / 255, THREE.SRGBColorSpace) });
const geo = new THREE.PlaneGeometry(1, 1);
const slotsEl = document.getElementById('slots');
const slots = [];
for (let i = 0; i < COUNT; i++) {
  const m = new THREE.Mesh(geo, mat);
  scene.add(m);
  sleeves.push(m);
  const slot = document.createElement('div');
  slot.className = 'slot';
  for (const [action, label] of [['open', 'Open'], ['details', 'Details']]) {
    const b = document.createElement('button');
    b.dataset.action = action;
    b.dataset.index = String(i);
    b.textContent = label;
    slot.appendChild(b);
  }
  slotsEl.appendChild(slot);
  slots.push(slot);
}

function layout() {
  const w = window.innerWidth, h = window.innerHeight;
  const s = Math.min(1, (w * 0.85) / (PITCH * (COLS - 1) + SIZE));
  const d = 1000;
  camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(h / 2 / d));
  camera.aspect = w / h;
  camera.position.set(0, 0, d);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(w, h, false);
  sleeves.forEach((m, i) => {
    const col = i % COLS, row = Math.floor(i / COLS);
    const cx = w / 2 + (col - (COLS - 1) / 2) * PITCH * s;
    const cy = ROW_Y[row] / 900 * h;
    m.scale.set(SIZE * s, SIZE * s, 1);
    m.position.set(cx - w / 2, h / 2 - cy, 0);
    m.updateMatrixWorld();
  });
  sleeves.forEach((_, i) => {
    const r = sleeveRect(i), el = slots[i].style;
    el.left = r.x + 'px'; el.top = r.y + 'px'; el.width = r.width + 'px'; el.height = r.height + 'px';
  });
}

const box = new THREE.Box3(), v = new THREE.Vector3();
function sleeveRect(i) {
  box.setFromObject(sleeves[i]);
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const w = window.innerWidth, h = window.innerHeight;
  for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) {
    v.set(x, y, z).project(camera);
    const px = (v.x + 1) / 2 * w, py = (1 - v.y) / 2 * h;
    x0 = Math.min(x0, px); x1 = Math.max(x1, px); y0 = Math.min(y0, py); y1 = Math.max(y1, py);
  }
  return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
}

window.addEventListener('pointermove', e => {
  slots.forEach((slot, i) => {
    const r = sleeveRect(i);
    const inside = e.clientX >= r.x && e.clientX <= r.x + r.width && e.clientY >= r.y && e.clientY <= r.y + r.height;
    slot.classList.toggle('hot', inside);
  });
});
window.addEventListener('resize', layout);
layout();

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
  if (hooks.firstFrameAt === null) {
    hooks.firstFrameAt = performance.now();
    resolveReady();
  }
});
