# Troubleshooting

## Common Issues

### Browser not responding

**Symptom:** Commands time out or hang.

**Fix:**
```bash
playwright-cli close
playwright-cli open
```

---

### Element ID not found

**Symptom:** `click: element not found` or wrong element.

**Cause:** Page changed since last `snapshot`.

**Fix:**
```bash
playwright-cli snapshot
# Re-read element IDs from new output
```

---

### `type` types into wrong field

**Cause:** Focus is on the wrong element.

**Fix:** Always `snapshot` first, then `click` the correct input to focus it before `type`:
```bash
playwright-cli snapshot
playwright-cli click e15
playwright-cli type "search query"
```

---

### `select` doesn't find the option

**Cause:** `select` requires the option's `value` attribute, not the visible text.

**Fix:** Inspect the select element to find the value:
```bash
playwright-cli eval "el => el.options[0].value" e22
playwright-cli select e22 "<value>"
```

Or use `click` on the specific option:
```bash
playwright-cli eval "el => el.querySelector('option[value=\"myval\"]').id" e22
```

---

### Screenshot is blank or all white

**Cause:** Page still loading when screenshot was taken.

**Fix:** Wait before taking screenshot:
```bash
playwright-cli open https://example.com
# Wait 2 seconds
playwright-cli screenshot --filename=page.png
```

---

### `state-save` / `state-load` not persisting

**Cause:** State files are local to the working directory. Wrong path used.

**Fix:** Use the same working directory for save and load. Use absolute paths:
```bash
playwright-cli state-save /tmp/session.json
playwright-cli state-load /tmp/session.json
```

---

### `dialog-accept` doesn't work

**Cause:** Dialog commands must be issued before the dialog appears.

**Fix:** Chain commands so dialog-accept comes before or immediately with the click:
```bash
# NOT: click e12 then dialog-accept
# INSTEAD: interact and immediately handle
playwright-cli click e12
playwright-cli dialog-accept
```

---

### `eval` returns `undefined`

**Cause:** The expression is not returning a value, or the element reference is wrong.

**Fix:** Wrap the return explicitly:
```bash
playwright-cli eval "() => document.title"
playwright-cli eval "el => el.value || 'no value'" e15
```

---

### Tab commands affect wrong tab

**Cause:** Not switching to the correct tab before running other commands.

**Fix:** Always list tabs and switch first:
```bash
playwright-cli tab-list
playwright-cli tab-select 1
playwright-cli snapshot
```

---

### `upload` fails

**Cause:** Path doesn't exist or is not absolute.

**Fix:** Use absolute paths:
```bash
playwright-cli upload /root/file.pdf
```

---

### `playwright-cli` not found after install

**Cause:** npm global bin not in PATH.

**Fix:**
```bash
npm install -g @playwright/cli@latest
# Or find the binary
node /path/to/npm/global/bin/playwright-cli
```

---

### `--filename` flag not working

**Cause:** Wrong flag syntax.

**Fix:** Use `=` without spaces:
```bash
playwright-cli screenshot --filename=screenshot.png
# NOT: --filename screenshot.png
```

---

## Debug Tips

- **Use `snapshot` often** — it's your primary way to know what elements exist and their IDs
- **Use `eval`** to inspect any DOM property: `eval "() => document.title"`
- **Use `resize`** to test responsive layouts: `resize 1920 1080`
- **Use `eval`** to check for console errors: `eval "() => window.__errors || []"`
- **Save state** before auth flows to quickly restore session: `state-save session.json`

---

## Exit codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Command failed / element not found |
| 2 | Browser not open |
| 127 | Command not found — install needed |