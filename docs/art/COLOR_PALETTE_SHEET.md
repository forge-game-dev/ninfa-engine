# Dungeon Runner — Color Palette Sheet v0.1

**Game:** Dungeon Runner (Platform/Puzzle 2D)
**Status:** Draft v0.1 | **Author:** Cedar | **Date:** 2026-04-22
**Based on:** GDD v1.0, Section 4.2

---

## Overview

Limited palette system — 8 core colors + 4 accent colors.
Built for: dark atmospheric dungeon, controlled light points, flat design.

**Rule:** No gradients across tiles. Hard edges only. Flat fills.

---

## Core Palette (8 Colors)

### Background Tier

| Token | Hex | RGB | Name | Usage |
|-------|-----|-----|------|-------|
| `--bg-void` | #0d0d1a | 13,13,26 | Void Black | Deepest BG, off-screen |
| `--bg-dark` | #1a1a2e | 26,26,46 | Dark Stone | Primary BG, dungeon walls |
| `--bg-mid` | #2a2a4e | 42,42,78 | Shadow Stone | Mid-layer BG |

### Structural Tier

| Token | Hex | RGB | Name | Usage |
|-------|-----|-----|------|-------|
| `--stone-warm` | #4a4a6a | 74,74,106 | Warm Stone | Platforms, walls |
| `--stone-light` | #6a6a8a | 106,106,138 | Lit Stone | Stone edges catching light |

### Organic Accent

| Token | Hex | RGB | Name | Usage |
|-------|-----|-----|------|-------|
| `--moss` | #3d6b3d | 61,107,61 | Dungeon Moss | Ground-level organic accent |
| `--crack` | #0a0a14 | 10,10,20 | Shadow Crack | Dark details in stone |

---

## Accent Palette (4 Colors — Gameplay Critical)

### Warm — Environmental Light

| Token | Hex | RGB | Name | Usage |
|-------|-----|-----|------|-------|
| `--accent-orange` | #ff9f43 | 255,159,67 | Torch/Fire | Primary light source, warm |

### Cool — Player Identity

| Token | Hex | RGB | Name | Usage |
|-------|-----|-----|------|-------|
| `--accent-cyan` | #00d4ff | 0,212,255 | Player Cyan | Player orb, magical elements |

### Interactive — Gameplay

| Token | Hex | RGB | Name | Usage |
|-------|-----|-----|------|-------|
| `--accent-gold` | #ffd700 | 255,215,0 | Crystal Gold | Collectibles, key items |
| `--accent-green` | #2ed573 | 46,213,115 | Checkpoint Green | Save/checkpoint indicators |
| `--accent-red` | #ff4757 | 255,71,87 | Hazard Red | Spikes, traps, danger |
| `--accent-purple` | #a55eea | 165,94,234 | Portal Purple | Exit portal, warp zones |

---

## Color Usage Map

```
SCREEN COMPOSITION (typical Level 1 screenshot):

     [bg-void #0d0d1a]        ← outer frame, vignette edges
          ↓
     [bg-dark #1a1a2e]        ← 60% of visible area, primary BG
          ↓
     [bg-mid #2a2a4e]         ← 20% of visible area, mid BG layer
          ↓
  [stone-warm #4a4a6a]       ← platforms, walls, 15% of area
          ↓
  [stone-light #6a6a8a]      ← lit edges catching torchlight
          ↓
  [accent-orange #ff9f43]     ← TORCHES — 5% of area, 50% of interest
          ↓
  [accent-cyan #00d4ff]       ← PLAYER — 1-2% of area, focal point
          ↓
  [accent-gold #ffd700]       ← CRYSTALS — scattered, reward markers
          ↓
  [moss #3d6b3d]             ← lower wall/floor corners, organic
          ↓
  [crack #0a0a14]             ← stone detail, shadow seams
```

---

## Swatch Reference (ASCII)

