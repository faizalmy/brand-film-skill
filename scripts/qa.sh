#!/bin/zsh
# QA stills from the project folder: qa.sh <out-dir> <scale> <frame...>. Bundles fresh, renders stills, builds the sheet.
set -e
K=${0:A:h}; OUT=$1; SC=$2; shift 2
B=$(mktemp -d)/bundle
npx remotion bundle src/index.ts --out-dir "$B" --log=error
rm -rf "$OUT"; mkdir -p "$OUT"
COMP=${COMP:-Refreshed} node "$K/qa.mjs" "$B" "$OUT" "$SC" "$@"
python3 "$K/sheet.py" "$OUT"
