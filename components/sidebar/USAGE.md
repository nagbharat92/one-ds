# Sidebar

Use a sidebar as an application's primary navigation shell — a docked column of grouped links that collapses to an icon rail. Its class is `.app-sidebar` (an application navigation shell) so it never collides with a page's own documentation or marketing chrome.

## CSS

Copy `tokens.css` and `components/sidebar/sidebar.css` verbatim into the output HTML's inline `<style>` block. Do not reference these files with stylesheet links or CSS imports.

## Markup

The sidebar fills its parent's height, so place it in a full-height flex row (`.app-sidebar-layout`) beside the main content (`.app-sidebar-inset`). Put the toggle (`.app-sidebar__trigger`) in the main content's header, not inside the sidebar.

```html
<div class="app-sidebar-layout">
  <aside class="app-sidebar" id="app-sidebar" data-state="expanded" aria-label="Main">
    <div class="app-sidebar__header">
      <a class="app-sidebar__brand" href="#">
        <span class="app-sidebar__brand-logo">OD</span>
        <span class="app-sidebar__brand-text">
          <span class="app-sidebar__brand-name">OneDS</span>
          <span class="app-sidebar__brand-detail">Workspace</span>
        </span>
      </a>
    </div>

    <div class="app-sidebar__content">
      <div class="app-sidebar__group">
        <div class="app-sidebar__group-label" id="app-sidebar-platform">Platform</div>
        <ul class="app-sidebar__menu" aria-labelledby="app-sidebar-platform">
          <li class="app-sidebar__item">
            <a class="app-sidebar__button" href="#" aria-current="page">
              <svg class="app-sidebar__icon" viewBox="0 0 16 16" aria-hidden="true"><!-- icon --></svg>
              <span class="app-sidebar__label">Chat</span>
            </a>
          </li>
          <li class="app-sidebar__item">
            <a class="app-sidebar__button" href="#">
              <svg class="app-sidebar__icon" viewBox="0 0 16 16" aria-hidden="true"><!-- icon --></svg>
              <span class="app-sidebar__label">Inbox</span>
              <span class="app-sidebar__badge">12</span>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="app-sidebar__footer">
      <a class="app-sidebar__button" href="#">
        <svg class="app-sidebar__icon" viewBox="0 0 16 16" aria-hidden="true"><!-- icon --></svg>
        <span class="app-sidebar__label">Ada Lovelace</span>
      </a>
    </div>
  </aside>

  <div class="app-sidebar-inset">
    <button class="app-sidebar__trigger" type="button" data-sidebar-toggle="app-sidebar" aria-controls="app-sidebar" aria-expanded="true" aria-label="Toggle sidebar">
      <svg viewBox="0 0 16 16" aria-hidden="true"><!-- panel-left icon --></svg>
    </button>
    <!-- page content -->
  </div>
</div>
```

Give each `.app-sidebar__button` a leading `.app-sidebar__icon` and a `.app-sidebar__label`. Mark the current page with `aria-current="page"`. A trailing `.app-sidebar__badge` shows a count; a trailing `.app-sidebar__caret` marks a collapsible group.

## Collapse

The rail collapses when `data-state="collapsed"` is set on the `.app-sidebar`; the labels, badges, group labels, and sub-menus hide and the icons center. Copy `components/sidebar/sidebar.js` (or inline it) to wire the trigger and the `Ctrl`/`Cmd`+`B` shortcut:

```html
<script>
  document.querySelectorAll("[data-sidebar-toggle]").forEach((trigger) => {
    const sidebar = document.getElementById(trigger.dataset.sidebarToggle);
    if (!sidebar) return;
    const sync = () => trigger.setAttribute("aria-expanded", String(sidebar.dataset.state !== "collapsed"));
    const toggle = () => {
      sidebar.dataset.state = sidebar.dataset.state === "collapsed" ? "expanded" : "collapsed";
      sync();
    };
    sync();
    trigger.addEventListener("click", toggle);
    window.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
        event.preventDefault();
        toggle();
      }
    });
  });
</script>
```

## Nested groups

Wrap a menu entry in `<details class="app-sidebar__collapsible">` with a `<summary class="app-sidebar__button">` and an `.app-sidebar__sub` list of `.app-sidebar__sub-button` links. The native disclosure expands and collapses with no extra script; the `.app-sidebar__caret` rotates on `[open]`.

## Variants

- `app-sidebar--right`: pins to the inline-end edge (border moves to the inline-start side).
- `app-sidebar--floating`: a detached, rounded, elevated panel instead of a docked wall.

## Accessibility

- Label the `<aside>` with `aria-label` and each `.app-sidebar__menu` with `aria-labelledby` pointing at its group label.
- Give the trigger `aria-controls` and a synced `aria-expanded`.
- Use `.app-sidebar__button` as an `<a>` for navigation and a `<button>` only for actions.
