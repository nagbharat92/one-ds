import * as React from "react"
import { useState } from "react"
import { ArchiveIcon, CopyIcon, ImageIcon, MoreHorizontalIcon, PinIcon, RotateCcwIcon } from "@/components/ui/icons"

import type { ComponentEntry } from "@/showcase/types"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardMedia, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { persona } from "@/lib/persona"
import { CheckboxGroup, CheckboxGroupItem } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { ToolbarGroup, ToolbarTitle } from "@/components/ui/toolbar"
import { Canvas, CanvasWorkbench, CanvasToolbar, CanvasContent } from "@/components/ui/canvas"
import { CanvasGrid } from "@/components/ui/canvas-grid"
import { CanvasPreviewFrame, useCanvasPreviewState } from "@/components/ui/canvas-preview"
import { AnnotationBand, AnnotationCallouts, AnnotationLayer } from "@/components/ui/annotation"
import { AnnotationMeasurements, type AnnotationMeasurementTarget } from "@/components/ui/annotation-measurements"
import { AnnotationLegend } from "@/components/ui/annotation-legend"
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ResizableTextarea as ConcentricTextarea } from "@/components/ui/resizable-textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const PAD_RATIO = 0.5
const MIN_PAD = 12
const MIN_RADIUS = MIN_PAD / PAD_RATIO
const SCALE_PADDING = { normal: 20, medium: 24, large: 28 }
const MAX_RADIUS = SCALE_PADDING.large / PAD_RATIO

const cardSpacingTargets: AnnotationMeasurementTarget[] = [
  { target: "surface", label: "Card sections", kinds: ["padding", "gap"] },
  { target: "header", label: "Header", kinds: ["padding"] },
  { target: "content", label: "Content", kinds: ["padding"] },
  { target: "footer", label: "Footer", kinds: ["padding"] },
]
const formSpacingTargets: AnnotationMeasurementTarget[] = [
  ...cardSpacingTargets,
  { target: "fields", label: "Fields", kinds: ["gap"] },
]

function ConcentricProjectForm({ radius, scale }: { radius: number; scale: "normal" | "medium" | "large" }) {
  const id = React.useId()
  const nameRef = React.useRef<HTMLInputElement>(null)
  const [saved, setSaved] = useState({ name: "Studio workspace", description: "A shared home for the team's next ideas.", status: "in-progress", notifications: true })
  const [draft, setDraft] = useState(saved)
  const [error, setError] = useState(false)
  const [feedback, setFeedback] = useState("")

  return (
      <form aria-labelledby={`${id}-title`} noValidate
        onSubmit={event => {
          event.preventDefault()
          if (!draft.name.trim()) {
            setError(true)
            setFeedback("")
            nameRef.current?.focus()
            return
          }
          const next = { ...draft, name: draft.name.trim() }
          setSaved(next)
          setDraft(next)
          setError(false)
          setFeedback("Changes saved")
        }}>
        <Card className="concentric-project-form" data-annotate="form" data-measure="surface">
        <CardHeader data-measure="header">
          <CardTitle asChild><h3 id={`${id}-title`}>Edit project</h3></CardTitle>
          <CardDescription>Manage your project details and updates.</CardDescription>
        </CardHeader>
        <CardContent data-measure="content">
        <FieldGroup data-measure="fields">
          <Field data-invalid={error || undefined}>
            <FieldLabel htmlFor={`${id}-name`}>Project name</FieldLabel>
            <Input ref={nameRef} id={`${id}-name`} data-annotate="input" value={draft.name} required
              aria-invalid={error} aria-describedby={error ? `${id}-error` : undefined}
              onChange={event => { setDraft({ ...draft, name: event.target.value }); setError(false); setFeedback("") }} />
            {error && <FieldError id={`${id}-error`}>Enter a project name.</FieldError>}
          </Field>
          <Field>
            <FieldLabel htmlFor={`${id}-description`}>Description</FieldLabel>
            <ConcentricTextarea id={`${id}-description`} value={draft.description} rows={3}
              onChange={event => { setDraft({ ...draft, description: event.target.value }); setFeedback("") }} />
          </Field>
          <Field>
            <FieldLabel htmlFor={`${id}-status`}>Status</FieldLabel>
            <Select value={draft.status} onValueChange={status => { setDraft({ ...draft, status }); setFeedback("") }}>
              <SelectTrigger id={`${id}-status`} className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent className="concentric-demo concentric-form-select" data-variant="type-controls" data-scale={scale}
                style={{ "--concentric-r": `${radius}px` } as React.CSSProperties}>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="in-progress">In progress</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor={`${id}-notifications`}>Notifications</FieldLabel>
              <FieldDescription id={`${id}-notifications-help`}>Receive project activity updates.</FieldDescription>
            </FieldContent>
            <Switch id={`${id}-notifications`} className="after:-inset-x-2" checked={draft.notifications} aria-describedby={`${id}-notifications-help`}
              onCheckedChange={notifications => { setDraft({ ...draft, notifications }); setFeedback("") }} />
          </Field>
        </FieldGroup>
        {feedback && <div role="status" className="mt-2 text-sm text-muted-foreground">{feedback}</div>}
        </CardContent>
        <CardFooter data-measure="footer" className={`flex-wrap justify-end${scale === "normal" ? "" : " concentric-card__actions"}`}>
          <Button type="button" variant="secondary" onClick={() => { setDraft(saved); setError(false); setFeedback("Unsaved changes discarded") }}>Cancel</Button>
          <Button type="submit" data-annotate="save">Save changes</Button>
        </CardFooter>
        </Card>
      </form>
  )
}

