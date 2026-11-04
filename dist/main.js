import{A as vt,B as se,C as yt,D as Io,E as ye,F as gt,G as Bo,H as Do,I as _o,J as Go,K as $o,L as oe,M as de,N as Vo,O as Oo,P as Uo,R as Wo,S as qo,T as Yo,a as ko,b as Ho,d as Be,g as ht,h as Lo,j as re,k as Ao,l as mt,m as ue,n as zo,o as U,q as Z,r as De,s as Co,t as ve,u as Po,v as xt,w as Fo,z as k}from"./chunk-QESZHFER.js";import{a as F,b as wt,c as pe,d as R,e as z,f as Me}from"./chunk-TH7WALPN.js";import{a as Dt,b as No,c as ie,e as h,f as _,g as jo,h as L,i as A}from"./chunk-GBXN2TGX.js";var Et=class extends ye{constructor(){super();let t=new vt;t.deleteAttribute("uv");let a=new de({side:ko}),o=new de,n=new Uo(16777215,900,28,2);n.position.set(.418,16.199,.3),this.add(n);let r=new k(t,a);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let i=new Bo(t,o,6),l=new Po;l.position.set(-10.906,2.009,1.846),l.rotation.set(0,-.195,0),l.scale.set(2.328,7.905,4.651),l.updateMatrix(),i.setMatrixAt(0,l.matrix),l.position.set(-5.607,-.754,-.758),l.rotation.set(0,.994,0),l.scale.set(1.97,1.534,3.955),l.updateMatrix(),i.setMatrixAt(1,l.matrix),l.position.set(6.167,.857,7.803),l.rotation.set(0,.561,0),l.scale.set(3.927,6.285,3.687),l.updateMatrix(),i.setMatrixAt(2,l.matrix),l.position.set(-2.017,.018,6.124),l.rotation.set(0,.333,0),l.scale.set(2.002,4.566,2.064),l.updateMatrix(),i.setMatrixAt(3,l.matrix),l.position.set(2.291,-.756,-2.621),l.rotation.set(0,-.286,0),l.scale.set(1.546,1.552,1.496),l.updateMatrix(),i.setMatrixAt(4,l.matrix),l.position.set(-2.193,-.369,-5.547),l.rotation.set(0,.516,0),l.scale.set(3.875,3.487,2.986),l.updateMatrix(),i.setMatrixAt(5,l.matrix),this.add(i);let c=new k(t,_e(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);let f=new k(t,_e(50));f.position.set(-16.109,18.021,-8.207),f.scale.set(.1,2.425,2.751),this.add(f);let p=new k(t,_e(17));p.position.set(14.904,12.198,-1.832),p.scale.set(.15,4.265,6.331),this.add(p);let d=new k(t,_e(43));d.position.set(-.462,8.89,14.52),d.scale.set(4.38,5.441,.088),this.add(d);let u=new k(t,_e(20));u.position.set(3.235,11.486,-12.541),u.scale.set(2.5,2,.1),this.add(u);let x=new k(t,_e(100));x.position.set(0,20,0),x.scale.set(1,.1,1),this.add(x)}dispose(){let t=new Set;this.traverse(a=>{a.isMesh&&(t.add(a.geometry),t.add(a.material))});for(let a of t)a.dispose()}};function _e(e){return new Vo({color:0,emissive:16777215,emissiveIntensity:e})}var on=h.hoverLift.toFixed(2),le=h.cols,Ko=(h.pitch/2).toFixed(2),an={key:{rect:[1148.801,12.997,8768.289,3472.806],z:994.831,power:2.322},fill:{rect:[-2516.226,-9815.124,2516.226,10070.146],z:573.364,power:1.474},shelfAlbedo:1.219,shelfAmbient:.383,contact:{strength:.332,reach:19.033},keyMix:.571,base:{centre:.614,edge:.752,cy:-293.494,rx:806.633,ry:309.574,pow:.304},edgeShade:{strength:.989,reach:5.54},liftShade:{strength:.5,reach:8},halo:{right:.4,left:.383,top:.056,rise:.308,fall:60.395,row2:.724,vfall:10,drop:.881,dropReach:31.417},glow:{strength:.2,fall:100,side:60,fade:24.653,width:1100}},Ge=4*le;function Zo(){return{uLightRect:{value:[new Z,new Z]},uLightZ:{value:[0,0]},uLightPower:{value:[0,0]},uShelf:{value:[new Z,new Z]},uShelfDepth:{value:0},uSlab:{value:Array.from({length:Ge},()=>new Z(0,0,0,0))},uSlabZ:{value:new Array(Ge).fill(1)},uSlabA:{value:new Array(Ge).fill(0)},uFoot:{value:Array.from({length:2*le},()=>new Z(0,0,0,1e3))},uShelfAlbedo:{value:1},uShelfAmbient:{value:0},uContact:{value:new ue},uHalo:{value:new U},uHaloShape:{value:new Z},uHaloDrop:{value:new ue},uGlow:{value:new Z},uGlowWidth:{value:1e4},uEdgeShade:{value:new Z},uKeyMix:{value:.5},uBase:{value:new U},uBaseShape:{value:new U}}}function Xo(e,t=an){[t.key,t.fill].forEach((a,o)=>{e.uLightRect.value[o].set(...a.rect),e.uLightZ.value[o]=a.z,e.uLightPower.value[o]=a.power}),e.uShelfAlbedo.value=t.shelfAlbedo,e.uShelfAmbient.value=t.shelfAmbient,e.uContact.value.set(t.contact.strength,t.contact.reach),e.uHalo.value.set(t.halo.right,t.halo.left,t.halo.top),e.uHaloShape.value.set(t.halo.rise,t.halo.fall,t.halo.row2,t.halo.vfall),e.uHaloDrop.value.set(t.halo.drop,t.halo.dropReach),e.uGlow.value.set(t.glow.strength,t.glow.fall,t.glow.side,t.glow.fade),e.uGlowWidth.value=t.glow.width,e.uEdgeShade.value.set(t.edgeShade.strength,t.edgeShade.reach,t.liftShade.strength,t.liftShade.reach),e.uKeyMix.value=t.keyMix,e.uBase.value.set(t.base.centre,t.base.edge,t.base.cy),e.uBaseShape.value.set(t.base.rx,t.base.ry,t.base.pow)}var bt=`
#define PI 3.141592653589793
uniform vec4 uLightRect[2];
uniform float uLightZ[2];
uniform float uLightPower[2];
uniform vec4 uShelf[2];      // x0, x1, y bottom, y top
uniform float uShelfDepth;
uniform vec4 uSlab[${Ge}];  // x0, y0, x1, y1 of a slab parallel to the wall
uniform float uSlabZ[${Ge}];
uniform float uSlabA[${Ge}];  // occlusion strength: the sleeve's opacity
uniform vec4 uFoot[${2*le}];      // per sleeve: x0, x1, bottom edge depth, height of the bottom edge above its shelf

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
    for (int k = 0; k < ${2*le}; k++) {
      int i = row * ${2*le} + k;
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
  for (int k = 0; k < ${le}; k++) {
    int i = row * ${2*le} + k * 2;
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
    float wx = smoothstep(-uGlow.z, uGlow.z, cx + ${Ko}) - smoothstep(-uGlow.z, uGlow.z, cx - ${Ko});
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
  for (int k = 0; k < ${le}; k++) {
    int i = row * ${2*le} + k * 2;
    vec4 a = uSlab[i], b = uSlab[i + 1];
    if (a.z <= a.x) continue;
    float dx = min(a.x, b.x) - p.x;
    // It fades toward the top edge with the light beside the sleeve (uHaloDrop), where the sleeve meets the wall.
    if (dx > 0.0 && p.y >= a.y && p.y <= b.w)
      f *= 1.0 - uSlabA[i] * uEdgeShade.x * exp(-dx / uEdgeShade.y) * (1.0 - uHaloDrop.x * (1.0 - smoothstep(0.0, uHaloDrop.y, b.w - p.y)));
    // Under a lifted sleeve: a band from its bottom edge, offset a little to the left.
    float lift = clamp(uFoot[row * ${le} + k].w / ${on}, 0.0, 1.0);
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
`;var nn=`
out vec2 vWorld;
uniform vec4 uRegion; // world x0, y0, x1, y1 covered by the texture
void main() {
  vWorld = mix(uRegion.xy, uRegion.zw, uv);
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`,rn=`
precision highp float;
in vec2 vWorld;
out vec4 outColor;
${bt}
void main() {
  int row = rowAt(vWorld.y);
  float seen = mix(wallLight(1, vWorld, row), wallLight(0, vWorld, row), uKeyMix);
  float e = wallBase(vWorld) * seen * edgeShade(vWorld, row) + haloAt(vWorld, row);
  outColor = vec4(vec3(e), 1.0);
}`,sn=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,ln=`
uniform sampler2D uBake;
uniform float uGain;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(uBake, vUv).rgb * uGain;
  gl_FragColor = vec4(c, 1.0);
  #include <colorspace_fragment>
  float n = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  gl_FragColor.rgb += (n - 0.5) / 255.0;
}`;function Qo(e,t){let a=new De(4,4,{type:ht,format:Lo,depthBuffer:!1,minFilter:Be,magFilter:Be,generateMipmaps:!1}),o=new se({glslVersion:Ao,uniforms:{...t,uRegion:{value:new Z}},vertexShader:nn,fragmentShader:rn,depthTest:!1,depthWrite:!1}),n=new ye;n.add(new k(new oe(2,2),o));let r=new yt,i=new se({uniforms:{uBake:{value:a.texture},uGain:{value:1}},vertexShader:sn,fragmentShader:ln,toneMapped:!1}),l=new k(new oe(1,1),i);return l.renderOrder=-1,{mesh:l,resize(c,f,p,d,u,x,T=null){a.setSize(u,x),o.uniforms.uRegion.value.set(...T||[c,f,p,d]),l.scale.set(p-c,d-f,1),l.position.set((c+p)/2,(f+d)/2,0),l.updateMatrixWorld()},setGain(c){i.uniforms.uGain.value=c},bake(){let c=e.getRenderTarget();e.setRenderTarget(a),e.render(n,r),e.setRenderTarget(c)},dispose(){a.dispose(),o.dispose(),i.dispose(),l.geometry.dispose()}}}function cn(){let{width:e,depth:t,thick:a,bevel:o}=_,n=new Go;n.moveTo(0,-a),n.lineTo(t-o,-a),n.absarc(t-o,-a+o,o,-Math.PI/2,0,!1),n.lineTo(t,-o),n.absarc(t-o,-o,o,0,Math.PI/2,!1),n.lineTo(0,0),n.closePath();let r=new $o(n,{depth:e,bevelEnabled:!1,curveSegments:6});return r.applyMatrix4(new ve().set(0,0,-1,e/2,0,1,0,0,1,0,0,0,0,0,0,1)),r.computeVertexNormals(),r}var fn=`
varying vec3 vPos;
varying vec3 vNormal;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vPos = w.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,un=`
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
}`;function Jo(e){let t=cn();return _.tops.map((a,o)=>{let n=new se({uniforms:{...e,uRow:{value:o}},vertexShader:fn,fragmentShader:un,toneMapped:!1}),r=new k(t,n);return r.position.set(0,a,0),r.updateMatrixWorld(),r})}var ea=`
vec3 njNeutral(vec3 c) {
  const float start = 0.76, desat = 0.15;
  float x = min(c.r, min(c.g, c.b));
  c -= x < 0.08 ? x - 6.25 * x * x : 0.04;
  float peak = max(c.r, max(c.g, c.b));
  if (peak < start) return c;
  float d = 1.0 - start, np = 1.0 - d * d / (peak + d - start);
  c *= np / peak;
  return mix(c, vec3(np), 1.0 - 1.0 / (desat * (peak - np) + 1.0));
}`;var X=h.size,St=X*Math.sin(h.lean),sa={dx:0,yaw:0,opacity:1},N=()=>({...sa,lift:0,z:St,lean:h.lean}),$e=()=>({...sa,lift:h.hoverLift,z:h.hoverZ,lean:0}),_t=["lift","z","lean","dx","yaw"],dn="#d9d6d0";function Ze(e,t=null,a=null){return e.onBeforeCompile=o=>{if(o.fragmentShader=o.fragmentShader.replace("void main() {",`${ea}
${t?`uniform float uMapBias;
`:""}${a?`uniform sampler2D uThumb;
uniform float uFade;
`:""}void main() {`).replace("#include <tonemapping_fragment>","gl_FragColor.rgb = njNeutral(gl_FragColor.rgb);"),t){o.uniforms.uMapBias=t;let n=a?"mix( texture2D( uThumb, vMapUv, uMapBias ), texture2D( map, vMapUv, uMapBias ), uFade )":"texture2D( map, vMapUv, uMapBias )";a&&Object.assign(o.uniforms,a),o.fragmentShader=o.fragmentShader.replace("#include <map_fragment>",Wo.map_fragment.replace("texture2D( map, vMapUv )",n))}},e.customProgramCacheKey=()=>t?a?"nj-neutral-bias-fade":"nj-neutral-bias":"nj-neutral",e}var ia=new gt(new Uint8Array([255,255,255,255]),1,1);ia.needsUpdate=!0;var Xe={value:0};function la(e){let t=new vt(X,X,h.thick);return t.translate(0,X/2,h.thick/2),e.map((a,o)=>{let n=Ze(new de({color:15855594,roughness:.8})),r=o%h.cols,i=Math.floor(o/h.cols),l=Math.min(h.cols,e.length-i*h.cols),c={uThumb:{value:ia},uFade:{value:1}},f=Ze(new de({color:new xt(a.accent?.light||dn),roughness:.8}),Xe,c),p=Ze(new de({color:15328992,roughness:.7})),d=[n,n,n,n,f,p],u=new k(t,d);u.matrixAutoUpdate=!1;let x={i:o,row:i,col:r,mesh:u,front:f,back:p,mats:d,entry:a,fade:c,thumb:null,hasCover:!1,x:(r-(l-1)/2)*h.pitch,shelfY:_.tops[i],pose:{...N(),opacity:0}};return we(x),x})}var ta=new zo,pn=new U(1,0,0),oa=new U,hn=new U(1,1,1),Re=new U,aa=new ve,na=new ve,ra=new ve;function we(e){let t=e.pose;oa.set(e.x+t.dx,e.shelfY+t.lift,t.z),ta.setFromAxisAngle(pn,-t.lean),e.mesh.matrix.compose(oa,ta,hn),t.yaw&&(Re.set(0,X/2,h.thick/2).applyMatrix4(e.mesh.matrix),na.makeTranslation(Re.x,Re.y,Re.z),ra.makeTranslation(-Re.x,-Re.y,-Re.z),aa.makeRotationY(t.yaw),e.mesh.matrix.premultiply(ra).premultiply(aa).premultiply(na)),e.mesh.matrixWorld.copy(e.mesh.matrix),e.mesh.visible=t.opacity>.001;let a=t.opacity<.999;for(let o of[e.front,e.back,e.mats[0]])o.transparent!==a&&(o.transparent=a,o.needsUpdate=!0),o.opacity=t.opacity}function ca(e,t,a=!1){for(let o of e){let n=o.pose,r=Math.cos(n.lean),i=Math.sin(n.lean),l=o.shelfY+n.lift,c=h.thick/2,f=o.x+n.dx,p=mt.smoothstep(n.z,110,260),d=o.mesh.visible&&!a?n.opacity*(1-p):0,u=(o.row*h.cols+o.col)*2;for(let x=0;x<2;x++){let T=x/2,O=(x+1)/2;d>0?t.uSlab.value[u+x].set(f-X/2,l+X*T*r,f+X/2,l+X*O*r):t.uSlab.value[u+x].set(0,0,0,0),t.uSlabZ.value[u+x]=Math.max(1.5,n.z-X*(T+O)/2*i+c),t.uSlabA.value[u+x]=d}t.uFoot.value[o.i].set(f-X/2,f+X/2,n.z+h.thick,d>0?n.lift:1e3)}}function fa(e,t){e.thumb=t,!e.hasCover&&(e.front.map=t,e.front.color.set(16777215),e.front.needsUpdate=!0)}function Gt(e,t,a){let o=!1;return t&&(o=!e.hasCover&&!!e.thumb&&e.front.map===e.thumb,o&&(e.fade.uThumb.value=e.thumb,e.fade.uFade.value=0),e.hasCover=!0,e.front.map=t,e.front.color.set(16777215),e.front.needsUpdate=!0),a&&(e.back.map=a,e.back.color.set(16777215),e.back.needsUpdate=!0),o}var ua=15,Mt=e=>e*e,Rt=(e,t,a)=>{let o={...t};for(let n of _t)o[n]=e[n]+(t[n]-e[n])*a;return o.opacity=e.opacity+(t.opacity-e.opacity)*a,o};function da(e){let t=A.appear.at+A.appear.stagger*e,a=A.drop.at+A.drop.stagger*e,o=a+A.drop.dur,n=o+A.lean.delay;return{appear:t,drop:a,land:o,lean:n,rest:n+A.lean.dur}}var $t=e=>pe()?200+40*e:da(e).appear;function pa(e,t){if(pe()){let l=$t(e);return t>=l+160?null:{...N(),opacity:F((t-l)/160)}}let a=da(e);if(t>=a.rest)return null;if(t<a.appear)return{...N(),opacity:0};let o=A.appearPose,n=1-.345*Math.exp(-(t-a.appear)/150),r={...N(),lift:o.lift,z:o.z,lean:0,opacity:n};if(t<a.drop)return r;if(t<a.land){let l=Mt(F((t-a.drop)/A.drop.dur));return{...r,lift:o.lift*(1-l),z:o.z+(St-o.z)*l}}let i=Mt(F((t-a.lean)/A.lean.dur));return{...r,lift:0,z:St,lean:h.lean*i}}function ha(e,t){let a=$e(),o=1-Math.exp(-t/(pe()?.04:h.hoverTau)),n=!1;for(let r of _t){let i=a[r]-e.pose[r];Math.abs(i)>.001?(e.pose[r]+=i*o,n=!0):e.pose[r]=a[r]}return e.pose.opacity=1,n}function ma(e,t){let a=pe()?{delay:0,drop:90,pause:0,lean:60}:jo,o=N();if(t<a.delay)return{...e};let n=t-a.delay,r={...o,lean:Math.min(e.lean,o.lean)};if(n<a.drop)return Rt(e,r,Mt(n/a.drop));let i=n-a.drop-a.pause;return i<0?r:i<a.lean?Rt(r,o,Mt(i/a.lean)):null}var xa=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,mn=`
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
}`,xn=`
uniform sampler2D uSharp;
uniform sampler2D uBlur;
uniform float uMix;
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(mix(texture2D(uSharp, vUv).rgb, texture2D(uBlur, vUv).rgb, uMix), 1.0);
  #include <colorspace_fragment>
}`;function va(e){let t=new De(4,4,{samples:4,colorSpace:re}),a={type:ht,depthBuffer:!1,minFilter:Be,magFilter:Be},o=new De(4,4,a),n=new De(4,4,a),r=new se({uniforms:{uTex:{value:null},uDir:{value:new ue},uSigma:{value:0}},vertexShader:xa,fragmentShader:mn,depthTest:!1,depthWrite:!1}),i=new se({uniforms:{uSharp:{value:t.texture},uBlur:{value:o.texture},uMix:{value:0}},vertexShader:xa,fragmentShader:xn,depthTest:!1,depthWrite:!1}),l=new k(new oe(2,2),r);l.frustumCulled=!1;let c=new ye;c.add(l);let f=new yt,p=.5,d=(u,x)=>{l.material=u,e.setRenderTarget(x),e.render(c,f)};return{resize(u,x){t.setSize(u,x),o.setSize(Math.ceil(u/2),Math.ceil(x/2)),n.setSize(Math.ceil(u/2),Math.ceil(x/2)),p=e.getPixelRatio()/2},background(u,x,T){let O=e.getRenderTarget();e.setRenderTarget(t),e.clear(),e.render(u,x);let B=T*p;r.uniforms.uSigma.value=B,r.uniforms.uTex.value=t.texture,r.uniforms.uDir.value.set(1/o.width,0),d(r,n),r.uniforms.uTex.value=n.texture,r.uniforms.uDir.value.set(0,1/o.height),d(r,o),e.setRenderTarget(O)},composite(u){i.uniforms.uMix.value=u,d(i,null)},dispose(){t.dispose(),o.dispose(),n.dispose(),r.dispose(),i.dispose()}}}var Ot=h.size,ya=.255*Ot,Vt={x:.3245*Ot,y:.8255*Ot,z:h.thick+.25};function vn(e){let a=document.createElement("canvas");a.width=a.height=512;let o=a.getContext("2d"),n=512/2,r=512*.44,i=11;o.beginPath();for(let d=0;d<=720;d++){let u=d/720*Math.PI*2,x=r*(1+.065*Math.cos(i*u));o.lineTo(n+x*Math.cos(u),n+x*Math.sin(u))}o.closePath(),o.save(),o.clip();let l=o.createConicGradient?o.createConicGradient(.6,n,n):o.createLinearGradient(0,0,512,512);["#ffa6e6","#9af2dc","#c4b2ff","#ffe596","#9fd6ff","#ffb8dc","#ffa6e6"].forEach((d,u,x)=>l.addColorStop(u/(x.length-1),d)),o.fillStyle=l,o.fillRect(0,0,512,512),[[.3,.3,"#9af2dc"],[.7,.62,"#ffa6e6"],[.42,.72,"#ffe596"],[.68,.28,"#c4b2ff"],[.25,.58,"#ffb8dc"]].forEach(([d,u,x])=>{let T=o.createRadialGradient(d*512,u*512,0,d*512,u*512,102.4);T.addColorStop(0,x+"cc"),T.addColorStop(1,x+"00"),o.fillStyle=T,o.fillRect(0,0,512,512)});let c=o.createRadialGradient(n*.8,n*.7,0,n*.8,n*.7,512*.55);c.addColorStop(0,"rgba(255,255,255,0.75)"),c.addColorStop(1,"rgba(255,255,255,0)"),o.fillStyle=c,o.fillRect(0,0,512,512),o.restore(),o.translate(n,n),o.rotate(12*Math.PI/180),o.fillStyle="#000",o.textAlign="center",o.textBaseline="alphabetic",o.font=`800 ${512*.15}px 'NJ Text', system-ui, sans-serif`;let f=512*.15;e.forEach((d,u)=>o.fillText(d,0,(u-(e.length-1)/2)*f+512*.055));let p=new _o(a);return p.colorSpace=re,p.anisotropy=4,p}var ga=new xt().setRGB(1,.96,1);function wa(e){let t=vn(e.toUpperCase().split(" ")),a=Ze(new de({map:t,emissiveMap:t,color:ga,emissive:ga,emissiveIntensity:.5,transparent:!0,roughness:.8,metalness:0,depthWrite:!1}),Xe),o=new k(new oe(ya,ya),a);o.matrixAutoUpdate=!1,o.visible=!1,o.renderOrder=1;let n=new ve().makeTranslation(Vt.x,Vt.y,Vt.z);return{mesh:o,place(r,i){o.visible=i>.002&&r.mesh.visible,o.visible&&(a.opacity=i,o.matrix.multiplyMatrices(r.mesh.matrix,n),o.matrixWorld.copy(o.matrix))}}}var w={width:.682,bottom:.797,lean:56*Math.PI/180,strip:.124,top:132,flatLean:78*Math.PI/180,flatStrip:.07,flatMax:4,drag:150,carry:.06,omega:8.5,details:{size:.815,centreY:.404},wheelNotch:60,groundGain:.838,edgeColour:1842204,shadow:{y0:.403,y1:.794,alpha:.054,feather:20}};function Ea(){let e=new se({uniforms:{uSize:{value:new ue(1,1)},uFeather:{value:1},uAlpha:{value:w.shadow.alpha}},vertexShader:"varying vec2 vP; uniform vec2 uSize; void main() { vP = uv * uSize; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`varying vec2 vP; uniform vec2 uSize; uniform float uFeather, uAlpha;
      void main() { float d = min(vP.y, uSize.y - vP.y);   // soft top and bottom; it runs off the left edge and under the crate
        gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha * smoothstep(0.0, uFeather, d)); }`,transparent:!0,depthWrite:!1,toneMapped:!1}),t=new k(new oe(1,1),e);return t.renderOrder=-.5,t.visible=!1,{mesh:t,setOpacity(a){e.uniforms.uAlpha.value=w.shadow.alpha*a},layout(a,o,n){let r=-a/2/n-2,i=0,l=(o/2-w.shadow.y1*o)/n,c=(o/2-w.shadow.y0*o)/n;t.scale.set(i-r,c-l,1),t.position.set((r+i)/2,(l+c)/2,.5),t.updateMatrixWorld(),e.uniforms.uSize.value.set(i-r,c-l),e.uniforms.uFeather.value=w.shadow.feather/n}}}function ba(e){let t=h.size,a=0,o=0,n=0,r=null,i=0,l=!1,c=0,f=0,p=0,d=0,u=0,x=1,T=y=>Math.max(0,Math.min(e-1,y));function O(y,E,b){let D=w.width*y/t;c=(E/2-w.bottom*E)/D;let K=w.bottom*E-t*D*Math.cos(w.lean);return f=Math.min(w.strip*t,e>1?Math.max(0,K-w.top)/(e-1)/D:0),p=f*Math.tan(w.lean)+4,d=w.flatStrip*t,u=(e-1)*p+t*Math.sin(w.lean)+10,x=D*(b-u)/b,x}let B=y=>d*w.flatMax*(1-Math.exp(-y/w.flatMax));function q(y){let E=y.i-a,b=N();if(b.dx=-y.x,E>=0)b.lean=w.lean,b.lift=c+E*f-y.shelfY,b.z=u-E*p;else{let D=-E,K=Math.min(1,D);b.lean=w.lean+(w.flatLean-w.lean)*K,b.lift=c-B(D)-y.shelfY,b.z=u+.8*t*K+5*Math.max(0,B(D)-B(1))}return b}function Ie(y){if(r)return!0;let E=l?30:w.omega,b=E*E*(n-a)-2*E*o;return o+=b*y,a+=o*y,Math.abs(n-a)<.001&&Math.abs(o)<.01?(a=n,o=0,!1):!0}return{layout:O,pose:q,step:Ie,get p(){return a},get current(){return T(Math.round(r?a:n))},get dragging(){return!!r},setReduced(y){l=!!y},go(y){n=T(y)},jump(y){n=a=T(y),o=0},begin(y,E){r={y0:y,p0:a,samples:[[E,y]]},o=0},move(y,E){if(!r)return;let b=r.p0+(y-r.y0)/w.drag;for(b<0?b/=3:b>e-1&&(b=e-1+(b-e+1)/3),a=b,r.samples.push([E,y]);r.samples.length>2&&E-r.samples[0][0]>100;)r.samples.shift()},end(y){if(!r)return 0;let E=r.samples,b=E[0],D=E[E.length-1],K=Math.abs(D[1]-r.y0),dt=D[0]-b[0]>8&&y-D[0]<80?(D[1]-b[1])/(D[0]-b[0])*1e3:0;return r=null,o=Math.max(-12,Math.min(12,dt/w.drag)),n=T(Math.round(a+(l?0:o*w.carry))),l&&(o=0),K},cancel(){r&&(r=null,n=T(Math.round(a)))},wheel(y){for(i+=y;Math.abs(i)>=w.wheelNotch;){let E=Math.sign(i);n=T(n+E),i-=E*w.wheelNotch}}}}var Ut=16/9,yn=500;function Sa({camera:e,layer:t,wake:a,dur:o,els:n}){let{frame:r,video:i,play:l,close:c,shade:f}=n,p=new Do(i);p.colorSpace=re;let d=new Fo({map:p,transparent:!0,opacity:0,toneMapped:!1,depthWrite:!1}),u=new k(new oe(1,1),d);u.rotation.y=Math.PI,u.layers.set(t),u.visible=!1;let x=h.size,T=new U,O=!1,B=!1,q=null,Ie=!1,y=0;for(let S of["loadeddata","seeked"])i.addEventListener(S,()=>{p.needsUpdate=!0,a()});let E=()=>{clearTimeout(y),O&&!Ie&&(Ie=!0,i.play().then(a,()=>{}))},b=(S,M)=>(T.set(S,M,0),u.localToWorld(T),T.project(e),[(T.x+1)/2*innerWidth,(1-T.y)/2*innerHeight]),D=()=>{let[S,M]=b(-.5,.5),[Y,Ke]=b(.5,-.5);return{left:Math.min(S,Y),top:Math.min(M,Ke),width:Math.abs(Y-S),height:Math.abs(Ke-M)}},K=S=>({left:`${S.left}px`,top:`${S.top}px`,width:`${S.width}px`,height:`${S.height}px`}),dt=()=>{let S=Math.min(innerWidth*.92,innerHeight*.86*Ut),M=S/Ut;return{left:(innerWidth-S)/2,top:(innerHeight-M)/2,width:S,height:M}},To=(S,M,Y)=>(Object.assign(r.style,K(M)),r.animate([K(S),K(M)],{duration:o(Y),easing:"cubic-bezier(0.3, 0, 0.15, 1)"}).finished.catch(()=>{}));function tn(){!O||B||!q||(B=!0,l.hidden=!0,r.classList.add("on"),f.classList.add("on"),c.hidden=!1,i.muted=!1,E(),To(q,dt(),560).then(()=>{B&&(i.controls=!0,c.focus({preventScroll:!0}))}))}function pt(S=!1){if(!B)return;B=!1,i.controls=!1,i.muted=!0,f.classList.remove("on"),c.hidden=!0;let M=()=>{B||(r.classList.remove("on"),O&&(l.hidden=!1))};if(S||!q){for(let Y of r.getAnimations())Y.cancel();M();return}To(r.getBoundingClientRect(),q,420).then(M)}return l.addEventListener("click",tn),c.addEventListener("click",()=>pt()),f.addEventListener("click",()=>pt()),addEventListener("resize",()=>{B&&Object.assign(r.style,K(dt()))}),{get zoomed(){return B},unzoom:pt,attach(S){let M=S.entry.video;if(!M)return!1;let Y=M.band;u.scale.set(x,x*Y,1),u.position.set(0,x-x*Y/2,-x*.002);let Ke=Y*Ut;return p.repeat.set(1,Ke),p.offset.set(0,(1-Ke)/2),S.mesh.add(u),i.getAttribute("src")!==M.src&&(i.poster=M.poster,i.src=M.src),i.muted=!0,i.pause(),i.currentTime=M.start||0,O=!0,Ie=!1,!0},detach(){O&&(pt(!0),O=!1,q=null,clearTimeout(y),i.pause(),u.removeFromParent(),u.visible=!1,d.opacity=0,l.hidden=!0)},update(S,M){if(!O)return!1;if(d.opacity=S,u.visible=S>0,M&&!B){u.parent.updateMatrixWorld(),u.updateMatrixWorld(),q=D();let Y={x:q.left+q.width/2,y:q.top+q.height/2};l.style.left=`${Y.x}px`,l.style.top=`${Y.y}px`,r.classList.contains("on")||Object.assign(r.style,K(q))}return M&&!Ie&&!y&&(y=setTimeout(()=>{y=0,E()},yn)),B||(l.hidden=!M),u.visible&&!i.paused&&a(),u.visible}}}var I=No,te=document.getElementById("c"),P=new Yo({canvas:te,antialias:!0,powerPreference:"high-performance"});P.outputColorSpace=re;P.toneMapping=Ho;var j=new ye,$a=new qo(P);j.environment=$a.fromScene(new Et,.04).texture;j.environmentIntensity=.46;$a.dispose();var be=Zo();Xo(be);_.tops.forEach((e,t)=>be.uShelf.value[t].set(-_.width/2,_.width/2,e-_.thick,e));be.uShelfDepth.value=_.depth;var Ht=Qo(P,be);j.add(Ht.mesh);var Va=Jo(be);for(let e of Va)j.add(e);var m=la(I);Xe.value=window.__editionsTest?.coverBias??-.5;var He=new gt(new Uint8Array([255,255,255,255]),1,1);He.colorSpace=re;He.needsUpdate=!0;for(let e of m)e.front.map=He,e.back.map=He,j.add(e.mesh);var ot=1,Tt=m.find(e=>e.entry.newest)||null,Oa=!1,at=wa("Now playing");j.add(at.mesh);var nt=va(P),V=2556,H=new Io(20,1,100,V*2),Le=Sa({camera:H,layer:ot,wake:()=>C(),dur:R,els:{frame:document.getElementById("film-frame"),video:document.querySelector("#film-frame video"),play:document.getElementById("d-play"),close:document.getElementById("d-close"),shade:document.getElementById("film-shade")}});H.position.set(0,0,V);var g=ba(m.length),Lt=Ea();j.add(Lt.mesh);var Se=m.map(()=>null),Ua=m.map(()=>null),Xt=m.map(()=>null),Qt=m.map(()=>null),wn=320,Je=[],En=1,Wa=null,qa=new Promise(e=>requestAnimationFrame(()=>requestAnimationFrame(e))).then(()=>import("./covers-ZSARYGHH.js")).then(e=>Wa=e),bn=(e,t,a)=>qa.then(o=>o.createCover(P,e.entry,t,a)),Jt=()=>At===null?0:performance.now()-At,Ma=window.__editionsTest?.coverLate||{},Sn=0;function Ya(){let e=Sn++;if(e>=m.length)return Promise.resolve();let t=m[e],a=()=>{Xt[e]=Jt(),Ua[e]=At===null?null:Math.round(Xt[e]),C()};return bn(t,e,{size:1024,backSize:0}).then(o=>{let n=()=>{Se[e]=o,Gt(t,o.front,null)&&Je.push({s:t,at:performance.now()}),a()};Ma[e]==null?n():setTimeout(n,Math.max(0,to(e)+Ma[e]-Jt()))},o=>{console.warn(`cover ${t.entry.name}: flat sleeve (${o?.message||o})`),a()}).then(Ya)}var Mn=qa.then(()=>Promise.all(Array.from({length:En},Ya))),Rn=new Oo;for(let e of m)Rn.load(new URL(`./covers/thumbs/${ie(e.entry)}.webp`,new URL("../main.js",import.meta.url).href).href,t=>{t.colorSpace=re,t.anisotropy=P.capabilities.getMaxAnisotropy(),fa(e,t),Qt[e.i]=Jt(),C()},void 0,()=>{});function Tn(e){let t=m[e],a=Se[e]?.detailBack(1024).then(o=>{s&&s.i===e&&(t.back.map=o||He,t.back.color.set(o?16777215:Na),t.back.needsUpdate=!0,C())}).catch(o=>console.warn(`cover ${t.entry.name}: no Details back (${o?.message||o})`));Promise.resolve(a).then(()=>{s&&s.i===e&&s.backIn===null&&(s.backIn=performance.now())})}var eo=!1;function kn(){if(eo||!Se[0]||xe.some(t=>!t))return;eo=!0;let e=window.requestIdleCallback||(t=>setTimeout(t,200));e(()=>{s||Se[0].detailBack(1024).catch(()=>{}),e(()=>bo().then(t=>t.warm()).catch(t=>console.warn(`page warm-up: ${t?.message||t}`)),{timeout:3e3})},{timeout:2e3})}var Na=15328992,Ra=600,Ee=m.map(()=>null),Ta=m.map(()=>0),to=e=>v?z(A.appear.at+A.appear.stagger*e):$t(e);function Hn(e,t){if(Ee[e]===null){if(e>0&&Ee[e-1]===null)return null;let a=to(e),o=e>0?Math.max(a,Ee[e-1]+a-to(e-1)):a,r=Xt[e]??Qt[e]??(t>=a+Ra?a+Ra:null);if(r===null||t<Math.max(o,r))return null;Ee[e]=Math.max(o,r),Ta[e]=Ee[e]-a,!Se[e]&&Qt[e]===null&&Ln(m[e])}return Ta[e]}function Ln(e){let t=Wa?.coverGround?.(e.entry,e.i)||e.entry.accent?.light;t&&e.front.color.set(t)}function An(e){e.back.map!==He&&(e.back.map=He,e.back.color.set(Na),e.back.needsUpdate=!0)}var et=-1,ja=0;function zn(e){e!==et&&(et>=0&&(Se[et]?.setAlive(!1),ja=performance.now()+1700),et=e,e>=0&&Se[e]?.setAlive(!0))}var fe=null,Wt=null,oo=document.querySelector(".sound");function lo(){let e=!!fe?.enabled;oo.setAttribute("aria-pressed",String(e)),oo.setAttribute("aria-label",e?"Sound on":"Sound off")}function co(){return Wt||(Wt=import("./audio-3KD7PEEU.js").then(e=>(fe=e.createAudio(),fe.setRoomTone(!0),lo(),fe))),Wt}var ne=(e,t)=>{window.__editions?.soundLog?.push([e,Math.round(performance.now())]),fe?.play(e,t)},Ae=e=>Math.max(-1,Math.min(1,m[e].x/600));for(let e of["pointermove","pointerdown","keydown","touchstart"])window.addEventListener(e,co,{once:!0,capture:!0,passive:!0});var Ka=()=>{fe?fe.unlock():co().then(e=>e.unlock())};window.addEventListener("pointerdown",Ka,{once:!0,capture:!0});window.addEventListener("keydown",Ka,{once:!0,capture:!0});oo.addEventListener("click",async()=>{let e=fe||await co();e.setEnabled(!e.enabled),lo()});lo();var ft=document.getElementById("slots"),We=m.map(e=>{let t=I[e.i],a=document.createElement("li");a.className="slot";let o=document.createElement("article");o.setAttribute("aria-labelledby",`sl-${e.i}`);let n=document.createElement("h2");if(n.className="sr",n.id=`sl-${e.i}`,n.textContent=t.name,o.appendChild(n),t.tag){let l=document.createElement("p");l.className="sr",l.textContent=t.year?`${t.tag}, ${t.year}`:t.tag,o.appendChild(l)}let r=document.createElement("a");r.dataset.action="open",r.textContent="Open",fo(r,e.i);let i=document.createElement("button");return i.type="button",i.dataset.action="details",i.dataset.index=String(e.i),i.textContent="Details",i.setAttribute("aria-label",`Details: ${t.name}`),o.append(r,i),a.appendChild(o),ft.appendChild(a),a});function Za(e,t){let a=I[t];e.dataset.index=String(t),e.href=`#${ie(a)}`,e.hidden=!a.url,e.setAttribute("aria-label",`More detail: ${a.name}`)}function fo(e,t){let a=I[t];e.dataset.index=String(t),e.href=a.url||`#${ie(a)}`,a.url?(e.target="_blank",e.rel="noopener"):(e.removeAttribute("target"),e.removeAttribute("rel")),e.setAttribute("aria-label",a.url?`Open: ${a.name} site, new tab`:`Open: ${a.name}`)}var je=document.getElementById("crate-bar"),Cn=je.querySelector(".cb-year"),Pn=je.querySelector(".cb-name"),ka=je.querySelector(".cb-details"),Fn=je.querySelector(".cb-open"),In=je.querySelector(".cb-more"),qt=document.querySelector(".crate-rail span"),Ha=document.getElementById("announce");function ut(e){Ha.textContent="",requestAnimationFrame(()=>{Ha.textContent=e})}document.getElementById("index").append(...I.map(e=>{let t=document.createElement("li"),a=document.createElement("span");a.className="y",a.textContent=e.year||"";let o=document.createElement("span");return o.className="n",o.textContent=e.name,t.append(a,o),t}));var It=document.querySelector(".tagline"),qe=document.getElementById("details"),rt=qe.querySelector(".d-title"),st=qe.querySelector(".d-tag"),he=document.getElementById("d-open"),me=document.getElementById("d-more");function Oe(e,t,a,o){let n=+getComputedStyle(e).opacity;for(let r of e.getAnimations())r.cancel();e.animate([{opacity:n},{opacity:t}],{duration:R(o),delay:z(a),easing:"ease",fill:"both"})}var $=0,G=0,ae=1,v=!1,ao=0,no=0,ro=0,Xa=0,Ve=0,Bn=14,Yt=new ue;function uo(){$=window.innerWidth,G=window.innerHeight;let e=v;v=$<600,V=v?2556*4:2556,ae=v?g.layout($,G,V):Dt($,G),H.position.z=V,H.far=V*2;let t=$/2/ae,a=G/2/ae;if(H.fov=mt.radToDeg(2*Math.atan(a/V)),H.aspect=$/G,H.clearViewOffset(),H.updateMatrixWorld(),Ve=0,!v){let c=N(),f=h.size,p=ze(0,_.tops[0]+f*Math.cos(c.lean),c.z-f*Math.sin(c.lean)+h.thick).y;Ve=Math.max(0,Math.round(It.getBoundingClientRect().bottom+Bn-p)),Ve&&H.setViewOffset($,G,0,-Ve,$,G)}P.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),P.setSize($,G,!1),P.getDrawingBufferSize(Yt),nt.resize(Yt.x,Yt.y);let o=v?Dt($,G):ae,n=$/2/o*1.02,r=G/2/o*1.02,i=Ve/ae;Ht.resize(-t*1.02,-a*1.02+i,t*1.02,a*1.02+i,Math.ceil($/2),Math.ceil(G/2),v?[-n,-r,n,r]:null),Ue=ce=!0,ao=v?w.details.size*$:L.size*ae,no=v?w.details.centreY*G:G/2-(900/2-L.centreY)*ae,ro=V*(1-h.size*ae/ao),Xa=(G/2+Ve-no)/ae*(V-ro)/V;let l=v||!!window.__editionsTest?.noShelves;for(let c of Va)c.visible=!l;Ht.setGain(v?w.groundGain:1),Lt.mesh.visible=v,v&&Lt.layout($,G,ae);for(let c of m)c.mats[0].color.set(v?w.edgeColour:15855594);if(_.tops.forEach((c,f)=>l?be.uShelf.value[f].set(0,0,-1e5,-1e5):be.uShelf.value[f].set(-_.width/2,_.width/2,c-_.thick,c)),document.body.classList.toggle("crate",v),v!==e){s&&Mo(),Fe(-1);for(let c of m)xe[c.i]&&(c.fall=null,c.pose=so(c),we(c));Ne(!0)}else if(v)for(let c of m)xe[c.i]&&!(s&&s.i===c.i)&&(c.pose=so(c),we(c));Qa=m.map(c=>Dn(c)),v||m.forEach(mo),Gn(),C()}var so=e=>v?g.pose(e):N(),Nt=new U,Te=new Co;function ze(e,t,a){return Nt.set(e,t,a).project(H),{x:(Nt.x+1)/2*$,y:(1-Nt.y)/2*G}}function po(e){let t=m[e].mesh;t.geometry.boundingBox||t.geometry.computeBoundingBox(),Te.copy(t.geometry.boundingBox).applyMatrix4(t.matrixWorld);let a=1/0,o=1/0,n=-1/0,r=-1/0;for(let i of[Te.min.x,Te.max.x])for(let l of[Te.min.y,Te.max.y])for(let c of[Te.min.z,Te.max.z]){let f=ze(i,l,c);a=Math.min(a,f.x),n=Math.max(n,f.x),o=Math.min(o,f.y),r=Math.max(r,f.y)}return{x:a,y:o,width:n-a,height:r-o}}var Qa=[];function Dn(e){let t=h.size,a=e.shelfY,o=ze(e.x-t/2,a+h.hoverLift+t,h.hoverZ),n=ze(e.x+t/2,a,0);return{x0:o.x,y0:o.y,x1:n.x,y1:n.y}}function ho(e,t){let a=-1;return Qa.forEach((o,n)=>{xe[n]&&e>=o.x0&&e<=o.x1&&t>=o.y0&&t<=o.y1&&(a=n)}),a}var Q=new U,tt=e=>{let t=P.getPixelRatio();return Math.round(e*t)/t};function mo(e){Q.set(-h.size/2,0,h.thick).applyMatrix4(e.mesh.matrixWorld);let t=ze(Q.x,Q.y,Q.z);Q.set(h.size/2,0,h.thick).applyMatrix4(e.mesh.matrixWorld);let o=ze(Q.x,Q.y,Q.z).x-t.x;We[e.i].style.transform=`translate3d(${tt(t.x+o*.1175)}px, ${tt(t.y-o*.025-35)}px, 0)`}function _n(e){return{...N(),lean:0,dx:-e.x,lift:Xa-h.size/2-e.shelfY,z:ro-h.thick/2}}function Gn(){let e=no;rt.style.top=`${tt(e-54.2)}px`,st.style.top=`${tt(e-13.6)}px`,he.style.top=me.style.top=`${tt(e+ao/2+16)}px`}var it=0,Qe=0,Ue=!0,ce=!0,At=null,zt=null,Ce=-1,W=-1,Ct=0,s=null,La=-1,Aa=!1,xe=m.map(()=>!1),ee={x:-1,y:-1},Ye={};Ye.ready=new Promise(e=>{Ye.resolve=e});var Fr=Ye.ready;function C(){it||(it=requestAnimationFrame(Un))}function za(e,t){let a=h.size,o=h.thick;return{x:e.x+t.dx,y:e.shelfY+t.lift+a/2*Math.cos(t.lean),z:t.z-a/2*Math.sin(t.lean)+o/2}}function Ca(e,t,a,o){let n=Rt(t,a,o),r=h.size,i=za(e,t),l=za(e,a),c=V/(V-i.z),f=V/(V-l.z),p=c+(f-c)*o,d=(i.x*c+(l.x*f-i.x*c)*o)/p,u=(i.y*c+(l.y*f-i.y*c)*o)/p;return n.dx=d-e.x,n.lift=u-e.shelfY-r/2*Math.cos(n.lean),n.z=V*(1-1/p)+r/2*Math.sin(n.lean)-h.thick/2,n}var $n=e=>1-(1-e)**3,jt=e=>e*e*(3-2*e),Pa=Math.PI*2,Ja=.1,Vn=450,Kt=e=>pe()?e>=0?1:0:Me(L.flip.ease,F(e/R(L.flip.dur))),Fa=()=>z(L.fly.at)+R(L.fly.dur)*(1-Ja),xo=e=>Math.abs(Math.round(e/Math.PI))%2===1;function On(e,t){let a=L.fly,o=L.exit,n=L.flip,r=()=>s.flip.from+(s.flip.to-s.flip.from)*Me(n.ease,F((t-s.flip.t0-z(n.at))/R(n.dur))),i,l;if(s.exit){let c=s.exit,f=t-c.t0,p=f-c.lag,d=Me(o.ease,F((p-z(o.at))/R(o.dur)));if(i=Ca(e,c.from,{...v?g.pose(e):$e(),yaw:c.yawTo},d),i.yaw=c.from.yaw+(c.yawTo-c.from.yaw)*(c.lag?Kt(f):1),s.blur=c.blur*(1-jt(F((p-z(o.blurOut.at))/R(o.blurOut.dur)))),l=p<z(o.at)+R(o.dur)||s.blur>0,s.film=[c.lag?1-Kt(f):0,!1],!l)return Le.detach(),en(e,t),!0}else{s.backIn===null&&t-s.asked<L.backWait&&t-s.t0>z(a.at)&&(s.t0=t-z(a.at));let c=t-s.t0,f=Me(a.ease,F((c-z(a.at))/R(a.dur)));i=Ca(e,s.from,_n(e),f),i.yaw=s.turn*Kt(c-Fa())+r(),s.blur=v?0:jt(F((c-z(L.blur.at))/R(L.blur.dur)));let p=Fa()+R(n.dur),d=m[s.i].entry.video?R(Vn):0,u=Math.max(p+d,...[a,L.blur,L.title].map(x=>z(x.at)+R(x.dur)));l=c<u||t-s.flip.t0<z(n.at)+R(n.dur),s.film=[d?jt(F((c-p)/d)):0,!l&&xo(i.yaw)]}return e.pose=i,l}var Pt=!1;te.addEventListener("webglcontextlost",e=>{e.preventDefault(),!Pt&&(Pt=!0,it&&cancelAnimationFrame(it),s&&Mo(),Eo?.close(),import("./fallback.js").then(t=>t.start(I)))});function Un(e){if(it=0,Pt)return;if(J>=0){Qe=0;return}let t=Qe?Math.min(.05,(e-Qe)/1e3):0;Qe=e;let a=!1,o=zt===null?-1:e-zt,n=Aa,r=v&&g.step(t);Aa=r,r?Ne():n&&v&&(Ne(),Yn());let i=s||v?-1:Ce;W!==i&&(s||e-Ct>=z(ua))&&(W>=0&&!(s&&s.i===W)&&(m[W].fall={from:{...m[W].pose},t0:Ct}),W=i,W>=0&&(m[W].fall=null)),zn(s?Math.cos(m[s.i].pose.yaw)>0?s.i:-1:W);let l=W!==i;for(let f of m){let p=!1;if(s&&f.i===s.i)p=On(f,e);else if(xe[f.i]){if(v)r&&(f.pose=g.pose(f),p=!0);else if(W===f.i)p=ha(f,t);else if(f.fall){let d=ma(f.fall.from,e-f.fall.t0);d?f.pose=d:(f.pose=N(),f.fall=null),p=!0}}else if(o>=0){let d=Hn(f.i,o);if(d!==null){let u=v?qn(f,o-d):pa(f.i,o-d);u?f.pose=u:(f.pose=so(f),xe[f.i]=!0)}p=!0}if(p){we(f),v||mo(f);let d=!v&&f.pose.z<270;(d||f.shaded)&&(Ue=!0),f.shaded=d,(!s||f.i!==s.i)&&(ce=!0),a=!0}}Ue&&(ca(m,be,v),Ht.bake(),Ue=!1,ce=!0),v&&Lt.setOpacity(o<0||Ee[0]===null?0:F((o-Ee[0])/R(600))),Tt&&(at.mesh.layers.set(s&&s.i===Tt.i?ot:0),at.place(Tt,Oa?0:Tt.pose.opacity));let c=et>=0||e<ja;if(c&&!window.__editionsTest?.stillCovers)for(let f of Se)f?.update(t);for(let f=Je.length-1;f>=0;f--){let p=Je[f],d=F((performance.now()-p.at)/R(wn));p.s.fade.uFade.value=d*d*(3-2*d),(!s||s.i!==p.s.i)&&(ce=!0),d>=1&&Je.splice(f,1)}if(s){let f=m[s.i],p=L.blur.sigma*s.blur;(ce||p!==La)&&(H.layers.set(0),nt.background(j,H,p),ce=!1,La=p),s.film&&Le.update(...s.film),nt.composite(Math.min(1,s.blur*4)),H.layers.set(ot),P.autoClear=!1,P.clearDepth(),P.render(j,H),P.autoClear=!0,H.layers.set(0)}else P.render(j,H);kt.firstFrameAt===null&&(kt.firstFrameAt=performance.now(),Wn(kt.firstFrameAt),Ye.resolve(),a=!0),!eo&&!a&&kn(),a||l||c||r||Je.length?C():Qe=0}function Ia(e){if(!CSS.supports("animation-timing-function","linear(0, 1)"))return"cubic-bezier(0.16, 1, 0.3, 1)";let t=24,a=[],o=1-Math.exp(-1/e);for(let n=0;n<=t;n++)a.push(((1-Math.exp(-(n/t)/e))/o).toFixed(4));return`linear(${a.join(", ")})`}function Wn(e){At=e,zt=window.__editionsTest?.noSleeves?null:e,te.animate([{opacity:0},{opacity:1}],{duration:R(A.canvasFade.dur),easing:A.canvasFade.ease,fill:"forwards"});let t=A.header,a=R(t.tau*5);document.querySelectorAll(".rise").forEach((n,r)=>n.animate([{opacity:0,transform:`translateY(${-t.rise}px)`},{opacity:1,transform:"none"}],{duration:a,delay:z(t.at+t.stagger*r),easing:Ia(.2),fill:"forwards"}));let o=A.late;document.querySelectorAll(".late").forEach(n=>n.animate([{opacity:0},{opacity:1}],{duration:R(o.tau*5),delay:z(o.at),easing:Ia(.2),fill:"forwards"}))}function lt(){let e=s?-1:Ce;We.forEach((t,a)=>t.classList.toggle("hot",a===e)),te.style.cursor=s?vo()?"pointer":"":Ce>=0?"pointer":""}function Fe(e,t=!1){e!==Ce&&(Ce=e,Ct=performance.now(),lt(),e>=0&&!s&&(t||ne("hover",{pan:Ae(e)}),ne("lift",{pan:Ae(e),intensity:.8})),C())}function vo(){if(!s)return!1;let e=po(s.i);return ee.x>=e.x&&ee.x<=e.x+e.width&&ee.y>=e.y&&ee.y<=e.y+e.height}var Pe=-1;window.addEventListener("pointermove",e=>{if(e.pointerType==="touch"||v)return;if(ee.x=e.clientX,ee.y=e.clientY,s){lt();return}let t=e.target.closest?.(".pm")?-1:ho(e.clientX,e.clientY);t!==Pe&&(Pe=t,Fe(t))});document.documentElement.addEventListener("pointerleave",()=>{Pe=-1,Fe(-1)});window.addEventListener("blur",()=>{Pe=-1,Fe(-1)});window.addEventListener("resize",uo);te.addEventListener("click",e=>{if(v)return;if(ee.x=e.clientX,ee.y=e.clientY,s){if(s.exit)return;vo()?wo():Bt();return}let t=ho(e.clientX,e.clientY);t>=0&&go(t)});function qn(e,t){let a=F((t-z(A.appear.at+A.appear.stagger*e.i))/R(360));if(a>=1)return null;let o=g.pose(e);return o.opacity=a,pe()||(o.lift+=(1-$n(a))*40/ae),o}var Ba=-1,Da=0;function Ne(e=!1){if(!v)return;let t=m.length,a=g.current,o=I[a],n=qt.parentElement.clientHeight-qt.offsetHeight;qt.style.transform=`translateY(${((1-F(g.p/Math.max(1,t-1)))*n).toFixed(1)}px)`,!(a===Ba&&!e)&&(Ba=a,Cn.textContent=o.year||"",Pn.textContent=o.name,ka.dataset.index=String(a),ka.setAttribute("aria-label",`Details: ${o.name}`),fo(Fn,a),Za(In,a))}function Yn(){let e=g.current;e!==Da&&(Da=e,ut(`${I[e].name}, ${e+1} of ${m.length}`))}function Nn(e,t){let a=Math.round(g.p),o=[];for(let n=0;n<a;n++)o.push(n);for(let n=a;n<m.length;n++)o.push(n);for(let n of o){if(!xe[n])continue;let r=po(n);if(e>=r.x&&e<=r.x+r.width&&t>=r.y&&t<=r.y+r.height)return n}return-1}var ke=null;te.addEventListener("pointerdown",e=>{!v||J>=0||!e.isPrimary||(ke={x:e.clientX,y:e.clientY,id:e.pointerId},te.setPointerCapture(e.pointerId),s||(g.begin(e.clientY,e.timeStamp),C()))});te.addEventListener("pointermove",e=>{!ke||e.pointerId!==ke.id||s||(g.move(e.clientY,e.timeStamp),Ne(),C())});var yo=e=>t=>{if(!ke||t.pointerId!==ke.id)return;let{x:a,y:o}=ke;ke=null;let n=Math.hypot(t.clientX-a,t.clientY-o);if(e){g.cancel(),C();return}if(s||g.end(t.timeStamp),C(),n>=8)return;if(ee.x=t.clientX,ee.y=t.clientY,s){if(s.exit)return;vo()?wo():Bt();return}let r=Nn(t.clientX,t.clientY);r<0||(r===g.current&&Math.abs(g.p-r)<.05?go(r):(g.go(r),ne("tick")))};te.addEventListener("pointerup",yo(!1));te.addEventListener("pointercancel",yo(!0));te.addEventListener("lostpointercapture",yo(!0));var _a=0;window.addEventListener("wheel",e=>{!v||s||J>=0||(e.preventDefault(),e.timeStamp-_a>200&&g.wheel(0),_a=e.timeStamp,g.wheel(e.deltaY),C())},{passive:!1});je.querySelector(".cb-back").addEventListener("click",()=>Bt());function go(e){if(s||!xe[e])return;let t=m[e],a=performance.now();t.fall=null,v&&g.go(e);let o=ct(document.activeElement)===e?document.activeElement:null,n=!v&&t.x>0?-1:1;s={i:e,t0:a,asked:a,backIn:null,from:{...t.pose},dir:n,turn:n*Math.PI,flip:{from:0,to:0,t0:-1e9},exit:null,blur:0,ret:o},t.mesh.layers.set(ot),ce=!0,Tn(e),rt.textContent=t.entry.name,st.textContent=t.entry.tag,fo(he,e),Za(me,e),he.classList.toggle("paired",!me.hidden),qe.inert=!1,he.inert=!1,me.inert=!1,ft.inert=!0,document.body.classList.add("in-details");let r=L;Oe(It,0,r.headerOut.at,r.headerOut.dur);for(let i of[rt,st])Oe(i,1,r.title.at,r.title.dur);for(let i of[he,me])Oe(i,1,r.open.at,r.open.dur);Le.attach(t),qe.focus({preventScroll:!0}),ne("details",{pan:Ae(e)}),ut(t.entry.tag?`Details: ${t.entry.name}. ${t.entry.tag}`:`Details: ${t.entry.name}`),lt(),C()}function wo(){if(!s||s.exit)return;let e=performance.now(),t=L.flip,a=s.flip,o=a.from+(a.to-a.from)*Me(t.ease,F((e-a.t0-z(t.at))/R(t.dur)));s.flip={from:o,to:a.to+s.dir*Math.PI,t0:e},ne("flip"),ut(xo(s.turn+s.flip.to)?"Back of the sleeve":"Front of the sleeve"),C()}function Bt(){if(!s||s.exit)return;let e=m[s.i],t=performance.now(),a=L.exit,o=e.pose.yaw/Pa,n=Pa*(s.dir>0?Math.ceil(o-.5-1e-6):Math.floor(o+.5+1e-6)),r=Math.abs(n-e.pose.yaw)<.001?0:R(L.flip.dur)*(1-Ja);s.exit={t0:t,from:{...e.pose},yawTo:n,lag:r,blur:s.blur};for(let i of[rt,st,he,me])Oe(i,0,a.at,a.textOut);Le.unzoom(!0),Oe(It,1,a.headerIn.at,a.headerIn.dur),qe.inert=!0,he.inert=!0,me.inert=!0,ne("close",{pan:Ae(s.i)}),ut("Back to the shelf"),C()}function en(e,t,a=!1){let{i:o}=s,n=a?null:s.ret;if(s=null,An(e),e.pose=v?g.pose(e):$e(),we(e),e.mesh.layers.set(0),ce=Ue=!0,ft.inert=!1,document.body.classList.remove("in-details"),v){n&&n.isConnected&&n.focus({preventScroll:!0}),Ne(!0),lt();return}Pe=a?-1:ho(ee.x,ee.y),Ce=Pe,Ct=t,n&&n.isConnected&&n.focus({preventScroll:!0}),W=Ce===o?o:-1,W!==o&&(e.fall={from:$e(),t0:t}),mo(e),lt()}var Eo=null,Ga=null,J=-1,Ft=!1,io=!1,bo=()=>Ga||(Ga=import("./project-EFHC4NCV.js").then(e=>Eo=e.createProjectView({renderer:P,entries:I,slugOf:ie,onBack:Kn})));function jn(e){ne("open",{pan:s?0:Ae(e)}),bo(),I[e].kind!=="about"&&import("./project-EFHC4NCV.js").then(t=>t.loadDossier(ie(I[e]))),Ft=!0,io=!0,ut(`Open: ${I[e].name}`),location.hash=ie(I[e])}async function So(){if(Pt)return;let e=decodeURIComponent(location.hash.slice(1)),t=I.findIndex(a=>ie(a)===e);if(t>=0){if(t===J)return;let a=await bo();if(I.findIndex(o=>ie(o)===decodeURIComponent(location.hash.slice(1)))!==t||t===J)return;s&&Mo(!0),Fe(-1),J=t;for(let o of te.getAnimations())o.finish();fe?.setRoomTone(!1),io||ne("open"),io=!1,await a.open(t)}else if(J>=0){let a=J;if(J=-1,Eo?.close(),fe?.setRoomTone(!0),ne("close",{pan:Ae(a)}),uo(),v){g.jump(a);for(let o of m)xe[o.i]&&(o.pose=g.pose(o),we(o));Ne(!0)}Ue=ce=!0,We[a].querySelector('[data-action="open"]').focus({preventScroll:!0}),C()}}function Kn(){Ft?(Ft=!1,history.back()):(history.pushState(null,"",location.pathname+location.search),So())}window.addEventListener("hashchange",()=>{location.hash||(Ft=!1),So()});function Mo(e=!1){let t=m[s.i];for(let a of[rt,st,he,me])for(let o of a.getAnimations())o.cancel();Le.detach(),Oe(It,1,0,1),qe.inert=!0,he.inert=!0,me.inert=!0,en(t,performance.now(),e),t.fall=null,W=-1}document.addEventListener("click",e=>{let t=e.target.closest("[data-action][data-index]");if(!t)return;let a=+t.dataset.index;if(t.dataset.action==="details"){go(a);return}t.dataset.action==="open"&&I[a].url||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||(e.preventDefault(),jn(a))});var ct=e=>e&&e.closest&&e.closest(".slot")?We.indexOf(e.closest(".slot")):-1;ft.addEventListener("focusin",e=>{let t=ct(e.target);if(!(t<0)){if(v){s||(g.go(t),C());return}Fe(t,!0)}});ft.addEventListener("focusout",e=>{ct(e.relatedTarget)>=0||s||Fe(Pe)});window.addEventListener("keydown",e=>{if(e.metaKey||e.ctrlKey||e.altKey||J>=0||document.querySelector("dialog.ct[open]"))return;if(s){if(Le.zoomed){e.key==="Escape"&&(e.preventDefault(),Le.unzoom());return}e.key==="Escape"?(e.preventDefault(),Bt()):(e.key===" "||e.code==="Space")&&(e.preventDefault(),e.repeat||wo());return}if(v){let r={ArrowLeft:-1,ArrowUp:-1,ArrowRight:1,ArrowDown:1}[e.key];if(r===void 0)return;e.preventDefault();let i=Math.max(0,Math.min(m.length-1,g.current+r));if(i===g.current)return;g.go(i),ct(document.activeElement)>=0&&We[i].querySelector(`[data-action="${document.activeElement.dataset.action}"]`).focus({preventScroll:!0}),ne("tick"),C();return}let t={ArrowLeft:-1,ArrowRight:1,ArrowUp:-h.cols,ArrowDown:h.cols}[e.key];if(t===void 0)return;e.preventDefault();let a=ct(document.activeElement),o=a<0?0:Math.max(0,Math.min(m.length-1,a+t));if(o===a)return;let n=document.activeElement?.dataset?.action==="open"?"open":"details";We[o].querySelector(`[data-action="${n}"]`).focus({preventScroll:!0}),ne("tick",{pan:Ae(o)})});window.addEventListener("keyup",e=>{s&&(e.key===" "||e.code==="Space")&&e.preventDefault()});var Ro=window.matchMedia("(prefers-reduced-motion: reduce)");wt(Ro.matches);g.setReduced(Ro.matches);Ro.addEventListener?.("change",e=>{wt(e.matches),g.setReduced(e.matches)});var kt={count:m.length,firstFrameAt:null,ready:Ye.ready,covers:Mn,sleeveRect:po,frontCorners(e){let t=m[e].mesh.matrixWorld,a=h.size;return[[-a/2,0],[a/2,0],[a/2,a],[-a/2,a]].map(([o,n])=>(Q.set(o,n,h.thick).applyMatrix4(t),ze(Q.x,Q.y,Q.z)))},setCover(e,t,a){Gt(m[e],t,a),C()},get project(){return J>=0?ie(I[J]):null},get sleevesAt(){return zt},coverReadyAt:Ua,appearAt:Ee,get crate(){return v?{p:g.p,current:g.current,dragging:g.dragging}:null},set stickerOff(e){Oa=!!e,C()},get details(){return s?{index:s.i,flipped:xo(s.turn+s.flip.to),closing:!!s.exit,blur:s.blur,yaw:m[s.i].pose.yaw,backIn:s.backIn===null?null:Math.round(s.backIn-s.asked)}:null}};window.__editions=kt;uo();for(let e of m)e.mesh.visible=!0;at.mesh.visible=!0;for(let e of[!0,!1]){for(let t of m)for(let a of[t.front,t.back,t.mats[0]])a.transparent=e,a.needsUpdate=!0;for(let t of[0,ot])H.layers.set(t),P.render(j,H);H.layers.enableAll(),P.render(j,H),H.layers.set(0),nt.background(j,H,1),nt.composite(.5)}for(let e of m)we(e);at.mesh.visible=!1;ce=!0;Ye.ready.then(()=>{location.hash&&So()});export{Fr as drawn};
