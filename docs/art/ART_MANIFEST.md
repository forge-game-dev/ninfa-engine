# Dungeon Runner — Art Asset Manifest
**Last updated:** 2026-04-24T16:27Z  
**Maintained by:** Cedar (Environment Art) + Kairo (Character Sprites)  
**Repo:** `forge-game-dev/ninfa-engine`

---

## Summary

| Category | Count | Location |
|---|---|---|
| Level 1 tiles | 29 | `docs/art/tilesets/level_1/` |
| Level 2 tiles | 27 | `docs/art/tilesets/level_2/` |
| Level 3 tiles | 88 | `docs/art/tilesets/level_3/` |
| Level 4 tiles | 33 | `docs/art/tilesets/level_4/` |
| Level 5 tiles | 33 | `docs/art/tilesets/level_5/` |
| Player sprites | 23 | `docs/art/sprites/` |
| **TOTAL** | **233** | |

---

## Level 1 — Moss Cave (29 tiles)

```
platforms/         tile_32_corner_l.png, tile_32_corner_r.png,
                   tile_32_floor_a.png, tile_32_floor_b.png,
                   tile_32_wall.png, tile_32_wall_top.png
backgrounds/       bg_moss_a.png, bg_stone_a.png, bg_stone_b.png
parallax_layer0/   bg_arch_far_a.png, bg_arch_far_b.png,
                   bg_far_void.png, bg_glow_spot.png, bg_stalactite.png
parallax_layer1/   bg_chain_hanging.png, bg_pillar_silhouette.png,
                   bg_wall_pattern.png, bg_window_opening.png
props/             arch_large.png, chain.png,
                   pillar_large.png, pillar_small.png, torch.png
collectibles/     crystal.png, key.png, portal.png,
                   checkpoint_active.png, checkpoint_inactive.png
hazards/           spike.png
```

---

## Level 2 — Water Depths (27 tiles)

```
platforms/         platform_static_00.png
platform_mp_h_00.png, platform_mp_v_00.png
mp_h1.png, mp_v1.png           (moving platform visuals)
crystals/          crystal_c09_00.png, crystal_c10_00.png,
                   crystal_c11_00.png, crystal_c12_00.png
water_00.png, water_01.png, water_deep.png, water_deep_00.png,
water_edge.png, water_shallow_00.png,
water_surface_a.png, water_surface_b.png
midground_amber.png
bg_moss_creep.png, bg_stalactite_a.png, bg_stalactite_b.png
zone_c_amber_stone_00.png
```

---

## Level 3 — Crystal Sanctum (88 tiles)

```
crystal_c01–c14  _00.png + _01.png  (28 animation frames)
crystal_c9_00.png, crystal_c9_01.png  (duplicate c09 variant)

door_red_locked.png, door_red_locked_0.png, door_red_locked_1.png,
door_red_open.png
door_gold_locked.png, door_gold_locked_0.png, door_gold_locked_1.png,
door_gold_open.png
door_blue_locked.png, door_blue_locked_0.png, door_blue_locked_1.png,
door_blue_open.png
door_open.png
door_timed.png, door_timed_0.png, door_timed_1.png, door_timed_2.png

key_gold_0–3.png, key_gold_00–03.png
key_blue_0–3.png, key_blue_00–03.png
key_red_0–3.png, key_red_00–03.png

plate_inactive.png, plate_glow.png, plate_active.png,
plate_pressure_0.png, plate_pressure_1.png, plate_pressure_2.png
switch_crystal_0.png, switch_crystal_1.png, switch_glyph.png

vault_door_0.png, vault_door_1.png, vault_door_2.png, vault_door_3.png,
vault_door_locked.png, vault_door_ready.png,
vault_door_opening.png, vault_door_open.png
```

---

## Level 4 — Spiked Corridor (33 tiles)

```
hazards/
  spike_floor_00.png, spike_ceiling_00.png,
  spike_wall_left_00.png, spike_wall_right_00.png
  corridor_top_00.png, corridor_bottom_00.png
  corridor_spike_01.png through corridor_spike_06.png

platforms/
  platform_static.png, platform_static_00.png
  platform_mp_h_00.png          (generic horizontal MP)
  platform_mp_h1.png–h5.png     (variant horizontals MP)
  platform_mp_v_00.png          (generic vertical MP)
  platform_mp_v1.png, platform_mp_v2.png  (variant verticals MP)
  platform_timed.png, platform_timed_00.png,
  platform_timed_warning_00.png, platform_timed_gone_00.png

portal/
  portal_0.png, portal_1.png, portal_2.png, portal_3.png   (4-frame anim)
  portal_exit_00.png                                        (exit portal)
```

