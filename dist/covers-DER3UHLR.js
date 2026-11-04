import{B as ne,E as re,F as i0,Q as ie,c as te,d as j,e as u0,f as oe,g as L0,h as d0,i as p0,j as h0,m as B0,o as M0,p as m0,q as R0,r as K0,v as H0,x as ae,y as ce,z as se}from"./chunk-QESZHFER.js";import{a as Y,b as Oe}from"./chunk-GTSYN4HE.js";var Ne=new URL("../../vendor/fonts/",new URL("../covers/covers.js",import.meta.url).href),qe=[["NJ Text","ui/inter-variable-ui.woff2","100 900"],["NJ Serif","fraunces-144pt-bold-cover.woff2","700"],["NJ Hanken","hanken-grotesk-600-cover.woff2","600"],["NJ Bricolage","bricolage-grotesque-96pt-extrabold-title-cover.woff2","800"]],Ue=[["NJ Display","bricolage-grotesque-96pt-extrabold-cover.woff2","800"],["NJ Mono","jetbrains-mono-medium-cover.woff2","500"]],Ee=e=>Promise.all(e.map(([t,o,c])=>{let n=[...document.fonts].find(i=>i.family.replace(/^["']|["']$/g,"")===t);if(n)return n.load();let s=new FontFace(t,`url("${new URL(o,Ne).href}") format("woff2")`,{weight:c,style:"normal"});return document.fonts.add(s),s.load()})),T0=null,P0=null;function Xe(){return T0||(T0=Ee(qe)),T0}function le(){return P0||(P0=Ee(Ue)),P0}var fe=e=>new H0(e),E0=e=>{let t=new H0;return t.setStyle(e,p0),t},Ye=`
void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`,$e=`
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
// Motion (MOTIONS): the option in play (1, 2, 3; 0 none) and its cycle (clock s). The clock runs in [0, uCycle), and every
// option is exactly the still frame at clock 0. mRise is 0 before a and 1 after b; mBump is 0 outside [a, b], 1 at its middle.
uniform float uMotion, uCycle;
bool mOn(float k) { return abs(uMotion - k) < 0.5; }
float mRise(float u, float a, float b) { return ease(sat((u - a) / (b - a))); }
float mBump(float u, float a, float b) { float x = sat((u - a) / (b - a)); return 0.5 - 0.5 * cos(TAU * x); }

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
`,Qe=`
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
}`,$={};$.mirra=`
const float YF = 0.236;
const vec2 RC = vec2(0.4805, 0.4705);   // the ring's centre
// motion b: how strongly the arc of light running round the ring lights p (its head sharp, its tail long), and how far into
// the movement it is (k)
float syncArc(vec2 p, float u, out float k) {
  k = mRise(u, 0.0, 0.12) * (1.0 - mRise(u, 0.66, 0.82));
  float d = mod(atan(p.y - RC.y, p.x - RC.x) - (1.5708 - TAU * ease(sat((u - 0.02) / 0.78))) + PI, TAU) - PI;
  return d > 0.0 ? exp(-d * d / 0.9) : exp(-d * d / 0.03);
}
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
  // motion a: a highlight that sweeps across the bevels
  float ph = fract((mOn(1.0) ? t : 0.0) * 0.09 + 0.25) * 2.6 - 0.8;
  float sw = exp(-pow((p.x * 0.8 + p.y * 0.6 - ph) / 0.05, 2.0));
  col += sw * (0.25 + 0.75 * (1.0 - n.z)) * 0.6;
  // motion b: the ring dims to the room's blue, but for an arc of light that runs once round it as the mirror syncs
  if (mOn(2.0)) {
    float k, g = syncArc(p, t / uCycle, k);
    if (k > 0.0) col = mix(col, col * vec3(0.62, 0.76, 0.95), k * 0.7 * (1.0 - g)) + k * g * 0.3;
  }
  return col;
}
vec3 motif(vec2 p, float t) {
  vec3 col = ground(p);
  // reflection in the floor
  if (p.y < YF) {
    float dz = YF - p.y;
    vec2 pm = vec2(p.x, 2.0 * YF - p.y);
    // motion c: a ripple spreads across the mirror from the ring's foot, as if a post had just landed in it
    if (mOn(3.0)) {
      float u = t / uCycle, k = mRise(u, 0.02, 0.1) * (1.0 - mRise(u, 0.5, 0.86));
      if (k > 0.0) {
        vec2 w = vec2(p.x - 0.488, dz * 3.4);
        float r = length(w), R = 0.03 + 0.95 * sat((u - 0.02) / 0.84), x = r - R;
        float env = k * exp(-x * x / 0.009) / (1.0 + 2.5 * R), wave = sin(x * 115.0);
        pm += vec2(w.x / max(r, 1e-3) * 0.5, -1.0) * 0.014 * env * wave;
        col *= 1.0 + 0.2 * env * sin(x * 115.0 + 0.8);
      }
    }
    vec4 fm = formAt(pm);
    float b = 0.0015 + dz * 0.10;
    float a = smoothstep(b, -b, fm.r) * exp(-dz / 0.09) * 0.62;
    col = mix(col, ringShade(fm, pm, t) * 0.96, a);
    col += vec3(1.0) * 0.16 * falloff(fm.r - b, 0.05) * exp(-dz / 0.05);
  }
  vec4 f = formAt(p);
  // bloom around the form, strongest where it meets the floor
  col += vec3(1.0) * 0.12 * falloff(f.r, 0.06);
  if (mOn(2.0) && f.r > 0.0) { float k, g = syncArc(p, t / uCycle, k); col += vec3(0.9, 0.96, 1.0) * k * g * 0.5 * falloff(f.r, 0.11); }
  col += vec3(1.0) * 0.30 * exp(-pow((p.x - 0.488) / 0.11, 2.0) - pow((p.y - YF) / 0.018, 2.0));
  col = mix(col, ringShade(f, p, t), cover(f.r));
  return col;
}`;$.stet=`
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
const vec3 DOTC = vec3(0.816, 0.480, 0.112);   // the stet mark's dots: the back's accent, #E9B85E, linear
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
  col *= 1.0 - LINE.z * exp(-pow((g - LINE.x) / LINE.y, 2.0)) * smoothstep(0.0, 0.05, g) * (1.0 - uMode);
  // motion c: the proofreader's stet mark, a row of dots set under the word one by one, let stand, then faded
  if (mOn(3.0) && p.y > 0.15 && p.y < 0.22) {
    float u = t / uCycle, keep = 1.0 - mRise(u, 0.7, 0.84);
    for (int i = 0; i < 7; i++) {
      float a = mRise(u, 0.06 + 0.07 * float(i), 0.12 + 0.07 * float(i)) * keep;
      col = mix(col, DOTC, a * cover(length(p - vec2(0.14 + 0.12 * float(i), 0.185)) - 0.0115 * (0.7 + 0.3 * a)));
    }
  }
  return col;
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
// each letter's middle and half-size (cover units), from its faces' keys: the s, the first t, the e, the last t
const vec4 LETTER[4] = vec4[4](vec4(0.188, 0.495, 0.147, 0.207), vec4(0.427, 0.549, 0.051, 0.257), vec4(0.667, 0.496, 0.143, 0.206), vec4(0.911, 0.557, 0.066, 0.267));
vec3 stetFill(vec2 p, float t, int L) {
  // motion a, never repeating: each letter's colours turn round inside it, about the letter's middle and stretched to its
  // shape, each letter on its own clock (the t's the other way round), breathing in and out as they turn; the stipple
  // jitters where the blend is read
  vec2 q = p;
  if (mOn(1.0) && t > 0.0) {
    vec4 c = LETTER[L];
    float per = L == 0 ? 22.0 : L == 1 ? -17.0 : L == 2 ? 26.0 : -19.0, k = 1.0 + 0.18 * sin(TAU * t / (11.0 + 2.0 * float(L)));
    // kept inside the letter's own keys: beyond them the colour field has nothing to blend
    q = c.xy + clamp(rot(TAU * t / per) * ((p - c.xy) / c.zw) * k, -0.97, 0.97) * c.zw;
  }
  q += (h22(FC * 0.731 + 3.0) - 0.5) * 0.016;
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
  // motion b: a band of light reads across the word, left to right, like a proofreader's pass
  if (mOn(2.0)) {
    float u = t / uCycle, k = mRise(u, 0.0, 0.08) * (1.0 - mRise(u, 0.52, 0.64));
    float x = mix(-0.2, 1.2, ease(sat((u - 0.02) / 0.6))) - 0.16 * (p.y - 0.5);
    c += k * 0.42 * exp(-pow((p.x - x) / 0.075, 2.0)) * (1.0 - c);
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
#define INK1(p, t) (p.x < 0.41 ? stetFill(p, t, 0) : etFill(p, t))`;$.hook=`
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
  float u = t / uCycle;
  // motion a, never repeating: every shape on its own clock, the periods (clock s) unequal so the whole never comes round
  // again: the split disc turns round and round and breathes, the other discs travel and grow and shrink against one
  // another, the crossing wanders and the diagonals swing with it, the band of light breathes
  vec2 X = vec2(0.47626, 0.77821), c1 = vec2(0.65799, 0.33545), cD = vec2(0.59558, 0.43873), cP = vec2(0.02461, 1.04655);
  float r1 = 0.35365, rD = 0.16549, rP = 0.51214, br = 1.0;
  vec2 q4 = q, w4 = w, w1 = w, wP = w;
  if (mOn(1.0) && t > 0.0) {
    vec4 s = sin(TAU * t / vec4(9.0, 11.0, 13.0, 14.0)), s2 = sin(TAU * t / vec4(15.0, 17.0, 19.0, 21.0)), s3 = sin(TAU * t / vec4(23.0, 25.0, 27.0, 29.0));
    br += 0.25 * s.x;
    X += vec2(0.07 * s2.w, 0.04 * s3.z);
    r1 *= 1.0 + 0.22 * s.y;  c1 += vec2(0.03 * s2.y, 0.03 * s3.y);
    rD *= 1.0 + 0.35 * s.z;  cD += vec2(0.06 * s2.z, 0.04 * s2.x);
    rP *= 1.0 - 0.18 * s.w;  cP += vec2(0.05 * s3.x, -0.04 * s3.w);
    w1 = w - (c1 - vec2(0.65799, 0.33545)); wP = w - (cP - vec2(0.02461, 1.04655));
    // the split disc turns about its middle, a full turn every 18 clock s, breathing as it turns
    vec2 C4 = vec2(0.795, 0.77);
    q4 = C4 + rot(-TAU * t / 18.0) * (q - C4) / (1.0 + 0.14 * sin(TAU * t / 16.0));
    w4 = q4 - 0.5;
  }
  float dL = sdLeft(q, X, -0.98364), dA = sdLeft(q, X, -1.01603);
  float dB = -sdLeft(q, X, 1.05718);   // positive below the triangle's right edge
  float dl = abs(q.y < X.y ? dL : dA);
  // motion c: a pulse of light runs up the diagonal, from the crossing out to the corner, as a post goes out
  if (mOn(3.0)) {
    float k = mRise(u, 0.0, 0.1) * (1.0 - mRise(u, 0.55, 0.7));
    float s = dot(q - X, vec2(0.71295, -0.70122)) - mix(-0.25, 0.95, ease(sat((u - 0.03) / 0.62)));
    br += k * 1.4 * exp(-s * s / 0.012);
  }
  vec2 e = br * vec2(exp(-dl / 0.01614), exp(-dl / 0.0561));
  // motion b: the pale disc rises from the lower left, like a post going up, and settles back
  vec2 rz = mOn(2.0) ? vec2(0.018, -0.07) * mRise(u, 0.04, 0.42) * (1.0 - mRise(u, 0.56, 0.94)) : vec2(0.0);
  // each area's field is evaluated only where the area shows
  vec3 G = POLY(K_G, w), col = G;
  float m = sat((q.y - 0.54851) / 0.19798 + 0.5);
  if (m > 0.0) col = mix(col, POLY(K_M, w) + BAND(K_M, e), m);
  // the pale corner beyond the dark disc at the top right
  if (q.x > c1.x && q.y < c1.y) col = mix(col, POLY(K_TR, w1), cover(r1 - length(q - c1)));
  // the dark disc under "Hook": the top field's own blue
  col = mix(col, G, cover(length(q - cD) - rD));
  // the pale disc from the lower left, under the line of the triangle's right edge
  float a = cover(length(q - rz - cP) - rP) * cover(-dB);
  if (a > 0.0) { vec2 wz = wP - rz; col = mix(col, POLY(K_C3, wz) + BAND(K_C3, e), a); }
  // beyond the diagonal: the light field above the triangle's right edge
  float right = cover(max(dL, dA));
  float b = right * cover(dB);
  if (b > 0.0) col = mix(col, POLY(K_LF, w) + BAND(K_LF, e), b);
  // the split disc, light on the left of the split (its own circle), deep on the right (half-ellipses)
  float xs = 0.77971;
  b = cover(length(q4 - vec2(0.7876, 0.78558)) - 0.24415) * cover(q4.x - xs);
  if (b > 0.0) col = mix(col, POLY(K_C4L, w4) + BAND(K_C4L, e), b);
  vec2 o4 = q4 - vec2(0.80816, 0.75084);
  b = cover(sdEllipse(o4, vec2(o4.x < 0.0 ? 0.26661 : 0.20003, 0.21656))) * cover(xs - q4.x);
  if (b > 0.0) col = mix(col, POLY(K_C4R, w4), b);
  // the deep triangle below the crossing, over the disc's foot
  b = right * cover(-dB);
  if (b > 0.0) col = mix(col, POLY(K_TRI, w), b);
  return max(col, 0.0);
}`;$.clauded=`
const float YF = 0.205;
// the room: a smooth wall above the floor line and a floor below it, each a cubic B-spline over a coarse grid. The
// grids are written out as sums: a constant array read at a computed index costs the GPU far more than the arithmetic
float b3(float t) { t = abs(t); return t < 1.0 ? (4.0 - 6.0 * t * t + 3.0 * t * t * t) / 6.0 : t < 2.0 ? pow(2.0 - t, 3.0) / 6.0 : 0.0; }
// the gaps and the contour: dark teal, deepest at the gap's middle
const vec3 RAMP = vec3(0.004, 0.1095, 0.1248), CORE = vec3(0.0009, 0.0742, 0.0865);
const vec3 SIDEDK = vec3(0.0048, 0.1441, 0.162), SIDELT = vec3(0.0497, 0.4564, 0.4793);
// pw: where the whale's own glass at p rests (motion b floats it)
vec3 room(vec2 p, vec2 pw, vec4 f) {
  float wb = smoothstep(YF + 0.006, YF - 0.006, p.y), dz = max(YF - p.y, 0.0) / YF;
  float rc = 0.0;
  // the whale's lower body over each floor column, one soft tap: its reflection, streaked
  if (wb > 0.0) rc = smoothstep(0.1, -0.04, formAt(vec2(p.x, YF + 0.03)).r);
  float gx = exp(-pow((p.x - 0.47) / 0.25, 2.0));
  float sx = p.x * 4.0 + 1.0, u0 = b3(sx), u1 = b3(sx - 1.0), u2 = b3(sx - 2.0), u3 = b3(sx - 3.0), u4 = b3(sx - 4.0), u5 = b3(sx - 5.0), u6 = b3(sx - 6.0);
  vec3 c = vec3(0.0);
  if (wb < 1.0) { float sy = p.y * 3.0 + 1.0; c = (1.0 - wb) * (b3(sy) * (u0 * vec3(0.002, 0.0891, 0.1044) + u1 * vec3(0.0032, 0.173, 0.1902) + u2 * vec3(0.0037, 0.2292, 0.2476) + u3 * vec3(0.002, 0.2419, 0.261) + u4 * vec3(0.002, 0.2293, 0.2475) + u5 * vec3(0.0025, 0.1895, 0.2067) + u6 * vec3(0.0022, 0.1257, 0.1424))
      + b3(sy - 1.0) * (u0 * vec3(0.002, 0.0454, 0.0552) + u1 * vec3(0.0024, 0.1055, 0.1231) + u2 * vec3(0.0061, 0.1813, 0.2006) + u3 * vec3(0.002, 0.1669, 0.1874) + u4 * vec3(0.002, 0.1589, 0.1768) + u5 * vec3(0.0041, 0.1199, 0.1347) + u6 * vec3(0.002, 0.0656, 0.0767))
      + b3(sy - 2.0) * (u0 * vec3(0.0027, 0.03, 0.035) + u1 * vec3(0.002, 0.035, 0.0514) + u2 * vec3(0.0033, 0.1118, 0.1317) + u3 * vec3(0.002, 0.1073, 0.1274) + u4 * vec3(0.0039, 0.0831, 0.1019) + u5 * vec3(0.002, 0.0356, 0.0489) + u6 * vec3(0.002, 0.03, 0.035))
      + b3(sy - 3.0) * (u0 * vec3(0.0028, 0.045, 0.0508) + u1 * vec3(0.0028, 0.0477, 0.0612) + u2 * vec3(0.0027, 0.0722, 0.0896) + u3 * vec3(0.0038, 0.0776, 0.0973) + u4 * vec3(0.0026, 0.0681, 0.0829) + u5 * vec3(0.0025, 0.038, 0.0513) + u6 * vec3(0.0051, 0.03, 0.035))
      + b3(sy - 4.0) * (u0 * vec3(0.002, 0.0368, 0.0465) + u1 * vec3(0.002, 0.03, 0.035) + u2 * vec3(0.002, 0.0367, 0.0483) + u3 * vec3(0.002, 0.0658, 0.079) + u4 * vec3(0.002, 0.0302, 0.0415) + u5 * vec3(0.002, 0.03, 0.035) + u6 * vec3(0.002, 0.03, 0.035))
      + b3(sy - 5.0) * (u0 * vec3(0.002, 0.03, 0.035) + u1 * vec3(0.0027, 0.031, 0.0403) + u2 * vec3(0.0028, 0.0518, 0.0608) + u3 * vec3(0.0033, 0.0706, 0.0808) + u4 * vec3(0.0034, 0.0541, 0.067) + u5 * vec3(0.004, 0.0352, 0.0478) + u6 * vec3(0.002, 0.03, 0.035))); }
  if (wb > 0.0) { float sy = dz + 1.0; c += wb * (b3(sy) * (u0 * vec3(0.002, 0.03, 0.035) + u1 * vec3(0.002, 0.03, 0.035) + u2 * vec3(0.1233, 0.03, 0.035) + u3 * vec3(1.5166, 3.3168, 2.9677) + u4 * vec3(0.002, 0.0496, 0.0462) + u5 * vec3(0.002, 1.1035, 1.2152) + u6 * vec3(0.0842, 0.03, 0.035))
      + b3(sy - 1.0) * (u0 * vec3(0.002, 0.03, 0.035) + u1 * vec3(0.002, 0.03, 0.035) + u2 * vec3(0.0267, 0.4086, 0.4379) + u3 * vec3(0.002, 0.5992, 0.6654) + u4 * vec3(0.002, 0.1559, 0.1945) + u5 * vec3(0.002, 0.03, 0.035) + u6 * vec3(0.0024, 0.03, 0.035))
      + b3(sy - 2.0) * (u0 * vec3(0.002, 0.03, 0.035) + u1 * vec3(0.002, 0.03, 0.035) + u2 * vec3(0.002, 0.0784, 0.1016) + u3 * vec3(0.002, 0.03, 0.035) + u4 * vec3(0.002, 0.03, 0.035) + u5 * vec3(0.002, 0.03, 0.035) + u6 * vec3(0.006, 0.03, 0.035))
      + b3(sy - 3.0) * (u0 * vec3(0.002, 0.03, 0.035) + u1 * vec3(0.002, 0.03, 0.035) + u2 * vec3(0.002, 0.03, 0.035) + u3 * vec3(0.0127, 0.8331, 0.8382) + u4 * vec3(0.0226, 0.1687, 0.2221) + u5 * vec3(0.002, 0.03, 0.035) + u6 * vec3(0.002, 0.2732, 0.5997))); }

  float fo = max(f.r, 0.0), wgap = (1.0 - cover(f.r)) * exp(-pow(fo / 0.006, 2.0));
  c = max(c, 0.0) * (1.0 - wgap) + wgap * mix(RAMP, CORE, smoothstep(0.0, 0.0055, fo));
  // the glass's thickness: each facet's side face, seen in the gap below and right of its front face, lit from the
  // floor at its foot, with a bright line along its lower edge
  if (f.r > 0.0 && f.r < 0.012) {
    float rb = formAt(pw + vec2(-0.0015, 0.0045)).r, sb = cover(rb) * (1.0 - cover(f.r));
    vec3 sc = mix(SIDEDK, SIDELT, smoothstep(-0.0045, 0.0, rb)) + SIDELT * 0.6 * exp(-pow(rb / 0.0012, 2.0));
    c = mix(c, sc, sb);
  }
  return c;
}
const vec3 RIM = vec3(0.472, 0.72, 0.76), SIDE = vec3(0.0075, 0.1878, 0.2159);   // SIDE: the concept's teal just inside its edges
const vec2 FAN = vec2(0.414, 0.461);   // where the fan of blades on the whale's back springs from
vec3 whale(vec4 f, vec2 p, vec2 pw, float t) {
  vec3 n = formNormal(f);
  // motion a: the key light swings across the glass
  vec3 L = normalize(vec3(-0.35 + 0.3 * sin((mOn(1.0) ? t : 0.0) * 0.45), 0.65, 0.68));
  float e = 1.0 - n.z, dd = max(-f.r, 0.0);
  float rz = 2.0 * dot(n, L) * n.z - L.z;
  float dirt = dot(n.xy, normalize(L.xy)) / (length(n.xy) + 1e-5);
  float gu = sat((pw.x - 0.12) / 0.76) * 5.0, gv = sat((pw.y - 0.15) / 0.7) * 5.0;
  // the glass's tint across the body: a 6 x 6 grid over the whale, read bilinearly
  float a0 = max(0.0, 1.0 - abs(gu)), a1 = max(0.0, 1.0 - abs(gu - 1.0)), a2 = max(0.0, 1.0 - abs(gu - 2.0)), a3 = max(0.0, 1.0 - abs(gu - 3.0)), a4 = max(0.0, 1.0 - abs(gu - 4.0)), a5 = max(0.0, 1.0 - abs(gu - 5.0)), b0 = max(0.0, 1.0 - abs(gv)), b1 = max(0.0, 1.0 - abs(gv - 1.0)), b2 = max(0.0, 1.0 - abs(gv - 2.0)), b3 = max(0.0, 1.0 - abs(gv - 3.0)), b4 = max(0.0, 1.0 - abs(gv - 4.0)), b5 = max(0.0, 1.0 - abs(gv - 5.0));
  vec3 c = b0 * (a0 * vec3(0.1885, 0.6292, 0.6707) + a1 * vec3(0.1435, 1.2844, 1.3969) + a2 * vec3(0.0645, 0.9087, 0.9925) + a3 * vec3(0.0204, 0.6345, 0.6958) + a4 * vec3(0.1554, 0.5621, 0.6007) + a5 * vec3(0.1296, 0.4893, 0.5235))
      + b1 * (a0 * vec3(0.0002, 0.0361, 0.0397) + a1 * vec3(0.0014, 0.2754, 0.3029) + a2 * vec3(0.0004, 0.087, 0.0956) + a3 * vec3(0.0006, 0.1131, 0.1244) + a4 * vec3(0.0132, 0.7317, 0.8036) + a5 * vec3(0.1793, 0.5644, 0.6005))
      + b2 * (a0 * vec3(0.2409, 0.7115, 0.7553) + a1 * vec3(0.1203, 0.8104, 0.8779) + a2 * vec3(0.0166, 0.5399, 0.5922) + a3 * vec3(0.0613, 0.678, 0.739) + a4 * vec3(0.001, 0.2065, 0.227) + a5 * vec3(0.4368, 1.0973, 1.1574))
      + b3 * (a0 * vec3(0.2495, 0.4337, 0.4487) + a1 * vec3(0.1149, 0.339, 0.3598) + a2 * vec3(0.0906, 0.507, 0.5475) + a3 * vec3(0.3888, 0.7176, 0.7452) + a4 * vec3(0.4397, 1.0554, 1.1111) + a5 * vec3(0.2264, 0.4982, 0.5223))
      + b4 * (a0 * vec3(0.0008, 0.151, 0.166) + a1 * vec3(0.0, 0.0, 0.0) + a2 * vec3(0.0, 0.0, 0.0) + a3 * vec3(0.0, 0.0, 0.0) + a4 * vec3(0.0329, 0.2084, 0.2255) + a5 * vec3(0.1336, 0.3905, 0.4144))
      + b5 * (a0 * vec3(0.064, 0.2556, 0.2739) + a1 * vec3(0.0769, 0.269, 0.2872) + a2 * vec3(0.1164, 0.3385, 0.3592) + a3 * vec3(0.0994, 0.3149, 0.3351) + a4 * vec3(0.1434, 0.3988, 0.4224) + a5 * vec3(0.1778, 0.466, 0.4924));
  // the glass's thickness: a darker band inside every edge, deepest on the lower edges where the side face shows,
  // then a thin bright line along the edge's lip (strongest on the edges that face the key light)
  float ln = length(n.xy) + 1e-5, lower = sat(-n.y / ln) * sat(ln / 0.15);
  c = mix(c, SIDE, 0.600 * (0.55 + 0.45 * lower) * exp(-dd / 0.0030));
  c += RIM * 1.70 * exp(-pow(dd / 0.0018, 2.0)) * (0.4 + 0.6 * sat(dirt));
  c += vec3(0.0028, 0.0019, 0.0) * (pow(sat(rz), 8.0));
  c += vec3(0.0073, 0.0, 0.0) * (pow(sat(rz), 30.0));
  c += vec3(0.0086, 0.0, 0.0) * (e * sat(dirt));
  c += vec3(0.0, 0.0398, 0.0) * (e * sat(-dirt));
  c += vec3(0.0, 0.0262, 0.0) * (exp(-dd / 0.02));
  // the floor's light caught in the glass's lower body, strongest at the lower edges
  c += SIDELT * 1.5 * exp(-max(p.y - YF, 0.0) / 0.08) * (0.35 + 0.65 * lower) * exp(-dd / 0.03);
  // motion c: light runs through the fan of blades on its back, blade by blade, left to right: the bridges back to the
  // Mac (clipboard, sound, Chrome, git, MCP) lighting in turn
  if (mOn(3.0)) {
    vec2 r = pw - FAN;
    float u = t / uCycle, k = mRise(u, 0.0, 0.1) * (1.0 - mRise(u, 0.6, 0.74)), rl = length(r);
    if (k > 0.0 && r.y > -0.01 && rl > 0.03 && rl < 0.27) {
      float da = atan(r.y, r.x) - mix(2.95, 0.15, ease(sat((u - 0.04) / 0.64)));
      c += k * exp(-da * da / 0.02) * (SIDELT * 1.1 + RIM * 0.9 * exp(-pow(dd / 0.004, 2.0)));
    }
  }
  return max(c, 0.0);
}
vec3 motif(vec2 p, float t) {
  // motion b: the glass whale floats up off its floor and settles, with a slight roll
  vec2 pw = p;
  if (mOn(2.0) && t > 0.0) {
    float u = t / uCycle, a = 0.012 * sin(TAU * u);
    pw = vec2(0.45, 0.42) + rot(a) * (p - vec2(0.45, 0.42)) - vec2(0.0, 0.010 * (0.5 - 0.5 * cos(TAU * u)));
  }
  vec4 f = formAt(pw);
  return mix(room(p, pw, f), whale(f, p, pw, t), cover(f.r));
}`;$.likewiki=`
const float FOLD = 0.5035;
// q: concept coordinates (x right, y down); each field shades from a to b along dir across its width
vec3 field(vec3 col, vec2 q, vec3 a, vec3 b, vec2 dir, float m) {
  return mix(col, mix(a, b, sat(dot(q - 0.5, dir) + 0.5)), m);
}
vec3 disc(vec3 col, vec2 q, vec2 c, vec2 r, vec3 a, vec3 b, vec2 dir, float m) {
  vec2 o = q - c;
  return mix(col, mix(a, b, sat(0.5 + 0.5 * dot(o / r, dir))), cover(sdEllipse(o, r)) * m);
}
vec3 motif(vec2 p, float t) {
  vec2 q = vec2(p.x, 1.0 - p.y);
  // motion a: the discs drift
  float dr = 0.008 * sin((mOn(1.0) ? t : 0.0) * 0.3), u = t / uCycle;
  // motion b, never repeating: every disc travels on a slow path of its own (each axis two periods, all unequal) and
  // grows and shrinks as it goes, never in step with the others; motion c: all of them beat twice together, like a like
  // landing
  float G[7] = float[7](0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0), S[7] = float[7](1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0);
  vec2 D[7] = vec2[7](vec2(0.0), vec2(0.0), vec2(0.0), vec2(0.0), vec2(0.0), vec2(0.0), vec2(0.0));
  if (mOn(2.0) && t > 0.0) for (int i = 0; i < 7; i++) {
    float f = float(i), sg = i % 2 == 0 ? 1.0 : -1.0;
    D[i] = vec2(0.07 * sin(TAU * t / (17.0 + 3.1 * f)) + 0.03 * sg * sin(TAU * t / (7.3 + 1.7 * f)),
                0.05 * sg * sin(TAU * t / (13.0 + 2.3 * f)) + 0.025 * sin(TAU * t / (9.1 + 1.3 * f)));
    S[i] = 1.0 + 0.3 * sg * sin(TAU * t / (11.0 + 2.9 * f));
  }
  if (mOn(3.0)) { float h = 0.016 * (mBump(u, 0.03, 0.11) + 0.65 * mBump(u, 0.13, 0.21)); for (int i = 0; i < 7; i++) G[i] = h; }
  float top = cover(q.y - FOLD), bot = 1.0 - top;
  vec3 col = vec3(0.0);
  col = field(col, q, vec3(0.8879, 0.8796, 0.7991), vec3(0.8228, 0.7913, 0.7157), vec2(1, -0.01), top);   // #F2F1E7 .. #EAE6DC
  col = field(col, q, vec3(0.0116, 0.0423, 0.0319), vec3(0.0103, 0.0395, 0.0284), vec2(1, -0.002), bot);   // #1C3A32 .. #1A382F
  col = disc(col, q, vec2(0.2263 + dr, -0.0418) + D[0], (vec2(0.2715, 0.2715) + G[0]) * S[0], vec3(0.2542, 0.3968, 0.3419), vec3(0.2502, 0.4508, 0.314), vec2(0.0028, 1), top);   // #8AA99E .. #89B398
  col = disc(col, q, vec2(1.0273, 0.5805) + D[1], (vec2(0.1596, 0.1596) + G[1]) * S[1], vec3(0.0595, 0.1845, 0.1119), vec3(0.1329, 0.2789, 0.1912), vec2(0.0028, 1), top);   // #45775E .. #669079
  col = disc(col, q, vec2(0.2766, 0.5296) + D[2], (vec2(0.0695, 0.0695) + G[2]) * S[2], vec3(0.2664, 0.4621, 0.3419), vec3(0.159, 0.3231, 0.2346), vec2(0.0008, 1), top);   // #8DB59E .. #6F9A85
  col = disc(col, q, vec2(-0.1446, 0.5953) + D[3], (vec2(0.2337, 0.2337) + G[3]) * S[3], vec3(0.0319, 0.0865, 0.0648), vec3(0.0232, 0.0666, 0.0423), vec2(1, 0.004), bot);   // #325348 .. #2A493A
  col = disc(col, q, vec2(0.5118, 0.3866 + dr) + D[4], (vec2(0.17, 0.17) + G[4]) * S[4], vec3(0.3419, 0.521, 0.4072), vec3(0.1022, 0.2462, 0.162), vec2(1, 0.001), bot);   // #9EBFAB .. #5A8870
  col = disc(col, q, vec2(0.7234 - dr, 0.4285) + D[5], (vec2(0.1966, 0.1966) + G[5]) * S[5], vec3(0.1779, 0.402, 0.2664), vec3(0.0437, 0.1529, 0.0976), vec2(1, -0.003), bot);   // #75AA8D .. #3B6D58
  col = disc(col, q, vec2(0.5783 - dr, 1.1004) + D[6], (vec2(0.3118, 0.2655) + G[6]) * S[6], vec3(0.3813, 0.6795, 0.4969), vec3(0.0, 0.1274, 0.0666), vec2(0.9999, -0.015), bot);   // #A6D7BB .. #006449
  return col;
}`;var ge={O:[296,251],A:[175.5,176],B:[189.5,189.5],orbs:[[447.38,128.86,50.57],[144.3,379.24,62.16]],specs:[[[420.5,111.5,7.5,1.8,-44]],[[103.3,355.3,4.1,2.4,113],[118.4,355.2,5.3,2.1,-31]]],ring:[273.15,319.94,252.39,42.16,28.18],mark:[61.9,62.5,28.26,29.85,.61,81.6,42.8,4.92,43.5,81.9,4.6],halo:3,rlines:[1.5,-.5,-3,-6],rwidth:7,rwide:16,qlines:[.53,.47,.42,.37,.33],qbody:.42,haze:[309.71,247.63,212.7,112.25,9.54],hazew:4,hazeo:[0,-9],boxes:[[0,0,1],[.0348,.0348,.1481],[.19,.095,.67],[.6781,.1232,.2026],[.1269,.5362,.2491]],blocks:[[0,32,.09442,-.3678,-.9846,.01386],[0,16,-.1039,-.01275,-.2663,.006139],[0,16,-.03031,-.01419,-.2709,.004879],[0,16,-.0124,-.003555,-.04283,7861e-7],[0,16,-.06221,-.01746,-.009538,.001022],[0,16,-.109,-.01869,-.06972,.00303],[0,16,-.2462,-.01543,-.06156,.004869],[1,6,-.008878,1574e-7,1501e-8,1355e-7],[0,12,-.05007,-.03158,-.2082,.004091],[0,12,-.06287,-.009587,-.03577,.001628],[2,40,-1.529,-.5614,-1.765,.04486],[2,12,-.3301,-.03156,-.1518,.008309],[2,12,-.1594,-.02311,-.2774,.008556],[2,12,-.2921,-.08164,-.3372,.01082],[2,14,-.3334,-.0223,-.2642,.01277],[2,14,-.0749,-.001672,-.05259,.00243],[2,14,-.05625,-.008353,-.05103,.002024],[2,14,-.07371,-9065e-7,-.06319,.002402],[2,14,-.08277,-.009305,-.03207,.002084],[2,14,-.04964,-.001518,-.04783,.001814],[2,14,-.1637,-.03641,-.03165,.003095],[2,14,-.05213,-.03607,-.1703,.003984],[2,14,-.1532,-.002683,-.02721,.003715],[2,14,.01091,-.02244,-.162,.002836],[2,14,-.04687,-.01163,-.06686,.002486],[2,14,-.06846,-.002023,-.04976,.002079],[2,14,-.05752,-.03734,-.009038,.001311],[2,14,-.0156,-.01294,-.06682,.001288],[2,14,-.1015,-.007801,-.01546,.001745],[2,14,-.07602,-.001494,-.002643,.001313],[2,14,-.006524,-.01437,-.05941,.001087],[2,14,-.006755,-.00616,-.01155,2601e-7],[2,14,-.0458,-.007421,-.003065,8761e-7],[2,14,-.04809,-.007799,-.01403,.001028],[2,14,-.009638,-.005444,-.02619,5353e-7],[3,20,-.9164,-.1227,-.2551,.02216],[3,8,-.07214,-.003328,-.05393,.003568],[3,8,-.1368,-.01332,-.01051,.003251],[3,4,.3132,-.03385,-.5579,.002695],[4,20,-.2857,-.06565,-.2766,.01495],[4,8,-.03184,-.0057,-.1126,.004751],[4,8,-.01902,-.00511,-.05325,.001821],[4,4,.3819,.002312,-.6309,.003406]],chroma:1.5,alpha:"()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_abcdefgh",data:"D(~+d*F*a)G*E+D-B/B-D+F)a*E+F*~-C~H=GFGGFFHGHFEFGGGGFGFHFEFGHGFEDEJFKFGHFGGFFGEFEFFGCGFGDGGEFFEGGEbENEFHGGFFEGEGFFDIEEGEGFEGFFEFFD~H0FNEJDIEGEEFEHEGFHEEFEFEHFEEGEDE~H9HMFHEHEFDGEFEHHIDFDEGFDGFFFECHC~H?IJHGEGGCFDDHIGHK=N?FDGHHEDAHEFD~HEIIGHCIBGBHI@FJKJFDAEFGE:HY@>FGD~HJJGFEGHBEG@?QLHHKCED?BHA;I?GGE~HIFFGEJDFF9QV;?CRGDGBHEEDBHDHHF~HBEHGBMF@E[9+HLSPD4I@>GLa<>O>HFII~H7CKEFO=RL)CVGGFT-6c;I?CK?PFHILIgDMCJHKD,WQ9DCVc~FVCG2VBGF;IWGJKSCOAMRFEJ?5NI=S8@~H5~Fe~FcTISO;@XFT:DPBKX4BCSJ;B4>0~H7~Fd~FXJ>QeB:WP~F^EQ>PLGJ?4@>OJ~FQC,HT>R~H(+^I~FLENBLN?OGMH@<Y1~FgVFCR?VNFd:G~F^HHGFNGKCHEM>AZ.:NEDFFPX)~HM*<DEKBFGHHKNJJCH?AP-Be;?DILG6~H>+BLC^G@GGEGNF7E_JHALF>B=PO8J?G~H/)<a<IgDDFFCHH4=X>JBRW2+HMUALX~FeEY=LE~H/GDFEEGA9ZIGHPK5LHCGL=/SN>PFF~H1JDDFEFM0GSFJHT:=NEHFDfG~FWRVEGI^LCGEDDV?0IZDLNEV1Z>E@>E:~H,Y~FUULGGCKFDCHEHR@FEELDESCC=IDBLN:X9BRNL~FeHFGBGGFGQBED>HIOR2@BELENDdG~Fb]HW~FUHEEGDFKH?C@CCPH~H(7H?D@B7NKODGOIS.GFFDFK>PH~H)~F[ACGF~H*~FXb=FEG~H(O~FX@ELJKQTECJCMI;I@cCJ(GOg~FU_DDMH?4UKD@EJG~H3FHDGECW39UAf(IK~H,~FaB~H6~F[J7LNDCIIGEH~H>FFFGHEW.K?GFGTHCDE~H0~FWHHF?HHFFEKC~HAHEGDJ?U>AIJIEIK7FEGZ=?DIDCGEIEF~H5GFGHHINA<CELMDA=EVNPCEB??DFCCEO]YGGFGHGHFFGHGGFFGGGGGGHGGFGGGGHGGGGGGGGGGGGHEHGGFJEGGGGGGHFHFFHEFGHGGGGGGHFHFGFIEHGGGGGGGHFFHGFFHHFGGGGGGHDIFHGGGFHGGGGGHFFHGGFHFIFFGHGHGEHGHFGGGGHFGGHFGHFGGGFIGIFFHGGGGGGGGGGFJDIFGGGHFEIGGGFIGJDHHEJDGHGHGFFHGGGGHFIIHEDGGGEIFIGGGGFHHFHFFGHHFHGGGFHFEFHGFGHHGGGGGFHGHHFGGGGGGFGHGFFFGGHEHGGGGGHGGGIFHDHHFIHFGCJKDDGFHGGBHFGGGHFGHFGGFHIGGJBJFGEEHGGFGGDFFIFHGGHEGGHIFFGHDDHFHGGEFHFHDFIFGGGHHFGEIHEGDJECFHGGIEEGICFJEHGGHFGHIHFDCLFCGDHHEEKGAGHHFJEGGIFGGGEHEFEFEJIBKAHHHFHGGEHFIHFGIIEFDHICNCHEFGHGGGGFIGFGHHHFIJEFEGFELBIHEGFJFFHHFFHHHGFFIEIKIAGHEGHEJFEFHFJFHGGHGJGDGJEEHIIFGHGCIFGHEEIEHGKFGGGGGFGGIFHJGDGHGFGGFGGFFGGHJEHGGHHGFGGGLEFGFHGFGHFFFGGFHGIFGGIFFGIFGELDIGEGFIFGGGGFGEGIEGHHFIGFFGIFFHHEFIJHDEEJGFHGFGGIGGFGGGHFHFFJFFGHHEGILHCCHFHHFFGHGHEGIFGHFHGIEGJDHJEEFFHGHGGGGEFIHEHIFGGGGGIFGGEHGHGHHIEBFIGHGCHHGGFHFKEDLHFGJCHHDJFKIGE@HFHFHFHHGFGGGHHFGFKEJBGKLEJEDFEHFFFGGIGGHFHFHIEEHGKCMBFKIL>GGGGGFGFHEHGHFHEHHFFIFHDNDCFMHGDJEGGFFGHGFHFHGGHFGGGFGIIJBEIJNEBEGGHFFHEGHIGGGGHGGIHGFFFFHLE;>LOLJEFHGFHHHH~H9IHGFHGDEHJIGFFGGFFJIFFGEEKLJHA7ELIFGGGHGHGHHHHGHIFIGHGGIGHFEID~F^GLHGHFFIHGHHHFHJEGIHGHGHHHFGGFI~FOIJIFFGIFIIEKDJHFGHIGIGHHGFGHDHJ~FNIHHFIFHIHFJGJEFFIGJHFIHFGGHGGEH~FQFIGGIFHIHIJEFGGCOBKIIGGGIEGFFHG~FQFKGDKFJFLFELIDDEJGKHHGIFGCLEHEI~FMELHHGFKGIJM@DGEELEJKJI<@TDGFI~FIIKGHEIHHOA>NMHAHHIHHFK9GSGEFK~FHJHGJDGLG=NYGD?CCIQPJGF3BOJOBGFJ~FHGHHIAN@DZJ>EHH@B>ONELKDI?GFEEI~FHHGKEGCJX<AQHK=/M:WR=IHILAAFFJ~FFHHIF@HHENPBHM4?;Bga=DBCNE?IC~FPIGHG>QLH@FNJG9><h~H(GHB7LN<E~FdHELDFEENOLJ@:dXZI=MA1Z8I/HGIFEKBGEGKN8=^RNI=M=DH6NJ~FeDJIGHFEJCJDMM4@RZLGGEC=[~FZXNN~FKENHFJJBEGEGEMN5AJPWHJEEFR~FfYJDG~FGFOGHHLF@JLBFDLE6ET_>CPEKH.ZO7KI~FGFQGFJIB?9NNDM9>ZXFC>JF<]J9MBK~FCJMGHHJ@JSHFFAERDHIGDLV?BL?GK~F@JHIHGIAAJRLDF>QMBIFIH5Gd>AJFH~FDFIHGHJBEJEERDBH>T<MHKLIO1<dAEEK~FQDJHIGGIBKHFKBJG@GLMFJJCCN<OGDDF~FcDLGIGHHGAKHIMGEB@TKLFCHEG8HY>FA~FgEOGGHHGGLHLHKAH2QGKILJPCDEEBFGC~FYHLHHHFKBG3eKHGH0h6NHGI2CfDBIFDJ~FMJMEIDENHK6JDZJA2~H)9HICGLT=GHBHFH~FMELGHIK=TL?M7YEF/bK)eEPCBHGFEGFI~FMGNFGGH?WALEIHDEIIH.gEDIJFFFGFFI~FRGLFJFLBLHDIFKDDRGIG;NNGCFFHFEHF~FcFEDGFGBFHIIFGHIOK>A=EKNPMEDFGIGA=~)++4.2.2.**/202/12.3-ZRCKL??LOKIFAJKIHJJNIA:GEMTM@;?CFJ=PF>=FKMGB9IBBO[O;7IUbN/4BSJ;<IGGFGHHFGGGHHGFGGGIHFFGGGIHHFGGFFFIHHFGGDEHEHHHHGDDGEIHEDFEHFEG~H)IECLMCBEEHKFDFGDEEFKNHICADKMLJHEMBGKKIFEHIOEHHB<FQPH=8FWSM?FON=~)+*5.2.2.**/202/12.3-ZJFMDBIHILLG@BFGSP@<CAF>OHDKGC?AG;OSNHB>EE>?OPXTG>;44bR:58+PA=@IGGGGHGFGFHHHFGFHHHGFGHGHHHFGHFFGHIGGHFCFGFHGIHFCEHEHHEEFEHFFG~H/HCJJFEFDEHJIGGABJLJLHLBFFFHKMKFMAAEHKLHGKNBC>?EMQQQ7>OVPWAJOL=~)+*5-3.3-**0101102.4,ZUFMGD@DKWM)8PIW+AFKF,NU>>JQF:?RJEKPN;56LMM]<==9Q_-?R*:CQIGGFFJIHFFJKEHFHJHEGGFJLEGIFCIIJFIIF?FDGIKH>DHEKJBCFAGEF~H.GCGIJKE>AWW@E:VOJEGW@AQKEDGLPAFF>CHJSR?7AKMHRWAH]B=XRE>=~),)5-3.3-*)1101102.4,Z~HH?HNEFB8LRMINAKPJMUCG9GPPQIQ=1@SRRGJ[?GB<DeXV9.:~H,dc<WVRHGGFGGHFEGGFGFEGHFGDGFFDHLGEEDFDHOJIEFFGLJFKFEHIHJFHHKLFBHGIOF@AGEOH?D=>OKOB:;AJ<RXI::?KF3MIMME4:;UVI/50L==;~)++4.2.22/3/2/11/3-Zd@KR<:CNTMH?/=WIVM~Ff3HQMIJ=K;99HOIINLE@=EOGELRHJDIOFC@VKLLJF*M]BD6GTKGGGFGJHFGFHJJEGFHIKHDEFFHGHLKEDEEEGGLJFFGCBEICIHJJE>CHDJLH@BFAHEDF[LE?MQIC?CGMVM=F?E]RFACEFMENOQGADFCEHKOI?FIDAGFIF?HKK?ECCEHYD;KHQH@;~)+*5.2.22/202/12.4,Z~HAI=OMBBE@>GOJIF45FUZRMKFU55M[RRTJ?g<IKNVRCFF]BC=DR[PEU<JaQDXMLFIGGGFHGGGGFHGHGGGHIFFFGGGHIIEEFGFHFHFFGGEHGGEGGHFEGHGFGEFHHGGGHLFLCCJJHLLGBEFGSQG?=@CDH>RRD<@??EL5NGDB>?JIG:KIMI?<CH>NE8CI<DEG1+)+,*2*,/~HF16FZ9-Ic~H,F~Ff1G_W9GUGMLHBLNGA;GRMGABKGCHQMF?NQD;:HVPF=?MGB7B/-1*2*2+1+1-.NbSD7CIEMeE~Fg@MBAFDNdP3?KBBFEARVDCKRK?MIKCFNd_3LFDBFM[[:IDGJOKLFGHGGGFFGIGHGGGFGFGHGHGHFGHFGGGGGEHFGGGGGEDHGGGGGGFEHGGGGGFc@IPJFHC6I[JDLLFHB7ASKFMKFHK?=HKEBDKBDDJID67TDGHKHD::OGIHEBD7C.-0+2*2+1,0.,O~H1IMJCAFHBUPA;FFG><USDERDGD:7NUMTTAE74RVKXX>O=MOGQTBSGHIKGGGFGHHHEGEGGHFIIGFDFFIGFGKHFFFFHHHJGEIHHEHHFGIHFFFGHGSFDEHLHFI?AJPHHHKM>?IJ@IGJOOB>DA=KHQQ@=E?>JAMCBGB@I@GFF~)6e)N+M+L-K-K-K.I/I0G1G2E3E4C6@9>;:@5F0K-K.J1D6@:<=9@7B5D3F1G1H/I/J-K-K-L+M+M+e~H*Z;2>B?GU8^aIT8S~H?PEFA~H6L>GCd.QI8P@]5O>8TET:7eK1DZ2d?~FUT80UJ?H~H+~FHL~H*N1CU>U0~H,?~F_P4>MN?T:Jf1A[:8IOEELH?QY?>DV<6JJLCIFO?HSPJ;4OH<LDOEGFHHS7MRNJ76<NTGAJBQFEHFHFMT7FOQLH8HVA1HJDAIHLGDIFHEIHJUD>HMKB1>SHMF?DOMBFLHGDFHGGGGGIHGNOEELLK@7DOACIOMTE>IECBFGIEHGGGGGGJFFJN?ICNGDJGQ[93QPEEHIDEDHGGGGHGJEGJE=QLQL8=CM9@ZSJAHLGHDHGGGGJCFK?FYI@A>RPPIJ@@LFKDGHFKCFI?I~H-9AH>CPN?7OFHEHHJ@HAN~H(3~FfR8NYC0SCHEMADDLf5~Fg<SZA/^9JIAALZN0BM[6EL=P8F]X7FQP2S>I6YXF=^8EL5F_H<XP?K+b;NPBFC:Y~FZ2WHA@V~Fg>Z4?]NR-RD;REBFP<.c~F^~Fe34/OIGFGFGGIEHEGGHFDGGHGDGGHGFDJFIFIF?IEGGII>KFKDIHELAKFKFHGFJCJHCHHFHHDKEENFJEHIEHFL@IGFHHEKEGFGHK?FGJFIHFHGGGFGHGJA@JLHGHFFJFGGGFFHHJCAJKHGFFHFFJFGGGFGEHGHKEDGIEHJFEFHGGGIFFHGGGFGDJFFKGEHFHFGGGGFFHIGGGGFGHFHGGFGFFHHFHGGGHGGGFGHGFGIHFFGFGHFGGGHFGGGGFEJFHGGGGIFFFFHFGGIHGGFFGGGHFHFGGGGHFHGGIFFEGGHHFFFJFHGFGGGHGFHFHGGIFGFEEIGHGEIGGGFGGHFHFIGDN@JCGHDGHHHFHFHFHFIGEM@GJCIGFHGGIEHFHHDO>HLGFGHGGHFGIDNAEIHGFHGHFHFJG@LGGFHIEHGJC@FGGHHFIH?HHFGHFJDCAMFGHGFJHHFIGFIEHIEFGGIEHFGIEFIHGIGGHGeIPCKK@HJL=6GILC~FeDPEL)FREJ5Q?OOBL9OGQMCG>NK3PRI?P8Je?ZU>HJG0~H,<4IYFAM>T1KZFWLCEL>OE4UC<TSBFIGEEL@;JGIBPUBDJGGFCKG>ADHUGGPBDKFGGGF?QC?BCKQLHFFLCGJDGHHFGC>RGB@BELF@KWIHGKEGHCHGIFHEGE=JLFCDIRJ>FGKLJEBJHEFHEIFHHFHFFFGACHICEEJQGCIOKAE>FNFIIKGGEGHGGGGGGEHFEBMEICGJGH::PWCAHIFGJGJFEHGGGFEIFEIN@DACPJBFHMABFJGCHFIGGGGEGHIDLH;FIJJ?;CJHLLCHEHHFGEHIFKG.PGBKDGEMPBIFGHGCMFJD1RX<JH>LU>KFHCLIHE2STHF>KV:OFEKJF8CPEI<RIDLBQI7=LCGBU?LGQ;<CK;RHCSH8CJBBNBZ8I>?MIIO<VOCJJK>PK?SL7I=XA<ICIH<@PS7eYQYPA-*1,0,/-.0+2*2*2,./,0,1*-~H/HFHKEMEEEQQ@5GWLM>3JSJMN8CC;GYY>EE9EH90X~H/H>CBML;(JhPKLED<E>;FQGDFKPGIGGGGGGFHHEGHIHDFGIKGDEGGGHJIFCFGGHGHIJFBEGHGGHGJICDGGGGEJGGFEHGFFGHGSFFGHHCHNH>AKSG?CCLQFCFDFJGJMGA@IHKKEGOQ?7FKIIDCMWD:BEDEFOJKJDEGIEECGA-*1,0,/.,1+2*2*2,./,0,1*-YHHJJDMJG@RPB9?GXRQI93=FJUYE?65<CHNFTB<:9<CJN9LF@???FML:DAEFJDDHIHIHFIGIGGFGHFGGHFGGHGGGGFGGHGFGGGGFGHFGGGGGGGFGHFGGGGGGFGHGFGGGFFHHGFGGGGFGGG]FGEGIDFJJ@CLQKC<BCHRTLDA@?KNSRMGB?HBMQQPLFA?NFKPOLJB?ALONHC@FMEABKEC>G=9*1,0,./-0,0,0.,0,1*9~H-G=VQ;9O~H+@+@;E~H1S>>BOCVaT5ECVDP[X8QBADfRG?KJfDTRO>EGMGFHFGFFGIGFDFJIGGFFFJHFFGHGFFFGHHHGECGIHGEDGFGEGFGTGM<AQOA2MYJMH1ALMI@IA:@QHI>HC=>NAJKJ7@GJEG7G?BCKGGA<*3+3+3+10,3+4+2/+3+3+4*<~H6DE_=BQA;?IKGHGGIKJAD>LOHCEQTAGB>MRHADRYA:ICJLIEELNEDFHBBJE6LNIIGGHFGGGFGGGGGGGGGGHGFFHHGGFFHGGFFHHGGFFIFFGGGGHFGGGGGGGGGGGGGGNHG?KJCILKEEGFGGFEFIILEBFIIAAKGIME@GJI@?KMGIFEFHHDCIIHFHJEGMEDF7<)5*4+3,2-2-2,~)?~H(FE?AK=:YVLEeI7_b/.R17?QHFGGIIMNDAGMBCE>EGHGFGIG[PEDI@CNB>FL<BN::SW@PQNA7<)4+3+2,1-0-1,~)E~H)AHHN<FP^R15HPZ;~FaRZAMEQ[FIGEHHEHHHHEGGGHGEGIFGGGHGUHEHEJHF=AQSI@;L[FCG?GE@F7~)?,2-2,3,3+3+4*<fDHFGBH?UIAR^We?+~Fe*THUJTCGGHGGHHFGGHGFFGGGHIFFHFEG[ICGGJ@LBCGD=B:OT[X=C<FAI7~)E,1-0-1,2+3*4*<~H+]A?85~H6P2J>1R_OJ5@8OE~FaLNIIHGGFEJHFHGEGHGIFEEHHHGGGS>JIKP4FMEDRH@EDLMPCFfC@F5J*4+3+3,2.1-~)?eD3?Y?J[gU7DI@3ef5BCc^2IFFFHFIHKKECFKDCGHBFFGHbHSM7IJ85COGBMZ:-MIO:4O5J*3+3+1-0-1,~)E~HHE2HN14cbD.2cXFMF>GFNJOGEGHDFJJFBELJFGFFGFGHGHSEDQP:9GTV:<DCFRGEEE7~)?,2-2-2,3+3+4)=cI4FJG*TO:CZJ<NWP=La7Ab6~FfMEFHFDELIIFKHEJGEHEEIHGGH[CPKFASJEQHCFLH?CLC:PJ:PY7~)E,1-0-1+3+3*4)=~H<93Q[W7~FdUVILF9<DM1Da?McJFEGLKCBGIKICDHHFFGFEGGJNOA>DOU>?FHHKQHASI7FE95J*4*4+3,2.1-~)?GGUIUN57YV/C~H*^*6:1R<E;LGGGGFGEDJIGFKFFGJIEEHgG8GFCVW==UJ2;XONTANFM5J*3+3+2,0.0-~)D~H0CHd:B]>.@;VTFAL4JHF>KCKGGJFGHGGFCIHHHKCDGHGIFPIF=LG=MRIICDEIJLEGEIJI5~)?-1-2-3+3+4*JdKWB@FN[9:JJ34YIDTZa@=CIJHDEGLIADDHDFGGIFGIFDGWD?MLGA=WNIGWO;CJ@=>IJH5~)D-0.0-1+3*4*J~H.GPTF3>EYYE?@IWO;?Z5IFLTJNHD==MXICF=JVKNBGOFEGQNI<?PPPH7;POI>>YN1SF:E5J)5*4+3+3-1-~)@e~H,?6C/~FYEOHFFbILDGaGMDGGGJLGDGCCKIEDFJHb.LNJZ~H*I?IDA=IAFE<J5J)5*3+2,1-0-~)D~H<(OO~FcV~H/ACGTDESDEFFDLJGGFGHFFHGHDGIHHFEGHQZB@^?0IGIDHG=JJJFHC5~)@,1.2,3+4*4*J_L_P6*NeVEaILE>~FbTPO~H,GIEGHHGEGHGHGGGGIGHFFFWH;BMUH8AG;GDGJ[@AC6F5~)D,1-1,2+3*4*JPYK=2K~H)M4YGRA~H2K~Fb3H.GRDCIMJAAICIFE?GNGGMG~H*=DMTC4DS=G?K+EaPG[F3X*4*4+3-1-~)@~HH?~FFKIPZeNTI<GNRK=LHBGJHOVQ3@OLK1COGKbEI@L:CWOBOFQJA3X*3+3+1-1-~)CcLJ~FfTPAIEBZTAFAZTDKGIEGHHFBFLJFGELJF[DD]?CLDBGFAHHFEBG3~)@,2-2,3+4*X]AbVC;~H-^=dKKFA)SZLIFJHGEKHGJHHGHHGGF_K<=IO67L8FDGIX@8D3~)C-1-1+3*4*XPKXAB>G~H(@A[BL~H4B<DKFMJCGCNLCJEHDHGH~H-C;GMLC5GN?GC~FgKFKME*7024/6.6-8,8,8+:*:+8,8,8-6.6/4207*E~H=G5RWJGG79UEPXABGLR>@>M@AV?@HFIDbLA>[,BEGIIIKHJZIB=Q(ENHGGJJPOPO=6P>(~H1J~F]WCMJNKTND;I77Z0OHHILLQRFN27MP=8JKEJGNJBC_a~FX4CD~H(97DNDIIOC7RS_~Fc7N~H1//FQDIJP7DOTa*B~H6A/2RIIKIF<UOV~FWJ~H)N<~FgKRIJGWB[.N*5dC+2dAQPIJL2L<d<K2=~H0@MIOAM.2S?G2M~H(NA8HA8TY,.;7XL>LGFHGGGHFEIFIGFHFGHFHEGJEGGFGHGGGGEGFIFFHHGGFHGHGEHFJDJFEHFHFGGFHGHFHEMBFGHGFHGFGIEIFJFCIFHFGGFHFIFGIFFGHFHGGFHEHHDIFIJEFGGGFHGGGFHFGGFHMAGHFGGGGGEHGFL?KKBIFGFHFHEGGGFCEOBHFFHFGHEJFEJ@NGDIDHGGFGIEEFJKAFIEGGGHEFFFKHEGEGHFGHGHFEHHGGGGVGLJEFIFEBILL?IJFFFEFDJSG@MDGHFIAAH@JMAKCLEHEKD>DFGNRHKF@HEJABB@NGLLV2JX:LGHBE=DIIDTJGN:LFHFCB?HBUCOEGP>MEHIFEJH99^BIT7RFJHFHJ@MBEH7Y?F-XT>ODGDDOBFA7[D1I[HJEGCEJK@A?Y;E>TSHDBHE>I<RFJJ;J]EI@FADGAW=CDOKNH<AEFBL?KFFQRGG:BLKD?@INMPILA=I7+*,.*.)8).*.,*+PHY<6KXO[?-I]JAgE3BNA7EYLF@B=<6UR:ABAUR;9F1EGHFGGHFGHGGGGGGIGGFGGFGJHFEGGFGIEDFGFGFFFGEGTG@JOIBDBJSKACCAJQKEEEHGJJJIEBMGELJCFFDJMDGG7+*,.*.)8).*.,*+~H9F>TQ?:B4SaE5EB*JgVJJBI=HKVYL9dA1NYJG>3H[JTFJGHGGFGGGHGFFGHIHFEEFHGKGEEDFIEGFGEFEGHGFFEHHGRH?CHHQK8>GHLYK;<CFGGQIF@>DH9KSF7DDKRK9B>H/)*)+)+-U@T~HV~FPA~H+~FUKGEEJHFI~H>L>~FT~H*K0~H(MD,6024/6.6-8,8+:*:*:*:+8,8-6.6/4206,DfOLH+[]PAP=3P=FbC<GISKF3]P~FQ[BCFIJLVVB3W~Fe2R;PDILOWPLEEG~FZQ?_2HJLPM_R>1a~FPe(OK1LFMKTV_=15e1X~FVXG>KGJKVVUM*+IAZI~FeZ:DIGIKRUYR~Fb~FbDJfB~F[d1EEFKMGWPU~Fd~Fb?^fF~FSWD7IKCFJS_JD~FWDfR~F];J>HMDGPOZ2~H6>~H)W<~FUHIJIRNO~H(,~Fg~H,8^U~FU8NPMNVRC?~Fd0eb7(>aQJTL=9+,ZME2L~H,PBC/9,SW,5XEM.D9CKHGFIHEHGFKDCHJDIGGHFJEEGIFFHGFGGGIGGDEIFGGGHGGHFJGDFGJHFJDEHGHDIFHGEKJGDKBHFGHFGEHJCGLFFIK?IFGGFHFIFGFHJJDLBGGFGGGFHFHHGJLGCR>EFGGFGGHEIHHJEKGIHBHDGHFGGFIGL>KMDJ@IDGHEHGHEBFDNDGICGFEJFHIDK@IMCHEFHGGGGFECHLGEDFGGGGJFGKFLCEGGGGIEBIKIDFGFFHFFYJFCRFDJFDFEEVMAFLHDCDABCTY@GLBIEI@>F?H[JCP=LFIEC>G;AYaEK>N?HEEB:@NDC~H07YAFU<HFI>A6MN@LX?b=O?AIEGB@<FSCK[?HUEJBI?KDE@>@ZFHW9Ig3Y@DBGGFBBBTEHR5Ih=KOGE=FDF=EJHC;@eNDNCBJFAC=O5AE;OhEIAH@DC1XX)HB<~H*NCAF@=?IPKEH=RYN7@E?FKKDFKIMSC1ALDMCBLFXS9D9ARP@7+*,.*.)8).*.,*+GHdI4ENFXT0<JAA~H*V:9=;;F_SF<98A6QJDA=?KJGEC:HHGGGHGFGGGHGFGFGGHGGGGGGGHGGHFHGFHGGGGFHGGHGYF@GMIFFBENMGGC=ENNJHFGAGKLJHEOGHIGGIHGHFFGG7+*,.*.)8).*.,*+]EBPa;1>SH_=*<YXJJF<ABFUJBQbD~FaGD9LbL;C?FULFFIGHHFGIFFIHGHFCGIHHFFEGHHHFEFHGHGFGFGGGGGGGG]GHNCEFF=SIEFH:<MSJHHDI@IPIAGMLJQG>DMKOG>CCG/)*)+)+-U@Z~HP~FNAh~FSHGHGEGFF~H9K>~FZhJ3f"};$.topshine=(()=>{let e=ge,t=1/574,o=h=>(+h).toFixed(5),c=[],n=[],s=[],i=0;for(let[h,v]of e.blocks){let[u,m,D]=e.boxes[h];c.push(i),n.push(v),s.push(`vec3(${o(u)}, ${o(m)}, ${o(D)})`),i+=v*v}let[a,f,E,g,p]=e.ring,l=p*Math.PI/180,b=e.mark,x={halo:3+e.rlines.length,star:4+e.rlines.length+e.hazeo.length};x.orb0=x.star+5+4*e.qlines.length,x.orb1=x.orb0+4;let H=([h,v,u])=>`vec3(${o(h*t)}, ${o(v*t)}, ${o(u*t)})`,G=(h,v)=>h.map(([u,m,D,P,S])=>{let q=S*Math.PI/180;return`streak(${v}, vec2(${o(u*t)}, ${o(m*t)}), vec2(${o(D*t)}, ${o(P*t)}), vec2(${o(Math.cos(q))}, ${o(Math.sin(q))}))`}).join(" + ");return`
const float CPX = 574.0;   // concept px per cover unit: the fit's widths are in concept px
const int KW = ${Math.min(i,2048)};
const int FO[${c.length}] = int[${c.length}](${c.join(", ")});
const int FN[${n.length}] = int[${n.length}](${n.join(", ")});
const vec3 FB[${s.length}] = vec3[${s.length}](${s.join(", ")});
const vec2 SO = vec2(${o(e.O[0]*t)}, ${o(e.O[1]*t)}), SA = vec2(${o(e.A[0]*t)}, ${o(e.A[1]*t)}), SB = vec2(${o(e.B[0]*t)}, ${o(e.B[1]*t)});
const vec3 ORB0 = ${H(e.orbs[0])}, ORB1 = ${H(e.orbs[1])};
// the star's tips (concept coordinates: top, right, foot, left), where motion b's flares bloom
const vec2 TIP[4] = vec2[4](SO - vec2(0.0, SB.x), SO + vec2(SA.x, 0.0), SO + vec2(0.0, SB.y), SO - vec2(SA.y, 0.0));
// motion c: how far each orb has slid (concept coordinates), set once a pixel by motif()
vec2 OFF0 = vec2(0.0), OFF1 = vec2(0.0);
const vec2 RC = vec2(${o(a*t)}, ${o(f*t)}), RAB = vec2(${o(E*t)}, ${o(g*t)}), RCS = vec2(${o(Math.cos(l))}, ${o(Math.sin(l))});
const vec4 MS = vec4(${o(b[0]*t)}, ${o(b[1]*t)}, ${o(b[2]*t)}, ${o(b[3]*t)});
const vec3 MD0 = ${H(b.slice(5,8))}, MD1 = ${H(b.slice(8,11))};
const float QL[${e.qlines.length}] = float[${e.qlines.length}](${e.qlines.map(o).join(", ")});
const vec2 HC = vec2(${o(e.haze[0]*t)}, ${o(e.haze[1]*t)}), HAB = vec2(${o(e.haze[2]*t)}, ${o(e.haze[3]*t)}), HCS = vec2(${o(Math.cos(e.haze[4]*Math.PI/180))}, ${o(Math.sin(e.haze[4]*Math.PI/180))});
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
void weigh(vec2 p, float t, inout float w[${c.length}], inout vec3 extra) {
  vec2 u = vec2(p.x, 1.0 - p.y);
  // motion a: a glint runs round the ring and caustics shimmer in the star, fading in and out over the cycle
  float live = mOn(1.0) ? mRise(t / uCycle, 0.0, 0.12) * (1.0 - mRise(t / uCycle, 0.86, 1.0)) : 0.0;
  vec4 f = formAt(p);
  float cs = cover(f.r);
  vec2 uo0 = u - OFF0, uo1 = u - OFF1;
  float c0 = cover(length(uo0 - ORB0.xy) - ORB0.z), c1 = cover(length(uo1 - ORB1.xy) - ORB1.z);
  float o1 = c1, o0 = c0 * (1.0 - c1), st = cs * (1.0 - c0) * (1.0 - c1), gr = (1.0 - cs) * (1.0 - c0) * (1.0 - c1);
  // the ring: its edges, its fill and the wider band inside it, in front of the star on its lower half
  vec2 d = u - RC, o = vec2(d.x * RCS.x + d.y * RCS.y, -d.x * RCS.y + d.y * RCS.x);
  float rd = sdEllipse(o, RAB) * CPX, ringW = gr + st * sig(o.y * CPX / 2.0);
  if (rd > -26.0 && rd < 8.0 && ringW > 0.0) {
    ${e.rlines.map((h,v)=>`w[${1+v}] += ringW * line(rd - ${o(h)}, 1.0);`).join(" ")}
    w[${1+e.rlines.length}] += ringW * sig(-rd / 0.8) * sig((rd + ${o(e.rwidth)}) / 0.8);
    w[${2+e.rlines.length}] += ringW * sig(-(rd + ${o(e.rwidth)}) / 1.5) * sig((rd + ${o(e.rwide)}) / 1.5);
    float ang = atan(o.y / RAB.y, o.x / RAB.x) - t * 0.9;
    extra += vec3(0.9, 0.88, 1.0) * 0.45 * live * ringW * line(rd + 1.0, 1.4) * exp(-pow(abs(mod(ang + PI, TAU) - PI) / 0.35, 2.0));
  }
  if (gr > 0.0) {
    w[0] += gr;
    // the brand mark's halo
    vec2 m = u - MS.xy;
    if (dot(m, m) < 0.01) {
      float md = min(superD(u, MS.xy, MS.zw, ${o(b[4])}), min(length(u - MD0.xy) - MD0.z, length(u - MD1.xy) - MD1.z) * CPX);
      w[${x.halo}] += gr * exp(-max(md, 0.0) / ${o(e.halo)});
    }
    // the haze ring behind the star: a soft bright band and a darker one just inside it
    vec2 hq = u - HC;
    float hd = sdEllipse(vec2(hq.x * HCS.x + hq.y * HCS.y, -hq.x * HCS.y + hq.y * HCS.x), HAB) * CPX;
    ${e.hazeo.map((h,v)=>`w[${x.halo+1+v}] += gr * line(hd - ${o(h)}, ${o(e.hazew)});`).join(" ")}
  }
  if (st > 0.0) {
    float ds = f.r * CPX, thin = st * smoothstep(2.0, 6.0, -ds);
    vec2 q = (u - SO) * CPX;
    int s0 = ${x.star};
    w[s0] += st; w[s0 + 1] += st * line(ds + 1.0, 0.9); w[s0 + 2] += st * exp(min(ds, 0.0) / 6.0);
    // the body (inside a crease level) fades where the arm is thin, so it never runs up an arm's axis as a sliver
    w[s0 + 3] += st * smoothstep(6.0, 20.0, -ds) * sig(-crease(u, ${o(e.qbody)}) / 1.5);
    // each arm's spine, from its tip to near the centre
    w[s0 + 4] += thin * line(min(abs(q.x), abs(q.y)), 1.0) * smoothstep(40.0, 70.0, length(q));
    // the creases: each level's line in each quadrant (upper right, upper left, lower left, lower right)
    vec4 qm = vec4(sig(q.x / 0.7) * sig(-q.y / 0.7), sig(-q.x / 0.7) * sig(-q.y / 0.7), sig(-q.x / 0.7) * sig(q.y / 0.7), sig(q.x / 0.7) * sig(q.y / 0.7));
    for (int i = 0; i < ${e.qlines.length}; i++) {
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
    float dd = (length(uo0 - ORB0.xy) - ORB0.z) * CPX;
    w[${x.orb0}] += o0; w[${x.orb0+1}] += o0 * line(dd + 1.0, 1.0); w[${x.orb0+2}] += o0 * line(dd + 3.5, 1.5); w[${x.orb0+3}] += o0 * (${G(e.specs[0],"uo0")});
  }
  if (o1 > 0.0) {
    float dd = (length(uo1 - ORB1.xy) - ORB1.z) * CPX;
    w[${x.orb1}] += o1; w[${x.orb1+1}] += o1 * line(dd + 1.0, 1.0); w[${x.orb1+2}] += o1 * line(dd + 3.5, 1.5); w[${x.orb1+3}] += o1 * (${G(e.specs[1],"uo1")});
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
  float w[${c.length}];
  for (int k = 0; k < ${c.length}; k++) w[k] = 0.0;
  // motion c: a camera dolly: the near orb (lower left) slides one way and back, the far one less the other way, the star
  // holding the middle of the frame
  if (mOn(3.0)) { float s = sin(TAU * t / uCycle); OFF1 = vec2(0.03 * s, -0.004 * s); OFF0 = vec2(-0.013 * s, 0.002 * s); }
  vec3 col = vec3(0.0);
  for (int i = 0; i < ns; i++) {
    weigh((FC + (ns > 1 ? offs[i] : vec2(0.0))) / uRes, t, w, col);
  }
  vec2 u = vec2(FC.x, uRes.y - FC.y) / uRes;
  for (int k = 0; k < ${c.length}; k++) if (abs(w[k]) > 1e-4 * float(ns)) col += w[k] * field(k, k >= ${x.orb1} ? u - OFF1 : k >= ${x.orb0} ? u - OFF0 : u);
  // motion b: the star's four tips flare in turn (top, right, foot, left), each a soft bloom with a four-point glint
  if (mOn(2.0)) {
    float v = t / uCycle;
    for (int i = 0; i < 4; i++) {
      float k = mBump(v, 0.04 + 0.16 * float(i), 0.3 + 0.16 * float(i));
      if (k > 0.0) {
        vec2 d = (u - TIP[i]) * CPX, a = abs(d);
        float g = 0.5 * exp(-dot(d, d) / 300.0) + 0.6 * exp(-dot(d, d) / 24.0) + 0.4 * (exp(-a.x / 1.4 - a.y / 40.0) + exp(-a.y / 1.4 - a.x / 40.0));
        col += float(ns) * k * g * vec3(0.96, 0.93, 1.0);
      }
    }
  }
  tsCol = max(col / float(ns), vec3(0.0));
  return tsCol;
}`})();$.scorecard=`
#define SC_GRAIN (uMip < 0.5 ? 1.0 : 0.0)
#define SC_GF 0.66
#define SC_GA 0.0425
float scCov(float d, float w) { return clamp(0.5 + d / w, 0.0, 1.0); }
float scLine(vec2 X, vec3 l) { return dot(X, l.xy) - l.z; }
vec3 motif(vec2 p, float t) {
  vec2 X = vec2(p.x, 1.0 - p.y) * 566.0;
  float bw = max(1.7, AAW * 566.0);   // the concept's edge, never under a pixel
  // motion a: the disc's quarters turn a step about their own split point, and rest
  vec2 S2 = vec2(275.746, 290.235);
  float T = (mOn(1.0) ? t : 0.0) * 0.25, uc = t / uCycle;
  float a = -0.5 * PI * (floor(T) + ease(sat((fract(T) - 0.62) / 0.38)));
  vec2 Xq = S2 + rot(-a) * (X - S2);
  float L = scCov(275.367 - X.x, bw), Tp = scCov(289.395 - X.y, bw);
  float L2 = scCov(S2.x - Xq.x, bw), T2 = scCov(S2.y - Xq.y, bw);
  // motion b: the disc's splits turn apart and back, so its quarters re-weigh like a live share of traffic
  if (mOn(2.0) && t > 0.0) {
    float sa = sin(TAU * uc), sb = sin(2.0 * TAU * uc);
    L2 = scCov(S2.x - (S2 + rot(-0.15 * sa) * (X - S2)).x, bw);
    T2 = scCov(S2.y - (S2 + rot(0.09 * sb - 0.05 * sa) * (X - S2)).y, bw);
  }
  // motion c: the diagonal fields behind the disc gain and lose ground on one another, like a race for traffic
  vec3 race = mOn(3.0) ? vec3(30.0 * sin(TAU * uc), 24.0 * sin(2.0 * TAU * uc), -28.0 * sin(TAU * uc)) : vec3(0.0);
  float tri = scCov(-scLine(X, vec3(0.728472, -0.685076, -104.283 + race.x)), bw);
  float dg = scCov(scLine(X, vec3(0.702087, 0.712092, 403.23 + race.y)), bw);
  float nb = scCov(scLine(X, vec3(0.694955, 0.719053, 651.874 + race.z)), bw);
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
  // the paper's grain, static and level in sRGB (as the concept's is); the level under full size, which the shader
  // draws itself (shaderMips: 1), leaves it out so at shelf size it settles to its mean
  // (in linear light: d lin / d srgb taken as 2 sqrt(lin), gamma 2)
  col = max(col, 0.0);
  return col + (vnoise(X * SC_GF) - 0.5) * (SC_GA * 2.0 * SC_GRAIN) * sqrt(col);
}`;$.xactions=`
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
}`;$.stellar=`
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
  // motion a: the planets move along their orbits and the stars twinkle; b: the grid flows toward the viewer, as if
  // flying forward through the map; c: echoes ripple out from the centre star along its orbits, as sound spreads
  float ta = mOn(1.0) ? t : 0.0, u = t / uCycle;
  float flow = mOn(2.0) ? fract(t / 3.0) : 0.0, fly = mOn(2.0) ? mRise(u, 0.0, 0.15) * (1.0 - mRise(u, 0.82, 1.0)) : 0.0;
  float echo = mOn(3.0) ? mRise(u, 0.0, 0.06) * (1.0 - mRise(u, 0.62, 0.74)) : 0.0;
  if (de < 0.01) {
    // deep space inside the emblem
    vec3 sp = mix(uPal[2], uPal[1], smoothstep(0.0, 0.3, length((p - S) * vec2(0.8, 1.1))));
    sp = mix(sp, uPal[0] * 1.2, smoothstep(0.2, 0.43, length(p - E)));
    sp += uPal[3] * 0.25 * exp(-pow(length(p - ic(0.22, 0.66)) / 0.12, 2.0));
    sp += uPal[3] * 0.18 * exp(-pow(length(p - ic(0.78, 0.6)) / 0.14, 2.0));
    sp += vec3(0.85, 0.9, 1.0) * (stars(p, 0.024, 0.86, ta) * 0.8 + stars(p + 0.31, 0.055, 0.8, ta));
    // concentric orbits around the star, and the vertical axis
    for (int i = 0; i < 4; i++) {
      float a = 0.095 + 0.09 * float(i);
      float d = sdEllipse(p - S, vec2(a, a * 0.31));
      // an echo passing an orbit lights it
      float lit = echo > 0.0 ? echo * (exp(-pow((u - 0.1 - 0.11 * float(i)) / 0.05, 2.0)) + 0.5 * exp(-pow((u - 0.38 - 0.11 * float(i)) / 0.05, 2.0))) : 0.0;
      sp = mix(sp, uPal[4], ring(d, 0.0009) * 0.55);
      if (lit > 0.0) sp += mix(uPal[4], vec3(1.0), 0.5) * lit * (0.9 * ring(d, 0.0014) + 0.35 * exp(-abs(d) / 0.008));
    }
    // the echoes' wavefronts, two a cycle, the second fainter
    if (echo > 0.0) for (int j = 0; j < 2; j++) {
      float r = 0.02 + 0.9 * (u - 0.02 - 0.28 * float(j));
      if (r > 0.02 && r < 0.5) sp += mix(uPal[4], vec3(1.0), 0.3) * echo * (1.0 - 0.5 * float(j)) * 0.5 * exp(-pow(sdEllipse(p - S, vec2(r, r * 0.31)) / 0.005, 2.0)) * smoothstep(0.5, 0.3, r);
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
    for (int i = 0; i < 6; i++) { float g = float(i) + flow; float yy = mix(S.y, bl.y, pow(g / 5.0, 1.6)); hl = max(hl, ring(p.y - yy, 0.0009 + 0.0007 * fly) * min(g, 1.0)); }
    float u = (p.x - S.x) / max(S.y - p.y, 1e-3) * (S.y - bl.y) / (br.x - S.x);
    float vk = floor(u * 4.0 + 0.5) / 4.0;
    float vl = ring((u - vk) * (br.x - S.x) * (S.y - p.y) / (S.y - bl.y) * 0.97, 0.0009);
    grid += vec3(0.6, 0.75, 1.0) * 0.35 * (1.0 + 1.5 * fly) * max(hl, vl) * depth;
    sp = mix(sp, grid, cover(tri) * (0.55 + 0.4 * depth));
    sp += uPal[7] * 0.25 * ring(tri, 0.0012) + toLin(vec3(0.5, 0.85, 1.0)) * 0.5 * ring(p.y - bl.y, 0.0016) * cover(tri - 0.002);
    // planets
    sp = planet(sp, p, orbitPos(S, ic(0.37, 0.355), 0.06, ta), 0.022, toLin(vec3(1.0, 0.62, 0.3)), toLin(vec3(0.75, 0.25, 0.2)), S - p);
    sp = planet(sp, p, orbitPos(S, ic(0.165, 0.50), 0.03, ta), 0.013, toLin(vec3(1.0, 0.96, 0.9)), toLin(vec3(0.75, 0.7, 0.7)), S - p);
    sp = planet(sp, p, orbitPos(S, ic(0.275, 0.545), 0.05, ta), 0.011, toLin(vec3(0.55, 0.72, 1.0)), toLin(vec3(0.3, 0.35, 0.8)), S - p);
    sp = planet(sp, p, orbitPos(S, ic(0.325, 0.605), 0.05, ta), 0.012, toLin(vec3(1.0, 0.5, 0.25)), toLin(vec3(0.7, 0.2, 0.15)), S - p);
    sp = planet(sp, p, orbitPos(S, ic(0.705, 0.545), 0.045, ta), 0.019, toLin(vec3(1.0, 0.62, 0.25)), toLin(vec3(0.85, 0.3, 0.15)), S - p);
    sp = planet(sp, p, orbitPos(S, ic(0.845, 0.555), 0.03, ta), 0.012, toLin(vec3(1.0, 0.96, 0.88)), toLin(vec3(0.8, 0.75, 0.7)), S - p);
    vec2 PB = orbitPos(S, ic(0.215, 0.69), 0.02, ta);
    sp = planet(sp, p, PB, 0.063, toLin(vec3(0.95, 0.55, 0.55)), toLin(vec3(0.45, 0.28, 0.85)), vec2(0.6, 0.5));
    // a ringed planet
    vec2 PS = orbitPos(S, ic(0.735, 0.425), 0.035, ta);
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
}`;$.about=`
// gold-leaf grain, static, its strength and size matched to the concept's on flat patches (on the sphere it grows with
// the key light). It sits near the full-size grid's limit, so the level below full size, which the shader draws
// itself (shaderMips: 1), leaves it out: at shelf size it settles to its mean instead of twinkling as the shelf moves.
#define GRAIN_ON (uMip < 0.5 ? 1.0 : 0.0)
#define SPH_GF 310.0
#define SPH_GA 0.125
#define SPH_GK 1.0
#define INK_GF 520.0
#define INK_GA 0.16
float blob(vec2 s, vec2 o, vec2 w) { vec2 d = (s - o) / w; return exp(-dot(d, d)); }
vec3 motif(vec2 p, float t) {
  vec2 C = ic(0.4789, 0.5634); float R = 0.2499;
  float v = length((p - vec2(0.48, 0.5)) * vec2(1.0, 0.9)), u = t / uCycle;
  vec3 col = mix(uPal[0], uPal[1], smoothstep(0.1, 0.85, v));
  // motion b: the sphere rolls a little way to the left and back, its shadow with it, its gold turning as it rolls
  float roll = mOn(2.0) ? -0.042 * mBump(u, 0.04, 0.9) : 0.0;
  C.x += roll;
  // motion c: a sundial: the light arcs over from the right to the left and back, and the shadow turns about the
  // sphere's foot (on the floor, seen foreshortened)
  float sun = mOn(3.0) ? 0.55 * (0.5 - 0.5 * cos(TAU * u)) : 0.0;
  // contact shadow, cast to the left (light from the upper right), in sphere radii from its foot, y down: a
  // near-black core just under it, a warm penumbra reaching left (the gold's light on the paper), a faint wide falloff
  // (skipped where the sphere hides it and well above its foot, where every term is under 1e-5)
  vec2 s = vec2(p.x - C.x, C.y - R - p.y) / R;
  if (sun != 0.0) { vec2 f = rot(2.4 * sun) * vec2(s.x, s.y / 0.3); s = vec2(f.x, f.y * 0.3); }
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
    // motion a: the key and its sheen swing a little about the vertical
    float sw = 0.3 * sin((mOn(1.0) ? t : 0.0) * 0.4);
    vec3 m = vec3(n.x * cos(sw) - n.z * sin(sw), n.y, n.x * sin(sw) + n.z * cos(sw));
    if (sun != 0.0) m.xy = rot(-sun) * m.xy;
    float key = pow(sat((dot(m, vec3(0.4419, 0.5516, 0.7074)) + 0.2885) / 1.2885), 2.9185);
    float bounce = pow(sat(dot(n, vec3(-0.3752, -0.8371, 0.3982))), 1.3779);
    float sheen = pow(sat(dot(m, vec3(0.4984, 0.6846, 0.5319))), 10.4132);
    vec3 g = vec3(-0.1931, -0.0919, 0.0022) + vec3(1.0784, 0.4034, 0.0205) * key + vec3(0.4774, 0.1352, 0.0035) * bounce
      + vec3(0.6279, 0.2096, 0.0007) * (1.0 - n.z) + vec3(-0.1709, 0.3627, 0.2973) * sheen
      + vec3(0.0007, -0.0098, -0.0049) * n.x + vec3(-0.0034, 0.0000, -0.0027) * n.y + vec3(-0.0032, 0.0228, -0.0068) * n.x * n.y
      // the paper's light caught on the lower-left limb
      + vec3(1.387, 0.510, 0.054) * pow(1.0 - n.z, 6.0) * sat(dot(n.xy, vec2(-0.4226, -0.9063)) / max(length(n.xy), 1e-4));
    g *= 1.0 - 1.0000 * exp(-(1.0 + n.y) / 0.1612);
    // the gold's grain turns with a rolling sphere (it rolls about the axis toward the viewer)
    vec2 pg = roll != 0.0 ? ic(0.4789, 0.5634) + rot(roll / R) * (p - C) : p;
    g = max(g, 0.0) * (1.0 + (vnoise(pg * SPH_GF) - 0.5) * SPH_GA * (SPH_GK + key) * GRAIN_ON);
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
#define INK0(p, t) goldInk(p)`;$.chairtax=`
// Bearly's lift (cover units): motion a, a small bob; motion b, three slow squats down behind "Chair" and up again
float squat(float u) { return mBump(u, 0.06, 0.3) + mBump(u, 0.32, 0.56) + mBump(u, 0.58, 0.82); }
float lift(float t) {
  if (mOn(1.0)) return 0.004 * (0.5 - 0.5 * cos(4.0 * TAU * t / uCycle));
  if (mOn(2.0)) return -0.034 * squat(t / uCycle);
  return 0.0;
}
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
  // rolled out to the corner; motion a: it rolls a few pixels and back; motion c: it rolls away out of the frame for the
  // break, waits, and rolls back
  float ta = mOn(1.0) ? t * TAU / uCycle : 0.0, u = t / uCycle;
  float roll = 0.008 * sin(2.0 * ta) * (0.6 + 0.4 * cos(ta));
  if (mOn(3.0)) roll = 0.24 * mRise(u, 0.05, 0.36) * (1.0 - mRise(u, 0.58, 0.92));
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
  // motion a: the ticks pulse; motion b: they flash at the foot of each squat, counting the reps
  float k = 1.0 + 0.12 * sin(mOn(1.0) ? 6.0 * TAU * t / uCycle : 0.0);
  if (mOn(2.0)) { float u = t / uCycle; k += 0.3 * (mBump(u, 0.13, 0.23) + mBump(u, 0.39, 0.49) + mBump(u, 0.65, 0.75)); }
  // thick end first, measured on the concept
  col = tick(col, p, ic(0.738, 0.083), ic(0.689, 0.152), 0.0127, k);
  col = tick(col, p, ic(0.801, 0.172), ic(0.726, 0.199), 0.0127, k);
  col = tick(col, p, ic(0.216, 0.196), ic(0.276, 0.225), 0.0110, k);
  col = tick(col, p, ic(0.204, 0.273), ic(0.265, 0.272), 0.0110, k);
  col = tick(col, p, ic(0.712, 0.870), ic(0.775, 0.893), 0.0101, k);
  col = tick(col, p, ic(0.664, 0.931), ic(0.758, 0.919), 0.0105, k);
  return chair(col, p, t);
}`;$.stats=`
const float YF = 0.11, HW = 0.082, RB = 0.036;
// bar i: centre x and top (y up); every bar stands on the floor. Motion b lifts the tops (BL, set by motif()).
vec3 BL = vec3(0.0);
vec2 bar(int i) { return i == 0 ? vec2(0.294, 0.426 + BL.x) : i == 1 ? vec2(0.508, 0.568 + BL.y) : vec2(0.727, 0.743 + BL.z); }
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
  // motion a: caustics, bright threads drifting through the glass
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
  // motion a: the light along the tube sweeps round it
  float sweep = pow(0.5 + 0.5 * sin(ang - (mOn(1.0) ? t : 0.0) * 0.6 + 2.2), 3.0);
  vec3 tube = mix(col, uPal[5], 0.3) + 0.02;
  tube += vec3(1.0) * 0.36 * pow(x, 4.0);
  tube += vec3(1.0) * 0.40 * exp(-pow((d + w * 0.3) / (w * 0.22), 2.0)) * (0.25 + 0.75 * sweep);
  // motion c: one bead of light runs once round the orbit, behind the bars and out in front, like the morning summary
  float bead = 0.0;
  if (mOn(3.0)) {
    float u = t / uCycle, kb = mRise(u, 0.0, 0.08) * (1.0 - mRise(u, 0.62, 0.72));
    float da = abs(mod(ang - 0.4 - TAU * ease(sat((u - 0.02) / 0.66)) + PI, TAU) - PI);
    bead = kb * exp(-da * da / 0.02);
    tube += vec3(1.0) * 1.2 * bead * exp(-pow(d / w, 2.0));
  }
  col = mix(col, tube, ring(d, w) * k);
  return col + uPal[5] * 0.06 * exp(-abs(d) / 0.01) * k + vec3(0.85, 0.92, 1.0) * 0.6 * bead * exp(-abs(d) / 0.02) * k;
}
vec3 motif(vec2 p, float t) {
  // motion b: the bars rise and fall a little, out of step, like live counts through a day
  if (mOn(2.0)) { float u = t / uCycle; BL = vec3(0.05 * mBump(u, 0.02, 0.5), 0.06 * mBump(u, 0.16, 0.64), 0.04 * mBump(u, 0.3, 0.78)); }
  float ta = mOn(1.0) ? t : 0.0;
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
  for (int i = 0; i < 3; i++) col = slab(col, p, i, ta);
  return orbit(col, p, t, true);
}`;var ze=[[.0713,.7021,.827,.876,.842],[.1186,.7021,.859,.902,.876],[.1659,.7021,.911,.918,.87],[.2132,.7021,.941,.933,.878],[.2605,.7021,.974,.956,.918],[.3078,.7021,.874,.89,.833],[.0713,.652,.799,.891,.871],[.1186,.652,.794,.856,.824],[.1659,.652,.926,.942,.915],[.2132,.652,.97,.944,.89],[.2605,.652,.949,.931,.883],[.3078,.652,.994,.964,.921],[.0713,.602,.778,.89,.864],[.1186,.602,.764,.886,.883],[.1659,.602,.832,.852,.795],[.2132,.602,.885,.894,.846],[.2605,.602,.981,.959,.918],[.3078,.602,.903,.91,.852],[.0409,.6513,.525,.782,.771],[.0899,.6513,.784,.817,.747],[.1388,.6513,.791,.819,.745],[.1877,.6513,.792,.82,.745],[.2367,.6513,.792,.82,.745],[.2856,.6513,.792,.82,.745],[.3345,.6513,.792,.82,.745],[.0409,.6059,.384,.71,.717],[.0899,.6059,.381,.699,.699],[.1388,.6059,.736,.797,.734],[.1877,.6059,.785,.816,.743],[.2367,.6059,.792,.82,.745],[.2856,.6059,.792,.82,.745],[.3345,.6059,.792,.82,.745],[.0409,.5605,.243,.638,.647],[.0899,.5605,.248,.589,.59],[.1388,.5605,.145,.571,.6],[.1877,.5605,.352,.653,.67],[.2367,.5605,.796,.844,.808],[.2856,.5605,.799,.826,.755],[.3345,.5605,.793,.82,.746],[.0409,.5152,.368,.657,.64],[.0899,.5152,.187,.645,.674],[.1388,.5152,.43,.709,.688],[.1877,.5152,.563,.777,.754],[.2367,.5152,.871,.9,.881],[.2856,.5152,.986,.968,.939],[.3345,.5152,.827,.846,.777],[.0409,.4698,.589,.644,.592],[.0899,.4698,.461,.642,.631],[.1388,.4698,.462,.78,.813],[.1877,.4698,.911,.913,.902],[.2367,.4698,.887,.899,.836],[.2856,.4698,.985,.959,.902],[.3345,.4698,.945,.939,.906],[.0409,.4244,.544,.319,.062],[.0899,.4244,.669,.243,0],[.1388,.4244,.845,.757,.578],[.1877,.4244,.849,.861,.801],[.2367,.4244,1,.995,.954],[.2856,.4244,.883,.88,.835],[.3345,.4244,1,.99,.928],[.0409,.379,.926,.63,.271],[.0899,.379,1,.682,.271],[.1388,.379,.984,.709,.365],[.1877,.379,.905,.951,.973],[.2367,.379,.867,.868,.798],[.2856,.379,1,1,.95],[.3345,.379,.675,.763,.75],[.0409,.3336,.907,.587,.163],[.0899,.3336,.944,.686,.386],[.1388,.3336,.945,.844,.718],[.1877,.3336,1,.945,.831],[.2367,.3336,.959,.953,.919],[.2856,.3336,.725,.798,.778],[.3345,.3336,.536,.68,.675],[.0409,.2883,.874,.861,.748],[.0899,.2883,.984,.863,.709],[.1388,.2883,.968,.914,.816],[.1877,.2883,.853,.879,.852],[.2367,.2883,.666,.746,.73],[.2856,.2883,.438,.624,.624],[.3345,.2883,.775,.809,.741],[.3755,.8063,.746,.841,.819],[.4267,.8063,1,.996,.936],[.478,.8063,.734,.828,.798],[.3755,.7596,.99,.955,.905],[.4267,.7596,1,.965,.913],[.478,.7596,.759,.842,.811],[.3755,.7129,.927,.924,.879],[.4267,.7129,.956,.938,.887],[.478,.7129,.972,.958,.912],[.3755,.6662,.966,.946,.897],[.4267,.6662,.964,.931,.891],[.478,.6662,.992,.952,.896],[.3755,.6195,.934,.921,.869],[.4267,.6195,.977,.953,.902],[.478,.6195,.848,.887,.851],[.3755,.5728,.812,.872,.848],[.4267,.5728,1,.981,.918],[.478,.5728,.734,.831,.807],[.3755,.5261,.662,.79,.775],[.4267,.5261,1,.997,.947],[.478,.5261,.723,.825,.8],[.3755,.4794,.391,.685,.687],[.4267,.4794,1,.969,.93],[.478,.4794,.72,.816,.792],[.3755,.4327,.125,.501,.509],[.4267,.4327,.834,.949,.92],[.478,.4327,.738,.812,.792],[.3755,.386,.076,.433,.463],[.4267,.386,.468,.775,.77],[.478,.386,.927,.872,.842],[.3755,.3393,0,.323,.336],[.4267,.3393,.194,.619,.63],[.478,.3393,.759,.89,.86],[.3755,.2926,.287,.547,.571],[.4267,.2926,0,.417,.444],[.478,.2926,.272,.649,.648],[.5238,.7024,.802,.753,.618],[.5714,.7024,.851,.451,.175],[.619,.7024,.884,.473,.189],[.6667,.7024,.923,.521,.148],[.7143,.7024,.975,.874,.755],[.7619,.7024,.948,.95,.914],[.8095,.7024,.812,.787,.671],[.5238,.6566,.826,.456,.173],[.5714,.6566,.896,.412,.107],[.619,.6566,.936,.505,.131],[.6667,.6566,1,.878,.726],[.7143,.6566,.944,.964,.928],[.7619,.6566,.997,.962,.904],[.8095,.6566,.939,.945,.921],[.5238,.6108,.947,.586,.262],[.5714,.6108,.947,.606,.278],[.619,.6108,1,.781,.545],[.6667,.6108,.851,.856,.776],[.7143,.6108,.98,.97,.933],[.7619,.6108,.941,.895,.841],[.8095,.6108,.978,.952,.884],[.5238,.565,.949,.767,.579],[.5714,.565,.973,.767,.561],[.619,.565,.964,.922,.852],[.6667,.565,.803,.777,.654],[.7143,.565,.855,.845,.762],[.7619,.565,1,1,1],[.8095,.565,.828,.875,.851],[.5238,.5192,.953,.864,.746],[.5714,.5192,1,.965,.89],[.619,.5192,.901,.946,.934],[.6667,.5192,.802,.776,.653],[.7143,.5192,.803,.777,.655],[.7619,.5192,.807,.784,.667],[.8095,.5192,.794,.775,.661],[.5238,.4734,.951,.953,.909],[.5714,.4734,.961,.941,.91],[.619,.4734,.836,.889,.846],[.6667,.4734,.801,.775,.652],[.7143,.4734,.801,.774,.65],[.7619,.4734,.799,.772,.648],[.8095,.4734,.798,.772,.649],[.5238,.4277,.939,.922,.878],[.5714,.4277,.736,.863,.855],[.619,.4277,.694,.814,.768],[.6667,.4277,.8,.774,.651],[.7143,.4277,.773,.722,.565],[.7619,.4277,.449,.354,.161],[.8095,.4277,.316,.347,.309],[.5238,.3819,.819,.904,.894],[.5714,.3819,.553,.766,.73],[.619,.3819,.178,.663,.708],[.6667,.3819,.818,.814,.696],[.7143,.3819,.917,.674,.268],[.7619,.3819,.819,.628,.271],[.8095,.3819,.574,.448,.183],[.5238,.3361,.581,.777,.759],[.5714,.3361,.305,.701,.715],[.619,.3361,.234,.651,.655],[.6667,.3361,.82,.834,.695],[.7143,.3361,.97,.749,.388],[.7619,.3361,.882,.706,.381],[.8095,.3361,.929,.709,.33],[.5238,.2903,.778,.772,.658],[.5714,.2903,.247,.654,.659],[.619,.2903,.443,.758,.755],[.6667,.2903,.751,.78,.676],[.7143,.2903,.919,.775,.485],[.7619,.2903,.939,.736,.371],[.8095,.2903,.803,.769,.634],[.624,.5408,.113,.472,.486],[.6705,.5408,.638,.853,.833],[.717,.5408,.956,.915,.874],[.7636,.5408,1,1,.943],[.8101,.5408,.84,.873,.844],[.624,.4904,.072,.469,.482],[.6705,.4904,.672,.85,.84],[.717,.4904,.941,.915,.869],[.7636,.4904,.867,.904,.864],[.8101,.4904,.587,.733,.722],[.8493,.824,.891,.755,.592],[.8811,.824,.893,.766,.583],[.913,.824,.921,.751,.382],[.9449,.824,.922,.752,.489],[.9767,.824,.891,.755,.592],[.8493,.7906,.897,.763,.592],[.8811,.7906,.942,.756,.366],[.913,.7906,.909,.719,.401],[.9449,.7906,.963,.823,.606],[.9767,.7906,.891,.756,.593],[.8493,.7572,.908,.779,.61],[.8811,.7572,.972,.82,.544],[.913,.7572,.93,.785,.503],[.9449,.7572,.972,.87,.721],[.9767,.7572,.891,.758,.598],[.8493,.7238,.905,.773,.607],[.8811,.7238,.947,.84,.617],[.913,.7238,.948,.842,.683],[.9449,.7238,.966,.967,.886],[.9767,.7238,.947,.962,.936],[.8493,.6904,.9,.769,.605],[.8811,.6904,.962,.879,.703],[.913,.6904,.943,.884,.766],[.9449,.6904,.953,.901,.806],[.9767,.6904,.955,.912,.83],[.8493,.657,.928,.861,.729],[.8811,.657,.96,.909,.809],[.913,.657,.97,.925,.826],[.9449,.657,.96,.938,.873],[.9767,.657,.969,.981,.956],[.8493,.6236,.947,.924,.837],[.8811,.6236,.941,.899,.789],[.913,.6236,.971,.941,.87],[.9449,.6236,.948,.942,.906],[.9767,.6236,.905,.803,.673],[.8493,.5902,.924,.903,.843],[.8811,.5902,.977,.938,.854],[.913,.5902,.95,.94,.889],[.9449,.5902,.955,.923,.847],[.9767,.5902,.891,.757,.595],[.8493,.5568,.681,.721,.685],[.8811,.5568,1,1,.99],[.913,.5568,.865,.861,.833],[.9449,.5568,1,1,.926],[.9767,.5568,.891,.757,.595],[.8493,.5234,.488,.582,.546],[.8811,.5234,1,1,.991],[.913,.5234,.824,.859,.826],[.9449,.5234,1,1,.942],[.9767,.5234,.891,.756,.595],[.8493,.49,.419,.487,.444],[.8811,.49,1,1,.931],[.913,.49,.835,.861,.822],[.9449,.49,1,1,.957],[.9767,.49,.891,.757,.595],[.8493,.4566,.496,.495,.42],[.8811,.4566,1,.928,.811],[.913,.4566,.901,.858,.762],[.9449,.4566,1,1,.973],[.9767,.4566,.891,.757,.595],[.8493,.4232,.441,.345,.211],[.8811,.4232,1,.807,.574],[.913,.4232,.955,.841,.728],[.9449,.4232,.958,.877,.767],[.9767,.4232,.891,.756,.594],[.8493,.3898,.59,.42,.268],[.8811,.3898,.95,.599,.306],[.913,.3898,.929,.658,.411],[.9449,.3898,1,.837,.65],[.9767,.3898,.895,.735,.563],[.8493,.3564,.498,.274,.121],[.8811,.3564,.915,.543,.256],[.913,.3564,.93,.55,.246],[.9449,.3564,.975,.63,.301],[.9767,.3564,.951,.552,.243],[.8493,.323,.787,.591,.417],[.8811,.323,.737,.264,0],[.913,.323,.893,.533,.261],[.9449,.323,.897,.481,.18],[.9767,.323,.878,.501,.21],[.8493,.2896,.889,.751,.587],[.8811,.2896,.84,.587,.357],[.913,.2896,.813,.38,.099],[.9449,.2896,.862,.478,.184],[.9767,.2896,.855,.445,.163],[.8448,.7742,.613,.553,.333],[.864,.7742,.386,.367,.206],[.8448,.7401,.748,.618,.349],[.864,.7401,.809,.68,.395],[.8448,.706,.864,.76,.541],[.864,.706,.837,.727,.484],[.8448,.672,.888,.821,.678],[.864,.672,.94,.851,.684],[.8448,.6379,.919,.859,.73],[.864,.6379,.913,.847,.719]],We=[0,18,81,117,187,197,282,292],_e=[.0426,.0416,.0436,.0405,.0428,.0284,.029],Ve='<svg xmlns="http://www.w3.org/2000/svg" viewBox="178 98 700 700"><path fill="#fff" d="M527.2 109.7C619.3 397.3 663.0 402.2 841.1 449.6C643.2 495.5 560.6 605.5 528.1 785.8C503.9 646.5 405.5 455.2 214.1 448.7C433.3 384.7 466.4 355.1 527.2 109.7Z"/></svg>',S0=null;function Ze(){if(!S0){let{blocks:e,alpha:t,data:o,chroma:c}=ge,n=[],s=0,i=a=>{let f=o[s++];if(f!=="~")return t.indexOf(f)-a;let E=t.indexOf(o[s])*63+t.indexOf(o[s+1]);return s+=2,a?E-1984:E};for(let[,a,f,E,g,p]of e){let l=new Uint8Array(a*a),b=i(0);for(let h=0,v=0;h<b;h++){let u=i(0);h%2&&l.fill(1,v,v+u),v+=u}let x=[new Float32Array(a*a),new Float32Array(a*a),new Float32Array(a*a)];x.forEach((h,v)=>{let u=0;for(let m=0;m<a*a;m++){if(!l[m])continue;let D=m%a,P=D&&l[m-1]?h[m-1]:m>=a&&l[m-a]?h[m-a]:u;h[m]=u=P+i(31)}});let H=new Float32Array(a*a*3),G=l.slice();for(let h=0;h<a*a;h++)if(l[h]){let v=f+x[0][h]*p;H.set([E+x[1][h]*p*c+v,v,g+x[2][h]*p*c+v],h*3)}for(let h=a*a-l.reduce((u,m)=>u+m,0),v=-1;h>0&&h!==v;){let u=G.slice();v=h;for(let m=0;m<a*a;m++){if(G[m])continue;let D=m%a,P=(m-D)/a,S=[0,0,0],q=0;for(let A=-1;A<=1;A++)for(let k=-1;k<=1;k++){let J=D+k,B=P+A,z=B*a+J;if((k||A)&&J>=0&&B>=0&&J<a&&B<a&&G[z]){for(let O=0;O<3;O++)S[O]+=H[z*3+O];q++}}q&&(H.set(S.map(A=>A/q),m*3),u[m]=1,h--)}G.set(u)}for(let h=0;h<a*a;h++)n.push([0,0,H[h*3],H[h*3+1],H[h*3+2]])}S0={list:n,starts:[0,n.length],sigma:[0]}}return S0}function xe(e){switch(e.name){case"Mirra":return{motif:"mirra",t0:0,pal:["#2E78CC","#6AAAE6","#B3D6F4","#E3F1FD","#C9DFF5","#8CC0EE"],ground:Y.Mirra,type:[{lines:["Mirra"],font:"NJ Text",weight:900,track:-.035,cap:198,x:56,base:247,ch:0}],inks:["#FFFFFF"],mark:[858,864,116],form:{box:[125,180,730],R:.019,soft:.003,key:"tile",ink:[255,255,255]},bandY:.46,grain:[.012,.01],back:{paper:"#EEF6FD",ink:"#123E78",soft:"#4F6E92",accent:"#2C7AC2"}};case"stet":return{motif:"stet",t0:0,pal:["#072529","#051D21"],ground:Y.stet,type:[{paths:"letters/stet.json"}],inks:["#F1E8D6","#F1E8D6"],mark:[30,26,142],keys:{list:ze,starts:We,sigma:_e},typeGlow:!0,bandY:.48,strip:"fill",grain:[.03,.012],back:{paper:"#0D2A2C",ink:"#F3EBDB",soft:"#9BBDBB",accent:"#E9B85E"}};case"Social Hook":return{motif:"hook",t0:0,pal:[],ground:Y["Social Hook"],type:[{paths:"letters/social-hook.json"}],inks:["#FFFFFF"],mark:[50,868,121],bandY:.32,grain:[.012,.01],back:{paper:"#2563EB",ink:"#FFFFFF",soft:"#CFE0FF",accent:"#FFFFFF"}};case"Clauded":return{motif:"clauded",t0:0,pal:[],ground:Y.Clauded,type:[{paths:"letters/clauded.json"}],inks:["#4EE4E8"],mark:[27,836,189],markKey:{lo:22,hi:60},form:{box:[44,114,934],R:.004,soft:.0015,smooth:.0025,key:"tile",lo:22,hi:60,res:640},bandY:.44,grain:[.014,.012],back:{paper:"#0A3B3E",ink:"#E6FFFB",soft:"#8FCFC8",accent:"#5FE3D6"}};case"LikeWiki":return{motif:"likewiki",t0:0,pal:[],ground:Y.LikeWiki,type:[{paths:"letters/likewiki.json"}],inks:["#1C3A30","#F8F7F1"],mark:[855,38,130],bandY:.5,strip:"art",grain:[.03,.016],back:{paper:"#F2EEE6",ink:"#1E4A38",soft:"#5E7A6C",accent:"#2F5D50"}};case"Topshine":return{motif:"topshine",t0:0,pal:[],ground:Y.Topshine,type:[{font:"NJ Hanken",weight:600,set:[["t",72.3,892.9,130.4,0,0],["o",131.1,902.7,135.3,0,0],["p",204.3,916.1,133.9,0,0],["s",268.5,904.5,130,0,0],["h",333.6,890.2,136.3,0,0],["i",381.8,889.3,130.2,0,0],["n",429,903.6,137.7,0,0],["e",497.7,902.7,134.1,0,0]]}],inks:["#0C1229"],mark:[53.8,54.9,113.3],form:{box:[178,98,700],R:.1,soft:.005,key:"alpha",res:640,svg:Ve},keys:Ze(),bandY:.55,grain:[.01,.008],back:{paper:"#F5F2FF",ink:"#0F1030",soft:"#5E5A86",accent:"#6C44F0"}};case"Scorecard":return{motif:"scorecard",t0:0,pal:["#0F1B3D","#1F5DD8","#2A6BE3","#14916F","#0E7458","#F6C21C","#F24A1D","#F7872E"],ground:Y.Scorecard,type:[{paths:"letters/scorecard.json"}],inks:["#FCFAF6"],bandY:.5,grain:[.02,.012],shaderMips:1,back:{paper:"#0F1B3D",ink:"#FFFFFF",soft:"#A9B8DA",accent:"#F6C21C"}};case"Xactions":return{motif:"xactions",t0:0,pal:["#060A22","#0B1234"],ground:Y.Xactions,type:[{lines:["Xactions"],font:"NJ Text",weight:900,track:-.035,fit:940,x:36,base:198,ch:0}],inks:["#FFFFFF"],bandY:.5,grain:[.012,.01],shaderMips:!0,back:{paper:"#080C26",ink:"#FFFFFF",soft:"#A6ADD6",accent:"#FF8A2A"}};case"Stellar Explorer":return{motif:"stellar",t0:0,pal:["#0B0E1C","#0D1440","#1E2C8C","#5B2E9E","#5E6FC0","#E2A6F0","#1F44D8","#5A8CF5"],ground:Y["Stellar Explorer"],type:[{lines:["Stellar","Explorer"],font:"NJ Serif",weight:700,track:-.01,fit:596,x:512,align:"center",base:137,lead:104,ch:0}],inks:["#FFF8EE"],bandY:.42,grain:[.012,.01],back:{paper:"#0B0E1C",ink:"#FFF8EE",soft:"#A3A9CC",accent:"#DBA95C"}};case"Chairtax":return{motif:"chairtax",t0:0,pal:["#140F0B","#140F0B","#FFB020","#F8F2E7","#2E3D66","#55669A","#0E1018","#6F8BD6"],ground:Y.Chairtax,type:[{paths:"letters/chairtax.json"}],inks:["#FCEECE","#F9B224"],mark:[8,6,164],art:{src:"art/bearly-lean.webp",x:300,top:18},typeGlow:!0,bandY:.86,bandH:.28,grain:[.012,.01],back:{paper:"#14110D",ink:"#F8F2E7",soft:"#B4A893",accent:"#FFB020"}};case"Stats":return{motif:"stats",t0:0,pal:["#EEF2F7","#C9D3E1","#3A6BD6","#17845A","#D9822B","#D6E9FF","#EEF2F7","#17202B"],ground:Y.Stats,type:[{lines:["Stats"],font:"NJ Bricolage",weight:800,track:-.01,fit:552,x:52,base:367,ch:0}],inks:["#17202B"],mark:[49,36,125],bandY:.4,grain:[.01,.008],back:{paper:"#EEF1F4",ink:"#17202B",soft:"#5B6776",accent:"#3A6BD6"}};case"About Neil":return{motif:"about",t0:0,pal:["#F2E7D3","#E8D8BC"],ground:Y["About Neil"],type:[{paths:"letters/about.json"}],inks:["#D2A64E","#A8771F"],bandY:.45,grain:[.03,.014],shaderMips:1,back:{paper:"#F4EADA",ink:"#4A3212",soft:"#86704E",accent:"#B8862C"}}}let t=xe({name:"Xactions"});return{...t,type:[{...t.type[0],lines:[e.name]}]}}var T=["#ff0000","#00ff00","#0000ff"],Ge=new Map;function Fe(e){let t=Ge.get(e);if(!t){let o=document.createElement("canvas");o.width=o.height=e,t=o.getContext("2d",{alpha:!1,willReadFrequently:!0}),Ge.set(e,t)}return t.setTransform(1,0,0,1,0,0),t.globalCompositeOperation="source-over",t.fillStyle="#000",t.fillRect(0,0,e,e),t.globalCompositeOperation="lighter",t.textBaseline="alphabetic",t.textAlign="left",t}var ve=new Map;function Ie(e,t="over"){let o=`${t}:${e}`,c=ve.get(o);if(!c){let n=document.createElement("canvas");n.width=n.height=e,c=n.getContext("2d",{willReadFrequently:t!=="over"}),ve.set(o,c)}return c.setTransform(1,0,0,1,0,0),c.globalCompositeOperation="source-over",c.clearRect(0,0,e,e),c.imageSmoothingEnabled=!0,c.imageSmoothingQuality="high",c}function L(e,t,o,c,n=0){e.font=`${t} ${o}px "${c}"`,"letterSpacing"in e&&(e.letterSpacing=`${(n*o).toFixed(2)}px`)}function c0(e,t){let o=e.measureText(t);return{left:o.actualBoundingBoxLeft,width:o.actualBoundingBoxLeft+o.actualBoundingBoxRight}}function g0(e,t,o){let c=t.split(" "),n=[],s="";for(let i of c){let a=s?s+" "+i:i;s&&e.measureText(a).width>o?(n.push(s),s=i):s=a}return s&&n.push(s),n}function we(e,t,o,c){if(t.paths){e.save(),e.scale(o,o);for(let{ch:s,path:i}of ye.get(t.paths))e.fillStyle=c||T[s],e.fill(i,"evenodd");e.restore();return}if(t.glyphs){for(let[s,i,a,f=1]of t.glyphs)L(e,t.weight,t.px*f*o,t.font,0),e.fillStyle=c||T[a],e.fillText(s,i*o,t.base*o);return}if(t.set){for(let[s,i,a,f,E,g]of t.set){L(e,t.weight,f*o,t.font,0);let p=e.measureText(s);e.save(),e.translate(i*o,a*o),e.rotate(E*Math.PI/180),e.fillStyle=c||T[g],e.fillText(s,-(p.actualBoundingBoxRight-p.actualBoundingBoxLeft)/2,-(p.actualBoundingBoxDescent-p.actualBoundingBoxAscent)/2),e.restore()}return}L(e,t.weight,100,t.font,t.track);let n;t.px?n=t.px:t.cap?n=100*t.cap/e.measureText("H").actualBoundingBoxAscent:n=100*t.fit/Math.max(...t.lines.map(s=>c0(e,s).width)),L(e,t.weight,n*o,t.font,t.track),e.fillStyle=c||T[t.ch],t.lines.forEach((s,i)=>{let a=c0(e,s),f=(t.base+i*(t.lead||0))*o,E=t.align==="center"?t.x*o-a.width/2+a.left:t.x*o+a.left;if(!t.runs){e.fillText(s,E,f);return}let g=E;for(let[p,l]of t.runs)e.fillStyle=c||T[l],e.fillText(p,g,f),g+=e.measureText(p).width})}function je(e,t){let o=e.canvas.width/1024;for(let c of t.type)we(e,c,o)}function et(e,t){let o=e.canvas.width,c=o/512,n=30*c,s=.3*o,i=a=>{e.fillStyle=T[2],e.fillRect(n,Math.round(a),o-2*n,Math.max(1,Math.round(c)))};if(t.kind==="about"){e.fillStyle=T[0],L(e,700,44*c,"NJ Serif",-.015),e.fillText(t.about[0],n,s+64*c),e.fillStyle=T[1],L(e,400,17*c,"NJ Text",-.005);let a=s+108*c;for(let f of t.about.slice(1)){for(let E of g0(e,f,o-2*n))e.fillText(E,n,a),a+=25*c;a+=11*c}}else{e.fillStyle=T[0],L(e,800,100,"NJ Display",-.02);let a=100*(o-2*n-70*c)/c0(e,t.name).width;L(e,800,Math.min(36*c,a),"NJ Display",-.02),e.fillText(t.name,n+c0(e,t.name).left,s+52*c),e.fillStyle=T[1],L(e,600,14*c,"NJ Text",.01),e.textAlign="right",e.fillText(t.year,o-n,s+52*c),e.textAlign="left";let f=60*c,E=s+78*c,g=n+.5*(o-2*n);t.figs.forEach(([p,l],b)=>{let x=E+b*f;i(x),e.fillStyle=T[0],L(e,800,100,"NJ Display",-.02);let H=100*(g-n-14*c)/c0(e,p).width;L(e,800,Math.min(30*c,H),"NJ Display",-.02),e.fillText(p,n+c0(e,p).left,x+f/2+10.5*c),e.fillStyle=T[1],L(e,400,14.5*c,"NJ Text",0);let G=g0(e,l,o-n-g),h=19*c;G.length>2&&(L(e,400,13*c,"NJ Text",0),G=g0(e,l,o-n-g).slice(0,3),h=16.5*c),G.forEach((v,u)=>e.fillText(v,g,x+f/2+5*c+(u-(G.length-1)/2)*h))}),i(E+t.figs.length*f),e.fillStyle=T[1],L(e,500,12*c,"NJ Mono",0),g0(e,t.stack,o-2*n).slice(0,2).forEach((p,l,b)=>e.fillText(p,n,o-n-24*c-(b.length-1-l)*17*c)),e.fillStyle=T[2],L(e,600,13.5*c,"NJ Text",0),t.url&&e.fillText(t.urlText||t.url.replace(/^https?:\/\//,"").replace(/\/$/,""),n,o-n)}e.fillStyle=T[1],L(e,600,12*c,"NJ Text",.01),e.textAlign="right",e.fillText("njct.io",o-n,o-n),e.textAlign="left"}var ue=new Map;function O0(e,t){let o=e.svg?`svg:${t}:${e.svg}`:`png:${e.png}`,c=ue.get(o);if(!c){let n,s=!1;if(e.svg){let a=/viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/.exec(e.svg),[f,E]=a?[+a[1],+a[2]]:[1,1],g=Math.round(t*f/Math.max(f,E)),p=Math.round(t*E/Math.max(f,E)),l=e.svg.replace(/<svg\b([^>]*)>/,(b,x)=>`<svg${x.replace(/\s(width|height)\s*=\s*("[^"]*"|'[^']*')/g,"")} width="${g}" height="${p}">`);n=URL.createObjectURL(new Blob([l],{type:"image/svg+xml"})),s=!0}else n=new URL(e.png,document.baseURI).href;let i=new Image;i.decoding="async",i.src=n,c=i.decode().then(()=>i).finally(()=>{s&&URL.revokeObjectURL(n)}),ue.set(o,c)}return c}var de=new WeakMap;function tt(e,{lo:t,hi:o}){let c=de.get(e);if(c)return c;let n=e.naturalWidth||e.width,s=e.naturalHeight||e.height;c=document.createElement("canvas"),c.width=n,c.height=s;let i=c.getContext("2d",{willReadFrequently:!0});i.drawImage(e,0,0);let a=i.getImageData(0,0,n,s),f=a.data,E=[0,0,0];for(let[g,p]of[[2,2],[n-3,2],[2,s-3],[n-3,s-3]])for(let l=0;l<3;l++)E[l]+=f[(p*n+g)*4+l]/4;for(let g=0;g<f.length;g+=4){let p=(Math.hypot(f[g]-E[0],f[g+1]-E[1],f[g+2]-E[2])-t)/(o-t);p=Math.min(1,Math.max(0,p)),p=p*p*(3-2*p);for(let l=0;l<3;l++)f[g+l]=p>0?Math.min(255,Math.max(0,E[l]+(f[g+l]-E[l])/p)):0;f[g+3]=Math.round(255*p*f[g+3]/255)}return i.putImageData(a,0,0),de.set(e,c),c}var ye=new Map,pe=new Map;function ot(e){let t=pe.get(e);return t||(t=fetch(new URL(e,new URL("../covers/covers.js",import.meta.url).href)).then(o=>o.json()).then(o=>{ye.set(e,o.letters.map(({ch:c,d:n})=>({ch:c,path:new Path2D(n)})))}),pe.set(e,t)),t}var he=new Map;function at(e){let t=he.get(e);if(!t){let o=new Image;o.decoding="async",o.src=new URL(e,new URL("../covers/covers.js",import.meta.url).href).href,t=o.decode().then(()=>{let c=new m0(o);return c.colorSpace=p0,c.premultiplyAlpha=!0,c.minFilter=u0,c.magFilter=j,c.needsUpdate=!0,c}),he.set(e,t)}return t}var ct=e=>e&&(typeof e.svg=="string"||typeof e.png=="string")?e:null;function st(e){let t=Math.round((e.form.res||512)/(1+2*V)),o=document.createElement("canvas");o.width=o.height=t;let c=o.getContext("2d");c.textBaseline="alphabetic";for(let n of e.type)we(c,n,t/1024,"#fff");return o}function be(e,t,o,c,n){let s=t.naturalWidth||t.width,i=t.naturalHeight||t.height,a=n/Math.max(s,i);e.drawImage(t,o+(n-s*a)/2,c+(n-i*a)/2,s*a,i*a)}function q0(e,t,o,c,n,s,i){s[0]=0,i[0]=-1e20,i[1]=1e20;for(let f=0;f<c;f++)n[f]=e[t+f*o];for(let f=1,E=0,g=0;f<c;f++){do{let p=s[E];g=(n[f]-n[p]+f*f-p*p)/(f-p)/2}while(g<=i[E]&&--E>-1);E++,s[E]=f,i[E]=g,i[E+1]=1e20}for(let f=0,E=0;f<c;f++){for(;i[E+1]<f;)E++;let g=s[E];e[t+f*o]=n[g]+(f-g)*(f-g)}}function U0(e,t,o){let c=Math.max(t,o),n=new Float64Array(c),s=new Uint16Array(c),i=new Float64Array(c+1);for(let a=0;a<t;a++)q0(e,a,t,o,n,s,i);for(let a=0;a<o;a++)q0(e,a*t,1,t,n,s,i)}function X0(e,t,o,c){let n=1/(2*c+1);for(let s=0;s<o;s++){let i=s*o,a=0;for(let f=-c;f<=c;f++)a+=e[i+Math.min(o-1,Math.max(0,f))];for(let f=0;f<o;f++)t[i+f]=a*n,a+=e[i+Math.min(o-1,f+c+1)]-e[i+Math.max(0,f-c)]}for(let s=0;s<o;s++){let i=0;for(let a=-c;a<=c;a++)i+=t[Math.min(o-1,Math.max(0,a))*o+s];for(let a=0;a<o;a++)e[a*o+s]=i*n,i+=t[Math.min(o-1,a+c+1)*o+s]-t[Math.max(0,a-c)*o+s]}}function l0(e,t,o){t[0]=e;let c=o[0],n=c>>>16&32768,s=(c>>>23&255)-112;return s<=0?n:s>30?n|31744:(n|s<<10)+((c&8388607)+4096>>>13)}function x0(e,t,o,c,n,s){let i=t*t,a=1e20,f=new Float32Array(i);if(s.key==="tile"){let v=[[.1,.1],[.9,.1],[.1,.9],[.9,.9]].map(([u,m])=>{let D=(Math.round(o+u*c)*t+Math.round(o+m*c))*4;return[e[D],e[D+1],e[D+2]]});for(let u=0;u<i;u++){let m=((u/t|0)-o)/c,D=(u%t-o)/c;if(m<.07||D<.07||m>.93||D>.93||e[u*4+3]<250)continue;let P=e[u*4],S=e[u*4+1],q=e[u*4+2],A;if(s.ink){let k=0,J=1e-6;for(let B=0;B<3;B++){let z=(v[0][B]*(1-D)+v[2][B]*D)*(1-m)+(v[1][B]*(1-D)+v[3][B]*D)*m,O=s.ink[B]-z;k+=([P,S,q][B]-z)*O,J+=O*O}A=Math.min(1,Math.max(0,k/J))}else{let k=1/0;for(let J of v)k=Math.min(k,Math.hypot(P-J[0],S-J[1],q-J[2]));A=Math.min(1,Math.max(0,(k-s.lo)/(s.hi-s.lo))),A=A*A*(3-2*A)}f[u]=Math.min(1,Math.max(0,(A-.1)/.8))}}else for(let v=0;v<i;v++)f[v]=e[v*4+3]/255;let E=new Float64Array(i),g=new Float64Array(i);for(let v=0;v<i;v++){let u=f[v];E[v]=u>=1?0:u<=0?a:Math.max(0,.5-u)**2,g[v]=u>=1?a:u<=0?0:Math.max(0,u-.5)**2}U0(E,t,t),U0(g,t,t);let p=new Float32Array(i),l=new Float32Array(i),b=new Float32Array(i);for(let v=0;v<i;v++){let u=(Math.sqrt(E[v])-Math.sqrt(g[v]))*n;p[v]=u;let m=Math.min(1,Math.max(0,-u)/s.R);l[v]=s.R*Math.sqrt(1-(1-m)*(1-m))}if(s.smooth){let v=Math.max(1,Math.round(s.smooth/n));for(let u=0;u<3;u++)X0(p,b,t,v);for(let u=0;u<i;u++){let m=Math.min(1,Math.max(0,-p[u])/s.R);l[u]=s.R*Math.sqrt(1-(1-m)*(1-m))}}let x=Math.max(1,Math.round(s.soft/n));for(let v=0;v<3;v++)X0(l,b,t,x);let H=new Uint16Array(i*4),G=new Float32Array(1),h=new Uint32Array(G.buffer);for(let v=0;v<t;v++)for(let u=0;u<t;u++){let m=v*t+u,D=v*t+Math.max(0,u-1),P=v*t+Math.min(t-1,u+1),S=Math.max(0,v-1)*t+u,q=Math.min(t-1,v+1)*t+u,A=(l[P]-l[D])/(2*n),k=(l[S]-l[q])/(2*n),J=((t-1-v)*t+u)*4;H[J]=l0(p[m],G,h),H[J+1]=l0(A,G,h),H[J+2]=l0(k,G,h),H[J+3]=l0(l[m]/s.R,G,h)}return H}var N0=null;function nt(e,...t){try{if(!N0){let c=[q0,U0,X0,l0,x0].map(n=>n.toString()).join(`
`)+`
onmessage = e => { const out = ${x0.name}(...e.data); postMessage(out, [out.buffer]); };`;N0=URL.createObjectURL(new Blob([c],{type:"text/javascript"}))}let o=new Worker(N0);return new Promise(c=>{let n=s=>{o.terminate(),c(s)};o.onmessage=s=>n(s.data),o.onerror=s=>{s.preventDefault(),n(x0(e,...t))},o.postMessage([e,...t])})}catch{return Promise.resolve(x0(e,...t))}}var V=.1;function rt(e,t){let o=t.res||512,c=Ie(o,"form"),n=o/(1+2*V),s=o*V/(1+2*V);be(c,e,s,s,n);let i=c.getImageData(0,0,o,o).data,a=null;t.albedo&&(a=new m0(c.canvas),a.colorSpace=h0,a.generateMipmaps=!1,a.minFilter=a.magFilter=j,a.needsUpdate=!0);let f=t.box[2]*(1+2*V)/1024,E=(t.box[0]-t.box[2]*V)/1024,g=(t.box[1]-t.box[2]*V)/1024,p={key:t.key,ink:t.ink,lo:t.lo,hi:t.hi,R:t.R,soft:t.soft,smooth:t.smooth};return{px:i,res:o,off:s,inner:n,P:f/o,spec:p,col:a,rect:new M0(E,1-g-f,f)}}async function it(e){let t=await nt(e.px,e.res,e.off,e.inner,e.P,e.spec),o=new i0(t,e.res,e.res,d0,L0);return o.minFilter=o.magFilter=j,o.needsUpdate=!0,{tex:o,col:e.col,rect:e.rect}}var y0={wrap:null,nonce:0},Y0=[],$0=!1,De=e=>document.hidden?setTimeout(e,16):requestAnimationFrame(e);function I0(e,t){return new Promise((o,c)=>{Y0.push({label:e,fn:t,resolve:o,reject:c}),$0||($0=!0,De(Ce))})}function Ce(){let e=Y0.shift();if(e)try{e.resolve(y0.wrap?y0.wrap(e.label,e.fn):e.fn())}catch(t){e.reject(t)}Y0.length?De(Ce):$0=!1}var o0=Math.PI*2,ke={Mirra:[{key:"glint",cycle:1/.09,move:.66,rect:[.205,0,.75,.69]},{key:"sync",cycle:10,move:.82,rect:[.12,0,.842,.795]},{key:"ripple",cycle:12,move:.86,rect:[0,0,1,.26]}],stet:[{key:"drift",cycle:0,move:1,turn:24,rect:[0,.24,1,.87]},{key:"proof",cycle:9,move:.64,rect:[0,.24,1,.87]},{key:"mark",cycle:10,move:.84,rect:[.102,.15,.898,.22]}],"Social Hook":[{key:"travel",cycle:0,move:1,turn:24,rect:null},{key:"rise",cycle:12,move:.94,rect:[0,0,.56,.56]},{key:"signal",cycle:8,move:.7,rect:[0,0,1,.76]}],Clauded:[{key:"swing",cycle:o0/.45,move:1,rect:[.122,.175,.872,.695]},{key:"float",cycle:12,move:1,rect:[.11,.155,.888,.71]},{key:"bridges",cycle:10,move:.74,rect:[.13,.428,.705,.695]}],LikeWiki:[{key:"drift",cycle:o0/.3,move:1,rect:null},{key:"compile",cycle:0,move:1,turn:24,rect:null},{key:"heartbeat",cycle:7,move:.21,turn:14,rect:null}],Topshine:[{key:"shimmer",cycle:o0/.45,move:1,rect:[.06,.198,.893,.912]},{key:"shine",cycle:10,move:.78,rect:null},{key:"dolly",cycle:14,move:1,rect:[.09,.205,.905,.89]}],"Stellar Explorer":[{key:"orbits",cycle:0,move:1,turn:16,rect:[.06,0,.952,.732]},{key:"flight",cycle:9,move:1,rect:[.213,.053,.788,.528]},{key:"echo",cycle:8,move:.74,rect:[.065,.292,.932,.74]}],Chairtax:[{key:"fidget",cycle:o0/.45,move:1,rect:[.162,0,1,1]},{key:"squats",cycle:12,move:.82,rect:[.155,.015,.852,1]},{key:"rollout",cycle:14,move:.92,rect:[.562,0,1,.43]}],Scorecard:[{key:"turn",cycle:16,move:1,rect:[.198,.213,.782,.792]},{key:"shares",cycle:12,move:1,rect:[.198,.213,.782,.792]},{key:"race",cycle:12,move:1,rect:[0,0,1,.832]}],Stats:[{key:"caustics",cycle:o0/.3,move:1,rect:[.02,.09,1,.762]},{key:"counts",cycle:12,move:.78,rect:[.125,.115,.915,.87]},{key:"summary",cycle:10,move:.72,rect:null}],"About Neil":[{key:"swing",cycle:o0/.4,move:1,rect:[.208,.183,.753,.71]},{key:"roll",cycle:14,move:.9,rect:[0,0,1,.71]},{key:"sundial",cycle:16,move:1,rect:[0,0,1,.71]}]},_={hz:30,coverHz:{all:8,relay:30},perFrame:3,ease:.6,start:700,gap:1200,fade:1.2},me={glacial:.3,slow:.5,steady:.75},lt={faster:2,same:1,rest:0},w0={relay:[[0,8,3,10,5,7,1,9,4,6,2]],relay2:[[0,3,5,1,4,2],[8,10,7,9,6]]},F={list:[],cfg:{mode:"off",pace:"slow",hover:"faster",picks:{}},wake:null,reduced:()=>!1,running:!1,last:-1,began:0,timer:0,timerAt:0,lanes:null,frames:0,draws:0},ft=e=>e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");function Ae(e){let t=F.cfg.picks,o=ft(e.name),c=t[o]??t[e.name]??(o==="about-neil"?t.about:void 0)??"a";if(c==="off"||c==="none"||c===0)return 0;let n=typeof c=="number"?c-1:c.length===1&&"abc".includes(c)?"abc".indexOf(c):e.opts.findIndex(s=>s.key===c);return n>=0&&n<e.opts.length?n+1:1}var Gt=()=>typeof F.cfg.pace=="number"?F.cfg.pace:me[F.cfg.pace]??me.slow,Ft=e=>e.turn??(e.cycle?e.cycle*e.move:12);function vt(e,t){let o=F.cfg.mode,c=F.list;for(let n of c)n&&(n.mo.want=!1);if(t>=0){c[t]&&(c[t].mo.want=!0);return}if(o==="all"){w0.relay[0].forEach((n,s)=>{c[n]&&e-F.began>=s*_.start&&(c[n].mo.want=!0)});return}F.lanes||(F.lanes=(w0[o]||w0.relay).map((n,s)=>({order:n,pos:-1,cur:-1,at:F.began+s*_.gap*2.5})));for(let n of F.lanes){let s=c[n.cur];if(s&&s.mo.lane===n&&(s.mo.state!=="still"||s.mo.turn>0)){s.mo.want=s.mo.turn>0;continue}if(s&&(s.mo.lane=null,n.cur=-1,n.at=e+_.gap),!(e<n.at))for(let i=0;i<n.order.length;i++){n.pos=(n.pos+1)%n.order.length;let a=c[n.order[n.pos]];if(a&&a.mo.opt&&a.mo.state==="still"){n.cur=n.order[n.pos],a.mo.lane=n,a.mo.turn=Ft(a.optOf()),a.mo.want=!0;break}}}}var mt={attach({wake:e,reduced:t,test:o}={}){F.wake=e||null,t&&(F.reduced=t),document.addEventListener("visibilitychange",()=>{!document.hidden&&F.running&&(F.last=-1,F.wake?.())}),o&&this.configure({mode:"all",...o})},configure(e={}){let{mode:t,pace:o,hover:c,...n}=e;t!==void 0&&(F.cfg.mode=t),o!==void 0&&(F.cfg.pace=o),c!==void 0&&(F.cfg.hover=c),Object.assign(F.cfg.picks,n);for(let s of F.list){if(!s)continue;let i=Ae(s);i!==s.mo.opt&&(s.settle(),s.mo.lane=null,s.mo.opt=i)}t!==void 0&&(F.lanes=null,F.began=0),F.wake?.()},step(e,{ready:t=!0,details:o=!1,crate:c=-1}={}){let n=F.cfg.mode!=="off"&&!!F.wake&&!F.reduced();if(n!==F.running){F.running=n;for(let H of F.list)H&&(H.cover._stop(),H.mo.lane=null);F.lanes=null,F.began=0,F.last=-1}if(!n)return!1;let s=F.last<0?0:Math.min(.1,Math.max(0,(e-F.last)/1e3));if(F.last=e,!t)return!1;F.began||(F.began=e),F.frames++;let i=Gt(),a=F.cfg.mode!=="all"||c>=0,f=_.coverHz[a?"relay":"all"];o||vt(e,c);let E=1-Math.exp(-s/_.ease),g=[],p=!1,l=!1;for(let H of F.list){if(!H||!H.mo.opt)continue;let G=H.mo,h=H.optOf();if(o&&!G.focus)continue;let v=G.focus&&F.cfg.hover==="rest";if(!v&&(G.want||G.focus)?G.state="moving":(G.state==="moving"||v&&G.state==="ending")&&(G.state=!h.cycle||v?"fading":"ending"),G.state==="still")continue;G.state==="fading"&&H.restFrame();let u=G.state==="fading"?0:G.focus?i*lt[F.cfg.hover]:i;G.rate+=(u-G.rate)*E,G.state==="fading"&&G.rate<.01&&(G.rate=0);let m=G.mix;G.mix=G.state==="fading"?Math.min(1,G.mix+s/_.fade):Math.max(0,G.mix-s/_.fade),G.mix!==m&&(G.dirty=!0),G.state==="fading"&&G.mix>=1&&(G.rate=0);let D=G.rate*s,P=H.tick(D);G.lane&&G.turn>0&&(G.turn-=D),G.lane&&G.turn<=0&&G.state==="moving"&&!G.focus&&(G.state=h.cycle?"ending":"fading");let S=h.cycle&&H.mo.clock>=h.move*h.cycle;if(G.state==="ending"&&(P||S)||G.state==="fading"&&G.mix>=1&&!G.focus){H.settle(),l=!0,G.lane&&F.lanes?.includes(G.lane)&&F.list[G.lane.cur]===H&&(G.lane.cur=-1,G.lane.at=e+_.gap),G.lane=null;continue}p=!0,G.dirty&&(G.focus||G.rate>i*1.15?(H.drawMotion(H.aliveSamples),G.drawnAt=e,l=!0,F.draws++):e-G.drawnAt>=1e3/f-4&&g.push(H))}g.sort((H,G)=>H.mo.drawnAt-G.mo.drawnAt);let b=F.list.some(H=>H&&H.mo.focus)?1:_.perFrame;for(let H of g.slice(0,b))H.drawMotion(1),H.mo.drawnAt=e,l=!0,F.draws++;let x=p?e:1/0;if(!o&&F.cfg.mode==="all"&&c<0)w0.relay[0].forEach((H,G)=>{let h=F.list[H];h&&h.mo.opt&&h.mo.state==="still"&&(x=Math.min(x,F.began+G*_.start))});else if(!o&&F.lanes)for(let H of F.lanes)H.cur<0&&(x=Math.min(x,H.at));return x=Math.max(e+1e3/_.hz,x),F.timer&&x<F.timerAt-4&&(clearTimeout(F.timer),F.timer=0),x<1/0&&!F.timer&&!document.hidden&&(F.timerAt=x,F.timer=setTimeout(()=>{F.timer=0,F.wake?.()},x-e)),l},state(){return{...F.cfg,picks:{...F.cfg.picks},running:F.running,frames:F.frames,draws:F.draws,lanes:F.lanes&&F.lanes.map(e=>({cover:F.list[e.cur]?.name??null,next:e.cur<0?Math.round(e.at-F.last):null})),covers:F.list.map(e=>e&&{name:e.name,option:e.mo.opt?e.opts[e.mo.opt-1].key:"off",state:e.mo.state,clock:+e.mo.clock.toFixed(3),rate:+e.mo.rate.toFixed(3),focus:e.mo.focus,mix:+e.mo.mix.toFixed(3)})}},options:ke},Je=new ce;Je.setAttribute("position",new ae([-1,-1,0,3,-1,0,-1,3,0],3));var He=new ie(-1,1,1,-1,0,1),N=new i0(new Uint8Array(4),1,1);N.needsUpdate=!0;var Le=new i0(new Uint16Array([15360,0,0,0]),1,1,d0,L0);Le.needsUpdate=!0;var a0=null,ut=2,e0=[];function dt(e){let t=e0.indexOf(e);for(t>=0&&e0.splice(t,1),e0.push(e);e0.length>ut;)e0[0].evict()}async function Ht(e,t,o,{size:c=1024,backSize:n=512,samples:s=4,aliveSamples:i=Math.min(2,s)}={}){await Xe();let a=xe(t,o),f=Promise.all(a.type.filter(r=>r.paths).map(r=>ot(r.paths))),E=ct(t.logo),g=a.pal.map(fe);for(;g.length<8;)g.push(new H0(0,0,0));let p=a.inks.map(E0);for(;p.length<3;)p.push(p[p.length-1]);let l={uRes:{value:new B0(c,c)},uGrain:{value:new B0(...a.grain||[.02,.016])},uTime:{value:a.t0},uSS:{value:s},uMode:{value:0},uBandY:{value:a.bandY},uStrip:{value:{front:0,art:1,fill:2}[a.strip||"front"]},uBandH:{value:a.bandH||.3},uText:{value:null},uOver:{value:N},uForm:{value:Le},uFormCol:{value:N},uFront:{value:N},uFormRect:{value:new M0(0,0,0)},uRest:{value:N},uRestMix:{value:0},uArt:{value:N},uArtRect:{value:new R0(0,0,0,0)},uArtFade:{value:0},uKeys:{value:N},uMip:{value:0},uInk0:{value:p[0]},uInk1:{value:p[1]},uInk2:{value:p[2]},uPaper:{value:fe(a.back.paper)},uPal:{value:g},uAux:{value:Array.from({length:8},()=>new R0)},uMotion:{value:0},uCycle:{value:1}},b=null;if(a.keys){let{list:r,starts:d,sigma:y}=a.keys,I=r.length,C=Math.min(I,2048),R=Math.ceil(I/C),X=new Float32Array(C*R*8);r.forEach(([K,F0,v0,Ke,Te],J0)=>{let Pe=d.findIndex(Se=>Se>J0)-1,ee=2*Math.floor(J0/C)*C+J0%C;X.set([K,F0,y[Pe],0],ee*4),X.set([v0,Ke,Te,1],(ee+C)*4)}),b=new i0(X,C,2*R,d0,oe),b.minFilter=b.magFilter=te,b.needsUpdate=!0,l.uKeys.value=b}let x=new ne({name:`cover:${t.name}`,vertexShader:Ye,fragmentShader:($e+$[a.motif]+Qe).replace("gl_FragColor = vec4(o, 1.0);",y0.nonce?`gl_FragColor = vec4(o, 1.0 + uRestMix * ${y0.nonce.toFixed(1)}e-30);`:"gl_FragColor = vec4(o, 1.0);"),uniforms:l,depthTest:!1,depthWrite:!1}),H=new re,G=new se(Je,x);G.frustumCulled=!1,H.add(G);let h=e.capabilities.getMaxAnisotropy(),v=r=>new K0(r,r,{depthBuffer:!1,stencilBuffer:!1,generateMipmaps:!0,minFilter:u0,magFilter:j,colorSpace:h0,anisotropy:h}),u=v(c),m=n?v(n):null;u.texture.name=`${t.name} front`,m&&(m.texture.name=`${t.name} back`);let D=e.getRenderTarget();e.setRenderTarget(u);let P=e.compileAsync(H,He);e.setRenderTarget(D);let S=r=>E&&a.mark?O0(E,Math.round(a.mark[2]*r/1024)).then(d=>a.markKey?tt(d,a.markKey):d):Promise.resolve(null),[q,A,k]=await Promise.all([S(c),a.form?.fromType?f.then(()=>st(a)):a.form?.svg?O0({svg:a.form.svg},Math.round((a.form.res||512)/(1+2*V))):E&&a.form?O0(E,Math.round((a.form.res||512)/(1+2*V))):null,a.art?at(a.art.src):null,P,f]);if(k){let{width:r,height:d}=k.image;e.initTexture(k),l.uArt.value=k,l.uArtRect.value.set(a.art.x/1024,1-(a.art.top+d)/1024,r/1024,d/1024),l.uArtFade.value=(a.art.fade||0)/d}let J=(r,d,y=!1)=>{let I=new m0(r);return I.colorSpace=p0,I.premultiplyAlpha=d,I.generateMipmaps=y,I.minFilter=y?u0:j,I.magFilter=j,I.needsUpdate=!0,e.initTexture(I),I},B=(r,d)=>{let y=Fe(r),I=r/1024;d&&!a.mark&&(d=null),je(y,a);let C=!!(a.shaderMips||a.typeGlow),R=J(y.canvas,!1,C),X=N;if(d){let K=Ie(r);be(K,d,a.mark[0]*I,a.mark[1]*I,a.mark[2]*I),X=J(K.canvas,!0,C)}return{text:R,over:X,dispose(){R.dispose(),X!==N&&X.dispose()}}},z=(r=!0)=>B(c,r?q:null),O=(r,d,y,I,C=0,R=null)=>{let X=e.getRenderTarget(),K=r.width>>C;if(l.uMode.value=d,l.uMip.value=C,l.uRes.value.set(K,K),l.uText.value=y.text,l.uOver.value=y.over||N,l.uFront.value=d?(y.strip||u).texture:N,l.uSS.value=I,l.uInk0.value=d?E0(a.back.ink):p[0],l.uInk1.value=d?E0(a.back.soft):p[1],l.uInk2.value=d?E0(a.back.accent):p[2],C&&r.viewport.set(0,0,K,K),R){let F0=Math.max(0,Math.floor(R[0]*K)-1),v0=Math.max(0,Math.floor(R[1]*K)-1);r.scissor.set(F0,v0,Math.min(K,Math.ceil(R[2]*K)+1)-F0,Math.min(K,Math.ceil(R[3]*K)+1)-v0),r.scissorTest=!0}e.setRenderTarget(r,0,C),e.render(H,He),C&&r.viewport.set(0,0,r.width,r.height),R&&(r.scissorTest=!1,r.scissor.set(0,0,r.width,r.height)),e.setRenderTarget(X)},b0=(r,d,y=null)=>{if(O(u,0,r,d,0,y),a.shaderMips)for(let I=1;u.width>>I>=32&&(a.shaderMips===!0||I<=a.shaderMips);I++)O(u,0,r,d,I)},Be=r=>r*r*(3-2*r),Me=(a.strip||"front")==="front",Q0=r=>Me&&u.width<r.width,z0=r=>Q0(r)?S(r.width):Promise.resolve(null),W0=(r,d)=>{let y=l.uTime.value;l.uTime.value=a.t0;let I=null;if(Q0(r)){I=v(r.width);let X=B(r.width,d);O(I,0,X,s),X.dispose()}let C=Fe(r.width);et(C,t);let R=J(C.canvas,!1);O(r,1,{text:R,strip:I},s),R.dispose(),I&&I.dispose(),l.uTime.value=y},f0=0,s0=0,M=null,W=null,t0=0,n0=!1,U=null,G0=ke[t.name]||[],w={opt:G0.length?1:0,clock:0,rate:0,state:"still",focus:!1,mix:0,turn:0,drawnAt:-1e9,dirty:!1,pristine:!0},Z=()=>G0[w.opt-1]||null,D0=a.mark?[a.mark[0]/1024,1-(a.mark[1]+a.mark[2])/1024,(a.mark[0]+a.mark[2])/1024,1-a.mark[1]/1024]:null,C0=(r,d)=>!r||!d||r[0]<d[2]&&d[0]<r[2]&&r[1]<d[3]&&d[1]<r[3];if(A){let r=await I0(`${t.name} form`,()=>{let d=rt(A,a.form);return d.col&&e.initTexture(d.col),d});U=await it(r),l.uForm.value=U.tex,l.uFormRect.value.copy(U.rect),U.col&&(l.uFormCol.value=U.col)}let Re=m?(await Promise.all([le(),z0(m)]))[1]:null;await Promise.all([I0(`${t.name} front`,()=>{let r=z();b0(r,s),r.dispose()}),m&&I0(`${t.name} back`,()=>W0(m,Re))]);let _0=r=>{let d=Z();if(!d||!r)return!1;let y=w.clock,I=d.cycle||3600,C=d.cycle?d.move*d.cycle:1/0;return w.clock=(w.clock+r)%I,w.dirty=!0,w.clock<y||y<C&&w.clock>=C},k0=r=>{let d=Z();M||(M=z(C0(d?.rect,D0))),l.uMotion.value=w.opt,l.uCycle.value=d?.cycle||1,l.uTime.value=a.t0+w.clock,l.uRestMix.value=w.mix>0&&W?Be(w.mix):0,l.uRest.value=w.mix>0&&W?W.texture:N,b0(M,r,d?.rect||null),w.dirty=!1,w.pristine=r>=s&&w.clock===0&&w.mix===0},V0=()=>{W||(M||(M=z(C0(Z()?.rect,D0))),W=new K0(c,c,{depthBuffer:!1,stencilBuffer:!1,colorSpace:h0}),l.uTime.value=a.t0,l.uRestMix.value=0,O(W,0,M,s))},Z0=()=>{w.clock=0,w.rate=0,w.mix=0,w.turn=0,w.state="still",w.dirty=!1,!w.pristine&&!n0&&k0(s),M&&(M.dispose(),M=null),W&&(W.dispose(),W=null),l.uTime.value=a.t0,l.uRestMix.value=0,l.uRest.value=N},A0=()=>{f0=0,s0=0,t0=0,Z0(),a0===r0&&(a0=null)},Q=null,r0={front:u.texture,back:m?m.texture:null,detailBack(r=1024){if(n0)return Promise.resolve(null);if(Q&&Q.size!==r&&Q.evict(),!Q){let d={size:r,rt:v(r)};d.rt.texture.name=`${t.name} back ${r}`,d.evict=()=>{d.rt&&(d.rt.dispose(),d.rt=null);let y=e0.indexOf(d);y>=0&&e0.splice(y,1),Q===d&&(Q=null)},d.p=Promise.all([le(),z0(d.rt)]).then(([,y])=>d.rt&&I0(`${t.name} back ${r}`,()=>{d.rt&&W0(d.rt,y)})).then(()=>d.rt?d.rt.texture:null),Q=d}return dt(Q),Q.p},setAlive(r){n0||(w.focus=!!r,!F.running&&(s0=r?1:0,!(!r||!w.opt)&&(a0&&a0!==r0&&a0._stop(),a0=r0,M||(M=z(C0(Z()?.rect,D0))),V0())))},update(r){if(!(F.running||!M||!W)){if(r=Math.min(Math.max(r,0),.1),f0+=(s0-f0)*(1-Math.exp(-r*2.5)),t0=s0?Math.max(0,t0-r*2.5):Math.min(1,t0+r/1.2),s0===0&&t0>=1){A0();return}_0(r*f0),w.mix=t0,k0(i)}},dispose(){n0=!0,A0(),u.dispose(),m&&m.dispose(),x.dispose(),Q&&Q.evict(),U&&(U.tex.dispose(),U.col&&U.col.dispose()),b&&b.dispose()},gpuBytes(){let r=(y,I)=>y?y.width*y.height*4*(I?1.3333333333333333:1):0,d=r(u,!0)+r(m,!0)+r(Q?.rt,!0)+r(W,!1);return U&&(d+=U.tex.image.width**2*8+(U.col?U.col.image.width**2*4:0)),k&&(d+=k.image.width*k.image.height*4*4/3),d},motionFrame(r,d,y=i,I=!1){n0||(w.opt=r,w.clock=d,w.mix=0,M||(M=z()),l.uMotion.value=r,l.uCycle.value=Z()?.cycle||1,l.uTime.value=a.t0+d,l.uRestMix.value=0,l.uRest.value=N,b0(M,y,I&&Z()?.rect||null),w.pristine=!1)},_stop:A0},j0={cover:r0,mo:w,opts:G0,name:t.name,tick:_0,drawMotion:k0,restFrame:V0,settle:Z0,samples:s,aliveSamples:i,optOf:Z};return G0.length&&(w.opt=Ae(j0)),F.list[o]=j0,r0}export{Oe as coverGround,mt as coverMotion,y0 as coverProfiler,Ht as createCover,Xe as loadCoverFonts};
