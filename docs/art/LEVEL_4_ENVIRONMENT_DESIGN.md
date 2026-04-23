# Dungeon Runner — Level 4 Environment Design: The Gauntlet

**Status:** Draft v0.1  
**Author:** Cedar (Environment Artist)  
**Date:** 2026-04-23  
**Source:** Vesper GDD Appendix D (Level 4 brief from Geral group, 13:02 UTC)

---

## Level Concept: "The Gauntlet"

The most demanding platforming section. Pure traversal under pressure — no puzzles, no keys. Moving platforms, spike corridors, time-gated sequences. This is the skill test equivalent to a boss fight: hard but fair.

**Design intent:** Danger through density and precision. Every tile communicates: this space is earned. Spikes are the primary visual language of threat. Platforms carry the time pressure.

---

## Zone Breakdown

### Zone A — Spike Alley (Teaching)
- **Crystals:** 4
- **Threat type:** Spike hazards with clear safe paths
- **Platform:** Wide platforms, forgiving spacing
- **Purpose:** Teach the player that spikes hurt before introducing time pressure
- **Mood:** Focused but not overwhelming — learning environment

### Zone B — Platform Gauntlet
- **Crystals:** 8
- **Threat type:** Moving platforms (2–4 u/s), spike pits below
- **Checkpoint:** Entry only — no checkpoint mid-zone (endurance section)
- **Purpose:** Reading platform patterns and committing to jumps
- **Mood:** Sustained tension — long section, no break

### Zone C — The Crucible
- **Crystals:** 4
- **Threat type:** Tight spike corridors + fast moving platforms + timed sequence (platform disappears after 3s)
- **Checkpoint:** None — intentional final test
- **Exit:** Portal at end of precision challenge sequence
- **Mood:** Climactic intensity — no safety net

**Total:** 16 crystals, 12 required for gate (75%)  
**Checkpoints:** 2 (Zone A entry, Zone B entry)  
**Gate rationale:** 75% is harder than Level 3's 70% — no key-collection fallback, pure skill gate

---

## New Environment Elements

### Spike Hazards
- **Appearance:** Sharp metallic points, `#ff4757` primary, `#cc3344` shadow
- **Variants:**
  - Floor spikes (upward)
  - Ceiling spikes (downward)
  - Wall spikes (side-facing at corners)
  - Corridor spikes (floor + ceiling paired — player passes through middle)
- **Size:** 32×16px per spike tile, 32×32 hitbox
- **Animation:** None — static threat, instant readability
- **Visual density:** Higher than any previous level — corridors, floors, ceilings

