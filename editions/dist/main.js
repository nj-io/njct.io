import{A as S,B as lt,C as Q,D as ct,E as yo,F as ce,G as wo,H as go,I as Eo,J as bo,K as So,L as ae,M as ne,N as Mo,O as Ro,Q as To,R as ko,S as Ho,a as fo,b as uo,e as Ce,i as rt,j as po,l as xe,m as ho,n as st,o as oe,p as mo,q as U,s as W,t as Pe,u as xo,v as le,w as vo,x as it}from"./chunk-CBEJLKG4.js";import{a as F,b as ft,c as J,d as M,e as H,f as ve}from"./chunk-U3AZOSC6.js";import{a as zt,b as Ao,c as fe,e as u,f as P,g as zo,h as T,i as k,j as Lo}from"./chunk-BB35V6BP.js";var ut=class extends ce{constructor(){super();let t=new lt;t.deleteAttribute("uv");let o=new ne({side:fo}),a=new ne,n=new Ro(16777215,900,28,2);n.position.set(.418,16.199,.3),this.add(n);let r=new S(t,o);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let c=new go(t,a,6),i=new vo;i.position.set(-10.906,2.009,1.846),i.rotation.set(0,-.195,0),i.scale.set(2.328,7.905,4.651),i.updateMatrix(),c.setMatrixAt(0,i.matrix),i.position.set(-5.607,-.754,-.758),i.rotation.set(0,.994,0),i.scale.set(1.97,1.534,3.955),i.updateMatrix(),c.setMatrixAt(1,i.matrix),i.position.set(6.167,.857,7.803),i.rotation.set(0,.561,0),i.scale.set(3.927,6.285,3.687),i.updateMatrix(),c.setMatrixAt(2,i.matrix),i.position.set(-2.017,.018,6.124),i.rotation.set(0,.333,0),i.scale.set(2.002,4.566,2.064),i.updateMatrix(),c.setMatrixAt(3,i.matrix),i.position.set(2.291,-.756,-2.621),i.rotation.set(0,-.286,0),i.scale.set(1.546,1.552,1.496),i.updateMatrix(),c.setMatrixAt(4,i.matrix),i.position.set(-2.193,-.369,-5.547),i.rotation.set(0,.516,0),i.scale.set(3.875,3.487,2.986),i.updateMatrix(),c.setMatrixAt(5,i.matrix),this.add(c);let l=new S(t,Fe(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);let f=new S(t,Fe(50));f.position.set(-16.109,18.021,-8.207),f.scale.set(.1,2.425,2.751),this.add(f);let p=new S(t,Fe(17));p.position.set(14.904,12.198,-1.832),p.scale.set(.15,4.265,6.331),this.add(p);let d=new S(t,Fe(43));d.position.set(-.462,8.89,14.52),d.scale.set(4.38,5.441,.088),this.add(d);let m=new S(t,Fe(20));m.position.set(3.235,11.486,-12.541),m.scale.set(2.5,2,.1),this.add(m);let v=new S(t,Fe(100));v.position.set(0,20,0),v.scale.set(1,.1,1),this.add(v)}dispose(){let t=new Set;this.traverse(o=>{o.isMesh&&(t.add(o.geometry),t.add(o.material))});for(let o of t)o.dispose()}};function Fe(e){return new Mo({color:0,emissive:16777215,emissiveIntensity:e})}var Oa=u.hoverLift.toFixed(2),ee=u.cols,Co=(u.pitch/2).toFixed(2),Ua={key:{rect:[1148.801,12.997,8768.289,3472.806],z:994.831,power:2.322},fill:{rect:[-2516.226,-9815.124,2516.226,10070.146],z:573.364,power:1.474},shelfAlbedo:1.219,shelfAmbient:.383,contact:{strength:.332,reach:19.033},keyMix:.571,base:{centre:.614,edge:.752,cy:-293.494,rx:806.633,ry:309.574,pow:.304},edgeShade:{strength:.989,reach:5.54},liftShade:{strength:.5,reach:8},halo:{right:.4,left:.383,top:.056,rise:.308,fall:60.395,row2:.724,vfall:10,drop:.881,dropReach:31.417},glow:{strength:.2,fall:100,side:60,fade:24.653,width:1100}},Ie=4*ee;function Po(){return{uLightRect:{value:[new W,new W]},uLightZ:{value:[0,0]},uLightPower:{value:[0,0]},uShelf:{value:[new W,new W]},uShelfDepth:{value:0},uSlab:{value:Array.from({length:Ie},()=>new W(0,0,0,0))},uSlabZ:{value:new Array(Ie).fill(1)},uSlabA:{value:new Array(Ie).fill(0)},uFoot:{value:Array.from({length:2*ee},()=>new W(0,0,0,1e3))},uShelfAlbedo:{value:1},uShelfAmbient:{value:0},uContact:{value:new oe},uHalo:{value:new U},uHaloShape:{value:new W},uHaloDrop:{value:new oe},uGlow:{value:new W},uGlowWidth:{value:1e4},uEdgeShade:{value:new W},uKeyMix:{value:.5},uBase:{value:new U},uBaseShape:{value:new U}}}function Fo(e,t=Ua){[t.key,t.fill].forEach((o,a)=>{e.uLightRect.value[a].set(...o.rect),e.uLightZ.value[a]=o.z,e.uLightPower.value[a]=o.power}),e.uShelfAlbedo.value=t.shelfAlbedo,e.uShelfAmbient.value=t.shelfAmbient,e.uContact.value.set(t.contact.strength,t.contact.reach),e.uHalo.value.set(t.halo.right,t.halo.left,t.halo.top),e.uHaloShape.value.set(t.halo.rise,t.halo.fall,t.halo.row2,t.halo.vfall),e.uHaloDrop.value.set(t.halo.drop,t.halo.dropReach),e.uGlow.value.set(t.glow.strength,t.glow.fall,t.glow.side,t.glow.fade),e.uGlowWidth.value=t.glow.width,e.uEdgeShade.value.set(t.edgeShade.strength,t.edgeShade.reach,t.liftShade.strength,t.liftShade.reach),e.uKeyMix.value=t.keyMix,e.uBase.value.set(t.base.centre,t.base.edge,t.base.cy),e.uBaseShape.value.set(t.base.rx,t.base.ry,t.base.pow)}var dt=`
#define PI 3.141592653589793
uniform vec4 uLightRect[2];
uniform float uLightZ[2];
uniform float uLightPower[2];
uniform vec4 uShelf[2];      // x0, x1, y bottom, y top
uniform float uShelfDepth;
uniform vec4 uSlab[${Ie}];  // x0, y0, x1, y1 of a slab parallel to the wall
uniform float uSlabZ[${Ie}];
uniform float uSlabA[${Ie}];  // occlusion strength: the sleeve's opacity
uniform vec4 uFoot[${2*ee}];      // per sleeve: x0, x1, bottom edge depth, height of the bottom edge above its shelf

// Form factor from a point (normal +z) to the part of a parallel rectangle with one corner straight
// above the point and the opposite corner at q, the plane at distance c. Odd in q.x and q.y.
float ffCorner(vec2 q, float c) {
  vec2 a = q / c;
  float sx = sqrt(1.0 + a.x * a.x), sy = sqrt(1.0 + a.y * a.y);
  return (a.x / sx * atan(a.y / sx) + a.y / sy * atan(a.x / sy)) / (2.0 * PI);
}
// Form factor to the rectangle r (x0, y0, x1, y1) in a parallel plane at distance c, point at p.
float ffRect(vec4 r, vec2 p, float c) {
  if (r.z <= r.x || r.w <= r.y) return 0.0;
  vec4 q = r - vec4(p, p);
  return ffCorner(q.zw, c) - ffCorner(q.xw, c) - ffCorner(q.zy, c) + ffCorner(q.xy, c);
}
vec4 clipRect(vec4 a, vec4 b) { return vec4(max(a.xy, b.xy), min(a.zw, b.zw)); }

// Fraction of soft box l that wall point p (z = 0) sees past the shelves and the sleeves of row 'row'
// (-1 for none).
float wallLight(int l, vec2 p, int row) {
  vec4 L = uLightRect[l];
  float c = uLightZ[l];
  float full = ffRect(L, p, c);
  if (full <= 0.0) return 1.0;
  float vis = 1.0;
  float d = uShelfDepth;
  for (int s = 0; s < 2; s++) {
    vec4 sh = uShelf[s];
    float occ = 0.0;
    // Behind the shelf (never seen): shade as just under it, so filtering never bleeds a dark edge.
    if (p.y >= sh.z && p.y <= sh.w && p.x >= sh.x && p.x <= sh.y) p.y = sh.z - 0.5;
    if (p.y < sh.z) {
      // Under the shelf: its underside hides the light above ym, inside a wedge that widens upward.
      float h = sh.z - p.y;
      float y0 = max(p.y + h * c / d, L.y);
      for (int k = 0; k < 2; k++) {
        float ya = mix(y0, L.w, float(k) * 0.5), yb = mix(y0, L.w, float(k + 1) * 0.5);
        if (yb <= ya) continue;
        float t = (0.5 * (ya + yb) - p.y) / h;
        occ += ffRect(clipRect(vec4(p.x + (sh.x - p.x) * t, ya, p.x + (sh.y - p.x) * t, yb), L), p, c);
      }
    } else if (p.y > sh.w) {
      // Above the shelf: its top hides the light below yM.
      float h = p.y - sh.w;
      float y1 = min(p.y - h * c / d, L.w);
      for (int k = 0; k < 2; k++) {
        float ya = mix(L.y, y1, float(k) * 0.5), yb = mix(L.y, y1, float(k + 1) * 0.5);
        if (yb <= ya) continue;
        float t = (p.y - 0.5 * (ya + yb)) / h;
        occ += ffRect(clipRect(vec4(p.x + (sh.x - p.x) * t, ya, p.x + (sh.y - p.x) * t, yb), L), p, c);
      }
    } else if (p.x < sh.x || p.x > sh.y) {
      // Beside an end of the shelf, at its height: the end face hides a band of the light that starts
      // level with the shelf's front corner and widens away from the point.
      bool left = p.x < sh.x;
      float ex = left ? sh.x : sh.y;
      float xs = p.x + (ex - p.x) * c / d;
      vec2 xr = left ? vec2(max(xs, L.x), L.z) : vec2(L.x, min(xs, L.z));
      if (xr.y > xr.x) {
        float z = c * (ex - p.x) / (0.5 * (xr.x + xr.y) - p.x);
        occ = ffRect(clipRect(vec4(xr.x, p.y + (sh.z - p.y) * c / z, xr.y, p.y + (sh.w - p.y) * c / z), L), p, c);
      }
    }
    vis *= 1.0 - clamp(occ / full, 0.0, 1.0);
  }
  if (row >= 0) {
    for (int k = 0; k < ${2*ee}; k++) {
      int i = row * ${2*ee} + k;
      vec4 r = uSlab[i];
      if (r.z <= r.x) continue;
      float m = c / uSlabZ[i];
      vec4 pr = vec4(p, p) + (r - vec4(p, p)) * m;
      vis *= 1.0 - uSlabA[i] * clamp(ffRect(clipRect(pr, L), p, c) / full, 0.0, 1.0);
    }
  }
  return vis;
}

uniform float uKeyMix;
uniform vec3 uBase;       // centre, edge, centre height
uniform vec3 uBaseShape;  // radius x, radius y, exponent
float wallBase(vec2 p) {
  float r = length(vec2(p.x / uBaseShape.x, (p.y - uBase.z) / uBaseShape.y));
  return mix(uBase.y, uBase.x, exp(-pow(r, uBaseShape.z)));
}

// Light the sleeves of row 'row' throw back onto the wall beside them: rises from the sleeve's outline,
// then falls away; strongest on the side the key light comes from, and fading beside a sleeve toward its
// top edge, where the sleeve meets the wall. Above the row, a broad glow falls away upward: each sleeve
// lights the width of its pitch, so the glow runs on unbroken over the gaps.
uniform vec3 uHalo;       // strength right, left, above
uniform vec4 uHaloShape;  // rise, fall, lower row share, fall above a sleeve
uniform vec2 uHaloDrop;   // share lost beside a sleeve level with its top edge, distance below it back in full
uniform vec4 uGlow;       // glow strength, fall upward, softness at a row's ends, fade below the top edges
uniform float uGlowWidth; // half-width of the glow's centred band
uniform vec4 uEdgeShade;  // left edge strength, reach; under a lifted sleeve strength, reach
float haloAt(vec2 p, int row) {
  if (row < 0) return 0.0;
  float e = 0.0, g = 0.0;
  for (int k = 0; k < ${ee}; k++) {
    int i = row * ${2*ee} + k * 2;
    vec4 a = uSlab[i], b = uSlab[i + 1];
    if (a.z <= a.x) continue;
    vec4 r = vec4(min(a.xy, b.xy), max(a.zw, b.zw));
    vec2 o = max(max(r.xy - p, p - r.zw), 0.0);
    float d = length(o);
    if (d <= 0.0) continue;
    float up = p.y - r.w;
    float side = (p.x > 0.5 * (r.x + r.z) ? uHalo.x : uHalo.y) * (1.0 - uHaloDrop.x * (1.0 - smoothstep(0.0, uHaloDrop.y, -up)));
    float k2 = mix(uHalo.z, side, o.x / d);
    e += uSlabA[i] * k2 * (1.0 - exp(-d / uHaloShape.x)) * exp(-d / uHaloShape.y) * exp(-o.y / uHaloShape.w);
    float cx = p.x - 0.5 * (r.x + r.z);
    float wx = smoothstep(-uGlow.z, uGlow.z, cx + ${Co}) - smoothstep(-uGlow.z, uGlow.z, cx - ${Co});
    g += uSlabA[i] * wx * exp(-max(up, 0.0) / uGlow.y) * smoothstep(-uGlow.w, 0.0, up);
  }
  float x = p.x / uGlowWidth;
  e += uGlow.x * g * exp(-x * x);
  return row == 1 ? e * uHaloShape.z : e;
}

// Narrow shadow along the left edge of each sleeve of row 'row' (the key light is to the right).
float edgeShade(vec2 p, int row) {
  if (row < 0) return 1.0;
  float f = 1.0;
  for (int k = 0; k < ${ee}; k++) {
    int i = row * ${2*ee} + k * 2;
    vec4 a = uSlab[i], b = uSlab[i + 1];
    if (a.z <= a.x) continue;
    float dx = min(a.x, b.x) - p.x;
    // It fades toward the top edge with the light beside the sleeve (uHaloDrop), where the sleeve meets the wall.
    if (dx > 0.0 && p.y >= a.y && p.y <= b.w)
      f *= 1.0 - uSlabA[i] * uEdgeShade.x * exp(-dx / uEdgeShade.y) * (1.0 - uHaloDrop.x * (1.0 - smoothstep(0.0, uHaloDrop.y, b.w - p.y)));
    // Under a lifted sleeve: a band from its bottom edge, offset a little to the left.
    float lift = clamp(uFoot[row * ${ee} + k].w / ${Oa}, 0.0, 1.0);
    float dy = a.y - p.y;
    if (lift > 0.0 && dy > 0.0 && p.x > a.x - 6.0 && p.x < a.z - 4.0)
      f *= 1.0 - lift * uEdgeShade.z * exp(-dy / uEdgeShade.w) * smoothstep(a.x - 6.0, a.x + 2.0, p.x) * (1.0 - smoothstep(a.z - 12.0, a.z - 4.0, p.x));
  }
  return f;
}

// Which row of sleeves can shade wall point p: the row standing on the shelf below it.
int rowAt(float y) {
  if (y > uShelf[0].z) return 0;
  if (y > uShelf[1].z) return 1;
  return -1;
}

// Irradiance at a shelf point (any normal) from soft box l: 6x6 samples over the box.
float boxLight(int l, vec3 p, vec3 n) {
  vec4 L = uLightRect[l];
  vec2 cell = (L.zw - L.xy) / 6.0;
  float sum = 0.0;
  for (int j = 0; j < 6; j++) for (int i = 0; i < 6; i++) {
    vec3 q = vec3(L.xy + cell * (vec2(i, j) + 0.5), uLightZ[l]);
    vec3 w = q - p;
    float r2 = dot(w, w);
    vec3 wn = w * inversesqrt(r2);
    sum += max(dot(n, wn), 0.0) * max(wn.z, 0.0) / (PI * r2);
  }
  return sum * cell.x * cell.y;
}
`;var Wa=`
out vec2 vWorld;
uniform vec4 uRegion; // world x0, y0, x1, y1 covered by the texture
void main() {
  vWorld = mix(uRegion.xy, uRegion.zw, uv);
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`,qa=`
precision highp float;
in vec2 vWorld;
out vec4 outColor;
${dt}
void main() {
  int row = rowAt(vWorld.y);
  float seen = mix(wallLight(1, vWorld, row), wallLight(0, vWorld, row), uKeyMix);
  float e = wallBase(vWorld) * seen * edgeShade(vWorld, row) + haloAt(vWorld, row);
  outColor = vec4(vec3(e), 1.0);
}`,Na=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,Ya=`
uniform sampler2D uBake;
uniform float uGain;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(uBake, vUv).rgb * uGain;
  gl_FragColor = vec4(c, 1.0);
  #include <colorspace_fragment>
  float n = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  gl_FragColor.rgb += (n - 0.5) / 255.0;
}`;function Io(e,t){let o=new Pe(4,4,{type:rt,format:po,depthBuffer:!1,minFilter:Ce,magFilter:Ce,generateMipmaps:!1}),a=new Q({glslVersion:ho,uniforms:{...t,uRegion:{value:new W}},vertexShader:Wa,fragmentShader:qa,depthTest:!1,depthWrite:!1}),n=new ce;n.add(new S(new ae(2,2),a));let r=new ct,c=new Q({uniforms:{uBake:{value:o.texture},uGain:{value:1}},vertexShader:Na,fragmentShader:Ya,toneMapped:!1}),i=new S(new ae(1,1),c);return i.renderOrder=-1,{mesh:i,resize(l,f,p,d,m,v,L=null){o.setSize(m,v),a.uniforms.uRegion.value.set(...L||[l,f,p,d]),i.scale.set(p-l,d-f,1),i.position.set((l+p)/2,(f+d)/2,0),i.updateMatrixWorld()},setGain(l){c.uniforms.uGain.value=l},bake(){let l=e.getRenderTarget();e.setRenderTarget(o),e.render(n,r),e.setRenderTarget(l)},dispose(){o.dispose(),a.dispose(),c.dispose(),i.geometry.dispose()}}}function ja(){let{width:e,depth:t,thick:o,bevel:a}=P,n=new bo;n.moveTo(0,-o),n.lineTo(t-a,-o),n.absarc(t-a,-o+a,a,-Math.PI/2,0,!1),n.lineTo(t,-a),n.absarc(t-a,-a,a,0,Math.PI/2,!1),n.lineTo(0,0),n.closePath();let r=new So(n,{depth:e,bevelEnabled:!1,curveSegments:6});return r.applyMatrix4(new le().set(0,0,-1,e/2,0,1,0,0,1,0,0,0,0,0,0,1)),r.computeVertexNormals(),r}var Ka=`
varying vec3 vPos;
varying vec3 vNormal;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vPos = w.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Za=`
${dt}
uniform float uShelfAlbedo;
uniform float uShelfAmbient;
uniform vec2 uContact;   // strength, reach
uniform int uRow;
varying vec3 vPos;
varying vec3 vNormal;
void main() {
  vec3 n = normalize(vNormal);
  // The rounded front edges are shaded as the front face: lit at their own normals they face the soft boxes
  // more squarely than either face and read as bright lines, which the reference does not show.
  vec3 nl = n.z > 0.02 && abs(n.y) > 0.02 && abs(n.y) < 0.98 ? vec3(0.0, 0.0, 1.0) : n;
  float e = uLightPower[0] * boxLight(0, vPos, nl) + uLightPower[1] * boxLight(1, vPos, nl);
  // Ambient from the room: full on the front, less on the top, least underneath.
  e += uShelfAmbient * (0.75 + 0.25 * nl.z - 0.35 * max(-nl.y, 0.0));
  if (n.y > 0.5) {
    // Contact shadow in front of each sleeve standing on this shelf.
    float shade = 0.0;
    for (int k = 0; k < ${u.cols}; k++) {
      vec4 f = uFoot[uRow * ${u.cols} + k];   // x0, x1, bottom edge depth, height above the shelf
      float inX = smoothstep(f.x - 4.0, f.x + 8.0, vPos.x) * (1.0 - smoothstep(f.y - 8.0, f.y + 4.0, vPos.x));
      float dz = vPos.z - f.z;
      shade = max(shade, inX * step(-1.0, dz) * exp(-max(dz, 0.0) / uContact.y) * exp(-f.w / 6.0));
    }
    e *= 1.0 - uContact.x * shade;
  }
  gl_FragColor = vec4(vec3(e * uShelfAlbedo), 1.0);
  #include <colorspace_fragment>
  float nz = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  gl_FragColor.rgb += (nz - 0.5) / 255.0;
}`;function Bo(e){let t=ja();return P.tops.map((o,a)=>{let n=new Q({uniforms:{...e,uRow:{value:a}},vertexShader:Ka,fragmentShader:Za,toneMapped:!1}),r=new S(t,n);return r.position.set(0,o,0),r.updateMatrixWorld(),r})}var _o=`
vec3 njNeutral(vec3 c) {
  const float start = 0.76, desat = 0.15;
  float x = min(c.r, min(c.g, c.b));
  c -= x < 0.08 ? x - 6.25 * x * x : 0.04;
  float peak = max(c.r, max(c.g, c.b));
  if (peak < start) return c;
  float d = 1.0 - start, np = 1.0 - d * d / (peak + d - start);
  c *= np / peak;
  return mix(c, vec3(np), 1.0 - 1.0 / (desat * (peak - np) + 1.0));
}`;var q=u.size,pt=q*Math.sin(u.lean),Uo={dx:0,yaw:0,opacity:1},V=()=>({...Uo,lift:0,z:pt,lean:u.lean}),Be=()=>({...Uo,lift:u.hoverLift,z:u.hoverZ,lean:0}),Lt=["lift","z","lean","dx","yaw"],Xa="#d9d6d0";function We(e,t=null){return e.onBeforeCompile=o=>{o.fragmentShader=o.fragmentShader.replace("void main() {",`${_o}
${t?`uniform float uMapBias;
`:""}void main() {`).replace("#include <tonemapping_fragment>","gl_FragColor.rgb = njNeutral(gl_FragColor.rgb);"),t&&(o.uniforms.uMapBias=t,o.fragmentShader=o.fragmentShader.replace("#include <map_fragment>",To.map_fragment.replace("texture2D( map, vMapUv )","texture2D( map, vMapUv, uMapBias )")))},e.customProgramCacheKey=()=>t?"nj-neutral-bias":"nj-neutral",e}var qe={value:0};function Wo(e){let t=new lt(q,q,u.thick);return t.translate(0,q/2,u.thick/2),e.map((o,a)=>{let n=We(new ne({color:15855594,roughness:.8})),r=a%u.cols,c=Math.floor(a/u.cols),i=Math.min(u.cols,e.length-c*u.cols),l=We(new ne({color:new it(o.accent?.light||Xa),roughness:.8}),qe),f=We(new ne({color:15328992,roughness:.7})),p=[n,n,n,n,l,f],d=new S(t,p);d.matrixAutoUpdate=!1;let m={i:a,row:c,col:r,mesh:d,front:l,back:f,mats:p,entry:o,x:(r-(i-1)/2)*u.pitch,shelfY:P.tops[c],pose:{...V(),opacity:0}};return ue(m),m})}var Go=new mo,Qa=new U(1,0,0),Do=new U,Ja=new U(1,1,1),we=new U,$o=new le,Vo=new le,Oo=new le;function ue(e){let t=e.pose;Do.set(e.x+t.dx,e.shelfY+t.lift,t.z),Go.setFromAxisAngle(Qa,-t.lean),e.mesh.matrix.compose(Do,Go,Ja),t.yaw&&(we.set(0,q/2,u.thick/2).applyMatrix4(e.mesh.matrix),Vo.makeTranslation(we.x,we.y,we.z),Oo.makeTranslation(-we.x,-we.y,-we.z),$o.makeRotationY(t.yaw),e.mesh.matrix.premultiply(Oo).premultiply($o).premultiply(Vo)),e.mesh.matrixWorld.copy(e.mesh.matrix),e.mesh.visible=t.opacity>.001;let o=t.opacity<.999;for(let a of[e.front,e.back,e.mats[0]])a.transparent!==o&&(a.transparent=o,a.needsUpdate=!0),a.opacity=t.opacity}function qo(e,t,o=!1){for(let a of e){let n=a.pose,r=Math.cos(n.lean),c=Math.sin(n.lean),i=a.shelfY+n.lift,l=u.thick/2,f=a.x+n.dx,p=st.smoothstep(n.z,110,260),d=a.mesh.visible&&!o?n.opacity*(1-p):0,m=(a.row*u.cols+a.col)*2;for(let v=0;v<2;v++){let L=v/2,ze=(v+1)/2;d>0?t.uSlab.value[m+v].set(f-q/2,i+q*L*r,f+q/2,i+q*ze*r):t.uSlab.value[m+v].set(0,0,0,0),t.uSlabZ.value[m+v]=Math.max(1.5,n.z-q*(L+ze)/2*c+l),t.uSlabA.value[m+v]=d}t.uFoot.value[a.i].set(f-q/2,f+q/2,n.z+u.thick,d>0?n.lift:1e3)}}function Ct(e,t,o){t&&(e.front.map=t,e.front.color.set(16777215),e.front.needsUpdate=!0),o&&(e.back.map=o,e.back.color.set(16777215),e.back.needsUpdate=!0)}var No=15,ht=e=>e*e,mt=(e,t,o)=>{let a={...t};for(let n of Lt)a[n]=e[n]+(t[n]-e[n])*o;return a.opacity=e.opacity+(t.opacity-e.opacity)*o,a};function Yo(e){let t=k.appear.at+k.appear.stagger*e,o=k.drop.at+k.drop.stagger*e,a=o+k.drop.dur,n=a+k.lean.delay;return{appear:t,drop:o,land:a,lean:n,rest:n+k.lean.dur}}var Pt=e=>J()?200+40*e:Yo(e).appear;function jo(e,t){if(J()){let i=Pt(e);return t>=i+160?null:{...V(),opacity:F((t-i)/160)}}let o=Yo(e);if(t>=o.rest)return null;if(t<o.appear)return{...V(),opacity:0};let a=k.appearPose,n=1-.345*Math.exp(-(t-o.appear)/150),r={...V(),lift:a.lift,z:a.z,lean:0,opacity:n};if(t<o.drop)return r;if(t<o.land){let i=ht(F((t-o.drop)/k.drop.dur));return{...r,lift:a.lift*(1-i),z:a.z+(pt-a.z)*i}}let c=ht(F((t-o.lean)/k.lean.dur));return{...r,lift:0,z:pt,lean:u.lean*c}}function Ko(e,t){let o=Be(),a=1-Math.exp(-t/(J()?.04:u.hoverTau)),n=!1;for(let r of Lt){let c=o[r]-e.pose[r];Math.abs(c)>.001?(e.pose[r]+=c*a,n=!0):e.pose[r]=o[r]}return e.pose.opacity=1,n}function Zo(e,t){let o=J()?{delay:0,drop:90,pause:0,lean:60}:zo,a=V();if(t<o.delay)return{...e};let n=t-o.delay,r={...a,lean:Math.min(e.lean,a.lean)};if(n<o.drop)return mt(e,r,ht(n/o.drop));let c=n-o.drop-o.pause;return c<0?r:c<o.lean?mt(r,a,ht(c/o.lean)):null}var Xo=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,en=`
uniform sampler2D uTex;
uniform vec2 uDir;      // one texel along the blur direction
uniform float uSigma;
varying vec2 vUv;
void main() {
  if (uSigma < 0.05) { gl_FragColor = texture2D(uTex, vUv); return; }
  float stride = max(1.0, uSigma / 2.0);
  vec3 sum = vec3(0.0); float wsum = 0.0;
  for (int i = -6; i <= 6; i++) {
    float p = float(i) * stride;
    float w = exp(-0.5 * p * p / (uSigma * uSigma));
    sum += texture2D(uTex, vUv + uDir * p).rgb * w;
    wsum += w;
  }
  gl_FragColor = vec4(sum / wsum, 1.0);
}`,tn=`
uniform sampler2D uSharp;
uniform sampler2D uBlur;
uniform float uMix;
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(mix(texture2D(uSharp, vUv).rgb, texture2D(uBlur, vUv).rgb, uMix), 1.0);
  #include <colorspace_fragment>
}`;function Qo(e){let t=new Pe(4,4,{samples:4,colorSpace:xe}),o={type:rt,depthBuffer:!1,minFilter:Ce,magFilter:Ce},a=new Pe(4,4,o),n=new Pe(4,4,o),r=new Q({uniforms:{uTex:{value:null},uDir:{value:new oe},uSigma:{value:0}},vertexShader:Xo,fragmentShader:en,depthTest:!1,depthWrite:!1}),c=new Q({uniforms:{uSharp:{value:t.texture},uBlur:{value:a.texture},uMix:{value:0}},vertexShader:Xo,fragmentShader:tn,depthTest:!1,depthWrite:!1}),i=new S(new ae(2,2),r);i.frustumCulled=!1;let l=new ce;l.add(i);let f=new ct,p=.5,d=(m,v)=>{i.material=m,e.setRenderTarget(v),e.render(l,f)};return{resize(m,v){t.setSize(m,v),a.setSize(Math.ceil(m/2),Math.ceil(v/2)),n.setSize(Math.ceil(m/2),Math.ceil(v/2)),p=e.getPixelRatio()/2},background(m,v,L){let ze=e.getRenderTarget();e.setRenderTarget(t),e.clear(),e.render(m,v);let Ue=L*p;r.uniforms.uSigma.value=Ue,r.uniforms.uTex.value=t.texture,r.uniforms.uDir.value.set(1/a.width,0),d(r,n),r.uniforms.uTex.value=n.texture,r.uniforms.uDir.value.set(0,1/a.height),d(r,a),e.setRenderTarget(ze)},composite(m){c.uniforms.uMix.value=m,d(c,null)},dispose(){t.dispose(),a.dispose(),n.dispose(),r.dispose(),c.dispose()}}}var It=u.size,Jo=.255*It,Ft={x:.3245*It,y:.8255*It,z:u.thick+.25};function on(e){let o=document.createElement("canvas");o.width=o.height=512;let a=o.getContext("2d"),n=512/2,r=512*.44,c=11;a.beginPath();for(let d=0;d<=720;d++){let m=d/720*Math.PI*2,v=r*(1+.065*Math.cos(c*m));a.lineTo(n+v*Math.cos(m),n+v*Math.sin(m))}a.closePath(),a.save(),a.clip();let i=a.createConicGradient?a.createConicGradient(.6,n,n):a.createLinearGradient(0,0,512,512);["#ffa6e6","#9af2dc","#c4b2ff","#ffe596","#9fd6ff","#ffb8dc","#ffa6e6"].forEach((d,m,v)=>i.addColorStop(m/(v.length-1),d)),a.fillStyle=i,a.fillRect(0,0,512,512),[[.3,.3,"#9af2dc"],[.7,.62,"#ffa6e6"],[.42,.72,"#ffe596"],[.68,.28,"#c4b2ff"],[.25,.58,"#ffb8dc"]].forEach(([d,m,v])=>{let L=a.createRadialGradient(d*512,m*512,0,d*512,m*512,102.4);L.addColorStop(0,v+"cc"),L.addColorStop(1,v+"00"),a.fillStyle=L,a.fillRect(0,0,512,512)});let l=a.createRadialGradient(n*.8,n*.7,0,n*.8,n*.7,512*.55);l.addColorStop(0,"rgba(255,255,255,0.75)"),l.addColorStop(1,"rgba(255,255,255,0)"),a.fillStyle=l,a.fillRect(0,0,512,512),a.restore(),a.translate(n,n),a.rotate(12*Math.PI/180),a.fillStyle="#000",a.textAlign="center",a.textBaseline="alphabetic",a.font=`800 ${512*.15}px 'NJ Text', system-ui, sans-serif`;let f=512*.15;e.forEach((d,m)=>a.fillText(d,0,(m-(e.length-1)/2)*f+512*.055));let p=new Eo(o);return p.colorSpace=xe,p.anisotropy=4,p}var ea=new it().setRGB(1,.96,1);function ta(e){let t=on(e.toUpperCase().split(" ")),o=We(new ne({map:t,emissiveMap:t,color:ea,emissive:ea,emissiveIntensity:.5,transparent:!0,roughness:.8,metalness:0,depthWrite:!1}),qe),a=new S(new ae(Jo,Jo),o);a.matrixAutoUpdate=!1,a.visible=!1,a.renderOrder=1;let n=new le().makeTranslation(Ft.x,Ft.y,Ft.z);return{mesh:a,place(r,c){a.visible=c>.002&&r.mesh.visible,a.visible&&(o.opacity=c,a.matrix.multiplyMatrices(r.mesh.matrix,n),a.matrixWorld.copy(a.matrix))}}}var w={width:.682,bottom:.797,lean:56*Math.PI/180,strip:.124,top:132,flatLean:78*Math.PI/180,flatStrip:.07,flatMax:4,drag:150,carry:.06,omega:8.5,details:{size:.815,centreY:.404},wheelNotch:60,groundGain:.838,edgeColour:1842204,shadow:{y0:.403,y1:.794,alpha:.054,feather:20}};function oa(){let e=new Q({uniforms:{uSize:{value:new oe(1,1)},uFeather:{value:1},uAlpha:{value:w.shadow.alpha}},vertexShader:"varying vec2 vP; uniform vec2 uSize; void main() { vP = uv * uSize; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`varying vec2 vP; uniform vec2 uSize; uniform float uFeather, uAlpha;
      void main() { float d = min(vP.y, uSize.y - vP.y);   // soft top and bottom; it runs off the left edge and under the crate
        gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha * smoothstep(0.0, uFeather, d)); }`,transparent:!0,depthWrite:!1,toneMapped:!1}),t=new S(new ae(1,1),e);return t.renderOrder=-.5,t.visible=!1,{mesh:t,setOpacity(o){e.uniforms.uAlpha.value=w.shadow.alpha*o},layout(o,a,n){let r=-o/2/n-2,c=0,i=(a/2-w.shadow.y1*a)/n,l=(a/2-w.shadow.y0*a)/n;t.scale.set(c-r,l-i,1),t.position.set((r+c)/2,(i+l)/2,.5),t.updateMatrixWorld(),e.uniforms.uSize.value.set(c-r,l-i),e.uniforms.uFeather.value=w.shadow.feather/n}}}function aa(e){let t=u.size,o=0,a=0,n=0,r=null,c=0,i=!1,l=0,f=0,p=0,d=0,m=0,v=1,L=g=>Math.max(0,Math.min(e-1,g));function ze(g,E,b){let D=w.width*g/t;l=(E/2-w.bottom*E)/D;let Le=w.bottom*E-t*D*Math.cos(w.lean);return f=Math.min(w.strip*t,e>1?Math.max(0,Le-w.top)/(e-1)/D:0),p=f*Math.tan(w.lean)+4,d=w.flatStrip*t,m=(e-1)*p+t*Math.sin(w.lean)+10,v=D*(b-m)/b,v}let Ue=g=>d*w.flatMax*(1-Math.exp(-g/w.flatMax));function Da(g){let E=g.i-o,b=V();if(b.dx=-g.x,E>=0)b.lean=w.lean,b.lift=l+E*f-g.shelfY,b.z=m-E*p;else{let D=-E,Le=Math.min(1,D);b.lean=w.lean+(w.flatLean-w.lean)*Le,b.lift=l-Ue(D)-g.shelfY,b.z=m+.8*t*Le+5*Math.max(0,Ue(D)-Ue(1))}return b}function $a(g){if(r)return!0;let E=i?30:w.omega,b=E*E*(n-o)-2*E*a;return a+=b*g,o+=a*g,Math.abs(n-o)<.001&&Math.abs(a)<.01?(o=n,a=0,!1):!0}return{layout:ze,pose:Da,step:$a,get p(){return o},get current(){return L(Math.round(r?o:n))},get dragging(){return!!r},setReduced(g){i=!!g},go(g){n=L(g)},jump(g){n=o=L(g),a=0},begin(g,E){r={y0:g,p0:o,samples:[[E,g]]},a=0},move(g,E){if(!r)return;let b=r.p0+(g-r.y0)/w.drag;for(b<0?b/=3:b>e-1&&(b=e-1+(b-e+1)/3),o=b,r.samples.push([E,g]);r.samples.length>2&&E-r.samples[0][0]>100;)r.samples.shift()},end(g){if(!r)return 0;let E=r.samples,b=E[0],D=E[E.length-1],Le=Math.abs(D[1]-r.y0),Va=D[0]-b[0]>8&&g-D[0]<80?(D[1]-b[1])/(D[0]-b[0])*1e3:0;return r=null,a=Math.max(-12,Math.min(12,Va/w.drag)),n=L(Math.round(o+(i?0:a*w.carry))),i&&(a=0),Le},cancel(){r&&(r=null,n=L(Math.round(o)))},wheel(g){for(c+=g;Math.abs(c)>=w.wheelNotch;){let E=Math.sign(c);n=L(n+E),c-=E*w.wheelNotch}}}}var _=Ao,K=document.getElementById("c"),z=new Ho({canvas:K,antialias:!0,powerPreference:"high-performance"});z.outputColorSpace=xe;z.toneMapping=uo;var O=new ce,Sa=new ko(z);O.environment=Sa.fromScene(new ut,.04).texture;O.environmentIntensity=.46;Sa.dispose();var he=Po();Fo(he);P.tops.forEach((e,t)=>he.uShelf.value[t].set(-P.width/2,P.width/2,e-P.thick,e));he.uShelfDepth.value=P.depth;var gt=Io(z,he);O.add(gt.mesh);var Ma=Bo(he);for(let e of Ma)O.add(e);var x=Wo(_);qe.value=window.__editionsTest?.coverBias??-.5;var Me=new wo(new Uint8Array([255,255,255,255]),1,1);Me.colorSpace=xe;Me.needsUpdate=!0;for(let e of x)e.front.map=Me,e.back.map=Me,O.add(e.mesh);var Et=1,xt=x.find(e=>e.entry.newest)||null,Ra=!1,Ke=ta("Now playing");O.add(Ke.mesh);var Ze=Qo(z),G=2556,R=new yo(20,1,100,G*2);R.position.set(0,0,G);var y=aa(x.length),bt=oa();O.add(bt.mesh);var me=x.map(()=>null),Ta=x.map(()=>null),Vt=x.map(()=>null),nn=1,ka=null,Ha=new Promise(e=>requestAnimationFrame(()=>requestAnimationFrame(e))).then(()=>import("./covers-V2BS4OL4.js")).then(e=>ka=e),rn=(e,t,o)=>Ha.then(a=>a.createCover(z,e.entry,t,o)),na=()=>St===null?0:performance.now()-St,ra=window.__editionsTest?.coverLate||{},sn=0;function Aa(){let e=sn++;if(e>=x.length)return Promise.resolve();let t=x[e],o=()=>{Vt[e]=na(),Ta[e]=St===null?null:Math.round(Vt[e]),A()};return rn(t,e,{size:1024,backSize:0}).then(a=>{let n=()=>{me[e]=a,Ct(t,a.front,null),o()};ra[e]==null?n():setTimeout(n,Math.max(0,Ut(e)+ra[e]-na()))},a=>{console.warn(`cover ${t.entry.name}: flat sleeve (${a?.message||a})`),o()}).then(Aa)}var ln=Ha.then(()=>Promise.all(Array.from({length:nn},Aa)));function cn(e){let t=x[e],o=me[e]?.detailBack(1024).then(a=>{s&&s.i===e&&(t.back.map=a||Me,t.back.color.set(a?16777215:za),t.back.needsUpdate=!0,A())}).catch(a=>console.warn(`cover ${t.entry.name}: no Details back (${a?.message||a})`));Promise.resolve(o).then(()=>{s&&s.i===e&&s.backIn===null&&(s.backIn=performance.now())})}var Ot=!1,vt=null;function fn(){if(Ot||!me[0]||ie.some(t=>!t))return;Ot=!0;let e=window.requestIdleCallback||(t=>setTimeout(t,200));e(()=>{s||me[0].detailBack(1024).catch(()=>{}),e(()=>so().then(t=>t.warm()).then(t=>{t&&(vt=t,A())}).catch(t=>console.warn(`world warm-up: ${t?.message||t}`)),{timeout:3e3})},{timeout:2e3})}var za=15328992,sa=600,de=x.map(()=>null),ia=x.map(()=>0),Ut=e=>h?H(k.appear.at+k.appear.stagger*e):Pt(e);function un(e,t){if(de[e]===null){if(e>0&&de[e-1]===null)return null;let o=Ut(e),a=e>0?Math.max(o,de[e-1]+o-Ut(e-1)):o,n=Vt[e]??(t>=o+sa?o+sa:null);if(n===null||t<Math.max(a,n))return null;de[e]=Math.max(a,n),ia[e]=de[e]-o,me[e]||dn(x[e])}return ia[e]}function dn(e){let t=ka?.coverGround?.(e.entry,e.i)||e.entry.accent?.light;t&&e.front.color.set(t)}function pn(e){e.back.map!==Me&&(e.back.map=Me,e.back.color.set(za),e.back.needsUpdate=!0)}var Ye=-1,La=0;function hn(e){e!==Ye&&(Ye>=0&&(me[Ye]?.setAlive(!1),La=performance.now()+1700),Ye=e,e>=0&&me[e]?.setAlive(!0))}var te=null,Bt=null,Wt=document.querySelector(".sound");function jt(){let e=!!te?.enabled;Wt.setAttribute("aria-pressed",String(e)),Wt.setAttribute("aria-label",e?"Sound on":"Sound off")}function Kt(){return Bt||(Bt=import("./audio-RSGSU6J4.js").then(e=>(te=e.createAudio(),te.setRoomTone(!0),jt(),te))),Bt}var X=(e,t)=>{window.__editions?.soundLog?.push([e,Math.round(performance.now())]),te?.play(e,t)},Re=e=>Math.max(-1,Math.min(1,x[e].x/600));for(let e of["pointermove","pointerdown","keydown","touchstart"])window.addEventListener(e,Kt,{once:!0,capture:!0,passive:!0});var Ca=()=>{te?te.unlock():Kt().then(e=>e.unlock())};window.addEventListener("pointerdown",Ca,{once:!0,capture:!0});window.addEventListener("keydown",Ca,{once:!0,capture:!0});Wt.addEventListener("click",async()=>{let e=te||await Kt();e.setEnabled(!e.enabled),jt()});jt();var ot=document.getElementById("slots"),De=x.map(e=>{let t=_[e.i],o=document.createElement("li");o.className="slot";let a=document.createElement("article");a.setAttribute("aria-labelledby",`sl-${e.i}`);let n=document.createElement("h2");if(n.className="sr",n.id=`sl-${e.i}`,n.textContent=t.name,a.appendChild(n),t.tag){let i=document.createElement("p");i.className="sr",i.textContent=t.year?`${t.tag}, ${t.year}`:t.tag,a.appendChild(i)}let r=document.createElement("a");r.dataset.action="open",r.textContent="Open",Zt(r,e.i);let c=document.createElement("button");return c.type="button",c.dataset.action="details",c.dataset.index=String(e.i),c.textContent="Details",c.setAttribute("aria-label",`Details: ${t.name}`),a.append(r,c),o.appendChild(a),ot.appendChild(o),o});function Zt(e,t){let o=_[t];e.dataset.index=String(t),e.href=o.url||`#${fe(o)}`,o.url?(e.target="_blank",e.rel="noopener"):(e.removeAttribute("target"),e.removeAttribute("rel")),e.setAttribute("aria-label",o.url?`Open: ${o.name} site, new tab`:`Open: ${o.name}`)}var at=document.getElementById("crate-bar"),mn=at.querySelector(".cb-year"),xn=at.querySelector(".cb-name"),la=at.querySelector(".cb-details"),vn=at.querySelector(".cb-open"),_t=document.querySelector(".crate-rail span"),ca=document.getElementById("announce");function nt(e){ca.textContent="",requestAnimationFrame(()=>{ca.textContent=e})}document.getElementById("index").append(..._.map(e=>{let t=document.createElement("li"),o=document.createElement("span");o.className="y",o.textContent=e.year||"";let a=document.createElement("span");return a.className="n",a.textContent=e.name,t.append(o,a),t}));var Ht=document.querySelector(".tagline"),$e=document.getElementById("details"),Xe=$e.querySelector(".d-title"),Qe=$e.querySelector(".d-tag"),pe=document.getElementById("d-open"),se=document.getElementById("d-video"),B=se.querySelector("video");function Se(e,t,o,a){let n=+getComputedStyle(e).opacity;for(let r of e.getAnimations())r.cancel();e.animate([{opacity:n},{opacity:t}],{duration:M(a),delay:H(o),easing:"ease",fill:"both"})}var C=0,I=0,Z=1,h=!1,je=0,qt=0,Nt=0,Pa=0,_e=0,yn=14,Gt=new oe;function Xt(){C=window.innerWidth,I=window.innerHeight;let e=h;h=C<600,G=h?2556*4:2556,Z=h?y.layout(C,I,G):zt(C,I),R.position.z=G,R.far=G*2;let t=C/2/Z,o=I/2/Z;if(R.fov=st.radToDeg(2*Math.atan(o/G)),R.aspect=C/I,R.clearViewOffset(),R.updateMatrixWorld(),_e=0,!h){let l=V(),f=u.size,p=Te(0,P.tops[0]+f*Math.cos(l.lean),l.z-f*Math.sin(l.lean)+u.thick).y;_e=Math.max(0,Math.round(Ht.getBoundingClientRect().bottom+yn-p)),_e&&R.setViewOffset(C,I,0,-_e,C,I)}z.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),z.setSize(C,I,!1),z.getDrawingBufferSize(Gt),Ze.resize(Gt.x,Gt.y);let a=h?zt(C,I):Z,n=C/2/a*1.02,r=I/2/a*1.02,c=_e/Z;gt.resize(-t*1.02,-o*1.02+c,t*1.02,o*1.02+c,Math.ceil(C/2),Math.ceil(I/2),h?[-n,-r,n,r]:null),Ge=re=!0,je=h?w.details.size*C:T.size*Z,qt=h?w.details.centreY*I:I/2-(900/2-T.centreY)*Z,Nt=G*(1-u.size*Z/je),Pa=(I/2+_e-qt)/Z*(G-Nt)/G;let i=h||!!window.__editionsTest?.noShelves;for(let l of Ma)l.visible=!i;gt.setGain(h?w.groundGain:1),bt.mesh.visible=h,h&&bt.layout(C,I,Z);for(let l of x)l.mats[0].color.set(h?w.edgeColour:15855594);if(P.tops.forEach((l,f)=>i?he.uShelf.value[f].set(0,0,-1e5,-1e5):he.uShelf.value[f].set(-P.width/2,P.width/2,l-P.thick,l)),document.body.classList.toggle("crate",h),h!==e){s&&lo(),Ae(-1);for(let l of x)ie[l.i]&&(l.fall=null,l.pose=Yt(l),ue(l));Oe(!0)}else if(h)for(let l of x)ie[l.i]&&!(s&&s.i===l.i)&&(l.pose=Yt(l),ue(l));Fa=x.map(l=>wn(l)),h||x.forEach(eo),En(),A()}var Yt=e=>h?y.pose(e):V(),Dt=new U,ge=new xo;function Te(e,t,o){return Dt.set(e,t,o).project(R),{x:(Dt.x+1)/2*C,y:(1-Dt.y)/2*I}}function Qt(e){let t=x[e].mesh;t.geometry.boundingBox||t.geometry.computeBoundingBox(),ge.copy(t.geometry.boundingBox).applyMatrix4(t.matrixWorld);let o=1/0,a=1/0,n=-1/0,r=-1/0;for(let c of[ge.min.x,ge.max.x])for(let i of[ge.min.y,ge.max.y])for(let l of[ge.min.z,ge.max.z]){let f=Te(c,i,l);o=Math.min(o,f.x),n=Math.max(n,f.x),a=Math.min(a,f.y),r=Math.max(r,f.y)}return{x:o,y:a,width:n-o,height:r-a}}var Fa=[];function wn(e){let t=u.size,o=e.shelfY,a=Te(e.x-t/2,o+u.hoverLift+t,u.hoverZ),n=Te(e.x+t/2,o,0);return{x0:a.x,y0:a.y,x1:n.x,y1:n.y}}function Jt(e,t){let o=-1;return Fa.forEach((a,n)=>{ie[n]&&e>=a.x0&&e<=a.x1&&t>=a.y0&&t<=a.y1&&(o=n)}),o}var N=new U,Ee=e=>{let t=z.getPixelRatio();return Math.round(e*t)/t};function eo(e){N.set(-u.size/2,0,u.thick).applyMatrix4(e.mesh.matrixWorld);let t=Te(N.x,N.y,N.z);N.set(u.size/2,0,u.thick).applyMatrix4(e.mesh.matrixWorld);let a=Te(N.x,N.y,N.z).x-t.x;De[e.i].style.transform=`translate3d(${Ee(t.x+a*.1175)}px, ${Ee(t.y-a*.025-35)}px, 0)`}function gn(e){return{...V(),lean:0,dx:-e.x,lift:Pa-u.size/2-e.shelfY,z:Nt-u.thick/2}}function En(){let e=qt;Xe.style.top=`${Ee(e-54.2)}px`,Qe.style.top=`${Ee(e-13.6)}px`,pe.style.top=`${Ee(e+je/2+16)}px`;let t=C/2-je/2-80,o=t>=240?Math.min(400,t):Math.min(C-32,480);Object.assign(se.style,t>=240?{left:"calc(var(--gutter) + 20px)",top:`${Ee(e+40)}px`,width:`${o}px`,transform:""}:{left:"50%",top:`${Ee(e+je/2+(h?12:72))}px`,width:`${o}px`,transform:"translateX(-50%)"})}se.addEventListener("click",()=>{B.muted=!1,B.controls=!0,B.currentTime=0,B.play().catch(()=>{}),(B.requestFullscreen||B.webkitEnterFullscreen)?.call(B)});document.addEventListener("fullscreenchange",()=>{document.fullscreenElement!==B&&(B.muted=!0,B.controls=!1)});function bn(e,t){let o=e.video;se.hidden=!o,o&&(B.getAttribute("src")!==o.src&&(B.poster=o.poster,B.src=o.src),B.muted=!0,se.inert=!1,J()||B.play().catch(()=>{}),Se(se,1,t.open.at,t.open.dur))}function Ia(){se.inert=!0,B.pause()}var Je=0,Ne=0,Ge=!0,re=!0,St=null,Mt=null,ke=-1,$=-1,Rt=0,s=null,fa=-1,ua=!1,ie=x.map(()=>!1),j={x:-1,y:-1},Ve={};Ve.ready=new Promise(e=>{Ve.resolve=e});var pr=Ve.ready;function A(){Je||(Je=requestAnimationFrame(Rn))}function da(e,t){let o=u.size,a=u.thick;return{x:e.x+t.dx,y:e.shelfY+t.lift+o/2*Math.cos(t.lean),z:t.z-o/2*Math.sin(t.lean)+a/2}}function pa(e,t,o,a){let n=mt(t,o,a),r=u.size,c=da(e,t),i=da(e,o),l=G/(G-c.z),f=G/(G-i.z),p=l+(f-l)*a,d=(c.x*l+(i.x*f-c.x*l)*a)/p,m=(c.y*l+(i.y*f-c.y*l)*a)/p;return n.dx=d-e.x,n.lift=m-e.shelfY-r/2*Math.cos(n.lean),n.z=G*(1-1/p)+r/2*Math.sin(n.lean)-u.thick/2,n}var Sn=e=>1-(1-e)**3,ha=e=>e*e*(3-2*e),ma=Math.PI*2,Ba=.1,xa=e=>J()?e>=0?1:0:ve(T.flip.ease,F(e/M(T.flip.dur))),va=()=>H(T.fly.at)+M(T.fly.dur)*(1-Ba),_a=e=>Math.abs(Math.round(e/Math.PI))%2===1;function Mn(e,t){let o=T.fly,a=T.exit,n=T.flip,r=()=>s.flip.from+(s.flip.to-s.flip.from)*ve(n.ease,F((t-s.flip.t0-H(n.at))/M(n.dur))),c,i;if(s.exit){let l=s.exit,f=t-l.t0,p=f-l.lag,d=ve(a.ease,F((p-H(a.at))/M(a.dur)));if(c=pa(e,l.from,{...h?y.pose(e):Be(),yaw:l.yawTo},d),c.yaw=l.from.yaw+(l.yawTo-l.from.yaw)*(l.lag?xa(f):1),s.blur=l.blur*(1-ha(F((p-H(a.blurOut.at))/M(a.blurOut.dur)))),i=p<H(a.at)+M(a.dur)||s.blur>0,!i)return Ga(e,t),!0}else{s.backIn===null&&t-s.asked<T.backWait&&t-s.t0>H(o.at)&&(s.t0=t-H(o.at));let l=t-s.t0,f=ve(o.ease,F((l-H(o.at))/M(o.dur)));c=pa(e,s.from,gn(e),f),c.yaw=s.turn*xa(l-va())+r(),s.blur=h?0:ha(F((l-H(T.blur.at))/M(T.blur.dur)));let p=Math.max(va()+M(n.dur),...[o,T.blur,T.title].map(d=>H(d.at)+M(d.dur)));i=l<p||t-s.flip.t0<H(n.at)+M(n.dur)}return e.pose=c,i}var Tt=!1;K.addEventListener("webglcontextlost",e=>{e.preventDefault(),!Tt&&(Tt=!0,Je&&cancelAnimationFrame(Je),s&&lo(),ro?.close(),import("./fallback.js").then(t=>t.start(_)))});function Rn(e){if(Je=0,Tt)return;if(Y>=0){Ne=0;return}let t=Ne?Math.min(.05,(e-Ne)/1e3):0;Ne=e;let o=!1,a=Mt===null?-1:e-Mt,n=ua,r=h&&y.step(t);ua=r,r?Oe():n&&h&&(Oe(),Hn());let c=s||h?-1:ke;$!==c&&(s||e-Rt>=H(No))&&($>=0&&!(s&&s.i===$)&&(x[$].fall={from:{...x[$].pose},t0:Rt}),$=c,$>=0&&(x[$].fall=null)),hn(s?Math.cos(x[s.i].pose.yaw)>0?s.i:-1:$);let i=$!==c;for(let f of x){let p=!1;if(s&&f.i===s.i)p=Mn(f,e);else if(ie[f.i]){if(h)r&&(f.pose=y.pose(f),p=!0);else if($===f.i)p=Ko(f,t);else if(f.fall){let d=Zo(f.fall.from,e-f.fall.t0);d?f.pose=d:(f.pose=V(),f.fall=null),p=!0}}else if(a>=0){let d=un(f.i,a);if(d!==null){let m=h?kn(f,a-d):jo(f.i,a-d);m?f.pose=m:(f.pose=Yt(f),ie[f.i]=!0)}p=!0}if(p){ue(f),h||eo(f);let d=!h&&f.pose.z<270;(d||f.shaded)&&(Ge=!0),f.shaded=d,(!s||f.i!==s.i)&&(re=!0),o=!0}}Ge&&(qo(x,he,h),gt.bake(),Ge=!1,re=!0),h&&bt.setOpacity(a<0||de[0]===null?0:F((a-de[0])/M(600))),xt&&(Ke.mesh.layers.set(s&&s.i===xt.i?Et:0),Ke.place(xt,Ra?0:xt.pose.opacity));let l=Ye>=0||e<La;if(l&&!window.__editionsTest?.stillCovers)for(let f of me)f?.update(t);if(s){let f=x[s.i],p=T.blur.sigma*s.blur;(re||p!==fa)&&(R.layers.set(0),Ze.background(O,R,p),re=!1,fa=p),Ze.composite(Math.min(1,s.blur*4)),R.layers.set(Et),z.autoClear=!1,z.clearDepth(),z.render(O,R),z.autoClear=!0,R.layers.set(0)}else vt&&(vt.draw(),vt=null),z.render(O,R);wt.firstFrameAt===null&&(wt.firstFrameAt=performance.now(),Tn(wt.firstFrameAt),Ve.resolve(),o=!0),!Ot&&!o&&fn(),o||i||l||r?A():Ne=0}function ya(e){if(!CSS.supports("animation-timing-function","linear(0, 1)"))return"cubic-bezier(0.16, 1, 0.3, 1)";let t=24,o=[],a=1-Math.exp(-1/e);for(let n=0;n<=t;n++)o.push(((1-Math.exp(-(n/t)/e))/a).toFixed(4));return`linear(${o.join(", ")})`}function Tn(e){St=e,Mt=window.__editionsTest?.noSleeves?null:e,K.animate([{opacity:0},{opacity:1}],{duration:M(k.canvasFade.dur),easing:k.canvasFade.ease,fill:"forwards"});let t=k.header,o=M(t.tau*5);document.querySelectorAll(".rise").forEach((n,r)=>n.animate([{opacity:0,transform:`translateY(${-t.rise}px)`},{opacity:1,transform:"none"}],{duration:o,delay:H(t.at+t.stagger*r),easing:ya(.2),fill:"forwards"}));let a=k.late;document.querySelectorAll(".late").forEach(n=>n.animate([{opacity:0},{opacity:1}],{duration:M(a.tau*5),delay:H(a.at),easing:ya(.2),fill:"forwards"}))}function et(){let e=s?-1:ke;De.forEach((t,o)=>t.classList.toggle("hot",o===e)),K.style.cursor=s?to()?"pointer":"":ke>=0?"pointer":""}function Ae(e,t=!1){e!==ke&&(ke=e,Rt=performance.now(),et(),e>=0&&!s&&(t||X("hover",{pan:Re(e)}),X("lift",{pan:Re(e),intensity:.8})),A())}function to(){if(!s)return!1;let e=Qt(s.i);return j.x>=e.x&&j.x<=e.x+e.width&&j.y>=e.y&&j.y<=e.y+e.height}var He=-1;window.addEventListener("pointermove",e=>{if(e.pointerType==="touch"||h)return;if(j.x=e.clientX,j.y=e.clientY,s){et();return}let t=e.target.closest?.(".pm")?-1:Jt(e.clientX,e.clientY);t!==He&&(He=t,Ae(t))});document.documentElement.addEventListener("pointerleave",()=>{He=-1,Ae(-1)});window.addEventListener("blur",()=>{He=-1,Ae(-1)});window.addEventListener("resize",Xt);K.addEventListener("click",e=>{if(h)return;if(j.x=e.clientX,j.y=e.clientY,s){if(s.exit)return;to()?no():At();return}let t=Jt(e.clientX,e.clientY);t>=0&&ao(t)});function kn(e,t){let o=F((t-H(k.appear.at+k.appear.stagger*e.i))/M(360));if(o>=1)return null;let a=y.pose(e);return a.opacity=o,J()||(a.lift+=(1-Sn(o))*40/Z),a}var wa=-1,ga=0;function Oe(e=!1){if(!h)return;let t=x.length,o=y.current,a=_[o],n=_t.parentElement.clientHeight-_t.offsetHeight;_t.style.transform=`translateY(${((1-F(y.p/Math.max(1,t-1)))*n).toFixed(1)}px)`,!(o===wa&&!e)&&(wa=o,mn.textContent=a.year||"",xn.textContent=a.name,la.dataset.index=String(o),la.setAttribute("aria-label",`Details: ${a.name}`),Zt(vn,o))}function Hn(){let e=y.current;e!==ga&&(ga=e,nt(`${_[e].name}, ${e+1} of ${x.length}`))}function An(e,t){let o=Math.round(y.p),a=[];for(let n=0;n<o;n++)a.push(n);for(let n=o;n<x.length;n++)a.push(n);for(let n of a){if(!ie[n])continue;let r=Qt(n);if(e>=r.x&&e<=r.x+r.width&&t>=r.y&&t<=r.y+r.height)return n}return-1}var be=null;K.addEventListener("pointerdown",e=>{!h||Y>=0||!e.isPrimary||(be={x:e.clientX,y:e.clientY,id:e.pointerId},K.setPointerCapture(e.pointerId),s||(y.begin(e.clientY,e.timeStamp),A()))});K.addEventListener("pointermove",e=>{!be||e.pointerId!==be.id||s||(y.move(e.clientY,e.timeStamp),Oe(),A())});var oo=e=>t=>{if(!be||t.pointerId!==be.id)return;let{x:o,y:a}=be;be=null;let n=Math.hypot(t.clientX-o,t.clientY-a);if(e){y.cancel(),A();return}if(s||y.end(t.timeStamp),A(),n>=8)return;if(j.x=t.clientX,j.y=t.clientY,s){if(s.exit)return;to()?no():At();return}let r=An(t.clientX,t.clientY);r<0||(r===y.current&&Math.abs(y.p-r)<.05?ao(r):(y.go(r),X("tick")))};K.addEventListener("pointerup",oo(!1));K.addEventListener("pointercancel",oo(!0));K.addEventListener("lostpointercapture",oo(!0));var Ea=0;window.addEventListener("wheel",e=>{!h||s||Y>=0||(e.preventDefault(),e.timeStamp-Ea>200&&y.wheel(0),Ea=e.timeStamp,y.wheel(e.deltaY),A())},{passive:!1});at.querySelector(".cb-back").addEventListener("click",()=>At());function ao(e){if(s||!ie[e])return;let t=x[e],o=performance.now();t.fall=null,h&&y.go(e);let a=tt(document.activeElement)===e?document.activeElement:null,n=!h&&t.x>0?-1:1;s={i:e,t0:o,asked:o,backIn:null,from:{...t.pose},dir:n,turn:n*Math.PI,flip:{from:0,to:0,t0:-1e9},exit:null,blur:0,ret:a},t.mesh.layers.set(Et),re=!0,cn(e),Xe.textContent=t.entry.name,Qe.textContent=t.entry.tag,Zt(pe,e),$e.inert=!1,pe.inert=!1,ot.inert=!0,document.body.classList.add("in-details");let r=T;Se(Ht,0,r.headerOut.at,r.headerOut.dur);for(let c of[Xe,Qe])Se(c,1,r.title.at,r.title.dur);Se(pe,1,r.open.at,r.open.dur),bn(t.entry,r),$e.focus({preventScroll:!0}),X("details",{pan:Re(e)}),nt(t.entry.tag?`Details: ${t.entry.name}. ${t.entry.tag}`:`Details: ${t.entry.name}`),et(),A()}function no(){if(!s||s.exit)return;let e=performance.now(),t=T.flip,o=s.flip,a=o.from+(o.to-o.from)*ve(t.ease,F((e-o.t0-H(t.at))/M(t.dur)));s.flip={from:a,to:o.to+s.dir*Math.PI,t0:e},X("flip"),nt(_a(s.turn+s.flip.to)?"Back of the sleeve":"Front of the sleeve"),A()}function At(){if(!s||s.exit)return;let e=x[s.i],t=performance.now(),o=T.exit,a=e.pose.yaw/ma,n=ma*(s.dir>0?Math.ceil(a-.5-1e-6):Math.floor(a+.5+1e-6)),r=Math.abs(n-e.pose.yaw)<.001?0:M(T.flip.dur)*(1-Ba);s.exit={t0:t,from:{...e.pose},yawTo:n,lag:r,blur:s.blur};for(let c of[Xe,Qe,pe,se])Se(c,0,o.at,o.textOut);Ia(),Se(Ht,1,o.headerIn.at,o.headerIn.dur),$e.inert=!0,pe.inert=!0,X("close",{pan:Re(s.i)}),nt("Back to the shelf"),A()}function Ga(e,t,o=!1){let{i:a}=s,n=o?null:s.ret;if(s=null,pn(e),e.pose=h?y.pose(e):Be(),ue(e),e.mesh.layers.set(0),re=Ge=!0,ot.inert=!1,document.body.classList.remove("in-details"),h){n&&n.isConnected&&n.focus({preventScroll:!0}),Oe(!0),et();return}He=o?-1:Jt(j.x,j.y),ke=He,Rt=t,n&&n.isConnected&&n.focus({preventScroll:!0}),$=ke===a?a:-1,$!==a&&(e.fall={from:Be(),t0:t}),eo(e),et()}var ro=null,ba=null,Y=-1,kt=!1,yt=0,so=()=>ba||(ba=import("./project-ZYF52NID.js").then(e=>ro=e.createProjectView({renderer:z,entries:_,slugOf:fe,onBack:Ln})));function zn(e){X("open",{pan:s?0:Re(e)}),so(),_[e].kind!=="about"&&import("./project-ZYF52NID.js").then(t=>t.loadDossier(fe(_[e]))),kt=!0,yt=Lo.cut,nt(`Open: ${_[e].name}`),location.hash=fe(_[e])}async function io(){if(Tt)return;let e=decodeURIComponent(location.hash.slice(1)),t=_.findIndex(o=>fe(o)===e);if(t>=0){if(t===Y)return;let o=await so();if(_.findIndex(a=>fe(a)===decodeURIComponent(location.hash.slice(1)))!==t||t===Y)return;s&&lo(!0),Ae(-1),Y=t;for(let a of K.getAnimations())a.finish();te?.setRoomTone(!1),yt||X("open"),await o.open(t,{cutAfter:yt}),yt=0}else if(Y>=0){let o=Y;if(Y=-1,ro?.close(),te?.setRoomTone(!0),X("close",{pan:Re(o)}),Xt(),h){y.jump(o);for(let a of x)ie[a.i]&&(a.pose=y.pose(a),ue(a));Oe(!0)}Ge=re=!0,De[o].querySelector('[data-action="open"]').focus({preventScroll:!0}),A()}}function Ln(){kt?(kt=!1,history.back()):(history.pushState(null,"",location.pathname+location.search),io())}window.addEventListener("hashchange",()=>{location.hash||(kt=!1),io()});function lo(e=!1){let t=x[s.i];for(let o of[Xe,Qe,pe,se])for(let a of o.getAnimations())a.cancel();Ia(),Se(Ht,1,0,1),$e.inert=!0,pe.inert=!0,Ga(t,performance.now(),e),t.fall=null,$=-1}document.addEventListener("click",e=>{let t=e.target.closest("[data-action][data-index]");if(!t)return;let o=+t.dataset.index;if(t.dataset.action==="details"){ao(o);return}_[o].url||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||(e.preventDefault(),zn(o))});var tt=e=>e&&e.closest&&e.closest(".slot")?De.indexOf(e.closest(".slot")):-1;ot.addEventListener("focusin",e=>{let t=tt(e.target);if(!(t<0)){if(h){s||(y.go(t),A());return}Ae(t,!0)}});ot.addEventListener("focusout",e=>{tt(e.relatedTarget)>=0||s||Ae(He)});window.addEventListener("keydown",e=>{if(e.metaKey||e.ctrlKey||e.altKey||Y>=0)return;if(s){e.key==="Escape"?(e.preventDefault(),At()):(e.key===" "||e.code==="Space")&&(e.preventDefault(),e.repeat||no());return}if(h){let r={ArrowLeft:-1,ArrowUp:-1,ArrowRight:1,ArrowDown:1}[e.key];if(r===void 0)return;e.preventDefault();let c=Math.max(0,Math.min(x.length-1,y.current+r));if(c===y.current)return;y.go(c),tt(document.activeElement)>=0&&De[c].querySelector(`[data-action="${document.activeElement.dataset.action}"]`).focus({preventScroll:!0}),X("tick"),A();return}let t={ArrowLeft:-1,ArrowRight:1,ArrowUp:-u.cols,ArrowDown:u.cols}[e.key];if(t===void 0)return;e.preventDefault();let o=tt(document.activeElement),a=o<0?0:Math.max(0,Math.min(x.length-1,o+t));if(a===o)return;let n=document.activeElement?.dataset?.action==="open"?"open":"details";De[a].querySelector(`[data-action="${n}"]`).focus({preventScroll:!0}),X("tick",{pan:Re(a)})});window.addEventListener("keyup",e=>{s&&(e.key===" "||e.code==="Space")&&e.preventDefault()});var co=window.matchMedia("(prefers-reduced-motion: reduce)");ft(co.matches);y.setReduced(co.matches);co.addEventListener?.("change",e=>{ft(e.matches),y.setReduced(e.matches)});var wt={count:x.length,firstFrameAt:null,ready:Ve.ready,covers:ln,sleeveRect:Qt,frontCorners(e){let t=x[e].mesh.matrixWorld,o=u.size;return[[-o/2,0],[o/2,0],[o/2,o],[-o/2,o]].map(([a,n])=>(N.set(a,n,u.thick).applyMatrix4(t),Te(N.x,N.y,N.z)))},setCover(e,t,o){Ct(x[e],t,o),A()},get project(){return Y>=0?fe(_[Y]):null},get sleevesAt(){return Mt},coverReadyAt:Ta,appearAt:de,get crate(){return h?{p:y.p,current:y.current,dragging:y.dragging}:null},set stickerOff(e){Ra=!!e,A()},get details(){return s?{index:s.i,flipped:_a(s.turn+s.flip.to),closing:!!s.exit,blur:s.blur,yaw:x[s.i].pose.yaw,backIn:s.backIn===null?null:Math.round(s.backIn-s.asked)}:null}};window.__editions=wt;Xt();for(let e of x)e.mesh.visible=!0;Ke.mesh.visible=!0;for(let e of[!0,!1]){for(let t of x)for(let o of[t.front,t.back,t.mats[0]])o.transparent=e,o.needsUpdate=!0;for(let t of[0,Et])R.layers.set(t),z.render(O,R);R.layers.enableAll(),z.render(O,R),R.layers.set(0),Ze.background(O,R,1),Ze.composite(.5)}for(let e of x)ue(e);Ke.mesh.visible=!1;re=!0;Ve.ready.then(()=>{location.hash&&io()});export{pr as drawn};
