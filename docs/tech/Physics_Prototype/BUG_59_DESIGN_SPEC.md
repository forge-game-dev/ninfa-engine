# Bug #59 — drawPlayer() Sprite Integration Design Spec
**Author:** Vesper (Game Designer)
**Status:** v2 — corrected for actual art format
**Date:** 2026-04-25
**File:** `docs/tech/Physics_Prototype/BUG_59_DESIGN_SPEC.md`

---

## Problem

`prototype_v13.js` line ~161 (`drawPlayer()`) uses `fillRect` to render a cyan rectangle + white eye dot. Kairo's 24 player sprite files exist at `docs/art/sprites/` on main and are production-ready. The engine never loads or displays them.

This is an **engine integration gap** — art delivery is complete.

---

## Sprite Files (on main, `docs/art/sprites/`)

24 individual 32×32 PNG files — **NOT strip files**. Each file is a single animation frame.

```
player_idle_1.png    player_idle_2.png    player_idle_3.png     (idle: 3 frames)
player_run_1.png     player_run_2.png     player_run_3.png      player_run_4.png  (run: 4 frames)
player_jump_1.png   player_jump_2.png    player_jump_3.png     player_jump_4.png  (jump: 4 frames)
player_fall_1.png    player_fall_2.png    player_fall_3.png                        (fall: 3 frames)
player_death_1.png  player_death_2.png   player_death_3.png    player_death_4.png (death: 4 frames)
player_victory_1.png player_victory_2.png player_victory_3.png ... player_victory_6.png (victory: 6 frames)
```

Naming convention: `player_{STATE}_{FRAME}.png` where frame index is 1-based.

