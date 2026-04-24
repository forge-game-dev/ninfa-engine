// === PROTOTYPE v7 — Level 4: The Gauntlet ===
// Moving platforms 2–4 u/s, 3s timed platform, spike hazards, spatial audio
// Audio: Cadenza AudioEngine v0.5 with triggerMovingPlatformWarning, triggerTimedPlatformWarning, triggerTimedPlatformDisappear, setProximityTarget
const W=800,H=640;
var player,platforms,crystals,checkpoints,movingPlatforms,spikes,levelComplete;
var timedPlatform=null,lastCheckpoint=null,deathTimer=0,deaths=0,crystalGate=12;
var keys={},audioReady=false;
var canvas=document.getElementById('gameCanvas'),ctx=canvas.getContext('2d');
canvas.width=W; canvas.height=H;

var SPRITE_BASE='https://raw.githubusercontent.com/forge-game-dev/ninfa-engine/main/docs/art/sprites/';
var SPRITE_MAP={
  idle:['player_idle_1.png','player_idle_2.png'],
  run:['player_run_1.png','player_run_2.png','player_run_3.png','player_run_4.png'],
  jump:['player_jump_1.png','player_jump_2.png','player_jump_3.png','player_jump_4.png'],
  fall:['player_fall_1.png','player_fall_2.png','player_fall_3.png'],
  death:['player_death_1.png','player_death_2.png','player_death_3.png','player_death_4.png'],
  victory:['player_victory_1.png','player_victory_2.png','player_victory_3.png',
           'player_victory_4.png','player_victory_5.png','player_victory_6.png']
};
var SPRITE_DUR={idle:0.5,run:0.1,jump:0.1,fall:0.1,death:0.15,victory:0.2};
var GLOW_ALPHA={idle:0.05,run:0.05,jump:0.05,fall:0.05,death:0.05,victory:0.15};
var SQUASH_MAP={
  idle:{sx:1.0,sy:1.0},run:{sx:0.95,sy:1.05},jump:{sx:0.85,sy:1.15},
  fall:{sx:1.1,sy:0.9},death:{sx:1.2,sy:0.8},victory:{sx:0.9,sy:1.1}
};
var spriteImages={},spriteLoadCount=0,spriteTotal=0;
var currentAnim='idle',animTime=0;

var C={
  bg:'#1a0a0a',platform:'#4a4a6a',platLight:'#7a7a8a',
  player:'#00d4ff',crystal:'#ffd700',exit:'#2a9d8f',
  spike:'#ff4757',mpChevron:'#ff9f43',mpWarn:'#ff4757',
  checkpoint:'#00ff88',checkpointDim:'#4a4a6a',
  timed:'#ff9f43',timedWarn:'#ff4757'
};

function preloadSprites(){
  var all=[],unique=[];
  for(var k in SPRITE_MAP)for(var i=0;i<SPRITE_MAP[k].length;i++)all.push(SPRITE_MAP[k][i]);
  for(var i=0;i<all.length;i++)if(unique.indexOf(all[i])===-1)unique.push(all[i]);
  spriteTotal=unique.length;
  for(var i=0;i<unique.length;i++){
    (function(f){
      var img=new Image();
      img.onload=function(){spriteImages[f]=img;spriteLoadCount++;};
      img.onerror=function(){spriteImages[f]=null;spriteLoadCount++;};
      img.src=SPRITE_BASE+f;
    })(unique[i]);
  }
}

function el(id){return document.getElementById(id);}

function createPlayer(x,y){
  return{x:x,y:y,w:32,h:32,vx:0,vy:0,grounded:false,
    coyote:0,jumpBuffer:0,wasOnGround:false,state:'idle',facingRight:true};
}

