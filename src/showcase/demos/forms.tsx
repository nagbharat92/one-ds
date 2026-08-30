import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import {
  ArrowRightIcon,
  ChevronDownIcon,
  CopyIcon,
  DownloadIcon,
  HeartIcon,
  Loader2Icon,
  MailIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react"

import type { ComponentEntry } from "@/showcase/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
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
import { Input } from "@/components/ui/input"
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
                <Input placeholder="shadcn" {...field} />
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

function ButtonLoadingDemo() {
  const [loading, setLoading] = useState(false)
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled>
        <Loader2Icon className="animate-spin" />
        Please wait
      </Button>
      <Button
        disabled={loading}
        onClick={() => {
          setLoading(true)
          setTimeout(() => setLoading(false), 2000)
        }}
      >
        {loading && <Loader2Icon className="animate-spin" />}
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
    description: "Displays a button or a component that looks like a button.",
    category: "Forms",
    Demo: () => (
      <div className="flex flex-wrap items-center gap-3">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    ),
    code: `import { Button } from "@/components/ui/button"

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  )
}`,
    examples: [
      {
        name: "Sizes",
        Demo: () => (
          <div className="flex flex-wrap items-center gap-3">
            <Button size="xs">Extra small</Button>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        ),
      },
      {
        name: "Icon Only",
        Demo: () => (
          <div className="flex flex-wrap items-center gap-3">
            <Button size="icon-xs" variant="outline" aria-label="Add"><PlusIcon /></Button>
            <Button size="icon-sm" variant="outline" aria-label="Search"><SearchIcon /></Button>
            <Button size="icon" variant="outline" aria-label="Copy"><CopyIcon /></Button>
            <Button size="icon-lg" variant="outline" aria-label="Favorite"><HeartIcon /></Button>
          </div>
        ),
      },
      {
        name: "With Icon",
        Demo: () => (
          <div className="flex flex-wrap items-center gap-3">
            <Button><MailIcon data-icon="inline-start" />Login with email</Button>
            <Button variant="outline"><DownloadIcon data-icon="inline-start" />Download</Button>
            <Button variant="secondary">Next<ArrowRightIcon data-icon="inline-end" /></Button>
          </div>
        ),
      },
      {
        name: "Rounded",
        Demo: () => (
          <div className="flex flex-wrap items-center gap-3">
            <Button className="rounded-full">Default</Button>
            <Button variant="outline" className="rounded-full">Outline</Button>
            <Button variant="secondary" className="rounded-full">Secondary</Button>
            <Button size="icon" className="rounded-full" aria-label="Add"><PlusIcon /></Button>
          </div>
        ),
      },
      {
        name: "Loading",
        description: "Click the second button to see the loading state.",
        Demo: () => <ButtonLoadingDemo />,
      },
      {
        name: "As Child",
        description: "Renders button styling on a child element like a link.",
        Demo: () => (
          <Button asChild>
            <a href="#" onClick={(e) => e.preventDefault()}>Login</a>
          </Button>
        ),
      },
    ],
  },
  {
    slug: "button-group",
    name: "Button Group",
    description: "Group a series of related buttons or controls together.",
    category: "Forms",
    Demo: () => (
      <ButtonGroup>
        <Button variant="outline">Copy</Button>
        <Button variant="outline">Paste</Button>
        <ButtonGroupSeparator />
        <ButtonGroupText>Actions</ButtonGroupText>
      </ButtonGroup>
    ),
    code: `import { Button } from "@/components/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"

export function ButtonGroupDemo() {
  return (
    <ButtonGroup>
      <Button variant="outline">Copy</Button>
      <Button variant="outline">Paste</Button>
      <ButtonGroupSeparator />
      <ButtonGroupText>Actions</ButtonGroupText>
    </ButtonGroup>
  )
}`,
    examples: [
      {
        name: "Orientation",
        Demo: () => (
          <div className="flex flex-wrap items-start gap-6">
            <ButtonGroup orientation="horizontal">
              <Button variant="outline">Left</Button>
              <Button variant="outline">Center</Button>
              <Button variant="outline">Right</Button>
            </ButtonGroup>
            <ButtonGroup orientation="vertical">
              <Button variant="outline">Top</Button>
              <Button variant="outline">Middle</Button>
              <Button variant="outline">Bottom</Button>
            </ButtonGroup>
          </div>
        ),
      },
      {
        name: "Sizes",
        Demo: () => (
          <div className="flex flex-wrap items-center gap-3">
            <ButtonGroup>
              <Button variant="outline" size="xs">Extra small</Button>
              <Button variant="outline" size="xs">Group</Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button variant="outline" size="sm">Small</Button>
              <Button variant="outline" size="sm">Group</Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button variant="outline">Default</Button>
              <Button variant="outline">Group</Button>
            </ButtonGroup>
          </div>
        ),
      },
      {
        name: "Nested",
        description: "Button groups within button groups.",
        Demo: () => (
          <ButtonGroup>
            <Button variant="outline">View</Button>
            <ButtonGroup>
              <Button variant="outline">Sort</Button>
              <Button variant="outline">Filter</Button>
            </ButtonGroup>
            <Button variant="outline">Export</Button>
          </ButtonGroup>
        ),
      },
      {
        name: "Split",
        description: "Primary action with a dropdown for alternatives.",
        Demo: () => (
          <ButtonGroup>
            <Button>Save</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" aria-label="More save options">
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
        description: "Text input joined with buttons.",
        Demo: () => (
          <ButtonGroup className="w-full max-w-sm">
            <Input placeholder="Search..." />
            <Button variant="outline">Search</Button>
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
            <Button variant="outline">Actions</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label="More actions">
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
            <Button variant="outline">Sort by</Button>
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
            <Button variant="outline">Dimensions</Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Set dimensions">
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
            <Button variant="outline"><CopyIcon data-icon="inline-start" />Copy</Button>
          </ButtonGroup>
        ),
        layout: "wide",
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
    code: `import { SearchIcon } from "lucide-react"
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
              <InputGroupButton>
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
        Demo: () => (
          <InputGroup className="w-full max-w-sm">
            <InputGroupTextarea placeholder="Write a message..." rows={3} />
            <InputGroupAddon align="block-end">
              <InputGroupButton size="xs">Send</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        ),
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
        description: "Selectable card using FieldLabel wrapping a Field.",
        Demo: () => (
          <FieldSet className="w-full max-w-sm">
            <FieldLegend>Plan</FieldLegend>
            <RadioGroup defaultValue="pro">
              <FieldLabel>
                <Field orientation="horizontal">
                  <RadioGroupItem value="free" id="demo-field-choice-free" />
                  <FieldContent>
                    <FieldTitle>Free</FieldTitle>
                    <FieldDescription>For hobby projects.</FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
              <FieldLabel>
                <Field orientation="horizontal">
                  <RadioGroupItem value="pro" id="demo-field-choice-pro" />
                  <FieldContent>
                    <FieldTitle>Pro</FieldTitle>
                    <FieldDescription>For production workloads.</FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
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
              <Input id="demo-field-grp-name" placeholder="Jane Doe" />
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
          <FieldGroup className="w-full max-w-lg">
            <Field orientation="responsive">
              <FieldLabel htmlFor="demo-field-resp-name">Name</FieldLabel>
              <Input id="demo-field-resp-name" placeholder="Jane Doe" />
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
                <Input placeholder="shadcn" {...field} />
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
  },
]
