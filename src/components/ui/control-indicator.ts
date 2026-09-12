import { cva } from "class-variance-authority"

// The check/radio box itself. Checkbox and RadioGroupItem are the control; the
// Questionnaire renders a passive copy beside its own input, so the look lives
// here rather than in each of the three.
export const controlIndicatorVariants = cva(
  "relative flex size-(--control-size) shrink-0 items-center justify-center border border-transparent bg-transparent shadow-(--control-outline-shadow) transition-[background-color,border-color,color,box-shadow] duration-(--material-icon-fill-speed) ease-(--material-icon-fill-curve) motion-reduce:transition-none",
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
