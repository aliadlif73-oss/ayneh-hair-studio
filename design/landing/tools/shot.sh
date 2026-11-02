#!/usr/bin/env bash
# Headless Edge screenshots for layout checks: tools/shot.sh <url> <name>:<w>x<h> [...]
# Motion is reduced so reveal animations do not hide anything in the still frame.
E="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
url=$1; shift
out=$(cygpath -w "$(cd "$(dirname "$0")/../out" && pwd)")
for spec in "$@"; do
  name=${spec%%:*}; size=${spec#*:}; w=${size%x*}; h=${size#*x}
  timeout 60 "$E" --headless=new --disable-gpu --no-first-run "--user-data-dir=C:\\Users\\10\\edge-shot-$name" \
    --force-prefers-reduced-motion --hide-scrollbars "--window-size=$w,$h" --virtual-time-budget=5000 \
    "--screenshot=$out\\$name.png" "$url" 2>&1 | grep -i "written" || echo "FAILED $name"
done
