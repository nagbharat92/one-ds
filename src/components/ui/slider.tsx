"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { sliderSnapPoints, snapSliderValue, type SliderSnapMode } from "@/lib/slider-snapping"

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  thumbLabels?: string[]
  thumbValueTexts?: string[]
  snapPoints?: number[]
  snapMode?: SliderSnapMode
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  thumbLabels,
  thumbValueTexts,
  snapPoints,
  snapMode = "magnetic",
  step = 1,
  minStepsBetweenThumbs = 0,
  orientation = "horizontal",
  inverted = false,
  onValueChange,
  onValueCommit,
  onPointerDownCapture,
  onKeyDownCapture,
  "aria-label": ariaLabel,
  "aria-valuetext": ariaValueText,
  ...props
}: SliderProps) {
  const [localValue, setLocalValue] = React.useState(defaultValue ?? [min])
  const interaction = React.useRef({ pointer: false, stepping: false, threshold: 0 })
  const points = snapPoints ? sliderSnapPoints(snapPoints, min, max, snapMode) : []
  const snapping = points.length > 0 && max > min
  const currentValues = (value ?? localValue).map(current => snapping && snapMode === "discrete"
    ? snapSliderValue(current, current, points, snapMode, 0, false)
    : current)

  function resolveValues(nextValues: number[]) {
    const { pointer, stepping, threshold } = interaction.current
    if (snapMode === "magnetic" && !pointer) return nextValues
    const resolved = nextValues.map((next, index) => next === currentValues[index] ? next :
      snapSliderValue(next, currentValues[index], points, snapMode, threshold, stepping)).sort((left, right) => left - right)
    return resolved.some((next, index) => index > 0 && next - resolved[index - 1] < minStepsBetweenThumbs * step)
      ? currentValues : resolved
  }

  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={snapping ? currentValues : value}
      min={min}
      max={max}
      step={step}
      minStepsBetweenThumbs={minStepsBetweenThumbs}
      orientation={orientation}
      inverted={inverted}
      data-snap-mode={snapping ? snapMode : undefined}
      onPointerDownCapture={(event) => {
        onPointerDownCapture?.(event)
        if (event.defaultPrevented) return
        interaction.current = {
          pointer: true,
          stepping: false,
          threshold: (max - min) * (Number.parseFloat(getComputedStyle(event.currentTarget).getPropertyValue("--slider-snap-threshold")) || 0),
        }
      }}
      onKeyDownCapture={(event) => {
        onKeyDownCapture?.(event)
        if (event.defaultPrevented) return
        interaction.current = { pointer: false, stepping: event.key.startsWith("Arrow") || event.key.startsWith("Page"), threshold: 0 }
      }}
      onValueChange={snapping ? (nextValues) => {
        const resolved = resolveValues(nextValues)
        if (resolved.every((next, index) => next === currentValues[index])) return
        setLocalValue(resolved)
        onValueChange?.(resolved)
      } : onValueChange}
      onValueCommit={snapping ? (nextValues) => onValueCommit?.(resolveValues(nextValues)) : onValueCommit}
      aria-label={ariaLabel}
      aria-valuetext={ariaValueText}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative grow overflow-hidden rounded-full bg-muted data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute bg-primary select-none data-horizontal:h-full data-vertical:w-full"
        />
      </SliderPrimitive.Track>
      {snapping && points.map(point => {
        const fraction = (point - min) / (max - min)
        const position = (inverted ? 1 - fraction : fraction) * 100
        return (
          <span
            key={point}
            data-slot="slider-stop"
            data-value={point}
            aria-hidden="true"
            ref={node => { node?.style.setProperty("--slider-stop-position", `calc(${position}% + var(--slider-thumb-size) * ${0.5 - position / 100})`) }}
            className={cn("pointer-events-none absolute rounded-full bg-muted-foreground",
              orientation === "horizontal"
                ? "inset-s-(--slider-stop-position) top-1/2 h-(--slider-stop-height) w-(--slider-stop-width) -translate-y-1/2 -translate-x-1/2 rtl:translate-x-1/2"
                : "bottom-(--slider-stop-position) left-1/2 h-(--slider-stop-width) w-(--slider-stop-height) -translate-x-1/2 translate-y-1/2")}
          />
        )
      })}
      {Array.from({ length: snapping ? currentValues.length : _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          aria-label={
            thumbLabels?.[index] ??
            (_values.length === 1 ? ariaLabel : undefined)
          }
          aria-valuetext={
            thumbValueTexts?.[index] ??
            (_values.length === 1 ? ariaValueText : undefined)
          }
          className="relative block size-(--slider-thumb-size) shrink-0 rounded-full border border-ring bg-(--surface-lowest) bg-clip-padding ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
export type { SliderProps }
