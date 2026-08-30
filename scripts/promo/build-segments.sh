#!/usr/bin/env bash
# Нарезает восемь бит промо-ролика Poaching в единый формат 1080x1920 / 30 fps
# и вжигает в них текстовые плашки. Вход: записи сайта (footage/) и генеративные
# клипы Comfy Cloud (comfy/). Выход: segments/b1..b8.mp4 — их склеивает assemble.sh.
set -euo pipefail

R=${PROMO_DIR:-promo-build}
G=$R/comfy                      # клипы и звук из Comfy Cloud
S=$R/segments; mkdir -p "$S"
A=$(ls "$R"/footage/a/*.webm)   # лендинг: герой + сетка приложений
B=$(ls "$R"/footage/b/*.webm)   # инструмент: ввод ниши → скан → карточки лидов
D=$(ls "$R"/footage/d3/*.webm)  # блок отзывов: кейс Ивана

V="scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,format=yuv420p"
ENC="-c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -an"

# seg <вход> <ss> <длительность на выходе> <ускорение> <png-плашка|-> <имя файла>
seg () {
  local dur=$3 ov=$5
  if [ "$ov" = "-" ]; then
    ffmpeg -v error -ss "$2" -i "$1" -t "$(echo "$dur * $4" | bc -l)" \
      -vf "setpts=PTS/$4,$V,trim=duration=$dur,setpts=PTS-STARTPTS" $ENC "$S/$6" -y
  else
    # плашка выезжает на 30px вверх и растворяется на входе и выходе
    local fo; fo=$(echo "$dur - 0.55" | bc -l)
    ffmpeg -v error -ss "$2" -i "$1" -t "$(echo "$dur * $4" | bc -l)" -loop 1 -i "$ov" \
      -filter_complex "[0:v]setpts=PTS/$4,$V,trim=duration=$dur,setpts=PTS-STARTPTS[bg];\
[1:v]format=rgba,fade=t=in:st=0.25:d=0.55:alpha=1,fade=t=out:st=$fo:d=0.5:alpha=1,trim=duration=$dur,setpts=PTS-STARTPTS[tx];\
[bg][tx]overlay=x=0:y='30-30*min(1\,max(0\,(t-0.25))/0.7)':format=auto,format=yuv420p[v]" \
      -map "[v]" $ENC "$S/$6" -y
  fi
}

seg "$G/gen1-hook.mp4"  0     4.0   1.0   "$R/overlays/t1.png" b1.mp4  # генератив: облака комментариев + тил-скан
seg "$A"                1.6   2.3   1.0   -                    b2.mp4  # сайт: герой с фоновым видео
seg "$A"                13.6  2.2   1.0   -                    b3.mp4  # сайт: сетка приложений, карточка Poaching
seg "$G/gen2-scan.mp4"  0     3.5   1.0   "$R/overlays/t2.png" b4.mp4  # генератив: радар по сетке узлов
seg "$B"                4.0   6.35  1.45  -                    b5.mp4  # инструмент: ввод ниши и конкурентов + скан
seg "$B"                14.5  7.1   1.55  "$R/overlays/t3.png" b6.mp4  # инструмент: скоринг лидов + заходы в ЛС
seg "$D"                4.0   5.0   1.6   "$R/overlays/t4.png" b7.mp4  # сайт: кейс Ивана, +45 лидов
seg "$G/gen3-outro.mp4" 0     5.5   0.923 "$R/overlays/t5.png" b8.mp4  # генератив: аутро + финальная карточка

for f in "$S"/b*.mp4; do echo "$f $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")"; done
