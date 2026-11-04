import{A as xt,B as se,C as yt,D as _o,E as ye,F as wt,G as Do,H as Go,I as $o,J as Vo,K as Oo,L as oe,M as he,N as Uo,O as Wo,P as qo,R as Yo,S as No,T as jo,a as Lo,b as Ao,d as Ie,g as ht,h as zo,j as re,k as Co,l as mt,m as pe,n as Po,o as U,q as Z,r as _e,s as Fo,t as xe,u as Bo,v as vt,w as Io,z as k}from"./chunk-QESZHFER.js";import{a as F,b as gt,c as le,d as R,e as C,f as Me}from"./chunk-TH7WALPN.js";import{a as _t,b as Ko,c as ie,e as h,f as D,g as Zo,h as A,i as z}from"./chunk-GBXN2TGX.js";var Et=class extends ye{constructor(){super();let t=new xt;t.deleteAttribute("uv");let n=new he({side:Lo}),o=new he,a=new qo(16777215,900,28,2);a.position.set(.418,16.199,.3),this.add(a);let r=new k(t,n);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let i=new Do(t,o,6),l=new Bo;l.position.set(-10.906,2.009,1.846),l.rotation.set(0,-.195,0),l.scale.set(2.328,7.905,4.651),l.updateMatrix(),i.setMatrixAt(0,l.matrix),l.position.set(-5.607,-.754,-.758),l.rotation.set(0,.994,0),l.scale.set(1.97,1.534,3.955),l.updateMatrix(),i.setMatrixAt(1,l.matrix),l.position.set(6.167,.857,7.803),l.rotation.set(0,.561,0),l.scale.set(3.927,6.285,3.687),l.updateMatrix(),i.setMatrixAt(2,l.matrix),l.position.set(-2.017,.018,6.124),l.rotation.set(0,.333,0),l.scale.set(2.002,4.566,2.064),l.updateMatrix(),i.setMatrixAt(3,l.matrix),l.position.set(2.291,-.756,-2.621),l.rotation.set(0,-.286,0),l.scale.set(1.546,1.552,1.496),l.updateMatrix(),i.setMatrixAt(4,l.matrix),l.position.set(-2.193,-.369,-5.547),l.rotation.set(0,.516,0),l.scale.set(3.875,3.487,2.986),l.updateMatrix(),i.setMatrixAt(5,l.matrix),this.add(i);let c=new k(t,De(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);let f=new k(t,De(50));f.position.set(-16.109,18.021,-8.207),f.scale.set(.1,2.425,2.751),this.add(f);let p=new k(t,De(17));p.position.set(14.904,12.198,-1.832),p.scale.set(.15,4.265,6.331),this.add(p);let d=new k(t,De(43));d.position.set(-.462,8.89,14.52),d.scale.set(4.38,5.441,.088),this.add(d);let u=new k(t,De(20));u.position.set(3.235,11.486,-12.541),u.scale.set(2.5,2,.1),this.add(u);let v=new k(t,De(100));v.position.set(0,20,0),v.scale.set(1,.1,1),this.add(v)}dispose(){let t=new Set;this.traverse(n=>{n.isMesh&&(t.add(n.geometry),t.add(n.material))});for(let n of t)n.dispose()}};function De(e){return new Uo({color:0,emissive:16777215,emissiveIntensity:e})}var na=h.hoverLift.toFixed(2),ce=h.cols,Xo=(h.pitch/2).toFixed(2),aa={key:{rect:[1148.801,12.997,8768.289,3472.806],z:994.831,power:2.322},fill:{rect:[-2516.226,-9815.124,2516.226,10070.146],z:573.364,power:1.474},shelfAlbedo:1.219,shelfAmbient:.383,contact:{strength:.332,reach:19.033},keyMix:.571,base:{centre:.614,edge:.752,cy:-293.494,rx:806.633,ry:309.574,pow:.304},edgeShade:{strength:.989,reach:5.54},liftShade:{strength:.5,reach:8},halo:{right:.4,left:.383,top:.056,rise:.308,fall:60.395,row2:.724,vfall:10,drop:.881,dropReach:31.417},glow:{strength:.2,fall:100,side:60,fade:24.653,width:1100}},Ge=4*ce;function Qo(){return{uLightRect:{value:[new Z,new Z]},uLightZ:{value:[0,0]},uLightPower:{value:[0,0]},uShelf:{value:[new Z,new Z]},uShelfDepth:{value:0},uSlab:{value:Array.from({length:Ge},()=>new Z(0,0,0,0))},uSlabZ:{value:new Array(Ge).fill(1)},uSlabA:{value:new Array(Ge).fill(0)},uFoot:{value:Array.from({length:2*ce},()=>new Z(0,0,0,1e3))},uShelfAlbedo:{value:1},uShelfAmbient:{value:0},uContact:{value:new pe},uHalo:{value:new U},uHaloShape:{value:new Z},uHaloDrop:{value:new pe},uGlow:{value:new Z},uGlowWidth:{value:1e4},uEdgeShade:{value:new Z},uKeyMix:{value:.5},uBase:{value:new U},uBaseShape:{value:new U}}}function Jo(e,t=aa){[t.key,t.fill].forEach((n,o)=>{e.uLightRect.value[o].set(...n.rect),e.uLightZ.value[o]=n.z,e.uLightPower.value[o]=n.power}),e.uShelfAlbedo.value=t.shelfAlbedo,e.uShelfAmbient.value=t.shelfAmbient,e.uContact.value.set(t.contact.strength,t.contact.reach),e.uHalo.value.set(t.halo.right,t.halo.left,t.halo.top),e.uHaloShape.value.set(t.halo.rise,t.halo.fall,t.halo.row2,t.halo.vfall),e.uHaloDrop.value.set(t.halo.drop,t.halo.dropReach),e.uGlow.value.set(t.glow.strength,t.glow.fall,t.glow.side,t.glow.fade),e.uGlowWidth.value=t.glow.width,e.uEdgeShade.value.set(t.edgeShade.strength,t.edgeShade.reach,t.liftShade.strength,t.liftShade.reach),e.uKeyMix.value=t.keyMix,e.uBase.value.set(t.base.centre,t.base.edge,t.base.cy),e.uBaseShape.value.set(t.base.rx,t.base.ry,t.base.pow)}var bt=`
#define PI 3.141592653589793
uniform vec4 uLightRect[2];
uniform float uLightZ[2];
uniform float uLightPower[2];
uniform vec4 uShelf[2];      // x0, x1, y bottom, y top
uniform float uShelfDepth;
uniform vec4 uSlab[${Ge}];  // x0, y0, x1, y1 of a slab parallel to the wall
uniform float uSlabZ[${Ge}];
uniform float uSlabA[${Ge}];  // occlusion strength: the sleeve's opacity
uniform vec4 uFoot[${2*ce}];      // per sleeve: x0, x1, bottom edge depth, height of the bottom edge above its shelf

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
    for (int k = 0; k < ${2*ce}; k++) {
      int i = row * ${2*ce} + k;
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
  for (int k = 0; k < ${ce}; k++) {
    int i = row * ${2*ce} + k * 2;
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
    float wx = smoothstep(-uGlow.z, uGlow.z, cx + ${Xo}) - smoothstep(-uGlow.z, uGlow.z, cx - ${Xo});
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
  for (int k = 0; k < ${ce}; k++) {
    int i = row * ${2*ce} + k * 2;
    vec4 a = uSlab[i], b = uSlab[i + 1];
    if (a.z <= a.x) continue;
    float dx = min(a.x, b.x) - p.x;
    // It fades toward the top edge with the light beside the sleeve (uHaloDrop), where the sleeve meets the wall.
    if (dx > 0.0 && p.y >= a.y && p.y <= b.w)
      f *= 1.0 - uSlabA[i] * uEdgeShade.x * exp(-dx / uEdgeShade.y) * (1.0 - uHaloDrop.x * (1.0 - smoothstep(0.0, uHaloDrop.y, b.w - p.y)));
    // Under a lifted sleeve: a band from its bottom edge, offset a little to the left.
    float lift = clamp(uFoot[row * ${ce} + k].w / ${na}, 0.0, 1.0);
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
`;var ra=`
out vec2 vWorld;
uniform vec4 uRegion; // world x0, y0, x1, y1 covered by the texture
void main() {
  vWorld = mix(uRegion.xy, uRegion.zw, uv);
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`,sa=`
precision highp float;
in vec2 vWorld;
out vec4 outColor;
${bt}
void main() {
  int row = rowAt(vWorld.y);
  float seen = mix(wallLight(1, vWorld, row), wallLight(0, vWorld, row), uKeyMix);
  float e = wallBase(vWorld) * seen * edgeShade(vWorld, row) + haloAt(vWorld, row);
  outColor = vec4(vec3(e), 1.0);
}`,ia=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,la=`
uniform sampler2D uBake;
uniform float uGain;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(uBake, vUv).rgb * uGain;
  gl_FragColor = vec4(c, 1.0);
  #include <colorspace_fragment>
  float n = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  gl_FragColor.rgb += (n - 0.5) / 255.0;
}`;function en(e,t){let n=new _e(4,4,{type:ht,format:zo,depthBuffer:!1,minFilter:Ie,magFilter:Ie,generateMipmaps:!1}),o=new se({glslVersion:Co,uniforms:{...t,uRegion:{value:new Z}},vertexShader:ra,fragmentShader:sa,depthTest:!1,depthWrite:!1}),a=new ye;a.add(new k(new oe(2,2),o));let r=new yt,i=new se({uniforms:{uBake:{value:n.texture},uGain:{value:1}},vertexShader:ia,fragmentShader:la,toneMapped:!1}),l=new k(new oe(1,1),i);return l.renderOrder=-1,{mesh:l,resize(c,f,p,d,u,v,T=null){n.setSize(u,v),o.uniforms.uRegion.value.set(...T||[c,f,p,d]),l.scale.set(p-c,d-f,1),l.position.set((c+p)/2,(f+d)/2,0),l.updateMatrixWorld()},setGain(c){i.uniforms.uGain.value=c},bake(){let c=e.getRenderTarget();e.setRenderTarget(n),e.render(a,r),e.setRenderTarget(c)},dispose(){n.dispose(),o.dispose(),i.dispose(),l.geometry.dispose()}}}function ca(){let{width:e,depth:t,thick:n,bevel:o}=D,a=new Vo;a.moveTo(0,-n),a.lineTo(t-o,-n),a.absarc(t-o,-n+o,o,-Math.PI/2,0,!1),a.lineTo(t,-o),a.absarc(t-o,-o,o,0,Math.PI/2,!1),a.lineTo(0,0),a.closePath();let r=new Oo(a,{depth:e,bevelEnabled:!1,curveSegments:6});return r.applyMatrix4(new xe().set(0,0,-1,e/2,0,1,0,0,1,0,0,0,0,0,0,1)),r.computeVertexNormals(),r}var fa=`
varying vec3 vPos;
varying vec3 vNormal;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vPos = w.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,ua=`
${bt}
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
    for (int k = 0; k < ${h.cols}; k++) {
      vec4 f = uFoot[uRow * ${h.cols} + k];   // x0, x1, bottom edge depth, height above the shelf
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
}`;function tn(e){let t=ca();return D.tops.map((n,o)=>{let a=new se({uniforms:{...e,uRow:{value:o}},vertexShader:fa,fragmentShader:ua,toneMapped:!1}),r=new k(t,a);return r.position.set(0,n,0),r.updateMatrixWorld(),r})}var on=`
vec3 njNeutral(vec3 c) {
  const float start = 0.76, desat = 0.15;
  float x = min(c.r, min(c.g, c.b));
  c -= x < 0.08 ? x - 6.25 * x * x : 0.04;
  float peak = max(c.r, max(c.g, c.b));
  if (peak < start) return c;
  float d = 1.0 - start, np = 1.0 - d * d / (peak + d - start);
  c *= np / peak;
  return mix(c, vec3(np), 1.0 - 1.0 / (desat * (peak - np) + 1.0));
}`;var X=h.size,St=X*Math.sin(h.lean),cn={dx:0,yaw:0,opacity:1},N=()=>({...cn,lift:0,z:St,lean:h.lean}),$e=()=>({...cn,lift:h.hoverLift,z:h.hoverZ,lean:0}),Dt=["lift","z","lean","dx","yaw"],da="#d9d6d0";function Ze(e,t=null,n=null){return e.onBeforeCompile=o=>{if(o.fragmentShader=o.fragmentShader.replace("void main() {",`${on}
${t?`uniform float uMapBias;
`:""}${n?`uniform sampler2D uThumb;
uniform float uFade;
`:""}void main() {`).replace("#include <tonemapping_fragment>","gl_FragColor.rgb = njNeutral(gl_FragColor.rgb);"),t){o.uniforms.uMapBias=t;let a=n?"mix( texture2D( uThumb, vMapUv, uMapBias ), texture2D( map, vMapUv, uMapBias ), uFade )":"texture2D( map, vMapUv, uMapBias )";n&&Object.assign(o.uniforms,n),o.fragmentShader=o.fragmentShader.replace("#include <map_fragment>",Yo.map_fragment.replace("texture2D( map, vMapUv )",a))}},e.customProgramCacheKey=()=>t?n?"nj-neutral-bias-fade":"nj-neutral-bias":"nj-neutral",e}var fn=new wt(new Uint8Array([255,255,255,255]),1,1);fn.needsUpdate=!0;var Xe={value:0};function un(e){let t=new xt(X,X,h.thick);return t.translate(0,X/2,h.thick/2),e.map((n,o)=>{let a=Ze(new he({color:15855594,roughness:.8})),r=o%h.cols,i=Math.floor(o/h.cols),l=Math.min(h.cols,e.length-i*h.cols),c={uThumb:{value:fn},uFade:{value:1}},f=Ze(new he({color:new vt(n.accent?.light||da),roughness:.8}),Xe,c),p=Ze(new he({color:15328992,roughness:.7})),d=[a,a,a,a,f,p],u=new k(t,d);u.matrixAutoUpdate=!1;let v={i:o,row:i,col:r,mesh:u,front:f,back:p,mats:d,entry:n,fade:c,thumb:null,hasCover:!1,x:(r-(l-1)/2)*h.pitch,shelfY:D.tops[i],pose:{...N(),opacity:0}};return ge(v),v})}var nn=new Po,pa=new U(1,0,0),an=new U,ha=new U(1,1,1),Re=new U,rn=new xe,sn=new xe,ln=new xe;function ge(e){let t=e.pose;an.set(e.x+t.dx,e.shelfY+t.lift,t.z),nn.setFromAxisAngle(pa,-t.lean),e.mesh.matrix.compose(an,nn,ha),t.yaw&&(Re.set(0,X/2,h.thick/2).applyMatrix4(e.mesh.matrix),sn.makeTranslation(Re.x,Re.y,Re.z),ln.makeTranslation(-Re.x,-Re.y,-Re.z),rn.makeRotationY(t.yaw),e.mesh.matrix.premultiply(ln).premultiply(rn).premultiply(sn)),e.mesh.matrixWorld.copy(e.mesh.matrix),e.mesh.visible=t.opacity>.001;let n=t.opacity<.999;for(let o of[e.front,e.back,e.mats[0]])o.transparent!==n&&(o.transparent=n,o.needsUpdate=!0),o.opacity=t.opacity}function dn(e,t,n=!1){for(let o of e){let a=o.pose,r=Math.cos(a.lean),i=Math.sin(a.lean),l=o.shelfY+a.lift,c=h.thick/2,f=o.x+a.dx,p=mt.smoothstep(a.z,110,260),d=o.mesh.visible&&!n?a.opacity*(1-p):0,u=(o.row*h.cols+o.col)*2;for(let v=0;v<2;v++){let T=v/2,O=(v+1)/2;d>0?t.uSlab.value[u+v].set(f-X/2,l+X*T*r,f+X/2,l+X*O*r):t.uSlab.value[u+v].set(0,0,0,0),t.uSlabZ.value[u+v]=Math.max(1.5,a.z-X*(T+O)/2*i+c),t.uSlabA.value[u+v]=d}t.uFoot.value[o.i].set(f-X/2,f+X/2,a.z+h.thick,d>0?a.lift:1e3)}}function pn(e,t){e.thumb=t,!e.hasCover&&(e.front.map=t,e.front.color.set(16777215),e.front.needsUpdate=!0)}function Gt(e,t,n){let o=!1;return t&&(o=!e.hasCover&&!!e.thumb&&e.front.map===e.thumb,o&&(e.fade.uThumb.value=e.thumb,e.fade.uFade.value=0),e.hasCover=!0,e.front.map=t,e.front.color.set(16777215),e.front.needsUpdate=!0),n&&(e.back.map=n,e.back.color.set(16777215),e.back.needsUpdate=!0),o}var hn=15,Mt=e=>e*e,Rt=(e,t,n)=>{let o={...t};for(let a of Dt)o[a]=e[a]+(t[a]-e[a])*n;return o.opacity=e.opacity+(t.opacity-e.opacity)*n,o};function mn(e){let t=z.appear.at+z.appear.stagger*e,n=z.drop.at+z.drop.stagger*e,o=n+z.drop.dur,a=o+z.lean.delay;return{appear:t,drop:n,land:o,lean:a,rest:a+z.lean.dur}}var $t=e=>le()?200+40*e:mn(e).appear;function vn(e,t){if(le()){let l=$t(e);return t>=l+160?null:{...N(),opacity:F((t-l)/160)}}let n=mn(e);if(t>=n.rest)return null;if(t<n.appear)return{...N(),opacity:0};let o=z.appearPose,a=1-.345*Math.exp(-(t-n.appear)/150),r={...N(),lift:o.lift,z:o.z,lean:0,opacity:a};if(t<n.drop)return r;if(t<n.land){let l=Mt(F((t-n.drop)/z.drop.dur));return{...r,lift:o.lift*(1-l),z:o.z+(St-o.z)*l}}let i=Mt(F((t-n.lean)/z.lean.dur));return{...r,lift:0,z:St,lean:h.lean*i}}function xn(e,t){let n=$e(),o=1-Math.exp(-t/(le()?.04:h.hoverTau)),a=!1;for(let r of Dt){let i=n[r]-e.pose[r];Math.abs(i)>.001?(e.pose[r]+=i*o,a=!0):e.pose[r]=n[r]}return e.pose.opacity=1,a}function yn(e,t){let n=le()?{delay:0,drop:90,pause:0,lean:60}:Zo,o=N();if(t<n.delay)return{...e};let a=t-n.delay,r={...o,lean:Math.min(e.lean,o.lean)};if(a<n.drop)return Rt(e,r,Mt(a/n.drop));let i=a-n.drop-n.pause;return i<0?r:i<n.lean?Rt(r,o,Mt(i/n.lean)):null}var wn=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,ma=`
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
}`,va=`
uniform sampler2D uSharp;
uniform sampler2D uBlur;
uniform float uMix;
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(mix(texture2D(uSharp, vUv).rgb, texture2D(uBlur, vUv).rgb, uMix), 1.0);
  #include <colorspace_fragment>
}`;function gn(e){let t=new _e(4,4,{samples:4,colorSpace:re}),n={type:ht,depthBuffer:!1,minFilter:Ie,magFilter:Ie},o=new _e(4,4,n),a=new _e(4,4,n),r=new se({uniforms:{uTex:{value:null},uDir:{value:new pe},uSigma:{value:0}},vertexShader:wn,fragmentShader:ma,depthTest:!1,depthWrite:!1}),i=new se({uniforms:{uSharp:{value:t.texture},uBlur:{value:o.texture},uMix:{value:0}},vertexShader:wn,fragmentShader:va,depthTest:!1,depthWrite:!1}),l=new k(new oe(2,2),r);l.frustumCulled=!1;let c=new ye;c.add(l);let f=new yt,p=.5,d=(u,v)=>{l.material=u,e.setRenderTarget(v),e.render(c,f)};return{resize(u,v){t.setSize(u,v),o.setSize(Math.ceil(u/2),Math.ceil(v/2)),a.setSize(Math.ceil(u/2),Math.ceil(v/2)),p=e.getPixelRatio()/2},background(u,v,T){let O=e.getRenderTarget();e.setRenderTarget(t),e.clear(),e.render(u,v);let I=T*p;r.uniforms.uSigma.value=I,r.uniforms.uTex.value=t.texture,r.uniforms.uDir.value.set(1/o.width,0),d(r,a),r.uniforms.uTex.value=a.texture,r.uniforms.uDir.value.set(0,1/o.height),d(r,o),e.setRenderTarget(O)},composite(u){i.uniforms.uMix.value=u,d(i,null)},dispose(){t.dispose(),o.dispose(),a.dispose(),r.dispose(),i.dispose()}}}var Ot=h.size,En=.255*Ot,Vt={x:.3245*Ot,y:.8255*Ot,z:h.thick+.25};function xa(e){let n=document.createElement("canvas");n.width=n.height=512;let o=n.getContext("2d"),a=512/2,r=512*.44,i=11;o.beginPath();for(let d=0;d<=720;d++){let u=d/720*Math.PI*2,v=r*(1+.065*Math.cos(i*u));o.lineTo(a+v*Math.cos(u),a+v*Math.sin(u))}o.closePath(),o.save(),o.clip();let l=o.createConicGradient?o.createConicGradient(.6,a,a):o.createLinearGradient(0,0,512,512);["#ffa6e6","#9af2dc","#c4b2ff","#ffe596","#9fd6ff","#ffb8dc","#ffa6e6"].forEach((d,u,v)=>l.addColorStop(u/(v.length-1),d)),o.fillStyle=l,o.fillRect(0,0,512,512),[[.3,.3,"#9af2dc"],[.7,.62,"#ffa6e6"],[.42,.72,"#ffe596"],[.68,.28,"#c4b2ff"],[.25,.58,"#ffb8dc"]].forEach(([d,u,v])=>{let T=o.createRadialGradient(d*512,u*512,0,d*512,u*512,102.4);T.addColorStop(0,v+"cc"),T.addColorStop(1,v+"00"),o.fillStyle=T,o.fillRect(0,0,512,512)});let c=o.createRadialGradient(a*.8,a*.7,0,a*.8,a*.7,512*.55);c.addColorStop(0,"rgba(255,255,255,0.75)"),c.addColorStop(1,"rgba(255,255,255,0)"),o.fillStyle=c,o.fillRect(0,0,512,512),o.restore(),o.translate(a,a),o.rotate(12*Math.PI/180),o.fillStyle="#000",o.textAlign="center",o.textBaseline="alphabetic",o.font=`800 ${512*.15}px 'NJ Text', system-ui, sans-serif`;let f=512*.15;e.forEach((d,u)=>o.fillText(d,0,(u-(e.length-1)/2)*f+512*.055));let p=new $o(n);return p.colorSpace=re,p.anisotropy=4,p}var bn=new vt().setRGB(1,.96,1);function Sn(e){let t=xa(e.toUpperCase().split(" ")),n=Ze(new he({map:t,emissiveMap:t,color:bn,emissive:bn,emissiveIntensity:.5,transparent:!0,roughness:.8,metalness:0,depthWrite:!1}),Xe),o=new k(new oe(En,En),n);o.matrixAutoUpdate=!1,o.visible=!1,o.renderOrder=1;let a=new xe().makeTranslation(Vt.x,Vt.y,Vt.z);return{mesh:o,place(r,i){o.visible=i>.002&&r.mesh.visible,o.visible&&(n.opacity=i,o.matrix.multiplyMatrices(r.mesh.matrix,a),o.matrixWorld.copy(o.matrix))}}}var g={width:.682,bottom:.797,lean:56*Math.PI/180,strip:.124,top:132,flatLean:78*Math.PI/180,flatStrip:.07,flatMax:4,drag:150,carry:.06,omega:8.5,details:{size:.815,centreY:.404},wheelNotch:60,groundGain:.838,edgeColour:1842204,shadow:{y0:.403,y1:.794,alpha:.054,feather:20}};function Mn(){let e=new se({uniforms:{uSize:{value:new pe(1,1)},uFeather:{value:1},uAlpha:{value:g.shadow.alpha}},vertexShader:"varying vec2 vP; uniform vec2 uSize; void main() { vP = uv * uSize; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`varying vec2 vP; uniform vec2 uSize; uniform float uFeather, uAlpha;
      void main() { float d = min(vP.y, uSize.y - vP.y);   // soft top and bottom; it runs off the left edge and under the crate
        gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha * smoothstep(0.0, uFeather, d)); }`,transparent:!0,depthWrite:!1,toneMapped:!1}),t=new k(new oe(1,1),e);return t.renderOrder=-.5,t.visible=!1,{mesh:t,setOpacity(n){e.uniforms.uAlpha.value=g.shadow.alpha*n},layout(n,o,a){let r=-n/2/a-2,i=0,l=(o/2-g.shadow.y1*o)/a,c=(o/2-g.shadow.y0*o)/a;t.scale.set(i-r,c-l,1),t.position.set((r+i)/2,(l+c)/2,.5),t.updateMatrixWorld(),e.uniforms.uSize.value.set(i-r,c-l),e.uniforms.uFeather.value=g.shadow.feather/a}}}function Rn(e){let t=h.size,n=0,o=0,a=0,r=null,i=0,l=!1,c=0,f=0,p=0,d=0,u=0,v=1,T=y=>Math.max(0,Math.min(e-1,y));function O(y,E,b){let _=g.width*y/t;c=(E/2-g.bottom*E)/_;let K=g.bottom*E-t*_*Math.cos(g.lean);return f=Math.min(g.strip*t,e>1?Math.max(0,K-g.top)/(e-1)/_:0),p=f*Math.tan(g.lean)+4,d=g.flatStrip*t,u=(e-1)*p+t*Math.sin(g.lean)+10,v=_*(b-u)/b,v}let I=y=>d*g.flatMax*(1-Math.exp(-y/g.flatMax));function q(y){let E=y.i-n,b=N();if(b.dx=-y.x,E>=0)b.lean=g.lean,b.lift=c+E*f-y.shelfY,b.z=u-E*p;else{let _=-E,K=Math.min(1,_);b.lean=g.lean+(g.flatLean-g.lean)*K,b.lift=c-I(_)-y.shelfY,b.z=u+.8*t*K+5*Math.max(0,I(_)-I(1))}return b}function Be(y){if(r)return!0;let E=l?30:g.omega,b=E*E*(a-n)-2*E*o;return o+=b*y,n+=o*y,Math.abs(a-n)<.001&&Math.abs(o)<.01?(n=a,o=0,!1):!0}return{layout:O,pose:q,step:Be,get p(){return n},get current(){return T(Math.round(r?n:a))},get dragging(){return!!r},setReduced(y){l=!!y},go(y){a=T(y)},jump(y){a=n=T(y),o=0},begin(y,E){r={y0:y,p0:n,samples:[[E,y]]},o=0},move(y,E){if(!r)return;let b=r.p0+(y-r.y0)/g.drag;for(b<0?b/=3:b>e-1&&(b=e-1+(b-e+1)/3),n=b,r.samples.push([E,y]);r.samples.length>2&&E-r.samples[0][0]>100;)r.samples.shift()},end(y){if(!r)return 0;let E=r.samples,b=E[0],_=E[E.length-1],K=Math.abs(_[1]-r.y0),dt=_[0]-b[0]>8&&y-_[0]<80?(_[1]-b[1])/(_[0]-b[0])*1e3:0;return r=null,o=Math.max(-12,Math.min(12,dt/g.drag)),a=T(Math.round(n+(l?0:o*g.carry))),l&&(o=0),K},cancel(){r&&(r=null,a=T(Math.round(n)))},wheel(y){for(i+=y;Math.abs(i)>=g.wheelNotch;){let E=Math.sign(i);a=T(a+E),i-=E*g.wheelNotch}}}}var Ut=16/9,ya=500;function Tn({camera:e,layer:t,wake:n,dur:o,els:a}){let{frame:r,video:i,play:l,close:c,shade:f}=a,p=new Go(i);p.colorSpace=re;let d=new Io({map:p,transparent:!0,opacity:0,toneMapped:!1,depthWrite:!1}),u=new k(new oe(1,1),d);u.rotation.y=Math.PI,u.layers.set(t),u.visible=!1;let v=h.size,T=new U,O=!1,I=!1,q=null,Be=!1,y=0;for(let S of["loadeddata","seeked"])i.addEventListener(S,()=>{p.needsUpdate=!0,n()});let E=()=>{clearTimeout(y),O&&!Be&&(Be=!0,i.play().then(n,()=>{}))},b=(S,M)=>(T.set(S,M,0),u.localToWorld(T),T.project(e),[(T.x+1)/2*innerWidth,(1-T.y)/2*innerHeight]),_=()=>{let[S,M]=b(-.5,.5),[Y,Ke]=b(.5,-.5);return{left:Math.min(S,Y),top:Math.min(M,Ke),width:Math.abs(Y-S),height:Math.abs(Ke-M)}},K=S=>({left:`${S.left}px`,top:`${S.top}px`,width:`${S.width}px`,height:`${S.height}px`}),dt=()=>{let S=Math.min(innerWidth*.92,innerHeight*.86*Ut),M=S/Ut;return{left:(innerWidth-S)/2,top:(innerHeight-M)/2,width:S,height:M}},Ho=(S,M,Y)=>(Object.assign(r.style,K(M)),r.animate([K(S),K(M)],{duration:o(Y),easing:"cubic-bezier(0.3, 0, 0.15, 1)"}).finished.catch(()=>{}));function oa(){!O||I||!q||(I=!0,l.hidden=!0,r.classList.add("on"),f.classList.add("on"),c.hidden=!1,i.muted=!1,E(),Ho(q,dt(),560).then(()=>{I&&(i.controls=!0,c.focus({preventScroll:!0}))}))}function pt(S=!1){if(!I)return;I=!1,i.controls=!1,i.muted=!0,f.classList.remove("on"),c.hidden=!0;let M=()=>{I||(r.classList.remove("on"),O&&(l.hidden=!1))};if(S||!q){for(let Y of r.getAnimations())Y.cancel();M();return}Ho(r.getBoundingClientRect(),q,420).then(M)}return l.addEventListener("click",oa),c.addEventListener("click",()=>pt()),f.addEventListener("click",()=>pt()),addEventListener("resize",()=>{I&&Object.assign(r.style,K(dt()))}),{get zoomed(){return I},unzoom:pt,attach(S){let M=S.entry.video;if(!M)return!1;let Y=M.band;u.scale.set(v,v*Y,1),u.position.set(0,v-v*Y/2,-v*.002);let Ke=Y*Ut;return p.repeat.set(1,Ke),p.offset.set(0,(1-Ke)/2),S.mesh.add(u),i.getAttribute("src")!==M.src&&(i.poster=M.poster,i.src=M.src),i.muted=!0,i.pause(),i.currentTime=M.start||0,O=!0,Be=!1,!0},detach(){O&&(pt(!0),O=!1,q=null,clearTimeout(y),i.pause(),u.removeFromParent(),u.visible=!1,d.opacity=0,l.hidden=!0)},update(S,M){if(!O)return!1;if(d.opacity=S,u.visible=S>0,M&&!I){u.parent.updateMatrixWorld(),u.updateMatrixWorld(),q=_();let Y={x:q.left+q.width/2,y:q.top+q.height/2};l.style.left=`${Y.x}px`,l.style.top=`${Y.y}px`,r.classList.contains("on")||Object.assign(r.style,K(q))}return M&&!Be&&!y&&(y=setTimeout(()=>{y=0,E()},ya)),I||(l.hidden=!M),u.visible&&!i.paused&&n(),u.visible}}}var B=Ko,te=document.getElementById("c"),P=new jo({canvas:te,antialias:!0,powerPreference:"high-performance"});P.outputColorSpace=re;P.toneMapping=Ao;var j=new ye,Un=new No(P);j.environment=Un.fromScene(new Et,.04).texture;j.environmentIntensity=.46;Un.dispose();var be=Qo();Jo(be);D.tops.forEach((e,t)=>be.uShelf.value[t].set(-D.width/2,D.width/2,e-D.thick,e));be.uShelfDepth.value=D.depth;var Ht=en(P,be);j.add(Ht.mesh);var Wn=tn(be);for(let e of Wn)j.add(e);var m=un(B);Xe.value=window.__editionsTest?.coverBias??-.5;var He=new wt(new Uint8Array([255,255,255,255]),1,1);He.colorSpace=re;He.needsUpdate=!0;for(let e of m)e.front.map=He,e.back.map=He,j.add(e.mesh);var ot=1,Tt=m.find(e=>e.entry.newest)||null,qn=!1,nt=Sn("Now playing");j.add(nt.mesh);var at=gn(P),V=2556,H=new _o(20,1,100,V*2),Le=Tn({camera:H,layer:ot,wake:()=>L(),dur:R,els:{frame:document.getElementById("film-frame"),video:document.querySelector("#film-frame video"),play:document.getElementById("d-play"),close:document.getElementById("d-close"),shade:document.getElementById("film-shade")}});H.position.set(0,0,V);var w=Rn(m.length),Lt=Mn();j.add(Lt.mesh);var Se=m.map(()=>null),Yn=m.map(()=>null),Xt=m.map(()=>null),Qt=m.map(()=>null),ga=320,Je=[],Ea=1,lo=null,co=new Promise(e=>requestAnimationFrame(()=>requestAnimationFrame(e))).then(()=>import("./covers-DER3UHLR.js")).then(e=>lo=e),ba=(e,t,n)=>co.then(o=>o.createCover(P,e.entry,t,n)),Jt=()=>At===null?0:performance.now()-At,kn=window.__editionsTest?.coverLate||{},Sa=0;function Nn(){let e=Sa++;if(e>=m.length)return Promise.resolve();let t=m[e],n=()=>{Xt[e]=Jt(),Yn[e]=At===null?null:Math.round(Xt[e]),L()};return ba(t,e,{size:1024,backSize:0}).then(o=>{let a=()=>{Se[e]=o,Gt(t,o.front,null)&&Je.push({s:t,at:performance.now()}),n()};kn[e]==null?a():setTimeout(a,Math.max(0,to(e)+kn[e]-Jt()))},o=>{console.warn(`cover ${t.entry.name}: flat sleeve (${o?.message||o})`),n()}).then(Nn)}var Ma=co.then(()=>Promise.all(Array.from({length:Ea},Nn))),Ra=new Wo;for(let e of m)Ra.load(new URL(`./covers/thumbs/${ie(e.entry)}.webp`,new URL("../main.js",import.meta.url).href).href,t=>{t.colorSpace=re,t.anisotropy=P.capabilities.getMaxAnisotropy(),pn(e,t),Qt[e.i]=Jt(),L()},void 0,()=>{});function Ta(e){let t=m[e],n=Se[e]?.detailBack(1024).then(o=>{s&&s.i===e&&(t.back.map=o||He,t.back.color.set(o?16777215:jn),t.back.needsUpdate=!0,L())}).catch(o=>console.warn(`cover ${t.entry.name}: no Details back (${o?.message||o})`));Promise.resolve(n).then(()=>{s&&s.i===e&&s.backIn===null&&(s.backIn=performance.now())})}var eo=!1;function ka(){if(eo||!Se[0]||de.some(t=>!t))return;eo=!0;let e=window.requestIdleCallback||(t=>setTimeout(t,200));e(()=>{s||Se[0].detailBack(1024).catch(()=>{}),e(()=>Mo().then(t=>t.warm()).catch(t=>console.warn(`page warm-up: ${t?.message||t}`)),{timeout:3e3})},{timeout:2e3})}var jn=15328992,Hn=600,Ee=m.map(()=>null),Ln=m.map(()=>0),to=e=>x?C(z.appear.at+z.appear.stagger*e):$t(e);function Ha(e,t){if(Ee[e]===null){if(e>0&&Ee[e-1]===null)return null;let n=to(e),o=e>0?Math.max(n,Ee[e-1]+n-to(e-1)):n,r=Xt[e]??Qt[e]??(t>=n+Hn?n+Hn:null);if(r===null||t<Math.max(o,r))return null;Ee[e]=Math.max(o,r),Ln[e]=Ee[e]-n,!Se[e]&&Qt[e]===null&&La(m[e])}return Ln[e]}function La(e){let t=lo?.coverGround?.(e.entry,e.i)||e.entry.accent?.light;t&&e.front.color.set(t)}function Aa(e){e.back.map!==He&&(e.back.map=He,e.back.color.set(jn),e.back.needsUpdate=!0)}var et=-1,Kn=0;function za(e){e!==et&&(et>=0&&(Se[et]?.setAlive(!1),Kn=performance.now()+1700),et=e,e>=0&&Se[e]?.setAlive(!0))}co.then(e=>{e.coverMotion.attach({wake:L,reduced:le,test:window.__editionsTest?.coverMotion}),window.__editions&&(window.__editions.coverMotion=e.coverMotion)});var Ca=e=>!window.__editionsTest?.stillCovers&&lo?.coverMotion.step(e,{ready:de.every(Boolean),details:!!s,crate:x?w.current:-1}),ue=null,Wt=null,oo=document.querySelector(".sound");function fo(){let e=!!ue?.enabled;oo.setAttribute("aria-pressed",String(e)),oo.setAttribute("aria-label",e?"Sound on":"Sound off")}function uo(){return Wt||(Wt=import("./audio-3KD7PEEU.js").then(e=>(ue=e.createAudio(),ue.setRoomTone(!0),fo(),ue))),Wt}var ae=(e,t)=>{window.__editions?.soundLog?.push([e,Math.round(performance.now())]),ue?.play(e,t)},Ae=e=>Math.max(-1,Math.min(1,m[e].x/600));for(let e of["pointermove","pointerdown","keydown","touchstart"])window.addEventListener(e,uo,{once:!0,capture:!0,passive:!0});var Zn=()=>{ue?ue.unlock():uo().then(e=>e.unlock())};window.addEventListener("pointerdown",Zn,{once:!0,capture:!0});window.addEventListener("keydown",Zn,{once:!0,capture:!0});oo.addEventListener("click",async()=>{let e=ue||await uo();e.setEnabled(!e.enabled),fo()});fo();var ft=document.getElementById("slots"),We=m.map(e=>{let t=B[e.i],n=document.createElement("li");n.className="slot";let o=document.createElement("article");o.setAttribute("aria-labelledby",`sl-${e.i}`);let a=document.createElement("h2");if(a.className="sr",a.id=`sl-${e.i}`,a.textContent=t.name,o.appendChild(a),t.tag){let l=document.createElement("p");l.className="sr",l.textContent=t.year?`${t.tag}, ${t.year}`:t.tag,o.appendChild(l)}let r=document.createElement("a");r.dataset.action="open",r.textContent="Open",po(r,e.i);let i=document.createElement("button");return i.type="button",i.dataset.action="details",i.dataset.index=String(e.i),i.textContent="Details",i.setAttribute("aria-label",`Details: ${t.name}`),o.append(r,i),n.appendChild(o),ft.appendChild(n),n});function Xn(e,t){let n=B[t];e.dataset.index=String(t),e.href=`#${ie(n)}`,e.hidden=!n.url,e.setAttribute("aria-label",`More detail: ${n.name}`)}function po(e,t){let n=B[t];e.dataset.index=String(t),e.href=n.url||`#${ie(n)}`,n.url?(e.target="_blank",e.rel="noopener"):(e.removeAttribute("target"),e.removeAttribute("rel")),e.setAttribute("aria-label",n.url?`Open: ${n.name} site, new tab`:`Open: ${n.name}`)}var je=document.getElementById("crate-bar"),Pa=je.querySelector(".cb-year"),Fa=je.querySelector(".cb-name"),An=je.querySelector(".cb-details"),Ba=je.querySelector(".cb-open"),Ia=je.querySelector(".cb-more"),qt=document.querySelector(".crate-rail span"),zn=document.getElementById("announce");function ut(e){zn.textContent="",requestAnimationFrame(()=>{zn.textContent=e})}document.getElementById("index").append(...B.map(e=>{let t=document.createElement("li"),n=document.createElement("span");n.className="y",n.textContent=e.year||"";let o=document.createElement("span");return o.className="n",o.textContent=e.name,t.append(n,o),t}));var Bt=document.querySelector(".tagline"),qe=document.getElementById("details"),rt=qe.querySelector(".d-title"),st=qe.querySelector(".d-tag"),me=document.getElementById("d-open"),ve=document.getElementById("d-more");function Oe(e,t,n,o){let a=+getComputedStyle(e).opacity;for(let r of e.getAnimations())r.cancel();e.animate([{opacity:a},{opacity:t}],{duration:R(o),delay:C(n),easing:"ease",fill:"both"})}var $=0,G=0,ne=1,x=!1,no=0,ao=0,ro=0,Qn=0,Ve=0,_a=14,Yt=new pe;function ho(){$=window.innerWidth,G=window.innerHeight;let e=x;x=$<600,V=x?2556*4:2556,ne=x?w.layout($,G,V):_t($,G),H.position.z=V,H.far=V*2;let t=$/2/ne,n=G/2/ne;if(H.fov=mt.radToDeg(2*Math.atan(n/V)),H.aspect=$/G,H.clearViewOffset(),H.updateMatrixWorld(),Ve=0,!x){let c=N(),f=h.size,p=ze(0,D.tops[0]+f*Math.cos(c.lean),c.z-f*Math.sin(c.lean)+h.thick).y;Ve=Math.max(0,Math.round(Bt.getBoundingClientRect().bottom+_a-p)),Ve&&H.setViewOffset($,G,0,-Ve,$,G)}P.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),P.setSize($,G,!1),P.getDrawingBufferSize(Yt),at.resize(Yt.x,Yt.y);let o=x?_t($,G):ne,a=$/2/o*1.02,r=G/2/o*1.02,i=Ve/ne;Ht.resize(-t*1.02,-n*1.02+i,t*1.02,n*1.02+i,Math.ceil($/2),Math.ceil(G/2),x?[-a,-r,a,r]:null),Ue=fe=!0,no=x?g.details.size*$:A.size*ne,ao=x?g.details.centreY*G:G/2-(900/2-A.centreY)*ne,ro=V*(1-h.size*ne/no),Qn=(G/2+Ve-ao)/ne*(V-ro)/V;let l=x||!!window.__editionsTest?.noShelves;for(let c of Wn)c.visible=!l;Ht.setGain(x?g.groundGain:1),Lt.mesh.visible=x,x&&Lt.layout($,G,ne);for(let c of m)c.mats[0].color.set(x?g.edgeColour:15855594);if(D.tops.forEach((c,f)=>l?be.uShelf.value[f].set(0,0,-1e5,-1e5):be.uShelf.value[f].set(-D.width/2,D.width/2,c-D.thick,c)),document.body.classList.toggle("crate",x),x!==e){s&&To(),Fe(-1);for(let c of m)de[c.i]&&(c.fall=null,c.pose=so(c),ge(c));Ne(!0)}else if(x)for(let c of m)de[c.i]&&!(s&&s.i===c.i)&&(c.pose=so(c),ge(c));Jn=m.map(c=>Da(c)),x||m.forEach(xo),$a(),L()}var so=e=>x?w.pose(e):N(),Nt=new U,Te=new Fo;function ze(e,t,n){return Nt.set(e,t,n).project(H),{x:(Nt.x+1)/2*$,y:(1-Nt.y)/2*G}}function mo(e){let t=m[e].mesh;t.geometry.boundingBox||t.geometry.computeBoundingBox(),Te.copy(t.geometry.boundingBox).applyMatrix4(t.matrixWorld);let n=1/0,o=1/0,a=-1/0,r=-1/0;for(let i of[Te.min.x,Te.max.x])for(let l of[Te.min.y,Te.max.y])for(let c of[Te.min.z,Te.max.z]){let f=ze(i,l,c);n=Math.min(n,f.x),a=Math.max(a,f.x),o=Math.min(o,f.y),r=Math.max(r,f.y)}return{x:n,y:o,width:a-n,height:r-o}}var Jn=[];function Da(e){let t=h.size,n=e.shelfY,o=ze(e.x-t/2,n+h.hoverLift+t,h.hoverZ),a=ze(e.x+t/2,n,0);return{x0:o.x,y0:o.y,x1:a.x,y1:a.y}}function vo(e,t){let n=-1;return Jn.forEach((o,a)=>{de[a]&&e>=o.x0&&e<=o.x1&&t>=o.y0&&t<=o.y1&&(n=a)}),n}var Q=new U,tt=e=>{let t=P.getPixelRatio();return Math.round(e*t)/t};function xo(e){Q.set(-h.size/2,0,h.thick).applyMatrix4(e.mesh.matrixWorld);let t=ze(Q.x,Q.y,Q.z);Q.set(h.size/2,0,h.thick).applyMatrix4(e.mesh.matrixWorld);let o=ze(Q.x,Q.y,Q.z).x-t.x;We[e.i].style.transform=`translate3d(${tt(t.x+o*.1175)}px, ${tt(t.y-o*.025-35)}px, 0)`}function Ga(e){return{...N(),lean:0,dx:-e.x,lift:Qn-h.size/2-e.shelfY,z:ro-h.thick/2}}function $a(){let e=ao;rt.style.top=`${tt(e-54.2)}px`,st.style.top=`${tt(e-13.6)}px`,me.style.top=ve.style.top=`${tt(e+no/2+16)}px`}var it=0,Qe=0,Ue=!0,fe=!0,At=null,zt=null,Ce=-1,W=-1,Ct=0,s=null,Cn=-1,Pn=!1,de=m.map(()=>!1),ee={x:-1,y:-1},Ye={};Ye.ready=new Promise(e=>{Ye.resolve=e});var Br=Ye.ready;function L(){it||(it=requestAnimationFrame(Wa))}function Fn(e,t){let n=h.size,o=h.thick;return{x:e.x+t.dx,y:e.shelfY+t.lift+n/2*Math.cos(t.lean),z:t.z-n/2*Math.sin(t.lean)+o/2}}function Bn(e,t,n,o){let a=Rt(t,n,o),r=h.size,i=Fn(e,t),l=Fn(e,n),c=V/(V-i.z),f=V/(V-l.z),p=c+(f-c)*o,d=(i.x*c+(l.x*f-i.x*c)*o)/p,u=(i.y*c+(l.y*f-i.y*c)*o)/p;return a.dx=d-e.x,a.lift=u-e.shelfY-r/2*Math.cos(a.lean),a.z=V*(1-1/p)+r/2*Math.sin(a.lean)-h.thick/2,a}var Va=e=>1-(1-e)**3,jt=e=>e*e*(3-2*e),In=Math.PI*2,ea=.1,Oa=450,Kt=e=>le()?e>=0?1:0:Me(A.flip.ease,F(e/R(A.flip.dur))),_n=()=>C(A.fly.at)+R(A.fly.dur)*(1-ea),yo=e=>Math.abs(Math.round(e/Math.PI))%2===1;function Ua(e,t){let n=A.fly,o=A.exit,a=A.flip,r=()=>s.flip.from+(s.flip.to-s.flip.from)*Me(a.ease,F((t-s.flip.t0-C(a.at))/R(a.dur))),i,l;if(s.exit){let c=s.exit,f=t-c.t0,p=f-c.lag,d=Me(o.ease,F((p-C(o.at))/R(o.dur)));if(i=Bn(e,c.from,{...x?w.pose(e):$e(),yaw:c.yawTo},d),i.yaw=c.from.yaw+(c.yawTo-c.from.yaw)*(c.lag?Kt(f):1),s.blur=c.blur*(1-jt(F((p-C(o.blurOut.at))/R(o.blurOut.dur)))),l=p<C(o.at)+R(o.dur)||s.blur>0,s.film=[c.lag?1-Kt(f):0,!1],!l)return Le.detach(),ta(e,t),!0}else{s.backIn===null&&t-s.asked<A.backWait&&t-s.t0>C(n.at)&&(s.t0=t-C(n.at));let c=t-s.t0,f=Me(n.ease,F((c-C(n.at))/R(n.dur)));i=Bn(e,s.from,Ga(e),f),i.yaw=s.turn*Kt(c-_n())+r(),s.blur=x?0:jt(F((c-C(A.blur.at))/R(A.blur.dur)));let p=_n()+R(a.dur),d=m[s.i].entry.video?R(Oa):0,u=Math.max(p+d,...[n,A.blur,A.title].map(v=>C(v.at)+R(v.dur)));l=c<u||t-s.flip.t0<C(a.at)+R(a.dur),s.film=[d?jt(F((c-p)/d)):0,!l&&yo(i.yaw)]}return e.pose=i,l}var Pt=!1;te.addEventListener("webglcontextlost",e=>{e.preventDefault(),!Pt&&(Pt=!0,it&&cancelAnimationFrame(it),s&&To(),So?.close(),import("./fallback.js").then(t=>t.start(B)))});function Wa(e){if(it=0,Pt)return;if(J>=0){Qe=0;return}let t=Qe?Math.min(.05,(e-Qe)/1e3):0;Qe=e;let n=!1,o=zt===null?-1:e-zt,a=Pn,r=x&&w.step(t);Pn=r,r?Ne():a&&x&&(Ne(),Na());let i=s||x?-1:Ce;W!==i&&(s||e-Ct>=C(hn))&&(W>=0&&!(s&&s.i===W)&&(m[W].fall={from:{...m[W].pose},t0:Ct}),W=i,W>=0&&(m[W].fall=null)),za(s?Math.cos(m[s.i].pose.yaw)>0?s.i:-1:W),Ca(e);let l=W!==i;for(let f of m){let p=!1;if(s&&f.i===s.i)p=Ua(f,e);else if(de[f.i]){if(x)r&&(f.pose=w.pose(f),p=!0);else if(W===f.i)p=xn(f,t);else if(f.fall){let d=yn(f.fall.from,e-f.fall.t0);d?f.pose=d:(f.pose=N(),f.fall=null),p=!0}}else if(o>=0){let d=Ha(f.i,o);if(d!==null){let u=x?Ya(f,o-d):vn(f.i,o-d);u?f.pose=u:(f.pose=so(f),de[f.i]=!0)}p=!0}if(p){ge(f),x||xo(f);let d=!x&&f.pose.z<270;(d||f.shaded)&&(Ue=!0),f.shaded=d,(!s||f.i!==s.i)&&(fe=!0),n=!0}}Ue&&(dn(m,be,x),Ht.bake(),Ue=!1,fe=!0),x&&Lt.setOpacity(o<0||Ee[0]===null?0:F((o-Ee[0])/R(600))),Tt&&(nt.mesh.layers.set(s&&s.i===Tt.i?ot:0),nt.place(Tt,qn?0:Tt.pose.opacity));let c=et>=0||e<Kn;if(c&&!window.__editionsTest?.stillCovers)for(let f of Se)f?.update(t);for(let f=Je.length-1;f>=0;f--){let p=Je[f],d=F((performance.now()-p.at)/R(ga));p.s.fade.uFade.value=d*d*(3-2*d),(!s||s.i!==p.s.i)&&(fe=!0),d>=1&&Je.splice(f,1)}if(s){let f=m[s.i],p=A.blur.sigma*s.blur;(fe||p!==Cn)&&(H.layers.set(0),at.background(j,H,p),fe=!1,Cn=p),s.film&&Le.update(...s.film),at.composite(Math.min(1,s.blur*4)),H.layers.set(ot),P.autoClear=!1,P.clearDepth(),P.render(j,H),P.autoClear=!0,H.layers.set(0)}else P.render(j,H);kt.firstFrameAt===null&&(kt.firstFrameAt=performance.now(),qa(kt.firstFrameAt),Ye.resolve(),n=!0),!eo&&!n&&ka(),n||l||c||r||Je.length?L():Qe=0}function Dn(e){if(!CSS.supports("animation-timing-function","linear(0, 1)"))return"cubic-bezier(0.16, 1, 0.3, 1)";let t=24,n=[],o=1-Math.exp(-1/e);for(let a=0;a<=t;a++)n.push(((1-Math.exp(-(a/t)/e))/o).toFixed(4));return`linear(${n.join(", ")})`}function qa(e){At=e,zt=window.__editionsTest?.noSleeves?null:e,te.animate([{opacity:0},{opacity:1}],{duration:R(z.canvasFade.dur),easing:z.canvasFade.ease,fill:"forwards"});let t=z.header,n=R(t.tau*5);document.querySelectorAll(".rise").forEach((a,r)=>a.animate([{opacity:0,transform:`translateY(${-t.rise}px)`},{opacity:1,transform:"none"}],{duration:n,delay:C(t.at+t.stagger*r),easing:Dn(.2),fill:"forwards"}));let o=z.late;document.querySelectorAll(".late").forEach(a=>a.animate([{opacity:0},{opacity:1}],{duration:R(o.tau*5),delay:C(o.at),easing:Dn(.2),fill:"forwards"}))}function lt(){let e=s?-1:Ce;We.forEach((t,n)=>t.classList.toggle("hot",n===e)),te.style.cursor=s?wo()?"pointer":"":Ce>=0?"pointer":""}function Fe(e,t=!1){e!==Ce&&(Ce=e,Ct=performance.now(),lt(),e>=0&&!s&&(t||ae("hover",{pan:Ae(e)}),ae("lift",{pan:Ae(e),intensity:.8})),L())}function wo(){if(!s)return!1;let e=mo(s.i);return ee.x>=e.x&&ee.x<=e.x+e.width&&ee.y>=e.y&&ee.y<=e.y+e.height}var Pe=-1;window.addEventListener("pointermove",e=>{if(e.pointerType==="touch"||x)return;if(ee.x=e.clientX,ee.y=e.clientY,s){lt();return}let t=e.target.closest?.(".pm")?-1:vo(e.clientX,e.clientY);t!==Pe&&(Pe=t,Fe(t))});document.documentElement.addEventListener("pointerleave",()=>{Pe=-1,Fe(-1)});window.addEventListener("blur",()=>{Pe=-1,Fe(-1)});window.addEventListener("resize",ho);te.addEventListener("click",e=>{if(x)return;if(ee.x=e.clientX,ee.y=e.clientY,s){if(s.exit)return;wo()?bo():It();return}let t=vo(e.clientX,e.clientY);t>=0&&Eo(t)});function Ya(e,t){let n=F((t-C(z.appear.at+z.appear.stagger*e.i))/R(360));if(n>=1)return null;let o=w.pose(e);return o.opacity=n,le()||(o.lift+=(1-Va(n))*40/ne),o}var Gn=-1,$n=0;function Ne(e=!1){if(!x)return;let t=m.length,n=w.current,o=B[n],a=qt.parentElement.clientHeight-qt.offsetHeight;qt.style.transform=`translateY(${((1-F(w.p/Math.max(1,t-1)))*a).toFixed(1)}px)`,!(n===Gn&&!e)&&(Gn=n,Pa.textContent=o.year||"",Fa.textContent=o.name,An.dataset.index=String(n),An.setAttribute("aria-label",`Details: ${o.name}`),po(Ba,n),Xn(Ia,n))}function Na(){let e=w.current;e!==$n&&($n=e,ut(`${B[e].name}, ${e+1} of ${m.length}`))}function ja(e,t){let n=Math.round(w.p),o=[];for(let a=0;a<n;a++)o.push(a);for(let a=n;a<m.length;a++)o.push(a);for(let a of o){if(!de[a])continue;let r=mo(a);if(e>=r.x&&e<=r.x+r.width&&t>=r.y&&t<=r.y+r.height)return a}return-1}var ke=null;te.addEventListener("pointerdown",e=>{!x||J>=0||!e.isPrimary||(ke={x:e.clientX,y:e.clientY,id:e.pointerId},te.setPointerCapture(e.pointerId),s||(w.begin(e.clientY,e.timeStamp),L()))});te.addEventListener("pointermove",e=>{!ke||e.pointerId!==ke.id||s||(w.move(e.clientY,e.timeStamp),Ne(),L())});var go=e=>t=>{if(!ke||t.pointerId!==ke.id)return;let{x:n,y:o}=ke;ke=null;let a=Math.hypot(t.clientX-n,t.clientY-o);if(e){w.cancel(),L();return}if(s||w.end(t.timeStamp),L(),a>=8)return;if(ee.x=t.clientX,ee.y=t.clientY,s){if(s.exit)return;wo()?bo():It();return}let r=ja(t.clientX,t.clientY);r<0||(r===w.current&&Math.abs(w.p-r)<.05?Eo(r):(w.go(r),ae("tick")))};te.addEventListener("pointerup",go(!1));te.addEventListener("pointercancel",go(!0));te.addEventListener("lostpointercapture",go(!0));var Vn=0;window.addEventListener("wheel",e=>{!x||s||J>=0||(e.preventDefault(),e.timeStamp-Vn>200&&w.wheel(0),Vn=e.timeStamp,w.wheel(e.deltaY),L())},{passive:!1});je.querySelector(".cb-back").addEventListener("click",()=>It());function Eo(e){if(s||!de[e])return;let t=m[e],n=performance.now();t.fall=null,x&&w.go(e);let o=ct(document.activeElement)===e?document.activeElement:null,a=!x&&t.x>0?-1:1;s={i:e,t0:n,asked:n,backIn:null,from:{...t.pose},dir:a,turn:a*Math.PI,flip:{from:0,to:0,t0:-1e9},exit:null,blur:0,ret:o},t.mesh.layers.set(ot),fe=!0,Ta(e),rt.textContent=t.entry.name,st.textContent=t.entry.tag,po(me,e),Xn(ve,e),me.classList.toggle("paired",!ve.hidden),qe.inert=!1,me.inert=!1,ve.inert=!1,ft.inert=!0,document.body.classList.add("in-details");let r=A;Oe(Bt,0,r.headerOut.at,r.headerOut.dur);for(let i of[rt,st])Oe(i,1,r.title.at,r.title.dur);for(let i of[me,ve])Oe(i,1,r.open.at,r.open.dur);Le.attach(t),qe.focus({preventScroll:!0}),ae("details",{pan:Ae(e)}),ut(t.entry.tag?`Details: ${t.entry.name}. ${t.entry.tag}`:`Details: ${t.entry.name}`),lt(),L()}function bo(){if(!s||s.exit)return;let e=performance.now(),t=A.flip,n=s.flip,o=n.from+(n.to-n.from)*Me(t.ease,F((e-n.t0-C(t.at))/R(t.dur)));s.flip={from:o,to:n.to+s.dir*Math.PI,t0:e},ae("flip"),ut(yo(s.turn+s.flip.to)?"Back of the sleeve":"Front of the sleeve"),L()}function It(){if(!s||s.exit)return;let e=m[s.i],t=performance.now(),n=A.exit,o=e.pose.yaw/In,a=In*(s.dir>0?Math.ceil(o-.5-1e-6):Math.floor(o+.5+1e-6)),r=Math.abs(a-e.pose.yaw)<.001?0:R(A.flip.dur)*(1-ea);s.exit={t0:t,from:{...e.pose},yawTo:a,lag:r,blur:s.blur};for(let i of[rt,st,me,ve])Oe(i,0,n.at,n.textOut);Le.unzoom(!0),Oe(Bt,1,n.headerIn.at,n.headerIn.dur),qe.inert=!0,me.inert=!0,ve.inert=!0,ae("close",{pan:Ae(s.i)}),ut("Back to the shelf"),L()}function ta(e,t,n=!1){let{i:o}=s,a=n?null:s.ret;if(s=null,Aa(e),e.pose=x?w.pose(e):$e(),ge(e),e.mesh.layers.set(0),fe=Ue=!0,ft.inert=!1,document.body.classList.remove("in-details"),x){a&&a.isConnected&&a.focus({preventScroll:!0}),Ne(!0),lt();return}Pe=n?-1:vo(ee.x,ee.y),Ce=Pe,Ct=t,a&&a.isConnected&&a.focus({preventScroll:!0}),W=Ce===o?o:-1,W!==o&&(e.fall={from:$e(),t0:t}),xo(e),lt()}var So=null,On=null,J=-1,Ft=!1,io=!1,Mo=()=>On||(On=import("./project-EFHC4NCV.js").then(e=>So=e.createProjectView({renderer:P,entries:B,slugOf:ie,onBack:Za})));function Ka(e){ae("open",{pan:s?0:Ae(e)}),Mo(),B[e].kind!=="about"&&import("./project-EFHC4NCV.js").then(t=>t.loadDossier(ie(B[e]))),Ft=!0,io=!0,ut(`Open: ${B[e].name}`),location.hash=ie(B[e])}async function Ro(){if(Pt)return;let e=decodeURIComponent(location.hash.slice(1)),t=B.findIndex(n=>ie(n)===e);if(t>=0){if(t===J)return;let n=await Mo();if(B.findIndex(o=>ie(o)===decodeURIComponent(location.hash.slice(1)))!==t||t===J)return;s&&To(!0),Fe(-1),J=t;for(let o of te.getAnimations())o.finish();ue?.setRoomTone(!1),io||ae("open"),io=!1,await n.open(t)}else if(J>=0){let n=J;if(J=-1,So?.close(),ue?.setRoomTone(!0),ae("close",{pan:Ae(n)}),ho(),x){w.jump(n);for(let o of m)de[o.i]&&(o.pose=w.pose(o),ge(o));Ne(!0)}Ue=fe=!0,We[n].querySelector('[data-action="open"]').focus({preventScroll:!0}),L()}}function Za(){Ft?(Ft=!1,history.back()):(history.pushState(null,"",location.pathname+location.search),Ro())}window.addEventListener("hashchange",()=>{location.hash||(Ft=!1),Ro()});function To(e=!1){let t=m[s.i];for(let n of[rt,st,me,ve])for(let o of n.getAnimations())o.cancel();Le.detach(),Oe(Bt,1,0,1),qe.inert=!0,me.inert=!0,ve.inert=!0,ta(t,performance.now(),e),t.fall=null,W=-1}document.addEventListener("click",e=>{let t=e.target.closest("[data-action][data-index]");if(!t)return;let n=+t.dataset.index;if(t.dataset.action==="details"){Eo(n);return}t.dataset.action==="open"&&B[n].url||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||(e.preventDefault(),Ka(n))});var ct=e=>e&&e.closest&&e.closest(".slot")?We.indexOf(e.closest(".slot")):-1;ft.addEventListener("focusin",e=>{let t=ct(e.target);if(!(t<0)){if(x){s||(w.go(t),L());return}Fe(t,!0)}});ft.addEventListener("focusout",e=>{ct(e.relatedTarget)>=0||s||Fe(Pe)});window.addEventListener("keydown",e=>{if(e.metaKey||e.ctrlKey||e.altKey||J>=0||document.querySelector("dialog.ct[open]"))return;if(s){if(Le.zoomed){e.key==="Escape"&&(e.preventDefault(),Le.unzoom());return}e.key==="Escape"?(e.preventDefault(),It()):(e.key===" "||e.code==="Space")&&(e.preventDefault(),e.repeat||bo());return}if(x){let r={ArrowLeft:-1,ArrowUp:-1,ArrowRight:1,ArrowDown:1}[e.key];if(r===void 0)return;e.preventDefault();let i=Math.max(0,Math.min(m.length-1,w.current+r));if(i===w.current)return;w.go(i),ct(document.activeElement)>=0&&We[i].querySelector(`[data-action="${document.activeElement.dataset.action}"]`).focus({preventScroll:!0}),ae("tick"),L();return}let t={ArrowLeft:-1,ArrowRight:1,ArrowUp:-h.cols,ArrowDown:h.cols}[e.key];if(t===void 0)return;e.preventDefault();let n=ct(document.activeElement),o=n<0?0:Math.max(0,Math.min(m.length-1,n+t));if(o===n)return;let a=document.activeElement?.dataset?.action==="open"?"open":"details";We[o].querySelector(`[data-action="${a}"]`).focus({preventScroll:!0}),ae("tick",{pan:Ae(o)})});window.addEventListener("keyup",e=>{s&&(e.key===" "||e.code==="Space")&&e.preventDefault()});var ko=window.matchMedia("(prefers-reduced-motion: reduce)");gt(ko.matches);w.setReduced(ko.matches);ko.addEventListener?.("change",e=>{gt(e.matches),w.setReduced(e.matches)});var kt={count:m.length,firstFrameAt:null,ready:Ye.ready,covers:Ma,sleeveRect:mo,frontCorners(e){let t=m[e].mesh.matrixWorld,n=h.size;return[[-n/2,0],[n/2,0],[n/2,n],[-n/2,n]].map(([o,a])=>(Q.set(o,a,h.thick).applyMatrix4(t),ze(Q.x,Q.y,Q.z)))},setCover(e,t,n){Gt(m[e],t,n),L()},get project(){return J>=0?ie(B[J]):null},get sleevesAt(){return zt},coverReadyAt:Yn,appearAt:Ee,get crate(){return x?{p:w.p,current:w.current,dragging:w.dragging}:null},set stickerOff(e){qn=!!e,L()},get details(){return s?{index:s.i,flipped:yo(s.turn+s.flip.to),closing:!!s.exit,blur:s.blur,yaw:m[s.i].pose.yaw,backIn:s.backIn===null?null:Math.round(s.backIn-s.asked)}:null}};window.__editions=kt;ho();for(let e of m)e.mesh.visible=!0;nt.mesh.visible=!0;for(let e of[!0,!1]){for(let t of m)for(let n of[t.front,t.back,t.mats[0]])n.transparent=e,n.needsUpdate=!0;for(let t of[0,ot])H.layers.set(t),P.render(j,H);H.layers.enableAll(),P.render(j,H),H.layers.set(0),at.background(j,H,1),at.composite(.5)}for(let e of m)ge(e);nt.mesh.visible=!1;fe=!0;Ye.ready.then(()=>{location.hash&&Ro()});export{Br as drawn};
