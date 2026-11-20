#!/usr/bin/env python3
"""Rebuild the njct.io /hi design prototypes from Claude Code session transcripts.

The 2026-11-07 session 6ba60b26 built them in its scratchpad
(/private/tmp/claude-501/-Users-neil-dev-njct-io/<session>/scratchpad/hi-designs/),
which macOS later deleted. Their contents survive in the transcripts as tool-call
inputs. This script collects every Write / Edit / MultiEdit whose file_path is under
hi-designs/ and every Bash command that mentions hi-designs, from the main jsonl and
all subagent jsonl files, drops the duplicate records of each tool call, orders them
by timestamp and replays them in a sandbox directory:

  - Write            -> the file is written with `content`
  - Edit/MultiEdit   -> old_string must occur in the file (else logged as a GAP),
                        replaced by new_string; calls whose tool_result was an error
                        are skipped, as in the original run
  - Bash             -> the command is run (zsh -c) with the scratchpad path mapped
                        into the sandbox. This replays heredocs (cat > f <<EOF),
                        sed -i, perl -pi, python patch scripts, mv/cp/mkdir/rm and
                        build.py runs. Commands read from the live njct.io repo as it
                        is now, not as it was on 7 Nov.

Chrome-headless-shell and ffmpeg run for real (screenshots are regenerated, not
recovered); the "Google Chrome" binary and playwright are stubbed out.

Usage: recover.py <sandbox-dir> [--until ISO_TIMESTAMP]
Writes <sandbox-dir>/scratchpad/hi-designs/..., and replay.log next to it.
"""
import json, glob, os, subprocess, sys, shutil

SESSION = '6ba60b26-2cfa-4839-8dfa-df933b8889b4'
PROJ = os.path.expanduser('~/.claude/projects/-Users-neil-dev-njct-io/')
ORIG_SP = f'/private/tmp/claude-501/-Users-neil-dev-njct-io/{SESSION}/scratchpad'
GCHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'


def collect():
    files = [PROJ + SESSION + '.jsonl'] + sorted(glob.glob(PROJ + SESSION + '/subagents/agent-*.jsonl'))
    calls, errors = {}, set()
    for fi, f in enumerate(files):
        for ln, line in enumerate(open(f)):
            d = json.loads(line)
            c = d.get('message', {}).get('content')
            if not isinstance(c, list):
                continue
            for b in c:
                if b.get('type') == 'tool_use' and b['name'] in ('Write', 'Edit', 'MultiEdit', 'Bash'):
                    inp = b['input']
                    key = inp.get('file_path', '') if b['name'] != 'Bash' else inp.get('command', '')
                    if 'hi-designs' not in key:
                        continue
                    e = calls.setdefault(b['id'], dict(id=b['id'], name=b['name'], input=inp, ts='', src=(fi, ln), agent=os.path.basename(f)))
                    e['ts'] = max(e['ts'], d.get('timestamp') or '')
                elif b.get('type') == 'tool_result' and b.get('is_error'):
                    errors.add(b['tool_use_id'])
    evs = [e for e in calls.values()]
    evs.sort(key=lambda e: (e['ts'], e['src']))
    return evs, errors


def main():
    sb = os.path.abspath(sys.argv[1])
    until = sys.argv[sys.argv.index('--until') + 1] if '--until' in sys.argv else '9'
    if os.path.exists(sb):
        shutil.rmtree(sb)
    sp = sb + '/scratchpad'
    H = sp + '/hi-designs'
    os.makedirs(H)
    os.makedirs(sb + '/stubs/playwright')
    open(sb + '/stubs/playwright/__init__.py', 'w').write('raise ImportError("stubbed for replay")\n')
    open(sb + '/stubs/true', 'w').write('#!/bin/sh\nexit 0\n')
    os.chmod(sb + '/stubs/true', 0o755)
    log = open(sb + '/replay.log', 'w')
    evs, errors = collect()
    env = dict(os.environ, PYTHONPATH=sb + '/stubs')
    gaps = []

    def mp(s):
        return s.replace(ORIG_SP, sp).replace(GCHROME, sb + '/stubs/true')

    for e in evs:
        if e['ts'] > until:
            break
        i, nm, tag = e['input'], e['name'], f"{e['ts'][11:19]} {e['agent'][6:26]} {e['id'][-6:]}"
        if e['id'] in errors and nm != 'Bash':
            log.write(f'{tag} SKIP-ERRORED {nm} {i.get("file_path")}\n'); continue
        if nm == 'Write':
            p = mp(i['file_path'])
            os.makedirs(os.path.dirname(p), exist_ok=True)
            open(p, 'w').write(i['content'])
            log.write(f'{tag} WRITE {p[len(H):]} {len(i["content"])}\n')
        elif nm in ('Edit', 'MultiEdit'):
            p = mp(i['file_path'])
            edits = i['edits'] if nm == 'MultiEdit' else [i]
            try:
                s = open(p).read()
            except FileNotFoundError:
                gaps.append((tag, p[len(H):], 'file missing')); log.write(f'{tag} GAP file missing {p}\n'); continue
            for ed in edits:
                o, n = ed['old_string'], ed['new_string']
                if o not in s:
                    gaps.append((tag, p[len(H):], o[:60])); log.write(f'{tag} GAP no match {p[len(H):]} {o[:60]!r}\n'); continue
                s = s.replace(o, n) if ed.get('replace_all') else s.replace(o, n, 1)
                log.write(f'{tag} EDIT {p[len(H):]}\n')
            open(p, 'w').write(s)
        else:
            cmd = mp(i['command'])
            r = subprocess.run(['/bin/zsh', '-c', cmd], cwd=H, env=env, capture_output=True, text=True, timeout=300)
            log.write(f'{tag} BASH rc={r.returncode} {i["command"][:90]!r}\n')
            if r.returncode:
                log.write('   stderr: ' + r.stderr[-400:].replace('\n', ' | ') + '\n')
        log.flush()
    log.write('\nGAPS: %d\n' % len(gaps))
    for g in gaps:
        log.write('  %r\n' % (g,))
    print('events', len(evs), 'gaps', len(gaps))


main()
