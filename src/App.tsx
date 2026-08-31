import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import {
  ArrowDownAZIcon,
  LayoutListIcon,
  PaletteIcon,
  RotateCcwIcon,
} from "lucide-react"

import { groupedRegistry, registry } from "@/showcase/registry"
import { generatedExampleCode } from "@/showcase/generated-example-code"
import type { ComponentExample } from "@/showcase/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { ItemActions } from "@/components/ui/item"
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
  useSidebar,
} from "@/components/ui/sidebar"
import {
  SiteHeader,
  SiteHeaderContainer,
  SiteHeaderGroup,
} from "@/components/ui/site-header"
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
  SectionDescription,
  SectionHeader,
  SectionHeading,
  SectionTitle,
} from "@/components/ui/section"
import { CodeBlock } from "@/components/code-block"
import { ModeToggle } from "@/components/mode-toggle"
import { Favicon } from "@/components/ui/favicon"

const alphabeticalRegistry = [...registry].sort((left, right) =>
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

function DemoSandbox({
  children,
  layout = "center",
}: {
  children: ReactNode
  layout?: ComponentExample["layout"]
}) {
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
        }
      }}
      onSubmitCapture={(event) => {
        event.preventDefault()
      }}
    >
      {children}
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
      size="default"
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
    <Section className="showcase-example" id={id}>
      <SectionHeader>
        <SectionHeading>
          <SectionTitle className="showcase-example__title">
            {example.name}
          </SectionTitle>
          {example.description ? (
            <SectionDescription>{example.description}</SectionDescription>
          ) : null}
        </SectionHeading>
      </SectionHeader>
      <Tabs
        value={view}
        onValueChange={(value) => {
          setView(value)
          if (value === "code") setResetKey((current) => current + 1)
        }}
        className="showcase-example__tabs"
      >
        <ItemActions className="showcase-example__toolbar">
          <TabsList aria-label={`${example.name} view`}>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          {reset}
        </ItemActions>
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
            <CodeBlock code={code} className="showcase-example__code-block" />
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
      <SidebarHeader className="h-(--showcase-header-row-height) min-h-0 items-stretch justify-center px-4 py-0">
        <SidebarBrand>
          <SidebarBrandMark>
            <PaletteIcon className="size-5" />
          </SidebarBrandMark>
          <SidebarBrandLabel className="text-base font-semibold">
            OneDS
          </SidebarBrandLabel>
        </SidebarBrand>
      </SidebarHeader>
      <Separator variant="faded" />
      <div className="flex min-h-0 flex-1 flex-col pt-(--showcase-shell-content-inset)">
        <div className="flex items-center gap-2 px-4">
          <SearchInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search components"
            aria-label="Search components"
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
          aria-label="Components"
        >
          {sort === "alphabetical" ? (
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>{alphabeticalItems.map(renderItem)}</SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
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
              label="Install"
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
      <SiteHeader
        variant="clustered"
        align="end"
        className="absolute inset-x-0 top-0"
      >
        <SiteHeaderContainer>
          <SiteHeaderGroup role="toolbar" aria-label="Site controls">
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
          </SiteHeaderGroup>
        </SiteHeaderContainer>
      </SiteHeader>

      <Sidebar collapsible="none" edge="faded">
        <ComponentNavigation activeSlug={slug} onNavigate={navigate} />
      </Sidebar>

      <SidebarInset className="min-h-0 overflow-hidden">
        <Page>
          <PageScroll ref={scrollRef}>
            <PageContent
              variant="docs"
              key={slug}
              className="showcase-page-content"
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
