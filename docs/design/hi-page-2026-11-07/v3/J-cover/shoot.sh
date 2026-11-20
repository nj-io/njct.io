#!/bin/bash
# Renders the screenshots the brief asks for. Extra args: a name prefix and a query suffix (e.g. "f30-" "&p=0.3").
D="$(cd "$(dirname "$0")" && pwd)"
C=~/.cache/puppeteer/chrome-headless-shell/mac_arm-154.0.8037.57/chrome-headless-shell-mac-arm64/chrome-headless-shell
P="$1"; X="$2"
shot() { "$C" --hide-scrollbars --force-device-scale-factor=2 --window-size=$2 --virtual-time-budget=5000 --screenshot="$D/$P$1" "file://$D/index.html?$3$X" 2>/dev/null >/dev/null; }
shot en.png 390,844 lang=en &
shot picker.png 390,844 "lang=en&picker=open" &
shot he.png 390,844 lang=he &
shot th.png 390,844 lang=th &
shot zh.png 390,844 lang=zh &
shot es.png 390,844 lang=es &
shot en-360.png 360,780 lang=en &
shot desk.png 1440,900 lang=en &
wait
