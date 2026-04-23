# Dungeon Runner — Orb Creature Character Sheet v0.1
**Owner:** Kairo | **Date:** 2026-04-23 | **Status:** IN PROGRESS

---

## 1. Character Overview

| Property | Value |
|----------|-------|
| Name | Orb Creature |
| Type | Geometrical creature / Glowing orb |
| Sprite size | 32x32 px |
| Total visual (with glow) | ~40px |
| Collision body | 25.6x32 px (0.8x1.0 units) |
| Glow radius | 1 unit (32px) — decorative only |
| Primary color | #00d4ff (cyan) |
| Animation states | 6 (Idle, Run, Jump, Fall, Death, Victory) |

---

## 2. Visual Structure

### Core Composition
```
Layer 1 (bottom): Outer glow halo — #00d4ff @ 10-20% alpha, extends 1 unit
Layer 2 (middle): Aura ring — #00d4ff @ 30-60% alpha, pulsing
Layer 3 (top): Core body — #00d4ff @ 80-100% alpha, solid inner circle
Layer 4 (center): Inner pattern — pulsing concentric rings, decorative
```

### Color Breakdown
| Zone | Hex | Alpha | Description |
|------|-----|-------|-------------|
| Core center | #00d4ff | 100% | Solid, brightest |
| Core edge | #00d4ff | 80% | Soft transition inward |
| Outer aura | #00d4ff | 30-60% | Pulsing with animation state |
| Decorative glow | #00d4ff | 10-20% | Extends 8px beyond bounds |

### Proportion Reference
```
Total bounds: 32x32 px
Core circle: ~22px diameter, centered
Aura: extends to full 32x32
Glow: +8px beyond bounds (1 unit @ 32px scale)
```

---

## 3. Animation States

### IDLE (2 frames)
**Purpose:** Rest state, breathing animation

| Frame | Scale | Glow | Inner Pattern | Duration |
|-------|-------|------|---------------|----------|
| idle_1.png | 1.0x | base 1.0 | Rest position | 0.5s |
| idle_2.png | 1.02x | base 1.05 | Pulse peak | 0.5s |

**Squash/stretch:** None (subtle scale only)
**Loop:** Yes, seamless
**Audio sync:** "Soft boop" every 2s (Cadenza)

---

### RUN (4 frames)
**Purpose:** Ground movement with squash/stretch cycle

| Frame | Scale | Glow | Notes | Duration |
|-------|-------|------|-------|----------|
| run_1.png | 1.1w × 0.9h | 1.1 | Contact — squash wide | 0.1s |
| run_2.png | 1.0x | 1.0 | Mid-stride — neutral | 0.1s |
| run_3.png | 0.9w × 1.1h | 1.15 | Launch — stretch tall | 0.1s |
| run_4.png | 1.0x | 1.0 | Airborne — neutral | 0.1s |

**Squash/stretch:** Max 0.9x — Vesper confirmed limit
**Direction:** All frames show slight lean (2-3°) in movement direction
**Audio sync:** "Hollow boop" rhythm every 0.2s (Cadenza)

---

### JUMP (4 frames)
**Purpose:** Vertical launch with anticipation and apex

| Frame | Scale | Glow | Notes | Duration |
|-------|-------|------|-------|----------|
| jump_1.png | 1.15w × 0.85h | 0.9 | Anticipation — squash before launch | 0.08s |
| jump_2.png | 0.85w × 1.2h | 1.2 | Launch — maximum stretch | 0.08s |
| jump_3.png | 0.95w × 1.1h | 1.1 | Rising — transitioning | 0.15s |
| jump_4.png | 1.0x | 1.0 | Apex — preparing for descent | 0.15s |

**Squash/stretch:** Max 0.85x (stretch), 1.15x (squash) — within Vesper limit
**Audio sync:** "Bouncy whoosh" on jump_2 (Cadenza)

---

### FALL (3 frames)
**Purpose:** Descent with elongated form and glow trail

| Frame | Scale | Glow | Notes | Duration |
|-------|-------|------|-------|----------|
| fall_1.png | 0.9w × 1.15h | 0.8 | Descending — elongated | 0.15s |
| fall_2.png | 0.9w × 1.15h | 0.7 | Trailing — glow dimmed | 0.15s |
| fall_3.png | 1.05w × 0.95h | 0.85 | Near ground — preparing land | 0.15s |

**Squash/stretch:** Subtle — elongated is primary shape
**Trail effect:** Glow extends slightly below in fall_2
**Audio sync:** "Soft whoosh" continuous (Cadenza)

