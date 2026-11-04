// Editions sound: one lazily created AudioContext, muted by default, enabled preference kept in
// localStorage. All synthesis lives in synth.js, shared with the offline analysis.
//
//   const audio = createAudio();
//   addEventListener('pointerdown', () => audio.unlock(), { once: true });
//   audio.play('hover', { pan: -0.4, intensity: 0.8 });
import { createBus, createVoices, startRoom, holdAt, SOUNDS } from './synth.js';

const KEY = 'njct-editions-sound';
const FADE = 0.3;          // master fade when sound is switched on or off, seconds
const UNLOCK_GRACE = 0.6;  // seconds after a gesture during which a still-resuming context may schedule

function readPref() {
  try { return localStorage.getItem(KEY) === 'on'; } catch { return false; }
}
function writePref(on) {
  try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* storage blocked: session only */ }
}

export function createAudio() {
  let enabled = readPref();
  let ctx = null, bus = null, voices = null, room = null;
  let roomWanted = false, disposed = false, gestureAt = -Infinity, suspendTimer = 0;
  const timers = new Set();

  function ensure() {
    if (ctx || disposed) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC({ latencyHint: 'interactive' }); } catch { return null; }
    bus = createBus(ctx, ctx.destination, { masterGain: 0 });
    voices = createVoices(bus);
    document.addEventListener('visibilitychange', onVisibility);
    return ctx;
  }

  function fadeMaster(target, dur) {
    const now = ctx.currentTime;
    holdAt(bus.master.gain, now);
    bus.master.gain.linearRampToValueAtTime(target, now + dur);
  }

  function resume() {
    clearTimeout(suspendTimer);
    gestureAt = performance.now() / 1000;
    if (ctx.state !== 'running') ctx.resume().catch(() => {});
  }

  // Suspend once the fade is done, so a muted page costs no audio CPU.
  function suspendAfter(dur) {
    clearTimeout(suspendTimer);
    suspendTimer = setTimeout(() => {
      if (ctx && (!enabled || document.hidden) && ctx.state === 'running') {
        stopRoom(0.05);
        ctx.suspend().catch(() => {});
      }
    }, (dur + 0.1) * 1000);
  }

  function canSchedule() {
    if (!ctx) return false;
    return ctx.state === 'running' || performance.now() / 1000 - gestureAt < UNLOCK_GRACE;
  }

  function syncRoom() {
    if (roomWanted && enabled && !room && canSchedule()) room = startRoom(bus, ctx.currentTime + 0.02);
    if ((!roomWanted || !enabled) && room) stopRoom(1.5);
  }

  function stopRoom(fadeOut) {
    if (!room) return;
    room.stop(ctx.currentTime, fadeOut);
    room = null;
  }

  function onVisibility() {
    if (!ctx || !enabled) return;
    if (document.hidden) { fadeMaster(0, 0.12); suspendAfter(0.12); return; }
    resume();
    fadeMaster(1, FADE);
    syncRoom();
  }

  // iOS before 14.5 only unlocks output when a buffer starts inside the gesture.
  function primeOutput() {
    const s = ctx.createBufferSource();
    s.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
    s.connect(ctx.destination);
    s.start();
  }

  return {
    get enabled() { return enabled; },

    setEnabled(on) {
      if (disposed) return;
      enabled = !!on;
      writePref(enabled);
      if (enabled) {
        if (!ensure()) return;
        resume();
        primeOutput();
        fadeMaster(1, FADE);
        syncRoom();
      } else if (ctx) {
        fadeMaster(0, FADE);
        voices.stopAll(ctx.currentTime + FADE);
        suspendAfter(FADE);
      }
    },

    // Call from the first user gesture (pointerdown, keydown, touchend).
    unlock() {
      if (disposed || !enabled || !ensure()) return;
      resume();
      primeOutput();
      fadeMaster(1, FADE);
      syncRoom();
    },

    // opts: pan -1..1, intensity 0..1 (scales level), rate 0.5..2 (speed and pitch).
    play(name, opts = {}) {
      if (disposed || !enabled || !SOUNDS[name] || !ensure() || !canSchedule() || document.hidden) return;
      const now = ctx.currentTime;
      const v = voices.play(name, now + 0.005, opts);
      if (!v) return;
      const id = setTimeout(() => { timers.delete(id); v.release(); }, (v.end - now) * 1000 + 250);
      timers.add(id);
    },

    setRoomTone(on) {
      roomWanted = !!on;
      if (ctx && !disposed) syncRoom();
    },

    dispose() {
      if (disposed) return;
      disposed = true;
      clearTimeout(suspendTimer);
      for (const id of timers) clearTimeout(id);
      timers.clear();
      document.removeEventListener('visibilitychange', onVisibility);
      if (ctx) {
        bus.disconnect();
        ctx.close().catch(() => {});
      }
      ctx = bus = voices = room = null;
    },
  };
}
