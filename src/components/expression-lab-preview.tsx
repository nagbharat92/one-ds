import { useRef, useState, type FormEvent } from "react"
import {
  ActivityIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  CircleIcon,
  GlobeIcon,
  ImageIcon,
  LayoutDashboardIcon,
  ListChecksIcon,
  MessageSquareIcon,
  MinusIcon,
  MoreHorizontalIcon,
  NotebookPenIcon,
  PaperclipIcon,
  PaletteIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  RotateCcwIcon,
  SaveIcon,
  SearchIcon,
  SparklesIcon,
} from "@/components/ui/icons"

import { persona } from "@/lib/persona"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardEyebrow,
  CardFooter,
  CardHeader,
  CardHeaderContent,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ColorThemePortal } from "@/components/ui/color-theme"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { Progress } from "@/components/ui/progress"
import { Scroller } from "@/components/ui/scroller"
import { Slider } from "@/components/ui/slider"
import {
  SiteHeader,
  SiteHeaderActions,
  SiteHeaderContainer,
} from "@/components/ui/site-header"
import {
  Sidebar,
  SidebarAccount,
  SidebarAccountDetails,
  SidebarBrand,
  SidebarBrandLabel,
  SidebarBrandMark,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarResizeHandle,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResizableTextarea } from "@/components/ui/resizable-textarea"
import { Toolbar } from "@/components/ui/toolbar"
import {
  AIComposer,
  AIComposerAction,
  AIComposerActions,
  AIComposerFooter,
  AIComposerInput,
  AIComposerSubmit,
  AIComposerTool,
  AIComposerTools,
} from "@/components/ui/ai-composer"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
export type FormExperimentMode = "baseline" | "expressive"
export type LabScenario = "rest" | "active" | "complete" | "custom"

const experimentSteps = [
  {
    id: "color",
    title: "Color harmony",
    description: "Tune contrast and relationships.",
  },
  {
    id: "form",
    title: "Form language",
    description: "Test hierarchy and containment.",
  },
] as const

type ExperimentStepId = (typeof experimentSteps)[number]["id"]

const sessionMinutes = {
  minimum: 10,
  maximum: 60,
  step: 5,
  default: 25,
} as const

const viewCopy = {
  today: {
    title: "Build one clear idea.",
    description:
      "Change one relationship and keep everything around it fixed.",
  },
  week: {
    title: "Turn the strongest idea into a system.",
    description:
      "Compare the week’s best experiments before promoting a pattern.",
  },
} as const

type LabView = keyof typeof viewCopy

function initialScenarioState(scenario: LabScenario) {
  if (scenario === "rest") {
    return {
      completed: [] as ExperimentStepId[],
      sessionActive: false,
      note: "",
      noteSaved: false,
      lens: "shape",
    }
  }

  if (scenario === "complete") {
    return {
      completed: experimentSteps.map((step) => step.id),
      sessionActive: false,
      note: "The monochrome hierarchy holds without relying on color.",
      noteSaved: true,
      lens: "shape",
    }
  }

  return {
    completed: ["color"] as ExperimentStepId[],
    sessionActive: scenario === "active",
    note:
      "Make the selected state feel like the same object moving, not a new layer appearing.",
    noteSaved: false,
    lens: "shape",
  }
}

const labNavigation = [
  { id: "overview", label: "Overview", icon: LayoutDashboardIcon },
  { id: "experiments", label: "Experiments", icon: ListChecksIcon },
  { id: "notes", label: "Notes", icon: NotebookPenIcon },
  { id: "messages", label: "Messages", icon: MessageSquareIcon },
] as const

type LabNavigationId = (typeof labNavigation)[number]["id"]

const labRegionTargets: Record<LabNavigationId, string> = {
  overview: "prominent-action",
  experiments: "experiment-checklist",
  notes: "observation",
  messages: "assistant",
}

type LabMessage = {
  id: string
  align: "start" | "end"
  text: string
}

const initialLabMessages: LabMessage[] = [
  {
    id: "assistant-1",
    align: "start",
    text: "The selected state now reads as one object moving.",
  },
  {
    id: "user-1",
    align: "end",
    text: "Compare it with the neutral baseline.",
  },
  {
    id: "assistant-2",
    align: "start",
    text: "The form holds. Motion is the next variable to test.",
  },
]

