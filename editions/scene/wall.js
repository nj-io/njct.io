// The wall: lit into a half-resolution float texture whenever an occluder moves (bake), then drawn as
// one plane at z = 0 that samples it, with dithering so the soft gradients never band.
import * as THREE from 'three';
import { LIGHT_GLSL } from './lighting.js';

const BAKE_VERT = /* glsl */`
out vec2 vWorld;
uniform vec4 uRegion; // world x0, y0, x1, y1 covered by the texture
void main() {
  vWorld = mix(uRegion.xy, uRegion.zw, uv);
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

const BAKE_FRAG = /* glsl */`
precision highp float;
in vec2 vWorld;
out vec4 outColor;
${LIGHT_GLSL}
void main() {
  int row = rowAt(vWorld.y);
  float seen = mix(wallLight(1, vWorld, row), wallLight(0, vWorld, row), uKeyMix);
  float e = wallBase(vWorld) * seen * edgeShade(vWorld, row) + haloAt(vWorld, row);
  outColor = vec4(vec3(e), 1.0);
}`;

const WALL_VERT = /* glsl */`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

// Interleaved gradient noise, +-0.5 of an 8-bit step after encoding, so the soft gradients never band.
const WALL_FRAG = /* glsl */`
uniform sampler2D uBake;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(uBake, vUv).rgb;
  gl_FragColor = vec4(c, 1.0);
  #include <colorspace_fragment>
  float n = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  gl_FragColor.rgb += (n - 0.5) / 255.0;
}`;

export function createWall(renderer, uniforms) {
  const target = new THREE.WebGLRenderTarget(4, 4, {
    type: THREE.HalfFloatType, format: THREE.RGBAFormat, depthBuffer: false,
    minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, generateMipmaps: false,
  });
  const bakeMat = new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    uniforms: { ...uniforms, uRegion: { value: new THREE.Vector4() } },
    vertexShader: BAKE_VERT, fragmentShader: BAKE_FRAG, depthTest: false, depthWrite: false,
  });
  const bakeScene = new THREE.Scene();
  bakeScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bakeMat));
  const bakeCam = new THREE.Camera();

  const mat = new THREE.ShaderMaterial({
    uniforms: { uBake: { value: target.texture } },
    vertexShader: WALL_VERT, fragmentShader: WALL_FRAG, toneMapped: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
  mesh.renderOrder = -1;

  return {
    mesh,
    // Cover the world rectangle (x0, y0)-(x1, y1) at texW x texH texels.
    resize(x0, y0, x1, y1, texW, texH) {
      target.setSize(texW, texH);
      bakeMat.uniforms.uRegion.value.set(x0, y0, x1, y1);
      mesh.scale.set(x1 - x0, y1 - y0, 1);
      mesh.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0);
      mesh.updateMatrixWorld();
    },
    bake() {
      const prev = renderer.getRenderTarget();
      renderer.setRenderTarget(target);
      renderer.render(bakeScene, bakeCam);
      renderer.setRenderTarget(prev);
    },
    dispose() { target.dispose(); bakeMat.dispose(); mat.dispose(); mesh.geometry.dispose(); },
  };
}
