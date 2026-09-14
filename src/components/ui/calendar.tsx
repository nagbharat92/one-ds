import * as React from "react"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "@/components/ui/icons"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar rounded-(--calendar-surface-radius) bg-(--calendar-surface) bg-clip-padding p-(--calendar-padding) shadow-(--calendar-shadow) ring-1 ring-(--calendar-outline) [--cell-radius:var(--calendar-cell-radius)] [--cell-size:var(--calendar-cell-size)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:rounded-none in-data-[slot=popover-content]:bg-transparent in-data-[slot=popover-content]:shadow-none in-data-[slot=popover-content]:ring-0",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-(--calendar-gap) md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-(--calendar-gap)", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-(--space-2xs)",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) rounded-(--cell-radius) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) rounded-(--cell-radius) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-(--space-xs) text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          // The visible pill is this box; the native select sits on top and drives its hover/press/focus feedback.
          "relative flex h-(--cell-size) cursor-pointer items-center rounded-(--cell-radius) px-(--button-padding-default) transition-colors hover:bg-(--state-layer-hover) active:bg-(--state-layer-pressed) focus-within:ring-3 focus-within:ring-ring",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 cursor-pointer opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "pointer-events-none font-medium select-none",
          captionLayout === "label"
            ? "text-sm"
            : "flex items-center gap-(--space-2xs) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
          defaultClassNames.caption_label
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex h-(--cell-size) flex-1 items-center justify-center rounded-(--cell-radius) text-sm font-medium text-muted-foreground select-none",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] text-muted-foreground select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative flex aspect-(--aspect-ratio-square) h-full w-full items-center justify-center rounded-(--cell-radius) p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-(--calendar-selected-radius)",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--calendar-selected-radius)"
            : "[&:first-child[data-selected=true]_button]:rounded-l-(--calendar-selected-radius)",
          // A single-day range carries both start and end markers; its connector overlays would otherwise overlap into a square.
          String.raw`[&.rdp-range\_start.rdp-range\_end]:after:hidden`,
          defaultClassNames.day
        ),
        range_start: cn(
          // Connector hidden by default; a same-row rule below reveals it only when there is a range day to bridge toward.
          "relative isolate z-10 rounded-l-(--cell-radius) after:absolute after:inset-y-0 after:right-0 after:z-0 after:hidden after:w-1/2 after:bg-(--calendar-range-fill)",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn(
          "relative isolate z-10 rounded-r-(--cell-radius) after:absolute after:inset-y-0 after:left-0 after:z-0 after:hidden after:w-1/2 after:bg-(--calendar-range-fill)",
          defaultClassNames.range_end
        ),
        today: cn(
          "rounded-(--cell-radius) text-foreground data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} size={16} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon className={cn("size-4", className)} {...props} size={16} />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} size={16} />
          )
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      tooltip={false}
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex aspect-(--aspect-ratio-square) size-auto w-full min-w-(--cell-size) flex-col gap-(--space-2xs) rounded-(--cell-radius) border-0 leading-none font-medium text-foreground transition-[background-color,color,box-shadow,scale] duration-(--speed-swift) ease-(--ease-settle) hover:bg-(--state-layer-hover) active:translate-y-0 active:scale-100 active:bg-(--state-layer-pressed) data-[range-end=true]:scale-(--calendar-selected-scale) data-[range-end=true]:rounded-(--calendar-selected-radius) data-[range-end=true]:rounded-r-(--calendar-selected-radius) data-[range-end=true]:bg-(--calendar-selected-fill) data-[range-end=true]:text-(--calendar-selected-ink) data-[range-end=true]:shadow-none! data-[range-end=true]:ring-0! data-[range-end=true]:hover:bg-(--calendar-selected-hover-fill) data-[range-end=true]:active:bg-(--calendar-selected-pressed-fill) data-[range-end=true]:border-(length:--calendar-selected-stroke-width) data-[range-end=true]:border-(--calendar-selected-stroke-color) data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-(--calendar-range-fill) data-[range-middle=true]:text-(--calendar-range-ink) data-[range-middle=true]:shadow-none data-[range-middle=true]:hover:bg-(--calendar-range-fill) data-[range-middle=true]:active:bg-(--calendar-range-fill) data-[range-start=true]:scale-(--calendar-selected-scale) data-[range-start=true]:rounded-(--calendar-selected-radius) data-[range-start=true]:rounded-l-(--calendar-selected-radius) data-[range-start=true]:bg-(--calendar-selected-fill) data-[range-start=true]:text-(--calendar-selected-ink) data-[range-start=true]:shadow-none! data-[range-start=true]:ring-0! data-[range-start=true]:hover:bg-(--calendar-selected-hover-fill) data-[range-start=true]:active:bg-(--calendar-selected-pressed-fill) data-[range-start=true]:border-(length:--calendar-selected-stroke-width) data-[range-start=true]:border-(--calendar-selected-stroke-color) data-[selected-single=true]:scale-(--calendar-selected-scale) data-[selected-single=true]:rounded-(--calendar-selected-radius) data-[selected-single=true]:bg-(--calendar-selected-fill) data-[selected-single=true]:text-(--calendar-selected-ink) data-[selected-single=true]:shadow-none! data-[selected-single=true]:ring-0! data-[selected-single=true]:hover:bg-(--calendar-selected-hover-fill) data-[selected-single=true]:active:bg-(--calendar-selected-pressed-fill) data-[selected-single=true]:border-(length:--calendar-selected-stroke-width) data-[selected-single=true]:border-(--calendar-selected-stroke-color) dark:hover:text-foreground [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
