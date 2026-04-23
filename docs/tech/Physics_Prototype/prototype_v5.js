/**
 * Dungeon Runner — Physics Prototype v0.5 "Full Audio-Visual"
 * Zephyr | Game Developer | 2026-04-23
 * 
 * INTEGRATION: Cadenza's audio_engine.js + Kairo's sprites + Cedar's palette
 * Trigger IDs: JUMP, LAND, CRYSTAL_COLLECT, DEATH, LEVEL_COMPLETE, PORTAL
 */

const TILE = 32;
const PHYSICS = {
  moveSpeed:  5,
  jumpForce:  3.5,
  gravity:    10,
  maxFall:    8,
  coyoteTime: 0.1,
  jumpBuffer: 0.15,
  pw: 0.8,
  ph: 1.0,
};

const BASE = "https://raw.githubusercontent.com/forge-game-dev/ninfa-engine/main";

// === CANVAS ===
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const W = 512, H = 288;

// === SPRITE ASSET MAP (Kairo) ===
const SPRITES = {
  idle:    ['player_idle_1.png','player_idle_2.png'],
  run:     ['player_run_1.png','player_run_2.png','player_run_3.png','player_run_4.png'],
  jump:    ['player_jump_1.png','player_jump_2.png','player_jump_3.png','player_jump_4.png'],
  fall:    ['player_fall_1.png','player_fall_2.png','player_fall_3.png'],
  death:   ['player_death_1.png','player_death_2.png','player_death_3.png','player_death_4.png'],
  victory: ['player_victory_1.png','player_victory_2.png','player_victory_3.png',
           'player_victory_4.png','player_victory_5.png','player_victory_6.png'],
};

// Preload sprites
const images = {};
let totalSprites = 0, loadedSprites = 0;

Object.entries(SPRITES).forEach(([state, files]) => {
  files.forEach(filename => {
    totalSprites++;
    const img = new Image();
    img.src = `${BASE}/docs/art/sprites/${filename}`;
    img.onload = () => { loadedSprites++; updateLoadingProgress(); };
    img.onerror = () => { loadedSprites++; updateLoadingProgress(); };
    images[filename] = img;
  });
});

// === PALETTE (Cedar confirmed) ===
const C = {
  bg:        '#1a1a2e',
  platDark:   '#4a4a6a',
  platLight:  '#7a7a8a',
  player:    '#00d4ff',
  crystal:   '#ffd700',
  exit:      '#2a9d8f',
  torch:     '#ff9f43',
  text:      '#edf2f4',
};

// === GAME STATE ===
let player, platforms, crystals, torches, exitPortal, levelComplete;
let keys = {};
let lastTime = 0, fps = 60, frameCount = 0, fpsTime = 0;
let animFrame = 0, animTimer = 0;
let playerState = 'idle';
let inputDir = 0;
let audioReady = false;
let wasGrounded = false;

// === INPUT ===
window.addEventListener('keydown', e => {
  // Init audio on first interaction (AudioContext requires user gesture)
  if (!audioReady) {
    audioEngine.init();
    audioReady = true;
  }
  audioEngine.resume();

  keys[e.code] = true;
  if (['Space','ArrowUp','KeyW'].includes(e.code)) {
    player.jumpBuffer = PHYSICS.jumpBuffer;
  }
  if (e.code === 'KeyR') resetLevel();
  e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.code] = false; });

// === LEVEL DATA ===
const LEVEL = {
  name: 'Awakening — Full Audio-Visual',
  spawn: { x: 32, y: 192 },
  platforms: [
    { x: 0,   y: 256, w: 512, h: 32, type: 'solid',     tile: 'platforms/tile_32_floor_a.png' },
    { x: 64,  y: 224, w: 128, h: 32, type: 'solid',     tile: 'platforms/tile_32_floor_a.png' },
    { x: 256, y: 192, w: 128, h: 32, type: 'passthrough', tile: 'platforms/tile_32_floor_a.png' },
    { x: 400, y: 192, w: 96,  h: 32, type: 'solid',     tile: 'platforms/tile_32_floor_a.png' },
  ],
  torches: [
    { x: 64,  y: 192, radius: 2 },
    { x: 320, y: 160, radius: 2 },
  ],
  crystals: [
    { x: 320, y: 160, collected: false, tile: 'collectibles/crystal.png' },
  ],
  exit: { x: 460, y: 192, w: 48, h: 64 },
};

