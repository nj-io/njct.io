// Scene dimensions, measured from the reference at 1440x900 (see the build report for the method).
// World units are CSS pixels on the wall plane (z = 0) at the 1440x900 reference layout; y is up, z
// points at the camera, the origin is the centre of the viewport.

export const REF_W = 1440;
export const REF_H = 900;

// The view scales with the viewport width; the height bound keeps short windows from clipping the shelves.
export const viewScale = (w, h) => Math.min(w / REF_W, h / 760);

// Camera distance from the wall. The shelf's front edge (depth 115) projects 4.7% larger than its back
// edge, and a sleeve hovering 77 units out reads 3.1% larger: both give a distance of about 2556.
export const CAMERA_Z = 2556;

// The lineup, in shelf order (left to right, top shelf first). The layout follows its length: two
// shelves, the top one taking the odd sleeve. Up to five a shelf, sleeves keep the reference's size and
// pitch; a longer shelf scales both by sqrt(5 / per shelf) and the shelf grows to hold them, so the sleeves
// shrink and the shelf widens by about the same share (six a shelf: 177 px sleeves on a 1228 px shelf).
export const LINEUP = await fetch(new URL('../data/projects.json', import.meta.url)).then(r => r.json());
// A project's address on the hash route: #mirra, #social-hook; About Neil is #about.
export const slugOf = e => (e.kind === 'about' ? 'about' : e.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
// Get in touch, on the shelf header (index.html carries the same address, so it works without script)
// and on every project page.
export const CONTACT = 'mailto:neil@njct.io';

const PER_SHELF = Math.max(5, Math.ceil(LINEUP.length / 2));
const K = Math.sqrt(5 / PER_SHELF);

export const SLEEVE = {
  size: 194 * K,        // square; 194 px at the wall plane at five a shelf
  thick: 2,             // about 3 mm of card at this scale
  pitch: 221.3 * K,
  cols: PER_SHELF,      // sleeves on the top shelf; the bottom shelf takes the rest, centred
  lean: 12.76 * Math.PI / 180, // rest lean against the wall; the top edge touches the wall
  hoverLift: 21.2 * K,  // bottom edge above the shelf when hovered
  hoverZ: 77 * K,       // bottom edge distance from the wall when hovered
  hoverTau: 0.19,       // seconds: hover pose approaches its target exponentially
};

export const SHELF = {
  width: Math.max(1120, (PER_SHELF - 1) * SLEEVE.pitch + SLEEVE.size + 40.8),   // 160..1280 px on screen at five a shelf
  depth: 115,
  thick: 8.6,
  bevel: 1.6,           // radius of the rounded front edges
  tops: [50.6, -199.1], // top surface height of each shelf
};

// Off the sleeve, the reference lets it fall back: a pause, a drop onto the shelf (ease-in), a pause,
// then the lean back against the wall (ease-in). ms after the pointer leaves.
export const UNHOVER = { delay: 140, drop: 290, pause: 70, lean: 165 };

// Details (ms after the click or key). The sleeve flies to the centre at 2.14x its shelf size (416 px at
// 1440x900, centred at x 720, y 435.5) and turns to its back on the way, the shelf blurs, the title and
// tagline fade in at left, Open fades in under the sleeve. The flight, blur and text are measured on the
// reference at 60 fps. The turn follows the flight's eased progress (main.js stepDetails), so travel and
// turn start, peak and land together; the sleeve is edge-on halfway along its path, about 320 ms in.
export const DETAILS = {
  fly: { at: 72, dur: 582, ease: [0.31, 0.02, 0.45, 1.0] },
  size: 416, centreY: 435.5,                      // px at 1440x900
  blur: { at: 70, dur: 250, sigma: 4 },           // Gaussian sigma, CSS px
  headerOut: { at: 100, dur: 300 },               // the header tagline fades out
  title: { at: 300, dur: 600 },
  open: { at: 750, dur: 500 },
  // The flight waits for the sleeve's Details back, at most backWait ms after the click, so the turn
  // never shows an undrawn back.
  backWait: 400,
  flip: { at: 140, dur: 480, ease: [0.15, 0, 0.3, 1.0] },   // Space: yaw from the left edge on the blurred ground
  // Escape: the flight back to the hover pose. A sleeve showing its back turns to its front on the way,
  // following the flight's eased progress as on the way in (edge-on at about 280 ms, as on the
  // reference). Flight measured from the sleeve's bottom edge.
  exit: { at: 58, dur: 595, ease: [0.35, 0.05, 0.17, 1.03], textOut: 190, blurOut: { at: 240, dur: 210 },
    headerIn: { at: 640, dur: 360 } },
};

// Intro timeline, ms after the first rendered frame (measured on the reference at 60 fps).
export const INTRO = {
  canvasFade: { dur: 870, ease: 'cubic-bezier(0.44, 0, 0.26, 0.89)' },
  appear: { at: 387, stagger: 76 },              // sleeve i fades in, upright and held above its shelf
  appearPose: { lift: 15.4, z: 110 },
  drop: { at: 577, stagger: 153, dur: 180 },     // falls onto the shelf (ease-in)
  lean: { delay: 115, dur: 150 },                // then tips back against the wall (ease-in), after landing
  header: { at: 0, stagger: 50, rise: 30, tau: 235 },
  late: { at: 1830, tau: 110 },                  // tagline, sound toggle, index fade in last
};

// Open (ms). The reference cuts from the shelf to the edition's world when its page arrives (1.27 s after
// the click, network bound); ours cuts once the project's data is in, at least OPEN.cut after the click.
// After the cut, as measured on the reference: the world starts growing, the accent panel slides in from
// the left, and the giant title types itself in while the panel lands.
export const OPEN = {
  cut: 300,
  seed: 700,
  panel: { at: 1453, dur: 1050, ease: [0.8, 0, 0.15, 1] },
  title: { at: 1983, dur: 170 },
};

// The café (v2): the room around the record wall, its window and the late sun through it. World units as
// above, so one unit is about 1.77 mm on the wall (a 177-unit sleeve is a 31.4 cm LP). The record wall is
// the plane z = 0; the street front, with the window, is the plane x = room.front to its right; the floor
// is at y = room.floor. Round 1 settles these numbers from the operator's sun study.
export const CAFE = {
  room: { front: 1200, floor: -620 },
  // The window in the street front: its opening (z measured out from the record wall, y), the steel frame,
  // the two glazing bars of the three lower lights, the transom at a share of the height, and the
  // fanlight above it: a sunburst of rays from the transom's middle, crossed by an arc.
  window: { z0: 500, z1: 1140, y0: -60, y1: 620, frame: 14, bar: 7, transom: 0.7, transomBar: 10, rays: 7, arc: 0.58 },
  // The sun, in degrees: azimuth from the street front's normal toward the record wall, and elevation.
  // power: its light on a wall square to it, in the wall's linear units; leaves: how far beyond the
  // window's centre the foliage hangs, along the sun.
  // coverGain: the sun on a cover against its fitted light, by slug; a pale cover takes less, so its title
  // keeps at least 85% of its contrast in the patch (About Neil's gold on cream).
  sun: { az: 38, el: 13, power: 1.3, leaves: 500, fadeIn: 1200, ambientHz: 30, coverGain: { default: 0.85, about: 0.34 } },
};