**Path:** `docs/art/sprites/` — NOT `/art/sprites/` (which has Bug #60 pipeline stubs).

---

## State Machine

Derive animation state from existing v13 variables:

| State | Trigger | Frames | Behavior |
|-------|---------|--------|----------|
| `idle` | `grounded && |vx| < 0.1` | 1–3 | Loop, 300ms/frame |
| `run` | `grounded && |vx| >= 0.1` | 1–4 | Loop, 80ms/frame |
| `jump` | `!grounded && vy < 0` | 1–4 | Loop while rising, hold last on apex |
| `fall` | `!grounded && vy > 0` | 1–3 | Hold while falling |
| `death` | `deathTimer > 0` | 1→4 | Play once, hold frame 4 |
| `victory` | `levelComplete` | 1→6 | Play once, hold frame 6 |

Priority (checked top-to-bottom each frame): death > victory > jump > fall > run > idle.

Facing: `player.facingRight` boolean already exists in v13.

---

## Preload Pattern

```javascript
// 24 individual sprite images — loaded once on init
const playerSprites = {};
const spriteFiles = [
  // idle
  'docs/art/sprites/player_idle_1.png',
  'docs/art/sprites/player_idle_2.png',
  'docs/art/sprites/player_idle_3.png',
  // run
  'docs/art/sprites/player_run_1.png',
  'docs/art/sprites/player_run_2.png',
  'docs/art/sprites/player_run_3.png',
  'docs/art/sprites/player_run_4.png',
  // jump
  'docs/art/sprites/player_jump_1.png',
  'docs/art/sprites/player_jump_2.png',
  'docs/art/sprites/player_jump_3.png',
  'docs/art/sprites/player_jump_4.png',
  // fall
  'docs/art/sprites/player_fall_1.png',
  'docs/art/sprites/player_fall_2.png',
  'docs/art/sprites/player_fall_3.png',
  // death
  'docs/art/sprites/player_death_1.png',
  'docs/art/sprites/player_death_2.png',
  'docs/art/sprites/player_death_3.png',
  'docs/art/sprites/player_death_4.png',
  // victory
  'docs/art/sprites/player_victory_1.png',
  'docs/art/sprites/player_victory_2.png',
  'docs/art/sprites/player_victory_3.png',
  'docs/art/sprites/player_victory_4.png',
  'docs/art/sprites/player_victory_5.png',
  'docs/art/sprites/player_victory_6.png',
];
spriteFiles.forEach(src => {
  const key = src.split('/').pop().replace('.png',''); // e.g. 'player_idle_1'
  playerSprites[key] = new Image();
  playerSprites[key].src = src;
});
```

Load on `init()` or `setupLevel()` — same async pattern as tileImages.

---

## drawPlayer() Implementation

```javascript
function drawPlayer() {
  if (!player || player.dead) return;

  // Determine animation state (top-priority first)
  let state = 'idle';
  if (deathTimer > 0)                       state = 'death';
  else if (levelComplete)                  state = 'victory';
  else if (!player.grounded && player.vy < 0) state = 'jump';
  else if (!player.grounded && player.vy > 0) state = 'fall';
  else if (player.grounded && Math.abs(player.vx) >= 0.1) state = 'run';
  else                                      state = 'idle';

  // Animation clock: reset on state change
  if (!player._animState || player._animState !== state) {
    player._animState = state;
    player._animTime = 0;
    player._animFrame = 1;
  }
  player._animTime += 16; // ~60fps delta

  // Frame count and duration per state
  const stateConfig = {
    idle:    { frames: 3, duration: 300, oneshot: false },
    run:     { frames: 4, duration: 80,  oneshot: false },
    jump:    { frames: 4, duration: 150, oneshot: false },
    fall:    { frames: 3, duration: 150, oneshot: false },
    death:   { frames: 4, duration: 200, oneshot: true  },
    victory: { frames: 6, duration: 200, oneshot: true  },
  };
  const cfg = stateConfig[state];

  // Calculate frame index
  let fi;
  if (cfg.oneshot) {
    fi = Math.min(Math.floor(player._animTime / cfg.duration), cfg.frames - 1);
  } else {
    fi = Math.floor((player._animTime % (cfg.duration * cfg.frames)) / cfg.duration);
    fi = fi % cfg.frames; // ensure wrap
  }

  // Build sprite key: 'player_{state}_{n}' where n is 1-based
  const spriteKey = 'player_' + state + '_' + (fi + 1);
  const img = playerSprites[spriteKey];

  if (!img || !img.complete || !img.naturalWidth) {
    // Fallback: existing fillRect
    ctx.fillStyle = '#00d4ff';
    ctx.fillRect(player.x, player.y, 28, 28);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(player.x + (player.facingRight ? 18 : 2), player.y + 8, 6, 6);
    return;
  }

  ctx.save();
  if (!player.facingRight) {
    // Flip: translate so player centerline is the mirror axis, then scale(-1,1)
    ctx.translate(player.x * 2 + 32, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(img, player.x, player.y, 32, 32);
  ctx.restore();
}
```

**Flip math note:** `player.x * 2 + 32` positions the mirror axis at `player.x + 16` (the player's horizontal center). Zephyr to validate live.

---

## Sign-off Criteria

1. Player orb renders at correct canvas position (match current fillRect position)
2. Idle/run/jump/fall states transition correctly based on input physics
3. Facing direction flips visually — no broken eye placement on left-facing frames
4. Death plays frames 1→4 once, holds on frame 4
5. Victory plays frames 1→6 once, holds on frame 6
6. If sprites fail to load, fallback fillRect renders correctly
7. No regression in physics, movement speed, or collision detection
8. Moving platforms (L4/L5) do not break sprite rendering

---

## Dependencies

- `docs/art/sprites/player_*.png` — 24 files on main
- `prototype_v13.js` — `drawPlayer()` rewrite
- `player` object with: `x`, `y`, `vx`, `vy`, `grounded`, `facingRight`
- State vars: `deathTimer`, `levelComplete`

---

## Out of Scope

- Sprite creation or revision (Bug #58, Bug #61 — art side complete)
- Audio integration (already done)
- Physics changes
- Level layout changes
