#!/usr/bin/env bash
# Serve the repo root at http://127.0.0.1:8750 (loopback only). Safe to run twice: exits 0 when this
# repo is already being served there, and 1 when something else holds the port.
set -u
PORT=8750
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
URL="http://127.0.0.1:${PORT}"
if curl -s -o /dev/null --max-time 2 "${URL}/"; then
  if curl -sf --max-time 2 "${URL}/build/serve.sh" | cmp -s - "${ROOT}/build/serve.sh"; then
    echo "already serving ${ROOT} at ${URL}/"
    exit 0
  fi
  echo "port ${PORT} is serving something else; stop it first" >&2
  exit 1
fi
cd "$ROOT" && exec python3 -m http.server "$PORT" --bind 127.0.0.1