```
VOID     DARK      MID       WARM      LIGHT     ORANGE    CYAN
███████  ████████  ████████  ████████  ████████  ████████  ████████
#0d0d1a  #1a1a2e  #2a2a4e   #4a4a6a   #6a6a8a   #ff9f43  #00d4ff

GOLD      GREEN     RED       PURPLE    MOSS      CRACK
███████  ████████  ████████  ████████  ████████  ████████
#ffd700  #2ed573   #ff4757   #a55eea   #3d6b3d   #0a0a14
```

---

## Darkest Dungeon Parallax Reference

Colors map to Darkest Dungeon's environmental tones:

```
Dungeon Runner Palette  ↔  Darkest Dungeon Equivalent
─────────────────────────────────────────────────────
#1a1a2e (dark stone)    ↔  Dungeon Stone Base
#4a4a6a (warm stone)    ↔  Brick highlight
#ff9f43 (torch orange)   ↔  Torch warm glow
#00d4ff (player cyan)    ↔  Magical entity glow
#3d6b3d (moss green)     ↔  Organic dungeon growth
```

---

## Light Interaction Rules

### Ambient Light (No Source)
- Use `--bg-dark`, `--bg-mid`, `--stone-warm` only
- Shadows: `--crack` or `--bg-void`
- NO warm/cool glow

### Torch-lit Area
- Base: `--stone-warm`
- Highlights: `--stone-light`
- Warm spill: `--accent-orange` at 30-50% opacity, soft edge
- Cold spill (opposite wall): `--accent-cyan` at 10-20% opacity (player proximity)

### Player Glow Area
- Base: `--stone-warm`
- Highlights: `--stone-light`
- Cyan spill: `--accent-cyan` at 40-60% opacity, radius 1 unit
- Warm influence: `--accent-orange` at 10-15% opacity (nearby torch)

### Crystal Glow Area
- Base: `--stone-warm`
- Highlights: `--accent-gold` at 60-80% opacity
- Gold spill: `--accent-gold` at 20-30% opacity, radius 0.75 units

### Portal Glow Area
- Base: `--stone-warm`
- Highlights: `--accent-purple` at 70-90% opacity
- Purple spill: `--accent-purple` at 30-40% opacity, radius 1.5 units

### Checkpoint Glow Area
- Base: `--stone-warm`
- Highlights: `--accent-green` at 60-80% opacity
- Green spill: `--accent-green` at 20-30% opacity, radius 1 unit

---

## Level-Specific Color Weighting

| Level | BG% | Stone% | Orange% | Cyan% | Gold% | Red% |
|-------|-----|--------|---------|-------|-------|------|
| 1 Awakening | 80% | 15% | 4% | 1% | <1% | 0% |
| 2 First Steps | 75% | 15% | 5% | 2% | 2% | 1% |
| 3 Deepening | 70% | 18% | 5% | 3% | 2% | 2% |
| 4 The Trial | 70% | 15% | 6% | 2% | 2% | 5% |
| 5 Ascent | 65% | 15% | 8% | 3% | 3% | 3% |

*% = approximate screen area contribution*

---

## Restrictions

**NEVER use outside this palette:**
- No pure white (`#ffffff`) or pure black (`#000000`) in assets
- No saturated greens (use `--moss` or `--accent-green` only)
- No warm yellows outside `--accent-gold` or `--accent-orange`
- No blue-purple tones (reserve for `--accent-purple` only)
- No gradients — flat fills with hard edges on all tiles

**Exception:** Vignette can use `rgba(13,13,26,0.3)` at corners fading transparent — this is the ONLY acceptable gradient.

---

## Export Checklist

| Deliverable | Format | Size | Notes |
|-------------|--------|------|-------|
| Palette sheet (reference) | PNG | 800x600 | Full swatch with labels |
| Tile-ready palette | PNG | 64x64 swatches | Each color tile-sized |
| UI palette | PNG | 256x32 | Horizontal swatch for UI dev |
| Lighting reference | PNG | 400x300 | Light interaction examples |

---

*Next: Create first tileset draft (floor + wall + platform variations)*
