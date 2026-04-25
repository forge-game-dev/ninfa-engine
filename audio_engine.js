// ============================================================
// audio_engine.js  Dungeon Runner Audio System v0.5
// Cadenza  Audio Designer @ GameDev
// ============================================================

var AudioEngine = (function() {
  let ctx = null;
  let masterGain = null;
  let proximityGainNode = null;
  let proximityOsc1 = null;
  let proximityOsc2 = null;
  let proximityLFO = null;
  let proximityFilter = null;
  let proximityActive = false;
  let proximityTimer = null;
  let activeSounds = [];
  let proximityTarget = null;
  let proximityCrystals = [];

  // ---- INIT ----
  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.7;
    masterGain.connect(ctx.destination);
  }

  function resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  // ---- CORE TRIGGER ----
  function trigger(name, param) {
    init();
    resume();
    switch (name) {
      case 'JUMP':         _playJump();       break;
      case 'LAND':          _playLand();       break;
      case 'CRYSTAL':       _playCrystal();    break;
      case 'EXIT':          _playExit();       break;
      case 'COMPLETE':      _playComplete();   break;
      case 'DEATH':         _playDeath();      break;
      case 'CHECKPOINT':    _playCheckpoint(); break;
      case 'DROWN':         _playDrown();      break;
      case 'KEY_COLLECT':   _playKeyCollect(param); break;
      case 'DOOR_LOCKED':   _playDoorLocked(); break;
      case 'DOOR_UNLOCK':   _playDoorUnlock(); break;
      case 'TIMED_DOOR_WARNING': _playTimedDoorWarning(); break;
      case 'CRYSTAL_SWITCH': _playCrystalSwitch(); break;
      case 'PRESSURE_PLATE': _playPressurePlate(); break;
      case 'VAULT_ACTIVATE': _playVaultActivate(); break;
      case 'VICTORY_STING':       _playVictorySting();        break;
      case 'ZONE_C_AMBIENT_START': startZoneCAmbient();       break;
      case 'ZONE_C_AMBIENT_STOP':  stopZoneCAmbient();        break;
      case 'SPIKE_DEATH':          _playSpikeDeath();          break;
      case 'TIMED_PLATFORM_DISAPPEAR': _playTimedPlatformDisappear(); break;
      default: console.warn('[AudioEngine] Unknown trigger:', name);
    }
  }

  // ---- EXISTING SFX ----
  function _playJump() {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(560, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain); gain.connect(masterGain);
    osc.start(); osc.stop(ctx.currentTime + 0.15);
  }

  function _playLand() {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.07);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(gain); gain.connect(masterGain);
    osc.start(); osc.stop(ctx.currentTime + 0.1);
  }

  function _playCrystal() {
    [660, 880, 1100].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.04;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(gain); gain.connect(masterGain);
      osc.start(t); osc.stop(t + 0.3);
    });
  }

  function _playExit() {
    [440, 550, 660, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      osc.connect(gain); gain.connect(masterGain);
      osc.start(t); osc.stop(t + 0.6);
    });
  }

  function _playComplete() {
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.05);
      gain.gain.setValueAtTime(0.2, t + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
      osc.connect(gain); gain.connect(masterGain);
      osc.start(t); osc.stop(t + 1.0);
    });
  }

  function _playDeath() {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain); gain.connect(masterGain);
    osc.start(); osc.stop(ctx.currentTime + 0.5);
  }

  function _playCheckpoint() {
    [330, 440, 550, 660].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.08;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.03);
      gain.gain.setValueAtTime(0.18, t + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.connect(gain); gain.connect(masterGain);
      osc.start(t); osc.stop(t + 0.5);
    });
  }

  // ============================================================
  // LEVEL 2 SFX — DROWN (production replacement)
  // Distinction from SPIKE_DEATH: liquid submergence, pressure,
  // resonant panic tones — NOT harsh metallic scraping.
  // ============================================================
  function _playDrown() {
    // --- Panic tone: pitch-bending resonant sine (trapped air) ---
    const panic = ctx.createOscillator();
    const panicGain = ctx.createGain();
    panic.type = "sine";
    panic.frequency.setValueAtTime(900, ctx.currentTime);
    panic.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 1.4);
    panicGain.gain.setValueAtTime(0.22, ctx.currentTime);
    panicGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

    // --- Panic harmonic: soft harmonic layer for depth ---
    const panicHarm = ctx.createOscillator();
    const panicHarmGain = ctx.createGain();
    panicHarm.type = "triangle";
    panicHarm.frequency.setValueAtTime(1350, ctx.currentTime);
    panicHarm.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 1.4);
    panicHarmGain.gain.setValueAtTime(0.08, ctx.currentTime);
    panicHarmGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.3);

    // --- Noise layer 1: submersion rush (wide bandpass, fast fade) ---
    const noiseA = ctx.createBufferSource();
    const bufA = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
    const dA = bufA.getChannelData(0);
    for (let i = 0; i < dA.length; i++) dA[i] = Math.random() * 2 - 1;
    noiseA.buffer = bufA; noiseA.loop = true;
    const bpf = ctx.createBiquadFilter();
    bpf.type = "bandpass"; bpf.frequency.value = 500; bpf.Q.value = 0.4;
    const noiseAGain = ctx.createGain();
    noiseAGain.gain.setValueAtTime(0, ctx.currentTime);
    noiseAGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.12);
    noiseAGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
    noiseA.connect(bpf); bpf.connect(noiseAGain); noiseAGain.connect(masterGain);

    // --- Noise layer 2: deep rumble tail (lowpass, longer tail) ---
    const noiseB = ctx.createBufferSource();
    const bufB = ctx.createBuffer(1, ctx.sampleRate * 3.5, ctx.sampleRate);
    const dB = bufB.getChannelData(0);
    for (let i = 0; i < dB.length; i++) dB[i] = Math.random() * 2 - 1;
    noiseB.buffer = bufB; noiseB.loop = true;
    const lpf = ctx.createBiquadFilter();
    lpf.type = "lowpass";
    lpf.frequency.setValueAtTime(1200, ctx.currentTime);
    lpf.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 2.5);
    const noiseBGain = ctx.createGain();
    noiseBGain.gain.setValueAtTime(0, ctx.currentTime);
    noiseBGain.gain.linearRampToValueAtTime(0.38, ctx.currentTime + 0.2);
    noiseBGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.5);
    noiseB.connect(lpf); lpf.connect(noiseBGain); noiseBGain.connect(masterGain);

    // --- Water pressure: deep sub-frequency (liquid weight) ---
    const pressure = ctx.createOscillator();
    const pressureGain = ctx.createGain();
    pressure.type = "sine";
    pressure.frequency.setValueAtTime(60, ctx.currentTime);
    pressure.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 1.0);
    pressureGain.gain.setValueAtTime(0, ctx.currentTime);
    pressureGain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.18);
    pressureGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);
    pressure.connect(pressureGain); pressureGain.connect(masterGain);

    // --- Undercurrent: slow LFO modulated tone (water movement) ---
    const under = ctx.createOscillator();
    const underLFO = ctx.createOscillator();
    const underLFOGain = ctx.createGain();
    const underGain = ctx.createGain();
    under.type = "sine"; under.frequency.value = 110;
    underLFO.type = "sine"; underLFO.frequency.value = 3.5;
    underLFOGain.gain.value = 18;
    underLFO.connect(underLFOGain); underLFOGain.connect(under.frequency);
    underGain.gain.setValueAtTime(0, ctx.currentTime);
    underGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.3);
    underGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.8);
    under.connect(underGain); underGain.connect(masterGain);

    // Wire panic tone
    panic.connect(panicGain); panicGain.connect(masterGain);
    panicHarm.connect(panicHarmGain); panicHarmGain.connect(masterGain);

    // Start all
    panic.start(); panic.stop(ctx.currentTime + 1.5);
    panicHarm.start(); panicHarm.stop(ctx.currentTime + 1.4);
    noiseA.start(); noiseA.stop(ctx.currentTime + 2.5);
    noiseB.start(); noiseB.stop(ctx.currentTime + 3.5);
    pressure.start(); pressure.stop(ctx.currentTime + 3.0);
    under.start(); underLFO.start();
    under.stop(ctx.currentTime + 2.8); underLFO.stop(ctx.currentTime + 2.8);
  }

  // ============================================================
  // LEVEL 3 SFX
  // ============================================================

  function _playKeyCollect(color) {
    const freqMap = { gold: 1200, red: 900, blue: 660 };
    const freq = freqMap[color] || 900;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 400;
    osc1.type = 'sine';
    osc1.frequency.value = freq;
    osc2.type = 'triangle';
    osc2.frequency.value = freq * 2;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc1.connect(filter); osc2.connect(filter); filter.connect(gain); gain.connect(masterGain);
    osc1.start(); osc2.start();
    osc1.stop(ctx.currentTime + 0.3); osc2.stop(ctx.currentTime + 0.3);
  }

  function _playDoorLocked() {
    const thud = ctx.createOscillator();
    const buzz = ctx.createOscillator();
    const thudGain = ctx.createGain();
    const buzzGain = ctx.createGain();
    const distortion = ctx.createWaveShaper();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(120, ctx.currentTime);
    thud.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
    thudGain.gain.setValueAtTime(0.4, ctx.currentTime);
    thudGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    thud.connect(thudGain); thudGain.connect(masterGain);
    thud.start(); thud.stop(ctx.currentTime + 0.2);
    distortion.curve = _makeDistortionCurve(50);
    buzz.type = 'sawtooth';
    buzz.frequency.value = 80;
    buzzGain.gain.setValueAtTime(0.15, ctx.currentTime + 0.05);
    buzzGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    buzz.connect(distortion); distortion.connect(buzzGain); buzzGain.connect(masterGain);
    buzz.start(ctx.currentTime + 0.05); buzz.stop(ctx.currentTime + 0.4);
  }

  function _playDoorUnlock() {
    const click = ctx.createOscillator();
    const sweep = ctx.createOscillator();
    const clickGain = ctx.createGain();
    const sweepGain = ctx.createGain();
    click.type = 'square';
    click.frequency.value = 2000;
    clickGain.gain.setValueAtTime(0.5, ctx.currentTime);
    clickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    click.connect(clickGain); clickGain.connect(masterGain);
    click.start(); click.stop(ctx.currentTime + 0.05);
    sweep.type = 'sine';
    sweep.frequency.setValueAtTime(150, ctx.currentTime + 0.05);
    sweep.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.5);
    sweepGain.gain.setValueAtTime(0, ctx.currentTime + 0.05);
    sweepGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.1);
    sweepGain.gain.setValueAtTime(0.25, ctx.currentTime + 0.35);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    sweep.connect(sweepGain); sweepGain.connect(masterGain);
    sweep.start(ctx.currentTime + 0.05); sweep.stop(ctx.currentTime + 0.55);
  }

  function _playTimedDoorWarning() {
    [800, 600].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.connect(gain); gain.connect(masterGain);
      osc.start(t); osc.stop(t + 0.1);
    });
  }

  function _playCrystalSwitch() {
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
    osc2.type = 'triangle';
    osc2.frequency.value = 2800;
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain); osc2.connect(gain); gain.connect(masterGain);
    osc.start(); osc2.start();
    osc.stop(ctx.currentTime + 0.2); osc2.stop(ctx.currentTime + 0.2);
  }

  function _playPressurePlate() {
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.08);
    osc2.type = 'sine';
    osc2.frequency.value = 400;
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain); osc2.connect(gain); gain.connect(masterGain);
    osc.start(); osc2.start();
    osc.stop(ctx.currentTime + 0.15); osc2.stop(ctx.currentTime + 0.15);
  }

  function _playVaultActivate() {
    const freqs = [82, 110, 123, 165];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.1 + i * 0.05);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain); gain.connect(masterGain);
      osc.start(); osc.stop(ctx.currentTime + 1.2);
    });
    const sweep = ctx.createOscillator();
    const sweepGain = ctx.createGain();
    sweep.type = 'sine';
    sweep.frequency.setValueAtTime(3000, ctx.currentTime + 0.1);
    sweep.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.8);
    sweepGain.gain.setValueAtTime(0.1, ctx.currentTime + 0.1);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
    sweep.connect(sweepGain); sweepGain.connect(masterGain);
    sweep.start(ctx.currentTime + 0.1); sweep.stop(ctx.currentTime + 1.0);
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.value = 40;
    subGain.gain.setValueAtTime(0.3, ctx.currentTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    sub.connect(subGain); subGain.connect(masterGain);
    sub.start(); sub.stop(ctx.currentTime + 1.2);
  }

    // ============================================================
  // LEVEL 4 SFX — Spike Death & Timed Platform Disappear
  // ============================================================
  function _playSpikeDeath() {
    const scrape = ctx.createOscillator();
    const ring = ctx.createOscillator();
    const scrapeGain = ctx.createGain();
    const ringGain = ctx.createGain();
    const distortion = ctx.createWaveShaper();
    scrape.type = 'sawtooth';
    scrape.frequency.setValueAtTime(800, ctx.currentTime);
    scrape.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
    scrapeGain.gain.setValueAtTime(0.25, ctx.currentTime);
    scrapeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    distortion.curve = _makeDistortionCurve(30);
    scrape.connect(distortion); distortion.connect(scrapeGain); scrapeGain.connect(masterGain);
    scrape.start(); scrape.stop(ctx.currentTime + 0.2);
    ring.type = 'sine';
    ring.frequency.value = 1200;
    ringGain.gain.setValueAtTime(0.15, ctx.currentTime);
    ringGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    ring.connect(ringGain); ringGain.connect(masterGain);
    ring.start(); ring.stop(ctx.currentTime + 0.15);
  }

  function _playTimedPlatformDisappear() {
    const sweep = ctx.createOscillator();
    const crumble = ctx.createOscillator();
    const sweepGain = ctx.createGain();
    const crumbleGain = ctx.createGain();
    sweep.type = 'sine';
    sweep.frequency.setValueAtTime(800, ctx.currentTime);
    sweep.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
    sweepGain.gain.setValueAtTime(0.2, ctx.currentTime);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    crumble.type = 'triangle';
    crumble.frequency.setValueAtTime(300, ctx.currentTime);
    crumble.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.25);
    crumbleGain.gain.setValueAtTime(0, ctx.currentTime);
    crumbleGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
    crumbleGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    sweep.connect(sweepGain); sweepGain.connect(masterGain);
    crumble.connect(crumbleGain); crumbleGain.connect(masterGain);
    sweep.start(); crumble.start();
    sweep.stop(ctx.currentTime + 0.35); crumble.stop(ctx.currentTime + 0.3);
  }

  // ============================================================
  // LEVEL 5 — The Sanctum
  // ============================================================
  function _playVictorySting() {
    const freqs = [523, 659, 784];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.05);
      gain.gain.setValueAtTime(0.22, t + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
      osc.connect(gain); gain.connect(masterGain);
      osc.start(t); osc.stop(t + 1.2);
    });
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmer.type = 'sine';
    shimmer.frequency.setValueAtTime(1500, ctx.currentTime);
    shimmer.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.5);
    shimmerGain.gain.setValueAtTime(0.08, ctx.currentTime);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
    shimmer.connect(shimmerGain); shimmerGain.connect(masterGain);
    shimmer.start(); shimmer.stop(ctx.currentTime + 1.0);
  }

  // ---- ZONE C AMBIENT ----
  // Module-level state (accessible to both start and stop)
  let zoneCGainNode = null;
  let zoneCOsc1 = null;
  let zoneCOsc2 = null;
  let zoneCLFO = null;
  let zoneCFilter = null;
  let zoneCActive = false;

  function startZoneCAmbient() {
    if (zoneCActive) return;
    init(); resume();
    zoneCActive = true;
    zoneCFilter = ctx.createBiquadFilter();
    zoneCFilter.type = 'lowpass';
    zoneCFilter.frequency.value = 600;
    zoneCFilter.Q.value = 1.0;
    zoneCGainNode = ctx.createGain();
    zoneCGainNode.gain.setValueAtTime(0, ctx.currentTime);
    zoneCGainNode.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 2.0);
    zoneCOsc1 = ctx.createOscillator();
    zoneCOsc2 = ctx.createOscillator();
    zoneCLFO = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    zoneCOsc1.type = 'sine';
    zoneCOsc1.frequency.value = 220;
    zoneCOsc2.type = 'triangle';
    zoneCOsc2.frequency.value = 330;
    zoneCLFO.type = 'sine';
    zoneCLFO.frequency.value = 0.33;
    lfoGain.gain.value = 4;
    zoneCLFO.connect(lfoGain);
    lfoGain.connect(zoneCOsc1.frequency);
    zoneCOsc1.connect(zoneCFilter);
    zoneCOsc2.connect(zoneCFilter);
    zoneCFilter.connect(zoneCGainNode);
    zoneCGainNode.connect(masterGain);
    zoneCOsc1.start();
    zoneCOsc2.start();
    zoneCLFO.start();
  }

  function stopZoneCAmbient() {
    if (!zoneCActive) return;
    zoneCActive = false;
    if (zoneCGainNode) {
      zoneCGainNode.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
      const osc1 = zoneCOsc1, osc2 = zoneCOsc2, lfo = zoneCLFO, filt = zoneCFilter, gain = zoneCGainNode;
      setTimeout(() => {
        try { osc1.stop(); osc2.stop(); lfo.stop(); } catch(e) {}
      }, 1500);
      [zoneCOsc1, zoneCOsc2, zoneCLFO, zoneCFilter, zoneCGainNode] = [null, null, null, null, null];
    }
  }

