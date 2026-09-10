import { useEffect, useRef, useState } from "react"
import { interpolate } from "flubber"
import { shapePaths, shapeSpinKeyframes, type ShapeName } from "@/lib/shapes"

export function useShapeMorph(name: ShapeName, durationOverride?: number, turns = 1) {
  const [path, setPath] = useState<string>(shapePaths[name].path)
  const displayedPath = useRef(path)
  const previewRef = useRef<SVGSVGElement>(null)
  const currentRotation = useRef(0)

  useEffect(() => {
    const target = shapePaths[name].path
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = (next: string) => {
      displayedPath.current = next
      setPath(next)
    }
    const duration = durationOverride ?? Number(getComputedStyle(document.documentElement).getPropertyValue("--shape-morph-duration"))
    if (displayedPath.current === target) return
    if (reducedMotion.matches || !Number.isFinite(duration) || duration <= 0) {
      currentRotation.current = 0
      update(target)
      return
    }
    const morph = interpolate(displayedPath.current, target, { maxSegmentLength: 2 })
    const tokens = getComputedStyle(document.documentElement)
    const initialRotation = currentRotation.current
    const animation = previewRef.current?.animate(shapeSpinKeyframes(tokens, initialRotation, turns), { duration, fill: "forwards" })
    const start = performance.now()
    let frame: number
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      update(progress === 1 ? target : morph(progress))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    const onMotionChange = () => {
      if (reducedMotion.matches) {
        cancelAnimationFrame(frame)
        animation?.cancel()
        currentRotation.current = 0
        update(target)
      }
    }
    reducedMotion.addEventListener("change", onMotionChange)
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      const rotation = previewRef.current ? parseFloat(getComputedStyle(previewRef.current).rotate) : 0
      currentRotation.current = Number.isFinite(rotation) ? rotation : 0
      animation?.cancel()
      reducedMotion.removeEventListener("change", onMotionChange)
    }
  }, [name, durationOverride, turns])

  return { path, previewRef }
}