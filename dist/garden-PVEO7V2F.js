import{a as lt,b as zt,c as Dt}from"./chunk-4VAF4GAZ.js";import{j as $}from"./chunk-6PNQGI4Q.js";import{A as K,D as St,E as gt,F as U,G as Tt,H as _,I as yt,J as ct,M as Rt,N as Ct,R as Ht,S as bt,W as At,b as rt,ca as Vt,e as it,j as mt,l as pt,m as Et,r as wt,s as R,u as xt,v as Mt,x as J}from"./chunk-EEI5LVGT.js";var tt=$.room,Q=$.window,B=tt.front+tt.wall,G=tt.floor-70,kt=new R(0,1,0),c=(l,S,A)=>new R(l,S,A);function j(l){return()=>{l|=0,l=l+1831565813|0;let S=Math.imul(l^l>>>15,1|l);return S=S+Math.imul(S^S>>>7,61|S)^S,((S^S>>>14)>>>0)/4294967296}}var Pt=`
uniform float uT;
attribute vec2 aWind;
float njGust(float t) { return smoothstep(0.35, 0.9, 0.5 + 0.5 * sin(t * 0.23) * sin(t * 0.113 + 1.3)); }
vec3 njWind(vec2 w) {
  float g = njGust(uT), f = w.y * w.y;
  float sway = 0.6 * sin(uT * 0.55 + w.x) + 0.4 * sin(uT * 0.37 + w.x * 1.7);
  float flutter = sin(uT * 5.6 + w.x * 9.0) * (0.25 + g);       // leaves never quite still; more in a gust
  vec3 dir = normalize(vec3(-0.3, 0.0, 1.0));
  return dir * (w.y * (22.0 * sway + 30.0 * g * (0.6 + 0.4 * sin(uT * 2.1 + w.x))) + f * 10.0 * flutter) + vec3(0.0, f * 12.0 * flutter, 0.0);
}`,It=`
attribute vec3 aCol;
varying vec3 vP;
varying vec3 vN;
varying vec3 vCol;
varying vec2 vUv;
${Pt}
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  w.xyz += njWind(aWind);
  vP = w.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  vCol = aCol;
  vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Wt=`
uniform sampler2D uAtlas, uShade;
uniform vec3 uSunD, uSunU, uSunV, uSunCol, uSkyCol;
uniform vec4 uShadeAt;      // the garden's sun view: centre (u, v), half size, texel
uniform float uSolid;
varying vec3 vP;
varying vec3 vN;
varying vec3 vCol;
varying vec2 vUv;
// The sun's own softness: a shadow's edge widens with the distance from what casts it to where it falls,
// by the sun's angular radius (0.27 degrees). Find how far the casters stand (the mean of those nearer
// the sun around this point), then look across that width, each look filtered between texels.
const vec2 NJ_PD[12] = vec2[12](vec2(-0.326, -0.406), vec2(-0.84, -0.074), vec2(-0.696, 0.457), vec2(-0.203, 0.621), vec2(0.962, -0.195), vec2(0.473, -0.48),
                                 vec2(0.519, 0.767), vec2(0.185, -0.893), vec2(0.507, 0.064), vec2(0.896, 0.412), vec2(-0.322, -0.933), vec2(-0.792, -0.598));
