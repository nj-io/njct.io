import{a as vt}from"./chunk-OVY7OC3Y.js";import"./chunk-NQ7PQZ2C.js";import{c as ht}from"./chunk-4VAF4GAZ.js";import{j as p0}from"./chunk-XMR7AKKY.js";import{$ as ct,B as Re,C as et,E as Pe,G as H0,J as V0,K as ce,L as y0,M as G0,N as i0,O as tt,P as ot,Q as at,R as nt,S as O0,T as rt,U as lt,X as st,Y as F0,Z as it,aa as n0,b as le,ba as ut,c as Ve,ca as ft,d as Oe,da as mt,e as qe,f as Qe,g as Xe,j as se,ka as pt,n as j0,q as Ye,r as Ke,t as Ze,u as ie,v as Je,w as m0,y as I0,z as N0}from"./chunk-ZI4R4S5J.js";var N=p0.room,t0=p0.shelving,Y=p0.counter,O=p0.table,E=p0.window,R=p0.shopfront,dt=4,X0=14,h0={size:128,x:-500,y:120,z:1400},fe=`vec3(${N.front.toFixed(1)}, ${((E.y0+E.y1)/2).toFixed(1)}, ${((E.z0+E.z1)/2).toFixed(1)})`,me=`
uniform vec3 uWinQ[4];       // the shopfront's opening (light from the sky and the street)
uniform vec3 uPatchQ[4];     // the sunlit patch on the record wall (warm bounce)
uniform vec3 uWallQ[4];      // the lit record wall around the shelves (neutral bounce)
uniform vec3 uSkyCol, uPatchCol, uWallCol;
uniform vec4 uLampP[${dt}];   // xyz, and w: 1 for a shade that sends its light down, 0 for a globe
uniform vec3 uLampCol;
uniform float uAmbient;
uniform vec4 uOcc[${X0}];      // boxes that shade what is near them: centre xz, half size xz (y below uOccTop)
uniform float uOccTop[${X0}];
// the probe: all of it (for what surfaces reflect), and without the window's outside and the lamps (the bounce: those
// are the direct light's); uBounce: how much of the second the room's surfaces take
#define ENVMAP_TYPE_CUBE_UV
#define CUBEUV_TEXEL_WIDTH ${(1/(3*Math.max(h0.size,112))).toFixed(9)}
#define CUBEUV_TEXEL_HEIGHT ${(1/(4*h0.size)).toFixed(9)}
#define CUBEUV_MAX_MIP ${(Math.log2(4*h0.size)-2).toFixed(1)}
#include <cube_uv_reflection_fragment>
uniform sampler2D uProbe, uProbeD;
uniform float uHasProbe, uBounce;
// From p along r to the room's walls, as the probe sees that point.
vec3 njBox(vec3 p, vec3 r) {
  vec3 a = (vec3(${N.back.toFixed(1)}, ${N.floor.toFixed(1)}, 0.0) - p) / r, b = (vec3(${N.front.toFixed(1)}, ${N.ceiling.toFixed(1)}, ${N.depth.toFixed(1)}) - p) / r;
  vec3 f = max(a, b);
  return p + r * max(min(min(f.x, f.y), f.z), 0.0) - vec3(${h0.x.toFixed(1)}, ${h0.y.toFixed(1)}, ${h0.z.toFixed(1)});
}
// The light the room's own surfaces send to p (a second bounce, from where it stands), or the flat fill before the
// probe is made.
vec3 njBounce(vec3 p, vec3 n) {
  if (uHasProbe < 0.5) return vec3(uAmbient);
  return uBounce * textureCubeUV(uProbeD, njBox(p, n), 1.0).rgb + vec3(uAmbient * 0.25);
}
// What a surface of roughness ro reflects along r, from the probe (its dominant direction leaning to n as it roughens).
vec3 njEnv(vec3 p, vec3 r, vec3 n, float ro) { return textureCubeUV(uProbe, njBox(p, normalize(mix(r, n, ro * ro))), ro).rgb; }
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
  vec4 d = vec4(p.x - ${N.back.toFixed(1)}, ${N.front.toFixed(1)} - p.x, p.z, ${N.depth.toFixed(1)} - p.z);
  float dy0 = p.y - ${N.floor.toFixed(1)}, dy1 = ${N.ceiling.toFixed(1)} - p.y;
  // a corner darkens along both walls; a surface does not darken itself
  if (abs(n.y) > 0.5) { ao *= (1.0 - 0.34 * exp(-max(d.x, 0.0) / 160.0)) * (1.0 - 0.3 * exp(-max(d.y, 0.0) / 160.0)) * (1.0 - 0.34 * exp(-max(d.z, 0.0) / 160.0)) * (1.0 - 0.3 * exp(-max(d.w, 0.0) / 160.0)); }
  else {
    ao *= (1.0 - 0.3 * exp(-max(dy0, 0.0) / 150.0)) * (1.0 - 0.22 * exp(-max(dy1, 0.0) / 190.0));
    if (abs(n.x) > 0.5) ao *= (1.0 - 0.3 * exp(-max(d.z, 0.0) / 140.0)) * (1.0 - 0.26 * exp(-max(d.w, 0.0) / 140.0));
    else ao *= (1.0 - 0.3 * exp(-max(d.x, 0.0) / 140.0)) * (1.0 - 0.26 * exp(-max(d.y, 0.0) / 140.0));
  }
  if (n.y > 0.5) {                 // contact shadows fall on what faces up: the floor, a counter, a table top
    for (int i = 0; i < ${X0}; i++) {
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
  for (int i = 0; i < ${dt}; i++) {
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
         + njLamps(p, n) + njBounce(p, n);
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
`,b0=`
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
}`,Lt=`
uniform int uKind;
uniform vec3 uSpec;   // the reflection: F0, roughness, metal (1: its colour tints what it reflects, little diffuse)
varying vec3 vP;
varying vec3 vN;
varying vec3 vCol;
${me}
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
    if (uKind == 5) {
      float f = abs(fract(g.x / 26.0) - 0.5) * 2.0;
      c *= 0.74 + 0.26 * (1.0 - f * f);
      // the island's customer face, worn pale and smooth along its top by hands and bags
      if (n.x > 0.5 && p.x > ${(Y.x1-30).toFixed(1)} && p.z > ${Y.z0.toFixed(1)} && p.z < ${Y.z1.toFixed(1)}) {
        float wear = smoothstep(${(Y.top-150).toFixed(1)}, ${(Y.top-25).toFixed(1)}, p.y) * (0.55 + 0.45 * njNoise2(p.zy / vec2(90.0, 24.0)));
        c = mix(c, c * 1.18 + 0.03, wear * 0.55);
      }
    }
  } else if (uKind == 3) {
    c *= 0.95 + 0.07 * njNoise2(p.xy / 60.0 + p.zz / 60.0) + 0.03 * njNoise2(p.xy / 9.0 + p.zx / 9.0);
  } else if (uKind == 4) {
    float v = njNoise2(p.xz / 55.0 + p.yy / 55.0 + 3.0 * njNoise2(p.xz / 160.0));
    c *= 0.94 + 0.08 * smoothstep(0.45, 0.55, v) - 0.16 * smoothstep(0.495, 0.5, v) * smoothstep(0.505, 0.5, v);
    // the island's front edge: years of cups and elbows, faintly grey and rubbed
    float edge = smoothstep(${(Y.x1-40).toFixed(1)}, ${(Y.x1+12).toFixed(1)}, p.x) * step(${Y.z0.toFixed(1)}, p.z) * step(p.z, ${Y.z1.toFixed(1)}) * step(${(Y.top-30).toFixed(1)}, p.y);
    c = mix(c, c * vec3(0.9, 0.9, 0.88), edge * (0.4 + 0.6 * njNoise2(p.xz / vec2(14.0, 60.0))) * 0.6);
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
  vec3 a = albedo(vP, n), col = a * e;
  // what it reflects: the probe by Fresnel (Schlick's, held down as it roughens), dimmed where the room shades it
  if (uSpec.x > 0.0) {
    vec3 v = normalize(vP - cameraPosition), r = reflect(v, n);
    float c = clamp(-dot(n, v), 0.0, 1.0), ro = uSpec.y;
    float fr = uSpec.x + (max(1.0 - ro, uSpec.x) - uSpec.x) * pow(1.0 - c, 5.0);
    vec3 env = uHasProbe > 0.5 ? njEnv(vP, r, n, ro) : uSkyCol * 0.5 * pow(max(dot(r, normalize(${fe} - vP)), 0.0), 18.0);
    vec3 tint = mix(vec3(1.0), a / max(max(a.r, max(a.g, a.b)), 1e-3), uSpec.z);
    col = col * mix(1.0 - fr, 0.15, uSpec.z) + env * fr * tint * njAO(vP, n);
  }
  gl_FragColor = vec4(njShoulder(col), 1.0);
  #include <colorspace_fragment>
}`,Wt=`
uniform sampler2D uWallBake;
uniform vec4 uWallRegion;    // the bake's world x0, y0, x1, y1
uniform vec3 uOak;
varying vec3 vP;
varying vec3 vN;
${me}
vec3 spineCol(float h) {
  float k = fract(h * 7.13);
  vec3 c = k < 0.22 ? vec3(0.05, 0.05, 0.06) : k < 0.38 ? vec3(0.86, 0.83, 0.76) : k < 0.5 ? vec3(0.62, 0.13, 0.1)
         : k < 0.6 ? vec3(0.12, 0.2, 0.42) : k < 0.7 ? vec3(0.82, 0.52, 0.14) : k < 0.78 ? vec3(0.16, 0.34, 0.24)
         : k < 0.88 ? vec3(0.42, 0.4, 0.38) : vec3(0.58, 0.32, 0.22);
  return c * (0.75 + 0.4 * fract(h * 3.7));
}
void main() {
  const float CUB = ${t0.cubby.toFixed(1)}, FR = ${t0.frame.toFixed(1)}, DEP = ${t0.depth.toFixed(1)};
  vec3 p = vP, v = normalize(vP - cameraPosition);
  vec2 cell = floor((p.xy - vec2(${N.back.toFixed(1)}, ${N.floor.toFixed(1)})) / CUB);
  vec2 o = vec2(${N.back.toFixed(1)}, ${N.floor.toFixed(1)}) + cell * CUB;
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
}`,Nt=`
uniform sampler2D uLeafSun;
uniform vec3 uSunU, uSunV;
uniform vec4 uMask;
uniform float uHasLeaves;
varying vec3 vP;
varying vec3 vN;
void main() {
  vec3 v = normalize(vP - cameraPosition);
  float t = (${N.front.toFixed(1)} - cameraPosition.x) / v.x;
  vec3 q = cameraPosition + v * t;            // where the sight line crosses the glass
  // the far side of the soi, past the garden: hazy sky over a soft roofline of shophouses in the sun
  float el = v.y, roof = 0.06 + 0.03 * sin(vP.z / 330.0) + 0.012 * sin(vP.z / 87.0);
  vec3 sky = mix(vec3(1.1, 0.97, 0.8), vec3(0.88, 0.93, 1.02), smoothstep(roof, roof + 0.3, el));
  float bld = smoothstep(roof + 0.008, roof - 0.008, el);
  vec3 b = mix(vec3(0.95, 0.82, 0.68), vec3(0.8, 0.74, 0.68), 0.5 + 0.5 * sin(vP.z / 230.0 + 1.0));
  b *= 0.9 + 0.1 * step(0.5, fract(vP.z / 140.0)) * step(0.45, fract(vP.y / 190.0));   // windows, softly
  vec3 col = mix(sky, b, bld * 0.7) * 1.05;
  if (uHasLeaves > 0.5) {
    vec2 uv = (vec2(dot(q, uSunU), dot(q, uSunV)) - uMask.xy) / (2.0 * uMask.z) + 0.5;
    float clear = texture2D(uLeafSun, uv).r;
    col = mix(vec3(0.26, 0.36, 0.1) * 1.4, col, clear);   // leaves lit from behind: yellow-green
  }
  gl_FragColor = vec4(col * ${(.97*p0.finish.outside).toFixed(3)}, 1.0);   // outside: brighter than the room
  #include <colorspace_fragment>
}`,Vt=`
uniform sampler2D uLeafSun;
uniform vec3 uSunU, uSunV;
uniform vec4 uMask;
uniform float uHasLeaves;
varying vec3 vP;
varying vec3 vN;
void main() {
  // each reed a little lens: bright across its face, a fine darker line where two meet (low enough to survive the
  // highlights' roll-off)
  float rib = 0.5 + 0.5 * sin(vP.z / 4.2 * 3.14159), seam = pow(0.5 + 0.5 * cos(vP.z / 4.2 * 3.14159), 7.0);
  float hgt = clamp((vP.y - ${R.y0.toFixed(1)}) / ${(R.y1-R.y0).toFixed(1)}, 0.0, 1.0);
  vec3 col = mix(vec3(0.98, 0.9, 0.77), vec3(0.9, 0.92, 0.95), hgt) * (0.94 + 0.06 * rib) * (1.0 - 0.27 * seam);
  if (uHasLeaves > 0.5) {
    vec2 uv = (vec2(dot(vP, uSunU), dot(vP, uSunV)) - uMask.xy) / (2.0 * uMask.z) + 0.5;
    col *= 0.86 + 0.14 * texture2D(uLeafSun, uv).r;
  }
  gl_FragColor = vec4(col * ${p0.finish.reeded.toFixed(3)}, 1.0);
  #include <colorspace_fragment>
}`,Ot=`
uniform float uAlpha;
varying vec3 vP;
varying vec3 vN;
varying vec3 vCol;
${me}
void main() {
  vec3 n = normalize(vN), v = normalize(vP - cameraPosition);
  if (dot(n, v) > 0.0) n = -n;
  float c = clamp(-dot(n, v), 0.0, 1.0), fr = 0.04 + 0.96 * pow(1.0 - c, 5.0);
  vec3 r = reflect(v, n);
  float spec = pow(max(dot(r, normalize(${fe} - vP)), 0.0), 40.0);
  vec3 env = mix(vec3(0.3, 0.27, 0.23), uSkyCol * 0.45, smoothstep(-0.2, 0.7, r.x));
  vec3 refl = env + uSkyCol * spec * 1.6;
  // the room and the window as they stand, the window's brightest part (past what the probe holds) still a glint
  if (uHasProbe > 0.5) refl = njEnv(vP, r, n, 0.03) + uSkyCol * spec * 1.2;
  vec3 tint = vCol * njRoomLight(vP, n);
  float a = clamp(fr * 0.9 + uAlpha + spec * 0.5, 0.0, 0.94);
  gl_FragColor = vec4(njShoulder((refl * fr * 0.9 + refl * spec * 0.5 + tint * uAlpha) / max(a, 1e-3)), a);
  #include <colorspace_fragment>
}`,qt=`
uniform sampler2D uAtlas;
varying vec3 vP;
varying vec3 vN;
varying vec3 vCol;
varying vec2 vUv;
${me}
void main() {
  vec4 t = texture2D(uAtlas, vUv);
  if (t.a < 0.2) discard;
  float cover = clamp((t.a - 0.5) / max(fwidth(t.a), 1e-3) + 0.5, 0.0, 1.0);
  vec3 n = normalize(vN) * (gl_FrontFacing ? 1.0 : -1.0);
  vec3 c = vCol * t.rgb;
  vec3 col = c * (njRoomLight(vP, n) + njBackLight(vP, -n) * 0.45 * vec3(0.85, 1.0, 0.45));
  vec3 v = normalize(vP - cameraPosition), r = reflect(v, n);
  col += 0.07 * uSkyCol * pow(max(dot(r, normalize(${fe} - vP)), 0.0), 10.0);
  gl_FragColor = vec4(njShoulder(col), cover);
  #include <colorspace_fragment>
}`,Qt=`
varying vec3 vCol;
varying vec2 vUv;
void main() {
  vec2 q = (vUv - 0.5) * 2.0;
  float d = dot(q, q), a = vCol.r * exp(-d * 2.6) * smoothstep(1.0, 0.55, d);
  gl_FragColor = vec4(vec3(1.0 - a), 1.0);
}`,Xt=`
varying vec3 vCol;
void main() { gl_FragColor = vec4(vCol, 1.0);
  #include <colorspace_fragment>
}`,Yt=`
uniform sampler2D uMap;
uniform float uGain;
varying vec2 vUv;
void main() { gl_FragColor = vec4(texture2D(uMap, vUv).rgb * uGain, 1.0);
  #include <colorspace_fragment>
}`,Kt=`
uniform sampler2D uWall, uTerm;
uniform float uHasWall, uGain;
varying vec3 vP;
varying vec3 vN;
varying vec2 vUv;
void main() {
  vec3 wall = uHasWall > 0.5 ? texture2D(uWall, vUv).rgb : vec3(0.82, 0.79, 0.73);
  vec4 term = texture2D(uTerm, vUv);
  vec3 c = mix(wall, term.rgb, term.a) * uGain;
  vec3 n = normalize(vN), v = normalize(vP - cameraPosition), r = reflect(v, n);
  float fr = 0.04 + 0.5 * pow(1.0 - clamp(-dot(n, v), 0.0, 1.0), 5.0);
  float win = pow(max(dot(r, normalize(${fe} - vP)), 0.0), 6.0);
  c = c * (1.0 - fr) + vec3(1.0, 0.95, 0.85) * (fr * 0.35 + win * 0.06);
  gl_FragColor = vec4(c, 1.0);
  #include <colorspace_fragment>
}`,Zt=`
uniform sampler2D uMap;
varying vec2 vUv;
void main() {
  vec4 t = texture2D(uMap, vUv);
  if (t.a < 0.02) discard;
  gl_FragColor = vec4(t.rgb, t.a);
  #include <colorspace_fragment>
}`,Jt=`
uniform float uGain;
varying vec2 vUv;
void main() {
  vec2 q = (vUv - 0.5) * 2.0;
  float d = length(q * vec2(1.0, 1.35));
  float c = exp(-pow((d - 0.55) / 0.12, 2.0)) * 0.65 + exp(-d * d / 0.16) * 0.45;
  gl_FragColor = vec4(vec3(0.95, 0.46, 0.1) * c * smoothstep(1.0, 0.55, d) * uGain, 1.0);
}`,eo=`
uniform sampler2D uMap;
uniform float uGain;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(uMap, vUv).rgb;
  float down = 1.0 - vUv.y, across = vUv.x - 0.5;
  float pool = exp(-down * down / 0.42) * (0.72 + 0.28 * exp(-across * across / 0.16));
  gl_FragColor = vec4(c * uGain * (0.5 + 0.62 * pool) * vec3(1.0, 0.97, 0.9), 1.0);
  #include <colorspace_fragment>
}`;function q0(c,z,D,H=Ke){let k=document.createElement("canvas");k.width=c,k.height=z,D(k.getContext("2d"),c,z);let G=new st(k);return G.colorSpace=H,G.anisotropy=4,G}function v0(c){return()=>{c|=0,c=c+1831565813|0;let z=Math.imul(c^c>>>15,1|c);return z=z+Math.imul(z^z>>>7,61|z)^z,((z^z>>>14)>>>0)/4294967296}}var ue={w:1400,h:1e3};function xt(c,z,D){let H=v0(5);c.fillStyle="#1b1f1e",c.fillRect(0,0,z,D);for(let i=0;i<46;i++)c.fillStyle=`rgba(255,255,255,${.012+.022*H()})`,c.beginPath(),c.ellipse(H()*z,H()*D,60+180*H(),30+90*H(),H()*3,0,7),c.fill();let k=(i,F)=>`${i} ${F}px "NJ Menu", "NJ Text", system-ui, sans-serif`,G="rgba(244,240,230,0.96)",V="rgba(236,230,216,0.88)";c.textBaseline="alphabetic",c.fillStyle=G,c.font=k(700,80),c.fillText("Menu",84,124),c.fillRect(84,146,160,5);let A=(i,F,b,r0,I)=>{let d="",_=b;for(let $ of i.split(" ")){let J=d?d+" "+$:$;d&&c.measureText(J).width>r0?(c.fillText(d,F,_),d=$,_+=I):d=J}return c.fillText(d,F,_),_},h=(i,F,b)=>(c.fillStyle=G,c.font=k(650,86),c.fillText(F,84,i),c.fillStyle=V,c.font=k(450,70),A(b,84,i+88,z-168,82)),u=h(290,"Cross-platform content","Video, images and posts made for each platform and published for you.");u=h(u+138,"Community management","Comments, messages and requests answered in your brand\u2019s voice."),c.fillStyle="rgba(240,196,120,0.98)",c.font=k(650,74);let p="\u2190 Order here",y=Math.min(D-60,u+132),j=c.measureText(p).width;return c.fillText(p,84,y),{x0:70/z,x1:(98+j)/z,y0:(y-72)/D,y1:(y+22)/D}}var yt=[["#8be9a8","~/njct.io  feat/room"],["#d6d6d6","$ npm run build"],["#9a9a9a","  dist/ matches a fresh build (15 files)"],["#d6d6d6","$ git log --oneline -3"],["#e8c07a","  00c8874 Merge feat/editions into feat/room"],["#e8c07a","  d978d3b The caf\xE9, fixed after review"],["#e8c07a","  9245df6 Caf\xE9 brief: the garden"]],Q0=yt.reduce((c,[,z])=>c+z.length,0);function gt(c,z,D,H=Q0,k=!0){c.clearRect(0,0,z,D);let G=z*.4,V=D*.34,A=z*.56,h=D*.6,u=14;c.fillStyle="rgba(0,0,0,0.25)",c.beginPath(),c.roundRect(G+8,V+14,A,h,u),c.fill(),c.fillStyle="rgba(23,24,27,0.97)",c.beginPath(),c.roundRect(G,V,A,h,u),c.fill(),c.fillStyle="#25262b",c.beginPath(),c.roundRect(G,V,A,30,[u,u,0,0]),c.fill(),["#ff5f57","#febc2e","#28c840"].forEach((i,F)=>{c.fillStyle=i,c.beginPath(),c.arc(G+20+F*20,V+15,6,0,7),c.fill()}),c.font="500 21px ui-monospace, Menlo, Consolas, monospace";let p=H,y=V+62,j=G+18;for(let[i,F]of yt){if(p<=0)break;let b=F.slice(0,p);if(c.fillStyle=i,c.fillText(b,j,y),p-=F.length,p<0){j+=c.measureText(b).width;break}y+=30,j=G+18}k&&(c.fillStyle="#d6d6d6",c.fillRect(p>=0?G+18:j+2,(p>=0,y-18),11,22))}var o0=p0.finish,M0=6,to="varying vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",oo=`
uniform sampler2D uSrc, uBloom, uHalo;
uniform float uAmount, uGlow;
varying vec2 vUv;
// the highlights, from the knee toward 1: their hue kept while they are a little over, going white as they climb
float njRollOne(float x) { return x <= ${o0.knee.toFixed(3)} ? x : ${o0.knee.toFixed(3)} + ${(1-o0.knee).toFixed(3)} * (1.0 - exp(-(x - ${o0.knee.toFixed(3)}) / ${(1-o0.knee).toFixed(3)})); }
vec3 njRoll(vec3 c) {
  float pk = max(c.r, max(c.g, c.b));
  if (pk <= ${o0.knee.toFixed(3)}) return c;
  vec3 hue = c * (njRollOne(pk) / pk), each = vec3(njRollOne(c.r), njRollOne(c.g), njRollOne(c.b));
  return mix(hue, max(hue, each), smoothstep(1.3, 4.0, pk));
}
void main() {
  vec3 c = texture2D(uSrc, vUv).rgb, h = c;
  if (uGlow > 0.0) {
    vec3 b = texture2D(uBloom, vUv).rgb / ${M0.toFixed(1)}, f = texture2D(uHalo, vUv).rgb;
    h += uGlow * (${o0.bloom.toFixed(3)} * b + ${o0.halation.toFixed(3)} * vec3(1.0, 0.34, 0.12) * dot(f, vec3(0.3, 0.59, 0.11)));
  }
  vec3 g = njRoll(h) * vec3(1.07, 0.99, 0.86);
  g = mix(g, g * g * (3.0 - 2.0 * g), 0.18);                 // a little more contrast
  vec2 q = vUv - 0.5;
  g *= 1.0 - 0.22 * dot(q, q) * 2.2;                          // the corners fall off
  gl_FragColor = vec4(mix(c, g, uAmount), 1.0);
  #include <colorspace_fragment>
  gl_FragColor.rgb += (fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))) - 0.5) / 255.0;
}`,ao=`
uniform sampler2D uSrc;
uniform vec2 uTexel;
varying vec2 vUv;
vec3 njOver(vec3 c) {
  float pk = max(c.r, max(c.g, c.b));
  float s = clamp(pk - ${(o0.threshold-o0.soft).toFixed(3)}, 0.0, ${(2*o0.soft).toFixed(3)});
  s = s * s / ${(4*o0.soft).toFixed(3)};
  return c * (max(s, pk - ${o0.threshold.toFixed(3)}) / max(pk, 1e-4));
}
void main() {
  vec3 a = njOver(texture2D(uSrc, vUv + uTexel * vec2(-1.0, -1.0)).rgb), b = njOver(texture2D(uSrc, vUv + uTexel * vec2(1.0, -1.0)).rgb);
  vec3 c = njOver(texture2D(uSrc, vUv + uTexel * vec2(-1.0, 1.0)).rgb), d = njOver(texture2D(uSrc, vUv + uTexel * vec2(1.0, 1.0)).rgb);
  vec4 w = 1.0 / (1.0 + vec4(max(a.r, max(a.g, a.b)), max(b.r, max(b.g, b.b)), max(c.r, max(c.g, c.b)), max(d.r, max(d.g, d.b))));
  gl_FragColor = vec4((a * w.x + b * w.y + c * w.z + d * w.w) / (w.x + w.y + w.z + w.w), 1.0);
}`,no=`
uniform sampler2D uSrc;
uniform vec2 uTexel;
varying vec2 vUv;
void main() {
  vec3 s = texture2D(uSrc, vUv).rgb * 4.0;
  s += texture2D(uSrc, vUv + uTexel * vec2(-1.0, -1.0)).rgb + texture2D(uSrc, vUv + uTexel * vec2(1.0, -1.0)).rgb;
  s += texture2D(uSrc, vUv + uTexel * vec2(-1.0, 1.0)).rgb + texture2D(uSrc, vUv + uTexel * vec2(1.0, 1.0)).rgb;
  gl_FragColor = vec4(s / 8.0, 1.0);
}`,ro=`
uniform sampler2D uSrc, uHere;
uniform vec2 uTexel;
varying vec2 vUv;
void main() {
  vec3 s = texture2D(uSrc, vUv + uTexel * vec2(-2.0, 0.0)).rgb + texture2D(uSrc, vUv + uTexel * vec2(2.0, 0.0)).rgb;
  s += texture2D(uSrc, vUv + uTexel * vec2(0.0, -2.0)).rgb + texture2D(uSrc, vUv + uTexel * vec2(0.0, 2.0)).rgb;
  s += 2.0 * (texture2D(uSrc, vUv + uTexel * vec2(-1.0, -1.0)).rgb + texture2D(uSrc, vUv + uTexel * vec2(1.0, -1.0)).rgb);
  s += 2.0 * (texture2D(uSrc, vUv + uTexel * vec2(-1.0, 1.0)).rgb + texture2D(uSrc, vUv + uTexel * vec2(1.0, 1.0)).rgb);
  gl_FragColor = vec4(s / 12.0 + texture2D(uHere, vUv).rgb, 1.0);
}`,lo=1.5,so=4e6;function io(c){let z=new N0(4,4,{type:j0,samples:4,depthBuffer:!0}),D=()=>new N0(2,2,{type:j0,depthBuffer:!1,generateMipmaps:!1,minFilter:se,magFilter:se}),H=Array.from({length:M0},D),k=Array.from({length:M0-1},D),G=(d,_={})=>new i0({uniforms:{uSrc:{value:null},uTexel:{value:new ie},..._},vertexShader:to,fragmentShader:d,depthTest:!1,depthWrite:!1,toneMapped:!1}),V=G(ao),A=G(no),h=G(ro,{uHere:{value:null}}),u=G(oo,{uBloom:{value:k[0].texture},uHalo:{value:H[1].texture},uAmount:{value:0},uGlow:{value:0}});u.uniforms.uSrc.value=z.texture;let p=new ce;p.setAttribute("position",new V0([-1,-1,0,3,-1,0,-1,3,0],3));let y=new y0(p,u);y.frustumCulled=!1;let j=new rt,i=new tt;j.add(y);let F=(d,_,$,J)=>{d.uniforms.uSrc.value=_.texture,d.uniforms.uTexel.value.set(1/_.width,1/_.height).multiplyScalar($),y.material=d,c.setRenderTarget(J),c.render(j,i)},b=new ie;function r0(){c.getDrawingBufferSize(b);let d=Math.min(1,lo/Math.max(1,c.getPixelRatio())),_=Math.max(1,Math.round(b.x*d)),$=Math.max(1,Math.round(b.y*d)),J=_*$>so?2:4;z.samples!==J?(z.dispose(),z=new N0(_,$,{type:j0,samples:J,depthBuffer:!0}),u.uniforms.uSrc.value=z.texture):(z.width!==_||z.height!==$)&&z.setSize(_,$);let X=_,l0=$;for(let d0=0;d0<M0;d0++)X=Math.max(1,Math.ceil(X/2)),l0=Math.max(1,Math.ceil(l0/2)),(H[d0].width!==X||H[d0].height!==l0)&&(H[d0].setSize(X,l0),d0<M0-1&&k[d0].setSize(X,l0))}function I(){F(V,z,1,H[0]);for(let d=1;d<M0;d++)F(A,H[d-1],1,H[d]);for(let d=M0-2;d>=0;d--)h.uniforms.uHere.value=H[d].texture,F(h,d===M0-2?H[d+1]:k[d+1],.5,k[d])}return{get target(){return r0(),z},compile(){for(let d of[V,A,h])y.material=d,c.setRenderTarget(H[0]),c.compile(j,i);y.material=u,c.setRenderTarget(null),c.compile(j,i)},render(d,_,$){r0(),c.setRenderTarget(z),c.render(d,_);let J=$>.002?$:0;J&&I(),y.material=u,u.uniforms.uSrc.value=z.texture,u.uniforms.uAmount.value=$,u.uniforms.uGlow.value=J,c.setRenderTarget(null),c.render(j,i)},dispose(){z.dispose();for(let d of[...H,...k])d.dispose();for(let d of[u,V,A,h])d.dispose();p.dispose()}}}function co(c,z,D,H){let k=new G0(1,1,1,3,3,3),G=k.attributes.position,V=k.attributes.normal,A=[c/2,z/2,D/2],h=A.map(F=>Math.max(F-H,0)),u=new m0,p=new m0,y=new m0,j=Ze.clamp,i=(F,b)=>Math.abs(F)>.4?Math.sign(F)*A[b]:Math.sign(F)*h[b];for(let F=0;F<G.count;F++){u.set(i(G.getX(F),0),i(G.getY(F),1),i(G.getZ(F),2)),p.set(j(u.x,-h[0],h[0]),j(u.y,-h[1],h[1]),j(u.z,-h[2],h[2])),y.subVectors(u,p);let b=y.length();b>1e-6&&(y.multiplyScalar(H/b),u.copy(p).add(y),V.setXYZ(F,y.x/H,y.y/H,y.z/H)),G.setXYZ(F,u.x,u.y,u.z)}return k}function uo(c){let z=0,D=0;for(let y of c)z+=y.attributes.position.count,D+=y.index?y.index.count:y.attributes.position.count;let H=new Float32Array(z*3),k=new Float32Array(z*3),G=new Float32Array(z*2),V=new Float32Array(z*3),A=z>65535?new Uint32Array(D):new Uint16Array(D),h=0,u=0;for(let y of c){let j=y.attributes,i=j.position.count;if(H.set(j.position.array.subarray(0,i*3),h*3),k.set(j.normal.array.subarray(0,i*3),h*3),j.uv&&G.set(j.uv.array.subarray(0,i*2),h*2),V.set(j.aCol.array,h*3),y.index){let F=y.index.array;for(let b=0;b<F.length;b++)A[u+b]=F[b]+h;u+=F.length}else{for(let F=0;F<i;F++)A[u+F]=h+F;u+=i}h+=i}let p=new ce;return p.setAttribute("position",new H0(H,3)),p.setAttribute("normal",new H0(k,3)),p.setAttribute("uv",new H0(G,2)),p.setAttribute("aCol",new H0(V,3)),p.setIndex(new H0(A,1)),p.computeBoundingSphere(),p}var r={plaster:[.8,.77,.72],ceiling:[.78,.76,.72],floor:[.76,.71,.62],dark:[.035,.032,.03],oak:[.62,.45,.28],teak:[.4,.25,.14],walnut:[.2,.12,.07],bentwood:[.13,.075,.045],steel:[.05,.07,.06],chrome:[.24,.25,.26],stainless:[.44,.45,.46],ink:[.045,.045,.05],brass:[.5,.36,.16],mint:[.36,.56,.46],cream:[.9,.87,.8],terra:[.56,.3,.2],clay:[.7,.5,.36],sage:[.28,.4,.32],marble:[.86,.85,.82],slate:[.09,.1,.1],enamel:[.12,.24,.2],glow:[1,.86,.62],screen:[.1,.12,.16],leafM:[.12,.33,.09],leafF:[.14,.34,.08],leafP:[.2,.42,.1],leafS:[.12,.27,.11],leafB:[.2,.4,.12],stem:[.22,.32,.1],bark:[.25,.18,.12],soil:[.1,.07,.045],beans:[.18,.1,.05],coffee:[.09,.045,.02],tea:[.95,.4,.09],milk:[.95,.9,.8],crust:[.72,.42,.15],cane:[.62,.46,.27],oat:[.74,.66,.54],rust:[.56,.24,.12],indigo:[.08,.12,.27],olive:[.3,.32,.16],clear:[.85,.9,.88]},T0=(c,z)=>c.map(D=>D*z),ke=new lt(new Uint8Array([0,0,0,255]),1,1);ke.needsUpdate=!0;var z0=[[.62,.36,.22],[.85,.8,.7],[.16,.2,.19],[.72,.52,.3],[.3,.44,.4],[.82,.62,.48],[.14,.16,.28]],C0=[[.95,.92,.85],[.9,.55,.25],[.2,.2,.2],[.85,.75,.3]];function xo({renderer:c,scene:z,lightUniforms:D,sun:H}){let k=new O0;k.visible=!1,z.add(k);let G=[],V=[],A=e=>(G.push(e),e),{front:h,back:u,floor:p,ceiling:y,depth:j}=N,i=(e,t,n)=>new m0(e,t,n),F=i(0,1,0),b={x0:u,x1:u+Y.back,z0:0,z1:2050,top:Y.backTop},r0={x0:u,x1:u+300,z0:2065,z1:2345,top:560},I={z0:2440,z1:2740,spring:400},d=Y,_={x0:-2058,x1:-1065,d:240,top:760},$=i((O.x0+O.x1)/2,310,(O.z0+O.z1)/2+60),J=[i((d.x0+d.x1)/2,360,1080),i((d.x0+d.x1)/2,360,1960),i(u+250,470,620)],X={uWinQ:{value:[R.y0,R.y1].flatMap(e=>[R.z0,R.z1].map(t=>i(N.front,e,t)))},uPatchQ:{value:[0,1,2,3].map(()=>i(0,0,0))},uWallQ:{value:[i(-t0.niche.x,N.floor,0),i(t0.niche.x,N.floor,0),i(t0.niche.x,t0.niche.top,0),i(-t0.niche.x,t0.niche.top,0)]},uSkyCol:{value:i(2.3,2.38,2.55)},uPatchCol:{value:i(2.6,1.6,.78)},uWallCol:{value:i(.86,.82,.76)},uLampP:{value:[...J.map(e=>new I0(e.x,e.y,e.z,1)),new I0($.x,$.y,$.z,0)]},uLampCol:{value:i(.95,.6,.28)},uAmbient:{value:.065},uProbe:{value:ke},uProbeD:{value:ke},uHasProbe:{value:0},uBounce:{value:.8},uOcc:{value:Array.from({length:X0},()=>new I0(0,0,0,0))},uOccTop:{value:new Array(X0).fill(-1e4)}},l0=X.uWinQ.value;[l0[2],l0[3]]=[l0[3],l0[2]];function d0(e,t,n){let a=0;for(let o=0;o<4;o++){let l=n[o].clone().sub(e).normalize(),s=n[(o+1)%4].clone().sub(e).normalize(),f=new m0().crossVectors(l,s);a+=Math.acos(Math.max(-1,Math.min(1,l.dot(s))))*t.dot(f)/Math.max(f.length(),1e-6)}return a/(2*Math.PI)}let pe=(e,t,n)=>{d0(t,n,e)<0&&e.reverse()},ve=i(0,0,1400);if(pe(l0,ve,i(1,0,0)),pe(X.uWallQ.value,ve,i(0,0,-1)),H){let e=H.uniforms.uSunD.value;[[E.y0,E.z0],[E.y0,E.z1],[E.y1,E.z1],[E.y1,E.z0]].map(([n,a])=>i(N.front,n,a)).forEach((n,a)=>X.uPatchQ.value[a].copy(n).addScaledVector(e,-n.z/e.z)),pe(X.uPatchQ.value,ve,i(0,0,-1))}else X.uPatchCol.value.set(0,0,0);[[(b.x0+b.x1)/2,(b.z0+b.z1)/2,Y.back/2,(b.z1-b.z0)/2,b.top],[(r0.x0+r0.x1)/2,(r0.z0+r0.z1)/2,150,140,r0.top],[(d.x0+d.x1)/2,(d.z0+d.z1)/2,(d.x1-d.x0)/2,(d.z1-d.z0)/2,d.top],[(_.x0+_.x1)/2,_.d/2,(_.x1-_.x0)/2,_.d/2,_.top],[(O.x0+O.x1)/2,(O.z0+O.z1)/2,(O.x1-O.x0)/2,(O.z1-O.z0)/2,O.top],[560,1700,105,105,-366],[630,1430,105,105,-366],[h-70,715,70,485,R.y0],[(t0.niche.x+h)/2,115,(h-t0.niche.x)/2,115,316],[-1e3,430,100,100,-420],[-1347,1510,145,210,d.top+250],[-1330,1935,140,150,d.top+220],[-2270,1160,115,100,b.top+380]].forEach(([e,t,n,a,o],l)=>{X.uOcc.value[l].set(e,t,n,a),X.uOccTop.value[l]=o});let Se=A(q0(1024,512,ht,Ye)),B0=(e,t={},n={})=>A(new i0({uniforms:{...X,...t},vertexShader:b0,fragmentShader:e,toneMapped:!1,...n})),e0=(e,t=[0,0,0])=>B0(Lt,{uKind:{value:e},uSpec:{value:i(...t)}}),_0={plain:e0(0),satin:e0(0,[.04,.4,0]),chrome:e0(0,[.65,.14,1]),brushed:e0(0,[.56,.38,1]),wood:e0(2,[.035,.42,0]),flute:e0(5,[.03,.55,0]),plaster:e0(3),marble:e0(4,[.045,.14,0]),tile:e0(1,[.035,.4,0]),glazed:e0(6,[.05,.07,0]),fabric:e0(7),cane:e0(8),thru:e0(9,[.035,.3,0]),emit:B0(Xt),leaf:B0(qt,{uAtlas:{value:Se}},{side:le,alphaToCoverage:!0}),glass:B0(Ot,{uAlpha:{value:.05}},{transparent:!0,depthWrite:!1,side:le}),contact:B0(Qt,{},{transparent:!0,depthWrite:!1,blending:Oe,blendEquation:qe,blendSrc:Qe,blendDst:Xe,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})},x0=new Map;function K(e,t,n,a){n&&t.applyMatrix4(n);let o=t.attributes.position.count,l=new Float32Array(o*3);for(let s=0;s<o;s++)l.set(a,s*3);return t.setAttribute("aCol",new H0(l,3)),x0.has(e)||x0.set(e,[]),x0.get(e).push(t),t}let He=new Je,bt=new et,zt=new m0,wt=new m0(1,1,1),w=(e=0,t=0,n=0,a=0,o=0,l=0,s=null)=>{let f=new Re().compose(zt.set(e,t,n),He.setFromEuler(bt.set(o,a,l,"YXZ")),wt);return s?s.clone().multiply(f):f},Et=new Set(["wood","marble","flute","satin","plain","fabric","cane","glazed","chrome"]),m=(e,t,n,a,o,l,s,f,v)=>{let x=l-n,T=s-a,g=f-o,P=Math.min(x,T,g),U=Et.has(e)&&P>=10?Math.min(6,P*.18):0;return K(e,(U>.5?co(x,T,g,U):new G0(x,T,g)).translate((n+l)/2,(a+s)/2,(o+f)/2),v,t)},C=(e,t,n,a,o,l,s,f,v=l,x=24)=>K(e,new F0(v,l,s,x).translate(n,a+s/2,o),f,t),R0=(e,t,n,a,o,l,s,f,v,x=16)=>K(e,new ft(1,x,Math.max(6,x>>1)).scale(l,s,f).translate(n,a,o),v,t),q=(e,t,n,a,o,l,s,f=24)=>K(e,new ct(n.map(([v,x])=>new ie(v,x)),f).translate(a,o,l),s,t),W=(e,t,n,a,o,l,s=8)=>{let f=a.clone().sub(n),v=f.length();return K(e,new F0(o,o,v,s).applyQuaternion(He.setFromUnitVectors(F,f.normalize())).translate((n.x+a.x)/2,(n.y+a.y)/2,(n.z+a.z)/2),l,t)},g0=(e,t,n,a,o,l=Math.PI*2,s=32)=>K(e,new mt(n,a,8,s,l),o,t),L=(e,t,n,a,o)=>K(e,new n0(n,a),o,t),Fe=(e,t,n,a,o,l)=>{let s=new G0(1,1,1,8,8,2),f=s.attributes.position;for(let v=0;v<f.count;v++){let x=f.getX(v)*2,T=f.getY(v)*2,g=f.getZ(v),P=Math.sqrt(Math.max(0,(1-x**4)*(1-T**4)));f.setXYZ(v,x*n/2*(1-.06*T*T),T*a/2*(1-.06*x*x),g*o*(.18+.82*P))}return s.computeVertexNormals(),K(e,s,l,t)},A0=(e,t,n=.28)=>{let a=1-n/2+n*t();return e.map(o=>o*a)},P0=(e,t,n)=>{let a=new y0(A(e),t);return n&&(a.matrixAutoUpdate=!1,a.matrix.copy(n),a.matrixWorldNeedsUpdate=!0),k.add(a),a};function k0(e,t,n,a,o,l,s=.15,f=0){let v=a.clone().normalize(),x=new m0().crossVectors(v,F);x.lengthSq()<1e-6&&x.set(1,0,0),x.normalize(),f&&x.applyAxisAngle(v,f);let T=new m0().crossVectors(x,v).normalize(),g=new n0(1,1,2,4),P=g.attributes.position,U=g.attributes.uv;for(let B=0;B<P.count;B++){let a0=U.getX(B),Z=U.getY(B),Q=(a0-.5)*2;P.setXYZ(B,(a0-.5)*o,Z*l,(-s*Z*Z+.05*Q*Q)*l),U.setXY(B,((e&3)+a0)/4,1-((e>>2)+1-Z)/2)}g.computeVertexNormals(),g.applyMatrix4(new Re().makeBasis(x,v,T).setPosition(n));let S=g.attributes.position;for(let B=0;B<S.count;B++)S.setXYZ(B,Math.min(Math.max(S.getX(B),u+3),h-3),Math.min(S.getY(B),y-3),Math.min(Math.max(S.getZ(B),3),j-3));g.computeVertexNormals(),K("leaf",g,null,t)}let Y0=(e,t,n=3,a=r.stem)=>W("plain",a,e,t,n,null,5);function K0(e,t,n,a,o,l=r.terra,s="satin"){q(s,l,[[0,0],[a*.78,0],[a,o*.92],[a*1.05,o],[a*.95,o],[a*.9,o*.9],[0,o*.9]],e,t,n),C("plain",r.soil,e,t+o*.84,n,a*.9,4,null,a*.9,20)}function Tt(e,t,n,a,o,l,s=0,f=2*Math.PI){let v=v0(l);for(let x=0;x<o;x++){let T=s+(f-s)*((x*.618+v()*.25)%1),g=.25+v()*.75,P=a*(.5+v()*.5),U=i(e,t,n),S=U.clone().addScaledVector(i(Math.cos(T)*Math.sin(g),Math.cos(g),Math.sin(T)*Math.sin(g)),P);Y0(U,S,3.5),k0(0,A0(r.leafM,v),S,i(Math.cos(T),.45-v()*.7,Math.sin(T)),a*(.68+v()*.2),a*(.62+v()*.2),.16,(v()-.5)*.7)}}function Mt(e,t,n,a,o,l=0,s=2*Math.PI,f=20){let v=v0(o),x=i(e+6,t+a*.42,n-4);W("wood",r.bark,i(e,t,n),x,11,null,7);let T=[0,1,2].map(g=>{let P=l+(s-l)*(.2+.3*g),U=.22+.08*g;return x.clone().add(i(Math.cos(P)*a*U,a*(.5+.05*g),Math.sin(P)*a*U))});for(let g of T)W("wood",r.bark,x,g,7,null,6);for(let g=0;g<f;g++){let P=T[g%3],U=.3+.7*((g*.37+v()*.2)%1),S=x.clone().lerp(P,U),B=l+(s-l)*((g*.618+v()*.2)%1),a0=i(Math.cos(B),.5,Math.sin(B)).normalize(),Z=S.clone().addScaledVector(a0,18);Y0(S,Z,3);let Q=(120+80*v())*(1.1-.3*U);k0(2,A0(r.leafF,v),Z,i(Math.cos(B),.4+v()*.9,Math.sin(B)),Q*.62,Q,.1,(v()-.5)*.9)}}function Z0(e,t,n,a,o=40,l=0){let s=v0(a),f=t.clone().setY(0).normalize(),v=e.clone(),x=0,T=Math.max(2,Math.round(n/32));for(let g=0;g<T;g++){let P=x<l,U=P?30:g<2?16:3;x+=U;let S=v.clone().add(i(f.x*U+(s()-.5)*10,P?-2-s()*3:-26-s()*10,f.z*U+(s()-.5)*10));Y0(v,S,1.8);let B=g%2?1:-1,Z=i(-f.z,0,f.x).multiplyScalar(B).multiplyScalar(.7).add(f.clone().multiplyScalar(.7)).add(i(0,-.2-s()*.6,0));k0(1,A0(r.leafP,s),S,Z,o*(.8+s()*.3),o*(.9+s()*.3),.06,(s()-.5)*1.2),v=S}}function Rt(e,t,n,a,o,l,s=.2){let f=v0(l);for(let v=0;v<o;v++){let x=f()*6.283,T=4+f()*14;k0(4,A0(r.leafS,f),i(e+Math.cos(x)*T,t,n+Math.sin(x)*T),i(Math.cos(x)*s,1,Math.sin(x)*s),a*.17,a*(.6+f()*.4),-.03,f()*3)}}function S0(e,t,n,a,o,l=38,s=52,f=r.cream,v=90){K0(e,t,n,l,s,f);let x=v0(o);for(let g=0;g<5;g++){let P=g*1.3+x();k0(1,A0(r.leafP,x),i(e+Math.cos(P)*8,t+s*.85,n+Math.sin(P)*8),i(Math.cos(P),.9,Math.sin(P)),34,38,.2,x())}let T=a.clone().setY(0).normalize();Z0(i(e+T.x*l,t+s*.9,n+T.z*l),T,120+x()*140+v,o+1,34,v),Z0(i(e+T.x*l*.7+T.z*l*.6,t+s*.9,n+T.z*l*.7-T.x*l*.6),T,60+x()*80+v,o+2,32,v)}let he=(e,t,n,a=r.cream,o=null,l=24,s=38,f=!0)=>{q("satin",a,[[0,0],[l*.68,0],[l*.94,s*.5],[l,s],[l-2.5,s],[l*.92-2.5,s*.5],[0,5]],e,t,n,o,20),g0("satin",a,10,2.6,w(e+l-1,t+s*.55,n,0,0,-Math.PI/2,o),Math.PI,12),f&&C("plain",r.coffee,e,t+s-7,n,l-3,1,o,l-3,18)},Ce=(e,t,n,a=r.cream,o=null)=>q("satin",a,[[0,0],[26,0],[40,6],[38,7],[0,3]],e,t,n,o,24),de=(e,t,n,a=null,o=r.cream)=>{Ce(e,t,n,o,a),he(e,t+4,n,o,a),C("plain",r.milk,e,t+36,n,15,1.5,a,9,16)},J0=(e,t,n,a=60,o=null,l=null)=>{q("glass",r.clear,[[0,0],[21,0],[24,a],[22.5,a],[19.5,4],[0,4]],e,t,n,l,24),o&&C("thru",o,e,t+4,n,19,a*.62,l,21,20)},Ae=(e,t,n,a,o,l=null)=>{C("glass",r.clear,e,t,n,34,a,l,34,24),C("satin",o,e,t+2,n,31,a*.72,l,31,20),C("satin",r.walnut,e,t+a,n,35,12,l,35,24)},$0=(e,t,n,a,o,l,s,f,v=null,x="z")=>{m("satin",s,e-a/2,t,n-l/2,e+a/2,t+o,n+l/2,v),x==="z"?m("plain",f,e-a/2+8,t+o*.3,n+l/2,e+a/2-8,t+o*.66,n+l/2+1.5,v):m("plain",f,e+a/2,t+o*.3,n-l/2+8,e+a/2+1.5,t+o*.66,n+l/2-8,v)};function xe(e,t,n,a=r.ink,o=null,l=0){let s=w(e,t,n,l,0,0,o),f=a===r.stainless?"brushed":"satin";q(f,a,[[0,0],[44,0],[46,50],[36,78],[12,84],[8,92],[0,94]],0,0,0,s,24),W(f,a,i(30,16,0),i(72,92,0),4,s),W(f,a,i(72,92,0),i(96,84,0),3.4,s),g0(f,a,32,5,w(-40,52,0,0,0,Math.PI/2,s),Math.PI,16)}L("tile",r.floor,h-u,j,w((h+u)/2,p,j/2,0,-Math.PI/2)),L("plaster",r.ceiling,h-u,j,w((h+u)/2,y,j/2,0,Math.PI/2)),L("plaster",r.plaster,h-u,y-p,w((h+u)/2,(p+y)/2,j,Math.PI));{let e=new it,t=-(I.z0+I.z1)/2,n=(I.z1-I.z0)/2;e.moveTo(0,p),e.lineTo(0,y),e.lineTo(-j,y),e.lineTo(-j,p),e.lineTo(-I.z1,p),e.lineTo(-I.z1,I.spring),e.absarc(t,I.spring,n,Math.PI,0,!0),e.lineTo(-I.z0,p),e.lineTo(0,p);let a=new ut(e,24);K("plaster",a,w(u,0,0,Math.PI/2),r.plaster);let o=110,l=24,s=[],f=[],v=[],x=[];for(let S=0;S<=l;S++){let B=Math.PI*(1-S/l),a0=I.spring+n*Math.sin(B),Z=(I.z0+I.z1)/2+n*Math.cos(B);for(let Q of[u,u-o])s.push(Q,a0,Z),f.push(0,-Math.sin(B),-Math.cos(B)),v.push(0,0);if(S<l){let Q=S*2;x.push(Q,Q+2,Q+1,Q+1,Q+2,Q+3)}}let T=new ce;T.setAttribute("position",new V0(s,3)),T.setAttribute("normal",new V0(f,3)),T.setAttribute("uv",new V0(v,2)),T.setIndex(x),K("plaster",T,null,r.plaster),L("plaster",r.plaster,o,I.spring-p,w(u-o/2,(I.spring+p)/2,I.z0,0)),L("plaster",r.plaster,o,I.spring-p,w(u-o/2,(I.spring+p)/2,I.z1,Math.PI));let g=u-520,P=I.z0-60,U=j+400;L("plain",r.dark,U-P,y-p,w(g,(p+y)/2,(P+U)/2,Math.PI/2)),L("plain",[.06,.055,.05],u-o-g,U-P,w((u-o+g)/2,p,(P+U)/2,0,-Math.PI/2)),L("plain",r.dark,u-o-g,U-P,w((u-o+g)/2,I.spring+n+40,(P+U)/2,0,Math.PI/2)),L("plain",r.dark,u-o-g,y-p,w((u-o+g)/2,(p+y)/2,P)),L("plain",r.dark,u-o-g,y-p,w((u-o+g)/2,(p+y)/2,U,Math.PI)),L("plain",r.dark,U-P,y-p,w(u-o,(p+y)/2,(P+U)/2,-Math.PI/2));for(let[S,B]of[[I.z0+4,I.z0+170],[I.z0+196,I.z1-4]]){let a0=new n0(B-S,I.spring-p-70,28,1),Z=a0.attributes.position;for(let Q=0;Q<Z.count;Q++)Z.setZ(Q,9*Math.sin(Z.getX(Q)/11));a0.computeVertexNormals(),K("thru",a0,w(u-40,(I.spring+p+70)/2,(S+B)/2,Math.PI/2),[.72,.64,.52])}W("chrome",r.brass,i(u-40,I.spring+6,I.z0),i(u-40,I.spring+6,I.z1),5)}let ee=N.wall;m("plaster",r.plaster,h,p,0,h+ee,y,R.z0),m("plaster",r.plaster,h,p,R.z1,h+ee,y,j),m("plaster",r.plaster,h,p,R.z0,h+ee,R.y0,R.z1),m("plaster",r.plaster,h,R.y1,R.z0,h+ee,y,R.z1);let D0=(e,t,n,a)=>m("satin",r.steel,h-4,t,e,h+14,a,n),c0=E.frame;for(let e of[R.z0,E.z0,E.z1-c0,R.z1-c0])D0(e,R.y0,e+c0,R.y1);for(let e of R.sideBars)D0(e-E.bar/2,R.y0,e+E.bar/2,R.y1);for(let e of[R.y0,E.y0,E.y1-c0,R.y1-c0])D0(R.z0,e,R.z1,e+c0);let Ue=E.y0+(E.y1-E.y0)*E.transom,Pt=[E.z0+c0+(E.z1-E.z0-2*c0)/3,E.z0+c0+2*(E.z1-E.z0-2*c0)/3];D0(E.z0,Ue-E.transomBar/2,E.z1,Ue+E.transomBar/2);for(let e of Pt)D0(e-E.bar/2,E.y0,e+E.bar/2,E.y1);let te=A(q0(768,256,()=>{})),je=()=>{let e=te.image,t=e.getContext("2d");t.clearRect(0,0,e.width,e.height),t.save(),t.translate(e.width,0),t.scale(-1,1),t.font='700 176px "NJ Lettering", Georgia, serif',t.textAlign="center",t.textBaseline="middle",t.lineJoin="round",t.strokeStyle="#d9ad52",t.lineWidth=12,t.strokeText("njct.io",e.width/2,e.height/2+8),t.fillStyle="#1d1710",t.fillText("njct.io",e.width/2,e.height/2+8),t.restore(),te.needsUpdate=!0};V.push(new FontFace("NJ Lettering",`url(${new URL("../vendor/fonts/fraunces-lettering.woff2",new URL("../room/shell.js",import.meta.url).href).href})`,{weight:"700"}).load().then(e=>{document.fonts.add(e),je()},je));let kt=A(new i0({uniforms:{uMap:{value:te}},vertexShader:b0,fragmentShader:Zt,transparent:!0,depthWrite:!1,toneMapped:!1}));P0(new n0(168,56),kt,w(h-3,175,(E.z0+E.z1)/2,-Math.PI/2));let St=H?.uniforms.uLeaf0.value||null,Ie=A(new i0({uniforms:{uLeafSun:{value:St},uSunU:H?H.uniforms.uSunU:{value:i(1,0,0)},uSunV:H?H.uniforms.uSunV:{value:i(0,1,0)},uMask:H?H.uniforms.uMask:{value:new I0},uHasLeaves:{value:0}},vertexShader:b0,fragmentShader:Nt,toneMapped:!1})),ge=[P0(new n0(6400,3600),Ie,w(h+1900,700,-400,-Math.PI/2))],Ht=A(new i0({uniforms:{...Ie.uniforms,uLeafSun:{value:H?.uniforms.uLeaf2.value||null}},vertexShader:b0,fragmentShader:Vt,toneMapped:!1})),oe=(e,t,n,a)=>ge.push(P0(new n0(n-e,a-t),Ht,w(h+6,(t+a)/2,(e+n)/2,-Math.PI/2)));oe(R.z0,R.y0,E.z0,R.y1),oe(E.z1,R.y0,R.z1,R.y1),oe(E.z0,R.y0,E.z1,E.y0),oe(E.z0,E.y1,E.z1,R.y1),L("glass",[.84,.92,.88],E.z1-E.z0,E.y1-E.y0,w(h+3,(E.y0+E.y1)/2,(E.z0+E.z1)/2,-Math.PI/2));let u0=vt(c,D),Ft=[u,p,h,y];u0.resize(u,p,h,y,360,190),u0.mesh.position.z=-1,u0.mesh.updateMatrixWorld(),u0.mesh.renderOrder=-2,k.add(u0.mesh);let Ct=A(new i0({uniforms:{...X,uWallBake:u0.mesh.material.uniforms.uBake,uWallRegion:{value:new I0(...Ft)},uOak:{value:new Pe(...r.oak)}},vertexShader:b0,fragmentShader:Wt,toneMapped:!1})),w0=t0.niche.x,ae=t0.depth,f0=300;P0(new n0(h-w0,f0-p),Ct,w((w0+h)/2,(p+f0)/2,ae)),L("wood",r.oak,ae,f0-p,w(w0,(p+f0)/2,ae/2,-Math.PI/2)),m("wood",r.oak,w0,f0,0,h,f0+16,ae+10),K0(1060,f0+16,112,70,130,r.terra),Tt(1060,f0+130,112,180,12,11,Math.PI/2-.2,Math.PI+.3);for(let[e,t]of[[1166,[.85,.82,.75]],[1186,[.16,.16,.18]]])m("satin",t,e-6,f0+16,30,e+6,f0+196,200);m("plaster",r.plaster,-w0-110,p,0,-w0,y,70),L("plaster",r.plaster,-w0-110-u,y-p,w((u-w0-110)/2,(p+y)/2,.5)),m("plain",r.slate,-1700,y-26,380,900,y-14,400);for(let e of[-1300,-500,300])C("plain",r.slate,0,-50,0,26,100,w(e,y-70,390,0,.5),30,20);m("plain",r.ink,b.x0,p,b.z0,b.x1-20,p+60,b.z1),m("flute",r.teak,b.x0,p+60,b.z0,b.x1-10,b.top-20,b.z1),m("marble",r.marble,b.x0,b.top-20,b.z0,b.x1+6,b.top,b.z1+6),L("glazed",r.sage,b.z1,400,w(u+1,b.top+200,b.z1/2,Math.PI/2)),m("wood",r.oak,u,b.top+400,20,u+190,b.top+420,b.z1);{let e=b.top+420,t=u+95,n=v0(31),a=70,o=["cups","glasses","jars","plant","cups","teapot","glasses","jars","cups","plant","bags","cups"];for(let l of o){if(a>b.z1-80)break;if(l==="cups"){for(let s=0;s<3;s++)for(let f=0;f<3-s;f++)C("satin",s?r.cream:r.clay,t,e+s*34,a+f*54+s*27,24,32,null,21,18);a+=190}else if(l==="glasses"){for(let s=0;s<4;s++)J0(t,e,a+s*52,64);a+=230}else if(l==="jars"){for(let s=0;s<3;s++)Ae(t,e,a+s*78,90+30*n(),s%2?r.beans:[.85,.75,.55]);a+=250}else if(l==="plant")S0(t,e,a+30,i(1,0,.15),40+a,36,48),a+=150;else if(l==="teapot")R0("satin",r.clay,t,e+46,a+30,50,46,50),W("satin",r.clay,i(t,e+46,a+70),i(t+6,e+80,a+110),7),g0("satin",r.clay,24,5,w(t,e+56,a-18,Math.PI/2,0,-Math.PI/2),Math.PI,12),a+=150;else if(l==="bags"){for(let s=0;s<3;s++)$0(t,e,a+s*82,50,150-s*12,74,z0[s+1],C0[s],null,"x");a+=260}}}W("chrome",r.chrome,i(u+196,b.top+392,130),i(u+196,b.top+392,370),3.5);let At=["Tell me about your brand","I set up and run your channels","A monthly report on what worked"],Ge=[],Be=[];At.forEach((e,t)=>{let n=A(q0(240,360,(s,f,v)=>{s.fillStyle="#f3eee2",s.fillRect(0,0,f,v),s.fillStyle="rgba(0,0,0,0.06)";for(let g=110;g<v-20;g+=34)s.fillRect(18,g,f-36,2);s.fillStyle="#2a2622",s.font='700 64px "NJ Text", system-ui, sans-serif',s.fillText(String(t+1),22,76),s.font='500 30px "NJ Text", system-ui, sans-serif';let x="",T=136;for(let g of e.split(" ")){let P=x?x+" "+g:g;x&&s.measureText(P).width>f-44?(s.fillText(x,22,T),x=g,T+=34):x=P}s.fillText(x,22,T)}));Ge.push(n);let a=A(new i0({uniforms:{uMap:{value:n},uGain:{value:.78}},vertexShader:b0,fragmentShader:Yt,toneMapped:!1,side:le})),o=324-t*72,l=new O0;l.position.set(u+199,b.top+388,o),l.rotation.set(0,Math.PI/2+(t-1)*.06,(t-1)*.04,"YXZ"),l.add(new y0(A(new n0(64,96).translate(0,-48,0)),a)),k.add(l),Be.push(l),m("chrome",r.chrome,u+194,b.top+384,o-6,u+200,b.top+394,o+6)});let M={y:885,z:1300,w:1e3,h:714},s0=null,ne=A(q0(ue.w,ue.h,(e,t,n)=>{s0=xt(e,t,n)})),Ut=new FontFace("NJ Menu",`url(${new URL("../vendor/fonts/bricolage-grotesque-menu.woff2",new URL("../room/shell.js",import.meta.url).href).href})`,{weight:"400 700"});V.push(Ut.load().then(e=>{document.fonts.add(e),s0=xt(ne.image.getContext("2d"),ue.w,ue.h),ne.needsUpdate=!0},()=>{}));let jt=A(new i0({uniforms:{uMap:{value:ne},uGain:{value:.95}},vertexShader:b0,fragmentShader:eo,toneMapped:!1}));m("plain",r.slate,u+1,M.y-M.h/2-4,M.z-M.w/2-10,u+14,M.y+M.h/2+4,M.z+M.w/2+10),P0(new n0(M.w,M.h),jt,w(u+16,M.y,M.z,Math.PI/2));for(let e of[M.z-M.w/2-26,M.z+M.w/2+10])m("wood",r.oak,u+1,M.y-M.h/2-20,e,u+20,M.y+M.h/2+20,e+16);for(let e of[M.y-M.h/2-20,M.y+M.h/2+4])m("wood",r.oak,u+1,e,M.z-M.w/2-26,u+20,e+16,M.z+M.w/2+26);for(let e of[M.z-300,M.z+300])W("chrome",r.brass,i(u+20,M.y+M.h/2+30,e),i(u+110,M.y+M.h/2+70,e),4);C("chrome",r.brass,0,-380,0,16,760,w(u+112,M.y+M.h/2+70,M.z,0,Math.PI/2),16,16),m("emit",T0([1,.86,.62],2.4),u+104,M.y+M.h/2+56,M.z-370,u+120,M.y+M.h/2+58,M.z+370);let It=(e,t)=>i(u+16,M.y+M.h/2-t*M.h,M.z+M.w/2-e*M.w);for(let[e,t]of[[80,700],[1900,2360]]){for(let o of[700,960])m("wood",r.oak,u,o,e,u+170,o+20,t);let n=v0(e+9);S0(u+85,720,e+90,i(1,0,.1),e+1,40,56,r.terra);for(let o=0;o<4;o++)$0(u+85,720,e+210+o*82,56,140+20*n(),70,z0[(o+e)%z0.length],C0[o%C0.length],null,"x");S0(u+85,980,t-110,i(1,0,-.1),e+2,44,60,r.cream);let a=e+190;m("wood",r.walnut,u+14,980,a-78,u+160,1206,a+78),m("fabric",[.07,.07,.075],u+160,994,a-66,u+163,1192,a+66);for(let[o,l]of[[1150,17],[1060,46]])C("satin",[.03,.03,.035],0,-2,0,l,4,w(u+165,o,a,0,0,Math.PI/2),l*.8,24)}{let e=b.top,t=(b.x0+b.x1)/2;m("wood",r.walnut,t-140,e,200,t+120,e+80,580),m("plain",r.ink,t-140,e+4,200,t+120,e+12,580),C("chrome",[.4,.4,.42],t+96,e+80,230,12,10,null,12,16),C("chrome",[.4,.4,.42],t+96,e+80,270,12,10,null,12,16);let n={x:t-20,y:e+80,z:380};W("chrome",r.chrome,i(t+80,e+104,550),i(t-10,e+104,470),3.2),W("chrome",r.chrome,i(t-10,e+104,470),i(n.x+40,e+102,n.z+52),3),C("chrome",r.chrome,t+80,e+80,550,14,26,null,14,16),m("plain",r.ink,n.x+28,e+96,n.z+40,n.x+52,e+104,n.z+64),m("wood",r.oak,t-150,e,40,t+110,e+150,180);for(let o=0;o<14;o++)m("satin",z0[o%z0.length].map(l=>l*.8),t-140,e+10,52+o*9,t+100,e+170-o%3*6,58+o*9);m("satin",[.86,.5,.18],u+6,e,600,u+14,e+177,777),R0("satin",[.12,.1,.09],u+15,e+100,690,1,52,52,null,24),m("wood",r.walnut,t-70,e,600,t+70,e+14,1e3);for(let o of[610,990])m("wood",r.walnut,t-10,e+14,o-8,t+10,e+190,o+8);m("wood",r.walnut,t-56,e+190,600,t+56,e+204,1e3);for(let o of[700,880])m("plain",r.ink,t-44,e+14,o-44,t+44,e+26,o+44),q("glass",r.clear,[[0,0],[40,0],[44,56],[34,92],[28,98],[0,98]],t,e+26,o),C("plain",r.coffee,t,e+28,o,38,34,null,42,20),q("satin",r.cream,[[0,0],[16,0],[56,66],[60,72],[56,72],[14,6],[0,6]],t,e+196,o);xe(t+70,e,1045,r.ink,null,0),m("brushed",r.stainless,t-150,e,1110,t-30,e+400,1290),m("brushed",r.stainless,t-30,e+250,1120,t+100,e+330,1280),m("plain",r.ink,t-20,e+236,1150,t+70,e+250,1250),m("brushed",r.stainless,t-30,e,1120,t+100,e+14,1280),m("emit",T0([.25,.5,.42],2),t+100,e+296,1180,t+102,e+316,1220),q("glass",r.clear,[[0,0],[54,0],[58,64],[36,110],[32,120],[0,120]],t+34,e+14,1200),C("plain",r.coffee,t+34,e+16,1200,52,54,null,56,20),C("brushed",r.stainless,t-20,e,1420,74,250,null,70,28),C("satin",r.ink,t-20,e+250,1420,50,30,null,30,20),W("chrome",r.chrome,i(t+60,e,1580),i(t+60,e+260,1580),4),g0("chrome",r.chrome,44,3,w(t+20,e+260,1580,0,Math.PI/2)),W("chrome",r.chrome,i(t+60,e+260,1580),i(t+64,e+260,1580),4),q("thru",[.78,.56,.36],[[2,0],[10,0],[40,110],[44,116],[0,116]],t+20,e+150,1580),C("brushed",r.stainless,t+20,e,1580,54,90,null,52,24),m("satin",r.ink,t-45,e,1700,t+45,e+110,1790),q("glass",r.clear,[[0,0],[40,0],[52,150],[50,160],[0,160]],t,e+110,1745),[[.5,.16,.06],[.75,.45,.12],[.2,.32,.12],[.62,.1,.12],[.85,.7,.45]].forEach((o,l)=>{q("satin",o,[[0,0],[20,0],[20,120],[9,140],[8,170],[0,170]],t+60,e,1840+l*44,null,16),C("plain",r.ink,t+60,e+170,1840+l*44,9,10,null,9,10)});for(let o=0;o<2;o++)C("satin",[.92,.9,.84],t-60,e,1880+o*70,22,150,null,27,18)}{let{x0:e,x1:t,z0:n,z1:a,top:o}=r0,l=16;m("satin",r.ink,e,p,n,t,p+90,a),m("satin",r.ink,e,o-70,n,t,o,a),m("satin",r.ink,e,p+90,n,t,o-70,n+l),m("satin",r.ink,e,p+90,a-l,t,o-70,a),L("emit",T0([.96,1,1.04],1.35),a-n-2*l,o-70-p-90,w(e+4,(o-70+p+90)/2,(n+a)/2,Math.PI/2));let s=[[.3,.14,.05],[.95,.42,.1],[.92,.9,.85],[.25,.4,.15],[.62,.32,.1]];for(let f=0;f<4;f++){let v=p+100+f*245;m("plain",[.25,.26,.27],e+4,v,n+l,t-24,v+4,a-l);for(let x=0;x<6;x++){let T=s[(f*2+x)%s.length],g=n+44+x*38;q("satin",T,[[0,0],[15,0],[15,110],[7,140],[7,160],[0,160]],t-120,v+4,g,null,14),q("satin",s[(f+x+2)%5],[[0,0],[15,0],[15,110],[7,140],[7,160],[0,160]],t-70,v+4,g+18,null,14)}}L("glass",r.clear,a-n-2*l,o-70-p-90,w(t-6,(o-70+p+90)/2,(n+a)/2,Math.PI/2)),m("chrome",r.chrome,t-4,p+200,a-40,t+14,o-200,a-30),m("emit",T0([.95,.92,.85],1.8),t-1,o-50,n+30,t+1,o-20,a-30)}m("plain",r.ink,d.x0+20,p,d.z0+20,d.x1-20,p+50,d.z1-20),m("flute",r.oak,d.x0+10,p+50,d.z0+10,d.x1-10,d.top-20,d.z1-10),m("marble",r.marble,d.x0-6,d.top-20,d.z0,d.x1+12,d.top,d.z1);{let o=d.top;m("chrome",r.chrome,-1490,o,1300,-1205,o+18,1720),m("satin",r.mint,-1480,o+18,1310,-1215,o+240,1710),m("chrome",r.chrome,-1484,o+240,1306,-1211,o+250,1714);for(let l of[1308,1712])m("chrome",r.chrome,-1480,o+250,l-3,-1215,o+272,l+3);m("brushed",r.stainless,-1215,o+40,1336,-1211,o+222,1684);for(let l of[3020/2-1.5])m("satin",[.3,.31,.32],-1211,o+40,l,-1210,o+222,l+3);R0("satin",r.ink,-1210,o+150,3020/2,1.5,20,64,null,24),m("satin",[.85,.78,.6],-1215+6.5,o+147,3020/2-36,-1208,o+153,3020/2+36);for(let l=0;l<2;l++)for(let s=0;s<5;s++)C("satin",s%3===1?r.clay:r.cream,-1410+l*120,o+250,1360+s*(300/4),26,34,null,21,18);for(let l of[1310+400*.32,1310+400*.68])m("chrome",r.chrome,-1530,o+120,l-46,-1480,o+196,l+46),C("chrome",r.chrome,-1510,o+92,l,34,28),C("chrome",r.chrome,-1510,o+70,l,32,22),m("plain",r.ink,-1630,o+74,l-10,-1530,o+90,l+10),C("satin",r.cream,-1510,o+18,l,26,36,null,24,18),C("satin",r.cream,0,-2,0,18,4,w(-1481,o+206,l,0,0,Math.PI/2),18,20);m("chrome",r.chrome,-1560,o,1340,-1480,o+16,1680);for(let l of[1335,1685])W("chrome",r.chrome,i(-1490,o+200,l),i(-1550,o+40,l),5);for(let[l,s]of[[0,0],[-6,44]])q("chrome",r.stainless,[[0,0],[30,0],[30,50],[24,66],[27,72],[0,70]],-1525+l,o,1730+s,null,20);m("satin",r.ink,-1470,o,1215,-1395,o+70,1285)}{let e=d.top;for(let[n,a]of[[1150,r.ink],[1010,[.86,.84,.8]]])m("satin",a,-1475,e,n-50,-1365,e+210,n+50),m("satin",a,-1508,e+70,n-22,-1475,e+120,n+22),C("chrome",r.chrome,-1420,e+210,n,50,26,null,46),C("satin",r.beans,-1420,e+236,n,32,78,null,52),C("glass",r.clear,-1420,e+236,n,36,120,null,64),C("satin",r.ink,-1420,e+356,n,64,10);de(-1250,e,815),de(-1250,e,905),J0(-1325,e,860,80,[.62,.42,.26]),q("satin",r.cream,[[0,0],[22,0],[26,30],[12,70],[10,92],[13,96],[0,96]],-1230,e,1050,null,20);let t=v0(77);for(let n=0;n<3;n++){let a=i(-1230+(t()-.5)*40,e+170+t()*50,1050+(t()-.5)*50);Y0(i(-1230,e+90,1050),a,1.6),k0(7,[.95,.62,.66],a.clone().add(i(0,-18,0)),i(.6,.5,t()-.5),40,40,0,0),k0(1,A0(r.leafP,t),i(-1230,e+120+n*16,1050),i(t()-.5,.4,t()-.5),22,26,.1,0)}}{let o=d.top,l=210;m("wood",r.oak,-1470,o,1800,-1192,o+16,2090),L("glass",r.clear,290,l,w(-1192,o+16+l/2,3890/2,Math.PI/2)),L("glass",r.clear,278,l,w(-2662/2,o+16+l/2,1800,Math.PI)),L("glass",r.clear,278,l,w(-2662/2,o+16+l/2,2090)),L("glass",r.clear,278,290,w(-2662/2,o+16+l,3890/2,0,-Math.PI/2)),L("glass",r.clear,278,290,w(-2662/2,o+16+l*.5,3890/2,0,-Math.PI/2));for(let[s,f]of[[-1192,1800],[-1192,2090],[-1470,1800],[-1470,2090]])m("chrome",r.brass,s-3,o+16,f-3,s+3,o+16+l,f+3);for(let s=0;s<4;s++)g0("satin",r.crust,26,14,w(-1380+s%2*90,o+30,1860+s*58,s*.7,-Math.PI/2),Math.PI*1.25,14);C("satin",[.94,.86,.72],-1360,o+16+l*.5,3890/2-40,62,52,null,62,32),C("satin",[.62,.32,.2],-1360,o+16+l*.5+52,3890/2-40,62,6,null,62,32);for(let s=0;s<5;s++)C("satin",[.7,.5,.3],-1260,o+16+l*.5+s*8,1900+s%2*6,26,7,null,26,18)}{let e=d.top,t=-1262,n=2200;C("chrome",r.ink,t,e,n,30,6),C("chrome",r.ink,t,e+6,n,8,70);let a=w(t+8,e+112,n,0,0,.55);m("satin",r.ink,-5,-56,-78,5,56,78,a),L("emit",r.screen,146,102,w(5.5,0,0,Math.PI/2,0,0,a)),m("satin",r.ink,-1250,e,2105,-1200,e+14,2150),J0(-1215,e,2270,74)}for(let e of J){W("plain",r.ink,i(e.x,e.y+80,e.z),i(e.x,y,e.z),2.5),q("satin",r.enamel,[[100,0],[96,24],[72,64],[30,86],[12,94],[0,96]],e.x,e.y-10,e.z,null,32),q("emit",T0([.95,.82,.62],1.7),[[0,92],[12,90],[30,82],[72,60],[94,22],[98,0]],e.x,e.y-10,e.z,null,32),R0("glass",[.95,.85,.7],e.x,e.y+6,e.z,30,36,30,null,20);for(let t=0;t<5;t++){let n=t/5*6.283;W("emit",T0([1,.7,.34],6),i(e.x+Math.cos(n)*5,e.y-10,e.z+Math.sin(n)*5),i(e.x+Math.cos(n)*11,e.y+22,e.z+Math.sin(n)*11),1.6,null,5)}R0("emit",T0([1,.82,.55],4.5),e.x,e.y+4,e.z,9,14,9,null,10)}{let{x0:e,x1:t,d:n,top:a}=_,o=[0,1,2,3].map(f=>e+(t-e)*f/3);for(let f of o)for(let v of[14,n-14])m("satin",r.steel,f-7,p,v-7,f+7,a,v+7);let l=[-560,-300,-40,220,480,a-22];for(let f of l)m("wood",r.oak,e-12,f,0,t+12,f+22,n);let s=v0(53);for(let f=0;f<l.length-1;f++){let v=l[f]+22;for(let x=0;x<3;x++){let T=o[x]+24,g=o[x+1]-24,P=n/2+10,U=x===0?["stock","cups","stock","jars","stock"][f]:["bags","mugs","bags","bags","kettles"][(f+x)%5];if(U==="stock")for(let S=T;S<g-90;S+=104)m("plain",f%2?[.62,.5,.36]:[.92,.9,.86],S,v,P-80,S+92,v+120+40*s(),P+70);else if(U==="cups")for(let S=T+30;S<g-20;S+=62)C("satin",[.92,.9,.84],S,v,P,24,170,null,28,16);else if(U==="jars")for(let S=T+40;S<g-30;S+=84)Ae(S,v,P,110+40*s(),s()<.5?r.beans:[.85,.75,.55]);else if(U==="bags")for(let S=T+34;S<g-30;S+=74)$0(S,v,P+20,60,130+40*s(),60,z0[s()*z0.length|0],C0[s()*C0.length|0]);else if(U==="mugs"){let S=f;for(let B=T+34;B<g-30;B+=70)he(B,v,P+40,[r.cream,r.sage,r.clay,r.terra][S++%4],null,28,52,!1)}else U==="kettles"&&(xe(T+70,v,P+10,r.stainless),xe(g-90,v,P+10,[.9,.88,.82]))}}S0(e+140,a,n/2,i(0,0,1),61,44,60,r.terra),S0(t-160,a,n/2,i(.2,0,1),62,40,56,r.cream),$0(-1500,a,n/2,60,160,64,z0[2],C0[1]),$0(-1420,a,n/2,60,150,64,z0[4],C0[0])}K0(-1e3,p,430,105,230,r.cream),Mt(-1e3,p+200,430,860,91,.3*Math.PI,1.65*Math.PI,34),m("flute",r.oak,h-140,p,240,h,R.y0-22,1190),m("wood",r.oak,h-150,R.y0-22,230,h+4,R.y0,1200),m("fabric",r.oat,h-140,R.y0,250,h-6,R.y0+34,1180),Fe("fabric",r.rust,150,140,46,w(h-40,R.y0+104,340,-Math.PI/2,-.22,0)),Fe("fabric",r.olive,136,128,42,w(h-42,R.y0+98,1085,-Math.PI/2+.2,-.26,0)),m("wood",r.walnut,h-120,R.y0+34,610,h-20,R.y0+42,760),de(h-70,R.y0+42,680,null,r.sage),K0(h-60,R.y0+34,1162,38,70,r.cream),Rt(h-60,R.y0+92,1162,230,7,17,.08);{let{x0:e,x1:t,z0:n,z1:a,top:o}=O;m("wood",r.oak,e,o-32,n,t,o,a),m("wood",r.oak,e+36,o-86,n+36,t-36,o-32,a-36);for(let l of[e+34,t-34])for(let s of[n+34,a-34])m("wood",r.oak,l-22,p,s-22,l+22,o-32,s+22)}function _e(e,t,n){let a=w(e,p,t,n),o=254,l=r.bentwood;C("cane",r.cane,0,o-14,0,106,14,a,106,28),g0("wood",l,106,7,w(0,o-10,0,0,Math.PI/2,0,a),Math.PI*2,40);for(let[s,f]of[[[60,o-18,60],[80,0,82]],[[60,o-18,-60],[80,0,-82]],[[-64,o-18,60],[-90,0,84]],[[-64,o-18,-60],[-90,0,-84]]])W("wood",l,i(...s),i(...f),9,a);g0("wood",l,74,5,w(-4,116,0,0,Math.PI/2,0,a),Math.PI*2,32);for(let s of[-1,1])W("wood",l,i(-70,o-8,s*70),i(-98,o+230,s*68),8,a);g0("wood",l,68,8,w(-98,o+230,0,Math.PI/2,0,0,a),Math.PI,24),g0("wood",l,46,5,w(-90,o+196,0,Math.PI/2,0,0,a),Math.PI,20)}_e(560,1700,-.18),_e(630,1430,.06);let E0=A(q0(900,576,(e,t,n)=>gt(e,t,n)));E0.generateMipmaps=!1,E0.minFilter=se;let ye=A(new N0(640,400,{type:j0,samples:2,depthBuffer:!0})),be=new ot(2*Math.atan(470/2556)*180/Math.PI,640/400,100,2556*2);be.position.set(0,0,2556),be.updateMatrixWorld();let $e=A(new i0({uniforms:{uWall:{value:ye.texture},uTerm:{value:E0},uHasWall:{value:0},uGain:{value:.92}},vertexShader:b0,fragmentShader:Kt,toneMapped:!1})),ze=!0,De=Q0,Le=!0,Gt=0;{let e=O.top,t=w(860,e,1640,.22);m("satin",[.64,.65,.67],-62,0,-88,62,8,88,t),m("plain",r.ink,-12,8,-76,50,8.6,76,t),m("satin",[.55,.56,.58],-56,8,-32,-20,8.4,32,t);let n=w(62,8,0,0,0,-.26,t);m("satin",[.64,.65,.67],-5,0,-88,0,124,88,n),m("plain",r.ink,-5.6,2,-86,-5,122,86,n),P0(new n0(162,104),$e,w(-5.8,63,0,-Math.PI/2,0,0,n));let a=905,o=1820;C("wood",r.teak,a,e,o,40,4,null,40,24),C("thru",r.tea,a,e+6,o,21,60,null,24,24),C("thru",r.milk,a,e+66,o,24,9,null,24.5,24);for(let[s,f,v]of[[-8,5,66],[9,-6,70],[2,10,75]])m("glass",[.9,.95,1],a+s-8,e+v,o+f-8,a+s+8,e+v+14,o+f+8);q("glass",r.clear,[[0,0],[22,0],[24,4],[27,92],[25.5,92],[22.5,6],[0,6]],a,e+4,o,null,28),W("satin",[.95,.95,.92],i(a+6,e+30,o-4),i(a+22,e+136,o-14),3.2),P0(new n0(130,88),A(new i0({uniforms:{uGain:{value:.22}},vertexShader:b0,fragmentShader:Jt,transparent:!0,depthWrite:!1,blending:Ve,toneMapped:!1})),w(a-58,e+.8,o+6,0,-Math.PI/2));let l=w(800,e,1430,-.3);m("plain",[.55,.42,.28],-42,0,-60,42,7,60,l),m("plain",r.cream,-40,7,-58,40,7.5,58,l),W("satin",r.ink,i(-30,10,40),i(30,10,-20),3,l),m("satin",r.ink,-20,0,-42,20,5,42,w(760,e,1840,.5)),Ce(790,e,2e3),he(790,e+4,2e3,r.cream,null,20,30),q("glass",r.clear,[[0,0],[40,0],[44,60],[30,120],[18,150],[20,160],[0,160]],1050,e,1300,null,24),C("glass",[.7,.85,.9],1050,e+4,1300,38,90,null,34,20),J0(990,e,1270,64),S0(1075,e,2010,i(1,0,0),71,34,46,r.terra,80)}W("plain",r.ink,i($.x,$.y+60,$.z),i($.x,y,$.z),2.5),R0("emit",T0([1,.88,.7],1.45),$.x,$.y,$.z,64,60,64,null,24);{let e=i(1060,620,1470);for(let t=0;t<3;t++){let n=t*2.094;W("plain",[.6,.52,.4],i(e.x+Math.cos(n)*44,e.y+60,e.z+Math.sin(n)*44),i(e.x,y-200,e.z),1.5)}W("plain",[.6,.52,.4],i(e.x,y-200,e.z),i(e.x,y,e.z),2),S0(e.x,e.y,e.z,i(-1,0,0),81,52,64,r.cream,0),Z0(i(e.x-20,e.y+58,e.z+40),i(-.5,0,.86),280,83,38),Z0(i(e.x+10,e.y+58,e.z-46),i(-.3,0,-.95),220,84,36)}m("wood",r.walnut,h-14,160,1640,h,580,1980),m("plain",[.92,.88,.8],h-15,182,1662,h-13,558,1958),m("plain",[.82,.48,.22],h-16,260,1720,h-15,480,1900),R0("plain",[.18,.3,.42],h-16.5,340,1810,1,70,70,null,24);let We=new F0(150,150,4,64);K("satin",We,null,[.035,.035,.04]),x0.get("satin").pop();let Ne=new F0(50,50,4.6,32).translate(0,0,0);K("plain",Ne,null,[.86,.5,.18]),x0.get("plain").pop();let L0=new O0;L0.position.set(-2260,Y.backTop+82,380);let Bt=new y0(A(We),_0.satin),_t=new y0(A(Ne),_0.plain);L0.add(Bt,_t);for(let e=0;e<3;e++){let t=new G0(12,1,2).translate(26,2.6,0).rotateY(e*2.1);K("plain",t,null,[.95,.9,.8]),x0.get("plain").pop(),L0.add(new y0(A(t),_0.plain))}k.add(L0);let U0=(e,t,n,a,o,l=.3)=>L("contact",[l,0,0],a*2,o*2,w(e,t+.6,n,0,-Math.PI/2));{let e=O.top,t=Y.top,n=Y.backTop;for(let[a,o,l,s,f]of[[860,1640,80,105,.32],[905,1820,34,34,.38],[800,1430,50,66,.24],[760,1840,26,48,.28],[790,2e3,46,46,.3],[1050,1300,50,50,.34],[990,1270,28,28,.3],[1075,2010,42,42,.34]])U0(a,e,o,l,s,f);for(let[a,o]of[[560,1700],[630,1430]])U0(a,p,o,125,125,.32);for(let a of[O.x0+34,O.x1-34])for(let o of[O.z0+34,O.z1-34])U0(a,p,o,46,46,.3);U0(-1e3,p,430,135,135,.4);for(let[a,o,l,s,f]of[[-1347,1510,165,225,.28],[-1420,1150,70,66,.34],[-1420,1010,70,66,.34],[-1330,1945,150,160,.22],[-1262,2200,36,36,.36],[-1250,815,46,46,.3],[-1250,905,46,46,.3],[-1325,860,30,30,.3],[-1230,1050,30,30,.34]])U0(a,t,o,l,s,f);for(let[a,o,l,s]of[[-2250,390,150,200],[-2245,1190,140,110],[-2260,1420,80,80],[-2240,1745,56,56]])U0(a,n,o,l,s,.26)}for(let[e,t]of x0){let n=A(uo(t));for(let o of t)o.dispose();let a=new y0(n,_0[e]);e==="emit"&&ge.push(a),e==="glass"&&(a.renderOrder=2),e==="contact"&&(a.renderOrder=1),k.add(a)}x0.clear();let re=new O0;re.position.set(-450,y-160,1450),k.add(re);let we=(e,t,n)=>{K(e,t,null,n),x0.clear();let a=new y0(A(t),_0[e]);return re.add(a),a};we("plain",new F0(4,4,160,8).translate(0,80,0),r.slate),we("plain",new F0(40,46,40,24),r.slate);for(let e=0;e<4;e++)we("wood",new G0(320,6,70).translate(190,-10,0).rotateY(-e*Math.PI/2),r.teak);let W0=io(c);G.push(W0);let Ee=A(new nt(h0.size,{type:j0,generateMipmaps:!1})),Te=new at(20,4e4,Ee);Te.position.set(h0.x,h0.y,h0.z);let Me=null;function $t(e){let t=new pt(c),n=new Pe,a=c.getClearAlpha();c.getClearColor(n),c.setClearColor(0,1),Te.update(c,z);let o=t.fromCubemap(Ee.texture),l=[...ge,...e];for(let f of l)f.visible=!1;Te.update(c,z);let s=t.fromCubemap(Ee.texture);for(let f of l)f.visible=!0;c.setClearColor(n,a),t.dispose(),Me=[o,s],X.uProbe.value=o.texture,X.uProbeD.value=s.texture,X.uHasProbe.value=1}let Dt=[Se,ne,E0,te,...Ge];return{group:k,fan:re,finish:W0,get orderCorners(){return s0?[[s0.x0,s0.y0],[s0.x1,s0.y0],[s0.x1,s0.y1],[s0.x0,s0.y1]].map(([e,t])=>It(e,t)):null},tick(e){L0.rotation.y=-e*(100/3)/60*Math.PI*2,++Gt%2===0&&(ze=!0);let t=Q0/16+7,n=e%t,a=Math.min(Q0,Math.floor(n*16)),o=a<Q0||Math.floor(n*2)%2===0;return(a!==De||o!==Le)&&(De=a,Le=o,gt(E0.image.getContext("2d"),E0.image.width,E0.image.height,a,o),E0.needsUpdate=!0),Be.forEach((l,s)=>{l.rotation.x=.05+.035*Math.sin(e*1.27+s*1.9)+.02*Math.sin(e*3.1+s*.7)}),!0},render(e,t,n,a){if(a&&ze){ze=!1,k.visible=!1;let o=c.getRenderTarget();c.setRenderTarget(ye),c.render(e,be),c.setRenderTarget(o),k.visible=!0,$e.uniforms.uHasWall.value=1}W0.render(e,t,n)},async warm(e,t=[],n=[]){k.visible=!0;for(let l of t)l.visible=!0;let a=c.getRenderTarget();c.setRenderTarget(W0.target);let o=c.compileAsync?c.compileAsync(z,e):(c.compile(z,e),null);c.setRenderTarget(a),k.visible=!1;for(let l of t)l.visible=!1;o&&await o,await Promise.allSettled(V);for(let l of[...Dt,...n])c.initTexture(l);if(W0.compile(),u0.bake(),!Me){k.visible=!0;for(let l of t)l.visible=!0;$t(t),k.visible=!1;for(let l of t)l.visible=!1}c.setRenderTarget(ye),c.clear(),c.setRenderTarget(a)},bake(){u0.bake()},setVisible(e){k.visible!==e&&(k.visible=e,e&&u0.bake())},dispose(){z.remove(k),u0.dispose();for(let e of G)e.dispose?.();for(let e of Me||[])e.dispose()}}}export{xo as createShell};
