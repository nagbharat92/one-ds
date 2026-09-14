import * as React from "react"
import { Separator as SeparatorPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

type WavySeparatorSize = "small" | "medium" | "large"

const wavySeparatorSettings: Record<
  WavySeparatorSize,
  { wavelength: number; amplitude: number; phase: number }
> = {
  small: { wavelength: 36, amplitude: 2.5, phase: 240 },
  medium: { wavelength: 57, amplitude: 6, phase: 269 },
  large: { wavelength: 96, amplitude: 10, phase: 270 },
}

const separatorVariants = cva(
  "shrink-0 data-horizontal:h-(--separator-thickness) data-horizontal:w-full data-vertical:w-(--separator-thickness) data-vertical:self-stretch",
  {
    variants: {
      variant: {
        default: "bg-(--separator-stroke)",
        // Fades to transparent at both ends so the rule dissolves into the page
        // instead of hard-stopping. Colour follows the separator tone token.
        faded:
          "bg-transparent from-transparent via-(--separator-stroke) to-transparent data-horizontal:bg-linear-to-r data-vertical:bg-linear-to-b",
        wavy:
          "bg-(--separator-stroke) data-horizontal:h-(--separator-wavy-height) data-vertical:w-(--separator-wavy-height)",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  tone = "subtle",
  variant,
  wavySize = "small",
  fill = "none",
  fillClassName,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root> &
  VariantProps<typeof separatorVariants> & {
    tone?: "subtle" | "neutral"
    wavySize?: WavySeparatorSize
    fill?: "none" | "bottom"
    fillClassName?: string
  }) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(720)

  React.useLayoutEffect(() => {
    if (variant !== "wavy") return
    const element = rootRef.current
    if (!element) return
    const measured = element.offsetWidth || element.getBoundingClientRect().width
    if (measured > 0) setWidth(measured)
    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width
      if (next && next > 0) setWidth(next)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [variant])

  if (variant === "wavy" && orientation === "horizontal") {
    const { wavelength, amplitude, phase } = wavySeparatorSettings[wavySize]
    const height = amplitude * 2 + 4
    const baseline = height / 2
    const phaseValue = (phase / 180) * Math.PI
    const step = 2
    const count = Math.ceil(width / step)
    const points: [number, number][] = []
    for (let i = 0; i <= count; i++) {
      const x = Math.min(i * step, width)
      const angle = (x / wavelength) * Math.PI * 2 + phaseValue
      const y = baseline - Math.sin(angle) * amplitude
      points.push([x, y])
    }
    const strokePath = points
      .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
      .join(" ")
    const fillPath = `${strokePath} L ${width + 1} ${height + 2} L -1 ${height + 2} Z`

    return (
      <div
        ref={rootRef}
        data-slot="separator"
        data-variant="wavy"
        data-orientation={orientation}
        data-tone={tone}
        data-wavy-size={wavySize}
        role={decorative ? "none" : "separator"}
        aria-orientation={decorative ? undefined : orientation}
        className={cn(
          "shrink-0 text-(--separator-stroke) data-horizontal:w-full",
          tone === "neutral" && "text-(--separator-stroke-neutral)",
          className
        )}
        {...props}
      >
        <svg
          aria-hidden="true"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="block w-full overflow-visible"
        >
          {fill === "bottom" && (
            <path
              d={fillPath}
              className={cn("fill-current", fillClassName)}
            />
          )}
          <path
            d={strokePath}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    )
  }

  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      data-variant={variant ?? "default"}
      data-tone={tone}
      decorative={decorative}
      orientation={orientation}
      className={cn(separatorVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Separator }
export type { WavySeparatorSize }
