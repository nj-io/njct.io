import{A as b,B as rt,C as K,D as st,E as mo,F as ie,G as xo,H as vo,I as yo,J as wo,K as go,L as te,M as oe,N as Eo,O as So,Q as bo,R as Ro,S as Mo,a as io,b as lo,e as He,i as ot,j as co,l as pe,m as fo,n as at,o as ee,p as uo,q as O,s as U,t as ze,u as po,v as se,w as ho,x as nt}from"./chunk-CBEJLKG4.js";import{a as C,b as it,c as le,d as k,e as H,f as me}from"./chunk-U3AZOSC6.js";import{a as kt,b as To,c as he,e as u,f as L,g as ko,h as G,i as M,j as Ho}from"./chunk-OOBDN6GE.js";var lt=class extends ie{constructor(){super();let t=new rt;t.deleteAttribute("uv");let a=new oe({side:io}),o=new oe,n=new So(16777215,900,28,2);n.position.set(.418,16.199,.3),this.add(n);let r=new b(t,a);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let f=new vo(t,o,6),s=new ho;s.position.set(-10.906,2.009,1.846),s.rotation.set(0,-.195,0),s.scale.set(2.328,7.905,4.651),s.updateMatrix(),f.setMatrixAt(0,s.matrix),s.position.set(-5.607,-.754,-.758),s.rotation.set(0,.994,0),s.scale.set(1.97,1.534,3.955),s.updateMatrix(),f.setMatrixAt(1,s.matrix),s.position.set(6.167,.857,7.803),s.rotation.set(0,.561,0),s.scale.set(3.927,6.285,3.687),s.updateMatrix(),f.setMatrixAt(2,s.matrix),s.position.set(-2.017,.018,6.124),s.rotation.set(0,.333,0),s.scale.set(2.002,4.566,2.064),s.updateMatrix(),f.setMatrixAt(3,s.matrix),s.position.set(2.291,-.756,-2.621),s.rotation.set(0,-.286,0),s.scale.set(1.546,1.552,1.496),s.updateMatrix(),f.setMatrixAt(4,s.matrix),s.position.set(-2.193,-.369,-5.547),s.rotation.set(0,.516,0),s.scale.set(3.875,3.487,2.986),s.updateMatrix(),f.setMatrixAt(5,s.matrix),this.add(f);let i=new b(t,Ae(50));i.position.set(-16.116,14.37,8.208),i.scale.set(.1,2.428,2.739),this.add(i);let c=new b(t,Ae(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let p=new b(t,Ae(17));p.position.set(14.904,12.198,-1.832),p.scale.set(.15,4.265,6.331),this.add(p);let d=new b(t,Ae(43));d.position.set(-.462,8.89,14.52),d.scale.set(4.38,5.441,.088),this.add(d);let h=new b(t,Ae(20));h.position.set(3.235,11.486,-12.541),h.scale.set(2.5,2,.1),this.add(h);let v=new b(t,Ae(100));v.position.set(0,20,0),v.scale.set(1,.1,1),this.add(v)}dispose(){let t=new Set;this.traverse(a=>{a.isMesh&&(t.add(a.geometry),t.add(a.material))});for(let a of t)a.dispose()}};function Ae(e){return new Eo({color:0,emissive:16777215,emissiveIntensity:e})}var Pa=u.hoverLift.toFixed(2),Q=u.cols,zo=(u.pitch/2).toFixed(2),Fa={key:{rect:[1148.801,12.997,8768.289,3472.806],z:994.831,power:2.322},fill:{rect:[-2516.226,-9815.124,2516.226,10070.146],z:573.364,power:1.474},shelfAlbedo:1.219,shelfAmbient:.383,contact:{strength:.332,reach:19.033},keyMix:.571,base:{centre:.614,edge:.752,cy:-293.494,rx:806.633,ry:309.574,pow:.304},edgeShade:{strength:.989,reach:5.54},liftShade:{strength:.5,reach:8},halo:{right:.4,left:.383,top:.056,rise:.308,fall:60.395,row2:.724,vfall:10,drop:.881,dropReach:31.417},glow:{strength:.2,fall:100,side:60,fade:24.653,width:1100}},Le=4*Q;function Ao(){return{uLightRect:{value:[new U,new U]},uLightZ:{value:[0,0]},uLightPower:{value:[0,0]},uShelf:{value:[new U,new U]},uShelfDepth:{value:0},uSlab:{value:Array.from({length:Le},()=>new U(0,0,0,0))},uSlabZ:{value:new Array(Le).fill(1)},uSlabA:{value:new Array(Le).fill(0)},uFoot:{value:Array.from({length:2*Q},()=>new U(0,0,0,1e3))},uShelfAlbedo:{value:1},uShelfAmbient:{value:0},uContact:{value:new ee},uHalo:{value:new O},uHaloShape:{value:new U},uHaloDrop:{value:new ee},uGlow:{value:new U},uGlowWidth:{value:1e4},uEdgeShade:{value:new U},uKeyMix:{value:.5},uBase:{value:new O},uBaseShape:{value:new O}}}function Lo(e,t=Fa){[t.key,t.fill].forEach((a,o)=>{e.uLightRect.value[o].set(...a.rect),e.uLightZ.value[o]=a.z,e.uLightPower.value[o]=a.power}),e.uShelfAlbedo.value=t.shelfAlbedo,e.uShelfAmbient.value=t.shelfAmbient,e.uContact.value.set(t.contact.strength,t.contact.reach),e.uHalo.value.set(t.halo.right,t.halo.left,t.halo.top),e.uHaloShape.value.set(t.halo.rise,t.halo.fall,t.halo.row2,t.halo.vfall),e.uHaloDrop.value.set(t.halo.drop,t.halo.dropReach),e.uGlow.value.set(t.glow.strength,t.glow.fall,t.glow.side,t.glow.fade),e.uGlowWidth.value=t.glow.width,e.uEdgeShade.value.set(t.edgeShade.strength,t.edgeShade.reach,t.liftShade.strength,t.liftShade.reach),e.uKeyMix.value=t.keyMix,e.uBase.value.set(t.base.centre,t.base.edge,t.base.cy),e.uBaseShape.value.set(t.base.rx,t.base.ry,t.base.pow)}var ct=`
#define PI 3.141592653589793
uniform vec4 uLightRect[2];
uniform float uLightZ[2];
uniform float uLightPower[2];
uniform vec4 uShelf[2];      // x0, x1, y bottom, y top
uniform float uShelfDepth;
uniform vec4 uSlab[${Le}];  // x0, y0, x1, y1 of a slab parallel to the wall
uniform float uSlabZ[${Le}];
uniform float uSlabA[${Le}];  // occlusion strength: the sleeve's opacity
uniform vec4 uFoot[${2*Q}];      // per sleeve: x0, x1, bottom edge depth, height of the bottom edge above its shelf

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
    for (int k = 0; k < ${2*Q}; k++) {
      int i = row * ${2*Q} + k;
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
  for (int k = 0; k < ${Q}; k++) {
    int i = row * ${2*Q} + k * 2;
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
    float wx = smoothstep(-uGlow.z, uGlow.z, cx + ${zo}) - smoothstep(-uGlow.z, uGlow.z, cx - ${zo});
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
  for (int k = 0; k < ${Q}; k++) {
    int i = row * ${2*Q} + k * 2;
    vec4 a = uSlab[i], b = uSlab[i + 1];
    if (a.z <= a.x) continue;
    float dx = min(a.x, b.x) - p.x;
    // It fades toward the top edge with the light beside the sleeve (uHaloDrop), where the sleeve meets the wall.
    if (dx > 0.0 && p.y >= a.y && p.y <= b.w)
      f *= 1.0 - uSlabA[i] * uEdgeShade.x * exp(-dx / uEdgeShade.y) * (1.0 - uHaloDrop.x * (1.0 - smoothstep(0.0, uHaloDrop.y, b.w - p.y)));
    // Under a lifted sleeve: a band from its bottom edge, offset a little to the left.
    float lift = clamp(uFoot[row * ${Q} + k].w / ${Pa}, 0.0, 1.0);
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
`;var Ba=`
out vec2 vWorld;
uniform vec4 uRegion; // world x0, y0, x1, y1 covered by the texture
void main() {
  vWorld = mix(uRegion.xy, uRegion.zw, uv);
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`,_a=`
precision highp float;
in vec2 vWorld;
out vec4 outColor;
${ct}
void main() {
  int row = rowAt(vWorld.y);
  float seen = mix(wallLight(1, vWorld, row), wallLight(0, vWorld, row), uKeyMix);
  float e = wallBase(vWorld) * seen * edgeShade(vWorld, row) + haloAt(vWorld, row);
  outColor = vec4(vec3(e), 1.0);
}`,Ga=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,Da=`
uniform sampler2D uBake;
uniform float uGain;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(uBake, vUv).rgb * uGain;
  gl_FragColor = vec4(c, 1.0);
  #include <colorspace_fragment>
  float n = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  gl_FragColor.rgb += (n - 0.5) / 255.0;
}`;function Co(e,t){let a=new ze(4,4,{type:ot,format:co,depthBuffer:!1,minFilter:He,magFilter:He,generateMipmaps:!1}),o=new K({glslVersion:fo,uniforms:{...t,uRegion:{value:new U}},vertexShader:Ba,fragmentShader:_a,depthTest:!1,depthWrite:!1}),n=new ie;n.add(new b(new te(2,2),o));let r=new st,f=new K({uniforms:{uBake:{value:a.texture},uGain:{value:1}},vertexShader:Ga,fragmentShader:Da,toneMapped:!1}),s=new b(new te(1,1),f);return s.renderOrder=-1,{mesh:s,resize(i,c,p,d,h,v,A=null){a.setSize(h,v),o.uniforms.uRegion.value.set(...A||[i,c,p,d]),s.scale.set(p-i,d-c,1),s.position.set((i+p)/2,(c+d)/2,0),s.updateMatrixWorld()},setGain(i){f.uniforms.uGain.value=i},bake(){let i=e.getRenderTarget();e.setRenderTarget(a),e.render(n,r),e.setRenderTarget(i)},dispose(){a.dispose(),o.dispose(),f.dispose(),s.geometry.dispose()}}}function Ia(){let{width:e,depth:t,thick:a,bevel:o}=L,n=new wo;n.moveTo(0,-a),n.lineTo(t-o,-a),n.absarc(t-o,-a+o,o,-Math.PI/2,0,!1),n.lineTo(t,-o),n.absarc(t-o,-o,o,0,Math.PI/2,!1),n.lineTo(0,0),n.closePath();let r=new go(n,{depth:e,bevelEnabled:!1,curveSegments:6});return r.applyMatrix4(new se().set(0,0,-1,e/2,0,1,0,0,1,0,0,0,0,0,0,1)),r.computeVertexNormals(),r}var Va=`
varying vec3 vPos;
varying vec3 vNormal;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vPos = w.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,$a=`
${ct}
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
}`;function Po(e){let t=Ia();return L.tops.map((a,o)=>{let n=new K({uniforms:{...e,uRow:{value:o}},vertexShader:Va,fragmentShader:$a,toneMapped:!1}),r=new b(t,n);return r.position.set(0,a,0),r.updateMatrixWorld(),r})}var Fo=`
vec3 njNeutral(vec3 c) {
  const float start = 0.76, desat = 0.15;
  float x = min(c.r, min(c.g, c.b));
  c -= x < 0.08 ? x - 6.25 * x * x : 0.04;
  float peak = max(c.r, max(c.g, c.b));
  if (peak < start) return c;
  float d = 1.0 - start, np = 1.0 - d * d / (peak + d - start);
  c *= np / peak;
  return mix(c, vec3(np), 1.0 - 1.0 / (desat * (peak - np) + 1.0));
}`;var W=u.size,ft=W*Math.sin(u.lean),Vo={dx:0,yaw:0,opacity:1},V=()=>({...Vo,lift:0,z:ft,lean:u.lean}),Ce=()=>({...Vo,lift:u.hoverLift,z:u.hoverZ,lean:0}),Ht=["lift","z","lean","dx","yaw"],Oa="#d9d6d0";function $e(e,t=null){return e.onBeforeCompile=a=>{a.fragmentShader=a.fragmentShader.replace("void main() {",`${Fo}
${t?`uniform float uMapBias;
`:""}void main() {`).replace("#include <tonemapping_fragment>","gl_FragColor.rgb = njNeutral(gl_FragColor.rgb);"),t&&(a.uniforms.uMapBias=t,a.fragmentShader=a.fragmentShader.replace("#include <map_fragment>",bo.map_fragment.replace("texture2D( map, vMapUv )","texture2D( map, vMapUv, uMapBias )")))},e.customProgramCacheKey=()=>t?"nj-neutral-bias":"nj-neutral",e}var Oe={value:0};function $o(e){let t=new rt(W,W,u.thick);return t.translate(0,W/2,u.thick/2),e.map((a,o)=>{let n=$e(new oe({color:15855594,roughness:.8})),r=o%u.cols,f=Math.floor(o/u.cols),s=Math.min(u.cols,e.length-f*u.cols),i=$e(new oe({color:new nt(a.accent?.light||Oa),roughness:.8}),Oe),c=$e(new oe({color:15328992,roughness:.7})),p=[n,n,n,n,i,c],d=new b(t,p);d.matrixAutoUpdate=!1;let h={i:o,row:f,col:r,mesh:d,front:i,back:c,mats:p,entry:a,x:(r-(s-1)/2)*u.pitch,shelfY:L.tops[f],pose:{...V(),opacity:0}};return ce(h),h})}var Bo=new uo,Ua=new O(1,0,0),_o=new O,Wa=new O(1,1,1),ve=new O,Go=new se,Do=new se,Io=new se;function ce(e){let t=e.pose;_o.set(e.x+t.dx,e.shelfY+t.lift,t.z),Bo.setFromAxisAngle(Ua,-t.lean),e.mesh.matrix.compose(_o,Bo,Wa),t.yaw&&(ve.set(0,W/2,u.thick/2).applyMatrix4(e.mesh.matrix),Do.makeTranslation(ve.x,ve.y,ve.z),Io.makeTranslation(-ve.x,-ve.y,-ve.z),Go.makeRotationY(t.yaw),e.mesh.matrix.premultiply(Io).premultiply(Go).premultiply(Do)),e.mesh.matrixWorld.copy(e.mesh.matrix),e.mesh.visible=t.opacity>.001;let a=t.opacity<.999;for(let o of[e.front,e.back,e.mats[0]])o.transparent!==a&&(o.transparent=a,o.needsUpdate=!0),o.opacity=t.opacity}function Oo(e,t,a=!1){for(let o of e){let n=o.pose,r=Math.cos(n.lean),f=Math.sin(n.lean),s=o.shelfY+n.lift,i=u.thick/2,c=o.x+n.dx,p=at.smoothstep(n.z,110,260),d=o.mesh.visible&&!a?n.opacity*(1-p):0,h=(o.row*u.cols+o.col)*2;for(let v=0;v<2;v++){let A=v/2,Te=(v+1)/2;d>0?t.uSlab.value[h+v].set(c-W/2,s+W*A*r,c+W/2,s+W*Te*r):t.uSlab.value[h+v].set(0,0,0,0),t.uSlabZ.value[h+v]=Math.max(1.5,n.z-W*(A+Te)/2*f+i),t.uSlabA.value[h+v]=d}t.uFoot.value[o.i].set(c-W/2,c+W/2,n.z+u.thick,d>0?n.lift:1e3)}}function zt(e,t,a){t&&(e.front.map=t,e.front.color.set(16777215),e.front.needsUpdate=!0),a&&(e.back.map=a,e.back.color.set(16777215),e.back.needsUpdate=!0)}var Uo=15,ut=e=>e*e,dt=(e,t,a)=>{let o={...t};for(let n of Ht)o[n]=e[n]+(t[n]-e[n])*a;return o.opacity=e.opacity+(t.opacity-e.opacity)*a,o};function Wo(e){let t=M.appear.at+M.appear.stagger*e,a=M.drop.at+M.drop.stagger*e,o=a+M.drop.dur,n=o+M.lean.delay;return{appear:t,drop:a,land:o,lean:n,rest:n+M.lean.dur}}var At=e=>le()?200+40*e:Wo(e).appear;function qo(e,t){if(le()){let s=At(e);return t>=s+160?null:{...V(),opacity:C((t-s)/160)}}let a=Wo(e);if(t>=a.rest)return null;if(t<a.appear)return{...V(),opacity:0};let o=M.appearPose,n=1-.345*Math.exp(-(t-a.appear)/150),r={...V(),lift:o.lift,z:o.z,lean:0,opacity:n};if(t<a.drop)return r;if(t<a.land){let s=ut(C((t-a.drop)/M.drop.dur));return{...r,lift:o.lift*(1-s),z:o.z+(ft-o.z)*s}}let f=ut(C((t-a.lean)/M.lean.dur));return{...r,lift:0,z:ft,lean:u.lean*f}}function Yo(e,t){let a=Ce(),o=1-Math.exp(-t/(le()?.04:u.hoverTau)),n=!1;for(let r of Ht){let f=a[r]-e.pose[r];Math.abs(f)>.001?(e.pose[r]+=f*o,n=!0):e.pose[r]=a[r]}return e.pose.opacity=1,n}function No(e,t){let a=le()?{delay:0,drop:90,pause:0,lean:60}:ko,o=V();if(t<a.delay)return{...e};let n=t-a.delay,r={...o,lean:Math.min(e.lean,o.lean)};if(n<a.drop)return dt(e,r,ut(n/a.drop));let f=n-a.drop-a.pause;return f<0?r:f<a.lean?dt(r,o,ut(f/a.lean)):null}var jo=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,qa=`
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
}`,Ya=`
uniform sampler2D uSharp;
uniform sampler2D uBlur;
uniform float uMix;
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(mix(texture2D(uSharp, vUv).rgb, texture2D(uBlur, vUv).rgb, uMix), 1.0);
  #include <colorspace_fragment>
}`;function Zo(e){let t=new ze(4,4,{samples:4,colorSpace:pe}),a={type:ot,depthBuffer:!1,minFilter:He,magFilter:He},o=new ze(4,4,a),n=new ze(4,4,a),r=new K({uniforms:{uTex:{value:null},uDir:{value:new ee},uSigma:{value:0}},vertexShader:jo,fragmentShader:qa,depthTest:!1,depthWrite:!1}),f=new K({uniforms:{uSharp:{value:t.texture},uBlur:{value:o.texture},uMix:{value:0}},vertexShader:jo,fragmentShader:Ya,depthTest:!1,depthWrite:!1}),s=new b(new te(2,2),r);s.frustumCulled=!1;let i=new ie;i.add(s);let c=new st,p=.5,d=(h,v)=>{s.material=h,e.setRenderTarget(v),e.render(i,c)};return{resize(h,v){t.setSize(h,v),o.setSize(Math.ceil(h/2),Math.ceil(v/2)),n.setSize(Math.ceil(h/2),Math.ceil(v/2)),p=e.getPixelRatio()/2},background(h,v,A){let Te=e.getRenderTarget();e.setRenderTarget(t),e.clear(),e.render(h,v);let Ve=A*p;r.uniforms.uSigma.value=Ve,r.uniforms.uTex.value=t.texture,r.uniforms.uDir.value.set(1/o.width,0),d(r,n),r.uniforms.uTex.value=n.texture,r.uniforms.uDir.value.set(0,1/o.height),d(r,o),e.setRenderTarget(Te)},composite(h){f.uniforms.uMix.value=h,d(f,null)},dispose(){t.dispose(),o.dispose(),n.dispose(),r.dispose(),f.dispose()}}}var Ct=u.size,Xo=.255*Ct,Lt={x:.3245*Ct,y:.8255*Ct,z:u.thick+.25};function Na(e){let a=document.createElement("canvas");a.width=a.height=512;let o=a.getContext("2d"),n=512/2,r=512*.44,f=11;o.beginPath();for(let d=0;d<=720;d++){let h=d/720*Math.PI*2,v=r*(1+.065*Math.cos(f*h));o.lineTo(n+v*Math.cos(h),n+v*Math.sin(h))}o.closePath(),o.save(),o.clip();let s=o.createConicGradient?o.createConicGradient(.6,n,n):o.createLinearGradient(0,0,512,512);["#ffa6e6","#9af2dc","#c4b2ff","#ffe596","#9fd6ff","#ffb8dc","#ffa6e6"].forEach((d,h,v)=>s.addColorStop(h/(v.length-1),d)),o.fillStyle=s,o.fillRect(0,0,512,512),[[.3,.3,"#9af2dc"],[.7,.62,"#ffa6e6"],[.42,.72,"#ffe596"],[.68,.28,"#c4b2ff"],[.25,.58,"#ffb8dc"]].forEach(([d,h,v])=>{let A=o.createRadialGradient(d*512,h*512,0,d*512,h*512,102.4);A.addColorStop(0,v+"cc"),A.addColorStop(1,v+"00"),o.fillStyle=A,o.fillRect(0,0,512,512)});let i=o.createRadialGradient(n*.8,n*.7,0,n*.8,n*.7,512*.55);i.addColorStop(0,"rgba(255,255,255,0.75)"),i.addColorStop(1,"rgba(255,255,255,0)"),o.fillStyle=i,o.fillRect(0,0,512,512),o.restore(),o.translate(n,n),o.rotate(12*Math.PI/180),o.fillStyle="#000",o.textAlign="center",o.textBaseline="alphabetic",o.font=`800 ${512*.15}px 'NJ Text', system-ui, sans-serif`;let c=512*.15;e.forEach((d,h)=>o.fillText(d,0,(h-(e.length-1)/2)*c+512*.055));let p=new yo(a);return p.colorSpace=pe,p.anisotropy=4,p}var Ko=new nt().setRGB(1,.96,1);function Qo(e){let t=Na(e.toUpperCase().split(" ")),a=$e(new oe({map:t,emissiveMap:t,color:Ko,emissive:Ko,emissiveIntensity:.5,transparent:!0,roughness:.8,metalness:0,depthWrite:!1}),Oe),o=new b(new te(Xo,Xo),a);o.matrixAutoUpdate=!1,o.visible=!1,o.renderOrder=1;let n=new se().makeTranslation(Lt.x,Lt.y,Lt.z);return{mesh:o,place(r,f){o.visible=f>.002&&r.mesh.visible,o.visible&&(a.opacity=f,o.matrix.multiplyMatrices(r.mesh.matrix,n),o.matrixWorld.copy(o.matrix))}}}var w={width:.682,bottom:.797,lean:56*Math.PI/180,strip:.124,top:132,flatLean:78*Math.PI/180,flatStrip:.07,flatMax:4,drag:150,carry:.06,omega:8.5,details:{size:.815,centreY:.404},wheelNotch:60,groundGain:.838,edgeColour:1842204,shadow:{y0:.403,y1:.794,alpha:.054,feather:20}};function Jo(){let e=new K({uniforms:{uSize:{value:new ee(1,1)},uFeather:{value:1},uAlpha:{value:w.shadow.alpha}},vertexShader:"varying vec2 vP; uniform vec2 uSize; void main() { vP = uv * uSize; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`varying vec2 vP; uniform vec2 uSize; uniform float uFeather, uAlpha;
      void main() { float d = min(vP.y, uSize.y - vP.y);   // soft top and bottom; it runs off the left edge and under the crate
        gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha * smoothstep(0.0, uFeather, d)); }`,transparent:!0,depthWrite:!1,toneMapped:!1}),t=new b(new te(1,1),e);return t.renderOrder=-.5,t.visible=!1,{mesh:t,setOpacity(a){e.uniforms.uAlpha.value=w.shadow.alpha*a},layout(a,o,n){let r=-a/2/n-2,f=0,s=(o/2-w.shadow.y1*o)/n,i=(o/2-w.shadow.y0*o)/n;t.scale.set(f-r,i-s,1),t.position.set((r+f)/2,(s+i)/2,.5),t.updateMatrixWorld(),e.uniforms.uSize.value.set(f-r,i-s),e.uniforms.uFeather.value=w.shadow.feather/n}}}function ea(e){let t=u.size,a=0,o=0,n=0,r=null,f=0,s=!1,i=0,c=0,p=0,d=0,h=0,v=1,A=g=>Math.max(0,Math.min(e-1,g));function Te(g,E,S){let _=w.width*g/t;i=(E/2-w.bottom*E)/_;let ke=w.bottom*E-t*_*Math.cos(w.lean);return c=Math.min(w.strip*t,e>1?Math.max(0,ke-w.top)/(e-1)/_:0),p=c*Math.tan(w.lean)+4,d=w.flatStrip*t,h=(e-1)*p+t*Math.sin(w.lean)+10,v=_*(S-h)/S,v}let Ve=g=>d*w.flatMax*(1-Math.exp(-g/w.flatMax));function Aa(g){let E=g.i-a,S=V();if(S.dx=-g.x,E>=0)S.lean=w.lean,S.lift=i+E*c-g.shelfY,S.z=h-E*p;else{let _=-E,ke=Math.min(1,_);S.lean=w.lean+(w.flatLean-w.lean)*ke,S.lift=i-Ve(_)-g.shelfY,S.z=h+.8*t*ke+5*Math.max(0,Ve(_)-Ve(1))}return S}function La(g){if(r)return!0;let E=s?30:w.omega,S=E*E*(n-a)-2*E*o;return o+=S*g,a+=o*g,Math.abs(n-a)<.001&&Math.abs(o)<.01?(a=n,o=0,!1):!0}return{layout:Te,pose:Aa,step:La,get p(){return a},get current(){return A(Math.round(r?a:n))},get dragging(){return!!r},setReduced(g){s=!!g},go(g){n=A(g)},jump(g){n=a=A(g),o=0},begin(g,E){r={y0:g,p0:a,samples:[[E,g]]},o=0},move(g,E){if(!r)return;let S=r.p0+(g-r.y0)/w.drag;for(S<0?S/=3:S>e-1&&(S=e-1+(S-e+1)/3),a=S,r.samples.push([E,g]);r.samples.length>2&&E-r.samples[0][0]>100;)r.samples.shift()},end(g){if(!r)return 0;let E=r.samples,S=E[0],_=E[E.length-1],ke=Math.abs(_[1]-r.y0),Ca=_[0]-S[0]>8&&g-_[0]<80?(_[1]-S[1])/(_[0]-S[0])*1e3:0;return r=null,o=Math.max(-12,Math.min(12,Ca/w.drag)),n=A(Math.round(a+(s?0:o*w.carry))),s&&(o=0),ke},cancel(){r&&(r=null,n=A(Math.round(a)))},wheel(g){for(f+=g;Math.abs(f)>=w.wheelNotch;){let E=Math.sign(f);n=A(n+E),f-=E*w.wheelNotch}}}}var I=To,j=document.getElementById("c"),z=new Mo({canvas:j,antialias:!0,powerPreference:"high-performance"});z.outputColorSpace=pe;z.toneMapping=lo;var $=new ie,va=new Ro(z);$.environment=va.fromScene(new lt,.04).texture;$.environmentIntensity=.46;va.dispose();var ue=Ao();Lo(ue);L.tops.forEach((e,t)=>ue.uShelf.value[t].set(-L.width/2,L.width/2,e-L.thick,e));ue.uShelfDepth.value=L.depth;var vt=Co(z,ue);$.add(vt.mesh);var ya=Po(ue);for(let e of ya)$.add(e);var x=$o(I);Oe.value=window.__editionsTest?.coverBias??-.5;var ge=new xo(new Uint8Array([255,255,255,255]),1,1);ge.colorSpace=pe;ge.needsUpdate=!0;for(let e of x)e.front.map=ge,e.back.map=ge,$.add(e.mesh);var yt=1,pt=x.find(e=>e.entry.newest)||null,wa=!1,Ye=Qo("Now playing");$.add(Ye.mesh);var Ne=Zo(z),B=2556,R=new mo(20,1,100,B*2);R.position.set(0,0,B);var y=ea(x.length),wt=Jo();$.add(wt.mesh);var de=x.map(()=>null),ga=x.map(()=>null),Dt=x.map(()=>null),Za=1,Ea=null,Sa=new Promise(e=>requestAnimationFrame(()=>requestAnimationFrame(e))).then(()=>import("./covers-V2BS4OL4.js")).then(e=>Ea=e),Xa=(e,t,a)=>Sa.then(o=>o.createCover(z,e.entry,t,a)),ta=()=>gt===null?0:performance.now()-gt,oa=window.__editionsTest?.coverLate||{},Ka=0;function ba(){let e=Ka++;if(e>=x.length)return Promise.resolve();let t=x[e],a=()=>{Dt[e]=ta(),ga[e]=gt===null?null:Math.round(Dt[e]),T()};return Xa(t,e,{size:1024,backSize:0}).then(o=>{let n=()=>{de[e]=o,zt(t,o.front,null),a()};oa[e]==null?n():setTimeout(n,Math.max(0,Vt(e)+oa[e]-ta()))},o=>{console.warn(`cover ${t.entry.name}: flat sleeve (${o?.message||o})`),a()}).then(ba)}var Qa=Sa.then(()=>Promise.all(Array.from({length:Za},ba)));function Ja(e){let t=x[e];de[e]?.detailBack(1024).then(a=>{l&&l.i===e&&(t.back.map=a||ge,t.back.color.set(a?16777215:Ra),t.back.needsUpdate=!0,T())}).catch(a=>console.warn(`cover ${t.entry.name}: no Details back (${a?.message||a})`))}var It=!1,ht=null;function en(){if(It||!de[0]||re.some(t=>!t))return;It=!0;let e=window.requestIdleCallback||(t=>setTimeout(t,200));e(()=>{l||de[0].detailBack(1024).catch(()=>{}),e(()=>ao().then(t=>t.warm()).then(t=>{t&&(ht=t,T())}).catch(t=>console.warn(`world warm-up: ${t?.message||t}`)),{timeout:3e3})},{timeout:2e3})}var Ra=15328992,aa=600,fe=x.map(()=>null),na=x.map(()=>0),Vt=e=>m?H(M.appear.at+M.appear.stagger*e):At(e);function tn(e,t){if(fe[e]===null){if(e>0&&fe[e-1]===null)return null;let a=Vt(e),o=e>0?Math.max(a,fe[e-1]+a-Vt(e-1)):a,n=Dt[e]??(t>=a+aa?a+aa:null);if(n===null||t<Math.max(o,n))return null;fe[e]=Math.max(o,n),na[e]=fe[e]-a,de[e]||on(x[e])}return na[e]}function on(e){let t=Ea?.coverGround?.(e.entry,e.i)||e.entry.accent?.light;t&&e.front.color.set(t)}function an(e){e.back.map!==ge&&(e.back.map=ge,e.back.color.set(Ra),e.back.needsUpdate=!0)}var We=-1,Ma=0;function nn(e){e!==We&&(We>=0&&(de[We]?.setAlive(!1),Ma=performance.now()+1700),We=e,e>=0&&de[e]?.setAlive(!0))}var J=null,Pt=null,$t=document.querySelector(".sound");function Yt(){let e=!!J?.enabled;$t.setAttribute("aria-pressed",String(e)),$t.setAttribute("aria-label",e?"Sound on":"Sound off")}function Nt(){return Pt||(Pt=import("./audio-RSGSU6J4.js").then(e=>(J=e.createAudio(),J.setRoomTone(!0),Yt(),J))),Pt}var X=(e,t)=>{window.__editions?.soundLog?.push([e,Math.round(performance.now())]),J?.play(e,t)},Ee=e=>Math.max(-1,Math.min(1,x[e].x/600));for(let e of["pointermove","pointerdown","keydown","touchstart"])window.addEventListener(e,Nt,{once:!0,capture:!0,passive:!0});var Ta=()=>{J?J.unlock():Nt().then(e=>e.unlock())};window.addEventListener("pointerdown",Ta,{once:!0,capture:!0});window.addEventListener("keydown",Ta,{once:!0,capture:!0});$t.addEventListener("click",async()=>{let e=J||await Nt();e.setEnabled(!e.enabled),Yt()});Yt();var Je=document.getElementById("slots"),_e=x.map(e=>{let t=I[e.i],a=document.createElement("li");a.className="slot";let o=document.createElement("article");o.setAttribute("aria-labelledby",`sl-${e.i}`);let n=document.createElement("h2");if(n.className="sr",n.id=`sl-${e.i}`,n.textContent=t.name,o.appendChild(n),t.tag){let r=document.createElement("p");r.className="sr",r.textContent=t.year?`${t.tag}, ${t.year}`:t.tag,o.appendChild(r)}for(let[r,f]of[["open","Open"],["details","Details"]]){let s=document.createElement("button");s.type="button",s.dataset.action=r,s.dataset.index=String(e.i),s.textContent=f,s.setAttribute("aria-label",`${f}: ${t.name}`),o.appendChild(s)}return a.appendChild(o),Je.appendChild(a),a}),et=document.getElementById("crate-bar"),rn=et.querySelector(".cb-year"),sn=et.querySelector(".cb-name"),ln=et.querySelector(".cb-details"),cn=et.querySelector(".cb-open"),Ft=document.querySelector(".crate-rail span"),ra=document.getElementById("announce");function tt(e){ra.textContent="",requestAnimationFrame(()=>{ra.textContent=e})}document.getElementById("index").append(...I.map(e=>{let t=document.createElement("li"),a=document.createElement("span");a.className="y",a.textContent=e.year||"";let o=document.createElement("span");return o.className="n",o.textContent=e.name,t.append(a,o),t}));var Mt=document.querySelector(".tagline"),Ge=document.getElementById("details"),je=Ge.querySelector(".d-title"),Ze=Ge.querySelector(".d-tag"),ae=document.getElementById("d-open");function Fe(e,t,a,o){let n=+getComputedStyle(e).opacity;for(let r of e.getAnimations())r.cancel();e.animate([{opacity:n},{opacity:t}],{duration:k(o),delay:H(a),easing:"ease",fill:"both"})}var F=0,P=0,Z=1,m=!1,Ot=0,Ut=0,Wt=0,ka=0,Pe=0,fn=14,Bt=new ee;function jt(){F=window.innerWidth,P=window.innerHeight;let e=m;m=F<600,B=m?2556*4:2556,Z=m?y.layout(F,P,B):kt(F,P),R.position.z=B,R.far=B*2;let t=F/2/Z,a=P/2/Z;if(R.fov=at.radToDeg(2*Math.atan(a/B)),R.aspect=F/P,R.clearViewOffset(),R.updateMatrixWorld(),Pe=0,!m){let i=V(),c=u.size,p=Se(0,L.tops[0]+c*Math.cos(i.lean),i.z-c*Math.sin(i.lean)+u.thick).y;Pe=Math.max(0,Math.round(Mt.getBoundingClientRect().bottom+fn-p)),Pe&&R.setViewOffset(F,P,0,-Pe,F,P)}z.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),z.setSize(F,P,!1),z.getDrawingBufferSize(Bt),Ne.resize(Bt.x,Bt.y);let o=m?kt(F,P):Z,n=F/2/o*1.02,r=P/2/o*1.02,f=Pe/Z;vt.resize(-t*1.02,-a*1.02+f,t*1.02,a*1.02+f,Math.ceil(F/2),Math.ceil(P/2),m?[-n,-r,n,r]:null),Be=ne=!0,Ot=m?w.details.size*F:G.size*Z,Ut=m?w.details.centreY*P:P/2-(900/2-G.centreY)*Z,Wt=B*(1-u.size*Z/Ot),ka=(P/2+Pe-Ut)/Z*(B-Wt)/B;let s=m||!!window.__editionsTest?.noShelves;for(let i of ya)i.visible=!s;vt.setGain(m?w.groundGain:1),wt.mesh.visible=m,m&&wt.layout(F,P,Z);for(let i of x)i.mats[0].color.set(m?w.edgeColour:15855594);if(L.tops.forEach((i,c)=>s?ue.uShelf.value[c].set(0,0,-1e5,-1e5):ue.uShelf.value[c].set(-L.width/2,L.width/2,i-L.thick,i)),document.body.classList.toggle("crate",m),m!==e){l&&ro(),Me(-1);for(let i of x)re[i.i]&&(i.fall=null,i.pose=qt(i),ce(i));Ie(!0)}else if(m)for(let i of x)re[i.i]&&!(l&&l.i===i.i)&&(i.pose=qt(i),ce(i));Ha=x.map(i=>un(i)),m||x.forEach(Kt),pn(),T()}var qt=e=>m?y.pose(e):V(),_t=new O,ye=new po;function Se(e,t,a){return _t.set(e,t,a).project(R),{x:(_t.x+1)/2*F,y:(1-_t.y)/2*P}}function Zt(e){let t=x[e].mesh;t.geometry.boundingBox||t.geometry.computeBoundingBox(),ye.copy(t.geometry.boundingBox).applyMatrix4(t.matrixWorld);let a=1/0,o=1/0,n=-1/0,r=-1/0;for(let f of[ye.min.x,ye.max.x])for(let s of[ye.min.y,ye.max.y])for(let i of[ye.min.z,ye.max.z]){let c=Se(f,s,i);a=Math.min(a,c.x),n=Math.max(n,c.x),o=Math.min(o,c.y),r=Math.max(r,c.y)}return{x:a,y:o,width:n-a,height:r-o}}var Ha=[];function un(e){let t=u.size,a=e.shelfY,o=Se(e.x-t/2,a+u.hoverLift+t,u.hoverZ),n=Se(e.x+t/2,a,0);return{x0:o.x,y0:o.y,x1:n.x,y1:n.y}}function Xt(e,t){let a=-1;return Ha.forEach((o,n)=>{re[n]&&e>=o.x0&&e<=o.x1&&t>=o.y0&&t<=o.y1&&(a=n)}),a}var q=new O,qe=e=>{let t=z.getPixelRatio();return Math.round(e*t)/t};function Kt(e){q.set(-u.size/2,0,u.thick).applyMatrix4(e.mesh.matrixWorld);let t=Se(q.x,q.y,q.z);q.set(u.size/2,0,u.thick).applyMatrix4(e.mesh.matrixWorld);let o=Se(q.x,q.y,q.z).x-t.x;_e[e.i].style.transform=`translate3d(${qe(t.x+o*.1175)}px, ${qe(t.y-o*.025-35)}px, 0)`}function dn(e){return{...V(),lean:0,dx:-e.x,lift:ka-u.size/2-e.shelfY,z:Wt-u.thick/2}}function pn(){let e=Ut;je.style.top=`${qe(e-54.2)}px`,Ze.style.top=`${qe(e-13.6)}px`,ae.style.top=`${qe(e+Ot/2+16)}px`}var Xe=0,Ue=0,Be=!0,ne=!0,gt=null,Et=null,be=-1,D=-1,St=0,l=null,sa=-1,ia=!1,re=x.map(()=>!1),N={x:-1,y:-1},De={};De.ready=new Promise(e=>{De.resolve=e});var nr=De.ready;function T(){Xe||(Xe=requestAnimationFrame(xn))}function la(e,t){let a=u.size,o=u.thick;return{x:e.x+t.dx,y:e.shelfY+t.lift+a/2*Math.cos(t.lean),z:t.z-a/2*Math.sin(t.lean)+o/2}}function ca(e,t,a,o){let n=dt(t,a,o),r=u.size,f=la(e,t),s=la(e,a),i=B/(B-f.z),c=B/(B-s.z),p=i+(c-i)*o,d=(f.x*i+(s.x*c-f.x*i)*o)/p,h=(f.y*i+(s.y*c-f.y*i)*o)/p;return n.dx=d-e.x,n.lift=h-e.shelfY-r/2*Math.cos(n.lean),n.z=B*(1-1/p)+r/2*Math.sin(n.lean)-u.thick/2,n}var hn=e=>1-(1-e)**3,fa=e=>e*e*(3-2*e),ua=Math.PI*2;function mn(e,t){let a=G.fly,o=G.exit,n=G.flip,r=()=>l.flip.from+(l.flip.to-l.flip.from)*me(n.ease,C((t-l.flip.t0-H(n.at))/k(n.dur))),f,s;if(l.exit){let i=l.exit,c=t-i.t0,p=me(o.ease,C((c-H(o.at))/k(o.dur)));if(f=ca(e,i.from,{...m?y.pose(e):Ce(),yaw:i.yawTo},p),f.yaw=i.from.yaw+(i.yawTo-i.from.yaw)*me(o.turn.ease,C((c-H(o.turn.at))/k(o.turn.dur))),l.blur=i.blur*(1-fa(C((c-H(o.blurOut.at))/k(o.blurOut.dur)))),s=c<H(o.at)+k(o.dur)||l.blur>0,!s)return za(e,t),!0}else{let i=t-l.t0,c=me(a.ease,C((i-H(a.at))/k(a.dur)));f=ca(e,l.from,dn(e),c),f.yaw=r(),l.blur=m?0:fa(C((i-H(G.blur.at))/k(G.blur.dur)));let p=Math.max(...[a,G.blur,G.title].map(d=>H(d.at)+k(d.dur)));s=i<p||t-l.flip.t0<H(n.at)+k(n.dur)}return e.pose=f,s}var bt=!1;j.addEventListener("webglcontextlost",e=>{e.preventDefault(),!bt&&(bt=!0,Xe&&cancelAnimationFrame(Xe),l&&ro(),oo?.close(),import("./fallback.js").then(t=>t.start(I)))});function xn(e){if(Xe=0,bt)return;if(Y>=0){Ue=0;return}let t=Ue?Math.min(.05,(e-Ue)/1e3):0;Ue=e;let a=!1,o=Et===null?-1:e-Et,n=ia,r=m&&y.step(t);ia=r,r?Ie():n&&m&&(Ie(),wn());let f=l||m?-1:be;D!==f&&(l||e-St>=H(Uo))&&(D>=0&&!(l&&l.i===D)&&(x[D].fall={from:{...x[D].pose},t0:St}),D=f,D>=0&&(x[D].fall=null)),nn(l?l.i:D);let s=D!==f;for(let c of x){let p=!1;if(l&&c.i===l.i)p=mn(c,e);else if(re[c.i]){if(m)r&&(c.pose=y.pose(c),p=!0);else if(D===c.i)p=Yo(c,t);else if(c.fall){let d=No(c.fall.from,e-c.fall.t0);d?c.pose=d:(c.pose=V(),c.fall=null),p=!0}}else if(o>=0){let d=tn(c.i,o);if(d!==null){let h=m?yn(c,o-d):qo(c.i,o-d);h?c.pose=h:(c.pose=qt(c),re[c.i]=!0)}p=!0}if(p){ce(c),m||Kt(c);let d=!m&&c.pose.z<270;(d||c.shaded)&&(Be=!0),c.shaded=d,(!l||c.i!==l.i)&&(ne=!0),a=!0}}Be&&(Oo(x,ue,m),vt.bake(),Be=!1,ne=!0),m&&wt.setOpacity(o<0||fe[0]===null?0:C((o-fe[0])/k(600))),pt&&(Ye.mesh.layers.set(l&&l.i===pt.i?yt:0),Ye.place(pt,wa?0:pt.pose.opacity));let i=We>=0||e<Ma;if(i&&!window.__editionsTest?.stillCovers)for(let c of de)c?.update(t);if(l){let c=x[l.i],p=G.blur.sigma*l.blur;(ne||p!==sa)&&(R.layers.set(0),Ne.background($,R,p),ne=!1,sa=p),Ne.composite(Math.min(1,l.blur*4)),R.layers.set(yt),z.autoClear=!1,z.clearDepth(),z.render($,R),z.autoClear=!0,R.layers.set(0)}else ht&&(ht.draw(),ht=null),z.render($,R);xt.firstFrameAt===null&&(xt.firstFrameAt=performance.now(),vn(xt.firstFrameAt),De.resolve(),a=!0),!It&&!a&&en(),a||s||i||r?T():Ue=0}function da(e){if(!CSS.supports("animation-timing-function","linear(0, 1)"))return"cubic-bezier(0.16, 1, 0.3, 1)";let t=24,a=[],o=1-Math.exp(-1/e);for(let n=0;n<=t;n++)a.push(((1-Math.exp(-(n/t)/e))/o).toFixed(4));return`linear(${a.join(", ")})`}function vn(e){gt=e,Et=window.__editionsTest?.noSleeves?null:e,j.animate([{opacity:0},{opacity:1}],{duration:k(M.canvasFade.dur),easing:M.canvasFade.ease,fill:"forwards"});let t=M.header,a=k(t.tau*5);document.querySelectorAll(".rise").forEach((n,r)=>n.animate([{opacity:0,transform:`translateY(${-t.rise}px)`},{opacity:1,transform:"none"}],{duration:a,delay:H(t.at+t.stagger*r),easing:da(.2),fill:"forwards"}));let o=M.late;document.querySelectorAll(".late").forEach(n=>n.animate([{opacity:0},{opacity:1}],{duration:k(o.tau*5),delay:H(o.at),easing:da(.2),fill:"forwards"}))}function Ke(){let e=l?-1:be;_e.forEach((t,a)=>t.classList.toggle("hot",a===e)),j.style.cursor=l?Qt()?"pointer":"":be>=0?"pointer":""}function Me(e,t=!1){e!==be&&(be=e,St=performance.now(),Ke(),e>=0&&!l&&(t||X("hover",{pan:Ee(e)}),X("lift",{pan:Ee(e),intensity:.8})),T())}function Qt(){if(!l)return!1;let e=Zt(l.i);return N.x>=e.x&&N.x<=e.x+e.width&&N.y>=e.y&&N.y<=e.y+e.height}var Re=-1;window.addEventListener("pointermove",e=>{if(e.pointerType==="touch"||m)return;if(N.x=e.clientX,N.y=e.clientY,l){Ke();return}let t=e.target.closest?.(".pm")?-1:Xt(e.clientX,e.clientY);t!==Re&&(Re=t,Me(t))});document.documentElement.addEventListener("pointerleave",()=>{Re=-1,Me(-1)});window.addEventListener("blur",()=>{Re=-1,Me(-1)});window.addEventListener("resize",jt);j.addEventListener("click",e=>{if(m)return;if(N.x=e.clientX,N.y=e.clientY,l){if(l.exit)return;Qt()?to():Tt();return}let t=Xt(e.clientX,e.clientY);t>=0&&eo(t)});function yn(e,t){let a=C((t-H(M.appear.at+M.appear.stagger*e.i))/k(360));if(a>=1)return null;let o=y.pose(e);return o.opacity=a,le()||(o.lift+=(1-hn(a))*40/Z),o}var pa=-1,ha=0;function Ie(e=!1){if(!m)return;let t=x.length,a=y.current,o=I[a],n=Ft.parentElement.clientHeight-Ft.offsetHeight;if(Ft.style.transform=`translateY(${((1-C(y.p/Math.max(1,t-1)))*n).toFixed(1)}px)`,!(a===pa&&!e)){pa=a,rn.textContent=o.year||"",sn.textContent=o.name;for(let[r,f]of[[ln,"Details"],[cn,"Open"]])r.dataset.index=String(a),r.setAttribute("aria-label",`${f}: ${o.name}`)}}function wn(){let e=y.current;e!==ha&&(ha=e,tt(`${I[e].name}, ${e+1} of ${x.length}`))}function gn(e,t){let a=Math.round(y.p),o=[];for(let n=0;n<a;n++)o.push(n);for(let n=a;n<x.length;n++)o.push(n);for(let n of o){if(!re[n])continue;let r=Zt(n);if(e>=r.x&&e<=r.x+r.width&&t>=r.y&&t<=r.y+r.height)return n}return-1}var we=null;j.addEventListener("pointerdown",e=>{!m||Y>=0||!e.isPrimary||(we={x:e.clientX,y:e.clientY,id:e.pointerId},j.setPointerCapture(e.pointerId),l||(y.begin(e.clientY,e.timeStamp),T()))});j.addEventListener("pointermove",e=>{!we||e.pointerId!==we.id||l||(y.move(e.clientY,e.timeStamp),Ie(),T())});var Jt=e=>t=>{if(!we||t.pointerId!==we.id)return;let{x:a,y:o}=we;we=null;let n=Math.hypot(t.clientX-a,t.clientY-o);if(e){y.cancel(),T();return}if(l||y.end(t.timeStamp),T(),n>=8)return;if(N.x=t.clientX,N.y=t.clientY,l){if(l.exit)return;Qt()?to():Tt();return}let r=gn(t.clientX,t.clientY);r<0||(r===y.current&&Math.abs(y.p-r)<.05?eo(r):(y.go(r),X("tick")))};j.addEventListener("pointerup",Jt(!1));j.addEventListener("pointercancel",Jt(!0));j.addEventListener("lostpointercapture",Jt(!0));var ma=0;window.addEventListener("wheel",e=>{!m||l||Y>=0||(e.preventDefault(),e.timeStamp-ma>200&&y.wheel(0),ma=e.timeStamp,y.wheel(e.deltaY),T())},{passive:!1});et.querySelector(".cb-back").addEventListener("click",()=>Tt());function eo(e){if(l||!re[e])return;let t=x[e],a=performance.now();t.fall=null,m&&y.go(e);let o=Qe(document.activeElement)===e?document.activeElement:null;l={i:e,t0:a,from:{...t.pose},flip:{from:0,to:0,t0:-1e9},exit:null,blur:0,ret:o},t.mesh.layers.set(yt),ne=!0,Ja(e),je.textContent=t.entry.name,Ze.textContent=t.entry.tag,ae.dataset.index=String(e),ae.setAttribute("aria-label",`Open: ${t.entry.name}`),Ge.inert=!1,ae.inert=!1,Je.inert=!0,document.body.classList.add("in-details");let n=G;Fe(Mt,0,n.headerOut.at,n.headerOut.dur);for(let r of[je,Ze])Fe(r,1,n.title.at,n.title.dur);Fe(ae,1,n.open.at,n.open.dur),Ge.focus({preventScroll:!0}),X("details",{pan:Ee(e)}),tt(t.entry.tag?`Details: ${t.entry.name}. ${t.entry.tag}`:`Details: ${t.entry.name}`),Ke(),T()}function to(){if(!l||l.exit)return;let e=performance.now(),t=G.flip,a=l.flip,o=a.from+(a.to-a.from)*me(t.ease,C((e-a.t0-H(t.at))/k(t.dur)));l.flip={from:o,to:a.to+Math.PI,t0:e},X("flip"),tt(Math.round(l.flip.to/Math.PI)%2?"Back of the sleeve":"Front of the sleeve"),T()}function Tt(){if(!l||l.exit)return;let e=x[l.i],t=performance.now(),a=G.exit;l.exit={t0:t,from:{...e.pose},yawTo:Math.ceil(e.pose.yaw/ua-1e-6)*ua,blur:l.blur};for(let o of[je,Ze,ae])Fe(o,0,a.at,a.textOut);Fe(Mt,1,a.headerIn.at,a.headerIn.dur),Ge.inert=!0,ae.inert=!0,X("close",{pan:Ee(l.i)}),tt("Back to the shelf"),T()}function za(e,t,a=!1){let{i:o}=l,n=a?null:l.ret;if(l=null,an(e),e.pose=m?y.pose(e):Ce(),ce(e),e.mesh.layers.set(0),ne=Be=!0,Je.inert=!1,document.body.classList.remove("in-details"),m){n&&n.isConnected&&n.focus({preventScroll:!0}),Ie(!0),Ke();return}Re=a?-1:Xt(N.x,N.y),be=Re,St=t,n&&n.isConnected&&n.focus({preventScroll:!0}),D=be===o?o:-1,D!==o&&(e.fall={from:Ce(),t0:t}),Kt(e),Ke()}var oo=null,xa=null,Y=-1,Rt=!1,mt=0,ao=()=>xa||(xa=import("./project-NDV3PKIG.js").then(e=>oo=e.createProjectView({renderer:z,entries:I,slugOf:he,onBack:Sn})));function En(e){X("open",{pan:l?0:Ee(e)}),ao(),I[e].kind!=="about"&&import("./project-NDV3PKIG.js").then(t=>t.loadDossier(he(I[e]))),Rt=!0,mt=Ho.cut,tt(`Open: ${I[e].name}`),location.hash=he(I[e])}async function no(){if(bt)return;let e=decodeURIComponent(location.hash.slice(1)),t=I.findIndex(a=>he(a)===e);if(t>=0){if(t===Y)return;let a=await ao();if(I.findIndex(o=>he(o)===decodeURIComponent(location.hash.slice(1)))!==t||t===Y)return;l&&ro(!0),Me(-1),Y=t;for(let o of j.getAnimations())o.finish();J?.setRoomTone(!1),mt||X("open"),await a.open(t,{cutAfter:mt}),mt=0}else if(Y>=0){let a=Y;if(Y=-1,oo?.close(),J?.setRoomTone(!0),X("close",{pan:Ee(a)}),jt(),m){y.jump(a);for(let o of x)re[o.i]&&(o.pose=y.pose(o),ce(o));Ie(!0)}Be=ne=!0,_e[a].querySelector('[data-action="open"]').focus({preventScroll:!0}),T()}}function Sn(){Rt?(Rt=!1,history.back()):(history.pushState(null,"",location.pathname+location.search),no())}window.addEventListener("hashchange",()=>{location.hash||(Rt=!1),no()});function ro(e=!1){let t=x[l.i];for(let a of[je,Ze,ae])for(let o of a.getAnimations())o.cancel();Fe(Mt,1,0,1),Ge.inert=!0,ae.inert=!0,za(t,performance.now(),e),t.fall=null,D=-1}document.addEventListener("click",e=>{let t=e.target.closest("button[data-action]");if(!t)return;let a=+t.dataset.index;t.dataset.action==="details"?eo(a):En(a)});var Qe=e=>e&&e.closest&&e.closest(".slot")?_e.indexOf(e.closest(".slot")):-1;Je.addEventListener("focusin",e=>{let t=Qe(e.target);if(!(t<0)){if(m){l||(y.go(t),T());return}Me(t,!0)}});Je.addEventListener("focusout",e=>{Qe(e.relatedTarget)>=0||l||Me(Re)});window.addEventListener("keydown",e=>{if(e.metaKey||e.ctrlKey||e.altKey||Y>=0)return;if(l){e.key==="Escape"?(e.preventDefault(),Tt()):(e.key===" "||e.code==="Space")&&(e.preventDefault(),e.repeat||to());return}if(m){let r={ArrowLeft:-1,ArrowUp:-1,ArrowRight:1,ArrowDown:1}[e.key];if(r===void 0)return;e.preventDefault();let f=Math.max(0,Math.min(x.length-1,y.current+r));if(f===y.current)return;y.go(f),Qe(document.activeElement)>=0&&_e[f].querySelector(`[data-action="${document.activeElement.dataset.action}"]`).focus({preventScroll:!0}),X("tick"),T();return}let t={ArrowLeft:-1,ArrowRight:1,ArrowUp:-u.cols,ArrowDown:u.cols}[e.key];if(t===void 0)return;e.preventDefault();let a=Qe(document.activeElement),o=a<0?0:Math.max(0,Math.min(x.length-1,a+t));if(o===a)return;let n=document.activeElement?.dataset?.action==="open"?"open":"details";_e[o].querySelector(`[data-action="${n}"]`).focus({preventScroll:!0}),X("tick",{pan:Ee(o)})});window.addEventListener("keyup",e=>{l&&(e.key===" "||e.code==="Space")&&e.preventDefault()});var so=window.matchMedia("(prefers-reduced-motion: reduce)");it(so.matches);y.setReduced(so.matches);so.addEventListener?.("change",e=>{it(e.matches),y.setReduced(e.matches)});var xt={count:x.length,firstFrameAt:null,ready:De.ready,covers:Qa,sleeveRect:Zt,frontCorners(e){let t=x[e].mesh.matrixWorld,a=u.size;return[[-a/2,0],[a/2,0],[a/2,a],[-a/2,a]].map(([o,n])=>(q.set(o,n,u.thick).applyMatrix4(t),Se(q.x,q.y,q.z)))},setCover(e,t,a){zt(x[e],t,a),T()},get project(){return Y>=0?he(I[Y]):null},get sleevesAt(){return Et},coverReadyAt:ga,appearAt:fe,get crate(){return m?{p:y.p,current:y.current,dragging:y.dragging}:null},set stickerOff(e){wa=!!e,T()},get details(){return l?{index:l.i,flipped:Math.round(l.flip.to/Math.PI)%2===1,closing:!!l.exit,blur:l.blur,yaw:x[l.i].pose.yaw}:null}};window.__editions=xt;jt();for(let e of x)e.mesh.visible=!0;Ye.mesh.visible=!0;for(let e of[!0,!1]){for(let t of x)for(let a of[t.front,t.back,t.mats[0]])a.transparent=e,a.needsUpdate=!0;for(let t of[0,yt])R.layers.set(t),z.render($,R);R.layers.enableAll(),z.render($,R),R.layers.set(0),Ne.background($,R,1),Ne.composite(.5)}for(let e of x)ce(e);Ye.mesh.visible=!1;ne=!0;De.ready.then(()=>{location.hash&&no()});export{nr as drawn};
