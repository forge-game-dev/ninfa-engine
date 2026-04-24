# Playwright CLI — Full Command Reference

## Syntax

All commands follow: `playwright-cli <command> [args] [--flags]`

---

## Navigation

| Command | Description |
|---|---|
| `open` | Open browser (no URL) |
| `open <url>` | Open browser and navigate |
| `goto <url>` | Navigate in current browser |
| `reload` | Reload current page |
| `go-back` | Browser back |
| `go-forward` | Browser forward |

---

## Interaction

| Command | Description |
|---|---|
| `click <id>` | Left click element |
| `dblclick <id>` | Double click |
| `hover <id>` | Mouse hover |
| `drag <from_id> <to_id>` | Drag element |
| `type "<text>"` | Type into focused input |
| `fill <id> "<text>"` [--submit] | Fill input; `--submit` presses Enter |
| `select <id> "<value>"` | Select option |
| `check <id>` | Check checkbox |
| `uncheck <id>` | Uncheck checkbox |
| `upload <file_path>` | File upload |
| `press <key>` | Keyboard key (Enter, Tab, Escape, etc.) |
| `keydown <key>` | Hold key |
| `keyup <key>` | Release key |
| `mousemove <x> <y>` | Move mouse |
| `mousedown` | Mouse button down |
| `mousedown right` | Right-click |
| `mouseup` | Mouse button up |
| `mousewheel <dx> <dy>` | Scroll |

### Common keys for `press`
`Enter`, `Tab`, `Escape`, `Backspace`, `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Shift`, `Control`, `Alt`, `Meta`

---

## State & Snapshot

| Command | Description |
|---|---|
| `snapshot` | Get current page element IDs |
| `eval "<js>"` | Run JS, print result |
| `eval "<js>" <id>` | Run JS on element |
| `resize <width> <height>` | Resize viewport |

### Snapshot format

Snapshot output shows element IDs in format `e<number>`:
```
e12 [button] "Submit"
e15 [input]  type=text name=q
e22 [a href] "Sign in"
```

Use the ID to reference elements in other commands. IDs change when the page changes — always run `snapshot` after navigation or interaction.

---

## Save / Export

| Command | Description |
|---|---|
| `screenshot` | Full-page screenshot |
| `screenshot <id>` | Screenshot specific element |
| `screenshot --filename=<name>` | Save to file |
| `screenshot --full-page` | Full page (default) |
| `screenshot --viewport` | Viewport only |
| `pdf --filename=<name>` | Save as PDF |
| `pdf --filename=<name> --landscape` | Landscape PDF |

---

## Tabs

| Command | Description |
|---|---|
| `tab-list` | List all tabs |
| `tab-new` | New blank tab |
| `tab-new <url>` | Open URL in new tab |
| `tab-close` | Close current tab |
| `tab-close <n>` | Close tab by number |
| `tab-select <n>` | Switch to tab |

Tab numbers are 0-indexed. Tab 0 is the first tab.

---

## Storage

| Command | Description |
|---|---|
| `state-save` | Save session to `state.json` |
| `state-save <filename>` | Custom filename |
| `state-load` | Load session from `state.json` |
| `state-load <filename>` | Load from custom file |

Saves: cookies, localStorage, sessionStorage, origin permissions.

---

## Cookies

| Command | Description |
|---|---|
| `cookie-list` | List all cookies |
| `cookie-list --domain=<domain>` | Filter by domain |
| `cookie-get <name>` | Get cookie value |
| `cookie-set <name> <value>` | Set cookie |
| `cookie-set <name> <value> --domain=<d> --httpOnly --secure --path=<p>` | Full options |
| `cookie-delete <name>` | Delete cookie |

---

## Dialogs

| Command | Description |
|---|---|
| `dialog-accept` | Accept alert/confirm |
| `dialog-accept "<text>"` | Accept with input text |
| `dialog-dismiss` | Dismiss alert/confirm |

---

## Skills

| Command | Description |
|---|---|
| `install --skills` | Install Claude/Copilot skills |
| `skills list` | List available skills |

---

## Help

| Command | Description |
|---|---|
| `--help` | Show all commands |
| `help <command>` | Help for specific command |

---

## Tips

- **Always run `snapshot` after navigation** — element IDs change per page state
- **Use `--filename` for reproducible screenshots**: `screenshot --filename=login-form.png`
- **State save** before logging in, then `state-load` to restore session
- **Resize** to test responsive layouts: `resize 1920 1080`
- **Dialog commands** must be run before dialog appears (use in sequence with click that triggers dialog)