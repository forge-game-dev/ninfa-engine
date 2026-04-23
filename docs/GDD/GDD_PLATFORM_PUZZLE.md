# DUNGEON RUNNER — Game Design Document v1.0
**Project:** Dungeon Runner | **Genre:** Plataforma/Puzzle | **Version:** 1.0 (Draft)
**Status:** Foundations Phase — Awaiting team review | **Date:** 2026-04-22

---

## 1. GAME OVERVIEW

### 1.1 Concept & Vision
Dungeon Runner is a family-friendly platformer set in a minimalist dungeon filled with mysterious light sources. Players guide a glowing geometric creature through five distinct levels, collecting crystals, activating checkpoints, and mastering movement mechanics. The game combines tight controls with puzzle elements — every crystal collected brings players closer to unlocking the exit portal.

The core experience: precision platforming in a beautifully sparse dungeon where light is both your companion and your guide.

### 1.2 Target Audience
- **Primary:** Casual players, family-friendly, ages 7+
- **Platform:** PC and Mobile
- **Session length:** 5-15 minutes per level
- **Difficulty curve:** Gentle learning curve with satisfying challenge progression

### 1.3 Core Loop
1. **Explore** → Navigate platforms, discover paths
2. **Collect** → Gather all crystals in each level (100% requirement)
3. **Survive** → Avoid hazards, manage movement
4. **Progress** → Activate checkpoints, unlock exit portal, advance

---

## 2. MECHANICS

### 2.1 Player Movement

| Property | Value |
|----------|-------|
| Move speed | 5 u/s |
| Jump height | 3.5 units |
| Gravity | 10 u/s² |
| Max fall speed | 8 u/s |
| Coyote time | 0.1s (leave edge, still jump) |
| Jump buffer | 0.15s (press before land, execute on land) |

**Horizontal Movement:**
- Instant acceleration to 5 u/s
- Instant stop on release (no momentum/sliding)
- Direction change: immediate

**Jump Mechanics:**
- Coyote time: 0.1s window to jump after leaving platform edge
- Jump buffer: 0.15s queue before landing, executes on land
- Variable jump height: release early for short hop, hold for full height

**Visual Feedback:**
- Squash on landing (0.1s compression)
- Stretch on jump ascent
- Direction lean during movement

### 2.2 Platforms

**Solid Platforms:**
- Block movement from all directions
- Standard collision (32x32 px base tile)
- Visual: angular, architectural style

**Passthrough Platforms:**
- Player passes through from below
- Player lands on from above
- Visual distinction: thinner, platform-edge appearance
- Collision: one-way (top only)

### 2.3 Collectibles

