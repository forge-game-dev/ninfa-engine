/**
 * DUNGEON RUNNER — Audio Engine v0.3
 * Cadenza, Audio Designer & Zephyr, Game Developer
 * For prototype.js integration
 * 
 * Usage:
 *   1. Include this script after prototype.js
 *   2. Call window.audioEngine.init() on game start
 *   3. Trigger sounds via window.audioEngine.trigger(id)
 *   4. Proximity: setProximityTarget(player, crystals) once, updateProximity() every frame
 *
 * Trigger IDs:
 *   JUMP, COYOTE_JUMP, LAND, CRYSTAL_COLLECT, DEATH,
 *   CHECKPOINT, LEVEL_COMPLETE, PORTAL, DROWN
 */
(function() {
  'use strict';

  var AudioEngine = window.AudioEngine = {};

  // ── Context ────────────────────────────────────────────────
  var ctx = null;
  var muted = false;
  var isPaused = false;

  // ── Config ─────────────────────────────────────────────────
  var CONFIG = {
    masterVolume:  0.7,
    musicVolume:  0.55,
    sfxVolume:    0.85,
    crossfadeDur: 2.0
  };

  // ── Master gain ────────────────────────────────────────────
  var masterGain = null;

  // ── Trigger IDs ───────────────────────────────────────────
  var TRIGGERS = {
    JUMP:            'SFX_JUMP',
    COYOTE_JUMP:     'SFX_COYOTE_JUMP',
    LAND:            'SFX_LAND',
    CRYSTAL_COLLECT: 'SFX_CRYSTAL_COLLECT',
    DEATH:           'SFX_DEATH',
    CHECKPOINT:      'SFX_CHECKPOINT',
    LEVEL_COMPLETE:  'SFX_LEVEL_COMPLETE',
    PORTAL:          'SFX_PORTAL',
    DROWN:           'SFX_DROWN'
  };

  // ── Init ──────────────────────────────────────────────────
  AudioEngine.init = function() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = CONFIG.masterVolume;
    masterGain.connect(ctx.destination);
  };

  function resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  // ── Helper: make oscillator ────────────────────────────────
  function makeOsc(type, freq) {
    var o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    return o;
  }

  // ── SFX: JUMP ─────────────────────────────────────────────
  AudioEngine.trigger_JUMP = function() {
    var osc = makeOsc('sine', 280);
    var g   = ctx.createGain();
    osc.connect(g); g.connect(masterGain);
    osc.frequency.setValueAtTime(280, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(560, ctx.currentTime + 0.08);
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.18);
  };

  // ── SFX: COYOTE_JUMP ──────────────────────────────────────
  AudioEngine.trigger_COYOTE_JUMP = function() {
    var osc  = makeOsc('triangle', 220);
    var filt = ctx.createBiquadFilter();
    var g    = ctx.createGain();
    osc.connect(filt); filt.connect(g); g.connect(masterGain);
    filt.type = 'lowpass'; filt.frequency.value = 1200;
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.22);
  };

  // ── SFX: LAND ─────────────────────────────────────────────
  AudioEngine.trigger_LAND = function() {
    var sr   = ctx.sampleRate;
    var buf  = ctx.createBuffer(1, sr * 0.1, sr);
    var d    = buf.getChannelData(0);
    for (var i = 0; i < d.length; i++)
      d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (d.length * 0.3));
    var src  = ctx.createBufferSource(); src.buffer = buf;
    var filt = ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 400;
    var g    = ctx.createGain(); g.gain.value = 0.4;
    src.connect(filt); filt.connect(g); g.connect(masterGain);
    src.start();
  };

  // ── SFX: CRYSTAL_COLLECT ──────────────────────────────────
  AudioEngine.trigger_CRYSTAL_COLLECT = function() {
    var freqs = [660, 880, 1100];
    for (var i = 0; i < freqs.length; i++) {
      var f = freqs[i];
      var osc = makeOsc('sine', f);
      var g   = ctx.createGain();
      osc.connect(g); g.connect(masterGain);
      var t = ctx.currentTime + i * 0.04;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.2, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.start(t); osc.stop(t + 0.3);
    }
  };

  // ── SFX: DEATH ────────────────────────────────────────────
  AudioEngine.trigger_DEATH = function() {
    var osc = makeOsc('sawtooth', 400);
    var g   = ctx.createGain();
    osc.connect(g); g.connect(masterGain);
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.6);
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.8);
  };

  // ── SFX: CHECKPOINT ───────────────────────────────────────
  AudioEngine.trigger_CHECKPOINT = function() {
    var freqs = [523, 659, 784];
    for (var i = 0; i < freqs.length; i++) {
      var f = freqs[i];
      var osc = makeOsc('sine', f);
      var g   = ctx.createGain();
      osc.connect(g); g.connect(masterGain);
      var t = ctx.currentTime + i * 0.12;
      g.gain.setValueAtTime(0.25, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t); osc.stop(t + 0.25);
    }
  };

  // ── SFX: LEVEL_COMPLETE ──────────────────────────────────
  AudioEngine.trigger_LEVEL_COMPLETE = function() {
    var melody = [523, 659, 784, 1047];
    for (var i = 0; i < melody.length; i++) {
      var f = melody[i];
      var osc = makeOsc('sine', f);
      var g   = ctx.createGain();
      osc.connect(g); g.connect(masterGain);
      var t = ctx.currentTime + i * 0.18;
      g.gain.setValueAtTime(0.3, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.start(t); osc.stop(t + 0.35);
    }
  };

  // ── SFX: PORTAL ───────────────────────────────────────────
  AudioEngine.trigger_PORTAL = function() {
    var osc = makeOsc('sine', 200);
    var g   = ctx.createGain();
    osc.connect(g); g.connect(masterGain);
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.4);
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.6);
  };

  // ── SFX: DROWN (placeholder — production version pending) ─
  AudioEngine.trigger_DROWN = function() {
    var sr   = ctx.sampleRate;
    var buf  = ctx.createBuffer(1, sr * 0.8, sr);
    var d    = buf.getChannelData(0);
    for (var i = 0; i < d.length; i++)
      d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (d.length * 0.5));
    var src  = ctx.createBufferSource(); src.buffer = buf;
    var filt = ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 600;
    var g    = ctx.createGain(); g.gain.value = 0.5;
    src.connect(filt); filt.connect(g); g.connect(masterGain);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    src.start();
  };

  // ══════════════════════════════════════════════════════════════
  // CRYSTAL PROXIMITY — v0.3 dual-oscillator system
  // Per Cadenza's exact spec:
  //   660Hz + 663.3Hz oscillators
  //   Bandpass filter, Q=5, freq = max(400, 660 - dist*20)
  //   Step-curve volume: 0.35→0.25→0.18→0.06→0
  //   Oscillators restart when volume > 0
  // ══════════════════════════════════════════════════════════════

  var _proxPlayer   = null;
  var _proxCrystals = [];
  var _proxGain     = null;
  var _proxOsc1     = null;
  var _proxOsc2     = null;
  var _proxFilter   = null;
  var _proxActive   = false;

  function _proxDist(ax, ay, bx, by) {
    var dx = ax - bx, dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function _proxStart() {
    if (!ctx || _proxOsc1) return;
    _proxGain   = ctx.createGain();
    _proxOsc1   = ctx.createOscillator();
    _proxOsc2   = ctx.createOscillator();
    _proxFilter = ctx.createBiquadFilter();

    _proxOsc1.type = 'sine'; _proxOsc1.frequency.value = 660;
    _proxOsc2.type = 'sine'; _proxOsc2.frequency.value = 663.3;
    _proxFilter.type = 'bandpass';
    _proxFilter.frequency.value = 660;
    _proxFilter.Q.value = 5;

    _proxGain.gain.value = 0;
    _proxOsc1.connect(_proxGain);
    _proxOsc2.connect(_proxGain);
    _proxGain.connect(_proxFilter);
    _proxFilter.connect(masterGain);

    _proxOsc1.start();
    _proxOsc2.start();
    _proxActive = true;
  }

  function _proxStop() {
    if (_proxOsc1) { try { _proxOsc1.stop(); } catch(e){} _proxOsc1 = null; }
    if (_proxOsc2) { try { _proxOsc2.stop(); } catch(e){} _proxOsc2 = null; }
    _proxGain = null; _proxFilter = null; _proxActive = false;
  }

  // Call once at level start
  AudioEngine.setProximityTarget = function(player, crystals) {
    _proxStop();
    _proxPlayer   = player;
    _proxCrystals = crystals || [];
    if (ctx && _proxCrystals.length > 0) _proxStart();
  };

  // Call every frame
  AudioEngine.updateProximity = function() {
    if (!_proxActive || !_proxPlayer || _proxCrystals.length === 0) return;

    var px = _proxPlayer.x !== undefined ? _proxPlayer.x : _proxPlayer.px;
    var py = _proxPlayer.y !== undefined ? _proxPlayer.y : _proxPlayer.py;

    var minDist = Infinity;
    for (var i = 0; i < _proxCrystals.length; i++) {
      var c = _proxCrystals[i];
      if (!c.collected) {
        var cx = c.x * 32 + 16, cy = c.y * 32 + 16;
        var d = _proxDist(px, py, cx, cy);
        if (d < minDist) minDist = d;
      }
    }

    // Step-curve volume per Cadenza spec
    var vol;
    if      (minDist < 0.5) vol = 0.35;
    else if (minDist < 1)   vol = 0.25;
    else if (minDist < 2)   vol = 0.18;
    else if (minDist < 3)   vol = 0.06;
    else                    vol = 0;

    _proxGain.gain.value = vol;

    // Filter: brighter when closer, min 400Hz
    var filtFreq = Math.max(400, 660 - minDist * 20);
    _proxFilter.frequency.value = filtFreq;

    // Oscillator restart: if volume drops to 0, stop; if volume returns, restart
    if (vol === 0 && _proxActive)  { _proxStop(); }
    if (vol >  0 && !_proxActive)  { _proxStart(); }
  };

  // Stop proximity on level exit / death
  AudioEngine.stopProximity = function() {
    _proxStop();
    _proxPlayer = null; _proxCrystals = [];
  };

  // ── Music crossfade ────────────────────────────────────────
  var _musicSrc  = null;
  var _musicGain = null;

  AudioEngine.crossfadeTo = function(url) {
    if (!ctx) return;
    var newGain = ctx.createGain();
    newGain.gain.value = 0; newGain.connect(masterGain);
    fetch(url).then(function(r) { return r.arrayBuffer(); })
      .then(function(buf) {
        ctx.decodeAudioData(buf, function(dec) {
          var src = ctx.createBufferSource();
          src.buffer = dec; src.loop = true;
          src.connect(newGain); src.start();
          if (_musicGain) _musicGain.gain.setTargetAtTime(0, ctx.currentTime, CONFIG.crossfadeDur / 3);
          if (_musicSrc)  setTimeout(function() { try { _musicSrc.stop(); } catch(e){} }, CONFIG.crossfadeDur * 1000 + 100);
          _musicSrc = src; _musicGain = newGain;
          newGain.gain.setTargetAtTime(CONFIG.musicVolume, ctx.currentTime, CONFIG.crossfadeDur / 3);
        });
      });
  };

  // ── Dispatch trigger(id) ───────────────────────────────────
  AudioEngine.trigger = function(id) {
    resume();
    switch(id) {
      case 'SFX_JUMP':            AudioEngine.trigger_JUMP();            break;
      case 'SFX_COYOTE_JUMP':     AudioEngine.trigger_COYOTE_JUMP();    break;
      case 'SFX_LAND':            AudioEngine.trigger_LAND();            break;
      case 'SFX_CRYSTAL_COLLECT': AudioEngine.trigger_CRYSTAL_COLLECT(); break;
      case 'SFX_DEATH':           AudioEngine.trigger_DEATH();           break;
      case 'SFX_CHECKPOINT':      AudioEngine.trigger_CHECKPOINT();      break;
      case 'SFX_LEVEL_COMPLETE':  AudioEngine.trigger_LEVEL_COMPLETE();  break;
      case 'SFX_PORTAL':          AudioEngine.trigger_PORTAL();          break;
      case 'SFX_DROWN':           AudioEngine.trigger_DROWN();           break;
    }
  };

  // Expose TRIGGERS for external access
  AudioEngine.TRIGGERS = TRIGGERS;

})();
