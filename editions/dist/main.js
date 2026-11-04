import{A as b,B as rt,C as X,D as it,E as xo,F as ie,G as vo,H as yo,I as wo,J as go,K as Eo,L as te,M as oe,N as So,O as bo,Q as Ro,R as Mo,S as To,a as lo,b as co,e as He,i as ot,j as fo,l as he,m as uo,n as at,o as ee,p as po,q as O,s as U,t as Ae,u as ho,v as re,w as mo,x as nt}from"./chunk-CBEJLKG4.js";import{a as C,b as st,c as le,d as k,e as H,f as me}from"./chunk-U3AZOSC6.js";import{a as kt,b as ko,c as se,e as u,f as L,g as Ho,h as G,i as M,j as Ao}from"./chunk-OOBDN6GE.js";var lt=class extends ie{constructor(){super();let t=new rt;t.deleteAttribute("uv");let o=new oe({side:lo}),a=new oe,n=new bo(16777215,900,28,2);n.position.set(.418,16.199,.3),this.add(n);let r=new b(t,o);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let c=new yo(t,a,6),i=new mo;i.position.set(-10.906,2.009,1.846),i.rotation.set(0,-.195,0),i.scale.set(2.328,7.905,4.651),i.updateMatrix(),c.setMatrixAt(0,i.matrix),i.position.set(-5.607,-.754,-.758),i.rotation.set(0,.994,0),i.scale.set(1.97,1.534,3.955),i.updateMatrix(),c.setMatrixAt(1,i.matrix),i.position.set(6.167,.857,7.803),i.rotation.set(0,.561,0),i.scale.set(3.927,6.285,3.687),i.updateMatrix(),c.setMatrixAt(2,i.matrix),i.position.set(-2.017,.018,6.124),i.rotation.set(0,.333,0),i.scale.set(2.002,4.566,2.064),i.updateMatrix(),c.setMatrixAt(3,i.matrix),i.position.set(2.291,-.756,-2.621),i.rotation.set(0,-.286,0),i.scale.set(1.546,1.552,1.496),i.updateMatrix(),c.setMatrixAt(4,i.matrix),i.position.set(-2.193,-.369,-5.547),i.rotation.set(0,.516,0),i.scale.set(3.875,3.487,2.986),i.updateMatrix(),c.setMatrixAt(5,i.matrix),this.add(c);let s=new b(t,ze(50));s.position.set(-16.116,14.37,8.208),s.scale.set(.1,2.428,2.739),this.add(s);let f=new b(t,ze(50));f.position.set(-16.109,18.021,-8.207),f.scale.set(.1,2.425,2.751),this.add(f);let p=new b(t,ze(17));p.position.set(14.904,12.198,-1.832),p.scale.set(.15,4.265,6.331),this.add(p);let d=new b(t,ze(43));d.position.set(-.462,8.89,14.52),d.scale.set(4.38,5.441,.088),this.add(d);let h=new b(t,ze(20));h.position.set(3.235,11.486,-12.541),h.scale.set(2.5,2,.1),this.add(h);let v=new b(t,ze(100));v.position.set(0,20,0),v.scale.set(1,.1,1),this.add(v)}dispose(){let t=new Set;this.traverse(o=>{o.isMesh&&(t.add(o.geometry),t.add(o.material))});for(let o of t)o.dispose()}};function ze(e){return new So({color:0,emissive:16777215,emissiveIntensity:e})}var Ba=u.hoverLift.toFixed(2),Q=u.cols,zo=(u.pitch/2).toFixed(2),_a={key:{rect:[1148.801,12.997,8768.289,3472.806],z:994.831,power:2.322},fill:{rect:[-2516.226,-9815.124,2516.226,10070.146],z:573.364,power:1.474},shelfAlbedo:1.219,shelfAmbient:.383,contact:{strength:.332,reach:19.033},keyMix:.571,base:{centre:.614,edge:.752,cy:-293.494,rx:806.633,ry:309.574,pow:.304},edgeShade:{strength:.989,reach:5.54},liftShade:{strength:.5,reach:8},halo:{right:.4,left:.383,top:.056,rise:.308,fall:60.395,row2:.724,vfall:10,drop:.881,dropReach:31.417},glow:{strength:.2,fall:100,side:60,fade:24.653,width:1100}},Le=4*Q;function Lo(){return{uLightRect:{value:[new U,new U]},uLightZ:{value:[0,0]},uLightPower:{value:[0,0]},uShelf:{value:[new U,new U]},uShelfDepth:{value:0},uSlab:{value:Array.from({length:Le},()=>new U(0,0,0,0))},uSlabZ:{value:new Array(Le).fill(1)},uSlabA:{value:new Array(Le).fill(0)},uFoot:{value:Array.from({length:2*Q},()=>new U(0,0,0,1e3))},uShelfAlbedo:{value:1},uShelfAmbient:{value:0},uContact:{value:new ee},uHalo:{value:new O},uHaloShape:{value:new U},uHaloDrop:{value:new ee},uGlow:{value:new U},uGlowWidth:{value:1e4},uEdgeShade:{value:new U},uKeyMix:{value:.5},uBase:{value:new O},uBaseShape:{value:new O}}}function Co(e,t=_a){[t.key,t.fill].forEach((o,a)=>{e.uLightRect.value[a].set(...o.rect),e.uLightZ.value[a]=o.z,e.uLightPower.value[a]=o.power}),e.uShelfAlbedo.value=t.shelfAlbedo,e.uShelfAmbient.value=t.shelfAmbient,e.uContact.value.set(t.contact.strength,t.contact.reach),e.uHalo.value.set(t.halo.right,t.halo.left,t.halo.top),e.uHaloShape.value.set(t.halo.rise,t.halo.fall,t.halo.row2,t.halo.vfall),e.uHaloDrop.value.set(t.halo.drop,t.halo.dropReach),e.uGlow.value.set(t.glow.strength,t.glow.fall,t.glow.side,t.glow.fade),e.uGlowWidth.value=t.glow.width,e.uEdgeShade.value.set(t.edgeShade.strength,t.edgeShade.reach,t.liftShade.strength,t.liftShade.reach),e.uKeyMix.value=t.keyMix,e.uBase.value.set(t.base.centre,t.base.edge,t.base.cy),e.uBaseShape.value.set(t.base.rx,t.base.ry,t.base.pow)}var ct=`
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
    float lift = clamp(uFoot[row * ${Q} + k].w / ${Ba}, 0.0, 1.0);
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
`;var Da=`
out vec2 vWorld;
uniform vec4 uRegion; // world x0, y0, x1, y1 covered by the texture
void main() {
  vWorld = mix(uRegion.xy, uRegion.zw, uv);
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`,Ga=`
precision highp float;
in vec2 vWorld;
out vec4 outColor;
${ct}
void main() {
  int row = rowAt(vWorld.y);
  float seen = mix(wallLight(1, vWorld, row), wallLight(0, vWorld, row), uKeyMix);
  float e = wallBase(vWorld) * seen * edgeShade(vWorld, row) + haloAt(vWorld, row);
  outColor = vec4(vec3(e), 1.0);
}`,Ia=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,Va=`
uniform sampler2D uBake;
uniform float uGain;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(uBake, vUv).rgb * uGain;
  gl_FragColor = vec4(c, 1.0);
  #include <colorspace_fragment>
  float n = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  gl_FragColor.rgb += (n - 0.5) / 255.0;
}`;function Po(e,t){let o=new Ae(4,4,{type:ot,format:fo,depthBuffer:!1,minFilter:He,magFilter:He,generateMipmaps:!1}),a=new X({glslVersion:uo,uniforms:{...t,uRegion:{value:new U}},vertexShader:Da,fragmentShader:Ga,depthTest:!1,depthWrite:!1}),n=new ie;n.add(new b(new te(2,2),a));let r=new it,c=new X({uniforms:{uBake:{value:o.texture},uGain:{value:1}},vertexShader:Ia,fragmentShader:Va,toneMapped:!1}),i=new b(new te(1,1),c);return i.renderOrder=-1,{mesh:i,resize(s,f,p,d,h,v,z=null){o.setSize(h,v),a.uniforms.uRegion.value.set(...z||[s,f,p,d]),i.scale.set(p-s,d-f,1),i.position.set((s+p)/2,(f+d)/2,0),i.updateMatrixWorld()},setGain(s){c.uniforms.uGain.value=s},bake(){let s=e.getRenderTarget();e.setRenderTarget(o),e.render(n,r),e.setRenderTarget(s)},dispose(){o.dispose(),a.dispose(),c.dispose(),i.geometry.dispose()}}}function $a(){let{width:e,depth:t,thick:o,bevel:a}=L,n=new go;n.moveTo(0,-o),n.lineTo(t-a,-o),n.absarc(t-a,-o+a,a,-Math.PI/2,0,!1),n.lineTo(t,-a),n.absarc(t-a,-a,a,0,Math.PI/2,!1),n.lineTo(0,0),n.closePath();let r=new Eo(n,{depth:e,bevelEnabled:!1,curveSegments:6});return r.applyMatrix4(new re().set(0,0,-1,e/2,0,1,0,0,1,0,0,0,0,0,0,1)),r.computeVertexNormals(),r}var Oa=`
varying vec3 vPos;
varying vec3 vNormal;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vPos = w.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Ua=`
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
}`;function Fo(e){let t=$a();return L.tops.map((o,a)=>{let n=new X({uniforms:{...e,uRow:{value:a}},vertexShader:Oa,fragmentShader:Ua,toneMapped:!1}),r=new b(t,n);return r.position.set(0,o,0),r.updateMatrixWorld(),r})}var Bo=`
vec3 njNeutral(vec3 c) {
  const float start = 0.76, desat = 0.15;
  float x = min(c.r, min(c.g, c.b));
  c -= x < 0.08 ? x - 6.25 * x * x : 0.04;
  float peak = max(c.r, max(c.g, c.b));
  if (peak < start) return c;
  float d = 1.0 - start, np = 1.0 - d * d / (peak + d - start);
  c *= np / peak;
  return mix(c, vec3(np), 1.0 - 1.0 / (desat * (peak - np) + 1.0));
}`;var W=u.size,ft=W*Math.sin(u.lean),$o={dx:0,yaw:0,opacity:1},V=()=>({...$o,lift:0,z:ft,lean:u.lean}),Ce=()=>({...$o,lift:u.hoverLift,z:u.hoverZ,lean:0}),Ht=["lift","z","lean","dx","yaw"],Wa="#d9d6d0";function $e(e,t=null){return e.onBeforeCompile=o=>{o.fragmentShader=o.fragmentShader.replace("void main() {",`${Bo}
${t?`uniform float uMapBias;
`:""}void main() {`).replace("#include <tonemapping_fragment>","gl_FragColor.rgb = njNeutral(gl_FragColor.rgb);"),t&&(o.uniforms.uMapBias=t,o.fragmentShader=o.fragmentShader.replace("#include <map_fragment>",Ro.map_fragment.replace("texture2D( map, vMapUv )","texture2D( map, vMapUv, uMapBias )")))},e.customProgramCacheKey=()=>t?"nj-neutral-bias":"nj-neutral",e}var Oe={value:0};function Oo(e){let t=new rt(W,W,u.thick);return t.translate(0,W/2,u.thick/2),e.map((o,a)=>{let n=$e(new oe({color:15855594,roughness:.8})),r=a%u.cols,c=Math.floor(a/u.cols),i=Math.min(u.cols,e.length-c*u.cols),s=$e(new oe({color:new nt(o.accent?.light||Wa),roughness:.8}),Oe),f=$e(new oe({color:15328992,roughness:.7})),p=[n,n,n,n,s,f],d=new b(t,p);d.matrixAutoUpdate=!1;let h={i:a,row:c,col:r,mesh:d,front:s,back:f,mats:p,entry:o,x:(r-(i-1)/2)*u.pitch,shelfY:L.tops[c],pose:{...V(),opacity:0}};return ce(h),h})}var _o=new po,qa=new O(1,0,0),Do=new O,Ya=new O(1,1,1),ve=new O,Go=new re,Io=new re,Vo=new re;function ce(e){let t=e.pose;Do.set(e.x+t.dx,e.shelfY+t.lift,t.z),_o.setFromAxisAngle(qa,-t.lean),e.mesh.matrix.compose(Do,_o,Ya),t.yaw&&(ve.set(0,W/2,u.thick/2).applyMatrix4(e.mesh.matrix),Io.makeTranslation(ve.x,ve.y,ve.z),Vo.makeTranslation(-ve.x,-ve.y,-ve.z),Go.makeRotationY(t.yaw),e.mesh.matrix.premultiply(Vo).premultiply(Go).premultiply(Io)),e.mesh.matrixWorld.copy(e.mesh.matrix),e.mesh.visible=t.opacity>.001;let o=t.opacity<.999;for(let a of[e.front,e.back,e.mats[0]])a.transparent!==o&&(a.transparent=o,a.needsUpdate=!0),a.opacity=t.opacity}function Uo(e,t,o=!1){for(let a of e){let n=a.pose,r=Math.cos(n.lean),c=Math.sin(n.lean),i=a.shelfY+n.lift,s=u.thick/2,f=a.x+n.dx,p=at.smoothstep(n.z,110,260),d=a.mesh.visible&&!o?n.opacity*(1-p):0,h=(a.row*u.cols+a.col)*2;for(let v=0;v<2;v++){let z=v/2,Te=(v+1)/2;d>0?t.uSlab.value[h+v].set(f-W/2,i+W*z*r,f+W/2,i+W*Te*r):t.uSlab.value[h+v].set(0,0,0,0),t.uSlabZ.value[h+v]=Math.max(1.5,n.z-W*(z+Te)/2*c+s),t.uSlabA.value[h+v]=d}t.uFoot.value[a.i].set(f-W/2,f+W/2,n.z+u.thick,d>0?n.lift:1e3)}}function At(e,t,o){t&&(e.front.map=t,e.front.color.set(16777215),e.front.needsUpdate=!0),o&&(e.back.map=o,e.back.color.set(16777215),e.back.needsUpdate=!0)}var Wo=15,ut=e=>e*e,dt=(e,t,o)=>{let a={...t};for(let n of Ht)a[n]=e[n]+(t[n]-e[n])*o;return a.opacity=e.opacity+(t.opacity-e.opacity)*o,a};function qo(e){let t=M.appear.at+M.appear.stagger*e,o=M.drop.at+M.drop.stagger*e,a=o+M.drop.dur,n=a+M.lean.delay;return{appear:t,drop:o,land:a,lean:n,rest:n+M.lean.dur}}var zt=e=>le()?200+40*e:qo(e).appear;function Yo(e,t){if(le()){let i=zt(e);return t>=i+160?null:{...V(),opacity:C((t-i)/160)}}let o=qo(e);if(t>=o.rest)return null;if(t<o.appear)return{...V(),opacity:0};let a=M.appearPose,n=1-.345*Math.exp(-(t-o.appear)/150),r={...V(),lift:a.lift,z:a.z,lean:0,opacity:n};if(t<o.drop)return r;if(t<o.land){let i=ut(C((t-o.drop)/M.drop.dur));return{...r,lift:a.lift*(1-i),z:a.z+(ft-a.z)*i}}let c=ut(C((t-o.lean)/M.lean.dur));return{...r,lift:0,z:ft,lean:u.lean*c}}function No(e,t){let o=Ce(),a=1-Math.exp(-t/(le()?.04:u.hoverTau)),n=!1;for(let r of Ht){let c=o[r]-e.pose[r];Math.abs(c)>.001?(e.pose[r]+=c*a,n=!0):e.pose[r]=o[r]}return e.pose.opacity=1,n}function jo(e,t){let o=le()?{delay:0,drop:90,pause:0,lean:60}:Ho,a=V();if(t<o.delay)return{...e};let n=t-o.delay,r={...a,lean:Math.min(e.lean,a.lean)};if(n<o.drop)return dt(e,r,ut(n/o.drop));let c=n-o.drop-o.pause;return c<0?r:c<o.lean?dt(r,a,ut(c/o.lean)):null}var Ko=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,Na=`
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
}`,ja=`
uniform sampler2D uSharp;
uniform sampler2D uBlur;
uniform float uMix;
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(mix(texture2D(uSharp, vUv).rgb, texture2D(uBlur, vUv).rgb, uMix), 1.0);
  #include <colorspace_fragment>
}`;function Zo(e){let t=new Ae(4,4,{samples:4,colorSpace:he}),o={type:ot,depthBuffer:!1,minFilter:He,magFilter:He},a=new Ae(4,4,o),n=new Ae(4,4,o),r=new X({uniforms:{uTex:{value:null},uDir:{value:new ee},uSigma:{value:0}},vertexShader:Ko,fragmentShader:Na,depthTest:!1,depthWrite:!1}),c=new X({uniforms:{uSharp:{value:t.texture},uBlur:{value:a.texture},uMix:{value:0}},vertexShader:Ko,fragmentShader:ja,depthTest:!1,depthWrite:!1}),i=new b(new te(2,2),r);i.frustumCulled=!1;let s=new ie;s.add(i);let f=new it,p=.5,d=(h,v)=>{i.material=h,e.setRenderTarget(v),e.render(s,f)};return{resize(h,v){t.setSize(h,v),a.setSize(Math.ceil(h/2),Math.ceil(v/2)),n.setSize(Math.ceil(h/2),Math.ceil(v/2)),p=e.getPixelRatio()/2},background(h,v,z){let Te=e.getRenderTarget();e.setRenderTarget(t),e.clear(),e.render(h,v);let Ve=z*p;r.uniforms.uSigma.value=Ve,r.uniforms.uTex.value=t.texture,r.uniforms.uDir.value.set(1/a.width,0),d(r,n),r.uniforms.uTex.value=n.texture,r.uniforms.uDir.value.set(0,1/a.height),d(r,a),e.setRenderTarget(Te)},composite(h){c.uniforms.uMix.value=h,d(c,null)},dispose(){t.dispose(),a.dispose(),n.dispose(),r.dispose(),c.dispose()}}}var Ct=u.size,Xo=.255*Ct,Lt={x:.3245*Ct,y:.8255*Ct,z:u.thick+.25};function Ka(e){let o=document.createElement("canvas");o.width=o.height=512;let a=o.getContext("2d"),n=512/2,r=512*.44,c=11;a.beginPath();for(let d=0;d<=720;d++){let h=d/720*Math.PI*2,v=r*(1+.065*Math.cos(c*h));a.lineTo(n+v*Math.cos(h),n+v*Math.sin(h))}a.closePath(),a.save(),a.clip();let i=a.createConicGradient?a.createConicGradient(.6,n,n):a.createLinearGradient(0,0,512,512);["#ffa6e6","#9af2dc","#c4b2ff","#ffe596","#9fd6ff","#ffb8dc","#ffa6e6"].forEach((d,h,v)=>i.addColorStop(h/(v.length-1),d)),a.fillStyle=i,a.fillRect(0,0,512,512),[[.3,.3,"#9af2dc"],[.7,.62,"#ffa6e6"],[.42,.72,"#ffe596"],[.68,.28,"#c4b2ff"],[.25,.58,"#ffb8dc"]].forEach(([d,h,v])=>{let z=a.createRadialGradient(d*512,h*512,0,d*512,h*512,102.4);z.addColorStop(0,v+"cc"),z.addColorStop(1,v+"00"),a.fillStyle=z,a.fillRect(0,0,512,512)});let s=a.createRadialGradient(n*.8,n*.7,0,n*.8,n*.7,512*.55);s.addColorStop(0,"rgba(255,255,255,0.75)"),s.addColorStop(1,"rgba(255,255,255,0)"),a.fillStyle=s,a.fillRect(0,0,512,512),a.restore(),a.translate(n,n),a.rotate(12*Math.PI/180),a.fillStyle="#000",a.textAlign="center",a.textBaseline="alphabetic",a.font=`800 ${512*.15}px 'NJ Text', system-ui, sans-serif`;let f=512*.15;e.forEach((d,h)=>a.fillText(d,0,(h-(e.length-1)/2)*f+512*.055));let p=new wo(o);return p.colorSpace=he,p.anisotropy=4,p}var Qo=new nt().setRGB(1,.96,1);function Jo(e){let t=Ka(e.toUpperCase().split(" ")),o=$e(new oe({map:t,emissiveMap:t,color:Qo,emissive:Qo,emissiveIntensity:.5,transparent:!0,roughness:.8,metalness:0,depthWrite:!1}),Oe),a=new b(new te(Xo,Xo),o);a.matrixAutoUpdate=!1,a.visible=!1,a.renderOrder=1;let n=new re().makeTranslation(Lt.x,Lt.y,Lt.z);return{mesh:a,place(r,c){a.visible=c>.002&&r.mesh.visible,a.visible&&(o.opacity=c,a.matrix.multiplyMatrices(r.mesh.matrix,n),a.matrixWorld.copy(a.matrix))}}}var w={width:.682,bottom:.797,lean:56*Math.PI/180,strip:.124,top:132,flatLean:78*Math.PI/180,flatStrip:.07,flatMax:4,drag:150,carry:.06,omega:8.5,details:{size:.815,centreY:.404},wheelNotch:60,groundGain:.838,edgeColour:1842204,shadow:{y0:.403,y1:.794,alpha:.054,feather:20}};function ea(){let e=new X({uniforms:{uSize:{value:new ee(1,1)},uFeather:{value:1},uAlpha:{value:w.shadow.alpha}},vertexShader:"varying vec2 vP; uniform vec2 uSize; void main() { vP = uv * uSize; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`varying vec2 vP; uniform vec2 uSize; uniform float uFeather, uAlpha;
      void main() { float d = min(vP.y, uSize.y - vP.y);   // soft top and bottom; it runs off the left edge and under the crate
        gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha * smoothstep(0.0, uFeather, d)); }`,transparent:!0,depthWrite:!1,toneMapped:!1}),t=new b(new te(1,1),e);return t.renderOrder=-.5,t.visible=!1,{mesh:t,setOpacity(o){e.uniforms.uAlpha.value=w.shadow.alpha*o},layout(o,a,n){let r=-o/2/n-2,c=0,i=(a/2-w.shadow.y1*a)/n,s=(a/2-w.shadow.y0*a)/n;t.scale.set(c-r,s-i,1),t.position.set((r+c)/2,(i+s)/2,.5),t.updateMatrixWorld(),e.uniforms.uSize.value.set(c-r,s-i),e.uniforms.uFeather.value=w.shadow.feather/n}}}function ta(e){let t=u.size,o=0,a=0,n=0,r=null,c=0,i=!1,s=0,f=0,p=0,d=0,h=0,v=1,z=g=>Math.max(0,Math.min(e-1,g));function Te(g,E,S){let D=w.width*g/t;s=(E/2-w.bottom*E)/D;let ke=w.bottom*E-t*D*Math.cos(w.lean);return f=Math.min(w.strip*t,e>1?Math.max(0,ke-w.top)/(e-1)/D:0),p=f*Math.tan(w.lean)+4,d=w.flatStrip*t,h=(e-1)*p+t*Math.sin(w.lean)+10,v=D*(S-h)/S,v}let Ve=g=>d*w.flatMax*(1-Math.exp(-g/w.flatMax));function Ca(g){let E=g.i-o,S=V();if(S.dx=-g.x,E>=0)S.lean=w.lean,S.lift=s+E*f-g.shelfY,S.z=h-E*p;else{let D=-E,ke=Math.min(1,D);S.lean=w.lean+(w.flatLean-w.lean)*ke,S.lift=s-Ve(D)-g.shelfY,S.z=h+.8*t*ke+5*Math.max(0,Ve(D)-Ve(1))}return S}function Pa(g){if(r)return!0;let E=i?30:w.omega,S=E*E*(n-o)-2*E*a;return a+=S*g,o+=a*g,Math.abs(n-o)<.001&&Math.abs(a)<.01?(o=n,a=0,!1):!0}return{layout:Te,pose:Ca,step:Pa,get p(){return o},get current(){return z(Math.round(r?o:n))},get dragging(){return!!r},setReduced(g){i=!!g},go(g){n=z(g)},jump(g){n=o=z(g),a=0},begin(g,E){r={y0:g,p0:o,samples:[[E,g]]},a=0},move(g,E){if(!r)return;let S=r.p0+(g-r.y0)/w.drag;for(S<0?S/=3:S>e-1&&(S=e-1+(S-e+1)/3),o=S,r.samples.push([E,g]);r.samples.length>2&&E-r.samples[0][0]>100;)r.samples.shift()},end(g){if(!r)return 0;let E=r.samples,S=E[0],D=E[E.length-1],ke=Math.abs(D[1]-r.y0),Fa=D[0]-S[0]>8&&g-D[0]<80?(D[1]-S[1])/(D[0]-S[0])*1e3:0;return r=null,a=Math.max(-12,Math.min(12,Fa/w.drag)),n=z(Math.round(o+(i?0:a*w.carry))),i&&(a=0),ke},cancel(){r&&(r=null,n=z(Math.round(o)))},wheel(g){for(c+=g;Math.abs(c)>=w.wheelNotch;){let E=Math.sign(c);n=z(n+E),c-=E*w.wheelNotch}}}}var F=ko,j=document.getElementById("c"),A=new To({canvas:j,antialias:!0,powerPreference:"high-performance"});A.outputColorSpace=he;A.toneMapping=co;var $=new ie,wa=new Mo(A);$.environment=wa.fromScene(new lt,.04).texture;$.environmentIntensity=.46;wa.dispose();var de=Lo();Co(de);L.tops.forEach((e,t)=>de.uShelf.value[t].set(-L.width/2,L.width/2,e-L.thick,e));de.uShelfDepth.value=L.depth;var vt=Po(A,de);$.add(vt.mesh);var ga=Fo(de);for(let e of ga)$.add(e);var x=Oo(F);Oe.value=window.__editionsTest?.coverBias??-.5;var ge=new vo(new Uint8Array([255,255,255,255]),1,1);ge.colorSpace=he;ge.needsUpdate=!0;for(let e of x)e.front.map=ge,e.back.map=ge,$.add(e.mesh);var yt=1,pt=x.find(e=>e.entry.newest)||null,Ea=!1,Ye=Jo("Now playing");$.add(Ye.mesh);var Ne=Zo(A),_=2556,R=new xo(20,1,100,_*2);R.position.set(0,0,_);var y=ta(x.length),wt=ea();$.add(wt.mesh);var pe=x.map(()=>null),Sa=x.map(()=>null),Gt=x.map(()=>null),Xa=1,ba=null,Ra=new Promise(e=>requestAnimationFrame(()=>requestAnimationFrame(e))).then(()=>import("./covers-V2BS4OL4.js")).then(e=>ba=e),Qa=(e,t,o)=>Ra.then(a=>a.createCover(A,e.entry,t,o)),oa=()=>gt===null?0:performance.now()-gt,aa=window.__editionsTest?.coverLate||{},Ja=0;function Ma(){let e=Ja++;if(e>=x.length)return Promise.resolve();let t=x[e],o=()=>{Gt[e]=oa(),Sa[e]=gt===null?null:Math.round(Gt[e]),T()};return Qa(t,e,{size:1024,backSize:0}).then(a=>{let n=()=>{pe[e]=a,At(t,a.front,null),o()};aa[e]==null?n():setTimeout(n,Math.max(0,Vt(e)+aa[e]-oa()))},a=>{console.warn(`cover ${t.entry.name}: flat sleeve (${a?.message||a})`),o()}).then(Ma)}var en=Ra.then(()=>Promise.all(Array.from({length:Xa},Ma)));function tn(e){let t=x[e];pe[e]?.detailBack(1024).then(o=>{l&&l.i===e&&(t.back.map=o||ge,t.back.color.set(o?16777215:Ta),t.back.needsUpdate=!0,T())}).catch(o=>console.warn(`cover ${t.entry.name}: no Details back (${o?.message||o})`))}var It=!1,ht=null;function on(){if(It||!pe[0]||ne.some(t=>!t))return;It=!0;let e=window.requestIdleCallback||(t=>setTimeout(t,200));e(()=>{l||pe[0].detailBack(1024).catch(()=>{}),e(()=>no().then(t=>t.warm()).then(t=>{t&&(ht=t,T())}).catch(t=>console.warn(`world warm-up: ${t?.message||t}`)),{timeout:3e3})},{timeout:2e3})}var Ta=15328992,na=600,fe=x.map(()=>null),ra=x.map(()=>0),Vt=e=>m?H(M.appear.at+M.appear.stagger*e):zt(e);function an(e,t){if(fe[e]===null){if(e>0&&fe[e-1]===null)return null;let o=Vt(e),a=e>0?Math.max(o,fe[e-1]+o-Vt(e-1)):o,n=Gt[e]??(t>=o+na?o+na:null);if(n===null||t<Math.max(a,n))return null;fe[e]=Math.max(a,n),ra[e]=fe[e]-o,pe[e]||nn(x[e])}return ra[e]}function nn(e){let t=ba?.coverGround?.(e.entry,e.i)||e.entry.accent?.light;t&&e.front.color.set(t)}function rn(e){e.back.map!==ge&&(e.back.map=ge,e.back.color.set(Ta),e.back.needsUpdate=!0)}var We=-1,ka=0;function sn(e){e!==We&&(We>=0&&(pe[We]?.setAlive(!1),ka=performance.now()+1700),We=e,e>=0&&pe[e]?.setAlive(!0))}var J=null,Pt=null,$t=document.querySelector(".sound");function Yt(){let e=!!J?.enabled;$t.setAttribute("aria-pressed",String(e)),$t.setAttribute("aria-label",e?"Sound on":"Sound off")}function Nt(){return Pt||(Pt=import("./audio-RSGSU6J4.js").then(e=>(J=e.createAudio(),J.setRoomTone(!0),Yt(),J))),Pt}var Z=(e,t)=>{window.__editions?.soundLog?.push([e,Math.round(performance.now())]),J?.play(e,t)},Ee=e=>Math.max(-1,Math.min(1,x[e].x/600));for(let e of["pointermove","pointerdown","keydown","touchstart"])window.addEventListener(e,Nt,{once:!0,capture:!0,passive:!0});var Ha=()=>{J?J.unlock():Nt().then(e=>e.unlock())};window.addEventListener("pointerdown",Ha,{once:!0,capture:!0});window.addEventListener("keydown",Ha,{once:!0,capture:!0});$t.addEventListener("click",async()=>{let e=J||await Nt();e.setEnabled(!e.enabled),Yt()});Yt();var Je=document.getElementById("slots"),_e=x.map(e=>{let t=F[e.i],o=document.createElement("li");o.className="slot";let a=document.createElement("article");a.setAttribute("aria-labelledby",`sl-${e.i}`);let n=document.createElement("h2");if(n.className="sr",n.id=`sl-${e.i}`,n.textContent=t.name,a.appendChild(n),t.tag){let i=document.createElement("p");i.className="sr",i.textContent=t.year?`${t.tag}, ${t.year}`:t.tag,a.appendChild(i)}let r=document.createElement("a");r.dataset.action="open",r.textContent="Open",jt(r,e.i);let c=document.createElement("button");return c.type="button",c.dataset.action="details",c.dataset.index=String(e.i),c.textContent="Details",c.setAttribute("aria-label",`Details: ${t.name}`),a.append(r,c),o.appendChild(a),Je.appendChild(o),o});function jt(e,t){let o=F[t];e.dataset.index=String(t),e.href=o.url||`#${se(o)}`,o.url?(e.target="_blank",e.rel="noopener"):(e.removeAttribute("target"),e.removeAttribute("rel")),e.setAttribute("aria-label",o.url?`Open: ${o.name} site, new tab`:`Open: ${o.name}`)}var et=document.getElementById("crate-bar"),ln=et.querySelector(".cb-year"),cn=et.querySelector(".cb-name"),ia=et.querySelector(".cb-details"),fn=et.querySelector(".cb-open"),Ft=document.querySelector(".crate-rail span"),sa=document.getElementById("announce");function tt(e){sa.textContent="",requestAnimationFrame(()=>{sa.textContent=e})}document.getElementById("index").append(...F.map(e=>{let t=document.createElement("li"),o=document.createElement("span");o.className="y",o.textContent=e.year||"";let a=document.createElement("span");return a.className="n",a.textContent=e.name,t.append(o,a),t}));var Mt=document.querySelector(".tagline"),De=document.getElementById("details"),je=De.querySelector(".d-title"),Ke=De.querySelector(".d-tag"),ue=document.getElementById("d-open");function Fe(e,t,o,a){let n=+getComputedStyle(e).opacity;for(let r of e.getAnimations())r.cancel();e.animate([{opacity:n},{opacity:t}],{duration:k(a),delay:H(o),easing:"ease",fill:"both"})}var B=0,P=0,K=1,m=!1,Ot=0,Ut=0,Wt=0,Aa=0,Pe=0,un=14,Bt=new ee;function Kt(){B=window.innerWidth,P=window.innerHeight;let e=m;m=B<600,_=m?2556*4:2556,K=m?y.layout(B,P,_):kt(B,P),R.position.z=_,R.far=_*2;let t=B/2/K,o=P/2/K;if(R.fov=at.radToDeg(2*Math.atan(o/_)),R.aspect=B/P,R.clearViewOffset(),R.updateMatrixWorld(),Pe=0,!m){let s=V(),f=u.size,p=Se(0,L.tops[0]+f*Math.cos(s.lean),s.z-f*Math.sin(s.lean)+u.thick).y;Pe=Math.max(0,Math.round(Mt.getBoundingClientRect().bottom+un-p)),Pe&&R.setViewOffset(B,P,0,-Pe,B,P)}A.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),A.setSize(B,P,!1),A.getDrawingBufferSize(Bt),Ne.resize(Bt.x,Bt.y);let a=m?kt(B,P):K,n=B/2/a*1.02,r=P/2/a*1.02,c=Pe/K;vt.resize(-t*1.02,-o*1.02+c,t*1.02,o*1.02+c,Math.ceil(B/2),Math.ceil(P/2),m?[-n,-r,n,r]:null),Be=ae=!0,Ot=m?w.details.size*B:G.size*K,Ut=m?w.details.centreY*P:P/2-(900/2-G.centreY)*K,Wt=_*(1-u.size*K/Ot),Aa=(P/2+Pe-Ut)/K*(_-Wt)/_;let i=m||!!window.__editionsTest?.noShelves;for(let s of ga)s.visible=!i;vt.setGain(m?w.groundGain:1),wt.mesh.visible=m,m&&wt.layout(B,P,K);for(let s of x)s.mats[0].color.set(m?w.edgeColour:15855594);if(L.tops.forEach((s,f)=>i?de.uShelf.value[f].set(0,0,-1e5,-1e5):de.uShelf.value[f].set(-L.width/2,L.width/2,s-L.thick,s)),document.body.classList.toggle("crate",m),m!==e){l&&io(),Me(-1);for(let s of x)ne[s.i]&&(s.fall=null,s.pose=qt(s),ce(s));Ie(!0)}else if(m)for(let s of x)ne[s.i]&&!(l&&l.i===s.i)&&(s.pose=qt(s),ce(s));za=x.map(s=>dn(s)),m||x.forEach(Qt),hn(),T()}var qt=e=>m?y.pose(e):V(),_t=new O,ye=new ho;function Se(e,t,o){return _t.set(e,t,o).project(R),{x:(_t.x+1)/2*B,y:(1-_t.y)/2*P}}function Zt(e){let t=x[e].mesh;t.geometry.boundingBox||t.geometry.computeBoundingBox(),ye.copy(t.geometry.boundingBox).applyMatrix4(t.matrixWorld);let o=1/0,a=1/0,n=-1/0,r=-1/0;for(let c of[ye.min.x,ye.max.x])for(let i of[ye.min.y,ye.max.y])for(let s of[ye.min.z,ye.max.z]){let f=Se(c,i,s);o=Math.min(o,f.x),n=Math.max(n,f.x),a=Math.min(a,f.y),r=Math.max(r,f.y)}return{x:o,y:a,width:n-o,height:r-a}}var za=[];function dn(e){let t=u.size,o=e.shelfY,a=Se(e.x-t/2,o+u.hoverLift+t,u.hoverZ),n=Se(e.x+t/2,o,0);return{x0:a.x,y0:a.y,x1:n.x,y1:n.y}}function Xt(e,t){let o=-1;return za.forEach((a,n)=>{ne[n]&&e>=a.x0&&e<=a.x1&&t>=a.y0&&t<=a.y1&&(o=n)}),o}var q=new O,qe=e=>{let t=A.getPixelRatio();return Math.round(e*t)/t};function Qt(e){q.set(-u.size/2,0,u.thick).applyMatrix4(e.mesh.matrixWorld);let t=Se(q.x,q.y,q.z);q.set(u.size/2,0,u.thick).applyMatrix4(e.mesh.matrixWorld);let a=Se(q.x,q.y,q.z).x-t.x;_e[e.i].style.transform=`translate3d(${qe(t.x+a*.1175)}px, ${qe(t.y-a*.025-35)}px, 0)`}function pn(e){return{...V(),lean:0,dx:-e.x,lift:Aa-u.size/2-e.shelfY,z:Wt-u.thick/2}}function hn(){let e=Ut;je.style.top=`${qe(e-54.2)}px`,Ke.style.top=`${qe(e-13.6)}px`,ue.style.top=`${qe(e+Ot/2+16)}px`}var Ze=0,Ue=0,Be=!0,ae=!0,gt=null,Et=null,be=-1,I=-1,St=0,l=null,la=-1,ca=!1,ne=x.map(()=>!1),N={x:-1,y:-1},Ge={};Ge.ready=new Promise(e=>{Ge.resolve=e});var rr=Ge.ready;function T(){Ze||(Ze=requestAnimationFrame(vn))}function fa(e,t){let o=u.size,a=u.thick;return{x:e.x+t.dx,y:e.shelfY+t.lift+o/2*Math.cos(t.lean),z:t.z-o/2*Math.sin(t.lean)+a/2}}function ua(e,t,o,a){let n=dt(t,o,a),r=u.size,c=fa(e,t),i=fa(e,o),s=_/(_-c.z),f=_/(_-i.z),p=s+(f-s)*a,d=(c.x*s+(i.x*f-c.x*s)*a)/p,h=(c.y*s+(i.y*f-c.y*s)*a)/p;return n.dx=d-e.x,n.lift=h-e.shelfY-r/2*Math.cos(n.lean),n.z=_*(1-1/p)+r/2*Math.sin(n.lean)-u.thick/2,n}var mn=e=>1-(1-e)**3,da=e=>e*e*(3-2*e),pa=Math.PI*2;function xn(e,t){let o=G.fly,a=G.exit,n=G.flip,r=()=>l.flip.from+(l.flip.to-l.flip.from)*me(n.ease,C((t-l.flip.t0-H(n.at))/k(n.dur))),c,i;if(l.exit){let s=l.exit,f=t-s.t0,p=me(a.ease,C((f-H(a.at))/k(a.dur)));if(c=ua(e,s.from,{...m?y.pose(e):Ce(),yaw:s.yawTo},p),c.yaw=s.from.yaw+(s.yawTo-s.from.yaw)*me(a.turn.ease,C((f-H(a.turn.at))/k(a.turn.dur))),l.blur=s.blur*(1-da(C((f-H(a.blurOut.at))/k(a.blurOut.dur)))),i=f<H(a.at)+k(a.dur)||l.blur>0,!i)return La(e,t),!0}else{let s=t-l.t0,f=me(o.ease,C((s-H(o.at))/k(o.dur)));c=ua(e,l.from,pn(e),f),c.yaw=r(),l.blur=m?0:da(C((s-H(G.blur.at))/k(G.blur.dur)));let p=Math.max(...[o,G.blur,G.title].map(d=>H(d.at)+k(d.dur)));i=s<p||t-l.flip.t0<H(n.at)+k(n.dur)}return e.pose=c,i}var bt=!1;j.addEventListener("webglcontextlost",e=>{e.preventDefault(),!bt&&(bt=!0,Ze&&cancelAnimationFrame(Ze),l&&io(),ao?.close(),import("./fallback.js").then(t=>t.start(F)))});function vn(e){if(Ze=0,bt)return;if(Y>=0){Ue=0;return}let t=Ue?Math.min(.05,(e-Ue)/1e3):0;Ue=e;let o=!1,a=Et===null?-1:e-Et,n=ca,r=m&&y.step(t);ca=r,r?Ie():n&&m&&(Ie(),gn());let c=l||m?-1:be;I!==c&&(l||e-St>=H(Wo))&&(I>=0&&!(l&&l.i===I)&&(x[I].fall={from:{...x[I].pose},t0:St}),I=c,I>=0&&(x[I].fall=null)),sn(l?l.i:I);let i=I!==c;for(let f of x){let p=!1;if(l&&f.i===l.i)p=xn(f,e);else if(ne[f.i]){if(m)r&&(f.pose=y.pose(f),p=!0);else if(I===f.i)p=No(f,t);else if(f.fall){let d=jo(f.fall.from,e-f.fall.t0);d?f.pose=d:(f.pose=V(),f.fall=null),p=!0}}else if(a>=0){let d=an(f.i,a);if(d!==null){let h=m?wn(f,a-d):Yo(f.i,a-d);h?f.pose=h:(f.pose=qt(f),ne[f.i]=!0)}p=!0}if(p){ce(f),m||Qt(f);let d=!m&&f.pose.z<270;(d||f.shaded)&&(Be=!0),f.shaded=d,(!l||f.i!==l.i)&&(ae=!0),o=!0}}Be&&(Uo(x,de,m),vt.bake(),Be=!1,ae=!0),m&&wt.setOpacity(a<0||fe[0]===null?0:C((a-fe[0])/k(600))),pt&&(Ye.mesh.layers.set(l&&l.i===pt.i?yt:0),Ye.place(pt,Ea?0:pt.pose.opacity));let s=We>=0||e<ka;if(s&&!window.__editionsTest?.stillCovers)for(let f of pe)f?.update(t);if(l){let f=x[l.i],p=G.blur.sigma*l.blur;(ae||p!==la)&&(R.layers.set(0),Ne.background($,R,p),ae=!1,la=p),Ne.composite(Math.min(1,l.blur*4)),R.layers.set(yt),A.autoClear=!1,A.clearDepth(),A.render($,R),A.autoClear=!0,R.layers.set(0)}else ht&&(ht.draw(),ht=null),A.render($,R);xt.firstFrameAt===null&&(xt.firstFrameAt=performance.now(),yn(xt.firstFrameAt),Ge.resolve(),o=!0),!It&&!o&&on(),o||i||s||r?T():Ue=0}function ha(e){if(!CSS.supports("animation-timing-function","linear(0, 1)"))return"cubic-bezier(0.16, 1, 0.3, 1)";let t=24,o=[],a=1-Math.exp(-1/e);for(let n=0;n<=t;n++)o.push(((1-Math.exp(-(n/t)/e))/a).toFixed(4));return`linear(${o.join(", ")})`}function yn(e){gt=e,Et=window.__editionsTest?.noSleeves?null:e,j.animate([{opacity:0},{opacity:1}],{duration:k(M.canvasFade.dur),easing:M.canvasFade.ease,fill:"forwards"});let t=M.header,o=k(t.tau*5);document.querySelectorAll(".rise").forEach((n,r)=>n.animate([{opacity:0,transform:`translateY(${-t.rise}px)`},{opacity:1,transform:"none"}],{duration:o,delay:H(t.at+t.stagger*r),easing:ha(.2),fill:"forwards"}));let a=M.late;document.querySelectorAll(".late").forEach(n=>n.animate([{opacity:0},{opacity:1}],{duration:k(a.tau*5),delay:H(a.at),easing:ha(.2),fill:"forwards"}))}function Xe(){let e=l?-1:be;_e.forEach((t,o)=>t.classList.toggle("hot",o===e)),j.style.cursor=l?Jt()?"pointer":"":be>=0?"pointer":""}function Me(e,t=!1){e!==be&&(be=e,St=performance.now(),Xe(),e>=0&&!l&&(t||Z("hover",{pan:Ee(e)}),Z("lift",{pan:Ee(e),intensity:.8})),T())}function Jt(){if(!l)return!1;let e=Zt(l.i);return N.x>=e.x&&N.x<=e.x+e.width&&N.y>=e.y&&N.y<=e.y+e.height}var Re=-1;window.addEventListener("pointermove",e=>{if(e.pointerType==="touch"||m)return;if(N.x=e.clientX,N.y=e.clientY,l){Xe();return}let t=e.target.closest?.(".pm")?-1:Xt(e.clientX,e.clientY);t!==Re&&(Re=t,Me(t))});document.documentElement.addEventListener("pointerleave",()=>{Re=-1,Me(-1)});window.addEventListener("blur",()=>{Re=-1,Me(-1)});window.addEventListener("resize",Kt);j.addEventListener("click",e=>{if(m)return;if(N.x=e.clientX,N.y=e.clientY,l){if(l.exit)return;Jt()?oo():Tt();return}let t=Xt(e.clientX,e.clientY);t>=0&&to(t)});function wn(e,t){let o=C((t-H(M.appear.at+M.appear.stagger*e.i))/k(360));if(o>=1)return null;let a=y.pose(e);return a.opacity=o,le()||(a.lift+=(1-mn(o))*40/K),a}var ma=-1,xa=0;function Ie(e=!1){if(!m)return;let t=x.length,o=y.current,a=F[o],n=Ft.parentElement.clientHeight-Ft.offsetHeight;Ft.style.transform=`translateY(${((1-C(y.p/Math.max(1,t-1)))*n).toFixed(1)}px)`,!(o===ma&&!e)&&(ma=o,ln.textContent=a.year||"",cn.textContent=a.name,ia.dataset.index=String(o),ia.setAttribute("aria-label",`Details: ${a.name}`),jt(fn,o))}function gn(){let e=y.current;e!==xa&&(xa=e,tt(`${F[e].name}, ${e+1} of ${x.length}`))}function En(e,t){let o=Math.round(y.p),a=[];for(let n=0;n<o;n++)a.push(n);for(let n=o;n<x.length;n++)a.push(n);for(let n of a){if(!ne[n])continue;let r=Zt(n);if(e>=r.x&&e<=r.x+r.width&&t>=r.y&&t<=r.y+r.height)return n}return-1}var we=null;j.addEventListener("pointerdown",e=>{!m||Y>=0||!e.isPrimary||(we={x:e.clientX,y:e.clientY,id:e.pointerId},j.setPointerCapture(e.pointerId),l||(y.begin(e.clientY,e.timeStamp),T()))});j.addEventListener("pointermove",e=>{!we||e.pointerId!==we.id||l||(y.move(e.clientY,e.timeStamp),Ie(),T())});var eo=e=>t=>{if(!we||t.pointerId!==we.id)return;let{x:o,y:a}=we;we=null;let n=Math.hypot(t.clientX-o,t.clientY-a);if(e){y.cancel(),T();return}if(l||y.end(t.timeStamp),T(),n>=8)return;if(N.x=t.clientX,N.y=t.clientY,l){if(l.exit)return;Jt()?oo():Tt();return}let r=En(t.clientX,t.clientY);r<0||(r===y.current&&Math.abs(y.p-r)<.05?to(r):(y.go(r),Z("tick")))};j.addEventListener("pointerup",eo(!1));j.addEventListener("pointercancel",eo(!0));j.addEventListener("lostpointercapture",eo(!0));var va=0;window.addEventListener("wheel",e=>{!m||l||Y>=0||(e.preventDefault(),e.timeStamp-va>200&&y.wheel(0),va=e.timeStamp,y.wheel(e.deltaY),T())},{passive:!1});et.querySelector(".cb-back").addEventListener("click",()=>Tt());function to(e){if(l||!ne[e])return;let t=x[e],o=performance.now();t.fall=null,m&&y.go(e);let a=Qe(document.activeElement)===e?document.activeElement:null;l={i:e,t0:o,from:{...t.pose},flip:{from:0,to:0,t0:-1e9},exit:null,blur:0,ret:a},t.mesh.layers.set(yt),ae=!0,tn(e),je.textContent=t.entry.name,Ke.textContent=t.entry.tag,jt(ue,e),De.inert=!1,ue.inert=!1,Je.inert=!0,document.body.classList.add("in-details");let n=G;Fe(Mt,0,n.headerOut.at,n.headerOut.dur);for(let r of[je,Ke])Fe(r,1,n.title.at,n.title.dur);Fe(ue,1,n.open.at,n.open.dur),De.focus({preventScroll:!0}),Z("details",{pan:Ee(e)}),tt(t.entry.tag?`Details: ${t.entry.name}. ${t.entry.tag}`:`Details: ${t.entry.name}`),Xe(),T()}function oo(){if(!l||l.exit)return;let e=performance.now(),t=G.flip,o=l.flip,a=o.from+(o.to-o.from)*me(t.ease,C((e-o.t0-H(t.at))/k(t.dur)));l.flip={from:a,to:o.to+Math.PI,t0:e},Z("flip"),tt(Math.round(l.flip.to/Math.PI)%2?"Back of the sleeve":"Front of the sleeve"),T()}function Tt(){if(!l||l.exit)return;let e=x[l.i],t=performance.now(),o=G.exit;l.exit={t0:t,from:{...e.pose},yawTo:Math.ceil(e.pose.yaw/pa-1e-6)*pa,blur:l.blur};for(let a of[je,Ke,ue])Fe(a,0,o.at,o.textOut);Fe(Mt,1,o.headerIn.at,o.headerIn.dur),De.inert=!0,ue.inert=!0,Z("close",{pan:Ee(l.i)}),tt("Back to the shelf"),T()}function La(e,t,o=!1){let{i:a}=l,n=o?null:l.ret;if(l=null,rn(e),e.pose=m?y.pose(e):Ce(),ce(e),e.mesh.layers.set(0),ae=Be=!0,Je.inert=!1,document.body.classList.remove("in-details"),m){n&&n.isConnected&&n.focus({preventScroll:!0}),Ie(!0),Xe();return}Re=o?-1:Xt(N.x,N.y),be=Re,St=t,n&&n.isConnected&&n.focus({preventScroll:!0}),I=be===a?a:-1,I!==a&&(e.fall={from:Ce(),t0:t}),Qt(e),Xe()}var ao=null,ya=null,Y=-1,Rt=!1,mt=0,no=()=>ya||(ya=import("./project-NDV3PKIG.js").then(e=>ao=e.createProjectView({renderer:A,entries:F,slugOf:se,onBack:bn})));function Sn(e){Z("open",{pan:l?0:Ee(e)}),no(),F[e].kind!=="about"&&import("./project-NDV3PKIG.js").then(t=>t.loadDossier(se(F[e]))),Rt=!0,mt=Ao.cut,tt(`Open: ${F[e].name}`),location.hash=se(F[e])}async function ro(){if(bt)return;let e=decodeURIComponent(location.hash.slice(1)),t=F.findIndex(o=>se(o)===e);if(t>=0){if(t===Y)return;let o=await no();if(F.findIndex(a=>se(a)===decodeURIComponent(location.hash.slice(1)))!==t||t===Y)return;l&&io(!0),Me(-1),Y=t;for(let a of j.getAnimations())a.finish();J?.setRoomTone(!1),mt||Z("open"),await o.open(t,{cutAfter:mt}),mt=0}else if(Y>=0){let o=Y;if(Y=-1,ao?.close(),J?.setRoomTone(!0),Z("close",{pan:Ee(o)}),Kt(),m){y.jump(o);for(let a of x)ne[a.i]&&(a.pose=y.pose(a),ce(a));Ie(!0)}Be=ae=!0,_e[o].querySelector('[data-action="open"]').focus({preventScroll:!0}),T()}}function bn(){Rt?(Rt=!1,history.back()):(history.pushState(null,"",location.pathname+location.search),ro())}window.addEventListener("hashchange",()=>{location.hash||(Rt=!1),ro()});function io(e=!1){let t=x[l.i];for(let o of[je,Ke,ue])for(let a of o.getAnimations())a.cancel();Fe(Mt,1,0,1),De.inert=!0,ue.inert=!0,La(t,performance.now(),e),t.fall=null,I=-1}document.addEventListener("click",e=>{let t=e.target.closest("[data-action][data-index]");if(!t)return;let o=+t.dataset.index;if(t.dataset.action==="details"){to(o);return}F[o].url||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||(e.preventDefault(),Sn(o))});var Qe=e=>e&&e.closest&&e.closest(".slot")?_e.indexOf(e.closest(".slot")):-1;Je.addEventListener("focusin",e=>{let t=Qe(e.target);if(!(t<0)){if(m){l||(y.go(t),T());return}Me(t,!0)}});Je.addEventListener("focusout",e=>{Qe(e.relatedTarget)>=0||l||Me(Re)});window.addEventListener("keydown",e=>{if(e.metaKey||e.ctrlKey||e.altKey||Y>=0)return;if(l){e.key==="Escape"?(e.preventDefault(),Tt()):(e.key===" "||e.code==="Space")&&(e.preventDefault(),e.repeat||oo());return}if(m){let r={ArrowLeft:-1,ArrowUp:-1,ArrowRight:1,ArrowDown:1}[e.key];if(r===void 0)return;e.preventDefault();let c=Math.max(0,Math.min(x.length-1,y.current+r));if(c===y.current)return;y.go(c),Qe(document.activeElement)>=0&&_e[c].querySelector(`[data-action="${document.activeElement.dataset.action}"]`).focus({preventScroll:!0}),Z("tick"),T();return}let t={ArrowLeft:-1,ArrowRight:1,ArrowUp:-u.cols,ArrowDown:u.cols}[e.key];if(t===void 0)return;e.preventDefault();let o=Qe(document.activeElement),a=o<0?0:Math.max(0,Math.min(x.length-1,o+t));if(a===o)return;let n=document.activeElement?.dataset?.action==="open"?"open":"details";_e[a].querySelector(`[data-action="${n}"]`).focus({preventScroll:!0}),Z("tick",{pan:Ee(a)})});window.addEventListener("keyup",e=>{l&&(e.key===" "||e.code==="Space")&&e.preventDefault()});var so=window.matchMedia("(prefers-reduced-motion: reduce)");st(so.matches);y.setReduced(so.matches);so.addEventListener?.("change",e=>{st(e.matches),y.setReduced(e.matches)});var xt={count:x.length,firstFrameAt:null,ready:Ge.ready,covers:en,sleeveRect:Zt,frontCorners(e){let t=x[e].mesh.matrixWorld,o=u.size;return[[-o/2,0],[o/2,0],[o/2,o],[-o/2,o]].map(([a,n])=>(q.set(a,n,u.thick).applyMatrix4(t),Se(q.x,q.y,q.z)))},setCover(e,t,o){At(x[e],t,o),T()},get project(){return Y>=0?se(F[Y]):null},get sleevesAt(){return Et},coverReadyAt:Sa,appearAt:fe,get crate(){return m?{p:y.p,current:y.current,dragging:y.dragging}:null},set stickerOff(e){Ea=!!e,T()},get details(){return l?{index:l.i,flipped:Math.round(l.flip.to/Math.PI)%2===1,closing:!!l.exit,blur:l.blur,yaw:x[l.i].pose.yaw}:null}};window.__editions=xt;Kt();for(let e of x)e.mesh.visible=!0;Ye.mesh.visible=!0;for(let e of[!0,!1]){for(let t of x)for(let o of[t.front,t.back,t.mats[0]])o.transparent=e,o.needsUpdate=!0;for(let t of[0,yt])R.layers.set(t),A.render($,R);R.layers.enableAll(),A.render($,R),R.layers.set(0),Ne.background($,R,1),Ne.composite(.5)}for(let e of x)ce(e);Ye.mesh.visible=!1;ae=!0;Ge.ready.then(()=>{location.hash&&ro()});export{rr as drawn};
