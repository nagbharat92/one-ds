import * as React from "react"

import { cn } from "@/lib/utils"
import { IconBox, type IconProps, type IconBoxSize } from "@/components/ui/icon"
import { AnnotationCallouts } from "@/components/ui/annotation"
import { Stack } from "@/components/ui/stack"
import { Text } from "@/components/ui/text"

function IconPreviewGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div {...props} data-slot="icon-preview-group" className={cn("icon-preview-group", className)} />
}

function IconPreview({ icon: PreviewIcon, size = 20, boxSize = 48, annotations = false, caption }: Pick<IconProps, "size"> & {
  icon: React.ComponentType<Omit<IconProps, "icon">>
  boxSize?: IconBoxSize
  annotations?: boolean
  caption: string
}) {
  return (
    <Stack gap="sm" align="center" className="overflow-hidden" data-slot="icon-preview" data-annotations={annotations}>
      <Stack align="center" justify="center" className="icon-preview__stage">
        <IconBox size={boxSize} data-annotate="box">
          <PreviewIcon size={size} data-annotate="svg" />
        </IconBox>
        <AnnotationCallouts active={annotations} showDimensions items={[
          { id: "box", target: "box", side: "top", content: "Box", label: true },
          { id: "svg", target: "svg", side: "bottom", content: "SVG viewport", label: true },
        ]} />
      </Stack>
      <Text variant="label" data-annotate-avoid>{caption}</Text>
    </Stack>
  )
}

export { IconPreview, IconPreviewGroup }