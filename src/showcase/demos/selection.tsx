import { useState } from "react"
import type { ComponentEntry } from "@/showcase/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  StarIcon,
  WifiIcon,
  BellIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxGroup,
  ComboboxLabel,
} from "@/components/ui/combobox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
  FieldLegend,
  FieldError,
} from "@/components/ui/field"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]

export const selectionDemos: ComponentEntry[] = [
  {
    slug: "checkbox",
    name: "Checkbox",
    description: "A control that toggles between checked and not checked.",
    category: "Selection",
    Demo: () => (
      <div className="flex items-center gap-3">
        <Checkbox id="demo-terms" defaultChecked />
        <Label htmlFor="demo-terms">Accept terms and conditions</Label>
      </div>
    ),
    code: `import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function CheckboxDemo() {
  return (
    <div className="flex items-center gap-3">
      <Checkbox id="terms" defaultChecked />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  )
}`,
    examples: [
      {
        name: "Invalid State",
        description: "Checkbox with validation error styling.",
        Demo: () => (
          <Field data-invalid="true">
            <div className="flex items-center gap-3">
              <Checkbox id="cb-invalid-agree" aria-invalid="true" />
              <Label htmlFor="cb-invalid-agree">I agree to the terms</Label>
            </div>
            <FieldError>You must accept the terms to continue.</FieldError>
          </Field>
        ),
      },
      {
        name: "Description",
        description: "Checkbox with a label and supporting text.",
        Demo: () => (
          <Field orientation="horizontal">
            <Checkbox id="cb-desc-marketing" />
            <FieldContent>
              <FieldLabel htmlFor="cb-desc-marketing">Marketing emails</FieldLabel>
              <FieldDescription>Receive emails about new products and features.</FieldDescription>
            </FieldContent>
          </Field>
        ),
      },
      {
        name: "Disabled",
        Demo: () => (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Checkbox id="cb-dis-unchecked" disabled />
              <Label htmlFor="cb-dis-unchecked" className="opacity-50">Unchecked</Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="cb-dis-checked" disabled defaultChecked />
              <Label htmlFor="cb-dis-checked" className="opacity-50">Checked</Label>
            </div>
          </div>
        ),
      },
      {
        name: "Group",
        description: "A fieldset of checkboxes.",
        Demo: () => (
          <FieldSet>
            <FieldLegend>Notifications</FieldLegend>
            {[
              { id: "cb-grp-email", label: "Email", checked: true },
              { id: "cb-grp-sms", label: "SMS", checked: false },
              { id: "cb-grp-push", label: "Push notifications", checked: false },
            ].map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <Checkbox id={item.id} defaultChecked={item.checked} />
                <Label htmlFor={item.id}>{item.label}</Label>
              </div>
            ))}
          </FieldSet>
        ),
      },
      {
        name: "Table",
        description: "Checkboxes used as row selectors in a table.",
        layout: "wide",
        Demo: () => {
          const [selected, setSelected] = useState<Set<string>>(new Set(["task-2"]))
          const tasks = [
            { id: "task-1", title: "Update documentation", status: "In progress" },
            { id: "task-2", title: "Review pull request", status: "Done" },
            { id: "task-3", title: "Fix login bug", status: "Todo" },
          ]
          const allSelected = tasks.every((t) => selected.has(t.id))
          const someSelected = selected.size > 0 && !allSelected
          return (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      id="cb-tbl-all"
                      checked={someSelected ? "indeterminate" : allSelected}
                      onCheckedChange={(v) => {
                        setSelected(v ? new Set(tasks.map((t) => t.id)) : new Set())
                      }}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id} data-state={selected.has(task.id) ? "selected" : undefined}>
                    <TableCell>
                      <Checkbox
                        id={`cb-tbl-${task.id}`}
                        checked={selected.has(task.id)}
                        onCheckedChange={(v) => {
                          const next = new Set(selected)
                          if (v) next.add(task.id)
                          else next.delete(task.id)
                          setSelected(next)
                        }}
                        aria-label={`Select ${task.title}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{task.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        },
      },
    ],
  },
  {
    slug: "radio-group",
    name: "Radio Group",
    description: "A set of checkable buttons where only one can be checked.",
    category: "Selection",
    Demo: () => (
      <RadioGroup defaultValue="comfortable">
        <div className="flex items-center gap-3">
          <RadioGroupItem value="default" id="demo-r1" />
          <Label htmlFor="demo-r1">Default</Label>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem value="comfortable" id="demo-r2" />
          <Label htmlFor="demo-r2">Comfortable</Label>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem value="compact" id="demo-r3" />
          <Label htmlFor="demo-r3">Compact</Label>
        </div>
      </RadioGroup>
    ),
    code: `import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center gap-3">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
    </RadioGroup>
  )
}`,
    examples: [
      {
        name: "Description",
        description: "Each radio option with a supporting description.",
        Demo: () => (
          <RadioGroup defaultValue="all">
            {[
              { value: "all", label: "All notifications", desc: "Email digest, push, and SMS." },
              { value: "mentions", label: "Mentions only", desc: "Only when someone mentions you." },
              { value: "none", label: "Nothing", desc: "Turn off all notifications." },
            ].map((item) => (
              <Field key={item.value} orientation="horizontal">
                <RadioGroupItem value={item.value} id={`rg-desc-${item.value}`} />
                <FieldContent>
                  <FieldLabel htmlFor={`rg-desc-${item.value}`}>{item.label}</FieldLabel>
                  <FieldDescription>{item.desc}</FieldDescription>
                </FieldContent>
              </Field>
            ))}
          </RadioGroup>
        ),
      },
      {
        name: "Choice Card",
        description: "Radio items styled as selectable cards.",
        layout: "wide",
        Demo: () => (
          <RadioGroup defaultValue="team" className="grid gap-3 sm:grid-cols-3">
            {[
              { value: "personal", label: "Personal", desc: "For individual use." },
              { value: "team", label: "Team", desc: "Share with your team." },
              { value: "enterprise", label: "Enterprise", desc: "Advanced security and support." },
            ].map((item) => (
              <FieldLabel key={item.value} className="cursor-pointer">
                <Field orientation="horizontal">
                  <RadioGroupItem value={item.value} id={`rg-card-${item.value}`} />
                  <FieldContent>
                    <span className="text-sm font-medium">{item.label}</span>
                    <FieldDescription>{item.desc}</FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        ),
      },
      {
        name: "Fieldset",
        description: "Radio group inside a fieldset with legend.",
        Demo: () => (
          <FieldSet>
            <FieldLegend>Preferred contact method</FieldLegend>
            <FieldDescription>Select how we should reach you.</FieldDescription>
            <RadioGroup defaultValue="rg-fs-email">
              {["Email", "Phone", "Mail"].map((method) => (
                <div key={method} className="flex items-center gap-3">
                  <RadioGroupItem value={`rg-fs-${method.toLowerCase()}`} id={`rg-fs-${method.toLowerCase()}`} />
                  <Label htmlFor={`rg-fs-${method.toLowerCase()}`}>{method}</Label>
                </div>
              ))}
            </RadioGroup>
          </FieldSet>
        ),
      },
      {
        name: "Disabled",
        Demo: () => (
          <RadioGroup defaultValue="rg-dis-comfortable" disabled>
            {["Default", "Comfortable", "Compact"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <RadioGroupItem value={`rg-dis-${item.toLowerCase()}`} id={`rg-dis-${item.toLowerCase()}`} />
                <Label htmlFor={`rg-dis-${item.toLowerCase()}`}>{item}</Label>
              </div>
            ))}
          </RadioGroup>
        ),
      },
      {
        name: "Invalid",
        description: "Validation error on a radio group.",
        Demo: () => (
          <Field data-invalid="true">
            <FieldLabel>Plan</FieldLabel>
            <RadioGroup>
              {["Free", "Pro", "Enterprise"].map((plan) => (
                <div key={plan} className="flex items-center gap-3">
                  <RadioGroupItem value={`rg-inv-${plan.toLowerCase()}`} id={`rg-inv-${plan.toLowerCase()}`} aria-invalid="true" />
                  <Label htmlFor={`rg-inv-${plan.toLowerCase()}`}>{plan}</Label>
                </div>
              ))}
            </RadioGroup>
            <FieldError>Please select a plan.</FieldError>
          </Field>
        ),
      },
    ],
  },
  {
    slug: "switch",
    name: "Switch",
    description: "A control that toggles between on and off states.",
    category: "Selection",
    Demo: () => (
      <div className="flex items-center gap-3">
        <Switch id="demo-airplane" />
        <Label htmlFor="demo-airplane">Airplane mode</Label>
      </div>
    ),
    code: `import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function SwitchDemo() {
  return (
    <div className="flex items-center gap-3">
      <Switch id="airplane" />
      <Label htmlFor="airplane">Airplane mode</Label>
    </div>
  )
}`,
    examples: [
      {
        name: "Description",
        description: "Switch with a supporting description.",
        Demo: () => (
          <Field orientation="horizontal">
            <Switch id="sw-desc-dnd" />
            <FieldContent>
              <FieldLabel htmlFor="sw-desc-dnd">Do not disturb</FieldLabel>
              <FieldDescription>Silence all notifications until you turn this off.</FieldDescription>
            </FieldContent>
          </Field>
        ),
      },
      {
        name: "Choice Card",
        description: "Switches styled as selectable cards.",
        layout: "wide",
        Demo: () => (
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { id: "sw-card-wifi", icon: WifiIcon, label: "Wi-Fi", desc: "Connect to nearby networks.", on: true },
              { id: "sw-card-bell", icon: BellIcon, label: "Notifications", desc: "Get alerts for new messages.", on: false },
            ].map((item) => (
              <FieldLabel key={item.id} className="cursor-pointer">
                <Field orientation="horizontal">
                  <Switch id={item.id} defaultChecked={item.on} />
                  <FieldContent>
                    <span className="text-sm font-medium">{item.label}</span>
                    <FieldDescription>{item.desc}</FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
            ))}
          </div>
        ),
      },
      {
        name: "Disabled",
        Demo: () => (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Switch id="sw-dis-off" disabled />
              <Label htmlFor="sw-dis-off" className="opacity-50">Off and disabled</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="sw-dis-on" disabled defaultChecked />
              <Label htmlFor="sw-dis-on" className="opacity-50">On and disabled</Label>
            </div>
          </div>
        ),
      },
      {
        name: "Invalid",
        description: "Switch with a validation error.",
        Demo: () => (
          <Field data-invalid="true">
            <div className="flex items-center gap-3">
              <Switch id="sw-invalid-consent" aria-invalid="true" />
              <Label htmlFor="sw-invalid-consent">Accept cookies</Label>
            </div>
            <FieldError>You must accept cookies to continue.</FieldError>
          </Field>
        ),
      },
      {
        name: "Sizes",
        description: "The small and default sizes.",
        Demo: () => (
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <Switch id="sw-sz-sm" size="sm" defaultChecked />
              <Label htmlFor="sw-sz-sm">Small</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="sw-sz-def" size="default" defaultChecked />
              <Label htmlFor="sw-sz-def">Default</Label>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    slug: "slider",
    name: "Slider",
    description: "An input where the user selects a value from a range.",
    category: "Selection",
    Demo: () => (
      <Slider defaultValue={[50]} max={100} step={1} className="w-full max-w-sm" />
    ),
    code: `import { Slider } from "@/components/ui/slider"

export function SliderDemo() {
  return <Slider defaultValue={[50]} max={100} step={1} />
}`,
    examples: [
      {
        name: "Range",
        description: "A dual-thumb range slider.",
        Demo: () => {
          const [vals, setVals] = useState([25, 75])
          return (
            <div className="flex w-full max-w-sm flex-col gap-3">
              <Slider value={vals} onValueChange={setVals} min={0} max={100} step={1} />
              <p className="text-sm text-muted-foreground">Range: {vals[0]} – {vals[1]}</p>
            </div>
          )
        },
      },
      {
        name: "Multiple Thumbs",
        description: "Three thumbs for fine-grained control.",
        Demo: () => {
          const [vals, setVals] = useState([20, 50, 80])
          return (
            <div className="flex w-full max-w-sm flex-col gap-3">
              <Slider value={vals} onValueChange={setVals} min={0} max={100} step={1} />
              <p className="text-sm text-muted-foreground">Values: {vals.join(", ")}</p>
            </div>
          )
        },
      },
      {
        name: "Vertical",
        Demo: () => (
          <div className="flex items-end gap-6">
            <Slider defaultValue={[30]} orientation="vertical" />
            <Slider defaultValue={[60]} orientation="vertical" />
            <Slider defaultValue={[80]} orientation="vertical" />
          </div>
        ),
      },
      {
        name: "Controlled",
        description: "A controlled slider with a live readout.",
        Demo: () => {
          const [value, setValue] = useState([40])
          return (
            <div className="flex w-full max-w-sm flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label>Volume</Label>
                <span className="text-sm tabular-nums text-muted-foreground">{value[0]}%</span>
              </div>
              <Slider value={value} onValueChange={setValue} max={100} step={1} />
            </div>
          )
        },
      },
      {
        name: "Disabled",
        Demo: () => (
          <Slider defaultValue={[50]} max={100} disabled className="w-full max-w-sm" />
        ),
      },
    ],
  },
  {
    slug: "toggle",
    name: "Toggle",
    description: "A two-state button that can be on or off.",
    category: "Selection",
    Demo: () => (
      <Toggle aria-label="Toggle italic">
        <BoldIcon />
      </Toggle>
    ),
    code: `import { BoldIcon } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

export function ToggleDemo() {
  return (
    <Toggle aria-label="Toggle bold">
      <BoldIcon />
    </Toggle>
  )
}`,
    examples: [
      {
        name: "Outline",
        Demo: () => (
          <Toggle variant="outline" aria-label="Toggle italic">
            <ItalicIcon />
          </Toggle>
        ),
      },
      {
        name: "With Text",
        Demo: () => (
          <Toggle aria-label="Toggle italic">
            <ItalicIcon data-icon="inline-start" />
            Italic
          </Toggle>
        ),
      },
      {
        name: "Sizes",
        Demo: () => (
          <div className="flex flex-wrap items-center gap-3">
            <Toggle size="sm" aria-label="Small bold">
              <BoldIcon />
            </Toggle>
            <Toggle size="default" aria-label="Default bold">
              <BoldIcon />
            </Toggle>
            <Toggle size="lg" aria-label="Large bold">
              <BoldIcon />
            </Toggle>
          </div>
        ),
      },
      {
        name: "Disabled",
        Demo: () => (
          <Toggle disabled aria-label="Toggle underline">
            <UnderlineIcon />
          </Toggle>
        ),
      },
    ],
  },
  {
    slug: "toggle-group",
    name: "Toggle Group",
    description: "A set of two-state buttons that can be toggled on or off.",
    category: "Selection",
    Demo: () => (
      <ToggleGroup type="multiple">
        <ToggleGroupItem value="bold" aria-label="Bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <ItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <UnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    ),
    code: `import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ToggleGroupDemo() {
  return (
    <ToggleGroup type="multiple">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <BoldIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <ItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <UnderlineIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}`,
    examples: [
      {
        name: "Outline",
        Demo: () => (
          <ToggleGroup type="multiple" variant="outline">
            <ToggleGroupItem value="bold" aria-label="Bold">
              <BoldIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <ItalicIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
              <UnderlineIcon />
            </ToggleGroupItem>
          </ToggleGroup>
        ),
      },
      {
        name: "Sizes",
        Demo: () => (
          <div className="flex flex-col gap-4">
            <ToggleGroup type="single" size="sm">
              <ToggleGroupItem value="left" aria-label="Align left"><AlignLeftIcon /></ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Align center"><AlignCenterIcon /></ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Align right"><AlignRightIcon /></ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup type="single" size="default">
              <ToggleGroupItem value="left" aria-label="Align left"><AlignLeftIcon /></ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Align center"><AlignCenterIcon /></ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Align right"><AlignRightIcon /></ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup type="single" size="lg">
              <ToggleGroupItem value="left" aria-label="Align left"><AlignLeftIcon /></ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Align center"><AlignCenterIcon /></ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Align right"><AlignRightIcon /></ToggleGroupItem>
            </ToggleGroup>
          </div>
        ),
      },
      {
        name: "Spacing",
        description: "Adjusting the gap between items. 0 creates a connected group.",
        Demo: () => (
          <div className="flex flex-col gap-4">
            <ToggleGroup type="single" spacing={0} variant="outline">
              <ToggleGroupItem value="left" aria-label="Align left"><AlignLeftIcon /></ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Align center"><AlignCenterIcon /></ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Align right"><AlignRightIcon /></ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup type="single" spacing={1}>
              <ToggleGroupItem value="left" aria-label="Align left"><AlignLeftIcon /></ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Align center"><AlignCenterIcon /></ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Align right"><AlignRightIcon /></ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup type="single" spacing={4}>
              <ToggleGroupItem value="left" aria-label="Align left"><AlignLeftIcon /></ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Align center"><AlignCenterIcon /></ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Align right"><AlignRightIcon /></ToggleGroupItem>
            </ToggleGroup>
          </div>
        ),
      },
      {
        name: "Vertical",
        Demo: () => (
          <ToggleGroup type="single" orientation="vertical" variant="outline">
            <ToggleGroupItem value="left" aria-label="Align left"><AlignLeftIcon /></ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Align center"><AlignCenterIcon /></ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Align right"><AlignRightIcon /></ToggleGroupItem>
          </ToggleGroup>
        ),
      },
      {
        name: "Disabled",
        Demo: () => (
          <ToggleGroup type="single" disabled>
            <ToggleGroupItem value="bold" aria-label="Bold"><BoldIcon /></ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic"><ItalicIcon /></ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline"><UnderlineIcon /></ToggleGroupItem>
          </ToggleGroup>
        ),
      },
      {
        name: "Custom",
        description: "Single selection with text labels and icons.",
        Demo: () => {
          const [value, setValue] = useState("system")
          return (
            <div className="flex flex-col gap-3">
              <ToggleGroup type="single" value={value} onValueChange={(v) => { if (v) setValue(v) }} variant="outline">
                <ToggleGroupItem value="light">
                  <SunIcon data-icon="inline-start" />
                  Light
                </ToggleGroupItem>
                <ToggleGroupItem value="dark">
                  <MoonIcon data-icon="inline-start" />
                  Dark
                </ToggleGroupItem>
                <ToggleGroupItem value="system">
                  System
                </ToggleGroupItem>
              </ToggleGroup>
              <p className="text-sm text-muted-foreground">Active: {value}</p>
            </div>
          )
        },
      },
    ],
  },
  {
    slug: "select",
    name: "Select",
    description: "Displays a list of options for the user to pick from.",
    category: "Selection",
    Demo: () => (
      <Select>
        <SelectTrigger className="w-full max-w-52">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    ),
    code: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectDemo() {
  return (
    <Select>
      <SelectTrigger className="w-52">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
      </SelectContent>
    </Select>
  )
}`,
    examples: [
      {
        name: "Align Item With Trigger",
        description: "Content aligns its selected item with the trigger.",
        Demo: () => (
          <Select defaultValue="banana">
            <SelectTrigger className="w-full max-w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectContent>
          </Select>
        ),
      },
      {
        name: "Scrollable",
        description: "A long list with scroll arrows and grouped sections.",
        Demo: () => (
          <Select>
            <SelectTrigger className="w-full max-w-52">
              <SelectValue placeholder="Select a timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>North America</SelectLabel>
                <SelectItem value="est">Eastern (EST)</SelectItem>
                <SelectItem value="cst">Central (CST)</SelectItem>
                <SelectItem value="mst">Mountain (MST)</SelectItem>
                <SelectItem value="pst">Pacific (PST)</SelectItem>
                <SelectItem value="akst">Alaska (AKST)</SelectItem>
                <SelectItem value="hst">Hawaii (HST)</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Europe</SelectLabel>
                <SelectItem value="gmt">Greenwich (GMT)</SelectItem>
                <SelectItem value="cet">Central European (CET)</SelectItem>
                <SelectItem value="eet">Eastern European (EET)</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Asia</SelectLabel>
                <SelectItem value="ist">India (IST)</SelectItem>
                <SelectItem value="cst-cn">China (CST)</SelectItem>
                <SelectItem value="jst">Japan (JST)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        ),
      },
      {
        name: "Disabled",
        Demo: () => (
          <Select disabled>
            <SelectTrigger className="w-full max-w-52">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
            </SelectContent>
          </Select>
        ),
      },
      {
        name: "Invalid",
        description: "Select with validation error.",
        Demo: () => (
          <Field data-invalid="true">
            <FieldLabel>Fruit</FieldLabel>
            <Select>
              <SelectTrigger className="w-full max-w-52" aria-invalid="true">
                <SelectValue placeholder="Pick a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
              </SelectContent>
            </Select>
            <FieldError>Please select a fruit.</FieldError>
          </Field>
        ),
      },
    ],
  },
  {
    slug: "native-select",
    name: "Native Select",
    description: "A styled wrapper around the native select element.",
    category: "Selection",
    Demo: () => (
      <NativeSelect className="w-full max-w-52" defaultValue="apple">
        <NativeSelectOption value="apple">Apple</NativeSelectOption>
        <NativeSelectOption value="banana">Banana</NativeSelectOption>
        <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
      </NativeSelect>
    ),
    code: `import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"

export function NativeSelectDemo() {
  return (
    <NativeSelect defaultValue="apple">
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
      <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
    </NativeSelect>
  )
}`,
    examples: [
      {
        name: "Groups",
        description: "Grouped options using optgroup.",
        Demo: () => (
          <NativeSelect className="w-full max-w-52" defaultValue="banana">
            <NativeSelectOptGroup label="Fruits">
              <NativeSelectOption value="apple">Apple</NativeSelectOption>
              <NativeSelectOption value="banana">Banana</NativeSelectOption>
              <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
            </NativeSelectOptGroup>
            <NativeSelectOptGroup label="Vegetables">
              <NativeSelectOption value="carrot">Carrot</NativeSelectOption>
              <NativeSelectOption value="broccoli">Broccoli</NativeSelectOption>
              <NativeSelectOption value="spinach">Spinach</NativeSelectOption>
            </NativeSelectOptGroup>
          </NativeSelect>
        ),
      },
      {
        name: "Disabled",
        Demo: () => (
          <NativeSelect className="w-full max-w-52" defaultValue="apple" disabled>
            <NativeSelectOption value="apple">Apple</NativeSelectOption>
            <NativeSelectOption value="banana">Banana</NativeSelectOption>
          </NativeSelect>
        ),
      },
      {
        name: "Invalid",
        Demo: () => (
          <Field data-invalid="true">
            <FieldLabel>Fruit</FieldLabel>
            <NativeSelect className="w-full max-w-52" defaultValue="" aria-invalid="true">
              <NativeSelectOption value="" disabled>Choose a fruit</NativeSelectOption>
              <NativeSelectOption value="apple">Apple</NativeSelectOption>
              <NativeSelectOption value="banana">Banana</NativeSelectOption>
            </NativeSelect>
            <FieldError>Please select a fruit.</FieldError>
          </Field>
        ),
      },
    ],
  },
  {
    slug: "combobox",
    name: "Combobox",
    description: "An autocomplete input and command palette in one.",
    category: "Selection",
    Demo: () => (
      <Combobox items={frameworks}>
        <ComboboxInput placeholder="Search framework..." className="w-full max-w-56" />
        <ComboboxContent>
          <ComboboxEmpty>No framework found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    ),
    code: `import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]

export function ComboboxDemo() {
  return (
    <Combobox items={frameworks}>
      <ComboboxInput placeholder="Search framework..." className="w-56" />
      <ComboboxContent>
        <ComboboxEmpty>No framework found.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}`,
    examples: [
      {
        name: "Multiple",
        description: "Select multiple values with chip tags.",
        layout: "wide",
        Demo: () => {
          const allLangs = ["TypeScript", "JavaScript", "Python", "Go", "Rust", "Java", "C#"]
          return (
            <Combobox items={allLangs} multiple defaultValue={["TypeScript", "Python"]}>
              <ComboboxInput placeholder="Add languages..." className="w-full max-w-80" />
              <ComboboxContent>
                <ComboboxEmpty>No matches.</ComboboxEmpty>
                <ComboboxList>
                  {(item: string) => (
                    <ComboboxItem key={item} value={item}>{item}</ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          )
        },
      },
      {
        name: "Clear Button",
        description: "An X button to reset the selection.",
        Demo: () => (
          <Combobox items={frameworks}>
            <ComboboxInput placeholder="Search framework..." className="w-full max-w-56" showClear />
            <ComboboxContent>
              <ComboboxEmpty>No framework found.</ComboboxEmpty>
              <ComboboxList>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>{item}</ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        ),
      },
      {
        name: "Groups",
        description: "Items organized in labeled groups.",
        Demo: () => {
          const all = ["Next.js", "Remix", "Nuxt.js", "SvelteKit", "Django", "Flask", "Rails"]
          return (
            <Combobox items={all}>
              <ComboboxInput placeholder="Search..." className="w-full max-w-56" />
              <ComboboxContent>
                <ComboboxEmpty>No results.</ComboboxEmpty>
                <ComboboxList>
                  <ComboboxGroup>
                    <ComboboxLabel>Frontend</ComboboxLabel>
                    {["Next.js", "Remix", "Nuxt.js", "SvelteKit"].map((f) => (
                      <ComboboxItem key={f} value={f}>{f}</ComboboxItem>
                    ))}
                  </ComboboxGroup>
                  <ComboboxGroup>
                    <ComboboxLabel>Backend</ComboboxLabel>
                    {["Django", "Flask", "Rails"].map((f) => (
                      <ComboboxItem key={f} value={f}>{f}</ComboboxItem>
                    ))}
                  </ComboboxGroup>
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          )
        },
      },
      {
        name: "Custom Items",
        description: "Items with icons and secondary text.",
        Demo: () => {
          const items = [
            { value: "star", label: "Featured", icon: StarIcon },
            { value: "bell", label: "Notifications", icon: BellIcon },
            { value: "moon", label: "Dark mode", icon: MoonIcon },
          ]
          return (
            <Combobox items={items.map((i) => i.value)}>
              <ComboboxInput placeholder="Search..." className="w-full max-w-56" />
              <ComboboxContent>
                <ComboboxEmpty>No results.</ComboboxEmpty>
                <ComboboxList>
                  {(item: string) => {
                    const found = items.find((i) => i.value === item)!
                    return (
                      <ComboboxItem key={item} value={item}>
                        <found.icon className="size-4 text-muted-foreground" />
                        {found.label}
                      </ComboboxItem>
                    )
                  }}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          )
        },
      },
      {
        name: "Invalid",
        description: "Combobox with validation error styling.",
        Demo: () => (
          <Field data-invalid="true">
            <FieldLabel>Framework</FieldLabel>
            <Combobox items={frameworks}>
              <ComboboxInput placeholder="Search..." className="w-full max-w-56" aria-invalid="true" />
              <ComboboxContent>
                <ComboboxEmpty>No results.</ComboboxEmpty>
                <ComboboxList>
                  {(item: string) => (
                    <ComboboxItem key={item} value={item}>{item}</ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            <FieldError>Please select a framework.</FieldError>
          </Field>
        ),
      },
      {
        name: "Disabled",
        Demo: () => (
          <Combobox items={frameworks} disabled>
            <ComboboxInput placeholder="Search framework..." className="w-full max-w-56" disabled />
            <ComboboxContent>
              <ComboboxEmpty>No framework found.</ComboboxEmpty>
              <ComboboxList>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>{item}</ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        ),
      },
      {
        name: "Auto Highlight",
        description: "First matching item is highlighted automatically.",
        Demo: () => (
          <Combobox items={frameworks} autoHighlight>
            <ComboboxInput placeholder="Type to search..." className="w-full max-w-56" />
            <ComboboxContent>
              <ComboboxEmpty>No framework found.</ComboboxEmpty>
              <ComboboxList>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>{item}</ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        ),
      },
      {
        name: "Popup",
        description: "Combobox opened with a trigger chevron.",
        Demo: () => (
          <Combobox items={frameworks}>
            <ComboboxInput placeholder="Search..." className="w-full max-w-56" showTrigger />
            <ComboboxContent>
              <ComboboxEmpty>No matches.</ComboboxEmpty>
              <ComboboxList>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>{item}</ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        ),
      },
      {
        name: "Input Group",
        description: "Combobox with both a clear button and trigger chevron.",
        layout: "wide",
        Demo: () => (
          <Combobox items={frameworks}>
            <ComboboxInput placeholder="Search frameworks..." className="w-full max-w-80" showClear showTrigger />
            <ComboboxContent>
              <ComboboxEmpty>No framework found.</ComboboxEmpty>
              <ComboboxList>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>{item}</ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        ),
      },
    ],
  },
]
