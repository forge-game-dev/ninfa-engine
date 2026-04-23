# Dungeon Runner — Style Guide v0.1

**Project:** Ninfa Engine | Dungeon Runner  
**Version:** 0.1 — Foundations Draft  
**Owner:** Kairo (Art) + Cedar (Environment Art)  
**Date:** 2026-04-23

---

## 1. Visual Language

### Core Style: Flat Design + Minimal Dungeon
- No gradients, no depth shading
- Strong silhouette readability for gameplay clarity
- Controlled 12-color palette (Cedar's spec)
- Contrast-driven lighting: cyan glow vs warm orange torch light

### Shape Language
| Element | Shape Character | Notes |
|---------|-----------------|-------|
| Player | Organic-geometric hybrid | Curved/oval silhouette, distinct from angular dungeon environment |
| Environment | Angular/architectural | Rectangles, arches, pillars |
| Crystals | Faceted/geometric | Angular shapes for contrast with organic player |
| Hazards | Sharp/triangular | Immediate threat readability |

### Visual Contrast System
- **Player (#00d4ff cyan):** Curved, small, glowing — reads as "alive" against static geometry
- **Environment (#4a4a6a platforms):** Angular, massive, stable — reads as "architectural"
- **Distinction principle:** Player silhouette must never be confused with environment tiles

---

## 2. Color System

### Primary Palette (12 Colors — Cedar's Environment Spec)
| Name | Hex | Usage |
|------|-----|-------|
| Background Dark | #1a1a2e | Base dungeon void |
| Platform Base | #4a4a6a | Standard tile surfaces |
| Platform Highlight | #6a6a8a | Tile edge highlights |
| Platform Shadow | #2a2a4a | Tile depth indication |
| Player Cyan | #00d4ff | Player core, collectible proximity |
| Crystal Gold | #ffd700 | Crystals, victory elements |
| Hazard Red | #ff4757 | Spikes, death zones |
| Torch Orange | #ff9f43 | Light sources, warm accents |
| Checkpoint Green | #2ed573 | Checkpoint activation |
| Portal Purple | #a55eea | Exit portal, special zones |
| UI Accent | #ffffff | UI text, critical info |
| UI Secondary | #8a8a9a | Secondary UI elements |

### Color Usage Rules
- **No gradients** — flat fills only
- **Layering:** Background → Platforms → Props → Player → UI
- **Light interaction:** Torch areas gain warm overlay; player aura brightens near crystals
- **Level progression:** Level 1-2 heavy on dark (#1a1a2e), Level 4-5 adds more warm accents (#ff9f43)

---

## 3. Scale Reference

### Base Units
| Element | Size | Notes |
|---------|------|-------|
| Base Tile | 16x16 px | Smallest environment unit |
| Platform Tile | 32x32 px | Standard ground/wall blocks |
| Overscale Props | 64x64 / 128x128 px | Arches, pillars — monumental feel |

### Scale Philosophy
- **Player appears small/tiny** against monumental architecture
- **Overscale props** (4x-8x base tile) create sense of scale and dungeon grandeur
- **Contrast principle:** Large static environment vs small animated player

### Collision vs Visual
- **Collision hitbox:** 0.8x1.0 units (~25.6x32px at 32px scale)
- **Visual body:** 32x32 px (fills collision box)
- **Decorative glow:** Extends 1 unit beyond collision — NON-COLLIDABLE
- **Visual height:** ~40px total with glow (for tile calibration)

---

## 4. Player Character Design

### Character Concept: Geometric Slime / Crystal Creature

**Core Identity:**
- Abstract geometric creature with organic motion
- Glowing cyan core (#00d4ff) with subtle outer aura
- Rounded/oval silhouette (~1.2:1 height:width ratio)
- Distinct from angular dungeon environment — reads as "alive"

**Design Variations (2-3 options for team review):**
1. **Geometric Slime:** Rounded blob with faceted edges, internal glow lines
2. **Crystal Wisp:** Diamond/crystal shape with trailing glow particles
3. **Orb Creature:** Perfect circle/oval with pulsing inner pattern

**Player Glow Behavior**
- **Constant glow:** Always visible, 1-unit radius, cyan (#00d4ff)
- **Darkness adaptation:** Glow dims in total darkness but never disappears
- **Crystal proximity:** Glow intensifies when near collectibles (feedback system)
- **Torch contrast:** Cyan glow clearly distinct from orange (#ff9f43) torch light

### Animation States
| State | Frames | Notes |
|-------|--------|-------|
| Idle | 2-3 | Subtle pulse/breath, glow fluctuation |
| Run | 4-6 | Squash/stretch, direction lean |
| Jump | 3-4 | Stretch on ascent, squash on descent |
| Fall | 2-3 | Elongated, trailing glow |
| Death | 3-4 | Fade/shatter, glow dissipates |
| Victory | 4-6 | Expand/brighten, particle burst |

**Frame budget:** 2-6 frames per state (Orion's scope control: simple = fast)

### Hitbox Notes
- Collision body: 25.6x32px (0.8x1.0 units)
- Visual extends to 40px height with glow
- Glow radius is decorative only — NO collision
- All frames must maintain readable silhouette

---

## 5. Environment Art Direction

(Based on Cedar's Environment Style Guide v0.1)

### Tile System
- **16x16 px:** Fine detail tiles (cracks, moss, small debris)
- **32x32 px:** Standard building blocks (walls, floors, platforms)
- **64x64 / 128x128 px:** Overscale architectural props (arches, pillars, columns)

### Parallax System
- **Far layer:** 0.2x scroll speed — distant background elements
- **Mid layer:** 0.6x scroll speed — mid-ground detail
- **Foreground:** 1.0x — player and interactive elements

### Lighting Rules
- **Torch radius:** 2 units — warm orange (#ff9f43) light pool
- **Player aura:** 1 unit — cyan (#00d4ff) constant glow
- **Light overlap:** Where torch meets player aura, colors blend naturally
- **Dark zones:** Non-lit areas remain fully dark (no ambient fill)

### Level 1 "Awakening" Structure
1. **Entry:** Dark, minimal light — player spawn point
2. **Platforms:** Basic jumps, first crystals, single torch
3. **Challenge:** Spike hazard introduction, tighter platforming
4. **Checkpoint:** Green glow (#2ed573) activation
5. **Exit Portal:** Purple energy (#a55eea) — Level 1 goal

---

## 6. Asset Naming Convention

### Player Assets
```
player_idle_1.png     (32x32)
player_idle_2.png
player_run_1.png
...
player_death_1.png
```

### Environment Assets
```
tile_16_floor_a.png   (16x16)
tile_32_wall_b.png    (32x32)
prop_arch_large.png   (128x128)
```

### UI/Interactive
```
crystal_collect.png  (16x16)
checkpoint_active.png (32x32)
portal_exit.png       (64x64)
```

---

## 7. Deliverables Checklist

| Deliverable | Owner | Status | Notes |
|-------------|-------|--------|-------|
| Character Concepts (2-3 variations) | Kairo | Pending | Sketches for team review |
| Style Guide v0.1 | Kairo + Cedar | Draft | This document — for review |
| Asset Specs (QA-relevant) | Kairo | Pending | Hitbox/resolution for Verin |
| Character Sheet (all states) | Kairo | Day 5 | Finalized animation frames |
| Level 1 Tileset | Cedar | Pending | Scale calibrated on character |
| Mood Board Level 1 | Cedar | Complete | "Awakening" atmosphere |

---

## 8. Open Questions

1. **Player variation selection:** Team to confirm which character concept (Slime / Wisp / Orb) is preferred
2. **Animation frame count:** Confirm 2-6 frames per state acceptable for scope
3. **Glow intensity levels:** Need specific value range (e.g., 0.3–1.0 alpha) for engine implementation
4. **Level 2+ color progression:** Define per-level palette weighting for progression feel

---

*Style Guide v0.1 — Draft for team review. Subject to revision based on character concept approval and GDD updates.*
