# Level 5 Audio Production Guide
**Author:** Cadenza (Audio Designer)
**Project:** Dungeon Runner — ninfa-engine
**Date:** 2026-04-24
**Status:** Production-ready
**Level:** Level 5 — "The Sanctum"

---

## 1. Design Context

**Level Theme:** Warm, Triumphant, Culminating
**Visual Direction:** Sacred vault, golden light, ceremonial chamber
**Mechanic Profile:** Three keys on detour paths, vault door, Zone C finale with no checkpoint

**Audio Role:** Level 5 audio is the emotional payoff of the entire game. After L4's relentless tension ("lethal machine"), L5 must feel like a release — warm, ceremonial, and ultimately triumphant. The three-key vault, the golden Zone C ambient, and the victory stinger together form the audio climax of the player's journey.

**Level 5 vs. Level 4 Tone Shift:**
Level 4 was sharp, cold, and urgent. Level 5 is the opposite: warm, resonant, and conclusive. Where L4 used shorter decays and faster pulse, L5 uses longer sustains, warmer timbres, and richer harmonics. The crossfade from L4 to L5 should feel like stepping from a hostile forge into a sacred temple.

**Key Audio Design Principle:**
The victory here is earned, not given. The player has navigated 4 levels of increasing difficulty. L5 audio validates that effort — it feels earned, not easy. The warmth is present but the challenge remains real (12 spike segments, 5 moving platforms, no Zone C checkpoint).

---

## 2. Zone Breakdown

### Zone A — The Approach (Entry)
| Attribute | Value |
|-----------|-------|
| Crystals | 4 (C-01–C-04) |
| Checkpoints | 1 (CPK-01) |
| Mechanics | Static platforming, intro to L5 atmosphere |
| Gate contribution | 4/14 (~29%) |

**Audio intent:** The moment the player enters Level 5, the audio palette should shift. Dungeon base ambient remains but with warmer overtones — a subtle indication that this space is different. Crystals collected here use the warm variant (C major tonality).

**Crystals:** C-01 through C-04. Standard collection SFX with warm harmonic tint (as defined in Section 9 audio identity).

**Checkpoint (CPK-01):** First checkpoint of Level 5. Audio confirmation tone — warm, encouraging. This is the midpoint of the level and the player's journey. Slightly more celebratory than L4's checkpoints — the player is closer to the end.

---

### Zone B — The Convergence (Core)
| Attribute | Value |
|-----------|-------|
| Crystals | 6 (C-05–C-10) |
| Checkpoints | 1 (CPK-02) |
| Mechanics | 4 moving platforms (MP-H1/2 @2.5u/s, MP-V1/2 @2u/s), 1 timed platform (MP-T1, 3s), 3 keys on detour paths (gold/red/blue), 6 spike segments |
| Gate contribution | 6/14 (~43%) |

**Audio intent:** The convergence zone is where the player makes meaningful choices — detouring for the three keys that unlock the vault. Moving platform warnings follow the same spatial system as L4 (per-platform stereo pan). The three key pickups are audio milestones.

**Moving Platforms (4 total + 1 timed):**
- MP-H1, MP-H2: horizontal, 2.5 u/s
- MP-V1, MP-V2: vertical, 2 u/s
- MP-T1: timed, 3s active cycle, 720/416 velocity pattern

**Spatial Warning System:** Identical to Level 4 — `triggerSpatialWarning(platformX, player.x)` with per-platform stereo pan. Warning fires at ~15% proximity range.

**Timed Platform (MP-T1):** Same two-phase warning as L4:
- Phase 1: `MOVING_PLATFORM_WARNING` at 3.0s mark (softer, 660Hz)
- Phase 2: `TIMED_PLATFORM_WARNING` at 3.5s mark (sharper, 880Hz)
- `TIMED_PLATFORM_DISAPPEAR` at the 3.5s disappear moment

