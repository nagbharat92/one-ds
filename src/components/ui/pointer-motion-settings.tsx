import * as React from "react"
import { ArrowDownToLineIcon, ArrowUpFromLineIcon, SplineIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { IconLabel } from "@/components/ui/icon-label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PointerEasing, PointerMotionSettings } from "@/components/ui/pointer"

function PointerMotionControl({ direction, value, onValueChange }: {
  direction: "in" | "out"
  value: PointerMotionSettings
  onValueChange: (value: PointerMotionSettings) => void
}) {
  const id = React.useId()
  const [draft, setDraft] = React.useState(String(value.velocity))
  const [limits] = React.useState(() => {
    const tokens = getComputedStyle(document.documentElement)
    return Object.fromEntries(["min", "max", "step"].map(key => [key, Number(tokens.getPropertyValue(`--pointer-velocity-${key}`))]))
  })
  React.useEffect(() => { setDraft(String(value.velocity)) }, [value.velocity])
  const label = direction === "in" ? "In" : "Out"
  const Icon = direction === "in" ? ArrowDownToLineIcon : ArrowUpFromLineIcon
  return (
    <Popover>
      <PopoverTrigger asChild><Button variant="secondary" aria-label={`${label} animation`}><Icon />{label}</Button></PopoverTrigger>
      <PopoverContent align="start" aria-label={`${label} animation settings`}>
        <Field orientation="horizontal">
          <FieldLabel htmlFor={`${id}-easing`}>Easing</FieldLabel>
          <Select value={value.easing} onValueChange={easing => onValueChange({ ...value, easing: easing as PointerEasing })}>
            <SelectTrigger id={`${id}-easing`} className="w-(--pointer-settings-control-width) gap-(--graphic-label-gap)"><SplineIcon /><IconLabel><SelectValue /></IconLabel></SelectTrigger>
            <SelectContent>
              <SelectItem value="expressive">Expressive</SelectItem>
              <SelectItem value="linear">Linear</SelectItem>
              <SelectItem value="ease-in">Ease in</SelectItem>
              <SelectItem value="ease-out">Ease out</SelectItem>
              <SelectItem value="ease-in-out">Ease in out</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field orientation="horizontal">
          <FieldLabel htmlFor={`${id}-speed`}>Speed (px/s)</FieldLabel>
          <Input id={`${id}-speed`} aria-label={`${label} speed (pixels per second)`} type="number" className="w-(--pointer-settings-control-width)" min={limits.min} max={limits.max} step={limits.step} value={draft}
            onChange={event => {
              setDraft(event.target.value)
              const velocity = event.target.valueAsNumber
              if (Number.isFinite(velocity) && velocity >= limits.min && velocity <= limits.max) onValueChange({ ...value, velocity })
            }} onBlur={() => setDraft(String(value.velocity))} />
        </Field>
      </PopoverContent>
    </Popover>
  )
}

export { PointerMotionControl }