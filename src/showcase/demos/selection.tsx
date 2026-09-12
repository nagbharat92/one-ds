import { useState } from "react"
import type { ComponentEntry } from "@/showcase/types"
import { Checkbox, CheckboxGroup, CheckboxGroupItem } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem, RadioGroupOption } from "@/components/ui/radio-group"
import { Switch, SwitchGroup, SwitchGroupItem } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  StarIcon,
  WifiIcon,
  BellIcon,
  MoonIcon,
  GlobeIcon,
} from "@/components/ui/icons"
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
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox"
import { Button } from "@/components/ui/button"
import { InputGroupAddon } from "@/components/ui/input-group"
import {
  ChoiceCard,
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
  FieldError,
  FieldTitle,
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
      <CheckboxGroupItem id="demo-terms" defaultChecked>Accept terms and conditions</CheckboxGroupItem>
    ),
    code: `import { CheckboxGroupItem } from "@/components/ui/checkbox"

export function CheckboxDemo() {
  return (
    <CheckboxGroupItem id="terms" defaultChecked>Accept terms and conditions</CheckboxGroupItem>
  )
}`,
    examples: [
      {
        name: "Invalid State",
        description: "Checkbox with validation error styling.",
        Demo: () => (
          <Field data-invalid="true">
            <CheckboxGroupItem id="cb-invalid-agree" aria-invalid="true">I agree to the terms</CheckboxGroupItem>
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
        name: "Choice Card",
        description: "Independently selectable checkbox cards.",
        layout: "wide",
        Demo: () => (
          <FieldSet className="w-full max-w-2xl">
            <FieldLegend>Project access</FieldLegend>
            <FieldDescription>
              Select every area this role can manage.
            </FieldDescription>
            <FieldGroup className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  id: "cb-card-content",
                  label: "Content",
                  description: "Pages and media.",
                  checked: true,
                },
                {
                  id: "cb-card-people",
                  label: "People",
                  description: "Members and roles.",
                  checked: false,
                },
                {
                  id: "cb-card-settings",
                  label: "Settings",
                  description: "Workspace controls.",
                  checked: false,
                },
              ].map((item) => (
                <ChoiceCard key={item.id}>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>{item.label}</FieldTitle>
                      <FieldDescription>{item.description}</FieldDescription>
                    </FieldContent>
                    <Checkbox id={item.id} defaultChecked={item.checked} />
                  </Field>
                </ChoiceCard>
              ))}
            </FieldGroup>
          </FieldSet>
        ),
      },
      {
        name: "Single-line Choice Card",
        description: "Compact checkbox cards without supporting descriptions.",
        layout: "wide",
        Demo: () => (
          <FieldSet className="w-full max-w-2xl">
            <FieldLegend>Review checklist</FieldLegend>
            <FieldGroup className="grid gap-3 sm:grid-cols-3">
              {[
                { id: "cb-card-single-visual", label: "Visual review", checked: true },
                { id: "cb-card-single-accessibility", label: "Accessibility", checked: false },
                { id: "cb-card-single-motion", label: "Motion review", checked: false },
              ].map((item) => (
                <ChoiceCard key={item.id}>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>{item.label}</FieldTitle>
                    </FieldContent>
                    <Checkbox id={item.id} defaultChecked={item.checked} />
                  </Field>
                </ChoiceCard>
              ))}
            </FieldGroup>
          </FieldSet>
        ),
      },
      {
        name: "Disabled",
        Demo: () => (
          <div className="flex flex-col gap-3">
            <CheckboxGroupItem id="cb-dis-unchecked" disabled><span className="opacity-50">Unchecked</span></CheckboxGroupItem>
            <CheckboxGroupItem id="cb-dis-checked" disabled defaultChecked><span className="opacity-50">Checked</span></CheckboxGroupItem>
          </div>
        ),
      },
      {
        name: "Group",
        description: "Independent options in horizontal and vertical groups.",
        Demo: () => (
          <div className="flex flex-wrap items-start gap-6">
            {(["horizontal", "vertical"] as const).map(orientation => (
                <CheckboxGroup key={orientation} aria-label={`${orientation} notifications`} orientation={orientation}>
                  <CheckboxGroupItem defaultChecked>Email</CheckboxGroupItem>
                  <CheckboxGroupItem>SMS</CheckboxGroupItem>
                  <CheckboxGroupItem>Push notifications</CheckboxGroupItem>
                </CheckboxGroup>
            ))}
          </div>
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
        <RadioGroupOption value="default" id="demo-r1">Default</RadioGroupOption>
        <RadioGroupOption value="comfortable" id="demo-r2">Comfortable</RadioGroupOption>
        <RadioGroupOption value="compact" id="demo-r3">Compact</RadioGroupOption>
      </RadioGroup>
    ),
    code: `import { RadioGroup, RadioGroupOption } from "@/components/ui/radio-group"

export function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="comfortable">
      <RadioGroupOption value="default">Default</RadioGroupOption>
      <RadioGroupOption value="comfortable">Comfortable</RadioGroupOption>
      <RadioGroupOption value="compact">Compact</RadioGroupOption>
    </RadioGroup>
  )
}`,
    examples: [
      {
        name: "Group",
        description: "Single-choice options in horizontal and vertical groups.",
        Demo: () => (
          <div className="flex flex-wrap items-start gap-6">
            {(["horizontal", "vertical"] as const).map(orientation => (
              <RadioGroup key={orientation} aria-label={`${orientation} density`} orientation={orientation} defaultValue="comfortable" className="w-auto">
                {(["Default", "Comfortable", "Compact"] as const).map(label => (
                  <RadioGroupOption key={label} value={label.toLowerCase()}>{label}</RadioGroupOption>
                ))}
              </RadioGroup>
            ))}
          </div>
        ),
      },
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
          <FieldSet className="w-full max-w-2xl">
            <FieldLegend id="rg-card-legend">Workspace type</FieldLegend>
            <RadioGroup
              defaultValue="team"
              aria-labelledby="rg-card-legend"
              className="grid gap-3 sm:grid-cols-3"
            >
              {[
                { value: "personal", label: "Personal", desc: "For individual use." },
                { value: "team", label: "Team", desc: "Share with your team." },
                { value: "enterprise", label: "Enterprise", desc: "Advanced security and support." },
              ].map((item) => (
                <ChoiceCard key={item.value}>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>{item.label}</FieldTitle>
                      <FieldDescription>{item.desc}</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value={item.value} id={`rg-card-${item.value}`} />
                  </Field>
                </ChoiceCard>
              ))}
            </RadioGroup>
          </FieldSet>
        ),
      },
      {
        name: "Single-line Choice Card",
        description: "Compact radio cards without supporting descriptions.",
        layout: "wide",
        Demo: () => (
          <FieldSet className="w-full max-w-2xl">
            <FieldLegend id="rg-card-single-legend">
              Review cadence
            </FieldLegend>
            <RadioGroup
              defaultValue="weekly"
              aria-labelledby="rg-card-single-legend"
              className="grid gap-3 sm:grid-cols-3"
            >
              {[
                { value: "daily", label: "Daily" },
                { value: "weekly", label: "Weekly" },
                { value: "monthly", label: "Monthly" },
              ].map((item) => (
                <ChoiceCard key={item.value}>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>{item.label}</FieldTitle>
                    </FieldContent>
                    <RadioGroupItem
                      value={item.value}
                      id={`rg-card-single-${item.value}`}
                    />
                  </Field>
                </ChoiceCard>
              ))}
            </RadioGroup>
          </FieldSet>
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
                <RadioGroupOption key={method} value={`rg-fs-${method.toLowerCase()}`} id={`rg-fs-${method.toLowerCase()}`}>{method}</RadioGroupOption>
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
              <RadioGroupOption key={item} value={`rg-dis-${item.toLowerCase()}`} id={`rg-dis-${item.toLowerCase()}`}>{item}</RadioGroupOption>
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
                <RadioGroupOption key={plan} value={`rg-inv-${plan.toLowerCase()}`} id={`rg-inv-${plan.toLowerCase()}`} aria-invalid="true">{plan}</RadioGroupOption>
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
      <SwitchGroupItem id="demo-airplane">Airplane mode</SwitchGroupItem>
    ),
    code: `import { SwitchGroupItem } from "@/components/ui/switch"

export function SwitchDemo() {
  return (
    <SwitchGroupItem id="airplane">Airplane mode</SwitchGroupItem>
  )
}`,
    examples: [
      {
        name: "Group",
        description: "Independent settings in horizontal and vertical groups.",
        Demo: () => (
          <div className="flex flex-wrap items-start gap-6">
            {(["horizontal", "vertical"] as const).map(orientation => (
              <SwitchGroup key={orientation} aria-label={`${orientation} settings`} orientation={orientation}>
                <SwitchGroupItem defaultChecked>Wi-Fi</SwitchGroupItem>
                <SwitchGroupItem>Bluetooth</SwitchGroupItem>
                <SwitchGroupItem>Location</SwitchGroupItem>
              </SwitchGroup>
            ))}
          </div>
        ),
      },
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
          <FieldSet className="w-full max-w-2xl">
            <FieldLegend>Connection settings</FieldLegend>
            <FieldGroup className="grid gap-3 sm:grid-cols-2">
              {[
                { id: "sw-card-wifi", icon: WifiIcon, label: "Wi-Fi", desc: "Connect to nearby networks.", on: true },
                { id: "sw-card-bell", icon: BellIcon, label: "Notifications", desc: "Get alerts for new messages.", on: false },
              ].map((item) => (
                <ChoiceCard key={item.id}>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>{item.label}</FieldTitle>
                      <FieldDescription>{item.desc}</FieldDescription>
                    </FieldContent>
                    <Switch id={item.id} defaultChecked={item.on} />
                  </Field>
                </ChoiceCard>
              ))}
            </FieldGroup>
          </FieldSet>
        ),
      },
      {
        name: "Single-line Choice Card",
        description: "Compact switch cards without supporting descriptions.",
        layout: "wide",
        Demo: () => (
          <FieldSet className="w-full max-w-2xl">
            <FieldLegend>Quick settings</FieldLegend>
            <FieldGroup className="grid gap-3 sm:grid-cols-2">
              {[
                { id: "sw-card-single-sync", label: "Automatic sync", on: true },
                { id: "sw-card-single-updates", label: "Product updates", on: false },
              ].map((item) => (
                <ChoiceCard key={item.id}>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>{item.label}</FieldTitle>
                    </FieldContent>
                    <Switch id={item.id} defaultChecked={item.on} />
                  </Field>
                </ChoiceCard>
              ))}
            </FieldGroup>
          </FieldSet>
        ),
      },
      {
        name: "Disabled",
        Demo: () => (
          <div className="flex flex-col gap-3">
            <SwitchGroupItem id="sw-dis-off" disabled><span className="opacity-50">Off and disabled</span></SwitchGroupItem>
            <SwitchGroupItem id="sw-dis-on" disabled defaultChecked><span className="opacity-50">On and disabled</span></SwitchGroupItem>
          </div>
        ),
      },
      {
        name: "Invalid",
        description: "Switch with a validation error.",
        Demo: () => (
          <Field data-invalid="true">
            <SwitchGroupItem id="sw-invalid-consent" aria-invalid="true">Accept cookies</SwitchGroupItem>
            <FieldError>You must accept cookies to continue.</FieldError>
          </Field>
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
        name: "Magnetic Snapping",
        description: "Drag near 25, 50, or 75 to snap. Values between stops remain available; arrow keys adjust precisely.",
        Demo: () => {
          const [value, setValue] = useState([40])
          return (
            <div className="flex w-full max-w-sm flex-col gap-3">
              <div className="flex items-center justify-between text-sm">
                <span>Level</span>
                <output className="tabular-nums text-muted-foreground">{value[0]}</output>
              </div>
              <Slider aria-label="Magnetic level" value={value} onValueChange={setValue} snapPoints={[25, 50, 75]} snapMode="magnetic" />
            </div>
          )
        },
      },
      {
        name: "Discrete Snapping",
        description: "Only 0, 20, 50, 85, and 100 are selectable. Arrow keys move between stops; Home and End select the endpoints.",
        Demo: () => {
          const [value, setValue] = useState([20])
          return (
            <div className="flex w-full max-w-sm flex-col gap-3">
              <div className="flex items-center justify-between text-sm">
                <span>Level</span>
                <output className="tabular-nums text-muted-foreground">{value[0]}</output>
              </div>
              <Slider aria-label="Discrete level" value={value} onValueChange={setValue} snapPoints={[20, 50, 85]} snapMode="discrete" />
            </div>
          )
        },
      },
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
    name: "Select (native)",
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
        description: "Items organized in labeled groups, split by a separator.",
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
                  <ComboboxSeparator />
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
        description:
          "Type a few letters in each field to compare. Without autoHighlight nothing is preselected, so Enter does nothing until you arrow down. With it, the best match is already highlighted and Enter picks it.",
        layout: "wide",
        Demo: () => (
          <div className="flex flex-wrap items-start gap-6">
            <Field className="w-56">
              <FieldLabel>Default</FieldLabel>
              <Combobox items={frameworks}>
                <ComboboxInput placeholder="Type “re”..." className="w-full" />
                <ComboboxContent>
                  <ComboboxEmpty>No framework found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item: string) => (
                      <ComboboxItem key={item} value={item}>{item}</ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              <FieldDescription>Nothing is highlighted until you press the arrow keys.</FieldDescription>
            </Field>
            <Field className="w-56">
              <FieldLabel>autoHighlight</FieldLabel>
              <Combobox items={frameworks} autoHighlight>
                <ComboboxInput placeholder="Type “re”..." className="w-full" />
                <ComboboxContent>
                  <ComboboxEmpty>No framework found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item: string) => (
                      <ComboboxItem key={item} value={item}>{item}</ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              <FieldDescription>Top match is preselected, so Enter accepts it.</FieldDescription>
            </Field>
          </div>
        ),
      },
      {
        name: "Popup",
        description:
          "There is no text field on the page — a button opens the popup and the search input lives inside it. Pass render to ComboboxTrigger and move ComboboxInput into ComboboxContent.",
        Demo: () => {
          const countries = ["Australia", "Brazil", "Canada", "Germany", "India", "Japan", "Mexico", "Norway"]
          return (
            <Combobox items={countries}>
              <ComboboxTrigger render={<Button variant="secondary" className="w-56 justify-between font-normal" />}>
                <ComboboxValue placeholder="Select country" />
              </ComboboxTrigger>
              <ComboboxContent>
                <ComboboxInput placeholder="Search country..." showTrigger={false} />
                <ComboboxEmpty>No country found.</ComboboxEmpty>
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
        name: "Input Group",
        description:
          "The field is an input group, so you can slot addons into it. Here a leading globe icon sits inside the border, next to the trigger chevron.",
        layout: "wide",
        Demo: () => (
          <Combobox items={frameworks}>
            <ComboboxInput placeholder="Search frameworks..." className="w-full max-w-80">
              <InputGroupAddon>
                <GlobeIcon />
              </InputGroupAddon>
            </ComboboxInput>
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