function initLevel(){
  levelComplete=false;
  platforms=[
    {x:0,y:96,w:128,h:32},{x:192,y:128,w:96,h:32},{x:352,y:96,w:128,h:32},{x:544,y:96,w:96,h:32},{x:704,y:96,w:64,h:32},
    {x:64,y:192,w:96,h:32},{x:224,y:224,w:96,h:32},{x:384,y:192,w:128,h:32},{x:576,y:192,w:128,h:32},
    {x:96,y:320,w:96,h:32},{x:256,y:352,w:128,h:32},{x:448,y:320,w:128,h:32},{x:640,y:352,w:96,h:32},
    {x:32,y:480,w:128,h:32},{x:224,y:512,w:160,h:32},{x:448,y:480,w:96,h:32},{x:608,y:512,w:96,h:32},
    {x:768,y:608,w:32,h:32},{x:448,y:608,w:256,h:32}
  ];
  movingPlatforms=[
    {x:128,y:160,w:64,h:16,type:'movingH',currentVx:3,currentVy:0,minX:128,maxX:192,wasOn:false,warned:false},
    {x:544,y:160,w:64,h:16,type:'movingH',currentVx:-3,currentVy:0,minX:544,maxX:640,wasOn:false,warned:false},
    {x:704,y:160,w:64,h:16,type:'movingH',currentVx:-3,currentVy:0,minX:704,maxX:768,wasOn:false,warned:false},
    {x:320,y:256,w:64,h:16,type:'movingV',currentVx:0,currentVy:2,minY:192,maxY:352,wasOn:false,warned:false},
    {x:512,y:256,w:64,h:16,type:'movingV',currentVx:0,currentVy:-2,minY:192,maxY:352,wasOn:false,warned:false},
    {x:160,y:384,w:64,h:16,type:'movingH',currentVx:4,currentVy:0,minX:160,maxX:256,wasOn:false,warned:false},
    {x:576,y:384,w:64,h:16,type:'movingH',currentVx:-4,currentVy:0,minX:576,maxX:640,wasOn:false,warned:false}
  ];
  timedPlatform={x:320,y:448,w:96,h:16,type:'timed',timer:3.0,state:'active',warningFired:false,timerOffset:0};
  spikes=[
    {x:0,y:576,w:160,h:16},{x:256,y:576,w:192,h:16},{x:608,y:576,w:160,h:16},
    {x:320,y:320,w:64,h:16},{x:544,y:320,w:64,h:16},
    {x:160,y:352,w:64,h:16},{x:384,y:352,w:64,h:16},{x:576,y:352,w:64,h:16},{x:704,y:352,w:64,h:16},
    {x:448,y:640,w:256,h:16}
  ];
  checkpoints=[
    {x:64,y:96,w:32,h:64,activated:false,zone:'A'},
    {x:256,y:256,w:32,h:64,activated:false,zone:'B'}
  ];
  crystals=[
    {id:'C-01',x:224,y:160,collected:false},{id:'C-02',x:384,y:128,collected:false},
    {id:'C-03',x:544,y:128,collected:false},{id:'C-04',x:704,y:128,collected:false},
    {id:'C-05',x:320,y:256,collected:false},{id:'C-06',x:448,y:288,collected:false},
    {id:'C-07',x:640,y:288,collected:false},{id:'C-08',x:320,y:384,collected:false},
    {id:'C-09',x:544,y:384,collected:false},{id:'C-10',x:64,y:448,collected:false},
    {id:'C-11',x:160,y:544,collected:false},{id:'C-12',x:448,y:544,collected:false},
    {id:'C-13',x:608,y:576,collected:false},{id:'C-14',x:736,y:576,collected:false},
    {id:'C-15',x:288,y:352,collected:false},{id:'C-16',x:480,y:352,collected:false}
  ];
  crystalGate=12;
  player=createPlayer(32,64);
  lastCheckpoint=null; deathTimer=0; deaths=0; currentAnim='idle'; animTime=0;
  if(window.audioEngine&&audioReady)audioEngine.setProximityTarget(player,crystals);
}

function overlaps(ax,ay,aw,ah,bx,by,bw,bh){
  return ax<bx+bw&&ax+aw>bx&&ay<by+bh&&ay+ah>by;
}

