import { useId, useState } from "react"
import { ArrowUpRightIcon, CopyIcon, HeartIcon, MoreHorizontalIcon, PlusIcon, RotateCcwIcon, TrashIcon } from "@/components/ui/icons"

import { Pointer, PointerTarget, type PointerGrowth, type PointerSize, type PointerMotionSettings } from "@/components/ui/pointer"
import { PointerMotionControl } from "@/components/ui/pointer-motion-settings"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Canvas, CanvasContent, CanvasToolbar } from "@/components/ui/canvas"
import { Card, CardContent } from "@/components/ui/card"
import { CanvasPreviewFrame } from "@/components/ui/canvas-preview"
import { CheckboxGroup, CheckboxGroupItem } from "@/components/ui/checkbox"
import { Cluster } from "@/components/ui/cluster"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Stack } from "@/components/ui/stack"
import { Text } from "@/components/ui/text"
import { ToolbarGroup, ToolbarTitle, ToolbarSpacer } from "@/components/ui/toolbar"
import { persona } from "@/lib/persona"
import type { ComponentEntry } from "@/showcase/types"

function PointerExperiment() {
  const id = useId()
  const [enabled, setEnabled] = useState(true)
  const [capture, setCapture] = useState(true)
  const [size, setSize] = useState<PointerSize>("default")
  const [growth, setGrowth] = useState<PointerGrowth>("default")
  const [motionDefaults] = useState(() => {
    const tokens = getComputedStyle(document.documentElement)
    return {
      in: { easing: "expressive", velocity: Number(tokens.getPropertyValue("--pointer-sprint-move-velocity")) } as PointerMotionSettings,
      out: { easing: "expressive", velocity: Number(tokens.getPropertyValue("--pointer-sprint-release-velocity")) } as PointerMotionSettings,
    }
  })
  const [inMotion, setInMotion] = useState(motionDefaults.in)
  const [outMotion, setOutMotion] = useState(motionDefaults.out)
  const [saved, setSaved] = useState(0)
  const [liked, setLiked] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [name, setName] = useState("Studio workspace")
  const [activity, setActivity] = useState("All changes saved")
  const reset = () => {
    setEnabled(true); setCapture(true); setSize("default"); setGrowth("default")
    setInMotion(motionDefaults.in); setOutMotion(motionDefaults.out)
    setSaved(0); setLiked(false); setPinned(false); setName("Studio workspace"); setActivity("All changes saved")
  }
  return (
    <CanvasPreviewFrame controls={
      <CanvasToolbar aria-label="Pointer experiment controls">
        <ToolbarGroup>
          <ToolbarTitle>Motion</ToolbarTitle>
          <PointerMotionControl direction="in" value={inMotion} onValueChange={setInMotion} />
          <PointerMotionControl direction="out" value={outMotion} onValueChange={setOutMotion} />
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarTitle id={`${id}-size-label`} className="shrink-0 whitespace-nowrap">Pointer size</ToolbarTitle>
          <Select value={size} onValueChange={value => setSize(value as PointerSize)}>
            <SelectTrigger id={`${id}-size`} aria-labelledby={`${id}-size-label`}><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="compact">Compact</SelectItem><SelectItem value="default">Default</SelectItem><SelectItem value="large">Large</SelectItem></SelectContent>
          </Select>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarTitle id={`${id}-growth-label`} className="shrink-0 whitespace-nowrap">Link growth</ToolbarTitle>
          <Select value={growth} onValueChange={value => setGrowth(value as PointerGrowth)}>
            <SelectTrigger id={`${id}-growth`} aria-labelledby={`${id}-growth-label`}><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="subtle">Subtle</SelectItem><SelectItem value="default">Default</SelectItem><SelectItem value="bold">Bold</SelectItem></SelectContent>
          </Select>
        </ToolbarGroup>
        <CheckboxGroup orientation="horizontal" aria-label="Pointer options">
          <CheckboxGroupItem checked={enabled} onCheckedChange={value => setEnabled(value === true)}>Custom pointer</CheckboxGroupItem>
          <CheckboxGroupItem checked={capture} onCheckedChange={value => setCapture(value === true)}>Shape capture</CheckboxGroupItem>
        </CheckboxGroup>
        <ToolbarSpacer />
        <Button variant="secondary" size="icon" aria-label="Reset experiment" onClick={reset}><RotateCcwIcon /></Button>
      </CanvasToolbar>
    }>
      <Pointer enabled={enabled} capture={capture} size={size} growth={growth} inMotion={inMotion} outMotion={outMotion}>
        <Canvas layout="viewport">
          <CanvasContent className="max-w-2xl">
            <Stack gap="lg">
              <Card>
                <CardContent>
                <Stack>
                  <Cluster>
                    <Avatar><AvatarImage src={persona.avatar} alt="" /><AvatarFallback>{persona.initials}</AvatarFallback></Avatar>
                    <Stack gap="sm"><Text variant="label">{name || "Untitled workspace"}</Text><Text variant="metadata" tone="muted">{pinned ? "Pinned project" : "Design exploration"}</Text></Stack>
                  </Cluster>
                  <Cluster>
                    <PointerTarget><Button onClick={() => { setSaved(saved + 1); setActivity(`${saved + 1} versions saved`) }}><PlusIcon />Save version</Button></PointerTarget>
                    <PointerTarget><Button variant="secondary" onClick={() => setActivity("Project duplicated")}><CopyIcon />Duplicate</Button></PointerTarget>
                    <PointerTarget><Button disabled>Publish</Button></PointerTarget>
                  </Cluster>
                  <Cluster>
                    <PointerTarget><Button size="expressive" onClick={() => setActivity("Review started")}>Start review<ArrowUpRightIcon /></Button></PointerTarget>
                    <PointerTarget><Button size="icon-expressive" variant="secondary" aria-label="Like project" aria-pressed={liked} onClick={() => setLiked(!liked)}><HeartIcon fill={liked ? "currentColor" : "none"} /></Button></PointerTarget>
                  </Cluster>
                  <Cluster>
                    <ButtonGroup>
                      <PointerTarget><Button size="icon" variant="ghost" aria-label="Add item" onClick={() => setActivity("Item added")}><PlusIcon /></Button></PointerTarget>
                      <PointerTarget><Button size="icon" variant="ghost" aria-label="Copy item" onClick={() => setActivity("Item copied")}><CopyIcon /></Button></PointerTarget>
                      <PointerTarget><Button size="icon" variant="ghost" aria-label="Delete item" onClick={() => setActivity("Item deleted")}><TrashIcon /></Button></PointerTarget>
                    </ButtonGroup>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild tooltip="Project actions"><PointerTarget><Button variant="ghost" size="icon" aria-label="Project actions"><MoreHorizontalIcon /></Button></PointerTarget></DropdownMenuTrigger>
                      <PointerTarget mode="circle">
                        <DropdownMenuContent>
                          <PointerTarget><DropdownMenuItem onSelect={() => setActivity("Project opened")}>Open project</DropdownMenuItem></PointerTarget>
                          <PointerTarget><DropdownMenuItem onSelect={() => setActivity("Project duplicated")}>Duplicate project</DropdownMenuItem></PointerTarget>
                          <PointerTarget><DropdownMenuCheckboxItem checked={pinned} onCheckedChange={setPinned}>Pin project</DropdownMenuCheckboxItem></PointerTarget>
                          <DropdownMenuSeparator />
                          <PointerTarget><DropdownMenuItem disabled>Export project</DropdownMenuItem></PointerTarget>
                          <PointerTarget><DropdownMenuItem variant="destructive" onSelect={() => setActivity("Project archived")}>Archive project</DropdownMenuItem></PointerTarget>
                        </DropdownMenuContent>
                      </PointerTarget>
                    </DropdownMenu>
                    <PointerTarget mode="link"><Button variant="link" onClick={() => setActivity("Version history opened")}>Version history</Button></PointerTarget>
                  </Cluster>
                </Stack>
                </CardContent>
              </Card>
              <Card className="dark">
                <CardContent>
                <Stack>
                  <Text variant="label">A space for the next idea</Text>
                  <Text>Good tools leave room to explore. Small changes can make familiar interactions feel different.</Text>
                  <Cluster>
                    <PointerTarget><Button variant="secondary" onClick={() => setActivity("Invitation created")}>Invite collaborator</Button></PointerTarget>
                    <PointerTarget mode="link"><Button variant="link" onClick={() => setActivity("Project notes opened")}>Project notes</Button></PointerTarget>
                  </Cluster>
                </Stack>
                </CardContent>
              </Card>
              <Field>
                <FieldLabel htmlFor={`${id}-name`}>Project name</FieldLabel>
                <Input id={`${id}-name`} value={name} onChange={event => setName(event.target.value)} />
              </Field>
              <Text variant="metadata" tone="muted" role="status">{activity}</Text>
            </Stack>
          </CanvasContent>
        </Canvas>
      </Pointer>
    </CanvasPreviewFrame>
  )
}

const pointerDemos: ComponentEntry[] = [{
  slug: "pointer", name: "Pointer", category: "Experiments", surface: "default", ownsCanvas: true,
  description: "Tune In and Out independently with easing and speed in CSS pixels per second. Timing follows distance, not a fixed duration. Native cursors remain on editable fields, touch, reduced motion, and forced colors.",
  Demo: PointerExperiment, code: "", codeSource: "complete", installCommand: null,
}]

export { PointerExperiment, pointerDemos }