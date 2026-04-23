# Dungeon Runner — Environment Style Guide v0.1

**Status:** Draft v0.1 | **Author:** Cedar (Artist/Illustrator) | **Date:** 2026-04-22
**Based on:** GDD v1.0 (Vesper) | **Sync:** Kairo (character design alignment pending)
**Scope:** Environment art, tilesets, backgrounds, props, lighting system

---

## 1. Art Direction Overview

**Concept:** Dark atmospheric dungeon minimalist with controlled light points.
The environment is vast and monumental; the player is small and glowing.
Contrast in scale and luminosity is the primary emotional engine.

**Core visual principles:**
- **Silhouette first** — every element readable at thumbnail scale
- **Light tells the story** — darkness is the canvas, light is the content
- **Controlled palette** — maximum 8 colors, used with discipline
- **Geometric vs organic** — environment is angular/geometric; organic details (moss, cracks) are accents
- **Overscale effect** — props and architecture feel monumental relative to 32x32 player

---

## 2. Color Palette

### Primary Dungeon Colors

| Token | Hex | Name | Usage |
|-------|-----|------|-------|
| `--bg-void` | `#0d0d1a` | Void Black | Deepest background, off-screen areas |
| `--bg-dark` | `#1a1a2e` | Dark Stone | Primary background, dungeon walls |
| `--bg-mid` | `#2a2a4e` | Shadow Stone | Mid-layer background |
| `--stone-warm` | `#4a4a6a` | Warm Stone | Platforms, structural elements |
| `--stone-light` | `#6a6a8a` | Lit Stone | Edges catching torchlight |
| `--accent-orange` | `#ff9f43` | Torch/Fire | Primary warm light source |
| `--accent-cyan` | `#00d4ff` | Player Cyan | Player aura, magical elements |
| `--accent-gold` | `#ffd700` | Crystal Gold | Collectibles, key items |
| `--accent-red` | `#ff4757` | Hazard Red | Spikes, traps, danger |
| `--accent-green` | `#2ed573` | Checkpoint Green | Save/checkpoint indicators |
| `--accent-purple` | `#a55eea` | Portal Purple | Exit portal, warp zones |
| `--moss` | `#3d6b3d` | Dungeon Moss | Organic accent, lower walls |
| `--crack` | `#0a0a14` | Shadow Crack | Dark details in stone |

### Color Usage Rules

- **Backgrounds:** `--bg-void`, `--bg-dark`, `--bg-mid` only
- **Platforms/tiles:** `--stone-warm` with `--stone-light` edge highlights
- **Lighting:** `--accent-orange` for torch, `--accent-cyan` for player
- **Collectibles:** `--accent-gold` base, never tinted
- **Hazards:** `--accent-red` base, never tinted
- **Checkpoints/portals:** `--accent-green` / `--accent-purple` respectively

### Color Restrictions
- No gradients across tiles — flat fills with hard edges
- Shadow layers use `--bg-void` or `--crack` only
- Specular highlights on stone edges: `--stone-light` at max
- Glow effects: additive blend, use palette colors only

---

## 3. Tileset System

### Grid Specification

| Layer | Resolution | Purpose |
|-------|-----------|---------|
| Base tile | 16x16 px | Smallest readable element, floor patterns |
| Platform tile | 32x32 px | Standard walkable platform unit |
| Wall tile | 32x32 px | Dungeon wall blocks |
| Prop tile | 32x32 / 64x64 | Environmental props |
| Large prop | 64x64 / 128x128 | Overscale elements (arches, pillars) |

### Tile Variation Types (per GDD Section 4.5)

Each tile category needs **3-4 variations:**

**Floor tiles (16x16, 32x32):**
- Inner (flat, full stone)
- Edge (one exposed edge, subtle shadow)
- Corner (two exposed edges, L-shaped)
- Cracked (fracture detail, `--crack` color)
- Mossy (lower wall sections, `--moss` accent)

**Wall tiles (32x32):**
- Solid (full block)
- Top edge (exposed top with shadow underneath)
- Brick pattern (horizontal mortar lines)
- Cracked (structural damage)
- Mossy (organic growth on lower half)

**Platform tiles (32x32):**
- Standard (full width platform)
- Left end (rounded or flat left edge)
- Right end (rounded or flat right edge)
- Floating (no connections, all edges visible)

### Tileset Naming Convention

```
env_tileset_[category]_[variation]_[index].png
Examples:
  env_tileset_floor_16_edge_01.png   (16x16, floor edge, variant 1)
  env_tileset_wall_32_solid_01.png   (32x32, solid wall)
  env_tileset_platform_32_endL_01.png (32x32, left-end platform)
```

---

## 4. Props

### GDD-Defined Props (Section 4.5)