**Three Keys (Gold, Red, Blue):**
Each key is on a detour path — audio must communicate that these are special pickups. Trigger: `KEY_COLLECT` (already in engine, defined in L3 audio spec). Key collection audio:
- Distinct chime sequence (tri-tone: root → minor 3rd → major 3rd for gold/red/blue)
- Each key slightly higher pitch — player builds anticipation
- Subtle harmonic resonance suggesting power accumulation
- Total duration: ~0.8s per key

**Key ownership persistence:** Keys persist through death (per level_05.json design). Audio key confirmation plays each time a key is collected regardless of prior collection.

**Checkpoints (CPK-02):** Second checkpoint of Level 5. Standard checkpoint SFX. Player is now past the key-detour section and heading toward the Sanctum Chamber.

---

### Zone C — The Sanctum Chamber (Finale)
| Attribute | Value |
|-----------|-------|
| Crystals | 4 (C-11–C-14) |
| Checkpoints | 0 |
| Mechanics | 6 spike segments, VAULT_DOOR at x=864, y=480, 4 crystals, no checkpoint |
| Gate contribution | 4/14 (~29%) |
| No-checkpoint policy | ACTIVE — no checkpoint in Zone C |

**Audio intent:** Zone C is the emotional and audio climax of the game. The vault door, the Zone C ambient, and the three-key requirement create the most significant audio moment in Dungeon Runner. Zone C ambient (`ZONE_C_AMBIENT`) must activate here — warm golden tones that the player has been building toward since Level 3.

**Zone C Ambient (`ZONE_C_AMBIENT`):**
This is the crown jewel of the audio system. Triggered once on entry to Zone C:
- Warm sine-wave pad at ~220Hz base (warm, not cold)
- Subtle shimmer/pulse overlay at ~3Hz suggesting vault power pulse
- Long reverb decay (3.5–4s) simulating large sacred chamber
- Volume: 0.3–0.4 ambient level
- Crossfade from base dungeon ambient: 2s transition
- Implementation: `startZoneCAmbient()` on entry, `stopZoneCAmbient()` on death/respawn

**VAULT_DOOR sequence (x=864, y=480):**
Requires all 3 keys. Audio sequence:
1. Player reaches vault door with 3 keys — door locked until all keys present
2. First key insertion: `DOOR_LOCKED` (low resonant tone indicating locked state)
3. All keys present → `DOOR_UNLOCK` (brighter harmonic sweep — keys accepted)
4. Door opens → `VAULT_ACTIVATE` (deep resonant chord, 1.5s, shimmer overtones)
5. Door animation plays
6. Crystal reset (if applicable per design)
7. Player enters Sanctum Chamber

**No-checkpoint policy (Zone C):** Death in Zone C sends player back to CPK-02 (or level start if CPK-02 not reached). Audio principle: Zone C death chime is warm and encouraging — the player was close to the vault. A soft ascending tone (G4 → C5, 0.3s) communicates "almost there, try again."

**Crystals:** C-11 through C-14. Standard warm-variant collection SFX. These are the final four crystals of the game — each collection should feel like a step closer to completion.

---

## 3. SFX Inventory — Level 5

### 3.1 Reused Standard Triggers

| Trigger | Function | Notes |
|---------|----------|-------|
| `CRYSTAL` | Crystal collection | C-01–C-14 — warm harmonic variant |
| `JUMP` | Player jump | Orb glide/whoosh — standard |
| `LAND` | Player landing | Standard thud |
| `SPIKE_DEATH` | Spike death | Metallic hiss + visual bubble particles |
| `CHECKPOINT` | Checkpoint activation | CPK-01, CPK-02 — warm confirmation |
| `LEVEL_COMPLETE` | Exit portal / level clear | On portal entry |
| `ZONE_C_AMBIENT_START` | Zone C ambient activate | Warm golden pad + shimmer |
| `ZONE_C_AMBIENT_STOP` | Zone C ambient stop | On death or respawn |

### 3.2 Level 5 Specific Triggers (New/Reused from L3/L4)

