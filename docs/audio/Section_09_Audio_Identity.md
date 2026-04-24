# Section 9 — Audio Identity Document
## Dungeon Runner — Complete Audio Specification
**Author:** Cadenza (Audio Designer)  
**Date:** 2026-04-24  
**Version:** 1.0  
**Status:** PRODUCTION  

---

## 9.0 Overview

This document is the complete Audio Identity reference for Dungeon Runner. It documents every audio trigger, system, pipeline, and implementation detail — serving as the authoritative source for engineering integration, QA testing, and cross-discipline coordination.

**Companion:** `Section 5 — Audio Direction` (`docs/audio/Section_05_Audio_Identity.md`) defines the high-level creative direction. This Section 9 is the technical implementation reference.

---

## 9.1 Audio Production Scope

**Total assets:** ~40–50 audio elements across all 5 levels.

| Category | Count | Notes |
|---|---|---|
| Music tracks | 6 | 1 per level |
| Player SFX | 6 | Jump, Land, Death, Coyote Time, Drown, Spike Death |
| Collectible SFX | 5 | Crystal (universal), 3 key colors, Vault activate |
| Environment SFX | 10 | Door locked/unlock, timed door warning, crystal switch, pressure plate, moving platform × 2, timed platform disappear, checkpoint, exit portal, torch |
| UI SFX | 4 | Menu, level complete, victory sting, death chime |
| Ambient variations | 10+ | Per-zone atmospheric layers |
| **Total** | **~45** | |

---

## 9.2 Audio Engine Architecture

**File:** `audio_engine.js` (production, synced to `ninfa-engine` repo)  
**Trigger system:** Single `trigger(event)` function routing to named handlers  
**Audio context:** Lazy initialization on first user interaction  
**Format:** Web Audio API synthesized — no external asset files required

### 9.2.1 Trigger API

```
AudioEngine.trigger(event)          // One-shot SFX dispatch
AudioEngine.triggerSpatialWarning(platformX, playerX, panValue)  // Stereo-panned platform warnings
AudioEngine.startAmbient(type)       // Begin looping ambient layer
AudioEngine.stopAmbient(type)        // Stop ambient layer
AudioEngine.setProximityTarget(player, crystals)  // Configure crystal proximity tracking
AudioEngine.updateProximity()        // Per-frame update — call in game loop
```

### 9.2.2 Proximity Audio System (Crystal Resonance)

**Purpose:** Subconscious spatial guidance — player perceives crystal location through subtle harmonic pulsing without conscious awareness.

**Implementation:** Dual-oscillator beat frequency
- Oscillator 1: 660 Hz (sine)
- Oscillator 2: 663.3 Hz (sine)
- Beat frequency: ~3.3 Hz (creates gentle pulsing/throbbing)
- Filter: Bandpass centered at 660 Hz, Q=2
- Maximum range: 2 units (distance-based volume attenuation)

**Volume curve:**
- 0.5 units → 0.35 gain (maximum proximity)
- 1 unit → 0.20 gain
- 2 units → 0.00 gain (threshold)

**Sync with visuals:** Crystal visual glow pulses at matching 3.3 Hz frequency. Audio-visual pairing creates subliminal resonance effect. Thresholds aligned with Cedar's visual glow system (base glow + proximity-reactive pulse).

---

## 9.3 Complete Trigger Inventory

### Level 1 — "Awakening"

| Trigger ID | Handler Function | Description |
|---|---|---|
| `JUMP` | `_playJump()` | Ascending sine sweep, 0.2s, soft landing pad |
| `LAND` | `_playLand()` | Low-frequency thud, 0.1s, grounded |
| `CRYSTAL_COLLECT` | `_playCrystal()` | Bright chime, harmonic shimmer, 0.3s |
| `EXIT_PORTAL` | `_playExit()` | Ethereal tone with rising sweep, 0.8s |
| `LEVEL_COMPLETE` | `_playComplete()` | Triumphant fanfare, harmonic resolution, 1.2s |
| `PLAYER_DEATH` | `_playDeath()` | Descending tone, resonant decay, 0.8s |
| `CHECKPOINT` | `_playCheckpoint()` | Warm activation tone, 0.4s |
| Proximity | `_playProximity()` | Crystal resonance (continuous, not one-shot) |
| `ZONE_C_AMBIENT` | `_playZoneCAmbient()` | Warm rising layer, cold stone → golden transition |