| Prop | Size | Color Key | Notes |
|------|------|-----------|-------|
| Torch | 16x16 / 32x32 | `--accent-orange` + `--stone-warm` | Animated flicker, light radius 2 units |
| Chain | 16x wide, variable | `--stone-warm` | Vertical/horizontal, links visible |
| Stone block | 32x32 / 64x64 | `--stone-warm` / `--stone-light` | Stacked, cracked variants |
| Moss patch | 16x16 / 32x16 | `--moss` | Ground-level accent |
| Crystal | 16x16 | `--accent-gold` | Glowing collectible |
| Spike | 16x16 | `--accent-red` | Hazard indicator |
| Pressure plate | 32x32 | `--stone-warm` + `--accent-cyan` | Activated state |
| Portal frame | 64x64 | `--accent-purple` | Exit visual |

### Overscale Prop Philosophy

Props should read as **monumental relative to the 32x32 player:**

- **Giant archway:** 128x128, player passes underneath — creates scale contrast
- **Massive pillar:** 64x64, player navigates around base
- **Colossal gear:** 128x128, decorative background, subtle rotation
- **Oversized skull:** 64x64, environmental storytelling element

### Prop Naming Convention

```
env_prop_[name]_[size].png
Examples:
  env_prop_torch_wall_16.png
  env_prop_pillar_stone_64.png
  env_prop_arch_giant_128.png
```

---

## 5. Background System

### Parallax Layers (2 Layers per GDD Section 4.4)

**Layer 0 — Far Background (slowest parallax, 0.2x scroll):**
- Deep void color: `--bg-void`
- Subtle geometric shapes: distant arches, floating stones
- Minimal detail — atmospheric only
- Size: fits level width × 1.5x

**Layer 1 — Mid Background (medium parallax, 0.6x scroll):**
- Color: `--bg-dark` to `--bg-mid`
- Larger dungeon structures visible: walls, columns, archways
- Stone patterns with `--stone-warm` hints
- Size: fits level width × 1.2x

**Layer 2 — Foreground (1.0x scroll, on top of gameplay):**
- This is the tileset layer (see Section 3)
- Full color palette active
- Player interacts with this layer

### Background Naming Convention

```
env_bg_[layer]_YYYYxXXXX.png
Examples:
  env_bg_far_1920x1080.png   (Layer 0)
  env_bg_mid_1920x1080.png   (Layer 1)
```

---

## 6. Lighting System

### GDD-Defined Light Sources

| Source | Color | Radius | Behavior |
|--------|-------|--------|----------|
| Player aura | `--accent-cyan` `#00d4ff` | 1 unit | Follows player, constant glow |
| Torch | `--accent-orange` `#ff9f43` | 2 units | Animated flicker, static position |
| Crystal glow | `--accent-gold` `#ffd700` | 0.75 units | Subtle pulse |
| Portal | `--accent-purple` `#a55eea` | 1.5 units | Rotating/pulsing |
| Checkpoint | `--accent-green` `#2ed573` | 1 unit | Activates on touch |

### Lighting Implementation Notes (for Zephyr/Dev)

- **Vignette:** Dark edges of screen, `rgba(13,13,26,0.3)` at corners fading to transparent
- **Torch flicker:** Radius oscillates 1.8–2.2 units, 0.3s period, smooth sine wave
- **Layered lighting:** Background layers receive 50% of light influence
- **Player as light source:** Cyan glow illuminates nearby tiles from `--stone-warm` to `--stone-light`

### Art Production Notes

- Background tiles should be drawn with light/shadow baked in
- Torch positions in level design determine lighting hotspots
- Dark areas between torch lights should be intentionally dark (`--bg-dark` to `--bg-void`)
- **Do NOT over-light the scene** — darkness is the aesthetic

---

## 7. UI Art Elements (Environment Contribution)

### HUD Elements (if art-owned per Section 4.6)

| Element | Style | Colors |
|---------|-------|--------|
| Health orb | Circular, filled | `--accent-cyan` |
| Crystal counter | Hexagonal gem icon | `--accent-gold` |
| Key indicator | Key silhouette | `--accent-orange` |
| Level indicator | Roman numeral | `--stone-light` on `--bg-dark` |
| Pause button | Three horizontal lines | `--stone-light` |

### In-Game Environment UI

| Element | Style |
|---------|-------|
| Checkpoint flag | Triangular, `--accent-green` |
| Locked door frame | Stone arch with `--accent-orange` glow |
| Exit portal | Swirling, `--accent-purple` |
| Tutorial text | `--stone-light` on `--bg-void`, minimal |

---

## 8. Level Atmosphere by Stage

Based on GDD 5-level structure, each level has escalating atmosphere:

### Level 1 — Awakening (Tutorial)
- **Mood:** Safe, introductory, hopeful
- **Torch density:** High (every 4-6 tiles)
- **Color temperature:** Warmest — `--accent-orange` dominant
- **Hazards:** Minimal, clearly visible
- **Moss/organic:** Present, comforting
- **Atmosphere keyword:** **WELCOME**

### Level 2 — First Steps (Checkpoints)
- **Mood:** Learning, cautious progress
- **Torch density:** Medium (every 6-8 tiles)
- **Color temperature:** Balanced orange + cyan
- **Atmosphere keyword:** **DISCOVERY**

### Level 3 — Deepening (Keys/Doors)
- **Mood:** Tension, mystery
- **Torch density:** Lower (every 8-10 tiles)
- **Color temperature:** Cooler — more `--bg-dark`, `--accent-cyan` appears
- **Atmosphere keyword:** **MYSTERY**