function ConcentricProjectCard({ radius, scale, mediaRef }: {
  radius: number
  scale: "normal" | "medium" | "large"
  mediaRef: React.Ref<HTMLDivElement>
}) {
  const [pinned, setPinned] = useState(false)
  const [archived, setArchived] = useState(false)
  const [copies, setCopies] = useState(0)
  const [opened, setOpened] = useState(false)
  const [following, setFollowing] = useState(false)
  const name = copies ? `Studio workspace (copy ${copies})` : "Studio workspace"

  return (
    <Card data-annotate="card" data-measure="surface" className="concentric-project-card">
        <CardMedia ref={mediaRef} data-annotate="media" ratio="landscape">
          <img src="./concentric-workspace.jpg" alt="A bright shared studio with desks and plants" />
        </CardMedia>
      <CardHeader data-measure="header">
        <CardTitle asChild><h3>{name}</h3></CardTitle>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Project options"><MoreHorizontalIcon /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="concentric-demo concentric-project-menu"
              data-variant="type-controls" data-scale={scale}
              style={{ "--concentric-r": `${radius}px` } as React.CSSProperties}>
              <DropdownMenuItem onSelect={() => setPinned(value => !value)}><PinIcon />{pinned ? "Unpin project" : "Pin project"}</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {
                setCopies(value => value + 1)
                setPinned(false)
                setArchived(false)
                setOpened(false)
                setFollowing(false)
              }}><CopyIcon />Duplicate project</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setArchived(value => !value)}>
                {archived ? <RotateCcwIcon /> : <ArchiveIcon />}{archived ? "Restore project" : "Archive project"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
        <CardDescription>A shared home for the team's next ideas.</CardDescription>
      </CardHeader>
      <CardContent data-measure="content">
        <div className="concentric-project-card__metadata">
        <div data-annotate="owner" className="concentric-project-card__owner">
          <Avatar>
            <AvatarImage src={persona.avatar} alt="" />
            <AvatarFallback>{persona.initials}</AvatarFallback>
          </Avatar>
          <div className="concentric-project-card__owner-text min-w-0">
            <div className="font-medium">{persona.name}</div>
            <div role="status" className="concentric-project-card__status">{copies ? "Copy of Studio workspace" : "Updated today"}</div>
          </div>
        </div>
        <div className="concentric-project-card__badges">
          <Badge variant="secondary">{archived ? "Archived" : "In progress"}</Badge>
          {pinned && <Badge variant="outline"><PinIcon />Pinned</Badge>}
        </div>
        </div>
        {opened && <div className="concentric-project-card__details"><span className="font-medium">Next milestone</span><span>Review the shared component collection.</span></div>}
      </CardContent>
      <CardFooter data-annotate="actions" data-measure="footer" className={`flex-wrap justify-end${scale === "normal" ? "" : " concentric-card__actions"}`}>
        <Button variant="secondary" aria-pressed={following} onClick={() => setFollowing(value => !value)}>{following ? "Following" : "Follow"}</Button>
        <Button data-annotate="action" aria-expanded={opened} onClick={() => setOpened(value => !value)}>{opened ? "Close project" : "Open project"}</Button>
      </CardFooter>
    </Card>
  )
}

