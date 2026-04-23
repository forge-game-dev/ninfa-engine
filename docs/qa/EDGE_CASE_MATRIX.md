# Edge Case Matrix — Dungeon Runner QA
**Author:** Verin | **Version:** v1.0 | **Date:** 2026-04-23
**For:** Vertical Slice Testing, Level 1 Prototype

---

## Purpose
This document maps all edge cases and boundary conditions for the Dungeon Runner physics system and gameplay mechanics. Each case defines the trigger condition, expected behavior, and QA test reference.

---

## 1. Coyote Time Edge Cases

| Case | Trigger | Expected Behavior | Test Ref |
|------|---------|------------------|----------|
| EC-001 | Walk off ledge at coyote window | Can still jump for 0.1s | SET_MVMT_201 |
| EC-002 | Walk off ledge outside coyote window | Fall, cannot jump | SET_MVMT_201 |
| EC-003 | Coyote + jump buffer simultaneously | Coyote window opens, buffer queues jump | SET_MVMT_301 |
| EC-004 | Coyote triggers mid-air jump | No double jump — single jump only | SET_MVMT_401 |
| EC-005 | Coyote resets on land | Full 0.1s restored on ground contact | SET_MVMT_202 |

---

## 2. Jump Buffer Edge Cases

| Case | Trigger | Expected Behavior | Test Ref |
|------|---------|------------------|----------|
| EC-010 | Press jump 0.15s before landing | Jump executes on land contact | SET_MVMT_301 |
| EC-011 | Press jump 0.16s before landing | Jump ignored, button press expired | SET_MVMT_301 |
| EC-012 | Press jump while airborne | No action (already jumping) | SET_MVMT_401 |
| EC-013 | Buffer + coyote overlap | Both timers active, first valid window triggers jump | SET_MVMT_301 |
| EC-014 | Multiple jump presses in buffer window | Single jump, buffer consumes one input | SET_MVMT_401 |

---

## 3. Passthrough Platform Edge Cases

| Case | Trigger | Expected Behavior | Test Ref |
|------|---------|------------------|----------|
| EC-020 | Jump up from below into passthrough | Pass through, no collision | SET_PLATF_201 |
| EC-021 | Fall onto passthrough from above | Land on top, solid collision | SET_PLATF_202 |
| EC-022 | Walk onto passthrough from side | Pass through (one-way behavior) | SET_PLATF_203 |
| EC-023 | Passthrough + coyote time | Coyote resets on successful land | SET_PLATF_204 |
| EC-024 | Passthrough + jump buffer | Buffer queues if jump pressed before land | SET_PLATF_204 |
| EC-025 | Passthrough at max fall speed | Land correctly, no clipping | SET_PLATF_205 |

---

## 4. Moving Platform Edge Cases

| Case | Trigger | Expected Behavior | Test Ref |
|------|---------|------------------|----------|
| EC-030 | Player on moving platform | Inherits platform velocity | SET_PLATF_301 |
| EC-031 | Jump off moving platform | Launch velocity = player jump + platform momentum | SET_PLATF_301 |
| EC-032 | Moving platform reverses direction | Player moves with platform, no jerking | SET_PLATF_302 |
| EC-033 | Moving platform leaves ground beneath | Player falls through gap | SET_PLATF_303 |

---

## 5. Collision Hitbox Edge Cases

| Case | Trigger | Expected Behavior | Test Ref |
|------|---------|------------------|----------|
| EC-040 | Player glow touches crystal | No collection — collision required | SET_CRYSTAL_401 |
| EC-041 | Crystal collision overlap | Collection triggers, visual glow irrelevant | SET_CRYSTAL_401 |
| EC-042 | Player corner catches platform edge | No slipping through — solid edge | SET_COLLSN_101 |
| EC-043 | Player hits ceiling | Velocity clamped, no clipping through | SET_COLLSN_102 |
| EC-044 | Diagonal wall collision | Slide along surface, no tunneling | SET_COLLSN_103 |
| EC-045 | Jump at max horizontal speed into wall | Stop at wall, no penetration | SET_COLLSN_104 |

---

## 6. Crystal Collection Edge Cases

| Case | Trigger | Expected Behavior | Test Ref |
|------|---------|------------------|----------|
| EC-050 | Touch crystal at 1 edge only | Collect if collision overlap exists | SET_CRYSTAL_101 |
| EC-051 | Pass through crystal at high speed | Collect if collision overlap, no skip | SET_CRYSTAL_301 |
| EC-052 | Crystal collection mid-jump | Collected, jump continues unaffected | SET_CRYSTAL_201 |
| EC-053 | Crystal collection + checkpoint | Both trigger independently | SET_CRYSTAL_501 |
| EC-054 | All crystals collected (non-final level) | 70% threshold unlocks next level | SET_PROG_101 |
| EC-055 | All crystals collected (Level 5) | 100% threshold unlocks next level | SET_PROG_101 |
| EC-056 | Crystal visual glow overlap but collision miss | No collection — intentional | SET_CRYSTAL_401 |

---

## 7. Respawn Edge Cases

