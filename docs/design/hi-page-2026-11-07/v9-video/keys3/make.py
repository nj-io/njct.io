"""Round 3 key poses (Neil, 17 Nov): the cup handle points left, he stands in front of the cup and may hide it, and the
scene the model draws with him in it (K3) is the master; the page plate is remade as its empty version.

    python3 keys3/make.py k3          # master scene
    python3 keys3/make.py empty       # K3 without him -> empty.png (start frame, new page plate)
    python3 keys3/make.py k2 k4 k5    # other poses, on the master scene
    python3 keys3/make.py end         # empty scene, cup sipped -> end.png
Each prints its measured cost. Pasting happens in paste.py (needs numpy)."""
import subprocess, sys
from pathlib import Path
V = Path(__file__).resolve().parents[1]
G = Path.home() / '.claude/skills/generate-image/scripts/generate_image.py'
LOOK = ('He is the man from the character reference sheet: early 30s, athletic, thick dark curly hair, white crew-neck '
        't-shirt, beige chino shorts, black watch on his LEFT wrist. Keep the photo framing exactly: same camera and zoom, '
        'table top at the same height, table base not shown; he is close to the camera, so the bottom edge of the photo cuts '
        'him off at mid-thigh. His back is to the camera: back of the head, curly hair, neck and shoulders; his face is never '
        'visible, not even his cheek or beard, only the outline of an ear. No shadow of him on the wall. Keep the wall, the '
        'sunlight stripes, the table and the laptop exactly as they are. Photorealistic, no text.')
SPOT = ('He stands at the right-hand side of the table, just to the right of the coffee cup, his body turned about 30 degrees '
        'toward the table (toward the left), so we see him three-quarter from behind: his back, his right shoulder blade and '
        'the side of his left arm reaching to the table. His body partly hides the cup and saucer; the laptop on the left of '
        'the table stays visible. His head is turned toward the cup, so we see the back and side of his curly hair and the '
        'outline of his left ear, never his face, cheek or beard. ')
SHOTS = {
 'k3': ('frames/plate-left-raw.png', ['character-sheet-4.png'],
        'Edit this photo of a cafe table by a sunlit grey wall: add one man. ' + SPOT +
        'He has just reached the table and his LEFT hand is taking the cup by its handle, which points left; right arm relaxed at his side. ' + LOOK),
 'empty': ('keys3/k3-raw.png', [],
        'Edit this photo: remove the man completely and show what was behind him: the same grey sunlit wall with its light '
        'stripes, the table, and the white cappuccino cup on its saucer exactly where it stands, its handle pointing left '
        'toward the laptop, with latte art. Change nothing else: same framing, same light, same laptop. Photorealistic, no text.'),
 'k4': ('keys3/k3-raw.png', ['character-sheet-4.png'],
        'Edit this photo: the same man, in exactly the same place and size, is now drinking. ' 
        'He has raised the cup with his LEFT hand to his mouth in front of his face, hidden by his head, elbow lowered close to his body; the saucer stays on the table; right arm relaxed. ' + LOOK),
 'k2': ('keys3/k3-raw.png', ['character-sheet-4.png'],
        'Edit this photo: the same man, the same size, one moment earlier: he is walking in from the right, mid-stride, '
        'about one step to the right of where he stands now, both hands empty, arms swinging naturally, the cup and saucer '
        'visible on the table again where his body no longer covers them. ' + LOOK),
 'k5': ('keys3/k3-raw.png', ['character-sheet-4.png'],
        'Edit this photo: the same man, the same place and size, a moment after drinking: he has put the cup back on its '
        'saucer and his LEFT hand is leaving it; his body is starting to turn to his right to walk away, back still to the camera. ' + LOOK),
 'end': ('keys3/empty.png', [],
        'Edit this photo. Change only the coffee cup: someone has taken a sip, so the latte art is broken up, the coffee '
        'level is a little lower and there is a faint thin trace of milk foam on the rim. The cup stays exactly where it is, '
        'handle pointing left. Everything else stays exactly as it is. Photorealistic, no text, no person.'),
}
for k in sys.argv[1:]:
    base, refs, prompt = SHOTS[k]
    out = f'keys3/{k}-raw.png' if k not in ('empty', 'end') else f'keys3/{k}-raw.png'
    r = subprocess.run(['python3', str(G), 'gpt26-sunburst', prompt, '--size', '1024x1536', '-o', out, '-t', 'hi-v9-video',
                        '-i', base, *refs], cwd=V, capture_output=True, text=True)
    print(k, r.returncode, [l for l in r.stderr.splitlines() if l.startswith('cost')] or r.stderr.strip()[-200:])
