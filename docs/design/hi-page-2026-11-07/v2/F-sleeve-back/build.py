import json,sys
d=sys.argv[1]
j=json.load(open('/Users/neil/dev/njct.io/covers/letters/about.json'))
paths=''.join(f'<path d="{l["d"]}"/>' for l in j['letters'])
s=open(d+'/src.html').read().replace('__LETTERS__',paths)
open(d+'/index.html','w').write(s)
