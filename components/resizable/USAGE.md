# Resizable

Use a resizable group to let a person redistribute space between adjacent panels by dragging the handle that sits between them. Nest a vertical group inside a horizontal panel to mix both axes in one layout.

## CSS

Copy `tokens.css` and `components/resizable/resizable.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Script

Copy `components/resizable/resizable.js` verbatim into an inline `<script>` block. It wires every `resizable-handle` for pointer dragging and arrow-key resizing; without it the panels render at their resting split but do not move.

## Markup

```html
<div class="resizable-group resizable-group--horizontal">
  <div class="resizable-panel">
    <div class="resizable-panel__content">Sidebar</div>
  </div>
  <div class="resizable-handle" role="separator" tabindex="0" aria-orientation="vertical" aria-label="Resize sidebar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">
    <span class="resizable-handle__grip" aria-hidden="true"></span>
  </div>
  <div class="resizable-panel">
    <div class="resizable-group resizable-group--vertical">
      <div class="resizable-panel">
        <div class="resizable-panel__content">Header</div>
      </div>
      <div class="resizable-handle" role="separator" tabindex="0" aria-orientation="horizontal" aria-label="Resize header" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">
        <span class="resizable-handle__grip" aria-hidden="true"></span>
      </div>
      <div class="resizable-panel">
        <div class="resizable-panel__content">Content</div>
      </div>
    </div>
  </div>
</div>
```

A `resizable-group` is a flex container of `resizable-panel`s separated by `resizable-handle`s. Give the outermost group a height so its panels have room; every panel then fills the space assigned to it. Each panel starts at an equal share; drag or nudge a handle to change the split, and the panels keep their ratio when the group itself is resized.

## Orientation

- `resizable-group--horizontal` — panels sit side by side; each handle is a vertical divider dragged left and right.
- `resizable-group--vertical` — panels stack; each handle is a horizontal divider dragged up and down.

Nest a group inside a panel to combine both axes. A nested group drops its own frame and fills its host panel.

## Parts

- `resizable-panel` — one region. Put content directly inside, or use `resizable-panel__content` for a centred, padded, scrollable body.
- `resizable-handle` — the always-present divider between two panels. It carries the grip and owns the drag and keyboard behaviour.
- `resizable-handle__grip` — the visible thumb that signals the handle is grabbable. Keep it as the handle's child and `aria-hidden`.

## Behaviour and accessibility

Each handle is a `role="separator"` with `tabindex="0"`, so it is reachable by keyboard: the arrow keys along its axis nudge the split. Set `aria-orientation` to `vertical` on a divider in a horizontal group and `horizontal` on one in a vertical group, give it an `aria-label` naming what it resizes, and the script keeps `aria-valuenow` in sync as a percentage. The panels never collapse past the minimum defined by `--oneds-component-resizable-panel-min-size`.

## When not to use

Do not use it for a fixed layout the reader is not meant to adjust, or as a substitute for responsive columns that should reflow on their own — use a grid or fixed regions instead.
