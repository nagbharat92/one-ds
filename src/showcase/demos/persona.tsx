import { Fragment, useEffect, useState, type ReactNode } from "react"
import {
  BadgeCheckIcon,
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  CopyIcon,
  ExternalLinkIcon,
  GlobeIcon,
  IdCardIcon,
  LogOutIcon,
  MailIcon,
  MapPinIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  PhoneIcon,
  SettingsIcon,
  SmartphoneIcon,
  UserPlusIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react"

import type { ComponentEntry } from "@/showcase/types"
import {
  persona,
  personaAddress,
  personaAddressLines,
  presenceLabels,
  type Person,
  type PresenceStatus,
} from "@/lib/persona"
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Cluster } from "@/components/ui/cluster"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// SHARED PARTS
// ---------------------------------------------------------------------------

const presenceDot: Record<PresenceStatus, string> = {
  available: "bg-presence-available",
  busy: "bg-presence-busy",
  away: "bg-presence-away",
  offline: "bg-presence-offline",
}

function PersonaAvatar({
  person = persona,
  size = "default",
  className,
}: {
  person?: Person
  size?: "sm" | "default" | "lg"
  className?: string
}) {
  return (
    <Avatar size={size} className={className}>
      {person.avatar ? <AvatarImage src={person.avatar} alt="" /> : null}
      <AvatarFallback>{person.initials}</AvatarFallback>
      <AvatarBadge
        role="img"
        aria-label={presenceLabels[person.presence]}
        className={presenceDot[person.presence]}
      />
    </Avatar>
  )
}

function PresenceChip({ status }: { status: PresenceStatus }) {
  return (
    <Badge variant="outline" className="gap-1.5">
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", presenceDot[status])}
      />
      {presenceLabels[status]}
    </Badge>
  )
}

function PersonaMetaLine({
  icon,
  children,
}: {
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <span className="flex items-start gap-1.5 [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground">
      {icon}
      {children}
    </span>
  )
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1500)
    return () => window.clearTimeout(timer)
  }, [copied])

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={copied ? "Copied" : label}
      onClick={() => {
        navigator.clipboard?.writeText(value).catch(() => {})
        setCopied(true)
      }}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  )
}

function PersonaMoreMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="More actions">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <CopyIcon />
          Copy email
        </DropdownMenuItem>
        <DropdownMenuItem>
          <UserPlusIcon />
          Add to a team
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ExternalLinkIcon />
          Open in directory
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ---------------------------------------------------------------------------
// PROFILE PAGE
// ---------------------------------------------------------------------------

