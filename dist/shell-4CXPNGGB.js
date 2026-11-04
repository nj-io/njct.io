import{a as Me}from"./chunk-GPH2DGKR.js";import"./chunk-SUF5GSKW.js";import{k as p0}from"./chunk-BLGVCQSZ.js";import{B as u0,C as w0,D as L0,E as k0,F as B0,G as r0,H as xe,J as X0,K as ye,O as ze,P as M0,Q as be,S as Ee,T as n0,U as ge,V as we,W as ke,b as q0,j as fe,l as ue,m as pe,p as O0,q as me,r as f0,t as x0,u as de,w as K0,x as ve,z as he}from"./chunk-NBWD5ZMU.js";var $=p0.room,X=p0.shelving,_0=p0.counter,U=p0.table,E=p0.window,x=p0.shopfront,Pe=4,P0=14,Z0=`vec3(${$.front.toFixed(1)}, ${((E.y0+E.y1)/2).toFixed(1)}, ${((E.z0+E.z1)/2).toFixed(1)})`,W0=`
uniform vec3 uWinQ[4];       // the shopfront's opening (light from the sky and the street)
uniform vec3 uPatchQ[4];     // the sunlit patch on the record wall (warm bounce)
uniform vec3 uWallQ[4];      // the lit record wall around the shelves (neutral bounce)
uniform vec3 uSkyCol, uPatchCol, uWallCol;
uniform vec4 uLampP[${Pe}];   // xyz, and w: 1 for a shade that sends its light down, 0 for a globe
uniform vec3 uLampCol;
uniform float uAmbient;
uniform vec4 uOcc[${P0}];      // boxes that shade what is near them: centre xz, half size xz (y below uOccTop)
uniform float uOccTop[${P0}];
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
    for (int i = 0; i < ${P0}; i++) {
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
  for (int i = 0; i < ${Pe}; i++) {
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
float njDither() { return (fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))) - 0.5) / 255.0; }
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
}`,De=`
uniform int uKind;
uniform float uGloss;
varying vec3 vP;
varying vec3 vN;
varying vec3 vCol;
${W0}
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
  if (uKind == 9) e += 0.7 * njRoomLight(vP, -n) * vec3(1.0, 0.82, 0.6);
  vec3 col = albedo(vP, n) * e;
  // a soft sheen on gloss: the window seen in it
  if (uGloss > 0.0) {
    vec3 v = normalize(vP - cameraPosition), r = reflect(v, n);
    vec3 w = ${Z0} - vP;
    col += uGloss * uSkyCol * pow(max(dot(r, normalize(w)), 0.0), 18.0) * njAO(vP, n);
  }
  gl_FragColor = vec4(njShoulder(col), 1.0);
  #include <colorspace_fragment>
  gl_FragColor.rgb += njDither();
}`,Ue=`
uniform sampler2D uWallBake;
uniform vec4 uWallRegion;    // the bake's world x0, y0, x1, y1
uniform vec3 uOak;
varying vec3 vP;
varying vec3 vN;
${W0}
vec3 spineCol(float h) {
  float k = fract(h * 7.13);
  vec3 c = k < 0.22 ? vec3(0.05, 0.05, 0.06) : k < 0.38 ? vec3(0.86, 0.83, 0.76) : k < 0.5 ? vec3(0.62, 0.13, 0.1)
         : k < 0.6 ? vec3(0.12, 0.2, 0.42) : k < 0.7 ? vec3(0.82, 0.52, 0.14) : k < 0.78 ? vec3(0.16, 0.34, 0.24)
         : k < 0.88 ? vec3(0.42, 0.4, 0.38) : vec3(0.58, 0.32, 0.22);
  return c * (0.75 + 0.4 * fract(h * 3.7));
}
void main() {
  const float CUB = ${X.cubby.toFixed(1)}, FR = ${X.frame.toFixed(1)}, DEP = ${X.depth.toFixed(1)};
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
  gl_FragColor.rgb += njDither();
}`,Qe=`
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
  float hgt = clamp((vP.y - ${E.y0.toFixed(1)}) / ${(E.y1-E.y0).toFixed(1)}, 0.0, 1.0);
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
}`,qe=`
uniform sampler2D uLeafSun;
uniform vec3 uSunU, uSunV;
uniform vec4 uMask;
uniform float uHasLeaves;
varying vec3 vP;
varying vec3 vN;
void main() {
  float rib = 0.5 + 0.5 * sin(vP.z / 4.2 * 3.14159);
  float hgt = clamp((vP.y - ${x.y0.toFixed(1)}) / ${(x.y1-x.y0).toFixed(1)}, 0.0, 1.0);
  vec3 col = mix(vec3(0.98, 0.9, 0.77), vec3(0.9, 0.92, 0.95), hgt) * (0.9 + 0.08 * rib);
  if (uHasLeaves > 0.5) {
    vec2 uv = (vec2(dot(vP, uSunU), dot(vP, uSunV)) - uMask.xy) / (2.0 * uMask.z) + 0.5;
    col *= 0.86 + 0.14 * texture2D(uLeafSun, uv).r;
  }
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`,Oe=`
uniform float uAlpha;
varying vec3 vP;
varying vec3 vN;
varying vec3 vCol;
${W0}
void main() {
  vec3 n = normalize(vN), v = normalize(vP - cameraPosition);
  if (dot(n, v) > 0.0) n = -n;
  float c = clamp(-dot(n, v), 0.0, 1.0), fr = 0.04 + 0.96 * pow(1.0 - c, 5.0);
  vec3 r = reflect(v, n);
  float spec = pow(max(dot(r, normalize(${Z0} - vP)), 0.0), 40.0);
  vec3 env = mix(vec3(0.3, 0.27, 0.23), uSkyCol * 0.45, smoothstep(-0.2, 0.7, r.x));
  vec3 refl = env + uSkyCol * spec * 1.6;
  vec3 tint = vCol * njRoomLight(vP, n);
  float a = clamp(fr * 0.9 + uAlpha + spec * 0.5, 0.0, 0.94);
  gl_FragColor = vec4(njShoulder((refl * fr * 0.9 + refl * spec * 0.5 + tint * uAlpha) / max(a, 1e-3)), a);
  #include <colorspace_fragment>
}`,Ke=`
uniform sampler2D uAtlas;
varying vec3 vP;
varying vec3 vN;
varying vec3 vCol;
varying vec2 vUv;
${W0}
void main() {
  vec4 t = texture2D(uAtlas, vUv);
  if (t.a < 0.5) discard;
  vec3 n = normalize(vN) * (gl_FrontFacing ? 1.0 : -1.0);
  vec3 c = vCol * t.rgb;
  vec3 col = c * (njRoomLight(vP, n) + njRoomLight(vP, -n) * 0.45 * vec3(0.85, 1.0, 0.45));
  vec3 v = normalize(vP - cameraPosition), r = reflect(v, n);
  col += 0.07 * uSkyCol * pow(max(dot(r, normalize(${Z0} - vP)), 0.0), 10.0);
  gl_FragColor = vec4(njShoulder(col), 1.0);
  #include <colorspace_fragment>
  gl_FragColor.rgb += njDither();
}`,Xe=`
varying vec3 vCol;
void main() { gl_FragColor = vec4(vCol, 1.0);
  #include <colorspace_fragment>
}`,Te=`
uniform sampler2D uMap;
uniform float uGain;
varying vec2 vUv;
void main() { gl_FragColor = vec4(texture2D(uMap, vUv).rgb * uGain, 1.0);
  #include <colorspace_fragment>
}`;function Y0(s,g,j,I=pe){let S=document.createElement("canvas");S.width=s,S.height=g,j(S.getContext("2d"),s,g);let A=new ze(S);return A.colorSpace=I,A.anisotropy=4,A}function J(s){return()=>{s|=0,s=s+1831565813|0;let g=Math.imul(s^s>>>15,1|s);return g=g+Math.imul(g^g>>>7,61|g)^g,((g^g>>>14)>>>0)/4294967296}}function Ye(s,g,j){let I=J(5);s.fillStyle="#1b1f1e",s.fillRect(0,0,g,j);for(let A=0;A<40;A++)s.fillStyle=`rgba(255,255,255,${.012+.02*I()})`,s.beginPath(),s.ellipse(I()*g,I()*j,60+160*I(),30+80*I(),I()*3,0,7),s.fill();s.fillStyle="rgba(244,240,230,0.94)",s.textBaseline="alphabetic",s.font='600 92px "NJ Text", system-ui, sans-serif',s.fillText("Menu",80,150),s.fillRect(80,178,220,4);let S=(A,w,m)=>{s.font='600 62px "NJ Text", system-ui, sans-serif',s.fillStyle="rgba(244,240,230,0.94)",s.fillText(w,80,A),s.font='400 34px "NJ Text", system-ui, sans-serif',s.fillStyle="rgba(232,226,212,0.78)";let c=m.split(" "),f="",y=A+56;for(let C of c)s.measureText(f+C).width>g-180&&(s.fillText(f,80,y),f="",y+=44),f+=C+" ";s.fillText(f,80,y)};S(320,"Cross-platform content","Video, images and posts made for each platform and published for you."),S(560,"Community management","Comments, messages and requests answered in your brand's voice."),s.font='600 40px "NJ Text", system-ui, sans-serif',s.fillStyle="rgba(240,196,120,0.95)",s.fillText("Order here \u2192",80,j-70)}function Ze(s,g,j){let I=s.createLinearGradient(0,0,0,j);I.addColorStop(0,"#e9e4da"),I.addColorStop(1,"#d8d1c3"),s.fillStyle=I,s.fillRect(0,0,g,j);let S=s.createRadialGradient(g*.58,j*.42,10,g*.58,j*.42,g*.42);S.addColorStop(0,"rgba(255,214,150,0.75)"),S.addColorStop(1,"rgba(255,214,150,0)"),s.fillStyle=S,s.fillRect(0,0,g,j);let A=[["#151515","#f08a24"],["#2f6fe8","#bcd6ff"],["#0f5e55","#8fe0c8"],["#1d3b2a","#f3f0e6"],["#dccdf6","#9b7be0"],["#ffd23f","#e2412f"],["#f6f4ef","#2fa35c"],["#efe6d2","#f07a18"],["#1f2a44","#f5c04a"],["#e9e2f8","#7a5cd6"]],w=j*.24;A.forEach(([D,z],N)=>{let H=N<5?0:1,R=N%5,Q=g*.04+R*(w+j*.03),V=H?j*.6:j*.22;s.fillStyle="rgba(0,0,0,0.12)",s.fillRect(Q+6,V+8,w,w),s.fillStyle=D,s.fillRect(Q,V,w,w),s.fillStyle=z,s.beginPath(),s.arc(Q+w*(.35+.3*(N%3)/2),V+w*.62,w*.22,0,7),s.fill(),s.fillRect(Q+w*.1,V+w*.1,w*.5,w*.1)}),s.fillStyle="#f4f1ea",s.fillRect(0,j*.22+w+2,g,7),s.fillRect(0,j*.6+w+2,g,7);let m=g*.4,c=j*.34,f=g*.56,y=j*.6,C=14;s.fillStyle="rgba(0,0,0,0.25)",s.beginPath(),s.roundRect(m+8,c+14,f,y,C),s.fill(),s.fillStyle="#17181b",s.beginPath(),s.roundRect(m,c,f,y,C),s.fill(),s.fillStyle="#25262b",s.beginPath(),s.roundRect(m,c,f,30,[C,C,0,0]),s.fill(),["#ff5f57","#febc2e","#28c840"].forEach((D,z)=>{s.fillStyle=D,s.beginPath(),s.arc(m+20+z*20,c+15,6,0,7),s.fill()});let u=[["#8be9a8","~/njct.io  feat/room"],["#d6d6d6","$ npm run build"],["#9a9a9a","  dist/ matches a fresh build"],["#d6d6d6","$ git log --oneline -3"],["#e8c07a","  0d72dde The sun: a plain window"],["#e8c07a",`  490f3f2 Tagline: "Products I've designed`],["#e8c07a","  18a1db7 Merge feat/sun into feat/room"],["#d6d6d6","$ \u2588"]];s.font="500 21px ui-monospace, Menlo, Consolas, monospace",u.forEach(([D,z],N)=>{s.fillStyle=D,s.fillText(z,m+18,c+62+N*30)})}function Je(s,g,j){s.clearRect(0,0,g,j);let S=(c,f)=>{s.save(),s.translate(c%4*256,(c>>2)*256),s.beginPath(),s.rect(0,0,256,256),s.clip(),f(),s.restore()},A=(c,f)=>{s.fillStyle=c,s.beginPath(),f(),s.fill()},w=(c,f)=>{s.save(),s.globalCompositeOperation=c,f(),s.restore()},m=(c,f,y)=>{s.lineWidth=c,s.strokeStyle=f,s.lineCap="round",s.lineJoin="round",s.beginPath(),s.moveTo(...y[0]);for(let C=1;C<y.length;C++)s.lineTo(...y[C]);s.stroke()};S(0,()=>{A("#d6d6d6",()=>{s.moveTo(128,226),s.bezierCurveTo(150,252,206,254,230,210),s.bezierCurveTo(258,156,246,66,198,32),s.bezierCurveTo(170,12,142,6,128,6),s.bezierCurveTo(114,6,86,12,58,32),s.bezierCurveTo(10,66,-2,156,26,210),s.bezierCurveTo(50,254,106,252,128,226)}),w("source-atop",()=>{m(5,"rgba(0,0,0,0.2)",[[128,236],[128,8]]);for(let c=0;c<6;c++)for(let f of[-1,1])m(3,"rgba(0,0,0,0.14)",[[128,214-c*34],[128+f*62,194-c*36],[128+f*130,160-c*38]])}),w("destination-out",()=>{for(let c=0;c<5;c++)for(let f of[-1,1])m(7-c*.7,"#000",[[128+f*34,198-c*34],[128+f*84,180-c*36],[128+f*150,146-c*38]]);s.fillStyle="#000";for(let c=0;c<3;c++)for(let f of[-1,1])s.beginPath(),s.ellipse(128+f*20,178-c*44,4.5,10,f*.4,0,7),s.fill()})}),S(1,()=>{A("#d2d2d2",()=>{s.moveTo(128,222),s.bezierCurveTo(104,252,22,246,20,170),s.bezierCurveTo(18,100,84,44,128,6),s.bezierCurveTo(172,44,238,100,236,170),s.bezierCurveTo(234,246,152,252,128,222)}),w("source-atop",()=>{m(4,"rgba(0,0,0,0.18)",[[128,230],[128,12]]);for(let c=0;c<4;c++)for(let f of[-1,1])m(2.5,"rgba(0,0,0,0.12)",[[128,200-c*40],[128+f*70,168-c*44],[128+f*98,128-c*46]]);for(let c=0;c<7;c++)s.fillStyle="rgba(255,255,230,0.38)",s.beginPath(),s.ellipse(64+c*21,80+c*53%120,4,28,.7-c*.2,0,7),s.fill()})}),S(2,()=>{A("#c6c6c6",()=>{s.moveTo(128,252),s.bezierCurveTo(92,248,66,214,66,176),s.bezierCurveTo(66,146,36,128,28,86),s.bezierCurveTo(20,40,70,4,128,6),s.bezierCurveTo(186,4,236,40,228,86),s.bezierCurveTo(220,128,190,146,190,176),s.bezierCurveTo(190,214,164,248,128,252)}),w("source-atop",()=>{m(5,"rgba(255,255,225,0.5)",[[128,252],[128,12]]);for(let c=0;c<6;c++)for(let f of[-1,1])m(2.5,"rgba(255,255,225,0.38)",[[128,222-c*34],[128+f*52,198-c*36],[128+f*94,170-c*38]])})}),S(3,()=>{A("#cccccc",()=>{s.moveTo(128,254),s.bezierCurveTo(86,226,66,140,72,60),s.bezierCurveTo(76,18,108,2,128,2),s.bezierCurveTo(148,2,180,18,184,60),s.bezierCurveTo(190,140,170,226,128,254)}),w("source-atop",()=>{m(5,"rgba(255,255,220,0.45)",[[128,254],[128,4]]);for(let c=0;c<22;c++)for(let f of[-1,1])m(1.2,"rgba(0,0,0,0.12)",[[128,240-c*10.5],[128+f*62,226-c*10.5]])}),w("destination-out",()=>{for(let[c,f]of[[64,1],[150,-1],[196,1],[110,-1]])m(2.5,"#000",[[128+f*18,c],[128+f*72,c-12]])})}),S(4,()=>{let c=()=>{s.moveTo(104,256),s.bezierCurveTo(94,150,104,60,128,0),s.bezierCurveTo(152,60,162,150,152,256)};A("#c8c8c8",c),w("source-atop",()=>{for(let f=0;f<16;f++)s.fillStyle=f%2?"rgba(0,0,0,0.2)":"rgba(255,255,220,0.2)",s.beginPath(),s.ellipse(128,242-f*15,34,3.5+f%3,.15*Math.sin(f),0,7),s.fill();s.strokeStyle="rgba(235,225,120,0.85)",s.lineWidth=5,s.beginPath(),c(),s.stroke()})}),S(5,()=>{A("#cfcfcf",()=>{s.arc(128,128,112,0,7)}),w("source-atop",()=>{for(let c=0;c<9;c++){let f=c/9*6.283;m(2.5,"rgba(0,0,0,0.13)",[[128,128],[128+Math.cos(f)*104,128+Math.sin(f)*104]])}})}),S(6,()=>{s.fillStyle="#c8c8c8";for(let c=0;c<18;c++){let f=246-c*13,y=104*Math.sin(Math.PI*(c+1)/20);for(let C of[-1,1])s.beginPath(),s.ellipse(128+C*y*.5,f-6,y*.5,5.5,C*-.35,0,7),s.fill()}m(3,"#c8c8c8",[[128,256],[128,8]])}),S(7,()=>{for(let c=0;c<5;c++){let f=c/5*6.283-1.57;s.fillStyle="#f4f4f4",s.beginPath(),s.ellipse(128+Math.cos(f)*54,128+Math.sin(f)*54,54,36,f,0,7),s.fill()}s.fillStyle="#f0d070",s.beginPath(),s.arc(128,128,22,0,7),s.fill()})}var et=`
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
}`;function tt(s){let g=new de(4,4,{type:fe,samples:4,depthBuffer:!0}),j=new r0({uniforms:{uSrc:{value:g.texture},uAmount:{value:0}},vertexShader:"varying vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:et,depthTest:!1,depthWrite:!1,toneMapped:!1}),I=new L0;I.setAttribute("position",new w0([-1,-1,0,3,-1,0,-1,3,0],3));let S=new k0(I,j);S.frustumCulled=!1;let A=new ye,w=new xe;A.add(S);let m=new O0;return{render(c,f,y){s.getDrawingBufferSize(m),(g.width!==m.x||g.height!==m.y)&&g.setSize(m.x,m.y),s.setRenderTarget(g),s.render(c,f),s.setRenderTarget(null),j.uniforms.uAmount.value=y,s.render(A,w)},dispose(){g.dispose(),j.dispose(),I.dispose()}}}function ot(s){let g=0,j=0;for(let C of s)g+=C.attributes.position.count,j+=C.index?C.index.count:C.attributes.position.count;let I=new Float32Array(g*3),S=new Float32Array(g*3),A=new Float32Array(g*2),w=new Float32Array(g*3),m=g>65535?new Uint32Array(j):new Uint16Array(j),c=0,f=0;for(let C of s){let u=C.attributes,D=u.position.count;if(I.set(u.position.array.subarray(0,D*3),c*3),S.set(u.normal.array.subarray(0,D*3),c*3),u.uv&&A.set(u.uv.array.subarray(0,D*2),c*2),w.set(u.aCol.array,c*3),C.index){let z=C.index.array;for(let N=0;N<z.length;N++)m[f+N]=z[N]+c;f+=z.length}else{for(let z=0;z<D;z++)m[f+z]=c+z;f+=D}c+=D}let y=new L0;return y.setAttribute("position",new u0(I,3)),y.setAttribute("normal",new u0(S,3)),y.setAttribute("uv",new u0(A,2)),y.setAttribute("aCol",new u0(w,3)),y.setIndex(new u0(m,1)),y.computeBoundingSphere(),y}var n={plaster:[.8,.77,.72],ceiling:[.78,.76,.72],floor:[.76,.71,.62],dark:[.035,.032,.03],oak:[.62,.45,.28],teak:[.4,.25,.14],walnut:[.2,.12,.07],bentwood:[.13,.075,.045],steel:[.05,.07,.06],chrome:[.24,.25,.26],stainless:[.44,.45,.46],ink:[.045,.045,.05],brass:[.5,.36,.16],mint:[.36,.56,.46],cream:[.9,.87,.8],terra:[.56,.3,.2],clay:[.7,.5,.36],sage:[.28,.4,.32],marble:[.86,.85,.82],slate:[.09,.1,.1],enamel:[.12,.24,.2],glow:[1,.86,.62],screen:[.1,.12,.16],leafM:[.12,.33,.09],leafF:[.14,.34,.08],leafP:[.2,.42,.1],leafS:[.12,.27,.11],leafB:[.2,.4,.12],stem:[.22,.32,.1],bark:[.25,.18,.12],soil:[.1,.07,.045],beans:[.18,.1,.05],coffee:[.09,.045,.02],tea:[.95,.4,.09],milk:[.95,.9,.8],crust:[.72,.42,.15],cane:[.62,.46,.27],oat:[.74,.66,.54],rust:[.56,.24,.12],indigo:[.08,.12,.27],olive:[.3,.32,.16],clear:[.85,.9,.88]},m0=[[.62,.36,.22],[.85,.8,.7],[.16,.2,.19],[.72,.52,.3],[.3,.44,.4],[.82,.62,.48],[.14,.16,.28]],d0=[[.95,.92,.85],[.9,.55,.25],[.2,.2,.2],[.85,.75,.3]];function rt({renderer:s,scene:g,lightUniforms:j,sun:I}){let S=new X0;S.visible=!1,g.add(S);let A=[],w=e=>(A.push(e),e),{front:m,back:c,floor:f,ceiling:y,depth:C}=$,u=(e,o,l)=>new f0(e,o,l),D=u(0,1,0),z={x0:c,x1:c+_0.back,z0:0,z1:2050,top:_0.backTop},N={x0:c,x1:c+300,z0:2065,z1:2345,top:560},H={z0:2440,z1:2740,spring:400},R=_0,Q={x0:-2075,x1:-1065,d:240,top:760},V=u((U.x0+U.x1)/2,310,(U.z0+U.z1)/2+60),J0=[u((R.x0+R.x1)/2,360,1080),u((R.x0+R.x1)/2,360,1960),u(c+250,470,620)],e0={uWinQ:{value:[x.y0,x.y1].flatMap(e=>[x.z0,x.z1].map(o=>u($.front,e,o)))},uPatchQ:{value:[0,1,2,3].map(()=>u(0,0,0))},uWallQ:{value:[u(-X.niche.x,$.floor,0),u(X.niche.x,$.floor,0),u(X.niche.x,X.niche.top,0),u(-X.niche.x,X.niche.top,0)]},uSkyCol:{value:u(2.3,2.38,2.55)},uPatchCol:{value:u(2.6,1.6,.78)},uWallCol:{value:u(.86,.82,.76)},uLampP:{value:[...J0.map(e=>new x0(e.x,e.y,e.z,1)),new x0(V.x,V.y,V.z,0)]},uLampCol:{value:u(.95,.6,.28)},uAmbient:{value:.065},uOcc:{value:Array.from({length:P0},()=>new x0(0,0,0,0))},uOccTop:{value:new Array(P0).fill(-1e4)}},z0=e0.uWinQ.value;[z0[2],z0[3]]=[z0[3],z0[2]];function Se(e,o,l){let t=0;for(let a=0;a<4;a++){let r=l[a].clone().sub(e).normalize(),i=l[(a+1)%4].clone().sub(e).normalize(),p=new f0().crossVectors(r,i);t+=Math.acos(Math.max(-1,Math.min(1,r.dot(i))))*o.dot(p)/Math.max(p.length(),1e-6)}return t/(2*Math.PI)}let N0=(e,o,l)=>{Se(o,l,e)<0&&e.reverse()},$0=u(0,0,1400);if(N0(z0,$0,u(1,0,0)),N0(e0.uWallQ.value,$0,u(0,0,-1)),I){let e=I.uniforms.uSunD.value;[[E.y0,E.z0],[E.y0,E.z1],[E.y1,E.z1],[E.y1,E.z0]].map(([l,t])=>u($.front,l,t)).forEach((l,t)=>e0.uPatchQ.value[t].copy(l).addScaledVector(e,-l.z/e.z)),N0(e0.uPatchQ.value,$0,u(0,0,-1))}else e0.uPatchCol.value.set(0,0,0);[[(z.x0+z.x1)/2,(z.z0+z.z1)/2,_0.back/2,(z.z1-z.z0)/2,z.top],[(N.x0+N.x1)/2,(N.z0+N.z1)/2,150,140,N.top],[(R.x0+R.x1)/2,(R.z0+R.z1)/2,(R.x1-R.x0)/2,(R.z1-R.z0)/2,R.top],[(Q.x0+Q.x1)/2,Q.d/2,(Q.x1-Q.x0)/2,Q.d/2,Q.top],[(U.x0+U.x1)/2,(U.z0+U.z1)/2,(U.x1-U.x0)/2,(U.z1-U.z0)/2,U.top],[560,1640,105,105,-366],[620,1990,105,105,-366],[m-70,715,70,485,x.y0],[(X.niche.x+m)/2,115,(m-X.niche.x)/2,115,316],[-1e3,430,100,100,-420],[-1347,1510,145,210,R.top+250],[-1330,1935,140,150,R.top+220],[-2270,1160,115,100,z.top+380]].forEach(([e,o,l,t,a],r)=>{e0.uOcc.value[r].set(e,o,l,t),e0.uOccTop.value[r]=a});let Re=w(Y0(1024,512,Je,ue)),T0=(e,o={},l={})=>w(new r0({uniforms:{...e0,...o},vertexShader:y0,fragmentShader:e,toneMapped:!1,...l})),Y=(e,o=0)=>T0(De,{uKind:{value:e},uGloss:{value:o}}),ee={plain:Y(0),satin:Y(0,.3),chrome:Y(0,.9),wood:Y(2,.04),flute:Y(5,.04),plaster:Y(3),marble:Y(4,.25),tile:Y(1,.04),glazed:Y(6,.5),fabric:Y(7),cane:Y(8),thru:Y(9,.2),emit:T0(Xe),leaf:T0(Ke,{uAtlas:{value:Re}},{side:q0}),glass:T0(Oe,{uAlpha:{value:.05}},{transparent:!0,depthWrite:!1,side:q0})},v0=new Map;function q(e,o,l,t){l&&o.applyMatrix4(l);let a=o.attributes.position.count,r=new Float32Array(a*3);for(let i=0;i<a;i++)r.set(t,i*3);return o.setAttribute("aCol",new u0(r,3)),v0.has(e)||v0.set(e,[]),v0.get(e).push(o),o}let te=new me,Ce=new ve,He=new f0,Fe=new f0(1,1,1),b=(e=0,o=0,l=0,t=0,a=0,r=0,i=null)=>{let p=new K0().compose(He.set(e,o,l),te.setFromEuler(Ce.set(a,t,r,"YXZ")),Fe);return i?i.clone().multiply(p):p},d=(e,o,l,t,a,r,i,p,v)=>q(e,new B0(r-l,i-t,p-a).translate((l+r)/2,(t+i)/2,(a+p)/2),v,o),T=(e,o,l,t,a,r,i,p,v=r,h=24)=>q(e,new M0(v,r,i,h).translate(l,t+i/2,a),p,o),S0=(e,o,l,t,a,r,i,p,v,h=16)=>q(e,new we(1,h,Math.max(6,h>>1)).scale(r,i,p).translate(l,t,a),v,o),B=(e,o,l,t,a,r,i,p=24)=>q(e,new Ee(l.map(([v,h])=>new O0(v,h)),p).translate(t,a,r),i,o),_=(e,o,l,t,a,r,i=8)=>{let p=t.clone().sub(l),v=p.length();return q(e,new M0(a,a,v,i).applyQuaternion(te.setFromUnitVectors(D,p.normalize())).translate((l.x+t.x)/2,(l.y+t.y)/2,(l.z+t.z)/2),r,o)},t0=(e,o,l,t,a,r=Math.PI*2,i=32)=>q(e,new ke(l,t,8,i,r),a,o),L=(e,o,l,t,a)=>q(e,new n0(l,t),a,o),oe=(e,o,l,t,a,r)=>{let i=new B0(1,1,1,8,8,2),p=i.attributes.position;for(let v=0;v<p.count;v++){let h=p.getX(v)*2,k=p.getY(v)*2,P=p.getZ(v),F=Math.sqrt(Math.max(0,(1-h**4)*(1-k**4)));p.setXYZ(v,h*l/2*(1-.06*k*k),k*t/2*(1-.06*h*h),P*a*(.18+.82*F))}return i.computeVertexNormals(),q(e,i,r,o)},h0=(e,o,l=.28)=>{let t=1-l/2+l*o();return e.map(a=>a*t)},b0=(e,o,l)=>{let t=new k0(w(e),o);return l&&(t.matrixAutoUpdate=!1,t.matrix.copy(l),t.matrixWorldNeedsUpdate=!0),S.add(t),t};function c0(e,o,l,t,a,r,i=.15,p=0){let v=t.clone().normalize(),h=new f0().crossVectors(v,D);h.lengthSq()<1e-6&&h.set(1,0,0),h.normalize(),p&&h.applyAxisAngle(v,p);let k=new f0().crossVectors(h,v).normalize(),P=new n0(1,1,2,4),F=P.attributes.position,G=P.attributes.uv;for(let M=0;M<F.count;M++){let W=G.getX(M),O=G.getY(M),s0=(W-.5)*2;F.setXYZ(M,(W-.5)*a,O*r,(-i*O*O+.05*s0*s0)*r),G.setXY(M,((e&3)+W)/4,1-((e>>2)+1-O)/2)}P.computeVertexNormals(),q("leaf",P,new K0().makeBasis(h,v,k).setPosition(l),o)}let R0=(e,o,l=3,t=n.stem)=>_("plain",t,e,o,l,null,5);function C0(e,o,l,t,a,r=n.terra,i="satin"){B(i,r,[[0,0],[t*.78,0],[t,a*.92],[t*1.05,a],[t*.95,a],[t*.9,a*.9],[0,a*.9]],e,o,l),T("plain",n.soil,e,o+a*.84,l,t*.9,4,null,t*.9,20)}function je(e,o,l,t,a,r,i=0,p=2*Math.PI){let v=J(r);for(let h=0;h<a;h++){let k=i+(p-i)*((h*.618+v()*.25)%1),P=.25+v()*.75,F=t*(.5+v()*.5),G=u(e,o,l),M=G.clone().addScaledVector(u(Math.cos(k)*Math.sin(P),Math.cos(P),Math.sin(k)*Math.sin(P)),F);R0(G,M,3.5),c0(0,h0(n.leafM,v),M,u(Math.cos(k),.45-v()*.7,Math.sin(k)),t*(.68+v()*.2),t*(.62+v()*.2),.16,(v()-.5)*.7)}}function Ie(e,o,l,t,a,r=0,i=2*Math.PI,p=20){let v=J(a),h=u(e+14,o+t,l-8);_("wood",n.bark,u(e,o,l),h,10,null,7);for(let k=0;k<p;k++){let P=.32+.68*(k/(p-1)),F=r+(i-r)*((k*.618+v()*.2)%1),G=u(e+14*P,o+t*P,l-8*P),M=u(Math.cos(F),.5,Math.sin(F)).normalize(),W=G.clone().addScaledVector(M,18);R0(G,W,3);let O=(120+80*v())*(1.15-.35*P);c0(2,h0(n.leafF,v),W,u(Math.cos(F),.4+v()*.9-.4*(1-P),Math.sin(F)),O*.62,O,.1,(v()-.5)*.9)}}function H0(e,o,l,t,a=40){let r=J(t),i=o.clone().setY(0).normalize(),p=e.clone(),v=Math.max(2,Math.round(l/32));for(let h=0;h<v;h++){let k=h<2?16:3,P=p.clone().add(u(i.x*k+(r()-.5)*10,-26-r()*10,i.z*k+(r()-.5)*10));R0(p,P,1.8);let F=h%2?1:-1,M=u(-i.z,0,i.x).multiplyScalar(F).multiplyScalar(.7).add(i.clone().multiplyScalar(.7)).add(u(0,-.2-r()*.6,0));c0(1,h0(n.leafP,r),P,M,a*(.8+r()*.3),a*(.9+r()*.3),.06,(r()-.5)*1.2),p=P}}function Ae(e,o,l,t,a,r,i=.2){let p=J(r);for(let v=0;v<a;v++){let h=p()*6.283,k=4+p()*14;c0(4,h0(n.leafS,p),u(e+Math.cos(h)*k,o,l+Math.sin(h)*k),u(Math.cos(h)*i,1,Math.sin(h)*i),t*.17,t*(.6+p()*.4),-.03,p()*3)}}function i0(e,o,l,t,a,r=38,i=52,p=n.cream){C0(e,o,l,r,i,p);let v=J(a);for(let h=0;h<5;h++){let k=h*1.3+v();c0(1,h0(n.leafP,v),u(e+Math.cos(k)*8,o+i*.85,l+Math.sin(k)*8),u(Math.cos(k),.9,Math.sin(k)),34,38,.2,v())}H0(u(e+t.x*r,o+i*.9,l+t.z*r),t,120+v()*140,a+1,34),H0(u(e+t.z*r*.6,o+i*.9,l-t.x*r*.6),t,60+v()*80,a+2,32)}let V0=(e,o,l,t=n.cream,a=null,r=24,i=38,p=!0)=>{B("satin",t,[[0,0],[r*.68,0],[r*.94,i*.5],[r,i],[r-2.5,i],[r*.92-2.5,i*.5],[0,5]],e,o,l,a,20),t0("satin",t,10,2.6,b(e+r-1,o+i*.55,l,0,0,-Math.PI/2,a),Math.PI,12),p&&T("plain",n.coffee,e,o+i-7,l,r-3,1,a,r-3,18)},ae=(e,o,l,t=n.cream,a=null)=>B("satin",t,[[0,0],[26,0],[40,6],[38,7],[0,3]],e,o,l,a,24),D0=(e,o,l,t=null,a=n.cream)=>{ae(e,o,l,a,t),V0(e,o+4,l,a,t),T("plain",n.milk,e,o+36,l,15,1.5,t,9,16)},F0=(e,o,l,t=60,a=null,r=null)=>{B("glass",n.clear,[[0,0],[21,0],[24,t],[22.5,t],[19.5,4],[0,4]],e,o,l,r,24),a&&T("thru",a,e,o+4,l,19,t*.62,r,21,20)},ne=(e,o,l,t,a,r=null)=>{T("glass",n.clear,e,o,l,34,t,r,34,24),T("satin",a,e,o+2,l,31,t*.72,r,31,20),T("satin",n.walnut,e,o+t,l,35,12,r,35,24)},E0=(e,o,l,t,a,r,i,p,v=null,h="z")=>{d("satin",i,e-t/2,o,l-r/2,e+t/2,o+a,l+r/2,v),h==="z"?d("plain",p,e-t/2+8,o+a*.3,l+r/2,e+t/2-8,o+a*.66,l+r/2+1.5,v):d("plain",p,e+t/2,o+a*.3,l-r/2+8,e+t/2+1.5,o+a*.66,l+r/2-8,v)};function U0(e,o,l,t=n.ink,a=null,r=0){let i=b(e,o,l,r,0,0,a);B("satin",t,[[0,0],[44,0],[46,50],[36,78],[12,84],[8,92],[0,94]],0,0,0,i,24),_("satin",t,u(30,16,0),u(72,92,0),4,i),_("satin",t,u(72,92,0),u(96,84,0),3.4,i),t0("satin",t,32,5,b(-40,52,0,0,0,Math.PI/2,i),Math.PI,16)}L("tile",n.floor,m-c,C,b((m+c)/2,f,C/2,0,-Math.PI/2)),L("plaster",n.ceiling,m-c,C,b((m+c)/2,y,C/2,0,Math.PI/2)),L("plaster",n.plaster,m-c,y-f,b((m+c)/2,(f+y)/2,C,Math.PI));{let e=new be,o=-(H.z0+H.z1)/2,l=(H.z1-H.z0)/2;e.moveTo(0,f),e.lineTo(0,y),e.lineTo(-C,y),e.lineTo(-C,f),e.lineTo(-H.z1,f),e.lineTo(-H.z1,H.spring),e.absarc(o,H.spring,l,Math.PI,0,!0),e.lineTo(-H.z0,f),e.lineTo(0,f);let t=new ge(e,24);q("plaster",t,b(c,0,0,Math.PI/2),n.plaster);let a=110,r=24,i=[],p=[],v=[],h=[];for(let M=0;M<=r;M++){let W=Math.PI*(1-M/r),O=H.spring+l*Math.sin(W),s0=(H.z0+H.z1)/2+l*Math.cos(W);for(let K of[c,c-a])i.push(K,O,s0),p.push(0,-Math.sin(W),-Math.cos(W)),v.push(0,0);if(M<r){let K=M*2;h.push(K,K+2,K+1,K+1,K+2,K+3)}}let k=new L0;k.setAttribute("position",new w0(i,3)),k.setAttribute("normal",new w0(p,3)),k.setAttribute("uv",new w0(v,2)),k.setIndex(h),q("plaster",k,null,n.plaster),L("plaster",n.plaster,a,H.spring-f,b(c-a/2,(H.spring+f)/2,H.z0,0)),L("plaster",n.plaster,a,H.spring-f,b(c-a/2,(H.spring+f)/2,H.z1,Math.PI));let P=c-520,F=H.z0-60,G=C+400;L("plain",n.dark,G-F,y-f,b(P,(f+y)/2,(F+G)/2,Math.PI/2)),L("plain",[.06,.055,.05],c-a-P,G-F,b((c-a+P)/2,f,(F+G)/2,0,-Math.PI/2)),L("plain",n.dark,c-a-P,G-F,b((c-a+P)/2,H.spring+l+40,(F+G)/2,0,Math.PI/2)),L("plain",n.dark,c-a-P,y-f,b((c-a+P)/2,(f+y)/2,F)),L("plain",n.dark,c-a-P,y-f,b((c-a+P)/2,(f+y)/2,G,Math.PI)),L("plain",n.dark,G-F,y-f,b(c-a,(f+y)/2,(F+G)/2,-Math.PI/2));for(let[M,W]of[[H.z0+4,H.z0+170],[H.z0+196,H.z1-4]]){let O=new n0(W-M,H.spring-f-70,28,1),s0=O.attributes.position;for(let K=0;K<s0.count;K++)s0.setZ(K,9*Math.sin(s0.getX(K)/11));O.computeVertexNormals(),q("thru",O,b(c-40,(H.spring+f+70)/2,(M+W)/2,Math.PI/2),[.72,.64,.52])}_("chrome",n.brass,u(c-40,H.spring+6,H.z0),u(c-40,H.spring+6,H.z1),5)}let j0=$.wall;d("plaster",n.plaster,m,f,0,m+j0,y,x.z0),d("plaster",n.plaster,m,f,x.z1,m+j0,y,C),d("plaster",n.plaster,m,f,x.z0,m+j0,x.y0,x.z1),d("plaster",n.plaster,m,x.y1,x.z0,m+j0,y,x.z1);let g0=(e,o,l,t)=>d("satin",n.steel,m-4,o,e,m+14,t,l),o0=E.frame;for(let e of[x.z0,E.z0,E.z1,x.z1-o0])g0(e,x.y0,e+o0,x.y1);for(let e of x.sideBars)g0(e-E.bar/2,x.y0,e+E.bar/2,x.y1);for(let e of[x.y0,E.y0,E.y1-o0,x.y1-o0])g0(x.z0,e,x.z1,e+o0);let le=E.y0+(E.y1-E.y0)*E.transom,Ge=[E.z0+o0+(E.z1-E.z0-2*o0)/3,E.z0+o0+2*(E.z1-E.z0-2*o0)/3];g0(E.z0,le-E.transomBar/2,E.z1,le+E.transomBar/2);for(let e of Ge)g0(e-E.bar/2,E.y0,e+E.bar/2,E.y1);let se=I?.uniforms.uLeaf0.value||null,re=w(new r0({uniforms:{uLeafSun:{value:se},uSunU:I?I.uniforms.uSunU:{value:u(1,0,0)},uSunV:I?I.uniforms.uSunV:{value:u(0,1,0)},uMask:I?I.uniforms.uMask:{value:new x0},uHasLeaves:{value:se?1:0}},vertexShader:y0,fragmentShader:Qe,toneMapped:!1}));b0(new n0(x.z1-x.z0+200,x.y1-x.y0+200),re,b(m+60,(x.y0+x.y1)/2,(x.z0+x.z1)/2,-Math.PI/2));let Le=w(new r0({uniforms:{...re.uniforms,uLeafSun:{value:I?.uniforms.uLeaf2.value||null}},vertexShader:y0,fragmentShader:qe,toneMapped:!1})),I0=(e,o,l,t)=>b0(new n0(l-e,t-o),Le,b(m+6,(o+t)/2,(e+l)/2,-Math.PI/2));I0(x.z0,x.y0,E.z0,x.y1),I0(E.z1,x.y0,x.z1,x.y1),I0(E.z0,x.y0,E.z1,E.y0),I0(E.z0,E.y1,E.z1,x.y1);let a0=Me(s,j),Be=[c,f,m,y];a0.resize(c,f,m,y,360,190),a0.mesh.position.z=-1,a0.mesh.updateMatrixWorld(),a0.mesh.renderOrder=-2,S.add(a0.mesh);let _e=w(new r0({uniforms:{...e0,uWallBake:a0.mesh.material.uniforms.uBake,uWallRegion:{value:new x0(...Be)},uOak:{value:new he(...n.oak)}},vertexShader:y0,fragmentShader:Ue,toneMapped:!1})),l0=X.niche.x,A0=X.depth,Z=300;b0(new n0(m-l0,Z-f),_e,b((l0+m)/2,(f+Z)/2,A0)),L("wood",n.oak,A0,Z-f,b(l0,(f+Z)/2,A0/2,-Math.PI/2)),d("wood",n.oak,l0,Z,0,m,Z+16,A0+10),C0(1060,Z+16,112,70,130,n.terra),je(1060,Z+130,112,180,12,11,Math.PI/2-.2,Math.PI+.3);for(let[e,o]of[[930,[.85,.82,.75]],[960,[.16,.16,.18]]])d("satin",o,e-6,Z+16,30,e+6,Z+196,200);d("plaster",n.plaster,-l0-110,f,0,-l0,y,70),L("plaster",n.plaster,-l0-110-c,y-f,b((c-l0-110)/2,(f+y)/2,.5)),d("plain",n.slate,-1700,y-26,380,900,y-14,400);for(let e of[-1300,-500,300])T("plain",n.slate,0,-50,0,26,100,b(e,y-70,390,0,-.5),30,20);d("plain",n.ink,z.x0,f,z.z0,z.x1-20,f+60,z.z1),d("flute",n.teak,z.x0,f+60,z.z0,z.x1-10,z.top-20,z.z1),d("marble",n.marble,z.x0,z.top-20,z.z0,z.x1+6,z.top,z.z1+6),L("glazed",n.sage,z.z1,400,b(c+1,z.top+200,z.z1/2,Math.PI/2)),d("wood",n.oak,c,z.top+400,20,c+190,z.top+420,z.z1);{let e=z.top+420,o=c+95,l=J(31),t=70,a=["cups","glasses","jars","plant","cups","teapot","glasses","jars","cups","plant","bags","cups"];for(let r of a){if(t>z.z1-80)break;if(r==="cups"){for(let i=0;i<3;i++)for(let p=0;p<3-i;p++)T("satin",i?n.cream:n.clay,o,e+i*34,t+p*54+i*27,24,32,null,21,18);t+=190}else if(r==="glasses"){for(let i=0;i<4;i++)F0(o,e,t+i*52,64);t+=230}else if(r==="jars"){for(let i=0;i<3;i++)ne(o,e,t+i*78,90+30*l(),i%2?n.beans:[.85,.75,.55]);t+=250}else if(r==="plant")i0(o,e,t+30,u(1,0,.15),40+t,36,48),t+=150;else if(r==="teapot")S0("satin",n.clay,o,e+50,t+30,50,46,50),_("satin",n.clay,u(o,e+50,t+70),u(o+6,e+84,t+110),7),t0("satin",n.clay,24,5,b(o,e+60,t-18,Math.PI/2,0,Math.PI/2),Math.PI,12),t+=150;else if(r==="bags"){for(let i=0;i<3;i++)E0(o,e,t+i*82,50,150-i*12,74,m0[i+1],d0[i],null,"x");t+=260}}}d("plain",n.slate,c+1,600,800,c+14,1240,1800);let We=w(Y0(1400,900,Ye)),Ne=w(new r0({uniforms:{uMap:{value:We},uGain:{value:.92}},vertexShader:y0,fragmentShader:Te,toneMapped:!1}));b0(new n0(990,636),Ne,b(c+16,920,1300,Math.PI/2)),d("wood",n.oak,c+1,584,784,c+18,1256,800),d("wood",n.oak,c+1,584,1800,c+18,1256,1816);for(let[e,o]of[[80,700],[1900,2360]]){for(let t of[700,960])d("wood",n.oak,c,t,e,c+170,t+20,o);let l=J(e+9);i0(c+85,720,e+90,u(1,0,.1),e+1,40,56,n.terra);for(let t=0;t<4;t++)E0(c+85,720,e+210+t*82,56,140+20*l(),70,m0[(t+e)%m0.length],d0[t%d0.length],null,"x");i0(c+85,980,o-110,u(1,0,-.1),e+2,44,60,n.cream);for(let t=0;t<3;t++)T("satin",t%2?n.sage:n.cream,c+85,980,e+80+t*80,30,70+t*20,null,26,20)}{let e=z.top,o=(z.x0+z.x1)/2;_("chrome",n.chrome,u(c+60,e,360),u(c+60,e+150,360),7),_("chrome",n.chrome,u(c+60,e+150,360),u(c+150,e+120,360),6),d("plain",n.ink,o-70,e,150,o+90,e+10,300);for(let t=0;t<2;t++)for(let a=0;a<3;a++)T("satin",n.cream,o-30+t*70,e+10,180+a*50,22,30,null,26,16);d("wood",n.walnut,o-70,e,600,o+70,e+14,1e3);for(let t of[610,990])d("wood",n.walnut,o-10,e+14,t-8,o+10,e+190,t+8);d("wood",n.walnut,o-56,e+190,600,o+56,e+204,1e3);for(let t of[700,880])d("plain",n.ink,o-44,e+14,t-44,o+44,e+26,t+44),B("glass",n.clear,[[0,0],[40,0],[44,56],[34,92],[28,98],[0,98]],o,e+26,t),T("plain",n.coffee,o,e+28,t,38,34,null,42,20),B("satin",n.cream,[[0,0],[16,0],[56,66],[60,72],[56,72],[14,6],[0,6]],o,e+196,t);U0(o+20,e,1040,n.ink,null,Math.PI/2),d("satin",n.stainless,o-120,e,1070,o+100,e+380,1250),d("plain",n.ink,o+100,e+230,1090,o+130,e+300,1230),d("emit",[.25,.5,.42],o+100,e+330,1140,o+102,e+350,1180),B("glass",n.clear,[[0,0],[60,0],[64,70],[40,120],[36,130],[0,130]],o+40,e+6,1160),T("plain",n.coffee,o+40,e+8,1160,58,60,null,62,20),T("satin",n.stainless,o-20,e,1420,74,250,null,70,28),T("satin",n.ink,o-20,e+250,1420,50,30,null,30,20),_("chrome",n.chrome,u(o+60,e,1580),u(o+60,e+260,1580),4),t0("chrome",n.chrome,44,3,b(o+20,e+260,1580,0,Math.PI/2)),_("chrome",n.chrome,u(o+60,e+260,1580),u(o+64,e+260,1580),4),B("thru",[.78,.56,.36],[[2,0],[10,0],[40,110],[44,116],[0,116]],o+20,e+150,1580),T("satin",n.stainless,o+20,e,1580,54,90,null,52,24),d("satin",n.ink,o-45,e,1700,o+45,e+110,1790),B("glass",n.clear,[[0,0],[40,0],[52,150],[50,160],[0,160]],o,e+110,1745),[[.5,.16,.06],[.75,.45,.12],[.2,.32,.12],[.62,.1,.12],[.85,.7,.45]].forEach((t,a)=>{B("satin",t,[[0,0],[20,0],[20,120],[9,140],[8,170],[0,170]],o+60,e,1840+a*44,null,16),T("plain",n.ink,o+60,e+170,1840+a*44,9,10,null,9,10)});for(let t=0;t<2;t++)T("satin",[.92,.9,.84],o-60,e,1880+t*70,22,150,null,27,18)}{let{x0:e,x1:o,z0:l,z1:t,top:a}=N,r=16;d("satin",n.ink,e,f,l,o,f+90,t),d("satin",n.ink,e,a-70,l,o,a,t),d("satin",n.ink,e,f+90,l,o,a-70,l+r),d("satin",n.ink,e,f+90,t-r,o,a-70,t),L("emit",[.96,1,1.04],t-l-2*r,a-70-f-90,b(e+4,(a-70+f+90)/2,(l+t)/2,Math.PI/2));let i=[[.3,.14,.05],[.95,.42,.1],[.92,.9,.85],[.25,.4,.15],[.62,.32,.1]];for(let p=0;p<4;p++){let v=f+100+p*245;d("plain",[.25,.26,.27],e+4,v,l+r,o-24,v+4,t-r);for(let h=0;h<6;h++){let k=i[(p*2+h)%i.length],P=l+44+h*38;B("satin",k,[[0,0],[15,0],[15,110],[7,140],[7,160],[0,160]],o-120,v+4,P,null,14),B("satin",i[(p+h+2)%5],[[0,0],[15,0],[15,110],[7,140],[7,160],[0,160]],o-70,v+4,P+18,null,14)}}L("glass",n.clear,t-l-2*r,a-70-f-90,b(o-6,(a-70+f+90)/2,(l+t)/2,Math.PI/2)),d("chrome",n.chrome,o-4,f+200,t-40,o+14,a-200,t-30),d("emit",[.95,.92,.85],o-1,a-50,l+30,o+1,a-20,t-30)}d("plain",n.ink,R.x0+20,f,R.z0+20,R.x1-20,f+50,R.z1-20),d("flute",n.oak,R.x0+10,f+50,R.z0+10,R.x1-10,R.top-20,R.z1-10),d("marble",n.marble,R.x0-6,R.top-20,R.z0,R.x1+12,R.top,R.z1);{let a=R.top;d("chrome",n.chrome,-1490,a,1300,-1205,a+18,1720),d("satin",n.mint,-1480,a+18,1310,-1215,a+240,1710),d("chrome",n.chrome,-1484,a+240,1306,-1211,a+250,1714);for(let r of[1308,1712])d("chrome",n.chrome,-1480,a+250,r-3,-1215,a+272,r+3);for(let r of[90,200])d("satin",n.chrome,-1215,a+r,1326,-1212,a+r+10,1694);d("satin",[.25,.4,.33],-1215,a+30,3020/2-2,-1213,a+236,3020/2+2);for(let r=0;r<2;r++)for(let i=0;i<5;i++)T("satin",i%3===1?n.clay:n.cream,-1410+r*120,a+250,1360+i*(300/4),26,34,null,21,18);for(let r of[1310+400*.32,1310+400*.68])d("chrome",n.chrome,-1530,a+120,r-46,-1480,a+196,r+46),T("chrome",n.chrome,-1510,a+92,r,34,28),T("chrome",n.chrome,-1510,a+70,r,32,22),d("plain",n.ink,-1630,a+74,r-10,-1530,a+90,r+10),T("satin",n.cream,-1510,a+18,r,26,36,null,24,18),T("satin",n.cream,0,-2,0,18,4,b(-1481,a+206,r,0,0,Math.PI/2),18,20);d("chrome",n.chrome,-1560,a,1340,-1480,a+16,1680);for(let r of[1335,1685])_("chrome",n.chrome,u(-1490,a+200,r),u(-1550,a+40,r),5);for(let[r,i]of[[0,0],[40,46]])B("chrome",n.stainless,[[0,0],[30,0],[30,50],[24,66],[27,72],[0,70]],-1520+r,a,1760+i,null,20);d("satin",n.ink,-1470,a,1215,-1395,a+70,1285)}{let e=R.top;for(let[l,t]of[[1150,n.ink],[1010,[.86,.84,.8]]])d("satin",t,-1475,e,l-50,-1365,e+210,l+50),d("satin",t,-1508,e+70,l-22,-1475,e+120,l+22),T("chrome",n.chrome,-1420,e+210,l,50,26,null,46),T("satin",n.beans,-1420,e+236,l,32,78,null,52),T("glass",n.clear,-1420,e+236,l,36,120,null,64),T("satin",n.ink,-1420,e+356,l,64,10);D0(-1250,e,815),D0(-1250,e,905),F0(-1325,e,860,80,[.62,.42,.26]),B("satin",n.cream,[[0,0],[22,0],[26,30],[12,70],[10,92],[13,96],[0,96]],-1230,e,1050,null,20);let o=J(77);for(let l=0;l<3;l++){let t=u(-1230+(o()-.5)*40,e+170+o()*50,1050+(o()-.5)*50);R0(u(-1230,e+90,1050),t,1.6),c0(7,[.95,.62,.66],t.clone().add(u(0,-18,0)),u(.6,.5,o()-.5),40,40,0,0),c0(1,h0(n.leafP,o),u(-1230,e+120+l*16,1050),u(o()-.5,.4,o()-.5),22,26,.1,0)}}{let a=R.top,r=210;d("wood",n.oak,-1470,a,1800,-1192,a+16,2090),L("glass",n.clear,290,r,b(-1192,a+16+r/2,3890/2,Math.PI/2)),L("glass",n.clear,278,r,b(-2662/2,a+16+r/2,1800,Math.PI)),L("glass",n.clear,278,r,b(-2662/2,a+16+r/2,2090)),L("glass",n.clear,278,290,b(-2662/2,a+16+r,3890/2,0,-Math.PI/2)),L("glass",n.clear,278,290,b(-2662/2,a+16+r*.5,3890/2,0,-Math.PI/2));for(let[i,p]of[[-1192,1800],[-1192,2090],[-1470,1800],[-1470,2090]])d("chrome",n.brass,i-3,a+16,p-3,i+3,a+16+r,p+3);for(let i=0;i<4;i++)t0("satin",n.crust,26,14,b(-1380+i%2*90,a+30,1860+i*58,i*.7,-Math.PI/2),Math.PI*1.25,14);T("satin",[.94,.86,.72],-1360,a+16+r*.5,3890/2-40,62,52,null,62,32),T("satin",[.62,.32,.2],-1360,a+16+r*.5+52,3890/2-40,62,6,null,62,32);for(let i=0;i<5;i++)T("satin",[.7,.5,.3],-1260,a+16+r*.5+i*8,1900+i%2*6,26,7,null,26,18)}{let e=R.top,o=-1262,l=2200;T("chrome",n.ink,o,e,l,30,6),T("chrome",n.ink,o,e+6,l,8,70);let t=b(o+8,e+112,l,0,0,.55);d("satin",n.ink,-5,-56,-78,5,56,78,t),L("emit",n.screen,146,102,b(5.5,0,0,Math.PI/2,0,0,t)),d("satin",n.ink,-1250,e,2105,-1200,e+14,2150),F0(-1215,e,2270,74)}for(let e of J0)_("plain",n.ink,u(e.x,e.y+80,e.z),u(e.x,y,e.z),2.5),B("satin",n.enamel,[[100,0],[96,24],[72,64],[30,86],[12,94],[0,96]],e.x,e.y-10,e.z,null,32),B("emit",[.95,.82,.62],[[0,92],[12,90],[30,82],[72,60],[94,22],[98,0]],e.x,e.y-10,e.z,null,32),S0("emit",n.glow,e.x,e.y+14,e.z,26,30,26);{let{x0:e,x1:o,d:l,top:t}=Q,a=[0,1,2,3].map(p=>e+(o-e)*p/3);for(let p of a)for(let v of[14,l-14])d("satin",n.steel,p-7,f,v-7,p+7,t,v+7);let r=[-560,-300,-40,220,480,t-22];for(let p of r)d("wood",n.oak,e-12,p,0,o+12,p+22,l);let i=J(53);for(let p=0;p<r.length-1;p++){let v=r[p]+22;for(let h=0;h<3;h++){let k=a[h]+24,P=a[h+1]-24,F=l/2+10,G=h===0?["stock","cups","stock","jars","stock"][p]:["bags","mugs","bags","bags","kettles"][(p+h)%5];if(G==="stock")for(let M=k;M<P-90;M+=104)d("plain",p%2?[.62,.5,.36]:[.92,.9,.86],M,v,F-80,M+92,v+120+40*i(),F+70);else if(G==="cups")for(let M=k+30;M<P-20;M+=62)T("satin",[.92,.9,.84],M,v,F,24,170,null,28,16);else if(G==="jars")for(let M=k+40;M<P-30;M+=84)ne(M,v,F,110+40*i(),i()<.5?n.beans:[.85,.75,.55]);else if(G==="bags")for(let M=k+34;M<P-30;M+=74)E0(M,v,F+20,60,130+40*i(),60,m0[i()*m0.length|0],d0[i()*d0.length|0]);else if(G==="mugs"){let M=p;for(let W=k+34;W<P-30;W+=70)V0(W,v,F+40,[n.cream,n.sage,n.clay,n.terra][M++%4],null,28,52,!1)}else G==="kettles"&&(U0(k+70,v,F+10,n.stainless),U0(P-90,v,F+10,[.9,.88,.82]))}}i0(e+140,t,l/2,u(0,0,1),61,44,60,n.terra),i0(o-160,t,l/2,u(.2,0,1),62,40,56,n.cream),E0(-1500,t,l/2,60,160,64,m0[2],d0[1]),E0(-1420,t,l/2,60,150,64,m0[4],d0[0])}C0(-1e3,f,430,105,230,n.cream),Ie(-1e3,f+200,430,860,91,.3*Math.PI,1.65*Math.PI,34),d("flute",n.oak,m-140,f,240,m,x.y0-22,1190),d("wood",n.oak,m-150,x.y0-22,230,m+4,x.y0,1200),d("fabric",n.oat,m-140,x.y0,250,m-6,x.y0+34,1180),oe("fabric",n.rust,150,140,46,b(m-40,x.y0+104,340,-Math.PI/2,-.22,0)),oe("fabric",n.olive,136,128,42,b(m-42,x.y0+98,1085,-Math.PI/2+.2,-.26,0)),d("wood",n.walnut,m-120,x.y0+34,610,m-20,x.y0+42,760),D0(m-70,x.y0+42,680,null,n.sage),C0(m-60,x.y0+34,1162,38,70,n.cream),Ae(m-60,x.y0+92,1162,230,7,17,.08);{let{x0:e,x1:o,z0:l,z1:t,top:a}=U;d("wood",n.oak,e,a-32,l,o,a,t),d("wood",n.oak,e+36,a-86,l+36,o-36,a-32,t-36);for(let r of[e+34,o-34])for(let i of[l+34,t-34])d("wood",n.oak,r-22,f,i-22,r+22,a-32,i+22)}function ce(e,o,l){let t=b(e,f,o,l),a=254,r=n.bentwood;T("cane",n.cane,0,a-14,0,106,14,t,106,28),t0("wood",r,106,7,b(0,a-10,0,0,Math.PI/2,0,t),Math.PI*2,40);for(let[i,p]of[[[60,a-18,60],[80,0,82]],[[60,a-18,-60],[80,0,-82]],[[-64,a-18,60],[-90,0,84]],[[-64,a-18,-60],[-90,0,-84]]])_("wood",r,u(...i),u(...p),9,t);t0("wood",r,74,5,b(-4,116,0,0,Math.PI/2,0,t),Math.PI*2,32);for(let i of[-1,1])_("wood",r,u(-70,a-8,i*70),u(-98,a+230,i*68),8,t);t0("wood",r,68,8,b(-98,a+230,0,Math.PI/2,0,0,t),Math.PI,24),t0("wood",r,46,5,b(-90,a+196,0,Math.PI/2,0,0,t),Math.PI,20)}ce(560,1640,-.18),ce(630,1990,.06);let $e=w(Y0(900,576,Ze)),Ve=w(new r0({uniforms:{uMap:{value:$e},uGain:{value:1}},vertexShader:y0,fragmentShader:Te,toneMapped:!1}));{let e=U.top,o=b(860,e,1640,.22);d("satin",[.64,.65,.67],-62,0,-88,62,8,88,o),d("plain",n.ink,-12,8,-76,50,8.6,76,o),d("satin",[.55,.56,.58],-56,8,-32,-20,8.4,32,o);let l=b(62,8,0,0,0,-.26,o);d("satin",[.64,.65,.67],-5,0,-88,0,124,88,l),d("plain",n.ink,-5.6,2,-86,-5,122,86,l),b0(new n0(162,104),Ve,b(-5.8,63,0,-Math.PI/2,0,0,l));let t=905,a=1820;T("wood",n.teak,t,e,a,40,4,null,40,24),T("thru",n.tea,t,e+6,a,21,60,null,24,24),T("thru",n.milk,t,e+66,a,24,9,null,24.5,24);for(let[i,p,v]of[[-8,5,66],[9,-6,70],[2,10,75]])d("glass",[.9,.95,1],t+i-8,e+v,a+p-8,t+i+8,e+v+14,a+p+8);B("glass",n.clear,[[0,0],[22,0],[24,4],[27,92],[25.5,92],[22.5,6],[0,6]],t,e+4,a,null,28),_("satin",[.95,.95,.92],u(t+6,e+30,a-4),u(t+22,e+136,a-14),3.2);let r=b(800,e,1430,-.3);d("plain",[.55,.42,.28],-42,0,-60,42,7,60,r),d("plain",n.cream,-40,7,-58,40,7.5,58,r),_("satin",n.ink,u(-30,10,40),u(30,10,-20),3,r),d("satin",n.ink,-20,0,-42,20,5,42,b(760,e,1840,.5)),ae(790,e,2e3),V0(790,e+4,2e3,n.cream,null,20,30),B("glass",n.clear,[[0,0],[40,0],[44,60],[30,120],[18,150],[20,160],[0,160]],1050,e,1300,null,24),T("glass",[.7,.85,.9],1050,e+4,1300,38,90,null,34,20),F0(990,e,1270,64),i0(1075,e,2010,u(0,0,-1),71,34,46,n.terra)}_("plain",n.ink,u(V.x,V.y+60,V.z),u(V.x,y,V.z),2.5),S0("emit",[1,.88,.7],V.x,V.y,V.z,64,60,64,null,24);{let e=u(1060,620,1470);for(let o=0;o<3;o++){let l=o*2.094;_("plain",[.6,.52,.4],u(e.x+Math.cos(l)*44,e.y+60,e.z+Math.sin(l)*44),u(e.x,y-200,e.z),1.5)}_("plain",[.6,.52,.4],u(e.x,y-200,e.z),u(e.x,y,e.z),2),i0(e.x,e.y,e.z,u(-1,0,0),81,52,64,n.cream),H0(u(e.x-20,e.y+58,e.z+40),u(-.5,0,.86),280,83,38),H0(u(e.x+10,e.y+58,e.z-46),u(-.3,0,-.95),220,84,36)}d("wood",n.walnut,m-14,160,1640,m,580,1980),d("plain",[.92,.88,.8],m-15,182,1662,m-13,558,1958),d("plain",[.82,.48,.22],m-16,260,1720,m-15,480,1900),S0("plain",[.18,.3,.42],m-16.5,340,1810,1,70,70,null,24);for(let[e,o]of v0){let l=w(ot(o));for(let a of o)a.dispose();let t=new k0(l,ee[e]);e==="glass"&&(t.renderOrder=2),S.add(t)}v0.clear();let G0=new X0;G0.position.set(-450,y-160,1450),S.add(G0);let Q0=(e,o,l)=>{q(e,o,null,l),v0.clear();let t=new k0(w(o),ee[e]);return G0.add(t),t};Q0("plain",new M0(4,4,160,8).translate(0,80,0),n.slate),Q0("plain",new M0(40,46,40,24),n.slate);for(let e=0;e<4;e++)Q0("wood",new B0(320,6,70).translate(190,-10,0).rotateY(-e*Math.PI/2),n.teak);let ie=tt(s);return A.push(ie),{group:S,fan:G0,finish:ie,bake(){a0.bake()},setVisible(e){S.visible!==e&&(S.visible=e,e&&a0.bake())},dispose(){g.remove(S),a0.dispose();for(let e of A)e.dispose?.()}}}export{rt as createShell};
