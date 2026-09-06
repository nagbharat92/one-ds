import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import {
  ArrowDownAZIcon,
  CodeIcon,
  EyeIcon,
  LayoutListIcon,
  PaletteIcon,
  RotateCcwIcon,
  TriangleAlertIcon,
} from "lucide-react"

import {
  blockRegistry,
  componentRegistry,
  experimentRegistry,
  previewRegistry,
  groupedRegistry,
  registry,
} from "@/showcase/registry"
import { generatedExampleCode } from "@/showcase/generated-example-code"
import type { ComponentEntry, ComponentExample } from "@/showcase/types"

// Three sizing tiers, each built from EXISTING PageContent variants + preview
// canvas layouts (nothing new is invented):
//   component   -> docs page (max-w-3xl) + compact centered canvas
//   medium      -> app page (max-w-6xl)  + roomy centered viewport canvas
//   application -> full-width page        + full-height application canvas
type SurfaceTier = NonNullable<ComponentEntry["surface"]>

function surfaceTier(entry: ComponentEntry): SurfaceTier {
  if (entry.surface) return entry.surface
  return entry.category === "Blocks" || entry.category === "Experiments"
    ? "application"
    : "component"
}

const PAGE_VARIANT_BY_SURFACE = {
  component: "docs",
  medium: "app",
  application: "marketing",
} as const

const DEFAULT_LAYOUT_BY_SURFACE = {
  component: "center",
  medium: "viewport",
  application: "application",
} as const
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { CardContent } from "@/components/ui/card"
import { Canvas } from "@/components/ui/canvas"
import { CanvasGrid } from "@/components/ui/canvas-grid"
import { CanvasPreviewControls } from "@/components/ui/canvas-preview"
import {
  Sidebar,
  SidebarBrand,
  SidebarBrandLabel,
  SidebarBrandMark,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Page, PageContent, PageScroll } from "@/components/ui/page"
import { SearchInput } from "@/components/ui/input"
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/components/ui/page-header"
import {
  Section,
  SectionActions,
  SectionDescription,
  SectionHeader,
  SectionHeading,
  SectionTitle,
} from "@/components/ui/section"
import { CodeBlock } from "@/components/code-block"
import { ModeToggle } from "@/components/mode-toggle"
import { ErrorBoundary } from "@/components/error-boundary"
import { Favicon } from "@/components/ui/favicon"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Kbd } from "@/components/ui/kbd"

const alphabeticalRegistry = [...componentRegistry].sort((left, right) =>
  left.name.localeCompare(right.name),
)
const alphabeticalBlocks = [...blockRegistry].sort((left, right) =>
  left.name.localeCompare(right.name),
)
const alphabeticalExperiments = [...experimentRegistry].sort((left, right) =>
  left.name.localeCompare(right.name),
)
const alphabeticalPreviewTools = [...previewRegistry].sort((left, right) =>
  left.name.localeCompare(right.name),
)
const defaultComponentSlug = alphabeticalRegistry[0].slug

