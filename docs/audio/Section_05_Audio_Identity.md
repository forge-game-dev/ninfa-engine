# SECTION 5 — AUDIO DIRECTION
## Dungeon Runner — Game Design Document v1.0

**Author:** Cadenza, Audio Designer
**Status:** Draft for team review
**Date:** 2026-04-22

---

## 5.1 Audio Style Overview

**Estilo:** Indie/Casual with Atmospheric Elements

**Filosofia:** Audio serves gameplay clarity and emotional atmosphere. Every sound has a purpose — feedback, immersion, or emotional cue. Style is approachable and warm, never aggressive or intimidating, aligned with casual/family-friendly target audience.

**Tom:** Light dungeon atmosphere. Mysterious but inviting. Clear feedback that encourages exploration rather than punishing failure.

---

## 5.2 Music System

### 5.2.1 Layered Composition Approach

Music uses three-layer system for dynamic response and manageable production scope:

| Layer | Description | Behavior |
|-------|-------------|----------|
| **Ambient Base** | Atmospheric pad/texture, minimal melody | Loops continuously, low volume (0.3-0.4) |
| **Interaction Layer** | Light melodic elements, rhythmic patterns | Responds to player actions (collectibles, checkpoints) |
| **Event Layer** | Accent stings, tension cues | Triggered by level events (death, victory, hazard proximity) |

### 5.2.2 Level Themes

Five levels with musical progression from tutorial warmth to finale complexity:

| Level | Name | Mood | Key Musical Elements |
|-------|------|------|---------------------|
| 1 | Awakening | Encouraging, simple | Major tonality, soft textures, celebratory on completion |
| 2 | First Steps | Curious, exploration | Subtle melodic hints, checkpoint fanfare |
| 3 | Deepening | Mystery, discovery | Minor inflections, key/door success sting |
| 4 | The Trial | Tension, focus | Rhythmic pulse, hazard warning layer |
| 5 | Ascent | Triumph, climax | Layered composition, full motif, victory fanfare |

**Motif Reuse:** Leitmotif element carried across all levels for cohesion. Minimal melodic variation maintains identity while adapting to level mood.

### 5.2.3 Music Specifications

- **Format:** Looped audio files (OGG for engine compatibility)
- **Average Length:** 60-90 seconds per ambient loop
- **Crossfade:** 2-second fade between states (menu→gameplay→victory)
- **Volume:** Ducked to 0.6 during UI/pause states
- **Platform Optimization:** Mobile-friendly, max 44.1kHz/16bit

---

## 5.3 Sound Effects Inventory

### 5.3.1 Player Actions

| Action | SFX Type | Trigger | Description |
|--------|----------|---------|-------------|
| Walk/Run | Footstep loop | Ground movement | Soft stone/boot, 0.15s interval, velocity-adjusted |
| Jump | Jump confirm | Jump input | Short whoosh, snappy, 0.2s |
| Jump Air | Air release | Apex of jump | Subtle confirmation, 0.1s |
| Land | Impact | Ground contact | Soft thud, 0.15s, velocity-mapped intensity |
| Wall Slide | Friction | Wall contact + falling | Subtle scrape, continuous while active |
| Death | Failure feedback | Player death | Non-aggressive: soft chime fade + reset cue |

**Design Note:** All player SFX are snappy and responsive. 0.1-0.2s durations keep feedback immediate without cluttering the mix.

### 5.3.2 Collectibles and Objects

| Item | SFX Trigger | Description | Duration |
|------|-------------|-------------|----------|
| Crystal | Pickup | Bright chime, ascending pitch variation | 0.3s |
| Key | Pickup | Metallic unlock sound, satisfying | 0.4s |
| Checkpoint | Activation | Warm glow, beacon pulse | 0.5s |
| Exit Portal | Entry | Swirl transition, level complete feel | 0.6s |

### 5.3.3 Environment Interactions

| Object | Interaction | SFX Description |
|--------|-------------|------------------|
| Door (locked) | Key attempt | Soft rejection tone (non-frustrating) |
| Door (unlocked) | Open | Stone slide, heavy but not harsh |
| Moving Platform | Activation | Low creak, mechanical feel |
| Torch | Ambient loop | Flicker variation, 4 variants for randomization |

### 5.3.4 UI Feedback

| Element | SFX | Notes |
|---------|-----|-------|
| Menu select | Soft click | Non-intrusive |
| Menu confirm | Positive tone | Warm, encouraging |
| Menu back | Subtle whoosh | Quick transition cue |
| Pause toggle | Distinct snap | Clear state change |

---

## 5.4 Ambient Audio Design

### 5.4.1 Dungeon Atmosphere Layers

**Base Reverb Profile:** Stone chamber reverb (2.5-3.0s decay, medium-high diffusion)

| Layer | Content | Volume | Behavior |
|-------|----------|--------|----------|
| **Deep Background** | Low rumble, distant echoes | 0.15-0.2 | Constant, subtle movement |
| **Mid Layer** | Stone ambience, drip sounds | 0.2-0.25 | Randomized triggers |
| **Torch/Fire** | Crackle, flicker | 0.2 | Position-based, 4 variants |
| **Light Glow** | Subtle shimmer on warm orange areas | 0.1 | Triggered by proximity |

