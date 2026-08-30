import { useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function CodeBlock({ code, className }: { code: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("relative h-full", className)}>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Copy code"
        onClick={copy}
        className="absolute top-3 right-3 z-10 size-7 text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800"
      >
        {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
      </Button>
      <pre className="h-full overflow-auto rounded-lg border bg-zinc-950 p-4 text-sm text-zinc-50">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  )
}
