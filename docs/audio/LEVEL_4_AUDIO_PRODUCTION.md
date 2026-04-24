# Level 4 Audio Production Guide
**Author:** Cadenza (Audio Designer)  
**Project:** Dungeon Minimalista — ninfa-engine  
**Date:** 2026-04-24  
**Status:** Production-ready  
**Level:** Level 4 — "The Gauntlet"

---

## 1. Design Context

**Level Theme:** Tense, Urgent, Punishing Precision  
**Visual Direction:** Spike gauntlet, moving platforms, no checkpoints in Zone A/B  
**Mechanic Profile:** Spike zones, 7 moving platforms, 1 timed platform, precision platforming

**Audio Role:** Level 4 audio must maintain tension without becoming sonically exhausting. The constant threat of spike death and the relentless pace of moving platforms require a careful balance — the audio should amplify urgency and reward without contributing to player fatigue.

**Level 4 vs. Level 3 Tone Shift:** Level 3 introduced ancient mechanism (gears, clockwork, heavy stone doors). Level 4 is pure mechanical precision — tighter, faster, more hostile. Audio reflects this: sharper timbres, shorter decays, faster rhythmic pulse. Where L3 felt "ancient machine," L4 feels "lethal machine."

---

## 2. Zone Breakdown

### Zone A — Spike Alley (Entry)
| Attribute | Value |
|-----------|-------|
| Crystals | 4 (C-01–C-04) |
| Checkpoints | 0 |
| Mechanics | Static spike fields, basic platforming |
| Gate contribution | 4/16 (25%) |

**Audio intent:** Immediate tension on entry. No warm-up. Player hears the threat before they see it. Ambient is thin and cold — minimal drone, focused SFX clarity.

**Crystals:** C-01 through C-04 (first 4 of the 16 total). Standard crystal SFX (`CRYSTAL` trigger). No zone-specific variants.

**No-checkpoint policy:** Zone A has no checkpoint. Zone A is short — player dies here, they respawn at the level entrance with no penalty beyond lost time. Death chime should be brief and non-punishing.

---

### Zone B — Platform Gauntlet (Core)
| Attribute | Value |
|-----------|-------|
| Crystals | 8 (C-05–C-12) |
| Checkpoints | 2 |
| Mechanics | 7 moving platforms (3–4 u/s horizontal, 2 u/s vertical), 1 timed platform (3s active → 0.5s warning → 1.5s disappear → 1.5s respawn), 2 checkpoints |
| Gate contribution | 8/16 (50%) |

**Audio intent:** The heart of Level 4. Seven moving platforms create constant motion — their audio presence must be spatially legible (player knows which platform is moving and where). Two checkpoints provide relief but the stakes between them are high.

**Moving Platforms (7 total):**
- MP-H1 through MP-H4: horizontal, 3–4 u/s
- MP-V1 through MP-V3: vertical, 2 u/s
- Amber chevron markers indicate direction

**Timed Platform (1 total):**
- 3s active → 0.5s warning tone → 1.5s disappear → 1.5s respawn cycle
- Two-phase warning system: MOVING_PLATFORM_WARNING fires first (0.5s before disappear), TIMED_PLATFORM_WARNING fires second (fires alongside the visual flash)

**Checkpoints:** CPK-01 and CPK-02. Standard checkpoint activation SFX. First checkpoint marks 50% of Level 4 gate — psychologically significant. Audio should feel like a breath of relief, not celebration (save that for Level 5).

**Crystals:** C-05 through C-12. Standard collection SFX. No special audio variants.

---

### Zone C — The Crucible (Finale)
| Attribute | Value |
|-----------|-------|
| Crystals | 4 (C-13–C-16) |
| Checkpoints | 0 |
| Mechanics | Combined gauntlet — all hazard types, precision finale |
| Gate contribution | 4/16 (25%) |
| No-checkpoint policy | ACTIVE — no checkpoint before or within Zone C |

**Audio intent:** No-checkpoint finale. This is the most stressful zone in the game. Audio here must be tight, clear, and confidence-building. The reward for surviving Zone C is the exit portal and the transition to Level 5 — Zone C audio should feel like the final test, not punishment.

**Crystals:** C-13 through C-16. Standard collection SFX.

**No-checkpoint policy (Zone C):** Death in Zone C sends player back to the level start (or CPK-02 if they reached it). The no-checkpoint zone is psychologically punishing even when audio is good. Key principle: Zone C death audio should never feel final or definitive — a soft, brief tone suggesting "try again" rather than "game over."