function ExpressionLabComposerAddMenu({
  mode,
  webSearch,
  deepResearch,
  onWebSearchChange,
  onDeepResearchChange,
}: {
  mode: FormExperimentMode
  webSearch: boolean
  deepResearch: boolean
  onWebSearchChange: (checked: boolean) => void
  onDeepResearchChange: (checked: boolean) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        tabIndex={-1}
        className="sr-only"
        aria-label="Add files"
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        tabIndex={-1}
        className="sr-only"
        aria-label="Add images"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <AIComposerAction aria-label="Add to prompt">
            <PlusIcon />
          </AIComposerAction>
        </DropdownMenuTrigger>
        <ColorThemePortal>
        <DropdownMenuContent side="top" align="start" data-expression={mode}>
          <DropdownMenuLabel>Add to prompt</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => fileInputRef.current?.click()}>
              <PaperclipIcon />
              Add files
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => imageInputRef.current?.click()}>
              <ImageIcon />
              Add images
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Tools</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={webSearch}
            onCheckedChange={(checked) =>
              onWebSearchChange(checked === true)
            }
          >
            <GlobeIcon />
            Search web
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={deepResearch}
            onCheckedChange={(checked) =>
              onDeepResearchChange(checked === true)
            }
          >
            <SearchIcon />
            Deep research
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
        </ColorThemePortal>
      </DropdownMenu>
      {webSearch ? (
        <AIComposerTool
          variant="secondary"
          aria-pressed="true"
          onClick={() => onWebSearchChange(false)}
        >
          <GlobeIcon data-icon="inline-start" />
          Search web
        </AIComposerTool>
      ) : null}
      {deepResearch ? (
        <AIComposerTool
          variant="secondary"
          aria-pressed="true"
          onClick={() => onDeepResearchChange(false)}
        >
          <SearchIcon data-icon="inline-start" />
          Deep research
        </AIComposerTool>
      ) : null}
    </>
  )
}

