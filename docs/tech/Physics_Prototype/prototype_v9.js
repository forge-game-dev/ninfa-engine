// Dungeon Runner — Level 4: The Gauntlet
// prototype_v9.js — Complete working build
// Canvas: 800×640 | 32×32 tile grid | 16 crystals | 2 checkpoints
// Bug #9 fix: DOM HUD wiring (#crystalCount, #deathCount updated on state change)

(function(){
'use strict';
var W=800,H=640,c=document.getElementById('gameCanvas'),ctx=c.getContext('2d');
c.width=W;c.height=H;
var GRAVITY=10,MAX_FALL=8,SPEED=5,COYOTE=0.1,JUMP=-7,JUMP_BUFFER=0.15;
var keys={},animTime=0,lastTime=0,deaths=0,deathTimer=0,levelComplete=false;
var collected=0,crystalGate=12;
var player={x:32,y:64,w:28,h:28,vx:0,vy:0,grounded:false,lastGrounded:0,jumpBuffer:0,facingRight:true,coyoteT:0};

function el(id){return document.getElementById(id);}
function updateDOM(){
  var cr=el('crystalCount');if(cr)cr.textContent=collected+'/'+crystalGate;
  var de=el('deathCount');if(de)de.textContent=deaths;
  var de2=el('de');if(de2)de2.textContent=deaths;
}

var platforms=[
  {x:0,y:608,w:192,h:32},{x:256,y:608,w:256,h:32},{x:576,y:608,w:224,h:32},
  {x:0,y:320,w:64,h:32},{x:288,y:320,w:192,h:32},{x:544,y:320,w:64,h:32},
  {x:0,y:192,w:192,h:32},{x:256,y:192,w:160,h:32},{x:480,y:192,w:320,h:32},
  {x:0,y:448,w:128,h:32},{x:192,y:448,w:128,h:32},{x:384,y:448,w:416,h:32},
  {x:0,y:576,w:64,h:32},{x:0,y:64,w:64,h:32},{x:128,y:64,w:128,h:32},
  {x:320,y:96,w:96,h:32},{x:480,y:64,w:64,h:32},{x:608,y:64,w:192,h:32}
];
var movingPlatforms=[
  {id:'MP-H1',x:192,y:256,w:64,h:16,type:'movingH',baseX:192,baseY:256,range:96,velX:3,currentVx:3,state:'active',warned:false},
  {id:'MP-H2',x:416,y:256,w:64,h:16,type:'movingH',baseX:416,baseY:256,range:96,velX:-3,currentVx:-3,state:'active',warned:false},
  {id:'MP-H3',x:608,y:384,w:64,h:16,type:'movingH',baseX:576,baseY:384,range:96,velX:4,currentVx:4,state:'active',warned:false},
  {id:'MP-H4',x:448,y:544,w:64,h:16,type:'movingH',baseX:416,baseY:544,range:80,velX:-4,currentVx:-4,state:'active',warned:false},
  {id:'MP-V1',x:320,y:416,w:64,h:16,type:'movingV',baseX:320,baseY:384,range:96,velY:2,currentVy:2,state:'active',warned:false},
  {id:'MP-V2',x:544,y:480,w:64,h:16,type:'movingV',baseX:544,baseY:448,range:64,velY:-2,currentVy:-2,state:'active',warned:false}
];
var timedPlatform={x:544,y:544,w:96,h:16,timer:3.0,state:'active',respawnTimer:0};
var spikes=[
  {x:0,y:576,w:64,h:32,type:'pit'},{x:320,y:576,w:128,h:32,type:'pit'},
  {x:544,y:576,w:128,h:32,type:'pit'},{x:0,y:640,w:64,h:32,type:'pit'},
  {x:320,y:640,w:128,h:32,type:'pit'},{x:544,y:640,w:128,h:32,type:'pit'},
  {x:192,y:288,w:64,h:32,type:'wall'},{x:608,y:192,w:32,h:32,type:'wall'},
  {x:288,y:448,w:32,h:32,type:'wall'},{x:480,y:384,w:32,h:32,type:'wall'}
];
var crystals=[
  {x:96,y:576,collected:false},{x:416,y:576,collected:false},{x:640,y:576,collected:false},
  {x:96,y:160,collected:false},{x:384,y:160,collected:false},{x:704,y:160,collected:false},
  {x:224,y:448,collected:false},{x:448,y:448,collected:false},{x:672,y:448,collected:false},
  {x:160,y:384,collected:false},{x:352,y:288,collected:false},{x:576,y:384,collected:false},
  {x:48,y:288,collected:false},{x:736,y:320,collected:false},{x:96,y:544,collected:false},
  {x:672,y:96,collected:false}
];
var checkpoints=[
  {x:64,y:96,w:16,h:32,activated:true,respawnX:64,respawnY:96},
  {x:256,y:256,w:16,h:32,activated:false,respawnX:256,respawnY:256}
];
var lastCheckpoint={x:64,y:96};

var TILE_BASE='https://raw.githubusercontent.com/forge-game-dev/ninfa-engine/main/docs/art/tilesets/';
var TILE_MAP={
  'level_4/platforms/platform_static.png':['platform','static'],
  'level_4/platforms/platform_mp_h1.png':['platform','moving_h'],
  'level_4/platforms/platform_mp_h2.png':['platform','moving_h'],
  'level_4/platforms/platform_mp_v1.png':['platform','moving_v'],
  'level_4/platforms/platform_mp_v2.png':['platform','moving_v'],
  'level_4/platforms/platform_timed.png':['platform','timed'],
  'level_4/platforms/platform_timed_warning_00.png':['platform','timed_warn'],
  'level_4/platforms/platform_timed_gone_00.png':['platform','timed_gone'],
  'level_4/hazards/spike_floor_00.png':['hazard','spike_floor'],
  'level_4/hazards/spike_ceiling_00.png':['hazard','spike_ceiling'],
  'level_4/hazards/spike_wall_left_00.png':['hazard','spike_wall_left'],
  'level_4/hazards/spike_wall_right_00.png':['hazard','spike_wall_right'],
  'level_1/collectibles/crystal.png':['collectible','crystal'],
  'level_1/collectibles/checkpoint_inactive.png':['prop','checkpoint'],
  'level_1/collectibles/checkpoint_active.png':['prop','checkpoint_active'],
  'level_4/portal/portal_exit_00.png':['prop','portal']
};
var TILE_DIMS={
  'level_4/platforms/platform_static.png':{w:32,h:32},
  'level_4/platforms/platform_mp_h1.png':{w:96,h:16},
  'level_4/platforms/platform_mp_h2.png':{w:96,h:16},
  'level_4/platforms/platform_mp_v1.png':{w:16,h:64},
  'level_4/platforms/platform_mp_v2.png':{w:16,h:64},
  'level_4/platforms/platform_timed.png':{w:96,h:16},
  'level_4/platforms/platform_timed_warning_00.png':{w:96,h:16},
  'level_4/platforms/platform_timed_gone_00.png':{w:96,h:16},
  'level_4/hazards/spike_floor_00.png':{w:32,h:32},
  'level_4/hazards/spike_ceiling_00.png':{w:32,h:32},
  'level_4/hazards/spike_wall_left_00.png':{w:32,h:32},
  'level_4/hazards/spike_wall_right_00.png':{w:32,h:32},
  'level_1/collectibles/crystal.png':{w:32,h:32},
  'level_1/collectibles/checkpoint_inactive.png':{w:32,h:48},
  'level_1/collectibles/checkpoint_active.png':{w:32,h:48},
  'level_4/portal/portal_exit_00.png':{w:48,h:64}
};
var tileImages={},tileLoadCount=0,tileTotal=0;
undefined

function preloadTiles(){
  var ks=Object.keys(TILE_MAP);tileTotal=ks.length;
  ks.forEach(function(k){
    var img=new Image();
    img.onload=function(){tileLoadCount++;};
    img.onerror=function(){tileLoadCount++;};
    img.src=TILE_BASE+k;tileImages[k]=img;
  });
}

function drawTile(key,x,y,w,h){
  var img=tileImages[key],d=TILE_DIMS[key]||{w:32,h:32};
  var dw=w||d.w,dh=h||d.h;
  if(!img||!img.complete||img.naturalWidth===0){
    ctx.fillStyle=TILE_MAP[key]&&TILE_MAP[key][0]==='platform'?'#5a4a3a':'#888';
    ctx.fillRect(x,y,dw,dh);return;
  }
  for(var tx=0;tx<dw;tx+=d.w){for(var ty=0;ty<dh;ty+=d.h){ctx.drawImage(img,tx,ty,Math.min(d.w,dw-tx),Math.min(d.h,dh-ty));}}
}

var audioEngine=null;

function initAudio(){
  try{
    var ae=document.createElement('script');
    ae.src='https://raw.githubusercontent.com/forge-game-dev/ninfa-engine/main/docs/tech/Physics_Prototype/audio_engine.js';
    ae.onload=function(){if(window.audioEngine)audioEngine=window.audioEngine;};
    document.head.appendChild(ae);
  }catch(e){}
}

window.addEventListener('keydown',function(e){
  keys[e.code]=true;
  if((e.code==='Space'||e.code==='ArrowUp'||e.code==='KeyW')&&deathTimer<=0&&!levelComplete)player.jumpBuffer=JUMP_BUFFER;
  if(e.code==='KeyR')restartLevel();
});
window.addEventListener('keyup',function(e){keys[e.code]=false;});

function aabb(ax,ay,aw,ah,bx,by,bw,bh){
  return ax<bx+bw&&ax+aw>bx&&ay<by+bh&&ay+ah>by;
}

function collidePlatform(p){
  if(!aabb(player.x,player.y,player.w,player.h,p.x,p.y,p.w,p.h))return null;
  var ol=player.x+player.w-p.x,or=p.x+p.w-player.x,ot=player.y+player.h-p.y,ob=p.y+p.h-player.y;
  var m=Math.min(ol,or,ot,ob);
  if(m===ot&&player.vy>=0)return'top';
  if(m===ob&&player.vy<0)return'bottom';
  if(m===ol)return'left';
  if(m===or)return'right';
  return null;
}

function triggerDeath(){
  if(deathTimer>0)return;
  deaths++;updateDOM();
  deathTimer=1.5;
  if(audioEngine)audioEngine.trigger('SPIKE_DEATH');
}

function updatePlayer(dt){
  if(deathTimer>0){
    deathTimer-=dt;
    if(deathTimer<=0){
      player.x=lastCheckpoint.x;player.y=lastCheckpoint.y;
      player.vx=0;player.vy=0;player.grounded=false;deathTimer=0;
    }
    return;
  }
  if(levelComplete)return;
  var left=keys['ArrowLeft']||keys['KeyA'];
  var right=keys['ArrowRight']||keys['KeyD'];
  var jump=keys['Space']||keys['ArrowUp']||keys['KeyW'];
  player.vx=0;
  if(left){player.vx=-SPEED;player.facingRight=false;}
  if(right){player.vx=SPEED;player.facingRight=true;}
  if(player.grounded)player.coyoteT=COYOTE;else player.coyoteT=Math.max(0,player.coyoteT-dt);
  if(jump&&player.jumpBuffer<=0)player.jumpBuffer=JUMP_BUFFER;
  var canJump=player.grounded||player.coyoteT>0;
  if(canJump&&player.jumpBuffer>0){
    player.vy=JUMP;player.grounded=false;player.coyoteT=0;player.jumpBuffer=0;
    if(audioEngine)audioEngine.trigger('JUMP');
  }
  player.jumpBuffer=Math.max(0,player.jumpBuffer-dt);
  player.vy+=GRAVITY*dt;
  if(player.vy>MAX_FALL)player.vy=MAX_FALL;
  player.x+=player.vx;player.grounded=false;
  var allPlats=platforms.concat(movingPlatforms);
  if(timedPlatform&&timedPlatform.state!=='disappeared')allPlats.push(timedPlatform);
  for(var i=0;i<allPlats.length;i++){
    var side=collidePlatform(allPlats[i]);
    if(side==='top'){player.y=allPlats[i].y-player.h;player.vy=0;player.grounded=true;}
    else if(side==='bottom'){player.y=allPlats[i].y+allPlats[i].h;player.vy=0;}
    else if(side==='left'){player.x=allPlats[i].x-allPlats[i].w;}
    else if(side==='right'){player.x=allPlats[i].x+allPlats[i].w;}
  }
  if(player.y>H){triggerDeath();}
  if(player.y<H-32){
    for(var i=0;i<spikes.length;i++){
      var s=spikes[i];
      if(aabb(player.x+6,player.y+6,player.w-12,player.h-12,s.x,s.y,s.w,s.h)){triggerDeath();return;}
    }
  }
  for(var i=0;i<crystals.length;i++){
    var cr=crystals[i];
    if(!cr.collected&&aabb(player.x,player.y,player.w,player.h,cr.x-8,cr.y-8,16,16)){
      cr.collected=true;collected++;updateDOM();
      if(audioEngine)audioEngine.trigger('CRYSTAL');
      if(collected>=crystalGate&&!levelComplete){levelComplete=true;if(audioEngine)audioEngine.trigger('EXIT');}
    }
  }
  for(var i=0;i<checkpoints.length;i++){
    var cp=checkpoints[i];
    if(!cp.activated&&aabb(player.x,player.y,player.w,player.h,cp.x,cp.y-32,cp.w,cp.h)){
      cp.activated=true;lastCheckpoint={x:cp.respawnX,y:cp.respawnY};
      if(audioEngine)audioEngine.trigger('CHECKPOINT');
    }
  }
  if(player.x<0)player.x=0;
  if(player.x>W-player.w)player.x=W-player.w;
}

function updateMovingPlatforms(dt){
  var WARN_DIST=0.15;
  for(var i=0;i<movingPlatforms.length;i++){
    var mp=movingPlatforms[i];
    if(mp.type==='movingH'){
      mp.x+=mp.currentVx*dt;
      var traveled=mp.x-mp.baseX;
      if(traveled>mp.range){mp.x=mp.baseX+mp.range;mp.currentVx*=-1;mp.warned=false;}
      else if(traveled<-mp.range){mp.x=mp.baseX-mp.range;mp.currentVx*=-1;mp.warned=false;}
      else if(!mp.warned&&mp.range-Math.abs(traveled)<WARN_DIST*mp.range){
        mp.warned=true;if(audioEngine)audioEngine.trigger('MOVING_PLATFORM_WARNING');
      }
    } else {
      mp.y+=mp.currentVy*dt;
      var traveled=mp.y-mp.baseY;
      if(traveled>mp.range){mp.y=mp.baseY+mp.range;mp.currentVy*=-1;mp.warned=false;}
      else if(traveled<-mp.range){mp.y=mp.baseY-mp.range;mp.currentVy*=-1;mp.warned=false;}
      else if(!mp.warned&&mp.range-Math.abs(traveled)<WARN_DIST*mp.range){
        mp.warned=true;if(audioEngine)audioEngine.trigger('MOVING_PLATFORM_WARNING');
      }
    }
  }
}

function updateTimedPlatform(dt){
  if(!timedPlatform)return;
  if(timedPlatform.state==='active'){
    timedPlatform.timer-=dt;
    if(timedPlatform.timer<=0.5&&timedPlatform.timer>0){
      if(audioEngine)audioEngine.trigger('TIMED_PLATFORM_WARNING');
    }
    if(timedPlatform.timer<=0){
      timedPlatform.state='disappeared';timedPlatform.timer=0;
      if(audioEngine)audioEngine.trigger('TIMED_PLATFORM_DISAPPEAR');
    }
  } else if(timedPlatform.state==='disappeared'){
    timedPlatform.respawnTimer+=dt;
    if(timedPlatform.respawnTimer>=1.5){
      timedPlatform.state='active';timedPlatform.timer=3.0;timedPlatform.respawnTimer=0;
    }
  }
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
  for(var i=0;i<platforms.length;i++){var p=platforms[i];drawTile('level_4/platforms/platform_static.png',p.x,p.y,p.w,p.h);}
}
function drawMovingPlatforms(){
  for(var i=0;i<movingPlatforms.length;i++){
    var mp=movingPlatforms[i];
    var tileKey=mp.type==='movingH'?'level_4/platforms/platform_mp_h1.png':'level_4/platforms/platform_mp_v1.png';
    ctx.globalAlpha=mp.warned?0.6:1.0;
    drawTile(tileKey,mp.x,mp.y,mp.w,mp.h);
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
  var tileKey='level_4/platforms/platform_timed.png';
  if(tp.state==='warning')tileKey='level_4/platforms/platform_timed_warning_00.png';
  else if(tp.state==='disappeared')tileKey='level_4/platforms/platform_timed_gone_00.png';
  ctx.globalAlpha=tp.state==='disappeared'?0.2:1.0;
  drawTile(tileKey,tp.x,tp.y,tp.w,tp.h);
  if(tp.state!=='disappeared'){
    ctx.fillStyle='#ffa500';ctx.font='bold 10px monospace';ctx.textAlign='center';
    ctx.fillText(Math.ceil(tp.timer)+'s',tp.x+tp.w/2,tp.y-4);
  }
  ctx.globalAlpha=1;
}
function drawSpikes(){
  for(var i=0;i<spikes.length;i++){
    var s=spikes[i];
    var key=s.type==='wall'?'level_4/hazards/spike_wall_left_00.png':'level_4/hazards/spike_floor_00.png';
    drawTile(key,s.x,s.y,s.w,s.h);
  }
}
function drawCrystals(){
  for(var i=0;i<crystals.length;i++){
    var cr=crystals[i];if(cr.collected)continue;
    ctx.save();ctx.shadowColor='#00ffcc';ctx.shadowBlur=12;
    ctx.fillStyle='rgba(0,255,204,0.3)';ctx.beginPath();ctx.arc(cr.x,cr.y,16,0,Math.PI*2);ctx.fill();
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
    ctx.globalAlpha=cp.activated?1:0.4;
    ctx.fillStyle=cp.activated?'#ffd700':'#665500';
    ctx.fillRect(cp.x,cp.y-32,cp.w,cp.h);
    ctx.globalAlpha=1;
  }
}
function drawExitPortal(){
  if(collected>=crystalGate){
    ctx.fillStyle='rgba(0,255,204,0.2)';ctx.fillRect(736,544,48,64);
    drawTile('level_4/portal/portal_exit_00.png',736,544,48,64);
  }
}
function drawPlayer(){
  if(deathTimer>0){
    var alpha=Math.max(0,deathTimer/1.5);
    ctx.globalAlpha=alpha;
    ctx.fillStyle='#ff4757';
    ctx.fillRect(player.x,player.y,player.w,player.h);
    ctx.globalAlpha=1;return;
  }
  ctx.fillStyle='#00d4ff';
  ctx.fillRect(player.x,player.y,player.w,player.h);
  ctx.fillStyle='#fff';ctx.font='10px monospace';ctx.textAlign='center';
  ctx.fillText('●',player.x+player.w/2,player.y+player.h/2+3);
}
function drawHUD(){
  ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(5,5,200,100);
  ctx.fillStyle='#fff';ctx.font='12px monospace';ctx.textAlign='left';
  ctx.fillText('FPS: '+(lastTime>0?Math.round(1/lastTime):60),10,18);
  ctx.fillStyle='#00ffcc';ctx.fillText('CRYSTALS: '+collected+'/'+crystalGate,10,36);
  ctx.fillStyle='#ff4757';ctx.fillText('DEATHS: '+deaths,10,54);
  ctx.fillStyle='#aaa';ctx.fillText('TILES: '+tileLoadCount+'/'+tileTotal,10,72);
  ctx.fillText('CP: '+checkpoints.filter(function(c){return c.activated;}).length,10,90);
}
function render(){
  drawBackground();drawPlatforms();drawMovingPlatforms();
  drawTimedPlatform();drawSpikes();drawCrystals();
  drawCheckpoints();drawExitPortal();drawPlayer();drawHUD();
  if(levelComplete){
    ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#ffd700';ctx.font='bold 32px monospace';ctx.textAlign='center';
    ctx.fillText('LEVEL COMPLETE!',W/2,H/2-20);
    ctx.font='18px monospace';ctx.fillStyle='#fff';
    ctx.fillText('Crystals: '+collected+'/'+crystals.length+' | Deaths: '+deaths,W/2,H/2+20);
    ctx.font='14px monospace';ctx.fillStyle='#aaa';
    ctx.fillText('Press R to restart',W/2,H/2+50);
  }
}

function restartLevel(){
  deaths=0;collected=0;levelComplete=false;deathTimer=0;
  player={x:32,y:64,w:28,h:28,vx:0,vy:0,grounded:false,jumpBuffer:0,facingRight:true,coyoteT:0};
  lastCheckpoint={x:64,y:96};
  crystals.forEach(function(c){c.collected=false;});
  checkpoints.forEach(function(cp,i){cp.activated=i===0;});
  movingPlatforms.forEach(function(mp){mp.x=mp.baseX;mp.y=mp.baseY;mp.currentVx=mp.velX;mp.currentVy=mp.velY;mp.warned=false;});
  timedPlatform={x:544,y:544,w:96,h:16,timer:3.0,state:'active',respawnTimer:0};
  updateDOM();
}

var prevTime=0;
function gameLoop(ts){
  var dt=Math.min((ts-prevTime)/1000,0.05);prevTime=ts;
  animTime+=dt;lastTime=dt;
  updatePlayer(dt);updateMovingPlatforms(dt);updateTimedPlatform(dt);
  render();
  requestAnimationFrame(gameLoop);
}

function init(){
  preloadTiles();initAudio();updateDOM();
  requestAnimationFrame(function(ts){prevTime=ts;requestAnimationFrame(gameLoop);});
}

init();
})();
