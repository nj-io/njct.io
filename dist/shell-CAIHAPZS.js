import{a as nt}from"./chunk-FVH4X2O7.js";import"./chunk-3RFTAFDB.js";import{c as lt}from"./chunk-4VAF4GAZ.js";import{j as v0}from"./chunk-XMR7AKKY.js";import{$ as tt,B as be,C as qe,E as Qe,G as P0,J as N0,K as ie,L as g0,M as j0,N as i0,O as Xe,P as Ye,Q as O0,R as Ke,V as Ze,W as H0,X as Je,Z as et,_ as n0,aa as ot,b as le,ba as at,c as Le,d as _e,e as De,f as $e,g as Be,j as re,n as B0,q as We,r as Ne,t as Oe,u as se,v as Ve,w as m0,y as I0,z as W0}from"./chunk-X52R7RES.js";var X=v0.room,e0=v0.shelving,Q=v0.counter,O=v0.table,w=v0.window,R=v0.shopfront,rt=4,Q0=14,ue=`vec3(${X.front.toFixed(1)}, ${((w.y0+w.y1)/2).toFixed(1)}, ${((w.z0+w.z1)/2).toFixed(1)})`,fe=`
uniform vec3 uWinQ[4];       // the shopfront's opening (light from the sky and the street)
uniform vec3 uPatchQ[4];     // the sunlit patch on the record wall (warm bounce)
uniform vec3 uWallQ[4];      // the lit record wall around the shelves (neutral bounce)
uniform vec3 uSkyCol, uPatchCol, uWallCol;
uniform vec4 uLampP[${rt}];   // xyz, and w: 1 for a shade that sends its light down, 0 for a globe
uniform vec3 uLampCol;
uniform float uAmbient;
uniform vec4 uOcc[${Q0}];      // boxes that shade what is near them: centre xz, half size xz (y below uOccTop)
uniform float uOccTop[${Q0}];
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
  vec4 d = vec4(p.x - ${X.back.toFixed(1)}, ${X.front.toFixed(1)} - p.x, p.z, ${X.depth.toFixed(1)} - p.z);
  float dy0 = p.y - ${X.floor.toFixed(1)}, dy1 = ${X.ceiling.toFixed(1)} - p.y;
  // a corner darkens along both walls; a surface does not darken itself
  if (abs(n.y) > 0.5) { ao *= (1.0 - 0.34 * exp(-max(d.x, 0.0) / 160.0)) * (1.0 - 0.3 * exp(-max(d.y, 0.0) / 160.0)) * (1.0 - 0.34 * exp(-max(d.z, 0.0) / 160.0)) * (1.0 - 0.3 * exp(-max(d.w, 0.0) / 160.0)); }
  else {
    ao *= (1.0 - 0.3 * exp(-max(dy0, 0.0) / 150.0)) * (1.0 - 0.22 * exp(-max(dy1, 0.0) / 190.0));
    if (abs(n.x) > 0.5) ao *= (1.0 - 0.3 * exp(-max(d.z, 0.0) / 140.0)) * (1.0 - 0.26 * exp(-max(d.w, 0.0) / 140.0));
    else ao *= (1.0 - 0.3 * exp(-max(d.x, 0.0) / 140.0)) * (1.0 - 0.26 * exp(-max(d.y, 0.0) / 140.0));
  }
  if (n.y > 0.5) {                 // contact shadows fall on what faces up: the floor, a counter, a table top
    for (int i = 0; i < ${Q0}; i++) {
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
  for (int i = 0; i < ${rt}; i++) {
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
`,y0=`
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
}`,Ft=`
uniform int uKind;
uniform float uGloss;
varying vec3 vP;
varying vec3 vN;
varying vec3 vCol;
${fe}
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
      if (n.x > 0.5 && p.x > ${(Q.x1-30).toFixed(1)} && p.z > ${Q.z0.toFixed(1)} && p.z < ${Q.z1.toFixed(1)}) {
        float wear = smoothstep(${(Q.top-150).toFixed(1)}, ${(Q.top-25).toFixed(1)}, p.y) * (0.55 + 0.45 * njNoise2(p.zy / vec2(90.0, 24.0)));
        c = mix(c, c * 1.18 + 0.03, wear * 0.55);
      }
    }
  } else if (uKind == 3) {
    c *= 0.95 + 0.07 * njNoise2(p.xy / 60.0 + p.zz / 60.0) + 0.03 * njNoise2(p.xy / 9.0 + p.zx / 9.0);
  } else if (uKind == 4) {
    float v = njNoise2(p.xz / 55.0 + p.yy / 55.0 + 3.0 * njNoise2(p.xz / 160.0));
    c *= 0.94 + 0.08 * smoothstep(0.45, 0.55, v) - 0.16 * smoothstep(0.495, 0.5, v) * smoothstep(0.505, 0.5, v);
    // the island's front edge: years of cups and elbows, faintly grey and rubbed
    float edge = smoothstep(${(Q.x1-40).toFixed(1)}, ${(Q.x1+12).toFixed(1)}, p.x) * step(${Q.z0.toFixed(1)}, p.z) * step(p.z, ${Q.z1.toFixed(1)}) * step(${(Q.top-30).toFixed(1)}, p.y);
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
  vec3 col = albedo(vP, n) * e;
  // a soft sheen on gloss: the window seen in it
  if (uGloss > 0.0) {
    vec3 v = normalize(vP - cameraPosition), r = reflect(v, n);
    vec3 w = ${ue} - vP;
    col += uGloss * uSkyCol * pow(max(dot(r, normalize(w)), 0.0), 18.0) * njAO(vP, n);
  }
  gl_FragColor = vec4(njShoulder(col), 1.0);
  #include <colorspace_fragment>
}`,Ct=`
uniform sampler2D uWallBake;
uniform vec4 uWallRegion;    // the bake's world x0, y0, x1, y1
uniform vec3 uOak;
varying vec3 vP;
varying vec3 vN;
${fe}
vec3 spineCol(float h) {
  float k = fract(h * 7.13);
  vec3 c = k < 0.22 ? vec3(0.05, 0.05, 0.06) : k < 0.38 ? vec3(0.86, 0.83, 0.76) : k < 0.5 ? vec3(0.62, 0.13, 0.1)
         : k < 0.6 ? vec3(0.12, 0.2, 0.42) : k < 0.7 ? vec3(0.82, 0.52, 0.14) : k < 0.78 ? vec3(0.16, 0.34, 0.24)
         : k < 0.88 ? vec3(0.42, 0.4, 0.38) : vec3(0.58, 0.32, 0.22);
  return c * (0.75 + 0.4 * fract(h * 3.7));
}
void main() {
  const float CUB = ${e0.cubby.toFixed(1)}, FR = ${e0.frame.toFixed(1)}, DEP = ${e0.depth.toFixed(1)};
  vec3 p = vP, v = normalize(vP - cameraPosition);
  vec2 cell = floor((p.xy - vec2(${X.back.toFixed(1)}, ${X.floor.toFixed(1)})) / CUB);
  vec2 o = vec2(${X.back.toFixed(1)}, ${X.floor.toFixed(1)}) + cell * CUB;
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
}`,At=`
uniform sampler2D uLeafSun;
uniform vec3 uSunU, uSunV;
uniform vec4 uMask;
uniform float uHasLeaves;
varying vec3 vP;
varying vec3 vN;
void main() {
  vec3 v = normalize(vP - cameraPosition);
  float t = (${X.front.toFixed(1)} - cameraPosition.x) / v.x;
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
  gl_FragColor = vec4(col * ${(.97*v0.finish.outside).toFixed(3)}, 1.0);   // outside: brighter than the room
  #include <colorspace_fragment>
}`,It=`
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
  gl_FragColor = vec4(col * ${v0.finish.reeded.toFixed(3)}, 1.0);
  #include <colorspace_fragment>
}`,jt=`
uniform float uAlpha;
varying vec3 vP;
varying vec3 vN;
varying vec3 vCol;
${fe}
void main() {
  vec3 n = normalize(vN), v = normalize(vP - cameraPosition);
  if (dot(n, v) > 0.0) n = -n;
  float c = clamp(-dot(n, v), 0.0, 1.0), fr = 0.04 + 0.96 * pow(1.0 - c, 5.0);
  vec3 r = reflect(v, n);
  float spec = pow(max(dot(r, normalize(${ue} - vP)), 0.0), 40.0);
  vec3 env = mix(vec3(0.3, 0.27, 0.23), uSkyCol * 0.45, smoothstep(-0.2, 0.7, r.x));
  vec3 refl = env + uSkyCol * spec * 1.6;
  vec3 tint = vCol * njRoomLight(vP, n);
  float a = clamp(fr * 0.9 + uAlpha + spec * 0.5, 0.0, 0.94);
  gl_FragColor = vec4(njShoulder((refl * fr * 0.9 + refl * spec * 0.5 + tint * uAlpha) / max(a, 1e-3)), a);
  #include <colorspace_fragment>
}`,Gt=`
uniform sampler2D uAtlas;
varying vec3 vP;
varying vec3 vN;
varying vec3 vCol;
varying vec2 vUv;
${fe}
void main() {
  vec4 t = texture2D(uAtlas, vUv);
  if (t.a < 0.2) discard;
  float cover = clamp((t.a - 0.5) / max(fwidth(t.a), 1e-3) + 0.5, 0.0, 1.0);
  vec3 n = normalize(vN) * (gl_FrontFacing ? 1.0 : -1.0);
  vec3 c = vCol * t.rgb;
  vec3 col = c * (njRoomLight(vP, n) + njBackLight(vP, -n) * 0.45 * vec3(0.85, 1.0, 0.45));
  vec3 v = normalize(vP - cameraPosition), r = reflect(v, n);
  col += 0.07 * uSkyCol * pow(max(dot(r, normalize(${ue} - vP)), 0.0), 10.0);
  gl_FragColor = vec4(njShoulder(col), cover);
  #include <colorspace_fragment>
}`,Ut=`
varying vec3 vCol;
varying vec2 vUv;
void main() {
  vec2 q = (vUv - 0.5) * 2.0;
  float d = dot(q, q), a = vCol.r * exp(-d * 2.6) * smoothstep(1.0, 0.55, d);
  gl_FragColor = vec4(vec3(1.0 - a), 1.0);
}`,Lt=`
varying vec3 vCol;
void main() { gl_FragColor = vec4(vCol, 1.0);
  #include <colorspace_fragment>
}`,_t=`
uniform sampler2D uMap;
uniform float uGain;
varying vec2 vUv;
void main() { gl_FragColor = vec4(texture2D(uMap, vUv).rgb * uGain, 1.0);
  #include <colorspace_fragment>
}`,Dt=`
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
  float win = pow(max(dot(r, normalize(${ue} - vP)), 0.0), 6.0);
  c = c * (1.0 - fr) + vec3(1.0, 0.95, 0.85) * (fr * 0.35 + win * 0.06);
  gl_FragColor = vec4(c, 1.0);
  #include <colorspace_fragment>
}`,$t=`
uniform sampler2D uMap;
varying vec2 vUv;
void main() {
  vec4 t = texture2D(uMap, vUv);
  if (t.a < 0.02) discard;
  gl_FragColor = vec4(t.rgb, t.a);
  #include <colorspace_fragment>
}`,Bt=`
uniform float uGain;
varying vec2 vUv;
void main() {
  vec2 q = (vUv - 0.5) * 2.0;
  float d = length(q * vec2(1.0, 1.35));
  float c = exp(-pow((d - 0.55) / 0.12, 2.0)) * 0.65 + exp(-d * d / 0.16) * 0.45;
  gl_FragColor = vec4(vec3(0.95, 0.46, 0.1) * c * smoothstep(1.0, 0.55, d) * uGain, 1.0);
}`,Wt=`
uniform sampler2D uMap;
uniform float uGain;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(uMap, vUv).rgb;
  float down = 1.0 - vUv.y, across = vUv.x - 0.5;
  float pool = exp(-down * down / 0.42) * (0.72 + 0.28 * exp(-across * across / 0.16));
  gl_FragColor = vec4(c * uGain * (0.5 + 0.62 * pool) * vec3(1.0, 0.97, 0.9), 1.0);
  #include <colorspace_fragment>
}`;function V0(u,E,$,P=Ne){let H=document.createElement("canvas");H.width=u,H.height=E,$(H.getContext("2d"),u,E);let U=new Ze(H);return U.colorSpace=P,U.anisotropy=4,U}function p0(u){return()=>{u|=0,u=u+1831565813|0;let E=Math.imul(u^u>>>15,1|u);return E=E+Math.imul(E^E>>>7,61|E)^E,((E^E>>>14)>>>0)/4294967296}}var ce={w:1400,h:1e3};function st(u,E,$){let P=p0(5);u.fillStyle="#1b1f1e",u.fillRect(0,0,E,$);for(let i=0;i<46;i++)u.fillStyle=`rgba(255,255,255,${.012+.022*P()})`,u.beginPath(),u.ellipse(P()*E,P()*$,60+180*P(),30+90*P(),P()*3,0,7),u.fill();let H=(i,F)=>`${i} ${F}px "NJ Menu", "NJ Text", system-ui, sans-serif`,U="rgba(244,240,230,0.96)",N="rgba(236,230,216,0.88)";u.textBaseline="alphabetic",u.fillStyle=U,u.font=H(700,80),u.fillText("Menu",84,124),u.fillRect(84,146,160,5);let A=(i,F,z,l0,G)=>{let h="",_=z;for(let D of i.split(" ")){let J=h?h+" "+D:D;h&&u.measureText(J).width>l0?(u.fillText(h,F,_),h=D,_+=G):h=J}return u.fillText(h,F,_),_},d=(i,F,z)=>(u.fillStyle=U,u.font=H(650,86),u.fillText(F,84,i),u.fillStyle=N,u.font=H(450,70),A(z,84,i+88,E-168,82)),c=d(290,"Cross-platform content","Video, images and posts made for each platform and published for you.");c=d(c+138,"Community management","Comments, messages and requests answered in your brand\u2019s voice."),u.fillStyle="rgba(240,196,120,0.98)",u.font=H(650,74);let v="\u2190 Order here",y=Math.min($-60,c+132),j=u.measureText(v).width;return u.fillText(v,84,y),{x0:70/E,x1:(98+j)/E,y0:(y-72)/$,y1:(y+22)/$}}var ct=[["#8be9a8","~/njct.io  feat/room"],["#d6d6d6","$ npm run build"],["#9a9a9a","  dist/ matches a fresh build (15 files)"],["#d6d6d6","$ git log --oneline -3"],["#e8c07a","  00c8874 Merge feat/editions into feat/room"],["#e8c07a","  d978d3b The caf\xE9, fixed after review"],["#e8c07a","  9245df6 Caf\xE9 brief: the garden"]],q0=ct.reduce((u,[,E])=>u+E.length,0);function it(u,E,$,P=q0,H=!0){u.clearRect(0,0,E,$);let U=E*.4,N=$*.34,A=E*.56,d=$*.6,c=14;u.fillStyle="rgba(0,0,0,0.25)",u.beginPath(),u.roundRect(U+8,N+14,A,d,c),u.fill(),u.fillStyle="rgba(23,24,27,0.97)",u.beginPath(),u.roundRect(U,N,A,d,c),u.fill(),u.fillStyle="#25262b",u.beginPath(),u.roundRect(U,N,A,30,[c,c,0,0]),u.fill(),["#ff5f57","#febc2e","#28c840"].forEach((i,F)=>{u.fillStyle=i,u.beginPath(),u.arc(U+20+F*20,N+15,6,0,7),u.fill()}),u.font="500 21px ui-monospace, Menlo, Consolas, monospace";let v=P,y=N+62,j=U+18;for(let[i,F]of ct){if(v<=0)break;let z=F.slice(0,v);if(u.fillStyle=i,u.fillText(z,j,y),v-=F.length,v<0){j+=u.measureText(z).width;break}y+=30,j=U+18}H&&(u.fillStyle="#d6d6d6",u.fillRect(v>=0?U+18:j+2,(v>=0,y-18),11,22))}var t0=v0.finish,T0=6,Nt="varying vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",Ot=`
uniform sampler2D uSrc, uBloom, uHalo;
uniform float uAmount, uGlow;
varying vec2 vUv;
// the highlights, from the knee toward 1: their hue kept while they are a little over, going white as they climb
float njRollOne(float x) { return x <= ${t0.knee.toFixed(3)} ? x : ${t0.knee.toFixed(3)} + ${(1-t0.knee).toFixed(3)} * (1.0 - exp(-(x - ${t0.knee.toFixed(3)}) / ${(1-t0.knee).toFixed(3)})); }
vec3 njRoll(vec3 c) {
  float pk = max(c.r, max(c.g, c.b));
  if (pk <= ${t0.knee.toFixed(3)}) return c;
  vec3 hue = c * (njRollOne(pk) / pk), each = vec3(njRollOne(c.r), njRollOne(c.g), njRollOne(c.b));
  return mix(hue, max(hue, each), smoothstep(1.3, 4.0, pk));
}
void main() {
  vec3 c = texture2D(uSrc, vUv).rgb, h = c;
  if (uGlow > 0.0) {
    vec3 b = texture2D(uBloom, vUv).rgb / ${T0.toFixed(1)}, f = texture2D(uHalo, vUv).rgb;
    h += uGlow * (${t0.bloom.toFixed(3)} * b + ${t0.halation.toFixed(3)} * vec3(1.0, 0.34, 0.12) * dot(f, vec3(0.3, 0.59, 0.11)));
  }
  vec3 g = njRoll(h) * vec3(1.07, 0.99, 0.86);
  g = mix(g, g * g * (3.0 - 2.0 * g), 0.18);                 // a little more contrast
  vec2 q = vUv - 0.5;
  g *= 1.0 - 0.22 * dot(q, q) * 2.2;                          // the corners fall off
  gl_FragColor = vec4(mix(c, g, uAmount), 1.0);
  #include <colorspace_fragment>
  gl_FragColor.rgb += (fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))) - 0.5) / 255.0;
}`,Vt=`
uniform sampler2D uSrc;
uniform vec2 uTexel;
varying vec2 vUv;
vec3 njOver(vec3 c) {
  float pk = max(c.r, max(c.g, c.b));
  float s = clamp(pk - ${(t0.threshold-t0.soft).toFixed(3)}, 0.0, ${(2*t0.soft).toFixed(3)});
  s = s * s / ${(4*t0.soft).toFixed(3)};
  return c * (max(s, pk - ${t0.threshold.toFixed(3)}) / max(pk, 1e-4));
}
void main() {
  vec3 a = njOver(texture2D(uSrc, vUv + uTexel * vec2(-1.0, -1.0)).rgb), b = njOver(texture2D(uSrc, vUv + uTexel * vec2(1.0, -1.0)).rgb);
  vec3 c = njOver(texture2D(uSrc, vUv + uTexel * vec2(-1.0, 1.0)).rgb), d = njOver(texture2D(uSrc, vUv + uTexel * vec2(1.0, 1.0)).rgb);
  vec4 w = 1.0 / (1.0 + vec4(max(a.r, max(a.g, a.b)), max(b.r, max(b.g, b.b)), max(c.r, max(c.g, c.b)), max(d.r, max(d.g, d.b))));
  gl_FragColor = vec4((a * w.x + b * w.y + c * w.z + d * w.w) / (w.x + w.y + w.z + w.w), 1.0);
}`,qt=`
uniform sampler2D uSrc;
uniform vec2 uTexel;
varying vec2 vUv;
void main() {
  vec3 s = texture2D(uSrc, vUv).rgb * 4.0;
  s += texture2D(uSrc, vUv + uTexel * vec2(-1.0, -1.0)).rgb + texture2D(uSrc, vUv + uTexel * vec2(1.0, -1.0)).rgb;
  s += texture2D(uSrc, vUv + uTexel * vec2(-1.0, 1.0)).rgb + texture2D(uSrc, vUv + uTexel * vec2(1.0, 1.0)).rgb;
  gl_FragColor = vec4(s / 8.0, 1.0);
}`,Qt=`
uniform sampler2D uSrc, uHere;
uniform vec2 uTexel;
varying vec2 vUv;
void main() {
  vec3 s = texture2D(uSrc, vUv + uTexel * vec2(-2.0, 0.0)).rgb + texture2D(uSrc, vUv + uTexel * vec2(2.0, 0.0)).rgb;
  s += texture2D(uSrc, vUv + uTexel * vec2(0.0, -2.0)).rgb + texture2D(uSrc, vUv + uTexel * vec2(0.0, 2.0)).rgb;
  s += 2.0 * (texture2D(uSrc, vUv + uTexel * vec2(-1.0, -1.0)).rgb + texture2D(uSrc, vUv + uTexel * vec2(1.0, -1.0)).rgb);
  s += 2.0 * (texture2D(uSrc, vUv + uTexel * vec2(-1.0, 1.0)).rgb + texture2D(uSrc, vUv + uTexel * vec2(1.0, 1.0)).rgb);
  gl_FragColor = vec4(s / 12.0 + texture2D(uHere, vUv).rgb, 1.0);
}`,Xt=1.5,Yt=4e6;function Kt(u){let E=new W0(4,4,{type:B0,samples:4,depthBuffer:!0}),$=()=>new W0(2,2,{type:B0,depthBuffer:!1,generateMipmaps:!1,minFilter:re,magFilter:re}),P=Array.from({length:T0},$),H=Array.from({length:T0-1},$),U=(h,_={})=>new i0({uniforms:{uSrc:{value:null},uTexel:{value:new se},..._},vertexShader:Nt,fragmentShader:h,depthTest:!1,depthWrite:!1,toneMapped:!1}),N=U(Vt),A=U(qt),d=U(Qt,{uHere:{value:null}}),c=U(Ot,{uBloom:{value:H[0].texture},uHalo:{value:P[1].texture},uAmount:{value:0},uGlow:{value:0}});c.uniforms.uSrc.value=E.texture;let v=new ie;v.setAttribute("position",new N0([-1,-1,0,3,-1,0,-1,3,0],3));let y=new g0(v,c);y.frustumCulled=!1;let j=new Ke,i=new Xe;j.add(y);let F=(h,_,D,J)=>{h.uniforms.uSrc.value=_.texture,h.uniforms.uTexel.value.set(1/_.width,1/_.height).multiplyScalar(D),y.material=h,u.setRenderTarget(J),u.render(j,i)},z=new se;function l0(){u.getDrawingBufferSize(z);let h=Math.min(1,Xt/Math.max(1,u.getPixelRatio())),_=Math.max(1,Math.round(z.x*h)),D=Math.max(1,Math.round(z.y*h)),J=_*D>Yt?2:4;E.samples!==J?(E.dispose(),E=new W0(_,D,{type:B0,samples:J,depthBuffer:!0}),c.uniforms.uSrc.value=E.texture):(E.width!==_||E.height!==D)&&E.setSize(_,D);let K=_,r0=D;for(let d0=0;d0<T0;d0++)K=Math.max(1,Math.ceil(K/2)),r0=Math.max(1,Math.ceil(r0/2)),(P[d0].width!==K||P[d0].height!==r0)&&(P[d0].setSize(K,r0),d0<T0-1&&H[d0].setSize(K,r0))}function G(){F(N,E,1,P[0]);for(let h=1;h<T0;h++)F(A,P[h-1],1,P[h]);for(let h=T0-2;h>=0;h--)d.uniforms.uHere.value=P[h].texture,F(d,h===T0-2?P[h+1]:H[h+1],.5,H[h])}return{get target(){return l0(),E},compile(){for(let h of[N,A,d])y.material=h,u.setRenderTarget(P[0]),u.compile(j,i);y.material=c,u.setRenderTarget(null),u.compile(j,i)},render(h,_,D){l0(),u.setRenderTarget(E),u.render(h,_);let J=D>.002?D:0;J&&G(),y.material=c,c.uniforms.uSrc.value=E.texture,c.uniforms.uAmount.value=D,c.uniforms.uGlow.value=J,u.setRenderTarget(null),u.render(j,i)},dispose(){E.dispose();for(let h of[...P,...H])h.dispose();for(let h of[c,N,A,d])h.dispose();v.dispose()}}}function Zt(u,E,$,P){let H=new j0(1,1,1,3,3,3),U=H.attributes.position,N=H.attributes.normal,A=[u/2,E/2,$/2],d=A.map(F=>Math.max(F-P,0)),c=new m0,v=new m0,y=new m0,j=Oe.clamp,i=(F,z)=>Math.abs(F)>.4?Math.sign(F)*A[z]:Math.sign(F)*d[z];for(let F=0;F<U.count;F++){c.set(i(U.getX(F),0),i(U.getY(F),1),i(U.getZ(F),2)),v.set(j(c.x,-d[0],d[0]),j(c.y,-d[1],d[1]),j(c.z,-d[2],d[2])),y.subVectors(c,v);let z=y.length();z>1e-6&&(y.multiplyScalar(P/z),c.copy(v).add(y),N.setXYZ(F,y.x/P,y.y/P,y.z/P)),U.setXYZ(F,c.x,c.y,c.z)}return H}function Jt(u){let E=0,$=0;for(let y of u)E+=y.attributes.position.count,$+=y.index?y.index.count:y.attributes.position.count;let P=new Float32Array(E*3),H=new Float32Array(E*3),U=new Float32Array(E*2),N=new Float32Array(E*3),A=E>65535?new Uint32Array($):new Uint16Array($),d=0,c=0;for(let y of u){let j=y.attributes,i=j.position.count;if(P.set(j.position.array.subarray(0,i*3),d*3),H.set(j.normal.array.subarray(0,i*3),d*3),j.uv&&U.set(j.uv.array.subarray(0,i*2),d*2),N.set(j.aCol.array,d*3),y.index){let F=y.index.array;for(let z=0;z<F.length;z++)A[c+z]=F[z]+d;c+=F.length}else{for(let F=0;F<i;F++)A[c+F]=d+F;c+=i}d+=i}let v=new ie;return v.setAttribute("position",new P0(P,3)),v.setAttribute("normal",new P0(H,3)),v.setAttribute("uv",new P0(U,2)),v.setAttribute("aCol",new P0(N,3)),v.setIndex(new P0(A,1)),v.computeBoundingSphere(),v}var l={plaster:[.8,.77,.72],ceiling:[.78,.76,.72],floor:[.76,.71,.62],dark:[.035,.032,.03],oak:[.62,.45,.28],teak:[.4,.25,.14],walnut:[.2,.12,.07],bentwood:[.13,.075,.045],steel:[.05,.07,.06],chrome:[.24,.25,.26],stainless:[.44,.45,.46],ink:[.045,.045,.05],brass:[.5,.36,.16],mint:[.36,.56,.46],cream:[.9,.87,.8],terra:[.56,.3,.2],clay:[.7,.5,.36],sage:[.28,.4,.32],marble:[.86,.85,.82],slate:[.09,.1,.1],enamel:[.12,.24,.2],glow:[1,.86,.62],screen:[.1,.12,.16],leafM:[.12,.33,.09],leafF:[.14,.34,.08],leafP:[.2,.42,.1],leafS:[.12,.27,.11],leafB:[.2,.4,.12],stem:[.22,.32,.1],bark:[.25,.18,.12],soil:[.1,.07,.045],beans:[.18,.1,.05],coffee:[.09,.045,.02],tea:[.95,.4,.09],milk:[.95,.9,.8],crust:[.72,.42,.15],cane:[.62,.46,.27],oat:[.74,.66,.54],rust:[.56,.24,.12],indigo:[.08,.12,.27],olive:[.3,.32,.16],clear:[.85,.9,.88]},E0=(u,E)=>u.map($=>$*E),z0=[[.62,.36,.22],[.85,.8,.7],[.16,.2,.19],[.72,.52,.3],[.3,.44,.4],[.82,.62,.48],[.14,.16,.28]],F0=[[.95,.92,.85],[.9,.55,.25],[.2,.2,.2],[.85,.75,.3]];function lo({renderer:u,scene:E,lightUniforms:$,sun:P}){let H=new O0;H.visible=!1,E.add(H);let U=[],N=[],A=e=>(U.push(e),e),{front:d,back:c,floor:v,ceiling:y,depth:j}=X,i=(e,t,n)=>new m0(e,t,n),F=i(0,1,0),z={x0:c,x1:c+Q.back,z0:0,z1:2050,top:Q.backTop},l0={x0:c,x1:c+300,z0:2065,z1:2345,top:560},G={z0:2440,z1:2740,spring:400},h=Q,_={x0:-2058,x1:-1065,d:240,top:760},D=i((O.x0+O.x1)/2,310,(O.z0+O.z1)/2+60),J=[i((h.x0+h.x1)/2,360,1080),i((h.x0+h.x1)/2,360,1960),i(c+250,470,620)],K={uWinQ:{value:[R.y0,R.y1].flatMap(e=>[R.z0,R.z1].map(t=>i(X.front,e,t)))},uPatchQ:{value:[0,1,2,3].map(()=>i(0,0,0))},uWallQ:{value:[i(-e0.niche.x,X.floor,0),i(e0.niche.x,X.floor,0),i(e0.niche.x,e0.niche.top,0),i(-e0.niche.x,e0.niche.top,0)]},uSkyCol:{value:i(2.3,2.38,2.55)},uPatchCol:{value:i(2.6,1.6,.78)},uWallCol:{value:i(.86,.82,.76)},uLampP:{value:[...J.map(e=>new I0(e.x,e.y,e.z,1)),new I0(D.x,D.y,D.z,0)]},uLampCol:{value:i(.95,.6,.28)},uAmbient:{value:.065},uOcc:{value:Array.from({length:Q0},()=>new I0(0,0,0,0))},uOccTop:{value:new Array(Q0).fill(-1e4)}},r0=K.uWinQ.value;[r0[2],r0[3]]=[r0[3],r0[2]];function d0(e,t,n){let a=0;for(let o=0;o<4;o++){let r=n[o].clone().sub(e).normalize(),s=n[(o+1)%4].clone().sub(e).normalize(),f=new m0().crossVectors(r,s);a+=Math.acos(Math.max(-1,Math.min(1,r.dot(s))))*t.dot(f)/Math.max(f.length(),1e-6)}return a/(2*Math.PI)}let me=(e,t,n)=>{d0(t,n,e)<0&&e.reverse()},ve=i(0,0,1400);if(me(r0,ve,i(1,0,0)),me(K.uWallQ.value,ve,i(0,0,-1)),P){let e=P.uniforms.uSunD.value;[[w.y0,w.z0],[w.y0,w.z1],[w.y1,w.z1],[w.y1,w.z0]].map(([n,a])=>i(X.front,n,a)).forEach((n,a)=>K.uPatchQ.value[a].copy(n).addScaledVector(e,-n.z/e.z)),me(K.uPatchQ.value,ve,i(0,0,-1))}else K.uPatchCol.value.set(0,0,0);[[(z.x0+z.x1)/2,(z.z0+z.z1)/2,Q.back/2,(z.z1-z.z0)/2,z.top],[(l0.x0+l0.x1)/2,(l0.z0+l0.z1)/2,150,140,l0.top],[(h.x0+h.x1)/2,(h.z0+h.z1)/2,(h.x1-h.x0)/2,(h.z1-h.z0)/2,h.top],[(_.x0+_.x1)/2,_.d/2,(_.x1-_.x0)/2,_.d/2,_.top],[(O.x0+O.x1)/2,(O.z0+O.z1)/2,(O.x1-O.x0)/2,(O.z1-O.z0)/2,O.top],[560,1700,105,105,-366],[630,1430,105,105,-366],[d-70,715,70,485,R.y0],[(e0.niche.x+d)/2,115,(d-e0.niche.x)/2,115,316],[-1e3,430,100,100,-420],[-1347,1510,145,210,h.top+250],[-1330,1935,140,150,h.top+220],[-2270,1160,115,100,z.top+380]].forEach(([e,t,n,a,o],r)=>{K.uOcc.value[r].set(e,t,n,a),K.uOccTop.value[r]=o});let we=A(V0(1024,512,lt,We)),G0=(e,t={},n={})=>A(new i0({uniforms:{...K,...t},vertexShader:y0,fragmentShader:e,toneMapped:!1,...n})),o0=(e,t=0)=>G0(Ft,{uKind:{value:e},uGloss:{value:t}}),U0={plain:o0(0),satin:o0(0,.3),chrome:o0(0,.9),wood:o0(2,.04),flute:o0(5,.04),plaster:o0(3),marble:o0(4,.25),tile:o0(1,.04),glazed:o0(6,.5),fabric:o0(7),cane:o0(8),thru:o0(9,.2),emit:G0(Lt),leaf:G0(Gt,{uAtlas:{value:we}},{side:le,alphaToCoverage:!0}),glass:G0(jt,{uAlpha:{value:.05}},{transparent:!0,depthWrite:!1,side:le}),contact:G0(Ut,{},{transparent:!0,depthWrite:!1,blending:_e,blendEquation:De,blendSrc:$e,blendDst:Be,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})},h0=new Map;function Y(e,t,n,a){n&&t.applyMatrix4(n);let o=t.attributes.position.count,r=new Float32Array(o*3);for(let s=0;s<o;s++)r.set(a,s*3);return t.setAttribute("aCol",new P0(r,3)),h0.has(e)||h0.set(e,[]),h0.get(e).push(t),t}let Ee=new Ve,ut=new qe,ft=new m0,mt=new m0(1,1,1),b=(e=0,t=0,n=0,a=0,o=0,r=0,s=null)=>{let f=new be().compose(ft.set(e,t,n),Ee.setFromEuler(ut.set(o,a,r,"YXZ")),mt);return s?s.clone().multiply(f):f},vt=new Set(["wood","marble","flute","satin","plain","fabric","cane","glazed","chrome"]),m=(e,t,n,a,o,r,s,f,p)=>{let x=r-n,T=s-a,g=f-o,k=Math.min(x,T,g),I=vt.has(e)&&k>=10?Math.min(6,k*.18):0;return Y(e,(I>.5?Zt(x,T,g,I):new j0(x,T,g)).translate((n+r)/2,(a+s)/2,(o+f)/2),p,t)},C=(e,t,n,a,o,r,s,f,p=r,x=24)=>Y(e,new H0(p,r,s,x).translate(n,a+s/2,o),f,t),M0=(e,t,n,a,o,r,s,f,p,x=16)=>Y(e,new ot(1,x,Math.max(6,x>>1)).scale(r,s,f).translate(n,a,o),p,t),V=(e,t,n,a,o,r,s,f=24)=>Y(e,new et(n.map(([p,x])=>new se(p,x)),f).translate(a,o,r),s,t),W=(e,t,n,a,o,r,s=8)=>{let f=a.clone().sub(n),p=f.length();return Y(e,new H0(o,o,p,s).applyQuaternion(Ee.setFromUnitVectors(F,f.normalize())).translate((n.x+a.x)/2,(n.y+a.y)/2,(n.z+a.z)/2),r,t)},x0=(e,t,n,a,o,r=Math.PI*2,s=32)=>Y(e,new at(n,a,8,s,r),o,t),B=(e,t,n,a,o)=>Y(e,new n0(n,a),o,t),Te=(e,t,n,a,o,r)=>{let s=new j0(1,1,1,8,8,2),f=s.attributes.position;for(let p=0;p<f.count;p++){let x=f.getX(p)*2,T=f.getY(p)*2,g=f.getZ(p),k=Math.sqrt(Math.max(0,(1-x**4)*(1-T**4)));f.setXYZ(p,x*n/2*(1-.06*T*T),T*a/2*(1-.06*x*x),g*o*(.18+.82*k))}return s.computeVertexNormals(),Y(e,s,r,t)},C0=(e,t,n=.28)=>{let a=1-n/2+n*t();return e.map(o=>o*a)},R0=(e,t,n)=>{let a=new g0(A(e),t);return n&&(a.matrixAutoUpdate=!1,a.matrix.copy(n),a.matrixWorldNeedsUpdate=!0),H.add(a),a};function k0(e,t,n,a,o,r,s=.15,f=0){let p=a.clone().normalize(),x=new m0().crossVectors(p,F);x.lengthSq()<1e-6&&x.set(1,0,0),x.normalize(),f&&x.applyAxisAngle(p,f);let T=new m0().crossVectors(x,p).normalize(),g=new n0(1,1,2,4),k=g.attributes.position,I=g.attributes.uv;for(let L=0;L<k.count;L++){let a0=I.getX(L),Z=I.getY(L),q=(a0-.5)*2;k.setXYZ(L,(a0-.5)*o,Z*r,(-s*Z*Z+.05*q*q)*r),I.setXY(L,((e&3)+a0)/4,1-((e>>2)+1-Z)/2)}g.computeVertexNormals(),g.applyMatrix4(new be().makeBasis(x,p,T).setPosition(n));let S=g.attributes.position;for(let L=0;L<S.count;L++)S.setXYZ(L,Math.min(Math.max(S.getX(L),c+3),d-3),Math.min(S.getY(L),y-3),Math.min(Math.max(S.getZ(L),3),j-3));g.computeVertexNormals(),Y("leaf",g,null,t)}let X0=(e,t,n=3,a=l.stem)=>W("plain",a,e,t,n,null,5);function Y0(e,t,n,a,o,r=l.terra,s="satin"){V(s,r,[[0,0],[a*.78,0],[a,o*.92],[a*1.05,o],[a*.95,o],[a*.9,o*.9],[0,o*.9]],e,t,n),C("plain",l.soil,e,t+o*.84,n,a*.9,4,null,a*.9,20)}function pt(e,t,n,a,o,r,s=0,f=2*Math.PI){let p=p0(r);for(let x=0;x<o;x++){let T=s+(f-s)*((x*.618+p()*.25)%1),g=.25+p()*.75,k=a*(.5+p()*.5),I=i(e,t,n),S=I.clone().addScaledVector(i(Math.cos(T)*Math.sin(g),Math.cos(g),Math.sin(T)*Math.sin(g)),k);X0(I,S,3.5),k0(0,C0(l.leafM,p),S,i(Math.cos(T),.45-p()*.7,Math.sin(T)),a*(.68+p()*.2),a*(.62+p()*.2),.16,(p()-.5)*.7)}}function dt(e,t,n,a,o,r=0,s=2*Math.PI,f=20){let p=p0(o),x=i(e+6,t+a*.42,n-4);W("wood",l.bark,i(e,t,n),x,11,null,7);let T=[0,1,2].map(g=>{let k=r+(s-r)*(.2+.3*g),I=.22+.08*g;return x.clone().add(i(Math.cos(k)*a*I,a*(.5+.05*g),Math.sin(k)*a*I))});for(let g of T)W("wood",l.bark,x,g,7,null,6);for(let g=0;g<f;g++){let k=T[g%3],I=.3+.7*((g*.37+p()*.2)%1),S=x.clone().lerp(k,I),L=r+(s-r)*((g*.618+p()*.2)%1),a0=i(Math.cos(L),.5,Math.sin(L)).normalize(),Z=S.clone().addScaledVector(a0,18);X0(S,Z,3);let q=(120+80*p())*(1.1-.3*I);k0(2,C0(l.leafF,p),Z,i(Math.cos(L),.4+p()*.9,Math.sin(L)),q*.62,q,.1,(p()-.5)*.9)}}function K0(e,t,n,a,o=40,r=0){let s=p0(a),f=t.clone().setY(0).normalize(),p=e.clone(),x=0,T=Math.max(2,Math.round(n/32));for(let g=0;g<T;g++){let k=x<r,I=k?30:g<2?16:3;x+=I;let S=p.clone().add(i(f.x*I+(s()-.5)*10,k?-2-s()*3:-26-s()*10,f.z*I+(s()-.5)*10));X0(p,S,1.8);let L=g%2?1:-1,Z=i(-f.z,0,f.x).multiplyScalar(L).multiplyScalar(.7).add(f.clone().multiplyScalar(.7)).add(i(0,-.2-s()*.6,0));k0(1,C0(l.leafP,s),S,Z,o*(.8+s()*.3),o*(.9+s()*.3),.06,(s()-.5)*1.2),p=S}}function ht(e,t,n,a,o,r,s=.2){let f=p0(r);for(let p=0;p<o;p++){let x=f()*6.283,T=4+f()*14;k0(4,C0(l.leafS,f),i(e+Math.cos(x)*T,t,n+Math.sin(x)*T),i(Math.cos(x)*s,1,Math.sin(x)*s),a*.17,a*(.6+f()*.4),-.03,f()*3)}}function S0(e,t,n,a,o,r=38,s=52,f=l.cream,p=90){Y0(e,t,n,r,s,f);let x=p0(o);for(let g=0;g<5;g++){let k=g*1.3+x();k0(1,C0(l.leafP,x),i(e+Math.cos(k)*8,t+s*.85,n+Math.sin(k)*8),i(Math.cos(k),.9,Math.sin(k)),34,38,.2,x())}let T=a.clone().setY(0).normalize();K0(i(e+T.x*r,t+s*.9,n+T.z*r),T,120+x()*140+p,o+1,34,p),K0(i(e+T.x*r*.7+T.z*r*.6,t+s*.9,n+T.z*r*.7-T.x*r*.6),T,60+x()*80+p,o+2,32,p)}let pe=(e,t,n,a=l.cream,o=null,r=24,s=38,f=!0)=>{V("satin",a,[[0,0],[r*.68,0],[r*.94,s*.5],[r,s],[r-2.5,s],[r*.92-2.5,s*.5],[0,5]],e,t,n,o,20),x0("satin",a,10,2.6,b(e+r-1,t+s*.55,n,0,0,-Math.PI/2,o),Math.PI,12),f&&C("plain",l.coffee,e,t+s-7,n,r-3,1,o,r-3,18)},Me=(e,t,n,a=l.cream,o=null)=>V("satin",a,[[0,0],[26,0],[40,6],[38,7],[0,3]],e,t,n,o,24),de=(e,t,n,a=null,o=l.cream)=>{Me(e,t,n,o,a),pe(e,t+4,n,o,a),C("plain",l.milk,e,t+36,n,15,1.5,a,9,16)},Z0=(e,t,n,a=60,o=null,r=null)=>{V("glass",l.clear,[[0,0],[21,0],[24,a],[22.5,a],[19.5,4],[0,4]],e,t,n,r,24),o&&C("thru",o,e,t+4,n,19,a*.62,r,21,20)},Re=(e,t,n,a,o,r=null)=>{C("glass",l.clear,e,t,n,34,a,r,34,24),C("satin",o,e,t+2,n,31,a*.72,r,31,20),C("satin",l.walnut,e,t+a,n,35,12,r,35,24)},L0=(e,t,n,a,o,r,s,f,p=null,x="z")=>{m("satin",s,e-a/2,t,n-r/2,e+a/2,t+o,n+r/2,p),x==="z"?m("plain",f,e-a/2+8,t+o*.3,n+r/2,e+a/2-8,t+o*.66,n+r/2+1.5,p):m("plain",f,e+a/2,t+o*.3,n-r/2+8,e+a/2+1.5,t+o*.66,n+r/2-8,p)};function he(e,t,n,a=l.ink,o=null,r=0){let s=b(e,t,n,r,0,0,o);V("satin",a,[[0,0],[44,0],[46,50],[36,78],[12,84],[8,92],[0,94]],0,0,0,s,24),W("satin",a,i(30,16,0),i(72,92,0),4,s),W("satin",a,i(72,92,0),i(96,84,0),3.4,s),x0("satin",a,32,5,b(-40,52,0,0,0,Math.PI/2,s),Math.PI,16)}B("tile",l.floor,d-c,j,b((d+c)/2,v,j/2,0,-Math.PI/2)),B("plaster",l.ceiling,d-c,j,b((d+c)/2,y,j/2,0,Math.PI/2)),B("plaster",l.plaster,d-c,y-v,b((d+c)/2,(v+y)/2,j,Math.PI));{let e=new Je,t=-(G.z0+G.z1)/2,n=(G.z1-G.z0)/2;e.moveTo(0,v),e.lineTo(0,y),e.lineTo(-j,y),e.lineTo(-j,v),e.lineTo(-G.z1,v),e.lineTo(-G.z1,G.spring),e.absarc(t,G.spring,n,Math.PI,0,!0),e.lineTo(-G.z0,v),e.lineTo(0,v);let a=new tt(e,24);Y("plaster",a,b(c,0,0,Math.PI/2),l.plaster);let o=110,r=24,s=[],f=[],p=[],x=[];for(let S=0;S<=r;S++){let L=Math.PI*(1-S/r),a0=G.spring+n*Math.sin(L),Z=(G.z0+G.z1)/2+n*Math.cos(L);for(let q of[c,c-o])s.push(q,a0,Z),f.push(0,-Math.sin(L),-Math.cos(L)),p.push(0,0);if(S<r){let q=S*2;x.push(q,q+2,q+1,q+1,q+2,q+3)}}let T=new ie;T.setAttribute("position",new N0(s,3)),T.setAttribute("normal",new N0(f,3)),T.setAttribute("uv",new N0(p,2)),T.setIndex(x),Y("plaster",T,null,l.plaster),B("plaster",l.plaster,o,G.spring-v,b(c-o/2,(G.spring+v)/2,G.z0,0)),B("plaster",l.plaster,o,G.spring-v,b(c-o/2,(G.spring+v)/2,G.z1,Math.PI));let g=c-520,k=G.z0-60,I=j+400;B("plain",l.dark,I-k,y-v,b(g,(v+y)/2,(k+I)/2,Math.PI/2)),B("plain",[.06,.055,.05],c-o-g,I-k,b((c-o+g)/2,v,(k+I)/2,0,-Math.PI/2)),B("plain",l.dark,c-o-g,I-k,b((c-o+g)/2,G.spring+n+40,(k+I)/2,0,Math.PI/2)),B("plain",l.dark,c-o-g,y-v,b((c-o+g)/2,(v+y)/2,k)),B("plain",l.dark,c-o-g,y-v,b((c-o+g)/2,(v+y)/2,I,Math.PI)),B("plain",l.dark,I-k,y-v,b(c-o,(v+y)/2,(k+I)/2,-Math.PI/2));for(let[S,L]of[[G.z0+4,G.z0+170],[G.z0+196,G.z1-4]]){let a0=new n0(L-S,G.spring-v-70,28,1),Z=a0.attributes.position;for(let q=0;q<Z.count;q++)Z.setZ(q,9*Math.sin(Z.getX(q)/11));a0.computeVertexNormals(),Y("thru",a0,b(c-40,(G.spring+v+70)/2,(S+L)/2,Math.PI/2),[.72,.64,.52])}W("chrome",l.brass,i(c-40,G.spring+6,G.z0),i(c-40,G.spring+6,G.z1),5)}let J0=X.wall;m("plaster",l.plaster,d,v,0,d+J0,y,R.z0),m("plaster",l.plaster,d,v,R.z1,d+J0,y,j),m("plaster",l.plaster,d,v,R.z0,d+J0,R.y0,R.z1),m("plaster",l.plaster,d,R.y1,R.z0,d+J0,y,R.z1);let _0=(e,t,n,a)=>m("satin",l.steel,d-4,t,e,d+14,a,n),c0=w.frame;for(let e of[R.z0,w.z0,w.z1-c0,R.z1-c0])_0(e,R.y0,e+c0,R.y1);for(let e of R.sideBars)_0(e-w.bar/2,R.y0,e+w.bar/2,R.y1);for(let e of[R.y0,w.y0,w.y1-c0,R.y1-c0])_0(R.z0,e,R.z1,e+c0);let ke=w.y0+(w.y1-w.y0)*w.transom,xt=[w.z0+c0+(w.z1-w.z0-2*c0)/3,w.z0+c0+2*(w.z1-w.z0-2*c0)/3];_0(w.z0,ke-w.transomBar/2,w.z1,ke+w.transomBar/2);for(let e of xt)_0(e-w.bar/2,w.y0,e+w.bar/2,w.y1);let ee=A(V0(768,256,()=>{})),Se=()=>{let e=ee.image,t=e.getContext("2d");t.clearRect(0,0,e.width,e.height),t.save(),t.translate(e.width,0),t.scale(-1,1),t.font='700 176px "NJ Lettering", Georgia, serif',t.textAlign="center",t.textBaseline="middle",t.lineJoin="round",t.strokeStyle="#d9ad52",t.lineWidth=12,t.strokeText("njct.io",e.width/2,e.height/2+8),t.fillStyle="#1d1710",t.fillText("njct.io",e.width/2,e.height/2+8),t.restore(),ee.needsUpdate=!0};N.push(new FontFace("NJ Lettering",`url(${new URL("../vendor/fonts/fraunces-lettering.woff2",new URL("../room/shell.js",import.meta.url).href).href})`,{weight:"700"}).load().then(e=>{document.fonts.add(e),Se()},Se));let gt=A(new i0({uniforms:{uMap:{value:ee}},vertexShader:y0,fragmentShader:$t,transparent:!0,depthWrite:!1,toneMapped:!1}));R0(new n0(168,56),gt,b(d-3,175,(w.z0+w.z1)/2,-Math.PI/2));let yt=P?.uniforms.uLeaf0.value||null,Pe=A(new i0({uniforms:{uLeafSun:{value:yt},uSunU:P?P.uniforms.uSunU:{value:i(1,0,0)},uSunV:P?P.uniforms.uSunV:{value:i(0,1,0)},uMask:P?P.uniforms.uMask:{value:new I0},uHasLeaves:{value:0}},vertexShader:y0,fragmentShader:At,toneMapped:!1}));R0(new n0(6400,3600),Pe,b(d+1900,700,-400,-Math.PI/2));let zt=A(new i0({uniforms:{...Pe.uniforms,uLeafSun:{value:P?.uniforms.uLeaf2.value||null}},vertexShader:y0,fragmentShader:It,toneMapped:!1})),te=(e,t,n,a)=>R0(new n0(n-e,a-t),zt,b(d+6,(t+a)/2,(e+n)/2,-Math.PI/2));te(R.z0,R.y0,w.z0,R.y1),te(w.z1,R.y0,R.z1,R.y1),te(w.z0,R.y0,w.z1,w.y0),te(w.z0,w.y1,w.z1,R.y1),B("glass",[.84,.92,.88],w.z1-w.z0,w.y1-w.y0,b(d+3,(w.y0+w.y1)/2,(w.z0+w.z1)/2,-Math.PI/2));let u0=nt(u,$),bt=[c,v,d,y];u0.resize(c,v,d,y,360,190),u0.mesh.position.z=-1,u0.mesh.updateMatrixWorld(),u0.mesh.renderOrder=-2,H.add(u0.mesh);let wt=A(new i0({uniforms:{...K,uWallBake:u0.mesh.material.uniforms.uBake,uWallRegion:{value:new I0(...bt)},uOak:{value:new Qe(...l.oak)}},vertexShader:y0,fragmentShader:Ct,toneMapped:!1})),b0=e0.niche.x,oe=e0.depth,f0=300;R0(new n0(d-b0,f0-v),wt,b((b0+d)/2,(v+f0)/2,oe)),B("wood",l.oak,oe,f0-v,b(b0,(v+f0)/2,oe/2,-Math.PI/2)),m("wood",l.oak,b0,f0,0,d,f0+16,oe+10),Y0(1060,f0+16,112,70,130,l.terra),pt(1060,f0+130,112,180,12,11,Math.PI/2-.2,Math.PI+.3);for(let[e,t]of[[1166,[.85,.82,.75]],[1186,[.16,.16,.18]]])m("satin",t,e-6,f0+16,30,e+6,f0+196,200);m("plaster",l.plaster,-b0-110,v,0,-b0,y,70),B("plaster",l.plaster,-b0-110-c,y-v,b((c-b0-110)/2,(v+y)/2,.5)),m("plain",l.slate,-1700,y-26,380,900,y-14,400);for(let e of[-1300,-500,300])C("plain",l.slate,0,-50,0,26,100,b(e,y-70,390,0,.5),30,20);m("plain",l.ink,z.x0,v,z.z0,z.x1-20,v+60,z.z1),m("flute",l.teak,z.x0,v+60,z.z0,z.x1-10,z.top-20,z.z1),m("marble",l.marble,z.x0,z.top-20,z.z0,z.x1+6,z.top,z.z1+6),B("glazed",l.sage,z.z1,400,b(c+1,z.top+200,z.z1/2,Math.PI/2)),m("wood",l.oak,c,z.top+400,20,c+190,z.top+420,z.z1);{let e=z.top+420,t=c+95,n=p0(31),a=70,o=["cups","glasses","jars","plant","cups","teapot","glasses","jars","cups","plant","bags","cups"];for(let r of o){if(a>z.z1-80)break;if(r==="cups"){for(let s=0;s<3;s++)for(let f=0;f<3-s;f++)C("satin",s?l.cream:l.clay,t,e+s*34,a+f*54+s*27,24,32,null,21,18);a+=190}else if(r==="glasses"){for(let s=0;s<4;s++)Z0(t,e,a+s*52,64);a+=230}else if(r==="jars"){for(let s=0;s<3;s++)Re(t,e,a+s*78,90+30*n(),s%2?l.beans:[.85,.75,.55]);a+=250}else if(r==="plant")S0(t,e,a+30,i(1,0,.15),40+a,36,48),a+=150;else if(r==="teapot")M0("satin",l.clay,t,e+46,a+30,50,46,50),W("satin",l.clay,i(t,e+46,a+70),i(t+6,e+80,a+110),7),x0("satin",l.clay,24,5,b(t,e+56,a-18,Math.PI/2,0,-Math.PI/2),Math.PI,12),a+=150;else if(r==="bags"){for(let s=0;s<3;s++)L0(t,e,a+s*82,50,150-s*12,74,z0[s+1],F0[s],null,"x");a+=260}}}W("chrome",l.chrome,i(c+196,z.top+392,130),i(c+196,z.top+392,370),3.5);let Et=["Tell me about your brand","I set up and run your channels","A monthly report on what worked"],He=[],Fe=[];Et.forEach((e,t)=>{let n=A(V0(240,360,(s,f,p)=>{s.fillStyle="#f3eee2",s.fillRect(0,0,f,p),s.fillStyle="rgba(0,0,0,0.06)";for(let g=110;g<p-20;g+=34)s.fillRect(18,g,f-36,2);s.fillStyle="#2a2622",s.font='700 64px "NJ Text", system-ui, sans-serif',s.fillText(String(t+1),22,76),s.font='500 30px "NJ Text", system-ui, sans-serif';let x="",T=136;for(let g of e.split(" ")){let k=x?x+" "+g:g;x&&s.measureText(k).width>f-44?(s.fillText(x,22,T),x=g,T+=34):x=k}s.fillText(x,22,T)}));He.push(n);let a=A(new i0({uniforms:{uMap:{value:n},uGain:{value:.78}},vertexShader:y0,fragmentShader:_t,toneMapped:!1,side:le})),o=324-t*72,r=new O0;r.position.set(c+199,z.top+388,o),r.rotation.set(0,Math.PI/2+(t-1)*.06,(t-1)*.04,"YXZ"),r.add(new g0(A(new n0(64,96).translate(0,-48,0)),a)),H.add(r),Fe.push(r),m("chrome",l.chrome,c+194,z.top+384,o-6,c+200,z.top+394,o+6)});let M={y:885,z:1300,w:1e3,h:714},s0=null,ae=A(V0(ce.w,ce.h,(e,t,n)=>{s0=st(e,t,n)})),Tt=new FontFace("NJ Menu",`url(${new URL("../vendor/fonts/bricolage-grotesque-menu.woff2",new URL("../room/shell.js",import.meta.url).href).href})`,{weight:"400 700"});N.push(Tt.load().then(e=>{document.fonts.add(e),s0=st(ae.image.getContext("2d"),ce.w,ce.h),ae.needsUpdate=!0},()=>{}));let Mt=A(new i0({uniforms:{uMap:{value:ae},uGain:{value:.95}},vertexShader:y0,fragmentShader:Wt,toneMapped:!1}));m("plain",l.slate,c+1,M.y-M.h/2-4,M.z-M.w/2-10,c+14,M.y+M.h/2+4,M.z+M.w/2+10),R0(new n0(M.w,M.h),Mt,b(c+16,M.y,M.z,Math.PI/2));for(let e of[M.z-M.w/2-26,M.z+M.w/2+10])m("wood",l.oak,c+1,M.y-M.h/2-20,e,c+20,M.y+M.h/2+20,e+16);for(let e of[M.y-M.h/2-20,M.y+M.h/2+4])m("wood",l.oak,c+1,e,M.z-M.w/2-26,c+20,e+16,M.z+M.w/2+26);for(let e of[M.z-300,M.z+300])W("chrome",l.brass,i(c+20,M.y+M.h/2+30,e),i(c+110,M.y+M.h/2+70,e),4);C("chrome",l.brass,0,-380,0,16,760,b(c+112,M.y+M.h/2+70,M.z,0,Math.PI/2),16,16),m("emit",E0([1,.86,.62],2.4),c+104,M.y+M.h/2+56,M.z-370,c+120,M.y+M.h/2+58,M.z+370);let Rt=(e,t)=>i(c+16,M.y+M.h/2-t*M.h,M.z+M.w/2-e*M.w);for(let[e,t]of[[80,700],[1900,2360]]){for(let o of[700,960])m("wood",l.oak,c,o,e,c+170,o+20,t);let n=p0(e+9);S0(c+85,720,e+90,i(1,0,.1),e+1,40,56,l.terra);for(let o=0;o<4;o++)L0(c+85,720,e+210+o*82,56,140+20*n(),70,z0[(o+e)%z0.length],F0[o%F0.length],null,"x");S0(c+85,980,t-110,i(1,0,-.1),e+2,44,60,l.cream);let a=e+190;m("wood",l.walnut,c+14,980,a-78,c+160,1206,a+78),m("fabric",[.07,.07,.075],c+160,994,a-66,c+163,1192,a+66);for(let[o,r]of[[1150,17],[1060,46]])C("satin",[.03,.03,.035],0,-2,0,r,4,b(c+165,o,a,0,0,Math.PI/2),r*.8,24)}{let e=z.top,t=(z.x0+z.x1)/2;m("wood",l.walnut,t-140,e,200,t+120,e+80,580),m("plain",l.ink,t-140,e+4,200,t+120,e+12,580),C("chrome",[.4,.4,.42],t+96,e+80,230,12,10,null,12,16),C("chrome",[.4,.4,.42],t+96,e+80,270,12,10,null,12,16);let n={x:t-20,y:e+80,z:380};W("chrome",l.chrome,i(t+80,e+104,550),i(t-10,e+104,470),3.2),W("chrome",l.chrome,i(t-10,e+104,470),i(n.x+40,e+102,n.z+52),3),C("chrome",l.chrome,t+80,e+80,550,14,26,null,14,16),m("plain",l.ink,n.x+28,e+96,n.z+40,n.x+52,e+104,n.z+64),m("wood",l.oak,t-150,e,40,t+110,e+150,180);for(let o=0;o<14;o++)m("satin",z0[o%z0.length].map(r=>r*.8),t-140,e+10,52+o*9,t+100,e+170-o%3*6,58+o*9);m("satin",[.86,.5,.18],c+6,e,600,c+14,e+177,777),M0("satin",[.12,.1,.09],c+15,e+100,690,1,52,52,null,24),m("wood",l.walnut,t-70,e,600,t+70,e+14,1e3);for(let o of[610,990])m("wood",l.walnut,t-10,e+14,o-8,t+10,e+190,o+8);m("wood",l.walnut,t-56,e+190,600,t+56,e+204,1e3);for(let o of[700,880])m("plain",l.ink,t-44,e+14,o-44,t+44,e+26,o+44),V("glass",l.clear,[[0,0],[40,0],[44,56],[34,92],[28,98],[0,98]],t,e+26,o),C("plain",l.coffee,t,e+28,o,38,34,null,42,20),V("satin",l.cream,[[0,0],[16,0],[56,66],[60,72],[56,72],[14,6],[0,6]],t,e+196,o);he(t+70,e,1045,l.ink,null,0),m("satin",l.stainless,t-150,e,1110,t-30,e+400,1290),m("satin",l.stainless,t-30,e+250,1120,t+100,e+330,1280),m("plain",l.ink,t-20,e+236,1150,t+70,e+250,1250),m("satin",l.stainless,t-30,e,1120,t+100,e+14,1280),m("emit",E0([.25,.5,.42],2),t+100,e+296,1180,t+102,e+316,1220),V("glass",l.clear,[[0,0],[54,0],[58,64],[36,110],[32,120],[0,120]],t+34,e+14,1200),C("plain",l.coffee,t+34,e+16,1200,52,54,null,56,20),C("satin",l.stainless,t-20,e,1420,74,250,null,70,28),C("satin",l.ink,t-20,e+250,1420,50,30,null,30,20),W("chrome",l.chrome,i(t+60,e,1580),i(t+60,e+260,1580),4),x0("chrome",l.chrome,44,3,b(t+20,e+260,1580,0,Math.PI/2)),W("chrome",l.chrome,i(t+60,e+260,1580),i(t+64,e+260,1580),4),V("thru",[.78,.56,.36],[[2,0],[10,0],[40,110],[44,116],[0,116]],t+20,e+150,1580),C("satin",l.stainless,t+20,e,1580,54,90,null,52,24),m("satin",l.ink,t-45,e,1700,t+45,e+110,1790),V("glass",l.clear,[[0,0],[40,0],[52,150],[50,160],[0,160]],t,e+110,1745),[[.5,.16,.06],[.75,.45,.12],[.2,.32,.12],[.62,.1,.12],[.85,.7,.45]].forEach((o,r)=>{V("satin",o,[[0,0],[20,0],[20,120],[9,140],[8,170],[0,170]],t+60,e,1840+r*44,null,16),C("plain",l.ink,t+60,e+170,1840+r*44,9,10,null,9,10)});for(let o=0;o<2;o++)C("satin",[.92,.9,.84],t-60,e,1880+o*70,22,150,null,27,18)}{let{x0:e,x1:t,z0:n,z1:a,top:o}=l0,r=16;m("satin",l.ink,e,v,n,t,v+90,a),m("satin",l.ink,e,o-70,n,t,o,a),m("satin",l.ink,e,v+90,n,t,o-70,n+r),m("satin",l.ink,e,v+90,a-r,t,o-70,a),B("emit",E0([.96,1,1.04],1.35),a-n-2*r,o-70-v-90,b(e+4,(o-70+v+90)/2,(n+a)/2,Math.PI/2));let s=[[.3,.14,.05],[.95,.42,.1],[.92,.9,.85],[.25,.4,.15],[.62,.32,.1]];for(let f=0;f<4;f++){let p=v+100+f*245;m("plain",[.25,.26,.27],e+4,p,n+r,t-24,p+4,a-r);for(let x=0;x<6;x++){let T=s[(f*2+x)%s.length],g=n+44+x*38;V("satin",T,[[0,0],[15,0],[15,110],[7,140],[7,160],[0,160]],t-120,p+4,g,null,14),V("satin",s[(f+x+2)%5],[[0,0],[15,0],[15,110],[7,140],[7,160],[0,160]],t-70,p+4,g+18,null,14)}}B("glass",l.clear,a-n-2*r,o-70-v-90,b(t-6,(o-70+v+90)/2,(n+a)/2,Math.PI/2)),m("chrome",l.chrome,t-4,v+200,a-40,t+14,o-200,a-30),m("emit",E0([.95,.92,.85],1.8),t-1,o-50,n+30,t+1,o-20,a-30)}m("plain",l.ink,h.x0+20,v,h.z0+20,h.x1-20,v+50,h.z1-20),m("flute",l.oak,h.x0+10,v+50,h.z0+10,h.x1-10,h.top-20,h.z1-10),m("marble",l.marble,h.x0-6,h.top-20,h.z0,h.x1+12,h.top,h.z1);{let o=h.top;m("chrome",l.chrome,-1490,o,1300,-1205,o+18,1720),m("satin",l.mint,-1480,o+18,1310,-1215,o+240,1710),m("chrome",l.chrome,-1484,o+240,1306,-1211,o+250,1714);for(let r of[1308,1712])m("chrome",l.chrome,-1480,o+250,r-3,-1215,o+272,r+3);m("satin",l.stainless,-1215,o+40,1336,-1211,o+222,1684);for(let r of[3020/2-1.5])m("satin",[.3,.31,.32],-1211,o+40,r,-1210,o+222,r+3);M0("satin",l.ink,-1210,o+150,3020/2,1.5,20,64,null,24),m("satin",[.85,.78,.6],-1215+6.5,o+147,3020/2-36,-1208,o+153,3020/2+36);for(let r=0;r<2;r++)for(let s=0;s<5;s++)C("satin",s%3===1?l.clay:l.cream,-1410+r*120,o+250,1360+s*(300/4),26,34,null,21,18);for(let r of[1310+400*.32,1310+400*.68])m("chrome",l.chrome,-1530,o+120,r-46,-1480,o+196,r+46),C("chrome",l.chrome,-1510,o+92,r,34,28),C("chrome",l.chrome,-1510,o+70,r,32,22),m("plain",l.ink,-1630,o+74,r-10,-1530,o+90,r+10),C("satin",l.cream,-1510,o+18,r,26,36,null,24,18),C("satin",l.cream,0,-2,0,18,4,b(-1481,o+206,r,0,0,Math.PI/2),18,20);m("chrome",l.chrome,-1560,o,1340,-1480,o+16,1680);for(let r of[1335,1685])W("chrome",l.chrome,i(-1490,o+200,r),i(-1550,o+40,r),5);for(let[r,s]of[[0,0],[-6,44]])V("chrome",l.stainless,[[0,0],[30,0],[30,50],[24,66],[27,72],[0,70]],-1525+r,o,1730+s,null,20);m("satin",l.ink,-1470,o,1215,-1395,o+70,1285)}{let e=h.top;for(let[n,a]of[[1150,l.ink],[1010,[.86,.84,.8]]])m("satin",a,-1475,e,n-50,-1365,e+210,n+50),m("satin",a,-1508,e+70,n-22,-1475,e+120,n+22),C("chrome",l.chrome,-1420,e+210,n,50,26,null,46),C("satin",l.beans,-1420,e+236,n,32,78,null,52),C("glass",l.clear,-1420,e+236,n,36,120,null,64),C("satin",l.ink,-1420,e+356,n,64,10);de(-1250,e,815),de(-1250,e,905),Z0(-1325,e,860,80,[.62,.42,.26]),V("satin",l.cream,[[0,0],[22,0],[26,30],[12,70],[10,92],[13,96],[0,96]],-1230,e,1050,null,20);let t=p0(77);for(let n=0;n<3;n++){let a=i(-1230+(t()-.5)*40,e+170+t()*50,1050+(t()-.5)*50);X0(i(-1230,e+90,1050),a,1.6),k0(7,[.95,.62,.66],a.clone().add(i(0,-18,0)),i(.6,.5,t()-.5),40,40,0,0),k0(1,C0(l.leafP,t),i(-1230,e+120+n*16,1050),i(t()-.5,.4,t()-.5),22,26,.1,0)}}{let o=h.top,r=210;m("wood",l.oak,-1470,o,1800,-1192,o+16,2090),B("glass",l.clear,290,r,b(-1192,o+16+r/2,3890/2,Math.PI/2)),B("glass",l.clear,278,r,b(-2662/2,o+16+r/2,1800,Math.PI)),B("glass",l.clear,278,r,b(-2662/2,o+16+r/2,2090)),B("glass",l.clear,278,290,b(-2662/2,o+16+r,3890/2,0,-Math.PI/2)),B("glass",l.clear,278,290,b(-2662/2,o+16+r*.5,3890/2,0,-Math.PI/2));for(let[s,f]of[[-1192,1800],[-1192,2090],[-1470,1800],[-1470,2090]])m("chrome",l.brass,s-3,o+16,f-3,s+3,o+16+r,f+3);for(let s=0;s<4;s++)x0("satin",l.crust,26,14,b(-1380+s%2*90,o+30,1860+s*58,s*.7,-Math.PI/2),Math.PI*1.25,14);C("satin",[.94,.86,.72],-1360,o+16+r*.5,3890/2-40,62,52,null,62,32),C("satin",[.62,.32,.2],-1360,o+16+r*.5+52,3890/2-40,62,6,null,62,32);for(let s=0;s<5;s++)C("satin",[.7,.5,.3],-1260,o+16+r*.5+s*8,1900+s%2*6,26,7,null,26,18)}{let e=h.top,t=-1262,n=2200;C("chrome",l.ink,t,e,n,30,6),C("chrome",l.ink,t,e+6,n,8,70);let a=b(t+8,e+112,n,0,0,.55);m("satin",l.ink,-5,-56,-78,5,56,78,a),B("emit",l.screen,146,102,b(5.5,0,0,Math.PI/2,0,0,a)),m("satin",l.ink,-1250,e,2105,-1200,e+14,2150),Z0(-1215,e,2270,74)}for(let e of J){W("plain",l.ink,i(e.x,e.y+80,e.z),i(e.x,y,e.z),2.5),V("satin",l.enamel,[[100,0],[96,24],[72,64],[30,86],[12,94],[0,96]],e.x,e.y-10,e.z,null,32),V("emit",E0([.95,.82,.62],1.7),[[0,92],[12,90],[30,82],[72,60],[94,22],[98,0]],e.x,e.y-10,e.z,null,32),M0("glass",[.95,.85,.7],e.x,e.y+6,e.z,30,36,30,null,20);for(let t=0;t<5;t++){let n=t/5*6.283;W("emit",E0([1,.7,.34],6),i(e.x+Math.cos(n)*5,e.y-10,e.z+Math.sin(n)*5),i(e.x+Math.cos(n)*11,e.y+22,e.z+Math.sin(n)*11),1.6,null,5)}M0("emit",E0([1,.82,.55],4.5),e.x,e.y+4,e.z,9,14,9,null,10)}{let{x0:e,x1:t,d:n,top:a}=_,o=[0,1,2,3].map(f=>e+(t-e)*f/3);for(let f of o)for(let p of[14,n-14])m("satin",l.steel,f-7,v,p-7,f+7,a,p+7);let r=[-560,-300,-40,220,480,a-22];for(let f of r)m("wood",l.oak,e-12,f,0,t+12,f+22,n);let s=p0(53);for(let f=0;f<r.length-1;f++){let p=r[f]+22;for(let x=0;x<3;x++){let T=o[x]+24,g=o[x+1]-24,k=n/2+10,I=x===0?["stock","cups","stock","jars","stock"][f]:["bags","mugs","bags","bags","kettles"][(f+x)%5];if(I==="stock")for(let S=T;S<g-90;S+=104)m("plain",f%2?[.62,.5,.36]:[.92,.9,.86],S,p,k-80,S+92,p+120+40*s(),k+70);else if(I==="cups")for(let S=T+30;S<g-20;S+=62)C("satin",[.92,.9,.84],S,p,k,24,170,null,28,16);else if(I==="jars")for(let S=T+40;S<g-30;S+=84)Re(S,p,k,110+40*s(),s()<.5?l.beans:[.85,.75,.55]);else if(I==="bags")for(let S=T+34;S<g-30;S+=74)L0(S,p,k+20,60,130+40*s(),60,z0[s()*z0.length|0],F0[s()*F0.length|0]);else if(I==="mugs"){let S=f;for(let L=T+34;L<g-30;L+=70)pe(L,p,k+40,[l.cream,l.sage,l.clay,l.terra][S++%4],null,28,52,!1)}else I==="kettles"&&(he(T+70,p,k+10,l.stainless),he(g-90,p,k+10,[.9,.88,.82]))}}S0(e+140,a,n/2,i(0,0,1),61,44,60,l.terra),S0(t-160,a,n/2,i(.2,0,1),62,40,56,l.cream),L0(-1500,a,n/2,60,160,64,z0[2],F0[1]),L0(-1420,a,n/2,60,150,64,z0[4],F0[0])}Y0(-1e3,v,430,105,230,l.cream),dt(-1e3,v+200,430,860,91,.3*Math.PI,1.65*Math.PI,34),m("flute",l.oak,d-140,v,240,d,R.y0-22,1190),m("wood",l.oak,d-150,R.y0-22,230,d+4,R.y0,1200),m("fabric",l.oat,d-140,R.y0,250,d-6,R.y0+34,1180),Te("fabric",l.rust,150,140,46,b(d-40,R.y0+104,340,-Math.PI/2,-.22,0)),Te("fabric",l.olive,136,128,42,b(d-42,R.y0+98,1085,-Math.PI/2+.2,-.26,0)),m("wood",l.walnut,d-120,R.y0+34,610,d-20,R.y0+42,760),de(d-70,R.y0+42,680,null,l.sage),Y0(d-60,R.y0+34,1162,38,70,l.cream),ht(d-60,R.y0+92,1162,230,7,17,.08);{let{x0:e,x1:t,z0:n,z1:a,top:o}=O;m("wood",l.oak,e,o-32,n,t,o,a),m("wood",l.oak,e+36,o-86,n+36,t-36,o-32,a-36);for(let r of[e+34,t-34])for(let s of[n+34,a-34])m("wood",l.oak,r-22,v,s-22,r+22,o-32,s+22)}function Ce(e,t,n){let a=b(e,v,t,n),o=254,r=l.bentwood;C("cane",l.cane,0,o-14,0,106,14,a,106,28),x0("wood",r,106,7,b(0,o-10,0,0,Math.PI/2,0,a),Math.PI*2,40);for(let[s,f]of[[[60,o-18,60],[80,0,82]],[[60,o-18,-60],[80,0,-82]],[[-64,o-18,60],[-90,0,84]],[[-64,o-18,-60],[-90,0,-84]]])W("wood",r,i(...s),i(...f),9,a);x0("wood",r,74,5,b(-4,116,0,0,Math.PI/2,0,a),Math.PI*2,32);for(let s of[-1,1])W("wood",r,i(-70,o-8,s*70),i(-98,o+230,s*68),8,a);x0("wood",r,68,8,b(-98,o+230,0,Math.PI/2,0,0,a),Math.PI,24),x0("wood",r,46,5,b(-90,o+196,0,Math.PI/2,0,0,a),Math.PI,20)}Ce(560,1700,-.18),Ce(630,1430,.06);let w0=A(V0(900,576,(e,t,n)=>it(e,t,n)));w0.generateMipmaps=!1,w0.minFilter=re;let xe=A(new W0(640,400,{type:B0,samples:2,depthBuffer:!0})),ge=new Ye(2*Math.atan(470/2556)*180/Math.PI,640/400,100,2556*2);ge.position.set(0,0,2556),ge.updateMatrixWorld();let Ae=A(new i0({uniforms:{uWall:{value:xe.texture},uTerm:{value:w0},uHasWall:{value:0},uGain:{value:.92}},vertexShader:y0,fragmentShader:Dt,toneMapped:!1})),ye=!0,Ie=q0,je=!0,kt=0;{let e=O.top,t=b(860,e,1640,.22);m("satin",[.64,.65,.67],-62,0,-88,62,8,88,t),m("plain",l.ink,-12,8,-76,50,8.6,76,t),m("satin",[.55,.56,.58],-56,8,-32,-20,8.4,32,t);let n=b(62,8,0,0,0,-.26,t);m("satin",[.64,.65,.67],-5,0,-88,0,124,88,n),m("plain",l.ink,-5.6,2,-86,-5,122,86,n),R0(new n0(162,104),Ae,b(-5.8,63,0,-Math.PI/2,0,0,n));let a=905,o=1820;C("wood",l.teak,a,e,o,40,4,null,40,24),C("thru",l.tea,a,e+6,o,21,60,null,24,24),C("thru",l.milk,a,e+66,o,24,9,null,24.5,24);for(let[s,f,p]of[[-8,5,66],[9,-6,70],[2,10,75]])m("glass",[.9,.95,1],a+s-8,e+p,o+f-8,a+s+8,e+p+14,o+f+8);V("glass",l.clear,[[0,0],[22,0],[24,4],[27,92],[25.5,92],[22.5,6],[0,6]],a,e+4,o,null,28),W("satin",[.95,.95,.92],i(a+6,e+30,o-4),i(a+22,e+136,o-14),3.2),R0(new n0(130,88),A(new i0({uniforms:{uGain:{value:.22}},vertexShader:y0,fragmentShader:Bt,transparent:!0,depthWrite:!1,blending:Le,toneMapped:!1})),b(a-58,e+.8,o+6,0,-Math.PI/2));let r=b(800,e,1430,-.3);m("plain",[.55,.42,.28],-42,0,-60,42,7,60,r),m("plain",l.cream,-40,7,-58,40,7.5,58,r),W("satin",l.ink,i(-30,10,40),i(30,10,-20),3,r),m("satin",l.ink,-20,0,-42,20,5,42,b(760,e,1840,.5)),Me(790,e,2e3),pe(790,e+4,2e3,l.cream,null,20,30),V("glass",l.clear,[[0,0],[40,0],[44,60],[30,120],[18,150],[20,160],[0,160]],1050,e,1300,null,24),C("glass",[.7,.85,.9],1050,e+4,1300,38,90,null,34,20),Z0(990,e,1270,64),S0(1075,e,2010,i(1,0,0),71,34,46,l.terra,80)}W("plain",l.ink,i(D.x,D.y+60,D.z),i(D.x,y,D.z),2.5),M0("emit",E0([1,.88,.7],1.45),D.x,D.y,D.z,64,60,64,null,24);{let e=i(1060,620,1470);for(let t=0;t<3;t++){let n=t*2.094;W("plain",[.6,.52,.4],i(e.x+Math.cos(n)*44,e.y+60,e.z+Math.sin(n)*44),i(e.x,y-200,e.z),1.5)}W("plain",[.6,.52,.4],i(e.x,y-200,e.z),i(e.x,y,e.z),2),S0(e.x,e.y,e.z,i(-1,0,0),81,52,64,l.cream,0),K0(i(e.x-20,e.y+58,e.z+40),i(-.5,0,.86),280,83,38),K0(i(e.x+10,e.y+58,e.z-46),i(-.3,0,-.95),220,84,36)}m("wood",l.walnut,d-14,160,1640,d,580,1980),m("plain",[.92,.88,.8],d-15,182,1662,d-13,558,1958),m("plain",[.82,.48,.22],d-16,260,1720,d-15,480,1900),M0("plain",[.18,.3,.42],d-16.5,340,1810,1,70,70,null,24);let Ge=new H0(150,150,4,64);Y("satin",Ge,null,[.035,.035,.04]),h0.get("satin").pop();let Ue=new H0(50,50,4.6,32).translate(0,0,0);Y("plain",Ue,null,[.86,.5,.18]),h0.get("plain").pop();let D0=new O0;D0.position.set(-2260,Q.backTop+82,380);let St=new g0(A(Ge),U0.satin),Pt=new g0(A(Ue),U0.plain);D0.add(St,Pt);for(let e=0;e<3;e++){let t=new j0(12,1,2).translate(26,2.6,0).rotateY(e*2.1);Y("plain",t,null,[.95,.9,.8]),h0.get("plain").pop(),D0.add(new g0(A(t),U0.plain))}H.add(D0);let A0=(e,t,n,a,o,r=.3)=>B("contact",[r,0,0],a*2,o*2,b(e,t+.6,n,0,-Math.PI/2));{let e=O.top,t=Q.top,n=Q.backTop;for(let[a,o,r,s,f]of[[860,1640,80,105,.32],[905,1820,34,34,.38],[800,1430,50,66,.24],[760,1840,26,48,.28],[790,2e3,46,46,.3],[1050,1300,50,50,.34],[990,1270,28,28,.3],[1075,2010,42,42,.34]])A0(a,e,o,r,s,f);for(let[a,o]of[[560,1700],[630,1430]])A0(a,v,o,125,125,.32);for(let a of[O.x0+34,O.x1-34])for(let o of[O.z0+34,O.z1-34])A0(a,v,o,46,46,.3);A0(-1e3,v,430,135,135,.4);for(let[a,o,r,s,f]of[[-1347,1510,165,225,.28],[-1420,1150,70,66,.34],[-1420,1010,70,66,.34],[-1330,1945,150,160,.22],[-1262,2200,36,36,.36],[-1250,815,46,46,.3],[-1250,905,46,46,.3],[-1325,860,30,30,.3],[-1230,1050,30,30,.34]])A0(a,t,o,r,s,f);for(let[a,o,r,s]of[[-2250,390,150,200],[-2245,1190,140,110],[-2260,1420,80,80],[-2240,1745,56,56]])A0(a,n,o,r,s,.26)}for(let[e,t]of h0){let n=A(Jt(t));for(let o of t)o.dispose();let a=new g0(n,U0[e]);e==="glass"&&(a.renderOrder=2),e==="contact"&&(a.renderOrder=1),H.add(a)}h0.clear();let ne=new O0;ne.position.set(-450,y-160,1450),H.add(ne);let ze=(e,t,n)=>{Y(e,t,null,n),h0.clear();let a=new g0(A(t),U0[e]);return ne.add(a),a};ze("plain",new H0(4,4,160,8).translate(0,80,0),l.slate),ze("plain",new H0(40,46,40,24),l.slate);for(let e=0;e<4;e++)ze("wood",new j0(320,6,70).translate(190,-10,0).rotateY(-e*Math.PI/2),l.teak);let $0=Kt(u);U.push($0);let Ht=[we,ae,w0,ee,...He];return{group:H,fan:ne,finish:$0,get orderCorners(){return s0?[[s0.x0,s0.y0],[s0.x1,s0.y0],[s0.x1,s0.y1],[s0.x0,s0.y1]].map(([e,t])=>Rt(e,t)):null},tick(e){D0.rotation.y=-e*(100/3)/60*Math.PI*2,++kt%2===0&&(ye=!0);let t=q0/16+7,n=e%t,a=Math.min(q0,Math.floor(n*16)),o=a<q0||Math.floor(n*2)%2===0;return(a!==Ie||o!==je)&&(Ie=a,je=o,it(w0.image.getContext("2d"),w0.image.width,w0.image.height,a,o),w0.needsUpdate=!0),Fe.forEach((r,s)=>{r.rotation.x=.05+.035*Math.sin(e*1.27+s*1.9)+.02*Math.sin(e*3.1+s*.7)}),!0},render(e,t,n,a){if(a&&ye){ye=!1,H.visible=!1;let o=u.getRenderTarget();u.setRenderTarget(xe),u.render(e,ge),u.setRenderTarget(o),H.visible=!0,Ae.uniforms.uHasWall.value=1}$0.render(e,t,n)},async warm(e,t=[],n=[]){H.visible=!0;for(let r of t)r.visible=!0;let a=u.getRenderTarget();u.setRenderTarget($0.target);let o=u.compileAsync?u.compileAsync(E,e):(u.compile(E,e),null);u.setRenderTarget(a),H.visible=!1;for(let r of t)r.visible=!1;o&&await o,await Promise.allSettled(N);for(let r of[...Ht,...n])u.initTexture(r);$0.compile(),u0.bake(),u.setRenderTarget(xe),u.clear(),u.setRenderTarget(a)},bake(){u0.bake()},setVisible(e){H.visible!==e&&(H.visible=e,e&&u0.bake())},dispose(){E.remove(H),u0.dispose();for(let e of U)e.dispose?.()}}}export{lo as createShell};
