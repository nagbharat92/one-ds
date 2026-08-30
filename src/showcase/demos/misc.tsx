import { useState } from "react"

import type { ComponentEntry } from "@/showcase/types"
import type { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import { DirectionProvider } from "@/components/ui/direction"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { addDays, addMonths, format, setHours, setMinutes, isSameDay } from "date-fns"
import { faIR } from "react-day-picker/locale"

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
      className="rounded-md border shadow-sm"
    />
  )
}

function RangeCalendarDemo() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 6),
  })
  return (
    <div className="space-y-3">
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={2}
        className="rounded-md border shadow-sm"
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
    <div className="space-y-3">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        captionLayout="dropdown"
        startMonth={new Date(2020, 0)}
        endMonth={addMonths(new Date(), 12)}
        className="rounded-md border shadow-sm"
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
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex flex-col gap-1.5">
        {PRESETS.map((p) => (
          <Button
            key={p.label}
            variant={date && isSameDay(date, p.value()) ? "default" : "outline"}
            size="sm"
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
        className="rounded-md border shadow-sm"
      />
    </div>
  )
}

function DateTimePickerDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState(() => {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
  })

  function handleDateSelect(d: Date | undefined) {
    if (!d) { setDate(undefined); return }
    const [h, m] = time.split(":").map(Number)
    setDate(setMinutes(setHours(d, h), m))
  }

  function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTime(e.target.value)
    if (!date) return
    const [h, m] = e.target.value.split(":").map(Number)
    setDate(setMinutes(setHours(date, h), m))
  }

  return (
    <div className="space-y-3">
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        className="rounded-md border shadow-sm"
      />
      <div className="flex items-center gap-2 px-1">
        <label htmlFor="cal-time" className="text-sm font-medium">
          Time
        </label>
        <input
          id="cal-time"
          type="time"
          value={time}
          onChange={handleTimeChange}
          className="rounded-md border bg-transparent px-2 py-1 text-sm shadow-sm"
        />
      </div>
      <p className="text-sm text-muted-foreground">
        {date ? format(date, "PPP 'at' p") : "Pick a date and time"}
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
    <div className="space-y-3">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={BOOKED_DAYS}
        modifiers={{ booked: BOOKED_DAYS }}
        modifiersClassNames={{ booked: "line-through opacity-50" }}
        className="rounded-md border shadow-sm"
      />
      <p className="text-sm text-muted-foreground">
        {date
          ? format(date, "PPP")
          : "Strikethrough dates are booked and cannot be selected."}
      </p>
    </div>
  )
}

function CustomCellSizeDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  return (
    <div className="space-y-3">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="showcase-calendar-large rounded-md border shadow-sm"
      />
      <p className="text-sm text-muted-foreground">
        {date ? format(date, "PPP") : "Pick a date"}
      </p>
    </div>
  )
}

function WeekNumbersDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  return (
    <div className="space-y-3">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        showWeekNumber
        className="rounded-md border shadow-sm"
      />
      <p className="text-sm text-muted-foreground">
        {date ? format(date, "PPP") : "Pick a date"}
      </p>
    </div>
  )
}

function PersianCalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  return (
    <div className="space-y-3">
      {/*
       * react-day-picker v10 does NOT have a true Solar Hijri / Jalali
       * calendar system — it always uses the Gregorian calendar internally.
       * `numerals="arabext"` renders Eastern Arabic-Indic digits (۱۲۳),
       * `locale={faIR}` provides Persian month/day names and RTL labels.
       * A genuine Jalali calendar requires a dateLib override wrapping a
       * library like date-fns-jalali, which is not bundled here.
       */}
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        locale={faIR}
        numerals="arabext"
        dir="rtl"
        className="rounded-md border shadow-sm"
      />
      <p className="text-sm text-muted-foreground" dir="rtl">
        {date
          ? date.toLocaleDateString("fa-IR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "یک تاریخ انتخاب کنید"}
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
      className="rounded-md border shadow-sm"
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
        description: "Combines a calendar with a native time input for full date-time selection.",
        Demo: () => <DateTimePickerDemo />,
      },
      {
        name: "Booked Dates",
        description: "Visually distinguish booked dates with strikethrough and prevent their selection.",
        Demo: () => <BookedDatesDemo />,
      },
      {
        name: "Custom Cell Size",
        description: "Larger day cells via the --cell-size custom property.",
        Demo: () => <CustomCellSizeDemo />,
      },
      {
        name: "Week Numbers",
        description: "Shows ISO week numbers alongside the calendar grid.",
        Demo: () => <WeekNumbersDemo />,
      },
      {
        name: "Persian Calendar",
        description: "Gregorian calendar with Persian locale labels and Eastern Arabic-Indic numerals. A true Solar Hijri system requires a dateLib override with date-fns-jalali.",
        Demo: () => <PersianCalendarDemo />,
      },
    ],
  },
  {
    slug: "direction",
    name: "Direction Provider",
    description:
      "Provides reading direction (LTR/RTL) context to components.",
    category: "Utilities",
    Demo: () => (
      <DirectionProvider dir="rtl">
        <div dir="rtl" className="w-full max-w-sm space-y-3 rounded-lg border p-4">
          <p className="text-sm">تُبنى الواجهة مع دعم الاتجاه من اليمين إلى اليسار.</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">القائمة</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>الملف الشخصي</DropdownMenuItem>
              <DropdownMenuItem>الإعدادات</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </DirectionProvider>
    ),
    code: `import { DirectionProvider } from "@/components/ui/direction"

export function DirectionDemo() {
  return (
    <DirectionProvider dir="rtl">
      <div dir="rtl">
        {/* Radix components inside inherit RTL behavior */}
      </div>
    </DirectionProvider>
  )
}`,
  },
]
