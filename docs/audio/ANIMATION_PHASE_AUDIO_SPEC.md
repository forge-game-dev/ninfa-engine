# Animation-Phase Audio Triggers Specification
**Author:** Cadenza (Audio Designer)
**Engine contact:** Zephyr
**Status:** Updated — matches Zephyr's implementation (`04fe521`)
**Date:** 2026-04-26

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

**State table:** *(updated 2026-04-26: victory fi corrected from 2 → 3 to match Zephyr's implementation)*

| State   | FPS | Frames | Frame dur | Key fi transitions |
|---------|-----|--------|-----------|-------------------|
| idle    | 4   | 3      | 0.250s    | —                 |
| run     | 8   | 4      | 0.125s    | fi=0→1, fi=2→3 (footstep cadence) |
| jump    | 4   | 4      | 0.250s    | fi=1 (~0.25s in, apex) |
| fall    | 4   | 3      | 0.250s    | fi=2 (impact-ready) |
| death   | 6   | 4      | 0.167s    | fi=2 (key pose)    |
| victory | 6   | 6      | 0.167s    | fi=3 (arms up) ✓  |

> **Note:** 6-frame victory strip at 6fps runs ~1 second. `fi=3` is the visual arms-up pose (~0.5s in). `fi=2` was a spec error in previous revision — corrected to match Zephyr's implementation at SHA `04fe521`.

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
- **Condition:** `fi===3 && state==="victory"` (arms-up moment) — **corrected from fi===2**
- **Implementation:** Fire once on fi===3 entry using `victoryKeyFired` flag.
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
|------|----------------|
| `runStepFired` | Set on step transition, cleared on `state!=="run"` |
| `jumpLiftoffFired` | Cleared on `grounded` |
| `jumpApexFired` | Cleared on `grounded` |
| `landStoneFired` | Cleared after 1 frame on landing |
| `landSpikeFired` | Cleared after 1 frame on landing |
| `deathKeyFired` | Set on fi===2 entry, cleared on `state!=="death"` |
| `victoryKeyFired` | Set on fi===3 entry, cleared on `!levelComplete` |

---

## Audio Implementation Notes

- **Interrupt policy:** `DEATH_KEY_FRAME` and `VICTORY_KEY_FRAME` interrupt any running SFX — they are moment-defining events
- **Layering:** `LAND_SPIKE` layers impact thud + death chime simultaneously with `SPIKE_DEATH` trigger
- **Volume:** All animation-phase SFX normalized to -4dB peak; master bus handles overall level
- **Asset delivery:** 7 WAV files in `vault/animation_phase/`, 44100Hz mono 16-bit PCM

---

## Asset Inventory

| Trigger | Filename | Duration |
|---------|----------|----------|
| RUN_STEP | anim_RUN_STEP.wav | 50ms |
| JUMP_LIFTOFF | anim_JUMP_LIFTOFF.wav | 120ms |
| JUMP_APEX | anim_JUMP_APEX.wav | 60ms |
| LAND_STONE | anim_LAND_STONE.wav | 180ms |
| LAND_SPIKE | anim_LAND_SPIKE.wav | 200ms |
| DEATH_KEY_FRAME | anim_DEATH_KEY_FRAME.wav | 500ms |
| VICTORY_KEY_FRAME | anim_VICTORY_KEY_FRAME.wav | 600ms |

**Style:** Indie Casual + Nostálgico — bouncy, retro warmth, soft-impact feel
**Branch:** `cadenza/animation-phase-audio`
**Generated:** 2026-04-26