import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BoldIcon,
  BluetoothIcon,
  BookmarkIcon,
  ChevronDownIcon,
  CopyIcon,
  DownloadIcon,
  ItalicIcon,
  MailIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  UnderlineIcon,
  WifiIcon,
  MoonIcon,
} from "@/components/ui/icons"

import type { ComponentEntry } from "@/showcase/types"
import { persona } from "@/lib/persona"
import { Badge } from "@/components/ui/badge"
import { Button, ButtonSelectionIcon } from "@/components/ui/button"
import {
  ButtonGroup,
  ButtonGroupChoice,
  ButtonGroupChoiceItem,
} from "@/components/ui/button-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Favicon } from "@/components/ui/favicon"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChoiceCard,
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input, SearchInput } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Kbd } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Stack } from "@/components/ui/stack"
import { Cluster } from "@/components/ui/cluster"
import { Text } from "@/components/ui/text"

function ConnectedButtonGroupsDemo() {
  return (
    <Stack gap="lg">
      {(["default", "expressive"] as const).map(size => (
        <Stack key={size}>
          <ButtonGroupChoice defaultValue="center" aria-label={`Alignment ${size}`}>
            {([
              ["left", "Align left", AlignLeftIcon],
              ["center", "Align center", AlignCenterIcon],
              ["right", "Align right", AlignRightIcon],
              ["justify", "Justify", AlignJustifyIcon],
            ] as const).map(([value, label, Icon]) => (
              <ButtonGroupChoiceItem key={value} value={value} variant="secondary"
                size={size === "expressive" ? "icon-expressive" : "icon"} aria-label={label} tooltip={label}>
                <Icon />
              </ButtonGroupChoiceItem>
            ))}
          </ButtonGroupChoice>
          <ButtonGroupChoice defaultValue="8" aria-label={`Serving size ${size}`}>
            {["8", "12", "16", "20"].map(value => (
              <ButtonGroupChoiceItem key={value} value={value} size={size} variant="secondary">
                {value} oz
              </ButtonGroupChoiceItem>
            ))}
          </ButtonGroupChoice>
        </Stack>
      ))}
    </Stack>
  )
}

function IndependentButtonGroupDemo() {
  const [enabled, setEnabled] = useState(["wifi"])
  return (
    <ButtonGroup aria-label="Quick settings">
      {([
        ["bluetooth", "Bluetooth", BluetoothIcon],
        ["focus", "Focus", MoonIcon],
        ["wifi", "Wi-Fi", WifiIcon],
      ] as const).map(([value, label, Icon]) => (
        <Button key={value} variant="secondary" size="icon-expressive"
          aria-label={label} selected={enabled.includes(value)}
          onClick={() => setEnabled(current => current.includes(value)
            ? current.filter(item => item !== value) : [...current, value])}>
          <Icon />
        </Button>
      ))}
    </ButtonGroup>
  )
}

function SelectedButtonDemo({ size = "default", variant = "tertiary", disabled = false }: {
  size?: "default" | "expressive" | "icon" | "icon-expressive"
  variant?: "secondary" | "tertiary"
  disabled?: boolean
}) {
  const [selected, setSelected] = useState(true)
  const iconOnly = size === "icon" || size === "icon-expressive"
  return (
    <Button size={size} variant={variant} selected={selected} disabled={disabled}
      aria-label={iconOnly ? "Bookmark item" : undefined}
      onClick={() => setSelected(current => !current)}>
      <ButtonSelectionIcon><BookmarkIcon /></ButtonSelectionIcon>
      {iconOnly ? null : "Selected"}
    </Button>
  )
}

function ButtonSelectionDemo() {
  return (
    <Stack gap="lg">
      {(["default", "expressive"] as const).map(size => (
        <Cluster key={size}>
          <SelectedButtonDemo size={size} />
          <SelectedButtonDemo size={size} variant="secondary" />
          <SelectedButtonDemo size={size === "default" ? "icon" : "icon-expressive"} />
          <SelectedButtonDemo size={size} disabled />
        </Cluster>
      ))}
    </Stack>
  )
}

function ButtonMotionDemo() {
  const [saved, setSaved] = useState(0)
  return (
    <Stack>
      {(["default", "expressive"] as const).map(size => (
        <Cluster key={size}>
          <Button size={size} onClick={() => setSaved(count => count + 1)}><PlusIcon />Save change</Button>
          <Button size={size} variant="secondary" onClick={() => setSaved(count => count + 1)}>Save a copy</Button>
          <Button size={size === "expressive" ? "icon-expressive" : "icon"} variant="ghost" aria-label={`Add ${size} change`} onClick={() => setSaved(count => count + 1)}><PlusIcon /></Button>
          <Button size={size} disabled><Spinner aria-hidden="true" />Saving</Button>
          <Button size={size} variant="link" asChild><a href="#/rules">Design rules<ArrowUpRightIcon /></a></Button>
        </Cluster>
      ))}
      <Text variant="metadata" tone="muted" role="status">{saved} changes saved</Text>
    </Stack>
  )
}

