import { useState } from "react"

import type { ComponentEntry } from "@/showcase/types"
import type { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addDays, addMonths, format, setHours, setMinutes, isSameDay } from "date-fns"

/* ------------------------------------------------------------------ */
/*  Helper components                                                  */
/* ------------------------------------------------------------------ */

function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
    />
  )
}

function RangeCalendarDemo() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 6),
  })
  return (
    <div className="grid gap-(--space-sm)">
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        resetOnSelect
        numberOfMonths={2}
        showOutsideDays={false}
      />
      <p className="text-sm text-muted-foreground">
        {range?.from
          ? range.to
            ? `${format(range.from, "LLL dd, y")} – ${format(range.to, "LLL dd, y")}`
            : format(range.from, "LLL dd, y")
          : "Pick a start date"}
      </p>
    </div>
  )
}

function MonthYearSelectorDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  return (
    <div className="grid gap-(--space-sm)">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        captionLayout="dropdown"
        startMonth={new Date(2020, 0)}
        endMonth={addMonths(new Date(), 12)}
      />
      <p className="text-sm text-muted-foreground">
        {date ? format(date, "PPP") : "Pick a date"}
      </p>
    </div>
  )
}

const PRESETS: { label: string; value: () => Date }[] = [
  { label: "Today", value: () => new Date() },
  { label: "Tomorrow", value: () => addDays(new Date(), 1) },
  { label: "In 3 days", value: () => addDays(new Date(), 3) },
  { label: "In a week", value: () => addDays(new Date(), 7) },
  { label: "In a month", value: () => addMonths(new Date(), 1) },
]

function PresetsDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  return (
    <div className="flex flex-col gap-(--space-sm) sm:flex-row">
      <div className="flex flex-col gap-(--space-2xs)">
        {PRESETS.map((p) => (
          <Button
            key={p.label}
            variant="tertiary"
            selected={Boolean(date && isSameDay(date, p.value()))}
            size="default"
            className="justify-start"
            onClick={() => setDate(p.value())}
          >
            {p.label}
          </Button>
        ))}
      </div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
      />
    </div>
  )
}

function DateTimePickerDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState(() => {
    const now = new Date()
    return {
      hour: String(now.getHours() % 12 || 12).padStart(2, "0"),
      minute: String(now.getMinutes()).padStart(2, "0"),
      period: now.getHours() < 12 ? "am" : "pm",
    }
  })

  function handleDateSelect(d: Date | undefined) {
    if (!d) { setDate(undefined); return }
    const hour = Number(time.hour) % 12 + (time.period === "pm" ? 12 : 0)
    setDate(setMinutes(setHours(d, hour), Number(time.minute)))
  }

  function handleTimeChange(
    hour: string,
    minute: string,
    period: string
  ) {
    setTime({ hour, minute, period })
    if (!date) return
    const hour24 = Number(hour) % 12 + (period === "pm" ? 12 : 0)
    setDate(setMinutes(setHours(date, hour24), Number(minute)))
  }

  return (
    <div className="grid gap-(--space-sm)">
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
      />
      <div className="flex items-center gap-(--space-xs) px-(--space-2xs)">
        <span className="text-sm font-medium">Time</span>
        <div className="flex items-center gap-(--space-2xs)">
          <Select
            value={time.hour}
            onValueChange={(hour) =>
              handleTimeChange(hour, time.minute, time.period)
            }
          >
            <SelectTrigger aria-label="Hour">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, index) =>
                String(index + 1).padStart(2, "0")
              ).map((hour) => (
                <SelectItem key={hour} value={hour}>{hour}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span aria-hidden="true" className="text-muted-foreground">:</span>
          <Select
            value={time.minute}
            onValueChange={(minute) =>
              handleTimeChange(time.hour, minute, time.period)
            }
          >
            <SelectTrigger aria-label="Minute">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 60 }, (_, minute) =>
                String(minute).padStart(2, "0")
              ).map((minute) => (
                <SelectItem key={minute} value={minute}>{minute}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={time.period}
            onValueChange={(period) =>
              handleTimeChange(time.hour, time.minute, period)
            }
          >
            <SelectTrigger aria-label="Period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="am">am</SelectItem>
              <SelectItem value="pm">pm</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        {date
          ? `${format(date, "PPP 'at' h:mm")} ${format(date, "a").toLowerCase()}`
          : "Pick a date and time"}
      </p>
    </div>
  )
}

const BOOKED_DAYS = [
  addDays(new Date(), 2),
  addDays(new Date(), 5),
  addDays(new Date(), 8),
  addDays(new Date(), 12),
]

function BookedDatesDemo() {
  const [date, setDate] = useState<Date | undefined>()
  return (
    <div className="grid gap-(--space-sm)">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={BOOKED_DAYS}
        modifiers={{ booked: BOOKED_DAYS }}
        modifiersClassNames={{ booked: "line-through opacity-50" }}
      />
      <p className="text-sm text-muted-foreground">
        {date
          ? format(date, "PPP")
          : "Strikethrough dates are booked and cannot be selected."}
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Registry entries                                                   */
/* ------------------------------------------------------------------ */

export const miscDemos: ComponentEntry[] = [
  {
    slug: "calendar",
    name: "Calendar",
    description: "A date field component built on React DayPicker.",
    category: "Date",
    Demo: () => <CalendarDemo />,
    code: `import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"

export function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
    />
  )
}`,
    examples: [
      {
        name: "Range Calendar",
        description: "Select a date range across one or two months.",
        Demo: () => <RangeCalendarDemo />,
      },
      {
        name: "Month and Year Selector",
        description: "Navigate quickly with dropdown month and year selectors.",
        Demo: () => <MonthYearSelectorDemo />,
      },
      {
        name: "Presets",
        description: "Quick-select buttons that set a date on click.",
        Demo: () => <PresetsDemo />,
      },
      {
        name: "Date and Time Picker",
        description: "Combines a calendar with hour, minute, and period selectors.",
        Demo: () => <DateTimePickerDemo />,
      },
      {
        name: "Booked Dates",
        description: "Visually distinguish booked dates with strikethrough and prevent their selection.",
        Demo: () => <BookedDatesDemo />,
      },
    ],
  },
]
