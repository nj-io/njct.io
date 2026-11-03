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

const LOGO_BASE = new URL('../data/', import.meta.url);
function loadImage(src) {
  return new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = src; });
}
async function drawLabel(entry) {
  const S = 512, c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d');
  g.fillStyle = entry.accent?.light || '#d9d6d0';
  g.fillRect(0, 0, S, S);
  // A fine ring near the label's edge, as printed labels have.
  g.strokeStyle = 'rgba(255,255,255,0.35)';
  g.lineWidth = S * 0.006;
  g.beginPath(); g.arc(S / 2, S / 2, S * 0.45, 0, Math.PI * 2); g.stroke();
  const logo = entry.logo;
  if (logo) {
    const src = logo.trim().startsWith('<svg')
      ? URL.createObjectURL(new Blob([logo], { type: 'image/svg+xml' }))
      : new URL(logo, LOGO_BASE).href;
    try {
      const im = await loadImage(src);
      const w = S * 0.46;
      g.drawImage(im, (S - w) / 2, (S - w) / 2, w, w);
    } finally {
      if (src.startsWith('blob:')) URL.revokeObjectURL(src);
    }
  } else {
    g.fillStyle = 'rgba(255,255,255,0.92)';
    g.font = `600 ${S * 0.075}px Inter, system-ui, sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(entry.name, S / 2, S / 2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
