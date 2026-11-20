#!/bin/zsh
D=/private/tmp/claude-501/-Users-neil-dev-njct-io/6ba60b26-2cfa-4839-8dfa-df933b8889b4/scratchpad/hi-designs/f-back
python3 -I $D/build.py $D
C=~/.cache/puppeteer/chrome-headless-shell/mac_arm-154.0.8037.57/chrome-headless-shell-mac-arm64/chrome-headless-shell
shot() { $C --hide-scrollbars --force-device-scale-factor=2 --window-size=$1 --virtual-time-budget=${4:-4000} --screenshot=$D/$2 "file://$D/index.html?$3" 2>/dev/null; }
shot 390,844 en.png lang=en &
shot 390,844 picker.png "lang=en&picker=open" &
shot 390,844 he.png lang=he &
shot 390,844 th.png lang=th &
shot 390,844 zh.png lang=zh &
shot 360,780 en-360.png lang=en &
shot 390,844 es.png lang=es &
shot 1440,900 desk.png lang=en &
wait
