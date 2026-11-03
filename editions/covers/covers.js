// Procedural record-sleeve covers for njct.io Editions.
//
// createCover(renderer, entry, index, { size }) renders one entry's front and
// back into mipmapped sRGB render targets. Each cover is a single full-target
// fragment shader: a per-entry motif evaluated with 4-sample rotated-grid
// supersampling and analytic edge coverage, then the type composited 1:1 from a
// canvas mask, the brand mark composited 1:1 from a colour overlay, then print
// grain and an 8-bit dither. Maths runs in linear light; the target stores sRGB.
//
// A cover whose art is the brand mark itself (Mirra, Clauded, Topshine) shades
// the real mark: the logo is rasterised, turned into a signed distance field by
// an exact Euclidean distance transform, and inflated into a smooth height field
// whose normals carry the gloss, glass and reflections.

import * as THREE from 'three';

// ---------- fonts ----------

const FONT_DIR = new URL('../../vendor/fonts/', import.meta.url);
// NJ Text is the page's own UI face (one variable file, already loaded for the header).
// The other faces are subset to exactly the glyphs the covers draw (vendor/fonts/SOURCE.txt lists each
// set and how to regenerate it when a title or back-cover string changes).
const FACES = [
  ['NJ Text', 'ui/inter-variable-ui.woff2', '100 900'],
  ['NJ Poppins', 'poppins-extrabold-cover.woff2', '800'],
  ['NJ Soft Serif', 'fraunces-144pt-black-soft-cover.woff2', '900'],
  ['NJ Serif', 'fraunces-144pt-bold-cover.woff2', '700'],
  ['NJ Hanken', 'hanken-grotesk-650-cover.woff2', '650'],
  ['NJ Condensed', 'archivo-condensed-extrabold-cover.woff2', '800'],
];
// Faces only the backs use load with the first back.
const BACK_FACES = [
  ['NJ Display', 'bricolage-grotesque-96pt-extrabold-cover.woff2', '800'],
  ['NJ Mono', 'jetbrains-mono-medium-cover.woff2', '500'],
];
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

// ---------- GLSL ----------

const VERT = /* glsl */`
void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const PRELUDE = /* glsl */`
precision highp float;
uniform vec2 uRes, uGrain;
uniform float uTime, uSS, uMode, uBandY, uBandH;
uniform sampler2D uText, uOver, uForm, uFormCol, uFront;
uniform vec3 uFormRect;
uniform sampler2D uRest;
uniform float uRestMix;
uniform vec3 uInk0, uInk1, uInk2, uPaper;
uniform vec3 uPal[8];
uniform vec4 uAux[8];
float PX, AAW;
vec2 FC;
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
float sat(float x) { return clamp(x, 0.0, 1.0); }
// concept-image coordinates (y down) to cover space (y up)
vec2 ic(float x, float y) { return vec2(x, 1.0 - y); }

// coverage of a signed distance (negative inside), box-filtered over one pixel
float cover(float d) { return clamp(0.5 - d / AAW, 0.0, 1.0); }
// coverage of a stroke of half-width w around a distance
float ring(float d, float w) { return cover(abs(d) - w); }
float sdSeg(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h); }
// signed distance to the line through a and b; negative on the left of a->b
float sdLine(vec2 p, vec2 a, vec2 b) { vec2 d = normalize(b - a); return (p - a).x * d.y - (p - a).y * d.x; }
// distance to an ellipse outline (first-order), negative inside
float sdEllipse(vec2 o, vec2 ab) {
  float f = length(o / ab);
  float g = length(o / (ab * ab));
  return (f - 1.0) * f / max(g, 1e-5);
}
// exact signed distance to a triangle (Quilez), negative inside, either winding
float sdTri(vec2 p, vec2 p0, vec2 p1, vec2 p2) {
  vec2 e0 = p1 - p0, e1 = p2 - p1, e2 = p0 - p2;
  vec2 v0 = p - p0, v1 = p - p1, v2 = p - p2;
  vec2 q0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0, 1.0);
  vec2 q1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0, 1.0);
  vec2 q2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0, 1.0);
  float s = sign(e0.x * e2.y - e0.y * e2.x);
  vec2 d = min(min(vec2(dot(q0, q0), s * (v0.x * e0.y - v0.y * e0.x)),
                   vec2(dot(q1, q1), s * (v1.x * e1.y - v1.y * e1.x))),
                   vec2(dot(q2, q2), s * (v2.x * e2.y - v2.y * e2.x)));
  return -sqrt(d.x) * sign(d.y);
}
mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
float ease(float u) { return u * u * (3.0 - 2.0 * u); }
// a soft falloff that reaches exactly zero at r
float falloff(float d, float r) { float u = sat(1.0 - max(d, 0.0) / r); return u * u * u; }

// The brand mark's field: r = signed distance (cover units, negative inside),
// g, b = slope of the inflated height field, a = height (0 rim .. 1 crown).
vec4 formAt(vec2 p) {
  vec2 u = (p - uFormRect.xy) / max(uFormRect.z, 1e-6);
  if (uFormRect.z <= 0.0 || u.x < 0.0 || u.y < 0.0 || u.x > 1.0 || u.y > 1.0) return vec4(1.0, 0.0, 0.0, 0.0);
  return texture2D(uForm, u);
}
vec2 formUv(vec2 p) { return (p - uFormRect.xy) / max(uFormRect.z, 1e-6); }
vec3 formNormal(vec4 f) { return normalize(vec3(-f.g, -f.b, 1.0)); }
float spec(vec3 n, vec3 l, float k) { return pow(sat(dot(reflect(-l, n), vec3(0.0, 0.0, 1.0))), k); }
`;

const MAIN = /* glsl */`
#ifndef INK0
#define INK0(p, t) uInk0
#endif
#ifndef INK1
#define INK1(p, t) uInk1
#endif
#ifndef INK2
#define INK2(p, t) uInk2
#endif
vec3 shade(vec2 p, float t) {
  if (uMode < 0.5) return motif(p, t);
  // back: a strip of the finished front across the top, paper below
  float by = 1.0 - uBandH;
  if (p.y < by - 2.0 * PX) return uPaper;
  vec3 m = texture2D(uFront, vec2(p.x, uBandY + (p.y - (1.0 - 0.5 * uBandH)))).rgb;
  return mix(uPaper, m, cover(by - p.y));
}
void main() {
  vec2 fc = gl_FragCoord.xy;
  FC = fc;
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
  vec2 uv = fc / uRes;
  // type, composited in sRGB the way the browser blends text
  vec4 m = texture2D(uText, uv);
  vec3 s = toSrgb(clamp(c, 0.0, 1.0));
  if (uMode < 0.5) {
    s = mix(s, INK0(uv, uTime), m.r);
    s = mix(s, INK1(uv, uTime), m.g);
    s = mix(s, INK2(uv, uTime), m.b);
    // the brand mark, premultiplied, drawn unaltered
    vec4 o = texture2D(uOver, uv);
    s = s * (1.0 - o.a) + o.rgb;
  } else {
    s = mix(s, uInk0, m.r);
    s = mix(s, uInk1, m.g);
    s = mix(s, uInk2, m.b);
  }
  // print finish: static fibre grain and a faint density drift, then dither to 8 bits
  float grain = h12(fc * 1.37 + 17.0) - 0.5;
  float dens = vnoise(fc / uRes * 7.0 + 11.0) - 0.5;
  s *= 1.0 + grain * uGrain.x + dens * uGrain.y;
  s += (ign(fc) - 0.5) / 255.0;
  vec3 o = toLin(clamp(s, 0.0, 1.0));
  // a released cover fades back to its resting frame
  if (uRestMix > 0.0) o = mix(o, texture2D(uRest, uv).rgb, uRestMix);
  gl_FragColor = vec4(o, 1.0);
}`;

// ---------- motifs ----------
// Each defines vec3 motif(vec2 p, float t): p in [0,1]^2 with y up, linear colour out.
// A motif may define INK0..INK2(p, t) to fill a type channel with its own sRGB colour.

const MOTIFS = {};

// Mirra: the ring mark as one glossy white form standing on a reflective floor.
MOTIFS.mirra = /* glsl */`
const float YF = 0.236;
vec3 ground(vec2 p) {
  vec3 col = mix(uPal[2], uPal[1], smoothstep(0.16, 0.64, p.y));
  col = mix(col, uPal[0], smoothstep(0.5, 1.05, p.y) * (0.75 + 0.25 * smoothstep(0.8, 0.1, p.x)));
  // haze along the horizon, brightest behind the form
  float hz = exp(-pow((p.y - YF - 0.02) / 0.11, 2.0)) * (0.45 + 0.55 * exp(-pow((p.x - 0.48) / 0.3, 2.0)));
  col = mix(col, uPal[3], 0.6 * hz);
  // floor: a pale sheen that deepens toward the front corners
  float fl = smoothstep(YF + 0.01, YF - 0.05, p.y);
  vec3 floorCol = mix(uPal[2], uPal[1], smoothstep(0.0, 0.25, YF - p.y) * (0.4 + 0.6 * abs(p.x - 0.5) * 2.0));
  return mix(col, floorCol, fl * 0.55);
}
vec3 ringShade(vec4 f, vec2 p, float t) {
  vec3 n = formNormal(f);
  vec3 L = normalize(vec3(-0.35, 0.55, 0.76));
  float dif = sat(0.62 + 0.38 * dot(n, L) / max(dot(vec3(0.0, 0.0, 1.0), L), 0.1) * 0.85);
  vec3 col = mix(uPal[4], vec3(1.0), dif);
  // inner and lower bevels take the blue of the room
  col = mix(col, uPal[5], 0.45 * pow(1.0 - n.z, 1.5) * sat(0.5 - n.y));
  // frosted: the room's blue shows through toward the edges of the face
  col = mix(col, uPal[4], 0.35 * (1.0 - smoothstep(0.2, 0.95, f.a)) * (0.6 + 0.4 * sat(-dot(n.xy, vec2(-0.6, 0.8)))));
  col += 0.30 * spec(n, L, 26.0);
  // a highlight that sweeps across the bevels when the cover is alive
  float ph = fract(t * 0.09 + 0.25) * 2.6 - 0.8;
  float sw = exp(-pow((p.x * 0.8 + p.y * 0.6 - ph) / 0.05, 2.0));
  col += sw * (0.25 + 0.75 * (1.0 - n.z)) * 0.6;
  return col;
}
vec3 motif(vec2 p, float t) {
  vec3 col = ground(p);
  // reflection in the floor
  if (p.y < YF) {
    float dz = YF - p.y;
    vec2 pm = vec2(p.x, 2.0 * YF - p.y);
    vec4 fm = formAt(pm);
    float b = 0.0015 + dz * 0.10;
    float a = smoothstep(b, -b, fm.r) * exp(-dz / 0.09) * 0.62;
    col = mix(col, ringShade(fm, pm, t) * 0.96, a);
    col += vec3(1.0) * 0.16 * falloff(fm.r - b, 0.05) * exp(-dz / 0.05);
  }
  vec4 f = formAt(p);
  // bloom around the form, strongest where it meets the floor
  col += vec3(1.0) * 0.12 * falloff(f.r, 0.06);
  col += vec3(1.0) * 0.30 * exp(-pow((p.x - 0.488) / 0.11, 2.0) - pow((p.y - YF) / 0.018, 2.0));
  col = mix(col, ringShade(f, p, t), cover(f.r));
  return col;
}`;

// stet: the word itself is the artwork, its letters filled with a grained teal,
// cream and gold gradient that drifts when the cover is alive.
MOTIFS.stet = /* glsl */`
vec3 motif(vec2 p, float t) {
  float v = length((p - vec2(0.5, 0.52)) * vec2(1.0, 1.1));
  return mix(uPal[0], uPal[1], smoothstep(0.25, 0.85, v));
}
vec3 stetFill(vec2 p, float t) {
  vec2 w = vec2(fbm(p * 2.1 + vec2(3.0, 7.0) + t * 0.025), fbm(p * 2.1 + vec2(9.0, 1.0) - t * 0.02));
  float ph = p.x * 1.15 - p.y * 0.95 + (w.x - 0.5) * 0.9 + t * 0.018;
  ph += (h12(FC * 0.71 + 3.0) - 0.5) * 0.16;            // stipple the transitions
  float k = fract(ph);
  vec3 a = uPal[2], b = uPal[3], c = uPal[4], d = uPal[5];
  vec3 col = k < 0.25 ? mix(a, b, smoothstep(0.0, 0.25, k))
           : k < 0.5 ? mix(b, c, smoothstep(0.25, 0.5, k))
           : k < 0.75 ? mix(c, d, smoothstep(0.5, 0.75, k))
           : mix(d, a, smoothstep(0.75, 1.0, k));
  // a soft fold of shade through the strokes
  col *= 0.86 + 0.14 * smoothstep(0.2, 0.8, w.y);
  col *= 1.0 + (h12(FC * 1.91 + 5.0) - 0.5) * 0.10;
  return toSrgb(col);
}
#define INK0(p, t) stetFill(p, t)`;

