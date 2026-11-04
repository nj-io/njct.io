import{a as Je}from"./chunk-5BRKVZWJ.js";import"./chunk-UH43Z3T2.js";import{c as et}from"./chunk-4VAF4GAZ.js";import{j as M0}from"./chunk-6PNQGI4Q.js";import{$ as Ye,B as ve,C as Ne,E as $e,G as w0,J as L0,K as oe,L as u0,M as _0,N as a0,O as De,P as qe,Q as U0,R as Ve,V as Qe,W as E0,X as Oe,Z as Xe,_ as t0,aa as Ke,b as J0,ba as Ze,c as Ae,d as Ie,e as Ge,f as je,g as Le,j as _e,n as ee,q as Ue,r as Be,u as he,v as We,w as b0,y as k0,z as te}from"./chunk-X52R7RES.js";var Q=M0.room,Z=M0.shelving,V=M0.counter,N=M0.table,g=M0.window,T=M0.shopfront,tt=4,N0=14,ne=`vec3(${Q.front.toFixed(1)}, ${((g.y0+g.y1)/2).toFixed(1)}, ${((g.z0+g.z1)/2).toFixed(1)})`,le=`
uniform vec3 uWinQ[4];       // the shopfront's opening (light from the sky and the street)
uniform vec3 uPatchQ[4];     // the sunlit patch on the record wall (warm bounce)
uniform vec3 uWallQ[4];      // the lit record wall around the shelves (neutral bounce)
uniform vec3 uSkyCol, uPatchCol, uWallCol;
uniform vec4 uLampP[${tt}];   // xyz, and w: 1 for a shade that sends its light down, 0 for a globe
uniform vec3 uLampCol;
uniform float uAmbient;
uniform vec4 uOcc[${N0}];      // boxes that shade what is near them: centre xz, half size xz (y below uOccTop)
uniform float uOccTop[${N0}];
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
  vec4 d = vec4(p.x - ${Q.back.toFixed(1)}, ${Q.front.toFixed(1)} - p.x, p.z, ${Q.depth.toFixed(1)} - p.z);
  float dy0 = p.y - ${Q.floor.toFixed(1)}, dy1 = ${Q.ceiling.toFixed(1)} - p.y;
  // a corner darkens along both walls; a surface does not darken itself
  if (abs(n.y) > 0.5) { ao *= (1.0 - 0.34 * exp(-max(d.x, 0.0) / 160.0)) * (1.0 - 0.3 * exp(-max(d.y, 0.0) / 160.0)) * (1.0 - 0.34 * exp(-max(d.z, 0.0) / 160.0)) * (1.0 - 0.3 * exp(-max(d.w, 0.0) / 160.0)); }
  else {
    ao *= (1.0 - 0.3 * exp(-max(dy0, 0.0) / 150.0)) * (1.0 - 0.22 * exp(-max(dy1, 0.0) / 190.0));
    if (abs(n.x) > 0.5) ao *= (1.0 - 0.3 * exp(-max(d.z, 0.0) / 140.0)) * (1.0 - 0.26 * exp(-max(d.w, 0.0) / 140.0));
    else ao *= (1.0 - 0.3 * exp(-max(d.x, 0.0) / 140.0)) * (1.0 - 0.26 * exp(-max(d.y, 0.0) / 140.0));
  }
  if (n.y > 0.5) {                 // contact shadows fall on what faces up: the floor, a counter, a table top
    for (int i = 0; i < ${N0}; i++) {
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
  for (int i = 0; i < ${tt}; i++) {
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
`,p0=`
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
}`,Rt=`
uniform int uKind;
uniform float uGloss;
varying vec3 vP;
varying vec3 vN;
varying vec3 vCol;
${le}
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
      if (n.x > 0.5 && p.x > ${(V.x1-30).toFixed(1)} && p.z > ${V.z0.toFixed(1)} && p.z < ${V.z1.toFixed(1)}) {
        float wear = smoothstep(${(V.top-150).toFixed(1)}, ${(V.top-25).toFixed(1)}, p.y) * (0.55 + 0.45 * njNoise2(p.zy / vec2(90.0, 24.0)));
        c = mix(c, c * 1.18 + 0.03, wear * 0.55);
      }
    }
  } else if (uKind == 3) {
    c *= 0.95 + 0.07 * njNoise2(p.xy / 60.0 + p.zz / 60.0) + 0.03 * njNoise2(p.xy / 9.0 + p.zx / 9.0);
  } else if (uKind == 4) {
    float v = njNoise2(p.xz / 55.0 + p.yy / 55.0 + 3.0 * njNoise2(p.xz / 160.0));
    c *= 0.94 + 0.08 * smoothstep(0.45, 0.55, v) - 0.16 * smoothstep(0.495, 0.5, v) * smoothstep(0.505, 0.5, v);
    // the island's front edge: years of cups and elbows, faintly grey and rubbed
    float edge = smoothstep(${(V.x1-40).toFixed(1)}, ${(V.x1+12).toFixed(1)}, p.x) * step(${V.z0.toFixed(1)}, p.z) * step(p.z, ${V.z1.toFixed(1)}) * step(${(V.top-30).toFixed(1)}, p.y);
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
    vec3 w = ${ne} - vP;
    col += uGloss * uSkyCol * pow(max(dot(r, normalize(w)), 0.0), 18.0) * njAO(vP, n);
  }
  gl_FragColor = vec4(njShoulder(col), 1.0);
  #include <colorspace_fragment>
}`,Pt=`
uniform sampler2D uWallBake;
uniform vec4 uWallRegion;    // the bake's world x0, y0, x1, y1
uniform vec3 uOak;
varying vec3 vP;
varying vec3 vN;
${le}
vec3 spineCol(float h) {
  float k = fract(h * 7.13);
  vec3 c = k < 0.22 ? vec3(0.05, 0.05, 0.06) : k < 0.38 ? vec3(0.86, 0.83, 0.76) : k < 0.5 ? vec3(0.62, 0.13, 0.1)
         : k < 0.6 ? vec3(0.12, 0.2, 0.42) : k < 0.7 ? vec3(0.82, 0.52, 0.14) : k < 0.78 ? vec3(0.16, 0.34, 0.24)
         : k < 0.88 ? vec3(0.42, 0.4, 0.38) : vec3(0.58, 0.32, 0.22);
  return c * (0.75 + 0.4 * fract(h * 3.7));
}
void main() {
  const float CUB = ${Z.cubby.toFixed(1)}, FR = ${Z.frame.toFixed(1)}, DEP = ${Z.depth.toFixed(1)};
  vec3 p = vP, v = normalize(vP - cameraPosition);
  vec2 cell = floor((p.xy - vec2(${Q.back.toFixed(1)}, ${Q.floor.toFixed(1)})) / CUB);
  vec2 o = vec2(${Q.back.toFixed(1)}, ${Q.floor.toFixed(1)}) + cell * CUB;
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
}`,kt=`
uniform sampler2D uLeafSun;
uniform vec3 uSunU, uSunV;
uniform vec4 uMask;
uniform float uHasLeaves;
varying vec3 vP;
varying vec3 vN;
void main() {
  vec3 v = normalize(vP - cameraPosition);
  float t = (${Q.front.toFixed(1)} - cameraPosition.x) / v.x;
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
  gl_FragColor = vec4(col * 0.97, 1.0);
  #include <colorspace_fragment>
}`,St=`
uniform sampler2D uLeafSun;
uniform vec3 uSunU, uSunV;
uniform vec4 uMask;
uniform float uHasLeaves;
varying vec3 vP;
varying vec3 vN;
void main() {
  float rib = 0.5 + 0.5 * sin(vP.z / 4.2 * 3.14159);
  float hgt = clamp((vP.y - ${T.y0.toFixed(1)}) / ${(T.y1-T.y0).toFixed(1)}, 0.0, 1.0);
  vec3 col = mix(vec3(0.98, 0.9, 0.77), vec3(0.9, 0.92, 0.95), hgt) * (0.9 + 0.08 * rib);
  if (uHasLeaves > 0.5) {
    vec2 uv = (vec2(dot(vP, uSunU), dot(vP, uSunV)) - uMask.xy) / (2.0 * uMask.z) + 0.5;
    col *= 0.86 + 0.14 * texture2D(uLeafSun, uv).r;
  }
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`,Ht=`
uniform float uAlpha;
varying vec3 vP;
varying vec3 vN;
varying vec3 vCol;
${le}
void main() {
  vec3 n = normalize(vN), v = normalize(vP - cameraPosition);
  if (dot(n, v) > 0.0) n = -n;
  float c = clamp(-dot(n, v), 0.0, 1.0), fr = 0.04 + 0.96 * pow(1.0 - c, 5.0);
  vec3 r = reflect(v, n);
  float spec = pow(max(dot(r, normalize(${ne} - vP)), 0.0), 40.0);
  vec3 env = mix(vec3(0.3, 0.27, 0.23), uSkyCol * 0.45, smoothstep(-0.2, 0.7, r.x));
  vec3 refl = env + uSkyCol * spec * 1.6;
  vec3 tint = vCol * njRoomLight(vP, n);
  float a = clamp(fr * 0.9 + uAlpha + spec * 0.5, 0.0, 0.94);
  gl_FragColor = vec4(njShoulder((refl * fr * 0.9 + refl * spec * 0.5 + tint * uAlpha) / max(a, 1e-3)), a);
  #include <colorspace_fragment>
}`,Ft=`
uniform sampler2D uAtlas;
varying vec3 vP;
varying vec3 vN;
varying vec3 vCol;
varying vec2 vUv;
${le}
void main() {
  vec4 t = texture2D(uAtlas, vUv);
  if (t.a < 0.2) discard;
  float cover = clamp((t.a - 0.5) / max(fwidth(t.a), 1e-3) + 0.5, 0.0, 1.0);
  vec3 n = normalize(vN) * (gl_FrontFacing ? 1.0 : -1.0);
  vec3 c = vCol * t.rgb;
  vec3 col = c * (njRoomLight(vP, n) + njBackLight(vP, -n) * 0.45 * vec3(0.85, 1.0, 0.45));
  vec3 v = normalize(vP - cameraPosition), r = reflect(v, n);
  col += 0.07 * uSkyCol * pow(max(dot(r, normalize(${ne} - vP)), 0.0), 10.0);
  gl_FragColor = vec4(njShoulder(col), cover);
  #include <colorspace_fragment>
}`,Ct=`
varying vec3 vCol;
varying vec2 vUv;
void main() {
  vec2 q = (vUv - 0.5) * 2.0;
  float d = dot(q, q), a = vCol.r * exp(-d * 2.6) * smoothstep(1.0, 0.55, d);
  gl_FragColor = vec4(vec3(1.0 - a), 1.0);
}`,At=`
varying vec3 vCol;
void main() { gl_FragColor = vec4(vCol, 1.0);
  #include <colorspace_fragment>
}`,It=`
uniform sampler2D uMap;
uniform float uGain;
varying vec2 vUv;
void main() { gl_FragColor = vec4(texture2D(uMap, vUv).rgb * uGain, 1.0);
  #include <colorspace_fragment>
}`,Gt=`
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
  float win = pow(max(dot(r, normalize(${ne} - vP)), 0.0), 6.0);
  c = c * (1.0 - fr) + vec3(1.0, 0.95, 0.85) * (fr * 0.35 + win * 0.06);
  gl_FragColor = vec4(c, 1.0);
  #include <colorspace_fragment>
}`,jt=`
uniform sampler2D uMap;
varying vec2 vUv;
void main() {
  vec4 t = texture2D(uMap, vUv);
  if (t.a < 0.02) discard;
  gl_FragColor = vec4(t.rgb, t.a);
  #include <colorspace_fragment>
}`,Lt=`
uniform float uGain;
varying vec2 vUv;
void main() {
  vec2 q = (vUv - 0.5) * 2.0;
  float d = length(q * vec2(1.0, 1.35));
  float c = exp(-pow((d - 0.55) / 0.12, 2.0)) * 0.65 + exp(-d * d / 0.16) * 0.45;
  gl_FragColor = vec4(vec3(0.95, 0.46, 0.1) * c * smoothstep(1.0, 0.55, d) * uGain, 1.0);
}`,_t=`
uniform sampler2D uMap;
uniform float uGain;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(uMap, vUv).rgb;
  float down = 1.0 - vUv.y, across = vUv.x - 0.5;
  float pool = exp(-down * down / 0.42) * (0.72 + 0.28 * exp(-across * across / 0.16));
  gl_FragColor = vec4(c * uGain * (0.5 + 0.62 * pool) * vec3(1.0, 0.97, 0.9), 1.0);
  #include <colorspace_fragment>
}`;function B0(p,E,W,G=Be){let F=document.createElement("canvas");F.width=p,F.height=E,W(F.getContext("2d"),p,E);let L=new Qe(F);return L.colorSpace=G,L.anisotropy=4,L}function r0(p){return()=>{p|=0,p=p+1831565813|0;let E=Math.imul(p^p>>>15,1|p);return E=E+Math.imul(E^E>>>7,61|E)^E,((E^E>>>14)>>>0)/4294967296}}var ae={w:1400,h:1e3};function ot(p,E,W){let G=r0(5);p.fillStyle="#1b1f1e",p.fillRect(0,0,E,W);for(let i=0;i<46;i++)p.fillStyle=`rgba(255,255,255,${.012+.022*G()})`,p.beginPath(),p.ellipse(G()*E,G()*W,60+180*G(),30+90*G(),G()*3,0,7),p.fill();let F=(i,U)=>`${i} ${U}px "NJ Menu", "NJ Text", system-ui, sans-serif`,L="rgba(244,240,230,0.96)",q="rgba(236,230,216,0.88)";p.textBaseline="alphabetic",p.fillStyle=L,p.font=F(700,80),p.fillText("Menu",84,124),p.fillRect(84,146,160,5);let H=(i,U,b,d0,A)=>{let P="",K=b;for(let X of i.split(" ")){let S0=P?P+" "+X:X;P&&p.measureText(S0).width>d0?(p.fillText(P,U,K),P=X,K+=A):P=S0}return p.fillText(P,U,K),K},v=(i,U,b)=>(p.fillStyle=L,p.font=F(650,86),p.fillText(U,84,i),p.fillStyle=q,p.font=F(450,70),H(b,84,i+88,E-168,82)),u=v(290,"Cross-platform content","Video, images and posts made for each platform and published for you.");u=v(u+138,"Community management","Comments, messages and requests answered in your brand\u2019s voice."),p.fillStyle="rgba(240,196,120,0.98)",p.font=F(650,74);let m="\u2190 Order here",y=Math.min(W-60,u+132),j=p.measureText(m).width;return p.fillText(m,84,y),{x0:70/E,x1:(98+j)/E,y0:(y-72)/W,y1:(y+22)/W}}var nt=[["#8be9a8","~/njct.io  feat/room"],["#d6d6d6","$ npm run build"],["#9a9a9a","  dist/ matches a fresh build (15 files)"],["#d6d6d6","$ git log --oneline -3"],["#e8c07a","  00c8874 Merge feat/editions into feat/room"],["#e8c07a","  d978d3b The caf\xE9, fixed after review"],["#e8c07a","  9245df6 Caf\xE9 brief: the garden"]],W0=nt.reduce((p,[,E])=>p+E.length,0);function at(p,E,W,G=W0,F=!0){p.clearRect(0,0,E,W);let L=E*.4,q=W*.34,H=E*.56,v=W*.6,u=14;p.fillStyle="rgba(0,0,0,0.25)",p.beginPath(),p.roundRect(L+8,q+14,H,v,u),p.fill(),p.fillStyle="rgba(23,24,27,0.97)",p.beginPath(),p.roundRect(L,q,H,v,u),p.fill(),p.fillStyle="#25262b",p.beginPath(),p.roundRect(L,q,H,30,[u,u,0,0]),p.fill(),["#ff5f57","#febc2e","#28c840"].forEach((i,U)=>{p.fillStyle=i,p.beginPath(),p.arc(L+20+U*20,q+15,6,0,7),p.fill()}),p.font="500 21px ui-monospace, Menlo, Consolas, monospace";let m=G,y=q+62,j=L+18;for(let[i,U]of nt){if(m<=0)break;let b=U.slice(0,m);if(p.fillStyle=i,p.fillText(b,j,y),m-=U.length,m<0){j+=p.measureText(b).width;break}y+=30,j=L+18}F&&(p.fillStyle="#d6d6d6",p.fillRect(m>=0?L+18:j+2,(m>=0,y-18),11,22))}var Ut=`
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
}`,Bt=1.5,Wt=4e6;function Nt(p){let E=new te(4,4,{type:ee,samples:4,depthBuffer:!0}),W=new a0({uniforms:{uSrc:{value:E.texture},uAmount:{value:0}},vertexShader:"varying vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:Ut,depthTest:!1,depthWrite:!1,toneMapped:!1}),G=new oe;G.setAttribute("position",new L0([-1,-1,0,3,-1,0,-1,3,0],3));let F=new u0(G,W);F.frustumCulled=!1;let L=new Ve,q=new De;L.add(F);let H=new he;function v(){p.getDrawingBufferSize(H);let u=Math.min(1,Bt/Math.max(1,p.getPixelRatio())),m=Math.max(1,Math.round(H.x*u)),y=Math.max(1,Math.round(H.y*u)),j=m*y>Wt?2:4;E.samples!==j?(E.dispose(),E=new te(m,y,{type:ee,samples:j,depthBuffer:!0}),W.uniforms.uSrc.value=E.texture):(E.width!==m||E.height!==y)&&E.setSize(m,y)}return{get target(){return v(),E},compile(){p.compile(L,q)},render(u,m,y){v(),p.setRenderTarget(E),p.render(u,m),p.setRenderTarget(null),W.uniforms.uAmount.value=y,p.render(L,q)},dispose(){E.dispose(),W.dispose(),G.dispose()}}}function $t(p){let E=0,W=0;for(let y of p)E+=y.attributes.position.count,W+=y.index?y.index.count:y.attributes.position.count;let G=new Float32Array(E*3),F=new Float32Array(E*3),L=new Float32Array(E*2),q=new Float32Array(E*3),H=E>65535?new Uint32Array(W):new Uint16Array(W),v=0,u=0;for(let y of p){let j=y.attributes,i=j.position.count;if(G.set(j.position.array.subarray(0,i*3),v*3),F.set(j.normal.array.subarray(0,i*3),v*3),j.uv&&L.set(j.uv.array.subarray(0,i*2),v*2),q.set(j.aCol.array,v*3),y.index){let U=y.index.array;for(let b=0;b<U.length;b++)H[u+b]=U[b]+v;u+=U.length}else{for(let U=0;U<i;U++)H[u+U]=v+U;u+=i}v+=i}let m=new oe;return m.setAttribute("position",new w0(G,3)),m.setAttribute("normal",new w0(F,3)),m.setAttribute("uv",new w0(L,2)),m.setAttribute("aCol",new w0(q,3)),m.setIndex(new w0(H,1)),m.computeBoundingSphere(),m}var l={plaster:[.8,.77,.72],ceiling:[.78,.76,.72],floor:[.76,.71,.62],dark:[.035,.032,.03],oak:[.62,.45,.28],teak:[.4,.25,.14],walnut:[.2,.12,.07],bentwood:[.13,.075,.045],steel:[.05,.07,.06],chrome:[.24,.25,.26],stainless:[.44,.45,.46],ink:[.045,.045,.05],brass:[.5,.36,.16],mint:[.36,.56,.46],cream:[.9,.87,.8],terra:[.56,.3,.2],clay:[.7,.5,.36],sage:[.28,.4,.32],marble:[.86,.85,.82],slate:[.09,.1,.1],enamel:[.12,.24,.2],glow:[1,.86,.62],screen:[.1,.12,.16],leafM:[.12,.33,.09],leafF:[.14,.34,.08],leafP:[.2,.42,.1],leafS:[.12,.27,.11],leafB:[.2,.4,.12],stem:[.22,.32,.1],bark:[.25,.18,.12],soil:[.1,.07,.045],beans:[.18,.1,.05],coffee:[.09,.045,.02],tea:[.95,.4,.09],milk:[.95,.9,.8],crust:[.72,.42,.15],cane:[.62,.46,.27],oat:[.74,.66,.54],rust:[.56,.24,.12],indigo:[.08,.12,.27],olive:[.3,.32,.16],clear:[.85,.9,.88]},m0=[[.62,.36,.22],[.85,.8,.7],[.16,.2,.19],[.72,.52,.3],[.3,.44,.4],[.82,.62,.48],[.14,.16,.28]],T0=[[.95,.92,.85],[.9,.55,.25],[.2,.2,.2],[.85,.75,.3]];function Xt({renderer:p,scene:E,lightUniforms:W,sun:G}){let F=new U0;F.visible=!1,E.add(F);let L=[],q=[],H=e=>(L.push(e),e),{front:v,back:u,floor:m,ceiling:y,depth:j}=Q,i=(e,t,n)=>new b0(e,t,n),U=i(0,1,0),b={x0:u,x1:u+V.back,z0:0,z1:2050,top:V.backTop},d0={x0:u,x1:u+300,z0:2065,z1:2345,top:560},A={z0:2440,z1:2740,spring:400},P=V,K={x0:-2058,x1:-1065,d:240,top:760},X=i((N.x0+N.x1)/2,310,(N.z0+N.z1)/2+60),S0=[i((P.x0+P.x1)/2,360,1080),i((P.x0+P.x1)/2,360,1960),i(u+250,470,620)],i0={uWinQ:{value:[T.y0,T.y1].flatMap(e=>[T.z0,T.z1].map(t=>i(Q.front,e,t)))},uPatchQ:{value:[0,1,2,3].map(()=>i(0,0,0))},uWallQ:{value:[i(-Z.niche.x,Q.floor,0),i(Z.niche.x,Q.floor,0),i(Z.niche.x,Z.niche.top,0),i(-Z.niche.x,Z.niche.top,0)]},uSkyCol:{value:i(2.3,2.38,2.55)},uPatchCol:{value:i(2.6,1.6,.78)},uWallCol:{value:i(.86,.82,.76)},uLampP:{value:[...S0.map(e=>new k0(e.x,e.y,e.z,1)),new k0(X.x,X.y,X.z,0)]},uLampCol:{value:i(.95,.6,.28)},uAmbient:{value:.065},uOcc:{value:Array.from({length:N0},()=>new k0(0,0,0,0))},uOccTop:{value:new Array(N0).fill(-1e4)}},H0=i0.uWinQ.value;[H0[2],H0[3]]=[H0[3],H0[2]];function lt(e,t,n){let a=0;for(let o=0;o<4;o++){let s=n[o].clone().sub(e).normalize(),r=n[(o+1)%4].clone().sub(e).normalize(),c=new b0().crossVectors(s,r);a+=Math.acos(Math.max(-1,Math.min(1,s.dot(r))))*t.dot(c)/Math.max(c.length(),1e-6)}return a/(2*Math.PI)}let se=(e,t,n)=>{lt(t,n,e)<0&&e.reverse()},re=i(0,0,1400);if(se(H0,re,i(1,0,0)),se(i0.uWallQ.value,re,i(0,0,-1)),G){let e=G.uniforms.uSunD.value;[[g.y0,g.z0],[g.y0,g.z1],[g.y1,g.z1],[g.y1,g.z0]].map(([n,a])=>i(Q.front,n,a)).forEach((n,a)=>i0.uPatchQ.value[a].copy(n).addScaledVector(e,-n.z/e.z)),se(i0.uPatchQ.value,re,i(0,0,-1))}else i0.uPatchCol.value.set(0,0,0);[[(b.x0+b.x1)/2,(b.z0+b.z1)/2,V.back/2,(b.z1-b.z0)/2,b.top],[(d0.x0+d0.x1)/2,(d0.z0+d0.z1)/2,150,140,d0.top],[(P.x0+P.x1)/2,(P.z0+P.z1)/2,(P.x1-P.x0)/2,(P.z1-P.z0)/2,P.top],[(K.x0+K.x1)/2,K.d/2,(K.x1-K.x0)/2,K.d/2,K.top],[(N.x0+N.x1)/2,(N.z0+N.z1)/2,(N.x1-N.x0)/2,(N.z1-N.z0)/2,N.top],[560,1700,105,105,-366],[630,1430,105,105,-366],[v-70,715,70,485,T.y0],[(Z.niche.x+v)/2,115,(v-Z.niche.x)/2,115,316],[-1e3,430,100,100,-420],[-1347,1510,145,210,P.top+250],[-1330,1935,140,150,P.top+220],[-2270,1160,115,100,b.top+380]].forEach(([e,t,n,a,o],s)=>{i0.uOcc.value[s].set(e,t,n,a),i0.uOccTop.value[s]=o});let xe=H(B0(1024,512,et,Ue)),F0=(e,t={},n={})=>H(new a0({uniforms:{...i0,...t},vertexShader:p0,fragmentShader:e,toneMapped:!1,...n})),J=(e,t=0)=>F0(Rt,{uKind:{value:e},uGloss:{value:t}}),C0={plain:J(0),satin:J(0,.3),chrome:J(0,.9),wood:J(2,.04),flute:J(5,.04),plaster:J(3),marble:J(4,.25),tile:J(1,.04),glazed:J(6,.5),fabric:J(7),cane:J(8),thru:J(9,.2),emit:F0(At),leaf:F0(Ft,{uAtlas:{value:xe}},{side:J0,alphaToCoverage:!0}),glass:F0(Ht,{uAlpha:{value:.05}},{transparent:!0,depthWrite:!1,side:J0}),contact:F0(Ct,{},{transparent:!0,depthWrite:!1,blending:Ie,blendEquation:Ge,blendSrc:je,blendDst:Le,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})},c0=new Map;function O(e,t,n,a){n&&t.applyMatrix4(n);let o=t.attributes.position.count,s=new Float32Array(o*3);for(let r=0;r<o;r++)s.set(a,r*3);return t.setAttribute("aCol",new w0(s,3)),c0.has(e)||c0.set(e,[]),c0.get(e).push(t),t}let ye=new We,st=new Ne,rt=new b0,it=new b0(1,1,1),z=(e=0,t=0,n=0,a=0,o=0,s=0,r=null)=>{let c=new ve().compose(rt.set(e,t,n),ye.setFromEuler(st.set(o,a,s,"YXZ")),it);return r?r.clone().multiply(c):c},f=(e,t,n,a,o,s,r,c,d)=>O(e,new _0(s-n,r-a,c-o).translate((n+s)/2,(a+r)/2,(o+c)/2),d,t),k=(e,t,n,a,o,s,r,c,d=s,h=24)=>O(e,new E0(d,s,r,h).translate(n,a+r/2,o),c,t),x0=(e,t,n,a,o,s,r,c,d,h=16)=>O(e,new Ke(1,h,Math.max(6,h>>1)).scale(s,r,c).translate(n,a,o),d,t),$=(e,t,n,a,o,s,r,c=24)=>O(e,new Xe(n.map(([d,h])=>new he(d,h)),c).translate(a,o,s),r,t),B=(e,t,n,a,o,s,r=8)=>{let c=a.clone().sub(n),d=c.length();return O(e,new E0(o,o,d,r).applyQuaternion(ye.setFromUnitVectors(U,c.normalize())).translate((n.x+a.x)/2,(n.y+a.y)/2,(n.z+a.z)/2),s,t)},f0=(e,t,n,a,o,s=Math.PI*2,r=32)=>O(e,new Ze(n,a,8,r,s),o,t),_=(e,t,n,a,o)=>O(e,new t0(n,a),o,t),ze=(e,t,n,a,o,s)=>{let r=new _0(1,1,1,8,8,2),c=r.attributes.position;for(let d=0;d<c.count;d++){let h=c.getX(d)*2,M=c.getY(d)*2,x=c.getZ(d),S=Math.sqrt(Math.max(0,(1-h**4)*(1-M**4)));c.setXYZ(d,h*n/2*(1-.06*M*M),M*a/2*(1-.06*h*h),x*o*(.18+.82*S))}return r.computeVertexNormals(),O(e,r,s,t)},R0=(e,t,n=.28)=>{let a=1-n/2+n*t();return e.map(o=>o*a)},y0=(e,t,n)=>{let a=new u0(H(e),t);return n&&(a.matrixAutoUpdate=!1,a.matrix.copy(n),a.matrixWorldNeedsUpdate=!0),F.add(a),a};function z0(e,t,n,a,o,s,r=.15,c=0){let d=a.clone().normalize(),h=new b0().crossVectors(d,U);h.lengthSq()<1e-6&&h.set(1,0,0),h.normalize(),c&&h.applyAxisAngle(d,c);let M=new b0().crossVectors(h,d).normalize(),x=new t0(1,1,2,4),S=x.attributes.position,C=x.attributes.uv;for(let I=0;I<S.count;I++){let e0=C.getX(I),Y=C.getY(I),D=(e0-.5)*2;S.setXYZ(I,(e0-.5)*o,Y*s,(-r*Y*Y+.05*D*D)*s),C.setXY(I,((e&3)+e0)/4,1-((e>>2)+1-Y)/2)}x.computeVertexNormals(),x.applyMatrix4(new ve().makeBasis(h,d,M).setPosition(n));let R=x.attributes.position;for(let I=0;I<R.count;I++)R.setXYZ(I,Math.min(Math.max(R.getX(I),u+3),v-3),Math.min(R.getY(I),y-3),Math.min(Math.max(R.getZ(I),3),j-3));x.computeVertexNormals(),O("leaf",x,null,t)}let $0=(e,t,n=3,a=l.stem)=>B("plain",a,e,t,n,null,5);function D0(e,t,n,a,o,s=l.terra,r="satin"){$(r,s,[[0,0],[a*.78,0],[a,o*.92],[a*1.05,o],[a*.95,o],[a*.9,o*.9],[0,o*.9]],e,t,n),k("plain",l.soil,e,t+o*.84,n,a*.9,4,null,a*.9,20)}function ct(e,t,n,a,o,s,r=0,c=2*Math.PI){let d=r0(s);for(let h=0;h<o;h++){let M=r+(c-r)*((h*.618+d()*.25)%1),x=.25+d()*.75,S=a*(.5+d()*.5),C=i(e,t,n),R=C.clone().addScaledVector(i(Math.cos(M)*Math.sin(x),Math.cos(x),Math.sin(M)*Math.sin(x)),S);$0(C,R,3.5),z0(0,R0(l.leafM,d),R,i(Math.cos(M),.45-d()*.7,Math.sin(M)),a*(.68+d()*.2),a*(.62+d()*.2),.16,(d()-.5)*.7)}}function ft(e,t,n,a,o,s=0,r=2*Math.PI,c=20){let d=r0(o),h=i(e+6,t+a*.42,n-4);B("wood",l.bark,i(e,t,n),h,11,null,7);let M=[0,1,2].map(x=>{let S=s+(r-s)*(.2+.3*x),C=.22+.08*x;return h.clone().add(i(Math.cos(S)*a*C,a*(.5+.05*x),Math.sin(S)*a*C))});for(let x of M)B("wood",l.bark,h,x,7,null,6);for(let x=0;x<c;x++){let S=M[x%3],C=.3+.7*((x*.37+d()*.2)%1),R=h.clone().lerp(S,C),I=s+(r-s)*((x*.618+d()*.2)%1),e0=i(Math.cos(I),.5,Math.sin(I)).normalize(),Y=R.clone().addScaledVector(e0,18);$0(R,Y,3);let D=(120+80*d())*(1.1-.3*C);z0(2,R0(l.leafF,d),Y,i(Math.cos(I),.4+d()*.9,Math.sin(I)),D*.62,D,.1,(d()-.5)*.9)}}function q0(e,t,n,a,o=40,s=0){let r=r0(a),c=t.clone().setY(0).normalize(),d=e.clone(),h=0,M=Math.max(2,Math.round(n/32));for(let x=0;x<M;x++){let S=h<s,C=S?30:x<2?16:3;h+=C;let R=d.clone().add(i(c.x*C+(r()-.5)*10,S?-2-r()*3:-26-r()*10,c.z*C+(r()-.5)*10));$0(d,R,1.8);let I=x%2?1:-1,Y=i(-c.z,0,c.x).multiplyScalar(I).multiplyScalar(.7).add(c.clone().multiplyScalar(.7)).add(i(0,-.2-r()*.6,0));z0(1,R0(l.leafP,r),R,Y,o*(.8+r()*.3),o*(.9+r()*.3),.06,(r()-.5)*1.2),d=R}}function ut(e,t,n,a,o,s,r=.2){let c=r0(s);for(let d=0;d<o;d++){let h=c()*6.283,M=4+c()*14;z0(4,R0(l.leafS,c),i(e+Math.cos(h)*M,t,n+Math.sin(h)*M),i(Math.cos(h)*r,1,Math.sin(h)*r),a*.17,a*(.6+c()*.4),-.03,c()*3)}}function g0(e,t,n,a,o,s=38,r=52,c=l.cream,d=90){D0(e,t,n,s,r,c);let h=r0(o);for(let x=0;x<5;x++){let S=x*1.3+h();z0(1,R0(l.leafP,h),i(e+Math.cos(S)*8,t+r*.85,n+Math.sin(S)*8),i(Math.cos(S),.9,Math.sin(S)),34,38,.2,h())}let M=a.clone().setY(0).normalize();q0(i(e+M.x*s,t+r*.9,n+M.z*s),M,120+h()*140+d,o+1,34,d),q0(i(e+M.x*s*.7+M.z*s*.6,t+r*.9,n+M.z*s*.7-M.x*s*.6),M,60+h()*80+d,o+2,32,d)}let ie=(e,t,n,a=l.cream,o=null,s=24,r=38,c=!0)=>{$("satin",a,[[0,0],[s*.68,0],[s*.94,r*.5],[s,r],[s-2.5,r],[s*.92-2.5,r*.5],[0,5]],e,t,n,o,20),f0("satin",a,10,2.6,z(e+s-1,t+r*.55,n,0,0,-Math.PI/2,o),Math.PI,12),c&&k("plain",l.coffee,e,t+r-7,n,s-3,1,o,s-3,18)},ge=(e,t,n,a=l.cream,o=null)=>$("satin",a,[[0,0],[26,0],[40,6],[38,7],[0,3]],e,t,n,o,24),ce=(e,t,n,a=null,o=l.cream)=>{ge(e,t,n,o,a),ie(e,t+4,n,o,a),k("plain",l.milk,e,t+36,n,15,1.5,a,9,16)},V0=(e,t,n,a=60,o=null,s=null)=>{$("glass",l.clear,[[0,0],[21,0],[24,a],[22.5,a],[19.5,4],[0,4]],e,t,n,s,24),o&&k("thru",o,e,t+4,n,19,a*.62,s,21,20)},be=(e,t,n,a,o,s=null)=>{k("glass",l.clear,e,t,n,34,a,s,34,24),k("satin",o,e,t+2,n,31,a*.72,s,31,20),k("satin",l.walnut,e,t+a,n,35,12,s,35,24)},A0=(e,t,n,a,o,s,r,c,d=null,h="z")=>{f("satin",r,e-a/2,t,n-s/2,e+a/2,t+o,n+s/2,d),h==="z"?f("plain",c,e-a/2+8,t+o*.3,n+s/2,e+a/2-8,t+o*.66,n+s/2+1.5,d):f("plain",c,e+a/2,t+o*.3,n-s/2+8,e+a/2+1.5,t+o*.66,n+s/2-8,d)};function fe(e,t,n,a=l.ink,o=null,s=0){let r=z(e,t,n,s,0,0,o);$("satin",a,[[0,0],[44,0],[46,50],[36,78],[12,84],[8,92],[0,94]],0,0,0,r,24),B("satin",a,i(30,16,0),i(72,92,0),4,r),B("satin",a,i(72,92,0),i(96,84,0),3.4,r),f0("satin",a,32,5,z(-40,52,0,0,0,Math.PI/2,r),Math.PI,16)}_("tile",l.floor,v-u,j,z((v+u)/2,m,j/2,0,-Math.PI/2)),_("plaster",l.ceiling,v-u,j,z((v+u)/2,y,j/2,0,Math.PI/2)),_("plaster",l.plaster,v-u,y-m,z((v+u)/2,(m+y)/2,j,Math.PI));{let e=new Oe,t=-(A.z0+A.z1)/2,n=(A.z1-A.z0)/2;e.moveTo(0,m),e.lineTo(0,y),e.lineTo(-j,y),e.lineTo(-j,m),e.lineTo(-A.z1,m),e.lineTo(-A.z1,A.spring),e.absarc(t,A.spring,n,Math.PI,0,!0),e.lineTo(-A.z0,m),e.lineTo(0,m);let a=new Ye(e,24);O("plaster",a,z(u,0,0,Math.PI/2),l.plaster);let o=110,s=24,r=[],c=[],d=[],h=[];for(let R=0;R<=s;R++){let I=Math.PI*(1-R/s),e0=A.spring+n*Math.sin(I),Y=(A.z0+A.z1)/2+n*Math.cos(I);for(let D of[u,u-o])r.push(D,e0,Y),c.push(0,-Math.sin(I),-Math.cos(I)),d.push(0,0);if(R<s){let D=R*2;h.push(D,D+2,D+1,D+1,D+2,D+3)}}let M=new oe;M.setAttribute("position",new L0(r,3)),M.setAttribute("normal",new L0(c,3)),M.setAttribute("uv",new L0(d,2)),M.setIndex(h),O("plaster",M,null,l.plaster),_("plaster",l.plaster,o,A.spring-m,z(u-o/2,(A.spring+m)/2,A.z0,0)),_("plaster",l.plaster,o,A.spring-m,z(u-o/2,(A.spring+m)/2,A.z1,Math.PI));let x=u-520,S=A.z0-60,C=j+400;_("plain",l.dark,C-S,y-m,z(x,(m+y)/2,(S+C)/2,Math.PI/2)),_("plain",[.06,.055,.05],u-o-x,C-S,z((u-o+x)/2,m,(S+C)/2,0,-Math.PI/2)),_("plain",l.dark,u-o-x,C-S,z((u-o+x)/2,A.spring+n+40,(S+C)/2,0,Math.PI/2)),_("plain",l.dark,u-o-x,y-m,z((u-o+x)/2,(m+y)/2,S)),_("plain",l.dark,u-o-x,y-m,z((u-o+x)/2,(m+y)/2,C,Math.PI)),_("plain",l.dark,C-S,y-m,z(u-o,(m+y)/2,(S+C)/2,-Math.PI/2));for(let[R,I]of[[A.z0+4,A.z0+170],[A.z0+196,A.z1-4]]){let e0=new t0(I-R,A.spring-m-70,28,1),Y=e0.attributes.position;for(let D=0;D<Y.count;D++)Y.setZ(D,9*Math.sin(Y.getX(D)/11));e0.computeVertexNormals(),O("thru",e0,z(u-40,(A.spring+m+70)/2,(R+I)/2,Math.PI/2),[.72,.64,.52])}B("chrome",l.brass,i(u-40,A.spring+6,A.z0),i(u-40,A.spring+6,A.z1),5)}let Q0=Q.wall;f("plaster",l.plaster,v,m,0,v+Q0,y,T.z0),f("plaster",l.plaster,v,m,T.z1,v+Q0,y,j),f("plaster",l.plaster,v,m,T.z0,v+Q0,T.y0,T.z1),f("plaster",l.plaster,v,T.y1,T.z0,v+Q0,y,T.z1);let I0=(e,t,n,a)=>f("satin",l.steel,v-4,t,e,v+14,a,n),n0=g.frame;for(let e of[T.z0,g.z0,g.z1-n0,T.z1-n0])I0(e,T.y0,e+n0,T.y1);for(let e of T.sideBars)I0(e-g.bar/2,T.y0,e+g.bar/2,T.y1);for(let e of[T.y0,g.y0,g.y1-n0,T.y1-n0])I0(T.z0,e,T.z1,e+n0);let we=g.y0+(g.y1-g.y0)*g.transom,pt=[g.z0+n0+(g.z1-g.z0-2*n0)/3,g.z0+n0+2*(g.z1-g.z0-2*n0)/3];I0(g.z0,we-g.transomBar/2,g.z1,we+g.transomBar/2);for(let e of pt)I0(e-g.bar/2,g.y0,e+g.bar/2,g.y1);let O0=H(B0(768,256,()=>{})),Ee=()=>{let e=O0.image,t=e.getContext("2d");t.clearRect(0,0,e.width,e.height),t.save(),t.translate(e.width,0),t.scale(-1,1),t.font='700 176px "NJ Lettering", Georgia, serif',t.textAlign="center",t.textBaseline="middle",t.lineJoin="round",t.strokeStyle="#d9ad52",t.lineWidth=12,t.strokeText("njct.io",e.width/2,e.height/2+8),t.fillStyle="#1d1710",t.fillText("njct.io",e.width/2,e.height/2+8),t.restore(),O0.needsUpdate=!0};q.push(new FontFace("NJ Lettering",`url(${new URL("../vendor/fonts/fraunces-lettering.woff2",new URL("../room/shell.js",import.meta.url).href).href})`,{weight:"700"}).load().then(e=>{document.fonts.add(e),Ee()},Ee));let mt=H(new a0({uniforms:{uMap:{value:O0}},vertexShader:p0,fragmentShader:jt,transparent:!0,depthWrite:!1,toneMapped:!1}));y0(new t0(168,56),mt,z(v-3,175,(g.z0+g.z1)/2,-Math.PI/2));let dt=G?.uniforms.uLeaf0.value||null,Me=H(new a0({uniforms:{uLeafSun:{value:dt},uSunU:G?G.uniforms.uSunU:{value:i(1,0,0)},uSunV:G?G.uniforms.uSunV:{value:i(0,1,0)},uMask:G?G.uniforms.uMask:{value:new k0},uHasLeaves:{value:0}},vertexShader:p0,fragmentShader:kt,toneMapped:!1}));y0(new t0(6400,3600),Me,z(v+1900,700,-400,-Math.PI/2));let ht=H(new a0({uniforms:{...Me.uniforms,uLeafSun:{value:G?.uniforms.uLeaf2.value||null}},vertexShader:p0,fragmentShader:St,toneMapped:!1})),X0=(e,t,n,a)=>y0(new t0(n-e,a-t),ht,z(v+6,(t+a)/2,(e+n)/2,-Math.PI/2));X0(T.z0,T.y0,g.z0,T.y1),X0(g.z1,T.y0,T.z1,T.y1),X0(g.z0,T.y0,g.z1,g.y0),X0(g.z0,g.y1,g.z1,T.y1),_("glass",[.84,.92,.88],g.z1-g.z0,g.y1-g.y0,z(v+3,(g.y0+g.y1)/2,(g.z0+g.z1)/2,-Math.PI/2));let l0=Je(p,W),vt=[u,m,v,y];l0.resize(u,m,v,y,360,190),l0.mesh.position.z=-1,l0.mesh.updateMatrixWorld(),l0.mesh.renderOrder=-2,F.add(l0.mesh);let xt=H(new a0({uniforms:{...i0,uWallBake:l0.mesh.material.uniforms.uBake,uWallRegion:{value:new k0(...vt)},uOak:{value:new $e(...l.oak)}},vertexShader:p0,fragmentShader:Pt,toneMapped:!1})),h0=Z.niche.x,Y0=Z.depth,s0=300;y0(new t0(v-h0,s0-m),xt,z((h0+v)/2,(m+s0)/2,Y0)),_("wood",l.oak,Y0,s0-m,z(h0,(m+s0)/2,Y0/2,-Math.PI/2)),f("wood",l.oak,h0,s0,0,v,s0+16,Y0+10),D0(1060,s0+16,112,70,130,l.terra),ct(1060,s0+130,112,180,12,11,Math.PI/2-.2,Math.PI+.3);for(let[e,t]of[[1166,[.85,.82,.75]],[1186,[.16,.16,.18]]])f("satin",t,e-6,s0+16,30,e+6,s0+196,200);f("plaster",l.plaster,-h0-110,m,0,-h0,y,70),_("plaster",l.plaster,-h0-110-u,y-m,z((u-h0-110)/2,(m+y)/2,.5)),f("plain",l.slate,-1700,y-26,380,900,y-14,400);for(let e of[-1300,-500,300])k("plain",l.slate,0,-50,0,26,100,z(e,y-70,390,0,.5),30,20);f("plain",l.ink,b.x0,m,b.z0,b.x1-20,m+60,b.z1),f("flute",l.teak,b.x0,m+60,b.z0,b.x1-10,b.top-20,b.z1),f("marble",l.marble,b.x0,b.top-20,b.z0,b.x1+6,b.top,b.z1+6),_("glazed",l.sage,b.z1,400,z(u+1,b.top+200,b.z1/2,Math.PI/2)),f("wood",l.oak,u,b.top+400,20,u+190,b.top+420,b.z1);{let e=b.top+420,t=u+95,n=r0(31),a=70,o=["cups","glasses","jars","plant","cups","teapot","glasses","jars","cups","plant","bags","cups"];for(let s of o){if(a>b.z1-80)break;if(s==="cups"){for(let r=0;r<3;r++)for(let c=0;c<3-r;c++)k("satin",r?l.cream:l.clay,t,e+r*34,a+c*54+r*27,24,32,null,21,18);a+=190}else if(s==="glasses"){for(let r=0;r<4;r++)V0(t,e,a+r*52,64);a+=230}else if(s==="jars"){for(let r=0;r<3;r++)be(t,e,a+r*78,90+30*n(),r%2?l.beans:[.85,.75,.55]);a+=250}else if(s==="plant")g0(t,e,a+30,i(1,0,.15),40+a,36,48),a+=150;else if(s==="teapot")x0("satin",l.clay,t,e+46,a+30,50,46,50),B("satin",l.clay,i(t,e+46,a+70),i(t+6,e+80,a+110),7),f0("satin",l.clay,24,5,z(t,e+56,a-18,Math.PI/2,0,-Math.PI/2),Math.PI,12),a+=150;else if(s==="bags"){for(let r=0;r<3;r++)A0(t,e,a+r*82,50,150-r*12,74,m0[r+1],T0[r],null,"x");a+=260}}}B("chrome",l.chrome,i(u+196,b.top+392,130),i(u+196,b.top+392,370),3.5);let yt=["Tell me about your brand","I set up and run your channels","A monthly report on what worked"],Te=[],Re=[];yt.forEach((e,t)=>{let n=H(B0(240,360,(r,c,d)=>{r.fillStyle="#f3eee2",r.fillRect(0,0,c,d),r.fillStyle="rgba(0,0,0,0.06)";for(let x=110;x<d-20;x+=34)r.fillRect(18,x,c-36,2);r.fillStyle="#2a2622",r.font='700 64px "NJ Text", system-ui, sans-serif',r.fillText(String(t+1),22,76),r.font='500 30px "NJ Text", system-ui, sans-serif';let h="",M=136;for(let x of e.split(" ")){let S=h?h+" "+x:x;h&&r.measureText(S).width>c-44?(r.fillText(h,22,M),h=x,M+=34):h=S}r.fillText(h,22,M)}));Te.push(n);let a=H(new a0({uniforms:{uMap:{value:n},uGain:{value:.78}},vertexShader:p0,fragmentShader:It,toneMapped:!1,side:J0})),o=324-t*72,s=new U0;s.position.set(u+199,b.top+388,o),s.rotation.set(0,Math.PI/2+(t-1)*.06,(t-1)*.04,"YXZ"),s.add(new u0(H(new t0(64,96).translate(0,-48,0)),a)),F.add(s),Re.push(s),f("chrome",l.chrome,u+194,b.top+384,o-6,u+200,b.top+394,o+6)});let w={y:885,z:1300,w:1e3,h:714},o0=null,K0=H(B0(ae.w,ae.h,(e,t,n)=>{o0=ot(e,t,n)})),zt=new FontFace("NJ Menu",`url(${new URL("../vendor/fonts/bricolage-grotesque-menu.woff2",new URL("../room/shell.js",import.meta.url).href).href})`,{weight:"400 700"});q.push(zt.load().then(e=>{document.fonts.add(e),o0=ot(K0.image.getContext("2d"),ae.w,ae.h),K0.needsUpdate=!0},()=>{}));let gt=H(new a0({uniforms:{uMap:{value:K0},uGain:{value:.95}},vertexShader:p0,fragmentShader:_t,toneMapped:!1}));f("plain",l.slate,u+1,w.y-w.h/2-4,w.z-w.w/2-10,u+14,w.y+w.h/2+4,w.z+w.w/2+10),y0(new t0(w.w,w.h),gt,z(u+16,w.y,w.z,Math.PI/2));for(let e of[w.z-w.w/2-26,w.z+w.w/2+10])f("wood",l.oak,u+1,w.y-w.h/2-20,e,u+20,w.y+w.h/2+20,e+16);for(let e of[w.y-w.h/2-20,w.y+w.h/2+4])f("wood",l.oak,u+1,e,w.z-w.w/2-26,u+20,e+16,w.z+w.w/2+26);for(let e of[w.z-300,w.z+300])B("chrome",l.brass,i(u+20,w.y+w.h/2+30,e),i(u+110,w.y+w.h/2+70,e),4);k("chrome",l.brass,0,-380,0,16,760,z(u+112,w.y+w.h/2+70,w.z,0,Math.PI/2),16,16),f("emit",[1,.86,.62],u+104,w.y+w.h/2+56,w.z-370,u+120,w.y+w.h/2+58,w.z+370);let bt=(e,t)=>i(u+16,w.y+w.h/2-t*w.h,w.z+w.w/2-e*w.w);for(let[e,t]of[[80,700],[1900,2360]]){for(let o of[700,960])f("wood",l.oak,u,o,e,u+170,o+20,t);let n=r0(e+9);g0(u+85,720,e+90,i(1,0,.1),e+1,40,56,l.terra);for(let o=0;o<4;o++)A0(u+85,720,e+210+o*82,56,140+20*n(),70,m0[(o+e)%m0.length],T0[o%T0.length],null,"x");g0(u+85,980,t-110,i(1,0,-.1),e+2,44,60,l.cream);let a=e+190;f("wood",l.walnut,u+14,980,a-78,u+160,1206,a+78),f("fabric",[.07,.07,.075],u+160,994,a-66,u+163,1192,a+66);for(let[o,s]of[[1150,17],[1060,46]])k("satin",[.03,.03,.035],0,-2,0,s,4,z(u+165,o,a,0,0,Math.PI/2),s*.8,24)}{let e=b.top,t=(b.x0+b.x1)/2;f("wood",l.walnut,t-140,e,200,t+120,e+80,580),f("plain",l.ink,t-140,e+4,200,t+120,e+12,580),k("chrome",[.4,.4,.42],t+96,e+80,230,12,10,null,12,16),k("chrome",[.4,.4,.42],t+96,e+80,270,12,10,null,12,16);let n={x:t-20,y:e+80,z:380};B("chrome",l.chrome,i(t+80,e+104,550),i(t-10,e+104,470),3.2),B("chrome",l.chrome,i(t-10,e+104,470),i(n.x+40,e+102,n.z+52),3),k("chrome",l.chrome,t+80,e+80,550,14,26,null,14,16),f("plain",l.ink,n.x+28,e+96,n.z+40,n.x+52,e+104,n.z+64),f("wood",l.oak,t-150,e,40,t+110,e+150,180);for(let o=0;o<14;o++)f("satin",m0[o%m0.length].map(s=>s*.8),t-140,e+10,52+o*9,t+100,e+170-o%3*6,58+o*9);f("satin",[.86,.5,.18],u+6,e,600,u+14,e+177,777),x0("satin",[.12,.1,.09],u+15,e+100,690,1,52,52,null,24),f("wood",l.walnut,t-70,e,600,t+70,e+14,1e3);for(let o of[610,990])f("wood",l.walnut,t-10,e+14,o-8,t+10,e+190,o+8);f("wood",l.walnut,t-56,e+190,600,t+56,e+204,1e3);for(let o of[700,880])f("plain",l.ink,t-44,e+14,o-44,t+44,e+26,o+44),$("glass",l.clear,[[0,0],[40,0],[44,56],[34,92],[28,98],[0,98]],t,e+26,o),k("plain",l.coffee,t,e+28,o,38,34,null,42,20),$("satin",l.cream,[[0,0],[16,0],[56,66],[60,72],[56,72],[14,6],[0,6]],t,e+196,o);fe(t+70,e,1045,l.ink,null,0),f("satin",l.stainless,t-150,e,1110,t-30,e+400,1290),f("satin",l.stainless,t-30,e+250,1120,t+100,e+330,1280),f("plain",l.ink,t-20,e+236,1150,t+70,e+250,1250),f("satin",l.stainless,t-30,e,1120,t+100,e+14,1280),f("emit",[.25,.5,.42],t+100,e+296,1180,t+102,e+316,1220),$("glass",l.clear,[[0,0],[54,0],[58,64],[36,110],[32,120],[0,120]],t+34,e+14,1200),k("plain",l.coffee,t+34,e+16,1200,52,54,null,56,20),k("satin",l.stainless,t-20,e,1420,74,250,null,70,28),k("satin",l.ink,t-20,e+250,1420,50,30,null,30,20),B("chrome",l.chrome,i(t+60,e,1580),i(t+60,e+260,1580),4),f0("chrome",l.chrome,44,3,z(t+20,e+260,1580,0,Math.PI/2)),B("chrome",l.chrome,i(t+60,e+260,1580),i(t+64,e+260,1580),4),$("thru",[.78,.56,.36],[[2,0],[10,0],[40,110],[44,116],[0,116]],t+20,e+150,1580),k("satin",l.stainless,t+20,e,1580,54,90,null,52,24),f("satin",l.ink,t-45,e,1700,t+45,e+110,1790),$("glass",l.clear,[[0,0],[40,0],[52,150],[50,160],[0,160]],t,e+110,1745),[[.5,.16,.06],[.75,.45,.12],[.2,.32,.12],[.62,.1,.12],[.85,.7,.45]].forEach((o,s)=>{$("satin",o,[[0,0],[20,0],[20,120],[9,140],[8,170],[0,170]],t+60,e,1840+s*44,null,16),k("plain",l.ink,t+60,e+170,1840+s*44,9,10,null,9,10)});for(let o=0;o<2;o++)k("satin",[.92,.9,.84],t-60,e,1880+o*70,22,150,null,27,18)}{let{x0:e,x1:t,z0:n,z1:a,top:o}=d0,s=16;f("satin",l.ink,e,m,n,t,m+90,a),f("satin",l.ink,e,o-70,n,t,o,a),f("satin",l.ink,e,m+90,n,t,o-70,n+s),f("satin",l.ink,e,m+90,a-s,t,o-70,a),_("emit",[.96,1,1.04],a-n-2*s,o-70-m-90,z(e+4,(o-70+m+90)/2,(n+a)/2,Math.PI/2));let r=[[.3,.14,.05],[.95,.42,.1],[.92,.9,.85],[.25,.4,.15],[.62,.32,.1]];for(let c=0;c<4;c++){let d=m+100+c*245;f("plain",[.25,.26,.27],e+4,d,n+s,t-24,d+4,a-s);for(let h=0;h<6;h++){let M=r[(c*2+h)%r.length],x=n+44+h*38;$("satin",M,[[0,0],[15,0],[15,110],[7,140],[7,160],[0,160]],t-120,d+4,x,null,14),$("satin",r[(c+h+2)%5],[[0,0],[15,0],[15,110],[7,140],[7,160],[0,160]],t-70,d+4,x+18,null,14)}}_("glass",l.clear,a-n-2*s,o-70-m-90,z(t-6,(o-70+m+90)/2,(n+a)/2,Math.PI/2)),f("chrome",l.chrome,t-4,m+200,a-40,t+14,o-200,a-30),f("emit",[.95,.92,.85],t-1,o-50,n+30,t+1,o-20,a-30)}f("plain",l.ink,P.x0+20,m,P.z0+20,P.x1-20,m+50,P.z1-20),f("flute",l.oak,P.x0+10,m+50,P.z0+10,P.x1-10,P.top-20,P.z1-10),f("marble",l.marble,P.x0-6,P.top-20,P.z0,P.x1+12,P.top,P.z1);{let o=P.top;f("chrome",l.chrome,-1490,o,1300,-1205,o+18,1720),f("satin",l.mint,-1480,o+18,1310,-1215,o+240,1710),f("chrome",l.chrome,-1484,o+240,1306,-1211,o+250,1714);for(let s of[1308,1712])f("chrome",l.chrome,-1480,o+250,s-3,-1215,o+272,s+3);f("satin",l.stainless,-1215,o+40,1336,-1211,o+222,1684);for(let s of[3020/2-1.5])f("satin",[.3,.31,.32],-1211,o+40,s,-1210,o+222,s+3);x0("satin",l.ink,-1210,o+150,3020/2,1.5,20,64,null,24),f("satin",[.85,.78,.6],-1215+6.5,o+147,3020/2-36,-1208,o+153,3020/2+36);for(let s=0;s<2;s++)for(let r=0;r<5;r++)k("satin",r%3===1?l.clay:l.cream,-1410+s*120,o+250,1360+r*(300/4),26,34,null,21,18);for(let s of[1310+400*.32,1310+400*.68])f("chrome",l.chrome,-1530,o+120,s-46,-1480,o+196,s+46),k("chrome",l.chrome,-1510,o+92,s,34,28),k("chrome",l.chrome,-1510,o+70,s,32,22),f("plain",l.ink,-1630,o+74,s-10,-1530,o+90,s+10),k("satin",l.cream,-1510,o+18,s,26,36,null,24,18),k("satin",l.cream,0,-2,0,18,4,z(-1481,o+206,s,0,0,Math.PI/2),18,20);f("chrome",l.chrome,-1560,o,1340,-1480,o+16,1680);for(let s of[1335,1685])B("chrome",l.chrome,i(-1490,o+200,s),i(-1550,o+40,s),5);for(let[s,r]of[[0,0],[-6,44]])$("chrome",l.stainless,[[0,0],[30,0],[30,50],[24,66],[27,72],[0,70]],-1525+s,o,1730+r,null,20);f("satin",l.ink,-1470,o,1215,-1395,o+70,1285)}{let e=P.top;for(let[n,a]of[[1150,l.ink],[1010,[.86,.84,.8]]])f("satin",a,-1475,e,n-50,-1365,e+210,n+50),f("satin",a,-1508,e+70,n-22,-1475,e+120,n+22),k("chrome",l.chrome,-1420,e+210,n,50,26,null,46),k("satin",l.beans,-1420,e+236,n,32,78,null,52),k("glass",l.clear,-1420,e+236,n,36,120,null,64),k("satin",l.ink,-1420,e+356,n,64,10);ce(-1250,e,815),ce(-1250,e,905),V0(-1325,e,860,80,[.62,.42,.26]),$("satin",l.cream,[[0,0],[22,0],[26,30],[12,70],[10,92],[13,96],[0,96]],-1230,e,1050,null,20);let t=r0(77);for(let n=0;n<3;n++){let a=i(-1230+(t()-.5)*40,e+170+t()*50,1050+(t()-.5)*50);$0(i(-1230,e+90,1050),a,1.6),z0(7,[.95,.62,.66],a.clone().add(i(0,-18,0)),i(.6,.5,t()-.5),40,40,0,0),z0(1,R0(l.leafP,t),i(-1230,e+120+n*16,1050),i(t()-.5,.4,t()-.5),22,26,.1,0)}}{let o=P.top,s=210;f("wood",l.oak,-1470,o,1800,-1192,o+16,2090),_("glass",l.clear,290,s,z(-1192,o+16+s/2,3890/2,Math.PI/2)),_("glass",l.clear,278,s,z(-2662/2,o+16+s/2,1800,Math.PI)),_("glass",l.clear,278,s,z(-2662/2,o+16+s/2,2090)),_("glass",l.clear,278,290,z(-2662/2,o+16+s,3890/2,0,-Math.PI/2)),_("glass",l.clear,278,290,z(-2662/2,o+16+s*.5,3890/2,0,-Math.PI/2));for(let[r,c]of[[-1192,1800],[-1192,2090],[-1470,1800],[-1470,2090]])f("chrome",l.brass,r-3,o+16,c-3,r+3,o+16+s,c+3);for(let r=0;r<4;r++)f0("satin",l.crust,26,14,z(-1380+r%2*90,o+30,1860+r*58,r*.7,-Math.PI/2),Math.PI*1.25,14);k("satin",[.94,.86,.72],-1360,o+16+s*.5,3890/2-40,62,52,null,62,32),k("satin",[.62,.32,.2],-1360,o+16+s*.5+52,3890/2-40,62,6,null,62,32);for(let r=0;r<5;r++)k("satin",[.7,.5,.3],-1260,o+16+s*.5+r*8,1900+r%2*6,26,7,null,26,18)}{let e=P.top,t=-1262,n=2200;k("chrome",l.ink,t,e,n,30,6),k("chrome",l.ink,t,e+6,n,8,70);let a=z(t+8,e+112,n,0,0,.55);f("satin",l.ink,-5,-56,-78,5,56,78,a),_("emit",l.screen,146,102,z(5.5,0,0,Math.PI/2,0,0,a)),f("satin",l.ink,-1250,e,2105,-1200,e+14,2150),V0(-1215,e,2270,74)}for(let e of S0){B("plain",l.ink,i(e.x,e.y+80,e.z),i(e.x,y,e.z),2.5),$("satin",l.enamel,[[100,0],[96,24],[72,64],[30,86],[12,94],[0,96]],e.x,e.y-10,e.z,null,32),$("emit",[.95,.82,.62],[[0,92],[12,90],[30,82],[72,60],[94,22],[98,0]],e.x,e.y-10,e.z,null,32),x0("glass",[.95,.85,.7],e.x,e.y+6,e.z,30,36,30,null,20);for(let t=0;t<5;t++){let n=t/5*6.283;B("emit",[1,.7,.34],i(e.x+Math.cos(n)*5,e.y-10,e.z+Math.sin(n)*5),i(e.x+Math.cos(n)*11,e.y+22,e.z+Math.sin(n)*11),1.6,null,5)}x0("emit",[1,.82,.55],e.x,e.y+4,e.z,9,14,9,null,10)}{let{x0:e,x1:t,d:n,top:a}=K,o=[0,1,2,3].map(c=>e+(t-e)*c/3);for(let c of o)for(let d of[14,n-14])f("satin",l.steel,c-7,m,d-7,c+7,a,d+7);let s=[-560,-300,-40,220,480,a-22];for(let c of s)f("wood",l.oak,e-12,c,0,t+12,c+22,n);let r=r0(53);for(let c=0;c<s.length-1;c++){let d=s[c]+22;for(let h=0;h<3;h++){let M=o[h]+24,x=o[h+1]-24,S=n/2+10,C=h===0?["stock","cups","stock","jars","stock"][c]:["bags","mugs","bags","bags","kettles"][(c+h)%5];if(C==="stock")for(let R=M;R<x-90;R+=104)f("plain",c%2?[.62,.5,.36]:[.92,.9,.86],R,d,S-80,R+92,d+120+40*r(),S+70);else if(C==="cups")for(let R=M+30;R<x-20;R+=62)k("satin",[.92,.9,.84],R,d,S,24,170,null,28,16);else if(C==="jars")for(let R=M+40;R<x-30;R+=84)be(R,d,S,110+40*r(),r()<.5?l.beans:[.85,.75,.55]);else if(C==="bags")for(let R=M+34;R<x-30;R+=74)A0(R,d,S+20,60,130+40*r(),60,m0[r()*m0.length|0],T0[r()*T0.length|0]);else if(C==="mugs"){let R=c;for(let I=M+34;I<x-30;I+=70)ie(I,d,S+40,[l.cream,l.sage,l.clay,l.terra][R++%4],null,28,52,!1)}else C==="kettles"&&(fe(M+70,d,S+10,l.stainless),fe(x-90,d,S+10,[.9,.88,.82]))}}g0(e+140,a,n/2,i(0,0,1),61,44,60,l.terra),g0(t-160,a,n/2,i(.2,0,1),62,40,56,l.cream),A0(-1500,a,n/2,60,160,64,m0[2],T0[1]),A0(-1420,a,n/2,60,150,64,m0[4],T0[0])}D0(-1e3,m,430,105,230,l.cream),ft(-1e3,m+200,430,860,91,.3*Math.PI,1.65*Math.PI,34),f("flute",l.oak,v-140,m,240,v,T.y0-22,1190),f("wood",l.oak,v-150,T.y0-22,230,v+4,T.y0,1200),f("fabric",l.oat,v-140,T.y0,250,v-6,T.y0+34,1180),ze("fabric",l.rust,150,140,46,z(v-40,T.y0+104,340,-Math.PI/2,-.22,0)),ze("fabric",l.olive,136,128,42,z(v-42,T.y0+98,1085,-Math.PI/2+.2,-.26,0)),f("wood",l.walnut,v-120,T.y0+34,610,v-20,T.y0+42,760),ce(v-70,T.y0+42,680,null,l.sage),D0(v-60,T.y0+34,1162,38,70,l.cream),ut(v-60,T.y0+92,1162,230,7,17,.08);{let{x0:e,x1:t,z0:n,z1:a,top:o}=N;f("wood",l.oak,e,o-32,n,t,o,a),f("wood",l.oak,e+36,o-86,n+36,t-36,o-32,a-36);for(let s of[e+34,t-34])for(let r of[n+34,a-34])f("wood",l.oak,s-22,m,r-22,s+22,o-32,r+22)}function Pe(e,t,n){let a=z(e,m,t,n),o=254,s=l.bentwood;k("cane",l.cane,0,o-14,0,106,14,a,106,28),f0("wood",s,106,7,z(0,o-10,0,0,Math.PI/2,0,a),Math.PI*2,40);for(let[r,c]of[[[60,o-18,60],[80,0,82]],[[60,o-18,-60],[80,0,-82]],[[-64,o-18,60],[-90,0,84]],[[-64,o-18,-60],[-90,0,-84]]])B("wood",s,i(...r),i(...c),9,a);f0("wood",s,74,5,z(-4,116,0,0,Math.PI/2,0,a),Math.PI*2,32);for(let r of[-1,1])B("wood",s,i(-70,o-8,r*70),i(-98,o+230,r*68),8,a);f0("wood",s,68,8,z(-98,o+230,0,Math.PI/2,0,0,a),Math.PI,24),f0("wood",s,46,5,z(-90,o+196,0,Math.PI/2,0,0,a),Math.PI,20)}Pe(560,1700,-.18),Pe(630,1430,.06);let v0=H(B0(900,576,(e,t,n)=>at(e,t,n)));v0.generateMipmaps=!1,v0.minFilter=_e;let ue=H(new te(640,400,{type:ee,samples:2,depthBuffer:!0})),pe=new qe(2*Math.atan(470/2556)*180/Math.PI,640/400,100,2556*2);pe.position.set(0,0,2556),pe.updateMatrixWorld();let ke=H(new a0({uniforms:{uWall:{value:ue.texture},uTerm:{value:v0},uHasWall:{value:0},uGain:{value:.92}},vertexShader:p0,fragmentShader:Gt,toneMapped:!1})),me=!0,Se=W0,He=!0,wt=0;{let e=N.top,t=z(860,e,1640,.22);f("satin",[.64,.65,.67],-62,0,-88,62,8,88,t),f("plain",l.ink,-12,8,-76,50,8.6,76,t),f("satin",[.55,.56,.58],-56,8,-32,-20,8.4,32,t);let n=z(62,8,0,0,0,-.26,t);f("satin",[.64,.65,.67],-5,0,-88,0,124,88,n),f("plain",l.ink,-5.6,2,-86,-5,122,86,n),y0(new t0(162,104),ke,z(-5.8,63,0,-Math.PI/2,0,0,n));let a=905,o=1820;k("wood",l.teak,a,e,o,40,4,null,40,24),k("thru",l.tea,a,e+6,o,21,60,null,24,24),k("thru",l.milk,a,e+66,o,24,9,null,24.5,24);for(let[r,c,d]of[[-8,5,66],[9,-6,70],[2,10,75]])f("glass",[.9,.95,1],a+r-8,e+d,o+c-8,a+r+8,e+d+14,o+c+8);$("glass",l.clear,[[0,0],[22,0],[24,4],[27,92],[25.5,92],[22.5,6],[0,6]],a,e+4,o,null,28),B("satin",[.95,.95,.92],i(a+6,e+30,o-4),i(a+22,e+136,o-14),3.2),y0(new t0(130,88),H(new a0({uniforms:{uGain:{value:.22}},vertexShader:p0,fragmentShader:Lt,transparent:!0,depthWrite:!1,blending:Ae,toneMapped:!1})),z(a-58,e+.8,o+6,0,-Math.PI/2));let s=z(800,e,1430,-.3);f("plain",[.55,.42,.28],-42,0,-60,42,7,60,s),f("plain",l.cream,-40,7,-58,40,7.5,58,s),B("satin",l.ink,i(-30,10,40),i(30,10,-20),3,s),f("satin",l.ink,-20,0,-42,20,5,42,z(760,e,1840,.5)),ge(790,e,2e3),ie(790,e+4,2e3,l.cream,null,20,30),$("glass",l.clear,[[0,0],[40,0],[44,60],[30,120],[18,150],[20,160],[0,160]],1050,e,1300,null,24),k("glass",[.7,.85,.9],1050,e+4,1300,38,90,null,34,20),V0(990,e,1270,64),g0(1075,e,2010,i(1,0,0),71,34,46,l.terra,80)}B("plain",l.ink,i(X.x,X.y+60,X.z),i(X.x,y,X.z),2.5),x0("emit",[1,.88,.7],X.x,X.y,X.z,64,60,64,null,24);{let e=i(1060,620,1470);for(let t=0;t<3;t++){let n=t*2.094;B("plain",[.6,.52,.4],i(e.x+Math.cos(n)*44,e.y+60,e.z+Math.sin(n)*44),i(e.x,y-200,e.z),1.5)}B("plain",[.6,.52,.4],i(e.x,y-200,e.z),i(e.x,y,e.z),2),g0(e.x,e.y,e.z,i(-1,0,0),81,52,64,l.cream,0),q0(i(e.x-20,e.y+58,e.z+40),i(-.5,0,.86),280,83,38),q0(i(e.x+10,e.y+58,e.z-46),i(-.3,0,-.95),220,84,36)}f("wood",l.walnut,v-14,160,1640,v,580,1980),f("plain",[.92,.88,.8],v-15,182,1662,v-13,558,1958),f("plain",[.82,.48,.22],v-16,260,1720,v-15,480,1900),x0("plain",[.18,.3,.42],v-16.5,340,1810,1,70,70,null,24);let Fe=new E0(150,150,4,64);O("satin",Fe,null,[.035,.035,.04]),c0.get("satin").pop();let Ce=new E0(50,50,4.6,32).translate(0,0,0);O("plain",Ce,null,[.86,.5,.18]),c0.get("plain").pop();let G0=new U0;G0.position.set(-2260,V.backTop+82,380);let Et=new u0(H(Fe),C0.satin),Mt=new u0(H(Ce),C0.plain);G0.add(Et,Mt);for(let e=0;e<3;e++){let t=new _0(12,1,2).translate(26,2.6,0).rotateY(e*2.1);O("plain",t,null,[.95,.9,.8]),c0.get("plain").pop(),G0.add(new u0(H(t),C0.plain))}F.add(G0);let P0=(e,t,n,a,o,s=.3)=>_("contact",[s,0,0],a*2,o*2,z(e,t+.6,n,0,-Math.PI/2));{let e=N.top,t=V.top,n=V.backTop;for(let[a,o,s,r,c]of[[860,1640,80,105,.32],[905,1820,34,34,.38],[800,1430,50,66,.24],[760,1840,26,48,.28],[790,2e3,46,46,.3],[1050,1300,50,50,.34],[990,1270,28,28,.3],[1075,2010,42,42,.34]])P0(a,e,o,s,r,c);for(let[a,o]of[[560,1700],[630,1430]])P0(a,m,o,125,125,.32);for(let a of[N.x0+34,N.x1-34])for(let o of[N.z0+34,N.z1-34])P0(a,m,o,46,46,.3);P0(-1e3,m,430,135,135,.4);for(let[a,o,s,r,c]of[[-1347,1510,165,225,.28],[-1420,1150,70,66,.34],[-1420,1010,70,66,.34],[-1330,1945,150,160,.22],[-1262,2200,36,36,.36],[-1250,815,46,46,.3],[-1250,905,46,46,.3],[-1325,860,30,30,.3],[-1230,1050,30,30,.34]])P0(a,t,o,s,r,c);for(let[a,o,s,r]of[[-2250,390,150,200],[-2245,1190,140,110],[-2260,1420,80,80],[-2240,1745,56,56]])P0(a,n,o,s,r,.26)}for(let[e,t]of c0){let n=H($t(t));for(let o of t)o.dispose();let a=new u0(n,C0[e]);e==="glass"&&(a.renderOrder=2),e==="contact"&&(a.renderOrder=1),F.add(a)}c0.clear();let Z0=new U0;Z0.position.set(-450,y-160,1450),F.add(Z0);let de=(e,t,n)=>{O(e,t,null,n),c0.clear();let a=new u0(H(t),C0[e]);return Z0.add(a),a};de("plain",new E0(4,4,160,8).translate(0,80,0),l.slate),de("plain",new E0(40,46,40,24),l.slate);for(let e=0;e<4;e++)de("wood",new _0(320,6,70).translate(190,-10,0).rotateY(-e*Math.PI/2),l.teak);let j0=Nt(p);L.push(j0);let Tt=[xe,K0,v0,O0,...Te];return{group:F,fan:Z0,finish:j0,get orderCorners(){return o0?[[o0.x0,o0.y0],[o0.x1,o0.y0],[o0.x1,o0.y1],[o0.x0,o0.y1]].map(([e,t])=>bt(e,t)):null},tick(e){G0.rotation.y=-e*(100/3)/60*Math.PI*2,++wt%2===0&&(me=!0);let t=W0/16+7,n=e%t,a=Math.min(W0,Math.floor(n*16)),o=a<W0||Math.floor(n*2)%2===0;return(a!==Se||o!==He)&&(Se=a,He=o,at(v0.image.getContext("2d"),v0.image.width,v0.image.height,a,o),v0.needsUpdate=!0),Re.forEach((s,r)=>{s.rotation.x=.05+.035*Math.sin(e*1.27+r*1.9)+.02*Math.sin(e*3.1+r*.7)}),!0},render(e,t,n,a){if(a&&me){me=!1,F.visible=!1;let o=p.getRenderTarget();p.setRenderTarget(ue),p.render(e,pe),p.setRenderTarget(o),F.visible=!0,ke.uniforms.uHasWall.value=1}j0.render(e,t,n)},async warm(e,t=[],n=[]){F.visible=!0;for(let s of t)s.visible=!0;let a=p.getRenderTarget();p.setRenderTarget(j0.target);let o=p.compileAsync?p.compileAsync(E,e):(p.compile(E,e),null);p.setRenderTarget(a),F.visible=!1;for(let s of t)s.visible=!1;o&&await o,await Promise.allSettled(q);for(let s of[...Tt,...n])p.initTexture(s);j0.compile(),l0.bake(),p.setRenderTarget(ue),p.clear(),p.setRenderTarget(a)},bake(){l0.bake()},setVisible(e){F.visible!==e&&(F.visible=e,e&&l0.bake())},dispose(){E.remove(F),l0.dispose();for(let e of L)e.dispose?.()}}}export{Xt as createShell};
