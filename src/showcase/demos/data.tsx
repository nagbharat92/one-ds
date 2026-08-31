import { useCallback, useEffect, useRef, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ArrowRightIcon,
  ChevronDownIcon,
  FolderIcon,
  ImageIcon,
  InboxIcon,
  LinkIcon,
  LogOutIcon,
  MailIcon,
  SearchIcon,
  SettingsIcon,
  ShieldIcon,
  StarIcon,
  UserIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react"

import type { ComponentEntry } from "@/showcase/types"
import { persona } from "@/lib/persona"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

const chartData = [
  { month: "Jan", desktop: 186 },
  { month: "Feb", desktop: 305 },
  { month: "Mar", desktop: 237 },
  { month: "Apr", desktop: 173 },
  { month: "May", desktop: 209 },
  { month: "Jun", desktop: 264 },
]

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
} satisfies ChartConfig

function CarouselApiDemo() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
    api.on("select", () => setCurrent(api.selectedScrollSnap() + 1))
  }, [api])

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-2">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, i) => (
            <CarouselItem key={i}>
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{i + 1}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <p className="text-sm text-muted-foreground">
        Slide {current} of {count}
      </p>
    </div>
  )
}

function CarouselPluginsDemo() {
  const [api, setApi] = useState<CarouselApi>()
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null)
  const [playing, setPlaying] = useState(true)

  const start = useCallback(() => {
    if (!api) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      if (api.canScrollNext()) api.scrollNext()
      else api.scrollTo(0)
    }, 2500)
    setPlaying(true)
  }, [api])

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
    setPlaying(false)
  }, [])

  useEffect(() => {
    if (!api) return
    start()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [api, start])

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-3">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, i) => (
            <CarouselItem key={i}>
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{i + 1}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <Button
        variant="outline"
        size="sm"
        onClick={() => (playing ? stop() : start())}
      >
        {playing ? "Pause" : "Play"}
      </Button>
    </div>
  )
}