| Trigger | Function | Notes |
|---------|----------|-------|
| `KEY_COLLECT` | Key pickup (gold/red/blue) | Tri-tone chime per key, ascending pitch |
| `DOOR_LOCKED` | Vault door locked | Low resonant tone — door needs all keys |
| `DOOR_UNLOCK` | All keys present, door unlocked | Brighter harmonic sweep |
| `VAULT_ACTIVATE` | Vault opens | Deep resonant chord, shimmer, 1.5s |
| `VICTORY_STING` | Victory screen | Short major fanfare, 1.3s, plays on victory screen display |
| `MOVING_PLATFORM_WARNING` | Moving platform alert | Per-platform stereo pan, 15% range |
| `TIMED_PLATFORM_WARNING` | Timed platform disappearing | Phase 2 warning, 3.0s mark |
| `TIMED_PLATFORM_DISAPPEAR` | Timed platform vanishes | Disappear moment snap/dissolve |

---

## 4. Victory Sequence — The Sanctum

The Level 5 victory is the game's emotional climax. Audio and visual are synchronized:

### 4.1 Vault Activation Sequence (Audio-Choreographed)

```
Key 1 collected → KEY_COLLECT (gold, pitch A4)
Key 2 collected → KEY_COLLECT (red, pitch C#5)
Key 3 collected → KEY_COLLECT (blue, pitch E5)
         ↓
Vault door reached with <3 keys → DOOR_LOCKED per missing key
         ↓
All 3 keys present → DOOR_UNLOCK (harmonic sweep, 0.5s)
         ↓
Vault door opens → VAULT_ACTIVATE (deep chord + shimmer, 1.5s)
         ↓
ZONE_C_AMBIENT_START (warm golden pad, 2s fade-in)
         ↓
Player enters Sanctum Chamber
         ↓
Collect C-11 through C-14
         ↓
Exit portal reached → LEVEL_COMPLETE (portal tone, 1.0s)
         ↓
Victory screen fades in → VICTORY_STING (major fanfare, 1.3s)
```

### 4.2 VICTORY_STING — Design Specification

**Trigger:** `trigger('VICTORY_STING')` — called once on victory screen display
**Type:** One-shot fanfare stinger
**Duration:** ~1.3s
**Design intent:** The final punctuation of the game. Short. Triumphant but not overwhelming — the victory is already earned. Distinct from `LEVEL_COMPLETE` which plays at the portal entry.

**Synthesis:**
- C major chord arpeggio: 523 → 659 → 784 Hz (C5 → E5 → G5)
- Low root note: 262 Hz (C4) enters first as the foundation
- Arpeggio build: low → high over 0.3s
- Sustain at peak for 0.5s at full harmonics
- Exponential fade over 0.5s
- Slight reverb tail (1.0s decay) for grandeur

**Audio character:** Warm, conclusive, celebratory. Not ironic or understated — the player earned this moment. But also not overwhelming — the game has trained the player to stay focused. This is a moment of reflection and reward, not a spectacle.

**API:** `trigger('VICTORY_STING')` — one-shot, no parameters. Called from victory screen render logic.

### 4.3 ZONE_C_AMBIENT — Synthesis Specification

**Trigger:** `startZoneCAmbient()` — continuous loop, called on Zone C entry
**Stop:** `stopZoneCAmbient()` — called on death, respawn, or level reset
**Duration:** Continuous loop (60–90s seamless)
**Design intent:** Audio palette shift mirrors visual palette shift. Cold stone → golden warmth.

**Synthesis:**
- Base pad: sine wave at 220Hz (A3), volume 0.25
- Harmonic layer: triangle at 440Hz (A4), volume 0.12
- Shimmer overlay: sine at 880Hz, amplitude-modulated at ~3Hz (LFO), volume 0.08
- Low rumble: sine at 55Hz, volume 0.06 (felt more than heard)
- Reverb: convolver or IIR reverb, decay 3.5–4s
- Filter: lowpass at 2000Hz (warm, not bright)

