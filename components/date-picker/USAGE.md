# Date picker

Binds a single calendar date to a field. Type the date in the text box for a value you already know, or open the popover and pick it from the calendar for one you need to find. The date picker is the field; the [calendar](../calendar/USAGE.md) is the surface it opens.

## CSS

Copy `tokens.css`, `components/calendar/calendar.css`, and `components/date-picker/date-picker.css` verbatim into the output HTML's inline `<style>` block. The date picker composes the calendar, so both stylesheets are required. Do not reference either file with a stylesheet link or CSS import.

## Markup

```html
<div class="date-picker">
  <div class="date-picker__field">
    <input class="date-picker__input" type="text" value="June 12, 2025" placeholder="Select a date" aria-label="Date">
    <details class="date-picker__popover">
      <summary class="date-picker__toggle" aria-label="Open calendar"><svg aria-hidden="true"><use href="fluent-icons.svg#calendar-ltr-16-regular"></use></svg></summary>
      <div class="date-picker__panel">
        <!-- a full calendar — see the Calendar component -->
        <div class="calendar">…</div>
      </div>
    </details>
  </div>
</div>
```

The popover is a native `<details>`/`<summary>`, so the calendar opens and closes with no script. The typeable `<input>` sits outside the `<summary>`, so clicking to edit the text never toggles the popover.

## Anatomy

- `date-picker` — the positioning context for the popover.
- `date-picker__field` — the bordered field row. It carries hover, the shared focus ring, and the invalid and disabled treatments.
- `date-picker__input` — the text box. The value is a formatted date; the placeholder prompts when empty.
- `date-picker__popover` — the `<details>` that owns the open state.
- `date-picker__toggle` — the `<summary>` calendar button that opens the popover.
- `date-picker__panel` — the floating layer that holds the calendar. `date-picker__panel--static` renders it in flow instead, for an always-open inline picker or documentation.

## States

- **Default** — a value in the input, popover closed.
- **Empty** — no value; the input shows its placeholder.
- **Invalid** — add `date-picker--invalid` when the typed text is not a valid date; also set `aria-invalid="true"` on the input.
- **Disabled** — add `date-picker--disabled`, set `disabled` on the input, and the toggle stops opening.

## Behaviour to wire in production

The static markup demonstrates structure and every visual state. A production date picker still needs script to: parse the typed text into a date and format a chosen date back into the input, mark the selected day and today in the calendar, move the visible month, close the popover on selection and on outside click, and reflect the value with `aria-invalid` when parsing fails. The calendar itself owns its own keyboard grid and selection classes.

## Accessibility

- The input carries an `aria-label` (or an associated `<label>`) naming the field.
- The toggle has an `aria-label` because it is icon-only.
- Focus stays visible on the field while the calendar is open, so the active field is always clear.

## When not to use

Do not use it for a date that is unambiguous as typed text and needs no calendar, where a plain [input](../input/USAGE.md) is faster. Do not use it for a duration or range — pick the two ends in a [calendar](../calendar/USAGE.md) instead.
