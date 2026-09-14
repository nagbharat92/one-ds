import { registry } from "@/showcase/registry"
import { agentCatalogEntriesData } from "@/showcase/agent-catalog-data"
import { agentCatalogGeneratedFacts } from "@/showcase/agent-catalog-generated"

export const agentCatalogSlugs = ["button", "card", "response"] as const

export type AgentCatalogSlug = (typeof agentCatalogSlugs)[number]

export type AgentCatalogEntry = {
  slug: AgentCatalogSlug
  name: string
  category: string
  description: string
  sourceFile: string
  sourceLink: string
  route: string
  readFirst: string
  props: string[]
  api: Array<{
    name: string
    type: string
    required: boolean
    choices: ReadonlyArray<string | number | boolean> | null
    default: string | number | boolean | null
    sourceLine: number
    status: string
  }>
  fingerprint: string
  exampleNames: string[]
  defaultExampleName: string
  code: string
}

export const agentCatalogEntries: AgentCatalogEntry[] = agentCatalogSlugs.flatMap((slug) => {
  const entry = registry.find((item) => item.slug === slug)
  const focus = agentCatalogEntriesData.find((item) => item.slug === slug)
  const generated =
    slug === "button"
      ? agentCatalogGeneratedFacts.button
      : slug === "card"
        ? agentCatalogGeneratedFacts.card
        : slug === "response"
          ? agentCatalogGeneratedFacts.response
          : undefined

  if (!entry || !focus) {
    return []
  }

  return [
    {
      slug,
      name: entry.name,
      category: entry.category,
      description: entry.description,
      code: entry.code,
      defaultExampleName: focus.defaultExampleName,
      exampleNames: [...focus.exampleNames],
      sourceFile: focus.sourceFile,
      sourceLink: focus.sourceLink,
      route: focus.route,
      readFirst: focus.readFirst,
      props: generated ? [...generated.props] : [...focus.props],
      api: generated ? [...generated.api] : [],
      fingerprint: generated?.fingerprint ?? "",
    },
  ]
})
