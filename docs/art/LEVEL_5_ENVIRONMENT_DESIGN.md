# Dungeon Runner — Level 5 Environment Design: The Sanctum

**Status:** v0.2 — Design + spatial wiring notes — Design decisions locked, awaiting Nicolas approval for production  
**Author:** Cedar (Environment Artist)  
**Date:** 2026-04-23  
**Source:** Vesper Level 5 brief (SHA ec7078b), GDD alignment

---

## Level Concept: "The Sanctum"

The finale. Not harder than Level 4 — The Gauntlet holds that title. The Sanctum is the *reward*: a level that asks players to demonstrate mastery of everything learned, then delivers visual spectacle and emotional payoff.

**Design intent:** Climactic synthesis of all 5 levels. No new mechanics introduced. Zone A re-orients, Zone B chains skills, Zone C delivers the moment.

---

## Zone Breakdown

### Zone A — The Approach (4 crystals)
- **Mechanics:** Basic platforming + water channel (from Level 2)
- **Mood:** Calm before the storm — player catches breath after The Gauntlet
- **Checkpoint:** Entry only
- **Atmosphere:** Ancient stone, moss, still water — ancient dungeon entrance

### Zone B — The Convergence (6 crystals)
- **Mechanics:** Moving platforms + key locks + spike corridors (from L2/L3/L4)
- **Checkpoint:** After Zone B midpoint
- **Mood:** Greatest hits — platform timing while tracking keys while avoiding spikes
- **Key placement:** Gold/Red/Blue keys scattered across challenging sequences

### Zone C — The Sanctum Chamber (4 crystals)
- **Mechanics:** Timed platform + all 3 keys required to open final vault
- **Checkpoint:** None — intentional final test
- **Mood:** Ancient, powerful, sacred. Visual reward for mastery.
- **Special:** Golden ambient light bleeds into scene as player approaches vault

**Total:** 14 crystals | **Gate:** 10 required (70%) | **Checkpoints:** 2

---

## Visual Theme: Ancient, Powerful, Sacred

