// The record inside each sleeve: a vinyl disc drawn in one shader (fine grooves that catch the light
// as a sheen across the disc, a run-out band, the label, the spindle hole). The label carries the
// project's mark on its accent colour; marks load the first time a record is drawn out.
import * as THREE from 'three';
import { SLEEVE } from './config.js';
import { NEUTRAL_GLSL } from './tonemap.js';

export const RECORD_R = SLEEVE.size * 0.48;
const LABEL = 0.34;   // label radius as a share of the disc radius

const VERT = /* glsl */`
varying vec2 vP;
varying vec3 vView;
void main() {
  vP = position.xy / ${RECORD_R.toFixed(3)};
  vec4 w = modelMatrix * vec4(position, 1.0);
  vView = normalize(cameraPosition - w.xyz);
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const FRAG = /* glsl */`
${NEUTRAL_GLSL}
uniform sampler2D uLabel;
uniform float uHasLabel;
uniform vec3 uLabelColor;
uniform float uAngle;
varying vec2 vP;
varying vec3 vView;
void main() {
  float r = length(vP);
  float aa = fwidth(r);
  if (r > 1.0 + aa) discard;
  float edge = 1.0 - smoothstep(1.0 - aa, 1.0 + aa, r);
  float a = atan(vP.y, vP.x);
  // Grooves: a fine ring pattern (filtered so it never shimmers) and an anisotropic sheen, brightest
  // where the groove direction is square to the light, as two opposed wedges.
  float g = 0.5 + 0.5 * sin(r * 520.0);
  float gw = clamp(fwidth(r * 520.0) / 6.2832, 0.0, 1.0);
  g = mix(g, 0.5, gw);
  float sheen = pow(abs(cos(a - uAngle)), 18.0) * smoothstep(${LABEL.toFixed(3)} + 0.06, 0.5, r) * (1.0 - smoothstep(0.93, 0.99, r));
  vec3 vinyl = vec3(0.012) + vec3(0.010) * g + vec3(0.16) * sheen * (0.6 + 0.4 * g);
  // Run-out band between the grooves and the label, and a glossy rim.
  vinyl = mix(vinyl, vec3(0.022), smoothstep(${LABEL.toFixed(3)} + 0.015, ${LABEL.toFixed(3)} + 0.02, r) * (1.0 - smoothstep(${LABEL.toFixed(3)} + 0.07, ${LABEL.toFixed(3)} + 0.075, r)));
  vinyl += vec3(0.05) * smoothstep(0.975, 0.995, r);
  vec3 col = vinyl;
  float lab = 1.0 - smoothstep(${LABEL.toFixed(3)} - aa, ${LABEL.toFixed(3)} + aa, r);
  if (lab > 0.0) {
    vec2 uv = vP / (2.0 * ${LABEL.toFixed(3)}) + 0.5;
    vec3 lc = uHasLabel > 0.5 ? texture2D(uLabel, uv).rgb : uLabelColor;
    col = mix(col, lc, lab);
  }
  col *= smoothstep(0.03 - aa, 0.03 + aa, r);   // spindle hole
  gl_FragColor = vec4(njNeutral(col), edge);
  #include <colorspace_fragment>
}`;

const GEO = new THREE.CircleGeometry(RECORD_R, 128);

export function createRecord(entry) {
  const accent = new THREE.Color(entry.accent?.light || '#d9d6d0');
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uLabel: { value: null }, uHasLabel: { value: 0 }, uLabelColor: { value: accent },
      uAngle: { value: 0.9 },
    },
    vertexShader: VERT, fragmentShader: FRAG, side: THREE.DoubleSide, transparent: true, toneMapped: false,
  });
  const mesh = new THREE.Mesh(GEO, mat);
  mesh.matrixAutoUpdate = false;
  mesh.visible = false;
  let loading = null;
  return {
    mesh,
    // Draw the label (accent ground, the mark at 46% of its width) once, the first time it is needed.
    loadLabel() {
      if (!loading) loading = drawLabel(entry).then(tex => {
        if (tex) { mat.uniforms.uLabel.value = tex; mat.uniforms.uHasLabel.value = 1; }
        return tex;
      }).catch(() => null);
      return loading;
    },
  };
}

// WCAG contrast. A bare mark or the name that falls below 4.5:1 on its ground is drawn in white or near
// black, whichever reads better; the ground keeps the project's accent. A mark that fills its box (an app
// icon on its own tile) carries its own ground and is drawn as it is.
const MIN_CONTRAST = 4.5, TILE = 0.6;   // TILE: share of the box a mark must cover to count as a tile
const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const contrast = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const rgbOf = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
const inkOn = gl => (contrast(1, gl) >= contrast(lum([17, 17, 17]), gl) ? '#fff' : '#111');
// The mark at w px, recoloured to the ink if it is bare and too faint on the ground.
function markCanvas(im, w, ground) {
  const c = document.createElement('canvas');
  c.width = c.height = Math.round(w);
  const g = c.getContext('2d');
  g.drawImage(im, 0, 0, c.width, c.height);
  const px = g.getImageData(0, 0, c.width, c.height).data, gl = lum(ground), cs = [];
  for (let k = 0; k < px.length; k += 4) if (px[k + 3] > 200) cs.push(contrast(lum([px[k], px[k + 1], px[k + 2]]), gl));
  if (cs.length / (c.width * c.height) >= TILE) return c;
  cs.sort((a, b) => a - b);
  if ((cs[cs.length >> 1] || 0) >= MIN_CONTRAST) return c;
  g.globalCompositeOperation = 'source-in';
  g.fillStyle = inkOn(gl);
  g.fillRect(0, 0, c.width, c.height);
  return c;
}

function loadImage(src) {
  return new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = src; });
}
async function drawLabel(entry) {
  const S = 512, c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d');
  const groundHex = entry.accent?.light || '#d9d6d0', ground = rgbOf(groundHex);
  g.fillStyle = groundHex;
  g.fillRect(0, 0, S, S);
  // A fine ring near the label's edge, as printed labels have.
  g.strokeStyle = 'rgba(255,255,255,0.35)';
  g.lineWidth = S * 0.006;
  g.beginPath(); g.arc(S / 2, S / 2, S * 0.45, 0, Math.PI * 2); g.stroke();
  // logo: {svg: a standalone SVG document} | {png: a root-relative path} | null
  const logo = entry.logo;
  if (logo?.svg || logo?.png) {
    const src = logo.svg ? URL.createObjectURL(new Blob([logo.svg], { type: 'image/svg+xml' })) : logo.png;
    try {
      const im = await loadImage(src);
      const w = S * 0.46;
      g.drawImage(markCanvas(im, w, ground), (S - w) / 2, (S - w) / 2, w, w);
    } finally {
      if (src.startsWith('blob:')) URL.revokeObjectURL(src);
    }
  } else {
    const gl = lum(ground);
    g.fillStyle = contrast(1, gl) >= MIN_CONTRAST ? 'rgba(255,255,255,0.92)' : inkOn(gl);
    g.font = `600 ${S * 0.075}px 'NJ Text', system-ui, sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(entry.name, S / 2, S / 2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
