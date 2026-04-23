# Dungeon Runner — Level 1 Mood Board
## "Awakening" — The Tutorial Dungeon

**Status:** Draft v0.1 | **Author:** Cedar | **Date:** 2026-04-22
**Based on:** GDD v1.0, Section 4.5 | **Sync:** Kairo (pending character concept)
**Type:** Environment direction document — visual intent, not final art

---

## 1. Atmosphere Intent

Level 1 "Awakening" must feel **welcoming, ancient, and safe**. 
The player is learning — the dungeon should feel like a curious place to explore, not a hostile arena.

**Primary mood:** Ancient underground chamber — recently discovered. 
**Secondary mood:** Warm torchlight against cool stone. 
**Tertiary mood:** Moss growing, chains hanging — history and life present even underground.

**Emotional arc for Level 1:** "You are small, but the light is warm."

---

## 2. Color Application for Level 1

### Dominant Colors (highest screen presence)
- `--bg-dark` `#1a1a2e` — 60% of visible area (walls, deep background)
- `--bg-mid` `#2a2a4e` — 20% of visible area (mid-layer parallax)
- `--stone-warm` `#4a4a6a` — 15% of visible area (platforms, near walls)

### Accent Colors (highest visual priority — draw the eye)
- `--accent-orange` `#ff9f43` — TORCHES — 5% of area but 50% of visual interest
- `--accent-cyan` `#00d4ff` — PLAYER AURA — 1-2% of area but focal point
- `--accent-gold` `#ffd700` — CRYSTALS — scattered, reward markers

### Green Presence
- `--accent-green` `#2ed573` — Checkpoint flag at end of each sub-section
- `--moss` `#3d6b3d` — Moss patches on lower walls, ground corners

### Red Absence (intentional)
- `--accent-red` `#ff4757` — Nearly absent in Level 1
- Only very sparse spike hints if any hazard at all (GDD: minimal hazards)

---

## 3. Lighting Layout Philosophy

### Torch Placement — Level 1 Principle: "Never leave the player in darkness for more than 3 tiles"

- **Torch density:** High — every 4-6 tiles
- **Spacing philosophy:** Player should always see at least 2 light sources simultaneously
- **Height variation:** Alternate wall-mounted torches (high) and floor torches
- **Color temperature:** Warmest of all 5 levels — maximize `--accent-orange`

### Light Radius Zones
```
[  2-unit glow  ]---[dark gap]---[  2-unit glow  ]---[dark gap]---[  2-unit glow  ]
     Torch 1            3 tiles         Torch 2            3 tiles        Torch 3
                                    ↑ player safe zone
```

### Player-Caused Light
- Player's cyan aura (radius 1 unit) is small but constant
- Creates secondary warm/cool contrast: `--accent-cyan` player + `--accent-orange` nearby stone
- Should feel like carrying a small glowing creature through a lit chamber

---

## 4. Environment Composition

### Section Layout (Tutorial Pacing)

**A — Entry Chamber (first 10 tiles)**
- Wide ceiling height (96x96 area open)
- 3 torches visible immediately
- Floor tiles clearly readable
- NO hazards — pure exploration introduction
- Crystal cluster at entrance (visible reward, reachable in 2 jumps)
- Purpose: "Welcome, you are safe here"

**B — First Platforms (tiles 10-30)**
- Simple horizontal platforms (32x32 tiles)
- Torches at platform endpoints
- Moss patches introduce organic/environmental detail
- Single crystal collectible visible as incentive
- Chain decorations (non-interactive) — add vertical interest
- Purpose: "Jump between platforms — this is easy"

**C — First Small Challenge (tiles 30-50)**
- Slight vertical section (stacked platforms)
- Torch illuminating a slightly darker section
- Checkpoint flag introduced after this section
- Purpose: "You're getting it — here's a checkpoint"

**D — Checkpoint Area (tile 50)**
- `--accent-green` checkpoint flag
- Platform widens (3 tiles wide)
- Brightest torch cluster of Level 1
- 2 crystals available
- Purpose: "Progress acknowledged — rest here"

**E — Exit Corridor (tiles 50-65)**
- Portal at end — first `--accent-purple` in the game
- Corridor narrows slightly
- Torches still plentiful
- Crystals line the path to exit
- Purpose: "You finished Level 1 — portal ahead"

---

## 5. Tile Usage Map (Level 1 Specific)

### Floor
- Inner tiles (most common) — flat, readable, `--stone-warm`
- Edge tiles — floor meets gap, shadow underneath
- Mossy floor corners — `--moss` accent, lower corners

### Walls
- Solid blocks — fill dead space behind platforms
- Top-edge tiles — where wall meets open space
- Moss patches on lower wall sections
- NO cracked/damaged tiles in Level 1 (damage begins Level 3)

### Platforms
- Full-width platforms (most common)
- Left/right end caps
- One floating platform cluster (non-threatening precision)
- No moving platforms in Level 1

### Props
- **Torches:** Every 4-6 tiles, alternating wall/floor mount
- **Chains:** 2-3 decorative chains, mid-level, no gameplay purpose
- **Moss patches:** Ground corners, lower walls — comfort/age indicator
- **Crystals:** 6-8 total across level, line the intended path
- **NO Spikes in Level 1** (hazard introduction = Level 4)
- **NO Pressure Plates in Level 1** (mechanic introduction = Level 3)

