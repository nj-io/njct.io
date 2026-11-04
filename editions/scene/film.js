// A project's film on the back of its sleeve in Details. The film plays muted in the art band across the top
// of the back, fading in over the art as the sleeve turns. A play button over the band zooms the film out of
// the band to nearly fill the view, with sound; Escape, the close button or a click outside zooms it back.
// The same <video> feeds the band (as a texture) and the zoomed frame, so the film runs on without a cut.
import * as THREE from 'three';
import { SLEEVE } from './config.js';

const ASPECT = 16 / 9;
const HOLD = 500;   // ms the film holds on its first frame once the sleeve has turned, before it plays

export function createFilm({ camera, layer, wake, dur, els }) {
  const { frame, video, play, close, shade } = els;
  const tex = new THREE.VideoTexture(video);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
  plane.rotation.y = Math.PI;   // faces the back (-z)
  plane.layers.set(layer);
  plane.visible = false;
  const L = SLEEVE.size, v3 = new THREE.Vector3();
  let on = false, zoomed = false, rect = null, started = false, holdTimer = 0;
  // A paused film draws no new frames by itself: the band takes its first frame once it has loaded.
  for (const ev of ['loadeddata', 'seeked']) video.addEventListener(ev, () => { tex.needsUpdate = true; wake(); });
  const start = () => { clearTimeout(holdTimer); if (on && !started) { started = true; video.play().then(wake, () => {}); } };

  const project = (x, y) => {
    v3.set(x, y, 0); plane.localToWorld(v3); v3.project(camera);
    return [(v3.x + 1) / 2 * innerWidth, (1 - v3.y) / 2 * innerHeight];
  };
  const bandRect = () => {
    const [ax, ay] = project(-0.5, 0.5), [bx, by] = project(0.5, -0.5);
    return { left: Math.min(ax, bx), top: Math.min(ay, by), width: Math.abs(bx - ax), height: Math.abs(by - ay) };
  };
  const px = r => ({ left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
  const target = () => {
    const w = Math.min(innerWidth * 0.92, innerHeight * 0.86 * ASPECT), h = w / ASPECT;
    return { left: (innerWidth - w) / 2, top: (innerHeight - h) / 2, width: w, height: h };
  };
  const move = (from, to, ms) => {
    Object.assign(frame.style, px(to));
    return frame.animate([px(from), px(to)], { duration: dur(ms), easing: 'cubic-bezier(0.3, 0, 0.15, 1)' }).finished.catch(() => {});
  };

  function zoom() {
    if (!on || zoomed || !rect) return;
    zoomed = true;
    play.hidden = true;
    frame.classList.add('on'); shade.classList.add('on'); close.hidden = false;
    video.muted = false; start();
    move(rect, target(), 560).then(() => { if (zoomed) { video.controls = true; close.focus({ preventScroll: true }); } });
  }
  function unzoom(instant = false) {
    if (!zoomed) return;
    zoomed = false;
    video.controls = false; video.muted = true;
    shade.classList.remove('on'); close.hidden = true;
    const done = () => { if (!zoomed) { frame.classList.remove('on'); if (on) play.hidden = false; } };
    if (instant || !rect) { for (const a of frame.getAnimations()) a.cancel(); done(); return; }
    move(frame.getBoundingClientRect(), rect, 420).then(done);
  }
  play.addEventListener('click', zoom);
  close.addEventListener('click', () => unzoom());
  shade.addEventListener('click', () => unzoom());
  addEventListener('resize', () => { if (zoomed) Object.assign(frame.style, px(target())); });

  return {
    get zoomed() { return zoomed; },
    unzoom,
    // Details opens on sleeve s: the film goes on its back if the project has one.
    attach(s) {
      const f = s.entry.video;
      if (!f) return false;
      const band = f.band;
      plane.scale.set(L, L * band, 1);
      plane.position.set(0, L - L * band / 2, -L * 0.002);
      const k = band * ASPECT;          // the share of the film's height the band shows (a centre crop)
      tex.repeat.set(1, k); tex.offset.set(0, (1 - k) / 2);
      s.mesh.add(plane);
      if (video.getAttribute('src') !== f.src) { video.poster = f.poster; video.src = f.src; }
      video.muted = true; video.pause(); video.currentTime = f.start || 0;   // start: seconds in, past a film's opening black
      on = true; started = false;
      return true;
    },
    detach() {
      if (!on) return;
      unzoom(true);
      on = false; rect = null; clearTimeout(holdTimer);
      video.pause();
      plane.removeFromParent(); plane.visible = false; mat.opacity = 0;
      play.hidden = true;
    },
    // Each Details frame: the band's opacity, and whether the sleeve rests on its back (the play button shows).
    // Returns true while the band shows, so the scene keeps drawing the film's frames.
    update(opacity, resting) {
      if (!on) return false;
      mat.opacity = opacity; plane.visible = opacity > 0;
      if (resting && !zoomed) {
        plane.parent.updateMatrixWorld(); plane.updateMatrixWorld();
        rect = bandRect();
        const c = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        play.style.left = `${c.x}px`; play.style.top = `${c.y}px`;
        if (!frame.classList.contains('on')) Object.assign(frame.style, px(rect));
      }
      if (resting && !started && !holdTimer) holdTimer = setTimeout(() => { holdTimer = 0; start(); }, HOLD);
      if (!zoomed) play.hidden = !resting;
      if (plane.visible && !video.paused) wake();
      return plane.visible;
    },
  };
}