// Social Hook: a field of large geometric arcs and planes in the brand's blues.
MOTIFS.hook = /* glsl */`
vec3 motif(vec2 p, float t) {
  float dr = 0.012 * sin(t * 0.35);
  vec3 col = mix(uPal[0], uPal[1], 0.25 * smoothstep(0.2, 1.0, p.y));
  // a large lighter disc entering from the top right
  vec2 c1 = ic(0.88 + dr, 0.33);
  float d1 = length(p - c1) - 0.47;
  col = mix(col, mix(uPal[2], uPal[3], smoothstep(0.1, 0.5, length(p - c1 - vec2(0.15, 0.2)))), cover(d1));
  // a deeper disc under the second line
  vec2 c2 = ic(0.61 - dr * 0.6, 0.48);
  col = mix(col, mix(uPal[4], uPal[0], smoothstep(0.0, 0.2, length(p - c2 - vec2(-0.08, 0.06)))), cover(length(p - c2) - 0.17));
  // the lower left: a wide luminous arc
  vec2 c3 = ic(0.08 - dr, 1.06);
  float d3 = length(p - c3) - 0.53;
  vec3 g3 = mix(uPal[3], uPal[2], smoothstep(0.0, 0.5, length(p - ic(0.42, 0.62))));
  col = mix(col, g3, cover(d3));
  // a bow-tie of planes crossing low in the middle
  vec2 X = ic(0.47, 0.80);
  float la = sdLine(p, X, ic(0.27, 0.56));
  float lb = sdLine(p, X, ic(0.70, 0.58));
  float top = max(-la, lb);
  vec3 gt = mix(uPal[5], uPal[2], smoothstep(0.0, 0.25, X.y - p.y + 0.25));
  col = mix(col, mix(col, gt, 0.75), cover(max(top, -(p.y - X.y))));
  float bot = max(la, -lb);
  col = mix(col, mix(uPal[4], uPal[0], smoothstep(0.0, 0.2, X.y - p.y)), cover(max(bot, p.y - X.y)));
  // a split disc at the lower right
  vec2 c4 = ic(0.79 + dr * 0.5, 0.74);
  float d4 = length(p - c4) - 0.265;
  vec3 left = mix(uPal[5], uPal[2], smoothstep(-0.25, 0.1, p.x - c4.x));
  col = mix(col, left, cover(max(d4, p.x - c4.x)));
  col = mix(col, mix(uPal[4], uPal[0], smoothstep(-0.2, 0.25, c4.y - p.y)), cover(max(d4, c4.x - p.x)));
  // light falling across the planes
  col *= 1.0 + 0.08 * smoothstep(0.6, 0.0, length(p - ic(0.55, 0.5)));
  return col;
}`;

// Clauded: the whale mark as one large glossy glass form, its facets lit one by one.
MOTIFS.clauded = /* glsl */`
const float YF = 0.205;
vec3 ground(vec2 p) {
  float v = length((p - vec2(0.5, 0.42)) * vec2(0.9, 1.2));
  vec3 col = mix(uPal[1], uPal[0], smoothstep(0.05, 0.75, v));
  float fl = smoothstep(YF + 0.01, YF - 0.04, p.y);
  col = mix(col, mix(uPal[2], uPal[0], smoothstep(0.0, 0.2, YF - p.y)), fl * 0.6);
  return col;
}
vec3 whale(vec4 f, vec2 p, float t) {
  vec3 n = formNormal(f);
  vec3 alb = toLin(texture2D(uFormCol, formUv(p)).rgb);
  vec3 L = normalize(vec3(-0.35 + 0.3 * sin(t * 0.45), 0.65, 0.68));
  float dif = sat(0.5 + 0.5 * dot(n, L));
  alb = mix(alb, uPal[3], 0.35) * 1.25;
  vec3 col = alb * (0.62 + 0.7 * dif);
  col += uPal[3] * 0.22 * f.a * (0.6 + 0.4 * sat(p.y * 2.0 - 0.6));   // light carried inside the glass
  float edge = 1.0 - n.z;
  col += uPal[4] * pow(edge, 0.8) * sat(dot(normalize(n.xy + 1e-5), normalize(L.xy)) * 0.9 + 0.25) * 1.1;
  col *= 1.0 - 0.35 * edge * sat(-dot(normalize(n.xy + 1e-5), normalize(L.xy)));
  col += uPal[5] * 0.6 * spec(n, L, 30.0);
  return col;
}
vec3 motif(vec2 p, float t) {
  vec3 col = ground(p);
  if (p.y < YF) {
    float dz = YF - p.y;
    vec2 pm = vec2(p.x, 2.0 * YF - p.y);
    vec4 fm = formAt(pm);
    float b = 0.0015 + dz * 0.09;
    col = mix(col, whale(fm, pm, t) * 0.85, smoothstep(b, -b, fm.r) * exp(-dz / 0.07) * 0.55);
  }
  vec4 f = formAt(p);
  col += uPal[3] * 0.05 * falloff(f.r, 0.05);
  col += uPal[3] * 0.30 * exp(-pow((p.x - 0.5) / 0.28, 2.0) - pow((p.y - YF) / 0.025, 2.0));
  col = mix(col, whale(f, p, t), cover(f.r));
  return col;
}
vec3 claudedInk(vec2 p) { return mix(uInk0, uInk1, smoothstep(0.97, 0.8, p.y)); }
#define INK0(p, t) claudedInk(p)`;

