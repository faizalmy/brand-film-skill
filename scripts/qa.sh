#!/usr/bin/env bash
# QA stills from the project folder: qa.sh <out-dir> <scale> <frame...>. Bundles fresh, renders stills, builds the sheet.
# <out-dir> is wiped first, so it must be new or hold only stills from an earlier run.
set -euo pipefail
[ $# -ge 3 ] || { echo "usage: qa.sh <out-dir> <scale> <frame...>" >&2; exit 1; }
K=$(cd "$(dirname "$0")" && pwd); OUT=$1; SC=$2; shift 2
if [ -e "$OUT" ] && [ -n "$(find "$OUT" -mindepth 1 ! -name 'f*.jpg' ! -name 'sheet.jpg' -print -quit)" ]; then
  echo "qa.sh: $OUT holds files that are not QA stills; pick a new folder" >&2; exit 1
fi
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
npx remotion bundle src/index.ts --out-dir "$TMP/bundle" --log=error
rm -rf "$OUT"; mkdir -p "$OUT"
COMP=${COMP:-Refreshed} node "$K/qa.mjs" "$TMP/bundle" "$OUT" "$SC" "$@"
python3 "$K/sheet.py" "$OUT"
