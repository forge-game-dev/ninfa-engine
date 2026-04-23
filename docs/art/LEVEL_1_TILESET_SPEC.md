# Level 1 Tileset Spec — "Awakening" (Tutorial)
**Author:** Cedar | **Date:** 2026-04-23
**Status:** DRAFT — pending Kairo sketch for scale check

---

## 1. Tile Grid System

| Tile Type | Size | Pixel Art Spec | Qty Needed |
|-----------|------|----------------|------------|
| Floor (base) | 16x16 | Flat, minimal detail, 3 variations | 4-6 |
| Wall (solid) | 32x32 | Stone block, 3-4 corner/edge variants | 8-12 |
| Platform (one-way) | 32x32 | Flat top, thinner visual weight | 2-3 |
| Background stone | 16x16 | Decorative, non-interactive | 6-8 |

---

## 2. Floor Tiles (16x16)

### Floor_01 — Flat Stone
```
Base: #4a4a6a
Top edge: #5a5a7a (1px highlight)
Bottom edge: #3a3a5a (1px shadow)
Surface: subtle texture dots
```
**Usage:** Ground level, tutorial simplicity

### Floor_02 — Cracked Stone
```
Base: #4a4a6a
Crack: #2a2a4e (center diagonal crack)
Top edge: #5a5a7a
```
**Usage:** Decorative variation, adds visual interest

### Floor_03 — Moss Stone
```
Base: #4a4a6a
Moss patches: #3d6b3d (top-left, bottom-right corners)
```
**Usage:** Near checkpoints, organic feel

---

## 3. Wall Tiles (32x32)

### Wall_Corner_TL / TR / BL / BR
```
Corner stone with beveled edge
Main: #4a4a6a
Highlight: #6a6a8a
Shadow: #2a2a4e
```
**Purpose:** Clean 90° corners

### Wall_Edge_H / Wall_Edge_V
```
Horizontal/vertical wall face
Main: #4a4a6a
Texture: subtle stone pattern
```
**Purpose:** Long wall runs

### Wall_Inner
```
Interior wall section
Main: #3a3a5a (slightly darker)
```
**Purpose:** Fills interior space

---

## 4. Platform Tiles (32x32)

### Platform_Solid
```
Flat top surface
Top: #6a6a8a (highlight line)
Body: #4a4a6a
Bottom: #3a3a5a
```
**Note:** 1-unit height, player stands on top

### Platform_OneWay (passthrough)
```
Slimmer visual — only top edge visible
Top: #5a5a7a
No body visible
```
**Note:** Player can jump through from below

---

## 5. Background Tiles (16x16)

### BG_Stone_Dark
```
#2a2a4e base
No interactive lighting
Used for parallax far layer
```

### BG_Stone_Mid
```
#1a1a2e base
Subtle texture
Parallax mid layer
```

---

## 6. Prop Reference (for tile composition)

| Prop | Sprite Size | Place on | Interaction |
|------|-------------|----------|-------------|
| Torch | 16x16 | Wall tile | Light source (radius 2u) |
| Chain | 16 wide | Ceiling/wall | Decorative |
| Moss | 16x16 | Floor/wall | Color accent |
| Crack | 16x16 | Floor/wall | Detail |
| Crate | 32x32 | Floor | Pushable (future) |
| Pillar | 64x64 | Floor | Overscale decoration |
| Arch | 128x128 | Wall | Entrance/exit framing |

---

## 7. Color Mapping

```
Floor:        #4a4a6a / #5a5a7a / #3a3a5a
Wall:         #4a4a6a / #6a6a8a / #2a2a4e
Platform:     #5a5a7a / #4a4a6a / #3a3a5a
Background:   #2a2a4e / #1a1a2e / #0d0d1a
Torch light:  #ff9f43 (warm spill on adjacent tiles)
Player glow:  #00d4ff (visual only, no collision)
```

---

## 8. Player Scale Reference

```
Player: 32x32 sprite / ~40px visual w/ glow
Floor: 16x16 → player is 2x floor height
Wall: 32x32 → player is 1x wall height
Platform: 32x32 → player fits exactly
Overscale props: 64x64 → player is 0.5x prop
```

---

**Pending:** Kairo sketch to verify proportions before production.
