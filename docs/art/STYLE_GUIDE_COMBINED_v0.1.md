# Style Guide — Dungeon Runner Environment Art
**Version:** 0.1 | **Author:** Cedar | **Date:** 2026-04-24

---

## Overview

This guide defines the environment art style for Dungeon Runner, ensuring visual consistency across all five levels. It covers color palette, grid system, rendering rules, naming conventions, and asset format requirements.

---

## 1. Core Palette

### Zone A — Core (Levels 1–2)
| Role | Color | Hex | Notes |
|---|---|---|---|
| Background deep | Dark navy | `#0d0d1a` | Far parallax, darkest layer |
| Background mid | Dark navy | `#12122a` | Mid parallax |
| Background base | Navy | `#1a1a2e` | Primary background, wall tiles |
| Platform stone | Dark slate | `#4a4a6a` | All platforms, base ground |
| Platform highlight | Slate light | `#5a5a7a` | Platform top edge, lighter cap |
| Hazard | Red | `#ff4757` | Spikes, traps, danger |
| Torch | Amber | `#ff9f43` | Torches, warm light accents |
| Player orb | Cyan | `#00d4ff` | Player character, interactive glow |
| Crystal | Gold | `#ffd700` | Collectibles, reward accent |

### Zone B — Mechanistic (Levels 2–3)
| Role | Color | Hex | Notes |
|---|---|---|---|
| Water surface | Blue-teal | `#4d6a7e` | Top of water tiles |
| Water mid | Teal-blue | `#3d5a6e` | Middle water depth |
| Water deep | Dark teal | `#2d4a5e` | Bottom of water tiles |
| Amber stone | Warm amber | `#8b6914` | Zone B geological accent |
| Mechanism | Steel blue | `#4a6fa5` | Doors, switches, mechanical |
| Switch active | Bright blue | `#6a9fc5` | Active pressure plates |

### Zone C — Ancient/Triumphant (Levels 4–5)
| Role | Color | Hex | Notes |
|---|---|---|---|
| Ancient floor | Warm brown | `#8b7355` | Level 5 stone floor |
| Ancient wall | Brown | `#6b5344` | Level 5 walls |
| Gold accent | Gold | `#ffd700` | Ancient gold trim |
| Portal | Cyan | `#00d4ff` | Level exit portal |
| Portal core | Bright cyan | `#00e5ff` | Portal center glow |

---

## 2. Grid System

- **Base tile size:** 32×32 pixels
- **Platform variants:** 64×16, 96×16, 128×16 for wider spans
- **Player sprite:** 32×32 pixels base
- **Crystal:** 32×32 pixels
- **Spike:** 32×16 pixels
- **All tiles snap to 32×32 grid in level data**

---

## 3. Rendering Rules

### MUST
- [ ] Flat color only — no gradients
- [ ] RGBA PNG format — no indexed color (PLTE chunk forbidden)
- [ ] Player `#00d4ff` must read clearly against ALL backgrounds
- [ ] Tiles tile cleanly at edges (no visible seams)
- [ ] 12-color maximum per tile
- [ ] Consistent pixel density across all assets

### NEVER
- [ ] No gradients or anti-aliased edges (crisp pixel art style)
- [ ] No transparency outside alpha channel
- [ ] No 3D shading or lighting simulation
- [ ] No indexed color PNGs (causes browser render failures)
- [ ] No oversized assets that break grid alignment

---

## 4. File Naming

```
{category}_{variant}_{frame}.png
```

| Category | Examples | Notes |
|---|---|---|
| `platform_*` | `platform_left_00.png` | 6 variants for Level 1 |
| `spike_*` | `spike_floor_00.png` | Floor/ceiling/wall variants |
| `crystal_*` | `crystal_00.png` | 5-frame pulse animation |
| `torch_*` | `torch_00.png` | 4-frame animation |
| `bg_*` | `bg_wall_00.png` | Background tiles |
| `parallax_*` | `parallax_layer0_00.png` | Parallax layers |
| `water_*` | `water_surface_00.png` | Level 2 water tiles |
| `door_*` | `door_locked_00.png` | Door states |
| `key_*` | `key_gold_00.png` | Key variants |
| `vault_*` | `vault_closed_00.png` | Vault states |

---

## 5. Directory Structure

```
docs/art/
├── tilesets/
│   ├── level_1/
│   │   ├── platforms/
│   │   ├── hazards/
│   │   ├── collectibles/
│   │   ├── props/
│   │   ├── backgrounds/
│   │   └── parallax/
│   ├── level_2/
│   ├── level_3/
│   ├── level_4/
│   └── level_5/
├── sprites/
│   └── player/
└── ui/
    └── hud/
```

---

## 6. Animation Frames

| Asset | Frames | Duration | Total Loop |
|---|---|---|---|
| Crystal pulse | 5 (0–4) | variable | continuous |
| Torch flame | 4 (0–3) | 0.8s | 3.2s |
| Portal swirl | 4 (0–3) | TBD | continuous |
| Door open | 3 states | discrete | triggered |

---

## 7. Visual Hierarchy

1. **Player orb** — always brightest element `#00d4ff`
2. **Collectibles** — gold `#ffd700`, draws eye to reward
3. **Hazards** — red `#ff4757`, unambiguous danger
4. **Interactive** — torches `#ff9f43`, warm light pools
5. **Platforms** — dark slate `#4a4a6a`, stable ground
6. **Backgrounds** — darkest `#1a1a2e`, recedes visually

---

## 8. Level-Specific Notes

### Level 1 — Awakening
- Tutorial zone, widest platforms, minimal hazards
- 3-layer parallax (20%/50%/80% scroll)
- 70% crystal gate at exit

### Level 2 — Descent
- Water tiles introduce cooler palette
- Moving platforms (horizontal + vertical)
- 4-layer parallax with water shimmer

### Level 3 — Mechanistic
- Doors, keys, pressure plates
- Steel blue `#4a6fa5` mechanism palette
- Vault door with permanent-open mechanic

### Level 4 — Urgent
- Spike corridors (floor, ceiling, wall variants)
- Moving platforms at 2–4 u/s
- 3-second timed platform with warning state
- Portal exit

### Level 5 — Triumphant
- Ancient stone warm palette `#8b7355`
- Gold accents `#ffd700`
- Animated torches
- Vault with final reward

---

## 9. Audio-Visual Sync

| Event | Visual | Audio |
|---|---|---|
| Platform movement | Tile animates | Warning SFX |
| Spike contact | Hazard flash | Death SFX |
| Crystal collect | Pulse flash | Collect SFX |
| Level complete | Portal glow | Victory sting |
| Zone C entry | BG warm shift | Ambient crossfade |