function triggerDeath(){
  if(deathTimer>0||levelComplete)return;
  deaths++;deathTimer=1.5;
  if(window.audioEngine)audioEngine.triggerSpikeDeath();
}
function drawBackground(){
  var g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#1a0a0a');g.addColorStop(1,'#0a0505');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(255,255,255,0.03)';ctx.lineWidth=1;
  for(var x=0;x<W;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(var y=0;y<H;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
}
function drawPlatforms(){
  for(var i=0;i<platforms.length;i++){
    var p=platforms[i];
    drawTileRepeated('platform_static_00.png',p.x,p.y,p.w,p.h);
  }
}
function drawMovingPlatforms(){
  for(var i=0;i<movingPlatforms.length;i++){
    var mp=movingPlatforms[i];
    var tileKey=mp.type==='movingH'?'platform_mp_h_00.png':'platform_mp_v_00.png';
    ctx.globalAlpha=mp.state==='warning'?0.5:1.0;
    drawTileRepeated(tileKey,mp.x,mp.y,mp.w,mp.h);
    var cx=mp.x+mp.w/2,cy=mp.y+mp.h/2;
    ctx.fillStyle=mp.warned?'#ff4757':'#a0522d';
    if(mp.type==='movingH'){
      var dir=mp.currentVx>0?1:-1;
      ctx.beginPath();ctx.moveTo(cx+dir*8,cy-4);ctx.lineTo(cx+dir*8,cy+4);ctx.lineTo(cx-dir*4,cy);ctx.closePath();ctx.fill();
    } else {
      var dir=mp.currentVy>0?1:-1;
      ctx.beginPath();ctx.moveTo(cx-5,cy+dir*8);ctx.lineTo(cx+5,cy+dir*8);ctx.lineTo(cx,cy-dir*4);ctx.closePath();ctx.fill();
    }
    ctx.globalAlpha=1;
  }
}
function drawTimedPlatform(){
  if(!timedPlatform)return;
  var tp=timedPlatform;
  var tileKey='platform_timed_00.png';
  if(tp.state==='warning')tileKey='platform_timed_warning_00.png';
  else if(tp.state==='disappeared')tileKey='platform_timed_gone_00.png';
  ctx.globalAlpha=tp.state==='disappeared'?0.2:1.0;
  drawTileRepeated(tileKey,tp.x,tp.y,tp.w,tp.h);
  if(tp.state!=='disappeared'){
    ctx.fillStyle='#ffa500';ctx.font='bold 10px monospace';ctx.textAlign='center';
    ctx.fillText(Math.ceil(tp.timer)+'s',tp.x+tp.w/2,tp.y-4);
  }
  ctx.globalAlpha=1;
}
function drawSpikes(){
  for(var i=0;i<spikes.length;i++){
    var s=spikes[i];
    drawTileRepeated('spike_floor_00.png',s.x,s.y,s.w,s.h);
  }
}
function drawCrystals(){
  for(var i=0;i<crystals.length;i++){
    var cr=crystals[i];
    if(cr.collected)continue;
    ctx.fillStyle='rgba(0,255,204,0.3)';ctx.beginPath();ctx.arc(cr.x,cr.y,16,0,Math.PI*2);ctx.fill();
    ctx.save();ctx.shadowColor='#00ffcc';ctx.shadowBlur=12;
    ctx.fillStyle='#00ffcc';ctx.beginPath();
    var a=animTime*2;
    ctx.moveTo(cr.x+8*Math.cos(a),cr.y+8*Math.sin(a));
    ctx.lineTo(cr.x+8*Math.cos(a+2.1),cr.y+8*Math.sin(a+2.1));
    ctx.lineTo(cr.x+8*Math.cos(a+4.2),cr.y+8*Math.sin(a+4.2));
    ctx.closePath();ctx.fill();ctx.restore();
  }
}
function drawCheckpoints(){
  for(var i=0;i<checkpoints.length;i++){
    var cp=checkpoints[i];
    if(cp.activated){ctx.save();ctx.shadowColor='#ffd700';ctx.shadowBlur=10;ctx.fillStyle='#ffd700';ctx.fillRect(cp.x,cp.y-32,cp.w,cp.h);ctx.restore();}
    else{ctx.globalAlpha=0.4;ctx.fillStyle='#665500';ctx.fillRect(cp.x,cp.y-32,cp.w,cp.h);ctx.globalAlpha=1;}
  }
}
function drawExitPortal(){
  var collected=crystals?crystals.filter(function(c){return c.collected;}).length:0;
  if(collected>=crystalGate){drawTile('portal_exit_00.png',736,544,48,64);ctx.fillStyle='rgba(42,157,143,0.2)';ctx.fillRect(736,544,48,64);}
}
function drawPlayer(){
  if(!player)return;
  if(deathTimer>0){
    var frame=Math.floor((1.5-deathTimer)/0.15)%4;
    var df=spriteImages['player_death_'+frame+'.png'];
    if(df&&spriteLoadCount>=spriteTotal){
      ctx.save();ctx.translate(player.x+player.w/2,player.y+player.h/2);
      if(!player.facingRight)ctx.scale(-1,1);
      ctx.globalAlpha=deathTimer/1.5;
      ctx.drawImage(df,-player.w/2,-player.h/2,player.w,player.h);ctx.restore();return;
    }
    ctx.save();ctx.globalAlpha=deathTimer/1.5;ctx.fillStyle='#ffffff';ctx.fillRect(player.x,player.y,player.w,player.h);ctx.restore();return;
  }
  if(levelComplete){
    var vFrame=Math.floor(animTime/0.2)%6;
    var vf=spriteImages['player_victory_'+(vFrame+1)+'.png'];
    if(vf&&spriteLoadCount>=spriteTotal){
      ctx.save();ctx.translate(player.x+player.w/2,player.y+player.h/2);
      if(!player.facingRight)ctx.scale(-1,1);
      ctx.shadowColor='#00ffcc';ctx.shadowBlur=15;
      ctx.drawImage(vf,-player.w/2,-player.h/2,player.w,player.h);ctx.restore();return;
    }
    ctx.save();ctx.shadowColor='#00ffcc';ctx.shadowBlur=15;ctx.fillStyle='#00ffcc';ctx.fillRect(player.x,player.y,player.w,player.h);ctx.restore();return;
  }
  var state='idle';
  if(!player.grounded&&player.vy<0)state='jump';
  else if(!player.grounded&&player.vy>0)state='fall';
  else if(Math.abs(player.vx)>0)state='run';
  var dur=SPRITE_DUR[state];
  var frame=Math.floor(animTime/dur)%SPRITE_MAP[state].length;
  var src=SPRITE_MAP[state][frame];
  var img=spriteImages[src];
  if(img&&spriteLoadCount>=spriteTotal){
    ctx.save();ctx.translate(player.x+player.w/2,player.y+player.h/2);
    if(!player.facingRight)ctx.scale(-1,1);
    var sq=SQUASH_MAP[state];
    ctx.scale(sq.sx,sq.sy);
    ctx.globalAlpha=GLOW_ALPHA[state];
    ctx.fillStyle='rgba(0,212,255,0.15)';ctx.fillRect(-player.w/2,-player.h/2,player.w,player.h);
    ctx.globalAlpha=1;
    ctx.drawImage(img,-player.w/2,-player.h/2,player.w,player.h);ctx.restore();
  } else {
    ctx.fillStyle='#00d4ff';ctx.fillRect(player.x,player.y,player.w,player.h);
    ctx.fillStyle='rgba(255,255,255,0.3)';ctx.fillRect(player.x+4,player.y+4,8,8);
  }
}
function render(){
  ctx.clearRect(0,0,W,H);
  drawBackground();drawPlatforms();drawMovingPlatforms();drawTimedPlatform();drawSpikes();drawCrystals();drawCheckpoints();drawExitPortal();drawPlayer();
  ctx.fillStyle='rgba(0,0,0,0.7)';ctx.fillRect(5,5,180,70);
  ctx.fillStyle='#fff';ctx.font='12px monospace';ctx.textAlign='left';
  ctx.fillText('FPS: '+(lastTime>0?Math.round(1/lastTime):0),10,20);
  ctx.fillText('CRYSTALS: '+crystalsCollected+'/'+crystalGate,10,40);
  ctx.fillText('DEATHS: '+deaths,10,60);
}
function gameLoop(timestamp){
  if(!lastTime)lastTime=timestamp;
  var dt=Math.min((timestamp-lastTime)/1000,0.05);
  lastTime=timestamp;animTime+=dt;
  if(deathTimer>0){deathTimer-=dt;if(deathTimer<=0){player.x=lastCheckpoint.x;player.y=lastCheckpoint.y;player.vx=0;player.vy=0;player.grounded=false;deathTimer=0;}}
  updateMovingPlatforms(dt);updateTimedPlatform(dt);updatePlayer(dt);
  render();
  requestAnimationFrame(gameLoop);
}
document.addEventListener('keydown',function(e){keys[e.code]=true;e.preventDefault();});
document.addEventListener('keyup',function(e){keys[e.code]=false;});
preloadSprites();preloadTiles();initLevel();
requestAnimationFrame(gameLoop);
})();
