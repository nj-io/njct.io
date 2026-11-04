// Details background: the shelf scene drawn into a multisampled sRGB target, blurred with a separable
// Gaussian at half resolution, and composited behind the sleeve in focus. The blurred background is
// cached while nothing behind the sleeve moves.
import * as THREE from 'three';

const QUAD_VERT = /* glsl */`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

// 13-tap Gaussian along uDir; the taps spread out for wide blurs (sigma in texels).
const BLUR_FRAG = /* glsl */`
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
}`;

const COMPOSITE_FRAG = /* glsl */`
uniform sampler2D uSharp;
uniform sampler2D uBlur;
uniform float uMix;
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(mix(texture2D(uSharp, vUv).rgb, texture2D(uBlur, vUv).rgb, uMix), 1.0);
  #include <colorspace_fragment>
}`;

export function createPost(renderer) {
  const sharp = new THREE.WebGLRenderTarget(4, 4, { samples: 4, colorSpace: THREE.SRGBColorSpace });
  const opts = { type: THREE.HalfFloatType, depthBuffer: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter };
  const a = new THREE.WebGLRenderTarget(4, 4, opts), b = new THREE.WebGLRenderTarget(4, 4, opts);
  const blur = new THREE.ShaderMaterial({
    uniforms: { uTex: { value: null }, uDir: { value: new THREE.Vector2() }, uSigma: { value: 0 } },
    vertexShader: QUAD_VERT, fragmentShader: BLUR_FRAG, depthTest: false, depthWrite: false,
  });
  const comp = new THREE.ShaderMaterial({
    uniforms: { uSharp: { value: sharp.texture }, uBlur: { value: a.texture }, uMix: { value: 0 } },
    vertexShader: QUAD_VERT, fragmentShader: COMPOSITE_FRAG, depthTest: false, depthWrite: false,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blur);
  quad.frustumCulled = false;
  const qs = new THREE.Scene(); qs.add(quad);
  const qc = new THREE.Camera();
  let cssToTexel = 0.5;
  const pass = (mat, target) => { quad.material = mat; renderer.setRenderTarget(target); renderer.render(qs, qc); };

  return {
    resize(w, h) {   // drawing-buffer size in device pixels
      sharp.setSize(w, h);
      a.setSize(Math.ceil(w / 2), Math.ceil(h / 2));
      b.setSize(Math.ceil(w / 2), Math.ceil(h / 2));
      cssToTexel = renderer.getPixelRatio() / 2;
    },
    // Draw the background (camera layer 0) and blur it by sigma CSS px.
    background(scene, camera, sigmaCss) {
      const prev = renderer.getRenderTarget();
      renderer.setRenderTarget(sharp);
      renderer.clear();
      renderer.render(scene, camera);
      const s = sigmaCss * cssToTexel;
      blur.uniforms.uSigma.value = s;
      blur.uniforms.uTex.value = sharp.texture;
      blur.uniforms.uDir.value.set(1 / a.width, 0);
      pass(blur, b);   // downsample + horizontal (the half-size target filters the full-size one)
      blur.uniforms.uTex.value = b.texture;
      blur.uniforms.uDir.value.set(0, 1 / a.height);
      pass(blur, a);
      renderer.setRenderTarget(prev);
    },
    // Put the background on screen; mix 0 shows it sharp, 1 blurred.
    composite(mix) {
      comp.uniforms.uMix.value = mix;
      pass(comp, null);
    },
    dispose() { sharp.dispose(); a.dispose(); b.dispose(); blur.dispose(); comp.dispose(); },
  };
}
