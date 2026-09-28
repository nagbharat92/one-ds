import { useCallback, useEffect, useRef, useState } from "react"

/**
 * State shared by every same-origin tab open to the same `key` — persisted to
 * localStorage so a freshly opened tab starts from the latest value, and kept
 * live via BroadcastChannel so every open tab (including duplicate mounts in
 * the same tab) converges immediately after any one of them changes it.
 */
function useBroadcastState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as T) : initialValue
    } catch {
      return initialValue
    }
  })
  const channelRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return
    const channel = new BroadcastChannel(key)
    channelRef.current = channel
    channel.onmessage = (event: MessageEvent<T>) => setValue(event.data)
    return () => {
      channel.close()
      channelRef.current = null
    }
  }, [key])

  const update = useCallback(
    (next: T | ((current: T) => T)) => {
      setValue((current) => {
        const resolved =
          typeof next === "function" ? (next as (current: T) => T)(current) : next
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved))
        } catch {
          // Storage can be full or unavailable (private browsing); the state
          // still updates locally, it just won't persist or broadcast.
        }
        channelRef.current?.postMessage(resolved)
        return resolved
      })
    },
    [key],
  )

  return [value, update] as const
}

export { useBroadcastState }
