// === PROTOTYPE v6 — Level 2: The Descent ===
// Moving platforms, water zones, checkpoints, spike hazards, 12 crystals, 3 checkpoints
// Audio: Cadenza AudioEngine v0.5
const W = 800, H = 600;
var player, platforms, crystals, torches, checkpoints, hazards, waterZones, exitPortal, levelComplete;
var movingPlatforms = [];
var lastCheckpoint = null;
var deathTimer = 0;
var keys = {};
var audioReady = false;
var canvas = document.getElementById('gameCanvas'), ctx = canvas.getContext('2d');
canvas.width = W; canvas.height = H;

var SPRITE_BASE = 'https://raw.githubusercontent.com/forge-game-dev/ninfa-engine/main/docs/art/sprites/';
var SPRITE_MAP = {
  idle:   ['player_idle_1.png','player_idle_2.png'],
  run:    ['player_run_1.png','player_run_2.png','player_run_3.png','player_run_4.png'],
  jump:   ['player_jump_1.png','player_jump_2.png','player_jump_3.png','player_jump_4.png'],
  fall:   ['player_fall_1.png','player_fall_2.png','player_fall_3.png'],
  death:  ['player_death_1.png','player_death_2.png','player_death_3.png','player_death_4.png'],
  victory:['player_victory_1.png','player_victory_2.png','player_victory_3.png',
           'player_victory_4.png','player_victory_5.png','player_victory_6.png']
};
var SPRITE_DUR = { idle:0.5, run:0.1, jump:0.1, fall:0.1, death:0.15, victory:0.2 };
var SPRITE_LOOPS = { idle:true, run:true, jump:false, fall:false, death:false, victory:true };
var GLOW_ALPHA = { idle:0.05, run:0.05, jump:0.05, fall:0.05, death:0.05, victory:0.15 };
var SQUASH_MAP = {
  idle:{sx:1.0,sy:1.0}, run:{sx:0.95,sy:1.05}, jump:{sx:0.85,sy:1.15},
  fall:{sx:1.1,sy:0.9}, death:{sx:1.2,sy:0.8}, victory:{sx:0.9,sy:1.1}
};

var spriteImgs = {};
var spriteLoadCount = 0, spriteTotal = 0;
Object.keys(SPRITE_MAP).forEach(function(state) {
  spriteImgs[state] = [];
  SPRITE_MAP[state].forEach(function(fn) {
    spriteTotal++;
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = SPRITE_BASE + fn;
    img.onload = img.onerror = function() { spriteLoadCount++; updateLoadingProgress(); };
    spriteImgs[state].push(img);
  });
});

var PHYSICS = { gravity:10, maxFall:8, speed:5, jumpForce:10, coyoteTime:0.1, jumpBuffer:0.15 };
var C = { player:'#00d4ff', crystal:'#fff', exit:'#00ff88', torch:'#ff9f43', bg:'#4a4a6a' };

function updateLoadingProgress() {
  var el = document.getElementById('p');
  if (el) el.textContent = 'Loading sprites... ' + spriteLoadCount + '/' + spriteTotal;
}

window.addEventListener('keydown', function(e) {
  if (!audioReady && window.audioEngine) { audioEngine.init(); audioReady = true; }
  if (window.audioEngine) audioEngine.resume();
  keys[e.code] = true;
  if (['Space','ArrowUp','KeyW'].indexOf(e.code) !== -1) {
    if (player) player.jumpBuffer = PHYSICS.jumpBuffer;
  }
  if (e.code === 'KeyR') resetLevel();
  e.preventDefault();
});
window.addEventListener('keyup', function(e) { keys[e.code] = false; });

function el(id) { return document.getElementById(id); }

function createPlayer(x, y) {
  return { x:x, y:y, w:32, h:32, vx:0, vy:0, grounded:false, coyote:0, jumpBuffer:0,
    facingRight:true, state:'idle', animTime:0, animFrame:0, squashX:1, squashY:1, dying:false, wasGrounded:false };
}


function safeTrigger(name) { if (window.audioEngine) audioEngine.trigger(name); }
function aabb(a, b) {
  return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
}