export const dataDemos: ComponentEntry[] = [
  {
    slug: "avatar",
    name: "Avatar",
    description: "An image element with a fallback for representing the user.",
    category: "Data Display",
    Demo: () => (
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={persona.avatar} alt="" />
          <AvatarFallback>{persona.initials}</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>{persona.manager.initials}</AvatarFallback>
        </Avatar>
      </div>
    ),
    code: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { persona } from "@/lib/persona"

export function AvatarDemo() {
  return (
    <Avatar>
      <AvatarImage src={persona.avatar} alt="" />
      <AvatarFallback>{persona.initials}</AvatarFallback>
    </Avatar>
  )
}`,
    examples: [
      {
        name: "Badge",
        description: "Avatar with a status badge indicator.",
        Demo: () => (
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={persona.avatar} alt="" />
              <AvatarFallback>{persona.initials}</AvatarFallback>
              <AvatarBadge />
            </Avatar>
            <Avatar size="lg">
              <AvatarImage src={persona.avatar} alt="" />
              <AvatarFallback>{persona.initials}</AvatarFallback>
              <AvatarBadge />
            </Avatar>
          </div>
        ),
      },
      {
        name: "Badge with Icon",
        description: "Avatar badge with a small icon overlay.",
        Demo: () => (
          <Avatar size="lg">
            <AvatarImage src={persona.avatar} alt="" />
            <AvatarFallback>{persona.initials}</AvatarFallback>
            <AvatarBadge>
              <ZapIcon />
            </AvatarBadge>
          </Avatar>
        ),
      },
      {
        name: "Avatar Group",
        description: "Stack avatars in an overlapping group.",
        Demo: () => (
          <AvatarGroup>
            <Avatar>
              <AvatarImage src={persona.avatar} alt="" />
              <AvatarFallback>{persona.initials}</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>{persona.teammates[0].initials}</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>{persona.teammates[1].initials}</AvatarFallback>
            </Avatar>
          </AvatarGroup>
        ),
      },
      {
        name: "Avatar Group Count",
        description: "Group with a count indicator for overflow.",
        Demo: () => (
          <AvatarGroup>
            <Avatar>
              <AvatarImage src={persona.avatar} alt="" />
              <AvatarFallback>{persona.initials}</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>{persona.teammates[0].initials}</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>{persona.teammates[1].initials}</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>+3</AvatarGroupCount>
          </AvatarGroup>
        ),
      },
      {
        name: "Avatar Group with Icon",
        description: "Group count slot holding an icon.",
        Demo: () => (
          <AvatarGroup>
            <Avatar>
              <AvatarImage src={persona.avatar} alt="" />
              <AvatarFallback>{persona.initials}</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>{persona.teammates[0].initials}</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>
              <UsersIcon />
            </AvatarGroupCount>
          </AvatarGroup>
        ),
      },
      {
        name: "Sizes",
        description: "Available avatar sizes.",
        Demo: () => (
          <div className="flex items-center gap-4">
            <Avatar size="sm">
              <AvatarFallback>{persona.initials}</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>{persona.initials}</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback>{persona.initials}</AvatarFallback>
            </Avatar>
          </div>
        ),
      },
      {
        name: "Dropdown",
        description: "Avatar as a dropdown menu trigger.",
        Demo: () => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
                <Avatar>
                  <AvatarImage src={persona.avatar} alt="" />
                  <AvatarFallback>{persona.initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <UserIcon />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SettingsIcon />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOutIcon />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
  },
  {
    slug: "badge",
    name: "Badge",
    description: "Displays a badge or a component that looks like a badge.",
    category: "Data Display",
    Demo: () => (
      <div className="flex flex-wrap items-center gap-3">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    ),
    code: `import { Badge } from "@/components/ui/badge"

export function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  )
}`,
    examples: [
      {
        name: "With Icon",
        description: "Badge with a leading icon.",
        Demo: () => (
          <div className="flex flex-wrap items-center gap-3">
            <Badge><ShieldIcon data-icon="inline-start" />Secure</Badge>
            <Badge variant="secondary"><StarIcon data-icon="inline-start" />Featured</Badge>
            <Badge variant="destructive"><ZapIcon data-icon="inline-start" />Critical</Badge>
            <Badge variant="outline"><MailIcon data-icon="inline-start" />Inbox</Badge>
          </div>
        ),
      },
      {
        name: "With Spinner",
        description: "Badge with a loading spinner.",
        Demo: () => (
          <Badge variant="secondary">
            <Spinner className="size-3" />
            Syncing
          </Badge>
        ),
      },
      {
        name: "Link",
        description: "Badge rendered as a clickable link.",
        Demo: () => (
          <Badge variant="link" asChild>
            <a
              href="https://github.com/shadcn-ui/ui"
              onClick={(e) => e.preventDefault()}
            >
              shadcn/ui
            </a>
          </Badge>
        ),
      },
      {
        name: "Custom Colors",
        description: "Badges with semantic color overrides.",
        Demo: () => (
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-chart-1 text-white">Chart 1</Badge>
            <Badge className="bg-chart-2 text-white">Chart 2</Badge>
            <Badge className="bg-chart-3 text-white">Chart 3</Badge>
            <Badge className="bg-chart-4 text-white">Chart 4</Badge>
            <Badge className="bg-chart-5 text-white">Chart 5</Badge>
          </div>
        ),
      },
    ],
  },
  {
    slug: "card",
    name: "Card",
    description: "Displays a card with header, content, and footer.",
    category: "Data Display",
    Demo: () => (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>Deploy your new project in one click.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <Label htmlFor="demo-card-name">Name</Label>
            <Input id="demo-card-name" placeholder="Name of your project" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Deploy</Button>
        </CardFooter>
      </Card>
    ),
    code: `import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one click.</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  )
}`,
    examples: [
      {
        name: "Sizes",
        description: "Default and small card sizes.",
        Demo: () => (
          <div className="flex flex-wrap items-start gap-4">
            <Card className="w-full max-w-xs">
              <CardHeader>
                <CardTitle>Default</CardTitle>
                <CardDescription>Standard spacing and type.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Card body content.</p>
              </CardContent>
            </Card>
            <Card size="sm" className="w-full max-w-xs">
              <CardHeader>
                <CardTitle>Small</CardTitle>
                <CardDescription>Tighter spacing.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Card body content.</p>
              </CardContent>
            </Card>
          </div>
        ),
      },
      {
        name: "Spacing",
        description: "Card with separated header, content, and footer.",
        Demo: () => (
          <Card className="w-full max-w-sm">
            <CardHeader className="border-b">
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid gap-3">
                <Label htmlFor="card-spacing-email">Email</Label>
                <Input id="card-spacing-email" placeholder="you@example.com" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </CardFooter>
          </Card>
        ),
      },
      {
        name: "Preview Canvas",
        description: "The centered white card used to stage every showcase example.",
        Demo: () => (
          <Card variant="preview" className="min-h-48 w-full max-w-md">
            <Button variant="outline">Component preview</Button>
          </Card>
        ),
        code: `<Card variant="preview">
  <YourComponent />
