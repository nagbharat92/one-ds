import { useState } from "react"
import {
  CheckCircleIcon,
  SearchIcon,
} from "@/components/ui/icons"

import notesDocument from "@/design-system/notes.json"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Stack } from "@/components/ui/stack"
import { Cluster } from "@/components/ui/cluster"
import {
  Section,
  SectionContent,
  SectionHeader,
  SectionHeading,
  SectionTitle,
} from "@/components/ui/section"

const notesPageHeader = {
  title: notesDocument.title,
  description: notesDocument.description,
} as const
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Alert, AlertContent, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Text } from "@/components/ui/text"
import {
  TableOfContents,
  TableOfContentsContent,
  TableOfContentsLayout,
} from "@/components/ui/table-of-contents"

type NoteItem = (typeof notesDocument.notes)[number]

const sections = notesDocument.sections
const sectionId = (section: string) =>
  `notes-${section.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}`

function NoteEntry({ note }: { note: NoteItem }) {
  return (
    <Section asChild>
      <article id={note.id} data-note-id={note.id} data-note-status={note.status}>
        <Separator />
        <SectionHeader>
          <SectionHeading>
            <Cluster>
              <Badge variant={note.status === "completed" ? "secondary" : "tertiary"}>
                {note.status}
              </Badge>
              <Badge variant="tertiary">{note.priority} Priority</Badge>
              <Text variant="metadata" tone="muted" asChild>
                <span>{note.category}</span>
              </Text>
              <Text variant="code" tone="muted" asChild>
                <code>{note.id}</code>
              </Text>
            </Cluster>
            <SectionTitle asChild>
              <h3>{note.title}</h3>
            </SectionTitle>
          </SectionHeading>
        </SectionHeader>
        <SectionContent>
          <Stack>
            <Alert role="note" className="border-border/60 bg-accent/30">
              <AlertContent>
                <AlertDescription className="font-medium text-foreground">
                  “{note.summary}”
                </AlertDescription>
              </AlertContent>
            </Alert>

            <Stack asChild>
              <dl>
                {[
                  ["Timeline & Context", note.context],
                  ["Details", note.details],
                  ["Architecture Reasoning", note.reasoning],
                ].map(([label, value]) => (
                  <Stack key={label} gap="none">
                    <Text variant="label" asChild>
                      <dt>{label}</dt>
                    </Text>
                    <Text tone="muted" asChild>
                      <dd>{value}</dd>
                    </Text>
                  </Stack>
                ))}
              </dl>
            </Stack>

            {note.actionItems && note.actionItems.length > 0 && (
              <Stack gap="xs">
                <Text variant="label" asChild>
                  <h4>Action plan</h4>
                </Text>
                <Stack asChild gap="xs">
                  <ul className="space-y-1.5" aria-label="Action items">
                    {note.actionItems.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircleIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                        <Text tone="muted" asChild>
                          <span>{item}</span>
                        </Text>
                      </li>
                    ))}
                  </ul>
                </Stack>
              </Stack>
            )}

            <Accordion type="single" collapsible>
              <AccordionItem value="tags">
                <AccordionTrigger>Tags and metadata</AccordionTrigger>
                <AccordionContent>
                  <Stack>
                    {note.tags.length > 0 && (
                      <Cluster asChild gap="sm">
                        <ul aria-label="Tags">
                          {note.tags.map((tag) => (
                            <li key={tag}>
                              <Text variant="code" asChild>
                                <code>#{tag}</code>
                              </Text>
                            </li>
                          ))}
                        </ul>
                      </Cluster>
                    )}
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

export function NotesPage() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [status, setStatus] = useState("all")

  const normalizedQuery = query.trim().toLowerCase()
  const visibleNotes = notesDocument.notes.filter((note) => {
    const matchesCategory = category === "all" || note.category === category
    const matchesStatus = status === "all" || note.status === status
    const matchesSearch = [
      note.id,
      note.title,
      note.category,
      note.summary,
      note.context,
      note.details,
      note.reasoning,
      ...note.tags,
      ...(note.actionItems ?? []),
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery)

    return matchesCategory && matchesStatus && matchesSearch
  })

  const groups = sections
    .map((section) => ({
      id: sectionId(section),
      section,
      notes: visibleNotes.filter((note) => note.category === section),
    }))
    .filter((group) => group.notes.length > 0)

  return (
    <>
      <Stack>
        <Cluster gap="md">
          <Stack className="min-w-0 flex-1">
            <SearchInput
              value={query}
              onValueChange={setQuery}
              aria-label="Search notes and tasks"
              placeholder="Search notes, reminders, or tags"
            />
          </Stack>
          <NativeSelect
            aria-label="Filter by category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <NativeSelectOption value="all">All categories</NativeSelectOption>
            {sections.map((sec) => (
              <NativeSelectOption key={sec} value={sec}>
                {sec}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <NativeSelect
            aria-label="Filter by status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <NativeSelectOption value="all">All statuses</NativeSelectOption>
            <NativeSelectOption value="planned">Planned</NativeSelectOption>
            <NativeSelectOption value="in-progress">In progress</NativeSelectOption>
            <NativeSelectOption value="completed">Completed</NativeSelectOption>
          </NativeSelect>
        </Cluster>
        <Text variant="metadata" tone="muted" role="status">
          {visibleNotes.length} {visibleNotes.length === 1 ? "note" : "notes"} ·{" "}
          {visibleNotes.filter((note) => note.status === "planned").length} planned
        </Text>
        <Alert role="note">
          <AlertContent>
            <AlertDescription>{notesDocument.notice}</AlertDescription>
          </AlertContent>
        </Alert>
      </Stack>

      {groups.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchIcon />
            </EmptyMedia>
            <EmptyTitle role="heading" aria-level={2}>
              No matching notes or tasks
            </EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant="link"
              onClick={() => {
                setQuery("")
                setCategory("all")
                setStatus("all")
              }}
            >
              Clear filters
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <TableOfContentsLayout>
          <TableOfContents
            aria-label="Notes contents"
            items={groups.map((group) => ({
              id: group.id,
              label: group.section,
            }))}
          />
          <TableOfContentsContent>
            <Stack gap="2xl">
              {groups.map((group) => (
                <Section key={group.id} aria-labelledby={group.id}>
                  <SectionHeader>
                    <Text variant="label" tone="muted" asChild>
                      <h2 id={group.id} tabIndex={-1}>
                        {group.section}
                      </h2>
                    </Text>
                  </SectionHeader>
                  {group.notes.map((note) => (
                    <NoteEntry key={note.id} note={note} />
                  ))}
                </Section>
              ))}
            </Stack>
          </TableOfContentsContent>
        </TableOfContentsLayout>
      )}
    </>
  )
}

export { notesPageHeader }