function _makeDistortionCurve(amount) {
    const samples = 44100;
    const curve = new Float32Array(samples);
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }

  // ============================================================
  // LEVEL 4 SPATIAL WARNINGS  per-platform directional audio
  // ============================================================

  function _buildImpulseReverb(durationSec) {
    const reverb = ctx.createConvolver();
    const irLength = ctx.sampleRate * durationSec;
    const impulse = ctx.createBuffer(2, irLength, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < irLength; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / irLength, 2);
      }
    }
    reverb.buffer = impulse;
    return reverb;
  }

  // MOVING_PLATFORM_WARNING  metallic ping, directional pan, cave reverb
  function _playMovingPlatformWarning(panValue) {
    const panner = ctx.createStereoPanner();
    panner.pan.value = Math.max(-1, Math.min(1, panValue || 0));
    const reverb = _buildImpulseReverb(0.3);
    const dryGain = ctx.createGain();
    dryGain.gain.value = 0.7;
    const wetGain = ctx.createGain();
    wetGain.gain.value = 0.3;
    [400, 800].forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = freq === 400 ? 'triangle' : 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain); gain.connect(panner);
      osc.start(); osc.stop(ctx.currentTime + 0.2);
    });
    panner.connect(dryGain); dryGain.connect(masterGain);
    panner.connect(reverb); reverb.connect(wetGain); wetGain.connect(masterGain);
  }

  // TIMED_PLATFORM_WARNING  softer dual-tone, 3s warning
  function _playTimedPlatformWarning(panValue) {
    const panner = ctx.createStereoPanner();
    panner.pan.value = Math.max(-1, Math.min(1, panValue || 0));
    const reverb = _buildImpulseReverb(0.5);
    const dryGain = ctx.createGain();
    dryGain.gain.value = 0.6;
    const wetGain = ctx.createGain();
    wetGain.gain.value = 0.4;
    [200, 300].forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain); gain.connect(panner);
      osc.start(); osc.stop(ctx.currentTime + 0.4);
    });
    panner.connect(dryGain); dryGain.connect(masterGain);
    panner.connect(reverb); reverb.connect(wetGain); wetGain.connect(masterGain);
  }

  // ============================================================
  // PROXIMITY SYSTEM (unchanged from v0.3)
  // ============================================================
  function startProximitySound() {
    init();
    resume();
    if (proximityActive) return;
    proximityActive = true;
    proximityGainNode = ctx.createGain();
    proximityGainNode.gain.value = 0;
    proximityFilter = ctx.createBiquadFilter();
    proximityFilter.type = 'bandpass';
    proximityFilter.frequency.value = 660;
    proximityFilter.Q.value = 1.5;
    proximityOsc1 = ctx.createOscillator();
    proximityOsc2 = ctx.createOscillator();
    proximityOsc1.type = 'sine';
    proximityOsc2.type = 'sine';
    proximityOsc1.frequency.value = 660;
    proximityOsc2.frequency.value = 663.3;
    proximityLFO = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    proximityLFO.type = 'sine';
    proximityLFO.frequency.value = 0.15;
    lfoGain.gain.value = 8;
    proximityLFO.connect(lfoGain);
    lfoGain.connect(proximityOsc1.frequency);
    proximityOsc1.connect(proximityFilter);
    proximityOsc2.connect(proximityFilter);
    proximityFilter.connect(proximityGainNode);
    proximityGainNode.connect(masterGain);
    proximityOsc1.start();
    proximityOsc2.start();
    proximityLFO.start();
  }

  function updateProximitySound(player, crystals) {
    if (!proximityActive || crystals.length === 0) return;
    let minDist = Infinity;
    crystals.forEach(c => {
      const dx = player.x - c.x;
      const dy = player.y - c.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < minDist) minDist = d;
    });
    const maxRange = 2;
    const minRange = 0.5;
    const vol = Math.max(0, Math.min(0.35, 0.35 * (1 - (minDist - minRange) / (maxRange - minRange))));
    proximityGainNode.gain.setTargetAtTime(vol, ctx.currentTime, 0.1);
  }

  function stopProximitySound() {
    if (!proximityActive) return;
    proximityActive = false;
    [proximityOsc1, proximityOsc2, proximityLFO].forEach(o => { try { o.stop(); } catch(e) {} });
    [proximityOsc1, proximityOsc2, proximityLFO, proximityFilter, proximityGainNode] = [null, null, null, null, null];
  }

  function setProximityTarget(player, crystals) {
    proximityTarget = player;
    proximityCrystals = crystals;
  }

  function triggerSpatialWarning(panValue) {
    init(); resume();
    _playMovingPlatformWarning(panValue);
  }

  function triggerSpikeDeath() {
    init(); resume();
    _playSpikeDeath();
  }
  function triggerSpatialTimedWarning(panValue) {
    init(); resume();
    _playTimedPlatformWarning(panValue);
  }

  // ============================================================
  // PUBLIC API
  // ============================================================
  return {
    init,
    resume,
    trigger,
    startProximitySound,
    updateProximitySound,
    stopProximitySound,
    setProximityTarget,
    triggerSpatialWarning,
    triggerSpatialTimedWarning,
    triggerSpikeDeath,
    get PROXIMITY_ACTIVE() { return proximityActive; },
    startZoneCAmbient,
    stopZoneCAmbient,
    };
})();

window.AudioEngine = AudioEngine;
