# Snapshot Format

The `snapshot` command returns a list of all interactable elements on the current page. Each element has a reference ID used in other commands.

## Format

```
e<number> [<tag>] ["<text>"]
```

Examples:
```
e1  [button] "Start Game"
e5  [a href] "/about"
e12 [input]  type=text name=username
e18 [div]    class=card
```

## Element types

- `[a href]` — Links / anchor tags
- `[button]` — Clickable buttons
- `[input]` — Text fields, checkboxes, radio buttons, file inputs
- `[select]` — Dropdown menus
- `[div]`, `[span]`, `[p]`, etc. — Container elements (may be clickable)
- `[img]` — Images (rarely interactive)

## Attributes shown

- `type` for inputs
- `name` for form elements
- `href` for links
- `class` for styled containers
- `id` for elements with ID attributes

## How to use element IDs

Once you have an ID (e.g., `e12`), use it in commands:
```bash
playwright-cli click e12          # click it
playwright-cli hover e12          # hover over it
playwright-cli screenshot e12     # screenshot just that element
playwright-cli eval "el => el.value" e12  # read its value
```

## Important notes

- **IDs change every time the page changes.** Always run `snapshot` after navigation or clicking.
- **Invisible elements are excluded.** Only visible, interactable elements appear.
- **IDs are 1-indexed within a single snapshot**, but are not stable across page states. Never hardcode them.
- **Duplicate IDs possible across tabs.** Use `tab-select` before `snapshot` to target the right tab.
- **Form submissions**: `fill` with `--submit` fills and presses Enter. Or fill then `click` the submit button.
- **Checkbox/radio**: Use `check` or `uncheck`, or `click` the element directly.
- **Dropdown**: `select` requires the option's value attribute, not the visible text.

## Getting attributes not shown in snapshot

Use `eval`:
```bash
playwright-cli eval "el => el.getAttribute('data-testid')" e12
playwright-cli eval "el => el.id" e12
playwright-cli eval "el => el.getAttribute('aria-label')" e5
```

## Dynamic pages (SPAs)

In single-page applications where content changes without full navigation:
1. Run `snapshot` after each significant interaction
2. Look for the specific element by its text or tag
3. Use the new ID for the next command

## Nested elements

If `snapshot` shows a container but you need a child element:
```bash
playwright-cli eval "el => el.querySelector('button').id" e8
```

This evaluates JS on element `e8` and returns the ID of a button inside it.