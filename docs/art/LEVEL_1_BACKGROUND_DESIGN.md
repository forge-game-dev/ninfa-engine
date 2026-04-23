# Level 1 "Awakening" — Background Design
**Author:** Cedar | **Date:** 2026-04-23
**Status:** DRAFT — Production Ready after player concept

---

## Overview
Tutorial level background establishing dungeon atmosphere with clear visual hierarchy. Layered parallax creates depth while remaining readable for new players.

---

## Parallax Layers

### Layer 0 — Far Background (0.2x scroll)
**Speed:** Slowest, creates deep dungeon feel
**Content:**
- Large stone arches/architecture silhouettes
- Distant stalactites on ceiling
- Faint glow spots (ancient magic remnants)

**Colors:**
- Base: #0d0d1a (near black)
- Architecture: #1a1a2e (barely visible)
- Glow spots: #2a2a4e at 20% opacity

**Art style:**
- No detail — just shapes
- Soft edges, atmospheric
- Creates "infinite depth" illusion

---

### Layer 1 — Mid Background (0.6x scroll)
**Speed:** Medium, adds parallax depth
**Content:**
- Stone wall patterns (brick/stone block arrangement)
- Hanging chains from ceiling
- Window-like openings (no actual windows — just visual interest)
- Crumbling pillar silhouettes

**Colors:**
- Base: #1a1a2e
- Stone blocks: #2a2a4e
- Highlights: #3a3a5a (subtle)
- Chains: #4a4a6a

**Art style:**
- Minimal detail — readable shapes
- Consistent with 12-color palette
- Non-interactive (no collision)

---

### Layer 2 — Near Background (1.0x scroll)
**Speed:** Matches gameplay layer
**Content:**
- Large decorative pillars (overscale)
- Archway frames at level entry/exit
- Prop placement layer (torches, moss, cracks)

**Colors:** Same as gameplay tiles
- Pillars: #4a4a6a with #6a6a8a highlight
- Arch: #2a2a4a shadow, #6a6a8a highlight

**Note:** Not parallax — this layer IS gameplay layer parallax reference.

---

## Torch Light Integration

Each torch in gameplay layer affects parallax layers:

**Layer 0 (far):** Torch light creates subtle warm glow on distant arch shapes
**Layer 1 (mid):** Torch light visible on chains, adds depth

**Torch placement guidelines:**
- First torch: 3 tiles from start (warm welcome)
- Subsequent torches: Every 8-10 tiles
- No pitch-black sections (tutorial kindness)

---

## Color Application by Layer

| Layer | Primary | Secondary | Accent |
|-------|---------|-----------|--------|
| Far (0.2x) | #0d0d1a | #1a1a2e | #2a2a4e |
| Mid (0.6x) | #1a1a2e | #2a2a4e | #3a3a5a |
| Near (1.0x) | #4a4a6a | #6a6a8a | #ff9f43 |

**No gradients** — flat color fills only per Style Guide v0.1.

---

## Entry/Exit Visual Design

### Level Entry
- Archway frame: 128x128 px overscale
- Player starts at left edge
- Torch on either side of arch
- Crystal cluster near start (encouraging, not blocking)

### Level Exit (Portal)
- Purple (#a55eea) glow emanating from exit
- Small archway or doorway frame
- Crystal trail leading to exit (visual guidance)
- Green checkpoint (#2ed573) before exit (safety net)

---

## Visual Pacing

| Section | Atmosphere | Torch Density |
|---------|------------|---------------|
| Entry | Warm, welcoming | High (2 torches visible) |
| Mid-level | Mysterious | Medium (1 torch per 8-10 tiles) |
| Checkpoint | Safe, encouraging | High (checkpoint glow + torch) |
| Exit approach | Triumphant | Medium (portal purple light) |

---

## Reference to GDD Sections

- Section 4.5: Environment Art specs (tiles, props, parallax)
- Section 4.3: Lighting (torch 2u, player 1u)
- Level 1 Mood Board: Atmosphere direction

---

**Pending:** Player concept selection → Kairo sketch → final scale → production

**Ready for:** Background tile production (16x16 and 32x32 tiles for parallax layers)

---

## Audio Integration (From Cadenza Section 5)

**Torch audio feedback (new):**
```
SFX_TORCH_LIGHT  — Trigger: player enters torch radius (2u)
                   Low priority, ambient layer enhancement
                   Subtle flame crackle + warm reverb

SFX_TORCH_DIM    — Trigger: player leaves torch radius
                   Low priority, opposite of SFX_TORCH_LIGHT
```

**Design notes:**
- Torch audio creates subconscious proximity guidance
- Aligns with visual torch glow (#ff9f43 radius 2u)
- First torch: 3 tiles from start
- Subsequent torches: Every 8-10 tiles

**No pitch-black sections** in tutorial level — ensures audio-visual consistency.
