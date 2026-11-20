#!/bin/zsh
D=${0:a:h}
C=~/.cache/puppeteer/chrome-headless-shell/mac_arm-154.0.8037.57/chrome-headless-shell-mac-arm64/chrome-headless-shell
s() { $C --hide-scrollbars --force-device-scale-factor=2 --window-size=$2 --virtual-time-budget=4000 --screenshot=$D/$1 "file://$D/index.html?$3" 2>/dev/null >/dev/null; }
s en.png 390,844 lang=en & s picker.png 390,844 "lang=en&picker=open" & s he.png 390,844 lang=he & s th.png 390,844 lang=th & s zh.png 390,844 lang=zh & s es.png 390,844 lang=es & s en-360.png 360,780 lang=en & s desk.png 1440,900 lang=en &
wait
