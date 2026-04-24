# Audio Wiring Spec — prototype_v9.js
**Author:** Cadenza (Audio Designer)
**Date:** 2026-04-24
**Status:** Ready for Zephyr integration

## Audio Engine Reference
File: `docs/audio/audio_engine.js` (v0.7+, on origin/main)

### Public API
```javascript
audioEngine.init()           // Initialize Web Audio context (call once on load)
audioEngine.resume()         // Resume AudioContext (call on first user interaction)
audioEngine.trigger(name)    // Fire one-shot SFX by name string

// Proximity system (per-frame calls)
audioEngine.startProximitySound()                          // Start crystal proximity heartbeat
audioEngine.updateProximitySound(player, crystals)        // Call every frame: update position
audioEngine.stopProximitySound()                          // Stop when leaving level

// Spatial audio (per-platform calls)
audioEngine.triggerSpatialWarning(panValue)               // pan: -1 (left) to +1 (right)
audioEngine.triggerSpatialTimedWarning(panValue)          // pan: -1 (left) to +1 (right)

// Ambient layers
audioEngine.trigger('ZONE_C_AMBIENT_START')  // Level 3 Zone C warm ambient
audioEngine.trigger('ZONE_C_AMBIENT_STOP')    // Stop Zone C ambient
```

## Trigger Inventory

### Already Wired (prototype_v9.js)
| Trigger | Line | Status |
|---|---|---|
| SPIKE_DEATH | 157 | ✅ Wired |
| JUMP | 181 | ✅ Wired |
| CRYSTAL | 207 | ✅ Wired |
| EXIT | 208 | ✅ Wired (on levelComplete) |
| CHECKPOINT | 215 | ✅ Wired |
| MOVING_PLATFORM_WARNING (×2) | 232, 240 | ✅ Wired |
| TIMED_PLATFORM_WARNING | 251 | ✅ Wired |
| TIMED_PLATFORM_DISAPPEAR | 255 | ✅ Wired |

### Missing Wiring (Action Required)

#### 1. LAND — Player lands on ground
**Where:** In `updatePlayer()` after collision resolution, when player becomes grounded
**Trigger:** `audioEngine.trigger('LAND')`
**Approximate location:** After ground collision in `updatePlayer()` — when `player.vy >= 0` and collision occurs, or when `grounded` transitions from false to true
**Priority:** HIGH

#### 2. DROWN — Player enters water zone
**Where:** In `updatePlayer()` — water zone collision check
**Trigger:** `audioEngine.trigger('DROWN')`
**Where:** Prototype defines `waterZones = [{x, y, w, h}, ...]` at line ~264. Check player AABB vs each waterZone. If overlapping, trigger DROWN and reset player.
**Priority:** HIGH — Cedar's art block

#### 3. Proximity System — Crystal heartbeat (per-frame)
**Where:** In `update()` game loop, inside or after `updatePlayer()` call
**Code:**
```javascript
// In game loop — call every frame after player/crystal data is updated
if (audioEngine && !audioEngine.PROXIMITY_ACTIVE) {
  audioEngine.startProximitySound();
}
if (audioEngine && audioEngine.PROXIMITY_ACTIVE) {
  audioEngine.updateProximitySound(player, crystals);
}
```
**Alternative (if preferred):** Call once in `initLevel()` after crystals array is populated, then call `updateProximitySound()` every frame in `update()`
**Priority:** MEDIUM — affects subconscious crystal guidance

#### 4. TIMED_PLATFORM_DISAPPEAR — Optional polish
**Current:** Wired at line 255 as one-shot. Consider adding spatial pan if platform position known.
**Priority:** LOW — one-shot trigger already present

## Water Zone Reference
```javascript
// From prototype_v6.js (Level 2 design, verify in v9)
waterZones = [
  {x:288, y:336, w:128, h:64},
  {x:160, y:592, w:96, h:32}
];
```
Player AABB collision check pattern:
```javascript
function playerInWaterZone() {
  for (let zone of waterZones) {
    if (player.x + player.w > zone.x && player.x < zone.x + zone.w &&
        player.y + player.h > zone.y && player.y < zone.y + zone.h) {
      return true;
    }
  }
  return false;
}
```
If `playerInWaterZone()` returns true: trigger DROWN, reset player to lastCheckpoint.

## Pan Value Calculation (for spatial audio)
```javascript
function computePan(sourceX, playerX) {
  const canvasCenter = 512; // adjust to your canvas width / 2
  const pan = (sourceX - playerX) / canvasCenter;
  return Math.max(-1, Math.min(1, pan));
}
```
Platform pan example: `audioEngine.triggerSpatialWarning(computePan(platform.x, player.x))`

## Notes for Zephyr
- `init()` and `resume()` must be wired to first user interaction (click/keypress) due to browser AudioContext policy
- All trigger names are uppercase strings matching the audio_engine.js switch statement
- Proximity uses separate oscillator stack (660Hz + 663.3Hz dual-oscillator) — does not affect one-shot trigger timing
- DROWN and SPIKE_DEATH have distinct synthesis: DROWN is liquid/fluid (sine sweeps + bandpass noise + LFO undercurrent), SPIKE_DEATH is metallic/harsh (sawtooth + distortion). Bubble particles (Cedar's art) provide visual separation.