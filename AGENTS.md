# OneDS Agent Instructions

## Find the rules that apply

Design rules are generated per file so you read the ones that govern the change in
hand, not all of them. Before designing or changing UI:

1. Read [public/rules/_always.md](public/rules/_always.md). Fourteen cross-cutting
   rules that bind regardless of which file you touch.
2. Read `public/rules/<slug>.md`, where the slug is the file's path with `/` and `.`
   replaced by `-` and the extension dropped. `src/components/ui/button.tsx` becomes
   `src-components-ui-button.md`. **A missing slice means no scoped rule governs that
   file.** Editing tokens in `src/index.css`: read the slice for the component that
   owns them.
3. [public/rules/index.md](public/rules/index.md) maps every governed file to its
   slice if a path is ambiguous.

Approved rules are requirements for new work. Candidate rules are proposals: do not
promote one without user approval. Existing exceptions are not precedents.

**Do not read these directly.** They are large and contain nothing you need in order
to comply: `public/design-rules.md` (full audit reference, ~27k tokens),
`src/showcase/generated-example-code.ts` (generated, ~125k tokens). A slice carries
each rule's text, exceptions, tokens and files; `why`, decision evidence and
enforcement detail exist for human review and change nothing you would write.

[src/design-system/rules.json](src/design-system/rules.json) is the canonical source.
Never edit generated Markdown. Regenerate with `npm run rules:generate`.

For agent-focused retrieval, use `#/catalog` or the plain-Node commands `npm run catalog:list`, `npm run catalog:show -- <slug>`, `npm run catalog:example -- <slug>`, and `npm run catalog:check`. The generator also writes JSON mirrors for the derived facts and base catalog data so those commands stay shell-friendly.
`catalog:show` now includes defaults, choices, and source lines for each prop, so use it before opening source when you only need allowed values. It covers each component's root props only; for named parts (`CardHeader.divider`, `CardContent.grouped`/`edgeToEdge`, `ResponseStream`) read the source file. `catalog:example <slug>` prints the default example's real source, and `catalog:check` re-extracts source to catch drift.

## Author rules sparingly

A rule is the most expensive artifact in this repo: every one of them is read on every
related change, forever. Per the charter, repetition earns abstraction, so record a new
rule only once the pattern has appeared in more than one meaningful context. Prefer a
note in the decision log for anything still settling.

Implementing an existing rule, or tuning a value, requires no new rule and no edits to
README, PRDs or memory. When a rule is warranted, include scope, exceptions, evidence,
implementation paths and honest enforcement status. Update only documentation the
change made inaccurate; avoid duplicating history.

## Change and Verify

Before editing, choose the applicable row, the cheapest check that could expose the
defect, and the required gates. This is the verification ceiling, not a starting
checklist. For mixed changes, combine only applicable gates and deduplicate.

| Change | Verification budget |
| --- | --- |
| Trivial single-value tweak (one token, CSS property, or copy string) | Typecheck and touched-file lint once. No screenshot, no rendered check, no browser, no build. Add a single rendered check only if the value's visual effect genuinely cannot be reasoned about from the code. |
| Small visual/token adjustment | Typecheck and touched-file lint once, plus one focused rendered check of the affected geometry or state. No full browser suite or build. |
| Interaction or component API | Relevant behavior tests and typecheck/lint. Include affected consumers for shared API changes; desktop and mobile when responsive layout or input modality is at risk. |
| Documentation or agent instructions only | Review the diff and check whitespace. No typecheck, build, browser, or unrelated rule tests. |
| Canonical design rules | Run `npm run test:design-rules`, which regenerates and checks every rule artifact. Do not run UI tests unless rendered behavior also changes. |
| Broad migration or release validation | Typecheck, full lint, rule and snippet checks, and affected browser regressions. Build for release validation or bundling/asset/configuration changes; keep output quiet. |

Stop when the scoped check and required gates pass. Add another check only for a named,
uncovered risk or a concrete failure, not for reassurance. A shared component filename
alone does not make a small change a broad migration. Do not run full suites by default.

- After the first substantive edit, run the cheapest focused check that can expose a
  defect. Reuse that result at close-out. Rerun only checks invalidated by later edits:
  test-only edits do not invalidate an application typecheck; docs-only edits do not
  invalidate UI checks.
- For a small visual change use one representative viewport. Add another viewport or
  input modality only when responsive layout or input behavior is affected. Check both
  appearance modes when their colors change, inside the same focused check.
- Prefer one rendered measurement or interaction check. Take at most one screenshot for
  the entire change, and only when appearance cannot be judged from that check; never
  spray a sequence of screenshots to re-confirm the same state. Inspect actual
  border-box geometry; do not infer compliance from a token name or a screenshot alone.
- Regenerate only changed artifacts. For demo changes use `npm run showcase:code` OR
  `npm run test:showcase-code` (which already generates), not both. Run snippet
  compilation when demo code, component APIs used by snippets, or the generator changes.
- Scope Playwright by file and a precise test title. Its `--grep` also matches
  filenames: broad terms such as `toolbar` can select an entire file. Do not change
  worker counts to accelerate a small task; reduce the test selection first.
- Reuse context already read unless the file changed. Do not create a memory entry for
  every small tweak or repeat the same result in updates, documentation and memory.
- Use the already-shared browser and running dev server. Keep build output quiet.
- Preserve unrelated worktree changes; never commit or deploy unless requested.
- Keep sessions short and single-purpose. Context is re-sent every turn, so a long
  chat grows slower and more expensive with each request. Compact once a task is done
  or after roughly fifteen turns, and start a fresh chat when switching to an unrelated
  task rather than continuing in the same thread.
