# Calendar

Presents a month of dates for choosing a single day or a range. The month and year are dropdowns, not a static caption, so any month is one interaction away.

## Anatomy

- `calendar` — the bounded surface.
- `calendar__header` — the navigation row: previous, the month and year selectors, next.
- `calendar__nav` — an icon-only step to the previous or next month. `calendar__nav--prev` flips the chevron.
- `calendar__caption` — holds the two selectors.
- `calendar__select` — a native `<select>` for the month and one for the year.
- `calendar__weekdays` / `calendar__weekday` — the weekday header row.
- `calendar__weeks` — the grid of day cells.
- `calendar__cell` — one grid cell. It carries the range band.
- `calendar__day` — the day button inside a cell.

## Variants

- **Single date** (default) — one day carries `calendar__day--selected`.
- **Range** — mark the run on the cells with `calendar__cell--range-start`,
  `calendar__cell--range-middle`, and `calendar__cell--range-end`. The two
  endpoints also carry `calendar__day--selected`.

## States

- `calendar__day--selected` — the chosen day. `aria-pressed="true"`.
- `calendar__day--today` — a ring on the current day. `aria-current="date"`.
- `calendar__day--outside` — a day from the neighbouring month, de-emphasised.
- `:disabled` — an unavailable day.

## Behaviour

The markup is static. Product code owns the model: rendering the visible month,
moving between months, keyboard navigation across the grid, and applying the
selection and range classes as the user picks days.

## Accessibility

- Every day button has an `aria-label` with its full date.
- The weekday header row is `aria-hidden` because each day already names itself.
- Both selectors carry an `aria-label` (`Month`, `Year`).

## When not to use

Do not use it for a date that is unambiguous as typed text, or for a value a
single free-text field captures faster.
