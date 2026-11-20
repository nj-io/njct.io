#!/bin/bash
# Renders the screenshots the brief asks for (at rest), plus frames of the load motion on request: ./shoot.sh frames
D="$(cd "$(dirname "$0")" && pwd)"
C=~/.cache/puppeteer/chrome-headless-shell/mac_arm-154.0.8037.57/chrome-headless-shell-mac-arm64/chrome-headless-shell
shot() { "$C" --hide-scrollbars --force-device-scale-factor=2 --window-size=$2 --virtual-time-budget=5000 --screenshot="$D/$1" "file://$D/index.html?$3" 2>/dev/null >/dev/null; }
if [ "$1" = frames ]; then
  mkdir -p "$D/work"
  for t in 0 300 700 1200 1800 2400; do shot work/f$t.png 390,844 "lang=en&t=$t" & done; wait; exit
fi
shot en.png 390,844 lang=en &
shot picker.png 390,844 "lang=en&picker=open" &
shot he.png 390,844 lang=he &
shot th.png 390,844 lang=th &
shot zh.png 390,844 lang=zh &
shot es.png 390,844 lang=es &
shot en-360.png 360,780 lang=en &
shot desk.png 1440,900 lang=en &
wait
