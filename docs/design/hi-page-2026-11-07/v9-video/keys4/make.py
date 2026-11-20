"""Round 4 key poses (Neil, 17 Nov): master K3 = keys3/k3-v5-like1.png (picked). Short prompts on gpt25, each an edit of K3
(the empty scene and the end frame are edits of each other), so the scene stays the master's.
    python3 keys4/make.py empty k2 k4 k5 end"""
import subprocess, sys
from pathlib import Path
V = Path(__file__).resolve().parents[1]
G = Path.home() / '.claude/skills/generate-image/scripts/generate_image.py'
KEEP = ' Keep everything else in the photo the same.'
SHOTS = {
 'empty': ('keys4/k3.png', 'Remove the man from this photo and show the wall, table, laptop and coffee cup behind him.' + KEEP),
 'k2': ('keys4/k3.png', 'The same man a few seconds earlier: he is walking in from the right toward the table, seen from behind, both hands empty. The coffee cup sits on its saucer.' + KEEP),
 'k4': ('keys4/k3.png', 'The same man now lifts the cup with his left hand and drinks from it, head dipped, seen from behind in side profile.' + KEEP),
 'k5': ('keys4/k3.png', 'The same man has just put the cup back on its saucer and is turning to walk away to the right, seen from behind.' + KEEP),
 'end': ('keys4/empty.png', 'Change only the coffee: someone has taken a sip, so the latte art is broken up and there is a faint trace of milk foam on the rim of the cup.' + KEEP),
}
for k in sys.argv[1:]:
    base, prompt = SHOTS[k]
    r = subprocess.run(['python3', str(G), 'gpt25', prompt, '-o', f'keys4/{k}.png', '-t', 'hi-v9-video', '-i', base],
                       cwd=V, capture_output=True, text=True)
    print(k, r.returncode, [l for l in r.stderr.splitlines() if l.startswith('cost')] or r.stderr.strip()[-200:])
