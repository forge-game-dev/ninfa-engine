# Bug #37 — Checkpoint Sprites Missing (L2–L5)

## Status: FIXED ✅

## Severity: Medium
**Category:** Art Asset / Visual Feedback
**Detected by:** Verin (QA smoke test post-PR #36)
**Filed by:** Orion
**Asset owner:** Cedar
**Date:** 2025-01-15

---

## Summary

Players on levels 2–5 see no visible checkpoint sprite when activating checkpoints, despite audio firing correctly. Checkpoints function as position markers but provide no visual confirmation.

---

## Root Cause

 entries for L2–L5 reference:
- \n- \n
Both PNGs only existed in . All other levels 404'd on both variants at runtime.

---

## Fix (applied)

Copied 2 PNGs from  → , , ,  collectibles/ folders.

**Files added (PR #37, SHA fc17fda):**
-  (303B)
-  (137B)
-  (303B)
-  (137B)
-  (303B)
-  (137B)
-  (303B)
-  (137B)

No code changes. No TILE_MAP changes. All 8 PNGs verified HTTP 200 post-deploy.

---

## Audio-Visual UX Note (from Cadenza)

CHECKPOINT trigger fires correctly on collision in all levels — audio is unaffected by missing PNGs. However, players hear the activation sound without seeing the sprite activate on L2–L5. The audio-visual disconnect could feel odd: checkpoint saves without visible confirmation.

**Low priority** — checkpoints function correctly as position markers. Worth revisiting for future UX polish if animation passes are planned.

---

## Verification

\\n