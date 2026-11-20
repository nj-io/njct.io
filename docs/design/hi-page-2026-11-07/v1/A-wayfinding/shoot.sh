#!/bin/zsh
D=/private/tmp/claude-501/-Users-neil-dev-njct-io/6ba60b26-2cfa-4839-8dfa-df933b8889b4/scratchpad/hi-designs/a-wayfinding
C=/Users/neil/.cache/puppeteer/chrome-headless-shell/mac_arm-154.0.8037.57/chrome-headless-shell-mac-arm64/chrome-headless-shell
shot() { "$C" --hide-scrollbars --force-device-scale-factor=2 --window-size=$2 --virtual-time-budget=6000 --screenshot=$D/$1.png "file://$D/index.html?$3" 2>/dev/null; }
shot en 390,844 "lang=en"
shot picker 390,844 "lang=en&picker=open"
shot he 390,844 "lang=he"
shot th 390,844 "lang=th"
shot zh 390,844 "lang=zh"
shot en-360 360,780 "lang=en"