function ConcentricSpecimen({ annotate = false, mediaRef }: { annotate?: boolean; mediaRef?: React.Ref<HTMLDivElement> }) {
  return (
    <div data-annotate="card" className="concentric-card grid grid-cols-(--concentric-compact-columns) @xl/concentric:flex">
      <div ref={mediaRef} data-annotate="media" className="concentric-card__media" aria-hidden="true">
        <ImageIcon />
      </div>
      <AnnotationBand data-active={annotate} data-annotate="gap-media-text" kind="gap" className="concentric-gap-band" />
      <div data-annotate="body" className="concentric-card__body">
        <strong className="concentric-card__title">Concentric corners</strong>
        <span className="concentric-card__description">A shared component collection, ready for review.</span>
      </div>
      <AnnotationBand data-active={annotate} data-annotate="gap-text-actions" kind="gap" className="concentric-gap-band col-span-full h-(--concentric-pad) @xl/concentric:h-auto" />
      <div data-annotate="actions" className="concentric-card__actions col-span-full justify-self-end">
        <Button variant="secondary">Details</Button>
        <Button data-annotate="action">Open</Button>
      </div>
    </div>
  )
}

function Concentric({ variant = "space-shape", composition = "horizontal" }: {
  variant?: "space-shape" | "type-controls"
  composition?: "horizontal" | "vertical" | "form"
} = {}) {
  const [radius, setRadius] = useState(MIN_RADIUS)
  const { grid, annotations: annotate, setGrid, setAnnotations: setAnnotate } = useCanvasPreviewState()
  const padding = Math.max(radius * PAD_RATIO, MIN_PAD)
  const scale = padding >= SCALE_PADDING.large ? "large" : padding >= SCALE_PADDING.medium ? "medium" : "normal"
  const inner = radius - padding
  const mediaRef = React.useRef<HTMLDivElement>(null)
  const [aspect, setAspect] = useState("1")

  React.useLayoutEffect(() => {
    const media = mediaRef.current
    if (!media) return
    const measure = () => setAspect(media.offsetHeight ? (media.offsetWidth / media.offsetHeight).toFixed(2) : "1")
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(media)
    return () => observer.disconnect()
  }, [])

  return (
    <CanvasPreviewFrame
      className="concentric-demo w-full min-w-0"
      data-variant={variant}
      data-scale={variant === "type-controls" ? scale : undefined}
      style={{ "--concentric-r": `${radius}px`, "--concentric-pad-ratio": PAD_RATIO } as React.CSSProperties}
      controls={
        <CanvasToolbar className="concentric-toolbar" aria-label="Concentric controls">
          <ToolbarGroup className="concentric-toolbar__control">
            <ToolbarTitle className="shrink-0 whitespace-nowrap">Corner radius</ToolbarTitle>
            <Slider
              className="concentric-toolbar__slider"
              value={[radius]}
              min={MIN_RADIUS}
              max={MAX_RADIUS}
              step={1}
              snapPoints={[SCALE_PADDING.normal, SCALE_PADDING.medium, SCALE_PADDING.large].map(padding => padding / PAD_RATIO)}
              snapMode="magnetic"
              onValueChange={(value) => setRadius(value[0] ?? MIN_RADIUS)}
              aria-label="Corner radius"
              aria-valuetext={`${radius} pixels`}
            />
          </ToolbarGroup>
          <CheckboxGroup className="concentric-toolbar__toggle" aria-label="Concentric display options" orientation="horizontal">
            <CheckboxGroupItem checked={grid} onCheckedChange={(value) => setGrid(value === true)} aria-label="Show grid">Grid</CheckboxGroupItem>
            <CheckboxGroupItem checked={annotate} onCheckedChange={(value) => setAnnotate(value === true)} aria-label="Show annotations">Annotations</CheckboxGroupItem>
          </CheckboxGroup>
        </CanvasToolbar>
      }
      footnote={
        composition !== "horizontal" ? <div className="grid gap-2"><span>{scale === "normal" ? "Normal" : scale === "medium" ? "Medium" : "Large"} scale / Padding {padding}px / Section gap {padding}px</span>{annotate && <AnnotationLegend />}</div> :
        <span className="concentric-equation">
          <span className="concentric-equation__term">inner <b>{inner}</b></span>
          <span className="concentric-equation__op" aria-hidden="true">=</span>
          <span className="concentric-equation__term">outer <b>{radius}</b></span>
          <span className="concentric-equation__op" aria-hidden="true">−</span>
          <span className="concentric-equation__term">padding <b>{padding}</b></span>
        </span>
      }
    >
      <Canvas layout="viewport" className="w-full">
        <CanvasGrid active={grid} />
        <CanvasWorkbench>
          <CanvasContent className="concentric-stage @container/concentric" data-composition={composition}>
            {composition === "form"
              ? <ConcentricProjectForm radius={radius} scale={scale} />
              : composition === "vertical"
              ? <ConcentricProjectCard radius={radius} scale={scale} mediaRef={mediaRef} />
              : <ConcentricSpecimen annotate={annotate} mediaRef={mediaRef} />}
            {composition === "horizontal" && <AnnotationLayer active={annotate} kind="padding" className="concentric-annotations">
              <div className="concentric-annotations__frame" aria-hidden="true" />
            </AnnotationLayer>}
            {composition !== "horizontal" && <AnnotationMeasurements
              active={annotate}
              targets={composition === "form" ? formSpacingTargets : cardSpacingTargets}
            />}
            <AnnotationCallouts
              active={annotate}
              items={composition === "form" ? [
                { id: "outer", target: "form", side: "top-left", content: "Card corner", label: true },
                { id: "input", target: "input", side: "bottom-left", content: "Input corner", label: true },
              ] : composition === "vertical" ? [
                { id: "outer", target: "card", side: "top-left", content: "Card corner", label: true },
                { id: "inner", target: "media", side: "top-right", content: "Media corner", label: true },
                { id: "aspect", target: "media", side: "top", content: `aspect ${aspect}`, label: true },
                { id: "button", target: "action", side: "bottom-right", content: "Button corner", label: true },
              ] : [
                { id: "outer", target: "card", side: "top-left", content: `outer ${radius}`, label: true },
                { id: "padding", kind: "padding", target: "card", side: "right", content: `padding ${padding}`, label: true },
                { id: "inner", target: "media", side: "bottom-left", content: `inner ${inner}`, label: true },
                { id: "button", target: "action", side: "bottom-right", content: `button ${inner}`, label: true },
                { id: "aspect", target: "media", side: "top", content: `aspect ${aspect}`, label: true },
                { id: "gap-media-text", kind: "gap", target: "gap-media-text", side: "bottom", content: `gap ${padding}`, label: true, markerAlign: "target" },
                { id: "gap-text-actions", kind: "gap", target: "gap-text-actions", side: "bottom", content: `gap ${padding}`, label: true, markerAlign: "target" },
              ]}
            />
          </CanvasContent>
        </CanvasWorkbench>
      </Canvas>
    </CanvasPreviewFrame>
  )
}