float njShadeTap(vec2 uv, float d) {
  float n = 1.0 / uShadeAt.w;
  vec2 st = uv * n - 0.5, f = fract(st), t = (floor(st) + 0.5) / n, o = vec2(uShadeAt.w, 0.0);
  float a = step(texture2D(uShade, t).r, d), b = step(texture2D(uShade, t + o).r, d);
  float c = step(texture2D(uShade, t + o.yx).r, d), e = step(texture2D(uShade, t + o.xx).r, d);
  return mix(mix(a, b, f.x), mix(c, e, f.x), f.y);
}
float njLit(vec3 p) {
  vec2 uv = (vec2(dot(p, uSunU), dot(p, uSunV)) - uShadeAt.xy) / (2.0 * uShadeAt.z) + 0.5;
  float d = dot(p, uSunD) + 10.0, sum = 0.0, k = 0.0;
  for (int i = 0; i < 12; i++) { float z = texture2D(uShade, uv + NJ_PD[i] * uShadeAt.w * 9.0).r; if (z > d) { sum += z; k += 1.0; } }
  if (k < 0.5) return 1.0;
  float units = 2.0 * uShadeAt.z * uShadeAt.w;                         // world units per texel
  float rad = clamp((sum / k - d) * 0.0047 / units, 1.2, 10.0) * uShadeAt.w;
  float lit = 0.0;
  for (int i = 0; i < 12; i++) lit += njShadeTap(uv + NJ_PD[i] * rad, d);
  return lit / 12.0;
}
void main() {
  vec4 t = uSolid > 0.5 ? vec4(1.0) : texture2D(uAtlas, vUv);
  if (t.a < 0.2) discard;
  float cover = uSolid > 0.5 ? 1.0 : clamp((t.a - 0.5) / max(fwidth(t.a), 1e-3) + 0.5, 0.0, 1.0);
  vec3 n = normalize(vN) * (gl_FrontFacing ? 1.0 : -1.0);
  float nd = dot(n, uSunD), lit = njLit(vP);
  vec3 c = vCol * t.rgb;
  vec3 light = uSkyCol * (0.32 + 0.18 * max(n.y, 0.0)) + uSunCol * lit * max(nd, 0.0);
  if (uSolid < 0.5) light += uSunCol * lit * 0.6 * max(-nd, 0.0) * vec3(0.8, 1.0, 0.35);   // through the leaf
  gl_FragColor = vec4(c * light, cover);
  #include <colorspace_fragment>
}`,_t=`
uniform vec3 uSunD;
varying vec2 vUv;
varying float vDepth;
${Pt}
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  w.xyz += njWind(aWind);
  vUv = uv;
  vDepth = dot(w.xyz, uSunD);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,jt=`
uniform sampler2D uAtlas;
uniform float uSolid, uDepthOut;
varying vec2 vUv;
varying float vDepth;
void main() {
  if (uSolid < 0.5 && texture2D(uAtlas, vUv).a < 0.5) discard;
  gl_FragColor = uDepthOut > 0.5 ? vec4(vDepth, 0.0, 0.0, 1.0) : vec4(0.0, 0.0, 0.0, 1.0);
}`;function Ft(){let l=[],S=[],A=[],y=[],V=[],C=[],F=0;return{add(E,P,I,N,z){P&&E.applyMatrix4(P);let g=E.attributes.position,H=E.attributes.normal,D=E.attributes.uv;for(let M=0;M<g.count;M++)l.push(g.getX(M),g.getY(M),g.getZ(M)),S.push(H.getX(M),H.getY(M),H.getZ(M)),A.push(D?D.getX(M):0,D?D.getY(M):0),y.push(I[0],I[1],I[2]),V.push(N,z(M));for(let M of E.index.array)C.push(M+F);F+=g.count,E.dispose()},build(){let E=new Tt;return E.setAttribute("position",new U(l,3)),E.setAttribute("normal",new U(S,3)),E.setAttribute("uv",new U(A,2)),E.setAttribute("aCol",new U(y,3)),E.setAttribute("aWind",new U(V,2)),E.setIndex(F>65535?new gt(C,1):new St(C,1)),E.computeBoundingBox(),E.computeBoundingSphere(),E}}}function Yt({renderer:l}){let S=Ft(),A=Ft(),y=new R,V=new R,C=new R,F=$.sun,E=F.az*Math.PI/180,P=F.el*Math.PI/180;y.set(Math.cos(P)*Math.cos(E),Math.sin(P),Math.cos(P)*Math.sin(E));let I=c(tt.front,(Q.y0+Q.y1)/2+40,(Q.z0+Q.z1)/2),N=(t,o)=>{let s=t.clone().sub(I),n=s.dot(y);return n>0&&s.addScaledVector(y,-n).length()<o};function z(t,o,s,n,r,i,u,v,d,h){let e=n.clone().normalize(),a=new R().crossVectors(e,kt);a.lengthSq()<1e-6&&a.set(1,0,0),a.normalize(),v&&a.applyAxisAngle(e,v);let m=new R().crossVectors(a,e).normalize(),w=new At(1,1,2,4),p=w.attributes.position,f=w.attributes.uv,T=[];for(let x=0;x<p.count;x++){let b=f.getX(x),k=f.getY(x),Z=(b-.5)*2;p.setXYZ(x,(b-.5)*r,k*i,(-u*k*k+.05*Z*Z)*i);let[st,Gt]=zt(t,b,k);f.setXY(x,st,Gt),T.push(k)}w.computeVertexNormals(),S.add(w,new J().makeBasis(a,e,m).setPosition(s),o,d,x=>Math.min(1,h+.3*T[x]))}function g(t,o,s,n,r,i,u,v,d=7){let h=s.clone().sub(o),e=h.length(),a=new bt(r,n,e,d,3),m=a.attributes.position,w=[];for(let f=0;f<m.count;f++)w.push(m.getY(f)/e+.5);let p=new J().compose(o.clone().add(s).multiplyScalar(.5),new wt().setFromUnitVectors(kt,h.normalize()),c(1,1,1));A.add(a,p,t,i,f=>u+(v-u)*w[f])}let H=(t,o,s=.3)=>{let n=1-s/2+s*o();return t.map(r=>r*n)};{let t=j(29),o=[.26,.22,.18],s=[.2,.4,.1],n=c(2700,G,980),r=c(2600,620,1e3);g(o,n,r,66,50,.2,0,.04,10);let i=c(1940,900,1e3),u=720,v=400,d=950,h=[];for(let e=0;h.length<36&&e<4e3;e++){let a=t()*Math.PI*2,m=Math.acos(1-2*t()),w=.65+.35*Math.cbrt(t()),p=c(i.x+u*w*Math.sin(m)*Math.cos(a),i.y+v*w*Math.cos(m)*.85,i.z+d*w*Math.sin(m)*Math.sin(a));p.x<B+120||p.y<600||N(p,150)||h.some(f=>f.distanceTo(p)<150)||h.push(p)}for(let e of h){let a=t()*6,m=r.clone().lerp(e,.55).add(c(0,120+80*t(),0));g(o,r,m,15,10,a,.04,.3,6),g(o,m,e,10,5,a,.3,.55,5);let w=5+Math.floor(t()*4);for(let p=0;p<w;p++){let f=t()*Math.PI*2,T=-.4+t()*.9,x=c(Math.cos(f)*Math.cos(T),Math.sin(T),Math.sin(f)*Math.cos(T)),b=e.clone().addScaledVector(x,30+90*t());N(b,95)||z(6,H(s,t),b,x.clone().add(c(0,-.45,0)).normalize(),130+50*t(),230+100*t(),.14,t()*3,a+t()*.5,.6+.3*t())}}}{let t=j(31),o=[.36,.31,.26],s=[.2,.42,.11],n=[1,.96,.86],r=c(1760,G,120),i=c(1740,120,140);g(o,r,i,34,27,.3,0,.05,9);let u=[],v=(d,h,e,a,m,w,p)=>{let f=d.clone().addScaledVector(h,e);if(f.x<B+90&&(f.x=B+90+t()*40),f.z<40&&(f.z=40+t()*30),g(o,d,f,a,a*.76,w,p,p+.18,7),m===0){u.push({p:f,dir:h,phase:w,flex:p+.18});return}let T=2+(t()<.5?1:0);for(let x=0;x<T;x++){let b=x/T*Math.PI*2+t()*1.2,k=.35+t()*.3,Z=c(Math.cos(b),0,Math.sin(b)),st=h.clone().multiplyScalar(Math.cos(k)).addScaledVector(Z,Math.sin(k)).add(c(0,.25,0)).normalize();v(f,st,e*(.72+t()*.15),a*.72,m-1,w+t()*.9,p+.18)}};for(let[d,h,e,a]of[[-.45,.75,.3,300],[-.2,.85,.55,300],[-.42,.42,.8,420]])v(i,c(d,h,e).normalize(),a,22,2,t()*6,.05);for(let d of u){let h=10+Math.floor(t()*5);for(let e=0;e<h;e++){let a=e/h*Math.PI*2+t()*.4,m=c(Math.cos(a),.3+t()*.5,Math.sin(a)).normalize();z(3,H(s,t),d.p.clone().addScaledVector(m,8),m,52+16*t(),180+60*t(),.22,(t()-.5)*.8,d.phase+t(),Math.min(.85,d.flex))}if(t()<.6)for(let e=0;e<5;e++){let a=e*1.25+t(),m=c(Math.cos(a)*.6,1,Math.sin(a)*.6).normalize();z(7,n,d.p.clone().addScaledVector(m,30+10*t()),m,46,46,0,t()*3,d.phase,Math.min(.9,d.flex+.1))}}}{let t=j(47),o=[.36,.42,.18],s=[.26,.5,.14],n=c(1480,G,300),r=c(1470,-40,310);g(o,n,r,32,24,1.1,0,.1,10);for(let i=0;i<8;i++){let u=i*2.39996+t()*.4,v=c(Math.cos(u),.9-i*.06,Math.sin(u)).normalize();v.x=Math.max(v.x,-.15),v.normalize(),z(3,H(s,t),r.clone().add(c(0,i*18,0)),v,170+40*t(),560+160*t(),.32,(t()-.5)*.5,1.1+t(),.3)}}{let t=j(53),o=[.24,.34,.12],s=[.13,.33,.1],n=c(1430,G+160,1010);for(let r=0;r<11;r++){let i=r*2.39996+t()*.6,u=.75+t()*.2,v=c(Math.cos(i)*(1-u),u,Math.sin(i)*(1-u)).normalize();v.x<-.12&&(v.x=-.12,v.normalize());let d=n.clone().addScaledVector(v,420+320*t());g(o,n,d,7,5,2+t(),.05,.4,5),z(0,H(s,t),d,c(Math.cos(i),.25-t()*.5,Math.sin(i)),170+80*t(),180+80*t(),.16,(t()-.5)*.6,2+t(),.45)}}{let t=j(61),o=[.16,.36,.1],s=new yt(1500,1500,40).translate(B+750,G+750,-40);A.add(s,null,[.78,.7,.6],0,()=>0);for(let n=0;n<260;n++){let r=B+40+Math.pow(t(),.8)*1400,i=G+300+t()*1180;if(t()>.35+.5*Math.sin((r-B)/300+i/260)**2)continue;let u=c((t()-.5)*.6,-.4-t()*.6,.35).normalize();z(1,H(o,t),c(r,i,-16+t()*8),u,48+20*t(),54+22*t(),.08,t()-.5,3+t()*2,.15+.2*t())}}let D=(()=>{let t=document.createElement("canvas");t.width=lt.w,t.height=lt.h,Dt(t.getContext("2d"),t.width,t.height);let o=new Ht(t);return o.colorSpace=Et,o.anisotropy=4,o})(),M=2048,et=new Mt(M,M,{type:mt,format:pt,depthBuffer:!0,minFilter:it,magFilter:it,generateMipmaps:!1}),X=new xt,ot={uT:{value:0},uAtlas:{value:D},uShade:{value:et.texture},uShadeAt:{value:X},uSunD:{value:y},uSunU:{value:V},uSunV:{value:C},uSunCol:{value:new R(2.3,1.75,1.05)},uSkyCol:{value:new R(.62,.68,.8)}},ut=t=>new ct({uniforms:{...ot,uSolid:{value:t}},vertexShader:It,fragmentShader:Wt,side:rt,alphaToCoverage:!t,toneMapped:!1}),nt={value:0},dt=t=>new ct({uniforms:{...ot,uSolid:{value:t},uDepthOut:nt},vertexShader:_t,fragmentShader:jt,side:rt,toneMapped:!1}),W={leafV:ut(0),woodV:ut(1),leafM:dt(0),woodM:dt(1)},O=S.build(),Y=A.build(),L=new Rt;L.visible=!1,L.add(new _(O,W.leafV),new _(Y,W.woodV));for(let t of L.children)t.frustumCulled=!1;let q=new Ct;q.add(new _(O,W.leafM),new _(Y,W.woodM));for(let t of q.children)t.frustumCulled=!1;function ft(t,o,s){let n=new Vt(s,-s,s,-s,1,3e4),r=new J().makeBasis(V.clone().negate(),C,y);return r.setPosition(V.clone().multiplyScalar(t).addScaledVector(C,o).addScaledVector(y,12e3)),n.matrixAutoUpdate=!1,n.matrix.copy(r),n.matrixWorld.copy(r),n.matrixWorldInverse.copy(r).invert(),n.updateProjectionMatrix(),n}let at=null,vt=null,Ut=new K(1,1,1),Bt=new K(-6e4,0,0),ht=new K;return{group:L,textures:[D],layout({D:t,U:o,V:s,uc:n,vc:r,h:i}){y.copy(t),V.copy(o),C.copy(s),at=ft(n,r,i);let u=Y.boundingBox.clone().union(O.boundingBox).expandByScalar(60),v=1/0,d=-1/0,h=1/0,e=-1/0;for(let m of[u.min.x,u.max.x])for(let w of[u.min.y,u.max.y])for(let p of[u.min.z,u.max.z]){let f=c(m,w,p),T=f.dot(V),x=f.dot(C);v=Math.min(v,T),d=Math.max(d,T),h=Math.min(h,x),e=Math.max(e,x)}let a=Math.max(d-v,e-h)/2;X.set((v+d)/2,(h+e)/2,a,1/M),vt=ft(X.x,X.y,a)},renderMask(t,o){if(ot.uT.value=o,!at)return;let s=l.getRenderTarget(),n=l.getClearAlpha();l.getClearColor(ht),nt.value=1,l.setClearColor(Bt,1),l.setRenderTarget(et),l.clear(),l.render(q,vt),nt.value=0,l.setClearColor(Ut,1),l.setRenderTarget(t),l.clear(),l.render(q,at),l.setRenderTarget(s),l.setClearColor(ht,n)},dispose(){O.dispose(),Y.dispose(),D.dispose(),et.dispose();for(let t of Object.values(W))t.dispose()}}}export{Yt as createGarden};
