import { useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useScrollerRef } from "@/hooks/use-scroller"

export function CodeBlock({
  code,
  className,
  language,
  showLineNumbers = true,
}: {
  code: string
  className?: string
  language?: string
  showLineNumbers?: boolean
}) {
  const [copied, setCopied] = useState(false)
  const setScrollRef = useScrollerRef<HTMLPreElement>()

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card
      variant="code"
      className={cn(
        "group/code-block min-h-(--code-block-min-height)",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b bg-muted ps-(--code-block-padding-inline) pe-(--code-block-action-inset) py-(--code-block-header-padding-block)">
        <span className="font-mono text-xs text-muted-foreground">
          {language || "Code"}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={copied ? "Copied" : "Copy code"}
          onClick={copy}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </Button>
      </div>
      <pre
        ref={setScrollRef}
        tabIndex={0}
        className="scroll-fade-y scroll-fade-6 scrollbar-thin min-h-0 flex-1 overflow-auto py-(--code-block-padding-block) text-sm text-card-foreground"
      >
        <code className="grid min-w-max font-mono">
          {code.split("\n").map((line, index) => (
            <span key={index} className="flex min-h-lh px-(--code-block-padding-inline)">
              {showLineNumbers ? (
                <span
                  aria-hidden="true"
                  className="w-(--code-block-line-number-width) shrink-0 select-none pe-(--code-block-line-number-gap) text-end text-muted-foreground"
                >
                  {index + 1}
                </span>
              ) : null}
              <span>{line || " "}</span>
            </span>
          ))}
        </code>
      </pre>
    </Card>
  )
}