### 5.4.2 Level Intensity Progression

Ambient complexity increases with level progression:

- **Level 1 (Awakening):** Sparse ambient, tutorial-friendly silence pockets
- **Level 2 (First Steps):** Add subtle stone textures
- **Level 3 (Deepening):** Introduce drip/drop variations, mystery tones
- **Level 4 (The Trial):** Tension layer, distant rumble, hazard proximity
- **Level 5 (Ascent):** Full ambient complexity, climactic atmosphere

---

## 5.5 Audio Implementation Notes

### 5.5.1 Trigger System

All SFX triggers documented for QA verification:

| Trigger ID | Source | Action | Audio Response |
|------------|--------|--------|----------------|
| SFX_PLAYER_JUMP | Player jump input | Jump whoosh plays | 0.2s confirm |
| SFX_PLAYER_LAND | Ground collision | Impact plays | Velocity-based intensity |
| SFX_CRYSTAL_COLLECT | Crystal overlap | Chime plays + crystal removed | 0.3s |
| SFX_KEY_COLLECT | Key overlap | Unlock plays + key removed | 0.4s |
| SFX_CHECKPOINT_ACT | Checkpoint overlap | Beacon plays once | 0.5s |
| SFX_DOOR_OPEN | Unlock trigger | Slide plays + door state change | 0.4s |
| SFX_DEATH | Death trigger | Chime fade + respawn cue | 0.8s |
| SFX_PORTAL_ENTER | Exit trigger | Swirl plays + level transition | 0.6s |
| SFX_MENU_SELECT | UI select | Click plays | 0.1s |
| SFX_MENU_CONFIRM | UI confirm | Tone plays | 0.2s |

### 5.5.2 Layering System

**Master Mix Priority (top to bottom):**
1. UI/Feedback SFX (immediate, duck ambient)
2. Player SFX (high priority)
3. Collectible SFX (medium priority)
4. Ambient Base (continuous, lower priority)
5. Music (continuous, ducked during events)

**Duck Behavior:** Collectible/item SFX triggers -3dB reduction on ambient for 0.3s to clear mix.

### 5.5.3 Volume Envelopes

| Type | Attack | Decay | Sustain | Release | Usage |
|------|--------|-------|---------|---------|-------|
| **Player Actions** | 0.01s | 0.05s | 0s | 0.1s | Jump, land |
| **Collectibles** | 0.01s | 0.05s | 0.1s | 0.2s | Crystal, key |
| **Ambient Loop** | 0.5s | - | - | 1s | Torch, stone |
| **Music Transition** | 1s | - | - | 2s | Crossfade |

### 5.5.4 State Audio Flags

For QA verification of audio state management:

| State | Music | Ambient | SFX |
|-------|-------|---------|-----|
| Menu | Title theme (0.7 vol) | Off | UI only |
| Gameplay | Level theme | Active | Player + environment |
| Pause | Ducked to 0.3 | Reduced to 0.5 | UI only |
| Death | Fades | Continues | Death chime |
| Victory | Victory theme | Fades | Fanfare |
| Transition | Crossfade | Fades | Portal swirl |

---

## 5.6 Audio Asset Naming Convention

**Format:** `{type}_{context}_{descriptor}_{variant}`

| Field | Values | Example |
|-------|--------|---------|
| **Type** | sfx, mus, amb | sfx |
| **Context** | player, collect, env, ui | player |
| **Descriptor** | jump, crystal, torch | jump |
| **Variant** | 01, 02, 03, alt | 01 |

**Examples:**
- `sfx_player_jump_01.ogg`
- `sfx_collect_crystal_02.ogg`
- `amb_env_torch_01.ogg`
- `mus_level_01.ogg`

**Folders:**
```
audio/
├── sfx/
│   ├── player/
│   ├── collect/
│   ├── env/
│   └── ui/
├── music/
│   └── levels/
└── ambient/
    └── env/
```

---

## 5.7 Production Scope Summary

| Category | Items | Estimated Volume |
|----------|-------|------------------|
| **Music** | 5 level themes + title | 6 tracks |
| **Player SFX** | Jump, land, wall, death | 5-6 sounds |
| **Collectible SFX** | Crystal, key, checkpoint, portal | 4-5 sounds |
| **Environment SFX** | Doors, platforms, torches | 8-10 sounds |
| **UI SFX** | Menu interactions | 4-6 sounds |
| **Ambient Layers** | Stone, torch variations | 8-10 variations |
| **Total** | | ~40-50 audio assets |

---

## 5.8 Coordination Dependencies

- **Vesper:** Confirm music mood direction per level (current draft is default approach)
- **Zephyr:** Audio trigger integration in game engine (Section 5.5.1 references)
- **Verin:** QA test cases should verify trigger accuracy and state transitions
- **Cedar:** Torch visual timing for ambient sync (if animated torches)

---

## 5.9 Questions / Pending Decisions

1. **Player character type:** Affects footstep character (humanoid vs creature vs object)
2. **Voice-over:** Any character sounds, grunts, or vocal feedback?
3. **Mobile vs PC target:** Affects compression and streaming approach
4. **Loop vs one-shot for torches:** Continuous ambient vs triggered fire sounds

---

**Status:** Draft — awaiting team feedback before finalizing for GDD integration.
