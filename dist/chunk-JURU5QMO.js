import{c as v}from"./chunk-3RFTAFDB.js";import{e as s,f as l}from"./chunk-XMR7AKKY.js";import{B as i,L as h,N as f,X as c,Y as m}from"./chunk-X52R7RES.js";function d(){let{width:r,depth:a,thick:n,bevel:e}=l,o=new c;o.moveTo(0,-n),o.lineTo(a-e,-n),o.absarc(a-e,-n+e,e,-Math.PI/2,0,!1),o.lineTo(a,-e),o.absarc(a-e,-e,e,0,Math.PI/2,!1),o.lineTo(0,0),o.closePath();let t=new m(o,{depth:r,bevelEnabled:!1,curveSegments:6});return t.applyMatrix4(new i().set(0,0,-1,r/2,0,1,0,0,1,0,0,0,0,0,0,1)),t.computeVertexNormals(),t}var u=`
varying vec3 vPos;
varying vec3 vNormal;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vPos = w.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,x=`
${v}
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
    for (int k = 0; k < ${s.cols}; k++) {
      vec4 f = uFoot[uRow * ${s.cols} + k];   // x0, x1, bottom edge depth, height above the shelf
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
}`;function w(r){let a=d();return l.tops.map((n,e)=>{let o=new f({uniforms:{...r,uRow:{value:e}},vertexShader:u,fragmentShader:x,toneMapped:!1}),t=new h(a,o);return t.position.set(0,n,0),t.updateMatrixWorld(),t})}export{u as a,x as b,w as c};