// LikeWiki: two words stacked huge over large circular fields, cream above, green below.
MOTIFS.likewiki = /* glsl */`
vec3 motif(vec2 p, float t) {
  float dr = 0.01 * sin(t * 0.3);
  vec3 col = mix(uPal[0], uPal[1], cover(p.y - 0.502));
  // cream half: a sage disc at the top left, a faint lighter field at the right
  col = mix(col, uPal[5], cover(length(p - ic(0.93, 0.28)) - 0.42) * 0.5 * cover(0.5 - p.y));
  col = mix(col, mix(uPal[2], uPal[3], 0.25), cover(length(p - ic(0.27 + dr, 0.0)) - 0.31) * cover(0.502 - p.y));
  // a disc that straddles the fold
  vec2 cm = ic(0.74 - dr, 0.47);
  float dm = length(p - cm) - 0.16;
  col = mix(col, p.y > 0.502 ? uPal[3] : uPal[4], cover(dm));
  // green half: deeper discs behind the second word, a light disc rising from the bottom
  col = mix(col, uPal[4], cover(length(p - ic(0.24, 0.64 + dr)) - 0.17) * cover(p.y - 0.502));
  col = mix(col, uPal[6], cover(length(p - ic(0.52, 0.66)) - 0.13) * cover(p.y - 0.502) * 0.8);
  vec2 cb = ic(0.53 + dr, 1.15);
  col = mix(col, mix(uPal[2], uPal[3], smoothstep(0.1, 0.35, length(p - cb - vec2(0.0, 0.2)))), cover(length(p - cb) - 0.35));
  return col;
}`;

// Topshine: the star mark as clear violet glass, lit from inside and at its rims, inside a thin glass ring.
MOTIFS.topshine = /* glsl */`
const float YF = 0.205;
vec3 ground(vec2 p) {
  float v = length((p - vec2(0.5, 0.56)) * vec2(1.0, 1.1));
  vec3 col = mix(uPal[0], uPal[1], smoothstep(0.1, 0.8, v));
  col = mix(col, uPal[2], 0.35 * exp(-pow(length(p - vec2(0.5, 0.55)) / 0.3, 2.0)));
  // violet haze drifting through the room
  col = mix(col, uPal[2], 0.45 * exp(-pow(length((p - ic(0.78, 0.55)) * vec2(1.0, 1.6)) / 0.2, 2.0)));
  col = mix(col, uPal[4], 0.25 * exp(-pow(length((p - ic(0.62, 0.86)) * vec2(0.8, 2.0)) / 0.18, 2.0)));
  float fl = smoothstep(YF + 0.02, YF - 0.06, p.y);
  col = mix(col, mix(uPal[0], uPal[1], smoothstep(0.0, 0.35, abs(p.x - 0.5)) * 0.8), fl * 0.5);
  return col;
}
vec3 orb(vec4 f, vec2 p, float t, vec4 o) {
  // a clear glass sphere: the room refracted and flipped, a dark violet limb, a hard highlight
  vec2 q = (p - o.xy) / o.z;
  float rr = dot(q, q);
  vec3 n = vec3(q, sqrt(sat(1.0 - rr)));
  vec3 seen = ground(o.xy - q * o.z * 0.8) * mix(vec3(1.0), uPal[4], 0.55);
  vec3 col = mix(seen, uPal[7], 0.7 * pow(sat(rr), 1.2));
  col += uPal[6] * 0.55 * exp(-length(q - vec2(0.35, -0.45)) / 0.22);   // light focused through the ball
  col = mix(col, uPal[6], 0.55 * pow(1.0 - n.z, 5.0));
  col += vec3(1.0) * 1.2 * pow(sat(dot(reflect(-normalize(vec3(-0.5, 0.6, 0.62)), n), vec3(0.0, 0.0, 1.0))), 90.0);
  return col;
}
vec3 glass(vec4 f, vec2 p, float t) {
  for (int i = 0; i < 2; i++) { vec4 o = uAux[i]; if (o.z > 0.0 && length(p - o.xy) < o.z * 1.3) return orb(f, p, t, o); }
  vec3 n = formNormal(f);
  float th = f.a;
  // the two faces of every arm: deep violet away from the light, lavender toward it
  float tilt = length(n.xy);
  float side = dot(n.xy / max(tilt, 1e-4), normalize(vec2(0.62, 0.78))) * smoothstep(0.0, 0.35, tilt);
  vec3 body = mix(uPal[7], uPal[4], sat(0.5 + 0.55 * side));
  body = mix(body, uPal[3], 0.35 * th);
  // the room seen through the glass
  vec3 seen = ground(p - n.xy * 0.06 * (0.3 + th)) * mix(vec3(1.0), uPal[3], 0.5);
  body = mix(body, seen, 0.22 * (1.0 - th));
  // reflection of the room: a bright softbox at the upper left, pink and ice toward the rims
  float fres = pow(1.0 - n.z, 3.0);
  vec3 env = mix(mix(uPal[5], uPal[6], 0.5 + 0.5 * n.x), vec3(1.0), sat(dot(n.xy, vec2(-0.6, 0.7)) * 1.6));
  body = mix(body, env, sat(fres * 0.7));
  body += vec3(1.0) * 0.55 * ring(f.r + 0.0045, 0.0013);             // a thin lit rim just inside the edge
  vec3 L1 = normalize(vec3(-0.5, 0.6, 0.62));
  vec3 L2 = normalize(vec3(0.75, -0.15, 0.64));
  body += vec3(1.0) * 0.85 * spec(n, L1, 70.0) + uPal[5] * 0.4 * spec(n, L2, 36.0);
  // caustics: bright threads inside the glass that shimmer when alive
  float cz = sin(dot(p, vec2(31.0, 23.0)) + n.x * 9.0 - n.y * 7.0 + t * 1.1) * sin(dot(p, vec2(-19.0, 29.0)) + n.y * 8.0 - t * 0.8);
  body += vec3(0.95, 0.9, 1.0) * 0.20 * pow(sat(cz), 6.0) * th;
  return body;
}
vec3 glassRing(vec3 col, vec2 p, float t, bool front) {
  vec2 C = ic(0.50, 0.53);
  vec2 o = rot(0.45) * (p - C);
  vec2 ab = vec2(0.43, 0.125);
  float d = sdEllipse(o, ab);
  float k = smoothstep(-0.01, 0.01, front ? -o.y : o.y);
  float w = 0.0105;
  float x = sat(abs(d) / w);                                          // 0 tube centre .. 1 tube edge
  float ang = atan(o.y / ab.y, o.x / ab.x);
  float sweep = 0.5 + 0.5 * sin(ang * 2.0 - t * 0.6 + 1.0);
  vec3 tube = col * mix(vec3(1.0), uPal[3], 0.25) + uPal[6] * 0.12;
  tube += vec3(1.0) * 0.55 * pow(x, 6.0) * (0.6 + 0.4 * sweep);      // the tube's bright edges
  tube += vec3(1.0) * 0.45 * exp(-pow((d + w * 0.3) / (w * 0.18), 2.0)) * sweep;   // a running highlight
  col = mix(col, tube, ring(d, w) * k);
  col += uPal[5] * 0.10 * exp(-abs(d) / 0.012) * k;
  return col;
}
vec3 motif(vec2 p, float t) {
  vec3 col = ground(p);
  // a faint haze ring behind everything
  vec2 hq = rot(-0.25) * (p - ic(0.56, 0.40));
  col += uPal[5] * 0.10 * exp(-abs(sdEllipse(hq, vec2(0.36, 0.22))) / 0.012);
  if (p.y < YF) {
    float dz = YF - p.y;
    vec2 pm = vec2(p.x, 2.0 * YF - p.y);
    vec4 fm = formAt(pm);
    float b = 0.002 + dz * 0.12;
    col = mix(col, glass(fm, pm, t), smoothstep(b, -b, fm.r) * exp(-dz / 0.05) * 0.4);
  }
  col = glassRing(col, p, t, false);
  vec4 f = formAt(p);
  col = mix(col, col * 0.92 + uPal[3] * 0.05, falloff(f.r, 0.05));
  col = mix(col, glass(f, p, t), cover(f.r));
  col = glassRing(col, p, t, true);
  return col;
}`;

// Scorecard: a Swiss composition, a quartered disc over diagonal fields; alive, the quarters turn a step.
MOTIFS.scorecard = /* glsl */`
vec3 motif(vec2 p, float t) {
  vec2 C = vec2(0.487, 0.49); float R = 0.213;
  // quadrant fields
  float vx = p.x - C.x, hy = p.y - C.y;
  vec3 tl = uPal[0];
  tl = mix(tl, uPal[1], cover(sdTri(p, ic(0.0, 0.27), ic(0.27, 0.51), ic(0.0, 0.51))));
  vec3 tr = mix(uPal[1], uPal[2], 0.35 * smoothstep(0.4, 1.0, p.y));
  vec3 bl = mix(uPal[3], uPal[3] * 1.05, smoothstep(0.0, 0.5, p.y));
  bl = mix(bl, uPal[4], cover(sdTri(p, ic(0.0, 0.64), ic(0.46, 1.0), ic(0.0, 1.0))));
  vec3 br = mix(uPal[5], uPal[5] * 0.93, smoothstep(0.5, 0.0, p.y));
  br = mix(br, uPal[0], cover(sdTri(p, ic(1.0, 0.66), ic(0.62, 1.0), ic(1.0, 1.0))));
  vec3 top = mix(tl, tr, cover(-vx));
  vec3 bottom = mix(bl, br, cover(-vx));
  vec3 col = mix(bottom, top, cover(-hy));
  // the quartered disc
  float T = t * 0.25;
  float a = -0.5 * PI * (floor(T) + ease(sat((fract(T) - 0.62) / 0.38)));
  vec2 q = rot(a) * (p - C);
  vec3 qtl = mix(uPal[6], uPal[7], smoothstep(-0.05, 0.2, q.y));
  vec3 qtr = mix(uPal[2], toLin(vec3(0.36, 0.68, 0.95)), cover(q.y - q.x));
  vec3 qbr = toLin(vec3(0.10, 0.28, 0.74));
  vec3 qbl = mix(toLin(vec3(0.95, 0.93, 0.90)), uPal[5], cover(-(-q.y + q.x)));
  vec3 qt = mix(qtl, qtr, cover(-q.x));
  vec3 qb = mix(qbl, qbr, cover(-q.x));
  vec3 disc = mix(qb, qt, cover(-q.y));
  disc *= 1.0 - 0.06 * smoothstep(0.0, R, length(p - C - vec2(-0.08, 0.08)));
  col = mix(col, disc, cover(length(p - C) - R));
  return col;
}`;

