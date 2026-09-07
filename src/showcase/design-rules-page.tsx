import { useEffect, useRef, useState } from "react"
import { ArrowUpRightIcon, DownloadIcon, PlusIcon, SearchIcon } from "lucide-react"

import rulesDocument from "@/design-system/rules.json"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { PageHeader, PageHeaderContent, PageHeaderTitle, PageHeaderDescription } from "@/components/ui/page-header"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Stack } from "@/components/ui/stack"
import { Cluster } from "@/components/ui/cluster"
import { Section, SectionHeader, SectionHeading, SectionTitle, SectionContent } from "@/components/ui/section"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyContent } from "@/components/ui/empty"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Text } from "@/components/ui/text"
import { TableOfContents, TableOfContentsLayout, TableOfContentsContent } from "@/components/ui/table-of-contents"

type DesignRule = (typeof rulesDocument.rules)[number]

const sections = ["Foundations", "Geometry and Spacing", "Typography", "Controls", "Composition", "Motion", "Accessibility"]
const sectionId = (section: string, status: string) => `rules-${status}-${section.toLowerCase().replaceAll(" ", "-")}`

function ButtonScaleExample() {
  const exampleRef = useRef<HTMLDivElement>(null)
  const [heights, setHeights] = useState<Record<string, string>>({})

  useEffect(() => {
    const example = exampleRef.current
    if (!example) return
    const observer = new ResizeObserver(() => {
      const next: Record<string, string> = {}
      for (const button of example.querySelectorAll<HTMLElement>("[data-measure-size]")) {
        next[button.dataset.measureSize!] = `${Math.round(button.getBoundingClientRect().height)}px`
      }
      setHeights(next)
    })
    for (const button of example.querySelectorAll("[data-measure-size]")) observer.observe(button)
    return () => observer.disconnect()
  }, [])

  return (
    <Stack asChild>
      <figure>
      <Text variant="label" asChild><figcaption>Live button scale</figcaption></Text>
      <Stack ref={exampleRef} data-rules-button-scale>
        {([
          { size: "default", icon: "icon", label: "Default" },
          { size: "expressive", icon: "icon-expressive", label: "Expressive" },
        ] as const).map(({ size, icon, label }) => (
          <Cluster key={size} gap="md">
            <Text variant="metadata" tone="muted" asChild><span>{label}</span></Text>
            <Cluster wrap={false}>
              <Button size={size} data-measure-size={size}>Create</Button>
              <Button size={icon} variant="ghost" aria-label={`Create ${label.toLowerCase()} item`} data-measure-size={icon}><PlusIcon /></Button>
            </Cluster>
            <Text variant="metadata" tone="muted" asChild><output aria-label={`${label} measured label and icon heights`}>
              {heights[size] && heights[icon] ? `${heights[size]} / ${heights[icon]}` : "Measuring"}
            </output></Text>
          </Cluster>
        ))}
      </Stack>
      <Cluster><Button asChild variant="link"><a href="#/button">
        Button reference <ArrowUpRightIcon className="size-4" />
      </a></Button></Cluster>
    </figure>
    </Stack>
  )
}

function RuleEntry({ rule }: { rule: DesignRule }) {
  return (
    <Section asChild>
      <article id={rule.id} data-rule-id={rule.id} data-rule-status={rule.status}>
        <Separator />
        <SectionHeader>
          <SectionHeading>
            <Cluster>
              <Badge variant={rule.status === "approved" ? "secondary" : "outline"}>{rule.level}</Badge>
              <Text variant="metadata" tone="muted" asChild><span>{rule.enforcement.kind}</span></Text>
              <Text variant="code" tone="muted" asChild><code>{rule.id}</code></Text>
            </Cluster>
            <SectionTitle asChild><h3>{rule.title}</h3></SectionTitle>
          </SectionHeading>
        </SectionHeader>
        <SectionContent>
          <Stack>
            <Text>{rule.rule}</Text>
            {rule.example === "button-scale" && <ButtonScaleExample />}
            <Stack asChild>
              <dl>
                {[["Why", rule.why], ["Exceptions", rule.exceptions], ["Enforcement", rule.enforcement.detail]].map(([label, value]) => (
                  <Stack key={label} gap="none">
                    <Text variant="label" asChild><dt>{label}</dt></Text>
                    <Text tone="muted" asChild><dd>{value}</dd></Text>
                  </Stack>
                ))}
              </dl>
            </Stack>
            <Accordion type="single" collapsible>
              <AccordionItem value="implementation">
                <AccordionTrigger>Decision and implementation</AccordionTrigger>
                <AccordionContent>
                  <Stack>
                    <Text tone="muted">{rule.evidence}</Text>
                    {rule.tokens.length > 0 && (
                      <Cluster asChild gap="md">
                        <ul aria-label="Design tokens">
                          {rule.tokens.map(token => <li key={token}><Text variant="code" asChild><code>{token}</code></Text></li>)}
                        </ul>
                      </Cluster>
                    )}
                    <Stack asChild gap="sm">
                      <ul aria-label="Implementation source">
                        {rule.implementation.map(file => (
                          <li key={file}>
                            <Text asChild><a href={`https://github.com/bhna_microsoft/oneds/blob/main/${file}`} target="_blank" rel="noreferrer">{file}</a></Text>
                          </li>
                        ))}
                      </ul>
                    </Stack>
                  </Stack>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Stack>
        </SectionContent>
      </article>
    </Section>
  )
}

