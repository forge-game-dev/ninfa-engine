// === PROTOTYPE v6 — Crystal Proximity Integration ===
// Changes from v5: audioEngine.setProximityTarget / updateProximity wired
const W = 800, H = 600;
let player, platforms, crystals, torches, exitPortal, levelComplete;
const keys = {};
let audioReady = false;
const canvas = document.getElementById('c'), ctx = canvas.getContext('2d');
canvas.width = W; canvas.height = H;

// === TILE RENDERER (Cedar's naming) ===
function drawTile(t, x, y) {
  // fallback colored tile until real sprites load
  const colors = { f:'#5a5a7a', w:'#3a3a5a', p:'#4a4a6a', e:'#2a2a4a', c:'#6a6a9a', h:'#7a7aaa' };
  ctx.fillStyle = colors[t[0]] || '#333';
  ctx.fillRect(x*32, y*32, 32, 32);
  if (t[1]) { ctx.strokeStyle='rgba(255,255,255,0.1)'; ctx.strokeRect(x*32, y*32, 32, 32); }
}

// === CONSTANTS (canonical from GDD) ===
const PHYSICS = { gravity:10, maxFall:8, speed:5, jumpForce:10, coyoteTime:0.1, jumpBuffer:0.15, passthrough:1 };
const C = { player:'#00d4ff', crystal:'#ffffff', exit:'#00ff88', torch:'#ff9f43', bg:'#16213e', plat:'#4a4a6a' };

// === LOADING ===
const TEX = { player:'img/player.png', crystal:'img/crystal.png', portal:'img/portal.png', torch:'img/torch.png', tileFloor:'img/tile_floor_a.png' };
const loaded = {}, imgs = {}, loadedSprites = 0;
Object.values(TEX).forEach(u => {
  const img = new Image(); img.src = u;
  img.onload = img.onerror = () => { loaded[u]=true; loadedSprites++; updateLoadingProgress(); };
  imgs[u] = img;
});

function updateLoadingProgress() {
  const p = document.getElementById('p');
  if(p) p.textContent = `Loading... ${loadedSprites}/${Object.keys(TEX).length}`;
}

// === INPUT ===
window.addEventListener('keydown', e => {
  if (!audioReady) { audioEngine.init(); audioReady = true; }
  audioEngine.resume();
  keys[e.code] = true;
  if (['Space','ArrowUp','KeyW'].includes(e.code)) player.jumpBuffer = PHYSICS.jumpBuffer;
  if (e.code === 'KeyR') resetLevel();
  e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.code] = false; });

function el(id) { return document.getElementById(id); }

// === PLAYER ===
function createPlayer(x, y) {
  return { x, y, vx:0, vy:0, w:26, h:32, onGround:false, coyoteTimer:0,
           jumpBuffer:0, facingRight:true, state:'idle', animFrame:0, squash:1 };
}

