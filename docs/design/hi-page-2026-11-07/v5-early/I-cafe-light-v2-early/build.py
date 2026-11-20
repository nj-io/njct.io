# Builds index.html from template.html: the Noto Sans SC subset for the Chinese copy. The light, its leaves
# and the figure are drawn at runtime by the page's own script.
import gzip, pathlib, urllib.parse
here = pathlib.Path(__file__).parent
html = (here / 'template.html').read_text()
sc = ''.join(sorted(set('你好，我是很高兴认识你，可以在这里找到我。保存联系人中文')))
html = html.replace('%%SCTEXT%%', urllib.parse.quote(sc, safe=''))
(here / 'index.html').write_text(html)
b = html.encode()
print(len(b), 'bytes,', len(gzip.compress(b, 9)), 'gzipped')
