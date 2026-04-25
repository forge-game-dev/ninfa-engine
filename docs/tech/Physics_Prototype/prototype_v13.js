(function(){"use strict";
var W=800,H=640;
var c=document.getElementById("gameCanvas");
var ctx=c.getContext("2d");
c.width=W;c.height=H;
var GRAVITY=10,MAX_FALL=8,SPEED=5,COYOTE=0.1,JUMP=-8,JUMP_BUFFER=0.2;
var TILE_BASE="https://forge-game-dev.github.io/ninfa-engine/docs/art/tilesets/level_4/";
var TILE_MAP={"platforms/platform_static_00.png":["p","s"],"platforms/platform_mp_h_00.png":["p","mh"],"platforms/platform_mp_v_00.png":["p","mv"],"platforms/platform_timed_00.png":["p","t"],"platforms/platform_timed_warning_00.png":["p","tw"],"platforms/platform_timed_gone_00.png":["p","tg"],"hazards/spike_floor_00.png":["h","f"],"hazards/spike_ceiling_00.png":["h","c"],"hazards/spike_wall_left_00.png":["h","wl"],"hazards/spike_wall_right_00.png":["h","wr"],"portal/portal_exit_00.png":["x","e"],"hazards/spike_corridor_01.png":["h","sc01"],"hazards/spike_corridor_02.png":["h","sc02"],"hazards/spike_corridor_03.png":["h","sc03"],"hazards/spike_corridor_04.png":["h","sc04"],"hazards/spike_corridor_05.png":["h","sc05"],"hazards/spike_corridor_06.png":["h","sc06"],"platforms/platform_mp_h_01.png":["p","mh01"],"platforms/platform_mp_h_02.png":["p","mh02"],"platforms/platform_mp_h_03.png":["p","mh03"],"platforms/platform_mp_h_04.png":["p","mh04"],"platforms/platform_mp_h_05.png":["p","mh05"],"platforms/platform_mp_v_01.png":["p","mv01"],"collectibles/crystal_00.png":["c","cr00"],"collectibles/crystal_01.png":["c","cr01"],"collectibles/crystal_02.png":["c","cr02"]};
var TDIMS={"platforms/platform_static_00.png":{w:64,h:16},"platforms/platform_mp_h_00.png":{w:64,h:16},"platforms/platform_mp_v_00.png":{w:64,h:16},"platforms/platform_timed_00.png":{w:96,h:16},"platforms/platform_timed_warning_00.png":{w:96,h:16},"platforms/platform_timed_gone_00.png":{w:96,h:16},"hazards/spike_floor_00.png":{w:32,h:32},"hazards/spike_ceiling_00.png":{w:32,h:32},"hazards/spike_wall_left_00.png":{w:32,h:32},"hazards/spike_wall_right_00.png":{w:32,h:32},"portal/portal_exit_00.png":{w:32,h:32}};
var keys={},animTime=0,lastTime=0,deaths=0,deathTimer=0,levelComplete=false;
var collected=0,crystalGate=12,inZoneC=false,currentLevel="04";
var player={x:32,y:64,w:28,h:28,vx:0,vy:0,grounded:false,lastGrounded:0,jumpBuffer:0,facingRight:true,coyoteT:0};
var platforms=[],movingPlatforms=[],timedPlatform=null,spikes=[],crystals=[],checkpoints=[],lastCheckpoint={x:64,y:96},collectedKeys={};
var pressurePlates=[],doors=[],keys_items=[],crystalSwitch=null,vaultDoor=null,exitDoor=null;
var levelData=null,audioEngine=null,tileImages={},tileLoadCount=0,tileTotal=0;
function el(id){return document.getElementById(id);}
function updateDOM(){var cr=el("cr");if(cr)cr.textContent="Crystals: "+collected+" / "+crystalGate;var de=el("de");if(de)de.textContent="Deaths: "+deaths;}
function drawTile(k,x,y,w,h){if(tileImages[k]&&tileImages[k].complete){ctx.drawImage(tileImages[k],x,y,w,h);}else{ctx.fillStyle="#333";ctx.fillRect(x,y,w,h);}}
function preloadTiles(){var ks=Object.keys(TILE_MAP);tileTotal=ks.length;tileLoadCount=0;ks.forEach(function(k){var img=new Image();img.onload=function(){tileLoadCount++;};img.onerror=function(){tileLoadCount++;};img.src=TILE_BASE+k;tileImages[k]=img;});}
function initAudio(){var ae=document.createElement("script");ae.src="https://forge-game-dev.github.io/ninfa-engine/docs/tech/Physics_Prototype/audio_engine.js";ae.onload=function(){audioEngine=window.audioEngine;if(audioEngine&&audioEngine.startProximitySound){audioEngine.startProximitySound();}};ae.onerror=function(){console.warn("Audio engine not loaded");};document.head.appendChild(ae);}
function aabb(ax,ay,aw,ah,bx,by,bw,bh){return ax<bx+bw&&ax+aw>bx&&ay<by+bh&&ay+ah>by;}
function collidePlatform(p){if(!aabb(player.x,player.y,player.w,player.h,p.x,p.y,p.w,p.h))return null;var ol=player.x+player.w-p.x,or=p.x+p.w-player.x,ot=player.y+player.h-p.y,ob=p.y+p.h-player.y;var m=Math.min(ol,or,ot,ob);if(m===ot&&player.vy>=0)return"top";if(m===ob&&player.vy<0)return"bottom";if(m===ol)return"left";if(m===or)return"right";return null;}
function triggerDeath(){if(deathTimer>0)return;deaths++;deathTimer=1.5;if(audioEngine)audioEngine.trigger("SPIKE_DEATH");updateDOM();}
function triggerDrown(){if(deathTimer>0)return;deaths++;deathTimer=1.5;if(audioEngine)audioEngine.trigger("DROWN");updateDOM();}
function triggerCrystal(){if(audioEngine)audioEngine.trigger("CRYSTAL");}
function triggerLand(){if(audioEngine)audioEngine.trigger("LAND");}
function triggerCheckpoint(){if(audioEngine)audioEngine.trigger("CHECKPOINT");}
function triggerVictory(){if(audioEngine)audioEngine.trigger("VICTORY_STING");}
function triggerSpatialWarning(px,py){if(!audioEngine)return;var p=player.x+player.w/2,pan=(px-p)/(W/2);if(pan<-1)pan=-1;if(pan>1)pan=1;audioEngine.triggerSpatialWarning(pan);}
// Schema-aware JSON level loader
function initLevelFromJSON(data){
  platforms=[];movingPlatforms=[];timedPlatform=null;spikes=[];crystals=[];checkpoints=[];
  pressurePlates=[];doors=[];keys_items=[];crystalSwitch=null;vaultDoor=null;exitDoor=null;
  levelData=data;collectedKeys={};inZoneC=false;
  collected=data.totalCrystals?0:0;crystalGate=data.crystalGate||Math.floor((data.crystals?data.crystals.length:0)*0.7);
  currentLevel=data.id||"01";player={x:32,y:64,w:28,h:28,vx:0,vy:0,grounded:false,lastGrounded:0,jumpBuffer:0,facingRight:true,coyoteT:0};
  var isTile=data.platforms&&data.platforms[0]&&data.platforms[0].tileX!==undefined;
  var T=isTile?32:1;
  if(data.spawn){player.x=data.spawn.x||32;player.y=data.spawn.y||64;}
  if(data.player&&data.player.tileX!==undefined){player.x=data.player.tileX*T;player.y=data.player.tileY*T;}
  if(data.platforms)data.platforms.forEach(function(p){var px=isTile?p.tileX*T:p.x||p.tileX*T||0;var py=isTile?p.tileY*T:p.y||p.tileY*T||0;var pw=p.w*T||32,ph=p.h*T||16;platforms.push({x:px,y:py,w:pw,h:ph,tileKey:p.tileKey||"platforms/platform_static_00.png",type:p.type||"static",mpId:p.mpId||null});});
  if(data.movingPlatforms)data.movingPlatforms.forEach(function(mp){
    var mpx=isTile?mp.tileX*T:mp.x||0,mpy=isTile?mp.tileY*T:mp.y||0;
    var mpd=(isTile&&mp.minX!==undefined)?mp.minX*T:(mp.baseX||mp.minX||0);
    var mpd2=(isTile&&mp.maxX!==undefined)?mp.maxX*T:(mp.maxX||mp.minX||0);
    var mpdY=(isTile&&mp.minY!==undefined)?mp.minY*T:(mp.minY||0);
    var mpd2Y=(isTile&&mp.maxY!==undefined)?mp.maxY*T:(mp.maxY||0);
    var spd=mp.velocityX||mp.velocityY||mp.speed||1.5;
    var mpType="horizontal";if(mp.type==="movingV"||mp.type==="vertical")mpType="vertical";var baseSpeed=mp.velocityX||mp.velocityY||mp.speed||1.5;movingPlatforms.push({x:mpx,y:mpy,w:mp.w*T||96,h:mp.h*T||16,tileKey:mp.tileKey||"platforms/platform_mp_h_00.png",dir:1,baseX:mpx,baseY:mpy,baseSpeed:baseSpeed,minX:Math.min(mpd,mpd2),maxX:Math.max(mpd,mpd2),minY:Math.min(mpdY,mpd2Y),maxY:Math.max(mpdY,mpd2Y),velX:mpType==="horizontal"?baseSpeed:0,velY:mpType==="vertical"?baseSpeed:0,type:mpType,warning:false,warned:false});
  });
  if(data.timedPlatform){var tp=data.timedPlatform;var tpx=isTile?tp.tileX*T:tp.x||0,tpy=isTile?tp.tileY*T:tp.y||0;timedPlatform={x:tpx,y:tpy,w:tp.w*T||96,h:tp.h*T||16,tileKey:tp.tileKey||"platforms/platform_timed_00.png",tileKeyWarn:"platforms/platform_timed_warning_00.png",tileKeyGone:"platforms/platform_timed_gone_00.png",timer:tp.timer||3,state:"visible",elapsed:0};}
  if(data.spikes)data.spikes.forEach(function(s){var sx=isTile?s.tileX*T:s.x||0,sy=isTile?s.tileY*T:s.y||0;spikes.push({x:sx,y:sy,w:s.w*T||32,h:s.h*T||32,type:s.type||"floor",tileKey:s.tileKey||"hazards/spike_floor_00.png"});});
  if(data.crystals)data.crystals.forEach(function(cr){var cx=isTile?cr.tileX*T:cr.x||0,cy=isTile?cr.tileY*T:cr.y||0;crystals.push({x:cx,y:cy,w:16,h:16,collected:false,tileKey:cr.tileKey||"collectibles/crystal_00.png"});});
  if(data.checkpoints)data.checkpoints.forEach(function(cp){var cpx=isTile?cp.tileX*T:cp.x||0,cpy=isTile?cp.tileY*T:cp.y||0;checkpoints.push({x:cpx,y:cpy,w:32,h:16,active:false});});
  if(data.keys)data.keys.forEach(function(k){var kx=isTile?k.tileX*T:k.x||0,ky=isTile?k.tileY*T:k.y||0;keys_items.push({x:kx,y:ky,w:16,h:16,type:k.type||"gold",collected:false,id:k.id||"KEY"});});
  if(data.doors)data.doors.forEach(function(d){var dx=isTile?d.tileX*T:d.x||0,dy=isTile?d.tileY*T:d.y||0;doors.push({x:dx,y:dy,w:32,h:48,type:d.type||"locked",open:false,keyId:d.key||null,linkedPlate:d.linkedPlate||null});});
  if(data.pressurePlates)data.pressurePlates.forEach(function(pp){var ppx=isTile?pp.tileX*T:pp.x||0,ppy=isTile?pp.tileY*T:pp.y||0;pressurePlates.push({x:ppx,y:ppy,w:48,h:8,pressed:false,linkedDoor:pp.linkedDoor||null});});
  if(data.crystalSwitch){var css=data.crystalSwitch;var csx=isTile?css.tileX*T:css.x||0,csy=isTile?css.tileY*T:css.y||0;crystalSwitch={x:csx,y:csy,w:32,h:32,active:false};}
  if(data.vaultDoor){var vd=data.vaultDoor;var vdx=isTile?vd.tileX*T:vd.x||0,vdy=isTile?vd.tileY*T:vd.y||0;vaultDoor={x:vdx,y:vdy,w:32,h:48,open:false,permanent:false};}
  if(data.exit){var ex=data.exit;var exx=isTile?ex.tileX*T:ex.x||0,exy=isTile?ex.tileY*T:ex.y||0;exitDoor={x:exx,y:exy,w:32,h:32};}
  updateDOM();
}
function loadLevel(id){
  var lvl=id||"04";var url="https://raw.githubusercontent.com/forge-game-dev/ninfa-engine/main/docs/levels/level_"+lvl+".json";
  fetch(url).then(function(r){if(!r.ok)throw new Error("HTTP "+r.status);return r.json();}).then(function(data){initLevelFromJSON(data);}).catch(function(e){console.error("Level load failed:",e);});
}

function updatePlayer(dt){
  if(deathTimer>0||levelComplete)return;
  var now=performance.now()/1000;
  player.vy+=GRAVITY*dt;if(player.vy>MAX_FALL)player.vy=MAX_FALL;
  player.vx=0;if(keys.ArrowLeft||keys.KeyA)player.vx=-SPEED;if(keys.ArrowRight||keys.KeyD)player.vx=SPEED;
  if(player.vx>0)player.facingRight=true;if(player.vx<0)player.facingRight=false;
  var wasGrounded=player.grounded;
  player.x+=player.vx*dt*60;player.y+=player.vy*dt*60;
  player.grounded=false;
  var onPlatform=null;
  for(var i=0;i<platforms.length;i++){var col=collidePlatform(platforms[i]);if(col==="top"){player.grounded=true;player.y=platforms[i].y-player.h;player.vy=0;onPlatform=platforms[i];break;}}
  if(!onPlatform){for(var i=0;i<movingPlatforms.length;i++){var col=collidePlatform(movingPlatforms[i]);if(col==="top"){player.grounded=true;player.y=movingPlatforms[i].y-player.h;player.vy=0;onPlatform=movingPlatforms[i];break;}}}
  if(!onPlatform&&timedPlatform&&timedPlatform.state==="visible"){var col=collidePlatform(timedPlatform);if(col==="top"){player.grounded=true;player.y=timedPlatform.y-player.h;player.vy=0;onPlatform=timedPlatform;}}
  if(player.grounded&&!wasGrounded)triggerLand();
  if(player.grounded)player.coyoteT=now+COYOTE;else if(now>player.coyoteT)player.coyoteT=0;
  var wantsJump=(keys.Space||keys.ArrowUp||keys.KeyW);if(wantsJump)player.jumpBuffer=now+JUMP_BUFFER;else player.jumpBuffer=0;
  var canJump=(player.grounded||player.coyoteT>0)&&player.jumpBuffer>0;
  if(canJump){player.vy=JUMP;player.grounded=false;player.coyoteT=0;player.jumpBuffer=0;if(audioEngine)audioEngine.trigger("JUMP");}
  // Spikes
  for(var i=0;i<spikes.length;i++){var s=spikes[i];var inset=6;if(aabb(player.x+inset,player.y+inset,player.w-inset*2,player.h-inset*2,s.x,s.y,s.w,s.h)){triggerDeath();return;}}
  // Crystals
  for(var i=0;i<crystals.length;i++){var cr=crystals[i];if(!cr.collected&&aabb(player.x,player.y,player.w,player.h,cr.x,cr.y,cr.w,cr.h)){cr.collected=true;collected++;if(audioEngine)audioEngine.trigger("CRYSTAL");updateDOM();}}
  // Keys
  for(var i=0;i<keys_items.length;i++){var k=keys_items[i];if(!k.collected&&aabb(player.x,player.y,player.w,player.h,k.x,k.y,k.w,k.h)){k.collected=true;collectedKeys[k.id]=(collectedKeys[k.id]||0)+1;if(audioEngine)audioEngine.trigger("KEY_PICKUP");}}
  // Doors
  for(var i=0;i<doors.length;i++){var d=doors[i];if(!d.open){if(aabb(player.x,player.y,player.w,player.h,d.x,d.y,d.w,d.h)){if(d.type==="locked"&&d.keyId&&collectedKeys[d.keyId]){d.open=true;if(audioEngine)audioEngine.trigger("DOOR_OPEN");}else if(d.type==="pressure"&&d.linkedPlate){var plate=pressurePlates.find(function(p){return p.linkedDoor===i;});if(plate&&plate.pressed){d.open=true;if(audioEngine)audioEngine.trigger("DOOR_OPEN");}}}}
  // Pressure Plates
  for(var i=0;i<pressurePlates.length;i++){var pp=pressurePlates[i];var wasPressed=pp.pressed;pp.pressed=aabb(player.x,player.y,player.w,player.h,pp.x,pp.y-8,pp.w,pp.h+8);if(pp.pressed&&!wasPressed&&audioEngine)audioEngine.trigger("PRESSURE_PLATE");}
  // Checkpoints
  for(var i=0;i<checkpoints.length;i++){var cp=checkpoints[i];if(aabb(player.x,player.y,player.w,player.h,cp.x,cp.y,cp.w,cp.h)){if(!cp.active){cp.active=true;triggerCheckpoint();}lastCheckpoint={x:cp.x,y:cp.y};}}
  // Crystal Switch + Vault
  if(crystalSwitch){if(aabb(player.x,player.y,player.w,player.h,crystalSwitch.x,crystalSwitch.y,crystalSwitch.w,crystalSwitch.h)){if(!crystalSwitch.active){crystalSwitch.active=true;if(vaultDoor&&!vaultDoor.permanent){vaultDoor.open=true;vaultDoor.permanent=true;if(audioEngine){audioEngine.trigger("VAULT_ACTIVATE");audioEngine.trigger("DOOR_OPEN");}}}}}
  // Exit
  if(exitDoor&&aabb(player.x,player.y,player.w,player.h,exitDoor.x,exitDoor.y,exitDoor.w,exitDoor.h)){if(collected>=crystalGate){levelComplete=true;if(audioEngine)audioEngine.trigger("VICTORY_STING");updateDOM();}}
  // Water / Death zones
  if(player.y>H+50)triggerDrown();
  if(player.x<-50||player.x>W+50)triggerDeath();
  // Zone C ambient
  if(levelData&&levelData.zones&&levelData.zones.zoneC){var zb=levelData.zones.zoneC;if(player.y>=zb.y&&player.x>=zb.x){if(!inZoneC&&audioEngine){audioEngine.startZoneCAmbient();inZoneC=true;}}else{if(inZoneC&&audioEngine){audioEngine.stopZoneCAmbient();inZoneC=false;}}}
}
function updateMovingPlatforms(dt){
  for(var i=0;i<movingPlatforms.length;i++){var mp=movingPlatforms[i];if(mp.type==="horizontal"){mp.x+=mp.velX*dt*60*mp.dir;if(mp.x<=mp.minX){mp.x=mp.minX;mp.dir=1;}if(mp.x+mp.w>=mp.maxX+mp.w){mp.x=mp.maxX;mp.dir=-1;}}else{mp.y+=mp.velY*dt*60*mp.dir;if(mp.y<=mp.minY){mp.y=mp.minY;mp.dir=1;}if(mp.y+mp.h>=mp.maxY+mp.h){mp.y=mp.maxY;mp.dir=-1;}}if(player.grounded){if(aabb(player.x,player.y+1,player.w,player.h,mp.x,mp.y,mp.w,mp.h)){if(mp.type==="horizontal")player.x+=mp.velX*dt*60*mp.dir;}}}
}
function updateTimedPlatform(dt){
  if(!timedPlatform)return;
  if(timedPlatform.state==="visible"){timedPlatform.elapsed+=dt;if(timedPlatform.elapsed>=timedPlatform.timer){timedPlatform.state="warning";timedPlatform.elapsed=0;}}else if(timedPlatform.state==="warning"){timedPlatform.elapsed+=dt;if(timedPlatform.elapsed>=0.5){timedPlatform.state="gone";timedPlatform.elapsed=0;}}else if(timedPlatform.state==="gone"){timedPlatform.elapsed+=dt;if(timedPlatform.elapsed>=timedPlatform.timer){timedPlatform.state="visible";timedPlatform.elapsed=0;}}}
  // Spatial warning for timed platform
  if(timedPlatform&&timedPlatform.state==="warning"&&!timedPlatform.warned){triggerSpatialWarning(timedPlatform.x, timedPlatform.y);timedPlatform.warned=true;}
  if(timedPlatform&&timedPlatform.state==="visible"){timedPlatform.warned=false;}
}
function drawPlatforms(){for(var i=0;i<platforms.length;i++){var p=platforms[i];if(p.tileKey&&tileImages[p.tileKey]&&tileImages[p.tileKey].complete){drawTile(p.tileKey,p.x,p.y,p.w,p.h);}else{ctx.fillStyle="#444";ctx.fillRect(p.x,p.y,p.w,p.h);}}}
function drawMovingPlatforms(){for(var i=0;i<movingPlatforms.length;i++){var mp=movingPlatforms[i];var key=mp.tileKey||"platforms/platform_mp_h_00.png";if(tileImages[key]&&tileImages[key].complete){drawTile(key,mp.x,mp.y,mp.w,mp.h);}else{ctx.fillStyle="#555";ctx.fillRect(mp.x,mp.y,mp.w,mp.h);}var cx=mp.x+mp.w/2;ctx.fillStyle="#8888ff";ctx.beginPath();if(mp.type==="horizontal"){mp.dir>0?ctx.moveTo(cx-14,mp.y+mp.h/2):ctx.moveTo(cx+14,mp.y+mp.h/2);ctx.lineTo(cx,mp.y+4);mp.dir>0?ctx.lineTo(cx+14,mp.y+mp.h/2):ctx.lineTo(cx-14,mp.y+mp.h/2);}else{ctx.moveTo(mp.x+mp.w/2,mp.y+4);ctx.lineTo(mp.x+4,mp.y+mp.h-4);ctx.lineTo(mp.x+mp.w-4,mp.y+mp.h-4);ctx.closePath();}ctx.fill();}}
function drawTimedPlatform(){if(!timedPlatform)return;var key;if(timedPlatform.state==="warning")key=timedPlatform.tileKeyWarn||"platforms/platform_timed_warning_00.png";else if(timedPlatform.state==="gone")key=timedPlatform.tileKeyGone||"platforms/platform_timed_gone_00.png";else key=timedPlatform.tileKey||"platforms/platform_timed_00.png";if(tileImages[key]&&tileImages[key].complete){ctx.globalAlpha=timedPlatform.state==="gone"?0.3:1;drawTile(key,timedPlatform.x,timedPlatform.y,timedPlatform.w,timedPlatform.h);ctx.globalAlpha=1;}else{ctx.fillStyle=timedPlatform.state==="warning"?"#f80":"#555";ctx.fillRect(timedPlatform.x,timedPlatform.y,timedPlatform.w,timedPlatform.h);}}
function drawSpikes(){for(var i=0;i<spikes.length;i++){var s=spikes[i];if(s.tileKey&&tileImages[s.tileKey]&&tileImages[s.tileKey].complete){drawTile(s.tileKey,s.x,s.y,s.w,s.h);}else{ctx.fillStyle="#a00";ctx.fillRect(s.x,s.y,s.w,s.h);}}}
function drawCrystals(){for(var i=0;i<crystals.length;i++){var cr=crystals[i];if(cr.collected)continue;if(cr.tileKey&&tileImages[cr.tileKey]&&tileImages[cr.tileKey].complete){drawTile(cr.tileKey,cr.x,cr.y,cr.w,cr.h);}else{ctx.fillStyle="#00ffff";ctx.beginPath();ctx.moveTo(cr.x+cr.w/2,cr.y);ctx.lineTo(cr.x+cr.w,cr.y+cr.h/2);ctx.lineTo(cr.x+cr.w/2,cr.y+cr.h);ctx.lineTo(cr.x,cr.y+cr.h/2);ctx.closePath();ctx.fill();}}}
function drawKeys(){for(var i=0;i<keys_items.length;i++){var k=keys_items[i];if(k.collected)continue;var colors={"gold":"#ffd700","silver":"#c0c0c0","copper":"#b87333"};ctx.fillStyle=colors[k.type]||"#ffd700";ctx.fillRect(k.x,k.y,k.w,k.h);ctx.strokeStyle="#000";ctx.strokeRect(k.x,k.y,k.w,k.h);}}
function drawDoors(){for(var i=0;i<doors.length;i++){var d=doors[i];if(d.open){ctx.fillStyle="rgba(0,100,0,0.3)";ctx.fillRect(d.x,d.y,d.w,d.h);}else{ctx.fillStyle=d.type==="locked"?"#8b4513":"#666";ctx.fillRect(d.x,d.y,d.w,d.h);ctx.strokeStyle="#000";ctx.strokeRect(d.x,d.y,d.w,d.h);}}}
function drawPressurePlates(){for(var i=0;i<pressurePlates.length;i++){var pp=pressurePlates[i];ctx.fillStyle=pp.pressed?"#0f0":"#888";ctx.fillRect(pp.x,pp.y,pp.w,pp.h);}}
function drawCheckpoints(){for(var i=0;i<checkpoints.length;i++){var cp=checkpoints[i];ctx.fillStyle=cp.active?"#00ff00":"#ff0000";ctx.fillRect(cp.x,cp.y,cp.w,cp.h);}}
function drawCrystalSwitch(){if(!crystalSwitch)return;ctx.fillStyle=crystalSwitch.active?"#ff0":"#f80";ctx.fillRect(crystalSwitch.x,crystalSwitch.y,crystalSwitch.w,crystalSwitch.h);}
function drawVaultDoor(){if(!vaultDoor)return;ctx.fillStyle=vaultDoor.open?"rgba(0,100,0,0.3)":"#8b0000";ctx.fillRect(vaultDoor.x,vaultDoor.y,vaultDoor.w,vaultDoor.h);ctx.strokeStyle="#ffd700";ctx.strokeRect(vaultDoor.x,vaultDoor.y,vaultDoor.w,vaultDoor.h);}
function drawExit(){if(!exitDoor)return;ctx.fillStyle="#0f0";ctx.beginPath();ctx.arc(exitDoor.x+exitDoor.w/2,exitDoor.y+exitDoor.h/2,exitDoor.w/2,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#fff";ctx.stroke();}
function drawPlayer(){
  if(deathTimer>0){ctx.globalAlpha=Math.max(0,deathTimer-0.5);ctx.fillStyle="#f00";ctx.fillRect(player.x,player.y,player.w,player.h);ctx.globalAlpha=1;return;}
  ctx.fillStyle="#08f";ctx.fillRect(player.x,player.y,player.w,player.h);
  ctx.fillStyle="#fff";var fx=player.facingRight?player.x+player.w-8:player.x+2;ctx.fillRect(fx,player.y+6,6,6);
}
function render(){
  ctx.fillStyle="#000";ctx.fillRect(0,0,W,H);
  if(!levelData){ctx.fillStyle="#888";ctx.font="20px monospace";ctx.fillText("Loading...",W/2-50,H/2);return;}
  drawPlatforms();drawMovingPlatforms();drawTimedPlatform();drawSpikes();drawCrystals();drawKeys();drawDoors();drawPressurePlates();drawCheckpoints();drawCrystalSwitch();drawVaultDoor();drawExit();drawPlayer();

  ctx.fillText("Level "+currentLevel,W-80,H-14);
  if(levelComplete){ctx.fillStyle="rgba(0,0,0,0.7)";ctx.fillRect(0,0,W,H);ctx.fillStyle="#fff";ctx.font="36px monospace";ctx.fillText("LEVEL COMPLETE!",W/2-150,H/2);ctx.font="18px monospace";ctx.fillText("Crystals: "+collected+"/"+crystalGate,W/2-60,H/2+40);}
}
var lastTime=0;var animTime=0;
function restartFromCheckpoint(){if(lastCheckpoint){player.x=lastCheckpoint.x;player.y=lastCheckpoint.y;player.vx=0;player.vy=0;player.grounded=false;}deathTimer=0;levelComplete=false;if(audioEngine&&audioEngine.setProximityTarget){audioEngine.setProximityTarget(player,crystals);}}
  function loop(ts){
  var dt=Math.min((ts-lastTime)/1000,0.1);lastTime=ts;animTime+=dt;
  if(deathTimer>0){deathTimer-=dt;if(deathTimer<=0){deathTimer=0;restartFromCheckpoint();}}
  updatePlayer(dt);updateMovingPlatforms(dt);updateTimedPlatform(dt);
  if(audioEngine&&audioEngine.updateProximitySound){audioEngine.updateProximitySound(player,crystals);}
  // Spatial warning for moving platforms
  for(var i=0;i<movingPlatforms.length;i++){
    var mp=movingPlatforms[i];
    var hx=mp.type==="horizontal"?mp.baseX:mp.x;
    var hy=mp.type==="horizontal"?mp.y:mp.baseY;
    var pan=(hx-player.x)/(W/2);
    if(pan<-1)pan=-1;if(pan>1)pan=1;
    if(Math.abs(player.y-hy)<80&&!mp.warned){triggerSpatialWarning(hx,hy);mp.warned=true;}
    if(!player.grounded||Math.abs(player.y-hy)>=80)mp.warned=false;
  }
  render();requestAnimationFrame(loop);
}
function init(){
  var p=window.location.search.match(/[?&]level=([^&]+)/);
  var lvl=p?p[1]:"04";if(lvl.length===1)lvl="0"+lvl;
  preloadTiles();initAudio();loadLevel(lvl);
  requestAnimationFrame(function(ts){lastTime=ts;loop(ts);});
}
window.addEventListener("keydown",function(e){keys[e.code]=true;});
window.addEventListener("keyup",function(e){keys[e.code]=false;});
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}
})();