# QA Asset Specs — Visual/Collision Reference
**Author:** Cedar | **Date:** 2026-04-23
**For:** Verin (QA) — Visual alignment testing

---

## Purpose
This document provides QA with visual/collision specs for art asset testing. When visual assets are implemented, QA can verify visual hitbox vs collision hitbox alignment.

---

## Player Character

| Property | Value | Notes |
|----------|-------|-------|
| Sprite size | 32x32 px | Base render unit |
| Visual height | ~40px | Includes glow (non-collidable) |
| Collision hitbox | 0.8×1.0 units | ~25.6×32 px (rectangular) |
| Hitbox center | Sprite center | Aligned with sprite |
| Glow radius | 1 unit | Visual-only, no collision |

**Critical:** Glow (~40px) extends beyond collision box (25.6×32px). This is intentional.

### Visual vs Collision Separation
```
[ Visual: 40px total (glow + body) ]
  [ Body: 32x32 px (render) ]
    [ Collision: 25.6x32 px (hitbox) ]
```

**QA Test:** Crystal collection must trigger on collision hitbox overlap, NOT visual glow touch.

---

## Environment Tiles

| Tile Type | Pixel Size | Collision Box |
|-----------|------------|---------------|
| Floor (16x16) | 16×16 | 16×16 (full) |
| Wall (32x32) | 32×32 | 32×32 (full) |
| Platform solid | 32×32 | 32×32 (full) |
| Platform one-way | 32×32 | 32×32 (top only) |

**One-way platform behavior:** Player passes through from below, lands on top.
- Collision only triggers when player y-velocity ≤ 0 (falling/jumping)
- No side collision

---

## Collectibles

### Crystal
| Property | Value |
|----------|-------|
| Sprite size | 16×16 px |
| Visual glow | #ffd700, radius 0.5 units |
| Collection trigger | Collision hitbox overlap (16×16) |

**QA Test:** Visual glow touching crystal does NOT trigger collection. Must have collision overlap.

### Key
| Property | Value |
|----------|-------|
| Sprite size | 16×16 px |
| Collection trigger | Collision hitbox overlap |

### Checkpoint
| Property | Value |
|----------|-------|
| Sprite size | 16×16 px |
| Activation | First collision only |
| Visual feedback | #2ed573 glow pulse |

---

## Hazards

### Spikes
| Property | Value |
|----------|-------|
| Sprite size | 16×16 px |
| Visual | #ff4757 triangular shapes |
| Death trigger | Collision hitbox overlap (16×16) |

---

## Lighting System

| Source | Radius | Color | Effect |
|--------|--------|-------|--------|
| Torch | 2 units | #ff9f43 | Warm light spill |
| Player aura | 1 unit | #00d4ff | Cyan glow, dims in darkness |
| Crystal proximity | 1.5 units | #ffd700 | Boost glow intensity |
| Checkpoint | 1 unit | #2ed573 | Pulse on activation |
| Portal | 2 units | #a55eea | Constant purple glow |

---

## Parallax Layers

| Layer | Scroll Speed | Content |
|-------|-------------|---------|
| Far | 0.2x | Distant arches, stalactites |
| Mid | 0.6x | Wall patterns, chains, pillars |
| Foreground | 1.0x | Gameplay tiles + player |

**QA Test:** Camera follows player. Parallax layers scroll at correct ratios.

---

## UI Elements

| Element | Position | Content |
|---------|----------|---------|
| Crystal counter | Top-left | Icon + number |
| Level indicator | Top-center | "Level X" |
| Pause button | Top-right | Gear icon |

**Font:** Pixel font or clean sans-serif
**Sizes:** 16px (HUD), 24px (menus), 32px (titles)

---

## Edge Cases for QA

1. **Glow collision exclusion:** Visual glow does NOT trigger collectibles
2. **One-way platform:** No side collision, only top landing
3. **Parallax edge:** Camera clamped, no background bleed
4. **Lighting overlap:** Multiple torches blend (additive)
5. **Checkpoint re-touch:** No duplicate activation after first trigger

---

**Document ready for QA review. Pending:** Character sketch from Kairo → visual hitbox confirmation.