function PersonaProfilePage() {
  return (
    <div className="w-full max-w-2xl">
      <Card className="gap-0 py-0">
        <div className="h-24 bg-muted" aria-hidden="true" />

        <div className="flex flex-col gap-5 px-(--card-spacing) pb-(--card-spacing)">
          {/* Half the avatar's height, so its centre lands on the banner edge. */}
          <Avatar size="lg" className="-mt-10 size-20! ring-4 ring-card">
            <AvatarImage src={persona.avatar} alt="" />
            <AvatarFallback className="text-lg">
              {persona.initials}
            </AvatarFallback>
            <AvatarBadge
              role="img"
              aria-label={presenceLabels[persona.presence]}
              className={cn("size-4!", presenceDot[persona.presence])}
            />
          </Avatar>

          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <Cluster gap="sm">
                <h3 className="font-heading text-xl font-semibold tracking-tight">
                  {persona.name}
                </h3>
                <span className="text-sm text-muted-foreground">
                  {persona.pronouns}
                </span>
                <PresenceChip status={persona.presence} />
              </Cluster>
              <Cluster gap="sm">
                <Button>
                  <MessageSquareIcon data-icon="inline-start" />
                  Message
                </Button>
                <Button variant="outline">
                  <VideoIcon data-icon="inline-start" />
                  Meet
                </Button>
                <PersonaMoreMenu />
              </Cluster>
            </div>
            <p className="text-sm text-muted-foreground">
              {persona.title} · {persona.department} at {persona.company}
            </p>
            <Cluster gap="md" className="text-sm">
              <PersonaMetaLine icon={<MapPinIcon />}>
                {persona.location}
              </PersonaMetaLine>
              <PersonaMetaLine icon={<ClockIcon />}>
                {persona.workingHours} · {persona.timeZone}
              </PersonaMetaLine>
              <PersonaMetaLine icon={<CalendarIcon />}>
                Joined {persona.startedLabel}
              </PersonaMetaLine>
            </Cluster>
          </div>

          <Tabs defaultValue="overview">
            <TabsList aria-label="Profile sections">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="flex flex-col gap-5">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {persona.bio}
              </p>

              <div className="grid grid-cols-3 divide-x divide-border rounded-lg border">
                {persona.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-0.5 p-3">
                    <span className="font-heading text-lg font-semibold tabular-nums">
                      {stat.value}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-medium">Focus areas</h4>
                <Cluster gap="xs">
                  {persona.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </Cluster>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-medium">Current work</h4>
                <ItemGroup className="gap-2">
                  {persona.projects.map((project) => (
                    <Item key={project.id} variant="outline">
                      <ItemContent>
                        <ItemTitle>{project.name}</ItemTitle>
                        <ItemDescription>
                          {project.role} · {project.status}
                        </ItemDescription>
                        <Progress
                          value={project.progress}
                          aria-label={`${project.name} progress`}
                          className="mt-1"
                        />
                      </ItemContent>
                      <ItemActions className="text-sm tabular-nums text-muted-foreground">
                        {project.progress}%
                      </ItemActions>
                    </Item>
                  ))}
                </ItemGroup>
              </div>
            </TabsContent>

            <TabsContent value="contact">
              <ItemGroup>
                <Item>
                  <ItemMedia variant="icon">
                    <MailIcon />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Email</ItemTitle>
                    <ItemDescription>{persona.email}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <CopyButton value={persona.email} label="Copy email" />
                  </ItemActions>
                </Item>
                <ItemSeparator />
                <Item>
                  <ItemMedia variant="icon">
                    <PhoneIcon />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Work</ItemTitle>
                    <ItemDescription>{persona.phone}</ItemDescription>
                  </ItemContent>
                </Item>
                <ItemSeparator />
                <Item>
                  <ItemMedia variant="icon">
                    <SmartphoneIcon />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Mobile</ItemTitle>
                    <ItemDescription>{persona.mobile}</ItemDescription>
                  </ItemContent>
                </Item>
                <ItemSeparator />
                <Item>
                  <ItemMedia variant="icon">
                    <MapPinIcon />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Office</ItemTitle>
                    <ItemDescription>
                      {personaAddressLines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <CopyButton value={personaAddress} label="Copy address" />
                  </ItemActions>
                </Item>
                <ItemSeparator />
                <Item>
                  <ItemMedia variant="icon">
                    <IdCardIcon />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Employee ID</ItemTitle>
                    <ItemDescription>{persona.employeeId}</ItemDescription>
                  </ItemContent>
                </Item>
                <ItemSeparator />
                <Item>
                  <ItemMedia variant="icon">
                    <GlobeIcon />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Links</ItemTitle>
                    <ItemDescription>
                      <span className="flex flex-wrap gap-2">
                        {persona.links.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            className="underline underline-offset-4 hover:text-foreground"
                          >
                            {link.value}
                          </a>
                        ))}
                      </span>
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </ItemGroup>
            </TabsContent>

            <TabsContent value="team" className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-medium">Reports to</h4>
                <Item variant="outline">
                  <ItemMedia>
                    <PersonaAvatar person={persona.manager} />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{persona.manager.name}</ItemTitle>
                    <ItemDescription>{persona.manager.title}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </ItemActions>
                </Item>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-medium">
                    {persona.department} team
                  </h4>
                  <AvatarGroup>
                    <PersonaAvatar size="sm" />
                    {persona.teammates.slice(0, 2).map((teammate) => (
                      <PersonaAvatar
                        key={teammate.id}
                        person={teammate}
                        size="sm"
                      />
                    ))}
                    <AvatarGroupCount>
                      +{persona.teammates.length - 2}
                    </AvatarGroupCount>
                  </AvatarGroup>
                </div>
                <ItemGroup>
                  {persona.teammates.map((teammate, index) => (
                    <Fragment key={teammate.id}>
                      {index > 0 ? <ItemSeparator /> : null}
                      <Item>
                        <ItemMedia>
                          <PersonaAvatar person={teammate} />
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>{teammate.name}</ItemTitle>
                          <ItemDescription>{teammate.title}</ItemDescription>
                        </ItemContent>
                        <ItemActions className="text-sm text-muted-foreground">
                          {presenceLabels[teammate.presence]}
                        </ItemActions>
                      </Item>
                    </Fragment>
                  ))}
                </ItemGroup>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  )
}

// ---------------------------------------------------------------------------
// EXAMPLES
// ---------------------------------------------------------------------------

function PersonaHeaderDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex items-center gap-4">
        <Avatar size="lg" className="size-16!">
          <AvatarImage src={persona.avatar} alt="" />
          <AvatarFallback className="text-base">
            {persona.initials}
          </AvatarFallback>
          <AvatarBadge
            role="img"
            aria-label={presenceLabels[persona.presence]}
            className={cn("size-3.5!", presenceDot[persona.presence])}
          />
        </Avatar>
        <div className="flex flex-col gap-1">
          <h3 className="font-heading text-lg font-semibold tracking-tight">
            {persona.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {persona.title} · {persona.company}
          </p>
          <p className="text-sm text-muted-foreground">
            {persona.statusMessage}
          </p>
        </div>
      </div>
      <Cluster gap="sm">
        <Button size="sm">
          <MessageSquareIcon data-icon="inline-start" />
          Message
        </Button>
        <Button variant="outline" size="sm">
          <MailIcon data-icon="inline-start" />
          Email
        </Button>
        <Button variant="outline" size="sm">
          <CalendarIcon data-icon="inline-start" />
          Schedule
        </Button>
      </Cluster>
    </div>
  )
}

function PersonaContactCardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <PersonaAvatar size="lg" className="mb-1" />
        <CardTitle>{persona.name}</CardTitle>
        <CardDescription>
          {persona.title} · {persona.company}
        </CardDescription>
        <CardAction>
          <PresenceChip status={persona.presence} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm">
        <div className="flex items-start justify-between gap-2">
          <PersonaMetaLine icon={<MailIcon />}>{persona.email}</PersonaMetaLine>
          <CopyButton value={persona.email} label="Copy email" />
        </div>
        <PersonaMetaLine icon={<PhoneIcon />}>{persona.phone}</PersonaMetaLine>
        <div className="flex items-start justify-between gap-2">
          <PersonaMetaLine icon={<MapPinIcon />}>
            <span className="flex flex-col">
              {personaAddressLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
          </PersonaMetaLine>
          <CopyButton value={personaAddress} label="Copy address" />
        </div>
        <PersonaMetaLine icon={<ClockIcon />}>
          {persona.workingHours}
        </PersonaMetaLine>
      </CardContent>
      <CardFooter className="gap-2">
        <Button className="flex-1">
          <MessageSquareIcon data-icon="inline-start" />
          Message
        </Button>
        <Button variant="outline" className="flex-1">
          <VideoIcon data-icon="inline-start" />
          Meet
        </Button>
      </CardFooter>
    </Card>
  )
}

function PersonaSizesDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Item size="xs">
        <ItemMedia>
          <PersonaAvatar size="sm" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{persona.name}</ItemTitle>
        </ItemContent>
      </Item>
      <Item size="sm">
        <ItemMedia>
          <PersonaAvatar />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{persona.name}</ItemTitle>
          <ItemDescription>{persona.title}</ItemDescription>
        </ItemContent>
      </Item>
      <Item>
        <ItemMedia>
          <PersonaAvatar size="lg" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{persona.name}</ItemTitle>
          <ItemDescription>
            {persona.title} · {persona.department}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Follow
          </Button>
        </ItemActions>
      </Item>
    </div>
  )
}

function PersonaPresenceDemo() {
  const statuses: PresenceStatus[] = ["available", "busy", "away", "offline"]

  return (
    <Cluster gap="lg" justify="center">
      {statuses.map((status) => (
        <div key={status} className="flex flex-col items-center gap-2">
          <PersonaAvatar
            size="lg"
            person={{ ...persona, presence: status }}
          />
          <span className="text-xs text-muted-foreground">
            {presenceLabels[status]}
          </span>
        </div>
      ))}
    </Cluster>
  )
}

