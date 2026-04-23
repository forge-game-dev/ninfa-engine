# Dungeon Runner — Level 3 Environment Design: Deepening

**Status:** Updated v0.2  
**Author:** Cedar (Environment Artist)  
**Date:** 2026-04-23  
**Sources:** Vesper GDD Appendix C, Level 3 brief alignment

---

## Level Concept: "Deepening"

Puzzle-platforming level introducing keys, locked doors, timed sequences, and pressure plates. Three zones with escalating complexity. Visual language must clearly distinguish permanent locks (key doors) from temporary barriers (timed doors).

---

## Zone Breakdown (Updated with Vesper Brief)

### Zone A — The First Lock
- 5 crystals, gold/red/blue key system
- No time pressure — mechanic tutorial
- Checkpoint at entry
- 3 keys + 3 locked doors (one per color)

### Zone B — The Maze  
- 6 crystals, timed doors (4 seconds baseline)
- Crystal switches + pressure plates (2 simultaneous)
- Checkpoint after timed sequence completion
- Checkpoint at entry (from Zone A)
- No checkpoint in Zone B mid-section — intentional difficulty

### Zone C — The Vault
- 3 crystals, locked final exit
- Requires all 3 keys collected
- Victory screen triggers here
- No checkpoint — intentional difficulty

**Crystal scope:** 14 total, 10 required for gate (70%)

---

## New Tile Types (Per Zone)

### Zone A Tiles
- Key (gold/red/blue): 16×16px, rotation animation 4f @ 400ms
- Locked door (gold/red/blue): 32×64px, locked shimmer + unlock animation

### Zone B Tiles
- **Timed door**: 32×64px, visual countdown indicator (4s → 0)
  - Color shifts from neutral to amber as time runs out
  - Visual urgency increases at <2s remaining
  - States: open / closing / timed / forcing-open
- **Pressure plate**: 32×16px, 2 plates simultaneously required
  - Visual: recessed stone that depresses when activated
  - States: inactive (raised), active (pressed), connected glow line
- **Crystal switch**: Trigger zone that activates when crystal collected
  - Visual: subtle activation glyph on adjacent wall

### Zone C Tiles  
- **Triple-key vault door**: Larger ornate door (64×64px)
  - Shows 3 key slots (gold/red/blue icons)
  - All 3 slots glow when player has all keys
  - Victory animation: doors part + golden light spill

---

## Color Palette (Updated)

| Element | Hex | Zone |
|---------|-----|------|
| Background | `#1a1a2e` | All |
| Platform Base | `#4a4a6a` | All |
| Key Gold | `#ffd700` | A |
| Key Red | `#ff4757` | A |
| Key Blue | `#3498db` | A |
| Door Locked | `#7a7a7a` | A |
| Timed Door (neutral) | `#5a5a8a` | B |
| Timed Door (warning) | `#ff9f43` | B |
| Timed Door (urgent) | `#ff4757` | B |
| Pressure Plate | `#5a5a8a` | B |
| Pressure Plate Active | `#50fa7b` | B |
| Vault Frame | `#3a3a5a` | C |
| Vault Door | `#6a6aaa` | C |
| Victory Gold | `#ffd700` | C |
| **Total** | **16 colors** | |

---

## Tileset Structure

```
docs/art/tilesets/level_3/
├── platforms/
├── backgrounds/
├── keys/
│   ├── key_gold_00.png → key_gold_03.png  (4 frames)
│   ├── key_red_00.png → key_red_03.png
│   └── key_blue_00.png → key_blue_03.png
├── doors/
│   ├── door_gold_locked_00.png → door_gold_open_00.png
│   ├── door_red_locked_00.png → door_red_open_00.png
│   ├── door_blue_locked_00.png → door_blue_open_00.png
│   ├── timed_door_neutral_00.png
│   ├── timed_door_warning_00.png
│   └── timed_door_urgent_00.png
├── pressure_plates/
│   ├── plate_inactive_00.png
│   ├── plate_active_00.png
│   └── plate_glow_line_00.png
├── crystal_switches/
│   └── switch_glyph_00.png
├── vault/
│   ├── vault_door_00.png (3 slots empty)
│   ├── vault_door_ready_00.png (all slots lit)
│   └── vault_door_open_00.png
└── parallax/
    ├── layer0_vault_far.png
    ├── layer1_vault_mid.png
    └── layer2_vault_near.png
```

---

## Animation Timing

| Element | Frames | Duration | Behavior |
|----------|--------|----------|----------|
| Key rotation | 4 | 400ms/f (1.6s loop) | Continuous |
| Key collect | 3 | 100ms/f | Plays once |
| Door unlock | 3 | 100ms/f | Plays once |
| Door open | 2 | 200ms/f | Plays once |
| Timed door countdown | 4 | 1000ms/f | Synced to game timer |
| Pressure plate press | 2 | 200ms/f | Plays once |
| Pressure plate release | 2 | 300ms/f | Plays once |
| Vault door open | 5 | 200ms/f | Plays once |
| Victory glow pulse | 4 | 500ms/f | Continuous |

---

## Audio-Visual Sync (Cadenza Coordination)

| Visual Event | Audio Trigger |
|--------------|---------------|
| Key collect | KEY_COLLECT |
| Key door unlock | DOOR_UNLOCK |
| Timed door close warning | TIMED_DOOR_WARNING |
| Crystal switch activate | CRYSTAL_SWITCH |
| Pressure plate engage | PRESSURE_PLATE |
| Vault door open | DOOR_UNLOCK (vault variant) |
| Victory screen | LEVEL_COMPLETE |

---

## Background Design

**Zone A:** Warm torch lighting, amber undertones — reassuring, tutorial mood
**Zone B:** Cool blue-grey shift, pressure plate glow (#50fa7b), urgent amber for timed doors
**Zone C:** Dramatic golden lighting, vault framing, victory anticipation

**Parallax layers (3 per level, matching Level 1-2 structure):**
- Layer 0 (far): Ancient stonework, key-shaped shadows, faded symbols
- Layer 1 (mid): Vault arches, mechanical door silhouettes, chain details
- Layer 2 (near): Key pedestals, glowing pressure plate conduits, ornate door frames

---

## Visual Hierarchy for Playability

1. Keys — high contrast, warm glow, always visible
2. Timed doors — countdown visual is unobtrusive but readable
3. Pressure plates — glow line shows connection to linked barrier
4. Checkpoint placement — clearly visible from approach angle
5. Exit portal — dramatic, unmistakable in Zone C

---

## Sync Points

| Role | Coordination |
|------|-------------|
| Vesper | Crystal positions, zone flow, gate logic from Appendix C |
| Zephyr | Tile loading, timed door timer sync, pressure plate state |
| Cadenza | KEY_COLLECT, DOOR_UNLOCK, TIMED_DOOR_WARNING, CRYSTAL_SWITCH, PRESSURE_PLATE |
| Kairo | Any character interaction with keys/doors (if applicable) |
| Verin | Visual clarity test for timed door countdown, pressure plate connection |

---

**Next:** Awaiting Vesper's Appendix C crystal positions for tile production specs. PNG production blocked — standby.
