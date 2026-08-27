# Toast

Use a toast for brief, non-blocking feedback about something that just happened — a save, an error, a background result. It appears at a screen edge, stacks with other toasts, and dismisses on its own or when the person closes it.

## CSS

Copy `tokens.css` and `components/toast/toast.css` verbatim into the output HTML's inline `<style>` block. Do not reference these files with stylesheet links or CSS imports.

## Markup

A `toast-viewport` pins a stack of toasts to one edge of the window. Put every toast for that edge inside a single viewport; the viewport handles the spacing, the click-through empty area, and the stacking order.

```html
<div class="toast-viewport toast-viewport--top-right">
  <div class="toast toast--success" role="status" data-toast-duration="5000">
    <svg class="toast__icon" aria-hidden="true" viewBox="0 0 16 16"><!-- status icon --></svg>
    <div class="toast__title text-trim">Changes saved</div>
    <div class="toast__description">Your document is up to date.</div>
    <button class="toast__close" type="button" aria-label="Dismiss">
      <svg aria-hidden="true" viewBox="0 0 16 16"><!-- dismiss icon --></svg>
    </button>
  </div>
</div>
```

## Types

The surface and text stay neutral so the message reads clearly; the icon carries the status colour, matching the button and alert status families.

- Default — neutral, informational. Pair with the filled info icon.
- `toast--info` — brand-coloured icon for a neutral notice you want to draw the eye to.
- `toast--success` — a completed action. Filled checkmark-circle icon.
- `toast--warning` — a caution that does not block. Filled warning icon.
- `toast--danger` — a failure or error. Filled error-circle icon.

## Placement

Add one placement modifier to the viewport. All six edges are supported; bottom edges stack upward so the newest toast sits closest to the edge.

`toast-viewport--top-left`, `toast-viewport--top-center`, `toast-viewport--top-right`, `toast-viewport--bottom-left`, `toast-viewport--bottom-center`, `toast-viewport--bottom-right`.

Use one viewport per edge. `toast-viewport--anchored` switches the region to `position: absolute` so a stack can live inside a positioned app panel instead of the window.

## Structure

- `toast__icon` — optional leading status glyph. Omit it and the message spans from the first column.
- `toast__title` — the headline. Wrap it in `text-trim` so it aligns to the icon.
- `toast__description` — optional supporting line. A toast may carry a description with no title.
- `toast__close` — the dismiss control. Give it an `aria-label`.

## Behaviour

Toasts are created and removed at runtime, so they need host script. Copy `components/toast/toast.js`, which dismisses a toast when its close button is clicked and, for any toast with `data-toast-duration="<ms>"`, removes it after that delay. The CSS owns the entrance and exit motion.

Announce each toast to assistive technology by its urgency: `role="status"` (polite) for routine feedback, `role="alert"` (assertive) for errors that need immediate attention.

## When not to use

Do not use a toast for a message that requires a response or a decision before continuing — use a dialog or alert dialog. Do not use it for persistent status that belongs in the page flow — use an inline message or alert. Do not put essential information only in a toast, since it disappears.
