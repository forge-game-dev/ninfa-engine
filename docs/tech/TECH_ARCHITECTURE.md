# Dungeon Runner — Technical Architecture v0.1
# Zephyr | Game Developer | 2026-04-23

## 1. Overview

**Engine:** Custom 2D engine ("Ninfa Engine")  
**Language:** TypeScript/JS (web-based) or engine TBD  
**Platform:** Browser (HTML5 Canvas)  
**Core Loop:** Platform → Collect Crystals → Reach Exit  

---

## 2. Coordinate System & Units

| Unit | Value |
|------|-------|
| Base tile | 1 unit = 32px (or 16px for finer grids) |
| Player size | 0.8w × 1.0h units (25.6px × 32px hitbox) |
| Movement speed | 5 units/second |
| Jump force | 3.5 units (initial velocity Y) |
| Gravity | 10 units/s² (downward) |
| Max fall speed | 8 units/s |
| Coyote time | 0.1s (allows jump after leaving platform) |
| Jump buffer | 0.15s (queues jump if pressed slightly early) |
| Torch radius | 2 units |
| Player aura | 1 unit |

---

## 3. Physics System

### 3.1 Player Controller

```
State: { x, y, vx, vy, grounded, jumping, coyoteTimer, jumpBuffer }
Update (per frame):
  1. Apply input → vx = direction * 5
  2. Apply gravity → vy += gravity * dt (clamp to maxFall)
  3. Check coyote timer (0.1s window)
  4. Check jump buffer (0.15s queue)
  5. Resolve collisions (platform response)
  6. Set grounded flag
```

### 3.2 Collision System

**Platform types:**
- **Solid:** Full collision on all faces
- **Passthrough (one-way):** Only collide from above when vy > 0
- **Moving:** Same as solid but with position interpolation

**AABB Collision:**
- Player hitbox: 0.8w × 1.0h units
- Resolution order: Y axis first (fixes floor/ceiling), then X axis
- Platforms are axis-aligned rectangles

### 3.3 Movement Feel

| Feature | Value | Rationale |
|---------|-------|-----------|
| Horizontal speed | 5 u/s | Controlled, precise |
| Jump height | ~0.6 units max | ~19px, achievable with gravity |
| Coyote time | 0.1s | Forgiving ledge jumps |
| Jump buffer | 0.15s | Responsive early press |
| Air control | Full | No momentum loss mid-air |

---

## 4. Level Data Structure

### 4.1 Level JSON Schema

```json
{
  "id": "level_01",
  "name": "Awakening",
  "tileSize": 32,
  "background": "#1a1a2e",
  "platforms": [
    {
      "id": "plat_01",
      "type": "solid",
      "x": 0, "y": 224, "w": 512, "h": 32
    }
  ],
  "torches": [
    {
      "id": "torch_01",
      "x": 64, "y": 192,
      "radius": 2,
      "color": "#ff9f43"
    }
  ],
  "crystals": [
    {
      "id": "crystal_01",
      "x": 128, "y": 160,
      "color": "#00d4ff"
    }
  ],
  "spawn": { "x": 32, "y": 192 },
  "exit": { "x": 480, "y": 192 }
}
```

### 4.2 Platform Types

```typescript
type PlatformType = "solid" | "passthrough" | "moving";

interface Platform {
  id: string;
  type: PlatformType;
  x: number;
  y: number;
  w: number;
  h: number;
  // Moving-specific
  path?: { x: number; y: number }[];
  speed?: number;
}
```

---

## 5. Lighting System

### 5.1 Torch Behavior

- **Position:** Placed in level data
- **Radius:** 2 units from center
- **Color:** Warm orange `#ff9f43`
- **Effect:** Illuminates nearby tiles, player, crystals

### 5.2 Player Glow

- **Radius:** 1 unit from center
- **Color:** Cyan `#00d4ff`
- **States:**
  - Normal: constant 100% intensity
  - Darkness: dims to ~60%
  - Near crystal: intensifies to ~130%

### 5.3 Darkness Overlay

- Full-screen overlay at low opacity (~0.7)
- Subtractive lights where torches/player glow exist
- Crystals provide small ambient radius

---

## 6. Color Palette (12 Colors)

