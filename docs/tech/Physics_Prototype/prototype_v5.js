// === PROTOTYPE v7 — Full Sprite Animation System ===
// Sprite timing per Kairo spec (CHARACTER_SHEET_ORB_v0.1.md)
const W = 800, H = 600;
let player, platforms, crystals, torches, exitPortal, levelComplete;
const keys = {};
let audioReady = false;
const canvas = document.getElementById('c'), ctx = canvas.getContext('2d');
canvas.width = W; canvas.height = H;

const SPRITE_BASE = 'https://raw.githubusercontent.com/forge-game-dev/ninfa-engine/main/docs/art/sprites/';
const SPRITE_MAP = {
  idle:   ['player_idle_1.png','player_idle_2.png'],
  run:    ['player_run_1.png','player_run_2.png','player_run_3.png','player_run_4.png'],
  jump:   ['player_jump_1.png','player_jump_2.png','player_jump_3.png','player_jump_4.png'],
  fall:   ['player_fall_1.png','player_fall_2.png','player_fall_3.png'],
  death:  ['player_death_1.png','player_death_2.png','player_death_3.png','player_death_4.png'],
  victory:['player_victory_1.png','player_victory_2.png','player_victory_3.png',
          'player_victory_4.png','player_victory_5.png','player_victory_6.png']
};

// Kairo's exact timing (seconds per frame)
const SPRITE_DUR = { idle:0.5, run:0.1, jump:0.1, fall:0.1, death:0.15, victory:0.2 };

// Loops: idle/run/victory loop; jump/fall/death play once then lock on last frame
const SPRITE_LOOPS = { idle:true, run:true, jump:false, fall:false, death:false, victory:true };

// Glow: 5% outer ring (#00d4ff) decorative only; 15% on victory
const GLOW_ALPHA = { idle:0.05, run:0.05, jump:0.05, fall:0.05, death:0.05, victory:0.15 };

// Squash/stretch per Kairo spec (0.85x–1.15x range)
const SQUASH_MAP = {
  idle:{sx:1.0,sy:1.0}, run:{sx:0.95,sy:1.05}, jump:{sx:0.85,sy:1.15},
  fall:{sx:1.1,sy:0.9}, death:{sx:1.2,sy:0.8}, victory:{sx:0.9,sy:1.1}
};

const spriteImgs = {};
let spriteLoadCount = 0, spriteTotal = 0;
Object.entries(SPRITE_MAP).forEach(([state, files]) => {
  spriteImgs[state] = [];
  files.forEach(fn => {
    spriteTotal++;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = SPRITE_BASE + fn;
    img.onload = img.onerror = () => { spriteLoadCount++; updateLoadingProgress(); };
    spriteImgs[state].push(img);
  });
});

const PHYSICS = { gravity:10, maxFall:8, speed:5, jumpForce:10, coyoteTime:0.1, jumpBuffer:0.15 };
const C = { player:'#00d4ff', crystal:'#fff', exit:'#00ff88', torch:'#ff9f43', bg:'#16213e' };

function updateLoadingProgress() {
  const p = document.getElementById('p');
  const total = spriteTotal + 3;
  if(p) p.textContent = `Loading sprites... ${spriteLoadCount}/${spriteTotal}`;
}

window.addEventListener('keydown', e => {
  if (!audioReady) { audioEngine.init(); audioReady = true; }
  audioEngine.resume();
  keys[e.code] = true;
  if (['Space','ArrowUp','KeyW'].includes(e.code)) player.jumpBuffer = PHYSICS.jumpBuffer;
  if (e.code === 'KeyR') resetLevel();
  e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.code] = false; });
const el = id => document.getElementById(id);

function createPlayer(x, y) {
  return {
    x, y, vx:0, vy:0, w:26, h:32,
    onGround:false, coyoteTimer:0, jumpBuffer:0,
    facingRight:true, state:'idle', prevState:'idle',
    animFrame:0, animTimer:0,
    squashX:1, squashY:1, glowAlpha:0.05,
    deathTimer:0
  };
}