</Card>`,
      },
      {
        name: "Image",
        description: "Card with a top image.",
        Demo: () => (
          <Card className="w-full max-w-sm">
            <img
              src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
              alt="Landscape"
              className="aspect-video w-full object-cover"
            />
            <CardHeader>
              <CardTitle>Mountain view</CardTitle>
              <CardDescription>A landscape photograph from Unsplash.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" size="sm">
                <LinkIcon />
                Share
              </Button>
            </CardFooter>
          </Card>
        ),
      },
    ],
  },
  {
    slug: "table",
    name: "Table",
    description: "A responsive table component for displaying tabular data.",
    category: "Data Display",
    Demo: () => (
      <Table className="w-full max-w-md">
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">INV002</TableCell>
            <TableCell>Pending</TableCell>
            <TableCell className="text-right">$150.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ),
    code: `import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function TableDemo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}`,
    examples: [
      {
        name: "Footer",
        description: "Table with a summary footer row.",
        layout: "wide" as const,
        Demo: () => (
          <Table>
            <TableCaption>Monthly expense summary.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Hosting</TableCell>
                <TableCell>Cloud infrastructure</TableCell>
                <TableCell className="text-right">$1,200.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Domain</TableCell>
                <TableCell>Annual renewal</TableCell>
                <TableCell className="text-right">$14.99</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Email</TableCell>
                <TableCell>Business plan</TableCell>
                <TableCell className="text-right">$6.00</TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell className="text-right font-medium">$1,220.99</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        ),
      },
      {
        name: "Actions",
        description: "Rows with inline action buttons.",
        layout: "wide" as const,
        Demo: () => {
          const [rows, setRows] = useState([
            { id: "u1", name: persona.name, role: "Admin", status: "Active" },
            {
              id: "u2",
              name: persona.teammates[0].name,
              role: "Editor",
              status: "Active",
            },
            {
              id: "u3",
              name: persona.teammates[1].name,
              role: "Viewer",
              status: "Inactive",
            },
          ])

          return (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>
                      <Badge variant={row.status === "Active" ? "default" : "secondary"}>
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setRows((prev) =>
                            prev.map((r) =>
                              r.id === row.id
                                ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" }
                                : r
                            )
                          )
                        }
                      >
                        Toggle
                      </Button>
                    </TableCell>
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
    slug: "item",
    name: "Item",
    description: "A flexible container for lists, rows and content blocks.",
    category: "Data Display",
    Demo: () => (
      <Item className="w-full max-w-sm rounded-lg border">
        <ItemMedia>
          <Avatar>
            <AvatarImage src={persona.avatar} alt="" />
            <AvatarFallback>{persona.initials}</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{persona.name}</ItemTitle>
          <ItemDescription>Last seen 5 months ago</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Follow
          </Button>
        </ItemActions>
      </Item>
    ),
    code: `import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

