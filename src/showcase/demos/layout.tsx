import { useState, type ReactNode } from "react"
import {
  ChevronsUpDownIcon,
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
  WifiIcon,
  BellIcon,
  MoonIcon,
  GlobeIcon,
  LinkIcon,
  SettingsIcon,
  UserIcon,
  HomeIcon,
  BookmarkIcon,
  MailIcon,
  ShieldIcon,
  KeyIcon,
  PlusIcon,
  DownloadIcon,
  SearchIcon,
  FilterIcon,
  RocketIcon,
  ListIcon,
  LayoutGridIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  CheckIcon,
  PaletteIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  PlayIcon,
  PauseIcon,
  MousePointer2Icon,
  HeartIcon,
  SparklesIcon,
} from "@/components/ui/icons"

import type { ComponentEntry } from "@/showcase/types"
import { generatedExampleCode } from "@/showcase/generated-example-code"
import { ShowcasePageHeader } from "@/showcase/showcase-page-header"
import { CanvasPreview } from "@/components/ui/canvas-preview"
import { AnnotationLegend } from "@/components/ui/annotation-legend"
import { AnnotationMeasurements, type AnnotationMeasurementTarget } from "@/components/ui/annotation-measurements"
import type { AnnotationKind } from "@/components/ui/annotation"
import { CodeBlock } from "@/components/code-block"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SearchInput } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import {
  ButtonGroup,
  ButtonGroupChoice,
  ButtonGroupChoiceItem,
} from "@/components/ui/button-group"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Container } from "@/components/ui/container"
import { Page, PageBleed, PageContent, PageScroll } from "@/components/ui/page"
import { Stack } from "@/components/ui/stack"
import { Cluster } from "@/components/ui/cluster"
import { Text } from "@/components/ui/text"
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderEyebrow,
  PageHeaderTitle,
} from "@/components/ui/page-header"
import {
  Section,
  SectionActions,
  SectionContent,
  SectionDescription,
  SectionEyebrow,
  SectionHeader,
  SectionHeading,
  SectionTitle,
} from "@/components/ui/section"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarSpacer,
  ToolbarTitle,
} from "@/components/ui/toolbar"

const toolbarMeasurementTargets: AnnotationMeasurementTarget[] = [
  { target: "toolbar", label: "Toolbar", kinds: ["padding", "border"] },
  { target: "primary", label: "Primary group", kinds: ["gap"] },
]

const toolbarVariantMeasurementTargets: AnnotationMeasurementTarget[] = [
  { target: "variants", label: "Variants", kinds: ["gap"] },
  ...(["default", "floating", "muted", "ghost"] as const).flatMap<AnnotationMeasurementTarget>(variant => [
    { target: `toolbar-${variant}`, label: `${variant} toolbar`, kinds: ["padding", "border"] },
    { target: `group-${variant}`, label: `${variant} group`, kinds: ["gap"] },
  ]),
]

function ToolbarPreview({
  name,
  targets = toolbarMeasurementTargets,
  contentClassName = "max-w-xl",
  children,
}: {
  name: string
  targets?: AnnotationMeasurementTarget[]
  contentClassName?: string
  children: ReactNode
}) {
  const kinds: AnnotationKind[] = ["bounds", "padding", "border", "margin", "gap"]
  return (
    <CanvasPreview
      annotationsAvailable
      name={name}
      contentClassName={contentClassName}
      footnote={({ annotations }) => annotations
        ? <AnnotationLegend kinds={kinds.filter(kind => targets.some(target => target.kinds.includes(kind)))} />
        : "Annotations hidden"}
    >
      {({ annotations }) => <>
        <div data-annotate="toolbar-specimen" className="w-full">{children}</div>
        <AnnotationMeasurements active={annotations} targets={targets} />
      </>}
    </CanvasPreview>
  )
}

const tags = Array.from({ length: 12 }).map((_, i) => `v1.2.0-beta.${12 - i}`)

function ClusterWrappingDemo() {
  return (
    <Cluster
      gap="sm"
      className="w-full max-w-md rounded-lg border border-dashed p-3"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          className="flex h-14 min-w-28 flex-1 items-center justify-center rounded-md bg-muted text-sm font-medium"
        >
          Item {index + 1}
        </div>
      ))}
    </Cluster>
  )
}

function ClusterAlignmentDemo() {
  return (
    <Cluster
      gap="sm"
      align="center"
      className="h-32 w-full max-w-md rounded-lg border border-dashed p-3"
    >
      <div className="flex h-12 w-24 items-center justify-center rounded-md bg-muted text-sm font-medium">
        Short
      </div>
      <div className="flex h-24 w-24 items-center justify-center rounded-md bg-muted text-sm font-medium">
        Tall
      </div>
      <div className="flex h-16 w-24 items-center justify-center rounded-md bg-muted text-sm font-medium">
        Medium
      </div>
    </Cluster>
  )
}

function ClusterDistributionDemo() {
  return (
    <Stack gap="md" className="w-full max-w-md">
      {(["start", "center", "between"] as const).map((justify) => (
        <div key={justify} className="space-y-2">
          <p className="text-sm font-medium">
            {justify === "between"
              ? "Space between"
              : justify === "center"
                ? "Center"
                : "Start"}
          </p>
          <Cluster
            gap="sm"
            justify={justify}
            wrap={false}
            className="rounded-lg border border-dashed p-2"
          >
            {[1, 2, 3].map((item) => (
              <span
                key={item}
                className="grid size-8 place-items-center rounded-sm bg-muted text-sm font-medium"
              >
                {item}
              </span>
            ))}
          </Cluster>
        </div>
      ))}
    </Stack>
  )
}

