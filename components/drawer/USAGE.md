# Drawer

Use a drawer for secondary content or actions that slide in from a screen edge without leaving the current page — filters, details, or a focused sub-task.

## CSS

Copy `tokens.css`, `components/drawer/drawer.css`, and `components/button/button.css` verbatim into the output HTML's inline `<style>` block. Do not reference these files with stylesheet links or CSS imports.

## Markup

```html
<button class="button button--outline" type="button" data-drawer-trigger="drawer">Open drawer</button>

<dialog class="drawer drawer--right" id="drawer" aria-labelledby="drawer-title" aria-describedby="drawer-description">
  <form method="dialog">
    <header class="drawer__header">
      <div class="drawer__heading">
        <h2 class="drawer__title" id="drawer-title">Panel title</h2>
        <p class="drawer__description" id="drawer-description">Supporting context for the panel.</p>
      </div>
      <button class="button button--icon button--quiet drawer__close" type="submit" value="close" aria-label="Close">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.58859 2.71569L2.64645 2.64645C2.82001 2.47288 3.08944 2.4536 3.28431 2.58859L3.35355 2.64645L8 7.293L12.6464 2.64645C12.8417 2.45118 13.1583 2.45118 13.3536 2.64645C13.5488 2.84171 13.5488 3.15829 13.3536 3.35355L8.707 8L13.3536 12.6464C13.5271 12.82 13.5464 13.0894 13.4114 13.2843L13.3536 13.3536C13.18 13.5271 12.9106 13.5464 12.7157 13.4114L12.6464 13.3536L8 8.707L3.35355 13.3536C3.15829 13.5488 2.84171 13.5488 2.64645 13.3536C2.45118 13.1583 2.45118 12.8417 2.64645 12.6464L7.293 8L2.64645 3.35355C2.47288 3.17999 2.4536 2.91056 2.58859 2.71569L2.64645 2.64645L2.58859 2.71569Z" fill="currentColor"/></svg>
      </button>
    </header>
    <div class="drawer__body">
      <p>Drawer content goes here.</p>
    </div>
    <footer class="drawer__footer">
      <button class="button button--outline" type="submit" value="cancel">Cancel</button>
      <button class="button" type="submit" value="confirm">Save</button>
    </footer>
  </form>
</dialog>
```

Open drawers with `showModal()` so the browser supplies the top-layer scrim, focus trap, `inert` background, `Escape` to dismiss, and return focus. The one-line script below pairs any `data-drawer-trigger="<id>"` control to its drawer:

```html
<script>
  document.querySelectorAll("[data-drawer-trigger]").forEach((trigger) => {
    const drawer = document.getElementById(trigger.dataset.drawerTrigger);
    if (drawer instanceof HTMLDialogElement) trigger.addEventListener("click", () => drawer.showModal());
  });
</script>
```

Buttons inside `<form method="dialog">` close the drawer on submit, so the close and footer buttons need no script. Keep the title and description IDs synchronized with their ARIA references.

## Variants

- `drawer--right` (default): slides in from the inline-end edge.
- `drawer--left`: slides in from the inline-start edge.

## Nested drawers

Put a `data-drawer-trigger` button (with `type="button"` so it does not submit the parent form) inside a drawer's body to open a second drawer. The browser stacks it on the top layer above the parent, with its own scrim; `Escape` closes the topmost drawer first. Give the nested drawer a `Back` button (`type="submit"` in its own `method="dialog"` form) to return to the parent.
