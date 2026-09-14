import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import {
  AlertCircleIcon,
  ArrowDownAZIcon,
  BoxesIcon,
  CodeIcon,
  EyeIcon,
  SortIcon,
  PaletteIcon,
  RotateCcwIcon,
} from "@/components/ui/icons"

import {
  blockRegistry,
  componentRegistry,
  experimentRegistry,
  previewRegistry,
  groupedRegistry,
  buildOrderRegistry,
  registry,
} from "@/showcase/registry"
import { generatedExampleCode } from "@/showcase/generated-example-code"
import {
  DesignRulesPage,
  designRulesPageHeader,
} from "@/showcase/design-rules-page"
import {
  AgentCatalogPage,
  agentCatalogPageHeader,
} from "@/showcase/agent-catalog-page"
import { NotesPage, notesPageHeader } from "@/showcase/notes-page"
import { ShowcasePageHeader } from "@/showcase/showcase-page-header"
import type { ComponentEntry, ComponentExample } from "@/showcase/types"

type SurfaceTier = NonNullable<ComponentEntry["surface"]>

function surfaceTier(entry: ComponentEntry): SurfaceTier {
  if (entry.surface) return entry.surface
  return entry.category === "Blocks" || entry.category === "Experiments"
    ? "application"
    : "default"
}

const PAGE_VARIANT_BY_SURFACE = {
  default: "app",
  application: "marketing",
} as const

const DEFAULT_LAYOUT_BY_SURFACE = {
  default: "center",
  application: "application",
} as const
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Item, ItemContent, ItemTitle } from "@/components/ui/item"
import { Canvas } from "@/components/ui/canvas"
import { CanvasGrid } from "@/components/ui/canvas-grid"
import { CanvasPreviewControls, CanvasPreviewFrame } from "@/components/ui/canvas-preview"
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
  SidebarHeaderActions,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Page, PageContent, PageScroll } from "@/components/ui/page"
import { SearchInput } from "@/components/ui/input"
import {
  Section,
  SectionActions,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionHeading,
  SectionTitle,
} from "@/components/ui/section"
import { CodeBlock } from "@/components/code-block"
import { ModeToggle } from "@/components/mode-toggle"
import { MaterialTheme } from "@/components/ui/material-theme"
import { ErrorBoundary } from "@/components/error-boundary"
import { Favicon } from "@/components/ui/favicon"
import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from "@/components/ui/alert"
import { Kbd } from "@/components/ui/kbd"
import type { HangOffset } from "@/lib/hang"

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
const wipSidebarSlugs = new Set(["chart", "carousel", "persona", "table-of-contents"])

type SidebarNavigationItem = Pick<ComponentEntry, "slug" | "name"> & {
  wip?: boolean
}

function withSidebarMetadata(
  component: Pick<ComponentEntry, "slug" | "name">,
): SidebarNavigationItem {
  return {
    ...component,
    wip: wipSidebarSlugs.has(component.slug),
  }
}

function SidebarWipBadge({ show = false }: { show?: boolean }) {
  if (!show) return null

  return (
    <Badge
      variant="primary"
      className="ms-auto me-(--showcase-sidebar-wip-badge-edge-offset) h-(--showcase-sidebar-wip-badge-height) min-w-(--showcase-sidebar-wip-badge-height) rounded-(--showcase-sidebar-wip-badge-radius) px-(--showcase-sidebar-wip-badge-padding-inline) text-(length:--text-caption-size) leading-(--text-caption-leading)"
    >
      WIP
    </Badge>
  )
}

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
    <CanvasPreviewFrame controls={!ownsCanvas && <CanvasPreviewControls name={name} grid={grid} onGridChange={setGrid} />}>
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
    </CanvasPreviewFrame>
  )
}

