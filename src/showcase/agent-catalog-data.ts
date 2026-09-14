export const agentCatalogEntriesData = [
  {
    slug: "button",
    name: "Button",
    category: "Forms",
    description:
      "Tertiary is the neutral default for general actions. Choose Primary purple, Primary pink, or Secondary explicitly for tonal emphasis. Selected buttons retain their square-to-round selection behavior.",
    sourceFile: "src/components/ui/button.tsx",
    sourceLink:
      "https://github.com/bhna_microsoft/oneds/blob/main/src/components/ui/button.tsx",
    route: "#/button",
    readFirst:
      "Use size=\"icon\" for a standard icon-only button and size=\"icon-expressive\" for the expressive tier. Default, Selected, Motion, and Icon Only are the quickest examples to inspect before editing a button call site.",
    props: ["variant", "size", "selected", "primaryColor", "asChild"],
    exampleNames: [
      "Default",
      "Selected",
      "Sizes",
      "Motion",
      "Icon Only",
      "With Icon",
      "Optical Spacing",
      "Favicon",
      "Favicon Sizes",
      "Rounded",
      "Loading",
      "Icon Tools",
      "Mixed Tools",
      "As Child",
    ],
    defaultExampleName: "Default",
  },
  {
    slug: "card",
    name: "Card",
    category: "Data Display",
    description: "Displays a card with header, content, and footer.",
    sourceFile: "src/components/ui/card.tsx",
    sourceLink:
      "https://github.com/bhna_microsoft/oneds/blob/main/src/components/ui/card.tsx",
    route: "#/card",
    readFirst:
      "Rich Content, Edge to Edge, and Footer Actions cover the main card anatomy and the layout knobs that usually matter first.",
    props: ["size", "hang", "grouped", "divider", "edgeToEdge"],
    exampleNames: [
      "Rich Content",
      "Footer Actions",
      "Edge to Edge",
      "Code",
      "Image",
      "Hanging Alignment",
    ],
    defaultExampleName: "Rich Content",
  },
  {
    slug: "response",
    name: "Response",
    category: "Chat",
    description:
      "The assistant's answer surface: streaming text, rich content, and the actions a reader takes on it.",
    sourceFile: "src/components/ui/response.tsx",
    sourceLink:
      "https://github.com/bhna_microsoft/oneds/blob/main/src/components/ui/response.tsx",
    route: "#/response",
    readFirst:
      "Streaming and From Markdown are the two fastest routes to the answer surface and its text rendering behavior.",
    props: ["streaming"],
    exampleNames: [
      "Streaming",
      "From Markdown",
      "Streaming Markdown",
      "Rich Content",
      "Math",
      "Actions",
      "Sources",
      "Citations",
      "Error and Retry",
    ],
    defaultExampleName: "Streaming",
  },
] as const
