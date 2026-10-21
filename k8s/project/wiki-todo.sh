#!/bin/sh
set -eu

url=$(curl -sI -A "k8s-hands-on/1.0 (course)" "$WIKI_RANDOM_URL" \
  | tr -d '\r' \
  | grep -i '^location:' \
  | head -n 1)
url=${url#*:}
url=${url# }

case "$url" in
  http*) ;;
  //*) url="https:${url}" ;;
  /*) url="${WIKI_ORIGIN}${url}" ;;
  *)
    echo "no Location header" >&2
    exit 1
    ;;
esac

escaped=$(printf '%s' "$url" | sed 's/\\/\\\\/g; s/"/\\"/g')
curl -sS -X POST "$TODOS_URL" \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"Read ${escaped}\"}"
