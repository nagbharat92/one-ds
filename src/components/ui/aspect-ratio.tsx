import { AspectRatio as AspectRatioPrimitive, Slot } from "radix-ui"

import { cn } from "@/lib/utils"

type AspectRatioPreset = "landscape" | "portrait" | "square"

const aspectRatioPresets: Record<AspectRatioPreset, string> = {
  landscape: "aspect-(--aspect-ratio-landscape)",
  portrait: "aspect-(--aspect-ratio-portrait)",
  square: "aspect-(--aspect-ratio-square)",
}

function AspectRatio({
  ratio = "landscape",
  className,
  asChild,
  ...props
}: Omit<React.ComponentProps<typeof AspectRatioPrimitive.Root>, "ratio"> & {
  ratio?: number | AspectRatioPreset
}) {
  if (typeof ratio === "number") {
    return (
      <AspectRatioPrimitive.Root
        data-slot="aspect-ratio"
        ratio={ratio}
        className={className}
        asChild={asChild}
        {...props}
      />
    )
  }

  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="aspect-ratio"
      data-ratio={ratio}
      className={cn("relative w-full", aspectRatioPresets[ratio], className)}
      {...props}
    />
  )
}

export { AspectRatio, type AspectRatioPreset }
