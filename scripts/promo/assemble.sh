#!/usr/bin/env bash
# Склеивает биты b1..b8 перекрёстными растворениями по 0.35 с, подкладывает
# эмбиент из ElevenLabs (22 с зациклены на всю длину) и кодирует мастер.
# Смещения xfade — это сумма длительностей предыдущих бит минус перекрытия.
set -euo pipefail

R=${PROMO_DIR:-promo-build}
S=$R/segments
OUT=${1:-public/videos/poaching-promo-9x16.mp4}
DUR=33.55

ffmpeg -v error \
  -i "$S/b1.mp4" -i "$S/b2.mp4" -i "$S/b3.mp4" -i "$S/b4.mp4" \
  -i "$S/b5.mp4" -i "$S/b6.mp4" -i "$S/b7.mp4" -i "$S/b8.mp4" \
  -stream_loop 1 -i "$R/comfy/ambient.flac" \
  -filter_complex "\
[0][1]xfade=transition=fade:duration=0.35:offset=3.65[x1];\
[x1][2]xfade=transition=fade:duration=0.35:offset=5.60[x2];\
[x2][3]xfade=transition=fade:duration=0.35:offset=7.45[x3];\
[x3][4]xfade=transition=fade:duration=0.35:offset=10.6333[x4];\
[x4][5]xfade=transition=fade:duration=0.35:offset=16.65[x5];\
[x5][6]xfade=transition=fade:duration=0.35:offset=23.4333[x6];\
[x6][7]xfade=transition=fade:duration=0.35:offset=28.0833[vx];\
[vx]fade=t=in:st=0:d=0.6,fade=t=out:st=32.95:d=0.6,format=yuv420p[v];\
[8:a]atrim=0:$DUR,asetpts=N/SR/TB,volume=0.8,afade=t=in:st=0:d=1.2,afade=t=out:st=31.8:d=1.75,\
aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[a]" \
  -map "[v]" -map "[a]" \
  -c:v libx264 -preset slow -crf 19 -profile:v high -level 4.2 -pix_fmt yuv420p \
  -c:a aac -b:a 160k -movflags +faststart -shortest "$OUT" -y

ffmpeg -v error -ss 30.6 -i "$OUT" -frames:v 1 -q:v 3 public/images/poaching-promo-poster.jpg -y
ffprobe -v error -show_entries format=duration,size -of default=nw=1 "$OUT"