function resolveSolid(p, rect) {
  if (!aabb(p, rect)) return;
  var ox = p.x+p.w/2-(rect.x+rect.w/2), oy = p.y+p.h/2-(rect.y+rect.h/2);
  var dx = p.w/2+rect.w/2-Math.abs(ox), dy = p.h/2+rect.h/2-Math.abs(oy);
  if (dx < dy) {
    if (ox < 0) { p.x = rect.x - p.w; p.vx = 0; }
    else { p.x = rect.x+rect.w; p.vx = 0; }
  } else {
    if (oy < 0) {
      p.y = rect.y - p.h; p.vy = 0; p.grounded = true;
      if (rect.type && rect.type.indexOf('moving') === 0) rect.wasOn = true;
    } else { p.y = rect.y+rect.h; p.vy = 0; }
  }
}

function triggerDeath() {
  if (player.dying) return;
  player.dying = true; deathTimer = 0.5;
  if (window.audioEngine) audioEngine.trigger('DEATH');
  player.state = 'death'; player.animTime = 0; player.animFrame = 0;
}

function respawnAtCheckpoint() {
  var spawn = lastCheckpoint ? {x: lastCheckpoint.x + 4, y: lastCheckpoint.y} : {x:48, y:48};
  player = createPlayer(spawn.x, spawn.y);
}

function advanceAnim(p, state, dt) {
  var dur = SPRITE_DUR[state] || 0.15;
  p.animTime += dt;
  if (p.animTime >= dur) {
    p.animTime -= dur;
    var frames = SPRITE_MAP[state];
    if (!frames) return;
    p.animFrame++;
    if (p.animFrame >= frames.length) {
      p.animFrame = SPRITE_LOOPS[state] ? 0 : frames.length - 1;
    }
  }
}

function drawPlayer() {
  var p = player;
  if (!p) return;
  var sq = SQUASH_MAP[p.state] || {sx:1, sy:1};
  var sw = p.w * sq.sx, sh = p.h / sq.sy;
  var ox = (p.w - sw) / 2, oy = p.h - sh;
  var img = spriteImgs[p.state] && spriteImgs[p.state][p.animFrame];
  ctx.save();
  if (!p.facingRight) {
    ctx.translate(p.x + p.w/2, 0); ctx.scale(-1, 1); ctx.translate(-(p.x + p.w/2), 0);
  }
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, p.x + ox, p.y + oy, sw, sh);
  } else {
    ctx.fillStyle = C.player; ctx.shadowColor = C.player; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(p.x+p.w/2, p.y+p.h/2, p.w/2, 0, Math.PI*2); ctx.fill(); ctx.shadowBlur = 0;
  }
  ctx.restore();
  var ga = GLOW_ALPHA[p.state] || 0.05;
  if (ga > 0) {
    ctx.fillStyle = 'rgba(0,212,255,' + ga + ')';
    ctx.beginPath(); ctx.arc(p.x+p.w/2, p.y+p.h/2, p.w * 0.85, 0, Math.PI*2); ctx.fill();
  }
}

