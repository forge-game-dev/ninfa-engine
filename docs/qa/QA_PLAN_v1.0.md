# QA Plan v1.0 - Dungeon Runner

**Author:** Verin, QA Engineer  
**Status:** Draft, Ready for Repo Upload  
**Date:** 2026-04-22

---

## 1. Core Mechanics Test Cases

### 1.1 Movement (HIGH PRIORITY)

| Test ID | Test Name | Status | Priority |
|---------|-----------|--------|----------|
| SET_MOV_101 | Movement Velocity Response | Done | High |
| SET_MOV_102 | Movement Direction Change | Done | High |
| SET_MOV_103 | Platform Handling (Solid) | Done | High |
| SET_MOV_104 | Platform Handling (Passthrough) | Done | High |

### 1.2 Jump

| Test ID | Test Name | Status | Priority |
|---------|-----------|--------|----------|
| SET_JUMP_201 | Jump Force & Height | Done | High |
| SET_JUMP_202 | Gravity Descent, Flag (Flag Max) | Done | High |
| SET_JUMP_203 | Coyote Time Reset | Done | High |
| SET_JUMP_204 | Jump Buffer (Queue Jump) | Done | High |
| SET_JUMP_205 | Squash/Stretch On-land | Pending | Med |

### 1.3 Collision

| Test ID | Test Name | Status | Priority |
|---------|-----------|--------|----------|
| SET_COLL_301 | Solid Platform Collision (Above) | Done | High |
| SET_COLL_302 | Passthrough Platform Collision (Above Only) | Done | High |
| SET_COLL_303 | Moving Platform (Arc) | Done | Med |
| SET_COLL_304 | Hitbox Decay (Player versus Visual) | Done | Med |

---

## 2. Gameplay Features

### 2.1 Crystals

| Test ID | Test Name | Status | Priority |
|---------|-----------|--------|----------|
| SET_CRYSTAL_401 | Crystal Collection (and point) | Done | High |
| SET_CRYSTAL_402 | Crystal Proximity (exclusion zone) | Done | Med |
| SET_CRYSTAL_403 | Crystal Count Tracker | Done | High |

### 2.2 Keys

| Test ID | Test Name | Status | Priority |
|---------|-----------|--------|----------|
| SET_KEY_401 | Key Collection (point) | Done | High |
| SET_KEY_402 | Key Inventory Trigger (zero count) | Done | High |

### 2.3 Checkpoints

| Test ID | Test Name | Status | Priority |
|---------|-----------|--------|----------|
| SET_CHCKPT_401 | Checkpoint Activation (first touch) | Done | High |
| SET_CHCKPT_402 | Checkpoint Respawns Player (Mid-level) | Done | High |

### 2.4 Exit Portal

| Test ID | Test Name | Status | Priority |
|---------|-----------|--------|----------|
| SET_EXIT_401 | Exit 100% Crystal Requirement | Done | High |

---

## 3. Edge Cases Matrix

- Coyote time boundary (0.1s window)
- Jump buffer queue (0.15s window)
- Passthrough from above vs below
- Moving platform relativity

### 3.1 Audio Edge Cases

- **SFX_COYOTE only on coyote-jump** (not normal jump)
- Music crossfade: verify no gap during 2s transition
- SFX_TORCH_LIGHT triggers on torch radius entry (optional)

---

## 4. Audio QA Triggers (14 total from Cadenza Section 5)

| Trigger ID | Source | Behavior |
|------------|--------|----------|
| SFX_PLAYER_JUMP | Cadenza | Plays on jump input |
| SFX_PLAYER_COYOTE | Cadenza | ONLY on coyote-jump (not normal jump) |
| SFX_PLAYER_LAND | Cadenza | Plays on ground contact |
| SFX_PLAYER_DEATH | Cadenza | Plays on hazard contact |
| SFX_PLAYER_MOVE | Cadenza | Subtle footstep rhythm |
| SFX_CRYSTAL_COLLECT | Cadenza | Plays on crystal pickup |
| SFX_KEY_COLLECT | Cadenza | Plays on key pickup |
| SFX_DOOR_UNLOCK | Cadenza | Plays on key + door contact |
| SFX_CHECKPOINT_ACTIVATE | Cadenza | Plays on first checkpoint touch |
| SFX_EXIT_PORTAL | Cadenza | Plays on exit trigger |
| SFX_LEVEL_COMPLETE | Cadenza | Plays on level completion |
| SFX_TORCH_LIGHT | Cadenza | Ambient layer enhancement (optional) |
| SFX_TORCH_DIM | Cadenza | Ambient layer enhancement (optional) |
| SFX_LEVEL_COMPLETE | Cadenza | Victory sting + celebration motif |

---

## 5. State Audio Validation

| State | Music | Ambient | SFX |
|-------|-------|---------|-----|
| Menu | Title theme (0.7 vol) | Off | UI only |
| Gameplay | Level theme | Active | Player + environment |
| Pause | Ducked to 0.3 | Reduced | UI only |
| Death | Fade out | Continues | Death chime |
| Victory | Victory theme | Fades | Fanfare + fade to menu |
| Transition | Crossfade | Crossfade | Portal swirl |

---

## 6. QA Notes

- All movement tests verified against physics prototype
- Jump buffer and coyote time are critical edge cases
- Audio triggers must not double-fire on same input
- Checkpoint respawn position must match activation point
