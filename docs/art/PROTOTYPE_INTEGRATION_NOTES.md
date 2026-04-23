# Prototype Integration Notes
**Date:** 2026-04-23
**Source:** Zephyr Physics Prototype v0.1

## Canvas Specs
- Resolution: 512x288 px
- Aspect ratio: ~16:9
- Debug overlay visible

## Physics Grid (From Prototype)
- Tile size assumed: 16x16 or 32x32 px
- Player: 32x32 sprite fits in tile grid
- Level fits ~32 tiles wide × 18 tiles tall

## Environment Art Implications
| Canvas dimension | Tile count (16px) | Tile count (32px) |
|-----------------|-------------------|-------------------|
| 512 width | 32 tiles | 16 tiles |
| 288 height | 18 tiles | 9 tiles |

## Visual Scale Check
- If tileset uses 32x32: level is 16×9 tiles — good for tutorial
- If tileset uses 16x16: level is 32×18 tiles — more detail possible
- Parallax layers: far at 0.2x scroll, mid at 0.6x scroll

## Integration Timeline
- Prototype validates physics ✅
- Next: Visual assets (tileset, player sprite) to replace debug colors
- Target: Replace placeholder visuals with final art in later phase

## My Tileset Specs
- Floor tiles: 16x16 (matches fine grid)
- Wall tiles: 32x32 (matches coarse grid)
- Platform: 32x32 one-way
- Props: 16x16 (torch), 32x32 (crate), 64x64 (pillar), 128x128 (arch)

**Next:** Await Kairo character sketch → finalize scale → produce tileset PNGs
