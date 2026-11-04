import{B as T,C as mt,D as re,E as xt,F as Ao,G as me,H as Co,I as Po,J as Io,K as Bo,L as Fo,M as _o,N as oe,O as fe,P as Do,Q as Go,S as $o,T as Vo,U as Oo,a as So,b as Mo,e as Be,i as dt,j as Ro,l as le,m as To,n as pt,o as ce,p as ko,q as W,s as Z,t as Fe,u as Ho,v as he,w as zo,x as ht,y as Lo}from"./chunk-XUX7XAJI.js";import{a as I,b as vt,c as ue,d as k,e as A,f as Se}from"./chunk-U3AZOSC6.js";import{a as Ft,b as Wo,c as xe,e as d,f as _,g as Uo,h as z,i as L,j as qo}from"./chunk-BB35V6BP.js";var yt=class extends me{constructor(){super();let t=new mt;t.deleteAttribute("uv");let o=new fe({side:So}),a=new fe,n=new Go(16777215,900,28,2);n.position.set(.418,16.199,.3),this.add(n);let r=new T(t,o);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let i=new Po(t,a,6),l=new zo;l.position.set(-10.906,2.009,1.846),l.rotation.set(0,-.195,0),l.scale.set(2.328,7.905,4.651),l.updateMatrix(),i.setMatrixAt(0,l.matrix),l.position.set(-5.607,-.754,-.758),l.rotation.set(0,.994,0),l.scale.set(1.97,1.534,3.955),l.updateMatrix(),i.setMatrixAt(1,l.matrix),l.position.set(6.167,.857,7.803),l.rotation.set(0,.561,0),l.scale.set(3.927,6.285,3.687),l.updateMatrix(),i.setMatrixAt(2,l.matrix),l.position.set(-2.017,.018,6.124),l.rotation.set(0,.333,0),l.scale.set(2.002,4.566,2.064),l.updateMatrix(),i.setMatrixAt(3,l.matrix),l.position.set(2.291,-.756,-2.621),l.rotation.set(0,-.286,0),l.scale.set(1.546,1.552,1.496),l.updateMatrix(),i.setMatrixAt(4,l.matrix),l.position.set(-2.193,-.369,-5.547),l.rotation.set(0,.516,0),l.scale.set(3.875,3.487,2.986),l.updateMatrix(),i.setMatrixAt(5,l.matrix),this.add(i);let c=new T(t,_e(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);let f=new T(t,_e(50));f.position.set(-16.109,18.021,-8.207),f.scale.set(.1,2.425,2.751),this.add(f);let h=new T(t,_e(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);let p=new T(t,_e(43));p.position.set(-.462,8.89,14.52),p.scale.set(4.38,5.441,.088),this.add(p);let u=new T(t,_e(20));u.position.set(3.235,11.486,-12.541),u.scale.set(2.5,2,.1),this.add(u);let v=new T(t,_e(100));v.position.set(0,20,0),v.scale.set(1,.1,1),this.add(v)}dispose(){let t=new Set;this.traverse(o=>{o.isMesh&&(t.add(o.geometry),t.add(o.material))});for(let o of t)o.dispose()}};function _e(e){return new Do({color:0,emissive:16777215,emissiveIntensity:e})}var Xa=d.hoverLift.toFixed(2),se=d.cols,No=(d.pitch/2).toFixed(2),Qa={key:{rect:[1148.801,12.997,8768.289,3472.806],z:994.831,power:2.322},fill:{rect:[-2516.226,-9815.124,2516.226,10070.146],z:573.364,power:1.474},shelfAlbedo:1.219,shelfAmbient:.383,contact:{strength:.332,reach:19.033},keyMix:.571,base:{centre:.614,edge:.752,cy:-293.494,rx:806.633,ry:309.574,pow:.304},edgeShade:{strength:.989,reach:5.54},liftShade:{strength:.5,reach:8},halo:{right:.4,left:.383,top:.056,rise:.308,fall:60.395,row2:.724,vfall:10,drop:.881,dropReach:31.417},glow:{strength:.2,fall:100,side:60,fade:24.653,width:1100}},De=4*se;function Yo(){return{uLightRect:{value:[new Z,new Z]},uLightZ:{value:[0,0]},uLightPower:{value:[0,0]},uShelf:{value:[new Z,new Z]},uShelfDepth:{value:0},uSlab:{value:Array.from({length:De},()=>new Z(0,0,0,0))},uSlabZ:{value:new Array(De).fill(1)},uSlabA:{value:new Array(De).fill(0)},uFoot:{value:Array.from({length:2*se},()=>new Z(0,0,0,1e3))},uShelfAlbedo:{value:1},uShelfAmbient:{value:0},uContact:{value:new ce},uHalo:{value:new W},uHaloShape:{value:new Z},uHaloDrop:{value:new ce},uGlow:{value:new Z},uGlowWidth:{value:1e4},uEdgeShade:{value:new Z},uKeyMix:{value:.5},uBase:{value:new W},uBaseShape:{value:new W}}}function jo(e,t=Qa){[t.key,t.fill].forEach((o,a)=>{e.uLightRect.value[a].set(...o.rect),e.uLightZ.value[a]=o.z,e.uLightPower.value[a]=o.power}),e.uShelfAlbedo.value=t.shelfAlbedo,e.uShelfAmbient.value=t.shelfAmbient,e.uContact.value.set(t.contact.strength,t.contact.reach),e.uHalo.value.set(t.halo.right,t.halo.left,t.halo.top),e.uHaloShape.value.set(t.halo.rise,t.halo.fall,t.halo.row2,t.halo.vfall),e.uHaloDrop.value.set(t.halo.drop,t.halo.dropReach),e.uGlow.value.set(t.glow.strength,t.glow.fall,t.glow.side,t.glow.fade),e.uGlowWidth.value=t.glow.width,e.uEdgeShade.value.set(t.edgeShade.strength,t.edgeShade.reach,t.liftShade.strength,t.liftShade.reach),e.uKeyMix.value=t.keyMix,e.uBase.value.set(t.base.centre,t.base.edge,t.base.cy),e.uBaseShape.value.set(t.base.rx,t.base.ry,t.base.pow)}var wt=`
#define PI 3.141592653589793
uniform vec4 uLightRect[2];
uniform float uLightZ[2];
uniform float uLightPower[2];
uniform vec4 uShelf[2];      // x0, x1, y bottom, y top
uniform float uShelfDepth;
uniform vec4 uSlab[${De}];  // x0, y0, x1, y1 of a slab parallel to the wall
uniform float uSlabZ[${De}];
uniform float uSlabA[${De}];  // occlusion strength: the sleeve's opacity
uniform vec4 uFoot[${2*se}];      // per sleeve: x0, x1, bottom edge depth, height of the bottom edge above its shelf

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
    for (int k = 0; k < ${2*se}; k++) {
      int i = row * ${2*se} + k;
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
  for (int k = 0; k < ${se}; k++) {
    int i = row * ${2*se} + k * 2;
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
    float wx = smoothstep(-uGlow.z, uGlow.z, cx + ${No}) - smoothstep(-uGlow.z, uGlow.z, cx - ${No});
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
  for (int k = 0; k < ${se}; k++) {
    int i = row * ${2*se} + k * 2;
    vec4 a = uSlab[i], b = uSlab[i + 1];
    if (a.z <= a.x) continue;
    float dx = min(a.x, b.x) - p.x;
    // It fades toward the top edge with the light beside the sleeve (uHaloDrop), where the sleeve meets the wall.
    if (dx > 0.0 && p.y >= a.y && p.y <= b.w)
      f *= 1.0 - uSlabA[i] * uEdgeShade.x * exp(-dx / uEdgeShade.y) * (1.0 - uHaloDrop.x * (1.0 - smoothstep(0.0, uHaloDrop.y, b.w - p.y)));
    // Under a lifted sleeve: a band from its bottom edge, offset a little to the left.
    float lift = clamp(uFoot[row * ${se} + k].w / ${Xa}, 0.0, 1.0);
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
`;var Ja=`
out vec2 vWorld;
uniform vec4 uRegion; // world x0, y0, x1, y1 covered by the texture
void main() {
  vWorld = mix(uRegion.xy, uRegion.zw, uv);
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`,en=`
precision highp float;
in vec2 vWorld;
out vec4 outColor;
${wt}
void main() {
  int row = rowAt(vWorld.y);
  float seen = mix(wallLight(1, vWorld, row), wallLight(0, vWorld, row), uKeyMix);
  float e = wallBase(vWorld) * seen * edgeShade(vWorld, row) + haloAt(vWorld, row);
  outColor = vec4(vec3(e), 1.0);
}`,tn=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,on=`
uniform sampler2D uBake;
uniform float uGain;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(uBake, vUv).rgb * uGain;
  gl_FragColor = vec4(c, 1.0);
  #include <colorspace_fragment>
  float n = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  gl_FragColor.rgb += (n - 0.5) / 255.0;
}`;function Ko(e,t){let o=new Fe(4,4,{type:dt,format:Ro,depthBuffer:!1,minFilter:Be,magFilter:Be,generateMipmaps:!1}),a=new re({glslVersion:To,uniforms:{...t,uRegion:{value:new Z}},vertexShader:Ja,fragmentShader:en,depthTest:!1,depthWrite:!1}),n=new me;n.add(new T(new oe(2,2),a));let r=new xt,i=new re({uniforms:{uBake:{value:o.texture},uGain:{value:1}},vertexShader:tn,fragmentShader:on,toneMapped:!1}),l=new T(new oe(1,1),i);return l.renderOrder=-1,{mesh:l,resize(c,f,h,p,u,v,R=null){o.setSize(u,v),a.uniforms.uRegion.value.set(...R||[c,f,h,p]),l.scale.set(h-c,p-f,1),l.position.set((c+h)/2,(f+p)/2,0),l.updateMatrixWorld()},setGain(c){i.uniforms.uGain.value=c},bake(){let c=e.getRenderTarget();e.setRenderTarget(o),e.render(n,r),e.setRenderTarget(c)},dispose(){o.dispose(),a.dispose(),i.dispose(),l.geometry.dispose()}}}function an(){let{width:e,depth:t,thick:o,bevel:a}=_,n=new Fo;n.moveTo(0,-o),n.lineTo(t-a,-o),n.absarc(t-a,-o+a,a,-Math.PI/2,0,!1),n.lineTo(t,-a),n.absarc(t-a,-a,a,0,Math.PI/2,!1),n.lineTo(0,0),n.closePath();let r=new _o(n,{depth:e,bevelEnabled:!1,curveSegments:6});return r.applyMatrix4(new he().set(0,0,-1,e/2,0,1,0,0,1,0,0,0,0,0,0,1)),r.computeVertexNormals(),r}var nn=`
varying vec3 vPos;
varying vec3 vNormal;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vPos = w.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,rn=`
${wt}
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
    for (int k = 0; k < ${d.cols}; k++) {
      vec4 f = uFoot[uRow * ${d.cols} + k];   // x0, x1, bottom edge depth, height above the shelf
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
}`;function Zo(e){let t=an();return _.tops.map((o,a)=>{let n=new re({uniforms:{...e,uRow:{value:a}},vertexShader:nn,fragmentShader:rn,toneMapped:!1}),r=new T(t,n);return r.position.set(0,o,0),r.updateMatrixWorld(),r})}var Xo=`
vec3 njNeutral(vec3 c) {
  const float start = 0.76, desat = 0.15;
  float x = min(c.r, min(c.g, c.b));
  c -= x < 0.08 ? x - 6.25 * x * x : 0.04;
  float peak = max(c.r, max(c.g, c.b));
  if (peak < start) return c;
  float d = 1.0 - start, np = 1.0 - d * d / (peak + d - start);
  c *= np / peak;
  return mix(c, vec3(np), 1.0 - 1.0 / (desat * (peak - np) + 1.0));
}`;var X=d.size,gt=X*Math.sin(d.lean),aa={dx:0,yaw:0,opacity:1},Y=()=>({...aa,lift:0,z:gt,lean:d.lean}),Ge=()=>({...aa,lift:d.hoverLift,z:d.hoverZ,lean:0}),_t=["lift","z","lean","dx","yaw"],sn="#d9d6d0";function je(e,t=null){return e.onBeforeCompile=o=>{o.fragmentShader=o.fragmentShader.replace("void main() {",`${Xo}
${t?`uniform float uMapBias;
`:""}void main() {`).replace("#include <tonemapping_fragment>","gl_FragColor.rgb = njNeutral(gl_FragColor.rgb);"),t&&(o.uniforms.uMapBias=t,o.fragmentShader=o.fragmentShader.replace("#include <map_fragment>",$o.map_fragment.replace("texture2D( map, vMapUv )","texture2D( map, vMapUv, uMapBias )")))},e.customProgramCacheKey=()=>t?"nj-neutral-bias":"nj-neutral",e}var Ke={value:0};function na(e){let t=new mt(X,X,d.thick);return t.translate(0,X/2,d.thick/2),e.map((o,a)=>{let n=je(new fe({color:15855594,roughness:.8})),r=a%d.cols,i=Math.floor(a/d.cols),l=Math.min(d.cols,e.length-i*d.cols),c=je(new fe({color:new ht(o.accent?.light||sn),roughness:.8}),Ke),f=je(new fe({color:15328992,roughness:.7})),h=[n,n,n,n,c,f],p=new T(t,h);p.matrixAutoUpdate=!1;let u={i:a,row:i,col:r,mesh:p,front:c,back:f,mats:h,entry:o,x:(r-(l-1)/2)*d.pitch,shelfY:_.tops[i],pose:{...Y(),opacity:0}};return ye(u),u})}var Qo=new ko,ln=new W(1,0,0),Jo=new W,cn=new W(1,1,1),Me=new W,ea=new he,ta=new he,oa=new he;function ye(e){let t=e.pose;Jo.set(e.x+t.dx,e.shelfY+t.lift,t.z),Qo.setFromAxisAngle(ln,-t.lean),e.mesh.matrix.compose(Jo,Qo,cn),t.yaw&&(Me.set(0,X/2,d.thick/2).applyMatrix4(e.mesh.matrix),ta.makeTranslation(Me.x,Me.y,Me.z),oa.makeTranslation(-Me.x,-Me.y,-Me.z),ea.makeRotationY(t.yaw),e.mesh.matrix.premultiply(oa).premultiply(ea).premultiply(ta)),e.mesh.matrixWorld.copy(e.mesh.matrix),e.mesh.visible=t.opacity>.001;let o=t.opacity<.999;for(let a of[e.front,e.back,e.mats[0]])a.transparent!==o&&(a.transparent=o,a.needsUpdate=!0),a.opacity=t.opacity}function ra(e,t,o=!1){for(let a of e){let n=a.pose,r=Math.cos(n.lean),i=Math.sin(n.lean),l=a.shelfY+n.lift,c=d.thick/2,f=a.x+n.dx,h=pt.smoothstep(n.z,110,260),p=a.mesh.visible&&!o?n.opacity*(1-h):0,u=(a.row*d.cols+a.col)*2;for(let v=0;v<2;v++){let R=v/2,O=(v+1)/2;p>0?t.uSlab.value[u+v].set(f-X/2,l+X*R*r,f+X/2,l+X*O*r):t.uSlab.value[u+v].set(0,0,0,0),t.uSlabZ.value[u+v]=Math.max(1.5,n.z-X*(R+O)/2*i+c),t.uSlabA.value[u+v]=p}t.uFoot.value[a.i].set(f-X/2,f+X/2,n.z+d.thick,p>0?n.lift:1e3)}}function Dt(e,t,o){t&&(e.front.map=t,e.front.color.set(16777215),e.front.needsUpdate=!0),o&&(e.back.map=o,e.back.color.set(16777215),e.back.needsUpdate=!0)}var sa=15,Et=e=>e*e,bt=(e,t,o)=>{let a={...t};for(let n of _t)a[n]=e[n]+(t[n]-e[n])*o;return a.opacity=e.opacity+(t.opacity-e.opacity)*o,a};function ia(e){let t=L.appear.at+L.appear.stagger*e,o=L.drop.at+L.drop.stagger*e,a=o+L.drop.dur,n=a+L.lean.delay;return{appear:t,drop:o,land:a,lean:n,rest:n+L.lean.dur}}var Gt=e=>ue()?200+40*e:ia(e).appear;function la(e,t){if(ue()){let l=Gt(e);return t>=l+160?null:{...Y(),opacity:I((t-l)/160)}}let o=ia(e);if(t>=o.rest)return null;if(t<o.appear)return{...Y(),opacity:0};let a=L.appearPose,n=1-.345*Math.exp(-(t-o.appear)/150),r={...Y(),lift:a.lift,z:a.z,lean:0,opacity:n};if(t<o.drop)return r;if(t<o.land){let l=Et(I((t-o.drop)/L.drop.dur));return{...r,lift:a.lift*(1-l),z:a.z+(gt-a.z)*l}}let i=Et(I((t-o.lean)/L.lean.dur));return{...r,lift:0,z:gt,lean:d.lean*i}}function ca(e,t){let o=Ge(),a=1-Math.exp(-t/(ue()?.04:d.hoverTau)),n=!1;for(let r of _t){let i=o[r]-e.pose[r];Math.abs(i)>.001?(e.pose[r]+=i*a,n=!0):e.pose[r]=o[r]}return e.pose.opacity=1,n}function fa(e,t){let o=ue()?{delay:0,drop:90,pause:0,lean:60}:Uo,a=Y();if(t<o.delay)return{...e};let n=t-o.delay,r={...a,lean:Math.min(e.lean,a.lean)};if(n<o.drop)return bt(e,r,Et(n/o.drop));let i=n-o.drop-o.pause;return i<0?r:i<o.lean?bt(r,a,Et(i/o.lean)):null}var ua=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,fn=`
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
}`,un=`
uniform sampler2D uSharp;
uniform sampler2D uBlur;
uniform float uMix;
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(mix(texture2D(uSharp, vUv).rgb, texture2D(uBlur, vUv).rgb, uMix), 1.0);
  #include <colorspace_fragment>
}`;function da(e){let t=new Fe(4,4,{samples:4,colorSpace:le}),o={type:dt,depthBuffer:!1,minFilter:Be,magFilter:Be},a=new Fe(4,4,o),n=new Fe(4,4,o),r=new re({uniforms:{uTex:{value:null},uDir:{value:new ce},uSigma:{value:0}},vertexShader:ua,fragmentShader:fn,depthTest:!1,depthWrite:!1}),i=new re({uniforms:{uSharp:{value:t.texture},uBlur:{value:a.texture},uMix:{value:0}},vertexShader:ua,fragmentShader:un,depthTest:!1,depthWrite:!1}),l=new T(new oe(2,2),r);l.frustumCulled=!1;let c=new me;c.add(l);let f=new xt,h=.5,p=(u,v)=>{l.material=u,e.setRenderTarget(v),e.render(c,f)};return{resize(u,v){t.setSize(u,v),a.setSize(Math.ceil(u/2),Math.ceil(v/2)),n.setSize(Math.ceil(u/2),Math.ceil(v/2)),h=e.getPixelRatio()/2},background(u,v,R){let O=e.getRenderTarget();e.setRenderTarget(t),e.clear(),e.render(u,v);let B=R*h;r.uniforms.uSigma.value=B,r.uniforms.uTex.value=t.texture,r.uniforms.uDir.value.set(1/a.width,0),p(r,n),r.uniforms.uTex.value=n.texture,r.uniforms.uDir.value.set(0,1/a.height),p(r,a),e.setRenderTarget(O)},composite(u){i.uniforms.uMix.value=u,p(i,null)},dispose(){t.dispose(),a.dispose(),n.dispose(),r.dispose(),i.dispose()}}}var Vt=d.size,pa=.255*Vt,$t={x:.3245*Vt,y:.8255*Vt,z:d.thick+.25};function dn(e){let o=document.createElement("canvas");o.width=o.height=512;let a=o.getContext("2d"),n=512/2,r=512*.44,i=11;a.beginPath();for(let p=0;p<=720;p++){let u=p/720*Math.PI*2,v=r*(1+.065*Math.cos(i*u));a.lineTo(n+v*Math.cos(u),n+v*Math.sin(u))}a.closePath(),a.save(),a.clip();let l=a.createConicGradient?a.createConicGradient(.6,n,n):a.createLinearGradient(0,0,512,512);["#ffa6e6","#9af2dc","#c4b2ff","#ffe596","#9fd6ff","#ffb8dc","#ffa6e6"].forEach((p,u,v)=>l.addColorStop(u/(v.length-1),p)),a.fillStyle=l,a.fillRect(0,0,512,512),[[.3,.3,"#9af2dc"],[.7,.62,"#ffa6e6"],[.42,.72,"#ffe596"],[.68,.28,"#c4b2ff"],[.25,.58,"#ffb8dc"]].forEach(([p,u,v])=>{let R=a.createRadialGradient(p*512,u*512,0,p*512,u*512,102.4);R.addColorStop(0,v+"cc"),R.addColorStop(1,v+"00"),a.fillStyle=R,a.fillRect(0,0,512,512)});let c=a.createRadialGradient(n*.8,n*.7,0,n*.8,n*.7,512*.55);c.addColorStop(0,"rgba(255,255,255,0.75)"),c.addColorStop(1,"rgba(255,255,255,0)"),a.fillStyle=c,a.fillRect(0,0,512,512),a.restore(),a.translate(n,n),a.rotate(12*Math.PI/180),a.fillStyle="#000",a.textAlign="center",a.textBaseline="alphabetic",a.font=`800 ${512*.15}px 'NJ Text', system-ui, sans-serif`;let f=512*.15;e.forEach((p,u)=>a.fillText(p,0,(u-(e.length-1)/2)*f+512*.055));let h=new Bo(o);return h.colorSpace=le,h.anisotropy=4,h}var ha=new ht().setRGB(1,.96,1);function ma(e){let t=dn(e.toUpperCase().split(" ")),o=je(new fe({map:t,emissiveMap:t,color:ha,emissive:ha,emissiveIntensity:.5,transparent:!0,roughness:.8,metalness:0,depthWrite:!1}),Ke),a=new T(new oe(pa,pa),o);a.matrixAutoUpdate=!1,a.visible=!1,a.renderOrder=1;let n=new he().makeTranslation($t.x,$t.y,$t.z);return{mesh:a,place(r,i){a.visible=i>.002&&r.mesh.visible,a.visible&&(o.opacity=i,a.matrix.multiplyMatrices(r.mesh.matrix,n),a.matrixWorld.copy(a.matrix))}}}var g={width:.682,bottom:.797,lean:56*Math.PI/180,strip:.124,top:132,flatLean:78*Math.PI/180,flatStrip:.07,flatMax:4,drag:150,carry:.06,omega:8.5,details:{size:.815,centreY:.404},wheelNotch:60,groundGain:.838,edgeColour:1842204,shadow:{y0:.403,y1:.794,alpha:.054,feather:20}};function xa(){let e=new re({uniforms:{uSize:{value:new ce(1,1)},uFeather:{value:1},uAlpha:{value:g.shadow.alpha}},vertexShader:"varying vec2 vP; uniform vec2 uSize; void main() { vP = uv * uSize; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`varying vec2 vP; uniform vec2 uSize; uniform float uFeather, uAlpha;
      void main() { float d = min(vP.y, uSize.y - vP.y);   // soft top and bottom; it runs off the left edge and under the crate
        gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha * smoothstep(0.0, uFeather, d)); }`,transparent:!0,depthWrite:!1,toneMapped:!1}),t=new T(new oe(1,1),e);return t.renderOrder=-.5,t.visible=!1,{mesh:t,setOpacity(o){e.uniforms.uAlpha.value=g.shadow.alpha*o},layout(o,a,n){let r=-o/2/n-2,i=0,l=(a/2-g.shadow.y1*a)/n,c=(a/2-g.shadow.y0*a)/n;t.scale.set(i-r,c-l,1),t.position.set((r+i)/2,(l+c)/2,.5),t.updateMatrixWorld(),e.uniforms.uSize.value.set(i-r,c-l),e.uniforms.uFeather.value=g.shadow.feather/n}}}function va(e){let t=d.size,o=0,a=0,n=0,r=null,i=0,l=!1,c=0,f=0,h=0,p=0,u=0,v=1,R=y=>Math.max(0,Math.min(e-1,y));function O(y,E,b){let F=g.width*y/t;c=(E/2-g.bottom*E)/F;let K=g.bottom*E-t*F*Math.cos(g.lean);return f=Math.min(g.strip*t,e>1?Math.max(0,K-g.top)/(e-1)/F:0),h=f*Math.tan(g.lean)+4,p=g.flatStrip*t,u=(e-1)*h+t*Math.sin(g.lean)+10,v=F*(b-u)/b,v}let B=y=>p*g.flatMax*(1-Math.exp(-y/g.flatMax));function q(y){let E=y.i-o,b=Y();if(b.dx=-y.x,E>=0)b.lean=g.lean,b.lift=c+E*f-y.shelfY,b.z=u-E*h;else{let F=-E,K=Math.min(1,F);b.lean=g.lean+(g.flatLean-g.lean)*K,b.lift=c-B(F)-y.shelfY,b.z=u+.8*t*K+5*Math.max(0,B(F)-B(1))}return b}function Ie(y){if(r)return!0;let E=l?30:g.omega,b=E*E*(n-o)-2*E*a;return a+=b*y,o+=a*y,Math.abs(n-o)<.001&&Math.abs(a)<.01?(o=n,a=0,!1):!0}return{layout:O,pose:q,step:Ie,get p(){return o},get current(){return R(Math.round(r?o:n))},get dragging(){return!!r},setReduced(y){l=!!y},go(y){n=R(y)},jump(y){n=o=R(y),a=0},begin(y,E){r={y0:y,p0:o,samples:[[E,y]]},a=0},move(y,E){if(!r)return;let b=r.p0+(y-r.y0)/g.drag;for(b<0?b/=3:b>e-1&&(b=e-1+(b-e+1)/3),o=b,r.samples.push([E,y]);r.samples.length>2&&E-r.samples[0][0]>100;)r.samples.shift()},end(y){if(!r)return 0;let E=r.samples,b=E[0],F=E[E.length-1],K=Math.abs(F[1]-r.y0),ft=F[0]-b[0]>8&&y-F[0]<80?(F[1]-b[1])/(F[0]-b[0])*1e3:0;return r=null,a=Math.max(-12,Math.min(12,ft/g.drag)),n=R(Math.round(o+(l?0:a*g.carry))),l&&(a=0),K},cancel(){r&&(r=null,n=R(Math.round(o)))},wheel(y){for(i+=y;Math.abs(i)>=g.wheelNotch;){let E=Math.sign(i);n=R(n+E),i-=E*g.wheelNotch}}}}var Ot=16/9,pn=500;function ya({camera:e,layer:t,wake:o,dur:a,els:n}){let{frame:r,video:i,play:l,close:c,shade:f}=n,h=new Io(i);h.colorSpace=le;let p=new Lo({map:h,transparent:!0,opacity:0,toneMapped:!1,depthWrite:!1}),u=new T(new oe(1,1),p);u.rotation.y=Math.PI,u.layers.set(t),u.visible=!1;let v=d.size,R=new W,O=!1,B=!1,q=null,Ie=!1,y=0;for(let S of["loadeddata","seeked"])i.addEventListener(S,()=>{h.needsUpdate=!0,o()});let E=()=>{clearTimeout(y),O&&!Ie&&(Ie=!0,i.play().then(o,()=>{}))},b=(S,M)=>(R.set(S,M,0),u.localToWorld(R),R.project(e),[(R.x+1)/2*innerWidth,(1-R.y)/2*innerHeight]),F=()=>{let[S,M]=b(-.5,.5),[N,Ye]=b(.5,-.5);return{left:Math.min(S,N),top:Math.min(M,Ye),width:Math.abs(N-S),height:Math.abs(Ye-M)}},K=S=>({left:`${S.left}px`,top:`${S.top}px`,width:`${S.width}px`,height:`${S.height}px`}),ft=()=>{let S=Math.min(innerWidth*.92,innerHeight*.86*Ot),M=S/Ot;return{left:(innerWidth-S)/2,top:(innerHeight-M)/2,width:S,height:M}},bo=(S,M,N)=>(Object.assign(r.style,K(M)),r.animate([K(S),K(M)],{duration:a(N),easing:"cubic-bezier(0.3, 0, 0.15, 1)"}).finished.catch(()=>{}));function Za(){!O||B||!q||(B=!0,l.hidden=!0,r.classList.add("on"),f.classList.add("on"),c.hidden=!1,i.muted=!1,E(),bo(q,ft(),560).then(()=>{B&&(i.controls=!0,c.focus({preventScroll:!0}))}))}function ut(S=!1){if(!B)return;B=!1,i.controls=!1,i.muted=!0,f.classList.remove("on"),c.hidden=!0;let M=()=>{B||(r.classList.remove("on"),O&&(l.hidden=!1))};if(S||!q){for(let N of r.getAnimations())N.cancel();M();return}bo(r.getBoundingClientRect(),q,420).then(M)}return l.addEventListener("click",Za),c.addEventListener("click",()=>ut()),f.addEventListener("click",()=>ut()),addEventListener("resize",()=>{B&&Object.assign(r.style,K(ft()))}),{get zoomed(){return B},unzoom:ut,attach(S){let M=S.entry.video;if(!M)return!1;let N=M.band;u.scale.set(v,v*N,1),u.position.set(0,v-v*N/2,-v*.002);let Ye=N*Ot;return h.repeat.set(1,Ye),h.offset.set(0,(1-Ye)/2),S.mesh.add(u),i.getAttribute("src")!==M.src&&(i.poster=M.poster,i.src=M.src),i.muted=!0,i.pause(),i.currentTime=M.start||0,O=!0,Ie=!1,!0},detach(){O&&(ut(!0),O=!1,q=null,clearTimeout(y),i.pause(),u.removeFromParent(),u.visible=!1,p.opacity=0,l.hidden=!0)},update(S,M){if(!O)return!1;if(p.opacity=S,u.visible=S>0,M&&!B){u.parent.updateMatrixWorld(),u.updateMatrixWorld(),q=F();let N={x:q.left+q.width/2,y:q.top+q.height/2};l.style.left=`${N.x}px`,l.style.top=`${N.y}px`,r.classList.contains("on")||Object.assign(r.style,K(q))}return M&&!Ie&&!y&&(y=setTimeout(()=>{y=0,E()},pn)),B||(l.hidden=!M),u.visible&&!i.paused&&o(),u.visible}}}var G=Wo,te=document.getElementById("c"),P=new Oo({canvas:te,antialias:!0,powerPreference:"high-performance"});P.outputColorSpace=le;P.toneMapping=Mo;var j=new me,Fa=new Vo(P);j.environment=Fa.fromScene(new yt,.04).texture;j.environmentIntensity=.46;Fa.dispose();var Ee=Yo();jo(Ee);_.tops.forEach((e,t)=>Ee.uShelf.value[t].set(-_.width/2,_.width/2,e-_.thick,e));Ee.uShelfDepth.value=_.depth;var kt=Ko(P,Ee);j.add(kt.mesh);var _a=Zo(Ee);for(let e of _a)j.add(e);var m=na(G);Ke.value=window.__editionsTest?.coverBias??-.5;var ke=new Co(new Uint8Array([255,255,255,255]),1,1);ke.colorSpace=le;ke.needsUpdate=!0;for(let e of m)e.front.map=ke,e.back.map=ke,j.add(e.mesh);var Je=1,St=m.find(e=>e.entry.newest)||null,Da=!1,et=ma("Now playing");j.add(et.mesh);var tt=da(P),V=2556,H=new Ao(20,1,100,V*2),He=ya({camera:H,layer:Je,wake:()=>C(),dur:k,els:{frame:document.getElementById("film-frame"),video:document.querySelector("#film-frame video"),play:document.getElementById("d-play"),close:document.getElementById("d-close"),shade:document.getElementById("film-shade")}});H.position.set(0,0,V);var w=va(m.length),Ht=xa();j.add(Ht.mesh);var be=m.map(()=>null),Ga=m.map(()=>null),Zt=m.map(()=>null),mn=1,$a=null,Va=new Promise(e=>requestAnimationFrame(()=>requestAnimationFrame(e))).then(()=>import("./covers-FNUIVB3P.js")).then(e=>$a=e),xn=(e,t,o)=>Va.then(a=>a.createCover(P,e.entry,t,o)),wa=()=>zt===null?0:performance.now()-zt,ga=window.__editionsTest?.coverLate||{},vn=0;function Oa(){let e=vn++;if(e>=m.length)return Promise.resolve();let t=m[e],o=()=>{Zt[e]=wa(),Ga[e]=zt===null?null:Math.round(Zt[e]),C()};return xn(t,e,{size:1024,backSize:0}).then(a=>{let n=()=>{be[e]=a,Dt(t,a.front,null),o()};ga[e]==null?n():setTimeout(n,Math.max(0,Qt(e)+ga[e]-wa()))},a=>{console.warn(`cover ${t.entry.name}: flat sleeve (${a?.message||a})`),o()}).then(Oa)}var yn=Va.then(()=>Promise.all(Array.from({length:mn},Oa)));function wn(e){let t=m[e],o=be[e]?.detailBack(1024).then(a=>{s&&s.i===e&&(t.back.map=a||ke,t.back.color.set(a?16777215:Wa),t.back.needsUpdate=!0,C())}).catch(a=>console.warn(`cover ${t.entry.name}: no Details back (${a?.message||a})`));Promise.resolve(o).then(()=>{s&&s.i===e&&s.backIn===null&&(s.backIn=performance.now())})}var Xt=!1,Mt=null;function gn(){if(Xt||!be[0]||pe.some(t=>!t))return;Xt=!0;let e=window.requestIdleCallback||(t=>setTimeout(t,200));e(()=>{s||be[0].detailBack(1024).catch(()=>{}),e(()=>yo().then(t=>t.warm()).then(t=>{t&&(Mt=t,C())}).catch(t=>console.warn(`world warm-up: ${t?.message||t}`)),{timeout:3e3})},{timeout:2e3})}var Wa=15328992,Ea=600,we=m.map(()=>null),ba=m.map(()=>0),Qt=e=>x?A(L.appear.at+L.appear.stagger*e):Gt(e);function En(e,t){if(we[e]===null){if(e>0&&we[e-1]===null)return null;let o=Qt(e),a=e>0?Math.max(o,we[e-1]+o-Qt(e-1)):o,n=Zt[e]??(t>=o+Ea?o+Ea:null);if(n===null||t<Math.max(a,n))return null;we[e]=Math.max(a,n),ba[e]=we[e]-o,be[e]||bn(m[e])}return ba[e]}function bn(e){let t=$a?.coverGround?.(e.entry,e.i)||e.entry.accent?.light;t&&e.front.color.set(t)}function Sn(e){e.back.map!==ke&&(e.back.map=ke,e.back.color.set(Wa),e.back.needsUpdate=!0)}var Xe=-1,Ua=0;function Mn(e){e!==Xe&&(Xe>=0&&(be[Xe]?.setAlive(!1),Ua=performance.now()+1700),Xe=e,e>=0&&be[e]?.setAlive(!0))}var ie=null,Wt=null,Jt=document.querySelector(".sound");function no(){let e=!!ie?.enabled;Jt.setAttribute("aria-pressed",String(e)),Jt.setAttribute("aria-label",e?"Sound on":"Sound off")}function ro(){return Wt||(Wt=import("./audio-RSGSU6J4.js").then(e=>(ie=e.createAudio(),ie.setRoomTone(!0),no(),ie))),Wt}var ne=(e,t)=>{window.__editions?.soundLog?.push([e,Math.round(performance.now())]),ie?.play(e,t)},ze=e=>Math.max(-1,Math.min(1,m[e].x/600));for(let e of["pointermove","pointerdown","keydown","touchstart"])window.addEventListener(e,ro,{once:!0,capture:!0,passive:!0});var qa=()=>{ie?ie.unlock():ro().then(e=>e.unlock())};window.addEventListener("pointerdown",qa,{once:!0,capture:!0});window.addEventListener("keydown",qa,{once:!0,capture:!0});Jt.addEventListener("click",async()=>{let e=ie||await ro();e.setEnabled(!e.enabled),no()});no();var it=document.getElementById("slots"),We=m.map(e=>{let t=G[e.i],o=document.createElement("li");o.className="slot";let a=document.createElement("article");a.setAttribute("aria-labelledby",`sl-${e.i}`);let n=document.createElement("h2");if(n.className="sr",n.id=`sl-${e.i}`,n.textContent=t.name,a.appendChild(n),t.tag){let l=document.createElement("p");l.className="sr",l.textContent=t.year?`${t.tag}, ${t.year}`:t.tag,a.appendChild(l)}let r=document.createElement("a");r.dataset.action="open",r.textContent="Open",so(r,e.i);let i=document.createElement("button");return i.type="button",i.dataset.action="details",i.dataset.index=String(e.i),i.textContent="Details",i.setAttribute("aria-label",`Details: ${t.name}`),a.append(r,i),o.appendChild(a),it.appendChild(o),o});function so(e,t){let o=G[t];e.dataset.index=String(t),e.href=o.url||`#${xe(o)}`,o.url?(e.target="_blank",e.rel="noopener"):(e.removeAttribute("target"),e.removeAttribute("rel")),e.setAttribute("aria-label",o.url?`Open: ${o.name} site, new tab`:`Open: ${o.name}`)}var lt=document.getElementById("crate-bar"),Rn=lt.querySelector(".cb-year"),Tn=lt.querySelector(".cb-name"),Sa=lt.querySelector(".cb-details"),kn=lt.querySelector(".cb-open"),Ut=document.querySelector(".crate-rail span"),Ma=document.getElementById("announce");function ct(e){Ma.textContent="",requestAnimationFrame(()=>{Ma.textContent=e})}document.getElementById("index").append(...G.map(e=>{let t=document.createElement("li"),o=document.createElement("span");o.className="y",o.textContent=e.year||"";let a=document.createElement("span");return a.className="n",a.textContent=e.name,t.append(o,a),t}));var It=document.querySelector(".tagline"),Ue=document.getElementById("details"),ot=Ue.querySelector(".d-title"),at=Ue.querySelector(".d-tag"),ge=document.getElementById("d-open");function Ve(e,t,o,a){let n=+getComputedStyle(e).opacity;for(let r of e.getAnimations())r.cancel();e.animate([{opacity:n},{opacity:t}],{duration:k(a),delay:A(o),easing:"ease",fill:"both"})}var $=0,D=0,ae=1,x=!1,eo=0,to=0,oo=0,Na=0,$e=0,Hn=14,qt=new ce;function io(){$=window.innerWidth,D=window.innerHeight;let e=x;x=$<600,V=x?2556*4:2556,ae=x?w.layout($,D,V):Ft($,D),H.position.z=V,H.far=V*2;let t=$/2/ae,o=D/2/ae;if(H.fov=pt.radToDeg(2*Math.atan(o/V)),H.aspect=$/D,H.clearViewOffset(),H.updateMatrixWorld(),$e=0,!x){let c=Y(),f=d.size,h=Le(0,_.tops[0]+f*Math.cos(c.lean),c.z-f*Math.sin(c.lean)+d.thick).y;$e=Math.max(0,Math.round(It.getBoundingClientRect().bottom+Hn-h)),$e&&H.setViewOffset($,D,0,-$e,$,D)}P.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),P.setSize($,D,!1),P.getDrawingBufferSize(qt),tt.resize(qt.x,qt.y);let a=x?Ft($,D):ae,n=$/2/a*1.02,r=D/2/a*1.02,i=$e/ae;kt.resize(-t*1.02,-o*1.02+i,t*1.02,o*1.02+i,Math.ceil($/2),Math.ceil(D/2),x?[-n,-r,n,r]:null),Oe=de=!0,eo=x?g.details.size*$:z.size*ae,to=x?g.details.centreY*D:D/2-(900/2-z.centreY)*ae,oo=V*(1-d.size*ae/eo),Na=(D/2+$e-to)/ae*(V-oo)/V;let l=x||!!window.__editionsTest?.noShelves;for(let c of _a)c.visible=!l;kt.setGain(x?g.groundGain:1),Ht.mesh.visible=x,x&&Ht.layout($,D,ae);for(let c of m)c.mats[0].color.set(x?g.edgeColour:15855594);if(_.tops.forEach((c,f)=>l?Ee.uShelf.value[f].set(0,0,-1e5,-1e5):Ee.uShelf.value[f].set(-_.width/2,_.width/2,c-_.thick,c)),document.body.classList.toggle("crate",x),x!==e){s&&go(),Pe(-1);for(let c of m)pe[c.i]&&(c.fall=null,c.pose=ao(c),ye(c));Ne(!0)}else if(x)for(let c of m)pe[c.i]&&!(s&&s.i===c.i)&&(c.pose=ao(c),ye(c));Ya=m.map(c=>zn(c)),x||m.forEach(fo),An(),C()}var ao=e=>x?w.pose(e):Y(),Nt=new W,Re=new Ho;function Le(e,t,o){return Nt.set(e,t,o).project(H),{x:(Nt.x+1)/2*$,y:(1-Nt.y)/2*D}}function lo(e){let t=m[e].mesh;t.geometry.boundingBox||t.geometry.computeBoundingBox(),Re.copy(t.geometry.boundingBox).applyMatrix4(t.matrixWorld);let o=1/0,a=1/0,n=-1/0,r=-1/0;for(let i of[Re.min.x,Re.max.x])for(let l of[Re.min.y,Re.max.y])for(let c of[Re.min.z,Re.max.z]){let f=Le(i,l,c);o=Math.min(o,f.x),n=Math.max(n,f.x),a=Math.min(a,f.y),r=Math.max(r,f.y)}return{x:o,y:a,width:n-o,height:r-a}}var Ya=[];function zn(e){let t=d.size,o=e.shelfY,a=Le(e.x-t/2,o+d.hoverLift+t,d.hoverZ),n=Le(e.x+t/2,o,0);return{x0:a.x,y0:a.y,x1:n.x,y1:n.y}}function co(e,t){let o=-1;return Ya.forEach((a,n)=>{pe[n]&&e>=a.x0&&e<=a.x1&&t>=a.y0&&t<=a.y1&&(o=n)}),o}var Q=new W,Qe=e=>{let t=P.getPixelRatio();return Math.round(e*t)/t};function fo(e){Q.set(-d.size/2,0,d.thick).applyMatrix4(e.mesh.matrixWorld);let t=Le(Q.x,Q.y,Q.z);Q.set(d.size/2,0,d.thick).applyMatrix4(e.mesh.matrixWorld);let a=Le(Q.x,Q.y,Q.z).x-t.x;We[e.i].style.transform=`translate3d(${Qe(t.x+a*.1175)}px, ${Qe(t.y-a*.025-35)}px, 0)`}function Ln(e){return{...Y(),lean:0,dx:-e.x,lift:Na-d.size/2-e.shelfY,z:oo-d.thick/2}}function An(){let e=to;ot.style.top=`${Qe(e-54.2)}px`,at.style.top=`${Qe(e-13.6)}px`,ge.style.top=`${Qe(e+eo/2+16)}px`}var nt=0,Ze=0,Oe=!0,de=!0,zt=null,Lt=null,Ae=-1,U=-1,At=0,s=null,Ra=-1,Ta=!1,pe=m.map(()=>!1),ee={x:-1,y:-1},qe={};qe.ready=new Promise(e=>{qe.resolve=e});var Tr=qe.ready;function C(){nt||(nt=requestAnimationFrame(Bn))}function ka(e,t){let o=d.size,a=d.thick;return{x:e.x+t.dx,y:e.shelfY+t.lift+o/2*Math.cos(t.lean),z:t.z-o/2*Math.sin(t.lean)+a/2}}function Ha(e,t,o,a){let n=bt(t,o,a),r=d.size,i=ka(e,t),l=ka(e,o),c=V/(V-i.z),f=V/(V-l.z),h=c+(f-c)*a,p=(i.x*c+(l.x*f-i.x*c)*a)/h,u=(i.y*c+(l.y*f-i.y*c)*a)/h;return n.dx=p-e.x,n.lift=u-e.shelfY-r/2*Math.cos(n.lean),n.z=V*(1-1/h)+r/2*Math.sin(n.lean)-d.thick/2,n}var Cn=e=>1-(1-e)**3,Yt=e=>e*e*(3-2*e),za=Math.PI*2,ja=.1,Pn=450,jt=e=>ue()?e>=0?1:0:Se(z.flip.ease,I(e/k(z.flip.dur))),La=()=>A(z.fly.at)+k(z.fly.dur)*(1-ja),uo=e=>Math.abs(Math.round(e/Math.PI))%2===1;function In(e,t){let o=z.fly,a=z.exit,n=z.flip,r=()=>s.flip.from+(s.flip.to-s.flip.from)*Se(n.ease,I((t-s.flip.t0-A(n.at))/k(n.dur))),i,l;if(s.exit){let c=s.exit,f=t-c.t0,h=f-c.lag,p=Se(a.ease,I((h-A(a.at))/k(a.dur)));if(i=Ha(e,c.from,{...x?w.pose(e):Ge(),yaw:c.yawTo},p),i.yaw=c.from.yaw+(c.yawTo-c.from.yaw)*(c.lag?jt(f):1),s.blur=c.blur*(1-Yt(I((h-A(a.blurOut.at))/k(a.blurOut.dur)))),l=h<A(a.at)+k(a.dur)||s.blur>0,s.film=[c.lag?1-jt(f):0,!1],!l)return He.detach(),Ka(e,t),!0}else{s.backIn===null&&t-s.asked<z.backWait&&t-s.t0>A(o.at)&&(s.t0=t-A(o.at));let c=t-s.t0,f=Se(o.ease,I((c-A(o.at))/k(o.dur)));i=Ha(e,s.from,Ln(e),f),i.yaw=s.turn*jt(c-La())+r(),s.blur=x?0:Yt(I((c-A(z.blur.at))/k(z.blur.dur)));let h=La()+k(n.dur),p=m[s.i].entry.video?k(Pn):0,u=Math.max(h+p,...[o,z.blur,z.title].map(v=>A(v.at)+k(v.dur)));l=c<u||t-s.flip.t0<A(n.at)+k(n.dur),s.film=[p?Yt(I((c-h)/p)):0,!l&&uo(i.yaw)]}return e.pose=i,l}var Ct=!1;te.addEventListener("webglcontextlost",e=>{e.preventDefault(),!Ct&&(Ct=!0,nt&&cancelAnimationFrame(nt),s&&go(),vo?.close(),import("./fallback.js").then(t=>t.start(G)))});function Bn(e){if(nt=0,Ct)return;if(J>=0){Ze=0;return}let t=Ze?Math.min(.05,(e-Ze)/1e3):0;Ze=e;let o=!1,a=Lt===null?-1:e-Lt,n=Ta,r=x&&w.step(t);Ta=r,r?Ne():n&&x&&(Ne(),Dn());let i=s||x?-1:Ae;U!==i&&(s||e-At>=A(sa))&&(U>=0&&!(s&&s.i===U)&&(m[U].fall={from:{...m[U].pose},t0:At}),U=i,U>=0&&(m[U].fall=null)),Mn(s?Math.cos(m[s.i].pose.yaw)>0?s.i:-1:U);let l=U!==i;for(let f of m){let h=!1;if(s&&f.i===s.i)h=In(f,e);else if(pe[f.i]){if(x)r&&(f.pose=w.pose(f),h=!0);else if(U===f.i)h=ca(f,t);else if(f.fall){let p=fa(f.fall.from,e-f.fall.t0);p?f.pose=p:(f.pose=Y(),f.fall=null),h=!0}}else if(a>=0){let p=En(f.i,a);if(p!==null){let u=x?_n(f,a-p):la(f.i,a-p);u?f.pose=u:(f.pose=ao(f),pe[f.i]=!0)}h=!0}if(h){ye(f),x||fo(f);let p=!x&&f.pose.z<270;(p||f.shaded)&&(Oe=!0),f.shaded=p,(!s||f.i!==s.i)&&(de=!0),o=!0}}Oe&&(ra(m,Ee,x),kt.bake(),Oe=!1,de=!0),x&&Ht.setOpacity(a<0||we[0]===null?0:I((a-we[0])/k(600))),St&&(et.mesh.layers.set(s&&s.i===St.i?Je:0),et.place(St,Da?0:St.pose.opacity));let c=Xe>=0||e<Ua;if(c&&!window.__editionsTest?.stillCovers)for(let f of be)f?.update(t);if(s){let f=m[s.i],h=z.blur.sigma*s.blur;(de||h!==Ra)&&(H.layers.set(0),tt.background(j,H,h),de=!1,Ra=h),s.film&&He.update(...s.film),tt.composite(Math.min(1,s.blur*4)),H.layers.set(Je),P.autoClear=!1,P.clearDepth(),P.render(j,H),P.autoClear=!0,H.layers.set(0)}else Mt&&(Mt.draw(),Mt=null),P.render(j,H);Tt.firstFrameAt===null&&(Tt.firstFrameAt=performance.now(),Fn(Tt.firstFrameAt),qe.resolve(),o=!0),!Xt&&!o&&gn(),o||l||c||r?C():Ze=0}function Aa(e){if(!CSS.supports("animation-timing-function","linear(0, 1)"))return"cubic-bezier(0.16, 1, 0.3, 1)";let t=24,o=[],a=1-Math.exp(-1/e);for(let n=0;n<=t;n++)o.push(((1-Math.exp(-(n/t)/e))/a).toFixed(4));return`linear(${o.join(", ")})`}function Fn(e){zt=e,Lt=window.__editionsTest?.noSleeves?null:e,te.animate([{opacity:0},{opacity:1}],{duration:k(L.canvasFade.dur),easing:L.canvasFade.ease,fill:"forwards"});let t=L.header,o=k(t.tau*5);document.querySelectorAll(".rise").forEach((n,r)=>n.animate([{opacity:0,transform:`translateY(${-t.rise}px)`},{opacity:1,transform:"none"}],{duration:o,delay:A(t.at+t.stagger*r),easing:Aa(.2),fill:"forwards"}));let a=L.late;document.querySelectorAll(".late").forEach(n=>n.animate([{opacity:0},{opacity:1}],{duration:k(a.tau*5),delay:A(a.at),easing:Aa(.2),fill:"forwards"}))}function rt(){let e=s?-1:Ae;We.forEach((t,o)=>t.classList.toggle("hot",o===e)),te.style.cursor=s?po()?"pointer":"":Ae>=0?"pointer":""}function Pe(e,t=!1){e!==Ae&&(Ae=e,At=performance.now(),rt(),e>=0&&!s&&(t||ne("hover",{pan:ze(e)}),ne("lift",{pan:ze(e),intensity:.8})),C())}function po(){if(!s)return!1;let e=lo(s.i);return ee.x>=e.x&&ee.x<=e.x+e.width&&ee.y>=e.y&&ee.y<=e.y+e.height}var Ce=-1;window.addEventListener("pointermove",e=>{if(e.pointerType==="touch"||x)return;if(ee.x=e.clientX,ee.y=e.clientY,s){rt();return}let t=e.target.closest?.(".pm")?-1:co(e.clientX,e.clientY);t!==Ce&&(Ce=t,Pe(t))});document.documentElement.addEventListener("pointerleave",()=>{Ce=-1,Pe(-1)});window.addEventListener("blur",()=>{Ce=-1,Pe(-1)});window.addEventListener("resize",io);te.addEventListener("click",e=>{if(x)return;if(ee.x=e.clientX,ee.y=e.clientY,s){if(s.exit)return;po()?xo():Bt();return}let t=co(e.clientX,e.clientY);t>=0&&mo(t)});function _n(e,t){let o=I((t-A(L.appear.at+L.appear.stagger*e.i))/k(360));if(o>=1)return null;let a=w.pose(e);return a.opacity=o,ue()||(a.lift+=(1-Cn(o))*40/ae),a}var Ca=-1,Pa=0;function Ne(e=!1){if(!x)return;let t=m.length,o=w.current,a=G[o],n=Ut.parentElement.clientHeight-Ut.offsetHeight;Ut.style.transform=`translateY(${((1-I(w.p/Math.max(1,t-1)))*n).toFixed(1)}px)`,!(o===Ca&&!e)&&(Ca=o,Rn.textContent=a.year||"",Tn.textContent=a.name,Sa.dataset.index=String(o),Sa.setAttribute("aria-label",`Details: ${a.name}`),so(kn,o))}function Dn(){let e=w.current;e!==Pa&&(Pa=e,ct(`${G[e].name}, ${e+1} of ${m.length}`))}function Gn(e,t){let o=Math.round(w.p),a=[];for(let n=0;n<o;n++)a.push(n);for(let n=o;n<m.length;n++)a.push(n);for(let n of a){if(!pe[n])continue;let r=lo(n);if(e>=r.x&&e<=r.x+r.width&&t>=r.y&&t<=r.y+r.height)return n}return-1}var Te=null;te.addEventListener("pointerdown",e=>{!x||J>=0||!e.isPrimary||(Te={x:e.clientX,y:e.clientY,id:e.pointerId},te.setPointerCapture(e.pointerId),s||(w.begin(e.clientY,e.timeStamp),C()))});te.addEventListener("pointermove",e=>{!Te||e.pointerId!==Te.id||s||(w.move(e.clientY,e.timeStamp),Ne(),C())});var ho=e=>t=>{if(!Te||t.pointerId!==Te.id)return;let{x:o,y:a}=Te;Te=null;let n=Math.hypot(t.clientX-o,t.clientY-a);if(e){w.cancel(),C();return}if(s||w.end(t.timeStamp),C(),n>=8)return;if(ee.x=t.clientX,ee.y=t.clientY,s){if(s.exit)return;po()?xo():Bt();return}let r=Gn(t.clientX,t.clientY);r<0||(r===w.current&&Math.abs(w.p-r)<.05?mo(r):(w.go(r),ne("tick")))};te.addEventListener("pointerup",ho(!1));te.addEventListener("pointercancel",ho(!0));te.addEventListener("lostpointercapture",ho(!0));var Ia=0;window.addEventListener("wheel",e=>{!x||s||J>=0||(e.preventDefault(),e.timeStamp-Ia>200&&w.wheel(0),Ia=e.timeStamp,w.wheel(e.deltaY),C())},{passive:!1});lt.querySelector(".cb-back").addEventListener("click",()=>Bt());function mo(e){if(s||!pe[e])return;let t=m[e],o=performance.now();t.fall=null,x&&w.go(e);let a=st(document.activeElement)===e?document.activeElement:null,n=!x&&t.x>0?-1:1;s={i:e,t0:o,asked:o,backIn:null,from:{...t.pose},dir:n,turn:n*Math.PI,flip:{from:0,to:0,t0:-1e9},exit:null,blur:0,ret:a},t.mesh.layers.set(Je),de=!0,wn(e),ot.textContent=t.entry.name,at.textContent=t.entry.tag,so(ge,e),Ue.inert=!1,ge.inert=!1,it.inert=!0,document.body.classList.add("in-details");let r=z;Ve(It,0,r.headerOut.at,r.headerOut.dur);for(let i of[ot,at])Ve(i,1,r.title.at,r.title.dur);Ve(ge,1,r.open.at,r.open.dur),He.attach(t),Ue.focus({preventScroll:!0}),ne("details",{pan:ze(e)}),ct(t.entry.tag?`Details: ${t.entry.name}. ${t.entry.tag}`:`Details: ${t.entry.name}`),rt(),C()}function xo(){if(!s||s.exit)return;let e=performance.now(),t=z.flip,o=s.flip,a=o.from+(o.to-o.from)*Se(t.ease,I((e-o.t0-A(t.at))/k(t.dur)));s.flip={from:a,to:o.to+s.dir*Math.PI,t0:e},ne("flip"),ct(uo(s.turn+s.flip.to)?"Back of the sleeve":"Front of the sleeve"),C()}function Bt(){if(!s||s.exit)return;let e=m[s.i],t=performance.now(),o=z.exit,a=e.pose.yaw/za,n=za*(s.dir>0?Math.ceil(a-.5-1e-6):Math.floor(a+.5+1e-6)),r=Math.abs(n-e.pose.yaw)<.001?0:k(z.flip.dur)*(1-ja);s.exit={t0:t,from:{...e.pose},yawTo:n,lag:r,blur:s.blur};for(let i of[ot,at,ge])Ve(i,0,o.at,o.textOut);He.unzoom(!0),Ve(It,1,o.headerIn.at,o.headerIn.dur),Ue.inert=!0,ge.inert=!0,ne("close",{pan:ze(s.i)}),ct("Back to the shelf"),C()}function Ka(e,t,o=!1){let{i:a}=s,n=o?null:s.ret;if(s=null,Sn(e),e.pose=x?w.pose(e):Ge(),ye(e),e.mesh.layers.set(0),de=Oe=!0,it.inert=!1,document.body.classList.remove("in-details"),x){n&&n.isConnected&&n.focus({preventScroll:!0}),Ne(!0),rt();return}Ce=o?-1:co(ee.x,ee.y),Ae=Ce,At=t,n&&n.isConnected&&n.focus({preventScroll:!0}),U=Ae===a?a:-1,U!==a&&(e.fall={from:Ge(),t0:t}),fo(e),rt()}var vo=null,Ba=null,J=-1,Pt=!1,Rt=0,yo=()=>Ba||(Ba=import("./project-D7PTWUM4.js").then(e=>vo=e.createProjectView({renderer:P,entries:G,slugOf:xe,onBack:Vn})));function $n(e){ne("open",{pan:s?0:ze(e)}),yo(),G[e].kind!=="about"&&import("./project-D7PTWUM4.js").then(t=>t.loadDossier(xe(G[e]))),Pt=!0,Rt=qo.cut,ct(`Open: ${G[e].name}`),location.hash=xe(G[e])}async function wo(){if(Ct)return;let e=decodeURIComponent(location.hash.slice(1)),t=G.findIndex(o=>xe(o)===e);if(t>=0){if(t===J)return;let o=await yo();if(G.findIndex(a=>xe(a)===decodeURIComponent(location.hash.slice(1)))!==t||t===J)return;s&&go(!0),Pe(-1),J=t;for(let a of te.getAnimations())a.finish();ie?.setRoomTone(!1),Rt||ne("open"),await o.open(t,{cutAfter:Rt}),Rt=0}else if(J>=0){let o=J;if(J=-1,vo?.close(),ie?.setRoomTone(!0),ne("close",{pan:ze(o)}),io(),x){w.jump(o);for(let a of m)pe[a.i]&&(a.pose=w.pose(a),ye(a));Ne(!0)}Oe=de=!0,We[o].querySelector('[data-action="open"]').focus({preventScroll:!0}),C()}}function Vn(){Pt?(Pt=!1,history.back()):(history.pushState(null,"",location.pathname+location.search),wo())}window.addEventListener("hashchange",()=>{location.hash||(Pt=!1),wo()});function go(e=!1){let t=m[s.i];for(let o of[ot,at,ge])for(let a of o.getAnimations())a.cancel();He.detach(),Ve(It,1,0,1),Ue.inert=!0,ge.inert=!0,Ka(t,performance.now(),e),t.fall=null,U=-1}document.addEventListener("click",e=>{let t=e.target.closest("[data-action][data-index]");if(!t)return;let o=+t.dataset.index;if(t.dataset.action==="details"){mo(o);return}G[o].url||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||(e.preventDefault(),$n(o))});var st=e=>e&&e.closest&&e.closest(".slot")?We.indexOf(e.closest(".slot")):-1;it.addEventListener("focusin",e=>{let t=st(e.target);if(!(t<0)){if(x){s||(w.go(t),C());return}Pe(t,!0)}});it.addEventListener("focusout",e=>{st(e.relatedTarget)>=0||s||Pe(Ce)});window.addEventListener("keydown",e=>{if(e.metaKey||e.ctrlKey||e.altKey||J>=0)return;if(s){if(He.zoomed){e.key==="Escape"&&(e.preventDefault(),He.unzoom());return}e.key==="Escape"?(e.preventDefault(),Bt()):(e.key===" "||e.code==="Space")&&(e.preventDefault(),e.repeat||xo());return}if(x){let r={ArrowLeft:-1,ArrowUp:-1,ArrowRight:1,ArrowDown:1}[e.key];if(r===void 0)return;e.preventDefault();let i=Math.max(0,Math.min(m.length-1,w.current+r));if(i===w.current)return;w.go(i),st(document.activeElement)>=0&&We[i].querySelector(`[data-action="${document.activeElement.dataset.action}"]`).focus({preventScroll:!0}),ne("tick"),C();return}let t={ArrowLeft:-1,ArrowRight:1,ArrowUp:-d.cols,ArrowDown:d.cols}[e.key];if(t===void 0)return;e.preventDefault();let o=st(document.activeElement),a=o<0?0:Math.max(0,Math.min(m.length-1,o+t));if(a===o)return;let n=document.activeElement?.dataset?.action==="open"?"open":"details";We[a].querySelector(`[data-action="${n}"]`).focus({preventScroll:!0}),ne("tick",{pan:ze(a)})});window.addEventListener("keyup",e=>{s&&(e.key===" "||e.code==="Space")&&e.preventDefault()});var Eo=window.matchMedia("(prefers-reduced-motion: reduce)");vt(Eo.matches);w.setReduced(Eo.matches);Eo.addEventListener?.("change",e=>{vt(e.matches),w.setReduced(e.matches)});var Tt={count:m.length,firstFrameAt:null,ready:qe.ready,covers:yn,sleeveRect:lo,frontCorners(e){let t=m[e].mesh.matrixWorld,o=d.size;return[[-o/2,0],[o/2,0],[o/2,o],[-o/2,o]].map(([a,n])=>(Q.set(a,n,d.thick).applyMatrix4(t),Le(Q.x,Q.y,Q.z)))},setCover(e,t,o){Dt(m[e],t,o),C()},get project(){return J>=0?xe(G[J]):null},get sleevesAt(){return Lt},coverReadyAt:Ga,appearAt:we,get crate(){return x?{p:w.p,current:w.current,dragging:w.dragging}:null},set stickerOff(e){Da=!!e,C()},get details(){return s?{index:s.i,flipped:uo(s.turn+s.flip.to),closing:!!s.exit,blur:s.blur,yaw:m[s.i].pose.yaw,backIn:s.backIn===null?null:Math.round(s.backIn-s.asked)}:null}};window.__editions=Tt;io();for(let e of m)e.mesh.visible=!0;et.mesh.visible=!0;for(let e of[!0,!1]){for(let t of m)for(let o of[t.front,t.back,t.mats[0]])o.transparent=e,o.needsUpdate=!0;for(let t of[0,Je])H.layers.set(t),P.render(j,H);H.layers.enableAll(),P.render(j,H),H.layers.set(0),tt.background(j,H,1),tt.composite(.5)}for(let e of m)ye(e);et.mesh.visible=!1;de=!0;qe.ready.then(()=>{location.hash&&wo()});export{Tr as drawn};
