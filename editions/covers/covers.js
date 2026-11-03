// Procedural record-sleeve covers for njct.io Editions.
//
// createCover(renderer, entry, index, { size }) renders one entry's front and
// back into mipmapped sRGB render targets. Each cover is a single full-target
// fragment shader: a per-entry motif evaluated with 4-sample rotated-grid
// supersampling and analytic edge coverage, then any brand artwork (a mascot) and
// the type composited 1:1 from a canvas mask, the brand mark composited 1:1 from a
// colour overlay, then print grain and an 8-bit dither. Maths runs in linear light;
// the target stores sRGB. A cover with fine regular structure draws its own mip
// levels, each filtered at that level's sampling rate.
//
// A cover whose art is the brand mark itself (Mirra, Clauded, Topshine) shades
// the real mark: the logo is rasterised, turned into a signed distance field by
// an exact Euclidean distance transform, and inflated into a smooth height field
// whose normals carry the gloss, glass and reflections.

import * as THREE from 'three';

// ---------- fonts ----------

const FONT_DIR = new URL('../../vendor/fonts/', import.meta.url);
// NJ Text is the page's own UI face (one variable file); where the page declares it, the covers use that face.
// The other faces are subset to exactly the glyphs the covers draw (vendor/fonts/SOURCE.txt lists each
// set and how to regenerate it when a title or back-cover string changes).
const FACES = [
  ['NJ Text', 'ui/inter-variable-ui.woff2', '100 900'],
  ['NJ Soft Serif', 'fraunces-144pt-black-soft-cover.woff2', '900'],
  ['NJ Serif', 'fraunces-144pt-bold-cover.woff2', '700'],
  ['NJ Hanken', 'hanken-grotesk-600-cover.woff2', '600'],
  ['NJ Bricolage', 'bricolage-grotesque-96pt-extrabold-title-cover.woff2', '800'],
];
// Faces only the backs use load with the first back.
const BACK_FACES = [
  ['NJ Display', 'bricolage-grotesque-96pt-extrabold-cover.woff2', '800'],
  ['NJ Mono', 'jetbrains-mono-medium-cover.woff2', '500'],
];
const loadFaces = list => Promise.all(list.map(([family, file, weight]) => {
  // A face the page already declares under this family is the page's own download: wait for it, never fetch the file again.
  const own = [...document.fonts].find(f => f.family.replace(/^["']|["']$/g, '') === family);
  if (own) return own.load();
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
uniform float uTime, uSS, uMode, uBandY, uBandH, uStrip;
uniform sampler2D uText, uOver, uForm, uFormCol, uFront;
uniform vec3 uFormRect;
uniform sampler2D uRest, uArt, uKeys;
uniform float uRestMix, uMip;
uniform vec4 uArtRect;
uniform float uArtFade;
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
#ifndef ART_DY
#define ART_DY(t) 0.0
#endif
vec3 shade(vec2 p, float t) {
  if (uMode < 0.5) return motif(p, t);
  // back: a band of the cover's art across the top, paper below. The band is a crop of the finished
  // front (0), the art without its type (1), or the title's own fill laid across the band (2).
  float by = 1.0 - uBandH;
  if (p.y < by - 2.0 * PX) return uPaper;
  vec2 q = vec2(p.x, uBandY + (p.y - (1.0 - 0.5 * uBandH)));
  vec3 m = uStrip < 0.5 ? texture2D(uFront, q).rgb : uStrip < 1.5 ? motif(q, t) : toLin(INK0(q, t));
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
    // the mascot, premultiplied, drawn unaltered; its lift moves in whole pixels so it never resamples
    if (uArtRect.z > 0.0) {
      vec2 au = (uv - uArtRect.xy - vec2(0.0, floor(ART_DY(uTime) * uRes.y + 0.5) / uRes.y)) / uArtRect.zw;
      vec4 a = texture2D(uArt, clamp(au, 0.0, 1.0));
      a *= step(0.0, au.x) * step(0.0, au.y) * step(au.x, 1.0) * step(au.y, 1.0);
      if (uArtFade > 0.0) a *= smoothstep(0.0, uArtFade, au.y);   // a crop edge the type hides fades out
      s = s * (1.0 - a.a) + a.rgb;
    }
    // each ink is evaluated only where its channel covers (a motif's fill can be costly)
    if (m.r > 0.0) s = mix(s, INK0(uv, uTime), m.r);
    if (m.g > 0.0) s = mix(s, INK1(uv, uTime), m.g);
    if (m.b > 0.0) s = mix(s, INK2(uv, uTime), m.b);
    // the brand mark, premultiplied, drawn unaltered
    vec4 o = texture2D(uOver, uv);
    s = s * (1.0 - o.a) + o.rgb;
  } else {
    s = mix(s, uInk0, m.r);
    s = mix(s, uInk1, m.g);
    s = mix(s, uInk2, m.b);
  }
  // print finish: static fibre grain and a faint density drift, then dither to 8 bits. A mip level drawn by
  // the shader takes the grain at the strength a box-filtered level would have.
  float grain = (h12(fc * 1.37 + 17.0) - 0.5) * exp2(-uMip);
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

// stet: the word itself is the artwork, its letters traced from the concept (letters/stet.json), each shaded like a
// folded ribbon: a colour field per face (sRGB keys on a grid over the face, fitted to the concept, blended smoothly
// and stippled where they meet), the faces parted crisply along the concept's folds: the s's spine where it turns
// under, the e's bar, the last t's ascender. The first t fills type channel 0; the s and the joined e and last t
// channel 1, their fields parted along the t's stem.
MOTIFS.stet = /* glsl */`
// the faces' keys come from uKeys: row 0 (x, y, sigma), row 1 (r, g, b), face F at K0[F] .. K0[F + 1]
const int K0[8] = int[8](0, 18, 81, 117, 187, 197, 282, 292);
// each letter's faces (the second where its fold turns it, or -1)
const ivec2 FACES[4] = ivec2[4](ivec2(0, 1), ivec2(2, -1), ivec2(3, 4), ivec2(5, 6));
// the folds, in concept tile pixels (546 across, y down): the s's, a line from its outer edge down through the
// counter; the e's bar from x 328.6; the last t's ascender left of x 476.7, fading out down to y 180 .. 210
const vec2 SF[23] = vec2[23](vec2(26.8, 165.0), vec2(27.0, 190.0), vec2(27.7, 197.0), vec2(29.0, 200.0), vec2(30.7, 203.0), vec2(32.8, 206.0), vec2(35.5, 210.0), vec2(41.0, 216.0), vec2(47.0, 220.0), vec2(50.0, 222.0), vec2(54.0, 224.5), vec2(58.0, 227.0), vec2(62.0, 228.5), vec2(66.0, 230.0), vec2(70.0, 231.0), vec2(73.0, 229.0), vec2(80.0, 224.0), vec2(100.0, 222.0), vec2(120.0, 225.0), vec2(140.0, 237.0), vec2(160.0, 240.0), vec2(180.0, 245.0), vec2(200.0, 250.0));
// the seam, and the depth of its dark line; the s's fold, moved SHIFT tile px onto its turned side
const float SEAM = 455.0 / 546.0, SEAMLINE = 0.25, SHIFT = -0.5;
// grain: the letters' stipple (cell px, strength in light and in mid and dark tones), the ground's mottle (cell px, strength)
const vec3 GL = vec3(1.7, 0.035, 0.13);
const vec2 GG = vec2(4.0, 0.11);
// the speckle: cell px, the noise level under which a spot shows, its softness, its depth
const vec4 SPK = vec4(2.7, 0.19, 0.05, 0.05);
// the concept's crisp edges, read off the blurred type mask (four taps r apart at mip bias b): a dark line just outside
// the letters, where the mask blurred by TAP reads LINE.x (width LINE.y, depth LINE.z), and a light rim just inside,
// where the mask blurred by RIM.xy reads RIM.z (width RIM.w), towards white by RIMW
const vec2 TAP = vec2(0.0015, 1.0);
const vec3 LINE = vec3(0.35, 0.2, 1.0);
const vec4 RIM = vec4(0.0025, 1.0, 0.8, 0.06);
const float RIMW = 0.45;
const vec2 RIMB = vec2(1.5, 1.8);
// a box's soft window, soft over s tile px
float box(vec2 x, vec4 b, float s) { return smoothstep(b.x - s, b.x, x.x) * smoothstep(b.z + s, b.z, x.x) * smoothstep(b.y - s, b.y, x.y) * smoothstep(b.w + s, b.w, x.y); }
float nearType(vec2 c, vec2 rb) {
  vec2 o = vec2(rb.x, 0.0);
  vec4 m = texture2D(uText, c + o.xy, rb.y) + texture2D(uText, c - o.xy, rb.y) + texture2D(uText, c + o.yx, rb.y) + texture2D(uText, c - o.yx, rb.y);
  return sat(0.25 * (m.r + m.g + m.b));
}
vec3 motif(vec2 p, float t) {
  float v = length((p - vec2(0.5, 0.55)) * vec2(1.0, 1.1));
  // the ground's faint mottle, a few pixels across (linear light), and the concept's dark line hugging every letter
  vec3 col = mix(uPal[0], uPal[1], smoothstep(0.25, 0.85, v)) * (1.0 + (vnoise(FC / GG.x + 9.0) - 0.5) * GG.y);
  float g = nearType(p, TAP);
  return col * (1.0 - LINE.z * exp(-pow((g - LINE.x) / LINE.y, 2.0)) * smoothstep(0.0, 0.05, g) * (1.0 - uMode));
}
vec3 face(vec2 q, int F) {
  vec3 c = vec3(0.0); float ws = 0.0;
  for (int i = K0[F]; i < K0[F + 1]; i++) {
    vec4 k = texelFetch(uKeys, ivec2(i, 0), 0);
    vec2 d = q - k.xy;
    float w = exp(-dot(d, d) / (k.z * k.z));
    c += texelFetch(uKeys, ivec2(i, 1), 0).rgb * w; ws += w;
  }
  return c / max(ws, 1e-6);
}
// signed distance to the s's fold (tile px), positive on the side it turns under
float sFold(vec2 x) {
  // above it lies only the s's top arm, below and right of it only the turned side
  if (x.y < 160.0) return -1e3;
  if (x.y > 256.0 || x.x > 206.0) return 1e3;
  float best = 1e9, sg = 1.0;
  for (int i = 0; i < 22; i++) {
    vec2 a = SF[i], e = SF[i + 1] - a, v = x - a;
    float d = length(v - e * clamp(dot(v, e) / dot(e, e), 0.0, 1.0));
    if (d < best) { best = d; sg = e.x * v.y - e.y * v.x < 0.0 ? -1.0 : 1.0; }
  }
  return best * sg;
}
// how far the point lies on the letter's second face, 0 .. 1, blended over a pixel across the fold; d is the signed
// distance to the fold (tile px, positive on the second face) and h how strongly the fold is drawn there
float turned(vec2 p, int L, out float d, out float h) {
  vec2 x = vec2(p.x, 1.0 - p.y) * 546.0;
  // the back's band shows the fields out of their letters: there the s's faces blend softly, the e and the t keep their
  // first faces, and no fold is drawn
  float w = uMode > 0.5 ? 16.0 : 0.5;
  h = 0.0; d = 1e3;
  if (L == 0) { d = sFold(x) + SHIFT; h = 1.0 - uMode; return smoothstep(-0.6 * w, 0.6 * w, d); }
  if (L == 2) { d = x.x - 328.6; h = smoothstep(236.0, 252.0, x.y) * smoothstep(306.0, 290.0, x.y); h *= 1.0 - uMode; return smoothstep(-w, w, d) * h; }
  if (L == 3) { d = 476.7 - x.x; h = smoothstep(210.0, 180.0, x.y); h *= 1.0 - uMode; return smoothstep(-w, w, d) * h; }
  return 0.0;
}
// the concept's folds are drawn crisp: a light line on one side and a dark one on the other (gain at d, gain at d,
// tile px), fading where the fold does
const vec4 CREASE[4] = vec4[4](vec4(0.0, 0.0, 0.0, 0.0), vec4(0.0), vec4(0.03, -1.1, -0.22, 0.9), vec4(0.035, -0.8, -0.08, 1.2));
vec3 stetFill(vec2 p, float t, int L) {
  // the keys drift a little when alive; the stipple jitters where the blend is read
  vec2 q = p + 0.010 * vec2(sin(t * 0.37), cos(t * 0.29) - 1.0) + (h22(FC * 0.731 + 3.0) - 0.5) * 0.016;
  ivec2 F = FACES[L];
  float d = 1e3, h = 0.0;
  float b = F.y < 0 ? 0.0 : turned(p, L, d, h);
  vec3 c = b < 1.0 ? face(q, F.x) : vec3(0.0);
  if (b > 0.0) c = mix(c, face(q, F.y), b);
  vec4 k = CREASE[L];
  c *= 1.0 + h * (k.x * exp(-pow((d - k.y) / 0.6, 2.0)) + k.z * exp(-pow((d - k.w) / 0.6, 2.0)));
  // the rim reads the front's type mask (the back's band has none)
  if (uMode < 0.5) {
    // the rim is strongest on the e's bar and round the s's upper counter (boxes in tile px)
    vec2 x = vec2(p.x, 1.0 - p.y) * 546.0;
    float boost = RIMB.x * box(x, vec4(326.0, 240.0, 458.0, 304.0), 6.0) + RIMB.y * box(x, vec4(58.0, 194.0, 192.0, 270.0), 6.0);
    c = mix(c, vec3(1.0), sat(RIMW * (1.0 + boost)) * exp(-pow((nearType(p, RIM.xy) - RIM.z) / RIM.w, 2.0)));
  }
  // the concept's stipple, stronger in the mid and dark tones, and its dark speckle, sparse spots a few pixels across
  // that show most on the light tones
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  c += (vnoise(FC / GL.x + 5.0) - 0.5) * mix(GL.z, GL.y, smoothstep(0.72, 0.88, lum));
  c *= 1.0 - SPK.w * smoothstep(SPK.y + SPK.z, SPK.y - SPK.z, vnoise(FC / SPK.x + 23.0)) * smoothstep(0.55, 0.85, lum);
  return clamp(c, 0.0, 1.0);
}
// the band across the back: the four letters' fields side by side, blended across their borders
vec3 stripFill(vec2 p, float t) {
  vec3 c = mix(stetFill(p, t, 0), stetFill(p, t, 1), smoothstep(0.25, 0.32, p.x));
  c = mix(c, stetFill(p, t, 2), smoothstep(0.46, 0.53, p.x));
  return mix(c, stetFill(p, t, 3), smoothstep(0.80, 0.87, p.x));
}
// the e and the last t are one outline: their fields part along the t's stem, blended over a pixel
vec3 etFill(vec2 p, float t) {
  float w = 0.7 / uRes.x;
  if (p.x < SEAM - w) return stetFill(p, t, 2);
  // a dark line along the seam, on the t's side, where the e meets it
  float x = p.x * 546.0 - 456.0, y = (1.0 - p.y) * 546.0;
  float dark = 1.0 - SEAMLINE * exp(-x * x / 0.64) * smoothstep(236.0, 244.0, y) * smoothstep(300.0, 292.0, y);
  if (p.x > SEAM + w) return stetFill(p, t, 3) * dark;
  return mix(stetFill(p, t, 2), stetFill(p, t, 3), smoothstep(SEAM - w, SEAM + w, p.x)) * dark;
}
#define INK0(p, t) (uMode > 0.5 ? stripFill(p, t) : stetFill(p, t, 1))
#define INK1(p, t) (p.x < 0.41 ? stetFill(p, t, 0) : etFill(p, t))`;

// Social Hook: a deep royal-blue field; a dark disc under "Hook"; a pale disc rising from the lower left;
// a diagonal through a crossing low in the middle, with light along it and a wedge of light beyond it;
// a deep triangle below the crossing; a disc split light | deep at the lower right, its foot behind the triangle. Each area's colour is a
// low-order polynomial in position, plus the light band near the diagonal, fitted to the concept (linear light).
MOTIFS.hook = /* glsl */`
const vec3 K_G[6] = vec3[](vec3(0.0083, 0.0778, 0.7428), vec3(-0.0020, -0.0003, 0.0050), vec3(0.0033, -0.0133, -0.0825), vec3(0.0036, -0.0075, -0.0780), vec3(-0.0167, -0.0998, -0.2046), vec3(0.0107, 0.0343, -0.0377));
const vec3 K_M[8] = vec3[](vec3(0.0457, 0.2707, 0.9415), vec3(0.1397, 0.4311, 0.2704), vec3(-0.1988, -0.2366, -0.0457), vec3(0.0646, -0.0152, -0.1472), vec3(0.0411, 0.0751, 0.0290), vec3(-0.0797, -0.0962, -0.0118), vec3(-0.1213, -0.2404, -0.0880), vec3(0.3882, 0.6104, 0.0892));
const vec3 K_TR[6] = vec3[](vec3(0.0253, 0.1836, 0.7247), vec3(0.0339, 0.0881, 0.2032), vec3(0.0024, -0.0643, -0.2532), vec3(0.0272, 0.0441, 0.0331), vec3(-0.0072, -0.0294, -0.0625), vec3(-0.0036, 0.0234, 0.0759));
const vec3 K_C3[8] = vec3[](vec3(0.2113, 0.6081, 0.9647), vec3(0.4538, 0.8624, 0.1045), vec3(-0.0925, -0.1751, 0.0481), vec3(0.1979, 0.1699, -0.0895), vec3(-0.0632, -0.0218, 0.0205), vec3(-0.1676, -0.3654, -0.0703), vec3(-0.0409, -0.0632, 0.0016), vec3(0.0435, 0.0589, -0.0056));
const vec3 K_LF[8] = vec3[](vec3(-0.1830, 0.0553, 0.8927), vec3(0.5099, 0.6389, 0.0551), vec3(-0.2173, -0.2208, 0.0700), vec3(0.5060, 0.4484, 0.0665), vec3(-0.4052, -0.2290, -0.0719), vec3(0.8689, 0.7798, -0.0097), vec3(-0.2980, -0.4885, -0.2012), vec3(0.4712, 0.5704, 0.1513));
const vec3 K_C4L[8] = vec3[](vec3(0.1141, 0.4222, 0.9458), vec3(0.2277, 0.3209, 0.0688), vec3(-0.2934, -0.4534, 0.0794), vec3(0.0560, 0.0831, 0.0069), vec3(-0.0268, -0.0636, -0.0407), vec3(0.0197, -0.1109, -0.1080), vec3(-0.0153, -0.0662, -0.0304), vec3(0.1748, 0.2307, 0.0213));
const vec3 K_C4R[6] = vec3[](vec3(0.0061, 0.0706, 0.7333), vec3(0.0061, 0.0325, 0.1113), vec3(0.0001, 0.0070, 0.0293), vec3(0.0064, 0.0201, -0.0231), vec3(0.0041, 0.0104, -0.0473), vec3(0.0013, 0.0012, -0.0208));
const vec3 K_TRI[6] = vec3[](vec3(0.0071, 0.0850, 0.7454), vec3(0.0040, 0.0086, -0.0060), vec3(0.0082, 0.0330, 0.1119), vec3(-0.0009, -0.0032, -0.0276), vec3(0.0012, 0.0023, 0.0029), vec3(0.0057, 0.0120, -0.0429));
#define POLY(K, w) (K[0] + K[1] * w.x + K[2] * w.y + K[3] * w.x * w.x + K[4] * w.x * w.y + K[5] * w.y * w.y)
#define BAND(K, e) (K[6] * e.x + K[7] * e.y)
// distance to the line through o with slope k (y down), positive on its left
float sdLeft(vec2 q, vec2 o, float k) { return -((q.x - o.x) * -k + (q.y - o.y)) / sqrt(k * k + 1.0); }
vec3 motif(vec2 p, float t) {
  vec2 q = vec2(p.x, 1.0 - p.y), w = q - 0.5;   // concept coordinates, y down
  // alive, the discs drift a few pixels and the band of light breathes
  float dr = 0.006 * sin(t * 0.35), br = 1.0 + 0.25 * sin(t * 0.5);
  vec2 X = vec2(0.47626, 0.77821);
  float dL = sdLeft(q, X, -0.98364), dA = sdLeft(q, X, -1.01603);
  float dB = -sdLeft(q, X, 1.05718);   // positive below the triangle's right edge
  float dl = abs(q.y < X.y ? dL : dA);
  vec2 e = br * vec2(exp(-dl / 0.01614), exp(-dl / 0.0561));
  // each area's field is evaluated only where the area shows
  vec3 G = POLY(K_G, w), col = G;
  float m = sat((q.y - 0.54851) / 0.19798 + 0.5);
  if (m > 0.0) col = mix(col, POLY(K_M, w) + BAND(K_M, e), m);
  // the pale corner beyond the dark disc at the top right
  vec2 c1 = vec2(0.65799, 0.33545);
  if (q.x > c1.x && q.y < c1.y) col = mix(col, POLY(K_TR, w), cover(0.35365 - length(q - c1)));
  // the dark disc under "Hook": the top field's own blue
  col = mix(col, G, cover(length(q - vec2(0.59558 + dr, 0.43873)) - 0.16549));
  // the pale disc from the lower left, under the line of the triangle's right edge
  float a = cover(length(q - vec2(0.02461 - dr, 1.04655)) - 0.51214) * cover(-dB);
  if (a > 0.0) col = mix(col, POLY(K_C3, w) + BAND(K_C3, e), a);
  // beyond the diagonal: the light field above the triangle's right edge
  float right = cover(max(dL, dA));
  float b = right * cover(dB);
  if (b > 0.0) col = mix(col, POLY(K_LF, w) + BAND(K_LF, e), b);
  // the split disc, light on the left of the split (its own circle), deep on the right (half-ellipses)
  float xs = 0.77971 - dr * 0.8;
  b = cover(length(q - vec2(0.7876 - dr * 0.8, 0.78558)) - 0.24415) * cover(q.x - xs);
  if (b > 0.0) col = mix(col, POLY(K_C4L, w) + BAND(K_C4L, e), b);
  vec2 o4 = q - vec2(0.80816 - dr * 0.8, 0.75084);
  b = cover(sdEllipse(o4, vec2(o4.x < 0.0 ? 0.26661 : 0.20003, 0.21656))) * cover(xs - q.x);
  if (b > 0.0) col = mix(col, POLY(K_C4R, w), b);
  // the deep triangle below the crossing, over the disc's foot
  b = right * cover(-dB);
  if (b > 0.0) col = mix(col, POLY(K_TRI, w), b);
  return max(col, 0.0);
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

// Topshine's fit to its concept, in concept px (574 to the cover, y down): the star's centre O and tips' reach A
// (right, left), B (up, down); the orbs (x, y, r) and highlights (x, y, half-length, half-width, degrees); the ring's
// outer edge and the haze ring (centre, semi-axes, degrees); the mark as the overlay draws it, for its halo; the ring's
// line offsets and bands, the crease levels and the body's level. Fields:
// cubic B-spline blocks [box (x0, y0, size in cover units), n, g, r - g, b - g offsets, step (chroma times it for
// the two differences)]; data per block: the used-control mask as run lengths (dropped first), then per plane each used
// control's error from its left (else upper, else last) neighbour. alpha[k]: a run k or an error k - 31; '~' a b:
// a * 63 + b, less 1984 for an error.
const TOPSHINE = {
  O: [296.0, 251.0], A: [175.5, 176.0], B: [189.5, 189.5],
  orbs: [[447.38, 128.86, 50.57], [144.3, 379.24, 62.16]],
  specs: [[[420.5, 111.5, 7.5, 1.8, -44.0]], [[103.3, 355.3, 4.1, 2.4, 113.0], [118.4, 355.2, 5.3, 2.1, -31.0]]],
  ring: [273.15, 319.94, 252.39, 42.16, 28.18],
  mark: [61.9, 62.5, 28.26, 29.85, 0.61, 81.6, 42.8, 4.92, 43.5, 81.9, 4.6], halo: 3.0,
  rlines: [1.5, -0.5, -3.0, -6.0], rwidth: 7.0, rwide: 16.0, qlines: [0.53, 0.47, 0.42, 0.37, 0.33], qbody: 0.42,
  haze: [309.71, 247.63, 212.70, 112.25, 9.54], hazew: 4.0, hazeo: [0.0, -9.0],
  boxes: [[0, 0, 1], [0.0348, 0.0348, 0.1481], [0.19, 0.095, 0.67], [0.6781, 0.1232, 0.2026], [0.1269, 0.5362, 0.2491]],
  blocks: [[0, 32, 0.09442, -0.3678, -0.9846, 0.01386], [0, 16, -0.1039, -0.01275, -0.2663, 0.006139], [0, 16, -0.03031, -0.01419, -0.2709, 0.004879], [0, 16, -0.0124, -0.003555, -0.04283, 0.0007861], [0, 16, -0.06221, -0.01746, -0.009538, 0.001022], [0, 16, -0.109, -0.01869, -0.06972, 0.00303], [0, 16, -0.2462, -0.01543, -0.06156, 0.004869], [1, 6, -0.008878, 0.0001574, 1.501e-05, 0.0001355], [0, 12, -0.05007, -0.03158, -0.2082, 0.004091], [0, 12, -0.06287, -0.009587, -0.03577, 0.001628], [2, 40, -1.529, -0.5614, -1.765, 0.04486], [2, 12, -0.3301, -0.03156, -0.1518, 0.008309], [2, 12, -0.1594, -0.02311, -0.2774, 0.008556], [2, 12, -0.2921, -0.08164, -0.3372, 0.01082], [2, 14, -0.3334, -0.0223, -0.2642, 0.01277], [2, 14, -0.0749, -0.001672, -0.05259, 0.00243], [2, 14, -0.05625, -0.008353, -0.05103, 0.002024], [2, 14, -0.07371, -0.0009065, -0.06319, 0.002402], [2, 14, -0.08277, -0.009305, -0.03207, 0.002084], [2, 14, -0.04964, -0.001518, -0.04783, 0.001814], [2, 14, -0.1637, -0.03641, -0.03165, 0.003095], [2, 14, -0.05213, -0.03607, -0.1703, 0.003984], [2, 14, -0.1532, -0.002683, -0.02721, 0.003715], [2, 14, 0.01091, -0.02244, -0.162, 0.002836], [2, 14, -0.04687, -0.01163, -0.06686, 0.002486], [2, 14, -0.06846, -0.002023, -0.04976, 0.002079], [2, 14, -0.05752, -0.03734, -0.009038, 0.001311], [2, 14, -0.0156, -0.01294, -0.06682, 0.001288], [2, 14, -0.1015, -0.007801, -0.01546, 0.001745], [2, 14, -0.07602, -0.001494, -0.002643, 0.001313], [2, 14, -0.006524, -0.01437, -0.05941, 0.001087], [2, 14, -0.006755, -0.00616, -0.01155, 0.0002601], [2, 14, -0.0458, -0.007421, -0.003065, 0.0008761], [2, 14, -0.04809, -0.007799, -0.01403, 0.001028], [2, 14, -0.009638, -0.005444, -0.02619, 0.0005353], [3, 20, -0.9164, -0.1227, -0.2551, 0.02216], [3, 8, -0.07214, -0.003328, -0.05393, 0.003568], [3, 8, -0.1368, -0.01332, -0.01051, 0.003251], [3, 4, 0.3132, -0.03385, -0.5579, 0.002695], [4, 20, -0.2857, -0.06565, -0.2766, 0.01495], [4, 8, -0.03184, -0.0057, -0.1126, 0.004751], [4, 8, -0.01902, -0.00511, -0.05325, 0.001821], [4, 4, 0.3819, 0.002312, -0.6309, 0.003406]],
  chroma: 1.5,
  alpha: '()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_abcdefgh',
  data: 'D(~+d*F*a)G*E+D-B/B-D+F)a*E+F*~-C~H=GFGGFFHGHFEFGGGGFGFHFEFGHGFEDEJFKFGHFGGFFGEFEFFGCGFGDGGEFFEGGEbENEFHGGFFEGEGFFDIEEGEGFEGFFEFFD~H0FNEJDIEGEEFEHEGFHEEFEFEHFEEGEDE~H9HMFHEHEFDGEFEHHIDFDEGFDGFFFECHC~H?IJHGEGGCFDDHIGHK=N?FDGHHEDAHEFD~HEIIGHCIBGBHI@FJKJFDAEFGE:HY@>FGD~HJJGFEGHBEG@?QLHHKCED?BHA;I?GGE~HIFFGEJDFF9QV;?CRGDGBHEEDBHDHHF~HBEHGBMF@E[9+HLSPD4I@>GLa<>O>HFII~H7CKEFO=RL)CVGGFT-6c;I?CK?PFHILIgDMCJHKD,WQ9DCVc~FVCG2VBGF;IWGJKSCOAMRFEJ?5NI=S8@~H5~Fe~FcTISO;@XFT:DPBKX4BCSJ;B4>0~H7~Fd~FXJ>QeB:WP~F^EQ>PLGJ?4@>OJ~FQC,HT>R~H(+^I~FLENBLN?OGMH@<Y1~FgVFCR?VNFd:G~F^HHGFNGKCHEM>AZ.:NEDFFPX)~HM*<DEKBFGHHKNJJCH?AP-Be;?DILG6~H>+BLC^G@GGEGNF7E_JHALF>B=PO8J?G~H/)<a<IgDDFFCHH4=X>JBRW2+HMUALX~FeEY=LE~H/GDFEEGA9ZIGHPK5LHCGL=/SN>PFF~H1JDDFEFM0GSFJHT:=NEHFDfG~FWRVEGI^LCGEDDV?0IZDLNEV1Z>E@>E:~H,Y~FUULGGCKFDCHEHR@FEELDESCC=IDBLN:X9BRNL~FeHFGBGGFGQBED>HIOR2@BELENDdG~Fb]HW~FUHEEGDFKH?C@CCPH~H(7H?D@B7NKODGOIS.GFFDFK>PH~H)~F[ACGF~H*~FXb=FEG~H(O~FX@ELJKQTECJCMI;I@cCJ(GOg~FU_DDMH?4UKD@EJG~H3FHDGECW39UAf(IK~H,~FaB~H6~F[J7LNDCIIGEH~H>FFFGHEW.K?GFGTHCDE~H0~FWHHF?HHFFEKC~HAHEGDJ?U>AIJIEIK7FEGZ=?DIDCGEIEF~H5GFGHHINA<CELMDA=EVNPCEB??DFCCEO]YGGFGHGHFFGHGGFFGGGGGGHGGFGGGGHGGGGGGGGGGGGHEHGGFJEGGGGGGHFHFFHEFGHGGGGGGHFHFGFIEHGGGGGGGHFFHGFFHHFGGGGGGHDIFHGGGFHGGGGGHFFHGGFHFIFFGHGHGEHGHFGGGGHFGGHFGHFGGGFIGIFFHGGGGGGGGGGFJDIFGGGHFEIGGGFIGJDHHEJDGHGHGFFHGGGGHFIIHEDGGGEIFIGGGGFHHFHFFGHHFHGGGFHFEFHGFGHHGGGGGFHGHHFGGGGGGFGHGFFFGGHEHGGGGGHGGGIFHDHHFIHFGCJKDDGFHGGBHFGGGHFGHFGGFHIGGJBJFGEEHGGFGGDFFIFHGGHEGGHIFFGHDDHFHGGEFHFHDFIFGGGHHFGEIHEGDJECFHGGIEEGICFJEHGGHFGHIHFDCLFCGDHHEEKGAGHHFJEGGIFGGGEHEFEFEJIBKAHHHFHGGEHFIHFGIIEFDHICNCHEFGHGGGGFIGFGHHHFIJEFEGFELBIHEGFJFFHHFFHHHGFFIEIKIAGHEGHEJFEFHFJFHGGHGJGDGJEEHIIFGHGCIFGHEEIEHGKFGGGGGFGGIFHJGDGHGFGGFGGFFGGHJEHGGHHGFGGGLEFGFHGFGHFFFGGFHGIFGGIFFGIFGELDIGEGFIFGGGGFGEGIEGHHFIGFFGIFFHHEFIJHDEEJGFHGFGGIGGFGGGHFHFFJFFGHHEGILHCCHFHHFFGHGHEGIFGHFHGIEGJDHJEEFFHGHGGGGEFIHEHIFGGGGGIFGGEHGHGHHIEBFIGHGCHHGGFHFKEDLHFGJCHHDJFKIGE@HFHFHFHHGFGGGHHFGFKEJBGKLEJEDFEHFFFGGIGGHFHFHIEEHGKCMBFKIL>GGGGGFGFHEHGHFHEHHFFIFHDNDCFMHGDJEGGFFGHGFHFHGGHFGGGFGIIJBEIJNEBEGGHFFHEGHIGGGGHGGIHGFFFFHLE;>LOLJEFHGFHHHH~H9IHGFHGDEHJIGFFGGFFJIFFGEEKLJHA7ELIFGGGHGHGHHHHGHIFIGHGGIGHFEID~F^GLHGHFFIHGHHHFHJEGIHGHGHHHFGGFI~FOIJIFFGIFIIEKDJHFGHIGIGHHGFGHDHJ~FNIHHFIFHIHFJGJEFFIGJHFIHFGGHGGEH~FQFIGGIFHIHIJEFGGCOBKIIGGGIEGFFHG~FQFKGDKFJFLFELIDDEJGKHHGIFGCLEHEI~FMELHHGFKGIJM@DGEELEJKJI<@TDGFI~FIIKGHEIHHOA>NMHAHHIHHFK9GSGEFK~FHJHGJDGLG=NYGD?CCIQPJGF3BOJOBGFJ~FHGHHIAN@DZJ>EHH@B>ONELKDI?GFEEI~FHHGKEGCJX<AQHK=/M:WR=IHILAAFFJ~FFHHIF@HHENPBHM4?;Bga=DBCNE?IC~FPIGHG>QLH@FNJG9><h~H(GHB7LN<E~FdHELDFEENOLJ@:dXZI=MA1Z8I/HGIFEKBGEGKN8=^RNI=M=DH6NJ~FeDJIGHFEJCJDMM4@RZLGGEC=[~FZXNN~FKENHFJJBEGEGEMN5AJPWHJEEFR~FfYJDG~FGFOGHHLF@JLBFDLE6ET_>CPEKH.ZO7KI~FGFQGFJIB?9NNDM9>ZXFC>JF<]J9MBK~FCJMGHHJ@JSHFFAERDHIGDLV?BL?GK~F@JHIHGIAAJRLDF>QMBIFIH5Gd>AJFH~FDFIHGHJBEJEERDBH>T<MHKLIO1<dAEEK~FQDJHIGGIBKHFKBJG@GLMFJJCCN<OGDDF~FcDLGIGHHGAKHIMGEB@TKLFCHEG8HY>FA~FgEOGGHHGGLHLHKAH2QGKILJPCDEEBFGC~FYHLHHHFKBG3eKHGH0h6NHGI2CfDBIFDJ~FMJMEIDENHK6JDZJA2~H)9HICGLT=GHBHFH~FMELGHIK=TL?M7YEF/bK)eEPCBHGFEGFI~FMGNFGGH?WALEIHDEIIH.gEDIJFFFGFFI~FRGLFJFLBLHDIFKDDRGIG;NNGCFFHFEHF~FcFEDGFGBFHIIFGHIOK>A=EKNPMEDFGIGA=~)++4.2.2.**/202/12.3-ZRCKL??LOKIFAJKIHJJNIA:GEMTM@;?CFJ=PF>=FKMGB9IBBO[O;7IUbN/4BSJ;<IGGFGHHFGGGHHGFGGGIHFFGGGIHHFGGFFFIHHFGGDEHEHHHHGDDGEIHEDFEHFEG~H)IECLMCBEEHKFDFGDEEFKNHICADKMLJHEMBGKKIFEHIOEHHB<FQPH=8FWSM?FON=~)+*5.2.2.**/202/12.3-ZJFMDBIHILLG@BFGSP@<CAF>OHDKGC?AG;OSNHB>EE>?OPXTG>;44bR:58+PA=@IGGGGHGFGFHHHFGFHHHGFGHGHHHFGHFFGHIGGHFCFGFHGIHFCEHEHHEEFEHFFG~H/HCJJFEFDEHJIGGABJLJLHLBFFFHKMKFMAAEHKLHGKNBC>?EMQQQ7>OVPWAJOL=~)+*5-3.3-**0101102.4,ZUFMGD@DKWM)8PIW+AFKF,NU>>JQF:?RJEKPN;56LMM]<==9Q_-?R*:CQIGGFFJIHFFJKEHFHJHEGGFJLEGIFCIIJFIIF?FDGIKH>DHEKJBCFAGEF~H.GCGIJKE>AWW@E:VOJEGW@AQKEDGLPAFF>CHJSR?7AKMHRWAH]B=XRE>=~),)5-3.3-*)1101102.4,Z~HH?HNEFB8LRMINAKPJMUCG9GPPQIQ=1@SRRGJ[?GB<DeXV9.:~H,dc<WVRHGGFGGHFEGGFGFEGHFGDGFFDHLGEEDFDHOJIEFFGLJFKFEHIHJFHHKLFBHGIOF@AGEOH?D=>OKOB:;AJ<RXI::?KF3MIMME4:;UVI/50L==;~)++4.2.22/3/2/11/3-Zd@KR<:CNTMH?/=WIVM~Ff3HQMIJ=K;99HOIINLE@=EOGELRHJDIOFC@VKLLJF*M]BD6GTKGGGFGJHFGFHJJEGFHIKHDEFFHGHLKEDEEEGGLJFFGCBEICIHJJE>CHDJLH@BFAHEDF[LE?MQIC?CGMVM=F?E]RFACEFMENOQGADFCEHKOI?FIDAGFIF?HKK?ECCEHYD;KHQH@;~)+*5.2.22/202/12.4,Z~HAI=OMBBE@>GOJIF45FUZRMKFU55M[RRTJ?g<IKNVRCFF]BC=DR[PEU<JaQDXMLFIGGGFHGGGGFHGHGGGHIFFFGGGHIIEEFGFHFHFFGGEHGGEGGHFEGHGFGEFHHGGGHLFLCCJJHLLGBEFGSQG?=@CDH>RRD<@??EL5NGDB>?JIG:KIMI?<CH>NE8CI<DEG1+)+,*2*,/~HF16FZ9-Ic~H,F~Ff1G_W9GUGMLHBLNGA;GRMGABKGCHQMF?NQD;:HVPF=?MGB7B/-1*2*2+1+1-.NbSD7CIEMeE~Fg@MBAFDNdP3?KBBFEARVDCKRK?MIKCFNd_3LFDBFM[[:IDGJOKLFGHGGGFFGIGHGGGFGFGHGHGHFGHFGGGGGEHFGGGGGEDHGGGGGGFEHGGGGGFc@IPJFHC6I[JDLLFHB7ASKFMKFHK?=HKEBDKBDDJID67TDGHKHD::OGIHEBD7C.-0+2*2+1,0.,O~H1IMJCAFHBUPA;FFG><USDERDGD:7NUMTTAE74RVKXX>O=MOGQTBSGHIKGGGFGHHHEGEGGHFIIGFDFFIGFGKHFFFFHHHJGEIHHEHHFGIHFFFGHGSFDEHLHFI?AJPHHHKM>?IJ@IGJOOB>DA=KHQQ@=E?>JAMCBGB@I@GFF~)6e)N+M+L-K-K-K.I/I0G1G2E3E4C6@9>;:@5F0K-K.J1D6@:<=9@7B5D3F1G1H/I/J-K-K-L+M+M+e~H*Z;2>B?GU8^aIT8S~H?PEFA~H6L>GCd.QI8P@]5O>8TET:7eK1DZ2d?~FUT80UJ?H~H+~FHL~H*N1CU>U0~H,?~F_P4>MN?T:Jf1A[:8IOEELH?QY?>DV<6JJLCIFO?HSPJ;4OH<LDOEGFHHS7MRNJ76<NTGAJBQFEHFHFMT7FOQLH8HVA1HJDAIHLGDIFHEIHJUD>HMKB1>SHMF?DOMBFLHGDFHGGGGGIHGNOEELLK@7DOACIOMTE>IECBFGIEHGGGGGGJFFJN?ICNGDJGQ[93QPEEHIDEDHGGGGHGJEGJE=QLQL8=CM9@ZSJAHLGHDHGGGGJCFK?FYI@A>RPPIJ@@LFKDGHFKCFI?I~H-9AH>CPN?7OFHEHHJ@HAN~H(3~FfR8NYC0SCHEMADDLf5~Fg<SZA/^9JIAALZN0BM[6EL=P8F]X7FQP2S>I6YXF=^8EL5F_H<XP?K+b;NPBFC:Y~FZ2WHA@V~Fg>Z4?]NR-RD;REBFP<.c~F^~Fe34/OIGFGFGGIEHEGGHFDGGHGDGGHGFDJFIFIF?IEGGII>KFKDIHELAKFKFHGFJCJHCHHFHHDKEENFJEHIEHFL@IGFHHEKEGFGHK?FGJFIHFHGGGFGHGJA@JLHGHFFJFGGGFFHHJCAJKHGFFHFFJFGGGFGEHGHKEDGIEHJFEFHGGGIFFHGGGFGDJFFKGEHFHFGGGGFFHIGGGGFGHFHGGFGFFHHFHGGGHGGGFGHGFGIHFFGFGHFGGGHFGGGGFEJFHGGGGIFFFFHFGGIHGGFFGGGHFHFGGGGHFHGGIFFEGGHHFFFJFHGFGGGHGFHFHGGIFGFEEIGHGEIGGGFGGHFHFIGDN@JCGHDGHHHFHFHFHFIGEM@GJCIGFHGGIEHFHHDO>HLGFGHGGHFGIDNAEIHGFHGHFHFJG@LGGFHIEHGJC@FGGHHFIH?HHFGHFJDCAMFGHGFJHHFIGFIEHIEFGGIEHFGIEFIHGIGGHGeIPCKK@HJL=6GILC~FeDPEL)FREJ5Q?OOBL9OGQMCG>NK3PRI?P8Je?ZU>HJG0~H,<4IYFAM>T1KZFWLCEL>OE4UC<TSBFIGEEL@;JGIBPUBDJGGFCKG>ADHUGGPBDKFGGGF?QC?BCKQLHFFLCGJDGHHFGC>RGB@BELF@KWIHGKEGHCHGIFHEGE=JLFCDIRJ>FGKLJEBJHEFHEIFHHFHFFFGACHICEEJQGCIOKAE>FNFIIKGGEGHGGGGGGEHFEBMEICGJGH::PWCAHIFGJGJFEHGGGFEIFEIN@DACPJBFHMABFJGCHFIGGGGEGHIDLH;FIJJ?;CJHLLCHEHHFGEHIFKG.PGBKDGEMPBIFGHGCMFJD1RX<JH>LU>KFHCLIHE2STHF>KV:OFEKJF8CPEI<RIDLBQI7=LCGBU?LGQ;<CK;RHCSH8CJBBNBZ8I>?MIIO<VOCJJK>PK?SL7I=XA<ICIH<@PS7eYQYPA-*1,0,/-.0+2*2*2,./,0,1*-~H/HFHKEMEEEQQ@5GWLM>3JSJMN8CC;GYY>EE9EH90X~H/H>CBML;(JhPKLED<E>;FQGDFKPGIGGGGGGFHHEGHIHDFGIKGDEGGGHJIFCFGGHGHIJFBEGHGGHGJICDGGGGEJGGFEHGFFGHGSFFGHHCHNH>AKSG?CCLQFCFDFJGJMGA@IHKKEGOQ?7FKIIDCMWD:BEDEFOJKJDEGIEECGA-*1,0,/.,1+2*2*2,./,0,1*-YHHJJDMJG@RPB9?GXRQI93=FJUYE?65<CHNFTB<:9<CJN9LF@???FML:DAEFJDDHIHIHFIGIGGFGHFGGHFGGHGGGGFGGHGFGGGGFGHFGGGGGGGFGHFGGGGGGFGHGFGGGFFHHGFGGGGFGGG]FGEGIDFJJ@CLQKC<BCHRTLDA@?KNSRMGB?HBMQQPLFA?NFKPOLJB?ALONHC@FMEABKEC>G=9*1,0,./-0,0,0.,0,1*9~H-G=VQ;9O~H+@+@;E~H1S>>BOCVaT5ECVDP[X8QBADfRG?KJfDTRO>EGMGFHFGFFGIGFDFJIGGFFFJHFFGHGFFFGHHHGECGIHGEDGFGEGFGTGM<AQOA2MYJMH1ALMI@IA:@QHI>HC=>NAJKJ7@GJEG7G?BCKGGA<*3+3+3+10,3+4+2/+3+3+4*<~H6DE_=BQA;?IKGHGGIKJAD>LOHCEQTAGB>MRHADRYA:ICJLIEELNEDFHBBJE6LNIIGGHFGGGFGGGGGGGGGGHGFFHHGGFFHGGFFHHGGFFIFFGGGGHFGGGGGGGGGGGGGGNHG?KJCILKEEGFGGFEFIILEBFIIAAKGIME@GJI@?KMGIFEFHHDCIIHFHJEGMEDF7<)5*4+3,2-2-2,~)?~H(FE?AK=:YVLEeI7_b/.R17?QHFGGIIMNDAGMBCE>EGHGFGIG[PEDI@CNB>FL<BN::SW@PQNA7<)4+3+2,1-0-1,~)E~H)AHHN<FP^R15HPZ;~FaRZAMEQ[FIGEHHEHHHHEGGGHGEGIFGGGHGUHEHEJHF=AQSI@;L[FCG?GE@F7~)?,2-2,3,3+3+4*<fDHFGBH?UIAR^We?+~Fe*THUJTCGGHGGHHFGGHGFFGGGHIFFHFEG[ICGGJ@LBCGD=B:OT[X=C<FAI7~)E,1-0-1,2+3*4*<~H+]A?85~H6P2J>1R_OJ5@8OE~FaLNIIHGGFEJHFHGEGHGIFEEHHHGGGS>JIKP4FMEDRH@EDLMPCFfC@F5J*4+3+3,2.1-~)?eD3?Y?J[gU7DI@3ef5BCc^2IFFFHFIHKKECFKDCGHBFFGHbHSM7IJ85COGBMZ:-MIO:4O5J*3+3+1-0-1,~)E~HHE2HN14cbD.2cXFMF>GFNJOGEGHDFJJFBELJFGFFGFGHGHSEDQP:9GTV:<DCFRGEEE7~)?,2-2-2,3+3+4)=cI4FJG*TO:CZJ<NWP=La7Ab6~FfMEFHFDELIIFKHEJGEHEEIHGGH[CPKFASJEQHCFLH?CLC:PJ:PY7~)E,1-0-1+3+3*4)=~H<93Q[W7~FdUVILF9<DM1Da?McJFEGLKCBGIKICDHHFFGFEGGJNOA>DOU>?FHHKQHASI7FE95J*4*4+3,2.1-~)?GGUIUN57YV/C~H*^*6:1R<E;LGGGGFGEDJIGFKFFGJIEEHgG8GFCVW==UJ2;XONTANFM5J*3+3+2,0.0-~)D~H0CHd:B]>.@;VTFAL4JHF>KCKGGJFGHGGFCIHHHKCDGHGIFPIF=LG=MRIICDEIJLEGEIJI5~)?-1-2-3+3+4*JdKWB@FN[9:JJ34YIDTZa@=CIJHDEGLIADDHDFGGIFGIFDGWD?MLGA=WNIGWO;CJ@=>IJH5~)D-0.0-1+3*4*J~H.GPTF3>EYYE?@IWO;?Z5IFLTJNHD==MXICF=JVKNBGOFEGQNI<?PPPH7;POI>>YN1SF:E5J)5*4+3+3-1-~)@e~H,?6C/~FYEOHFFbILDGaGMDGGGJLGDGCCKIEDFJHb.LNJZ~H*I?IDA=IAFE<J5J)5*3+2,1-0-~)D~H<(OO~FcV~H/ACGTDESDEFFDLJGGFGHFFHGHDGIHHFEGHQZB@^?0IGIDHG=JJJFHC5~)@,1.2,3+4*4*J_L_P6*NeVEaILE>~FbTPO~H,GIEGHHGEGHGHGGGGIGHFFFWH;BMUH8AG;GDGJ[@AC6F5~)D,1-1,2+3*4*JPYK=2K~H)M4YGRA~H2K~Fb3H.GRDCIMJAAICIFE?GNGGMG~H*=DMTC4DS=G?K+EaPG[F3X*4*4+3-1-~)@~HH?~FFKIPZeNTI<GNRK=LHBGJHOVQ3@OLK1COGKbEI@L:CWOBOFQJA3X*3+3+1-1-~)CcLJ~FfTPAIEBZTAFAZTDKGIEGHHFBFLJFGELJF[DD]?CLDBGFAHHFEBG3~)@,2-2,3+4*X]AbVC;~H-^=dKKFA)SZLIFJHGEKHGJHHGHHGGF_K<=IO67L8FDGIX@8D3~)C-1-1+3*4*XPKXAB>G~H(@A[BL~H4B<DKFMJCGCNLCJEHDHGH~H-C;GMLC5GN?GC~FgKFKME*7024/6.6-8,8,8+:*:+8,8,8-6.6/4207*E~H=G5RWJGG79UEPXABGLR>@>M@AV?@HFIDbLA>[,BEGIIIKHJZIB=Q(ENHGGJJPOPO=6P>(~H1J~F]WCMJNKTND;I77Z0OHHILLQRFN27MP=8JKEJGNJBC_a~FX4CD~H(97DNDIIOC7RS_~Fc7N~H1//FQDIJP7DOTa*B~H6A/2RIIKIF<UOV~FWJ~H)N<~FgKRIJGWB[.N*5dC+2dAQPIJL2L<d<K2=~H0@MIOAM.2S?G2M~H(NA8HA8TY,.;7XL>LGFHGGGHFEIFIGFHFGHFHEGJEGGFGHGGGGEGFIFFHHGGFHGHGEHFJDJFEHFHFGGFHGHFHEMBFGHGFHGFGIEIFJFCIFHFGGFHFIFGIFFGHFHGGFHEHHDIFIJEFGGGFHGGGFHFGGFHMAGHFGGGGGEHGFL?KKBIFGFHFHEGGGFCEOBHFFHFGHEJFEJ@NGDIDHGGFGIEEFJKAFIEGGGHEFFFKHEGEGHFGHGHFEHHGGGGVGLJEFIFEBILL?IJFFFEFDJSG@MDGHFIAAH@JMAKCLEHEKD>DFGNRHKF@HEJABB@NGLLV2JX:LGHBE=DIIDTJGN:LFHFCB?HBUCOEGP>MEHIFEJH99^BIT7RFJHFHJ@MBEH7Y?F-XT>ODGDDOBFA7[D1I[HJEGCEJK@A?Y;E>TSHDBHE>I<RFJJ;J]EI@FADGAW=CDOKNH<AEFBL?KFFQRGG:BLKD?@INMPILA=I7+*,.*.)8).*.,*+PHY<6KXO[?-I]JAgE3BNA7EYLF@B=<6UR:ABAUR;9F1EGHFGGHFGHGGGGGGIGGFGGFGJHFEGGFGIEDFGFGFFFGEGTG@JOIBDBJSKACCAJQKEEEHGJJJIEBMGELJCFFDJMDGG7+*,.*.)8).*.,*+~H9F>TQ?:B4SaE5EB*JgVJJBI=HKVYL9dA1NYJG>3H[JTFJGHGGFGGGHGFFGHIHFEEFHGKGEEDFIEGFGEFEGHGFFEHHGRH?CHHQK8>GHLYK;<CFGGQIF@>DH9KSF7DDKRK9B>H/)*)+)+-U@T~HV~FPA~H+~FUKGEEJHFI~H>L>~FT~H*K0~H(MD,6024/6.6-8,8+:*:*:*:+8,8-6.6/4206,DfOLH+[]PAP=3P=FbC<GISKF3]P~FQ[BCFIJLVVB3W~Fe2R;PDILOWPLEEG~FZQ?_2HJLPM_R>1a~FPe(OK1LFMKTV_=15e1X~FVXG>KGJKVVUM*+IAZI~FeZ:DIGIKRUYR~Fb~FbDJfB~F[d1EEFKMGWPU~Fd~Fb?^fF~FSWD7IKCFJS_JD~FWDfR~F];J>HMDGPOZ2~H6>~H)W<~FUHIJIRNO~H(,~Fg~H,8^U~FU8NPMNVRC?~Fd0eb7(>aQJTL=9+,ZME2L~H,PBC/9,SW,5XEM.D9CKHGFIHEHGFKDCHJDIGGHFJEEGIFFHGFGGGIGGDEIFGGGHGGHFJGDFGJHFJDEHGHDIFHGEKJGDKBHFGHFGEHJCGLFFIK?IFGGFHFIFGFHJJDLBGGFGGGFHFHHGJLGCR>EFGGFGGHEIHHJEKGIHBHDGHFGGFIGL>KMDJ@IDGHEHGHEBFDNDGICGFEJFHIDK@IMCHEFHGGGGFECHLGEDFGGGGJFGKFLCEGGGGIEBIKIDFGFFHFFYJFCRFDJFDFEEVMAFLHDCDABCTY@GLBIEI@>F?H[JCP=LFIEC>G;AYaEK>N?HEEB:@NDC~H07YAFU<HFI>A6MN@LX?b=O?AIEGB@<FSCK[?HUEJBI?KDE@>@ZFHW9Ig3Y@DBGGFBBBTEHR5Ih=KOGE=FDF=EJHC;@eNDNCBJFAC=O5AE;OhEIAH@DC1XX)HB<~H*NCAF@=?IPKEH=RYN7@E?FKKDFKIMSC1ALDMCBLFXS9D9ARP@7+*,.*.)8).*.,*+GHdI4ENFXT0<JAA~H*V:9=;;F_SF<98A6QJDA=?KJGEC:HHGGGHGFGGGHGFGFGGHGGGGGGGHGGHFHGFHGGGGFHGGHGYF@GMIFFBENMGGC=ENNJHFGAGKLJHEOGHIGGIHGHFFGG7+*,.*.)8).*.,*+]EBPa;1>SH_=*<YXJJF<ABFUJBQbD~FaGD9LbL;C?FULFFIGHHFGIFFIHGHFCGIHHFFEGHHHFEFHGHGFGFGGGGGGGG]GHNCEFF=SIEFH:<MSJHHDI@IPIAGMLJQG>DMKOG>CCG/)*)+)+-U@Z~HP~FNAh~FSHGHGEGFF~H9K>~FZhJ3f',
};
// Topshine: the star mark as clear violet glass, two glass orbs and a thin glass ring in a lavender room. Colours are
// smooth fields fitted to the concept (TOPSHINE); the crisp parts are computed: the star's rim, rim zone and creases,
// the orbs' limbs and highlights, the rings' edges and bands, the mark's halo. Alive, a glint runs round the ring and caustics shimmer.
MOTIFS.topshine = (() => {
  const T = TOPSHINE, k = 1 / 574, f = v => (+v).toFixed(5);
  const FO = [], FN = [], FB = [];
  let off = 0;
  for (const [b, n] of T.blocks) { const [x0, y0, s] = T.boxes[b]; FO.push(off); FN.push(n); FB.push(`vec3(${f(x0)}, ${f(y0)}, ${f(s)})`); off += n * n; }
  const [rx, ry, ra, rb, rang] = T.ring, ar = rang * Math.PI / 180;
  const M = T.mark;
  // where each part's blocks start: the room, its ring and haze bands and the mark's halo, then the star, then the orbs
  const G = { halo: 3 + T.rlines.length, star: 4 + T.rlines.length + T.hazeo.length };
  G.orb0 = G.star + 5 + 4 * T.qlines.length; G.orb1 = G.orb0 + 4;
  const orb = ([x, y, r]) => `vec3(${f(x * k)}, ${f(y * k)}, ${f(r * k)})`;
  // an orb's highlights: elongated gaussians, summed
  const spec = list => list.map(([x, y, sx, sy, deg]) => {
    const a = deg * Math.PI / 180;
    return `streak(u, vec2(${f(x * k)}, ${f(y * k)}), vec2(${f(sx * k)}, ${f(sy * k)}), vec2(${f(Math.cos(a))}, ${f(Math.sin(a))}))`;
  }).join(' + ');
  return /* glsl */`
const float CPX = 574.0;   // concept px per cover unit: the fit's widths are in concept px
const int KW = ${Math.min(off, 2048)};
const int FO[${FO.length}] = int[${FO.length}](${FO.join(', ')});
const int FN[${FN.length}] = int[${FN.length}](${FN.join(', ')});
const vec3 FB[${FB.length}] = vec3[${FB.length}](${FB.join(', ')});
const vec2 SO = vec2(${f(T.O[0] * k)}, ${f(T.O[1] * k)}), SA = vec2(${f(T.A[0] * k)}, ${f(T.A[1] * k)}), SB = vec2(${f(T.B[0] * k)}, ${f(T.B[1] * k)});
const vec3 ORB0 = ${orb(T.orbs[0])}, ORB1 = ${orb(T.orbs[1])};
const vec2 RC = vec2(${f(rx * k)}, ${f(ry * k)}), RAB = vec2(${f(ra * k)}, ${f(rb * k)}), RCS = vec2(${f(Math.cos(ar))}, ${f(Math.sin(ar))});
const vec4 MS = vec4(${f(M[0] * k)}, ${f(M[1] * k)}, ${f(M[2] * k)}, ${f(M[3] * k)});
const vec3 MD0 = ${orb(M.slice(5, 8))}, MD1 = ${orb(M.slice(8, 11))};
const float QL[${T.qlines.length}] = float[${T.qlines.length}](${T.qlines.map(f).join(', ')});
const vec2 HC = vec2(${f(T.haze[0] * k)}, ${f(T.haze[1] * k)}), HAB = vec2(${f(T.haze[2] * k)}, ${f(T.haze[3] * k)}), HCS = vec2(${f(Math.cos(T.haze[4] * Math.PI / 180))}, ${f(Math.sin(T.haze[4] * Math.PI / 180))});
vec4 bw(float t) { float s = 1.0 - t; return vec4(s * s * s, (3.0 * t - 6.0) * t * t + 4.0, ((-3.0 * t + 3.0) * t + 3.0) * t + 1.0, t * t * t) / 6.0; }
vec3 key(int i) { return texelFetch(uKeys, ivec2(i % KW, 2 * (i / KW) + 1), 0).rgb; }
// field k at u (concept coordinates: cover units, y down): a uniform cubic B-spline over its box
vec3 field(int k, vec2 u) {
  int n = FN[k], o = FO[k];
  vec3 b = FB[k];
  vec2 g = (u - b.xy) * (float(n - 3) / b.z) + 1.0, i = floor(g), t = g - i;
  vec4 wx = bw(t.x), wy = bw(t.y);
  ivec2 c0 = ivec2(i) - 1;
  vec3 s = vec3(0.0);
  for (int y = 0; y < 4; y++) {
    int row = o + clamp(c0.y + y, 0, n - 1) * n;
    vec3 r = vec3(0.0);
    for (int x = 0; x < 4; x++) r += wx[x] * key(row + clamp(c0.x + x, 0, n - 1));
    s += wy[y] * r;
  }
  return s;
}
// concept px from a superellipse |x/a|^q + |y/b|^q = 1 about c, measured along the ray from c (negative inside)
float superD(vec2 u, vec2 c, vec2 ab, float q) {
  vec2 d = u - c;
  float g = max(pow(abs(d.x) / ab.x, q) + pow(abs(d.y) / ab.y, q), 1e-6);
  return length(d) * (1.0 - pow(g, -1.0 / q)) * CPX;
}
// the star's crease level q: through its four tips
float crease(vec2 u, float q) { vec2 d = u - SO; return superD(u, SO, vec2(d.x > 0.0 ? SA.x : SA.y, d.y < 0.0 ? SB.x : SB.y), q); }
float line(float d, float w) { return exp(-d * d / (w * w)); }
float sig(float x) { return 1.0 / (1.0 + exp(-x)); }
float streak(vec2 u, vec2 c, vec2 s, vec2 cs) {
  vec2 d = u - c, e = vec2(d.x * cs.x + d.y * cs.y, -d.x * cs.y + d.y * cs.x) / s;
  return exp(-dot(e, e));
}
// one sample's weight for every block (its feature times the coverage of its part) and its extra light (alive)
void weigh(vec2 p, float t, inout float w[${FO.length}], inout vec3 extra) {
  vec2 u = vec2(p.x, 1.0 - p.y);
  float live = 1.0 - exp(-t * 1.2);
  vec4 f = formAt(p);
  float cs = cover(f.r);
  float c0 = cover(length(u - ORB0.xy) - ORB0.z), c1 = cover(length(u - ORB1.xy) - ORB1.z);
  float o1 = c1, o0 = c0 * (1.0 - c1), st = cs * (1.0 - c0) * (1.0 - c1), gr = (1.0 - cs) * (1.0 - c0) * (1.0 - c1);
  // the ring: its edges, its fill and the wider band inside it, in front of the star on its lower half
  vec2 d = u - RC, o = vec2(d.x * RCS.x + d.y * RCS.y, -d.x * RCS.y + d.y * RCS.x);
  float rd = sdEllipse(o, RAB) * CPX, ringW = gr + st * sig(o.y * CPX / 2.0);
  if (rd > -26.0 && rd < 8.0 && ringW > 0.0) {
    ${T.rlines.map((r, i) => `w[${1 + i}] += ringW * line(rd - ${f(r)}, 1.0);`).join(' ')}
    w[${1 + T.rlines.length}] += ringW * sig(-rd / 0.8) * sig((rd + ${f(T.rwidth)}) / 0.8);
    w[${2 + T.rlines.length}] += ringW * sig(-(rd + ${f(T.rwidth)}) / 1.5) * sig((rd + ${f(T.rwide)}) / 1.5);
    float ang = atan(o.y / RAB.y, o.x / RAB.x) - t * 0.9;
    extra += vec3(0.9, 0.88, 1.0) * 0.45 * live * ringW * line(rd + 1.0, 1.4) * exp(-pow(abs(mod(ang + PI, TAU) - PI) / 0.35, 2.0));
  }
  if (gr > 0.0) {
    w[0] += gr;
    // the brand mark's halo
    vec2 m = u - MS.xy;
    if (dot(m, m) < 0.01) {
      float md = min(superD(u, MS.xy, MS.zw, ${f(M[4])}), min(length(u - MD0.xy) - MD0.z, length(u - MD1.xy) - MD1.z) * CPX);
      w[${G.halo}] += gr * exp(-max(md, 0.0) / ${f(T.halo)});
    }
    // the haze ring behind the star: a soft bright band and a darker one just inside it
    vec2 hq = u - HC;
    float hd = sdEllipse(vec2(hq.x * HCS.x + hq.y * HCS.y, -hq.x * HCS.y + hq.y * HCS.x), HAB) * CPX;
    ${T.hazeo.map((h, i) => `w[${G.halo + 1 + i}] += gr * line(hd - ${f(h)}, ${f(T.hazew)});`).join(' ')}
  }
  if (st > 0.0) {
    float ds = f.r * CPX, thin = st * smoothstep(2.0, 6.0, -ds);
    vec2 q = (u - SO) * CPX;
    int s0 = ${G.star};
    w[s0] += st; w[s0 + 1] += st * line(ds + 1.0, 0.9); w[s0 + 2] += st * exp(min(ds, 0.0) / 6.0);
    // the body (inside a crease level) fades where the arm is thin, so it never runs up an arm's axis as a sliver
    w[s0 + 3] += st * smoothstep(6.0, 20.0, -ds) * sig(-crease(u, ${f(T.qbody)}) / 1.5);
    // each arm's spine, from its tip to near the centre
    w[s0 + 4] += thin * line(min(abs(q.x), abs(q.y)), 1.0) * smoothstep(40.0, 70.0, length(q));
    // the creases: each level's line in each quadrant (upper right, upper left, lower left, lower right)
    vec4 qm = vec4(sig(q.x / 0.7) * sig(-q.y / 0.7), sig(-q.x / 0.7) * sig(-q.y / 0.7), sig(-q.x / 0.7) * sig(q.y / 0.7), sig(q.x / 0.7) * sig(q.y / 0.7));
    for (int i = 0; i < ${T.qlines.length}; i++) {
      float l = thin * line(crease(u, QL[i]), 1.3);
      for (int j = 0; j < 4; j++) w[s0 + 5 + i * 4 + j] += l * qm[j];
    }
    if (live > 0.0) {
      // caustics: bright threads in the glass that shimmer
      vec3 n = formNormal(f);
      float cz = sin(dot(p, vec2(31.0, 23.0)) + n.x * 9.0 - n.y * 7.0 + t * 1.1) * sin(dot(p, vec2(-19.0, 29.0)) + n.y * 8.0 - t * 0.8);
      extra += vec3(0.95, 0.9, 1.0) * 0.18 * live * st * pow(sat(cz), 6.0) * f.a;
    }
  }
  if (o0 > 0.0) {
    float dd = (length(u - ORB0.xy) - ORB0.z) * CPX;
    w[${G.orb0}] += o0; w[${G.orb0 + 1}] += o0 * line(dd + 1.0, 1.0); w[${G.orb0 + 2}] += o0 * line(dd + 3.5, 1.5); w[${G.orb0 + 3}] += o0 * (${spec(T.specs[0])});
  }
  if (o1 > 0.0) {
    float dd = (length(u - ORB1.xy) - ORB1.z) * CPX;
    w[${G.orb1}] += o1; w[${G.orb1 + 1}] += o1 * line(dd + 1.0, 1.0); w[${G.orb1 + 2}] += o1 * line(dd + 3.5, 1.5); w[${G.orb1 + 3}] += o1 * (${spec(T.specs[1])});
  }
}
// Fields are read once per pixel, at its centre; each sample keeps its own weights. The first call for a pixel shades
// all its samples and later calls return that mean (only the front calls it per pixel: the back crops the front).
vec2 tsFC = vec2(-1.0);
vec3 tsCol;
vec3 motif(vec2 p, float t) {
  if (FC == tsFC) return tsCol;
  tsFC = FC;
  int ns = int(uSS + 0.5);
  vec2 offs[4] = vec2[4](vec2(0.125, 0.375), vec2(-0.375, 0.125), vec2(0.375, -0.125), vec2(-0.125, -0.375));
  float w[${FO.length}];
  for (int k = 0; k < ${FO.length}; k++) w[k] = 0.0;
  vec3 col = vec3(0.0);
  for (int i = 0; i < ns; i++) {
    weigh((FC + (ns > 1 ? offs[i] : vec2(0.0))) / uRes, t, w, col);
  }
  vec2 u = vec2(FC.x, uRes.y - FC.y) / uRes;
  for (int k = 0; k < ${FO.length}; k++) if (abs(w[k]) > 1e-4 * float(ns)) col += w[k] * field(k, u);
  tsCol = max(col / float(ns), vec3(0.0));
  return tsCol;
}`;
})();


// Scorecard: a Swiss composition, a quartered disc over diagonal fields; alive, the quarters turn a step. Fitted to its
// concept cut to its cover box (566 px, y down): the two splits, three field diagonals, the disc (a slight ellipse, as the
// photographed sleeve shows it) and its wedge line, each region's colour a cubic field in linear light, a faint dark seam
// where regions meet, and the paper's grain.
MOTIFS.scorecard = /* glsl */`
#define SC_GRAIN (uMip < 0.5 ? 1.0 : 0.0)
#define SC_GF 0.66
#define SC_GA 0.0425
float scCov(float d, float w) { return clamp(0.5 + d / w, 0.0, 1.0); }
float scLine(vec2 X, vec3 l) { return dot(X, l.xy) - l.z; }
vec3 motif(vec2 p, float t) {
  vec2 X = vec2(p.x, 1.0 - p.y) * 566.0;
  float bw = max(1.7, AAW * 566.0);   // the concept's edge, never under a pixel
  // the disc's quarters turn about their own split point when alive
  vec2 S2 = vec2(275.746, 290.235);
  float T = t * 0.25;
  float a = -0.5 * PI * (floor(T) + ease(sat((fract(T) - 0.62) / 0.38)));
  vec2 Xq = S2 + rot(-a) * (X - S2);
  float L = scCov(275.367 - X.x, bw), Tp = scCov(289.395 - X.y, bw);
  float L2 = scCov(S2.x - Xq.x, bw), T2 = scCov(S2.y - Xq.y, bw);
  float tri = scCov(-scLine(X, vec3(0.728472, -0.685076, -104.283)), bw);
  float dg = scCov(scLine(X, vec3(0.702087, 0.712092, 403.23)), bw);
  float nb = scCov(scLine(X, vec3(0.694955, 0.719053, 651.874)), bw);
  float A = scCov(scLine(Xq, vec3(-0.687235, -0.726436, -406.399)), bw), B = scCov(scLine(Xq, vec3(-0.687367, -0.72631, -407.788)), bw);
  vec2 e = rot(-2.65023) * (X - vec2(277.487, 281.652));
  float rr = length(e / vec2(151.778, 148.914)), gg = length(e / vec2(23036.7, 22175.4)) + 1e-9;
  float D = scCov(-(rr - 1.0) * rr / gg, bw), O = 1.0 - D;
  float w0 = Tp * L * (1.0 - tri) * O, w1 = Tp * L * tri * O, w2 = Tp * (1.0 - L) * O;
  float w3 = (1.0 - Tp) * L * (1.0 - dg) * O, w4 = (1.0 - Tp) * L * dg * O;
  float w5 = (1.0 - Tp) * (1.0 - L) * (1.0 - nb) * O, w6 = (1.0 - Tp) * (1.0 - L) * nb * O;
  float w7 = T2 * L2 * D, w8 = T2 * (1.0 - L2) * D * A, w9 = T2 * (1.0 - L2) * D * (1.0 - A), w10 = (1.0 - T2) * (1.0 - L2) * D;
  float w11 = (1.0 - T2) * L2 * D * B, w12 = (1.0 - T2) * L2 * D * (1.0 - B);
  // a turned quarter reads its colour inside the disc it was fitted in (a cubic runs off fast outside it)
  vec2 DC = vec2(277.487, 281.652), dq = Xq - DC;
  vec2 Xc = DC + dq * min(1.0, 148.914 / max(length(dq), 1e-3));
  vec2 u = (X - 283.0) / 283.0, v = (Xc - 283.0) / 283.0;
  float mf[10] = float[10](1.0, u.y, u.y * u.y, u.y * u.y * u.y, u.x, u.x * u.y, u.x * u.y * u.y, u.x * u.x, u.x * u.x * u.y, u.x * u.x * u.x);
  float md[10] = float[10](1.0, v.y, v.y * v.y, v.y * v.y * v.y, v.x, v.x * v.y, v.x * v.y * v.y, v.x * v.x, v.x * v.x * v.y, v.x * v.x * v.x);
  vec3 col = vec3(0.0);
  float s2 = w0 * w0 + w1 * w1 + w2 * w2 + w3 * w3 + w4 * w4 + w5 * w5 + w6 * w6 + w7 * w7 + w8 * w8 + w9 * w9 + w10 * w10 + w11 * w11 + w12 * w12;
  if (w0 > 0.0) col += w0 * (vec3(-0.01832, -0.03547, -0.1207) * mf[0] + vec3(-0.1109, -0.1387, -0.4071) * mf[1] + vec3(-0.1706, -0.1267, -0.2811) * mf[2] + vec3(-0.0808, -0.03463, -0.02889) * mf[3] + vec3(-0.06202, -0.0861, -0.2568) * mf[4] + vec3(-0.0871, -0.1914, -0.6345) * mf[5] + vec3(-0.06095, -0.1232, -0.3946) * mf[6] + vec3(-0.09078, -0.03721, -0.0182) * mf[7] + vec3(-0.02045, -0.02416, -0.05725) * mf[8] + vec3(-0.04845, -0.009638, 0.029) * mf[9]);
  if (w1 > 0.0) col += w1 * (vec3(-0.3315, -0.1363, 2.855) * mf[0] + vec3(-0.1904, -0.1247, -2.022) * mf[1] + vec3(0.1298, -0.7464, -4.573) * mf[2] + vec3(-0.0755, -0.8886, 4.174) * mf[3] + vec3(-1.308, -0.7268, 10.67) * mf[4] + vec3(-0.4403, 0.1394, -2.887) * mf[5] + vec3(0.1692, -0.1918, -7.097) * mf[6] + vec3(-1.697, -0.8544, 16.1) * mf[7] + vec3(-0.2585, 0.1412, -0.4396) * mf[8] + vec3(-0.7261, -0.3316, 7.688) * mf[9]);
  if (w2 > 0.0) col += w2 * (vec3(-0.01209, -0.0174, 0.118) * mf[0] + vec3(-0.05786, -0.251, -1.183) * mf[1] + vec3(-0.08712, -0.2239, -0.9656) * mf[2] + vec3(-0.04505, -0.07567, -0.2634) * mf[3] + vec3(0.02093, 0.1714, 0.9942) * mf[4] + vec3(0.04695, 0.3404, 1.589) * mf[5] + vec3(0.02323, 0.116, 0.3582) * mf[6] + vec3(-0.01459, -0.01116, 0.04293) * mf[7] + vec3(-0.01287, -0.1627, -0.9695) * mf[8] + vec3(0.005015, -0.0837, -0.7028) * mf[9]);
  if (w3 > 0.0) col += w3 * (vec3(-0.007608, -0.04457, -0.1956) * mf[0] + vec3(-0.04401, 0.3347, 0.3317) * mf[1] + vec3(-0.05042, -0.5798, -0.257) * mf[2] + vec3(0.01807, 0.9647, 0.2275) * mf[3] + vec3(-0.1782, -1.072, -1.438) * mf[4] + vec3(-0.1251, 0.6436, 0.9009) * mf[5] + vec3(-0.03243, 0.7871, -0.06002) * mf[6] + vec3(-0.4075, -0.8013, -1.333) * mf[7] + vec3(-0.07382, 0.8737, 0.5946) * mf[8] + vec3(-0.2444, 0.03181, -0.2898) * mf[9]);
  if (w4 > 0.0) col += w4 * (vec3(-0.09036, -0.08349, -0.1548) * mf[0] + vec3(0.2555, 0.872, 0.8974) * mf[1] + vec3(-0.2226, -0.8237, -0.7185) * mf[2] + vec3(0.05859, 0.2831, 0.1427) * mf[3] + vec3(-0.1752, -0.01951, -0.108) * mf[4] + vec3(0.3818, -0.1682, 0.06108) * mf[5] + vec3(-0.2003, 0.2506, -0.06241) * mf[6] + vec3(-0.04244, -0.4868, -0.4164) * mf[7] + vec3(0.0568, 0.3804, 0.004279) * mf[8] + vec3(0.00559, -0.06442, -0.248) * mf[9]);
  if (w5 > 0.0) col += w5 * (vec3(1.087, 0.7314, -0.1198) * mf[0] + vec3(-0.5219, -0.8788, 0.3954) * mf[1] + vec3(0.8385, 1.333, -0.389) * mf[2] + vec3(-0.4304, -0.6723, 0.1192) * mf[3] + vec3(-0.8749, -1.013, 0.3996) * mf[4] + vec3(1.862, 1.885, -0.9159) * mf[5] + vec3(-1.062, -0.9504, 0.5021) * mf[6] + vec3(1.537, 1.92, -0.3435) * mf[7] + vec3(-1.414, -1.481, 0.4392) * mf[8] + vec3(-0.7686, -1.022, 0.08717) * mf[9]);
  if (w6 > 0.0) col += w6 * (vec3(-0.1545, -0.04417, -0.4906) * mf[0] + vec3(0.276, 0.004005, 0.611) * mf[1] + vec3(-0.31, -0.036, -0.05141) * mf[2] + vec3(0.1562, 0.05457, -0.08807) * mf[3] + vec3(0.3844, 0.2316, 1.218) * mf[4] + vec3(-0.1692, 0.01521, -1.201) * mf[5] + vec3(-0.02935, -0.08847, 0.2226) * mf[6] + vec3(-0.4175, -0.3108, -0.8344) * mf[7] + vec3(0.1332, 0.07566, 0.4874) * mf[8] + vec3(0.137, 0.1098, 0.1538) * mf[9]);
  if (w7 > 0.0) col += w7 * (vec3(0.9341, 0.09037, -0.01661) * md[0] + vec3(-0.2764, 0.2189, -0.1118) * md[1] + vec3(-0.9024, 0.1286, -0.486) * md[2] + vec3(-0.6804, -1.926, -0.6164) * md[3] + vec3(-0.117, 0.2089, -0.1725) * md[4] + vec3(-0.4016, 0.4516, -0.1955) * md[5] + vec3(-1.134, 1.643, -0.2445) * md[6] + vec3(0.5528, 0.9354, -0.556) * md[7] + vec3(0.2786, -0.6541, -0.3229) * md[8] + vec3(1.572, 1.042, -0.611) * md[9]);
  if (w8 > 0.0) col += w8 * (vec3(-0.007328, 0.1267, 0.9434) * md[0] + vec3(0.006373, -0.07725, 0.1565) * md[1] + vec3(-0.00825, -0.7836, 0.5993) * md[2] + vec3(-0.07819, -1.734, 0.8053) * md[3] + vec3(0.2671, -0.4096, 1.342) * md[4] + vec3(0.0331, -2.129, 1.202) * md[5] + vec3(-0.3558, -3.339, 2.68) * md[6] + vec3(-1.856, 1.725, -7.777) * md[7] + vec3(-1.362, -1.716, 1.405) * md[8] + vec3(2.732, -2.251, 15.05) * md[9]);
  if (w9 > 0.0) col += w9 * (vec3(0.01399, 0.3435, 1.061) * md[0] + vec3(0.05042, 0.5903, -0.4045) * md[1] + vec3(0.7494, 3.866, 5.579) * md[2] + vec3(0.3057, 2.699, 1.104) * md[3] + vec3(-0.1562, -0.4255, -1.345) * md[4] + vec3(0.2124, -1.387, 5.736) * md[5] + vec3(0.8718, -1.204, -10.58) * md[6] + vec3(0.8181, 3.031, 5.761) * md[7] + vec3(0.2807, 2.653, -9.677) * md[8] + vec3(-0.7129, -3.79, -7.183) * md[9]);
  if (w10 > 0.0) col += w10 * (vec3(0.000638, 0.01082, 0.2614) * md[0] + vec3(-0.06684, 0.07331, -0.07186) * md[1] + vec3(0.1082, -0.2157, 2.563) * md[2] + vec3(0.04965, 0.5735, -3.192) * md[3] + vec3(-0.01356, 0.06956, 0.4143) * md[4] + vec3(0.9797, 0.5416, 2.607) * md[5] + vec3(-1.412, -0.8631, -5.07) * md[6] + vec3(-0.07997, -0.3649, -0.8592) * md[7] + vec3(-1.476, -0.26, -1.574) * md[8] + vec3(0.2226, 0.7067, 1.232) * md[9]);
  if (w11 > 0.0) col += w11 * (vec3(0.9142, 0.7986, 0.7125) * md[0] + vec3(-0.0109, 0.6955, 0.2473) * md[1] + vec3(10.64, 5.773, -0.1123) * md[2] + vec3(-4.663, -0.6165, 0.6743) * md[3] + vec3(0.06862, -0.3126, -0.5267) * md[4] + vec3(12.88, 12.45, 4.86) * md[5] + vec3(11.88, 5.137, -5.606) * md[6] + vec3(2.225, 0.516, -1.136) * md[7] + vec3(21.26, 18.13, 4.963) * md[8] + vec3(3.737, 1.198, -1.405) * md[9]);
  if (w12 > 0.0) col += w12 * (vec3(1.105, 0.7351, 0.2442) * md[0] + vec3(-3.5, -1.152, -1.737) * md[1] + vec3(15.21, 3.978, 3.673) * md[2] + vec3(-19.19, -4.029, -2.281) * md[3] + vec3(-3.213, -1.306, 0.09462) * md[4] + vec3(9.399, 6.506, -1.36) * md[5] + vec3(-14.71, -11.25, 1.774) * md[6] + vec3(-8.64, -0.7452, -0.4627) * md[7] + vec3(-4.528, -4.857, -2.532) * md[8] + vec3(-17.02, -6.682, -6.179) * md[9]);
  col *= 1.0 - 0.278519 * 2.0 * (1.0 - s2);
  // the paper's grain, static and level in sRGB (as the concept's is); the two levels under full size, which the
  // shader draws itself (shaderMips: 2), leave it out so at shelf size it settles to its mean
  // (in linear light: d lin / d srgb taken as 2 sqrt(lin), gamma 2)
  col = max(col, 0.0);
  return col + (vnoise(X * SC_GF) - 0.5) * (SC_GA * 2.0 * SC_GRAIN) * sqrt(col);
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
// coverage of the band |d| < w under a one-pixel box filter
float ovl(float d, float w) { d = abs(d); return max(0.0, min(d + 0.5 * AAW, w) - max(d - 0.5 * AAW, -w)) / AAW; }
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
  // lines closer than a few pixels fade to their mean; a mip level (sampled up to half a level sharper on the
  // shelf) fades them sooner, so they cannot beat against its grid
  float PXF = PX * 1.7, PX0 = PX * exp2(-uMip);
  float resolve0 = smoothstep(1.4 * PX0, 4.0 * PX0, spacing);
  float core = exp(-psi * psi * 5.0);
  vec3 G = lc * env * (1.35 + 0.6 * core);
  if (uMip < 0.5) col += G * mix(0.55, max(dotA, lineA), resolve0);
  else {
    // A mip level fades to what the full-size front averages to here: where the pattern resolves, its mean,
    // with each hot dot clipped as the full-size front clips it. Its dots and lines are thinner than its
    // pixels, so they take box-filtered coverage, which keeps their area (the edge ramp would draw each at
    // least a pixel wide).
    float h = r * 0.8862;                                                      // the dot as a square of its area
    dotA = ovl(da, h) * ovl(perp, h) * (0.85 + 0.3 * h12(vec2(n, k) + 7.1));
    lineA = ovl(perp, 0.0005) * 0.55;
    float dotMean = sat(3.14159 * r * r / (sp * alongScale * spacing));
    float lineMean = min(1.0, 0.001 / spacing) * (1.0 - dotMean);
    vec3 mean = dotMean * (min(col + G, 1.0) - col) + lineMean * (min(col + 0.55 * G, 1.0) - col);
    col += mix(mix(0.55 * G, mean, resolve0), G * max(dotA, lineA), smoothstep(1.4 * PXF, 4.0 * PXF, spacing));
  }
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
// gold-leaf grain, static, its strength and size matched to the concept's on flat patches (on the sphere it grows with
// the key light). It sits near the full-size grid's limit, so the two levels below full size, which the shader draws
// itself (shaderMips: 2), leave it out: at shelf size it settles to its mean instead of twinkling as the shelf moves.
#define GRAIN_ON (uMip < 0.5 ? 1.0 : 0.0)
#define SPH_GF 310.0
#define SPH_GA 0.125
#define SPH_GK 1.0
#define INK_GF 520.0
#define INK_GA 0.16
float blob(vec2 s, vec2 o, vec2 w) { vec2 d = (s - o) / w; return exp(-dot(d, d)); }
vec3 motif(vec2 p, float t) {
  vec2 C = ic(0.4789, 0.5634); float R = 0.2499;
  float v = length((p - vec2(0.48, 0.5)) * vec2(1.0, 0.9));
  vec3 col = mix(uPal[0], uPal[1], smoothstep(0.1, 0.85, v));
  // contact shadow, cast to the left (light from the upper right), in sphere radii from its foot, y down: a
  // near-black core just under it, a warm penumbra reaching left (the gold's light on the paper), a faint wide falloff
  // (skipped where the sphere hides it and well above its foot, where every term is under 1e-5)
  vec2 s = vec2(p.x - C.x, C.y - R - p.y) / R;
  vec2 q = (p - C) / R;
  float rr = dot(q, q);
  if (rr > 0.95 && s.y > -1.2) {
    col *= 1.0 - vec3(0.9409, 0.9700, 0.9700) * blob(s, vec2(-0.0758, 0.0246), vec2(0.4078, 0.0757));
    col *= 1.0 - vec3(0.1923, 0.5800, 0.9617) * blob(s, vec2(-0.2017, 0.0214), vec2(0.9996, 0.1052));
    col *= 1.0 - vec3(0.1619, 0.4738, 0.8093) * blob(s, vec2(-0.1879, 0.1421), vec2(1.0000, 0.2123));
  }
  // the sphere, matte satin: a wrapped key from the upper right with a soft terminator, a dark core on the
  // left, light bounced up from the paper at the lower left, a lifted limb, a broad low sheen, and the
  // occlusion darkening it towards its foot (terms and colours fitted to the concept's sphere, in Lab)
  if (rr < 1.08) {
    vec3 n = vec3(q, sqrt(sat(1.0 - rr)));
    // alive, the key and its sheen swing a little about the vertical
    float sw = 0.3 * sin(t * 0.4);
    vec3 m = vec3(n.x * cos(sw) - n.z * sin(sw), n.y, n.x * sin(sw) + n.z * cos(sw));
    float key = pow(sat((dot(m, vec3(0.4419, 0.5516, 0.7074)) + 0.2885) / 1.2885), 2.9185);
    float bounce = pow(sat(dot(n, vec3(-0.3752, -0.8371, 0.3982))), 1.3779);
    float sheen = pow(sat(dot(m, vec3(0.4984, 0.6846, 0.5319))), 10.4132);
    vec3 g = vec3(-0.1931, -0.0919, 0.0022) + vec3(1.0784, 0.4034, 0.0205) * key + vec3(0.4774, 0.1352, 0.0035) * bounce
      + vec3(0.6279, 0.2096, 0.0007) * (1.0 - n.z) + vec3(-0.1709, 0.3627, 0.2973) * sheen
      + vec3(0.0007, -0.0098, -0.0049) * n.x + vec3(-0.0034, 0.0000, -0.0027) * n.y + vec3(-0.0032, 0.0228, -0.0068) * n.x * n.y
      // the paper's light caught on the lower-left limb
      + vec3(1.387, 0.510, 0.054) * pow(1.0 - n.z, 6.0) * sat(dot(n.xy, vec2(-0.4226, -0.9063)) / max(length(n.xy), 1e-4));
    g *= 1.0 - 1.0000 * exp(-(1.0 + n.y) / 0.1612);
    g = max(g, 0.0) * (1.0 + (vnoise(p * SPH_GF) - 0.5) * SPH_GA * (SPH_GK + key) * GRAIN_ON);
    col = mix(col, g, cover((sqrt(rr) - 1.0) * R));
  }
  return col;
}
vec3 goldInk(vec2 p) {
  float k = smoothstep(0.98, 0.72, p.y) + 0.25 * (fbm(p * 18.0) - 0.5);
  vec3 c = mix(uInk0, uInk1, sat(k));
  c *= 1.0 + (vnoise(p * INK_GF + 3.0) - 0.5) * INK_GA * GRAIN_ON;
  return c;
}
#define INK0(p, t) goldInk(p)`;

// Chairtax: the name itself is the artwork, Bearly (art/, drawn unaltered) leaning on "Chair" with his chin
// on his paw, the letters casting a soft shadow, and his navy office chair rolled out to the corner.
MOTIFS.chairtax = /* glsl */`
float lift(float t) { return 0.004 * (0.5 - 0.5 * cos(t * 2.0)); }
#define ART_DY(t) lift(t)
// a stroke tapering from radius r0 at a to r1 at b
float sdTaper(vec2 p, vec2 a, vec2 b, float r0, float r1) {
  vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - mix(r0, r1, h);
}
float sdBox(vec2 p, vec2 c, vec2 hs, float r) { vec2 q = abs(p - c) - hs + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
// a chair part: flat fill, a thin lit rim just inside its edge, and a dark outline
vec3 part(vec3 col, float d, vec3 fill) {
  col = mix(col, uPal[6], cover(d - 0.004));
  vec3 c = fill + (uPal[7] - fill) * 0.85 * ring(d + 0.0045, 0.0014);
  return mix(col, c, cover(d + 0.001));
}
float dBack(vec2 q) { return sdBox(rot(-0.10) * (q - vec2(0.985, 0.29)), vec2(0.0), vec2(0.068, 0.112), 0.028); }
float dSeat(vec2 q) { return sdBox(rot(0.14) * (q - vec2(0.925, 0.13)), vec2(0.0), vec2(0.11, 0.036), 0.034); }
float dPad(vec2 q) { return sdSeg(q, vec2(0.811, 0.262), vec2(0.876, 0.253)) - 0.017; }
float dPost(vec2 q) { return sdBox(q, vec2(0.84, 0.21), vec2(0.015, 0.032), 0.004); }
float dLegs(vec2 q) {
  vec2 hub = vec2(0.898, 0.07);
  return min(sdSeg(q, hub, vec2(0.80, 0.045)), sdSeg(q, hub, vec2(0.915, 0.012))) - 0.011;
}
float dLift(vec2 q) { return sdBox(q, vec2(0.898, 0.085), vec2(0.016, 0.022), 0.004); }
float dWheels(vec2 q) { return min(length(q - vec2(0.80, 0.043)), length(q - vec2(0.915, 0.012))) - 0.021; }
vec3 chair(vec3 col, vec2 p, float t) {
  // rolled out to the corner; alive, it rolls a few pixels and settles
  float roll = 0.008 * sin(t * 0.9) * (0.6 + 0.4 * cos(t * 0.45));
  vec2 q = p - vec2(roll, 0.0);
  vec2 sq = (q - vec2(0.9, 0.025)) / vec2(0.16, 0.022);
  col *= 1.0 - 0.5 * exp(-dot(sq, sq) * 1.5);                       // its shadow on the floor
  col = part(col, dBack(q), uPal[4]);
  col = part(col, dLegs(q), uPal[5]);
  col = part(col, dLift(q), uPal[5]);
  col = part(col, dWheels(q), uPal[5]);
  col = part(col, dSeat(q), uPal[4]);
  col = part(col, dPost(q), uPal[5]);
  return part(col, dPad(q), uPal[5]);
}
// the amber motion ticks; alive, they pulse
vec3 tick(vec3 col, vec2 p, vec2 a, vec2 b, float r0, float k) {
  // a and b are the tick's visible ends on the concept: the stroke's centre line stops a radius short of each
  vec2 u = normalize(b - a);
  a += u * r0; b -= u * 0.45 * r0;
  vec2 m = 0.5 * (a + b);
  float d = sdTaper(p, m + (a - m) * k, m + (b - m) * k, r0 * k, r0 * 0.45 * k);
  col += uPal[2] * 0.10 * falloff(d, 0.02);
  return mix(col, uPal[2], cover(d));
}
// halo and pool colours in linear light, measured on the concept (amber, more red than the ink)
const vec3 HALO = vec3(0.056, 0.021, 0.0), POOL = vec3(0.033, 0.010, 0.0);
// the type mask blurred on its coarse levels, four taps r apart
vec4 blurText(vec2 c, float r, float bias) {
  vec2 o = vec2(r, 0.0);
  return 0.25 * (texture2D(uText, c + o.xy, bias) + texture2D(uText, c - o.xy, bias) + texture2D(uText, c + o.yx, bias) + texture2D(uText, c - o.yx, bias));
}
vec3 motif(vec2 p, float t) {
  // the concept's flat ground, and the warm pool of light on the floor under "tax": a steep rise under the t,
  // a long tail out past the x (measured across the concept's floor)
  vec3 col = uPal[0];
  float px = p.x - 0.415, py = (p.y - ic(0.0, 0.899).y) / 0.0246;
  float hx = px < 0.0 ? exp(-0.5 * pow(-px / 0.2166, 4.0)) : 0.7 * exp(-0.5 * px * px / 0.01166) + 0.3 * exp(-0.5 * px * px / 0.1303);
  col += POOL * hx * exp(-0.5 * py * py);
  float type = 1.0 - uMode;
  // the letters' drop shadow, 0.032 right and 0.033 down, 14% dark
  vec4 g = blurText(p + vec2(-0.032, 0.033), 0.002, 3.5);
  col *= 1.0 - 0.14 * sat(g.r + g.g + g.b) * type;
  // the thin warm halo just outside every letter, lit from a little below; fainter round the amber letters,
  // brighter in the narrow gaps the concept lights from both sides (h-a, a-i, a-x) and under the x
  g = blurText(p + vec2(0.0, 0.004), 0.003, 3.5);
  vec2 g1 = (p - ic(0.518, 0.505)) / vec2(0.011, 0.08), g2 = (p - ic(0.711, 0.469)) / vec2(0.011, 0.09);
  vec2 g3 = (p - ic(0.574, 0.758)) / vec2(0.012, 0.07), g4 = (p - ic(0.679, 0.81)) / vec2(0.03, 0.025);
  vec2 g5 = (p - ic(0.62, 0.842)) / vec2(0.06, 0.018), c1 = (p - ic(0.05, 0.48)) / vec2(0.05, 0.15), c2 = (p - ic(0.18, 0.345)) / vec2(0.1, 0.025);
  float gap = 1.0 + 1.2 * exp(-0.5 * dot(g1, g1)) + 4.5 * exp(-0.5 * dot(g2, g2)) + 3.0 * exp(-0.5 * dot(g3, g3))
    + 3.0 * exp(-0.5 * dot(g4, g4)) + 6.0 * exp(-0.5 * dot(g5, g5));
  gap *= 1.0 - 0.8 * exp(-0.5 * dot(c1, c1)) - 0.6 * exp(-0.5 * dot(c2, c2));   // the C's left and top are nearly bare
  col += HALO * (0.85 * g.r + 0.45 * g.g) * gap * type;
  // contact shadows, over the halo too: a dark, sharp-edged band right under the t's foot, a softer one under the a
  vec2 ct = (p - ic(0.266, 0.8915)) / vec2(0.0616, 0.0067), ca = (p - ic(0.46, 0.872)) / vec2(0.08, 0.009);
  col *= 1.0 - (0.8 * exp(-0.5 * (ct.x * ct.x * ct.x * ct.x + ct.y * ct.y * ct.y * ct.y)) + 0.4 * exp(-0.5 * dot(ca, ca))) * type;
  float k = 1.0 + 0.12 * sin(t * 2.6);
  // thick end first, measured on the concept
  col = tick(col, p, ic(0.738, 0.083), ic(0.689, 0.152), 0.0127, k);
  col = tick(col, p, ic(0.801, 0.172), ic(0.726, 0.199), 0.0127, k);
  col = tick(col, p, ic(0.216, 0.196), ic(0.276, 0.225), 0.0110, k);
  col = tick(col, p, ic(0.204, 0.273), ic(0.265, 0.272), 0.0110, k);
  col = tick(col, p, ic(0.712, 0.870), ic(0.775, 0.893), 0.0101, k);
  col = tick(col, p, ic(0.664, 0.931), ic(0.758, 0.919), 0.0105, k);
  return chair(col, p, t);
}`;

// Stats: three rising bars of frosted glass, blue, green and amber, inside a thin glass orbit, on a cool white ground.
MOTIFS.stats = /* glsl */`
const float YF = 0.11, HW = 0.082, RB = 0.036;
// bar i: centre x and top (y up); every bar stands on the floor
vec2 bar(int i) { return i == 0 ? vec2(0.294, 0.426) : i == 1 ? vec2(0.508, 0.568) : vec2(0.727, 0.743); }
const vec2 SIDE = vec2(0.026, 0.004);   // the slab's back face, seen past its right side and top
float sdRB(vec2 o, vec2 b, float r) { vec2 q = abs(o) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
vec3 ground(vec2 p) {
  // cool white, brightest behind the bars, falling to blue-grey at the corners and toward the floor
  vec3 col = mix(uPal[0], uPal[1], smoothstep(0.1, 0.95, length((p - vec2(0.58, 0.55)) * vec2(0.85, 1.0))));
  col = mix(col, uPal[1] * 0.93, 0.5 * smoothstep(0.45, 0.0, p.y));
  float fl = smoothstep(YF + 0.01, YF - 0.03, p.y);
  return mix(col, mix(uPal[6], uPal[1], smoothstep(0.0, 0.11, YF - p.y)), 0.7 * fl);
}
// one bar's front face: frosted glass lit from inside, paler at its rims, a bright rim just inside the edge
vec3 face(vec2 p, vec2 c, vec2 hs, vec3 tint, float t, float d) {
  vec2 o = p - c; float e = 0.0015;
  vec2 gr = vec2(sdRB(o + vec2(e, 0.0), hs, RB) - sdRB(o - vec2(e, 0.0), hs, RB),
                 sdRB(o + vec2(0.0, e), hs, RB) - sdRB(o - vec2(0.0, e), hs, RB)) / (2.0 * e);
  float di = max(-d, 0.0), uu = sat(di / 0.022);
  float sl = (1.0 - uu) / max(sqrt(1.0 - (1.0 - uu) * (1.0 - uu)), 0.2);
  vec3 n = normalize(vec3(gr * sl * 0.8, 1.0));
  // the colour is deepest in the middle of the face and paler toward every rim, most toward the floor
  float up = p.y - YF, dn = c.y + hs.y - p.y;
  float a = smoothstep(0.0, 0.05, di) * smoothstep(0.0, 0.2, up) * smoothstep(0.0, 0.06, dn);
  a *= (0.8 + 0.2 * exp(-pow(o.x / hs.x, 2.0))) * (0.6 + 0.4 * smoothstep(0.05, 0.55, (p.y - YF) / (2.0 * hs.y)));
  vec3 lite = min(tint * 1.9 + 0.1, 1.0);                               // the same hue, lit through thinner glass
  vec3 body = mix(lite, tint, a);
  body = mix(body, vec3(1.0), 0.42 * smoothstep(0.012, 0.0, di));      // frosted rim, lit through
  body = mix(body, uPal[5], sat(pow(1.0 - n.z, 2.0) * 0.85));           // the room on the bevels
  body += vec3(1.0) * 0.4 * ring(d + 0.0055, 0.0014);
  vec3 L = normalize(vec3(-0.5, 0.6, 0.62));
  body += vec3(1.0) * 0.45 * spec(n, L, 40.0);
  // caustics: bright threads drifting through the glass when alive
  float cz = sin(dot(p, vec2(21.0, 8.0)) + 2.2 * sin(dot(p, vec2(-6.0, 13.0)) + t * 0.6) + 4.0 * n.x - t * 0.9);
  body += mix(tint, vec3(1.0), 0.75) * 0.05 * pow(1.0 - abs(cz), 3.0) * smoothstep(0.0, 0.04, di) * (0.4 + 0.6 * a);
  return body;
}
vec3 slab(vec3 col, vec2 p, int i, float t) {
  vec2 b = bar(i);
  vec2 hs = vec2(HW, 0.5 * (b.y - YF)), c = vec2(b.x, 0.5 * (b.y + YF));
  vec3 tint = uPal[2 + i];
  float d = sdRB(p - c, hs, RB), ds = sdRB(p - c - SIDE, hs, RB);
  col += tint * 0.12 * falloff(min(d, ds), 0.07) + vec3(1.0) * 0.35 * falloff(min(d, ds), 0.014);
  // the side: paler, clearer glass with its own lit edge
  if (ds < AAW) {
    vec3 side = mix(mix(tint, uPal[5], 0.7), vec3(1.0), 0.25 * smoothstep(-0.012, 0.0, ds)) + vec3(1.0) * 0.35 * ring(ds + 0.003, 0.0012);
    col = mix(col, side, cover(ds));
  }
  return d < AAW ? mix(col, face(p, c, hs, tint, t, d), cover(d)) : col;
}
vec3 orbit(vec3 col, vec2 p, float t, bool front) {
  vec2 o = rot(-0.384) * (p - vec2(0.511, 0.428));
  vec2 ab = vec2(0.50, 0.152);
  float d = sdEllipse(o, ab);
  float k = smoothstep(-0.008, 0.008, front ? -o.y : o.y);
  float w = 0.0064, x = sat(abs(d) / w);
  float ang = atan(o.y / ab.y, o.x / ab.x);
  float sweep = pow(0.5 + 0.5 * sin(ang - t * 0.7 + 2.2), 3.0);
  vec3 tube = mix(col, uPal[5], 0.3) + 0.02;
  tube += vec3(1.0) * 0.36 * pow(x, 4.0);
  tube += vec3(1.0) * 0.40 * exp(-pow((d + w * 0.3) / (w * 0.22), 2.0)) * (0.25 + 0.75 * sweep);
  col = mix(col, tube, ring(d, w) * k);
  return col + uPal[5] * 0.06 * exp(-abs(d) / 0.01) * k;
}
vec3 motif(vec2 p, float t) {
  vec3 col = ground(p);
  if (p.y < YF) {
    // the bars mirrored in the floor, and the coloured light they pool on it
    float dz = YF - p.y;
    vec2 pm = vec2(p.x, 2.0 * YF - p.y);
    for (int i = 0; i < 3; i++) {
      vec2 b = bar(i);
      vec2 hs = vec2(HW, 0.5 * (b.y - YF)), c = vec2(b.x, 0.5 * (b.y + YF));
      float dm = sdRB(pm - c, hs, RB), bl = 0.002 + dz * 0.15;
      col = mix(col, mix(uPal[2 + i], uPal[5], 0.4), smoothstep(bl, -bl, dm) * exp(-dz / 0.05) * 0.7);
      col += mix(uPal[2 + i], vec3(1.0), 0.3) * 0.14 * exp(-pow((p.x - b.x) / 0.1, 2.0)) * exp(-dz / 0.05);
    }
  }
  col = orbit(col, p, t, false);
  for (int i = 0; i < 3; i++) col = slab(col, p, i, t);
  return orbit(col, p, t, true);
}`;

// ---------- designs ----------
// Layout is in 1024-unit space with y down (canvas space).
// pal: up to eight sRGB colours the motif indexes as uPal[i].
// type: title blocks; each line goes to channel ch of the type mask (R, G, B -> INK0..2).
//   size by cap (cap height), fit (widest line's ink width) or px; x/base place the first line.
//   set: [[glyph, cx, cy, px, degrees, ch], ...] places each glyph by its ink centre.
//   runs: [[text, ch], ...] sets a one-line block in several inks.
//   paths: a letters/*.json file of traced letter outlines ({ ch, d } in 1024 units), drawn in place of set type.
// inks: sRGB colour per type channel, used when the motif does not fill it itself.
// mark: where the logo is drawn unaltered, [x, top, size].
// art: brand artwork drawn unaltered over the motif and under the type, at its own pixel size on a 1024
//   front: { src (beside this module), x, top, fade }; fade (px) softens a crop edge at its foot that the
//   type covers. A motif may lift it with ART_DY(t) (cover units).
// typeGlow: the type mask carries mips, so the motif can read it blurred (a glow or a shadow around the type).
// shaderMips: the shader draws the front's mip levels itself, each filtered at its own sampling rate; a number n
//   draws levels 1..n only, and the levels below keep the box filter's.
// form: the logo (or, fromType, the front's own type; or svg, a shape drawn for the cover) inflated into the motif's
//   hero form: box [x, top, size], R bevel radius, soft blur (both cover units), key 'alpha' | 'tile' (tile: drop
//   pixels near the tile colour).
// keys: { list of [x, y, r, g, b], starts, sigma }: colour keys the motif reads from uKeys.
// ground: the colour the resting cover reads as; a flat stand-in for a late cover (sRGB). For most covers it is the
//   area-weighted mean in linear light of the motif's ground; a cover whose ground is mostly covered or split takes
//   the field it reads as.
// back: paper, ink (name, values), soft (labels, stack), accent (rules, link).
// bandY: centre of the band of art shown across the top of the back (bandH tall, 0.3 by default); strip: where that band comes from,
//   'front' (a crop of the finished front, for bands with no type in them), 'art' (the motif without its
//   type) or 'fill' (the title's own fill across the band). No band may cut through type.
// t0: the moment the still cover shows; alive time runs on from it.

// each face's colour keys: [x, y (cover units, y up), r, g, b (sRGB)], fitted to the concept by least squares (the
// faces in order: the s's top arm and its turned side, the first t, the e and its bar, the last t and its ascender's fold)
const STET_KEYS = [
  [0.0713, 0.7021, 0.827, 0.876, 0.842], [0.1186, 0.7021, 0.859, 0.902, 0.876], [0.1659, 0.7021, 0.911, 0.918, 0.870], [0.2132, 0.7021, 0.941, 0.933, 0.878],
  [0.2605, 0.7021, 0.974, 0.956, 0.918], [0.3078, 0.7021, 0.874, 0.890, 0.833], [0.0713, 0.6520, 0.799, 0.891, 0.871], [0.1186, 0.6520, 0.794, 0.856, 0.824],
  [0.1659, 0.6520, 0.926, 0.942, 0.915], [0.2132, 0.6520, 0.970, 0.944, 0.890], [0.2605, 0.6520, 0.949, 0.931, 0.883], [0.3078, 0.6520, 0.994, 0.964, 0.921],
  [0.0713, 0.6020, 0.778, 0.890, 0.864], [0.1186, 0.6020, 0.764, 0.886, 0.883], [0.1659, 0.6020, 0.832, 0.852, 0.795], [0.2132, 0.6020, 0.885, 0.894, 0.846],
  [0.2605, 0.6020, 0.981, 0.959, 0.918], [0.3078, 0.6020, 0.903, 0.910, 0.852], [0.0409, 0.6513, 0.525, 0.782, 0.771], [0.0899, 0.6513, 0.784, 0.817, 0.747],
  [0.1388, 0.6513, 0.791, 0.819, 0.745], [0.1877, 0.6513, 0.792, 0.820, 0.745], [0.2367, 0.6513, 0.792, 0.820, 0.745], [0.2856, 0.6513, 0.792, 0.820, 0.745],
  [0.3345, 0.6513, 0.792, 0.820, 0.745], [0.0409, 0.6059, 0.384, 0.710, 0.717], [0.0899, 0.6059, 0.381, 0.699, 0.699], [0.1388, 0.6059, 0.736, 0.797, 0.734],
  [0.1877, 0.6059, 0.785, 0.816, 0.743], [0.2367, 0.6059, 0.792, 0.820, 0.745], [0.2856, 0.6059, 0.792, 0.820, 0.745], [0.3345, 0.6059, 0.792, 0.820, 0.745],
  [0.0409, 0.5605, 0.243, 0.638, 0.647], [0.0899, 0.5605, 0.248, 0.589, 0.590], [0.1388, 0.5605, 0.145, 0.571, 0.600], [0.1877, 0.5605, 0.352, 0.653, 0.670],
  [0.2367, 0.5605, 0.796, 0.844, 0.808], [0.2856, 0.5605, 0.799, 0.826, 0.755], [0.3345, 0.5605, 0.793, 0.820, 0.746], [0.0409, 0.5152, 0.368, 0.657, 0.640],
  [0.0899, 0.5152, 0.187, 0.645, 0.674], [0.1388, 0.5152, 0.430, 0.709, 0.688], [0.1877, 0.5152, 0.563, 0.777, 0.754], [0.2367, 0.5152, 0.871, 0.900, 0.881],
  [0.2856, 0.5152, 0.986, 0.968, 0.939], [0.3345, 0.5152, 0.827, 0.846, 0.777], [0.0409, 0.4698, 0.589, 0.644, 0.592], [0.0899, 0.4698, 0.461, 0.642, 0.631],
  [0.1388, 0.4698, 0.462, 0.780, 0.813], [0.1877, 0.4698, 0.911, 0.913, 0.902], [0.2367, 0.4698, 0.887, 0.899, 0.836], [0.2856, 0.4698, 0.985, 0.959, 0.902],
  [0.3345, 0.4698, 0.945, 0.939, 0.906], [0.0409, 0.4244, 0.544, 0.319, 0.062], [0.0899, 0.4244, 0.669, 0.243, 0.000], [0.1388, 0.4244, 0.845, 0.757, 0.578],
  [0.1877, 0.4244, 0.849, 0.861, 0.801], [0.2367, 0.4244, 1.000, 0.995, 0.954], [0.2856, 0.4244, 0.883, 0.880, 0.835], [0.3345, 0.4244, 1.000, 0.990, 0.928],
  [0.0409, 0.3790, 0.926, 0.630, 0.271], [0.0899, 0.3790, 1.000, 0.682, 0.271], [0.1388, 0.3790, 0.984, 0.709, 0.365], [0.1877, 0.3790, 0.905, 0.951, 0.973],
  [0.2367, 0.3790, 0.867, 0.868, 0.798], [0.2856, 0.3790, 1.000, 1.000, 0.950], [0.3345, 0.3790, 0.675, 0.763, 0.750], [0.0409, 0.3336, 0.907, 0.587, 0.163],
  [0.0899, 0.3336, 0.944, 0.686, 0.386], [0.1388, 0.3336, 0.945, 0.844, 0.718], [0.1877, 0.3336, 1.000, 0.945, 0.831], [0.2367, 0.3336, 0.959, 0.953, 0.919],
  [0.2856, 0.3336, 0.725, 0.798, 0.778], [0.3345, 0.3336, 0.536, 0.680, 0.675], [0.0409, 0.2883, 0.874, 0.861, 0.748], [0.0899, 0.2883, 0.984, 0.863, 0.709],
  [0.1388, 0.2883, 0.968, 0.914, 0.816], [0.1877, 0.2883, 0.853, 0.879, 0.852], [0.2367, 0.2883, 0.666, 0.746, 0.730], [0.2856, 0.2883, 0.438, 0.624, 0.624],
  [0.3345, 0.2883, 0.775, 0.809, 0.741], [0.3755, 0.8063, 0.746, 0.841, 0.819], [0.4267, 0.8063, 1.000, 0.996, 0.936], [0.4780, 0.8063, 0.734, 0.828, 0.798],
  [0.3755, 0.7596, 0.990, 0.955, 0.905], [0.4267, 0.7596, 1.000, 0.965, 0.913], [0.4780, 0.7596, 0.759, 0.842, 0.811], [0.3755, 0.7129, 0.927, 0.924, 0.879],
  [0.4267, 0.7129, 0.956, 0.938, 0.887], [0.4780, 0.7129, 0.972, 0.958, 0.912], [0.3755, 0.6662, 0.966, 0.946, 0.897], [0.4267, 0.6662, 0.964, 0.931, 0.891],
  [0.4780, 0.6662, 0.992, 0.952, 0.896], [0.3755, 0.6195, 0.934, 0.921, 0.869], [0.4267, 0.6195, 0.977, 0.953, 0.902], [0.4780, 0.6195, 0.848, 0.887, 0.851],
  [0.3755, 0.5728, 0.812, 0.872, 0.848], [0.4267, 0.5728, 1.000, 0.981, 0.918], [0.4780, 0.5728, 0.734, 0.831, 0.807], [0.3755, 0.5261, 0.662, 0.790, 0.775],
  [0.4267, 0.5261, 1.000, 0.997, 0.947], [0.4780, 0.5261, 0.723, 0.825, 0.800], [0.3755, 0.4794, 0.391, 0.685, 0.687], [0.4267, 0.4794, 1.000, 0.969, 0.930],
  [0.4780, 0.4794, 0.720, 0.816, 0.792], [0.3755, 0.4327, 0.125, 0.501, 0.509], [0.4267, 0.4327, 0.834, 0.949, 0.920], [0.4780, 0.4327, 0.738, 0.812, 0.792],
  [0.3755, 0.3860, 0.076, 0.433, 0.463], [0.4267, 0.3860, 0.468, 0.775, 0.770], [0.4780, 0.3860, 0.927, 0.872, 0.842], [0.3755, 0.3393, 0.000, 0.323, 0.336],
  [0.4267, 0.3393, 0.194, 0.619, 0.630], [0.4780, 0.3393, 0.759, 0.890, 0.860], [0.3755, 0.2926, 0.287, 0.547, 0.571], [0.4267, 0.2926, 0.000, 0.417, 0.444],
  [0.4780, 0.2926, 0.272, 0.649, 0.648], [0.5238, 0.7024, 0.802, 0.753, 0.618], [0.5714, 0.7024, 0.851, 0.451, 0.175], [0.6190, 0.7024, 0.884, 0.473, 0.189],
  [0.6667, 0.7024, 0.923, 0.521, 0.148], [0.7143, 0.7024, 0.975, 0.874, 0.755], [0.7619, 0.7024, 0.948, 0.950, 0.914], [0.8095, 0.7024, 0.812, 0.787, 0.671],
  [0.5238, 0.6566, 0.826, 0.456, 0.173], [0.5714, 0.6566, 0.896, 0.412, 0.107], [0.6190, 0.6566, 0.936, 0.505, 0.131], [0.6667, 0.6566, 1.000, 0.878, 0.726],
  [0.7143, 0.6566, 0.944, 0.964, 0.928], [0.7619, 0.6566, 0.997, 0.962, 0.904], [0.8095, 0.6566, 0.939, 0.945, 0.921], [0.5238, 0.6108, 0.947, 0.586, 0.262],
  [0.5714, 0.6108, 0.947, 0.606, 0.278], [0.6190, 0.6108, 1.000, 0.781, 0.545], [0.6667, 0.6108, 0.851, 0.856, 0.776], [0.7143, 0.6108, 0.980, 0.970, 0.933],
  [0.7619, 0.6108, 0.941, 0.895, 0.841], [0.8095, 0.6108, 0.978, 0.952, 0.884], [0.5238, 0.5650, 0.949, 0.767, 0.579], [0.5714, 0.5650, 0.973, 0.767, 0.561],
  [0.6190, 0.5650, 0.964, 0.922, 0.852], [0.6667, 0.5650, 0.803, 0.777, 0.654], [0.7143, 0.5650, 0.855, 0.845, 0.762], [0.7619, 0.5650, 1.000, 1.000, 1.000],
  [0.8095, 0.5650, 0.828, 0.875, 0.851], [0.5238, 0.5192, 0.953, 0.864, 0.746], [0.5714, 0.5192, 1.000, 0.965, 0.890], [0.6190, 0.5192, 0.901, 0.946, 0.934],
  [0.6667, 0.5192, 0.802, 0.776, 0.653], [0.7143, 0.5192, 0.803, 0.777, 0.655], [0.7619, 0.5192, 0.807, 0.784, 0.667], [0.8095, 0.5192, 0.794, 0.775, 0.661],
  [0.5238, 0.4734, 0.951, 0.953, 0.909], [0.5714, 0.4734, 0.961, 0.941, 0.910], [0.6190, 0.4734, 0.836, 0.889, 0.846], [0.6667, 0.4734, 0.801, 0.775, 0.652],
  [0.7143, 0.4734, 0.801, 0.774, 0.650], [0.7619, 0.4734, 0.799, 0.772, 0.648], [0.8095, 0.4734, 0.798, 0.772, 0.649], [0.5238, 0.4277, 0.939, 0.922, 0.878],
  [0.5714, 0.4277, 0.736, 0.863, 0.855], [0.6190, 0.4277, 0.694, 0.814, 0.768], [0.6667, 0.4277, 0.800, 0.774, 0.651], [0.7143, 0.4277, 0.773, 0.722, 0.565],
  [0.7619, 0.4277, 0.449, 0.354, 0.161], [0.8095, 0.4277, 0.316, 0.347, 0.309], [0.5238, 0.3819, 0.819, 0.904, 0.894], [0.5714, 0.3819, 0.553, 0.766, 0.730],
  [0.6190, 0.3819, 0.178, 0.663, 0.708], [0.6667, 0.3819, 0.818, 0.814, 0.696], [0.7143, 0.3819, 0.917, 0.674, 0.268], [0.7619, 0.3819, 0.819, 0.628, 0.271],
  [0.8095, 0.3819, 0.574, 0.448, 0.183], [0.5238, 0.3361, 0.581, 0.777, 0.759], [0.5714, 0.3361, 0.305, 0.701, 0.715], [0.6190, 0.3361, 0.234, 0.651, 0.655],
  [0.6667, 0.3361, 0.820, 0.834, 0.695], [0.7143, 0.3361, 0.970, 0.749, 0.388], [0.7619, 0.3361, 0.882, 0.706, 0.381], [0.8095, 0.3361, 0.929, 0.709, 0.330],
  [0.5238, 0.2903, 0.778, 0.772, 0.658], [0.5714, 0.2903, 0.247, 0.654, 0.659], [0.6190, 0.2903, 0.443, 0.758, 0.755], [0.6667, 0.2903, 0.751, 0.780, 0.676],
  [0.7143, 0.2903, 0.919, 0.775, 0.485], [0.7619, 0.2903, 0.939, 0.736, 0.371], [0.8095, 0.2903, 0.803, 0.769, 0.634], [0.6240, 0.5408, 0.113, 0.472, 0.486],
  [0.6705, 0.5408, 0.638, 0.853, 0.833], [0.7170, 0.5408, 0.956, 0.915, 0.874], [0.7636, 0.5408, 1.000, 1.000, 0.943], [0.8101, 0.5408, 0.840, 0.873, 0.844],
  [0.6240, 0.4904, 0.072, 0.469, 0.482], [0.6705, 0.4904, 0.672, 0.850, 0.840], [0.7170, 0.4904, 0.941, 0.915, 0.869], [0.7636, 0.4904, 0.867, 0.904, 0.864],
  [0.8101, 0.4904, 0.587, 0.733, 0.722], [0.8493, 0.8240, 0.891, 0.755, 0.592], [0.8811, 0.8240, 0.893, 0.766, 0.583], [0.9130, 0.8240, 0.921, 0.751, 0.382],
  [0.9449, 0.8240, 0.922, 0.752, 0.489], [0.9767, 0.8240, 0.891, 0.755, 0.592], [0.8493, 0.7906, 0.897, 0.763, 0.592], [0.8811, 0.7906, 0.942, 0.756, 0.366],
  [0.9130, 0.7906, 0.909, 0.719, 0.401], [0.9449, 0.7906, 0.963, 0.823, 0.606], [0.9767, 0.7906, 0.891, 0.756, 0.593], [0.8493, 0.7572, 0.908, 0.779, 0.610],
  [0.8811, 0.7572, 0.972, 0.820, 0.544], [0.9130, 0.7572, 0.930, 0.785, 0.503], [0.9449, 0.7572, 0.972, 0.870, 0.721], [0.9767, 0.7572, 0.891, 0.758, 0.598],
  [0.8493, 0.7238, 0.905, 0.773, 0.607], [0.8811, 0.7238, 0.947, 0.840, 0.617], [0.9130, 0.7238, 0.948, 0.842, 0.683], [0.9449, 0.7238, 0.966, 0.967, 0.886],
  [0.9767, 0.7238, 0.947, 0.962, 0.936], [0.8493, 0.6904, 0.900, 0.769, 0.605], [0.8811, 0.6904, 0.962, 0.879, 0.703], [0.9130, 0.6904, 0.943, 0.884, 0.766],
  [0.9449, 0.6904, 0.953, 0.901, 0.806], [0.9767, 0.6904, 0.955, 0.912, 0.830], [0.8493, 0.6570, 0.928, 0.861, 0.729], [0.8811, 0.6570, 0.960, 0.909, 0.809],
  [0.9130, 0.6570, 0.970, 0.925, 0.826], [0.9449, 0.6570, 0.960, 0.938, 0.873], [0.9767, 0.6570, 0.969, 0.981, 0.956], [0.8493, 0.6236, 0.947, 0.924, 0.837],
  [0.8811, 0.6236, 0.941, 0.899, 0.789], [0.9130, 0.6236, 0.971, 0.941, 0.870], [0.9449, 0.6236, 0.948, 0.942, 0.906], [0.9767, 0.6236, 0.905, 0.803, 0.673],
  [0.8493, 0.5902, 0.924, 0.903, 0.843], [0.8811, 0.5902, 0.977, 0.938, 0.854], [0.9130, 0.5902, 0.950, 0.940, 0.889], [0.9449, 0.5902, 0.955, 0.923, 0.847],
  [0.9767, 0.5902, 0.891, 0.757, 0.595], [0.8493, 0.5568, 0.681, 0.721, 0.685], [0.8811, 0.5568, 1.000, 1.000, 0.990], [0.9130, 0.5568, 0.865, 0.861, 0.833],
  [0.9449, 0.5568, 1.000, 1.000, 0.926], [0.9767, 0.5568, 0.891, 0.757, 0.595], [0.8493, 0.5234, 0.488, 0.582, 0.546], [0.8811, 0.5234, 1.000, 1.000, 0.991],
  [0.9130, 0.5234, 0.824, 0.859, 0.826], [0.9449, 0.5234, 1.000, 1.000, 0.942], [0.9767, 0.5234, 0.891, 0.756, 0.595], [0.8493, 0.4900, 0.419, 0.487, 0.444],
  [0.8811, 0.4900, 1.000, 1.000, 0.931], [0.9130, 0.4900, 0.835, 0.861, 0.822], [0.9449, 0.4900, 1.000, 1.000, 0.957], [0.9767, 0.4900, 0.891, 0.757, 0.595],
  [0.8493, 0.4566, 0.496, 0.495, 0.420], [0.8811, 0.4566, 1.000, 0.928, 0.811], [0.9130, 0.4566, 0.901, 0.858, 0.762], [0.9449, 0.4566, 1.000, 1.000, 0.973],
  [0.9767, 0.4566, 0.891, 0.757, 0.595], [0.8493, 0.4232, 0.441, 0.345, 0.211], [0.8811, 0.4232, 1.000, 0.807, 0.574], [0.9130, 0.4232, 0.955, 0.841, 0.728],
  [0.9449, 0.4232, 0.958, 0.877, 0.767], [0.9767, 0.4232, 0.891, 0.756, 0.594], [0.8493, 0.3898, 0.590, 0.420, 0.268], [0.8811, 0.3898, 0.950, 0.599, 0.306],
  [0.9130, 0.3898, 0.929, 0.658, 0.411], [0.9449, 0.3898, 1.000, 0.837, 0.650], [0.9767, 0.3898, 0.895, 0.735, 0.563], [0.8493, 0.3564, 0.498, 0.274, 0.121],
  [0.8811, 0.3564, 0.915, 0.543, 0.256], [0.9130, 0.3564, 0.930, 0.550, 0.246], [0.9449, 0.3564, 0.975, 0.630, 0.301], [0.9767, 0.3564, 0.951, 0.552, 0.243],
  [0.8493, 0.3230, 0.787, 0.591, 0.417], [0.8811, 0.3230, 0.737, 0.264, 0.000], [0.9130, 0.3230, 0.893, 0.533, 0.261], [0.9449, 0.3230, 0.897, 0.481, 0.180],
  [0.9767, 0.3230, 0.878, 0.501, 0.210], [0.8493, 0.2896, 0.889, 0.751, 0.587], [0.8811, 0.2896, 0.840, 0.587, 0.357], [0.9130, 0.2896, 0.813, 0.380, 0.099],
  [0.9449, 0.2896, 0.862, 0.478, 0.184], [0.9767, 0.2896, 0.855, 0.445, 0.163], [0.8448, 0.7742, 0.613, 0.553, 0.333], [0.8640, 0.7742, 0.386, 0.367, 0.206],
  [0.8448, 0.7401, 0.748, 0.618, 0.349], [0.8640, 0.7401, 0.809, 0.680, 0.395], [0.8448, 0.7060, 0.864, 0.760, 0.541], [0.8640, 0.7060, 0.837, 0.727, 0.484],
  [0.8448, 0.6720, 0.888, 0.821, 0.678], [0.8640, 0.6720, 0.940, 0.851, 0.684], [0.8448, 0.6379, 0.919, 0.859, 0.730], [0.8640, 0.6379, 0.913, 0.847, 0.719],
];
const STET_KEY_STARTS = [0, 18, 81, 117, 187, 197, 282, 292];
const STET_KEY_SIGMA = [0.0426, 0.0416, 0.0436, 0.0405, 0.0428, 0.0284, 0.0290];

// Topshine's star outline, and its colour fields decoded into keys (row 1 of uKeys: linear rgb per control)
const TOPSHINE_STAR = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="178 98 700 700"><path fill="#fff" d="M527.2 109.7C619.3 397.3 663.0 402.2 841.1 449.6C643.2 495.5 560.6 605.5 528.1 785.8C503.9 646.5 405.5 455.2 214.1 448.7C433.3 384.7 466.4 355.1 527.2 109.7Z"/></svg>';
// TOPSHINE's fields decoded into keys (linear rgb per control); the codec is described with TOPSHINE
let topshineKeyList = null;
function topshineKeys() {
  if (!topshineKeyList) {
    const { blocks, alpha, data, chroma } = TOPSHINE, list = [];
    let i = 0;
    const sym = off => {
      const ch = data[i++];
      if (ch !== '~') return alpha.indexOf(ch) - off;
      const v = alpha.indexOf(data[i]) * 63 + alpha.indexOf(data[i + 1]);
      i += 2;
      return off ? v - 1984 : v;
    };
    for (const [, n, lg, ld, lb, step] of blocks) {
      const used = new Uint8Array(n * n);
      const runs = sym(0);
      for (let r = 0, k = 0; r < runs; r++) { const len = sym(0); if (r % 2) used.fill(1, k, k + len); k += len; }
      const X = [new Float32Array(n * n), new Float32Array(n * n), new Float32Array(n * n)];
      X.forEach((a, c) => {
        let last = 0;
        for (let k = 0; k < n * n; k++) {
          if (!used[k]) continue;
          const x = k % n, p = x && used[k - 1] ? a[k - 1] : k >= n && used[k - n] ? a[k - n] : last;
          a[k] = last = p + sym(31);
        }
      });
      // controls the fit left out take the mean of their used neighbours, one ring at a time
      const rgb = new Float32Array(n * n * 3), done = used.slice();
      for (let k = 0; k < n * n; k++) if (used[k]) {
        const g = lg + X[0][k] * step;
        rgb.set([ld + X[1][k] * step * chroma + g, g, lb + X[2][k] * step * chroma + g], k * 3);
      }
      for (let left = n * n - used.reduce((a, v) => a + v, 0), was = -1; left > 0 && left !== was;) {
        const now = done.slice();
        was = left;
        for (let k = 0; k < n * n; k++) {
          if (done[k]) continue;
          const x = k % n, y = (k - x) / n, acc = [0, 0, 0];
          let m = 0;
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
            const xx = x + dx, yy = y + dy, j = yy * n + xx;
            if ((dx || dy) && xx >= 0 && yy >= 0 && xx < n && yy < n && done[j]) { for (let c = 0; c < 3; c++) acc[c] += rgb[j * 3 + c]; m++; }
          }
          if (m) { rgb.set(acc.map(v => v / m), k * 3); now[k] = 1; left--; }
        }
        done.set(now);
      }
      for (let k = 0; k < n * n; k++) list.push([0, 0, rgb[k * 3], rgb[k * 3 + 1], rgb[k * 3 + 2]]);
    }
    topshineKeyList = { list, starts: [0, list.length], sigma: [0] };
  }
  return topshineKeyList;
}
function designFor(entry) {
  switch (entry.name) {
    case 'Mirra': return {
      motif: 'mirra', t0: 0,
      pal: ['#2E78CC', '#6AAAE6', '#B3D6F4', '#E3F1FD', '#C9DFF5', '#8CC0EE'],
      ground: '#8BB7E7',
      type: [{ lines: ['Mirra'], font: 'NJ Text', weight: 900, track: -0.035, cap: 198, x: 56, base: 247, ch: 0 }],
      inks: ['#FFFFFF'],
      mark: [858, 864, 116],
      form: { box: [125, 180, 730], R: 0.019, soft: 0.003, key: 'tile', ink: [255, 255, 255] },
      bandY: 0.46, grain: [0.012, 0.010],
      back: { paper: '#EEF6FD', ink: '#123E78', soft: '#4F6E92', accent: '#2C7AC2' },
    };
    case 'stet': return {
      motif: 'stet', t0: 0,
      pal: ['#072529', '#051D21'],
      ground: '#072327',
      // the concept's own letters, traced (letters/stet.json; the first t on channel 0, the s and the joined e and t on 1)
      type: [{ paths: 'letters/stet.json' }],
      inks: ['#F1E8D6', '#F1E8D6'],
      mark: [30, 26, 142],
      keys: { list: STET_KEYS, starts: STET_KEY_STARTS, sigma: STET_KEY_SIGMA },
      typeGlow: true,
      bandY: 0.48, strip: 'fill', grain: [0.03, 0.012],
      back: { paper: '#0D2A2C', ink: '#F3EBDB', soft: '#9BBDBB', accent: '#E9B85E' },
    };
    case 'Social Hook': return {
      motif: 'hook', t0: 0,
      pal: [],   // its fields' colours live in the motif
      ground: '#427FED',   // its field's mean blue, without the letters and the mark
      // the concept's own letters, traced (letters/social-hook.json)
      type: [{ paths: 'letters/social-hook.json' }],
      inks: ['#FFFFFF'],
      mark: [50, 868, 121],
      bandY: 0.32, grain: [0.012, 0.010],
      back: { paper: '#2563EB', ink: '#FFFFFF', soft: '#CFE0FF', accent: '#FFFFFF' },
    };
    case 'Clauded': return {
      motif: 'clauded', t0: 0,
      pal: ['#073B3E', '#0E5C5E', '#0D6566', '#5FE3D6', '#B8FFF6', '#FFFFFF'],
      ground: '#0B4E50',
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
      ground: '#1E4A38',   // its green field
      type: [
        { lines: ['Like'], font: 'NJ Text', weight: 800, track: -0.02, cap: 302, x: 50, base: 482, ch: 0 },
        { lines: ['Wiki'], font: 'NJ Text', weight: 800, track: -0.02, cap: 302, x: 50, base: 852, ch: 1 },
      ],
      inks: ['#1E4A38', '#F3EFE6'],
      mark: [852, 38, 120],
      bandY: 0.5, strip: 'art', grain: [0.03, 0.016],
      back: { paper: '#F2EEE6', ink: '#1E4A38', soft: '#5E7A6C', accent: '#2F5D50' },
    };
    case 'Topshine': return {
      motif: 'topshine', t0: 0,
      pal: [],   // its colours are its fitted fields (TOPSHINE)
      ground: '#D3D0F9',   // the lavender room, without the star, orbs and type
      // each letter placed on its concept letter by its ink centre: [glyph, cx, cy, px, degrees, ink]
      type: [{ font: 'NJ Hanken', weight: 600, set: [['t', 72.3, 892.9, 130.4, 0, 0], ['o', 131.1, 902.7, 135.3, 0, 0], ['p', 204.3, 916.1, 133.9, 0, 0],
        ['s', 268.5, 904.5, 130, 0, 0], ['h', 333.6, 890.2, 136.3, 0, 0], ['i', 381.8, 889.3, 130.2, 0, 0], ['n', 429, 903.6, 137.7, 0, 0],
        ['e', 497.7, 902.7, 134.1, 0, 0]] }],
      inks: ['#0C1229'],
      mark: [53.8, 54.9, 113.3],
      // the concept's star (the mark's star drawn fuller, as the concept renders it), in cover px
      form: { box: [178, 98, 700], R: 0.1, soft: 0.005, key: 'alpha', res: 640, svg: TOPSHINE_STAR },
      keys: topshineKeys(),
      bandY: 0.55, grain: [0.010, 0.008],
      back: { paper: '#F5F2FF', ink: '#0F1030', soft: '#5E5A86', accent: '#6C44F0' },
    };
    case 'Scorecard': return {
      motif: 'scorecard', t0: 0,
      pal: ['#0F1B3D', '#1F5DD8', '#2A6BE3', '#14916F', '#0E7458', '#F6C21C', '#F24A1D', '#F7872E'],
      ground: '#101D37',   // its navy field
      // each letter placed on its concept letter by its ink centre: [glyph, cx, cy, px, degrees, ink]
      // the concept's own letters, traced (letters/scorecard.json); those that touch in the concept stay one outline
      type: [{ paths: 'letters/scorecard.json' }],
      inks: ['#FCFAF6'],
      bandY: 0.5, grain: [0.02, 0.012], shaderMips: 2,
      back: { paper: '#0F1B3D', ink: '#FFFFFF', soft: '#A9B8DA', accent: '#F6C21C' },
    };
    case 'Xactions': return {
      motif: 'xactions', t0: 0,
      pal: ['#060A22', '#0B1234'],
      ground: '#080D28',
      type: [{ lines: ['Xactions'], font: 'NJ Text', weight: 900, track: -0.035, fit: 940, x: 36, base: 198, ch: 0 }],
      inks: ['#FFFFFF'],
      bandY: 0.5, grain: [0.012, 0.010], shaderMips: true,
      back: { paper: '#080C26', ink: '#FFFFFF', soft: '#A6ADD6', accent: '#FF8A2A' },
    };
    case 'Stellar Explorer': return {
      motif: 'stellar', t0: 0,
      pal: ['#0B0E1C', '#0D1440', '#1E2C8C', '#5B2E9E', '#5E6FC0', '#E2A6F0', '#1F44D8', '#5A8CF5'],
      ground: '#0B0E1C',
      type: [{ lines: ['Stellar', 'Explorer'], font: 'NJ Serif', weight: 700, track: -0.01, fit: 596, x: 512, align: 'center', base: 137, lead: 104, ch: 0 }],
      inks: ['#FFF8EE'],
      bandY: 0.42, grain: [0.012, 0.010],
      back: { paper: '#0B0E1C', ink: '#FFF8EE', soft: '#A3A9CC', accent: '#DBA95C' },
    };
    case 'Chairtax': return {
      motif: 'chairtax', t0: 0,
      pal: ['#140F0B', '#140F0B', '#FFB020', '#F8F2E7', '#2E3D66', '#55669A', '#0E1018', '#6F8BD6'],
      ground: '#140F0B',
      // the concept's own letters, traced (letters/chairtax.json; cream "Chair" on channel 0, amber "tax" on 1)
      type: [{ paths: 'letters/chairtax.json' }],
      // the concept's cream and amber (the operator's ruling for this cover)
      inks: ['#FCEECE', '#F9B224'],
      mark: [8, 6, 164],
      // his forearms' underside rests on the top of the "a" in "Chair"
      art: { src: 'art/bearly-lean.webp', x: 300, top: 18 },
      typeGlow: true,
      // the band stops above the dot of the i
      bandY: 0.86, bandH: 0.28, grain: [0.012, 0.010],
      back: { paper: '#14110D', ink: '#F8F2E7', soft: '#B4A893', accent: '#FFB020' },
    };
    case 'Stats': return {
      motif: 'stats', t0: 0,
      pal: ['#EEF2F7', '#C9D3E1', '#3A6BD6', '#17845A', '#D9822B', '#D6E9FF', '#EEF2F7', '#17202B'],
      ground: '#E3E9F0',
      type: [{ lines: ['Stats'], font: 'NJ Bricolage', weight: 800, track: -0.01, fit: 552, x: 52, base: 367, ch: 0 }],
      inks: ['#17202B'],
      mark: [49, 36, 125],
      bandY: 0.40, grain: [0.010, 0.008],
      back: { paper: '#EEF1F4', ink: '#17202B', soft: '#5B6776', accent: '#3A6BD6' },
    };
    case 'About Neil': return {
      motif: 'about', t0: 0,
      pal: ['#F2E7D3', '#E8D8BC'],
      ground: '#EFE2CC',
      // the concept's own letters, traced (letters/about.json)
      type: [{ paths: 'letters/about.json' }],
      inks: ['#D2A64E', '#A8771F'],
      bandY: 0.45, grain: [0.03, 0.014], shaderMips: 2,
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
function drawType(ctx, b, S, fill) {
  if (b.paths) {
    // letters as traced outlines (letters/*.json, loaded by letterPaths before any draw), in 1024 units
    ctx.save();
    ctx.scale(S, S);
    for (const { ch, path } of letterSets.get(b.paths)) { ctx.fillStyle = fill || CH[ch]; ctx.fill(path, 'evenodd'); }
    ctx.restore();
    return;
  }
  if (b.glyphs) {
    // glyphs placed one by one: [text, x, ch, scale] on the block's baseline
    for (const [g, x, ch, k = 1] of b.glyphs) {
      setFont(ctx, b.weight, b.px * k * S, b.font, 0);
      ctx.fillStyle = fill || CH[ch];
      ctx.fillText(g, x * S, b.base * S);
    }
    return;
  }
  if (b.set) {
    // glyphs set one by one by their ink centre: [text, cx, cy, px, degrees clockwise, ch]
    for (const [g, cx, cy, px, deg, ch] of b.set) {
      setFont(ctx, b.weight, px * S, b.font, 0);
      const m = ctx.measureText(g);
      ctx.save();
      ctx.translate(cx * S, cy * S);
      ctx.rotate(deg * Math.PI / 180);
      ctx.fillStyle = fill || CH[ch];
      ctx.fillText(g, -(m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2, -(m.actualBoundingBoxDescent - m.actualBoundingBoxAscent) / 2);
      ctx.restore();
    }
    return;
  }
  setFont(ctx, b.weight, 100, b.font, b.track);
  let px;
  if (b.px) px = b.px;
  else if (b.cap) px = 100 * b.cap / ctx.measureText('H').actualBoundingBoxAscent;
  else px = 100 * b.fit / Math.max(...b.lines.map(l => inkBox(ctx, l).width));
  setFont(ctx, b.weight, px * S, b.font, b.track);
  ctx.fillStyle = fill || CH[b.ch];
  b.lines.forEach((line, i) => {
    const box = inkBox(ctx, line);
    const y = (b.base + i * (b.lead || 0)) * S;
    const x = b.align === 'center' ? b.x * S - box.width / 2 + box.left : b.x * S + box.left;
    if (!b.runs) { ctx.fillText(line, x, y); return; }
    // a line set in runs of different inks: each run starts at the advance of the runs before it
    let rx = x;
    for (const [run, ch] of b.runs) { ctx.fillStyle = fill || CH[ch]; ctx.fillText(run, rx, y); rx += ctx.measureText(run).width; }
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
      let lines = wrap(ctx, label, W - M - split), lh = 19 * S;
      if (lines.length > 2) {
        // a long label takes three tighter lines rather than losing its end
        setFont(ctx, 400, 13 * S, 'NJ Text', 0);
        lines = wrap(ctx, label, W - M - split).slice(0, 3);
        lh = 16.5 * S;
      }
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
// traced letter outlines (letters/): one fetch per file, kept as Path2D for drawType
const letterSets = new Map(), letterLoads = new Map();
function letterPaths(src) {
  let p = letterLoads.get(src);
  if (!p) {
    p = fetch(new URL(src, import.meta.url)).then(r => r.json()).then(j => {
      letterSets.set(src, j.letters.map(({ ch, d }) => ({ ch, path: new Path2D(d) })));
    });
    letterLoads.set(src, p);
  }
  return p;
}
// brand artwork (art/), premultiplied and mipmapped, one texture per file for every cover that draws it
const artTextures = new Map();
function artTexture(src) {
  let p = artTextures.get(src);
  if (!p) {
    const img = new Image();
    img.decoding = 'async';
    img.src = new URL(src, import.meta.url).href;
    p = img.decode().then(() => {
      const tex = new THREE.Texture(img);
      tex.colorSpace = THREE.NoColorSpace;   // composited in sRGB, like the brand mark
      tex.premultiplyAlpha = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;
      return tex;
    });
    artTextures.set(src, p);
  }
  return p;
}
const validLogo = logo => logo && (typeof logo.svg === 'string' || typeof logo.png === 'string') ? logo : null;
// the front's type alone, white on clear, at the size the form field rasterises it (a cover whose form is its type)
function typeImage(d) {
  const n = Math.round((d.form.res || 512) / (1 + 2 * MARGIN));
  const c = document.createElement('canvas');
  c.width = c.height = n;
  const ctx = c.getContext('2d');
  ctx.textBaseline = 'alphabetic';
  for (const b of d.type) drawType(ctx, b, n / 1024, '#fff');
  return c;
}
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

// optional (label, fn) => fn() wrapper for timing; nonce (a number) makes every program's source unique, so
// a measurement sees shader compiles that no driver cache has seen
// The colour the resting cover reads as (sRGB hex); a flat stand-in the scene fills a sleeve with while its cover is late.
export const coverGround = (entry, index) => designFor(entry, index).ground;
export const coverProfiler = { wrap: null, nonce: 0 };
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
// Details backs (1024², 5.3 MiB each) are kept for the last DETAIL_CACHE requests across all covers.
const DETAIL_CACHE = 2;
const detailCache = [];   // least recently used first
function touchDetail(rec) {
  const k = detailCache.indexOf(rec);
  if (k >= 0) detailCache.splice(k, 1);
  detailCache.push(rec);
  while (detailCache.length > DETAIL_CACHE) detailCache[0].evict();
}

export async function createCover(renderer, entry, index, { size = 1024, backSize = 512, samples = 4, aliveSamples = Math.min(2, samples) } = {}) {
  await loadCoverFonts();
  const d = designFor(entry, index);
  const lettersReady = Promise.all(d.type.filter(b => b.paths).map(b => letterPaths(b.paths)));
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
    uStrip: { value: { front: 0, art: 1, fill: 2 }[d.strip || 'front'] },
    uBandH: { value: d.bandH || 0.3 },
    uText: { value: null },
    uOver: { value: BLANK },
    uForm: { value: BLANK_FORM },
    uFormCol: { value: BLANK },
    uFront: { value: BLANK },
    uFormRect: { value: new THREE.Vector3(0, 0, 0) },
    uRest: { value: BLANK },
    uRestMix: { value: 0 },
    uArt: { value: BLANK },
    uArtRect: { value: new THREE.Vector4(0, 0, 0, 0) },
    uArtFade: { value: 0 },
    uKeys: { value: BLANK },
    uMip: { value: 0 },
    uInk0: { value: inks[0] },
    uInk1: { value: inks[1] },
    uInk2: { value: inks[2] },
    uPaper: { value: lin(d.back.paper) },
    uPal: { value: pal },
    uAux: { value: Array.from({ length: 8 }, () => new THREE.Vector4()) },
  };
  // a motif's colour keys (stet, Topshine), as a float texture the shader reads with texelFetch: key i at column
  // i % KW in row pair i / KW (row 2k: x, y, sigma; row 2k + 1: r, g, b), KW = min(keys, 2048)
  let keysTex = null;
  if (d.keys) {
    const { list, starts, sigma } = d.keys, n = list.length, kw = Math.min(n, 2048), pairs = Math.ceil(n / kw);
    const data = new Float32Array(kw * pairs * 8);
    list.forEach(([x, y, r, g, b], i) => {
      const L = starts.findIndex(s => s > i) - 1, row = 2 * Math.floor(i / kw) * kw + i % kw;
      data.set([x, y, sigma[L], 0], row * 4);
      data.set([r, g, b, 1], (row + kw) * 4);
    });
    keysTex = new THREE.DataTexture(data, kw, 2 * pairs, THREE.RGBAFormat, THREE.FloatType);
    keysTex.minFilter = keysTex.magFilter = THREE.NearestFilter;
    keysTex.needsUpdate = true;
    uniforms.uKeys.value = keysTex;
  }
  const material = new THREE.ShaderMaterial({
    name: `cover:${entry.name}`,
    vertexShader: VERT,
    fragmentShader: (PRELUDE + MOTIFS[d.motif] + MAIN).replace('gl_FragColor = vec4(o, 1.0);', coverProfiler.nonce
      ? `gl_FragColor = vec4(o, 1.0 + uRestMix * ${coverProfiler.nonce.toFixed(1)}e-30);` : 'gl_FragColor = vec4(o, 1.0);'),
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
  const [markImg, formImg, art] = await Promise.all([
    markAt(size),
    d.form?.fromType ? lettersReady.then(() => typeImage(d))
      : d.form?.svg ? logoImage({ svg: d.form.svg }, Math.round((d.form.res || 512) / (1 + 2 * MARGIN)))   // a form drawn for the cover
      : logo && d.form ? logoImage(logo, Math.round((d.form.res || 512) / (1 + 2 * MARGIN))) : null,
    d.art ? artTexture(d.art.src) : null,
    compiled,
    lettersReady,
  ]);
  if (art) {
    const { width: w, height: h } = art.image;
    renderer.initTexture(art);
    uniforms.uArt.value = art;
    uniforms.uArtRect.value.set(d.art.x / 1024, 1 - (d.art.top + h) / 1024, w / 1024, h / 1024);
    uniforms.uArtFade.value = (d.art.fade || 0) / h;
  }

  // layers of a front whose shader draws its own mip levels carry mips too, so each level reads its type
  const upload = (canvas, premultiply, mips = false) => {
    const tex = new THREE.Texture(canvas);
    tex.colorSpace = THREE.NoColorSpace;
    tex.premultiplyAlpha = premultiply;
    tex.generateMipmaps = mips;
    tex.minFilter = mips ? THREE.LinearMipmapLinearFilter : THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    renderer.initTexture(tex);   // upload now: the canvas is shared and is redrawn for the next cover
    return tex;
  };
  // the front's type mask and its colour overlay (the brand mark, drawn unaltered)
  const layersAt = (sz, img) => {
    const ctx = textCtx(sz), k = sz / 1024;
    drawFront(ctx, d);
    const mips = !!(d.shaderMips || d.typeGlow);
    const text = upload(ctx.canvas, false, mips);
    let over = BLANK;
    if (img) {
      const octx = artCtx(sz);
      drawContained(octx, img, d.mark[0] * k, d.mark[1] * k, d.mark[2] * k);
      over = upload(octx.canvas, true, mips);
    }
    return { text, over, dispose() { text.dispose(); if (over !== BLANK) over.dispose(); } };
  };
  const frontLayers = () => layersAt(size, markImg);
  const draw = (rt, mode, layers, ss, level = 0) => {
    const prev = renderer.getRenderTarget();
    const s = rt.width >> level;
    uniforms.uMode.value = mode;
    uniforms.uMip.value = level;
    uniforms.uRes.value.set(s, s);
    uniforms.uText.value = layers.text;
    uniforms.uOver.value = layers.over || BLANK;
    uniforms.uFront.value = mode ? (layers.strip || frontRT).texture : BLANK;
    uniforms.uSS.value = ss;
    uniforms.uInk0.value = mode ? srgb(d.back.ink) : inks[0];
    uniforms.uInk1.value = mode ? srgb(d.back.soft) : inks[1];
    uniforms.uInk2.value = mode ? srgb(d.back.accent) : inks[2];
    // a mip level: the target's viewport is the level's size while it is bound (three skips the box
    // mipmap pass for a render to any level but 0, so the level keeps what the shader drew)
    if (level) rt.viewport.set(0, 0, s, s);
    renderer.setRenderTarget(rt, 0, level);
    renderer.render(scene, CAM);
    if (level) rt.viewport.set(0, 0, rt.width, rt.height);
    renderer.setRenderTarget(prev);
  };
  // The front, then (shaderMips) its levels down to 32², each drawn with the level's own pixel size, so
  // the motif's fine structure fades to its mean before it can beat against the level's grid.
  const renderFront = (layers, ss) => {
    draw(frontRT, 0, layers, ss);
    if (d.shaderMips) for (let k = 1; (frontRT.width >> k) >= 32 && (d.shaderMips === true || k <= d.shaderMips); k++) draw(frontRT, 0, layers, ss, k);
  };
  const ease = u => u * u * (3 - 2 * u);
  // The back's strip is a crop of the finished front. A front smaller than the back (the scene's
  // 16² front beside a 1024 back) is redrawn at the back's size for the strip, then released.
  const cropStrip = (d.strip || 'front') === 'front';
  const needsStripFront = rt => cropStrip && frontRT.width < rt.width;
  const stripMark = rt => needsStripFront(rt) ? markAt(rt.width) : Promise.resolve(null);
  const renderBack = (rt, img) => {
    const t = uniforms.uTime.value;
    uniforms.uTime.value = d.t0;
    let strip = null;
    if (needsStripFront(rt)) {
      strip = target(rt.width);
      const l = layersAt(rt.width, img);
      draw(strip, 0, l, samples);
      l.dispose();
    }
    const bctx = textCtx(rt.width);
    drawBack(bctx, entry);
    const text = upload(bctx.canvas, false);
    draw(rt, 1, { text, strip }, samples);
    text.dispose();
    if (strip) strip.dispose();
    uniforms.uTime.value = t;
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
      renderFront(layers, samples);
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
  let detail = null;   // { size, rt, p, evict }: this cover's entry in the Details-back cache
  const cover = {
    front: frontRT.texture,
    back: backRT ? backRT.texture : null,
    // The back at detail size (Details magnifies it). Cached across covers, at most DETAIL_CACHE at a time:
    // an evicted back is rendered again on its cover's next request. Resolves null if evicted first.
    detailBack(detailSize = 1024) {
      if (disposed) return Promise.resolve(null);
      if (detail && detail.size !== detailSize) detail.evict();
      if (!detail) {
        const rec = { size: detailSize, rt: target(detailSize) };
        rec.rt.texture.name = `${entry.name} back ${detailSize}`;
        rec.evict = () => {
          if (rec.rt) { rec.rt.dispose(); rec.rt = null; }
          const k = detailCache.indexOf(rec);
          if (k >= 0) detailCache.splice(k, 1);
          if (detail === rec) detail = null;
        };
        rec.p = Promise.all([loadBackFonts(), stripMark(rec.rt)])
          .then(([, img]) => rec.rt && enqueue(`${entry.name} back ${detailSize}`, () => { if (rec.rt) renderBack(rec.rt, img); }))
          .then(() => rec.rt ? rec.rt.texture : null);
        detail = rec;
      }
      touchDetail(detail);
      return detail.p;
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
        renderFront(alive, samples);
        stop();
        return;
      }
      time += dt * speed;
      uniforms.uTime.value = time;
      uniforms.uRestMix.value = ease(restMix);
      uniforms.uRest.value = restMix > 0 ? restRT.texture : BLANK;
      renderFront(alive, aliveSamples);
    },
    dispose() {
      disposed = true;
      stop();
      frontRT.dispose(); if (backRT) backRT.dispose(); material.dispose();
      if (detail) detail.evict();
      if (form) { form.tex.dispose(); if (form.col) form.col.dispose(); }
      if (keysTex) keysTex.dispose();
    },
    // resident GPU bytes (preview diagnostics): mipmapped RGBA8 targets, half-float form fields
    gpuBytes() {
      const rt = (t, mips) => t ? t.width * t.height * 4 * (mips ? 4 / 3 : 1) : 0;
      let n = rt(frontRT, true) + rt(backRT, true) + rt(detail?.rt, true) + rt(restRT, false);
      if (form) n += form.tex.image.width ** 2 * 8 + (form.col ? form.col.image.width ** 2 * 4 : 0);
      if (art) n += art.image.width * art.image.height * 4 * 4 / 3;
      return n;
    },
    _stop: stop,
  };
  return cover;
}
