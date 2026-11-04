// The leaf atlas, drawn once in code: eight leaves on a 4 x 2 grid of 256-pixel cells, shared by the café's
// plants (room/shell.js) and the garden outside the window (scene/garden.js). A card's UVs run from the
// stem at the cell's foot (v = 0) to the tip (v = 1).
export const ATLAS = { w: 1024, h: 512 };
export const atlasUV = (cell, u, v) => [((cell & 3) + u) / 4, 1 - ((cell >> 2) + 1 - v) / 2];
// Eight leaves, white on clear, their veins and markings in shades (the plants' colour is per leaf):
// 0 monstera, 1 pothos, 2 fiddle-leaf fig, 3 banana, 4 snake plant, 5 pilea, 6 fern, 7 a flower.
// Each runs from its stem at the cell's foot to its tip at the top.
export function drawLeaves(g, w, h) {
  const S = 256;
  g.clearRect(0, 0, w, h);
  const cell = (i, f) => { g.save(); g.translate((i % 4) * S, (i >> 2) * S); g.beginPath(); g.rect(0, 0, S, S); g.clip(); f(); g.restore(); };
  const shape = (c, f) => { g.fillStyle = c; g.beginPath(); f(); g.fill(); };
  const mode = (m, f) => { g.save(); g.globalCompositeOperation = m; f(); g.restore(); };
  const line = (lw, c, pts) => { g.lineWidth = lw; g.strokeStyle = c; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(...pts[0]); for (let k = 1; k < pts.length; k++) g.lineTo(...pts[k]); g.stroke(); };
  cell(0, () => {
    shape('#d6d6d6', () => { g.moveTo(128, 226); g.bezierCurveTo(150, 252, 206, 254, 230, 210); g.bezierCurveTo(258, 156, 246, 66, 198, 32); g.bezierCurveTo(170, 12, 142, 6, 128, 6); g.bezierCurveTo(114, 6, 86, 12, 58, 32); g.bezierCurveTo(10, 66, -2, 156, 26, 210); g.bezierCurveTo(50, 254, 106, 252, 128, 226); });
    mode('source-atop', () => { line(5, 'rgba(0,0,0,0.2)', [[128, 236], [128, 8]]); for (let k = 0; k < 6; k++) for (const s of [-1, 1]) line(3, 'rgba(0,0,0,0.14)', [[128, 214 - k * 34], [128 + s * 62, 194 - k * 36], [128 + s * 130, 160 - k * 38]]); });
    mode('destination-out', () => {
      for (let k = 0; k < 5; k++) for (const s of [-1, 1]) line(7 - k * 0.7, '#000', [[128 + s * 34, 198 - k * 34], [128 + s * 84, 180 - k * 36], [128 + s * 150, 146 - k * 38]]);
      g.fillStyle = '#000'; for (let k = 0; k < 3; k++) for (const s of [-1, 1]) { g.beginPath(); g.ellipse(128 + s * 20, 178 - k * 44, 4.5, 10, s * 0.4, 0, 7); g.fill(); }
    });
  });
  cell(1, () => {
    shape('#d2d2d2', () => { g.moveTo(128, 222); g.bezierCurveTo(104, 252, 22, 246, 20, 170); g.bezierCurveTo(18, 100, 84, 44, 128, 6); g.bezierCurveTo(172, 44, 238, 100, 236, 170); g.bezierCurveTo(234, 246, 152, 252, 128, 222); });
    mode('source-atop', () => {
      line(4, 'rgba(0,0,0,0.18)', [[128, 230], [128, 12]]);
      for (let k = 0; k < 4; k++) for (const s of [-1, 1]) line(2.5, 'rgba(0,0,0,0.12)', [[128, 200 - k * 40], [128 + s * 70, 168 - k * 44], [128 + s * 98, 128 - k * 46]]);
      for (let k = 0; k < 7; k++) { g.fillStyle = 'rgba(255,255,230,0.38)'; g.beginPath(); g.ellipse(64 + k * 21, 80 + (k * 53) % 120, 4, 28, 0.7 - k * 0.2, 0, 7); g.fill(); }
    });
  });
  cell(2, () => {
    shape('#c6c6c6', () => { g.moveTo(128, 252); g.bezierCurveTo(92, 248, 66, 214, 66, 176); g.bezierCurveTo(66, 146, 36, 128, 28, 86); g.bezierCurveTo(20, 40, 70, 4, 128, 6); g.bezierCurveTo(186, 4, 236, 40, 228, 86); g.bezierCurveTo(220, 128, 190, 146, 190, 176); g.bezierCurveTo(190, 214, 164, 248, 128, 252); });
    mode('source-atop', () => { line(5, 'rgba(255,255,225,0.5)', [[128, 252], [128, 12]]); for (let k = 0; k < 6; k++) for (const s of [-1, 1]) line(2.5, 'rgba(255,255,225,0.38)', [[128, 222 - k * 34], [128 + s * 52, 198 - k * 36], [128 + s * 94, 170 - k * 38]]); });
  });
  cell(3, () => {
    shape('#cccccc', () => { g.moveTo(128, 254); g.bezierCurveTo(86, 226, 66, 140, 72, 60); g.bezierCurveTo(76, 18, 108, 2, 128, 2); g.bezierCurveTo(148, 2, 180, 18, 184, 60); g.bezierCurveTo(190, 140, 170, 226, 128, 254); });
    mode('source-atop', () => { line(5, 'rgba(255,255,220,0.45)', [[128, 254], [128, 4]]); for (let k = 0; k < 22; k++) for (const s of [-1, 1]) line(1.2, 'rgba(0,0,0,0.12)', [[128, 240 - k * 10.5], [128 + s * 62, 226 - k * 10.5]]); });
    mode('destination-out', () => { for (const [y, s] of [[64, 1], [150, -1], [196, 1], [110, -1]]) line(2.5, '#000', [[128 + s * 18, y], [128 + s * 72, y - 12]]); });
  });
  cell(4, () => {
    const blade = () => { g.moveTo(104, 256); g.bezierCurveTo(94, 150, 104, 60, 128, 0); g.bezierCurveTo(152, 60, 162, 150, 152, 256); };
    shape('#c8c8c8', blade);
    mode('source-atop', () => {
      for (let k = 0; k < 16; k++) { g.fillStyle = k % 2 ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,220,0.2)'; g.beginPath(); g.ellipse(128, 242 - k * 15, 34, 3.5 + (k % 3), 0.15 * Math.sin(k), 0, 7); g.fill(); }
      g.strokeStyle = 'rgba(235,225,120,0.85)'; g.lineWidth = 5; g.beginPath(); blade(); g.stroke();
    });
  });
  cell(5, () => {
    shape('#cfcfcf', () => { g.arc(128, 128, 112, 0, 7); });
    mode('source-atop', () => { for (let k = 0; k < 9; k++) { const a = k / 9 * 6.283; line(2.5, 'rgba(0,0,0,0.13)', [[128, 128], [128 + Math.cos(a) * 104, 128 + Math.sin(a) * 104]]); } });
  });
  cell(6, () => {
    g.fillStyle = '#c8c8c8';
    for (let k = 0; k < 18; k++) { const y = 246 - k * 13, len = 104 * Math.sin(Math.PI * (k + 1) / 20); for (const s of [-1, 1]) { g.beginPath(); g.ellipse(128 + s * len * 0.5, y - 6, len * 0.5, 5.5, s * -0.35, 0, 7); g.fill(); } }
    line(3, '#c8c8c8', [[128, 256], [128, 8]]);
  });
  cell(7, () => {
    for (let k = 0; k < 5; k++) { const a = k / 5 * 6.283 - 1.57; g.fillStyle = '#f4f4f4'; g.beginPath(); g.ellipse(128 + Math.cos(a) * 54, 128 + Math.sin(a) * 54, 54, 36, a, 0, 7); g.fill(); }
    g.fillStyle = '#f0d070'; g.beginPath(); g.arc(128, 128, 22, 0, 7); g.fill();
  });
}
