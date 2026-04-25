# Audio Wiring Spec — prototype_v13.js
**Author:** Cadenza (Audio Designer)
**Date:** 2026-04-25
**Status:** Current (SHA a94fc9e)

## Audio Engine Reference
File: `docs/audio/audio_engine.js` (v0.7+, on origin/main)

### Public API
```javascript
audioEngine.init()           // Initialize Web Audio context (call once on load)
audioEngine.resume()         // Resume AudioContext (call on first user interaction)
audioEngine.trigger(name)    // Fire one-shot SFX by name string

// Proximity system (per-frame calls)
audioEngine.startProximitySound()                          // Start crystal proximity heartbeat
audioEngine.updateProximitySound(player, crystals)        // Call every frame
audioEngine.stopProximitySound()                          // Stop when leaving level

// Spatial audio (per-platform calls)
audioEngine.triggerSpatialWarning(panValue)               // pan: -1 (left) to +1 (right)
audioEngine.triggerSpatialTimedWarning(panValue)           // pan: -1 (left) to +1 (right)

// Zone C ambient
audioEngine.startZoneCAmbient()                           // Warm Zone C ambient
audioEngine.stopZoneCAmbient()                             // Stop Zone C ambient
```

---

## Trigger Inventory — prototype_v13.js (SHA a94fc9e)

### Player Actions

| Trigger | Function | Line | Status |
|---|---|---|---|
| JUMP | `audioEngine.trigger("JUMP")` | 95 | ✅ Wired |
| LAND | `triggerLand()` → `audioEngine.trigger("LAND")` | 36, 91 | ✅ Wired |
| SPIKE_DEATH | `triggerDeath()` → `audioEngine.trigger("SPIKE_DEATH")` | 33 | ✅ Wired |
| DROWN | `triggerDrown()` → `audioEngine.trigger("DROWN")` | 34 | ✅ Wired |

### Collectibles & Items

| Trigger | Function | Line | Status |
|---|---|---|---|
| CRYSTAL | `triggerCrystal()` → `audioEngine.trigger("CRYSTAL")` | 35, 99 | ✅ Wired |
| KEY_COLLECT | `audioEngine.trigger("KEY_COLLECT")` | 101 | ✅ Wired |

### Mechanics — Platforms

| Trigger | Function | Line | Status |
|---|---|---|---|
| MOVING_PLATFORM_WARNING | `audioEngine.trigger("MOVING_PLATFORM_WARNING")` | ~220 | ✅ Wired (×2, each MP) |
| TIMED_PLATFORM_WARNING | `audioEngine.trigger("TIMED_PLATFORM_WARNING")` | ~239 | ✅ Wired |
| TIMED_PLATFORM_DISAPPEAR | `audioEngine.trigger("TIMED_PLATFORM_DISAPPEAR")` | ~243 | ✅ Wired |

### Mechanics — Doors & Pressure

| Trigger | Function | Line | Status |
|---|---|---|---|
| DOOR_UNLOCK | `audioEngine.trigger("DOOR_UNLOCK")` | 109, 114 | ✅ Wired (vault door + pressure plate) |
| DOOR_LOCKED | `audioEngine.trigger("DOOR_LOCKED")` | 111 | ✅ Wired (with 500ms cooldown) |
| PRESSURE_PLATE | `audioEngine.trigger("PRESSURE_PLATE")` | 126 | ✅ Wired |
| VAULT_ACTIVATE | `audioEngine.trigger("VAULT_ACTIVATE")` | 130 | ✅ Wired |
| TIMED_DOOR_WARNING | `audioEngine.trigger("TIMED_DOOR_WARNING")` | 121 | ✅ Wired (inside door collision, warningFired guard) |

### Level States

| Trigger | Function | Line | Status |
|---|---|---|---|
| CHECKPOINT | `triggerCheckpoint()` → `audioEngine.trigger("CHECKPOINT")` | 37, 203 | ✅ Wired |
| COMPLETE | `audioEngine.trigger("COMPLETE")` | 132 | ✅ Wired |
| VICTORY_STING | `triggerVictory()` → `audioEngine.trigger("VICTORY_STING")` | 38, 132 | ✅ Wired |

### Spatial Audio

| Trigger | Function | Line | Status |
|---|---|---|---|
| Spatial warning (MP) | `triggerSpatialWarning(px, py)` — pan from platform X | 39 | ✅ Wired |
| Spatial timed warning | `triggerSpatialTimedWarning(px, py)` | ~241 | ✅ Wired |

### Ambient

| Trigger | Function | Line | Status |
|---|---|---|---|
| Zone C ambient | `audioEngine.startZoneCAmbient()` | 137 | ✅ Wired |
| Zone C stop | `audioEngine.stopZoneCAmbient()` | 137 | ✅ Wired |
| Ambient resume | `ambientEngine.resumeAmbient()` | 187 | ✅ Wired (on checkpoint restart) |

### Per-Frame System

| Call | Location | Line | Status |
|---|---|---|---|
| `initAudio()` | After DOM ready, before loadLevel | 30 | ✅ Wired (SHA a94fc9e fix) |
| `startProximitySound()` | `initAudio()` | 30 | ✅ Wired |
| `updateProximitySound()` | In `update()` game loop | 192 | ✅ Wired |
| `setProximityTarget()` | `restartFromCheckpoint()` | 187 | ✅ Wired |

---

## Audio Trigger Distinction — DROWN vs SPIKE_DEATH
- **DROWN**: Liquid/fluid — sine sweeps + bandpass noise + LFO undercurrent. Cedar's bubble particle art provides visual separation.
- **SPIKE_DEATH**: Metallic/harsh — sawtooth + distortion + high-frequency shimmer.
These are distinct synthesis profiles in audio_engine.js.

## initAudio() Ordering (SHA a94fc9e)
Fixed: `initAudio()` now called BEFORE `loadLevel(lvl)` — audio engine initialized before level data loads, ensuring proximity and Zone C systems are ready.

## TIMED_DOOR_WARNING — Per-Door Tracking (SHA a94fc9e)
Pressure tracking block (`d.doorOpenTime += dt`) now inside the player-on-door collision check. Warning fires once per door per close cycle, not every frame for all doors.

## CRYSTAL_SWITCH → VAULT_ACTIVATE Order (SHA a94fc9e)
`audioEngine.trigger("VAULT_ACTIVATE")` fires BEFORE `audioEngine.trigger("DOOR_UNLOCK")` in crystal switch handler (line 130), matching intended behavior.

---

## Notes for Implementation
- All trigger names are uppercase strings matching audio_engine.js switch statement
- Proximity uses dual-oscillator stack (660Hz + 663.3Hz) — does not affect one-shot timing
- Zone C check uses `levelData.zones.zoneC` — requires `zoneC` key in level JSON (not `C`)
- DOOR_LOCKED has 500ms cooldown to prevent rapid repeat triggers
- drawPlayer() in same commit uses `docs/art/sprites/strip_*.png` — 6 strips confirmed on main