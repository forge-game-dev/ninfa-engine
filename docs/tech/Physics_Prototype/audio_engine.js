/**
 * DUNGEON RUNNER — Audio Engine v0.2
 * Cadenza, Audio Designer
 * For prototype.js integration
 * 
 * Usage:
 *   1. Include this script after prototype.js
 *   2. Call window.audioEngine.init() on game start
 *   3. Trigger sounds via window.audioEngine.trigger(id)
 * 
 * Trigger IDs:
 *   JUMP, COYOTE_JUMP, LAND, CRYSTAL_COLLECT, DEATH,
 *   CHECKPOINT, LEVEL_COMPLETE, PORTAL
 */

// ─────────────────────────────────────────────
// Audio Engine — Web Audio API wrapper
// ─────────────────────────────────────────────
window.audioEngine = (function () {
  let ctx = null;
  let masterGain = null;
  let initialized = false;

  // ── Init (call once on game start) ──────
  function init() {
    if (initialized) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.7;
      masterGain.connect(ctx.destination);
      initialized = true;
      console.log('[Audio] Engine initialized, context:', ctx.state);
    } catch (e) {
      console.warn('[Audio] Web Audio not available:', e);
    }
  }

  // ── Resume on user interaction ─────────
  function resume() {
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  // ── Master volume (0–1) ─────────────────
  function setVolume(vol) {
    if (masterGain) masterGain.gain.value = Math.max(0, Math.min(1, vol));
  }

  // ── Trigger a sound by ID ──────────────
  function trigger(id) {
    if (!initialized || !ctx) return;
    resume();

    switch (id) {
      case 'JUMP':            _playJump();             break;
      case 'COYOTE_JUMP':     _playCoyoteJump();       break;
      case 'LAND':            _playLand();             break;
      case 'CRYSTAL_COLLECT': _playCrystal();          break;
      case 'DEATH':           _playDeath();            break;
      case 'CHECKPOINT':      _playCheckpoint();       break;
      case 'LEVEL_COMPLETE': _playLevelComplete();   break;
      case 'PORTAL':          _playPortal();          break;
      default:
        console.warn('[Audio] Unknown trigger:', id);
    }
  }

  // ── Internal synthesis ─────────────────

  // JUMP: Short whoosh — filtered sawtooth sweep
  function _playJump() {
    const dur = 0.2;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + dur);

    filter.type = 'lowpass';
    filter.frequency.value = 1200;

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  }

  // COYOTE_JUMP: Softer confirmation — slightly quieter than normal jump
  // Triggers when player jumps within coyote time window (after leaving platform edge)
  function _playCoyoteJump() {
    const dur = 0.22;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + dur);

    filter.type = 'lowpass';
    filter.frequency.value = 800;

    gain.gain.setValueAtTime(0.18, ctx.currentTime);  // Quieter than normal jump
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  }

  // LAND: Soft thud — sine with quick decay
  function _playLand() {
    const dur = 0.12;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + dur);

    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  }

  // CRYSTAL_COLLECT: Ascending chime
  function _playCrystal() {
    const notes = [880, 1109, 1320];
    notes.forEach(function(freq, i) {
      var delay = i * 0.08;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.2);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.2);
    });
  }

  // DEATH: Fade + descending tone
  function _playDeath() {
    var dur = 0.8;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + dur);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + dur);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  }

  // CHECKPOINT: Warm beacon tone
  function _playCheckpoint() {
    var dur = 0.5;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(330, ctx.currentTime);
    osc.frequency.setValueAtTime(440, ctx.currentTime + 0.15);
    osc.frequency.setValueAtTime(550, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  }

  // LEVEL_COMPLETE: Victory fanfare
  function _playLevelComplete() {
    var notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach(function(freq, i) {
      var delay = i * 0.18;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + delay + 0.02);
      gain.gain.setValueAtTime(0.25, ctx.currentTime + delay + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.55);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.55);
    });
  }

  // PORTAL: Swirling tone
  function _playPortal() {
    var dur = 0.6;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + dur * 0.6);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + dur);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.setValueAtTime(0.25, ctx.currentTime + dur * 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  }

  // ── Public API ──────────────────────────
  return {
    init: init,
    resume: resume,
    setVolume: setVolume,
    trigger: trigger
  };
})();