function updatePlayer(dt) {
  // horizontal
  player.vx = 0;
  if (keys['ArrowLeft'] || keys['KeyA'])  { player.vx = -PHYSICS.speed; player.facingRight = false; }
  if (keys['ArrowRight']|| keys['KeyD'])  { player.vx =  PHYSICS.speed; player.facingRight = true;  }

  // state
  player.state = (player.onGround ? (player.vx ? 'run' : 'idle') : 'jump');

  // gravity
  player.vy = Math.min(player.vy + PHYSICS.gravity * dt, PHYSICS.maxFall);
  player.onGround = false;

  // coyote
  if (player.onGround) player.coyoteTimer = PHYSICS.coyoteTime;
  else player.coyoteTimer -= dt;

  // jump buffer
  player.jumpBuffer -= dt;

  // jump
  if (keys['Space'] || keys['ArrowUp'] || keys['KeyW']) {
    if (player.jumpBuffer > 0 && player.coyoteTimer > 0) {
      player.vy = -PHYSICS.jumpForce;
      player.onGround = false;
      player.coyoteTimer = 0;
      player.jumpBuffer = 0;
      player.state = 'jump';
      player.squash = 1.2;
      if (audioReady) audioEngine.trigger('COYOTE_JUMP');
    }
  }

  // move
  player.x += player.vx * dt * 60;
  player.y += player.vy * dt * 60;

  // squash/stretch animation
  if (player.squash !== 1) player.squash = Math.max(1, player.squash - dt * 4);

  // collision
  for (const p of platforms) {
    if (p.type === 'passthrough') continue;
    if (player.x < p.x+p.w && player.x+player.w > p.x &&
        player.y < p.y+p.h && player.y+player.h > p.y) {
      const ox = player.x+player.w/2 - (p.x+p.w/2);
      const oy = player.y+player.h/2 - (p.y+p.h/2);
      if (Math.abs(ox) > Math.abs(oy)) {
        if (ox < 0) { player.x = p.x - player.w; player.vx = 0; }
        else          { player.x = p.x + p.w;   player.vx = 0; }
      } else {
        if (oy < 0) { player.y = p.y - player.h; player.vy = 0; player.onGround = true; }
        else          { player.y = p.y + p.h;     player.vy > 0 && (player.vy *= 0.5); }
      }
    }
  }

  // platform passthrough
  for (const p of platforms) {
    if (p.type === 'passthrough' && player.vy > 0) {
      const inX = player.x < p.x+p.w && player.x+player.w > p.x;
      const crossTop = player.y + player.h >= p.y && player.y + player.h <= p.y + 10;
      if (inX && crossTop && keys['ArrowDown']) { player.onGround = false; }
      else if (inX && crossTop && player.vy >= 0) { player.y = p.y - player.h; player.vy = 0; player.onGround = true; }
    }
  }

  // crystal collect
  for (const c of crystals) {
    if (!c.collected && player.x < (c.x*32+16) && player.x+player.w > c.x*32-16 &&
        player.y < (c.y*32+16) && player.y+player.h > c.y*32-16) {
      c.collected = true;
      if (audioReady) audioEngine.trigger('CRYSTAL_COLLECT');
    }
  }

  // torch collect
  for (const t of torches) {
    if (!t.collected && player.x < t.x+24 && player.x+player.w > t.x-24 &&
        player.y < t.y+24 && player.y+player.h > t.y-24) {
      t.collected = true;
    }
  }

  // exit
  if (crystals.every(c => c.collected) &&
      player.x < exitPortal.x+exitPortal.w && player.x+player.w > exitPortal.x &&
      player.y < exitPortal.y+exitPortal.h && player.y+player.h > exitPortal.y) {
    levelComplete = true;
    if (audioReady) audioEngine.trigger('LEVEL_COMPLETE');
  }

  // death
  if (player.y > H + 50) {
    if (audioReady) audioEngine.trigger('DEATH');
    resetLevel();
  }
}

function drawPlayer() {
  const { x, y, w, h, squash, facingRight, state } = player;
  const sw = w * squash, sh = h / squash;
  const ox = (w - sw) / 2, oy = h - sh;
  ctx.save();
  if (!facingRight) { ctx.translate(x + w/2, 0); ctx.scale(-1,1); ctx.translate(-(x + w/2), 0); }
  if (imgs[TEX.player] && imgs[TEX.player].naturalWidth) ctx.drawImage(imgs[TEX.player], x+ox, y+oy, sw, sh);
  else { ctx.fillStyle = C.player; ctx.shadowColor = C.player; ctx.shadowBlur = 12; ctx.fillRect(x+ox, y+oy, sw, sh); }
  ctx.shadowBlur = 0; ctx.restore();
}

