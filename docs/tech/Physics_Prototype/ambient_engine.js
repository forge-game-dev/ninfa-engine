/**
 * DUNGEON RUNNER — Ambient + Music Engine v0.1
 * Cadenza, Audio Designer
 * For prototype.js integration
 * 
 * Usage:
 *   1. Include this after audio_engine.js
 *   2. Call window.ambientEngine.init() on game start
 *   3. Call window.ambientEngine.startLevel(1) on level start
 *   4. Call window.ambientEngine.stop() on level end / death
 * 
 * Level themes:
 *   1 = Awakening (piano, sparse, celesta on completion)
 *   2 = First Steps (upbeat acoustic, subbass)
 *   3 = Deepening (ambient drone, key success)
 *   4 = The Trial (rhythmic pulse, hazard layer)
 *   5 = Ascent (orchestral, choir finale)
 */

// ─────────────────────────────────────────────
// Ambient Engine — Web Audio API ambient layer
// ─────────────────────────────────────────────
(function () {
  'use strict';

  var ctx = null;
  var masterGain = null;
  var initialized = false;
  var currentLevel = 0;
  var activeNodes = [];

  // ── Init ─────────────────────────────────
  function init() {
    if (initialized) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.0; // Ambient starts silent, fades in
      masterGain.connect(ctx.destination);
      initialized = true;
      console.log('[Ambient] Engine initialized');
    } catch (e) {
      console.warn('[Ambient] Web Audio not available:', e);
    }
  }

  // ── Resume on user interaction ─────────
  function resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  // ── Master volume (0–1) ────────────────
  function setVolume(vol) {
    if (masterGain) masterGain.gain.value = Math.max(0, Math.min(1, vol));
  }

  // ── Stop all nodes ─────────────────────
  function stopAll() {
    activeNodes.forEach(function (n) {
      try { n.stop(); } catch (e) { /* already stopped */ }
    });
    activeNodes = [];
    if (masterGain) {
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
    }
  }

  // ── Stop (for death / level exit) ─────
  function stop() {
    stopAll();
  }

  // ── Start a level theme ─────────────────
  function startLevel(levelNum) {
    if (!initialized || !ctx) return;
    resume();
    stopAll();
    currentLevel = levelNum || 1;

    // Fade in ambient
    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 1.5);

    switch (currentLevel) {
      case 1: _startAwakening(); break;
      case 2: _startFirstSteps(); break;
      case 3: _startDeepening(); break;
      case 4: _startTrial(); break;
      case 5: _startAscent(); break;
      default: _startAwakening();
    }
  }

  // ── Level 1: Awakening ─────────────────
  // Sparse piano arpeggios over stone reverb
  function _startAwakening() {
    // Low stone rumble — deep filtered noise
    var rumble = ctx.createOscillator();
    var rumbleFilter = ctx.createBiquadFilter();
    var rumbleGain = ctx.createGain();
    rumble.type = 'sine';
    rumble.frequency.value = 40;
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.value = 80;
    rumbleGain.gain.value = 0.08;
    rumble.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(masterGain);
    rumble.start();
    activeNodes.push(rumble);

    // Occasional soft wind — high-passed noise
    _scheduleRepeatingNoise(0.35, 0.04, 0.12, function(node) { activeNodes.push(node); });
  }

  // ── Level 2: First Steps ───────────────
  // Subtle acoustic pulse with subbass
  function _startFirstSteps() {
    var sub = ctx.createOscillator();
    var subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.value = 55;
    subGain.gain.value = 0.06;
    sub.connect(subGain);
    subGain.connect(masterGain);
    sub.start();
    activeNodes.push(sub);

    // Light rhythmic pulse
    _schedulePulse(0.1, 0.06);
  }

  // ── Level 3: Deepening ─────────────────
  // Mysterious ambient drone with light sparkle
  function _startDeepening() {
    // Drone: two detuned sine waves
    var drone1 = ctx.createOscillator();
    var drone2 = ctx.createOscillator();
    var droneGain = ctx.createGain();
    drone1.type = 'sine';
    drone1.frequency.value = 73.42; // D2
    drone2.type = 'sine';
    drone2.frequency.value = 77.78; // Eb2 (slight detune for chorus)
    droneGain.gain.value = 0.07;
    drone1.connect(droneGain);
    drone2.connect(droneGain);
    droneGain.connect(masterGain);
    drone1.start();
    drone2.start();
    activeNodes.push(drone1);
    activeNodes.push(drone2);
  }

  // ── Level 4: The Trial ──────────────────
  // Rhythmic pulse with tension layer
  function _startTrial() {
    _schedulePulse(0.4, 0.05);
    _schedulePulse(0.4, 0.03);

    var tension = ctx.createOscillator();
    var tensionGain = ctx.createGain();
    tension.type = 'sawtooth';
    tension.frequency.value = 110;
    tensionGain.gain.value = 0.03;
    tension.connect(tensionGain);
    tensionGain.connect(masterGain);
    tension.start();
    activeNodes.push(tension);
  }

  // ── Level 5: Ascent ────────────────────
  // Layered ambient build-up to epic feel
  function _startAscent() {
    var pad1 = ctx.createOscillator();
    var pad2 = ctx.createOscillator();
    var pad3 = ctx.createOscillator();
    var padGain = ctx.createGain();
    pad1.type = 'sine';
    pad1.frequency.value = 130.81; // C3
    pad2.type = 'triangle';
    pad2.frequency.value = 196.00; // G3
    pad3.type = 'sine';
    pad3.frequency.value = 261.63; // C4
    padGain.gain.value = 0.06;
    pad1.connect(padGain);
    pad2.connect(padGain);
    pad3.connect(padGain);
    padGain.connect(masterGain);
    pad1.start();
    pad2.start();
    pad3.start();
    activeNodes.push(pad1);
    activeNodes.push(pad2);
    activeNodes.push(pad3);
  }

  // ── Helpers ─────────────────────────────

  // Repeating filtered noise bursts (wind, ambience)
  function _scheduleRepeatingNoise(interval, peakVol, filterFreq, onStart) {
    var noise = ctx.createOscillator();
    var noiseFilter = ctx.createBiquadFilter();
    var noiseGain = ctx.createGain();
    noise.type = 'sawtooth';
    noise.frequency.value = 400 + Math.random() * 200;
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = filterFreq * 10;
    noiseFilter.Q.value = 2;
    noiseGain.gain.setValueAtTime(0, ctx.currentTime);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start();
    if (onStart) onStart(noise);
  }

  // Rhythmic pulse (distant heartbeat / tension)
  function _schedulePulse(interval, vol) {
    var pulse = ctx.createOscillator();
    var pulseGain = ctx.createGain();
    pulse.type = 'sine';
    pulse.frequency.value = 80;
    pulseGain.gain.setValueAtTime(vol, ctx.currentTime);
    pulseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    pulse.connect(pulseGain);
    pulseGain.connect(masterGain);
    pulse.start();
    pulse.stop(ctx.currentTime + 0.08);
    activeNodes.push(pulse);

    // Re-schedule
    var delayMs = interval * 1000;
    setTimeout(function () {
      if (initialized && currentLevel > 0) _schedulePulse(interval, vol);
    }, delayMs);
  }

  // ── Public API ──────────────────────────
  window.ambientEngine = {
    init: init,
    resume: resume,
    setVolume: setVolume,
    startLevel: startLevel,
    stop: stop
  };
})();
