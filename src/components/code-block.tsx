import { useState } from "react"
import { CheckIcon, CopyIcon } from "@/components/ui/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Scroller } from "@/components/ui/scroller"
import { useScrollerRef } from "@/hooks/use-scroller"
import type { HangOffset } from "@/lib/hang"

function copyWithCommand(value: string) {
  let copied = false
  const handleCopy = (event: ClipboardEvent) => {
    if (!event.clipboardData) return
    event.clipboardData.setData("text/plain", value)
    event.preventDefault()
    copied = true
  }

  document.addEventListener("copy", handleCopy, { once: true })
  const succeeded = document.execCommand("copy")
  document.removeEventListener("copy", handleCopy)
  return succeeded && copied
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    return copyWithCommand(value)
  }
}

export function CodeBlock({
  code,
  className,
  showLineNumbers = true,
  theme = "opposite",
  hang,
}: {
  code: string
  className?: string
  language?: string
  showLineNumbers?: boolean
  theme?: "current" | "opposite"
  hang?: HangOffset
}) {
  const [copied, setCopied] = useState(false)
  const setScrollRef = useScrollerRef<HTMLDivElement>()
  const isSingleLine = !code.includes("\n")

  const copy = async () => {
    if (!(await copyText(code))) return
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card
      variant="code"
      data-code-theme={theme}
      hang={hang}
      className={cn(
        "group/code-block relative min-h-(--code-block-min-height)",
        className
      )}
    >
      <Button
        variant="secondary"
        size="icon"
        data-code-block-copy
        className="absolute top-(--code-block-copy-inset) inset-e-(--code-block-copy-inset) z-(--code-block-copy-layer) rounded-(--code-block-copy-radius)"
        aria-label={copied ? "Copied" : "Copy code"}
        onClick={copy}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
      <Scroller
        ref={setScrollRef}
        axis={isSingleLine ? "x" : "y"}
        fade={isSingleLine ? "end" : "both"}
        fadeSize="sm"
        scrollbar="thin"
        tabIndex={0}
        className={cn(
          "min-h-0 flex-1 text-sm text-card-foreground",
          isSingleLine
            ? "flex items-center py-0 leading-none"
            : "py-(--code-block-padding-block)"
        )}
      >
        <code className={cn("grid min-w-max font-mono", isSingleLine && "leading-none")}>
          {code.split("\n").map((line, index) => (
            <span
              key={index}
              className={cn(
                "flex items-center px-(--code-block-padding-inline)",
                isSingleLine ? "min-h-0 py-0" : "min-h-lh",
                isSingleLine && !showLineNumbers && "justify-start",
                !isSingleLine && "translate-y-px"
              )}
            >
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
      </Scroller>
    </Card>
  )
}
