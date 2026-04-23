# Dungeon Runner — Level 4 Environment Design: The Gauntlet

**Status:** v0.3 — All tiles live in repo  
**Author:** Cedar (Environment Artist)  
**Date:** 2026-04-23  
**Source:** Vesper GDD Appendix D, team feedback

---

## Level Concept: "The Gauntlet"

The most demanding platforming section. Pure traversal under pressure — no puzzles, no keys. Moving platforms, spike corridors, time-gated sequences. Skill test equivalent to a boss fight: hard but fair.

**Design intent:** Danger through density and precision. Spikes are the primary visual language of threat. Platforms carry the time pressure.

---

## Zone Breakdown

### Zone A — Spike Alley (Teaching)
- **Crystals:** 4 | **Checkpoints:** 1 (entry)
- **Threat:** Spike hazards with clear safe paths | **Platform:** Wide, forgiving spacing
- **Purpose:** Teach spike = death before time pressure

### Zone B — Platform Gauntlet
- **Crystals:** 8 | **Checkpoints:** 1 (entry only — no mid-zone checkpoint)
- **Threat:** Moving platforms (2–4 u/s), spike pits below
- **Purpose:** Reading platform patterns, committing to jumps

### Zone C — The Crucible
- **Crystals:** 4 | **Checkpoints:** None — intentional final test
- **Threat:** Tight spike corridors + fast MP + 3s timed platform
- **Exit:** Portal at end of precision sequence

**Total:** 16 crystals | **Gate:** 12 required (75%) | **Checkpoints:** 2

---

## Tileset Inventory (Complete)

### Spike Hazards — `docs/art/tilesets/level_4/hazards/` (Kairo)
- `spike_floor_00.png` — 32×16, 4 upward metallic points
- `spike_ceiling_00.png` — 32×16, mirror downward
- `spike_wall_left_00.png` — 32×32, corner spike right
- `spike_wall_right_00.png` — 32×32, corner spike left
- `corridor_top_00.png` — 32×16, ceiling variant
- `corridor_bottom_00.png` — 32×16, floor variant

### Platforms — `docs/art/tilesets/level_4/platforms/` (Cedar)
- `platform_static_00.png` — 32×32 stone base, Level 1 palette
- `platform_mp_h_00.png` — 64×16, amber chevrons → right
- `platform_mp_v_00.png` — 64×16, amber chevrons ↑ up
- `platform_timed_00.png` — 32×32, amber outline (3s stable)
- `platform_timed_warning_00.png` — 32×32, red outline (<1s remaining)
- `platform_timed_gone_00.png` — 32×32 transparent (disappeared)

### Portal — `docs/art/tilesets/level_4/portal/` (Cedar)
- `portal_exit_00.png` — 32×32, #00d4ff cyan glow radial

**Total unique tiles:** 14 (6 hazards + 6 platforms + 1 portal + 1 background layer0)

### Color Palette (no new colors — clean subset of existing)
| Element | Hex |
|---------|-----|
| Background | #1a1a2e |
| Platform Base | #4a4a6a |
| Platform Highlight | #5a5a7a |
| Spike Primary | #ff4757 |
| Spike Shadow | #cc3344 |
| MP Chevrons (normal) | #ff9f43 |
| MP Chevrons (warning) | #ff4757 |
| Timed Pulse | #ff9f43 |
| Timed Warning | #ff4757 |
| Portal Glow | #00d4ff |

---

## Audio-Visual Sync (Cadenza)

| Visual Event | Audio Trigger |
|--------------|---------------|
| Spike contact → death animation | SPIKE_DEATH |
| Moving platform warning (0.5s before reversal) | MOVING_PLATFORM_WARNING |
| Timed platform pulse (3s, 2s, 1s) | TIMED_PLATFORM_WARNING |
| Timed platform disappear | TIMED_PLATFORM_DISAPPEAR |
| Zone B checkpoint | CHECKPOINT |
| Exit portal (Level 4 clear) | LEVEL_COMPLETE |

---

## Player Death Animation — Confirmed
All 4 frames in `docs/art/sprites/` (Kairo). No additional work.

---

## Sync Points
| Role | Deliverable |
|------|-------------|
| Vesper | Appendix D crystal positions, zone gate logic |
| Zephyr | MP engine (speed, range, 0.5s warning), timed 3s timer, spike collision |
| Cadenza | MOVING_PLATFORM_WARNING, TIMED_PLATFORM_WARNING, TIMED_PLATFORM_DISAPPEAR, SPIKE_DEATH |
| Kairo | Spike tiles (✓ live) |
| Verin | Spike hitbox test, MP range validation, timed sequence stress test |

**Status:** All tiles live in repo. Level 4 environment art production complete.
