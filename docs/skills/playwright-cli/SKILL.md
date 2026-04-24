---
name: playwright-cli
description: Automate browser interactions, test web pages, and run Playwright CLI commands. Use when you need to open a browser, navigate to a URL, interact with elements, take screenshots, manage tabs, handle storage/cookies, or run playwright-cli subcommands.
---

# Playwright CLI

Browser automation via `playwright-cli` (npm package `@playwright/cli`).

## When to use

- Open a browser and interact with a web page
- Navigate, click, type, hover, drag, select, check/uncheck
- Take screenshots or save PDFs
- Manage browser tabs
- Handle dialogs (alert, confirm, prompt)
- Save/load session state, cookies, localStorage
- Run any `playwright-cli` subcommand for browser automation

## Requirements

- Node.js 18+
- `playwright-cli` installed globally: `npm install -g @playwright/cli@latest`

## Installation

```bash
npm install -g @playwright/cli@latest
playwright-cli --help
```

## Core workflow

```bash
# Open browser and navigate
playwright-cli open https://example.com/
# or
playwright-cli goto https://example.com/

# Get element reference (run after any interaction that changes the page)
playwright-cli snapshot
# Use the element ID (e.g., e15) from the snapshot output

# Interact
playwright-cli click e15
playwright-cli type "search query"
playwright-cli press Enter
playwright-cli hover e4

# Screenshot
playwright-cli screenshot
playwright-cli screenshot --filename=screenshot.png

# Close
playwright-cli close
```

## Available commands

### Navigation
| Command | Description |
|---|---|
| `open` | Open new browser |
| `open <url>` | Open browser and navigate to URL |
| `goto <url>` | Navigate to URL in current browser |
| `reload` | Reload current page |
| `go-back` | Navigate back |
| `go-forward` | Navigate forward |

### Interactions
| Command | Description |
|---|---|
| `click <id>` | Left-click element |
| `dblclick <id>` | Double-click element |
| `hover <id>` | Hover over element |
| `drag <from> <to>` | Drag element to target |
| `type "<text>"` | Type text into focused element |
| `fill <id> "<text>"` --submit | Fill and submit |
| `select <id> "<value>"` | Select dropdown option |
| `check <id>` | Check checkbox |
| `uncheck <id>` | Uncheck checkbox |
| `upload <file>` | Upload file |
| `press <key>` | Press keyboard key |
| `keydown <key>` | Hold key down |
| `keyup <key>` | Release key |
| `mousemove <x> <y>` | Move mouse |
| `mousedown` | Press mouse button |
| `mousedown right` | Right-click |
| `mouseup` | Release mouse button |
| `mousewheel <dx> <dy>` | Scroll |

### State
| Command | Description |
|---|---|
| `snapshot` | Get current page element IDs |
| `eval "<js>"` | Execute JS, return result |
| `eval "<js>" <id>` | Evaluate JS on element |
| `resize <w> <h>` | Resize browser viewport |

### Save/Export
| Command | Description |
|---|---|
| `screenshot` | Full-page screenshot |
| `screenshot <id>` | Screenshot of specific element |
| `screenshot --filename=<name>` | Save screenshot to file |
| `pdf --filename=<name>` | Save page as PDF |

### Tabs
| Command | Description |
|---|---|
| `tab-list` | List open tabs |
| `tab-new` | Open new tab |
| `tab-new <url>` | Open URL in new tab |
| `tab-close` | Close current tab |
| `tab-close <n>` | Close tab by number |
| `tab-select <n>` | Switch to tab by number |

### Storage & Cookies
| Command | Description |
|---|---|
| `state-save` | Save session to `state.json` |
| `state-save <file>` | Save session to custom file |
| `state-load` | Load session from `state.json` |
| `state-load <file>` | Load session from custom file |
| `cookie-list` | List all cookies |
| `cookie-get <name>` | Get cookie value |
| `cookie-set <name> <value>` | Set cookie |
| `cookie-delete <name>` | Delete cookie |

### Dialogs
| Command | Description |
|---|---|
| `dialog-accept` | Accept dialog |
| `dialog-accept "<text>"` | Accept with text |
| `dialog-dismiss` | Dismiss dialog |

## References

- `references/commands.md` — Full command reference with all flags
- `references/snapshot-format.md` — Understanding snapshot element IDs
- `references/troubleshooting.md` — Common issues and fixes