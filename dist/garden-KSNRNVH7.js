import{a as dt,b as kt,c as Ft}from"./chunk-4VAF4GAZ.js";import{j as K}from"./chunk-6PNQGI4Q.js";import{B as $,E as J,H as yt,I as Tt,J as U,K as Rt,L as N,M as bt,N as ut,Q as Ct,R as Ht,V as zt,W as At,_ as Vt,b as ct,ga as Dt,i as lt,n as wt,p as xt,q as Et,v as gt,w as H,y as Mt,z as St}from"./chunk-X52R7RES.js";var tt=K.room,Q=K.window,k=tt.front+tt.wall,et=k+3,j=tt.floor-70,Pt=new H(0,1,0),l=(u,E,A)=>new H(u,E,A);function W(u){return()=>{u|=0,u=u+1831565813|0;let E=Math.imul(u^u>>>15,1|u);return E=E+Math.imul(E^E>>>7,61|E)^E,((E^E>>>14)>>>0)/4294967296}}var Ut=`
uniform float uT;
attribute vec2 aWind;
float njGust(float t) { return smoothstep(0.35, 0.9, 0.5 + 0.5 * sin(t * 0.23) * sin(t * 0.113 + 1.3)); }
vec3 njWind(vec2 w) {
  float g = njGust(uT), f = w.y * w.y;
  float sway = 0.6 * sin(uT * 0.55 + w.x) + 0.4 * sin(uT * 0.37 + w.x * 1.7);
  float flutter = sin(uT * 5.6 + w.x * 9.0) * (0.25 + g);       // leaves never quite still; more in a gust
  vec3 dir = normalize(vec3(-0.3, 0.0, 1.0));
  return dir * (w.y * (22.0 * sway + 30.0 * g * (0.6 + 0.4 * sin(uT * 2.1 + w.x))) + f * 10.0 * flutter) + vec3(0.0, f * 12.0 * flutter, 0.0);
}
// The street front and the neighbour's wall stop what the wind moves: a leaf pushed against the glass lies
// flat on it. (Rigid parts, w.y 0, are built clear of both.)
vec3 njBarrier(vec3 p, vec2 w) {
  if (w.y <= 0.0) return p;
  return vec3(max(p.x, ${et.toFixed(1)}), p.y, max(p.z, -18.0));
}`,Nt=`
attribute vec3 aCol;
varying vec3 vP;
varying vec3 vN;
varying vec3 vCol;
varying vec2 vUv;
${Ut}
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  w.xyz = njBarrier(w.xyz + njWind(aWind), aWind);
  vP = w.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  vCol = aCol;
  vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,_t=`
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
  vec3 col = c * light;
  // a leaf pressed on the glass: no air between, so it reads darker and deeper in colour where it touches
  float gap = max(vP.x - ${et.toFixed(1)}, 0.0), touch = exp(-gap / 12.0) * (1.0 - uSolid);
  float grey = dot(col, vec3(0.3, 0.59, 0.11));
  col = mix(col, mix(vec3(grey), col, 1.35) * 0.62, touch);
  // and the air: what stands further out is softer, toward the haze of the soi
  col = mix(col, vec3(1.05, 0.97, 0.86), (1.0 - exp(-gap / 2600.0)) * 0.32);
  gl_FragColor = vec4(col, cover);
  #include <colorspace_fragment>
}`,Xt=`
uniform vec3 uSunD;
varying vec2 vUv;
varying float vDepth;
${Ut}
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  w.xyz = njBarrier(w.xyz + njWind(aWind), aWind);
  vUv = uv;
  vDepth = dot(w.xyz, uSunD);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Ot=`
uniform sampler2D uAtlas;
uniform float uSolid, uDepthOut;
varying vec2 vUv;
varying float vDepth;
void main() {
  if (uSolid < 0.5 && texture2D(uAtlas, vUv).a < 0.5) discard;
  gl_FragColor = uDepthOut > 0.5 ? vec4(vDepth, 0.0, 0.0, 1.0) : vec4(0.0, 0.0, 0.0, 1.0);
}`;function Bt(){let u=[],E=[],A=[],b=[],V=[],z=[],F=0;return{add(w,P,G,_,ot){P&&w.applyMatrix4(P);let y=w.attributes.position,R=w.attributes.normal,C=w.attributes.uv;for(let x=0;x<y.count;x++)u.push(y.getX(x),y.getY(x),y.getZ(x)),E.push(R.getX(x),R.getY(x),R.getZ(x)),A.push(C?C.getX(x):0,C?C.getY(x):0),b.push(G[0],G[1],G[2]),V.push(_,ot(x));for(let x of w.index.array)z.push(x+F);F+=y.count,w.dispose()},build(){let w=new Rt;return w.setAttribute("position",new U(u,3)),w.setAttribute("normal",new U(E,3)),w.setAttribute("uv",new U(A,2)),w.setAttribute("aCol",new U(b,3)),w.setAttribute("aWind",new U(V,2)),w.setIndex(F>65535?new Tt(z,1):new yt(z,1)),w.computeBoundingBox(),w.computeBoundingSphere(),w}}}function Zt({renderer:u}){let E=Bt(),A=Bt(),b=new H,V=new H,z=new H,F=K.sun,w=F.az*Math.PI/180,P=F.el*Math.PI/180;b.set(Math.cos(P)*Math.cos(w),Math.sin(P),Math.cos(P)*Math.sin(w));let G=l(tt.front,(Q.y0+Q.y1)/2+40,(Q.z0+Q.z1)/2),_=(t,o)=>{let a=t.clone().sub(G),e=a.dot(b);return e>0&&a.addScaledVector(b,-e).length()<o},ot=W(97);function y(t,o,a,e,s,r,d,h,f,m){a.clone().addScaledVector(e.clone().normalize(),r).x<et+10&&!(a.x-et<90&&ot()<.35)&&(e=e.clone(),e.x=Math.abs(e.x)+.15);let n=e.clone().normalize(),c=new H().crossVectors(n,Pt);c.lengthSq()<1e-6&&c.set(1,0,0),c.normalize(),h&&c.applyAxisAngle(n,h);let g=new H().crossVectors(c,n).normalize(),p=new Vt(1,1,2,4),v=p.attributes.position,S=p.attributes.uv,T=[];for(let M=0;M<v.count;M++){let B=S.getX(M),D=S.getY(M),Z=(B-.5)*2;v.setXYZ(M,(B-.5)*s,D*r,(-d*D*D+.05*Z*Z)*r);let[Gt,It]=kt(t,B,D);S.setXY(M,Gt,It),T.push(D)}p.computeVertexNormals(),E.add(p,new $().makeBasis(c,n,g).setPosition(a),o,f,M=>Math.min(1,m+.3*T[M]))}function R(t,o,a,e,s,r,d,h,f=7){let m=a.clone().sub(o),i=m.length(),n=new At(s,e,i,f,3),c=n.attributes.position,g=[];for(let v=0;v<c.count;v++)g.push(c.getY(v)/i+.5);let p=new $().compose(o.clone().add(a).multiplyScalar(.5),new gt().setFromUnitVectors(Pt,m.normalize()),l(1,1,1));A.add(n,p,t,r,v=>d+(h-d)*g[v])}let C=(t,o,a=.3)=>{let e=1-a/2+a*o();return t.map(s=>s*e)};{let t=W(29),o=[.26,.22,.18],a=[.2,.4,.1],e=l(2700,j,980),s=l(2600,620,1e3);R(o,e,s,66,50,.2,0,.04,10);let r=l(1940,900,1e3),d=720,h=400,f=950,m=[];for(let i=0;m.length<36&&i<4e3;i++){let n=t()*Math.PI*2,c=Math.acos(1-2*t()),g=.65+.35*Math.cbrt(t()),p=l(r.x+d*g*Math.sin(c)*Math.cos(n),r.y+h*g*Math.cos(c)*.85,r.z+f*g*Math.sin(c)*Math.sin(n));p.x<k+120||p.y<600||_(p,150)||m.some(v=>v.distanceTo(p)<150)||m.push(p)}for(let i of m){let n=t()*6,c=s.clone().lerp(i,.55).add(l(0,120+80*t(),0));R(o,s,c,15,10,n,.04,.3,6),R(o,c,i,10,5,n,.3,.55,5);let g=5+Math.floor(t()*4);for(let p=0;p<g;p++){let v=t()*Math.PI*2,S=-.4+t()*.9,T=l(Math.cos(v)*Math.cos(S),Math.sin(S),Math.sin(v)*Math.cos(S)),M=i.clone().addScaledVector(T,30+90*t());_(M,95)||y(6,C(a,t),M,T.clone().add(l(0,-.45,0)).normalize(),130+50*t(),230+100*t(),.14,t()*3,n+t()*.5,.6+.3*t())}}}{let t=W(31),o=[.36,.31,.26],a=[.2,.42,.11],e=[1,.96,.86],s=l(1760,j,120),r=l(1740,120,140);R(o,s,r,34,27,.3,0,.05,9);let d=[],h=(f,m,i,n,c,g,p)=>{let v=f.clone().addScaledVector(m,i);if(v.x<k+90&&(v.x=k+90+t()*40),v.z<40&&(v.z=40+t()*30),R(o,f,v,n,n*.76,g,p,p+.18,7),c===0){d.push({p:v,dir:m,phase:g,flex:p+.18});return}let S=2+(t()<.5?1:0);for(let T=0;T<S;T++){let M=T/S*Math.PI*2+t()*1.2,B=.35+t()*.3,D=l(Math.cos(M),0,Math.sin(M)),Z=m.clone().multiplyScalar(Math.cos(B)).addScaledVector(D,Math.sin(B)).add(l(0,.25,0)).normalize();h(v,Z,i*(.72+t()*.15),n*.72,c-1,g+t()*.9,p+.18)}};for(let[f,m,i,n]of[[-.45,.75,.3,300],[-.2,.85,.55,300],[-.42,.42,.8,420]])h(r,l(f,m,i).normalize(),n,22,2,t()*6,.05);for(let f of d){let m=10+Math.floor(t()*5);for(let i=0;i<m;i++){let n=i/m*Math.PI*2+t()*.4,c=l(Math.cos(n),.3+t()*.5,Math.sin(n)).normalize();y(3,C(a,t),f.p.clone().addScaledVector(c,8),c,52+16*t(),180+60*t(),.22,(t()-.5)*.8,f.phase+t(),Math.min(.85,f.flex))}if(t()<.6)for(let i=0;i<5;i++){let n=i*1.25+t(),c=l(Math.cos(n)*.6,1,Math.sin(n)*.6).normalize();y(7,e,f.p.clone().addScaledVector(c,30+10*t()),c,46,46,0,t()*3,f.phase,Math.min(.9,f.flex+.1))}}}{let t=W(47),o=[.36,.42,.18],a=[.26,.5,.14],e=l(1480,j,300),s=l(1470,-40,310);R(o,e,s,32,24,1.1,0,.1,10);for(let r=0;r<8;r++){let d=r*2.39996+t()*.4,h=l(Math.cos(d),.9-r*.06,Math.sin(d)).normalize();h.x=Math.max(h.x,-.15),h.normalize(),y(3,C(a,t),s.clone().add(l(0,r*18,0)),h,170+40*t(),560+160*t(),.32,(t()-.5)*.5,1.1+t(),.3)}}{let t=W(53),o=[.24,.34,.12],a=[.13,.33,.1],e=l(1430,j+160,1010);for(let s=0;s<11;s++){let r=s*2.39996+t()*.6,d=.75+t()*.2,h=l(Math.cos(r)*(1-d),d,Math.sin(r)*(1-d)).normalize();h.x<-.12&&(h.x=-.12,h.normalize());let f=e.clone().addScaledVector(h,420+320*t());R(o,e,f,7,5,2+t(),.05,.4,5),y(0,C(a,t),f,l(Math.cos(r),.25-t()*.5,Math.sin(r)),170+80*t(),180+80*t(),.16,(t()-.5)*.6,2+t(),.45)}}{let t=W(61),o=[.16,.36,.1],a=new bt(1500,1500,40).translate(k+750,j+750,-40);A.add(a,null,[.78,.7,.6],0,()=>0);for(let e=0;e<260;e++){let s=k+40+Math.pow(t(),.8)*1400,r=j+300+t()*1180;if(t()>.35+.5*Math.sin((s-k)/300+r/260)**2)continue;let d=l((t()-.5)*.6,-.4-t()*.6,.35).normalize();y(1,C(o,t),l(s,r,-16+t()*8),d,48+20*t(),54+22*t(),.08,t()-.5,3+t()*2,.15+.2*t())}}let x=(()=>{let t=document.createElement("canvas");t.width=dt.w,t.height=dt.h,Ft(t.getContext("2d"),t.width,t.height);let o=new zt(t);return o.colorSpace=Et,o.anisotropy=4,o})(),at=2048,nt=new St(at,at,{type:wt,format:xt,depthBuffer:!0,minFilter:lt,magFilter:lt,generateMipmaps:!1}),X=new Mt,st={uT:{value:0},uAtlas:{value:x},uShade:{value:nt.texture},uShadeAt:{value:X},uSunD:{value:b},uSunU:{value:V},uSunV:{value:z},uSunCol:{value:new H(2.3,1.75,1.05)},uSkyCol:{value:new H(.62,.68,.8)}},ft=t=>new ut({uniforms:{...st,uSolid:{value:t}},vertexShader:Nt,fragmentShader:_t,side:ct,alphaToCoverage:!t,toneMapped:!1}),rt={value:0},ht=t=>new ut({uniforms:{...st,uSolid:{value:t},uDepthOut:rt},vertexShader:Xt,fragmentShader:Ot,side:ct,toneMapped:!1}),I={leafV:ft(0),woodV:ft(1),leafM:ht(0),woodM:ht(1)},O=E.build(),Y=A.build(),L=new Ct;L.visible=!1,L.add(new N(O,I.leafV),new N(Y,I.woodV));for(let t of L.children)t.frustumCulled=!1;let q=new Ht;q.add(new N(O,I.leafM),new N(Y,I.woodM));for(let t of q.children)t.frustumCulled=!1;function vt(t,o,a){let e=new Dt(a,-a,a,-a,1,3e4),s=new $().makeBasis(V.clone().negate(),z,b);return s.setPosition(V.clone().multiplyScalar(t).addScaledVector(z,o).addScaledVector(b,12e3)),e.matrixAutoUpdate=!1,e.matrix.copy(s),e.matrixWorld.copy(s),e.matrixWorldInverse.copy(s).invert(),e.updateProjectionMatrix(),e}let it=null,mt=null,jt=new J(1,1,1),Wt=new J(-6e4,0,0),pt=new J;return{group:L,textures:[x],layout({D:t,U:o,V:a,uc:e,vc:s,h:r}){b.copy(t),V.copy(o),z.copy(a),it=vt(e,s,r);let d=Y.boundingBox.clone().union(O.boundingBox).expandByScalar(60),h=1/0,f=-1/0,m=1/0,i=-1/0;for(let c of[d.min.x,d.max.x])for(let g of[d.min.y,d.max.y])for(let p of[d.min.z,d.max.z]){let v=l(c,g,p),S=v.dot(V),T=v.dot(z);h=Math.min(h,S),f=Math.max(f,S),m=Math.min(m,T),i=Math.max(i,T)}let n=Math.max(f-h,i-m)/2;X.set((h+f)/2,(m+i)/2,n,1/at),mt=vt(X.x,X.y,n)},renderMask(t,o){if(st.uT.value=o,!it)return;let a=u.getRenderTarget(),e=u.getClearAlpha();u.getClearColor(pt),rt.value=1,u.setClearColor(Wt,1),u.setRenderTarget(nt),u.clear(),u.render(q,mt),rt.value=0,u.setClearColor(jt,1),u.setRenderTarget(t),u.clear(),u.render(q,it),u.setRenderTarget(a),u.setClearColor(pt,e)},dispose(){O.dispose(),Y.dispose(),x.dispose(),nt.dispose();for(let t of Object.values(I))t.dispose()}}}export{Zt as createGarden};