function drawCrystals() {
  for (const c of crystals) {
    if (c.collected) continue;
    const cx = c.x*32, cy = c.y*32;
    ctx.save(); ctx.translate(cx+16, cy+16);
    ctx.rotate(Date.now() / 2000);
    ctx.fillStyle = '#fff'; ctx.shadowColor = '#fff'; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.moveTo(0,-10); ctx.lineTo(8,0); ctx.lineTo(0,10); ctx.lineTo(-8,0); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
}

function drawTorches() {
  for (const t of torches) {
    if (t.collected) continue;
    ctx.fillStyle = C.torch; ctx.shadowColor = C.torch; ctx.shadowBlur = 15;
    ctx.fillRect(t.x-4, t.y-20, 8, 24);
    ctx.shadowBlur = 0;
  }
}

// === LEVEL 1 ===
const LEVEL = {
  tiles: [
    "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    "f..............................................................................................................f",
    "f..............................................................................................................f",
    "f.....c........................................................c..............................................f",
    "f..............................................................................................................f",
    "f.....p........................................................p..............................................f",
    "f..............................................................................................................f",
    "f.....p........................................................p..............................................f",
    "f............................................................t..................................................f",
    "fppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp",
  ],
  spawn: { x: 50, y: 500 },
  crystals: [
    { x: 4, y: 4 }, { x: 8, y: 4 }, { x: 12, y: 4 }, { x: 16, y: 4 }, { x: 20, y: 4 },
    { x: 24, y: 4 }, { x: 28, y: 4 }, { x: 32, y: 4 }, { x: 36, y: 4 }, { x: 40, y: 4 },
  ],
  torches: [
    { x: 400, y: 464 }
  ],
  exit: { x: 730, y: 480, w: 40, h: 40 }
};

function initLevel() {
  platforms = [];
  for (let y = 0; y < LEVEL.tiles.length; y++)
    for (let x = 0; x < LEVEL.tiles[y].length; x++) {
      const t = LEVEL.tiles[y][x];
      if (t !== '.' && t !== 'c' && t !== 't') {
        const pt = (t === 'p') ? 'passthrough' : 'solid';
        platforms.push({ x: x*32, y: y*32, w: 32, h: 32, type: pt });
      }
    }
  crystals = LEVEL.crystals.map(c => ({...c, collected: false}));
  torches = LEVEL.torches.map(t => ({...t, collected: false}));
  exitPortal = {...LEVEL.exit};
  player = createPlayer(LEVEL.spawn.x, LEVEL.spawn.y);
  levelComplete = false;

  // === PROXIMITY: wire crystal proximity system ===
  // After crystals array is set, hand it to the audio engine
  if (window.audioEngine && audioReady) {
    audioEngine.setProximityTarget(player, crystals);
  }
}

function resetLevel() {
  if (window.audioEngine) audioEngine.stopProximity();
  initLevel();
}

// === GAME LOOP ===
let lastTime = 0, fps = 0, frameCount = 0, fpsTime = 0, animTimer = 0, animFrame = 0;

function gameLoop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;
  frameCount++;
  fpsTime += dt;
  if (fpsTime >= 1) { fps = Math.round(frameCount / fpsTime); frameCount = 0; fpsTime = 0; }
  animTimer += dt; if (animTimer >= 0.12) { animFrame++; animTimer = 0; }

  if (!levelComplete) {
    updatePlayer(dt);
    // === PROXIMITY: update every frame ===
    if (window.audioEngine && audioReady) audioEngine.updateProximity();
    checkCrystals();
    checkExit();
  }

  render();
  if (el('fps')) el('fps').textContent = fps;
  if (el('x')) el('x').textContent = Math.round(player.x);
  if (el('y')) el('y').textContent = Math.round(player.y);
  if (el('vy')) el('vy').textContent = player.vy.toFixed(1);
  if (el('jb')) el('jb').textContent = Math.max(0, player.jumpBuffer).toFixed(2);
  if (el('cr')) el('cr').textContent = crystals.filter(c => c.collected).length;
  requestAnimationFrame(gameLoop);
}

function checkCrystals() {
  // handled in updatePlayer
}

function checkExit() {
  // handled in updatePlayer
}

function aabb(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function render() {
  // bg
  ctx.fillStyle = '#16213e';
  ctx.fillRect(0, 0, W, H);

  // torch glow
  for (const t of torches) {
    if (t.collected) continue;
    const grad = ctx.createRadialGradient(t.x, t.y-16, 0, t.x, t.y-16, 96);
    grad.addColorStop(0, 'rgba(255,159,67,0.25)'); grad.addColorStop(1, 'rgba(255,159,67,0)');
    ctx.fillStyle = grad; ctx.fillRect(t.x-96, t.y-112, 192, 192);
  }

  // platforms
  for (const p of platforms) {
    if (p.type === 'passthrough') { ctx.fillStyle = 'rgba(74,74,106,0.7)'; }
    else { ctx.fillStyle = '#4a4a6a'; }
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
    ctx.strokeRect(p.x, p.y, p.w, p.h);
  }

  // exit
  if (crystals.every(c => c.collected)) {
    if (imgs[TEX.portal] && imgs[TEX.portal].naturalWidth)
      ctx.drawImage(imgs[TEX.portal], exitPortal.x, exitPortal.y, exitPortal.w, exitPortal.h);
    else { ctx.fillStyle = '#00ff88'; ctx.shadowColor = '#00ff88'; ctx.shadowBlur = 20; ctx.fillRect(exitPortal.x, exitPortal.y, exitPortal.w, exitPortal.h); ctx.shadowBlur = 0; }
  }

  drawCrystals();
  drawTorches();
  drawPlayer();
}

initLevel();
requestAnimationFrame(gameLoop);
