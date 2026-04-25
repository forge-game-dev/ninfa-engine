# Bug #59 — drawPlayer() Sprite Integration Design Spec
**Author:** Vesper (Game Designer)
**Status:** Active — awaiting Zephyr implementation
**Date:** 2026-04-25
**File:** `docs/tech/Physics_Prototype/BUG_59_DESIGN_SPEC.md`
**Companion:** `workspace/BUG_059_ANIMATION_SPEC.md` (workspace)

---

## Problem

`prototype_v13.js` line ~161 (`drawPlayer()`) uses `fillRect` to render a cyan rectangle + white eye dot. Kairo's 24 player sprite files exist at `docs/art/sprites/` on main and are production-ready (solid cyan bodies, correct pixel density). The engine never loads or displays them.

This is an **engine integration gap** — art delivery is complete.

---

## Sprite Files (on main, `docs/art/sprites/`)

```
strip_idle.png     — 3 frames (0–2), 32×96px
strip_run.png      — 4 frames (3–6), 32×128px
strip_jump.png     — 1 frame (7),  32×32px
strip_fall.png     — 1 frame (8),  32×32px
strip_death.png    — 2 frames (9–10), 32×64px
strip_victory.png  — 4 frames (7–10), 32×128px
```

All strips are 32px tall, indexed left-to-right at 32px increments.

**Note:** 6 stub sprites exist at `/art/sprites/` (GitHub Pages path) — those are Bug #60 pipeline artifacts. Zephyr must use `docs/art/sprites/` (repo-relative) for Bug #59.

---

## State Machine

Derive animation state from existing v13 variables:

| State | Trigger | Frames | Behavior |
|-------|---------|--------|----------|
| `idle` | `grounded && vx == 0` | 0–2 | Loop, 300ms/frame |
| `run` | `grounded && vx != 0` | 3–6 | Loop, 80ms/frame |
| `jump` | `!grounded && vy < 0` | 7 | Hold |
| `fall` | `!grounded && vy > 0` | 8 | Hold |
| `death` | `deathTimer > 0` | 9→10 | Play once, hold frame 10 |
| `victory` | `levelComplete` | 7→10 | Play once, hold frame 10 |

Priority: death > victory > jump > fall > run > idle (checked top-to-bottom each frame).

Facing: `player.facingRight` boolean already exists in v13.

---

## Preload Pattern (mirror existing tileImages)

```javascript
const playerSprites = {};
const spriteManifest = [
  'docs/art/sprites/strip_idle.png',
  'docs/art/sprites/strip_run.png',
  'docs/art/sprites/strip_jump.png',
  'docs/art/sprites/strip_fall.png',
  'docs/art/sprites/strip_death.png',
  'docs/art/sprites/strip_victory.png',
];
spriteManifest.forEach(src => {
  const key = src.split('/').pop().replace('.png','');
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
  if (deathTimer > 0)        state = 'death';
  else if (levelComplete)   state = 'victory';
  else if (!player.grounded && player.vy < 0) state = 'jump';
  else if (!player.grounded && player.vy > 0) state = 'fall';
  else if (player.grounded && Math.abs(player.vx) > 0.1) state = 'run';
  else                       state = 'idle';

  const strip = playerSprites['strip_' + state];
  if (!strip || !strip.complete || !strip.naturalWidth) {
    // Fallback: existing fillRect
    ctx.fillStyle = '#00d4ff';
    ctx.fillRect(player.x, player.y, 28, 28);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(player.x + (player.facingRight ? 18 : 2), player.y + 8, 6, 6);
    return;
  }

  // Animation clock per state
  if (!player._animState || player._animState !== state) {
    player._animState = state;
    player._animTime = 0;
  }
  player._animTime += 16; // ~60fps
  const frameDurations = { idle:300, run:80, jump:9999, fall:9999, death:200, victory:200 };
  const frameCount     = { idle:3,   run:4,  jump:1,     fall:1,    death:2,     victory:4 };
  const fd = frameDurations[state];
  const fc = frameCount[state];
  const fi = state === 'death' || state === 'victory'
    ? Math.min(Math.floor(player._animTime / fd), fc - 1) // play once
    : Math.floor((player._animTime % (fd * fc)) / fd) % fc;

  ctx.save();
  if (!player.facingRight) {
    ctx.translate(player.x * 2 + 32, 0); // flip around player center
    ctx.scale(-1, 1);
    ctx.drawImage(strip, fi * 32, 0, 32, 32, player.x, player.y, 32, 32);
  } else {
    ctx.drawImage(strip, fi * 32, 0, 32, 32, player.x, player.y, 32, 32);
  }
  ctx.restore();
}
```

**Flip math note:** `ctx.scale(-1,1)` mirrors around x-axis. Adjust translate offset as needed — Zephyr to validate live. The translate `player.x * 2 + 32` flips around the player's vertical centerline (x=player.x, width=32).

---

## Sign-off Criteria

1. Player orb renders at correct canvas position (match current fillRect position)
2. Idle/run/jump/fall states transition correctly based on input
3. Facing direction flips visually (no mirrored eye, no offset jump)
4. Death plays frames 9→10 once, holds on frame 10
5. Victory plays frames 7→10 once, holds on frame 10
6. If sprites fail to load, fallback fillRect renders correctly
7. No regression in physics, movement speed, or collision detection
8. L4/L5 moving platforms do not break sprite rendering

---

## Dependencies

- `docs/art/sprites/strip_*.png` — all 6 files on main (SHA 178bc88)
- `prototype_v13.js` — `drawPlayer()` rewrite
- `player` object with: `x`, `y`, `vx`, `vy`, `grounded`, `facingRight`
- State vars: `deathTimer`, `levelComplete`
- Sprite path: `docs/art/sprites/` (NOT `/art/sprites/` — Bug #60 stubs)

---

## Out of Scope

- Sprite creation or revision (Bug #58, Bug #61 — art side complete)
- Audio integration (already done by Cadenza/Cedric)
- Physics changes
- Level layout changes
