#!/bin/bash
# r.sh out.png W,H query — one render
D=/private/tmp/claude-501/-Users-neil-dev-njct-io/6ba60b26-2cfa-4839-8dfa-df933b8889b4/scratchpad/hi-designs/i-light
C=~/.cache/puppeteer/chrome-headless-shell/mac_arm-154.0.8037.57/chrome-headless-shell-mac-arm64/chrome-headless-shell
"$C" --hide-scrollbars --force-device-scale-factor=2 --window-size=$2 --virtual-time-budget=5000 --screenshot="$D/$1" "file://$D/index.html?$3" >/dev/null 2>&1
