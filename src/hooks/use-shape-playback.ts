import { useEffect, useRef, useState } from "react"
import { interpolate } from "flubber"
import { shapePaths, type ShapeName } from "@/lib/shapes"

export function useShapeMorph(name: ShapeName, durationOverride?: number) {
  const [path, setPath] = useState<string>(shapePaths[name].path)
  const displayedPath = useRef(path)

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
      update(target)
      return
    }
    const morph = interpolate(displayedPath.current, target, { maxSegmentLength: 2 })
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
        update(target)
      }
    }
    reducedMotion.addEventListener("change", onMotionChange)
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      reducedMotion.removeEventListener("change", onMotionChange)
    }
  }, [name, durationOverride])

  return path
}