// Load level tile images
const levelImages = {};
LEVEL.platforms.forEach(p => {
  if (p.tile) {
    const img = new Image();
    img.src = `${BASE}/docs/art/tilesets/level_1/${p.tile}`;
    img.onerror = () => {};
    levelImages[p.tile] = img;
  }
});

const crystalImg = new Image();
crystalImg.src = `${BASE}/docs/art/tilesets/level_1/collectibles/crystal.png`;
crystalImg.onerror = () => {};

const portalImg = new Image();
portalImg.src = `${BASE}/docs/art/tilesets/level_1/collectibles/portal.png`;
portalImg.onerror = () => {};

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
    squashX: 1.0,
    squashY: 1.0,
  };
}

function resetLevel() {
  player = createPlayer(LEVEL.spawn.x, LEVEL.spawn.y);
  platforms = LEVEL.platforms.map(p => ({...p}));
  crystals = LEVEL.crystals.map(c => ({...c, collected: false}));
  torches = LEVEL.torches.map(t => ({...t}));
  exitPortal = {...LEVEL.exit};
  levelComplete = false;
  playerState = 'idle';
  animTimer = 0;
  inputDir = 0;
  wasGrounded = false;
}

// === ANIMATION ===
function getSpriteFrame(state, frame) {
  const frames = SPRITES[state];
  if (!frames) return null;
  return images[frames[frame % frames.length]];
}

// === PHYSICS UPDATE ===
function updatePlayer(dt) {
  inputDir = 0;
  if (keys['ArrowLeft']  || keys['KeyA']) inputDir -= 1;
  if (keys['ArrowRight'] || keys['KeyD']) inputDir += 1;

  player.vx = inputDir * PHYSICS.moveSpeed;
  if (inputDir !== 0) player.facing = inputDir;

  player.vy += PHYSICS.gravity * dt;
  if (player.vy > PHYSICS.maxFall) player.vy = PHYSICS.maxFall;

  if (player.jumpBuffer > 0) player.jumpBuffer -= dt;
  if (!player.grounded) player.coyoteTimer -= dt;

  wasGrounded = player.grounded;

  // Jump trigger
  if (player.jumpBuffer > 0 && (player.grounded || player.coyoteTimer > 0)) {
    player.vy = -PHYSICS.jumpForce;
    player.jumpBuffer = 0;
    player.coyoteTimer = 0;
    player.grounded = false;
    playerState = 'jump';
    player.squashX = 1.15;
    player.squashY = 0.85;
    if (audioReady) audioEngine.trigger('JUMP');
  }

  player.x += player.vx * dt * TILE;
  player.y += player.vy * dt * TILE;

  player.grounded = false;
  for (const plat of platforms) {
    resolveCollision(player, plat);
  }

  // Landing detection — AUDIO TRIGGER
  if (player.grounded && !wasGrounded) {
    if (audioReady) audioEngine.trigger('COYOTE_JUMP');
    player.squashX = 0.85;
    player.squashY = 1.15;
    if (audioReady) audioEngine.trigger('LAND');
  }

  // Squash/stretch
  if (player.grounded) {
    player.squashX = Math.min(player.squashX + dt * 4, 1.0);
    player.squashY = Math.min(player.squashY + dt * 4, 1.0);
  } else if (player.vy > 0) {
    player.squashX = 0.90;
    player.squashY = 1.10;
    playerState = 'fall';
  } else if (player.vy < 0) {
    playerState = 'jump';
  }

  // State machine
  if (levelComplete) {
    playerState = 'victory';
  } else if (!player.grounded && player.vy >= 0) {
    playerState = 'fall';
  } else if (!player.grounded && player.vy < 0) {
    playerState = 'jump';
  } else if (player.grounded && inputDir !== 0) {
    playerState = 'run';
  } else {
    playerState = 'idle';
  }

  if (player.y > H + 50) {
    if (audioReady) audioEngine.trigger('DEATH');
    resetLevel();
  }
}

// === AABB ===
function aabb(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}

