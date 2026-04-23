# Dungeon Runner — Asset Specifications for QA

**Version:** 0.1 | **Owner:** Kairo | **Date:** 2026-04-23

---

## 1. Player Character

| Property | Value | Notes |
|----------|-------|-------|
| Visual size | 32x32 px | Full sprite bounds |
| Collision body | 25.6x32 px | 0.8x1.0 units at 32px scale |
| Collision offset | Center-bottom | Aligned to feet for ground detection |
| Glow radius | 1 unit (32px) | Decorative only — NON-COLLIDABLE |
| Total visual height | ~40px | With glow effect |

**Animation Assets Required:**
| State | Frames | Resolution | File naming |
|-------|--------|------------|-------------|
| Idle | 2 | 32x32 | player_idle_*.png |
| Run | 4-6 | 32x32 | player_run_*.png |
| Jump | 3-4 | 32x32 | player_jump_*.png |
| Fall | 2-3 | 32x32 | player_fall_*.png |
| Death | 3-4 | 32x32 | player_death_*.png |
| Victory | 4-6 | 32x32 | player_victory_*.png |

---

## 2. Collectibles

### Crystal
| Property | Value |
|----------|-------|
| Visual size | 16x16 px |
| Hitbox | 12x16 px (center-aligned) |
| Animation | 4 frames (pulse/rotate) |
| Collection radius | 16px |

### Checkpoint
| Property | Value |
|----------|-------|
| Inactive visual | 32x32 px, dim green #2ed573 @ 50% alpha |
| Active visual | 32x32 px, bright green #2ed573 @ 100% + glow |
| Activation zone | 24x48 px (player must pass through) |
| Animation | Inactive pulse → Active burst on activation |

---

## 3. Hazards

### Spike Trap
| Property | Value |
|----------|-------|
| Visual size | 32x32 px (2 tiles wide) |
| Collision zone | 32x16 px (top half of visual) |
| Damage frame | First contact |
| Visual indicator | Sharp triangular shape, red #ff4757 |

---

## 4. Environment

### Tiles
| Type | Resolution | Notes |
|------|------------|-------|
| Fine detail | 16x16 px | Cracks, moss, debris |
| Standard block | 32x32 px | Walls, floors, platforms |
| Overscale prop | 64x64 / 128x128 px | Arches, pillars |

### Light Sources
| Source | Radius | Color | Notes |
|--------|--------|-------|-------|
| Torch | 2 units (64px) | #ff9f43 | Static position |
| Player aura | 1 unit (32px) | #00d4ff | Follows player, decorative only |

---

## 5. Interactive Zones

| Zone | Trigger size | Activation |
|------|--------------|------------|
| Checkpoint | 24x48 px | Player overlap |
| Exit Portal | 48x64 px | All crystals collected + player overlap |
| Crystal | 16x16 px | Player overlap |

---

## 6. Format Standards

- **File format:** PNG (lossless, alpha channel)
- **Color mode:** RGBA 8-bit
- **Naming:** {asset_type}_{variant}_{frame}.png
- **Origin:** Center or bottom-center (specify per asset type)

---

## 7. Visual/Audio Integration

**Crystal Proximity Feedback Loop:**
| Distance | Visual | Audio |
|----------|--------|-------|
| > 3 units | Base glow (1.0) | Silent |
| 2-3 units | Slight boost (1.1) | Faint hum (0-20%) |
| 1-2 units | Moderate (1.2) | Audible hum (20-40%) |
| < 1 unit | Full boost (1.3) | Prominent hum (40%) |

**Character Audio Signatures (Cadenza coordination):**
| Character | Movement | Jump | Land | Death |
|-----------|----------|------|------|-------|
| Slime | Wet squish | Pop/whoosh | Splat | Soft pop |
| Wisp | Tinkles | Chime/whoosh | Clink | Shatter |
| Orb | Hollow boops | Bouncy whoosh | Soft bounce | Fade pop |

---

## 8. QA Test Reference

**Player hitbox validation:**
1. Collision body (25.6x32px) aligns with visual center-bottom
2. Glow extends to ~40px total — decorative only
3. Jump from edge: player should land, not slip through

**Trigger zone validation:**
1. Crystal pickup: player overlap required (not proximity)
2. Checkpoint activation: first touch only
3. Exit portal: all crystals + player overlap
