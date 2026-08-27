# Alert dialog

Use an alert dialog to interrupt the current workflow with an important decision that requires an explicit response.

## CSS

Copy `tokens.css`, `components/dialog/dialog.css`, `components/alert-dialog/alert-dialog.css`, and `components/button/button.css` verbatim into the output HTML's inline `<style>` block. Copy `components/alert-dialog/alert-dialog.js` into an inline `<script>` block. Do not reference these files with stylesheet links, script tags, or CSS imports.

## Markup

```html
<button class="button button--outline" type="button" data-alert-dialog-trigger="delete-project-dialog">Delete project</button>
<dialog class="dialog alert-dialog" id="delete-project-dialog" role="alertdialog" aria-labelledby="delete-project-title" aria-describedby="delete-project-description">
  <form method="dialog">
    <div class="alert-dialog__header">
      <h2 class="alert-dialog__title" id="delete-project-title">Delete this project?</h2>
      <p class="alert-dialog__description" id="delete-project-description">This action cannot be undone.</p>
    </div>
    <div class="alert-dialog__footer">
      <button class="button button--outline" type="submit" value="cancel" autofocus>Cancel</button>
      <button class="button button--danger" type="submit" value="confirm">Delete project</button>
    </div>
  </form>
</dialog>
```

The component script pairs each `data-alert-dialog-trigger` value with the matching dialog `id` and calls `showModal()`.

## Anatomy

- Trigger — the button that calls `showModal()`.
- `dialog alert-dialog` — the native modal content and backdrop.
- `alert-dialog__header` — the title and description.
- `alert-dialog__title` — the decision stated as a concise question.
- `alert-dialog__description` — the consequence or context needed to decide.
- `alert-dialog__footer` — a neutral action band with Cancel first and the action second.

## Variants

- **Basic** — a title, a description, and Cancel and a confirming action.
- **Destructive** — give the confirming action `button--danger` when it is irreversible.

## Behavior and accessibility

Use `role="alertdialog"` with both `aria-labelledby` and `aria-describedby`. Put `autofocus` on the safest action, normally Cancel. A native modal traps focus, makes the rest of the document inert, closes on Escape, and returns focus to the invoking control. Do not add a close icon: the decision must remain explicit through Cancel or the action.

The surface and backdrop use progressive discrete transitions for fade and scale on open and close. Unsupported browsers fall back to an instant native dialog; reduced-motion shortens the transition to the motion-reduced token.

## When not to use

Do not use it for nonblocking information, routine choices, or complex multi-step input. Use `alert`, `dialog`, or a page workflow instead.
