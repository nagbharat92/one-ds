# OneDS component manifest

| Component | Purpose | When not to use | Status |
| --- | --- | --- | --- |
| card | Groups closely related content and actions within a bounded surface. | Do not use it only to decorate content that already forms a coherent page section. | built |
| section | Organizes a distinct topic or task within the page flow. | Do not use it for a small group that belongs inside another component. | built |
| grid | Arranges peer content in consistent responsive columns. | Do not use it when source order and a single reading column are more important than alignment. | built |
| page-header | Introduces the current page with its title, context, and primary actions. | Do not use it as a promotional hero or repeat it within page sections. | built |
| data-table | Presents structured records for scanning and comparison across columns. | Do not use it for unstructured content or datasets that do not benefit from column comparison. | built |
| stat | Highlights one key metric with concise supporting context. | Do not use it for prose, editable values, or metrics that need row-level comparison. | not built |
| list-item | Presents one repeatable entry in a vertical collection. | Do not use it for unrelated content or information that requires tabular alignment. | not built |
| key-value | Pairs a concise label with one corresponding value. | Do not use it for long-form content or relationships involving more than one value axis. | not built |
| quote | Distinguishes attributed quoted material from surrounding content. | Do not use it for decorative callouts or unattributed emphasis. | not built |
| media | Pairs an image, video, or audio item with related content. | Do not use it when media is merely decorative or unrelated to the accompanying content. | not built |
| button | Triggers an immediate action or state change. | Do not use it for navigation to another resource when a link is semantically correct. | built |
| chip | Displays a compact label, selection, filter, or removable value. | Do not use it for long text, primary actions, or general status prose. | built |
| tabs | Switches between peer panels while preserving their shared context. | Do not use it for sequential steps or navigation among unrelated destinations. | built |
| disclosure | Reveals or hides optional detail in place. | Do not use it to conceal information required to complete the current task. | not built |
| empty-state | Explains why no content is present and offers an appropriate next action. | Do not use it while content is still loading or when an error needs explicit recovery. | built |
| loading | Communicates that an active operation has not yet completed. | Do not use it when no work is in progress or as a substitute for an empty state. | built |
| dialog | Focuses attention on content or actions that require a response. | Do not use it for nonblocking feedback or content that belongs in the page flow. | built |
| inline-message | Communicates contextual status or feedback within the current flow. | Do not use it for blocking confirmations or unrelated global notifications. | built |
| input | Captures one line of user-entered text or data. | Do not use it for multiline content or a fixed set of choices. | built |
| menu | Presents a contextual list of commands or choices from a trigger. | Do not use it for persistent navigation or complex form content. | built |
| search-field | Captures a query used to search or filter content. | Do not use it for general text entry unrelated to finding content. | built |
| toolbar | Groups compact controls that operate on the current view or content. | Do not use it for page navigation or unrelated actions. | built |
