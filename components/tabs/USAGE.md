# Tabs

Use tabs to switch between peer panels while preserving their shared context.

## CSS

Copy `tokens.css` and `components/tabs/tabs.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<div class="tabs" role="tablist" aria-label="Content views">
  <button class="tab" id="overview-tab" type="button" role="tab" aria-selected="true" aria-controls="overview-panel">Overview</button>
  <button class="tab" id="activity-tab" type="button" role="tab" aria-selected="false" aria-controls="activity-panel" tabindex="-1">Activity</button>
</div>
<div id="overview-panel" role="tabpanel" aria-labelledby="overview-tab">Overview content</div>
<div id="activity-panel" role="tabpanel" aria-labelledby="activity-tab" hidden>Activity content</div>
```

## Variants

The base `.tabs` is a horizontal segmented control whose tabs fill the row; a white pill slides to the active tab. Add a modifier to change it:

- `.tabs--lined` — a flat bar with a brand underline that slides beneath the active tab, for page- or section-level views.
- `.tabs--icon-only` — fixed-width square tabs that hug their content instead of filling the row. Give each tab an `aria-label`.
- `.tabs--small` — a compact, less-rounded control for tight spaces such as a sidebar.

## Icons

Place an `<svg aria-hidden="true">` before the label text inside a `.tab`. The icon is sized and spaced from the label automatically, and works with any variant.

```html
<button class="tab" type="button" role="tab" aria-selected="true">
  <svg aria-hidden="true"><use href="fluent-icons.svg#person-16-regular"></use></svg>Account
</button>
```

## Behavior

Copy `components/tabs/tabs.js` into a `<script>`. It wires click and Left/Right/Home/End keyboard selection, roving `tabindex`, and panel visibility for every `[role="tablist"]` on the page; the active pill slides automatically as `aria-selected` changes. Without it, the markup renders correctly but does not respond to input.