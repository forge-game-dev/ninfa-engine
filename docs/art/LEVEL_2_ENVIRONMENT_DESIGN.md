# Level 2 Environment Design — "The Descent"
**Author:** Cedar | **Version:** 0.1 | **Date:** 2026-04-23
**Status:** Design decisions locked, tiles in production

---

## Zone Overview

| Zone | Layout | Primary Mechanic | Mood |
|------|--------|-------------------|------|
| Zone A | Start, top-left | Water crossing via MP-H1 | Tension entry |
| Zone B | Mid, center | Vertical shaft climb via MP-V1 | Descent into danger |
| Zone C | Right, challenge | Final traversal + exit portal | Peak tension |

**3 Checkpoints:** CP-01 (post-water-crossing), CP-02 (post-V-climb), CP-03 (challenge entry)
**12 Crystals:** C-01 through C-12
**70% gate:** 9 crystals to unlock exit portal

---

## Color Palette Additions

### Water Family
| Name | Hex | Use |
|------|-----|-----|
| water_deep | #1a2d3e | Deep water body (drowning zone) |
| water_surface | #2d4a5e | Standard water surface |
| water_shimmer | #4d6a7e | Animated highlight frame |
| water_splash | #6d8a9e | Surface ripple accents |

### Atmosphere Additions
| Name | Hex | Use |
|------|-----|-----|
| moss | #1a3a2e | Moss creeping from ceiling |
| moss_hi | #2a5a3e | Moss highlights |
| amber_warm | #4a3020 | Zone C midground tint (tension cue) |
| stalactite | #2a2a4e | BG stalactite silhouettes |

---

## Water Tile Inventory (4 tiles)
- **water_surface_a.png** — Frame 1 of 2-frame shimmer animation
- **water_surface_b.png** — Frame 2 of shimmer (highlight dominant)
- **water_deep.png** — Full deep water body, drowning zone
- **water_edge.png** — Stone-to-water transition tile

### Animation Spec (for Zephyr)
- 2-frame cycle, 500ms per frame (2 FPS)
- Variables: `waterAnimFrame` (0/1), `waterAnimTimer` (ms)
- Toggle frame at 500ms threshold

---

## Moving Platform Visual Design

### MP-H1 (Horizontal, 3 u/s, 4-unit range)
- Stone base consistent with P1/P2
- 3 amber chevrons (#ff9f43) overlaid on top face pointing travel direction
- Subtle wear pattern on trailing edge

### MP-V1 (Vertical, 2 u/s, 2-unit range)
- Same stone base, slightly narrower (fits vertical shaft)
- UP arrow markings in amber (#ff9f43)

---

## Background Layers (3 parallax layers)

### Layer 1 (Furthest, 0.1x parallax)
- Stone texture, same pattern as Level 1 bg_stone

### Layer 2 (Stalactite, 0.3x parallax)
- Dark purple-stone (#2a2a4e) irregular stalactites hanging from top
- Varied heights: 8-32px range
- Z-index: 1

### Layer 3 (Moss, 0.5x parallax)
- Moss green (#1a3a2e) creeping from ceiling edges
- Zone B dominant, Zone A subtle
- Z-index: 2

---

## Level 2 Tileset Inventory

### Inherited from Level 1
- tile_32_floor_a/b, tile_32_wall, tile_32_wall_top
- tile_32_corner_l/r
- Crystal sprites C-01 through C-08
- Checkpoint inactive/active
- Portal

### New for Level 2
- water_surface_a.png, water_surface_b.png
- water_deep.png, water_edge.png
- mp_h1.png, mp_v1.png
- bg_stalactite_a.png, bg_stalactite_b.png
- bg_moss_creep.png
- Crystal sprites C-09 through C-12 (challenge tier)
- midground_amber.png (Zone C tinted midground)

---

## Design Locked
- Water palette: #2d4a5e range (cooler than Level 1 dry stone)
- Moving platform markers: amber chevrons (#ff9f43)
- 2-frame shimmer animation at 2 FPS
- Zone C: stronger amber undertones for tension
- No spikes — water is sole hazard
- Static platforms P1/P2: same stone family as Level 1
- 3 checkpoints, 12 crystals, 70% exit gate

## Pending (Post-D15)
- Water animation timing: 500ms cycle (needs Zephyr confirmation)
- Drowning SFX + bubble particles from Cadenza
- Level 2 crystal exact positions from Vesper's brief

---

*Level 2 Environment Design v0.1 — Pending Nicolas D15 approval to begin asset production.*
