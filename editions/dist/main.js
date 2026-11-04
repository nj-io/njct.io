import{A as S,B as rt,C as X,D as st,E as xo,F as ie,G as vo,H as yo,I as wo,J as go,K as Eo,L as te,M as oe,N as bo,O as So,Q as Mo,R as Ro,S as To,a as lo,b as co,e as ke,i as ot,j as fo,l as he,m as uo,n as at,o as ee,p as po,q as O,s as U,t as He,u as ho,v as se,w as mo,x as nt}from"./chunk-CBEJLKG4.js";import{a as I,b as it,c as ae,d as z,e as T,f as Ae}from"./chunk-U3AZOSC6.js";import{a as kt,b as ko,c as le,e as u,f as L,g as Ho,h as F,i as R,j as Ao}from"./chunk-BB35V6BP.js";var lt=class extends ie{constructor(){super();let t=new rt;t.deleteAttribute("uv");let a=new oe({side:lo}),o=new oe,n=new So(16777215,900,28,2);n.position.set(.418,16.199,.3),this.add(n);let r=new S(t,a);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let c=new yo(t,o,6),i=new mo;i.position.set(-10.906,2.009,1.846),i.rotation.set(0,-.195,0),i.scale.set(2.328,7.905,4.651),i.updateMatrix(),c.setMatrixAt(0,i.matrix),i.position.set(-5.607,-.754,-.758),i.rotation.set(0,.994,0),i.scale.set(1.97,1.534,3.955),i.updateMatrix(),c.setMatrixAt(1,i.matrix),i.position.set(6.167,.857,7.803),i.rotation.set(0,.561,0),i.scale.set(3.927,6.285,3.687),i.updateMatrix(),c.setMatrixAt(2,i.matrix),i.position.set(-2.017,.018,6.124),i.rotation.set(0,.333,0),i.scale.set(2.002,4.566,2.064),i.updateMatrix(),c.setMatrixAt(3,i.matrix),i.position.set(2.291,-.756,-2.621),i.rotation.set(0,-.286,0),i.scale.set(1.546,1.552,1.496),i.updateMatrix(),c.setMatrixAt(4,i.matrix),i.position.set(-2.193,-.369,-5.547),i.rotation.set(0,.516,0),i.scale.set(3.875,3.487,2.986),i.updateMatrix(),c.setMatrixAt(5,i.matrix),this.add(c);let l=new S(t,ze(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);let f=new S(t,ze(50));f.position.set(-16.109,18.021,-8.207),f.scale.set(.1,2.425,2.751),this.add(f);let p=new S(t,ze(17));p.position.set(14.904,12.198,-1.832),p.scale.set(.15,4.265,6.331),this.add(p);let d=new S(t,ze(43));d.position.set(-.462,8.89,14.52),d.scale.set(4.38,5.441,.088),this.add(d);let h=new S(t,ze(20));h.position.set(3.235,11.486,-12.541),h.scale.set(2.5,2,.1),this.add(h);let v=new S(t,ze(100));v.position.set(0,20,0),v.scale.set(1,.1,1),this.add(v)}dispose(){let t=new Set;this.traverse(a=>{a.isMesh&&(t.add(a.geometry),t.add(a.material))});for(let a of t)a.dispose()}};function ze(e){return new bo({color:0,emissive:16777215,emissiveIntensity:e})}var _a=u.hoverLift.toFixed(2),Q=u.cols,zo=(u.pitch/2).toFixed(2),Da={key:{rect:[1148.801,12.997,8768.289,3472.806],z:994.831,power:2.322},fill:{rect:[-2516.226,-9815.124,2516.226,10070.146],z:573.364,power:1.474},shelfAlbedo:1.219,shelfAmbient:.383,contact:{strength:.332,reach:19.033},keyMix:.571,base:{centre:.614,edge:.752,cy:-293.494,rx:806.633,ry:309.574,pow:.304},edgeShade:{strength:.989,reach:5.54},liftShade:{strength:.5,reach:8},halo:{right:.4,left:.383,top:.056,rise:.308,fall:60.395,row2:.724,vfall:10,drop:.881,dropReach:31.417},glow:{strength:.2,fall:100,side:60,fade:24.653,width:1100}},Le=4*Q;function Lo(){return{uLightRect:{value:[new U,new U]},uLightZ:{value:[0,0]},uLightPower:{value:[0,0]},uShelf:{value:[new U,new U]},uShelfDepth:{value:0},uSlab:{value:Array.from({length:Le},()=>new U(0,0,0,0))},uSlabZ:{value:new Array(Le).fill(1)},uSlabA:{value:new Array(Le).fill(0)},uFoot:{value:Array.from({length:2*Q},()=>new U(0,0,0,1e3))},uShelfAlbedo:{value:1},uShelfAmbient:{value:0},uContact:{value:new ee},uHalo:{value:new O},uHaloShape:{value:new U},uHaloDrop:{value:new ee},uGlow:{value:new U},uGlowWidth:{value:1e4},uEdgeShade:{value:new U},uKeyMix:{value:.5},uBase:{value:new O},uBaseShape:{value:new O}}}function Co(e,t=Da){[t.key,t.fill].forEach((a,o)=>{e.uLightRect.value[o].set(...a.rect),e.uLightZ.value[o]=a.z,e.uLightPower.value[o]=a.power}),e.uShelfAlbedo.value=t.shelfAlbedo,e.uShelfAmbient.value=t.shelfAmbient,e.uContact.value.set(t.contact.strength,t.contact.reach),e.uHalo.value.set(t.halo.right,t.halo.left,t.halo.top),e.uHaloShape.value.set(t.halo.rise,t.halo.fall,t.halo.row2,t.halo.vfall),e.uHaloDrop.value.set(t.halo.drop,t.halo.dropReach),e.uGlow.value.set(t.glow.strength,t.glow.fall,t.glow.side,t.glow.fade),e.uGlowWidth.value=t.glow.width,e.uEdgeShade.value.set(t.edgeShade.strength,t.edgeShade.reach,t.liftShade.strength,t.liftShade.reach),e.uKeyMix.value=t.keyMix,e.uBase.value.set(t.base.centre,t.base.edge,t.base.cy),e.uBaseShape.value.set(t.base.rx,t.base.ry,t.base.pow)}var ct=`
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
    float lift = clamp(uFoot[row * ${Q} + k].w / ${_a}, 0.0, 1.0);
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
`;var Ga=`
out vec2 vWorld;
uniform vec4 uRegion; // world x0, y0, x1, y1 covered by the texture
void main() {
  vWorld = mix(uRegion.xy, uRegion.zw, uv);
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`,Va=`
precision highp float;
in vec2 vWorld;
out vec4 outColor;
${ct}
void main() {
  int row = rowAt(vWorld.y);
  float seen = mix(wallLight(1, vWorld, row), wallLight(0, vWorld, row), uKeyMix);
  float e = wallBase(vWorld) * seen * edgeShade(vWorld, row) + haloAt(vWorld, row);
  outColor = vec4(vec3(e), 1.0);
}`,$a=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,Oa=`
uniform sampler2D uBake;
uniform float uGain;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(uBake, vUv).rgb * uGain;
  gl_FragColor = vec4(c, 1.0);
  #include <colorspace_fragment>
  float n = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  gl_FragColor.rgb += (n - 0.5) / 255.0;
}`;function Po(e,t){let a=new He(4,4,{type:ot,format:fo,depthBuffer:!1,minFilter:ke,magFilter:ke,generateMipmaps:!1}),o=new X({glslVersion:uo,uniforms:{...t,uRegion:{value:new U}},vertexShader:Ga,fragmentShader:Va,depthTest:!1,depthWrite:!1}),n=new ie;n.add(new S(new te(2,2),o));let r=new st,c=new X({uniforms:{uBake:{value:a.texture},uGain:{value:1}},vertexShader:$a,fragmentShader:Oa,toneMapped:!1}),i=new S(new te(1,1),c);return i.renderOrder=-1,{mesh:i,resize(l,f,p,d,h,v,A=null){a.setSize(h,v),o.uniforms.uRegion.value.set(...A||[l,f,p,d]),i.scale.set(p-l,d-f,1),i.position.set((l+p)/2,(f+d)/2,0),i.updateMatrixWorld()},setGain(l){c.uniforms.uGain.value=l},bake(){let l=e.getRenderTarget();e.setRenderTarget(a),e.render(n,r),e.setRenderTarget(l)},dispose(){a.dispose(),o.dispose(),c.dispose(),i.geometry.dispose()}}}function Ua(){let{width:e,depth:t,thick:a,bevel:o}=L,n=new go;n.moveTo(0,-a),n.lineTo(t-o,-a),n.absarc(t-o,-a+o,o,-Math.PI/2,0,!1),n.lineTo(t,-o),n.absarc(t-o,-o,o,0,Math.PI/2,!1),n.lineTo(0,0),n.closePath();let r=new Eo(n,{depth:e,bevelEnabled:!1,curveSegments:6});return r.applyMatrix4(new se().set(0,0,-1,e/2,0,1,0,0,1,0,0,0,0,0,0,1)),r.computeVertexNormals(),r}var Wa=`
varying vec3 vPos;
varying vec3 vNormal;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vPos = w.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,qa=`
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
}`;function Fo(e){let t=Ua();return L.tops.map((a,o)=>{let n=new X({uniforms:{...e,uRow:{value:o}},vertexShader:Wa,fragmentShader:qa,toneMapped:!1}),r=new S(t,n);return r.position.set(0,a,0),r.updateMatrixWorld(),r})}var Io=`
vec3 njNeutral(vec3 c) {
  const float start = 0.76, desat = 0.15;
  float x = min(c.r, min(c.g, c.b));
  c -= x < 0.08 ? x - 6.25 * x * x : 0.04;
  float peak = max(c.r, max(c.g, c.b));
  if (peak < start) return c;
  float d = 1.0 - start, np = 1.0 - d * d / (peak + d - start);
  c *= np / peak;
  return mix(c, vec3(np), 1.0 - 1.0 / (desat * (peak - np) + 1.0));
}`;var W=u.size,ft=W*Math.sin(u.lean),$o={dx:0,yaw:0,opacity:1},V=()=>({...$o,lift:0,z:ft,lean:u.lean}),Ce=()=>({...$o,lift:u.hoverLift,z:u.hoverZ,lean:0}),Ht=["lift","z","lean","dx","yaw"],Ya="#d9d6d0";function $e(e,t=null){return e.onBeforeCompile=a=>{a.fragmentShader=a.fragmentShader.replace("void main() {",`${Io}
${t?`uniform float uMapBias;
`:""}void main() {`).replace("#include <tonemapping_fragment>","gl_FragColor.rgb = njNeutral(gl_FragColor.rgb);"),t&&(a.uniforms.uMapBias=t,a.fragmentShader=a.fragmentShader.replace("#include <map_fragment>",Mo.map_fragment.replace("texture2D( map, vMapUv )","texture2D( map, vMapUv, uMapBias )")))},e.customProgramCacheKey=()=>t?"nj-neutral-bias":"nj-neutral",e}var Oe={value:0};function Oo(e){let t=new rt(W,W,u.thick);return t.translate(0,W/2,u.thick/2),e.map((a,o)=>{let n=$e(new oe({color:15855594,roughness:.8})),r=o%u.cols,c=Math.floor(o/u.cols),i=Math.min(u.cols,e.length-c*u.cols),l=$e(new oe({color:new nt(a.accent?.light||Ya),roughness:.8}),Oe),f=$e(new oe({color:15328992,roughness:.7})),p=[n,n,n,n,l,f],d=new S(t,p);d.matrixAutoUpdate=!1;let h={i:o,row:c,col:r,mesh:d,front:l,back:f,mats:p,entry:a,x:(r-(i-1)/2)*u.pitch,shelfY:L.tops[c],pose:{...V(),opacity:0}};return ce(h),h})}var Bo=new po,Na=new O(1,0,0),_o=new O,ja=new O(1,1,1),xe=new O,Do=new se,Go=new se,Vo=new se;function ce(e){let t=e.pose;_o.set(e.x+t.dx,e.shelfY+t.lift,t.z),Bo.setFromAxisAngle(Na,-t.lean),e.mesh.matrix.compose(_o,Bo,ja),t.yaw&&(xe.set(0,W/2,u.thick/2).applyMatrix4(e.mesh.matrix),Go.makeTranslation(xe.x,xe.y,xe.z),Vo.makeTranslation(-xe.x,-xe.y,-xe.z),Do.makeRotationY(t.yaw),e.mesh.matrix.premultiply(Vo).premultiply(Do).premultiply(Go)),e.mesh.matrixWorld.copy(e.mesh.matrix),e.mesh.visible=t.opacity>.001;let a=t.opacity<.999;for(let o of[e.front,e.back,e.mats[0]])o.transparent!==a&&(o.transparent=a,o.needsUpdate=!0),o.opacity=t.opacity}function Uo(e,t,a=!1){for(let o of e){let n=o.pose,r=Math.cos(n.lean),c=Math.sin(n.lean),i=o.shelfY+n.lift,l=u.thick/2,f=o.x+n.dx,p=at.smoothstep(n.z,110,260),d=o.mesh.visible&&!a?n.opacity*(1-p):0,h=(o.row*u.cols+o.col)*2;for(let v=0;v<2;v++){let A=v/2,Re=(v+1)/2;d>0?t.uSlab.value[h+v].set(f-W/2,i+W*A*r,f+W/2,i+W*Re*r):t.uSlab.value[h+v].set(0,0,0,0),t.uSlabZ.value[h+v]=Math.max(1.5,n.z-W*(A+Re)/2*c+l),t.uSlabA.value[h+v]=d}t.uFoot.value[o.i].set(f-W/2,f+W/2,n.z+u.thick,d>0?n.lift:1e3)}}function At(e,t,a){t&&(e.front.map=t,e.front.color.set(16777215),e.front.needsUpdate=!0),a&&(e.back.map=a,e.back.color.set(16777215),e.back.needsUpdate=!0)}var Wo=15,ut=e=>e*e,dt=(e,t,a)=>{let o={...t};for(let n of Ht)o[n]=e[n]+(t[n]-e[n])*a;return o.opacity=e.opacity+(t.opacity-e.opacity)*a,o};function qo(e){let t=R.appear.at+R.appear.stagger*e,a=R.drop.at+R.drop.stagger*e,o=a+R.drop.dur,n=o+R.lean.delay;return{appear:t,drop:a,land:o,lean:n,rest:n+R.lean.dur}}var zt=e=>ae()?200+40*e:qo(e).appear;function Yo(e,t){if(ae()){let i=zt(e);return t>=i+160?null:{...V(),opacity:I((t-i)/160)}}let a=qo(e);if(t>=a.rest)return null;if(t<a.appear)return{...V(),opacity:0};let o=R.appearPose,n=1-.345*Math.exp(-(t-a.appear)/150),r={...V(),lift:o.lift,z:o.z,lean:0,opacity:n};if(t<a.drop)return r;if(t<a.land){let i=ut(I((t-a.drop)/R.drop.dur));return{...r,lift:o.lift*(1-i),z:o.z+(ft-o.z)*i}}let c=ut(I((t-a.lean)/R.lean.dur));return{...r,lift:0,z:ft,lean:u.lean*c}}function No(e,t){let a=Ce(),o=1-Math.exp(-t/(ae()?.04:u.hoverTau)),n=!1;for(let r of Ht){let c=a[r]-e.pose[r];Math.abs(c)>.001?(e.pose[r]+=c*o,n=!0):e.pose[r]=a[r]}return e.pose.opacity=1,n}function jo(e,t){let a=ae()?{delay:0,drop:90,pause:0,lean:60}:Ho,o=V();if(t<a.delay)return{...e};let n=t-a.delay,r={...o,lean:Math.min(e.lean,o.lean)};if(n<a.drop)return dt(e,r,ut(n/a.drop));let c=n-a.drop-a.pause;return c<0?r:c<a.lean?dt(r,o,ut(c/a.lean)):null}var Ko=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,Ka=`
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
}`,Za=`
uniform sampler2D uSharp;
uniform sampler2D uBlur;
uniform float uMix;
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(mix(texture2D(uSharp, vUv).rgb, texture2D(uBlur, vUv).rgb, uMix), 1.0);
  #include <colorspace_fragment>
}`;function Zo(e){let t=new He(4,4,{samples:4,colorSpace:he}),a={type:ot,depthBuffer:!1,minFilter:ke,magFilter:ke},o=new He(4,4,a),n=new He(4,4,a),r=new X({uniforms:{uTex:{value:null},uDir:{value:new ee},uSigma:{value:0}},vertexShader:Ko,fragmentShader:Ka,depthTest:!1,depthWrite:!1}),c=new X({uniforms:{uSharp:{value:t.texture},uBlur:{value:o.texture},uMix:{value:0}},vertexShader:Ko,fragmentShader:Za,depthTest:!1,depthWrite:!1}),i=new S(new te(2,2),r);i.frustumCulled=!1;let l=new ie;l.add(i);let f=new st,p=.5,d=(h,v)=>{i.material=h,e.setRenderTarget(v),e.render(l,f)};return{resize(h,v){t.setSize(h,v),o.setSize(Math.ceil(h/2),Math.ceil(v/2)),n.setSize(Math.ceil(h/2),Math.ceil(v/2)),p=e.getPixelRatio()/2},background(h,v,A){let Re=e.getRenderTarget();e.setRenderTarget(t),e.clear(),e.render(h,v);let Ve=A*p;r.uniforms.uSigma.value=Ve,r.uniforms.uTex.value=t.texture,r.uniforms.uDir.value.set(1/o.width,0),d(r,n),r.uniforms.uTex.value=n.texture,r.uniforms.uDir.value.set(0,1/o.height),d(r,o),e.setRenderTarget(Re)},composite(h){c.uniforms.uMix.value=h,d(c,null)},dispose(){t.dispose(),o.dispose(),n.dispose(),r.dispose(),c.dispose()}}}var Ct=u.size,Xo=.255*Ct,Lt={x:.3245*Ct,y:.8255*Ct,z:u.thick+.25};function Xa(e){let a=document.createElement("canvas");a.width=a.height=512;let o=a.getContext("2d"),n=512/2,r=512*.44,c=11;o.beginPath();for(let d=0;d<=720;d++){let h=d/720*Math.PI*2,v=r*(1+.065*Math.cos(c*h));o.lineTo(n+v*Math.cos(h),n+v*Math.sin(h))}o.closePath(),o.save(),o.clip();let i=o.createConicGradient?o.createConicGradient(.6,n,n):o.createLinearGradient(0,0,512,512);["#ffa6e6","#9af2dc","#c4b2ff","#ffe596","#9fd6ff","#ffb8dc","#ffa6e6"].forEach((d,h,v)=>i.addColorStop(h/(v.length-1),d)),o.fillStyle=i,o.fillRect(0,0,512,512),[[.3,.3,"#9af2dc"],[.7,.62,"#ffa6e6"],[.42,.72,"#ffe596"],[.68,.28,"#c4b2ff"],[.25,.58,"#ffb8dc"]].forEach(([d,h,v])=>{let A=o.createRadialGradient(d*512,h*512,0,d*512,h*512,102.4);A.addColorStop(0,v+"cc"),A.addColorStop(1,v+"00"),o.fillStyle=A,o.fillRect(0,0,512,512)});let l=o.createRadialGradient(n*.8,n*.7,0,n*.8,n*.7,512*.55);l.addColorStop(0,"rgba(255,255,255,0.75)"),l.addColorStop(1,"rgba(255,255,255,0)"),o.fillStyle=l,o.fillRect(0,0,512,512),o.restore(),o.translate(n,n),o.rotate(12*Math.PI/180),o.fillStyle="#000",o.textAlign="center",o.textBaseline="alphabetic",o.font=`800 ${512*.15}px 'NJ Text', system-ui, sans-serif`;let f=512*.15;e.forEach((d,h)=>o.fillText(d,0,(h-(e.length-1)/2)*f+512*.055));let p=new wo(a);return p.colorSpace=he,p.anisotropy=4,p}var Qo=new nt().setRGB(1,.96,1);function Jo(e){let t=Xa(e.toUpperCase().split(" ")),a=$e(new oe({map:t,emissiveMap:t,color:Qo,emissive:Qo,emissiveIntensity:.5,transparent:!0,roughness:.8,metalness:0,depthWrite:!1}),Oe),o=new S(new te(Xo,Xo),a);o.matrixAutoUpdate=!1,o.visible=!1,o.renderOrder=1;let n=new se().makeTranslation(Lt.x,Lt.y,Lt.z);return{mesh:o,place(r,c){o.visible=c>.002&&r.mesh.visible,o.visible&&(a.opacity=c,o.matrix.multiplyMatrices(r.mesh.matrix,n),o.matrixWorld.copy(o.matrix))}}}var w={width:.682,bottom:.797,lean:56*Math.PI/180,strip:.124,top:132,flatLean:78*Math.PI/180,flatStrip:.07,flatMax:4,drag:150,carry:.06,omega:8.5,details:{size:.815,centreY:.404},wheelNotch:60,groundGain:.838,edgeColour:1842204,shadow:{y0:.403,y1:.794,alpha:.054,feather:20}};function ea(){let e=new X({uniforms:{uSize:{value:new ee(1,1)},uFeather:{value:1},uAlpha:{value:w.shadow.alpha}},vertexShader:"varying vec2 vP; uniform vec2 uSize; void main() { vP = uv * uSize; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`varying vec2 vP; uniform vec2 uSize; uniform float uFeather, uAlpha;
      void main() { float d = min(vP.y, uSize.y - vP.y);   // soft top and bottom; it runs off the left edge and under the crate
        gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha * smoothstep(0.0, uFeather, d)); }`,transparent:!0,depthWrite:!1,toneMapped:!1}),t=new S(new te(1,1),e);return t.renderOrder=-.5,t.visible=!1,{mesh:t,setOpacity(a){e.uniforms.uAlpha.value=w.shadow.alpha*a},layout(a,o,n){let r=-a/2/n-2,c=0,i=(o/2-w.shadow.y1*o)/n,l=(o/2-w.shadow.y0*o)/n;t.scale.set(c-r,l-i,1),t.position.set((r+c)/2,(i+l)/2,.5),t.updateMatrixWorld(),e.uniforms.uSize.value.set(c-r,l-i),e.uniforms.uFeather.value=w.shadow.feather/n}}}function ta(e){let t=u.size,a=0,o=0,n=0,r=null,c=0,i=!1,l=0,f=0,p=0,d=0,h=0,v=1,A=g=>Math.max(0,Math.min(e-1,g));function Re(g,E,b){let D=w.width*g/t;l=(E/2-w.bottom*E)/D;let Te=w.bottom*E-t*D*Math.cos(w.lean);return f=Math.min(w.strip*t,e>1?Math.max(0,Te-w.top)/(e-1)/D:0),p=f*Math.tan(w.lean)+4,d=w.flatStrip*t,h=(e-1)*p+t*Math.sin(w.lean)+10,v=D*(b-h)/b,v}let Ve=g=>d*w.flatMax*(1-Math.exp(-g/w.flatMax));function Fa(g){let E=g.i-a,b=V();if(b.dx=-g.x,E>=0)b.lean=w.lean,b.lift=l+E*f-g.shelfY,b.z=h-E*p;else{let D=-E,Te=Math.min(1,D);b.lean=w.lean+(w.flatLean-w.lean)*Te,b.lift=l-Ve(D)-g.shelfY,b.z=h+.8*t*Te+5*Math.max(0,Ve(D)-Ve(1))}return b}function Ia(g){if(r)return!0;let E=i?30:w.omega,b=E*E*(n-a)-2*E*o;return o+=b*g,a+=o*g,Math.abs(n-a)<.001&&Math.abs(o)<.01?(a=n,o=0,!1):!0}return{layout:Re,pose:Fa,step:Ia,get p(){return a},get current(){return A(Math.round(r?a:n))},get dragging(){return!!r},setReduced(g){i=!!g},go(g){n=A(g)},jump(g){n=a=A(g),o=0},begin(g,E){r={y0:g,p0:a,samples:[[E,g]]},o=0},move(g,E){if(!r)return;let b=r.p0+(g-r.y0)/w.drag;for(b<0?b/=3:b>e-1&&(b=e-1+(b-e+1)/3),a=b,r.samples.push([E,g]);r.samples.length>2&&E-r.samples[0][0]>100;)r.samples.shift()},end(g){if(!r)return 0;let E=r.samples,b=E[0],D=E[E.length-1],Te=Math.abs(D[1]-r.y0),Ba=D[0]-b[0]>8&&g-D[0]<80?(D[1]-b[1])/(D[0]-b[0])*1e3:0;return r=null,o=Math.max(-12,Math.min(12,Ba/w.drag)),n=A(Math.round(a+(i?0:o*w.carry))),i&&(o=0),Te},cancel(){r&&(r=null,n=A(Math.round(a)))},wheel(g){for(c+=g;Math.abs(c)>=w.wheelNotch;){let E=Math.sign(c);n=A(n+E),c-=E*w.wheelNotch}}}}var P=ko,j=document.getElementById("c"),H=new To({canvas:j,antialias:!0,powerPreference:"high-performance"});H.outputColorSpace=he;H.toneMapping=co;var $=new ie,ga=new Ro(H);$.environment=ga.fromScene(new lt,.04).texture;$.environmentIntensity=.46;ga.dispose();var de=Lo();Co(de);L.tops.forEach((e,t)=>de.uShelf.value[t].set(-L.width/2,L.width/2,e-L.thick,e));de.uShelfDepth.value=L.depth;var vt=Po(H,de);$.add(vt.mesh);var Ea=Fo(de);for(let e of Ea)$.add(e);var x=Oo(P);Oe.value=window.__editionsTest?.coverBias??-.5;var we=new vo(new Uint8Array([255,255,255,255]),1,1);we.colorSpace=he;we.needsUpdate=!0;for(let e of x)e.front.map=we,e.back.map=we,$.add(e.mesh);var yt=1,pt=x.find(e=>e.entry.newest)||null,ba=!1,Ye=Jo("Now playing");$.add(Ye.mesh);var Ne=Zo(H),_=2556,M=new xo(20,1,100,_*2);M.position.set(0,0,_);var y=ta(x.length),wt=ea();$.add(wt.mesh);var pe=x.map(()=>null),Sa=x.map(()=>null),Dt=x.map(()=>null),Ja=1,Ma=null,Ra=new Promise(e=>requestAnimationFrame(()=>requestAnimationFrame(e))).then(()=>import("./covers-V2BS4OL4.js")).then(e=>Ma=e),en=(e,t,a)=>Ra.then(o=>o.createCover(H,e.entry,t,a)),oa=()=>gt===null?0:performance.now()-gt,aa=window.__editionsTest?.coverLate||{},tn=0;function Ta(){let e=tn++;if(e>=x.length)return Promise.resolve();let t=x[e],a=()=>{Dt[e]=oa(),Sa[e]=gt===null?null:Math.round(Dt[e]),k()};return en(t,e,{size:1024,backSize:0}).then(o=>{let n=()=>{pe[e]=o,At(t,o.front,null),a()};aa[e]==null?n():setTimeout(n,Math.max(0,Vt(e)+aa[e]-oa()))},o=>{console.warn(`cover ${t.entry.name}: flat sleeve (${o?.message||o})`),a()}).then(Ta)}var on=Ra.then(()=>Promise.all(Array.from({length:Ja},Ta)));function an(e){let t=x[e],a=pe[e]?.detailBack(1024).then(o=>{s&&s.i===e&&(t.back.map=o||we,t.back.color.set(o?16777215:ka),t.back.needsUpdate=!0,k())}).catch(o=>console.warn(`cover ${t.entry.name}: no Details back (${o?.message||o})`));Promise.resolve(a).then(()=>{s&&s.i===e&&s.backIn===null&&(s.backIn=performance.now())})}var Gt=!1,ht=null;function nn(){if(Gt||!pe[0]||re.some(t=>!t))return;Gt=!0;let e=window.requestIdleCallback||(t=>setTimeout(t,200));e(()=>{s||pe[0].detailBack(1024).catch(()=>{}),e(()=>no().then(t=>t.warm()).then(t=>{t&&(ht=t,k())}).catch(t=>console.warn(`world warm-up: ${t?.message||t}`)),{timeout:3e3})},{timeout:2e3})}var ka=15328992,na=600,fe=x.map(()=>null),ra=x.map(()=>0),Vt=e=>m?T(R.appear.at+R.appear.stagger*e):zt(e);function rn(e,t){if(fe[e]===null){if(e>0&&fe[e-1]===null)return null;let a=Vt(e),o=e>0?Math.max(a,fe[e-1]+a-Vt(e-1)):a,n=Dt[e]??(t>=a+na?a+na:null);if(n===null||t<Math.max(o,n))return null;fe[e]=Math.max(o,n),ra[e]=fe[e]-a,pe[e]||sn(x[e])}return ra[e]}function sn(e){let t=Ma?.coverGround?.(e.entry,e.i)||e.entry.accent?.light;t&&e.front.color.set(t)}function ln(e){e.back.map!==we&&(e.back.map=we,e.back.color.set(ka),e.back.needsUpdate=!0)}var We=-1,Ha=0;function cn(e){e!==We&&(We>=0&&(pe[We]?.setAlive(!1),Ha=performance.now()+1700),We=e,e>=0&&pe[e]?.setAlive(!0))}var J=null,Pt=null,$t=document.querySelector(".sound");function Yt(){let e=!!J?.enabled;$t.setAttribute("aria-pressed",String(e)),$t.setAttribute("aria-label",e?"Sound on":"Sound off")}function Nt(){return Pt||(Pt=import("./audio-RSGSU6J4.js").then(e=>(J=e.createAudio(),J.setRoomTone(!0),Yt(),J))),Pt}var Z=(e,t)=>{window.__editions?.soundLog?.push([e,Math.round(performance.now())]),J?.play(e,t)},ge=e=>Math.max(-1,Math.min(1,x[e].x/600));for(let e of["pointermove","pointerdown","keydown","touchstart"])window.addEventListener(e,Nt,{once:!0,capture:!0,passive:!0});var Aa=()=>{J?J.unlock():Nt().then(e=>e.unlock())};window.addEventListener("pointerdown",Aa,{once:!0,capture:!0});window.addEventListener("keydown",Aa,{once:!0,capture:!0});$t.addEventListener("click",async()=>{let e=J||await Nt();e.setEnabled(!e.enabled),Yt()});Yt();var Je=document.getElementById("slots"),Be=x.map(e=>{let t=P[e.i],a=document.createElement("li");a.className="slot";let o=document.createElement("article");o.setAttribute("aria-labelledby",`sl-${e.i}`);let n=document.createElement("h2");if(n.className="sr",n.id=`sl-${e.i}`,n.textContent=t.name,o.appendChild(n),t.tag){let i=document.createElement("p");i.className="sr",i.textContent=t.year?`${t.tag}, ${t.year}`:t.tag,o.appendChild(i)}let r=document.createElement("a");r.dataset.action="open",r.textContent="Open",jt(r,e.i);let c=document.createElement("button");return c.type="button",c.dataset.action="details",c.dataset.index=String(e.i),c.textContent="Details",c.setAttribute("aria-label",`Details: ${t.name}`),o.append(r,c),a.appendChild(o),Je.appendChild(a),a});function jt(e,t){let a=P[t];e.dataset.index=String(t),e.href=a.url||`#${le(a)}`,a.url?(e.target="_blank",e.rel="noopener"):(e.removeAttribute("target"),e.removeAttribute("rel")),e.setAttribute("aria-label",a.url?`Open: ${a.name} site, new tab`:`Open: ${a.name}`)}var et=document.getElementById("crate-bar"),fn=et.querySelector(".cb-year"),un=et.querySelector(".cb-name"),sa=et.querySelector(".cb-details"),dn=et.querySelector(".cb-open"),Ft=document.querySelector(".crate-rail span"),ia=document.getElementById("announce");function tt(e){ia.textContent="",requestAnimationFrame(()=>{ia.textContent=e})}document.getElementById("index").append(...P.map(e=>{let t=document.createElement("li"),a=document.createElement("span");a.className="y",a.textContent=e.year||"";let o=document.createElement("span");return o.className="n",o.textContent=e.name,t.append(a,o),t}));var Rt=document.querySelector(".tagline"),_e=document.getElementById("details"),je=_e.querySelector(".d-title"),Ke=_e.querySelector(".d-tag"),ue=document.getElementById("d-open");function Fe(e,t,a,o){let n=+getComputedStyle(e).opacity;for(let r of e.getAnimations())r.cancel();e.animate([{opacity:n},{opacity:t}],{duration:z(o),delay:T(a),easing:"ease",fill:"both"})}var B=0,C=0,K=1,m=!1,Ot=0,Ut=0,Wt=0,za=0,Pe=0,pn=14,It=new ee;function Kt(){B=window.innerWidth,C=window.innerHeight;let e=m;m=B<600,_=m?2556*4:2556,K=m?y.layout(B,C,_):kt(B,C),M.position.z=_,M.far=_*2;let t=B/2/K,a=C/2/K;if(M.fov=at.radToDeg(2*Math.atan(a/_)),M.aspect=B/C,M.clearViewOffset(),M.updateMatrixWorld(),Pe=0,!m){let l=V(),f=u.size,p=Ee(0,L.tops[0]+f*Math.cos(l.lean),l.z-f*Math.sin(l.lean)+u.thick).y;Pe=Math.max(0,Math.round(Rt.getBoundingClientRect().bottom+pn-p)),Pe&&M.setViewOffset(B,C,0,-Pe,B,C)}H.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),H.setSize(B,C,!1),H.getDrawingBufferSize(It),Ne.resize(It.x,It.y);let o=m?kt(B,C):K,n=B/2/o*1.02,r=C/2/o*1.02,c=Pe/K;vt.resize(-t*1.02,-a*1.02+c,t*1.02,a*1.02+c,Math.ceil(B/2),Math.ceil(C/2),m?[-n,-r,n,r]:null),Ie=ne=!0,Ot=m?w.details.size*B:F.size*K,Ut=m?w.details.centreY*C:C/2-(900/2-F.centreY)*K,Wt=_*(1-u.size*K/Ot),za=(C/2+Pe-Ut)/K*(_-Wt)/_;let i=m||!!window.__editionsTest?.noShelves;for(let l of Ea)l.visible=!i;vt.setGain(m?w.groundGain:1),wt.mesh.visible=m,m&&wt.layout(B,C,K);for(let l of x)l.mats[0].color.set(m?w.edgeColour:15855594);if(L.tops.forEach((l,f)=>i?de.uShelf.value[f].set(0,0,-1e5,-1e5):de.uShelf.value[f].set(-L.width/2,L.width/2,l-L.thick,l)),document.body.classList.toggle("crate",m),m!==e){s&&so(),Me(-1);for(let l of x)re[l.i]&&(l.fall=null,l.pose=qt(l),ce(l));Ge(!0)}else if(m)for(let l of x)re[l.i]&&!(s&&s.i===l.i)&&(l.pose=qt(l),ce(l));La=x.map(l=>hn(l)),m||x.forEach(Qt),xn(),k()}var qt=e=>m?y.pose(e):V(),Bt=new O,ve=new ho;function Ee(e,t,a){return Bt.set(e,t,a).project(M),{x:(Bt.x+1)/2*B,y:(1-Bt.y)/2*C}}function Zt(e){let t=x[e].mesh;t.geometry.boundingBox||t.geometry.computeBoundingBox(),ve.copy(t.geometry.boundingBox).applyMatrix4(t.matrixWorld);let a=1/0,o=1/0,n=-1/0,r=-1/0;for(let c of[ve.min.x,ve.max.x])for(let i of[ve.min.y,ve.max.y])for(let l of[ve.min.z,ve.max.z]){let f=Ee(c,i,l);a=Math.min(a,f.x),n=Math.max(n,f.x),o=Math.min(o,f.y),r=Math.max(r,f.y)}return{x:a,y:o,width:n-a,height:r-o}}var La=[];function hn(e){let t=u.size,a=e.shelfY,o=Ee(e.x-t/2,a+u.hoverLift+t,u.hoverZ),n=Ee(e.x+t/2,a,0);return{x0:o.x,y0:o.y,x1:n.x,y1:n.y}}function Xt(e,t){let a=-1;return La.forEach((o,n)=>{re[n]&&e>=o.x0&&e<=o.x1&&t>=o.y0&&t<=o.y1&&(a=n)}),a}var q=new O,qe=e=>{let t=H.getPixelRatio();return Math.round(e*t)/t};function Qt(e){q.set(-u.size/2,0,u.thick).applyMatrix4(e.mesh.matrixWorld);let t=Ee(q.x,q.y,q.z);q.set(u.size/2,0,u.thick).applyMatrix4(e.mesh.matrixWorld);let o=Ee(q.x,q.y,q.z).x-t.x;Be[e.i].style.transform=`translate3d(${qe(t.x+o*.1175)}px, ${qe(t.y-o*.025-35)}px, 0)`}function mn(e){return{...V(),lean:0,dx:-e.x,lift:za-u.size/2-e.shelfY,z:Wt-u.thick/2}}function xn(){let e=Ut;je.style.top=`${qe(e-54.2)}px`,Ke.style.top=`${qe(e-13.6)}px`,ue.style.top=`${qe(e+Ot/2+16)}px`}var Ze=0,Ue=0,Ie=!0,ne=!0,gt=null,Et=null,be=-1,G=-1,bt=0,s=null,la=-1,ca=!1,re=x.map(()=>!1),N={x:-1,y:-1},De={};De.ready=new Promise(e=>{De.resolve=e});var ir=De.ready;function k(){Ze||(Ze=requestAnimationFrame(wn))}function fa(e,t){let a=u.size,o=u.thick;return{x:e.x+t.dx,y:e.shelfY+t.lift+a/2*Math.cos(t.lean),z:t.z-a/2*Math.sin(t.lean)+o/2}}function ua(e,t,a,o){let n=dt(t,a,o),r=u.size,c=fa(e,t),i=fa(e,a),l=_/(_-c.z),f=_/(_-i.z),p=l+(f-l)*o,d=(c.x*l+(i.x*f-c.x*l)*o)/p,h=(c.y*l+(i.y*f-c.y*l)*o)/p;return n.dx=d-e.x,n.lift=h-e.shelfY-r/2*Math.cos(n.lean),n.z=_*(1-1/p)+r/2*Math.sin(n.lean)-u.thick/2,n}var vn=e=>1-(1-e)**3,da=e=>e*e*(3-2*e),pa=Math.PI*2,ha=e=>ae()?e>=.5?1:0:e,Ca=e=>Math.abs(Math.round(e/Math.PI))%2===1;function yn(e,t){let a=F.fly,o=F.exit,n=F.flip,r=()=>s.flip.from+(s.flip.to-s.flip.from)*Ae(n.ease,I((t-s.flip.t0-T(n.at))/z(n.dur))),c,i;if(s.exit){let l=s.exit,f=t-l.t0,p=Ae(o.ease,I((f-T(o.at))/z(o.dur)));if(c=ua(e,l.from,{...m?y.pose(e):Ce(),yaw:l.yawTo},p),c.yaw=l.from.yaw+(l.yawTo-l.from.yaw)*ha(p),s.blur=l.blur*(1-da(I((f-T(o.blurOut.at))/z(o.blurOut.dur)))),i=f<T(o.at)+z(o.dur)||s.blur>0,!i)return Pa(e,t),!0}else{s.backIn===null&&t-s.asked<F.backWait&&t-s.t0>T(a.at)&&(s.t0=t-T(a.at));let l=t-s.t0,f=Ae(a.ease,I((l-T(a.at))/z(a.dur)));c=ua(e,s.from,mn(e),f),c.yaw=s.turn*ha(f)+r(),s.blur=m?0:da(I((l-T(F.blur.at))/z(F.blur.dur)));let p=Math.max(...[a,F.blur,F.title].map(d=>T(d.at)+z(d.dur)));i=l<p||t-s.flip.t0<T(n.at)+z(n.dur)}return e.pose=c,i}var St=!1;j.addEventListener("webglcontextlost",e=>{e.preventDefault(),!St&&(St=!0,Ze&&cancelAnimationFrame(Ze),s&&so(),ao?.close(),import("./fallback.js").then(t=>t.start(P)))});function wn(e){if(Ze=0,St)return;if(Y>=0){Ue=0;return}let t=Ue?Math.min(.05,(e-Ue)/1e3):0;Ue=e;let a=!1,o=Et===null?-1:e-Et,n=ca,r=m&&y.step(t);ca=r,r?Ge():n&&m&&(Ge(),bn());let c=s||m?-1:be;G!==c&&(s||e-bt>=T(Wo))&&(G>=0&&!(s&&s.i===G)&&(x[G].fall={from:{...x[G].pose},t0:bt}),G=c,G>=0&&(x[G].fall=null)),cn(s?Math.cos(x[s.i].pose.yaw)>0?s.i:-1:G);let i=G!==c;for(let f of x){let p=!1;if(s&&f.i===s.i)p=yn(f,e);else if(re[f.i]){if(m)r&&(f.pose=y.pose(f),p=!0);else if(G===f.i)p=No(f,t);else if(f.fall){let d=jo(f.fall.from,e-f.fall.t0);d?f.pose=d:(f.pose=V(),f.fall=null),p=!0}}else if(o>=0){let d=rn(f.i,o);if(d!==null){let h=m?En(f,o-d):Yo(f.i,o-d);h?f.pose=h:(f.pose=qt(f),re[f.i]=!0)}p=!0}if(p){ce(f),m||Qt(f);let d=!m&&f.pose.z<270;(d||f.shaded)&&(Ie=!0),f.shaded=d,(!s||f.i!==s.i)&&(ne=!0),a=!0}}Ie&&(Uo(x,de,m),vt.bake(),Ie=!1,ne=!0),m&&wt.setOpacity(o<0||fe[0]===null?0:I((o-fe[0])/z(600))),pt&&(Ye.mesh.layers.set(s&&s.i===pt.i?yt:0),Ye.place(pt,ba?0:pt.pose.opacity));let l=We>=0||e<Ha;if(l&&!window.__editionsTest?.stillCovers)for(let f of pe)f?.update(t);if(s){let f=x[s.i],p=F.blur.sigma*s.blur;(ne||p!==la)&&(M.layers.set(0),Ne.background($,M,p),ne=!1,la=p),Ne.composite(Math.min(1,s.blur*4)),M.layers.set(yt),H.autoClear=!1,H.clearDepth(),H.render($,M),H.autoClear=!0,M.layers.set(0)}else ht&&(ht.draw(),ht=null),H.render($,M);xt.firstFrameAt===null&&(xt.firstFrameAt=performance.now(),gn(xt.firstFrameAt),De.resolve(),a=!0),!Gt&&!a&&nn(),a||i||l||r?k():Ue=0}function ma(e){if(!CSS.supports("animation-timing-function","linear(0, 1)"))return"cubic-bezier(0.16, 1, 0.3, 1)";let t=24,a=[],o=1-Math.exp(-1/e);for(let n=0;n<=t;n++)a.push(((1-Math.exp(-(n/t)/e))/o).toFixed(4));return`linear(${a.join(", ")})`}function gn(e){gt=e,Et=window.__editionsTest?.noSleeves?null:e,j.animate([{opacity:0},{opacity:1}],{duration:z(R.canvasFade.dur),easing:R.canvasFade.ease,fill:"forwards"});let t=R.header,a=z(t.tau*5);document.querySelectorAll(".rise").forEach((n,r)=>n.animate([{opacity:0,transform:`translateY(${-t.rise}px)`},{opacity:1,transform:"none"}],{duration:a,delay:T(t.at+t.stagger*r),easing:ma(.2),fill:"forwards"}));let o=R.late;document.querySelectorAll(".late").forEach(n=>n.animate([{opacity:0},{opacity:1}],{duration:z(o.tau*5),delay:T(o.at),easing:ma(.2),fill:"forwards"}))}function Xe(){let e=s?-1:be;Be.forEach((t,a)=>t.classList.toggle("hot",a===e)),j.style.cursor=s?Jt()?"pointer":"":be>=0?"pointer":""}function Me(e,t=!1){e!==be&&(be=e,bt=performance.now(),Xe(),e>=0&&!s&&(t||Z("hover",{pan:ge(e)}),Z("lift",{pan:ge(e),intensity:.8})),k())}function Jt(){if(!s)return!1;let e=Zt(s.i);return N.x>=e.x&&N.x<=e.x+e.width&&N.y>=e.y&&N.y<=e.y+e.height}var Se=-1;window.addEventListener("pointermove",e=>{if(e.pointerType==="touch"||m)return;if(N.x=e.clientX,N.y=e.clientY,s){Xe();return}let t=e.target.closest?.(".pm")?-1:Xt(e.clientX,e.clientY);t!==Se&&(Se=t,Me(t))});document.documentElement.addEventListener("pointerleave",()=>{Se=-1,Me(-1)});window.addEventListener("blur",()=>{Se=-1,Me(-1)});window.addEventListener("resize",Kt);j.addEventListener("click",e=>{if(m)return;if(N.x=e.clientX,N.y=e.clientY,s){if(s.exit)return;Jt()?oo():Tt();return}let t=Xt(e.clientX,e.clientY);t>=0&&to(t)});function En(e,t){let a=I((t-T(R.appear.at+R.appear.stagger*e.i))/z(360));if(a>=1)return null;let o=y.pose(e);return o.opacity=a,ae()||(o.lift+=(1-vn(a))*40/K),o}var xa=-1,va=0;function Ge(e=!1){if(!m)return;let t=x.length,a=y.current,o=P[a],n=Ft.parentElement.clientHeight-Ft.offsetHeight;Ft.style.transform=`translateY(${((1-I(y.p/Math.max(1,t-1)))*n).toFixed(1)}px)`,!(a===xa&&!e)&&(xa=a,fn.textContent=o.year||"",un.textContent=o.name,sa.dataset.index=String(a),sa.setAttribute("aria-label",`Details: ${o.name}`),jt(dn,a))}function bn(){let e=y.current;e!==va&&(va=e,tt(`${P[e].name}, ${e+1} of ${x.length}`))}function Sn(e,t){let a=Math.round(y.p),o=[];for(let n=0;n<a;n++)o.push(n);for(let n=a;n<x.length;n++)o.push(n);for(let n of o){if(!re[n])continue;let r=Zt(n);if(e>=r.x&&e<=r.x+r.width&&t>=r.y&&t<=r.y+r.height)return n}return-1}var ye=null;j.addEventListener("pointerdown",e=>{!m||Y>=0||!e.isPrimary||(ye={x:e.clientX,y:e.clientY,id:e.pointerId},j.setPointerCapture(e.pointerId),s||(y.begin(e.clientY,e.timeStamp),k()))});j.addEventListener("pointermove",e=>{!ye||e.pointerId!==ye.id||s||(y.move(e.clientY,e.timeStamp),Ge(),k())});var eo=e=>t=>{if(!ye||t.pointerId!==ye.id)return;let{x:a,y:o}=ye;ye=null;let n=Math.hypot(t.clientX-a,t.clientY-o);if(e){y.cancel(),k();return}if(s||y.end(t.timeStamp),k(),n>=8)return;if(N.x=t.clientX,N.y=t.clientY,s){if(s.exit)return;Jt()?oo():Tt();return}let r=Sn(t.clientX,t.clientY);r<0||(r===y.current&&Math.abs(y.p-r)<.05?to(r):(y.go(r),Z("tick")))};j.addEventListener("pointerup",eo(!1));j.addEventListener("pointercancel",eo(!0));j.addEventListener("lostpointercapture",eo(!0));var ya=0;window.addEventListener("wheel",e=>{!m||s||Y>=0||(e.preventDefault(),e.timeStamp-ya>200&&y.wheel(0),ya=e.timeStamp,y.wheel(e.deltaY),k())},{passive:!1});et.querySelector(".cb-back").addEventListener("click",()=>Tt());function to(e){if(s||!re[e])return;let t=x[e],a=performance.now();t.fall=null,m&&y.go(e);let o=Qe(document.activeElement)===e?document.activeElement:null,n=!m&&t.x>0?-1:1;s={i:e,t0:a,asked:a,backIn:null,from:{...t.pose},dir:n,turn:n*Math.PI,flip:{from:0,to:0,t0:-1e9},exit:null,blur:0,ret:o},t.mesh.layers.set(yt),ne=!0,an(e),je.textContent=t.entry.name,Ke.textContent=t.entry.tag,jt(ue,e),_e.inert=!1,ue.inert=!1,Je.inert=!0,document.body.classList.add("in-details");let r=F;Fe(Rt,0,r.headerOut.at,r.headerOut.dur);for(let c of[je,Ke])Fe(c,1,r.title.at,r.title.dur);Fe(ue,1,r.open.at,r.open.dur),_e.focus({preventScroll:!0}),Z("details",{pan:ge(e)}),tt(t.entry.tag?`Details: ${t.entry.name}. ${t.entry.tag}`:`Details: ${t.entry.name}`),Xe(),k()}function oo(){if(!s||s.exit)return;let e=performance.now(),t=F.flip,a=s.flip,o=a.from+(a.to-a.from)*Ae(t.ease,I((e-a.t0-T(t.at))/z(t.dur)));s.flip={from:o,to:a.to+s.dir*Math.PI,t0:e},Z("flip"),tt(Ca(s.turn+s.flip.to)?"Back of the sleeve":"Front of the sleeve"),k()}function Tt(){if(!s||s.exit)return;let e=x[s.i],t=performance.now(),a=F.exit,o=e.pose.yaw/pa;s.exit={t0:t,from:{...e.pose},yawTo:pa*(s.dir>0?Math.ceil(o-.5-1e-6):Math.floor(o+.5+1e-6)),blur:s.blur};for(let n of[je,Ke,ue])Fe(n,0,a.at,a.textOut);Fe(Rt,1,a.headerIn.at,a.headerIn.dur),_e.inert=!0,ue.inert=!0,Z("close",{pan:ge(s.i)}),tt("Back to the shelf"),k()}function Pa(e,t,a=!1){let{i:o}=s,n=a?null:s.ret;if(s=null,ln(e),e.pose=m?y.pose(e):Ce(),ce(e),e.mesh.layers.set(0),ne=Ie=!0,Je.inert=!1,document.body.classList.remove("in-details"),m){n&&n.isConnected&&n.focus({preventScroll:!0}),Ge(!0),Xe();return}Se=a?-1:Xt(N.x,N.y),be=Se,bt=t,n&&n.isConnected&&n.focus({preventScroll:!0}),G=be===o?o:-1,G!==o&&(e.fall={from:Ce(),t0:t}),Qt(e),Xe()}var ao=null,wa=null,Y=-1,Mt=!1,mt=0,no=()=>wa||(wa=import("./project-ZYF52NID.js").then(e=>ao=e.createProjectView({renderer:H,entries:P,slugOf:le,onBack:Rn})));function Mn(e){Z("open",{pan:s?0:ge(e)}),no(),P[e].kind!=="about"&&import("./project-ZYF52NID.js").then(t=>t.loadDossier(le(P[e]))),Mt=!0,mt=Ao.cut,tt(`Open: ${P[e].name}`),location.hash=le(P[e])}async function ro(){if(St)return;let e=decodeURIComponent(location.hash.slice(1)),t=P.findIndex(a=>le(a)===e);if(t>=0){if(t===Y)return;let a=await no();if(P.findIndex(o=>le(o)===decodeURIComponent(location.hash.slice(1)))!==t||t===Y)return;s&&so(!0),Me(-1),Y=t;for(let o of j.getAnimations())o.finish();J?.setRoomTone(!1),mt||Z("open"),await a.open(t,{cutAfter:mt}),mt=0}else if(Y>=0){let a=Y;if(Y=-1,ao?.close(),J?.setRoomTone(!0),Z("close",{pan:ge(a)}),Kt(),m){y.jump(a);for(let o of x)re[o.i]&&(o.pose=y.pose(o),ce(o));Ge(!0)}Ie=ne=!0,Be[a].querySelector('[data-action="open"]').focus({preventScroll:!0}),k()}}function Rn(){Mt?(Mt=!1,history.back()):(history.pushState(null,"",location.pathname+location.search),ro())}window.addEventListener("hashchange",()=>{location.hash||(Mt=!1),ro()});function so(e=!1){let t=x[s.i];for(let a of[je,Ke,ue])for(let o of a.getAnimations())o.cancel();Fe(Rt,1,0,1),_e.inert=!0,ue.inert=!0,Pa(t,performance.now(),e),t.fall=null,G=-1}document.addEventListener("click",e=>{let t=e.target.closest("[data-action][data-index]");if(!t)return;let a=+t.dataset.index;if(t.dataset.action==="details"){to(a);return}P[a].url||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||(e.preventDefault(),Mn(a))});var Qe=e=>e&&e.closest&&e.closest(".slot")?Be.indexOf(e.closest(".slot")):-1;Je.addEventListener("focusin",e=>{let t=Qe(e.target);if(!(t<0)){if(m){s||(y.go(t),k());return}Me(t,!0)}});Je.addEventListener("focusout",e=>{Qe(e.relatedTarget)>=0||s||Me(Se)});window.addEventListener("keydown",e=>{if(e.metaKey||e.ctrlKey||e.altKey||Y>=0)return;if(s){e.key==="Escape"?(e.preventDefault(),Tt()):(e.key===" "||e.code==="Space")&&(e.preventDefault(),e.repeat||oo());return}if(m){let r={ArrowLeft:-1,ArrowUp:-1,ArrowRight:1,ArrowDown:1}[e.key];if(r===void 0)return;e.preventDefault();let c=Math.max(0,Math.min(x.length-1,y.current+r));if(c===y.current)return;y.go(c),Qe(document.activeElement)>=0&&Be[c].querySelector(`[data-action="${document.activeElement.dataset.action}"]`).focus({preventScroll:!0}),Z("tick"),k();return}let t={ArrowLeft:-1,ArrowRight:1,ArrowUp:-u.cols,ArrowDown:u.cols}[e.key];if(t===void 0)return;e.preventDefault();let a=Qe(document.activeElement),o=a<0?0:Math.max(0,Math.min(x.length-1,a+t));if(o===a)return;let n=document.activeElement?.dataset?.action==="open"?"open":"details";Be[o].querySelector(`[data-action="${n}"]`).focus({preventScroll:!0}),Z("tick",{pan:ge(o)})});window.addEventListener("keyup",e=>{s&&(e.key===" "||e.code==="Space")&&e.preventDefault()});var io=window.matchMedia("(prefers-reduced-motion: reduce)");it(io.matches);y.setReduced(io.matches);io.addEventListener?.("change",e=>{it(e.matches),y.setReduced(e.matches)});var xt={count:x.length,firstFrameAt:null,ready:De.ready,covers:on,sleeveRect:Zt,frontCorners(e){let t=x[e].mesh.matrixWorld,a=u.size;return[[-a/2,0],[a/2,0],[a/2,a],[-a/2,a]].map(([o,n])=>(q.set(o,n,u.thick).applyMatrix4(t),Ee(q.x,q.y,q.z)))},setCover(e,t,a){At(x[e],t,a),k()},get project(){return Y>=0?le(P[Y]):null},get sleevesAt(){return Et},coverReadyAt:Sa,appearAt:fe,get crate(){return m?{p:y.p,current:y.current,dragging:y.dragging}:null},set stickerOff(e){ba=!!e,k()},get details(){return s?{index:s.i,flipped:Ca(s.turn+s.flip.to),closing:!!s.exit,blur:s.blur,yaw:x[s.i].pose.yaw,backIn:s.backIn===null?null:Math.round(s.backIn-s.asked)}:null}};window.__editions=xt;Kt();for(let e of x)e.mesh.visible=!0;Ye.mesh.visible=!0;for(let e of[!0,!1]){for(let t of x)for(let a of[t.front,t.back,t.mats[0]])a.transparent=e,a.needsUpdate=!0;for(let t of[0,yt])M.layers.set(t),H.render($,M);M.layers.enableAll(),H.render($,M),M.layers.set(0),Ne.background($,M,1),Ne.composite(.5)}for(let e of x)ce(e);Ye.mesh.visible=!1;ne=!0;De.ready.then(()=>{location.hash&&ro()});export{ir as drawn};
