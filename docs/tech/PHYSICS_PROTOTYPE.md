# Physics Prototype — Level 01 "Awakening" Minimal
# Zephyr | Game Developer | 2026-04-23

## Purpose
Validate core movement mechanics before full engine build:
- Horizontal movement feels responsive
- Jump height appropriate for level design
- Coyote time window (0.1s) is forgiving but not exploitable
- Jump buffer (0.15s) queues correctly
- Passthrough platforms work correctly

---

## Minimal Scene

```
Canvas: 512 x 288 (16:9 ratio, scales to viewport)

Layout:
                    [Crystal]
                    [Platform]
[Spawn]  [Plat]            [Plat]  [Exit]
========[====]============[====]====[====]=====
         Ground
```

### Entities

| Entity | Position | Size | Notes |
|--------|----------|------|-------|
| Player spawn | (32, 192) | 32x32px | Cyan glow |
| Platform A | (64, 224) | 128x32 | Solid |
| Platform B | (256, 192) | 128x32 | Passthrough |
| Platform C | (400, 192) | 96x32 | Solid |
| Crystal | (320, 160) | 16x16 | Collectible |
| Exit | (470, 192) | 32x32 | Victory trigger |
| Ground | (0, 256) | 512x32 | Solid |

---

## Physics Spec (from Tech Architecture)

```javascript
const PHYSICS = {
  moveSpeed:      5,      // units/second
  jumpForce:      3.5,    // initial Y velocity
  gravity:        10,     // units/s²
  maxFall:        8,      // terminal velocity
  coyoteTime:     0.1,    // seconds
  jumpBuffer:     0.15,   // seconds
  playerWidth:    0.8,    // units (25.6px)
  playerHeight:   1.0,    // units (32px)
  tileSize:       1,      // 1 unit = 32px
};
```

### Player State

```javascript
state = {
  x: 32, y: 192,
  vx: 0, vy: 0,
  grounded: false,
  coyoteTimer: 0,
  jumpBuffer: 0,
  facing: 1, // 1 = right, -1 = left
}
```

---

## Controls

| Input | Action |
|-------|--------|
| Arrow Left / A | Move left |
| Arrow Right / D | Move right |
| Space / Arrow Up / W | Jump |

---

## Key Behaviors to Test

### 1. Basic Movement
- Press left → player moves left at 5 u/s
- Press right → player moves right at 5 u/s
- Release → immediate stop (no momentum)

### 2. Jump
- Press jump → vy = -3.5 (upward)
- Gravity pulls back down at 10 u/s²
- Max fall speed capped at 8 u/s

### 3. Coyote Time
- Walk off platform edge
- Press jump within 0.1s → still jumps
- Wait >0.1s after leaving edge → no jump

### 4. Jump Buffer
- Press jump 0.15s before landing
- On landing, jump executes
- Wait >0.15s after press → buffer expires

### 5. Passthrough Platform
- Jump up through Platform B from below → pass through
- Land on Platform B from above → land and stand
- Walk off Platform B sides → fall through

### 6. Crystal Collection
- Touch crystal → crystal disappears
- Crystal count increments

### 7. Exit Trigger
- Touch exit zone → "Level Complete"
- Show completion message

---

## Visual Debug Overlay

Show these values on-screen for QA:

```
FPS: 60
Pos: (x, y)
Vel: (vx, vy)
Grounded: true/false
Coyote: 0.08s
Buffer: 0.00s
Crystals: 0/1
```

---

## Expected QA Results

| Test | Expected | Pass/Fail |
|------|----------|-----------|
| Move left 5u/s | ~160px/frame at 60fps | |
| Jump height | ~20px max | |
| Coyote jump | Jump 0.1s after edge | |
| Buffer jump | Jump queues if pressed early | |
| Passthrough | Pass through from below | |
| Crystal pickup | Count increments | |
| Exit trigger | "Level Complete" shown | |

---

## File Structure for Prototype

```
https://forge-game-dev.github.io/ninfa-engine/tech/Physics_Prototype/
├── index.html          # Canvas + game loop
├── prototype.js       # All prototype code
└── SPEC.md            # This document
```

Note: Prototype is standalone HTML/JS for rapid iteration.
Will be integrated into full engine structure later.

---

*Author: Zephyr | Date: 2026-04-23*