export function ItemDemo() {
  return (
    <Item className="rounded-lg border">
      <ItemMedia>
        <Avatar>
          <AvatarFallback>{persona.initials}</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{persona.name}</ItemTitle>
        <ItemDescription>Last seen 5 months ago</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm">Follow</Button>
      </ItemActions>
    </Item>
  )
}`,
    examples: [
      {
        name: "Variants",
        description: "Default, outline, and muted item styles.",
        layout: "wide" as const,
        Demo: () => (
          <div className="flex w-full max-w-md flex-col gap-3">
            <Item variant="default">
              <ItemContent>
                <ItemTitle>Default</ItemTitle>
                <ItemDescription>No visible border.</ItemDescription>
              </ItemContent>
            </Item>
            <Item variant="outline">
              <ItemContent>
                <ItemTitle>Outline</ItemTitle>
                <ItemDescription>Bordered row.</ItemDescription>
              </ItemContent>
            </Item>
            <Item variant="muted">
              <ItemContent>
                <ItemTitle>Muted</ItemTitle>
                <ItemDescription>Subtle background fill.</ItemDescription>
              </ItemContent>
            </Item>
          </div>
        ),
      },
      {
        name: "Sizes",
        description: "Default, small and extra-small sizing.",
        layout: "wide" as const,
        Demo: () => (
          <div className="flex w-full max-w-md flex-col gap-3">
            <Item variant="outline">
              <ItemContent>
                <ItemTitle>Default size</ItemTitle>
              </ItemContent>
            </Item>
            <Item variant="outline" size="sm">
              <ItemContent>
                <ItemTitle>Small size</ItemTitle>
              </ItemContent>
            </Item>
            <Item variant="outline" size="xs">
              <ItemContent>
                <ItemTitle>Extra-small size</ItemTitle>
              </ItemContent>
            </Item>
          </div>
        ),
      },
      {
        name: "Image",
        description: "Item with an image media slot.",
        Demo: () => (
          <Item variant="outline" className="w-full max-w-sm">
            <ItemMedia variant="image">
              <img
                src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=200&q=80"
                alt="Landscape"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Mountain view</ItemTitle>
              <ItemDescription>A landscape photograph.</ItemDescription>
            </ItemContent>
          </Item>
        ),
      },
      {
        name: "Group",
        description: "Items composed within a list group.",
        layout: "wide" as const,
        Demo: () => (
          <ItemGroup className="w-full max-w-md">
            {["Design", "Engineering", "Marketing"].map((team) => (
              <Item key={team} variant="outline">
                <ItemMedia variant="icon">
                  <UsersIcon />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{team}</ItemTitle>
                  <ItemDescription>Team workspace</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button variant="ghost" size="sm">
                    <ArrowRightIcon />
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        ),
      },
      {
        name: "Header",
        description: "Item with a full-width header row.",
        Demo: () => (
          <Item variant="outline" className="w-full max-w-sm">
            <ItemHeader>
              <Badge variant="secondary">v2.1.0</Badge>
              <span className="text-xs text-muted-foreground">2 days ago</span>
            </ItemHeader>
            <ItemContent>
              <ItemTitle>Release notes</ItemTitle>
              <ItemDescription>Bug fixes and performance improvements.</ItemDescription>
            </ItemContent>
          </Item>
        ),
      },
      {
        name: "Link",
        description: "Clickable item rendered as an anchor.",
        Demo: () => (
          <Item variant="outline" asChild className="w-full max-w-sm">
            <a href="https://github.com/shadcn-ui/ui" onClick={(e) => e.preventDefault()}>
              <ItemMedia variant="icon">
                <LinkIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>shadcn/ui repository</ItemTitle>
                <ItemDescription>Open source component library.</ItemDescription>
              </ItemContent>
              <ItemActions>
                <ArrowRightIcon className="size-4 text-muted-foreground" />
              </ItemActions>
            </a>
          </Item>
        ),
      },
      {
        name: "Dropdown",
        description: "Item with a dropdown action menu.",
        Demo: () => (
          <Item variant="outline" className="w-full max-w-sm">
            <ItemMedia>
              <Avatar size="sm">
                <AvatarFallback>{persona.teammates[0].initials}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{persona.teammates[0].name}</ItemTitle>
              <ItemDescription>{persona.teammates[0].email}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="Actions">
                    <ChevronDownIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <MailIcon />
                    Send message
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <SettingsIcon />
                    Manage
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </ItemActions>
          </Item>
        ),
      },
    ],
  },
  {
    slug: "carousel",
    name: "Carousel",
    description: "A carousel with motion and swipe, built using Embla.",
    category: "Data Display",
    Demo: () => (
      <Carousel className="w-full max-w-xs">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    ),
    code: `import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function CarouselDemo() {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-6">
                <span className="text-4xl font-semibold">{index + 1}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}`,
    examples: [
      {
        name: "Sizes",
        description: "Slides at different fractional widths.",
        layout: "wide" as const,
        Demo: () => (
          <Carousel className="w-full max-w-lg">
            <CarouselContent>
              {Array.from({ length: 8 }).map((_, i) => (
                <CarouselItem key={i} className="basis-1/3">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-4">
                      <span className="text-2xl font-semibold">{i + 1}</span>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ),
      },
      {
        name: "Spacing",
        description: "Custom gap between slides.",
        layout: "wide" as const,
        Demo: () => (
          <Carousel className="w-full max-w-lg">
            <CarouselContent className="-ml-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <CarouselItem key={i} className="basis-1/3 pl-2">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-4">
                      <span className="text-2xl font-semibold">{i + 1}</span>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ),
      },
      {
        name: "Orientation",
        description: "Vertical carousel layout.",
        Demo: () => (
          <Carousel orientation="vertical" className="w-full max-w-xs">
            <CarouselContent className="h-52">
              {Array.from({ length: 5 }).map((_, i) => (
                <CarouselItem key={i}>
                  <Card>
                    <CardContent className="flex items-center justify-center p-6">
                      <span className="text-3xl font-semibold">{i + 1}</span>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ),
      },
      {
        name: "API",
        description: "Access the Embla API to read slide state.",
        layout: "wide" as const,
        Demo: CarouselApiDemo,
      },
      {
        name: "Plugins",
        description: "Auto-advancing carousel driven by Embla API intervals.",
        layout: "wide" as const,
        Demo: CarouselPluginsDemo,
      },
    ],
  },
  {
    slug: "chart",
    name: "Chart",
    description: "Beautiful charts built with Recharts and theme-aware config.",
    category: "Data Display",
    Demo: () => (
      <ChartContainer config={chartConfig} className="min-h-52 w-full max-w-md">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        </BarChart>
      </ChartContainer>
    ),
    code: `import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
} satisfies ChartConfig

