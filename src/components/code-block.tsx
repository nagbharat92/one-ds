import { useState } from "react"
import { CheckIcon, CopyIcon } from "@/components/ui/icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useScrollerRef } from "@/hooks/use-scroller"

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
}: {
  code: string
  className?: string
  language?: string
  showLineNumbers?: boolean
}) {
  const [copied, setCopied] = useState(false)
  const setScrollRef = useScrollerRef<HTMLPreElement>()

  const copy = async () => {
    if (!(await copyText(code))) return
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card
      variant="code"
      className={cn(
        "group/code-block relative min-h-(--code-block-min-height)",
        className
      )}
    >
      <Button
        variant="tertiary"
        size="icon"
        data-code-block-copy
        className="absolute top-(--code-block-copy-inset) inset-e-(--code-block-copy-inset) z-(--code-block-copy-layer) rounded-(--code-block-copy-radius)"
        aria-label={copied ? "Copied" : "Copy code"}
        onClick={copy}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
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
