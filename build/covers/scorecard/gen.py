# python3 gen.py <fit.json> <covers.js> : writes MOTIFS.scorecard from the fit (geometry + per-region cubic colour fields).
# SC_GA, the grain's strength, is matched to the concept's on flat patches (std 2.0 levels at 566 px, detrended).
import sys, json, math
F = json.load(open(sys.argv[1])); g = F['g']; K = F['coefs']; NAMES = F['names']; DEG = F['deg']
vx, hy, dcx, dcy, R, r1, t1, r2, t2, r3, t3, ra, ta, rb, tb, bl, vx2, hy2, Ry, tilt, sa = g[:21]
f = lambda v: ('%.6g' % v) if abs(v) >= 1e-6 else '0.0'
def fl(v):
    s = f(v); return s if ('.' in s or 'e' in s) else s + '.0'
def ln(r, t): return 'vec3(%s, %s, %s)' % (fl(math.cos(t)), fl(math.sin(t)), fl(r))
NM = (DEG + 1) * (DEG + 2) // 2
def v3(row): return 'vec3(%s)' % ', '.join(fl(float('%.4g' % c)) for c in row)
def field(r, m): return ' + '.join('%s * %s[%d]' % (v3(K[r * NM + k]), m, k) for k in range(NM))
regions = '\n'.join('  if (w%d > 0.0) col += w%d * (%s);' % (r, r, field(r, 'mf' if r < NAMES.index('red') else 'md')) for r in range(len(NAMES)))
mono = []
for i in range(DEG + 1):
    for j in range(DEG + 1 - i): mono.append((i, j))
def mexpr(v, i, j):
    t = ['%s.x' % v] * i + ['%s.y' % v] * j
    return ' * '.join(t) if t else '1.0'
monos = lambda v, nm: 'float %s[%d] = float[%d](%s);' % (nm, NM, NM, ', '.join(mexpr(v, i, j) for i, j in mono))
nd = NAMES.index('red')
glsl = f'''// Scorecard: a Swiss composition, a quartered disc over diagonal fields; alive, the quarters turn a step. Fitted to its
// concept cut to its cover box (566 px, y down): the two splits, three field diagonals, the disc (a slight ellipse, as the
// photographed sleeve shows it) and its wedge line, each region's colour a cubic field in linear light, a faint dark seam
// where regions meet, and the paper's grain.
MOTIFS.scorecard = /* glsl */`
#define SC_GRAIN (uMip < 0.5 ? 1.0 : 0.0)
#define SC_GF 0.66
#define SC_GA 0.0425
float scCov(float d, float w) {{ return clamp(0.5 + d / w, 0.0, 1.0); }}
float scLine(vec2 X, vec3 l) {{ return dot(X, l.xy) - l.z; }}
vec3 motif(vec2 p, float t) {{
  vec2 X = vec2(p.x, 1.0 - p.y) * 566.0;
  float bw = max({fl(1.7)}, AAW * 566.0);   // the concept's edge, never under a pixel
  // the disc's quarters turn about their own split point when alive
  vec2 S2 = vec2({fl(vx2)}, {fl(hy2)});
  float T = t * 0.25;
  float a = -0.5 * PI * (floor(T) + ease(sat((fract(T) - 0.62) / 0.38)));
  vec2 Xq = S2 + rot(-a) * (X - S2);
  float L = scCov({fl(vx)} - X.x, bw), Tp = scCov({fl(hy)} - X.y, bw);
  float L2 = scCov(S2.x - Xq.x, bw), T2 = scCov(S2.y - Xq.y, bw);
  float tri = scCov(-scLine(X, {ln(r1, t1)}), bw);
  float dg = scCov(scLine(X, {ln(r2, t2)}), bw);
  float nb = scCov(scLine(X, {ln(r3, t3)}), bw);
  float A = scCov(scLine(Xq, {ln(ra, ta)}), bw), B = scCov(scLine(Xq, {ln(rb, tb)}), bw);
  vec2 e = rot({fl(-(tilt % math.pi))}) * (X - vec2({fl(dcx)}, {fl(dcy)}));
  float rr = length(e / vec2({fl(R)}, {fl(Ry)})), gg = length(e / vec2({fl(R * R)}, {fl(Ry * Ry)})) + 1e-9;
  float D = scCov(-(rr - 1.0) * rr / gg, bw), O = 1.0 - D;
  float w0 = Tp * L * (1.0 - tri) * O, w1 = Tp * L * tri * O, w2 = Tp * (1.0 - L) * O;
  float w3 = (1.0 - Tp) * L * (1.0 - dg) * O, w4 = (1.0 - Tp) * L * dg * O;
  float w5 = (1.0 - Tp) * (1.0 - L) * (1.0 - nb) * O, w6 = (1.0 - Tp) * (1.0 - L) * nb * O;
  float w7 = T2 * L2 * D, w8 = T2 * (1.0 - L2) * D * A, w9 = T2 * (1.0 - L2) * D * (1.0 - A), w10 = (1.0 - T2) * (1.0 - L2) * D;
  float w11 = (1.0 - T2) * L2 * D * B, w12 = (1.0 - T2) * L2 * D * (1.0 - B);
  // a turned quarter reads its colour inside the disc it was fitted in (a cubic runs off fast outside it)
  vec2 DC = vec2({fl(dcx)}, {fl(dcy)}), dq = Xq - DC;
  vec2 Xc = DC + dq * min(1.0, {fl(min(R, Ry))} / max(length(dq), 1e-3));
  vec2 u = (X - 283.0) / 283.0, v = (Xc - 283.0) / 283.0;
  {monos('u', 'mf')}
  {monos('v', 'md')}
  vec3 col = vec3(0.0);
  float s2 = w0 * w0 + w1 * w1 + w2 * w2 + w3 * w3 + w4 * w4 + w5 * w5 + w6 * w6 + w7 * w7 + w8 * w8 + w9 * w9 + w10 * w10 + w11 * w11 + w12 * w12;
{regions}
  col *= 1.0 - {fl(sa)} * 2.0 * (1.0 - s2);
  // the paper's grain, static and level in sRGB (as the concept's is); the two levels under full size, which the
  // shader draws itself (shaderMips: 2), leave it out so at shelf size it settles to its mean
  // (in linear light: d lin / d srgb taken as 2 sqrt(lin), gamma 2)
  col = max(col, 0.0);
  return col + (vnoise(X * SC_GF) - 0.5) * (SC_GA * 2.0 * SC_GRAIN) * sqrt(col);
}}`;
'''
p = sys.argv[2]; s = open(p).read()
a = s.index('// Scorecard: a Swiss composition'); b = s.index('// Xactions:')
open(p, 'w').write(s[:a] + glsl + '\n' + s[b:])
print('scorecard motif', len(glsl), 'chars')
