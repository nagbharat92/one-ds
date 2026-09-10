import { useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ArrowUpRightIcon,
  BadgeCheckIcon,
  ArrowRightIcon,
  BookmarkIcon,
  ChevronDownIcon,
  FolderIcon,
  ImageIcon,
  InboxIcon,
  LinkIcon,
  LogOutIcon,
  MailIcon,
  MoreHorizontalIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
  UserIcon,
  UsersIcon,
} from "@/components/ui/icons"

import type { ComponentEntry } from "@/showcase/types"
import { persona } from "@/lib/persona"
import { CodeBlock } from "@/components/code-block"
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
  CardAction,
  CardContent,
  CardDescription,
  CardEyebrow,
  CardFooter,
  CardHeader,
  CardHeaderAside,
  CardHeaderContent,
  CardMedia,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Scroller } from "@/components/ui/scroller"
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
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselProgress,
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
  { date: "Apr 1", desktop: 222, mobile: 150 },
  { date: "Apr 2", desktop: 97, mobile: 180 },
  { date: "Apr 3", desktop: 167, mobile: 120 },
  { date: "Apr 4", desktop: 242, mobile: 260 },
  { date: "Apr 5", desktop: 373, mobile: 290 },
  { date: "Apr 6", desktop: 301, mobile: 340 },
  { date: "Apr 7", desktop: 245, mobile: 180 },
  { date: "Apr 8", desktop: 409, mobile: 320 },
  { date: "Apr 9", desktop: 59, mobile: 110 },
  { date: "Apr 10", desktop: 261, mobile: 190 },
  { date: "Apr 11", desktop: 327, mobile: 350 },
  { date: "Apr 12", desktop: 292, mobile: 210 },
  { date: "Apr 13", desktop: 342, mobile: 380 },
  { date: "Apr 14", desktop: 137, mobile: 220 },
  { date: "Apr 15", desktop: 120, mobile: 170 },
  { date: "Apr 16", desktop: 138, mobile: 190 },
  { date: "Apr 17", desktop: 446, mobile: 360 },
  { date: "Apr 18", desktop: 364, mobile: 410 },
  { date: "Apr 19", desktop: 243, mobile: 180 },
  { date: "Apr 20", desktop: 89, mobile: 150 },
  { date: "Apr 21", desktop: 137, mobile: 200 },
  { date: "Apr 22", desktop: 224, mobile: 270 },
  { date: "Apr 23", desktop: 138, mobile: 170 },
  { date: "Apr 24", desktop: 387, mobile: 390 },
  { date: "Apr 25", desktop: 215, mobile: 240 },
  { date: "Apr 26", desktop: 75, mobile: 130 },
  { date: "Apr 27", desktop: 383, mobile: 420 },
  { date: "Apr 28", desktop: 122, mobile: 160 },
  { date: "Apr 29", desktop: 315, mobile: 350 },
  { date: "Apr 30", desktop: 454, mobile: 390 },
]

type ChartSeries = "desktop" | "mobile"

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-2)" },
  mobile: { label: "Mobile", color: "var(--chart-4)" },
} satisfies ChartConfig

const chartTotals = chartData.reduce(
  (totals, item) => ({
    desktop: totals.desktop + item.desktop,
    mobile: totals.mobile + item.mobile,
  }),
  { desktop: 0, mobile: 0 },
)

