# Animation-Phase Audio Triggers Specification
**Author:** Cadenza (Audio Designer)
**Engine contact:** Zephyr
**Status:** Ready for integration
**Date:** 2026-04-25

---

## Overview

Seven audio triggers wired to animation frame metadata exposed by the engine. These triggers synchronize SFX to player animation states — footstep cadence, jump apex, landing impact, death/victory key poses.

All variables are in game loop scope. No new engine wiring required beyond `audioEngine.trigger()` calls.

---

## Frame Index Formula

```
fi = Math.floor((animTime * fps) % frames)
```

- `animTime` in seconds, accumulates each update, dt capped at 0.1s
- Reset to 0 at level init and after respawn

**State table:**

| State   | FPS | Frames | Frame dur | Key fi transitions |
|---------|-----|--------|-----------|-------------------|
| idle    | 4   | 3      | 0.250s    | —                 |
| run     | 8   | 4      | 0.125s    | fi=0→1, fi=2→3 (footstep cadence) |
| jump    | 4   | 4      | 0.250s    | fi=1 (~0.25s in, apex) |
| fall    | 4   | 3      | 0.250s    | fi=2 (impact-ready) |
| death   | 6   | 4      | 0.167s    | fi=2 (key pose)    |
| victory | 6   | 6      | 0.167s    | fi=2 (arms up)    |

---

## Trigger Inventory

### 1. RUN_STEP
- **Condition:** fi transition 0→1 and 2→3 during `state==="run"`
- **Rate:** ~every 250ms at 8fps run cycle
- **Implementation:** Track previous fi, fire on transitions. Two firings per full stride cycle.
- **Audio intent:** Subtle footstep texture — two clicks per run cycle, synced to visual foot-down moments.

### 2. JUMP_LIFTOFF
- **Condition:** State transition `grounded→!grounded`, vy<0
- **Implementation:** Track `wasGrounded` boolean, fire once on transition. Use `jumpLiftoffFired` flag to prevent double-fire on same jump.
- **Audio intent:** Soft liftoff puff — player leaving the ground. Brief, non-intrusive.

### 3. JUMP_APEX
- **Condition:** `fi===1 && state==="jump"` (~0.25s into jump animation)
- **Implementation:** Fire once per jump using `jumpApexFired` flag. Reset on landing.
- **Audio intent:** Subtle apex sound — sense of weightlessness. Optional, can be merged with liftoff if preferred.

### 4. LAND_STONE
- **Condition:** `grounded && wasAirborne && groundTile[0]==="p"` (solid platform tile)
- **Implementation:** Fire once on `!wasGrounded→grounded` transition. Check `TILE_MAP[ty][tx][0]` before firing.
- **Audio intent:** Solid landing thud — grounded, satisfying. Distinct from spike landing.

### 5. LAND_SPIKE
- **Condition:** `grounded && wasAirborne && groundTile[0]==="h"` (spike hazard tile)
- **Implementation:** Same transition as LAND_STONE, fires instead when spike tile detected.
- **Audio intent:** Sharp spike death impact + death trigger fires simultaneously. Layered: impact thud + death chime.
- **Note:** Fires `SPIKE_DEATH` trigger if not already in death state.

### 6. DEATH_KEY_FRAME
- **Condition:** `fi===2 && state==="death"` (first frame of key pose)
- **Implementation:** Fire once on fi===2 entry using `deathKeyFired` flag.
- **Audio intent:** Synced to player's most visually expressive death pose. Paired with existing `SPIKE_DEATH` trigger — this is the visual sync, not the sound trigger itself.

### 7. VICTORY_KEY_FRAME
- **Condition:** `fi===2 && state==="victory"` (arms-up moment)
- **Implementation:** Fire once on fi===2 entry using `victoryKeyFired` flag.
- **Audio intent:** Synced to victory arms-up pose. Paired with existing `LEVEL_COMPLETE` trigger — this is the visual sync moment.

---

## Ground Material Detection

```javascript
function getGroundTile() {
  var tx = Math.floor((player.x + player.w/2) / 32);
  var ty = Math.floor((player.y + player.h + 1) / 32);
  var key = TILE_MAP[ty] ? TILE_MAP[ty][tx] : null;
  return key;
}
// Material class: TILE_MAP[ty][tx][0]
// "p" = solid platform (→ LAND_STONE)
// "h" = hazard/spike (→ LAND_SPIKE)
```

---

## State Transition Detection

```javascript
// In update loop:
var wasGrounded = player.grounded;
var wasAirborne = !player.grounded; // captured before state update

// After physics update:
if (!wasGrounded && player.grounded) {
  // Landed — check ground tile, fire LAND_STONE or LAND_SPIKE
  var tile = getGroundTile();
  if (tile && tile[0] === "h") {
    audioEngine.trigger("LAND_SPIKE");
  } else {
    audioEngine.trigger("LAND_STONE");
  }
}
```

---

## Flag State (per-instance)

| Flag | Reset condition |
|------|-----------------|
| `jumpLiftoffFired` | Reset on `grounded === true` |
| `jumpApexFired` | Reset on `grounded === true` |
| `deathKeyFired` | Reset on `deathTimer === 0` |
| `victoryKeyFired` | Reset on `!levelComplete` |

---

## Priority

- `DEATH_KEY_FRAME` and `VICTORY_KEY_FRAME`: Interrupt any running SFX
- `LAND_SPIKE`: Interrupts, triggers `SPIKE_DEATH` if not already in death state
- All others: Non-interrupting layered SFX

---

## Zephyr Integration Notes

Wire `audioEngine.trigger()` calls inline in game loop, alongside existing `audioEngine.updateProximitySound()` call. All state variables (`player.grounded`, `player.vy`, `deathTimer`, `levelComplete`, `animTime`) already in scope.

Recommended injection points:
- After `updatePlayer(dt)` call in `loop()` — for `RUN_STEP`, `JUMP_*`, `LAND_*`
- In `drawPlayer()` context — for `DEATH_KEY_FRAME`, `VICTORY_KEY_FRAME`
- Or unified in `loop()` after physics update, before render

No new audio engine methods needed — all triggers use existing `audioEngine.trigger(name)` API.

**Trigger names to add to audio_engine.js enum:**
`RUN_STEP`, `JUMP_LIFTOFF`, `JUMP_APEX`, `LAND_STONE`, `LAND_SPIKE`, `DEATH_KEY_FRAME`, `VICTORY_KEY_FRAME`