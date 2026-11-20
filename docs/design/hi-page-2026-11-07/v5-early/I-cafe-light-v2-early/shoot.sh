#!/bin/bash
# Renders the screenshots the brief asks for (still, at rest), plus on request:
#   ./shoot.sh frames   frames of the load motion   ./shoot.sh wave   frames of the wave
D="$(cd "$(dirname "$0")" && pwd)"
C=~/.cache/puppeteer/chrome-headless-shell/mac_arm-154.0.8037.57/chrome-headless-shell-mac-arm64/chrome-headless-shell
shot() { "$C" --hide-scrollbars --force-device-scale-factor=2 --window-size=$2 --virtual-time-budget=5000 --screenshot="$D/$1" "file://$D/index.html?$3" 2>/dev/null >/dev/null; }
mkdir -p "$D/work"
if [ "$1" = frames ]; then
  for t in 0 300 700 1200 1800 2400; do shot work/f$t.png 390,844 "lang=en&t=$t" & done; wait; exit
fi
if [ "$1" = wave ]; then
  for t in 0 200 420 560 680 800 920 1040 1300 1700 1900 2100; do shot work/w$t.png 390,844 "lang=en&wave=$t" & done; wait; exit
fi
shot en.png 390,844 "lang=en&still" &
shot picker.png 390,844 "lang=en&picker=open&still" &
shot he.png 390,844 "lang=he&still" &
shot th.png 390,844 "lang=th&still" &
shot zh.png 390,844 "lang=zh&still" &
shot es.png 390,844 "lang=es&still" &
shot en-360.png 360,780 "lang=en&still" &
shot desk.png 1440,900 "lang=en&still" &
wait