**Design note:** Recommend a softer death variant for Zone C — either a gentle descending tone (E4 → B3, 0.3s) or simply reuse `_playCheckpoint()` since the player was close to victory. Do NOT use the full death fanfare.

**Exit portal tone:** Standard `LEVEL_COMPLETE` trigger.

---

## 3. SFX Inventory — Level 4

### 3.1 Reused Standard Triggers

| Trigger | Function | Notes |
|---------|----------|-------|
| `JUMP` | Player jump | Orb glides — whoosh/pulse feel, short |
| `CRYSTAL` | Crystal collection | C-01 through C-16 — 16 total |
| `CHECKPOINT` | Checkpoint activation | CPK-01, CPK-02 — warm confirmation tone |
| `SPIKE_DEATH` | Spike death | Metallic hiss/impact — see distinction note below |
| `LEVEL_COMPLETE` | Exit portal / level clear | Standard victory sting + fade to L5 |

### 3.2 Level 4 Specific Triggers (New)

| Trigger | Function | Notes |
|---------|----------|-------|
| `MOVING_PLATFORM_WARNING` | Moving platform alert | 0.5s before platform action; cave reverb ping feel; per-platform stereo pan — NOT global |
| `TIMED_PLATFORM_WARNING` | Timed platform disappearing | Fires 0.5s before disappear; second-phase warning after MOVING_PLATFORM_WARNING |
| `TIMED_PLATFORM_DISAPPEAR` | Timed platform vanishes | Fires at disappear moment; distinct snap/dissolve sound |

---

## 4. Spatial Audio — Moving Platform Warnings

### 4.1 Per-Platform Stereo Panning

The moving platform warning system uses spatial audio to give the player directional information. Each platform fires its own warning with a pan value computed based on the platform's screen position relative to the player.

**API (per platform call):**
```javascript
// In platform update loop — per frame:
triggerSpatialWarning(platformX, player.x);

// Pan calculation (engine side):
const pan = Math.max(-1, Math.min(1, (platform.x - player.x) / (canvas.width / 2)));
```

**Implementation note:** `triggerSpatialWarning()` must be called from within each platform's update logic, not from a global handler. The pan value is computed at call time. Zephyr owns this wiring in `prototype_v9.js`.

**Behavior:** Warning fires once when player enters detection range (~1.5 units from platform center). If player moves away and returns, the warning can fire again.

**Tone character:** Cave reverb ping — short, ethereal ping with ~0.3s decay. 880Hz sine with slight 882Hz harmonic layer (creates ~2Hz beat). Purpose is directional information, not musical expression.

### 4.2 Timed Platform — Two-Phase Warning

The single timed platform has two distinct warning phases:

**Phase 1 — MOVING_PLATFORM_WARNING:**
- Fires when timed platform enters its warning state (3s active → 0.5s warning)
- Softer, first alert — player may still be on the platform
- 660Hz sine, 0.2s duration, volume 0.2

**Phase 2 — TIMED_PLATFORM_WARNING:**
- Fires 0.5s later, as platform begins to disappear
- Sharper, urgent — final chance to jump off
- 880Hz sine, 0.15s duration, volume 0.3

**Phase 3 — TIMED_PLATFORM_DISAPPEAR:**
- Fires at the moment of disappearance
- Distinct snap/dissolve sound — not just silence
- Layered: short high-frequency click (1kHz, 0.05s) + mid-frequency whoosh (500Hz bandpass sweep, 0.2s)

**Platform respawn:** No special SFX on respawn — the platform simply reappears. Player has already heard the two-phase warning cycle.

---

## 5. Spike Death vs. Drowning — Tonal Distinction

**Design question from Vesper (Q5):** Should drowning sound be clearly different from spike death?

**Answer: Yes — fundamentally different experiences.**

| Aspect | DROWN (Level 2) | SPIKE_DEATH (Level 4) |
|--------|----------------|-----------------------|
| **Timbre** | Liquid, resonant, pressure | Metallic, harsh, scraping |
| **Pitch** | Low-mid (60–220Hz dominant) | High-mid (2–4kHz dominant) |
| **Envelope** | Slow submersion (2–3s) | Instant impact (0.2–0.5s) |
| **Emotional** | Panic, entrapment, suffocation | Violence, sudden force, pain |
| **Visual pairing** | Bubbles rise, water distortion | Red flash, particle scatter |

**DROWN synthesis:** Low sine sweeps (900→220Hz), triangle harmonic layer (1350→330Hz), noise submersion rush (bandpass 500Hz), lowpass rumble tail (1200→120Hz), deep pressure sine (60→40Hz). Total duration ~2–3s with slow fade.

