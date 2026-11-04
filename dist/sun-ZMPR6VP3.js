import{a as ce,b as U}from"./chunk-Y75BIKGP.js";import"./chunk-SUF5GSKW.js";import{c as le,e as z,f as j,k as s}from"./chunk-BLGVCQSZ.js";import{C as oe,D as re,E as ue,G as k,H as se,K as ie,f as K,h as te,k as ae,o as ne,p as C,r as u,t as b,u as X}from"./chunk-NBWD5ZMU.js";var fe=Math.PI/180,O=[7,12,18],d=512,he=1.1,we=6,xe=[.035,.02,.006],ge=t=>`
uniform vec3 uSunD, uSunU, uSunV;     // toward the sun; across and up in the sun's view
uniform float uSunPower, uSunFade;
uniform vec4 uWin;                    // the opening: z0, y0, z1, y1 on the street front
uniform float uWinX;                  // the street front's x
uniform vec4 uWinBars;                // frame, glazing bar, transom height, transom bar
uniform vec4 uMask;                   // the leaf mask's centre (u, v), half size, the leaves' depth along the sun
uniform sampler2D uLeaf0, uLeaf1, uLeaf2;
uniform vec3 uLeafR;
uniform vec4 uSlv[${t*3}];
uniform vec4 uShelfB[2];              // x0, x1, the underside's height, depth
uniform vec3 uSunBounce;              // the sun's light bounced off the patch, on the covers
const float NJ_SUN_DISC = 0.00925;    // the sun's diameter in radians

float njBox(vec2 p, vec2 b) { vec2 d = abs(p) - b; return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0); }

// Signed distance on the street front (z, y) to the glass the sun passes: negative in the light.
float njWindowSd(vec2 w) {
  vec2 c = 0.5 * (uWin.xy + uWin.zw), hb = 0.5 * (uWin.zw - uWin.xy) - uWinBars.x;
  float open = njBox(w - c, hb);
  // The transom, and two glazing bars running the full height: three lights below it, three above, so the
  // whole patch reads as one window. (A decorative fanlight may come back once it can read.)
  float bars = abs(w.y - uWinBars.z) - 0.5 * uWinBars.w;
  float z1 = c.x - hb.x + 2.0 * hb.x / 3.0, z2 = c.x - hb.x + 4.0 * hb.x / 3.0;
  bars = min(bars, min(abs(w.x - z1), abs(w.x - z2)) - 0.5 * uWinBars.y);
  return max(open, -bars);
}
float njWindow(vec3 p) {
  float t = (uWinX - p.x) / uSunD.x;
  if (t <= 0.0) return 1.0;
  vec3 q = p + uSunD * t;
  float pen = max(t * NJ_SUN_DISC, 0.8);
  return smoothstep(0.0, 1.0, clamp(0.5 - njWindowSd(q.zy) * sqrt(uSunD.x) / pen, 0.0, 1.0));
}
// The leaves: the mask level whose blur matches the sun's image at this distance from them.
float njLeaves(vec3 p) {
  vec2 uv = (vec2(dot(p, uSunU), dot(p, uSunV)) - uMask.xy) / (2.0 * uMask.z) + 0.5;
  float r = max(uMask.w - dot(p, uSunD), 0.0) * NJ_SUN_DISC * 0.5;
  float a = texture2D(uLeaf0, uv).r, b = texture2D(uLeaf1, uv).r, c = texture2D(uLeaf2, uv).r;
  return r < uLeafR.y ? mix(a, b, clamp((r - uLeafR.x) / (uLeafR.y - uLeafR.x), 0.0, 1.0))
                      : mix(b, c, clamp((r - uLeafR.y) / (uLeafR.z - uLeafR.y), 0.0, 1.0));
}
float njSleeves(vec3 p, int self) {
  float vis = 1.0;
  for (int i = 0; i < ${t}; i++) {
    if (i == self) continue;
    vec4 o = uSlv[i * 3];
    if (o.w <= 0.001) continue;
    vec3 eu = uSlv[i * 3 + 1].xyz, ev = uSlv[i * 3 + 2].xyz;
    vec3 nrm = cross(eu, ev);
    float dn = dot(uSunD, nrm);
    if (abs(dn) < 1e-6) continue;
    float t = dot(o.xyz - p, nrm) / dn;
    if (t <= 0.25) continue;
    vec3 h = p + uSunD * t - o.xyz;
    vec2 len = vec2(length(eu), length(ev));
    vec2 ab = vec2(dot(h, eu) / len.x, dot(h, ev) / len.y);
    float sd = njBox(ab - 0.5 * len, 0.5 * len);
    vis *= 1.0 - o.w * clamp(0.5 - sd / max(t * NJ_SUN_DISC, 0.6), 0.0, 1.0);
  }
  return vis;
}
float njShelves(vec3 p) {
  float vis = 1.0;
  for (int s = 0; s < 2; s++) {
    vec4 b = uShelfB[s];
    if (b.y <= b.x || p.y >= b.z - 0.01) continue;
    float t = (b.z - p.y) / uSunD.y;
    vec3 h = p + uSunD * t;
    // The shelf runs back into the wall, so no light slips between them.
    float sd = njBox(vec2(h.x - 0.5 * (b.x + b.y), h.z), vec2(0.5 * (b.y - b.x), b.w));
    vis *= clamp(0.5 + sd / max(t * NJ_SUN_DISC, 0.6), 0.0, 1.0);
  }
  return vis;
}
float njSunVis(vec3 p, int self) {
  float v = njWindow(p);
  if (v <= 0.0) return 0.0;
  return v * njLeaves(p) * njSleeves(p, self) * njShelves(p);
}
// Amber at the patch's edges, a warm white in its full light.
vec3 njSunColour(float v) { return mix(vec3(1.0, 0.45, 0.13), vec3(1.0, 0.62, 0.27), smoothstep(0.12, 0.85, v)); }
// Light added to a linear colour, rolled off toward white without clipping or losing its hue; nothing
// changes where nothing is added.
vec3 njSunAdd(vec3 c, vec3 add) {
  vec3 o = c + add;
  float pk = max(o.r, max(o.g, o.b));
  if (pk <= 0.82) return o;
  float np = 0.82 + 0.18 * (1.0 - exp(-(pk - 0.82) / 0.18));
  return mix(o, o * (np / pk), 1.0 - exp(-40.0 * max(add.r, max(add.g, add.b))));
}
`,Se=`
varying vec2 vUv;
varying vec3 vNjWorld;
void main() {
  vUv = uv;
  vNjWorld = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,ye=t=>`