function updatePlayer(dt) {
  if (player.state === 'death') { player.deathTimer += dt; return; }
  if (player.state === 'victory') { player.animTimer += dt; advanceAnim('victory'); }

  player.vx = 0;
  if (keys['ArrowLeft']||keys['KeyA']) { player.vx = -PHYSICS.speed; player.facingRight = false; }
  if (keys['ArrowRight']||keys['KeyD']) { player.vx = PHYSICS.speed; player.facingRight = true; }

  const prevState = player.state;
  if (!player.onGround) player.state = player.vy < 0 ? 'jump' : 'fall';
  else if (player.vx !== 0) player.state = 'run';
  else player.state = 'idle';

  // state change → reset animation
  if (player.state !== prevState) {
    player.animFrame = 0; player.animTimer = 0;
  }

  // advance animation
  player.animTimer += dt;
  advanceAnim(player.state);

  // glow & squash
  player.glowAlpha = GLOW_ALPHA[player.state] || 0.05;
  const sq = SQUASH_MAP[player.state] || {sx:1,sy:1};
  player.squashX = sq.sx; player.squashY = sq.sy;

  // gravity
  player.vy = Math.min(player.vy + PHYSICS.gravity * dt, PHYSICS.maxFall);
  player.onGround = false;
  if (player.onGround) player.coyoteTimer = PHYSICS.coyoteTime;
  else player.coyoteTimer -= dt;
  player.jumpBuffer -= dt;

  // jump (coyote + buffer)
  if ((keys['Space']||keys['ArrowUp']||keys['KeyW']) && player.jumpBuffer > 0 && player.coyoteTimer > 0) {
    player.vy = -PHYSICS.jumpForce;
    player.coyoteTimer = 0; player.jumpBuffer = 0;
    player.state = 'jump'; player.animFrame = 0; player.animTimer = 0;
    player.squashX = 0.85; player.squashY = 1.15;
    if (audioReady) audioEngine.trigger('COYOTE_JUMP');
  }

  player.x += player.vx * dt * 60;
  player.y += player.vy * dt * 60;

  // solid collision
  for (const p of platforms) {
    if (p.type === 'passthrough') continue;
    if (player.x < p.x+p.w && player.x+player.w > p.x &&
        player.y < p.y+p.h && player.y+player.h > p.y) {
      const ox = player.x+player.w/2-(p.x+p.w/2), oy = player.y+player.h/2-(p.y+p.h/2);
      if (Math.abs(ox) > Math.abs(oy)) {
        if (ox < 0) { player.x = p.x-player.w; player.vx = 0; }
        else          { player.x = p.x+p.w;    player.vx = 0; }
      } else {
        if (oy < 0) { player.y = p.y-player.h; player.vy = 0; player.onGround = true; }
        else          { player.y = p.y+p.h;   player.vy > 0 && (player.vy *= 0.5); }
      }
    }
  }

  // passthrough collision
  for (const p of platforms) {
    if (p.type === 'passthrough' && player.vy > 0) {
      const inX = player.x < p.x+p.w && player.x+player.w > p.x;
      const crossTop = player.y+player.h >= p.y && player.y+player.h <= p.y+12;
      if (inX && crossTop) {
        if (keys['ArrowDown']) player.onGround = false;
        else { player.y = p.y-player.h; player.vy = 0; player.onGround = true; }
      }
    }
  }

  // crystal collect
  for (const c of crystals) {
    if (!c.collected && player.x < c.x*32+16 && player.x+player.w > c.x*32-16 &&
        player.y < c.y*32+16 && player.y+player.h > c.y*32-16) {
      c.collected = true;
      if (audioReady) audioEngine.trigger('CRYSTAL_COLLECT');
    }
  }

  // torch
  for (const t of torches) {
    if (!t.collected && Math.abs(player.x+player.w/2-t.x) < 24 && Math.abs(player.y+player.h/2-t.y) < 24)
      t.collected = true;
  }

  // exit
  if (crystals.every(c => c.collected) &&
      player.x < exitPortal.x+exitPortal.w && player.x+player.w > exitPortal.x &&
      player.y < exitPortal.y+exitPortal.h && player.y+player.h > exitPortal.y) {
    levelComplete = true;
    player.state = 'victory'; player.vx = 0; player.vy = 0;
    player.animFrame = 0; player.animTimer = 0;
    if (audioReady) audioEngine.trigger('LEVEL_COMPLETE');
  }

  // death
  if (player.y > H+50) {
    player.state = 'death'; player.vx = 0; player.vy = 0;
    player.animFrame = 0; player.deathTimer = 0;
    if (audioReady) audioEngine.trigger('DEATH');
    resetLevel();
  }
}

// Advance animation, respecting loop/lock per Kairo spec
function advanceAnim(state) {
  const dur = SPRITE_DUR[state] || 0.15;
  if (player.animTimer < dur) return;
  player.animTimer = 0;
  const frames = SPRITE_MAP[state];
  const loops = SPRITE_LOOPS[state];
  if (player.animFrame < frames.length - 1) {
    player.animFrame++;
  } else if (loops) {
    player.animFrame = 0;
  }
  // non-looping: stay on last frame (don't advance)
}

function drawPlayer() {
  const { x, y, w, h, squashX, squashY, facingRight, state, animFrame } = player;
  const sw = w * squashX, sh = h / squashY;
  const ox = (w - sw) / 2, oy = h - sh;
  const frames = SPRITE_MAP[state] || SPRITE_MAP.idle;
  const img = spriteImgs[state] && spriteImgs[state][animFrame % frames.length];

  ctx.save();

  // glow halo (Kairo: decorative, 5% / 15% on victory)
  const glowR = 14 + player.glowAlpha * 60;
  const cx = x+w/2, cy = y+h/2;
  const grad = ctx.createRadialGradient(cx, cy, w*0.3, cx, cy, w/2+glowR);
  grad.addColorStop(0, `rgba(0,212,255,${player.glowAlpha * 3})`);
  grad.addColorStop(1, 'rgba(0,212,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(cx-(w/2+glowR), cy-(h/2+glowR), (w+glowR*2), (h+glowR*2));

  if (!facingRight) {
    ctx.translate(cx, 0); ctx.scale(-1,1); ctx.translate(-cx, 0);
  }

  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, x+ox, y+oy, sw, sh);
  } else {
    ctx.fillStyle = C.player;
    ctx.shadowColor = C.player; ctx.shadowBlur = 8;
    ctx.fillRect(x+ox, y+oy, sw, sh);
    ctx.shadowBlur = 0;
  }
  ctx.restore();
}

