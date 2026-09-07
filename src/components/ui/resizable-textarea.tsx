import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

function ResizableTextarea({ enabled = true, resizeLabel = "Resize description", ref, ...props }: React.ComponentProps<typeof Textarea> & {
  enabled?: boolean
  resizeLabel?: string
}) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const dragRef = React.useRef<{ pointer: number; start: number; height: number } | null>(null)
  function resize(height: number) {
    const textarea = textareaRef.current
    if (!textarea) return
    const minimum = parseFloat(getComputedStyle(textarea).minHeight) || 0
    textarea.style.setProperty("--textarea-resize-height", `${Math.max(minimum, height)}px`)
    textarea.parentElement?.setAttribute("data-resized", "true")
  }
  if (!enabled) return <Textarea {...props} ref={ref} />
  return (
    <div className="resizable-textarea">
      <Textarea {...props} ref={node => {
        textareaRef.current = node
        if (typeof ref === "function") return ref(node)
        if (ref) ref.current = node
      }} />
      <Button type="button" variant="ghost" size="icon" className="resizable-textarea__resize" aria-label={resizeLabel} disabled={props.disabled}
        onPointerDown={event => {
          if (event.button !== 0 || !textareaRef.current) return
          event.preventDefault()
          event.currentTarget.focus({ preventScroll: true })
          event.currentTarget.setPointerCapture(event.pointerId)
          dragRef.current = { pointer: event.pointerId, start: event.clientY, height: textareaRef.current.getBoundingClientRect().height }
        }}
        onPointerMove={event => {
          const drag = dragRef.current
          if (drag?.pointer === event.pointerId) resize(drag.height + event.clientY - drag.start)
        }}
        onPointerUp={event => {
          dragRef.current = null
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
        }}
        onLostPointerCapture={() => { dragRef.current = null }}
        onPointerCancel={() => { dragRef.current = null }}
        onKeyDown={event => {
          const textarea = textareaRef.current
          if (!textarea || !["ArrowUp", "ArrowDown", "Home"].includes(event.key)) return
          event.preventDefault()
          const step = parseFloat(getComputedStyle(event.currentTarget).getPropertyValue("--textarea-resize-step"))
          resize(event.key === "Home" ? 0 : textarea.getBoundingClientRect().height + (event.key === "ArrowUp" ? -step : step))
        }}>
        <span className="resizable-textarea__grip" aria-hidden="true" />
      </Button>
    </div>
  )
}

export { ResizableTextarea }