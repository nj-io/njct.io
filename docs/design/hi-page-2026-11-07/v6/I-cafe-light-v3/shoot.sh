#!/bin/bash
# Renders the screenshots the brief asks for (still, at rest), plus on request:
#   ./shoot.sh frames   the load motion   ./shoot.sh hello   the hello   ./shoot.sh idle   the typing
D="$(cd "$(dirname "$0")" && pwd)"
C=~/.cache/puppeteer/chrome-headless-shell/mac_arm-154.0.8037.57/chrome-headless-shell-mac-arm64/chrome-headless-shell
shot() { "$C" --hide-scrollbars --force-device-scale-factor=2 --window-size=$2 --virtual-time-budget=5000 --screenshot="$D/$1" "file://$D/index.html?$3" 2>/dev/null >/dev/null; }
mkdir -p "$D/work"
if [ "$1" = frames ]; then
  for t in 0 300 700 1200 1800 2400; do shot work/f$t.png 390,844 "lang=en&t=$t" & done; wait; exit
fi
if [ "$1" = hello ]; then
  for t in 0 200 380 600 720 840 960 1080 1300 1650 1900 2200; do shot work/h$t.png 390,844 "lang=en&hello=$t" & done; wait; exit
fi
if [ "$1" = idle ]; then
  for t in 0.6 1.0 1.4 4.2 5.0 5.8 9.6 10.0 10.6; do shot work/i$t.png 390,844 "lang=en&idle=$t" & done; wait; exit
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
