#!/usr/bin/env python3
"""One paid attempt at a /hi background plate (plan § 1, D6).

    OPENAI_API_KEY="$(pbpaste)" build/hi-plates-generate.py portrait     # then, once a portrait is accepted:
    OPENAI_API_KEY="$(pbpaste)" build/hi-plates-generate.py landscape
    build/hi-plates-generate.py --dry-run portrait                       # prints the request body, needs no key

Each run makes exactly one attempt: it reads the plate's prompt from the brand hub's v8/prompts.md, calls
generate_image.py (gpt26-sunburst, ledger tag hi-plate) and writes the next free v8/plate-<kind>-<n>.png.
It refuses a fourth attempt for a plate and any attempt that could take the tag's total past USD 0.30. The key is
read only from OPENAI_API_KEY in this process's environment and is never printed; the output is each file path and
the script's own cost line. The landscape plate is an edit of v8/plate-portrait.png, the accepted portrait plate.
"""
import json
import os
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path

BRAND = Path(os.environ.get('HI_BRAND') or Path.home() / 'dev/_brand/creatives/njct/2026-11-07-hi-page')
SCRIPT = Path.home() / '.claude/skills/generate-image/scripts/generate_image.py'
LEDGER = SCRIPT.parent.parent / 'usage.jsonl'
TAG = 'hi-plate'
MAX_ATTEMPTS = 3
BUDGET_USD = 0.30
ATTEMPT_ESTIMATE_USD = 0.05   # the plan's upper estimate per attempt (§ 1)
PROMPTS = BRAND / 'v8/prompts.md'

PLATES = {
    'portrait': dict(size='1024x1536', input='v7/1.png', stand_in=None),
    'landscape': dict(size='1536x1024', input='v8/plate-portrait.png', stand_in='v7/1.png'),
}


def die(msg):
    print(msg, file=sys.stderr)
    sys.exit(1)


def prompt_for(kind):
    m = re.search(rf'^## {kind}\n\n(.+?)\n', PROMPTS.read_text(), re.M | re.S)
    if not m:
        die(f'no "## {kind}" prompt in {PROMPTS}')
    return m.group(1).strip()


def spent_usd():
    if not LEDGER.exists():
        return 0.0
    total = 0.0
    for line in LEDGER.read_text().splitlines():
        try:
            row = json.loads(line)
        except ValueError:
            continue
        if row.get('tag') == TAG:
            total += float(row.get('cost_usd') or 0)
    return total


def main():
    args = sys.argv[1:]
    dry = '--dry-run' in args
    kinds = [a for a in args if a != '--dry-run']
    if len(kinds) != 1 or kinds[0] not in PLATES:
        die(__doc__.split('\n\n')[0] + '\n\nusage: hi-plates-generate.py [--dry-run] portrait|landscape')
    kind = kinds[0]
    spec = PLATES[kind]
    prompt = prompt_for(kind)
    src = spec['input']
    if not (BRAND / src).exists():
        if dry and spec['stand_in']:
            print(f'(dry run: {src} does not exist yet, showing the request with {spec["stand_in"]} in its place)',
                  file=sys.stderr)
            src = spec['stand_in']
        else:
            die(f'{BRAND / src} not found. Accept a portrait attempt first: copy v8/plate-portrait-<n>.png to '
                'v8/plate-portrait.png.')

    n = len({p.stem for p in (BRAND / 'v8').glob(f'plate-{kind}-*.*') if re.fullmatch(rf'plate-{kind}-\d+', p.stem)}) + 1
    out = f'v8/plate-{kind}-{n}.png'
    cmd = ['python3', str(SCRIPT), 'gpt26-sunburst', prompt, '--size', spec['size'], '-o', out, '-t', TAG,
           '-i', src]
    if dry:
        sys.exit(subprocess.run(cmd + ['--dry-run'], cwd=BRAND).returncode)

    if n > MAX_ATTEMPTS:
        die(f'{kind}: {MAX_ATTEMPTS} attempts are used (the plan allows at most {MAX_ATTEMPTS}). Nothing was run.')
    spent = spent_usd()
    if spent + ATTEMPT_ESTIMATE_USD > BUDGET_USD:
        die(f'tag {TAG} has spent ${spent:.4f}; another attempt (up to ${ATTEMPT_ESTIMATE_USD:.2f}) could pass the '
            f'${BUDGET_USD:.2f} approval. Nothing was run.')
    key = os.environ.get('OPENAI_API_KEY', '').strip()
    if not key:
        die('OPENAI_API_KEY is empty in this environment (nothing on the clipboard?). Nothing was run.')

    print(f'{kind} attempt {n} of {MAX_ATTEMPTS}, tag spend so far ${spent:.4f} of ${BUDGET_USD:.2f}')
    r = subprocess.run(cmd, cwd=BRAND, capture_output=True, text=True, env={**os.environ, 'OPENAI_API_KEY': key})

    def clean(text):
        return text.replace(key, '***')

    cost = next((clean(l.strip()) for l in r.stderr.splitlines() if l.startswith('cost:')), '')
    if r.returncode != 0:
        tail = clean((r.stderr or r.stdout).strip()).splitlines()[-6:]
        die(f'{kind} attempt {n} failed (exit {r.returncode}), nothing was written:\n  ' + '\n  '.join(tail))
    written = clean(r.stdout.strip().splitlines()[-1]) if r.stdout.strip() else out
    print(BRAND / written)
    print(cost)
    with open(PROMPTS, 'a') as f:
        f.write(f'- {datetime.now():%Y-%m-%d %H:%M} {kind} attempt {n}: `{written}`, input `{src}`, {cost}\n')


if __name__ == '__main__':
    main()