function PersonaHoverCardDemo() {
  return (
    <p className="max-w-md text-sm leading-relaxed">
      The token pipeline was rewritten by{" "}
      <HoverCard>
        <HoverCardTrigger asChild>
          <a
            href="#/persona"
            className="font-medium underline underline-offset-4"
          >
            {persona.name}
          </a>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex gap-3">
            <PersonaAvatar size="lg" />
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-semibold">{persona.name}</h4>
              <p className="text-sm text-muted-foreground">
                {persona.title} · {persona.company}
              </p>
              <p className="text-sm">{persona.statusMessage}</p>
              <PersonaMetaLine icon={<CalendarIcon />}>
                <span className="text-xs text-muted-foreground">
                  Joined {persona.startedLabel}
                </span>
              </PersonaMetaLine>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>{" "}
      and shipped to every Contoso product last quarter.
    </p>
  )
}

function PersonaAccountMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto justify-start gap-2 p-2">
          <PersonaAvatar size="sm" />
          <span className="flex flex-col items-start">
            <span className="text-sm font-medium">{persona.name}</span>
            <span className="text-xs text-muted-foreground">
              {persona.email}
            </span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-2 py-2">
          <PersonaAvatar />
          <span className="flex flex-col">
            <span className="text-sm font-medium">{persona.name}</span>
            <span className="text-xs font-normal text-muted-foreground">
              {persona.title}
            </span>
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <BadgeCheckIcon />
          View profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <BriefcaseIcon />
          {persona.department}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SettingsIcon />
          Preferences
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function PersonaTeamDemo() {
  const team = [persona, ...persona.teammates]

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{persona.department}</CardTitle>
        <CardDescription>{team.length} people</CardDescription>
        <CardAction>
          <AvatarGroup>
            {team.slice(0, 3).map((member) => (
              <PersonaAvatar key={member.id} person={member} size="sm" />
            ))}
            <AvatarGroupCount>+{team.length - 3}</AvatarGroupCount>
          </AvatarGroup>
        </CardAction>
      </CardHeader>
      <Separator />
      <CardContent>
        <ItemGroup>
          {team.map((member) => (
            <Item key={member.id} size="sm">
              <ItemMedia>
                <PersonaAvatar person={member} />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{member.name}</ItemTitle>
                <ItemDescription>{member.title}</ItemDescription>
              </ItemContent>
              <ItemActions className="text-xs text-muted-foreground">
                {presenceLabels[member.presence]}
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <UsersIcon data-icon="inline-start" />
          Open team directory
        </Button>
      </CardFooter>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// EXPORT
// ---------------------------------------------------------------------------

export const personaDemos: ComponentEntry[] = [
  {
    slug: "persona",
    name: "Persona",
    description:
      "Sophia Costa is the showcase's house persona. One data module holds her name, contact details, team and presence, and every avatar, profile and mention on the site reads from it.",
    category: "Data Display",
    installCommand: null,
    Demo: PersonaProfilePage,
    code: `import { persona, presenceLabels } from "@/lib/persona"

<Avatar size="lg" className="size-20">
  <AvatarImage src={persona.avatar} alt="" />
  <AvatarFallback>{persona.initials}</AvatarFallback>
  <AvatarBadge
    role="img"
    aria-label={presenceLabels[persona.presence]}
    className="size-4! bg-presence-available"
  />
</Avatar>
<h3 className="font-heading text-xl font-semibold">{persona.name}</h3>
<p className="text-sm text-muted-foreground">
  {persona.title} · {persona.department} at {persona.company}
</p>`,
    examples: [
      {
        name: "Header",
        description: "Identity, presence and the primary ways to reach her.",
        Demo: PersonaHeaderDemo,
      },
      {
        name: "Contact Card",
        description: "The persona condensed to a card you can drop anywhere.",
        Demo: PersonaContactCardDemo,
      },
      {
        name: "Sizes",
        description:
          "The same person as a compact row, a list row and a full row with actions.",
        Demo: PersonaSizesDemo,
      },
      {
        name: "Presence",
        description:
          "Availability is the only chromatic accent in the palette, driven by the --presence-* tokens.",
        Demo: PersonaPresenceDemo,
      },
      {
        name: "Mention",
        description: "A name in prose that previews the persona on hover.",
        Demo: PersonaHoverCardDemo,
      },
      {
        name: "Account Menu",
        description: "The signed-in persona as an account switcher.",
        Demo: PersonaAccountMenuDemo,
      },
      {
        name: "Team",
        description: "Sophia in context, with the people she works with.",
        Demo: PersonaTeamDemo,
      },
    ],
  },
]