uniform sampler2D uBake;
uniform float uGain;
uniform float uSunDebug;   // a test's view: 1 the window alone, 2 the leaves alone
varying vec2 vUv;
varying vec3 vNjWorld;
${t}
float njHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float njNoise(vec2 x) {
  vec2 i = floor(x), f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(njHash(i), njHash(i + vec2(1.0, 0.0)), f.x), mix(njHash(i + vec2(0.0, 1.0)), njHash(i + vec2(1.0, 1.0)), f.x), f.y);
}
// Trowelled cement plaster: broad sweeps and a fine grain, whose slope tilts the wall's normal for the
// sun alone, so the texture shows only where the sun rakes across it.
float njPlaster(vec2 p) {
  vec2 w = p + 30.0 * vec2(njNoise(p / 150.0), njNoise(p / 150.0 + 5.2));
  return 0.68 * njNoise(w / 46.0) + 0.27 * njNoise(w / 15.0 + 3.1) + 0.05 * njNoise(p / 4.5 + 9.7);
}
void main() {
  vec3 c = texture2D(uBake, vUv).rgb * uGain;
  if (uSunD.z > 0.0 && uSunFade > 0.0) {
    float v = uSunDebug > 1.5 ? njLeaves(vNjWorld) : uSunDebug > 0.5 ? njWindow(vNjWorld) : njSunVis(vNjWorld, -1);
    if (v > 0.0) {
      vec3 lit = njSunAdd(c, njSunColour(v) * (uSunPower * uSunFade * uSunD.z * v));
      // The relief only takes light away where a trowel mark turns from the sun, after the roll-off, so
      // it shows in the patch's core too and can never clip.
      vec2 pp = vNjWorld.xy;
      float h = njPlaster(pp);
      vec2 g = vec2(njPlaster(pp + vec2(1.5, 0.0)) - h, njPlaster(pp + vec2(0.0, 1.5)) - h) / 1.5;
      float k = clamp(dot(normalize(vec3(-g * ${we.toFixed(2)}, 1.0)), uSunD) / uSunD.z, 0.0, 1.0);
      c = mix(c, lit, k);
    }
  }
  gl_FragColor = vec4(c, 1.0);
  #include <colorspace_fragment>
  float n = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  gl_FragColor.rgb += (n - 0.5) / 255.0;
}`;function Ee(t){let i="gl_FragColor = vec4(vec3(e * uShelfAlbedo), 1.0);";if(!U.includes(i)||!U.includes("void main() {"))throw new Error("sun: shelves.js changed");return U.replace("void main() {",`${t}
void main() {`).replace(i,`vec3 njc = vec3(e * uShelfAlbedo);
  float njnl = dot(nl, uSunD);
  if (njnl > 0.0 && uSunFade > 0.0) {
    float v = njSunVis(vPos, -1);
    njc = njSunAdd(njc, njSunColour(v) * (uSunPower * uSunFade * njnl * v * ${he.toFixed(3)}));
  }
  gl_FragColor = vec4(njc, 1.0);`)}function be(t,i,f,v){t.vertexShader=t.vertexShader.replace("void main() {",`varying vec3 vNjWorld;
void main() {`).replace("#include <project_vertex>",`#include <project_vertex>
  vNjWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;`),t.fragmentShader=t.fragmentShader.replace("void main() {",`varying vec3 vNjWorld;
uniform int uNjSelf;
uniform float uNjGain;
${i}
void main() {`).replace("#include <aomap_fragment>",`#include <aomap_fragment>
  {
    float njNl = dot(inverseTransformDirection(normal, viewMatrix), uSunD);
    if (njNl > 0.0 && uSunFade > 0.0) {
      float njV = njSunVis(vNjWorld, uNjSelf);
      reflectedLight.directDiffuse += diffuseColor.rgb * njSunColour(njV) * (uSunPower * uSunFade * njNl * njV * uNjGain);
    }
    reflectedLight.indirectDiffuse += diffuseColor.rgb * uSunBounce * uSunFade;
  }`),t.uniforms.uNjSelf={value:f},t.uniforms.uNjGain={value:v}}var ve=`
varying vec2 vUv;
void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,je=`
precision highp float;
varying vec2 vUv;
uniform float uT;       // the ambient clock, seconds
uniform vec2 uExt;      // the window's half extents in the sun's view
uniform float uH;       // the mask's half size
float h1(float n) { return fract(sin(n * 127.1 + 0.37) * 43758.5453); }
float h2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 x) {
  vec2 i = floor(x), f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h2(i), h2(i + vec2(1.0, 0.0)), f.x), mix(h2(i + vec2(0.0, 1.0)), h2(i + vec2(1.0, 1.0)), f.x), f.y);
}
// A distant tree's crown: small leaves with small gaps between them, each gap a round image of the sun
// once blurred (komorebi). Thicker toward its centre, thinning to open sky at its edge.
float crown(vec2 p, vec2 c, vec2 r, float t) {
  float edge = length((p - c) / r) - 1.0;
  if (edge > 0.12) return 0.0;
  vec2 w = p + vec2(sin(t * 0.61), cos(t * 0.47)) * 2.5;
  float n = 0.62 * vnoise(w / 7.0) + 0.38 * vnoise(w / 3.2 + 17.0);
  return step(n, mix(0.78, 0.42, smoothstep(-0.55, 0.12, edge)));
}
vec2 rot(vec2 p, float a) { float c = cos(a), s = sin(a); return vec2(c * p.x + s * p.y, -s * p.x + c * p.y); }
float capsule(vec2 p, vec2 a, vec2 b, float r) {
  vec2 pa = p - a, ba = b - a;
  return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0)) - r;
}
// A banana blade: a long blunt oval that droops, its lamina shredded by the wind into strips that slant
// toward the tip and open toward the margin.
float banana(vec2 p, float len, float wid, float seed, float gust) {
  float stalk = step(abs(p.y), 9.0) * step(0.0, p.x) * step(p.x, len * 0.14);
  float u = (p.x - len * 0.12) / (len * 0.88);
  if (u < 0.0 || u > 1.0) return stalk;
  float y = p.y + 0.2 * len * u * u;
  float hw = wid * pow(max(sin(3.14159 * min(u * 0.94 + 0.06, 1.0)), 0.0), 0.45) * (1.0 - 0.2 * u);
  float ay = abs(y);
  if (ay > hw) return 0.0;
  if (ay < 4.5) return 1.0;
  float sl = (p.x + ay * 0.6) / 34.0 + seed * 3.7;
  float k = floor(sl), f = fract(sl + 0.04 * gust * sin(uT * 13.0 + k * 2.3));
  float torn = step(0.4, h1(k + seed * 17.0));
  float open = torn * smoothstep(0.1, 0.9, ay / hw) * (0.1 + 0.26 * h1(k * 1.31 + seed)) * (1.0 + 0.6 * gust);
  return f < open ? 0.0 : 1.0;
}
// A monstera leaf: a broad heart with slits running in from the margin between the veins and a row of
// oval holes near the midrib.
float monstera(vec2 p, float len, float seed) {
  float u = p.x / len;
  if (u < -0.06 || u > 1.0) return 0.0;
  float hw = len * 0.5 * pow(max(sin(3.14159 * clamp(u + 0.06, 0.0, 1.0)), 0.0), 0.6) * (1.12 - 0.3 * u);
  float ay = abs(p.y);
  if (ay > hw) return 0.0;
  if (ay < 4.0 && u > 0.0) return 1.0;
  float side = p.y > 0.0 ? 1.0 : 0.0;
  float ph = (p.x - ay * 0.75) / (len * 0.105) + seed + side * 0.37;
  float k = floor(ph), f = fract(ph) - 0.5;
  float r = ay / hw;
  float slit = step(0.52 + 0.12 * h1(k + side * 9.0 + seed), r) * step(abs(f), 0.05 + 0.04 * r);
  vec2 e = vec2(f / 0.16, (r - 0.3) / 0.1);
  float hole = step(dot(e, e), 1.0) * step(0.35, h1(k * 3.1 + side + seed));
  return 1.0 - max(slit, hole);
}
// A frangipani leaf: obovate, widest two thirds of the way out.
float plumeria(vec2 p, float len, float wid) {
  float u = p.x / len;
  if (u < 0.0 || u > 1.0) return 0.0;
  return step(abs(p.y), wid * 1.9 * pow(u, 0.75) * pow(1.0 - u, 0.4));
}
float rosette(vec2 p, vec2 c, float a0, float len, float wid, float sway) {
  float m = 0.0;
  for (int i = 0; i < 7; i++) {
    float a = a0 + float(i) * 0.82 + 0.18 * sin(float(i) * 2.7) + sway * (0.6 + 0.4 * sin(float(i)));
    m = max(m, plumeria(rot(p - c, a), len * (0.8 + 0.25 * h1(float(i) + a0)), wid));
  }
  return m;
}
void main() {
  // The sun's view, turned to read as the wall does: +x toward the window's side of the patch.
  vec2 p = (vUv * 2.0 - 1.0) * uH;
  p.x = -p.x;
  float t = uT;
  // The wind: a slow sway, with gusts that come and go; the leaves flutter only in a gust.
  float gust = smoothstep(0.62, 0.95, 0.5 + 0.5 * sin(t * 0.23 + 1.1) * sin(t * 0.071 + 0.4));
  float sway = sin(t * 0.83) * 0.6 + sin(t * 1.37 + 1.2) * 0.4;
  float m = 0.0;
  // The foliage frames the opening: a young banana leaf up from the lower left, the crown of a tree
  // across the street in the upper left, a monstera in the lower right, a frangipani branch across the
  // top right.
  m = max(m, banana(rot(p - vec2(-1.45, -1.35) * uExt, (55.0 + 1.6 * sway + 3.0 * gust) * 0.0174533), 570.0, 124.0, 1.0, gust));
  m = max(m, crown(p, vec2(-1.25, 1.3) * uExt, vec2(1.25, 1.0) * uExt, t));
  m = max(m, monstera(rot(p - vec2(1.45, -1.3) * uExt, (145.0 + 1.0 * sway) * 0.0174533), 330.0, 0.3));
  vec2 b0 = vec2(1.75, 1.6) * uExt;
  vec2 c1 = vec2(1.02, 1.04) * uExt + vec2(3.0, 2.0) * sway, c2 = vec2(0.55, 1.05) * uExt + vec2(4.0, 2.5) * sway;
  m = max(m, step(capsule(p, b0, c1, 10.0), 0.0));
  m = max(m, step(capsule(p, mix(c1, b0, 0.4), c2, 6.5), 0.0));
  m = max(m, rosette(p, c1, 0.4, 135.0, 40.0, 0.05 * sway + 0.08 * gust * sin(t * 6.0)));
  m = max(m, rosette(p, c2, 1.9, 118.0, 36.0, 0.06 * sway + 0.08 * gust * sin(t * 6.4)));
  gl_FragColor = vec4(vec3(1.0 - m), 1.0);
}`,Te=`
precision highp float;
varying vec2 vUv;
uniform sampler2D uSrc;
uniform float uR;       // radius, in source texels
uniform vec2 uTexel;
void main() {
  float acc = 0.0;
  for (int i = 0; i < 48; i++) {
    float fi = float(i) + 0.5;
    float r = sqrt(fi / 48.0) * uR, a = fi * 2.39996323;
    acc += texture2D(uSrc, vUv + vec2(cos(a), sin(a)) * r * uTexel).r;
  }
  gl_FragColor = vec4(vec3(acc / 48.0), 1.0);
}`;function Re(t){let i={type:te,format:ae,depthBuffer:!1,minFilter:K,magFilter:K,generateMipmaps:!1},f=new X(d,d,i),v=[d,d/2,d/4].map(r=>new X(r,r,i)),h=new re;h.setAttribute("position",new oe([-1,-1,0,3,-1,0,-1,3,0],3));let l=new k({uniforms:{uT:{value:0},uExt:{value:new C(1,1)},uH:{value:1}},vertexShader:ve,fragmentShader:je,depthTest:!1,depthWrite:!1}),m=new k({uniforms:{uSrc:{value:f.texture},uR:{value:1},uTexel:{value:new C(1/d,1/d)}},vertexShader:ve,fragmentShader:Te,depthTest:!1,depthWrite:!1}),a=new ue(h,l);a.frustumCulled=!1;let w=new ie,g=new se;return w.add(a),{textures:v.map(r=>r.texture),layout(r,S){l.uniforms.uExt.value.copy(r),l.uniforms.uH.value=S},render(r){let S=t.getRenderTarget();l.uniforms.uT.value=r,a.material=l,t.setRenderTarget(f),t.render(w,g);let D=2*l.uniforms.uH.value/d;a.material=m,v.forEach((G,L)=>{m.uniforms.uR.value=O[L]/D,t.setRenderTarget(G),t.render(w,g)}),t.setRenderTarget(S)},dispose(){f.dispose(),v.forEach(r=>r.dispose()),l.dispose(),m.dispose(),h.dispose()}}}function De({renderer:t,scene:i,wallMesh:f,shelfMeshes:v,sleeves:h}){let l=h.length,m=z.size,a={uSunD:{value:new u},uSunU:{value:new u},uSunV:{value:new u},uSunPower:{value:s.sun.power},uSunFade:{value:0},uWin:{value:new b},uWinX:{value:s.room.front},uWinBars:{value:new b},uMask:{value:new b},uLeaf0:{value:null},uLeaf1:{value:null},uLeaf2:{value:null},uLeafR:{value:new u(...O)},uSlv:{value:Array.from({length:l*3},()=>new b)},uShelfB:{value:j.tops.map(e=>new b(-j.width/2,j.width/2,e-j.thick,j.depth))},uSunBounce:{value:new u(...xe)}},w=ge(l),g=Re(t);[a.uLeaf0.value,a.uLeaf1.value,a.uLeaf2.value]=g.textures;let r=f.material,S=new k({uniforms:{uBake:r.uniforms.uBake,uGain:r.uniforms.uGain,uSunDebug:{value:0},...a},vertexShader:Se,fragmentShader:ye(w),toneMapped:!1}),D=v.map(e=>e.material),G=D.map(e=>new k({uniforms:{...e.uniforms,...a},vertexShader:ce,fragmentShader:Ee(w),toneMapped:!1})),L=[];for(let e of h)for(let n of new Set([e.front,e.back,e.mats[0]])){let c=n.onBeforeCompile,R=n.customProgramCacheKey;n.onBeforeCompile=(p,H)=>{c.call(n,p,H),n.userData.njSun&&(Object.assign(p.uniforms,a),be(p,w,e.i,s.sun.coverGain[le(e.entry)]??s.sun.coverGain.default))},n.customProgramCacheKey=()=>R.call(n)+(n.userData.njSun?"-sun":""),L.push(n)}let x=!1,P=!0,I=0,y=new u,F=new u,$=new u,T=new u,V=new C;function Q({az:e=s.sun.az,el:n=s.sun.el,power:c=s.sun.power,debug:R=0}={}){S.uniforms.uSunDebug.value=R;let p=e*fe,H=n*fe,o=s.window,q=s.room.front;y.set(Math.cos(H)*Math.cos(p),Math.sin(H),Math.cos(H)*Math.sin(p)),F.set(-y.z,0,y.x).normalize(),$.crossVectors(F,y),a.uSunD.value.copy(y),a.uSunU.value.copy(F),a.uSunV.value.copy($),a.uSunPower.value=c,a.uWin.value.set(o.z0,o.y0,o.z1,o.y1),a.uWinX.value=q,a.uWinBars.value.set(o.frame,o.bar,o.y0+(o.y1-o.y0)*o.transom,o.transomBar);let N=1/0,_=-1/0,B=1/0,A=-1/0;for(let pe of[o.z0,o.z1])for(let de of[o.y0,o.y1]){T.set(q,de,pe);let Z=T.dot(F),ee=T.dot($);N=Math.min(N,Z),_=Math.max(_,Z),B=Math.min(B,ee),A=Math.max(A,ee)}V.set((_-N)/2,(A-B)/2);let Y=Math.max(V.x,V.y)+O[2]*2+24;T.set(q,(o.y0+o.y1)/2,(o.z0+o.z1)/2),a.uMask.value.set((N+_)/2,(B+A)/2,Y,T.dot(y)+s.sun.leaves),g.layout(V,Y),P=!0}Q();let E=new u,W=new u,M=new u;function me(){for(let e of h){let n=e.mesh.matrixWorld,c=e.pose,R=ne.smoothstep(c.z,110,260),p=e.mesh.visible?c.opacity*(1-R):0;E.set(-m/2,0,z.thick).applyMatrix4(n),W.set(m/2,0,z.thick).applyMatrix4(n).sub(E),M.set(-m/2,m,z.thick).applyMatrix4(n).sub(E),a.uSlv.value[e.i*3].set(E.x,E.y,E.z,p),a.uSlv.value[e.i*3+1].set(W.x,W.y,W.z,0),a.uSlv.value[e.i*3+2].set(M.x,M.y,M.z,0)}}function J(e){x=!!e,f.material=x?S:r,v.forEach((n,c)=>{n.material=x?G[c]:D[c]});for(let n of L)!!n.userData.njSun!==x&&(n.userData.njSun=x,n.needsUpdate=!0)}return{get on(){return x},get fade(){return a.uSunFade.value},setParams:Q,setEnabled:J,setFade(e){a.uSunFade.value=e},sleevesMoved:me,tick(e){return!P&&e===I?!1:(I=e,P=!1,g.render(I),!0)},async compile(e){let n=x;J(!0),t.compileAsync?await t.compileAsync(i,e):t.compile(i,e),J(n)},uniforms:a}}export{De as createSun};
