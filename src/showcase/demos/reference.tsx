import { Stack } from "@/components/ui/stack"
import { Cluster } from "@/components/ui/cluster"
import { Badge } from "@/components/ui/badge"
import { IconLabel } from "@/components/ui/icon-label"
import { EdgeText } from "@/components/ui/edge-text"
import { Button } from "@/components/ui/button"
import { MailIcon, ArrowRightIcon, BellIcon, ChevronLeftIcon } from "@/components/ui/icons"
import { Favicon } from "@/components/ui/favicon"
import { Spinner } from "@/components/ui/spinner"
import { Section, SectionHeader, SectionTitle } from "@/components/ui/section"
import { Text } from "@/components/ui/text"
import { TableOfContents, TableOfContentsLayout, TableOfContentsContent } from "@/components/ui/table-of-contents"
import type { ComponentEntry } from "@/showcase/types"

export const referenceDemos: ComponentEntry[] = [
  {
    slug: "icon-label",
    name: "Icon Label",
    category: "Layout",
    description: "A shared label part for optical correction beside an icon, favicon, or spinner. Adds padding opposite the graphic without changing the parent's font or gap. Button adopts ordinary labels automatically; other components compose this part explicitly. Logical sides mirror in right-to-left layouts.",
    installCommand: null,
    codeSource: "complete",
    code: "",
    Demo: () => (
      <Stack>
        <Cluster><MailIcon className="size-5" /><IconLabel>Email</IconLabel></Cluster>
        <Cluster><IconLabel>Next</IconLabel><ArrowRightIcon className="size-5" /></Cluster>
        <Cluster><Favicon domain="github.com" alt="" /><IconLabel>GitHub</IconLabel></Cluster>
        <Cluster><Spinner aria-hidden="true" /><IconLabel>Saving</IconLabel></Cluster>
        <Cluster><IconLabel>Saving</IconLabel><Spinner aria-hidden="true" /></Cluster>
      </Stack>
    ),
  },
  {
    slug: "edge-text",
    name: "Edge Text",
    category: "Layout",
    description: "Optical padding for text at the leading or trailing edge of a control row. When a padded container starts or ends with a bare text run instead of a control, the text needs a small extra inset to match the optical padding of the controls beside it. Mark the container with data-optical-edges and wrap the edge text in EdgeText; interior text and controls are unchanged. Override --optical-edge-text-padding per container, for example to a pill's corner radius.",
    installCommand: null,
    codeSource: "complete",
    code: "",
    Demo: () => (
      <Stack gap="lg" className="w-full max-w-sm">
        <Stack gap="xs">
          <Text variant="label">Without correction</Text>
          <div className="flex items-center justify-between gap-2 rounded-full border p-3">
            <span className="min-w-0 text-sm font-medium">Notifications</span>
            <Button variant="ghost" size="icon" aria-label="Open notifications"><BellIcon /></Button>
          </div>
        </Stack>
        <Stack gap="xs">
          <Text variant="label">With EdgeText</Text>
          <div data-optical-edges className="flex items-center justify-between gap-2 rounded-full border p-3">
            <EdgeText className="text-sm font-medium">Notifications</EdgeText>
            <Button variant="ghost" size="icon" aria-label="Open notifications"><BellIcon /></Button>
          </div>
        </Stack>
        <Stack gap="xs">
          <Text variant="label">Trailing edge text</Text>
          <div data-optical-edges className="flex items-center justify-between gap-2 rounded-full border p-3">
            <Button variant="ghost" size="icon" aria-label="Previous"><ChevronLeftIcon /></Button>
            <EdgeText className="text-sm font-medium">Page 3 of 12</EdgeText>
          </div>
        </Stack>
      </Stack>
    ),
  },
  {
    slug: "text",
    name: "Text",
    category: "Layout",
    description: "Shared title, heading, subheading, lead, body, label, metadata, code, and caption roles. Size and leading come from semantic tokens; asChild preserves the content's native element. Running text wraps with no orphans or widows: body copy uses pretty wrapping and headings balance their lines.",
    installCommand: null,
    codeSource: "complete",
    code: "",
    Demo: () => (
      <Stack gap="lg">
        <Stack gap="xs">
          <Cluster gap="sm" align="baseline">
            <Text variant="label">Title</Text>
            <Badge>30px / 36px</Badge>
            <Text variant="metadata" tone="muted">Page titles (H1).</Text>
          </Cluster>
          <Text variant="title">Project reference</Text>
        </Stack>
        <Stack gap="xs">
          <Cluster gap="sm" align="baseline">
            <Text variant="label">Heading</Text>
            <Badge>24px / 32px</Badge>
            <Text variant="metadata" tone="muted">Section titles (H2).</Text>
          </Cluster>
          <Text variant="heading">Decisions</Text>
        </Stack>
        <Stack gap="xs">
          <Cluster gap="sm" align="baseline">
            <Text variant="label">Subheading</Text>
            <Badge>18px / 24px</Badge>
            <Text variant="metadata" tone="muted">Subsections (H3).</Text>
          </Cluster>
          <Text variant="subheading">Open questions</Text>
        </Stack>
        <Stack gap="xs">
          <Cluster gap="sm" align="baseline">
            <Text variant="label">Lead</Text>
            <Badge>18px / 28px</Badge>
            <Text variant="metadata" tone="muted">Intro copy under a page title.</Text>
          </Cluster>
          <Text variant="lead" tone="muted">A short introduction that orients the reader before the body copy.</Text>
        </Stack>
        <Stack gap="xs">
          <Cluster gap="sm" align="baseline">
            <Text variant="label">Body</Text>
            <Badge>16px / 26px</Badge>
            <Text variant="metadata" tone="muted">Default running text and paragraphs.</Text>
          </Cluster>
          <Text>Keep project decisions in one shared reference.</Text>
        </Stack>
        <Stack gap="xs">
          <Cluster gap="sm" align="baseline">
            <Text variant="label">Label</Text>
            <Badge>14px / 21px</Badge>
            <Text variant="metadata" tone="muted">Field labels and short control captions.</Text>
          </Cluster>
          <Text variant="label">Project owner</Text>
        </Stack>
        <Stack gap="xs">
          <Cluster gap="sm" align="baseline">
            <Text variant="label">Metadata</Text>
            <Badge>14px / 21px</Badge>
            <Text variant="metadata" tone="muted">Timestamps, counts, and secondary detail.</Text>
          </Cluster>
          <Text variant="metadata" tone="muted">Updated today</Text>
        </Stack>
        <Stack gap="xs">
          <Cluster gap="sm" align="baseline">
            <Text variant="label">Code</Text>
            <Badge>14px / 21px</Badge>
            <Text variant="metadata" tone="muted">Inline tokens, identifiers, and snippets.</Text>
          </Cluster>
          <Text variant="code" asChild><code>--text-body-size</code></Text>
        </Stack>
        <Stack gap="xs">
          <Cluster gap="sm" align="baseline">
            <Text variant="label">Caption</Text>
            <Badge>12px / 16px</Badge>
            <Text variant="metadata" tone="muted">Fine print, dense tables, and chip text.</Text>
          </Cluster>
          <Text variant="caption" tone="muted">3 of 12 items selected</Text>
        </Stack>
      </Stack>
    ),
  },
  {
    slug: "table-of-contents",
    name: "Table of Contents",
    category: "Navigation",
    description: "In-page navigation with shared responsive layout parts. The desktop rail sticks within its content region; narrow layouts wrap above the content. Targets receive keyboard focus without replacing the page route.",
    installCommand: null,
    codeSource: "complete",
    code: "",
    Demo: () => (
      <TableOfContentsLayout>
        <TableOfContents items={[
          { id: "contents-overview", label: "Overview" },
          { id: "contents-decisions", label: "Decisions" },
          { id: "contents-next", label: "Next steps" },
        ]} />
        <TableOfContentsContent>
          <Stack gap="xl">
            <Section aria-labelledby="contents-overview">
              <SectionHeader><SectionTitle id="contents-overview" tabIndex={-1}>Overview</SectionTitle></SectionHeader>
              <Text>The project reference brings approved decisions and pending questions together.</Text>
            </Section>
            <Section aria-labelledby="contents-decisions">
              <SectionHeader><SectionTitle id="contents-decisions" tabIndex={-1}>Decisions</SectionTitle></SectionHeader>
              <Text>The team has agreed on the initial scope. Implementation follows the shared component library.</Text>
            </Section>
            <Section aria-labelledby="contents-next">
              <SectionHeader><SectionTitle id="contents-next" tabIndex={-1}>Next steps</SectionTitle></SectionHeader>
              <Text>Review the first iteration and record any newly approved decisions.</Text>
            </Section>
          </Stack>
        </TableOfContentsContent>
      </TableOfContentsLayout>
    ),
  },
]