---

### DEATH (4 frames)
**Purpose:** Player hit hazard, fade/dissolve sequence

| Frame | Scale | Glow | Alpha | Notes | Duration |
|-------|-------|------|-------|-------|----------|
| death_1.png | 1.2x | 1.3 | 100% | Flash — pulse outward | 0.1s |
| death_2.png | 1.1x | 1.1 | 80% | Fragment suggestion | 0.15s |
| death_3.png | 1.0x | 0.5 | 40% | Core fading | 0.2s |
| death_4.png | 1.0x | 0.0 | 0% | Empty — transparent | 0.3s |

**Visual effect:** Core fragments scatter (decorative), glow dissipates
**Audio sync:** "Fade pop" (0.8s total) — gentle, non-aggressive (Cadenza)
**Total duration:** ~0.75s

---

### VICTORY (6 frames)
**Purpose:** Level complete celebration

| Frame | Scale | Glow | Notes | Duration |
|-------|-------|------|-------|----------|
| victory_1.png | 1.0x | 1.0 | Trigger moment | 0.1s |
| victory_2.png | 1.2x | 1.2 | Expand | 0.1s |
| victory_3.png | 1.25x | 1.3 | Maximum — brightest | 0.15s |
| victory_4.png | 1.15x | 1.2 | Burst suggestion | 0.15s |
| victory_5.png | 1.05x | 1.1 | Settling | 0.2s |
| victory_6.png | 1.0x | 1.0 | Return to rest | 0.3s |

**Visual effect:** Particle burst on victory_3 (decorative)
**Audio sync:** "Rising chime" on victory_2-3 (Cadenza)
**Total duration:** ~1.0s

---

## 4. Glow Behavior Reference

| State | Base | Dimmed | Boosted |
|-------|------|--------|---------|
| Idle | 1.0 | — | 1.05 (pulse peak) |
| Run | 1.0 | — | 1.15 (stretch) |
| Jump | 1.0 | 0.9 (anticipation) | 1.2 (launch) |
| Fall | 1.0 | 0.7 (dimmed) | — |
| Death | 1.0 | 0.0 (dissipate) | 1.3 (flash) |
| Victory | 1.0 | — | 1.3 (maximum) |

**Crystal proximity boost:** +0.1 per unit distance < 3 (cumulative with state glow)
**Darkness adaptation:** Glow dims to 0.6 in total darkness, never disappears

---

## 5. File Naming Convention

```
player_idle_1.png   (32x32, frame 1)
player_idle_2.png   (32x32, frame 2)
player_run_1.png
player_run_2.png
player_run_3.png
player_run_4.png
player_jump_1.png
player_jump_2.png
player_jump_3.png
player_jump_4.png
player_fall_1.png
player_fall_2.png
player_fall_3.png
player_death_1.png
player_death_2.png
player_death_3.png
player_death_4.png
player_victory_1.png
player_victory_2.png
player_victory_3.png
player_victory_4.png
player_victory_5.png
player_victory_6.png
```

**Total frames:** 23 PNG files (32x32 each)
**Format:** RGBA PNG, lossless

---

## 6. QA Validation Points

| Check | Criteria | Pass condition |
|-------|----------|----------------|
| Collision alignment | Body centered, aligned to feet | 25.6x32px matches visual core |
| Glow non-collidable | Visual extends beyond hitbox | ~40px visual ≠ 32px collision |
| Squash limits | Never exceeds 0.8x or 1.2x | Vesper spec compliance |
| Silhouette readability | Round shape distinct from angular tiles | Cyan orb vs #4a4a6a platforms |
| Animation loop | Idle returns to start frame | Seamless 2-frame loop |
| Glow state transitions | No abrupt changes | Smooth interpolation |

---

## 7. Integration Notes

**For Zephyr (engine):**
- Animation frames indexed 0-based (idle[0], idle[1], run[0-3], etc.)
- Glow calculated separately from collision
- Squash/stretch applied to render only, not physics

**For Cadenza (audio):**
- Frame timing documented above for SFX sync
- Death: 0.75s total, fade pop
- Victory: 1.0s total, rising chime
- Run cycle: 0.4s per full cycle (4 frames × 0.1s)

**For Verin (QA):**
- Hitbox: 25.6x32px — test edge cases
- Visual vs collision: glow is decorative, no trigger zone
- Animation playback: verify frame timing matches spec

---

*Character Sheet v0.1 — Target completion Day 5 (2026-04-25)*