function updatePlayer(dt) {
  if (player.dying) {
    deathTimer -= dt;
    if (deathTimer <= 0) respawnAtCheckpoint();
    return;
  }
  var p = player;
  p.wasGrounded = p.grounded;
  p.jumpBuffer -= dt;
  p.coyote = p.grounded ? PHYSICS.coyoteTime : Math.max(0, p.coyote - dt);

  if (keys['ArrowLeft'] || keys['KeyA']) { p.vx = -PHYSICS.speed; p.facingRight = false; }
  else if (keys['ArrowRight'] || keys['KeyD']) { p.vx = PHYSICS.speed; p.facingRight = true; }
  else p.vx = 0;

  // Fresh jump (jumpBuffer set on keydown)
  if ((keys['Space']||keys['ArrowUp']||keys['KeyW']) && p.jumpBuffer > 0) {
    p.vy = -PHYSICS.jumpForce; p.jumpBuffer = 0; p.coyote = 0; p.grounded = false;
    if (window.audioEngine) audioEngine.trigger('JUMP');
  }
  // Coyote jump (coyote active, jumpBuffer already consumed)
  else if ((keys['Space']||keys['ArrowUp']||keys['KeyW']) && p.coyote > 0 && p.jumpBuffer <= 0) {
    p.vy = -PHYSICS.jumpForce; p.coyote = 0; p.grounded = false;
    if (window.audioEngine) audioEngine.trigger('COYOTE_JUMP');
  }

  p.vy += PHYSICS.gravity * dt;
  if (p.vy > PHYSICS.maxFall) p.vy = PHYSICS.maxFall;
  p.x += p.vx * dt; p.y += p.vy * dt;

  // Carry on moving platforms
  for (var i = 0; i < movingPlatforms.length; i++) {
    var mp = movingPlatforms[i];
    if (mp.wasOn) { p.x += mp.currentVx * dt; p.y += mp.currentVy * dt; }
    mp.wasOn = false;
  }

  if (p.x < 0) p.x = 0; if (p.x + p.w > W) p.x = W - p.w;
  if (p.y > H + 64) { triggerDeath(); return; }

  p.grounded = false;
  for (var i = 0; i < platforms.length; i++) resolveSolid(p, platforms[i]);
  for (var i = 0; i < movingPlatforms.length; i++) resolveSolid(p, movingPlatforms[i]);
  // LAND trigger
  if (p.grounded && !p.wasGrounded) safeTrigger('LAND');


  for (var i = 0; i < hazards.length; i++) if (aabb(p, hazards[i])) { safeTrigger('SPIKE_DEATH'); triggerDeath(); return; }
  for (var i = 0; i < waterZones.length; i++) if (aabb(p, waterZones[i])) { safeTrigger('DROWN'); triggerDeath(); return; }

  for (var i = 0; i < crystals.length; i++) {
    var c = crystals[i];
    if (!c.collected && aabb(p, {x:c.x, y:c.y, w:24, h:24})) {
      c.collected = true; if (window.audioEngine) audioEngine.trigger('CRYSTAL_COLLECT');
    }
  }
  for (var i = 0; i < checkpoints.length; i++) {
    var cp = checkpoints[i];
    if (!cp.activated && aabb(p, {x:cp.triggerX-16, y:cp.triggerY-32, w:48, h:48})) {
      cp.activated = true; lastCheckpoint = cp; if (window.audioEngine) audioEngine.trigger('CHECKPOINT');
    }
  }
  if (exitPortal && crystals.filter(function(c){return c.collected;}).length >= crystalGate && aabb(p, exitPortal)) {
    levelComplete = true; if (window.audioEngine) audioEngine.trigger('LEVEL_COMPLETE');
  }

  var prev = p.state;
  if (!p.grounded) p.state = p.vy < 0 ? 'jump' : 'fall';
  else if (p.vx !== 0) p.state = 'run';
  else p.state = 'idle';
  if (prev !== p.state) { p.animTime = 0; p.animFrame = 0; }
  advanceAnim(p, p.state, dt);
}

function updateMovingPlatforms(dt) {
  for (var i = 0; i < movingPlatforms.length; i++) {
    var mp = movingPlatforms[i];
    if (mp.type === 'movingH') {
      mp.x += mp.currentVx * dt;
      if (mp.x <= mp.minX) { mp.x = mp.minX; mp.currentVx = Math.abs(mp.currentVx); }
      if (mp.x + mp.w >= mp.maxX + mp.w) { mp.x = mp.maxX; mp.currentVx = -Math.abs(mp.currentVx); }
    } else {
      mp.y += mp.currentVy * dt;
      if (mp.y <= mp.minY) { mp.y = mp.minY; mp.currentVy = Math.abs(mp.currentVy); }
      if (mp.y + mp.h >= mp.maxY + mp.h) { mp.y = mp.maxY; mp.currentVy = -Math.abs(mp.currentVy); }
    }
  }
}