### Moving Platforms
- **Horizontal (MP-H):** 2–4 u/s, various ranges (3–6 units)
- **Vertical (MP-V):** 2–3 u/s, various ranges (2–4 units)
- **Appearance:** Stone per Level 1 palette + amber chevron indicators (#ff9f43)
- **Size:** 64×16px (2×0.5 tiles) — consistent across all
- **Direction indicator:** Chevron pattern points movement direction
- **Warning state:** Chevrons shift to `#ff4757` 1s before reversal/disappearance

### Timed Platforms (Zone C)
- **Behavior:** Disappears after 3s of standing
- **Visual:** Stone + pulsing amber outline (synced to 3s timer)
- **Pulse timing:** 0.5s pulse at 3s, 2s, 1s remaining — visual urgency builds
- **Disappear animation:** 2 frames @ 200ms — platform dissolves, spikes exposed below

### Spike Corridors
- **Structure:** Floor + ceiling spike tiles with 1-tile clearance for player
- **Visual:** Tight, claustrophobic, clear safe path (no ambiguity)
- **Purpose:** Require the player to commit to the exact center path

---

## Tileset Structure

```
docs/art/tilesets/level_4/
├── platforms/
│   ├── platform_static_00.png (stone, standard)
│   ├── platform_mp_h_00.png (horizontal moving, chevron right)
│   ├── platform_mp_v_00.png (vertical moving, chevron up)
│   ├── platform_timed_00.png (3s timed, pulsing outline)
│   ├── platform_timed_warning_00.png (1s warning pulse)
│   └── platform_timed_gone_00.png (empty/disappeared)
├── hazards/
│   ├── spike_floor_00.png (upward points)
│   ├── spike_ceiling_00.png (downward points)
│   ├── spike_wall_left_00.png
│   ├── spike_wall_right_00.png
│   ├── corridor_top_00.png (ceiling spikes, 1-tile clearance)
│   └── corridor_bottom_00.png (floor spikes, 1-tile clearance)
├── backgrounds/
│   ├── layer0_spike_pits.png (far — depth indicator, spike pit below)
│   ├── layer1_gauntlet_arch.png (mid — industrial arches)
│   └── layer2_debris.png (near — floating debris, chains)
└── parallax/
    ├── layer0_industrial_far.png
    ├── layer1_industrial_mid.png
    └── layer2_chains_near.png
```

**Tileset count:** 12–14 unique tiles (moving platforms × speeds, spike variants × directions, timed variants)

---

## Color Palette

| Element | Hex | Zone |
|---------|-----|------|
| Background | `#1a1a2e` | All |
| Platform Base | `#4a4a6a` | All |
| Platform Highlight | `#5a5a7a` | All |
| Spike Primary | `#ff4757` | All |
| Spike Shadow | `#cc3344` | All |
| Moving Platform Chevrons | `#ff9f43` | B/C |
| Moving Platform Warning | `#ff4757` | B/C |
| Timed Platform Pulse | `#ff9f43` | C |
| Timed Platform Warning | `#ff4757` | C |
| Portal Glow | `#00d4ff` | C |
| **Total** | **11 colors** | |

**Note:** No new colors needed — Level 4 palette is a subset of existing palette (spike red + amber warning are in Level 2). Cleaner than Level 3's palette additions.

---

## Animation Timing

| Element | Frames | Duration | Behavior |
|---------|--------|----------|----------|
| Platform move | Continuous | Per speed (2–4 u/s) | Loops |
| Timed platform pulse | 4 | 750ms/f (3s total) | Sync to timer, urgent at <1s |
| Timed platform dissolve | 2 | 200ms/f | Plays once |
| Spike corridor | — | Static | No animation |
| Exit portal | 4 | 500ms/f | Loop — beckoning glow |

---

## Audio-Visual Coordination (Cadenza)

| Visual Event | Audio Trigger |
|--------------|---------------|
| Spike death | `SPIKE_DEATH` (existing) |
| Moving platform warning (reversal) | `MOVING_PLATFORM_WARNING` |
| Timed platform warning | `TIMED_PLATFORM_WARNING` |
| Timed platform disappear | `TIMED_PLATFORM_WARNING` (final pulse) |
| Zone B entry checkpoint | `CHECKPOINT` |
| Exit portal (Level 4 clear) | `LEVEL_COMPLETE` (existing) |

---

## Background Design

**Zone A (Spike Alley):** Open but focused — spike clusters against dark BG, clear paths marked by negative space. Warm torch lighting for teaching safety.

**Zone B (Platform Gauntlet):** Industrial framing — arched stone supports, chain details, spike pits visible below platforms. Cool blue-grey tones. Platforms float against dark void below.

**Zone C (The Crucible):** Maximum intensity — minimal background, platforms suspended in dark, spike corridors prominent. Timed platform pulse is the dominant visual rhythm.

**Parallax layers (3 per level):**
- Layer 0 (far): Industrial depth — stone pillars, spike pit indicator
- Layer 1 (mid): Arched supports, mechanical details
- Layer 2 (near): Floating debris, hanging chains, atmospheric

---

## Difficulty Design Notes

- **No ambiguity:** Every spike hazard has a clear safe path. Players die because of timing mistakes, not reading errors.
- **Visual hierarchy:** Platforms are stone + amber (warm), spikes are red (danger), background is cool (neutral). Player's eye goes to warm/amber = safe path.
- **Checkpoint placement:** Zone A teaches, Zone B tests endurance, Zone C demands — no safety net in Zone C by design.
- **Gate difficulty:** 75% (12/16) is higher than Level 3's 70% because there's no key-collect fallback. Pure skill gate.

---

## Sync Points

| Role | Coordination |
|------|-------------|
| Vesper | Appendix D crystal positions, zone flow, gate logic |
| Zephyr | Moving platform engine (speed, range, direction), timed platform timer |
| Cadenza | MOVING_PLATFORM_WARNING (1s before reversal), TIMED_PLATFORM_WARNING (3s countdown), SPIKE_DEATH |
| Kairo | Player death animation (spike contact) — visual feedback for death state |
| Verin | Spike collision hitbox test, moving platform range validation, timed sequence stress test |

---

**Next:** Pull Appendix D from GDD for crystal positions. PNG production blocked on Nicolas resolving sprite tools.