| Name | Hex | Usage |
|------|-----|-------|
| Background | `#1a1a2e` | Base dark |
| Platform dark | `#16213e` | Underground tiles |
| Platform light | `#0f3460` | Elevated tiles |
| Torch orange | `#ff9f43` | Light sources |
| Player cyan | `#00d4ff` | Player glow/character |
| Crystal blue | `#4fc3f7` | Collectibles |
| Accent purple | `#7b2cbf` | UI highlights |
| Warning red | `#e63946` | Hazards (if any) |
| Coin gold | `#ffd700` | Score/collectibles |
| Text white | `#edf2f4` | UI text |
| Gray mid | `#457b9d` | Secondary UI |
| Success green | `#2a9d8f` | Victory/exit |

---

## 7. Level Structure

### 5 Levels (GDD):

| Level | Name | Focus | Key Mechanic |
|-------|------|-------|--------------|
| 1 | Awakening | Tutorial | Basic movement + jumping |
| 2 | First Steps | Platforms | Passthrough platforms |
| 3 | Deepening | Torches | Lighting puzzles |
| 4 | The Trial | Challenge | Moving platforms + timing |
| 5 | Ascent | Finale | All mechanics combined |

### Section Layout (per level):
```
Entry → Platforms → Challenge → Checkpoint → Exit
```

---

## 8. Game States

```typescript
type GameState = 
  | "menu"      // Title screen
  | "playing"   // Active gameplay
  | "paused"    // Pause overlay
  | "dead"      // Death state (respawn prompt)
  | "victory";  // Level complete

// State transitions:
menu → playing (press start)
playing → paused (escape key)
paused → playing (resume)
playing → dead (fall off or hazard)
dead → playing (respawn)
playing → victory (reach exit)
victory → menu (next level or return)
```

---

## 9. Audio Integration Points

From Cadenza's Section 5:

| Trigger ID | Action | Notes |
|------------|--------|-------|
| SFX_PLAYER_JUMP | Player jumps | |
| SFX_PLAYER_LAND | Player lands on platform | |
| SFX_CRYSTAL_COLLECT | Crystal picked up | |
| SFX_TORCH_LIGHT | Enter torch radius | Proximity-based |
| SFX_LEVEL_COMPLETE | Reach exit | |
| SFX_PLAYER_DEATH | Fall into void | |
| SFX_MENU_SELECT | Menu interaction | |
| SFX_PAUSE_TOGGLE | Pause/unpause | |

---

## 10. QA Testing Notes (for Verin)

**Critical test cases:**
1. **Movement precision:** 5 u/s should feel consistent at 60fps and 30fps
2. **Coyote jump:** Player must be able to jump 0.1s after leaving platform
3. **Jump buffer:** Jump input 0.15s before landing should queue correctly
4. **Passthrough collision:** Player should pass through from below/sides
5. **Moving platform:** Player should move with platform when standing on it
6. **Lighting:** Torch radius 2u and player aura 1u should not overlap unexpectedly
7. **Hitbox alignment:** Visual glow (40px) vs collision (0.8×1.0 units) should not cause invisible deaths

---

## 11. File Structure (Target)

```
ninfa-engine/
├── src/
│   ├── engine/
│   │   ├── core/
│   │   │   ├── Game.ts        # Main game loop
│   │   │   ├── Input.ts      # Keyboard input
│   │   │   └── Renderer.ts   # Canvas rendering
│   │   ├── physics/
│   │   │   ├── Player.ts     # Player controller
│   │   │   ├── Collider.ts   # AABB collision
│   │   │   └── Platform.ts   # Platform types
│   │   ├── entities/
│   │   │   ├── Crystal.ts    # Collectible
│   │   │   ├── Torch.ts      # Light source
│   │   │   └── Exit.ts       # Level exit
│   │   └── systems/
│   │       ├── Lighting.ts   # Darkness overlay
│   │       ├── Audio.ts      # SFX triggers
│   │       └── UI.ts         # HUD/Menu
│   ├── data/
│   │   ├── levels/           # JSON level files
│   │   └── palette.json     # Color definitions
│   └── main.ts
├── assets/
│   ├── sprites/              # Player, crystals, torches
│   ├── tiles/                # 16x16 and 32x32 tilesets
│   └── audio/                # SFX + music
└── index.html
```

---

## 12. Next Steps

1. **Physics prototype:** Build minimal playable scene (player + 2 platforms + crystal)
2. **Collision test:** Verify AABB resolution works for passthrough platforms
3. **Lighting test:** Implement darkness overlay + torch light subtraction
4. **Level 01:** Implement Awakening with tutorial section
5. **Audio integration:** Hook Cadenza's SFX triggers into engine events

---

*Document version: v0.1 | Author: Zephyr | Date: 2026-04-23*