// Xactions: a dense ribbon of flow lines and particles sweeping across in an S, every colour of the spectrum.
MOTIFS.xactions = /* glsl */`
float cX(float x) { return 0.385 - 0.045 * sin(x * 3.4) + 0.27 * smoothstep(0.5, 0.74, x) - 0.05 * smoothstep(0.74, 1.05, x); }
float wX(float x) { return mix(0.41, 0.058, smoothstep(0.0, 0.54, x)) + 0.5 * smoothstep(0.58, 1.12, x); }
vec3 spectrum(float s) {
  s = sat(s) * 5.0;
  vec3 c0 = vec3(0.13, 0.83, 0.95), c1 = vec3(0.18, 0.38, 1.0), c2 = vec3(0.56, 0.22, 1.0);
  vec3 c3 = vec3(1.0, 0.22, 0.72), c4 = vec3(1.0, 0.45, 0.08), c5 = vec3(1.0, 0.82, 0.13);
  vec3 c = s < 1.0 ? mix(c0, c1, s) : s < 2.0 ? mix(c1, c2, s - 1.0) : s < 3.0 ? mix(c2, c3, s - 2.0) : s < 4.0 ? mix(c3, c4, s - 3.0) : mix(c4, c5, s - 4.0);
  return toLin(c);
}
vec3 motif(vec2 p, float t) {
  vec3 col = mix(uPal[0], uPal[1], smoothstep(0.0, 1.0, 1.0 - p.y) * 0.6);
  const float N = 30.0;
  float e = 0.002;
  float c = cX(p.x), w = wX(p.x);
  float cd = (cX(p.x + e) - cX(p.x - e)) / (2.0 * e), wd = (wX(p.x + e) - wX(p.x - e)) / (2.0 * e);
  float psi = (p.y - c) / w;
  float k = floor(psi * N + 0.5);
  float pk = k / N;
  float slope = cd + pk * wd;
  float sl = sqrt(1.0 + slope * slope);
  float perp = (psi - pk) * w / sl;
  float spacing = w / (N * sl);
  float env = smoothstep(1.16, 0.95, abs(psi)) * smoothstep(1.16, 0.95, abs(pk));
  float hue = mix(0.46 - 0.5 * pk, 0.62 + 0.4 * pk, smoothstep(0.36, 0.72, p.x)) + 0.06 * (h11(k * 3.7) - 0.5);
  vec3 lc = spectrum(hue);
  // particles strung along each line
  float along = p.x + max(c - cX(0.45), 0.0);
  float alongScale = sl / (1.0 + max(cd, 0.0));
  float sp = 0.0085 + 0.0075 * h11(k * 1.7 + 0.3);
  float u = (along - t * (0.010 + 0.012 * h11(k * 2.9))) / sp + h11(k * 5.3);
  float n = floor(u);
  float da = (u - n - 0.5) * sp * alongScale;
  float r = min((0.0016 + 0.0024 * h11(k * 4.1 + 0.7)) * (0.8 + 0.4 * h12(vec2(k, n) * 0.37 + 1.3)), 0.32 * spacing + 0.0006);
  float dotA = cover(length(vec2(da, perp)) - r) * (0.85 + 0.3 * h12(vec2(n, k) + 7.1));
  float lineA = ring(perp, 0.0005) * 0.55;
  float resolve = smoothstep(1.4 * PX, 4.0 * PX, spacing);
  float lit = mix(0.55, max(dotA, lineA), resolve);
  float core = exp(-psi * psi * 5.0);
  col += lc * lit * env * (1.35 + 0.6 * core);
  // the glow of the neck, where the lines crowd together
  col += mix(lc, vec3(1.0), 0.35) * 0.28 * env * core * smoothstep(0.012, 0.003, spacing);
  col += spectrum(hue) * 0.10 * exp(-psi * psi * 3.0) * smoothstep(0.15, 0.5, p.x) * smoothstep(1.0, 0.6, p.x);
  // loose sparks, a few of them large
  vec2 g = p / 0.075; vec2 id = floor(g);
  float hh = h12(id + 3.0);
  if (hh < 0.13 && p.y < 0.82) {
    vec2 sp2 = (id + 0.2 + 0.6 * h22(id + 9.0)) * 0.075;
    float rr = 0.005 + 0.010 * h12(id + 1.7);
    float pick = h12(id + 5.5);
    vec3 sc = pick < 0.45 ? toLin(vec3(1.0, 0.82, 0.16)) : pick < 0.75 ? toLin(vec3(1.0, 0.36, 0.75)) : toLin(vec3(0.3, 0.8, 1.0));
    col = mix(col, sc, cover(length(p - sp2 - vec2(0.0, 0.0)) - rr));
    col += sc * 0.25 * falloff(length(p - sp2) - rr, 0.012);
  }
  return col;
}`;