**SPIKE_DEATH synthesis:** High-frequency metallic impact (3kHz+), noise burst (white noise, 2kHz bandpass, sharp attack 0.1s), followed by decaying shimmer (4kHz sine, 0.4s). Visual: sharp red flash, particle scatter. Total duration ~0.5s.

**Intent:** DROWN feels like drowning in liquid (heavy, pressing, gradual). SPIKE_DEATH feels like instantaneous physical trauma (sharp, violent, immediate). Both are death — both end the level — but the emotional texture is entirely different.

---

## 6. No-Checkpoint Zones — Death Audio Policy

Level 4 has two no-checkpoint zones (Zone A and Zone C). Death audio in these zones must balance:

1. **Clarity:** Player needs to know they died
2. **Non-punishing tone:** Death chime should not feel like game over fanfare
3. **Quick recovery:** Audio should not delay the respawn — fast fade, no lingering reverb

**Zone A death:** Short descending tone (E4→B3, 0.2s). Brief, neutral. Player was just starting — no emotional weight.

**Zone C death:** Recommend softer descending tone (E4→B3, 0.3s) or reuse `_playCheckpoint()`. The player was close to victory — don't punish the attempt. The exit portal and L5 transition is the reward; death should feel like "almost" not "failed."

**Do not use:** Full death fanfare, long reverb tails, or minor-key defeat melodies in no-checkpoint zones. These belong in Level 3 Zone C (which also has no checkpoint, but has vault/victory context).

---

## 7. Level 4 → Level 5 Transition Audio

**Context:** After Level 4's tension (The Gauntlet), the player transitions to Level 5 (The Sanctum — warm, triumphant).

**Transition spec (confirmed with Vesper, Level 5 GDD):**
- Crossfade duration: 1.5–2s maximum
- Method: L4 tension music fades out as L5 warm pad fades in
- The shift should feel abrupt and relieving — not a gradual drift

**L4 end music:** Tension track (Level 4 music). Should NOT have a natural ending — it cuts. The abrupt cut to L5 warm pad is the emotional payoff.

**L5 start:** Zone C ambient warm golden pad (220Hz sine + 330Hz triangle) fades in over ~2s. No jarring jump — smooth relief.

**Implementation note for Zephyr:** The transition fires when `LEVEL_COMPLETE` trigger activates on exit portal. Ambient crossfade handled by `audioEngine.stopAmbient()` + `audioEngine.startAmbient('ZONE_C_AMBIENT')` with 2s gain ramp.

---

## 8. Ambient Audio — Level 4

Level 4 uses **no continuous ambient loop** — the level is too tense and spike-focused for a sustained drone. Ambient is event-driven:

| Event | Audio Response |
|-------|----------------|
| Player enters Zone B (Platform Gauntlet) | Subtle mechanical hum from moving platforms — 40Hz sine at very low volume (0.05), continuous while in Zone B |
| Player on moving platform | Platform ride tone — 80Hz triangle pulse synced to platform velocity |
| Player enters Zone C (The Crucible) | Tension layer rises — 110Hz sine + 220Hz triangle blend, volume 0.1, fades in over 1s |
| Player near spike zone | No audio warning — spikes are visual. Audio would create false safety/negativity association |

**Zone B platform hum:** Low, continuous, barely perceptible. Purpose: presence, not warning. The player hears that the world is mechanical and alive around them.

**Zone C tension layer:** Slightly higher in pitch than Zone B hum. Creates unconscious unease without being distracting. Player is focused on the gauntlet — ambient should support, not compete.

---

## 9. Integration Notes for Zephyr

### 9.1 Trigger Call Points in prototype_v9.js

| Trigger | Call Location | Condition |
|---------|---------------|-----------|
| `JUMP` | On jump input | Always |
| `CRYSTAL` | On crystal collection | 16 total (C-01–C-16) |
| `CHECKPOINT` | On checkpoint activation | CPK-01, CPK-02 |
| `SPIKE_DEATH` | On spike collision | Any spike zone |
| `MOVING_PLATFORM_WARNING` | Per-platform update loop | 7 platforms, 0.5s before action |
| `TIMED_PLATFORM_WARNING` | Timed platform state machine | Phase 2 of timed platform cycle |
| `TIMED_PLATFORM_DISAPPEAR` | Timed platform state machine | At disappear moment |
| `LEVEL_COMPLETE` | On exit portal activation | Level 4 clear |

