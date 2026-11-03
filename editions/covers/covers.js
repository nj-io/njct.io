// Procedural record-sleeve covers for njct.io Editions.
//
// createCover(renderer, entry, index, { size }) renders one entry's front and
// back into mipmapped sRGB render targets. Each cover is a single full-target
// fragment shader: a per-entry motif evaluated with 4-sample rotated-grid
// supersampling and analytic edge coverage, then the title and edition mark
// composited 1:1 from a canvas mask, then print grain and an 8-bit dither.
// Maths runs in linear light; the target stores sRGB.

import * as THREE from 'three';

// ---------- fonts ----------

const FONT_DIR = new URL('../../vendor/fonts/', import.meta.url);
// NJ Text is the page's own UI face (one variable file, already loaded for the header); the mono face
// is only needed for backs, so it loads with the first back.
const FACES = [
  ['NJ Display', 'bricolage-grotesque-96pt-extrabold-latin.woff2', '800'],
  ['NJ Serif', 'fraunces-144pt-semibold-soft-wonk-latin.woff2', '600'],
  ['NJ Text', 'ui/inter-variable-ui.woff2', '100 900'],
];
const BACK_FACES = [['NJ Mono', 'jetbrains-mono-medium-latin.woff2', '500']];
const loadFaces = list => Promise.all(list.map(([family, file, weight]) => {
  const face = new FontFace(family, `url("${new URL(file, FONT_DIR).href}") format("woff2")`, { weight, style: 'normal' });
  document.fonts.add(face);
  return face.load();
}));
let fontsReady = null, backFontsReady = null;
export function loadCoverFonts() {
  if (!fontsReady) fontsReady = loadFaces(FACES);
  return fontsReady;
}
function loadBackFonts() {
  if (!backFontsReady) backFontsReady = loadFaces(BACK_FACES);
  return backFontsReady;
}

// ---------- colour ----------

const lin = hex => new THREE.Color(hex);                   // sRGB hex -> linear working space
const srgb = hex => { const c = new THREE.Color(); c.setStyle(hex, THREE.NoColorSpace); return c; };
function hsl(h, s, l) {
  const c = new THREE.Color();
  c.setHSL(((h % 360) + 360) % 360 / 360, s, l, THREE.SRGBColorSpace);
  return '#' + c.getHexString(THREE.SRGBColorSpace);
}
function fnv1a(str) {
  let h = 2166136261;
  for (const ch of str) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; }
  return h;
}
// A hue from the name's hash, inside a band of the colour wheel the accented covers leave open.
const hashHue = (name, from, to) => from + (fnv1a(name) % 1000) / 1000 * (to - from);

// ---------- GLSL ----------

const VERT = /* glsl */`
void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const PRELUDE = /* glsl */`
precision highp float;
uniform vec2 uRes;
uniform float uTime, uSS, uMode, uBandY, uBandH;
uniform sampler2D uText, uSdf;
uniform vec3 uInk0, uInk1, uInk2, uPaper;
uniform vec3 uPal[8];
uniform vec4 uAux[8];
float PX, AAW;
#define PI 3.14159265359
#define TAU 6.28318530718