function resolveCollision(p, plat) {
  if (!aabb(p, plat)) return;

  if (plat.type === 'passthrough') {
    const prevBottom = p.y + p.h - p.vy * (1/60) * TILE;
    if (p.vy <= 0 || prevBottom > plat.y + 2) return;
  }

  const overlapTop    = (p.y + p.h) - plat.y;
  const overlapBottom = (plat.y + plat.h) - p.y;

  if (overlapTop > 0 && overlapTop < overlapBottom && overlapTop < p.h * 0.5) {
    p.y = plat.y - p.h;
    if (p.vy > 0) {
      p.vy = 0;
      p.grounded = true;
      p.coyoteTimer = PHYSICS.coyoteTime;
    }
  } else if (overlapBottom > 0 && overlapBottom < p.h * 0.5) {
    p.y = plat.y + plat.h;
    if (p.vy < 0) p.vy = 0;
  }

  if (aabb(p, plat)) {
    const overlapLeft  = (p.x + p.w) - plat.x;
    const overlapRight = (plat.x + plat.w) - p.x;
    if (overlapLeft < overlapRight && overlapLeft < p.w * 0.5) {
      p.x = plat.x - p.w; p.vx = 0;
    } else if (overlapRight < p.w * 0.5) {
      p.x = plat.x + plat.w; p.vx = 0;
    }
  }
}

// === CRYSTAL + EXIT ===
function checkCrystals() {
  for (const c of crystals) {
    if (!c.collected) {
      const cd = { x: c.x - 8, y: c.y - 8, w: 16, h: 16 };
      if (aabb(player, cd)) {
        c.collected = true;
        if (audioReady) audioEngine.trigger('CRYSTAL_COLLECT');
      }
    }
  }
}

function checkExit() {
  if (crystals.every(c => c.collected) && aabb(player, exitPortal)) {
    levelComplete = true;
    if (audioReady) audioEngine.trigger('LEVEL_COMPLETE');
  }
}

// === LIGHTING ===
function isLit(x, y) {
  for (const t of torches) {
    const d = Math.sqrt((x - t.x)**2 + (y - t.y)**2);
    if (d < t.radius * TILE) return true;
  }
  return false;
}

// === LOADING PROGRESS ===
let loadingEl = null;
function updateLoadingProgress() {
  if (!loadingEl) {
    loadingEl = document.getElementById('loading');
    if (!loadingEl) {
      loadingEl = document.createElement('div');
      loadingEl.id = 'loading';
      loadingEl.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:#00d4ff;font-family:Courier New;font-size:14px;z-index:100;';
      document.body.appendChild(loadingEl);
    }
  }
  loadingEl.textContent = `Loading sprites ${loadedSprites}/${totalSprites}...`;
  if (loadedSprites >= totalSprites && loadingEl) {
    setTimeout(() => { if (loadingEl) loadingEl.style.display='none'; }, 500);
  }
}