**Crossfade:** 2s fade-in on `startZoneCAmbient()`, 1s fade-out on `stopZoneCAmbient()`. Ambient base layer reduces during crossfade (ducking) to prevent muddiness.

**State persistence:** `ZONE_C_AMBIENT` state survives crystal collection and key pickup. Only stops on `ZONE_C_AMBIENT_STOP`, death, or level reset.

---

## 5. Spatial Audio — Moving Platforms

### 5.1 Per-Platform Stereo Panning (Zones A + B)

Level 5 uses the same spatial audio system as Level 4:

**API (per platform call):**
```javascript
// In platform update loop — per frame:
triggerSpatialWarning(platformX, player.x);

// Pan calculation (engine side):
const pan = Math.max(-1, Math.min(1, (platform.x - player.x) / (canvas.width / 2)));
```

**Implementation note:** `triggerSpatialWarning()` must be called from within each platform's update logic, not from a global handler. Pan value is computed at call time. Zephyr owns this wiring in `prototype_v11.js`.

**Warning fire condition:** Player enters ~15% of canvas width from platform center. Warning fires once per entry. Resets when player leaves range.

**Tone character:** Cave reverb ping — short, ethereal ping with ~0.3s decay. 880Hz sine with slight 882Hz harmonic layer (creates ~2Hz beat). Directional information, not musical expression.

### 5.2 Timed Platform (MP-T1) — Two-Phase Warning

MP-T1 follows the same two-phase system as Level 4:

**Phase 1 — MOVING_PLATFORM_WARNING (at 3.0s):**
- Softer, first alert — 660Hz sine, 0.2s duration, volume 0.2
- Player may still be on the platform

**Phase 2 — TIMED_PLATFORM_WARNING (at 3.5s):**
- Sharper, urgent — 880Hz sine, 0.25s duration, volume 0.3
- Final chance to jump off

**Phase 3 — TIMED_PLATFORM_DISAPPEAR (at 3.5s disappear moment):**
- Snap/dissolve: filtered noise burst + high sine sweep down, 0.2s

---

## 6. Level 5 Audio-Visual Sync Matrix

| Visual Event | Zone | Audio Trigger | Timing |
|-------------|------|--------------|--------|
| Level 5 entry | A | Base ambient warm-variant | Immediate |
| Crystal collection | A/B/C | `CRYSTAL` (warm) | On contact |
| Checkpoint activation | A/B | `CHECKPOINT` | On contact |
| Moving platform warning | A/B | `MOVING_PLATFORM_WARNING` | 15% range, per-platform pan |
| Timed platform phase 1 | B | `TIMED_PLATFORM_WARNING` | 3.0s mark |
| Timed platform vanish | B | `TIMED_PLATFORM_DISAPPEAR` | 3.5s mark |
| Key collection (gold/red/blue) | B | `KEY_COLLECT` | On contact, tri-tone pitch |
| Vault door (incomplete keys) | C | `DOOR_LOCKED` | On approach with <3 keys |
| Vault door (all keys) | C | `DOOR_UNLOCK` → `VAULT_ACTIVATE` | Sequential |
| Zone C entry | C | `ZONE_C_AMBIENT_START` | 2s fade-in on entry |
| Spike death | B/C | `SPIKE_DEATH` | On contact |
| Exit portal | C | `LEVEL_COMPLETE` | On contact |
| Victory screen | — | `VICTORY_STING` | On victory screen fade-in |

---

## 7. Integration Notes for Zephyr

### 7.1 Trigger Wiring Priority

Priority order for Level 5 wiring (prototype_v11.js):

1. **P0 — Blocking:**
   - `startZoneCAmbient()` / `stopZoneCAmbient()` — requires player position boundary check (Zone C entry detection)
   - `VICTORY_STING` — called from victory screen render