### Level 4 — The Trial (Hazards)
- **Mood:** Danger, precision required
- **Torch density:** Sparse, dramatic
- **Color temperature:** Red accents, high contrast
- **Atmosphere keyword:** **TRIAL**

### Level 5 — Ascent (All Mechanics)
- **Mood:** Climax, triumph approaching
- **Torch density:** Dynamic — dim then bright
- **Color temperature:** All colors present, culminating palette
- **Atmosphere keyword:** **ASCENT**

---

## 9. Scale Reference

### Player-to-Environment Scale

```
Player:           32x32 px  (smallest readable element at 16x16 is the base tile)

Base tile:        16x16 px  (floor texture detail)
Platform tile:    32x32 px  (1x player height)
Wall block:       32x32 px  (1x player height)
Standard prop:    32x32 px  (torch, chain — player-sized)
Large prop:       64x64 px  (2x player — pillar, crate)
Overscale prop:  128x128 px (4x player — arch, gear, skull)
Archway opening:  64x64 px  (player passes through)
Ceiling height:   96x96 px  (3x player — feels spacious)

Parallax BG:     Full level width × 1.5x (far), × 1.2x (mid)
```

### Scale Ratio Summary
- **Player : Platform tile:** 1:1 (horizontal), 1:1 (vertical)
- **Player : Large prop:** 1:2 (both axes)
- **Player : Overscale prop:** 1:4 (both axes)
- **Platform : Ceiling:** 1:3

---

## 10. Coordination with Kairo

### Status: AWAITING KAIRO'S INPUT

Pending from Kairo (character design):
- [ ] First sketch/concept of player character (creature/orb type)
- [ ] Character silhouette dimensions for scale calibration
- [ ] Character color application (confirmed: `--accent-cyan`)
- [ ] Animation requirements (idle, walk, jump — impacts tileset positioning)

### I'll Send to Kairo:
- [x] This environment style guide v0.1 (when finalized)
- [ ] Tileset scale reference diagram
- [ ] Background parallax structure
- [ ] Lighting radius specs for integration

### Shared Decisions Needed:
1. **Silhouette contrast rule** — environment is angular/rectangular; character should be curved/organic or very geometric? (GDD implies geometric creature, angular environment is my assumption — needs confirmation)
2. **Shared icon set** — if UI graphics overlap, coordinate early
3. **Promotional art style** — will promotional illustrations match in-game style or be more stylized?

---

## 11. References & Mood Board Direction

### Visual Reference Points

**Do:**
- Cuphead dungeon backgrounds — strong silhouette, limited palette
- Limbo — atmospheric darkness with single-tone figures
- Celeste Chapter 1 — clean platformer tileset readability
- Darkest Dungeon (environment tones) — warm torch light on cold stone

**Avoid:**
- Over-detailed pixel art (readability at 32x32 fails)
- Bright, saturated palettes (breaks atmosphere)
- Symmetrical compositions (dungeons are organic/worn)

### Mood Keywords by Level
1. Awakening → **Ancient, Quiet, Inviting**
2. First Steps → **Exploring, Measured, Hopeful**
3. Deepening → **Cold, Uncertain, Hidden**
4. The Trial → **Hostile, Precise, Burning**
5. Ascent → **Triumphant, Radiant, Free**

---

## 12. Deliverables Checklist (Environment Art)

| Deliverable | Status | Priority | Notes |
|-------------|--------|----------|-------|
| Environment Style Guide v0.1 | ✅ Draft | HIGH | This document |
| Color Palette Sheet (exported) | ⏳ Pending | HIGH | 8-color swatch sheet |
| Tileset: Floor (16x16, all variations) | ⏳ Pending | HIGH | Levels 1-5 shared |
| Tileset: Walls (32x32, all variations) | ⏳ Pending | HIGH | Levels 1-5 shared |
| Tileset: Platforms (32x32, all variations) | ⏳ Pending | HIGH | Levels 1-5 shared |
| Props: Torch (animated frames) | ⏳ Pending | HIGH | Flicker animation |
| Props: Chains, Stones, Moss patches | ⏳ Pending | MEDIUM | Set dressing |
| Props: Crystals (animated) | ⏳ Pending | MEDIUM | Collectible glow |
| Props: Spikes | ⏳ Pending | MEDIUM | Hazard indicator |
| Props: Overscale elements | ⏳ Pending | LOW | Level 4-5 drama |
| Background Layer 0 (far) | ⏳ Pending | MEDIUM | Atmospheric depth |
| Background Layer 1 (mid) | ⏳ Pending | MEDIUM | Structure hinting |
| UI: In-game elements | ⏳ Pending | MEDIUM | Checkpoint, portal, door |
| Level 1 Mood Board | ⏳ Pending | HIGH | Visual direction reference |
| Level 1 Environment Concept Art | ⏳ Pending | HIGH | First playable level |

---

## Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-04-22 | Cedar | Initial draft based on GDD v1.0 |

---

*Next update: After Kairo shares first character concept sketch for scale calibration*
