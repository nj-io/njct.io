import{B as T,C as mt,D as re,E as xt,F as Po,G as me,H as Io,I as _o,J as Bo,K as Fo,L as Do,M as Go,N as oe,O as de,P as $o,Q as Vo,S as Oo,T as Wo,U as Uo,a as Ro,b as To,e as _e,i as dt,j as ko,l as fe,m as Ho,n as pt,o as ue,p as zo,q as W,s as Z,t as Be,u as Lo,v as he,w as Ao,x as ht,y as Co}from"./chunk-XUX7XAJI.js";import{a as I,b as vt,c as ie,d as k,e as C,f as Se}from"./chunk-TH7WALPN.js";import{a as Bt,b as qo,c as xe,e as d,f as F,g as No,h as L,i as A,j as Yo}from"./chunk-CXBLJNT7.js";var yt=class extends me{constructor(){super();let t=new mt;t.deleteAttribute("uv");let o=new de({side:Ro}),n=new de,a=new Vo(16777215,900,28,2);a.position.set(.418,16.199,.3),this.add(a);let r=new T(t,o);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let s=new _o(t,n,6),l=new Ao;l.position.set(-10.906,2.009,1.846),l.rotation.set(0,-.195,0),l.scale.set(2.328,7.905,4.651),l.updateMatrix(),s.setMatrixAt(0,l.matrix),l.position.set(-5.607,-.754,-.758),l.rotation.set(0,.994,0),l.scale.set(1.97,1.534,3.955),l.updateMatrix(),s.setMatrixAt(1,l.matrix),l.position.set(6.167,.857,7.803),l.rotation.set(0,.561,0),l.scale.set(3.927,6.285,3.687),l.updateMatrix(),s.setMatrixAt(2,l.matrix),l.position.set(-2.017,.018,6.124),l.rotation.set(0,.333,0),l.scale.set(2.002,4.566,2.064),l.updateMatrix(),s.setMatrixAt(3,l.matrix),l.position.set(2.291,-.756,-2.621),l.rotation.set(0,-.286,0),l.scale.set(1.546,1.552,1.496),l.updateMatrix(),s.setMatrixAt(4,l.matrix),l.position.set(-2.193,-.369,-5.547),l.rotation.set(0,.516,0),l.scale.set(3.875,3.487,2.986),l.updateMatrix(),s.setMatrixAt(5,l.matrix),this.add(s);let c=new T(t,Fe(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);let f=new T(t,Fe(50));f.position.set(-16.109,18.021,-8.207),f.scale.set(.1,2.425,2.751),this.add(f);let h=new T(t,Fe(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);let p=new T(t,Fe(43));p.position.set(-.462,8.89,14.52),p.scale.set(4.38,5.441,.088),this.add(p);let u=new T(t,Fe(20));u.position.set(3.235,11.486,-12.541),u.scale.set(2.5,2,.1),this.add(u);let v=new T(t,Fe(100));v.position.set(0,20,0),v.scale.set(1,.1,1),this.add(v)}dispose(){let t=new Set;this.traverse(o=>{o.isMesh&&(t.add(o.geometry),t.add(o.material))});for(let o of t)o.dispose()}};function Fe(e){return new $o({color:0,emissive:16777215,emissiveIntensity:e})}var Qn=d.hoverLift.toFixed(2),se=d.cols,jo=(d.pitch/2).toFixed(2),Jn={key:{rect:[1148.801,12.997,8768.289,3472.806],z:994.831,power:2.322},fill:{rect:[-2516.226,-9815.124,2516.226,10070.146],z:573.364,power:1.474},shelfAlbedo:1.219,shelfAmbient:.383,contact:{strength:.332,reach:19.033},keyMix:.571,base:{centre:.614,edge:.752,cy:-293.494,rx:806.633,ry:309.574,pow:.304},edgeShade:{strength:.989,reach:5.54},liftShade:{strength:.5,reach:8},halo:{right:.4,left:.383,top:.056,rise:.308,fall:60.395,row2:.724,vfall:10,drop:.881,dropReach:31.417},glow:{strength:.2,fall:100,side:60,fade:24.653,width:1100}},De=4*se;function Ko(){return{uLightRect:{value:[new Z,new Z]},uLightZ:{value:[0,0]},uLightPower:{value:[0,0]},uShelf:{value:[new Z,new Z]},uShelfDepth:{value:0},uSlab:{value:Array.from({length:De},()=>new Z(0,0,0,0))},uSlabZ:{value:new Array(De).fill(1)},uSlabA:{value:new Array(De).fill(0)},uFoot:{value:Array.from({length:2*se},()=>new Z(0,0,0,1e3))},uShelfAlbedo:{value:1},uShelfAmbient:{value:0},uContact:{value:new ue},uHalo:{value:new W},uHaloShape:{value:new Z},uHaloDrop:{value:new ue},uGlow:{value:new Z},uGlowWidth:{value:1e4},uEdgeShade:{value:new Z},uKeyMix:{value:.5},uBase:{value:new W},uBaseShape:{value:new W}}}function Zo(e,t=Jn){[t.key,t.fill].forEach((o,n)=>{e.uLightRect.value[n].set(...o.rect),e.uLightZ.value[n]=o.z,e.uLightPower.value[n]=o.power}),e.uShelfAlbedo.value=t.shelfAlbedo,e.uShelfAmbient.value=t.shelfAmbient,e.uContact.value.set(t.contact.strength,t.contact.reach),e.uHalo.value.set(t.halo.right,t.halo.left,t.halo.top),e.uHaloShape.value.set(t.halo.rise,t.halo.fall,t.halo.row2,t.halo.vfall),e.uHaloDrop.value.set(t.halo.drop,t.halo.dropReach),e.uGlow.value.set(t.glow.strength,t.glow.fall,t.glow.side,t.glow.fade),e.uGlowWidth.value=t.glow.width,e.uEdgeShade.value.set(t.edgeShade.strength,t.edgeShade.reach,t.liftShade.strength,t.liftShade.reach),e.uKeyMix.value=t.keyMix,e.uBase.value.set(t.base.centre,t.base.edge,t.base.cy),e.uBaseShape.value.set(t.base.rx,t.base.ry,t.base.pow)}var wt=`
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
    float wx = smoothstep(-uGlow.z, uGlow.z, cx + ${jo}) - smoothstep(-uGlow.z, uGlow.z, cx - ${jo});
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
    float lift = clamp(uFoot[row * ${se} + k].w / ${Qn}, 0.0, 1.0);
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
`;var ea=`
out vec2 vWorld;
uniform vec4 uRegion; // world x0, y0, x1, y1 covered by the texture
void main() {
  vWorld = mix(uRegion.xy, uRegion.zw, uv);
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`,ta=`
precision highp float;
in vec2 vWorld;
out vec4 outColor;
${wt}
void main() {
  int row = rowAt(vWorld.y);
  float seen = mix(wallLight(1, vWorld, row), wallLight(0, vWorld, row), uKeyMix);
  float e = wallBase(vWorld) * seen * edgeShade(vWorld, row) + haloAt(vWorld, row);
  outColor = vec4(vec3(e), 1.0);
}`,oa=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,na=`
uniform sampler2D uBake;
uniform float uGain;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(uBake, vUv).rgb * uGain;
  gl_FragColor = vec4(c, 1.0);
  #include <colorspace_fragment>
  float n = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  gl_FragColor.rgb += (n - 0.5) / 255.0;
}`;function Xo(e,t){let o=new Be(4,4,{type:dt,format:ko,depthBuffer:!1,minFilter:_e,magFilter:_e,generateMipmaps:!1}),n=new re({glslVersion:Ho,uniforms:{...t,uRegion:{value:new Z}},vertexShader:ea,fragmentShader:ta,depthTest:!1,depthWrite:!1}),a=new me;a.add(new T(new oe(2,2),n));let r=new xt,s=new re({uniforms:{uBake:{value:o.texture},uGain:{value:1}},vertexShader:oa,fragmentShader:na,toneMapped:!1}),l=new T(new oe(1,1),s);return l.renderOrder=-1,{mesh:l,resize(c,f,h,p,u,v,R=null){o.setSize(u,v),n.uniforms.uRegion.value.set(...R||[c,f,h,p]),l.scale.set(h-c,p-f,1),l.position.set((c+h)/2,(f+p)/2,0),l.updateMatrixWorld()},setGain(c){s.uniforms.uGain.value=c},bake(){let c=e.getRenderTarget();e.setRenderTarget(o),e.render(a,r),e.setRenderTarget(c)},dispose(){o.dispose(),n.dispose(),s.dispose(),l.geometry.dispose()}}}function aa(){let{width:e,depth:t,thick:o,bevel:n}=F,a=new Do;a.moveTo(0,-o),a.lineTo(t-n,-o),a.absarc(t-n,-o+n,n,-Math.PI/2,0,!1),a.lineTo(t,-n),a.absarc(t-n,-n,n,0,Math.PI/2,!1),a.lineTo(0,0),a.closePath();let r=new Go(a,{depth:e,bevelEnabled:!1,curveSegments:6});return r.applyMatrix4(new he().set(0,0,-1,e/2,0,1,0,0,1,0,0,0,0,0,0,1)),r.computeVertexNormals(),r}var ra=`
varying vec3 vPos;
varying vec3 vNormal;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vPos = w.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,ia=`
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
}`;function Qo(e){let t=aa();return F.tops.map((o,n)=>{let a=new re({uniforms:{...e,uRow:{value:n}},vertexShader:ra,fragmentShader:ia,toneMapped:!1}),r=new T(t,a);return r.position.set(0,o,0),r.updateMatrixWorld(),r})}var Jo=`
vec3 njNeutral(vec3 c) {
  const float start = 0.76, desat = 0.15;
  float x = min(c.r, min(c.g, c.b));
  c -= x < 0.08 ? x - 6.25 * x * x : 0.04;
  float peak = max(c.r, max(c.g, c.b));
  if (peak < start) return c;
  float d = 1.0 - start, np = 1.0 - d * d / (peak + d - start);
  c *= np / peak;
  return mix(c, vec3(np), 1.0 - 1.0 / (desat * (peak - np) + 1.0));
}`;var X=d.size,gt=X*Math.sin(d.lean),rn={dx:0,yaw:0,opacity:1},Y=()=>({...rn,lift:0,z:gt,lean:d.lean}),Ge=()=>({...rn,lift:d.hoverLift,z:d.hoverZ,lean:0}),Ft=["lift","z","lean","dx","yaw"],sa="#d9d6d0";function je(e,t=null){return e.onBeforeCompile=o=>{o.fragmentShader=o.fragmentShader.replace("void main() {",`${Jo}
${t?`uniform float uMapBias;
`:""}void main() {`).replace("#include <tonemapping_fragment>","gl_FragColor.rgb = njNeutral(gl_FragColor.rgb);"),t&&(o.uniforms.uMapBias=t,o.fragmentShader=o.fragmentShader.replace("#include <map_fragment>",Oo.map_fragment.replace("texture2D( map, vMapUv )","texture2D( map, vMapUv, uMapBias )")))},e.customProgramCacheKey=()=>t?"nj-neutral-bias":"nj-neutral",e}var Ke={value:0};function sn(e){let t=new mt(X,X,d.thick);return t.translate(0,X/2,d.thick/2),e.map((o,n)=>{let a=je(new de({color:15855594,roughness:.8})),r=n%d.cols,s=Math.floor(n/d.cols),l=Math.min(d.cols,e.length-s*d.cols),c=je(new de({color:new ht(o.accent?.light||sa),roughness:.8}),Ke),f=je(new de({color:15328992,roughness:.7})),h=[a,a,a,a,c,f],p=new T(t,h);p.matrixAutoUpdate=!1;let u={i:n,row:s,col:r,mesh:p,front:c,back:f,mats:h,entry:o,x:(r-(l-1)/2)*d.pitch,shelfY:F.tops[s],pose:{...Y(),opacity:0}};return ye(u),u})}var en=new zo,la=new W(1,0,0),tn=new W,ca=new W(1,1,1),Me=new W,on=new he,nn=new he,an=new he;function ye(e){let t=e.pose;tn.set(e.x+t.dx,e.shelfY+t.lift,t.z),en.setFromAxisAngle(la,-t.lean),e.mesh.matrix.compose(tn,en,ca),t.yaw&&(Me.set(0,X/2,d.thick/2).applyMatrix4(e.mesh.matrix),nn.makeTranslation(Me.x,Me.y,Me.z),an.makeTranslation(-Me.x,-Me.y,-Me.z),on.makeRotationY(t.yaw),e.mesh.matrix.premultiply(an).premultiply(on).premultiply(nn)),e.mesh.matrixWorld.copy(e.mesh.matrix),e.mesh.visible=t.opacity>.001;let o=t.opacity<.999;for(let n of[e.front,e.back,e.mats[0]])n.transparent!==o&&(n.transparent=o,n.needsUpdate=!0),n.opacity=t.opacity}function ln(e,t,o=!1){for(let n of e){let a=n.pose,r=Math.cos(a.lean),s=Math.sin(a.lean),l=n.shelfY+a.lift,c=d.thick/2,f=n.x+a.dx,h=pt.smoothstep(a.z,110,260),p=n.mesh.visible&&!o?a.opacity*(1-h):0,u=(n.row*d.cols+n.col)*2;for(let v=0;v<2;v++){let R=v/2,O=(v+1)/2;p>0?t.uSlab.value[u+v].set(f-X/2,l+X*R*r,f+X/2,l+X*O*r):t.uSlab.value[u+v].set(0,0,0,0),t.uSlabZ.value[u+v]=Math.max(1.5,a.z-X*(R+O)/2*s+c),t.uSlabA.value[u+v]=p}t.uFoot.value[n.i].set(f-X/2,f+X/2,a.z+d.thick,p>0?a.lift:1e3)}}function Dt(e,t,o){t&&(e.front.map=t,e.front.color.set(16777215),e.front.needsUpdate=!0),o&&(e.back.map=o,e.back.color.set(16777215),e.back.needsUpdate=!0)}var cn=15,Et=e=>e*e,bt=(e,t,o)=>{let n={...t};for(let a of Ft)n[a]=e[a]+(t[a]-e[a])*o;return n.opacity=e.opacity+(t.opacity-e.opacity)*o,n};function fn(e){let t=A.appear.at+A.appear.stagger*e,o=A.drop.at+A.drop.stagger*e,n=o+A.drop.dur,a=n+A.lean.delay;return{appear:t,drop:o,land:n,lean:a,rest:a+A.lean.dur}}var Gt=e=>ie()?200+40*e:fn(e).appear;function un(e,t){if(ie()){let l=Gt(e);return t>=l+160?null:{...Y(),opacity:I((t-l)/160)}}let o=fn(e);if(t>=o.rest)return null;if(t<o.appear)return{...Y(),opacity:0};let n=A.appearPose,a=1-.345*Math.exp(-(t-o.appear)/150),r={...Y(),lift:n.lift,z:n.z,lean:0,opacity:a};if(t<o.drop)return r;if(t<o.land){let l=Et(I((t-o.drop)/A.drop.dur));return{...r,lift:n.lift*(1-l),z:n.z+(gt-n.z)*l}}let s=Et(I((t-o.lean)/A.lean.dur));return{...r,lift:0,z:gt,lean:d.lean*s}}function dn(e,t){let o=Ge(),n=1-Math.exp(-t/(ie()?.04:d.hoverTau)),a=!1;for(let r of Ft){let s=o[r]-e.pose[r];Math.abs(s)>.001?(e.pose[r]+=s*n,a=!0):e.pose[r]=o[r]}return e.pose.opacity=1,a}function pn(e,t){let o=ie()?{delay:0,drop:90,pause:0,lean:60}:No,n=Y();if(t<o.delay)return{...e};let a=t-o.delay,r={...n,lean:Math.min(e.lean,n.lean)};if(a<o.drop)return bt(e,r,Et(a/o.drop));let s=a-o.drop-o.pause;return s<0?r:s<o.lean?bt(r,n,Et(s/o.lean)):null}var hn=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,fa=`
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
}`,ua=`
uniform sampler2D uSharp;
uniform sampler2D uBlur;
uniform float uMix;
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(mix(texture2D(uSharp, vUv).rgb, texture2D(uBlur, vUv).rgb, uMix), 1.0);
  #include <colorspace_fragment>
}`;function mn(e){let t=new Be(4,4,{samples:4,colorSpace:fe}),o={type:dt,depthBuffer:!1,minFilter:_e,magFilter:_e},n=new Be(4,4,o),a=new Be(4,4,o),r=new re({uniforms:{uTex:{value:null},uDir:{value:new ue},uSigma:{value:0}},vertexShader:hn,fragmentShader:fa,depthTest:!1,depthWrite:!1}),s=new re({uniforms:{uSharp:{value:t.texture},uBlur:{value:n.texture},uMix:{value:0}},vertexShader:hn,fragmentShader:ua,depthTest:!1,depthWrite:!1}),l=new T(new oe(2,2),r);l.frustumCulled=!1;let c=new me;c.add(l);let f=new xt,h=.5,p=(u,v)=>{l.material=u,e.setRenderTarget(v),e.render(c,f)};return{resize(u,v){t.setSize(u,v),n.setSize(Math.ceil(u/2),Math.ceil(v/2)),a.setSize(Math.ceil(u/2),Math.ceil(v/2)),h=e.getPixelRatio()/2},background(u,v,R){let O=e.getRenderTarget();e.setRenderTarget(t),e.clear(),e.render(u,v);let _=R*h;r.uniforms.uSigma.value=_,r.uniforms.uTex.value=t.texture,r.uniforms.uDir.value.set(1/n.width,0),p(r,a),r.uniforms.uTex.value=a.texture,r.uniforms.uDir.value.set(0,1/n.height),p(r,n),e.setRenderTarget(O)},composite(u){s.uniforms.uMix.value=u,p(s,null)},dispose(){t.dispose(),n.dispose(),a.dispose(),r.dispose(),s.dispose()}}}var Vt=d.size,xn=.255*Vt,$t={x:.3245*Vt,y:.8255*Vt,z:d.thick+.25};function da(e){let o=document.createElement("canvas");o.width=o.height=512;let n=o.getContext("2d"),a=512/2,r=512*.44,s=11;n.beginPath();for(let p=0;p<=720;p++){let u=p/720*Math.PI*2,v=r*(1+.065*Math.cos(s*u));n.lineTo(a+v*Math.cos(u),a+v*Math.sin(u))}n.closePath(),n.save(),n.clip();let l=n.createConicGradient?n.createConicGradient(.6,a,a):n.createLinearGradient(0,0,512,512);["#ffa6e6","#9af2dc","#c4b2ff","#ffe596","#9fd6ff","#ffb8dc","#ffa6e6"].forEach((p,u,v)=>l.addColorStop(u/(v.length-1),p)),n.fillStyle=l,n.fillRect(0,0,512,512),[[.3,.3,"#9af2dc"],[.7,.62,"#ffa6e6"],[.42,.72,"#ffe596"],[.68,.28,"#c4b2ff"],[.25,.58,"#ffb8dc"]].forEach(([p,u,v])=>{let R=n.createRadialGradient(p*512,u*512,0,p*512,u*512,102.4);R.addColorStop(0,v+"cc"),R.addColorStop(1,v+"00"),n.fillStyle=R,n.fillRect(0,0,512,512)});let c=n.createRadialGradient(a*.8,a*.7,0,a*.8,a*.7,512*.55);c.addColorStop(0,"rgba(255,255,255,0.75)"),c.addColorStop(1,"rgba(255,255,255,0)"),n.fillStyle=c,n.fillRect(0,0,512,512),n.restore(),n.translate(a,a),n.rotate(12*Math.PI/180),n.fillStyle="#000",n.textAlign="center",n.textBaseline="alphabetic",n.font=`800 ${512*.15}px 'NJ Text', system-ui, sans-serif`;let f=512*.15;e.forEach((p,u)=>n.fillText(p,0,(u-(e.length-1)/2)*f+512*.055));let h=new Fo(o);return h.colorSpace=fe,h.anisotropy=4,h}var vn=new ht().setRGB(1,.96,1);function yn(e){let t=da(e.toUpperCase().split(" ")),o=je(new de({map:t,emissiveMap:t,color:vn,emissive:vn,emissiveIntensity:.5,transparent:!0,roughness:.8,metalness:0,depthWrite:!1}),Ke),n=new T(new oe(xn,xn),o);n.matrixAutoUpdate=!1,n.visible=!1,n.renderOrder=1;let a=new he().makeTranslation($t.x,$t.y,$t.z);return{mesh:n,place(r,s){n.visible=s>.002&&r.mesh.visible,n.visible&&(o.opacity=s,n.matrix.multiplyMatrices(r.mesh.matrix,a),n.matrixWorld.copy(n.matrix))}}}var g={width:.682,bottom:.797,lean:56*Math.PI/180,strip:.124,top:132,flatLean:78*Math.PI/180,flatStrip:.07,flatMax:4,drag:150,carry:.06,omega:8.5,details:{size:.815,centreY:.404},wheelNotch:60,groundGain:.838,edgeColour:1842204,shadow:{y0:.403,y1:.794,alpha:.054,feather:20}};function wn(){let e=new re({uniforms:{uSize:{value:new ue(1,1)},uFeather:{value:1},uAlpha:{value:g.shadow.alpha}},vertexShader:"varying vec2 vP; uniform vec2 uSize; void main() { vP = uv * uSize; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`varying vec2 vP; uniform vec2 uSize; uniform float uFeather, uAlpha;
      void main() { float d = min(vP.y, uSize.y - vP.y);   // soft top and bottom; it runs off the left edge and under the crate
        gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha * smoothstep(0.0, uFeather, d)); }`,transparent:!0,depthWrite:!1,toneMapped:!1}),t=new T(new oe(1,1),e);return t.renderOrder=-.5,t.visible=!1,{mesh:t,setOpacity(o){e.uniforms.uAlpha.value=g.shadow.alpha*o},layout(o,n,a){let r=-o/2/a-2,s=0,l=(n/2-g.shadow.y1*n)/a,c=(n/2-g.shadow.y0*n)/a;t.scale.set(s-r,c-l,1),t.position.set((r+s)/2,(l+c)/2,.5),t.updateMatrixWorld(),e.uniforms.uSize.value.set(s-r,c-l),e.uniforms.uFeather.value=g.shadow.feather/a}}}function gn(e){let t=d.size,o=0,n=0,a=0,r=null,s=0,l=!1,c=0,f=0,h=0,p=0,u=0,v=1,R=y=>Math.max(0,Math.min(e-1,y));function O(y,E,b){let B=g.width*y/t;c=(E/2-g.bottom*E)/B;let K=g.bottom*E-t*B*Math.cos(g.lean);return f=Math.min(g.strip*t,e>1?Math.max(0,K-g.top)/(e-1)/B:0),h=f*Math.tan(g.lean)+4,p=g.flatStrip*t,u=(e-1)*h+t*Math.sin(g.lean)+10,v=B*(b-u)/b,v}let _=y=>p*g.flatMax*(1-Math.exp(-y/g.flatMax));function q(y){let E=y.i-o,b=Y();if(b.dx=-y.x,E>=0)b.lean=g.lean,b.lift=c+E*f-y.shelfY,b.z=u-E*h;else{let B=-E,K=Math.min(1,B);b.lean=g.lean+(g.flatLean-g.lean)*K,b.lift=c-_(B)-y.shelfY,b.z=u+.8*t*K+5*Math.max(0,_(B)-_(1))}return b}function Ie(y){if(r)return!0;let E=l?30:g.omega,b=E*E*(a-o)-2*E*n;return n+=b*y,o+=n*y,Math.abs(a-o)<.001&&Math.abs(n)<.01?(o=a,n=0,!1):!0}return{layout:O,pose:q,step:Ie,get p(){return o},get current(){return R(Math.round(r?o:a))},get dragging(){return!!r},setReduced(y){l=!!y},go(y){a=R(y)},jump(y){a=o=R(y),n=0},begin(y,E){r={y0:y,p0:o,samples:[[E,y]]},n=0},move(y,E){if(!r)return;let b=r.p0+(y-r.y0)/g.drag;for(b<0?b/=3:b>e-1&&(b=e-1+(b-e+1)/3),o=b,r.samples.push([E,y]);r.samples.length>2&&E-r.samples[0][0]>100;)r.samples.shift()},end(y){if(!r)return 0;let E=r.samples,b=E[0],B=E[E.length-1],K=Math.abs(B[1]-r.y0),ft=B[0]-b[0]>8&&y-B[0]<80?(B[1]-b[1])/(B[0]-b[0])*1e3:0;return r=null,n=Math.max(-12,Math.min(12,ft/g.drag)),a=R(Math.round(o+(l?0:n*g.carry))),l&&(n=0),K},cancel(){r&&(r=null,a=R(Math.round(o)))},wheel(y){for(s+=y;Math.abs(s)>=g.wheelNotch;){let E=Math.sign(s);a=R(a+E),s-=E*g.wheelNotch}}}}var Ot=16/9,pa=500;function En({camera:e,layer:t,wake:o,dur:n,els:a}){let{frame:r,video:s,play:l,close:c,shade:f}=a,h=new Bo(s);h.colorSpace=fe;let p=new Co({map:h,transparent:!0,opacity:0,toneMapped:!1,depthWrite:!1}),u=new T(new oe(1,1),p);u.rotation.y=Math.PI,u.layers.set(t),u.visible=!1;let v=d.size,R=new W,O=!1,_=!1,q=null,Ie=!1,y=0;for(let S of["loadeddata","seeked"])s.addEventListener(S,()=>{h.needsUpdate=!0,o()});let E=()=>{clearTimeout(y),O&&!Ie&&(Ie=!0,s.play().then(o,()=>{}))},b=(S,M)=>(R.set(S,M,0),u.localToWorld(R),R.project(e),[(R.x+1)/2*innerWidth,(1-R.y)/2*innerHeight]),B=()=>{let[S,M]=b(-.5,.5),[N,Ye]=b(.5,-.5);return{left:Math.min(S,N),top:Math.min(M,Ye),width:Math.abs(N-S),height:Math.abs(Ye-M)}},K=S=>({left:`${S.left}px`,top:`${S.top}px`,width:`${S.width}px`,height:`${S.height}px`}),ft=()=>{let S=Math.min(innerWidth*.92,innerHeight*.86*Ot),M=S/Ot;return{left:(innerWidth-S)/2,top:(innerHeight-M)/2,width:S,height:M}},Mo=(S,M,N)=>(Object.assign(r.style,K(M)),r.animate([K(S),K(M)],{duration:n(N),easing:"cubic-bezier(0.3, 0, 0.15, 1)"}).finished.catch(()=>{}));function Xn(){!O||_||!q||(_=!0,l.hidden=!0,r.classList.add("on"),f.classList.add("on"),c.hidden=!1,s.muted=!1,E(),Mo(q,ft(),560).then(()=>{_&&(s.controls=!0,c.focus({preventScroll:!0}))}))}function ut(S=!1){if(!_)return;_=!1,s.controls=!1,s.muted=!0,f.classList.remove("on"),c.hidden=!0;let M=()=>{_||(r.classList.remove("on"),O&&(l.hidden=!1))};if(S||!q){for(let N of r.getAnimations())N.cancel();M();return}Mo(r.getBoundingClientRect(),q,420).then(M)}return l.addEventListener("click",Xn),c.addEventListener("click",()=>ut()),f.addEventListener("click",()=>ut()),addEventListener("resize",()=>{_&&Object.assign(r.style,K(ft()))}),{get zoomed(){return _},unzoom:ut,attach(S){let M=S.entry.video;if(!M)return!1;let N=M.band;u.scale.set(v,v*N,1),u.position.set(0,v-v*N/2,-v*.002);let Ye=N*Ot;return h.repeat.set(1,Ye),h.offset.set(0,(1-Ye)/2),S.mesh.add(u),s.getAttribute("src")!==M.src&&(s.poster=M.poster,s.src=M.src),s.muted=!0,s.pause(),s.currentTime=M.start||0,O=!0,Ie=!1,!0},detach(){O&&(ut(!0),O=!1,q=null,clearTimeout(y),s.pause(),u.removeFromParent(),u.visible=!1,p.opacity=0,l.hidden=!0)},update(S,M){if(!O)return!1;if(p.opacity=S,u.visible=S>0,M&&!_){u.parent.updateMatrixWorld(),u.updateMatrixWorld(),q=B();let N={x:q.left+q.width/2,y:q.top+q.height/2};l.style.left=`${N.x}px`,l.style.top=`${N.y}px`,r.classList.contains("on")||Object.assign(r.style,K(q))}return M&&!Ie&&!y&&(y=setTimeout(()=>{y=0,E()},pa)),_||(l.hidden=!M),u.visible&&!s.paused&&o(),u.visible}}}var G=qo,te=document.getElementById("c"),P=new Uo({canvas:te,antialias:!0,powerPreference:"high-performance"});P.outputColorSpace=fe;P.toneMapping=To;var j=new me,Gn=new Wo(P);j.environment=Gn.fromScene(new yt,.04).texture;j.environmentIntensity=.46;Gn.dispose();var Ee=Ko();Zo(Ee);F.tops.forEach((e,t)=>Ee.uShelf.value[t].set(-F.width/2,F.width/2,e-F.thick,e));Ee.uShelfDepth.value=F.depth;var kt=Xo(P,Ee);j.add(kt.mesh);var $n=Qo(Ee);for(let e of $n)j.add(e);var x=sn(G);Ke.value=window.__editionsTest?.coverBias??-.5;var ke=new Io(new Uint8Array([255,255,255,255]),1,1);ke.colorSpace=fe;ke.needsUpdate=!0;for(let e of x)e.front.map=ke,e.back.map=ke,j.add(e.mesh);var Je=1,St=x.find(e=>e.entry.newest)||null,Vn=!1,et=yn("Now playing");j.add(et.mesh);var tt=mn(P),V=2556,H=new Po(20,1,100,V*2),He=En({camera:H,layer:Je,wake:()=>z(),dur:k,els:{frame:document.getElementById("film-frame"),video:document.querySelector("#film-frame video"),play:document.getElementById("d-play"),close:document.getElementById("d-close"),shade:document.getElementById("film-shade")}});H.position.set(0,0,V);var w=gn(x.length),Ht=wn();j.add(Ht.mesh);var be=x.map(()=>null),On=x.map(()=>null),Zt=x.map(()=>null),ma=1,ao=null,ro=new Promise(e=>requestAnimationFrame(()=>requestAnimationFrame(e))).then(()=>import("./covers-Y6SE4OAR.js")).then(e=>ao=e),xa=(e,t,o)=>ro.then(n=>n.createCover(P,e.entry,t,o)),bn=()=>zt===null?0:performance.now()-zt,Sn=window.__editionsTest?.coverLate||{},va=0;function Wn(){let e=va++;if(e>=x.length)return Promise.resolve();let t=x[e],o=()=>{Zt[e]=bn(),On[e]=zt===null?null:Math.round(Zt[e]),z()};return xa(t,e,{size:1024,backSize:0}).then(n=>{let a=()=>{be[e]=n,Dt(t,n.front,null),o()};Sn[e]==null?a():setTimeout(a,Math.max(0,Qt(e)+Sn[e]-bn()))},n=>{console.warn(`cover ${t.entry.name}: flat sleeve (${n?.message||n})`),o()}).then(Wn)}var ya=ro.then(()=>Promise.all(Array.from({length:ma},Wn)));function wa(e){let t=x[e],o=be[e]?.detailBack(1024).then(n=>{i&&i.i===e&&(t.back.map=n||ke,t.back.color.set(n?16777215:Un),t.back.needsUpdate=!0,z())}).catch(n=>console.warn(`cover ${t.entry.name}: no Details back (${n?.message||n})`));Promise.resolve(o).then(()=>{i&&i.i===e&&i.backIn===null&&(i.backIn=performance.now())})}var Xt=!1,Mt=null;function ga(){if(Xt||!be[0]||ce.some(t=>!t))return;Xt=!0;let e=window.requestIdleCallback||(t=>setTimeout(t,200));e(()=>{i||be[0].detailBack(1024).catch(()=>{}),e(()=>go().then(t=>t.warm()).then(t=>{t&&(Mt=t,z())}).catch(t=>console.warn(`world warm-up: ${t?.message||t}`)),{timeout:3e3})},{timeout:2e3})}var Un=15328992,Mn=600,we=x.map(()=>null),Rn=x.map(()=>0),Qt=e=>m?C(A.appear.at+A.appear.stagger*e):Gt(e);function Ea(e,t){if(we[e]===null){if(e>0&&we[e-1]===null)return null;let o=Qt(e),n=e>0?Math.max(o,we[e-1]+o-Qt(e-1)):o,a=Zt[e]??(t>=o+Mn?o+Mn:null);if(a===null||t<Math.max(n,a))return null;we[e]=Math.max(n,a),Rn[e]=we[e]-o,be[e]||ba(x[e])}return Rn[e]}function ba(e){let t=ao?.coverGround?.(e.entry,e.i)||e.entry.accent?.light;t&&e.front.color.set(t)}function Sa(e){e.back.map!==ke&&(e.back.map=ke,e.back.color.set(Un),e.back.needsUpdate=!0)}var Xe=-1,qn=0;function Ma(e){e!==Xe&&(Xe>=0&&(be[Xe]?.setAlive(!1),qn=performance.now()+1700),Xe=e,e>=0&&be[e]?.setAlive(!0))}ro.then(e=>{e.coverMotion.attach({wake:z,reduced:ie,test:window.__editionsTest?.coverMotion}),window.__editions&&(window.__editions.coverMotion=e.coverMotion)});var Ra=e=>!window.__editionsTest?.stillCovers&&ao?.coverMotion.step(e,{ready:ce.every(Boolean),details:!!i,crate:m?w.current:-1}),le=null,Wt=null,Jt=document.querySelector(".sound");function io(){let e=!!le?.enabled;Jt.setAttribute("aria-pressed",String(e)),Jt.setAttribute("aria-label",e?"Sound on":"Sound off")}function so(){return Wt||(Wt=import("./audio-3KD7PEEU.js").then(e=>(le=e.createAudio(),le.setRoomTone(!0),io(),le))),Wt}var ae=(e,t)=>{window.__editions?.soundLog?.push([e,Math.round(performance.now())]),le?.play(e,t)},ze=e=>Math.max(-1,Math.min(1,x[e].x/600));for(let e of["pointermove","pointerdown","keydown","touchstart"])window.addEventListener(e,so,{once:!0,capture:!0,passive:!0});var Nn=()=>{le?le.unlock():so().then(e=>e.unlock())};window.addEventListener("pointerdown",Nn,{once:!0,capture:!0});window.addEventListener("keydown",Nn,{once:!0,capture:!0});Jt.addEventListener("click",async()=>{let e=le||await so();e.setEnabled(!e.enabled),io()});io();var st=document.getElementById("slots"),We=x.map(e=>{let t=G[e.i],o=document.createElement("li");o.className="slot";let n=document.createElement("article");n.setAttribute("aria-labelledby",`sl-${e.i}`);let a=document.createElement("h2");if(a.className="sr",a.id=`sl-${e.i}`,a.textContent=t.name,n.appendChild(a),t.tag){let l=document.createElement("p");l.className="sr",l.textContent=t.year?`${t.tag}, ${t.year}`:t.tag,n.appendChild(l)}let r=document.createElement("a");r.dataset.action="open",r.textContent="Open",lo(r,e.i);let s=document.createElement("button");return s.type="button",s.dataset.action="details",s.dataset.index=String(e.i),s.textContent="Details",s.setAttribute("aria-label",`Details: ${t.name}`),n.append(r,s),o.appendChild(n),st.appendChild(o),o});function lo(e,t){let o=G[t];e.dataset.index=String(t),e.href=o.url||`#${xe(o)}`,o.url?(e.target="_blank",e.rel="noopener"):(e.removeAttribute("target"),e.removeAttribute("rel")),e.setAttribute("aria-label",o.url?`Open: ${o.name} site, new tab`:`Open: ${o.name}`)}var lt=document.getElementById("crate-bar"),Ta=lt.querySelector(".cb-year"),ka=lt.querySelector(".cb-name"),Tn=lt.querySelector(".cb-details"),Ha=lt.querySelector(".cb-open"),Ut=document.querySelector(".crate-rail span"),kn=document.getElementById("announce");function ct(e){kn.textContent="",requestAnimationFrame(()=>{kn.textContent=e})}document.getElementById("index").append(...G.map(e=>{let t=document.createElement("li"),o=document.createElement("span");o.className="y",o.textContent=e.year||"";let n=document.createElement("span");return n.className="n",n.textContent=e.name,t.append(o,n),t}));var It=document.querySelector(".tagline"),Ue=document.getElementById("details"),ot=Ue.querySelector(".d-title"),nt=Ue.querySelector(".d-tag"),ge=document.getElementById("d-open");function Ve(e,t,o,n){let a=+getComputedStyle(e).opacity;for(let r of e.getAnimations())r.cancel();e.animate([{opacity:a},{opacity:t}],{duration:k(n),delay:C(o),easing:"ease",fill:"both"})}var $=0,D=0,ne=1,m=!1,eo=0,to=0,oo=0,Yn=0,$e=0,za=14,qt=new ue;function co(){$=window.innerWidth,D=window.innerHeight;let e=m;m=$<600,V=m?2556*4:2556,ne=m?w.layout($,D,V):Bt($,D),H.position.z=V,H.far=V*2;let t=$/2/ne,o=D/2/ne;if(H.fov=pt.radToDeg(2*Math.atan(o/V)),H.aspect=$/D,H.clearViewOffset(),H.updateMatrixWorld(),$e=0,!m){let c=Y(),f=d.size,h=Le(0,F.tops[0]+f*Math.cos(c.lean),c.z-f*Math.sin(c.lean)+d.thick).y;$e=Math.max(0,Math.round(It.getBoundingClientRect().bottom+za-h)),$e&&H.setViewOffset($,D,0,-$e,$,D)}P.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),P.setSize($,D,!1),P.getDrawingBufferSize(qt),tt.resize(qt.x,qt.y);let n=m?Bt($,D):ne,a=$/2/n*1.02,r=D/2/n*1.02,s=$e/ne;kt.resize(-t*1.02,-o*1.02+s,t*1.02,o*1.02+s,Math.ceil($/2),Math.ceil(D/2),m?[-a,-r,a,r]:null),Oe=pe=!0,eo=m?g.details.size*$:L.size*ne,to=m?g.details.centreY*D:D/2-(900/2-L.centreY)*ne,oo=V*(1-d.size*ne/eo),Yn=(D/2+$e-to)/ne*(V-oo)/V;let l=m||!!window.__editionsTest?.noShelves;for(let c of $n)c.visible=!l;kt.setGain(m?g.groundGain:1),Ht.mesh.visible=m,m&&Ht.layout($,D,ne);for(let c of x)c.mats[0].color.set(m?g.edgeColour:15855594);if(F.tops.forEach((c,f)=>l?Ee.uShelf.value[f].set(0,0,-1e5,-1e5):Ee.uShelf.value[f].set(-F.width/2,F.width/2,c-F.thick,c)),document.body.classList.toggle("crate",m),m!==e){i&&bo(),Pe(-1);for(let c of x)ce[c.i]&&(c.fall=null,c.pose=no(c),ye(c));Ne(!0)}else if(m)for(let c of x)ce[c.i]&&!(i&&i.i===c.i)&&(c.pose=no(c),ye(c));jn=x.map(c=>La(c)),m||x.forEach(po),Ca(),z()}var no=e=>m?w.pose(e):Y(),Nt=new W,Re=new Lo;function Le(e,t,o){return Nt.set(e,t,o).project(H),{x:(Nt.x+1)/2*$,y:(1-Nt.y)/2*D}}function fo(e){let t=x[e].mesh;t.geometry.boundingBox||t.geometry.computeBoundingBox(),Re.copy(t.geometry.boundingBox).applyMatrix4(t.matrixWorld);let o=1/0,n=1/0,a=-1/0,r=-1/0;for(let s of[Re.min.x,Re.max.x])for(let l of[Re.min.y,Re.max.y])for(let c of[Re.min.z,Re.max.z]){let f=Le(s,l,c);o=Math.min(o,f.x),a=Math.max(a,f.x),n=Math.min(n,f.y),r=Math.max(r,f.y)}return{x:o,y:n,width:a-o,height:r-n}}var jn=[];function La(e){let t=d.size,o=e.shelfY,n=Le(e.x-t/2,o+d.hoverLift+t,d.hoverZ),a=Le(e.x+t/2,o,0);return{x0:n.x,y0:n.y,x1:a.x,y1:a.y}}function uo(e,t){let o=-1;return jn.forEach((n,a)=>{ce[a]&&e>=n.x0&&e<=n.x1&&t>=n.y0&&t<=n.y1&&(o=a)}),o}var Q=new W,Qe=e=>{let t=P.getPixelRatio();return Math.round(e*t)/t};function po(e){Q.set(-d.size/2,0,d.thick).applyMatrix4(e.mesh.matrixWorld);let t=Le(Q.x,Q.y,Q.z);Q.set(d.size/2,0,d.thick).applyMatrix4(e.mesh.matrixWorld);let n=Le(Q.x,Q.y,Q.z).x-t.x;We[e.i].style.transform=`translate3d(${Qe(t.x+n*.1175)}px, ${Qe(t.y-n*.025-35)}px, 0)`}function Aa(e){return{...Y(),lean:0,dx:-e.x,lift:Yn-d.size/2-e.shelfY,z:oo-d.thick/2}}function Ca(){let e=to;ot.style.top=`${Qe(e-54.2)}px`,nt.style.top=`${Qe(e-13.6)}px`,ge.style.top=`${Qe(e+eo/2+16)}px`}var at=0,Ze=0,Oe=!0,pe=!0,zt=null,Lt=null,Ae=-1,U=-1,At=0,i=null,Hn=-1,zn=!1,ce=x.map(()=>!1),ee={x:-1,y:-1},qe={};qe.ready=new Promise(e=>{qe.resolve=e});var kr=qe.ready;function z(){at||(at=requestAnimationFrame(Ba))}function Ln(e,t){let o=d.size,n=d.thick;return{x:e.x+t.dx,y:e.shelfY+t.lift+o/2*Math.cos(t.lean),z:t.z-o/2*Math.sin(t.lean)+n/2}}function An(e,t,o,n){let a=bt(t,o,n),r=d.size,s=Ln(e,t),l=Ln(e,o),c=V/(V-s.z),f=V/(V-l.z),h=c+(f-c)*n,p=(s.x*c+(l.x*f-s.x*c)*n)/h,u=(s.y*c+(l.y*f-s.y*c)*n)/h;return a.dx=p-e.x,a.lift=u-e.shelfY-r/2*Math.cos(a.lean),a.z=V*(1-1/h)+r/2*Math.sin(a.lean)-d.thick/2,a}var Pa=e=>1-(1-e)**3,Yt=e=>e*e*(3-2*e),Cn=Math.PI*2,Kn=.1,Ia=450,jt=e=>ie()?e>=0?1:0:Se(L.flip.ease,I(e/k(L.flip.dur))),Pn=()=>C(L.fly.at)+k(L.fly.dur)*(1-Kn),ho=e=>Math.abs(Math.round(e/Math.PI))%2===1;function _a(e,t){let o=L.fly,n=L.exit,a=L.flip,r=()=>i.flip.from+(i.flip.to-i.flip.from)*Se(a.ease,I((t-i.flip.t0-C(a.at))/k(a.dur))),s,l;if(i.exit){let c=i.exit,f=t-c.t0,h=f-c.lag,p=Se(n.ease,I((h-C(n.at))/k(n.dur)));if(s=An(e,c.from,{...m?w.pose(e):Ge(),yaw:c.yawTo},p),s.yaw=c.from.yaw+(c.yawTo-c.from.yaw)*(c.lag?jt(f):1),i.blur=c.blur*(1-Yt(I((h-C(n.blurOut.at))/k(n.blurOut.dur)))),l=h<C(n.at)+k(n.dur)||i.blur>0,i.film=[c.lag?1-jt(f):0,!1],!l)return He.detach(),Zn(e,t),!0}else{i.backIn===null&&t-i.asked<L.backWait&&t-i.t0>C(o.at)&&(i.t0=t-C(o.at));let c=t-i.t0,f=Se(o.ease,I((c-C(o.at))/k(o.dur)));s=An(e,i.from,Aa(e),f),s.yaw=i.turn*jt(c-Pn())+r(),i.blur=m?0:Yt(I((c-C(L.blur.at))/k(L.blur.dur)));let h=Pn()+k(a.dur),p=x[i.i].entry.video?k(Ia):0,u=Math.max(h+p,...[o,L.blur,L.title].map(v=>C(v.at)+k(v.dur)));l=c<u||t-i.flip.t0<C(a.at)+k(a.dur),i.film=[p?Yt(I((c-h)/p)):0,!l&&ho(s.yaw)]}return e.pose=s,l}var Ct=!1;te.addEventListener("webglcontextlost",e=>{e.preventDefault(),!Ct&&(Ct=!0,at&&cancelAnimationFrame(at),i&&bo(),wo?.close(),import("./fallback.js").then(t=>t.start(G)))});function Ba(e){if(at=0,Ct)return;if(J>=0){Ze=0;return}let t=Ze?Math.min(.05,(e-Ze)/1e3):0;Ze=e;let o=!1,n=Lt===null?-1:e-Lt,a=zn,r=m&&w.step(t);zn=r,r?Ne():a&&m&&(Ne(),Ga());let s=i||m?-1:Ae;U!==s&&(i||e-At>=C(cn))&&(U>=0&&!(i&&i.i===U)&&(x[U].fall={from:{...x[U].pose},t0:At}),U=s,U>=0&&(x[U].fall=null)),Ma(i?Math.cos(x[i.i].pose.yaw)>0?i.i:-1:U),Ra(e);let l=U!==s;for(let f of x){let h=!1;if(i&&f.i===i.i)h=_a(f,e);else if(ce[f.i]){if(m)r&&(f.pose=w.pose(f),h=!0);else if(U===f.i)h=dn(f,t);else if(f.fall){let p=pn(f.fall.from,e-f.fall.t0);p?f.pose=p:(f.pose=Y(),f.fall=null),h=!0}}else if(n>=0){let p=Ea(f.i,n);if(p!==null){let u=m?Da(f,n-p):un(f.i,n-p);u?f.pose=u:(f.pose=no(f),ce[f.i]=!0)}h=!0}if(h){ye(f),m||po(f);let p=!m&&f.pose.z<270;(p||f.shaded)&&(Oe=!0),f.shaded=p,(!i||f.i!==i.i)&&(pe=!0),o=!0}}Oe&&(ln(x,Ee,m),kt.bake(),Oe=!1,pe=!0),m&&Ht.setOpacity(n<0||we[0]===null?0:I((n-we[0])/k(600))),St&&(et.mesh.layers.set(i&&i.i===St.i?Je:0),et.place(St,Vn?0:St.pose.opacity));let c=Xe>=0||e<qn;if(c&&!window.__editionsTest?.stillCovers)for(let f of be)f?.update(t);if(i){let f=x[i.i],h=L.blur.sigma*i.blur;(pe||h!==Hn)&&(H.layers.set(0),tt.background(j,H,h),pe=!1,Hn=h),i.film&&He.update(...i.film),tt.composite(Math.min(1,i.blur*4)),H.layers.set(Je),P.autoClear=!1,P.clearDepth(),P.render(j,H),P.autoClear=!0,H.layers.set(0)}else Mt&&(Mt.draw(),Mt=null),P.render(j,H);Tt.firstFrameAt===null&&(Tt.firstFrameAt=performance.now(),Fa(Tt.firstFrameAt),qe.resolve(),o=!0),!Xt&&!o&&ga(),o||l||c||r?z():Ze=0}function In(e){if(!CSS.supports("animation-timing-function","linear(0, 1)"))return"cubic-bezier(0.16, 1, 0.3, 1)";let t=24,o=[],n=1-Math.exp(-1/e);for(let a=0;a<=t;a++)o.push(((1-Math.exp(-(a/t)/e))/n).toFixed(4));return`linear(${o.join(", ")})`}function Fa(e){zt=e,Lt=window.__editionsTest?.noSleeves?null:e,te.animate([{opacity:0},{opacity:1}],{duration:k(A.canvasFade.dur),easing:A.canvasFade.ease,fill:"forwards"});let t=A.header,o=k(t.tau*5);document.querySelectorAll(".rise").forEach((a,r)=>a.animate([{opacity:0,transform:`translateY(${-t.rise}px)`},{opacity:1,transform:"none"}],{duration:o,delay:C(t.at+t.stagger*r),easing:In(.2),fill:"forwards"}));let n=A.late;document.querySelectorAll(".late").forEach(a=>a.animate([{opacity:0},{opacity:1}],{duration:k(n.tau*5),delay:C(n.at),easing:In(.2),fill:"forwards"}))}function rt(){let e=i?-1:Ae;We.forEach((t,o)=>t.classList.toggle("hot",o===e)),te.style.cursor=i?mo()?"pointer":"":Ae>=0?"pointer":""}function Pe(e,t=!1){e!==Ae&&(Ae=e,At=performance.now(),rt(),e>=0&&!i&&(t||ae("hover",{pan:ze(e)}),ae("lift",{pan:ze(e),intensity:.8})),z())}function mo(){if(!i)return!1;let e=fo(i.i);return ee.x>=e.x&&ee.x<=e.x+e.width&&ee.y>=e.y&&ee.y<=e.y+e.height}var Ce=-1;window.addEventListener("pointermove",e=>{if(e.pointerType==="touch"||m)return;if(ee.x=e.clientX,ee.y=e.clientY,i){rt();return}let t=e.target.closest?.(".pm")?-1:uo(e.clientX,e.clientY);t!==Ce&&(Ce=t,Pe(t))});document.documentElement.addEventListener("pointerleave",()=>{Ce=-1,Pe(-1)});window.addEventListener("blur",()=>{Ce=-1,Pe(-1)});window.addEventListener("resize",co);te.addEventListener("click",e=>{if(m)return;if(ee.x=e.clientX,ee.y=e.clientY,i){if(i.exit)return;mo()?yo():_t();return}let t=uo(e.clientX,e.clientY);t>=0&&vo(t)});function Da(e,t){let o=I((t-C(A.appear.at+A.appear.stagger*e.i))/k(360));if(o>=1)return null;let n=w.pose(e);return n.opacity=o,ie()||(n.lift+=(1-Pa(o))*40/ne),n}var _n=-1,Bn=0;function Ne(e=!1){if(!m)return;let t=x.length,o=w.current,n=G[o],a=Ut.parentElement.clientHeight-Ut.offsetHeight;Ut.style.transform=`translateY(${((1-I(w.p/Math.max(1,t-1)))*a).toFixed(1)}px)`,!(o===_n&&!e)&&(_n=o,Ta.textContent=n.year||"",ka.textContent=n.name,Tn.dataset.index=String(o),Tn.setAttribute("aria-label",`Details: ${n.name}`),lo(Ha,o))}function Ga(){let e=w.current;e!==Bn&&(Bn=e,ct(`${G[e].name}, ${e+1} of ${x.length}`))}function $a(e,t){let o=Math.round(w.p),n=[];for(let a=0;a<o;a++)n.push(a);for(let a=o;a<x.length;a++)n.push(a);for(let a of n){if(!ce[a])continue;let r=fo(a);if(e>=r.x&&e<=r.x+r.width&&t>=r.y&&t<=r.y+r.height)return a}return-1}var Te=null;te.addEventListener("pointerdown",e=>{!m||J>=0||!e.isPrimary||(Te={x:e.clientX,y:e.clientY,id:e.pointerId},te.setPointerCapture(e.pointerId),i||(w.begin(e.clientY,e.timeStamp),z()))});te.addEventListener("pointermove",e=>{!Te||e.pointerId!==Te.id||i||(w.move(e.clientY,e.timeStamp),Ne(),z())});var xo=e=>t=>{if(!Te||t.pointerId!==Te.id)return;let{x:o,y:n}=Te;Te=null;let a=Math.hypot(t.clientX-o,t.clientY-n);if(e){w.cancel(),z();return}if(i||w.end(t.timeStamp),z(),a>=8)return;if(ee.x=t.clientX,ee.y=t.clientY,i){if(i.exit)return;mo()?yo():_t();return}let r=$a(t.clientX,t.clientY);r<0||(r===w.current&&Math.abs(w.p-r)<.05?vo(r):(w.go(r),ae("tick")))};te.addEventListener("pointerup",xo(!1));te.addEventListener("pointercancel",xo(!0));te.addEventListener("lostpointercapture",xo(!0));var Fn=0;window.addEventListener("wheel",e=>{!m||i||J>=0||(e.preventDefault(),e.timeStamp-Fn>200&&w.wheel(0),Fn=e.timeStamp,w.wheel(e.deltaY),z())},{passive:!1});lt.querySelector(".cb-back").addEventListener("click",()=>_t());function vo(e){if(i||!ce[e])return;let t=x[e],o=performance.now();t.fall=null,m&&w.go(e);let n=it(document.activeElement)===e?document.activeElement:null,a=!m&&t.x>0?-1:1;i={i:e,t0:o,asked:o,backIn:null,from:{...t.pose},dir:a,turn:a*Math.PI,flip:{from:0,to:0,t0:-1e9},exit:null,blur:0,ret:n},t.mesh.layers.set(Je),pe=!0,wa(e),ot.textContent=t.entry.name,nt.textContent=t.entry.tag,lo(ge,e),Ue.inert=!1,ge.inert=!1,st.inert=!0,document.body.classList.add("in-details");let r=L;Ve(It,0,r.headerOut.at,r.headerOut.dur);for(let s of[ot,nt])Ve(s,1,r.title.at,r.title.dur);Ve(ge,1,r.open.at,r.open.dur),He.attach(t),Ue.focus({preventScroll:!0}),ae("details",{pan:ze(e)}),ct(t.entry.tag?`Details: ${t.entry.name}. ${t.entry.tag}`:`Details: ${t.entry.name}`),rt(),z()}function yo(){if(!i||i.exit)return;let e=performance.now(),t=L.flip,o=i.flip,n=o.from+(o.to-o.from)*Se(t.ease,I((e-o.t0-C(t.at))/k(t.dur)));i.flip={from:n,to:o.to+i.dir*Math.PI,t0:e},ae("flip"),ct(ho(i.turn+i.flip.to)?"Back of the sleeve":"Front of the sleeve"),z()}function _t(){if(!i||i.exit)return;let e=x[i.i],t=performance.now(),o=L.exit,n=e.pose.yaw/Cn,a=Cn*(i.dir>0?Math.ceil(n-.5-1e-6):Math.floor(n+.5+1e-6)),r=Math.abs(a-e.pose.yaw)<.001?0:k(L.flip.dur)*(1-Kn);i.exit={t0:t,from:{...e.pose},yawTo:a,lag:r,blur:i.blur};for(let s of[ot,nt,ge])Ve(s,0,o.at,o.textOut);He.unzoom(!0),Ve(It,1,o.headerIn.at,o.headerIn.dur),Ue.inert=!0,ge.inert=!0,ae("close",{pan:ze(i.i)}),ct("Back to the shelf"),z()}function Zn(e,t,o=!1){let{i:n}=i,a=o?null:i.ret;if(i=null,Sa(e),e.pose=m?w.pose(e):Ge(),ye(e),e.mesh.layers.set(0),pe=Oe=!0,st.inert=!1,document.body.classList.remove("in-details"),m){a&&a.isConnected&&a.focus({preventScroll:!0}),Ne(!0),rt();return}Ce=o?-1:uo(ee.x,ee.y),Ae=Ce,At=t,a&&a.isConnected&&a.focus({preventScroll:!0}),U=Ae===n?n:-1,U!==n&&(e.fall={from:Ge(),t0:t}),po(e),rt()}var wo=null,Dn=null,J=-1,Pt=!1,Rt=0,go=()=>Dn||(Dn=import("./project-FCPGRAA7.js").then(e=>wo=e.createProjectView({renderer:P,entries:G,slugOf:xe,onBack:Oa})));function Va(e){ae("open",{pan:i?0:ze(e)}),go(),G[e].kind!=="about"&&import("./project-FCPGRAA7.js").then(t=>t.loadDossier(xe(G[e]))),Pt=!0,Rt=Yo.cut,ct(`Open: ${G[e].name}`),location.hash=xe(G[e])}async function Eo(){if(Ct)return;let e=decodeURIComponent(location.hash.slice(1)),t=G.findIndex(o=>xe(o)===e);if(t>=0){if(t===J)return;let o=await go();if(G.findIndex(n=>xe(n)===decodeURIComponent(location.hash.slice(1)))!==t||t===J)return;i&&bo(!0),Pe(-1),J=t;for(let n of te.getAnimations())n.finish();le?.setRoomTone(!1),Rt||ae("open"),await o.open(t,{cutAfter:Rt}),Rt=0}else if(J>=0){let o=J;if(J=-1,wo?.close(),le?.setRoomTone(!0),ae("close",{pan:ze(o)}),co(),m){w.jump(o);for(let n of x)ce[n.i]&&(n.pose=w.pose(n),ye(n));Ne(!0)}Oe=pe=!0,We[o].querySelector('[data-action="open"]').focus({preventScroll:!0}),z()}}function Oa(){Pt?(Pt=!1,history.back()):(history.pushState(null,"",location.pathname+location.search),Eo())}window.addEventListener("hashchange",()=>{location.hash||(Pt=!1),Eo()});function bo(e=!1){let t=x[i.i];for(let o of[ot,nt,ge])for(let n of o.getAnimations())n.cancel();He.detach(),Ve(It,1,0,1),Ue.inert=!0,ge.inert=!0,Zn(t,performance.now(),e),t.fall=null,U=-1}document.addEventListener("click",e=>{let t=e.target.closest("[data-action][data-index]");if(!t)return;let o=+t.dataset.index;if(t.dataset.action==="details"){vo(o);return}G[o].url||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||(e.preventDefault(),Va(o))});var it=e=>e&&e.closest&&e.closest(".slot")?We.indexOf(e.closest(".slot")):-1;st.addEventListener("focusin",e=>{let t=it(e.target);if(!(t<0)){if(m){i||(w.go(t),z());return}Pe(t,!0)}});st.addEventListener("focusout",e=>{it(e.relatedTarget)>=0||i||Pe(Ce)});window.addEventListener("keydown",e=>{if(e.metaKey||e.ctrlKey||e.altKey||J>=0||document.querySelector("dialog.ct[open]"))return;if(i){if(He.zoomed){e.key==="Escape"&&(e.preventDefault(),He.unzoom());return}e.key==="Escape"?(e.preventDefault(),_t()):(e.key===" "||e.code==="Space")&&(e.preventDefault(),e.repeat||yo());return}if(m){let r={ArrowLeft:-1,ArrowUp:-1,ArrowRight:1,ArrowDown:1}[e.key];if(r===void 0)return;e.preventDefault();let s=Math.max(0,Math.min(x.length-1,w.current+r));if(s===w.current)return;w.go(s),it(document.activeElement)>=0&&We[s].querySelector(`[data-action="${document.activeElement.dataset.action}"]`).focus({preventScroll:!0}),ae("tick"),z();return}let t={ArrowLeft:-1,ArrowRight:1,ArrowUp:-d.cols,ArrowDown:d.cols}[e.key];if(t===void 0)return;e.preventDefault();let o=it(document.activeElement),n=o<0?0:Math.max(0,Math.min(x.length-1,o+t));if(n===o)return;let a=document.activeElement?.dataset?.action==="open"?"open":"details";We[n].querySelector(`[data-action="${a}"]`).focus({preventScroll:!0}),ae("tick",{pan:ze(n)})});window.addEventListener("keyup",e=>{i&&(e.key===" "||e.code==="Space")&&e.preventDefault()});var So=window.matchMedia("(prefers-reduced-motion: reduce)");vt(So.matches);w.setReduced(So.matches);So.addEventListener?.("change",e=>{vt(e.matches),w.setReduced(e.matches)});var Tt={count:x.length,firstFrameAt:null,ready:qe.ready,covers:ya,sleeveRect:fo,frontCorners(e){let t=x[e].mesh.matrixWorld,o=d.size;return[[-o/2,0],[o/2,0],[o/2,o],[-o/2,o]].map(([n,a])=>(Q.set(n,a,d.thick).applyMatrix4(t),Le(Q.x,Q.y,Q.z)))},setCover(e,t,o){Dt(x[e],t,o),z()},get project(){return J>=0?xe(G[J]):null},get sleevesAt(){return Lt},coverReadyAt:On,appearAt:we,get crate(){return m?{p:w.p,current:w.current,dragging:w.dragging}:null},set stickerOff(e){Vn=!!e,z()},get details(){return i?{index:i.i,flipped:ho(i.turn+i.flip.to),closing:!!i.exit,blur:i.blur,yaw:x[i.i].pose.yaw,backIn:i.backIn===null?null:Math.round(i.backIn-i.asked)}:null}};window.__editions=Tt;co();for(let e of x)e.mesh.visible=!0;et.mesh.visible=!0;for(let e of[!0,!1]){for(let t of x)for(let o of[t.front,t.back,t.mats[0]])o.transparent=e,o.needsUpdate=!0;for(let t of[0,Je])H.layers.set(t),P.render(j,H);H.layers.enableAll(),P.render(j,H),H.layers.set(0),tt.background(j,H,1),tt.composite(.5)}for(let e of x)ye(e);et.mesh.visible=!1;pe=!0;qe.ready.then(()=>{location.hash&&Eo()});export{kr as drawn};
