# Dungeon Runner — Character-Environment Coordination v0.1

**Status:** Draft v0.1 | **Author:** Cedar | **Date:** 2026-04-22
**Based on:** GDD v1.0 + Kairo character direction (2026-04-22, ~23:46)
**Sync:** Kairo (character) ↔ Cedar (environment)
**Purpose:** Bridge document — ensures character and environment speak the same visual language

---

## 1. Character Design Direction (Kairo, Confirmed)

### 1.1 Silhouette
- **Shape:** Organic-geometric hybrid — rounded/oval base, não angular como cenário
- **Proportion:** ~1.2:1 (slightly taller than wide) for readability
- **Visual language:** Curved/organic vs angular environment → maximum silhouette contrast
- **Concept:** "geometric slime" ou "crystal creature" com glow

### 1.2 Glow Behavior
- **Constant glow:** Always visible, 1-unit radius — player never disappears
- **Dims em escuridão total:** Does NOT disappear, reduces intensity in total darkness
- **Intensifies near crystals:** Proximity feedback — cyan glow brighter when near collectible
- **Pulse (idle):** Subtle breathing animation when stationary
- **Color:** Cyan `#00d4ff` — distinct from warm orange `#ff9f43` torches

### 1.3 Scale Reference
| Property | Value | Notes |
|----------|-------|-------|
| Bounding box | 32x32 px | GDD confirmed |
| Visual height (w/ glow) | ~40 px | Glow extends beyond hitbox |
| Proportion | 1.2:1 (taller: wider) | Slightly oval |
| Glow radius | 1 unit | Constant |
| Collision hitbox | 0.8 × 1.0 units | GDD Section 2.3 — rectangular |

### 1.4 Visual vs Collision Separation (Critical for QA)
```
[Glow outline: 40px visual]  ← artistic, non-interactive
       ↓
[Player sprite: 32x32 px]    ← visual bounds
       ↓
[Collision hitbox: 0.8×1.0 units]  ← triggers platform/hazard interaction
```
**Art implication:** Glow/outline extends beyond collision hitbox. QA must verify glow doesn't create false collision triggers.

---

## 2. Environment-Character Visual Contrast

### 2.1 Silhouette Contrast Rule

| Element | Shape Language | Geometry |
|---------|---------------|----------|
| **Environment** | Angular/rectangular | Sharp corners, straight edges, geometric blocks |
| **Player** | Curved/organic | Rounded oval, no sharp corners, flowing glow |

**Confirmed:** Environment is angular; character is curved/organic-geometric hybrid.
This is intentional contrast — player reads as "alive/different" against static dungeon.

### 2.2 Scale Contrast

| Element | Size | Ratio to Player |
|---------|------|-----------------|
| Player | 32x32 px | 1× (baseline) |
| Base tile | 16x16 px | 0.5× (half player size) |
| Platform tile | 32x32 px | 1× (equal to player height) |
| Wall block | 32x32 px | 1× |
| Standard prop | 32x32 px | 1× |
| Large prop | 64x64 px | 2× (player can hide behind) |
| Overscale prop | 128x128 px | 4× (player looks tiny) |

**Overscale philosophy confirmed:** Player is visually tiny relative to environment. Creates "small hero in vast dungeon" feeling.

### 2.3 Color Contrast Map

| Element | Primary Color | Contrast Against |
|---------|-------------|-----------------|
| Player glow | `#00d4ff` cyan | Reads bright against `--bg-dark` `#1a1a2e` and `--accent-orange` `#ff9f43` |
| Player sprite | `#00d4ff` cyan | Contrasts with `--stone-warm` `#4a4a6a` environment |
| Torch light | `#ff9f43` orange | Warm vs cool — player's cyan is visually opposite |
| Crystals | `#ffd700` gold | Reward color, highest visual priority after player |
| Platforms | `#4a4a6a` warm stone | Neutral — doesn't compete with cyan/gold/orange |

**Intentional:** Cyan player glow + orange torch glow = cool/warm contrast. Player always visually distinct from environment regardless of position.

---

## 3. Lighting System — Character Impact

### 3.1 Player as Light Source
- **Own aura:** 1-unit radius, cyan `#00d4ff`
- **Effect on nearby tiles:** Stone shifts from `--stone-warm` toward `--stone-light` within glow radius
- **No gameplay effect from this light** — purely visual/atmosphere

