# Level 1 Tileset Specification — Dungeon Runner
**Level Theme:** Awakening | **Version:** 0.1 | **Author:** Cedar | **Date:** 2026-04-24

---

## Level Overview
- **Theme:** Awakening — tutorial/introduction zone
- **Palette Zone:** Core palette (Zone A)
- **Grid:** 32×32 px base
- **Crystal Gate:** 70% of crystals required to open exit

---

## Tile Categories & File Inventory

### Platforms (6 variants)
| Filename | Size | Color | Notes |
|---|---|---|---|
| `platform_left_00.png` | 32×32 | `#4a4a6a` | Left end cap |
| `platform_mid_00.png` | 32×32 | `#4a4a6a` | Middle section, tiles horizontally |
| `platform_right_00.png` | 32×32 | `#4a4a6a` | Right end cap |
| `platform_single_00.png` | 32×32 | `#4a4a6a` | Isolated platform |
| `platform_corner_00.png` | 32×32 | `#4a4a6a` | Corner variant |
| `platform_extend_00.png` | 32×32 | `#4a4a6a` | Extension tile |

### Hazards (1 variant)
| Filename | Size | Color | Notes |
|---|---|---|---|
| `spike_floor_00.png` | 32×32 | `#ff4757` | Floor spike, flat top with pointing tips |

### Collectibles (5 variants — crystal pulse animation)
| Filename | Size | Color | Notes |
|---|---|---|---|
| `crystal_00.png` | 32×32 | `#ffd700` | Frame 0: dim |
| `crystal_01.png` | 32×32 | `#ffd700` | Frame 1: medium |
| `crystal_02.png` | 32×32 | `#ffd700` | Frame 2: bright |
| `crystal_03.png` | 32×32 | `#ffd700` | Frame 3: medium |
| `crystal_04.png` | 32×32 | `#ffd700` | Frame 4: dim → loop |

### Props (6 variants)
| Filename | Size | Color | Notes |
|---|---|---|---|
| `torch_00.png` | 32×32 | `#ff9f43` | Torch frame |
| `torch_01.png` | 32×32 | `#ff9f43` | Torch frame |
| `torch_02.png` | 32×32 | `#ff9f43` | Torch frame |
| `torch_03.png` | 32×32 | `#ff9f43` | Torch frame |
| `banner_00.png` | 32×32 | `#4a4a6a` | Wall banner |
| `deco_00.png` | 32×32 | `#4a4a6a` | Decorative element |

### Backgrounds (3 variants)
| Filename | Size | Color | Notes |
|---|---|---|---|
| `bg_wall_00.png` | 32×32 | `#1a1a2e` | Main background wall tile |
| `bg_arch_00.png` | 32×32 | `#1a1a2e` | Arched background element |
| `bg_pillar_00.png` | 32×32 | `#1a1a2e` | Pillar background tile |

### Parallax Layers (9 variants)
| Filename | Size | Opacity | Layer | Notes |
|---|---|---|---|---|
| `parallax_layer0_00.png` | 32×32 | 40% | Far | Distant architecture `#0d0d1a` |
| `parallax_layer0_01.png` | 32×32 | 40% | Far | Distant element |
| `parallax_layer0_02.png` | 32×32 | 40% | Far | Distant element |
| `parallax_layer1_00.png` | 32×32 | 60% | Mid | Mid-ground `#12122a` |
| `parallax_layer1_01.png` | 32×32 | 60% | Mid | Mid-ground element |
| `parallax_layer1_02.png` | 32×32 | 60% | Mid | Mid-ground element |
| `parallax_layer2_00.png` | 32×32 | 80% | Near | Near layer `#1a1a2e` |
| `parallax_layer2_01.png` | 32×32 | 80% | Near | Near element |
| `parallax_layer2_02.png` | 32×32 | 80% | Near | Near element |

---

## Technical Requirements
- Format: PNG, flat color, RGBA (no gradients, no indexed color)
- No PLTE chunk
- All colors from core palette only
- Tiles must tile cleanly (edges match adjacent tiles)
- Destination: `docs/art/tilesets/level_1/`

---

## Integration Notes
- Crystals use 5-frame pulse (frames 0–4), loop continuously
- Torches use 4-frame animation, 0.8s per frame = 3.2s loop
- Parallax layers scroll at different rates: layer0 slowest, layer2 fastest
- Exit portal locked until 70% crystal gate cleared