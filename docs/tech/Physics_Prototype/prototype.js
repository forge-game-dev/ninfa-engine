/**
 * Dungeon Runner — Physics Prototype v0.1
 * Zephyr | Game Developer | 2026-04-23
 * 
 * Validates: movement, jump, coyote time, jump buffer, passthrough platforms
 */

// === CONSTANTS ===
const TILE = 32; // 1 unit = 32px
const PHYSICS = {
  moveSpeed:  5,      // units/second
  jumpForce:   3.5,    // initial Y velocity (up = negative)
  gravity:     10,     // units/s²
  maxFall:     8,      // terminal velocity
  coyoteTime:  0.1,    // seconds
  jumpBuffer:  0.15,   // seconds
  pw: 0.8,            // player width (units)
  ph: 1.0,            // player height (units)
};

// === CANVAS SETUP ===
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

// === COLORS (from palette) ===
const C = {
  bg:        '#1a1a2e',
  platDark:   '#16213e',
  platLight:  '#0f3460',
  player:    '#00d4ff',
  crystal:    '#4fc3f7',
  exit:       '#2a9d8f',
  text:       '#edf2f4',
};

// === GAME STATE ===
let player, platforms, crystals, exit, levelComplete;
let keys = {};
let lastTime = 0;
let frameCount = 0;
let fps = 60;
let fpsTime = 0;

// === INPUT ===
window.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (['Space','ArrowUp','KeyW'].includes(e.code)) {
    player.jumpBuffer = PHYSICS.jumpBuffer; // queue jump
  }
  if (e.code === 'KeyR') resetLevel();
  e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.code] = false; });

// === PLAYER ===
function createPlayer(x, y) {
  return {
    x, y,
    w: PHYSICS.pw * TILE,
    h: PHYSICS.ph * TILE,
    vx: 0, vy: 0,
    grounded: false,
    coyoteTimer: 0,
    jumpBuffer: 0,
    facing: 1,
  };
}

// === ENTITIES ===
const LEVEL = {
  spawn: { x: 32, y: 192 },
  platforms: [
    { x: 0,   y: 256, w: 512, h: 32, type: 'solid' },     // ground
    { x: 64,  y: 224, w: 128, h: 32, type: 'solid' },     // plat A
    { x: 256, y: 192, w: 128, h: 32, type: 'passthrough' },// plat B
    { x: 400, y: 192, w: 96,  h: 32, type: 'solid' },     // plat C
  ],
  crystals: [
    { x: 320, y: 160, collected: false },
  ],
  exit: { x: 460, y: 192, w: 40, h: 40 },
};

function resetLevel() {
  player = createPlayer(LEVEL.spawn.x, LEVEL.spawn.y);
  platforms = LEVEL.platforms.map(p => ({...p}));
  crystals = LEVEL.crystals.map(c => ({...c, collected: false}));
  exit = {...LEVEL.exit};
  levelComplete = false;
}

// === PHYSICS UPDATE ===
function updatePlayer(dt) {
  // Horizontal movement
  let dir = 0;
  if (keys['ArrowLeft']  || keys['KeyA']) dir -= 1;
  if (keys['ArrowRight'] || keys['KeyD']) dir += 1;
  player.vx = dir * PHYSICS.moveSpeed;
  if (dir !== 0) player.facing = dir;

  // Gravity
  player.vy += PHYSICS.gravity * dt;
  if (player.vy > PHYSICS.maxFall) player.vy = PHYSICS.maxFall;

  // Timers
  if (player.jumpBuffer > 0) player.jumpBuffer -= dt;
  if (!player.grounded) player.coyoteTimer -= dt;

  // Jump (coyote + buffer)
  if (player.jumpBuffer > 0 && (player.grounded || player.coyoteTimer > 0)) {
    player.vy = -PHYSICS.jumpForce;
    player.jumpBuffer = 0;
    player.coyoteTimer = 0;
    player.grounded = false;
  }

  // Apply velocity
  player.x += player.vx * dt * TILE;
  player.y += player.vy * dt * TILE;

  // Collision
  player.grounded = false;
  for (const plat of platforms) {
    resolveCollision(player, plat);
  }

  // Boundary check (fall off screen = reset)
  if (player.y > H + 50) resetLevel();
}

// === AABB COLLISION ===
function aabb(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}