### Level 4 Platform Variant Usage (from level_04.json)
| Platform | Tile File | Direction |
|---|---|---|
| MP-H1 | `platform_mp_h1.png` | horizontal |
| MP-H2 | `platform_mp_h2.png` | horizontal |
| MP-H3 | `platform_mp_h3.png` | horizontal |
| MP-H4 | `platform_mp_h4.png` | horizontal |
| MP-H5 | `platform_mp_h5.png` | horizontal |
| MP-V1 | `platform_mp_v1.png` | vertical |
| MP-V2 | `platform_mp_v2.png` | vertical |
| MP-T1 | `platform_timed.png` | timed (3 states) |

### Level 4 Timed Platform — 3 Visual States
| State | Tile Key | Trigger |
|---|---|---|
| Normal | `platform_timed.png` | default |
| Warning | `platform_timed_warning_00.png` | 3.0s before disappear |
| Gone | `platform_timed_gone_00.png` | invisible (collision off) |

---

## Level 5 — Ancient Vault (33 tiles)

```
ancient_floor_00.png, ancient_floor_01.png, ancient_floor_02.png
ancient_wall_00.png, ancient_wall_01.png, ancient_wall_02.png
ancfloor_1.png, ancstone_1.png, ancstone_2.png
gold_accent_00.png, gold_accent_01.png, gold_accent_02.png
torch_0.png, torch_1.png, torch_2.png, torch_3.png   (torch animation)
midground_column.png

vault/vault_door_locked_00.png, vault_door_ready_00.png,
       vault_door_open_00.png, vault_frame_00.png
vault_door_locked.png, vault_door_ready.png,
vault_door_opening.png, vault_door_open.png
vault_locked.png, vault_ready.png, vault_open.png

backgrounds/
  layer0_ancient_stone.png       (cold stone layer — Zone C transition)
  layer2_zone_c_golden.png        (warm golden layer — Zone C ambient)

zonec_bg_1.png, zonec_floor_1.png, zonec_stone_1.png
```

### Level 5 Torch — 4-Frame Animation Sequence
`torch_0.png` → `torch_1.png` → `torch_2.png` → `torch_3.png` → loop
Recommended cycle: 200ms per frame (800ms full loop)

### Level 5 Vault Door — State Machine
| State | Tile Key |
|---|---|
| Locked | `vault_door_locked.png` / `vault/vault_door_locked_00.png` |
| Ready | `vault_door_ready.png` / `vault/vault_door_ready_00.png` |
| Opening | `vault_door_opening.png` (animated) |
| Open | `vault_door_open.png` / `vault/vault_door_open_00.png` |

---

## Player Sprites (23 tiles, Kairo)

```
player_idle_1.png, player_idle_2.png
player_run_1.png, player_run_2.png, player_run_3.png, player_run_4.png
player_jump_1.png, player_jump_2.png, player_jump_3.png, player_jump_4.png
player_fall_1.png, player_fall_2.png, player_fall_3.png
player_death_1.png, player_death_2.png, player_death_3.png, player_death_4.png
player_victory_1.png, player_victory_2.png, player_victory_3.png,
player_victory_4.png, player_victory_5.png, player_victory_6.png
```

---

## GitHub Pages URL Structure

GitHub Pages serves from `docs/` as root — files in `docs/art/tilesets/` are accessible at `/art/tilesets/` on the Pages URL.

**Correct base for game:**
```
TILE_BASE = 'art/tilesets/level_4/'
```

All subdirectory paths are relative to `level_4/`. Example:
- `hazards/spike_floor_00.png` → `art/tilesets/level_4/hazards/spike_floor_00.png`

**For Level 1 collectibles:**
- `level_1/collectibles/crystal.png`

**raw.githubusercontent.com base (for preloading):**
```
https://raw.githubusercontent.com/forge-game-dev/ninfa-engine/main/docs/art/tilesets/
```

---

## Style Parameters

- **Format:** PNG RGBA 8-bit (no gradients, no indexed color)
- **Grid:** 32×32px base tile (some props 64×64, player sprites 32×32)
- **Palette:** 12-color flat palette per STYLE_GUIDE_COMBINED
- **Player accent color:** `#00d4ff` (pure cyan) — must contrast against all backgrounds
- **Glow constants:** playerBase 1.0, playerDimmed 0.6, playerBoosted 1.3
- **Glow radial:** center alpha 0.8 → edge 0.0

---

## Missing / Pending

| Item | Owner | Status |
|---|---|---|
| Droplets/bubble particle visuals | Cedar | Not yet defined |
| Zone C warm audio — background art direction | Cedar | In progress |
| L4 spatial audio entity specs (bounds/speed) | Cedar | Data extracted, spec doc needed |