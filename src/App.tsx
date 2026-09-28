import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import {
  AlertCircleIcon,
  ArrowDownAZIcon,
  BoxesIcon,
  CodeIcon,
  EyeIcon,
  SortIcon,
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
  AgentCatalogToolbar,
  DownloadManifestButton,
  agentCatalogPageHeader,
  filterAgentCatalogEntries,
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
  NavigationPane,
  NavigationPaneBrand,
  NavigationPaneBrandLabel,
  NavigationPaneBrandMark,
  NavigationPaneContent,
  NavigationPaneFooter,
  NavigationPaneGroup,
  NavigationPaneGroupContent,
  NavigationPaneGroupLabel,
  NavigationPaneHeader,
  NavigationPaneHeaderActions,
  NavigationPaneInset,
  NavigationPaneMenu,
  NavigationPaneMenuItem,
  NavigationPaneProvider,
  NavigationPaneSearch,
  NavigationPaneTrigger,
  useNavigationPane,
} from "@/components/ui/navigation-pane"
import { Page, PageContent, PageScroll } from "@/components/ui/page"
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
const wipNavigationPaneSlugs = new Set(["chart", "carousel", "persona", "table-of-contents"])

type NavigationPaneNavigationItem = Pick<ComponentEntry, "slug" | "name"> & {
  wip?: boolean
}

function withNavigationPaneMetadata(
  component: Pick<ComponentEntry, "slug" | "name">,
): NavigationPaneNavigationItem {
  return {
    ...component,
    wip: wipNavigationPaneSlugs.has(component.slug),
  }
}

function NavigationPaneWipBadge({ show = false }: { show?: boolean }) {
  if (!show) return null

  return (
    <Badge
      variant="primary"
      className="ms-auto me-(--showcase-navigation-pane-wip-badge-edge-offset) h-(--showcase-navigation-pane-wip-badge-height) min-w-(--showcase-navigation-pane-wip-badge-height) rounded-(--showcase-navigation-pane-wip-badge-radius) px-(--showcase-navigation-pane-wip-badge-padding-inline) text-(length:--text-caption-size) leading-(--text-caption-leading)"
    >
      WIP
    </Badge>
  )
}

