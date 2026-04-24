# Level 3 Audio Production — The Deepening

**Document Type:** Level-specific audio production spec  
**Level:** 3 — The Deepening (Mechanistic/Ancient theme)  
**Status:** Production-ready  
**Date:** 2026-04-24  
**Author:** Cadenza (Audio Designer)

---

## Overview

Level 3 introduces mechanical systems — keys, locked doors, timed doors, pressure plates, and the triple-key vault. Audio conveys ancient machinery awakening: audible gears, resonant locks, purposeful mechanism activation. Atmosphere is colder and more utilitarian than Level 2, with moments of tension (timed doors) and triumph (vault opening).

**Music mood:** Ancient & Mechanistic  
**Ambient character:** Mechanism room — clockwork gears, resonant stone, mechanical hum  
**Emotional arc:** Curiosity → Tension → Triumph

---

## Audio Trigger Inventory — Level 3

| Trigger ID | Type | Implementation | Status |
|------------|------|-----------------|--------|
| `KEY_COLLECT` | One-shot | Synth fanfare, arpeggio build | ✅ In engine |
| `DOOR_LOCKED` | One-shot | Dull thud + subtle resonance | ✅ In engine |
| `DOOR_UNLOCK` | One-shot | Metallic click + resonant unlock sweep | ✅ In engine |
| `TIMED_DOOR_WARNING` | One-shot (repeating) | Rising urgency tick, pitch increases | ✅ In engine |
| `CRYSTAL_SWITCH` | One-shot | Mechanical click + activation sweep | ✅ In engine |
| `PRESSURE_PLATE` | One-shot | Stone depression thunk + micro-click | ✅ In engine |
| `VAULT_ACTIVATE` | One-shot | Deep chord → shimmer → silence (victory bridge) | ✅ In engine |

---

## Trigger Specifications

### KEY_COLLECT

**Trigger:** `trigger('KEY_COLLECT')` — fires on player collision with key entity  
**Type:** One-shot  
**Design intent:** Reward moment. Distinct from crystal collect — conveys discovery and unlock potential.

**Sound design:**
- Harmonic arpeggio: low root → mid third → high fifth, ~100ms per note
- Root note: ~262Hz (C4), third: ~330Hz (E4), fifth: ~392Hz (G4)
- Slight reverb tail (1.5s decay)
- Duration: ~0.8s total (3-note arpeggio + tail)
- Volume: 0.5 — noticeable but not overwhelming

**Technical notes:**
- Three key variants (gold/silver/bronze) use the same SFX — visual color differentiation is sufficient
- No stereo positioning needed (player-proximal trigger)
- Trigger once per key, not continuous

**Edge cases:**
- EC: Key collected while at max keys — suppress, prevent double-play
- EC: Key collected during death animation — suppress, restart on respawn

---

### DOOR_LOCKED

**Trigger:** `trigger('DOOR_LOCKED')` — fires when player activates locked door without required key  
**Type:** One-shot  
**Design intent:** Denial feedback. Quick, clear, non-punishing. Player understands immediately they need a key.

**Sound design:**
- Primary: dull stone/metal thunk at ~150Hz, 50ms attack
- Secondary: short metallic rattle (100–200Hz noise burst, 30ms)
- No reverb — flat, dead sound conveys locked/stuck
- Duration: ~0.2s total
- Volume: 0.4

**Technical notes:**
- Must fire before visual feedback (player state change)
- Position at door entity X
- Cooldown 200ms prevents spam

**Edge cases:**
- EC: Rapid door activation attempts — cooldown prevents audio spam
- EC: Player walks into locked door without activating — no trigger (requires activation intent)

---

### DOOR_UNLOCK

**Trigger:** `trigger('DOOR_UNLOCK')` — fires when player activates locked door WITH required key  
**Type:** One-shot  
**Design intent:** Relief + progress. Metallic, satisfying unlock sound conveying passage opening.