function PageDemo() {
  return (
    <div className="showcase-contained-viewport flex h-(--page-preview-height) w-full flex-col overflow-hidden rounded-lg border">
      <Page>
        <PageScroll strength={0.1}>
          <PageContent variant="docs">
            <PageHeader>
              <PageHeaderContent>
                <PageHeaderEyebrow>
                  <RocketIcon />
                  Documentation · Release 2.0
                </PageHeaderEyebrow>
                <PageHeaderTitle>Getting started with OneDS</PageHeaderTitle>
                <PageHeaderDescription>
                  A tokenized design system built on soft hardware principles, fluid spatial motion, and expressive Material color harmonies.
                </PageHeaderDescription>
              </PageHeaderContent>
              <PageHeaderActions>
                <Button variant="secondary">
                  <DownloadIcon data-icon="inline-start" />
                  Export specs
                </Button>
                <Button>
                  <PlusIcon data-icon="inline-start" />
                  New project
                </Button>
              </PageHeaderActions>
            </PageHeader>

            <Section>
              <SectionHeader>
                <SectionHeading>
                  <SectionEyebrow>
                    <PaletteIcon />
                    Foundations
                  </SectionEyebrow>
                  <SectionTitle>Core architecture</SectionTitle>
                  <SectionDescription>
                    Explore how layout, color, and motion form a cohesive interface ladder.
                  </SectionDescription>
                </SectionHeading>
              </SectionHeader>
              <SectionContent hang>
                <div className="grid grid-cols-1 gap-(--space-md) sm:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <Badge variant="secondary" className="w-fit">Tokens</Badge>
                      <CardTitle>Color harmonies</CardTitle>
                      <CardDescription>
                        Neutral surface ladder paired with deliberate tertiary and secondary container tones.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <Badge variant="secondary" className="w-fit">Layout</Badge>
                      <CardTitle>Structural blocks</CardTitle>
                      <CardDescription>
                        Page, Section, Container, Stack, and Cluster primitives with 4px grid rhythm.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <Badge variant="secondary" className="w-fit">Motion</Badge>
                      <CardTitle>Tactile physics</CardTitle>
                      <CardDescription>
                        Substantial button press springs and inertial scroll with smooth edge fades.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </SectionContent>
            </Section>

            <Section>
              <SectionHeader divider>
                <SectionHeading>
                  <SectionEyebrow>
                    <FolderIcon />
                    Updates
                  </SectionEyebrow>
                  <SectionTitle>Recent system milestones</SectionTitle>
                  <SectionDescription>
                    Audit trail of recent component and design rule promotions.
                  </SectionDescription>
                </SectionHeading>
                <SectionActions>
                  <Button variant="ghost">View changelog</Button>
                </SectionActions>
              </SectionHeader>
              <SectionContent hang>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Milestone tracker</CardTitle>
                      <Badge variant="secondary">3 active</Badge>
                    </div>
                  </CardHeader>
                  <Stack divided gap="none">
                    <div className="flex items-center justify-between px-(--card-spacing) py-(--space-md)">
                      <div className="flex flex-col gap-(--space-2xs)">
                        <Text variant="label">Expressive command menus promoted</Text>
                        <Text variant="metadata" tone="muted">Plug-and-play grouped chunks across Dropdown, Context, and Menubar</Text>
                      </div>
                      <Badge variant="secondary">Shipped</Badge>
                    </div>
                    <div className="flex items-center justify-between px-(--card-spacing) py-(--space-md)">
                      <div className="flex flex-col gap-(--space-2xs)">
                        <Text variant="label">Compact list item geometry & state ladder</Text>
                        <Text variant="metadata" tone="muted">26px standard / 20px compact radius with tertiary interaction opacities</Text>
                      </div>
                      <Badge variant="secondary">Shipped</Badge>
                    </div>
                    <div className="flex items-center justify-between px-(--card-spacing) py-(--space-md)">
                      <div className="flex flex-col gap-(--space-2xs)">
                        <Text variant="label">Material Symbols font with fill interpolation</Text>
                        <Text variant="metadata" tone="muted">Native variable font FILL axis animation on button selection</Text>
                      </div>
                      <Badge variant="secondary">Shipped</Badge>
                    </div>
                  </Stack>
                </Card>
              </SectionContent>
            </Section>

            <Section>
              <SectionHeader>
                <SectionHeading>
                  <SectionTitle>Need assistance?</SectionTitle>
                  <SectionDescription>
                    Browse component guidelines, design rules, and live code examples.
                  </SectionDescription>
                </SectionHeading>
              </SectionHeader>
              <SectionContent hang>
                <Card>
                  <CardHeader>
                    <CardTitle>Design system documentation</CardTitle>
                    <CardDescription>
                      Access full specifications, token directories, and interactive component sandboxes.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter layout="responsive">
                    <Button variant="secondary">
                      <BookmarkIcon data-icon="inline-start" />
                      Design rules reference
                    </Button>
                    <Button variant="secondary">
                      <SettingsIcon data-icon="inline-start" />
                      Configure theme
                    </Button>
                  </CardFooter>
                </Card>
              </SectionContent>
            </Section>
          </PageContent>
        </PageScroll>
      </Page>
    </div>
  )
}

function PageBleedDemo() {
  return (
    <div className="showcase-contained-viewport flex h-(--page-preview-height) w-full flex-col overflow-hidden rounded-lg border">
      <Page>
        <PageScroll strength={0.1}>
          <PageContent variant="docs">
            <PageHeader>
              <PageHeaderContent>
                <PageHeaderEyebrow>
                  <SparklesIcon />
                  Workspace overview
                </PageHeaderEyebrow>
                <PageHeaderTitle>Design platform portal</PageHeaderTitle>
                <PageHeaderDescription>
                  Demonstrating full-bleed hero breakout banners while sibling content remains aligned to the reading column.
                </PageHeaderDescription>
              </PageHeaderContent>
            </PageHeader>

            <PageBleed extent="surface" hang="32px">
              <div className="relative overflow-hidden rounded-(--page-banner-radius) bg-(--button-secondary-fill) text-(--button-secondary-ink) p-(--page-banner-padding-block) px-(--page-banner-padding-inline) ring-1 ring-(--elevation-stroke) shadow-(--elevation-raised)">
                <div className="flex flex-col gap-(--page-banner-gap) md:flex-row md:items-center md:justify-between">
                  <div className="flex max-w-xl flex-col gap-(--space-xs)">
                    <div className="flex items-center gap-(--space-xs)">
                      <Badge variant="secondary" className="bg-(--button-primary-fill) text-(--button-primary-ink)">
                        Featured release
                      </Badge>
                      <Text variant="metadata" className="text-(--button-secondary-ink)/80 font-medium">
                        Sprint 24 · Material Expressive
                      </Text>
                    </div>
                    <Text variant="title" className="text-(--button-secondary-ink) font-semibold">
                      Tactile soft hardware for web
                    </Text>
                    <Text variant="lead" className="text-(--button-secondary-ink)/85">
                      Build substantial, high-energy interfaces with coordinated color harmonies, fluid spatial springs, and expressive layout primitives.
                    </Text>
                    <Cluster gap="sm" className="pt-(--space-xs)">
                      <Button variant="primary">
                        <RocketIcon data-icon="inline-start" />
                        Explore system
                      </Button>
                      <Button variant="secondary">
                        Read design rules
                      </Button>
                    </Cluster>
                  </div>
                  <div className="hidden md:flex shrink-0 items-center justify-center p-(--space-md)">
                    <div className="relative flex size-28 items-center justify-center rounded-3xl bg-(--button-primary-fill) text-(--button-primary-ink) shadow-(--elevation-floating)">
                      <SparklesIcon className="size-12" />
                    </div>
                  </div>
                </div>
              </div>
            </PageBleed>

            <Section>
              <SectionHeader>
                <SectionHeading>
                  <SectionEyebrow>
                    <FolderIcon />
                    Projects
                  </SectionEyebrow>
                  <SectionTitle>Pinned repositories</SectionTitle>
                  <SectionDescription>
                    Card containers hang outside the reading line so their inner title and copy lock directly to the page text guide.
                  </SectionDescription>
                </SectionHeading>
                <SectionActions>
                  <Button variant="secondary">View all</Button>
                </SectionActions>
              </SectionHeader>
              <SectionContent hang>
                <div className="grid grid-cols-1 gap-(--space-md) sm:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <Badge variant="tertiary" className="w-fit">Core</Badge>
                      <CardTitle>OneDS Core Web</CardTitle>
                      <CardDescription>Shared component library and design token engine.</CardDescription>
                    </CardHeader>
                    <CardFooter layout="responsive">
                      <Button variant="secondary" size="default">View repo</Button>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <Badge variant="tertiary" className="w-fit">Experimental</Badge>
                      <CardTitle>Expression Lab</CardTitle>
                      <CardDescription>A/B playground for motion curves, scale, and color schemes.</CardDescription>
                    </CardHeader>
                    <CardFooter layout="responsive">
                      <Button variant="secondary" size="default">Launch lab</Button>
                    </CardFooter>
                  </Card>
                </div>
              </SectionContent>
            </Section>

            <Section>
              <SectionHeader divider>
                <SectionHeading>
                  <SectionEyebrow>
                    <SparklesIcon />
                    Telemetry
                  </SectionEyebrow>
                  <SectionTitle>Workspace vitals</SectionTitle>
                  <SectionDescription>
                    Real-time performance metrics streaming from active deployments.
                  </SectionDescription>
                </SectionHeading>
                <SectionActions>
                  <Button variant="ghost">Analytics</Button>
                </SectionActions>
              </SectionHeader>
              <SectionContent hang>
                <Card>
                  <CardHeader>
                    <CardTitle>Cluster performance</CardTitle>
                    <CardDescription>
                      All regional clusters report healthy telemetry with 0 flaws or regressions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-(--space-md) sm:grid-cols-3">
                      <div className="flex flex-col gap-(--space-2xs) rounded-lg border bg-muted/20 p-(--space-md)">
                        <Text variant="caption" tone="muted">First Contentful Paint</Text>
                        <Text variant="heading">0.82s</Text>
                      </div>
                      <div className="flex flex-col gap-(--space-2xs) rounded-lg border bg-muted/20 p-(--space-md)">
                        <Text variant="caption" tone="muted">Interaction to Next Paint</Text>
                        <Text variant="heading">48ms</Text>
                      </div>
                      <div className="flex flex-col gap-(--space-2xs) rounded-lg border bg-muted/20 p-(--space-md)">
                        <Text variant="caption" tone="muted">Cumulative Layout Shift</Text>
                        <Text variant="heading">0.001</Text>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter layout="responsive">
                    <Button variant="secondary">Open dashboard</Button>
                  </CardFooter>
                </Card>
              </SectionContent>
            </Section>
          </PageContent>
        </PageScroll>
      </Page>
    </div>
  )
}