function initLevel() {
  platforms = [];
  for (var y = 0; y < 19; y++) {
    for (var x = 0; x < 25; x++) {
      var t = getTile(x, y);
      if (t === 'X') platforms.push({x:x*32, y:y*32, w:32, h:32, type:'solid'});
      if (t === 'P') platforms.push({x:x*32, y:y*32, w:32, h:32, type:'passthrough'});
    }
  }
  crystals = [
    {id:'C-01',x:96,y:160,collected:false},{id:'C-02',x:224,y:192,collected:false},
    {id:'C-03',x:384,y:160,collected:false},{id:'C-04',x:160,y:256,collected:false},
    {id:'C-05',x:384,y:256,collected:false},{id:'C-06',x:448,y:288,collected:false},
    {id:'C-07',x:64,y:352,collected:false},{id:'C-08',x:224,y:352,collected:false},
    {id:'C-09',x:320,y:416,collected:false},{id:'C-10',x:480,y:416,collected:false},
    {id:'C-11',x:128,y:480,collected:false},{id:'C-12',x:384,y:544,collected:false}
  ];
  torches = [
    {x:64,y:160},{x:224,y:192},{x:352,y:160},{x:96,y:256},
    {x:448,y:288},{x:32,y:352},{x:256,y:544}
  ];
  checkpoints = [
    {x:352,y:192,triggerX:352,triggerY:192,activated:false},
    {x:192,y:416,triggerX:192,triggerY:416,activated:false},
    {x:128,y:480,triggerX:128,triggerY:480,activated:false}
  ];
  hazards = [
    {x:288,y:96,w:32,h:32},{x:320,y:320,w:64,h:16},
    {x:160,y:416,w:32,h:16},{x:192,y:576,w:64,h:16}
  ];
  waterZones = [
    {x:288,y:336,w:128,h:64},{x:160,y:592,w:96,h:32}
  ];
  exitPortal = {x:480,y:544,w:48,h:64};
  movingPlatforms = [
    {x:128,y:160,w:64,h:16,type:'movingH',currentVx:3,currentVy:0,minX:128,maxX:220,wasOn:false},
    {x:320,y:256,w:64,h:16,type:'movingV',currentVx:0,currentVy:2,minY:192,maxY:352,wasOn:false}
  ];
  player = createPlayer(48, 48);
  lastCheckpoint = null;
  levelComplete = false;
  if (window.audioEngine && audioReady) audioEngine.setProximityTarget(player, crystals);
}

// 25 cols x 19 rows — X=solid, P=passthrough, .=air
function getTile(x, y) {
  var map = [
    'XXXXXXXXXXXXXXXXXXXXXXXXX',
    'X......................X',
    'X......................X',
    'X....X...............X..X',
    'X..................X....X',
    'X.....P.......P.........X',
    'X..C01. .C02..X. .C03...X',
    'X..............X........X',
    'X.....C04......X..C05...X',
    'X..................C06..X',
    'X.........XX...........X',
    'X..C07...XX......C08...X',
    'X......................X',
    'X.....X......XX...C09..XX',
    'X..C11.....XX.....X....X',
    'X..CP03.....X....C10...X',
    'X.......C12.X...........X',
    'X.XXXX..XXXXXXXX..XXXXXX',
    'XXXXXXXXXXXXXXXXXXXXXXXXX'
  ];
  if (y < 0 || y >= map.length || x < 0 || x >= map[0].length) return '.';
  return map[y][x];
}

function resetLevel() {
  if (window.audioEngine) audioEngine.stopProximity();
  initLevel();
}

var lastTime = 0, fps = 0, frameCount = 0, fpsTime = 0;
function gameLoop(timestamp) {
  var dt = Math.min((timestamp-lastTime)/1000, 0.05);
  lastTime = timestamp;
  frameCount++; fpsTime += dt;
  if (fpsTime >= 1) { fps = Math.round(frameCount/fpsTime); frameCount = 0; fpsTime = 0; }
  if (!levelComplete) {
    updateMovingPlatforms(dt);
    updatePlayer(dt);
    if (window.audioEngine && audioReady) audioEngine.updateProximity();
  }
  render();
  if (el('fps')) el('fps').textContent = fps;
  if (el('px')) el('px').textContent = Math.round(player ? player.x : 0);
  if (el('py')) el('py').textContent = Math.round(player ? player.y : 0);
  if (el('vx')) el('vx').textContent = player ? Math.round(player.vx*10)/10 : 0;
  if (el('vy')) el('vy').textContent = player ? Math.round(player.vy*10)/10 : 0;
  if (el('gr')) el('gr').textContent = player ? player.grounded : false;
  if (el('ct')) el('ct').textContent = player ? Math.round(player.coyote*100)/100 : 0;
  if (el('jb')) el('jb').textContent = player ? Math.round(player.jumpBuffer*100)/100 : 0;
  if (el('cr')) el('cr').textContent = crystals ? crystals.filter(function(c){return c.collected;}).length : 0;
  requestAnimationFrame(gameLoop);
}