// Stellar Explorer: an emblem of orbits, planets and a centre star over a perspective grid with a cursor.
MOTIFS.stellar = /* glsl */`
float stars(vec2 p, float cell, float dens, float t) {
  vec2 g = p / cell; vec2 id = floor(g); vec2 f = fract(g);
  float h = h12(id);
  if (h < dens) return 0.0;
  vec2 sp = 0.2 + 0.6 * h22(id + 3.1);
  float b = (h - dens) / (1.0 - dens);
  float r = cell * (0.04 + 0.07 * b);
  float d = length(f - sp) * cell;
  float tw = 0.8 + 0.2 * sin(t * (0.6 + 1.6 * h) + h * 40.0);
  return (cover(d - r) * (0.5 + 0.5 * b) + 0.25 * b * falloff(d - r, 0.2 * cell)) * tw;
}
vec3 planet(vec3 col, vec2 p, vec2 P, float r, vec3 c0, vec3 c1, vec2 light) {
  vec2 q = (p - P) / r;
  float sh = 0.5 + 0.5 * dot(normalize(light), q);
  float z = sqrt(sat(1.0 - dot(q, q)));
  vec3 lit = mix(c1, c0, sat(sh * 1.2 - 0.1)) * (0.45 + 0.65 * sat(sh + 0.2 * z));
  lit += c0 * 0.35 * pow(1.0 - z, 3.0) * sh;
  col += c0 * 0.18 * falloff(length(p - P) - r, r * 0.9);
  return mix(col, lit, cover(length(p - P) - r));
}
vec2 orbitPos(vec2 S, vec2 P0, float w, float t) {
  vec2 d = P0 - S; float k = 0.32;
  float a = length(vec2(d.x, d.y / k)), th = atan(d.y / k, d.x) + w * t;
  return S + vec2(a * cos(th), a * k * sin(th));
}
vec3 galaxy(vec3 col, vec2 p, vec2 G, float R, float ang, vec3 tint) {
  vec2 q = rot(ang) * (p - G); q.y /= 0.45;
  float r = length(q) / R, th = atan(q.y, q.x);
  float arms = pow(0.5 + 0.5 * cos(2.0 * (th - 2.6 * log(r + 0.05))), 3.0);
  float m = exp(-r * 2.6) * (0.35 + 0.65 * arms) * smoothstep(1.4, 0.6, r);
  col += tint * m * 1.6 + vec3(1.0, 0.92, 0.95) * 1.1 * exp(-r * 10.0);
  return col;
}
vec3 motif(vec2 p, float t) {
  vec3 col = uPal[0];
  vec2 E = ic(0.5, 0.695); float ER = 0.43;
  float de = length(p - E) - ER;
  vec2 S = ic(0.5, 0.485);
  if (de < 0.01) {
    // deep space inside the emblem
    vec3 sp = mix(uPal[2], uPal[1], smoothstep(0.0, 0.3, length((p - S) * vec2(0.8, 1.1))));
    sp = mix(sp, uPal[0] * 1.2, smoothstep(0.2, 0.43, length(p - E)));
    sp += uPal[3] * 0.25 * exp(-pow(length(p - ic(0.22, 0.66)) / 0.12, 2.0));
    sp += uPal[3] * 0.18 * exp(-pow(length(p - ic(0.78, 0.6)) / 0.14, 2.0));
    sp += vec3(0.85, 0.9, 1.0) * (stars(p, 0.024, 0.86, t) * 0.8 + stars(p + 0.31, 0.055, 0.8, t));
    // concentric orbits around the star, and the vertical axis
    for (int i = 0; i < 4; i++) {
      float a = 0.095 + 0.09 * float(i);
      float d = sdEllipse(p - S, vec2(a, a * 0.31));
      sp = mix(sp, uPal[4], ring(d, 0.0009) * 0.55);
    }
    sp = mix(sp, uPal[4], ring(sdEllipse(p - S, vec2(0.25, 0.25)), 0.0007) * 0.25);
    sp = mix(sp, uPal[4], ring(p.x - 0.5, 0.0008) * 0.6 * step(S.y, p.y));
    sp = galaxy(sp, p, ic(0.255, 0.335), 0.06, 0.5, uPal[5]);
    sp = galaxy(sp, p, ic(0.79, 0.62), 0.085, -0.45, uPal[5]);
    // the grid: a pyramid of light falling from the star
    vec2 bl = ic(0.235, 0.925), br = ic(0.765, 0.925);
    float tri = sdTri(p, S, bl, br);
    float depth = sat((S.y - p.y) / (S.y - bl.y));
    vec3 grid = mix(uPal[6], uPal[7], depth * depth) + toLin(vec3(0.35, 0.8, 1.0)) * 0.35 * pow(depth, 4.0);
    float hl = 0.0;
    for (int i = 1; i < 6; i++) { float yy = mix(S.y, bl.y, pow(float(i) / 5.0, 1.6)); hl = max(hl, ring(p.y - yy, 0.0009)); }
    float u = (p.x - S.x) / max(S.y - p.y, 1e-3) * (S.y - bl.y) / (br.x - S.x);
    float vk = floor(u * 4.0 + 0.5) / 4.0;
    float vl = ring((u - vk) * (br.x - S.x) * (S.y - p.y) / (S.y - bl.y) * 0.97, 0.0009);
    grid += vec3(0.6, 0.75, 1.0) * 0.35 * max(hl, vl) * depth;
    sp = mix(sp, grid, cover(tri) * (0.55 + 0.4 * depth));
    sp += uPal[7] * 0.25 * ring(tri, 0.0012) + toLin(vec3(0.5, 0.85, 1.0)) * 0.5 * ring(p.y - bl.y, 0.0016) * cover(tri - 0.002);
    // planets
    sp = planet(sp, p, orbitPos(S, ic(0.37, 0.355), 0.06, t), 0.022, toLin(vec3(1.0, 0.62, 0.3)), toLin(vec3(0.75, 0.25, 0.2)), S - p);
    sp = planet(sp, p, orbitPos(S, ic(0.165, 0.50), 0.03, t), 0.013, toLin(vec3(1.0, 0.96, 0.9)), toLin(vec3(0.75, 0.7, 0.7)), S - p);
    sp = planet(sp, p, orbitPos(S, ic(0.275, 0.545), 0.05, t), 0.011, toLin(vec3(0.55, 0.72, 1.0)), toLin(vec3(0.3, 0.35, 0.8)), S - p);
    sp = planet(sp, p, orbitPos(S, ic(0.325, 0.605), 0.05, t), 0.012, toLin(vec3(1.0, 0.5, 0.25)), toLin(vec3(0.7, 0.2, 0.15)), S - p);
    sp = planet(sp, p, orbitPos(S, ic(0.705, 0.545), 0.045, t), 0.019, toLin(vec3(1.0, 0.62, 0.25)), toLin(vec3(0.85, 0.3, 0.15)), S - p);
    sp = planet(sp, p, orbitPos(S, ic(0.845, 0.555), 0.03, t), 0.012, toLin(vec3(1.0, 0.96, 0.88)), toLin(vec3(0.8, 0.75, 0.7)), S - p);
    vec2 PB = orbitPos(S, ic(0.215, 0.69), 0.02, t);
    sp = planet(sp, p, PB, 0.063, toLin(vec3(0.95, 0.55, 0.55)), toLin(vec3(0.45, 0.28, 0.85)), vec2(0.6, 0.5));
    // a ringed planet
    vec2 PS = orbitPos(S, ic(0.735, 0.425), 0.035, t);
    vec2 so = rot(0.32) * (p - PS);
    float rd = sdEllipse(so, vec2(0.058, 0.014));
    vec3 ringC = toLin(vec3(0.78, 0.74, 0.98));
    sp = mix(sp, ringC, ring(rd, 0.0022) * step(0.0, so.y) * 0.9);
    sp = planet(sp, p, PS, 0.026, toLin(vec3(1.0, 0.78, 0.55)), toLin(vec3(0.7, 0.4, 0.5)), vec2(0.5, 0.5));
    sp = mix(sp, ringC, ring(rd, 0.0022) * step(so.y, 0.0) * 0.9);
    sp += toLin(vec3(1.0, 0.45, 0.75)) * cover(length(p - ic(0.29, 0.665)) - 0.005);
    sp += toLin(vec3(1.0, 0.5, 0.8)) * cover(length(p - ic(0.625, 0.385)) - 0.0045);
    // the centre star
    vec2 q = p - S; float dq = length(q);
    sp += vec3(1.0, 0.85, 0.6) * 0.45 * exp(-dq / 0.045) + vec3(1.0) * 1.2 * exp(-dq / 0.008);
    sp += vec3(1.0, 0.9, 0.75) * 0.55 * (exp(-abs(q.y) / 0.0016) * exp(-abs(q.x) / 0.05) + exp(-abs(q.x) / 0.0016) * exp(-abs(q.y) / 0.05));
    // the cursor, flying up the grid on a violet trail
    vec2 A = ic(0.5, 0.835);
    vec2 tip = A + vec2(0.0, 0.055), lw = A + vec2(-0.05, -0.05), nt = A + vec2(0.0, -0.028), rw = A + vec2(0.05, -0.05);
    float trail = max(abs(p.x - 0.5) - 0.012 * sat((nt.y - p.y) / 0.16 + 0.4), p.y - nt.y);
    sp = mix(sp, toLin(vec3(0.85, 0.4, 1.0)), cover(trail) * smoothstep(0.0, 0.17, p.y - 0.0) * 0.9);
    float arrowL = sdTri(p, lw, tip, nt);
    float arrowR = sdTri(p, tip, rw, nt);
    sp = mix(sp, vec3(0.96, 0.95, 0.98), cover(arrowL));
    sp = mix(sp, toLin(vec3(0.82, 0.82, 0.9)), cover(arrowR));
    col = mix(col, sp, cover(de));
  }
  // the gold rim
  col = mix(col, toLin(vec3(0.86, 0.66, 0.36)), ring(de, 0.0022));
  return col;
}`;

// About Neil: one gold sphere resting on cream paper, a soft contact shadow, the light moving across it when alive.
MOTIFS.about = /* glsl */`
vec3 motif(vec2 p, float t) {
  vec2 C = ic(0.481, 0.555); float R = 0.246;
  float v = length((p - vec2(0.48, 0.5)) * vec2(1.0, 0.9));
  vec3 col = mix(uPal[0], uPal[1], smoothstep(0.1, 0.85, v));
  // contact shadow, cast a little to the left
  vec2 sq = (p - vec2(C.x - 0.035, C.y - R + 0.004)) / vec2(0.27, 0.04);
  col *= 1.0 - 0.34 * exp(-dot(sq, sq) * 1.4);
  vec2 sc = (p - vec2(C.x - 0.005, C.y - R + 0.002)) / vec2(0.1, 0.012);
  col *= 1.0 - 0.45 * exp(-dot(sc, sc));
  // the sphere
  vec2 q = (p - C) / R;
  float rr = dot(q, q);
  if (rr < 1.08) {
    vec3 n = vec3(q, sqrt(sat(1.0 - rr)));
    float la = 0.55 + 0.35 * sin(t * 0.4);
    vec3 L = normalize(vec3(-cos(la) * 0.45, 0.7, 0.6 + 0.1 * sin(la)));
    float dif = sat(dot(n, L));
    vec3 g = mix(uPal[3], uPal[2], pow(dif, 0.9));
    g += uPal[4] * 0.32 * pow(sat(dot(reflect(-L, n), vec3(0.0, 0.0, 1.0))), 5.0);
    // bounce from the paper on the underside
    g += uPal[1] * 0.12 * sat(-n.y) * (1.0 - n.z);
    g *= 1.0 + (h12(floor(p * 900.0)) - 0.5) * 0.05;
    col = mix(col, g, cover((sqrt(rr) - 1.0) * R));
  }
  return col;
}
vec3 goldInk(vec2 p) {
  float k = smoothstep(0.98, 0.72, p.y) + 0.25 * (fbm(p * 18.0) - 0.5);
  vec3 c = mix(uInk0, uInk1, sat(k));
  c *= 1.0 + (h12(FC * 1.3 + 2.0) - 0.5) * 0.16;
  return c;
}
#define INK0(p, t) goldInk(p)`;

// ---------- designs ----------
// Layout is in 1024-unit space with y down (canvas space).
// pal: up to eight sRGB colours the motif indexes as uPal[i].
// type: title blocks; each line goes to channel ch of the type mask (R, G, B -> INK0..2).
//   size by cap (cap height), fit (widest line's ink width) or px; x/base place the first line.
// inks: sRGB colour per type channel, used when the motif does not fill it itself.
// mark: where the logo is drawn unaltered, [x, top, size].
// form: the logo inflated into the motif's hero form: box [x, top, size], R bevel radius,
//   soft blur (both cover units), key 'alpha' | 'tile' (tile: drop pixels near the tile colour).
// back: paper, ink (name, values), soft (labels, stack), accent (rules, link).
// bandY: centre of the front strip shown across the top of the back.
// t0: the moment the still cover shows; alive time runs on from it.