// === RENDER ===
function render() {
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#252540';
  ctx.fillRect(0, 0, W, H);

  // Platforms
  for (const p of platforms) {
    const img = levelImages[p.tile];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, p.x, p.y, p.w, p.h);
    } else {
      ctx.fillStyle = p.type === 'passthrough' ? C.platLight : C.platDark;
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = C.platLight;
      ctx.fillRect(p.x, p.y, p.w, 2);
    }
  }

  // Torches
  for (const t of torches) {
    ctx.fillStyle = '#5a3a1a';
    ctx.fillRect(t.x - 3, t.y - 12, 6, 16);
    const lit = isLit(player.x + player.w/2, player.y + player.h/2);
    ctx.fillStyle = C.torch;
    ctx.shadowColor = C.torch;
    ctx.shadowBlur = lit ? 12 : 6;
    ctx.beginPath();
    ctx.ellipse(t.x, t.y - 14, 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = `rgba(255,159,67,${lit ? 0.3 : 0.1})`;
    ctx.lineWidth = 1;
    ctx.setLineDash([4,4]);
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.radius * TILE, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Crystals
  for (const c of crystals) {
    if (!c.collected) {
      if (crystalImg.complete && crystalImg.naturalWidth > 0) {
        ctx.drawImage(crystalImg, c.x - 8, c.y - 8, 16, 16);
      } else {
        ctx.fillStyle = C.crystal;
        ctx.shadowColor = C.crystal;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y - 8);
        ctx.lineTo(c.x + 6, c.y);
        ctx.lineTo(c.x, c.y + 8);
        ctx.lineTo(c.x - 6, c.y);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }

  // Exit portal
  if (crystals.every(c => c.collected)) {
    if (portalImg.complete && portalImg.naturalWidth > 0) {
      ctx.drawImage(portalImg, exitPortal.x, exitPortal.y, exitPortal.w, exitPortal.h);
    } else {
      ctx.fillStyle = C.exit;
      ctx.shadowColor = C.exit;
      ctx.shadowBlur = 20;
      ctx.fillRect(exitPortal.x, exitPortal.y, exitPortal.w, exitPortal.h);
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px Courier';
      ctx.textAlign = 'center';
      ctx.fillText('EXIT', exitPortal.x + exitPortal.w/2, exitPortal.y + exitPortal.h/2 + 3);
      ctx.shadowBlur = 0;
    }
  }

  // Player sprite
  const sprite = getSpriteFrame(playerState, animFrame);
  if (sprite && sprite.complete && sprite.naturalWidth > 0) {
    const cx = player.x + player.w / 2;
    const cy = player.y + player.h / 2;
    const sw = 32 * player.squashX;
    const sh = 32 * player.squashY;
    ctx.save();
    ctx.translate(cx, cy);
    if (player.facing < 0) ctx.scale(-1, 1);
    ctx.drawImage(sprite, -sw/2, -sh/2, sw, sh);
    ctx.restore();
  } else {
    const cx = player.x + player.w / 2;
    const cy = player.y + player.h / 2;
    const vw = player.w * player.squashX;
    const vh = player.h * player.squashY;
    ctx.fillStyle = C.player;
    ctx.shadowColor = C.player;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.ellipse(cx, cy, vw/2, vh/2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Collision box
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 1;
  ctx.setLineDash([2,2]);
  ctx.strokeRect(player.x, player.y, player.w, player.h);
  ctx.setLineDash([]);

  // Lighting overlay
  for (const t of torches) {
    if (!isLit(t.x, t.y)) {
      ctx.fillStyle = 'rgba(26,26,46,0.3)';
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.radius * TILE, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Audio indicator
  if (audioReady) {
    ctx.fillStyle = 'rgba(0,200,100,0.7)';
    ctx.font = '9px Courier';
    ctx.textAlign = 'left';
    ctx.fillText('🔊 audio ready', 8, H - 8);
  } else {
    ctx.fillStyle = 'rgba(255,100,100,0.7)';
    ctx.font = '9px Courier';
    ctx.textAlign = 'left';
    ctx.fillText('🔇 press key to enable audio', 8, H - 8);
  }

  // Level complete
  if (levelComplete) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = C.exit;
    ctx.font = 'bold 24px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('LEVEL COMPLETE!', W/2, H/2);
    ctx.font = '14px Courier New';
    ctx.fillStyle = C.text;
    ctx.fillText('Press R to restart', W/2, H/2 + 30);
    ctx.font = '10px Courier';
    ctx.fillStyle = '#888';
    ctx.fillText('LEVEL_COMPLETE triggered — Cadenza audio active', W/2, H/2 + 50);
  }
}

// === DEBUG ===
function updateDebug() {
  const el = id => document.getElementById(id);
  if (!el('fps')) return;
  el('fps').textContent = fps;
  el('px').textContent = Math.round(player.x);
  el('py').textContent = Math.round(player.y);
  el('vx').textContent = player.vx.toFixed(2);
  el('vy').textContent = player.vy.toFixed(2);
  el('gr').textContent = player.grounded;
  el('ct').textContent = Math.max(0, player.coyoteTimer).toFixed(2);
  el('jb').textContent = Math.max(0, player.jumpBuffer).toFixed(2);
  el('cr').textContent = crystals.filter(c => c.collected).length;
}

// === GAME LOOP ===
function gameLoop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;

  frameCount++;
  fpsTime += dt;
  if (fpsTime >= 1) {
    fps = Math.round(frameCount / fpsTime);
    frameCount = 0;
    fpsTime = 0;
  }

  animTimer += dt;
  if (animTimer >= 0.12) { animFrame++; animTimer = 0; }

  if (!levelComplete) {
    updatePlayer(dt);
    checkCrystals();
    checkExit();
  }

  render();
  updateDebug();
  requestAnimationFrame(gameLoop);
}

// === INIT ===
resetLevel();
requestAnimationFrame(ts => { lastTime = ts; requestAnimationFrame(gameLoop); });
