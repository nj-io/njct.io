#!/bin/zsh
D=/private/tmp/claude-501/-Users-neil-dev-njct-io/6ba60b26-2cfa-4839-8dfa-df933b8889b4/scratchpad/hi-designs/g-about
C=~/.cache/puppeteer/chrome-headless-shell/mac_arm-154.0.8037.57/chrome-headless-shell-mac-arm64/chrome-headless-shell
shot() { $C --hide-scrollbars --force-device-scale-factor=2 --window-size=$3 --virtual-time-budget=4000 --screenshot=$D/$1 "file://$D/index.html?$2" >/dev/null 2>&1; }
shot en.png "lang=en" 390,844 &
shot picker.png "lang=en&picker=open" 390,844 &
shot he.png "lang=he" 390,844 &
shot th.png "lang=th" 390,844 &
shot zh.png "lang=zh" 390,844 &
shot es.png "lang=es" 390,844 &
shot en-360.png "lang=en" 360,780 &
wait
