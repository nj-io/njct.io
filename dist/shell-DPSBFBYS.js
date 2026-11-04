import{a as Se}from"./chunk-X4EZXVCQ.js";import"./chunk-BFLXD5RH.js";import{A as u0,B as g0,C as B0,D as k0,E as W0,F as r0,G as be,I as J0,J as Ee,N as we,O as M0,P as ge,R as ke,S as l0,T as Me,U as Te,V as Pe,b as O0,i as K0,k as ve,l as he,o as X0,p as xe,q as f0,s as x0,t as Y0,v as Z0,w as ye,y as ze}from"./chunk-KKW47EVM.js";import{j as p0}from"./chunk-6PNQGI4Q.js";var $=p0.room,Y=p0.shelving,_0=p0.counter,q=p0.table,g=p0.window,y=p0.shopfront,Re=4,T0=14,te=`vec3(${$.front.toFixed(1)}, ${((g.y0+g.y1)/2).toFixed(1)}, ${((g.z0+g.z1)/2).toFixed(1)})`,N0=`
uniform vec3 uWinQ[4];       // the shopfront's opening (light from the sky and the street)
uniform vec3 uPatchQ[4];     // the sunlit patch on the record wall (warm bounce)
uniform vec3 uWallQ[4];      // the lit record wall around the shelves (neutral bounce)
uniform vec3 uSkyCol, uPatchCol, uWallCol;
uniform vec4 uLampP[${Re}];   // xyz, and w: 1 for a shade that sends its light down, 0 for a globe
uniform vec3 uLampCol;
uniform float uAmbient;
uniform vec4 uOcc[${T0}];      // boxes that shade what is near them: centre xz, half size xz (y below uOccTop)
uniform float uOccTop[${T0}];
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
  vec4 d = vec4(p.x - ${$.back.toFixed(1)}, ${$.front.toFixed(1)} - p.x, p.z, ${$.depth.toFixed(1)} - p.z);
  float dy0 = p.y - ${$.floor.toFixed(1)}, dy1 = ${$.ceiling.toFixed(1)} - p.y;
  // a corner darkens along both walls; a surface does not darken itself
  if (abs(n.y) > 0.5) { ao *= (1.0 - 0.34 * exp(-max(d.x, 0.0) / 160.0)) * (1.0 - 0.3 * exp(-max(d.y, 0.0) / 160.0)) * (1.0 - 0.34 * exp(-max(d.z, 0.0) / 160.0)) * (1.0 - 0.3 * exp(-max(d.w, 0.0) / 160.0)); }
  else {
    ao *= (1.0 - 0.3 * exp(-max(dy0, 0.0) / 150.0)) * (1.0 - 0.22 * exp(-max(dy1, 0.0) / 190.0));
    if (abs(n.x) > 0.5) ao *= (1.0 - 0.3 * exp(-max(d.z, 0.0) / 140.0)) * (1.0 - 0.26 * exp(-max(d.w, 0.0) / 140.0));
    else ao *= (1.0 - 0.3 * exp(-max(d.x, 0.0) / 140.0)) * (1.0 - 0.26 * exp(-max(d.y, 0.0) / 140.0));
  }
  if (n.y > 0.5) {                 // contact shadows fall on what faces up: the floor, a counter, a table top
    for (int i = 0; i < ${T0}; i++) {
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
  for (int i = 0; i < ${Re}; i++) {
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
}`,Ue=`
uniform int uKind;
uniform float uGloss;
varying vec3 vP;
varying vec3 vN;
varying vec3 vCol;
${N0}
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
    vec3 w = ${te} - vP;
    col += uGloss * uSkyCol * pow(max(dot(r, normalize(w)), 0.0), 18.0) * njAO(vP, n);
  }
  gl_FragColor = vec4(njShoulder(col), 1.0);
  #include <colorspace_fragment>
}`,qe=`
uniform sampler2D uWallBake;
uniform vec4 uWallRegion;    // the bake's world x0, y0, x1, y1
uniform vec3 uOak;
varying vec3 vP;
varying vec3 vN;
${N0}
vec3 spineCol(float h) {
  float k = fract(h * 7.13);
  vec3 c = k < 0.22 ? vec3(0.05, 0.05, 0.06) : k < 0.38 ? vec3(0.86, 0.83, 0.76) : k < 0.5 ? vec3(0.62, 0.13, 0.1)
         : k < 0.6 ? vec3(0.12, 0.2, 0.42) : k < 0.7 ? vec3(0.82, 0.52, 0.14) : k < 0.78 ? vec3(0.16, 0.34, 0.24)
         : k < 0.88 ? vec3(0.42, 0.4, 0.38) : vec3(0.58, 0.32, 0.22);
  return c * (0.75 + 0.4 * fract(h * 3.7));
}
void main() {
  const float CUB = ${Y.cubby.toFixed(1)}, FR = ${Y.frame.toFixed(1)}, DEP = ${Y.depth.toFixed(1)};
  vec3 p = vP, v = normalize(vP - cameraPosition);
  vec2 cell = floor((p.xy - vec2(${$.back.toFixed(1)}, ${$.floor.toFixed(1)})) / CUB);
  vec2 o = vec2(${$.back.toFixed(1)}, ${$.floor.toFixed(1)}) + cell * CUB;
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
}`,De=`
uniform sampler2D uLeafSun;
uniform vec3 uSunU, uSunV;
uniform vec4 uMask;
uniform float uHasLeaves;
varying vec3 vP;
varying vec3 vN;
void main() {
  vec3 v = normalize(vP - cameraPosition);
  float t = (${$.front.toFixed(1)} - cameraPosition.x) / v.x;
  vec3 q = cameraPosition + v * t;            // where the sight line crosses the glass
  float hgt = clamp((vP.y - ${g.y0.toFixed(1)}) / ${(g.y1-g.y0).toFixed(1)}, 0.0, 1.0);
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
}`,Oe=`
uniform sampler2D uLeafSun;
uniform vec3 uSunU, uSunV;
uniform vec4 uMask;
uniform float uHasLeaves;
varying vec3 vP;
varying vec3 vN;
void main() {
  float rib = 0.5 + 0.5 * sin(vP.z / 4.2 * 3.14159);
  float hgt = clamp((vP.y - ${y.y0.toFixed(1)}) / ${(y.y1-y.y0).toFixed(1)}, 0.0, 1.0);
  vec3 col = mix(vec3(0.98, 0.9, 0.77), vec3(0.9, 0.92, 0.95), hgt) * (0.9 + 0.08 * rib);
  if (uHasLeaves > 0.5) {
    vec2 uv = (vec2(dot(vP, uSunU), dot(vP, uSunV)) - uMask.xy) / (2.0 * uMask.z) + 0.5;
    col *= 0.86 + 0.14 * texture2D(uLeafSun, uv).r;
  }
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`,Ke=`
uniform float uAlpha;
varying vec3 vP;
varying vec3 vN;
varying vec3 vCol;
${N0}
void main() {
  vec3 n = normalize(vN), v = normalize(vP - cameraPosition);
  if (dot(n, v) > 0.0) n = -n;
  float c = clamp(-dot(n, v), 0.0, 1.0), fr = 0.04 + 0.96 * pow(1.0 - c, 5.0);
  vec3 r = reflect(v, n);
  float spec = pow(max(dot(r, normalize(${te} - vP)), 0.0), 40.0);
  vec3 env = mix(vec3(0.3, 0.27, 0.23), uSkyCol * 0.45, smoothstep(-0.2, 0.7, r.x));
  vec3 refl = env + uSkyCol * spec * 1.6;
  vec3 tint = vCol * njRoomLight(vP, n);
  float a = clamp(fr * 0.9 + uAlpha + spec * 0.5, 0.0, 0.94);
  gl_FragColor = vec4(njShoulder((refl * fr * 0.9 + refl * spec * 0.5 + tint * uAlpha) / max(a, 1e-3)), a);
  #include <colorspace_fragment>
}`,Xe=`
uniform sampler2D uAtlas;
varying vec3 vP;
varying vec3 vN;
varying vec3 vCol;
varying vec2 vUv;
${N0}
void main() {
  vec4 t = texture2D(uAtlas, vUv);
  if (t.a < 0.2) discard;
  float cover = clamp((t.a - 0.5) / max(fwidth(t.a), 1e-3) + 0.5, 0.0, 1.0);
  vec3 n = normalize(vN) * (gl_FrontFacing ? 1.0 : -1.0);
  vec3 c = vCol * t.rgb;
  vec3 col = c * (njRoomLight(vP, n) + njBackLight(vP, -n) * 0.45 * vec3(0.85, 1.0, 0.45));
  vec3 v = normalize(vP - cameraPosition), r = reflect(v, n);
  col += 0.07 * uSkyCol * pow(max(dot(r, normalize(${te} - vP)), 0.0), 10.0);
  gl_FragColor = vec4(njShoulder(col), cover);
  #include <colorspace_fragment>
}`,Ye=`
varying vec3 vCol;
void main() { gl_FragColor = vec4(vCol, 1.0);
  #include <colorspace_fragment>
}`,Ce=`
uniform sampler2D uMap;
uniform float uGain;
varying vec2 vUv;
void main() { gl_FragColor = vec4(texture2D(uMap, vUv).rgb * uGain, 1.0);
  #include <colorspace_fragment>
}`;function ee(l,z,I,j=he){let S=document.createElement("canvas");S.width=l,S.height=z,I(S.getContext("2d"),l,z);let G=new we(S);return G.colorSpace=j,G.anisotropy=4,G}function o0(l){return()=>{l|=0,l=l+1831565813|0;let z=Math.imul(l^l>>>15,1|l);return z=z+Math.imul(z^z>>>7,61|z)^z,((z^z>>>14)>>>0)/4294967296}}function Ze(l,z,I){let j=o0(5);l.fillStyle="#1b1f1e",l.fillRect(0,0,z,I);for(let G=0;G<40;G++)l.fillStyle=`rgba(255,255,255,${.012+.02*j()})`,l.beginPath(),l.ellipse(j()*z,j()*I,60+160*j(),30+80*j(),j()*3,0,7),l.fill();l.fillStyle="rgba(244,240,230,0.94)",l.textBaseline="alphabetic",l.font='600 92px "NJ Text", system-ui, sans-serif',l.fillText("Menu",80,150),l.fillRect(80,178,220,4);let S=(G,k,v)=>{l.font='600 62px "NJ Text", system-ui, sans-serif',l.fillStyle="rgba(244,240,230,0.94)",l.fillText(k,80,G),l.font='400 34px "NJ Text", system-ui, sans-serif',l.fillStyle="rgba(232,226,212,0.78)";let c=v.split(" "),f="",h=G+56;for(let P of c)l.measureText(f+P).width>z-180&&(l.fillText(f,80,h),f="",h+=44),f+=P+" ";l.fillText(f,80,h)};S(320,"Cross-platform content","Video, images and posts made for each platform and published for you."),S(560,"Community management","Comments, messages and requests answered in your brand's voice."),l.font='600 40px "NJ Text", system-ui, sans-serif',l.fillStyle="rgba(240,196,120,0.95)",l.fillText("Order here \u2192",80,I-70)}function Je(l,z,I){let j=l.createLinearGradient(0,0,0,I);j.addColorStop(0,"#e9e4da"),j.addColorStop(1,"#d8d1c3"),l.fillStyle=j,l.fillRect(0,0,z,I);let S=l.createRadialGradient(z*.58,I*.42,10,z*.58,I*.42,z*.42);S.addColorStop(0,"rgba(255,214,150,0.75)"),S.addColorStop(1,"rgba(255,214,150,0)"),l.fillStyle=S,l.fillRect(0,0,z,I);let G=[["#151515","#f08a24"],["#2f6fe8","#bcd6ff"],["#0f5e55","#8fe0c8"],["#1d3b2a","#f3f0e6"],["#dccdf6","#9b7be0"],["#ffd23f","#e2412f"],["#f6f4ef","#2fa35c"],["#efe6d2","#f07a18"],["#1f2a44","#f5c04a"],["#e9e2f8","#7a5cd6"]],k=I*.24;G.forEach(([U,E],N)=>{let A=N<5?0:1,H=N%5,D=z*.04+H*(k+I*.03),V=A?I*.6:I*.22;l.fillStyle="rgba(0,0,0,0.12)",l.fillRect(D+6,V+8,k,k),l.fillStyle=U,l.fillRect(D,V,k,k),l.fillStyle=E,l.beginPath(),l.arc(D+k*(.35+.3*(N%3)/2),V+k*.62,k*.22,0,7),l.fill(),l.fillRect(D+k*.1,V+k*.1,k*.5,k*.1)}),l.fillStyle="#f4f1ea",l.fillRect(0,I*.22+k+2,z,7),l.fillRect(0,I*.6+k+2,z,7);let v=z*.4,c=I*.34,f=z*.56,h=I*.6,P=14;l.fillStyle="rgba(0,0,0,0.25)",l.beginPath(),l.roundRect(v+8,c+14,f,h,P),l.fill(),l.fillStyle="#17181b",l.beginPath(),l.roundRect(v,c,f,h,P),l.fill(),l.fillStyle="#25262b",l.beginPath(),l.roundRect(v,c,f,30,[P,P,0,0]),l.fill(),["#ff5f57","#febc2e","#28c840"].forEach((U,E)=>{l.fillStyle=U,l.beginPath(),l.arc(v+20+E*20,c+15,6,0,7),l.fill()});let u=[["#8be9a8","~/njct.io  feat/room"],["#d6d6d6","$ npm run build"],["#9a9a9a","  dist/ matches a fresh build"],["#d6d6d6","$ git log --oneline -3"],["#e8c07a","  0d72dde The sun: a plain window"],["#e8c07a",`  490f3f2 Tagline: "Products I've designed`],["#e8c07a","  18a1db7 Merge feat/sun into feat/room"],["#d6d6d6","$ \u2588"]];l.font="500 21px ui-monospace, Menlo, Consolas, monospace",u.forEach(([U,E],N)=>{l.fillStyle=U,l.fillText(E,v+18,c+62+N*30)})}function et(l,z,I){l.clearRect(0,0,z,I);let S=(c,f)=>{l.save(),l.translate(c%4*256,(c>>2)*256),l.beginPath(),l.rect(0,0,256,256),l.clip(),f(),l.restore()},G=(c,f)=>{l.fillStyle=c,l.beginPath(),f(),l.fill()},k=(c,f)=>{l.save(),l.globalCompositeOperation=c,f(),l.restore()},v=(c,f,h)=>{l.lineWidth=c,l.strokeStyle=f,l.lineCap="round",l.lineJoin="round",l.beginPath(),l.moveTo(...h[0]);for(let P=1;P<h.length;P++)l.lineTo(...h[P]);l.stroke()};S(0,()=>{G("#d6d6d6",()=>{l.moveTo(128,226),l.bezierCurveTo(150,252,206,254,230,210),l.bezierCurveTo(258,156,246,66,198,32),l.bezierCurveTo(170,12,142,6,128,6),l.bezierCurveTo(114,6,86,12,58,32),l.bezierCurveTo(10,66,-2,156,26,210),l.bezierCurveTo(50,254,106,252,128,226)}),k("source-atop",()=>{v(5,"rgba(0,0,0,0.2)",[[128,236],[128,8]]);for(let c=0;c<6;c++)for(let f of[-1,1])v(3,"rgba(0,0,0,0.14)",[[128,214-c*34],[128+f*62,194-c*36],[128+f*130,160-c*38]])}),k("destination-out",()=>{for(let c=0;c<5;c++)for(let f of[-1,1])v(7-c*.7,"#000",[[128+f*34,198-c*34],[128+f*84,180-c*36],[128+f*150,146-c*38]]);l.fillStyle="#000";for(let c=0;c<3;c++)for(let f of[-1,1])l.beginPath(),l.ellipse(128+f*20,178-c*44,4.5,10,f*.4,0,7),l.fill()})}),S(1,()=>{G("#d2d2d2",()=>{l.moveTo(128,222),l.bezierCurveTo(104,252,22,246,20,170),l.bezierCurveTo(18,100,84,44,128,6),l.bezierCurveTo(172,44,238,100,236,170),l.bezierCurveTo(234,246,152,252,128,222)}),k("source-atop",()=>{v(4,"rgba(0,0,0,0.18)",[[128,230],[128,12]]);for(let c=0;c<4;c++)for(let f of[-1,1])v(2.5,"rgba(0,0,0,0.12)",[[128,200-c*40],[128+f*70,168-c*44],[128+f*98,128-c*46]]);for(let c=0;c<7;c++)l.fillStyle="rgba(255,255,230,0.38)",l.beginPath(),l.ellipse(64+c*21,80+c*53%120,4,28,.7-c*.2,0,7),l.fill()})}),S(2,()=>{G("#c6c6c6",()=>{l.moveTo(128,252),l.bezierCurveTo(92,248,66,214,66,176),l.bezierCurveTo(66,146,36,128,28,86),l.bezierCurveTo(20,40,70,4,128,6),l.bezierCurveTo(186,4,236,40,228,86),l.bezierCurveTo(220,128,190,146,190,176),l.bezierCurveTo(190,214,164,248,128,252)}),k("source-atop",()=>{v(5,"rgba(255,255,225,0.5)",[[128,252],[128,12]]);for(let c=0;c<6;c++)for(let f of[-1,1])v(2.5,"rgba(255,255,225,0.38)",[[128,222-c*34],[128+f*52,198-c*36],[128+f*94,170-c*38]])})}),S(3,()=>{G("#cccccc",()=>{l.moveTo(128,254),l.bezierCurveTo(86,226,66,140,72,60),l.bezierCurveTo(76,18,108,2,128,2),l.bezierCurveTo(148,2,180,18,184,60),l.bezierCurveTo(190,140,170,226,128,254)}),k("source-atop",()=>{v(5,"rgba(255,255,220,0.45)",[[128,254],[128,4]]);for(let c=0;c<22;c++)for(let f of[-1,1])v(1.2,"rgba(0,0,0,0.12)",[[128,240-c*10.5],[128+f*62,226-c*10.5]])}),k("destination-out",()=>{for(let[c,f]of[[64,1],[150,-1],[196,1],[110,-1]])v(2.5,"#000",[[128+f*18,c],[128+f*72,c-12]])})}),S(4,()=>{let c=()=>{l.moveTo(104,256),l.bezierCurveTo(94,150,104,60,128,0),l.bezierCurveTo(152,60,162,150,152,256)};G("#c8c8c8",c),k("source-atop",()=>{for(let f=0;f<16;f++)l.fillStyle=f%2?"rgba(0,0,0,0.2)":"rgba(255,255,220,0.2)",l.beginPath(),l.ellipse(128,242-f*15,34,3.5+f%3,.15*Math.sin(f),0,7),l.fill();l.strokeStyle="rgba(235,225,120,0.85)",l.lineWidth=5,l.beginPath(),c(),l.stroke()})}),S(5,()=>{G("#cfcfcf",()=>{l.arc(128,128,112,0,7)}),k("source-atop",()=>{for(let c=0;c<9;c++){let f=c/9*6.283;v(2.5,"rgba(0,0,0,0.13)",[[128,128],[128+Math.cos(f)*104,128+Math.sin(f)*104]])}})}),S(6,()=>{l.fillStyle="#c8c8c8";for(let c=0;c<18;c++){let f=246-c*13,h=104*Math.sin(Math.PI*(c+1)/20);for(let P of[-1,1])l.beginPath(),l.ellipse(128+P*h*.5,f-6,h*.5,5.5,P*-.35,0,7),l.fill()}v(3,"#c8c8c8",[[128,256],[128,8]])}),S(7,()=>{for(let c=0;c<5;c++){let f=c/5*6.283-1.57;l.fillStyle="#f4f4f4",l.beginPath(),l.ellipse(128+Math.cos(f)*54,128+Math.sin(f)*54,54,36,f,0,7),l.fill()}l.fillStyle="#f0d070",l.beginPath(),l.arc(128,128,22,0,7),l.fill()})}var tt=`
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
}`,ot=1.5,at=4e6;function nt(l){let z=new Y0(4,4,{type:K0,samples:4,depthBuffer:!0}),I=new r0({uniforms:{uSrc:{value:z.texture},uAmount:{value:0}},vertexShader:"varying vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:tt,depthTest:!1,depthWrite:!1,toneMapped:!1}),j=new B0;j.setAttribute("position",new g0([-1,-1,0,3,-1,0,-1,3,0],3));let S=new k0(j,I);S.frustumCulled=!1;let G=new Ee,k=new be;G.add(S);let v=new X0;function c(){l.getDrawingBufferSize(v);let f=Math.min(1,ot/Math.max(1,l.getPixelRatio())),h=Math.max(1,Math.round(v.x*f)),P=Math.max(1,Math.round(v.y*f)),u=h*P>at?2:4;z.samples!==u?(z.dispose(),z=new Y0(h,P,{type:K0,samples:u,depthBuffer:!0}),I.uniforms.uSrc.value=z.texture):(z.width!==h||z.height!==P)&&z.setSize(h,P)}return{get target(){return c(),z},compile(){l.compile(G,k)},render(f,h,P){c(),l.setRenderTarget(z),l.render(f,h),l.setRenderTarget(null),I.uniforms.uAmount.value=P,l.render(G,k)},dispose(){z.dispose(),I.dispose(),j.dispose()}}}function lt(l){let z=0,I=0;for(let P of l)z+=P.attributes.position.count,I+=P.index?P.index.count:P.attributes.position.count;let j=new Float32Array(z*3),S=new Float32Array(z*3),G=new Float32Array(z*2),k=new Float32Array(z*3),v=z>65535?new Uint32Array(I):new Uint16Array(I),c=0,f=0;for(let P of l){let u=P.attributes,U=u.position.count;if(j.set(u.position.array.subarray(0,U*3),c*3),S.set(u.normal.array.subarray(0,U*3),c*3),u.uv&&G.set(u.uv.array.subarray(0,U*2),c*2),k.set(u.aCol.array,c*3),P.index){let E=P.index.array;for(let N=0;N<E.length;N++)v[f+N]=E[N]+c;f+=E.length}else{for(let E=0;E<U;E++)v[f+E]=c+E;f+=U}c+=U}let h=new B0;return h.setAttribute("position",new u0(j,3)),h.setAttribute("normal",new u0(S,3)),h.setAttribute("uv",new u0(G,2)),h.setAttribute("aCol",new u0(k,3)),h.setIndex(new u0(v,1)),h.computeBoundingSphere(),h}var n={plaster:[.8,.77,.72],ceiling:[.78,.76,.72],floor:[.76,.71,.62],dark:[.035,.032,.03],oak:[.62,.45,.28],teak:[.4,.25,.14],walnut:[.2,.12,.07],bentwood:[.13,.075,.045],steel:[.05,.07,.06],chrome:[.24,.25,.26],stainless:[.44,.45,.46],ink:[.045,.045,.05],brass:[.5,.36,.16],mint:[.36,.56,.46],cream:[.9,.87,.8],terra:[.56,.3,.2],clay:[.7,.5,.36],sage:[.28,.4,.32],marble:[.86,.85,.82],slate:[.09,.1,.1],enamel:[.12,.24,.2],glow:[1,.86,.62],screen:[.1,.12,.16],leafM:[.12,.33,.09],leafF:[.14,.34,.08],leafP:[.2,.42,.1],leafS:[.12,.27,.11],leafB:[.2,.4,.12],stem:[.22,.32,.1],bark:[.25,.18,.12],soil:[.1,.07,.045],beans:[.18,.1,.05],coffee:[.09,.045,.02],tea:[.95,.4,.09],milk:[.95,.9,.8],crust:[.72,.42,.15],cane:[.62,.46,.27],oat:[.74,.66,.54],rust:[.56,.24,.12],indigo:[.08,.12,.27],olive:[.3,.32,.16],clear:[.85,.9,.88]},m0=[[.62,.36,.22],[.85,.8,.7],[.16,.2,.19],[.72,.52,.3],[.3,.44,.4],[.82,.62,.48],[.14,.16,.28]],d0=[[.95,.92,.85],[.9,.55,.25],[.2,.2,.2],[.85,.75,.3]];function ft({renderer:l,scene:z,lightUniforms:I,sun:j}){let S=new J0;S.visible=!1,z.add(S);let G=[],k=e=>(G.push(e),e),{front:v,back:c,floor:f,ceiling:h,depth:P}=$,u=(e,o,s)=>new f0(e,o,s),U=u(0,1,0),E={x0:c,x1:c+_0.back,z0:0,z1:2050,top:_0.backTop},N={x0:c,x1:c+300,z0:2065,z1:2345,top:560},A={z0:2440,z1:2740,spring:400},H=_0,D={x0:-2058,x1:-1065,d:240,top:760},V=u((q.x0+q.x1)/2,310,(q.z0+q.z1)/2+60),oe=[u((H.x0+H.x1)/2,360,1080),u((H.x0+H.x1)/2,360,1960),u(c+250,470,620)],a0={uWinQ:{value:[y.y0,y.y1].flatMap(e=>[y.z0,y.z1].map(o=>u($.front,e,o)))},uPatchQ:{value:[0,1,2,3].map(()=>u(0,0,0))},uWallQ:{value:[u(-Y.niche.x,$.floor,0),u(Y.niche.x,$.floor,0),u(Y.niche.x,Y.niche.top,0),u(-Y.niche.x,Y.niche.top,0)]},uSkyCol:{value:u(2.3,2.38,2.55)},uPatchCol:{value:u(2.6,1.6,.78)},uWallCol:{value:u(.86,.82,.76)},uLampP:{value:[...oe.map(e=>new x0(e.x,e.y,e.z,1)),new x0(V.x,V.y,V.z,0)]},uLampCol:{value:u(.95,.6,.28)},uAmbient:{value:.065},uOcc:{value:Array.from({length:T0},()=>new x0(0,0,0,0))},uOccTop:{value:new Array(T0).fill(-1e4)}},z0=a0.uWinQ.value;[z0[2],z0[3]]=[z0[3],z0[2]];function He(e,o,s){let t=0;for(let a=0;a<4;a++){let r=s[a].clone().sub(e).normalize(),i=s[(a+1)%4].clone().sub(e).normalize(),p=new f0().crossVectors(r,i);t+=Math.acos(Math.max(-1,Math.min(1,r.dot(i))))*o.dot(p)/Math.max(p.length(),1e-6)}return t/(2*Math.PI)}let $0=(e,o,s)=>{He(o,s,e)<0&&e.reverse()},V0=u(0,0,1400);if($0(z0,V0,u(1,0,0)),$0(a0.uWallQ.value,V0,u(0,0,-1)),j){let e=j.uniforms.uSunD.value;[[g.y0,g.z0],[g.y0,g.z1],[g.y1,g.z1],[g.y1,g.z0]].map(([s,t])=>u($.front,s,t)).forEach((s,t)=>a0.uPatchQ.value[t].copy(s).addScaledVector(e,-s.z/e.z)),$0(a0.uPatchQ.value,V0,u(0,0,-1))}else a0.uPatchCol.value.set(0,0,0);[[(E.x0+E.x1)/2,(E.z0+E.z1)/2,_0.back/2,(E.z1-E.z0)/2,E.top],[(N.x0+N.x1)/2,(N.z0+N.z1)/2,150,140,N.top],[(H.x0+H.x1)/2,(H.z0+H.z1)/2,(H.x1-H.x0)/2,(H.z1-H.z0)/2,H.top],[(D.x0+D.x1)/2,D.d/2,(D.x1-D.x0)/2,D.d/2,D.top],[(q.x0+q.x1)/2,(q.z0+q.z1)/2,(q.x1-q.x0)/2,(q.z1-q.z0)/2,q.top],[560,1700,105,105,-366],[630,1430,105,105,-366],[v-70,715,70,485,y.y0],[(Y.niche.x+v)/2,115,(v-Y.niche.x)/2,115,316],[-1e3,430,100,100,-420],[-1347,1510,145,210,H.top+250],[-1330,1935,140,150,H.top+220],[-2270,1160,115,100,E.top+380]].forEach(([e,o,s,t,a],r)=>{a0.uOcc.value[r].set(e,o,s,t),a0.uOccTop.value[r]=a});let ae=k(ee(1024,512,et,ve)),P0=(e,o={},s={})=>k(new r0({uniforms:{...a0,...o},vertexShader:y0,fragmentShader:e,toneMapped:!1,...s})),Z=(e,o=0)=>P0(Ue,{uKind:{value:e},uGloss:{value:o}}),ne={plain:Z(0),satin:Z(0,.3),chrome:Z(0,.9),wood:Z(2,.04),flute:Z(5,.04),plaster:Z(3),marble:Z(4,.25),tile:Z(1,.04),glazed:Z(6,.5),fabric:Z(7),cane:Z(8),thru:Z(9,.2),emit:P0(Ye),leaf:P0(Xe,{uAtlas:{value:ae}},{side:O0,alphaToCoverage:!0}),glass:P0(Ke,{uAlpha:{value:.05}},{transparent:!0,depthWrite:!1,side:O0})},v0=new Map;function O(e,o,s,t){s&&o.applyMatrix4(s);let a=o.attributes.position.count,r=new Float32Array(a*3);for(let i=0;i<a;i++)r.set(t,i*3);return o.setAttribute("aCol",new u0(r,3)),v0.has(e)||v0.set(e,[]),v0.get(e).push(o),o}let le=new xe,Fe=new ye,Ie=new f0,Ae=new f0(1,1,1),w=(e=0,o=0,s=0,t=0,a=0,r=0,i=null)=>{let p=new Z0().compose(Ie.set(e,o,s),le.setFromEuler(Fe.set(a,t,r,"YXZ")),Ae);return i?i.clone().multiply(p):p},m=(e,o,s,t,a,r,i,p,d)=>O(e,new W0(r-s,i-t,p-a).translate((s+r)/2,(t+i)/2,(a+p)/2),d,o),R=(e,o,s,t,a,r,i,p,d=r,x=24)=>O(e,new M0(d,r,i,x).translate(s,t+i/2,a),p,o),S0=(e,o,s,t,a,r,i,p,d,x=16)=>O(e,new Te(1,x,Math.max(6,x>>1)).scale(r,i,p).translate(s,t,a),d,o),_=(e,o,s,t,a,r,i,p=24)=>O(e,new ke(s.map(([d,x])=>new X0(d,x)),p).translate(t,a,r),i,o),W=(e,o,s,t,a,r,i=8)=>{let p=t.clone().sub(s),d=p.length();return O(e,new M0(a,a,d,i).applyQuaternion(le.setFromUnitVectors(U,p.normalize())).translate((s.x+t.x)/2,(s.y+t.y)/2,(s.z+t.z)/2),r,o)},n0=(e,o,s,t,a,r=Math.PI*2,i=32)=>O(e,new Pe(s,t,8,i,r),a,o),L=(e,o,s,t,a)=>O(e,new l0(s,t),a,o),se=(e,o,s,t,a,r)=>{let i=new W0(1,1,1,8,8,2),p=i.attributes.position;for(let d=0;d<p.count;d++){let x=p.getX(d)*2,T=p.getY(d)*2,b=p.getZ(d),C=Math.sqrt(Math.max(0,(1-x**4)*(1-T**4)));p.setXYZ(d,x*s/2*(1-.06*T*T),T*t/2*(1-.06*x*x),b*a*(.18+.82*C))}return i.computeVertexNormals(),O(e,i,r,o)},h0=(e,o,s=.28)=>{let t=1-s/2+s*o();return e.map(a=>a*t)},b0=(e,o,s)=>{let t=new k0(k(e),o);return s&&(t.matrixAutoUpdate=!1,t.matrix.copy(s),t.matrixWorldNeedsUpdate=!0),S.add(t),t};function c0(e,o,s,t,a,r,i=.15,p=0){let d=t.clone().normalize(),x=new f0().crossVectors(d,U);x.lengthSq()<1e-6&&x.set(1,0,0),x.normalize(),p&&x.applyAxisAngle(d,p);let T=new f0().crossVectors(x,d).normalize(),b=new l0(1,1,2,4),C=b.attributes.position,F=b.attributes.uv;for(let M=0;M<C.count;M++){let B=F.getX(M),K=F.getY(M),X=(B-.5)*2;C.setXYZ(M,(B-.5)*a,K*r,(-i*K*K+.05*X*X)*r),F.setXY(M,((e&3)+B)/4,1-((e>>2)+1-K)/2)}b.computeVertexNormals(),O("leaf",b,new Z0().makeBasis(x,d,T).setPosition(s),o)}let R0=(e,o,s=3,t=n.stem)=>W("plain",t,e,o,s,null,5);function C0(e,o,s,t,a,r=n.terra,i="satin"){_(i,r,[[0,0],[t*.78,0],[t,a*.92],[t*1.05,a],[t*.95,a],[t*.9,a*.9],[0,a*.9]],e,o,s),R("plain",n.soil,e,o+a*.84,s,t*.9,4,null,t*.9,20)}function je(e,o,s,t,a,r,i=0,p=2*Math.PI){let d=o0(r);for(let x=0;x<a;x++){let T=i+(p-i)*((x*.618+d()*.25)%1),b=.25+d()*.75,C=t*(.5+d()*.5),F=u(e,o,s),M=F.clone().addScaledVector(u(Math.cos(T)*Math.sin(b),Math.cos(b),Math.sin(T)*Math.sin(b)),C);R0(F,M,3.5),c0(0,h0(n.leafM,d),M,u(Math.cos(T),.45-d()*.7,Math.sin(T)),t*(.68+d()*.2),t*(.62+d()*.2),.16,(d()-.5)*.7)}}function Ge(e,o,s,t,a,r=0,i=2*Math.PI,p=20){let d=o0(a),x=u(e+6,o+t*.42,s-4);W("wood",n.bark,u(e,o,s),x,11,null,7);let T=[0,1,2].map(b=>{let C=r+(i-r)*(.2+.3*b),F=.22+.08*b;return x.clone().add(u(Math.cos(C)*t*F,t*(.5+.05*b),Math.sin(C)*t*F))});for(let b of T)W("wood",n.bark,x,b,7,null,6);for(let b=0;b<p;b++){let C=T[b%3],F=.3+.7*((b*.37+d()*.2)%1),M=x.clone().lerp(C,F),B=r+(i-r)*((b*.618+d()*.2)%1),K=u(Math.cos(B),.5,Math.sin(B)).normalize(),X=M.clone().addScaledVector(K,18);R0(M,X,3);let Q=(120+80*d())*(1.1-.3*F);c0(2,h0(n.leafF,d),X,u(Math.cos(B),.4+d()*.9,Math.sin(B)),Q*.62,Q,.1,(d()-.5)*.9)}}function H0(e,o,s,t,a=40,r=0){let i=o0(t),p=o.clone().setY(0).normalize(),d=e.clone(),x=0,T=Math.max(2,Math.round(s/32));for(let b=0;b<T;b++){let C=x<r,F=C?30:b<2?16:3;x+=F;let M=d.clone().add(u(p.x*F+(i()-.5)*10,C?-2-i()*3:-26-i()*10,p.z*F+(i()-.5)*10));R0(d,M,1.8);let B=b%2?1:-1,X=u(-p.z,0,p.x).multiplyScalar(B).multiplyScalar(.7).add(p.clone().multiplyScalar(.7)).add(u(0,-.2-i()*.6,0));c0(1,h0(n.leafP,i),M,X,a*(.8+i()*.3),a*(.9+i()*.3),.06,(i()-.5)*1.2),d=M}}function Le(e,o,s,t,a,r,i=.2){let p=o0(r);for(let d=0;d<a;d++){let x=p()*6.283,T=4+p()*14;c0(4,h0(n.leafS,p),u(e+Math.cos(x)*T,o,s+Math.sin(x)*T),u(Math.cos(x)*i,1,Math.sin(x)*i),t*.17,t*(.6+p()*.4),-.03,p()*3)}}function i0(e,o,s,t,a,r=38,i=52,p=n.cream,d=90){C0(e,o,s,r,i,p);let x=o0(a);for(let b=0;b<5;b++){let C=b*1.3+x();c0(1,h0(n.leafP,x),u(e+Math.cos(C)*8,o+i*.85,s+Math.sin(C)*8),u(Math.cos(C),.9,Math.sin(C)),34,38,.2,x())}let T=t.clone().setY(0).normalize();H0(u(e+T.x*r,o+i*.9,s+T.z*r),T,120+x()*140+d,a+1,34,d),H0(u(e+T.x*r*.7+T.z*r*.6,o+i*.9,s+T.z*r*.7-T.x*r*.6),T,60+x()*80+d,a+2,32,d)}let Q0=(e,o,s,t=n.cream,a=null,r=24,i=38,p=!0)=>{_("satin",t,[[0,0],[r*.68,0],[r*.94,i*.5],[r,i],[r-2.5,i],[r*.92-2.5,i*.5],[0,5]],e,o,s,a,20),n0("satin",t,10,2.6,w(e+r-1,o+i*.55,s,0,0,-Math.PI/2,a),Math.PI,12),p&&R("plain",n.coffee,e,o+i-7,s,r-3,1,a,r-3,18)},re=(e,o,s,t=n.cream,a=null)=>_("satin",t,[[0,0],[26,0],[40,6],[38,7],[0,3]],e,o,s,a,24),U0=(e,o,s,t=null,a=n.cream)=>{re(e,o,s,a,t),Q0(e,o+4,s,a,t),R("plain",n.milk,e,o+36,s,15,1.5,t,9,16)},F0=(e,o,s,t=60,a=null,r=null)=>{_("glass",n.clear,[[0,0],[21,0],[24,t],[22.5,t],[19.5,4],[0,4]],e,o,s,r,24),a&&R("thru",a,e,o+4,s,19,t*.62,r,21,20)},ce=(e,o,s,t,a,r=null)=>{R("glass",n.clear,e,o,s,34,t,r,34,24),R("satin",a,e,o+2,s,31,t*.72,r,31,20),R("satin",n.walnut,e,o+t,s,35,12,r,35,24)},E0=(e,o,s,t,a,r,i,p,d=null,x="z")=>{m("satin",i,e-t/2,o,s-r/2,e+t/2,o+a,s+r/2,d),x==="z"?m("plain",p,e-t/2+8,o+a*.3,s+r/2,e+t/2-8,o+a*.66,s+r/2+1.5,d):m("plain",p,e+t/2,o+a*.3,s-r/2+8,e+t/2+1.5,o+a*.66,s+r/2-8,d)};function q0(e,o,s,t=n.ink,a=null,r=0){let i=w(e,o,s,r,0,0,a);_("satin",t,[[0,0],[44,0],[46,50],[36,78],[12,84],[8,92],[0,94]],0,0,0,i,24),W("satin",t,u(30,16,0),u(72,92,0),4,i),W("satin",t,u(72,92,0),u(96,84,0),3.4,i),n0("satin",t,32,5,w(-40,52,0,0,0,Math.PI/2,i),Math.PI,16)}L("tile",n.floor,v-c,P,w((v+c)/2,f,P/2,0,-Math.PI/2)),L("plaster",n.ceiling,v-c,P,w((v+c)/2,h,P/2,0,Math.PI/2)),L("plaster",n.plaster,v-c,h-f,w((v+c)/2,(f+h)/2,P,Math.PI));{let e=new ge,o=-(A.z0+A.z1)/2,s=(A.z1-A.z0)/2;e.moveTo(0,f),e.lineTo(0,h),e.lineTo(-P,h),e.lineTo(-P,f),e.lineTo(-A.z1,f),e.lineTo(-A.z1,A.spring),e.absarc(o,A.spring,s,Math.PI,0,!0),e.lineTo(-A.z0,f),e.lineTo(0,f);let t=new Me(e,24);O("plaster",t,w(c,0,0,Math.PI/2),n.plaster);let a=110,r=24,i=[],p=[],d=[],x=[];for(let M=0;M<=r;M++){let B=Math.PI*(1-M/r),K=A.spring+s*Math.sin(B),X=(A.z0+A.z1)/2+s*Math.cos(B);for(let Q of[c,c-a])i.push(Q,K,X),p.push(0,-Math.sin(B),-Math.cos(B)),d.push(0,0);if(M<r){let Q=M*2;x.push(Q,Q+2,Q+1,Q+1,Q+2,Q+3)}}let T=new B0;T.setAttribute("position",new g0(i,3)),T.setAttribute("normal",new g0(p,3)),T.setAttribute("uv",new g0(d,2)),T.setIndex(x),O("plaster",T,null,n.plaster),L("plaster",n.plaster,a,A.spring-f,w(c-a/2,(A.spring+f)/2,A.z0,0)),L("plaster",n.plaster,a,A.spring-f,w(c-a/2,(A.spring+f)/2,A.z1,Math.PI));let b=c-520,C=A.z0-60,F=P+400;L("plain",n.dark,F-C,h-f,w(b,(f+h)/2,(C+F)/2,Math.PI/2)),L("plain",[.06,.055,.05],c-a-b,F-C,w((c-a+b)/2,f,(C+F)/2,0,-Math.PI/2)),L("plain",n.dark,c-a-b,F-C,w((c-a+b)/2,A.spring+s+40,(C+F)/2,0,Math.PI/2)),L("plain",n.dark,c-a-b,h-f,w((c-a+b)/2,(f+h)/2,C)),L("plain",n.dark,c-a-b,h-f,w((c-a+b)/2,(f+h)/2,F,Math.PI)),L("plain",n.dark,F-C,h-f,w(c-a,(f+h)/2,(C+F)/2,-Math.PI/2));for(let[M,B]of[[A.z0+4,A.z0+170],[A.z0+196,A.z1-4]]){let K=new l0(B-M,A.spring-f-70,28,1),X=K.attributes.position;for(let Q=0;Q<X.count;Q++)X.setZ(Q,9*Math.sin(X.getX(Q)/11));K.computeVertexNormals(),O("thru",K,w(c-40,(A.spring+f+70)/2,(M+B)/2,Math.PI/2),[.72,.64,.52])}W("chrome",n.brass,u(c-40,A.spring+6,A.z0),u(c-40,A.spring+6,A.z1),5)}let I0=$.wall;m("plaster",n.plaster,v,f,0,v+I0,h,y.z0),m("plaster",n.plaster,v,f,y.z1,v+I0,h,P),m("plaster",n.plaster,v,f,y.z0,v+I0,y.y0,y.z1),m("plaster",n.plaster,v,y.y1,y.z0,v+I0,h,y.z1);let w0=(e,o,s,t)=>m("satin",n.steel,v-4,o,e,v+14,t,s),J=g.frame;for(let e of[y.z0,g.z0,g.z1-J,y.z1-J])w0(e,y.y0,e+J,y.y1);for(let e of y.sideBars)w0(e-g.bar/2,y.y0,e+g.bar/2,y.y1);for(let e of[y.y0,g.y0,g.y1-J,y.y1-J])w0(y.z0,e,y.z1,e+J);let ie=g.y0+(g.y1-g.y0)*g.transom,Be=[g.z0+J+(g.z1-g.z0-2*J)/3,g.z0+J+2*(g.z1-g.z0-2*J)/3];w0(g.z0,ie-g.transomBar/2,g.z1,ie+g.transomBar/2);for(let e of Be)w0(e-g.bar/2,g.y0,e+g.bar/2,g.y1);let fe=j?.uniforms.uLeaf0.value||null,ue=k(new r0({uniforms:{uLeafSun:{value:fe},uSunU:j?j.uniforms.uSunU:{value:u(1,0,0)},uSunV:j?j.uniforms.uSunV:{value:u(0,1,0)},uMask:j?j.uniforms.uMask:{value:new x0},uHasLeaves:{value:fe?1:0}},vertexShader:y0,fragmentShader:De,toneMapped:!1}));b0(new l0(y.z1-y.z0+200,y.y1-y.y0+200),ue,w(v+60,(y.y0+y.y1)/2,(y.z0+y.z1)/2,-Math.PI/2));let We=k(new r0({uniforms:{...ue.uniforms,uLeafSun:{value:j?.uniforms.uLeaf2.value||null}},vertexShader:y0,fragmentShader:Oe,toneMapped:!1})),A0=(e,o,s,t)=>b0(new l0(s-e,t-o),We,w(v+6,(o+t)/2,(e+s)/2,-Math.PI/2));A0(y.z0,y.y0,g.z0,y.y1),A0(g.z1,y.y0,y.z1,y.y1),A0(g.z0,y.y0,g.z1,g.y0),A0(g.z0,g.y1,g.z1,y.y1);let e0=Se(l,I),_e=[c,f,v,h];e0.resize(c,f,v,h,360,190),e0.mesh.position.z=-1,e0.mesh.updateMatrixWorld(),e0.mesh.renderOrder=-2,S.add(e0.mesh);let Ne=k(new r0({uniforms:{...a0,uWallBake:e0.mesh.material.uniforms.uBake,uWallRegion:{value:new x0(..._e)},uOak:{value:new ze(...n.oak)}},vertexShader:y0,fragmentShader:qe,toneMapped:!1})),s0=Y.niche.x,j0=Y.depth,t0=300;b0(new l0(v-s0,t0-f),Ne,w((s0+v)/2,(f+t0)/2,j0)),L("wood",n.oak,j0,t0-f,w(s0,(f+t0)/2,j0/2,-Math.PI/2)),m("wood",n.oak,s0,t0,0,v,t0+16,j0+10),C0(1060,t0+16,112,70,130,n.terra),je(1060,t0+130,112,180,12,11,Math.PI/2-.2,Math.PI+.3);for(let[e,o]of[[1166,[.85,.82,.75]],[1186,[.16,.16,.18]]])m("satin",o,e-6,t0+16,30,e+6,t0+196,200);m("plaster",n.plaster,-s0-110,f,0,-s0,h,70),L("plaster",n.plaster,-s0-110-c,h-f,w((c-s0-110)/2,(f+h)/2,.5)),m("plain",n.slate,-1700,h-26,380,900,h-14,400);for(let e of[-1300,-500,300])R("plain",n.slate,0,-50,0,26,100,w(e,h-70,390,0,.5),30,20);m("plain",n.ink,E.x0,f,E.z0,E.x1-20,f+60,E.z1),m("flute",n.teak,E.x0,f+60,E.z0,E.x1-10,E.top-20,E.z1),m("marble",n.marble,E.x0,E.top-20,E.z0,E.x1+6,E.top,E.z1+6),L("glazed",n.sage,E.z1,400,w(c+1,E.top+200,E.z1/2,Math.PI/2)),m("wood",n.oak,c,E.top+400,20,c+190,E.top+420,E.z1);{let e=E.top+420,o=c+95,s=o0(31),t=70,a=["cups","glasses","jars","plant","cups","teapot","glasses","jars","cups","plant","bags","cups"];for(let r of a){if(t>E.z1-80)break;if(r==="cups"){for(let i=0;i<3;i++)for(let p=0;p<3-i;p++)R("satin",i?n.cream:n.clay,o,e+i*34,t+p*54+i*27,24,32,null,21,18);t+=190}else if(r==="glasses"){for(let i=0;i<4;i++)F0(o,e,t+i*52,64);t+=230}else if(r==="jars"){for(let i=0;i<3;i++)ce(o,e,t+i*78,90+30*s(),i%2?n.beans:[.85,.75,.55]);t+=250}else if(r==="plant")i0(o,e,t+30,u(1,0,.15),40+t,36,48),t+=150;else if(r==="teapot")S0("satin",n.clay,o,e+46,t+30,50,46,50),W("satin",n.clay,u(o,e+46,t+70),u(o+6,e+80,t+110),7),n0("satin",n.clay,24,5,w(o,e+56,t-18,Math.PI/2,0,-Math.PI/2),Math.PI,12),t+=150;else if(r==="bags"){for(let i=0;i<3;i++)E0(o,e,t+i*82,50,150-i*12,74,m0[i+1],d0[i],null,"x");t+=260}}}m("plain",n.slate,c+1,600,800,c+14,1240,1800);let pe=k(ee(1400,900,Ze)),$e=k(new r0({uniforms:{uMap:{value:pe},uGain:{value:.92}},vertexShader:y0,fragmentShader:Ce,toneMapped:!1}));b0(new l0(990,636),$e,w(c+16,920,1300,Math.PI/2)),m("wood",n.oak,c+1,584,784,c+18,1256,800),m("wood",n.oak,c+1,584,1800,c+18,1256,1816);for(let[e,o]of[[80,700],[1900,2360]]){for(let t of[700,960])m("wood",n.oak,c,t,e,c+170,t+20,o);let s=o0(e+9);i0(c+85,720,e+90,u(1,0,.1),e+1,40,56,n.terra);for(let t=0;t<4;t++)E0(c+85,720,e+210+t*82,56,140+20*s(),70,m0[(t+e)%m0.length],d0[t%d0.length],null,"x");i0(c+85,980,o-110,u(1,0,-.1),e+2,44,60,n.cream);for(let t=0;t<3;t++)R("satin",t%2?n.sage:n.cream,c+85,980,e+80+t*80,30,70+t*20,null,26,20)}{let e=E.top,o=(E.x0+E.x1)/2;W("chrome",n.chrome,u(c+60,e,360),u(c+60,e+150,360),7),W("chrome",n.chrome,u(c+60,e+150,360),u(c+150,e+120,360),6),m("plain",n.ink,o-70,e,150,o+90,e+10,300);for(let t=0;t<2;t++)for(let a=0;a<3;a++)R("satin",n.cream,o-30+t*70,e+10,180+a*50,22,30,null,26,16);m("wood",n.walnut,o-70,e,600,o+70,e+14,1e3);for(let t of[610,990])m("wood",n.walnut,o-10,e+14,t-8,o+10,e+190,t+8);m("wood",n.walnut,o-56,e+190,600,o+56,e+204,1e3);for(let t of[700,880])m("plain",n.ink,o-44,e+14,t-44,o+44,e+26,t+44),_("glass",n.clear,[[0,0],[40,0],[44,56],[34,92],[28,98],[0,98]],o,e+26,t),R("plain",n.coffee,o,e+28,t,38,34,null,42,20),_("satin",n.cream,[[0,0],[16,0],[56,66],[60,72],[56,72],[14,6],[0,6]],o,e+196,t);q0(o+70,e,1045,n.ink,null,0),m("satin",n.stainless,o-150,e,1110,o-30,e+400,1290),m("satin",n.stainless,o-30,e+250,1120,o+100,e+330,1280),m("plain",n.ink,o-20,e+236,1150,o+70,e+250,1250),m("satin",n.stainless,o-30,e,1120,o+100,e+14,1280),m("emit",[.25,.5,.42],o+100,e+296,1180,o+102,e+316,1220),_("glass",n.clear,[[0,0],[54,0],[58,64],[36,110],[32,120],[0,120]],o+34,e+14,1200),R("plain",n.coffee,o+34,e+16,1200,52,54,null,56,20),R("satin",n.stainless,o-20,e,1420,74,250,null,70,28),R("satin",n.ink,o-20,e+250,1420,50,30,null,30,20),W("chrome",n.chrome,u(o+60,e,1580),u(o+60,e+260,1580),4),n0("chrome",n.chrome,44,3,w(o+20,e+260,1580,0,Math.PI/2)),W("chrome",n.chrome,u(o+60,e+260,1580),u(o+64,e+260,1580),4),_("thru",[.78,.56,.36],[[2,0],[10,0],[40,110],[44,116],[0,116]],o+20,e+150,1580),R("satin",n.stainless,o+20,e,1580,54,90,null,52,24),m("satin",n.ink,o-45,e,1700,o+45,e+110,1790),_("glass",n.clear,[[0,0],[40,0],[52,150],[50,160],[0,160]],o,e+110,1745),[[.5,.16,.06],[.75,.45,.12],[.2,.32,.12],[.62,.1,.12],[.85,.7,.45]].forEach((t,a)=>{_("satin",t,[[0,0],[20,0],[20,120],[9,140],[8,170],[0,170]],o+60,e,1840+a*44,null,16),R("plain",n.ink,o+60,e+170,1840+a*44,9,10,null,9,10)});for(let t=0;t<2;t++)R("satin",[.92,.9,.84],o-60,e,1880+t*70,22,150,null,27,18)}{let{x0:e,x1:o,z0:s,z1:t,top:a}=N,r=16;m("satin",n.ink,e,f,s,o,f+90,t),m("satin",n.ink,e,a-70,s,o,a,t),m("satin",n.ink,e,f+90,s,o,a-70,s+r),m("satin",n.ink,e,f+90,t-r,o,a-70,t),L("emit",[.96,1,1.04],t-s-2*r,a-70-f-90,w(e+4,(a-70+f+90)/2,(s+t)/2,Math.PI/2));let i=[[.3,.14,.05],[.95,.42,.1],[.92,.9,.85],[.25,.4,.15],[.62,.32,.1]];for(let p=0;p<4;p++){let d=f+100+p*245;m("plain",[.25,.26,.27],e+4,d,s+r,o-24,d+4,t-r);for(let x=0;x<6;x++){let T=i[(p*2+x)%i.length],b=s+44+x*38;_("satin",T,[[0,0],[15,0],[15,110],[7,140],[7,160],[0,160]],o-120,d+4,b,null,14),_("satin",i[(p+x+2)%5],[[0,0],[15,0],[15,110],[7,140],[7,160],[0,160]],o-70,d+4,b+18,null,14)}}L("glass",n.clear,t-s-2*r,a-70-f-90,w(o-6,(a-70+f+90)/2,(s+t)/2,Math.PI/2)),m("chrome",n.chrome,o-4,f+200,t-40,o+14,a-200,t-30),m("emit",[.95,.92,.85],o-1,a-50,s+30,o+1,a-20,t-30)}m("plain",n.ink,H.x0+20,f,H.z0+20,H.x1-20,f+50,H.z1-20),m("flute",n.oak,H.x0+10,f+50,H.z0+10,H.x1-10,H.top-20,H.z1-10),m("marble",n.marble,H.x0-6,H.top-20,H.z0,H.x1+12,H.top,H.z1);{let a=H.top;m("chrome",n.chrome,-1490,a,1300,-1205,a+18,1720),m("satin",n.mint,-1480,a+18,1310,-1215,a+240,1710),m("chrome",n.chrome,-1484,a+240,1306,-1211,a+250,1714);for(let r of[1308,1712])m("chrome",n.chrome,-1480,a+250,r-3,-1215,a+272,r+3);for(let r of[90,200])m("satin",n.chrome,-1215,a+r,1326,-1212,a+r+10,1694);m("satin",[.25,.4,.33],-1215,a+30,3020/2-2,-1213,a+236,3020/2+2);for(let r=0;r<2;r++)for(let i=0;i<5;i++)R("satin",i%3===1?n.clay:n.cream,-1410+r*120,a+250,1360+i*(300/4),26,34,null,21,18);for(let r of[1310+400*.32,1310+400*.68])m("chrome",n.chrome,-1530,a+120,r-46,-1480,a+196,r+46),R("chrome",n.chrome,-1510,a+92,r,34,28),R("chrome",n.chrome,-1510,a+70,r,32,22),m("plain",n.ink,-1630,a+74,r-10,-1530,a+90,r+10),R("satin",n.cream,-1510,a+18,r,26,36,null,24,18),R("satin",n.cream,0,-2,0,18,4,w(-1481,a+206,r,0,0,Math.PI/2),18,20);m("chrome",n.chrome,-1560,a,1340,-1480,a+16,1680);for(let r of[1335,1685])W("chrome",n.chrome,u(-1490,a+200,r),u(-1550,a+40,r),5);for(let[r,i]of[[0,0],[-6,44]])_("chrome",n.stainless,[[0,0],[30,0],[30,50],[24,66],[27,72],[0,70]],-1525+r,a,1730+i,null,20);m("satin",n.ink,-1470,a,1215,-1395,a+70,1285)}{let e=H.top;for(let[s,t]of[[1150,n.ink],[1010,[.86,.84,.8]]])m("satin",t,-1475,e,s-50,-1365,e+210,s+50),m("satin",t,-1508,e+70,s-22,-1475,e+120,s+22),R("chrome",n.chrome,-1420,e+210,s,50,26,null,46),R("satin",n.beans,-1420,e+236,s,32,78,null,52),R("glass",n.clear,-1420,e+236,s,36,120,null,64),R("satin",n.ink,-1420,e+356,s,64,10);U0(-1250,e,815),U0(-1250,e,905),F0(-1325,e,860,80,[.62,.42,.26]),_("satin",n.cream,[[0,0],[22,0],[26,30],[12,70],[10,92],[13,96],[0,96]],-1230,e,1050,null,20);let o=o0(77);for(let s=0;s<3;s++){let t=u(-1230+(o()-.5)*40,e+170+o()*50,1050+(o()-.5)*50);R0(u(-1230,e+90,1050),t,1.6),c0(7,[.95,.62,.66],t.clone().add(u(0,-18,0)),u(.6,.5,o()-.5),40,40,0,0),c0(1,h0(n.leafP,o),u(-1230,e+120+s*16,1050),u(o()-.5,.4,o()-.5),22,26,.1,0)}}{let a=H.top,r=210;m("wood",n.oak,-1470,a,1800,-1192,a+16,2090),L("glass",n.clear,290,r,w(-1192,a+16+r/2,3890/2,Math.PI/2)),L("glass",n.clear,278,r,w(-2662/2,a+16+r/2,1800,Math.PI)),L("glass",n.clear,278,r,w(-2662/2,a+16+r/2,2090)),L("glass",n.clear,278,290,w(-2662/2,a+16+r,3890/2,0,-Math.PI/2)),L("glass",n.clear,278,290,w(-2662/2,a+16+r*.5,3890/2,0,-Math.PI/2));for(let[i,p]of[[-1192,1800],[-1192,2090],[-1470,1800],[-1470,2090]])m("chrome",n.brass,i-3,a+16,p-3,i+3,a+16+r,p+3);for(let i=0;i<4;i++)n0("satin",n.crust,26,14,w(-1380+i%2*90,a+30,1860+i*58,i*.7,-Math.PI/2),Math.PI*1.25,14);R("satin",[.94,.86,.72],-1360,a+16+r*.5,3890/2-40,62,52,null,62,32),R("satin",[.62,.32,.2],-1360,a+16+r*.5+52,3890/2-40,62,6,null,62,32);for(let i=0;i<5;i++)R("satin",[.7,.5,.3],-1260,a+16+r*.5+i*8,1900+i%2*6,26,7,null,26,18)}{let e=H.top,o=-1262,s=2200;R("chrome",n.ink,o,e,s,30,6),R("chrome",n.ink,o,e+6,s,8,70);let t=w(o+8,e+112,s,0,0,.55);m("satin",n.ink,-5,-56,-78,5,56,78,t),L("emit",n.screen,146,102,w(5.5,0,0,Math.PI/2,0,0,t)),m("satin",n.ink,-1250,e,2105,-1200,e+14,2150),F0(-1215,e,2270,74)}for(let e of oe)W("plain",n.ink,u(e.x,e.y+80,e.z),u(e.x,h,e.z),2.5),_("satin",n.enamel,[[100,0],[96,24],[72,64],[30,86],[12,94],[0,96]],e.x,e.y-10,e.z,null,32),_("emit",[.95,.82,.62],[[0,92],[12,90],[30,82],[72,60],[94,22],[98,0]],e.x,e.y-10,e.z,null,32),S0("emit",n.glow,e.x,e.y+14,e.z,26,30,26);{let{x0:e,x1:o,d:s,top:t}=D,a=[0,1,2,3].map(p=>e+(o-e)*p/3);for(let p of a)for(let d of[14,s-14])m("satin",n.steel,p-7,f,d-7,p+7,t,d+7);let r=[-560,-300,-40,220,480,t-22];for(let p of r)m("wood",n.oak,e-12,p,0,o+12,p+22,s);let i=o0(53);for(let p=0;p<r.length-1;p++){let d=r[p]+22;for(let x=0;x<3;x++){let T=a[x]+24,b=a[x+1]-24,C=s/2+10,F=x===0?["stock","cups","stock","jars","stock"][p]:["bags","mugs","bags","bags","kettles"][(p+x)%5];if(F==="stock")for(let M=T;M<b-90;M+=104)m("plain",p%2?[.62,.5,.36]:[.92,.9,.86],M,d,C-80,M+92,d+120+40*i(),C+70);else if(F==="cups")for(let M=T+30;M<b-20;M+=62)R("satin",[.92,.9,.84],M,d,C,24,170,null,28,16);else if(F==="jars")for(let M=T+40;M<b-30;M+=84)ce(M,d,C,110+40*i(),i()<.5?n.beans:[.85,.75,.55]);else if(F==="bags")for(let M=T+34;M<b-30;M+=74)E0(M,d,C+20,60,130+40*i(),60,m0[i()*m0.length|0],d0[i()*d0.length|0]);else if(F==="mugs"){let M=p;for(let B=T+34;B<b-30;B+=70)Q0(B,d,C+40,[n.cream,n.sage,n.clay,n.terra][M++%4],null,28,52,!1)}else F==="kettles"&&(q0(T+70,d,C+10,n.stainless),q0(b-90,d,C+10,[.9,.88,.82]))}}i0(e+140,t,s/2,u(0,0,1),61,44,60,n.terra),i0(o-160,t,s/2,u(.2,0,1),62,40,56,n.cream),E0(-1500,t,s/2,60,160,64,m0[2],d0[1]),E0(-1420,t,s/2,60,150,64,m0[4],d0[0])}C0(-1e3,f,430,105,230,n.cream),Ge(-1e3,f+200,430,860,91,.3*Math.PI,1.65*Math.PI,34),m("flute",n.oak,v-140,f,240,v,y.y0-22,1190),m("wood",n.oak,v-150,y.y0-22,230,v+4,y.y0,1200),m("fabric",n.oat,v-140,y.y0,250,v-6,y.y0+34,1180),se("fabric",n.rust,150,140,46,w(v-40,y.y0+104,340,-Math.PI/2,-.22,0)),se("fabric",n.olive,136,128,42,w(v-42,y.y0+98,1085,-Math.PI/2+.2,-.26,0)),m("wood",n.walnut,v-120,y.y0+34,610,v-20,y.y0+42,760),U0(v-70,y.y0+42,680,null,n.sage),C0(v-60,y.y0+34,1162,38,70,n.cream),Le(v-60,y.y0+92,1162,230,7,17,.08);{let{x0:e,x1:o,z0:s,z1:t,top:a}=q;m("wood",n.oak,e,a-32,s,o,a,t),m("wood",n.oak,e+36,a-86,s+36,o-36,a-32,t-36);for(let r of[e+34,o-34])for(let i of[s+34,t-34])m("wood",n.oak,r-22,f,i-22,r+22,a-32,i+22)}function me(e,o,s){let t=w(e,f,o,s),a=254,r=n.bentwood;R("cane",n.cane,0,a-14,0,106,14,t,106,28),n0("wood",r,106,7,w(0,a-10,0,0,Math.PI/2,0,t),Math.PI*2,40);for(let[i,p]of[[[60,a-18,60],[80,0,82]],[[60,a-18,-60],[80,0,-82]],[[-64,a-18,60],[-90,0,84]],[[-64,a-18,-60],[-90,0,-84]]])W("wood",r,u(...i),u(...p),9,t);n0("wood",r,74,5,w(-4,116,0,0,Math.PI/2,0,t),Math.PI*2,32);for(let i of[-1,1])W("wood",r,u(-70,a-8,i*70),u(-98,a+230,i*68),8,t);n0("wood",r,68,8,w(-98,a+230,0,Math.PI/2,0,0,t),Math.PI,24),n0("wood",r,46,5,w(-90,a+196,0,Math.PI/2,0,0,t),Math.PI,20)}me(560,1700,-.18),me(630,1430,.06);let de=k(ee(900,576,Je)),Ve=k(new r0({uniforms:{uMap:{value:de},uGain:{value:1}},vertexShader:y0,fragmentShader:Ce,toneMapped:!1}));{let e=q.top,o=w(860,e,1640,.22);m("satin",[.64,.65,.67],-62,0,-88,62,8,88,o),m("plain",n.ink,-12,8,-76,50,8.6,76,o),m("satin",[.55,.56,.58],-56,8,-32,-20,8.4,32,o);let s=w(62,8,0,0,0,-.26,o);m("satin",[.64,.65,.67],-5,0,-88,0,124,88,s),m("plain",n.ink,-5.6,2,-86,-5,122,86,s),b0(new l0(162,104),Ve,w(-5.8,63,0,-Math.PI/2,0,0,s));let t=905,a=1820;R("wood",n.teak,t,e,a,40,4,null,40,24),R("thru",n.tea,t,e+6,a,21,60,null,24,24),R("thru",n.milk,t,e+66,a,24,9,null,24.5,24);for(let[i,p,d]of[[-8,5,66],[9,-6,70],[2,10,75]])m("glass",[.9,.95,1],t+i-8,e+d,a+p-8,t+i+8,e+d+14,a+p+8);_("glass",n.clear,[[0,0],[22,0],[24,4],[27,92],[25.5,92],[22.5,6],[0,6]],t,e+4,a,null,28),W("satin",[.95,.95,.92],u(t+6,e+30,a-4),u(t+22,e+136,a-14),3.2);let r=w(800,e,1430,-.3);m("plain",[.55,.42,.28],-42,0,-60,42,7,60,r),m("plain",n.cream,-40,7,-58,40,7.5,58,r),W("satin",n.ink,u(-30,10,40),u(30,10,-20),3,r),m("satin",n.ink,-20,0,-42,20,5,42,w(760,e,1840,.5)),re(790,e,2e3),Q0(790,e+4,2e3,n.cream,null,20,30),_("glass",n.clear,[[0,0],[40,0],[44,60],[30,120],[18,150],[20,160],[0,160]],1050,e,1300,null,24),R("glass",[.7,.85,.9],1050,e+4,1300,38,90,null,34,20),F0(990,e,1270,64),i0(1075,e,2010,u(1,0,0),71,34,46,n.terra,80)}W("plain",n.ink,u(V.x,V.y+60,V.z),u(V.x,h,V.z),2.5),S0("emit",[1,.88,.7],V.x,V.y,V.z,64,60,64,null,24);{let e=u(1060,620,1470);for(let o=0;o<3;o++){let s=o*2.094;W("plain",[.6,.52,.4],u(e.x+Math.cos(s)*44,e.y+60,e.z+Math.sin(s)*44),u(e.x,h-200,e.z),1.5)}W("plain",[.6,.52,.4],u(e.x,h-200,e.z),u(e.x,h,e.z),2),i0(e.x,e.y,e.z,u(-1,0,0),81,52,64,n.cream,0),H0(u(e.x-20,e.y+58,e.z+40),u(-.5,0,.86),280,83,38),H0(u(e.x+10,e.y+58,e.z-46),u(-.3,0,-.95),220,84,36)}m("wood",n.walnut,v-14,160,1640,v,580,1980),m("plain",[.92,.88,.8],v-15,182,1662,v-13,558,1958),m("plain",[.82,.48,.22],v-16,260,1720,v-15,480,1900),S0("plain",[.18,.3,.42],v-16.5,340,1810,1,70,70,null,24);for(let[e,o]of v0){let s=k(lt(o));for(let a of o)a.dispose();let t=new k0(s,ne[e]);e==="glass"&&(t.renderOrder=2),S.add(t)}v0.clear();let G0=new J0;G0.position.set(-450,h-160,1450),S.add(G0);let D0=(e,o,s)=>{O(e,o,null,s),v0.clear();let t=new k0(k(o),ne[e]);return G0.add(t),t};D0("plain",new M0(4,4,160,8).translate(0,80,0),n.slate),D0("plain",new M0(40,46,40,24),n.slate);for(let e=0;e<4;e++)D0("wood",new W0(320,6,70).translate(190,-10,0).rotateY(-e*Math.PI/2),n.teak);let L0=nt(l);G.push(L0);let Qe=[ae,pe,de];return{group:S,fan:G0,finish:L0,async warm(e){S.visible=!0;let o=l.getRenderTarget();l.setRenderTarget(L0.target);let s=l.compileAsync?l.compileAsync(z,e):(l.compile(z,e),null);l.setRenderTarget(o),S.visible=!1,s&&await s;for(let t of Qe)l.initTexture(t);L0.compile(),e0.bake()},bake(){e0.bake()},setVisible(e){S.visible!==e&&(S.visible=e,e&&e0.bake())},dispose(){z.remove(S),e0.dispose();for(let e of G)e.dispose?.()}}}export{ft as createShell};
