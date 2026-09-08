import { cva } from "class-variance-authority"

// The check/radio box itself. Checkbox and RadioGroupItem are the control; the
// Questionnaire renders a passive copy beside its own input, so the look lives
// here rather than in each of the three.
export const controlIndicatorVariants = cva(
  "relative flex size-4 shrink-0 items-center justify-center border border-muted-foreground bg-control",
  {
    variants: {
      shape: {
        box: "rounded-sm",
        circle: "rounded-full",
      },
    },
    defaultVariants: {
      shape: "box",
    },
  }
)
