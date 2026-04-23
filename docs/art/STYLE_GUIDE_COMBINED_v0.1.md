# Style Guide v0.1 — Dungeon Runner
**Authors:** Cedar (Environment) + Kairo (Character)
**Date:** 2026-04-23
**Status:** TEAM REVIEW — Awaiting selection on player concept

---

## Combined Document
This document merges:
- **Cedar:** Environment Style Guide v0.1, Level 1 Mood Board, Color Palette, Character-Environment Coordination
- **Kairo:** Character Design Direction, Style Guide v0.1, Glow Specs

---

## 1. Visual Language

**Core Style:** Flat Design + Minimal Dungeon
- No gradients, no depth shading
- Strong silhouette readability for gameplay clarity
- Controlled 12-color palette
- Contrast-driven lighting: cyan glow vs warm orange torch light

**Shape Contrast System:**
- Player: Organic-geometric hybrid — curved/oval silhouette, "alive" feel
- Environment: Angular/architectural — rectangles, arches, pillars
- Crystals: Faceted/geometric — angular for contrast
- Hazards: Sharp/triangular — immediate threat readability

---

## 2. Color System (12 Colors)

| Name | Hex | Usage |
|------|-----|-------|
| Background Dark | #1a1a2e | Base dungeon void |
| Background Deeper | #0d0d1a | Far parallax |
| Platform Base | #4a4a6a | Standard surfaces |
| Platform Highlight | #6a6a8a | Tile edge highlights |
| Platform Shadow | #2a2a4a | Tile depth |
| Player Cyan | #00d4ff | Player core, collectible proximity |
| Crystal Gold | #ffd700 | Crystals, victory |
| Hazard Red | #ff4757 | Spikes, death zones |
| Torch Orange | #ff9f43 | Light sources |
| Checkpoint Green | #2ed573 | Checkpoint activation |
| Portal Purple | #a55eea | Exit portal |

**Rules:** No gradients — flat fills only.

---

## 3. Scale Reference

| Element | Size | Notes |
|---------|------|-------|
| Base Tile | 16x16 px | Fine detail, floor |
| Platform Tile | 32x32 px | Standard, wall |
| Player Sprite | 32x32 px | Character |
| Visual Height w/ Glow | ~40px | Non-collidable |
| Collision Hitbox | 0.8×1.0 units | ~25.6×32 px |
| Overscale Props | 64x64 / 128x128 px | 4x-8x base |

**Philosophy:** Player appears small/tiny against monumental architecture.

---

## 4. Player Character

**3 Concept Variations (SELECT ONE):**
1. **Geometric Slime** — Rounded blob, faceted edges, internal glow lines
2. **Crystal Wisp** — Diamond shape, trailing glow particles  
3. **Orb Creature** — Perfect circle/oval, pulsing inner pattern

**Glow Behavior:**
- Constant: 1-unit radius cyan (#00d4ff) always visible
- Dark adaptation: Dims in darkness, never disappears
- Crystal proximity: Intensifies near collectibles
- Torch contrast: Cyan distinct from orange (#ff9f43)

**Animation States:**
| State | Frames | Notes |
|-------|--------|-------|
| Idle | 2-4 | Subtle pulse/breathe |
| Run | 4-6 | Squash/stretch, direction lean |
| Jump | 2-4 | Stretch ascent, squash descent |
| Fall | 2 | Elongated, trailing glow |
| Death | 4-6 | Fade/shatter, glow dissipates |
| Victory | 4 | Expand/brighten, particle burst |

---

## 5. Environment Art

### Tileset System
- **Floor tiles:** 16x16 px, 3 variations (flat, cracked, moss)
- **Wall tiles:** 32x32 px, corner/edge/inner variants
- **Platform tiles:** 32x32 px, solid + one-way variants
- **Background tiles:** 16x16 px, non-interactive

### Parallax Layers
- Far: 0.2x scroll speed
- Mid: 0.6x scroll speed
- Foreground: 1.0x (actual gameplay layer)

### Lighting System
- **Torch:** Radius 2 units, warm orange (#ff9f43)
- **Player Aura:** Radius 1 unit, cyan (#00d4ff)
- **Crystal glow:** Gold (#ffd700), proximity-based

### Props
| Prop | Size | Place on |
|------|------|----------|
| Torch | 16x16 | Wall |
| Chain | 16 wide | Ceiling |
| Moss | 16x16 | Floor/wall |
| Pillar | 64x64 | Floor |
| Arch | 128x128 | Entrance/exit |

---

## 6. Integration Notes (From Zephyr Prototype)

- Canvas: 512x288 px (16:9)
- Grid: 16x16 base tile = 32×18 tile level
- Parallax scroll ratios match prototype camera

---

## 7. Open Questions

1. ✅ Player concept selection needed (Slime / Wisp / Orb)
2. Glow intensity range for engine? (pending @Zephyr)
3. ✅ Environment alignment confirmed (Cedar)

---

**Next Steps:**
- Team selects player concept
- Kairo produces sketch for scale check
- Scale check → tileset production
- Combined Style Guide v0.2 after concept locked

---

## 8. Glow System (Engine Specs from Zephyr)

```javascript
const GLOW = {
  playerBase:    1.0,    // Full intensity (constant)
  playerDimmed:  0.6,    // In darkness (below torch radius)
  playerBoosted: 1.3,    // Near crystal proximity
  torchRadius:   2,      // units from center
  playerAura:    1,      // units from center
};
```

**Implementation:** Visual-only overlay (canvas `globalCompositeOperation: 'lighter'` or gradient). Does NOT affect collision.

---

## 9. Palette Confirmation

**Final Palette: 12-Color System (GDD Section 4.2 + Style Guide)**

| Name | Hex | Status |
|------|-----|--------|
| Background Dark | #1a1a2e | ✅ Final |
| Background Deeper | #0d0d1a | ✅ Final |
| Platform Base | #4a4a6a | ✅ Final |
| Platform Highlight | #6a6a8a | ✅ Final |
| Platform Shadow | #2a2a4a | ✅ Final |
| Player Cyan | #00d4ff | ✅ Final |
| Crystal Gold | #ffd700 | ✅ Final |
| Hazard Red | #ff4757 | ✅ Final |
| Torch Orange | #ff9f43 | ✅ Final |
| Checkpoint Green | #2ed573 | ✅ Final |
| Portal Purple | #a55eea | ✅ Final |

**@Zephyr:** Use #4a4a6a palette for environment art. My spec aligns with GDD Section 4.2. The #16213e / #0f3460 values may have been from earlier discussion — confirming final is the 12-color palette above.

---

**Document Status:** Final v0.1 for Foundation Phase
**Next:** Awaiting player concept selection (Slime / Wisp / Orb) → Kairo sketch → scale check → tileset production
