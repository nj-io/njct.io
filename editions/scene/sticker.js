// The "Now playing" sticker on the sleeve in Details: a scalloped foil disc on the shrink-wrap at the
// front's top right, drawn once into a canvas. It turns with the sleeve.
import * as THREE from 'three';
import { SLEEVE } from './config.js';
import { neutral } from './sleeves.js';

const L = SLEEVE.size;
const D = 0.252 * L;                                  // diameter, as on the reference
const AT = { x: 0.327 * L, y: 0.827 * L, z: SLEEVE.thick + 0.25 };   // centre in sleeve space

function draw(lines) {
  const S = 512, c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d');
  const cx = S / 2, r0 = S * 0.44, n = 11;
  g.beginPath();
  for (let k = 0; k <= 720; k++) {
    const a = k / 720 * Math.PI * 2;
    const r = r0 * (1 + 0.065 * Math.cos(n * a));
    g.lineTo(cx + r * Math.cos(a), cx + r * Math.sin(a));
  }
  g.closePath();
  g.save();
  g.clip();
  // Foil: pastel hues around the disc with a soft highlight.
  const foil = g.createConicGradient ? g.createConicGradient(0.6, cx, cx) : g.createLinearGradient(0, 0, S, S);
  ['#ffa6e6', '#9af2dc', '#c4b2ff', '#ffe596', '#9fd6ff', '#ffb8dc', '#ffa6e6']
    .forEach((col, k, all) => foil.addColorStop(k / (all.length - 1), col));
  g.fillStyle = foil;
  g.fillRect(0, 0, S, S);
  // Marbling: soft blobs of the same hues at fixed places, so the foil is uneven as printed foil is.
  [[0.3, 0.3, '#9af2dc'], [0.7, 0.62, '#ffa6e6'], [0.42, 0.72, '#ffe596'], [0.68, 0.28, '#c4b2ff'], [0.25, 0.58, '#ffb8dc']]
    .forEach(([x, y, col]) => {
      const b = g.createRadialGradient(x * S, y * S, 0, x * S, y * S, S * 0.2);
      b.addColorStop(0, col + 'cc'); b.addColorStop(1, col + '00');
      g.fillStyle = b; g.fillRect(0, 0, S, S);
    });
  const hi = g.createRadialGradient(cx * 0.8, cx * 0.7, 0, cx * 0.8, cx * 0.7, S * 0.55);
  hi.addColorStop(0, 'rgba(255,255,255,0.75)');
  hi.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = hi;
  g.fillRect(0, 0, S, S);
  g.restore();
  g.translate(cx, cx);
  g.rotate(12 * Math.PI / 180);
  g.fillStyle = '#111';
  g.textAlign = 'center';
  g.textBaseline = 'alphabetic';
  g.font = `700 ${S * 0.15}px 'NJ Text', system-ui, sans-serif`;
  const lh = S * 0.15;
  lines.forEach((l, k) => g.fillText(l, 0, (k - (lines.length - 1) / 2) * lh + S * 0.055));
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function createSticker(text) {
  const map = draw(text.toUpperCase().split(' '));
  // Foil reads bright under any light: part of its colour is emitted, the rest catches the room.
  const mat = neutral(new THREE.MeshStandardMaterial({
    map, emissiveMap: map, emissive: 0xffffff, emissiveIntensity: 0.5, transparent: true, roughness: 0.3, metalness: 0, depthWrite: false,
  }));
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(D, D), mat);
  mesh.matrixAutoUpdate = false;
  mesh.visible = false;
  const local = new THREE.Matrix4().makeTranslation(AT.x, AT.y, AT.z);
  return {
    mesh,
    // Follow sleeve s at the given opacity.
    place(s, opacity) {
      mesh.visible = opacity > 0.002 && s.mesh.visible;
      if (!mesh.visible) return;
      mat.opacity = opacity;
      mesh.matrix.multiplyMatrices(s.mesh.matrix, local);
      mesh.matrixWorld.copy(mesh.matrix);
    },
  };
}