### 3.2 Character Near Crystals (Interaction)
```
Default state:        Near crystal:
Player glow 100%  →  Player glow 130-150%
+ nearby stone lit by crystal's gold aura (radius 0.75 units)
```
**Art behavior:** When player enters crystal proximity:
- Crystal gold glow (0.75 units) activates
- Player cyan glow intensifies slightly (feedback signal)
- Both glows overlap → creates reward/magic feeling

### 3.3 Character Near Torches (Environment Lighting)
```
Dark area:
Stone: --bg-dark (#1a1a2e)
No warm spill

Near torch:
Stone: --stone-warm (#4a4a6a) to --stone-light (#6a6a8a)
Warm spill: --accent-orange at 30-50% opacity
Player: Cyan glow still visible against warm stone
```
**Key contrast maintained:** Player's cyan glow reads clearly even on torch-lit stone. Warm and cool coexist without blending.

### 3.4 Character in Deep Darkness
- Stone: `--bg-dark` to `--bg-void`
- **Player still visible** (constant glow, dims to 60-70% intensity)
- Creates "beacon in darkness" feeling
- Atmosphere: player is small light in vast darkness

---

## 4. Tileset Scale Calibration (From Character Data)

### 4.1 Floor Tile Size Decision
- Base tile: 16x16 px
- Player height: 32 px (visual), ~1.0 unit (collision)
- **Floor tile = 0.5× player height** — reads as "ground texture," not "obstacle"
- Correct for overscale environment feel

### 4.2 Platform Tile Size Decision
- Platform tile: 32x32 px
- **Platform = 1× player height** — player fits exactly 1 tile tall
- Correct for clear platforming readability

### 4.3 Ceiling Height Reference
- GDD Section 2.3: Player hitbox 0.8 × 1.0 units
- Suggested ceiling for Level 1: 3× player height (96px)
- **Player ceiling clearance:** ~64px above player's head (comfortable, not cramped)
- This matches "vast dungeon" overscale philosophy

### 4.4 Prop Scale Calibration

| Prop | Size | Player Comparison |
|------|------|-----------------|
| Torch (wall-mounted) | 16x16 | 0.5× player width, same height |
| Chain | 16 wide × 32+ | Player-width, variable |
| Stone block | 32x32 | 1× player (stacked = overscale) |
| Crate | 32x32 | 1× player (pushed or climbed) |
| Pillar | 64x64 | 2× player (player navigates around base) |
| Giant arch | 128x128 | 4× player (player passes through opening) |

**Critical for tile placement:** Props at 32x32 = same size as player. Player should never look larger than props — environment props should dwarf the player visually.

---

## 5. Character Animation Impact on Environment

### 5.1 States Affecting Visual Environment

| Animation State | Visual Change | Environment Impact |
|----------------|--------------|-------------------|
| Idle | Subtle cyan pulse | Glow radius fluctuates ±10% |
| Running | Glow trail (brief, 0.1s) | Adds to platform light spill |
| Jumping | Glow brightens | Player more visible mid-air |
| Falling | Glow dims slightly | Player less visible → tension |
| Collecting | Cyan flash | Crystal gold glows brighter momentarily |
| Death | Cyan fades out | Scene loses player light source |
| Checkpoint | Green + cyan overlap | Checkpoint green + player cyan blend |

### 5.2 Animation Requirements (For Tileset Positioning)

| State | Duration | Pixel Movement | Environment Note |
|-------|----------|--------------|-----------------|
| Idle loop | Continuous | 0 | Glow pulse cycle |
| Run cycle | 4-8 frames | 5 units/s | Trail effect on nearby tiles |
| Jump arc | ~0.5s | Full jump height | Peak glow brightens |
| Land | 1-2 frames | 0 | Brief light flash on platform |
| Death | 0.5s | Fade out | Torch glow becomes primary |

### 5.3 Tile Spacing for Animations
- **Jump landing flash:** Platform tile directly below must accommodate brief light bloom
- **Glow trail on run:** 2-3 tiles behind player illuminated briefly
- **Checkpoint overlap:** Green flag + player = combined glow zone

---

## 6. Asset Specs for QA (Verin Reference)

