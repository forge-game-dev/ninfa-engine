
    mp.w, mp.h);
    // Indicator
    const cx = mp.x + mp.w/2;
    ctx.fillStyle = '#8888ff';
    ctx.beginPath();
    if (mp.velX !== 0) {
      mp.dir > 0
        ? ctx.moveTo(cx - 14, mp.y + mp.h/2)
        : ctx.moveTo(cx + 14, mp.y + mp.h/2);
      ctx.lineTo(cx, mp.y + 4);
      mp.dir > 0
        ? ctx.lineTo(cx + 14, mp.y + mp.h/2)
        : ctx.lineTo(cx - 14, mp.y + mp.h/2);
    } else {
      mp.dir > 0
        ? ctx.moveTo(mp.x + mp.w/2, mp.y - 12)
        : ctx.moveTo(mp.x + mp.w/2, mp.y + mp.h + 12);
      ctx.lineTo(mp.x + 4, mp.y + mp.h/2);
      mp.dir > 0
        ? ctx.lineTo(mp.x + mp.w/2, mp.y + mp.h + 12)
        : ctx.lineTo(mp.x + mp.w/2, mp.y - 12);
    }
    ctx.fill();
  });
}

function drawTimedPlatform() {
  timedPlats.forEach(tp => {
    if (tp.state === 'gone') return;
    let alpha = 1;
    if (tp.state === 'warning') {
      alpha = 0.4 + 0.5 * Math.abs(Math.sin(Date.now() * 0.008));
    }
    ctx.globalAlpha = alpha;
    ctx.fillStyle = tp.state === 'warning' ? '#cc6600' : '#5060b0';
    ctx.fillRect(tp.x, tp.y, tp.w, tp.h);
    ctx.fillStyle = tp.state === 'warning' ? '#ffcc44' : '#8090d0';
    ctx.fillRect(tp.x, tp.y, tp.w, 3);
    ctx.globalAlpha = 1;

    // Countdown timer
    if (tp.state === 'active') {
      const secs = Math.ceil(tp.tLeft);
      ctx.fillStyle = '#00ffaa';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(secs + 's', tp.x + tp.w/2, tp.y - 5);
    }
  });
}

function drawPlatforms() {
  platforms.forEach(p => {
    ctx.fillStyle = '#1e1e2e';
    ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = '#2a2a3d';
    ctx.fillRect(p.x, p.y, p.w, 2);
  });
  doors.forEach(d => {
    if (d.open) {
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#555533';
      ctx.fillRect(d.x, d.y, d.w, d.h);
      ctx.globalAlpha = 1;
    } else {
      ctx.fillStyle = '#7a5a10';
      ctx.fillRect(d.x, d.y, d.w, d.h);
      ctx.fillStyle = '#b08930';
      ctx.fillRect(d.x + 4, d.y + 4, d.w - 8, 4);
      ctx.fillStyle = '#b08930';
      ctx.fillRect(d.x + d.w/2 - 3, d.y + 4, 6, d.h - 8);
    }
  });
}

function drawVault() {
  const v = window._vault;
  if (!v) return;
  if (!csOpened) {
    ctx.fillStyle = '#886600';
    ctx.fillRect(v.x, v.y, v.w, v.h);
    ctx.fillStyle = '#ccaa00';
    ctx.fillRect(v.x + 4, v.y + 4, v.w - 8, 4);
  } else {
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#886600';
    ctx.fillRect(v.x, v.y, v.w, v.h);
    ctx.globalAlpha = 1;
  }
}

