// The café around the record wall (rounds 2 and 3): a lazy chunk the room controller loads after the
// sun. Everything is drawn in code: plaster, a cement-tile floor, the window with the street and the
// same leaves beyond it, the bar (the back counter, the barista's aisle, the island and the machines on
// them), Neil's work table by the window and what is on it, plants from a leaf atlas drawn once.
// The light is the record wall's own studio light carried out to the room's corners, with the room lit
// by what it can see: the window's sky, the sunlit patch on the record wall and the lit wall around it
// (as area lights, by Lambert's polygon formula), the pendants, and soft contact shadows. Nothing here
// draws while the camera is on Editions, so v1 stays exact.
//
// The furniture is placed as a shop works (operator, 4 Nov 2026): the barista behind the island with the
// machines, nobody seated at the bar, the customers' side clear for the queue, the record wall's middle
// clear for Editions. Shapes are rough for now; the counter's and the table's detail are rounds 4 and 5.
// Most of it is merged into one mesh per material, its colour per vertex, so a full room is a few draws.
import * as THREE from 'three';
import { CAFE } from '../scene/config.js';
import { createWall } from '../scene/wall.js';

const R = CAFE.room, SH = CAFE.shelving, CT = CAFE.counter, TB = CAFE.table, W = CAFE.window, SF = CAFE.shopfront;
const LAMPS = 4, OCCS = 14;
const WIN_MID = `vec3(${R.front.toFixed(1)}, ${((W.y0 + W.y1) / 2).toFixed(1)}, ${((W.z0 + W.z1) / 2).toFixed(1)})`;

// ---- light shared by every room surface ---------------------------------------------------------------
const ROOM_GLSL = /* glsl */`
uniform vec3 uWinQ[4];       // the shopfront's opening (light from the sky and the street)
uniform vec3 uPatchQ[4];     // the sunlit patch on the record wall (warm bounce)
uniform vec3 uWallQ[4];      // the lit record wall around the shelves (neutral bounce)
uniform vec3 uSkyCol, uPatchCol, uWallCol;
uniform vec4 uLampP[${LAMPS}];   // xyz, and w: 1 for a shade that sends its light down, 0 for a globe
uniform vec3 uLampCol;
uniform float uAmbient;
uniform vec4 uOcc[${OCCS}];      // boxes that shade what is near them: centre xz, half size xz (y below uOccTop)
uniform float uOccTop[${OCCS}];
// Lambert's formula: the share of the hemisphere above n that a quad covers, cosine-weighted.
float njQuad(vec3 p, vec3 n, vec3 q0, vec3 q1, vec3 q2, vec3 q3) {
  vec3 a = normalize(q0 - p), b = normalize(q1 - p), c = normalize(q2 - p), d = normalize(q3 - p);
  float f = 0.0;
  vec3 e;
  e = cross(a, b); f += acos(clamp(dot(a, b), -1.0, 1.0)) * dot(n, e) / max(length(e), 1e-6);
  e = cross(b, c); f += acos(clamp(dot(b, c), -1.0, 1.0)) * dot(n, e) / max(length(e), 1e-6);
  e = cross(c, d); f += acos(clamp(dot(c, d), -1.0, 1.0)) * dot(n, e) / max(length(e), 1e-6);
  e = cross(d, a); f += acos(clamp(dot(d, a), -1.0, 1.0)) * dot(n, e) / max(length(e), 1e-6);
  return max(f / 6.2831853, 0.0);
}
// Soft darkening near the room's walls, floor and ceiling, and under the furniture.
float njAO(vec3 p, vec3 n) {
  float ao = 1.0;
  vec4 d = vec4(p.x - ${R.back.toFixed(1)}, ${R.front.toFixed(1)} - p.x, p.z, ${R.depth.toFixed(1)} - p.z);
  float dy0 = p.y - ${R.floor.toFixed(1)}, dy1 = ${R.ceiling.toFixed(1)} - p.y;
  // a corner darkens along both walls; a surface does not darken itself
  if (abs(n.y) > 0.5) { ao *= (1.0 - 0.34 * exp(-max(d.x, 0.0) / 160.0)) * (1.0 - 0.3 * exp(-max(d.y, 0.0) / 160.0)) * (1.0 - 0.34 * exp(-max(d.z, 0.0) / 160.0)) * (1.0 - 0.3 * exp(-max(d.w, 0.0) / 160.0)); }
  else {
    ao *= (1.0 - 0.3 * exp(-max(dy0, 0.0) / 150.0)) * (1.0 - 0.22 * exp(-max(dy1, 0.0) / 190.0));
    if (abs(n.x) > 0.5) ao *= (1.0 - 0.3 * exp(-max(d.z, 0.0) / 140.0)) * (1.0 - 0.26 * exp(-max(d.w, 0.0) / 140.0));
    else ao *= (1.0 - 0.3 * exp(-max(d.x, 0.0) / 140.0)) * (1.0 - 0.26 * exp(-max(d.y, 0.0) / 140.0));
  }
  if (n.y > 0.5) {                 // contact shadows fall on what faces up: the floor, a counter, a table top
    for (int i = 0; i < ${OCCS}; i++) {
      vec4 b = uOcc[i];
      if (b.z <= 0.0) continue;
      vec2 q = abs(p.xz - b.xy) - b.zw;
      float sd = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
      float below = clamp((uOccTop[i] - p.y) / 120.0, 0.0, 1.0);
      ao *= 1.0 - 0.5 * below * exp(-max(sd, 0.0) / 70.0);
    }
  }
  return ao;
}
vec3 njLamps(vec3 p, vec3 n) {
  vec3 e = vec3(0.0);
  for (int i = 0; i < ${LAMPS}; i++) {
    vec3 l = uLampP[i].xyz - p;
    float d2 = dot(l, l), id = inversesqrt(d2);
    // a dome sends its light down: a little spills level, none goes up
    float shade = mix(1.0, clamp(l.y * id * 2.2 + 0.35, 0.0, 1.0), uLampP[i].w);
    e += uLampCol * shade * max(dot(n, l * id), 0.0) * (9.0e4 / (d2 + 2.0e4));
  }
  return e;
}
// What a room surface receives, in the record wall's linear units.
vec3 njRoomLight(vec3 p, vec3 n) {
  vec3 e = uSkyCol * njQuad(p, n, uWinQ[0], uWinQ[1], uWinQ[2], uWinQ[3])
         + uPatchCol * njQuad(p, n, uPatchQ[0], uPatchQ[1], uPatchQ[2], uPatchQ[3])
         + uWallCol * njQuad(p, n, uWallQ[0], uWallQ[1], uWallQ[2], uWallQ[3])
         + njLamps(p, n) + vec3(uAmbient);
  return e * njAO(p, n);
}
// Rolled off toward white so the brightest things (the street, a lamp's bulb) never clip.
vec3 njShoulder(vec3 c) {
  float pk = max(c.r, max(c.g, c.b));
  if (pk <= 0.85) return c;
  float np = 0.85 + 0.15 * (1.0 - exp(-(pk - 0.85) / 0.15));
  return c * (np / pk);
}
float njHash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float njNoise2(vec2 x) {
  vec2 i = floor(x), f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(njHash2(i), njHash2(i + vec2(1.0, 0.0)), f.x), mix(njHash2(i + vec2(0.0, 1.0)), njHash2(i + vec2(1.0, 1.0)), f.x), f.y);
}
// What light reaches a leaf or a curtain from behind: the window and the ambient, no lamps or occlusion.
vec3 njBackLight(vec3 p, vec3 n) { return uSkyCol * njQuad(p, n, uWinQ[0], uWinQ[1], uWinQ[2], uWinQ[3]) + vec3(uAmbient); }
`;