**Sound design:**
- Metallic click at ~800Hz, 20ms attack
- Resonant sweep downward (800Hz → 200Hz over 300ms)
- Subtle reverb tail suggesting stone chamber
- Duration: ~0.5s total
- Volume: 0.55

**Technical notes:**
- Position at door entity X
- Fire after key consumption logic (key removed from inventory)
- Sync with door visual open animation

**Edge cases:**
- EC: Multiple keys consumed — single DOOR_UNLOCK, not per-key
- EC: Door unlock during death — suppress, trigger on respawn

---

### TIMED_DOOR_WARNING

**Trigger:** `trigger('TIMED_DOOR_WARNING')` — fires once when timed door begins countdown, repeats every 1s until door closes  
**Type:** Repeating one-shot (called by game loop)  
**Design intent:** Escalating tension. Each warning more urgent than the last.

**Sound design:**
- Tick: short metallic ping at ~1200Hz, 30ms
- Pitch increases per repetition: +100Hz per cycle (1200 → 1300 → 1400...)
- Final 2 warnings: add low rumble undertone (60Hz, subtle)
- Duration: ~0.1s per tick
- Volume: 0.45

**Implementation for Zephyr:**
```
// Called each second during countdown
timedDoorWarningCount++;
_playTimedDoorWarning(timedDoorWarningCount); // pitch scales with count
// Reset timedDoorWarningCount on door close/reset
```

**Timing:** 4s (base) → 3s (+100Hz) → 2s (+200Hz) → 1s (+300Hz + rumble) → close

**Edge cases:**
- EC: Door reopened after closing — reset warning count
- EC: Player exits door zone mid-countdown — stop warnings, reset count

---

### CRYSTAL_SWITCH

**Trigger:** `trigger('CRYSTAL_SWITCH')` — fires when player activates crystal-linked switch mechanism  
**Type:** One-shot  
**Design intent:** Mechanism activation confirmation. Mechanical, not organic.

**Sound design:**
- Mechanical click at ~600Hz, 15ms attack
- Activation sweep: mid harmonic build (300→600Hz over 200ms)
- Subtle gear-whir undertone (filtered noise, 50ms delay after click)
- Duration: ~0.4s total
- Volume: 0.5

**Technical notes:**
- Position at switch entity X
- Sync with crystal color change visual
- Distinct from PRESSURE_PLATE: mechanical/electrical vs. stone/physical

**Edge cases:**
- EC: Switch activated by falling crystal — no trigger (requires player activation intent)
- EC: Rapid switch re-activation — cooldown 500ms

---

### PRESSURE_PLATE

**Trigger:** `trigger('PRESSURE_PLATE')` — fires when player stands on pressure plate (sufficient weight)  
**Type:** One-shot  
**Design intent:** Stone depression confirmation. Heavy, satisfying thunk.

**Sound design:**
- Stone depression thunk at ~100Hz, 80ms attack
- Micro-click overlay at ~2000Hz (stone settling), 30ms
- No reverb — absorbed by stone environment
- Duration: ~0.2s total
- Volume: 0.45

**Technical notes:**
- Two-plate puzzles: each plate fires independently
- Both active = combined mechanism activation
- Position at plate entity X
- Distinct from CRYSTAL_SWITCH: stone/physical vs. mechanical/electrical

**Edge cases:**
- EC: Player jumps on plate without sufficient weight — no trigger
- EC: Both plates simultaneously — both triggers fire, mechanism activates once
- EC: Player leaves before mechanism activates — plate deactivates, no penalty

---

### VAULT_ACTIVATE

**Trigger:** `trigger('VAULT_ACTIVATE')` — fires when all three vault keys inserted and vault opens  
**Type:** One-shot  
**Design intent:** Victory bridge. Emotional peak before final reflection moment. Deep, resonant, triumphant.

