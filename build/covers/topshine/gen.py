# python3 gen.py <covers.js> : writes the TOPSHINE constant (params.json beside this, fields.json from fit.py in the
# current directory) into covers.js, in place of the one there
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from codec import ALPHA
P = json.load(open(os.path.join(HERE, 'params.json')))
F = json.load(open('fields.json'))
r = P['ring']
js = f"""// Topshine's fit to its concept, in concept px (574 to the cover, y down): the star's centre O and tips' reach A
// (right, left), B (up, down); the orbs (x, y, r) and highlights (x, y, half-length, half-width, degrees); the ring's
// outer edge and the haze ring (centre, semi-axes, degrees); the mark as the overlay draws it, for its halo; the ring's
// line offsets and bands, the crease levels and the body's level. Fields:
// cubic B-spline blocks [box (x0, y0, size in cover units), n, g, r - g, b - g offsets, step (chroma times it for
// the two differences)]; data per block: the used-control mask as run lengths (dropped first), then per plane each used
// control's error from its left (else upper, else last) neighbour. alpha[k]: a run k or an error k - 31; '~' a b:
// a * 63 + b, less 1984 for an error.
const TOPSHINE = {{
  O: {json.dumps(P['O'])}, A: {json.dumps(P['A'])}, B: {json.dumps(P['B'])},
  orbs: {json.dumps([[round(v, 2) for v in o] for o in P['orbs']])},
  specs: {json.dumps(P['specs'])},
  ring: [{r['cx']:.2f}, {r['cy']:.2f}, {r['a']:.2f}, {r['b']:.2f}, {r['ang']:.2f}],
  mark: {json.dumps(P['mark'])}, halo: {P['halo']},
  rlines: {json.dumps(P['rlines'])}, rwidth: {P['rwidth']}, rwide: {P['rwide']}, qlines: {json.dumps(P['qlines'])}, qbody: {P['qbody']},
  haze: [{P['haze']['cx']:.2f}, {P['haze']['cy']:.2f}, {P['haze']['a']:.2f}, {P['haze']['b']:.2f}, {P['haze']['ang']:.2f}], hazew: {P['hazew']}, hazeo: {json.dumps(P['hazeo'])},
  boxes: {json.dumps(F['boxes'])},
  blocks: {json.dumps(F['blocks'])},
  chroma: {F['chroma']},
  alpha: '{ALPHA}',
  data: '{F['data']}',
}};
"""
p = sys.argv[1]; s = open(p).read()
a = s.index("// Topshine's fit to its concept"); b = s.index('// Topshine: the star mark as clear violet glass')
open(p, 'w').write(s[:a] + js + s[b:])
print('TOPSHINE', len(js), 'chars written to', p)
