import sys, re, urllib.parse
D = sys.argv[1]
src = open(D + '/src.html', encoding='utf-8').read()
# Every character the page can show, for Google Fonts' text= subsetting (one request, every family).
m = re.search(r'const COPY = \{(.*?)\n\};', src, re.S).group(1)
strings = re.findall(r"(?:'([^']*)'|\"([^\"]*)\")", m)
text = ''.join(a or b for a, b in strings) + 'LinkedInWhatsAppLINEWeChat' + 'njct.io' + 'NOWPLAYING' + ' '
text = ''.join(sorted(set(text)))
fams = ['Inter:wght@400;500;800', 'Bricolage+Grotesque:opsz,wght@96,800', 'Noto+Sans+Thai:wght@400;500', 'Noto+Sans+Hebrew:wght@400;500', 'Noto+Sans+SC:wght@400;500']
url = 'https://fonts.googleapis.com/css2?' + '&'.join('family=' + f for f in fams) + '&display=block&text=' + urllib.parse.quote(text)
out = src.replace('%%FONTS%%', url.replace('&', '&amp;'))
open(D + '/index.html', 'w', encoding='utf-8').write(out)
print(len(out), 'bytes')
