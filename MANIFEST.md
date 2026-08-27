# OneDS component manifest

| Component | Purpose | When not to use | Status |
| --- | --- | --- | --- |
| stack | Lays out children in one column with a single deliberate rhythm between them. | Do not use it when the children need columns, alignment, or a bounded surface of their own. | built |
| cluster | Lays out children in a wrapping row with a single deliberate rhythm between them. | Do not use it when the children must stay in a fixed grid or need equal column widths. | built |
| separator | Marks a thematic break between siblings in a stack or between groups of controls in a row. | Do not use it where a bounded surface already draws an edge, or where space alone separates. | built |
| card | Groups closely related content and actions within a bounded surface. | Do not use it only to decorate content that already forms a coherent page section. | built |
| section | Organizes a distinct topic or task within the page flow. | Do not use it for a small group that belongs inside another component. | built |
| grid | Arranges peer content in consistent responsive columns. | Do not use it when source order and a single reading column are more important than alignment. | built |
| resizable | Lets a person redistribute space between adjacent panels by dragging the handle between them, along either axis or both nested together. | Do not use it for a fixed layout the reader is not meant to adjust, or for columns that should reflow responsively on their own. | built |
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
| accordion | Stacks titled sections that each reveal a passage of content in place. | Do not use it to conceal information required to complete the current task. | built |
| alert | Calls out a short, important message with an icon, title, and supporting detail in a bounded surface. | Do not use it for a single inline sentence of status or for content that requires a response before continuing. | built |
| alert-dialog | Interrupts the current workflow with an important decision that requires an explicit response. | Do not use it for nonblocking information, routine choices, or complex multi-step input. | built |
| avatar | Represents a person or entity with a small photo that falls back to initials. | Do not use it for decorative imagery or for a photo that is the primary content rather than an identity marker. | built |
| badge | Labels, categorizes, or annotates an adjacent element with a small, non-interactive marker. | Do not use it for interactive actions, long text, or standalone status messages. | built |
| breadcrumb | Shows the current page's position in the site hierarchy and lets people step back up it. | Do not use it for primary navigation or for a hierarchy only one level deep. | built |
| pagination | Moves through a sequence of pages when a dataset is split across many of them. | Do not use it for continuously loaded feeds or for a handful of items that fit on one page. | built |
| sidebar | Anchors an application's primary navigation in a docked column that groups links and collapses to an icon rail. | Do not use it for a documentation table of contents, a temporary panel, or navigation with only a handful of flat links. | built |
| disclosure | Reveals or hides optional detail in place. | Do not use it to conceal information required to complete the current task. | not built |
| empty-state | Explains why no content is present and offers an appropriate next action. | Do not use it while content is still loading or when an error needs explicit recovery. | built |
| loading | Communicates that an active operation has not yet completed. | Do not use it when no work is in progress or as a substitute for an empty state. | built |
| spinner | Shows an inline busy ring inside a control while a short action is in flight. | Do not use it as a standalone page indicator, which suits loading, or when progress can be measured. | built |
| progress | Shows how far a determinate operation has advanced toward completion. | Do not use it when completion cannot be measured; use a loading indicator instead. | built |
| skeleton | Holds the shape of content that is still loading so the layout stays stable. | Do not use it when no content exists yet, or when an operation has measurable progress. | built |
| dialog | Focuses attention on content or actions that require a response. | Do not use it for nonblocking feedback or content that belongs in the page flow. | built |
| drawer | Slides secondary content or a focused sub-task in from a screen edge without leaving the page. | Do not use it for a blocking decision, brief feedback, or content that belongs in the main page flow. | built |
| inline-message | Communicates contextual status or feedback within the current flow. | Do not use it for blocking confirmations or unrelated global notifications. | built |
| toast | Surfaces brief, non-blocking feedback at a screen edge that stacks and dismisses on its own. | Do not use it for a message that requires a response, for persistent status that belongs in the page flow, or for essential information that must not be missed. | built |
| input | Captures one line of user-entered text or data. | Do not use it for multiline content or a fixed set of choices. | built |
| textarea | Captures multi-line user-entered text and grows with its content. | Do not use it for a single-line value, which suits an input, for read-only prose, which suits a text box, or for code, commands, or prompts. | built |
| field | Hosts a control and attaches its label, description, and error, and groups related controls with a field set, field group, and choice card. | Do not wrap a self-labelling checkbox, radio, or switch in a second label, or use a choice card where a compact radio group suffices. | built |
| checkbox | Toggles one independent option on or off. | Do not use it for mutually exclusive choices or to trigger an immediate action. | built |
| combobox | Picks one or more values from a searchable list presented in a popover. | Do not use it for a short fixed set that fits a visible radio group, or when free text entry is the goal. | built |
| radio | Chooses one option from a small, mutually exclusive set that is visible at once. | Do not use it to toggle a single independent option, or for a long list better served by a combobox. | built |
| select | Chooses one value from a compact dropdown list of options. | Do not use it for a searchable set, which suits a combobox, or a small set better shown as a radio group. | built |
| switch | Toggles a single independent option on or off, applying the change immediately. | Do not use it to choose among a mutually exclusive set, or when the change should wait for a form submission. | built |
| toggle | Holds a pressed on state on a single button, such as a formatting control in a toolbar. | Do not use it for a setting that applies immediately, which suits a switch, or to trigger an action, which suits a button. | built |
| toggle-group | Chooses one option, or several, from a small set of toggle buttons that stay visible. | Do not use it for page navigation between peer panels, which suits tabs, or for a long option list better served by a select or combobox. | built |
| slider | Picks a value, or a pair of values, from a continuous range by dragging a thumb along a track. | Do not use it when an exact number is required, which suits an input, or for an on/off choice better served by a checkbox. | built |

| calendar | Presents a month of dates for choosing a single day or a range, with month and year dropdowns for navigation. | Do not use it for a date that is unambiguous as typed text, or for durations a single field captures faster. | built |
| date-picker | Binds a single date to a field: type it in the text box or pick it from the calendar in a popover. | Do not use it for a date that is unambiguous as typed text and needs no calendar, or for durations and ranges. | built |
| text-box | Presents read-only prose in a bounded surface. | Do not use it for code, commands, prompts, editable content, or prose that does not need a distinct surface. | built |
| code-block | Presents preformatted code, commands, or prompts in a bounded surface with optional wrapping and actions. | Do not use it for ordinary prose or editable content. | built |
| ai-composer | Writes and submits a conversational prompt, with attachments, tools, a model choice, and a submit control. | Do not use it for general form fields or nonconversational text entry. | built |
| menu | Presents a contextual list of commands or choices from a trigger. | Do not use it for persistent navigation or complex form content. | built |
| hover-card | Reveals supplementary detail about a link or element when the pointer rests on it or the trigger receives focus. | Do not use it for essential information, content that needs a response, or on touch devices where there is no hover. | built |
| popover | Reveals rich content or a small set of controls in a floating panel anchored to a trigger the person clicks. | Do not use it for a blocking decision, a list of commands, or supplementary detail that belongs on hover. | built |
| search-field | Captures a query used to search or filter content. | Do not use it for general text entry unrelated to finding content. | built |
| toolbar | Groups compact controls that operate on the current view or content. | Do not use it for page navigation or unrelated actions. | built |
| tooltip | Reveals a short plain-text label for a control when the pointer rests on it or the trigger receives focus. | Do not use it for essential information, interactive content, or rich detail that suits a hover card, or on touch devices where there is no hover. | built |
