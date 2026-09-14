import { useState } from "react"
import { toast } from "sonner"
import { ToastShapeIcon } from "@/components/ui/sonner"
import {
  AlertCircleIcon,
  InfoIcon,
  TriangleAlertIcon,
  CheckCircleIcon,
  SearchIcon,
} from "@/components/ui/icons"

import type { ComponentEntry } from "@/showcase/types"
import { persona } from "@/lib/persona"
import { Alert, AlertAction, AlertContent, AlertDescription, AlertIcon, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"

export const feedbackDemos: ComponentEntry[] = [
  {
    slug: "alert",
    name: "Alert",
    description: "Displays a callout for user attention.",
    category: "Feedback",
    Demo: () => (
      <div className="grid w-full max-w-md gap-4">
        <Alert>
          <AlertIcon><InfoIcon /></AlertIcon>
          <AlertContent>
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              You can add components to your app using the CLI.
            </AlertDescription>
          </AlertContent>
        </Alert>
        <Alert variant="error">
          <AlertIcon><AlertCircleIcon /></AlertIcon>
          <AlertContent>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
          </AlertContent>
        </Alert>
      </div>
    ),
    code: `import { InfoIcon } from "@/components/ui/icons"
import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from "@/components/ui/alert"

export function AlertDemo() {
  return (
    <Alert>
      <AlertIcon><InfoIcon /></AlertIcon>
      <AlertContent>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the CLI.
        </AlertDescription>
      </AlertContent>
    </Alert>
  )
}`,
    examples: [
      {
        name: "Action",
        Demo: () => (
          <Alert variant="info" className="w-full max-w-md">
            <AlertIcon><InfoIcon /></AlertIcon>
            <AlertContent>
              <AlertTitle>New update available</AlertTitle>
              <AlertDescription>
                A new version is ready to install. Restart to apply changes.
              </AlertDescription>
            </AlertContent>
            <AlertAction>
              <Button size="expressive" variant="primary">
                Dismiss
              </Button>
            </AlertAction>
          </Alert>
        ),
      },
      {
        name: "Semantic tones",
        Demo: () => (
          <div className="grid w-full max-w-md gap-4">
            <Alert variant="success">
              <AlertIcon><CheckCircleIcon /></AlertIcon>
              <AlertContent>
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Your changes have been saved successfully.
                </AlertDescription>
              </AlertContent>
            </Alert>
            <Alert variant="warning">
              <AlertIcon><TriangleAlertIcon /></AlertIcon>
              <AlertContent>
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Your storage is almost full. Consider upgrading your plan.
                </AlertDescription>
              </AlertContent>
            </Alert>
          </div>
        ),
      },
    ],
  },
  {
    slug: "progress",
    name: "Progress",
    description: "Displays an indicator showing completion progress.",
    category: "Feedback",
    Demo: () => <Progress value={60} className="w-full max-w-sm" />,
    code: `import { Progress } from "@/components/ui/progress"

export function ProgressDemo() {
  return <Progress value={60} className="w-full max-w-sm" />
}`,
    examples: [
      {
        name: "Label",
        Demo: () => (
          <div className="grid w-full max-w-sm gap-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading files…</span>
              <span className="text-muted-foreground">73%</span>
            </div>
            <Progress value={73} />
          </div>
        ),
      },
      {
        name: "Controlled",
        Demo: () => {
          const [value, setValue] = useState(40)
          return (
            <div className="grid w-full max-w-sm gap-3">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span className="text-muted-foreground">{value}%</span>
              </div>
              <Progress value={value} />
              <div className="flex items-center gap-2">
                <Button
                  size="default"
                  variant="secondary"
                  onClick={() => setValue((v) => Math.max(0, v - 10))}
                  disabled={value <= 0}
                >
                  −10
                </Button>
                <Button
                  size="default"
                  variant="secondary"
                  onClick={() => setValue((v) => Math.min(100, v + 10))}
                  disabled={value >= 100}
                >
                  +10
                </Button>
                <Button size="default" variant="secondary" onClick={() => setValue(0)}>
                  Reset
                </Button>
              </div>
            </div>
          )
        },
      },
    ],
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    description: "Use to show a placeholder while content is loading.",
    category: "Feedback",
    Demo: () => (
      <div className="flex items-center gap-4">
        <Skeleton className="size-12 rounded-full" />
        <div className="grid gap-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    ),
    code: `import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonDemo() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="grid gap-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  )
}`,
    examples: [
      {
        name: "Card",
        Demo: () => {
          const [loaded, setLoaded] = useState(false)
          return (
            <div className="grid w-full max-w-sm gap-3">
              <Card>
                {loaded ? (
                  <>
                    <CardHeader>
                      <CardTitle>Team standup</CardTitle>
                      <CardDescription>Daily sync at 9:00 AM</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Discuss blockers, progress, and priorities for the day.
                      </p>
                    </CardContent>
                  </>
                ) : (
                  <>
                    <CardHeader>
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-44" />
                    </CardHeader>
                    <CardContent className="grid gap-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </>
                )}
              </Card>
              <Button
                size="default"
                variant="secondary"
                onClick={() => setLoaded((v) => !v)}
              >
                {loaded ? "Reset" : "Load"}
              </Button>
            </div>
          )
        },
      },
      {
        name: "Text",
        Demo: () => {
          const [loaded, setLoaded] = useState(false)
          return (
            <div className="grid w-full max-w-sm gap-3">
              {loaded ? (
                <div className="grid gap-2 text-sm">
                  <p className="font-medium">Project overview</p>
                  <p className="text-muted-foreground">
                    The design system ships a unified component library used
                    across all product surfaces.
                  </p>
                </div>
              ) : (
                <div className="grid gap-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              )}
              <Button
                size="default"
                variant="secondary"
                onClick={() => setLoaded((v) => !v)}
              >
                {loaded ? "Reset" : "Load"}
              </Button>
            </div>
          )
        },
      },
      {
        name: "Form",
        Demo: () => {
          const [loaded, setLoaded] = useState(false)
          return (
            <div className="grid w-full max-w-sm gap-3">
              {loaded ? (
                <div className="grid gap-4">
                  <div className="grid gap-1.5">
                    <span className="text-sm font-medium">Name</span>
                    <InputGroup>
                      <InputGroupInput placeholder="Your name" readOnly defaultValue="Ada Lovelace" />
                    </InputGroup>
                  </div>
                  <div className="grid gap-1.5">
                    <span className="text-sm font-medium">Email</span>
                    <InputGroup>
                      <InputGroupInput placeholder="Email" readOnly defaultValue={persona.email} />
                    </InputGroup>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  <div className="grid gap-1.5">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-8 w-full rounded-lg" />
                  </div>
                  <div className="grid gap-1.5">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-8 w-full rounded-lg" />
                  </div>
                </div>
              )}
              <Button
                size="default"
                variant="secondary"
                onClick={() => setLoaded((v) => !v)}
              >
                {loaded ? "Reset" : "Load"}
              </Button>
            </div>
          )
        },
      },
      {
        name: "Table",
        Demo: () => {
          const [loaded, setLoaded] = useState(false)
          const rows = [
            { name: "Widgets", status: "Active", count: 124 },
            { name: "Gadgets", status: "Paused", count: 57 },
            { name: "Doodads", status: "Active", count: 312 },
          ]
          return (
            <div className="grid w-full max-w-md gap-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loaded
                    ? rows.map((r) => (
                        <TableRow key={r.name}>
                          <TableCell className="font-medium">{r.name}</TableCell>
                          <TableCell>{r.status}</TableCell>
                          <TableCell className="text-right">{r.count}</TableCell>
                        </TableRow>
                      ))
                    : Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-14" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-8" /></TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
              <Button
                size="default"
                variant="secondary"
                onClick={() => setLoaded((v) => !v)}
              >
                {loaded ? "Reset" : "Load"}
              </Button>
            </div>
          )
        },
      },
    ],
  },
  {
    slug: "spinner",
    name: "Spinner",
    description: "An indicator that content is loading.",
    category: "Feedback",
    Demo: () => (
      <div className="flex items-center gap-6">
        <Spinner />
        <Button disabled>
          <Spinner />
          Please wait
        </Button>
      </div>
    ),
    code: `import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"

export function SpinnerDemo() {
  return (
    <Button disabled>
      <Spinner />
      Please wait
    </Button>
  )
}`,
    examples: [
      {
        name: "Sizes",
        Demo: () => (
          <div className="flex items-center gap-6">
            <Spinner className="size-3" />
            <Spinner />
            <Spinner className="size-5" />
            <Spinner className="size-6" />
            <Spinner className="size-8" />
          </div>
        ),
      },
      {
        name: "Badge",
        Demo: () => (
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary">
              <Spinner className="size-3" />
              Syncing
            </Badge>
            <Badge variant="tertiary">
              <Spinner className="size-3" />
              Processing
            </Badge>
          </div>
        ),
      },
      {
        name: "Input group",
        Demo: () => (
          <InputGroup className="w-full max-w-sm">
            <InputGroupAddon align="inline-start">
              <InputGroupText>
                <SearchIcon />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput placeholder="Searching…" readOnly />
            <InputGroupAddon align="inline-end">
              <InputGroupText>
                <Spinner />
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        ),
      },
      {
        name: "Empty",
        Demo: () => (
          <Empty variant="tonal">
            <EmptyHeader>
              <EmptyMedia variant="icon" shape="cookie9">
                <Spinner className="size-(--empty-media-graphic-size)" />
              </EmptyMedia>
              <EmptyTitle>Loading data</EmptyTitle>
              <EmptyDescription>
                Please wait while we fetch your records.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ),
      },
    ],
  },
  {
    slug: "sonner",
    name: "Sonner (Toast)",
    description: "An opinionated toast component for React.",
    category: "Feedback",
    Demo: () => (
      <Button
        variant="secondary"
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2026 at 9:00 AM",
            icon: (
              <ToastShapeIcon>
                <InfoIcon />
              </ToastShapeIcon>
            ),
            action: { label: "Undo", onClick: () => {} },
          })
        }
      >
        Show toast
      </Button>
    ),
    code: `import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ToastShapeIcon } from "@/components/ui/sonner"
import { InfoIcon } from "@/components/ui/icons"

// Render <Toaster /> once near the root of your app.
export function SonnerDemo() {
  return (
    <Button
      variant="secondary"
      onClick={() =>
        toast("Event has been created", {
          description: "Sunday, December 03, 2026 at 9:00 AM",
          icon: (
            <ToastShapeIcon>
              <InfoIcon />
            </ToastShapeIcon>
          ),
          action: { label: "Undo", onClick: () => {} },
        })
      }
    >
      Show toast
    </Button>
  )
}`,
    examples: [
      {
        name: "Types",
        description:
          "Trigger status toasts with expressive icons, descriptions, and promise states.",
        Demo: () => (
          <div className="flex flex-wrap items-center gap-(--space-xs)">
            <Button
              size="default"
              variant="secondary"
              onClick={() =>
                toast("Default notification", {
                  icon: (
                    <ToastShapeIcon>
                      <InfoIcon />
                    </ToastShapeIcon>
                  ),
                })
              }
            >
              Default
            </Button>
            <Button
              size="default"
              variant="secondary"
              onClick={() => toast.success("Action completed")}
            >
              Success
            </Button>
            <Button
              size="default"
              variant="secondary"
              onClick={() => toast.error("Something went wrong")}
            >
              Error
            </Button>
            <Button
              size="default"
              variant="secondary"
              onClick={() => toast.warning("Check your input")}
            >
              Warning
            </Button>
            <Button
              size="default"
              variant="secondary"
              onClick={() => toast.info("New version available")}
            >
              Info
            </Button>
            <Button
              size="default"
              variant="secondary"
              onClick={() =>
                toast.promise(
                  new Promise<{ name: string }>((resolve) =>
                    setTimeout(() => resolve({ name: "report.csv" }), 2000)
                  ),
                  {
                    loading: "Generating report…",
                    success: (data) => `${data.name} is ready`,
                    error: "Failed to generate report",
                  }
                )
              }
            >
              Promise
            </Button>
          </div>
        ),
      },
      {
        name: "Positions",
        description:
          "Anchor toasts to any viewport corner or center alignment.",
        Demo: () => {
          const positions = [
            "top-left",
            "top-center",
            "top-right",
            "bottom-left",
            "bottom-center",
            "bottom-right",
          ] as const
          return (
            <div className="flex flex-wrap items-center gap-(--space-xs)">
              {positions.map((pos) => (
                <Button
                  key={pos}
                  size="default"
                  variant="secondary"
                  onClick={() =>
                    toast(`Toast at ${pos}`, { position: pos })
                  }
                >
                  {pos}
                </Button>
              ))}
            </div>
          )
        },
      },
    ],
  },
]
