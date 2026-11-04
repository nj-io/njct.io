import{c as h}from"./chunk-NQ7PQZ2C.js";import{L as d,N as c,O as T,T as w,aa as u,j as v,n as g,o as m,s as R,y as f,z as p}from"./chunk-ZI4R4S5J.js";var S=`
out vec2 vWorld;
uniform vec4 uRegion; // world x0, y0, x1, y1 covered by the texture
void main() {
  vWorld = mix(uRegion.xy, uRegion.zw, uv);
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`,y=`
precision highp float;
in vec2 vWorld;
out vec4 outColor;
${h}
void main() {
  int row = rowAt(vWorld.y);
  float seen = mix(wallLight(1, vWorld, row), wallLight(0, vWorld, row), uKeyMix);
  float e = wallBase(vWorld) * seen * edgeShade(vWorld, row) + haloAt(vWorld, row);
  outColor = vec4(vec3(e), 1.0);
}`,F=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,M=`
uniform sampler2D uBake;
uniform float uGain;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(uBake, vUv).rgb * uGain;
  gl_FragColor = vec4(c, 1.0);
  #include <colorspace_fragment>
  float n = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  gl_FragColor.rgb += (n - 0.5) / 255.0;
}`;function b(r,H){let t=new p(4,4,{type:g,format:m,depthBuffer:!1,minFilter:v,magFilter:v,generateMipmaps:!1}),a=new c({glslVersion:R,uniforms:{...H,uRegion:{value:new f}},vertexShader:S,fragmentShader:y,depthTest:!1,depthWrite:!1}),E=new w;E.add(new d(new u(2,2),a));let W=new T,n=new c({uniforms:{uBake:{value:t.texture},uGain:{value:1}},vertexShader:F,fragmentShader:M,toneMapped:!1}),o=new d(new u(1,1),n);return o.renderOrder=-1,{mesh:o,resize(e,i,l,s,G,L,x=null){t.setSize(G,L),a.uniforms.uRegion.value.set(...x||[e,i,l,s]),o.scale.set(l-e,s-i,1),o.position.set((e+l)/2,(i+s)/2,0),o.updateMatrixWorld()},setGain(e){n.uniforms.uGain.value=e},bake(){let e=r.getRenderTarget();r.setRenderTarget(t),r.render(E,W),r.setRenderTarget(e)},dispose(){t.dispose(),a.dispose(),n.dispose(),o.geometry.dispose()}}}export{b as a};
