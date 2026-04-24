# Color Palette Sheet — Dungeon Runner
**Version:** 0.1 | **Author:** Cedar | **Date:** 2026-04-24

---

## Core Palette

| Name | Hex | RGB | Use |
|---|---|---|---|
| Background Dark | `#1a1a2e` | 26, 26, 46 | Level backgrounds, main BG tile |
| Player Cyan | `#00d4ff` | 0, 212, 255 | Player orb, player glow, cyan elements |
| Crystal Gold | `#ffd700` | 255, 215, 0 | Crystals, gold accents, vault gold |
| Hazard Red | `#ff4757` | 255, 71, 87 | Spikes, danger zones, death elements |
| Torch Orange | `#ff9f43` | 255, 159, 67 | Torches, warm light sources, fire |
| Platform Stone | `#4a4a6a` | 74, 74, 106 | Stone platforms, walls, static tiles |
| Water Deep | `#2d4a5e` | 45, 74, 94 | Water tiles, deep zones, water base |
| Water Mid | `#3d5a6e` | 61, 90, 110 | Water surface shimmer |
| Water Light | `#4d6a7e` | 77, 106, 126 | Water highlights |

---

## Zone B (Mechanistic) Palette

| Name | Hex | RGB | Use |
|---|---|---|---|
| Key Gold | `#ffd700` | 255, 215, 0 | Zone B key |
| Key Silver | `#c0c0c0` | 192, 192, 192 | Zone B key variant |
| Key Copper | `#b87333` | 184, 115, 51 | Zone B key variant |
| Door Blue Locked | `#4a6fa5` | 74, 111, 165 | Locked door state |
| Door Blue Open | `#6a9fc5` | 106, 159, 197 | Open door state |
| Pressure Plate | `#5a5a7a` | 90, 90, 122 | Pressure plate tiles |
| Plate Activated | `#7a7a9a` | 122, 122, 154 | Activated pressure plate |

---

## Zone C (Ancient) Palette

| Name | Hex | RGB | Use |
|---|---|---|---|
| Ancient Stone Dark | `#8b7355` | 139, 115, 85 | Background stone, base walls |
| Ancient Stone Mid | `#9b8365` | 155, 131, 101 | Stone texture variation |
| Ancient Stone Light | `#a08060` | 160, 128, 96 | Stone highlights |
| Gold Accent | `#ffd700` | 255, 215, 0 | Gold inlay, treasure elements |
| Zone C BG Cold | `#1a1520` | 26, 21, 32 | Zone C background (pre-transition) |
| Zone C BG Warm | `#2a1f15` | 42, 31, 21 | Zone C background (post-transition) |
| Torch Flame | `#ff9f43` | 255, 159, 67 | Torch frame color |
| Vault Stone | `#6a5a4a` | 106, 90, 74 | Vault door base |
| Vault Gold Trim | `#c9a227` | 201, 162, 39 | Vault door gold trim |

---

## Player Glow States

| State | Hex | Notes |
|---|---|---|
| Base glow | `#00d4ff` @ 100% opacity | Standard player state |
| Dimmed glow | `#00a4cc` @ 60% opacity | Darkness, idle pulse trough |
| Boosted glow | `#00f4ff` @ 130% intensity | Jump peak, collect |
| Death flash | `#ff4757` | Brief red flash on death |
| Victory glow | `#ffd700` | Gold tint on level complete |

---

## Parallax Background Layers

| Layer | Hex | Opacity | Use |
|---|---|---|---|
| Far BG (layer0) | `#0d0d1a` | 40% | Distant architecture silhouettes |
| Mid BG (layer1) | `#12122a` | 60% | Mid-ground structural elements |
| Near BG (layer2) | `#1a1a2e` | 80% | Near parallax elements |

---

## Usage Guidelines

- **No gradients** — all tiles flat color, RGBA
- **No indexed color** — PNGs must be RGBA (not palette-based) to avoid PLTE corruption
- **Consistency** — Zone A uses core palette, Zone B uses mechanistic variant, Zone C uses ancient palette
- **Transition zones** — crossfade colors over 1.5–2s where zones meet
- **Player contrast** — `#00d4ff` must read clearly against all backgrounds