function isPlayerOnPlatform(plat){
  if(!player)return false;
  var onX=player.x+player.w>plat.x&&player.x<plat.x+plat.w;
  var onY=Math.abs((player.y+player.h)-plat.y)<8&&player.vy>=0;
  return onX&&onY;
}

function checkSpikeCollision(){
  if(!player||deathTimer>0)return false;
  for(var i=0;i<spikes.length;i++){
    var s=spikes[i];
    if(overlaps(player.x+6,player.y+6,player.w-12,player.h-12,s.x,s.y,s.w,s.h))return true;
  }
  return false;
}

function updateMovingPlatforms(dt){
  for(var i=0;i<movingPlatforms.length;i++){
    var mp=movingPlatforms[i];
    var prevX=mp.x,prevY=mp.y;
    if(mp.type==='movingH'){
      mp.x+=mp.currentVx*dt;
      if(mp.x<=mp.minX){mp.x=mp.minX;mp.currentVx=Math.abs(mp.currentVx);triggerMPWarning(mp);}
      if(mp.x+mp.w>=mp.maxX){mp.x=mp.maxX-mp.w;mp.currentVx=-Math.abs(mp.currentVx);triggerMPWarning(mp);}
    } else if(mp.type==='movingV'){
      mp.y+=mp.currentVy*dt;
      if(mp.y<=mp.minY){mp.y=mp.minY;mp.currentVy=Math.abs(mp.currentVy);triggerMPWarning(mp);}
      if(mp.y+mp.h>=mp.maxY){mp.y=mp.maxY-mp.h;mp.currentVy=-Math.abs(mp.currentVy);triggerMPWarning(mp);}
    }
    var onThis=isPlayerOnPlatform(mp);
    if(onThis){
      if(mp.type==='movingH')player.x+=mp.x-prevX;
      if(mp.type==='movingV')player.y+=mp.y-prevY;
      mp.wasOn=true;
    } else { mp.wasOn=false; }
  }
}

function triggerMPWarning(mp){
  if(!window.audioEngine||!audioReady)return;
  if(mp.warned)return;
  audioEngine.triggerMovingPlatformWarning(mp.currentVx||mp.currentVy||0);
  mp.warned=true;
  setTimeout(function(){mp.warned=false;},300);
}

function updateTimedPlatform(dt){
  if(!timedPlatform)return;
  var tp=timedPlatform;
  if(tp.state==='active'){
    tp.timerOffset+=dt; tp.timer-=dt;
    if(tp.timer<=0.5&&!tp.warningFired){
      tp.warningFired=true;
      if(window.audioEngine&&audioReady)audioEngine.triggerTimedPlatformWarning();
    }
    if(tp.timer<=0){tp.state='warning'; tp.timer=0.5;}
  } else if(tp.state==='warning'){
    tp.timer-=dt;
    if(tp.timer<=0){
      tp.state='disappeared'; tp.timer=1.5;
      if(window.audioEngine&&audioReady)audioEngine.triggerTimedPlatformDisappear();
    }
  } else if(tp.state==='disappeared'){
    tp.timer-=dt;
    if(tp.timer<=0){tp.state='active'; tp.timer=3.0; tp.timerOffset=0; tp.warningFired=false;}
  }
}

function setPlayerAnimation(state){
  if(currentAnim!==state){currentAnim=state;animTime=0;}
}

