import { ArrowUpRightIcon, DownloadIcon, InfoIcon, SearchIcon } from "@/components/ui/icons"

import { agentCatalogEntries, type AgentCatalogEntry } from "@/showcase/agent-catalog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "@/components/code-block"
import { SearchInput } from "@/components/ui/input"
import { Stack } from "@/components/ui/stack"
import { Cluster } from "@/components/ui/cluster"
import {
  Section,
  SectionContent,
  SectionHeader,
  SectionHeading,
  SectionTitle,
} from "@/components/ui/section"
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Text } from "@/components/ui/text"
import {
  TableOfContents,
  TableOfContentsContent,
  TableOfContentsLayout,
} from "@/components/ui/table-of-contents"

const agentCatalogPageHeader = {
  title: "Agent catalog",
  description:
    "Compact retrieval index for the first pilot components. Use this page to jump from a component name to the source file, the default example, and the few props that usually matter first.",
} as const


function AgentCatalogEntry({ entry }: { entry: AgentCatalogEntry }) {
  const uniqueExampleNames = entry.exampleNames

  return (
    <Section asChild>
      <article id={`agent-catalog-${entry.slug}`} data-agent-catalog-entry={entry.slug}>
        <Separator />
        <SectionHeader>
          <SectionHeading>
            <Cluster gap="sm" align="center">
              <Badge variant="secondary">{entry.category}</Badge>
              <Badge variant="tertiary">{entry.slug}</Badge>
              <Text variant="metadata" tone="muted" asChild>
                <span>{entry.sourceFile}</span>
              </Text>
            </Cluster>
            <SectionTitle asChild>
              <h2>{entry.name}</h2>
            </SectionTitle>
          </SectionHeading>
        </SectionHeader>
        <SectionContent>
          <Stack gap="lg">
            <Text>{entry.description}</Text>

            <Alert role="note">
              <AlertIcon><InfoIcon /></AlertIcon>
              <AlertContent>
                <AlertTitle>Read first</AlertTitle>
                <AlertDescription>{entry.readFirst}</AlertDescription>
              </AlertContent>
            </Alert>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)]">
              <Stack gap="md">
                <Stack gap="xs">
                  <Text variant="label" asChild>
                    <h3>How to open it</h3>
                  </Text>
                  <Cluster gap="sm" wrap>
                    <Button asChild variant="secondary">
                      <a href={entry.route}>
                        Open component page
                        <ArrowUpRightIcon />
                      </a>
                    </Button>
                    <Button asChild variant="ghost">
                      <a href={entry.sourceLink} target="_blank" rel="noreferrer">
                        Open source file
                        <ArrowUpRightIcon />
                      </a>
                    </Button>
                  </Cluster>
                </Stack>

                <Stack gap="xs">
                  <Text variant="label" asChild>
                    <h3>Default example</h3>
                  </Text>
                  <CodeBlock
                    showLineNumbers={false}
                    code={entry.code}
                    className="w-full"
                  />
                </Stack>
              </Stack>

              <Stack gap="md">
                <Stack gap="xs">
                  <Text variant="label" asChild>
                    <h3>Primary knobs</h3>
                  </Text>
                  <Cluster asChild gap="sm">
                    <ul aria-label={`${entry.name} props`}>
                      {entry.props.map((prop) => (
                        <li key={prop}>
                          <Badge variant="tertiary">{prop}</Badge>
                        </li>
                      ))}
                    </ul>
                  </Cluster>
                </Stack>

                <Stack gap="xs">
                  <Text variant="label" asChild>
                    <h3>Examples to inspect first</h3>
                  </Text>
                  <Cluster asChild gap="sm">
                    <ul aria-label={`${entry.name} examples`}>
                      {uniqueExampleNames.map((exampleName) => (
                        <li key={exampleName}>
                          <Badge variant={exampleName === entry.defaultExampleName ? "secondary" : "tertiary"}>
                            {exampleName}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </Cluster>
                </Stack>
              </Stack>
            </div>
          </Stack>
        </SectionContent>
      </article>
    </Section>
  )
}

export function filterAgentCatalogEntries(query: string) {
  const normalizedQuery = query.trim().toLowerCase()

  return agentCatalogEntries.filter((entry) =>
    [
      entry.name,
      entry.category,
      entry.description,
      entry.sourceFile,
      entry.readFirst,
      ...entry.props,
      ...entry.exampleNames,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  )
}

function AgentCatalogToolbar({
  query,
  onQueryChange,
  visibleCount,
}: {
  query: string
  onQueryChange: (value: string) => void
  visibleCount: number
}) {
  return (
    <Stack>
      <Cluster gap="md">
        <Stack className="min-w-0 flex-1">
          <SearchInput
            value={query}
            onValueChange={onQueryChange}
            aria-label="Search the agent catalog"
            placeholder="Search Button, Card, Response, props, or examples"
          />
        </Stack>
        <DownloadManifestButton />
      </Cluster>
      <Text variant="metadata" tone="muted" role="status">
        {visibleCount} {visibleCount === 1 ? "entry" : "entries"} · {agentCatalogEntries.length} tracked components in the pilot
      </Text>
    </Stack>
  )
}

function DownloadManifestButton({ compact = false }: { compact?: boolean }) {
  return (
    <Button asChild variant="secondary" className={compact ? "rounded-full" : undefined}>
      <a href={`${import.meta.env.BASE_URL}agent-catalog.json`} download>
        <DownloadIcon />
        Download manifest
      </a>
    </Button>
  )
}

export function AgentCatalogPage({
  query,
  onQueryChange,
}: {
  query: string
  onQueryChange: (value: string) => void
}) {
  const visibleEntries = filterAgentCatalogEntries(query)

  return (
    <>
      {visibleEntries.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchIcon />
            </EmptyMedia>
            <EmptyTitle role="heading" aria-level={2}>
              No matching components
            </EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="link" onClick={() => onQueryChange("")}>Clear search</Button>
          </EmptyContent>
        </Empty>
      ) : (
        <TableOfContentsLayout>
          <TableOfContents
            aria-label="Agent catalog contents"
            items={visibleEntries.map((entry) => ({ id: `agent-catalog-${entry.slug}`, label: entry.slug }))}
          />
          <TableOfContentsContent>
            <Stack gap="2xl">
              {visibleEntries.map((entry) => (
                <AgentCatalogEntry key={entry.slug} entry={entry} />
              ))}
            </Stack>
          </TableOfContentsContent>
        </TableOfContentsLayout>
      )}
    </>
  )
}

export { agentCatalogPageHeader }
export { AgentCatalogToolbar, DownloadManifestButton }