# Zone C Backdrop Spec — "The Sanctum Chamber"
## Vesper → Cedar | Design Authority Document
**Date:** 2026-04-25 | **Level:** L5 Zone C | **Status:** READY FOR CEDAR

---

## Design Rationale

Zone C is the emotional peak of the dungeon — the moment where the player has navigated through the Convergence (Zone B) and earned the right to approach the final vault. The visual language should shift to signal this climactic space.

**Core design decision:** Zone C shifts from the cool/stone palette to **warm gold tones** as the player approaches the vault. This is a reward signal — the environment telling the player "you're close, this is special."

---

## Zone C Layout Context

| Property | Value |
|----------|-------|
| Player spawn | (32, 64) → traverses Zones A + B → enters Zone C |
| Vault door | x=720, y=320, w=64, h=128 — 3-key gold door |
| Exit portal | x=736, y=544 — below and to the right of vault |
| Timed platform | MP-T1 at (720, 416) — 3s timer, final approach to vault |
| Crystals | 4 total in Zone C (C-11 to C-14) |
| Checkpoints | **None** — highest tension in game |

**Player flow:** Zone B → Zone C entry → platforming sequence → 3-key vault → portal descent

The backdrop should support this flow: cooler tones at Zone C entry (continuity from Zone B), warming to gold as the player moves right toward the vault.

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `zone-c-bg-far` | `#1a1208` | Deep shadow — far background layer |
| `zone-c-bg-mid` | `#2d1f0e` | Mid-layer stone — warm dark |
| `zone-c-accent-gold` | `#c9a227` | Gold accent — torchlight / crystal glow |
| `zone-c-accent-bright` | `#f0d060` | Bright gold — vault proximity highlight |
| `zone-c-stone` | `#3d3020` | Warm stone base — replaces cool Zone A/B stone |
| `zone-c-highlight` | `#6b5030` | Warm highlight — edge lighting |
| `zone-c-glow` | `#ffd700` | Crystal / vault glow color |

**Shift from Zone A/B:**
- Zone A/B: cool blue-gray stone (`#3a3632` → `#4a4a6a`)
- Zone C: warm amber-brown stone (`#3d3020` → `#6b5030`)
- Zone C vault proximity: gold highlights (`#c9a227`, `#f0d060`)

---

## Layer Specification (3-layer parallax, Zone C)

### Layer 0 — Far Background (0.1× scroll)
**Theme:** Ancient vault wall, ceremonial
**Content:**
- Large stone blocks in warm dark tones (`#1a1208`, `#2d1f0e`)
- Faint etched glyphs or geometric patterns suggesting ancient origin
- Optional: distant golden light source suggesting vault radiance
- No parallax movement elements — calm, monumental

### Layer 1 — Mid Background (0.3× scroll)
**Theme:** Ornate architecture, treasury aesthetic
**Content:**
- Pillars or buttresses in warm stone (`#3d3020`)
- Gold trim or decorative accents (`#c9a227`) at edges
- Subtle texture suggesting aged brass or gilded stone
- Could include faint chain or cable elements (thematic link to Zone B mechanism aesthetic)

### Layer 2 — Near Background (0.5× scroll)
**Theme:** Vault proximity — golden glow spill
**Content:**
- Visible vault door frame or archway suggestion at x≈720
- Warm light spill (`#f0d060` at low opacity) emanating from vault direction
- Optional: floating dust particles in golden light
- This layer provides the "you are entering the sacred space" feeling

---

## Atmospheric Notes

### Vault Glow Effect
The vault door at (720, 320) emits a faint golden aura that should be visible in the backdrop. This is a gameplay-readability cue as well as atmosphere — player sees the golden glow and knows the vault is nearby even before seeing the door itself.

**Implementation note:** This glow should be present in all three parallax layers proportionally — the vault is a light source that illuminates everything.

### Transition from Zone B
Zone B ends with the MP-T1 timed platform sequence — mechanical, precise. Zone C should feel like exiting that mechanical space into something older and more ceremonial. The backdrop transition should support this:
- Zone B end: dark, precise, mechanical
- Zone C start: slightly warmer, then progressively more golden as player moves right

---

## Parallax Layer Files

| Layer | File name | Recommended size | Parallax factor |
|-------|-----------|----------------|-----------------|
| Far (0) | `zone_c_layer0.png` | 800×640 px | 0.1× |
| Mid (1) | `zone_c_layer1.png` | 800×640 px | 0.3× |
| Near (2) | `zone_c_layer2.png` | 800×640 px | 0.5× |

**Directory:** `docs/art/tilesets/level_5/backgrounds/`
(Naming consistent with existing Zone C parallax files already committed)

---

## Deliverables Summary for Cedar

1. **3 parallax backdrop layers** for Zone C (layer0, layer1, layer2) following the warm gold palette
2. **Vault glow indication** visible in backdrop — golden radiance suggesting vault location
3. **Transition continuity** from Zone B mechanical aesthetic to Zone C ceremonial aesthetic

---

## Reference: Existing Zone C Files

Already committed to repo at `docs/art/tilesets/level_5/backgrounds/`:
- `zone_c_layer0.png` — 789KB, likely the far layer
- `zone_c_layer1.png` — 9KB, likely mid layer
- `zone_c_layer2.png` — 169KB, likely near layer with vault glow

If these existing files already have the warm gold aesthetic, Cedar may only need minor adjustments. If they need revision, the above spec provides the design authority.

---

## Integration

Once Cedar produces the updated layers:
- `drawBackdrop()` in prototype_v13.js needs to be wired (Zephyr backlog item)
- 3-layer parallax call sequence: layer0(0.1×), layer1(0.3×), layer2(0.5×)
- Zone C player camera range: x 512–800 (player approaching from left)

---

## Dependencies
- **Engine:** `drawBackdrop()` — Zephyr (low priority backlog)
- **Art:** Zone C parallax layers — Cedar
- **Not blocking D15 playtest** — Zone C is end-game, cosmetic enhancement