function ChartInteractiveDemo() {
  const [activeSeries, setActiveSeries] = useState<ChartSeries>("desktop")

  return (
    <Card className="@container/chart-card w-full max-w-3xl gap-0 py-0">
      <div className="grid border-b @xl/chart-card:flex">
        <CardHeader className="justify-center py-6 @xl/chart-card:flex-1">
          <CardTitle>Visitors by device</CardTitle>
          <CardDescription>
            Daily visitors during the last 30 days
          </CardDescription>
        </CardHeader>
        <div className="grid grid-cols-2 border-t @xl/chart-card:border-t-0 @xl/chart-card:border-s">
          {(Object.keys(chartConfig) as ChartSeries[]).map((series) => (
            <button
              key={series}
              type="button"
              aria-pressed={activeSeries === series}
              className="min-w-36 border-e px-6 py-5 text-start transition-colors outline-none last:border-e-0 hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:bg-muted/50"
              onClick={() => setActiveSeries(series)}
            >
              <span className="block text-sm text-muted-foreground">
                {chartConfig[series].label}
              </span>
              <span className="block text-3xl font-semibold tracking-tight tabular-nums">
                {chartTotals[series].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </div>
      <CardContent className="px-2 pt-6 pb-4 sm:px-6 sm:pt-8">
        <ChartContainer config={chartConfig} className="min-h-64 w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideIndicator />}
            />
            <Bar
              dataKey={activeSeries}
              fill={"var(--color-" + activeSeries + ")"}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function CardLoginDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={(event) => event.preventDefault()}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="card-email">Email</Label>
              <Input
                id="card-email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="card-password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  onClick={(event) => event.preventDefault()}
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="card-password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col">
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button variant="secondary" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  )
}

function CardRichContentDemo() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardHeaderContent>
          <CardEyebrow>
            <Badge variant="secondary">Adoption</Badge>
            <Badge variant="outline">In review</Badge>
          </CardEyebrow>
          <CardTitle>Design system rollout</CardTitle>
          <CardDescription>
            Track how teams are adopting shared components, which guidance
            remains under review, and what needs attention before the next
            release.
          </CardDescription>
        </CardHeaderContent>
        <CardHeaderAside>
          <strong className="font-heading text-3xl leading-none font-semibold tabular-nums">
            68%
          </strong>
          <span className="text-sm text-muted-foreground">Adopted</span>
        </CardHeaderAside>
      </CardHeader>
      <CardContent className="grid gap-(--card-content-group-gap)">
        <div className="grid gap-(--card-header-gap)">
          <div className="flex items-center justify-between gap-(--card-header-gap) text-sm">
            <span className="font-medium">17 of 25 components</span>
            <span className="text-muted-foreground">Q3 target</span>
          </div>
          <Progress value={68} aria-label="Component adoption" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-(--card-header-gap)">
          <div className="flex items-center gap-(--card-header-gap)">
            <AvatarGroup>
              <Avatar size="sm" aria-label={persona.name}>
                <AvatarImage src={persona.avatar} alt="" />
                <AvatarFallback>{persona.initials}</AvatarFallback>
              </Avatar>
              <Avatar size="sm" aria-label={persona.teammates[0].name}>
                <AvatarFallback>
                  {persona.teammates[0].initials}
                </AvatarFallback>
              </Avatar>
              <Avatar size="sm" aria-label={persona.teammates[1].name}>
                <AvatarFallback>
                  {persona.teammates[1].initials}
                </AvatarFallback>
              </Avatar>
              <AvatarGroupCount>+3</AvatarGroupCount>
            </AvatarGroup>
            <span className="text-sm text-muted-foreground">
              Sophia and 5 teammates
            </span>
          </div>
          <Badge variant="outline">Updated today</Badge>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="secondary">View report</Button>
        <Button>
          Continue review
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  )
}

function CardFooterActionsDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Publish changes?</CardTitle>
        <CardDescription>
          Review your updates before making them visible to the team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Three component recipes and their usage guidance will be updated.
        </p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="ghost">Cancel</Button>
        <Button>Publish</Button>
      </CardFooter>
    </Card>
  )
}

function CardEdgeToEdgeDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Terms of Service</CardTitle>
        <CardDescription>
          Review the terms before accepting the agreement.
        </CardDescription>
      </CardHeader>
      <CardContent className="-mb-(--card-spacing)">
        <div className="-mx-(--card-spacing) border-t bg-muted/50">
          <Scroller className="max-h-48 space-y-4 px-(--card-spacing) py-4 text-sm leading-relaxed">
            <p>
              These terms govern your use of the workspace, including access to
              shared documents, project files, and collaboration tools.
            </p>
            <p>
              You are responsible for the content you upload and for ensuring
              that your team has the appropriate permissions to view or edit it.
            </p>
            <p>
              We may update features or limits as the service evolves. When
              those changes materially affect your workflow, we will notify your
              workspace administrators.
            </p>
            <p>
              By continuing, you agree to keep your account credentials secure
              and to follow your organization&apos;s acceptable use policies.
            </p>
          </Scroller>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="secondary">Decline</Button>
        <Button>Accept</Button>
      </CardFooter>
    </Card>
  )
}