function PageCenteredDemo() {
  return (
    <div className="showcase-contained-viewport flex h-(--page-preview-height) w-full flex-col overflow-hidden rounded-lg border">
      <Page>
        <PageContent variant="centered">
          <Card hang className="w-full shadow-(--elevation-raised)">
            <CardHeader>
              <Cluster gap="xs" className="mb-(--space-2xs)">
                <div className="flex size-8 items-center justify-center rounded-md bg-(--button-primary-fill) text-(--button-primary-ink)">
                  <RocketIcon className="size-4" />
                </div>
                <Badge variant="secondary">Onboarding</Badge>
              </Cluster>
              <CardTitle>Welcome to OneDS</CardTitle>
              <CardDescription>
                Create your workspace profile to start composing with expressive primitives.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-(--space-md)">
              <div className="flex flex-col gap-(--space-xs)">
                <Text variant="label">Workspace name</Text>
                <div className="rounded-md border bg-muted/30 px-(--space-sm) py-(--space-xs) text-sm text-foreground">
                  Design Systems Platform
                </div>
              </div>
              <div className="flex flex-col gap-(--space-xs)">
                <Text variant="label">Default appearance</Text>
                <Cluster gap="xs">
                  <Badge variant="primary">Material website</Badge>
                  <Badge variant="tertiary">Neutral baseline</Badge>
                </Cluster>
              </div>
              <Button className="w-full">
                Continue to workspace
              </Button>
            </CardContent>
          </Card>
        </PageContent>
      </Page>
    </div>
  )
}

