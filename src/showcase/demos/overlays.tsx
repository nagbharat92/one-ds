import { useState } from "react"
import type { ComponentEntry } from "@/showcase/types"
import {
  CalendarIcon,
  CloudIcon,
  CreditCardIcon,
  LogOutIcon,
  MailIcon,
  MessageSquareIcon,
  PlusCircleIcon,
  SettingsIcon,
  UserIcon,
  UserPlusIcon,
  KeyboardIcon,
  LifeBuoyIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  BookmarkIcon,
  Trash2Icon,
  CopyIcon,
  ScissorsIcon,
  ClipboardIcon,
  UndoIcon,
  RedoIcon,
  ImageIcon,
  PencilIcon,
  SparklesIcon,
  LinkIcon,
  UsersIcon,
} from "@/components/ui/icons"

import { Button } from "@/components/ui/button"
import { Scroller } from "@/components/ui/scroller"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Kbd } from "@/components/ui/kbd"
import { Separator } from "@/components/ui/separator"
import { persona } from "@/lib/persona"
import {
  Coachmark,
  CoachmarkAction,
  CoachmarkAnchor,
  CoachmarkBadge,
  CoachmarkBeacon,
  CoachmarkContent,
  CoachmarkDescription,
  CoachmarkDismiss,
  CoachmarkFooter,
  CoachmarkHeader,
  CoachmarkMedia,
  CoachmarkNext,
  CoachmarkPrevious,
  CoachmarkProgress,
  CoachmarkStep,
  CoachmarkTitle,
  CoachmarkTour,
  CoachmarkTrigger,
} from "@/components/ui/coachmark"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Dialog,
  DialogClose,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerNested,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverFooter,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import {
  HoverCard,
  HoverCardContent,
  HoverCardDescription,
  HoverCardHeader,
  HoverCardTitle,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { useIsMobile } from "@/hooks/use-mobile"

export const overlaysDemos: ComponentEntry[] = [
  // ---------------------------------------------------------------------------
  // Alert Dialog
  // ---------------------------------------------------------------------------
  {
    slug: "alert-dialog",
    name: "Alert Dialog",
    description: "A modal dialog that interrupts with important content.",
    category: "Overlays",
    Demo: () => (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="secondary">Delete account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
    code: `<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="secondary">Delete account</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
    examples: [
      {
        name: "Small",
        description: "Compact alert dialog using the sm size variant.",
        Demo: () => (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary">Small dialog</Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this item?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ),
      },
      {
        name: "Media",
        description: "Alert dialog with a leading media icon.",
        Demo: () => (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary">With media</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <MailIcon className="size-6" />
                </AlertDialogMedia>
                <AlertDialogTitle>Check your email</AlertDialogTitle>
                <AlertDialogDescription>
                  We sent a verification link to your email address.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Dismiss</AlertDialogCancel>
                <AlertDialogAction>Open email</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ),
      },
      {
        name: "Small with media",
        description: "Small size with a media icon.",
        Demo: () => (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary">Small + media</Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <ImageIcon className="size-6" />
                </AlertDialogMedia>
                <AlertDialogTitle>Upload complete</AlertDialogTitle>
                <AlertDialogDescription>
                  Your image has been uploaded successfully.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
                <AlertDialogAction>View</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ),
      },
      {
        name: "Destructive",
        description: "Destructive alert dialog with a danger action.",
        Demo: function AlertDestructive() {
          const [status, setStatus] = useState("")
          return (
            <div className="flex flex-col items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete project</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete project?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the project and all associated
                      data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={() => setStatus("Project deleted (simulated)")}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {status && (
                <p className="text-sm text-muted-foreground">{status}</p>
              )}
            </div>
          )
        },
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Dialog
  // ---------------------------------------------------------------------------
  {
    slug: "dialog",
    name: "Dialog",
    description: "A window overlaid on the primary window or another dialog.",
    category: "Overlays",
    Demo: () => (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Edit profile</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="demo-dialog-name">Name</FieldLabel>
              <Input id="demo-dialog-name" defaultValue={persona.name} />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="tertiary">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="secondary">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
    code: `<Dialog>
  <DialogTrigger asChild>
    <Button variant="secondary">Edit profile</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>Make changes to your profile.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button type="submit" variant="secondary">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
    examples: [
      {
        name: "Custom close button",
        description: "Dialog with the built-in close button visible.",
        Demo: () => (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Custom close</Button>
            </DialogTrigger>
            <DialogContent showCloseButton>
              <DialogHeader>
                <DialogTitle>Notifications</DialogTitle>
                <DialogDescription>
                  You have 3 unread messages.
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                Use the X button or press Escape to dismiss.
              </p>
            </DialogContent>
          </Dialog>
        ),
      },
      {
        name: "No close button",
        description: "Dialog without any close button in the header.",
        Demo: () => (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">No close button</Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>Terms of service</DialogTitle>
                <DialogDescription>
                  Please review and accept the terms.
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                You must take an action to close this dialog.
              </p>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="tertiary">Decline</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="secondary">Accept</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ),
      },
      {
        name: "Sticky footer",
        description:
          "Dialog with scrollable content and a footer pinned at the bottom.",
        layout: "viewport" as const,
        Demo: () => (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Sticky footer</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Release notes</DialogTitle>
                <DialogDescription>
                  What's new in this version.
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                {Array.from({ length: 12 }, (_, i) => (
                  <p key={i} className="text-sm text-muted-foreground">
                    Feature {i + 1}: Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                  </p>
                ))}
              </DialogBody>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="tertiary">Close</Button>
                </DialogClose>
                <Button variant="secondary">Got it</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ),
      },
      {
        name: "Scrollable content",
        description:
          "The header stays pinned while the body scrolls underneath it.",
        layout: "viewport" as const,
        Demo: () => (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Scrollable content</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Long article</DialogTitle>
                <DialogDescription>
                  Scroll to read the full content.
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                {Array.from({ length: 20 }, (_, i) => (
                  <p key={i} className="text-sm text-muted-foreground">
                    Paragraph {i + 1}: Ut enim ad minim veniam, quis nostrud
                    exercitation ullamco laboris nisi ut aliquip ex ea commodo.
                  </p>
                ))}
              </DialogBody>
            </DialogContent>
          </Dialog>
        ),
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Drawer
  // ---------------------------------------------------------------------------
  {
    slug: "drawer",
    name: "Drawer",
    description:
      "A panel that slides in from the edge of the screen. Defaults to the right.",
    category: "Overlays",
    Demo: () => (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="secondary">Open drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Move goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    ),
    code: `<Drawer>
  <DrawerTrigger asChild>
    <Button variant="secondary">Open drawer</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Move goal</DrawerTitle>
      <DrawerDescription>Set your daily activity goal.</DrawerDescription>
    </DrawerHeader>
    <DrawerFooter>
      <Button>Submit</Button>
      <DrawerClose asChild>
        <Button variant="secondary">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`,
    examples: [
      {
        name: "Scrollable content",
        description: "Drawer with content that scrolls vertically.",
        layout: "viewport" as const,
        Demo: () => (
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="secondary">Scrollable drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Changelog</DrawerTitle>
                <DrawerDescription>
                  Recent updates to the project.
                </DrawerDescription>
              </DrawerHeader>
              <Scroller fadeSize="sm" className="min-h-0 flex-1 space-y-3">
                {Array.from({ length: 15 }, (_, i) => (
                  <p key={i} className="text-sm text-muted-foreground">
                    v1.{i + 1}.0 — Bug fixes and performance improvements.
                  </p>
                ))}
              </Scroller>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="secondary">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ),
      },
      {
        name: "Sides",
        description: "Drawer can open from any direction.",
        layout: "viewport" as const,
        Demo: () => (
          <div className="flex flex-wrap gap-2">
            {(["top", "right", "bottom", "left"] as const).map((dir) => (
              <Drawer key={dir} direction={dir}>
                <DrawerTrigger asChild>
                  <Button variant="secondary" className="capitalize">
                    {dir}
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto flex w-full max-w-sm flex-col gap-(--drawer-gap)">
                    <DrawerHeader>
                      <DrawerTitle>{dir} drawer</DrawerTitle>
                      <DrawerDescription>
                        Opens from the {dir}.
                      </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                      <DrawerClose asChild>
                        <Button variant="secondary">Close</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>
            ))}
          </div>
        ),
      },
      {
        name: "Without close button",
        description:
          "Hide the built-in close button and resolve from the footer instead.",
        layout: "viewport" as const,
        Demo: () => (
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="secondary">No close button</Button>
            </DrawerTrigger>
            <DrawerContent showCloseButton={false}>
              <DrawerHeader>
                <DrawerTitle>Manual close only</DrawerTitle>
                <DrawerDescription>
                  This drawer has no X button. Use the button below.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button>Done</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ),
      },
      {
        name: "Nested drawers",
        description:
          "Open a drawer from inside another drawer. The parent scales back and stays mounted.",
        layout: "viewport" as const,
        Demo: () => (
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="secondary">Manage account</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Account</DrawerTitle>
                <DrawerDescription>
                  Update your details or remove the account entirely.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <DrawerNested>
                  <DrawerTrigger asChild>
                    <Button variant="destructive">Delete account</Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Are you sure?</DrawerTitle>
                      <DrawerDescription>
                        This permanently deletes the account and all of its
                        data.
                      </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                      <Button variant="destructive">Yes, delete it</Button>
                      <DrawerClose asChild>
                        <Button variant="secondary">Back</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </DrawerNested>
                <DrawerClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ),
      },
      {
        name: "Responsive dialog",
        description:
          "A dialog on desktop that becomes a drawer on mobile viewports.",
        layout: "viewport" as const,
        Demo: function ResponsiveDialogDemo() {
          const isMobile = useIsMobile()
          const [open, setOpen] = useState(false)
          const title = "Edit profile"
          const desc = "Make changes to your profile. This is responsive."

          if (isMobile) {
            return (
              <Drawer open={open} onOpenChange={setOpen} direction="bottom">
                <DrawerTrigger asChild>
                  <Button variant="secondary">
                    Edit profile (responsive)
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto flex w-full max-w-sm flex-col gap-(--drawer-gap)">
                    <DrawerHeader>
                      <DrawerTitle>{title}</DrawerTitle>
                      <DrawerDescription>{desc}</DrawerDescription>
                    </DrawerHeader>
                    <div className="space-y-3">
                      <Label htmlFor="resp-drawer-name">Name</Label>
                      <Input
                        id="resp-drawer-name"
                        defaultValue={persona.name}
                      />
                    </div>
                    <DrawerFooter>
                      <Button onClick={() => setOpen(false)}>Save</Button>
                      <DrawerClose asChild>
                        <Button variant="secondary">Cancel</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>
            )
          }

          return (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary">
                  Edit profile (responsive)
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{title}</DialogTitle>
                  <DialogDescription>{desc}</DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <Label htmlFor="resp-dialog-name">Name</Label>
                  <Input
                    id="resp-dialog-name"
                    defaultValue={persona.name}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="tertiary">Cancel</Button>
                  </DialogClose>
                  <Button variant="secondary" onClick={() => setOpen(false)}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        },
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Popover
  // ---------------------------------------------------------------------------
  {
    slug: "popover",
    name: "Popover",
    description: "Displays rich content in a portal, triggered by a button.",
    category: "Overlays",
    Demo: () => (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>
              Set the dimensions for the layer.
            </PopoverDescription>
          </PopoverHeader>
          <div className="grid grid-cols-3 items-center gap-(--space-sm)">
            <Label htmlFor="demo-pop-width">Width</Label>
            <Input
              id="demo-pop-width"
              defaultValue="100%"
              className="col-span-2 rounded-(--popover-inner-radius)"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-(--space-sm)">
            <Label htmlFor="demo-pop-height">Height</Label>
            <Input
              id="demo-pop-height"
              defaultValue="auto"
              className="col-span-2 rounded-(--popover-inner-radius)"
            />
          </div>
        </PopoverContent>
      </Popover>
    ),
    code: `<Popover>
  <PopoverTrigger asChild>
    <Button variant="secondary">Open popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <PopoverHeader>
      <PopoverTitle>Dimensions</PopoverTitle>
      <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
    </PopoverHeader>
    <div className="grid grid-cols-3 items-center gap-3">
      <Label htmlFor="demo-pop-width">Width</Label>
      <Input
        id="demo-pop-width"
        defaultValue="100%"
        className="col-span-2"
      />
    </div>
  </PopoverContent>
</Popover>`,
    examples: [
      {
        name: "Sides",
        description:
          "Popover positioned on each side of the trigger. Every side holds the same multi-line block.",
        Demo: () => (
          <div className="flex flex-wrap items-center justify-center gap-8 py-16">
            {(["top", "right", "bottom", "left"] as const).map((s) => (
              <Popover key={s}>
                <PopoverTrigger asChild>
                  <Button variant="secondary" className="capitalize">
                    {s}
                  </Button>
                </PopoverTrigger>
                <PopoverContent side={s}>
                  <PopoverHeader>
                    <PopoverTitle className="capitalize">
                      {s} side
                    </PopoverTitle>
                    <PopoverDescription>
                      The popover is anchored to the {s} of its trigger and
                      flips to the opposite side when the viewport runs out of
                      room. Body copy wraps freely, so a popover can carry
                      several lines without changing its anchor.
                    </PopoverDescription>
                  </PopoverHeader>
                  <Separator />
                  <div className="flex items-center gap-(--space-xs) text-xs text-muted-foreground">
                    <CalendarIcon className="size-4" />
                    <span>Preview · updated moments ago</span>
                  </div>
                </PopoverContent>
              </Popover>
            ))}
          </div>
        ),
      },
      {
        name: "Align",
        description:
          "Popover aligned to the start, center, or end edge of the trigger.",
        Demo: () => (
          <div className="flex flex-wrap items-center justify-center gap-4 py-8">
            {(["start", "center", "end"] as const).map((a) => (
              <Popover key={a}>
                <PopoverTrigger asChild>
                  <Button variant="secondary" className="capitalize">
                    {a}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align={a}>
                  <PopoverHeader>
                    <PopoverTitle className="capitalize">
                      {a} aligned
                    </PopoverTitle>
                    <PopoverDescription>
                      The content edge lines up with the {a} of the trigger.
                      Alignment is independent of the side, so a wide popover
                      can hug either edge and still open below its trigger.
                    </PopoverDescription>
                  </PopoverHeader>
                </PopoverContent>
              </Popover>
            ))}
          </div>
        ),
      },
      {
        name: "With form",
        description: "Popover containing a form with inputs and action footer.",
        Demo: function PopoverForm() {
          const [saved, setSaved] = useState("")
          return (
            <div className="flex flex-col items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="secondary">Set dimensions</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <form
                    className="flex flex-col gap-(--popover-gap)"
                    onSubmit={(e) => {
                      e.preventDefault()
                      const fd = new FormData(e.currentTarget)
                      setSaved(
                        `Saved: ${fd.get("pop-w")} × ${fd.get("pop-h")}`,
                      )
                    }}
                  >
                    <PopoverHeader>
                      <PopoverTitle>Dimensions</PopoverTitle>
                      <PopoverDescription>
                        Set width and height for the selected layer.
                      </PopoverDescription>
                    </PopoverHeader>
                    <div className="flex flex-col gap-(--space-sm)">
                      <div className="grid grid-cols-3 items-center gap-(--space-sm)">
                        <Label htmlFor="pop-form-w">Width</Label>
                        <Input
                          id="pop-form-w"
                          name="pop-w"
                          defaultValue="100%"
                          className="col-span-2 rounded-(--popover-inner-radius)"
                        />
                      </div>
                      <div className="grid grid-cols-3 items-center gap-(--space-sm)">
                        <Label htmlFor="pop-form-h">Height</Label>
                        <Input
                          id="pop-form-h"
                          name="pop-h"
                          defaultValue="50px"
                          className="col-span-2 rounded-(--popover-inner-radius)"
                        />
                      </div>
                    </div>
                    <PopoverFooter>
                      <PopoverClose asChild>
                        <Button variant="secondary">Cancel</Button>
                      </PopoverClose>
                      <Button type="submit">Save</Button>
                    </PopoverFooter>
                  </form>
                </PopoverContent>
              </Popover>
              {saved && (
                <p className="text-sm text-muted-foreground">{saved}</p>
              )}
            </div>
          )
        },
      },
      {
        name: "With close button",
        description:
          "Popover with an integrated dismiss action and confirmation footer.",
        Demo: () => (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary">Layer settings</Button>
            </PopoverTrigger>
            <PopoverContent showCloseButton>
              <PopoverHeader>
                <PopoverTitle>Layer settings</PopoverTitle>
                <PopoverDescription>
                  Configure automated visibility and opacity controls.
                </PopoverDescription>
              </PopoverHeader>
              <Separator />
              <div className="flex items-center justify-between gap-(--space-sm)">
                <div className="flex flex-col gap-(--space-hairline)">
                  <span className="text-sm font-medium">Visible</span>
                  <span className="text-xs text-muted-foreground">
                    Render this layer in the viewport
                  </span>
                </div>
                <Switch defaultChecked />
              </div>
              <PopoverFooter>
                <PopoverClose asChild>
                  <Button variant="secondary">Done</Button>
                </PopoverClose>
              </PopoverFooter>
            </PopoverContent>
          </Popover>
        ),
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Hover Card
  // ---------------------------------------------------------------------------
  {
    slug: "hover-card",
    name: "Hover Card",
    description: "For sighted users to preview content behind a link.",
    category: "Overlays",
    Demo: () => (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link">@{persona.handle}</Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex gap-(--space-sm)">
            <Avatar size="lg">
              <AvatarImage src={persona.avatar} alt={persona.name} />
              <AvatarFallback>{persona.initials}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col gap-(--space-hairline)">
              <HoverCardTitle>{persona.name}</HoverCardTitle>
              <HoverCardDescription>
                {persona.title} · {persona.department} at {persona.company}.
              </HoverCardDescription>
              <div className="flex items-center gap-(--space-xs) pt-(--space-2xs) text-xs text-muted-foreground">
                <CalendarIcon className="size-4" />
                <span>Joined {persona.startedLabel}</span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    ),
    code: `<HoverCard>
  <HoverCardTrigger asChild>
    <Button variant="link">@{persona.handle}</Button>
  </HoverCardTrigger>
  <HoverCardContent>
    <div className="flex gap-3">
      <Avatar size="lg">
        <AvatarImage src={persona.avatar} alt={persona.name} />
        <AvatarFallback>{persona.initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        <HoverCardTitle>{persona.name}</HoverCardTitle>
        <HoverCardDescription>
          {persona.title} · {persona.department} at {persona.company}.
        </HoverCardDescription>
      </div>
    </div>
  </HoverCardContent>
</HoverCard>`,
    examples: [
      {
        name: "Multi-line Content",
        description:
          "A hover card holds a full block: a heading, wrapping body copy, a separator and a meta row.",
        Demo: () => (
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link">Design tokens</Button>
            </HoverCardTrigger>
            <HoverCardContent>
              <HoverCardHeader>
                <HoverCardTitle>Design tokens</HoverCardTitle>
                <HoverCardDescription>
                  Named values for color, spacing, radius and type. Components
                  read tokens instead of raw values, so a theme change is a
                  one-place edit and every surface stays in step.
                </HoverCardDescription>
              </HoverCardHeader>
              <Separator />
              <div className="flex items-center gap-(--space-xs) text-xs text-muted-foreground">
                <CalendarIcon className="size-4" />
                <span>Updated 2 days ago · 4 min read</span>
              </div>
            </HoverCardContent>
          </HoverCard>
        ),
      },
      {
        name: "Inline in Prose",
        description:
          "Triggers can sit inside a paragraph to preview what a link points at.",
        Demo: () => (
          <p className="max-w-md text-sm leading-relaxed">
            The showcase is built with{" "}
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link" className="h-auto p-0 align-baseline">
                  Radix primitives
                </Button>
              </HoverCardTrigger>
              <HoverCardContent>
                <HoverCardHeader>
                  <HoverCardTitle>Radix Primitives</HoverCardTitle>
                  <HoverCardDescription>
                    Unstyled, accessible components that own focus, keyboard and
                    positioning behaviour. Styling stays entirely ours.
                  </HoverCardDescription>
                </HoverCardHeader>
              </HoverCardContent>
            </HoverCard>{" "}
            so the behaviour is handled for us and the tokens do the rest.
          </p>
        ),
      },
      {
        name: "Sides",
        description:
          "Hover card positioned on each side of the trigger. Every side holds the same multi-line block.",
        Demo: () => (
          <div className="flex flex-wrap items-center justify-center gap-8 py-16">
            {(["top", "right", "bottom", "left"] as const).map((s) => (
              <HoverCard key={s}>
                <HoverCardTrigger asChild>
                  <Button variant="link" className="capitalize">
                    {s}
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent side={s}>
                  <HoverCardHeader>
                    <HoverCardTitle className="capitalize">
                      {s} side
                    </HoverCardTitle>
                    <HoverCardDescription>
                      The card is anchored to the <strong>{s}</strong> of its
                      trigger and flips to the opposite side when the viewport
                      runs out of room. Body copy wraps freely, so a card can
                      carry several lines without changing its anchor.
                    </HoverCardDescription>
                  </HoverCardHeader>
                  <Separator />
                  <div className="flex items-center gap-(--space-xs) text-xs text-muted-foreground">
                    <CalendarIcon className="size-4" />
                    <span>Preview · updated moments ago</span>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        ),
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Tooltip
  // ---------------------------------------------------------------------------
  {
    slug: "tooltip",
    name: "Tooltip",
    description: "A popup that displays information on hover or focus.",
    category: "Overlays",
    Demo: () => (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="secondary">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    ),
    code: `<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="secondary">Hover me</Button>
  </TooltipTrigger>
  <TooltipContent>Add to library</TooltipContent>
</Tooltip>`,
    examples: [
      {
        name: "Sides",
        description: "Tooltip on each side of the trigger.",
        Demo: () => (
          <div className="flex flex-wrap items-center gap-4 py-8">
            {(["top", "right", "bottom", "left"] as const).map((s) => (
              <Tooltip key={s}>
                <TooltipTrigger asChild>
                  <Button variant="secondary" className="capitalize">
                    {s}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side={s}>
                  <p>Tooltip on the {s}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        ),
      },
      {
        name: "With keyboard shortcut",
        description: "Tooltip displaying a keyboard shortcut using Kbd.",
        Demo: () => (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Bold">
                <BoldIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Bold <Kbd>⌘B</Kbd>
            </TooltipContent>
          </Tooltip>
        ),
      },
      {
        name: "Disabled button",
        description:
          "Tooltip on a disabled button using a wrapper span technique.",
        Demo: () => (
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0} className="inline-flex">
                <Button
                  variant="secondary"
                  disabled
                  className="pointer-events-none"
                >
                  Disabled
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>You don't have permission to do this</p>
            </TooltipContent>
          </Tooltip>
        ),
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Coachmark
  // ---------------------------------------------------------------------------
  {
    slug: "coachmark",
    name: "Coachmark",
    description:
      "A teaching tip the app opens itself, to point at a feature or upsell it.",
    category: "Overlays",
    Demo: () => (
      <Coachmark defaultOpen openDelay={400}>
        <CoachmarkTrigger asChild>
          <Button variant="secondary">Share</Button>
        </CoachmarkTrigger>
        <CoachmarkContent>
          <CoachmarkHeader>
            <CoachmarkTitle>Share beyond your team</CoachmarkTitle>
            <CoachmarkDescription>
              Guests can now open a read-only link without an account.
            </CoachmarkDescription>
          </CoachmarkHeader>
          <CoachmarkFooter>
            <CoachmarkDismiss>Not now</CoachmarkDismiss>
            <CoachmarkAction>Try it</CoachmarkAction>
          </CoachmarkFooter>
        </CoachmarkContent>
      </Coachmark>
    ),
    code: `<Coachmark defaultOpen openDelay={400}>
  <CoachmarkTrigger asChild>
    <Button variant="secondary">Share</Button>
  </CoachmarkTrigger>
  <CoachmarkContent>
    <CoachmarkHeader>
      <CoachmarkTitle>Share beyond your team</CoachmarkTitle>
      <CoachmarkDescription>
        Guests can now open a read-only link without an account.
      </CoachmarkDescription>
    </CoachmarkHeader>
    <CoachmarkFooter>
      <CoachmarkDismiss>Not now</CoachmarkDismiss>
      <CoachmarkAction>Try it</CoachmarkAction>
    </CoachmarkFooter>
  </CoachmarkContent>
</Coachmark>`,
    examples: [
      {
        name: "Beacon",
        description:
          "A pulsing dot that both anchors the tip and invites the click.",
        Demo: () => (
          <div className="flex items-center gap-(--space-xs) rounded-xl border p-(--space-xs)">
            <Button variant="ghost" size="default">
              <PencilIcon data-icon="inline-start" />
              Compose
            </Button>
            <Button variant="ghost" size="default">
              <ImageIcon data-icon="inline-start" />
              Media
            </Button>
            <Coachmark>
              <div className="relative">
                <Button variant="ghost" size="default">
                  <SparklesIcon data-icon="inline-start" />
                  Rewrite
                </Button>
                <CoachmarkBeacon
                  label="Learn about Rewrite"
                  className="absolute -top-1 -right-1"
                />
              </div>
              <CoachmarkContent size="sm" align="end">
                <CoachmarkHeader>
                  <CoachmarkTitle>Rewrite is here</CoachmarkTitle>
                  <CoachmarkDescription>
                    Turn a rough draft into three polished options.
                  </CoachmarkDescription>
                </CoachmarkHeader>
                <CoachmarkFooter>
                  <CoachmarkAction>Show me</CoachmarkAction>
                </CoachmarkFooter>
              </CoachmarkContent>
            </Coachmark>
          </div>
        ),
      },
      {
        name: "Upsell with media",
        description:
          "Media, a lead-in badge and a single call to action for promoting a paid feature.",
        Demo: () => (
          <Coachmark>
            <CoachmarkTrigger asChild>
              <Button variant="secondary">See what's new</Button>
            </CoachmarkTrigger>
            <CoachmarkContent size="lg">
              <CoachmarkMedia>
                <div className="flex size-full items-center justify-center text-foreground">
                  <SparklesIcon className="size-8 text-foreground" />
                </div>
              </CoachmarkMedia>
              <CoachmarkHeader>
                <CoachmarkBadge>Included in Pro</CoachmarkBadge>
                <CoachmarkTitle>Summarise any thread</CoachmarkTitle>
                <CoachmarkDescription>
                  Catch up on a long conversation in a few lines, then jump
                  straight to the decisions.
                </CoachmarkDescription>
              </CoachmarkHeader>
              <CoachmarkFooter>
                <CoachmarkDismiss>Maybe later</CoachmarkDismiss>
                <CoachmarkAction>Upgrade</CoachmarkAction>
              </CoachmarkFooter>
            </CoachmarkContent>
          </Coachmark>
        ),
      },
      {
        name: "Tones",
        description:
          "Inverted is the default and the loudest; the light tone sits quietly on the page surface.",
        Demo: () => (
          <div className="flex flex-wrap items-center gap-4">
            {(["inverted", "default"] as const).map((tone) => (
              <Coachmark key={tone}>
                <CoachmarkTrigger asChild>
                  <Button variant="secondary" className="capitalize">
                    {tone}
                  </Button>
                </CoachmarkTrigger>
                <CoachmarkContent tone={tone} size="sm">
                  <CoachmarkHeader>
                    <CoachmarkTitle className="capitalize">
                      {tone} tone
                    </CoachmarkTitle>
                    <CoachmarkDescription>
                      Every part inside picks up the tone automatically.
                    </CoachmarkDescription>
                  </CoachmarkHeader>
                  <CoachmarkFooter>
                    <CoachmarkAction>Got it</CoachmarkAction>
                  </CoachmarkFooter>
                </CoachmarkContent>
              </Coachmark>
            ))}
          </div>
        ),
      },
      {
        name: "Multi-step tour",
        description:
          "One tour drives several coachmarks in sequence, with progress dots and Back / Next.",
        layout: "wide" as const,
        Demo: () => {
          const [step, setStep] = useState(0)
          const [open, setOpen] = useState(false)

          const steps = [
            {
              icon: PencilIcon,
              label: "Compose",
              title: "Start a draft here",
              description:
                "Compose opens a blank note with your last template applied.",
            },
            {
              icon: ImageIcon,
              label: "Media",
              title: "Drop in anything",
              description:
                "Images, clips and files all land in the same tray.",
            },
            {
              icon: SettingsIcon,
              label: "Settings",
              title: "Tune it once",
              description:
                "Defaults set here apply to every note you write from now on.",
            },
          ]

          return (
            <CoachmarkTour
              count={steps.length}
              step={step}
              onStepChange={setStep}
              open={open}
              onOpenChange={setOpen}
            >
              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-(--space-xs) rounded-xl border p-(--space-xs)">
                  {steps.map((item, index) => (
                    <CoachmarkStep key={item.label} index={index}>
                      <CoachmarkAnchor asChild>
                        <Button variant="ghost" size="default">
                          <item.icon data-icon="inline-start" />
                          {item.label}
                        </Button>
                      </CoachmarkAnchor>
                      <CoachmarkContent size="sm">
                        <CoachmarkHeader>
                          <CoachmarkTitle>{item.title}</CoachmarkTitle>
                          <CoachmarkDescription>
                            {item.description}
                          </CoachmarkDescription>
                        </CoachmarkHeader>
                        <CoachmarkFooter>
                          <CoachmarkProgress />
                          <div className="flex items-center gap-1">
                            <CoachmarkPrevious />
                            <CoachmarkNext />
                          </div>
                        </CoachmarkFooter>
                      </CoachmarkContent>
                    </CoachmarkStep>
                  ))}
                </div>
                <Button
                  variant="secondary"
                  size="default"
                  onClick={() => {
                    setStep(0)
                    setOpen(true)
                  }}
                >
                  Start tour
                </Button>
              </div>
            </CoachmarkTour>
          )
        },
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Dropdown Menu
  // ---------------------------------------------------------------------------
  {
    slug: "dropdown-menu",
    name: "Dropdown Menu",
    description: "Displays a menu of actions triggered by a button.",
    category: "Overlays",
    Demo: function DropdownMenuDemo() {
      const [activityVisible, setActivityVisible] = useState(true)

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">Open menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent grouped className="w-64" align="start">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserIcon /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon /> Billing
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <KeyboardIcon /> Keyboard shortcuts
              </DropdownMenuItem>
              <DropdownMenuCheckboxItem
                checked={activityVisible}
                onCheckedChange={setActivityVisible}
              >
                <SettingsIcon /> Activity
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <KeyboardIcon /> More tools
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
                  <DropdownMenuItem>Preferences</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    code: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="secondary">Open menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent grouped className="w-64" align="start">
    <DropdownMenuGroup>
      <DropdownMenuItem>Profile</DropdownMenuItem>
      <DropdownMenuItem>Billing</DropdownMenuItem>
      <DropdownMenuItem disabled>Keyboard shortcuts</DropdownMenuItem>
      <DropdownMenuCheckboxItem checked>Activity</DropdownMenuCheckboxItem>
    </DropdownMenuGroup>
    <DropdownMenuGroup>
      <DropdownMenuItem>More tools</DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>`,
    examples: [
      {
        name: "Submenu",
        description: "A dropdown with a nested submenu.",
        layout: "wide" as const,
        Demo: () => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">Submenu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent grouped className="w-64" align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem>New file</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>
                        <MailIcon /> Email
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquareIcon /> Message
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <PlusCircleIcon /> More...
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
      {
        name: "Shortcuts",
        description: "Menu items with keyboard shortcut hints.",
        Demo: () => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">Shortcuts</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent grouped className="w-64" align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  New tab <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  New window <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Print <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
      {
        name: "Icons",
        description: "Each menu item with a leading icon.",
        Demo: () => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">Icons</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent grouped className="w-64" align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <UserIcon /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCardIcon /> Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SettingsIcon /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <KeyboardIcon /> Keyboard shortcuts
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <LogOutIcon /> Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
      {
        name: "Checkboxes",
        description: "Menu with togglable checkbox items.",
        Demo: function DropdownCheckboxes() {
          const [showStatus, setShowStatus] = useState(true)
          const [showActivity, setShowActivity] = useState(false)
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary">Checkboxes</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent grouped className="w-64" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={showStatus}
                    onCheckedChange={setShowStatus}
                  >
                    Status bar
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={showActivity}
                    onCheckedChange={setShowActivity}
                  >
                    Activity bar
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem disabled>
                    Panel (disabled)
                  </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
      {
        name: "Checkbox icons",
        description: "Checkbox items with leading icons.",
        Demo: function DropdownCheckboxIcons() {
          const [bold, setBold] = useState(false)
          const [italic, setItalic] = useState(true)
          const [underline, setUnderline] = useState(false)
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary">Checkbox icons</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent grouped className="w-64" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuLabel inset>Formatting</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={bold}
                    onCheckedChange={setBold}
                  >
                    <BoldIcon /> Bold
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={italic}
                    onCheckedChange={setItalic}
                  >
                    <ItalicIcon /> Italic
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={underline}
                    onCheckedChange={setUnderline}
                  >
                    <UnderlineIcon /> Underline
                  </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
      {
        name: "Radio group",
        description: "Menu with a single-selection radio group.",
        Demo: function DropdownRadioDemo() {
          const [value, setValue] = useState("bottom")
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary">Radio group</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent grouped className="w-64" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Panel position</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={value}
                    onValueChange={setValue}
                  >
                    <DropdownMenuRadioItem value="top">
                      Top
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="bottom">
                      Bottom
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="right">
                      Right
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
      {
        name: "Radio icons",
        description: "Radio items with leading icons.",
        Demo: function DropdownRadioIcons() {
          const [align, setAlign] = useState("left")
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary">Radio icons</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent grouped className="w-64" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuLabel inset>Alignment</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={align}
                    onValueChange={setAlign}
                  >
                    <DropdownMenuRadioItem value="left">
                      <AlignLeftIcon /> Left
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="center">
                      <AlignCenterIcon /> Center
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="right">
                      <AlignRightIcon /> Right
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
      {
        name: "Destructive",
        description: "Menu with a destructive action item.",
        Demo: function DropdownDestructive() {
          const [status, setStatus] = useState("")
          return (
            <div className="flex flex-col items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary">Destructive</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent grouped className="w-64" align="start">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <PencilIcon /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CopyIcon /> Duplicate
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setStatus("Deleted (simulated)")}
                    >
                      <Trash2Icon /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              {status && (
                <p className="text-sm text-muted-foreground">{status}</p>
              )}
            </div>
          )
        },
      },
      {
        name: "Avatar",
        description: "Menu triggered by an avatar button.",
        Demo: () => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative size-8 rounded-full"
                aria-label="User menu"
              >
                <Avatar className="size-8">
                  <AvatarImage src={persona.avatar} alt="" />
                  <AvatarFallback>{persona.initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent grouped className="w-64" align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="py-(--space-sm)! font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium leading-none">
                      {persona.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {persona.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <UserIcon /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SettingsIcon /> Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <LogOutIcon /> Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
      {
        name: "Complex",
        description:
          "Full menu with groups, icons, shortcuts, submenu, checkboxes, and radio.",
        layout: "wide" as const,
        Demo: function ComplexMenu() {
          const [bookmarks, setBookmarks] = useState(true)
          const [urls, setUrls] = useState(false)
          const [person, setPerson] = useState(persona.handle)
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary">Complex menu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent grouped className="w-64" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuLabel inset>My account</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <UserIcon /> Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCardIcon /> Billing
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <SettingsIcon /> Settings
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserPlusIcon /> Invite users
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <UserPlusIcon /> New team
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>
                          <MailIcon /> Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquareIcon /> Message
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <PlusCircleIcon /> More...
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={bookmarks}
                    onCheckedChange={setBookmarks}
                  >
                    <BookmarkIcon /> Show bookmarks
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={urls}
                    onCheckedChange={setUrls}
                  >
                    <LinkIcon /> Show full URLs
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel inset>Team member</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={person}
                    onValueChange={setPerson}
                  >
                    <DropdownMenuRadioItem value={persona.handle}>
                      <UserIcon /> {persona.firstName}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={persona.manager.handle}>
                      <UsersIcon /> {persona.manager.firstName}
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LifeBuoyIcon /> Support
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <CloudIcon /> API (coming soon)
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive">
                    <LogOutIcon /> Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Context Menu
  // ---------------------------------------------------------------------------
  {
    slug: "context-menu",
    name: "Context Menu",
    description: "A menu triggered by a right click.",
    category: "Overlays",
    Demo: () => (
      <ContextMenu>
        <ContextMenuTrigger className="flex h-36 w-full max-w-sm items-center justify-center rounded-md border border-dashed text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent grouped className="w-52">
          <ContextMenuGroup>
            <ContextMenuItem>Back</ContextMenuItem>
            <ContextMenuItem>Forward</ContextMenuItem>
            <ContextMenuItem>Reload</ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuGroup>
            <ContextMenuItem>Save as...</ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    ),
    code: `<ContextMenu>
  <ContextMenuTrigger className="flex h-36 items-center justify-center rounded-md border border-dashed text-sm">
    Right click here
  </ContextMenuTrigger>
  <ContextMenuContent grouped className="w-52">
    <ContextMenuGroup>
      <ContextMenuItem>Back</ContextMenuItem>
      <ContextMenuItem>Reload</ContextMenuItem>
    </ContextMenuGroup>
    <ContextMenuGroup>
      <ContextMenuItem>Save as...</ContextMenuItem>
    </ContextMenuGroup>
  </ContextMenuContent>
</ContextMenu>`,
    examples: [
      {
        name: "Submenu",
        description: "Context menu with a nested submenu.",
        layout: "wide" as const,
        Demo: () => (
          <ContextMenu>
            <ContextMenuTrigger className="flex h-36 w-full max-w-sm items-center justify-center rounded-md border border-dashed text-sm">
              Right click — submenu
            </ContextMenuTrigger>
            <ContextMenuContent grouped className="w-52">
              <ContextMenuGroup>
                <ContextMenuItem>Back</ContextMenuItem>
                <ContextMenuSub>
                  <ContextMenuSubTrigger>More tools</ContextMenuSubTrigger>
                  <ContextMenuPortal>
                    <ContextMenuSubContent className="w-48">
                      <ContextMenuItem>Save page as...</ContextMenuItem>
                      <ContextMenuItem>Create shortcut...</ContextMenuItem>
                      <ContextMenuItem>Developer tools</ContextMenuItem>
                    </ContextMenuSubContent>
                  </ContextMenuPortal>
                </ContextMenuSub>
                <ContextMenuSeparator />
                <ContextMenuItem>Reload</ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuContent>
          </ContextMenu>
        ),
      },
      {
        name: "Shortcuts",
        description: "Context menu items with keyboard shortcut hints.",
        Demo: () => (
          <ContextMenu>
            <ContextMenuTrigger className="flex h-36 w-full max-w-sm items-center justify-center rounded-md border border-dashed text-sm">
              Right click — shortcuts
            </ContextMenuTrigger>
            <ContextMenuContent grouped className="w-52">
              <ContextMenuGroup>
                <ContextMenuItem>
                  Back <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem>
                  Forward <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem>
                  Reload <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                </ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuContent>
          </ContextMenu>
        ),
      },
      {
        name: "Groups",
        description: "Menu items organized into labeled groups.",
        Demo: () => (
          <ContextMenu>
            <ContextMenuTrigger className="flex h-36 w-full max-w-sm items-center justify-center rounded-md border border-dashed text-sm">
              Right click — groups
            </ContextMenuTrigger>
            <ContextMenuContent grouped className="w-52">
              <ContextMenuGroup>
                <ContextMenuLabel>Navigation</ContextMenuLabel>
                <ContextMenuItem>Back</ContextMenuItem>
                <ContextMenuItem>Forward</ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuGroup>
                <ContextMenuLabel>Actions</ContextMenuLabel>
                <ContextMenuItem>Reload</ContextMenuItem>
                <ContextMenuItem>Save as...</ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuContent>
          </ContextMenu>
        ),
      },
      {
        name: "Icons",
        description: "Context menu items with leading icons.",
        Demo: () => (
          <ContextMenu>
            <ContextMenuTrigger className="flex h-36 w-full max-w-sm items-center justify-center rounded-md border border-dashed text-sm">
              Right click — icons
            </ContextMenuTrigger>
            <ContextMenuContent grouped className="w-56">
              <ContextMenuGroup>
                <ContextMenuItem>
                  <UndoIcon /> Undo
                </ContextMenuItem>
                <ContextMenuItem>
                  <RedoIcon /> Redo
                </ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuGroup>
                <ContextMenuItem>
                  <ScissorsIcon /> Cut
                </ContextMenuItem>
                <ContextMenuItem>
                  <CopyIcon /> Copy
                </ContextMenuItem>
                <ContextMenuItem>
                  <ClipboardIcon /> Paste
                </ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuContent>
          </ContextMenu>
        ),
      },
      {
        name: "Checkboxes",
        description: "Context menu with togglable checkbox items.",
        Demo: function CtxCheckboxes() {
          const [showBookmarks, setShowBookmarks] = useState(true)
          const [showUrls, setShowUrls] = useState(false)
          return (
            <ContextMenu>
              <ContextMenuTrigger className="flex h-36 w-full max-w-sm items-center justify-center rounded-md border border-dashed text-sm">
                Right click — checkboxes
              </ContextMenuTrigger>
              <ContextMenuContent grouped className="w-56">
                <ContextMenuGroup>
                  <ContextMenuCheckboxItem
                    checked={showBookmarks}
                    onCheckedChange={setShowBookmarks}
                  >
                    Show bookmarks bar
                  </ContextMenuCheckboxItem>
                  <ContextMenuCheckboxItem
                    checked={showUrls}
                    onCheckedChange={setShowUrls}
                  >
                    Show full URLs
                  </ContextMenuCheckboxItem>
                </ContextMenuGroup>
              </ContextMenuContent>
            </ContextMenu>
          )
        },
      },
      {
        name: "Radio",
        description: "Context menu with a single-selection radio group.",
        Demo: function CtxRadio() {
          const [person, setPerson] = useState(persona.handle)
          return (
            <ContextMenu>
              <ContextMenuTrigger className="flex h-36 w-full max-w-sm items-center justify-center rounded-md border border-dashed text-sm">
                Right click — radio
              </ContextMenuTrigger>
              <ContextMenuContent grouped className="w-52">
                <ContextMenuGroup>
                  <ContextMenuLabel>People</ContextMenuLabel>
                  <ContextMenuRadioGroup
                    value={person}
                    onValueChange={setPerson}
                  >
                    <ContextMenuRadioItem value={persona.handle}>
                      {persona.name}
                    </ContextMenuRadioItem>
                    <ContextMenuRadioItem value={persona.manager.handle}>
                      {persona.manager.name}
                    </ContextMenuRadioItem>
                  </ContextMenuRadioGroup>
                </ContextMenuGroup>
              </ContextMenuContent>
            </ContextMenu>
          )
        },
      },
      {
        name: "Destructive",
        description: "Context menu with a destructive action.",
        Demo: function CtxDestructive() {
          const [status, setStatus] = useState("")
          return (
            <div className="flex w-full max-w-sm flex-col items-center gap-2">
              <ContextMenu>
                <ContextMenuTrigger className="flex h-36 w-full items-center justify-center rounded-md border border-dashed text-sm">
                  Right click — destructive
                </ContextMenuTrigger>
                <ContextMenuContent grouped className="w-52">
                  <ContextMenuGroup>
                    <ContextMenuItem>
                      <CopyIcon /> Duplicate
                    </ContextMenuItem>
                  </ContextMenuGroup>
                  <ContextMenuGroup>
                    <ContextMenuItem
                      variant="destructive"
                      onClick={() => setStatus("Deleted (simulated)")}
                    >
                      <Trash2Icon /> Delete
                    </ContextMenuItem>
                  </ContextMenuGroup>
                </ContextMenuContent>
              </ContextMenu>
              {status && (
                <p className="text-sm text-muted-foreground">{status}</p>
              )}
            </div>
          )
        },
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Menubar
  // ---------------------------------------------------------------------------
  {
    slug: "menubar",
    name: "Menubar",
    description: "A visually persistent menu common in desktop applications.",
    category: "Overlays",
    Demo: () => (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent grouped>
            <MenubarGroup>
              <MenubarItem>
                New tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>New window</MenubarItem>
            </MenubarGroup>
            <MenubarGroup>
              <MenubarItem>Print</MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent grouped>
            <MenubarGroup>
              <MenubarItem>Undo</MenubarItem>
              <MenubarItem>Redo</MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    ),
    code: `<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent grouped>
      <MenubarGroup>
        <MenubarItem>
          New tab <MenubarShortcut>⌘T</MenubarShortcut>
        </MenubarItem>
        <MenubarItem>New window</MenubarItem>
      </MenubarGroup>
      <MenubarGroup>
        <MenubarItem>Print</MenubarItem>
      </MenubarGroup>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`,
    examples: [
      {
        name: "Checkbox",
        description: "Menubar with togglable checkbox items.",
        layout: "wide" as const,
        Demo: function MenubarCheckbox() {
          const [statusBar, setStatusBar] = useState(true)
          const [activityBar, setActivityBar] = useState(false)
          return (
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>View</MenubarTrigger>
                <MenubarContent grouped>
                  <MenubarGroup>
                    <MenubarCheckboxItem
                      checked={statusBar}
                      onCheckedChange={setStatusBar}
                    >
                      Status bar
                    </MenubarCheckboxItem>
                    <MenubarCheckboxItem
                      checked={activityBar}
                      onCheckedChange={setActivityBar}
                    >
                      Activity bar
                    </MenubarCheckboxItem>
                    <MenubarCheckboxItem disabled>
                      Panel (disabled)
                    </MenubarCheckboxItem>
                  </MenubarGroup>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          )
        },
      },
      {
        name: "Radio",
        description: "Menubar with a radio selection group.",
        layout: "wide" as const,
        Demo: function MenubarRadio() {
          const [profile, setProfile] = useState("benoit")
          return (
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>Profiles</MenubarTrigger>
                <MenubarContent grouped>
                  <MenubarGroup>
                    <MenubarRadioGroup
                      value={profile}
                      onValueChange={setProfile}
                    >
                      <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
                      <MenubarRadioItem value="benoit">
                        Benoit
                      </MenubarRadioItem>
                      <MenubarRadioItem value="luis">Luis</MenubarRadioItem>
                    </MenubarRadioGroup>
                  </MenubarGroup>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          )
        },
      },
      {
        name: "Submenu",
        description: "Menubar with a nested submenu.",
        layout: "wide" as const,
        Demo: () => (
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent grouped>
                <MenubarGroup>
                  <MenubarItem>New file</MenubarItem>
                  <MenubarSub>
                    <MenubarSubTrigger>Share</MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem>Email link</MenubarItem>
                      <MenubarItem>Copy link</MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem>Notifications</MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarSeparator />
                  <MenubarItem>
                    Print <MenubarShortcut>⌘P</MenubarShortcut>
                  </MenubarItem>
                </MenubarGroup>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        ),
      },
      {
        name: "With icons",
        description: "Menubar items with leading icons.",
        layout: "wide" as const,
        Demo: () => (
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>Edit</MenubarTrigger>
              <MenubarContent grouped>
                <MenubarGroup>
                  <MenubarItem>
                    <UndoIcon /> Undo
                    <MenubarShortcut>⌘Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    <RedoIcon /> Redo
                    <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                  </MenubarItem>
                </MenubarGroup>
                <MenubarGroup>
                  <MenubarItem>
                    <ScissorsIcon /> Cut
                    <MenubarShortcut>⌘X</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    <CopyIcon /> Copy
                    <MenubarShortcut>⌘C</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    <ClipboardIcon /> Paste
                    <MenubarShortcut>⌘V</MenubarShortcut>
                  </MenubarItem>
                </MenubarGroup>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        ),
      },
    ],
  },
]
