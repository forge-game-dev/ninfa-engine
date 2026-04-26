#!/bin/bash
TOKEN="ghs_0VUS8NzO7FglbNLiGaknHdmOHQ8h233Zonqu"

for num in 61 62 64; do
  echo "=== PR #$num ==="
  curl -s -H "Authorization: token $TOKEN" -H "User-Agent: vesper" \
    "https://api.github.com/repos/forge-game-dev/ninfa-engine/pulls/$num" | \
    grep -E '"(number|title|state|additions|deletions)"' | head -5
done