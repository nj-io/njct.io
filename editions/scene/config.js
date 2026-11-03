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

export const SHELF = {
  width: 1120,          // back edge spans 160..1280 px on screen
  depth: 115,
  thick: 8.6,
  bevel: 1.6,           // radius of the rounded front edges
  tops: [50.6, -199.1], // top surface height of each shelf
};

export const SLEEVE = {
  size: 194,            // square; 194 px at the wall plane
  thick: 2,             // about 3 mm of card at this scale
  pitch: 221.3,
  cols: 5,
  lean: 12.76 * Math.PI / 180, // rest lean against the wall; the top edge touches the wall
  hoverLift: 21.2,      // bottom edge above the shelf when hovered
  hoverZ: 77,           // bottom edge distance from the wall when hovered
  hoverTau: 0.19,       // seconds: hover pose approaches its target exponentially
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
