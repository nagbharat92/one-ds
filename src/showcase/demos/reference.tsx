import { Stack } from "@/components/ui/stack"
import { Cluster } from "@/components/ui/cluster"
import { IconLabel } from "@/components/ui/icon-label"
import { MailIcon, ArrowRightIcon } from "@/components/ui/icons"
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
    slug: "text",
    name: "Text",
    category: "Layout",
    description: "Shared body, label, metadata, and code roles. Size and leading come from semantic tokens; asChild preserves the content's native element.",
    installCommand: null,
    codeSource: "complete",
    code: "",
    Demo: () => (
      <Stack>
        <Text>Keep project decisions in one shared reference.</Text>
        <Text variant="label">Project owner</Text>
        <Text variant="metadata" tone="muted">Updated today</Text>
        <Text variant="code" asChild><code>--text-body-size</code></Text>
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