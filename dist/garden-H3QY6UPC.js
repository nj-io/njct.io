import{a as rt,b as bt,c as Vt}from"./chunk-4VAF4GAZ.js";import{j as $}from"./chunk-6PNQGI4Q.js";import{C as Mt,D as wt,E as F,F as xt,G as j,H as gt,I as it,L as Tt,M as St,Q as yt,R as Rt,V as Ct,b as nt,ba as Ht,e as at,j as vt,l as mt,q as ht,r as R,t as pt,u as Et,w as K,z as st}from"./chunk-AFKH3KZ4.js";var J=$.room,Q=$.window,P=J.front+J.wall,G=J.floor-70,zt=new R(0,1,0),c=(f,g,V)=>new R(f,g,V);function N(f){return()=>{f|=0,f=f+1831565813|0;let g=Math.imul(f^f>>>15,1|f);return g=g+Math.imul(g^g>>>7,61|g)^g,((g^g>>>14)>>>0)/4294967296}}var Dt=`
uniform float uT;
attribute vec2 aWind;
float njGust(float t) { return smoothstep(0.5, 0.95, 0.5 + 0.5 * sin(t * 0.131) * sin(t * 0.0713 + 1.3)); }
vec3 njWind(vec2 w) {
  float g = njGust(uT), f = w.y * w.y;
  float sway = 0.6 * sin(uT * 0.41 + w.x) + 0.4 * sin(uT * 0.263 + w.x * 1.7);
  float flutter = sin(uT * 5.1 + w.x * 9.0) * g;
  vec3 dir = normalize(vec3(-0.3, 0.0, 1.0));
  return dir * (w.y * (11.0 * sway + 14.0 * g * (0.6 + 0.4 * sin(uT * 1.7 + w.x))) + f * 5.0 * flutter) + vec3(0.0, f * 6.0 * flutter, 0.0);
}`,Bt=`
attribute vec3 aCol;
varying vec3 vP;
varying vec3 vN;
varying vec3 vCol;
varying vec2 vUv;
${Dt}
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  w.xyz += njWind(aWind);
  vP = w.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  vCol = aCol;
  vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Ft=`
