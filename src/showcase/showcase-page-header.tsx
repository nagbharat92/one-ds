import { useEffect, useRef, useState, type ReactNode } from "react"

import { CodeBlock } from "@/components/code-block"
import { Button } from "@/components/ui/button"
import { CheckIcon, CopyIcon } from "@/components/ui/icons"
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/components/ui/page-header"
import { Separator } from "@/components/ui/separator"

function ShowcasePageHeader({
  title,
  description,
  command,
  children,
  compactContent,
}: {
  title: ReactNode
  description: ReactNode
  command?: string | null
  children?: ReactNode
  compactContent?: ReactNode
}) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const sentinel = sentinelRef.current
    const root = sentinel?.closest<HTMLElement>(
      '[data-slot="page-scroll"], .centered-header-scroll'
    )
    if (!root || !sentinel) return

    const updateCollapsed = () => {
      const rootTop = root.getBoundingClientRect().top
      setCollapsed(sentinel.getBoundingClientRect().top <= rootTop)
    }

    updateCollapsed()
    root.addEventListener("scroll", updateCollapsed, { passive: true })
    return () => root.removeEventListener("scroll", updateCollapsed)
  }, [])

  const copyCommand = async () => {
    if (!command) return
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      // Ignore clipboard failures in unsupported contexts.
    }
  }

  return (
    <>
      <div
        className="showcase-page-header__barwrap px-(--page-gutter-sm) sm:px-(--page-gutter-md) lg:px-(--page-gutter-lg)"
        data-collapsed={collapsed ? "true" : "false"}
        aria-hidden={!collapsed}
        inert={!collapsed}
      >
        <div
          className="showcase-page-header__bar"
          data-has-command={command || compactContent ? "true" : "false"}
        >
          <span className="showcase-page-header__bar-title">{title}</span>
          {command ? (
            <Button
              variant="tertiary"
              className="rounded-full"
              onClick={copyCommand}
              aria-label={copied ? "Copied install command" : "Copy install command"}
            >
              {copied ? (
                <CheckIcon data-icon="inline-start" aria-hidden="true" />
              ) : (
                <CopyIcon data-icon="inline-start" aria-hidden="true" />
              )}
              {copied ? "Copied" : "Copy command"}
            </Button>
          ) : null}
          {compactContent}
        </div>
      </div>

      <div
        data-showcase-page-header-shell
        className="px-(--page-gutter-sm) sm:px-(--page-gutter-md) lg:px-(--page-gutter-lg)"
      >
        <PageHeader
          variant="centered"
          data-showcase-page-header
          className="showcase-page-header relative mx-auto w-full max-w-(--showcase-page-header-max-width) bg-transparent ring-0 shadow-(--elevation-flat)"
        >
          <PageHeaderContent className="gap-(--space-3xl)">
            <div className="flex flex-col gap-(--space-2xs)">
              <PageHeaderTitle>{title}</PageHeaderTitle>
              <PageHeaderDescription>{description}</PageHeaderDescription>
            </div>
            {children}
            {command ? (
              <div className="flex w-full flex-col gap-(--space-3xl)">
                <div className="dark showcase-page-header__code">
                  <CodeBlock
                    code={command}
                    showLineNumbers={false}
                    hang={false}
                    className="w-full"
                  />
                </div>
                <Separator />
              </div>
            ) : (
              <Separator />
            )}
          </PageHeaderContent>
          <div
            ref={sentinelRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-(--separator-thickness)"
          />
        </PageHeader>
      </div>
    </>
  )
}

export { ShowcasePageHeader }