### Level 2 — "The Descent"

| Trigger ID | Handler Function | Description |
|---|---|---|
| `DROWN` | `_playDrown()` | 6-layer liquid: panic sine 900→220Hz, harmonic, bandpass rush, lowpass rumble, slow bubble oscillation, fade |
| `CHECKPOINT` | `_playCheckpoint()` | Reused from L1 |
| `EXIT_PORTAL` | `_playExit()` | Reused from L1 |

**DROWN vs SPIKE_DEATH distinction:** Drown uses fluid dynamics (sine sweep + noise layers) with longer duration (~2.5s) and rising bubble texture. Spike death uses high-frequency scrape with distortion, fast duration (~0.2s), and sharp attack. Visual separation: drowning triggers bubble particle effect.

**Water ambient:** Shimmer cycle 2 FPS (500ms/frame), 2-frame toggle pattern — `waterAnimFrame` (0/1) + `waterAnimTimer`. Audio shimmer synced to visual shimmer via shared 500ms interval in game loop.

**Moving platform audio:** Per-platform stereo pan — `triggerSpatialWarning(platformX, playerX, pan)` where `pan = clamp((platform.x - player.x) / (canvas.width/2), -1, 1)`. Two variants:

| Trigger ID | Handler Function | Timing | Character |
|---|---|---|---|
| `MOVING_PLATFORM_WARNING` | `_playMovingPlatformWarning(pan)` | 0.5s before platform moves | Cave-reverb ping feel, high-Q resonance |
| `TIMED_PLATFORM_WARNING` | `_playTimedPlatformWarning(pan)` | 3s before disappearance | Softer pre-tone, fires second to MP_WARNING |

### Level 3 — "Deepening" (Mechanistic Zone)

| Trigger ID | Handler Function | Description |
|---|---|---|
| `KEY_COLLECT` | `_playKeyCollect(color)` | Color-parameterized: red/blue/gold — distinct timbre per color |
| `DOOR_LOCKED` | `_playDoorLocked()` | Metallic slam, resonant decay, 0.5s |
| `DOOR_UNLOCK` | `_playDoorUnlock()` | Rising chime, mechanism release, 0.4s |
| `TIMED_DOOR_WARNING` | `_playTimedDoorWarning()` | Urgent tick/tock, 3s countdown, 0.3s pulses |
| `CRYSTAL_SWITCH` | `_playCrystalSwitch()` | Mechanical throw, click, spring, 0.2s |
| `PRESSURE_PLATE` | `_playPressurePlate()` | Weighted click, compression, 0.3s |
| `VAULT_ACTIVATE` | `_playVaultActivate()` | Deep chord progression → shimmer → silence before victory, 1.5s |

**Vault chord progression:** Multi-oscillator harmonic stack ascending then resolving. Designed to feel ancient and mechanical. Audio crossfade into victory sting is abrupt — 1.5–2s max crossfade for emotional peak relief.

**Zone C (no checkpoint):** Death chime must feel encouraging, not punishing. Music tension layer should not spike aggressively — maintain warm undertone.

### Level 4 — "The Crucible" (Tense/Urgent)

| Trigger ID | Handler Function | Description |
|---|---|---|
| `SPIKE_DEATH` | `_playSpikeDeath()` | Sawtooth scrape 800→200Hz + 1200Hz sine ring, distortion, 0.2s |
| `TIMED_PLATFORM_DISAPPEAR` | `_playTimedPlatformDisappear()` | Sweep 800→100Hz + crumble triangle 300→80Hz, 0.35s |
| `LEVEL_COMPLETE` | `_playComplete()` | Reused from L1 |
| `CHECKPOINT` | `_playCheckpoint()` | Reused from L1 |

**SPIKE_DEATH design:** Fast, sharp, percussive. Distinct from DROWN via duration (0.2s vs 2.5s), frequency range (high vs low-mid), and distortion vs fluid noise. No bubble particles.

### Level 5 — "Vault of Echoes" (Warm/Triumphant)

| Trigger ID | Handler Function | Description |
|---|---|---|
| `VICTORY_STING` | `_playVictorySting()` | Final resolution fanfare, harmonic completion, 1.5s |
| `LEVEL_COMPLETE` | `_playComplete()` | Full victory sequence |
| `CHECKPOINT` | `_playCheckpoint()` | Reused |

---

## 9.4 Audio-Visual Sync Points