const VERT = /* glsl */`
attribute vec3 aCol;
varying vec3 vP;
varying vec3 vN;
varying vec3 vCol;
varying vec2 vUv;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vP = w.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  vCol = aCol;
  vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

// One shader for the room's surfaces, its colour per vertex; uKind picks the pattern: 0 plain, 1 cement
// tiles, 2 wood grain, 3 plaster, 4 marble, 5 fluted wood, 6 glazed tiles, 7 woven fabric, 8 cane,
// 9 translucent (lit from behind too: the tea, a curtain).
const SURFACE_FRAG = /* glsl */`
uniform int uKind;
uniform float uGloss;
varying vec3 vP;
varying vec3 vN;
varying vec3 vCol;
${ROOM_GLSL}
vec2 njFace(vec3 p, vec3 n) { return abs(n.y) > 0.5 ? p.xz : abs(n.x) > 0.5 ? p.zy : p.xy; }
vec3 albedo(vec3 p, vec3 n) {
  vec3 c = vCol;
  if (uKind == 1) {
    // 20 cm cement tiles: a quatrefoil of quarter circles in terracotta and slate on cream, worn.
    vec2 t = p.xz / 90.0, f = fract(t) - 0.5, id = floor(t);
    float r = length(abs(f) - 0.5);
    float petal = smoothstep(0.36, 0.34, r) - smoothstep(0.24, 0.22, r);
    float dotc = smoothstep(0.1, 0.08, length(f));
    vec3 tc = mix(c, vec3(0.62, 0.42, 0.33), petal * 0.3);
    tc = mix(tc, vec3(0.34, 0.37, 0.37), dotc * 0.35);
    float grout = smoothstep(0.485, 0.5, max(abs(f.x), abs(f.y)));
    tc = mix(tc, c * 0.62, grout);
    c = tc * (0.92 + 0.12 * njNoise2(p.xz / 40.0) + 0.05 * njHash2(id));
  } else if (uKind == 2 || uKind == 5) {
    vec2 g = njFace(p, n);
    float grain = njNoise2(vec2(g.x / 3.0, g.y / 70.0)) * 0.6 + njNoise2(vec2(g.x / 11.0, g.y / 240.0)) * 0.4;
    c *= 0.84 + 0.3 * grain;
    if (uKind == 5) { float f = abs(fract(g.x / 26.0) - 0.5) * 2.0; c *= 0.74 + 0.26 * (1.0 - f * f); }
  } else if (uKind == 3) {
    c *= 0.95 + 0.07 * njNoise2(p.xy / 60.0 + p.zz / 60.0) + 0.03 * njNoise2(p.xy / 9.0 + p.zx / 9.0);
  } else if (uKind == 4) {
    float v = njNoise2(p.xz / 55.0 + p.yy / 55.0 + 3.0 * njNoise2(p.xz / 160.0));
    c *= 0.94 + 0.08 * smoothstep(0.45, 0.55, v) - 0.16 * smoothstep(0.495, 0.5, v) * smoothstep(0.505, 0.5, v);
  } else if (uKind == 6) {
    // hand-made glazed tiles, 10 cm square: each its own shade, the glaze pooling, pale grout
    vec2 g = njFace(p, n), t = g / 56.0, f = fract(t), id = floor(t);
    float h = njHash2(id);
    c *= (0.84 + 0.24 * h) * (0.93 + 0.1 * njNoise2(g / 8.0 + h * 17.0));
    float edge = min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y));
    c *= 0.9 + 0.1 * smoothstep(0.0, 0.18, edge);
    c = mix(c, vec3(0.72, 0.69, 0.63), smoothstep(0.035, 0.012, edge));
  } else if (uKind == 7) {
    vec2 g = njFace(p, n);
    c *= 0.9 + 0.08 * sin(g.x * 1.7) * sin(g.y * 1.7) + 0.06 * njNoise2(g / 30.0);
  } else if (uKind == 8) {
    // an open cane weave: bright strands, darker holes
    vec2 g = njFace(p, n) / 7.0, f = fract(g) - 0.5;
    float s = max(smoothstep(0.22, 0.1, abs(f.x)), smoothstep(0.22, 0.1, abs(f.y)));
    s = max(s, 0.7 * max(smoothstep(0.1, 0.03, abs(f.x - f.y)), smoothstep(0.1, 0.03, abs(f.x + f.y))));
    c *= 0.4 + 0.65 * s;
  }
  return c;
}
void main() {
  vec3 n = normalize(vN);
  vec3 e = njRoomLight(vP, n);
  if (uKind == 9) e += 0.7 * njBackLight(vP, -n) * vec3(1.0, 0.82, 0.6);
  vec3 col = albedo(vP, n) * e;
  // a soft sheen on gloss: the window seen in it
  if (uGloss > 0.0) {
    vec3 v = normalize(vP - cameraPosition), r = reflect(v, n);
    vec3 w = ${WIN_MID} - vP;
    col += uGloss * uSkyCol * pow(max(dot(r, normalize(w)), 0.0), 18.0) * njAO(vP, n);
  }
  gl_FragColor = vec4(njShoulder(col), 1.0);
  #include <colorspace_fragment>
}`;

// The record cabinet's front: a grid of cubbies seen into by interior mapping, each holding a row of
// spines (or a record turned face out), lit by the record wall's studio light (its bake, sampled by
// height and width) and the room's own light.
const SPINES_FRAG = /* glsl */`
uniform sampler2D uWallBake;
uniform vec4 uWallRegion;    // the bake's world x0, y0, x1, y1
uniform vec3 uOak;
varying vec3 vP;
varying vec3 vN;
${ROOM_GLSL}
vec3 spineCol(float h) {
  float k = fract(h * 7.13);
  vec3 c = k < 0.22 ? vec3(0.05, 0.05, 0.06) : k < 0.38 ? vec3(0.86, 0.83, 0.76) : k < 0.5 ? vec3(0.62, 0.13, 0.1)
         : k < 0.6 ? vec3(0.12, 0.2, 0.42) : k < 0.7 ? vec3(0.82, 0.52, 0.14) : k < 0.78 ? vec3(0.16, 0.34, 0.24)
         : k < 0.88 ? vec3(0.42, 0.4, 0.38) : vec3(0.58, 0.32, 0.22);
  return c * (0.75 + 0.4 * fract(h * 3.7));
}
void main() {
  const float CUB = ${SH.cubby.toFixed(1)}, FR = ${SH.frame.toFixed(1)}, DEP = ${SH.depth.toFixed(1)};
  vec3 p = vP, v = normalize(vP - cameraPosition);
  vec2 cell = floor((p.xy - vec2(${R.back.toFixed(1)}, ${R.floor.toFixed(1)})) / CUB);
  vec2 o = vec2(${R.back.toFixed(1)}, ${R.floor.toFixed(1)}) + cell * CUB;
  vec2 lc = p.xy - o;
  vec2 bake = (p.xy - uWallRegion.xy) / (uWallRegion.zw - uWallRegion.xy);
  vec3 studio = texture2D(uWallBake, clamp(bake, 0.0, 1.0)).rgb;
  vec3 col;
  if (lc.x < FR * 0.5 || lc.x > CUB - FR * 0.5 || lc.y < FR * 0.5 || lc.y > CUB - FR * 0.5) {
    col = uOak * (0.9 + 0.2 * njNoise2(p.xy / vec2(4.0, 60.0))) * (studio * 0.95 + njRoomLight(p, vec3(0.0, 0.0, 1.0)) * 0.35);
  } else {
    // inside the cubby: its sides, its floor and the spines of the records standing in it
    float x0 = o.x + FR * 0.5, x1 = o.x + CUB - FR * 0.5, y0 = o.y + FR * 0.5, y1 = o.y + CUB - FR * 0.5;
    float hcell = njHash2(cell + 7.0);
    float fill = hcell < 0.12 ? 0.0 : 0.55 + 0.45 * fract(hcell * 5.3);   // a few cubbies hold a record face out
    float zs = DEP - 34.0;                       // the spines, a little inside the front
    float ts = (zs - p.z) / v.z;
    float tx = ((v.x > 0.0 ? x1 : x0) - p.x) / v.x;
    float ty = ((v.y > 0.0 ? y1 : y0) - p.y) / v.y;
    vec3 base;
    float depthShade;
    if (fill == 0.0) {
      float tb = (10.0 - p.z) / v.z, t = min(tb, min(tx, ty));
      vec3 h = p + v * t;
      if (t == tb) { vec2 u = (h.xy - vec2(x0, y0)) / vec2(x1 - x0, y1 - y0); base = mix(spineCol(hcell * 3.1), spineCol(hcell * 9.7), step(0.5, fract(u.x * 2.0 + u.y))) * 0.9; }
      else base = uOak * 0.8;
      depthShade = 0.55 + 0.45 * clamp(h.z / DEP, 0.0, 1.0);
    } else {
      float t = min(ts, min(tx, ty));
      vec3 h = p + v * t;
      if (t == ts) {
        float u = (h.x - x0) / (x1 - x0);
        if (u > fill) {
          float tb = (2.0 - p.z) / v.z; vec3 hb = p + v * min(tb, min(tx, ty));
          base = uOak * 0.55; depthShade = 0.45 + 0.4 * clamp(hb.z / DEP, 0.0, 1.0);
        } else {
          float w = 4.0 + 3.0 * njHash2(cell * 1.7 + floor(h.x / 5.0));
          float id = floor(h.x / w);
          float hh = njHash2(cell + vec2(id, id * 0.37));
          base = spineCol(hh);
          base *= 1.0 + 0.18 * step(0.82, fract(h.y / (y1 - y0) * 3.0 + hh)) * step(fract(hh * 9.0), 0.5);
          base *= 0.78 + 0.22 * smoothstep(0.0, 0.18, abs(fract(h.x / w) - 0.5) * 2.0);
          depthShade = 0.82;
        }
      } else { base = uOak * 0.75; depthShade = 0.55 + 0.45 * clamp(h.z / DEP, 0.0, 1.0); }
    }
    col = base * depthShade * (studio * 0.85 + njRoomLight(p, vec3(0.0, 0.0, 1.0)) * 0.3);
  }
  gl_FragColor = vec4(njShoulder(col), 1.0);
  #include <colorspace_fragment>
}`;

// What is seen through the window: a bright, hazy street in late sun, the same leaves that throw the
// shadows on the record wall (the sun's leaf mask, read where each sight line crosses the glass), lit
// from behind.
const STREET_FRAG = /* glsl */`
uniform sampler2D uLeafSun;
uniform vec3 uSunU, uSunV;
uniform vec4 uMask;
uniform float uHasLeaves;
varying vec3 vP;
varying vec3 vN;
void main() {
  vec3 v = normalize(vP - cameraPosition);
  float t = (${R.front.toFixed(1)} - cameraPosition.x) / v.x;
  vec3 q = cameraPosition + v * t;            // where the sight line crosses the glass
  float hgt = clamp((vP.y - ${W.y0.toFixed(1)}) / ${(W.y1 - W.y0).toFixed(1)}, 0.0, 1.0);
  vec3 sky = mix(vec3(1.05, 0.93, 0.76), vec3(0.95, 0.97, 1.02), smoothstep(0.1, 1.0, hgt));
  // the far side of the soi: a soft band of shopfronts and an awning, out of focus
  sky *= 1.0 - 0.18 * smoothstep(0.42, 0.3, hgt) * (0.6 + 0.4 * sin(vP.z / 48.0));
  vec3 col = sky * 1.05;
  if (uHasLeaves > 0.5) {
    vec2 uv = (vec2(dot(q, uSunU), dot(q, uSunV)) - uMask.xy) / (2.0 * uMask.z) + 0.5;
    float clear = texture2D(uLeafSun, uv).r;
    col = mix(vec3(0.26, 0.36, 0.1) * 1.4, col, clear);   // leaves lit from behind: yellow-green
  }
  gl_FragColor = vec4(col * 0.97, 1.0);
  #include <colorspace_fragment>
}`;

// Reeded glass in the shopfront's outer panes: bright with the street behind it, ribbed, the leaves only a
// soft shade through it.
const REEDED_FRAG = /* glsl */`
uniform sampler2D uLeafSun;
uniform vec3 uSunU, uSunV;
uniform vec4 uMask;
uniform float uHasLeaves;
varying vec3 vP;
varying vec3 vN;
void main() {
  float rib = 0.5 + 0.5 * sin(vP.z / 4.2 * 3.14159);
  float hgt = clamp((vP.y - ${SF.y0.toFixed(1)}) / ${(SF.y1 - SF.y0).toFixed(1)}, 0.0, 1.0);
  vec3 col = mix(vec3(0.98, 0.9, 0.77), vec3(0.9, 0.92, 0.95), hgt) * (0.9 + 0.08 * rib);
  if (uHasLeaves > 0.5) {
    vec2 uv = (vec2(dot(vP, uSunU), dot(vP, uSunV)) - uMask.xy) / (2.0 * uMask.z) + 0.5;
    col *= 0.86 + 0.14 * texture2D(uLeafSun, uv).r;
  }
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

// Glass: what it reflects (the room, the window's brightness to one side) by Fresnel, over a faint tint.
const GLASS_FRAG = /* glsl */`
uniform float uAlpha;
varying vec3 vP;
varying vec3 vN;
varying vec3 vCol;
${ROOM_GLSL}
void main() {
  vec3 n = normalize(vN), v = normalize(vP - cameraPosition);
  if (dot(n, v) > 0.0) n = -n;
  float c = clamp(-dot(n, v), 0.0, 1.0), fr = 0.04 + 0.96 * pow(1.0 - c, 5.0);
  vec3 r = reflect(v, n);
  float spec = pow(max(dot(r, normalize(${WIN_MID} - vP)), 0.0), 40.0);
  vec3 env = mix(vec3(0.3, 0.27, 0.23), uSkyCol * 0.45, smoothstep(-0.2, 0.7, r.x));
  vec3 refl = env + uSkyCol * spec * 1.6;
  vec3 tint = vCol * njRoomLight(vP, n);
  float a = clamp(fr * 0.9 + uAlpha + spec * 0.5, 0.0, 0.94);
  gl_FragColor = vec4(njShoulder((refl * fr * 0.9 + refl * spec * 0.5 + tint * uAlpha) / max(a, 1e-3)), a);
  #include <colorspace_fragment>
}`;

// Leaves: cards cut from the leaf atlas, lit on both faces, the light behind them coming through yellow.
const LEAF_FRAG = /* glsl */`
uniform sampler2D uAtlas;
varying vec3 vP;
varying vec3 vN;
varying vec3 vCol;
varying vec2 vUv;
${ROOM_GLSL}
void main() {
  vec4 t = texture2D(uAtlas, vUv);
  if (t.a < 0.2) discard;
  float cover = clamp((t.a - 0.5) / max(fwidth(t.a), 1e-3) + 0.5, 0.0, 1.0);
  vec3 n = normalize(vN) * (gl_FrontFacing ? 1.0 : -1.0);
  vec3 c = vCol * t.rgb;
  vec3 col = c * (njRoomLight(vP, n) + njBackLight(vP, -n) * 0.45 * vec3(0.85, 1.0, 0.45));
  vec3 v = normalize(vP - cameraPosition), r = reflect(v, n);
  col += 0.07 * uSkyCol * pow(max(dot(r, normalize(${WIN_MID} - vP)), 0.0), 10.0);
  gl_FragColor = vec4(njShoulder(col), cover);
  #include <colorspace_fragment>
}`;

const EMISSIVE_FRAG = /* glsl */`
varying vec3 vCol;
void main() { gl_FragColor = vec4(vCol, 1.0);
  #include <colorspace_fragment>
}`;

const TEX_FRAG = /* glsl */`
uniform sampler2D uMap;
uniform float uGain;
varying vec2 vUv;
void main() { gl_FragColor = vec4(texture2D(uMap, vUv).rgb * uGain, 1.0);
  #include <colorspace_fragment>
}`;

// ---- drawn once: the menu board's chalk (copy rows C2 to C4), the laptop's screen (row C10), the leaves -----
function canvasTexture(w, h, draw, colorSpace = THREE.SRGBColorSpace) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = colorSpace;
  t.anisotropy = 4;
  return t;
}
function mulberry32(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function drawMenu(g, w, h) {
  const r = mulberry32(5);
  g.fillStyle = '#1b1f1e'; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(255,255,255,${0.012 + 0.02 * r()})`; g.beginPath(); g.ellipse(r() * w, r() * h, 60 + 160 * r(), 30 + 80 * r(), r() * 3, 0, 7); g.fill(); }
  g.fillStyle = 'rgba(244,240,230,0.94)'; g.textBaseline = 'alphabetic';
  g.font = '600 92px "NJ Text", system-ui, sans-serif'; g.fillText('Menu', 80, 150);
  g.fillRect(80, 178, 220, 4);
  const item = (y, name, line) => {
    g.font = '600 62px "NJ Text", system-ui, sans-serif'; g.fillStyle = 'rgba(244,240,230,0.94)'; g.fillText(name, 80, y);
    g.font = '400 34px "NJ Text", system-ui, sans-serif'; g.fillStyle = 'rgba(232,226,212,0.78)';
    const words = line.split(' '); let l = '', yy = y + 56;
    for (const wd of words) { if (g.measureText(l + wd).width > w - 180) { g.fillText(l, 80, yy); l = ''; yy += 44; } l += wd + ' '; }
    g.fillText(l, 80, yy);
  };
  item(320, 'Cross-platform content', 'Video, images and posts made for each platform and published for you.');
  item(560, 'Community management', "Comments, messages and requests answered in your brand's voice.");
  g.font = '600 40px "NJ Text", system-ui, sans-serif'; g.fillStyle = 'rgba(240,196,120,0.95)'; g.fillText('Order here →', 80, h - 70);
}
// The laptop: the record wall in the sun behind, the terminal in front (round 5 renders the wall live).
function drawScreen(g, w, h) {
  const bg = g.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#e9e4da'); bg.addColorStop(1, '#d8d1c3');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  const sun = g.createRadialGradient(w * 0.58, h * 0.42, 10, w * 0.58, h * 0.42, w * 0.42);
  sun.addColorStop(0, 'rgba(255,214,150,0.75)'); sun.addColorStop(1, 'rgba(255,214,150,0)');
  g.fillStyle = sun; g.fillRect(0, 0, w, h);
  const covers = [['#151515', '#f08a24'], ['#2f6fe8', '#bcd6ff'], ['#0f5e55', '#8fe0c8'], ['#1d3b2a', '#f3f0e6'], ['#dccdf6', '#9b7be0'],
    ['#ffd23f', '#e2412f'], ['#f6f4ef', '#2fa35c'], ['#efe6d2', '#f07a18'], ['#1f2a44', '#f5c04a'], ['#e9e2f8', '#7a5cd6']];
  const S = h * 0.24;
  covers.forEach(([a, b], i) => {
    const row = i < 5 ? 0 : 1, col = i % 5, x = w * 0.04 + col * (S + h * 0.03), y = row ? h * 0.6 : h * 0.22;
    g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(x + 6, y + 8, S, S);
    g.fillStyle = a; g.fillRect(x, y, S, S);
    g.fillStyle = b; g.beginPath(); g.arc(x + S * (0.35 + 0.3 * (i % 3) / 2), y + S * 0.62, S * 0.22, 0, 7); g.fill();
    g.fillRect(x + S * 0.1, y + S * 0.1, S * 0.5, S * 0.1);
  });
  g.fillStyle = '#f4f1ea'; g.fillRect(0, h * 0.22 + S + 2, w, 7); g.fillRect(0, h * 0.6 + S + 2, w, 7);
  // the terminal, over the wall
  const tx = w * 0.4, ty = h * 0.34, tw = w * 0.56, th = h * 0.6, rr = 14;
  g.fillStyle = 'rgba(0,0,0,0.25)'; g.beginPath(); g.roundRect(tx + 8, ty + 14, tw, th, rr); g.fill();
  g.fillStyle = '#17181b'; g.beginPath(); g.roundRect(tx, ty, tw, th, rr); g.fill();
  g.fillStyle = '#25262b'; g.beginPath(); g.roundRect(tx, ty, tw, 30, [rr, rr, 0, 0]); g.fill();
  ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(tx + 20 + i * 20, ty + 15, 6, 0, 7); g.fill(); });
  const lines = [
    ['#8be9a8', '~/njct.io  feat/room'], ['#d6d6d6', '$ npm run build'], ['#9a9a9a', '  dist/ matches a fresh build'],
    ['#d6d6d6', '$ git log --oneline -3'], ['#e8c07a', '  0d72dde The sun: a plain window'], ['#e8c07a', "  490f3f2 Tagline: \"Products I've designed"],
    ['#e8c07a', '  18a1db7 Merge feat/sun into feat/room'], ['#d6d6d6', '$ █'],
  ];
  g.font = '500 21px ui-monospace, Menlo, Consolas, monospace';
  lines.forEach(([c, t], i) => { g.fillStyle = c; g.fillText(t, tx + 18, ty + 62 + i * 30); });
}
// Eight leaves, white on clear, their veins and markings in shades (the plants' colour is per leaf):
// 0 monstera, 1 pothos, 2 fiddle-leaf fig, 3 banana, 4 snake plant, 5 pilea, 6 fern, 7 a flower.
// Each runs from its stem at the cell's foot to its tip at the top.
function drawLeaves(g, w, h) {
  const S = 256;
  g.clearRect(0, 0, w, h);
  const cell = (i, f) => { g.save(); g.translate((i % 4) * S, (i >> 2) * S); g.beginPath(); g.rect(0, 0, S, S); g.clip(); f(); g.restore(); };
  const shape = (c, f) => { g.fillStyle = c; g.beginPath(); f(); g.fill(); };
  const mode = (m, f) => { g.save(); g.globalCompositeOperation = m; f(); g.restore(); };
  const line = (lw, c, pts) => { g.lineWidth = lw; g.strokeStyle = c; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(...pts[0]); for (let k = 1; k < pts.length; k++) g.lineTo(...pts[k]); g.stroke(); };
  cell(0, () => {
    shape('#d6d6d6', () => { g.moveTo(128, 226); g.bezierCurveTo(150, 252, 206, 254, 230, 210); g.bezierCurveTo(258, 156, 246, 66, 198, 32); g.bezierCurveTo(170, 12, 142, 6, 128, 6); g.bezierCurveTo(114, 6, 86, 12, 58, 32); g.bezierCurveTo(10, 66, -2, 156, 26, 210); g.bezierCurveTo(50, 254, 106, 252, 128, 226); });
    mode('source-atop', () => { line(5, 'rgba(0,0,0,0.2)', [[128, 236], [128, 8]]); for (let k = 0; k < 6; k++) for (const s of [-1, 1]) line(3, 'rgba(0,0,0,0.14)', [[128, 214 - k * 34], [128 + s * 62, 194 - k * 36], [128 + s * 130, 160 - k * 38]]); });
    mode('destination-out', () => {
      for (let k = 0; k < 5; k++) for (const s of [-1, 1]) line(7 - k * 0.7, '#000', [[128 + s * 34, 198 - k * 34], [128 + s * 84, 180 - k * 36], [128 + s * 150, 146 - k * 38]]);
      g.fillStyle = '#000'; for (let k = 0; k < 3; k++) for (const s of [-1, 1]) { g.beginPath(); g.ellipse(128 + s * 20, 178 - k * 44, 4.5, 10, s * 0.4, 0, 7); g.fill(); }
    });
  });
  cell(1, () => {
    shape('#d2d2d2', () => { g.moveTo(128, 222); g.bezierCurveTo(104, 252, 22, 246, 20, 170); g.bezierCurveTo(18, 100, 84, 44, 128, 6); g.bezierCurveTo(172, 44, 238, 100, 236, 170); g.bezierCurveTo(234, 246, 152, 252, 128, 222); });
    mode('source-atop', () => {
      line(4, 'rgba(0,0,0,0.18)', [[128, 230], [128, 12]]);
      for (let k = 0; k < 4; k++) for (const s of [-1, 1]) line(2.5, 'rgba(0,0,0,0.12)', [[128, 200 - k * 40], [128 + s * 70, 168 - k * 44], [128 + s * 98, 128 - k * 46]]);
      for (let k = 0; k < 7; k++) { g.fillStyle = 'rgba(255,255,230,0.38)'; g.beginPath(); g.ellipse(64 + k * 21, 80 + (k * 53) % 120, 4, 28, 0.7 - k * 0.2, 0, 7); g.fill(); }
    });
  });
  cell(2, () => {
    shape('#c6c6c6', () => { g.moveTo(128, 252); g.bezierCurveTo(92, 248, 66, 214, 66, 176); g.bezierCurveTo(66, 146, 36, 128, 28, 86); g.bezierCurveTo(20, 40, 70, 4, 128, 6); g.bezierCurveTo(186, 4, 236, 40, 228, 86); g.bezierCurveTo(220, 128, 190, 146, 190, 176); g.bezierCurveTo(190, 214, 164, 248, 128, 252); });
    mode('source-atop', () => { line(5, 'rgba(255,255,225,0.5)', [[128, 252], [128, 12]]); for (let k = 0; k < 6; k++) for (const s of [-1, 1]) line(2.5, 'rgba(255,255,225,0.38)', [[128, 222 - k * 34], [128 + s * 52, 198 - k * 36], [128 + s * 94, 170 - k * 38]]); });
  });
  cell(3, () => {
    shape('#cccccc', () => { g.moveTo(128, 254); g.bezierCurveTo(86, 226, 66, 140, 72, 60); g.bezierCurveTo(76, 18, 108, 2, 128, 2); g.bezierCurveTo(148, 2, 180, 18, 184, 60); g.bezierCurveTo(190, 140, 170, 226, 128, 254); });
    mode('source-atop', () => { line(5, 'rgba(255,255,220,0.45)', [[128, 254], [128, 4]]); for (let k = 0; k < 22; k++) for (const s of [-1, 1]) line(1.2, 'rgba(0,0,0,0.12)', [[128, 240 - k * 10.5], [128 + s * 62, 226 - k * 10.5]]); });
    mode('destination-out', () => { for (const [y, s] of [[64, 1], [150, -1], [196, 1], [110, -1]]) line(2.5, '#000', [[128 + s * 18, y], [128 + s * 72, y - 12]]); });
  });
  cell(4, () => {
    const blade = () => { g.moveTo(104, 256); g.bezierCurveTo(94, 150, 104, 60, 128, 0); g.bezierCurveTo(152, 60, 162, 150, 152, 256); };
    shape('#c8c8c8', blade);
    mode('source-atop', () => {
      for (let k = 0; k < 16; k++) { g.fillStyle = k % 2 ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,220,0.2)'; g.beginPath(); g.ellipse(128, 242 - k * 15, 34, 3.5 + (k % 3), 0.15 * Math.sin(k), 0, 7); g.fill(); }
      g.strokeStyle = 'rgba(235,225,120,0.85)'; g.lineWidth = 5; g.beginPath(); blade(); g.stroke();
    });
  });
  cell(5, () => {
    shape('#cfcfcf', () => { g.arc(128, 128, 112, 0, 7); });
    mode('source-atop', () => { for (let k = 0; k < 9; k++) { const a = k / 9 * 6.283; line(2.5, 'rgba(0,0,0,0.13)', [[128, 128], [128 + Math.cos(a) * 104, 128 + Math.sin(a) * 104]]); } });
  });
  cell(6, () => {
    g.fillStyle = '#c8c8c8';
    for (let k = 0; k < 18; k++) { const y = 246 - k * 13, len = 104 * Math.sin(Math.PI * (k + 1) / 20); for (const s of [-1, 1]) { g.beginPath(); g.ellipse(128 + s * len * 0.5, y - 6, len * 0.5, 5.5, s * -0.35, 0, 7); g.fill(); } }
    line(3, '#c8c8c8', [[128, 256], [128, 8]]);
  });
  cell(7, () => {
    for (let k = 0; k < 5; k++) { const a = k / 5 * 6.283 - 1.57; g.fillStyle = '#f4f4f4'; g.beginPath(); g.ellipse(128 + Math.cos(a) * 54, 128 + Math.sin(a) * 54, 54, 36, a, 0, 7); g.fill(); }
    g.fillStyle = '#f0d070'; g.beginPath(); g.arc(128, 128, 22, 0, 7); g.fill();
  });
}

// ---- the finishing pass -----------------------------------------------------------------------------
// The room views' scene is drawn into a linear target, then graded warm, its corners softened, and
// encoded for the screen. Its strength follows the move, so Editions is never touched.
const FINISH_FRAG = /* glsl */`
uniform sampler2D uSrc;
uniform float uAmount;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(uSrc, vUv).rgb;
  vec3 g = c * vec3(1.07, 0.99, 0.86);
  g = mix(g, g * g * (3.0 - 2.0 * g), 0.18);                 // a little more contrast
  vec2 q = vUv - 0.5;
  g *= 1.0 - 0.22 * dot(q, q) * 2.2;                          // the corners fall off
  gl_FragColor = vec4(mix(c, g, uAmount), 1.0);
  #include <colorspace_fragment>
  gl_FragColor.rgb += (fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))) - 0.5) / 255.0;
}`;
// The target follows the drawing buffer, capped at 1.5 CSS pixels to the pixel until the cost is measured on
// real GPUs, with 4 samples, or 2 past 4 million pixels.
const FINISH_MAX_RATIO = 1.5, FINISH_BIG = 4e6;
function createFinish(renderer) {
  let rt = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 4, depthBuffer: true });
  const mat = new THREE.ShaderMaterial({ uniforms: { uSrc: { value: rt.texture }, uAmount: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: FINISH_FRAG, depthTest: false, depthWrite: false, toneMapped: false });
  const tri = new THREE.BufferGeometry();
  tri.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  const quad = new THREE.Mesh(tri, mat); quad.frustumCulled = false;
  const sc = new THREE.Scene(), cam = new THREE.Camera(); sc.add(quad);
  const size = new THREE.Vector2();
  function fit() {
    renderer.getDrawingBufferSize(size);
    const k = Math.min(1, FINISH_MAX_RATIO / Math.max(1, renderer.getPixelRatio()));
    const w = Math.max(1, Math.round(size.x * k)), h = Math.max(1, Math.round(size.y * k)), samples = w * h > FINISH_BIG ? 2 : 4;
    if (rt.samples !== samples) { rt.dispose(); rt = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples, depthBuffer: true }); mat.uniforms.uSrc.value = rt.texture; }
    else if (rt.width !== w || rt.height !== h) rt.setSize(w, h);
  }
  return {
    get target() { fit(); return rt; },
    // The finishing quad's program, for the screen, built before the first move needs it.
    compile() { renderer.compile(sc, cam); },
    render(scene, camera, amount) {
      fit();
      renderer.setRenderTarget(rt);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      mat.uniforms.uAmount.value = amount;
      renderer.render(sc, cam);
    },
    dispose() { rt.dispose(); mat.dispose(); tri.dispose(); },
  };
}

// Geometries merged into one: positions, normals, uvs and the per-vertex colour, indexed.
function merge(geos) {
  let nv = 0, ni = 0;
  for (const g of geos) { nv += g.attributes.position.count; ni += g.index ? g.index.count : g.attributes.position.count; }
  const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), uv = new Float32Array(nv * 2), col = new Float32Array(nv * 3);
  const idx = nv > 65535 ? new Uint32Array(ni) : new Uint16Array(ni);
  let ov = 0, oi = 0;
  for (const g of geos) {
    const a = g.attributes, n = a.position.count;
    pos.set(a.position.array.subarray(0, n * 3), ov * 3);
    nor.set(a.normal.array.subarray(0, n * 3), ov * 3);
    if (a.uv) uv.set(a.uv.array.subarray(0, n * 2), ov * 2);
    col.set(a.aCol.array, ov * 3);
    if (g.index) { const ix = g.index.array; for (let i = 0; i < ix.length; i++) idx[oi + i] = ix[i] + ov; oi += ix.length; }
    else { for (let i = 0; i < n; i++) idx[oi + i] = ov + i; oi += n; }
    ov += n;
  }
  const m = new THREE.BufferGeometry();
  m.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  m.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  m.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  m.setAttribute('aCol', new THREE.BufferAttribute(col, 3));
  m.setIndex(new THREE.BufferAttribute(idx, 1));
  m.computeBoundingSphere();
  return m;
}

// The palette, in linear light.
const C = {
  plaster: [0.8, 0.77, 0.72], ceiling: [0.78, 0.76, 0.72], floor: [0.76, 0.71, 0.62], dark: [0.035, 0.032, 0.03],
  oak: [0.62, 0.45, 0.28], teak: [0.4, 0.25, 0.14], walnut: [0.2, 0.12, 0.07], bentwood: [0.13, 0.075, 0.045],
  steel: [0.05, 0.07, 0.06], chrome: [0.24, 0.25, 0.26], stainless: [0.44, 0.45, 0.46], ink: [0.045, 0.045, 0.05], brass: [0.5, 0.36, 0.16],
  mint: [0.36, 0.56, 0.46], cream: [0.9, 0.87, 0.8], terra: [0.56, 0.3, 0.2], clay: [0.7, 0.5, 0.36], sage: [0.28, 0.4, 0.32],
  marble: [0.86, 0.85, 0.82], slate: [0.09, 0.1, 0.1], enamel: [0.12, 0.24, 0.2], glow: [1.0, 0.86, 0.62], screen: [0.1, 0.12, 0.16],
  leafM: [0.12, 0.33, 0.09], leafF: [0.14, 0.34, 0.08], leafP: [0.2, 0.42, 0.1], leafS: [0.12, 0.27, 0.11], leafB: [0.2, 0.4, 0.12], stem: [0.22, 0.32, 0.1], bark: [0.25, 0.18, 0.12],
  soil: [0.1, 0.07, 0.045], beans: [0.18, 0.1, 0.05], coffee: [0.09, 0.045, 0.02], tea: [0.95, 0.4, 0.09], milk: [0.95, 0.9, 0.8], crust: [0.72, 0.42, 0.15],
  cane: [0.62, 0.46, 0.27], oat: [0.74, 0.66, 0.54], rust: [0.56, 0.24, 0.12], indigo: [0.08, 0.12, 0.27], olive: [0.3, 0.32, 0.16], clear: [0.85, 0.9, 0.88],
};
const BAGS = [[0.62, 0.36, 0.22], [0.85, 0.8, 0.7], [0.16, 0.2, 0.19], [0.72, 0.52, 0.3], [0.3, 0.44, 0.4], [0.82, 0.62, 0.48], [0.14, 0.16, 0.28]];
const LABELS = [[0.95, 0.92, 0.85], [0.9, 0.55, 0.25], [0.2, 0.2, 0.2], [0.85, 0.75, 0.3]];

export function createShell({ renderer, scene, lightUniforms, sun }) {
  const group = new THREE.Group();
  group.visible = false;
  scene.add(group);
  const disposables = [];
  const keep = x => (disposables.push(x), x);
  const { front: XF, back: XB, floor: YF, ceiling: YC, depth: ZD } = R;
  const V = (x, y, z) => new THREE.Vector3(x, y, z), UP = V(0, 1, 0);

  // ---- where things stand (rough furniture, real sizes: one unit is about 1.77 mm) ---------------------
  const BK = { x0: XB, x1: XB + CT.back, z0: 0, z1: 2050, top: CT.backTop };     // the back counter
  const FR = { x0: XB, x1: XB + 300, z0: 2065, z1: 2345, top: 560 };             // the drinks fridge at its end
  const DOOR = { z0: 2440, z1: 2740, spring: 400 };                               // the arched way to the back
  const ISL = CT;                                                                 // the island
  const SHV = { x0: -2058, x1: -1065, d: 240, top: 760 };                         // shelving along the record wall
  // Two domes over the island, their cords clear of the menu from the Counter view, one over the brew bar,
  // and a globe over Neil's table.
  const tableLamp = V((TB.x0 + TB.x1) / 2, 310, (TB.z0 + TB.z1) / 2 + 60);
  const lamps = [V((ISL.x0 + ISL.x1) / 2, 360, 1080), V((ISL.x0 + ISL.x1) / 2, 360, 1960), V(XB + 250, 470, 620)];

  // ---- the light every surface shares -------------------------------------------------------------------
  const L = {
    uWinQ: { value: [SF.y0, SF.y1].flatMap(y => [SF.z0, SF.z1].map(z => V(R.front, y, z))) },
    uPatchQ: { value: [0, 1, 2, 3].map(() => V(0, 0, 0)) },
    uWallQ: { value: [V(-SH.niche.x, R.floor, 0), V(SH.niche.x, R.floor, 0), V(SH.niche.x, SH.niche.top, 0), V(-SH.niche.x, SH.niche.top, 0)] },
    uSkyCol: { value: V(2.3, 2.38, 2.55) },
    uPatchCol: { value: V(2.6, 1.6, 0.78) },
    uWallCol: { value: V(0.86, 0.82, 0.76) },
    uLampP: { value: [...lamps.map(p => new THREE.Vector4(p.x, p.y, p.z, 1)), new THREE.Vector4(tableLamp.x, tableLamp.y, tableLamp.z, 0)] },
    uLampCol: { value: V(0.95, 0.6, 0.28) },
    uAmbient: { value: 0.065 },
    uOcc: { value: Array.from({ length: OCCS }, () => new THREE.Vector4(0, 0, 0, 0)) },
    uOccTop: { value: new Array(OCCS).fill(-1e4) },
  };
  // The window, wound so the room sees it; the patch, the window met along the sun on the record wall.
  const winQ = L.uWinQ.value; [winQ[2], winQ[3]] = [winQ[3], winQ[2]];
  function quadF(p, n, q) {
    let f = 0;
    for (let i = 0; i < 4; i++) {
      const a = q[i].clone().sub(p).normalize(), b = q[(i + 1) % 4].clone().sub(p).normalize();
      const e = new THREE.Vector3().crossVectors(a, b);
      f += Math.acos(Math.max(-1, Math.min(1, a.dot(b)))) * n.dot(e) / Math.max(e.length(), 1e-6);
    }
    return f / (2 * Math.PI);
  }
  const fixWinding = (q, p, n) => { if (quadF(p, n, q) < 0) q.reverse(); };
  const mid = V(0, 0, 1400);
  fixWinding(winQ, mid, V(1, 0, 0));
  fixWinding(L.uWallQ.value, mid, V(0, 0, -1));
  if (sun) {
    const D = sun.uniforms.uSunD.value;
    const corners = [[W.y0, W.z0], [W.y0, W.z1], [W.y1, W.z1], [W.y1, W.z0]].map(([y, z]) => V(R.front, y, z));
    corners.forEach((q, i) => L.uPatchQ.value[i].copy(q).addScaledVector(D, -q.z / D.z));
    fixWinding(L.uPatchQ.value, mid, V(0, 0, -1));
  } else L.uPatchCol.value.set(0, 0, 0);
  // Boxes that shade what is under and beside them: x, z, half sizes, top.
  const occ = [
    [(BK.x0 + BK.x1) / 2, (BK.z0 + BK.z1) / 2, CT.back / 2, (BK.z1 - BK.z0) / 2, BK.top],
    [(FR.x0 + FR.x1) / 2, (FR.z0 + FR.z1) / 2, 150, 140, FR.top],
    [(ISL.x0 + ISL.x1) / 2, (ISL.z0 + ISL.z1) / 2, (ISL.x1 - ISL.x0) / 2, (ISL.z1 - ISL.z0) / 2, ISL.top],
    [(SHV.x0 + SHV.x1) / 2, SHV.d / 2, (SHV.x1 - SHV.x0) / 2, SHV.d / 2, SHV.top],
    [(TB.x0 + TB.x1) / 2, (TB.z0 + TB.z1) / 2, (TB.x1 - TB.x0) / 2, (TB.z1 - TB.z0) / 2, TB.top],
    [560, 1700, 105, 105, -366], [630, 1430, 105, 105, -366],
    [XF - 70, 715, 70, 485, SF.y0], [(SH.niche.x + XF) / 2, 115, (XF - SH.niche.x) / 2, 115, 316],
    [-1000, 430, 100, 100, -420],
    [-1347, 1510, 145, 210, ISL.top + 250], [-1330, 1935, 140, 150, ISL.top + 220],
    [-2270, 1160, 115, 100, BK.top + 380],
  ];
  occ.forEach(([x, z, hx, hz, top], i) => { L.uOcc.value[i].set(x, z, hx, hz); L.uOccTop.value[i] = top; });

  // ---- materials ------------------------------------------------------------------------------------------
  const leafTex = keep(canvasTexture(1024, 512, drawLeaves, THREE.NoColorSpace));
  const shaderMat = (frag, uniforms = {}, extra = {}) => keep(new THREE.ShaderMaterial({ uniforms: { ...L, ...uniforms }, vertexShader: VERT, fragmentShader: frag, toneMapped: false, ...extra }));
  const surf = (kind, gloss = 0) => shaderMat(SURFACE_FRAG, { uKind: { value: kind }, uGloss: { value: gloss } });
  const MAT = {
    plain: surf(0), satin: surf(0, 0.3), chrome: surf(0, 0.9), wood: surf(2, 0.04), flute: surf(5, 0.04), plaster: surf(3),
    marble: surf(4, 0.25), tile: surf(1, 0.04), glazed: surf(6, 0.5), fabric: surf(7), cane: surf(8), thru: surf(9, 0.2),
    emit: shaderMat(EMISSIVE_FRAG),
    leaf: shaderMat(LEAF_FRAG, { uAtlas: { value: leafTex } }, { side: THREE.DoubleSide, alphaToCoverage: true }),
    glass: shaderMat(GLASS_FRAG, { uAlpha: { value: 0.05 } }, { transparent: true, depthWrite: false, side: THREE.DoubleSide }),
  };

  // ---- building: every part goes into its material's batch, in world space, with its colour ----------
  const batches = new Map();
  function put(key, g, F, col) {
    if (F) g.applyMatrix4(F);
    const n = g.attributes.position.count, c = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) c.set(col, i * 3);
    g.setAttribute('aCol', new THREE.BufferAttribute(c, 3));
    if (!batches.has(key)) batches.set(key, []);
    batches.get(key).push(g);
    return g;
  }
  const _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3(1, 1, 1);
  // A frame: moved to x, y, z and turned (yaw about y, then pitch about x, then roll about z), within a parent.
  const at = (x = 0, y = 0, z = 0, ry = 0, rx = 0, rz = 0, parent = null) => {
    const m = new THREE.Matrix4().compose(_p.set(x, y, z), _q.setFromEuler(_e.set(rx, ry, rz, 'YXZ')), _s);
    return parent ? parent.clone().multiply(m) : m;
  };
  const bx = (key, col, x0, y0, z0, x1, y1, z1, F) => put(key, new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0).translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2), F, col);
  const cy = (key, col, x, y0, z, r, h, F, rTop = r, seg = 24) => put(key, new THREE.CylinderGeometry(rTop, r, h, seg).translate(x, y0 + h / 2, z), F, col);
  const el = (key, col, x, y, z, rx, ry, rz, F, seg = 16) => put(key, new THREE.SphereGeometry(1, seg, Math.max(6, seg >> 1)).scale(rx, ry, rz).translate(x, y, z), F, col);
  const lathe = (key, col, pts, x, y, z, F, seg = 24) => put(key, new THREE.LatheGeometry(pts.map(([r, h]) => new THREE.Vector2(r, h)), seg).translate(x, y, z), F, col);
  const rod = (key, col, a, b, r, F, seg = 8) => {
    const d = b.clone().sub(a), len = d.length();
    return put(key, new THREE.CylinderGeometry(r, r, len, seg).applyQuaternion(_q.setFromUnitVectors(UP, d.normalize())).translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2), F, col);
  };
  const ring = (key, col, R0, r, F, arc = Math.PI * 2, seg = 32) => put(key, new THREE.TorusGeometry(R0, r, 8, seg, arc), F, col);
  const quad = (key, col, w, h, F) => put(key, new THREE.PlaneGeometry(w, h), F, col);
  const pillow = (key, col, w, h, d, F) => {
    const g = new THREE.BoxGeometry(1, 1, 1, 8, 8, 2), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i) * 2, y = p.getY(i) * 2, z = p.getZ(i);
      const puff = Math.sqrt(Math.max(0, (1 - x ** 4) * (1 - y ** 4)));
      p.setXYZ(i, x * w / 2 * (1 - 0.06 * y * y), y * h / 2 * (1 - 0.06 * x * x), z * d * (0.18 + 0.82 * puff));
    }
    g.computeVertexNormals();
    return put(key, g, F, col);
  };
  const jit = (c, r, k = 0.28) => { const s = 1 - k / 2 + k * r(); return c.map(v => v * s); };
  const special = (geo, mat, F) => { const m = new THREE.Mesh(keep(geo), mat); if (F) { m.matrixAutoUpdate = false; m.matrix.copy(F); m.matrixWorldNeedsUpdate = true; } group.add(m); return m; };

  // ---- plants -----------------------------------------------------------------------------------------------
  // A leaf: a card from the atlas, its stem end at `base`, running along `dir`, w wide and h long; bend
  // droops its tip, roll turns it about its length.
  function leaf(cell, col, base, dir, w, h, bend = 0.15, roll = 0) {
    const y = dir.clone().normalize(), x = new THREE.Vector3().crossVectors(y, UP);
    if (x.lengthSq() < 1e-6) x.set(1, 0, 0);
    x.normalize();
    if (roll) x.applyAxisAngle(y, roll);
    const z = new THREE.Vector3().crossVectors(x, y).normalize();
    const g = new THREE.PlaneGeometry(1, 1, 2, 4), p = g.attributes.position, uv = g.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      const u = uv.getX(i), v = uv.getY(i), a = (u - 0.5) * 2;
      p.setXYZ(i, (u - 0.5) * w, v * h, (-bend * v * v + 0.05 * a * a) * h);
      uv.setXY(i, ((cell & 3) + u) / 4, 1 - ((cell >> 2) + 1 - v) / 2);
    }
    g.computeVertexNormals();
    put('leaf', g, new THREE.Matrix4().makeBasis(x, y, z).setPosition(base), col);
  }
  const stem = (a, b, r = 3, col = C.stem) => rod('plain', col, a, b, r, null, 5);
  function pot(x, y, z, r, h, col = C.terra, key = 'satin') {
    lathe(key, col, [[0, 0], [r * 0.78, 0], [r, h * 0.92], [r * 1.05, h], [r * 0.95, h], [r * 0.9, h * 0.9], [0, h * 0.9]], x, y, z);
    cy('plain', C.soil, x, y + h * 0.84, z, r * 0.9, 4, null, r * 0.9, 20);
  }
  // a0..a1: the directions its leaves may take (0 is +x, a quarter turn +z), to keep it off walls and the beam
  function monstera(x, y, z, size, n, seed, a0 = 0, a1 = 2 * Math.PI) {
    const r = mulberry32(seed);
    for (let k = 0; k < n; k++) {
      const a = a0 + (a1 - a0) * ((k * 0.618 + r() * 0.25) % 1), tilt = 0.25 + r() * 0.75, L0 = size * (0.5 + r() * 0.5);
      const base = V(x, y, z), tip = base.clone().addScaledVector(V(Math.cos(a) * Math.sin(tilt), Math.cos(tilt), Math.sin(a) * Math.sin(tilt)), L0);
      stem(base, tip, 3.5);
      leaf(0, jit(C.leafM, r), tip, V(Math.cos(a), 0.45 - r() * 0.7, Math.sin(a)), size * (0.68 + r() * 0.2), size * (0.62 + r() * 0.2), 0.16, (r() - 0.5) * 0.7);
    }
  }
  // A fiddle-leaf fig: a trunk that forks into three branches part way up, its leaves on their upper parts,
  // turned within a0..a1 (0 is +x, a quarter turn +z).
  function fig(x, y, z, height, seed, a0 = 0, a1 = 2 * Math.PI, n = 20) {
    const r = mulberry32(seed), fork = V(x + 6, y + height * 0.42, z - 4);
    rod('wood', C.bark, V(x, y, z), fork, 11, null, 7);
    const ends = [0, 1, 2].map(i => { const a = a0 + (a1 - a0) * (0.2 + 0.3 * i), lean = 0.22 + 0.08 * i; return fork.clone().add(V(Math.cos(a) * height * lean, height * (0.5 + 0.05 * i), Math.sin(a) * height * lean)); });
    for (const e of ends) rod('wood', C.bark, fork, e, 7, null, 6);
    for (let k = 0; k < n; k++) {
      const b = ends[k % 3], t = 0.3 + 0.7 * ((k * 0.37 + r() * 0.2) % 1);
      const base = fork.clone().lerp(b, t), a = a0 + (a1 - a0) * ((k * 0.618 + r() * 0.2) % 1);
      const out = V(Math.cos(a), 0.5, Math.sin(a)).normalize(), b2 = base.clone().addScaledVector(out, 18);
      stem(base, b2, 3);
      const len = (120 + 80 * r()) * (1.1 - 0.3 * t);
      leaf(2, jit(C.leafF, r), b2, V(Math.cos(a), 0.4 + r() * 0.9, Math.sin(a)), len * 0.62, len, 0.1, (r() - 0.5) * 0.9);
    }
  }
  // A pothos vine from a pot's rim, trailing out along `out` and down.
  // clear: how far it runs out over its shelf or table, nearly level, before it falls past the edge.
  function vine(start, out0, len, seed, size = 40, clear = 0) {
    const r = mulberry32(seed), out = out0.clone().setY(0).normalize();
    let p = start.clone(), run = 0;
    const steps = Math.max(2, Math.round(len / 32));
    for (let k = 0; k < steps; k++) {
      const over = run < clear, reach = over ? 30 : k < 2 ? 16 : 3;
      run += reach;
      const q = p.clone().add(V(out.x * reach + (r() - 0.5) * 10, over ? -2 - r() * 3 : -26 - r() * 10, out.z * reach + (r() - 0.5) * 10));
      stem(p, q, 1.8);
      const side = k % 2 ? 1 : -1, across = V(-out.z, 0, out.x).multiplyScalar(side);
      const dir = across.multiplyScalar(0.7).add(out.clone().multiplyScalar(0.7)).add(V(0, -0.2 - r() * 0.6, 0));
      leaf(1, jit(C.leafP, r), q, dir, size * (0.8 + r() * 0.3), size * (0.9 + r() * 0.3), 0.06, (r() - 0.5) * 1.2);
      p = q;
    }
  }
  function snake(x, y, z, h, n, seed, lean = 0.2) {
    const r = mulberry32(seed);
    for (let k = 0; k < n; k++) {
      const a = r() * 6.283, d = 4 + r() * 14;
      leaf(4, jit(C.leafS, r), V(x + Math.cos(a) * d, y, z + Math.sin(a) * d), V(Math.cos(a) * lean, 1, Math.sin(a) * lean), h * 0.17, h * (0.6 + r() * 0.4), -0.03, r() * 3);
    }
  }
  // A small pot of trailing pothos, for a shelf or a table.
  // clear: the distance from its rim to the edge it trails over (0 for a pot that hangs).
  function shelfPlant(x, y, z, out, seed, r = 38, h = 52, col = C.cream, clear = 90) {
    pot(x, y, z, r, h, col);
    const rr = mulberry32(seed);
    for (let k = 0; k < 5; k++) { const a = k * 1.3 + rr(); leaf(1, jit(C.leafP, rr), V(x + Math.cos(a) * 8, y + h * 0.85, z + Math.sin(a) * 8), V(Math.cos(a), 0.9, Math.sin(a)), 34, 38, 0.2, rr()); }
    const o = out.clone().setY(0).normalize();
    vine(V(x + o.x * r, y + h * 0.9, z + o.z * r), o, 120 + rr() * 140 + clear, seed + 1, 34, clear);
    vine(V(x + o.x * r * 0.7 + o.z * r * 0.6, y + h * 0.9, z + o.z * r * 0.7 - o.x * r * 0.6), o, 60 + rr() * 80 + clear, seed + 2, 32, clear);
  }

  // ---- small things -------------------------------------------------------------------------------------------
  const cup = (x, y, z, col = C.cream, F = null, r = 24, h = 38, coffee = true) => {
    lathe('satin', col, [[0, 0], [r * 0.68, 0], [r * 0.94, h * 0.5], [r, h], [r - 2.5, h], [r * 0.92 - 2.5, h * 0.5], [0, 5]], x, y, z, F, 20);
    ring('satin', col, 10, 2.6, at(x + r - 1, y + h * 0.55, z, 0, 0, -Math.PI / 2, F), Math.PI, 12);
    if (coffee) cy('plain', C.coffee, x, y + h - 7, z, r - 3, 1, F, r - 3, 18);
  };
  const saucer = (x, y, z, col = C.cream, F = null) => lathe('satin', col, [[0, 0], [26, 0], [40, 6], [38, 7], [0, 3]], x, y, z, F, 24);
  const latte = (x, y, z, F = null, col = C.cream) => { saucer(x, y, z, col, F); cup(x, y + 4, z, col, F); cy('plain', C.milk, x, y + 36, z, 15, 1.5, F, 9, 16); };
  const tumbler = (x, y, z, h = 60, fill = null, F = null) => {
    lathe('glass', C.clear, [[0, 0], [21, 0], [24, h], [22.5, h], [19.5, 4], [0, 4]], x, y, z, F, 24);
    if (fill) cy('thru', fill, x, y + 4, z, 19, h * 0.62, F, 21, 20);
  };
  const jar = (x, y, z, h, fill, F = null) => {
    cy('glass', C.clear, x, y, z, 34, h, F, 34, 24);
    cy('satin', fill, x, y + 2, z, 31, h * 0.72, F, 31, 20);
    cy('satin', C.walnut, x, y + h, z, 35, 12, F, 35, 24);
  };
  const bag = (x, y, z, w, h, d, col, label, F = null, face = 'z') => {
    bx('satin', col, x - w / 2, y, z - d / 2, x + w / 2, y + h, z + d / 2, F);
    if (face === 'z') bx('plain', label, x - w / 2 + 8, y + h * 0.3, z + d / 2, x + w / 2 - 8, y + h * 0.66, z + d / 2 + 1.5, F);
    else bx('plain', label, x + w / 2, y + h * 0.3, z - d / 2 + 8, x + w / 2 + 1.5, y + h * 0.66, z + d / 2 - 8, F);
  };
  function kettle(x, y, z, col = C.ink, F = null, turn = 0) {
    const K = at(x, y, z, turn, 0, 0, F);
    lathe('satin', col, [[0, 0], [44, 0], [46, 50], [36, 78], [12, 84], [8, 92], [0, 94]], 0, 0, 0, K, 24);
    rod('satin', col, V(30, 16, 0), V(72, 92, 0), 4, K);
    rod('satin', col, V(72, 92, 0), V(96, 84, 0), 3.4, K);
    ring('satin', col, 32, 5, at(-40, 52, 0, 0, 0, Math.PI / 2, K), Math.PI, 16);
  }

  // ---- the room ----------------------------------------------------------------------------------------------
  quad('tile', C.floor, XF - XB, ZD, at((XF + XB) / 2, YF, ZD / 2, 0, -Math.PI / 2));
  quad('plaster', C.ceiling, XF - XB, ZD, at((XF + XB) / 2, YC, ZD / 2, 0, Math.PI / 2));
  quad('plaster', C.plaster, XF - XB, YC - YF, at((XF + XB) / 2, (YF + YC) / 2, ZD, Math.PI));
  // The back wall, with an arched way through to the back of the shop near the far corner (in u = -z).
  {
    const s = new THREE.Shape(), uc = -(DOOR.z0 + DOOR.z1) / 2, dr = (DOOR.z1 - DOOR.z0) / 2;
    s.moveTo(0, YF); s.lineTo(0, YC); s.lineTo(-ZD, YC); s.lineTo(-ZD, YF); s.lineTo(-DOOR.z1, YF); s.lineTo(-DOOR.z1, DOOR.spring);
    s.absarc(uc, DOOR.spring, dr, Math.PI, 0, true);
    s.lineTo(-DOOR.z0, YF); s.lineTo(0, YF);
    const g = new THREE.ShapeGeometry(s, 24);
    put('plaster', g, at(XB, 0, 0, Math.PI / 2), C.plaster);
    // its reveal: the jambs and the arch's soffit, 20 cm deep, and the dim passage beyond
    const dep = 110, n = 24, pos = [], nor = [], uvs = [], ix = [];
    for (let i = 0; i <= n; i++) {
      const a = Math.PI * (1 - i / n), y = DOOR.spring + dr * Math.sin(a), z = (DOOR.z0 + DOOR.z1) / 2 + dr * Math.cos(a);
      for (const x of [XB, XB - dep]) { pos.push(x, y, z); nor.push(0, -Math.sin(a), -Math.cos(a)); uvs.push(0, 0); }
      if (i < n) { const b = i * 2; ix.push(b, b + 2, b + 1, b + 1, b + 2, b + 3); }
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); sg.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    sg.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); sg.setIndex(ix);
    put('plaster', sg, null, C.plaster);
    quad('plaster', C.plaster, dep, DOOR.spring - YF, at(XB - dep / 2, (DOOR.spring + YF) / 2, DOOR.z0, 0));
    quad('plaster', C.plaster, dep, DOOR.spring - YF, at(XB - dep / 2, (DOOR.spring + YF) / 2, DOOR.z1, Math.PI));
    // the passage beyond: a dim floor, its far wall, its ceiling and its end
    const px0 = XB - 520, pz0 = DOOR.z0 - 60, pz1 = ZD + 400;
    quad('plain', C.dark, pz1 - pz0, YC - YF, at(px0, (YF + YC) / 2, (pz0 + pz1) / 2, Math.PI / 2));
    quad('plain', [0.06, 0.055, 0.05], XB - dep - px0, pz1 - pz0, at((XB - dep + px0) / 2, YF, (pz0 + pz1) / 2, 0, -Math.PI / 2));
    quad('plain', C.dark, XB - dep - px0, pz1 - pz0, at((XB - dep + px0) / 2, DOOR.spring + dr + 40, (pz0 + pz1) / 2, 0, Math.PI / 2));
    quad('plain', C.dark, XB - dep - px0, YC - YF, at((XB - dep + px0) / 2, (YF + YC) / 2, pz0));
    quad('plain', C.dark, XB - dep - px0, YC - YF, at((XB - dep + px0) / 2, (YF + YC) / 2, pz1, Math.PI));
    quad('plain', C.dark, pz1 - pz0, YC - YF, at(XB - dep, (YF + YC) / 2, (pz0 + pz1) / 2, -Math.PI / 2));
    // a cotton curtain in it, parted, its folds drawn in
    for (const [z0, z1] of [[DOOR.z0 + 4, DOOR.z0 + 170], [DOOR.z0 + 196, DOOR.z1 - 4]]) {
      const cg = new THREE.PlaneGeometry(z1 - z0, DOOR.spring - YF - 70, 28, 1), cp = cg.attributes.position;
      for (let i = 0; i < cp.count; i++) cp.setZ(i, 9 * Math.sin(cp.getX(i) / 11));
      cg.computeVertexNormals();
      put('thru', cg, at(XB - 40, (DOOR.spring + YF + 70) / 2, (z0 + z1) / 2, Math.PI / 2), [0.72, 0.64, 0.52]);
    }
    rod('chrome', C.brass, V(XB - 40, DOOR.spring + 6, DOOR.z0), V(XB - 40, DOOR.spring + 6, DOOR.z1), 5);
  }
  // the street front, around the shopfront's opening
  const t = R.wall;
  bx('plaster', C.plaster, XF, YF, 0, XF + t, YC, SF.z0);
  bx('plaster', C.plaster, XF, YF, SF.z1, XF + t, YC, ZD);
  bx('plaster', C.plaster, XF, YF, SF.z0, XF + t, SF.y0, SF.z1);
  bx('plaster', C.plaster, XF, SF.y1, SF.z0, XF + t, YC, SF.z1);
  // the steel grid: the shopfront's frame, the bars around the clear window, and the window's own transom
  // and glazing bars, as the sun sees them
  const bar = (z0, y0, z1, y1) => bx('satin', C.steel, XF - 4, y0, z0, XF + 14, y1, z1);
  const Fw = W.frame;
  for (const z of [SF.z0, W.z0, W.z1 - Fw, SF.z1 - Fw]) bar(z, SF.y0, z + Fw, SF.y1);
  for (const z of SF.sideBars) bar(z - W.bar / 2, SF.y0, z + W.bar / 2, SF.y1);
  for (const y of [SF.y0, W.y0, W.y1 - Fw, SF.y1 - Fw]) bar(SF.z0, y, SF.z1, y + Fw);
  const ty = W.y0 + (W.y1 - W.y0) * W.transom, zs = [W.z0 + Fw + (W.z1 - W.z0 - 2 * Fw) / 3, W.z0 + Fw + 2 * (W.z1 - W.z0 - 2 * Fw) / 3];
  bar(W.z0, ty - W.transomBar / 2, W.z1, ty + W.transomBar / 2);
  for (const z of zs) bar(z - W.bar / 2, W.y0, z + W.bar / 2, W.y1);
  // the street beyond the glass
  const leafSun = sun?.uniforms.uLeaf0.value || null;
  const street = keep(new THREE.ShaderMaterial({
    uniforms: { uLeafSun: { value: leafSun }, uSunU: sun ? sun.uniforms.uSunU : { value: V(1, 0, 0) }, uSunV: sun ? sun.uniforms.uSunV : { value: V(0, 1, 0) },
      uMask: sun ? sun.uniforms.uMask : { value: new THREE.Vector4() }, uHasLeaves: { value: leafSun ? 1 : 0 } },
    vertexShader: VERT, fragmentShader: STREET_FRAG, toneMapped: false,
  }));
  special(new THREE.PlaneGeometry(SF.z1 - SF.z0 + 200, SF.y1 - SF.y0 + 200), street, at(XF + 60, (SF.y0 + SF.y1) / 2, (SF.z0 + SF.z1) / 2, -Math.PI / 2));
  // the reeded panes around the clear window
  const reeded = keep(new THREE.ShaderMaterial({ uniforms: { ...street.uniforms, uLeafSun: { value: sun?.uniforms.uLeaf2.value || null } },
    vertexShader: VERT, fragmentShader: REEDED_FRAG, toneMapped: false }));
  const pane = (z0, y0, z1, y1) => special(new THREE.PlaneGeometry(z1 - z0, y1 - y0), reeded, at(XF + 6, (y0 + y1) / 2, (z0 + z1) / 2, -Math.PI / 2));
  pane(SF.z0, SF.y0, W.z0, SF.y1); pane(W.z1, SF.y0, SF.z1, SF.y1);
  pane(W.z0, SF.y0, W.z1, W.y0); pane(W.z0, W.y1, W.z1, SF.y1);

  // The record wall: v1's studio light carried out to the room's corners (a coarse bake of the same light,
  // behind v1's own wall plane), a low cabinet of records in the corner by the window with a plant on it,
  // a plaster pilaster beyond the display, and the café's own wall past it.
  const ext = createWall(renderer, lightUniforms);
  const region = [XB, YF, XF, YC];
  ext.resize(XB, YF, XF, YC, 360, 190);
  ext.mesh.position.z = -1;
  ext.mesh.updateMatrixWorld();
  ext.mesh.renderOrder = -2;
  group.add(ext.mesh);
  const spines = keep(new THREE.ShaderMaterial({
    uniforms: { ...L, uWallBake: ext.mesh.material.uniforms.uBake, uWallRegion: { value: new THREE.Vector4(...region) }, uOak: { value: new THREE.Color(...C.oak) } },
    vertexShader: VERT, fragmentShader: SPINES_FRAG, toneMapped: false,
  }));
  const NX = SH.niche.x, SD = SH.depth, cabTop = 300;
  special(new THREE.PlaneGeometry(XF - NX, cabTop - YF), spines, at((NX + XF) / 2, (YF + cabTop) / 2, SD));
  quad('wood', C.oak, SD, cabTop - YF, at(NX, (YF + cabTop) / 2, SD / 2, -Math.PI / 2));
  bx('wood', C.oak, NX, cabTop, 0, XF, cabTop + 16, SD + 10);
  pot(1060, cabTop + 16, 112, 70, 130, C.terra);
  monstera(1060, cabTop + 130, 112, 180, 12, 11, Math.PI / 2 - 0.2, Math.PI + 0.3);
  for (const [x, c] of [[1166, [0.85, 0.82, 0.75]], [1186, [0.16, 0.16, 0.18]]]) bx('satin', c, x - 6, cabTop + 16, 30, x + 6, cabTop + 196, 200);   // two sleeves standing
  bx('plaster', C.plaster, -NX - 110, YF, 0, -NX, YC, 70);
  quad('plaster', C.plaster, -NX - 110 - XB, YC - YF, at((XB - NX - 110) / 2, (YF + YC) / 2, 0.5));
  // track lights on the ceiling, aimed at the record wall (what lights it so)
  bx('plain', C.slate, -1700, YC - 26, 380, 900, YC - 14, 400);
  for (const x of [-1300, -500, 300]) cy('plain', C.slate, 0, -50, 0, 26, 100, at(x, YC - 70, 390, 0, 0.5), 30, 20);

  // ---- the bar ------------------------------------------------------------------------------------------------
  // The back counter: teak cupboards under a marble top, sage tiles behind it, a floating shelf above.
  bx('plain', C.ink, BK.x0, YF, BK.z0, BK.x1 - 20, YF + 60, BK.z1);
  bx('flute', C.teak, BK.x0, YF + 60, BK.z0, BK.x1 - 10, BK.top - 20, BK.z1);
  bx('marble', C.marble, BK.x0, BK.top - 20, BK.z0, BK.x1 + 6, BK.top, BK.z1 + 6);
  quad('glazed', C.sage, BK.z1, 400, at(XB + 1, BK.top + 200, BK.z1 / 2, Math.PI / 2));
  bx('wood', C.oak, XB, BK.top + 400, 20, XB + 190, BK.top + 420, BK.z1);
  // on the shelf: cups and glasses for service, jars of beans, a teapot, small plants
  {
    const y = BK.top + 420, x = XB + 95, r = mulberry32(31);
    let z = 70;
    const kinds = ['cups', 'glasses', 'jars', 'plant', 'cups', 'teapot', 'glasses', 'jars', 'cups', 'plant', 'bags', 'cups'];
    for (const k of kinds) {
      if (z > BK.z1 - 80) break;
      if (k === 'cups') { for (let i = 0; i < 3; i++) for (let j = 0; j < 3 - i; j++) cy('satin', i ? C.cream : C.clay, x, y + i * 34, z + j * 54 + i * 27, 24, 32, null, 21, 18); z += 190; }
      else if (k === 'glasses') { for (let j = 0; j < 4; j++) tumbler(x, y, z + j * 52, 64); z += 230; }
      else if (k === 'jars') { for (let j = 0; j < 3; j++) jar(x, y, z + j * 78, 90 + 30 * r(), j % 2 ? C.beans : [0.85, 0.75, 0.55]); z += 250; }
      else if (k === 'plant') { shelfPlant(x, y, z + 30, V(1, 0, 0.15), 40 + z, 36, 48); z += 150; }
      else if (k === 'teapot') { el('satin', C.clay, x, y + 46, z + 30, 50, 46, 50); rod('satin', C.clay, V(x, y + 46, z + 70), V(x + 6, y + 80, z + 110), 7); ring('satin', C.clay, 24, 5, at(x, y + 56, z - 18, Math.PI / 2, 0, -Math.PI / 2), Math.PI, 12); z += 150; }
      else if (k === 'bags') { for (let j = 0; j < 3; j++) bag(x, y, z + j * 82, 50, 150 - j * 12, 74, BAGS[j + 1], LABELS[j], null, 'x'); z += 260; }
    }
  }
  // the menu board, and shelves either side above, with plants trailing and coffee to sell
  bx('plain', C.slate, XB + 1, 600, 800, XB + 14, 1240, 1800);
  const menuTex = keep(canvasTexture(1400, 900, drawMenu));
  const menuMat = keep(new THREE.ShaderMaterial({ uniforms: { uMap: { value: menuTex }, uGain: { value: 0.92 } }, vertexShader: VERT, fragmentShader: TEX_FRAG, toneMapped: false }));
  special(new THREE.PlaneGeometry(990, 636), menuMat, at(XB + 16, 920, 1300, Math.PI / 2));
  bx('wood', C.oak, XB + 1, 584, 784, XB + 18, 1256, 800); bx('wood', C.oak, XB + 1, 584, 1800, XB + 18, 1256, 1816);
  for (const [z0, z1] of [[80, 700], [1900, 2360]]) {
    for (const y of [700, 960]) bx('wood', C.oak, XB, y, z0, XB + 170, y + 20, z1);
    const r = mulberry32(z0 + 9);
    shelfPlant(XB + 85, 720, z0 + 90, V(1, 0, 0.1), z0 + 1, 40, 56, C.terra);
    for (let j = 0; j < 4; j++) bag(XB + 85, 720, z0 + 210 + j * 82, 56, 140 + 20 * r(), 70, BAGS[(j + z0) % BAGS.length], LABELS[j % LABELS.length], null, 'x');
    shelfPlant(XB + 85, 980, z1 - 110, V(1, 0, -0.1), z0 + 2, 44, 60, C.cream);
    for (let j = 0; j < 3; j++) cy('satin', j % 2 ? C.sage : C.cream, XB + 85, 980, z0 + 80 + j * 80, 30, 70 + j * 20, null, 26, 20);
  }
  // On the back counter, from the record wall: the sink, the brew bar (two pour-overs on scales), a batch
  // brewer, the Thai tea (an urn and its cloth filter), a blender, the syrups, takeaway cups.
  {
    const y = BK.top, x = (BK.x0 + BK.x1) / 2;
    rod('chrome', C.chrome, V(XB + 60, y, 360), V(XB + 60, y + 150, 360), 7); rod('chrome', C.chrome, V(XB + 60, y + 150, 360), V(XB + 150, y + 120, 360), 6);
    bx('plain', C.ink, x - 70, y, 150, x + 90, y + 10, 300);
    for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) cy('satin', C.cream, x - 30 + i * 70, y + 10, 180 + j * 50, 22, 30, null, 26, 16);
    // the pour-over stand
    bx('wood', C.walnut, x - 70, y, 600, x + 70, y + 14, 1000);
    for (const z of [610, 990]) bx('wood', C.walnut, x - 10, y + 14, z - 8, x + 10, y + 190, z + 8);
    bx('wood', C.walnut, x - 56, y + 190, 600, x + 56, y + 204, 1000);
    for (const z of [700, 880]) {
      bx('plain', C.ink, x - 44, y + 14, z - 44, x + 44, y + 26, z + 44);
      lathe('glass', C.clear, [[0, 0], [40, 0], [44, 56], [34, 92], [28, 98], [0, 98]], x, y + 26, z);
      cy('plain', C.coffee, x, y + 28, z, 38, 34, null, 42, 20);
      lathe('satin', C.cream, [[0, 0], [16, 0], [56, 66], [60, 72], [56, 72], [14, 6], [0, 6]], x, y + 196, z);
    }
    kettle(x + 70, y, 1045, C.ink, null, 0);
    // the batch brewer: its tower at the back, the brew basket over its carafe on the hot plate in front
    bx('satin', C.stainless, x - 150, y, 1110, x - 30, y + 400, 1290);
    bx('satin', C.stainless, x - 30, y + 250, 1120, x + 100, y + 330, 1280);
    bx('plain', C.ink, x - 20, y + 236, 1150, x + 70, y + 250, 1250);
    bx('satin', C.stainless, x - 30, y, 1120, x + 100, y + 14, 1280);
    bx('emit', [0.25, 0.5, 0.42], x + 100, y + 296, 1180, x + 102, y + 316, 1220);
    lathe('glass', C.clear, [[0, 0], [54, 0], [58, 64], [36, 110], [32, 120], [0, 120]], x + 34, y + 14, 1200);
    cy('plain', C.coffee, x + 34, y + 16, 1200, 52, 54, null, 56, 20);
    // Thai tea: the urn, the cloth filter on its stand over a pot, a stack of glasses
    cy('satin', C.stainless, x - 20, y, 1420, 74, 250, null, 70, 28);
    cy('satin', C.ink, x - 20, y + 250, 1420, 50, 30, null, 30, 20);
    rod('chrome', C.chrome, V(x + 60, y, 1580), V(x + 60, y + 260, 1580), 4);
    ring('chrome', C.chrome, 44, 3, at(x + 20, y + 260, 1580, 0, Math.PI / 2));
    rod('chrome', C.chrome, V(x + 60, y + 260, 1580), V(x + 64, y + 260, 1580), 4);
    lathe('thru', [0.78, 0.56, 0.36], [[2, 0], [10, 0], [40, 110], [44, 116], [0, 116]], x + 20, y + 150, 1580);
    cy('satin', C.stainless, x + 20, y, 1580, 54, 90, null, 52, 24);
    // the blender, the syrups, takeaway cups
    bx('satin', C.ink, x - 45, y, 1700, x + 45, y + 110, 1790);
    lathe('glass', C.clear, [[0, 0], [40, 0], [52, 150], [50, 160], [0, 160]], x, y + 110, 1745);
    const syrups = [[0.5, 0.16, 0.06], [0.75, 0.45, 0.12], [0.2, 0.32, 0.12], [0.62, 0.1, 0.12], [0.85, 0.7, 0.45]];
    syrups.forEach((c, j) => { lathe('satin', c, [[0, 0], [20, 0], [20, 120], [9, 140], [8, 170], [0, 170]], x + 60, y, 1840 + j * 44, null, 16); cy('plain', C.ink, x + 60, y + 170, 1840 + j * 44, 9, 10, null, 9, 10); });
    for (let j = 0; j < 2; j++) cy('satin', [0.92, 0.9, 0.84], x - 60, y, 1880 + j * 70, 22, 150, null, 27, 18);
  }
  // The drinks fridge at the end of the back counter: lit inside, bottles on its shelves, a glass door.
  {
    const { x0, x1, z0, z1, top } = FR, tk = 16;
    bx('satin', C.ink, x0, YF, z0, x1, YF + 90, z1);
    bx('satin', C.ink, x0, top - 70, z0, x1, top, z1);
    bx('satin', C.ink, x0, YF + 90, z0, x1, top - 70, z0 + tk);
    bx('satin', C.ink, x0, YF + 90, z1 - tk, x1, top - 70, z1);
    quad('emit', [0.96, 1.0, 1.04], z1 - z0 - 2 * tk, top - 70 - YF - 90, at(x0 + 4, (top - 70 + YF + 90) / 2, (z0 + z1) / 2, Math.PI / 2));
    const bottles = [[0.3, 0.14, 0.05], [0.95, 0.42, 0.1], [0.92, 0.9, 0.85], [0.25, 0.4, 0.15], [0.62, 0.32, 0.1]];
    for (let s = 0; s < 4; s++) {
      const y = YF + 100 + s * 245;
      bx('plain', [0.25, 0.26, 0.27], x0 + 4, y, z0 + tk, x1 - 24, y + 4, z1 - tk);
      for (let j = 0; j < 6; j++) {
        const c = bottles[(s * 2 + j) % bottles.length], z = z0 + 44 + j * 38;
        lathe('satin', c, [[0, 0], [15, 0], [15, 110], [7, 140], [7, 160], [0, 160]], x1 - 120, y + 4, z, null, 14);
        lathe('satin', bottles[(s + j + 2) % 5], [[0, 0], [15, 0], [15, 110], [7, 140], [7, 160], [0, 160]], x1 - 70, y + 4, z + 18, null, 14);
      }
    }
    quad('glass', C.clear, z1 - z0 - 2 * tk, top - 70 - YF - 90, at(x1 - 6, (top - 70 + YF + 90) / 2, (z0 + z1) / 2, Math.PI / 2));
    bx('chrome', C.chrome, x1 - 4, YF + 200, z1 - 40, x1 + 14, top - 200, z1 - 30);
    bx('emit', [0.95, 0.92, 0.85], x1 - 1, top - 50, z0 + 30, x1 + 1, top - 20, z1 - 30);
  }
  // The island: fluted oak to the customers, a marble top, a black kick; open at both ends.
  bx('plain', C.ink, ISL.x0 + 20, YF, ISL.z0 + 20, ISL.x1 - 20, YF + 50, ISL.z1 - 20);
  bx('flute', C.oak, ISL.x0 + 10, YF + 50, ISL.z0 + 10, ISL.x1 - 10, ISL.top - 20, ISL.z1 - 10);
  bx('marble', C.marble, ISL.x0 - 6, ISL.top - 20, ISL.z0, ISL.x1 + 12, ISL.top, ISL.z1);
  // the espresso machine, its back to the customers, the barista facing them from behind it
  {
    const x0 = -1480, x1 = -1215, z0 = 1310, z1 = 1710, y = ISL.top;
    bx('chrome', C.chrome, x0 - 10, y, z0 - 10, x1 + 10, y + 18, z1 + 10);
    bx('satin', C.mint, x0, y + 18, z0, x1, y + 240, z1);
    bx('chrome', C.chrome, x0 - 4, y + 240, z0 - 4, x1 + 4, y + 250, z1 + 4);
    for (const z of [z0 - 2, z1 + 2]) bx('chrome', C.chrome, x0, y + 250, z - 3, x1, y + 272, z + 3);
    for (const yy of [90, 200]) bx('satin', C.chrome, x1, y + yy, z0 + 16, x1 + 3, y + yy + 10, z1 - 16);
    bx('satin', [0.25, 0.4, 0.33], x1, y + 30, (z0 + z1) / 2 - 2, x1 + 2, y + 236, (z0 + z1) / 2 + 2);
    for (let i = 0; i < 2; i++) for (let j = 0; j < 5; j++) cy('satin', j % 3 === 1 ? C.clay : C.cream, x0 + 70 + i * 120, y + 250, z0 + 50 + j * ((z1 - z0 - 100) / 4), 26, 34, null, 21, 18);
    for (const z of [z0 + (z1 - z0) * 0.32, z0 + (z1 - z0) * 0.68]) {
      bx('chrome', C.chrome, x0 - 50, y + 120, z - 46, x0, y + 196, z + 46);
      cy('chrome', C.chrome, x0 - 30, y + 92, z, 34, 28);
      cy('chrome', C.chrome, x0 - 30, y + 70, z, 32, 22);
      bx('plain', C.ink, x0 - 150, y + 74, z - 10, x0 - 50, y + 90, z + 10);
      cy('satin', C.cream, x0 - 30, y + 18, z, 26, 36, null, 24, 18);
      cy('satin', C.cream, 0, -2, 0, 18, 4, at(x0 - 1, y + 206, z, 0, 0, Math.PI / 2), 18, 20);
    }
    bx('chrome', C.chrome, x0 - 80, y, z0 + 30, x0, y + 16, z1 - 30);
    for (const z of [z0 + 25, z1 - 25]) rod('chrome', C.chrome, V(x0 - 10, y + 200, z), V(x0 - 70, y + 40, z), 5);
    // milk jugs and a knock box beside it
    for (const [dx, dz] of [[0, 0], [-6, 44]]) lathe('chrome', C.stainless, [[0, 0], [30, 0], [30, 50], [24, 66], [27, 72], [0, 70]], -1525 + dx, y, 1730 + dz, null, 20);
    bx('satin', C.ink, -1470, y, 1215, -1395, y + 70, 1285);
  }
  // two grinders (their hoppers full of beans), the pick-up end with drinks waiting and a bud vase
  {
    const y = ISL.top;
    for (const [z, c] of [[1150, C.ink], [1010, [0.86, 0.84, 0.8]]]) {
      const x = -1420;
      bx('satin', c, x - 55, y, z - 50, x + 55, y + 210, z + 50);
      bx('satin', c, x - 88, y + 70, z - 22, x - 55, y + 120, z + 22);
      cy('chrome', C.chrome, x, y + 210, z, 50, 26, null, 46);
      cy('satin', C.beans, x, y + 236, z, 32, 78, null, 52);
      cy('glass', C.clear, x, y + 236, z, 36, 120, null, 64);
      cy('satin', C.ink, x, y + 356, z, 64, 10);
    }
    latte(-1250, y, 815); latte(-1250, y, 905);
    tumbler(-1325, y, 860, 80, [0.62, 0.42, 0.26]);
    lathe('satin', C.cream, [[0, 0], [22, 0], [26, 30], [12, 70], [10, 92], [13, 96], [0, 96]], -1230, y, 1050, null, 20);
    const r = mulberry32(77);
    for (let k = 0; k < 3; k++) {
      const top = V(-1230 + (r() - 0.5) * 40, y + 170 + r() * 50, 1050 + (r() - 0.5) * 50);
      stem(V(-1230, y + 90, 1050), top, 1.6);
      leaf(7, [0.95, 0.62, 0.66], top.clone().add(V(0, -18, 0)), V(0.6, 0.5, r() - 0.5), 40, 40, 0, 0);
      leaf(1, jit(C.leafP, r), V(-1230, y + 120 + k * 16, 1050), V(r() - 0.5, 0.4, r() - 0.5), 22, 26, 0.1, 0);
    }
  }
  // the pastry case: croissants below, a cake and cookies above, under glass on an oak base
  {
    const x0 = -1470, x1 = -1192, z0 = 1800, z1 = 2090, y = ISL.top, h = 210;
    bx('wood', C.oak, x0, y, z0, x1, y + 16, z1);
    quad('glass', C.clear, z1 - z0, h, at(x1, y + 16 + h / 2, (z0 + z1) / 2, Math.PI / 2));
    quad('glass', C.clear, x1 - x0, h, at((x0 + x1) / 2, y + 16 + h / 2, z0, Math.PI));
    quad('glass', C.clear, x1 - x0, h, at((x0 + x1) / 2, y + 16 + h / 2, z1));
    quad('glass', C.clear, x1 - x0, z1 - z0, at((x0 + x1) / 2, y + 16 + h, (z0 + z1) / 2, 0, -Math.PI / 2));
    quad('glass', C.clear, x1 - x0, z1 - z0, at((x0 + x1) / 2, y + 16 + h * 0.5, (z0 + z1) / 2, 0, -Math.PI / 2));
    for (const [xx, zz] of [[x1, z0], [x1, z1], [x0, z0], [x0, z1]]) bx('chrome', C.brass, xx - 3, y + 16, zz - 3, xx + 3, y + 16 + h, zz + 3);
    for (let k = 0; k < 4; k++) ring('satin', C.crust, 26, 14, at(x0 + 90 + (k % 2) * 90, y + 30, z0 + 60 + k * 58, k * 0.7, -Math.PI / 2), Math.PI * 1.25, 14);
    cy('satin', [0.94, 0.86, 0.72], x0 + 110, y + 16 + h * 0.5, (z0 + z1) / 2 - 40, 62, 52, null, 62, 32);
    cy('satin', [0.62, 0.32, 0.2], x0 + 110, y + 16 + h * 0.5 + 52, (z0 + z1) / 2 - 40, 62, 6, null, 62, 32);
    for (let k = 0; k < 5; k++) cy('satin', [0.7, 0.5, 0.3], x0 + 210, y + 16 + h * 0.5 + k * 8, z0 + 100 + (k % 2) * 6, 26, 7, null, 26, 18);
  }
  // the till: a tablet on a stand turned to the customers, a card reader, a tip jar
  {
    const y = ISL.top, x = -1262, z = 2200;
    cy('chrome', C.ink, x, y, z, 30, 6); cy('chrome', C.ink, x, y + 6, z, 8, 70);
    const T = at(x + 8, y + 112, z, 0, 0, 0.55);
    bx('satin', C.ink, -5, -56, -78, 5, 56, 78, T);
    quad('emit', C.screen, 146, 102, at(5.5, 0, 0, Math.PI / 2, 0, 0, T));
    bx('satin', C.ink, -1250, y, 2105, -1200, y + 14, 2150);
    tumbler(-1215, y, 2270, 74);
  }
  // pendants over the island, enamel domes with their bulbs
  for (const p of lamps) {
    rod('plain', C.ink, V(p.x, p.y + 80, p.z), V(p.x, YC, p.z), 2.5);
    lathe('satin', C.enamel, [[100, 0], [96, 24], [72, 64], [30, 86], [12, 94], [0, 96]], p.x, p.y - 10, p.z, null, 32);
    lathe('emit', [0.95, 0.82, 0.62], [[0, 92], [12, 90], [30, 82], [72, 60], [94, 22], [98, 0]], p.x, p.y - 10, p.z, null, 32);
    el('emit', C.glow, p.x, p.y + 14, p.z, 26, 30, 26);
  }
  // Shelving along the record wall at the bar's end: stock on the barista's side, coffee to sell on the
  // customers', a plant on top.
  {
    const { x0, x1, d, top } = SHV, ups = [0, 1, 2, 3].map(i => x0 + (x1 - x0) * i / 3);
    for (const x of ups) for (const z of [14, d - 14]) bx('satin', C.steel, x - 7, YF, z - 7, x + 7, top, z + 7);
    const levels = [-560, -300, -40, 220, 480, top - 22];
    for (const y of levels) bx('wood', C.oak, x0 - 12, y, 0, x1 + 12, y + 22, d);
    const r = mulberry32(53);
    for (let l = 0; l < levels.length - 1; l++) {
      const y = levels[l] + 22;
      for (let b = 0; b < 3; b++) {
        const bx0 = ups[b] + 24, bx1 = ups[b + 1] - 24, z = d / 2 + 10;
        const kind = b === 0 ? ['stock', 'cups', 'stock', 'jars', 'stock'][l] : ['bags', 'mugs', 'bags', 'bags', 'kettles'][(l + b) % 5];
        if (kind === 'stock') { for (let x = bx0; x < bx1 - 90; x += 104) bx('plain', l % 2 ? [0.62, 0.5, 0.36] : [0.92, 0.9, 0.86], x, y, z - 80, x + 92, y + 120 + 40 * r(), z + 70); }
        else if (kind === 'cups') { for (let x = bx0 + 30; x < bx1 - 20; x += 62) cy('satin', [0.92, 0.9, 0.84], x, y, z, 24, 170, null, 28, 16); }
        else if (kind === 'jars') { for (let x = bx0 + 40; x < bx1 - 30; x += 84) jar(x, y, z, 110 + 40 * r(), r() < 0.5 ? C.beans : [0.85, 0.75, 0.55]); }
        else if (kind === 'bags') { for (let x = bx0 + 34; x < bx1 - 30; x += 74) bag(x, y, z + 20, 60, 130 + 40 * r(), 60, BAGS[(r() * BAGS.length) | 0], LABELS[(r() * LABELS.length) | 0]); }
        else if (kind === 'mugs') { let m = l; for (let x = bx0 + 34; x < bx1 - 30; x += 70) cup(x, y, z + 40, [C.cream, C.sage, C.clay, C.terra][m++ % 4], null, 28, 52, false); }
        else if (kind === 'kettles') { kettle(bx0 + 70, y, z + 10, C.stainless); kettle(bx1 - 90, y, z + 10, [0.9, 0.88, 0.82]); }
      }
    }
    shelfPlant(x0 + 140, top, d / 2, V(0, 0, 1), 61, 44, 60, C.terra);
    shelfPlant(x1 - 160, top, d / 2, V(0.2, 0, 1), 62, 40, 56, C.cream);
    bag(-1500, top, d / 2, 60, 160, 64, BAGS[2], LABELS[1]); bag(-1420, top, d / 2, 60, 150, 64, BAGS[4], LABELS[0]);
  }
  // a fiddle-leaf fig by the pilaster, on the customers' side
  pot(-1000, YF, 430, 105, 230, C.cream);
  fig(-1000, YF + 200, 430, 860, 91, 0.3 * Math.PI, 1.65 * Math.PI, 34);

  // ---- the customers' side: Neil's table by the window -------------------------------------------------
  // the window seat: a deep oak sill on a fluted base, a long cushion and two pillows against the glass
  bx('flute', C.oak, XF - 140, YF, 240, XF, SF.y0 - 22, 1190);
  bx('wood', C.oak, XF - 150, SF.y0 - 22, 230, XF + 4, SF.y0, 1200);
  bx('fabric', C.oat, XF - 140, SF.y0, 250, XF - 6, SF.y0 + 34, 1180);
  pillow('fabric', C.rust, 150, 140, 46, at(XF - 40, SF.y0 + 104, 340, -Math.PI / 2, -0.22, 0));
  pillow('fabric', C.olive, 136, 128, 42, at(XF - 42, SF.y0 + 98, 1085, -Math.PI / 2 + 0.2, -0.26, 0));
  bx('wood', C.walnut, XF - 120, SF.y0 + 34, 610, XF - 20, SF.y0 + 42, 760);
  latte(XF - 70, SF.y0 + 42, 680, null, C.sage);
  pot(XF - 60, SF.y0 + 34, 1162, 38, 70, C.cream);
  snake(XF - 60, SF.y0 + 92, 1162, 230, 7, 17, 0.08);
  // the table: solid oak, 1.6 m by 0.8 m, on square legs
  {
    const { x0, x1, z0, z1, top } = TB;
    bx('wood', C.oak, x0, top - 32, z0, x1, top, z1);
    bx('wood', C.oak, x0 + 36, top - 86, z0 + 36, x1 - 36, top - 32, z1 - 36);
    for (const x of [x0 + 34, x1 - 34]) for (const z of [z0 + 34, z1 - 34]) bx('wood', C.oak, x - 22, YF, z - 22, x + 22, top - 32, z + 22);
  }
  // bentwood chairs with caned seats: Neil's pulled out, facing the window; another pushed in
  function chair(x, z, yaw) {
    const F = at(x, YF, z, yaw), sy = 254, wd = C.bentwood;
    cy('cane', C.cane, 0, sy - 14, 0, 106, 14, F, 106, 28);
    ring('wood', wd, 106, 7, at(0, sy - 10, 0, 0, Math.PI / 2, 0, F), Math.PI * 2, 40);
    for (const [a, b] of [[[60, sy - 18, 60], [80, 0, 82]], [[60, sy - 18, -60], [80, 0, -82]], [[-64, sy - 18, 60], [-90, 0, 84]], [[-64, sy - 18, -60], [-90, 0, -84]]]) rod('wood', wd, V(...a), V(...b), 9, F);
    ring('wood', wd, 74, 5, at(-4, 116, 0, 0, Math.PI / 2, 0, F), Math.PI * 2, 32);
    for (const s of [-1, 1]) rod('wood', wd, V(-70, sy - 8, s * 70), V(-98, sy + 230, s * 68), 8, F);
    ring('wood', wd, 68, 8, at(-98, sy + 230, 0, Math.PI / 2, 0, 0, F), Math.PI, 24);
    ring('wood', wd, 46, 5, at(-90, sy + 196, 0, Math.PI / 2, 0, 0, F), Math.PI, 20);
  }
  chair(560, 1700, -0.18);   // Neil's, pulled out before the laptop
  chair(630, 1430, 0.06);    // the other place, pushed in, clear of the screen from the Table view
  // On the table, as Neil left it: the laptop open toward his chair, the Thai tea, a notebook and pen, his
  // phone, an espresso by the other place, a carafe of water, a small plant by the window.
  const screenTex = keep(canvasTexture(900, 576, drawScreen));
  const screenMat = keep(new THREE.ShaderMaterial({ uniforms: { uMap: { value: screenTex }, uGain: { value: 1.0 } }, vertexShader: VERT, fragmentShader: TEX_FRAG, toneMapped: false }));
  {
    const y = TB.top, LP = at(860, y, 1640, 0.22);
    bx('satin', [0.64, 0.65, 0.67], -62, 0, -88, 62, 8, 88, LP);
    bx('plain', C.ink, -12, 8, -76, 50, 8.6, 76, LP);
    bx('satin', [0.55, 0.56, 0.58], -56, 8, -32, -20, 8.4, 32, LP);
    const LF = at(62, 8, 0, 0, 0, -0.26, LP);
    bx('satin', [0.64, 0.65, 0.67], -5, 0, -88, 0, 124, 88, LF);
    bx('plain', C.ink, -5.6, 2, -86, -5, 122, 86, LF);
    special(new THREE.PlaneGeometry(162, 104), screenMat, at(-5.8, 63, 0, -Math.PI / 2, 0, 0, LF));
    // the tea
    const tx = 905, tz = 1820;
    cy('wood', C.teak, tx, y, tz, 40, 4, null, 40, 24);
    cy('thru', C.tea, tx, y + 6, tz, 21, 60, null, 24, 24);
    cy('thru', C.milk, tx, y + 66, tz, 24, 9, null, 24.5, 24);
    for (const [dx, dz, dy] of [[-8, 5, 66], [9, -6, 70], [2, 10, 75]]) bx('glass', [0.9, 0.95, 1.0], tx + dx - 8, y + dy, tz + dz - 8, tx + dx + 8, y + dy + 14, tz + dz + 8);
    lathe('glass', C.clear, [[0, 0], [22, 0], [24, 4], [27, 92], [25.5, 92], [22.5, 6], [0, 6]], tx, y + 4, tz, null, 28);
    rod('satin', [0.95, 0.95, 0.92], V(tx + 6, y + 30, tz - 4), V(tx + 22, y + 136, tz - 14), 3.2);
    // the notebook and pen, the phone
    const NB = at(800, y, 1430, -0.3);
    bx('plain', [0.55, 0.42, 0.28], -42, 0, -60, 42, 7, 60, NB);
    bx('plain', C.cream, -40, 7, -58, 40, 7.5, 58, NB);
    rod('satin', C.ink, V(-30, 10, 40), V(30, 10, -20), 3, NB);
    bx('satin', C.ink, -20, 0, -42, 20, 5, 42, at(760, y, 1840, 0.5));
    // the other place: an espresso; a carafe and a glass; a plant by the window
    saucer(790, y, 2000); cup(790, y + 4, 2000, C.cream, null, 20, 30);
    lathe('glass', C.clear, [[0, 0], [40, 0], [44, 60], [30, 120], [18, 150], [20, 160], [0, 160]], 1050, y, 1300, null, 24);
    cy('glass', [0.7, 0.85, 0.9], 1050, y + 4, 1300, 38, 90, null, 34, 20);
    tumbler(990, y, 1270, 64);
    shelfPlant(1075, y, 2010, V(1, 0, 0), 71, 34, 46, C.terra, 80);
  }
  // a globe pendant over the table, and a pothos hanging by the window
  rod('plain', C.ink, V(tableLamp.x, tableLamp.y + 60, tableLamp.z), V(tableLamp.x, YC, tableLamp.z), 2.5);
  el('emit', [1.0, 0.88, 0.7], tableLamp.x, tableLamp.y, tableLamp.z, 64, 60, 64, null, 24);
  {
    const p = V(1060, 620, 1470);
    for (let k = 0; k < 3; k++) { const a = k * 2.094; rod('plain', [0.6, 0.52, 0.4], V(p.x + Math.cos(a) * 44, p.y + 60, p.z + Math.sin(a) * 44), V(p.x, YC - 200, p.z), 1.5); }
    rod('plain', [0.6, 0.52, 0.4], V(p.x, YC - 200, p.z), V(p.x, YC, p.z), 2);
    shelfPlant(p.x, p.y, p.z, V(-1, 0, 0), 81, 52, 64, C.cream, 0);
    vine(V(p.x - 20, p.y + 58, p.z + 40), V(-0.5, 0, 0.86), 280, 83, 38);
    vine(V(p.x + 10, p.y + 58, p.z - 46), V(-0.3, 0, -0.95), 220, 84, 36);
  }
  // a framed print on the street front above the table
  bx('wood', C.walnut, XF - 14, 160, 1640, XF, 580, 1980);
  bx('plain', [0.92, 0.88, 0.8], XF - 15, 182, 1662, XF - 13, 558, 1958);
  bx('plain', [0.82, 0.48, 0.22], XF - 16, 260, 1720, XF - 15, 480, 1900);
  el('plain', [0.18, 0.3, 0.42], XF - 16.5, 340, 1810, 1, 70, 70, null, 24);

  // ---- the batches, merged: one draw per material --------------------------------------------------------
  for (const [key, geos] of batches) {
    const g = keep(merge(geos));
    for (const x of geos) x.dispose();
    const m = new THREE.Mesh(g, MAT[key]);
    if (key === 'glass') m.renderOrder = 2;
    group.add(m);
  }
  batches.clear();

  // The ceiling fan, its own group so it can turn.
  const fan = new THREE.Group(); fan.position.set(-450, YC - 160, 1450); group.add(fan);
  const solo = (key, geo, col) => { put(key, geo, null, col); batches.clear(); const m = new THREE.Mesh(keep(geo), MAT[key]); fan.add(m); return m; };
  solo('plain', new THREE.CylinderGeometry(4, 4, 160, 8).translate(0, 80, 0), C.slate);
  solo('plain', new THREE.CylinderGeometry(40, 46, 40, 24), C.slate);
  for (let k = 0; k < 4; k++) solo('wood', new THREE.BoxGeometry(320, 6, 70).translate(190, -10, 0).rotateY(-k * Math.PI / 2), C.teak);

  const finish = createFinish(renderer);
  disposables.push(finish);
  const textures = [leafTex, menuTex, screenTex];
  return {
    group,
    fan,
    finish,
    // Out of sight before the first move: build every program for the room's own (linear) target and the
    // finishing quad's for the screen, upload the drawn textures, and allocate the target.
    async warm(camera) {
      group.visible = true;
      const was = renderer.getRenderTarget();
      renderer.setRenderTarget(finish.target);
      const p = renderer.compileAsync ? renderer.compileAsync(scene, camera) : (renderer.compile(scene, camera), null);
      renderer.setRenderTarget(was);
      group.visible = false;
      if (p) await p;
      for (const t of textures) renderer.initTexture(t);
      finish.compile();
      ext.bake();   // allocates the record wall extension's bake target too
    },
    // Re-light the record wall's extension when the studio bake does (sleeves moved).
    bake() { ext.bake(); },
    setVisible(v) { if (group.visible !== v) { group.visible = v; if (v) ext.bake(); } },
    dispose() { scene.remove(group); ext.dispose(); for (const d of disposables) d.dispose?.(); },
  };
}