function ButtonToolsDemo({ mixed = false }: { mixed?: boolean }) {
  const [notes, setNotes] = useState(["Design review", "Release notes"])
  const [query, setQuery] = useState("")
  const [order, setOrder] = useState("newest")
  const [nextNote, setNextNote] = useState(1)
  const filtered = notes.filter(note => note.toLowerCase().includes(query.trim().toLowerCase()))
  const visible = order === "name" ? [...filtered].sort((left, right) => left.localeCompare(right)) : [...filtered].reverse()
  const variant = mixed ? "tertiary" : "ghost"

  return (
    <Stack className="w-full max-w-xl">
      <Cluster>
        {mixed && <>
          <Stack className="min-w-0 flex-1 basis-48"><SearchInput aria-label="Search notes" placeholder="Search notes" value={query} onValueChange={setQuery} /></Stack>
          <Select value={order} onValueChange={setOrder}>
            <SelectTrigger aria-label="Sort notes"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </>}
        <ButtonGroup aria-label="Note actions">
          <Button variant={variant} size="icon" aria-label="Add note" onClick={() => {
            setNotes(current => [...current, `Note ${nextNote}`])
            setNextNote(current => current + 1)
          }}><PlusIcon /></Button>
          <Button variant={variant} size="icon" aria-label="Remove latest note" disabled={notes.length === 0} onClick={() => setNotes(current => current.slice(0, -1))}><Trash2Icon /></Button>
        </ButtonGroup>
      </Cluster>
      <Text variant="metadata" tone="muted" role="status">{visible.length} {visible.length === 1 ? "note" : "notes"}</Text>
      <Stack gap="sm" asChild><ul aria-label="Notes">{visible.map(note => <li key={note}><Text>{note}</Text></li>)}</ul></Stack>
    </Stack>
  )
}

function FormDemo() {
  const schema = z.object({
    username: z.string().min(2, { message: "At least 2 characters." }),
  })
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { username: "" },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {})}
        className="w-full max-w-sm space-y-6"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder={persona.handle} {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

function FormValidationDemo() {
  const schema = z.object({
    email: z.string().email({ message: "Enter a valid email address." }),
    password: z.string().min(8, { message: "Use at least 8 characters." }),
  })
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {})}
        className="w-full max-w-sm space-y-6"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create account</Button>
      </form>
    </Form>
  )
}

function FormControlsDemo() {
  const schema = z.object({
    role: z.string().min(1, { message: "Pick a role." }),
    marketing: z.boolean(),
    terms: z
      .boolean()
      .refine((value) => value, { message: "You must accept the terms." }),
  })
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { role: "", marketing: true, terms: false },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {})}
        className="w-full max-w-sm space-y-6"
      >
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="marketing"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between gap-4">
              <div className="grid gap-1">
                <FormLabel>Product updates</FormLabel>
                <FormDescription>Occasional release notes.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Accept terms and conditions</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save preferences</Button>
      </form>
    </Form>
  )
}

function FormSubmittingDemo() {
  const schema = z.object({
    message: z.string().min(1, { message: "Write a message first." }),
  })
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { message: "" },
  })
  const { isSubmitting } = form.formState

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          () => new Promise((resolve) => setTimeout(resolve, 1500)),
        )}
        className="w-full max-w-sm space-y-6"
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="How can we help?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : null}
          {isSubmitting ? "Sending" : "Send message"}
        </Button>
      </form>
    </Form>
  )
}

function NestedToolbarDemo() {
  const [align, setAlign] = useState("left")
  const [formatting, setFormatting] = useState<string[]>([])
  return (
    <ButtonGroup aria-label="Text formatting">
      <ButtonGroup aria-label="Font style">
        {([
          ["bold", "Bold", BoldIcon],
          ["italic", "Italic", ItalicIcon],
          ["underline", "Underline", UnderlineIcon],
        ] as const).map(([value, label, Icon]) => (
          <Button key={value} variant="tertiary" size="icon" aria-label={label}
            selected={formatting.includes(value)}
            onClick={() => setFormatting(current => current.includes(value)
              ? current.filter(item => item !== value) : [...current, value])}>
            <Icon />
          </Button>
        ))}
      </ButtonGroup>
      <ButtonGroupChoice value={align} onValueChange={setAlign} aria-label="Text alignment">
        {([
          ["left", "Align left", AlignLeftIcon],
          ["center", "Align center", AlignCenterIcon],
          ["right", "Align right", AlignRightIcon],
        ] as const).map(([value, label, Icon]) => (
          <ButtonGroupChoiceItem key={value} value={value} variant="tertiary" size="icon"
            aria-label={label} tooltip={label}>
            <Icon />
          </ButtonGroupChoiceItem>
        ))}
      </ButtonGroupChoice>
    </ButtonGroup>
  )
}

function ButtonLoadingDemo({ size = "default" }: { size?: "default" | "expressive" }) {
  const [loading, setLoading] = useState(false)
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size={size} disabled aria-busy>
        <Spinner aria-hidden="true" />
        Please wait
      </Button>
      <Button
        size={size}
        disabled={loading}
        aria-busy={loading}
        onClick={() => {
          setLoading(true)
          setTimeout(() => setLoading(false), 2000)
        }}
      >
        {loading && <Spinner aria-hidden="true" />}
        {loading ? "Saving..." : "Click to save"}
      </Button>
    </div>
  )
}

function OTPControlledDemo() {
  const [value, setValue] = useState("")
  return (
    <div className="space-y-2">
      <InputOTP maxLength={6} value={value} onChange={setValue}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-sm text-muted-foreground">
        Entered: {value || "Nothing yet"}
      </p>
    </div>
  )
}

function OTPFormDemo() {
  const otpSchema = z.object({
    pin: z.string().min(6, { message: "Enter all 6 digits." }),
  })
  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { pin: "" },
  })
  const [submitted, setSubmitted] = useState(false)
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => setSubmitted(true))}
        className="w-full max-w-sm space-y-4"
      >
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-time password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>Enter the code sent to your phone.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Verify</Button>
        {submitted && <p className="text-sm font-medium text-primary">Verified successfully.</p>}
      </form>
    </Form>
  )
}