function designFor(entry) {
  switch (entry.name) {
    case 'Mirra': return {
      motif: 'mirra', t0: 0,
      pal: ['#2E78CC', '#6AAAE6', '#B3D6F4', '#E3F1FD', '#C9DFF5', '#8CC0EE'],
      type: [{ lines: ['Mirra'], font: 'NJ Text', weight: 900, track: -0.035, cap: 198, x: 56, base: 247, ch: 0 }],
      inks: ['#FFFFFF'],
      mark: [858, 864, 116],
      form: { box: [125, 180, 730], R: 0.019, soft: 0.003, key: 'tile', ink: [255, 255, 255] },
      bandY: 0.46, grain: [0.012, 0.010],
      back: { paper: '#EEF6FD', ink: '#123E78', soft: '#4F6E92', accent: '#2C7AC2' },
    };
    case 'stet': return {
      motif: 'stet', t0: 2,
      pal: ['#0B2628', '#06171A', '#3E9EA0', '#F1E8D6', '#E8873C', '#E9B85E'],
      type: [{ lines: ['stet'], font: 'NJ Condensed', weight: 800, track: -0.03, fit: 1040, x: 12, base: 752, ch: 0 }],
      inks: ['#F1E8D6'],
      mark: [30, 26, 142],
      bandY: 0.48, grain: [0.05, 0.02],
      back: { paper: '#0D2A2C', ink: '#F3EBDB', soft: '#9BBDBB', accent: '#E9B85E' },
    };
    case 'Social Hook': return {
      motif: 'hook', t0: 0,
      pal: ['#2A63E6', '#2E6AE9', '#4482F1', '#6AA2F6', '#1C50D7', '#5C96F3'],
      type: [{ lines: ['Social', 'Hook'], font: 'NJ Poppins', weight: 800, track: -0.02, fit: 806, x: 92, base: 278, lead: 224, ch: 0 }],
      inks: ['#FFFFFF'],
      mark: [62, 865, 108],
      bandY: 0.36, grain: [0.012, 0.010],
      back: { paper: '#2563EB', ink: '#FFFFFF', soft: '#CFE0FF', accent: '#FFFFFF' },
    };
    case 'Clauded': return {
      motif: 'clauded', t0: 0,
      pal: ['#073B3E', '#0E5C5E', '#0D6566', '#5FE3D6', '#B8FFF6', '#FFFFFF'],
      type: [{ lines: ['Clauded'], font: 'NJ Soft Serif', weight: 900, track: -0.01, fit: 930, x: 512, align: 'center', base: 214, ch: 0 }],
      inks: ['#74F2E4', '#41D3C6'],
      mark: [30, 862, 140],
      form: { box: [44, 114, 934], R: 0.010, soft: 0.002, key: 'tile', lo: 22, hi: 60, res: 640, albedo: true },
      bandY: 0.44, grain: [0.014, 0.012],
      back: { paper: '#0A3B3E', ink: '#E6FFFB', soft: '#8FCFC8', accent: '#5FE3D6' },
    };
    case 'LikeWiki': return {
      motif: 'likewiki', t0: 0,
      pal: ['#EFEBE2', '#1E4A38', '#94C0A8', '#7DB096', '#2D6650', '#F6F3EE', '#336F56'],
      type: [
        { lines: ['Like'], font: 'NJ Text', weight: 800, track: -0.02, cap: 302, x: 50, base: 482, ch: 0 },
        { lines: ['Wiki'], font: 'NJ Text', weight: 800, track: -0.02, cap: 302, x: 50, base: 852, ch: 1 },
      ],
      inks: ['#1E4A38', '#F3EFE6'],
      mark: [852, 38, 120],
      bandY: 0.5, grain: [0.03, 0.016],
      back: { paper: '#F2EEE6', ink: '#1E4A38', soft: '#5E7A6C', accent: '#2F5D50' },
    };
    case 'Topshine': return {
      motif: 'topshine', t0: 0,
      pal: ['#F6F2FF', '#D8CDF6', '#C7B8FA', '#6046F4', '#A08CFF', '#F7C9F2', '#DDF0FF', '#3426C8'],
      type: [{ lines: ['topshine'], font: 'NJ Hanken', weight: 650, track: -0.055, fit: 478, x: 52, base: 905, ch: 0 }],
      inks: ['#0F1030'],
      mark: [58, 56, 110],
      form: { box: [146, 76, 738], R: 0.1, soft: 0.005, key: 'alpha' },
      // the mark's two dots, in its 20-unit viewBox: shaded as clear orbs
      orbs: [[16.2, 3.8, 1.55], [4.2, 16.1, 1.45]],
      bandY: 0.55, grain: [0.010, 0.008],
      back: { paper: '#F5F2FF', ink: '#0F1030', soft: '#5E5A86', accent: '#6C44F0' },
    };
    case 'Scorecard': return {
      motif: 'scorecard', t0: 0,
      pal: ['#0F1B3D', '#1F5DD8', '#2A6BE3', '#14916F', '#0E7458', '#F6C21C', '#F24A1D', '#F7872E'],
      type: [{ lines: ['Scorecard'], font: 'NJ Text', weight: 800, track: -0.03, fit: 894, x: 60, base: 206, ch: 0 }],
      inks: ['#FFFFFF'],
      bandY: 0.5, grain: [0.02, 0.012],
      back: { paper: '#0F1B3D', ink: '#FFFFFF', soft: '#A9B8DA', accent: '#F6C21C' },
    };
    case 'Xactions': return {
      motif: 'xactions', t0: 0,
      pal: ['#060A22', '#0B1234'],
      type: [{ lines: ['Xactions'], font: 'NJ Text', weight: 900, track: -0.035, fit: 940, x: 36, base: 198, ch: 0 }],
      inks: ['#FFFFFF'],
      bandY: 0.5, grain: [0.012, 0.010],
      back: { paper: '#080C26', ink: '#FFFFFF', soft: '#A6ADD6', accent: '#FF8A2A' },
    };
    case 'Stellar Explorer': return {
      motif: 'stellar', t0: 0,
      pal: ['#0B0E1C', '#0D1440', '#1E2C8C', '#5B2E9E', '#5E6FC0', '#E2A6F0', '#1F44D8', '#5A8CF5'],
      type: [{ lines: ['Stellar', 'Explorer'], font: 'NJ Serif', weight: 700, track: -0.01, fit: 596, x: 512, align: 'center', base: 137, lead: 104, ch: 0 }],
      inks: ['#FFF8EE'],
      bandY: 0.42, grain: [0.012, 0.010],
      back: { paper: '#0B0E1C', ink: '#FFF8EE', soft: '#A3A9CC', accent: '#DBA95C' },
    };
    case 'About Neil': return {
      motif: 'about', t0: 0,
      pal: ['#F2E7D3', '#E8D8BC', '#E4A23C', '#8E5214', '#FFE7A8'],
      type: [{ lines: ['Neil'], font: 'NJ Text', weight: 900, track: -0.04, fit: 506, x: 60, base: 254, ch: 0 }],
      inks: ['#D2A64E', '#A8771F'],
      bandY: 0.45, grain: [0.03, 0.014],
      back: { paper: '#F4EADA', ink: '#4A3212', soft: '#86704E', accent: '#B8862C' },
    };
  }
  // an entry without its own design takes the flow-line cover with its name as the title
  const d = designFor({ name: 'Xactions' });
  return { ...d, type: [{ ...d.type[0], lines: [entry.name] }] };
}

// ---------- type ----------
// The front's type and the back's text go to channels of an opaque black canvas: R, G, B -> uInk0..2.

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
// a transparent canvas for colour art (the brand marks, the form source)
const artCanvases = new Map();
function artCtx(size, key = 'over') {
  const k = `${key}:${size}`;
  let ctx = artCanvases.get(k);
  if (!ctx) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    ctx = c.getContext('2d', { willReadFrequently: key !== 'over' });
    artCanvases.set(k, ctx);
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, size, size);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
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

// One title block, set to its cap height or fitted to its width, aligned by ink.
function drawType(ctx, b, S) {
  setFont(ctx, b.weight, 100, b.font, b.track);
  let px;
  if (b.px) px = b.px;
  else if (b.cap) px = 100 * b.cap / ctx.measureText('H').actualBoundingBoxAscent;
  else px = 100 * b.fit / Math.max(...b.lines.map(l => inkBox(ctx, l).width));
  setFont(ctx, b.weight, px * S, b.font, b.track);
  ctx.fillStyle = CH[b.ch];
  b.lines.forEach((line, i) => {
    const box = inkBox(ctx, line);
    const y = (b.base + i * (b.lead || 0)) * S;
    const x = b.align === 'center' ? b.x * S - box.width / 2 + box.left : b.x * S + box.left;
    ctx.fillText(line, x, y);
  });
}
function drawFront(ctx, d) {
  const S = ctx.canvas.width / 1024;
  for (const b of d.type) drawType(ctx, b, S);
}

