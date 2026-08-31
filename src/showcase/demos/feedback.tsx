import { useState } from "react"
import { toast } from "sonner"
import {
  InfoIcon,
  TriangleAlertIcon,
  CheckCircleIcon,
  SearchIcon,
} from "lucide-react"

import type { ComponentEntry } from "@/showcase/types"
import { persona } from "@/lib/persona"
import { Alert, AlertDescription, AlertTitle, AlertAction } from "@/components/ui/alert"
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
          <InfoIcon />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You can add components to your app using the CLI.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <TriangleAlertIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
        </Alert>
      </div>
    ),
    code: `import { InfoIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AlertDemo() {
  return (
    <Alert>
      <InfoIcon />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
  )
}`,
    examples: [
      {
        name: "Action",
        Demo: () => {
          const [dismissed, setDismissed] = useState(false)
          if (dismissed) {
            return (
              <div className="flex w-full max-w-md items-center gap-3">
                <CheckCircleIcon className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Alert dismissed</span>
                <Button size="xs" variant="outline" onClick={() => setDismissed(false)}>
                  Show again
                </Button>
              </div>
            )
          }
          return (
            <Alert className="w-full max-w-md">
              <InfoIcon />
              <AlertTitle>New update available</AlertTitle>
              <AlertDescription>
                A new version is ready to install. Restart to apply changes.
              </AlertDescription>
              <AlertAction>
                <Button size="xs" variant="outline" onClick={() => setDismissed(true)}>
                  Dismiss
                </Button>
              </AlertAction>
            </Alert>
          )
        },
      },
      {
        name: "Custom colors",
        Demo: () => (
          <div className="grid w-full max-w-md gap-4">
            <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              <CheckCircleIcon />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription className="text-emerald-700/80 dark:text-emerald-400/80">
                Your changes have been saved successfully.
              </AlertDescription>
            </Alert>
            <Alert className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400">
              <TriangleAlertIcon />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription className="text-amber-700/80 dark:text-amber-400/80">
                Your storage is almost full. Consider upgrading your plan.
              </AlertDescription>
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
                  size="xs"
                  variant="outline"
                  onClick={() => setValue((v) => Math.max(0, v - 10))}
                  disabled={value <= 0}
                >
                  −10
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => setValue((v) => Math.min(100, v + 10))}
                  disabled={value >= 100}
                >
                  +10
                </Button>
                <Button size="xs" variant="outline" onClick={() => setValue(0)}>
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
                size="sm"
                variant="outline"
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
                size="sm"
                variant="outline"
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
                size="sm"
                variant="outline"
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
                size="sm"
                variant="outline"
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
            <Badge variant="outline">
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
          <Empty className="w-full max-w-sm border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Spinner className="size-4" />
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
        variant="outline"
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: { label: "Undo", onClick: () => {} },
          })
        }
      >
        Show toast
      </Button>
    ),
    code: `import { toast } from "sonner"
import { Button } from "@/components/ui/button"

// Render <Toaster /> once near the root of your app.
export function SonnerDemo() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast("Event has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
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
        Demo: () => (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast("Default notification")}
            >
              Default
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success("Action completed")}
            >
              Success
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.error("Something went wrong")}
            >
              Error
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.warning("Check your input")}
            >
              Warning
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.info("New version available")}
            >
              Info
            </Button>
            <Button
              size="sm"
              variant="outline"
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
            <div className="flex flex-wrap items-center gap-2">
              {positions.map((pos) => (
                <Button
                  key={pos}
                  size="sm"
                  variant="outline"
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
