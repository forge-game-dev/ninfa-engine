# Dungeon Runner — Level 5 Design Brief: "The Sanctum"
**Status:** DRAFT v0.1 — Awaiting Nicolas approval to proceed
**Author:** Vesper (Game Designer)
**Date:** 2026-04-23
**Version:** Ready for review pending Nicolas's game genre direction

---

## Concept: "The Sanctum"

The final level. Not the hardest — The Gauntlet (Level 4) holds that title. The Sanctum is the *reward*: a level that asks players to demonstrate mastery of everything they've learned, but rewards that mastery with visual spectacle, emotional payoff, and a satisfying conclusion.

After the precision brutality of The Gauntlet, The Sanctum offers something different: narrative weight. This is the heart of the dungeon — ancient, powerful, earned. The player isn't just clearing a level; they're claiming something.

**Design intent:** Climactic finale that synthesizes all 4 previous levels into one final run. Mechanics from all levels return, but no new mechanics are introduced. Mastery is tested, not taught.

---

## Zone Breakdown

### Zone A — The Approach
- **Crystals:** 4
- **Mechanics revisited:** Basic platforming (L1), water channel (L2)
- **Mood:** Calm before the storm — player catches breath after The Gauntlet
- **Checkpoint:** Entry only
- **Purpose:** Re-orient the player to a less aggressive pace before the finale

### Zone B — The Convergence
- **Crystals:** 6
- **Mechanics revisited:** Moving platforms (L2/L4), key locks (L3), spike corridors (L4)
- **Checkpoint:** After Zone B midpoint — earned after navigating combined gauntlet
- **Purpose:** Tests whether the player can chain skills — platform timing while tracking keys while avoiding spikes. This is the "greatest hits" zone.
- **Key placement:** 3 keys (gold/red/blue) scattered across challenging platform sequences. Collecting all 3 requires detours from the main path.

### Zone C — The Sanctum Chamber
- **Crystals:** 4
- **Mechanics revisited:** Timed platform (L4), all 3 keys required to open final vault
- **Checkpoint:** None — this is the final run
- **Purpose:** Single-path precision sequence leading to the vault door. All 3 keys must be in inventory. The vault opens with VAULT_ACTIVATE (L3 audio). Victory screen triggers on portal entry.
- **Special:** Ambient lighting shifts to golden/warm tones as player approaches vault — visual payoff for progress

**Total:** 14 crystals, 10 required for gate (70%) — same gate as Level 3. Easier than Level 4 (75%) intentionally — finale should be challenging but not cruel.

**Checkpoints:** 2 total — Zone A entry, Zone B midpoint. None in Zone C.

---

## Difficulty Rationale

Level 4 (The Gauntlet) is the hardest level in the game. Level 5 is easier *by design*:

- Players who reach Level 5 have already proven mastery through Level 4
- A harder-than-L4 finale would feel punishing, not rewarding
- The Sanctum tests *breadth* of skill (all mechanics combined) rather than raw difficulty
- The emotional arc needs relief before the climax — Zone A provides that

Gate at 70% matches Level 3 because the keys add natural progression gating (must collect 3 specific keys regardless of crystal count).

---

## New Audio Triggers

| Trigger | Event | Design Intent |
|---------|-------|---------------|
| VAULT_ACTIVATE | Vault door opens (L3 trigger, reused) | Climactic payoff — deep resonant chord, 1.2s |
| ZONE_C_AMBIENT | Player enters Zone C | Shift to warm/golden audio tones — emotional shift |
| VICTORY_STING | Victory screen | Short fanfare, closure moment |

---

## Art Direction Notes (for Kairo/Cedar)

**Level 5 visual theme:** Ancient, powerful, sacred.
- Lighting: warmer gold undertones (#ff9f43 range) — shift from cool blue dungeon palette
- Background: richer stone textures, possible ancient carvings implied through shape language
- Zone C: golden ambient light bleeding into the scene as player approaches vault
- Vault door: 3-key mechanism, ornate frame — largest/most detailed prop in the game

**Palette shift:** Level 5 introduces warm accent colors (#ff9f43, #ffd700) as visual reward. No new base colors — warm shift applied through lighting/atmosphere only.

---

## Level 5 in the GDD

This level will be documented as **Appendix E** in the GDD once approved by Nicolas. Crystal positions, key placements, and checkpoint coordinates will be added to the appendix following Nicolas's confirmation.

---

## Open Questions for Nicolas

1. **Genre confirmation:** Platform/Puzzle confirmed for Levels 1-4. Level 5 finale can finalize in same genre. Any expansion direction for the full game beyond the 5-level vertical slice?
2. **Victory sequence:** Is there a post-credits state? Level complete screen + what happens next?
3. **Level 5 difficulty curve:** Confirm that Level 5 should be easier than Level 4 (my design intent: yes, Level 4 = hardest, Level 5 = climactic mastery). Any adjustment to the gate percentage?
4. **Replay value:** Should Level 5 have a hidden collectible or optional challenge for players who want more after clearing the gate?