function drawCrystals() {
  for (const c of crystals) {
    if (c.collected) continue;
    const cx = c.x*32+16, cy = c.y*32+16;
    ctx.save(); ctx.translate(cx, cy);
    ctx.rotate(Date.now()/2000);
    ctx.fillStyle = C.crystal; ctx.shadowColor = C.crystal; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.moveTo(0,-10); ctx.lineTo(8,0); ctx.lineTo(0,10); ctx.lineTo(-8,0); ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0; ctx.restore();
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

const LEVEL = {
  tiles:[
    "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    "f..............................................................................................................f",
    "f..............................................................................................................f",
    "f.....c........................................................c..............................................f",
    "f..............................................................................................................f",
    "f.....p........................................................p..............................................f",
    "f..............................................................................................................f",
    "f.....p........................................................p..............................................f",
    "f............................................................t..................................................f",
    "fppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp"
  ],
  spawn:{x:50,y:500},
  crystals:[{x:4,y:4},{x:8,y:4},{x:12,y:4},{x:16,y:4},{x:20,y:4},{x:24,y:4},{x:28,y:4},{x:32,y:4},{x:36,y:4},{x:40,y:4}],
  torches:[{x:400,y:464}],
  exit:{x:730,y:480,w:40,h:40}
};

function initLevel() {
  platforms = [];
  for (let y=0; y<LEVEL.tiles.length; y++)
    for (let x=0; x<LEVEL.tiles[y].length; x++) {
      const t = LEVEL.tiles[y][x];
      if (t!=='.' && t!=='c' && t!=='t') {
        platforms.push({x:x*32,y:y*32,w:32,h:32,type:t==='p'?'passthrough':'solid'});
      }
    }
  crystals = LEVEL.crystals.map(c=>({...c,collected:false}));
  torches  = LEVEL.torches.map(t=>({...t,collected:false}));
  exitPortal = {...LEVEL.exit};
  player = createPlayer(LEVEL.spawn.x, LEVEL.spawn.y);
  levelComplete = false;
  if (window.audioEngine && audioReady) audioEngine.setProximityTarget(player, crystals);
}

function resetLevel() {
  if (window.audioEngine) audioEngine.stopProximity();
  initLevel();
}

let lastTime = 0, fps = 0, frameCount = 0, fpsTime = 0;

function gameLoop(timestamp) {
  const dt = Math.min((timestamp-lastTime)/1000, 0.05);
  lastTime = timestamp;
  frameCount++; fpsTime += dt;
  if (fpsTime >= 1) { fps = Math.round(frameCount/fpsTime); frameCount = 0; fpsTime = 0; }

  if (!levelComplete) {
    updatePlayer(dt);
    if (window.audioEngine && audioReady) audioEngine.updateProximity();
  }
  render();
  if (el('fps')) el('fps').textContent = fps;
  if (el('x'))   el('x').textContent   = Math.round(player.x);
  if (el('y'))   el('y').textContent   = Math.round(player.y);
  if (el('st'))  el('st').textContent  = player.state;
  if (el('cr'))  el('cr').textContent  = crystals.filter(c=>c.collected).length;
  requestAnimationFrame(gameLoop);
}

function render() {
  ctx.fillStyle = C.bg; ctx.fillRect(0,0,W,H);
  for (const t of torches) {
    if (t.collected) continue;
    const grd = ctx.createRadialGradient(t.x,t.y-16,0,t.x,t.y-16,96);
    grd.addColorStop(0,'rgba(255,159,67,0.25)'); grd.addColorStop(1,'rgba(255,159,67,0)');
    ctx.fillStyle = grd; ctx.fillRect(t.x-96,t.y-112,192,192);
  }
  for (const p of platforms) {
    ctx.fillStyle = p.type==='passthrough'?'rgba(74,74,106,0.7)':'#4a4a6a';
    ctx.fillRect(p.x,p.y,p.w,p.h);
    ctx.strokeStyle='rgba(255,255,255,0.08)'; ctx.lineWidth=1; ctx.strokeRect(p.x,p.y,p.w,p.h);
  }
  if (crystals.every(c=>c.collected)) {
    ctx.fillStyle=C.exit; ctx.shadowColor=C.exit; ctx.shadowBlur=20;
    ctx.fillRect(exitPortal.x,exitPortal.y,exitPortal.w,exitPortal.h); ctx.shadowBlur=0;
  }
  drawCrystals(); drawTorches(); drawPlayer();

  const done = spriteLoadCount, total = spriteTotal;
  if (done < total) {
    ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.fillRect(W/2-100,H/2-20,200,40);
    ctx.fillStyle='#00d4ff'; ctx.fillRect(W/2-98,H/2-18,196*(done/total),36);
  }
}

initLevel();
requestAnimationFrame(gameLoop);
