import sys
from playwright.sync_api import sync_playwright
D="/private/tmp/claude-501/-Users-neil-dev-njct-io/6ba60b26-2cfa-4839-8dfa-df933b8889b4/scratchpad/hi-designs/c-postcard"
shots=[("en.png","lang=en",390,844),("picker.png","lang=en&picker=open",390,844),("he.png","lang=he",390,844),
       ("th.png","lang=th",390,844),("zh.png","lang=zh",390,844),("es.png","lang=es",390,844),("en-360.png","lang=en",360,780)]
if len(sys.argv)>1: shots=[s for s in shots if s[0] in sys.argv[1:]]
with sync_playwright() as p:
    b=p.chromium.launch(channel="chrome")
    for name,q,w,h in shots:
        pg=b.new_page(viewport={"width":w,"height":h},device_scale_factor=2,reduced_motion="reduce")
        pg.goto(f"file://{D}/index.html?{q}")
        pg.evaluate("document.fonts.ready")
        pg.wait_for_timeout(600)
        sw=pg.evaluate("document.documentElement.scrollWidth")
        pg.screenshot(path=f"{D}/{name}")
        print(name,"scrollWidth",sw)
        pg.close()
    b.close()
