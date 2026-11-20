#!/bin/bash
# The page's video: the composited colour frames (top) over their matte (bottom), 864 x 2624, 24 fps, 8.9 s.
# Colour is BT.709 matrix, limited range, tagged with the sRGB transfer (13): untagged or BT.709-transfer files are
# drawn about 10 levels brighter than the plate in Chrome, which shows the video box as a rectangle (measured 17 Nov).
set -e
cd "$(dirname "$0")/.."
# setparams at the end of the graph writes the tags into both bitstreams; with ffmpeg 9 the output flags alone are
# dropped (ffprobe shows color_transfer=unknown).
F='[0:v]crop=864:1312:0:0[c];[1:v]crop=864:1312:0:0,format=gray,format=yuv420p[m];[c][m]vstack=inputs=2,scale=out_color_matrix=bt709:out_range=tv,format=yuv420p,setparams=color_primaries=bt709:color_trc=iec61966-2-1:colorspace=bt709:range=tv[v]'
TAG='-colorspace bt709 -color_primaries bt709 -color_trc iec61966-2-1 -color_range tv'
ffmpeg -v error -y -framerate 24 -i work/out/%03d.png -framerate 24 -i work/matte/%03d.png -filter_complex "$F" -map '[v]' \
  -c:v libx264 -preset slow -crf 23 -profile:v high -level 5.1 $TAG -movflags +faststart -an out/loop.mp4
ffmpeg -v error -y -framerate 24 -i work/out/%03d.png -framerate 24 -i work/matte/%03d.png -filter_complex "$F" -map '[v]' \
  -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 $TAG -an out/loop.webm
ls -la out/