function useHashRoute() {
  const [hash, setHash] = useState(
    () => window.location.hash.replace(/^#\/?/, "") || defaultComponentSlug,
  )

  useEffect(() => {
    const onChange = () =>
      setHash(window.location.hash.replace(/^#\/?/, "") || defaultComponentSlug)
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

function canScrollWithin(
  target: EventTarget | null,
  boundary: Element,
  horizontal: boolean,
  delta: number,
) {
  if (!(target instanceof Element)) return false

  for (
    let element: Element | null = target;
    element && element !== boundary;
    element = element.parentElement
  ) {
    const style = getComputedStyle(element)
    const overflow = horizontal ? style.overflowX : style.overflowY
    if (!/(auto|scroll|overlay)/.test(overflow)) continue

    const position = horizontal ? element.scrollLeft : element.scrollTop
    const extent = horizontal ? element.scrollWidth : element.scrollHeight
    const viewport = horizontal ? element.clientWidth : element.clientHeight
    if (delta < 0 ? position > 0 : position < extent - viewport) return true
  }

  return false
}

function DemoSandbox({
  children,
  name,
  layout = "center",
  background,
  ownsCanvas = false,
}: {
  children: ReactNode
  name: string
  layout?: ComponentExample["layout"]
  background?: ComponentExample["background"]
  ownsCanvas?: boolean
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [grid, setGrid] = useState(false)
  const Surface = ownsCanvas ? "div" : Canvas

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const preventScrollHandoff = (event: WheelEvent) => {
      if (event.ctrlKey || event.defaultPrevented) return

      const horizontal = Math.abs(event.deltaX) >= Math.abs(event.deltaY)
      const delta = horizontal ? event.deltaX : event.deltaY
      if (delta && !canScrollWithin(event.target, stage, horizontal, delta)) {
        event.preventDefault()
      }
    }

    stage.addEventListener("wheel", preventScrollHandoff, { passive: false })
    return () => stage.removeEventListener("wheel", preventScrollHandoff)
  }, [])

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
    {!ownsCanvas && <CanvasPreviewControls name={name} grid={grid} onGridChange={setGrid} />}
    <Surface
      ref={stageRef}
      {...(ownsCanvas ? {} : { layout, background })}
      className={ownsCanvas ? "showcase-stage flex min-w-0 w-full flex-col" : "showcase-stage"}
      data-scroll-boundary
      onClickCapture={(event) => {
        if (!(event.target instanceof Element)) return

        const link = event.target.closest("a[href]")
        if (link) {
          event.preventDefault()
        }
      }}
      onSubmitCapture={(event) => {
        event.preventDefault()
      }}
    >
      {!ownsCanvas && <CanvasGrid active={grid} />}
      {children}
    </Surface>
    </div>
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
  const preview = (
    <DemoSandbox key={resetKey} name={example.name} layout={example.layout} background={example.background} ownsCanvas={example.ownsCanvas}>
      <ErrorBoundary title={`${example.name} failed to render`}>
        <example.Demo />
      </ErrorBoundary>
    </DemoSandbox>
  )
  const header = (
    <SectionHeader className="flex-row items-start gap-4">
      <SectionHeading>
        <SectionTitle className="showcase-example__title flex min-h-9 items-center">
          {example.name}
        </SectionTitle>
        {example.description ? (
          <SectionDescription>{example.description}</SectionDescription>
        ) : null}
      </SectionHeading>
        <SectionActions>
          <ButtonGroup aria-label={`${example.name} preview controls`}>
            <ButtonGroup>
            <TabsList iconOnly aria-label={`${example.name} view`}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex h-full">
                      <TabsTrigger value="preview" aria-label="Preview">
                        <EyeIcon />
                      </TabsTrigger>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Preview</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex h-full">
                      <TabsTrigger value="code" aria-label="Code">
                        <CodeIcon />
                      </TabsTrigger>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Code</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TabsList>
            </ButtonGroup>
            <ButtonGroup>
            <Button
              variant="secondary"
              size="icon-lg"
              aria-label="Reset example"
              onClick={() => setResetKey((value) => value + 1)}
            >
              <RotateCcwIcon />
            </Button>
            </ButtonGroup>
          </ButtonGroup>
        </SectionActions>
    </SectionHeader>
  )

  return (
    <Section className="showcase-example" id={id}>
      <Tabs
        value={view}
        onValueChange={(value) => {
          setView(value)
          if (value === "code") setResetKey((current) => current + 1)
        }}
        className="showcase-example__tabs gap-6"
      >
        {header}
        <CardContent className="showcase-example__panels">
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
            {code ? (
              <CodeBlock code={code} className="showcase-example__code-block" />
            ) : (
              <Alert variant="destructive" className="m-6 w-auto">
                <TriangleAlertIcon />
                <AlertTitle>No generated code for this example</AlertTitle>
                <AlertDescription>
                  Run <Kbd>node scripts/generate-showcase-code.mjs</Kbd> to
                  regenerate {componentSlug}:{example.name}.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Section>
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
  const [sort, setSort] = useState<"alphabetical" | "sections">("alphabetical")
  const { isMobile, setOpenMobile } = useSidebar()
  const normalizedQuery = query.trim().toLowerCase()
  const matches = (name: string) =>
    name.toLowerCase().includes(normalizedQuery)

  const visibleGroups = groupedRegistry
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => matches(item.name)),
    }))
    .filter((group) => group.items.length > 0)

  const alphabeticalItems = alphabeticalRegistry.filter((item) =>
    matches(item.name),
  )
  const alphabeticalBlockItems = alphabeticalBlocks.filter((item) =>
    matches(item.name),
  )
  const alphabeticalExperimentItems = alphabeticalExperiments.filter((item) =>
    matches(item.name),
  )
  const alphabeticalPreviewItems = alphabeticalPreviewTools.filter((item) =>
    matches(item.name),
  )

  const renderItem = (component: (typeof registry)[number]) => (
    <SidebarMenuItem key={component.slug}>
      <SidebarMenuButton
        type="button"
        isActive={activeSlug === component.slug}
        onClick={() => {
          onNavigate(component.slug)
          if (isMobile) setOpenMobile(false)
        }}
      >
        {component.name}
      </SidebarMenuButton>
    </SidebarMenuItem>
  )

  return (
    <>
      <SidebarHeader className="h-(--showcase-header-row-height) min-h-0 flex-row items-center justify-between px-4 py-0">
        <SidebarBrand>
          <SidebarBrandMark>
            <PaletteIcon className="size-5" />
          </SidebarBrandMark>
          <SidebarBrandLabel className="text-base font-semibold">
            OneDS
          </SidebarBrandLabel>
        </SidebarBrand>
        <div
          className="flex shrink-0 items-center gap-1"
          role="toolbar"
          aria-label="Site controls"
        >
          <Button asChild variant="ghost" size="icon" aria-label="GitHub">
            <a
              href="https://github.com/bhna_microsoft/oneds"
              target="_blank"
              rel="noreferrer"
            >
              <Favicon domain="github.com" alt="" className="dark:invert" />
            </a>
          </Button>
          <ModeToggle />
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <Separator variant="faded" />
      <div className="flex min-h-0 flex-1 flex-col pt-(--showcase-shell-content-inset)">
        <div className="flex items-center gap-2 px-4">
          <SearchInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search library"
            aria-label="Search library"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0 rounded-full"
            aria-label={
              sort === "alphabetical" ? "Group by section" : "Sort alphabetically"
            }
            onClick={() =>
              setSort((current) =>
                current === "alphabetical" ? "sections" : "alphabetical",
              )
            }
          >
            {sort === "alphabetical" ? <ArrowDownAZIcon /> : <LayoutListIcon />}
          </Button>
        </div>
        {/* Bottom padding matches the scroll fade, so the final item stays clear. */}
        <SidebarContent
          className="gap-7 px-2 pt-4 pb-6"
          role="navigation"
          aria-label="OneDS library"
        >
          {sort === "alphabetical" ? (
            <>
              {alphabeticalBlockItems.length > 0 ? (
                <SidebarGroup>
                  <SidebarGroupLabel>Blocks</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {alphabeticalBlockItems.map(renderItem)}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ) : null}
              {alphabeticalExperimentItems.length > 0 ? (
                <SidebarGroup>
                  <SidebarGroupLabel>Experiments</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {alphabeticalExperimentItems.map(renderItem)}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ) : null}
              {alphabeticalPreviewItems.length > 0 ? (
                <SidebarGroup>
                  <SidebarGroupLabel>Preview Tools</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {alphabeticalPreviewItems.map(renderItem)}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ) : null}
              {alphabeticalItems.length > 0 ? (
                <SidebarGroup>
                  <SidebarGroupLabel>Components</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>{alphabeticalItems.map(renderItem)}</SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ) : null}
            </>
          ) : (
            visibleGroups.map((group) => (
              <SidebarGroup key={group.category}>
                <SidebarGroupLabel>{group.category}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>{group.items.map(renderItem)}</SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))
          )}
        </SidebarContent>
      </div>
    </>
  )
}

function ComponentPage({ slug }: { slug: string }) {
  const entry = registry.find((component) => component.slug === slug) ?? registry[0]
  const tier = surfaceTier(entry)
  const installCommand =
    entry.installCommand === undefined
      ? `npx shadcn@latest add ${entry.slug}`
      : entry.installCommand
  const defaultExample = {
    name: "Default",
    Demo: entry.Demo,
    code: entry.code,
    layout: DEFAULT_LAYOUT_BY_SURFACE[tier],
    ownsCanvas: entry.ownsCanvas,
  }
  const examples: ComponentExample[] = [
    entry.defaultExampleHeader
      ? { ...defaultExample, header: entry.defaultExampleHeader.style, description: entry.defaultExampleHeader.description }
      : defaultExample,
    ...(entry.examples ?? []),
  ]

  return (
    <>
      <PageHeader className="showcase-component__header">
        <PageHeaderContent className="w-full">
          <PageHeaderTitle className="showcase-component__title">
            {entry.name}
          </PageHeaderTitle>
          <PageHeaderDescription className="showcase-component__description">
            {entry.description}
          </PageHeaderDescription>
          {installCommand ? (
            <CodeBlock
              code={installCommand}
              showLineNumbers={false}
              className="showcase-component__command"
            />
          ) : null}
        </PageHeaderContent>
      </PageHeader>

      <div className="showcase-component__examples">
        {examples.map((example) => (
          <ExampleSection
            key={example.name}
            componentSlug={entry.slug}
            example={example}
          />
        ))}
      </div>
    </>
  )
}

function App() {
  const [slug, navigate] = useHashRoute()
  const scrollRef = useRef<HTMLDivElement>(null)
  const activeEntry = registry.find((entry) => entry.slug === slug) ?? registry[0]
  const contentKind =
    activeEntry.category === "Blocks"
      ? "block"
      : activeEntry.category === "Experiments"
        ? "experiment"
        : "component"
  const pageVariant = PAGE_VARIANT_BY_SURFACE[surfaceTier(activeEntry)]

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "auto" })
  }, [slug])

  return (
    <SidebarProvider
      className="showcase-app"
      style={
        {
          "--sidebar-width": "var(--showcase-sidebar-width)",
        } as CSSProperties
      }
    >
      <Sidebar collapsible="hidden" edge="faded">
        <ComponentNavigation activeSlug={slug} onNavigate={navigate} />
      </Sidebar>

      <SidebarInset className="min-h-0 overflow-hidden">
        <SidebarTrigger placement="floating" />
        <Page>
          <PageScroll ref={scrollRef}>
            <PageContent
              variant={pageVariant}
              key={slug}
              className="showcase-page-content"
              data-content-kind={contentKind}
            >
              <ComponentPage slug={slug} />
            </PageContent>
          </PageScroll>
        </Page>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