var lastTime=0,fps=0,frameCount=0,fpsTime=0;
function gameLoop(timestamp){
  var dt=Math.min((timestamp-lastTime)/1000,0.05);
  lastTime=timestamp;
  frameCount++; fpsTime+=dt;
  if(fpsTime>=1){fps=Math.round(frameCount/fpsTime);frameCount=0;fpsTime=0;}
  if(!levelComplete){
    updateMovingPlatforms(dt);
    updateTimedPlatform(dt);
    updatePlayer(dt);
    if(window.audioEngine&&audioReady)audioEngine.updateProximity();
    if(checkSpikeCollision()&&deathTimer===0){
      deathTimer=1.5;deaths++;
      if(window.audioEngine&&audioReady)audioEngine.triggerSpikeDeath();
    }
    var collected=crystals?crystals.filter(function(c){return c.collected;}).length:0;
    if(collected>=crystalGate){
      var exit={x:736,y:544,w:48,h:64};
      if(player&&overlaps(player.x,player.y,player.w,player.h,exit.x,exit.y,exit.w,exit.h)){
        levelComplete=true; setPlayerAnimation('victory');
        if(window.audioEngine&&audioReady)audioEngine.triggerVictory();
      }
    }
  }
  if(deathTimer>0){deathTimer-=dt;if(deathTimer<=0)respawnPlayer();}
  animTime+=dt;
  render();
  if(el('fps'))el('fps').textContent=fps;
  if(el('px'))el('px').textContent=Math.round(player?player.x:0);
  if(el('cr'))el('cr').textContent=crystals?crystals.filter(function(c){return c.collected;}).length:0;
  if(el('de'))el('de').textContent=deaths;
  requestAnimationFrame(gameLoop);
}

function respawnPlayer(){
  if(lastCheckpoint){player.x=lastCheckpoint.x; player.y=lastCheckpoint.y;}
  else {player.x=32; player.y=64;}
  player.vx=0; player.vy=0; player.grounded=false;
  player.coyote=0; player.jumpBuffer=0; deathTimer=0;
  currentAnim='idle';
  if(window.audioEngine&&audioReady)audioEngine.setProximityTarget(player,crystals);
}

function updatePlayer(dt){
  if(!player||deathTimer>0)return;
  var GRAVITY=10,MAX_FALL=8,SPEED=5,COYOTE=0.1,JUMP=-7,JUMP_BUFFER=0.15;
  player.vy+=GRAVITY*dt;
  if(player.vy>MAX_FALL)player.vy=MAX_FALL;
  var left=keys['ArrowLeft']||keys['KeyA'];
  var right=keys['ArrowRight']||keys['KeyD'];
  if(left){player.vx=-SPEED;player.facingRight=false;}
  else if(right){player.vx=SPEED;player.facingRight=true;}
  else player.vx*=0.8;
  var jumpKey=keys['Space']||keys['ArrowUp']||keys['KeyW'];
  if(jumpKey)player.jumpBuffer=JUMP_BUFFER;
  else player.jumpBuffer-=dt;
  if(player.grounded)player.coyote=COYOTE;
  else player.coyote-=dt;
  if((player.grounded||player.coyote>0)&&player.jumpBuffer>0){
    player.vy=JUMP; player.jumpBuffer=0; player.coyote=0; player.grounded=false;
    if(window.audioEngine&&audioReady)audioEngine.triggerJump();
  }
  player.x+=player.vx*dt*60;
  player.y+=player.vy*dt*60;
  player.grounded=false;
  var allPlats=platforms.slice().concat(movingPlatforms);
  if(timedPlatform&&timedPlatform.state!=='disappeared')allPlats=allPlats.concat([timedPlatform]);
  for(var i=0;i<allPlats.length;i++){
    var pl=allPlats[i];
    if(overlaps(player.x,player.y,player.w,player.h,pl.x,pl.y,pl.w,pl.h)){
      var overTop=player.y+player.h-pl.y;
      var overBot=pl.y+pl.h-player.y;
      var overLeft=player.x+player.w-pl.x;
      var overRight=pl.x+pl.w-player.x;
      var minOV=Math.min(overTop,overBot,overLeft,overRight);
      if(minOV===overTop&&player.vy>=0){player.y=pl.y-player.h; player.vy=0; player.grounded=true;}
      else if(minOV===overBot&&player.vy<0){player.y=pl.y+pl.h; player.vy=0;}
      else if(minOV===overLeft){player.x=pl.x-player.w; player.vx=0;}
      else if(minOV===overRight){player.x=pl.x+pl.w; player.vx=0;}
    }
  }
  if(player.x<0)player.x=0;
  if(player.y>H+100){deathTimer=1.5;deaths++;if(window.audioEngine&&audioReady)audioEngine.triggerSpikeDeath();}
  for(var i=0;i<checkpoints.length;i++){
    var cp=checkpoints[i];
    if(!cp.activated&&overlaps(player.x,player.y,player.w,player.h,cp.x,cp.y,cp.w,cp.h)){
      cp.activated=true; lastCheckpoint={x:cp.x,y:cp.y};
      if(window.audioEngine&&audioReady)audioEngine.triggerCheckpoint();
    }
  }
  for(var i=0;i<crystals.length;i++){
    var cr=crystals[i];
    if(!cr.collected&&overlaps(player.x,player.y,player.w,player.h,cr.x-10,cr.y-16,20,32)){
      cr.collected=true;
      if(window.audioEngine&&audioReady)audioEngine.triggerCrystal();
    }
  }
  if(player.grounded){
    if(Math.abs(player.vx)>0.5)setPlayerAnimation('run');
    else setPlayerAnimation('idle');
  } else {
    if(player.vy<0)setPlayerAnimation('jump');
    else setPlayerAnimation('fall');
  }
}

