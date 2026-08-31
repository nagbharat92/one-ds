import avatarImage from "@/assets/Avatars/Avatar.png"

export type PresenceStatus = "available" | "busy" | "away" | "offline"

export type Person = {
  id: string
  name: string
  firstName: string
  initials: string
  handle: string
  title: string
  email: string
  phone: string
  presence: PresenceStatus
  avatar?: string
}

export type PersonaAddress = {
  line1: string
  line2: string
  city: string
  region: string
  postalCode: string
  country: string
}

export type PersonaLink = {
  label: string
  value: string
  href: string
}

export type PersonaProject = {
  id: string
  name: string
  role: string
  status: string
  progress: number
}

export type PersonaActivity = {
  id: string
  title: string
  detail: string
  time: string
}

export type PersonaStat = {
  label: string
  value: string
}

export type Persona = Person & {
  avatar: string
  pronouns: string
  department: string
  company: string
  statusMessage: string
  bio: string
  mobile: string
  address: PersonaAddress
  location: string
  timeZone: string
  workingHours: string
  employeeId: string
  startedOn: string
  startedLabel: string
  languages: string[]
  skills: string[]
  links: PersonaLink[]
  stats: PersonaStat[]
  manager: Person
  teammates: Person[]
  projects: PersonaProject[]
  activity: PersonaActivity[]
}

export const presenceLabels: Record<PresenceStatus, string> = {
  available: "Available",
  busy: "In a meeting",
  away: "Away",
  offline: "Offline",
}

export const company = "Contoso"
const emailDomain = "contoso.com"

/** Handle and email derive from the name, so they can never drift apart. */
function definePerson(input: {
  id: string
  name: string
  initials: string
  title: string
  presence: PresenceStatus
  phone: string
  avatar?: string
}): Person {
  const firstName = input.name.split(" ")[0]
  return {
    ...input,
    firstName,
    handle: firstName.toLowerCase(),
    email: `${input.name.toLowerCase().replace(/\s+/g, ".")}@${emailDomain}`,
  }
}

const manager = definePerson({
  id: "priya-raman",
  name: "Priya Raman",
  initials: "PR",
  title: "Director, Design Platform",
  presence: "busy",
  phone: "+1 (415) 555-0163",
})

const teammates: Person[] = [
  definePerson({
    id: "aiden-kim",
    name: "Aiden Kim",
    initials: "AK",
    title: "Design Engineer",
    presence: "available",
    phone: "+1 (415) 555-0155",
  }),
  definePerson({
    id: "marcus-webb",
    name: "Marcus Webb",
    initials: "MW",
    title: "Accessibility Specialist",
    presence: "away",
    phone: "+1 (415) 555-0171",
  }),
  definePerson({
    id: "lena-fischer",
    name: "Lena Fischer",
    initials: "LF",
    title: "Content Designer",
    presence: "busy",
    phone: "+1 (415) 555-0188",
  }),
  definePerson({
    id: "noor-haddad",
    name: "Noor Haddad",
    initials: "NH",
    title: "Product Designer",
    presence: "offline",
    phone: "+1 (415) 555-0192",
  }),
]

/**
 * The house persona. Every avatar, name, email, phone and address in the
 * showcase comes from here, so one edit changes the person everywhere.
 */
export const persona: Persona = {
  ...definePerson({
    id: "sophia-costa",
    name: "Sophia Costa",
    initials: "SC",
    title: "Design Systems Lead",
    presence: "available",
    phone: "+1 (415) 555-0147",
  }),
  avatar: avatarImage,
  pronouns: "she/her",
  department: "Design Platform",
  company,
  statusMessage: "Heads down on tokens until 3:00 PM",
  bio: "Sophia leads the design system at Contoso. She pairs with product engineers to turn one-off patterns into tokens, components and documentation the whole company can build on.",
  mobile: "+1 (415) 555-0182",
  address: {
    line1: "1201 Market Street",
    line2: "Suite 900",
    city: "San Francisco",
    region: "CA",
    postalCode: "94103",
    country: "United States",
  },
  location: "San Francisco, California",
  timeZone: "Pacific Time · UTC−8",
  workingHours: "9:00 AM – 5:00 PM",
  employeeId: "CTS-40219",
  startedOn: "2019-03-04",
  startedLabel: "March 2019",
  languages: ["English", "Portuguese", "Spanish"],
  skills: [
    "Design systems",
    "Design tokens",
    "Accessibility",
    "Component API",
    "Prototyping",
    "Documentation",
  ],
  links: [
    {
      label: "Website",
      value: "sophiacosta.design",
      href: "https://sophiacosta.design",
    },
    {
      label: "Handbook",
      value: "contoso.com/design",
      href: "https://contoso.com/design",
    },
    {
      label: "Booking",
      value: "Book 30 minutes",
      href: "https://contoso.com/design/sophia",
    },
  ],
  stats: [
    { label: "Components owned", value: "38" },
    { label: "Teams onboarded", value: "12" },
    { label: "Reviews this quarter", value: "94" },
  ],
  manager,
  teammates,
  projects: [
    {
      id: "tokens",
      name: "Token pipeline v3",
      role: "Owner",
      status: "In review",
      progress: 82,
    },
    {
      id: "persona",
      name: "Persona and presence",
      role: "Owner",
      status: "In progress",
      progress: 46,
    },
    {
      id: "motion",
      name: "Motion speed scale",
      role: "Reviewer",
      status: "Shipped",
      progress: 100,
    },
  ],
  activity: [
    {
      id: "activity-1",
      title: "Published the motion speed scale",
      detail: "21 components moved off hardcoded durations",
      time: "2 hours ago",
    },
    {
      id: "activity-2",
      title: "Reviewed Persona and presence",
      detail: "Left 6 comments for Aiden Kim",
      time: "Yesterday",
    },
    {
      id: "activity-3",
      title: "Onboarded the Payments team",
      detail: "Workshop for 14 engineers and 3 designers",
      time: "Last week",
    },
  ],
}

/** Sophia first, then the people she works with. Index in for extra names. */
export const team: Person[] = [persona, manager, ...teammates]

/** Postal address as display lines, so callers never re-assemble it by hand. */
export const personaAddressLines: string[] = [
  persona.address.line1,
  persona.address.line2,
  `${persona.address.city}, ${persona.address.region} ${persona.address.postalCode}`,
  persona.address.country,
]

/** The same address on one line, for copying and for single-line surfaces. */
export const personaAddress = personaAddressLines.join(", ")