function InputFormDemo() {
  const inputSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    username: z.string().min(3, { message: "At least 3 characters." }),
  })
  const form = useForm<z.infer<typeof inputSchema>>({
    resolver: zodResolver(inputSchema),
    defaultValues: { email: "", username: "" },
  })
  const [submitted, setSubmitted] = useState(false)
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => setSubmitted(true))}
        className="w-full max-w-sm space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormDescription>Your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create account</Button>
        {submitted && <p className="text-sm font-medium text-primary">Account created.</p>}
      </form>
    </Form>
  )
}

export const formsDemos: ComponentEntry[] = [
  {
    slug: "button",
    name: "Button",
    codeSource: "complete",
    description: "Tertiary is the neutral default for general actions. Choose Primary or Secondary explicitly for tonal emphasis. Selected buttons retain their square-to-round selection behavior.",
    category: "Forms",
    Demo: () => (
      <div className="flex flex-col gap-6">
        {(["default", "expressive"] as const).map((size) => (
          <div key={size} className="flex flex-wrap items-center gap-3">
            <Button size={size} variant="primary">Primary</Button>
            <Button size={size} variant="secondary">Secondary</Button>
            <Button size={size}>Tertiary</Button>
            <Button size={size} variant="destructive">Destructive</Button>
            <SelectedButtonDemo size={size} />
            <Button size={size} variant="ghost">Ghost</Button>
            <Button size={size} variant="link">Link</Button>
          </div>
        ))}
      </div>
    ),
    code: `import { Button } from "@/components/ui/button"

export function ButtonDemo() {
  return (
    <div className="flex flex-col gap-6">
      {(["default", "expressive"] as const).map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-3">
          <Button size={size} variant="primary">Primary</Button>
          <Button size={size} variant="secondary">Secondary</Button>
          <Button size={size}>Tertiary</Button>
          <Button size={size} variant="destructive">Destructive</Button>
          <SelectedButtonDemo size={size} />
          <Button size={size} variant="ghost">Ghost</Button>
          <Button size={size} variant="link">Link</Button>
        </div>
      ))}
    </div>
  )
}`,
    examples: [
      {
        name: "Selected",
        description: "Selected Tertiary uses light purple; selected Secondary uses dark gray-purple. Both become round and switch icon state. Primary is reserved for prominent calls to action, not selection.",
        Demo: ButtonSelectionDemo,
      },
      {
        name: "Sizes",
        Demo: () => (
          <div className="flex flex-wrap items-center gap-3">
            <Button size="default">Default</Button>
            <Button size="expressive">Expressive</Button>
          </div>
        ),
      },
      {
        name: "Motion",
        description: "A small downward push and compression spring back on release, with unchanged corners and no layout shift. Fast effects handle colors separately. Reduced motion removes the push; the corner morph is reserved for a future opt-in treatment.",
        Demo: () => <ButtonMotionDemo />,
      },
      {
        name: "Icon Only",
        Demo: () => (
          <Stack gap="lg">
            {(["icon", "icon-expressive"] as const).map(size => (
              <Cluster key={size}>
                {(["primary", "secondary", "tertiary", "ghost", "destructive", "link"] as const).map(variant => (
                  <Button key={variant} size={size} variant={variant} aria-label={`Add ${variant}`}>
                    <PlusIcon />
                  </Button>
                ))}
              </Cluster>
            ))}
          </Stack>
        ),
      },
      {
        name: "With Icon",
        Demo: () => (
          <div className="flex flex-col gap-6">
            {(["default", "expressive"] as const).map((size) => (
              <div key={size} className="flex flex-wrap items-center gap-3">
                <Button size={size}><MailIcon data-icon="inline-start" />Login with email</Button>
                <Button size={size} variant="secondary"><DownloadIcon data-icon="inline-start" />Download</Button>
                <Button size={size} variant="secondary">Next<ArrowRightIcon data-icon="inline-end" /></Button>
              </div>
            ))}
          </div>
        ),
      },
      {
        name: "Optical Spacing",
        description: "Icon, favicon, and spinner labels receive 4px padding on the outer side opposite the graphic. The icon-label gap remains 8px; text-only and icon-only buttons are unchanged.",
        Demo: () => (
          <Stack>
            {(["default", "expressive"] as const).map(size => (
              <Cluster key={size}>
                <Button size={size} variant="secondary" data-optical-case="leading"><MailIcon />Email</Button>
                <Button size={size} variant="secondary" data-optical-case="trailing">Next<ArrowRightIcon /></Button>
                <Button size={size} variant="secondary" data-optical-case="favicon-leading"><Favicon domain="github.com" alt="" />GitHub</Button>
                <Button size={size} variant="secondary" data-optical-case="favicon-trailing">GitHub<Favicon domain="github.com" alt="" /></Button>
                <Button size={size} variant="secondary" disabled aria-busy data-optical-case="spinner-leading"><Spinner aria-hidden="true" />Saving</Button>
                <Button size={size} variant="secondary" disabled aria-busy data-optical-case="spinner-trailing">Saving<Spinner aria-hidden="true" /></Button>
                <Button size={size} variant="secondary" data-optical-case="wrapped"><DownloadIcon /><span>Download</span></Button>
                <Button size={size} variant="secondary" data-optical-case="text">Continue</Button>
                <Button size={size === "expressive" ? "icon-expressive" : "icon"} variant="ghost" aria-label="Add item" data-optical-case="icon"><PlusIcon /></Button>
                <Button size={size} variant="link" asChild data-optical-case="link"><a href="#/rules">Design Rules<ArrowUpRightIcon /></a></Button>
              </Cluster>
            ))}
          </Stack>
        ),
      },
      {
        name: "Favicon",
        description:
          "Site favicons (always fetched from DuckDuckGo) work as the icon in any button type.",
        Demo: () => (
          <div className="flex flex-col gap-6">
            {(["default", "expressive"] as const).map((size) => (
              <div key={size} className="flex flex-wrap items-center gap-3">
                <Button size={size} variant="secondary"><Favicon domain="github.com" data-icon="inline-start" />GitHub</Button>
                <Button size={size} variant="secondary"><Favicon domain="figma.com" data-icon="inline-start" />Figma</Button>
                <Button size={size}><Favicon domain="spotify.com" data-icon="inline-start" />Spotify</Button>
                <Button variant="ghost" size={size === "expressive" ? "icon-expressive" : "icon"} aria-label="X"><Favicon domain="x.com" /></Button>
                <Button variant="ghost" size={size === "expressive" ? "icon-expressive" : "icon"} aria-label="YouTube"><Favicon domain="youtube.com" /></Button>
                <Button variant="ghost" size={size === "expressive" ? "icon-expressive" : "icon"} aria-label="Google"><Favicon domain="google.com" /></Button>
              </div>
            ))}
          </div>
        ),
      },
      {
        name: "Favicon Sizes",
        description:
          "The favicon scales with the button size, matching how icons size.",
        Demo: () => (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary"><Favicon domain="x.com" data-icon="inline-start" />Default</Button>
              <Button size="expressive" variant="secondary"><Favicon domain="x.com" data-icon="inline-start" />Expressive</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="icon" variant="ghost" aria-label="X"><Favicon domain="x.com" /></Button>
              <Button size="icon-expressive" variant="ghost" aria-label="X"><Favicon domain="x.com" /></Button>
            </div>
          </div>
        ),
      },
      {
        name: "Rounded",
        Demo: () => (
          <div className="flex flex-col gap-6">
            {(["default", "expressive"] as const).map((size) => (
              <div key={size} className="flex flex-wrap items-center gap-3">
                <Button size={size} className="rounded-full">Default</Button>
                <Button size={size} variant="secondary" className="rounded-full">Secondary</Button>
                <Button variant="ghost" size={size === "expressive" ? "icon-expressive" : "icon"} className="rounded-full" aria-label="Add"><PlusIcon /></Button>
              </div>
            ))}
          </div>
        ),
      },
      {
        name: "Loading",
        description: "Default and expressive sizes support the same loading behavior. Click a save action to try it.",
        Demo: () => (
          <div className="flex flex-col gap-6">
            <ButtonLoadingDemo />
            <ButtonLoadingDemo size="expressive" />
          </div>
        ),
      },
      {
        name: "Icon Tools",
        description: "Use ghost for an icon-only action cluster with no neighboring fields or mixed controls.",
        Demo: () => <ButtonToolsDemo />,
      },
      {
        name: "Mixed Tools",
        description: "Use Tertiary for general supporting tools beside search, select, or other controls in the same local row.",
        Demo: () => <ButtonToolsDemo mixed />,
      },
      {
        name: "As Child",
        description:
          "Renders button styling on a link. Links always show an arrow icon to signal navigation.",
        Demo: () => (
          <div className="flex flex-col gap-6">
            {(["default", "expressive"] as const).map((size) => (
              <div key={size} className="flex flex-wrap items-center justify-center gap-2">
                {([
                  "primary",
                  "secondary",
                  "tertiary",
                  "destructive",
                  "ghost",
                  "link",
                ] as const).map((variant) => (
                  <Button key={variant} size={size} variant={variant} asChild>
                    <a href="#" onClick={(event) => event.preventDefault()}>
                      Login
                      <ArrowUpRightIcon />
                    </a>
                  </Button>
                ))}
              </div>
            ))}
          </div>
        ),
      },
    ],
  },
  {
    slug: "button-group",
    name: "Button Group",
    codeSource: "complete",
    description: "Connected buttons with soft inner corners, rounded ends, and separated fills. Selection changes shape and color without resizing neighboring actions.",
    category: "Forms",
    Demo: ConnectedButtonGroupsDemo,
    code: `import { ButtonGroupChoice, ButtonGroupChoiceItem } from "@/components/ui/button-group"

export function ButtonGroupDemo() {
  return (
    <ButtonGroupChoice defaultValue="8" aria-label="Serving size">
      {["8", "12", "16", "20"].map(value => (
        <ButtonGroupChoiceItem key={value} value={value} variant="secondary">{value} oz</ButtonGroupChoiceItem>
      ))}
    </ButtonGroupChoice>
  )
}`,
    examples: [
      {
        name: "Choice",
        description:
          "Select one value immediately. Labels center at rest and animate aside for the selected checkmark; button widths already include its space.",
        Demo: () => (
          <ButtonGroupChoice defaultValue="8" aria-label="Serving size">
            <ButtonGroupChoiceItem value="8">8 oz</ButtonGroupChoiceItem>
            <ButtonGroupChoiceItem value="12">12 oz</ButtonGroupChoiceItem>
            <ButtonGroupChoiceItem value="16">16 oz</ButtonGroupChoiceItem>
            <ButtonGroupChoiceItem value="20" disabled>20 oz</ButtonGroupChoiceItem>
          </ButtonGroupChoice>
        ),
      },
      {
        name: "Independent toggles",
        Demo: IndependentButtonGroupDemo,
      },
      {
        name: "Orientation",
        Demo: () => (
          <div className="flex flex-wrap items-start gap-6">
            <ButtonGroup orientation="horizontal">
              <Button variant="secondary">Left</Button>
              <Button variant="secondary">Center</Button>
              <Button variant="secondary">Right</Button>
            </ButtonGroup>
            <ButtonGroup orientation="vertical">
              <Button variant="secondary">Top</Button>
              <Button variant="secondary">Middle</Button>
              <Button variant="secondary">Bottom</Button>
            </ButtonGroup>
          </div>
        ),
      },
      {
        name: "Sizes",
        Demo: () => (
          <div className="flex flex-wrap items-center gap-3">
            <ButtonGroup>
              <Button variant="secondary">Default</Button>
              <Button variant="secondary">Group</Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button variant="secondary" size="expressive">Expressive</Button>
              <Button variant="secondary" size="expressive">Group</Button>
            </ButtonGroup>
          </div>
        ),
      },
      {
        name: "Nested",
        description:
          "Cluster related actions into their own groups within one toolbar \u2014 here text styling and alignment.",
        Demo: () => <NestedToolbarDemo />,
      },
      {
        name: "Split",
        description: "A neutral action with a dropdown for alternatives. Use Primary only when the split action is a prominent call to action.",
        Demo: () => (
          <ButtonGroup>
            <Button variant="tertiary">Save</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="tertiary" size="icon" aria-label="More save options">
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Save as draft</DropdownMenuItem>
                <DropdownMenuItem>Save and publish</DropdownMenuItem>
                <DropdownMenuItem>Save as template</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        ),
      },
      {
        name: "Input",
        description: "Text input with separated actions.",
        Demo: () => (
          <ButtonGroup className="w-full max-w-sm">
            <Input placeholder="Search..." />
            <Button variant="secondary">Search</Button>
          </ButtonGroup>
        ),
        layout: "wide",
      },
      {
        name: "Input Group",
        description: "InputGroup composed with a button group.",
        Demo: () => (
          <ButtonGroup className="w-full max-w-sm">
            <InputGroup>
              <InputGroupAddon><MailIcon /></InputGroupAddon>
              <InputGroupInput placeholder="Email address" />
            </InputGroup>
            <Button>Subscribe</Button>
          </ButtonGroup>
        ),
        layout: "wide",
      },
      {
        name: "Dropdown Menu",
        Demo: () => (
          <ButtonGroup>
            <Button variant="secondary">Actions</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" aria-label="More actions">
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        ),
      },
      {
        name: "Select",
        Demo: () => (
          <ButtonGroup>
            <Button variant="secondary">Sort by</Button>
            <Select defaultValue="name">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </ButtonGroup>
        ),
      },
      {
        name: "Popover",
        Demo: () => (
          <ButtonGroup>
            <Button variant="secondary">Dimensions</Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary" size="icon" aria-label="Set dimensions">
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-48">
                <div className="grid gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="demo-bg-popover-w">Width</Label>
                    <Input id="demo-bg-popover-w" defaultValue="100%" />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="demo-bg-popover-h">Height</Label>
                    <Input id="demo-bg-popover-h" defaultValue="auto" />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </ButtonGroup>
        ),
      },
    ],
  },
  {
    slug: "input",
    name: "Input",
    description: "Displays a form input field or a component that looks like one.",
    category: "Forms",
    Demo: () => (
      <div className="grid w-full max-w-sm gap-3">
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Password" />
        <Input disabled placeholder="Disabled" />
      </div>
    ),
    code: `import { Input } from "@/components/ui/input"

export function InputDemo() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Input disabled placeholder="Disabled" />
    </div>
  )
}`,
    examples: [
      {
        name: "Field",
        description: "Input with a label using the Field component.",
        Demo: () => (
          <Field className="w-full max-w-sm">
            <FieldLabel htmlFor="demo-input-field-email">Email</FieldLabel>
            <Input id="demo-input-field-email" type="email" placeholder="you@example.com" />
          </Field>
        ),
      },
      {
        name: "Field Group",
        Demo: () => (
          <FieldGroup className="w-full max-w-sm">
            <Field>
              <FieldLabel htmlFor="demo-input-fg-first">First name</FieldLabel>
              <Input id="demo-input-fg-first" placeholder="Jane" />
            </Field>
            <Field>
              <FieldLabel htmlFor="demo-input-fg-last">Last name</FieldLabel>
              <Input id="demo-input-fg-last" placeholder="Doe" />
            </Field>
          </FieldGroup>
        ),
        layout: "wide",
      },
      {
        name: "Invalid",
        Demo: () => (
          <div className="w-full max-w-sm space-y-1.5">
            <Label htmlFor="demo-input-invalid">Email</Label>
            <Input id="demo-input-invalid" type="email" aria-invalid="true" defaultValue="not-an-email" />
            <p className="text-sm text-destructive">Please enter a valid email.</p>
          </div>
        ),
      },
      {
        name: "File",
        Demo: () => (
          <div className="grid w-full max-w-sm gap-1.5">
            <Label htmlFor="demo-input-file">Upload file</Label>
            <Input id="demo-input-file" type="file" />
          </div>
        ),
      },
      {
        name: "Inline",
        description: "Label and input side by side.",
        Demo: () => (
          <Field orientation="horizontal" className="w-full max-w-sm">
            <FieldLabel htmlFor="demo-input-inline">Width</FieldLabel>
            <Input id="demo-input-inline" className="max-w-24" defaultValue="100%" />
          </Field>
        ),
      },
      {
        name: "Grid",
        description: "Inputs arranged in a responsive grid.",
        Demo: () => (
          <div className="grid w-full max-w-lg grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="demo-input-grid-first">First name</Label>
              <Input id="demo-input-grid-first" placeholder="Jane" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="demo-input-grid-last">Last name</Label>
              <Input id="demo-input-grid-last" placeholder="Doe" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="demo-input-grid-email">Email</Label>
              <Input id="demo-input-grid-email" type="email" placeholder="you@example.com" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="demo-input-grid-phone">Phone</Label>
              <Input id="demo-input-grid-phone" type="tel" placeholder="+1 (555) 000-0000" />
            </div>
          </div>
        ),
        layout: "wide",
      },
      {
        name: "Required",
        Demo: () => (
          <div className="grid w-full max-w-sm gap-1.5">
            <Label htmlFor="demo-input-required">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input id="demo-input-required" type="email" required placeholder="you@example.com" />
          </div>
        ),
      },
      {
        name: "Badge",
        description: "Input with a badge indicating status.",
        Demo: () => (
          <div className="grid w-full max-w-sm gap-1.5">
            <div className="flex items-center gap-2">
              <Label htmlFor="demo-input-badge">API key</Label>
              <Badge variant="secondary">Required</Badge>
            </div>
            <Input id="demo-input-badge" placeholder="sk-..." />
          </div>
        ),
      },
      {
        name: "Input Group",
        Demo: () => (
          <div className="grid w-full max-w-sm gap-3">
            <InputGroup>
              <InputGroupAddon><SearchIcon /></InputGroupAddon>
              <InputGroupInput placeholder="Search..." />
            </InputGroup>
            <InputGroup>
              <InputGroupInput placeholder="you@example.com" />
              <InputGroupAddon align="inline-end">
                <InputGroupButton><ArrowRightIcon /></InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
        ),
      },
      {
        name: "Button Group",
        description: "Input joined with action buttons.",
        Demo: () => (
          <ButtonGroup className="w-full max-w-sm">
            <Input placeholder="Enter URL..." />
            <Button variant="secondary"><CopyIcon data-icon="inline-start" />Copy</Button>
          </ButtonGroup>
        ),
        layout: "wide",
      },
      {
        name: "Search",
        description: "Rounded, self-contained search variant with a clear button.",
        Demo: () => (
          <div className="grid w-full max-w-sm gap-3">
            <SearchInput placeholder="Search" />
            <SearchInput defaultValue="Design tokens" />
            <SearchInput disabled placeholder="Search" />
          </div>
        ),
      },
      {
        name: "Form",
        description: "Multiple inputs in a validated form.",
        Demo: () => <InputFormDemo />,
        layout: "wide",
      },
    ],
  },
  {
    slug: "input-group",
    name: "Input Group",
    description: "Compose inputs with addons like icons, buttons, and text.",
    category: "Forms",
    Demo: () => (
      <div className="grid w-full max-w-sm gap-3">
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search..." />
        </InputGroup>
        <InputGroup>
          <InputGroupAddon>
            <MailIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="you@example.com" />
        </InputGroup>
      </div>
    ),
    code: `import { SearchIcon } from "@/components/ui/icons"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export function InputGroupDemo() {
  return (
    <InputGroup>
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search..." />
    </InputGroup>
  )
}`,
    examples: [
      {
        name: "Block Alignment",
        description: "Addon content placed above or below the input.",
        Demo: () => (
          <div className="grid w-full max-w-sm gap-3">
            <InputGroup>
              <InputGroupAddon align="block-start">
                <span className="text-sm">Label above</span>
              </InputGroupAddon>
              <InputGroupInput placeholder="Block start..." />
            </InputGroup>
            <InputGroup>
              <InputGroupInput placeholder="Block end..." />
              <InputGroupAddon align="block-end">
                <span className="text-sm text-muted-foreground">Helper text below</span>
              </InputGroupAddon>
            </InputGroup>
          </div>
        ),
      },
      {
        name: "Text",
        Demo: () => (
          <div className="grid w-full max-w-sm gap-3">
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>https://</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput placeholder="example.com" />
            </InputGroup>
            <InputGroup>
              <InputGroupInput placeholder="username" />
              <InputGroupAddon align="inline-end">
                <InputGroupText>@domain.com</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>
        ),
      },
      {
        name: "Button",
        Demo: () => (
          <InputGroup className="w-full max-w-sm">
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon align="inline-end">
              <InputGroupButton variant="secondary">
                <SearchIcon />
                Search
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        ),
      },
      {
        name: "Kbd",
        description: "Keyboard shortcut hint inside the input.",
        Demo: () => (
          <InputGroup className="w-full max-w-sm">
            <InputGroupAddon><SearchIcon /></InputGroupAddon>
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon align="inline-end">
              <Kbd>\u2318K</Kbd>
            </InputGroupAddon>
          </InputGroup>
        ),
      },
      {
        name: "Dropdown",
        Demo: () => (
          <InputGroup className="w-full max-w-sm">
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon align="inline-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <InputGroupButton>
                    <ChevronDownIcon />
                    Filter
                  </InputGroupButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Name</DropdownMenuItem>
                  <DropdownMenuItem>Date</DropdownMenuItem>
                  <DropdownMenuItem>Status</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </InputGroupAddon>
          </InputGroup>
        ),
      },
      {
        name: "Spinner",
        description: "Shows a loading indicator inside the input.",
        Demo: () => (
          <InputGroup className="w-full max-w-sm">
            <InputGroupInput placeholder="Loading..." disabled />
            <InputGroupAddon align="inline-end">
              <Spinner />
            </InputGroupAddon>
          </InputGroup>
        ),
      },
      {
        name: "Textarea",
        Demo: () => {
          const [message, setMessage] = useState("")
          return (
            <InputGroup className="w-full max-w-sm has-disabled:bg-transparent has-disabled:opacity-100 dark:has-disabled:bg-input/30">
              <InputGroupTextarea
                placeholder="Write a comment..."
                rows={3}
                maxLength={280}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <InputGroupAddon align="block-end">
                <InputGroupText className="tabular-nums">
                  {message.length}/280
                </InputGroupText>
                <InputGroupButton
                  className="ml-auto"
                  size="default"
                  variant="secondary"
                  disabled={message.trim().length === 0}
                >
                  Send
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          )
        },
      },
      {
        name: "Custom Input",
        description: "A raw select element used as a custom addon.",
        Demo: () => (
          <InputGroup className="w-full max-w-sm">
            <InputGroupAddon>
              <select className="appearance-none bg-transparent text-sm outline-none" aria-label="Country code">
                <option>+1</option>
                <option>+44</option>
                <option>+81</option>
              </select>
            </InputGroupAddon>
            <InputGroupInput type="tel" placeholder="(555) 000-0000" />
          </InputGroup>
        ),
      },
    ],
  },
  {
    slug: "input-otp",
    name: "Input OTP",
    description: "Accessible one-time password component with copy-paste support.",
    category: "Forms",
    Demo: () => (
      <InputOTP maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    ),
    code: `import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function InputOTPDemo() {
  return (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}`,
    examples: [
      {
        name: "Pattern",
        description: "Restricts input to digits only.",
        Demo: () => (
          <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        ),
      },
      {
        name: "Disabled",
        Demo: () => (
          <InputOTP maxLength={6} disabled>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        ),
      },
      {
        name: "Controlled",
        description: "Value managed with React state.",
        Demo: () => <OTPControlledDemo />,
      },
      {
        name: "Invalid",
        Demo: () => (
          <div className="space-y-1.5">
            <InputOTP maxLength={6} defaultValue="12">
              <InputOTPGroup className="has-aria-invalid:border-destructive has-aria-invalid:ring-destructive/20">
                <InputOTPSlot index={0} aria-invalid="true" />
                <InputOTPSlot index={1} aria-invalid="true" />
                <InputOTPSlot index={2} aria-invalid="true" />
                <InputOTPSlot index={3} aria-invalid="true" />
                <InputOTPSlot index={4} aria-invalid="true" />
                <InputOTPSlot index={5} aria-invalid="true" />
              </InputOTPGroup>
            </InputOTP>
            <p className="text-sm text-destructive">Please complete the code.</p>
          </div>
        ),
      },
      {
        name: "Four Digits",
        Demo: () => (
          <InputOTP maxLength={4}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
        ),
      },
      {
        name: "Alphanumeric",
        description: "Accepts both letters and numbers.",
        Demo: () => (
          <InputOTP maxLength={6} inputMode="text">
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        ),
      },
      {
        name: "Form",
        description: "OTP verification with form validation.",
        Demo: () => <OTPFormDemo />,
        layout: "wide",
      },
    ],
  },
  {
    slug: "textarea",
    name: "Textarea",
    description: "Displays a form textarea or a component that looks like one.",
    category: "Forms",
    Demo: () => (
      <div className="grid w-full max-w-sm gap-3">
        <Label htmlFor="demo-message">Your message</Label>
        <Textarea id="demo-message" placeholder="Type your message here." />
      </div>
    ),
    code: `import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function TextareaDemo() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Label htmlFor="message">Your message</Label>
      <Textarea id="message" placeholder="Type your message here." />
    </div>
  )
}`,
    examples: [
      {
        name: "Disabled",
        Demo: () => (
          <Textarea disabled placeholder="This textarea is disabled." className="max-w-sm" />
        ),
      },
      {
        name: "Invalid",
        Demo: () => (
          <div className="grid w-full max-w-sm gap-1.5">
            <Label htmlFor="demo-textarea-invalid">Bio</Label>
            <Textarea id="demo-textarea-invalid" aria-invalid="true" defaultValue="x" />
            <p className="text-sm text-destructive">Bio must be at least 10 characters.</p>
          </div>
        ),
      },
      {
        name: "With Button",
        Demo: () => (
          <div className="grid w-full max-w-sm gap-3">
            <Label htmlFor="demo-textarea-button">Your message</Label>
            <Textarea id="demo-textarea-button" placeholder="Type your message here." />
            <Button className="justify-self-end">Send message</Button>
          </div>
        ),
      },
    ],
  },
  {
    slug: "label",
    name: "Label",
    description: "Renders an accessible label associated with controls.",
    category: "Forms",
    Demo: () => (
      <div className="grid w-full max-w-sm gap-3">
        <Label htmlFor="demo-email">Email address</Label>
        <Input id="demo-email" type="email" placeholder="you@example.com" />
      </div>
    ),
    code: `import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LabelDemo() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Label htmlFor="email">Email address</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  )
}`,
  },
  {
    slug: "field",
    name: "Field",
    description: "Compose accessible form fields with labels and descriptions.",
    category: "Forms",
    Demo: () => (
      <FieldSet className="w-full max-w-sm">
        <FieldLegend>Profile</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="demo-field-name">Name</FieldLabel>
            <Input id="demo-field-name" placeholder="Evil Rabbit" />
            <FieldDescription>This appears on your profile.</FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>
    ),
    code: `import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"

export function FieldDemo() {
  return (
    <FieldSet>
      <FieldLegend>Profile</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" placeholder="Evil Rabbit" />
          <FieldDescription>This appears on your profile.</FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}`,
    examples: [
      {
        name: "Textarea",
        Demo: () => (
          <Field className="w-full max-w-sm">
            <FieldLabel htmlFor="demo-field-textarea">Bio</FieldLabel>
            <Textarea id="demo-field-textarea" placeholder="Tell us about yourself" />
            <FieldDescription>You can use plain text only.</FieldDescription>
          </Field>
        ),
      },
      {
        name: "Select",
        Demo: () => (
          <Field className="w-full max-w-sm">
            <FieldLabel>Theme</FieldLabel>
            <Select defaultValue="system">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <FieldDescription>Choose your preferred theme.</FieldDescription>
          </Field>
        ),
      },
      {
        name: "Slider",
        Demo: () => (
          <Field className="w-full max-w-sm">
            <FieldLabel>Volume</FieldLabel>
            <Slider defaultValue={[50]} max={100} step={1} />
          </Field>
        ),
      },
      {
        name: "Checkbox",
        Demo: () => (
          <Field orientation="horizontal">
            <Checkbox id="demo-field-checkbox" />
            <FieldLabel htmlFor="demo-field-checkbox">
              Accept terms and conditions
            </FieldLabel>
          </Field>
        ),
      },
      {
        name: "Radio Group",
        Demo: () => (
          <FieldSet className="w-full max-w-sm">
            <FieldLegend>Notify me about</FieldLegend>
            <RadioGroup defaultValue="all">
              <Field orientation="horizontal">
                <RadioGroupItem value="all" id="demo-field-radio-all" />
                <FieldLabel htmlFor="demo-field-radio-all">All new messages</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <RadioGroupItem value="mentions" id="demo-field-radio-mentions" />
                <FieldLabel htmlFor="demo-field-radio-mentions">Direct messages and mentions</FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <RadioGroupItem value="none" id="demo-field-radio-none" />
                <FieldLabel htmlFor="demo-field-radio-none">Nothing</FieldLabel>
              </Field>
            </RadioGroup>
          </FieldSet>
        ),
      },
      {
        name: "Switch",
        Demo: () => (
          <Field orientation="horizontal">
            <Switch id="demo-field-switch" />
            <FieldLabel htmlFor="demo-field-switch">Airplane mode</FieldLabel>
          </Field>
        ),
      },
      {
        name: "Choice Card",
        description: "A shared selectable surface that hosts any choice control.",
        Demo: () => (
          <FieldSet className="w-full max-w-sm">
            <FieldLegend id="demo-field-choice-legend">Plan</FieldLegend>
            <RadioGroup
              defaultValue="pro"
              aria-labelledby="demo-field-choice-legend"
            >
              <ChoiceCard>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Free</FieldTitle>
                    <FieldDescription>For hobby projects.</FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value="free" id="demo-field-choice-free" />
                </Field>
              </ChoiceCard>
              <ChoiceCard>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Pro</FieldTitle>
                    <FieldDescription>For production workloads.</FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value="pro" id="demo-field-choice-pro" />
                </Field>
              </ChoiceCard>
            </RadioGroup>
          </FieldSet>
        ),
        layout: "wide",
      },
      {
        name: "Field Group",
        Demo: () => (
          <FieldGroup className="w-full max-w-sm">
            <Field>
              <FieldLabel htmlFor="demo-field-grp-name">Full name</FieldLabel>
              <Input id="demo-field-grp-name" placeholder={persona.name} />
            </Field>
            <Field>
              <FieldLabel htmlFor="demo-field-grp-email">Email</FieldLabel>
              <Input id="demo-field-grp-email" type="email" placeholder="you@example.com" />
              <FieldDescription>We will not share your email.</FieldDescription>
            </Field>
          </FieldGroup>
        ),
        layout: "wide",
      },
      {
        name: "Responsive Layout",
        description: "Labels move beside controls on wider screens.",
        Demo: () => (
          <FieldGroup className="w-full max-w-md">
            <Field orientation="responsive">
              <FieldLabel htmlFor="demo-field-resp-name">Name</FieldLabel>
              <Input id="demo-field-resp-name" placeholder={persona.name} />
            </Field>
            <Field orientation="responsive">
              <FieldLabel htmlFor="demo-field-resp-email">Email</FieldLabel>
              <Input id="demo-field-resp-email" type="email" placeholder="you@example.com" />
            </Field>
          </FieldGroup>
        ),
        layout: "wide",
      },
    ],
  },
  {
    slug: "form",
    name: "Form",
    description: "Build forms with react-hook-form and zod validation.",
    category: "Forms",
    Demo: () => <FormDemo />,
    code: `const schema = z.object({
  username: z.string().min(2, { message: "At least 2 characters." }),
})

export function FormDemo() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { username: "" },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder={persona.handle} {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}`,
    examples: [
      {
        name: "Validation",
        description: "Submit while empty to surface zod messages in FormMessage.",
        Demo: () => <FormValidationDemo />,
      },
      {
        name: "Non-input controls",
        description:
          "Select, Switch and Checkbox bound through the FormField render prop.",
        Demo: () => <FormControlsDemo />,
      },
      {
        name: "Submitting state",
        description: "Disable the action while formState.isSubmitting is true.",
        Demo: () => <FormSubmittingDemo />,
      },
    ],
  },
]
