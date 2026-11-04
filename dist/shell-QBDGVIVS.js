import{a as et}from"./chunk-5BRKVZWJ.js";import"./chunk-UH43Z3T2.js";import{c as tt}from"./chunk-4VAF4GAZ.js";import{j as M0}from"./chunk-6PNQGI4Q.js";import{$ as Ke,B as ve,C as $e,E as De,G as w0,J as U0,K as oe,L as p0,M as S0,N as a0,O as Ve,P as qe,Q as _0,R as Oe,V as Qe,W as E0,X as Xe,Z as Ye,_ as t0,aa as Ze,b as J0,ba as Je,c as Ae,d as Ie,e as Ge,f as je,g as Le,j as Ue,n as ee,q as _e,r as Be,t as We,u as he,v as Ne,w as r0,y as k0,z as te}from"./chunk-X52R7RES.js";var O=M0.room,Z=M0.shelving,q=M0.counter,N=M0.table,b=M0.window,T=M0.shopfront,ot=4,N0=14,ne=`vec3(${O.front.toFixed(1)}, ${((b.y0+b.y1)/2).toFixed(1)}, ${((b.z0+b.z1)/2).toFixed(1)})`,le=`
uniform vec3 uWinQ[4];       // the shopfront's opening (light from the sky and the street)
uniform vec3 uPatchQ[4];     // the sunlit patch on the record wall (warm bounce)
uniform vec3 uWallQ[4];      // the lit record wall around the shelves (neutral bounce)
uniform vec3 uSkyCol, uPatchCol, uWallCol;
uniform vec4 uLampP[${ot}];   // xyz, and w: 1 for a shade that sends its light down, 0 for a globe
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
  vec4 d = vec4(p.x - ${O.back.toFixed(1)}, ${O.front.toFixed(1)} - p.x, p.z, ${O.depth.toFixed(1)} - p.z);
  float dy0 = p.y - ${O.floor.toFixed(1)}, dy1 = ${O.ceiling.toFixed(1)} - p.y;
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
  for (int i = 0; i < ${ot}; i++) {
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
`,m0=`
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
}`,kt=`
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
      if (n.x > 0.5 && p.x > ${(q.x1-30).toFixed(1)} && p.z > ${q.z0.toFixed(1)} && p.z < ${q.z1.toFixed(1)}) {
        float wear = smoothstep(${(q.top-150).toFixed(1)}, ${(q.top-25).toFixed(1)}, p.y) * (0.55 + 0.45 * njNoise2(p.zy / vec2(90.0, 24.0)));
        c = mix(c, c * 1.18 + 0.03, wear * 0.55);
      }
    }
  } else if (uKind == 3) {
    c *= 0.95 + 0.07 * njNoise2(p.xy / 60.0 + p.zz / 60.0) + 0.03 * njNoise2(p.xy / 9.0 + p.zx / 9.0);
  } else if (uKind == 4) {
    float v = njNoise2(p.xz / 55.0 + p.yy / 55.0 + 3.0 * njNoise2(p.xz / 160.0));
    c *= 0.94 + 0.08 * smoothstep(0.45, 0.55, v) - 0.16 * smoothstep(0.495, 0.5, v) * smoothstep(0.505, 0.5, v);
    // the island's front edge: years of cups and elbows, faintly grey and rubbed
    float edge = smoothstep(${(q.x1-40).toFixed(1)}, ${(q.x1+12).toFixed(1)}, p.x) * step(${q.z0.toFixed(1)}, p.z) * step(p.z, ${q.z1.toFixed(1)}) * step(${(q.top-30).toFixed(1)}, p.y);
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
}`,St=`
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
  vec2 cell = floor((p.xy - vec2(${O.back.toFixed(1)}, ${O.floor.toFixed(1)})) / CUB);
  vec2 o = vec2(${O.back.toFixed(1)}, ${O.floor.toFixed(1)}) + cell * CUB;
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
}`,Ht=`
uniform sampler2D uLeafSun;
uniform vec3 uSunU, uSunV;
uniform vec4 uMask;
uniform float uHasLeaves;
varying vec3 vP;
varying vec3 vN;
void main() {
  vec3 v = normalize(vP - cameraPosition);
  float t = (${O.front.toFixed(1)} - cameraPosition.x) / v.x;
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
}`,Ft=`
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
}`,Ct=`
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
}`,At=`
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
}`,It=`
varying vec3 vCol;
varying vec2 vUv;
void main() {
  vec2 q = (vUv - 0.5) * 2.0;
  float d = dot(q, q), a = vCol.r * exp(-d * 2.6) * smoothstep(1.0, 0.55, d);
  gl_FragColor = vec4(vec3(1.0 - a), 1.0);
}`,Gt=`
varying vec3 vCol;
void main() { gl_FragColor = vec4(vCol, 1.0);
  #include <colorspace_fragment>
}`,jt=`
uniform sampler2D uMap;
uniform float uGain;
varying vec2 vUv;
void main() { gl_FragColor = vec4(texture2D(uMap, vUv).rgb * uGain, 1.0);
  #include <colorspace_fragment>
}`,Lt=`
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
}`,Ut=`
uniform sampler2D uMap;
varying vec2 vUv;
void main() {
  vec4 t = texture2D(uMap, vUv);
  if (t.a < 0.02) discard;
  gl_FragColor = vec4(t.rgb, t.a);
  #include <colorspace_fragment>
}`,_t=`
uniform float uGain;
varying vec2 vUv;
void main() {
  vec2 q = (vUv - 0.5) * 2.0;
  float d = length(q * vec2(1.0, 1.35));
  float c = exp(-pow((d - 0.55) / 0.12, 2.0)) * 0.65 + exp(-d * d / 0.16) * 0.45;
  gl_FragColor = vec4(vec3(0.95, 0.46, 0.1) * c * smoothstep(1.0, 0.55, d) * uGain, 1.0);
}`,Bt=`
uniform sampler2D uMap;
uniform float uGain;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(uMap, vUv).rgb;
  float down = 1.0 - vUv.y, across = vUv.x - 0.5;
  float pool = exp(-down * down / 0.42) * (0.72 + 0.28 * exp(-across * across / 0.16));
  gl_FragColor = vec4(c * uGain * (0.5 + 0.62 * pool) * vec3(1.0, 0.97, 0.9), 1.0);
  #include <colorspace_fragment>
}`;function B0(f,E,_,I=Be){let F=document.createElement("canvas");F.width=f,F.height=E,_(F.getContext("2d"),f,E);let L=new Qe(F);return L.colorSpace=I,L.anisotropy=4,L}function i0(f){return()=>{f|=0,f=f+1831565813|0;let E=Math.imul(f^f>>>15,1|f);return E=E+Math.imul(E^E>>>7,61|E)^E,((E^E>>>14)>>>0)/4294967296}}var ae={w:1400,h:1e3};function at(f,E,_){let I=i0(5);f.fillStyle="#1b1f1e",f.fillRect(0,0,E,_);for(let i=0;i<46;i++)f.fillStyle=`rgba(255,255,255,${.012+.022*I()})`,f.beginPath(),f.ellipse(I()*E,I()*_,60+180*I(),30+90*I(),I()*3,0,7),f.fill();let F=(i,C)=>`${i} ${C}px "NJ Menu", "NJ Text", system-ui, sans-serif`,L="rgba(244,240,230,0.96)",$="rgba(236,230,216,0.88)";f.textBaseline="alphabetic",f.fillStyle=L,f.font=F(700,80),f.fillText("Menu",84,124),f.fillRect(84,146,160,5);let H=(i,C,z,h0,G)=>{let k="",K=z;for(let X of i.split(" ")){let H0=k?k+" "+X:X;k&&f.measureText(H0).width>h0?(f.fillText(k,C,K),k=X,K+=G):k=H0}return f.fillText(k,C,K),K},h=(i,C,z)=>(f.fillStyle=L,f.font=F(650,86),f.fillText(C,84,i),f.fillStyle=$,f.font=F(450,70),H(z,84,i+88,E-168,82)),c=h(290,"Cross-platform content","Video, images and posts made for each platform and published for you.");c=h(c+138,"Community management","Comments, messages and requests answered in your brand\u2019s voice."),f.fillStyle="rgba(240,196,120,0.98)",f.font=F(650,74);let p="\u2190 Order here",y=Math.min(_-60,c+132),U=f.measureText(p).width;return f.fillText(p,84,y),{x0:70/E,x1:(98+U)/E,y0:(y-72)/_,y1:(y+22)/_}}var lt=[["#8be9a8","~/njct.io  feat/room"],["#d6d6d6","$ npm run build"],["#9a9a9a","  dist/ matches a fresh build (15 files)"],["#d6d6d6","$ git log --oneline -3"],["#e8c07a","  00c8874 Merge feat/editions into feat/room"],["#e8c07a","  d978d3b The caf\xE9, fixed after review"],["#e8c07a","  9245df6 Caf\xE9 brief: the garden"]],W0=lt.reduce((f,[,E])=>f+E.length,0);function nt(f,E,_,I=W0,F=!0){f.clearRect(0,0,E,_);let L=E*.4,$=_*.34,H=E*.56,h=_*.6,c=14;f.fillStyle="rgba(0,0,0,0.25)",f.beginPath(),f.roundRect(L+8,$+14,H,h,c),f.fill(),f.fillStyle="rgba(23,24,27,0.97)",f.beginPath(),f.roundRect(L,$,H,h,c),f.fill(),f.fillStyle="#25262b",f.beginPath(),f.roundRect(L,$,H,30,[c,c,0,0]),f.fill(),["#ff5f57","#febc2e","#28c840"].forEach((i,C)=>{f.fillStyle=i,f.beginPath(),f.arc(L+20+C*20,$+15,6,0,7),f.fill()}),f.font="500 21px ui-monospace, Menlo, Consolas, monospace";let p=I,y=$+62,U=L+18;for(let[i,C]of lt){if(p<=0)break;let z=C.slice(0,p);if(f.fillStyle=i,f.fillText(z,U,y),p-=C.length,p<0){U+=f.measureText(z).width;break}y+=30,U=L+18}F&&(f.fillStyle="#d6d6d6",f.fillRect(p>=0?L+18:U+2,(p>=0,y-18),11,22))}var Wt=`
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
}`,Nt=1.5,$t=4e6;function Dt(f){let E=new te(4,4,{type:ee,samples:4,depthBuffer:!0}),_=new a0({uniforms:{uSrc:{value:E.texture},uAmount:{value:0}},vertexShader:"varying vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:Wt,depthTest:!1,depthWrite:!1,toneMapped:!1}),I=new oe;I.setAttribute("position",new U0([-1,-1,0,3,-1,0,-1,3,0],3));let F=new p0(I,_);F.frustumCulled=!1;let L=new Oe,$=new Ve;L.add(F);let H=new he;function h(){f.getDrawingBufferSize(H);let c=Math.min(1,Nt/Math.max(1,f.getPixelRatio())),p=Math.max(1,Math.round(H.x*c)),y=Math.max(1,Math.round(H.y*c)),U=p*y>$t?2:4;E.samples!==U?(E.dispose(),E=new te(p,y,{type:ee,samples:U,depthBuffer:!0}),_.uniforms.uSrc.value=E.texture):(E.width!==p||E.height!==y)&&E.setSize(p,y)}return{get target(){return h(),E},compile(){f.compile(L,$)},render(c,p,y){h(),f.setRenderTarget(E),f.render(c,p),f.setRenderTarget(null),_.uniforms.uAmount.value=y,f.render(L,$)},dispose(){E.dispose(),_.dispose(),I.dispose()}}}function Vt(f,E,_,I){let F=new S0(1,1,1,3,3,3),L=F.attributes.position,$=F.attributes.normal,H=[f/2,E/2,_/2],h=H.map(C=>Math.max(C-I,0)),c=new r0,p=new r0,y=new r0,U=We.clamp,i=(C,z)=>Math.abs(C)>.4?Math.sign(C)*H[z]:Math.sign(C)*h[z];for(let C=0;C<L.count;C++){c.set(i(L.getX(C),0),i(L.getY(C),1),i(L.getZ(C),2)),p.set(U(c.x,-h[0],h[0]),U(c.y,-h[1],h[1]),U(c.z,-h[2],h[2])),y.subVectors(c,p);let z=y.length();z>1e-6&&(y.multiplyScalar(I/z),c.copy(p).add(y),$.setXYZ(C,y.x/I,y.y/I,y.z/I)),L.setXYZ(C,c.x,c.y,c.z)}return F}function qt(f){let E=0,_=0;for(let y of f)E+=y.attributes.position.count,_+=y.index?y.index.count:y.attributes.position.count;let I=new Float32Array(E*3),F=new Float32Array(E*3),L=new Float32Array(E*2),$=new Float32Array(E*3),H=E>65535?new Uint32Array(_):new Uint16Array(_),h=0,c=0;for(let y of f){let U=y.attributes,i=U.position.count;if(I.set(U.position.array.subarray(0,i*3),h*3),F.set(U.normal.array.subarray(0,i*3),h*3),U.uv&&L.set(U.uv.array.subarray(0,i*2),h*2),$.set(U.aCol.array,h*3),y.index){let C=y.index.array;for(let z=0;z<C.length;z++)H[c+z]=C[z]+h;c+=C.length}else{for(let C=0;C<i;C++)H[c+C]=h+C;c+=i}h+=i}let p=new oe;return p.setAttribute("position",new w0(I,3)),p.setAttribute("normal",new w0(F,3)),p.setAttribute("uv",new w0(L,2)),p.setAttribute("aCol",new w0($,3)),p.setIndex(new w0(H,1)),p.computeBoundingSphere(),p}var l={plaster:[.8,.77,.72],ceiling:[.78,.76,.72],floor:[.76,.71,.62],dark:[.035,.032,.03],oak:[.62,.45,.28],teak:[.4,.25,.14],walnut:[.2,.12,.07],bentwood:[.13,.075,.045],steel:[.05,.07,.06],chrome:[.24,.25,.26],stainless:[.44,.45,.46],ink:[.045,.045,.05],brass:[.5,.36,.16],mint:[.36,.56,.46],cream:[.9,.87,.8],terra:[.56,.3,.2],clay:[.7,.5,.36],sage:[.28,.4,.32],marble:[.86,.85,.82],slate:[.09,.1,.1],enamel:[.12,.24,.2],glow:[1,.86,.62],screen:[.1,.12,.16],leafM:[.12,.33,.09],leafF:[.14,.34,.08],leafP:[.2,.42,.1],leafS:[.12,.27,.11],leafB:[.2,.4,.12],stem:[.22,.32,.1],bark:[.25,.18,.12],soil:[.1,.07,.045],beans:[.18,.1,.05],coffee:[.09,.045,.02],tea:[.95,.4,.09],milk:[.95,.9,.8],crust:[.72,.42,.15],cane:[.62,.46,.27],oat:[.74,.66,.54],rust:[.56,.24,.12],indigo:[.08,.12,.27],olive:[.3,.32,.16],clear:[.85,.9,.88]},d0=[[.62,.36,.22],[.85,.8,.7],[.16,.2,.19],[.72,.52,.3],[.3,.44,.4],[.82,.62,.48],[.14,.16,.28]],T0=[[.95,.92,.85],[.9,.55,.25],[.2,.2,.2],[.85,.75,.3]];function Zt({renderer:f,scene:E,lightUniforms:_,sun:I}){let F=new _0;F.visible=!1,E.add(F);let L=[],$=[],H=e=>(L.push(e),e),{front:h,back:c,floor:p,ceiling:y,depth:U}=O,i=(e,t,n)=>new r0(e,t,n),C=i(0,1,0),z={x0:c,x1:c+q.back,z0:0,z1:2050,top:q.backTop},h0={x0:c,x1:c+300,z0:2065,z1:2345,top:560},G={z0:2440,z1:2740,spring:400},k=q,K={x0:-2058,x1:-1065,d:240,top:760},X=i((N.x0+N.x1)/2,310,(N.z0+N.z1)/2+60),H0=[i((k.x0+k.x1)/2,360,1080),i((k.x0+k.x1)/2,360,1960),i(c+250,470,620)],c0={uWinQ:{value:[T.y0,T.y1].flatMap(e=>[T.z0,T.z1].map(t=>i(O.front,e,t)))},uPatchQ:{value:[0,1,2,3].map(()=>i(0,0,0))},uWallQ:{value:[i(-Z.niche.x,O.floor,0),i(Z.niche.x,O.floor,0),i(Z.niche.x,Z.niche.top,0),i(-Z.niche.x,Z.niche.top,0)]},uSkyCol:{value:i(2.3,2.38,2.55)},uPatchCol:{value:i(2.6,1.6,.78)},uWallCol:{value:i(.86,.82,.76)},uLampP:{value:[...H0.map(e=>new k0(e.x,e.y,e.z,1)),new k0(X.x,X.y,X.z,0)]},uLampCol:{value:i(.95,.6,.28)},uAmbient:{value:.065},uOcc:{value:Array.from({length:N0},()=>new k0(0,0,0,0))},uOccTop:{value:new Array(N0).fill(-1e4)}},F0=c0.uWinQ.value;[F0[2],F0[3]]=[F0[3],F0[2]];function st(e,t,n){let a=0;for(let o=0;o<4;o++){let s=n[o].clone().sub(e).normalize(),r=n[(o+1)%4].clone().sub(e).normalize(),u=new r0().crossVectors(s,r);a+=Math.acos(Math.max(-1,Math.min(1,s.dot(r))))*t.dot(u)/Math.max(u.length(),1e-6)}return a/(2*Math.PI)}let se=(e,t,n)=>{st(t,n,e)<0&&e.reverse()},re=i(0,0,1400);if(se(F0,re,i(1,0,0)),se(c0.uWallQ.value,re,i(0,0,-1)),I){let e=I.uniforms.uSunD.value;[[b.y0,b.z0],[b.y0,b.z1],[b.y1,b.z1],[b.y1,b.z0]].map(([n,a])=>i(O.front,n,a)).forEach((n,a)=>c0.uPatchQ.value[a].copy(n).addScaledVector(e,-n.z/e.z)),se(c0.uPatchQ.value,re,i(0,0,-1))}else c0.uPatchCol.value.set(0,0,0);[[(z.x0+z.x1)/2,(z.z0+z.z1)/2,q.back/2,(z.z1-z.z0)/2,z.top],[(h0.x0+h0.x1)/2,(h0.z0+h0.z1)/2,150,140,h0.top],[(k.x0+k.x1)/2,(k.z0+k.z1)/2,(k.x1-k.x0)/2,(k.z1-k.z0)/2,k.top],[(K.x0+K.x1)/2,K.d/2,(K.x1-K.x0)/2,K.d/2,K.top],[(N.x0+N.x1)/2,(N.z0+N.z1)/2,(N.x1-N.x0)/2,(N.z1-N.z0)/2,N.top],[560,1700,105,105,-366],[630,1430,105,105,-366],[h-70,715,70,485,T.y0],[(Z.niche.x+h)/2,115,(h-Z.niche.x)/2,115,316],[-1e3,430,100,100,-420],[-1347,1510,145,210,k.top+250],[-1330,1935,140,150,k.top+220],[-2270,1160,115,100,z.top+380]].forEach(([e,t,n,a,o],s)=>{c0.uOcc.value[s].set(e,t,n,a),c0.uOccTop.value[s]=o});let xe=H(B0(1024,512,tt,_e)),C0=(e,t={},n={})=>H(new a0({uniforms:{...c0,...t},vertexShader:m0,fragmentShader:e,toneMapped:!1,...n})),J=(e,t=0)=>C0(kt,{uKind:{value:e},uGloss:{value:t}}),A0={plain:J(0),satin:J(0,.3),chrome:J(0,.9),wood:J(2,.04),flute:J(5,.04),plaster:J(3),marble:J(4,.25),tile:J(1,.04),glazed:J(6,.5),fabric:J(7),cane:J(8),thru:J(9,.2),emit:C0(Gt),leaf:C0(At,{uAtlas:{value:xe}},{side:J0,alphaToCoverage:!0}),glass:C0(Ct,{uAlpha:{value:.05}},{transparent:!0,depthWrite:!1,side:J0}),contact:C0(It,{},{transparent:!0,depthWrite:!1,blending:Ie,blendEquation:Ge,blendSrc:je,blendDst:Le,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})},u0=new Map;function Q(e,t,n,a){n&&t.applyMatrix4(n);let o=t.attributes.position.count,s=new Float32Array(o*3);for(let r=0;r<o;r++)s.set(a,r*3);return t.setAttribute("aCol",new w0(s,3)),u0.has(e)||u0.set(e,[]),u0.get(e).push(t),t}let ye=new Ne,rt=new $e,it=new r0,ct=new r0(1,1,1),g=(e=0,t=0,n=0,a=0,o=0,s=0,r=null)=>{let u=new ve().compose(it.set(e,t,n),ye.setFromEuler(rt.set(o,a,s,"YXZ")),ct);return r?r.clone().multiply(u):u},ut=new Set(["wood","marble","flute","satin","plain","fabric","cane","glazed","chrome"]),m=(e,t,n,a,o,s,r,u,d)=>{let v=s-n,w=r-a,x=u-o,R=Math.min(v,w,x),A=ut.has(e)&&R>=10?Math.min(6,R*.18):0;return Q(e,(A>.5?Vt(v,w,x,A):new S0(v,w,x)).translate((n+s)/2,(a+r)/2,(o+u)/2),d,t)},S=(e,t,n,a,o,s,r,u,d=s,v=24)=>Q(e,new E0(d,s,r,v).translate(n,a+r/2,o),u,t),y0=(e,t,n,a,o,s,r,u,d,v=16)=>Q(e,new Ze(1,v,Math.max(6,v>>1)).scale(s,r,u).translate(n,a,o),d,t),D=(e,t,n,a,o,s,r,u=24)=>Q(e,new Ye(n.map(([d,v])=>new he(d,v)),u).translate(a,o,s),r,t),W=(e,t,n,a,o,s,r=8)=>{let u=a.clone().sub(n),d=u.length();return Q(e,new E0(o,o,d,r).applyQuaternion(ye.setFromUnitVectors(C,u.normalize())).translate((n.x+a.x)/2,(n.y+a.y)/2,(n.z+a.z)/2),s,t)},f0=(e,t,n,a,o,s=Math.PI*2,r=32)=>Q(e,new Je(n,a,8,r,s),o,t),B=(e,t,n,a,o)=>Q(e,new t0(n,a),o,t),ze=(e,t,n,a,o,s)=>{let r=new S0(1,1,1,8,8,2),u=r.attributes.position;for(let d=0;d<u.count;d++){let v=u.getX(d)*2,w=u.getY(d)*2,x=u.getZ(d),R=Math.sqrt(Math.max(0,(1-v**4)*(1-w**4)));u.setXYZ(d,v*n/2*(1-.06*w*w),w*a/2*(1-.06*v*v),x*o*(.18+.82*R))}return r.computeVertexNormals(),Q(e,r,s,t)},R0=(e,t,n=.28)=>{let a=1-n/2+n*t();return e.map(o=>o*a)},z0=(e,t,n)=>{let a=new p0(H(e),t);return n&&(a.matrixAutoUpdate=!1,a.matrix.copy(n),a.matrixWorldNeedsUpdate=!0),F.add(a),a};function g0(e,t,n,a,o,s,r=.15,u=0){let d=a.clone().normalize(),v=new r0().crossVectors(d,C);v.lengthSq()<1e-6&&v.set(1,0,0),v.normalize(),u&&v.applyAxisAngle(d,u);let w=new r0().crossVectors(v,d).normalize(),x=new t0(1,1,2,4),R=x.attributes.position,A=x.attributes.uv;for(let j=0;j<R.count;j++){let e0=A.getX(j),Y=A.getY(j),V=(e0-.5)*2;R.setXYZ(j,(e0-.5)*o,Y*s,(-r*Y*Y+.05*V*V)*s),A.setXY(j,((e&3)+e0)/4,1-((e>>2)+1-Y)/2)}x.computeVertexNormals(),x.applyMatrix4(new ve().makeBasis(v,d,w).setPosition(n));let P=x.attributes.position;for(let j=0;j<P.count;j++)P.setXYZ(j,Math.min(Math.max(P.getX(j),c+3),h-3),Math.min(P.getY(j),y-3),Math.min(Math.max(P.getZ(j),3),U-3));x.computeVertexNormals(),Q("leaf",x,null,t)}let $0=(e,t,n=3,a=l.stem)=>W("plain",a,e,t,n,null,5);function D0(e,t,n,a,o,s=l.terra,r="satin"){D(r,s,[[0,0],[a*.78,0],[a,o*.92],[a*1.05,o],[a*.95,o],[a*.9,o*.9],[0,o*.9]],e,t,n),S("plain",l.soil,e,t+o*.84,n,a*.9,4,null,a*.9,20)}function ft(e,t,n,a,o,s,r=0,u=2*Math.PI){let d=i0(s);for(let v=0;v<o;v++){let w=r+(u-r)*((v*.618+d()*.25)%1),x=.25+d()*.75,R=a*(.5+d()*.5),A=i(e,t,n),P=A.clone().addScaledVector(i(Math.cos(w)*Math.sin(x),Math.cos(x),Math.sin(w)*Math.sin(x)),R);$0(A,P,3.5),g0(0,R0(l.leafM,d),P,i(Math.cos(w),.45-d()*.7,Math.sin(w)),a*(.68+d()*.2),a*(.62+d()*.2),.16,(d()-.5)*.7)}}function pt(e,t,n,a,o,s=0,r=2*Math.PI,u=20){let d=i0(o),v=i(e+6,t+a*.42,n-4);W("wood",l.bark,i(e,t,n),v,11,null,7);let w=[0,1,2].map(x=>{let R=s+(r-s)*(.2+.3*x),A=.22+.08*x;return v.clone().add(i(Math.cos(R)*a*A,a*(.5+.05*x),Math.sin(R)*a*A))});for(let x of w)W("wood",l.bark,v,x,7,null,6);for(let x=0;x<u;x++){let R=w[x%3],A=.3+.7*((x*.37+d()*.2)%1),P=v.clone().lerp(R,A),j=s+(r-s)*((x*.618+d()*.2)%1),e0=i(Math.cos(j),.5,Math.sin(j)).normalize(),Y=P.clone().addScaledVector(e0,18);$0(P,Y,3);let V=(120+80*d())*(1.1-.3*A);g0(2,R0(l.leafF,d),Y,i(Math.cos(j),.4+d()*.9,Math.sin(j)),V*.62,V,.1,(d()-.5)*.9)}}function V0(e,t,n,a,o=40,s=0){let r=i0(a),u=t.clone().setY(0).normalize(),d=e.clone(),v=0,w=Math.max(2,Math.round(n/32));for(let x=0;x<w;x++){let R=v<s,A=R?30:x<2?16:3;v+=A;let P=d.clone().add(i(u.x*A+(r()-.5)*10,R?-2-r()*3:-26-r()*10,u.z*A+(r()-.5)*10));$0(d,P,1.8);let j=x%2?1:-1,Y=i(-u.z,0,u.x).multiplyScalar(j).multiplyScalar(.7).add(u.clone().multiplyScalar(.7)).add(i(0,-.2-r()*.6,0));g0(1,R0(l.leafP,r),P,Y,o*(.8+r()*.3),o*(.9+r()*.3),.06,(r()-.5)*1.2),d=P}}function mt(e,t,n,a,o,s,r=.2){let u=i0(s);for(let d=0;d<o;d++){let v=u()*6.283,w=4+u()*14;g0(4,R0(l.leafS,u),i(e+Math.cos(v)*w,t,n+Math.sin(v)*w),i(Math.cos(v)*r,1,Math.sin(v)*r),a*.17,a*(.6+u()*.4),-.03,u()*3)}}function b0(e,t,n,a,o,s=38,r=52,u=l.cream,d=90){D0(e,t,n,s,r,u);let v=i0(o);for(let x=0;x<5;x++){let R=x*1.3+v();g0(1,R0(l.leafP,v),i(e+Math.cos(R)*8,t+r*.85,n+Math.sin(R)*8),i(Math.cos(R),.9,Math.sin(R)),34,38,.2,v())}let w=a.clone().setY(0).normalize();V0(i(e+w.x*s,t+r*.9,n+w.z*s),w,120+v()*140+d,o+1,34,d),V0(i(e+w.x*s*.7+w.z*s*.6,t+r*.9,n+w.z*s*.7-w.x*s*.6),w,60+v()*80+d,o+2,32,d)}let ie=(e,t,n,a=l.cream,o=null,s=24,r=38,u=!0)=>{D("satin",a,[[0,0],[s*.68,0],[s*.94,r*.5],[s,r],[s-2.5,r],[s*.92-2.5,r*.5],[0,5]],e,t,n,o,20),f0("satin",a,10,2.6,g(e+s-1,t+r*.55,n,0,0,-Math.PI/2,o),Math.PI,12),u&&S("plain",l.coffee,e,t+r-7,n,s-3,1,o,s-3,18)},ge=(e,t,n,a=l.cream,o=null)=>D("satin",a,[[0,0],[26,0],[40,6],[38,7],[0,3]],e,t,n,o,24),ce=(e,t,n,a=null,o=l.cream)=>{ge(e,t,n,o,a),ie(e,t+4,n,o,a),S("plain",l.milk,e,t+36,n,15,1.5,a,9,16)},q0=(e,t,n,a=60,o=null,s=null)=>{D("glass",l.clear,[[0,0],[21,0],[24,a],[22.5,a],[19.5,4],[0,4]],e,t,n,s,24),o&&S("thru",o,e,t+4,n,19,a*.62,s,21,20)},be=(e,t,n,a,o,s=null)=>{S("glass",l.clear,e,t,n,34,a,s,34,24),S("satin",o,e,t+2,n,31,a*.72,s,31,20),S("satin",l.walnut,e,t+a,n,35,12,s,35,24)},I0=(e,t,n,a,o,s,r,u,d=null,v="z")=>{m("satin",r,e-a/2,t,n-s/2,e+a/2,t+o,n+s/2,d),v==="z"?m("plain",u,e-a/2+8,t+o*.3,n+s/2,e+a/2-8,t+o*.66,n+s/2+1.5,d):m("plain",u,e+a/2,t+o*.3,n-s/2+8,e+a/2+1.5,t+o*.66,n+s/2-8,d)};function ue(e,t,n,a=l.ink,o=null,s=0){let r=g(e,t,n,s,0,0,o);D("satin",a,[[0,0],[44,0],[46,50],[36,78],[12,84],[8,92],[0,94]],0,0,0,r,24),W("satin",a,i(30,16,0),i(72,92,0),4,r),W("satin",a,i(72,92,0),i(96,84,0),3.4,r),f0("satin",a,32,5,g(-40,52,0,0,0,Math.PI/2,r),Math.PI,16)}B("tile",l.floor,h-c,U,g((h+c)/2,p,U/2,0,-Math.PI/2)),B("plaster",l.ceiling,h-c,U,g((h+c)/2,y,U/2,0,Math.PI/2)),B("plaster",l.plaster,h-c,y-p,g((h+c)/2,(p+y)/2,U,Math.PI));{let e=new Xe,t=-(G.z0+G.z1)/2,n=(G.z1-G.z0)/2;e.moveTo(0,p),e.lineTo(0,y),e.lineTo(-U,y),e.lineTo(-U,p),e.lineTo(-G.z1,p),e.lineTo(-G.z1,G.spring),e.absarc(t,G.spring,n,Math.PI,0,!0),e.lineTo(-G.z0,p),e.lineTo(0,p);let a=new Ke(e,24);Q("plaster",a,g(c,0,0,Math.PI/2),l.plaster);let o=110,s=24,r=[],u=[],d=[],v=[];for(let P=0;P<=s;P++){let j=Math.PI*(1-P/s),e0=G.spring+n*Math.sin(j),Y=(G.z0+G.z1)/2+n*Math.cos(j);for(let V of[c,c-o])r.push(V,e0,Y),u.push(0,-Math.sin(j),-Math.cos(j)),d.push(0,0);if(P<s){let V=P*2;v.push(V,V+2,V+1,V+1,V+2,V+3)}}let w=new oe;w.setAttribute("position",new U0(r,3)),w.setAttribute("normal",new U0(u,3)),w.setAttribute("uv",new U0(d,2)),w.setIndex(v),Q("plaster",w,null,l.plaster),B("plaster",l.plaster,o,G.spring-p,g(c-o/2,(G.spring+p)/2,G.z0,0)),B("plaster",l.plaster,o,G.spring-p,g(c-o/2,(G.spring+p)/2,G.z1,Math.PI));let x=c-520,R=G.z0-60,A=U+400;B("plain",l.dark,A-R,y-p,g(x,(p+y)/2,(R+A)/2,Math.PI/2)),B("plain",[.06,.055,.05],c-o-x,A-R,g((c-o+x)/2,p,(R+A)/2,0,-Math.PI/2)),B("plain",l.dark,c-o-x,A-R,g((c-o+x)/2,G.spring+n+40,(R+A)/2,0,Math.PI/2)),B("plain",l.dark,c-o-x,y-p,g((c-o+x)/2,(p+y)/2,R)),B("plain",l.dark,c-o-x,y-p,g((c-o+x)/2,(p+y)/2,A,Math.PI)),B("plain",l.dark,A-R,y-p,g(c-o,(p+y)/2,(R+A)/2,-Math.PI/2));for(let[P,j]of[[G.z0+4,G.z0+170],[G.z0+196,G.z1-4]]){let e0=new t0(j-P,G.spring-p-70,28,1),Y=e0.attributes.position;for(let V=0;V<Y.count;V++)Y.setZ(V,9*Math.sin(Y.getX(V)/11));e0.computeVertexNormals(),Q("thru",e0,g(c-40,(G.spring+p+70)/2,(P+j)/2,Math.PI/2),[.72,.64,.52])}W("chrome",l.brass,i(c-40,G.spring+6,G.z0),i(c-40,G.spring+6,G.z1),5)}let O0=O.wall;m("plaster",l.plaster,h,p,0,h+O0,y,T.z0),m("plaster",l.plaster,h,p,T.z1,h+O0,y,U),m("plaster",l.plaster,h,p,T.z0,h+O0,T.y0,T.z1),m("plaster",l.plaster,h,T.y1,T.z0,h+O0,y,T.z1);let G0=(e,t,n,a)=>m("satin",l.steel,h-4,t,e,h+14,a,n),n0=b.frame;for(let e of[T.z0,b.z0,b.z1-n0,T.z1-n0])G0(e,T.y0,e+n0,T.y1);for(let e of T.sideBars)G0(e-b.bar/2,T.y0,e+b.bar/2,T.y1);for(let e of[T.y0,b.y0,b.y1-n0,T.y1-n0])G0(T.z0,e,T.z1,e+n0);let we=b.y0+(b.y1-b.y0)*b.transom,dt=[b.z0+n0+(b.z1-b.z0-2*n0)/3,b.z0+n0+2*(b.z1-b.z0-2*n0)/3];G0(b.z0,we-b.transomBar/2,b.z1,we+b.transomBar/2);for(let e of dt)G0(e-b.bar/2,b.y0,e+b.bar/2,b.y1);let Q0=H(B0(768,256,()=>{})),Ee=()=>{let e=Q0.image,t=e.getContext("2d");t.clearRect(0,0,e.width,e.height),t.save(),t.translate(e.width,0),t.scale(-1,1),t.font='700 176px "NJ Lettering", Georgia, serif',t.textAlign="center",t.textBaseline="middle",t.lineJoin="round",t.strokeStyle="#d9ad52",t.lineWidth=12,t.strokeText("njct.io",e.width/2,e.height/2+8),t.fillStyle="#1d1710",t.fillText("njct.io",e.width/2,e.height/2+8),t.restore(),Q0.needsUpdate=!0};$.push(new FontFace("NJ Lettering",`url(${new URL("../vendor/fonts/fraunces-lettering.woff2",new URL("../room/shell.js",import.meta.url).href).href})`,{weight:"700"}).load().then(e=>{document.fonts.add(e),Ee()},Ee));let ht=H(new a0({uniforms:{uMap:{value:Q0}},vertexShader:m0,fragmentShader:Ut,transparent:!0,depthWrite:!1,toneMapped:!1}));z0(new t0(168,56),ht,g(h-3,175,(b.z0+b.z1)/2,-Math.PI/2));let vt=I?.uniforms.uLeaf0.value||null,Me=H(new a0({uniforms:{uLeafSun:{value:vt},uSunU:I?I.uniforms.uSunU:{value:i(1,0,0)},uSunV:I?I.uniforms.uSunV:{value:i(0,1,0)},uMask:I?I.uniforms.uMask:{value:new k0},uHasLeaves:{value:0}},vertexShader:m0,fragmentShader:Ht,toneMapped:!1}));z0(new t0(6400,3600),Me,g(h+1900,700,-400,-Math.PI/2));let xt=H(new a0({uniforms:{...Me.uniforms,uLeafSun:{value:I?.uniforms.uLeaf2.value||null}},vertexShader:m0,fragmentShader:Ft,toneMapped:!1})),X0=(e,t,n,a)=>z0(new t0(n-e,a-t),xt,g(h+6,(t+a)/2,(e+n)/2,-Math.PI/2));X0(T.z0,T.y0,b.z0,T.y1),X0(b.z1,T.y0,T.z1,T.y1),X0(b.z0,T.y0,b.z1,b.y0),X0(b.z0,b.y1,b.z1,T.y1),B("glass",[.84,.92,.88],b.z1-b.z0,b.y1-b.y0,g(h+3,(b.y0+b.y1)/2,(b.z0+b.z1)/2,-Math.PI/2));let l0=et(f,_),yt=[c,p,h,y];l0.resize(c,p,h,y,360,190),l0.mesh.position.z=-1,l0.mesh.updateMatrixWorld(),l0.mesh.renderOrder=-2,F.add(l0.mesh);let zt=H(new a0({uniforms:{...c0,uWallBake:l0.mesh.material.uniforms.uBake,uWallRegion:{value:new k0(...yt)},uOak:{value:new De(...l.oak)}},vertexShader:m0,fragmentShader:St,toneMapped:!1})),v0=Z.niche.x,Y0=Z.depth,s0=300;z0(new t0(h-v0,s0-p),zt,g((v0+h)/2,(p+s0)/2,Y0)),B("wood",l.oak,Y0,s0-p,g(v0,(p+s0)/2,Y0/2,-Math.PI/2)),m("wood",l.oak,v0,s0,0,h,s0+16,Y0+10),D0(1060,s0+16,112,70,130,l.terra),ft(1060,s0+130,112,180,12,11,Math.PI/2-.2,Math.PI+.3);for(let[e,t]of[[1166,[.85,.82,.75]],[1186,[.16,.16,.18]]])m("satin",t,e-6,s0+16,30,e+6,s0+196,200);m("plaster",l.plaster,-v0-110,p,0,-v0,y,70),B("plaster",l.plaster,-v0-110-c,y-p,g((c-v0-110)/2,(p+y)/2,.5)),m("plain",l.slate,-1700,y-26,380,900,y-14,400);for(let e of[-1300,-500,300])S("plain",l.slate,0,-50,0,26,100,g(e,y-70,390,0,.5),30,20);m("plain",l.ink,z.x0,p,z.z0,z.x1-20,p+60,z.z1),m("flute",l.teak,z.x0,p+60,z.z0,z.x1-10,z.top-20,z.z1),m("marble",l.marble,z.x0,z.top-20,z.z0,z.x1+6,z.top,z.z1+6),B("glazed",l.sage,z.z1,400,g(c+1,z.top+200,z.z1/2,Math.PI/2)),m("wood",l.oak,c,z.top+400,20,c+190,z.top+420,z.z1);{let e=z.top+420,t=c+95,n=i0(31),a=70,o=["cups","glasses","jars","plant","cups","teapot","glasses","jars","cups","plant","bags","cups"];for(let s of o){if(a>z.z1-80)break;if(s==="cups"){for(let r=0;r<3;r++)for(let u=0;u<3-r;u++)S("satin",r?l.cream:l.clay,t,e+r*34,a+u*54+r*27,24,32,null,21,18);a+=190}else if(s==="glasses"){for(let r=0;r<4;r++)q0(t,e,a+r*52,64);a+=230}else if(s==="jars"){for(let r=0;r<3;r++)be(t,e,a+r*78,90+30*n(),r%2?l.beans:[.85,.75,.55]);a+=250}else if(s==="plant")b0(t,e,a+30,i(1,0,.15),40+a,36,48),a+=150;else if(s==="teapot")y0("satin",l.clay,t,e+46,a+30,50,46,50),W("satin",l.clay,i(t,e+46,a+70),i(t+6,e+80,a+110),7),f0("satin",l.clay,24,5,g(t,e+56,a-18,Math.PI/2,0,-Math.PI/2),Math.PI,12),a+=150;else if(s==="bags"){for(let r=0;r<3;r++)I0(t,e,a+r*82,50,150-r*12,74,d0[r+1],T0[r],null,"x");a+=260}}}W("chrome",l.chrome,i(c+196,z.top+392,130),i(c+196,z.top+392,370),3.5);let gt=["Tell me about your brand","I set up and run your channels","A monthly report on what worked"],Te=[],Re=[];gt.forEach((e,t)=>{let n=H(B0(240,360,(r,u,d)=>{r.fillStyle="#f3eee2",r.fillRect(0,0,u,d),r.fillStyle="rgba(0,0,0,0.06)";for(let x=110;x<d-20;x+=34)r.fillRect(18,x,u-36,2);r.fillStyle="#2a2622",r.font='700 64px "NJ Text", system-ui, sans-serif',r.fillText(String(t+1),22,76),r.font='500 30px "NJ Text", system-ui, sans-serif';let v="",w=136;for(let x of e.split(" ")){let R=v?v+" "+x:x;v&&r.measureText(R).width>u-44?(r.fillText(v,22,w),v=x,w+=34):v=R}r.fillText(v,22,w)}));Te.push(n);let a=H(new a0({uniforms:{uMap:{value:n},uGain:{value:.78}},vertexShader:m0,fragmentShader:jt,toneMapped:!1,side:J0})),o=324-t*72,s=new _0;s.position.set(c+199,z.top+388,o),s.rotation.set(0,Math.PI/2+(t-1)*.06,(t-1)*.04,"YXZ"),s.add(new p0(H(new t0(64,96).translate(0,-48,0)),a)),F.add(s),Re.push(s),m("chrome",l.chrome,c+194,z.top+384,o-6,c+200,z.top+394,o+6)});let M={y:885,z:1300,w:1e3,h:714},o0=null,K0=H(B0(ae.w,ae.h,(e,t,n)=>{o0=at(e,t,n)})),bt=new FontFace("NJ Menu",`url(${new URL("../vendor/fonts/bricolage-grotesque-menu.woff2",new URL("../room/shell.js",import.meta.url).href).href})`,{weight:"400 700"});$.push(bt.load().then(e=>{document.fonts.add(e),o0=at(K0.image.getContext("2d"),ae.w,ae.h),K0.needsUpdate=!0},()=>{}));let wt=H(new a0({uniforms:{uMap:{value:K0},uGain:{value:.95}},vertexShader:m0,fragmentShader:Bt,toneMapped:!1}));m("plain",l.slate,c+1,M.y-M.h/2-4,M.z-M.w/2-10,c+14,M.y+M.h/2+4,M.z+M.w/2+10),z0(new t0(M.w,M.h),wt,g(c+16,M.y,M.z,Math.PI/2));for(let e of[M.z-M.w/2-26,M.z+M.w/2+10])m("wood",l.oak,c+1,M.y-M.h/2-20,e,c+20,M.y+M.h/2+20,e+16);for(let e of[M.y-M.h/2-20,M.y+M.h/2+4])m("wood",l.oak,c+1,e,M.z-M.w/2-26,c+20,e+16,M.z+M.w/2+26);for(let e of[M.z-300,M.z+300])W("chrome",l.brass,i(c+20,M.y+M.h/2+30,e),i(c+110,M.y+M.h/2+70,e),4);S("chrome",l.brass,0,-380,0,16,760,g(c+112,M.y+M.h/2+70,M.z,0,Math.PI/2),16,16),m("emit",[1,.86,.62],c+104,M.y+M.h/2+56,M.z-370,c+120,M.y+M.h/2+58,M.z+370);let Et=(e,t)=>i(c+16,M.y+M.h/2-t*M.h,M.z+M.w/2-e*M.w);for(let[e,t]of[[80,700],[1900,2360]]){for(let o of[700,960])m("wood",l.oak,c,o,e,c+170,o+20,t);let n=i0(e+9);b0(c+85,720,e+90,i(1,0,.1),e+1,40,56,l.terra);for(let o=0;o<4;o++)I0(c+85,720,e+210+o*82,56,140+20*n(),70,d0[(o+e)%d0.length],T0[o%T0.length],null,"x");b0(c+85,980,t-110,i(1,0,-.1),e+2,44,60,l.cream);let a=e+190;m("wood",l.walnut,c+14,980,a-78,c+160,1206,a+78),m("fabric",[.07,.07,.075],c+160,994,a-66,c+163,1192,a+66);for(let[o,s]of[[1150,17],[1060,46]])S("satin",[.03,.03,.035],0,-2,0,s,4,g(c+165,o,a,0,0,Math.PI/2),s*.8,24)}{let e=z.top,t=(z.x0+z.x1)/2;m("wood",l.walnut,t-140,e,200,t+120,e+80,580),m("plain",l.ink,t-140,e+4,200,t+120,e+12,580),S("chrome",[.4,.4,.42],t+96,e+80,230,12,10,null,12,16),S("chrome",[.4,.4,.42],t+96,e+80,270,12,10,null,12,16);let n={x:t-20,y:e+80,z:380};W("chrome",l.chrome,i(t+80,e+104,550),i(t-10,e+104,470),3.2),W("chrome",l.chrome,i(t-10,e+104,470),i(n.x+40,e+102,n.z+52),3),S("chrome",l.chrome,t+80,e+80,550,14,26,null,14,16),m("plain",l.ink,n.x+28,e+96,n.z+40,n.x+52,e+104,n.z+64),m("wood",l.oak,t-150,e,40,t+110,e+150,180);for(let o=0;o<14;o++)m("satin",d0[o%d0.length].map(s=>s*.8),t-140,e+10,52+o*9,t+100,e+170-o%3*6,58+o*9);m("satin",[.86,.5,.18],c+6,e,600,c+14,e+177,777),y0("satin",[.12,.1,.09],c+15,e+100,690,1,52,52,null,24),m("wood",l.walnut,t-70,e,600,t+70,e+14,1e3);for(let o of[610,990])m("wood",l.walnut,t-10,e+14,o-8,t+10,e+190,o+8);m("wood",l.walnut,t-56,e+190,600,t+56,e+204,1e3);for(let o of[700,880])m("plain",l.ink,t-44,e+14,o-44,t+44,e+26,o+44),D("glass",l.clear,[[0,0],[40,0],[44,56],[34,92],[28,98],[0,98]],t,e+26,o),S("plain",l.coffee,t,e+28,o,38,34,null,42,20),D("satin",l.cream,[[0,0],[16,0],[56,66],[60,72],[56,72],[14,6],[0,6]],t,e+196,o);ue(t+70,e,1045,l.ink,null,0),m("satin",l.stainless,t-150,e,1110,t-30,e+400,1290),m("satin",l.stainless,t-30,e+250,1120,t+100,e+330,1280),m("plain",l.ink,t-20,e+236,1150,t+70,e+250,1250),m("satin",l.stainless,t-30,e,1120,t+100,e+14,1280),m("emit",[.25,.5,.42],t+100,e+296,1180,t+102,e+316,1220),D("glass",l.clear,[[0,0],[54,0],[58,64],[36,110],[32,120],[0,120]],t+34,e+14,1200),S("plain",l.coffee,t+34,e+16,1200,52,54,null,56,20),S("satin",l.stainless,t-20,e,1420,74,250,null,70,28),S("satin",l.ink,t-20,e+250,1420,50,30,null,30,20),W("chrome",l.chrome,i(t+60,e,1580),i(t+60,e+260,1580),4),f0("chrome",l.chrome,44,3,g(t+20,e+260,1580,0,Math.PI/2)),W("chrome",l.chrome,i(t+60,e+260,1580),i(t+64,e+260,1580),4),D("thru",[.78,.56,.36],[[2,0],[10,0],[40,110],[44,116],[0,116]],t+20,e+150,1580),S("satin",l.stainless,t+20,e,1580,54,90,null,52,24),m("satin",l.ink,t-45,e,1700,t+45,e+110,1790),D("glass",l.clear,[[0,0],[40,0],[52,150],[50,160],[0,160]],t,e+110,1745),[[.5,.16,.06],[.75,.45,.12],[.2,.32,.12],[.62,.1,.12],[.85,.7,.45]].forEach((o,s)=>{D("satin",o,[[0,0],[20,0],[20,120],[9,140],[8,170],[0,170]],t+60,e,1840+s*44,null,16),S("plain",l.ink,t+60,e+170,1840+s*44,9,10,null,9,10)});for(let o=0;o<2;o++)S("satin",[.92,.9,.84],t-60,e,1880+o*70,22,150,null,27,18)}{let{x0:e,x1:t,z0:n,z1:a,top:o}=h0,s=16;m("satin",l.ink,e,p,n,t,p+90,a),m("satin",l.ink,e,o-70,n,t,o,a),m("satin",l.ink,e,p+90,n,t,o-70,n+s),m("satin",l.ink,e,p+90,a-s,t,o-70,a),B("emit",[.96,1,1.04],a-n-2*s,o-70-p-90,g(e+4,(o-70+p+90)/2,(n+a)/2,Math.PI/2));let r=[[.3,.14,.05],[.95,.42,.1],[.92,.9,.85],[.25,.4,.15],[.62,.32,.1]];for(let u=0;u<4;u++){let d=p+100+u*245;m("plain",[.25,.26,.27],e+4,d,n+s,t-24,d+4,a-s);for(let v=0;v<6;v++){let w=r[(u*2+v)%r.length],x=n+44+v*38;D("satin",w,[[0,0],[15,0],[15,110],[7,140],[7,160],[0,160]],t-120,d+4,x,null,14),D("satin",r[(u+v+2)%5],[[0,0],[15,0],[15,110],[7,140],[7,160],[0,160]],t-70,d+4,x+18,null,14)}}B("glass",l.clear,a-n-2*s,o-70-p-90,g(t-6,(o-70+p+90)/2,(n+a)/2,Math.PI/2)),m("chrome",l.chrome,t-4,p+200,a-40,t+14,o-200,a-30),m("emit",[.95,.92,.85],t-1,o-50,n+30,t+1,o-20,a-30)}m("plain",l.ink,k.x0+20,p,k.z0+20,k.x1-20,p+50,k.z1-20),m("flute",l.oak,k.x0+10,p+50,k.z0+10,k.x1-10,k.top-20,k.z1-10),m("marble",l.marble,k.x0-6,k.top-20,k.z0,k.x1+12,k.top,k.z1);{let o=k.top;m("chrome",l.chrome,-1490,o,1300,-1205,o+18,1720),m("satin",l.mint,-1480,o+18,1310,-1215,o+240,1710),m("chrome",l.chrome,-1484,o+240,1306,-1211,o+250,1714);for(let s of[1308,1712])m("chrome",l.chrome,-1480,o+250,s-3,-1215,o+272,s+3);m("satin",l.stainless,-1215,o+40,1336,-1211,o+222,1684);for(let s of[3020/2-1.5])m("satin",[.3,.31,.32],-1211,o+40,s,-1210,o+222,s+3);y0("satin",l.ink,-1210,o+150,3020/2,1.5,20,64,null,24),m("satin",[.85,.78,.6],-1215+6.5,o+147,3020/2-36,-1208,o+153,3020/2+36);for(let s=0;s<2;s++)for(let r=0;r<5;r++)S("satin",r%3===1?l.clay:l.cream,-1410+s*120,o+250,1360+r*(300/4),26,34,null,21,18);for(let s of[1310+400*.32,1310+400*.68])m("chrome",l.chrome,-1530,o+120,s-46,-1480,o+196,s+46),S("chrome",l.chrome,-1510,o+92,s,34,28),S("chrome",l.chrome,-1510,o+70,s,32,22),m("plain",l.ink,-1630,o+74,s-10,-1530,o+90,s+10),S("satin",l.cream,-1510,o+18,s,26,36,null,24,18),S("satin",l.cream,0,-2,0,18,4,g(-1481,o+206,s,0,0,Math.PI/2),18,20);m("chrome",l.chrome,-1560,o,1340,-1480,o+16,1680);for(let s of[1335,1685])W("chrome",l.chrome,i(-1490,o+200,s),i(-1550,o+40,s),5);for(let[s,r]of[[0,0],[-6,44]])D("chrome",l.stainless,[[0,0],[30,0],[30,50],[24,66],[27,72],[0,70]],-1525+s,o,1730+r,null,20);m("satin",l.ink,-1470,o,1215,-1395,o+70,1285)}{let e=k.top;for(let[n,a]of[[1150,l.ink],[1010,[.86,.84,.8]]])m("satin",a,-1475,e,n-50,-1365,e+210,n+50),m("satin",a,-1508,e+70,n-22,-1475,e+120,n+22),S("chrome",l.chrome,-1420,e+210,n,50,26,null,46),S("satin",l.beans,-1420,e+236,n,32,78,null,52),S("glass",l.clear,-1420,e+236,n,36,120,null,64),S("satin",l.ink,-1420,e+356,n,64,10);ce(-1250,e,815),ce(-1250,e,905),q0(-1325,e,860,80,[.62,.42,.26]),D("satin",l.cream,[[0,0],[22,0],[26,30],[12,70],[10,92],[13,96],[0,96]],-1230,e,1050,null,20);let t=i0(77);for(let n=0;n<3;n++){let a=i(-1230+(t()-.5)*40,e+170+t()*50,1050+(t()-.5)*50);$0(i(-1230,e+90,1050),a,1.6),g0(7,[.95,.62,.66],a.clone().add(i(0,-18,0)),i(.6,.5,t()-.5),40,40,0,0),g0(1,R0(l.leafP,t),i(-1230,e+120+n*16,1050),i(t()-.5,.4,t()-.5),22,26,.1,0)}}{let o=k.top,s=210;m("wood",l.oak,-1470,o,1800,-1192,o+16,2090),B("glass",l.clear,290,s,g(-1192,o+16+s/2,3890/2,Math.PI/2)),B("glass",l.clear,278,s,g(-2662/2,o+16+s/2,1800,Math.PI)),B("glass",l.clear,278,s,g(-2662/2,o+16+s/2,2090)),B("glass",l.clear,278,290,g(-2662/2,o+16+s,3890/2,0,-Math.PI/2)),B("glass",l.clear,278,290,g(-2662/2,o+16+s*.5,3890/2,0,-Math.PI/2));for(let[r,u]of[[-1192,1800],[-1192,2090],[-1470,1800],[-1470,2090]])m("chrome",l.brass,r-3,o+16,u-3,r+3,o+16+s,u+3);for(let r=0;r<4;r++)f0("satin",l.crust,26,14,g(-1380+r%2*90,o+30,1860+r*58,r*.7,-Math.PI/2),Math.PI*1.25,14);S("satin",[.94,.86,.72],-1360,o+16+s*.5,3890/2-40,62,52,null,62,32),S("satin",[.62,.32,.2],-1360,o+16+s*.5+52,3890/2-40,62,6,null,62,32);for(let r=0;r<5;r++)S("satin",[.7,.5,.3],-1260,o+16+s*.5+r*8,1900+r%2*6,26,7,null,26,18)}{let e=k.top,t=-1262,n=2200;S("chrome",l.ink,t,e,n,30,6),S("chrome",l.ink,t,e+6,n,8,70);let a=g(t+8,e+112,n,0,0,.55);m("satin",l.ink,-5,-56,-78,5,56,78,a),B("emit",l.screen,146,102,g(5.5,0,0,Math.PI/2,0,0,a)),m("satin",l.ink,-1250,e,2105,-1200,e+14,2150),q0(-1215,e,2270,74)}for(let e of H0){W("plain",l.ink,i(e.x,e.y+80,e.z),i(e.x,y,e.z),2.5),D("satin",l.enamel,[[100,0],[96,24],[72,64],[30,86],[12,94],[0,96]],e.x,e.y-10,e.z,null,32),D("emit",[.95,.82,.62],[[0,92],[12,90],[30,82],[72,60],[94,22],[98,0]],e.x,e.y-10,e.z,null,32),y0("glass",[.95,.85,.7],e.x,e.y+6,e.z,30,36,30,null,20);for(let t=0;t<5;t++){let n=t/5*6.283;W("emit",[1,.7,.34],i(e.x+Math.cos(n)*5,e.y-10,e.z+Math.sin(n)*5),i(e.x+Math.cos(n)*11,e.y+22,e.z+Math.sin(n)*11),1.6,null,5)}y0("emit",[1,.82,.55],e.x,e.y+4,e.z,9,14,9,null,10)}{let{x0:e,x1:t,d:n,top:a}=K,o=[0,1,2,3].map(u=>e+(t-e)*u/3);for(let u of o)for(let d of[14,n-14])m("satin",l.steel,u-7,p,d-7,u+7,a,d+7);let s=[-560,-300,-40,220,480,a-22];for(let u of s)m("wood",l.oak,e-12,u,0,t+12,u+22,n);let r=i0(53);for(let u=0;u<s.length-1;u++){let d=s[u]+22;for(let v=0;v<3;v++){let w=o[v]+24,x=o[v+1]-24,R=n/2+10,A=v===0?["stock","cups","stock","jars","stock"][u]:["bags","mugs","bags","bags","kettles"][(u+v)%5];if(A==="stock")for(let P=w;P<x-90;P+=104)m("plain",u%2?[.62,.5,.36]:[.92,.9,.86],P,d,R-80,P+92,d+120+40*r(),R+70);else if(A==="cups")for(let P=w+30;P<x-20;P+=62)S("satin",[.92,.9,.84],P,d,R,24,170,null,28,16);else if(A==="jars")for(let P=w+40;P<x-30;P+=84)be(P,d,R,110+40*r(),r()<.5?l.beans:[.85,.75,.55]);else if(A==="bags")for(let P=w+34;P<x-30;P+=74)I0(P,d,R+20,60,130+40*r(),60,d0[r()*d0.length|0],T0[r()*T0.length|0]);else if(A==="mugs"){let P=u;for(let j=w+34;j<x-30;j+=70)ie(j,d,R+40,[l.cream,l.sage,l.clay,l.terra][P++%4],null,28,52,!1)}else A==="kettles"&&(ue(w+70,d,R+10,l.stainless),ue(x-90,d,R+10,[.9,.88,.82]))}}b0(e+140,a,n/2,i(0,0,1),61,44,60,l.terra),b0(t-160,a,n/2,i(.2,0,1),62,40,56,l.cream),I0(-1500,a,n/2,60,160,64,d0[2],T0[1]),I0(-1420,a,n/2,60,150,64,d0[4],T0[0])}D0(-1e3,p,430,105,230,l.cream),pt(-1e3,p+200,430,860,91,.3*Math.PI,1.65*Math.PI,34),m("flute",l.oak,h-140,p,240,h,T.y0-22,1190),m("wood",l.oak,h-150,T.y0-22,230,h+4,T.y0,1200),m("fabric",l.oat,h-140,T.y0,250,h-6,T.y0+34,1180),ze("fabric",l.rust,150,140,46,g(h-40,T.y0+104,340,-Math.PI/2,-.22,0)),ze("fabric",l.olive,136,128,42,g(h-42,T.y0+98,1085,-Math.PI/2+.2,-.26,0)),m("wood",l.walnut,h-120,T.y0+34,610,h-20,T.y0+42,760),ce(h-70,T.y0+42,680,null,l.sage),D0(h-60,T.y0+34,1162,38,70,l.cream),mt(h-60,T.y0+92,1162,230,7,17,.08);{let{x0:e,x1:t,z0:n,z1:a,top:o}=N;m("wood",l.oak,e,o-32,n,t,o,a),m("wood",l.oak,e+36,o-86,n+36,t-36,o-32,a-36);for(let s of[e+34,t-34])for(let r of[n+34,a-34])m("wood",l.oak,s-22,p,r-22,s+22,o-32,r+22)}function Pe(e,t,n){let a=g(e,p,t,n),o=254,s=l.bentwood;S("cane",l.cane,0,o-14,0,106,14,a,106,28),f0("wood",s,106,7,g(0,o-10,0,0,Math.PI/2,0,a),Math.PI*2,40);for(let[r,u]of[[[60,o-18,60],[80,0,82]],[[60,o-18,-60],[80,0,-82]],[[-64,o-18,60],[-90,0,84]],[[-64,o-18,-60],[-90,0,-84]]])W("wood",s,i(...r),i(...u),9,a);f0("wood",s,74,5,g(-4,116,0,0,Math.PI/2,0,a),Math.PI*2,32);for(let r of[-1,1])W("wood",s,i(-70,o-8,r*70),i(-98,o+230,r*68),8,a);f0("wood",s,68,8,g(-98,o+230,0,Math.PI/2,0,0,a),Math.PI,24),f0("wood",s,46,5,g(-90,o+196,0,Math.PI/2,0,0,a),Math.PI,20)}Pe(560,1700,-.18),Pe(630,1430,.06);let x0=H(B0(900,576,(e,t,n)=>nt(e,t,n)));x0.generateMipmaps=!1,x0.minFilter=Ue;let fe=H(new te(640,400,{type:ee,samples:2,depthBuffer:!0})),pe=new qe(2*Math.atan(470/2556)*180/Math.PI,640/400,100,2556*2);pe.position.set(0,0,2556),pe.updateMatrixWorld();let ke=H(new a0({uniforms:{uWall:{value:fe.texture},uTerm:{value:x0},uHasWall:{value:0},uGain:{value:.92}},vertexShader:m0,fragmentShader:Lt,toneMapped:!1})),me=!0,Se=W0,He=!0,Mt=0;{let e=N.top,t=g(860,e,1640,.22);m("satin",[.64,.65,.67],-62,0,-88,62,8,88,t),m("plain",l.ink,-12,8,-76,50,8.6,76,t),m("satin",[.55,.56,.58],-56,8,-32,-20,8.4,32,t);let n=g(62,8,0,0,0,-.26,t);m("satin",[.64,.65,.67],-5,0,-88,0,124,88,n),m("plain",l.ink,-5.6,2,-86,-5,122,86,n),z0(new t0(162,104),ke,g(-5.8,63,0,-Math.PI/2,0,0,n));let a=905,o=1820;S("wood",l.teak,a,e,o,40,4,null,40,24),S("thru",l.tea,a,e+6,o,21,60,null,24,24),S("thru",l.milk,a,e+66,o,24,9,null,24.5,24);for(let[r,u,d]of[[-8,5,66],[9,-6,70],[2,10,75]])m("glass",[.9,.95,1],a+r-8,e+d,o+u-8,a+r+8,e+d+14,o+u+8);D("glass",l.clear,[[0,0],[22,0],[24,4],[27,92],[25.5,92],[22.5,6],[0,6]],a,e+4,o,null,28),W("satin",[.95,.95,.92],i(a+6,e+30,o-4),i(a+22,e+136,o-14),3.2),z0(new t0(130,88),H(new a0({uniforms:{uGain:{value:.22}},vertexShader:m0,fragmentShader:_t,transparent:!0,depthWrite:!1,blending:Ae,toneMapped:!1})),g(a-58,e+.8,o+6,0,-Math.PI/2));let s=g(800,e,1430,-.3);m("plain",[.55,.42,.28],-42,0,-60,42,7,60,s),m("plain",l.cream,-40,7,-58,40,7.5,58,s),W("satin",l.ink,i(-30,10,40),i(30,10,-20),3,s),m("satin",l.ink,-20,0,-42,20,5,42,g(760,e,1840,.5)),ge(790,e,2e3),ie(790,e+4,2e3,l.cream,null,20,30),D("glass",l.clear,[[0,0],[40,0],[44,60],[30,120],[18,150],[20,160],[0,160]],1050,e,1300,null,24),S("glass",[.7,.85,.9],1050,e+4,1300,38,90,null,34,20),q0(990,e,1270,64),b0(1075,e,2010,i(1,0,0),71,34,46,l.terra,80)}W("plain",l.ink,i(X.x,X.y+60,X.z),i(X.x,y,X.z),2.5),y0("emit",[1,.88,.7],X.x,X.y,X.z,64,60,64,null,24);{let e=i(1060,620,1470);for(let t=0;t<3;t++){let n=t*2.094;W("plain",[.6,.52,.4],i(e.x+Math.cos(n)*44,e.y+60,e.z+Math.sin(n)*44),i(e.x,y-200,e.z),1.5)}W("plain",[.6,.52,.4],i(e.x,y-200,e.z),i(e.x,y,e.z),2),b0(e.x,e.y,e.z,i(-1,0,0),81,52,64,l.cream,0),V0(i(e.x-20,e.y+58,e.z+40),i(-.5,0,.86),280,83,38),V0(i(e.x+10,e.y+58,e.z-46),i(-.3,0,-.95),220,84,36)}m("wood",l.walnut,h-14,160,1640,h,580,1980),m("plain",[.92,.88,.8],h-15,182,1662,h-13,558,1958),m("plain",[.82,.48,.22],h-16,260,1720,h-15,480,1900),y0("plain",[.18,.3,.42],h-16.5,340,1810,1,70,70,null,24);let Fe=new E0(150,150,4,64);Q("satin",Fe,null,[.035,.035,.04]),u0.get("satin").pop();let Ce=new E0(50,50,4.6,32).translate(0,0,0);Q("plain",Ce,null,[.86,.5,.18]),u0.get("plain").pop();let j0=new _0;j0.position.set(-2260,q.backTop+82,380);let Tt=new p0(H(Fe),A0.satin),Rt=new p0(H(Ce),A0.plain);j0.add(Tt,Rt);for(let e=0;e<3;e++){let t=new S0(12,1,2).translate(26,2.6,0).rotateY(e*2.1);Q("plain",t,null,[.95,.9,.8]),u0.get("plain").pop(),j0.add(new p0(H(t),A0.plain))}F.add(j0);let P0=(e,t,n,a,o,s=.3)=>B("contact",[s,0,0],a*2,o*2,g(e,t+.6,n,0,-Math.PI/2));{let e=N.top,t=q.top,n=q.backTop;for(let[a,o,s,r,u]of[[860,1640,80,105,.32],[905,1820,34,34,.38],[800,1430,50,66,.24],[760,1840,26,48,.28],[790,2e3,46,46,.3],[1050,1300,50,50,.34],[990,1270,28,28,.3],[1075,2010,42,42,.34]])P0(a,e,o,s,r,u);for(let[a,o]of[[560,1700],[630,1430]])P0(a,p,o,125,125,.32);for(let a of[N.x0+34,N.x1-34])for(let o of[N.z0+34,N.z1-34])P0(a,p,o,46,46,.3);P0(-1e3,p,430,135,135,.4);for(let[a,o,s,r,u]of[[-1347,1510,165,225,.28],[-1420,1150,70,66,.34],[-1420,1010,70,66,.34],[-1330,1945,150,160,.22],[-1262,2200,36,36,.36],[-1250,815,46,46,.3],[-1250,905,46,46,.3],[-1325,860,30,30,.3],[-1230,1050,30,30,.34]])P0(a,t,o,s,r,u);for(let[a,o,s,r]of[[-2250,390,150,200],[-2245,1190,140,110],[-2260,1420,80,80],[-2240,1745,56,56]])P0(a,n,o,s,r,.26)}for(let[e,t]of u0){let n=H(qt(t));for(let o of t)o.dispose();let a=new p0(n,A0[e]);e==="glass"&&(a.renderOrder=2),e==="contact"&&(a.renderOrder=1),F.add(a)}u0.clear();let Z0=new _0;Z0.position.set(-450,y-160,1450),F.add(Z0);let de=(e,t,n)=>{Q(e,t,null,n),u0.clear();let a=new p0(H(t),A0[e]);return Z0.add(a),a};de("plain",new E0(4,4,160,8).translate(0,80,0),l.slate),de("plain",new E0(40,46,40,24),l.slate);for(let e=0;e<4;e++)de("wood",new S0(320,6,70).translate(190,-10,0).rotateY(-e*Math.PI/2),l.teak);let L0=Dt(f);L.push(L0);let Pt=[xe,K0,x0,Q0,...Te];return{group:F,fan:Z0,finish:L0,get orderCorners(){return o0?[[o0.x0,o0.y0],[o0.x1,o0.y0],[o0.x1,o0.y1],[o0.x0,o0.y1]].map(([e,t])=>Et(e,t)):null},tick(e){j0.rotation.y=-e*(100/3)/60*Math.PI*2,++Mt%2===0&&(me=!0);let t=W0/16+7,n=e%t,a=Math.min(W0,Math.floor(n*16)),o=a<W0||Math.floor(n*2)%2===0;return(a!==Se||o!==He)&&(Se=a,He=o,nt(x0.image.getContext("2d"),x0.image.width,x0.image.height,a,o),x0.needsUpdate=!0),Re.forEach((s,r)=>{s.rotation.x=.05+.035*Math.sin(e*1.27+r*1.9)+.02*Math.sin(e*3.1+r*.7)}),!0},render(e,t,n,a){if(a&&me){me=!1,F.visible=!1;let o=f.getRenderTarget();f.setRenderTarget(fe),f.render(e,pe),f.setRenderTarget(o),F.visible=!0,ke.uniforms.uHasWall.value=1}L0.render(e,t,n)},async warm(e,t=[],n=[]){F.visible=!0;for(let s of t)s.visible=!0;let a=f.getRenderTarget();f.setRenderTarget(L0.target);let o=f.compileAsync?f.compileAsync(E,e):(f.compile(E,e),null);f.setRenderTarget(a),F.visible=!1;for(let s of t)s.visible=!1;o&&await o,await Promise.allSettled($);for(let s of[...Pt,...n])f.initTexture(s);L0.compile(),l0.bake(),f.setRenderTarget(fe),f.clear(),f.setRenderTarget(a)},bake(){l0.bake()},setVisible(e){F.visible!==e&&(F.visible=e,e&&l0.bake())},dispose(){E.remove(F),l0.dispose();for(let e of L)e.dispose?.()}}}export{Zt as createShell};
