import os, shutil, re
SB='<sandbox>/scratchpad/hi-designs'  # output of recover.py
OUT='/Users/neil/dev/njct.io/docs/design/hi-page-2026-11-07'
ORIG='/private/tmp/claude-501/-Users-neil-dev-njct-io/6ba60b26-2cfa-4839-8dfa-df933b8889b4/scratchpad'
SPB='<sandbox>/scratchpad'
STUB='<sandbox>/stubs/true'
GC='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
M={
 'v1/A-wayfinding':'round-1-rejected/a-wayfinding','v1/B-riso':'round-1-rejected/b-riso',
 'v1/C-postcard':'round-1-rejected/c-postcard','v1/D-chat':'round-1-rejected/d-chat',
 'v2/E-sleeve':'round-2/e-sleeve','v2/F-sleeve-back':'round-2/f-back','v2/G-about':'round-2/g-about','v2/H-phone-crate':'round-2/h-crate',
 'v3/I-cafe-light':'round-3/i-light-v1','v3/J-cover':'round-3/j-cover','v3/K-crate':'round-3/k-crate','v3/L-get-in-touch':'round-3/l-pill',
 'v4/I-cafe-light-v1':'round-3/i-light-v1','v5/I-cafe-light-v2':'round-3/i-light-v2','v5-early/I-cafe-light-v2-early':'round-3/i-light-v2-early',
 'v6/I-cafe-light-v3':'i-light',
}
if os.path.exists(OUT+'/_old'): pass
for dst,src in M.items():
    d=f'{OUT}/{dst}'; s=f'{SB}/{src}'
    shutil.copytree(s,d,dirs_exist_ok=True)
    for sub in ('work','frames','shots','check'):
        p=f'{d}/{sub}'
        if os.path.isdir(p):
            for r,_,fs in os.walk(p):
                for f in fs:
                    if f.lower().endswith(('.png','.webp','.jpg','.json')) and not f.endswith('package.json'): os.remove(f'{r}/{f}')
            # drop now-empty dirs
            for r,ds,fs in sorted(os.walk(p),reverse=True):
                if not os.listdir(r): os.rmdir(r)
# round-level files
def cp(a,b):
    os.makedirs(os.path.dirname(f'{OUT}/{b}'),exist_ok=True); shutil.copy(f'{SB}/{a}',f'{OUT}/{b}')
cp('round-1-rejected/BRIEF.md','v1/session-BRIEF.md'); cp('round-1-rejected/c-shots.py','v1/c-shots.py')
cp('REVIEW.md','v2/session-REVIEW.md'); cp('BRIEF.md','v3/session-BRIEF.md'); cp('index.html','v3/session-gallery.html')
# restore original absolute paths / chrome path in text files
for r,_,fs in os.walk(OUT):
    for f in fs:
        if f.endswith(('.html','.py','.sh','.mjs','.cjs','.md')) and f!='recover.py':
            p=f'{r}/{f}'
            try: t=open(p).read()
            except: continue
            t2=t.replace(SPB,ORIG).replace(STUB,GC)
            if t2!=t: open(p,'w').write(t2)
print('ok')
