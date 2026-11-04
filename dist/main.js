import{A as xt,B as se,C as vt,D as Fo,E as xe,F as yt,G as Io,H as Bo,I as Do,J as _o,K as Go,L as oe,M as ue,N as $o,O as Vo,P as Oo,R as Uo,S as Wo,T as qo,a as To,b as ko,d as Ie,g as pt,h as Ho,j as re,k as Lo,l as ht,m as fe,n as zo,o as U,q as Z,r as Be,s as Ao,t as me,u as Co,v as mt,w as Po,z as k}from"./chunk-QESZHFER.js";import{a as F,b as gt,c as pe,d as R,e as A,f as Se}from"./chunk-TH7WALPN.js";import{a as Bt,b as Yo,c as de,e as h,f as D,g as No,h as L,i as z}from"./chunk-GBXN2TGX.js";var wt=class extends xe{constructor(){super();let t=new xt;t.deleteAttribute("uv");let a=new ue({side:To}),o=new ue,n=new Oo(16777215,900,28,2);n.position.set(.418,16.199,.3),this.add(n);let r=new k(t,a);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let i=new Io(t,o,6),l=new Co;l.position.set(-10.906,2.009,1.846),l.rotation.set(0,-.195,0),l.scale.set(2.328,7.905,4.651),l.updateMatrix(),i.setMatrixAt(0,l.matrix),l.position.set(-5.607,-.754,-.758),l.rotation.set(0,.994,0),l.scale.set(1.97,1.534,3.955),l.updateMatrix(),i.setMatrixAt(1,l.matrix),l.position.set(6.167,.857,7.803),l.rotation.set(0,.561,0),l.scale.set(3.927,6.285,3.687),l.updateMatrix(),i.setMatrixAt(2,l.matrix),l.position.set(-2.017,.018,6.124),l.rotation.set(0,.333,0),l.scale.set(2.002,4.566,2.064),l.updateMatrix(),i.setMatrixAt(3,l.matrix),l.position.set(2.291,-.756,-2.621),l.rotation.set(0,-.286,0),l.scale.set(1.546,1.552,1.496),l.updateMatrix(),i.setMatrixAt(4,l.matrix),l.position.set(-2.193,-.369,-5.547),l.rotation.set(0,.516,0),l.scale.set(3.875,3.487,2.986),l.updateMatrix(),i.setMatrixAt(5,l.matrix),this.add(i);let c=new k(t,De(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);let f=new k(t,De(50));f.position.set(-16.109,18.021,-8.207),f.scale.set(.1,2.425,2.751),this.add(f);let p=new k(t,De(17));p.position.set(14.904,12.198,-1.832),p.scale.set(.15,4.265,6.331),this.add(p);let d=new k(t,De(43));d.position.set(-.462,8.89,14.52),d.scale.set(4.38,5.441,.088),this.add(d);let u=new k(t,De(20));u.position.set(3.235,11.486,-12.541),u.scale.set(2.5,2,.1),this.add(u);let x=new k(t,De(100));x.position.set(0,20,0),x.scale.set(1,.1,1),this.add(x)}dispose(){let t=new Set;this.traverse(a=>{a.isMesh&&(t.add(a.geometry),t.add(a.material))});for(let a of t)a.dispose()}};function De(e){return new $o({color:0,emissive:16777215,emissiveIntensity:e})}var en=h.hoverLift.toFixed(2),ie=h.cols,jo=(h.pitch/2).toFixed(2),tn={key:{rect:[1148.801,12.997,8768.289,3472.806],z:994.831,power:2.322},fill:{rect:[-2516.226,-9815.124,2516.226,10070.146],z:573.364,power:1.474},shelfAlbedo:1.219,shelfAmbient:.383,contact:{strength:.332,reach:19.033},keyMix:.571,base:{centre:.614,edge:.752,cy:-293.494,rx:806.633,ry:309.574,pow:.304},edgeShade:{strength:.989,reach:5.54},liftShade:{strength:.5,reach:8},halo:{right:.4,left:.383,top:.056,rise:.308,fall:60.395,row2:.724,vfall:10,drop:.881,dropReach:31.417},glow:{strength:.2,fall:100,side:60,fade:24.653,width:1100}},_e=4*ie;function Ko(){return{uLightRect:{value:[new Z,new Z]},uLightZ:{value:[0,0]},uLightPower:{value:[0,0]},uShelf:{value:[new Z,new Z]},uShelfDepth:{value:0},uSlab:{value:Array.from({length:_e},()=>new Z(0,0,0,0))},uSlabZ:{value:new Array(_e).fill(1)},uSlabA:{value:new Array(_e).fill(0)},uFoot:{value:Array.from({length:2*ie},()=>new Z(0,0,0,1e3))},uShelfAlbedo:{value:1},uShelfAmbient:{value:0},uContact:{value:new fe},uHalo:{value:new U},uHaloShape:{value:new Z},uHaloDrop:{value:new fe},uGlow:{value:new Z},uGlowWidth:{value:1e4},uEdgeShade:{value:new Z},uKeyMix:{value:.5},uBase:{value:new U},uBaseShape:{value:new U}}}function Zo(e,t=tn){[t.key,t.fill].forEach((a,o)=>{e.uLightRect.value[o].set(...a.rect),e.uLightZ.value[o]=a.z,e.uLightPower.value[o]=a.power}),e.uShelfAlbedo.value=t.shelfAlbedo,e.uShelfAmbient.value=t.shelfAmbient,e.uContact.value.set(t.contact.strength,t.contact.reach),e.uHalo.value.set(t.halo.right,t.halo.left,t.halo.top),e.uHaloShape.value.set(t.halo.rise,t.halo.fall,t.halo.row2,t.halo.vfall),e.uHaloDrop.value.set(t.halo.drop,t.halo.dropReach),e.uGlow.value.set(t.glow.strength,t.glow.fall,t.glow.side,t.glow.fade),e.uGlowWidth.value=t.glow.width,e.uEdgeShade.value.set(t.edgeShade.strength,t.edgeShade.reach,t.liftShade.strength,t.liftShade.reach),e.uKeyMix.value=t.keyMix,e.uBase.value.set(t.base.centre,t.base.edge,t.base.cy),e.uBaseShape.value.set(t.base.rx,t.base.ry,t.base.pow)}var Et=`
#define PI 3.141592653589793
uniform vec4 uLightRect[2];
uniform float uLightZ[2];
uniform float uLightPower[2];
uniform vec4 uShelf[2];      // x0, x1, y bottom, y top
uniform float uShelfDepth;
uniform vec4 uSlab[${_e}];  // x0, y0, x1, y1 of a slab parallel to the wall
uniform float uSlabZ[${_e}];
uniform float uSlabA[${_e}];  // occlusion strength: the sleeve's opacity
uniform vec4 uFoot[${2*ie}];      // per sleeve: x0, x1, bottom edge depth, height of the bottom edge above its shelf

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
    for (int k = 0; k < ${2*ie}; k++) {
      int i = row * ${2*ie} + k;
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
  for (int k = 0; k < ${ie}; k++) {
    int i = row * ${2*ie} + k * 2;
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
  for (int k = 0; k < ${ie}; k++) {
    int i = row * ${2*ie} + k * 2;
    vec4 a = uSlab[i], b = uSlab[i + 1];
    if (a.z <= a.x) continue;
    float dx = min(a.x, b.x) - p.x;
    // It fades toward the top edge with the light beside the sleeve (uHaloDrop), where the sleeve meets the wall.
    if (dx > 0.0 && p.y >= a.y && p.y <= b.w)
      f *= 1.0 - uSlabA[i] * uEdgeShade.x * exp(-dx / uEdgeShade.y) * (1.0 - uHaloDrop.x * (1.0 - smoothstep(0.0, uHaloDrop.y, b.w - p.y)));
    // Under a lifted sleeve: a band from its bottom edge, offset a little to the left.
    float lift = clamp(uFoot[row * ${ie} + k].w / ${en}, 0.0, 1.0);
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
`;var on=`
out vec2 vWorld;
uniform vec4 uRegion; // world x0, y0, x1, y1 covered by the texture
void main() {
  vWorld = mix(uRegion.xy, uRegion.zw, uv);
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`,an=`
precision highp float;
in vec2 vWorld;
out vec4 outColor;
${Et}
void main() {
  int row = rowAt(vWorld.y);
  float seen = mix(wallLight(1, vWorld, row), wallLight(0, vWorld, row), uKeyMix);
  float e = wallBase(vWorld) * seen * edgeShade(vWorld, row) + haloAt(vWorld, row);
  outColor = vec4(vec3(e), 1.0);
}`,nn=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,rn=`
uniform sampler2D uBake;
uniform float uGain;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(uBake, vUv).rgb * uGain;
  gl_FragColor = vec4(c, 1.0);
  #include <colorspace_fragment>
  float n = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  gl_FragColor.rgb += (n - 0.5) / 255.0;
}`;function Xo(e,t){let a=new Be(4,4,{type:pt,format:Ho,depthBuffer:!1,minFilter:Ie,magFilter:Ie,generateMipmaps:!1}),o=new se({glslVersion:Lo,uniforms:{...t,uRegion:{value:new Z}},vertexShader:on,fragmentShader:an,depthTest:!1,depthWrite:!1}),n=new xe;n.add(new k(new oe(2,2),o));let r=new vt,i=new se({uniforms:{uBake:{value:a.texture},uGain:{value:1}},vertexShader:nn,fragmentShader:rn,toneMapped:!1}),l=new k(new oe(1,1),i);return l.renderOrder=-1,{mesh:l,resize(c,f,p,d,u,x,T=null){a.setSize(u,x),o.uniforms.uRegion.value.set(...T||[c,f,p,d]),l.scale.set(p-c,d-f,1),l.position.set((c+p)/2,(f+d)/2,0),l.updateMatrixWorld()},setGain(c){i.uniforms.uGain.value=c},bake(){let c=e.getRenderTarget();e.setRenderTarget(a),e.render(n,r),e.setRenderTarget(c)},dispose(){a.dispose(),o.dispose(),i.dispose(),l.geometry.dispose()}}}function sn(){let{width:e,depth:t,thick:a,bevel:o}=D,n=new _o;n.moveTo(0,-a),n.lineTo(t-o,-a),n.absarc(t-o,-a+o,o,-Math.PI/2,0,!1),n.lineTo(t,-o),n.absarc(t-o,-o,o,0,Math.PI/2,!1),n.lineTo(0,0),n.closePath();let r=new Go(n,{depth:e,bevelEnabled:!1,curveSegments:6});return r.applyMatrix4(new me().set(0,0,-1,e/2,0,1,0,0,1,0,0,0,0,0,0,1)),r.computeVertexNormals(),r}var ln=`
varying vec3 vPos;
varying vec3 vNormal;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vPos = w.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,cn=`
${Et}
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
}`;function Qo(e){let t=sn();return D.tops.map((a,o)=>{let n=new se({uniforms:{...e,uRow:{value:o}},vertexShader:ln,fragmentShader:cn,toneMapped:!1}),r=new k(t,n);return r.position.set(0,a,0),r.updateMatrixWorld(),r})}var Jo=`
vec3 njNeutral(vec3 c) {
  const float start = 0.76, desat = 0.15;
  float x = min(c.r, min(c.g, c.b));
  c -= x < 0.08 ? x - 6.25 * x * x : 0.04;
  float peak = max(c.r, max(c.g, c.b));
  if (peak < start) return c;
  float d = 1.0 - start, np = 1.0 - d * d / (peak + d - start);
  c *= np / peak;
  return mix(c, vec3(np), 1.0 - 1.0 / (desat * (peak - np) + 1.0));
}`;var X=h.size,bt=X*Math.sin(h.lean),ra={dx:0,yaw:0,opacity:1},N=()=>({...ra,lift:0,z:bt,lean:h.lean}),Ge=()=>({...ra,lift:h.hoverLift,z:h.hoverZ,lean:0}),Dt=["lift","z","lean","dx","yaw"],fn="#d9d6d0";function je(e,t=null,a=null){return e.onBeforeCompile=o=>{if(o.fragmentShader=o.fragmentShader.replace("void main() {",`${Jo}
${t?`uniform float uMapBias;
`:""}${a?`uniform sampler2D uThumb;
uniform float uFade;
`:""}void main() {`).replace("#include <tonemapping_fragment>","gl_FragColor.rgb = njNeutral(gl_FragColor.rgb);"),t){o.uniforms.uMapBias=t;let n=a?"mix( texture2D( uThumb, vMapUv, uMapBias ), texture2D( map, vMapUv, uMapBias ), uFade )":"texture2D( map, vMapUv, uMapBias )";a&&Object.assign(o.uniforms,a),o.fragmentShader=o.fragmentShader.replace("#include <map_fragment>",Uo.map_fragment.replace("texture2D( map, vMapUv )",n))}},e.customProgramCacheKey=()=>t?a?"nj-neutral-bias-fade":"nj-neutral-bias":"nj-neutral",e}var sa=new yt(new Uint8Array([255,255,255,255]),1,1);sa.needsUpdate=!0;var Ke={value:0};function ia(e){let t=new xt(X,X,h.thick);return t.translate(0,X/2,h.thick/2),e.map((a,o)=>{let n=je(new ue({color:15855594,roughness:.8})),r=o%h.cols,i=Math.floor(o/h.cols),l=Math.min(h.cols,e.length-i*h.cols),c={uThumb:{value:sa},uFade:{value:1}},f=je(new ue({color:new mt(a.accent?.light||fn),roughness:.8}),Ke,c),p=je(new ue({color:15328992,roughness:.7})),d=[n,n,n,n,f,p],u=new k(t,d);u.matrixAutoUpdate=!1;let x={i:o,row:i,col:r,mesh:u,front:f,back:p,mats:d,entry:a,fade:c,thumb:null,hasCover:!1,x:(r-(l-1)/2)*h.pitch,shelfY:D.tops[i],pose:{...N(),opacity:0}};return ye(x),x})}var ea=new zo,un=new U(1,0,0),ta=new U,dn=new U(1,1,1),Me=new U,oa=new me,aa=new me,na=new me;function ye(e){let t=e.pose;ta.set(e.x+t.dx,e.shelfY+t.lift,t.z),ea.setFromAxisAngle(un,-t.lean),e.mesh.matrix.compose(ta,ea,dn),t.yaw&&(Me.set(0,X/2,h.thick/2).applyMatrix4(e.mesh.matrix),aa.makeTranslation(Me.x,Me.y,Me.z),na.makeTranslation(-Me.x,-Me.y,-Me.z),oa.makeRotationY(t.yaw),e.mesh.matrix.premultiply(na).premultiply(oa).premultiply(aa)),e.mesh.matrixWorld.copy(e.mesh.matrix),e.mesh.visible=t.opacity>.001;let a=t.opacity<.999;for(let o of[e.front,e.back,e.mats[0]])o.transparent!==a&&(o.transparent=a,o.needsUpdate=!0),o.opacity=t.opacity}function la(e,t,a=!1){for(let o of e){let n=o.pose,r=Math.cos(n.lean),i=Math.sin(n.lean),l=o.shelfY+n.lift,c=h.thick/2,f=o.x+n.dx,p=ht.smoothstep(n.z,110,260),d=o.mesh.visible&&!a?n.opacity*(1-p):0,u=(o.row*h.cols+o.col)*2;for(let x=0;x<2;x++){let T=x/2,O=(x+1)/2;d>0?t.uSlab.value[u+x].set(f-X/2,l+X*T*r,f+X/2,l+X*O*r):t.uSlab.value[u+x].set(0,0,0,0),t.uSlabZ.value[u+x]=Math.max(1.5,n.z-X*(T+O)/2*i+c),t.uSlabA.value[u+x]=d}t.uFoot.value[o.i].set(f-X/2,f+X/2,n.z+h.thick,d>0?n.lift:1e3)}}function ca(e,t){e.thumb=t,!e.hasCover&&(e.front.map=t,e.front.color.set(16777215),e.front.needsUpdate=!0)}function _t(e,t,a){let o=!1;return t&&(o=!e.hasCover&&!!e.thumb&&e.front.map===e.thumb,o&&(e.fade.uThumb.value=e.thumb,e.fade.uFade.value=0),e.hasCover=!0,e.front.map=t,e.front.color.set(16777215),e.front.needsUpdate=!0),a&&(e.back.map=a,e.back.color.set(16777215),e.back.needsUpdate=!0),o}var fa=15,St=e=>e*e,Mt=(e,t,a)=>{let o={...t};for(let n of Dt)o[n]=e[n]+(t[n]-e[n])*a;return o.opacity=e.opacity+(t.opacity-e.opacity)*a,o};function ua(e){let t=z.appear.at+z.appear.stagger*e,a=z.drop.at+z.drop.stagger*e,o=a+z.drop.dur,n=o+z.lean.delay;return{appear:t,drop:a,land:o,lean:n,rest:n+z.lean.dur}}var Gt=e=>pe()?200+40*e:ua(e).appear;function da(e,t){if(pe()){let l=Gt(e);return t>=l+160?null:{...N(),opacity:F((t-l)/160)}}let a=ua(e);if(t>=a.rest)return null;if(t<a.appear)return{...N(),opacity:0};let o=z.appearPose,n=1-.345*Math.exp(-(t-a.appear)/150),r={...N(),lift:o.lift,z:o.z,lean:0,opacity:n};if(t<a.drop)return r;if(t<a.land){let l=St(F((t-a.drop)/z.drop.dur));return{...r,lift:o.lift*(1-l),z:o.z+(bt-o.z)*l}}let i=St(F((t-a.lean)/z.lean.dur));return{...r,lift:0,z:bt,lean:h.lean*i}}function pa(e,t){let a=Ge(),o=1-Math.exp(-t/(pe()?.04:h.hoverTau)),n=!1;for(let r of Dt){let i=a[r]-e.pose[r];Math.abs(i)>.001?(e.pose[r]+=i*o,n=!0):e.pose[r]=a[r]}return e.pose.opacity=1,n}function ha(e,t){let a=pe()?{delay:0,drop:90,pause:0,lean:60}:No,o=N();if(t<a.delay)return{...e};let n=t-a.delay,r={...o,lean:Math.min(e.lean,o.lean)};if(n<a.drop)return Mt(e,r,St(n/a.drop));let i=n-a.drop-a.pause;return i<0?r:i<a.lean?Mt(r,o,St(i/a.lean)):null}var ma=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,pn=`
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
}`,hn=`
uniform sampler2D uSharp;
uniform sampler2D uBlur;
uniform float uMix;
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(mix(texture2D(uSharp, vUv).rgb, texture2D(uBlur, vUv).rgb, uMix), 1.0);
  #include <colorspace_fragment>
}`;function xa(e){let t=new Be(4,4,{samples:4,colorSpace:re}),a={type:pt,depthBuffer:!1,minFilter:Ie,magFilter:Ie},o=new Be(4,4,a),n=new Be(4,4,a),r=new se({uniforms:{uTex:{value:null},uDir:{value:new fe},uSigma:{value:0}},vertexShader:ma,fragmentShader:pn,depthTest:!1,depthWrite:!1}),i=new se({uniforms:{uSharp:{value:t.texture},uBlur:{value:o.texture},uMix:{value:0}},vertexShader:ma,fragmentShader:hn,depthTest:!1,depthWrite:!1}),l=new k(new oe(2,2),r);l.frustumCulled=!1;let c=new xe;c.add(l);let f=new vt,p=.5,d=(u,x)=>{l.material=u,e.setRenderTarget(x),e.render(c,f)};return{resize(u,x){t.setSize(u,x),o.setSize(Math.ceil(u/2),Math.ceil(x/2)),n.setSize(Math.ceil(u/2),Math.ceil(x/2)),p=e.getPixelRatio()/2},background(u,x,T){let O=e.getRenderTarget();e.setRenderTarget(t),e.clear(),e.render(u,x);let I=T*p;r.uniforms.uSigma.value=I,r.uniforms.uTex.value=t.texture,r.uniforms.uDir.value.set(1/o.width,0),d(r,n),r.uniforms.uTex.value=n.texture,r.uniforms.uDir.value.set(0,1/o.height),d(r,o),e.setRenderTarget(O)},composite(u){i.uniforms.uMix.value=u,d(i,null)},dispose(){t.dispose(),o.dispose(),n.dispose(),r.dispose(),i.dispose()}}}var Vt=h.size,va=.255*Vt,$t={x:.3245*Vt,y:.8255*Vt,z:h.thick+.25};function mn(e){let a=document.createElement("canvas");a.width=a.height=512;let o=a.getContext("2d"),n=512/2,r=512*.44,i=11;o.beginPath();for(let d=0;d<=720;d++){let u=d/720*Math.PI*2,x=r*(1+.065*Math.cos(i*u));o.lineTo(n+x*Math.cos(u),n+x*Math.sin(u))}o.closePath(),o.save(),o.clip();let l=o.createConicGradient?o.createConicGradient(.6,n,n):o.createLinearGradient(0,0,512,512);["#ffa6e6","#9af2dc","#c4b2ff","#ffe596","#9fd6ff","#ffb8dc","#ffa6e6"].forEach((d,u,x)=>l.addColorStop(u/(x.length-1),d)),o.fillStyle=l,o.fillRect(0,0,512,512),[[.3,.3,"#9af2dc"],[.7,.62,"#ffa6e6"],[.42,.72,"#ffe596"],[.68,.28,"#c4b2ff"],[.25,.58,"#ffb8dc"]].forEach(([d,u,x])=>{let T=o.createRadialGradient(d*512,u*512,0,d*512,u*512,102.4);T.addColorStop(0,x+"cc"),T.addColorStop(1,x+"00"),o.fillStyle=T,o.fillRect(0,0,512,512)});let c=o.createRadialGradient(n*.8,n*.7,0,n*.8,n*.7,512*.55);c.addColorStop(0,"rgba(255,255,255,0.75)"),c.addColorStop(1,"rgba(255,255,255,0)"),o.fillStyle=c,o.fillRect(0,0,512,512),o.restore(),o.translate(n,n),o.rotate(12*Math.PI/180),o.fillStyle="#000",o.textAlign="center",o.textBaseline="alphabetic",o.font=`800 ${512*.15}px 'NJ Text', system-ui, sans-serif`;let f=512*.15;e.forEach((d,u)=>o.fillText(d,0,(u-(e.length-1)/2)*f+512*.055));let p=new Do(a);return p.colorSpace=re,p.anisotropy=4,p}var ya=new mt().setRGB(1,.96,1);function ga(e){let t=mn(e.toUpperCase().split(" ")),a=je(new ue({map:t,emissiveMap:t,color:ya,emissive:ya,emissiveIntensity:.5,transparent:!0,roughness:.8,metalness:0,depthWrite:!1}),Ke),o=new k(new oe(va,va),a);o.matrixAutoUpdate=!1,o.visible=!1,o.renderOrder=1;let n=new me().makeTranslation($t.x,$t.y,$t.z);return{mesh:o,place(r,i){o.visible=i>.002&&r.mesh.visible,o.visible&&(a.opacity=i,o.matrix.multiplyMatrices(r.mesh.matrix,n),o.matrixWorld.copy(o.matrix))}}}var w={width:.682,bottom:.797,lean:56*Math.PI/180,strip:.124,top:132,flatLean:78*Math.PI/180,flatStrip:.07,flatMax:4,drag:150,carry:.06,omega:8.5,details:{size:.815,centreY:.404},wheelNotch:60,groundGain:.838,edgeColour:1842204,shadow:{y0:.403,y1:.794,alpha:.054,feather:20}};function wa(){let e=new se({uniforms:{uSize:{value:new fe(1,1)},uFeather:{value:1},uAlpha:{value:w.shadow.alpha}},vertexShader:"varying vec2 vP; uniform vec2 uSize; void main() { vP = uv * uSize; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`varying vec2 vP; uniform vec2 uSize; uniform float uFeather, uAlpha;
      void main() { float d = min(vP.y, uSize.y - vP.y);   // soft top and bottom; it runs off the left edge and under the crate
        gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha * smoothstep(0.0, uFeather, d)); }`,transparent:!0,depthWrite:!1,toneMapped:!1}),t=new k(new oe(1,1),e);return t.renderOrder=-.5,t.visible=!1,{mesh:t,setOpacity(a){e.uniforms.uAlpha.value=w.shadow.alpha*a},layout(a,o,n){let r=-a/2/n-2,i=0,l=(o/2-w.shadow.y1*o)/n,c=(o/2-w.shadow.y0*o)/n;t.scale.set(i-r,c-l,1),t.position.set((r+i)/2,(l+c)/2,.5),t.updateMatrixWorld(),e.uniforms.uSize.value.set(i-r,c-l),e.uniforms.uFeather.value=w.shadow.feather/n}}}function Ea(e){let t=h.size,a=0,o=0,n=0,r=null,i=0,l=!1,c=0,f=0,p=0,d=0,u=0,x=1,T=y=>Math.max(0,Math.min(e-1,y));function O(y,E,b){let B=w.width*y/t;c=(E/2-w.bottom*E)/B;let K=w.bottom*E-t*B*Math.cos(w.lean);return f=Math.min(w.strip*t,e>1?Math.max(0,K-w.top)/(e-1)/B:0),p=f*Math.tan(w.lean)+4,d=w.flatStrip*t,u=(e-1)*p+t*Math.sin(w.lean)+10,x=B*(b-u)/b,x}let I=y=>d*w.flatMax*(1-Math.exp(-y/w.flatMax));function q(y){let E=y.i-a,b=N();if(b.dx=-y.x,E>=0)b.lean=w.lean,b.lift=c+E*f-y.shelfY,b.z=u-E*p;else{let B=-E,K=Math.min(1,B);b.lean=w.lean+(w.flatLean-w.lean)*K,b.lift=c-I(B)-y.shelfY,b.z=u+.8*t*K+5*Math.max(0,I(B)-I(1))}return b}function Fe(y){if(r)return!0;let E=l?30:w.omega,b=E*E*(n-a)-2*E*o;return o+=b*y,a+=o*y,Math.abs(n-a)<.001&&Math.abs(o)<.01?(a=n,o=0,!1):!0}return{layout:O,pose:q,step:Fe,get p(){return a},get current(){return T(Math.round(r?a:n))},get dragging(){return!!r},setReduced(y){l=!!y},go(y){n=T(y)},jump(y){n=a=T(y),o=0},begin(y,E){r={y0:y,p0:a,samples:[[E,y]]},o=0},move(y,E){if(!r)return;let b=r.p0+(y-r.y0)/w.drag;for(b<0?b/=3:b>e-1&&(b=e-1+(b-e+1)/3),a=b,r.samples.push([E,y]);r.samples.length>2&&E-r.samples[0][0]>100;)r.samples.shift()},end(y){if(!r)return 0;let E=r.samples,b=E[0],B=E[E.length-1],K=Math.abs(B[1]-r.y0),ut=B[0]-b[0]>8&&y-B[0]<80?(B[1]-b[1])/(B[0]-b[0])*1e3:0;return r=null,o=Math.max(-12,Math.min(12,ut/w.drag)),n=T(Math.round(a+(l?0:o*w.carry))),l&&(o=0),K},cancel(){r&&(r=null,n=T(Math.round(a)))},wheel(y){for(i+=y;Math.abs(i)>=w.wheelNotch;){let E=Math.sign(i);n=T(n+E),i-=E*w.wheelNotch}}}}var Ot=16/9,xn=500;function ba({camera:e,layer:t,wake:a,dur:o,els:n}){let{frame:r,video:i,play:l,close:c,shade:f}=n,p=new Bo(i);p.colorSpace=re;let d=new Po({map:p,transparent:!0,opacity:0,toneMapped:!1,depthWrite:!1}),u=new k(new oe(1,1),d);u.rotation.y=Math.PI,u.layers.set(t),u.visible=!1;let x=h.size,T=new U,O=!1,I=!1,q=null,Fe=!1,y=0;for(let S of["loadeddata","seeked"])i.addEventListener(S,()=>{p.needsUpdate=!0,a()});let E=()=>{clearTimeout(y),O&&!Fe&&(Fe=!0,i.play().then(a,()=>{}))},b=(S,M)=>(T.set(S,M,0),u.localToWorld(T),T.project(e),[(T.x+1)/2*innerWidth,(1-T.y)/2*innerHeight]),B=()=>{let[S,M]=b(-.5,.5),[Y,Ne]=b(.5,-.5);return{left:Math.min(S,Y),top:Math.min(M,Ne),width:Math.abs(Y-S),height:Math.abs(Ne-M)}},K=S=>({left:`${S.left}px`,top:`${S.top}px`,width:`${S.width}px`,height:`${S.height}px`}),ut=()=>{let S=Math.min(innerWidth*.92,innerHeight*.86*Ot),M=S/Ot;return{left:(innerWidth-S)/2,top:(innerHeight-M)/2,width:S,height:M}},Ro=(S,M,Y)=>(Object.assign(r.style,K(M)),r.animate([K(S),K(M)],{duration:o(Y),easing:"cubic-bezier(0.3, 0, 0.15, 1)"}).finished.catch(()=>{}));function Ja(){!O||I||!q||(I=!0,l.hidden=!0,r.classList.add("on"),f.classList.add("on"),c.hidden=!1,i.muted=!1,E(),Ro(q,ut(),560).then(()=>{I&&(i.controls=!0,c.focus({preventScroll:!0}))}))}function dt(S=!1){if(!I)return;I=!1,i.controls=!1,i.muted=!0,f.classList.remove("on"),c.hidden=!0;let M=()=>{I||(r.classList.remove("on"),O&&(l.hidden=!1))};if(S||!q){for(let Y of r.getAnimations())Y.cancel();M();return}Ro(r.getBoundingClientRect(),q,420).then(M)}return l.addEventListener("click",Ja),c.addEventListener("click",()=>dt()),f.addEventListener("click",()=>dt()),addEventListener("resize",()=>{I&&Object.assign(r.style,K(ut()))}),{get zoomed(){return I},unzoom:dt,attach(S){let M=S.entry.video;if(!M)return!1;let Y=M.band;u.scale.set(x,x*Y,1),u.position.set(0,x-x*Y/2,-x*.002);let Ne=Y*Ot;return p.repeat.set(1,Ne),p.offset.set(0,(1-Ne)/2),S.mesh.add(u),i.getAttribute("src")!==M.src&&(i.poster=M.poster,i.src=M.src),i.muted=!0,i.pause(),i.currentTime=M.start||0,O=!0,Fe=!1,!0},detach(){O&&(dt(!0),O=!1,q=null,clearTimeout(y),i.pause(),u.removeFromParent(),u.visible=!1,d.opacity=0,l.hidden=!0)},update(S,M){if(!O)return!1;if(d.opacity=S,u.visible=S>0,M&&!I){u.parent.updateMatrixWorld(),u.updateMatrixWorld(),q=B();let Y={x:q.left+q.width/2,y:q.top+q.height/2};l.style.left=`${Y.x}px`,l.style.top=`${Y.y}px`,r.classList.contains("on")||Object.assign(r.style,K(q))}return M&&!Fe&&!y&&(y=setTimeout(()=>{y=0,E()},xn)),I||(l.hidden=!M),u.visible&&!i.paused&&a(),u.visible}}}var G=Yo,te=document.getElementById("c"),P=new qo({canvas:te,antialias:!0,powerPreference:"high-performance"});P.outputColorSpace=re;P.toneMapping=ko;var j=new xe,Ga=new Wo(P);j.environment=Ga.fromScene(new wt,.04).texture;j.environmentIntensity=.46;Ga.dispose();var Ee=Ko();Zo(Ee);D.tops.forEach((e,t)=>Ee.uShelf.value[t].set(-D.width/2,D.width/2,e-D.thick,e));Ee.uShelfDepth.value=D.depth;var kt=Xo(P,Ee);j.add(kt.mesh);var $a=Qo(Ee);for(let e of $a)j.add(e);var m=ia(G);Ke.value=window.__editionsTest?.coverBias??-.5;var ke=new yt(new Uint8Array([255,255,255,255]),1,1);ke.colorSpace=re;ke.needsUpdate=!0;for(let e of m)e.front.map=ke,e.back.map=ke,j.add(e.mesh);var et=1,Rt=m.find(e=>e.entry.newest)||null,Va=!1,tt=ga("Now playing");j.add(tt.mesh);var ot=xa(P),V=2556,H=new Fo(20,1,100,V*2),He=ba({camera:H,layer:et,wake:()=>C(),dur:R,els:{frame:document.getElementById("film-frame"),video:document.querySelector("#film-frame video"),play:document.getElementById("d-play"),close:document.getElementById("d-close"),shade:document.getElementById("film-shade")}});H.position.set(0,0,V);var g=Ea(m.length),Ht=wa();j.add(Ht.mesh);var be=m.map(()=>null),Oa=m.map(()=>null),Zt=m.map(()=>null),Xt=m.map(()=>null),yn=320,Xe=[],gn=1,Ua=null,Wa=new Promise(e=>requestAnimationFrame(()=>requestAnimationFrame(e))).then(()=>import("./covers-ZSARYGHH.js")).then(e=>Ua=e),wn=(e,t,a)=>Wa.then(o=>o.createCover(P,e.entry,t,a)),Qt=()=>Lt===null?0:performance.now()-Lt,Sa=window.__editionsTest?.coverLate||{},En=0;function qa(){let e=En++;if(e>=m.length)return Promise.resolve();let t=m[e],a=()=>{Zt[e]=Qt(),Oa[e]=Lt===null?null:Math.round(Zt[e]),C()};return wn(t,e,{size:1024,backSize:0}).then(o=>{let n=()=>{be[e]=o,_t(t,o.front,null)&&Xe.push({s:t,at:performance.now()}),a()};Sa[e]==null?n():setTimeout(n,Math.max(0,eo(e)+Sa[e]-Qt()))},o=>{console.warn(`cover ${t.entry.name}: flat sleeve (${o?.message||o})`),a()}).then(qa)}var bn=Wa.then(()=>Promise.all(Array.from({length:gn},qa))),Sn=new Vo;for(let e of m)Sn.load(new URL(`./covers/thumbs/${de(e.entry)}.webp`,new URL("../main.js",import.meta.url).href).href,t=>{t.colorSpace=re,t.anisotropy=P.capabilities.getMaxAnisotropy(),ca(e,t),Xt[e.i]=Qt(),C()},void 0,()=>{});function Mn(e){let t=m[e],a=be[e]?.detailBack(1024).then(o=>{s&&s.i===e&&(t.back.map=o||ke,t.back.color.set(o?16777215:Ya),t.back.needsUpdate=!0,C())}).catch(o=>console.warn(`cover ${t.entry.name}: no Details back (${o?.message||o})`));Promise.resolve(a).then(()=>{s&&s.i===e&&s.backIn===null&&(s.backIn=performance.now())})}var Jt=!1;function Rn(){if(Jt||!be[0]||he.some(t=>!t))return;Jt=!0;let e=window.requestIdleCallback||(t=>setTimeout(t,200));e(()=>{s||be[0].detailBack(1024).catch(()=>{}),e(()=>Eo().then(t=>t.warm()).catch(t=>console.warn(`page warm-up: ${t?.message||t}`)),{timeout:3e3})},{timeout:2e3})}var Ya=15328992,Ma=600,ge=m.map(()=>null),Ra=m.map(()=>0),eo=e=>v?A(z.appear.at+z.appear.stagger*e):Gt(e);function Tn(e,t){if(ge[e]===null){if(e>0&&ge[e-1]===null)return null;let a=eo(e),o=e>0?Math.max(a,ge[e-1]+a-eo(e-1)):a,r=Zt[e]??Xt[e]??(t>=a+Ma?a+Ma:null);if(r===null||t<Math.max(o,r))return null;ge[e]=Math.max(o,r),Ra[e]=ge[e]-a,!be[e]&&Xt[e]===null&&kn(m[e])}return Ra[e]}function kn(e){let t=Ua?.coverGround?.(e.entry,e.i)||e.entry.accent?.light;t&&e.front.color.set(t)}function Hn(e){e.back.map!==ke&&(e.back.map=ke,e.back.color.set(Ya),e.back.needsUpdate=!0)}var Qe=-1,Na=0;function Ln(e){e!==Qe&&(Qe>=0&&(be[Qe]?.setAlive(!1),Na=performance.now()+1700),Qe=e,e>=0&&be[e]?.setAlive(!0))}var ce=null,Ut=null,to=document.querySelector(".sound");function io(){let e=!!ce?.enabled;to.setAttribute("aria-pressed",String(e)),to.setAttribute("aria-label",e?"Sound on":"Sound off")}function lo(){return Ut||(Ut=import("./audio-3KD7PEEU.js").then(e=>(ce=e.createAudio(),ce.setRoomTone(!0),io(),ce))),Ut}var ne=(e,t)=>{window.__editions?.soundLog?.push([e,Math.round(performance.now())]),ce?.play(e,t)},Le=e=>Math.max(-1,Math.min(1,m[e].x/600));for(let e of["pointermove","pointerdown","keydown","touchstart"])window.addEventListener(e,lo,{once:!0,capture:!0,passive:!0});var ja=()=>{ce?ce.unlock():lo().then(e=>e.unlock())};window.addEventListener("pointerdown",ja,{once:!0,capture:!0});window.addEventListener("keydown",ja,{once:!0,capture:!0});to.addEventListener("click",async()=>{let e=ce||await lo();e.setEnabled(!e.enabled),io()});io();var lt=document.getElementById("slots"),Ue=m.map(e=>{let t=G[e.i],a=document.createElement("li");a.className="slot";let o=document.createElement("article");o.setAttribute("aria-labelledby",`sl-${e.i}`);let n=document.createElement("h2");if(n.className="sr",n.id=`sl-${e.i}`,n.textContent=t.name,o.appendChild(n),t.tag){let l=document.createElement("p");l.className="sr",l.textContent=t.year?`${t.tag}, ${t.year}`:t.tag,o.appendChild(l)}let r=document.createElement("a");r.dataset.action="open",r.textContent="Open",co(r,e.i);let i=document.createElement("button");return i.type="button",i.dataset.action="details",i.dataset.index=String(e.i),i.textContent="Details",i.setAttribute("aria-label",`Details: ${t.name}`),o.append(r,i),a.appendChild(o),lt.appendChild(a),a});function co(e,t){let a=G[t];e.dataset.index=String(t),e.href=a.url||`#${de(a)}`,a.url?(e.target="_blank",e.rel="noopener"):(e.removeAttribute("target"),e.removeAttribute("rel")),e.setAttribute("aria-label",a.url?`Open: ${a.name} site, new tab`:`Open: ${a.name}`)}var ct=document.getElementById("crate-bar"),zn=ct.querySelector(".cb-year"),An=ct.querySelector(".cb-name"),Ta=ct.querySelector(".cb-details"),Cn=ct.querySelector(".cb-open"),Wt=document.querySelector(".crate-rail span"),ka=document.getElementById("announce");function ft(e){ka.textContent="",requestAnimationFrame(()=>{ka.textContent=e})}document.getElementById("index").append(...G.map(e=>{let t=document.createElement("li"),a=document.createElement("span");a.className="y",a.textContent=e.year||"";let o=document.createElement("span");return o.className="n",o.textContent=e.name,t.append(a,o),t}));var Ft=document.querySelector(".tagline"),We=document.getElementById("details"),at=We.querySelector(".d-title"),nt=We.querySelector(".d-tag"),we=document.getElementById("d-open");function Ve(e,t,a,o){let n=+getComputedStyle(e).opacity;for(let r of e.getAnimations())r.cancel();e.animate([{opacity:n},{opacity:t}],{duration:R(o),delay:A(a),easing:"ease",fill:"both"})}var $=0,_=0,ae=1,v=!1,oo=0,ao=0,no=0,Ka=0,$e=0,Pn=14,qt=new fe;function fo(){$=window.innerWidth,_=window.innerHeight;let e=v;v=$<600,V=v?2556*4:2556,ae=v?g.layout($,_,V):Bt($,_),H.position.z=V,H.far=V*2;let t=$/2/ae,a=_/2/ae;if(H.fov=ht.radToDeg(2*Math.atan(a/V)),H.aspect=$/_,H.clearViewOffset(),H.updateMatrixWorld(),$e=0,!v){let c=N(),f=h.size,p=ze(0,D.tops[0]+f*Math.cos(c.lean),c.z-f*Math.sin(c.lean)+h.thick).y;$e=Math.max(0,Math.round(Ft.getBoundingClientRect().bottom+Pn-p)),$e&&H.setViewOffset($,_,0,-$e,$,_)}P.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),P.setSize($,_,!1),P.getDrawingBufferSize(qt),ot.resize(qt.x,qt.y);let o=v?Bt($,_):ae,n=$/2/o*1.02,r=_/2/o*1.02,i=$e/ae;kt.resize(-t*1.02,-a*1.02+i,t*1.02,a*1.02+i,Math.ceil($/2),Math.ceil(_/2),v?[-n,-r,n,r]:null),Oe=le=!0,oo=v?w.details.size*$:L.size*ae,ao=v?w.details.centreY*_:_/2-(900/2-L.centreY)*ae,no=V*(1-h.size*ae/oo),Ka=(_/2+$e-ao)/ae*(V-no)/V;let l=v||!!window.__editionsTest?.noShelves;for(let c of $a)c.visible=!l;kt.setGain(v?w.groundGain:1),Ht.mesh.visible=v,v&&Ht.layout($,_,ae);for(let c of m)c.mats[0].color.set(v?w.edgeColour:15855594);if(D.tops.forEach((c,f)=>l?Ee.uShelf.value[f].set(0,0,-1e5,-1e5):Ee.uShelf.value[f].set(-D.width/2,D.width/2,c-D.thick,c)),document.body.classList.toggle("crate",v),v!==e){s&&So(),Pe(-1);for(let c of m)he[c.i]&&(c.fall=null,c.pose=ro(c),ye(c));Ye(!0)}else if(v)for(let c of m)he[c.i]&&!(s&&s.i===c.i)&&(c.pose=ro(c),ye(c));Za=m.map(c=>Fn(c)),v||m.forEach(ho),Bn(),C()}var ro=e=>v?g.pose(e):N(),Yt=new U,Re=new Ao;function ze(e,t,a){return Yt.set(e,t,a).project(H),{x:(Yt.x+1)/2*$,y:(1-Yt.y)/2*_}}function uo(e){let t=m[e].mesh;t.geometry.boundingBox||t.geometry.computeBoundingBox(),Re.copy(t.geometry.boundingBox).applyMatrix4(t.matrixWorld);let a=1/0,o=1/0,n=-1/0,r=-1/0;for(let i of[Re.min.x,Re.max.x])for(let l of[Re.min.y,Re.max.y])for(let c of[Re.min.z,Re.max.z]){let f=ze(i,l,c);a=Math.min(a,f.x),n=Math.max(n,f.x),o=Math.min(o,f.y),r=Math.max(r,f.y)}return{x:a,y:o,width:n-a,height:r-o}}var Za=[];function Fn(e){let t=h.size,a=e.shelfY,o=ze(e.x-t/2,a+h.hoverLift+t,h.hoverZ),n=ze(e.x+t/2,a,0);return{x0:o.x,y0:o.y,x1:n.x,y1:n.y}}function po(e,t){let a=-1;return Za.forEach((o,n)=>{he[n]&&e>=o.x0&&e<=o.x1&&t>=o.y0&&t<=o.y1&&(a=n)}),a}var Q=new U,Je=e=>{let t=P.getPixelRatio();return Math.round(e*t)/t};function ho(e){Q.set(-h.size/2,0,h.thick).applyMatrix4(e.mesh.matrixWorld);let t=ze(Q.x,Q.y,Q.z);Q.set(h.size/2,0,h.thick).applyMatrix4(e.mesh.matrixWorld);let o=ze(Q.x,Q.y,Q.z).x-t.x;Ue[e.i].style.transform=`translate3d(${Je(t.x+o*.1175)}px, ${Je(t.y-o*.025-35)}px, 0)`}function In(e){return{...N(),lean:0,dx:-e.x,lift:Ka-h.size/2-e.shelfY,z:no-h.thick/2}}function Bn(){let e=ao;at.style.top=`${Je(e-54.2)}px`,nt.style.top=`${Je(e-13.6)}px`,we.style.top=`${Je(e+oo/2+16)}px`}var rt=0,Ze=0,Oe=!0,le=!0,Lt=null,zt=null,Ae=-1,W=-1,At=0,s=null,Ha=-1,La=!1,he=m.map(()=>!1),ee={x:-1,y:-1},qe={};qe.ready=new Promise(e=>{qe.resolve=e});var Ar=qe.ready;function C(){rt||(rt=requestAnimationFrame($n))}function za(e,t){let a=h.size,o=h.thick;return{x:e.x+t.dx,y:e.shelfY+t.lift+a/2*Math.cos(t.lean),z:t.z-a/2*Math.sin(t.lean)+o/2}}function Aa(e,t,a,o){let n=Mt(t,a,o),r=h.size,i=za(e,t),l=za(e,a),c=V/(V-i.z),f=V/(V-l.z),p=c+(f-c)*o,d=(i.x*c+(l.x*f-i.x*c)*o)/p,u=(i.y*c+(l.y*f-i.y*c)*o)/p;return n.dx=d-e.x,n.lift=u-e.shelfY-r/2*Math.cos(n.lean),n.z=V*(1-1/p)+r/2*Math.sin(n.lean)-h.thick/2,n}var Dn=e=>1-(1-e)**3,Nt=e=>e*e*(3-2*e),Ca=Math.PI*2,Xa=.1,_n=450,jt=e=>pe()?e>=0?1:0:Se(L.flip.ease,F(e/R(L.flip.dur))),Pa=()=>A(L.fly.at)+R(L.fly.dur)*(1-Xa),mo=e=>Math.abs(Math.round(e/Math.PI))%2===1;function Gn(e,t){let a=L.fly,o=L.exit,n=L.flip,r=()=>s.flip.from+(s.flip.to-s.flip.from)*Se(n.ease,F((t-s.flip.t0-A(n.at))/R(n.dur))),i,l;if(s.exit){let c=s.exit,f=t-c.t0,p=f-c.lag,d=Se(o.ease,F((p-A(o.at))/R(o.dur)));if(i=Aa(e,c.from,{...v?g.pose(e):Ge(),yaw:c.yawTo},d),i.yaw=c.from.yaw+(c.yawTo-c.from.yaw)*(c.lag?jt(f):1),s.blur=c.blur*(1-Nt(F((p-A(o.blurOut.at))/R(o.blurOut.dur)))),l=p<A(o.at)+R(o.dur)||s.blur>0,s.film=[c.lag?1-jt(f):0,!1],!l)return He.detach(),Qa(e,t),!0}else{s.backIn===null&&t-s.asked<L.backWait&&t-s.t0>A(a.at)&&(s.t0=t-A(a.at));let c=t-s.t0,f=Se(a.ease,F((c-A(a.at))/R(a.dur)));i=Aa(e,s.from,In(e),f),i.yaw=s.turn*jt(c-Pa())+r(),s.blur=v?0:Nt(F((c-A(L.blur.at))/R(L.blur.dur)));let p=Pa()+R(n.dur),d=m[s.i].entry.video?R(_n):0,u=Math.max(p+d,...[a,L.blur,L.title].map(x=>A(x.at)+R(x.dur)));l=c<u||t-s.flip.t0<A(n.at)+R(n.dur),s.film=[d?Nt(F((c-p)/d)):0,!l&&mo(i.yaw)]}return e.pose=i,l}var Ct=!1;te.addEventListener("webglcontextlost",e=>{e.preventDefault(),!Ct&&(Ct=!0,rt&&cancelAnimationFrame(rt),s&&So(),wo?.close(),import("./fallback.js").then(t=>t.start(G)))});function $n(e){if(rt=0,Ct)return;if(J>=0){Ze=0;return}let t=Ze?Math.min(.05,(e-Ze)/1e3):0;Ze=e;let a=!1,o=zt===null?-1:e-zt,n=La,r=v&&g.step(t);La=r,r?Ye():n&&v&&(Ye(),Un());let i=s||v?-1:Ae;W!==i&&(s||e-At>=A(fa))&&(W>=0&&!(s&&s.i===W)&&(m[W].fall={from:{...m[W].pose},t0:At}),W=i,W>=0&&(m[W].fall=null)),Ln(s?Math.cos(m[s.i].pose.yaw)>0?s.i:-1:W);let l=W!==i;for(let f of m){let p=!1;if(s&&f.i===s.i)p=Gn(f,e);else if(he[f.i]){if(v)r&&(f.pose=g.pose(f),p=!0);else if(W===f.i)p=pa(f,t);else if(f.fall){let d=ha(f.fall.from,e-f.fall.t0);d?f.pose=d:(f.pose=N(),f.fall=null),p=!0}}else if(o>=0){let d=Tn(f.i,o);if(d!==null){let u=v?On(f,o-d):da(f.i,o-d);u?f.pose=u:(f.pose=ro(f),he[f.i]=!0)}p=!0}if(p){ye(f),v||ho(f);let d=!v&&f.pose.z<270;(d||f.shaded)&&(Oe=!0),f.shaded=d,(!s||f.i!==s.i)&&(le=!0),a=!0}}Oe&&(la(m,Ee,v),kt.bake(),Oe=!1,le=!0),v&&Ht.setOpacity(o<0||ge[0]===null?0:F((o-ge[0])/R(600))),Rt&&(tt.mesh.layers.set(s&&s.i===Rt.i?et:0),tt.place(Rt,Va?0:Rt.pose.opacity));let c=Qe>=0||e<Na;if(c&&!window.__editionsTest?.stillCovers)for(let f of be)f?.update(t);for(let f=Xe.length-1;f>=0;f--){let p=Xe[f],d=F((performance.now()-p.at)/R(yn));p.s.fade.uFade.value=d*d*(3-2*d),(!s||s.i!==p.s.i)&&(le=!0),d>=1&&Xe.splice(f,1)}if(s){let f=m[s.i],p=L.blur.sigma*s.blur;(le||p!==Ha)&&(H.layers.set(0),ot.background(j,H,p),le=!1,Ha=p),s.film&&He.update(...s.film),ot.composite(Math.min(1,s.blur*4)),H.layers.set(et),P.autoClear=!1,P.clearDepth(),P.render(j,H),P.autoClear=!0,H.layers.set(0)}else P.render(j,H);Tt.firstFrameAt===null&&(Tt.firstFrameAt=performance.now(),Vn(Tt.firstFrameAt),qe.resolve(),a=!0),!Jt&&!a&&Rn(),a||l||c||r||Xe.length?C():Ze=0}function Fa(e){if(!CSS.supports("animation-timing-function","linear(0, 1)"))return"cubic-bezier(0.16, 1, 0.3, 1)";let t=24,a=[],o=1-Math.exp(-1/e);for(let n=0;n<=t;n++)a.push(((1-Math.exp(-(n/t)/e))/o).toFixed(4));return`linear(${a.join(", ")})`}function Vn(e){Lt=e,zt=window.__editionsTest?.noSleeves?null:e,te.animate([{opacity:0},{opacity:1}],{duration:R(z.canvasFade.dur),easing:z.canvasFade.ease,fill:"forwards"});let t=z.header,a=R(t.tau*5);document.querySelectorAll(".rise").forEach((n,r)=>n.animate([{opacity:0,transform:`translateY(${-t.rise}px)`},{opacity:1,transform:"none"}],{duration:a,delay:A(t.at+t.stagger*r),easing:Fa(.2),fill:"forwards"}));let o=z.late;document.querySelectorAll(".late").forEach(n=>n.animate([{opacity:0},{opacity:1}],{duration:R(o.tau*5),delay:A(o.at),easing:Fa(.2),fill:"forwards"}))}function st(){let e=s?-1:Ae;Ue.forEach((t,a)=>t.classList.toggle("hot",a===e)),te.style.cursor=s?xo()?"pointer":"":Ae>=0?"pointer":""}function Pe(e,t=!1){e!==Ae&&(Ae=e,At=performance.now(),st(),e>=0&&!s&&(t||ne("hover",{pan:Le(e)}),ne("lift",{pan:Le(e),intensity:.8})),C())}function xo(){if(!s)return!1;let e=uo(s.i);return ee.x>=e.x&&ee.x<=e.x+e.width&&ee.y>=e.y&&ee.y<=e.y+e.height}var Ce=-1;window.addEventListener("pointermove",e=>{if(e.pointerType==="touch"||v)return;if(ee.x=e.clientX,ee.y=e.clientY,s){st();return}let t=e.target.closest?.(".pm")?-1:po(e.clientX,e.clientY);t!==Ce&&(Ce=t,Pe(t))});document.documentElement.addEventListener("pointerleave",()=>{Ce=-1,Pe(-1)});window.addEventListener("blur",()=>{Ce=-1,Pe(-1)});window.addEventListener("resize",fo);te.addEventListener("click",e=>{if(v)return;if(ee.x=e.clientX,ee.y=e.clientY,s){if(s.exit)return;xo()?go():It();return}let t=po(e.clientX,e.clientY);t>=0&&yo(t)});function On(e,t){let a=F((t-A(z.appear.at+z.appear.stagger*e.i))/R(360));if(a>=1)return null;let o=g.pose(e);return o.opacity=a,pe()||(o.lift+=(1-Dn(a))*40/ae),o}var Ia=-1,Ba=0;function Ye(e=!1){if(!v)return;let t=m.length,a=g.current,o=G[a],n=Wt.parentElement.clientHeight-Wt.offsetHeight;Wt.style.transform=`translateY(${((1-F(g.p/Math.max(1,t-1)))*n).toFixed(1)}px)`,!(a===Ia&&!e)&&(Ia=a,zn.textContent=o.year||"",An.textContent=o.name,Ta.dataset.index=String(a),Ta.setAttribute("aria-label",`Details: ${o.name}`),co(Cn,a))}function Un(){let e=g.current;e!==Ba&&(Ba=e,ft(`${G[e].name}, ${e+1} of ${m.length}`))}function Wn(e,t){let a=Math.round(g.p),o=[];for(let n=0;n<a;n++)o.push(n);for(let n=a;n<m.length;n++)o.push(n);for(let n of o){if(!he[n])continue;let r=uo(n);if(e>=r.x&&e<=r.x+r.width&&t>=r.y&&t<=r.y+r.height)return n}return-1}var Te=null;te.addEventListener("pointerdown",e=>{!v||J>=0||!e.isPrimary||(Te={x:e.clientX,y:e.clientY,id:e.pointerId},te.setPointerCapture(e.pointerId),s||(g.begin(e.clientY,e.timeStamp),C()))});te.addEventListener("pointermove",e=>{!Te||e.pointerId!==Te.id||s||(g.move(e.clientY,e.timeStamp),Ye(),C())});var vo=e=>t=>{if(!Te||t.pointerId!==Te.id)return;let{x:a,y:o}=Te;Te=null;let n=Math.hypot(t.clientX-a,t.clientY-o);if(e){g.cancel(),C();return}if(s||g.end(t.timeStamp),C(),n>=8)return;if(ee.x=t.clientX,ee.y=t.clientY,s){if(s.exit)return;xo()?go():It();return}let r=Wn(t.clientX,t.clientY);r<0||(r===g.current&&Math.abs(g.p-r)<.05?yo(r):(g.go(r),ne("tick")))};te.addEventListener("pointerup",vo(!1));te.addEventListener("pointercancel",vo(!0));te.addEventListener("lostpointercapture",vo(!0));var Da=0;window.addEventListener("wheel",e=>{!v||s||J>=0||(e.preventDefault(),e.timeStamp-Da>200&&g.wheel(0),Da=e.timeStamp,g.wheel(e.deltaY),C())},{passive:!1});ct.querySelector(".cb-back").addEventListener("click",()=>It());function yo(e){if(s||!he[e])return;let t=m[e],a=performance.now();t.fall=null,v&&g.go(e);let o=it(document.activeElement)===e?document.activeElement:null,n=!v&&t.x>0?-1:1;s={i:e,t0:a,asked:a,backIn:null,from:{...t.pose},dir:n,turn:n*Math.PI,flip:{from:0,to:0,t0:-1e9},exit:null,blur:0,ret:o},t.mesh.layers.set(et),le=!0,Mn(e),at.textContent=t.entry.name,nt.textContent=t.entry.tag,co(we,e),We.inert=!1,we.inert=!1,lt.inert=!0,document.body.classList.add("in-details");let r=L;Ve(Ft,0,r.headerOut.at,r.headerOut.dur);for(let i of[at,nt])Ve(i,1,r.title.at,r.title.dur);Ve(we,1,r.open.at,r.open.dur),He.attach(t),We.focus({preventScroll:!0}),ne("details",{pan:Le(e)}),ft(t.entry.tag?`Details: ${t.entry.name}. ${t.entry.tag}`:`Details: ${t.entry.name}`),st(),C()}function go(){if(!s||s.exit)return;let e=performance.now(),t=L.flip,a=s.flip,o=a.from+(a.to-a.from)*Se(t.ease,F((e-a.t0-A(t.at))/R(t.dur)));s.flip={from:o,to:a.to+s.dir*Math.PI,t0:e},ne("flip"),ft(mo(s.turn+s.flip.to)?"Back of the sleeve":"Front of the sleeve"),C()}function It(){if(!s||s.exit)return;let e=m[s.i],t=performance.now(),a=L.exit,o=e.pose.yaw/Ca,n=Ca*(s.dir>0?Math.ceil(o-.5-1e-6):Math.floor(o+.5+1e-6)),r=Math.abs(n-e.pose.yaw)<.001?0:R(L.flip.dur)*(1-Xa);s.exit={t0:t,from:{...e.pose},yawTo:n,lag:r,blur:s.blur};for(let i of[at,nt,we])Ve(i,0,a.at,a.textOut);He.unzoom(!0),Ve(Ft,1,a.headerIn.at,a.headerIn.dur),We.inert=!0,we.inert=!0,ne("close",{pan:Le(s.i)}),ft("Back to the shelf"),C()}function Qa(e,t,a=!1){let{i:o}=s,n=a?null:s.ret;if(s=null,Hn(e),e.pose=v?g.pose(e):Ge(),ye(e),e.mesh.layers.set(0),le=Oe=!0,lt.inert=!1,document.body.classList.remove("in-details"),v){n&&n.isConnected&&n.focus({preventScroll:!0}),Ye(!0),st();return}Ce=a?-1:po(ee.x,ee.y),Ae=Ce,At=t,n&&n.isConnected&&n.focus({preventScroll:!0}),W=Ae===o?o:-1,W!==o&&(e.fall={from:Ge(),t0:t}),ho(e),st()}var wo=null,_a=null,J=-1,Pt=!1,so=!1,Eo=()=>_a||(_a=import("./project-EFHC4NCV.js").then(e=>wo=e.createProjectView({renderer:P,entries:G,slugOf:de,onBack:Yn})));function qn(e){ne("open",{pan:s?0:Le(e)}),Eo(),G[e].kind!=="about"&&import("./project-EFHC4NCV.js").then(t=>t.loadDossier(de(G[e]))),Pt=!0,so=!0,ft(`Open: ${G[e].name}`),location.hash=de(G[e])}async function bo(){if(Ct)return;let e=decodeURIComponent(location.hash.slice(1)),t=G.findIndex(a=>de(a)===e);if(t>=0){if(t===J)return;let a=await Eo();if(G.findIndex(o=>de(o)===decodeURIComponent(location.hash.slice(1)))!==t||t===J)return;s&&So(!0),Pe(-1),J=t;for(let o of te.getAnimations())o.finish();ce?.setRoomTone(!1),so||ne("open"),so=!1,await a.open(t)}else if(J>=0){let a=J;if(J=-1,wo?.close(),ce?.setRoomTone(!0),ne("close",{pan:Le(a)}),fo(),v){g.jump(a);for(let o of m)he[o.i]&&(o.pose=g.pose(o),ye(o));Ye(!0)}Oe=le=!0,Ue[a].querySelector('[data-action="open"]').focus({preventScroll:!0}),C()}}function Yn(){Pt?(Pt=!1,history.back()):(history.pushState(null,"",location.pathname+location.search),bo())}window.addEventListener("hashchange",()=>{location.hash||(Pt=!1),bo()});function So(e=!1){let t=m[s.i];for(let a of[at,nt,we])for(let o of a.getAnimations())o.cancel();He.detach(),Ve(Ft,1,0,1),We.inert=!0,we.inert=!0,Qa(t,performance.now(),e),t.fall=null,W=-1}document.addEventListener("click",e=>{let t=e.target.closest("[data-action][data-index]");if(!t)return;let a=+t.dataset.index;if(t.dataset.action==="details"){yo(a);return}G[a].url||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||(e.preventDefault(),qn(a))});var it=e=>e&&e.closest&&e.closest(".slot")?Ue.indexOf(e.closest(".slot")):-1;lt.addEventListener("focusin",e=>{let t=it(e.target);if(!(t<0)){if(v){s||(g.go(t),C());return}Pe(t,!0)}});lt.addEventListener("focusout",e=>{it(e.relatedTarget)>=0||s||Pe(Ce)});window.addEventListener("keydown",e=>{if(e.metaKey||e.ctrlKey||e.altKey||J>=0||document.querySelector("dialog.ct[open]"))return;if(s){if(He.zoomed){e.key==="Escape"&&(e.preventDefault(),He.unzoom());return}e.key==="Escape"?(e.preventDefault(),It()):(e.key===" "||e.code==="Space")&&(e.preventDefault(),e.repeat||go());return}if(v){let r={ArrowLeft:-1,ArrowUp:-1,ArrowRight:1,ArrowDown:1}[e.key];if(r===void 0)return;e.preventDefault();let i=Math.max(0,Math.min(m.length-1,g.current+r));if(i===g.current)return;g.go(i),it(document.activeElement)>=0&&Ue[i].querySelector(`[data-action="${document.activeElement.dataset.action}"]`).focus({preventScroll:!0}),ne("tick"),C();return}let t={ArrowLeft:-1,ArrowRight:1,ArrowUp:-h.cols,ArrowDown:h.cols}[e.key];if(t===void 0)return;e.preventDefault();let a=it(document.activeElement),o=a<0?0:Math.max(0,Math.min(m.length-1,a+t));if(o===a)return;let n=document.activeElement?.dataset?.action==="open"?"open":"details";Ue[o].querySelector(`[data-action="${n}"]`).focus({preventScroll:!0}),ne("tick",{pan:Le(o)})});window.addEventListener("keyup",e=>{s&&(e.key===" "||e.code==="Space")&&e.preventDefault()});var Mo=window.matchMedia("(prefers-reduced-motion: reduce)");gt(Mo.matches);g.setReduced(Mo.matches);Mo.addEventListener?.("change",e=>{gt(e.matches),g.setReduced(e.matches)});var Tt={count:m.length,firstFrameAt:null,ready:qe.ready,covers:bn,sleeveRect:uo,frontCorners(e){let t=m[e].mesh.matrixWorld,a=h.size;return[[-a/2,0],[a/2,0],[a/2,a],[-a/2,a]].map(([o,n])=>(Q.set(o,n,h.thick).applyMatrix4(t),ze(Q.x,Q.y,Q.z)))},setCover(e,t,a){_t(m[e],t,a),C()},get project(){return J>=0?de(G[J]):null},get sleevesAt(){return zt},coverReadyAt:Oa,appearAt:ge,get crate(){return v?{p:g.p,current:g.current,dragging:g.dragging}:null},set stickerOff(e){Va=!!e,C()},get details(){return s?{index:s.i,flipped:mo(s.turn+s.flip.to),closing:!!s.exit,blur:s.blur,yaw:m[s.i].pose.yaw,backIn:s.backIn===null?null:Math.round(s.backIn-s.asked)}:null}};window.__editions=Tt;fo();for(let e of m)e.mesh.visible=!0;tt.mesh.visible=!0;for(let e of[!0,!1]){for(let t of m)for(let a of[t.front,t.back,t.mats[0]])a.transparent=e,a.needsUpdate=!0;for(let t of[0,et])H.layers.set(t),P.render(j,H);H.layers.enableAll(),P.render(j,H),H.layers.set(0),ot.background(j,H,1),ot.composite(.5)}for(let e of m)ye(e);tt.mesh.visible=!1;le=!0;qe.ready.then(()=>{location.hash&&bo()});export{Ar as drawn};