---

## 6. Parallax Background Direction

### Layer 0 (Far — 0.2x parallax, `--bg-void` based)
- Distant large arch shapes — barely visible, geometric
- Floating stone chunks — give sense of vast space above
- Subtle warm glow hints where Level 1 torches are
- NO small detail — atmospheric only
- Color: `--bg-void` with `--bg-dark` shapes, minimal `--stone-warm` hints

### Layer 1 (Mid — 0.6x parallax, `--bg-dark` to `--bg-mid`)
- Larger archway silhouettes
- Pillar shapes — suggest massive columns in background
- Chain silhouettes hanging from above
- Faint glow from main torch positions
- Color: `--bg-dark` shapes with `--bg-mid` highlights

---

## 7. Visual References for Level 1

### What to Reference
- **Celeste Chapter 1** — clean platforming, warm introduction, readable tiles
- **Hollow Knight Greenpath** — mossy dungeon entrance, warm/cool balance
- **Limbo** (early areas) — silhouette-based, atmospheric depth
- **Darkest Dungeon** (dungeon entrance corridors) — warm torchlight on cold stone

### What to Avoid
- Over-detailed pixel art (readability fails at 32x32)
- Bright, saturated fantasy dungeon colors
- Lava/fire hazards (wrong tone for Level 1)
- Excessive red or danger coloring

---

## 8. Mood Board Collage Direction

*(When I produce the visual mood board, it will reference these composite images)*

**Composite mood board images to source/describe:**

1. **"Ancient Chamber"** — wide stone corridor, warm torch on left wall, cool blue-purple stone, moss on floor corner. Key feeling: scale + safety.

2. **"Torch Study"** — single wall-mounted torch, orange glow on stone, cyan-tinted stone on opposite wall (player proximity color spill). Key feeling: the light interaction.

3. **"Moss & Stone"** — close-up of stone platform corner with `--moss` growth, cracks filled with `#3d6b3d`, subtle. Key feeling: dungeon is alive, not hostile.

4. **"The Glowing Orb"** — conceptual: small bright cyan orb on large dark stone platform, orange glow from distant torches. Key feeling: player is tiny, light is warmth.

5. **"Checkpoint Rest"** — wider view of safe platform area, green flag, double torch, crystal on ledge above. Key feeling: pause and reward.

6. **"Portal Threshold"** — corridor ending in `--accent-purple` swirling portal, torches on either side, crystal path. Key feeling: accomplishment, transition.

---

## 9. Key Design Decisions Pending

These need Kairo's character concept to finalize:

| Decision | My Default Assumption | Needs Kairo Input |
|----------|----------------------|-------------------|
| Character silhouette | Geometric orb — circular/curved | Shape confirmation |
| Character color | `--accent-cyan` #00d4ff | Intensity/temperature |
| Character glow radius | 1 unit, soft edge | Collision vs visual only |
| Character size in scene | 32x32 — smallest readable | Scale relative to tiles |
| Character animation | Glowing pulse (idle) | Style: organic or mechanical |

### Question for Kairo:
**"When your character is standing still in the dark between torches — does it still glow bright cyan, or does it dim slightly?"**
- If bright: player always visible, less atmospheric tension
- If dims slightly: more atmospheric, player must stay near light
- Either works — needs explicit decision for art production

---

## 10. Deliverables Status

| Deliverable | Status | Notes |
|-------------|--------|-------|
| Environment Style Guide v0.1 | ✅ Done | Full palette, scale, tileset specs |
| Level 1 Mood Board v0.1 | ✅ Done | This document — visual intent |
| Level 1 Mood Board (visual collage) | ⏳ Pending | Need image refs or describe concept |
| Level 1 Tileset Draft | ⏳ Pending | First production tiles — floor, wall, platform |
| Level 1 Background Layers (concept) | ⏳ Pending | Parallax BG sketches |
| Level 1 Torch Prop | ⏳ Pending | Animated frames — flicker cycle |
| Coordination with Kairo | ⏳ Pending | Share this doc when ready |

---

## Quick Reference Card (Printable)

```
LEVEL 1 — AWAKENING

Palette dominance:  --bg-dark (60%) + --bg-mid (20%) + --stone-warm (15%)
Accent priority:    --accent-orange TORCHES > --accent-cyan PLAYER > --accent-gold CRYSTALS
Green presence:     --accent-green CHECKPOINT (1x) + --moss patches
Red presence:       NONE (Level 1 = hazard-free)

Torch density:      HIGH — every 4-6 tiles
Light overlap:      Always 2+ sources visible
Player glow:        Radius 1 unit, constant, --accent-cyan
Background:         2 parallax layers (far 0.2x, mid 0.6x)

Mood keywords:      WELCOME · ANCIENT · WARM · SAFE
Emotional arc:     "You are small, but the light is warm"
```

---

*Next step: Share with Kairo for character-scale calibration. Next visual deliverable: first tileset draft (floor + wall variations).*