| Case | Trigger | Expected Behavior | Test Ref |
|------|---------|------------------|----------|
| EC-060 | Death at spike (no checkpoint) | Respawn at level start | SET_SPAWN_101 |
| EC-061 | Death at spike (with checkpoint) | Respawn at checkpoint | SET_SPAWN_102 |
| EC-062 | Death while jump in buffer window | Buffer cleared on death | SET_SPAWN_103 |
| EC-063 | Death in mid-air | Respawn grounded at spawn point | SET_SPAWN_201 |
| EC-064 | Checkpoint + death at same position | Respawn at checkpoint (checkpoint takes priority) | SET_SPAWN_104 |
| EC-065 | Multiple spike deaths in sequence | Each respawn at checkpoint, no state corruption | SET_SPAWN_301 |

---

## 8. Checkpoint Edge Cases

| Case | Trigger | Expected Behavior | Test Ref |
|------|---------|------------------|----------|
| EC-070 | First touch checkpoint | Activates, glow pulse #2ed573 | SET_CHCKPT_101 |
| EC-071 | Re-touch activated checkpoint | No action, single activation | SET_CHCKPT_401 |
| EC-072 | Touch checkpoint while dying | Checkpoint saved before death resolves | SET_CHCKPT_201 |
| EC-073 | Touch checkpoint mid-jump | Activates, jump continues | SET_CHCKPT_202 |
| EC-074 | Touch inactive checkpoint while moving | Activates on contact, immediate feedback | SET_CHCKPT_203 |

---

## 9. Exit Portal Edge Cases

| Case | Trigger | Expected Behavior | Test Ref |
|------|---------|------------------|----------|
| EC-080 | Enter portal without all crystals | Portal inactive, player passes through | SET_PORTL_101 |
| EC-081 | Enter portal with all crystals | Level complete triggers | SET_PORTL_101 |
| EC-082 | Enter portal at edge | Same as center — collision-based | SET_PORTL_301 |
| EC-083 | Portal collision + crystal collection same frame | Crystal collected first, portal checks updated count | SET_PORTL_302 |

---

## 10. Platform Type Matrix

| Platform Type | Solid | Passthrough | Moving |
|---------------|-------|-------------|--------|
| Bottom collision | Y | Y (if falling) | Y |
| Top collision | Y | Y | Y |
| Side collision | Y | N | Y |
| Through from below | N | Y | N |
| Jump through from below | N | Y | N |
| Inherits player | N | N | Y |

---

## 11. Audio Trigger Edge Cases

| Case | Trigger | Expected Behavior | Test Ref |
|------|---------|------------------|----------|
| EC-090 | Coyote window opens | SFX_COYOTE plays (no double-play with jump SFX) | SET_AUDIO_201 |
| EC-091 | Coyote jump executes | SFX_PLAYER_JUMP plays (not coyote + jump) | SET_AUDIO_201 |
| EC-092 | Jump at max coyote buffer | Both timers consumed correctly | SET_AUDIO_202 |
| EC-093 | UI/pause opens during gameplay | Music ducks to 0.6 over 2s, not instant | SET_AUDIO_301 |
| EC-094 | Music crossfade | 2s fade, no audio pops | SET_AUDIO_301 |

---

## 12. Performance Edge Cases

| Case | Trigger | Expected Behavior | Test Ref |
|------|---------|------------------|----------|
| EC-100 | PC target | 60 FPS sustained | SET_PERF_101 |
| EC-101 | Mobile minimum | 30 FPS minimum | SET_PERF_102 |
| EC-102 | 100% crystal run | No frame rate drop below target | SET_PERF_201 |
| EC-103 | Fast horizontal traversal | No physics jitter at 5 u/s | SET_PERF_202 |
| EC-104 | Rapid checkpoint sequence | No audio overlap or state corruption | SET_PERF_301 |

---

## 13. Glow / Visual Boundary Edge Cases

| Case | Trigger | Expected Behavior | Test Ref |
|------|---------|------------------|----------|
| EC-110 | Player glow overlaps crystal | No collection trigger | SET_CRYSTAL_401 |
| EC-111 | Player glow near torch light | Both visible, additive blending | SET_LIGHT_101 |
| EC-112 | Multiple torch overlap | Additive light, no clipping | SET_LIGHT_102 |
| EC-113 | Player in darkness (no torch) | Player aura at dimmed 0.6 | SET_LIGHT_201 |
| EC-114 | Player near crystals (no torch) | Player aura boosted 1.3 | SET_LIGHT_201 |
| EC-115 | Crystal proximity audio | >3u silent, 2-3u faint hum, 1-2u audible hum, <1u prominent | SET_AUDIO_101 |

---

## 14. HUD Edge Cases

| Case | Trigger | Expected Behavior | Test Ref |
|------|---------|------------------|----------|
| EC-120 | HUD crystal count update | Counter increments, no flicker | SET_UI_101 |
| EC-121 | Pause during gameplay | Pause overlay blocks input | SET_UI_201 |
| EC-122 | Pause + crystal collected | Crystal not collected until unpause | SET_UI_201 |
| EC-123 | Crystal at screen edge | No HUD occlusion | SET_UI_301 |

---

## Summary

| Category | Case Count |
|----------|-----------|
| Coyote Time | 5 |
| Jump Buffer | 5 |
| Passthrough Platforms | 6 |
| Moving Platforms | 4 |
| Collision Hitbox | 6 |
| Crystal Collection | 7 |
| Respawn | 6 |
| Checkpoint | 5 |
| Exit Portal | 4 |
| Platform Type Matrix | 6 |
| Audio Triggers | 5 |
| Performance | 5 |
| Glow/Visual Boundary | 6 |
| HUD | 4 |
| **Total** | **80** |