2. **P1 — High:**
   - `KEY_COLLECT` — wired for 3 key entities in level_05.json
   - `VAULT_ACTIVATE` — vault door open trigger at x=864, y=480
   - `DOOR_LOCKED` / `DOOR_UNLOCK` — key-count-based state detection

3. **P2 — Standard:**
   - All standard triggers (CRYSTAL, JUMP, LAND, SPIKE_DEATH, CHECKPOINT, LEVEL_COMPLETE)
   - Moving platform spatial warnings (4 platforms MP-H1/2, MP-V1/2)
   - Timed platform warnings (MP-T1, two-phase)

### 7.2 Zone C Entry Detection

Zone C entry boundary detection should trigger `startZoneCAmbient()`. Based on level_05.json:
- Zone C begins after the VAULT_DOOR at x=864
- The Sanctum Chamber is the Zone C region
- Entry detection: player enters the Zone C bounding box for the first time

```javascript
// Zone C entry detection (suggested logic):
if (player.enteredZoneC === false && player.x >= ZONE_C_LEFT_BOUNDARY) {
  AudioEngine.startZoneCAmbient();
  player.enteredZoneC = true;
}
```

### 7.3 Victory Screen Detection

`VICTORY_STING` should fire on victory screen display, not on portal entry. This requires a state flag:

```javascript
// Victory screen detection:
if (gameState === 'victory' && victoryStingFired === false) {
  trigger('VICTORY_STING');
  victoryStingFired = true;
}
```

---

## 8. Audio Asset Summary — Level 5

| Asset | Type | Synthesis | Duration | Status |
|-------|------|-----------|----------|--------|
| `ZONE_C_AMBIENT_START` | Continuous | Warm pad + shimmer + long reverb | Loop 60–90s | 🔲 In engine (v0.7) |
| `ZONE_C_AMBIENT_STOP` | Control | Fade-out stop | 1s | 🔲 In engine (v0.7) |
| `VICTORY_STING` | One-shot | C major arpeggio + reverb tail | 1.3s | 🔲 In engine (v0.7) |
| `KEY_COLLECT` | One-shot | Tri-tone ascending chime | 0.8s | ✅ In engine |
| `DOOR_LOCKED` | One-shot | Low resonant tone | 0.4s | ✅ In engine |
| `DOOR_UNLOCK` | One-shot | Bright harmonic sweep | 0.5s | ✅ In engine |
| `VAULT_ACTIVATE` | One-shot | Deep chord + shimmer | 1.5s | ✅ In engine |
| `MOVING_PLATFORM_WARNING` | One-shot | Spatial cave ping | 0.3s | ✅ In engine |
| `TIMED_PLATFORM_WARNING` | One-shot | Sharp urgent tone | 0.25s | ✅ In engine |
| `TIMED_PLATFORM_DISAPPEAR` | One-shot | Snap/dissolve noise | 0.2s | ✅ In engine |
| All standard triggers | Various | Reused | — | ✅ In engine |

---

## 9. Level 5 vs. Level 4 — Audio Comparison

| Attribute | Level 4 ("The Gauntlet") | Level 5 ("The Sanctum") |
|-----------|--------------------------|------------------------|
| Tone | Tense, Urgent, Punishing | Warm, Triumphant, Culminating |
| Timbre | Sharp, cold, short decays | Warm, resonant, long sustains |
| Harmonic character | Minor, dissonant tension | Major, consonant resolution |
| Zone C ambient | Cold stone base | Golden warmth pad |
| Death chime (Zone C) | Soft encouraging | Warm ascending鼓励 |
| Victory | LEVEL_COMPLETE only | VAULT_ACTIVATE + LEVEL_COMPLETE + VICTORY_STING |
| Moving platform density | 7+1 platforms | 4+1 platforms |
| Key system | None | 3 keys on detour paths |
| Vault mechanic | None | Central vault mechanic |
| Audio climax | Spike gauntlet tension | Three-key vault activation |

---

*Document version: 1.0 — 2026-04-24 — Cadenza (Audio Designer)*