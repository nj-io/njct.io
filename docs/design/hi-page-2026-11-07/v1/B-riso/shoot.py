import sys, pathlib
from playwright.sync_api import sync_playwright
D = pathlib.Path(__file__).resolve().parent
shots = [("en.png",390,844,"lang=en"),("picker.png",390,844,"lang=en&picker=open"),("he.png",390,844,"lang=he"),
         ("th.png",390,844,"lang=th"),("zh.png",390,844,"lang=zh"),("en-360.png",360,780,"lang=en")]
only = sys.argv[1:]
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", headless=True)
    for name,w,h,q in shots:
        if only and name not in only: continue
        pg = b.new_page(viewport={"width":w,"height":h}, device_scale_factor=2)
        pg.goto(f"file://{D}/index.html?{q}")
        pg.evaluate("document.fonts.ready")
        pg.wait_for_timeout(1400)
        sw = pg.evaluate("[document.documentElement.scrollWidth, document.documentElement.scrollHeight]")
        print(name, "scroll", sw)
        pg.screenshot(path=str(D/name))
        pg.close()
    b.close()