function drawSpikes(x,y,w,h){
  ctx.fillStyle=C.spike;
  var count=Math.max(1,Math.floor(w/16));
  var sw=w/count;
  for(var i=0;i<count;i++){
    ctx.beginPath();
    ctx.moveTo(x+i*sw,y+h);
    ctx.lineTo(x+i*sw+sw/2,y);
    ctx.lineTo(x+(i+1)*sw,y+h);
    ctx.closePath(); ctx.fill();
  }
}

function drawCrystal(x,y){
  var t=Date.now()/800,b=Math.sin(t)*2;
  ctx.fillStyle=C.crystal; ctx.shadowColor=C.crystal; ctx.shadowBlur=8;
  ctx.beginPath();
  ctx.moveTo(x,y-16+b); ctx.lineTo(x+10,y+b);
  ctx.lineTo(x,y+16+b); ctx.lineTo(x-10,y+b);
  ctx.closePath(); ctx.fill(); ctx.shadowBlur=0;
}

function drawPlayer(){
  if(!player)return;
  if(deathTimer>0){
    var dtFrac=deathTimer/1.5;
    ctx.save(); ctx.globalAlpha=Math.max(0,dtFrac);
    ctx.fillStyle='#ffffff'; ctx.shadowColor='#00ffff'; ctx.shadowBlur=20*dtFrac;
    ctx.fillRect(player.x,player.y,player.w,player.h);
    ctx.restore(); return;
  }
  var sq=SQUASH_MAP[currentAnim]||{sx:1,sy:1};
  var sx=player.facingRight?sq.sx:-sq.sx,sy=sq.sy;
  var frames=SPRITE_MAP[currentAnim]||SPRITE_MAP.idle;
  var fi=Math.floor((animTime/SPRITE_DUR[currentAnim])%frames.length);
  var frame=frames[fi];
  var cx=player.x+player.w/2,cy=player.y+player.h/2;
  ctx.save(); ctx.translate(cx,cy); ctx.scale(sx,sy);
  if(frame&&spriteImages[frame]&&spriteTotal>0&&spriteLoadCount>=spriteTotal){
    ctx.globalAlpha=GLOW_ALPHA[currentAnim]||0.05;
    ctx.fillStyle=C.player; ctx.fillRect(-18,-18,36,36);
    ctx.globalAlpha=1;
    ctx.drawImage(spriteImages[frame],-16,-16,32,32);
  } else {
    ctx.fillStyle=C.player; ctx.shadowColor=C.player; ctx.shadowBlur=8;
    ctx.fillRect(-16,-16,32,32);
  }
  ctx.restore();
}