function CenteredHeaderCollapseDemo() {
  return (
    <div className="showcase-contained-viewport h-(--page-preview-height) w-full overflow-hidden rounded-lg border">
      <div className="centered-header-scroll">
        <div className="centered-header-scroll__inner">
          <ShowcasePageHeader
            title="Page Header"
            description="A page-level header with an eyebrow, title, description, and actions."
            command="npx shadcn@latest add page-header"
          />

          <div className="centered-header-scroll__body">
            {[
              {
                title: "Anatomy",
                body: "The header groups an eyebrow, title, description, and an actions cluster. Each part is optional so the same primitive scales from a simple page title to a rich landing hero.",
              },
              {
                title: "Responsive layout",
                body: "Content stays in a single readable column on small screens and expands into a balanced two-column arrangement once there is room for actions beside the copy.",
              },
              {
                title: "Rich content",
                body: "Because the header is composable, you can embed an install command, breadcrumbs, tabs, or search without breaking the vertical rhythm of the page.",
              },
              {
                title: "Sticky behavior",
                body: "Keep scrolling and a compact toolbar drops in from the top, shrinking to a centered pill that keeps the title and copy action within reach.",
              },
            ].map((section) => (
              <Card key={section.title} className="w-full shadow-(--elevation-raised)">
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.body}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export const layoutDemos: ComponentEntry[] = [
  {
    slug: "accordion",
    name: "Accordion",
    description: "A stacked set of interactive headings that reveal content.",
    category: "Layout",
    Demo: () => (
      <Accordion type="single" collapsible className="w-full max-w-md">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>
            Yes. It comes with default styles that match the other components.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    code: `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function AccordionDemo() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}`,
    examples: [
      {
        name: "Large",
        description:
          "A chunkier footprint for site pages — heading-and-body pairing with larger icons.",
        Demo: () => (
          <Accordion type="single" collapsible size="lg" className="w-full max-w-2xl">
            <AccordionItem value="lg-1">
              <AccordionTrigger>How do I get started?</AccordionTrigger>
              <AccordionContent>
                Create an account, pick a plan, and invite your team. You can be up and
                running in a few minutes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="lg-2">
              <AccordionTrigger>Can I use my own domain?</AccordionTrigger>
              <AccordionContent>
                Yes. Connect a custom domain from the workspace settings and we handle the
                certificate for you.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="lg-3" className="border-b-0">
              <AccordionTrigger>What kind of support is included?</AccordionTrigger>
              <AccordionContent>
                Every plan includes 24/7 email and chat support, with priority response on
                higher tiers.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ),
      },
      {
        name: "Multiple",
        description: "Multiple items can be open at the same time.",
        Demo: () => (
          <Accordion type="multiple" className="w-full max-w-md">
            <AccordionItem value="multi-1">
              <AccordionTrigger>First section</AccordionTrigger>
              <AccordionContent>
                This section can stay open while you expand others.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="multi-2">
              <AccordionTrigger>Second section</AccordionTrigger>
              <AccordionContent>
                Open both sections at once to compare content side by side.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="multi-3">
              <AccordionTrigger>Third section</AccordionTrigger>
              <AccordionContent>
                All three can be expanded simultaneously.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ),
      },
      {
        name: "Disabled",
        description: "Individual items can be disabled to prevent interaction.",
        Demo: () => (
          <Accordion type="single" collapsible className="w-full max-w-md">
            <AccordionItem value="dis-1">
              <AccordionTrigger>Available item</AccordionTrigger>
              <AccordionContent>
                This item works normally and can be expanded.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="dis-2" disabled>
              <AccordionTrigger>Disabled item</AccordionTrigger>
              <AccordionContent>
                You should not be able to see this.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="dis-3">
              <AccordionTrigger>Another available item</AccordionTrigger>
              <AccordionContent>
                This item also works normally.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ),
      },
      {
        name: "Borders",
        description: "Accordion items with a surrounding card border.",
        Demo: () => (
          <Accordion type="single" collapsible className="w-full max-w-md rounded-lg border">
            <AccordionItem value="brd-1" className="border-b-0 px-4">
              <AccordionTrigger>Account settings</AccordionTrigger>
              <AccordionContent>
                Manage your username, email, and profile picture.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="brd-2" className="border-b-0 px-4">
              <AccordionTrigger>Notifications</AccordionTrigger>
              <AccordionContent>
                Choose which notifications you want to receive.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="brd-3" className="border-b-0 px-4">
              <AccordionTrigger>Privacy</AccordionTrigger>
              <AccordionContent>
                Control who can see your profile and activity.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ),
      },
      {
        name: "Card",
        description: "Each accordion item rendered inside its own card.",
        Demo: () => (
          <div className="flex w-full max-w-md flex-col gap-3">
            <Accordion type="single" collapsible>
              <Card className="py-0">
                <AccordionItem value="card-1" className="border-b-0">
                  <CardContent className="p-0">
                    <AccordionTrigger className="ps-4 pe-3 pt-4">What is your refund policy?</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      We offer a 30-day money-back guarantee on all plans.
                    </AccordionContent>
                  </CardContent>
                </AccordionItem>
              </Card>
            </Accordion>
            <Accordion type="single" collapsible>
              <Card className="py-0">
                <AccordionItem value="card-2" className="border-b-0">
                  <CardContent className="p-0">
                    <AccordionTrigger className="ps-4 pe-3 pt-4">Can I change plans later?</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      Yes, you can upgrade or downgrade at any time.
                    </AccordionContent>
                  </CardContent>
                </AccordionItem>
              </Card>
            </Accordion>
            <Accordion type="single" collapsible>
              <Card className="py-0">
                <AccordionItem value="card-3" className="border-b-0">
                  <CardContent className="p-0">
                    <AccordionTrigger className="ps-4 pe-3 pt-4">Do you offer support?</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      Yes, we provide 24/7 email and chat support.
                    </AccordionContent>
                  </CardContent>
                </AccordionItem>
              </Card>
            </Accordion>
          </div>
        ),
      },
    ],
  },
  {
    slug: "collapsible",
    name: "Collapsible",
    description: "An interactive component that expands and collapses content.",
    category: "Layout",
    Demo: () => (
      <Collapsible className="w-full max-w-sm space-y-2">
        <div className="flex items-center justify-between gap-4 rounded-md border py-2 ps-4 pe-2">
          <span className="text-sm font-medium">@peduarte starred 3 repositories</span>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <ChevronsUpDownIcon />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-2">
          <div className="rounded-md border px-4 py-2 font-mono text-sm">@radix-ui/react</div>
          <div className="rounded-md border px-4 py-2 font-mono text-sm">@shadcn/ui</div>
        </CollapsibleContent>
      </Collapsible>
    ),
    code: `import { ChevronsUpDownIcon } from "@/components/ui/icons"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"

export function CollapsibleDemo() {
  return (
    <Collapsible className="w-full max-w-sm space-y-2">
      <div className="flex items-center justify-between rounded-md border py-2 ps-4 pe-2">
        <span className="text-sm font-medium">@peduarte starred 3 repositories</span>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <ChevronsUpDownIcon />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>@shadcn/ui</CollapsibleContent>
    </Collapsible>
  )
}`,
    examples: [
      {
        name: "Settings Panel",
        description: "A collapsible settings panel with interactive controls.",
        Demo: function SettingsPanel() {
          const [wifiOn, setWifiOn] = useState(true)
          const [notifs, setNotifs] = useState(false)
          const [darkMode, setDarkMode] = useState(false)
          return (
            <Collapsible defaultOpen className="w-full max-w-sm space-y-2">
              <div className="flex items-center justify-between gap-4 rounded-md border py-2 ps-4 pe-2">
                <div className="flex items-center gap-2">
                  <SettingsIcon className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Quick settings</span>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <ChevronsUpDownIcon />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="space-y-3 rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <WifiIcon className="size-4 text-muted-foreground" />
                    <Label htmlFor="settings-wifi" className="text-sm">Wi-Fi</Label>
                  </div>
                  <Switch id="settings-wifi" checked={wifiOn} onCheckedChange={setWifiOn} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BellIcon className="size-4 text-muted-foreground" />
                    <Label htmlFor="settings-notifs" className="text-sm">Notifications</Label>
                  </div>
                  <Switch id="settings-notifs" checked={notifs} onCheckedChange={setNotifs} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MoonIcon className="size-4 text-muted-foreground" />
                    <Label htmlFor="settings-dark" className="text-sm">Dark mode</Label>
                  </div>
                  <Switch id="settings-dark" checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        },
      },
      {
        name: "File Tree",
        description: "A nested collapsible file tree with expandable folders.",
        Demo: function FileTree() {
          const [srcOpen, setSrcOpen] = useState(true)
          const [compOpen, setCompOpen] = useState(false)
          return (
            <div className="w-full max-w-xs rounded-md border p-2">
              <Collapsible open={srcOpen} onOpenChange={setSrcOpen}>
                <CollapsibleTrigger className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-sm hover:bg-muted">
                  <ChevronRightIcon className={`size-3.5 text-muted-foreground transition-transform duration-(--speed-swift) ease-(--ease-glide) ${srcOpen ? "rotate-90" : ""}`} />
                  {srcOpen ? <FolderOpenIcon className="size-4 text-muted-foreground" /> : <FolderIcon className="size-4 text-muted-foreground" />}
                  <span>src</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-4 border-l pl-2">
                  <Collapsible open={compOpen} onOpenChange={setCompOpen}>
                    <CollapsibleTrigger className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-sm hover:bg-muted">
                      <ChevronRightIcon className={`size-3.5 text-muted-foreground transition-transform duration-(--speed-swift) ease-(--ease-glide) ${compOpen ? "rotate-90" : ""}`} />
                      {compOpen ? <FolderOpenIcon className="size-4 text-muted-foreground" /> : <FolderIcon className="size-4 text-muted-foreground" />}
                      <span>components</span>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-4 border-l pl-2">
                      <div className="flex items-center gap-1.5 rounded px-2 py-1 text-sm">
                        <FileIcon className="size-4 text-muted-foreground" />
                        <span>button.tsx</span>
                      </div>
                      <div className="flex items-center gap-1.5 rounded px-2 py-1 text-sm">
                        <FileIcon className="size-4 text-muted-foreground" />
                        <span>card.tsx</span>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  <div className="flex items-center gap-1.5 rounded px-2 py-1 text-sm">
                    <FileIcon className="size-4 text-muted-foreground" />
                    <span>App.tsx</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded px-2 py-1 text-sm">
                    <FileIcon className="size-4 text-muted-foreground" />
                    <span>main.tsx</span>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )
        },
      },
    ],
  },
  {
    slug: "separator",
    name: "Separator",
    description: "Visually or semantically separates content.",
    category: "Layout",
    Demo: () => (
      <div className="max-w-sm">
        <div className="space-y-1">
          <h4 className="text-sm leading-none font-medium">OneDS UI</h4>
          <p className="text-muted-foreground text-sm">A component showcase.</p>
        </div>
        <Separator className="my-4" />
        <div className="flex h-5 items-center gap-4 text-sm">
          <span>Docs</span>
          <Separator orientation="vertical" />
          <span>Components</span>
          <Separator orientation="vertical" />
          <span>Themes</span>
        </div>
      </div>
    ),
    code: `import { Separator } from "@/components/ui/separator"

export function SeparatorDemo() {
  return (
    <div>
      <h4 className="text-sm leading-none font-medium">OneDS UI</h4>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-sm">
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Components</span>
      </div>
    </div>
  )
}`,
    examples: [
      {
        name: "Menu",
        description: "Separator used to group actions in a menu-like layout.",
        Demo: function SeparatorMenu() {
          const [selected, setSelected] = useState("profile")
          const menuItems = [
            { id: "profile", icon: UserIcon, label: "Profile" },
            { id: "settings", icon: SettingsIcon, label: "Settings" },
          ]
          const menuItems2 = [
            { id: "home", icon: HomeIcon, label: "Home" },
            { id: "bookmarks", icon: BookmarkIcon, label: "Bookmarks" },
            { id: "mail", icon: MailIcon, label: "Mail" },
          ]
          return (
            <div className="w-full max-w-xs rounded-lg border p-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelected(item.id)}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${selected === item.id ? "bg-accent text-accent-foreground" : "hover:bg-muted"}`}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </button>
              ))}
              <Separator className="my-1" />
              {menuItems2.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelected(item.id)}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${selected === item.id ? "bg-accent text-accent-foreground" : "hover:bg-muted"}`}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </button>
              ))}
              <Separator className="my-1" />
              <button
                type="button"
                onClick={() => setSelected("logout")}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${selected === "logout" ? "bg-accent text-accent-foreground" : "hover:bg-muted"}`}
              >
                <KeyIcon className="size-4" />
                Log out
              </button>
            </div>
          )
        },
      },
      {
        name: "List",
        description: "Separator dividing items in a content list.",
        Demo: () => {
          const items = [
            { icon: GlobeIcon, title: "Public access", desc: "Anyone with the link can view" },
            { icon: ShieldIcon, title: "Private", desc: "Only invited members can access" },
            { icon: LinkIcon, title: "Shared link", desc: "Generate a shareable link" },
          ]
          return (
            <div className="w-full max-w-sm rounded-lg border">
              {items.map((item, i) => (
                <div key={item.title}>
                  {i > 0 && <Separator />}
                  <div className="flex items-start gap-3 p-4">
                    <item.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        },
      },
    ],
  },
  {
    slug: "scroll-area",
    name: "Scroll Area",
    description: "Augments native scroll with custom, cross-browser styling.",
    category: "Layout",
    Demo: () => (
      <ScrollArea className="h-72 w-full max-w-60 rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm leading-none font-medium">Tags</h4>
          {tags.map((tag) => (
            <div key={tag}>
              <div className="text-sm">{tag}</div>
              <Separator className="my-2" />
            </div>
          ))}
        </div>
      </ScrollArea>
    ),
    code: `import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium">Tags</h4>
        {tags.map((tag) => (
          <div key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}`,
    examples: [
      {
        name: "Horizontal",
        description: "A horizontally scrolling area with artwork items.",
        Demo: () => {
          const artworks = [
            { title: "Starry Night", artist: "Vincent van Gogh" },
            { title: "The Persistence of Memory", artist: "Salvador Dali" },
            { title: "Girl with a Pearl Earring", artist: "Johannes Vermeer" },
            { title: "Water Lilies", artist: "Claude Monet" },
            { title: "The Great Wave", artist: "Katsushika Hokusai" },
            { title: "Guernica", artist: "Pablo Picasso" },
            { title: "The Birth of Venus", artist: "Sandro Botticelli" },
          ]
          return (
            <ScrollArea axis="x" className="w-full max-w-lg whitespace-nowrap rounded-md border">
              <div className="flex gap-4 p-4">
                {artworks.map((work) => (
                  <div key={work.title} className="w-36 shrink-0">
                    <AspectRatio ratio="square" className="rounded-md bg-muted" />
                    <p className="mt-2 truncate text-sm font-medium">{work.title}</p>
                    <p className="truncate text-sm text-muted-foreground">{work.artist}</p>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )
        },
      },
    ],
  },
  {
    slug: "resizable",
    name: "Resizable",
    description: "Accessible resizable panel groups and layouts.",
    category: "Layout",
    Demo: () => (
      <ResizablePanelGroup
        orientation="horizontal"
        className="h-55 w-full max-w-md rounded-(--card-radius) ring-1 ring-(--card-stroke) bg-card"
      >
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">One</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Two</span>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Three</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    ),
    code: `import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export function ResizableDemo() {
  return (
    <ResizablePanelGroup orientation="horizontal" className="rounded-(--card-radius) ring-1 ring-(--card-stroke) bg-card">
      <ResizablePanel defaultSize={50}>One</ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>Two</ResizablePanel>
    </ResizablePanelGroup>
  )
}`,
  },
  {
    slug: "page-header",
    name: "Page Header",
    description:
      "A page-level header with an eyebrow, title, description, and actions.",
    category: "Layout",
    Demo: () => (
      <PageHeader className="w-full">
        <PageHeaderContent>
          <PageHeaderEyebrow>
            <RocketIcon />
            Projects
          </PageHeaderEyebrow>
          <PageHeaderTitle>Dashboard</PageHeaderTitle>
          <PageHeaderDescription>
            Monitor activity across your workspace and jump back into recent
            work.
          </PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <Button variant="secondary">
            <DownloadIcon data-icon="inline-start" />
            Export
          </Button>
          <Button>
            <PlusIcon data-icon="inline-start" />
            New project
          </Button>
        </PageHeaderActions>
      </PageHeader>
    ),
    code: `import { DownloadIcon, PlusIcon, RocketIcon } from "@/components/ui/icons"

import { Button } from "@/components/ui/button"
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderEyebrow,
  PageHeaderTitle,
} from "@/components/ui/page-header"

export function PageHeaderDemo() {
  return (
    <PageHeader>
      <PageHeaderContent>
        <PageHeaderEyebrow>
          <RocketIcon />
          Projects
        </PageHeaderEyebrow>
        <PageHeaderTitle>Dashboard</PageHeaderTitle>
        <PageHeaderDescription>
          Monitor activity across your workspace and jump back into recent work.
        </PageHeaderDescription>
      </PageHeaderContent>
      <PageHeaderActions>
        <Button variant="secondary">
          <DownloadIcon data-icon="inline-start" />
          Export
        </Button>
        <Button>
          <PlusIcon data-icon="inline-start" />
          New project
        </Button>
      </PageHeaderActions>
    </PageHeader>
  )
}`,
    examples: [
      {
        name: "Centered",
        description: "A centered floating island that sticks and collapses into a compact pill as you scroll.",
        ownsCanvas: true,
        Demo: CenteredHeaderCollapseDemo,
      },
      {
        name: "With Code Block",
        description:
          "Mirroring the showcase site headers, embedding an installation command or code block in the header content.",
        Demo: () => (
          <PageHeader className="w-full">
            <PageHeaderContent className="w-full">
              <PageHeaderEyebrow>Installation</PageHeaderEyebrow>
              <PageHeaderTitle>Page Header</PageHeaderTitle>
              <PageHeaderDescription>
                A page-level header with an eyebrow, title, description, and rich content.
              </PageHeaderDescription>
              <CodeBlock
                code="npx shadcn@latest add page-header"
                showLineNumbers={false}
                hang={false}
                className="w-full"
              />
            </PageHeaderContent>
          </PageHeader>
        ),
      },
      {
        name: "With Controls and Navigation",
        description:
          "Compose navigation breadcrumbs, search inputs, tabs, and action clusters inside the header.",
        Demo: () => (
          <PageHeader className="w-full">
            <PageHeaderContent className="w-full">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()}>
                      Docs
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()}>
                      Components
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Page Header</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div className="flex flex-col gap-(--space-xs) md:flex-row md:items-center md:justify-between">
                <div>
                  <PageHeaderTitle>Component specifications</PageHeaderTitle>
                  <PageHeaderDescription>
                    Browse anatomy, responsive layout guidelines, and interactive states.
                  </PageHeaderDescription>
                </div>
                <PageHeaderActions>
                  <SearchInput placeholder="Search specs..." className="w-48" />
                  <Button variant="secondary">
                    <ShareIcon data-icon="inline-start" />
                    Share
                  </Button>
                  <Button>
                    <BookmarkIcon data-icon="inline-start" />
                    Bookmark
                  </Button>
                </PageHeaderActions>
              </div>
              <div className="pt-(--space-xs)">
                <Tabs defaultValue="overview">
                  <TabsList variant="line">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="api">API reference</TabsTrigger>
                    <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </PageHeaderContent>
          </PageHeader>
        ),
      },
    ],
  },
  {
    slug: "section",
    name: "Section",
    description:
      "A titled content region with an optional description and actions.",
    category: "Layout",
    Demo: () => (
      <Section className="w-full">
        <SectionHeader>
          <SectionHeading>
            <SectionTitle>Team members</SectionTitle>
            <SectionDescription>
              People with access to this workspace.
            </SectionDescription>
          </SectionHeading>
          <SectionActions>
            <Button variant="secondary" size="default">
              <PlusIcon data-icon="inline-start" />
              Invite
            </Button>
          </SectionActions>
        </SectionHeader>
        <SectionContent>
          <Card>
            <CardContent className="text-muted-foreground text-sm">
              Section content goes here.
            </CardContent>
          </Card>
        </SectionContent>
      </Section>
    ),
    code: `import { PlusIcon } from "@/components/ui/icons"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Section,
  SectionActions,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionHeading,
  SectionTitle,
} from "@/components/ui/section"

export function SectionDemo() {
  return (
    <Section>
      <SectionHeader>
        <SectionHeading>
          <SectionTitle>Team members</SectionTitle>
          <SectionDescription>
            People with access to this workspace.
          </SectionDescription>
        </SectionHeading>
        <SectionActions>
          <Button variant="secondary" size="default">
            <PlusIcon data-icon="inline-start" />
            Invite
          </Button>
        </SectionActions>
      </SectionHeader>
      <SectionContent>
        <Card>
          <CardContent>Section content goes here.</CardContent>
        </Card>
      </SectionContent>
    </Section>
  )
}`,
  },
  {
    slug: "container",
    name: "Container",
    description:
      "A centered, max-width page wrapper with responsive gutters and size variants.",
    category: "Layout",
    Demo: () => (
      <div className="w-full space-y-3">
        {(["prose", "md", "lg", "xl"] as const).map((size) => (
          <Container
            key={size}
            size={size}
            gutter={false}
            className="rounded-lg border bg-card p-3 text-center text-sm text-muted-foreground"
          >
            size=&quot;{size}&quot;
          </Container>
        ))}
      </div>
    ),
    code: `import { Container } from "@/components/ui/container"

export function ContainerDemo() {
  return (
    <Container size="lg">
      <p>Centered content constrained to a max width with responsive gutters.</p>
    </Container>
  )
}`,
  },
  {
    slug: "stack",
    name: "Stack",
    description: "A vertical layout primitive with tokenized gap and alignment.",
    category: "Layout",
    Demo: () => (
      <Stack gap="md" className="w-full max-w-sm">
        <Card>
          <CardContent className="text-sm">First</CardContent>
        </Card>
        <Card>
          <CardContent className="text-sm">Second</CardContent>
        </Card>
        <Card>
          <CardContent className="text-sm">Third</CardContent>
        </Card>
      </Stack>
    ),
    code: `import { Stack } from "@/components/ui/stack"

export function StackDemo() {
  return (
    <Stack gap="md">
      <div>First</div>
      <div>Second</div>
      <div>Third</div>
    </Stack>
  )
}`,
  },
  {
    slug: "cluster",
    name: "Cluster",
    description:
      "Arrange items in a horizontal row that can wrap, align, and distribute its children.",
    category: "Layout",
    Demo: ClusterWrappingDemo,
    code: `import { Cluster } from "@/components/ui/cluster"

export function ClusterDemo() {
  return (
    <Cluster gap="sm" className="max-w-md rounded-lg border border-dashed p-3">
      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          className="flex h-14 min-w-28 flex-1 items-center justify-center rounded-md bg-muted"
        >
          Item {index + 1}
        </div>
      ))}
    </Cluster>
  )
}`,
    examples: [
      {
        name: "Alignment",
        description:
          "Items with different heights share the same vertical center line.",
        Demo: ClusterAlignmentDemo,
      },
      {
        name: "Distribution",
        description:
          "Compare start, center, and space-between distribution across the available width.",
        Demo: ClusterDistributionDemo,
      },
    ],
  },
  {
    slug: "toolbar",
    name: "Toolbar",
    description:
      "A horizontal action bar for filters, search, and view toggles.",
    category: "Layout",
    surface: "default",
    ownsCanvas: true,
    codeSource: "complete",
    defaultExampleHeader: {
      style: "inline",
      description: "Inspect the toolbar's padding, border, and group gaps while keeping its controls available.",
    },
    Demo: () => (
      <ToolbarPreview name="Toolbar">
        <Toolbar data-measure="toolbar" className="w-full">
          <ToolbarGroup data-measure="primary">
            <Button
              variant="tertiary"
              size="default"
            >
              <FilterIcon data-icon="inline-start" />
              Filter
            </Button>
            <Button variant="tertiary" size="default">
              <SearchIcon data-icon="inline-start" />
              Search
            </Button>
          </ToolbarGroup>
          <ToolbarSpacer />
          <ToolbarGroup>
            <Button
              variant="ghost"
              size="icon"
              aria-label="List view"
              tooltip="List view"
            >
              <ListIcon />
            </Button>
            <ToolbarSeparator />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Grid view"
              tooltip="Grid view"
            >
              <LayoutGridIcon />
            </Button>
          </ToolbarGroup>
        </Toolbar>
      </ToolbarPreview>
    ),
    code: generatedExampleCode["toolbar:Default"],
    examples: [
      {
        name: "Expressive",
        ownsCanvas: true,
        header: "inline",
        description:
          "A 56px expressive action bar with generous touch targets, 24px Material Symbols, concentric 37px capsule curvature, and tactile button feedback.",
        layout: "wide",
        Demo: () => {
          const [tool, setTool] = useState("draw")
          const [saved, setSaved] = useState(false)

          return (
            <ToolbarPreview
              name="Expressive"
              targets={[
                { target: "toolbar", label: "Toolbar", kinds: ["padding", "border"] },
                { target: "primary", label: "Tool cluster", kinds: ["gap"] },
              ]}
            >
              <div className="flex w-full items-center justify-center py-6">
                <Toolbar size="expressive" shape="pill" data-measure="toolbar" className="w-fit">
                  <ToolbarGroup data-measure="primary">
                    <Button
                      variant="tertiary"
                      size="icon-expressive"
                      aria-label="Select tool"
                      tooltip="Select tool"
                      selected={tool === "select"}
                      onClick={() => setTool("select")}
                    >
                      <MousePointer2Icon />
                    </Button>
                    <Button
                      variant="tertiary"
                      size="icon-expressive"
                      aria-label="Draw"
                      tooltip="Draw"
                      selected={tool === "draw"}
                      onClick={() => setTool("draw")}
                    >
                      <PencilIcon />
                    </Button>
                    <Button
                      variant="tertiary"
                      size="icon-expressive"
                      aria-label="Palette"
                      tooltip="Palette"
                      selected={tool === "palette"}
                      onClick={() => setTool("palette")}
                    >
                      <PaletteIcon />
                    </Button>
                    <Button
                      variant="tertiary"
                      size="icon-expressive"
                      aria-label="Erase"
                      tooltip="Erase"
                      selected={tool === "erase"}
                      onClick={() => setTool("erase")}
                    >
                      <TrashIcon />
                    </Button>
                  </ToolbarGroup>
                  <ToolbarSeparator />
                  <ToolbarGroup>
                    <Button
                      variant="primary"
                      size="expressive"
                      aria-label="Save changes"
                      onClick={() => setSaved((s) => !s)}
                    >
                      <CheckIcon data-icon="inline-start" />
                      {saved ? "Saved" : "Save"}
                    </Button>
                  </ToolbarGroup>
                </Toolbar>
              </div>
            </ToolbarPreview>
          )
        },
      },
      {
        name: "Floating island",
        ownsCanvas: true,
        header: "inline",
        description:
          "An elevated floating capsule (control island) with floating elevation, rounded-full concentric geometry, 2 icons on each side, and a prominent shaped FAB in the center with no dividers and tight icon clustering. Available in both horizontal and vertical variants.",
        layout: "wide",
        Demo: () => {
          const [playing, setPlaying] = useState(false)
          const [bookmarked, setBookmarked] = useState(false)
          const [activeSpeed, setActiveSpeed] = useState("1x")
          const [verticalPlaying, setVerticalPlaying] = useState(false)
          const [verticalBookmarked, setVerticalBookmarked] = useState(false)
          const [verticalSpeed, setVerticalSpeed] = useState("1x")

          return (
            <ToolbarPreview
              name="Floating island"
              targets={[
                { target: "toolbar", label: "Toolbar", kinds: ["padding", "border"] },
              ]}
            >
              <div className="flex w-full flex-wrap items-center justify-center gap-(--space-2xl) py-6">
                {/* Horizontal floating island: 2 icons + 1.5x center pink FAB + 2 icons */}
                <div className="flex flex-col items-center gap-(--space-sm) text-center">
                  <span className="text-sm font-medium text-muted-foreground">Horizontal</span>
                  <Toolbar
                    variant="floating"
                    size="expressive"
                    shape="pill"
                    data-measure="toolbar"
                    className="w-fit gap-(--space-2xs)"
                    aria-label="Media controls"
                  >
                    <ToolbarGroup className="gap-(--space-2xs)">
                      <Button
                        variant="ghost"
                        size="icon-expressive"
                        aria-label="Bookmark"
                        tooltip="Bookmark"
                        selected={bookmarked}
                        onClick={() => setBookmarked((b) => !b)}
                      >
                        <BookmarkIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-expressive"
                        aria-label="Playback speed"
                        tooltip="Speed"
                        selected={activeSpeed === "2x"}
                        onClick={() => setActiveSpeed((s) => (s === "1x" ? "2x" : "1x"))}
                      >
                        <RocketIcon />
                      </Button>
                    </ToolbarGroup>
                    <Button
                      variant="primary"
                      size="expressive"
                      aria-label={playing ? "Pause" : "Play"}
                      tooltip={playing ? "Pause" : "Play"}
                      className="w-(--toolbar-floating-action-width) rounded-full [&_svg]:size-(--icon-size-32)"
                      onClick={() => setPlaying((p) => !p)}
                    >
                      {playing ? <PauseIcon /> : <PlayIcon />}
                    </Button>
                    <ToolbarGroup className="gap-(--space-2xs)">
                      <Button
                        variant="ghost"
                        size="icon-expressive"
                        aria-label="Favorite"
                        tooltip="Favorite"
                      >
                        <HeartIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-expressive"
                        aria-label="Share"
                        tooltip="Share"
                      >
                        <ShareIcon />
                      </Button>
                    </ToolbarGroup>
                  </Toolbar>
                </div>

                {/* Vertical floating island: 2 icons + 1.5x center pink FAB + 2 icons */}
                <div className="flex flex-col items-center gap-(--space-sm) text-center">
                  <span className="text-sm font-medium text-muted-foreground">Vertical</span>
                  <Toolbar
                    variant="floating"
                    size="expressive"
                    shape="pill"
                    orientation="vertical"
                    className="w-fit gap-(--space-2xs)"
                    aria-label="Vertical media controls"
                  >
                    <ToolbarGroup className="gap-(--space-2xs)">
                      <Button
                        variant="ghost"
                        size="icon-expressive"
                        aria-label="Vertical bookmark"
                        tooltip="Bookmark"
                        selected={verticalBookmarked}
                        onClick={() => setVerticalBookmarked((b) => !b)}
                      >
                        <BookmarkIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-expressive"
                        aria-label="Vertical speed"
                        tooltip="Speed"
                        selected={verticalSpeed === "2x"}
                        onClick={() => setVerticalSpeed((s) => (s === "1x" ? "2x" : "1x"))}
                      >
                        <RocketIcon />
                      </Button>
                    </ToolbarGroup>
                    <Button
                      variant="primary"
                      size="expressive"
                      aria-label={verticalPlaying ? "Pause" : "Play"}
                      tooltip={verticalPlaying ? "Pause" : "Play"}
                      className="h-(--toolbar-floating-action-width) w-(--button-height-expressive) rounded-full [&_svg]:size-(--icon-size-32)"
                      onClick={() => setVerticalPlaying((p) => !p)}
                    >
                      {verticalPlaying ? <PauseIcon /> : <PlayIcon />}
                    </Button>
                    <ToolbarGroup className="gap-(--space-2xs)">
                      <Button
                        variant="ghost"
                        size="icon-expressive"
                        aria-label="Vertical favorite"
                        tooltip="Favorite"
                      >
                        <HeartIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-expressive"
                        aria-label="Vertical share"
                        tooltip="Share"
                      >
                        <ShareIcon />
                      </Button>
                    </ToolbarGroup>
                  </Toolbar>
                </div>
              </div>
            </ToolbarPreview>
          )
        },
      },
      {
        name: "Variants",
        ownsCanvas: true,
        header: "inline",
        description:
          "default has a card surface and border, floating adds elevation shadow, muted sits on the muted token, and ghost is transparent.",
        layout: "wide",
        Demo: () => (
          <ToolbarPreview name="Variants" targets={toolbarVariantMeasurementTargets}>
            <div data-measure="variants" className="flex w-full flex-col gap-3">
              {(["default", "floating", "muted", "ghost"] as const).map((variant) => (
                <Toolbar
                  key={variant}
                  data-measure={`toolbar-${variant}`}
                  variant={variant}
                  shape="default"
                  className="w-full"
                >
                  <ToolbarGroup data-measure={`group-${variant}`}>
                    <Button
                      variant={variant === "ghost" ? "ghost" : "tertiary"}
                      size="default"
                    >
                      <FilterIcon data-icon="inline-start" />
                      Filter
                    </Button>
                    <Button
                      variant={variant === "ghost" ? "ghost" : "tertiary"}
                      size="default"
                    >
                      <SearchIcon data-icon="inline-start" />
                      Search
                    </Button>
                  </ToolbarGroup>
                  <ToolbarSpacer />
                  <Badge variant="secondary">{variant}</Badge>
                </Toolbar>
              ))}
            </div>
          </ToolbarPreview>
        ),
      },
      {
        name: "Text formatting",
        ownsCanvas: true,
        header: "inline",
        description:
          "Cluster related controls into button groups with separators between them — style, then alignment. Shown in both default and expressive tiers.",
        Demo: () => {
          const [formatting, setFormatting] = useState<string[]>(["bold"])
          const [align, setAlign] = useState("left")
          const [expressiveFormatting, setExpressiveFormatting] = useState<string[]>(["bold"])
          const [expressiveAlign, setExpressiveAlign] = useState("left")

          const toggleFormat = (format: string) => {
            setFormatting((current) =>
              current.includes(format)
                ? current.filter((item) => item !== format)
                : [...current, format]
            )
          }

          const toggleExpressiveFormat = (format: string) => {
            setExpressiveFormatting((current) =>
              current.includes(format)
                ? current.filter((item) => item !== format)
                : [...current, format]
            )
          }

          return (
            <ToolbarPreview
              name="Text formatting"
              targets={[
                ...toolbarMeasurementTargets,
                { target: "secondary", label: "Alignment group", kinds: ["gap"] },
              ]}
            >
              <div className="flex w-full flex-col items-center gap-(--space-xl) py-4">
                {/* Default text formatting toolbar with ButtonGroup and ButtonGroupChoice */}
                <div className="flex flex-col items-center gap-(--space-xs)">
                  <span className="text-xs text-muted-foreground">Default</span>
                  <Toolbar data-measure="toolbar" className="w-fit">
                    <ToolbarGroup data-measure="primary">
                      <ButtonGroup aria-label="Font style">
                        {([
                          ["bold", "Bold", BoldIcon],
                          ["italic", "Italic", ItalicIcon],
                          ["underline", "Underline", UnderlineIcon],
                        ] as const).map(([value, label, Icon]) => (
                          <Button
                            key={value}
                            variant="ghost"
                            size="icon"
                            aria-label={label}
                            tooltip={label}
                            selected={formatting.includes(value)}
                            onClick={() => toggleFormat(value)}
                          >
                            <Icon />
                          </Button>
                        ))}
                      </ButtonGroup>
                    </ToolbarGroup>
                    <ToolbarSeparator />
                    <ToolbarGroup data-measure="secondary">
                      <ButtonGroupChoice
                        value={align}
                        onValueChange={setAlign}
                        aria-label="Text alignment"
                      >
                        {([
                          ["left", "Align left", AlignLeftIcon],
                          ["center", "Align center", AlignCenterIcon],
                          ["right", "Align right", AlignRightIcon],
                        ] as const).map(([value, label, Icon]) => (
                          <ButtonGroupChoiceItem
                            key={value}
                            value={value}
                            variant="ghost"
                            size="icon"
                            aria-label={label}
                            tooltip={label}
                          >
                            <Icon />
                          </ButtonGroupChoiceItem>
                        ))}
                      </ButtonGroupChoice>
                    </ToolbarGroup>
                  </Toolbar>
                </div>

                {/* Expressive text formatting toolbar with ButtonGroup and ButtonGroupChoice */}
                <div className="flex flex-col items-center gap-(--space-xs)">
                  <span className="text-xs text-muted-foreground">Expressive</span>
                  <Toolbar size="expressive" shape="pill" className="w-fit">
                    <ToolbarGroup>
                      <ButtonGroup aria-label="Expressive font style">
                        {([
                          ["bold", "Bold (expressive)", BoldIcon],
                          ["italic", "Italic (expressive)", ItalicIcon],
                          ["underline", "Underline (expressive)", UnderlineIcon],
                        ] as const).map(([value, label, Icon]) => (
                          <Button
                            key={value}
                            variant="ghost"
                            size="icon-expressive"
                            aria-label={label}
                            tooltip={value.charAt(0).toUpperCase() + value.slice(1)}
                            selected={expressiveFormatting.includes(value)}
                            onClick={() => toggleExpressiveFormat(value)}
                          >
                            <Icon />
                          </Button>
                        ))}
                      </ButtonGroup>
                    </ToolbarGroup>
                    <ToolbarSeparator />
                    <ToolbarGroup>
                      <ButtonGroupChoice
                        value={expressiveAlign}
                        onValueChange={setExpressiveAlign}
                        aria-label="Expressive text alignment"
                      >
                        {([
                          ["left", "Align left (expressive)", AlignLeftIcon],
                          ["center", "Align center (expressive)", AlignCenterIcon],
                          ["right", "Align right (expressive)", AlignRightIcon],
                        ] as const).map(([value, label, Icon]) => (
                          <ButtonGroupChoiceItem
                            key={value}
                            value={value}
                            variant="ghost"
                            size="icon-expressive"
                            aria-label={label}
                            tooltip={label.replace(" (expressive)", "")}
                          >
                            <Icon />
                          </ButtonGroupChoiceItem>
                        ))}
                      </ButtonGroupChoice>
                    </ToolbarGroup>
                  </Toolbar>
                </div>
              </div>
            </ToolbarPreview>
          )
        },
      },
      {
        name: "Vertical",
        ownsCanvas: true,
        header: "inline",
        description:
          "orientation=\"vertical\" stacks the toolbar into a rail; separators and the spacer flip to match. Shown in both default and expressive tiers.",
        Demo: () => {
          const [active, setActive] = useState("home")
          const [expressiveActive, setExpressiveActive] = useState("home")

          return (
            <ToolbarPreview name="Vertical" contentClassName="max-w-md">
              <div className="flex w-full items-start justify-center gap-(--space-2xl) py-4">
                {/* Default vertical toolbar rail */}
                <div className="flex flex-col items-center gap-(--space-xs)">
                  <span className="text-xs text-muted-foreground">Default</span>
                  <Toolbar data-measure="toolbar" orientation="vertical" className="mx-auto">
                    <ToolbarGroup data-measure="primary">
                      <ButtonGroup orientation="vertical" aria-label="Navigation rail">
                        {([
                          ["home", "Home", HomeIcon],
                          ["search", "Search", SearchIcon],
                          ["bookmarks", "Bookmarks", BookmarkIcon],
                        ] as const).map(([value, label, Icon]) => (
                          <Button
                            key={value}
                            variant="ghost"
                            size="icon"
                            aria-label={label}
                            tooltip={label}
                            selected={active === value}
                            onClick={() => setActive(value)}
                          >
                            <Icon />
                          </Button>
                        ))}
                      </ButtonGroup>
                    </ToolbarGroup>
                    <ToolbarSeparator />
                    <ToolbarGroup>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Settings"
                        tooltip="Settings"
                        selected={active === "settings"}
                        onClick={() => setActive("settings")}
                      >
                        <SettingsIcon />
                      </Button>
                    </ToolbarGroup>
                  </Toolbar>
                </div>

                {/* Expressive vertical toolbar rail */}
                <div className="flex flex-col items-center gap-(--space-xs)">
                  <span className="text-xs text-muted-foreground">Expressive</span>
                  <Toolbar size="expressive" shape="pill" orientation="vertical" className="mx-auto">
                    <ToolbarGroup>
                      <ButtonGroup orientation="vertical" aria-label="Expressive navigation rail">
                        {([
                          ["home", "Expressive home", HomeIcon],
                          ["search", "Expressive search", SearchIcon],
                          ["bookmarks", "Expressive bookmarks", BookmarkIcon],
                        ] as const).map(([value, label, Icon]) => (
                          <Button
                            key={value}
                            variant="ghost"
                            size="icon-expressive"
                            aria-label={label}
                            tooltip={label.replace("Expressive ", "")}
                            selected={expressiveActive === value}
                            onClick={() => setExpressiveActive(value)}
                          >
                            <Icon />
                          </Button>
                        ))}
                      </ButtonGroup>
                    </ToolbarGroup>
                    <ToolbarSeparator />
                    <ToolbarGroup>
                      <Button
                        variant="ghost"
                        size="icon-expressive"
                        aria-label="Expressive settings"
                        tooltip="Settings"
                        selected={expressiveActive === "settings"}
                        onClick={() => setExpressiveActive("settings")}
                      >
                        <SettingsIcon />
                      </Button>
                    </ToolbarGroup>
                  </Toolbar>
                </div>
              </div>
            </ToolbarPreview>
          )
        },
      },
      {
        name: "With title",
        ownsCanvas: true,
        header: "inline",
        description:
          "The title has its own padded container, separate from the toolbar padding and trailing action group.",
        layout: "wide",
        Demo: () => (
          <ToolbarPreview name="With title" targets={[
            ...toolbarMeasurementTargets,
            { target: "title", label: "Title", kinds: ["bounds"] },
            { target: "title-container", label: "Title container", kinds: ["padding"] },
          ]}>
          <Toolbar data-measure="toolbar" className="w-full">
            <ToolbarTitle data-measure="title-container">
              <span data-measure="title">Documents</span>
            </ToolbarTitle>
            <ToolbarSpacer />
            <ToolbarGroup data-measure="primary">
              <Button variant="ghost" size="default">
                <FilterIcon data-icon="inline-start" />
                Filter
              </Button>
              <Button variant="secondary" size="default">
                <PlusIcon data-icon="inline-start" />
                New
              </Button>
            </ToolbarGroup>
          </Toolbar>
          </ToolbarPreview>
        ),
      },
    ],
  },
  {
    slug: "page",
    name: "Page",
    description:
      "A page shell that owns the scroll region: lazy inertial scroll, edge fades, scrollbar, gutters, and content entrance.",
    category: "Layout",
    Demo: PageDemo,
    code: `import { DownloadIcon, PlusIcon, RocketIcon } from "@/components/ui/icons"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Page, PageContent, PageScroll } from "@/components/ui/page"
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderEyebrow,
  PageHeaderTitle,
} from "@/components/ui/page-header"
import {
  Section,
  SectionActions,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionHeading,
  SectionTitle,
} from "@/components/ui/section"

export function PageDemo() {
  return (
    <Page>
      <PageScroll strength={0.1}>
        <PageContent variant="docs">
          <PageHeader>
            <PageHeaderContent>
              <PageHeaderEyebrow>
                <RocketIcon />
                Documentation · Release 2.0
              </PageHeaderEyebrow>
              <PageHeaderTitle>Getting started with OneDS</PageHeaderTitle>
              <PageHeaderDescription>
                A tokenized design system built on soft hardware principles, fluid spatial motion, and expressive Material color harmonies.
              </PageHeaderDescription>
            </PageHeaderContent>
            <PageHeaderActions>
              <Button variant="secondary">
                <DownloadIcon data-icon="inline-start" />
                Export specs
              </Button>
              <Button>
                <PlusIcon data-icon="inline-start" />
                New project
              </Button>
            </PageHeaderActions>
          </PageHeader>

          <Section>
            <SectionHeader>
              <SectionHeading>
                <SectionTitle>Core architecture</SectionTitle>
                <SectionDescription>
                  Explore how layout, color, and motion form a cohesive interface ladder.
                </SectionDescription>
              </SectionHeading>
            </SectionHeader>
            <SectionContent hang>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card>
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit">Tokens</Badge>
                    <CardTitle>Color harmonies</CardTitle>
                    <CardDescription>
                      Neutral surface ladder paired with deliberate tertiary and secondary container tones.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit">Layout</Badge>
                    <CardTitle>Structural blocks</CardTitle>
                    <CardDescription>
                      Page, Section, Container, Stack, and Cluster primitives with 4px grid rhythm.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit">Motion</Badge>
                    <CardTitle>Tactile physics</CardTitle>
                    <CardDescription>
                      Substantial button press springs and inertial scroll with smooth edge fades.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </SectionContent>
          </Section>
        </PageContent>
      </PageScroll>
    </Page>
  )
}`,
    examples: [
      {
        name: "Full-bleed",
        description:
          "PageBleed allows hero banners or media cards to break out of page gutters edge-to-edge.",
        Demo: PageBleedDemo,
      },
      {
        name: "Centered layout",
        description:
          "PageContent variant='centered' provides a focused viewport for auth, onboarding, and forms.",
        Demo: PageCenteredDemo,
      },
    ],
  },
]