**Core concept:** Warm golden palette (#ff9f43, #ffd700) as reward signal — shift from cool blue dungeon tones of Levels 1-4.

**Palette shift by zone:**
- Zone A: Same cool dungeon palette as Levels 1-2, with richer stone texture
- Zone B: Transition — hints of amber begin to appear
- Zone C: Full golden shift — warm undertones, ambient glow, sacred geometry

---

## Color Palette Additions (Level 5 only)

### Ancient Stone Family
| Name | Hex | Use |
|------|-----|-----|
| ancient_dark | #2a2a3e | Darkest ancient stone, Zone C dominant |
| ancient_base | #3a3a5a | Base ancient stone, all zones |
| ancient_mid | #4a4a6a | Mid-tone stone texture |
| ancient_light | #5a5a7a | Highlight stone edges |
| ancient_gold_tint | #5a5040 | Subtle gold warming in stone |

### Golden Accent Family (Zone C reward signal)
| Name | Hex | Use |
|------|-----|-----|
| gold_ambient | #ff9f43 | Zone C ambient light bleed |
| gold_bright | #ffd700 | Vault glow, key highlights |
| gold_deep | #cc9900 | Vault interior, deep gold |
| gold_light | #ffe066 | Vault light spill, victory rays |

### Ancient Texture Details
| Name | Hex | Use |
|------|-----|-----|
| carved_line | #5a5a8a | Ancient carving lines on walls |
| moss_gold | #3a5a2a | Moss on ancient stone (slight warm shift from L2) |

**No new base colors** — Level 5 warm palette is a reward layer applied through lighting/atmosphere. Core stone family stays consistent with Levels 1-4.

---

## Tileset Inventory

### Platform Tiles — `platforms/`
Reused from Levels 1-4 (no new platform types):
- `platform_static_00.png` (L1) — Zone A/B static platforms
- `platform_mp_h_00.png` (L4) — Zone B moving platforms
- `platform_mp_v_00.png` (L4) — Zone B vertical platforms
- `platform_timed_00.png` (L4) — Zone C timed platform (3s)
- `platform_timed_warning_00.png` (L4) — Zone C timed platform warning
- `platform_timed_gone_00.png` (L4) — Zone C timed platform disappeared

### Hazard Tiles — `hazards/`
Reused from Levels 2 and 4:
- Water tiles: `water_surface_a/b.png`, `water_deep.png`, `water_edge.png` (L2)
- Spike tiles: `spike_floor_00.png`, `spike_ceiling_00.png` (L4)

### Key Tiles — `keys/` (from Level 3)
- `key_gold_00.png → key_gold_03.png` — 4-frame rotation @ 400ms/f
- `key_red_00.png → key_red_03.png` — same timing
- `key_blue_00.png → key_blue_03.png` — same timing

### Door Tiles — `doors/` (from Level 3)
- `door_gold_locked_00.png` — shimmer, locked state
- `door_gold_open_00.png` — open state
- `door_red_locked_00.png`, `door_red_open_00.png`
- `door_blue_locked_00.png`, `door_blue_open_00.png`

### Vault Tiles — `vault/` (NEW — Level 5 exclusive)
- `vault_door_locked_00.png` — 64×64px, 3 empty key slots, ornate frame
- `vault_door_ready_00.png` — all 3 slots glow gold, player has all keys
- `vault_door_open_00.png` — doors part, golden light spill outward
- `vault_frame_00.png` — ornate stone frame, ancient carvings

### Parallax Background — `backgrounds/` (3 layers)
- `layer0_ancient_stone.png` — faint carved texture, 0.1x parallax
- `layer1_golden_transition.png` — subtle warm tint increases left-to-right, 0.3x parallax
- `layer2_zone_c_golden.png` — golden ambient glow layer, Zone C only, 0.5x parallax

**Total unique tiles:** 28 (18 inherited + 7 new vault/ancient + 3 BG layers)

---

## Vault Door (Most Detailed Prop in Game)

**Design philosophy:** The vault door is the visual climax. More detail than any other prop — ornate frame, carved symbols, 3-key mechanism, dramatic opening animation.

**Locked state:**
- 64×64px ornate stone/bronze frame
- 3 key slots visible (gold/red/blue icons)
- Carved ancient symbols radiating from center
- Subtle ambient shimmer on key slots

**Ready state (player has all 3 keys):**
- All 3 key slots glow gold simultaneously
- Carved symbols pulse faintly
- Visual invitation: "you're ready"

**Opening animation (3 frames):**
- Frame 1 (100ms): Key slots flash white, click sound
- Frame 2 (200ms): Doors part slightly, golden light begins spilling
- Frame 3 (300ms): Full open, golden rays fill frame, VAULT_ACTIVATE plays

---

## Audio-Visual Sync (Cadenza)

| Visual Event | Audio Trigger |
|--------------|---------------|
| Key collect (gold/red/blue) | KEY_COLLECT (pitched per color) |
| Zone B locked door | DOOR_LOCKED / DOOR_UNLOCK |
| Zone B timed door warning | TIMED_DOOR_WARNING |
| Zone C ambient entry | ZONE_C_AMBIENT (warm shift begins) |
| Vault door ready | Subtle resonance (all keys present) |
| Vault door open | VAULT_ACTIVATE (1.2s deep chord + shimmer sweep) |
| Victory screen | VICTORY_STING (short fanfare) |
| Zone A checkpoint | CHECKPOINT |
| Zone B checkpoint | CHECKPOINT |
| Level 5 exit portal | LEVEL_COMPLETE |

### Spatial Audio Wiring Notes (for Zephyr)
Level 5 uses both spatial warning APIs for multi-platform sequences:

- **Zone B (The Convergence):** Moving platforms across complex sequences — `triggerSpatialWarning(panValue)` should be called per-platform on the game loop, panning based on platform screen position (left = -1 to right = +1). Player must distinguish between 2-3 simultaneous platforms.
- **Zone C (The Sanctum Chamber):** 3-second timed platform — `triggerSpatialTimedWarning(panValue)` called at T=2.0s when platform starts warning visual, gives player 1s advance notice before `TIMED_PLATFORM_DISAPPEAR`.
- **prototype_v6.js status:** Spatial API calls currently not wired — Zephyr to add in engine update cycle. Audio engine v0.7 confirmed to have both functions available.

### Zone B — Platform Timing Reference
Moving platform speeds in Zone B: 2–4 u/s per Vesper's brief. Suggested integration:
- On platform velocity change (direction flip): triggerSpatialWarning
- Pan value = (platform.x / canvasWidth) * 2 - 1

### Zone C — Timed Platform Sequence
At T=0.0s: Platform solid, TIMED_PLATFORM_WARNING visual active
At T=2.0s: `triggerSpatialTimedWarning` fires, player gets 1s warning
At T=3.0s: Platform disappears, player dies if still standing

| Visual Event | Audio Trigger |
|--------------|---------------|
| Key collect (gold/red/blue) | KEY_COLLECT (pitched per color) |
| Zone B locked door | DOOR_LOCKED / DOOR_UNLOCK |
| Zone B timed door warning | TIMED_DOOR_WARNING |
| Zone C ambient entry | ZONE_C_AMBIENT (warm shift begins) |
| Vault door ready | Subtle resonance (all keys present) |
| Vault door open | VAULT_ACTIVATE (1.2s deep chord + shimmer sweep) |
| Victory screen | VICTORY_STING (short fanfare) |
| Zone A checkpoint | CHECKPOINT |
| Zone B checkpoint | CHECKPOINT |
| Level 5 exit portal | LEVEL_COMPLETE |

---

## Palette Progression Visual Reference

| Level | Dominant Palette | Mood |
|-------|-----------------|------|
| 1 | #1a1a2e cold blue | Awakening |
| 2 | #1a2d3e + water blue | Descent |
| 3 | #4a4a6a + colored keys | Deepening |
| 4 | #ff4757 danger red | Gauntlet |
| 5 | #ffd700 gold reward | Sanctum |

**Visual arc:** Cold → wet → complex → dangerous → GOLDEN. Level 5 golden shift is the payoff for the entire color journey.

---

## Sync Points

| Role | Deliverable |
|------|-------------|
| Vesper | Appendix E crystal/key positions, gate logic |
| Zephyr | Vault door engine (3-slot key check), golden light bleed in Zone C |
| Cadenza | ZONE_C_AMBIENT, VICTORY_STING, VAULT_ACTIVATE timing |
| Kairo | Vault door concept art (if needed for refinement) |
| Verin | Zone C golden glow effect QA, vault door key validation |

**Status:** Design decisions locked. Awaiting Nicolas approval for production start.