function ConcentricTypeControls() {
  return <Concentric variant="type-controls" />
}

function ConcentricVerticalCard() {
  return <Concentric variant="type-controls" composition="vertical" />
}

function ConcentricEditProject() {
  return <Concentric variant="type-controls" composition="form" />
}

export const concentricDemos: ComponentEntry[] = [
  {
    slug: "concentric",
    name: "Concentric",
    description: "Compare linked spacing and corners with a coordinated type and control scale in the same composition.",
    category: "Experiments",
    surface: "default",
    installCommand: null,
    ownsCanvas: true,
    defaultExampleName: "Space and Shape",
    defaultExampleHeader: { style: "inline", description: "Radius drives padding and inner corners. Button spacing stays fixed at 8px." },
    Demo: Concentric,
    codeSource: "complete",
    code: "",
    examples: [
      { name: "Type and Controls", description: "Typography, media, and buttons scale together: normal below 24px padding, medium from 24px to under 28px, and large at 28px. Snap to 20, 24, or 28px padding.", Demo: ConcentricTypeControls, ownsCanvas: true },
      { name: "Vertical Card", description: "Shared 20, 24, and 28px padding and section gaps, with continuous values between stops. Typography and controls step at 24px and 28px.", Demo: ConcentricVerticalCard, ownsCanvas: true },
      { name: "Edit Project", description: "The same padding and section-gap scale as Vertical Card, including spacing between fields. Save retains changes in this preview; Cancel restores the last saved values.", Demo: ConcentricEditProject, ownsCanvas: true },
    ],
  },
]