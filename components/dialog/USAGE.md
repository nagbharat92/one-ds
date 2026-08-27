# Dialog

Use a dialog for focused content or actions that require attention before the current workflow continues.

## CSS

Copy `tokens.css`, `components/dialog/dialog.css`, and `components/button/button.css` verbatim into the output HTML's inline `<style>` block. Copy `components/dialog/dialog.js` into an inline `<script>` block. Do not reference these files with stylesheet links, script tags, or CSS imports.

## Markup

```html
<button class="button button--outline" type="button" data-dialog-trigger="rename-dialog">Rename workspace</button>
<dialog class="dialog" id="rename-dialog" aria-labelledby="rename-dialog-title" aria-describedby="rename-dialog-description">
  <form method="dialog">
    <button class="dialog__close" type="submit" value="cancel" formnovalidate aria-label="Close dialog">
      <svg aria-hidden="true"><use href="fluent-icons.svg#dismiss-16-regular"></use></svg>
    </button>
    <div class="dialog__header">
      <h2 class="dialog__title" id="rename-dialog-title">Rename workspace</h2>
      <p class="dialog__description" id="rename-dialog-description">Give this workspace a clear, recognizable name.</p>
    </div>
    <div class="dialog__body">
      <p>Changing the name updates every link and reference across the project.</p>
    </div>
    <div class="dialog__footer">
      <button class="button button--outline" type="submit" value="cancel">Cancel</button>
      <button class="button" type="submit" value="confirm">Save changes</button>
    </div>
  </form>
</dialog>
```

The component script pairs each `data-dialog-trigger` value with the matching dialog `id` and calls `showModal()`.

## Anatomy

- Trigger — the button that calls `showModal()`.
- `dialog` — the native modal content and backdrop.
- `dialog__close` — the icon-only dismiss control in the top-right corner.
- `dialog__header` — the title and description.
- `dialog__title` — what the dialog is about.
- `dialog__description` — the context needed before acting.
- `dialog__body` — the content region. It owns the scroll when the content is tall.
- `dialog__footer` — a neutral action band, actions aligned to the end.

## Parameters

- **Sticky footer** — add `dialog--sticky-footer` to the dialog. The body scrolls and the footer stays pinned to the bottom edge with its divider. Without it, the whole form scrolls as one unit.

## Behavior and accessibility

Open the dialog with `showModal()` and keep the title and description IDs synchronized with `aria-labelledby` and `aria-describedby`. A native modal traps focus, makes the rest of the document inert, closes on Escape, and returns focus to the invoking control. The close button and each footer action submit `method="dialog"`, so they close the dialog and set its `returnValue` without extra script; give the close button `formnovalidate` so it dismisses regardless of field state.

The surface and backdrop use progressive discrete transitions for fade and scale on open and close. Unsupported browsers fall back to an instant native dialog; reduced-motion shortens the transition to the motion-reduced token.

## When not to use

Do not use it for nonblocking feedback or content that belongs in the page flow. For a blocking decision that must be answered explicitly, use `alert-dialog`. For a passive status message, use `alert` or `inline-message`.