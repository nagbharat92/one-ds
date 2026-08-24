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

Host JavaScript must synchronize `aria-selected`, roving `tabindex`, and panel visibility. Support Left Arrow, Right Arrow, Home, and End navigation, and move focus when selection changes.