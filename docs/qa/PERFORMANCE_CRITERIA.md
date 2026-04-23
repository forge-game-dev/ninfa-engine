# Performance Criteria — Dungeon Runner
# QA Document v1.0 | Verin (QA) | 2026-04-23
# Target: PC primary, Mobile secondary

---

## Platform Targets

| Platform | Target FPS | Min FPS | Notes |
|----------|-----------|---------|-------|
| PC (desktop browser) | 60 fps | 50 fps | Target for all QA passes |
| Mobile (iOS Safari, Android Chrome) | 30 fps | 25 fps | Hard floor — below this = unplayable |

Performance testing applies at prototype and full-build stages. Each level must be tested independently at max crystal count for worst-case load.

---

## Frame Budget (PC @ 60fps)

- Target frame time: **16.67ms** (1000ms / 60)
- Max frame time before "slowdown": **20ms** (triggers warning log)
- Failure threshold: **>33ms sustained** (~30fps, below min spec)
- Budget allocation per system:
  - Physics (movement, collision, gravity): ~4ms
  - Rendering (canvas draw calls): ~8ms
  - Audio (SFX synthesis, music stream): ~2ms
  - Lighting (torch + player aura): ~1ms
  - UI/HUD: ~1ms
  - **Headroom**: ~0.67ms

---

## Performance Test Cases

### PC Performance Tests

**Test PC-1: Level 1 — Base Frame Rate**
- Pre: Prototype at Level 1 start, 60fps display enabled
- Action: Play for 60 seconds, observe frame counter
- Expected: Sustained 58–60fps, no drops below 55fps during normal play
- Notes: Baseline — Level 1 has no hazards, minimal entities

**Test PC-2: Level 1 — Crystal Collection Stress**
- Pre: Collect all 5 crystals rapidly in <10s
- Action: Rapid collection, observe frame rate during simultaneous particle + audio + HUD update
- Expected: Frame rate maintained, no stutter on crystal collect
- Notes: Tests worst-case simultaneous SFX + visual + state update

**Test PC-3: Level 2 — Moving Platforms + Max Entities**
- Pre: Level 2 with all moving platforms active, all crystals present
- Action: Play for 120 seconds with all entities active
- Expected: 55–60fps sustained, moving platforms smooth at 2–4 u/s
- Notes: Tests moving platform + collision system under load

**Test PC-4: Level 3 — Max Audio Triggers**
- Pre: Level 3 with all 14 crystals, keys, doors, pressure plates active
- Action: Rapid gameplay through all mechanics simultaneously
- Expected: All 9 existing SFX triggers fire without frame drop
- Notes: AudioEngine synthesis must not block main thread

**Test PC-5: Level 4 — Spike Corridor + Moving Platforms**
- Pre: Zone B active with multiple moving platforms at 4 u/s, spike collision active
- Action: Navigate Zone B with all hazards active for 60s
- Expected: 50–60fps sustained, MOVING_PLATFORM_WARNING audio fires without frame drop
- Notes: Tests spatial audio + physics + collision at high entity count

### Mobile Performance Tests

**Test MB-1: Mobile Baseline (Low-End Device)**
- Pre: Mobile device at Level 1 start, 30fps cap active if implemented
- Action: Play Level 1 for 60 seconds
- Expected: Sustained 28–30fps, no drops below 25fps
- Notes: Target: iPhone 8 equivalent or low-end Android

**Test MB-2: Mobile Level 3 Stress**
- Pre: Mobile at Level 3 with all entities active
- Action: Play through Zone B (highest entity density)
- Expected: 25–30fps, audio triggers fire correctly despite lower frame rate
- Notes: Mobile audio must not cause additional frame drops

**Test MB-3: Mobile Level 4 Spike Gauntlet**
- Pre: Mobile at Level 4 Zone C with timed platform + spike corridor
- Action: Attempt precision section
- Expected: 25fps minimum maintained, no input lag beyond 1 frame
- Notes: Input-to-visual latency must remain acceptable on mobile