function CardImageDemo() {
  return (
    <Card className="relative w-full max-w-sm">
      <CardMedia>
        <div className="card-media-overlay absolute inset-0 z-30" />
        <img
          src="https://avatar.vercel.sh/shadcn1"
          alt="Event cover"
          className="relative z-20 grayscale"
        />
      </CardMedia>
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Featured</Badge>
        </CardAction>
        <CardTitle>Design systems meetup</CardTitle>
        <CardDescription>
          A practical talk on component APIs, accessibility, and shipping
          faster.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">View Event</Button>
      </CardFooter>
    </Card>
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
        description: "Badges with an icon at either inline edge.",
        Demo: () => (
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary">
              <BadgeCheckIcon data-icon="inline-start" />
              Verified
            </Badge>
            <Badge variant="outline">
              Bookmark
              <BookmarkIcon data-icon="inline-end" />
            </Badge>
          </div>
        ),
      },
      {
        name: "With Spinner",
        description: "Badges with a spinner at either inline edge.",
        Demo: () => (
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="destructive">
              <Spinner data-icon="inline-start" />
              Deleting
            </Badge>
            <Badge variant="secondary">
              Generating
              <Spinner data-icon="inline-end" />
            </Badge>
          </div>
        ),
      },
      {
        name: "Link",
        description: "Badge rendered as a clickable link.",
        Demo: () => (
          <Badge asChild>
            <a
              href="https://github.com/shadcn-ui/ui"
              onClick={(e) => e.preventDefault()}
            >
              Open link
              <ArrowUpRightIcon data-icon="inline-end" />
            </a>
          </Badge>
        ),
      },
      {
        name: "Custom Colors",
        description: "Badges with semantic color overrides.",
        Demo: () => (
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-badge-blue text-badge-blue-foreground">Blue</Badge>
            <Badge className="bg-badge-green text-badge-green-foreground">Green</Badge>
            <Badge className="bg-badge-sky text-badge-sky-foreground">Sky</Badge>
            <Badge className="bg-badge-purple text-badge-purple-foreground">Purple</Badge>
            <Badge className="bg-badge-red text-badge-red-foreground">Red</Badge>
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
    Demo: CardLoginDemo,
    code: `import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col">
        <Button type="submit" className="w-full">Login</Button>
        <Button variant="secondary" className="w-full">Login with Google</Button>
      </CardFooter>
    </Card>
  )
}`,
    examples: [
      {
        name: "Rich Content",
        description:
          "Compose tags, multi-line supporting copy, an intrinsic aside, progress, people, and actions without a new card variant.",
        Demo: CardRichContentDemo,
      },
      {
        name: "Footer Actions",
        description:
          "Place related actions side by side in a compact, end-aligned footer.",
        Demo: CardFooterActionsDemo,
      },
      {
        name: "Edge to Edge",
        description:
          "Use negative card-spacing margins for full-width content that stays aligned with the card inset.",
        Demo: CardEdgeToEdgeDemo,
      },
      {
        name: "Code",
        description:
          "A themed card for readable code with line numbers and a copy action.",
        Demo: () => (
          <CodeBlock
            className="h-64 w-full max-w-md"
            code={`import { Card, CardContent } from "@/components/ui/card"

export function Example() {
  return (
    <Card>
      <CardContent>Theme-aware code card</CardContent>
    </Card>
  )
}`}
          />
        ),
      },
      {
        name: "Image",
        description: "Add an image before the card header.",
        Demo: CardImageDemo,
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
                        size="default"
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
    slug: "list-item",
    name: "List Item",
    description:
      "A composable row for text, media, metadata, selection and trailing actions.",
    category: "Data Display",
    installCommand: "npx shadcn@latest add item",
    Demo: () => (
      <Item className="w-full max-w-sm rounded-lg border">
        <ItemMedia>
          <Avatar size="lg">
            <AvatarImage src={persona.avatar} alt="" />
            <AvatarFallback>{persona.initials}</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{persona.name}</ItemTitle>
          <ItemDescription>Last seen 5 months ago</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="secondary" size="default">
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
        <Avatar size="lg">
          <AvatarFallback>{persona.initials}</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{persona.name}</ItemTitle>
        <ItemDescription>Last seen 5 months ago</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="secondary" size="default">Follow</Button>
      </ItemActions>
    </Item>
  )
}`,
    examples: [
      {
        name: "Text Only",
        description: "Quiet rows with aligned titles and metadata.",
        layout: "wide" as const,
        Demo: () => (
          <ItemGroup className="w-full max-w-md gap-0">
            {[
              ["OneDS navigation review", "Today"],
              ["Design platform weekly update", "Yesterday"],
              ["Accessibility audit", "Friday"],
            ].map(([title, time], index) => (
              <div key={title}>
                <Item>
                  <ItemContent>
                    <ItemTitle>{title}</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <span className="text-xs text-muted-foreground">{time}</span>
                  </ItemActions>
                </Item>
                {index < 2 ? <ItemSeparator className="my-0" /> : null}
              </div>
            ))}
          </ItemGroup>
        ),
      },
      {
        name: "Leading Icon",
        description: "Icons identify content type without changing row alignment.",
        layout: "wide" as const,
        Demo: () => {
          const rows = [
            { Icon: FolderIcon, title: "Design files", description: "24 items" },
            { Icon: InboxIcon, title: "Team inbox", description: "6 unread" },
            { Icon: BookmarkIcon, title: "Saved research", description: "12 notes" },
          ]
          return (
            <ItemGroup className="w-full max-w-md gap-2">
              {rows.map(({ Icon, title, description }) => (
                <Item key={title} variant="outline">
                  <ItemMedia variant="icon"><Icon /></ItemMedia>
                  <ItemContent>
                    <ItemTitle>{title}</ItemTitle>
                    <ItemDescription>{description}</ItemDescription>
                  </ItemContent>
                </Item>
              ))}
            </ItemGroup>
          )
        },
      },
      {
        name: "Metadata",
        description: "Badges and trailing values remain subordinate to the title.",
        Demo: () => (
          <Item variant="outline" className="w-full max-w-sm">
            <ItemContent>
              <ItemTitle>
                Component release
                <Badge variant="secondary">Ready</Badge>
              </ItemTitle>
              <ItemDescription>Validated across supported themes.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <span className="text-xs text-muted-foreground">v2.4.0</span>
            </ItemActions>
          </Item>
        ),
      },
      {
        name: "States",
        description: "Rest, selected and disabled rows for selectable collections.",
        layout: "wide" as const,
        Demo: function ListItemStatesDemo() {
          const [selected, setSelected] = useState("Design")
          return (
            <ItemGroup className="w-full max-w-md gap-2">
              {["Design", "Engineering", "Marketing"].map((team) => (
                <Item key={team} asChild variant={selected === team ? "muted" : "default"}>
                  <button type="button" aria-pressed={selected === team} onClick={() => setSelected(team)}>
                    <ItemContent>
                      <ItemTitle>{team}</ItemTitle>
                      <ItemDescription>Team workspace</ItemDescription>
                    </ItemContent>
                    {selected === team ? <Badge>Selected</Badge> : null}
                  </button>
                </Item>
              ))}
              <Item aria-disabled="true">
                <ItemContent>
                  <ItemTitle>Archived workspace</ItemTitle>
                  <ItemDescription>Unavailable to this account.</ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          )
        },
      },
      {
        name: "Hosted Action",
        description: "Trailing square actions work with descriptive and title-only rows.",
        Demo: () => (
          <ItemGroup className="w-full max-w-sm gap-2">
            <Item variant="muted">
              <ItemContent>
                <ItemTitle>OneDS navigation review</ItemTitle>
                <ItemDescription>Updated today</ItemDescription>
              </ItemContent>
              <ItemActions hosted>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Navigation review actions">
                      <MoreHorizontalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Rename</DropdownMenuItem>
                    <DropdownMenuItem>Archive</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </ItemActions>
            </Item>
            <Item variant="muted">
              <ItemContent>
                <ItemTitle>Design platform weekly update</ItemTitle>
              </ItemContent>
              <ItemActions hosted>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Weekly update actions">
                      <MoreHorizontalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Rename</DropdownMenuItem>
                    <DropdownMenuItem>Archive</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </ItemActions>
            </Item>
          </ItemGroup>
        ),
      },
      {
        name: "Truncation",
        description: "Long titles stay on one line and yield space to trailing content.",
        Demo: () => (
          <Item variant="muted" size="xs" className="w-full max-w-sm flex-nowrap">
            <ItemContent>
              <ItemTitle>
                OneDS navigation review decisions and implementation follow-up
              </ItemTitle>
            </ItemContent>
            <ItemActions hosted>
              <Button variant="ghost" size="icon" aria-label="Item actions">
                <MoreHorizontalIcon />
              </Button>
            </ItemActions>
          </Item>
        ),
      },
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
                  <Button variant="ghost" size="icon" aria-label={`Open ${team}`}>
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
        name: "Header and Footer",
        description: "Full-width regions add context above and supporting actions below.",
        Demo: () => (
          <Item variant="outline" className="w-full max-w-sm">
            <ItemHeader>
              <Badge variant="outline">Draft</Badge>
              <span className="text-xs text-muted-foreground">Today</span>
            </ItemHeader>
            <ItemContent>
              <ItemTitle>Navigation proposal</ItemTitle>
              <ItemDescription>
                Review the updated sidebar hierarchy and interaction model.
              </ItemDescription>
            </ItemContent>
            <ItemFooter>
              <span className="text-xs text-muted-foreground">3 comments</span>
              <Button variant="secondary" size="default">Review</Button>
            </ItemFooter>
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
              <Avatar size="lg">
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
                  <Button variant="ghost" size="icon" aria-label="Actions">
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
    description: "A horizontal carousel with swipe, controls, and edge fades.",
    category: "Data Display",
    Demo: () => (
      <Carousel className="w-full max-w-xs">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <Card>
                <AspectRatio ratio="square" asChild>
                  <CardContent className="flex items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </AspectRatio>
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
  CarouselProgress,
} from "@/components/ui/carousel"

export function CarouselDemo() {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <Card>
              <AspectRatio ratio="square" asChild>
                <CardContent className="flex items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </AspectRatio>
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
        name: "Multiple cards",
        description: "Three cards stay in view while the adjacent cards fade at each edge.",
        layout: "wide" as const,
        Demo: () => (
          <Carousel itemsPerView={3} className="w-full max-w-lg">
            <CarouselContent>
              {Array.from({ length: 9 }).map((_, index) => (
                <CarouselItem key={index}>
                  <Card>
                    <AspectRatio ratio="square" asChild>
                      <CardContent className="flex items-center justify-center p-4">
                        <span className="text-2xl font-semibold">{index + 1}</span>
                      </CardContent>
                    </AspectRatio>
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
        name: "Self scrolling",
        description: "Advances automatically, pauses on hover, and resumes from the same point.",
        Demo: () => (
          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index}>
                  <Card>
                    <AspectRatio ratio="square" asChild>
                      <CardContent className="flex items-center justify-center p-6">
                        <span className="text-4xl font-semibold">{index + 1}</span>
                      </CardContent>
                    </AspectRatio>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            <CarouselProgress />
          </Carousel>
        ),
      },
    ],
  },
  {
    slug: "chart",
    name: "Chart",
    description: "Interactive, theme-aware data visualizations presented in a complete analytics card.",
    category: "Data Display",
    Demo: ChartInteractiveDemo,
    code: `import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { useState } from "react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-2)" },
  mobile: { label: "Mobile", color: "var(--chart-4)" },
} satisfies ChartConfig

export function ChartDemo() {
  const [activeSeries, setActiveSeries] = useState<"desktop" | "mobile">("desktop")

  return (
    <Card className="@container/chart-card w-full max-w-3xl gap-0 py-0">
      <div className="grid border-b @xl/chart-card:flex">
        <CardHeader className="justify-center py-6 @xl/chart-card:flex-1">
          <CardTitle>Visitors by device</CardTitle>
          <CardDescription>Daily visitors during the last 30 days</CardDescription>
        </CardHeader>
        <div className="grid grid-cols-2 border-t @xl/chart-card:border-t-0 @xl/chart-card:border-s">
          {(["desktop", "mobile"] as const).map((series) => (
            <button
              key={series}
              type="button"
              aria-pressed={activeSeries === series}
              onClick={() => setActiveSeries(series)}
            >
              <span>{chartConfig[series].label}</span>
              <strong>{chartTotals[series].toLocaleString()}</strong>
            </button>
          ))}
        </div>
      </div>
      <CardContent className="px-2 pt-6 pb-4 sm:px-6 sm:pt-8">
        <ChartContainer config={chartConfig} className="min-h-64 w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
            <Bar dataKey={activeSeries} fill={"var(--color-" + activeSeries + ")"} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
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
        <AspectRatio ratio="landscape" className="bg-muted rounded-lg">
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
    <AspectRatio ratio="landscape" className="bg-muted rounded-lg">
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
            <AspectRatio ratio="square" className="bg-muted rounded-lg">
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
            <AspectRatio ratio="portrait" className="bg-muted rounded-lg">
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
          <Button variant="secondary" className="gap-2">
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
                <Button variant="ghost" size="icon" aria-label="Bold">
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
        <Button size="default">
          <StarIcon />
          Create project
        </Button>
      </Empty>
    ),
    code: `import { FolderIcon } from "@/components/ui/icons"
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
            <Button size="default" variant="secondary">
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
            <Button size="default">Create profile</Button>
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
            <Button size="default" variant="secondary">
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
