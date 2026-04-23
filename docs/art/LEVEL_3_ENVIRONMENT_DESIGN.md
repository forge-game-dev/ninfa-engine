# Dungeon Runner — Level 3 Environment Design: Deepening

**Status:** Draft v0.1  
**Author:** Cedar (Environment Artist)  
**Date:** 2026-04-23  
**Prerequisite:** Vesper's Level 3 brief, GDD Section 3.3

---

## Level Concept: "Deepening"

Level 3 introduces keys and locked doors — the mechanic that forces backtracking and exploration. The environment must visually communicate locked vs. unlocked, key locations, and door progression.

**Core Design Intent:** Puzzle-platforming atmosphere. Rooms feel like treasure vaults — controlled, deliberate, with visual hierarchy pointing players toward keys.

---

## New Environment Elements

### Keys
- **Appearance:** Small, high-contrast, 8×8 or 16×16px visual
- **Color:** `#ffd700` (gold) — matches crystal palette, distinct from cyan player
- **Animation:** Gentle rotation/pulse (3-4 frames, slower than crystals)
- **Glow:** Soft gold halo, similar to crystal but warmer
- **Placement:** Visible but requires platforming to reach

### Locked Doors
- **Size:** 32×64px (1×2 tiles) — taller than standard platforms
- **States:**
  - Locked: Stone texture, iron bars, `#4a4a6a` base with `#7a7a7a` metal accents
  - Unlocked: Stone slides open / dissolves, passage clear
- **Visual language:** Locked doors should look heavy and significant — not just a wall

### Key Doors (color-coded by key)
- **Red door** → Red key
- **Blue door** → Blue key  
- **Gold door** → Gold key
- **Pattern:** Door color matches key color — players learn the system intuitively

---

## Color Palette Additions (Level 3)

| Element | Hex | Notes |
|---------|-----|-------|
| Key Gold | `#ffd700` | Primary key color |
| Key Red | `#ff4757` | Red level key |
| Key Blue | `#3498db` | Blue level key |
| Iron Bars | `#7a7a7a` | Door accents |
| Door Frame | `#5a5a8a` | Stone surrounding door |
| Unlocked Glow | `#50fa7b` | Door opening feedback |

**Total Level 3 palette:** 15 colors (up from 12 in Levels 1-2)

---

## Tileset Additions

### New Tile Types
1. **Key (3 variants):** `key_gold_00.png`, `key_red_00.png`, `key_blue_00.png`
2. **Door Locked (3 variants):** `door_red_locked_00.png`, `door_blue_locked_00.png`, `door_gold_locked_00.png`
3. **Door Open:** `door_open_00.png` (transparent passage)
4. **Vault Walls:** Reinforced stone sections suggesting treasure rooms
5. **Hidden alcoves:** Platform variations that suggest secret areas

### Tileset Structure
```
docs/art/tilesets/level_3/
├── platforms/
├── doors/          ← NEW: key doors + open state
├── keys/           ← NEW: collectible keys
├── vault_walls/    ← NEW: reinforced stone
└── backgrounds/
```

---

## Background Design

### Parallax Layers (3 layers)
- **Layer 0 (far):** Ancient stonework, carved pillars, faded murals — suggests old civilization
- **Layer 1 (mid):** Vault arches, locked cabinet silhouettes, stone patterns
- **Layer 2 (near):** Hanging chains, key-shaped shadows, decorative ironwork

### Mood
- More enclosed than Level 2 (less water/open space)
- Warmer lighting — torches more prominent, amber tones
- Sense of discovery — rooms feel like they contain secrets

---

## Zone Breakdown (Conceptual)

**Zone A — The First Lock**
- Single key, single door, straightforward path
- Tutorial: player learns key → door connection
- Warm torch lighting, amber undertones

**Zone B — The Maze**
- Multiple doors, keys placed in non-linear layout
- Requires backtracking and exploration
- Mood shifts slightly cooler to blue-grey

**Zone C — The Vault**
- High-value area — challenging platforming to reach
- Multiple key types, complex door sequence
- Climactic visual: large ornate doors, premium stone textures

---

## Animation Notes

### Key Animation
- Rotation: 4 frames, 400ms per frame (1.6s loop)
- Glow pulse: synced to rotation cycle
- Collection: brief flash + particle burst (audio: key collect SFX)

### Door Animation
- Locked: subtle shimmer on iron bars (2 frames, 1s loop)
- Unlocking: bars retract + stone slides (3 frames, 300ms total)
- Open: empty frame, no animation

---

## Audio-Visual Coordination

- **Key collect:** Audio chime + visual flash + particle burst
- **Door unlock:** Stone grinding SFX + visual retraction
- **Key proximity:** Soft glow intensifies as player approaches
- **Ambience:** Layer 3 music intensifies near locked doors (anticipation)

---

## Sync with Other Roles

| Role | Coordination Point |
|------|---------------------|
| Kairo | Key character animation (if key has owner) |
| Zephyr | Key/door tile loading in prototype_v5.js |
| Cadenza | Key collect SFX, door unlock audio |
| Vesper | Key/door placement in level JSON |

---

**Next:** Awaiting Vesper's full Level 3 brief for placement specifics. Tile production pending sprite tools resolution.
