// Two white floating shelves: a box with rounded front edges, lit by the same soft boxes as the wall.
// The top surface darkens where a sleeve stands on it (contact shadow).
import * as THREE from 'three';
import { SHELF, SLEEVE } from './config.js';
import { LIGHT_GLSL } from './lighting.js';

function shelfGeometry() {
  const { width, depth, thick, bevel: r } = SHELF;
  // Profile in (z, y): back at z = 0, front at z = depth, top at y = 0.
  const s = new THREE.Shape();
  s.moveTo(0, -thick);
  s.lineTo(depth - r, -thick);
  s.absarc(depth - r, -thick + r, r, -Math.PI / 2, 0, false);
  s.lineTo(depth, -r);
  s.absarc(depth - r, -r, r, 0, Math.PI / 2, false);
  s.lineTo(0, 0);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: width, bevelEnabled: false, curveSegments: 6 });
  // Shape x -> world z, shape y -> world y, extrusion -> world -x.
  g.applyMatrix4(new THREE.Matrix4().set(0, 0, -1, width / 2, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1)); // det +1: winding kept
  g.computeVertexNormals();
  return g;
}

const VERT = /* glsl */`
varying vec3 vPos;
varying vec3 vNormal;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vPos = w.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const FRAG = /* glsl */`
${LIGHT_GLSL}
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
    for (int k = 0; k < ${SLEEVE.cols}; k++) {
      vec4 f = uFoot[uRow * ${SLEEVE.cols} + k];   // x0, x1, bottom edge depth, height above the shelf
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
}`;

export function createShelves(uniforms) {
  const geo = shelfGeometry();
  return SHELF.tops.map((top, row) => {
    const mat = new THREE.ShaderMaterial({
      uniforms: { ...uniforms, uRow: { value: row } },
      vertexShader: VERT, fragmentShader: FRAG, toneMapped: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, top, 0);
    mesh.updateMatrixWorld();
    return mesh;
  });
}

// The shelf shaders, for the sun pass (scene/sun.js), which builds its own variants of them.
export { VERT as SHELF_VERT, FRAG as SHELF_FRAG };