uniform sampler2D uAtlas, uShade;
uniform vec3 uSunD, uSunU, uSunV, uSunCol, uSkyCol;
uniform vec4 uShadeAt;      // the garden's sun view: centre (u, v), half size, texel
uniform float uSolid;
varying vec3 vP;
varying vec3 vN;
varying vec3 vCol;
varying vec2 vUv;
float njLit(vec3 p) {
  vec2 uv = (vec2(dot(p, uSunU), dot(p, uSunV)) - uShadeAt.xy) / (2.0 * uShadeAt.z) + 0.5;
  float d = dot(p, uSunD) + 10.0, lit = 0.0;
  for (int i = 0; i < 4; i++) {
    vec2 o = vec2(i == 1 ? 1.0 : i == 3 ? -1.0 : 0.0, i == 0 ? 1.0 : i == 2 ? -1.0 : 0.0) * uShadeAt.w * 1.2;
    lit += step(texture2D(uShade, uv + o).g, d);
  }
  return lit * 0.25;
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
}`,Pt=`
uniform vec3 uSunD;
varying vec2 vUv;
varying float vDepth;
${Dt}
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  w.xyz += njWind(aWind);
  vUv = uv;
  vDepth = dot(w.xyz, uSunD);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Gt=`
uniform sampler2D uAtlas;
uniform float uSolid;
varying vec2 vUv;
varying float vDepth;
void main() {
  if (uSolid < 0.5 && texture2D(uAtlas, vUv).a < 0.5) discard;
  gl_FragColor = vec4(0.0, vDepth, 0.0, 1.0);
}`;function At(){let f=[],g=[],V=[],y=[],z=[],C=[],k=0;return{add(E,B,I,_,A){B&&E.applyMatrix4(B);let T=E.attributes.position,H=E.attributes.normal,D=E.attributes.uv;for(let x=0;x<T.count;x++)f.push(T.getX(x),T.getY(x),T.getZ(x)),g.push(H.getX(x),H.getY(x),H.getZ(x)),V.push(D?D.getX(x):0,D?D.getY(x):0),y.push(I[0],I[1],I[2]),z.push(_,A(x));for(let x of E.index.array)C.push(x+k);k+=T.count,E.dispose()},build(){let E=new xt;return E.setAttribute("position",new F(f,3)),E.setAttribute("normal",new F(g,3)),E.setAttribute("uv",new F(V,2)),E.setAttribute("aCol",new F(y,3)),E.setAttribute("aWind",new F(z,2)),E.setIndex(k>65535?new wt(C,1):new Mt(C,1)),E.computeBoundingBox(),E.computeBoundingSphere(),E}}}function Nt({renderer:f}){let g=At(),V=At(),y=new R,z=new R,C=new R,k=$.sun,E=k.az*Math.PI/180,B=k.el*Math.PI/180;y.set(Math.cos(B)*Math.cos(E),Math.sin(B),Math.cos(B)*Math.sin(E));let I=c(J.front,(Q.y0+Q.y1)/2+40,(Q.z0+Q.z1)/2),_=(t,o)=>{let a=t.clone().sub(I),n=a.dot(y);return n>0&&a.addScaledVector(y,-n).length()<o};function A(t,o,a,n,i,r,l,v,u,m){let e=n.clone().normalize(),s=new R().crossVectors(e,zt);s.lengthSq()<1e-6&&s.set(1,0,0),s.normalize(),v&&s.applyAxisAngle(e,v);let h=new R().crossVectors(s,e).normalize(),M=new Ct(1,1,2,4),p=M.attributes.position,d=M.attributes.uv,S=[];for(let w=0;w<p.count;w++){let b=d.getX(w),U=d.getY(w),Z=(b-.5)*2;p.setXYZ(w,(b-.5)*i,U*r,(-l*U*U+.05*Z*Z)*r);let[ot,kt]=bt(t,b,U);d.setXY(w,ot,kt),S.push(U)}M.computeVertexNormals(),g.add(M,new K().makeBasis(s,e,h).setPosition(a),o,u,w=>Math.min(1,m+.3*S[w]))}function T(t,o,a,n,i,r,l,v,u=7){let m=a.clone().sub(o),e=m.length(),s=new Rt(i,n,e,u,3),h=s.attributes.position,M=[];for(let d=0;d<h.count;d++)M.push(h.getY(d)/e+.5);let p=new K().compose(o.clone().add(a).multiplyScalar(.5),new ht().setFromUnitVectors(zt,m.normalize()),c(1,1,1));V.add(s,p,t,r,d=>l+(v-l)*M[d])}let H=(t,o,a=.3)=>{let n=1-a/2+a*o();return t.map(i=>i*n)};{let t=N(29),o=[.26,.22,.18],a=[.2,.4,.1],n=c(2700,G,980),i=c(2600,620,1e3);T(o,n,i,66,50,.2,0,.04,10);let r=c(1940,900,1e3),l=720,v=400,u=950,m=[];for(let e=0;m.length<36&&e<4e3;e++){let s=t()*Math.PI*2,h=Math.acos(1-2*t()),M=.65+.35*Math.cbrt(t()),p=c(r.x+l*M*Math.sin(h)*Math.cos(s),r.y+v*M*Math.cos(h)*.85,r.z+u*M*Math.sin(h)*Math.sin(s));p.x<P+120||p.y<600||_(p,150)||m.some(d=>d.distanceTo(p)<150)||m.push(p)}for(let e of m){let s=t()*6,h=i.clone().lerp(e,.55).add(c(0,120+80*t(),0));T(o,i,h,15,10,s,.04,.3,6),T(o,h,e,10,5,s,.3,.55,5);let M=7+Math.floor(t()*6);for(let p=0;p<M;p++){let d=t()*Math.PI*2,S=-.4+t()*.9,w=c(Math.cos(d)*Math.cos(S),Math.sin(S),Math.sin(d)*Math.cos(S)),b=e.clone().addScaledVector(w,30+90*t());_(b,95)||A(6,H(a,t),b,w.clone().add(c(0,-.45,0)).normalize(),95+40*t(),160+80*t(),.14,t()*3,s+t()*.5,.6+.3*t())}}}{let t=N(31),o=[.36,.31,.26],a=[.2,.42,.11],n=[1,.96,.86],i=c(1760,G,120),r=c(1740,120,140);T(o,i,r,34,27,.3,0,.05,9);let l=[],v=(u,m,e,s,h,M,p)=>{let d=u.clone().addScaledVector(m,e);if(d.x<P+90&&(d.x=P+90+t()*40),d.z<40&&(d.z=40+t()*30),T(o,u,d,s,s*.76,M,p,p+.18,7),h===0){l.push({p:d,dir:m,phase:M,flex:p+.18});return}let S=2+(t()<.5?1:0);for(let w=0;w<S;w++){let b=w/S*Math.PI*2+t()*1.2,U=.35+t()*.3,Z=c(Math.cos(b),0,Math.sin(b)),ot=m.clone().multiplyScalar(Math.cos(U)).addScaledVector(Z,Math.sin(U)).add(c(0,.25,0)).normalize();v(d,ot,e*(.72+t()*.15),s*.72,h-1,M+t()*.9,p+.18)}};for(let[u,m,e]of[[-.45,.75,.3],[-.2,.85,.55],[.2,.8,.45]])v(r,c(u,m,e).normalize(),300,22,2,t()*6,.05);for(let u of l){let m=10+Math.floor(t()*5);for(let e=0;e<m;e++){let s=e/m*Math.PI*2+t()*.4,h=c(Math.cos(s),.3+t()*.5,Math.sin(s)).normalize();A(3,H(a,t),u.p.clone().addScaledVector(h,8),h,52+16*t(),180+60*t(),.22,(t()-.5)*.8,u.phase+t(),Math.min(.85,u.flex))}if(t()<.6)for(let e=0;e<5;e++){let s=e*1.25+t(),h=c(Math.cos(s)*.6,1,Math.sin(s)*.6).normalize();A(7,n,u.p.clone().addScaledVector(h,30+10*t()),h,46,46,0,t()*3,u.phase,Math.min(.9,u.flex+.1))}}}{let t=N(47),o=[.36,.42,.18],a=[.26,.5,.14],n=c(1480,G,300),i=c(1470,-40,310);T(o,n,i,32,24,1.1,0,.1,10);for(let r=0;r<8;r++){let l=r*2.39996+t()*.4,v=c(Math.cos(l),.9-r*.06,Math.sin(l)).normalize();v.x=Math.max(v.x,-.15),v.normalize(),A(3,H(a,t),i.clone().add(c(0,r*18,0)),v,170+40*t(),560+160*t(),.32,(t()-.5)*.5,1.1+t(),.3)}}{let t=N(53),o=[.24,.34,.12],a=[.13,.33,.1],n=c(1430,G+160,1010);for(let i=0;i<11;i++){let r=i*2.39996+t()*.6,l=.75+t()*.2,v=c(Math.cos(r)*(1-l),l,Math.sin(r)*(1-l)).normalize();v.x<-.12&&(v.x=-.12,v.normalize());let u=n.clone().addScaledVector(v,420+320*t());T(o,n,u,7,5,2+t(),.05,.4,5),A(0,H(a,t),u,c(Math.cos(r),.25-t()*.5,Math.sin(r)),170+80*t(),180+80*t(),.16,(t()-.5)*.6,2+t(),.45)}}{let t=N(61),o=[.16,.36,.1],a=new gt(1500,1500,40).translate(P+750,G+750,-40);V.add(a,null,[.78,.7,.6],0,()=>0);for(let n=0;n<260;n++){let i=P+40+Math.pow(t(),.8)*1400,r=G+300+t()*1180;if(t()>.35+.5*Math.sin((i-P)/300+r/260)**2)continue;let l=c((t()-.5)*.6,-.4-t()*.6,.35).normalize();A(1,H(o,t),c(i,r,-16+t()*8),l,48+20*t(),54+22*t(),.08,t()-.5,3+t()*2,.15+.2*t())}}let D=(()=>{let t=document.createElement("canvas");t.width=rt.w,t.height=rt.h,Vt(t.getContext("2d"),t.width,t.height);let o=new yt(t);return o.colorSpace=mt,o.anisotropy=4,o})(),x=new Et(1024,1024,{type:vt,depthBuffer:!0,minFilter:at,magFilter:at,generateMipmaps:!1}),X=new pt,tt={uT:{value:0},uAtlas:{value:D},uShade:{value:x.texture},uShadeAt:{value:X},uSunD:{value:y},uSunU:{value:z},uSunV:{value:C},uSunCol:{value:new R(2.3,1.75,1.05)},uSkyCol:{value:new R(.62,.68,.8)}},ct=t=>new it({uniforms:{...tt,uSolid:{value:t}},vertexShader:Bt,fragmentShader:Ft,side:nt,alphaToCoverage:!t,toneMapped:!1}),lt=t=>new it({uniforms:{...tt,uSolid:{value:t}},vertexShader:Pt,fragmentShader:Gt,side:nt,toneMapped:!1}),W={leafV:ct(0),woodV:ct(1),leafM:lt(0),woodM:lt(1)},Y=g.build(),L=V.build(),q=new Tt;q.visible=!1,q.add(new j(Y,W.leafV),new j(L,W.woodV));for(let t of q.children)t.frustumCulled=!1;let O=new St;O.add(new j(Y,W.leafM),new j(L,W.woodM));for(let t of O.children)t.frustumCulled=!1;function ut(t,o,a){let n=new Ht(a,-a,a,-a,1,3e4),i=new K().makeBasis(z.clone().negate(),C,y);return i.setPosition(z.clone().multiplyScalar(t).addScaledVector(C,o).addScaledVector(y,12e3)),n.matrixAutoUpdate=!1,n.matrix.copy(i),n.matrixWorld.copy(i),n.matrixWorldInverse.copy(i).invert(),n.updateProjectionMatrix(),n}let et=null,dt=null,Ut=new st(1,-6e4,0),ft=new st;return{group:q,textures:[D],layout({D:t,U:o,V:a,uc:n,vc:i,h:r}){y.copy(t),z.copy(o),C.copy(a),et=ut(n,i,r);let l=L.boundingBox.clone().union(Y.boundingBox).expandByScalar(60),v=1/0,u=-1/0,m=1/0,e=-1/0;for(let h of[l.min.x,l.max.x])for(let M of[l.min.y,l.max.y])for(let p of[l.min.z,l.max.z]){let d=c(h,M,p),S=d.dot(z),w=d.dot(C);v=Math.min(v,S),u=Math.max(u,S),m=Math.min(m,w),e=Math.max(e,w)}let s=Math.max(u-v,e-m)/2;X.set((v+u)/2,(m+e)/2,s,1/1024),dt=ut(X.x,X.y,s)},renderMask(t,o){if(tt.uT.value=o,!et)return;let a=f.getRenderTarget(),n=f.getClearAlpha();f.getClearColor(ft),f.setClearColor(Ut,1),f.setRenderTarget(x),f.clear(),f.render(O,dt),f.setRenderTarget(t),f.clear(),f.render(O,et),f.setRenderTarget(a),f.setClearColor(ft,n)},dispose(){Y.dispose(),L.dispose(),D.dispose(),x.dispose();for(let t of Object.values(W))t.dispose()}}}export{Nt as createGarden};