function drawKeys() {
  keys.forEach(k => {
    if (k.collected) return;
    const cx = k.x + 12, cy = k.y + 12;
    ctx.fillStyle = k.type === 'gold' ? '#ffcc00' : k.type === 'silver' ? '#cccccc' : '#cc8844';
    ctx.beginPath();
    ctx.arc(cx, cy - 4, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(cx - 3, cy, 6, 14);
    ctx.fillRect(cx - 6, cy + 10, 12, 3);
    ctx.fillRect(cx - 3, cy + 6, 6, 3);
  });
}

function drawPlates() {
  plates.forEach(p => {
    ctx.fillStyle = p.active ? '#3344aa' : '#5566aa';
    ctx.fillRect(p.x, p.y + (p.active ? 4 : 0), p.w, p.h);
  });
}

function drawCrystals() {
  crystals.forEach(cr => {
    if (cr.collected) return;
    cr.rot += 0.03;
    const cx = cr.x + 16, cy = cr.y + 16;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(cr.rot);
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#00ffff';
    // 3-arm triangle
    for (let a = 0; a < 3; a++) {
      ctx.save();
      ctx.rotate(a * Math.PI * 2 / 3);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-5, -12);
      ctx.lineTo(5, -12);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
    ctx.shadowBlur = 0;
  });
}

function drawCheckpoints() {
  checkpoints.forEach(cp => {
    const cx = cp.x + 12, cy = cp.y + 24;
    // Pole
    ctx.fillStyle = '#888888';
    ctx.fillRect(cx - 2, cy - 24, 4, 24);
    // Flag
    ctx.fillStyle = cp.activated ? '#00ff88' : '#555555';
    ctx.fillRect(cx + 2, cy - 24, 16, 12);
    if (cp.activated) {
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 10;
      ctx.fillRect(cx + 2, cy - 24, 16, 12);
      ctx.shadowBlur = 0;
    }
  });
}

function drawCrystalSwitch() {
  const cs = window._cs;
  if (!cs) return;
  const cx = cs.x + 16, cy = cs.y + 16;
  ctx.fillStyle = '#ff00ff';
  ctx.shadowColor = '#ff00ff';
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.arc(cx, cy, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CS', cx, cy + 3);
}

function drawPortal() {
  const exitX = window._exit ? window._exit.x : 0;
  const px = exitX + 8, py = 0;
  ctx.fillStyle = '#aa00ff';
  ctx.shadowColor = '#aa00ff';
  ctx.shadowBlur = 20;
  ctx.fillRect(px, py, 16, canvas.height);
  ctx.shadowBlur = 0;

  // Animated portal
  const t = Date.now() * 0.003;
  for (let i = 0; i < 6; i++) {
    const hue = (i * 60 + t * 50) % 360;
    ctx.fillStyle = `hsla(${hue}, 100%, 60%, 0.4)`;
    ctx.fillRect(px + i*3, 0, 1, canvas.height);
  }
}

function drawPlayer() {
  if (!gameActive && !levelComplete) return;
  const px = player.x, py = player.y;
  const w = player.w, h = player.h;

  // Sprite or fallback
  if (spriteLoaded && playerSprite.complete && playerSprite.naturalWidth > 0) {
    const sx = spriteFrame * 32, sy = 0;
    ctx.save();
    ctx.translate(px + w/2, py + h/2);
    const sq = getSpriteStyle();
    ctx.scale(player.facing * sq.sx, sq.sy);
    ctx.drawImage(playerSprite, sx, sy, 32, 32, -w/2, -h/2, w, h);
    // Glow
    const ga = getGlowAlpha();
    if (ga > 0) {
      ctx.globalAlpha = ga;
      ctx.fillStyle = '#aaddff';
      ctx.fillRect(-w/2, -h/2, w, h);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  } else {
    // Geometric player
    const sq = getSpriteStyle();
    ctx.save();
    ctx.translate(px + w/2, py + h/2);
    ctx.scale(player.facing * sq.sx, sq.sy);
    ctx.fillStyle = '#4488ff';
    ctx.fillRect(-w/2, -h/2, w, h);
    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(4, -h/2 + 6, 5, 5);
    ctx.fillStyle = '#000000';
    ctx.fillRect(6, -h/2 + 8, 3, 3);
    // Glow
    const ga = getGlowAlpha();
    if (ga > 0) {
      ctx.globalAlpha = ga;
      ctx.fillStyle = '#aaddff';
      ctx.fillRect(-w/2, -h/2, w, h);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }
}

function drawDeathOverlay() {
  if (!respawning) return;
  ctx.fillStyle = 'rgba(200, 0, 0, 0.3)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('DEAD', canvas.width/2, canvas.height/2);
}

function drawVictoryOverlay() {
  if (!levelComplete) return;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffcc00';
  ctx.font = 'bold 32px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('LEVEL COMPLETE!', canvas.width/2, canvas.height/2 - 30);
  ctx.font = 'bold 20px monospace';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`Crystals: ${crystalsCollected}  Deaths: ${deaths}`,
               canvas.width/2, canvas.height/2 + 20);
  ctx.font = '16px monospace';
  ctx.fillText('Press R to replay', canvas.width/2, canvas.height/2 + 60);
}

// ── Game loop ─────────────────────────────────────────────────
function gameLoop(ts) {
  const dt = Math.min((ts - lastTime) / 1000, 0.05);
  lastTime = ts;

  if (!gameActive) {
    requestAnimationFrame(gameLoop);
    return;
  }

  // Player physics
  player.vx = 0;
  if (keysDown['ArrowLeft']  || keysDown['a'] || keysDown['A']) {
    player.vx = -SPEED; player.facing = -1;
  }
  if (keysDown['ArrowRight'] || keysDown['d'] || keysDown['D']) {
    player.vx =  SPEED; player.facing =  1;
  }

  // Jump buffer
  if (keysDown['ArrowUp'] || keysDown['w'] || keysDown['W'] || keysDown[' ']) {
    jumpBufTimer = JUMP_BUF;
  } else {
    jumpBufTimer -= dt;
  }

  // Coyote time
  if (player.onGround) coyoteTimer = COYOTE;
  else coyoteTimer -= dt;

  // Execute jump
  if (jumpBufTimer > 0 && coyoteTimer > 0) {
    player.vy = JUMP;
    coyoteTimer  = 0;
    jumpBufTimer = 0;
    if (typeof audioEngine !== 'undefined' && audioEngine)
      audioEngine.trigger('JUMP');
    resetSprite();
  }

  // Gravity
  player.vy += GRAVITY * dt;
  if (player.vy > MAX_FALL) player.vy = MAX_FALL;

  // Move X → resolve X
  player.x += player.vx * dt * 60;
  player.x = resolveX(player.x, player.y, player.w, player.h);

  // Move Y → resolve Y
  prevY = player.y;
  player.y += player.vy * dt * 60;
  const result = resolveY(player.x, player.y, player.w, player.h);
  player.y = result.py;
  const wasOnGround = player.onGround;
  player.onGround = result.onGround;

  // Platform carry
  if (result.belowPlatform && result.belowPlatform.velX) {
    player.x += result.belowPlatform.velX * result.belowPlatform.dir * dt * 60;
  }

  // Landing audio — Bug #11 fix
  if (player.onGround && !wasOnGround) {
    if (typeof audioEngine !== 'undefined' && audioEngine)
      audioEngine.trigger('LAND');
    resetSprite();
  }

  // World bounds
  if (player.x < 0) player.x = 0;
  if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;
  if (player.y > canvas.height + 100) {
    if (typeof audioEngine !== 'undefined' && audioEngine)
      audioEngine.trigger('DROWN');
    triggerDeath();
  }

  // Spike collision
  const spikeNow = collideSpikes();
  if (spikeNow && !prevSpike) {
    triggerDeath();
  }
  prevSpike = spikeNow;

  // Drown check
  if (player.y < 0) {
    if (typeof audioEngine !== 'undefined' && audioEngine)
      audioEngine.trigger('DROWN');
    triggerDeath();
  }

  // Update entities
  updateMovingPlats(dt);
  updateTimedPlats(dt);
  checkCollections();
  checkExit();

  // Sprite state
  if (player.vy < -1)      spriteAnimState = 'jump';
  else if (player.vy > 1) spriteAnimState = 'fall';
  else if (player.vx !== 0) spriteAnimState = 'run';
  else                     spriteAnimState = 'idle';
  spriteTotal = ANIM_FRAMES[spriteAnimState];
  updateSprite(dt);

  // Render
  ctx.drawImage(baseCanvas, 0, 0);
  drawPlatforms();
  drawVault();
  drawPlates();
  drawKeys();
  drawCrystals();
  drawCheckpoints();
  drawCrystalSwitch();
  drawSpikes();
  drawMovingPlatforms();
  drawTimedPlatform();
  drawPortal();
  drawPlayer();
  drawDeathOverlay();
  drawVictoryOverlay();

  // Proximity audio
  if (typeof audioEngine !== 'undefined' && audioEngine)
    audioEngine.setProximityTarget(player, crystals);

  requestAnimationFrame(gameLoop);
}

// ── Input ─────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  keysDown[e.key] = true;
  if (e.key === 'r' || e.key === 'R') {
    if (levelComplete) {
      crystalsCollected = 0; deaths = 0;
      keysHeld = { KEY_A: false, KEY_B1: false, KEY_B2: false };
      csOpened = false;
      levelComplete = false; gameActive = true;
      initLevel(levelData);
    }
  }
  // Door interaction
  if (e.key === 'e' || e.key === 'E') {
    doors.filter(d => !d.open).forEach(d => {
      const dist = Math.hypot(
        (player.x + player.w/2) - (d.x + d.w/2),
        (player.y + player.h/2) - (d.y + d.h/2)
      );
      if (dist < 48) openLockedDoor(d);
    });
  }
});
document.addEventListener('keyup', e => { delete keysDown[e.key]; });

// ── Init ──────────────────────────────────────────────────────
window.addEventListener('load', () => {
  canvas   = document.getElementById('c');
  ctx      = canvas.getContext('2d');
  baseCanvas = document.createElement('canvas');
  baseCtx  = baseCanvas.getContext('2d');

  // Load sprite
  playerSprite.onload = () => { spriteLoaded = true; };
  playerSprite.onerror = () => { spriteLoaded = false; };
  playerSprite.src = PLAYER_SPRITE_BASE + '0.png';

  // Level select via ?level=03 or ?level=04
  const params = new URLSearchParams(window.location.search);
  const lvl = params.get('level') || '03';

  loadLevel(lvl).then(data => {
    if (data) {
      initLevel(data);
      lastTime = performance.now();
      requestAnimationFrame(gameLoop);
    }
  });

  window.addEventListener('resize', () => {
    // Optional: scale canvas
  });
});
