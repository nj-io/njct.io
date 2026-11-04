import{B as R,C as ht,D as ne,E as mt,F as zo,G as me,H as Ao,I as Lo,J as Co,K as Po,L as Bo,M as Io,N as te,O as ce,P as Fo,Q as _o,S as Go,T as Do,U as $o,a as Eo,b as bo,e as Ie,i as ut,j as So,l as ie,m as Mo,n as dt,o as le,p as Ro,q as O,s as K,t as Fe,u as To,v as he,w as ko,x as pt,y as Ho}from"./chunk-XUX7XAJI.js";import{a as _,b as xt,c as fe,d as k,e as L,f as Se}from"./chunk-U3AZOSC6.js";import{a as Ft,b as Vo,c as xe,e as d,f as F,g as Oo,h as z,i as A,j as Wo}from"./chunk-BB35V6BP.js";var vt=class extends me{constructor(){super();let t=new ht;t.deleteAttribute("uv");let a=new ce({side:Eo}),o=new ce,n=new _o(16777215,900,28,2);n.position.set(.418,16.199,.3),this.add(n);let r=new R(t,a);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let i=new Lo(t,o,6),l=new ko;l.position.set(-10.906,2.009,1.846),l.rotation.set(0,-.195,0),l.scale.set(2.328,7.905,4.651),l.updateMatrix(),i.setMatrixAt(0,l.matrix),l.position.set(-5.607,-.754,-.758),l.rotation.set(0,.994,0),l.scale.set(1.97,1.534,3.955),l.updateMatrix(),i.setMatrixAt(1,l.matrix),l.position.set(6.167,.857,7.803),l.rotation.set(0,.561,0),l.scale.set(3.927,6.285,3.687),l.updateMatrix(),i.setMatrixAt(2,l.matrix),l.position.set(-2.017,.018,6.124),l.rotation.set(0,.333,0),l.scale.set(2.002,4.566,2.064),l.updateMatrix(),i.setMatrixAt(3,l.matrix),l.position.set(2.291,-.756,-2.621),l.rotation.set(0,-.286,0),l.scale.set(1.546,1.552,1.496),l.updateMatrix(),i.setMatrixAt(4,l.matrix),l.position.set(-2.193,-.369,-5.547),l.rotation.set(0,.516,0),l.scale.set(3.875,3.487,2.986),l.updateMatrix(),i.setMatrixAt(5,l.matrix),this.add(i);let c=new R(t,_e(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);let f=new R(t,_e(50));f.position.set(-16.109,18.021,-8.207),f.scale.set(.1,2.425,2.751),this.add(f);let h=new R(t,_e(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);let p=new R(t,_e(43));p.position.set(-.462,8.89,14.52),p.scale.set(4.38,5.441,.088),this.add(p);let u=new R(t,_e(20));u.position.set(3.235,11.486,-12.541),u.scale.set(2.5,2,.1),this.add(u);let v=new R(t,_e(100));v.position.set(0,20,0),v.scale.set(1,.1,1),this.add(v)}dispose(){let t=new Set;this.traverse(a=>{a.isMesh&&(t.add(a.geometry),t.add(a.material))});for(let a of t)a.dispose()}};function _e(e){return new Fo({color:0,emissive:16777215,emissiveIntensity:e})}var ja=d.hoverLift.toFixed(2),re=d.cols,Uo=(d.pitch/2).toFixed(2),Ka={key:{rect:[1148.801,12.997,8768.289,3472.806],z:994.831,power:2.322},fill:{rect:[-2516.226,-9815.124,2516.226,10070.146],z:573.364,power:1.474},shelfAlbedo:1.219,shelfAmbient:.383,contact:{strength:.332,reach:19.033},keyMix:.571,base:{centre:.614,edge:.752,cy:-293.494,rx:806.633,ry:309.574,pow:.304},edgeShade:{strength:.989,reach:5.54},liftShade:{strength:.5,reach:8},halo:{right:.4,left:.383,top:.056,rise:.308,fall:60.395,row2:.724,vfall:10,drop:.881,dropReach:31.417},glow:{strength:.2,fall:100,side:60,fade:24.653,width:1100}},Ge=4*re;function qo(){return{uLightRect:{value:[new K,new K]},uLightZ:{value:[0,0]},uLightPower:{value:[0,0]},uShelf:{value:[new K,new K]},uShelfDepth:{value:0},uSlab:{value:Array.from({length:Ge},()=>new K(0,0,0,0))},uSlabZ:{value:new Array(Ge).fill(1)},uSlabA:{value:new Array(Ge).fill(0)},uFoot:{value:Array.from({length:2*re},()=>new K(0,0,0,1e3))},uShelfAlbedo:{value:1},uShelfAmbient:{value:0},uContact:{value:new le},uHalo:{value:new O},uHaloShape:{value:new K},uHaloDrop:{value:new le},uGlow:{value:new K},uGlowWidth:{value:1e4},uEdgeShade:{value:new K},uKeyMix:{value:.5},uBase:{value:new O},uBaseShape:{value:new O}}}function No(e,t=Ka){[t.key,t.fill].forEach((a,o)=>{e.uLightRect.value[o].set(...a.rect),e.uLightZ.value[o]=a.z,e.uLightPower.value[o]=a.power}),e.uShelfAlbedo.value=t.shelfAlbedo,e.uShelfAmbient.value=t.shelfAmbient,e.uContact.value.set(t.contact.strength,t.contact.reach),e.uHalo.value.set(t.halo.right,t.halo.left,t.halo.top),e.uHaloShape.value.set(t.halo.rise,t.halo.fall,t.halo.row2,t.halo.vfall),e.uHaloDrop.value.set(t.halo.drop,t.halo.dropReach),e.uGlow.value.set(t.glow.strength,t.glow.fall,t.glow.side,t.glow.fade),e.uGlowWidth.value=t.glow.width,e.uEdgeShade.value.set(t.edgeShade.strength,t.edgeShade.reach,t.liftShade.strength,t.liftShade.reach),e.uKeyMix.value=t.keyMix,e.uBase.value.set(t.base.centre,t.base.edge,t.base.cy),e.uBaseShape.value.set(t.base.rx,t.base.ry,t.base.pow)}var yt=`
#define PI 3.141592653589793
uniform vec4 uLightRect[2];
uniform float uLightZ[2];
uniform float uLightPower[2];
uniform vec4 uShelf[2];      // x0, x1, y bottom, y top
uniform float uShelfDepth;
uniform vec4 uSlab[${Ge}];  // x0, y0, x1, y1 of a slab parallel to the wall
uniform float uSlabZ[${Ge}];
uniform float uSlabA[${Ge}];  // occlusion strength: the sleeve's opacity
uniform vec4 uFoot[${2*re}];      // per sleeve: x0, x1, bottom edge depth, height of the bottom edge above its shelf

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
    for (int k = 0; k < ${2*re}; k++) {
      int i = row * ${2*re} + k;
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
  for (int k = 0; k < ${re}; k++) {
    int i = row * ${2*re} + k * 2;
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
    float wx = smoothstep(-uGlow.z, uGlow.z, cx + ${Uo}) - smoothstep(-uGlow.z, uGlow.z, cx - ${Uo});
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
  for (int k = 0; k < ${re}; k++) {
    int i = row * ${2*re} + k * 2;
    vec4 a = uSlab[i], b = uSlab[i + 1];
    if (a.z <= a.x) continue;
    float dx = min(a.x, b.x) - p.x;
    // It fades toward the top edge with the light beside the sleeve (uHaloDrop), where the sleeve meets the wall.
    if (dx > 0.0 && p.y >= a.y && p.y <= b.w)
      f *= 1.0 - uSlabA[i] * uEdgeShade.x * exp(-dx / uEdgeShade.y) * (1.0 - uHaloDrop.x * (1.0 - smoothstep(0.0, uHaloDrop.y, b.w - p.y)));
    // Under a lifted sleeve: a band from its bottom edge, offset a little to the left.
    float lift = clamp(uFoot[row * ${re} + k].w / ${ja}, 0.0, 1.0);
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
`;var Za=`
out vec2 vWorld;
uniform vec4 uRegion; // world x0, y0, x1, y1 covered by the texture
void main() {
  vWorld = mix(uRegion.xy, uRegion.zw, uv);
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`,Xa=`
precision highp float;
in vec2 vWorld;
out vec4 outColor;
${yt}
void main() {
  int row = rowAt(vWorld.y);
  float seen = mix(wallLight(1, vWorld, row), wallLight(0, vWorld, row), uKeyMix);
  float e = wallBase(vWorld) * seen * edgeShade(vWorld, row) + haloAt(vWorld, row);
  outColor = vec4(vec3(e), 1.0);
}`,Qa=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,Ja=`
uniform sampler2D uBake;
uniform float uGain;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(uBake, vUv).rgb * uGain;
  gl_FragColor = vec4(c, 1.0);
  #include <colorspace_fragment>
  float n = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  gl_FragColor.rgb += (n - 0.5) / 255.0;
}`;function Yo(e,t){let a=new Fe(4,4,{type:ut,format:So,depthBuffer:!1,minFilter:Ie,magFilter:Ie,generateMipmaps:!1}),o=new ne({glslVersion:Mo,uniforms:{...t,uRegion:{value:new K}},vertexShader:Za,fragmentShader:Xa,depthTest:!1,depthWrite:!1}),n=new me;n.add(new R(new te(2,2),o));let r=new mt,i=new ne({uniforms:{uBake:{value:a.texture},uGain:{value:1}},vertexShader:Qa,fragmentShader:Ja,toneMapped:!1}),l=new R(new te(1,1),i);return l.renderOrder=-1,{mesh:l,resize(c,f,h,p,u,v,S=null){a.setSize(u,v),o.uniforms.uRegion.value.set(...S||[c,f,h,p]),l.scale.set(h-c,p-f,1),l.position.set((c+h)/2,(f+p)/2,0),l.updateMatrixWorld()},setGain(c){i.uniforms.uGain.value=c},bake(){let c=e.getRenderTarget();e.setRenderTarget(a),e.render(n,r),e.setRenderTarget(c)},dispose(){a.dispose(),o.dispose(),i.dispose(),l.geometry.dispose()}}}function en(){let{width:e,depth:t,thick:a,bevel:o}=F,n=new Bo;n.moveTo(0,-a),n.lineTo(t-o,-a),n.absarc(t-o,-a+o,o,-Math.PI/2,0,!1),n.lineTo(t,-o),n.absarc(t-o,-o,o,0,Math.PI/2,!1),n.lineTo(0,0),n.closePath();let r=new Io(n,{depth:e,bevelEnabled:!1,curveSegments:6});return r.applyMatrix4(new he().set(0,0,-1,e/2,0,1,0,0,1,0,0,0,0,0,0,1)),r.computeVertexNormals(),r}var tn=`
varying vec3 vPos;
varying vec3 vNormal;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vPos = w.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,on=`
${yt}
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
}`;function jo(e){let t=en();return F.tops.map((a,o)=>{let n=new ne({uniforms:{...e,uRow:{value:o}},vertexShader:tn,fragmentShader:on,toneMapped:!1}),r=new R(t,n);return r.position.set(0,a,0),r.updateMatrixWorld(),r})}var Ko=`
vec3 njNeutral(vec3 c) {
  const float start = 0.76, desat = 0.15;
  float x = min(c.r, min(c.g, c.b));
  c -= x < 0.08 ? x - 6.25 * x * x : 0.04;
  float peak = max(c.r, max(c.g, c.b));
  if (peak < start) return c;
  float d = 1.0 - start, np = 1.0 - d * d / (peak + d - start);
  c *= np / peak;
  return mix(c, vec3(np), 1.0 - 1.0 / (desat * (peak - np) + 1.0));
}`;var Z=d.size,wt=Z*Math.sin(d.lean),ta={dx:0,yaw:0,opacity:1},Y=()=>({...ta,lift:0,z:wt,lean:d.lean}),De=()=>({...ta,lift:d.hoverLift,z:d.hoverZ,lean:0}),_t=["lift","z","lean","dx","yaw"],an="#d9d6d0";function je(e,t=null){return e.onBeforeCompile=a=>{a.fragmentShader=a.fragmentShader.replace("void main() {",`${Ko}
${t?`uniform float uMapBias;
`:""}void main() {`).replace("#include <tonemapping_fragment>","gl_FragColor.rgb = njNeutral(gl_FragColor.rgb);"),t&&(a.uniforms.uMapBias=t,a.fragmentShader=a.fragmentShader.replace("#include <map_fragment>",Go.map_fragment.replace("texture2D( map, vMapUv )","texture2D( map, vMapUv, uMapBias )")))},e.customProgramCacheKey=()=>t?"nj-neutral-bias":"nj-neutral",e}var Ke={value:0};function oa(e){let t=new ht(Z,Z,d.thick);return t.translate(0,Z/2,d.thick/2),e.map((a,o)=>{let n=je(new ce({color:15855594,roughness:.8})),r=o%d.cols,i=Math.floor(o/d.cols),l=Math.min(d.cols,e.length-i*d.cols),c=je(new ce({color:new pt(a.accent?.light||an),roughness:.8}),Ke),f=je(new ce({color:15328992,roughness:.7})),h=[n,n,n,n,c,f],p=new R(t,h);p.matrixAutoUpdate=!1;let u={i:o,row:i,col:r,mesh:p,front:c,back:f,mats:h,entry:a,x:(r-(l-1)/2)*d.pitch,shelfY:F.tops[i],pose:{...Y(),opacity:0}};return ye(u),u})}var Zo=new Ro,nn=new O(1,0,0),Xo=new O,rn=new O(1,1,1),Me=new O,Qo=new he,Jo=new he,ea=new he;function ye(e){let t=e.pose;Xo.set(e.x+t.dx,e.shelfY+t.lift,t.z),Zo.setFromAxisAngle(nn,-t.lean),e.mesh.matrix.compose(Xo,Zo,rn),t.yaw&&(Me.set(0,Z/2,d.thick/2).applyMatrix4(e.mesh.matrix),Jo.makeTranslation(Me.x,Me.y,Me.z),ea.makeTranslation(-Me.x,-Me.y,-Me.z),Qo.makeRotationY(t.yaw),e.mesh.matrix.premultiply(ea).premultiply(Qo).premultiply(Jo)),e.mesh.matrixWorld.copy(e.mesh.matrix),e.mesh.visible=t.opacity>.001;let a=t.opacity<.999;for(let o of[e.front,e.back,e.mats[0]])o.transparent!==a&&(o.transparent=a,o.needsUpdate=!0),o.opacity=t.opacity}function aa(e,t,a=!1){for(let o of e){let n=o.pose,r=Math.cos(n.lean),i=Math.sin(n.lean),l=o.shelfY+n.lift,c=d.thick/2,f=o.x+n.dx,h=dt.smoothstep(n.z,110,260),p=o.mesh.visible&&!a?n.opacity*(1-h):0,u=(o.row*d.cols+o.col)*2;for(let v=0;v<2;v++){let S=v/2,U=(v+1)/2;p>0?t.uSlab.value[u+v].set(f-Z/2,l+Z*S*r,f+Z/2,l+Z*U*r):t.uSlab.value[u+v].set(0,0,0,0),t.uSlabZ.value[u+v]=Math.max(1.5,n.z-Z*(S+U)/2*i+c),t.uSlabA.value[u+v]=p}t.uFoot.value[o.i].set(f-Z/2,f+Z/2,n.z+d.thick,p>0?n.lift:1e3)}}function Gt(e,t,a){t&&(e.front.map=t,e.front.color.set(16777215),e.front.needsUpdate=!0),a&&(e.back.map=a,e.back.color.set(16777215),e.back.needsUpdate=!0)}var na=15,gt=e=>e*e,Et=(e,t,a)=>{let o={...t};for(let n of _t)o[n]=e[n]+(t[n]-e[n])*a;return o.opacity=e.opacity+(t.opacity-e.opacity)*a,o};function ra(e){let t=A.appear.at+A.appear.stagger*e,a=A.drop.at+A.drop.stagger*e,o=a+A.drop.dur,n=o+A.lean.delay;return{appear:t,drop:a,land:o,lean:n,rest:n+A.lean.dur}}var Dt=e=>fe()?200+40*e:ra(e).appear;function sa(e,t){if(fe()){let l=Dt(e);return t>=l+160?null:{...Y(),opacity:_((t-l)/160)}}let a=ra(e);if(t>=a.rest)return null;if(t<a.appear)return{...Y(),opacity:0};let o=A.appearPose,n=1-.345*Math.exp(-(t-a.appear)/150),r={...Y(),lift:o.lift,z:o.z,lean:0,opacity:n};if(t<a.drop)return r;if(t<a.land){let l=gt(_((t-a.drop)/A.drop.dur));return{...r,lift:o.lift*(1-l),z:o.z+(wt-o.z)*l}}let i=gt(_((t-a.lean)/A.lean.dur));return{...r,lift:0,z:wt,lean:d.lean*i}}function ia(e,t){let a=De(),o=1-Math.exp(-t/(fe()?.04:d.hoverTau)),n=!1;for(let r of _t){let i=a[r]-e.pose[r];Math.abs(i)>.001?(e.pose[r]+=i*o,n=!0):e.pose[r]=a[r]}return e.pose.opacity=1,n}function la(e,t){let a=fe()?{delay:0,drop:90,pause:0,lean:60}:Oo,o=Y();if(t<a.delay)return{...e};let n=t-a.delay,r={...o,lean:Math.min(e.lean,o.lean)};if(n<a.drop)return Et(e,r,gt(n/a.drop));let i=n-a.drop-a.pause;return i<0?r:i<a.lean?Et(r,o,gt(i/a.lean)):null}var ca=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,sn=`
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
}`,ln=`
uniform sampler2D uSharp;
uniform sampler2D uBlur;
uniform float uMix;
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(mix(texture2D(uSharp, vUv).rgb, texture2D(uBlur, vUv).rgb, uMix), 1.0);
  #include <colorspace_fragment>
}`;function fa(e){let t=new Fe(4,4,{samples:4,colorSpace:ie}),a={type:ut,depthBuffer:!1,minFilter:Ie,magFilter:Ie},o=new Fe(4,4,a),n=new Fe(4,4,a),r=new ne({uniforms:{uTex:{value:null},uDir:{value:new le},uSigma:{value:0}},vertexShader:ca,fragmentShader:sn,depthTest:!1,depthWrite:!1}),i=new ne({uniforms:{uSharp:{value:t.texture},uBlur:{value:o.texture},uMix:{value:0}},vertexShader:ca,fragmentShader:ln,depthTest:!1,depthWrite:!1}),l=new R(new te(2,2),r);l.frustumCulled=!1;let c=new me;c.add(l);let f=new mt,h=.5,p=(u,v)=>{l.material=u,e.setRenderTarget(v),e.render(c,f)};return{resize(u,v){t.setSize(u,v),o.setSize(Math.ceil(u/2),Math.ceil(v/2)),n.setSize(Math.ceil(u/2),Math.ceil(v/2)),h=e.getPixelRatio()/2},background(u,v,S){let U=e.getRenderTarget();e.setRenderTarget(t),e.clear(),e.render(u,v);let I=S*h;r.uniforms.uSigma.value=I,r.uniforms.uTex.value=t.texture,r.uniforms.uDir.value.set(1/o.width,0),p(r,n),r.uniforms.uTex.value=n.texture,r.uniforms.uDir.value.set(0,1/o.height),p(r,o),e.setRenderTarget(U)},composite(u){i.uniforms.uMix.value=u,p(i,null)},dispose(){t.dispose(),o.dispose(),n.dispose(),r.dispose(),i.dispose()}}}var Vt=d.size,ua=.255*Vt,$t={x:.3245*Vt,y:.8255*Vt,z:d.thick+.25};function cn(e){let a=document.createElement("canvas");a.width=a.height=512;let o=a.getContext("2d"),n=512/2,r=512*.44,i=11;o.beginPath();for(let p=0;p<=720;p++){let u=p/720*Math.PI*2,v=r*(1+.065*Math.cos(i*u));o.lineTo(n+v*Math.cos(u),n+v*Math.sin(u))}o.closePath(),o.save(),o.clip();let l=o.createConicGradient?o.createConicGradient(.6,n,n):o.createLinearGradient(0,0,512,512);["#ffa6e6","#9af2dc","#c4b2ff","#ffe596","#9fd6ff","#ffb8dc","#ffa6e6"].forEach((p,u,v)=>l.addColorStop(u/(v.length-1),p)),o.fillStyle=l,o.fillRect(0,0,512,512),[[.3,.3,"#9af2dc"],[.7,.62,"#ffa6e6"],[.42,.72,"#ffe596"],[.68,.28,"#c4b2ff"],[.25,.58,"#ffb8dc"]].forEach(([p,u,v])=>{let S=o.createRadialGradient(p*512,u*512,0,p*512,u*512,102.4);S.addColorStop(0,v+"cc"),S.addColorStop(1,v+"00"),o.fillStyle=S,o.fillRect(0,0,512,512)});let c=o.createRadialGradient(n*.8,n*.7,0,n*.8,n*.7,512*.55);c.addColorStop(0,"rgba(255,255,255,0.75)"),c.addColorStop(1,"rgba(255,255,255,0)"),o.fillStyle=c,o.fillRect(0,0,512,512),o.restore(),o.translate(n,n),o.rotate(12*Math.PI/180),o.fillStyle="#000",o.textAlign="center",o.textBaseline="alphabetic",o.font=`800 ${512*.15}px 'NJ Text', system-ui, sans-serif`;let f=512*.15;e.forEach((p,u)=>o.fillText(p,0,(u-(e.length-1)/2)*f+512*.055));let h=new Po(a);return h.colorSpace=ie,h.anisotropy=4,h}var da=new pt().setRGB(1,.96,1);function pa(e){let t=cn(e.toUpperCase().split(" ")),a=je(new ce({map:t,emissiveMap:t,color:da,emissive:da,emissiveIntensity:.5,transparent:!0,roughness:.8,metalness:0,depthWrite:!1}),Ke),o=new R(new te(ua,ua),a);o.matrixAutoUpdate=!1,o.visible=!1,o.renderOrder=1;let n=new he().makeTranslation($t.x,$t.y,$t.z);return{mesh:o,place(r,i){o.visible=i>.002&&r.mesh.visible,o.visible&&(a.opacity=i,o.matrix.multiplyMatrices(r.mesh.matrix,n),o.matrixWorld.copy(o.matrix))}}}var g={width:.682,bottom:.797,lean:56*Math.PI/180,strip:.124,top:132,flatLean:78*Math.PI/180,flatStrip:.07,flatMax:4,drag:150,carry:.06,omega:8.5,details:{size:.815,centreY:.404},wheelNotch:60,groundGain:.838,edgeColour:1842204,shadow:{y0:.403,y1:.794,alpha:.054,feather:20}};function ha(){let e=new ne({uniforms:{uSize:{value:new le(1,1)},uFeather:{value:1},uAlpha:{value:g.shadow.alpha}},vertexShader:"varying vec2 vP; uniform vec2 uSize; void main() { vP = uv * uSize; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`varying vec2 vP; uniform vec2 uSize; uniform float uFeather, uAlpha;
      void main() { float d = min(vP.y, uSize.y - vP.y);   // soft top and bottom; it runs off the left edge and under the crate
        gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha * smoothstep(0.0, uFeather, d)); }`,transparent:!0,depthWrite:!1,toneMapped:!1}),t=new R(new te(1,1),e);return t.renderOrder=-.5,t.visible=!1,{mesh:t,setOpacity(a){e.uniforms.uAlpha.value=g.shadow.alpha*a},layout(a,o,n){let r=-a/2/n-2,i=0,l=(o/2-g.shadow.y1*o)/n,c=(o/2-g.shadow.y0*o)/n;t.scale.set(i-r,c-l,1),t.position.set((r+i)/2,(l+c)/2,.5),t.updateMatrixWorld(),e.uniforms.uSize.value.set(i-r,c-l),e.uniforms.uFeather.value=g.shadow.feather/n}}}function ma(e){let t=d.size,a=0,o=0,n=0,r=null,i=0,l=!1,c=0,f=0,h=0,p=0,u=0,v=1,S=w=>Math.max(0,Math.min(e-1,w));function U(w,E,b){let B=g.width*w/t;c=(E/2-g.bottom*E)/B;let pe=g.bottom*E-t*B*Math.cos(g.lean);return f=Math.min(g.strip*t,e>1?Math.max(0,pe-g.top)/(e-1)/B:0),h=f*Math.tan(g.lean)+4,p=g.flatStrip*t,u=(e-1)*h+t*Math.sin(g.lean)+10,v=B*(b-u)/b,v}let I=w=>p*g.flatMax*(1-Math.exp(-w/g.flatMax));function q(w){let E=w.i-a,b=Y();if(b.dx=-w.x,E>=0)b.lean=g.lean,b.lift=c+E*f-w.shelfY,b.z=u-E*h;else{let B=-E,pe=Math.min(1,B);b.lean=g.lean+(g.flatLean-g.lean)*pe,b.lift=c-I(B)-w.shelfY,b.z=u+.8*t*pe+5*Math.max(0,I(B)-I(1))}return b}function ft(w){if(r)return!0;let E=l?30:g.omega,b=E*E*(n-a)-2*E*o;return o+=b*w,a+=o*w,Math.abs(n-a)<.001&&Math.abs(o)<.01?(a=n,o=0,!1):!0}return{layout:U,pose:q,step:ft,get p(){return a},get current(){return S(Math.round(r?a:n))},get dragging(){return!!r},setReduced(w){l=!!w},go(w){n=S(w)},jump(w){n=a=S(w),o=0},begin(w,E){r={y0:w,p0:a,samples:[[E,w]]},o=0},move(w,E){if(!r)return;let b=r.p0+(w-r.y0)/g.drag;for(b<0?b/=3:b>e-1&&(b=e-1+(b-e+1)/3),a=b,r.samples.push([E,w]);r.samples.length>2&&E-r.samples[0][0]>100;)r.samples.shift()},end(w){if(!r)return 0;let E=r.samples,b=E[0],B=E[E.length-1],pe=Math.abs(B[1]-r.y0),Be=B[0]-b[0]>8&&w-B[0]<80?(B[1]-b[1])/(B[0]-b[0])*1e3:0;return r=null,o=Math.max(-12,Math.min(12,Be/g.drag)),n=S(Math.round(a+(l?0:o*g.carry))),l&&(o=0),pe},cancel(){r&&(r=null,n=S(Math.round(a)))},wheel(w){for(i+=w;Math.abs(i)>=g.wheelNotch;){let E=Math.sign(i);n=S(n+E),i-=E*g.wheelNotch}}}}var Ot=16/9;function xa({camera:e,layer:t,wake:a,dur:o,els:n}){let{frame:r,video:i,play:l,close:c,shade:f}=n,h=new Co(i);h.colorSpace=ie;let p=new Ho({map:h,transparent:!0,opacity:0,toneMapped:!1,depthWrite:!1}),u=new R(new te(1,1),p);u.rotation.y=Math.PI,u.layers.set(t),u.visible=!1;let v=d.size,S=new O,U=!1,I=!1,q=null,ft=(M,T)=>(S.set(M,T,0),u.localToWorld(S),S.project(e),[(S.x+1)/2*innerWidth,(1-S.y)/2*innerHeight]),w=()=>{let[M,T]=ft(-.5,.5),[N,Ye]=ft(.5,-.5);return{left:Math.min(M,N),top:Math.min(T,Ye),width:Math.abs(N-M),height:Math.abs(Ye-T)}},E=M=>({left:`${M.left}px`,top:`${M.top}px`,width:`${M.width}px`,height:`${M.height}px`}),b=()=>{let M=Math.min(innerWidth*.92,innerHeight*.86*Ot),T=M/Ot;return{left:(innerWidth-M)/2,top:(innerHeight-T)/2,width:M,height:T}},B=(M,T,N)=>(Object.assign(r.style,E(T)),r.animate([E(M),E(T)],{duration:o(N),easing:"cubic-bezier(0.3, 0, 0.15, 1)"}).finished.catch(()=>{}));function pe(){!U||I||!q||(I=!0,l.hidden=!0,r.classList.add("on"),f.classList.add("on"),c.hidden=!1,i.muted=!1,i.play().catch(()=>{}),B(q,b(),560).then(()=>{I&&(i.controls=!0,c.focus({preventScroll:!0}))}))}function Be(M=!1){if(!I)return;I=!1,i.controls=!1,i.muted=!0,f.classList.remove("on"),c.hidden=!0;let T=()=>{I||(r.classList.remove("on"),U&&(l.hidden=!1))};if(M||!q){for(let N of r.getAnimations())N.cancel();T();return}B(r.getBoundingClientRect(),q,420).then(T)}return l.addEventListener("click",pe),c.addEventListener("click",()=>Be()),f.addEventListener("click",()=>Be()),addEventListener("resize",()=>{I&&Object.assign(r.style,E(b()))}),{get zoomed(){return I},unzoom:Be,attach(M){let T=M.entry.video;if(!T)return!1;let N=T.band;u.scale.set(v,v*N,1),u.position.set(0,v-v*N/2,-v*.002);let Ye=N*Ot;return h.repeat.set(1,Ye),h.offset.set(0,(1-Ye)/2),M.mesh.add(u),i.getAttribute("src")!==T.src&&(i.poster=T.poster,i.src=T.src),i.muted=!0,i.currentTime=0,i.play().catch(()=>{}),U=!0,!0},detach(){U&&(Be(!0),U=!1,q=null,i.pause(),u.removeFromParent(),u.visible=!1,p.opacity=0,l.hidden=!0)},update(M,T){if(!U)return!1;if(p.opacity=M,u.visible=M>0,T&&!I){u.parent.updateMatrixWorld(),u.updateMatrixWorld(),q=w();let N={x:q.left+q.width/2,y:q.top+q.height/2};l.style.left=`${N.x}px`,l.style.top=`${N.y}px`,r.classList.contains("on")||Object.assign(r.style,E(q))}return I||(l.hidden=!T),u.visible&&!i.paused&&a(),u.visible}}}var D=Vo,ee=document.getElementById("c"),P=new $o({canvas:ee,antialias:!0,powerPreference:"high-performance"});P.outputColorSpace=ie;P.toneMapping=bo;var j=new me,Ba=new Do(P);j.environment=Ba.fromScene(new vt,.04).texture;j.environmentIntensity=.46;Ba.dispose();var Ee=qo();No(Ee);F.tops.forEach((e,t)=>Ee.uShelf.value[t].set(-F.width/2,F.width/2,e-F.thick,e));Ee.uShelfDepth.value=F.depth;var kt=Yo(P,Ee);j.add(kt.mesh);var Ia=jo(Ee);for(let e of Ia)j.add(e);var x=oa(D);Ke.value=window.__editionsTest?.coverBias??-.5;var ke=new Ao(new Uint8Array([255,255,255,255]),1,1);ke.colorSpace=ie;ke.needsUpdate=!0;for(let e of x)e.front.map=ke,e.back.map=ke,j.add(e.mesh);var Je=1,bt=x.find(e=>e.entry.newest)||null,Fa=!1,et=pa("Now playing");j.add(et.mesh);var tt=fa(P),V=2556,H=new zo(20,1,100,V*2),He=xa({camera:H,layer:Je,wake:()=>C(),dur:k,els:{frame:document.getElementById("film-frame"),video:document.querySelector("#film-frame video"),play:document.getElementById("d-play"),close:document.getElementById("d-close"),shade:document.getElementById("film-shade")}});H.position.set(0,0,V);var y=ma(x.length),Ht=ha();j.add(Ht.mesh);var be=x.map(()=>null),_a=x.map(()=>null),Kt=x.map(()=>null),un=1,Ga=null,Da=new Promise(e=>requestAnimationFrame(()=>requestAnimationFrame(e))).then(()=>import("./covers-FNUIVB3P.js")).then(e=>Ga=e),dn=(e,t,a)=>Da.then(o=>o.createCover(P,e.entry,t,a)),va=()=>zt===null?0:performance.now()-zt,ya=window.__editionsTest?.coverLate||{},pn=0;function $a(){let e=pn++;if(e>=x.length)return Promise.resolve();let t=x[e],a=()=>{Kt[e]=va(),_a[e]=zt===null?null:Math.round(Kt[e]),C()};return dn(t,e,{size:1024,backSize:0}).then(o=>{let n=()=>{be[e]=o,Gt(t,o.front,null),a()};ya[e]==null?n():setTimeout(n,Math.max(0,Xt(e)+ya[e]-va()))},o=>{console.warn(`cover ${t.entry.name}: flat sleeve (${o?.message||o})`),a()}).then($a)}var hn=Da.then(()=>Promise.all(Array.from({length:un},$a)));function mn(e){let t=x[e],a=be[e]?.detailBack(1024).then(o=>{s&&s.i===e&&(t.back.map=o||ke,t.back.color.set(o?16777215:Va),t.back.needsUpdate=!0,C())}).catch(o=>console.warn(`cover ${t.entry.name}: no Details back (${o?.message||o})`));Promise.resolve(a).then(()=>{s&&s.i===e&&s.backIn===null&&(s.backIn=performance.now())})}var Zt=!1,Mt=null;function xn(){if(Zt||!be[0]||de.some(t=>!t))return;Zt=!0;let e=window.requestIdleCallback||(t=>setTimeout(t,200));e(()=>{s||be[0].detailBack(1024).catch(()=>{}),e(()=>vo().then(t=>t.warm()).then(t=>{t&&(Mt=t,C())}).catch(t=>console.warn(`world warm-up: ${t?.message||t}`)),{timeout:3e3})},{timeout:2e3})}var Va=15328992,wa=600,we=x.map(()=>null),ga=x.map(()=>0),Xt=e=>m?L(A.appear.at+A.appear.stagger*e):Dt(e);function vn(e,t){if(we[e]===null){if(e>0&&we[e-1]===null)return null;let a=Xt(e),o=e>0?Math.max(a,we[e-1]+a-Xt(e-1)):a,n=Kt[e]??(t>=a+wa?a+wa:null);if(n===null||t<Math.max(o,n))return null;we[e]=Math.max(o,n),ga[e]=we[e]-a,be[e]||yn(x[e])}return ga[e]}function yn(e){let t=Ga?.coverGround?.(e.entry,e.i)||e.entry.accent?.light;t&&e.front.color.set(t)}function wn(e){e.back.map!==ke&&(e.back.map=ke,e.back.color.set(Va),e.back.needsUpdate=!0)}var Xe=-1,Oa=0;function gn(e){e!==Xe&&(Xe>=0&&(be[Xe]?.setAlive(!1),Oa=performance.now()+1700),Xe=e,e>=0&&be[e]?.setAlive(!0))}var se=null,Wt=null,Qt=document.querySelector(".sound");function ao(){let e=!!se?.enabled;Qt.setAttribute("aria-pressed",String(e)),Qt.setAttribute("aria-label",e?"Sound on":"Sound off")}function no(){return Wt||(Wt=import("./audio-RSGSU6J4.js").then(e=>(se=e.createAudio(),se.setRoomTone(!0),ao(),se))),Wt}var ae=(e,t)=>{window.__editions?.soundLog?.push([e,Math.round(performance.now())]),se?.play(e,t)},ze=e=>Math.max(-1,Math.min(1,x[e].x/600));for(let e of["pointermove","pointerdown","keydown","touchstart"])window.addEventListener(e,no,{once:!0,capture:!0,passive:!0});var Wa=()=>{se?se.unlock():no().then(e=>e.unlock())};window.addEventListener("pointerdown",Wa,{once:!0,capture:!0});window.addEventListener("keydown",Wa,{once:!0,capture:!0});Qt.addEventListener("click",async()=>{let e=se||await no();e.setEnabled(!e.enabled),ao()});ao();var it=document.getElementById("slots"),We=x.map(e=>{let t=D[e.i],a=document.createElement("li");a.className="slot";let o=document.createElement("article");o.setAttribute("aria-labelledby",`sl-${e.i}`);let n=document.createElement("h2");if(n.className="sr",n.id=`sl-${e.i}`,n.textContent=t.name,o.appendChild(n),t.tag){let l=document.createElement("p");l.className="sr",l.textContent=t.year?`${t.tag}, ${t.year}`:t.tag,o.appendChild(l)}let r=document.createElement("a");r.dataset.action="open",r.textContent="Open",ro(r,e.i);let i=document.createElement("button");return i.type="button",i.dataset.action="details",i.dataset.index=String(e.i),i.textContent="Details",i.setAttribute("aria-label",`Details: ${t.name}`),o.append(r,i),a.appendChild(o),it.appendChild(a),a});function ro(e,t){let a=D[t];e.dataset.index=String(t),e.href=a.url||`#${xe(a)}`,a.url?(e.target="_blank",e.rel="noopener"):(e.removeAttribute("target"),e.removeAttribute("rel")),e.setAttribute("aria-label",a.url?`Open: ${a.name} site, new tab`:`Open: ${a.name}`)}var lt=document.getElementById("crate-bar"),En=lt.querySelector(".cb-year"),bn=lt.querySelector(".cb-name"),Ea=lt.querySelector(".cb-details"),Sn=lt.querySelector(".cb-open"),Ut=document.querySelector(".crate-rail span"),ba=document.getElementById("announce");function ct(e){ba.textContent="",requestAnimationFrame(()=>{ba.textContent=e})}document.getElementById("index").append(...D.map(e=>{let t=document.createElement("li"),a=document.createElement("span");a.className="y",a.textContent=e.year||"";let o=document.createElement("span");return o.className="n",o.textContent=e.name,t.append(a,o),t}));var Bt=document.querySelector(".tagline"),Ue=document.getElementById("details"),ot=Ue.querySelector(".d-title"),at=Ue.querySelector(".d-tag"),ge=document.getElementById("d-open");function Ve(e,t,a,o){let n=+getComputedStyle(e).opacity;for(let r of e.getAnimations())r.cancel();e.animate([{opacity:n},{opacity:t}],{duration:k(o),delay:L(a),easing:"ease",fill:"both"})}var $=0,G=0,oe=1,m=!1,Jt=0,eo=0,to=0,Ua=0,$e=0,Mn=14,qt=new le;function so(){$=window.innerWidth,G=window.innerHeight;let e=m;m=$<600,V=m?2556*4:2556,oe=m?y.layout($,G,V):Ft($,G),H.position.z=V,H.far=V*2;let t=$/2/oe,a=G/2/oe;if(H.fov=dt.radToDeg(2*Math.atan(a/V)),H.aspect=$/G,H.clearViewOffset(),H.updateMatrixWorld(),$e=0,!m){let c=Y(),f=d.size,h=Ae(0,F.tops[0]+f*Math.cos(c.lean),c.z-f*Math.sin(c.lean)+d.thick).y;$e=Math.max(0,Math.round(Bt.getBoundingClientRect().bottom+Mn-h)),$e&&H.setViewOffset($,G,0,-$e,$,G)}P.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),P.setSize($,G,!1),P.getDrawingBufferSize(qt),tt.resize(qt.x,qt.y);let o=m?Ft($,G):oe,n=$/2/o*1.02,r=G/2/o*1.02,i=$e/oe;kt.resize(-t*1.02,-a*1.02+i,t*1.02,a*1.02+i,Math.ceil($/2),Math.ceil(G/2),m?[-n,-r,n,r]:null),Oe=ue=!0,Jt=m?g.details.size*$:z.size*oe,eo=m?g.details.centreY*G:G/2-(900/2-z.centreY)*oe,to=V*(1-d.size*oe/Jt),Ua=(G/2+$e-eo)/oe*(V-to)/V;let l=m||!!window.__editionsTest?.noShelves;for(let c of Ia)c.visible=!l;kt.setGain(m?g.groundGain:1),Ht.mesh.visible=m,m&&Ht.layout($,G,oe);for(let c of x)c.mats[0].color.set(m?g.edgeColour:15855594);if(F.tops.forEach((c,f)=>l?Ee.uShelf.value[f].set(0,0,-1e5,-1e5):Ee.uShelf.value[f].set(-F.width/2,F.width/2,c-F.thick,c)),document.body.classList.toggle("crate",m),m!==e){s&&wo(),Pe(-1);for(let c of x)de[c.i]&&(c.fall=null,c.pose=oo(c),ye(c));Ne(!0)}else if(m)for(let c of x)de[c.i]&&!(s&&s.i===c.i)&&(c.pose=oo(c),ye(c));qa=x.map(c=>Rn(c)),m||x.forEach(co),kn(),C()}var oo=e=>m?y.pose(e):Y(),Nt=new O,Re=new To;function Ae(e,t,a){return Nt.set(e,t,a).project(H),{x:(Nt.x+1)/2*$,y:(1-Nt.y)/2*G}}function io(e){let t=x[e].mesh;t.geometry.boundingBox||t.geometry.computeBoundingBox(),Re.copy(t.geometry.boundingBox).applyMatrix4(t.matrixWorld);let a=1/0,o=1/0,n=-1/0,r=-1/0;for(let i of[Re.min.x,Re.max.x])for(let l of[Re.min.y,Re.max.y])for(let c of[Re.min.z,Re.max.z]){let f=Ae(i,l,c);a=Math.min(a,f.x),n=Math.max(n,f.x),o=Math.min(o,f.y),r=Math.max(r,f.y)}return{x:a,y:o,width:n-a,height:r-o}}var qa=[];function Rn(e){let t=d.size,a=e.shelfY,o=Ae(e.x-t/2,a+d.hoverLift+t,d.hoverZ),n=Ae(e.x+t/2,a,0);return{x0:o.x,y0:o.y,x1:n.x,y1:n.y}}function lo(e,t){let a=-1;return qa.forEach((o,n)=>{de[n]&&e>=o.x0&&e<=o.x1&&t>=o.y0&&t<=o.y1&&(a=n)}),a}var X=new O,Qe=e=>{let t=P.getPixelRatio();return Math.round(e*t)/t};function co(e){X.set(-d.size/2,0,d.thick).applyMatrix4(e.mesh.matrixWorld);let t=Ae(X.x,X.y,X.z);X.set(d.size/2,0,d.thick).applyMatrix4(e.mesh.matrixWorld);let o=Ae(X.x,X.y,X.z).x-t.x;We[e.i].style.transform=`translate3d(${Qe(t.x+o*.1175)}px, ${Qe(t.y-o*.025-35)}px, 0)`}function Tn(e){return{...Y(),lean:0,dx:-e.x,lift:Ua-d.size/2-e.shelfY,z:to-d.thick/2}}function kn(){let e=eo;ot.style.top=`${Qe(e-54.2)}px`,at.style.top=`${Qe(e-13.6)}px`,ge.style.top=`${Qe(e+Jt/2+16)}px`}var nt=0,Ze=0,Oe=!0,ue=!0,zt=null,At=null,Le=-1,W=-1,Lt=0,s=null,Sa=-1,Ma=!1,de=x.map(()=>!1),J={x:-1,y:-1},qe={};qe.ready=new Promise(e=>{qe.resolve=e});var Er=qe.ready;function C(){nt||(nt=requestAnimationFrame(An))}function Ra(e,t){let a=d.size,o=d.thick;return{x:e.x+t.dx,y:e.shelfY+t.lift+a/2*Math.cos(t.lean),z:t.z-a/2*Math.sin(t.lean)+o/2}}function Ta(e,t,a,o){let n=Et(t,a,o),r=d.size,i=Ra(e,t),l=Ra(e,a),c=V/(V-i.z),f=V/(V-l.z),h=c+(f-c)*o,p=(i.x*c+(l.x*f-i.x*c)*o)/h,u=(i.y*c+(l.y*f-i.y*c)*o)/h;return n.dx=p-e.x,n.lift=u-e.shelfY-r/2*Math.cos(n.lean),n.z=V*(1-1/h)+r/2*Math.sin(n.lean)-d.thick/2,n}var Hn=e=>1-(1-e)**3,ka=e=>e*e*(3-2*e),Ha=Math.PI*2,Na=.1,St=e=>fe()?e>=0?1:0:Se(z.flip.ease,_(e/k(z.flip.dur))),Yt=()=>L(z.fly.at)+k(z.fly.dur)*(1-Na),fo=e=>Math.abs(Math.round(e/Math.PI))%2===1;function zn(e,t){let a=z.fly,o=z.exit,n=z.flip,r=()=>s.flip.from+(s.flip.to-s.flip.from)*Se(n.ease,_((t-s.flip.t0-L(n.at))/k(n.dur))),i,l;if(s.exit){let c=s.exit,f=t-c.t0,h=f-c.lag,p=Se(o.ease,_((h-L(o.at))/k(o.dur)));if(i=Ta(e,c.from,{...m?y.pose(e):De(),yaw:c.yawTo},p),i.yaw=c.from.yaw+(c.yawTo-c.from.yaw)*(c.lag?St(f):1),s.blur=c.blur*(1-ka(_((h-L(o.blurOut.at))/k(o.blurOut.dur)))),l=h<L(o.at)+k(o.dur)||s.blur>0,s.film=[c.lag?1-St(f):0,!1],!l)return He.detach(),Ya(e,t),!0}else{s.backIn===null&&t-s.asked<z.backWait&&t-s.t0>L(a.at)&&(s.t0=t-L(a.at));let c=t-s.t0,f=Se(a.ease,_((c-L(a.at))/k(a.dur)));i=Ta(e,s.from,Tn(e),f),i.yaw=s.turn*St(c-Yt())+r(),s.blur=m?0:ka(_((c-L(z.blur.at))/k(z.blur.dur)));let h=Math.max(Yt()+k(n.dur),...[a,z.blur,z.title].map(p=>L(p.at)+k(p.dur)));l=c<h||t-s.flip.t0<L(n.at)+k(n.dur),s.film=[St(c-Yt()),!l&&fo(i.yaw)]}return e.pose=i,l}var Ct=!1;ee.addEventListener("webglcontextlost",e=>{e.preventDefault(),!Ct&&(Ct=!0,nt&&cancelAnimationFrame(nt),s&&wo(),xo?.close(),import("./fallback.js").then(t=>t.start(D)))});function An(e){if(nt=0,Ct)return;if(Q>=0){Ze=0;return}let t=Ze?Math.min(.05,(e-Ze)/1e3):0;Ze=e;let a=!1,o=At===null?-1:e-At,n=Ma,r=m&&y.step(t);Ma=r,r?Ne():n&&m&&(Ne(),Pn());let i=s||m?-1:Le;W!==i&&(s||e-Lt>=L(na))&&(W>=0&&!(s&&s.i===W)&&(x[W].fall={from:{...x[W].pose},t0:Lt}),W=i,W>=0&&(x[W].fall=null)),gn(s?Math.cos(x[s.i].pose.yaw)>0?s.i:-1:W);let l=W!==i;for(let f of x){let h=!1;if(s&&f.i===s.i)h=zn(f,e);else if(de[f.i]){if(m)r&&(f.pose=y.pose(f),h=!0);else if(W===f.i)h=ia(f,t);else if(f.fall){let p=la(f.fall.from,e-f.fall.t0);p?f.pose=p:(f.pose=Y(),f.fall=null),h=!0}}else if(o>=0){let p=vn(f.i,o);if(p!==null){let u=m?Cn(f,o-p):sa(f.i,o-p);u?f.pose=u:(f.pose=oo(f),de[f.i]=!0)}h=!0}if(h){ye(f),m||co(f);let p=!m&&f.pose.z<270;(p||f.shaded)&&(Oe=!0),f.shaded=p,(!s||f.i!==s.i)&&(ue=!0),a=!0}}Oe&&(aa(x,Ee,m),kt.bake(),Oe=!1,ue=!0),m&&Ht.setOpacity(o<0||we[0]===null?0:_((o-we[0])/k(600))),bt&&(et.mesh.layers.set(s&&s.i===bt.i?Je:0),et.place(bt,Fa?0:bt.pose.opacity));let c=Xe>=0||e<Oa;if(c&&!window.__editionsTest?.stillCovers)for(let f of be)f?.update(t);if(s){let f=x[s.i],h=z.blur.sigma*s.blur;(ue||h!==Sa)&&(H.layers.set(0),tt.background(j,H,h),ue=!1,Sa=h),s.film&&He.update(...s.film),tt.composite(Math.min(1,s.blur*4)),H.layers.set(Je),P.autoClear=!1,P.clearDepth(),P.render(j,H),P.autoClear=!0,H.layers.set(0)}else Mt&&(Mt.draw(),Mt=null),P.render(j,H);Tt.firstFrameAt===null&&(Tt.firstFrameAt=performance.now(),Ln(Tt.firstFrameAt),qe.resolve(),a=!0),!Zt&&!a&&xn(),a||l||c||r?C():Ze=0}function za(e){if(!CSS.supports("animation-timing-function","linear(0, 1)"))return"cubic-bezier(0.16, 1, 0.3, 1)";let t=24,a=[],o=1-Math.exp(-1/e);for(let n=0;n<=t;n++)a.push(((1-Math.exp(-(n/t)/e))/o).toFixed(4));return`linear(${a.join(", ")})`}function Ln(e){zt=e,At=window.__editionsTest?.noSleeves?null:e,ee.animate([{opacity:0},{opacity:1}],{duration:k(A.canvasFade.dur),easing:A.canvasFade.ease,fill:"forwards"});let t=A.header,a=k(t.tau*5);document.querySelectorAll(".rise").forEach((n,r)=>n.animate([{opacity:0,transform:`translateY(${-t.rise}px)`},{opacity:1,transform:"none"}],{duration:a,delay:L(t.at+t.stagger*r),easing:za(.2),fill:"forwards"}));let o=A.late;document.querySelectorAll(".late").forEach(n=>n.animate([{opacity:0},{opacity:1}],{duration:k(o.tau*5),delay:L(o.at),easing:za(.2),fill:"forwards"}))}function rt(){let e=s?-1:Le;We.forEach((t,a)=>t.classList.toggle("hot",a===e)),ee.style.cursor=s?uo()?"pointer":"":Le>=0?"pointer":""}function Pe(e,t=!1){e!==Le&&(Le=e,Lt=performance.now(),rt(),e>=0&&!s&&(t||ae("hover",{pan:ze(e)}),ae("lift",{pan:ze(e),intensity:.8})),C())}function uo(){if(!s)return!1;let e=io(s.i);return J.x>=e.x&&J.x<=e.x+e.width&&J.y>=e.y&&J.y<=e.y+e.height}var Ce=-1;window.addEventListener("pointermove",e=>{if(e.pointerType==="touch"||m)return;if(J.x=e.clientX,J.y=e.clientY,s){rt();return}let t=e.target.closest?.(".pm")?-1:lo(e.clientX,e.clientY);t!==Ce&&(Ce=t,Pe(t))});document.documentElement.addEventListener("pointerleave",()=>{Ce=-1,Pe(-1)});window.addEventListener("blur",()=>{Ce=-1,Pe(-1)});window.addEventListener("resize",so);ee.addEventListener("click",e=>{if(m)return;if(J.x=e.clientX,J.y=e.clientY,s){if(s.exit)return;uo()?mo():It();return}let t=lo(e.clientX,e.clientY);t>=0&&ho(t)});function Cn(e,t){let a=_((t-L(A.appear.at+A.appear.stagger*e.i))/k(360));if(a>=1)return null;let o=y.pose(e);return o.opacity=a,fe()||(o.lift+=(1-Hn(a))*40/oe),o}var Aa=-1,La=0;function Ne(e=!1){if(!m)return;let t=x.length,a=y.current,o=D[a],n=Ut.parentElement.clientHeight-Ut.offsetHeight;Ut.style.transform=`translateY(${((1-_(y.p/Math.max(1,t-1)))*n).toFixed(1)}px)`,!(a===Aa&&!e)&&(Aa=a,En.textContent=o.year||"",bn.textContent=o.name,Ea.dataset.index=String(a),Ea.setAttribute("aria-label",`Details: ${o.name}`),ro(Sn,a))}function Pn(){let e=y.current;e!==La&&(La=e,ct(`${D[e].name}, ${e+1} of ${x.length}`))}function Bn(e,t){let a=Math.round(y.p),o=[];for(let n=0;n<a;n++)o.push(n);for(let n=a;n<x.length;n++)o.push(n);for(let n of o){if(!de[n])continue;let r=io(n);if(e>=r.x&&e<=r.x+r.width&&t>=r.y&&t<=r.y+r.height)return n}return-1}var Te=null;ee.addEventListener("pointerdown",e=>{!m||Q>=0||!e.isPrimary||(Te={x:e.clientX,y:e.clientY,id:e.pointerId},ee.setPointerCapture(e.pointerId),s||(y.begin(e.clientY,e.timeStamp),C()))});ee.addEventListener("pointermove",e=>{!Te||e.pointerId!==Te.id||s||(y.move(e.clientY,e.timeStamp),Ne(),C())});var po=e=>t=>{if(!Te||t.pointerId!==Te.id)return;let{x:a,y:o}=Te;Te=null;let n=Math.hypot(t.clientX-a,t.clientY-o);if(e){y.cancel(),C();return}if(s||y.end(t.timeStamp),C(),n>=8)return;if(J.x=t.clientX,J.y=t.clientY,s){if(s.exit)return;uo()?mo():It();return}let r=Bn(t.clientX,t.clientY);r<0||(r===y.current&&Math.abs(y.p-r)<.05?ho(r):(y.go(r),ae("tick")))};ee.addEventListener("pointerup",po(!1));ee.addEventListener("pointercancel",po(!0));ee.addEventListener("lostpointercapture",po(!0));var Ca=0;window.addEventListener("wheel",e=>{!m||s||Q>=0||(e.preventDefault(),e.timeStamp-Ca>200&&y.wheel(0),Ca=e.timeStamp,y.wheel(e.deltaY),C())},{passive:!1});lt.querySelector(".cb-back").addEventListener("click",()=>It());function ho(e){if(s||!de[e])return;let t=x[e],a=performance.now();t.fall=null,m&&y.go(e);let o=st(document.activeElement)===e?document.activeElement:null,n=!m&&t.x>0?-1:1;s={i:e,t0:a,asked:a,backIn:null,from:{...t.pose},dir:n,turn:n*Math.PI,flip:{from:0,to:0,t0:-1e9},exit:null,blur:0,ret:o},t.mesh.layers.set(Je),ue=!0,mn(e),ot.textContent=t.entry.name,at.textContent=t.entry.tag,ro(ge,e),Ue.inert=!1,ge.inert=!1,it.inert=!0,document.body.classList.add("in-details");let r=z;Ve(Bt,0,r.headerOut.at,r.headerOut.dur);for(let i of[ot,at])Ve(i,1,r.title.at,r.title.dur);Ve(ge,1,r.open.at,r.open.dur),He.attach(t),Ue.focus({preventScroll:!0}),ae("details",{pan:ze(e)}),ct(t.entry.tag?`Details: ${t.entry.name}. ${t.entry.tag}`:`Details: ${t.entry.name}`),rt(),C()}function mo(){if(!s||s.exit)return;let e=performance.now(),t=z.flip,a=s.flip,o=a.from+(a.to-a.from)*Se(t.ease,_((e-a.t0-L(t.at))/k(t.dur)));s.flip={from:o,to:a.to+s.dir*Math.PI,t0:e},ae("flip"),ct(fo(s.turn+s.flip.to)?"Back of the sleeve":"Front of the sleeve"),C()}function It(){if(!s||s.exit)return;let e=x[s.i],t=performance.now(),a=z.exit,o=e.pose.yaw/Ha,n=Ha*(s.dir>0?Math.ceil(o-.5-1e-6):Math.floor(o+.5+1e-6)),r=Math.abs(n-e.pose.yaw)<.001?0:k(z.flip.dur)*(1-Na);s.exit={t0:t,from:{...e.pose},yawTo:n,lag:r,blur:s.blur};for(let i of[ot,at,ge])Ve(i,0,a.at,a.textOut);He.unzoom(!0),Ve(Bt,1,a.headerIn.at,a.headerIn.dur),Ue.inert=!0,ge.inert=!0,ae("close",{pan:ze(s.i)}),ct("Back to the shelf"),C()}function Ya(e,t,a=!1){let{i:o}=s,n=a?null:s.ret;if(s=null,wn(e),e.pose=m?y.pose(e):De(),ye(e),e.mesh.layers.set(0),ue=Oe=!0,it.inert=!1,document.body.classList.remove("in-details"),m){n&&n.isConnected&&n.focus({preventScroll:!0}),Ne(!0),rt();return}Ce=a?-1:lo(J.x,J.y),Le=Ce,Lt=t,n&&n.isConnected&&n.focus({preventScroll:!0}),W=Le===o?o:-1,W!==o&&(e.fall={from:De(),t0:t}),co(e),rt()}var xo=null,Pa=null,Q=-1,Pt=!1,Rt=0,vo=()=>Pa||(Pa=import("./project-D7PTWUM4.js").then(e=>xo=e.createProjectView({renderer:P,entries:D,slugOf:xe,onBack:Fn})));function In(e){ae("open",{pan:s?0:ze(e)}),vo(),D[e].kind!=="about"&&import("./project-D7PTWUM4.js").then(t=>t.loadDossier(xe(D[e]))),Pt=!0,Rt=Wo.cut,ct(`Open: ${D[e].name}`),location.hash=xe(D[e])}async function yo(){if(Ct)return;let e=decodeURIComponent(location.hash.slice(1)),t=D.findIndex(a=>xe(a)===e);if(t>=0){if(t===Q)return;let a=await vo();if(D.findIndex(o=>xe(o)===decodeURIComponent(location.hash.slice(1)))!==t||t===Q)return;s&&wo(!0),Pe(-1),Q=t;for(let o of ee.getAnimations())o.finish();se?.setRoomTone(!1),Rt||ae("open"),await a.open(t,{cutAfter:Rt}),Rt=0}else if(Q>=0){let a=Q;if(Q=-1,xo?.close(),se?.setRoomTone(!0),ae("close",{pan:ze(a)}),so(),m){y.jump(a);for(let o of x)de[o.i]&&(o.pose=y.pose(o),ye(o));Ne(!0)}Oe=ue=!0,We[a].querySelector('[data-action="open"]').focus({preventScroll:!0}),C()}}function Fn(){Pt?(Pt=!1,history.back()):(history.pushState(null,"",location.pathname+location.search),yo())}window.addEventListener("hashchange",()=>{location.hash||(Pt=!1),yo()});function wo(e=!1){let t=x[s.i];for(let a of[ot,at,ge])for(let o of a.getAnimations())o.cancel();He.detach(),Ve(Bt,1,0,1),Ue.inert=!0,ge.inert=!0,Ya(t,performance.now(),e),t.fall=null,W=-1}document.addEventListener("click",e=>{let t=e.target.closest("[data-action][data-index]");if(!t)return;let a=+t.dataset.index;if(t.dataset.action==="details"){ho(a);return}D[a].url||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||(e.preventDefault(),In(a))});var st=e=>e&&e.closest&&e.closest(".slot")?We.indexOf(e.closest(".slot")):-1;it.addEventListener("focusin",e=>{let t=st(e.target);if(!(t<0)){if(m){s||(y.go(t),C());return}Pe(t,!0)}});it.addEventListener("focusout",e=>{st(e.relatedTarget)>=0||s||Pe(Ce)});window.addEventListener("keydown",e=>{if(e.metaKey||e.ctrlKey||e.altKey||Q>=0)return;if(s){if(He.zoomed){e.key==="Escape"&&(e.preventDefault(),He.unzoom());return}e.key==="Escape"?(e.preventDefault(),It()):(e.key===" "||e.code==="Space")&&(e.preventDefault(),e.repeat||mo());return}if(m){let r={ArrowLeft:-1,ArrowUp:-1,ArrowRight:1,ArrowDown:1}[e.key];if(r===void 0)return;e.preventDefault();let i=Math.max(0,Math.min(x.length-1,y.current+r));if(i===y.current)return;y.go(i),st(document.activeElement)>=0&&We[i].querySelector(`[data-action="${document.activeElement.dataset.action}"]`).focus({preventScroll:!0}),ae("tick"),C();return}let t={ArrowLeft:-1,ArrowRight:1,ArrowUp:-d.cols,ArrowDown:d.cols}[e.key];if(t===void 0)return;e.preventDefault();let a=st(document.activeElement),o=a<0?0:Math.max(0,Math.min(x.length-1,a+t));if(o===a)return;let n=document.activeElement?.dataset?.action==="open"?"open":"details";We[o].querySelector(`[data-action="${n}"]`).focus({preventScroll:!0}),ae("tick",{pan:ze(o)})});window.addEventListener("keyup",e=>{s&&(e.key===" "||e.code==="Space")&&e.preventDefault()});var go=window.matchMedia("(prefers-reduced-motion: reduce)");xt(go.matches);y.setReduced(go.matches);go.addEventListener?.("change",e=>{xt(e.matches),y.setReduced(e.matches)});var Tt={count:x.length,firstFrameAt:null,ready:qe.ready,covers:hn,sleeveRect:io,frontCorners(e){let t=x[e].mesh.matrixWorld,a=d.size;return[[-a/2,0],[a/2,0],[a/2,a],[-a/2,a]].map(([o,n])=>(X.set(o,n,d.thick).applyMatrix4(t),Ae(X.x,X.y,X.z)))},setCover(e,t,a){Gt(x[e],t,a),C()},get project(){return Q>=0?xe(D[Q]):null},get sleevesAt(){return At},coverReadyAt:_a,appearAt:we,get crate(){return m?{p:y.p,current:y.current,dragging:y.dragging}:null},set stickerOff(e){Fa=!!e,C()},get details(){return s?{index:s.i,flipped:fo(s.turn+s.flip.to),closing:!!s.exit,blur:s.blur,yaw:x[s.i].pose.yaw,backIn:s.backIn===null?null:Math.round(s.backIn-s.asked)}:null}};window.__editions=Tt;so();for(let e of x)e.mesh.visible=!0;et.mesh.visible=!0;for(let e of[!0,!1]){for(let t of x)for(let a of[t.front,t.back,t.mats[0]])a.transparent=e,a.needsUpdate=!0;for(let t of[0,Je])H.layers.set(t),P.render(j,H);H.layers.enableAll(),P.render(j,H),H.layers.set(0),tt.background(j,H,1),tt.composite(.5)}for(let e of x)ye(e);et.mesh.visible=!1;ue=!0;qe.ready.then(()=>{location.hash&&yo()});export{Er as drawn};