### Zone C Cross-Modal Design (Level 2–5)
- **Visual:** Cold stone → warm gold across 3 parallax layers (ancient stone background → golden ambient)
- **Audio:** Warm rising harmonic layer, frequency shift 50–80Hz warmer than Zone B base
- **Trigger:** Audio warm layer rises in parallel with background warmth progression
- **Implementation:** Zone C ambient layer `startAmbient('zone_c')` activates when player enters Zone C region; fade-in 1s

### Crystal Proximity Sync
- Audio threshold: 2 units (matched to visual glow base radius)
- Visual base glow synchronized to audio resonance frequency (3.3 Hz)
- Crystal collection chimes use same harmonic series as proximity tones — seamless transition

### Water Zone Sync
- Audio shimmer layered over visual shimmer (2 FPS, 500ms/frame)
- Water sound ambient layer: filtered rush noise, low frequency, continuous loop
- DROWN trigger distinct from ambient: panic sine element only fires on trigger, not ambient

### Torch Integration
- `SFX_TORCH_LIGHT` trigger: brief whoosh + crackle, 0.3s, paired with visual flame ignition
- Timing: Audio fires at frame of flame sprite appearance

---

## 9.5 Character Audio Signatures (Orb)

**Movement:** Hovering/gliding (continuous low-level oscillation under player motion)  
**Jump:** Light pulse/whoosh — ascending harmonic sweep, 0.2s  
**Land:** Soft bounce — low-frequency thud, 0.1s, grounded  
**Idle:** Subtle ambient hum (optional, low priority)  

Orb signature: smooth, luminous, geometric. All character SFX use sine-based synthesis with harmonic overtones — no harsh edges.

---

## 9.6 Ambient Audio Design

### Per-Level Ambient Strategy

| Level | Zone | Base Character | Variation Approach |
|---|---|---|---|
| L1 "Awakening" | A/B | Neutral dungeon hum | Subtle drip, distant echo |
| L1 | C | Warm undertone | Rising harmonic, golden association |
| L2 "The Descent" | A (water) | Filtered rush, deep resonance | Continuous water presence |
| L2 | B (vertical) | Echo, depth resonance | Vertical shaft reverb |
| L3 "Deepening" | A/B | Mechanism room | Gears, clockwork, mechanical rhythm |
| L3 | C | Vault warmth | Ancient resonance, harmonic completion |
| L4 "The Crucible" | All | Tension, urgency | Rhythmic pulse, low rumble |
| L5 "Vault of Echoes" | All | Warmth, triumph | Full harmonic pad, victory undertone |

### L4→L5 Crossfade
- **Timing:** Maximum 1.5–2s crossfade between tracks
- **Character shift:** Urgent → Triumphant (abrupt, not gradual)
- **Purpose:** Emotional peak relief — player reaches culmination, tension releases

---

## 9.7 Engineering Integration Notes

### Trigger Wiring (Zephyr)
- All triggers via `AudioEngine.trigger(eventName)` 
- Spatial warnings: `AudioEngine.triggerSpatialWarning(platform.x, player.x, pan)` — pan computed by caller
- Ambient loops: `AudioEngine.startAmbient(zoneType)` / `stopAmbient()`
- Proximity: `setProximityTarget(playerObj, crystalsArray)` once at level init, then `updateProximity()` every frame

### Performance Constraints
- All synthesis is Web Audio API — no external files
- Ambient loops: 60–90s duration, loop seamlessly
- SFX durations: 0.1s (land) to 2.5s (drown)
- Mobile-friendly: no heavy reverb, compression on master bus

### QA Testing Points
- All 20+ triggers fire correctly with expected duration
- Proximity audio scales smoothly with distance (no clicks/pops)
- Spatial warnings pan correctly (left/right/both ears)
- Ambient loops seamlessly without audible gap
- DROWN and SPIKE_DEATH are audibly distinct at 2-second listening

---

## 9.8 Deliverable Checklist

| Item | Status | Location |
|---|---|---|
| Section 5 Audio Direction | ✅ Complete | `docs/audio/Section_05_Audio_Identity.md` |
| Section 9 Audio Identity (this doc) | ✅ Complete | `docs/audio/Section_09_Audio_Identity.md` |
| audio_engine.js (production) | ✅ Complete | Repo root |
| Section 9 push to repo | 🔄 In progress | — |

---

*Document maintained by Cadenza. Last updated: 2026-04-24T03:53 UTC.*