**Sound design:**
- Deep resonant chord at ~110Hz (A2)
- Harmonic stack: 110Hz + 165Hz + 220Hz + 330Hz
- Decay: 1.5s sustain at peak, exponential fade over 2s
- Shimmer overlay: subtle sparkle (2000–4000Hz, low volume)
- Reverb: long (4s decay) suggesting vast sacred chamber
- Duration: ~4s total
- Volume: 0.7 — loudest single SFX in the game

**Technical notes:**
- Position at vault entity X
- Sync with vault door visual open animation
- Last gameplay moment before victory screen
- VICTORY_STING fires separately on victory screen

**Edge cases:**
- EC: Vault activated during death — suppress, trigger on respawn

---

## Zone Audio Breakdown

### Zone A — Key Hunt (5 crystals, key + locked door)
- Ambient: Ancient stone, minimal mechanism
- Primary SFX: KEY_COLLECT, DOOR_LOCKED, DOOR_UNLOCK
- Tension: Low — exploration mood

### Zone B — Timed Doors (6 crystals, 4s timed doors, 2 simultaneous pressure plates)
- Ambient: Mechanism room — gear sounds, clockwork resonance
- Primary SFX: TIMED_DOOR_WARNING, PRESSURE_PLATE, CRYSTAL_SWITCH
- Tension: High — timed pressure

### Zone C — Vault (3 crystals, triple-key vault, victory screen)
- Ambient: Sacred chamber — warm, expansive reverb
- Primary SFX: VAULT_ACTIVATE, VICTORY_STING
- Tension: Resolved — triumphant culmination

---

## Zone C No-Checkpoint Policy

- Death in Zone C triggers encouraging, not punishing, death sound
- Suggested: softer variant — subtle descending tone, 0.3s
- Alternative: use `_playCheckpoint()` (warm confirmation) as Zone C death sound — player was close to victory

---

## Audio-Visual Sync Matrix

| Event | Visual | Audio | Sync |
|-------|--------|-------|------|
| Key collected | Key disappears + particle | KEY_COLLECT arpeggio | Simultaneous |
| Door activated (no key) | Door flashes red | DOOR_LOCKED thud | Immediate |
| Door unlocked | Door opens | DOOR_UNLOCK sweep | 0–50ms lead |
| Timed door countdown | Timer + door pulse | TIMED_DOOR_WARNING | Synced with timer |
| Switch activated | Crystal illuminates | CRYSTAL_SWITCH click | Simultaneous |
| Plate pressed | Plate depresses | PRESSURE_PLATE thunk | Immediate |
| Vault opens | Door rises/falls | VAULT_ACTIVATE chord | 0–50ms lead |
| Victory screen | Screen fades in | VICTORY_STING | On fade-in |

---

## Ambient Audio — Level 3

**Base ambient:** Ancient stone + subtle mechanism hum  
**Zone A:** Cold stone, minimal variation  
**Zone B:** Gear sounds + clockwork resonance (mechanism room character)  
**Zone C:** Warm sacred chamber reverb (crossfade from Zone B, 2s transition)

**Implementation:** Uses existing `playAmbient()`/`stopAmbient()` with Level 3 parameters (higher mechanism content, longer reverb).

---

## Integration Notes for Zephyr

1. **Zone C no-checkpoint death:** Soft variant or `_playCheckpoint()` reuse — player was close to victory
2. **Timed door warning count:** Per-door instance, reset on close/reset. Pitch = base (1200Hz) + (count × 100Hz)
3. **Pressure plate weight check:** Only trigger on confirmed sufficient weight (not just collision)
4. **Vault activation sequence:** Key consumption → VAULT_ACTIVATE → door animation → crystal reset → victory screen → VICTORY_STING

---

## Document Status

| Item | Status |
|------|--------|
| Triggers in engine | 7/7 ✅ |
| Production spec | Complete |
| Integration pending | Zephyr wiring phase |
| Blocked dependencies | None |

This document serves as the formal production spec for Level 3 audio. All trigger designs are locked and implemented in `audio_engine.js`. Integration with game logic is pending Zephyr's wiring phase.