function ExampleSection({
  componentSlug,
  example,
  hang = true,
}: {
  componentSlug: string
  example: ComponentExample
  hang?: HangOffset
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
          <ButtonGroup shape="square" aria-label={`${example.name} preview controls`}>
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
              variant="tertiary"
              size="icon"
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
        <SectionContent hang={hang} className="showcase-example__panels">
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
              <Alert variant="error" className="m-6 w-auto">
                <AlertIcon><AlertCircleIcon /></AlertIcon>
                <AlertContent>
                  <AlertTitle>No generated code for this example</AlertTitle>
                  <AlertDescription>
                    Run <Kbd>node scripts/generate-showcase-code.mjs</Kbd> to
                    regenerate {componentSlug}:{example.name}.
                  </AlertDescription>
                </AlertContent>
              </Alert>
            )}
          </TabsContent>
        </SectionContent>
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
  const [sort, setSort] = useState<"build" | "alphabetical" | "sections">("build")
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

  const buildGroups = buildOrderRegistry
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

  const renderItem = (component: SidebarNavigationItem) => (
    <SidebarMenuItem key={component.slug} data-showcase-nav-item={component.slug}>
      <Item
        compact
        asChild
        variant={activeSlug === component.slug ? "muted" : "default"}
      >
        <button
          type="button"
          aria-pressed={activeSlug === component.slug}
          onClick={() => {
            onNavigate(component.slug)
            if (isMobile) setOpenMobile(false)
          }}
        >
          <ItemContent>
            <ItemTitle>{component.name}</ItemTitle>
          </ItemContent>
          <SidebarWipBadge show={component.wip} />
        </button>
      </Item>
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
        <SidebarHeaderActions
          role="toolbar"
          aria-label="Site controls"
        >
          <Button asChild variant="ghost" size="icon" aria-label="GitHub">
            <a
              href="https://github.com/bhna_microsoft/oneds"
              target="_blank"
              rel="noreferrer"
            >
              <Favicon domain="github.com" alt="" />
            </a>
          </Button>
          <ModeToggle />
          <SidebarTrigger />
        </SidebarHeaderActions>
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
            variant="tertiary"
            size="icon"
            className="shrink-0 rounded-full"
            aria-label={
              sort === "build"
                ? "Sort alphabetically"
                : sort === "alphabetical"
                  ? "Group by section"
                  : "Sort by build order"
            }
            onClick={() =>
              setSort((current) =>
                current === "build"
                  ? "alphabetical"
                  : current === "alphabetical"
                    ? "sections"
                    : "build",
              )
            }
          >
            {sort === "build" ? (
              <ArrowDownAZIcon />
            ) : sort === "alphabetical" ? (
              <SortIcon />
            ) : (
              <BoxesIcon />
            )}
          </Button>
        </div>
        {/* Bottom padding matches the scroll fade, so the final item stays clear. */}
        <SidebarContent
          className="gap-7 pt-4 pb-6"
          role="navigation"
          aria-label="OneDS library"
        >
          {matches("Design Rules") && (
            <SidebarGroup>
              <SidebarGroupLabel>Reference</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>{renderItem({ slug: "rules", name: "Design Rules" })}</SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
          {matches("Agent Catalog") && (
            <SidebarGroup>
              <SidebarGroupLabel>Reference</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>{renderItem({ slug: "catalog", name: "Agent Catalog" })}</SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
          {matches("Notes") && (
            <SidebarGroup>
              <SidebarGroupLabel>Notes</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>{renderItem({ slug: "notes", name: "Notes" })}</SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
          {sort === "build" ? (
            buildGroups.map((group) => (
              <SidebarGroup key={group.category}>
                <SidebarGroupLabel>{group.category}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>{group.items.map(withSidebarMetadata).map(renderItem)}</SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))
          ) : sort === "alphabetical" ? (
            <>
              {alphabeticalBlockItems.length > 0 ? (
                <SidebarGroup>
                  <SidebarGroupLabel>Blocks</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {alphabeticalBlockItems.map(withSidebarMetadata).map(renderItem)}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ) : null}
              {alphabeticalExperimentItems.length > 0 ? (
                <SidebarGroup>
                  <SidebarGroupLabel>Experiments</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {alphabeticalExperimentItems.map(withSidebarMetadata).map(renderItem)}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ) : null}
              {alphabeticalPreviewItems.length > 0 ? (
                <SidebarGroup>
                  <SidebarGroupLabel>Preview Tools</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {alphabeticalPreviewItems.map(withSidebarMetadata).map(renderItem)}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ) : null}
              {alphabeticalItems.length > 0 ? (
                <SidebarGroup>
                  <SidebarGroupLabel>Components</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>{alphabeticalItems.map(withSidebarMetadata).map(renderItem)}</SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ) : null}
            </>
          ) : (
            visibleGroups.map((group) => (
              <SidebarGroup key={group.category}>
                <SidebarGroupLabel>{group.category}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>{group.items.map(withSidebarMetadata).map(renderItem)}</SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))
          )}
        </SidebarContent>
      </div>
    </>
  )
}

function ComponentPage({ entry }: { entry: ComponentEntry }) {
  const tier = surfaceTier(entry)

  const defaultExample = {
    name: entry.defaultExampleName ?? "Default",
    Demo: entry.Demo,
    code: entry.codeSource === "complete"
      ? generatedExampleCode[`${entry.slug}:${entry.defaultExampleName ?? "Default"}`]
      : entry.code,
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
    <div className="showcase-component__examples">
      {examples.map((example) => (
        <ExampleSection
          key={example.name}
          componentSlug={entry.slug}
          example={example}
          hang={example.hang ?? entry.hang ?? true}
        />
      ))}
    </div>
  )
}

function App() {
  const [slug, navigate] = useHashRoute()
  const scrollRef = useRef<HTMLDivElement>(null)
  const isRulesPage = slug === "rules"
  const isCatalogPage = slug === "catalog"
  const isNotesPage = slug === "notes"
  const isCustomPage = isRulesPage || isCatalogPage || isNotesPage
  const activeEntry = registry.find((entry) => entry.slug === slug) ?? registry[0]
  const activePageHeader = isRulesPage
    ? designRulesPageHeader
    : isCatalogPage
      ? agentCatalogPageHeader
      : isNotesPage
        ? notesPageHeader
        : { title: activeEntry.name, description: activeEntry.description }
  const activeInstallCommand = isCustomPage
    ? null
    : activeEntry.installCommand === undefined
      ? `npx shadcn@latest add ${activeEntry.slug}`
      : activeEntry.installCommand
  const contentKind = isCustomPage
    ? "reference"
    : activeEntry.category === "Blocks"
      ? "block"
      : activeEntry.category === "Experiments"
        ? "experiment"
        : "component"
  const pageVariant = isCustomPage ? "app" : PAGE_VARIANT_BY_SURFACE[surfaceTier(activeEntry)]

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
      <MaterialTheme asChild data-theme-scope="showcase-navigation">
        <Sidebar collapsible="hidden" edge="faded" placement="floating">
          <ComponentNavigation activeSlug={slug} onNavigate={navigate} />
        </Sidebar>
      </MaterialTheme>

      <SidebarInset className="min-h-0 overflow-hidden">
        <SidebarTrigger placement="floating" />
        <Page>
          <PageScroll ref={scrollRef}>
            <ShowcasePageHeader
              key={`header-${slug}`}
              title={activePageHeader.title}
              description={activePageHeader.description}
              command={activeInstallCommand}
            />
            <PageContent
              variant={pageVariant}
              key={slug}
              className="showcase-page-content"
              data-content-kind={isCustomPage ? "reference" : contentKind}
              data-showcase-surface={isCustomPage ? "default" : surfaceTier(activeEntry)}
            >
              {isRulesPage ? (
                <DesignRulesPage />
              ) : isCatalogPage ? (
                <AgentCatalogPage />
              ) : isNotesPage ? (
                <NotesPage />
              ) : (
                <ComponentPage entry={activeEntry} />
              )}
            </PageContent>
          </PageScroll>
        </Page>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
