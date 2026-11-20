import json, sys, re, urllib.parse
D = sys.argv[1]
src = open(D + '/src.html', encoding='utf-8').read()
L = json.load(open('/Users/neil/dev/njct.io/covers/letters/about.json'))
paths = ''.join('<path d="%s"/>' % l['d'] for l in L['letters'])
# every non-Latin character the page shows, plus the channel names, for Google Fonts' text= subsetting
m = re.search(r'const COPY = \{(.*?)\n\};', src, re.S).group(1)
chars = set(ch for ch in m if ord(ch) > 127) | set('LinkedInWhatsAppLINEWeChat')
text = ''.join(sorted(chars))
fams = ['Bricolage+Grotesque:opsz,wght@96,800', 'Noto+Sans+Thai:wght@400;500', 'Noto+Sans+Hebrew:wght@400;500', 'Noto+Sans+SC:wght@400;500']
url = 'https://fonts.googleapis.com/css2?' + '&'.join('family=' + f for f in fams) + '&display=block&text=' + urllib.parse.quote(text)
out = src.replace('%%LETTERS%%', paths).replace('%%FONTS%%', url.replace('&', '&amp;'))
open(D + '/index.html', 'w', encoding='utf-8').write(out)
print(len(out), 'bytes')