export function ChartDemo() {
  return (
    <ChartContainer config={chartConfig} className="min-h-52 w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}`,
  },
  {
    slug: "aspect-ratio",
    name: "Aspect Ratio",
    description: "Displays content within a desired ratio.",
    category: "Data Display",
    Demo: () => (
      <div className="w-full max-w-sm">
        <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
          <img
            src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
            alt="Photo"
            className="h-full w-full rounded-lg object-cover"
          />
        </AspectRatio>
      </div>
    ),
    code: `import { AspectRatio } from "@/components/ui/aspect-ratio"

export function AspectRatioDemo() {
  return (
    <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
      <img src="/photo.jpg" alt="Photo" className="h-full w-full rounded-lg object-cover" />
    </AspectRatio>
  )
}`,
    examples: [
      {
        name: "Square",
        description: "1:1 aspect ratio.",
        Demo: () => (
          <div className="w-full max-w-48">
            <AspectRatio ratio={1} className="bg-muted rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=400&dpr=2&q=80"
                alt="Square photo"
                className="h-full w-full rounded-lg object-cover"
              />
            </AspectRatio>
          </div>
        ),
      },
      {
        name: "Portrait",
        description: "3:4 portrait ratio.",
        Demo: () => (
          <div className="w-full max-w-48">
            <AspectRatio ratio={3 / 4} className="bg-muted rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=400&dpr=2&q=80"
                alt="Portrait photo"
                className="h-full w-full rounded-lg object-cover"
              />
            </AspectRatio>
          </div>
        ),
      },
    ],
  },
  {
    slug: "kbd",
    name: "Kbd",
    description: "Displays keyboard keys and shortcuts.",
    category: "Data Display",
    Demo: () => (
      <div className="flex items-center gap-4">
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>Shift</Kbd>
          <Kbd>P</Kbd>
        </KbdGroup>
      </div>
    ),
    code: `import { Kbd, KbdGroup } from "@/components/ui/kbd"

export function KbdDemo() {
  return (
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
  )
}`,
    examples: [
      {
        name: "Button",
        description: "Keyboard shortcut displayed inside a button.",
        Demo: () => (
          <Button variant="outline" className="gap-2">
            Search
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </Button>
        ),
      },
      {
        name: "Tooltip",
        description: "Keyboard shortcut shown inside a tooltip.",
        Demo: () => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Bold">
                  <SearchIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Search
                <KbdGroup>
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </KbdGroup>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
      },
      {
        name: "Input Group",
        description: "Keyboard shortcut badge inside an input group addon.",
        Demo: () => (
          <InputGroup className="w-full max-w-xs">
            <InputGroupAddon align="inline-start">
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon align="inline-end">
              <Kbd>/</Kbd>
            </InputGroupAddon>
          </InputGroup>
        ),
      },
    ],
  },
  {
    slug: "empty",
    name: "Empty",
    description: "A placeholder for empty states with icon, title and actions.",
    category: "Data Display",
    Demo: () => (
      <Empty className="w-full max-w-sm rounded-lg border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderIcon />
          </EmptyMedia>
          <EmptyTitle>No projects yet</EmptyTitle>
          <EmptyDescription>
            Create your first project to get started.
          </EmptyDescription>
        </EmptyHeader>
        <Button size="sm">
          <StarIcon />
          Create project
        </Button>
      </Empty>
    ),
    code: `import { FolderIcon } from "lucide-react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function EmptyDemo() {
  return (
    <Empty className="rounded-lg border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderIcon />
        </EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>Create your first project to get started.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}`,
    examples: [
      {
        name: "Outline",
        description: "Dashed border empty state with an action.",
        Demo: () => (
          <Empty className="w-full max-w-sm border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <InboxIcon />
              </EmptyMedia>
              <EmptyTitle>Inbox zero</EmptyTitle>
              <EmptyDescription>You have no unread messages.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ),
      },
      {
        name: "Background",
        description: "Empty state with a muted background fill.",
        Demo: () => (
          <Empty className="w-full max-w-sm rounded-lg bg-muted/50">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageIcon />
              </EmptyMedia>
              <EmptyTitle>No images</EmptyTitle>
              <EmptyDescription>Upload an image to get started.</EmptyDescription>
            </EmptyHeader>
            <Button size="sm" variant="outline">
              Upload
            </Button>
          </Empty>
        ),
      },
      {
        name: "Avatar",
        description: "Empty state led by an avatar.",
        Demo: () => (
          <Empty className="w-full max-w-sm rounded-lg border">
            <EmptyHeader>
              <EmptyMedia>
                <Avatar size="lg">
                  <AvatarFallback>
                    <UserIcon />
                  </AvatarFallback>
                </Avatar>
              </EmptyMedia>
              <EmptyTitle>No profile</EmptyTitle>
              <EmptyDescription>Set up your profile to continue.</EmptyDescription>
            </EmptyHeader>
            <Button size="sm">Create profile</Button>
          </Empty>
        ),
      },
      {
        name: "Avatar Group",
        description: "Empty state with an avatar group.",
        Demo: () => (
          <Empty className="w-full max-w-sm rounded-lg border">
            <EmptyHeader>
              <EmptyMedia>
                <AvatarGroup>
                  <Avatar size="sm">
                    <AvatarFallback>
                      {persona.teammates[0].initials}
                    </AvatarFallback>
                  </Avatar>
                  <Avatar size="sm">
                    <AvatarFallback>
                      {persona.teammates[1].initials}
                    </AvatarFallback>
                  </Avatar>
                  <AvatarGroupCount>+5</AvatarGroupCount>
                </AvatarGroup>
              </EmptyMedia>
              <EmptyTitle>No team members</EmptyTitle>
              <EmptyDescription>Invite collaborators to this workspace.</EmptyDescription>
            </EmptyHeader>
            <Button size="sm" variant="outline">
              Invite
            </Button>
          </Empty>
        ),
      },
      {
        name: "Input Group",
        description: "Empty state with a search input group.",
        Demo: () => (
          <Empty className="w-full max-w-sm rounded-lg border">
            <EmptyHeader>
              <EmptyTitle>Find something</EmptyTitle>
              <EmptyDescription>Search across all your resources.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <InputGroup className="w-full max-w-xs">
                <InputGroupAddon align="inline-start">
                  <SearchIcon />
                </InputGroupAddon>
                <InputGroupInput placeholder="Search..." />
              </InputGroup>
            </EmptyContent>
          </Empty>
        ),
      },
    ],
  },
]
