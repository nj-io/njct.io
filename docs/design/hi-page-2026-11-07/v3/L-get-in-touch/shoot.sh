#!/bin/zsh
# Renders the brief's screenshots, then frames of the load motion (?t=ms) for review.
D=${0:A:h}
C=~/.cache/puppeteer/chrome-headless-shell/mac_arm-154.0.8037.57/chrome-headless-shell-mac-arm64/chrome-headless-shell
shot() { $C --hide-scrollbars --force-device-scale-factor=2 --window-size=$3 --virtual-time-budget=5000 --screenshot=$1 "file://$D/index.html?$2" >/dev/null 2>&1; }
shot $D/en.png "lang=en" 390,844 &
shot $D/picker.png "lang=en&picker=open" 390,844 &
shot $D/he.png "lang=he" 390,844 &
shot $D/th.png "lang=th" 390,844 &
shot $D/zh.png "lang=zh" 390,844 &
shot $D/es.png "lang=es" 390,844 &
shot $D/en-360.png "lang=en" 360,780 &
shot $D/desk.png "lang=en" 1440,900 &
wait
mkdir -p $D/frames
for t in 0 600 700 760 820 880 940 1020 1100 1220 1360; do shot $D/frames/t$t.png "lang=en&t=$t" 390,844 & done
shot $D/frames/he-t880.png "lang=he&t=880" 390,844 &
wait
