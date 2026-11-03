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
coef = ', '.join('vec3(%s)' % ', '.join(('%.4g' % c) for c in row) for row in K)
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
const vec3 SCK[{len(K)}] = vec3[{len(K)}]({coef});
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
  float w[13] = float[13](Tp * L * (1.0 - tri) * O, Tp * L * tri * O, Tp * (1.0 - L) * O,
    (1.0 - Tp) * L * (1.0 - dg) * O, (1.0 - Tp) * L * dg * O, (1.0 - Tp) * (1.0 - L) * (1.0 - nb) * O, (1.0 - Tp) * (1.0 - L) * nb * O,
    T2 * L2 * D, T2 * (1.0 - L2) * D * A, T2 * (1.0 - L2) * D * (1.0 - A), (1.0 - T2) * (1.0 - L2) * D,
    (1.0 - T2) * L2 * D * B, (1.0 - T2) * L2 * D * (1.0 - B));
  // a turned quarter reads its colour inside the disc it was fitted in (a cubic runs off fast outside it)
  vec2 DC = vec2({fl(dcx)}, {fl(dcy)}), dq = Xq - DC;
  vec2 Xc = DC + dq * min(1.0, {fl(min(R, Ry))} / max(length(dq), 1e-3));
  vec2 u = (X - 283.0) / 283.0, v = (Xc - 283.0) / 283.0;
  {monos('u', 'mf')}
  {monos('v', 'md')}
  vec3 col = vec3(0.0); float s2 = 0.0;
  for (int r = 0; r < 13; r++) {{
    s2 += w[r] * w[r];
    if (w[r] <= 0.0) continue;
    vec3 c = vec3(0.0);
    for (int k = 0; k < {NM}; k++) c += SCK[r * {NM} + k] * (r < {nd} ? mf[k] : md[k]);
    col += w[r] * c;
  }}
  col *= 1.0 - {fl(sa)} * 2.0 * (1.0 - s2);
  // the paper's grain, static and level in sRGB (as the concept's is); the two levels under full size, which the
  // shader draws itself (shaderMips: 2), leave it out so at shelf size it settles to its mean
  vec3 s = toSrgb(max(col, 0.0)) + (vnoise(X * SC_GF) - 0.5) * SC_GA * SC_GRAIN;
  return toLin(clamp(s, 0.0, 1.0));
}}`;
'''
p = sys.argv[2]; s = open(p).read()
a = s.index('// Scorecard: a Swiss composition'); b = s.index('// Xactions:')
open(p, 'w').write(s[:a] + glsl + '\n' + s[b:])
print('scorecard motif', len(glsl), 'chars')
