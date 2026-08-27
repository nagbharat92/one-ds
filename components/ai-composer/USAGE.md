# AI Composer

Use an AI Composer to write and submit a conversational prompt, with attachments, tools, a model choice, and a submit control.

## CSS

Copy `tokens.css` and `components/ai-composer/ai-composer.css` verbatim into the output HTML's inline `<style>` block. Do not reference either file with stylesheet links or CSS imports.

## Anatomy

The composer is a `<form>` with three stacked rows. The prompt always owns its own full-width row, so the layout never changes as text wraps.

1. `ai-composer__header` — attached files. Collapses to nothing while it is empty, so it can stay in the markup.
2. `ai-composer__input` — the prompt, a `<textarea>`.
3. `ai-composer__footer` — `ai-composer__tools` on the leading side, `ai-composer__submit` on the trailing side.

## Markup

```html
<form class="ai-composer">
  <div class="ai-composer__header">
    <div class="ai-composer__attachment">
      <span class="ai-composer__attachment-preview">
        <!-- Document icon, or an <img> thumbnail -->
      </span>
      <span class="ai-composer__attachment-info">
        <span class="ai-composer__attachment-name">design-review.pdf</span>
        <span class="ai-composer__attachment-meta">248 KB</span>
      </span>
      <button class="ai-composer__attachment-remove" type="button" aria-label="Remove design-review.pdf">
        <!-- Dismiss icon -->
      </button>
    </div>
  </div>
  <textarea class="ai-composer__input" name="prompt" rows="1" placeholder="Message Copilot" aria-label="Message Copilot"></textarea>
  <div class="ai-composer__footer">
    <div class="ai-composer__tools">
      <button class="ai-composer__action" type="button" aria-label="Add photos or files" aria-haspopup="menu" aria-expanded="false">
        <!-- Add icon -->
      </button>
      <button class="ai-composer__tool" type="button" aria-pressed="false">
        <!-- Globe icon -->
        Search
      </button>
      <button class="ai-composer__select" type="button" aria-haspopup="listbox" aria-expanded="false" aria-label="Model">
        <span class="ai-composer__select-value">GPT-4o</span>
        <!-- Chevron down icon -->
      </button>
    </div>
    <button class="ai-composer__submit" type="submit" aria-label="Send message">
      <!-- Arrow up icon -->
    </button>
  </div>
</form>
```

## Parts

- `ai-composer__attachment` — one attached file. Repeat it for each file; the header wraps. Put an `<img>` in `ai-composer__attachment-preview` for an image and an icon for anything else.
- `ai-composer__action` — an icon-only control in the toolbar, such as add or dictate. Pair it with the `menu` component when it opens a list of actions.
- `ai-composer__tool` — an icon-and-label toggle. `aria-pressed` carries the on state; there is no modifier class.
- `ai-composer__select` — the trigger for a choice such as the model. It opens a `menu`; the composer only ships the trigger.
- `ai-composer__submit` — the primary action. See the status table below.
- `ai-composer__spinner` — a rotating arc to place inside the submit button while a response is pending.

Every part is optional except the prompt and the submit button. An omitted part reserves no space and no tab stop.

## Submit status

The submit button keeps one shape and swaps its content. Set the content from the conversation status.

| Status | Content | Meaning |
| --- | --- | --- |
| Ready | Arrow up icon | Nothing is in flight. Disable the button while the prompt is empty and no file is attached. |
| Pending | `ai-composer__spinner` | The request was sent and no tokens have arrived. |
| Streaming | Stop icon | A reply is arriving. Activating the button stops it. |
| Error | Error circle icon | The last request failed. Activating the button retries it. |

## Behavior

The composer is a form, so submit works without script. Product code handles the parts a form cannot: submitting on Enter and inserting a newline on Shift+Enter, adding and removing attachments, toggling `aria-pressed` on a tool, opening the menus, and swapping the submit content by status.

The prompt grows with its content up to `--oneds-component-ai-composer-input-max-height`, then scrolls. Where `field-sizing` is unsupported it stays at its minimum height and scrolls instead; keep `rows="1"` so the fallback is one line taller than the minimum, not shorter.

To show a drop target, set `data-dragging="true"` on the composer while files are held over it and remove it on drop or leave.

## Accessibility

Give the prompt an accessible name and every icon-only button a concise `aria-label`. A tool needs `aria-pressed`; a control that opens a menu needs `aria-haspopup` and `aria-expanded`. Each remove button names its file, so a screen reader hears which attachment it removes.

Focus is shown on the shell whenever anything inside it has focus, and every control keeps its own focus ring. To make the composer unavailable, disable the `<textarea>` and every rendered button; the shell then takes the disabled fill.

## When not to use

Do not use it for general form fields or nonconversational text entry. Use `input` for a single line and `text-box` for freeform multi-line text that is not a prompt.