### 6.1 Player Asset Specs
| Spec | Value | Source |
|------|-------|--------|
| Sprite size | 32x32 px | GDD Section 4.4 |
| Visual size w/ glow | ~40 px | Kairo direction |
| Collision hitbox | 0.8 × 1.0 units | GDD Section 2.3 |
| Glow color | `#00d4ff` cyan | GDD Section 4.2 |
| Glow radius | 1 unit (visual), 1 unit (light source) | GDD Section 4.3 |
| Animation states | Idle, Run, Jump, Fall, Death, Victory | GDD Section 4.4 |

### 6.2 Hitbox vs Visual Alignment (QA Test Priority)
- **Visual glow extends beyond collision hitbox** — this is intentional for readability
- **QA must verify:** Glow doesn't trigger false interactions (collectibles, hazards)
- **Test case:** Player glow overlapping crystal — is crystal collected when glow touches it, or only when collision hitbox touches?
  - Expected: Only collision hitbox triggers collection

### 6.3 Glow Behavior Test Cases
- [ ] Glow is constant in lit areas (never fully disappears when near light)
- [ ] Glow dims to ~60-70% in total darkness (still visible, reduced)
- [ ] Glow intensifies when player enters crystal proximity
- [ ] Glow pulse (idle) is subtle — doesn't distract from gameplay
- [ ] Death animation: cyan fades smoothly (no hard cutoff)

### 6.4 Silhouette Contrast (Visual QA)
- [ ] Player reads clearly on `--bg-dark` background (no blend)
- [ ] Player reads clearly on `--stone-warm` platform (cyan vs warm gray)
- [ ] Player reads clearly near torch glow (cyan vs orange — distinct)
- [ ] Player silhouette (curved/oval) visually distinct from angular environment

---

## 7. Coordination Timeline

| Milestone | Owner | Status |
|----------|-------|--------|
| Character direction (silhouette, glow) | Kairo | ✅ Confirmed |
| Character rough sketch | Kairo | ⏳ In progress |
| Scale calibration (confirmed) | Cedar | ✅ Done |
| Environment Style Guide v0.1 | Cedar | ✅ Done |
| Color Palette Sheet v0.1 | Cedar | ✅ Done |
| Level 1 Mood Board v0.1 | Cedar | ✅ Done |
| **Character sketch for scale check** | Kairo | ⏳ Pending — unblocks Level 1 tileset |
| Character-Environment Coordination v0.1 | Cedar | ✅ This doc |
| Character Spec Sheet (for QA) | Cedar | ⏳ Next |
| Level 1 Tileset Draft (floor, wall, platform) | Cedar | ⏳ Waiting for sketch |
| Character asset specs (animation frames) | Kairo | ⏳ Pending |
| Repo upload (style guide, coordination doc) | Pending | ⏳ Awaiting repo |

---

## 8. Open Questions (Decision Needed)

| Question | Default Assumption | Needs Decision From |
|----------|-------------------|---------------------|
| Glow dims in total darkness — to what %? | 60-70% of full intensity | Kairo confirm |
| Idle pulse — period and amplitude? | 1-2s cycle, ±10% intensity | Kairo confirm |
| Victory animation — glow behavior? | Bright flash, particle burst? | Kairo + Orion decide |
| Character has secondary color/detail? | Pure cyan only (GDD says vibrant cyan) | Kairo confirm |
| Death animation — does character respawn glowing? | Yes, instant full glow on respawn | QA test case |

---

## 9. Shared Visual Language Summary

```
ENVIRONMENT                          CHARACTER
──────────────────────────────────────────────────────────────
Angular/Rectangular geometry         Curved/Organic geometry
--stone-warm, --stone-light          --accent-cyan #00d4ff
Static, stone-cold tones             Glowing, dynamic light
Warm light from torches              Cool light from player
Darkness as aesthetic baseline       Light as visual focal point
Scale: Monumental (64-128px)         Scale: Tiny (32x32px)

Together: Warm-cool contrast, tiny-large contrast, still-moving contrast
All three contrast pairs → player reads instantly in any environment state
```

---

**Change Log**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-04-22 | Cedar | Initial — incorporating Kairo character direction (23:46) |

*Pending: Kairo's first character sketch for final scale verification before tileset production begins.*