function ExpressionLabNavigation({
  activeRegion,
  onNavigate,
}: {
  activeRegion: LabNavigationId
  onNavigate: (id: LabNavigationId) => void
}) {
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Workspace</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {labNavigation.map(({ id, label, icon: Icon }) => (
              <SidebarMenuItem key={id}>
                <SidebarMenuButton
                  type="button"
                  isActive={activeRegion === id}
                  tooltip={label}
                  onClick={() => {
                    onNavigate(id)
                    if (isMobile) setOpenMobile(false)
                  }}
                >
                  <Icon />
                  <span>{label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}

export function ExpressionLabCanvas({
  mode,
  scenario,
  onInteraction,
  onScenarioChange,
}: {
  mode: FormExperimentMode
  scenario: LabScenario
  onInteraction: () => void
  onScenarioChange: (scenario: Exclude<LabScenario, "custom">) => void
}) {
  const labRef = useRef<HTMLElement>(null)
  const chatMessageIdRef = useRef(initialLabMessages.length)
  const initialState = initialScenarioState(scenario)
  const [view, setView] = useState<LabView>("today")
  const [completed, setCompleted] = useState<ExperimentStepId[]>(
    initialState.completed,
  )
  const [duration, setDuration] = useState<number[]>([
    sessionMinutes.default,
  ])
  const [sessionActive, setSessionActive] = useState(
    initialState.sessionActive,
  )
  const [note, setNote] = useState(initialState.note)
  const [noteSaved, setNoteSaved] = useState(initialState.noteSaved)
  const [category, setCategory] = useState("shape")
  const [lens, setLens] = useState(initialState.lens)
  const [activeRegion, setActiveRegion] =
    useState<LabNavigationId>("overview")
  const [chatPrompt, setChatPrompt] = useState("")
  const [chatMessages, setChatMessages] = useState(initialLabMessages)
  const [webSearch, setWebSearch] = useState(false)
  const [deepResearch, setDeepResearch] = useState(false)

  const currentView = viewCopy[view]
  const currentMinutes = duration.at(0) ?? sessionMinutes.default
  const completion = Math.round(
    (completed.length / experimentSteps.length) * 100,
  )
  const nextStep = experimentSteps.find(
    (step) => !completed.includes(step.id),
  )

  function setStepCompleted(id: ExperimentStepId, checked: boolean) {
    onInteraction()
    setCompleted((current) => {
      if (checked) {
        return current.includes(id) ? current : [...current, id]
      }

      return current.filter((stepId) => stepId !== id)
    })
  }

  function adjustDuration(direction: -1 | 1) {
    onInteraction()
    setDuration(([value = sessionMinutes.default]) => [
      Math.min(
        sessionMinutes.maximum,
        Math.max(
          sessionMinutes.minimum,
          value + sessionMinutes.step * direction,
        ),
      ),
    ])
  }

  function navigateToRegion(id: LabNavigationId) {
    setActiveRegion(id)
    const region = labRef.current?.querySelector<HTMLElement>(
      `[data-lab-region="${labRegionTargets[id]}"]`,
    )
    region?.scrollIntoView({ block: "start" })
  }

  function sendChatMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = chatPrompt.trim()
    if (!text) return
    onInteraction()

    const messageId = chatMessageIdRef.current++
    setChatMessages((messages) => [
      ...messages,
      { id: `user-${messageId}`, align: "end", text },
      {
        id: `assistant-${messageId}`,
        align: "start",
        text: "I added that to the comparison. Keep one variable fixed for the next pass.",
      },
    ])
    setChatPrompt("")
    setActiveRegion("messages")
  }

  return (
    <section
      ref={labRef}
      className="expression-lab showcase-contained-viewport"
      data-experiment={mode}
      data-expression={mode}
      aria-label="Expression lab workbench"
    >
      <SidebarProvider
        id="expression-lab"
        persist={false}
        shortcut={false}
        className="h-full min-h-0 overflow-hidden"
      >
        <Sidebar placement="inset" collapsible="bar" data-expression={mode}>
          <SidebarHeader>
            <SidebarBrand>
              <SidebarBrandMark>
                <SparklesIcon className="size-4" />
              </SidebarBrandMark>
              <SidebarBrandLabel>Design room</SidebarBrandLabel>
              <SidebarTrigger />
            </SidebarBrand>
          </SidebarHeader>
          <ExpressionLabNavigation
            activeRegion={activeRegion}
            onNavigate={navigateToRegion}
          />
          <SidebarFooter>
            <SidebarAccount>
              <Avatar>
                <AvatarImage src={persona.avatar} alt="" />
                <AvatarFallback>{persona.initials}</AvatarFallback>
              </Avatar>
              <SidebarAccountDetails>
                <span>{persona.name}</span>
                <span>{persona.title}</span>
              </SidebarAccountDetails>
              <ChevronsUpDownIcon />
            </SidebarAccount>
          </SidebarFooter>
          <SidebarResizeHandle />
        </Sidebar>
        <SidebarInset className="min-h-0 overflow-hidden">
          <SiteHeader className="expression-lab__header static h-auto min-h-(--sidebar-header-height)">
            <SiteHeaderContainer className="h-auto min-h-(--sidebar-header-height) flex-wrap">
              <SidebarTrigger className="md:hidden" />
              <strong className="expression-lab__page-title">
                {labNavigation.find((item) => item.id === activeRegion)?.label}
              </strong>

              <SiteHeaderActions>
                <Tabs
                  value={view}
                  onValueChange={(value) => {
                    onInteraction()
                    setView(value as LabView)
                  }}
                  className="expression-lab__view"
                >
                  <TabsList shape="pill" aria-label="Lab horizon">
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="week">This week</TabsTrigger>
                  </TabsList>
                </Tabs>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild tooltip="Quick actions">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Quick actions"
                    >
                      <MoreHorizontalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <ColorThemePortal>
                  <DropdownMenuContent align="end" data-expression={mode}>
                    <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onSelect={() => navigateToRegion("notes")}
                      >
                        <NotebookPenIcon />
                        Open notes
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => navigateToRegion("messages")}
                      >
                        <MessageSquareIcon />
                        Open messages
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => onScenarioChange("active")}
                    >
                      <RotateCcwIcon />
                      Reset lab
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                  </ColorThemePortal>
                </DropdownMenu>
              </SiteHeaderActions>
            </SiteHeaderContainer>
          </SiteHeader>

          <Scroller
            className="expression-lab__scroll"
            fade="both"
            fadeSize="sm"
          >
            <div className="expression-lab__grid">
              <Alert>
                <SparklesIcon />
                <AlertTitle>
                  Comparing Expressive with the neutral baseline
                </AlertTitle>
                <AlertDescription>
                  Toggle the treatment to watch shape, weight, and spacing move
                  together.
                </AlertDescription>
              </Alert>
          <div className="expression-lab__row">
              <Card
                className="expression-lab__hero"
                data-lab-region="prominent-action"
              >
              <CardHeader>
                <CardHeaderContent>
                  <CardEyebrow>
                    <Badge variant="secondary">
                      {mode === "baseline" ? "Neutral baseline" : "Expressive"}
                    </Badge>
                    <span>Good morning, {persona.firstName}.</span>
                  </CardEyebrow>
                  <CardTitle asChild>
                    <h2 className="expression-lab__heading">
                      {currentView.title}
                    </h2>
                  </CardTitle>
                  <CardDescription>
                    {currentView.description}
                  </CardDescription>
                </CardHeaderContent>
              </CardHeader>
              <CardContent className="expression-lab__hero-content">
                <div className="expression-lab__progress-block">
                  <div className="expression-lab__progress-copy">
                    <span>Phase 2</span>
                    <span>
                      {completed.length} of {experimentSteps.length} explored
                    </span>
                  </div>
                  <Progress
                    value={completion}
                    className="expression-lab__progress"
                    aria-label="Experiment completion"
                  />
                </div>
              </CardContent>
              <CardFooter className="expression-lab__hero-footer">
                <span className="expression-lab__next-step" aria-live="polite">
                  {nextStep ? `Next: ${nextStep.title}` : "All experiments complete"}
                </span>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => {
                    if (nextStep) setStepCompleted(nextStep.id, true)
                  }}
                  disabled={!nextStep}
                >
                  {nextStep ? (
                    <PlusIcon data-icon="inline-start" />
                  ) : (
                    <CheckIcon data-icon="inline-start" />
                  )}
                  {nextStep ? "Complete next" : "Exploration complete"}
                </Button>
              </CardFooter>
              </Card>

              <Card
                className="expression-lab__card expression-lab__focus"
                data-lab-region="media-control"
                data-active={sessionActive}
              >
              <CardHeader>
                <CardTitle>Focus</CardTitle>
                <CardAction>
                  <Badge variant={sessionActive ? "default" : "secondary"}>
                    {sessionActive ? "Active" : "Ready"}
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardContent className="expression-lab__session">
                <div className="expression-lab__session-value">
                  <strong className="expression-lab__session-duration">
                    {String(currentMinutes).padStart(2, "0")}:00
                  </strong>
                  <span className="expression-lab__session-label">
                    Session length
                  </span>
                </div>
                <Slider
                  value={duration}
                  min={sessionMinutes.minimum}
                  max={sessionMinutes.maximum}
                  step={sessionMinutes.step}
                  onValueChange={setDuration}
                  aria-label="Session length"
                  aria-valuetext={`${currentMinutes} minutes`}
                />
                <div className="expression-lab__slider-labels">
                  <span>{sessionMinutes.minimum} min</span>
                  <span>{sessionMinutes.maximum} min</span>
                </div>
                <Toolbar
                  className="mx-auto w-fit rounded-full"
                  aria-label="Session controls"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    aria-label="Shorten session"
                    onClick={() => adjustDuration(-1)}
                    disabled={currentMinutes === sessionMinutes.minimum}
                  >
                    <MinusIcon />
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="icon"
                    className="rounded-full"
                    aria-label={sessionActive ? "Pause session" : "Start session"}
                    onClick={() => {
                      onInteraction()
                      setSessionActive((active) => !active)
                    }}
                  >
                    {sessionActive ? <PauseIcon /> : <PlayIcon />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    aria-label="Lengthen session"
                    onClick={() => adjustDuration(1)}
                    disabled={currentMinutes === sessionMinutes.maximum}
                  >
                    <PlusIcon />
                  </Button>
                </Toolbar>
              </CardContent>
              </Card>
          </div>

          <div className="expression-lab__row expression-lab__row--workbench">
            <div className="expression-lab__capture-stack">
                <section
                  className="expression-lab__plan"
                  data-lab-region="experiment-checklist"
                  aria-labelledby="expression-lab-plan-title"
                >
                <header className="expression-lab__plan-header">
                  <div className="expression-lab__plan-copy">
                    <h2
                      id="expression-lab-plan-title"
                      className="expression-lab__plan-title"
                    >
                      Experiment plan
                    </h2>
                    <p className="expression-lab__plan-description">
                      Choose the next relationships to test.
                    </p>
                  </div>
                  <Badge variant="secondary" role="status" aria-live="polite">
                    {completed.length} of {experimentSteps.length}
                  </Badge>
                </header>
                <FieldSet>
                  <FieldLegend className="sr-only">
                    Experiment plan
                  </FieldLegend>
                  <FieldGroup className="grid grid-cols-1 gap-(--expression-lab-item-gap) sm:grid-cols-2">
                    {experimentSteps.map((step) => {
                      const isComplete = completed.includes(step.id)
                      const checkboxId = `expression-lab-${step.id}`

                      return (
                        <ChoiceCard key={step.id}>
                          <Field orientation="horizontal">
                            <FieldContent>
                              <FieldTitle>{step.title}</FieldTitle>
                              <FieldDescription>
                                {step.description}
                              </FieldDescription>
                            </FieldContent>
                            <Checkbox
                              id={checkboxId}
                              aria-label={step.title}
                              checked={isComplete}
                              onCheckedChange={(checked) =>
                                setStepCompleted(step.id, checked === true)
                              }
                            />
                          </Field>
                        </ChoiceCard>
                      )
                    })}
                  </FieldGroup>
                </FieldSet>
                </section>

                <Card
                  className="expression-lab__capture"
                  data-lab-region="observation"
                >
                <CardHeader>
                  <CardTitle>Observation</CardTitle>
                  <CardDescription>
                    Record why a treatment works.
                  </CardDescription>
                  <CardAction>
                    <Badge variant={noteSaved ? "default" : "secondary"}>
                      {noteSaved ? "Saved" : "Draft"}
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="expression-lab-note">
                        Working note
                      </FieldLabel>
                      <ResizableTextarea
                        enabled={mode === "expressive"}
                        resizeLabel="Resize working note"
                        id="expression-lab-note"
                        value={note}
                        onChange={(event) => {
                          onInteraction()
                          setNote(event.target.value)
                          setNoteSaved(false)
                        }}
                      />
                    </Field>
                    <Field orientation="horizontal">
                      <FieldLabel htmlFor="expression-lab-category">
                        Category
                      </FieldLabel>
                      {mode === "expressive" ? (
                        <Select value={category} onValueChange={value => { setCategory(value); onInteraction() }}>
                          <SelectTrigger id="expression-lab-category"><SelectValue /></SelectTrigger>
                          <ColorThemePortal>
                          <SelectContent data-expression={mode}>
                            <SelectItem value="shape">Shape</SelectItem>
                            <SelectItem value="type">Type</SelectItem>
                            <SelectItem value="motion">Motion</SelectItem>
                          </SelectContent>
                          </ColorThemePortal>
                        </Select>
                      ) : <NativeSelect
                        id="expression-lab-category"
                        value={category}
                        onChange={event => setCategory(event.target.value)}
                      >
                        <NativeSelectOption value="shape">
                          Shape
                        </NativeSelectOption>
                        <NativeSelectOption value="type">
                          Type
                        </NativeSelectOption>
                        <NativeSelectOption value="motion">
                          Motion
                        </NativeSelectOption>
                      </NativeSelect>}
                    </Field>
                    <Field orientation="horizontal">
                      <FieldLabel htmlFor="expression-lab-autosave">
                        Auto-save draft
                      </FieldLabel>
                      <Switch id="expression-lab-autosave" defaultChecked />
                    </Field>
                  </FieldGroup>
                </CardContent>
                <CardFooter className="expression-lab__capture-footer">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      onInteraction()
                      setNote("")
                      setNoteSaved(false)
                    }}
                    disabled={!note}
                  >
                    Clear
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      onInteraction()
                      setNoteSaved(true)
                    }}
                    disabled={!note.trim()}
                  >
                    {noteSaved ? (
                      <CheckIcon data-icon="inline-start" />
                    ) : (
                      <SaveIcon data-icon="inline-start" />
                    )}
                    {noteSaved ? "Saved" : "Save note"}
                  </Button>
                </CardFooter>
                </Card>

                <Card
                  size="sm"
                  className="expression-lab__lenses-card"
                  data-lab-region="control-island"
                >
                <CardContent className="expression-lab__lenses-content">
                  <div className="expression-lab__lenses-copy">
                    <strong className="expression-lab__lenses-title">
                      Experiment lens
                    </strong>
                    <span className="expression-lab__lenses-description">
                      Choose what changes next.
                    </span>
                  </div>
                  <ToggleGroup
                      type="single"
                      value={lens}
                      onValueChange={(value) => {
                        if (value) {
                          onInteraction()
                          setLens(value)
                        }
                      }}
                      variant="outline"
                      aria-label="Experiment lens"
                      className="max-w-full flex-wrap"
                    >
                      <ToggleGroupItem value="color">
                        <PaletteIcon data-icon="inline-start" />
                        Color
                      </ToggleGroupItem>
                      <ToggleGroupItem value="shape">
                        <CircleIcon data-icon="inline-start" />
                        Shape
                      </ToggleGroupItem>
                      <ToggleGroupItem value="motion">
                        <ActivityIcon data-icon="inline-start" />
                        Motion
                      </ToggleGroupItem>
                    </ToggleGroup>
                </CardContent>
                </Card>
            </div>

              <section
                className="expression-lab__chat"
                data-lab-region="assistant"
                aria-labelledby="expression-lab-chat-title"
              >
              <header className="expression-lab__chat-header">
                <div className="expression-lab__chat-heading">
                  <Avatar size="sm">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div>
                    <strong id="expression-lab-chat-title">
                      Design assistant
                    </strong>
                    <span>Compare the current treatment.</span>
                  </div>
                </div>
                <Badge variant="secondary">Pilot</Badge>
              </header>
              <MessageScrollerProvider autoScroll>
                <MessageScroller className="expression-lab__chat-scroller">
                  <MessageScrollerViewport className="expression-lab__chat-viewport">
                    <MessageScrollerContent>
                      {chatMessages.map((message) => (
                        <MessageScrollerItem key={message.id} id={message.id}>
                          <Message align={message.align}>
                            {message.align === "start" ? (
                              <MessageAvatar>
                                <Avatar size="sm">
                                  <AvatarFallback>AI</AvatarFallback>
                                </Avatar>
                              </MessageAvatar>
                            ) : null}
                            <MessageContent>
                              <MessageHeader>
                                <span>
                                  {message.align === "start"
                                    ? "Assistant"
                                    : "You"}
                                </span>
                              </MessageHeader>
                              <Bubble
                                variant={
                                  message.align === "start"
                                    ? "secondary"
                                    : "default"
                                }
                                align={message.align}
                              >
                                <BubbleContent>{message.text}</BubbleContent>
                              </Bubble>
                            </MessageContent>
                          </Message>
                        </MessageScrollerItem>
                      ))}
                    </MessageScrollerContent>
                  </MessageScrollerViewport>
                </MessageScroller>
              </MessageScrollerProvider>
              <div className="expression-lab__chat-composer-region">
                <AIComposer
                  className="expression-lab__chat-composer"
                  onSubmit={sendChatMessage}
                >
                  <AIComposerInput
                    aria-label="Message the design assistant"
                    placeholder="Ask about this treatment"
                    value={chatPrompt}
                    onChange={(event) => setChatPrompt(event.target.value)}
                  />
                  <AIComposerFooter>
                    <AIComposerTools>
                      <ExpressionLabComposerAddMenu
                        mode={mode}
                        webSearch={webSearch}
                        deepResearch={deepResearch}
                        onWebSearchChange={setWebSearch}
                        onDeepResearchChange={setDeepResearch}
                      />
                    </AIComposerTools>
                    <AIComposerActions className="ms-auto">
                      <AIComposerSubmit />
                    </AIComposerActions>
                  </AIComposerFooter>
                </AIComposer>
              </div>
              </section>
          </div>
            </div>
          </Scroller>
        </SidebarInset>
      </SidebarProvider>
    </section>
  )
}

export function ExpressionLabPreview() {
  const [scenario, setScenario] = useState<LabScenario>("active")
  const [version, setVersion] = useState(0)
  return (
    <ExpressionLabCanvas
      key={version}
      mode="baseline"
      scenario={scenario}
      onInteraction={() => {}}
      onScenarioChange={(next) => { setScenario(next); setVersion(current => current + 1) }}
    />
  )
}
