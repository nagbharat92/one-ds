import { useEffect, useState, type ReactNode } from "react"
import {
  MenuIcon,
  PaletteIcon,
  RotateCcwIcon,
  SearchIcon,
} from "lucide-react"

import { groupedRegistry, registry } from "@/showcase/registry"
import { generatedExampleCode } from "@/showcase/generated-example-code"
import type { ComponentExample } from "@/showcase/types"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CodeBlock } from "@/components/code-block"
import { ModeToggle } from "@/components/mode-toggle"

function useHashRoute() {
  const [hash, setHash] = useState(
    () => window.location.hash.replace(/^#\/?/, "") || registry[0].slug,
  )

  useEffect(() => {
    const onChange = () =>
      setHash(window.location.hash.replace(/^#\/?/, "") || registry[0].slug)
    window.addEventListener("hashchange", onChange)
    return () => window.removeEventListener("hashchange", onChange)
  }, [])

  const navigate = (slug: string) => {
    window.location.hash = `/${slug}`
  }

  return [hash, navigate] as const
}

function exampleId(componentSlug: string, exampleName: string) {
  return `${componentSlug}-${exampleName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`
}

function DemoSandbox({
  children,
  layout = "center",
}: {
  children: ReactNode
  layout?: ComponentExample["layout"]
}) {
  const [status, setStatus] = useState("")

  return (
    <Card
      variant="preview"
      className="showcase-stage"
      data-layout={layout}
      onClickCapture={(event) => {
        if (!(event.target instanceof Element)) return

        const link = event.target.closest("a[href]")
        if (link) {
          event.preventDefault()
          setStatus("Navigation simulated")
          return
        }

        const button = event.target.closest("button, [role='button']")
        if (
          button &&
          !button.matches(":disabled, [aria-disabled='true']")
        ) {
          const label =
            button.getAttribute("aria-label") ?? button.textContent?.trim()
          setStatus(label ? `${label} activated` : "Action activated")
        }
      }}
      onSubmitCapture={(event) => {
        event.preventDefault()
        setStatus("Form submission simulated")
      }}
    >
      {children}
      {status ? (
        <div className="showcase-stage__status" role="status">
          {status}
        </div>
      ) : null}
    </Card>
  )
}

function ExampleSection({
  componentSlug,
  example,
}: {
  componentSlug: string
  example: ComponentExample
}) {
  const [resetKey, setResetKey] = useState(0)
  const [view, setView] = useState("preview")
  const id = exampleId(componentSlug, example.name)
  const code =
    example.code ?? generatedExampleCode[`${componentSlug}:${example.name}`]
  if (!code) {
    throw new Error(`Missing generated code for ${componentSlug}:${example.name}`)
  }
  const reset = (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setResetKey((value) => value + 1)}
    >
      <RotateCcwIcon data-icon="inline-start" />
      Reset
    </Button>
  )
  const preview = (
    <DemoSandbox key={resetKey} layout={example.layout}>
      <example.Demo />
    </DemoSandbox>
  )

  return (
    <section className="showcase-example" id={id}>
      <div className="showcase-example__header">
        <h2 className="showcase-example__title">{example.name}</h2>
        {example.description ? (
          <p className="showcase-example__description">{example.description}</p>
        ) : null}
      </div>

      <Tabs
        value={view}
        onValueChange={(value) => {
          setView(value)
          if (value === "code") setResetKey((current) => current + 1)
        }}
        className="showcase-example__tabs"
      >
        <div className="showcase-example__toolbar">
          <TabsList aria-label={`${example.name} view`}>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          {reset}
        </div>
        <div className="showcase-example__panels">
          <TabsContent
            value="preview"
            forceMount
            aria-hidden={view !== "preview"}
            inert={view !== "preview"}
            className="showcase-example__preview-panel"
          >
            {preview}
          </TabsContent>
          <TabsContent
            value="code"
            forceMount
            aria-hidden={view !== "code"}
            inert={view !== "code"}
            className="showcase-example__code-panel"
          >
            <CodeBlock code={code} className="showcase-example__code-block" />
          </TabsContent>
        </div>
      </Tabs>
    </section>
  )
}

function ComponentNavigation({
  activeSlug,
  onNavigate,
}: {
  activeSlug: string
  onNavigate: (slug: string) => void
}) {
  const [query, setQuery] = useState("")
  const normalizedQuery = query.trim().toLowerCase()
  const visibleGroups = groupedRegistry
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.name.toLowerCase().includes(normalizedQuery),
      ),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <nav className="showcase-nav" aria-label="Components">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search components"
          aria-label="Search components"
        />
      </InputGroup>
      <div className="showcase-nav__groups">
        {visibleGroups.map((group) => (
          <div className="showcase-nav__group" key={group.category}>
            <p className="showcase-nav__label">{group.category}</p>
            <div className="showcase-nav__items">
              {group.items.map((component) => (
                <button
                  type="button"
                  key={component.slug}
                  onClick={() => onNavigate(component.slug)}
                  className="showcase-nav__item"
                  data-active={activeSlug === component.slug || undefined}
                >
                  {component.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </nav>
  )
}

function ComponentPage({ slug }: { slug: string }) {
  const entry = registry.find((component) => component.slug === slug) ?? registry[0]
  const installCommand =
    entry.installCommand === undefined
      ? `npx shadcn@latest add ${entry.slug}`
      : entry.installCommand
  const examples: ComponentExample[] = [
    {
      name: "Default",
      Demo: entry.Demo,
      code: entry.code,
    },
    ...(entry.examples ?? []),
  ]

  return (
    <article className="showcase-component">
      <header className="showcase-component__header">
        <div className="showcase-component__meta">
          <Badge variant="secondary">{entry.category}</Badge>
          <span>{examples.length} examples</span>
        </div>
        <h1 className="showcase-component__title">{entry.name}</h1>
        <p className="showcase-component__description">{entry.description}</p>
        {installCommand ? (
          <code className="showcase-component__command">{installCommand}</code>
        ) : null}
      </header>

      <div className="showcase-component__index" aria-label="Examples on this page">
        {examples.map((example) => (
          <Button
            key={example.name}
            variant="ghost"
            size="sm"
            onClick={() =>
              document
                .getElementById(exampleId(entry.slug, example.name))
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          >
            {example.name}
          </Button>
        ))}
      </div>

      <Separator />

      <div className="showcase-component__examples">
        {examples.map((example) => (
          <ExampleSection
            key={example.name}
            componentSlug={entry.slug}
            example={example}
          />
        ))}
      </div>
    </article>
  )
}

function App() {
  const [slug, navigate] = useHashRoute()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" })
  }, [slug])

  const navigateFromMenu = (nextSlug: string) => {
    navigate(nextSlug)
    setMobileNavOpen(false)
  }

  return (
    <div className="showcase-app">
      <header className="showcase-header">
        <div className="showcase-header__inner">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open component navigation"
                className="md:hidden"
              >
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="showcase-mobile-nav">
              <SheetHeader>
                <SheetTitle>Components</SheetTitle>
                <SheetDescription>Browse the complete showcase.</SheetDescription>
              </SheetHeader>
              <ComponentNavigation activeSlug={slug} onNavigate={navigateFromMenu} />
            </SheetContent>
          </Sheet>
          <PaletteIcon className="size-5" />
          <span className="font-semibold">OneDS</span>
          <Badge variant="outline" className="ml-1 hidden sm:inline-flex">
            {registry.length} components
          </Badge>
          <div className="showcase-header__actions">
            <Button asChild variant="ghost" size="icon" aria-label="GitHub">
              <a href="https://github.com/bhna_microsoft/oneds" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.75.81 1.2 1.84 1.2 3.1 0 4.43-2.69 5.41-5.25 5.69.42.37.8 1.09.8 2.2v3.26c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z"
                  />
                </svg>
              </a>
            </Button>
            <ModeToggle />
          </div>
        </div>
      </header>

      <div className="showcase-layout">
        <aside className="showcase-sidebar hidden md:block">
          <ComponentNavigation activeSlug={slug} onNavigate={navigate} />
        </aside>

        <main className="showcase-main">
          <ComponentPage key={slug} slug={slug} />
        </main>
      </div>
    </div>
  )
}

export default App
