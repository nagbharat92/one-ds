# Progress

Use progress to show how far a determinate operation has advanced toward completion.

## CSS

Copy `tokens.css` and `components/progress/progress.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with a stylesheet link or CSS import.

## Variants

- **Basic** — the track alone, for an operation whose meaning is clear from nearby context.
- **Label** — a label and percentage above the track (`.progress-field`), when the operation needs naming or the exact value matters.

## Markup

Basic:

```html
<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="60" aria-label="Uploading files">
  <div class="progress__indicator"></div>
</div>
```

Label:

```html
<div class="progress-field">
  <div class="progress-field__header">
    <span class="progress-field__label" id="upload-label">Uploading files</span>
    <span class="progress-field__value">60%</span>
  </div>
  <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="60" aria-labelledby="upload-label">
    <div class="progress__indicator"></div>
  </div>
</div>
```

## Value

The filled width is driven by the `--progress-value` custom property (a unitless number from 0 to 100) on the `.progress` element. Set it at runtime with an inline style or script, and keep `aria-valuenow` in sync. The example `.progress--value-*` classes exist only for static documentation.

Use progress only for determinate work. When completion cannot be measured, use the loading indicator instead.