**Crystals:**
- Required: 100% collection to unlock exit portal
- Collision: player overlap (not proximity)
- Visual: 16x16 px, gold (#ffd700), pulsing glow
- Collection radius: 16px trigger zone
- Audio: SFX_CRYSTAL_COLLECT (0.3s chime)
- Proximity glow feedback: player aura intensifies near crystals

**Keys:**
- Optional collection for inventory
- Trigger door unlock when player has key
- Collision: player overlap
- Visual: 16x16 px
- Audio: SFX_KEY_COLLECT (0.4s unlock)

### 2.4 Interactive Elements

**Checkpoints:**
- Activation: first player touch
- Visual: green (#2ed573) beacon, pulses when inactive, glows when active
- Function: sets respawn point, saves level progress
- Audio: SFX_CHECKPOINT_ACTIVATE (0.5s beacon)

**Exit Portal:**
- Requirement: 100% crystals collected
- Visual: purple (#a55eea) energy swirl
- Trigger: player overlap + all crystals collected
- Audio: SFX_EXIT_PORTAL (0.6s swirl) + SFX_LEVEL_COMPLETE

**Doors:**
- Require key to unlock
- Visual: locked (red indicator) → unlocked (green)
- Audio: SFX_DOOR_UNLOCK (0.4s slide)

### 2.5 Hazards

**Spike Traps:**
- Instant death on contact
- Visual: red (#ff4757) triangular shapes
- Collision: top half of visual (16px height trigger zone)
- Death: SFX_PLAYER_DEATH, respawn at last checkpoint

---

## 3. LEVEL DESIGN

### 3.1 Level Structure

| Level | Name | Crystals | Theme | Challenge Focus |
|-------|------|----------|-------|-----------------|
| 1 | Awakening | 5 | Dark intro, basic platforming | Movement mastery |
| 2 | Descent | 8 | Torch-lit descent | Precision jumping |
| 3 | Convergence | 10 | Multi-path puzzle | Route planning |
| 4 | Ascension | 12 | Vertical climb | Advanced mechanics |
| 5 | Sanctum | 15 | Final challenge | All skills combined |

### 3.2 Level 1: Awakening (Tutorial)

**Concept:** First contact with the dungeon. Teaches core mechanics in a safe environment.

**Layout:**
- Entry: Dark spawn point with player glow
- Section A: Simple left-right platforming, 2 crystals, single torch
- Section B: Introduction to jump mechanics, 2 crystals
- Section C: Spike hazard introduction, 1 crystal + checkpoint
- Exit: Portal with checkpoint respawn reference

**Teaching Moments:**
1. Movement (Section A): Learn left/right, basic jumps
2. Collection (Section A): First crystal pickup, understand requirement
3. Jump mechanics (Section B): Coyote time awareness
4. Hazard awareness (Section C): Spike visual recognition
5. Checkpoint (Section C): Understand respawn system
6. Exit (Section C): Portal interaction when 100% crystals

**Design Notes:**
- Difficulty: Easy (confidence builder)
- Visual: Heavy darkness, single torch light source
- Audio: Minimal ambient, clear collection feedback

### 3.3 Level Progression Philosophy
- **Level 1-2:** Foundation (teach mechanics, build confidence)
- **Level 3:** Application (combine mechanics, increase complexity)
- **Level 4-5:** Mastery (challenge, satisfaction, mastery feel)

---

## 4. VISUAL DESIGN

### 4.1 Art Style
**Core Style: Flat Design + Minimal Dungeon**
- No gradients, no depth shading
- Strong silhouette readability for gameplay clarity
- Controlled color palette (12 colors)
- Contrast-driven lighting

### 4.2 Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Background Dark | #1a1a2e | Base dungeon void |
| Platform Base | #4a4a6a | Standard surfaces |
| Platform Highlight | #6a6a8a | Tile edge highlights |
| Player Cyan | #00d4ff | Player, proximity feedback |
| Crystal Gold | #ffd700 | Crystals, victory |
| Hazard Red | #ff4757 | Spikes, death zones |
| Torch Orange | #ff9f43 | Light sources |
| Checkpoint Green | #2ed573 | Checkpoint activation |
| Portal Purple | #a55eea | Exit portal |

### 4.3 Player Character Design

**Orb Creature** (SELECTED):
- Perfect oval/circular shape, 32x32 px visual
- Glowing cyan core (#00d4ff) with pulsing inner pattern
- Rounded silhouette (1.2:1 height:width ratio)
- Collision: 25.6x32px hitbox (0.8x1.0 units)
- Glow: 1-unit decorative radius, non-collidable

**Glow Behavior:**
| State | Value | Notes |
|-------|-------|-------|
| Constant | 1.0 | Always visible |
| In darkness | 0.6 | Dimmed |
| Near crystal | 1.3 | Boosted |

**Animation States:**
| State | Frames |
|-------|--------|
| Idle | 2-3 |
| Run | 4-6 |
| Jump | 3-4 |
| Fall | 2-3 |
| Death | 3-4 |
| Victory | 4-6 |

### 4.4 Environment Art Direction

**Tileset Structure:**
- 16x16 px: Fine detail (cracks, moss, debris)
- 32x32 px: Standard blocks (walls, floors, platforms)
- 64x64 / 128x128 px: Overscale props (arches, pillars)

**Parallax System:**
| Layer | Speed |
|-------|-------|
| Far | 0.2x |
| Mid | 0.6x |
| Foreground | 1.0x |

**Lighting Rules:**
- Torch radius: 2 units, warm orange (#ff9f43)
- Player aura: 1 unit, cyan (#00d4ff), follows player

---

## 5. AUDIO DESIGN

### 5.1 Sound Philosophy
- Feedback clarity: Every action has distinct audio response
- Atmosphere: Dungeon ambience supports immersion
- Player expression: Audio reinforces player agency

### 5.2 SFX Inventory

| Trigger ID | Description | Duration |
|------------|-------------|----------|
| SFX_PLAYER_JUMP | Normal jump whoosh | 0.2s |
| SFX_PLAYER_COYOTE | Coyote jump variant | 0.2s |
| SFX_PLAYER_LAND | Velocity-based impact | 0.1s |
| SFX_PLAYER_DEATH | Death chime fade | 0.8s |
| SFX_PLAYER_MOVE | Movement loop (optional) | Loop |
| SFX_CRYSTAL_COLLECT | Collection chime | 0.3s |
| SFX_KEY_COLLECT | Key unlock | 0.4s |
| SFX_DOOR_UNLOCK | Door slide open | 0.4s |
| SFX_CHECKPOINT_ACTIVATE | Beacon activation | 0.5s |
| SFX_EXIT_PORTAL | Portal swirl | 0.6s |
| SFX_LEVEL_COMPLETE | Victory fanfare | 1.5s |
| SFX_TORCH_LIGHT | Torch proximity crackle | Loop |
| SFX_TORCH_DIM | Torch exit dim | 0.3s |

### 5.3 Music System

| Level | Theme | Mood | Instrumentation |
|-------|-------|------|-----------------|
| 1 | Awakening | Dark, mysterious, hopeful | Ambient pad, soft piano, distant bells |
| 2 | Descent | Energetic, warm | Upbeat rhythm, acoustic guitar, percussion |
| 3 | Convergence | Puzzle-focused, calm | Electronic textures, ambient layers, rhythmic pulses |
| 4 | Ascension | Intense, climactic | Full orchestration, dynamic swells |
| 5 | Sanctum | Grand, triumphant | Epic orchestral, choir accents, victory anticipation |

**State Transitions:**
- Normal → Hazard: Music drops to 0.6 volume, tension layer
- Level Complete: Full victory theme, 2-second crossfade
- Death: Music continues (no interruption)
- Pause: Music ducks to 0.4 volume

### 5.4 Audio-Visual Integration

**Crystal Proximity Feedback:**
| Distance | Visual | Audio |
|----------|--------|-------|
| > 3 units | Base glow (1.0) | Silent |
| 2-3 units | Slight boost (1.1) | Faint hum (0-20%) |
| 1-2 units | Moderate (1.2) | Audible hum (20-40%) |
| < 1 unit | Full boost (1.3) | Prominent hum (40%) |

**Player Character Audio Signatures (Orb Creature):**
- Movement: Hollow boops
- Jump: Bouncy whoosh
- Land: Soft bounce
- Death: Fade pop

---

## 6. UI/UX DESIGN

### 6.1 HUD Elements

| Element | Position | Content |
|---------|----------|---------|
| Crystal Counter | Top-left | X / Total with crystal icon |
| Key Inventory | Top-left (below counter) | Key icon + count |
| Level Indicator | Top-right | Level X |

### 6.2 Pause Menu
- Resume button
- Restart level button
- Level select (if unlocked)
- Audio settings (music volume, SFX volume)

### 6.3 Death/Respawn Flow
1. Player hits hazard → death trigger
2. SFX_PLAYER_DEATH plays (0.8s)
3. Brief pause (0.5s)
4. Fade to checkpoint
5. Player respawns at last checkpoint
6. No crystal reset (keep collected)

### 6.4 Level Complete Flow
1. Player reaches exit portal (100% crystals)
2. SFX_EXIT_PORTAL + SFX_LEVEL_COMPLETE
3. Victory animation plays
4. Level complete screen
5. Next level button

---

## 7. QUALITY ASSURANCE

### 7.1 Core Test Cases

**Movement:**
| ID | Test | Expected |
|----|------|----------|
| SET_MOV_101 | Velocity response | 5 u/s, instant stop |
| SET_MOV_102 | Direction change | Immediate turn |
| SET_MOV_103 | Solid platform | No slip/float |
| SET_MOV_104 | Passthrough platform | Traverse from below |

**Jump:**
| ID | Test | Expected |
|----|------|----------|
| SET_JUMP_201 | Jump height | 3.5 units |
| SET_JUMP_202 | Gravity descent | 10 u/s², max 8 u/s |
| SET_JUMP_203 | Coyote time | Jump within 0.1s of edge |
| SET_JUMP_204 | Jump buffer | Queued jump executes on land |

**Collectibles:**
| ID | Test | Expected |
|----|------|----------|
| SET_CRYSTAL_401 | Collection | Counter increments, SFX triggers |
| SET_CRYSTAL_402 | Proximity exclusion | Not collected until touch |
| SET_CRYSTAL_403 | Count tracker | HUD shows correct count |
| SET_KEY_401 | Key collection | Inventory increments |

### 7.2 Edge Cases
- Coyote time boundary (0.1s window)
- Jump buffer queue (0.15s window)
- Passthrough from above vs below
- Moving platform relativity
- Audio: SFX_COYOTE only on coyote-jump

### 7.3 Performance Criteria

| Target | Value |
|--------|-------|
| PC framerate | 60 fps minimum |
| Mobile framerate | 30 fps minimum |
| PC platforms | Windows 10+ |
| Mobile platforms | Android 8+ |
| Audio latency | < 100ms |

---

## 8. TECHNICAL DESIGN

### 8.1 Engine Requirements
- **Platform:** 2D game engine (Unity 2D or Godot — TBD)
- **Resolution:** 1280x720 base, responsive scaling
- **Asset pipeline:** PNG sprites, audio files (WAV/MP3)

### 8.2 Physics Constants

| Constant | Value |
|----------|-------|
| GRAVITY | 10 u/s² |
| MAX_FALL_SPEED | 8 u/s |
| PLAYER_SPEED | 5 u/s |
| JUMP_FORCE | Calculated for 3.5u height |
| COYOTE_TIME | 0.1s |
| JUMP_BUFFER | 0.15s |

### 8.3 Collision System
- Player hitbox: 0.8x1.0 units (25.6x32 px at 32px scale)
- Platform tiles: 1.0x1.0 units (32x32 px)
- Passthrough: One-way collision from above only

---

## 9. DELIVERABLES & TIMELINE

### 9.1 Phase 1: Foundation (Days 1-5)

| Deliverable | Owner | Status |
|-------------|-------|--------|
| GDD v1.0 | Vesper | Complete |
| Style Guide | Kairo + Cedar | Complete |
| Asset Specs | Kairo | Complete |
| Audio Identity | Cadenza | Complete |
| QA Plan | Verin | Complete |
| Tech Architecture | Zephyr | In Progress |
| Production Plan | Orion | Pending upload |

### 9.2 Phase 2: Vertical Slice (Days 6-15)
- Level 1 playable prototype
- Core mechanics implemented
- Player character animation (basic states)
- Environment art (Level 1 tileset)
- Audio integration (core SFX)

### 9.3 Phase 3: Alpha (Days 16-25)
- All 5 levels playable
- Full art asset integration
- Music integration
- QA testing cycles

### 9.4 Phase 4: Beta + Release (Days 26-35)
- Bug fixes
- Polish
- Optimization
- Release preparation

---

## 10. OPEN QUESTIONS

1. **Engine selection:** Unity 2D vs Godot — decision pending
2. **Animation frame count:** Confirm 2-6 frames per state acceptable
3. **Level 2+ color progression:** Define per-level palette weighting
4. **Star rating system:** Optional feature for post-launch
5. **Mobile touch controls:** Need design document for mobile port

---

*GDD v1.0 — Complete. Subject to revision based on Vertical Slice feedback and team review.*