function resolveCollision(p, plat) {
  if (!aabb(p, plat)) return;

  // Passthrough: only collide from above when falling
  if (plat.type === 'passthrough') {
    const prevBottom = p.y + p.h - p.vy * (1/60) * TILE;
    if (p.vy <= 0 || prevBottom > plat.y + 2) return;
  }

  // Y resolution first
  const overlapTop    = (p.y + p.h) - plat.y;
  const overlapBottom = (plat.y + plat.h) - p.y;

  if (overlapTop > 0 && overlapTop < overlapBottom && overlapTop < p.h * 0.5) {
    // Landing on top
    p.y = plat.y - p.h;
    if (p.vy > 0) {
      p.vy = 0;
      p.grounded = true;
      p.coyoteTimer = PHYSICS.coyoteTime;
    }
  } else if (overlapBottom > 0 && overlapBottom < p.h * 0.5) {
    // Hit from below
    p.y = plat.y + plat.h;
    if (p.vy < 0) p.vy = 0;
  }

  // X resolution
  if (aabb(p, plat)) {
    const overlapLeft  = (p.x + p.w) - plat.x;
    const overlapRight = (plat.x + plat.w) - p.x;
    if (overlapLeft < overlapRight && overlapLeft < p.w * 0.5) {
      p.x = plat.x - p.w;
      p.vx = 0;
    } else if (overlapRight < p.w * 0.5) {
      p.x = plat.x + plat.w;
      p.vx = 0;
    }
  }
}

// === CRYSTAL COLLECTION ===
function checkCrystals() {
  for (const c of crystals) {
    if (!c.collected) {
      const cd = { x: c.x - 8, y: c.y - 8, w: 16, h: 16 };
      if (aabb(player, cd)) c.collected = true;
    }
  }
}

// === EXIT CHECK ===
function checkExit() {
  if (crystals.every(c => c.collected) && aabb(player, exit)) {
    levelComplete = true;
  }
}

// === RENDER ===
function draw() {
  // Background
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);

  // Platforms
  for (const p of platforms) {
    ctx.fillStyle = p.type === 'passthrough' ? C.platLight : C.platDark;
    ctx.fillRect(p.x, p.y, p.w, p.h);
    // Top edge highlight
    ctx.fillStyle = C.platLight;
    ctx.fillRect(p.x, p.y, p.w, 2);
  }

  // Crystals
  for (const c of crystals) {
    if (!c.collected) {
      ctx.fillStyle = C.crystal;
      ctx.beginPath();
      ctx.moveTo(c.x, c.y - 8);
      ctx.lineTo(c.x + 6, c.y);
      ctx.lineTo(c.x, c.y + 8);
      ctx.lineTo(c.x - 6, c.y);
      ctx.closePath();
      ctx.fill();
      // Glow
      ctx.shadowColor = C.crystal;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Exit (if all crystals collected)
  if (crystals.every(c => c.collected)) {
    ctx.fillStyle = C.exit;
    ctx.fillRect(exit.x, exit.y, exit.w, exit.h);
  }

  // Player
  ctx.fillStyle = C.player;
  ctx.fillRect(player.x, player.y, player.w, player.h);
  // Glow effect
  ctx.shadowColor = C.player;
  ctx.shadowBlur = 15;
  ctx.fillRect(player.x, player.y, player.w, player.h);
  ctx.shadowBlur = 0;

  // Level complete
  if (levelComplete) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = C.exit;
    ctx.font = 'bold 24px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('LEVEL COMPLETE!', W/2, H/2);
    ctx.font = '14px Courier New';
    ctx.fillStyle = C.text;
    ctx.fillText('Press R to restart', W/2, H/2 + 30);
  }
}

// === DEBUG UI ===
function updateDebug() {
  document.getElementById('fps').textContent = fps;
  document.getElementById('px').textContent = Math.round(player.x);
  document.getElementById('py').textContent = Math.round(player.y);
  document.getElementById('vx').textContent = player.vx.toFixed(2);
  document.getElementById('vy').textContent = player.vy.toFixed(2);
  document.getElementById('gr').textContent = player.grounded;
  document.getElementById('ct').textContent = Math.max(0, player.coyoteTimer).toFixed(2);
  document.getElementById('jb').textContent = Math.max(0, player.jumpBuffer).toFixed(2);
  document.getElementById('cr').textContent = crystals.filter(c => c.collected).length;
}

// === GAME LOOP ===
function gameLoop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;

  // FPS counter
  frameCount++;
  fpsTime += dt;
  if (fpsTime >= 1) {
    fps = Math.round(frameCount / fpsTime);
    frameCount = 0;
    fpsTime = 0;
  }

  if (!levelComplete) {
    updatePlayer(dt);
    checkCrystals();
    checkExit();
  }

  draw();
  updateDebug();
  requestAnimationFrame(gameLoop);
}

// === INIT ===
resetLevel();
requestAnimationFrame(ts => { lastTime = ts; requestAnimationFrame(gameLoop); });