function useHashRoute() {
  const parseRoute = () => {
    const raw = window.location.hash.replace(/^#\/?/, "")
    const standaloneMatch = raw.match(/^standalone\/([^/]+)(?:\/(.+))?$/)
    if (standaloneMatch) {
      return {
        slug: standaloneMatch[1] || defaultComponentSlug,
        exampleName: standaloneMatch[2]
          ? decodeURIComponent(standaloneMatch[2])
          : undefined,
        standalone: true as const,
      }
    }
    return { slug: raw || defaultComponentSlug, exampleName: undefined, standalone: false as const }
  }

  const [route, setRoute] = useState(parseRoute)

  useEffect(() => {
    const onChange = () => setRoute(parseRoute())
    window.addEventListener("hashchange", onChange)
    return () => window.removeEventListener("hashchange", onChange)
  }, [])

  const navigate = (slug: string) => {
    window.location.hash = `/${slug}`
  }

  return [route, navigate] as const
}

// The toolbar's "open in new tab" action targets this route, which renders
// just the one example full-bleed with no showcase chrome.
function standaloneHref(componentSlug: string, exampleName: string) {
  return `#/standalone/${componentSlug}/${encodeURIComponent(exampleName)}`
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
  standaloneHref,
}: {
  children: ReactNode
  name: string
  layout?: ComponentExample["layout"]
  background?: ComponentExample["background"]
  ownsCanvas?: boolean
  standaloneHref?: string
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
    <CanvasPreviewFrame controls={!ownsCanvas && <CanvasPreviewControls name={name} grid={grid} onGridChange={setGrid} standaloneHref={standaloneHref} />}>
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
  const standaloneUrl = new URL(window.location.href)
  standaloneUrl.hash = standaloneHref(componentSlug, example.name)
  const preview = (
    <DemoSandbox
      key={resetKey}
      name={example.name}
      layout={example.layout}
      background={example.background}
      ownsCanvas={example.ownsCanvas}
      standaloneHref={standaloneUrl.toString()}
    >
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
  const { isMobile, setOpenMobile } = useNavigationPane()
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

  const renderItem = (component: NavigationPaneNavigationItem) => (
    <NavigationPaneMenuItem key={component.slug} data-showcase-nav-item={component.slug}>
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
          <NavigationPaneWipBadge show={component.wip} />
        </button>
      </Item>
    </NavigationPaneMenuItem>
  )

  return (
    <>
      <NavigationPaneHeader className="h-(--showcase-header-row-height) min-h-0 flex-row items-center justify-between px-4 py-0">
        <NavigationPaneBrand>
          <NavigationPaneBrandMark>
            <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="size-5" />
          </NavigationPaneBrandMark>
          <NavigationPaneBrandLabel className="text-lg font-semibold">
            OneDS
          </NavigationPaneBrandLabel>
        </NavigationPaneBrand>
        <NavigationPaneHeaderActions
          role="toolbar"
          aria-label="Site controls"
        >
          <ModeToggle />
          <NavigationPaneTrigger />
        </NavigationPaneHeaderActions>
      </NavigationPaneHeader>
      <Separator variant="faded" />
      <div className="flex min-h-0 flex-1 flex-col pt-(--showcase-shell-content-inset)">
        <div className="flex items-center gap-2 px-4">
          <NavigationPaneSearch
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
        <NavigationPaneContent
          className="gap-5 pt-4 pb-6"
          role="navigation"
          aria-label="OneDS library"
        >
          {(matches("Design Rules") || matches("Agent Catalog") || matches("Notes")) && (
            <NavigationPaneGroup>
              <NavigationPaneGroupLabel>Reference</NavigationPaneGroupLabel>
              <NavigationPaneGroupContent>
                <NavigationPaneMenu>
                  {matches("Design Rules") && renderItem({ slug: "rules", name: "Design Rules" })}
                  {matches("Agent Catalog") && renderItem({ slug: "catalog", name: "Agent Catalog" })}
                  {matches("Notes") && renderItem({ slug: "notes", name: "Notes" })}
                </NavigationPaneMenu>
              </NavigationPaneGroupContent>
            </NavigationPaneGroup>
          )}
          {sort === "build" ? (
            buildGroups.map((group) => (
              <NavigationPaneGroup key={group.category}>
                <NavigationPaneGroupLabel>{group.category}</NavigationPaneGroupLabel>
                <NavigationPaneGroupContent>
                  <NavigationPaneMenu>{group.items.map(withNavigationPaneMetadata).map(renderItem)}</NavigationPaneMenu>
                </NavigationPaneGroupContent>
              </NavigationPaneGroup>
            ))
          ) : sort === "alphabetical" ? (
            <>
              {alphabeticalBlockItems.length > 0 ? (
                <NavigationPaneGroup>
                  <NavigationPaneGroupLabel>Blocks</NavigationPaneGroupLabel>
                  <NavigationPaneGroupContent>
                    <NavigationPaneMenu>
                      {alphabeticalBlockItems.map(withNavigationPaneMetadata).map(renderItem)}
                    </NavigationPaneMenu>
                  </NavigationPaneGroupContent>
                </NavigationPaneGroup>
              ) : null}
              {alphabeticalExperimentItems.length > 0 ? (
                <NavigationPaneGroup>
                  <NavigationPaneGroupLabel>Experiments</NavigationPaneGroupLabel>
                  <NavigationPaneGroupContent>
                    <NavigationPaneMenu>
                      {alphabeticalExperimentItems.map(withNavigationPaneMetadata).map(renderItem)}
                    </NavigationPaneMenu>
                  </NavigationPaneGroupContent>
                </NavigationPaneGroup>
              ) : null}
              {alphabeticalPreviewItems.length > 0 ? (
                <NavigationPaneGroup>
                  <NavigationPaneGroupLabel>Preview Tools</NavigationPaneGroupLabel>
                  <NavigationPaneGroupContent>
                    <NavigationPaneMenu>
                      {alphabeticalPreviewItems.map(withNavigationPaneMetadata).map(renderItem)}
                    </NavigationPaneMenu>
                  </NavigationPaneGroupContent>
                </NavigationPaneGroup>
              ) : null}
              {alphabeticalItems.length > 0 ? (
                <NavigationPaneGroup>
                  <NavigationPaneGroupLabel>Components</NavigationPaneGroupLabel>
                  <NavigationPaneGroupContent>
                    <NavigationPaneMenu>{alphabeticalItems.map(withNavigationPaneMetadata).map(renderItem)}</NavigationPaneMenu>
                  </NavigationPaneGroupContent>
                </NavigationPaneGroup>
              ) : null}
            </>
          ) : (
            visibleGroups.map((group) => (
              <NavigationPaneGroup key={group.category}>
                <NavigationPaneGroupLabel>{group.category}</NavigationPaneGroupLabel>
                <NavigationPaneGroupContent>
                  <NavigationPaneMenu>{group.items.map(withNavigationPaneMetadata).map(renderItem)}</NavigationPaneMenu>
                </NavigationPaneGroupContent>
              </NavigationPaneGroup>
            ))
          )}
        </NavigationPaneContent>
      </div>
      <NavigationPaneFooter>
        <Button asChild variant="ghost" className="w-full justify-start rounded-(--item-compact-radius)">
          <a
            href="https://github.com/bhna_microsoft/oneds"
            target="_blank"
            rel="noreferrer"
          >
            <Favicon domain="github.com" alt="" />
            GitHub
          </a>
        </Button>
      </NavigationPaneFooter>
    </>
  )
}

function getComponentExamples(entry: ComponentEntry): ComponentExample[] {
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
  return [
    entry.defaultExampleHeader
      ? { ...defaultExample, header: entry.defaultExampleHeader.style, description: entry.defaultExampleHeader.description }
      : defaultExample,
    ...(entry.examples ?? []),
  ]
}

function ComponentPage({ entry }: { entry: ComponentEntry }) {
  const examples = getComponentExamples(entry)

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

// Reached via the toolbar's "open in new tab" action: the one example,
// full-bleed, with none of the showcase shell (no nav pane, no page header).
function StandaloneDemoPage({
  entry,
  exampleName,
}: {
  entry: ComponentEntry
  exampleName?: string
}) {
  const examples = getComponentExamples(entry)
  const example =
    examples.find((item) => item.name === exampleName) ?? examples[0]

  return (
    <div className="h-screen w-screen overflow-hidden">
      <ErrorBoundary title={`${example.name} failed to render`}>
        <example.Demo />
      </ErrorBoundary>
    </div>
  )
}

function App() {
  const [route, navigate] = useHashRoute()
  const { slug, standalone, exampleName } = route
  const [catalogQuery, setCatalogQuery] = useState("")
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
  const catalogVisibleCount = isCatalogPage
    ? filterAgentCatalogEntries(catalogQuery).length
    : 0

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "auto" })
  }, [slug])

  if (standalone) {
    return <StandaloneDemoPage entry={activeEntry} exampleName={exampleName} />
  }

  return (
    <NavigationPaneProvider className="showcase-app">
      <MaterialTheme asChild data-theme-scope="showcase-navigation">
        <NavigationPane collapsible="hidden" edge="faded" placement="floating">
          <ComponentNavigation activeSlug={slug} onNavigate={navigate} />
        </NavigationPane>
      </MaterialTheme>

      <NavigationPaneInset className="min-h-0 overflow-hidden">
        <NavigationPaneTrigger placement="floating" />
        <Page>
          <PageScroll ref={scrollRef}>
            <ShowcasePageHeader
              key={`header-${slug}`}
              title={activePageHeader.title}
              description={activePageHeader.description}
              command={activeInstallCommand}
              compactContent={isCatalogPage ? <DownloadManifestButton compact /> : null}
            >
              {isCatalogPage ? (
                <AgentCatalogToolbar
                  query={catalogQuery}
                  onQueryChange={setCatalogQuery}
                  visibleCount={catalogVisibleCount}
                />
              ) : null}
            </ShowcasePageHeader>
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
                <AgentCatalogPage
                  query={catalogQuery}
                  onQueryChange={setCatalogQuery}
                />
              ) : isNotesPage ? (
                <NotesPage />
              ) : (
                <ComponentPage entry={activeEntry} />
              )}
            </PageContent>
          </PageScroll>
        </Page>
      </NavigationPaneInset>
    </NavigationPaneProvider>
  )
}

export default App