function render(){
  ctx.fillStyle=C.bg; ctx.fillRect(0,0,W,H);
  for(var i=0;i<platforms.length;i++){
    var pl=platforms[i];
    ctx.fillStyle=C.platform; ctx.fillRect(pl.x,pl.y,pl.w,pl.h);
    ctx.fillStyle=C.platLight; ctx.fillRect(pl.x,pl.y,pl.w,4);
  }
  for(var i=0;i<movingPlatforms.length;i++){
    var mp=movingPlatforms[i];
    ctx.fillStyle=mp.warned?C.mpWarn:C.mpChevron;
    ctx.fillRect(mp.x,mp.y,mp.w,mp.h);
    ctx.fillStyle='#ffffff'; ctx.globalAlpha=0.4;
    var cx2=mp.x+mp.w/2;
    ctx.beginPath(); ctx.moveTo(cx2-8,mp.y+mp.h/2); ctx.lineTo(cx2,mp.y+4); ctx.lineTo(cx2+8,mp.y+mp.h/2);
    ctx.closePath(); ctx.fill(); ctx.globalAlpha=1;
  }
  if(timedPlatform&&timedPlatform.state!=='disappeared'){
    var tp=timedPlatform;
    var isWarn=tp.state==='warning';
    var pulse=tp.timer>0&&Math.sin(Date.now()/150)>0;
    ctx.fillStyle=isWarn&&pulse?C.timedWarn:C.timed;
    ctx.fillRect(tp.x,tp.y,tp.w,tp.h);
    ctx.fillStyle='#ffffff'; ctx.globalAlpha=0.6;
    ctx.fillRect(tp.x+tp.w/2-12,tp.y+2,24,6);
    ctx.globalAlpha=1;
    if(tp.state==='active'||tp.state==='warning'){
      ctx.fillStyle='#ffffff'; ctx.font='10px monospace';
      ctx.fillText(tp.timer.toFixed(1),tp.x+tp.w/2-10,tp.y-3);
    }
  }
  for(var i=0;i<spikes.length;i++){
    var s=spikes[i]; drawSpikes(s.x,s.y,s.w,s.h);
  }
  for(var i=0;i<checkpoints.length;i++){
    var cp=checkpoints[i];
    ctx.fillStyle=cp.activated?C.checkpoint:C.checkpointDim;
    ctx.fillRect(cp.x,cp.y,cp.w,cp.h);
    if(cp.activated){ctx.fillStyle='#ffffff';ctx.shadowColor=C.checkpoint;ctx.shadowBlur=8;
      ctx.fillRect(cp.x+4,cp.y+8,cp.w-8,cp.h-16); ctx.shadowBlur=0;}
  }
  for(var i=0;i<crystals.length;i++){
    var cr=crystals[i];
    if(!cr.collected)drawCrystal(cr.x,cr.y);
  }
  var exit={x:736,y:544,w:48,h:64};
  ctx.fillStyle=C.exit; ctx.shadowColor=C.exit; ctx.shadowBlur=12;
  ctx.fillRect(exit.x,exit.y,exit.w,exit.h); ctx.shadowBlur=0;
  drawPlayer();
  ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillRect(5,5,130,68);
  ctx.fillStyle='#00ff88'; ctx.font='11px monospace';
  ctx.fillText('FPS: '+fps,10,18);
  ctx.fillText('X: '+(player?Math.round(player.x):0),10,32);
  ctx.fillText('V:'+(player?player.vx.toFixed(1):0)+' G:'+(player?player.grounded:false),10,46);
  var col=crystals?crystals.filter(function(c){return c.collected;}).length:0;
  ctx.fillText(col+'/'+crystalGate+' CRYSTALS',10,60);
}

document.addEventListener('keydown',function(e){keys[e.code]=true;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].indexOf(e.code)>-1)e.preventDefault();});
document.addEventListener('keyup',function(e){keys[e.code]=false;});
window.addEventListener('load',function(){
  preloadSprites();
  initLevel();
  lastTime=performance.now();
  requestAnimationFrame(gameLoop);
  if(window.audioEngine){audioReady=true;window.audioEngine.init();}
});