// Back: name and year, the figures as a ruled list, then stack, link and edition mark.
function drawBack(ctx, entry) {
  const W = ctx.canvas.width, S = W / 512, M = 30 * S;
  const top = 0.3 * W;
  const rule = (y) => { ctx.fillStyle = CH[2]; ctx.fillRect(M, Math.round(y), W - 2 * M, Math.max(1, Math.round(S))); };
  if (entry.kind === 'about') {
    ctx.fillStyle = CH[0];
    setFont(ctx, 700, 44 * S, 'NJ Serif', -0.015);
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

// ---------- logos ----------
// entry.logo is {svg: "<svg…>"} (a standalone SVG, colours inline), {png: "/root/relative.png"} or null.
// An SVG is rasterised by the browser at exactly the pixel size it is drawn, so it stays crisp at any size.

const logoImages = new Map();
function logoImage(logo, px) {
  const key = logo.svg ? `svg:${px}:${logo.svg}` : `png:${logo.png}`;
  let p = logoImages.get(key);
  if (!p) {
    let url, revoke = false;
    if (logo.svg) {
      const vb = /viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/.exec(logo.svg);
      const [vw, vh] = vb ? [+vb[1], +vb[2]] : [1, 1];
      const w = Math.round(px * vw / Math.max(vw, vh)), h = Math.round(px * vh / Math.max(vw, vh));
      const svg = logo.svg.replace(/<svg\b([^>]*)>/, (m, attrs) =>
        `<svg${attrs.replace(/\s(width|height)\s*=\s*("[^"]*"|'[^']*')/g, '')} width="${w}" height="${h}">`);
      url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
      revoke = true;
    } else url = new URL(logo.png, document.baseURI).href;
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    p = img.decode().then(() => img).finally(() => { if (revoke) URL.revokeObjectURL(url); });
    logoImages.set(key, p);
  }
  return p;
}
const validLogo = logo => logo && (typeof logo.svg === 'string' || typeof logo.png === 'string') ? logo : null;
// draw the image centred in a square box, keeping its aspect
function drawContained(ctx, img, x, y, s) {
  const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
  const k = s / Math.max(iw, ih);
  ctx.drawImage(img, x + (s - iw * k) / 2, y + (s - ih * k) / 2, iw * k, ih * k);
}

// ---------- the form field ----------
// Felzenszwalb–Huttenlocher squared EDT on the anti-aliased mask (TinySDF's method),
// then a dome profile over the inside distance, blurred, differentiated into slopes.
// The field functions are self-contained so they also run, unchanged, in a worker.

function edt1d(grid, offset, stride, length, f, v, z) {
  const INF = 1e20;
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
function boxBlur(src, dst, n, r) {
  const inv = 1 / (2 * r + 1);
  for (let y = 0; y < n; y++) {            // horizontal, src -> dst
    const o = y * n;
    let acc = 0;
    for (let x = -r; x <= r; x++) acc += src[o + Math.min(n - 1, Math.max(0, x))];
    for (let x = 0; x < n; x++) {
      dst[o + x] = acc * inv;
      acc += src[o + Math.min(n - 1, x + r + 1)] - src[o + Math.max(0, x - r)];
    }
  }
  for (let x = 0; x < n; x++) {            // vertical, dst -> src
    let acc = 0;
    for (let y = -r; y <= r; y++) acc += dst[Math.min(n - 1, Math.max(0, y)) * n + x];
    for (let y = 0; y < n; y++) {
      src[y * n + x] = acc * inv;
      acc += dst[Math.min(n - 1, y + r + 1) * n + x] - dst[Math.max(0, y - r) * n + x];
    }
  }
}
// float to IEEE half bits, round to nearest; magnitudes below 2^-14 flush to zero
function toHalfBits(v, f32, u32) {
  f32[0] = v;
  const x = u32[0], s = (x >>> 16) & 0x8000, e = ((x >>> 23) & 0xff) - 112;
  if (e <= 0) return s;
  if (e > 30) return s | 0x7c00;
  return (s | (e << 10)) + (((x & 0x7fffff) + 0x1000) >>> 13);
}
// pixels: RGBA bytes of the mark drawn at [off, off + inner] in a res x res canvas.
// Returns RGBA half floats, rows bottom-up: signed distance (cover units), slope x, slope y, height 0..1.
function formField(px, res, off, inner, P, f) {
  const N = res * res, INF = 1e20;
  const mask = new Float32Array(N);
  if (f.key === 'tile') {
    // the tile colour, sampled just inside its corners
    const tiles = [[0.1, 0.1], [0.9, 0.1], [0.1, 0.9], [0.9, 0.9]].map(([u, v]) => {
      const i = (Math.round(off + u * inner) * res + Math.round(off + v * inner)) * 4;
      return [px[i], px[i + 1], px[i + 2]];
    });
    for (let i = 0; i < N; i++) {
      // the mark sits inside its tile's padding: the tile's rim (its soft edge, any sheen) is never mark
      const u = ((i / res | 0) - off) / inner, v = (i % res - off) / inner;
      if (u < 0.07 || v < 0.07 || u > 0.93 || v > 0.93 || px[i * 4 + 3] < 250) continue;
      const r = px[i * 4], g = px[i * 4 + 1], b = px[i * 4 + 2];
      let k;
      if (f.ink) {
        // one-colour mark on a gradient tile: the tile under this pixel, bilinear from the corner samples,
        // then the pixel unmixed into mark and tile (exact for the mark's anti-aliased edge)
        let num = 0, den = 1e-6;
        for (let c = 0; c < 3; c++) {
          const t = (tiles[0][c] * (1 - v) + tiles[2][c] * v) * (1 - u) + (tiles[1][c] * (1 - v) + tiles[3][c] * v) * u;
          const m = f.ink[c] - t;
          num += ([r, g, b][c] - t) * m; den += m * m;
        }
        k = Math.min(1, Math.max(0, num / den));
      } else {
        let dmin = Infinity;
        for (const t of tiles) dmin = Math.min(dmin, Math.hypot(r - t[0], g - t[1], b - t[2]));
        k = Math.min(1, Math.max(0, (dmin - f.lo) / (f.hi - f.lo)));
        k = k * k * (3 - 2 * k);
      }
      mask[i] = Math.min(1, Math.max(0, (k - 0.1) / 0.8));
    }
  } else for (let i = 0; i < N; i++) mask[i] = px[i * 4 + 3] / 255;
  const outer = new Float64Array(N), innerD = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    const a = mask[i];
    outer[i] = a >= 1 ? 0 : a <= 0 ? INF : Math.max(0, 0.5 - a) ** 2;
    innerD[i] = a >= 1 ? INF : a <= 0 ? 0 : Math.max(0, a - 0.5) ** 2;
  }
  edt(outer, res, res); edt(innerD, res, res);
  const sdf = new Float32Array(N), h = new Float32Array(N), tmp = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const dist = (Math.sqrt(outer[i]) - Math.sqrt(innerD[i])) * P;
    sdf[i] = dist;
    const u = Math.min(1, Math.max(0, -dist) / f.R);
    h[i] = f.R * Math.sqrt(1 - (1 - u) * (1 - u));
  }
  const br = Math.max(1, Math.round(f.soft / P));
  for (let k = 0; k < 3; k++) boxBlur(h, tmp, res, br);
  const out = new Uint16Array(N * 4), f32 = new Float32Array(1), u32 = new Uint32Array(f32.buffer);
  for (let y = 0; y < res; y++) {
    for (let x = 0; x < res; x++) {
      const i = y * res + x;
      const xl = y * res + Math.max(0, x - 1), xr = y * res + Math.min(res - 1, x + 1);
      const yu = Math.max(0, y - 1) * res + x, yd = Math.min(res - 1, y + 1) * res + x;
      const gx = (h[xr] - h[xl]) / (2 * P), gy = (h[yu] - h[yd]) / (2 * P);   // rows run down; slope is y up
      const o = ((res - 1 - y) * res + x) * 4;                                  // rows bottom-up: p.y up
      out[o] = toHalfBits(sdf[i], f32, u32); out[o + 1] = toHalfBits(gx, f32, u32);
      out[o + 2] = toHalfBits(gy, f32, u32); out[o + 3] = toHalfBits(h[i] / f.R, f32, u32);
    }
  }
  return out;
}
// The field runs in a worker so a 768² transform never stalls a frame; the main thread is the fallback.
let workerUrl = null;
function fieldOffThread(px, ...args) {
  try {
    if (!workerUrl) {
      const src = [edt1d, edt, boxBlur, toHalfBits, formField].map(fn => fn.toString()).join('\n') +
        '\nonmessage = e => { const out = formField(...e.data); postMessage(out, [out.buffer]); };';
      workerUrl = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
    }
    const w = new Worker(workerUrl);
    return new Promise(resolve => {
      const done = out => { w.terminate(); resolve(out); };
      w.onmessage = e => done(e.data);
      w.onerror = e => { e.preventDefault(); done(formField(px, ...args)); };
      w.postMessage([px, ...args]);
    });
  } catch { return Promise.resolve(formField(px, ...args)); }
}
const MARGIN = 0.1;   // the field reaches this fraction of the box beyond the mark on each side
// Main thread, one frame: rasterise the mark and upload its colours. The field follows from the worker.
function formSource(img, f) {
  const res = f.res || 512;
  const ctx = artCtx(res, 'form');
  const inner = res / (1 + 2 * MARGIN), off = res * MARGIN / (1 + 2 * MARGIN);
  drawContained(ctx, img, off, off, inner);
  const px = ctx.getImageData(0, 0, res, res).data;
  let col = null;
  if (f.albedo) {
    // the mark's own colours: upload the source canvas before it is reused
    col = new THREE.Texture(ctx.canvas);
    col.colorSpace = THREE.SRGBColorSpace;
    col.generateMipmaps = false;
    col.minFilter = col.magFilter = THREE.LinearFilter;
    col.needsUpdate = true;
  }
  const rectSize = f.box[2] * (1 + 2 * MARGIN) / 1024;     // cover units
  const rx = (f.box[0] - f.box[2] * MARGIN) / 1024, ryTop = (f.box[1] - f.box[2] * MARGIN) / 1024;
  const spec = { key: f.key, ink: f.ink, lo: f.lo, hi: f.hi, R: f.R, soft: f.soft };
  return { px, res, off, inner, P: rectSize / res, spec, col, rect: new THREE.Vector3(rx, 1 - ryTop - rectSize, rectSize) };
}
async function buildForm(src) {
  const out = await fieldOffThread(src.px, src.res, src.off, src.inner, src.P, src.spec);
  const tex = new THREE.DataTexture(out, src.res, src.res, THREE.RGBAFormat, THREE.HalfFloatType);
  tex.minFilter = tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return { tex, col: src.col, rect: src.rect };
}

// ---------- scheduling ----------
// Renders are queued and run one job (a front, a back, or a form field) per frame.

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
const BLANK = new THREE.DataTexture(new Uint8Array(4), 1, 1);   // transparent black
BLANK.needsUpdate = true;
const BLANK_FORM = new THREE.DataTexture(new Uint16Array([0x3c00, 0, 0, 0]), 1, 1, THREE.RGBAFormat, THREE.HalfFloatType);
BLANK_FORM.needsUpdate = true;
let aliveCover = null;   // at most one cover animates at a time

export async function createCover(renderer, entry, index, { size = 1024, backSize = 512, samples = 4, aliveSamples = Math.min(2, samples) } = {}) {
  await loadCoverFonts();
  const d = designFor(entry, index);
  const logo = validLogo(entry.logo);
  const pal = d.pal.map(lin);
  while (pal.length < 8) pal.push(new THREE.Color(0, 0, 0));
  const inks = d.inks.map(srgb);
  while (inks.length < 3) inks.push(inks[inks.length - 1]);
  const uniforms = {
    uRes: { value: new THREE.Vector2(size, size) },
    uGrain: { value: new THREE.Vector2(...(d.grain || [0.02, 0.016])) },
    uTime: { value: d.t0 },
    uSS: { value: samples },
    uMode: { value: 0 },
    uBandY: { value: d.bandY },
    uBandH: { value: 0.3 },
    uText: { value: null },
    uOver: { value: BLANK },
    uForm: { value: BLANK_FORM },
    uFormCol: { value: BLANK },
    uFront: { value: BLANK },
    uFormRect: { value: new THREE.Vector3(0, 0, 0) },
    uRest: { value: BLANK },
    uRestMix: { value: 0 },
    uInk0: { value: inks[0] },
    uInk1: { value: inks[1] },
    uInk2: { value: inks[2] },
    uPaper: { value: lin(d.back.paper) },
    uPal: { value: pal },
    uAux: { value: Array.from({ length: 8 }, () => new THREE.Vector4()) },
  };
  // marked regions of the form, from the mark's own viewBox to cover space
  (d.orbs || []).forEach(([cx, cy, r], i) => {
    const [bx, by, bs] = d.form.box;
    uniforms.uAux.value[i].set((bx + cx / 20 * bs) / 1024, 1 - (by + cy / 20 * bs) / 1024, r / 20 * bs / 1024, 0);
  });
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
  // Compile against the cover's own sRGB target: the program then matches the one the draws use,
  // so it is built once (compile reads the bound target synchronously).
  const prevRT = renderer.getRenderTarget();
  renderer.setRenderTarget(frontRT);
  const compiled = renderer.compileAsync(scene, CAM);
  renderer.setRenderTarget(prevRT);
  // the mark at a front's drawn size, and at the size the form field rasterises it
  const markAt = sz => logo && d.mark ? logoImage(logo, Math.round(d.mark[2] * sz / 1024)) : Promise.resolve(null);
  const [markImg, formImg] = await Promise.all([
    markAt(size),
    logo && d.form ? logoImage(logo, Math.round((d.form.res || 512) / (1 + 2 * MARGIN))) : null,
    compiled,
  ]);

  const upload = (canvas, premultiply) => {
    const tex = new THREE.Texture(canvas);
    tex.colorSpace = THREE.NoColorSpace;
    tex.premultiplyAlpha = premultiply;
    tex.generateMipmaps = false;
    tex.minFilter = tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    renderer.initTexture(tex);   // upload now: the canvas is shared and is redrawn for the next cover
    return tex;
  };
  // the front's type mask and its colour overlay (the brand mark, drawn unaltered)
  const layersAt = (sz, img) => {
    const ctx = textCtx(sz), k = sz / 1024;
    drawFront(ctx, d);
    const text = upload(ctx.canvas, false);
    let over = BLANK;
    if (img) {
      const octx = artCtx(sz);
      drawContained(octx, img, d.mark[0] * k, d.mark[1] * k, d.mark[2] * k);
      over = upload(octx.canvas, true);
    }
    return { text, over, dispose() { text.dispose(); if (over !== BLANK) over.dispose(); } };
  };
  const frontLayers = () => layersAt(size, markImg);
  const draw = (rt, mode, layers, ss) => {
    const prev = renderer.getRenderTarget();
    uniforms.uMode.value = mode;
    uniforms.uRes.value.set(rt.width, rt.height);
    uniforms.uText.value = layers.text;
    uniforms.uOver.value = layers.over || BLANK;
    uniforms.uFront.value = mode ? (layers.strip || frontRT).texture : BLANK;
    uniforms.uSS.value = ss;
    uniforms.uInk0.value = mode ? srgb(d.back.ink) : inks[0];
    uniforms.uInk1.value = mode ? srgb(d.back.soft) : inks[1];
    uniforms.uInk2.value = mode ? srgb(d.back.accent) : inks[2];
    renderer.setRenderTarget(rt);
    renderer.render(scene, CAM);
    renderer.setRenderTarget(prev);
  };
  const ease = u => u * u * (3 - 2 * u);
  // The back's strip is a crop of the finished front. A front smaller than the back (the scene's
  // 16² front beside a 1024 back) is redrawn at the back's size for the strip, then released.
  const stripMark = rt => frontRT.width < (rt?.width || 0) ? markAt(rt.width) : Promise.resolve(null);
  const renderBack = (rt, img) => {
    let strip = null;
    if (frontRT.width < rt.width) {
      strip = target(rt.width);
      const t = uniforms.uTime.value;
      uniforms.uTime.value = d.t0;
      const l = layersAt(rt.width, img);
      draw(strip, 0, l, samples);
      l.dispose();
      uniforms.uTime.value = t;
    }
    const bctx = textCtx(rt.width);
    drawBack(bctx, entry);
    const text = upload(bctx.canvas, false);
    draw(rt, 1, { text, strip }, samples);
    text.dispose();
    if (strip) strip.dispose();
  };

  // alive state: the animated layers, and the resting frame the cover fades back to on release
  let time = d.t0, speed = 0, want = 0, alive = null, restRT = null, restMix = 0, disposed = false, form = null;
  if (formImg) {
    const src = await enqueue(`${entry.name} form`, () => {
      const fs = formSource(formImg, d.form);
      if (fs.col) renderer.initTexture(fs.col);
      return fs;
    });
    form = await buildForm(src);
    uniforms.uForm.value = form.tex;
    uniforms.uFormRect.value.copy(form.rect);
    if (form.col) uniforms.uFormCol.value = form.col;
  }
  const backImg = backRT ? (await Promise.all([loadBackFonts(), stripMark(backRT)]))[1] : null;
  await Promise.all([
    enqueue(`${entry.name} front`, () => {
      const layers = frontLayers();
      draw(frontRT, 0, layers, samples);
      layers.dispose();
    }),
    backRT && enqueue(`${entry.name} back`, () => renderBack(backRT, backImg)),
  ]);

  const stop = () => {
    speed = 0; want = 0; restMix = 0; time = d.t0;
    uniforms.uTime.value = d.t0;
    uniforms.uRestMix.value = 0;
    uniforms.uRest.value = BLANK;
    if (alive) { alive.dispose(); alive = null; }
    if (restRT) { restRT.dispose(); restRT = null; }
    if (aliveCover === cover) aliveCover = null;
  };
  let detailRT = null, detailP = null;
  const cover = {
    front: frontRT.texture,
    back: backRT ? backRT.texture : null,
    // The back at detail size (Details magnifies it), rendered once, on the first request.
    detailBack(detailSize = 1024) {
      if (disposed) return Promise.resolve(null);
      if (!detailP) {
        detailRT = target(detailSize);
        detailRT.texture.name = `${entry.name} back ${detailSize}`;
        detailP = Promise.all([loadBackFonts(), stripMark(detailRT)])
          .then(([, img]) => enqueue(`${entry.name} back ${detailSize}`, () => renderBack(detailRT, img)))
          .then(() => detailRT.texture);
      }
      return detailP;
    },
    setAlive(on) {
      if (disposed) return;
      want = on ? 1 : 0;
      if (!on) return;
      if (aliveCover && aliveCover !== cover) aliveCover._stop();
      aliveCover = cover;
      if (!alive) alive = frontLayers();
      if (!restRT) {
        restRT = new THREE.WebGLRenderTarget(size, size, { depthBuffer: false, stencilBuffer: false, colorSpace: THREE.SRGBColorSpace });
        const t = uniforms.uTime.value;
        uniforms.uTime.value = d.t0;
        draw(restRT, 0, alive, samples);
        uniforms.uTime.value = t;
      }
    },
    update(dt) {
      if (!alive) return;
      dt = Math.min(Math.max(dt, 0), 0.1);
      speed += (want - speed) * (1 - Math.exp(-dt * 2.5));
      restMix = want ? Math.max(0, restMix - dt * 2.5) : Math.min(1, restMix + dt / 1.2);
      if (want === 0 && restMix >= 1) {
        uniforms.uTime.value = d.t0;
        uniforms.uRestMix.value = 0;
        uniforms.uRest.value = BLANK;
        draw(frontRT, 0, alive, samples);
        stop();
        return;
      }
      time += dt * speed;
      uniforms.uTime.value = time;
      uniforms.uRestMix.value = ease(restMix);
      uniforms.uRest.value = restMix > 0 ? restRT.texture : BLANK;
      draw(frontRT, 0, alive, aliveSamples);
    },
    dispose() {
      disposed = true;
      stop();
      frontRT.dispose(); if (backRT) backRT.dispose(); material.dispose();
      if (detailRT) detailRT.dispose();
      if (form) { form.tex.dispose(); if (form.col) form.col.dispose(); }
    },
    // resident GPU bytes (preview diagnostics): mipmapped RGBA8 targets, half-float form fields
    gpuBytes() {
      const rt = (t, mips) => t ? t.width * t.height * 4 * (mips ? 4 / 3 : 1) : 0;
      let n = rt(frontRT, true) + rt(backRT, true) + rt(detailRT, true) + rt(restRT, false);
      if (form) n += form.tex.image.width ** 2 * 8 + (form.col ? form.col.image.width ** 2 * 4 : 0);
      return n;
    },
    _stop: stop,
  };
  return cover;
}
