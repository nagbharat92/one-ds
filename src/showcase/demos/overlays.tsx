import { useState } from "react"
import type { ComponentEntry } from "@/showcase/types"
import {
  CalculatorIcon,
  CalendarIcon,
  CloudIcon,
  CreditCardIcon,
  LogOutIcon,
  MailIcon,
  MessageSquareIcon,
  PlusCircleIcon,
  SettingsIcon,
  SmileIcon,
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
  Trash2Icon,
  CopyIcon,
  ScissorsIcon,
  ClipboardIcon,
  UndoIcon,
  RedoIcon,
  ImageIcon,
  PencilIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Kbd } from "@/components/ui/kbd"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Dialog,
  DialogClose,
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
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  HoverCard,
  HoverCardContent,
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
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
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
          <Button variant="outline">Delete account</Button>
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
    <Button variant="outline">Delete account</Button>
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
              <Button variant="outline">Small dialog</Button>
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
              <Button variant="outline">With media</Button>
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
              <Button variant="outline">Small + media</Button>
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
          <Button variant="outline">Edit profile</Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <Label htmlFor="demo-dialog-name">Name</Label>
            <Input id="demo-dialog-name" defaultValue="Pedro Duarte" />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
    code: `<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Edit profile</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>Make changes to your profile.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button type="submit">Save changes</Button>
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
              <Button variant="outline">Custom close</Button>
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
              <Button variant="outline">No close button</Button>
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
                  <Button variant="outline">Decline</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button>Accept</Button>
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
              <Button variant="outline">Sticky footer</Button>
            </DialogTrigger>
            <DialogContent className="showcase-dialog-scroll flex max-w-sm flex-col sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Release notes</DialogTitle>
                <DialogDescription>
                  What's new in this version.
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                {Array.from({ length: 12 }, (_, i) => (
                  <p key={i} className="text-sm text-muted-foreground">
                    Feature {i + 1}: Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                  </p>
                ))}
              </div>
              <DialogFooter className="border-t pt-4">
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
                <Button>Got it</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ),
      },
      {
        name: "Scrollable content",
        description: "Dialog body scrolls when content overflows.",
        layout: "viewport" as const,
        Demo: () => (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Scrollable content</Button>
            </DialogTrigger>
            <DialogContent className="showcase-dialog-scroll max-w-sm overflow-y-auto sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Long article</DialogTitle>
                <DialogDescription>
                  Scroll to read the full content.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                {Array.from({ length: 20 }, (_, i) => (
                  <p key={i} className="text-sm text-muted-foreground">
                    Paragraph {i + 1}: Ut enim ad minim veniam, quis nostrud
                    exercitation ullamco laboris nisi ut aliquip ex ea commodo.
                  </p>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        ),
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Sheet
  // ---------------------------------------------------------------------------
  {
    slug: "sheet",
    name: "Sheet",
    description: "Extends the dialog to slide in from the edge of the screen.",
    category: "Overlays",
    Demo: () => (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Open sheet</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-3 px-4">
            <Label htmlFor="demo-sheet-name">Name</Label>
            <Input id="demo-sheet-name" defaultValue="Pedro Duarte" />
          </div>
          <SheetFooter>
            <Button type="submit">Save changes</Button>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    ),
    code: `<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open sheet</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Edit profile</SheetTitle>
      <SheetDescription>Make changes to your profile here.</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>`,
    examples: [
      {
        name: "Sides",
        description: "Sheet can slide in from any edge.",
        layout: "viewport" as const,
        Demo: () => (
          <div className="flex flex-wrap gap-2">
            {(["top", "right", "bottom", "left"] as const).map((side) => (
              <Sheet key={side}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="capitalize">
                    {side}
                  </Button>
                </SheetTrigger>
                <SheetContent side={side}>
                  <SheetHeader>
                    <SheetTitle>{side} sheet</SheetTitle>
                    <SheetDescription>
                      This sheet slides in from the {side}.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="px-4">
                    <p className="text-sm text-muted-foreground">
                      Sheet content here.
                    </p>
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button variant="outline">Close</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            ))}
          </div>
        ),
      },
      {
        name: "No close button",
        description: "Sheet without the built-in close button.",
        layout: "viewport" as const,
        Demo: () => (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">No close button</Button>
            </SheetTrigger>
            <SheetContent showCloseButton={false}>
              <SheetHeader>
                <SheetTitle>Manual close only</SheetTitle>
                <SheetDescription>
                  This sheet has no X button. Use the button below.
                </SheetDescription>
              </SheetHeader>
              <SheetFooter>
                <SheetClose asChild>
                  <Button>Done</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
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
    description: "A drawer that slides up from the bottom of the screen.",
    category: "Overlays",
    Demo: () => (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">Open drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Move goal</DrawerTitle>
              <DrawerDescription>
                Set your daily activity goal.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    ),
    code: `<Drawer>
  <DrawerTrigger asChild>
    <Button variant="outline">Open drawer</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Move goal</DrawerTitle>
      <DrawerDescription>Set your daily activity goal.</DrawerDescription>
    </DrawerHeader>
    <DrawerFooter>
      <Button>Submit</Button>
      <DrawerClose asChild>
        <Button variant="outline">Cancel</Button>
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
              <Button variant="outline">Scrollable drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Changelog</DrawerTitle>
                  <DrawerDescription>
                    Recent updates to the project.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="max-h-60 space-y-3 overflow-y-auto px-4">
                  {Array.from({ length: 15 }, (_, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                      v1.{i + 1}.0 — Bug fixes and performance improvements.
                    </p>
                  ))}
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
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
                  <Button variant="outline" className="capitalize">
                    {dir}
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                      <DrawerTitle>{dir} drawer</DrawerTitle>
                      <DrawerDescription>
                        Opens from the {dir}.
                      </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                      <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
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
              <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                  <Button variant="outline">
                    Edit profile (responsive)
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                      <DrawerTitle>{title}</DrawerTitle>
                      <DrawerDescription>{desc}</DrawerDescription>
                    </DrawerHeader>
                    <div className="space-y-3 px-4">
                      <Label htmlFor="resp-drawer-name">Name</Label>
                      <Input
                        id="resp-drawer-name"
                        defaultValue="Pedro Duarte"
                      />
                    </div>
                    <DrawerFooter>
                      <Button onClick={() => setOpen(false)}>Save</Button>
                      <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
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
                <Button variant="outline">
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
                    defaultValue="Pedro Duarte"
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={() => setOpen(false)}>Save</Button>
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
          <Button variant="outline">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-3">
            <div className="space-y-1">
              <h4 className="font-medium leading-none">Dimensions</h4>
              <p className="text-sm text-muted-foreground">
                Set the dimensions for the layer.
              </p>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="demo-pop-width">Width</Label>
              <Input
                id="demo-pop-width"
                defaultValue="100%"
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    ),
    code: `<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open popover</Button>
  </PopoverTrigger>
  <PopoverContent className="w-80">Place content here.</PopoverContent>
</Popover>`,
    examples: [
      {
        name: "Align",
        description: "Popover aligned to start, center, or end of the trigger.",
        Demo: () => (
          <div className="flex gap-2">
            {(["start", "center", "end"] as const).map((a) => (
              <Popover key={a}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="capitalize">
                    {a}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align={a} className="w-60">
                  <p className="text-sm">
                    Aligned to <strong>{a}</strong>.
                  </p>
                </PopoverContent>
              </Popover>
            ))}
          </div>
        ),
      },
      {
        name: "With form",
        description: "Popover containing a form with inputs.",
        Demo: function PopoverForm() {
          const [saved, setSaved] = useState("")
          return (
            <div className="flex flex-col items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Set dimensions</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <form
                    className="grid gap-3"
                    onSubmit={(e) => {
                      e.preventDefault()
                      const fd = new FormData(e.currentTarget)
                      setSaved(
                        `Saved: ${fd.get("pop-w")} × ${fd.get("pop-h")}`,
                      )
                    }}
                  >
                    <div className="space-y-1">
                      <h4 className="font-medium leading-none">Dimensions</h4>
                      <p className="text-sm text-muted-foreground">
                        Set width and height.
                      </p>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-3">
                      <Label htmlFor="pop-form-w">Width</Label>
                      <Input
                        id="pop-form-w"
                        name="pop-w"
                        defaultValue="100%"
                        className="col-span-2 h-8"
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-3">
                      <Label htmlFor="pop-form-h">Height</Label>
                      <Input
                        id="pop-form-h"
                        name="pop-h"
                        defaultValue="50px"
                        className="col-span-2 h-8"
                      />
                    </div>
                    <Button type="submit" size="sm">
                      Save
                    </Button>
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
          <Button variant="link">@shadcn</Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@shadcn</h4>
            <p className="text-sm">
              The React framework — created and maintained by @vercel.
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    ),
    code: `<HoverCard>
  <HoverCardTrigger asChild>
    <Button variant="link">@shadcn</Button>
  </HoverCardTrigger>
  <HoverCardContent className="w-80">
    The React framework — created and maintained by @vercel.
  </HoverCardContent>
</HoverCard>`,
    examples: [
      {
        name: "Sides",
        description: "Hover card positioned on each side of the trigger.",
        Demo: () => (
          <div className="flex flex-wrap items-center gap-8 py-12">
            {(["top", "right", "bottom", "left"] as const).map((s) => (
              <HoverCard key={s} openDelay={100}>
                <HoverCardTrigger asChild>
                  <Button variant="link" className="capitalize">
                    {s}
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent side={s} className="w-60">
                  <p className="text-sm">
                    Card on the <strong>{s}</strong>.
                  </p>
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
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    ),
    code: `<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="outline">Hover me</Button>
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
                  <Button variant="outline" className="capitalize">
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
              <Button variant="outline" size="icon" aria-label="Bold">
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
                  variant="outline"
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
  // Dropdown Menu
  // ---------------------------------------------------------------------------
  {
    slug: "dropdown-menu",
    name: "Dropdown Menu",
    description: "Displays a menu of actions triggered by a button.",
    category: "Overlays",
    Demo: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Open menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    code: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56" align="start">
    <DropdownMenuLabel>My account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
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
              <Button variant="outline">Submenu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
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
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <PlusCircleIcon /> More...
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
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
              <Button variant="outline">Shortcuts</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuItem>
                New tab <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                New window <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Print <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
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
              <Button variant="outline">Icons</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
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
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOutIcon /> Log out
              </DropdownMenuItem>
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
                <Button variant="outline">Checkboxes</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                <DropdownMenuSeparator />
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
                <Button variant="outline">Checkbox icons</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Formatting</DropdownMenuLabel>
                <DropdownMenuSeparator />
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
                <Button variant="outline">Radio group</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Panel position</DropdownMenuLabel>
                <DropdownMenuSeparator />
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
                <Button variant="outline">Radio icons</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Alignment</DropdownMenuLabel>
                <DropdownMenuSeparator />
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
                  <Button variant="outline">Destructive</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuItem>
                    <PencilIcon /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CopyIcon /> Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setStatus("Deleted (simulated)")}
                  >
                    <Trash2Icon /> Delete
                  </DropdownMenuItem>
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
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="User"
                  />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium leading-none">shadcn</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    m@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <UserIcon /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SettingsIcon /> Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOutIcon /> Log out
              </DropdownMenuItem>
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
          const [person, setPerson] = useState("pedro")
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Complex menu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>My account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
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
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <PlusCircleIcon /> More...
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={bookmarks}
                  onCheckedChange={setBookmarks}
                >
                  Show bookmarks
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={urls}
                  onCheckedChange={setUrls}
                >
                  Show full URLs
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Team member</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={person}
                  onValueChange={setPerson}
                >
                  <DropdownMenuRadioItem value="pedro">
                    Pedro
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="colm">
                    Colm
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LifeBuoyIcon /> Support
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <CloudIcon /> API (coming soon)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <LogOutIcon /> Log out
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
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
        <ContextMenuContent className="w-52">
          <ContextMenuItem>Back</ContextMenuItem>
          <ContextMenuItem>Forward</ContextMenuItem>
          <ContextMenuItem>Reload</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Save as...</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    ),
    code: `<ContextMenu>
  <ContextMenuTrigger className="flex h-36 items-center justify-center rounded-md border border-dashed text-sm">
    Right click here
  </ContextMenuTrigger>
  <ContextMenuContent className="w-52">
    <ContextMenuItem>Back</ContextMenuItem>
    <ContextMenuItem>Reload</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem>Save as...</ContextMenuItem>
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
            <ContextMenuContent className="w-52">
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
            <ContextMenuContent className="w-52">
              <ContextMenuItem>
                Back <ContextMenuShortcut>⌘[</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem>
                Forward <ContextMenuShortcut>⌘]</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem>
                Reload <ContextMenuShortcut>⌘R</ContextMenuShortcut>
              </ContextMenuItem>
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
            <ContextMenuContent className="w-52">
              <ContextMenuLabel>Navigation</ContextMenuLabel>
              <ContextMenuGroup>
                <ContextMenuItem>Back</ContextMenuItem>
                <ContextMenuItem>Forward</ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuLabel>Actions</ContextMenuLabel>
              <ContextMenuGroup>
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
            <ContextMenuContent className="w-56">
              <ContextMenuItem>
                <UndoIcon /> Undo
              </ContextMenuItem>
              <ContextMenuItem>
                <RedoIcon /> Redo
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>
                <ScissorsIcon /> Cut
              </ContextMenuItem>
              <ContextMenuItem>
                <CopyIcon /> Copy
              </ContextMenuItem>
              <ContextMenuItem>
                <ClipboardIcon /> Paste
              </ContextMenuItem>
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
              <ContextMenuContent className="w-56">
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
              </ContextMenuContent>
            </ContextMenu>
          )
        },
      },
      {
        name: "Radio",
        description: "Context menu with a single-selection radio group.",
        Demo: function CtxRadio() {
          const [person, setPerson] = useState("pedro")
          return (
            <ContextMenu>
              <ContextMenuTrigger className="flex h-36 w-full max-w-sm items-center justify-center rounded-md border border-dashed text-sm">
                Right click — radio
              </ContextMenuTrigger>
              <ContextMenuContent className="w-52">
                <ContextMenuLabel>People</ContextMenuLabel>
                <ContextMenuSeparator />
                <ContextMenuRadioGroup
                  value={person}
                  onValueChange={setPerson}
                >
                  <ContextMenuRadioItem value="pedro">
                    Pedro Duarte
                  </ContextMenuRadioItem>
                  <ContextMenuRadioItem value="colm">
                    Colm Tuite
                  </ContextMenuRadioItem>
                </ContextMenuRadioGroup>
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
            <div className="flex flex-col items-center gap-2">
              <ContextMenu>
                <ContextMenuTrigger className="flex h-36 w-full max-w-sm items-center justify-center rounded-md border border-dashed text-sm">
                  Right click — destructive
                </ContextMenuTrigger>
                <ContextMenuContent className="w-52">
                  <ContextMenuItem>
                    <CopyIcon /> Duplicate
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem
                    variant="destructive"
                    onClick={() => setStatus("Deleted (simulated)")}
                  >
                    <Trash2Icon /> Delete
                  </ContextMenuItem>
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
          <MenubarContent>
            <MenubarItem>
              New tab <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>New window</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Print</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Undo</MenubarItem>
            <MenubarItem>Redo</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    ),
    code: `<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        New tab <MenubarShortcut>⌘T</MenubarShortcut>
      </MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Print</MenubarItem>
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
                <MenubarContent>
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
                <MenubarContent>
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
              <MenubarContent>
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
              <MenubarContent>
                <MenubarItem>
                  <UndoIcon /> Undo
                  <MenubarShortcut>⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  <RedoIcon /> Redo
                  <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
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
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        ),
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Command
  // ---------------------------------------------------------------------------
  {
    slug: "command",
    name: "Command",
    description: "A fast, composable command menu for React.",
    category: "Overlays",
    Demo: () => (
      <Command className="w-full max-w-sm rounded-lg border shadow-sm">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <CalendarIcon />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <SmileIcon />
              <span>Search emoji</span>
            </CommandItem>
            <CommandItem>
              <CalculatorIcon />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <UserIcon />
              <span>Profile</span>
            </CommandItem>
            <CommandItem>
              <CreditCardIcon />
              <span>Billing</span>
            </CommandItem>
            <CommandItem>
              <SettingsIcon />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    ),
    code: `<Command className="rounded-lg border shadow-sm">
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Calendar</CommandItem>
      <CommandItem>Search emoji</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`,
    examples: [
      {
        name: "Dialog",
        description: "Command palette in a dialog overlay.",
        layout: "viewport" as const,
        Demo: function CmdDialog() {
          const [open, setOpen] = useState(false)
          return (
            <>
              <Button variant="outline" onClick={() => setOpen(true)}>
                Open command palette
              </Button>
              <CommandDialog open={open} onOpenChange={setOpen}>
                <Command>
                  <CommandInput placeholder="Type a command or search..." />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                      <CommandItem onSelect={() => setOpen(false)}>
                        <CalendarIcon /> Calendar
                      </CommandItem>
                      <CommandItem onSelect={() => setOpen(false)}>
                        <SmileIcon /> Search emoji
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </CommandDialog>
            </>
          )
        },
      },
      {
        name: "Shortcuts",
        description: "Command items displaying keyboard shortcuts.",
        Demo: () => (
          <Command className="w-full max-w-sm rounded-lg border shadow-sm">
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Actions">
                <CommandItem>
                  <CalendarIcon /> Calendar
                  <CommandShortcut>⌘K</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <SmileIcon /> Search emoji
                  <CommandShortcut>⌘E</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <CalculatorIcon /> Calculator
                  <CommandShortcut>⌘C</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        ),
      },
      {
        name: "Dialog groups",
        description: "Command dialog with multiple separated groups.",
        layout: "viewport" as const,
        Demo: function CmdDialogGroups() {
          const [open, setOpen] = useState(false)
          return (
            <>
              <Button variant="outline" onClick={() => setOpen(true)}>
                Grouped command dialog
              </Button>
              <CommandDialog open={open} onOpenChange={setOpen}>
                <Command>
                  <CommandInput placeholder="Type a command or search..." />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                      <CommandItem onSelect={() => setOpen(false)}>
                        <CalendarIcon /> Calendar
                      </CommandItem>
                      <CommandItem onSelect={() => setOpen(false)}>
                        <SmileIcon /> Search emoji
                      </CommandItem>
                      <CommandItem onSelect={() => setOpen(false)}>
                        <CalculatorIcon /> Calculator
                      </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Settings">
                      <CommandItem onSelect={() => setOpen(false)}>
                        <UserIcon /> Profile
                        <CommandShortcut>⌘P</CommandShortcut>
                      </CommandItem>
                      <CommandItem onSelect={() => setOpen(false)}>
                        <CreditCardIcon /> Billing
                        <CommandShortcut>⌘B</CommandShortcut>
                      </CommandItem>
                      <CommandItem onSelect={() => setOpen(false)}>
                        <SettingsIcon /> Settings
                        <CommandShortcut>⌘S</CommandShortcut>
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </CommandDialog>
            </>
          )
        },
      },
      {
        name: "Scrollable",
        description:
          "Command list with enough items to demonstrate scrolling.",
        Demo: () => (
          <Command className="w-full max-w-sm rounded-lg border shadow-sm">
            <CommandInput placeholder="Search items..." />
            <CommandList className="max-h-48">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Items">
                {[
                  "Calendar",
                  "Calculator",
                  "Mail",
                  "Contacts",
                  "Notes",
                  "Reminders",
                  "Messages",
                  "Photos",
                  "Maps",
                  "Weather",
                  "Clock",
                  "Music",
                  "Podcasts",
                  "News",
                  "Books",
                ].map((item) => (
                  <CommandItem key={item}>
                    <span>{item}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        ),
      },
    ],
  },
]