export function DesignRulesPage() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  const normalizedQuery = query.trim().toLowerCase()
  const visibleRules = rulesDocument.rules.filter(rule =>
    (status === "all" || rule.status === status) &&
    [rule.id, rule.title, rule.section, rule.rule, rule.why, rule.exceptions, rule.evidence, ...rule.tokens].join(" ").toLowerCase().includes(normalizedQuery),
  )
  const groups = ["approved", "candidate"].flatMap(approval => sections.map(section => ({
    id: sectionId(section, approval),
    section,
    approval,
    rules: visibleRules.filter(rule => rule.status === approval && rule.section === section),
  })).filter(group => group.rules.length > 0))

  return (
    <>
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>Design Rules</PageHeaderTitle>
          <PageHeaderDescription>{rulesDocument.description}</PageHeaderDescription>
        </PageHeaderContent>
      </PageHeader>
      <Stack>
      <Cluster gap="md">
        <Stack className="min-w-0 flex-1"><SearchInput value={query} onValueChange={setQuery} aria-label="Search design rules" placeholder="Search rules, tokens, or decisions" /></Stack>
        <NativeSelect aria-label="Rule approval" value={status} onChange={event => setStatus(event.target.value)}>
          <NativeSelectOption value="all">All rules</NativeSelectOption>
          <NativeSelectOption value="approved">Approved</NativeSelectOption>
          <NativeSelectOption value="candidate">Under exploration</NativeSelectOption>
        </NativeSelect>
        <Button asChild variant="secondary"><a href={`${import.meta.env.BASE_URL}design-rules.md`} download><DownloadIcon />Agent reference</a></Button>
      </Cluster>
      <Text variant="metadata" tone="muted" role="status">{visibleRules.length} rules · {visibleRules.filter(rule => rule.status === "approved").length} approved · {visibleRules.filter(rule => rule.status === "candidate").length} under exploration</Text>
      <Alert role="note"><AlertDescription><Text tone="muted">{rulesDocument.adoption}</Text></AlertDescription></Alert>
      </Stack>
      {groups.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><SearchIcon /></EmptyMedia>
            <EmptyTitle role="heading" aria-level={2}>No matching rules</EmptyTitle>
          </EmptyHeader>
          <EmptyContent><Button variant="link" onClick={() => { setQuery(""); setStatus("all") }}>Clear filters</Button></EmptyContent>
        </Empty>
      ) : (
        <TableOfContentsLayout>
          <TableOfContents aria-label="Rule contents" items={groups.map(group => ({ id: group.id, label: `${group.section}${group.approval === "candidate" ? " (candidate)" : ""}` }))} />
          <TableOfContentsContent>
            <Stack gap="2xl">
            {(["approved", "candidate"] as const).map(approval => {
              const matchingGroups = groups.filter(group => group.approval === approval)
              if (!matchingGroups.length) return null
              return (
                <Section key={approval} aria-labelledby={`rules-${approval}`}>
                  <SectionHeader><SectionTitle id={`rules-${approval}`}>{approval === "approved" ? "Approved Rules" : "Under Exploration"}</SectionTitle></SectionHeader>
                  {approval === "candidate" && <Text tone="muted">These conventions are proposed for approval. They are not new system-wide requirements.</Text>}
                  {matchingGroups.map(group => (
                    <Section key={group.id} aria-labelledby={group.id}>
                      <SectionHeader><Text variant="label" tone="muted" asChild><h2 id={group.id} tabIndex={-1}>{group.section}</h2></Text></SectionHeader>
                      {group.rules.map(rule => <RuleEntry key={rule.id} rule={rule} />)}
                    </Section>
                  ))}
                </Section>
              )
            })}
            </Stack>
          </TableOfContentsContent>
        </TableOfContentsLayout>
      )}
    </>
  )
}