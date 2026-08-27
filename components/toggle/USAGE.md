# Toggle

A two-state button that holds a pressed state to show it is on. Use it for a single option that stays visibly on or off in place, such as a formatting control in an editor toolbar.

## Anatomy

- `.toggle` — a `<label>` that is the visible control.
- `.toggle__input` — a native `<input type="checkbox">` that carries the on/off state. `checked` is on. It overlays the label and stays invisible, so the control toggles and persists with no script.
- An icon (`<svg>`), a text label, or both. Wrap a text label in a `text-trim` span when it sits beside an icon so the two share a centre.

An icon-only toggle takes its name from `aria-label` on the input; a toggle with text is named by that text.

## Variants

- **Basic** (default) — transparent at rest, fills with a neutral surface when on.
- **Outline** (`.toggle--outline`) — a bordered resting state; the on state still fills.

## Size

Built at one size, the large control (44px). Add a size only when a denser context needs one.

## Content

- **Icon only** — the icon plus an `aria-label` on the input.
- **With text** — an icon and a label, or a label alone.

## States

- **On / off** — the checkbox `checked` state. Clicking or pressing Space toggles it; the state holds with no script.
- **Disabled** — the native `disabled` attribute on the input dims the control and drops the pointer.

## When not to use

- To switch a setting that applies immediately, use `switch`.
- To trigger an action rather than hold a state, use `button`.
- For a mutually exclusive set where one choice is always active, use `tabs` or a radio group.

## Accessibility

The control is a native checkbox, so it is focusable, toggles with Space, and announces its checked state. Give an icon-only toggle an `aria-label` on the input.
