# Level 1 Background Design — Dungeon Runner
**Level Theme:** Awakening | **Version:** 0.1 | **Author:** Cedar | **Date:** 2026-04-24

---

## Design Intent
Level 1 introduces the player to the dungeon environment. Backgrounds establish the ancient stone aesthetic — mysterious but welcoming. The player orb (cyan) reads clearly against all backgrounds. Parallax layers add depth without distraction.

---

## Background Structure

### Parallax Layers (3 depths)

| Layer | Scroll Speed | Base Color | Opacity | Content |
|---|---|---|---|---|
| Far (layer0) | 20% of foreground | `#0d0d1a` | 40% | Distant archways, massive pillars, vaulted ceilings |
| Mid (layer1) | 50% of foreground | `#12122a` | 60% | Structural elements, ledges, wall segments |
| Near (layer2) | 80% of foreground | `#1a1a2e` | 80% | Close wall details, decorative carvings |

### Background Tiles

| Tile | Color | Size | Notes |
|---|---|---|---|
| `bg_wall_00.png` | `#1a1a2e` | 32×32 | Solid wall fill, seamless tiling |
| `bg_arch_00.png` | `#1a1a2e` | 32×32 | Arched opening, creates vertical interest |
| `bg_pillar_00.png` | `#1a1a2e` | 32×32 | Pillar face, horizontal band detail |

---

## Color Usage by Zone

### Zone A (Core)
- Background: `#1a1a2e` to `#0d0d1a` gradient (darkest at top)
- Foreground tiles: `#4a4a6a` platform stone
- Accent: `#ff9f43` torch light pools
- Player contrast: `#00d4ff` must pop against all backgrounds

---

## Visual Composition

### Layering Order (back to front)
1. Far parallax (layer0) — atmospheric depth
2. Mid parallax (layer1) — structural context
3. Background tiles — wall base
4. Near parallax (layer2) — close detail
5. Gameplay tiles — platforms, hazards, collectibles
6. Player — always on top

### Atmosphere Goals
- Not oppressively dark — ancient ruins with ambient light
- Torches provide warm pools of `#ff9f43` light
- Crystals add `#ffd700` accents
- Player orb is the brightest element on screen

---

## Parallax Implementation

### Engine Requirements
- Each layer renders at its designated scroll speed multiplier
- Layer 0: `scrollFactor = 0.2`
- Layer 1: `scrollFactor = 0.5`
- Layer 2: `scrollFactor = 0.8`
- Tiles tile seamlessly horizontally and vertically

### File Naming
- Format: `parallax_layer{N}_{variant}.png`
- N = layer index (0, 1, 2)
- variant = visual variant number (00, 01, 02...)

---

## Zone Transitions

### Level 1 → Level 2
- Transition point: right edge of Level 1 map
- Background shifts from Zone A (core) to Zone B (water/dungeon)
- Color temperature: neutral → cooler (water influence)
- Audio: ambient shift (mysterious → descent)

---

## Technical Notes
- All background tiles flat RGBA, no gradients
- No indexed color PNGs
- Tiles designed for seamless tiling
- Destination: `docs/art/tilesets/level_1/backgrounds/`
- Opacity handled in engine render (alpha channel in PNG)