---

## Asset Performance Guidelines (Reference for QA Reporting)

These are thresholds QA uses when flagging performance concerns. Not hard constraints on the art/audio teams, but targets that inform bug severity.

| Asset Type | PC Budget | Mobile Budget | Severity if Exceeded |
|-----------|----------|--------------|---------------------|
| Single sprite render | <0.5ms | <1.5ms | HIGH if causes sustained drop |
| Crystal particle burst | <1ms | <3ms | HIGH if causes frame dip |
| Torch light calc | <0.5ms | <2ms | MEDIUM if spike occurs |
| SFX synthesis (all types) | <0.5ms | <2ms | HIGH if triggers dropped |
| Moving platform update | <0.3ms | <1ms | HIGH if platform stutters |
| Full level render (L1) | <8ms | N/A | HIGH if sustained over budget |
| Full level render (L4) | <12ms | <20ms | HIGH if sustained over budget |

---

## Memory Targets

| Metric | PC Target | Mobile Target |
|--------|----------|--------------|
| Max heap usage | <128MB | <64MB |
| Sprite sheet total | <10MB | <5MB |
| Audio buffer pool | <16MB | <8MB |
| Level data (all levels loaded) | <1MB | <512KB |

Memory testing: load all 5 levels sequentially, check for leak or accumulation. Suspected memory bug → flag as CRITICAL.

---

## Audio Performance

- SFX synthesis must complete within one frame (<16.67ms)
- No audio thread blocking
- Spatial audio pan updates: non-blocking parameter changes only
- Music streaming: prefetched, no gaps or stutters
- DROWN trigger: 1.8s decay must not block frame at trigger moment

**Audio Performance Test:**

**Test AUD-1: SFX Synthesis Frame Cost**
- Pre: Level 1, frame timer active
- Action: Trigger JUMP, COYOTE_JUMP, LAND, CRYSTAL_COLLECT, DEATH rapidly (<1s interval)
- Expected: Each trigger completes within 1 frame, no frame time spike >2ms above baseline
- Notes: Use frame timing log if available; spikes indicate audio thread blocking

---

## Bug Severity: Performance

| Severity | Definition | Example |
|----------|-----------|---------|
| CRITICAL | Game crashes, session ends | Memory leak causes tab crash after 5 minutes |
| HIGH | Gameplay broken, unplayable state | Frame rate <25fps sustained on PC, cannot progress |
| MEDIUM | Noticeable degradation, still playable | Occasional stutter on crystal collect, 40fps on PC |
| LOW | Minor, cosmetic | HUD updates cause momentary flicker |

**Frame Rate Bug Triage:**
1. Reproduce on PC first (primary platform)
2. Measure sustained FPS over 60s
3. Identify trigger: specific level, entity count, mechanic, or audio event
4. Report: FPS range, trigger condition, severity

---

## Build Verification Checkpoints

Performance sign-off required at:
- **Prototype v0.5+**: Level 1–2 at 60fps PC / 30fps Mobile
- **Beta build**: All levels at 60fps PC / 30fps Mobile
- **Final QA**: Full playtest at target frame rates, all mechanics active

---

## Tools for Performance QA

- Browser DevTools FPS counter (Chrome)
- `console.time / console.timeEnd` for specific operation timing
- Web Audio API timing logs (audio_engine.js internal if available)
- Mobile: Safari Web Inspector (iOS) / Chrome DevTools remote (Android)

---

## Notes

- Performance testing on mobile is secondary to PC — PC 60fps is the gate for all QA passes
- Audio performance is especially critical: synthesis must not block frame
- Spatial audio pan updates must be non-blocking parameter changes only
- Max entity count for worst-case: Level 4 Zone B (moving platforms 2–4 u/s + spike pits + 8 crystals)
