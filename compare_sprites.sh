#!/bin/bash
cd /app/workspaces/b28ef960-88de-4bb4-ab3e-b6d2c553ac9c/workspace/repos/ninfa-engine || exit 1

echo "=========================================="
echo "SPRITE STRIP IDENTITY CHECK"
echo "=========================================="
echo ""

# Compare strips between old (aab08a5) and new (971eb3d)
for strip in strip_idle strip_run strip_jump strip_fall strip_death strip_victory; do
  echo "--- $strip ---"
  git show aab08a5:docs/art/sprites/$strip.png > /tmp/old_$strip.png 2>/dev/null
  git show 971eb3d:art/sprites/$strip.png > /tmp/new_$strip.png 2>/dev/null
  echo "OLD: size=$(wc -c </tmp/old_$strip.png) md5=$(md5sum </tmp/old_$strip.png | awk '{print $1}')"
  echo "NEW: size=$(wc -c </tmp/new_$strip.png) md5=$(md5sum </tmp/new_$strip.png | awk '{print $1}')"
  if diff -q /tmp/old_$strip.png /tmp/new_$strip.png > /dev/null 2>&1; then
    echo "IDENTICAL ✓"
  else
    echo "DIFFERENT ✗"
  fi
  echo ""
done

echo "=========================================="
echo "INDIVIDUAL FRAME CHECK"
echo "=========================================="
echo ""

# Check if all 24 individual frames are identical (same blob)
echo "Checking individual frame blob uniqueness..."
git ls-tree origin/main -- docs/art/sprites/frames/ | awk '{print $2}' | sort > /tmp/frame_list.txt
echo "Total frame files: $(wc -l </tmp/frame_list.txt)"
echo ""

# Get unique blob hashes for all frame files
git ls-tree origin/main -- docs/art/sprites/frames/ | while read mode type hash path; do
  echo "  $path -> $hash"
done | head -30

echo ""
echo "Unique blob hashes among all frames:"
git ls-tree origin/main -- docs/art/sprites/frames/ | awk '{print $3}' | sort -u | wc -l
echo "unique hashes"

echo ""
echo "=========================================="
echo "MAIN vs KAIRON LANE STRIP IDENTITY"
echo "=========================================="
echo ""

# Are the strips in Kairo's branch the same as what's on main now?
git show origin/main:art/sprites/strip_idle.png > /tmp/main_idle.png 2>/dev/null
echo "main strip_idle:  size=$(wc -c </tmp/main_idle.png) md5=$(md5sum </tmp/main_idle.png | awk '{print $1}')"
echo "971eb3d strip_idle: size=$(wc -c </tmp/new_strip_idle.png 2>/dev/null || echo 'N/A') md5=$(md5sum </tmp/new_strip_idle.png 2>/dev/null | awk '{print $1}')"
if diff -q /tmp/main_idle.png /tmp/new_strip_idle.png > /dev/null 2>&1; then
  echo "MAIN == KAIRON STRIP: IDENTICAL ✓"
else
  echo "MAIN != KAIRON STRIP: DIFFERENT ✗"
fi

echo ""
echo "=========================================="
echo "ANIMATION SPEC ON MAIN"
echo "=========================================="
echo ""

# Check if e200342 exists on main (Cadenza's animation phase spec)
git rev-parse --verify origin/main 2>/dev/null | head -1
git log origin/main --oneline -5
echo ""
git show e200342:docs/audio/ANIMATION_PHASE_AUDIO_SPEC.md 2>/dev/null | head -5
echo "e200342 exists: $(git rev-parse --verify e200342 2>/dev/null && echo YES || echo NO)"

echo ""
echo "=========================================="
echo "STRIP_URLS PATH IN PROTOTYPE"
echo "=========================================="
echo ""

git show origin/zephyr/animation-phase-triggers:docs/tech/Physics_Prototype/prototype_v13.js | grep -A2 "stripUrls"