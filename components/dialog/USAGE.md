# Dialog

Use a dialog for focused content or actions that require a response before the current workflow continues.

## CSS

Copy `tokens.css`, `components/dialog/dialog.css`, and `components/button/button.css` verbatim into the output HTML's inline `<style>` block. Do not reference these files with stylesheet links or CSS imports.

## Markup

```html
<dialog class="dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description">
  <form method="dialog">
    <div class="dialog__body">
      <div>
        <h2 class="dialog__title" id="dialog-title">Remove item?</h2>
        <p class="dialog__description" id="dialog-description">This action cannot be undone.</p>
      </div>
    </div>
    <div class="dialog__actions">
      <button class="button button--quiet" type="submit" value="cancel">Cancel</button>
      <button class="button button--danger" type="submit" value="confirm">Remove</button>
    </div>
  </form>
</dialog>
```

Open modal dialogs with `showModal()`. Keep the title and description IDs synchronized with their ARIA references. Return focus to the invoking control after the dialog closes.

## Variants

Use `dialog__icon dialog__icon--danger` for an optional destructive-status icon.