# DUNGEON RUNNER — Production Plan
**Version:** 1.0 | **Owner:** Orion (Producer) | **Date:** 2026-04-23

---

## 1. OVERVIEW

Dungeon Runner is a family-friendly 2D platformer with puzzle elements, built in five levels. This production plan outlines deliverables, timelines, and team responsibilities across four development phases.

**Team Communication Cadence:**
- Daily standups via chat
- Weekly async reviews
- Ad-hoc coordination via Geral group

---

## 2. PHASE 1: FOUNDATION (Days 1-5)

**Goal:** Establish design direction, documentation, and technical foundations.

| Deliverable | Owner | Status |
|-------------|-------|--------|
| GDD v1.0 | Vesper | Complete |
| Style Guide | Kairo + Cedar | Complete |
| Asset Specs | Kairo | Complete |
| Audio Identity | Cadenza | Complete |
| QA Plan | Verin | Complete |
| Tech Architecture | Zephyr | Complete |
| Physics Prototype | Zephyr | Complete |
| Level 1 Tilesets | Cedar | Complete |

**Phase 1 Close Criteria:**
- All design documents in repo
- Physics prototype functional
- Team aligned on visual direction (Orb Creature confirmed)

---

## 3. PHASE 2: VERTICAL SLICE (Days 6-15)

**Goal:** Level 1 "Awakening" playable prototype with core mechanics.

### Week 1 (Days 6-9)
- Player character animation (basic states)
- Level 1 environment art integration
- Audio SFX integration (core triggers)
- Movement mechanics final tuning

### Week 2 (Days 10-15)
- Full Level 1 playthrough test
- Audio integration (music layer)
- First QA pass
- Bug fixes and polish

### Vertical Slice Deliverables
| Item | Owner | Target |
|------|-------|--------|
| Player animation (6 states) | Kairo | Day 10 |
| Level 1 tileset PNGs | Cedar | Day 8 |
| Physics prototype integration | Zephyr | Day 9 |
| Core SFX (Jump, Land, Collect, Death) | Cadenza | Day 10 |
| Audio trigger integration | Zephyr | Day 12 |
| Level 1 music (Awakening) | Cadenza | Day 14 |
| QA test pass | Verin | Day 15 |

---

## 4. PHASE 3: ALPHA (Days 16-25)

**Goal:** All 5 levels playable with full asset integration.

| Level | Name | Crystals | Target Completion |
|-------|------|----------|-----------------|
| 1 | Awakening | 5 | Day 16 |
| 2 | Descent | 8 | Day 18 |
| 3 | Convergence | 10 | Day 20 |
| 4 | Ascension | 12 | Day 22 |
| 5 | Sanctum | 15 | Day 24 |

**Alpha Milestones:**
- All levels playable Day 20
- Full art integration Day 22
- Music integration Day 23
- QA cycles Day 24-25

---

## 5. PHASE 4: BETA + RELEASE (Days 26-35)

**Goal:** Polish, bug fixes, optimization, release preparation.

| Item | Target |
|------|--------|
| Bug fixes | Day 28 |
| Performance optimization | Day 30 |
| Platform testing (PC) | Day 32 |
| Mobile port (if planned) | Day 33 |
| Final QA | Day 34 |
| Release | Day 35 |

---

## 6. TEAM ROLES & RESPONSIBILITIES

| Team Member | Role | Phase 2 Responsibilities |
|-------------|------|--------------------------|
| Orion | Producer | Timeline tracking, coordination, risk management |
| Vesper | Game Designer | Design support, GDD updates, playtesting feedback |
| Kairo | Artist | Character animation, UI assets |
| Cedar | Artist | Environment art, tilesets, props |
| Zephyr | Tech | Engine integration, audio hooks, prototype |
| Verin | QA | Test planning, bug reporting, audio testing |
| Cadenza | Audio Designer | SFX production, music, audio implementation |

---

## 7. COMMUNICATION CADENCE

- **Daily:** Async chat updates in Geral
- **Weekly:** Team review of deliverables
- **Milestones:** Formal review at end of each phase
- **Escalation:** Direct DM to Orion for blockers

---

## 8. RISK REGISTER

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Engine decision delay | Medium | High | Unity 2D selected as default; Godot as backup |
| Asset scope creep | Medium | Medium | Lock frame counts, enforce style guide |
| Audio integration complexity | Low | High | Early coordination with Zephyr on trigger IDs |
| QA coverage gaps | Low | Medium | Verin reviewing GDD audio spec from Day 1 |

---

*Production Plan v1.0 — Active. Subject to revision based on Vertical Slice outcomes.*
