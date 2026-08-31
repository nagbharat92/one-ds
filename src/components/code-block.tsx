import { useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useScrollerRef } from "@/hooks/use-scroller"

export function CodeBlock({ code, className }: { code: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  const setScrollRef = useScrollerRef<HTMLPreElement>()

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        "relative h-full overflow-hidden rounded-lg border bg-zinc-950",
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        aria-label="Copy code"
        onClick={copy}
        className="absolute top-3 right-3 z-10 size-7 text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800"
      >
        {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
      </Button>
      <pre
        ref={setScrollRef}
        className="scroll-fade-y scroll-fade-6 scrollbar-thin h-full overflow-auto p-4 text-sm text-zinc-50"
      >
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  )
}