### 9.2 Spatial Warning Wiring

The spatial warning system requires per-platform calls in the platform update loop:

```javascript
// Per platform — in platform update (called every frame):
if (platform.shouldWarn) {
  const pan = Math.max(-1, Math.min(1, (platform.x - player.x) / (canvas.width / 2)));
  audioEngine.triggerSpatialWarning(platform.x, player.x, pan);
  platform.shouldWarn = false; // Reset after firing
}
```

**Important:** `triggerSpatialWarning` is per-platform, not global. Each platform instance independently computes its pan and fires its own warning. This is essential for spatial legibility — the player must be able to tell which platform is warning.

### 9.3 Timed Platform State Machine

```javascript
// Timed platform cycle:
// 3.0s active → 0.5s warning (TIMED_PLATFORM_WARNING) → 1.5s disappear → 1.5s respawn
// MOVING_PLATFORM_WARNING fires during the 0.5s warning window
// TIMED_PLATFORM_WARNING fires at the start of the 1.5s disappear window
// TIMED_PLATFORM_DISAPPEAR fires at the exact moment of disappear

if (timedPlatform.state === 'warning') {
  audioEngine.trigger('TIMED_PLATFORM_WARNING');
  timedPlatform.state = 'disappearing';
} else if (timedPlatform.state === 'disappearing') {
  audioEngine.trigger('TIMED_PLATFORM_DISAPPEAR');
  timedPlatform.state = 'respawning';
}
```

---

## 10. Audio-Visual Sync Matrix

| Visual Element | Audio Response | Sync Requirement |
|---------------|----------------|------------------|
| Crystal collection (any) | CRYSTAL trigger fires | Immediate (< 50ms) |
| Checkpoint activation | CHECKPOINT trigger + visual glow | Immediate + 0.2s glow linger |
| Spike death | SPIKE_DEATH + red flash + particles | Immediate |
| Moving platform warning chevron | MOVING_PLATFORM_WARNING fires | Chevrons flash at 2Hz — audio syncs to first flash |
| Timed platform warning (Phase 1) | MOVING_PLATFORM_WARNING fires | 0.5s before disappear |
| Timed platform warning (Phase 2) | TIMED_PLATFORM_WARNING fires | At start of disappear window |
| Timed platform vanish | TIMED_PLATFORM_DISAPPEAR fires | At exact vanish frame |
| Exit portal activation | LEVEL_COMPLETE fires | Immediate |
| Zone C entry | Tension layer fades in | 1s fade in |

---

## 11. Level Gate Audio Feedback

**Gate:** 12/16 crystals required (75%)

The audio system should support the player in understanding their progress toward the gate without explicit UI. Crystal collection SFX (`CRYSTAL`) provides natural feedback — each collectible gives a clear audio ping.

**Midpoint feedback (8 crystals — 50%):** Player reaches CPK-02 (second checkpoint) when they have 8 crystals. The checkpoint activation tone (`CHECKPOINT`) serves as a natural mid-gate reminder: "You're halfway and you have a save point." This is not gate-gating — it's milestone reinforcement.

**Gate approach (11 crystals — 68.75%):** No special audio. The player is close — let anticipation build naturally.

**Gate clear (12th crystal):** Standard crystal SFX. The gate opening itself has no audio trigger in the current spec — the exit portal activation (`LEVEL_COMPLETE`) fires when the player reaches the portal. If the portal itself needs audio, this is a potential addition for Phase 2.

---

## 12. Summary

**Level 4 audio production scope:**
- 7 spatial moving platform warnings (per-platform pan)
- 1 timed platform with 2-phase warning + disappear sound
- 16 crystal collection SFX (reused CRYSTAL trigger)
- 2 checkpoint activation SFX (reused CHECKPOINT trigger)
- 1 spike death SFX (reused SPIKE_DEATH trigger)
- 1 level complete sting (reused LEVEL_COMPLETE trigger)
- No-checkpoint death audio for Zone A (soft, brief) and Zone C (soft, encouraging)
- Zone B platform hum (subtle continuous 40Hz drone)
- Zone C tension layer (110Hz + 220Hz blend, fades in)
- L4→L5 transition crossfade (1.5–2s, abrupt relief)

**Blocking dependencies:** None — all Level 4 audio is implemented in audio_engine.js. Awaiting Zephyr wiring of `triggerSpatialWarning()` calls in prototype_v9.js platform update loop.

**Cedar coordination:** Spike tiles (Cedar) + spike death SFX (Cadenza) visual/audio pairing confirmed. DROWN production replacement already in repo.