function render() {
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
  for (var i = 0; i < waterZones.length; i++) {
    var wz = waterZones[i];
    ctx.fillStyle = '#2d4a5e'; ctx.fillRect(wz.x, wz.y, wz.w, wz.h);
    ctx.fillStyle = 'rgba(41,128,185,0.5)'; ctx.fillRect(wz.x, wz.y, wz.w, 8);
  }
  for (var i = 0; i < torches.length; i++) {
    var t = torches[i];
    var grd = ctx.createRadialGradient(t.x, t.y-16, 0, t.x, t.y-16, 96);
    grd.addColorStop(0, 'rgba(255,159,67,0.25)'); grd.addColorStop(1, 'rgba(255,159,67,0)');
    ctx.fillStyle = grd; ctx.fillRect(t.x-96, t.y-112, 192, 192);
  }
  for (var i = 0; i < platforms.length; i++) {
    var pl = platforms[i];
    ctx.fillStyle = pl.type === 'passthrough' ? 'rgba(74,74,106,0.7)' : '#4a4a6a';
    ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
    ctx.strokeRect(pl.x, pl.y, pl.w, pl.h);
  }
  for (var i = 0; i < hazards.length; i++) {
    var hz = hazards[i];
    ctx.fillStyle = '#ff4757'; ctx.fillRect(hz.x, hz.y, hz.w, hz.h);
  }
  for (var i = 0; i < movingPlatforms.length; i++) {
    var mp = movingPlatforms[i];
    ctx.fillStyle = '#4a4a6a'; ctx.fillRect(mp.x, mp.y, mp.w, mp.h);
    ctx.fillStyle = '#ff9f43'; ctx.fillRect(mp.x+4, mp.y+4, mp.w-8, 4);
    ctx.fillRect(mp.x+4, mp.y+8, mp.w-8, 4);
  }
  for (var i = 0; i < checkpoints.length; i++) {
    var cp = checkpoints[i];
    ctx.fillStyle = cp.activated ? '#00ff88' : '#4a4a6a';
    ctx.fillRect(cp.x, cp.y, 32, 64);
    ctx.strokeStyle = cp.activated ? '#00ff88' : '#7a7a8a';
    ctx.lineWidth = 2; ctx.strokeRect(cp.x, cp.y, 32, 64);
  }
  if (crystals && crystals.filter(function(c){return c.collected;}).length >= crystalGate && exitPortal) {
    ctx.fillStyle = C.exit; ctx.shadowColor = C.exit; ctx.shadowBlur = 20;
    ctx.fillRect(exitPortal.x, exitPortal.y, exitPortal.w, exitPortal.h); ctx.shadowBlur = 0;
  }
  drawCrystals(); drawTorches(); drawPlayer();
  var done = spriteLoadCount, total = spriteTotal;
  if (done < total) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(W/2-100, H/2-20, 200, 40);
    ctx.fillStyle = '#00d4ff'; ctx.fillRect(W/2-98, H/2-18, 196*(done/total), 36);
  }
}

function drawCrystals() {
  if (!crystals) return;
  var t = Date.now() / 1000;
  for (var i = 0; i < crystals.length; i++) {
    var c = crystals[i];
    if (c.collected) continue;
    var glow = 0.15 + 0.1 * Math.sin(t * 3 + c.x * 0.1);
    ctx.fillStyle = 'rgba(255,215,0,' + glow + ')';
    ctx.beginPath(); ctx.arc(c.x+12, c.y+12, 20, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffd700'; ctx.shadowColor = '#ffd700'; ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(c.x+12, c.y); ctx.lineTo(c.x+20, c.y+10);
    ctx.lineTo(c.x+16, c.y+24); ctx.lineTo(c.x+8, c.y+24); ctx.lineTo(c.x+4, c.y+10);
    ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0;
  }
}

function drawTorches() {
  if (!torches) return;
  for (var i = 0; i < torches.length; i++) {
    var t = torches[i];
    ctx.fillStyle = C.torch; ctx.shadowColor = C.torch; ctx.shadowBlur = 15;
    ctx.fillRect(t.x-2, t.y-8, 4, 16); ctx.shadowBlur = 0;
    ctx.fillStyle = '#ff9f43'; ctx.beginPath(); ctx.arc(t.x, t.y-12, 5, 0, Math.PI*2); ctx.fill();
  }
}

initLevel();
requestAnimationFrame(gameLoop);