float h11(float p) { p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
float h12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec2 h22(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(h12(i), h12(i + vec2(1.0, 0.0)), u.x), mix(h12(i + vec2(0.0, 1.0)), h12(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * vnoise(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p + 3.1; a *= 0.5; }
  return v;
}
// interleaved gradient noise (Jimenez 2014), for the 8-bit dither
float ign(vec2 fc) { return fract(52.9829189 * fract(dot(fc, vec2(0.06711056, 0.00583715)))); }
vec3 toSrgb(vec3 c) { return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
vec3 toLin(vec3 c) { return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)); }

// coverage of a signed distance (negative inside), box-filtered over one pixel
float cover(float d) { return clamp(0.5 - d / AAW, 0.0, 1.0); }
// coverage of a stroke of half-width w around a distance
float ring(float d, float w) { return cover(abs(d) - w); }
float sdSeg(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h); }
float sdRoundBox(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
float ease(float u) { return u * u * (3.0 - 2.0 * u); }
float dease(float u) { return 6.0 * u * (1.0 - u); }
`;

const MAIN = /* glsl */`
vec3 shade(vec2 p, float t) {
  if (uMode < 0.5) return motif(p, t);
  // back: a strip of the front art across the top, paper below
  float by = 1.0 - uBandH;
  if (p.y < by - 2.0 * PX) return uPaper;
  vec3 m = motif(vec2(p.x, uBandY + (p.y - (1.0 - 0.5 * uBandH))), t);
  return mix(uPaper, m, cover(by - p.y));
}
void main() {
  vec2 fc = gl_FragCoord.xy;
  PX = 1.0 / uRes.x;
  int ns = int(uSS + 0.5);
  AAW = PX * (ns > 1 ? 0.8 : 1.0);
  vec2 offs[4] = vec2[4](vec2(0.125, 0.375), vec2(-0.375, 0.125), vec2(0.375, -0.125), vec2(-0.125, -0.375));
  vec3 c = vec3(0.0);
  for (int i = 0; i < 4; i++) {
    if (i >= ns) break;
    c += shade((fc + (ns > 1 ? offs[i] : vec2(0.0))) / uRes, uTime);
  }
  c /= float(ns);
  // type, composited in sRGB the way the browser blends text
  vec4 m = texture2D(uText, fc / uRes);
  vec3 s = toSrgb(clamp(c, 0.0, 1.0));
  s = mix(s, uInk0, m.r);
  s = mix(s, uInk1, m.g);
  s = mix(s, uInk2, m.b);
  // print finish: static fibre grain and a faint density drift, then dither to 8 bits
  float grain = h12(fc * 1.37 + 17.0) - 0.5;
  float dens = vnoise(fc / uRes * 7.0 + 11.0) - 0.5;
  s *= 1.0 + grain * 0.020 + dens * 0.016;
  s += (ign(fc) - 0.5) / 255.0;
  gl_FragColor = vec4(toLin(clamp(s, 0.0, 1.0)), 1.0);
}`;

// ---------- motifs ----------
// Each defines vec3 motif(vec2 p, float t): p in [0,1]^2 with y up, linear colour out.
// The title owns the band below y ~0.30 and the edition mark the strip above y ~0.92.

const MOTIFS = {};

// Mirra: one source and its mirrored copies — a sun over water, its reflection cut
// into drifting slices, halo ripples above echoed as elliptical ripples below.
MOTIFS.mirra = /* glsl */`
vec3 skyPart(vec2 p, float t, vec2 C, float R, float H) {
  float g = clamp((p.y - H) / (1.0 - H), 0.0, 1.0);
  vec3 col = mix(uPal[1], uPal[0], pow(g, 0.7));
  float d = length(p - C);
  col = mix(col, uPal[5], 0.5 * exp(-max(d - R, 0.0) / 0.06));
  float sp = 0.031;
  float ph = (d - R - 0.014) / sp - t * 0.09;
  float k = floor(ph + 0.5);
  float a = ring(abs(ph - k) * sp, 0.0015) * smoothstep(0.004, 0.03, d - R) * exp(-(d - R) * 4.0);
  col = mix(col, uPal[5], a * 0.85);
  vec3 sc = mix(uPal[4], vec3(1.0, 0.985, 0.94), 0.55 * smoothstep(R, 0.0, d));
  return mix(col, sc, cover(d - R));
}
vec3 waterPart(vec2 p, float t, vec2 C, float R, float H) {
  float z = max(H - p.y, 0.0);
  vec3 col = mix(uPal[2], uPal[3], smoothstep(0.0, 0.48, z));
  col = mix(col, uPal[5], 0.22 * exp(-z / 0.022));
  // elliptical ripples, centred under the reflection
  vec2 q = p - vec2(C.x, H - 0.105);
  float e = length(vec2(q.x, q.y * 3.6));
  float gl = length(vec2(q.x, q.y * 12.96)) / max(e, 1e-4);
  float sp = 0.056;
  float ph = e / sp - t * 0.07;
  float k = floor(ph + 0.5);
  float a = ring(abs(ph - k) * sp / gl, 0.0017) * exp(-e * 1.8) * smoothstep(0.03, 0.11, e);
  col = mix(col, uPal[6], a * 0.8);
  // the reflection: the disc mirrored and squashed, cut into slices that thin with depth
  float sz = sqrt(z + 1e-5);
  float s = sz * 50.0;
  float n = floor(s);
  float dsdz = 25.0 / sz;
  float depth = smoothstep(0.03, 0.2, z);
  float duty = mix(0.74, 0.2, depth);
  float band = (abs(fract(s) - 0.5) - duty * 0.5) / dsdz;
  float off = (h11(n * 1.7 + 3.0) - 0.5) * 0.05 * depth + 0.007 * sin(t * 0.8 + n * 2.1) * (0.3 + depth);
  vec2 rq = vec2(p.x + off, H + z / 0.54);
  float rd = length(rq - C) - R;
  col = mix(col, uPal[4], cover(max(rd, band)) * (1.0 - 0.3 * depth));
  return col;
}
vec3 motif(vec2 p, float t) {
  float H = 0.5; vec2 C = vec2(0.5, 0.745); float R = 0.135;
  return mix(waterPart(p, t, C, R, H), skyPart(p, t, C, R, H), cover(H - p.y));
}`;

// stet: the proofreader's marks — a giant insertion caret, its misregistered shadow,
// and the stet dots under each letter of the title.
MOTIFS.stet = /* glsl */`
float chevron(vec2 p, vec2 apex, float span, float drop, float w) {
  vec2 q = vec2(abs(p.x - apex.x), p.y - apex.y);
  vec2 dir = normalize(vec2(span, -drop));
  float slab = abs(dot(q, vec2(-dir.y, dir.x))) - w;
  return max(slab, -drop - q.y);
}
vec3 motif(vec2 p, float t) {
  vec3 col = mix(uPal[0] * vec3(0.975, 0.965, 0.95), uPal[0], smoothstep(0.0, 1.0, p.y));
  float sp = 0.0525;
  float ry = (p.y - 0.012) / sp;
  float k = floor(ry + 0.5);
  float rules = ring(abs(ry - k) * sp, 0.0011) * smoothstep(0.33, 0.36, p.y) * (1.0 - smoothstep(0.85, 0.88, p.y));
  col = mix(col, uPal[4], rules);
  col = mix(col, uPal[5], ring(p.x - 0.105, 0.0012) * smoothstep(0.33, 0.36, p.y) * (1.0 - smoothstep(0.85, 0.88, p.y)));
  vec2 apex = vec2(0.62, 0.835 + 0.006 * sin(t * 0.9));
  float span = 0.285, drop = 0.40, w = 0.05;
  col = mix(col, uPal[2], cover(chevron(p - vec2(0.021, -0.017 + 0.004 * sin(t * 0.9 + 1.2)), apex, span, drop, w)));
  col = mix(col, uPal[1], cover(chevron(p, apex, span, drop, w)));
  for (int i = 0; i < 4; i++) {
    vec4 a = uAux[i];
    if (a.z <= 0.0) continue;
    float r = a.z * (1.0 + 0.08 * sin(t * 1.4 - float(i) * 0.9));
    col = mix(col, uPal[3], cover(length(p - a.xy) - r));
  }
  return col;
}`;

// Social Hook: commits stream along a branch line into a gate and leave as broadcast
// rings; each ring's weight follows the size of the dot that made it.
MOTIFS.hook = /* glsl */`
float rhythm(float n) {
  float m = mod(n, 8.0);
  return m < 0.5 ? 1.0 : m < 1.5 ? 0.46 : m < 2.5 ? 0.46 : m < 3.5 ? 0.74 : m < 4.5 ? 0.9 : m < 5.5 ? 0.46 : m < 6.5 ? 0.62 : 0.46;
}
vec3 motif(vec2 p, float t) {
  vec3 col = mix(uPal[1], uPal[0], smoothstep(0.0, 1.0, p.y));
  vec2 G = vec2(0.43, 0.625);
  float S = 0.08, v = 0.04;
  float ft = t * v / S;
  vec2 q = p - G; float d = length(q);
  float rph = ft - (d - 0.05) / S;
  float nr = floor(rph + 0.5);
  float thin = exp(-max(d - 0.06, 0.0) * 1.6);
  float ang = atan(q.y, q.x);
  float arcW = 0.9 + 0.25 * thin;
  float taper = (1.0 - smoothstep(arcW - 0.3, arcW, abs(ang))) * (1.0 - smoothstep(0.83, 0.91, p.y));
  float hw = (0.003 + 0.0095 * rhythm(nr)) * (0.35 + 0.65 * thin) * taper;
  col = mix(col, uPal[2], ring(abs(rph - nr) * S, hw) * smoothstep(0.0, 0.08, taper) * smoothstep(0.05, 0.075, d));
  // main line and a branch merging in from below
  float lineA = ring(p.y - G.y, 0.0026) * cover(p.x - G.x);
  float bx = clamp((p.x - 0.04) / 0.24, 0.0, 1.0);
  float by = G.y - 0.2 * (1.0 - ease(bx));
  float bsl = 0.2 * dease(bx) / 0.24;
  float brA = ring(abs(p.y - by) / sqrt(1.0 + bsl * bsl), 0.0026) * cover(p.x - 0.28);
  col = mix(col, uPal[3], max(lineA, brA));
  vec2 B1 = vec2(0.04 + 0.24 * 0.3, G.y - 0.2 * (1.0 - ease(0.3)));
  col = mix(col, uPal[3], cover(length(p - B1) - 0.017));
  col = mix(col, uPal[5], cover(length(p - B1) - 0.007));
  float ph = (p.x - G.x) / S + ft;
  float n = floor(ph + 0.5);
  float dd = length(vec2((ph - n) * S, p.y - G.y)) - 0.031 * rhythm(n);
  col = mix(col, mod(n, 4.0) < 0.5 ? uPal[3] : uPal[2], cover(dd) * cover(p.x - G.x));
  // the gate
  float gb = sdRoundBox(q, vec2(0.037, 0.112), 0.037);
  col = mix(col, uPal[5], cover(gb));
  col = mix(col, uPal[3], ring(gb, 0.0105));
  return col;
}`;

// Clauded: a sealed glass volume glowing from inside, five bridges leaving through its wall.
MOTIFS.clauded = /* glsl */`
float sdHexP(vec2 p, float s) {
  p = p.yx;
  float r = s * 0.8660254;
  const vec3 k = vec3(-0.866025404, 0.5, 0.577350269);
  p = abs(p);
  p -= 2.0 * min(dot(k.xy, p), 0.0) * k.xy;
  p -= vec2(clamp(p.x, -k.z * r, k.z * r), r);
  return length(p) * sign(p.y);
}
vec3 motif(vec2 p, float t) {
  vec3 col = mix(uPal[1], uPal[0], smoothstep(0.05, 1.0, p.y));
  vec2 C = vec2(0.385, 0.64); float s = 0.235;
  vec2 q = p - C;
  float breathe = 0.5 + 0.5 * sin(t * 0.7);
  float hex = sdHexP(q, s);
  col = mix(col, uPal[7], 0.45 * exp(-max(hex, 0.0) / 0.045) * (0.8 + 0.2 * breathe));
  bool topF = q.y > 0.57735 * abs(q.x);
  vec3 face = topF ? uPal[2] : (q.x > 0.0 ? uPal[4] : uPal[3]);
  float glow = exp(-length(q * vec2(1.0, 1.1)) / (0.40 * s)) * (0.78 + 0.22 * breathe);
  face = mix(face, uPal[7], glow * (topF ? 0.5 : (q.x > 0.0 ? 0.62 : 0.7)));
  col = mix(col, face, cover(hex));
  col = mix(col, uPal[7], ring(sdHexP(q, s * 0.87), 0.0012) * 0.55 * cover(hex));
  float ye = min(min(sdSeg(q, vec2(0.0), vec2(-0.8660254, 0.5) * s), sdSeg(q, vec2(0.0), vec2(0.8660254, 0.5) * s)), sdSeg(q, vec2(0.0), vec2(0.0, -s)));
  col = mix(col, uPal[7], ring(ye, 0.0022) * 0.9);
  col = mix(col, uPal[5], ring(hex, 0.0042));
  vec2 U = vec2(0.8660254, 0.5) * s, V = vec2(0.0, -s);
  vec2 dir = vec2(0.8660254, -0.5);
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    vec2 P0 = C + U * 0.55 + V * (0.19 + 0.135 * fi);
    float L = (0.935 - P0.x) / dir.x;
    vec2 P1 = P0 + dir * L;
    float ds = sdSeg(p, P0, P1);
    col = mix(col, uPal[6], ring(sdSeg(p, P0 - dir * 0.09, P0), 0.002) * 0.4);
    col = mix(col, uPal[6], ring(ds, 0.0042));
    float along = dot(p - P0, dir);
    float pp = fract(t * 0.07 + fi * 0.29) * L;
    col = mix(col, uPal[7], cover(max(abs(along - pp) - 0.02, ds) - 0.0017));
    float dp = length(p - P0);
    col = mix(col, uPal[7], cover(dp - 0.009));
    col = mix(col, uPal[6], ring(dp - 0.009, 0.0026));
    float nr = 0.015 + 0.007 * h11(fi * 3.1 + 1.0);
    float dn = length(p - P1);
    col = mix(col, uPal[6], cover(dn - nr));
    col = mix(col, uPal[7], cover(dn - nr * 0.4));
  }
  return col;
}`;

// LikeWiki: many sources converge into concept nodes, which converge into one cited page.
MOTIFS.likewiki = /* glsl */`
vec3 motif(vec2 p, float t) {
  vec3 col = mix(uPal[1], uPal[0], smoothstep(0.0, 1.0, p.y));
  vec2 M = vec2(0.5, 0.405);
  col = mix(col, uPal[6], cover(length(p - M) - 0.29));
  float NX[5] = float[5](0.13, 0.31, 0.5, 0.69, 0.87);
  float y0 = 0.862, y1 = 0.645, y2 = M.y;
  float thr = 0.0, bead = 0.0, thr2 = 0.0;
  for (int i = 0; i < 22; i++) {
    if (p.y > y0 + 0.012 || p.y < y1 - 0.012) break;
    float fi = float(i);
    float x0 = 0.02 + 0.96 * fi / 21.0;
    int j = int(clamp(floor(fi / 22.0 * 5.0 + (h11(fi * 7.13) - 0.5) * 1.3), 0.0, 4.0));
    float xn = NX[j];
    float u = clamp((y0 - p.y) / (y0 - y1), 0.0, 1.0);
    float x = mix(x0, xn, ease(u));
    float sl = (xn - x0) * dease(u) / (y0 - y1);
    float d = max(abs(p.x - x) / sqrt(1.0 + sl * sl), max(y1 - p.y, p.y - y0));
    thr = max(thr, ring(d, 0.0021));
    float ds = length(p - vec2(x0, y0)) - 0.0085;
    thr = max(thr, cover(ds));
    float bp = fract(t * 0.045 + h11(fi * 3.7 + 0.4));
    vec2 bpos = vec2(mix(x0, xn, ease(bp)), mix(y0, y1, bp));
    bead = max(bead, cover(length(p - bpos) - 0.0078));
  }
  for (int j = 0; j < 5; j++) {
    if (p.y > y1 + 0.015 || p.y < y2 - 0.015) break;
    float xn = NX[j];
    float u = clamp((y1 - p.y) / (y1 - y2), 0.0, 1.0);
    float x = mix(xn, M.x, ease(u));
    float sl = (M.x - xn) * dease(u) / (y1 - y2);
    float d = max(abs(p.x - x) / sqrt(1.0 + sl * sl), max(p.y - y1, y2 - p.y));
    thr2 = max(thr2, ring(d, 0.0042));
    float bp = fract(t * 0.06 + float(j) * 0.37);
    vec2 bpos = vec2(mix(xn, M.x, ease(bp)), mix(y1, y2, bp));
    bead = max(bead, cover(length(p - bpos) - 0.0105));
  }
  col = mix(col, uPal[2], thr);
  col = mix(col, uPal[3], thr2);
  for (int j = 0; j < 5; j++) {
    float dn = length(p - vec2(NX[j], y1));
    col = mix(col, uPal[4], cover(dn - 0.024));
    col = mix(col, uPal[2], ring(dn - 0.024, 0.0055));
  }
  col = mix(col, uPal[5], bead);
  float dm = length(p - M);
  col = mix(col, uPal[2], ring(dm - 0.078, 0.0022));
  col = mix(col, uPal[3], cover(dm - 0.056));
  col = mix(col, uPal[4], cover(dm - 0.021));
  return col;
}`;

// Track Record: a ruled ledger, and a dial that has resolved to a score.
MOTIFS.track = /* glsl */`
vec3 motif(vec2 p, float t) {
  vec3 col = mix(uPal[1], uPal[0], smoothstep(0.0, 1.0, p.y));
  float sp = 0.046, scroll = t * 0.006;
  float ry = (p.y + scroll) / sp;
  float k = floor(ry + 0.5);
  col = mix(col, uPal[2], ring(abs(ry - k) * sp, 0.0013));
  float kr = floor(ry);
  float has = step(0.4, h11(kr * 1.37 + 5.0));
  float marginY = smoothstep(0.37, 0.40, p.y) * (1.0 - smoothstep(0.87, 0.90, p.y));
  col = mix(col, uPal[4], has * 0.85 * marginY * cover(length(p - vec2(0.066, (kr + 0.5) * sp - scroll)) - 0.0058));
  col = mix(col, uPal[3], marginY * max(ring(p.x - 0.111, 0.0015), ring(p.x - 0.122, 0.0015)));
  vec2 D = vec2(0.565, 0.455); float R = 0.30, w = 0.034;
  vec2 q = p - D; float r = length(q); float a = atan(q.y, q.x);
  col = mix(col, uPal[7], cover(max(r - (R + 0.10), -q.y)));
  float ann = q.y >= 0.0 ? abs(r - R) - w : length(vec2(abs(q.x) - R, q.y)) - w;
  col = mix(col, uPal[6], cover(ann));
  float score = 0.84 + 0.012 * sin(t * 0.7) + 0.004 * sin(t * 1.9);
  float an = PI * (1.0 - score);
  vec2 ne = vec2(cos(an), sin(an));
  float wedge = -dot(q, vec2(-ne.y, ne.x));
  float annTop = q.y >= 0.0 ? abs(r - R) - w : (q.x < 0.0 ? length(q - vec2(-R, 0.0)) - w : 1.0);
  float fill = min(max(annTop, q.y >= 0.0 ? wedge : -1.0), length(q - R * ne) - w);
  col = mix(col, uPal[5], cover(fill));
  float tstep = PI / 30.0;
  float ta = a / tstep; float tk = floor(ta + 0.5);
  bool major = mod(tk, 5.0) < 0.5;
  float r1 = R + (major ? 0.09 : 0.073);
  float tickD = max(abs(ta - tk) * tstep * r - (major ? 0.0028 : 0.0016), max(R + 0.056 - r, r - r1));
  col = mix(col, uPal[4], cover(tickD) * 0.92 * step(-0.5, tk) * step(tk, 30.5) * step(-0.002, q.y));
  float along = clamp(dot(q, ne) / (R - 0.01), 0.0, 1.0);
  col = mix(col, uPal[4], cover(sdSeg(q, vec2(0.0), ne * (R - 0.01)) - mix(0.0088, 0.0022, along)));
  col = mix(col, uPal[4], cover(r - 0.031));
  col = mix(col, uPal[3], cover(r - 0.012));
  return col;
}`;

// Claude Historian: stacked strata of past sessions, swept by a scanning slit of light.
MOTIFS.historian = /* glsl */`
vec3 motif(vec2 p, float t) {
  int idx[11] = int[11](0, 1, 3, 0, 2, 4, 5, 6, 7, 6, 7);
  vec3 col = uPal[0];
  for (int k = 0; k < 11; k++) {
    float fk = float(k);
    float base = 0.925 - fk * 0.083 + (h11(fk * 5.1 + 2.0) - 0.5) * 0.026;
    float b = base + 0.017 * sin(p.x * (3.0 + 3.0 * h11(fk * 1.3)) + fk * 1.7 + t * 0.05)
                   + 0.030 * (vnoise(vec2(p.x * 3.2 + fk * 7.1, fk * 2.3 + t * 0.02)) - 0.5)
                   + 0.009 * (vnoise(vec2(p.x * 9.0 + fk * 3.3, fk)) - 0.5);
    col = mix(col, uPal[idx[k]], cover(p.y - b));
  }
  float wy = p.y + 0.012 * sin(p.x * 4.0 + 1.3) + 0.01 * (vnoise(vec2(p.x * 3.0, 9.1)) - 0.5);
  float hs = 0.0175;
  float hk = floor(wy / hs + 0.5);
  col = mix(col, uPal[7], ring(abs(wy / hs - hk) * hs, 0.0007) * 0.12 * step(0.5, h11(hk * 2.7)));
  float sx = 0.70 + 0.16 * sin(t * 0.16);
  float dx = abs(p.x - sx);
  float vy = smoothstep(0.05, 0.5, p.y);
  col *= 1.0 + 1.1 * exp(-dx / 0.018) * (0.3 + 0.7 * vy);
  col += uPal[0] * 0.28 * exp(-dx / 0.06) * vy;
  col = mix(col, vec3(1.0, 0.985, 0.95), cover(dx - 0.0018) * (0.45 + 0.55 * vy));
  return col;
}`;

// Xactions: one agent, a radial burst of actions out to many endpoints.
MOTIFS.burst = /* glsl */`
vec3 motif(vec2 p, float t) {
  vec3 col = mix(uPal[1], uPal[0], smoothstep(0.0, 1.0, p.y * 0.85 + p.x * 0.15));
  vec2 O = vec2(0.6, 0.635);
  vec2 q = p - O;
  float dO = length(q);
  col = mix(col, uPal[5], 0.35 * exp(-dO / 0.16));
  float N = 44.0, st = TAU / N;
  float kc = floor(atan(q.y, q.x) / st + 0.5);
  float rays = 0.0, pulse = 0.0;
  for (int j = -1; j <= 1; j++) {
    float k = mod(kc + float(j), N);
    float th = k * st + (h11(k * 1.91) - 0.5) * st * 0.6;
    vec2 dir = vec2(cos(th), sin(th));
    float L = 0.13 + 0.30 * pow(h11(k * 7.3 + 1.0), 0.8);
    L = min(L, dir.x > 0.0 ? (0.95 - O.x) / dir.x : (O.x - 0.05) / -dir.x);
    L = min(L, dir.y > 0.0 ? (0.86 - O.y) / dir.y : (O.y - 0.335) / -dir.y);
    vec2 e = O + dir * L;
    float ds = sdSeg(p, O + dir * 0.07, e);
    rays = max(rays, ring(ds, 0.0021));
    float along = dot(q, dir);
    float pp = 0.07 + fract(t * 0.11 + h11(k * 3.3)) * (L - 0.07);
    pulse = max(pulse, cover(max(abs(along - pp) - 0.018, ds) - 0.0042));
    float er = 0.009 + 0.013 * h11(k * 5.7);
    float de = length(p - e) - er;
    bool deep = h11(k * 9.1) > 0.62;
    col = mix(col, deep ? uPal[4] : uPal[3], cover(de));
  }
  col = mix(col, uPal[2], rays * 0.92);
  col = mix(col, uPal[2], pulse);
  col = mix(col, uPal[2], ring(dO - 0.095, 0.0016));
  col = mix(col, uPal[2], ring(dO - 0.074, 0.0024));
  col = mix(col, uPal[4], cover(dO - 0.054));
  col = mix(col, uPal[3], cover(dO - 0.017));
  return col;
}`;

// Stellar Explorer: orbits within orbits around a bright star, a starfield, nebula light.
MOTIFS.stellar = /* glsl */`
float stars(vec2 p, float cell, float dens, float t) {
  vec2 g = p / cell; vec2 id = floor(g); vec2 f = fract(g);
  float h = h12(id);
  if (h < dens) return 0.0;
  vec2 sp = 0.2 + 0.6 * h22(id + 3.1);
  float b = (h - dens) / (1.0 - dens);
  float r = cell * (0.035 + 0.075 * b);
  float d = length(f - sp) * cell;
  float tw = 0.78 + 0.22 * sin(t * (0.6 + 1.6 * h) + h * 40.0);
  float halo = pow(max(0.0, 1.0 - d / (0.19 * cell)), 3.0);
  return (cover(d - r) * (0.55 + 0.45 * b) + halo * 0.32 * b) * tw;
}
vec3 planet(vec3 col, vec2 p, vec2 P, float r, vec3 c, vec2 light) {
  vec2 q = (p - P) / r;
  float sh = 0.5 + 0.5 * dot(normalize(light), q);
  vec3 lit = c * (0.35 + 0.85 * sh);
  return mix(col, lit, cover(length(p - P) - r));
}
vec3 motif(vec2 p, float t) {
  vec3 col = mix(uPal[1], uPal[0], smoothstep(0.0, 1.0, p.y));
  vec2 w = vec2(fbm(p * 2.0 + vec2(1.7, 9.2) + t * 0.006), fbm(p * 2.0 + vec2(8.3, 2.8) - t * 0.005));
  float n = fbm(p * 2.6 + w * 1.5);
  float band = exp(-pow((p.y - 0.62 - 0.32 * (p.x - 0.5)) / 0.23, 2.0));
  vec3 nc = mix(uPal[2], uPal[3], smoothstep(0.35, 0.65, w.x));
  col += nc * smoothstep(0.42, 0.85, n) * band * 0.6;
  col += nc * 0.09 * band * n;
  col += uPal[4] * (stars(p, 0.021, 0.84, t) + 1.1 * stars(p + 0.37, 0.05, 0.78, t));
  vec2 Cs = vec2(0.585, 0.64);
  vec2 q = p - Cs; float d = length(q);
  col += uPal[6] * 0.4 * exp(-d / 0.07) + vec3(1.0) * 0.9 * exp(-d / 0.014);
  col += vec3(1.0, 0.95, 0.85) * 0.5 * (exp(-abs(q.y) / 0.0017) * exp(-abs(q.x) / 0.10) + exp(-abs(q.x) / 0.0017) * exp(-abs(q.y) / 0.10));
  col = mix(col, vec3(1.0), cover(d - 0.0145));
  float tilt = -0.30, ratio = 0.36;
  vec2 o = rot(tilt) * q;
  float radii[3] = float[3](0.16, 0.265, 0.385);
  for (int i = 0; i < 3; i++) {
    float f = length(vec2(o.x, o.y / ratio));
    float gl = length(vec2(o.x, o.y / (ratio * ratio))) / max(f, 1e-4);
    col = mix(col, uPal[5], ring((f - radii[i]) / gl, 0.0013) * (o.y < 0.0 ? 0.8 : 0.4));
  }
  mat2 back = rot(-tilt);
  float a1 = 2.3 + t * 0.10, a2 = 5.35 + t * 0.06, a3 = 0.85 + t * 0.04;
  vec2 P1 = Cs + back * vec2(radii[0] * cos(a1), radii[0] * ratio * sin(a1));
  vec2 P2 = Cs + back * vec2(radii[1] * cos(a2), radii[1] * ratio * sin(a2));
  vec2 P3 = Cs + back * vec2(radii[2] * cos(a3), radii[2] * ratio * sin(a3));
  vec2 m = rot(tilt) * (p - P2);
  float fm = length(vec2(m.x, m.y / 0.42));
  float glm = length(vec2(m.x, m.y / (0.42 * 0.42))) / max(fm, 1e-4);
  col = mix(col, uPal[5], ring((fm - 0.06) / glm, 0.0011) * 0.7);
  col = planet(col, p, P1, 0.010, uPal[3], Cs - P1);
  col = planet(col, p, P2, 0.024, uPal[6], Cs - P2);
  col = planet(col, p, P3, 0.016, uPal[7], Cs - P3);
  float am = 1.2 + t * 0.35;
  vec2 Pm = P2 + back * vec2(0.06 * cos(am), 0.06 * 0.42 * sin(am));
  col = mix(col, uPal[4], cover(length(p - Pm) - 0.0058));
  return col;
}`;

// About Neil: growth rings spreading out of the letters of the name.
MOTIFS.about = /* glsl */`
vec3 motif(vec2 p, float t) {
  vec3 col = mix(uPal[6], uPal[0], smoothstep(0.0, 0.9, p.y));
  float d = texture2D(uSdf, p).r;
  float w = d + 0.012 * (fbm(p * 4.5 + 2.0) - 0.5) * smoothstep(0.0, 0.25, d);
  float sp = 0.024;
  float ph = w / sp - t * 0.05;
  float k = floor(ph + 0.5);
  float hw = sp * (0.17 + 0.16 * h11(k * 1.31 + 7.0));
  float m = mod(k, 4.0);
  vec3 rc = m < 0.5 ? uPal[2] : m < 1.5 ? uPal[1] : m < 2.5 ? uPal[4] : uPal[3];
  float a = ring(abs(ph - k) * sp, hw) * (1.0 - smoothstep(0.3, 0.85, w)) * cover(0.0015 - d);
  return mix(col, rc, a);
}`;

// ---------- designs ----------
// pal: up to eight sRGB colours the motif indexes as uPal[i].
// title.ink / mark: sRGB ink for the title and the edition mark.
// back: paper, ink (name, values), soft (labels, stack), accent (rules, link).
// bandY: centre of the front strip shown across the top of the back.
// t0: the moment the still cover shows; alive time runs on from it.

function designFor(entry) {
  const acc = entry.accent?.light;
  switch (entry.name) {
    case 'Mirra': return {
      motif: 'mirra', t0: 6,
      pal: ['#4F9BE0', '#CFE7FB', acc, '#174A8B', '#FFF0C4', '#EAF5FF', '#7DB8EA'],
      title: { ink: '#FFFFFF' }, mark: '#FFFFFF', bandY: 0.62,
      back: { paper: '#F3F8FD', ink: '#123E78', soft: '#53708F', accent: acc },
    };
    case 'stet': return {
      motif: 'stet', t0: 2,
      pal: ['#FAF3E4', acc, '#93D0D5', '#F0532E', '#E6D9C1', '#F4B7A6'],
      title: { ink: '#103B3F', face: 'serif', max: 360, baseline: 190, dots: true }, mark: acc, bandY: 0.66,
      back: { paper: '#FBF6EC', ink: '#103B3F', soft: '#58706F', accent: acc },
    };
    case 'Social Hook': return {
      motif: 'hook', t0: 9.3,
      pal: ['#FFE35E', '#FFC93F', acc, '#14309A', '#FFFFFF', '#FFF3B0'],
      title: { ink: '#14309A' }, mark: '#14309A', bandY: 0.63,
      back: { paper: '#FFFBEA', ink: '#14309A', soft: '#4D5A92', accent: acc },
    };
    case 'Clauded': return {
      motif: 'clauded', t0: 3,
      pal: ['#E4FBF7', '#A9ECE4', '#F6FFFE', '#7FE0E0', acc, '#06595E', '#FF6A55', '#FFFFFF'],
      title: { ink: '#06595E' }, mark: '#06595E', bandY: 0.6,
      back: { paper: '#F1FCFA', ink: '#06595E', soft: '#4D7C7E', accent: acc },
    };
    case 'LikeWiki': return {
      motif: 'likewiki', t0: 4,
      pal: ['#FFEDE0', '#FFDAC5', acc, '#5C2236', '#FFF8F1', '#FFB62E', '#FFC6AD'],
      title: { ink: '#5C2236' }, mark: '#5C2236', bandY: 0.7,
      back: { paper: '#FFF7F1', ink: '#5C2236', soft: '#87605F', accent: acc },
    };
    case 'Track Record': return {
      motif: 'track', t0: 1,
      pal: ['#6A68EE', '#4C49D6', '#8280F4', '#FF7E6E', '#FFFFFF', '#C9F65E', '#3633AE', '#7775F1'],
      title: { ink: '#FFFFFF' }, mark: '#FFFFFF', bandY: 0.6,
      back: { paper: '#F4F4FE', ink: '#2A2896', soft: '#5F5E99', accent: acc },
    };
    case 'Claude Historian': return {
      motif: 'historian', t0: 1.5,
      pal: ['#FFE8CE', '#FFC9A1', '#FFA586', '#F7949F', '#EB7A58', acc, '#8E3A26', '#5A2016'],
      title: { ink: '#FFF2E4' }, mark: '#8E3A26', bandY: 0.72,
      back: { paper: '#FFF6EE', ink: '#5A2016', soft: '#8A5A4C', accent: acc },
    };
    case 'About Neil': return {
      motif: 'about', t0: 3,
      pal: ['#FFF5E8', '#FFB088', '#FF7A66', '#FFD772', '#F7A3BC', '#4E1A2E', '#FFE2CB'],
      title: { ink: '#4E1A2E', face: 'serif', text: 'Neil', max: 420 }, mark: '#4E1A2E', corner: 'About', bandY: 0.62,
      back: { paper: '#FFF8F0', ink: '#4E1A2E', soft: '#7D5A60', accent: '#E0634F' },
    };
  }
  // Entries without a hand-set design take a palette from the name's hash.
  if (entry.name === 'Stellar Explorer') {
    const h = hashHue(entry.name, 250, 270);
    return {
      motif: 'stellar', t0: 4,
      pal: [hsl(h, 0.62, 0.16), hsl(h + 12, 0.62, 0.31), hsl(h + 75, 1, 0.66), hsl(h - 65, 1, 0.62),
        '#FFFFFF', hsl(h, 1, 0.87), hsl(h - 212, 1, 0.66), hsl(h + 118, 1, 0.68)],
      title: { ink: '#FFFFFF' }, mark: hsl(h, 1, 0.9), bandY: 0.64,
      back: { paper: hsl(h, 0.6, 0.975), ink: hsl(h, 0.6, 0.2), soft: hsl(h, 0.18, 0.42), accent: hsl(h, 0.7, 0.55) },
    };
  }
  // The fallback motif takes its hue from the entry's accent when it has one (Topshine), else from the name.
  const h = acc ? new THREE.Color(acc).getHSL({}, THREE.SRGBColorSpace).h * 360 : hashHue(entry.name, 322, 344);
  return {
    motif: 'burst', t0: 2,
    pal: [hsl(h, 1, 0.64), hsl(h + 42, 1, 0.61), hsl(h + 60, 1, 0.96), hsl(h + 86, 1, 0.66), hsl(h - 50, 0.75, 0.17), hsl(h + 15, 1, 0.8)],
    title: { ink: hsl(h - 50, 0.75, 0.17) }, mark: hsl(h - 50, 0.75, 0.17), bandY: 0.64,
    back: { paper: hsl(h, 1, 0.975), ink: hsl(h - 50, 0.75, 0.17), soft: hsl(h - 40, 0.2, 0.42), accent: hsl(h, 0.85, 0.52) },
  };
}

// ---------- type ----------
// Layout is in 1024-unit space for the front and 512-unit space for the back, scaled to the target.
// Each ink goes to its own channel of an opaque black canvas: R, G, B -> uInk0..2.

const CH = ['#ff0000', '#00ff00', '#0000ff'];
const canvases = new Map();
function textCtx(size) {
  let ctx = canvases.get(size);
  if (!ctx) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    ctx = c.getContext('2d', { alpha: false, willReadFrequently: true });
    canvases.set(size, ctx);
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, size, size);
  ctx.globalCompositeOperation = 'lighter';
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  return ctx;
}
function setFont(ctx, weight, px, family, tracking = 0) {
  ctx.font = `${weight} ${px}px "${family}"`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${(tracking * px).toFixed(2)}px`;
}
// ink extent of a line: left bearing and width, so big type aligns optically to the margin
function inkBox(ctx, text) {
  const m = ctx.measureText(text);
  return { left: m.actualBoundingBoxLeft, width: m.actualBoundingBoxLeft + m.actualBoundingBoxRight };
}
function wrap(ctx, text, width) {
  const words = text.split(' '), lines = [];
  let line = '';
  for (const w of words) {
    const next = line ? line + ' ' + w : w;
    if (line && ctx.measureText(next).width > width) { lines.push(line); line = w; } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

// Front: edition mark across the top, the title set big at the lower left.
// Returns per-letter anchors (p-space) when the design asks for them.
function drawFront(ctx, entry, d) {
  const W = ctx.canvas.width, S = W / 1024, M = 60 * S;
  ctx.fillStyle = CH[1];
  setFont(ctx, 600, 27 * S, 'NJ Text', 0.01);
  ctx.fillText('njct.io', M, M + 20 * S);
  ctx.textAlign = 'right';
  ctx.fillText(d.corner || entry.year, W - M, M + 20 * S);
  ctx.textAlign = 'left';

  const t = d.title;
  const serif = t.face === 'serif';
  const fam = serif ? 'NJ Serif' : 'NJ Display', wt = serif ? 600 : 800, track = serif ? -0.02 : -0.035;
  const lines = (t.text || entry.name).split(' ');
  setFont(ctx, wt, 100, fam, track);
  const widest = Math.max(...lines.map(l => inkBox(ctx, l).width));
  const px = Math.min((t.max || (lines.length > 1 ? 190 : 300)) * S, 100 * (W - 2 * M) / widest);
  setFont(ctx, wt, px, fam, track);
  const lead = px * (serif ? 0.9 : 0.86);
  const base = W - (t.baseline ? t.baseline * S : M + 4 * S);
  ctx.fillStyle = CH[0];
  const anchors = [];
  lines.forEach((line, i) => {
    const y = base - (lines.length - 1 - i) * lead;
    const x = M + inkBox(ctx, line).left;
    ctx.fillText(line, x, y);
    if (t.dots) {
      for (let c = 0; c < line.length && anchors.length < 8; c++) {
        const start = ctx.measureText(line.slice(0, c)).width;
        const b = ctx.measureText(line[c]);
        const cx = x + start + (b.actualBoundingBoxRight - b.actualBoundingBoxLeft) / 2;
        anchors.push([cx / W, 1 - (y + 78 * S) / W, 23 / 1024]);
      }
    }
  });
  return anchors;
}

// Back: name and year, the figures as a ruled list, then stack, link and edition mark.
function drawBack(ctx, entry, d) {
  const W = ctx.canvas.width, S = W / 512, M = 30 * S;
  const top = 0.3 * W;
  const rule = (y) => { ctx.fillStyle = CH[2]; ctx.fillRect(M, Math.round(y), W - 2 * M, Math.max(1, Math.round(S))); };
  if (entry.kind === 'about') {
    ctx.fillStyle = CH[0];
    setFont(ctx, 600, 44 * S, 'NJ Serif', -0.015);
    ctx.fillText(entry.about[0], M, top + 64 * S);
    ctx.fillStyle = CH[1];
    setFont(ctx, 400, 17 * S, 'NJ Text', -0.005);
    let y = top + 108 * S;
    for (const para of entry.about.slice(1)) {
      for (const line of wrap(ctx, para, W - 2 * M)) { ctx.fillText(line, M, y); y += 25 * S; }
      y += 11 * S;
    }
  } else {
    ctx.fillStyle = CH[0];
    setFont(ctx, 800, 100, 'NJ Display', -0.02);
    const fit = 100 * (W - 2 * M - 70 * S) / inkBox(ctx, entry.name).width;
    setFont(ctx, 800, Math.min(36 * S, fit), 'NJ Display', -0.02);
    ctx.fillText(entry.name, M + inkBox(ctx, entry.name).left, top + 52 * S);
    ctx.fillStyle = CH[1];
    setFont(ctx, 600, 14 * S, 'NJ Text', 0.01);
    ctx.textAlign = 'right';
    ctx.fillText(entry.year, W - M, top + 52 * S);
    ctx.textAlign = 'left';
    const rowH = 60 * S, y0 = top + 78 * S, split = M + 0.5 * (W - 2 * M);
    entry.figs.forEach(([value, label], i) => {
      const ry = y0 + i * rowH;
      rule(ry);
      ctx.fillStyle = CH[0];
      setFont(ctx, 800, 100, 'NJ Display', -0.02);
      const vfit = 100 * (split - M - 14 * S) / inkBox(ctx, value).width;
      setFont(ctx, 800, Math.min(30 * S, vfit), 'NJ Display', -0.02);
      ctx.fillText(value, M + inkBox(ctx, value).left, ry + rowH / 2 + 10.5 * S);
      ctx.fillStyle = CH[1];
      setFont(ctx, 400, 14.5 * S, 'NJ Text', 0);
      const lines = wrap(ctx, label, W - M - split).slice(0, 2);
      const lh = 19 * S;
      lines.forEach((l, j) => ctx.fillText(l, split, ry + rowH / 2 + 5 * S + (j - (lines.length - 1) / 2) * lh));
    });
    rule(y0 + entry.figs.length * rowH);
    ctx.fillStyle = CH[1];
    setFont(ctx, 500, 12 * S, 'NJ Mono', 0);
    wrap(ctx, entry.stack, W - 2 * M).slice(0, 2).forEach((l, j, all) =>
      ctx.fillText(l, M, W - M - 24 * S - (all.length - 1 - j) * 17 * S));
    ctx.fillStyle = CH[2];
    setFont(ctx, 600, 13.5 * S, 'NJ Text', 0);
    if (entry.url) ctx.fillText(entry.url.replace(/^https?:\/\//, '').replace(/\/$/, ''), M, W - M);   // Scorecard, Topshine: no public url
  }
  ctx.fillStyle = CH[1];
  setFont(ctx, 600, 12 * S, 'NJ Text', 0.01);
  ctx.textAlign = 'right';
  ctx.fillText('njct.io', W - M, W - M);
  ctx.textAlign = 'left';
}

// ---------- signed distance field of the title (About Neil) ----------
// Felzenszwalb–Huttenlocher squared EDT on the anti-aliased mask (TinySDF's method).

const INF = 1e20;
function edt1d(grid, offset, stride, length, f, v, z) {
  v[0] = 0; z[0] = -INF; z[1] = INF;
  for (let q = 0; q < length; q++) f[q] = grid[offset + q * stride];
  for (let q = 1, k = 0, s = 0; q < length; q++) {
    do {
      const r = v[k];
      s = (f[q] - f[r] + q * q - r * r) / (q - r) / 2;
    } while (s <= z[k] && --k > -1);
    k++; v[k] = q; z[k] = s; z[k + 1] = INF;
  }
  for (let q = 0, k = 0; q < length; q++) {
    while (z[k + 1] < q) k++;
    const r = v[k];
    grid[offset + q * stride] = f[r] + (q - r) * (q - r);
  }
}
function edt(grid, w, h) {
  const n = Math.max(w, h), f = new Float64Array(n), v = new Uint16Array(n), z = new Float64Array(n + 1);
  for (let x = 0; x < w; x++) edt1d(grid, x, w, h, f, v, z);
  for (let y = 0; y < h; y++) edt1d(grid, y * w, 1, w, f, v, z);
}
function titleSdf(entry, d, res) {
  const ctx = textCtx(res);
  drawFront(ctx, { ...entry, year: '' }, { ...d, corner: ' ' });
  // erase the mark row: only the title seeds the field
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, res, res * 0.15);
  const img = ctx.getImageData(0, 0, res, res).data;
  const N = res * res, outer = new Float64Array(N), inner = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    const a = img[i * 4] / 255;
    outer[i] = a === 1 ? 0 : a === 0 ? INF : Math.max(0, 0.5 - a) ** 2;
    inner[i] = a === 1 ? INF : a === 0 ? 0 : Math.max(0, a - 0.5) ** 2;
  }
  edt(outer, res, res); edt(inner, res, res);
  const half = new Uint16Array(N);
  for (let y = 0; y < res; y++) {
    for (let x = 0; x < res; x++) {
      const i = y * res + x;
      const dist = (Math.sqrt(outer[i]) - Math.sqrt(inner[i])) / res;
      half[(res - 1 - y) * res + x] = THREE.DataUtils.toHalfFloat(dist);   // rows bottom-up: p.y up
    }
  }
  const tex = new THREE.DataTexture(half, res, res, THREE.RedFormat, THREE.HalfFloatType);
  tex.minFilter = tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

// ---------- scheduling ----------
// Renders are queued and run one job (a front, a back, or a distance field) per frame.

export const coverProfiler = { wrap: null };   // optional (label, fn) => fn() wrapper for timing
const jobs = [];
let pumping = false;
const nextFrame = f => (document.hidden ? setTimeout(f, 16) : requestAnimationFrame(f));
function enqueue(label, fn) {
  return new Promise((resolve, reject) => {
    jobs.push({ label, fn, resolve, reject });
    if (!pumping) { pumping = true; nextFrame(pump); }
  });
}
function pump() {
  const job = jobs.shift();
  if (job) {
    try { job.resolve(coverProfiler.wrap ? coverProfiler.wrap(job.label, job.fn) : job.fn()); } catch (e) { job.reject(e); }
  }
  if (jobs.length) nextFrame(pump); else pumping = false;
}

// ---------- the cover ----------

const TRI = new THREE.BufferGeometry();
TRI.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
const CAM = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const BLANK_SDF = new THREE.DataTexture(new Uint16Array([0]), 1, 1, THREE.RedFormat, THREE.HalfFloatType);
BLANK_SDF.needsUpdate = true;
let aliveCover = null;   // at most one cover animates at a time

export async function createCover(renderer, entry, index, { size = 1024, backSize = 512, samples = 4, aliveSamples = Math.min(2, samples) } = {}) {
  await loadCoverFonts();
  const d = designFor(entry, index);
  const pal = d.pal.map(lin);
  while (pal.length < 8) pal.push(new THREE.Color(0, 0, 0));
  const uniforms = {
    uRes: { value: new THREE.Vector2(size, size) },
    uTime: { value: d.t0 },
    uSS: { value: samples },
    uMode: { value: 0 },
    uBandY: { value: d.bandY },
    uBandH: { value: 0.3 },
    uText: { value: null },
    uSdf: { value: BLANK_SDF },
    uInk0: { value: srgb(d.title.ink) },
    uInk1: { value: srgb(d.mark) },
    uInk2: { value: srgb(d.mark) },
    uPaper: { value: lin(d.back.paper) },
    uPal: { value: pal },
    uAux: { value: Array.from({ length: 8 }, () => new THREE.Vector4()) },
  };
  const material = new THREE.ShaderMaterial({
    name: `cover:${entry.name}`,
    vertexShader: VERT,
    fragmentShader: PRELUDE + MOTIFS[d.motif] + MAIN,
    uniforms, depthTest: false, depthWrite: false,
  });
  const scene = new THREE.Scene();
  const quad = new THREE.Mesh(TRI, material);
  quad.frustumCulled = false;
  scene.add(quad);
  await renderer.compileAsync(scene, CAM);

  const aniso = renderer.capabilities.getMaxAnisotropy();
  const target = s => new THREE.WebGLRenderTarget(s, s, {
    depthBuffer: false, stencilBuffer: false, generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter, magFilter: THREE.LinearFilter,
    colorSpace: THREE.SRGBColorSpace, anisotropy: aniso,
  });
  // backSize 0: no shelf back; the back is drawn on demand by detailBack().
  const frontRT = target(size), backRT = backSize ? target(backSize) : null;
  frontRT.texture.name = `${entry.name} front`;
  if (backRT) backRT.texture.name = `${entry.name} back`;

  const maskTexture = ctx => {
    const tex = new THREE.Texture(ctx.canvas);
    tex.colorSpace = THREE.NoColorSpace;
    tex.generateMipmaps = false;
    tex.minFilter = tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    renderer.initTexture(tex);   // upload now: the canvas is shared and is redrawn for the next cover
    return tex;
  };
  const frontMask = () => {
    const ctx = textCtx(size);
    const anchors = drawFront(ctx, entry, d);
    anchors.forEach(([x, y, r], i) => uniforms.uAux.value[i].set(x, y, r, 0));
    return maskTexture(ctx);
  };
  const draw = (rt, mode, mask, ss) => {
    const prev = renderer.getRenderTarget();
    uniforms.uMode.value = mode;
    uniforms.uRes.value.set(rt.width, rt.height);
    uniforms.uText.value = mask;
    uniforms.uSS.value = ss;
    uniforms.uInk0.value = srgb(mode ? d.back.ink : d.title.ink);
    uniforms.uInk1.value = srgb(mode ? d.back.soft : d.mark);
    uniforms.uInk2.value = srgb(mode ? d.back.accent : d.mark);
    renderer.setRenderTarget(rt);
    renderer.render(scene, CAM);
    renderer.setRenderTarget(prev);
  };

  let time = d.t0, speed = 0, want = 0, aliveMask = null, disposed = false;
  if (d.motif === 'about') await enqueue(`${entry.name} sdf`, () => { uniforms.uSdf.value = titleSdf(entry, d, 512); });
  if (backRT) await loadBackFonts();
  await Promise.all([
    enqueue(`${entry.name} front`, () => {
      const fm = frontMask();
      draw(frontRT, 0, fm, samples);
      fm.dispose();
    }),
    backRT && enqueue(`${entry.name} back`, () => {
      const bctx = textCtx(backSize);
      drawBack(bctx, entry, d);
      const bm = maskTexture(bctx);
      draw(backRT, 1, bm, samples);
      bm.dispose();
    }),
  ]);

  const stop = () => {
    speed = 0; want = 0;
    if (aliveMask) { aliveMask.dispose(); aliveMask = null; }
    if (aliveCover === cover) aliveCover = null;
  };
  let detailRT = null, detailP = null;
  const cover = {
    front: frontRT.texture,
    back: backRT ? backRT.texture : null,
    // The back at detail size (Details magnifies it), rendered once, on the first request.
    detailBack(detailSize = 1024) {
      if (disposed) return Promise.resolve(null);
      if (!detailP) detailP = loadBackFonts().then(() => {
        detailRT = target(detailSize);
        detailRT.texture.name = `${entry.name} back ${detailSize}`;
        return enqueue(`${entry.name} back ${detailSize}`, () => {
          const bctx = textCtx(detailSize);
          drawBack(bctx, entry, d);
          const bm = maskTexture(bctx);
          draw(detailRT, 1, bm, samples);
          bm.dispose();
        });
      }).then(() => detailRT.texture);
      return detailP;
    },
    setAlive(on) {
      if (disposed) return;
      want = on ? 1 : 0;
      if (!on) return;
      if (aliveCover && aliveCover !== cover) aliveCover._stop();
      aliveCover = cover;
      if (!aliveMask) aliveMask = frontMask();
    },
    update(dt) {
      if (!aliveMask) return;
      dt = Math.min(Math.max(dt, 0), 0.1);
      speed += (want - speed) * (1 - Math.exp(-dt * 2.5));
      if (want === 0 && speed < 0.02) { draw(frontRT, 0, aliveMask, samples); stop(); return; }
      time += dt * speed;
      uniforms.uTime.value = time;
      draw(frontRT, 0, aliveMask, aliveSamples);
    },
    dispose() {
      disposed = true;
      stop();
      frontRT.dispose(); if (backRT) backRT.dispose(); material.dispose();
      if (detailRT) detailRT.dispose();
      if (uniforms.uSdf.value !== BLANK_SDF) uniforms.uSdf.value.dispose();
    },
    _stop: stop,
  };
  return cover;
}
