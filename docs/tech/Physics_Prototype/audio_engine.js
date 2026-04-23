// audio_engine.js — Ninfa Engine Audio System v2.0
// Pure Web Audio API synthesis, no external dependencies
// 9 trigger IDs + crystal proximity harmonic

const audioEngine = (function() {
  let ctx = null;
  let initialized = false;
  let masterGain = null;

  const TRIGGERS = {
    JUMP: 'SFX_JUMP', COYOTE_JUMP: 'SFX_COYOTE_JUMP',
    LAND: 'SFX_LAND', CRYSTAL_COLLECT: 'SFX_CRYSTAL_COLLECT',
    DEATH: 'SFX_DEATH', CHECKPOINT: 'SFX_CHECKPOINT',
    LEVEL_COMPLETE: 'SFX_LEVEL_COMPLETE', PORTAL: 'SFX_PORTAL',
    DROWN: 'SFX_DROWN'
  };

  const CONFIG = {
    masterVolume: 0.7,
    musicVolume: 0.55,
    sfxVolume: 0.85,
    crossfadeDuration: 2.0
  };

  function init() {
    if (initialized) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = CONFIG.masterVolume;
    masterGain.connect(ctx.destination);
    initialized = true;
  }

  function resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  // ── SFX Synths ──────────────────────────────────────────────────────
  function playJump() {
    if (!initialized) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g); g.connect(masterGain);
    osc.frequency.setValueAtTime(280, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(560, ctx.currentTime + 0.08);
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.18);
  }

  function playCoyoteJump() {
    if (!initialized) return;
    const osc = ctx.createOscillator();
    const filt = ctx.createBiquadFilter();
    const g = ctx.createGain();
    osc.connect(filt); filt.connect(g); g.connect(masterGain);
    osc.type = 'triangle'; osc.frequency.value = 220;
    filt.type = 'lowpass'; filt.frequency.value = 1200;
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.22);
  }

  function playLand() {
    if (!initialized) return;
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.3));
    }
    const src = ctx.createBufferSource();
    const filt = ctx.createBiquadFilter();
    const g = ctx.createGain();
    src.buffer = buf; src.connect(filt); filt.connect(g); g.connect(masterGain);
    filt.type = 'lowpass'; filt.frequency.value = 400;
    g.gain.value = 0.4;
    src.start();
  }

  function playCrystalCollect() {
    if (!initialized) return;
    const freqs = [660, 880, 1100];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g); g.connect(masterGain);
      osc.type = 'sine'; osc.frequency.value = f;
      const t = ctx.currentTime + i * 0.04;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.2, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.start(t); osc.stop(t + 0.3);
    });
  }

  function playDeath() {
    if (!initialized) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g); g.connect(masterGain);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.6);
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.8);
  }

  function playCheckpoint() {
    if (!initialized) return;
    const freqs = [523, 659, 784];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g); g.connect(masterGain);
      osc.type = 'sine'; osc.frequency.value = f;
      const t = ctx.currentTime + i * 0.12;
      g.gain.setValueAtTime(0.25, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t); osc.stop(t + 0.25);
    });
  }

  function playLevelComplete() {
    if (!initialized) return;
    const melody = [523, 659, 784, 1047];
    melody.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g); g.connect(masterGain);
      osc.type = 'sine'; osc.frequency.value = f;
      const t = ctx.currentTime + i * 0.18;
      g.gain.setValueAtTime(0.3, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.start(t); osc.stop(t + 0.35);
    });
  }

  function playPortal() {
    if (!initialized) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g); g.connect(masterGain);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.4);
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.6);
  }

  function playDrown() {
    if (!initialized) return;
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.8, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.5));
    }
    const src = ctx.createBufferSource();
    const filt = ctx.createBiquadFilter();
    const g = ctx.createGain();
    src.buffer = buf; src.connect(filt); filt.connect(g); g.connect(masterGain);
    filt.type = 'lowpass'; filt.frequency.value = 600;
    g.gain.setValueAtTime(0.5, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    src.start();
  }

  // ── Crystal Proximity Harmonic ──────────────────────────────────────
  let proximityOsc = null, proximityGain = null, proximityFilter = null;

  function startProximitySound() {
    if (!initialized || proximityOsc) return;
    proximityOsc = ctx.createOscillator();
    proximityFilter = ctx.createBiquadFilter();
    proximityGain = ctx.createGain();
    proximityOsc.connect(proximityFilter);
    proximityFilter.connect(proximityGain);
    proximityGain.connect(masterGain);
    proximityOsc.type = 'sine';
    proximityOsc.frequency.value = 440;
    proximityFilter.type = 'bandpass';
    proximityFilter.frequency.value = 440;
    proximityFilter.Q.value = 8;
    proximityGain.gain.value = 0;
    proximityOsc.start();
  }

  function updateProximitySound(playerX, playerY, crystals) {
    if (!initialized) return;
    if (!proximityOsc) startProximitySound();
    let closest = Infinity;
    crystals.forEach(c => {
      if (!c.collected) {
        const dx = (c.x * 32 + 16) - playerX;
        const dy = (c.y * 32 + 16) - playerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < closest) closest = dist;
      }
    });
    const threshold = 96; // ~3 tiles
    const t = Math.max(0, Math.min(1, 1 - closest / threshold));
    const vol = t * 0.15;
    if (proximityGain) proximityGain.gain.setTargetAtTime(vol, ctx.currentTime, 0.1);
    if (proximityOsc) proximityOsc.frequency.setTargetAtTime(440 + t * 220, ctx.currentTime, 0.1);
  }

  function stopProximitySound() {
    if (proximityGain) { proximityGain.gain.setTargetAtTime(0, ctx.currentTime, 0.1); }
    if (proximityOsc) { setTimeout(() => { try { proximityOsc.stop(); } catch(e) {} }, 500); }
    proximityOsc = null; proximityGain = null; proximityFilter = null;
  }

  // ── Music Crossfade ────────────────────────────────────────────────
  let musicSource = null, musicGainNode = null;

  function crossfadeTo(url) {
    if (!initialized) return;
    const newGain = ctx.createGain();
    newGain.gain.value = 0;
    newGain.connect(masterGain);
    fetch(url).then(r => r.arrayBuffer()).then(buf => {
      ctx.decodeAudioData(buf, dec => {
        const src = ctx.createBufferSource();
        src.buffer = dec; src.loop = true; src.connect(newGain); src.start();
        if (musicGainNode) {
          musicGainNode.gain.setTargetAtTime(0, ctx.currentTime, CONFIG.crossfadeDuration / 3);
          setTimeout(() => { try { musicSource.stop(); } catch(e) {} }, CONFIG.crossfadeDuration * 1000 + 100); 
        }
        musicSource = src; musicGainNode = newGain;
        newGain.gain.setTargetAtTime(CONFIG.musicVolume, ctx.currentTime, CONFIG.crossfadeDuration / 3);
      });
    });
  }

  // ── Trigger API ────────────────────────────────────────────────────
  function trigger(id, data) {
    resume();
    switch(id) {
      case TRIGGERS.JUMP: playJump(); break;
      case TRIGGERS.COYOTE_JUMP: playCoyoteJump(); break;
      case TRIGGERS.LAND: playLand(); break;
      case TRIGGERS.CRYSTAL_COLLECT: playCrystalCollect(); break;
      case TRIGGERS.DEATH: playDeath(); break;
      case TRIGGERS.CHECKPOINT: playCheckpoint(); break;
      case TRIGGERS.LEVEL_COMPLETE: playLevelComplete(); break;
      case TRIGGERS.PORTAL: playPortal(); break;
      case TRIGGERS.DROWN: playDrown(); break;
    }
  }

  return { init, trigger, updateProximitySound, stopProximitySound, crossfadeTo, TRIGGERS };
})();
