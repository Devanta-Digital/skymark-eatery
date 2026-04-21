#!/usr/bin/env bash
# Vendors every Cursor skill from ~/.cursor/skills/ into this repo's .cursor/skills/
# so the full skill set ships with git (usable on any clone, CI, teammate).
#
# Run from repo root after installing or updating skills globally:
#   ./scripts/sync-cursor-skills-from-global.sh
#
# Requires: rsync (macOS default)

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${CURSOR_SKILLS_GLOBAL:-$HOME/.cursor/skills}"
DEST="$ROOT/.cursor/skills"

if [[ ! -d "$SRC" ]]; then
  echo "error: missing global skills dir: $SRC" >&2
  exit 1
fi

mkdir -p "$DEST"
count=0
for d in "$SRC"/*/; do
  [[ -d "$d" ]] || continue
  name="$(basename "$d")"
  mkdir -p "$DEST/$name"
  rsync -a --delete "$d" "$DEST/$name/"
  ((++count)) || true
done

echo "Synced $count skill folders from $SRC -> $DEST"
