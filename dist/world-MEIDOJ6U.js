import{B as ue,D as te,E as ae,G as oe,N as le,c as V,e as O,g as Q,i as j,o as x,q as w,s as ee,t as b,x as I}from"./chunk-XUX7XAJI.js";var re=matchMedia("(pointer: coarse)").matches,Te=re?512:1024,he=re?128:256,Ee=12,se=[{F:.03,k:.062,adv:.7,edgeG:1.15,bodyG:.9,nuc:1,zoomAdd:0,sporeMul:1},{F:.034,k:.056,adv:1.9,edgeG:.7,bodyG:1.15,nuc:.25,zoomAdd:-.06,sporeMul:.8},{F:.078,k:.061,adv:.9,edgeG:1.45,bodyG:.35,nuc:0,zoomAdd:.14,sporeMul:.7},{F:.0367,k:.0649,adv:2.3,edgeG:1,bodyG:.6,nuc:.6,zoomAdd:.06,sporeMul:1.8},{F:.029,k:.057,adv:.45,edgeG:.55,bodyG:1.2,nuc:.15,zoomAdd:-.04,sporeMul:.6},{F:.0545,k:.062,adv:1,edgeG:.9,bodyG:1,nuc:.35,zoomAdd:.02,sporeMul:1}];function Re(t){let i=t.toLowerCase().replace(/[^a-z]/g,""),n=2166136261;for(let v of t)n^=v.charCodeAt(0),n=Math.imul(n,16777619)>>>0;let c=v=>{let e=(n^Math.imul(v+1,2654435761))>>>0;return e=Math.imul(e^e>>>15,2246822519)>>>0,e=Math.imul(e^e>>>13,3266489917)>>>0,((e^e>>>16)>>>0)/4294967296},m=se[n%se.length],r=[];for(let v=0;v<Math.min(Ee,i.length);v++){let e=(i.charCodeAt(v)-97)/25;r.push([.22+.56*((e*.73+c(30+v))%1),.22+.56*((e*.37+c(60+v))%1)])}return{...m,F:m.F+(c(6)-.5)*.0012,k:m.k+(c(7)-.5)*6e-4,zoomD:.62+c(8)*.25+m.zoomAdd,climX:c(9)*8,climY:c(10)*8,seeds:r,hash:n}}var Fe="void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }",ve=`
float hashF(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hashF(i), b = hashF(i + vec2(1.0, 0.0)), c = hashF(i + vec2(0.0, 1.0)), d = hashF(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm2(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) { v += a * vnoise(p); p = p * 2.07 + vec2(3.1, 7.7); a *= 0.5; }
  return v;
}`,ye=`
uniform vec2 uFRes, uClimOff;
uniform float uCT;
${ve}
void main() {
  vec2 uv = gl_FragCoord.xy / uFRes;
  vec2 p = uv * 2.6 + uClimOff;
  float cf = fbm2(p + vec2(uCT * 0.7, uCT * 0.4));
  float ck = fbm2(p + vec2(7.3, 2.9) - vec2(uCT * 0.5, uCT * 0.8));
  vec2 q = uv * 3.2 + uClimOff * 1.7 + uCT * 0.9;
  float e = 0.045;
  vec2 vel = vec2(fbm2(q + vec2(0.0, e)) - fbm2(q - vec2(0.0, e)), -(fbm2(q + vec2(e, 0.0)) - fbm2(q - vec2(e, 0.0)))) / (2.0 * e) * 0.22;
  gl_FragColor = vec4(cf, ck, clamp(vel * 0.5 + 0.5, 0.0, 1.0));
}`,we=`
uniform sampler2D uPrev, uField;
uniform vec2 uTexel;
uniform float uMode, uF, uK, uAdv;
uniform vec4 uSplat;
void main() {
  vec2 uv = gl_FragCoord.xy * uTexel;
  if (uMode > 0.5) { gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); return; }
  vec4 fld = texture2D(uField, uv);
  float Fl = uF + (fld.r - 0.5) * 0.032;
  float Kl = uK + (fld.g - 0.5) * 0.011;
  // streaming: back-trace the whole stencil through the flow
  vec2 auv = uv - (fld.ba - 0.5) * 2.0 * uAdv * uTexel;
  vec2 c = texture2D(uPrev, auv).rg;
  vec2 s = vec2(0.0);
  s += texture2D(uPrev, auv + vec2(uTexel.x, 0.0)).rg * 0.2;
  s += texture2D(uPrev, auv - vec2(uTexel.x, 0.0)).rg * 0.2;
  s += texture2D(uPrev, auv + vec2(0.0, uTexel.y)).rg * 0.2;
  s += texture2D(uPrev, auv - vec2(0.0, uTexel.y)).rg * 0.2;
  s += texture2D(uPrev, auv + uTexel).rg * 0.05;
  s += texture2D(uPrev, auv - uTexel).rg * 0.05;
  s += texture2D(uPrev, auv + vec2(uTexel.x, -uTexel.y)).rg * 0.05;
  s += texture2D(uPrev, auv + vec2(-uTexel.x, uTexel.y)).rg * 0.05;
  vec2 L = s - c;
  float u = c.r, v = c.g, uvv = u * v * v;
  u = clamp(u + (1.0 * L.x - uvv + Fl * (1.0 - u)), 0.0, 1.0);
  v = clamp(v + (0.5 * L.y + uvv - (Fl + Kl) * v), 0.0, 1.0);
  if (uSplat.w > 0.0) {
    vec2 d = uv - uSplat.xy;
    d -= floor(d + 0.5);
    v = clamp(v + uSplat.w * exp(-dot(d, d) / (uSplat.z * uSplat.z)), 0.0, 1.0);
  }
  gl_FragColor = vec4(u, v, 0.0, 1.0);
}`,Me=`
uniform sampler2D uSim;
uniform vec2 uRes, uTexel, uOff;
uniform float uZoomD, uTime, uEdgeG, uBodyG, uNuc;
uniform vec3 uPalA, uPalB, uPalC, uPalD;
${ve}
void main() {
  vec2 frag = gl_FragCoord.xy - uOff;
  vec2 suv0 = (frag - 0.5 * uRes) / min(uRes.x, uRes.y);
  vec2 suv = suv0 * uZoomD + 0.5;
  float w1 = fbm2(suv * 3.1 + vec2(uTime * 0.028, uTime * 0.019));
  float w2 = fbm2(suv * 3.1 + vec2(4.7, 8.1) - uTime * 0.022);
  suv += vec2(w1 - 0.5, w2 - 0.5) * 0.05;
  vec2 c = texture2D(uSim, suv).rg;
  float u = c.r, v = c.g;
  float vx = texture2D(uSim, suv + vec2(uTexel.x, 0.0)).g - texture2D(uSim, suv - vec2(uTexel.x, 0.0)).g;
  float vy = texture2D(uSim, suv + vec2(0.0, uTexel.y)).g - texture2D(uSim, suv - vec2(0.0, uTexel.y)).g;
  float edge = clamp(length(vec2(vx, vy)) * 9.0, 0.0, 1.0) * uEdgeG;
  float body = smoothstep(0.10, 0.34, v) * uBodyG;
  float core = smoothstep(0.42, 0.62, v);
  vec3 col = uPalA + uPalB * cos(6.28318 * (uPalC * (v * 0.7 + u * 0.15 + (w1 - 0.5) * 0.45) + uPalD));
  vec3 n = normalize(vec3(-vx * 7.0, -vy * 7.0, 1.0));
  float dif = clamp(dot(n, normalize(vec3(-0.4, 0.6, 0.7))), 0.0, 1.0);
  vec2 auv = frag / uRes;
  float vig = smoothstep(0.0, 0.09, auv.x) * smoothstep(1.0, 0.91, auv.x) * smoothstep(0.0, 0.10, auv.y) * smoothstep(1.0, 0.90, auv.y);
  vec3 wash = col * (0.04 + 0.10 * w1) * clamp(1.0 - body, 0.0, 1.0);
  vec3 dark = col * (0.05 + body * (0.40 + 0.50 * dif)) + col * edge * 0.85 + wash;
  dark = mix(dark, dark * 0.45 + col * 0.15, core * uNuc);
  dark *= mix(0.65, 1.0, vig);
  dark = dark / (1.0 + 0.32 * dark);
  dark += (hashF(gl_FragCoord.xy + fract(uTime) * vec2(13.7, 91.3)) - 0.5) * 0.03;
  gl_FragColor = vec4(max(dark, 0.0), 1.0);
}`,Ce=(t,i,n)=>[0,8,4].map(c=>{let m=(c+t/30)%12;return n-i*Math.min(n,1-n)*Math.max(-1,Math.min(m-3,9-m,1))});function Se(t,i,n,{reduced:c=!1,size:m=0}={}){let r=m||Te,v=m||he,e=Re(i),H={type:j,depthBuffer:!1,wrapS:V,wrapT:V,minFilter:O,magFilter:O,generateMipmaps:!1},T=[new b(r,r,H),new b(r,r,H)],M=new b(v,v,{...H,type:Q}),P=(u,l)=>new te({vertexShader:Fe,fragmentShader:u,uniforms:l,depthTest:!1,depthWrite:!1,toneMapped:!1}),C=P(ye,{uFRes:{value:new x(v,v)},uClimOff:{value:new x(e.climX,e.climY)},uCT:{value:0}}),f=P(we,{uPrev:{value:null},uField:{value:M.texture},uTexel:{value:new x(1/r,1/r)},uMode:{value:1},uF:{value:e.F},uK:{value:e.k},uAdv:{value:0},uSplat:{value:new ee}}),B=Ce(n,.7,.6),g=P(Me,{uSim:{value:null},uRes:{value:new x(1,1)},uOff:{value:new x},uTexel:{value:new x(1/r,1/r)},uZoomD:{value:e.zoomD},uTime:{value:0},uEdgeG:{value:e.edgeG},uBodyG:{value:e.bodyG},uNuc:{value:e.nuc},uPalA:{value:new w(...B.map(u=>.16+u*.34))},uPalB:{value:new w(...B.map(u=>.18+u*.36))},uPalC:{value:new w(1,1,1)},uPalD:{value:new w(.72,.74,.7)}}),h=new ue(new le(2,2),f);h.frustumCulled=!1;let S=new oe;S.add(h);let G=new ae,k=(u,l)=>{h.material=u,t.setRenderTarget(l),t.render(S,G)};function ce(){let u=t.getRenderTarget(),l=[];for(let[p,o]of[[C,M],[f,T[0]],[g,null]])h.material=p,t.setRenderTarget(o),l.push(t.compileAsync(S,G));return t.setRenderTarget(u),Promise.all(l)}let q=()=>{for(let u of T)u.dispose();M.dispose()},z=u=>(Math.imul(e.hash^u*2654435761,2246822519)>>>0)/4294967296,D=[],ne=()=>e.seeds.forEach((u,l)=>[.85,.45,.28].forEach((p,o)=>D.push({x:u[0]+(o?(z(l*7+o)-.5)*.03:0),y:u[1]+(o?(z(l*11+o)-.5)*.03:0),r:Math.max(2.5/r,.004+z(l+o)*.003),amt:p}))),d=Math.random,R=0,s=0,K=0,N=0,_=0,Z=0,X=4,F=!1,Y=!1,A=!1,$=()=>s<4?22:11,y=1,E=4.5,ie=E+.2,fe=3;function me(){f.uniforms.uMode.value=1;for(let u of T)k(f,u);f.uniforms.uMode.value=0,Y=!0}function U(u,l){s+=u,N+=u,K+=u*.007;let p=s<y?-.002:s<E?.004*Math.min(1,(s-y)/1.2):.0022*Math.sin((s-E)*.28);if(F&&s>y&&s<E&&s>Z){Z=s+.05+d()*.08;let o=e.seeds[d()*e.seeds.length|0],a=.13+.45*(s-y)/(E-y);D.push({x:(o[0]+(d()-.5)*a+1)%1,y:(o[1]+(d()-.5)*a+1)%1,r:Math.max(2.5/r,.004+d()*.003),amt:.55})}F&&!c&&s>E&&s>X&&(X=s+(4.2+d()*4.8)/e.sporeMul,D.push({x:d(),y:d(),r:Math.max(2.5/r,.004+d()*.004),amt:.5})),C.uniforms.uCT.value=K,k(C,M),f.uniforms.uF.value=e.F+p,f.uniforms.uAdv.value=.3*e.adv;for(let o=0;o<l;o++){let a=D.shift();f.uniforms.uSplat.value.set(a?a.x:0,a?a.y:0,a?a.r:.02,a?a.amt:0),f.uniforms.uPrev.value=T[R].texture,k(f,T[1-R]),R=1-R}}let de=new I(0),J=new I;function pe(u,l){if(t.setRenderTarget(null),l){t.getClearColor(J);let xe=t.getClearAlpha();t.setClearColor(de,1),t.clear(!0,!1,!1),t.setClearColor(J,xe);return}let[p,o,a,L]=u,ge=.985/Math.max(a/L,L/a);g.uniforms.uZoomD.value=Math.min(e.zoomD,ge),g.uniforms.uSim.value=T[R].texture,g.uniforms.uRes.value.set(a,L),g.uniforms.uOff.value.set(p,o),g.uniforms.uTime.value=N,h.material=g,t.render(S,G)}return{seed(){F||(F=!0,ne())},frame(u,l){let p=t.getRenderTarget(),o=t.autoClear;if(t.autoClear=!1,Y||me(),c){if(!A){for(let a=0;a<fe;a++)U(1/60,$());F&&s>=ie&&(A=!0)}}else{_+=$()*Math.min(3,u*60);let a=Math.min(26,Math.floor(_));_-=a,U(u,a)}pe(l,c&&!A),t.setRenderTarget(p),t.autoClear=o},get still(){return A},compile:ce,disposeTargets:q,dispose(){q(),C.dispose(),f.dispose(),g.dispose(),h.geometry.dispose()}}}var W=null;function Ae(t){if(!W){let i=Se(t,"warm",0,{size:4});W=i.compile().then(()=>({draw(){i.seed(),i.frame(1/60,[0,0,1,1]),i.disposeTargets()}}))}return W}export{Se as createWorld,Re as derive,Ae as warmWorld};
