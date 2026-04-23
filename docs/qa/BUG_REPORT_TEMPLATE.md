# Dungeon Runner — Bug Report Template

## Bug Report Fields

**Bug ID:** (Auto-assigned by QA lead)
**Date:** YYYY-MM-DD
**Reported by:** Verin (QA)
**Severity:** [Critical / High / Medium / Low]
**Area:** [Movement / Jump / Collision / Crystals / Checkpoint / Portal / Audio / Visual / UI / Performance / Other]

---

## Required Fields

### Title
> A clear, specific one-line summary of the bug.
> Format: [Area] Brief description of expected vs actual behavior
> Example: [Jump] Coyote jump fails when walking off ledge after collecting checkpoint

### Build
> Build version or commit SHA
> Platform: [PC / Mobile / Console]
> OS/Browser version if applicable

### Steps to Reproduce
1.
2.
3.

### Expected Behavior
> What should happen according to GDD or design intent

### Actual Behavior
> What actually happens

### Severity Justification
> Why this is Critical/High/Medium/Low
> Consider: Does it block play? Does it break progression? Does it look wrong?

---

## Optional Fields

### Audio/Visual Notes
> Screenshots, video, or audio recordings if available

### Frequency
> [Always / Often / Sometimes / Rarely / One-time]

### Suggestions / Workarounds
> Any known workaround for the dev team to consider

---

## Severity Levels

| Level | Definition | Example |
|-------|-----------|---------|
| **Critical** | Game crashes, save data corrupted, or completely unplayable | Player cannot complete level due to collision bug |
| **High** | Major feature broken, no workaround, blocks progression | Exit portal does not trigger even with all crystals |
| **Medium** | Feature impaired but work-around exists or progression is possible | Jump buffer timing is slightly off |
| **Low** | Cosmetic or minor UX issue, no gameplay impact | Torch light flickers occasionally |

---

## Labels for GitHub Issues

**Always include:** `bug`
**Include as applicable:** `critical`, `high`, `medium`, `low`
**Area labels:** `area-movement`, `area-jump`, `area-collision`, `area-crystals`, `area-checkpoint`, `area-portal`, `area-audio`, `area-visual`, `area-ui`, `area-performance`
**Status labels:** `needs-triage`, `needs-reproduction`, `in-progress`, `needs-verification`, `resolved`

---

## Submission Checklist

- [ ] Title is clear and specific
- [ ] Build/version is documented
- [ ] Steps to reproduce are numbered and reproducible
- [ ] Expected vs actual behavior is clearly stated
- [ ] Severity is justified
- [ ] Labels are applied
- [ ] Evidence attached (if applicable)

---

## Important Notes

- **Never assume an issue is known.** Document it regardless of familiarity.
- **Include reproduction steps for every report.** A bug without steps is not actionable.
- **Do not escalate via @mentions during triage.** Labels route issues to the right people.
- **Close only after QA verification, wontfix, duplicate, or rejected status.**
- **Critical/High bugs blocking release: flag immediately in `#Geral` with direct link to issue.**
