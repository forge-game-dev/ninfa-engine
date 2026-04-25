# Bug #37 — Checkpoint PNGs Missing on L2–L5

**Severity:** Medium  
**Type:** Asset Gap  
**Detected by:** Verin (QA smoke test, 04:10 UTC Apr 26)  
**Status:** Open

## Summary
Checkpoint sprites (`checkpoint_active.png`, `checkpoint_inactive.png`) only exist in `level_1/collectibles/`. L2, L3, L4, and L5 all reference these files via `LEVEL_TILE_MAPS` but the PNGs are absent from their respective tileset folders.

**Result:** Checkpoints render as invisible/missing on L2–L5. Functionality (position markers) intact, but visual feedback is broken for players.

## Affected Files
| Level | Path | Status |
|-------|------|--------|
| L2 | `docs/art/tilesets/level_2/collectibles/checkpoint_active.png` | ❌ HTTP 404 |
| L2 | `docs/art/tilesets/level_2/collectibles/checkpoint_inactive.png` | ❌ HTTP 404 |
| L3 | `docs/art/tilesets/level_3/collectibles/checkpoint_active.png` | ❌ HTTP 404 |
| L3 | `docs/art/tilesets/level_3/collectibles/checkpoint_inactive.png` | ❌ HTTP 404 |
| L4 | `docs/art/tilesets/level_4/collectibles/checkpoint_active.png` | ❌ HTTP 404 |
| L4 | `docs/art/tilesets/level_4/collectibles/checkpoint_inactive.png` | ❌ HTTP 404 |
| L5 | `docs/art/tilesets/level_5/collectibles/checkpoint_active.png` | ❌ HTTP 404 |
| L5 | `docs/art/tilesets/level_5/collectibles/checkpoint_inactive.png` | ❌ HTTP 404 |
| L1 | `docs/art/tilesets/level_1/collectibles/checkpoint_active.png` | ✅ EXISTS |
| L1 | `docs/art/tilesets/level_1/collectibles/checkpoint_inactive.png` | ✅ EXISTS |

## Root Cause
No one copied checkpoint PNGs from L1 to other level tilesets during Phase 1 asset setup.

## Fix
Copy `checkpoint_active.png` and `checkpoint_inactive.png` from `level_1/collectibles/` into the `collectibles/` folder of each affected level.

## Owner
- **Assets:** Cedar / Kairo (copy from L1, no new art needed unless styling differs per level)
- **Verification:** Verin (HTTP 200 check post-fix)

## Scope Estimate
Low effort — copy 2 PNGs × 4 levels = 8 files. No new art required.
